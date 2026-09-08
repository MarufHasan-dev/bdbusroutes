# BD Bus Routes — ঢাকা বাস রুট

Mobile-first Dhaka city bus route search. Enter **From** + **To**, press **Enter** — see every bus that serves your route. Bilingual EN + বাংলা.

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production check
npm run start
```

## How search works

- **Autocomplete** both fields (English or বাংলা), then Enter or Find buses.
- **Bidirectional:** a bus matches regardless of stop order (e.g. Gabtoli → Shahbag matches the same bus as Shahbag → Gabtoli), with the travel segment highlighted and the "Toward" terminus shown.
- **Direct first:** buses containing both stops, shortest ride first.
- **1-change fallback:** if no direct bus, up to 5 best options via a shared interchange (`Bus A → change at C → Bus B`), ranked by fewest total stops.
- **Shareable URLs:** `/?from=shahbag&to=gabtoli` — back button and sharing work.

## Data (JSON now, Postgres later)

- `data/buses.json` — normalized: unique `stops[]` (stable slug IDs) + `buses[]` with ordered `stopIds`.
- v1: 2 buses, 55 unique stops (Savar Paribahan 26, Azmeri Glory 33, 4 shared).
- All data access goes through `lib/buses.ts` (`getBuses`, `getStops`) and search through `lib/search.ts` (`findDirect`, `findTransfers`) — migrating to PostgreSQL/Neon later means swapping that layer to `stops / buses / bus_stops` tables only.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind v4. No DB in v1. Fonts: Inter + Hind Siliguri.
