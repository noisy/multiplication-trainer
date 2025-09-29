# Multiplication Table Teacher - Architecture Specification

## Technology Stack

- **Framework**: Vue 3 (Composition API)
- **State Management**: Pinia (Vue store)
- **Styling**: Tailwind CSS
- **Storage**: localStorage API
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Component Architecture

### Component Tree

```
App.vue
├── AppHeader.vue
│   └── BackButton.vue (conditional)
│
└── Router/View Manager
    ├── BoardView.vue
    │   ├── LessonButton.vue
    │   ├── MultiplicationGrid.vue
    │   │   └── StatusCircle.vue (×121 instances)
    │   └── ColorLegend.vue
    │       └── LegendItem.vue (×6 instances)
    │
    └── QuestionView.vue
        ├── QuestionHeader.vue
        │   ├── BackButton.vue
        │   └── ProgressIndicator.vue (conditional)
        ├── QuestionContent.vue
        │   ├── Timer.vue
        │   ├── QuestionDisplay.vue
        │   ├── AnswerDisplay.vue
        │   └── HistoryDots.vue
        │       └── StatusCircle.vue (×1-5 instances)
        └── AnswerButtons.vue
            ├── WrongButton.vue
            └── CorrectButton.vue
```

## Component Specifications

### 1. App.vue
**Type**: Root Component
**Responsibilities**:
- Initialize Pinia store
- Set up view routing/management
- Apply global styles
- Handle app-level lifecycle

**Props**: None
**Emits**: None
**State**: None (delegates to store)

---

### 2. AppHeader.vue
**Type**: Layout Component
**Responsibilities**:
- Display app title (on BoardView)
- Manage navigation elements
- Show contextual information (progress on QuestionView)

**Props**:
- `currentView: String` - 'board' | 'question'
- `lessonProgress: Object | null` - { current: Number, total: Number }

**Emits**:
- `navigate-back` - When back button clicked

**Slots**:
- `left` - For back button
- `center` - For title or question info
- `right` - For progress indicator

---

### 3. BackButton.vue
**Type**: UI Component (Reusable)
**Responsibilities**:
- Display back arrow icon
- Handle click interaction
- Provide hover feedback

**Props**:
- `variant: String` - 'default' | 'minimal' (optional, default: 'default')

**Emits**:
- `click` - When button clicked

---

### 4. BoardView.vue
**Type**: View/Page Component
**Responsibilities**:
- Layout the main board page
- Coordinate interactions between child components
- Handle navigation to QuestionView

**Props**: None
**Emits**:
- `start-lesson` - When lesson button clicked
- `start-question` - When status circle clicked, payload: { n: Number, m: Number }

**Computed**:
- `gridData: Array<Array<Object>>` - 11×11 matrix of question stats

---

### 5. LessonButton.vue
**Type**: UI Component
**Responsibilities**:
- Display "Start Lesson" call-to-action
- Show icon and text
- Handle click interaction

**Props**:
- `disabled: Boolean` (optional, default: false)

**Emits**:
- `click` - When button clicked

---

### 6. MultiplicationGrid.vue
**Type**: Layout Component
**Responsibilities**:
- Render 11×11 grid with row/column headers
- Position StatusCircle components
- Handle responsive layout
- Manage grid overflow on small screens

**Props**:
- `questions: Array<Object>` - Array of 121 question objects with stats
  ```javascript
  {
    n: Number,
    m: Number,
    times: Array<Number>,
    wrongCount: Number,
    asked: Boolean,
    avgTime: Number | null
  }
  ```

**Emits**:
- `question-click` - When any circle clicked, payload: { n: Number, m: Number }

**Layout Structure**:
```
Grid (12×12 including headers)
Row 0: [empty] [2] [3] [4] ... [12]
Row 1: [2] [circle] [circle] ... [circle]
Row 2: [3] [circle] [circle] ... [circle]
...
Row 11: [12] [circle] [circle] ... [circle]
```

