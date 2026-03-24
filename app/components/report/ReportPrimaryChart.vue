<template>
  <BaseCard class="report-chart">
    <header class="report-chart__header">
      <ReportSectionTitle
        eyebrow="主圖"
        :title="chartData?.title || '月營收 vs 目標'"
      />
    </header>

    <div v-if="!hasData" class="report-chart__empty">
      <slot name="empty" />
    </div>

    <template v-else>
      <div class="report-chart__body">
        <VChart class="report-chart__canvas" :option="option" autoresize />

        <div class="report-chart__legend" aria-label="圖例">
          <div
            v-for="item in legendItems"
            :key="item.label"
            class="report-chart__legend-item"
          >
            <span
              class="report-chart__legend-swatch"
              :class="`report-chart__legend-swatch--${item.style}`"
              aria-hidden="true"
            />
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { computed } from "vue";
import { VChart } from "~/lib/echarts";

const props = defineProps({
  chartData: {
    type: Object,
    default: null,
  },
});

function formatCurrency(value) {
  return `NT$ ${new Intl.NumberFormat("zh-TW", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;
}

const hasData = computed(() => props.chartData?.series?.some((series) => series.points?.length));

const legendItems = computed(() =>
  (props.chartData?.series || []).map((entry) => ({
    label: entry.label,
    style:
      entry.label === "預測"
        ? "forecast"
        : entry.label === "目標"
          ? "target"
          : "actual",
  })),
);

const option = computed(() => {
  const series = props.chartData?.series || [];
  const labels = series[0]?.points?.map((point) => point.label) || [];

  return {
    color: ["#4f9828", "#d8ddcf", "#ee7d3b"],
    grid: {
      top: 16,
      right: 8,
      bottom: 8,
      left: 8,
      containLabel: true,
    },
    media: [
      {
        query: {
          minWidth: 768,
        },
        option: {
          grid: {
            top: 20,
            right: 18,
            bottom: 12,
            left: 18,
            containLabel: true,
          },
        },
      },
    ],
    legend: {
      show: false,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(32, 32, 28, 0.9)",
      borderWidth: 0,
      textStyle: {
        color: "#fff",
      },
      valueFormatter(value) {
        return typeof value === "number" ? formatCurrency(value) : value;
      },
    },
    xAxis: {
      type: "category",
      data: labels,
      axisLine: {
        lineStyle: {
          color: "rgba(118, 113, 111, 0.25)",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#76716f",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: "#76716f",
        formatter: (value) =>
          new Intl.NumberFormat("zh-TW", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(value),
      },
      splitLine: {
        lineStyle: {
          color: "rgba(118, 113, 111, 0.12)",
        },
      },
    },
    series: series.map((entry) => ({
      name: entry.label,
      type: entry.type || "line",
      smooth: entry.type !== "bar",
      symbolSize: entry.type === "bar" ? 0 : 8,
      barMaxWidth: 24,
      z: entry.label === "營收" ? 4 : entry.label === "預測" ? 5 : 1,
      itemStyle:
        entry.label === "目標"
          ? {
              color: "rgba(196, 201, 186, 0.62)",
              borderRadius: [6, 6, 0, 0],
            }
          : entry.label === "預測"
            ? {
                color: "#ee7d3b",
                borderColor: "#fffefb",
                borderWidth: 2,
              }
            : undefined,
      lineStyle:
        entry.label === "預測"
          ? {
              type: "dashed",
              width: 2.5,
            }
          : {
              width: entry.label === "營收" ? 4 : 3,
            },
      areaStyle:
        entry.label === "營收"
          ? {
              color: "rgba(79, 152, 40, 0.12)",
            }
          : undefined,
      emphasis: {
        focus: "series",
      },
      data: entry.points.map((point) => point.value),
    })),
  };
});
</script>

<style scoped>
.report-chart {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5);
}

.report-chart__header {
  display: block;
}

.report-chart__body {
  display: grid;
  gap: var(--space-2);
}

.report-chart__canvas,
.report-chart__empty {
  min-height: 240px;
}

.report-chart__canvas--placeholder {
  border-radius: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(241, 244, 236, 0.92) 100%);
}

.report-chart__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
  min-height: 24px;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.report-chart__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.report-chart__legend-swatch {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  width: 24px;
  height: 12px;
}

.report-chart__legend-swatch--actual::before,
.report-chart__legend-swatch--forecast::before {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 3px;
  border-radius: 999px;
  content: "";
  transform: translateY(-50%);
}

.report-chart__legend-swatch--actual::before {
  background: #4f9828;
}

.report-chart__legend-swatch--actual::after,
.report-chart__legend-swatch--forecast::after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  border: 2px solid currentColor;
  border-radius: 50%;
  background: #fffefb;
  content: "";
  transform: translate(-50%, -50%);
}

.report-chart__legend-swatch--actual {
  color: #4f9828;
}

.report-chart__legend-swatch--forecast {
  color: #ee7d3b;
}

.report-chart__legend-swatch--forecast::before {
  background:
    repeating-linear-gradient(
      90deg,
      #ee7d3b 0 7px,
      transparent 7px 11px
    );
}

.report-chart__legend-swatch--target {
  border-radius: 4px;
  background: rgba(196, 201, 186, 0.88);
}

@media (min-width: 768px) {
  .report-chart {
    padding: var(--space-6);
  }

  .report-chart__canvas,
  .report-chart__empty {
    min-height: 280px;
  }
}

@media (min-width: 1280px) {
  .report-chart__canvas,
  .report-chart__empty {
    min-height: 300px;
  }
}
</style>
