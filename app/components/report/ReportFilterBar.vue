<template>
  <BaseCard class="report-filter-bar">
    <div class="report-filter-bar__group">
      <p class="report-filter-bar__label">查看範圍</p>
      <div class="report-filter-bar__segmented" role="tablist" aria-label="國別切換">
        <button
          v-for="option in countryOptions"
          :key="option.value"
          class="report-filter-bar__pill"
          :class="{ 'is-active': country === option.value }"
          type="button"
          role="tab"
          :aria-selected="country === option.value"
          @click="$emit('update:country', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="report-filter-bar__group">
      <p class="report-filter-bar__label">時間區間</p>
      <div class="report-filter-bar__segmented" role="tablist" aria-label="時間區間">
        <button
          v-for="option in presetOptions"
          :key="option.value"
          class="report-filter-bar__pill"
          :class="{ 'is-active': rangePreset === option.value }"
          type="button"
          role="tab"
          :aria-selected="rangePreset === option.value"
          @click="$emit('update:rangePreset', option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div v-if="rangePreset === 'custom'" class="report-filter-bar__dates">
      <BaseInput
        label="開始日期"
        type="date"
        :model-value="startDate"
        :error="dateError"
        @update:model-value="$emit('update:startDate', $event)"
      />
      <BaseInput
        label="結束日期"
        type="date"
        :model-value="endDate"
        @update:model-value="$emit('update:endDate', $event)"
      />
    </div>
  </BaseCard>
</template>

<script setup>
const countryOptions = [
  { value: "all", label: "總覽" },
  { value: "indonesia", label: "印尼" },
  { value: "philippines", label: "菲律賓" },
];

const presetOptions = [
  { value: "last12m", label: "近 12 個月" },
  { value: "ytd", label: "今年累計" },
  { value: "custom", label: "自訂" },
];

defineEmits([
  "update:country",
  "update:rangePreset",
  "update:startDate",
  "update:endDate",
]);

defineProps({
  country: {
    type: String,
    required: true,
  },
  rangePreset: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  dateError: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.report-filter-bar {
  display: grid;
  gap: var(--space-5);
  padding: var(--space-5);
}

.report-filter-bar__group {
  display: grid;
  gap: var(--space-3);
}

.report-filter-bar__label {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 600;
}

.report-filter-bar__segmented {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.report-filter-bar__pill {
  min-height: 42px;
  padding: 0 var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.report-filter-bar__pill:hover,
.report-filter-bar__pill:focus-visible {
  border-color: rgba(var(--color-focus-ring-rgb), 0.6);
  color: var(--color-primary-700);
  transform: translateY(-1px);
}

.report-filter-bar__pill.is-active {
  border-color: transparent;
  background: linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600));
  color: #fff;
  box-shadow: var(--shadow-button-hover);
}

.report-filter-bar__dates {
  display: grid;
  gap: var(--space-4);
}

@media (min-width: 768px) {
  .report-filter-bar {
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1.2fr);
    align-items: start;
  }

  .report-filter-bar__dates {
    grid-column: 1 / -1;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
