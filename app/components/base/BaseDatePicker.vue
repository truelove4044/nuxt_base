<template>
  <div
    class="base-date-picker"
    :class="{
      'is-error': Boolean(error),
      'is-disabled': disabled,
    }"
  >
    <label class="base-date-picker__label">
      <span class="base-date-picker__label-text">{{ label }}</span>
      <VueDatePicker
        :model-value="modelValue"
        class="base-date-picker__control"
        model-type="yyyy-MM-dd"
        :locale="zhTW"
        :formats="formats"
        :time-config="timeConfig"
        :min-date="parsedMinDate"
        :max-date="parsedMaxDate"
        :teleport="true"
        :action-row="actionRow"
        :auto-apply="true"
        :clearable="false"
        :disabled="disabled"
        @update:model-value="emit('update:modelValue', $event || '')"
      />
    </label>
    <p
      v-if="error"
      class="base-date-picker__error"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
  import { computed } from "vue";
  import { zhTW } from "date-fns/locale/zh-TW";
  import { VueDatePicker } from "@vuepic/vue-datepicker";

  const formats = {
    input: "yyyy/MM/dd",
  };

  const timeConfig = {
    enableTimePicker: false,
  };

  const actionRow = {
    showSelect: false,
    showCancel: false,
    showPreview: false,
    showNow: false,
  };

  const props = defineProps({
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: "",
    },
    minDate: {
      type: String,
      default: "",
    },
    maxDate: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
  });

  const emit = defineEmits(["update:modelValue"]);

  function parseDateString(value) {
    if (!value) {
      return undefined;
    }

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
      return undefined;
    }

    return new Date(year, month - 1, day);
  }

  const parsedMinDate = computed(() => parseDateString(props.minDate));
  const parsedMaxDate = computed(() => parseDateString(props.maxDate));
</script>

<style scoped>
  .base-date-picker {
    --dp-font-family: "Noto Sans TC", sans-serif;
    --dp-font-size: var(--text-base);
    --dp-border-radius: 16px;
    --dp-cell-border-radius: 12px;
    --dp-background-color: var(--color-surface);
    --dp-text-color: var(--color-text);
    --dp-hover-color: rgba(var(--color-primary-600-rgb), 0.08);
    --dp-hover-text-color: var(--color-primary-700);
    --dp-hover-icon-color: var(--color-primary-700);
    --dp-primary-color: var(--color-primary-600);
    --dp-primary-text-color: #fff;
    --dp-primary-disabled-color: rgba(var(--color-primary-600-rgb), 0.42);
    --dp-secondary-color: var(--color-text-soft);
    --dp-border-color: var(--color-border);
    --dp-menu-border-color: color-mix(
      in srgb,
      var(--color-border) 92%,
      #ffffff
    );
    --dp-border-color-hover: var(--color-border-strong);
    --dp-border-color-focus: var(--color-primary-600);
    --dp-disabled-color: var(--color-surface-muted);
    --dp-disabled-color-text: var(--color-text-soft);
    --dp-icon-color: var(--color-text-muted);
    --dp-danger-color: var(--color-danger);
    --dp-success-color: var(--color-success);
    --dp-highlight-color: rgba(var(--color-primary-600-rgb), 0.12);
    --dp-range-between-dates-background-color: rgba(
      var(--color-primary-600-rgb),
      0.1
    );
    --dp-range-between-dates-text-color: var(--color-primary-700);
    --dp-range-between-border-color: rgba(var(--color-primary-600-rgb), 0.18);
    --dp-menu-padding: 10px;
    --dp-input-padding: 13px 42px 13px 16px;
    --dp-input-not-clearable-padding: 16px;
    --dp-action-row-padding: 10px;
    --dp-cell-size: 38px;
    display: grid;
    gap: var(--space-2);
  }

  .base-date-picker__label {
    display: grid;
    gap: var(--space-2);
  }

  .base-date-picker__label-text {
    color: var(--color-text);
    font-size: var(--text-sm);
    font-weight: 500;
    line-height: 20px;
  }

  .base-date-picker__error {
    color: var(--color-danger);
    font-size: var(--text-sm);
    line-height: 20px;
  }

  .base-date-picker :deep(.dp__main) {
    width: 100%;
  }

  .base-date-picker :deep(.dp__theme_light) {
    font-family: var(--dp-font-family);
  }

  .base-date-picker :deep(.dp__input) {
    min-height: 52px;
    border-radius: 16px;
    color: var(--color-text);
    line-height: 24px;
    box-shadow: none;
  }

  .base-date-picker :deep(.dp__input:hover:not(.dp__input_focus)) {
    border-color: var(--color-border-strong);
  }

  .base-date-picker :deep(.dp__input_focus) {
    box-shadow: 0 0 0 4px rgba(var(--color-focus-ring-rgb), 0.24);
  }

  .base-date-picker :deep(.dp__menu) {
    border-radius: 20px;
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  .base-date-picker :deep(.dp__arrow_top),
  .base-date-picker :deep(.dp__arrow_bottom) {
    background-color: var(--color-surface);
  }

  .base-date-picker :deep(.dp__calendar_header) {
    color: var(--color-text);
  }

  .base-date-picker :deep(.dp__month_year_select),
  .base-date-picker :deep(.dp__inner_nav) {
    transition:
      background-color 0.18s ease,
      color 0.18s ease;
  }

  .base-date-picker :deep(.dp__month_year_select:hover),
  .base-date-picker :deep(.dp__inner_nav:hover) {
    transform: none;
  }

  .base-date-picker :deep(.dp__cell_inner) {
    transition:
      background-color 0.18s ease,
      color 0.18s ease,
      border-color 0.18s ease;
  }

  .base-date-picker :deep(.dp__cell_inner:hover) {
    transform: none;
  }

  .base-date-picker :deep(.dp__active_date),
  .base-date-picker :deep(.dp__range_start),
  .base-date-picker :deep(.dp__range_end),
  .base-date-picker :deep(.dp__overlay_cell_active) {
    box-shadow: var(--shadow-button-hover);
  }

  .base-date-picker :deep(.dp__today) {
    border-color: var(--color-primary-600);
    color: var(--color-primary-700);
  }

  .base-date-picker :deep(.dp__action_row) {
    border-top: 1px solid rgba(196, 201, 186, 0.58);
  }

  .base-date-picker :deep(.dp--tp-wrap),
  .base-date-picker :deep([data-test-id="open-time-picker-btn"]) {
    display: none;
  }

  .base-date-picker.is-error {
    --dp-border-color: var(--color-danger);
    --dp-border-color-hover: var(--color-danger);
    --dp-border-color-focus: var(--color-danger);
  }

  .base-date-picker.is-error :deep(.dp__input_focus) {
    box-shadow: 0 0 0 4px rgba(var(--color-danger-rgb), 0.14);
  }

  .base-date-picker.is-disabled :deep(.dp__input) {
    cursor: not-allowed;
  }

  .base-date-picker :deep(.dp__time_picker),
  .base-date-picker :deep(.dp__action_row) {
    display: none !important;
  }
</style>
