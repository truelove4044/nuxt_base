<template>
  <div class="report-kpi-grid">
    <BaseCard
      v-for="item in displayItems"
      :key="item.key"
      class="report-kpi-grid__card"
      :class="[`trend-${item.trend || 'neutral'}`, { 'is-loading': loading }]"
    >
      <p class="report-kpi-grid__label">{{ item.label }}</p>
      <p class="report-kpi-grid__value">{{ loading ? "載入中…" : item.formattedValue }}</p>
      <div class="report-kpi-grid__meta">
        <span class="report-kpi-grid__delta">{{ loading ? "—" : item.delta }}</span>
        <span class="report-kpi-grid__helper">{{ loading ? "整理資料中" : item.helper }}</span>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const fallbackItems = [
  { key: "revenue", label: "累計營業額", formattedValue: "--", delta: "--", helper: "" },
  { key: "achievementRate", label: "目標達成率", formattedValue: "--", delta: "--", helper: "" },
  { key: "forecast", label: "本月預測", formattedValue: "--", delta: "--", helper: "" },
  { key: "adSpend", label: "廣告投入", formattedValue: "--", delta: "--", helper: "" },
];

const displayItems = computed(() =>
  props.items.length > 0 ? props.items : fallbackItems,
);
</script>

<style scoped>
.report-kpi-grid {
  display: grid;
  gap: var(--space-4);
}

.report-kpi-grid__card {
  position: relative;
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5);
  overflow: hidden;
}

.report-kpi-grid__card::after {
  position: absolute;
  inset: auto -24px -42px auto;
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(105, 186, 58, 0.14), transparent 70%);
  content: "";
  pointer-events: none;
}

.report-kpi-grid__label {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  font-weight: 600;
}

.report-kpi-grid__value {
  font-family: "Manrope", "Noto Sans TC", sans-serif;
  font-size: clamp(1.65rem, 2vw, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.04em;
}

.report-kpi-grid__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-3);
  align-items: center;
}

.report-kpi-grid__delta {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: var(--text-sm);
  font-weight: 700;
}

.report-kpi-grid__helper {
  color: var(--color-text-soft);
  font-size: var(--text-sm);
}

.trend-up .report-kpi-grid__delta {
  background: rgba(90, 164, 69, 0.14);
  color: var(--color-success);
}

.trend-down .report-kpi-grid__delta {
  background: rgba(var(--color-danger-rgb), 0.12);
  color: var(--color-danger);
}

.trend-neutral .report-kpi-grid__delta {
  background: rgba(118, 113, 111, 0.12);
  color: var(--color-text-muted);
}

.is-loading {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.82;
  }

  50% {
    opacity: 1;
  }
}

@media (min-width: 640px) {
  .report-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .report-kpi-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
