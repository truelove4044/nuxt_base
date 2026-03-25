import {
  ADVERTISING_EFFECTIVENESS_KPI_DEFINITIONS,
  ADVERTISING_EFFECTIVENESS_PAGE_TITLE,
  ADVERTISING_EFFECTIVENESS_TOP_BREAKDOWN_DEFINITIONS,
  ADVERTISING_EFFECTIVENESS_TOP_ITEM_COUNT,
  ADVERTISING_EFFECTIVENESS_TREND_CARD_DEFINITIONS,
} from "./advertising-effectiveness-seed.js";
import { getAdvertisingEffectivenessData } from "./advertising-effectiveness-data.js";

const numberFormatter = new Intl.NumberFormat("zh-TW");
const compactNumberFormatter = new Intl.NumberFormat("zh-TW", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function normalizeKey(value) {
  if (Array.isArray(value)) {
    return normalizeKey(value[0]);
  }

  return typeof value === "string" ? value : "";
}

function normalizeYear(value) {
  const normalized = normalizeKey(value);

  return /^\d{4}$/.test(normalized) ? normalized : "";
}

function normalizeMonth(value) {
  const normalized = normalizeKey(value);

  return /^(0[1-9]|1[0-2])$/.test(normalized) ? normalized : "";
}

function sum(values = []) {
  return values.reduce((total, value) => total + value, 0);
}

function toPercent(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");
  return `${year} 年 ${Number(month)} 月`;
}

function formatPointLabel(monthKey) {
  return `${Number(monthKey.slice(5, 7))} 月`;
}

function formatMetricValue(value, unit) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  if (unit === "currency") {
    return `NT$ ${numberFormatter.format(Math.round(value))}`;
  }

  if (unit === "percent") {
    return `${Number(value).toFixed(2)}%`;
  }

  if (unit === "decimal") {
    return Number(value).toFixed(2);
  }

  return numberFormatter.format(Math.round(value));
}

function formatCompactMetricValue(value, unit) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  if (unit === "currency") {
    return `NT$ ${compactNumberFormatter.format(value)}`;
  }

  if (unit === "percent") {
    return `${Number(value).toFixed(2)}%`;
  }

  if (unit === "decimal") {
    return Number(value).toFixed(2);
  }

  return compactNumberFormatter.format(value);
}

function formatDeltaPercent(currentValue, previousValue) {
  if (
    !Number.isFinite(currentValue) ||
    !Number.isFinite(previousValue) ||
    previousValue === 0
  ) {
    return "--";
  }

  const delta = ((currentValue - previousValue) / previousValue) * 100;
  const sign = delta > 0 ? "+" : "";

  return `${sign}${delta.toFixed(1)}%`;
}

function resolveTrend(currentValue, previousValue) {
  if (
    !Number.isFinite(currentValue) ||
    !Number.isFinite(previousValue) ||
    previousValue === 0
  ) {
    return "neutral";
  }

  if (currentValue > previousValue) {
    return "up";
  }

  if (currentValue < previousValue) {
    return "down";
  }

  return "neutral";
}

function getAvailableYears(months = []) {
  const years = new Set();

  months.forEach((monthKey) => {
    years.add(monthKey.slice(0, 4));
  });

  return [...years].sort((left, right) => Number(right) - Number(left));
}

function getMonthEntriesForYear(months = [], year = "") {
  return months
    .map((monthKey) => ({
      monthKey,
      year: monthKey.slice(0, 4),
      month: monthKey.slice(5, 7),
      monthNumber: Number(monthKey.slice(5, 7)),
    }))
    .filter((entry) => entry.year === year);
}

function buildYearOptions(years = []) {
  return years.map((year) => ({
    key: year,
    value: year,
    label: `${year} 年`,
  }));
}

function buildMonthOptions(monthEntries = []) {
  return monthEntries.map((entry) => ({
    key: entry.month,
    value: entry.month,
    label: `${entry.monthNumber} 月`,
  }));
}

function getResolvedSelection(params = {}) {
  const data = getAdvertisingEffectivenessData();
  const timelineMonths = data.timeline?.months || data.monthly.map((entry) => entry.month);
  const availableYears = getAvailableYears(timelineMonths);
  const requestedYear = normalizeYear(params.year);
  const activeYear =
    availableYears.find((year) => year === requestedYear) || availableYears[0] || "";
  const monthEntries = getMonthEntriesForYear(timelineMonths, activeYear);
  const requestedMonth = normalizeMonth(params.month);
  const activeMonth =
    monthEntries.find((entry) => entry.month === requestedMonth)?.month ||
    monthEntries[monthEntries.length - 1]?.month ||
    "";
  const activeMonthKey =
    monthEntries.find((entry) => entry.month === activeMonth)?.monthKey || "";
  const activeIndex = data.monthly.findIndex((entry) => entry.month === activeMonthKey);

  return {
    data,
    availableYears,
    activeYear,
    activeMonth,
    activeMonthKey,
    activeIndex,
    yearOptions: buildYearOptions(availableYears),
    monthOptions: buildMonthOptions(monthEntries),
  };
}

