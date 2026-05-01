#!/usr/bin/env node
/**
 * Prerender step.
 *
 * For each route in src/seo/routes.ts:
 *   1. Spin up a static HTTP server over dist/
 *   2. Use Puppeteer to navigate to the route, wait for hydration to settle
 *   3. Snapshot the rendered HTML (body + head) and write back to disk as
 *      dist/<route>/index.html — so crawlers and social previewers see the
 *      fully styled page without needing to execute JS.
 *
 * Runs before scripts/postbuild.mjs, which normalises meta and JSON-LD on
 * top of the prerendered HTML.
 */
import { promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

async function loadRoutes() {
  const src = await fs.readFile(path.join(ROOT, "src/seo/routes.ts"), "utf8");
  const routesMatch = src.match(/export const ROUTES: RouteSEO\[\] = (\[[\s\S]*?\n\]);/);
  if (!routesMatch) throw new Error("Could not find ROUTES in routes.ts");
  return eval("(" + routesMatch[1] + ")");
}

async function serveDist() {
  // Snapshot the freshly built index.html shell once. Every route is served
  // this same in-memory copy — never read from disk — so writing the
  // prerendered homepage back to dist/index.html doesn't leak its schemas
  // into the next routes' DOM.
  const shell = await fs.readFile(path.join(DIST, "index.html"));

  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        const ext = path.extname(urlPath).toLowerCase();

        // SPA convention: any path without an extension is a route — always
        // serve the empty shell so the React app boots clean and the
        // client-side router takes over. Paths with extensions resolve to
        // the actual built asset on disk.
        if (!ext) {
          res.writeHead(200, { "Content-Type": MIME[".html"] });
          res.end(shell);
          return;
        }

        const data = await fs.readFile(path.join(DIST, urlPath));
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(data);
      } catch (err) {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function renderRoute(browser, baseUrl, route) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const url = baseUrl + (route.path === "/" ? "/" : route.path);
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

  // Wait for #root to be populated (hydration) and a real heading to appear,
  // so we capture the styled DOM rather than the empty shell.
  await page.waitForFunction(
    () => {
      const root = document.getElementById("root");
      if (!root || !root.firstElementChild) return false;
      return !!document.querySelector("h1");
    },
    { timeout: 30000 }
  );

  // Pre-empt anything still scheduled by the parallax / IntersectionObserver
  // hooks: scroll back to top so any "scrolled-state" tweaks don't end up in
  // the captured HTML.
  await page.evaluate(() => window.scrollTo(0, 0));

  const html = await page.content();
  await page.close();
  return html;
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

async function main() {
  const ROUTES = await loadRoutes();
  const { server, port } = await serveDist();
  const baseUrl = `http://127.0.0.1:${port}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    for (const route of ROUTES) {
      // Prerender every route — even noindex ones. noindex stops a page
      // from appearing in search; it doesn't mean we shouldn't serve a
      // fast pre-rendered HTML to actual visitors (e.g. people redirected
      // here from an old domain).
      const html = await renderRoute(browser, baseUrl, route);
      await writeRouteHtml(route, html);
      console.log(`✓ prerendered ${route.path.padEnd(30)} (${(html.length / 1024).toFixed(1)} kB)`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});
