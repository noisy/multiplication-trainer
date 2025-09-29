// Time thresholds for performance colors (in seconds)
export const TIME_THRESHOLDS = {
  EXCELLENT: 3,    // 0-3s - Excellent
  GREAT: 6,        // 3-6s - Great!
  GOOD: 10,        // 6-10s - Good
  OK: 15,          // 10-15s - Ok
  SLOW: Infinity,  // 15+s - Slow
  // Wrong answers = Red
} as const

// Performance colors
export const PERFORMANCE_COLORS = {
  GREY: '#9ca3af',      // Not attempted
  GREEN: '#10b981',     // 0-3s - Excellent
  EMERALD: '#059669',   // 3-6s - Great!
  LIME: '#84cc16',      // 6-10s - Good
  YELLOW: '#eab308',    // 10-15s - Ok
  ORANGE: '#f97316',    // 15+s - Slow
  RED: '#ef4444',       // Wrong answers
} as const

// Selection weights for lesson algorithm
export const SELECTION_WEIGHTS = {
  BASE: 1,              // Base weight for all questions
  NOT_ASKED: 3,         // Additional weight for unattempted questions
  WRONG_ANSWER: 2,      // Additional weight per wrong answer
  SLOW: 3,              // Additional weight for >15s average
  OK: 2,                // Additional weight for >10s average
  GOOD: 1,              // Additional weight for >6s average
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
