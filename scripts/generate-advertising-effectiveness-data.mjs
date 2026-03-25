import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ADVERTISING_EFFECTIVENESS_PAGE_TITLE,
  ADVERTISING_EFFECTIVENESS_START_MONTH,
  ADVERTISING_EFFECTIVENESS_START_YEAR,
  getAdvertisingEffectivenessSeedItems,
} from "../server/utils/advertising-effectiveness-seed.js";

const COST_SEASONALITY = [
  0.92, 0.9, 0.96, 1.02, 1.06, 1.14, 1.11, 1.08, 1.16, 1.24, 1.33, 1.48,
];
const CTR_CURVE = [
  0.96, 0.98, 0.99, 1.01, 1.02, 1.04, 1.03, 1.01, 1.05, 1.08, 1.11, 1.13,
];
const CPC_CURVE = [
  0.97, 0.98, 1.01, 1.02, 1.03, 1.08, 1.06, 1.04, 1.09, 1.14, 1.18, 1.25,
];
const CART_CURVE = [
  0.95, 0.96, 0.98, 1.01, 1.03, 1.06, 1.04, 1.02, 1.07, 1.1, 1.16, 1.21,
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function roundInteger(value) {
  return Math.max(0, Math.round(value));
}

function roundDecimal(value) {
  return Math.round(value * 100) / 100;
}

function buildMonthItem(item, monthKey, monthIndex) {
  const monthNumber = Number(monthKey.slice(5, 7));
  const seasonalIndex = (monthNumber - 1 + item.phase) % 12;
  const growthFactor = Math.pow(1 + item.monthlyGrowth, monthIndex);
  const pulseSeed = hashString(`${item.key}:${monthKey}`);
  const pulse = 1 + ((pulseSeed % 13) - 6) * 0.012;
  const efficiencyPulse = 1 + ((pulseSeed % 9) - 4) * 0.008;
  const cost =
    item.baseCost * growthFactor * COST_SEASONALITY[seasonalIndex] * pulse;
  const cpc =
    item.cpcBase *
    CPC_CURVE[seasonalIndex] *
    (1 + monthIndex * 0.0012) *
    efficiencyPulse;
  const ctr = clamp(
    item.ctrBase * CTR_CURVE[seasonalIndex] * (2 - efficiencyPulse),
    0.012,
    0.06,
  );
  const clicks = cost / cpc;
  const impressions = clicks / ctr;
  const gaCartRate = clamp(
    item.gaCartRate * CART_CURVE[seasonalIndex] * efficiencyPulse,
    0.08,
    0.34,
  );
  const biCartRate = clamp(item.biCartRate * (1 + (pulseSeed % 5) * 0.004), 0.62, 0.92);
  const leadRate = clamp(item.leadRate * (1 + ((pulseSeed % 7) - 3) * 0.006), 0.28, 0.6);
  const orderRate = clamp(item.orderRate * (1 + ((pulseSeed % 11) - 5) * 0.005), 0.2, 0.52);

  const gaCart = clicks * gaCartRate;
  const biCart = gaCart * biCartRate;
  const biQualifiedLeads = biCart * leadRate;
  const orders = biQualifiedLeads * orderRate;

  return {
    key: item.key,
    label: item.label,
    color: item.color,
    cost: roundInteger(cost),
    impressions: roundInteger(impressions),
    clicks: roundInteger(clicks),
    gaCart: roundInteger(gaCart),
    biCart: roundInteger(biCart),
    biQualifiedLeads: roundInteger(biQualifiedLeads),
    orders: roundInteger(orders),
    cpc: roundDecimal(cpc),
  };
}

async function main() {
  const now = new Date();
  const endYear = now.getFullYear();
  const endMonth = now.getMonth() + 1;
  const months = createMonthRange(
    ADVERTISING_EFFECTIVENESS_START_YEAR,
    ADVERTISING_EFFECTIVENESS_START_MONTH,
    endYear,
    endMonth,
  );
  const itemCatalog = getAdvertisingEffectivenessSeedItems().map((item) => ({
    key: item.key,
    label: item.label,
    color: item.color,
  }));
  const monthly = months.map((monthKey, monthIndex) => ({
    month: monthKey,
    items: getAdvertisingEffectivenessSeedItems().map((item) =>
      buildMonthItem(item, monthKey, monthIndex),
    ),
  }));
  const updatedAt = `${months[months.length - 1]}-01T12:00:00.000+08:00`;

  const output = `export const ADVERTISING_EFFECTIVENESS_GENERATED_DATA = ${JSON.stringify(
    {
      pageTitle: ADVERTISING_EFFECTIVENESS_PAGE_TITLE,
      updatedAt,
      timeline: {
        startMonth: months[0],
        endMonth: months[months.length - 1],
        months,
      },
      itemCatalog,
      monthly,
    },
    null,
    2,
  )};\n`;

  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const outputPath = path.resolve(
    currentDir,
    "../server/utils/advertising-effectiveness-generated.js",
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");

  console.log(
    JSON.stringify(
      {
        outputPath,
        startMonth: months[0],
        endMonth: months[months.length - 1],
        totalMonths: months.length,
        totalItems: itemCatalog.length,
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
