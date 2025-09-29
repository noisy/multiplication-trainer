<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    type="button"
    aria-label="Go back"
  >
    <svg
      class="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 19l-7-7 7-7"
      />
    </svg>
    <span v-if="variant === 'default'" class="ml-2">Back</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'minimal'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const emit = defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'touch-button',
    'flex',
    'items-center',
    'justify-center',
    'text-gray-600',
    'hover:text-gray-800',
    'hover:bg-gray-100',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-opacity-50'
  ]
  
  if (props.variant === 'minimal') {
    baseClasses.push('p-2', 'rounded-full')
  } else {
    baseClasses.push('px-4', 'py-2', 'rounded-lg', 'bg-white', 'shadow-sm', 'border', 'border-gray-200')
  }
  
  return baseClasses
})

function handleClick() {
  emit('click')
}
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>
