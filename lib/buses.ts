import raw from "@/data/buses.json";

export interface Stop {
  id: string;
  nameEn: string;
  nameBn: string;
  aliases?: string[];
}

export interface Bus {
  id: string;
  nameEn: string;
  nameBn: string;
  area: string;
  stopIds: string[];
}

interface RawData {
  stops: Stop[];
  buses: Bus[];
}

const data = raw as RawData;

export const stops: Stop[] = data.stops;
export const buses: Bus[] = data.buses;

export const stopById = new Map<string, Stop>(stops.map((s) => [s.id, s]));
export const busById = new Map<string, Bus>(buses.map((b) => [b.id, b]));

export function getStops(): Stop[] {
  return stops;
}

export function getBuses(): Bus[] {
  return buses;
}

export function getBus(id: string): Bus | undefined {
  return busById.get(id);
}

export function getStop(id: string): Stop | undefined {
  return stopById.get(id);
}

export function stopLabel(stop: Stop, lang: "en" | "bn" = "en"): string {
  return lang === "bn" ? stop.nameBn : stop.nameEn;
}

export function stopSubLabel(stop: Stop, lang: "en" | "bn" = "en"): string {
  return lang === "bn" ? stop.nameEn : stop.nameBn;
}

export function busLabel(bus: Bus, lang: "en" | "bn" = "en"): string {
  return lang === "bn" ? bus.nameBn : bus.nameEn;
}

/** Normalize for search: lowercase, trim, collapse spaces. Works for EN + BN includes. */
export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function filterStops(query: string, limit = 8): Stop[] {
  const q = normalize(query);
  if (!q) return stops.slice(0, limit);
  const starts: Stop[] = [];
  const contains: Stop[] = [];
  for (const s of stops) {
    const en = normalize(s.nameEn);
    const bn = s.nameBn; // Bangla: substring match on raw (case-insensitive N/A)
    const bnNorm = s.nameBn.trim().replace(/\s+/g, " ");
    const hayEn = en.includes(q);
    const hayBn = bn.includes(query.trim()) || bnNorm.includes(query.trim());
    const aliasHit = (s.aliases ?? []).some((a) => normalize(a).includes(q));
    if (en.startsWith(q) || s.nameBn.startsWith(query.trim())) starts.push(s);
    else if (hayEn || hayBn || aliasHit) contains.push(s);
    if (starts.length + contains.length >= 60) break;
  }
  return [...starts, ...contains].slice(0, limit);
}

/** Resolve a query string to a stop: exact id match first, then exact name match, then best fuzzy. */
export function resolveStop(input: string | null | undefined): Stop | undefined {
  if (!input) return undefined;
  const v = input.trim();
  if (!v) return undefined;
  // id match (URL params use ids)
  const byId = stopById.get(normalize(v).replace(/\s+/g, "-"));
  if (byId) return byId;
  const direct = stopById.get(v);
  if (direct) return direct;
  const q = normalize(v);
  // exact name match
  for (const s of stops) {
    if (normalize(s.nameEn) === q || s.nameBn.trim() === v) return s;
  }
  const hits = filterStops(v, 1);
  return hits[0];
}
