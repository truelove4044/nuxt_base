import { getQuery } from "h3";
import { getProductAnalysisSummary } from "../../utils/product-analysis-service";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  return getProductAnalysisSummary({
    group: query.group,
    category: query.category,
    year: query.year,
  });
});
