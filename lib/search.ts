import { buses, getStop, type Bus, type Stop } from "./buses";

export interface DirectResult {
  kind: "direct";
  bus: Bus;
  from: Stop;
  to: Stop;
  fromIndex: number;
  toIndex: number;
  stopsBetween: number;
  /** Stops in travel order from `from` to `to` (inclusive). */
  segment: Stop[];
  /** Which terminus this direction heads toward. */
  toward: Stop;
}

export interface TransferResult {
  kind: "transfer";
  firstBus: Bus;
  secondBus: Bus;
  from: Stop;
  interchange: Stop;
  to: Stop;
  firstLeg: Stop[];
  secondLeg: Stop[];
  totalStops: number;
}

export type SearchOutcome =
  | { status: "missing" }
  | { status: "same" }
  | { status: "not-found"; missing: ("from" | "to")[] }
  | { status: "ok"; direct: DirectResult[]; transfers: TransferResult[] };

export function findDirect(fromId: string, toId: string): DirectResult[] {
  const results: DirectResult[] = [];
  for (const bus of buses) {
    const fi = bus.stopIds.indexOf(fromId);
    const ti = bus.stopIds.indexOf(toId);
    if (fi === -1 || ti === -1) continue;
    // Bidirectional: match regardless of order.
    const lo = Math.min(fi, ti);
    const hi = Math.max(fi, ti);
    const forward = fi <= ti;
    const ids = forward ? bus.stopIds.slice(lo, hi + 1) : bus.stopIds.slice(lo, hi + 1).reverse();
    const segment = ids
      .map((id) => getStop(id))
      .filter((s): s is Stop => Boolean(s));
    const from = getStop(fromId)!;
    const to = getStop(toId)!;
    // "toward" = terminus at the end of travel direction
    const towardId = forward ? bus.stopIds[bus.stopIds.length - 1] : bus.stopIds[0];
    results.push({
      kind: "direct",
      bus,
      from,
      to,
      fromIndex: fi,
      toIndex: ti,
      stopsBetween: Math.abs(ti - fi) - 1,
      segment,
      toward: getStop(towardId)!,
    });
  }
  // Shortest ride first.
  results.sort((a, b) => a.stopsBetween - b.stopsBetween);
  return results;
}

export function findTransfers(fromId: string, toId: string, limit = 5): TransferResult[] {
  const candidates: TransferResult[] = [];
  const busesWithFrom = buses.filter((b) => b.stopIds.includes(fromId));
  const busesWithTo = buses.filter((b) => b.stopIds.includes(toId));

  for (const a of busesWithFrom) {
    for (const b of busesWithTo) {
      if (a.id === b.id) continue; // direct already covers this
      const setB = new Set(b.stopIds);
      for (const c of a.stopIds) {
        if (c === fromId || c === toId) continue;
        if (!setB.has(c)) continue;
        const fi = a.stopIds.indexOf(fromId);
        const ciA = a.stopIds.indexOf(c);
        const ciB = b.stopIds.indexOf(c);
        const ti = b.stopIds.indexOf(toId);
        const legALen = Math.abs(ciA - fi);
        const legBLen = Math.abs(ti - ciB);
        const totalStops = legALen + legBLen;

        const loA = Math.min(fi, ciA);
        const hiA = Math.max(fi, ciA);
        const firstIds =
          fi <= ciA
            ? a.stopIds.slice(loA, hiA + 1)
            : a.stopIds.slice(loA, hiA + 1).reverse();
        const loB = Math.min(ciB, ti);
        const hiB = Math.max(ciB, ti);
        const secondIds =
          ciB <= ti
            ? b.stopIds.slice(loB, hiB + 1)
            : b.stopIds.slice(loB, hiB + 1).reverse();

        candidates.push({
          kind: "transfer",
          firstBus: a,
          secondBus: b,
          from: getStop(fromId)!,
          interchange: getStop(c)!,
          to: getStop(toId)!,
          firstLeg: firstIds
            .map((id) => getStop(id))
            .filter((s): s is Stop => Boolean(s)),
          secondLeg: secondIds
            .map((id) => getStop(id))
            .filter((s): s is Stop => Boolean(s)),
          totalStops,
        });
      }
    }
  }

  // Dedupe by (firstBus, secondBus, interchange) keeping shortest, then rank.
  const best = new Map<string, TransferResult>();
  for (const c of candidates) {
    const key = `${c.firstBus.id}|${c.secondBus.id}|${c.interchange.id}`;
    const prev = best.get(key);
    if (!prev || c.totalStops < prev.totalStops) best.set(key, c);
  }
  return [...best.values()]
    .sort((x, y) => x.totalStops - y.totalStops || x.firstLeg.length - y.firstLeg.length)
    .slice(0, limit);
}
