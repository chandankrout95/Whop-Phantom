import { SERVICE_ALIASES } from "./service-aliases";

export function matchPanelServices(allServices: any[]) {
  return SERVICE_ALIASES.map(alias => {
    let bestMatch = null;
    let bestScore = 0;

    for (const service of allServices) {
      const name = service.name?.toLowerCase() || "";
      let score = 0;

      for (const keyword of alias.match) {
        if (name.includes(keyword)) {
          score++;
        }
      }

      // require at least 2 keyword matches (tunable)
      if (score >= 2 && score > bestScore) {
        bestScore = score;
        bestMatch = service;
      }
    }

    if (!bestMatch) return null;

    return {
      key: alias.key,
      label: alias.uiName,
      serviceId: String(bestMatch.service),
      rate: bestMatch.rate,
      rawName: bestMatch.name,
      score: bestScore, // debug
    };
  }).filter(Boolean);
}
