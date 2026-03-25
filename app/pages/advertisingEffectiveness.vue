<template>
  <main id="main-content" class="advertising-page">
    <section class="advertising-page__hero">
      <div class="advertising-page__copy">
        <h1 class="report-page__title">
          {{ summary?.pageTitle || "廣告成效" }}
        </h1>
      </div>
    </section>

    <BaseCard class="advertising-filter-bar">
      <div class="advertising-filter-bar__controls">
        <BaseSelect
          label="年份"
          :model-value="activeYear"
          :options="yearSelectOptions"
          placeholder="選擇年份"
          :disabled="isFilterDisabled"
          @update:model-value="selectYear"
        />
        <BaseSelect
          label="月份"
          :model-value="activeMonth"
          :options="monthSelectOptions"
          placeholder="選擇月份"
          :disabled="isFilterDisabled || !monthSelectOptions.length"
          @update:model-value="selectMonth"
        />
      </div>
    </BaseCard>

    <div v-if="errorMessage && !loading" class="advertising-page__feedback">
      <ReportEmptyState
        title="目前無法整理廣告成效資料"
        :description="errorMessage"
        action-label="重新整理"
        @action="fetchAdvertisingEffectiveness"
      >
        <template #icon>!</template>
      </ReportEmptyState>
    </div>

    <ReportKpiGrid
      aria-label="廣告成效摘要"
      :items="displayHeadline"
      :loading="loading"
    />

    <section class="advertising-page__section">
      <header class="advertising-page__section-header">
        <ReportSectionTitle eyebrow="趨勢解讀" title="核心漏斗走勢" />
      </header>

      <div
        v-if="loading && !trendCards.length"
        class="advertising-page__trend-grid"
      >
        <BaseCard
          v-for="index in 4"
          :key="`trend-skeleton-${index}`"
          class="advertising-card-skeleton advertising-card-skeleton--trend"
        />
      </div>

      <div v-else-if="trendCards.length" class="advertising-page__trend-grid">
        <AdvertisingTrendCard
          v-for="card in trendCards"
          :key="card.key"
          :card-data="card"
        />
      </div>

      <BaseCard v-else class="advertising-page__empty-card">
        <ReportEmptyState
          title="目前沒有趨勢資料"
          description="待資料回補後，這裡會顯示近 12 個月的漏斗效率變化。"
          action-label="重新整理"
          @action="fetchAdvertisingEffectiveness"
        >
          <template #icon>↗</template>
        </ReportEmptyState>
      </BaseCard>
    </section>

    <section class="advertising-page__section">
      <header class="advertising-page__section-header">
        <ReportSectionTitle eyebrow="成效佔比" title="TOP5 分布" />
      </header>

      <div
        v-if="loading && !topBreakdowns.length"
        class="advertising-page__donut-grid"
      >
        <BaseCard
          v-for="index in 4"
          :key="`donut-skeleton-${index}`"
          class="advertising-card-skeleton advertising-card-skeleton--donut"
        />
      </div>

      <div
        v-else-if="topBreakdowns.length"
        class="advertising-page__donut-grid"
      >
        <AdvertisingDonutCard
          v-for="breakdown in topBreakdowns"
          :key="breakdown.key"
          :breakdown="breakdown"
        />
      </div>

      <BaseCard v-else class="advertising-page__empty-card">
        <ReportEmptyState
          title="目前沒有佔比資料"
          description="待資料回補後，這裡會顯示最新一期的 TOP5 分布。"
          action-label="重新整理"
          @action="fetchAdvertisingEffectiveness"
        >
          <template #icon>◎</template>
        </ReportEmptyState>
      </BaseCard>
    </section>
  </main>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from "vue";
  import AdvertisingDonutCard from "~/components/advertising/AdvertisingDonutCard.vue";

  definePageMeta({
    layout: "dashboard",
  });

  const route = useRoute();
  const router = useRouter();

  const loading = ref(true);
  const errorMessage = ref("");
  const summary = ref(null);
  const details = ref(null);
  const hasMounted = ref(false);
  const latestRequestId = ref(0);

  const headlineItems = computed(() => summary.value?.headline || []);
  const trendCards = computed(() => details.value?.trendCards || []);
  const topBreakdowns = computed(() => details.value?.topBreakdowns || []);
  const yearOptions = computed(() => summary.value?.yearOptions || []);
  const monthOptions = computed(() => summary.value?.monthOptions || []);
  const activeYear = computed(() => summary.value?.activeYear || "");
  const activeMonth = computed(() => summary.value?.activeMonth || "");
  const routeYear = computed(() => normalizeQueryValue(route.query.year));
  const routeMonth = computed(() => normalizeQueryValue(route.query.month));
  const isFilterDisabled = computed(
    () => loading.value || !yearOptions.value.length,
  );
  const yearSelectOptions = computed(() =>
    yearOptions.value.map((option) => ({
      value: option.value || option.key,
      label: option.label,
    })),
  );
  const monthSelectOptions = computed(() =>
    monthOptions.value.map((option) => ({
      value: option.value || option.key,
      label: option.label,
    })),
  );

  const placeholderHeadline = [
    { key: "cost", label: "費用", unit: "currency" },
    { key: "impressions", label: "曝光", unit: "integer" },
    { key: "clicks", label: "點擊", unit: "integer" },
    { key: "cpc", label: "CPC", unit: "decimal" },
    { key: "gaCart", label: "GA 購物車", unit: "integer" },
    { key: "biCart", label: "BI 購物車", unit: "integer" },
    { key: "biQualifiedLeads", label: "BI 有效名單", unit: "integer" },
    { key: "orders", label: "BI 成交數", unit: "integer" },
  ];

  const displayHeadline = computed(() =>
    headlineItems.value.length
      ? headlineItems.value
      : placeholderHeadline.map((item) => ({
          ...item,
          formattedValue: "--",
          formattedCompareValue: "--",
          delta: "--",
          trend: "neutral",
          helper: "整理資料中",
        })),
  );

  useHead(() => ({
    title: summary.value?.pageTitle || "廣告成效",
    meta: [
      {
        name: "description",
        content: `${
          summary.value?.latestMonthLabel || "最新月份"
        }廣告成效頁，提供費用、點擊、轉換與 TOP5 分布，協助快速判斷投放漏斗表現。`,
      },
    ],
  }));

  function normalizeQueryValue(value) {
    if (Array.isArray(value)) {
      return normalizeQueryValue(value[0]);
    }

    return typeof value === "string" ? value : "";
  }

  function getNextQuery(nextYear, nextMonth) {
    const nextQuery = { ...route.query };

    if (nextYear) {
      nextQuery.year = nextYear;
    } else {
      delete nextQuery.year;
    }

    if (nextMonth) {
      nextQuery.month = nextMonth;
    } else {
      delete nextQuery.month;
    }

    return nextQuery;
  }

  async function replaceSelectionQuery(nextYear, nextMonth) {
    if (routeYear.value === nextYear && routeMonth.value === nextMonth) {
      return;
    }

    await router.replace({
      query: getNextQuery(nextYear, nextMonth),
    });
  }

  async function selectYear(year) {
    if (!year) {
      return;
    }

    await replaceSelectionQuery(year, "");
  }

  async function selectMonth(month) {
    if (!month) {
      return;
    }

    await replaceSelectionQuery(activeYear.value || routeYear.value, month);
  }

  async function fetchAdvertisingEffectiveness() {
    const requestId = latestRequestId.value + 1;
    latestRequestId.value = requestId;
    loading.value = true;
    errorMessage.value = "";

    const query = {};

    if (routeYear.value) {
      query.year = routeYear.value;
    }

    if (routeMonth.value) {
      query.month = routeMonth.value;
    }

    try {
      const [summaryResult, detailsResult] = await Promise.all([
        useClientFetch("/api/advertising-effectiveness/summary", {
          method: "GET",
          query,
        }),
        useClientFetch("/api/advertising-effectiveness/details", {
          method: "GET",
          query,
        }),
      ]);

      if (requestId !== latestRequestId.value) {
        return;
      }

      summary.value = summaryResult;
      details.value = detailsResult;

      await replaceSelectionQuery(
        summaryResult.activeYear,
        summaryResult.activeMonth,
      );
    } catch {
      if (requestId !== latestRequestId.value) {
        return;
      }

      summary.value = null;
      details.value = null;
      errorMessage.value = "廣告成效資料載入失敗，請稍後再試。";
    } finally {
      if (requestId === latestRequestId.value) {
        loading.value = false;
      }
    }
  }

  onMounted(() => {
    hasMounted.value = true;
    fetchAdvertisingEffectiveness();
  });

  watch(
    () => [routeYear.value, routeMonth.value],
    ([nextYear, nextMonth], [previousYear, previousMonth]) => {
      if (!hasMounted.value) {
        return;
      }

      if (nextYear === previousYear && nextMonth === previousMonth) {
        return;
      }

      fetchAdvertisingEffectiveness();
    },
  );
