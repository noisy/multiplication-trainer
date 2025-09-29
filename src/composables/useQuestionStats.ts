import type { HistoryAttempt } from '../utils/storage'

export function useQuestionStats() {
  
  /**
   * Calculate average time from the last 5 attempts, considering only correct answers.
   * Returns null if there are no correct answers in the last 5 attempts.
   */
  function calculateAverageFromLast5(history: HistoryAttempt[]): number | null {
    if (!history || history.length === 0) return null

    // Get last 5 attempts
    const last5Attempts = history.slice(-5)
    
    // Filter only correct answers from last 5 attempts
    const correctTimes = last5Attempts
      .filter(attempt => attempt.type === 'correct' && attempt.time !== null)
      .map(attempt => attempt.time!)

    // If no correct answers in last 5 attempts, return null (don't show average)
    if (correctTimes.length === 0) return null

    // Calculate average from correct answers in last 5 attempts
    return correctTimes.reduce((sum, time) => sum + time, 0) / correctTimes.length
  }

  return {
    calculateAverageFromLast5
  }
}
