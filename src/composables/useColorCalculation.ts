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
    
    // If has wrong answers but no correct times, show red
    if (stats.wrongCount > 0 && stats.times.length === 0) {
      return PERFORMANCE_COLORS.RED
    }
    
    const averageTime = avgTime ?? calculateAverageTime(stats.times)
    if (averageTime === null) return PERFORMANCE_COLORS.GREY
    
    if (averageTime <= TIME_THRESHOLDS.EXCELLENT) return PERFORMANCE_COLORS.GREEN
    if (averageTime <= TIME_THRESHOLDS.GOOD) return PERFORMANCE_COLORS.LIME
    if (averageTime <= TIME_THRESHOLDS.OKAY) return PERFORMANCE_COLORS.YELLOW
    if (averageTime <= TIME_THRESHOLDS.SLOW) return PERFORMANCE_COLORS.ORANGE
    return PERFORMANCE_COLORS.RED
  }

  function formatTime(seconds: number): string {
    return Math.round(seconds).toString()
  }

  function getColorName(color: string): string {
    switch (color) {
      case PERFORMANCE_COLORS.GREY: return 'Not attempted'
      case PERFORMANCE_COLORS.GREEN: return 'Excellent (≤3s)'
      case PERFORMANCE_COLORS.LIME: return 'Good (≤5s)'
      case PERFORMANCE_COLORS.YELLOW: return 'Okay (≤10s)'
      case PERFORMANCE_COLORS.ORANGE: return 'Slow (≤15s)'
      case PERFORMANCE_COLORS.RED: return 'Very slow (>15s) or wrong'
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
