<template>
  <BaseCard
    :class="[
      'pie-breakdown-card',
      {
        'pie-breakdown-card--compact': compact,
      },
    ]"
  >
    <header class="pie-breakdown-card__header">
      <ReportSectionTitle :eyebrow="eyebrow" :title="title" />
      <p v-if="meta" class="pie-breakdown-card__meta">{{ meta }}</p>
    </header>

    <div
      v-if="hasItems"
      :class="[
        'pie-panel',
        {
          'pie-panel--compact': compact,
        },
      ]"
    >
      <VChart
        :class="[
          'pie-panel__chart',
          {
            'pie-panel__chart--compact': compact,
          },
        ]"
        :option="option"
        autoresize
      />

      <ul class="pie-panel__legend" :aria-label="`${title}清單`">
        <li
          v-for="item in normalizedItems"
          :key="item.key"
          class="pie-panel__legend-item"
        >
          <span
            class="pie-panel__swatch"
            :style="{ backgroundColor: item.color }"
            aria-hidden="true"
          />
          <div class="pie-panel__legend-copy">
            <p class="pie-panel__brand">{{ item.label }}</p>
            <p v-if="item.secondaryText" class="pie-panel__units">
              {{ item.secondaryText }}
            </p>
          </div>
          <p class="pie-panel__share">{{ formatShare(item.share) }}</p>
        </li>
      </ul>
    </div>

    <div v-else class="pie-breakdown-card__empty-inline">
      <p class="pie-breakdown-card__empty-title">{{ emptyTitle }}</p>
      <p class="pie-breakdown-card__empty-description">
        {{ emptyDescription }}
      </p>
    </div>
  </BaseCard>
</template>

<script setup>
  import { computed } from "vue";
  import { VChart } from "~/lib/echarts";

  const props = defineProps({
    eyebrow: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    meta: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => [],
    },
    emptyTitle: {
      type: String,
      default: "目前沒有占比資料",
    },
    emptyDescription: {
      type: String,
      default: "資料回補後會顯示此區塊的占比結構。",
    },
    tooltipValueFormatter: {
      type: Function,
      default: null,
    },
    showOuterLabels: {
      type: Boolean,
      default: true,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  });

  const hasItems = computed(() => props.items.length > 0);

  const normalizedItems = computed(() =>
    props.items.map((item) => ({
      ...item,
      share: Number.isFinite(item.share) ? Number(item.share) : 0,
      secondaryText: item.secondaryText || "",
    })),
  );

  function formatShare(value) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    return `${Number(value).toFixed(1)}%`;
  }

  function formatTooltipValue(params) {
    if (typeof props.tooltipValueFormatter === "function") {
      return props.tooltipValueFormatter(params);
    }

    return Number.isFinite(params.value) ? params.value : "--";
  }

  const option = computed(() => ({
    color: normalizedItems.value.map((item) => item.color),
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(32, 32, 28, 0.92)",
      borderWidth: 0,
      textStyle: {
        color: "#ffffff",
      },
      formatter(params) {
        return `${params.name}<br/>${formatTooltipValue(params)} (${Number(
          params.percent,
        ).toFixed(1)}%)`;
      },
    },
    legend: {
      show: false,
    },
    media: [
      {
        query: {
          maxWidth: 767,
        },
        option: {
          series: [
            {
              radius: ["42%", "70%"],
              label: {
                fontSize: 13,
              },
              labelLine: {
                length: 11,
                length2: 16,
              },
            },
          ],
        },
      },
      {
        query: {
          minWidth: 768,
        },
        option: {
          series: [
            {
              radius: ["45%", "74%"],
              label: {
                fontSize: 14,
              },
              labelLine: {
                length: 15,
                length2: 24,
              },
            },
          ],
        },
      },
      {
        query: {
          minWidth: 1180,
        },
        option: {
          series: [
            {
              radius: ["46%", "76%"],
              label: {
                fontSize: 15,
              },
              labelLine: {
                length: 18,
                length2: 32,
              },
            },
          ],
        },
      },
    ],
    series: [
      {
        name: props.title,
        type: "pie",
        radius: ["45%", "74%"],
        center: ["50%", "50%"],
        minAngle: 4,
        minShowLabelAngle: 3,
        avoidLabelOverlap: true,
        labelLayout: {
          hideOverlap: true,
          moveOverlap: "shiftY",
        },
        itemStyle: {
          borderColor: "#fffefb",
          borderWidth: 2,
        },
        label: {
          show: props.showOuterLabels,
          position: "outside",
          formatter: "{b} {d}%",
          color: "#595757",
          lineHeight: 20,
          fontFamily: "Manrope, Noto Sans TC, sans-serif",
          fontWeight: 700,
        },
        labelLine: {
          show: props.showOuterLabels,
          smooth: false,
          length: 15,
          length2: 24,
          lineStyle: {
            width: 1.2,
          },
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
        },
        data: normalizedItems.value.map((item) => ({
          name: item.label,
          value: item.value,
          itemStyle: {
            color: item.color,
          },
        })),
      },
    ],
  }));
</script>

<style scoped>
  .pie-breakdown-card {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-5);
  }

  .pie-breakdown-card__header {
    display: grid;
    gap: var(--space-2);
  }

  .pie-breakdown-card--compact {
    gap: var(--space-4);
    padding: var(--space-4);
  }

  .pie-breakdown-card__meta {
    color: var(--color-text-muted);
    font-size: var(--text-base);
    font-weight: 600;
  }

  .pie-breakdown-card__empty-inline {
    display: grid;
    gap: var(--space-2);
    align-content: center;
    justify-items: center;
    min-height: 220px;
    border: 1px dashed rgba(118, 113, 111, 0.24);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.72);
    text-align: center;
    padding: var(--space-6);
  }

  .pie-breakdown-card__empty-title {
    font-size: var(--text-lg);
    font-weight: 700;
  }

  .pie-breakdown-card__empty-description {
    color: var(--color-text-muted);
    max-width: 32ch;
  }

  .pie-panel {
    display: grid;
    gap: var(--space-5);
  }

  .pie-panel--compact {
    gap: var(--space-3);
  }

  .pie-panel__chart {
    height: min(74vw, 440px);
    min-height: 320px;
  }

  .pie-panel__chart--compact {
    height: min(52vw, 280px);
    min-height: 220px;
  }

  .pie-panel__legend {
    display: grid;
    gap: var(--space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .pie-panel__legend-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border: 1px solid rgba(196, 201, 186, 0.48);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.72);
  }

  .pie-panel__swatch {
    display: inline-flex;
    width: 12px;
    height: 12px;
    border-radius: 999px;
  }

  .pie-panel__legend-copy {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .pie-panel__brand {
    font-size: var(--text-lg);
    font-weight: 700;
  }

  .pie-panel__units {
    color: var(--color-text-muted);
    font-size: var(--text-base);
  }

  .pie-panel__share {
    font-family: "Manrope", "Noto Sans TC", sans-serif;
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--color-primary-700);
  }

  @media (min-width: 768px) {
    .pie-breakdown-card {
      padding: var(--space-6);
    }

    .pie-breakdown-card--compact {
      padding: var(--space-5);
    }
  }

  @media (min-width: 960px) {
    .pie-panel__chart {
      height: 400px;
    }

    .pie-panel__chart--compact {
      height: 240px;
      min-height: 240px;
    }
  }
</style>
