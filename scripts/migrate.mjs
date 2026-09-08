import fs from "fs";

// ── 1. Load source files ──────────────────────────────────────────────
const existing = JSON.parse(fs.readFileSync("data/buses.json", "utf8"));
const source = JSON.parse(fs.readFileSync("data/bus-routes.json", "utf8")).data;

// ── 2. Load Bangla mapping ────────────────────────────────────────────
const BANGLA = JSON.parse(fs.readFileSync("scripts/bangla-stops.json", "utf8"));

// ── 3. Stop normalization rules ───────────────────────────────────────
// Exact string replacements (order matters for compound names)
const COMPOUND = [
  ["Nobinagar Baipayl", ["Nobinagar", "Baipayl"]],
  ["Nobinagar Chandra", ["Nobinagar", "Chandra"]],
  ["Kazipara Shewrapara", ["Kazipara", "Shewrapara"]],
  ["Rajlakshmi House Building", ["Rajlakshmi", "House Building"]],
  ["New Market Nilkhet", ["New Market", "Nilkhet"]],
  ["Airport Jashimuddin (Uttara)", ["Airport", "Jashimuddin (Uttara)"]],
  ["Adabor Shyamoli", ["Adabor", "Shyamoli"]],
  ["Farmgate Bijoy Sarani", ["Farmgate", "Bijoy Sarani"]],
  ["Khamar Bari Farmgate", ["Khamar Bari", "Farmgate"]],
  ["Press Club  Paltan", ["Press Club", "Paltan"]],
  ["Ittefaq Moor Sayedabad", ["Ittefaq Moor", "Sayedabad"]],
  ["Purobi Pallabi", ["Purobi", "Pallabi"]],
  ["Beribadh Tin Rastar Moor", ["Beribadh", "Tin Rastar Moor"]],
  ["Mogbazar Mohakhali", ["Mogbazar", "Mohakhali"]],
  ["Kalshi Pallabi", ["Kalshi", "Pallabi"]],
  ["Kalabagan City College", ["Kalabagan", "City College"]],
  ["Dhanmondi 32 Kalabagan", ["Dhanmondi 32", "Kalabagan"]],
  ["Bangla Motor Shahbag", ["Bangla Motor", "Shahbag"]],
  ["Garrison (Cantonment)", ["Cantonment"]],
  ["Bashundhara (300 Feet Gate)", ["Bashundhara"]],
  ["Mirpur Sony Cinema Hall", ["Mirpur 1", "Sony Cinema Hall"]],
  ["Sony Cinema Hall Mirpur 1", ["Sony Cinema Hall", "Mirpur 1"]],
  ["Mirpur 2 Mirpur 10", ["Mirpur 2", "Mirpur 10"]],
  ["Kuril  Bishwa Road", ["Kuril Bishwa Road"]],
  ["Kuril Bissho Road", ["Kuril Bishwa Road"]],
  ["Kuril Flyover", ["Kuril Bishwa Road"]],
];

// Simple renames (canonical → aliases)
const RENAMES = {
  "Bashtola": ["Bashtola -", "Bot tola"],
  "Technical": ["Technical -"],
  "Khamar Bari": ["Khamar Bari -", "Khamarbari"],
  "Jatrabari": ["Jatrabari -"],
  "Kamalapur": ["Kamlapur"],
  "Abdullahpur": ["Abdulla"],
  "Shonir Akhra": ["Shanir Akhra"],
  "Sony Cinema Hall": ["Sony CInema Hall", "Sony Cenema Hall"],
  "Kakali": ["kakali"],
  "Ring Road": ["Ring road"],
  "Ray Saheb Bazar": ["Ray Shaheb Bazar", "- Ray Saheb Bazar"],
  "Diabari": ["Dia Bari"],
  "Arambagh": ["Arambagh Kingdom"],
  "Shewrapara": ["Kazipara Shewrapara"],
};

// Build reverse lookup: alias → canonical
const aliasMap = {};
for (const [canon, aliases] of Object.entries(RENAMES)) {
  for (const alias of aliases) aliasMap[alias] = canon;
}
for (const [compound, expanded] of COMPOUND) {
  aliasMap[compound] = expanded; // special: array = split
}

