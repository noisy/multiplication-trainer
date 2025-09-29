# Multiplication Table Teacher - Product Specification

## Overview

A mobile-first web application designed to help parents teach their children the multiplication table (2-12). The app tracks performance, adapts difficulty based on the child's progress, and provides visual feedback on mastery levels.

## Target Users

**Primary User**: Parents teaching multiplication to children (typically ages 7-10)

**Secondary User**: Children learning multiplication tables

## Core Functionality

### 1. Main Board (Dashboard)

The main board displays a 11×11 grid representing all multiplication problems from 2×2 to 12×12.

#### Grid Layout
- **Axes**: Numbers 2 through 12 on both horizontal and vertical axes
- **Total Problems**: 121 multiplication combinations (11×11)
- **Cell Size**: 28px × 28px circles (compact for mobile)
- **Spacing**: Minimal gaps (0.5px) between cells for compact display

#### Status Indicators (Colored Circles)

Each circle represents one multiplication problem and uses color coding to show performance:

| Color | Time Range | Meaning |
|-------|------------|---------|
| Grey (#9ca3af) | N/A | Not yet attempted |
| Green (#10b981) | ≤3s | Excellent - fast and accurate |
| Lime (#84cc16) | ≤5s | Good - slightly slower |
| Yellow (#eab308) | ≤10s | Okay - needs improvement |
| Orange (#f97316) | ≤15s | Slow - requires practice |
| Red (#ef4444) | >15s or wrong | Very slow or incorrect answer |

#### Average Time Display
- Each circle displays the average response time (in seconds) from the last 5 attempts
- Time is shown as a whole number (e.g., "3", "5", "12") centered in the circle
- White text with dark shadow for visibility against any background color

#### Interactive Features
- **Click any circle**: Launches that specific multiplication problem (Manual Mode)
- **Hover tooltip**: Shows detailed stats (e.g., "3×4\nAvg: 4.5s\nWrong: 2")

### 2. Lesson Mode

Intelligent practice session that automatically selects 10 questions based on performance data.

#### Question Selection Algorithm

Questions are selected using a weighted random system:

**Base Weight**: 1 for all questions

**Weight Modifiers**:
- Not yet asked: +3 (higher priority)
- Each wrong answer: +2 per mistake
- Slow answers (avg time):
  - >15s: +3
  - >10s: +2
  - >5s: +1

**Example**: A question with 2 wrong answers and 12s average time would have weight: 1 + 6 + 2 = 9

This ensures the system focuses on:
1. Questions never practiced
2. Questions frequently answered incorrectly
3. Questions answered slowly

#### Lesson Flow
1. User clicks "Start Lesson (10 Questions)" button
2. System generates 10 questions using weighted selection
3. Questions are presented one at a time
4. Progress indicator shows current position (e.g., "3/10")
5. After completing all 10 questions, user returns to main board

### 3. Question Page

Full-screen interface for answering a single multiplication question.

#### Display Elements

**Top Bar**:
- Back arrow (left): Returns to main board, cancels lesson if active
- Progress indicator (right): Shows "X/10" during lessons only

**Center Content** (vertically centered):
1. **Timer**: Large grey text showing elapsed time (e.g., "3.5s")
   - Updates every 0.1 seconds
   - Starts when question appears
   
2. **Question**: Extra large blue text (e.g., "7 × 8")
   
3. **Answer**: Large grey text showing the correct result (e.g., "= 56")

4. **History Dots**: Row of up to 5 colored circles showing previous attempts
   - Each circle displays:
     - Time in seconds for correct answers (e.g., "3", "7", "15")
     - "✗" symbol for wrong answers
   - Circle color matches the performance color scale
   - Shows most recent 5 attempts only
   - If no history exists, this section is hidden

**Bottom Buttons**:
- **Wrong Button** (Red): Parent clicks when child answers incorrectly
- **Correct Button** (Green): Parent clicks when child answers correctly

Both buttons are large, touch-friendly, and include icons (X and checkmark).

### 4. Data Tracking

For each multiplication problem (e.g., "3×4"), the system tracks:

#### Stored Data
- **Times Array**: List of response times for correct answers (in seconds)
- **Wrong Count**: Total number of incorrect attempts
- **Asked Flag**: Boolean indicating if question has been attempted

#### Calculated Metrics
- **Average Time**: Mean of the last 5 correct response times
- **Performance Color**: Determined by average time and wrong count
- **Selection Weight**: Used for lesson question selection

#### Data Persistence
- **Session-based**: Data persists during browser session (React state)
- **No localStorage**: Due to Claude.ai artifact limitations
- **Implementation Note**: For production use, localStorage should be added to persist data between sessions

### 5. User Interface Design

#### Mobile-First Approach
- **Target Device**: Smartphones (320px - 428px width)
- **Orientation**: Portrait mode optimized
- **Touch Targets**: Minimum 28px for interactive elements
- **Padding**: Minimal (8px) to maximize screen real estate
- **Typography**: Responsive sizes for different screen sizes

#### Color Scheme
- **Background**: Blue gradient (from-blue-50 to-blue-100)
- **Cards**: White with rounded corners and shadows
- **Primary Action**: Blue (#2563eb)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)

#### Accessibility
- High contrast text with shadows where needed
- Large touch targets for child-friendly interaction
- Clear visual hierarchy
- Color coding supplemented by numerical data

## Technical Requirements

### Frontend Framework
- **React**: Component-based architecture
- **Hooks Used**: useState, useEffect
- **Styling**: Tailwind CSS utility classes

### Key Components

1. **MultiplicationTeacher** (Main Component)
   - Manages application state
   - Routes between board and question pages
   - Handles lesson flow

2. **State Management**
   - `mode`: Current view ('board' or 'question')
   - `stats`: Performance data for all 121 questions
   - `currentQuestion`: Active multiplication problem
   - `lessonQuestions`: Array of 10 questions for current lesson
   - `lessonIndex`: Position in current lesson
   - `elapsedTime`: Timer for current question

### Performance Considerations
- Efficient rendering of 121 grid cells
- Real-time timer updates (100ms interval)
- Minimal re-renders using React best practices

## User Flows

### Flow 1: First Time User (Manual Practice)
1. Parent opens app → sees grey grid (all questions unattempted)
2. Parent clicks on "2×2" circle → question page appears
3. Child answers "4" → parent clicks "Correct"
4. System records time (e.g., 2.5s) → returns to board
5. "2×2" circle now shows green with "3" inside
6. Parent continues clicking circles to practice specific problems

### Flow 2: Lesson Mode
1. Parent has used app several times → board shows mix of colors
2. Parent clicks "Start Lesson (10 Questions)"
3. System selects 10 questions (prioritizing red/orange/grey circles)
4. Question 1 appears with "1/10" indicator
5. Child answers → parent clicks Correct/Wrong → next question appears
6. Process repeats through all 10 questions
7. After question 10 → returns to main board
8. Board updates with new performance data

### Flow 3: Reviewing Progress
1. Parent views main board
2. Identifies problem areas (red/orange circles)
3. Sees average times directly on circles
4. Hovers for detailed stats
5. Clicks specific problem circles to practice weak areas
6. Monitors improvement over time through color changes

## Success Metrics

### Child Learning Indicators
- Increasing green circles on board
- Decreasing average response times
- Fewer wrong answers per question

### App Effectiveness
- Consistent use over multiple sessions
- Balanced practice across all multiplication tables
- Progressive difficulty adjustment working correctly

## Future Enhancements (Out of Scope for V1)

1. **Data Persistence**: localStorage implementation for production
2. **Multiple Profiles**: Support for multiple children
3. **Reports**: Daily/weekly progress summaries
4. **Achievements**: Badges and rewards system
5. **Sound Effects**: Audio feedback for correct/wrong answers
6. **Practice Modes**: Timed challenges, specific table focus
7. **Export Data**: CSV export of performance history
8. **Settings**: Customizable time thresholds, question ranges
9. **Division Mode**: Reverse operation practice

## Known Limitations

1. **No Data Persistence**: Current implementation loses data on browser refresh
2. **Single User**: No support for multiple children/profiles
3. **Manual Scoring**: Parent must verify child's answer and click button
4. **No Audio**: Silent operation only
5. **Portrait Only**: Not optimized for landscape orientation

## Implementation Notes

### localStorage Migration (For Production)

To add persistent storage, implement:

```javascript
// On component mount
useEffect(() => {
  const saved = localStorage.getItem('multiplicationStats');
  if (saved) {
    setStats(JSON.parse(saved));
  }
}, []);

// After each answer
useEffect(() => {
  localStorage.setItem('multiplicationStats', JSON.stringify(stats));
}, [stats]);
```

### Browser Compatibility
- Modern browsers (Chrome, Safari, Firefox, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- ES6+ JavaScript features required

### Performance Optimization
- Grid rendered once, updates only affected cells
- Timer uses efficient interval cleanup
- Minimal state updates to prevent unnecessary re-renders

## Conclusion

The Multiplication Table Teacher provides a data-driven, adaptive approach to learning multiplication tables. By tracking performance and intelligently selecting practice questions, it helps children focus on areas needing improvement while giving parents clear visibility into progress.