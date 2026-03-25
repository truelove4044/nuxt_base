<template>
  <main id="main-content" class="product-analysis-page">
    <section class="product-analysis-page__hero">
      <h1 class="report-page__title">{{ pageTitle }}</h1>
    </section>

    <BaseCard v-if="groupOptions.length" class="analysis-switcher">
      <div class="analysis-switcher__group">
        <div class="analysis-switcher__top-row">
          <div class="analysis-switcher__cluster">
            <p class="analysis-switcher__label">大類快捷</p>
            <div
              class="analysis-switcher__segmented"
              role="tablist"
              aria-label="商品分析大類"
            >
              <button
                v-for="option in groupOptions"
                :key="option.key"
                class="analysis-switcher__pill"
                :class="{ 'is-active': activeGroupKey === option.key }"
                type="button"
                role="tab"
                :aria-selected="activeGroupKey === option.key"
                @click="selectGroup(option.key, option.defaultCategoryKey)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <div
            v-if="yearOptions.length"
            class="analysis-switcher__cluster analysis-switcher__cluster--year"
          >
            <p class="analysis-switcher__label">年份切換</p>
            <div
              class="analysis-switcher__segmented"
              role="tablist"
              aria-label="商品分析年份"
            >
              <button
                v-for="option in yearOptions"
                :key="option.key"
                class="analysis-switcher__pill"
                :class="{ 'is-active': activeYear === option.key }"
                type="button"
                role="tab"
                :aria-selected="activeYear === option.key"
                @click="selectYear(option.key)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="analysis-switcher__group">
        <p class="analysis-switcher__label">分類項目</p>
        <div
          class="analysis-switcher__segmented"
          role="tablist"
          aria-label="商品分析細分類"
        >
          <button
            v-for="option in categoryOptions"
            :key="option.key"
            class="analysis-switcher__pill analysis-switcher__pill--secondary"
            :class="{ 'is-active': activeCategoryKey === option.key }"
            type="button"
            role="tab"
            :aria-selected="activeCategoryKey === option.key"
            @click="selectCategory(option.key)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </BaseCard>

    <BaseCard
      v-else-if="loading"
      class="analysis-switcher analysis-switcher--loading"
    >
      <p class="analysis-switcher__loading-copy">正在整理分類資料...</p>
    </BaseCard>

    <div
      v-if="errorMessage && !loading"
      class="product-analysis-page__feedback"
    >
      <ReportEmptyState
        title="目前無法整理商品分析資料"
        :description="errorMessage"
        action-label="重新整理"
        @action="fetchProductAnalysis"
      >
        <template #icon>!</template>
      </ReportEmptyState>
    </div>

    <section class="product-analysis-page__grid">
      <div ref="pieCardShellRef" class="product-card-shell product-card-shell--pie">
        <BaseCard v-if="loading" class="product-card__loading-card">
          <header class="product-card__header">
            <ReportSectionTitle
              eyebrow="占比結構"
              :title="summary?.pieChart?.title || '商品占比'"
            />
          </header>

          <div class="product-card__loading" aria-live="polite">
            正在整理占比資料...
          </div>
        </BaseCard>

        <PieBreakdownCard
          v-else
          eyebrow="占比結構"
          :title="summary?.pieChart?.title || '商品占比'"
          :items="pieBreakdownItems"
          empty-title="目前沒有占比資料"
          empty-description="資料回補後會顯示此分類的結構占比。"
          :tooltip-value-formatter="formatPieTooltipValue"
        />
      </div>

      <div
        ref="matrixCardShellRef"
        class="product-card-shell product-card-shell--matrix"
        :style="matrixCardShellStyle"
      >
        <BaseCard class="product-card product-card--matrix">
          <header class="product-card__header">
            <ReportSectionTitle
              eyebrow="月別矩陣"
              :title="
                matrixYear
                  ? `${matrixYear} 年月別${activeCategoryLabel || '商品'}銷售`
                  : '月別商品銷售'
              "
            />
          </header>

          <div
            v-if="loading"
            class="product-card__loading product-card__loading--matrix"
            aria-live="polite"
          >
            正在整理月別矩陣...
          </div>

          <div
            v-else-if="matrixMonths.length && groupedMatrixRows.length"
            ref="matrixScrollRef"
            class="matrix-scroll app-scrollbar app-scrollbar--table"
            :class="{ 'is-dragging': isMatrixDragging }"
            aria-label="月別商品銷售矩陣"
            @pointerdown="startMatrixDrag"
            @pointermove="handleMatrixDrag"
            @pointerup="endMatrixDrag"
            @pointercancel="endMatrixDrag"
            @lostpointercapture="endMatrixDrag"
          >
            <p class="matrix-scroll__hint">左右滑動查看 1-12 月</p>

            <table class="matrix-table">
              <thead>
                <tr>
                  <th
                    rowspan="2"
                    class="matrix-table__head matrix-table__head--model"
                  >
                    品牌 / 品項
                  </th>
                <th
                  :colspan="displayMatrixMonths.length"
                  class="matrix-table__head matrix-table__head--year"
                >
                  {{ matrixYear }} 年
                </th>
                </tr>
                <tr>
                  <th
                    v-for="month in displayMatrixMonths"
                    :key="`month-${month}`"
                    class="matrix-table__head matrix-table__head--month"
                  >
                    {{ month }} 月
                  </th>
                </tr>
              </thead>

              <tbody>
                <template
                  v-for="group in groupedMatrixRows"
                  :key="`group-${group.brandKey}`"
                >
                  <tr class="matrix-table__group-row">
                    <th class="matrix-table__group-name" scope="row">
                      {{ group.brandLabel }} 合計
                    </th>
                    <td
                      v-for="(units, index) in group.brandTotals"
                      :key="`${group.brandKey}-total-${displayMatrixMonths[index]}`"
                      class="matrix-table__value matrix-table__value--group"
                      :style="getHeatCellStyle(units)"
                    >
                      <span>{{ formatUnits(units) }}</span>
                    </td>
                  </tr>

                  <tr
                    v-for="row in group.rows"
                    :key="row.id"
                    class="matrix-table__model-row"
                  >
                    <th class="matrix-table__model-name" scope="row">
                      {{ row.model }}
                    </th>
                    <td
                      v-for="(units, index) in row.monthlyUnits"
                      :key="`${row.id}-${displayMatrixMonths[index]}`"
                      class="matrix-table__value"
                      :style="getHeatCellStyle(units)"
                    >
                      <span>{{ formatUnits(units) }}</span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div v-else class="product-card__empty-inline">
            <p class="product-card__empty-title">目前沒有月別矩陣資料</p>
            <p class="product-card__empty-description">
              請稍後重新整理，或切換其他分類查看。
            </p>
          </div>
        </BaseCard>
      </div>
    </section>
  </main>
