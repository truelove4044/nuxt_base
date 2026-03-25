import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  REPORT_DATA_END_MONTH,
  REPORT_DATA_END_YEAR,
  REPORT_DATA_START_MONTH,
  REPORT_DATA_START_YEAR,
  getReportSeedConfig,
} from "../server/utils/report-seed.js";

const REVENUE_CURVE = [
  0.9, 1.02, 1.08, 0.95, 1.04, 1.1, 1.0, 1.07, 1.15, 1.24, 1.31, 1.28,
];
const FORECAST_CURVE = [
  0.92, 1.06, 0.9, 1.08, 0.94, 1.12, 0.9, 1.1, 0.93, 1.09, 0.91, 1.14,
];
const AD_SPEND_CURVE = [
  0.94, 0.98, 1.01, 1.02, 1.05, 1.08, 1.12, 1.15, 1.18, 1.24, 1.28, 1.22,
];
const TARGET_CURVE = [
  0.97, 1.01, 1.03, 1.0, 1.04, 1.07, 1.04, 1.08, 1.1, 1.14, 1.18, 1.16,
];

function formatMonth(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function createMonthRange(startYear, startMonth, endYear, endMonth) {
  const months = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(formatMonth(year, month));
    month += 1;

    if (month > 12) {
      year += 1;
      month = 1;
    }
  }

  return months;
}

function hashString(input) {
  let hash = 0;

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 33 + input.charCodeAt(index)) % 2147483647;
  }

  return hash;
}

function roundInteger(value) {
  return Math.max(0, Math.round(value));
}

function buildCountrySnapshot(config, countryKey, monthKey, monthIndex) {
  const monthNumber = Number(monthKey.slice(5, 7));
  const seasonalIndex = (monthNumber - 1 + config.seasonOffset) % 12;
  const growthFactor = Math.pow(1 + config.monthlyGrowth, monthIndex);
  const adSpendGrowthFactor = Math.pow(1 + config.adSpendGrowth, monthIndex);
  const pulseSeed = hashString(`${countryKey}:${monthKey}`);
  const revenuePulse = 1 + ((pulseSeed % 17) - 8) * 0.009;
  const forecastPulse = 1 + ((pulseSeed % 13) - 6) * 0.011;
  const spendPulse = 1 + ((pulseSeed % 9) - 4) * 0.01;
  const targetPulse = 1 + ((pulseSeed % 7) - 3) * 0.004;

  const revenue =
    config.baseRevenue *
    growthFactor *
    REVENUE_CURVE[seasonalIndex] *
    revenuePulse;
  const target =
    config.baseRevenue *
    growthFactor *
    config.targetRatio *
    TARGET_CURVE[seasonalIndex] *
    targetPulse;
  const forecast =
    revenue *
    config.forecastBias *
    FORECAST_CURVE[seasonalIndex] *
    forecastPulse;
  const adSpend =
    config.baseAdSpend *
    adSpendGrowthFactor *
    AD_SPEND_CURVE[seasonalIndex] *
    spendPulse;

  return {
    revenue: roundInteger(revenue),
    target: roundInteger(target),
    forecast: roundInteger(forecast),
    adSpend: roundInteger(adSpend),
  };
}

async function main() {
  const months = createMonthRange(
    REPORT_DATA_START_YEAR,
    REPORT_DATA_START_MONTH,
    REPORT_DATA_END_YEAR,
    REPORT_DATA_END_MONTH,
  );
  const seedConfig = getReportSeedConfig();
  const monthly = months.map((monthKey, monthIndex) => ({
    month: monthKey,
    indonesia: buildCountrySnapshot(
      seedConfig.indonesia,
      "indonesia",
      monthKey,
      monthIndex,
    ),
    philippines: buildCountrySnapshot(
      seedConfig.philippines,
      "philippines",
      monthKey,
      monthIndex,
    ),
  }));

  const output = `export const REPORT_GENERATED_DATA = ${JSON.stringify(
    monthly,
    null,
    2,
  )};\n`;

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(currentDir, "../server/utils/report-generated.js");

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");

  console.log(
    JSON.stringify(
      {
        outputPath,
        startMonth: months[0],
        endMonth: months[months.length - 1],
        totalMonths: months.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
