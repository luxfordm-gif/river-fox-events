# Explainer video

A 16:9 video (1920 x 1080, just under two minutes) that shows what happens to
Laura's photos and videos after a job. Her website colours and fonts, line
drawings that move, a spoken overview, short on-screen titles and sound effects.
No people are drawn (Matt, 2026-11-21: no stick figures).

- `film.html` is the whole animation: every scene's title, spoken line (`say`), drawing and sounds are in the `SCENES` list. Change words there.
- `film.mjs` builds the video: makes the voice with OpenAI's speech model (needs `OPENAI_API_KEY`, `curl` and `ffmpeg`), makes the sound effects, records every frame (needs Playwright) and joins it all.
- `film-sound.py` makes the sound effects from scratch, so nothing needs a licence.

To rebuild: `npm install`, then `npm run build`. The video lands in
`out/river-fox-how-it-works.mp4` (`out` is not saved to GitHub).
`npm run stills` saves pictures of each scene for a quick check.
