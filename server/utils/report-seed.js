import {
  REPORT_DATA_END_MONTH,
  REPORT_DATA_END_YEAR,
  REPORT_DATA_START_MONTH,
  REPORT_DATA_START_YEAR,
} from "../../shared/report-data-config.js";

export {
  REPORT_DATA_END_MONTH,
  REPORT_DATA_END_YEAR,
  REPORT_DATA_START_MONTH,
  REPORT_DATA_START_YEAR,
};

const reportSeedConfig = {
  indonesia: {
    baseRevenue: 18600000,
    monthlyGrowth: 0.015,
    targetRatio: 1.025,
    baseAdSpend: 226000,
    adSpendGrowth: 0.012,
    forecastBias: 0.96,
    seasonOffset: 0,
  },
  philippines: {
    baseRevenue: 12800000,
    monthlyGrowth: 0.013,
    targetRatio: 1.03,
    baseAdSpend: 184000,
    adSpendGrowth: 0.011,
    forecastBias: 0.945,
    seasonOffset: 3,
  },
};

export function getReportSeedConfig() {
  return {
    indonesia: { ...reportSeedConfig.indonesia },
    philippines: { ...reportSeedConfig.philippines },
  };
}
