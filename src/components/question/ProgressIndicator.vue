<template>
  <div class="progress-indicator">
    <span class="progress-text">{{ current }}/{{ total }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  current: number
  total: number
}

defineProps<Props>()
</script>

<style scoped>
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280; /* gray-500 */
  background-color: #f3f4f6; /* gray-100 */
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb; /* gray-200 */
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .progress-text {
    font-size: 0.75rem;
    padding: 0.125rem 0.5rem;
  }
}
</style>
