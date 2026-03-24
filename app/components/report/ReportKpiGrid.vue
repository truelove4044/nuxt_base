<template>
  <div class="report-kpi-grid">
    <BaseCard
      v-for="item in animatedItems"
      :key="item.key"
      class="report-kpi-grid__card"
      :class="[`trend-${item.trend || 'neutral'}`, { 'is-loading': loading }]"
    >
      <p class="report-kpi-grid__label">{{ item.label }}</p>
      <p class="report-kpi-grid__value">{{ item.displayValue }}</p>
      <div class="report-kpi-grid__meta">
        <span class="report-kpi-grid__delta">{{ item.showLoadingMeta ? "—" : item.delta }}</span>
        <span class="report-kpi-grid__helper">{{ item.showLoadingMeta ? "整理資料中" : item.helper }}</span>
      </div>
    </BaseCard>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

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
  { key: "revenue", label: "累計營業額", value: null, formattedValue: "--", delta: "--", helper: "" },
  { key: "achievementRate", label: "目標達成率", value: null, formattedValue: "--", delta: "--", helper: "" },
  { key: "forecast", label: "本月預測", value: null, formattedValue: "--", delta: "--", helper: "" },
  { key: "adSpend", label: "廣告投入", value: null, formattedValue: "--", delta: "--", helper: "" },
];

const sourceItems = computed(() =>
  props.items.length > 0 ? props.items : fallbackItems,
);

const currencyFormatter = new Intl.NumberFormat("zh-TW");
const animatedValues = reactive({});
const prefersReducedMotion = ref(false);
const hasInitializedAnimation = ref(false);
const frameHandles = new Map();
let motionMediaQuery;
let onMotionPreferenceChange;

function parseNumericValue(item) {
  return Number.isFinite(item?.value) ? Number(item.value) : null;
}

function getInitialAnimatedValue(targetValue) {
  return targetValue >= 0 ? 0 : targetValue * 1.2;
}

function formatAnimatedValue(item, value) {
  if (!Number.isFinite(value)) {
    return item.formattedValue || "--";
  }

  if (item.unit === "percent" || item.key === "achievementRate") {
    return `${value.toFixed(1)}%`;
  }

  if (
    item.unit === "TWD" ||
    item.key === "revenue" ||
    item.key === "forecast" ||
    item.key === "adSpend"
  ) {
    return `NT$ ${currencyFormatter.format(Math.round(value))}`;
  }

  return currencyFormatter.format(Math.round(value));
}

function stopAnimation(key) {
  const frameId = frameHandles.get(key);

  if (frameId) {
    cancelAnimationFrame(frameId);
    frameHandles.delete(key);
  }
}

function animateValue(key, from, to, duration = 560) {
  stopAnimation(key);

  if (
    prefersReducedMotion.value ||
    !Number.isFinite(from) ||
    !Number.isFinite(to)
  ) {
    animatedValues[key] = to;
    return;
  }

  const start = performance.now();
  const delta = to - from;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    animatedValues[key] = from + delta * eased;

    if (progress < 1) {
      const nextFrameId = requestAnimationFrame(tick);
      frameHandles.set(key, nextFrameId);
      return;
    }

    animatedValues[key] = to;
    frameHandles.delete(key);
  };

  const frameId = requestAnimationFrame(tick);
  frameHandles.set(key, frameId);
}

function syncAnimatedValues(animate = false) {
  sourceItems.value.forEach((item) => {
    const targetValue = parseNumericValue(item);

    if (!Number.isFinite(targetValue)) {
      return;
    }

    const currentValue = animatedValues[item.key];

    if (!Number.isFinite(currentValue)) {
      if (animate) {
        const startValue = getInitialAnimatedValue(targetValue);
        animatedValues[item.key] = startValue;
        animateValue(item.key, startValue, targetValue);
        return;
      }

      animatedValues[item.key] = targetValue;
      return;
    }

    if (!animate || Math.abs(targetValue - currentValue) < 0.05) {
      animatedValues[item.key] = targetValue;
      return;
    }

    animateValue(item.key, currentValue, targetValue);
  });
}

const animatedItems = computed(() =>
  sourceItems.value.map((item) => {
    const hasAnimatedValue = Number.isFinite(animatedValues[item.key]);

    return {
      ...item,
      displayValue: hasAnimatedValue
        ? formatAnimatedValue(item, animatedValues[item.key])
        : props.loading
          ? "載入中…"
          : item.formattedValue || "--",
      showLoadingMeta: props.loading && !hasAnimatedValue,
    };
  }),
);

watch(
  sourceItems,
  () => {
    if (!props.loading) {
      syncAnimatedValues(true);
    }
  },
  { deep: true },
);

watch(
  () => props.loading,
  (isLoading, wasLoading) => {
    if (!isLoading) {
      const shouldAnimate = !hasInitializedAnimation.value || Boolean(wasLoading);
      syncAnimatedValues(shouldAnimate);
      hasInitializedAnimation.value = true;
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (typeof window === "undefined") {
    return;
  }

  motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion.value = motionMediaQuery.matches;
  onMotionPreferenceChange = (event) => {
    prefersReducedMotion.value = event.matches;
  };

  if (typeof motionMediaQuery.addEventListener === "function") {
    motionMediaQuery.addEventListener("change", onMotionPreferenceChange);
    return;
  }

  motionMediaQuery.addListener(onMotionPreferenceChange);
});

onBeforeUnmount(() => {
  frameHandles.forEach((frameId) => {
    cancelAnimationFrame(frameId);
  });
  frameHandles.clear();

  if (!motionMediaQuery || !onMotionPreferenceChange) {
    return;
  }

  if (typeof motionMediaQuery.removeEventListener === "function") {
    motionMediaQuery.removeEventListener("change", onMotionPreferenceChange);
    return;
  }

  motionMediaQuery.removeListener(onMotionPreferenceChange);
});
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
  font-variant-numeric: tabular-nums;
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
