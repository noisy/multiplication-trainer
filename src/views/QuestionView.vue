<template>
  <div class="question-view">
    <!-- Header -->
    <QuestionHeader
      :lesson-progress="lessonProgress"
      @back-click="handleBackClick"
    />

    <!-- Main Content -->
    <main class="question-main">
      <QuestionContent
        v-if="currentQuestion"
        :n="currentQuestion.n"
        :m="currentQuestion.m"
        :answer="currentQuestion.answer"
        :elapsed-time="elapsedTime"
        :history="questionHistory"
      />
    </main>

    <!-- Bottom Buttons -->
    <footer class="question-footer">
      <AnswerButtons
        :disabled="!currentQuestion"
        @answer="handleAnswer"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMultiplicationStore } from '../stores/multiplicationStore'
import QuestionHeader from '../components/question/QuestionHeader.vue'
import QuestionContent from '../components/question/QuestionContent.vue'
import AnswerButtons from '../components/question/AnswerButtons.vue'

const store = useMultiplicationStore()

// Computed properties
const currentQuestion = computed(() => store.currentQuestion)
const elapsedTime = computed(() => store.elapsedTime)
const lessonProgress = computed(() => store.getLessonProgress)

// Get question history for current question
const questionHistory = computed(() => {
  if (!currentQuestion.value) return []
  
  const stats = store.getQuestionStats(currentQuestion.value.n, currentQuestion.value.m)
  if (!stats) return []
  
  // Convert times array to history format
  const history: Array<{ type: 'correct' | 'wrong', time: number | null }> = []
  
  // Add correct answers (with times)
  stats.times.forEach(time => {
    history.push({ type: 'correct', time })
  })
  
  // Add wrong answers (without times)
  for (let i = 0; i < stats.wrongCount; i++) {
    history.push({ type: 'wrong', time: null })
  }
  
  // Return last 5 attempts only
  return history.slice(-5)
})

// Event handlers
function handleBackClick() {
  // If in lesson, this will cancel the lesson
  // If in single question mode, this will return to board
  store.navigateToBoard()
  
  // If there was a lesson in progress, end it
  if (store.isInLesson) {
    store.endLesson()
  }
}

function handleAnswer(payload: { correct: boolean }) {
  store.submitAnswer(payload.correct)
}
</script>

<style scoped>
.question-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.question-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Allow flex shrinking */
}

.question-footer {
  flex-shrink: 0;
  background-color: white;
  border-top: 1px solid #e5e7eb; /* gray-200 */
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Ensure proper mobile layout */
@media (max-width: 640px) {
  .question-view {
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
  }
}
</style>
