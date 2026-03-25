import { REPORT_GENERATED_DATA } from "./report-generated.js";

export function getMonthlyReportData() {
  return REPORT_GENERATED_DATA.map((entry) => ({
    month: entry.month,
    indonesia: { ...entry.indonesia },
    philippines: { ...entry.philippines },
  }));
}
