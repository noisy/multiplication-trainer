<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    :disabled="disabled"
    type="button"
    :aria-label="'Mark answer as correct'"
  >
    <!-- Checkmark Icon -->
    <svg
      class="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => [
  'flex items-center justify-center',
  'px-6 py-4',
  'text-white font-semibold',
  'rounded-lg',
  'transition-all duration-200',
  'touch-manipulation',
  'min-h-[56px]', // Minimum touch target
  'shadow-lg',
  props.disabled
    ? 'bg-gray-400 cursor-not-allowed opacity-50'
    : 'bg-green-500 hover:bg-green-600 active:bg-green-700 hover:shadow-xl active:scale-95'
])

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
/* Additional mobile-specific styles */
@media (max-width: 640px) {
  button {
    font-size: 1.125rem;
    padding: 1rem 1.5rem;
  }
}

/* Focus styles for accessibility */
button:focus {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
}
</style>
