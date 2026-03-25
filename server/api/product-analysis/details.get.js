import { getQuery } from "h3";
import { getProductAnalysisDetails } from "../../utils/product-analysis-service";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  return getProductAnalysisDetails({
    group: query.group,
    category: query.category,
    year: query.year,
  });
});
