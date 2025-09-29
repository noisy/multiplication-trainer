import { describe, it, expect } from 'vitest'
import { useColorCalculation } from '../useColorCalculation'
import { PERFORMANCE_COLORS } from '../../utils/constants'
import type { QuestionStats } from '../../utils/storage'

describe('useColorCalculation', () => {
  const { calculateAverageTime, getPerformanceColor, formatTime, getColorName } = useColorCalculation()

  describe('calculateAverageTime', () => {
    it('should return null for empty times array', () => {
      expect(calculateAverageTime([])).toBeNull()
    })

    it('should calculate average of all times when less than maxCount', () => {
      const times = [2.0, 3.0, 4.0]
      expect(calculateAverageTime(times)).toBe(3.0)
    })

    it('should calculate average of last maxCount times', () => {
      const times = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]
      expect(calculateAverageTime(times, 5)).toBe(5.0) // Average of [3,4,5,6,7]
    })

    it('should handle single time', () => {
      const times = [2.5]
      expect(calculateAverageTime(times)).toBe(2.5)
    })
  })

  describe('getPerformanceColor', () => {
    it('should return grey for unattempted questions', () => {
      const stats: QuestionStats = { times: [], wrongCount: 0, asked: false, history: [] }
      expect(getPerformanceColor(stats)).toBe(PERFORMANCE_COLORS.GREY)
    })

    it('should return red for wrong answers with no correct times', () => {
      const stats: QuestionStats = { times: [], wrongCount: 2, asked: true, history: [] }
      expect(getPerformanceColor(stats)).toBe(PERFORMANCE_COLORS.RED)
    })

    it('should return green for excellent times (≤3s)', () => {
      const stats: QuestionStats = { times: [2.0, 2.5, 3.0], wrongCount: 0, asked: true, history: [] }
      expect(getPerformanceColor(stats)).toBe(PERFORMANCE_COLORS.GREEN)
    })

    it('should return lime for good times (≤5s)', () => {
      const stats: QuestionStats = { times: [4.0, 4.5, 5.0], wrongCount: 0, asked: true, history: [] }
      expect(getPerformanceColor(stats)).toBe(PERFORMANCE_COLORS.LIME)
    })

    it('should return yellow for okay times (≤10s)', () => {
      const stats: QuestionStats = { times: [8.0, 9.0, 10.0], wrongCount: 0, asked: true, history: [] }
      expect(getPerformanceColor(stats)).toBe(PERFORMANCE_COLORS.YELLOW)
    })

    it('should return orange for slow times (≤15s)', () => {
      const stats: QuestionStats = { times: [12.0, 13.0, 15.0], wrongCount: 0, asked: true, history: [] }
      expect(getPerformanceColor(stats)).toBe(PERFORMANCE_COLORS.ORANGE)
    })

    it('should return red for very slow times (>15s)', () => {
      const stats: QuestionStats = { times: [16.0, 18.0, 20.0], wrongCount: 0, asked: true, history: [] }
      expect(getPerformanceColor(stats)).toBe(PERFORMANCE_COLORS.RED)
    })

    it('should use provided avgTime instead of calculating', () => {
      const stats: QuestionStats = { times: [10.0], wrongCount: 0, asked: true, history: [] }
      expect(getPerformanceColor(stats, 2.0)).toBe(PERFORMANCE_COLORS.GREEN)
    })
  })

  describe('formatTime', () => {
    it('should round seconds to whole numbers and add "s" suffix', () => {
      expect(formatTime(2.3)).toBe('2s')
      expect(formatTime(2.7)).toBe('3s')
      expect(formatTime(5.0)).toBe('5s')
    })
  })

  describe('getColorName', () => {
    it('should return correct names for all colors', () => {
      expect(getColorName(PERFORMANCE_COLORS.GREY)).toBe('Not attempted')
      expect(getColorName(PERFORMANCE_COLORS.GREEN)).toBe('Excellent (≤3s)')
      expect(getColorName(PERFORMANCE_COLORS.LIME)).toBe('Good (≤5s)')
      expect(getColorName(PERFORMANCE_COLORS.YELLOW)).toBe('Okay (≤10s)')
      expect(getColorName(PERFORMANCE_COLORS.ORANGE)).toBe('Slow (≤15s)')
      expect(getColorName(PERFORMANCE_COLORS.RED)).toBe('Very slow (>15s) or wrong')
      expect(getColorName('#unknown')).toBe('Unknown')
    })
  })
})
