<template>
  <div
    :class="circleClasses"
    :style="{ backgroundColor: backgroundColor }"
    @click="handleClick"
    @mouseenter="showTooltip && (tooltipVisible = true)"
    @mouseleave="showTooltip && (tooltipVisible = false)"
    :title="showTooltip ? tooltipText : undefined"
  >
    {{ displayText }}
    
    <!-- Tooltip for detailed stats -->
    <div
      v-if="showTooltip && tooltipVisible"
      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-10"
    >
      {{ tooltipText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useColorCalculation } from '../../composables/useColorCalculation'

interface Props {
  avgTime?: number | null
  wrongCount?: number
  asked?: boolean
  size?: 'small' | 'medium' | 'large'
  interactive?: boolean
  showTooltip?: boolean
  displayMode?: 'time' | 'wrong' | 'empty'
  n?: number
  m?: number
}

const props = withDefaults(defineProps<Props>(), {
  avgTime: null,
  wrongCount: 0,
  asked: false,
  size: 'medium',
  interactive: false,
  showTooltip: false,
  displayMode: 'time'
})

const emit = defineEmits<{
  click: []
}>()

const { getPerformanceColor, formatTime } = useColorCalculation()
const tooltipVisible = ref(false)

// Computed properties
const backgroundColor = computed(() => {
  const stats = {
    times: props.avgTime ? [props.avgTime] : [],
    wrongCount: props.wrongCount,
    asked: props.asked
  }
  return getPerformanceColor(stats, props.avgTime)
})

const displayText = computed(() => {
  switch (props.displayMode) {
    case 'wrong':
      return '✗'
    case 'empty':
      return ''
    case 'time':
    default:
      return props.avgTime ? formatTime(props.avgTime) : ''
  }
})

const tooltipText = computed(() => {
  if (!props.n || !props.m) return ''
  
  const parts = [`${props.n}×${props.m}`]
  
  if (props.avgTime) {
    parts.push(`Avg: ${props.avgTime.toFixed(1)}s`)
  }
  
  if (props.wrongCount > 0) {
    parts.push(`Wrong: ${props.wrongCount}`)
  }
  
  if (!props.asked) {
    parts.push('Not attempted')
  }
  
  return parts.join('\n')
})

const circleClasses = computed(() => {
  const baseClasses = ['status-circle', 'relative']
  
  // Size classes
  switch (props.size) {
    case 'small':
      baseClasses.push('w-7', 'h-7', 'text-xs')
      break
    case 'medium':
      baseClasses.push('w-10', 'h-10', 'text-sm')
      break
    case 'large':
      baseClasses.push('w-14', 'h-14', 'text-base')
      break
  }
  
  // Interactive classes
  if (props.interactive) {
    baseClasses.push('cursor-pointer', 'hover:scale-105', 'transition-transform', 'duration-200')
  }
  
  return baseClasses
})

// Event handlers
function handleClick() {
  if (props.interactive) {
    emit('click')
  }
}
</script>

<style scoped>
.status-circle {
  user-select: none;
}

.status-circle:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
</style>