</script>

<style scoped>
  .advertising-page {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-4);
  }

  .advertising-page__hero,
  .advertising-page__copy,
  .advertising-page__section {
    display: grid;
    gap: var(--space-4);
  }

  .advertising-page__meta {
    color: var(--color-text-muted);
    font-size: var(--text-base);
  }

  .advertising-filter-bar {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-5);
  }

  .advertising-filter-bar__label {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: 600;
  }

  .advertising-filter-bar__controls {
    display: grid;
    gap: var(--space-4);
  }

  .advertising-page__feedback {
    display: grid;
  }

  .advertising-page__trend-grid,
  .advertising-page__donut-grid {
    display: grid;
    gap: var(--space-4);
  }

  .advertising-page__empty-card {
    padding: var(--space-5);
  }

  .advertising-card-skeleton {
    min-height: 320px;
    border-radius: 24px;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.92) 0%,
      rgba(241, 244, 236, 0.92) 50%,
      rgba(255, 255, 255, 0.92) 100%
    );
    background-size: 240% 100%;
    animation: advertising-card-loading 1.4s ease-in-out infinite;
  }

  .advertising-card-skeleton--donut {
    min-height: 420px;
  }

  @keyframes advertising-card-loading {
    0% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0 50%;
    }
  }

  @media (min-width: 768px) {
    .advertising-page {
      gap: var(--space-6);
      padding: var(--space-5);
    }

    .advertising-filter-bar__controls {
      grid-template-columns: repeat(2, minmax(0, 220px));
    }

    .advertising-page__trend-grid,
    .advertising-page__donut-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1080px) {
    .advertising-filter-bar {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
    }

    .advertising-filter-bar__controls {
      justify-content: start;
    }
  }

  @media (min-width: 1180px) {
    .advertising-page__trend-grid,
    .advertising-page__donut-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  @media (min-width: 1400px) {
    .advertising-page {
      padding: var(--space-6) clamp(32px, 4vw, 52px);
    }
  }
</style>
