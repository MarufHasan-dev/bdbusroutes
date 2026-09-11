# BD Bus Routes — ঢাকা বাস রুট

Mobile-first Dhaka city bus route search. Enter **From** + **To**, press **Enter** — see every bus that serves your route. Fully bilingual EN + বাংলা.

Live: https://bdbusroutes.vercel.app

## Features

- **Route search** — autocomplete From/To fields (English or বাংলা, with match highlighting), swap button, Enter-to-search, shareable URLs (`/?from=shahbag&to=gabtoli`).
- **Smart results** — bidirectional direct matches first (shortest ride first, travel segment highlighted with "Toward" terminus); best **1-change options** via a shared interchange when no direct bus exists; helpful empty states.
- **172 buses · 273 stops** — every bus has a statically generated detail page with its full stop timeline (`/buses/[id]`).
- **All-buses browser** (`/buses`) — live search across EN + BN names, sort by name / most stops / fewest stops, result counts, empty state.
- **Report errors** (`/report`) — users can flag wrong stops, missing buses, or bad routes (bus pre-selected from detail pages). Delivered by email over SMTP when configured, logged server-side until then.
- **Bilingual everywhere** — EN/বাং toggle in the header (persisted), including How-it-works, FAQ, forms, and all empty states.
- **SEO** — sitemap (all routes), robots, Open Graph image, `WebSite`/`BusTrip`/`FAQPage` JSON-LD, canonical URLs, per-bus metadata.
- **Fast** — static bus pages, code-split results UI, no prefetch storms, loading skeletons, PWA manifest + icons.

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production check (also runs here before every deploy)
npm run start
npm run lint
```

## Environment

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://bdbusroutes.vercel.app  # canonical URL for SEO tags
SMTP_HOST / SMTP_PORT / SMTP_SECURE / SMTP_USER / SMTP_PASS  # report emails
REPORT_TO              # inbox for route-error reports
REPORT_FROM            # optional sender identity
```

Without SMTP configured, reports are logged server-side and the form still confirms receipt.

## How search works

- **Autocomplete** both fields (English or বাংলা), then Enter or Find buses.
- **Bidirectional:** a bus matches regardless of stop order, with the travel segment highlighted and the "Toward" terminus shown.
- **Direct first:** buses containing both stops, shortest ride first.
- **1-change fallback:** up to 5 best options via a shared interchange (`Bus A → change at C → Bus B`), ranked by fewest total stops.

## Data (JSON now, Postgres later)

- `data/buses.json` is the source of truth — normalized: unique `stops[]` (stable slug IDs, EN + BN names) + `buses[]` with ordered `stopIds`.
- Stop IDs are URL-stable (`?from=shahbag&to=gabtoli`, `/buses/savar-paribahan`) — never rename an existing ID; only append.
- In-route stop order is stored once and treated as bidirectional; a stop must appear only once per route.
- All data access goes through `lib/buses.ts` (`getBuses`, `getStops`, `resolveStop`) and search through `lib/search.ts` (`findDirect`, `findTransfers`) — migrating to PostgreSQL/Neon later means swapping that layer to `stops / buses / bus_stops` tables only.

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind v4 + nodemailer + @vercel/analytics. Fonts: Inter + Hind Siliguri. No DB yet.
