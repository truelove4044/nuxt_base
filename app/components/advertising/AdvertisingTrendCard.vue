<template>
  <BaseCard class="advertising-trend-card">
    <header class="advertising-trend-card__header">
      <div class="advertising-trend-card__title-wrap">
        <ReportSectionTitle
          :eyebrow="cardData?.eyebrow || '趨勢分析'"
          :title="cardData?.title || '指標趨勢'"
        />
      </div>

      <div class="advertising-trend-card__headline">
        <p class="advertising-trend-card__headline-value">
          {{ formattedHeadlineValue }}
        </p>
        <p class="advertising-trend-card__headline-meta">近 12 個月走勢</p>
      </div>
    </header>

    <div v-if="hasData" class="advertising-trend-card__body">
      <VChart class="advertising-trend-card__canvas" :option="option" autoresize />

      <div class="advertising-trend-card__legend" aria-label="圖例">
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="advertising-trend-card__legend-item"
        >
          <span
            class="advertising-trend-card__legend-swatch"
            :class="`advertising-trend-card__legend-swatch--${item.type}`"
            :style="{ '--legend-color': item.color }"
            aria-hidden="true"
          />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <div v-else class="advertising-trend-card__empty">
      暫時沒有趨勢資料
    </div>
  </BaseCard>
</template>

<script setup>
  import { computed } from "vue";
  import { VChart } from "~/lib/echarts";

  const props = defineProps({
    cardData: {
      type: Object,
      default: null,
    },
  });

  const paletteMap = {
    cost: {
      bar: "rgba(222, 108, 108, 0.38)",
      line: "#bf5656",
    },
    ctr: {
      bar: "rgba(109, 185, 255, 0.46)",
      line: "#2e8bd8",
    },
    cvrAct: {
      bar: "rgba(255, 210, 72, 0.48)",
      line: "#d6a508",
    },
    cvrOrder: {
      bar: "rgba(140, 214, 164, 0.48)",
      line: "#2f9f5b",
    },
  };

  const numberFormatter = new Intl.NumberFormat("zh-TW");
  const compactFormatter = new Intl.NumberFormat("zh-TW", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  function formatValue(value, unit) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    if (unit === "currency") {
      return `NT$ ${compactFormatter.format(value)}`;
    }

    if (unit === "percent") {
      return `${Number(value).toFixed(2)}%`;
    }

    if (unit === "decimal") {
      return Number(value).toFixed(2);
    }

    return numberFormatter.format(Math.round(value));
  }

  const palette = computed(
    () => paletteMap[props.cardData?.key] || paletteMap.cost,
  );

  const hasData = computed(() =>
    props.cardData?.series?.some((series) => series.points?.length),
  );

  const formattedHeadlineValue = computed(() =>
    formatValue(props.cardData?.headlineValue, props.cardData?.headlineUnit),
  );

  const legendItems = computed(() =>
    (props.cardData?.series || []).map((series) => ({
      label: series.label,
      type: series.type,
      color: series.type === "bar" ? palette.value.bar : palette.value.line,
    })),
  );

  const option = computed(() => {
    const labels = props.cardData?.series?.[0]?.points?.map((point) => point.label) || [];
    const barSeries = props.cardData?.series?.find((series) => series.type === "bar");
    const lineSeries = props.cardData?.series?.find((series) => series.type === "line");

    const formatAxisValue = (value, unit) => {
      if (unit === "currency") {
        return compactFormatter.format(value);
      }

      if (unit === "percent") {
        return `${Number(value).toFixed(1)}%`;
      }

      return compactFormatter.format(value);
    };

    return {
      animationDuration: 420,
      color: [palette.value.bar, palette.value.line],
      grid: {
        top: 18,
        right: 8,
        bottom: 8,
        left: 4,
        containLabel: true,
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(32, 32, 28, 0.92)",
        borderWidth: 0,
        textStyle: {
          color: "#ffffff",
        },
        formatter(params) {
          const rows = params.map((item) => {
            const unit = item.seriesName === lineSeries?.label
              ? lineSeries?.unit
              : barSeries?.unit;

            return `${item.marker}${item.seriesName}：${formatValue(Number(item.value), unit)}`;
          });

          return [params[0]?.axisValueLabel, ...rows].join("<br>");
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: "rgba(118, 113, 111, 0.18)",
          },
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
            formatter: (value) => formatAxisValue(value, barSeries?.unit),
          },
          splitLine: {
            lineStyle: {
              color: "rgba(118, 113, 111, 0.1)",
            },
          },
        },
        {
          type: "value",
          axisLabel: {
            color: "#76716f",
            formatter: (value) => formatAxisValue(value, lineSeries?.unit),
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: barSeries?.label || "柱狀值",
          type: "bar",
          data: barSeries?.points?.map((point) => point.value) || [],
          barMaxWidth: 18,
          itemStyle: {
            color: palette.value.bar,
            borderRadius: [7, 7, 0, 0],
          },
          emphasis: {
            focus: "series",
          },
        },
        {
          name: lineSeries?.label || "折線值",
          type: "line",
          data: lineSeries?.points?.map((point) => point.value) || [],
          yAxisIndex: 1,
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          lineStyle: {
            width: 2.5,
            color: palette.value.line,
          },
          itemStyle: {
            color: palette.value.line,
            borderColor: "#fffefb",
            borderWidth: 2,
          },
          emphasis: {
            focus: "series",
          },
        },
      ],
    };
  });
</script>

<style scoped>
  .advertising-trend-card {
    display: grid;
    gap: var(--space-4);
    padding: var(--space-5);
  }

  .advertising-trend-card__header {
    display: grid;
    gap: var(--space-3);
  }

  .advertising-trend-card__headline {
    display: grid;
    gap: 4px;
  }

  .advertising-trend-card__headline-value {
    font-family: "Manrope", "Noto Sans TC", sans-serif;
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.04em;
  }

  .advertising-trend-card__headline-meta {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .advertising-trend-card__body {
    display: grid;
    gap: var(--space-3);
  }

  .advertising-trend-card__canvas {
    min-height: 220px;
  }

  .advertising-trend-card__legend {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .advertising-trend-card__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .advertising-trend-card__legend-swatch {
    position: relative;
    display: inline-flex;
    width: 22px;
    height: 12px;
    flex: 0 0 auto;
  }

  .advertising-trend-card__legend-swatch--bar {
    border-radius: 4px 4px 0 0;
    background: var(--legend-color);
  }

  .advertising-trend-card__legend-swatch--line::before {
    position: absolute;
    top: 50%;
    right: 0;
    left: 0;
    height: 3px;
    border-radius: 999px;
    background: var(--legend-color);
    content: "";
    transform: translateY(-50%);
  }

  .advertising-trend-card__legend-swatch--line::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 7px;
    height: 7px;
    border: 2px solid var(--legend-color);
    border-radius: 50%;
    background: #fffefb;
    content: "";
    transform: translate(-50%, -50%);
  }

  .advertising-trend-card__empty {
    display: grid;
    place-items: center;
    min-height: 220px;
    border: 1px dashed rgba(118, 113, 111, 0.22);
    border-radius: 20px;
    color: var(--color-text-muted);
    background: rgba(255, 255, 255, 0.72);
  }

  @media (min-width: 768px) {
    .advertising-trend-card {
      padding: var(--space-6);
    }
  }
</style>
