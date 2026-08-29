// Generated from a 15-mile-radius ZIP code export centered on the business address (Hadley St).
// Used by the ZIP-code lookup in ServiceArea.tsx.
export const SERVICE_AREA_ZIPS: Record<string, { city: string; state: string }> = {
  "66283": { city: "Overland Park", state: "KS" },
  "66223": { city: "Overland Park", state: "KS" },
  "66221": { city: "Overland Park", state: "KS" },
  "66225": { city: "Overland Park", state: "KS" },
  "66213": { city: "Overland Park", state: "KS" },
  "66224": { city: "Overland Park", state: "KS" },
  "66209": { city: "Leawood", state: "KS" },
  "66251": { city: "Overland Park", state: "KS" },
  "66085": { city: "Stilwell", state: "KS" },
  "66210": { city: "Overland Park", state: "KS" },
  "64145": { city: "Kansas City", state: "MO" },
  "66211": { city: "Leawood", state: "KS" },
  "66062": { city: "Olathe", state: "KS" },
  "64146": { city: "Kansas City", state: "MO" },
  "66282": { city: "Overland Park", state: "KS" },
  "66212": { city: "Overland Park", state: "KS" },
  "66207": { city: "Overland Park", state: "KS" },
  "66063": { city: "Olathe", state: "KS" },
  "64147": { city: "Kansas City", state: "MO" },
  "66051": { city: "Olathe", state: "KS" },
  "66214": { city: "Overland Park", state: "KS" },
  "66215": { city: "Lenexa", state: "KS" },
  "66201": { city: "Mission", state: "KS" },
  "66206": { city: "Leawood", state: "KS" },
  "66219": { city: "Lenexa", state: "KS" },
  "64114": { city: "Kansas City", state: "MO" },
  "64012": { city: "Belton", state: "MO" },
  "66013": { city: "Bucyrus", state: "KS" },
  "64030": { city: "Grandview", state: "MO" },
  "66250": { city: "Lenexa", state: "KS" },
  "64131": { city: "Kansas City", state: "MO" },
  "64137": { city: "Kansas City", state: "MO" },
  "64197": { city: "Kansas City", state: "MO" },
  "66204": { city: "Overland Park", state: "KS" },
  "64999": { city: "Kansas City", state: "MO" },
  "64170": { city: "Kansas City", state: "MO" },
  "66276": { city: "Lenexa", state: "KS" },
  "66208": { city: "Prairie Village", state: "KS" },
  "66220": { city: "Lenexa", state: "KS" },
  "66061": { city: "Olathe", state: "KS" },
  "66285": { city: "Lenexa", state: "KS" },
  "66216": { city: "Shawnee", state: "KS" },
  "66203": { city: "Shawnee", state: "KS" },
  "66031": { city: "New Century", state: "KS" },
  "66202": { city: "Mission", state: "KS" },
  "66222": { city: "Mission", state: "KS" },
  "64113": { city: "Kansas City", state: "MO" },
  "64132": { city: "Kansas City", state: "MO" },
  "64134": { city: "Kansas City", state: "MO" },
  "64149": { city: "Kansas City", state: "MO" },
  "66217": { city: "Shawnee", state: "KS" },
  "66083": { city: "Spring Hill", state: "KS" },
  "66205": { city: "Mission", state: "KS" },
  "66218": { city: "Shawnee", state: "KS" },
  "66227": { city: "Lenexa", state: "KS" },
  "64112": { city: "Kansas City", state: "MO" },
  "64083": { city: "Raymore", state: "MO" },
  "64110": { city: "Kansas City", state: "MO" },
  "64138": { city: "Kansas City", state: "MO" },
  "66286": { city: "Shawnee", state: "KS" },
  "64171": { city: "Kansas City", state: "MO" },
  "66030": { city: "Gardner", state: "KS" },
  "66160": { city: "Kansas City", state: "KS" },
  "64130": { city: "Kansas City", state: "MO" },
  "66103": { city: "Kansas City", state: "KS" },
  "66106": { city: "Kansas City", state: "KS" },
  "64111": { city: "Kansas City", state: "MO" },
};

// Every distinct city/state covered by the ZIP list above, deduped and
// alphabetized — used to render the "cities we serve" list without repeating
// a city once per ZIP code.
export const SERVICE_AREA_CITIES: { city: string; state: string }[] = (() => {
  const seen = new Set<string>();
  const cities: { city: string; state: string }[] = [];
  for (const { city, state } of Object.values(SERVICE_AREA_ZIPS)) {
    const key = `${city}, ${state}`;
    if (!seen.has(key)) {
      seen.add(key);
      cities.push({ city, state });
    }
  }
  return cities.sort((a, b) => a.city.localeCompare(b.city));
})();
