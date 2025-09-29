import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMultiplicationStore } from '../multiplicationStore'
import type { HistoryAttempt } from '../../utils/storage'

describe('multiplicationStore - Board Display Logic', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('Board display mode based on last answer', () => {
    it('should show "wrong" mode when last answer was incorrect', () => {
      const store = useMultiplicationStore()

      // Simulate question with last answer being wrong
      const history: HistoryAttempt[] = [
        { type: 'correct', time: 5.0, timestamp: 1000 },
        { type: 'correct', time: 3.0, timestamp: 2000 },
        { type: 'wrong', time: null, timestamp: 3000 }
      ]

      // Manually set the stats to simulate the scenario
      store.stats['2x3'] = {
        times: [5.0, 3.0],
        wrongCount: 1,
        asked: true,
        history
      }

      const questions = store.getAllQuestionsWithStats
      const question2x3 = questions.find(q => q.n === 2 && q.m === 3)

      expect(question2x3?.displayMode).toBe('wrong')
      expect(question2x3?.avgTime).toBeNull()
    })

    it('should show "time" mode with average from last 5 when last answer was correct', () => {
      const store = useMultiplicationStore()

      // Simulate question with last answer being correct
      const history: HistoryAttempt[] = [
        { type: 'wrong', time: null, timestamp: 1000 },
        { type: 'correct', time: 8.0, timestamp: 2000 },
        { type: 'correct', time: 4.0, timestamp: 3000 },
        { type: 'correct', time: 6.0, timestamp: 4000 }
      ]

      store.stats['3x4'] = {
        times: [8.0, 4.0, 6.0],
        wrongCount: 1,
        asked: true,
        history
      }

      const questions = store.getAllQuestionsWithStats
      const question3x4 = questions.find(q => q.n === 3 && q.m === 4)

      expect(question3x4?.displayMode).toBe('time')
      // Average of last 5 correct answers: [8.0, 4.0, 6.0] = 6.0
      expect(question3x4?.avgTime).toBe(6.0)
    })

    it('should show "time" mode with null avgTime when last answer correct but no correct in last 5', () => {
      const store = useMultiplicationStore()

      // Simulate question where last answer is correct but it's the only correct in last 5
      const history: HistoryAttempt[] = [
        { type: 'correct', time: 10.0, timestamp: 1000 }, // This will be ignored (older than last 5)
        { type: 'wrong', time: null, timestamp: 2000 },
        { type: 'wrong', time: null, timestamp: 3000 },
        { type: 'wrong', time: null, timestamp: 4000 },
        { type: 'wrong', time: null, timestamp: 5000 },
        { type: 'correct', time: 5.0, timestamp: 6000 }
      ]

      store.stats['5x6'] = {
        times: [10.0, 5.0],
        wrongCount: 4,
        asked: true,
        history
      }

      const questions = store.getAllQuestionsWithStats
      const question5x6 = questions.find(q => q.n === 5 && q.m === 6)

      expect(question5x6?.displayMode).toBe('time')
      // Only one correct answer in last 5: [5.0] = 5.0
      expect(question5x6?.avgTime).toBe(5.0)
    })

    it('should use old logic (all times average) when no history exists', () => {
      const store = useMultiplicationStore()

      // Simulate question with old data format (no history)
      store.stats['7x8'] = {
        times: [3.0, 7.0, 5.0],
        wrongCount: 0,
        asked: true,
        history: []
      }

      const questions = store.getAllQuestionsWithStats
      const question7x8 = questions.find(q => q.n === 7 && q.m === 8)

      expect(question7x8?.displayMode).toBe('time')
      // Average of all times: [3.0, 7.0, 5.0] = 5.0
      expect(question7x8?.avgTime).toBe(5.0)
    })

    it('should handle unattempted questions', () => {
      const store = useMultiplicationStore()

      const questions = store.getAllQuestionsWithStats
      const question9x10 = questions.find(q => q.n === 9 && q.m === 10)

      expect(question9x10?.displayMode).toBe('time')
      expect(question9x10?.avgTime).toBeNull()
      expect(question9x10?.asked).toBe(false)
    })

    it('should only consider last 5 attempts for average calculation', () => {
      const store = useMultiplicationStore()

      // Simulate question with more than 5 attempts
      const history: HistoryAttempt[] = [
        { type: 'correct', time: 10.0, timestamp: 1000 }, // Should be ignored
        { type: 'correct', time: 12.0, timestamp: 2000 }, // Should be ignored
        { type: 'correct', time: 2.0, timestamp: 3000 },  // Last 5 starts here
        { type: 'wrong', time: null, timestamp: 4000 },
        { type: 'correct', time: 4.0, timestamp: 5000 },
        { type: 'correct', time: 6.0, timestamp: 6000 },
        { type: 'correct', time: 8.0, timestamp: 7000 }   // Last answer (correct)
      ]

      store.stats['11x12'] = {
        times: [10.0, 12.0, 2.0, 4.0, 6.0, 8.0],
        wrongCount: 1,
        asked: true,
        history
      }

      const questions = store.getAllQuestionsWithStats
      const question11x12 = questions.find(q => q.n === 11 && q.m === 12)

      expect(question11x12?.displayMode).toBe('time')
      // Average of last 5 correct answers: [2.0, 4.0, 6.0, 8.0] = 5.0
      expect(question11x12?.avgTime).toBe(5.0)
    })
  })
})
