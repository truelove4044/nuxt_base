import {
  PRODUCT_ANALYSIS_GENERATED_CATALOG,
} from "./product-analysis-generated.js";

const PRODUCT_ANALYSIS_DEFAULT_GROUP_KEY = "communication";
const PRODUCT_ANALYSIS_DEFAULT_CATEGORY_KEY = "phone";

export { PRODUCT_ANALYSIS_DEFAULT_GROUP_KEY, PRODUCT_ANALYSIS_DEFAULT_CATEGORY_KEY };

export function getProductAnalysisCatalog() {
  return PRODUCT_ANALYSIS_GENERATED_CATALOG.map((group) => ({
    key: group.key,
    label: group.label,
    categories: group.categories.map((category) => ({
      key: category.key,
      label: category.label,
      pageTitle: category.pageTitle,
      pieTitle: category.pieTitle,
      timeline: {
        startMonth: category.timeline.startMonth,
        endMonth: category.timeline.endMonth,
        months: [...category.timeline.months],
      },
      brands: category.brands.map((brand) => ({
        brandKey: brand.brandKey,
        brandLabel: brand.brandLabel,
        color: brand.color,
        models: brand.models.map((model) => ({
          id: model.id,
          model: model.model,
          timelineUnits: [...model.timelineUnits],
        })),
      })),
    })),
  }));
}
