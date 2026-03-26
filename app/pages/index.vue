<template>
  <main id="main-content" class="report-page">
    <section class="report-page__hero">
      <div class="report-page__copy">
        <h1 class="report-page__title">營運報表總覽</h1>
      </div>
    </section>

    <ReportFilterBar
      :country="reportStore.country"
      :range-preset="reportStore.rangePreset"
      :start-date="reportStore.startDate"
      :end-date="reportStore.endDate"
      min-selectable-date="2020-01-01"
      :max-selectable-date="todayDate"
      :date-error="dateError"
      @update:country="reportStore.setCountry"
      @update:range-preset="reportStore.setRangePreset"
      @update:start-date="reportStore.setStartDate"
      @update:end-date="reportStore.setEndDate"
    />

    <div
      v-if="reportStore.error && !reportStore.loading"
      class="report-page__feedback"
    >
      <ReportEmptyState
        title="目前無法整理這組報表"
        :description="reportStore.error"
        action-label="回到近 12 個月"
        @action="resetToDefaultRange"
      >
        <template #icon>!</template>
      </ReportEmptyState>
    </div>

    <ReportKpiGrid
      :items="summary?.headline || []"
      :loading="reportStore.loading"
    />

    <section class="report-page__chart-grid">
      <ReportPrimaryChart :chart-data="summary?.primaryTrend">
        <template #empty>
          <ReportEmptyState
            title="主圖暫時沒有資料"
            description="調整篩選條件後，這裡會顯示營收與目標的主要趨勢。"
            action-label="回到近 12 個月"
            @action="resetToDefaultRange"
          >
            <template #icon>↗</template>
          </ReportEmptyState>
        </template>
      </ReportPrimaryChart>

      <ReportSecondaryChart :chart-data="summary?.secondaryTrend">
        <template #empty>
          <ReportEmptyState
            title="輔助圖暫時沒有資料"
            description="這裡會補上達成率與廣告投入，協助判斷效率與投入是否失衡。"
            action-label="回到近 12 個月"
            @action="resetToDefaultRange"
          >
            <template #icon>◎</template>
          </ReportEmptyState>
        </template>
      </ReportSecondaryChart>
    </section>

    <ReportMetricTable
      :columns="details?.columns || []"
      :rows="details?.rows || []"
      :totals="details?.totals || null"
    >
      <template #empty>
        <ReportEmptyState
          title="目前查無符合條件的月別資料"
          description="可以切回總覽或縮短自訂日期區間，先回到有資料的範圍。"
          action-label="回到近 12 個月"
          @action="resetToDefaultRange"
        >
          <template #icon>□</template>
        </ReportEmptyState>
      </template>
    </ReportMetricTable>
  </main>
</template>

<script setup>
  import { computed } from "vue";

  definePageMeta({
    layout: "dashboard",
  });

  useHead({
    title: "整體報表總覽",
    meta: [
      {
        name: "description",
        content:
          "ForwardMall 簡化版整體報表首頁，先看摘要卡與核心圖，再往下讀月別明細。",
      },
    ],
  });

  const reportStore = useReportStore();
  const { summary, details } = useReportDashboard();
  const todayDate = computed(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const dateError = computed(() =>
    reportStore.isCustomRange && reportStore.startDate > reportStore.endDate
      ? "開始日期不可晚於結束日期。"
      : "",
  );

  function resetToDefaultRange() {
    reportStore.setRangePreset("last12m");
  }
</script>

<style scoped>
  .report-page {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-4);
  }

  .report-page__hero {
    display: grid;
    gap: var(--space-4);
  }

  .report-page__copy {
    display: grid;
    gap: var(--space-4);
    min-width: 0;
  }

  .report-page__eyebrow {
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .report-page__feedback {
    display: grid;
  }

  .report-page__chart-grid {
    display: grid;
    gap: var(--space-5);
  }

  @media (min-width: 960px) {
    .report-page {
      gap: var(--space-6);
      padding: var(--space-5);
    }

    .report-page__chart-grid {
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      align-items: stretch;
    }
  }

  @media (min-width: 1400px) {
    .report-page {
      padding: var(--space-6) clamp(32px, 4vw, 52px);
    }
  }
</style>
