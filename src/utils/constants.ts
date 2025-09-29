// Time thresholds for performance colors (in seconds)
export const TIME_THRESHOLDS = {
  EXCELLENT: 3,    // Green
  GOOD: 5,         // Lime  
  OKAY: 10,        // Yellow
  SLOW: 15,        // Orange
  // Above 15s or wrong = Red
} as const

// Performance colors
export const PERFORMANCE_COLORS = {
  GREY: '#9ca3af',      // Not attempted
  GREEN: '#10b981',     // ≤3s - Excellent
  LIME: '#84cc16',      // ≤5s - Good
  YELLOW: '#eab308',    // ≤10s - Okay
  ORANGE: '#f97316',    // ≤15s - Slow
  RED: '#ef4444',       // >15s or wrong - Very slow/incorrect
} as const

// Selection weights for lesson algorithm
export const SELECTION_WEIGHTS = {
  BASE: 1,              // Base weight for all questions
  NOT_ASKED: 3,         // Additional weight for unattempted questions
  WRONG_ANSWER: 2,      // Additional weight per wrong answer
  VERY_SLOW: 3,         // Additional weight for >15s average
  SLOW: 2,              // Additional weight for >10s average
  OKAY: 1,              // Additional weight for >5s average
} as const

// Multiplication table range
export const MULTIPLICATION_RANGE = {
  MIN: 2,
  MAX: 12,
} as const

// Maximum number of times to store for average calculation
export const MAX_STORED_TIMES = 5

// Lesson configuration
export const LESSON_CONFIG = {
  QUESTIONS_COUNT: 10,
} as const

// localStorage key
export const STORAGE_KEY = 'multiplication-stats'

// Timer update interval (milliseconds)
export const TIMER_INTERVAL = 100
