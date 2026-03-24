<template>
  <BaseCard class="report-chart">
    <header class="report-chart__header">
      <p class="report-chart__eyebrow">主圖</p>
      <h2 class="report-chart__title">{{ chartData?.title || "月營收 vs 目標" }}</h2>
    </header>

    <div v-if="!hasData" class="report-chart__empty">
      <slot name="empty" />
    </div>

    <ClientOnly v-else fallback-tag="div">
      <VChart class="report-chart__canvas" :option="option" autoresize />
    </ClientOnly>
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

const option = computed(() => {
  const series = props.chartData?.series || [];
  const labels = series[0]?.points?.map((point) => point.label) || [];

  return {
    color: ["#4f9828", "#d8ddcf", "#ee7d3b"],
    grid: {
      top: 68,
      right: 18,
      bottom: 30,
      left: 18,
      containLabel: true,
    },
    legend: {
      top: 18,
      data: ["營收", "預測", "目標"],
      textStyle: {
        color: "#76716f",
      },
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
              borderRadius: [12, 12, 0, 0],
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
  gap: var(--space-5);
  min-height: 420px;
  padding: var(--space-5);
}

.report-chart__header {
  display: grid;
  gap: var(--space-3);
}

.report-chart__eyebrow {
  color: var(--color-accent);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.report-chart__title {
  font-size: clamp(1.3rem, 2vw, 1.7rem);
}

.report-chart__canvas,
.report-chart__empty {
  min-height: 300px;
}

@media (min-width: 768px) {
  .report-chart {
    padding: var(--space-6);
  }
}
</style>
