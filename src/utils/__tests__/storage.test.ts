import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '../storage'
import type { QuestionStats } from '../storage'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

vi.stubGlobal('localStorage', localStorageMock)

describe('storage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveToLocalStorage', () => {
    it('should save stats to localStorage with correct format', () => {
      const stats: Record<string, QuestionStats> = {
        '2x2': { times: [3.2, 2.8], wrongCount: 1, asked: true, history: [] },
        '3x4': { times: [], wrongCount: 0, asked: false, history: [] }
      }

      saveToLocalStorage(stats)

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'multiplication-stats',
        expect.stringContaining('"version":1')
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'multiplication-stats',
        expect.stringContaining('"lastUpdated"')
      )
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'multiplication-stats',
        expect.stringContaining('"stats"')
      )
    })

    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const stats: Record<string, QuestionStats> = {
        '2x2': { times: [3.2], wrongCount: 0, asked: true, history: [] }
      }

      expect(() => saveToLocalStorage(stats)).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save to localStorage:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('loadFromLocalStorage', () => {
    it('should return null when no data exists', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const result = loadFromLocalStorage()
      
      expect(result).toBeNull()
      expect(localStorageMock.getItem).toHaveBeenCalledWith('multiplication-stats')
    })

    it('should load and parse valid data', () => {
      const mockData = {
        version: 1,
        lastUpdated: '2023-01-01T00:00:00.000Z',
        stats: {
          '2x2': { times: [3.2, 2.8], wrongCount: 1, asked: true, history: [] }
        }
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData))
      
      const result = loadFromLocalStorage()
      
      expect(result).toEqual(mockData.stats)
    })

    it('should return null for unsupported version', () => {
      const mockData = {
        version: 2,
        lastUpdated: '2023-01-01T00:00:00.000Z',
        stats: {}
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData))
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const result = loadFromLocalStorage()
      
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Unsupported storage version:', 2)
      
      consoleSpy.mockRestore()
    })

    it('should handle JSON parse errors gracefully', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = loadFromLocalStorage()
      
      expect(result).toBeNull()
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load from localStorage:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })

  describe('clearLocalStorage', () => {
    it('should remove the storage key', () => {
      clearLocalStorage()
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('multiplication-stats')
    })

    it('should handle errors gracefully', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Access denied')
      })
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => clearLocalStorage()).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith('Failed to clear localStorage:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })
  })
})
