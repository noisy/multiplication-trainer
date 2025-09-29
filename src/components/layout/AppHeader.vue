<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left slot for back button -->
        <div class="flex items-center">
          <slot name="left"></slot>
        </div>
        
        <!-- Center slot for title or question info -->
        <div class="flex-1 flex items-center justify-center">
          <slot name="center">
            <h1 v-if="currentView === 'board'" class="text-xl font-bold text-gray-900">
              Multiplication Table Teacher
            </h1>
          </slot>
        </div>
        
        <!-- Right slot for progress indicator -->
        <div class="flex items-center">
          <slot name="right">
            <div v-if="lessonProgress" class="text-sm font-medium text-gray-600">
              {{ lessonProgress.current }}/{{ lessonProgress.total }}
            </div>
          </slot>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { LessonProgress } from '../../stores/multiplicationStore'

interface Props {
  currentView: 'board' | 'question'
  lessonProgress?: LessonProgress | null
}

defineProps<Props>()

const emit = defineEmits<{
  navigateBack: []
}>()
</script>