---

### 7. StatusCircle.vue ⭐ REUSABLE
**Type**: UI Component (Highly Reusable)
**Responsibilities**:
- Display colored circle representing question status
- Show time/status text inside circle
- Handle different display modes
- Provide hover tooltip (on board only)
- Handle click interaction (on board only)

**Props**:
- `avgTime: Number | null` - Average time in seconds
- `wrongCount: Number` - Number of wrong attempts
- `asked: Boolean` - Whether question has been attempted
- `size: String` - 'small' | 'medium' | 'large' (default: 'medium')
  - small: 28px (w-7 h-7) - for grid
  - medium: 40px (w-10 h-10) - for history dots
  - large: 56px (w-14 h-14) - future use
- `interactive: Boolean` - Enable hover and click (default: false)
- `showTooltip: Boolean` - Show detailed tooltip on hover (default: false)
- `displayMode: String` - 'time' | 'wrong' | 'empty' (default: 'time')
  - time: Show average time number
  - wrong: Show ✗ symbol
  - empty: Show nothing inside
- `n: Number` (optional) - First multiplier (for tooltip)
- `m: Number` (optional) - Second multiplier (for tooltip)

**Emits**:
- `click` - When clicked (if interactive=true)

**Computed**:
- `backgroundColor: String` - Hex color based on performance
- `displayText: String` - Text to show inside circle
- `tooltipText: String` - Tooltip content

**Methods**:
- `getColor()` - Calculate color based on avgTime/wrongCount
- `formatTime()` - Format time for display

**Color Logic**:
```javascript
if (!asked) return '#9ca3af' // grey
if (wrongCount > 0 && times.length === 0) return '#ef4444' // red
if (avgTime === null) return '#9ca3af'
if (avgTime <= 3) return '#10b981'  // green
if (avgTime <= 5) return '#84cc16'  // lime
if (avgTime <= 10) return '#eab308' // yellow
if (avgTime <= 15) return '#f97316' // orange
return '#ef4444' // red
```

---

### 8. ColorLegend.vue
**Type**: UI Component
**Responsibilities**:
- Display legend explaining color meanings
- Show all 6 color categories
- Responsive layout

**Props**: None
**Emits**: None

---

### 9. LegendItem.vue
**Type**: UI Component
**Responsibilities**:
- Display single legend entry (color + label)
- Consistent spacing and alignment

**Props**:
- `color: String` - Hex color code
- `label: String` - Text description
- `example: String` (optional) - Example time range

**Emits**: None

---

### 10. QuestionView.vue
**Type**: View/Page Component
**Responsibilities**:
- Layout the question page
- Coordinate question flow
- Handle answer submission
- Manage timer lifecycle

**Props**:
- `question: Object` - Current question
  ```javascript
  {
    n: Number,
    m: Number,
    answer: Number,
    history: {
      times: Array<Number>,
      wrongCount: Number
    }
  }
  ```
- `lessonMode: Boolean` - Whether in lesson mode
- `lessonProgress: Object | null` - { current: Number, total: Number }

**Emits**:
- `answer-submitted` - payload: { correct: Boolean, timeSpent: Number }
- `navigate-back` - When back button clicked

**Lifecycle**:
- `onMounted` - Start timer
- `onBeforeUnmount` - Stop timer

---

### 11. QuestionHeader.vue
**Type**: Layout Component
**Responsibilities**:
- Display top bar of question page
- Position back button and progress indicator

**Props**:
- `lessonProgress: Object | null` - { current: Number, total: Number }

**Emits**:
- `back-click` - When back button clicked

---

### 12. ProgressIndicator.vue
**Type**: UI Component
**Responsibilities**:
- Display lesson progress (e.g., "3/10")
- Format and style the text

**Props**:
- `current: Number` - Current question number
- `total: Number` - Total questions in lesson

**Emits**: None

