<template>
  <div class="app-card p-2">
    <h3 class="text-lg font-semibold text-gray-800 mb-3">Performance Legend</h3>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <LegendItem
        v-for="item in legendItems"
        :key="item.label"
        :color="item.color"
        :label="item.label"
        :example="item.example"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LegendItem from './LegendItem.vue'
import { PERFORMANCE_COLORS } from '../../utils/constants'
import { useColorCalculation } from '../../composables/useColorCalculation'

const { getColorName } = useColorCalculation()

const legendItems = computed(() => [
  {
    color: PERFORMANCE_COLORS.GREY,
    label: 'Not attempted',
    example: ''
  },
  {
    color: PERFORMANCE_COLORS.GREEN,
    label: 'Excellent',
    example: '≤3s'
  },
  {
    color: PERFORMANCE_COLORS.LIME,
    label: 'Good',
    example: '≤5s'
  },
  {
    color: PERFORMANCE_COLORS.YELLOW,
    label: 'Okay or slow',
    example: '≤10s or >10s'
  },
  {
    color: PERFORMANCE_COLORS.RED,
    label: 'Wrong answers',
    example: 'Incorrect'
  }
])
</script>
