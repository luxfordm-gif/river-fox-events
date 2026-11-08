// Link / navigation / redirect / canonical / sitemap audit of the built site.
// Run after `npm run build`:  npm run check:links
// Also checks heading structure: one h1 per page, no skipped heading levels.
// Exits with an error if anything is broken (Matt, 2026-11-08).
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = process.argv[2] || join(process.cwd(), "dist");
const SITE = "https://riverfoxevents.co.uk";
const problems = [];
const warn = [];
const P = (m) => problems.push(m);

// --- pages
const pages = new Map(); // "/path/" -> { html, ids:Set }
const walk = (dir) => {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (n === "index.html") {
      const rel = "/" + p.slice(DIST.length + 1).replace(/index\.html$/, "");
      const html = readFileSync(p, "utf8");
      const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
      pages.set(rel, { html, ids });
    }
  }
};
walk(DIST);

const fileExists = (path) => existsSync(join(DIST, decodeURIComponent(path)));
const stripDomain = (u) => (u.startsWith(SITE) ? u.slice(SITE.length) || "/" : u);

// resolve an internal URL -> { page, anchor, ok, note }
const resolve = (raw, base = "/") => {
  let u = stripDomain(raw);
  if (!/^[/#]/.test(u)) u = new URL(u, SITE + base).pathname; // relative link
  const [pathq, anchor] = u.split("#");
  const path = pathq.split("?")[0] || null;
  if (path === null) return { kind: "anchor-only", anchor };
  if (pages.has(path)) return { kind: "page", path, anchor };
  if (!path.endsWith("/") && pages.has(path + "/")) return { kind: "noslash", path, anchor };
  if (fileExists(path)) return { kind: "file", path };
  return { kind: "missing", path, anchor };
};

// --- links on pages
const inbound = new Map([...pages.keys()].map((k) => [k, new Set()]));
const external = new Set();
for (const [pg, { html, ids }] of pages) {
  const hrefs = [...html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  for (const h of hrefs) {
    if (!h || /^(tel:|mailto:|sms:|javascript:)/.test(h)) {
      if (!h) P(`${pg}: empty href`);
      continue;
    }
    if (/^https?:\/\//.test(h) && !h.startsWith(SITE)) { external.add(h); continue; }
    if (/^https?:\/\/(www\.)?riverfoxevents/.test(h) && !h.startsWith(SITE)) P(`${pg}: link to non-canonical host ${h}`);
    const r = resolve(h, pg);
    if (r.kind === "anchor-only") {
      if (r.anchor && !ids.has(r.anchor)) P(`${pg}: in-page link #${r.anchor} has no matching section`);
      continue;
    }
    if (r.kind === "missing") P(`${pg}: BROKEN link ${h}`);
    if (r.kind === "noslash") P(`${pg}: link without trailing slash ${h}`);
    if (r.kind === "page" || r.kind === "noslash") {
      const target = r.kind === "page" ? r.path : r.path + "/";
      if (target !== pg) inbound.get(target).add(pg);
      if (r.anchor && !pages.get(target).ids.has(r.anchor)) P(`${pg}: link ${h} jumps to #${r.anchor}, which isn't on ${target}`);
    }
  }
  // canonical + og:url
  const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const og = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] || "";
  pages.get(pg).noindex = /noindex/.test(robots);
  pages.get(pg).canon = canon;
  // Hidden (noindex) pages like the brand book may skip the canonical tag.
  if (!canon) { if (!pages.get(pg).noindex) P(`${pg}: no canonical tag`); }
  else if (canon !== SITE + pg) P(`${pg}: canonical is ${canon} (expected ${SITE + pg})`);
  if (og && og !== canon) P(`${pg}: og:url ${og} differs from canonical`);
  // JSON-LD internal URLs
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    for (const u of m[1].matchAll(/"(https:\/\/riverfoxevents\.co\.uk[^"]*)"/g)) {
      const r = resolve(u[1]);
      if (r.kind === "missing") P(`${pg}: JSON-LD points at missing URL ${u[1]}`);
      if (r.kind === "noslash") P(`${pg}: JSON-LD URL without trailing slash ${u[1]}`);
    }
  }
}

// --- redirects
const rules = readFileSync(join(DIST, "_redirects"), "utf8").split("\n")
  .map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
  .map((l) => { const [from, to, status] = l.split(/\s+/); return { from, to, status }; });
const fromPaths = new Set(rules.filter((r) => r.from.startsWith("/")).map((r) => r.from));
for (const r of rules) {
  if (r.from === "/*") continue;
  const to = stripDomain(r.to);
  if (/^https?:/.test(to)) { P(`redirect ${r.from} goes off-site to ${r.to}`); continue; }
  const res = resolve(to);
  if (res.kind === "missing") P(`redirect ${r.from} -> ${r.to}: target page doesn't exist`);
  if (res.kind === "noslash") P(`redirect ${r.from} -> ${r.to}: target lacks trailing slash (extra hop)`);
  if (res.kind === "page" && res.anchor && !pages.get(res.path).ids.has(res.anchor)) P(`redirect ${r.from} -> ${r.to}: #${res.anchor} not on page`);
  if (fromPaths.has(to.split("#")[0].replace(/\/$/, ""))) P(`redirect chain: ${r.from} -> ${r.to} is itself redirected`);
  if (r.from.startsWith("/") && !r.from.includes("*") && pages.has(r.from.endsWith("/") ? r.from : r.from + "/"))
    P(`redirect ${r.from} would shadow a real page`);
  if (!/^30[12]!?$/.test(r.status)) P(`redirect ${r.from}: unexpected status ${r.status}`);
}
const fallback = rules.find((r) => r.from === "/*");

// --- sitemap
const sm = readFileSync(join(DIST, "sitemap.xml"), "utf8");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const l of locs) {
  const r = resolve(l);
  if (r.kind !== "page") P(`sitemap: ${l} is ${r.kind}`);
  else if (pages.get(r.path).noindex) P(`sitemap: ${l} is marked noindex`);
  else if (pages.get(r.path).canon !== l) P(`sitemap: ${l} canonical is ${pages.get(r.path).canon}`);
}
for (const [pg, v] of pages) if (!v.noindex && !locs.includes(SITE + pg)) warn.push(`indexable page not in sitemap: ${pg}`);
for (const [pg, v] of pages) if (v.noindex && locs.includes(SITE + pg)) P(`noindex page in sitemap: ${pg}`);
const robotsTxt = readFileSync(join(DIST, "robots.txt"), "utf8");

