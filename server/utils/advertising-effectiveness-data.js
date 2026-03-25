import { ADVERTISING_EFFECTIVENESS_GENERATED_DATA } from "./advertising-effectiveness-generated.js";

export function getAdvertisingEffectivenessData() {
  return {
    ...ADVERTISING_EFFECTIVENESS_GENERATED_DATA,
    itemCatalog: ADVERTISING_EFFECTIVENESS_GENERATED_DATA.itemCatalog.map(
      (item) => ({
        ...item,
      }),
    ),
    monthly: ADVERTISING_EFFECTIVENESS_GENERATED_DATA.monthly.map((entry) => ({
      month: entry.month,
      items: entry.items.map((item) => ({
        ...item,
      })),
    })),
  };
}
