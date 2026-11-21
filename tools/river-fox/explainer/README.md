# Explainer video

A 16:9 video (1920 x 1080, about 1 minute 40) that explains what happens to
Laura's photos and videos after a job, in her website colours, with a spoken
overview and captions.

- `scenes.js` holds every scene: its title, the spoken line (also the caption) and its line drawing. Change words here.
- `index.html` is the look (colours, fonts, animation).
- `voice.mjs` makes the voice-over with OpenAI's speech model (needs `OPENAI_API_KEY`, `ffmpeg` and `curl`). Set `VOICE=...` to try another voice.
- `render.mjs` records the animation and joins it with the voice (needs Playwright). `node render.mjs --stills` saves a picture of each scene for checking.

To rebuild: `npm install`, then `npm run build`. The video lands in
`out/river-fox-how-it-works.mp4` (the `out` folder is not saved to GitHub).
