# Explainer video

A 16:9 video (1920 x 1080, just under two minutes) that shows what happens to
Laura's photos and videos after a job. Her website colours and fonts, line
drawings that move, a spoken overview with dry British humour, short on-screen titles, a few real sounds and quiet music.
No people are drawn (Matt, 2026-11-21: no stick figures).

- `film.html` is the whole animation: every scene's title, spoken line (`say`), drawing and sounds are in the `SCENES` list. Change words there.
- `film.mjs` builds the video: makes the voice with ElevenLabs (George, a British man; the key is a network secret on the cloud environment), mixes in the sounds, records every frame (needs Playwright) and joins it all. `TTS=openai` uses the old OpenAI voice instead; `SFX=0` leaves out the sounds and music.
- `sounds/` holds the real sound effects (camera shutter, typing, message ping, chime) and the looping music bed, all made with ElevenLabs. ElevenLabs' free plan asks for a credit if the video is posted publicly.

To rebuild: `npm install`, then `npm run build`. The video lands in
`out/river-fox-how-it-works.mp4` (`out` is not saved to GitHub).
`npm run stills` saves pictures of each scene for a quick check.
