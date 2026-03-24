import { getReportDashboard } from "../../utils/report-service";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const dashboard = getReportDashboard({
    country: String(query.country || "all"),
    rangePreset: String(query.rangePreset || "last12m"),
    startDate: query.startDate ? String(query.startDate) : "",
    endDate: query.endDate ? String(query.endDate) : "",
  });

  return dashboard.details;
});
