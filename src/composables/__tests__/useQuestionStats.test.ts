import { describe, it, expect } from 'vitest'
import { useQuestionStats } from '../useQuestionStats'
import type { HistoryAttempt } from '../../utils/storage'

describe('useQuestionStats', () => {
  const { calculateAverageFromLast5 } = useQuestionStats()

  describe('calculateAverageFromLast5', () => {
    it('should return null for empty history', () => {
      expect(calculateAverageFromLast5([])).toBeNull()
    })

    it('should return null for null/undefined history', () => {
      expect(calculateAverageFromLast5(null as any)).toBeNull()
      expect(calculateAverageFromLast5(undefined as any)).toBeNull()
    })

    it('should return null when last 5 attempts have no correct answers', () => {
      const history: HistoryAttempt[] = [
        { type: 'wrong', time: null, timestamp: 1000 },
        { type: 'wrong', time: null, timestamp: 2000 },
        { type: 'wrong', time: null, timestamp: 3000 },
        { type: 'wrong', time: null, timestamp: 4000 },
        { type: 'wrong', time: null, timestamp: 5000 }
      ]
      expect(calculateAverageFromLast5(history)).toBeNull()
    })

    it('should calculate average from correct answers in last 5 attempts', () => {
      const history: HistoryAttempt[] = [
        { type: 'correct', time: 5.0, timestamp: 1000 },
        { type: 'wrong', time: null, timestamp: 2000 },
        { type: 'correct', time: 3.0, timestamp: 3000 },
        { type: 'correct', time: 7.0, timestamp: 4000 }
      ]
      // Average of [5.0, 3.0, 7.0] = 15.0 / 3 = 5.0
      expect(calculateAverageFromLast5(history)).toBe(5.0)
    })

    it('should only consider last 5 attempts when history is longer', () => {
      const history: HistoryAttempt[] = [
        { type: 'correct', time: 10.0, timestamp: 1000 }, // This should be ignored (older than last 5)
        { type: 'correct', time: 9.0, timestamp: 2000 },  // This should be ignored (older than last 5)
        { type: 'correct', time: 2.0, timestamp: 3000 },  // Last 5 starts here
        { type: 'wrong', time: null, timestamp: 4000 },
        { type: 'correct', time: 4.0, timestamp: 5000 },
        { type: 'correct', time: 6.0, timestamp: 6000 },
        { type: 'wrong', time: null, timestamp: 7000 }
      ]
      // Last 5: [2.0, wrong, 4.0, 6.0, wrong]
      // Correct times from last 5: [2.0, 4.0, 6.0]
      // Average: (2.0 + 4.0 + 6.0) / 3 = 4.0
      expect(calculateAverageFromLast5(history)).toBe(4.0)
    })

    it('should handle single correct answer in last 5', () => {
      const history: HistoryAttempt[] = [
        { type: 'wrong', time: null, timestamp: 1000 },
        { type: 'wrong', time: null, timestamp: 2000 },
        { type: 'correct', time: 8.5, timestamp: 3000 },
        { type: 'wrong', time: null, timestamp: 4000 }
      ]
      expect(calculateAverageFromLast5(history)).toBe(8.5)
    })

    it('should ignore correct answers with null time', () => {
      const history: HistoryAttempt[] = [
        { type: 'correct', time: null, timestamp: 1000 }, // Invalid correct answer
        { type: 'correct', time: 5.0, timestamp: 2000 },
        { type: 'correct', time: 3.0, timestamp: 3000 }
      ]
      // Should only consider valid correct answers: [5.0, 3.0]
      // Average: (5.0 + 3.0) / 2 = 4.0
      expect(calculateAverageFromLast5(history)).toBe(4.0)
    })

    it('should handle exactly 5 attempts', () => {
      const history: HistoryAttempt[] = [
        { type: 'correct', time: 1.0, timestamp: 1000 },
        { type: 'correct', time: 2.0, timestamp: 2000 },
        { type: 'wrong', time: null, timestamp: 3000 },
        { type: 'correct', time: 3.0, timestamp: 4000 },
        { type: 'correct', time: 4.0, timestamp: 5000 }
      ]
      // All 5 attempts, correct times: [1.0, 2.0, 3.0, 4.0]
      // Average: (1.0 + 2.0 + 3.0 + 4.0) / 4 = 2.5
      expect(calculateAverageFromLast5(history)).toBe(2.5)
    })

    it('should handle less than 5 attempts', () => {
      const history: HistoryAttempt[] = [
        { type: 'correct', time: 6.0, timestamp: 1000 },
        { type: 'correct', time: 8.0, timestamp: 2000 }
      ]
      // Average: (6.0 + 8.0) / 2 = 7.0
      expect(calculateAverageFromLast5(history)).toBe(7.0)
    })

    it('should return null when last 5 attempts are all wrong but history has older correct answers', () => {
      const history: HistoryAttempt[] = [
        { type: 'correct', time: 5.0, timestamp: 1000 }, // Older than last 5
        { type: 'correct', time: 3.0, timestamp: 2000 }, // Older than last 5
        { type: 'wrong', time: null, timestamp: 3000 },  // Last 5 starts here
        { type: 'wrong', time: null, timestamp: 4000 },
        { type: 'wrong', time: null, timestamp: 5000 },
        { type: 'wrong', time: null, timestamp: 6000 },
        { type: 'wrong', time: null, timestamp: 7000 }
      ]
      // Last 5 are all wrong, should return null even though there are older correct answers
      expect(calculateAverageFromLast5(history)).toBeNull()
    })
  })
})
