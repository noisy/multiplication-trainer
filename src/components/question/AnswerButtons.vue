<template>
  <div class="answer-buttons">
    <div class="buttons-container">
      <WrongButton
        :disabled="disabled"
        @click="handleWrongClick"
      />
      <CorrectButton
        :disabled="disabled"
        @click="handleCorrectClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import WrongButton from './WrongButton.vue'
import CorrectButton from './CorrectButton.vue'

interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  answer: [{ correct: boolean }]
}>()

function handleWrongClick() {
  emit('answer', { correct: false })
}

function handleCorrectClick() {
  emit('answer', { correct: true })
}
</script>

<style scoped>
.answer-buttons {
  width: 100%;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttons-container {
  display: flex;
  gap: 4rem;
  justify-content: center;
  align-items: center;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .answer-buttons {
    padding: 0.75rem;
  }
  
  .buttons-container {
    gap: 0.75rem;
  }
}

/* Tablet and up - larger buttons */
@media (min-width: 768px) {
  .buttons-container {
    gap: 1.5rem;
    max-width: 500px;
  }
}

/* Desktop - even larger spacing */
@media (min-width: 1024px) {
  .buttons-container {
    gap: 2rem;
    max-width: 600px;
  }
}
</style>
