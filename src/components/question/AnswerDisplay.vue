<template>
  <div class="answer-display">
    <span class="answer-text">= {{ answer }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  answer: number
}

defineProps<Props>()
</script>

<style scoped>
.answer-display {
  text-align: center;
  margin-bottom: 2rem;
}

.answer-text {
  font-size: 2rem;
  font-weight: 600;
  color: #6b7280; /* gray-500 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .answer-text {
    font-size: 1.75rem;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .answer-text {
    font-size: 2.25rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .answer-text {
    font-size: 2.5rem;
  }
}
</style>
