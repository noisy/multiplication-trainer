<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
    <!-- Header -->
    <AppHeader
      current-view="board"
      @navigate-back="handleNavigateBack"
    >
      <template #center>
        <h1 class="text-xl font-bold text-gray-800">Multiplication Table Teacher</h1>
      </template>
    </AppHeader>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6 space-y-6">
      <!-- Lesson Button -->
      <div class="flex justify-center">
        <LessonButton
          :disabled="false"
          @click="handleStartLesson"
        />
      </div>

      <!-- Multiplication Grid -->
      <MultiplicationGrid
        :questions="questionsWithStats"
        @question-click="handleQuestionClick"
      />

      <!-- Color Legend -->
      <ColorLegend />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMultiplicationStore } from '../stores/multiplicationStore'
import AppHeader from '../components/layout/AppHeader.vue'
import LessonButton from '../components/board/LessonButton.vue'
import MultiplicationGrid from '../components/board/MultiplicationGrid.vue'
import ColorLegend from '../components/board/ColorLegend.vue'

const store = useMultiplicationStore()

// Computed properties
const questionsWithStats = computed(() => store.getAllQuestionsWithStats)

// Event handlers
function handleNavigateBack() {
  // BoardView is the main view, no back navigation needed
  // This could be used for future features like settings
}

function handleStartLesson() {
  store.startLesson()
}

function handleQuestionClick(payload: { n: number; m: number }) {
  const { n, m } = payload
  store.startQuestion(n, m)
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Mobile-first responsive design */
@media (max-width: 640px) {
  .container {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style>
