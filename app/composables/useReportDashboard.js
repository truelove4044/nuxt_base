import { computed, ref, watch } from "vue";

export function useReportDashboard() {
  const reportStore = useReportStore();
  const summary = ref(null);
  const details = ref(null);
  const pendingTimer = ref(null);

  const query = computed(() => ({
    country: reportStore.country,
    rangePreset: reportStore.rangePreset,
    startDate: reportStore.startDate,
    endDate: reportStore.endDate,
  }));

  const isDateRangeValid = computed(() => {
    if (!reportStore.isCustomRange) {
      return true;
    }

    if (!reportStore.startDate || !reportStore.endDate) {
      return false;
    }

    return reportStore.startDate <= reportStore.endDate;
  });

  async function fetchDashboard() {
    if (!isDateRangeValid.value) {
      reportStore.setError("開始日期不可晚於結束日期。");
      summary.value = null;
      details.value = null;
      return;
    }

    reportStore.clearError();
    reportStore.loading = true;

    try {
      const [summaryResult, detailsResult] = await Promise.all([
        useClientFetch("/api/report/summary", {
          method: "GET",
          query: query.value,
        }),
        useClientFetch("/api/report/details", {
          method: "GET",
          query: query.value,
        }),
      ]);

      summary.value = summaryResult;
      details.value = detailsResult;
    } catch (error) {
      reportStore.setError("報表資料載入失敗，請稍後再試。");
      summary.value = null;
      details.value = null;
    } finally {
      reportStore.loading = false;
    }
  }

  function scheduleFetch() {
    if (pendingTimer.value) {
      clearTimeout(pendingTimer.value);
    }

    pendingTimer.value = setTimeout(() => {
      fetchDashboard();
      pendingTimer.value = null;
    }, 260);
  }

  watch(
    query,
    () => {
      scheduleFetch();
    },
    { deep: true, immediate: true },
  );

  return {
    summary,
    details,
    query,
    isDateRangeValid,
    refresh: fetchDashboard,
  };
}