---

### 13. QuestionContent.vue
**Type**: Layout Component
**Responsibilities**:
- Vertically center all question elements
- Manage spacing between elements

**Props**:
- `n: Number` - First multiplier
- `m: Number` - Second multiplier
- `answer: Number` - Correct answer
- `elapsedTime: Number` - Current timer value
- `history: Array<Object>` - Previous attempts
  ```javascript
  [
    { type: 'correct', time: 3.2 },
    { type: 'wrong', time: null },
    { type: 'correct', time: 5.1 }
  ]
  ```

**Emits**: None

---

### 14. Timer.vue
**Type**: UI Component
**Responsibilities**:
- Display elapsed time
- Format time to 1 decimal place
- Update every 0.1 seconds

**Props**:
- `elapsedTime: Number` - Time in seconds

**Emits**: None

**Watchers**:
- Watch `elapsedTime` for updates

---

### 15. QuestionDisplay.vue
**Type**: UI Component
**Responsibilities**:
- Display multiplication question (e.g., "7 × 8")
- Large, prominent text
- Proper formatting with × symbol

**Props**:
- `n: Number` - First multiplier
- `m: Number` - Second multiplier

**Emits**: None

---

### 16. AnswerDisplay.vue
**Type**: UI Component
**Responsibilities**:
- Display correct answer (e.g., "= 56")
- Clear, readable format

**Props**:
- `answer: Number` - The correct result

**Emits**: None

---

### 17. HistoryDots.vue
**Type**: UI Component
**Responsibilities**:
- Display up to 5 previous attempts
- Arrange StatusCircle components horizontally
- Handle empty history (show nothing)

**Props**:
- `history: Array<Object>` - Last 5 attempts
  ```javascript
  [
    { type: 'correct', time: 3.2 },
    { type: 'wrong', time: null }
  ]
  ```

**Emits**: None

**Computed**:
- `displayDots: Array<Object>` - Formatted data for StatusCircle
  ```javascript
  [
    {
      avgTime: 3.2,
      wrongCount: 0,
      asked: true,
      displayMode: 'time'
    },
    {
      avgTime: null,
      wrongCount: 1,
      asked: true,
      displayMode: 'wrong'
    }
  ]
  ```

---

### 18. AnswerButtons.vue
**Type**: Layout Component
**Responsibilities**:
- Display Wrong and Correct buttons side by side
- Handle button clicks
- Responsive layout

**Props**: None

**Emits**:
- `answer` - payload: { correct: Boolean }

---

### 19. WrongButton.vue
**Type**: UI Component
**Responsibilities**:
- Display red "Wrong" button
- Show X icon
- Handle click interaction

**Props**:
- `disabled: Boolean` (optional)

**Emits**:
- `click` - When button clicked

---

### 20. CorrectButton.vue
**Type**: UI Component
**Responsibilities**:
- Display green "Correct" button
- Show checkmark icon
- Handle click interaction

**Props**:
- `disabled: Boolean` (optional)

**Emits**:
- `click` - When button clicked

---

## State Management (Pinia Store)

### multiplicationStore.js

**State**:
```javascript
{
  // Current view state
  currentView: 'board' | 'question',
  
  // Question statistics (121 entries)
  stats: {
    '2x2': {
      times: [3.2, 2.8, 3.1, 2.9, 3.0],
      wrongCount: 1,
      asked: true
    },
    '2x3': { ... },
    // ... all combinations 2-12
  },
  
  // Current question state
  currentQuestion: {
    n: 7,
    m: 8,
    startTime: 1234567890
  } | null,
  
  // Lesson state
  lessonQuestions: [
    { n: 3, m: 4 },
    { n: 7, m: 8 },
    // ... up to 10 questions
  ],
  lessonIndex: 0,
  
  // Timer
  elapsedTime: 0,
  timerInterval: null
}
```

