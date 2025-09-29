<template>
  <div class="question-content">
    <div class="content-container">
      <!-- Timer -->
      <Timer :elapsed-time="elapsedTime" />
      
      <!-- Question (e.g., "7 × 8") -->
      <QuestionDisplay :n="n" :m="m" />
      
      <!-- Answer (e.g., "= 56") -->
      <AnswerDisplay :answer="answer" />
      
      <!-- History Dots (previous attempts) -->
      <HistoryDots :history="history" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Timer from './Timer.vue'
import QuestionDisplay from './QuestionDisplay.vue'
import AnswerDisplay from './AnswerDisplay.vue'
import HistoryDots from './HistoryDots.vue'

interface HistoryAttempt {
  type: 'correct' | 'wrong'
  time: number | null
}

interface Props {
  n: number
  m: number
  answer: number
  elapsedTime: number
  history: HistoryAttempt[]
}

defineProps<Props>()
</script>

<style scoped>
.question-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  min-height: 0; /* Allow flex shrinking */
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .question-content {
    padding: 1.5rem 0.75rem;
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .question-content {
    padding: 3rem 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .question-content {
    padding: 4rem 2rem;
  }
  
  .content-container {
    max-width: 800px;
  }
}
</style>
