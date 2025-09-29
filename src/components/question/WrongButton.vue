<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    :disabled="disabled"
    type="button"
    :aria-label="'Mark answer as wrong'"
  >
    <!-- X Icon -->
    <svg
      class="w-16 h-16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="3"
        d="M6 18L18 6M6 6l12 12"
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
  'w-32 h-32',
  'text-white font-semibold',
  'rounded-3xl',
  'transition-all duration-200',
  'touch-manipulation',
  'shadow-xl',
  'border-4',
  props.disabled
    ? 'cursor-not-allowed opacity-50'
    : 'hover:shadow-2xl active:scale-90'
])

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
button {
  background-color: #ef4444 !important; /* red-500 */
  border-color: #dc2626 !important; /* red-600 */
}

button:hover {
  background-color: #dc2626 !important; /* red-600 */
  border-color: #b91c1c !important; /* red-700 */
}

button:active {
  background-color: #b91c1c !important; /* red-700 */
}

button:disabled {
  background-color: #9ca3af !important; /* gray-400 */
  border-color: #9ca3af !important; /* gray-400 */
  transform: none !important;
}

/* Focus styles for accessibility */
button:focus {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
}
</style>
