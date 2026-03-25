import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getProductAnalysisSeedCatalog,
  PRODUCT_ANALYSIS_SEED_DEFAULT_CATEGORY_KEY,
  PRODUCT_ANALYSIS_SEED_DEFAULT_GROUP_KEY,
} from "../server/utils/product-analysis-seed.js";

const START_YEAR = 2020;
const START_MONTH = 1;
const REFERENCE_CURVE = [0, 8, -4, 13, 22, 34, 26, 31, 43, 58, 74, 88];
const SEASONAL_CURVE = [0.9, 0.92, 0.96, 1.01, 1.04, 1.08, 1.05, 1.03, 1.1, 1.18, 1.24, 1.32];

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
    hash = (hash * 31 + input.charCodeAt(index)) % 2147483647;
  }

  return hash;
}

function roundToUnits(value) {
  return Math.max(0, Math.round(value));
}

function getAnchorValue(model, brandIndex, categoryIndex, endMonthNumber) {
  return roundToUnits(
    model.baseUnits +
      model.monthlyStep * (endMonthNumber - 1) +
      REFERENCE_CURVE[endMonthNumber - 1] +
      model.seasonalityPhase * 3 +
      brandIndex * 5 +
      categoryIndex * 4,
  );
}

function getMonthlyGrowth(model, groupIndex, brandIndex) {
  const normalized = model.monthlyStep / Math.max(model.baseUnits, 1);
  return 1 + Math.min(0.018, Math.max(0.004, normalized * 0.45 + groupIndex * 0.0005 + brandIndex * 0.0003));
}

function getSeasonalRatio(monthNumber, anchorMonthNumber, phase) {
  const monthSeason = SEASONAL_CURVE[(monthNumber - 1 + phase) % 12];
  const anchorSeason = SEASONAL_CURVE[(anchorMonthNumber - 1 + phase) % 12];
  return monthSeason / anchorSeason;
}

function buildTimelineUnits({
  months,
  endMonthNumber,
  groupIndex,
  categoryIndex,
  brandIndex,
  model,
}) {
  const anchorValue = getAnchorValue(model, brandIndex, categoryIndex, endMonthNumber);
  const monthlyGrowth = getMonthlyGrowth(model, groupIndex, brandIndex);

  return months.map((monthKey, monthIndex) => {
    const [, rawMonth] = monthKey.split("-");
    const monthNumber = Number(rawMonth);
    const monthsBack = months.length - 1 - monthIndex;
    const seasonalRatio = getSeasonalRatio(
      monthNumber,
      endMonthNumber,
      model.seasonalityPhase,
    );
    const pulseSeed = hashString(`${model.id}:${monthKey}`);
    const pulse = 1 + ((pulseSeed % 9) - 4) * 0.01;
    const decay = 1 / Math.pow(monthlyGrowth, monthsBack);
    const categoryLift = 1 + categoryIndex * 0.012;

    return roundToUnits(anchorValue * decay * seasonalRatio * pulse * categoryLift);
  });
}

function generateCatalog(seedCatalog, timeline) {
  return seedCatalog.map((group, groupIndex) => ({
    key: group.key,
    label: group.label,
    categories: group.categories.map((category, categoryIndex) => ({
      key: category.key,
      label: category.label,
      pageTitle: category.pageTitle,
      pieTitle: category.pieTitle,
      timeline,
      brands: category.brands.map((brand, brandIndex) => ({
        brandKey: brand.brandKey,
        brandLabel: brand.brandLabel,
        color: brand.color,
        models: brand.models.map((model) => ({
          id: model.id,
          model: model.model,
          timelineUnits: buildTimelineUnits({
            months: timeline.months,
            endMonthNumber: Number(timeline.endMonth.slice(5, 7)),
            groupIndex,
            categoryIndex,
            brandIndex,
            model,
          }),
        })),
      })),
    })),
  }));
}

async function main() {
  const now = new Date();
  const endYear = now.getFullYear();
  const endMonth = now.getMonth() + 1;
  const timeline = {
    startMonth: formatMonth(START_YEAR, START_MONTH),
    endMonth: formatMonth(endYear, endMonth),
    months: createMonthRange(START_YEAR, START_MONTH, endYear, endMonth),
  };
  const seedCatalog = getProductAnalysisSeedCatalog();
  const generatedCatalog = generateCatalog(seedCatalog, timeline);

  const output = `export const PRODUCT_ANALYSIS_GENERATED_CATALOG = ${JSON.stringify(generatedCatalog, null, 2)};\nexport const PRODUCT_ANALYSIS_GENERATED_DEFAULTS = ${JSON.stringify({ groupKey: PRODUCT_ANALYSIS_SEED_DEFAULT_GROUP_KEY, categoryKey: PRODUCT_ANALYSIS_SEED_DEFAULT_CATEGORY_KEY }, null, 2)};\n`;

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(
    currentDir,
    "../server/utils/product-analysis-generated.js",
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");

  console.log(
    JSON.stringify(
      {
        outputPath,
        startMonth: timeline.startMonth,
        endMonth: timeline.endMonth,
        totalMonths: timeline.months.length,
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
