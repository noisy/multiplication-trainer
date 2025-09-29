<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useMultiplicationStore } from './stores/multiplicationStore'
import BoardView from './views/BoardView.vue'
import QuestionView from './views/QuestionView.vue'

const store = useMultiplicationStore()

// Initialize the app
onMounted(() => {
  store.loadStats()
})

// Computed property for current view
const currentView = computed(() => store.currentView)
</script>

<template>
  <div id="app">
    <!-- Render current view based on store state -->
    <BoardView v-if="currentView === 'board'" />
    <QuestionView v-else-if="currentView === 'question'" />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Global app card styles */
.app-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* Touch-friendly button styles */
.touch-button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
  user-select: none;
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Ensure proper box-sizing */
*, *::before, *::after {
  box-sizing: border-box;
}

/* Remove default margins and paddings */
body, h1, h2, h3, h4, h5, h6, p {
  margin: 0;
  padding: 0;
}

/* Improve button defaults */
button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: inherit;
  background: transparent;
  border: 0;
  cursor: pointer;
}

/* Improve input defaults */
input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
</style>
