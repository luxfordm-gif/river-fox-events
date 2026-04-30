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
// Keeps this script dependency-free (no ts-node, no esbuild). The shapes we
// extract (SITE / BUSINESS / ROUTES) are plain object/array literals that
// happen to also be valid JS expressions once `as const` is stripped.
async function loadRoutes() {
  const src = await fs.readFile(path.join(ROOT, "src/seo/routes.ts"), "utf8");

  const siteMatch = src.match(/export const SITE = (\{[\s\S]*?\});/);
  if (!siteMatch) throw new Error("Could not find SITE in routes.ts");
  const SITE = eval("(" + siteMatch[1] + ")");

  const businessMatch = src.match(/^export const BUSINESS = (\{[\s\S]*?^\});$/m);
  if (!businessMatch) throw new Error("Could not find BUSINESS in routes.ts");
  const businessSrc = businessMatch[1]
    .replace(/ as const/g, "")
    .replace(/SITE\.url/g, JSON.stringify(SITE.url))
    .replace(/SITE\.defaultOgImage/g, JSON.stringify(SITE.defaultOgImage));
  const BUSINESS = eval("(" + businessSrc + ")");

  const routesMatch = src.match(/export const ROUTES: RouteSEO\[\] = (\[[\s\S]*?\n\]);/);
  if (!routesMatch) throw new Error("Could not find ROUTES in routes.ts");
  const ROUTES = eval("(" + routesMatch[1] + ")");

  return { SITE, BUSINESS, ROUTES };
}

const escapeHtml = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const canonicalPath = (p) => (p === "/" ? "/" : p.endsWith("/") ? p : p + "/");

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

/**
 * Build the JSON-LD <script> blocks for a given route.
 *
 * Homepage:        LocalBusiness
 * Sub-pages:       BreadcrumbList (always when breadcrumbName is set)
 *                  Service        (when route.service is set), with the
 *                                 shared BUSINESS embedded as `provider`.
 *
 * The same shapes are also emitted client-side via React useEffect (with
 * matching DOM ids), so SPA navigation stays consistent. Crawlers that
 * don't run JS see the schemas straight from the static HTML.
 */
function buildJsonLdBlocks({ SITE, BUSINESS, route, absUrl }) {
  const blocks = [];

  if (route.path === "/") {
    blocks.push({
      id: "rfx-jsonld",
      data: {
        "@context": "https://schema.org",
        ...BUSINESS,
        description: route.description,
        areaServed: [
          "Surrey",
          "London",
          "Cobham",
          "Weybridge",
          "Esher",
          "Oxshott",
          "Reigate",
          "Horley",
        ],
      },
    });
    return blocks;
  }

  if (route.breadcrumbName) {
    blocks.push({
      id: `rfx-jsonld-bc-${route.path.replace(/^\//, "").replace(/\//g, "-")}`,
      data: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE.url + "/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: route.breadcrumbName,
            item: absUrl,
          },
        ],
      },
    });
  }

  if (route.service) {
    blocks.push({
      id: `rfx-jsonld-svc-${route.path.replace(/^\//, "").replace(/\//g, "-")}`,
      data: {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: route.service.serviceType,
        description: route.description,
        areaServed: route.service.areaServed,
        provider: BUSINESS,
        ...(route.service.lowPrice
          ? {
              offers: {
                "@type": "AggregateOffer",
                lowPrice: route.service.lowPrice,
                priceCurrency: "GBP",
              },
            }
          : {}),
      },
    });
  }

  return blocks;
}

const renderJsonLd = (blocks) =>
  blocks
    .map(
      (b) =>
        `<script type="application/ld+json" id="${b.id}">${JSON.stringify(
          b.data
        )}</script>`
    )
    .join("\n    ");

function injectIntoHead(html, headFragment, jsonLdFragment) {
  // Strip the existing default <title>, <meta name="description">, robots,
  // canonical, og:*, twitter:* tags so the route-specific ones don't clash.
  // JSON-LD scripts are deliberately left alone — React useEffects emit them
  // during prerender, so the captured DOM already has the right schemas
  // (LocalBusiness/Service/BreadcrumbList/FAQPage). Postbuild only adds
  // schemas if the prerendered HTML is missing them (matched by id).
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

  // Only emit JSON-LD blocks the prerendered HTML doesn't already have.
  const missingJsonLd = jsonLdFragment
    .split("\n")
    .filter((line) => {
      const idMatch = line.match(/id="([^"]+)"/);
      if (!idMatch) return false;
      const idTag = `id="${idMatch[1]}"`;
      return !out.includes(idTag);
    })
    .join("\n    ");

  const fragment = missingJsonLd
    ? `${headFragment}\n    ${missingJsonLd}`
    : headFragment;
  return out.replace(/<\/head>/i, `    ${fragment}\n  </head>`);
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
        `  <url>\n    <loc>${SITE.url}${canonicalPath(r.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq || "monthly"}</changefreq>\n    <priority>${r.priority ?? 0.7}</priority>\n  </url>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
  await fs.writeFile(path.join(DIST, "sitemap.xml"), xml, "utf8");
}

async function writeRobots(SITE) {
  const txt = `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
  await fs.writeFile(path.join(DIST, "robots.txt"), txt, "utf8");
}

async function readRouteHtml(route) {
  // Prefer a prerendered file at the route's path (written by prerender.mjs).
  // Fall back to the shell at dist/index.html when no prerendered output
  // exists (e.g. a development build that skipped the prerender step).
  const candidate =
    route.path === "/"
      ? path.join(DIST, "index.html")
      : path.join(DIST, route.path.replace(/^\//, ""), "index.html");
  try {
    return await fs.readFile(candidate, "utf8");
  } catch {
    return await fs.readFile(path.join(DIST, "index.html"), "utf8");
  }
}

async function main() {
  const { SITE, BUSINESS, ROUTES } = await loadRoutes();

  // Netlify serves /<route>/ (with trailing slash) for prerendered routes,
  // and 301-redirects /<route> → /<route>/. Keep canonicals + sitemap in sync
  // with the actual served URL by always appending the trailing slash.

  for (const route of ROUTES) {
    const absUrl = SITE.url + canonicalPath(route.path);
    const ogImageAbs = SITE.url + (route.ogImage || SITE.defaultOgImage);
    const headFragment = buildHeadTags({ SITE, route, absUrl, ogImageAbs });
    const jsonLdBlocks = buildJsonLdBlocks({ SITE, BUSINESS, route, absUrl });
    const jsonLdFragment = renderJsonLd(jsonLdBlocks);
    const baseHtml = await readRouteHtml(route);
    const routeHtml = injectIntoHead(baseHtml, headFragment, jsonLdFragment);
    await writeRouteHtml(route, routeHtml);
    const ldNote = jsonLdBlocks.length ? ` (+${jsonLdBlocks.length} JSON-LD)` : "";
    console.log(`✓ ${route.path.padEnd(30)} → ${route.path === "/" ? "dist/index.html" : `dist${route.path}/index.html`}${ldNote}`);
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
