import { getQuery } from "h3";
import { getAdvertisingEffectivenessSummary } from "../../utils/advertising-effectiveness-service";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  return getAdvertisingEffectivenessSummary({
    year: query.year,
    month: query.month,
  });
});