</template>

<script setup>
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
  } from "vue";
  import PieBreakdownCard from "~/components/report/PieBreakdownCard.vue";

  definePageMeta({
    layout: "dashboard",
  });

  const fallbackPageTitle = "商品分析";
  const numberFormatter = new Intl.NumberFormat("zh-TW");

  const route = useRoute();
  const router = useRouter();

  const loading = ref(true);
  const errorMessage = ref("");
  const summary = ref(null);
  const details = ref(null);
  const hasMounted = ref(false);
  const latestRequestId = ref(0);
  const pieCardShellRef = ref(null);
  const matrixCardShellRef = ref(null);
  const matrixScrollRef = ref(null);
  const isMatrixDragging = ref(false);
  const matrixDragPointerId = ref(null);
  const matrixDragStartX = ref(0);
  const matrixDragStartScrollLeft = ref(0);
  const syncedMatrixCardHeight = ref(0);

  const MATRIX_DRAG_THRESHOLD = 6;
  const MATRIX_SYNC_BREAKPOINT = 1180;
  const MATRIX_GREEN_STEPS = [
    {
      backgroundColor: "rgba(236, 246, 230, 0.88)",
      color: "#4f6844",
    },
    {
      backgroundColor: "rgba(225, 241, 211, 0.92)",
      color: "#46633a",
    },
    {
      backgroundColor: "rgba(208, 233, 186, 0.96)",
      color: "#3d5b31",
    },
    {
      backgroundColor: "rgba(187, 222, 157, 0.98)",
      color: "#314d26",
    },
    {
      backgroundColor: "rgba(163, 209, 123, 1)",
      color: "#233b19",
    },
  ];

  const pageTitle = computed(
    () => summary.value?.pageTitle || fallbackPageTitle,
  );
  const groupOptions = computed(() => summary.value?.groupOptions || []);
  const categoryOptions = computed(() => summary.value?.categoryOptions || []);
  const yearOptions = computed(() => summary.value?.yearOptions || []);
  const activeGroupKey = computed(() => summary.value?.activeGroupKey || "");
  const activeCategoryKey = computed(
    () => summary.value?.activeCategoryKey || "",
  );
  const activeYear = computed(() => summary.value?.activeYear || "");
  const activeGroupLabel = computed(
    () =>
      groupOptions.value.find((option) => option.key === activeGroupKey.value)
        ?.label || "",
  );
  const activeCategoryLabel = computed(
    () =>
      categoryOptions.value.find(
        (option) => option.key === activeCategoryKey.value,
      )?.label || "",
  );
  const pieItems = computed(() => summary.value?.pieChart?.items || []);
  const pieBreakdownItems = computed(() =>
    pieItems.value.map((item) => ({
      key: item.key,
      label: item.label,
      value: item.units,
      share: item.share,
      color: item.color,
      secondaryText: `${formatUnits(item.units, true)} ・${formatShare(item.share)}`,
    })),
  );
  const matrixYear = computed(() => details.value?.matrixHeader?.year || null);
  const matrixMonths = computed(
    () => details.value?.matrixHeader?.months || [],
  );
  const displayMatrixMonths = computed(() => {
    if (matrixMonths.value.length >= 12) {
      return matrixMonths.value;
    }

    return Array.from({ length: 12 }, (_, index) => index + 1);
  });
  const matrixGroups = computed(() => details.value?.groups || []);
  const matrixRows = computed(() => details.value?.rows || []);
  const heatMaxValue = computed(() =>
    Math.max(details.value?.heatmap?.maxValue || 0, 1),
  );
  const routeGroup = computed(() => normalizeQueryValue(route.query.group));
  const routeCategory = computed(() =>
    normalizeQueryValue(route.query.category),
  );
  const routeYear = computed(() => normalizeQueryValue(route.query.year));
  const matrixCardShellStyle = computed(() => {
    if (!syncedMatrixCardHeight.value) {
      return undefined;
    }

    return {
      height: `${syncedMatrixCardHeight.value}px`,
    };
  });

  const rowsByBrand = computed(() => {
    const map = new Map();

    matrixRows.value.forEach((row) => {
      if (!map.has(row.brandKey)) {
        map.set(row.brandKey, []);
      }

      map.get(row.brandKey).push(row);
    });

    return map;
  });

  const padTo12 = (arr = []) => {
    const result = [...arr];
    while (result.length < 12) {
      result.push("");
    }
    return result.slice(0, 12);
  };

  const groupedMatrixRows = computed(() =>
    matrixGroups.value.map((group) => {
      const rows = rowsByBrand.value.get(group.brandKey) || [];

      return {
        ...group,
        brandTotals: padTo12(group.brandTotals),
        rows: rows.map((row) => ({
          ...row,
          monthlyUnits: padTo12(row.monthlyUnits),
        })),
      };
    }),
  );

  useHead(() => ({
    title: pageTitle.value,
    meta: [
      {
        name: "description",
        content: `${activeGroupLabel.value || "商品"}${activeCategoryLabel.value ? ` / ${activeCategoryLabel.value}` : ""}分析頁，提供占比圖與月別銷售矩陣。`,
      },
    ],
  }));

  function normalizeQueryValue(value) {
    if (Array.isArray(value)) {
      return normalizeQueryValue(value[0]);
    }

    return typeof value === "string" ? value : "";
  }

  function formatUnits(value, withUnit = false) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    const formatted = numberFormatter.format(Math.round(value));
    return withUnit ? `${formatted} 件` : formatted;
  }

  function formatShare(value) {
    if (!Number.isFinite(value)) {
      return "--";
    }

    return `${Number(value).toFixed(1)}%`;
  }

  function formatPieTooltipValue(params) {
    return formatUnits(params.value, true);
  }

  function getHeatCellStyle(value) {
    if (!Number.isFinite(value) || value <= 0) {
      return {
        backgroundColor: "rgba(241, 244, 236, 0.42)",
        color: "var(--color-text-muted)",
      };
    }

    const ratio = Math.min(1, value / heatMaxValue.value);

    if (ratio >= 0.82) {
      return {
        backgroundColor: `rgba(238, 125, 59, ${0.18 + ratio * 0.22})`,
        color: "#5a341c",
      };
    }

    const greenRatio = ratio / 0.82;
    const level = Math.min(
      MATRIX_GREEN_STEPS.length - 1,
      Math.floor(greenRatio * MATRIX_GREEN_STEPS.length),
    );

    return MATRIX_GREEN_STEPS[level];
  }

  let matrixHeightObserver = null;
  let matrixHeightSyncFrame = 0;
  let matrixHeightResizeHandler = null;
  let matrixWheelTarget = null;

  function isDesktopMatrixSyncEnabled() {
    if (!import.meta.client) {
      return false;
    }

    return window.innerWidth >= MATRIX_SYNC_BREAKPOINT;
  }

  function syncMatrixCardHeight() {
    if (!import.meta.client) {
      return;
    }

    if (!isDesktopMatrixSyncEnabled()) {
      syncedMatrixCardHeight.value = 0;
      return;
    }

    const pieCardShell = pieCardShellRef.value;
    const matrixCardShell = matrixCardShellRef.value;

    if (!pieCardShell || !matrixCardShell) {
      syncedMatrixCardHeight.value = 0;
      return;
    }

    const nextHeight = Math.round(pieCardShell.getBoundingClientRect().height);
    syncedMatrixCardHeight.value = nextHeight > 0 ? nextHeight : 0;
  }

  function scheduleMatrixCardHeightSync() {
    if (!import.meta.client) {
      return;
    }

    if (matrixHeightSyncFrame) {
      window.cancelAnimationFrame(matrixHeightSyncFrame);
    }

    matrixHeightSyncFrame = window.requestAnimationFrame(async () => {
      matrixHeightSyncFrame = 0;
      await nextTick();
      syncMatrixCardHeight();
    });
  }

  function normalizeMatrixWheelDeltaY(event, container) {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      return event.deltaY * 16;
    }

    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      return event.deltaY * container.clientHeight;
    }

    return event.deltaY;
  }

  function handleMatrixWheel(event) {
    if (!import.meta.client || !event.cancelable || !isDesktopMatrixSyncEnabled()) {
      return;
    }

    const container = matrixScrollRef.value;

    if (!container || event.ctrlKey || event.shiftKey) {
      return;
    }

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      return;
    }

    const deltaY = normalizeMatrixWheelDeltaY(event, container);

    if (!Number.isFinite(deltaY) || deltaY === 0) {
      return;
    }

    const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);

    if (maxScrollTop <= 0) {
      event.preventDefault();
      window.scrollBy({
        top: deltaY,
        behavior: "auto",
      });
      return;
    }

    const currentScrollTop = container.scrollTop;
    const nextScrollTop = currentScrollTop + deltaY;
    const clampedScrollTop = Math.min(
      maxScrollTop,
      Math.max(0, nextScrollTop),
    );
    const consumedDelta = clampedScrollTop - currentScrollTop;
    const remainingDelta = deltaY - consumedDelta;

    if (consumedDelta !== 0 || remainingDelta !== 0) {
      event.preventDefault();
    }

    if (consumedDelta !== 0) {
      container.scrollTop = clampedScrollTop;
    }

    if (remainingDelta !== 0) {
      window.scrollBy({
        top: remainingDelta,
        behavior: "auto",
      });
    }
  }

  function bindMatrixWheelListener() {
    if (!import.meta.client) {
      return;
    }

    const nextTarget = matrixScrollRef.value;

    if (matrixWheelTarget === nextTarget) {
      return;
    }

    if (matrixWheelTarget) {
      matrixWheelTarget.removeEventListener("wheel", handleMatrixWheel);
      matrixWheelTarget = null;
    }

    if (nextTarget) {
      nextTarget.addEventListener("wheel", handleMatrixWheel, {
        passive: false,
      });
      matrixWheelTarget = nextTarget;
    }
  }

  function startMatrixDrag(event) {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    const container = matrixScrollRef.value;

    if (!container || container.scrollWidth <= container.clientWidth) {
      return;
    }

    isMatrixDragging.value = true;
    matrixDragPointerId.value = event.pointerId;
    matrixDragStartX.value = event.clientX;
    matrixDragStartScrollLeft.value = container.scrollLeft;

    if (container.setPointerCapture) {
      container.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
  }

  function handleMatrixDrag(event) {
    const container = matrixScrollRef.value;

    if (
      !container ||
      !isMatrixDragging.value ||
      matrixDragPointerId.value !== event.pointerId
    ) {
      return;
    }

    const deltaX = event.clientX - matrixDragStartX.value;

    if (Math.abs(deltaX) < MATRIX_DRAG_THRESHOLD) {
      return;
    }

    container.scrollLeft = matrixDragStartScrollLeft.value - deltaX;
    event.preventDefault();
  }

  function endMatrixDrag(event) {
    if (!isMatrixDragging.value) {
      return;
    }

    if (
      typeof event?.pointerId === "number" &&
      matrixDragPointerId.value !== null &&
      event.pointerId !== matrixDragPointerId.value
    ) {
      return;
    }

    const container = matrixScrollRef.value;

    if (
      container &&
      matrixDragPointerId.value !== null &&
      container.hasPointerCapture &&
      container.hasPointerCapture(matrixDragPointerId.value)
    ) {
      container.releasePointerCapture(matrixDragPointerId.value);
    }

    isMatrixDragging.value = false;
    matrixDragPointerId.value = null;
  }

  function getNextQuery(nextGroup, nextCategory, nextYear) {
    const nextQuery = { ...route.query };

    if (nextGroup) {
      nextQuery.group = nextGroup;
    } else {
      delete nextQuery.group;
    }

    if (nextCategory) {
      nextQuery.category = nextCategory;
    } else {
      delete nextQuery.category;
    }

    if (nextYear) {
      nextQuery.year = nextYear;
    } else {
      delete nextQuery.year;
    }

    return nextQuery;
  }

  async function replaceSelectionQuery(nextGroup, nextCategory, nextYear) {
    if (
      routeGroup.value === nextGroup &&
      routeCategory.value === nextCategory &&
      routeYear.value === nextYear
    ) {
      return;
    }

    await router.replace({
      query: getNextQuery(nextGroup, nextCategory, nextYear),
    });
  }

  async function selectGroup(groupKey, defaultCategoryKey) {
    if (!groupKey) {
      return;
    }

    await replaceSelectionQuery(
      groupKey,
      defaultCategoryKey || "",
      activeYear.value || routeYear.value,
    );
  }

  async function selectCategory(categoryKey) {
    if (!categoryKey) {
      return;
    }

    await replaceSelectionQuery(
      activeGroupKey.value || routeGroup.value,
      categoryKey,
      activeYear.value || routeYear.value,
    );
  }

  async function selectYear(yearKey) {
    if (!yearKey) {
      return;
    }

    await replaceSelectionQuery(
      activeGroupKey.value || routeGroup.value,
      activeCategoryKey.value || routeCategory.value,
      yearKey,
    );
  }

  async function fetchProductAnalysis() {
    const requestId = latestRequestId.value + 1;
    latestRequestId.value = requestId;
    loading.value = true;
    errorMessage.value = "";

    const query = {};

    if (routeGroup.value) {
      query.group = routeGroup.value;
    }

    if (routeCategory.value) {
      query.category = routeCategory.value;
    }

    if (routeYear.value) {
      query.year = routeYear.value;
    }

    try {
      const [summaryResult, detailsResult] = await Promise.all([
        useClientFetch("/api/product-analysis/summary", {
          method: "GET",
          query,
        }),
        useClientFetch("/api/product-analysis/details", {
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
        summaryResult.activeGroupKey,
        summaryResult.activeCategoryKey,
        summaryResult.activeYear,
      );
    } catch (error) {
      if (requestId !== latestRequestId.value) {
        return;
      }

      summary.value = null;
      details.value = null;
      errorMessage.value = "商品分析資料載入失敗，請稍後再試。";
    } finally {
      if (requestId === latestRequestId.value) {
        loading.value = false;
      }
    }
  }

  onMounted(() => {
    hasMounted.value = true;

    matrixHeightResizeHandler = () => {
      scheduleMatrixCardHeightSync();
    };

    window.addEventListener("resize", matrixHeightResizeHandler);

    if (typeof ResizeObserver !== "undefined") {
      matrixHeightObserver = new ResizeObserver(() => {
        scheduleMatrixCardHeightSync();
      });

      if (pieCardShellRef.value) {
        matrixHeightObserver.observe(pieCardShellRef.value);
      }
    }

    scheduleMatrixCardHeightSync();
    fetchProductAnalysis();
  });

  onBeforeUnmount(() => {
    if (matrixHeightSyncFrame) {
      window.cancelAnimationFrame(matrixHeightSyncFrame);
    }

    if (matrixHeightObserver) {
      matrixHeightObserver.disconnect();
      matrixHeightObserver = null;
    }

    if (matrixHeightResizeHandler) {
      window.removeEventListener("resize", matrixHeightResizeHandler);
      matrixHeightResizeHandler = null;
    }

    if (matrixWheelTarget) {
      matrixWheelTarget.removeEventListener("wheel", handleMatrixWheel);
      matrixWheelTarget = null;
    }
  });

  watch(
    () => [routeGroup.value, routeCategory.value, routeYear.value],
    (
      [nextGroup, nextCategory, nextYear],
      [previousGroup, previousCategory, previousYear],
    ) => {
      if (!hasMounted.value) {
        return;
      }

      if (
        nextGroup === previousGroup &&
        nextCategory === previousCategory &&
        nextYear === previousYear
      ) {
        return;
      }

      fetchProductAnalysis();
    },
  );

  watch(
    () => [loading.value, pieItems.value.length, matrixMonths.value.length],
    () => {
      scheduleMatrixCardHeightSync();
    },
  );

  watch(
    matrixScrollRef,
    () => {
      bindMatrixWheelListener();
    },
    {
      flush: "post",
    },
  );
</script>

<style scoped>
  .product-analysis-page {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-4);
  }

  .product-analysis-page__hero {
    display: grid;
    gap: var(--space-2);
  }

  .product-analysis-page__eyebrow {
    color: var(--color-accent);
    font-size: var(--text-sm);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .product-analysis-page__meta {
    color: var(--color-text-muted);
    font-size: var(--text-base);
  }

  .product-analysis-page__feedback {
    display: grid;
  }

  .analysis-switcher {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-5);
  }

  .analysis-switcher--loading {
    place-items: center;
    min-height: 152px;
  }

  .analysis-switcher__loading-copy {
    color: var(--color-text-muted);
    font-weight: 600;
  }

  .analysis-switcher__header,
  .analysis-switcher__group {
    display: grid;
    gap: var(--space-3);
  }

  .analysis-switcher__top-row {
    display: grid;
    gap: var(--space-4);
  }

  .analysis-switcher__cluster {
    display: grid;
    gap: var(--space-3);
    min-width: 0;
  }

  .analysis-switcher__hint,
  .analysis-switcher__label {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .analysis-switcher__label {
    font-weight: 600;
  }

  .analysis-switcher__segmented {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  .analysis-switcher__cluster--year .analysis-switcher__segmented {
    justify-content: flex-start;
  }

  .analysis-switcher__pill {
    min-height: 42px;
    padding: 0 var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.72);
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: 700;
    cursor: pointer;
    transition:
      border-color 0.18s ease,
      background-color 0.18s ease,
      color 0.18s ease,
      transform 0.18s ease,
      box-shadow 0.18s ease;
  }

  .analysis-switcher__pill:hover,
  .analysis-switcher__pill:focus-visible {
    border-color: rgba(var(--color-focus-ring-rgb), 0.6);
    color: var(--color-primary-700);
    transform: translateY(-1px);
  }

  .analysis-switcher__pill.is-active {
    border-color: transparent;
    background: linear-gradient(
      135deg,
      var(--color-primary-700),
      var(--color-primary-600)
    );
    color: #fff;
    box-shadow: var(--shadow-button-hover);
  }

  .analysis-switcher__pill--secondary.is-active {
    background: linear-gradient(
      135deg,
      var(--color-primary-600),
      var(--color-primary-500)
    );
  }

  .product-analysis-page__grid {
    display: grid;
    gap: var(--space-5);
  }

  .product-card-shell {
    display: grid;
    min-width: 0;
    align-content: start;
  }

  .product-card-shell--matrix {
    min-height: 0;
  }

  .product-card {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-5);
  }

  .product-card--matrix {
    --matrix-first-column-width: 144px;
    --matrix-value-column-width: 64px;
    --matrix-cell-padding-block: 10px;
    --matrix-cell-padding-inline: 10px;
    --matrix-table-min-width: 912px;
    --matrix-year-header-height: 44px;
    --matrix-month-header-height: 48px;
    --matrix-scroll-max-height: min(62vh, 520px);
  }

  .product-card__header {
    display: grid;
    gap: var(--space-2);
  }

  .product-card__loading {
    display: grid;
    place-items: center;
    min-height: 320px;
    border: 1px dashed rgba(118, 113, 111, 0.24);
    border-radius: 20px;
    color: var(--color-text-muted);
    background: rgba(255, 255, 255, 0.72);
  }

  .product-card__loading--matrix {
    min-height: 300px;
  }

  .product-card__loading-card {
    display: grid;
    gap: var(--space-5);
    padding: var(--space-5);
  }

  .matrix-scroll {
    --app-scrollbar-size: 7px;
    --app-scrollbar-track-color: rgba(118, 113, 111, 0.08);
    --app-scrollbar-thumb-color: rgba(var(--color-primary-600-rgb), 0.34);
    --app-scrollbar-thumb-hover-color: rgba(var(--color-primary-600-rgb), 0.44);
    --app-scrollbar-thumb-border: rgba(255, 255, 255, 0.84);
    --app-scrollbar-track-bg: linear-gradient(
      180deg,
      rgba(118, 113, 111, 0.03) 0%,
      rgba(118, 113, 111, 0.07) 100%
    );
    --app-scrollbar-thumb-bg: linear-gradient(
      180deg,
      rgba(var(--color-primary-600-rgb), 0.34) 0%,
      rgba(86, 148, 47, 0.4) 100%
    );
    --app-scrollbar-thumb-hover-bg: linear-gradient(
      180deg,
      rgba(var(--color-primary-600-rgb), 0.44) 0%,
      rgba(86, 148, 47, 0.5) 100%
    );
    display: grid;
    gap: var(--space-3);
    position: relative;
    min-height: 0;
    max-height: var(--matrix-scroll-max-height);
    overflow: auto;
    overscroll-behavior: contain;
    padding-bottom: var(--space-3);
    border-radius: 18px;
  }

  .matrix-scroll__hint {
    position: sticky;
    left: 0;
    z-index: 4;
    color: var(--color-text-muted);
    font-size: 12px;
    font-weight: 600;
  }

  @media (hover: hover) and (pointer: fine) {
    .matrix-scroll {
      cursor: grab;
    }

    .matrix-scroll.is-dragging {
      cursor: grabbing;
    }

    .matrix-scroll.is-dragging,
    .matrix-scroll.is-dragging * {
      user-select: none;
    }
  }

  .matrix-table {
    width: 100%;
    min-width: var(--matrix-table-min-width);
    border-collapse: separate;
    border-spacing: 0;
    font-variant-numeric: tabular-nums;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.98) 0,
      rgba(255, 255, 255, 0.98) var(--matrix-first-column-width),
      rgba(243, 244, 241, 0.96) var(--matrix-first-column-width),
      rgba(243, 244, 241, 0.96) 100%
    );
  }

  .matrix-table__head,
  .matrix-table__group-name,
  .matrix-table__model-name,
  .matrix-table__value {
    padding: var(--matrix-cell-padding-block) var(--matrix-cell-padding-inline);
    border-bottom: 1px solid rgba(118, 113, 111, 0.12);
    vertical-align: middle;
  }

  .matrix-table__head {
    position: sticky;
    color: var(--color-text-muted);
    font-size: var(--text-sm);
    font-weight: 700;
    text-align: right;
    background: rgba(255, 255, 255, 0.96);
    background-clip: padding-box;
  }

  .matrix-table__head--model {
    top: 0;
    left: 0;
    z-index: 7;
    min-width: var(--matrix-first-column-width);
    width: var(--matrix-first-column-width);
    text-align: left;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.99) 0%,
      rgba(248, 249, 245, 0.98) 100%
    );
    white-space: normal;
    word-break: break-word;
    box-shadow:
      10px 0 18px rgba(89, 87, 87, 0.06),
      0 10px 20px rgba(89, 87, 87, 0.04);
  }

  .matrix-table__head--year {
    top: 0;
    z-index: 5;
    min-height: var(--matrix-year-header-height);
    color: var(--color-primary-700);
    letter-spacing: 0.02em;
    text-align: center;
    background: linear-gradient(
      180deg,
      rgba(236, 240, 232, 0.98),
      rgba(243, 244, 241, 0.96)
    );
    box-shadow: 0 1px 0 rgba(118, 113, 111, 0.12);
  }

  .matrix-table__head--month {
    top: var(--matrix-year-header-height);
    z-index: 4;
    min-height: var(--matrix-month-header-height);
    width: var(--matrix-value-column-width);
    min-width: var(--matrix-value-column-width);
    max-width: var(--matrix-value-column-width);
    text-align: center;
    background: rgba(243, 244, 241, 0.98);
    box-shadow: 0 1px 0 rgba(118, 113, 111, 0.12);
  }

  .matrix-table__group-row .matrix-table__group-name {
    position: sticky;
    left: 0;
    z-index: 2;
    min-width: var(--matrix-first-column-width);
    width: var(--matrix-first-column-width);
    color: var(--color-primary-700);
    font-size: var(--text-sm);
    font-weight: 700;
    text-align: left;
    background: rgba(238, 248, 230, 0.94);
    white-space: normal;
    word-break: break-word;
    box-shadow: 10px 0 18px rgba(89, 87, 87, 0.06);
  }

  .matrix-table__group-row .matrix-table__value {
    font-weight: 700;
  }

  .matrix-table__model-name {
    position: sticky;
    left: 0;
    z-index: 1;
    min-width: var(--matrix-first-column-width);
    width: var(--matrix-first-column-width);
    font-size: var(--text-sm);
    font-weight: 600;
    text-align: left;
    background: rgba(255, 255, 255, 0.95);
    white-space: normal;
    word-break: break-word;
    line-height: 1.35;
    box-shadow: 10px 0 18px rgba(89, 87, 87, 0.06);
  }

  .matrix-table__value {
    width: var(--matrix-value-column-width);
    min-width: var(--matrix-value-column-width);
    max-width: var(--matrix-value-column-width);
    text-align: center;
    white-space: nowrap;
    transition: background-color 0.18s ease;
  }

  .matrix-table__value > span {
    display: block;
    font-family: "Manrope", "Noto Sans TC", sans-serif;
    font-weight: 600;
    text-align: center;
  }

  @media (max-width: 767px) {
    .product-card--matrix {
      gap: var(--space-4);
      padding: var(--space-4);
      --matrix-first-column-width: 144px;
      --matrix-value-column-width: 64px;
      --matrix-cell-padding-block: 10px;
      --matrix-cell-padding-inline: 10px;
      --matrix-table-min-width: 912px;
      --matrix-year-header-height: 40px;
      --matrix-month-header-height: 42px;
      --matrix-scroll-max-height: min(60vh, 460px);
    }

    .matrix-scroll {
      margin-inline: calc(var(--space-4) * -1);
      padding-inline: var(--space-4);
    }

    .matrix-scroll__hint {
      padding-inline: var(--space-4);
    }

    .matrix-table {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.98) 0,
        rgba(255, 255, 255, 0.98) var(--matrix-first-column-width),
        rgba(242, 243, 239, 0.98) var(--matrix-first-column-width),
        rgba(242, 243, 239, 0.98) 100%
      );
    }

    .matrix-table__head,
    .matrix-table__group-name,
    .matrix-table__model-name {
      font-size: 13px;
    }

    .matrix-table__value {
      font-size: 13px;
    }
  }

  @media (min-width: 768px) {
    .product-card--matrix {
      --matrix-first-column-width: 184px;
      --matrix-value-column-width: 86px;
      --matrix-cell-padding-block: 12px;
      --matrix-cell-padding-inline: 12px;
      --matrix-table-min-width: 1216px;
      --matrix-year-header-height: 44px;
      --matrix-month-header-height: 48px;
      --matrix-scroll-max-height: min(64vh, 560px);
    }

    .matrix-scroll__hint {
      display: none;
    }
  }

  @media (min-width: 960px) {
    .product-analysis-page {
      gap: var(--space-6);
      padding: var(--space-5);
    }

    .analysis-switcher {
      padding: var(--space-6);
    }

    .analysis-switcher__header {
      grid-template-columns: minmax(0, auto) minmax(0, 1fr);
      align-items: end;
      gap: var(--space-4);
    }

    .analysis-switcher__top-row {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
    }

    .analysis-switcher__cluster--year {
      width: max-content;
      justify-items: start;
      justify-self: end;
    }

    .analysis-switcher__cluster--year .analysis-switcher__label {
      text-align: left;
    }

    .analysis-switcher__cluster--year .analysis-switcher__segmented {
      justify-content: flex-start;
    }

    .product-card {
      padding: var(--space-6);
    }

    .product-card--matrix {
      --matrix-first-column-width: 192px;
      --matrix-value-column-width: 88px;
      --matrix-cell-padding-inline: 13px;
      --matrix-table-min-width: 1248px;
      --matrix-scroll-max-height: min(66vh, 620px);
    }

    .product-card__loading-card {
      padding: var(--space-6);
    }
  }

  @media (min-width: 1180px) {
    .product-analysis-page__grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr);
      align-items: start;
    }

    .product-card-shell--matrix > .product-card--matrix {
      height: 100%;
      min-height: 0;
      min-width: 0;
      grid-template-rows: auto minmax(0, 1fr);
      --matrix-first-column-width: 200px;
      --matrix-value-column-width: 90px;
      --matrix-cell-padding-inline: 14px;
      --matrix-table-min-width: 1280px;
      --matrix-scroll-max-height: min(68vh, 680px);
    }

    .product-card-shell--matrix > .product-card--matrix > .matrix-scroll {
      height: 100%;
      max-height: none;
    }
  }

  @media (min-width: 1400px) {
    .product-analysis-page {
      padding: var(--space-6) clamp(32px, 4vw, 52px);
    }
  }
</style>
