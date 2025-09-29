import { TIME_THRESHOLDS, PERFORMANCE_COLORS } from '../utils/constants'
import type { QuestionStats } from '../utils/storage'

export function useColorCalculation() {
  
  function calculateAverageTime(times: number[], maxCount: number = 5): number | null {
    if (times.length === 0) return null
    
    const recentTimes = times.slice(-maxCount)
    return recentTimes.reduce((sum, time) => sum + time, 0) / recentTimes.length
  }

  function getPerformanceColor(stats: QuestionStats, avgTime: number | null = null): string {
    if (!stats.asked) return PERFORMANCE_COLORS.GREY

    // Red is ONLY for wrong answers
    if (stats.wrongCount > 0 && stats.times.length === 0) {
      return PERFORMANCE_COLORS.RED
    }

    const averageTime = avgTime ?? calculateAverageTime(stats.times)
    if (averageTime === null) return PERFORMANCE_COLORS.GREY

    // Color based on correct answer times with new thresholds
    if (averageTime <= TIME_THRESHOLDS.EXCELLENT) return PERFORMANCE_COLORS.GREEN    // 0-3s - Excellent
    if (averageTime <= TIME_THRESHOLDS.GREAT) return PERFORMANCE_COLORS.EMERALD      // 3-6s - Great!
    if (averageTime <= TIME_THRESHOLDS.GOOD) return PERFORMANCE_COLORS.LIME          // 6-10s - Good
    if (averageTime <= TIME_THRESHOLDS.OK) return PERFORMANCE_COLORS.YELLOW          // 10-15s - Ok
    return PERFORMANCE_COLORS.ORANGE                                                  // 15+s - Slow
  }

  function formatTime(seconds: number): string {
    return Math.round(seconds).toString() + 's'
  }

  function getColorName(color: string): string {
    switch (color) {
      case PERFORMANCE_COLORS.GREY: return 'Not attempted'
      case PERFORMANCE_COLORS.GREEN: return 'Excellent (0-3s)'
      case PERFORMANCE_COLORS.EMERALD: return 'Great! (3-6s)'
      case PERFORMANCE_COLORS.LIME: return 'Good (6-10s)'
      case PERFORMANCE_COLORS.YELLOW: return 'Ok (10-15s)'
      case PERFORMANCE_COLORS.ORANGE: return 'Slow (15+s)'
      case PERFORMANCE_COLORS.RED: return 'Wrong answers'
      default: return 'Unknown'
    }
  }

  return {
    calculateAverageTime,
    getPerformanceColor,
    formatTime,
    getColorName
  }
}
