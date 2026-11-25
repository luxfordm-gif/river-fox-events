#!/usr/bin/env node
// Copies Laura's latest Instagram posts into build/ for the Instagram preview page.
//
// The preview page can't load images from Instagram's servers (artifact pages only show
// their own files), so this script downloads each post's picture, shrinks it, and writes
// build/feed.json. Then the page is republished with build/ as its files.
//
// Usage: node refresh.cjs <markifact-posts.json>
//   The JSON is the row list from Markifact's instagram_get_posts_performance with the
//   dimensions postId, publishedDate, mediaType, mediaProductType, thumbnailUrl, mediaUrl,
//   permalink, caption and the metrics likes, comments (include_stories: true).
//   See README.md for the exact call.
//
// Pictures already in build/feed/ are kept, so a refresh only downloads new posts.
// It also copies the profile picture and Highlight covers from Drive > Social > Instagram > Profile.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const HERE = __dirname;
const BUILD = path.join(HERE, "build");
const FEED = path.join(BUILD, "feed");
const HL = path.join(BUILD, "highlights");
const THUMBS = path.join(BUILD, "thumbs");
const DRIVE_PROFILE = path.join(
  process.env.HOME,
  "Library/CloudStorage/GoogleDrive-luxfordm@gmail.com/.shortcut-targets-by-id/15xXTgs2DbOgYjchcf10XYQBGHprCfmOs/River Fox Events/Social/Instagram/Profile"
);
const MAX_W = 810; // opened post: wide enough for a 390pt phone at 2x, small enough to load quickly
const THUMB_W = 360; // grid tile: a third of a phone at 3x

const src = process.argv[2];
if (!src) {
  console.error("Usage: node refresh.cjs <markifact-posts.json>");
  process.exit(1);
}
const rows = JSON.parse(fs.readFileSync(src, "utf8"));
if (!Array.isArray(rows)) {
  console.error("Expected a list of posts; got", typeof rows);
  process.exit(1);
}
for (const d of [BUILD, FEED, HL, THUMBS]) fs.mkdirSync(d, { recursive: true });

const clean = (v) => (v === "nan" || v === null || v === undefined ? "" : v);
const num = (v) => (typeof v === "number" && !Number.isNaN(v) ? Math.round(v) : null);

function sipsSize(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  const w = +out.match(/pixelWidth: (\d+)/)[1];
  const h = +out.match(/pixelHeight: (\d+)/)[1];
  return { w, h };
}

function toJpeg(input, output, maxW) {
  // sips re-encodes webp/png to jpeg and caps the width.
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "80", "--resampleWidth", String(maxW), input, "--out", output], { stdio: "ignore" });
  const { w } = sipsSize(output);
  if (w > maxW) execFileSync("sips", ["--resampleWidth", String(maxW), output], { stdio: "ignore" });
}

function kindOf(r) {
  if (r.mediaProductType === "STORY") return "story";
  if (r.mediaProductType === "REELS") return "reel";
  if (r.mediaType === "CAROUSEL_ALBUM") return "carousel";
  return "post";
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

(async () => {
  const posts = [];
  const report = [];
  for (const r of rows) {
    const id = String(r.postId);
    const kind = kindOf(r);
    // Videos have a still in thumbnailUrl; pictures and carousels in mediaUrl.
    const imgUrl = clean(r.mediaType === "VIDEO" ? r.thumbnailUrl : r.mediaUrl) || clean(r.thumbnailUrl);
    const out = path.join(FEED, `${id}.jpg`);
    let status = "kept";
    if (!fs.existsSync(out)) {
      if (!imgUrl) {
        report.push(`${id} ${kind}: no picture in the data, skipped`);
        continue;
      }
      const tmp = path.join(FEED, `${id}.download`);
      try {
        await download(imgUrl, tmp);
        toJpeg(tmp, out, MAX_W);
        status = "downloaded";
      } catch (e) {
        report.push(`${id} ${kind}: download failed (${e.message}), skipped`);
        continue;
      } finally {
        fs.rmSync(tmp, { force: true });
      }
    }
    const thumb = path.join(THUMBS, `${id}.jpg`);
    if (!fs.existsSync(thumb)) toJpeg(out, thumb, THUMB_W);
    const { w, h } = sipsSize(out);
    posts.push({
      id,
      kind,
      date: r.publishedDate,
      img: `feed/${id}.jpg`,
      thumb: `thumbs/${id}.jpg`,
      w,
      h,
      caption: clean(r.caption),
      likes: num(r.likes),
      comments: num(r.comments),
      link: clean(r.permalink),
    });
    report.push(`${id} ${kind} ${r.publishedDate.slice(0, 10)} ${w}x${h} ${status}`);
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  // Profile picture and Highlight covers, from Drive.
  const about = JSON.parse(fs.readFileSync(path.join(HERE, "profile.json"), "utf8"));
  delete about._about;
  const profile = { ...about, avatar: null, highlights: [] };
  if (fs.existsSync(DRIVE_PROFILE)) {
    for (const f of fs.readdirSync(DRIVE_PROFILE).sort()) {
      const full = path.join(DRIVE_PROFILE, f);
      if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
      if (/profile picture/i.test(f)) {
        toJpeg(full, path.join(BUILD, "avatar.jpg"), 320);
        profile.avatar = "avatar.jpg";
      } else {
        const m = f.match(/Highlight - ([^(.]+)/i);
        if (!m) continue;
        const label = m[1].trim();
        const name = `highlights/${String(profile.highlights.length + 1).padStart(2, "0")}.jpg`;
        toJpeg(full, path.join(BUILD, name), 200);
        profile.highlights.push({ label, img: name });
      }
    }
  } else {
    report.push("Drive Profile folder not found: profile picture and Highlights not copied");
  }

  // Drop pictures of posts no longer in the list (deleted or archived on Instagram).
  const keep = new Set(posts.map((p) => `${p.id}.jpg`));
  for (const dir of [FEED, THUMBS]) for (const f of fs.readdirSync(dir)) if (!keep.has(f)) fs.rmSync(path.join(dir, f));

  // The safe-area lines the page can draw over Reels and Stories, from the one brand config (the pack's safe areas).
  const pack = JSON.parse(fs.readFileSync(path.join(HERE, "../brand-pack.json"), "utf8")).safeArea;
  const safe = { subject: pack.subject, frame: pack.frame, reel: pack.reel, story: pack.story };
  const feed = { copiedAt: new Date().toISOString(), profile, safe, posts };
  fs.writeFileSync(path.join(BUILD, "feed.json"), JSON.stringify(feed));
  console.log(report.join("\n"));
  console.log(`\n${posts.length} items (${posts.filter((p) => p.kind === "story").length} stories), ${profile.highlights.length} highlights. Wrote ${path.relative(process.cwd(), path.join(BUILD, "feed.json"))}`);
})();