**Getters**:
- `getQuestionStats(n, m)` - Get stats for specific question
- `getAverageTime(n, m)` - Calculate average from last 5 times
- `getColor(n, m)` - Get color for question status
- `getSelectionWeight(n, m)` - Calculate weight for lesson selection
- `getAllQuestionsWithStats()` - Get array of all 121 questions with computed stats
- `isInLesson()` - Check if lesson is active
- `getLessonProgress()` - Get { current, total } or null

**Actions**:
- `initializeStats()` - Create initial stats structure
- `loadFromLocalStorage()` - Load persisted data
- `saveToLocalStorage()` - Persist data
- `startQuestion(n, m)` - Begin a question
- `submitAnswer(correct)` - Record answer and time
- `startLesson()` - Generate 10 weighted questions
- `nextLessonQuestion()` - Advance to next question
- `endLesson()` - Clear lesson state
- `navigateToBoard()` - Switch to board view
- `navigateToQuestion()` - Switch to question view
- `startTimer()` - Begin timer interval
- `stopTimer()` - Stop timer interval
- `updateElapsedTime()` - Increment elapsed time

**Helper Methods**:
- `selectWeightedQuestion()` - Randomly select based on weights
- `calculateWeight(n, m)` - Compute selection weight
- `formatQuestionKey(n, m)` - Create key string "NxM"

---

## Data Flow

### 1. App Initialization
```
App.vue mounts
  → Store: loadFromLocalStorage()
  → Store: initializeStats() (if no saved data)
  → Render BoardView
```

### 2. Starting a Lesson
```
User clicks LessonButton
  → LessonButton emits 'click'
  → BoardView emits 'start-lesson'
  → Store: startLesson()
    → Generate 10 weighted questions
    → Set lessonIndex = 0
    → Store: startQuestion(first question)
      → Set currentQuestion
      → Store: startTimer()
      → Store: navigateToQuestion()
  → QuestionView renders with first question
```

### 3. Answering a Question (in Lesson)
```
User clicks CorrectButton
  → CorrectButton emits 'click'
  → AnswerButtons emits 'answer' { correct: true }
  → QuestionView emits 'answer-submitted'
  → Store: submitAnswer(true)
    → Stop timer
    → Calculate timeSpent
    → Update stats for current question
    → Store: saveToLocalStorage()
    → Store: nextLessonQuestion()
      → If more questions: startQuestion(next)
      → If done: navigateToBoard() + endLesson()
```

### 4. Manual Question Practice
```
User clicks StatusCircle on board
  → StatusCircle emits 'click'
  → MultiplicationGrid emits 'question-click' { n, m }
  → BoardView emits 'start-question'
  → Store: startQuestion(n, m)
    → Set currentQuestion
    → Store: startTimer()
    → Store: navigateToQuestion()
  → QuestionView renders
  
User answers
  → Same as lesson flow but:
    → Store: submitAnswer()
    → Store: navigateToBoard() (always return to board)
```

### 5. Data Persistence
```
Every answer submission:
  → Store: submitAnswer()
    → Update stats object
    → Store: saveToLocalStorage()
      → localStorage.setItem('multiplication-stats', JSON.stringify(stats))

On app load:
  → Store: loadFromLocalStorage()
    → localStorage.getItem('multiplication-stats')
    → Parse and set stats
```

---

## localStorage Schema

**Key**: `multiplication-stats`

**Value**: JSON string
```javascript
{
  version: 1, // Schema version for future migrations
  lastUpdated: '2025-09-29T12:00:00Z',
  stats: {
    '2x2': {
      times: [3.2, 2.8, 3.1, 2.9, 3.0],
      wrongCount: 1,
      asked: true
    },
    '2x3': { ... },
    // ... all 121 combinations
  }
}
```

---

## File Structure