// --- 404 page
if (!fallback || fallback.to !== "/404.html" || fallback.status !== "404") P(`catch-all rule should be "/* /404.html 404", found ${fallback ? `${fallback.from} ${fallback.to} ${fallback.status}` : "none"}`);
if (rules[rules.length - 1]?.from !== "/*") P("the /* catch-all must be the last redirect rule");
if (!fileExists("/404.html")) P("dist/404.html is missing");
else if (!/<meta name="robots" content="[^"]*noindex/.test(readFileSync(join(DIST, "404.html"), "utf8"))) P("404.html is not marked noindex");

// --- heading structure: one h1 per page, no skipped levels (h2 -> h4)
for (const [pg, { html, noindex }] of pages) {
  if (/brand-book/.test(pg)) continue;
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "");
  const levels = [...body.matchAll(/<h([1-6])\b/g)].map((m) => +m[1]);
  const h1 = levels.filter((l) => l === 1).length;
  if (h1 !== 1 && !noindex) P(`${pg}: ${h1} h1 headings (expected exactly 1)`);
  let prev = 0;
  for (const l of levels) { if (prev && l > prev + 1) { P(`${pg}: heading skips h${prev} -> h${l}`); break; } prev = l; }
}

// --- pages Google can only find through the sitemap
for (const [pg, v] of pages) if (!v.noindex && inbound.get(pg).size === 0) P(`no other page links to ${pg}`);

// --- report
console.log(`Pages: ${pages.size}   Redirect rules: ${rules.length}   Sitemap URLs: ${locs.length}   External links: ${external.size}`);
console.log(`Fallback rule: ${fallback ? `${fallback.from} ${fallback.to} ${fallback.status}` : "none"}   404.html: ${fileExists("/404.html")}`);
console.log(`noindex pages: ${[...pages].filter(([, v]) => v.noindex).map(([k]) => k).join(", ") || "none"}`);
console.log(`robots.txt sitemap line: ${/Sitemap:\s*(\S+)/.exec(robotsTxt)?.[1]}`);
const uniq = [...new Set(problems)];
console.log(`\nPROBLEMS (${uniq.length}):`); uniq.forEach((p) => console.log("  - " + p));
console.log(`\nNOTES (${warn.length}):`); warn.forEach((p) => console.log("  - " + p));
console.log("\nInbound internal links (number of other pages linking in):");
[...inbound].sort((a, b) => b[1].size - a[1].size).forEach(([k, v]) => console.log(`  ${String(v.size).padStart(3)}  ${k}`));
console.log("\nExternal link hosts:"); console.log("  " + [...new Set([...external].map((u) => new URL(u).host))].join(", "));

process.exitCode = uniq.length ? 1 : 0;
