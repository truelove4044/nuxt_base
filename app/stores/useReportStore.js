import { computed, ref } from "vue";
import { defineStore } from "pinia";

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultRangePreset(preset) {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), 1);

  if (preset === "ytd") {
    return {
      startDate: formatDateInput(new Date(now.getFullYear(), 0, 1)),
      endDate: formatDateInput(end),
    };
  }

  return {
    startDate: formatDateInput(new Date(now.getFullYear(), now.getMonth() - 11, 1)),
    endDate: formatDateInput(end),
  };
}

export const useReportStore = defineStore("report", () => {
  const country = ref("all");
  const rangePreset = ref("last12m");
  const { startDate: defaultStartDate, endDate: defaultEndDate } =
    getDefaultRangePreset("last12m");
  const startDate = ref(defaultStartDate);
  const endDate = ref(defaultEndDate);
  const loading = ref(false);
  const error = ref("");

  const isCustomRange = computed(() => rangePreset.value === "custom");

  function syncPresetDates(preset) {
    const next = getDefaultRangePreset(preset);
    startDate.value = next.startDate;
    endDate.value = next.endDate;
  }

  function setCountry(nextCountry) {
    country.value = nextCountry;
  }

  function setRangePreset(nextPreset) {
    rangePreset.value = nextPreset;

    if (nextPreset !== "custom") {
      syncPresetDates(nextPreset);
    }
  }

  function setStartDate(value) {
    startDate.value = value;
  }

  function setEndDate(value) {
    endDate.value = value;
  }

  function setError(message) {
    error.value = message;
  }

  function clearError() {
    error.value = "";
  }

  return {
    country,
    rangePreset,
    startDate,
    endDate,
    loading,
    error,
    isCustomRange,
    setCountry,
    setRangePreset,
    setStartDate,
    setEndDate,
    setError,
    clearError,
  };
});
