import { SELECTION_WEIGHTS, TIME_THRESHOLDS } from '../utils/constants'
import type { QuestionStats } from '../utils/storage'
import { useColorCalculation } from './useColorCalculation'

export interface WeightedQuestion {
  n: number
  m: number
  weight: number
}

export function useWeightedSelection() {
  const { calculateAverageTime } = useColorCalculation()

  function calculateWeight(stats: QuestionStats, avgTime: number | null = null): number {
    let weight = SELECTION_WEIGHTS.BASE
    
    // Not yet asked
    if (!stats.asked) {
      weight += SELECTION_WEIGHTS.NOT_ASKED
    }
    
    // Wrong answers
    weight += stats.wrongCount * SELECTION_WEIGHTS.WRONG_ANSWER
    
    // Slow answers
    const averageTime = avgTime ?? calculateAverageTime(stats.times)
    if (averageTime !== null) {
      if (averageTime > TIME_THRESHOLDS.SLOW) {
        weight += SELECTION_WEIGHTS.VERY_SLOW
      } else if (averageTime > TIME_THRESHOLDS.OKAY) {
        weight += SELECTION_WEIGHTS.SLOW
      } else if (averageTime > TIME_THRESHOLDS.GOOD) {
        weight += SELECTION_WEIGHTS.OKAY
      }
    }
    
    return weight
  }

  function selectWeightedQuestion(questions: WeightedQuestion[]): WeightedQuestion {
    if (questions.length === 0) {
      throw new Error('No questions available for selection')
    }

    const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0)
    
    if (totalWeight === 0) {
      // If all weights are 0, select randomly
      return questions[Math.floor(Math.random() * questions.length)]
    }
    
    let random = Math.random() * totalWeight
    
    for (const question of questions) {
      random -= question.weight
      if (random <= 0) {
        return question
      }
    }
    
    // Fallback to last question
    return questions[questions.length - 1]
  }

  function generateLessonQuestions(
    allQuestions: WeightedQuestion[], 
    count: number
  ): WeightedQuestion[] {
    const selected: WeightedQuestion[] = []
    
    for (let i = 0; i < count; i++) {
      const question = selectWeightedQuestion(allQuestions)
      selected.push(question)
    }
    
    return selected
  }

  return {
    calculateWeight,
    selectWeightedQuestion,
    generateLessonQuestions
  }
}
