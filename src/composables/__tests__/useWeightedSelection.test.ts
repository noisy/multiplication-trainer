import { describe, it, expect, vi } from 'vitest'
import { useWeightedSelection } from '../useWeightedSelection'
import type { WeightedQuestion } from '../useWeightedSelection'
import type { QuestionStats } from '../../utils/storage'

describe('useWeightedSelection', () => {
  const { calculateWeight, selectWeightedQuestion, generateLessonQuestions } = useWeightedSelection()

  describe('calculateWeight', () => {
    it('should return base weight for attempted question with good performance', () => {
      const stats: QuestionStats = { times: [2.0, 2.5, 3.0], wrongCount: 0, asked: true }
      expect(calculateWeight(stats)).toBe(1) // Base weight only
    })

    it('should add weight for unattempted questions', () => {
      const stats: QuestionStats = { times: [], wrongCount: 0, asked: false }
      expect(calculateWeight(stats)).toBe(4) // Base (1) + Not asked (3)
    })

    it('should add weight for wrong answers', () => {
      const stats: QuestionStats = { times: [3.0], wrongCount: 2, asked: true }
      expect(calculateWeight(stats)).toBe(5) // Base (1) + Wrong answers (2*2)
    })

    it('should add weight for slow answers', () => {
      const stats: QuestionStats = { times: [6.0, 7.0], wrongCount: 0, asked: true }
      expect(calculateWeight(stats)).toBe(2) // Base (1) + Okay speed (1)
    })

    it('should add weight for very slow answers', () => {
      const stats: QuestionStats = { times: [16.0, 18.0], wrongCount: 0, asked: true }
      expect(calculateWeight(stats)).toBe(4) // Base (1) + Very slow (3)
    })

    it('should combine multiple weight factors', () => {
      const stats: QuestionStats = { times: [12.0], wrongCount: 1, asked: true }
      // Base (1) + Wrong answer (2) + Slow (2) = 5
      expect(calculateWeight(stats)).toBe(5)
    })

    it('should use provided avgTime instead of calculating', () => {
      const stats: QuestionStats = { times: [10.0], wrongCount: 0, asked: true }
      expect(calculateWeight(stats, 2.0)).toBe(1) // Should be excellent, base weight only
    })
  })

  describe('selectWeightedQuestion', () => {
    it('should throw error for empty questions array', () => {
      expect(() => selectWeightedQuestion([])).toThrow('No questions available for selection')
    })

    it('should return the only question when array has one item', () => {
      const questions: WeightedQuestion[] = [{ n: 2, m: 3, weight: 5 }]
      expect(selectWeightedQuestion(questions)).toEqual({ n: 2, m: 3, weight: 5 })
    })

    it('should select randomly when all weights are 0', () => {
      const questions: WeightedQuestion[] = [
        { n: 2, m: 3, weight: 0 },
        { n: 4, m: 5, weight: 0 }
      ]
      
      // Mock Math.random to return 0.5 (should select second question)
      vi.spyOn(Math, 'random').mockReturnValue(0.5)
      
      const result = selectWeightedQuestion(questions)
      expect([questions[0], questions[1]]).toContain(result)
      
      vi.restoreAllMocks()
    })

    it('should select question based on weights', () => {
      const questions: WeightedQuestion[] = [
        { n: 2, m: 3, weight: 1 },
        { n: 4, m: 5, weight: 9 } // Much higher weight
      ]
      
      // Mock Math.random to return 0.9 (should select second question)
      vi.spyOn(Math, 'random').mockReturnValue(0.9)
      
      const result = selectWeightedQuestion(questions)
      expect(result).toEqual({ n: 4, m: 5, weight: 9 })
      
      vi.restoreAllMocks()
    })

    it('should return fallback question when random selection fails', () => {
      const questions: WeightedQuestion[] = [
        { n: 2, m: 3, weight: 1 },
        { n: 4, m: 5, weight: 1 }
      ]
      
      // Mock Math.random to return 1.0 (edge case)
      vi.spyOn(Math, 'random').mockReturnValue(1.0)
      
      const result = selectWeightedQuestion(questions)
      expect(result).toEqual(questions[questions.length - 1])
      
      vi.restoreAllMocks()
    })
  })

  describe('generateLessonQuestions', () => {
    it('should generate correct number of questions', () => {
      const questions: WeightedQuestion[] = [
        { n: 2, m: 3, weight: 1 },
        { n: 4, m: 5, weight: 1 },
        { n: 6, m: 7, weight: 1 }
      ]
      
      const result = generateLessonQuestions(questions, 5)
      expect(result).toHaveLength(5)
    })

    it('should return questions from the provided array', () => {
      const questions: WeightedQuestion[] = [
        { n: 2, m: 3, weight: 1 },
        { n: 4, m: 5, weight: 1 }
      ]
      
      const result = generateLessonQuestions(questions, 3)
      
      result.forEach(question => {
        expect(questions.some(q => q.n === question.n && q.m === question.m)).toBe(true)
      })
    })

    it('should handle zero count', () => {
      const questions: WeightedQuestion[] = [{ n: 2, m: 3, weight: 1 }]
      const result = generateLessonQuestions(questions, 0)
      expect(result).toHaveLength(0)
    })
  })
})
