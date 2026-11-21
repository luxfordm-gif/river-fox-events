// Saves each storyboard screen as a picture in out/storyboard, plus one sheet of them all.
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
const { chromium } = createRequire(import.meta.url)("playwright");
mkdirSync("out/storyboard", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL("storyboard.html").href);
await page.waitForFunction("window.READY");
const count = await page.evaluate("window.COUNT");
for (let i = 0; i < count; i++) {
  await page.evaluate((n) => window.show(n), i);
  await page.screenshot({ path: `out/storyboard/screen-${i + 1}.png` });
}
await browser.close();
execFileSync("ffmpeg", ["-y", "-v", "error", "-i", "out/storyboard/screen-%d.png", "-vf", `scale=1280:-1,tile=2x${Math.ceil(count / 2)}:padding=24:margin=24:color=white`, "-frames:v", "1", "out/storyboard/storyboard-sheet.png"]);
console.log(count, "screens");
