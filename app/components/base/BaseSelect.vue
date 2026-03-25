<template>
  <div
    class="base-select"
    :class="{
      'is-disabled': disabled,
      'has-placeholder': showPlaceholder,
    }"
  >
    <label class="base-select__label" :for="selectId">{{ label }}</label>
    <div class="base-select__control">
      <select
        :id="selectId"
        class="base-select__field"
        :value="modelValue"
        :disabled="disabled"
        v-bind="$attrs"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span class="base-select__icon" aria-hidden="true">
        <Icon
          class="base-select__icon-svg"
          name="heroicons:chevron-up-down-20-solid"
        />
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, useId } from "vue";

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
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const fallbackId = useId();

const selectId = computed(() => props.id || fallbackId);
const normalizedOptions = computed(() =>
  props.options.map((option) => ({
    value: String(option?.value ?? ""),
    label: option?.label ?? "",
  })),
);
const showPlaceholder = computed(
  () => Boolean(props.placeholder) && !props.modelValue,
);

function onChange(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<style scoped>
.base-select {
  display: grid;
  gap: var(--space-2);
}

.base-select__label {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 20px;
}

.base-select__control {
  position: relative;
}

.base-select__field {
  width: 100%;
  min-height: 52px;
  padding: 0 60px 0 var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.96) 0%,
    rgba(247, 248, 244, 0.92) 100%
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 10px 24px rgba(48, 60, 35, 0.06);
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 20px;
  appearance: none;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease;
}

.base-select__field:hover {
  border-color: var(--color-border-strong);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.76),
    0 12px 28px rgba(48, 60, 35, 0.08);
}

.base-select__field:focus-visible {
  outline: 0;
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 4px rgba(var(--color-focus-ring-rgb), 0.2);
}

.base-select__icon {
  position: absolute;
  top: 50%;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(var(--color-primary-600-rgb), 0.14);
  border-radius: 999px;
  background: rgba(var(--color-primary-600-rgb), 0.08);
  color: var(--color-primary-700);
  pointer-events: none;
  transform: translateY(-50%);
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.base-select__icon-svg {
  width: 16px;
  height: 16px;
}

.base-select__control:hover .base-select__icon {
  border-color: rgba(var(--color-primary-600-rgb), 0.22);
  background: rgba(var(--color-primary-600-rgb), 0.12);
}

.has-placeholder .base-select__field {
  color: var(--color-text-muted);
}

.is-disabled .base-select__field {
  background: rgba(241, 244, 236, 0.86);
  color: var(--color-text-soft);
  box-shadow: none;
  cursor: not-allowed;
}

.is-disabled .base-select__icon {
  border-color: rgba(155, 152, 148, 0.14);
  background: rgba(155, 152, 148, 0.08);
  color: var(--color-text-soft);
}
</style>
