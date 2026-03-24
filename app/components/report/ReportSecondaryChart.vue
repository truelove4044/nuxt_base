<template>
  <BaseCard class="report-chart report-chart--secondary">
    <header class="report-chart__header">
      <ReportSectionTitle
        eyebrow="輔助圖"
        :title="chartData?.title || '達成率與廣告投入'"
      />
    </header>

    <div v-if="!hasData" class="report-chart__empty">
      <slot name="empty" />
    </div>

    <template v-else>
      <div class="report-chart__body">
        <ClientOnly>
          <VChart class="report-chart__canvas" :option="option" autoresize />

          <template #fallback>
            <div
              class="report-chart__canvas report-chart__canvas--placeholder"
              aria-hidden="true"
            />
          </template>
        </ClientOnly>

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

const compactCurrency = new Intl.NumberFormat("zh-TW", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const hasData = computed(() => props.chartData?.series?.some((series) => series.points?.length));

const legendItems = computed(() =>
  (props.chartData?.series || []).map((entry) => ({
    label: entry.label,
    style: entry.label === "達成率" ? "rate" : "ad-spend",
  })),
);

const option = computed(() => {
  const series = props.chartData?.series || [];
  const labels = series[0]?.points?.map((point) => point.label) || [];

  return {
    color: ["#ee7d3b", "#69ba3a"],
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
            right: 24,
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
              borderRadius: [6, 6, 0, 0],
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

.report-chart__legend-swatch--rate {
  color: #ee7d3b;
}

.report-chart__legend-swatch--rate::before {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: #ee7d3b;
  content: "";
  transform: translateY(-50%);
}

.report-chart__legend-swatch--rate::after {
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

.report-chart__legend-swatch--ad-spend {
  border-radius: 4px 4px 0 0;
  background: rgba(105, 186, 58, 0.92);
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
