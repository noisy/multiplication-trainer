<template>
  <header class="question-header">
    <div class="header-container">
      <div class="header-content">
        <!-- Left: Back Button -->
        <div class="header-left">
          <BackButton
            variant="default"
            @click="handleBackClick"
          />
        </div>
        
        <!-- Center: Empty for now, could be used for question info -->
        <div class="header-center">
          <!-- Reserved for future use -->
        </div>
        
        <!-- Right: Progress Indicator (if in lesson) -->
        <div class="header-right">
          <ProgressIndicator
            v-if="lessonProgress"
            :current="lessonProgress.current"
            :total="lessonProgress.total"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import BackButton from '../shared/BackButton.vue'
import ProgressIndicator from './ProgressIndicator.vue'
import type { LessonProgress } from '../../stores/multiplicationStore'

interface Props {
  lessonProgress?: LessonProgress | null
}

defineProps<Props>()

const emit = defineEmits<{
  backClick: []
}>()

function handleBackClick() {
  emit('backClick')
}
</script>

<style scoped>
.question-header {
  background-color: white;
  border-bottom: 1px solid #e5e7eb; /* gray-200 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  height: 4rem;
  gap: 1rem;
}

.header-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.header-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header-right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .header-container {
    padding: 0 0.5rem;
  }
  
  .header-content {
    height: 3.5rem;
    gap: 0.5rem;
  }
}
</style>
