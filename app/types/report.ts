export type ReportCountry = "all" | "indonesia" | "philippines";

export type ReportRangePreset = "last12m" | "ytd" | "custom";

export type ReportPoint = {
  date: string;
  label: string;
  value: number;
};

export type ReportSeries = {
  label: string;
  unit: string;
  type?: "line" | "bar";
  points: ReportPoint[];
};

export type ReportHeadlineItem = {
  key: string;
  label: string;
  value: number | null;
  unit: string;
  formattedValue: string;
  helper: string;
  delta: string;
  trend: "up" | "down" | "neutral";
};

export type ReportDetailRow = {
  month: string;
  revenue: number;
  target: number;
  achievementRate: number;
  forecast?: number | null;
  adSpend: number;
  momChange?: number | null;
  indonesiaRevenue?: number;
  philippinesRevenue?: number;
};
