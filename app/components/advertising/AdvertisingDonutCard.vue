<template>
  <BaseCard class="advertising-donut-card">
    <header class="advertising-donut-card__header">
      <ReportSectionTitle
        :eyebrow="breakdown?.eyebrow || 'TOP5'"
        :title="breakdown?.title || '成效佔比'"
      />
    </header>

    <div v-if="hasItems" class="advertising-donut-card__body">
      <VChart class="advertising-donut-card__chart" :option="option" autoresize />

      <ol class="advertising-donut-card__legend">
        <li
          v-for="item in breakdown.items"
          :key="item.key"
          class="advertising-donut-card__legend-item"
        >
          <span class="advertising-donut-card__legend-rank">{{ item.rank }}</span>
          <span
            class="advertising-donut-card__legend-swatch"
            :style="{ backgroundColor: item.color }"
            aria-hidden="true"
          />
          <div class="advertising-donut-card__legend-copy">
            <p class="advertising-donut-card__legend-label">{{ item.label }}</p>
            <p class="advertising-donut-card__legend-value">
              {{ item.formattedValue }}
            </p>
          </div>
          <p class="advertising-donut-card__legend-share">{{ item.share }}%</p>
        </li>
      </ol>
    </div>

    <div v-else class="advertising-donut-card__empty">暫時沒有分布資料</div>
  </BaseCard>
</template>

<script setup>
  import { computed } from "vue";
  import { VChart } from "~/lib/echarts";

  const props = defineProps({
    breakdown: {
      type: Object,
      default: null,
    },
  });

  const hasItems = computed(() => Boolean(props.breakdown?.items?.length));

  const option = computed(() => ({
    animationDuration: 420,
    color: (props.breakdown?.items || []).map((item) => item.color),
    tooltip: {
      trigger: "item",
      backgroundColor: "rgba(32, 32, 28, 0.92)",
      borderWidth: 0,
      textStyle: {
        color: "#ffffff",
      },
      formatter(params) {
        return `${params.name}<br/>${params.data.formattedValue} (${params.percent.toFixed(1)}%)`;
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        type: "pie",
        radius: ["48%", "80%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: true,
        label: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
        },
        itemStyle: {
          borderColor: "#fffefb",
          borderWidth: 2,
        },
        data: (props.breakdown?.items || []).map((item) => ({
          name: item.label,
          value: item.value,
          formattedValue: item.formattedValue,
          itemStyle: {
            color: item.color,
          },
        })),
      },
    ],
  }));
</script>

<style scoped>
  .advertising-donut-card {
    display: grid;
    gap: var(--space-4);
    padding: var(--space-5);
  }

  .advertising-donut-card__body {
    display: grid;
    gap: var(--space-4);
  }

  .advertising-donut-card__chart {
    min-height: 220px;
  }

  .advertising-donut-card__legend {
    display: grid;
    gap: var(--space-3);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .advertising-donut-card__legend-item {
    display: grid;
    grid-template-columns: auto auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--space-3);
  }

  .advertising-donut-card__legend-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: rgba(241, 244, 236, 0.92);
    color: var(--color-text-muted);
    font-family: "Manrope", "Noto Sans TC", sans-serif;
    font-weight: 800;
    font-size: 0.82rem;
  }

  .advertising-donut-card__legend-swatch {
    width: 12px;
    height: 12px;
    border-radius: 999px;
  }

  .advertising-donut-card__legend-copy {
    min-width: 0;
  }

  .advertising-donut-card__legend-label {
    font-size: var(--text-sm);
    font-weight: 700;
  }

  .advertising-donut-card__legend-value {
    color: var(--color-text-muted);
    font-size: 0.82rem;
  }

  .advertising-donut-card__legend-share {
    font-family: "Manrope", "Noto Sans TC", sans-serif;
    font-size: var(--text-base);
    font-weight: 800;
    color: var(--color-primary-700);
    font-variant-numeric: tabular-nums;
  }

  .advertising-donut-card__empty {
    display: grid;
    place-items: center;
    min-height: 220px;
    border: 1px dashed rgba(118, 113, 111, 0.22);
    border-radius: 20px;
    color: var(--color-text-muted);
    background: rgba(255, 255, 255, 0.72);
  }

  @media (min-width: 768px) {
    .advertising-donut-card {
      padding: var(--space-6);
    }
  }
</style>


