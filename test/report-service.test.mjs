import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, "..");

function getPresetResult(rangePreset, timezone) {
  const script = `
    import { getReportDashboard } from './server/utils/report-service.js';
    const result = getReportDashboard({ rangePreset: '${rangePreset}', country: 'all' });
    console.log(JSON.stringify({
      labels: result.primaryTrend.series[0].points.map((point) => point.label),
      detailMonths: result.details.rows.map((row) => row.month),
    }));
  `;

  const output = execFileSync(
    process.execPath,
    ["--input-type=module", "--eval", script],
    {
      cwd: repoRoot,
      env: {
        ...process.env,
        TZ: timezone,
      },
      encoding: "utf8",
    },
  );

  return JSON.parse(output.trim());
}

test("UTC preset ranges keep the first business month", () => {
  const cases = [
    {
      preset: "q1",
      labels: ["1月", "2月", "3月"],
      detailMonths: ["2026年1月", "2026年2月", "2026年3月"],
    },
    {
      preset: "q4",
      labels: ["10月", "11月", "12月"],
      detailMonths: ["2026年10月", "2026年11月", "2026年12月"],
    },
    {
      preset: "last3m",
      labels: ["1月", "2月", "3月"],
      detailMonths: ["2026年1月", "2026年2月", "2026年3月"],
    },
    {
      preset: "last6m",
      labels: ["10月", "11月", "12月", "1月", "2月", "3月"],
      detailMonths: [
        "2025年10月",
        "2025年11月",
        "2025年12月",
        "2026年1月",
        "2026年2月",
        "2026年3月",
      ],
    },
    {
      preset: "ytd",
      labels: ["1月", "2月", "3月"],
      detailMonths: ["2026年1月", "2026年2月", "2026年3月"],
    },
  ];

  cases.forEach(({ preset, labels, detailMonths }) => {
    const result = getPresetResult(preset, "UTC");
    assert.deepEqual(result.labels, labels, `${preset} labels should match`);
    assert.deepEqual(
      result.detailMonths,
      detailMonths,
      `${preset} detail rows should match`,
    );
  });
});

test("preset ranges are consistent between UTC and Asia/Taipei", () => {
  const presets = ["last3m", "last6m", "ytd", "q1", "q2", "q3", "q4"];

  presets.forEach((preset) => {
    const utcResult = getPresetResult(preset, "UTC");
    const taipeiResult = getPresetResult(preset, "Asia/Taipei");

    assert.deepEqual(
      utcResult,
      taipeiResult,
      `${preset} should not depend on host timezone`,
    );
  });
});
