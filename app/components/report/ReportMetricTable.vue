<template>
  <BaseCard class="report-metric-table">
    <header class="report-metric-table__header">
      <div>
        <p class="report-metric-table__eyebrow">明細表</p>
        <h2 class="report-metric-table__title">月別指標明細</h2>
      </div>
    </header>

    <div v-if="!rows.length" class="report-metric-table__empty">
      <slot name="empty" />
    </div>

    <template v-else>
      <div class="report-metric-table__desktop">
        <table>
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                :class="`align-${column.align || 'left'}`"
              >
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row.month">
              <td
                v-for="column in columns"
                :key="`${row.month}-${column.key}`"
                :class="`align-${column.align || 'left'}`"
              >
                {{ formatValue(row[column.key], column.format) }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td
                v-for="column in columns"
                :key="`total-${column.key}`"
                :class="`align-${column.align || 'left'}`"
              >
                {{
                  formatValue(
                    totals?.[column.key],
                    column.format,
                    column.key === "month",
                  )
                }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="report-metric-table__mobile">
        <article
          v-for="row in rows"
          :key="`${row.month}-mobile`"
          class="report-metric-table__card"
        >
          <h3 class="report-metric-table__card-title">{{ row.month }}</h3>
          <dl class="report-metric-table__card-list">
            <template
              v-for="column in detailColumns"
              :key="`${row.month}-${column.key}-mobile`"
            >
              <dt>{{ column.label }}</dt>
              <dd>{{ formatValue(row[column.key], column.format) }}</dd>
            </template>
          </dl>
        </article>
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
  import { computed } from "vue";

  const compactCurrency = new Intl.NumberFormat("zh-TW");

  const props = defineProps({
    columns: {
      type: Array,
      default: () => [],
    },
    rows: {
      type: Array,
      default: () => [],
    },
    totals: {
      type: Object,
      default: null,
    },
  });

  const detailColumns = computed(() =>
    props.columns.filter((column) => column.key !== "month"),
  );

  function formatValue(value, format, rawText = false) {
    if (rawText) {
      return value || "--";
    }

    if (value === null || value === undefined || value === "") {
      return "--";
    }

    if (format === "currency") {
      return `NT$ ${compactCurrency.format(Math.round(value))}`;
    }

    if (format === "percent") {
      return `${Number(value).toFixed(1)}%`;
    }

    return value;
  }
</script>

<style scoped>
  .report-metric-table {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-5);
  }

  .report-metric-table__header {
    display: grid;
    gap: var(--space-3);
  }

  .report-metric-table__eyebrow {
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .report-metric-table__title {
    font-size: clamp(1.3rem, 2vw, 1.7rem);
  }

  .report-metric-table__desktop {
    display: none;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-variant-numeric: tabular-nums;
  }

  th,
  td {
    padding: 14px 16px;
    border-bottom: 1px solid rgba(118, 113, 111, 0.12);
    white-space: nowrap;
  }

  th {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: 700;
  }

  tbody tr:hover {
    background: rgba(105, 186, 58, 0.05);
  }

  tfoot td {
    color: var(--color-primary-700);
    font-weight: 700;
  }

  .align-right {
    text-align: right;
  }

  .align-left {
    text-align: left;
  }

  .report-metric-table__mobile {
    display: grid;
    gap: var(--space-4);
  }

  .report-metric-table__card {
    padding: var(--space-4);
    border: 1px solid rgba(118, 113, 111, 0.12);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.72);
  }

  .report-metric-table__card-title {
    margin-bottom: var(--space-3);
    font-size: var(--text-lg);
  }

  .report-metric-table__card-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
  }

  .report-metric-table__card-list dt {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .report-metric-table__card-list dd {
    margin: 0;
    font-weight: 600;
    text-align: right;
  }

  @media (min-width: 960px) {
    .report-metric-table {
      padding: var(--space-6);
    }

    .report-metric-table__header {
      grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
      align-items: end;
    }

    .report-metric-table__desktop {
      display: block;
    }

    .report-metric-table__mobile {
      display: none;
    }
  }
</style>
