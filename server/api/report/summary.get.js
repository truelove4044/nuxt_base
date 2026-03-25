import { getReportDashboard } from "../../utils/report-service";

const validCountries = new Set(["all", "indonesia", "philippines"]);
const validPresets = new Set([
  "last3m",
  "last6m",
  "last12m",
  "q1",
  "q2",
  "q3",
  "q4",
  "ytd",
  "custom",
]);

function assertValidQuery(query) {
  if (!validCountries.has(query.country)) {
    throw createError({
      statusCode: 400,
      statusMessage: "無效的國別參數",
      data: {
        message: "country 參數錯誤",
      },
    });
  }

  if (!validPresets.has(query.rangePreset)) {
    throw createError({
      statusCode: 400,
      statusMessage: "無效的時間區間參數",
      data: {
        message: "rangePreset 參數錯誤",
      },
    });
  }

  if (query.rangePreset === "custom" && (!query.startDate || !query.endDate)) {
    throw createError({
      statusCode: 400,
      statusMessage: "自訂區間缺少日期",
      data: {
        message: "自訂區間需提供開始與結束日期",
      },
    });
  }
}

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const normalizedQuery = {
    country: String(query.country || "all"),
    rangePreset: String(query.rangePreset || "last12m"),
    startDate: query.startDate ? String(query.startDate) : "",
    endDate: query.endDate ? String(query.endDate) : "",
  };

  assertValidQuery(normalizedQuery);

  const dashboard = getReportDashboard(normalizedQuery);

  return {
    headline: dashboard.headline,
    primaryTrend: dashboard.primaryTrend,
    secondaryTrend: dashboard.secondaryTrend,
    updatedAt: dashboard.updatedAt,
  };
});
