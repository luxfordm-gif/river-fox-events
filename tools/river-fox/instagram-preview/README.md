# Instagram preview

Laura's Instagram profile on a phone: her real grid, bio and Highlights, with covers that haven't been posted yet sitting top-left with a **Next** tag. Tap a post to open it, a Reel to see it full screen with Instagram's buttons over it, or her profile picture for Stories. The Preview pill (on a phone) or the side panel (on a laptop) switches on the Brand Pack's safe-area lines, the app's dark mode, and adds or removes queued covers.

**The page:** https://claude.ai/artifact/JHcaZhD3hvj2g81TYXdNrR (private to Matt; open it on his phone signed in to claude.ai).

## Why posts are copied, not live

An artifact page can only show pictures it holds itself; it can't load them from Instagram. So `refresh.cjs` copies the latest posts into `build/` and the page is republished with them. The grid shows when it was last copied.

## Refresh the posts (Claude does this)

1. Markifact `run_operation` → `instagram_get_posts_performance`, account `17841456133540925`, a FIXED date range covering about the last three months to today, metrics `likes`, `comments`, dimensions `postId, publishedDate, mediaType, mediaProductType, thumbnailUrl, mediaUrl, permalink, caption`, ordered by `publishedDate` DESC, `limit` 36, `options.include_stories: true`.
2. The answer is too big to come back whole: take its `file_id`, get a signed link with `get_file_url`, and download it to the scratchpad with `curl`.
3. `node tools/river-fox/instagram-preview/refresh.cjs <that file>`. It downloads only new pictures, copies the profile picture and Highlights from Drive > Social > Instagram > Profile, and writes `build/feed.json`. Read its print-out.
4. If the bio or counts changed on Instagram, edit `profile.json` and run step 3 again.
5. Republish: Artifact `publish` with `file_path` = this folder's `index.html`, `root` = `build/`, `url` = the page above, and every file in `build/` except `index.html` and `q/` as `files` (map removed posts to `null`). Leave `capabilities` out so the page keeps them.

## Queue a cover (Claude does this after making one)

1. Upload the finished cover with Artifact `publish`, `url` = the page, `asset: true`, `file_paths` = the cover(s). Each returns an asset id.
2. Add one row per cover with `ArtifactData` `set` in the collection `queue`: `{kind: "post" | "reel" | "story", asset: <id>, caption: <the caption or "">, order: <ms timestamp, posting order>, name: <file name>}`. A Reel cover is the 9:16 cover; the grid crops it the way Instagram does.
   A remake of a post that is already live adds `replaces: <that post's id from build/feed.json>`: it then shows in that post's place with a green Redo tag, and the Redone covers switch (New / Original) flips between the two.
3. Send Matt the link. When the post is live, delete its row (and its asset) or ask Matt to tap Remove.

Matt can also add one from his phone: Preview → Add a cover.

## Try it locally

`build/index.html` is the page wrapped the way the artifact wraps it; the `instagram-preview` server in `.claude/launch.json` serves `build/` on port 8765. Queued covers need the published page (they live in its database).