// ── 4. Normalize a stop name → [canonical names] ──────────────────────
function normalizeStop(raw) {
  const s = raw.trim();
  // compound split (→ array)
  if (aliasMap[s] && Array.isArray(aliasMap[s])) return aliasMap[s];
  // simple rename
  if (aliasMap[s]) return [aliasMap[s]];
  return [s];
}

// ── 5. Slugify ────────────────────────────────────────────────────────
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── 6. Get Bangla name for a stop ─────────────────────────────────────
function getBangla(en) {
  if (BANGLA[en]) return BANGLA[en];
  // Try case-insensitive
  const lower = en.toLowerCase();
  for (const [k, v] of Object.entries(BANGLA)) {
    if (k.toLowerCase() === lower) return v;
  }
  return en; // fallback to English
}

// ── 7. Build stop catalog from existing data ──────────────────────────
const stopCatalog = new Map(); // slug → { id, nameEn, nameBn }
for (const s of existing.stops) {
  // Prefer mapping file's Bangla when available (fixes stale English fallback)
  const mappedBn = getBangla(s.nameEn);
  stopCatalog.set(s.id, {
    id: s.id,
    nameEn: s.nameEn,
    nameBn: mappedBn === s.nameEn ? s.nameBn : mappedBn,
  });
}

// ── 8. Process source buses ───────────────────────────────────────────
const buses = [];
const newStopsFound = [];

// Track duplicate names for disambiguation
const nameCount = {};

for (const entry of source) {
  const nameEn = entry.english.trim();
  nameCount[nameEn] = (nameCount[nameEn] || 0) + 1;
  const idx = nameCount[nameEn];

  // Build slug with disambiguation
  let busSlug = slugify(nameEn);
  if (idx > 1) busSlug += `-${idx}`;

  // Normalize route stops
  const normalizedStops = [];
  for (const raw of entry.routes) {
    const canonNames = normalizeStop(raw);
    for (const cn of canonNames) {
      const trimmed = cn.trim();
      if (!trimmed) continue;
      const slug = slugify(trimmed);
      if (!slug) continue;

      // Register in catalog
      if (!stopCatalog.has(slug)) {
        const bn = getBangla(trimmed);
        stopCatalog.set(slug, { id: slug, nameEn: trimmed, nameBn: bn });
        newStopsFound.push({ en: trimmed, bn, slug });
      }
      // Deduplicate stops (a bus doesn't pass the same stop twice in one
      // direction; keep first occurrence to preserve the general path)
      if (!normalizedStops.includes(slug)) {
        normalizedStops.push(slug);
      }
    }
  }

  if (normalizedStops.length === 0) {
    console.warn(`SKIP (no valid stops): ${nameEn}`);
    continue;
  }

  // Preserve original Bangla name if this bus already existed in our data
  const existingBus = existing.buses.find(
    (b) => b.nameEn === nameEn || b.nameEn === entry.bangle
  );
  const nameBn = existingBus ? existingBus.nameBn : entry.bangle || getBangla(nameEn);

  buses.push({
    id: busSlug,
    nameEn,
    nameBn,
    area: "Dhaka",
    stopIds: normalizedStops,
  });
}

// ── 9. Output ─────────────────────────────────────────────────────────
const stops = [...stopCatalog.values()].sort((a, b) => a.nameEn.localeCompare(b.nameEn));

const output = { stops, buses };
fs.writeFileSync("data/buses.json", JSON.stringify(output, null, 2) + "\n", "utf8");

console.log(`\n=== Migration complete ===`);
console.log(`Buses: ${buses.length}`);
console.log(`Stops: ${stops.length}`);
console.log(`New stops added: ${newStopsFound.length}`);

// Warn about stops with no Bangla mapping
const missing = newStopsFound.filter((s) => s.bn === s.en);
if (missing.length > 0) {
  console.log(`\n⚠ ${missing.length} stops missing Bangla names (showing first 20):`);
  for (const s of missing.slice(0, 20)) {
    console.log(`  ${s.en} (${s.slug})`);
  }
}
