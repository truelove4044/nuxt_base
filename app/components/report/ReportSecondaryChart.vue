<template>
  <BaseCard class="report-chart report-chart--secondary">
    <header class="report-chart__header">
      <p class="report-chart__eyebrow">輔助圖</p>
      <h2 class="report-chart__title">{{ chartData?.title || "達成率與廣告投入" }}</h2>
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

const compactCurrency = new Intl.NumberFormat("zh-TW", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const hasData = computed(() => props.chartData?.series?.some((series) => series.points?.length));

const option = computed(() => {
  const series = props.chartData?.series || [];
  const labels = series[0]?.points?.map((point) => point.label) || [];

  return {
    color: ["#ee7d3b", "#69ba3a"],
    grid: {
      top: 68,
      right: 24,
      bottom: 30,
      left: 18,
      containLabel: true,
    },
    legend: {
      top: 18,
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
      formatter(params) {
        const rows = params.map((item) => {
          const suffix = item.seriesName === "達成率" ? "%" : "";
          const formattedValue =
            item.seriesName === "達成率"
              ? `${Number(item.value).toFixed(1)}%`
              : `NT$ ${compactCurrency.format(item.value)}`;

          return `${item.marker}${item.seriesName}：${formattedValue}${suffix}`;
        });

        return [params[0]?.axisValueLabel, ...rows].join("<br>");
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
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: "#76716f",
          formatter: (value) => `${value}%`,
        },
        splitLine: {
          lineStyle: {
            color: "rgba(118, 113, 111, 0.12)",
          },
        },
      },
      {
        type: "value",
        axisLabel: {
          color: "#76716f",
          formatter: (value) => compactCurrency.format(value),
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: series.map((entry) => ({
      name: entry.label,
      type: entry.type || "line",
      yAxisIndex: entry.label === "達成率" ? 0 : 1,
      smooth: entry.label === "達成率",
      symbolSize: entry.label === "達成率" ? 8 : 0,
      barMaxWidth: 24,
      lineStyle:
        entry.label === "達成率"
          ? {
              width: 3,
            }
          : undefined,
      itemStyle:
        entry.label === "廣告投入"
          ? {
              borderRadius: [12, 12, 0, 0],
              opacity: 0.85,
            }
          : undefined,
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
