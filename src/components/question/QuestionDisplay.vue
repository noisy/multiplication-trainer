<template>
  <div class="question-display">
    <span class="question-text">{{ n }} × {{ m }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  n: number
  m: number
}

defineProps<Props>()
</script>

<style scoped>
.question-display {
  text-align: center;
  margin-bottom: 1rem;
}

.question-text {
  font-size: 3rem;
  font-weight: 700;
  color: #2563eb; /* blue-600 */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.2;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .question-text {
    font-size: 2.5rem;
  }
}

/* Tablet */
@media (min-width: 768px) {
  .question-text {
    font-size: 3.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .question-text {
    font-size: 4rem;
  }
}
</style>