```
src/
├── main.js                 # App entry point
├── App.vue                 # Root component
├── stores/
│   └── multiplicationStore.js  # Pinia store
├── views/
│   ├── BoardView.vue
│   └── QuestionView.vue
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   ├── QuestionHeader.vue
│   │   ├── QuestionContent.vue
│   │   └── AnswerButtons.vue
│   ├── board/
│   │   ├── LessonButton.vue
│   │   ├── MultiplicationGrid.vue
│   │   ├── ColorLegend.vue
│   │   └── LegendItem.vue
│   ├── question/
│   │   ├── Timer.vue
│   │   ├── QuestionDisplay.vue
│   │   ├── AnswerDisplay.vue
│   │   ├── HistoryDots.vue
│   │   ├── ProgressIndicator.vue
│   │   ├── WrongButton.vue
│   │   └── CorrectButton.vue
│   └── shared/
│       ├── BackButton.vue
│       └── StatusCircle.vue  ⭐ Reusable
├── composables/
│   ├── useTimer.js         # Timer logic
│   ├── useColorCalculation.js  # Color/performance logic
│   └── useWeightedSelection.js # Lesson question selection
├── utils/
│   ├── constants.js        # Time thresholds, colors
│   └── storage.js          # localStorage helpers
└── assets/
    └── styles/
        └── main.css        # Tailwind imports + custom styles
```

---

## Key Design Decisions

### 1. StatusCircle Reusability
The StatusCircle component is designed to be highly reusable across:
- **Board Grid**: 121 instances, small size, interactive, with tooltips
- **History Dots**: 1-5 instances, medium size, non-interactive, showing individual attempt data

This is achieved through flexible props:
- `size` prop for different dimensions
- `interactive` prop to enable/disable click handling
- `displayMode` prop to switch between time display and wrong symbol
- `showTooltip` prop for contextual help

### 2. Composition API Over Options API
Using Vue 3 Composition API for:
- Better code organization
- Easier logic reuse through composables
- Better TypeScript support (future enhancement)
- Cleaner component structure

### 3. Pinia Over Vuex
Pinia provides:
- Simpler API
- Better TypeScript support
- Automatic code splitting
- No mutations (actions only)
- Better DevTools integration

### 4. Composables for Shared Logic
Extract common logic into composables:
- `useTimer`: Timer start/stop/update logic
- `useColorCalculation`: Performance color calculation
- `useWeightedSelection`: Lesson question selection algorithm

This allows reuse and easier testing.

### 5. View-Based Routing
Instead of Vue Router, use simple view switching:
- Simpler for this single-page app
- No URL changes needed
- Faster transitions
- Less overhead

### 6. LocalStorage Strategy
- Save on every answer submission (not on every state change)
- Include schema version for future migrations
- Include timestamp for debugging
- Separate concern in `utils/storage.js`

---

## Component Interaction Patterns

### Pattern 1: Event Bubbling
```
StatusCircle (click)
  → MultiplicationGrid (question-click)
  → BoardView (start-question)
  → Store action (startQuestion)
```

### Pattern 2: Props Down, Events Up
```
Store State
  ↓ (props)
QuestionView
  ↓ (props)
QuestionContent
  ↓ (props)
HistoryDots
  ↓ (props)
StatusCircle
  ↑ (events - but not used here as non-interactive)
```

### Pattern 3: Store Direct Access
Some components access store directly:
- Views (BoardView, QuestionView)
- Layout components that need global state

Leaf/presentational components receive data via props:
- StatusCircle
- Timer
- QuestionDisplay
- etc.

---

## Responsive Design Strategy

### Breakpoints
- **Mobile**: < 640px (primary target)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px (secondary)

### Mobile-First Approach
1. Design for 375px width first (iPhone standard)
2. Grid fits without horizontal scroll
3. Touch targets minimum 28px
4. Large buttons for easy tapping
5. Minimal padding to maximize space

