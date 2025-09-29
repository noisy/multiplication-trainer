<template>
  <button
    class="correct-button"
    @click="handleClick"
    :disabled="disabled"
    type="button"
    :aria-label="'Mark answer as correct'"
  >
    <!-- Checkmark Icon -->
    <svg
      class="button-icon"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M5 13l4 4L19 7"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
.correct-button {
  /* Size and layout */
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Styling */
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border: 4px solid #15803d;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3),
              0 4px 16px rgba(0, 0, 0, 0.1),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);

  /* Animation */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);

  /* Touch */
  touch-action: manipulation;
  cursor: pointer;
}

.correct-button:hover {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border-color: #166534;
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.4),
              0 6px 20px rgba(0, 0, 0, 0.15),
              inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.correct-button:active {
  background: linear-gradient(135deg, #15803d 0%, #166534 100%);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.2),
              0 2px 8px rgba(0, 0, 0, 0.1),
              inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(1px) scale(0.98);
}

.correct-button:disabled {
  background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
  border-color: #6b7280;
  box-shadow: 0 4px 16px rgba(156, 163, 175, 0.2);
  cursor: not-allowed;
  opacity: 0.6;
  transform: translateY(0);
}

.button-icon {
  width: 64px;
  height: 64px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.correct-button:disabled .button-icon {
  color: #d1d5db;
}

/* Focus styles for accessibility */
.correct-button:focus {
  outline: 3px solid #fbbf24;
  outline-offset: 3px;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .correct-button {
    width: 120px;
    height: 120px;
  }

  .button-icon {
    width: 56px;
    height: 56px;
  }
}
</style>
