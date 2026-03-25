import { getQuery } from "h3";
import { getAdvertisingEffectivenessDetails } from "../../utils/advertising-effectiveness-service";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  return getAdvertisingEffectivenessDetails({
    year: query.year,
    month: query.month,
  });
});
