import { getMonthlyReportData } from "./report-data";

const COUNTRY_LABELS = {
  all: "總覽",
  indonesia: "印尼",
  philippines: "菲律賓",
};

const currencyFormatter = new Intl.NumberFormat("zh-TW");

function parseMonth(month) {
  return new Date(`${month}-01T00:00:00+08:00`);
}

function formatMonthLabel(month) {
  const [, rawMonth] = month.split("-");
  return `${Number(rawMonth)}月`;
}

function formatPercent(value, digits = 1) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return `${value.toFixed(digits)}%`;
}

function formatDelta(value, suffix = "%") {
  if (!Number.isFinite(value)) {
    return "--";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}${suffix}`;
}

function toCurrency(value) {
  return currencyFormatter.format(Math.round(value));
}

function getLatestMonthDate(data) {
  return parseMonth(data[data.length - 1].month);
}

function getPresetRange(rangePreset, data) {
  const latestMonthDate = getLatestMonthDate(data);

  if (rangePreset === "ytd") {
    return {
      start: new Date(latestMonthDate.getFullYear(), 0, 1),
      end: latestMonthDate,
    };
  }

  const start = new Date(
    latestMonthDate.getFullYear(),
    latestMonthDate.getMonth() - 11,
    1,
  );

  return {
    start,
    end: latestMonthDate,
  };
}

export function resolveRange({ rangePreset = "last12m", startDate, endDate }) {
  const data = getMonthlyReportData();

  if (rangePreset === "custom" && startDate && endDate) {
    return {
      start: new Date(`${startDate}T00:00:00+08:00`),
      end: new Date(`${endDate}T00:00:00+08:00`),
    };
  }

  return getPresetRange(rangePreset, data);
}

function normalizeMonth(entry) {
  const indonesia = entry.indonesia;
  const philippines = entry.philippines;

  return {
    month: entry.month,
    label: formatMonthLabel(entry.month),
    all: {
      revenue: indonesia.revenue + philippines.revenue,
      target: indonesia.target + philippines.target,
      forecast: indonesia.forecast + philippines.forecast,
      adSpend: indonesia.adSpend + philippines.adSpend,
      indonesiaRevenue: indonesia.revenue,
      philippinesRevenue: philippines.revenue,
    },
    indonesia: { ...indonesia },
    philippines: { ...philippines },
  };
}

function getCountrySnapshot(entry, country) {
  return entry[country];
}

function filterByRange(data, range) {
  return data.filter((entry) => {
    const monthDate = parseMonth(entry.month);
    return monthDate >= range.start && monthDate <= range.end;
  });
}

function sumValues(rows, selector) {
  return rows.reduce((total, row) => total + selector(row), 0);
}

function getPreviousRows(allRows, currentRows) {
  if (!currentRows.length) {
    return [];
  }

  const firstIndex = allRows.findIndex(
    (row) => row.month === currentRows[0].month,
  );
  const length = currentRows.length;

  if (firstIndex <= 0) {
    return [];
  }

  const startIndex = Math.max(0, firstIndex - length);
  return allRows.slice(startIndex, firstIndex);
}

function calculateTrend(currentValue, previousValue, inverse = false) {
  if (
    !Number.isFinite(currentValue) ||
    !Number.isFinite(previousValue) ||
    previousValue === 0
  ) {
    return {
      delta: "--",
      trend: "neutral",
    };
  }

  const rawChange = ((currentValue - previousValue) / previousValue) * 100;
  const effectiveChange = inverse ? rawChange * -1 : rawChange;

  return {
    delta: formatDelta(rawChange),
    trend:
      effectiveChange > 0 ? "up" : effectiveChange < 0 ? "down" : "neutral",
  };
}

function buildHeadline(rows, previousRows, country) {
  const totalRevenue = sumValues(
    rows,
    (row) => getCountrySnapshot(row, country).revenue,
  );
  const totalTarget = sumValues(
    rows,
    (row) => getCountrySnapshot(row, country).target,
  );
  const totalAdSpend = sumValues(
    rows,
    (row) => getCountrySnapshot(row, country).adSpend,
  );
  const latest = rows[rows.length - 1];
  const latestSnapshot = latest ? getCountrySnapshot(latest, country) : null;

  const previousRevenue = sumValues(
    previousRows,
    (row) => getCountrySnapshot(row, country).revenue,
  );
  const previousTarget = sumValues(
    previousRows,
    (row) => getCountrySnapshot(row, country).target,
  );
  const previousAdSpend = sumValues(
    previousRows,
    (row) => getCountrySnapshot(row, country).adSpend,
  );
  const previousLatestSnapshot = previousRows[previousRows.length - 1]
    ? getCountrySnapshot(previousRows[previousRows.length - 1], country)
    : null;

  const achievementRate =
    totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;
  const previousAchievementRate =
    previousTarget > 0 ? (previousRevenue / previousTarget) * 100 : 0;
  const forecast = latestSnapshot?.forecast ?? null;
  const previousForecast = previousLatestSnapshot?.forecast ?? null;

  return [
    {
      key: "revenue",
      label: "累計營業額",
      value: totalRevenue,
      unit: "TWD",
      formattedValue: `NT$ ${toCurrency(totalRevenue)}`,
      helper: `${rows.length} 個月份`,
      ...calculateTrend(totalRevenue, previousRevenue),
    },
    {
      key: "achievementRate",
      label: "目標達成率",
      value: achievementRate,
      unit: "percent",
      formattedValue: formatPercent(achievementRate),
      helper: `目標 NT$ ${toCurrency(totalTarget)}`,
      delta: formatDelta(achievementRate - previousAchievementRate, "pt"),
      trend:
        achievementRate > previousAchievementRate
          ? "up"
          : achievementRate < previousAchievementRate
            ? "down"
            : "neutral",
    },
    {
      key: "forecast",
      label: "本月預測",
      value: forecast,
      unit: "TWD",
      formattedValue: forecast ? `NT$ ${toCurrency(forecast)}` : "--",
      helper: latest ? `${formatMonthLabel(latest.month)} 預測` : "暫無資料",
      ...calculateTrend(forecast, previousForecast),
    },
    {
      key: "adSpend",
      label: "廣告投入",
      value: totalAdSpend,
      unit: "TWD",
      formattedValue: `NT$ ${toCurrency(totalAdSpend)}`,
      helper: `${COUNTRY_LABELS[country]}投放`,
      ...calculateTrend(totalAdSpend, previousAdSpend, true),
    },
  ];
}

function createSeries(label, points, unit, type = "line") {
  return {
    label,
    unit,
    type,
    points,
  };
}

function mapPoints(rows, mapper) {
  return rows.map((row) => ({
    date: row.month,
    label: row.label,
    value: mapper(row),
  }));
}

function buildPrimaryTrend(rows, country) {
  return {
    title: "月營收 vs 目標",
    description: `${COUNTRY_LABELS[country]}近期待成情況`,
    series: [
      createSeries(
        "營收",
        mapPoints(rows, (row) => getCountrySnapshot(row, country).revenue),
        "TWD",
        "line",
      ),
      createSeries(
        "目標",
        mapPoints(rows, (row) => getCountrySnapshot(row, country).target),
        "TWD",
        "bar",
      ),
      createSeries(
        "預測",
        mapPoints(rows, (row) => getCountrySnapshot(row, country).forecast),
        "TWD",
        "line",
      ),
    ],
  };
}

function buildSecondaryTrend(rows, country) {
  return {
    title: "達成率與廣告投入",
    description: "",
    series: [
      createSeries(
        "達成率",
        mapPoints(rows, (row) => {
          const snapshot = getCountrySnapshot(row, country);
          return snapshot.target > 0
            ? (snapshot.revenue / snapshot.target) * 100
            : 0;
        }),
        "percent",
        "line",
      ),
      createSeries(
        "廣告投入",
        mapPoints(rows, (row) => getCountrySnapshot(row, country).adSpend),
        "TWD",
        "bar",
      ),
    ],
  };
}

function createColumn(key, label, align = "left", format = "text") {
  return { key, label, align, format };
}

function createAllRow(row) {
  const snapshot = row.all;
  const achievementRate =
    snapshot.target > 0 ? (snapshot.revenue / snapshot.target) * 100 : 0;

  return {
    month: row.label,
    revenue: snapshot.revenue,
    target: snapshot.target,
    achievementRate,
    indonesiaRevenue: snapshot.indonesiaRevenue,
    philippinesRevenue: snapshot.philippinesRevenue,
    adSpend: snapshot.adSpend,
  };
}

function createCountryRow(row, previousRow, country) {
  const snapshot = row[country];
  const previousRevenue = previousRow ? previousRow[country].revenue : null;
  const achievementRate =
    snapshot.target > 0 ? (snapshot.revenue / snapshot.target) * 100 : 0;
  const momChange =
    Number.isFinite(previousRevenue) && previousRevenue > 0
      ? ((snapshot.revenue - previousRevenue) / previousRevenue) * 100
      : null;

  return {
    month: row.label,
    revenue: snapshot.revenue,
    target: snapshot.target,
    achievementRate,
    forecast: snapshot.forecast,
    adSpend: snapshot.adSpend,
    momChange,
  };
}

function buildDetails(rows, country) {
  if (country === "all") {
    const detailRows = rows.map(createAllRow);

    return {
      columns: [
        createColumn("month", "月份"),
        createColumn("revenue", "總營收", "right", "currency"),
        createColumn("target", "總目標", "right", "currency"),
        createColumn("achievementRate", "達成率", "right", "percent"),
        createColumn("indonesiaRevenue", "印尼營收", "right", "currency"),
        createColumn("philippinesRevenue", "菲律賓營收", "right", "currency"),
        createColumn("adSpend", "總廣告投入", "right", "currency"),
      ],
      rows: detailRows,
      totals: {
        month: "合計",
        revenue: sumValues(detailRows, (row) => row.revenue),
        target: sumValues(detailRows, (row) => row.target),
        achievementRate:
          sumValues(detailRows, (row) => row.target) > 0
            ? (sumValues(detailRows, (row) => row.revenue) /
                sumValues(detailRows, (row) => row.target)) *
              100
            : 0,
        indonesiaRevenue: sumValues(detailRows, (row) => row.indonesiaRevenue),
        philippinesRevenue: sumValues(
          detailRows,
          (row) => row.philippinesRevenue,
        ),
        adSpend: sumValues(detailRows, (row) => row.adSpend),
      },
    };
  }

  const detailRows = rows.map((row, index) =>
    createCountryRow(row, index > 0 ? rows[index - 1] : null, country),
  );

  return {
    columns: [
      createColumn("month", "月份"),
      createColumn("revenue", "營收", "right", "currency"),
      createColumn("target", "目標", "right", "currency"),
      createColumn("achievementRate", "達成率", "right", "percent"),
      createColumn("forecast", "本月預測", "right", "currency"),
      createColumn("adSpend", "廣告投入", "right", "currency"),
      createColumn("momChange", "月增率", "right", "percent"),
    ],
    rows: detailRows,
    totals: {
      month: "合計",
      revenue: sumValues(detailRows, (row) => row.revenue),
      target: sumValues(detailRows, (row) => row.target),
      achievementRate:
        sumValues(detailRows, (row) => row.target) > 0
          ? (sumValues(detailRows, (row) => row.revenue) /
              sumValues(detailRows, (row) => row.target)) *
            100
          : 0,
      forecast: detailRows[detailRows.length - 1]?.forecast ?? null,
      adSpend: sumValues(detailRows, (row) => row.adSpend),
      momChange: detailRows[detailRows.length - 1]?.momChange ?? null,
    },
  };
}

export function getReportDashboard(params = {}) {
  const country = params.country || "all";
  const range = resolveRange(params);
  const normalizedRows = getMonthlyReportData().map(normalizeMonth);
  const rows = filterByRange(normalizedRows, range);
  const previousRows = getPreviousRows(normalizedRows, rows);

  return {
    range,
    country,
    headline: buildHeadline(rows, previousRows, country),
    primaryTrend: buildPrimaryTrend(rows, country),
    secondaryTrend: buildSecondaryTrend(rows, country),
    details: buildDetails(rows, country),
    updatedAt: new Date().toISOString(),
  };
}
