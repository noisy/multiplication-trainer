<template>
  <div class="app-card py-2">
    <div class="grid-container">
      <!-- Grid with headers -->
      <div 
        class="multiplication-grid"
        :style="gridStyle"
      >
        <!-- Empty top-left corner -->
        <div class="grid-header"></div>
        
        <!-- Column headers (2-12) -->
        <div
          v-for="m in range"
          :key="`header-col-${m}`"
          class="grid-header"
        >
          {{ m }}
        </div>
        
        <!-- Rows with row headers and question circles -->
        <template v-for="n in range" :key="`row-${n}`">
          <!-- Row header -->
          <div class="grid-header">
            {{ n }}
          </div>
          
          <!-- Question circles for this row -->
          <StatusCircle
            v-for="m in range"
            :key="`${n}x${m}`"
            :n="n"
            :m="m"
            :avg-time="getQuestionAvgTime(n, m)"
            :wrong-count="getQuestionWrongCount(n, m)"
            :asked="getQuestionAsked(n, m)"
            size="small"
            :interactive="true"
            :show-tooltip="false"
            display-mode="time"
            @click="handleQuestionClick(n, m)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StatusCircle from '../shared/StatusCircle.vue'
import { MULTIPLICATION_RANGE } from '../../utils/constants'
import type { QuestionWithStats } from '../../stores/multiplicationStore'

interface Props {
  questions: QuestionWithStats[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  questionClick: [{ n: number; m: number }]
}>()

// Create range array for headers
const range = computed(() => {
  const arr = []
  for (let i = MULTIPLICATION_RANGE.MIN; i <= MULTIPLICATION_RANGE.MAX; i++) {
    arr.push(i)
  }
  return arr
})

// Grid style for responsive layout
const gridStyle = computed(() => {
  const cols = range.value.length + 1 // +1 for row headers
  return {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
  }
})

// Helper functions to get question data
function getQuestionData(n: number, m: number): QuestionWithStats | undefined {
  return props.questions.find(q => q.n === n && q.m === m)
}

function getQuestionAvgTime(n: number, m: number): number | null {
  const question = getQuestionData(n, m)
  return question?.avgTime ?? null
}

function getQuestionWrongCount(n: number, m: number): number {
  const question = getQuestionData(n, m)
  return question?.wrongCount ?? 0
}

function getQuestionAsked(n: number, m: number): boolean {
  const question = getQuestionData(n, m)
  return question?.asked ?? false
}

function handleQuestionClick(n: number, m: number) {
  emit('questionClick', { n, m })
}
</script>

<style scoped>
.grid-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.multiplication-grid {
  display: grid;
  gap: 2px;
  min-width: fit-content;
  margin: 0 auto;
}

.grid-header {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .multiplication-grid {
    gap: 4px;
  }
  
  .grid-header {
    width: 40px;
    height: 40px;
    font-size: 0.875rem;
  }
}

@media (min-width: 1024px) {
  .multiplication-grid {
    gap: 6px;
  }
  
  .grid-header {
    width: 48px;
    height: 48px;
    font-size: 1rem;
  }
}
</style>
