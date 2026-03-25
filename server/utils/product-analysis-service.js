import {
  getProductAnalysisCatalog,
  PRODUCT_ANALYSIS_DEFAULT_CATEGORY_KEY,
  PRODUCT_ANALYSIS_DEFAULT_GROUP_KEY,
} from "./product-analysis-data.js";

function sum(values = []) {
  return values.reduce((total, value) => total + value, 0);
}

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

function sumMonthlyUnits(rows, monthCount) {
  const totals = Array.from({ length: monthCount }, () => 0);

  rows.forEach((row) => {
    row.monthlyUnits.forEach((units, monthIndex) => {
      totals[monthIndex] += units;
    });
  });

  return totals;
}

function toPercent(value, digits = 1) {
  return Number(value.toFixed(digits));
}

function getAvailableYears(category) {
  const years = new Set();

  category.timeline.months.forEach((monthKey) => {
    years.add(monthKey.slice(0, 4));
  });

  return [...years].sort((left, right) => Number(right) - Number(left));
}

function getYearSlice(category, requestedYear) {
  const availableYears = getAvailableYears(category);
  const activeYear =
    availableYears.find((year) => year === normalizeYear(requestedYear)) ||
    availableYears[0] ||
    "";
  const monthEntries = category.timeline.months
    .map((monthKey, index) => ({
      monthKey,
      monthNumber: Number(monthKey.slice(5, 7)),
      index,
    }))
    .filter((entry) => entry.monthKey.startsWith(`${activeYear}-`));
  const monthIndices = monthEntries.map((entry) => entry.index);

  return {
    activeYear,
    availableYears,
    monthEntries,
    monthIndices,
    latestMonthKey: monthEntries[monthEntries.length - 1]?.monthKey || "",
  };
}

function sliceBrandsByYear(brands, monthIndices) {
  return brands.map((brand) => ({
    ...brand,
    models: brand.models.map((model) => ({
      ...model,
      monthlyUnits: monthIndices.map((index) => model.timelineUnits[index] || 0),
    })),
  }));
}

function buildGroups(brands, monthCount) {
  return brands.map((brand) => ({
    brandKey: brand.brandKey,
    brandLabel: brand.brandLabel,
    brandTotals: sumMonthlyUnits(brand.models, monthCount),
  }));
}

function buildRows(brands) {
  const rows = [];

  brands.forEach((brand) => {
    brand.models.forEach((model) => {
      rows.push({
        id: model.id,
        brandKey: brand.brandKey,
        model: model.model,
        monthlyUnits: [...model.monthlyUnits],
      });
    });
  });

  return rows;
}

function resolveHeatMax(groups, rows) {
  const allValues = [];

  groups.forEach((group) => {
    allValues.push(...group.brandTotals);
  });

  rows.forEach((row) => {
    allValues.push(...row.monthlyUnits);
  });

  return allValues.length ? Math.max(...allValues) : 0;
}

function getResolvedSelection(groupKey, categoryKey, year) {
  const catalog = getProductAnalysisCatalog();
  const fallbackGroup =
    catalog.find((group) => group.key === PRODUCT_ANALYSIS_DEFAULT_GROUP_KEY) ||
    catalog[0];
  const requestedGroup = catalog.find((group) => group.key === normalizeKey(groupKey));
  const activeGroup = requestedGroup || fallbackGroup;

  const requestedCategory = activeGroup.categories.find(
    (category) => category.key === normalizeKey(categoryKey),
  );
  const fallbackCategory =
    activeGroup.categories.find(
      (category) => category.key === PRODUCT_ANALYSIS_DEFAULT_CATEGORY_KEY,
    ) || activeGroup.categories[0];
  const activeCategory = requestedCategory || fallbackCategory;
  const yearSlice = getYearSlice(activeCategory, year);

  return {
    catalog,
    activeGroup,
    activeCategory,
    yearSlice,
  };
}

function buildGroupOptions(catalog) {
  return catalog.map((group) => ({
    key: group.key,
    label: group.label,
    defaultCategoryKey: group.categories[0]?.key || "",
  }));
}

function buildCategoryOptions(group) {
  return group.categories.map((category) => ({
    key: category.key,
    label: category.label,
  }));
}

function buildYearOptions(years) {
  return years.map((year) => ({
    key: year,
    label: `${year} 年`,
  }));
}

export function getProductAnalysisSummary(params = {}) {
  const { catalog, activeGroup, activeCategory, yearSlice } = getResolvedSelection(
    params.group,
    params.category,
    params.year,
  );
  const latestMonthKey = yearSlice.latestMonthKey;
  const latestMonth = Number(latestMonthKey.slice(5, 7));
  const latestMonthIndex = yearSlice.monthIndices[yearSlice.monthIndices.length - 1];

  const items = activeCategory.brands.map((brand) => {
    const latestUnits = brand.models.reduce(
      (total, model) => total + (model.timelineUnits[latestMonthIndex] || 0),
      0,
    );

    return {
      key: brand.brandKey,
      label: brand.brandLabel,
      color: brand.color,
      units: latestUnits,
    };
  });

  const totalUnits = sum(items.map((item) => item.units));

  return {
    pageTitle: activeCategory.pageTitle,
    groupOptions: buildGroupOptions(catalog),
    categoryOptions: buildCategoryOptions(activeGroup),
    yearOptions: buildYearOptions(yearSlice.availableYears),
    activeGroupKey: activeGroup.key,
    activeCategoryKey: activeCategory.key,
    activeYear: yearSlice.activeYear,
    pieChart: {
      title: activeCategory.pieTitle,
      monthLabel: `${latestMonthKey.slice(0, 4)} 年 ${latestMonth} 月`,
      items: items.map((item) => ({
        ...item,
        share: totalUnits > 0 ? toPercent((item.units / totalUnits) * 100) : 0,
      })),
    },
  };
}

export function getProductAnalysisDetails(params = {}) {
  const { activeCategory, yearSlice } = getResolvedSelection(
    params.group,
    params.category,
    params.year,
  );
  const brands = sliceBrandsByYear(activeCategory.brands, yearSlice.monthIndices);
  const monthCount = yearSlice.monthEntries.length;
  const groups = buildGroups(brands, monthCount);
  const rows = buildRows(brands);

  return {
    matrixHeader: {
      year: Number(yearSlice.activeYear) || null,
      months: yearSlice.monthEntries.map((entry) => entry.monthNumber),
    },
    groups,
    rows,
    heatmap: {
      maxValue: resolveHeatMax(groups, rows),
    },
  };
}
