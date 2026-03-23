<template>
  <div
    class="base-input"
    :class="{
      'is-error': Boolean(error),
      'is-disabled': disabled,
      'has-suffix': hasSuffix,
    }"
  >
    <label class="base-input__label" :for="inputId">{{ label }}</label>
    <div class="base-input__control">
      <input
        :id="inputId"
        ref="inputRef"
        class="base-input__field"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="describedBy"
        v-bind="$attrs"
        @input="onInput"
      />
      <div v-if="hasSuffix" class="base-input__suffix">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="!error && hint" :id="hintId" class="base-input__hint">
      {{ hint }}
    </p>
    <p
      v-if="error"
      :id="errorId"
      class="base-input__error"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, ref, useId, useSlots } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  autocomplete: {
    type: String,
    default: "",
  },
  hint: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const slots = useSlots();
const fallbackId = useId();
const inputRef = ref(null);

const inputId = computed(() => props.id || fallbackId);
const hintId = computed(() => `${inputId.value}-hint`);
const errorId = computed(() => `${inputId.value}-error`);
const hasSuffix = computed(() => Boolean(slots.suffix));
const describedBy = computed(() => {
  if (props.error) return errorId.value;
  if (props.hint) return hintId.value;
  return undefined;
});

function onInput(event) {
  emit("update:modelValue", event.target.value);
}

function focusInput() {
  inputRef.value?.focus();
}

defineExpose({
  focusInput,
});
</script>

<style scoped>
.base-input {
  display: grid;
  gap: var(--space-2);
}

.base-input__label {
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 20px;
}

.base-input__control {
  position: relative;
}

.base-input__field {
  width: 100%;
  min-height: 52px;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--text-base);
  line-height: 24px;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.has-suffix .base-input__field {
  padding-right: 80px;
}

.base-input__field::placeholder {
  color: var(--color-text-soft);
}

.base-input__field:hover {
  border-color: var(--color-border-strong);
}

.base-input__field:focus-visible {
  outline: 0;
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 4px rgba(var(--color-focus-ring-rgb), 0.24);
}

.base-input__suffix {
  position: absolute;
  top: 50%;
  right: var(--space-3);
  transform: translateY(-50%);
}

.base-input__hint,
.base-input__error {
  font-size: var(--text-sm);
  line-height: 20px;
}

.base-input__hint {
  color: var(--color-text-muted);
}

.base-input__error {
  color: var(--color-danger);
}

.is-error .base-input__field {
  border-color: var(--color-danger);
}

.is-error .base-input__field:focus-visible {
  box-shadow: 0 0 0 4px rgba(var(--color-danger-rgb), 0.14);
}

.is-disabled .base-input__field {
  background: var(--color-surface-muted);
  color: var(--color-text-soft);
  cursor: not-allowed;
}
</style>
