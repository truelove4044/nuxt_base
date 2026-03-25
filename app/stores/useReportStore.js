import { computed, ref } from "vue";
import { defineStore } from "pinia";
import {
  REPORT_DATA_END_MONTH,
  REPORT_DATA_END_YEAR,
} from "../../shared/report-data-config.js";

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getQuarterRange(year, quarter) {
  const quarterStartMonthMap = {
    q1: 0,
    q2: 3,
    q3: 6,
    q4: 9,
  };
  const startMonth = quarterStartMonthMap[quarter] ?? 0;

  return {
    startDate: formatDateInput(new Date(year, startMonth, 1)),
    endDate: formatDateInput(new Date(year, startMonth + 2, 1)),
  };
}

function getDefaultRangePreset(preset) {
  const end = new Date(REPORT_DATA_END_YEAR, REPORT_DATA_END_MONTH - 1, 1);
  const year = REPORT_DATA_END_YEAR;
  const endMonthIndex = REPORT_DATA_END_MONTH - 1;

  if (preset === "last3m") {
    return {
      startDate: formatDateInput(new Date(year, endMonthIndex - 2, 1)),
      endDate: formatDateInput(end),
    };
  }

  if (preset === "last6m") {
    return {
      startDate: formatDateInput(new Date(year, endMonthIndex - 5, 1)),
      endDate: formatDateInput(end),
    };
  }

  if (preset === "ytd") {
    return {
      startDate: formatDateInput(new Date(year, 0, 1)),
      endDate: formatDateInput(end),
    };
  }

  if (["q1", "q2", "q3", "q4"].includes(preset)) {
    return getQuarterRange(year, preset);
  }

  return {
    startDate: formatDateInput(new Date(year, endMonthIndex - 11, 1)),
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
