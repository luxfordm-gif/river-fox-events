#!/usr/bin/env node
/**
 * Post-build SEO step.
 *
 * For each route in src/seo/routes.ts:
 *   1. Copy dist/index.html → dist/<route>/index.html
 *   2. Inject the route's <title>, description, OG/Twitter tags and JSON-LD
 *      into the <head> so crawlers and social previewers see the right
 *      metadata before any JS runs.
 *
 * Also writes:
 *   - dist/sitemap.xml
 *   - dist/robots.txt
 *
 * The React app continues to refresh head tags on the client after hydration,
 * so navigation (e.g. via React Router) still updates the head correctly.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

// Tiny ts-to-js loader: read routes.ts as text and pull config out via regex.
// Keeps this script dependency-free (no ts-node, no esbuild).
async function loadRoutes() {
  const src = await fs.readFile(path.join(ROOT, "src/seo/routes.ts"), "utf8");

  const siteMatch = src.match(/export const SITE = (\{[\s\S]*?\});/);
  if (!siteMatch) throw new Error("Could not find SITE in routes.ts");
  const SITE = eval("(" + siteMatch[1] + ")");

  const routesMatch = src.match(/export const ROUTES: RouteSEO\[\] = (\[[\s\S]*?\n\]);/);
  if (!routesMatch) throw new Error("Could not find ROUTES in routes.ts");
  const ROUTES = eval("(" + routesMatch[1] + ")");

  return { SITE, ROUTES };
}

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function buildHeadTags({ SITE, route, absUrl, ogImageAbs }) {
  const title = escapeHtml(route.title);
  const desc = escapeHtml(route.description);
  const url = escapeHtml(absUrl);
  const img = escapeHtml(ogImageAbs);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    route.noindex ? `<meta name="robots" content="noindex, follow" />` : `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ].join("\n    ");
}

function injectIntoHead(html, headFragment) {
  // Strip the existing default <title>, <meta name="description">, robots,
  // canonical, og:*, twitter:* tags so the route-specific ones don't clash.
  const stripPatterns = [
    /<title>[\s\S]*?<\/title>\s*/i,
    /<meta\s+name=["']description["'][^>]*>\s*/gi,
    /<meta\s+name=["']robots["'][^>]*>\s*/gi,
    /<link\s+rel=["']canonical["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:[^"']+["'][^>]*>\s*/gi,
  ];
  let out = html;
  for (const re of stripPatterns) out = out.replace(re, "");
  // Insert just before </head>.
  return out.replace(/<\/head>/i, `    ${headFragment}\n  </head>`);
}

async function writeRouteHtml(route, html) {
  if (route.path === "/") {
    await fs.writeFile(path.join(DIST, "index.html"), html, "utf8");
    return;
  }
  const dir = path.join(DIST, route.path.replace(/^\//, ""));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), html, "utf8");
}

async function writeSitemap(SITE, ROUTES) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = ROUTES.filter((r) => !r.noindex)
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE.url}${r.path === "/" ? "/" : r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq || "monthly"}</changefreq>\n    <priority>${r.priority ?? 0.7}</priority>\n  </url>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  await fs.writeFile(path.join(DIST, "sitemap.xml"), xml, "utf8");
}

async function writeRobots(SITE) {
  const txt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
  await fs.writeFile(path.join(DIST, "robots.txt"), txt, "utf8");
}

async function main() {
  const { SITE, ROUTES } = await loadRoutes();
  const baseHtml = await fs.readFile(path.join(DIST, "index.html"), "utf8");

  for (const route of ROUTES) {
    const absUrl = SITE.url + (route.path === "/" ? "/" : route.path);
    const ogImageAbs = SITE.url + (route.ogImage || SITE.defaultOgImage);
    const headFragment = buildHeadTags({ SITE, route, absUrl, ogImageAbs });
    const routeHtml = injectIntoHead(baseHtml, headFragment);
    await writeRouteHtml(route, routeHtml);
    console.log(`✓ ${route.path.padEnd(30)} → ${route.path === "/" ? "dist/index.html" : `dist${route.path}/index.html`}`);
  }

  await writeSitemap(SITE, ROUTES);
  console.log(`✓ sitemap.xml`);
  await writeRobots(SITE);
  console.log(`✓ robots.txt`);
}

main().catch((err) => {
  console.error("postbuild failed:", err);
  process.exit(1);
});
