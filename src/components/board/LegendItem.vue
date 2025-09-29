<template>
  <div class="flex items-center space-x-2">
    <div
      class="w-4 h-4 rounded-full flex-shrink-0"
      :style="{ backgroundColor: color }"
    ></div>
    <div class="text-sm text-gray-700">
      <span class="font-medium">{{ label }}</span>
      <span v-if="example" class="text-gray-500 ml-1">({{ example }})</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  color: string
  label: string
  example?: string
}

defineProps<Props>()
</script>
