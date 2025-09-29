<template>
  <button
    :class="buttonClasses"
    @click="handleClick"
    :disabled="disabled"
    type="button"
  >
    <span class="font-bold text-lg">Start Lesson (10 Questions)</span>
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

const buttonClasses = computed(() => {
  const baseClasses = [
    'w-full',
    'flex',
    'items-center',
    'justify-center',
    'px-6',
    'py-4',
    'rounded-lg',
    'text-white',
    'font-semibold',
    'transition-all',
    'duration-200',
    'touch-button',
    'focus:outline-none',
    'focus:ring-4',
    'focus:ring-blue-300'
  ]
  
  if (props.disabled) {
    baseClasses.push(
      'bg-gray-400',
      'cursor-not-allowed',
      'opacity-60'
    )
  } else {
    baseClasses.push(
      'bg-blue-600',
      'hover:bg-blue-700',
      'active:bg-blue-800',
      'shadow-lg',
      'hover:shadow-xl',
      'transform',
      'hover:scale-105',
      'active:scale-95'
    )
  }
  
  return baseClasses
})

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
button:disabled {
  transform: none !important;
}
</style>