### Grid Responsiveness
```
Mobile (< 640px):
  - Circle size: 28px (w-7)
  - Grid gap: 2px
  - Padding: 8px

Tablet (640px+):
  - Circle size: 40px (w-10)
  - Grid gap: 4px
  - Padding: 16px

Desktop (1024px+):
  - Circle size: 48px (w-12)
  - Grid gap: 6px
  - Padding: 24px
  - Max width container
```

---

## Testing Strategy

### Unit Tests
Test individual components and functions:
- StatusCircle color calculation
- Weighted question selection
- Average time calculation
- Timer logic
- localStorage save/load

### Component Tests
Test component behavior:
- StatusCircle renders correctly with different props
- Buttons emit correct events
- Grid renders 121 circles
- History dots show correct number of items

### Integration Tests
Test component interactions:
- Clicking circle starts question
- Submitting answer updates stats
- Lesson flow completes correctly
- Navigation works between views

### E2E Tests (Optional)
Test complete user flows:
- Complete a full lesson
- Practice specific question
- View progress on board

---

## Performance Considerations

### 1. Virtual Scrolling
For future: If grid becomes larger, implement virtual scrolling to render only visible circles.

### 2. Computed Caching
Use Vue's computed properties to cache expensive calculations:
- Average times
- Colors
- Selection weights

### 3. Debouncing
Timer updates use interval (not reactive updates every millisecond).

### 4. LocalStorage Throttling
Save to localStorage only on answer submission, not on every state change.

### 5. Component Key Usage
Use proper `:key` in v-for loops for efficient re-rendering:
```vue
<StatusCircle
  v-for="question in questions"
  :key="`${question.n}x${question.m}`"
  ...
/>
```

---

## Accessibility Considerations

### 1. Semantic HTML
- Use `<button>` for interactive elements
- Proper heading hierarchy
- ARIA labels where needed

### 2. Keyboard Navigation
- All interactive elements keyboard accessible
- Tab order logical
- Enter/Space activate buttons

### 3. Color + Text
- Don't rely on color alone
- Include time numbers inside circles
- Provide tooltips with text descriptions

### 4. Focus States
- Clear focus indicators
- Visible focus rings on all interactive elements

### 5. Screen Reader Support
- ARIA labels for status circles
- Announce timer updates (aria-live)
- Descriptive button labels

---

## Deployment Configuration

### GitHub Pages Setup

**vite.config.js**:
```javascript
export default {
  base: '/multiplication-teacher/', // Repository name
  build: {
    outDir: 'dist'
  }
}
```

**GitHub Actions** (.github/workflows/deploy.yml):
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Future Architecture Enhancements

### 1. Multi-User Support
Add user profiles:
```javascript
// Store structure
{
  currentUser: 'child1',
  users: {
    'child1': { name: 'Alice', stats: {...} },
    'child2': { name: 'Bob', stats: {...} }
  }
}
```

### 2. Progressive Web App (PWA)
- Add service worker
- Enable offline functionality
- Add to home screen capability

### 3. Analytics Module
Track learning patterns:
```javascript
// New store module
{
  analytics: {
    sessionsCompleted: 45,
    totalQuestionsAnswered: 523,
    averageAccuracy: 0.87,
    improvementRate: 0.15
  }
}
```

### 4. Settings Module
User preferences:
```javascript
{
  settings: {
    soundEnabled: true,
    timeGoal: 3,
    questionsPerLesson: 10,
    theme: 'light',
    language: 'en'
  }
}
```

### 5. Export/Import Feature
- Export stats as JSON
- Import from backup
- Share progress with teachers

---

## Summary

This architecture provides:
- **Modularity**: Small, focused components
- **Reusability**: StatusCircle used in multiple contexts
- **Scalability**: Easy to add features
- **Maintainability**: Clear separation of concerns
- **Testability**: Isolated units easy to test
- **Performance**: Efficient rendering and state management

The component tree is designed to be implemented by another AI agent or developer with clear specifications for each component's responsibilities, props, events, and interactions.