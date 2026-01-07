import { SERVICE_ALIASES } from "./service-aliases";

/**
 * Returns only the 6 specific services from all backend services
 */
export function matchPanelServices(panelServices: any[]) {
  const matched: {
    key: string;
    label: string;
    serviceId: string;
    rate: number | string;
    min: number;
    max: number;
    rawName: string;
  }[] = [];

  const usedServiceIds = new Set<string>();

  for (const alias of SERVICE_ALIASES) {
    const service = panelServices.find((s) => {
      const id = s.service.toString();
      return alias.include.includes(id) && !usedServiceIds.has(id);
    });

    if (service) {
      matched.push({
        key: alias.key,
        label: alias.uiName,
        serviceId: service.service.toString(),
        rate: service.rate,
        min: service.min,
        max: service.max,
        rawName: service.name,
      });
      usedServiceIds.add(service.service.toString());
    }
  }

  return matched;
}
