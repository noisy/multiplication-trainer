import { STORAGE_KEY } from './constants'

export interface StorageData {
  version: number
  lastUpdated: string
  stats: Record<string, QuestionStats>
}

export interface HistoryAttempt {
  type: 'correct' | 'wrong'
  time: number | null
  timestamp: number
}

export interface QuestionStats {
  times: number[]
  wrongCount: number
  asked: boolean
  history?: HistoryAttempt[] // New chronological history
}

/**
 * Save stats to localStorage
 */
export function saveToLocalStorage(stats: Record<string, QuestionStats>): void {
  try {
    const data: StorageData = {
      version: 1,
      lastUpdated: new Date().toISOString(),
      stats
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

/**
 * Load stats from localStorage
 */
export function loadFromLocalStorage(): Record<string, QuestionStats> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    
    const data: StorageData = JSON.parse(stored)
    
    // Version check for future migrations
    if (data.version !== 1) {
      console.warn('Unsupported storage version:', data.version)
      return null
    }
    
    return data.stats
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

/**
 * Clear all stored data
 */
export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}
