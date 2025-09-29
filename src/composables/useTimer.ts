import { ref, onUnmounted } from 'vue'
import { TIMER_INTERVAL } from '../utils/constants'

export function useTimer() {
  const elapsedTime = ref(0)
  const startTime = ref<number | null>(null)
  const timerInterval = ref<number | null>(null)

  function start(): void {
    startTime.value = Date.now()
    elapsedTime.value = 0
    
    timerInterval.value = window.setInterval(() => {
      if (startTime.value) {
        elapsedTime.value = (Date.now() - startTime.value) / 1000
      }
    }, TIMER_INTERVAL)
  }

  function stop(): number {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    
    const timeSpent = elapsedTime.value
    startTime.value = null
    elapsedTime.value = 0
    
    return timeSpent
  }

  function reset(): void {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    startTime.value = null
    elapsedTime.value = 0
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
  })

  return {
    elapsedTime,
    start,
    stop,
    reset
  }
}