function aggregateMonth(monthEntry) {
  const totals = {
    cost: sum(monthEntry.items.map((item) => item.cost)),
    impressions: sum(monthEntry.items.map((item) => item.impressions)),
    clicks: sum(monthEntry.items.map((item) => item.clicks)),
    gaCart: sum(monthEntry.items.map((item) => item.gaCart)),
    biCart: sum(monthEntry.items.map((item) => item.biCart)),
    biQualifiedLeads: sum(monthEntry.items.map((item) => item.biQualifiedLeads)),
    orders: sum(monthEntry.items.map((item) => item.orders)),
  };

  return {
    ...totals,
    cpc: totals.clicks > 0 ? totals.cost / totals.clicks : 0,
    ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    cvrAct: totals.clicks > 0 ? (totals.gaCart / totals.clicks) * 100 : 0,
    cvrOrder: totals.clicks > 0 ? (totals.orders / totals.clicks) * 100 : 0,
  };
}

function buildHeadline(latestEntry, previousEntry) {
  const latestTotals = aggregateMonth(latestEntry);
  const previousTotals = previousEntry ? aggregateMonth(previousEntry) : null;

  return ADVERTISING_EFFECTIVENESS_KPI_DEFINITIONS.map((definition) => {
    const currentValue = latestTotals[definition.key];
    const previousValue = previousTotals?.[definition.key];
    const formattedPreviousValue = formatMetricValue(previousValue, definition.unit);

    return {
      key: definition.key,
      label: definition.label,
      value: currentValue,
      formattedValue: formatMetricValue(currentValue, definition.unit),
      compareValue: previousValue ?? null,
      formattedCompareValue: formattedPreviousValue,
      delta: formatDeltaPercent(currentValue, previousValue),
      trend: resolveTrend(currentValue, previousValue),
      helper: `上期 ${formattedPreviousValue}`,
    };
  });
}

function buildTrendCards(monthly) {
  const recentEntries = monthly.slice(-12);
  const monthlyTotals = recentEntries.map((entry) => ({
    month: entry.month,
    ...aggregateMonth(entry),
  }));
  const latestTotals = monthlyTotals[monthlyTotals.length - 1] || null;

  return ADVERTISING_EFFECTIVENESS_TREND_CARD_DEFINITIONS.map((definition) => ({
    key: definition.key,
    eyebrow: definition.eyebrow,
    title: definition.title,
    headlineValue: latestTotals?.[definition.headlineMetricKey] ?? null,
    headlineUnit: definition.headlineUnit,
    series: [
      {
        label: definition.barLabel,
        unit: definition.barUnit,
        type: "bar",
        points: monthlyTotals.map((entry) => ({
          date: entry.month,
          label: formatPointLabel(entry.month),
          value: definition.barMetricKey in entry ? entry[definition.barMetricKey] : 0,
        })),
      },
      {
        label: definition.lineLabel,
        unit: definition.lineUnit,
        type: "line",
        points: monthlyTotals.map((entry) => ({
          date: entry.month,
          label: formatPointLabel(entry.month),
          value:
            definition.lineMetricKey in entry
              ? definition.lineUnit === "percent"
                ? toPercent(entry[definition.lineMetricKey])
                : entry[definition.lineMetricKey]
              : 0,
        })),
      },
    ],
  }));
}

function buildTopBreakdowns(latestEntry) {
  return ADVERTISING_EFFECTIVENESS_TOP_BREAKDOWN_DEFINITIONS.map((definition) => {
    const items = [...latestEntry.items]
      .sort((left, right) => right[definition.metricKey] - left[definition.metricKey])
      .slice(0, ADVERTISING_EFFECTIVENESS_TOP_ITEM_COUNT);
    const totalValue = sum(items.map((item) => item[definition.metricKey]));

    return {
      key: definition.key,
      eyebrow: definition.eyebrow,
      title: definition.title,
      items: items.map((item, index) => ({
        key: item.key,
        rank: index + 1,
        label: item.label,
        value: item[definition.metricKey],
        formattedValue: formatCompactMetricValue(item[definition.metricKey], definition.unit),
        share: totalValue > 0 ? toPercent((item[definition.metricKey] / totalValue) * 100, 1) : 0,
        color: item.color,
        secondaryText: `${formatCompactMetricValue(
          item[definition.metricKey],
          definition.unit,
        )} ・${toPercent(
          totalValue > 0 ? (item[definition.metricKey] / totalValue) * 100 : 0,
          1,
        )}%`,
      })),
    };
  });
}

export function getAdvertisingEffectivenessSummary(params = {}) {
  const {
    data,
    yearOptions,
    monthOptions,
    activeYear,
    activeMonth,
    activeMonthKey,
    activeIndex,
  } = getResolvedSelection(params);
  const activeEntry = activeIndex >= 0 ? data.monthly[activeIndex] : null;
  const previousEntry = activeIndex > 0 ? data.monthly[activeIndex - 1] : null;

  return {
    pageTitle: ADVERTISING_EFFECTIVENESS_PAGE_TITLE,
    updatedAt: data.updatedAt,
    latestMonthLabel: activeMonthKey ? formatMonthLabel(activeMonthKey) : "",
    yearOptions,
    monthOptions,
    activeYear,
    activeMonth,
    headline: activeEntry ? buildHeadline(activeEntry, previousEntry) : [],
  };
}

export function getAdvertisingEffectivenessDetails(params = {}) {
  const { data, activeIndex } = getResolvedSelection(params);
  const activeEntry = activeIndex >= 0 ? data.monthly[activeIndex] : null;
  const trendSource =
    activeIndex >= 0
      ? data.monthly.slice(Math.max(0, activeIndex - 11), activeIndex + 1)
      : [];

  return {
    updatedAt: data.updatedAt,
    trendCards: buildTrendCards(trendSource),
    topBreakdowns: activeEntry ? buildTopBreakdowns(activeEntry) : [],
  };
}
