<template>
  <div v-if="displayDots.length > 0" class="history-dots">
    <div class="dots-container">
      <StatusCircle
        v-for="(dot, index) in displayDots"
        :key="`history-${index}`"
        :avg-time="dot.avgTime"
        :wrong-count="dot.wrongCount"
        :asked="dot.asked"
        size="medium"
        :interactive="false"
        :show-tooltip="false"
        :display-mode="dot.displayMode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusCircle from '../shared/StatusCircle.vue'

interface HistoryAttempt {
  type: 'correct' | 'wrong'
  time: number | null
}

interface Props {
  history: HistoryAttempt[]
}

const props = defineProps<Props>()

// Transform history data for StatusCircle components
const displayDots = computed(() => {
  // Take only the last 5 attempts
  const recentHistory = props.history.slice(-5)
  
  return recentHistory.map(attempt => {
    if (attempt.type === 'correct' && attempt.time !== null) {
      return {
        avgTime: attempt.time,
        wrongCount: 0,
        asked: true,
        displayMode: 'time' as const
      }
    } else {
      // Wrong answer
      return {
        avgTime: null,
        wrongCount: 1,
        asked: true,
        displayMode: 'wrong' as const
      }
    }
  })
})
</script>

<style scoped>
.history-dots {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.dots-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .dots-container {
    gap: 0.375rem;
  }
  
  .history-dots {
    margin-bottom: 1.5rem;
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .dots-container {
    gap: 0.75rem;
  }
}
</style>
