<template>
  <div class="history-section">
    <div class="history-header">
      <h3 class="history-title">Last 5 answers</h3>
    </div>
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
    <div v-if="averageTime !== null" class="average-time-section">
      <div class="average-time-text">
        Average correct answer time:
        <StatusCircle
          :avg-time="averageTime"
          :wrong-count="0"
          :asked="true"
          size="medium"
          :interactive="false"
          :show-tooltip="false"
          display-mode="time"
        />
      </div>
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
  averageTime: number | null
}

const props = defineProps<Props>()

// Transform history data for StatusCircle components - always show 5 dots
const displayDots = computed(() => {
  const maxDots = 5

  // Take only the last 5 attempts
  const recentHistory = props.history.slice(-maxDots)

  // Map actual history to dots
  const actualDots = recentHistory.map(attempt => {
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

  // Fill remaining slots with empty grey dots
  const emptyDotsCount = maxDots - actualDots.length
  const emptyDots = Array(emptyDotsCount).fill(null).map(() => ({
    avgTime: null,
    wrongCount: 0,
    asked: false,
    displayMode: 'empty' as const
  }))

  // Return actual dots first, then empty dots
  return [...actualDots, ...emptyDots]
})
</script>

<style scoped>
.history-section {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.history-header {
  text-align: center;
  margin-bottom: 0.75rem;
}

.history-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.average-time-section {
  margin-top: 1rem;
  text-align: center;
}

.average-time-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
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

  .history-section {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
  }

  .history-title {
    font-size: 0.75rem;
  }

  .average-time-text {
    font-size: 0.75rem;
    gap: 0.375rem;
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .dots-container {
    gap: 0.75rem;
  }

  .history-section {
    padding: 1.25rem;
  }

  .history-title {
    font-size: 1rem;
  }

  .average-time-text {
    font-size: 1rem;
    gap: 0.75rem;
  }
}
</style>
