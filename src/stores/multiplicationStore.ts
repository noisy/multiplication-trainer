import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  MULTIPLICATION_RANGE, 
  TIME_THRESHOLDS, 
  PERFORMANCE_COLORS, 
  SELECTION_WEIGHTS,
  MAX_STORED_TIMES,
  LESSON_CONFIG,
  TIMER_INTERVAL
} from '../utils/constants'
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  type QuestionStats,
  type HistoryAttempt
} from '../utils/storage'

export interface Question {
  n: number
  m: number
  answer: number
}

export interface QuestionWithStats extends Question {
  times: number[]
  wrongCount: number
  asked: boolean
  avgTime: number | null
  color: string
  weight: number
  displayMode: 'time' | 'wrong'
}

export interface LessonProgress {
  current: number
  total: number
}

export const useMultiplicationStore = defineStore('multiplication', () => {
  // State
  const currentView = ref<'board' | 'question'>('board')
  const stats = ref<Record<string, QuestionStats>>({})
  const currentQuestion = ref<Question | null>(null)
  const lessonQuestions = ref<Question[]>([])
  const lessonIndex = ref(0)
  const elapsedTime = ref(0)
  const timerInterval = ref<number | null>(null)
  const questionStartTime = ref<number | null>(null)

  // Getters
  const isInLesson = computed(() => lessonQuestions.value.length > 0)
  
  const getLessonProgress = computed((): LessonProgress | null => {
    if (!isInLesson.value) return null
    return {
      current: lessonIndex.value + 1,
      total: lessonQuestions.value.length
    }
  })

  // Helper functions
  function formatQuestionKey(n: number, m: number): string {
    return `${n}x${m}`
  }

  function getQuestionStats(n: number, m: number): QuestionStats {
    const key = formatQuestionKey(n, m)
    return stats.value[key] || { times: [], wrongCount: 0, asked: false, history: [] }
  }

  function getAverageTime(n: number, m: number): number | null {
    const questionStats = getQuestionStats(n, m)
    if (questionStats.times.length === 0) return null

    const recentTimes = questionStats.times.slice(-MAX_STORED_TIMES)
    return recentTimes.reduce((sum, time) => sum + time, 0) / recentTimes.length
  }

  function getLastAnswerType(n: number, m: number): 'correct' | 'wrong' | null {
    const questionStats = getQuestionStats(n, m)
    if (!questionStats.history || questionStats.history.length === 0) return null

    const lastAttempt = questionStats.history[questionStats.history.length - 1]
    return lastAttempt.type
  }

  function getAverageFromLast5(n: number, m: number): number | null {
    const questionStats = getQuestionStats(n, m)
    if (!questionStats.history || questionStats.history.length === 0) return null

    // Get last 5 attempts
    const last5Attempts = questionStats.history.slice(-5)

    // Filter only correct answers from last 5 attempts
    const correctTimes = last5Attempts
      .filter(attempt => attempt.type === 'correct' && attempt.time !== null)
      .map(attempt => attempt.time!)

    // If no correct answers in last 5 attempts, return null
    if (correctTimes.length === 0) return null

    // Calculate average from correct answers in last 5 attempts
    return correctTimes.reduce((sum, time) => sum + time, 0) / correctTimes.length
  }

  function getColor(n: number, m: number): string {
    const questionStats = getQuestionStats(n, m)

    if (!questionStats.asked) return PERFORMANCE_COLORS.GREY

    // If has wrong answers but no correct times, show red
    if (questionStats.wrongCount > 0 && questionStats.times.length === 0) {
      return PERFORMANCE_COLORS.RED
    }

    const avgTime = getAverageTime(n, m)
    if (avgTime === null) return PERFORMANCE_COLORS.GREY

    // Color based on new thresholds
    if (avgTime <= TIME_THRESHOLDS.EXCELLENT) return PERFORMANCE_COLORS.GREEN    // 0-3s - Excellent
    if (avgTime <= TIME_THRESHOLDS.GREAT) return PERFORMANCE_COLORS.EMERALD      // 3-6s - Great!
    if (avgTime <= TIME_THRESHOLDS.GOOD) return PERFORMANCE_COLORS.LIME          // 6-10s - Good
    if (avgTime <= TIME_THRESHOLDS.OK) return PERFORMANCE_COLORS.YELLOW          // 10-15s - Ok
    return PERFORMANCE_COLORS.ORANGE                                              // 15+s - Slow
  }

  function getSelectionWeight(n: number, m: number): number {
    const questionStats = getQuestionStats(n, m)
    let weight = SELECTION_WEIGHTS.BASE

    // Not yet asked
    if (!questionStats.asked) {
      weight += SELECTION_WEIGHTS.NOT_ASKED
    }

    // Wrong answers
    weight += questionStats.wrongCount * SELECTION_WEIGHTS.WRONG_ANSWER

    // Slow answers based on new thresholds
    const avgTime = getAverageTime(n, m)
    if (avgTime !== null) {
      if (avgTime > TIME_THRESHOLDS.OK) {        // >15s - Slow
        weight += SELECTION_WEIGHTS.SLOW
      } else if (avgTime > TIME_THRESHOLDS.GOOD) { // >10s - Ok
        weight += SELECTION_WEIGHTS.OK
      } else if (avgTime > TIME_THRESHOLDS.GREAT) { // >6s - Good
        weight += SELECTION_WEIGHTS.GOOD
      }
    }

    return weight
  }

  const getAllQuestionsWithStats = computed((): QuestionWithStats[] => {
    const questions: QuestionWithStats[] = []

    for (let n = MULTIPLICATION_RANGE.MIN; n <= MULTIPLICATION_RANGE.MAX; n++) {
      for (let m = MULTIPLICATION_RANGE.MIN; m <= MULTIPLICATION_RANGE.MAX; m++) {
        const questionStats = getQuestionStats(n, m)
        const lastAnswerType = getLastAnswerType(n, m)

        // Determine what to display based on last answer
        let avgTime: number | null = null
        let displayMode: 'time' | 'wrong' = 'time'

        if (lastAnswerType === 'wrong') {
          // Last answer was wrong - show red X
          displayMode = 'wrong'
          avgTime = null
        } else if (lastAnswerType === 'correct') {
          // Last answer was correct - show average from last 5
          displayMode = 'time'
          avgTime = getAverageFromLast5(n, m)
        } else {
          // No history - use old logic (average of all times)
          displayMode = 'time'
          avgTime = getAverageTime(n, m)
        }

        questions.push({
          n,
          m,
          answer: n * m,
          times: questionStats.times,
          wrongCount: questionStats.wrongCount,
          asked: questionStats.asked,
          avgTime,
          color: getColor(n, m),
          weight: getSelectionWeight(n, m),
          displayMode
        })
      }
    }

    return questions
  })

  // Actions
  function initializeStats(): void {
    // Initialize empty stats for all 121 questions if not already present
    for (let n = MULTIPLICATION_RANGE.MIN; n <= MULTIPLICATION_RANGE.MAX; n++) {
      for (let m = MULTIPLICATION_RANGE.MIN; m <= MULTIPLICATION_RANGE.MAX; m++) {
        const key = formatQuestionKey(n, m)
        if (!stats.value[key]) {
          stats.value[key] = { times: [], wrongCount: 0, asked: false, history: [] }
        }
      }
    }
  }

  function loadStats(): void {
    const loaded = loadFromLocalStorage()
    if (loaded) {
      stats.value = loaded
    }
    initializeStats()
  }

  function saveStats(): void {
    saveToLocalStorage(stats.value)
  }

  function startTimer(): void {
    questionStartTime.value = Date.now()
    elapsedTime.value = 0
    
    timerInterval.value = window.setInterval(() => {
      if (questionStartTime.value) {
        elapsedTime.value = (Date.now() - questionStartTime.value) / 1000
      }
    }, TIMER_INTERVAL)
  }

  function stopTimer(): number {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }

    const timeSpent = elapsedTime.value
    questionStartTime.value = null
    elapsedTime.value = 0

    return timeSpent
  }

  function selectWeightedQuestion(): Question {
    const allQuestions = getAllQuestionsWithStats.value
    const totalWeight = allQuestions.reduce((sum, q) => sum + q.weight, 0)

    let random = Math.random() * totalWeight

    for (const question of allQuestions) {
      random -= question.weight
      if (random <= 0) {
        return {
          n: question.n,
          m: question.m,
          answer: question.answer
        }
      }
    }

    // Fallback to first question
    return {
      n: MULTIPLICATION_RANGE.MIN,
      m: MULTIPLICATION_RANGE.MIN,
      answer: MULTIPLICATION_RANGE.MIN * MULTIPLICATION_RANGE.MIN
    }
  }

  function startQuestion(n: number, m: number): void {
    currentQuestion.value = {
      n,
      m,
      answer: n * m
    }
    currentView.value = 'question'
    startTimer()
  }

  function submitAnswer(correct: boolean): void {
    if (!currentQuestion.value) return

    const timeSpent = stopTimer()
    const { n, m } = currentQuestion.value
    const key = formatQuestionKey(n, m)

    // Initialize stats if not exists
    if (!stats.value[key]) {
      stats.value[key] = { times: [], wrongCount: 0, asked: false, history: [] }
    }

    // Mark as asked
    stats.value[key].asked = true

    // Ensure history array exists (for backward compatibility)
    if (!stats.value[key].history) {
      stats.value[key].history = []
    }

    // Add to chronological history
    const historyAttempt: HistoryAttempt = {
      type: correct ? 'correct' : 'wrong',
      time: correct ? timeSpent : null,
      timestamp: Date.now()
    }
    stats.value[key].history!.push(historyAttempt)

    // Keep only last 10 history entries to prevent unlimited growth
    if (stats.value[key].history!.length > 10) {
      stats.value[key].history = stats.value[key].history!.slice(-10)
    }

    if (correct) {
      // Add time to array, keep only last MAX_STORED_TIMES
      stats.value[key].times.push(timeSpent)
      if (stats.value[key].times.length > MAX_STORED_TIMES) {
        stats.value[key].times = stats.value[key].times.slice(-MAX_STORED_TIMES)
      }
    } else {
      // Increment wrong count
      stats.value[key].wrongCount++
    }

    // Save to localStorage
    saveStats()

    // Handle lesson flow or return to board
    if (isInLesson.value) {
      nextLessonQuestion()
    } else {
      navigateToBoard()
    }
  }

  function startLesson(): void {
    // Generate 10 weighted questions
    const questions: Question[] = []

    for (let i = 0; i < LESSON_CONFIG.QUESTIONS_COUNT; i++) {
      questions.push(selectWeightedQuestion())
    }

    lessonQuestions.value = questions
    lessonIndex.value = 0

    // Start first question
    const firstQuestion = questions[0]
    startQuestion(firstQuestion.n, firstQuestion.m)
  }

  function nextLessonQuestion(): void {
    lessonIndex.value++

    if (lessonIndex.value >= lessonQuestions.value.length) {
      // Lesson completed
      endLesson()
      navigateToBoard()
    } else {
      // Start next question
      const nextQuestion = lessonQuestions.value[lessonIndex.value]
      startQuestion(nextQuestion.n, nextQuestion.m)
    }
  }

  function endLesson(): void {
    lessonQuestions.value = []
    lessonIndex.value = 0
  }

  function navigateToBoard(): void {
    currentView.value = 'board'
    currentQuestion.value = null
    if (timerInterval.value) {
      stopTimer()
    }
  }

  function navigateToQuestion(): void {
    currentView.value = 'question'
  }

  return {
    // State
    currentView,
    stats,
    currentQuestion,
    lessonQuestions,
    lessonIndex,
    elapsedTime,

    // Getters
    isInLesson,
    getLessonProgress,
    getAllQuestionsWithStats,

    // Helper functions
    getQuestionStats,
    getAverageTime,
    getColor,
    getSelectionWeight,

    // Actions
    initializeStats,
    loadStats,
    saveStats,
    startTimer,
    stopTimer,
    selectWeightedQuestion,
    startQuestion,
    submitAnswer,
    startLesson,
    nextLessonQuestion,
    endLesson,
    navigateToBoard,
    navigateToQuestion
  }
})
