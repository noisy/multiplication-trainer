<template>
  <div class="timer-display">
    <span class="timer-text">{{ formattedTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  elapsedTime: number
}

const props = defineProps<Props>()

// Format time to 1 decimal place
const formattedTime = computed(() => {
  return `${props.elapsedTime.toFixed(1)}s`
})
</script>

<style scoped>
.timer-display {
  text-align: center;
  margin-bottom: 1rem;
}

.timer-text {
  font-size: 1.5rem;
  font-weight: 500;
  color: #6b7280; /* gray-500 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .timer-text {
    font-size: 1.25rem;
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .timer-text {
    font-size: 1.75rem;
  }
}
</style>
