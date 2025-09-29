import { describe, it, expect } from 'vitest'
import { 
  TIME_THRESHOLDS, 
  PERFORMANCE_COLORS, 
  SELECTION_WEIGHTS,
  MULTIPLICATION_RANGE,
  MAX_STORED_TIMES,
  LESSON_CONFIG
} from '../constants'

describe('constants', () => {
  it('should have correct time thresholds', () => {
    expect(TIME_THRESHOLDS.EXCELLENT).toBe(3)
    expect(TIME_THRESHOLDS.GREAT).toBe(6)
    expect(TIME_THRESHOLDS.GOOD).toBe(10)
    expect(TIME_THRESHOLDS.OK).toBe(15)
    expect(TIME_THRESHOLDS.SLOW).toBe(Infinity)
  })

  it('should have all performance colors defined', () => {
    expect(PERFORMANCE_COLORS.GREY).toBe('#9ca3af')
    expect(PERFORMANCE_COLORS.GREEN).toBe('#54c73a')
    expect(PERFORMANCE_COLORS.EMERALD).toBe('#77c71a')
    expect(PERFORMANCE_COLORS.LIME).toBe('#abd216')
    expect(PERFORMANCE_COLORS.YELLOW).toBe('#ccce0f')
    expect(PERFORMANCE_COLORS.ORANGE).toBe('#f0f200')
    expect(PERFORMANCE_COLORS.RED).toBe('#ef4444')
  })

  it('should have correct selection weights', () => {
    expect(SELECTION_WEIGHTS.BASE).toBe(1)
    expect(SELECTION_WEIGHTS.NOT_ASKED).toBe(3)
    expect(SELECTION_WEIGHTS.WRONG_ANSWER).toBe(2)
    expect(SELECTION_WEIGHTS.SLOW).toBe(3)
    expect(SELECTION_WEIGHTS.OK).toBe(2)
    expect(SELECTION_WEIGHTS.GOOD).toBe(1)
  })

  it('should have correct multiplication range', () => {
    expect(MULTIPLICATION_RANGE.MIN).toBe(2)
    expect(MULTIPLICATION_RANGE.MAX).toBe(12)
  })

  it('should have correct configuration values', () => {
    expect(MAX_STORED_TIMES).toBe(5)
    expect(LESSON_CONFIG.QUESTIONS_COUNT).toBe(10)
  })
})
