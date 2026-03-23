<template>
  <button
    class="base-button"
    :class="[`base-button--${variant}`, { 'is-pending': pending }]"
    :disabled="disabled || pending"
    v-bind="$attrs"
  >
    <span v-if="pending" class="base-button__spinner" aria-hidden="true"></span>
    <span class="base-button__label">
      <template v-if="pending">
        {{ pendingLabel }}
      </template>
      <slot v-else>
        {{ label }}
      </slot>
    </span>
  </button>
</template>

<script setup>
defineOptions({
  inheritAttrs: false,
});

defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  label: {
    type: String,
    default: "",
  },
  pendingLabel: {
    type: String,
    default: "處理中…",
  },
  pending: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  min-height: 52px;
  padding: 0 var(--space-5);
  border-radius: 16px;
  background: var(--color-primary-600);
  color: #fff;
  font-size: var(--text-base);
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.14s ease;
}

.base-button:hover {
  background: var(--color-primary-700);
  box-shadow: var(--shadow-button-hover);
}

.base-button:active {
  transform: translateY(1px);
}

.base-button:focus-visible {
  outline: 0;
  box-shadow:
    0 0 0 4px rgba(142, 173, 146, 0.32),
    var(--shadow-button-hover);
}

.base-button:disabled {
  background: #8fa493;
  color: rgba(255, 255, 255, 0.9);
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.base-button__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.34);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.base-button__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
