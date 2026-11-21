// The explainer video's scenes: the step title, the spoken line (also the caption)
// and the line drawing for each. Edit words here, then run `npm run build`.
// Drawings use a 960 x 520 canvas. Classes: d (line draws on), pop, fade, up;
// --d is the delay in seconds from the start of the scene.

const arch = (cx, baseY, r, n = 9, d0 = 0, step = 0.06) => {
  let out = "";
  for (let i = 0; i < n; i++) {
    const a = Math.PI - (i / (n - 1)) * Math.PI;
    const x = cx + Math.cos(a) * r;
    const y = baseY - Math.sin(a) * r;
    const size = r * (0.2 + ((i * 7) % 3) * 0.035);
    const fill = ["f-pink", "f-white", "f-warm"][i % 3];
    out += `<circle class="pop ${fill}" style="--d:${(d0 + i * step).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${size.toFixed(1)}"/>`;
  }
  return out;
};

// A photo card with a small balloon arch inside it.
const photo = (x, y, w, h, d = 0, extra = "") =>
  `<g ${extra}><rect class="d f-white" style="--d:${d}s" x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>` +
  arch(x + w / 2, y + h * 0.78, Math.min(w, h) * 0.3, 7, d + 0.3, 0.05) +
  `<line class="d" style="--d:${d + 0.3}s" x1="${x + w * 0.12}" y1="${y + h * 0.78}" x2="${x + w * 0.88}" y2="${y + h * 0.78}"/></g>`;

const phone = (x, y, w, h, d = 0) =>
  `<rect class="d f-white" style="--d:${d}s" x="${x}" y="${y}" width="${w}" height="${h}" rx="22"/>` +
  `<line class="d" style="--d:${d + 0.3}s" x1="${x + w / 2 - 16}" y1="${y + 16}" x2="${x + w / 2 + 16}" y2="${y + 16}"/>`;

const label = (x, y, text, d = 0, cls = "") =>
  `<text class="lab fade ${cls}" style="--d:${d}s" x="${x}" y="${y}" text-anchor="middle">${text}</text>`;

const folderRow = (y, num, name, cls = "") =>
  `<g class="${cls}"><path class="f-white" d="M300 ${y} h34 l10 10 h44 v36 h-88 z"/>` +
  `<text class="mono" x="412" y="${y + 33}">${num}</text><text class="rowname" x="462" y="${y + 33}">${name}</text></g>`;

globalThis.SCENES = [
  {
    id: "title",
    title: "",
    say: "Here is what happens to Laura's photos and videos after every job.",
    art: `
      ${arch(480, 330, 150, 11, 0.2, 0.07)}
      <line class="d" style="--d:.2s" x1="250" y1="330" x2="710" y2="330"/>
      <text class="big fade" style="--d:.5s" x="480" y="430" text-anchor="middle">From one job to <tspan class="accent">every channel.</tspan></text>
      <text class="lab fade" style="--d:1s" x="480" y="486" text-anchor="middle">HOW IT WORKS, IN THIRTEEN STEPS</text>`,
  },
  {
    id: "job",
    title: "Laura photographs the job",
    say: "Laura styles the event, then takes photos, videos and time-lapses on her phone.",
    art: `
      ${arch(330, 420, 190, 11, 0.1, 0.07)}
      <line class="d" style="--d:.1s" x1="60" y1="420" x2="620" y2="420"/>
      ${phone(590, 150, 150, 280, 0.9)}
      <circle class="d" style="--d:1.3s" cx="665" cy="385" r="18"/>
      ${arch(665, 300, 42, 7, 1.5, 0.05)}
      <g class="pop" style="--d:2.1s"><line x1="760" y1="140" x2="790" y2="112"/><line x1="745" y1="120" x2="752" y2="88"/><line x1="772" y1="165" x2="806" y2="158"/></g>
      <g class="pop" style="--d:2.6s"><rect class="f-pink" x="790" y="210" width="130" height="46" rx="23"/><text class="chip" x="855" y="241" text-anchor="middle">Photos</text></g>
      <g class="pop" style="--d:3.1s"><rect class="f-white" x="790" y="272" width="130" height="46" rx="23"/><text class="chip" x="855" y="303" text-anchor="middle">Videos</text></g>
      <g class="pop" style="--d:3.6s"><rect class="f-warm" x="770" y="334" width="170" height="46" rx="23"/><text class="chip" x="855" y="365" text-anchor="middle">Time-lapses</text></g>`,
  },
  {
    id: "drive",
    title: "Into one Drive folder",
    say: "She drops them all into one folder in Google Drive.",
    art: `
      <path class="d f-white" style="--d:.1s" d="M300 170 h130 l30 34 h200 v236 h-360 z"/>
      <g style="animation: drop .9s cubic-bezier(.5,0,.3,1) .9s both"><rect class="f-white" x="350" y="190" width="110" height="140" rx="8" transform="rotate(-8 405 260)"/></g>
      <g style="animation: drop .9s cubic-bezier(.5,0,.3,1) 1.3s both"><rect class="f-pink" x="430" y="180" width="110" height="140" rx="8"/></g>
      <g style="animation: drop .9s cubic-bezier(.5,0,.3,1) 1.7s both"><rect class="f-warm" x="505" y="190" width="110" height="140" rx="8" transform="rotate(9 560 260)"/></g>
      <path class="d f-cream" style="--d:.4s" d="M280 270 h400 l-20 170 h-360 z"/>
      ${label(480, 492, "SOCIAL / _TO EDIT (FROM LAURA)", 2.2)}`,
  },
  {
    id: "skill",
    title: "Matt runs the skill",
    say: "She tells Matt, and he runs the River Fox skill in Claude Code.",
    art: `
      <path class="d f-white" style="--d:.1s" d="M70 150 h250 a20 20 0 0 1 20 20 v90 a20 20 0 0 1 -20 20 h-150 l-40 40 v-40 h-10 a20 20 0 0 1 -20 -20 v-90 a20 20 0 0 1 20 -20 z"/>
      <text class="chip fade" style="--d:.7s" x="195" y="212" text-anchor="middle">The new job</text>
      <text class="chip fade" style="--d:.7s" x="195" y="246" text-anchor="middle">is in Drive</text>
      <path class="d" style="--d:1.2s" d="M370 230 h70 m-18 -16 l18 16 l-18 16"/>
      <rect class="d f-ink" style="--d:1.5s" x="470" y="100" width="420" height="300" rx="14"/>
      <g class="fade" style="--d:1.9s"><circle class="dot" cx="498" cy="126" r="6"/><circle class="dot" cx="520" cy="126" r="6"/><circle class="dot" cx="542" cy="126" r="6"/></g>
      <text class="term fade" style="--d:2.2s" x="500" y="196"><tspan class="tpink">&gt;</tspan> /river-fox</text>
      <rect class="tcur" style="animation: blink .9s steps(1) 2.2s infinite" x="682" y="172" width="14" height="30"/>
      <text class="term dim fade" style="--d:3s" x="500" y="250">Reading the folder</text>
      <text class="term dim fade" style="--d:3.5s" x="500" y="296">Grading, cropping, filing</text>
      <text class="term tpink fade" style="--d:4s" x="500" y="342">Done</text>`,
  },
  {
    id: "grade",
    title: "Colour graded",
    say: "Every photo is colour graded in the house look: bright, airy and true to colour.",
    art: `
      ${photo(300, 40, 360, 400, 0.1)}
      <rect class="dull" style="animation: wipe 2s cubic-bezier(.6,0,.3,1) 1.4s both; transform-origin: 660px 0" x="300" y="40" width="360" height="400" rx="10"/>
      <g style="animation: handle 2s cubic-bezier(.6,0,.3,1) 1.4s both"><line class="thick" x1="300" y1="22" x2="300" y2="458"/><circle class="f-pink" cx="300" cy="240" r="16"/></g>
      ${label(210, 250, "BEFORE", 0.8)}
      ${label(750, 250, "AFTER", 3.2)}
      <g class="pop" style="--d:3.4s"><path class="f-pink" d="M750 150 l8 20 l20 8 l-20 8 l-8 20 l-8 -20 l-20 -8 l20 -8 z"/></g>
      <g class="pop" style="--d:3.7s"><path d="M800 110 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 l12 -5 z"/></g>
      ${label(480, 492, "BRIGHT · AIRY · TRUE TO COLOUR", 3.6)}`,
  },
  {
    id: "best",
    title: "The best shot is picked",
    say: "Where photos are nearly the same, it keeps the best one and recrops it.",
    art: `
      <g style="animation: dim .6s ease 2.2s both">${photo(120, 110, 200, 270, 0.1)}</g>
      <g style="animation: grow .7s cubic-bezier(.3,1.3,.5,1) 2.2s both; transform-origin: 480px 245px">${photo(380, 110, 200, 270, 0.4)}
        <path class="d accentline" style="--d:3.2s" d="M400 160 v-30 h30 M530 130 h30 v30 M560 330 v30 h-30 M430 360 h-30 v-30"/></g>
      <g style="animation: dim .6s ease 2.2s both">${photo(640, 110, 200, 270, 0.7)}</g>
      <g class="pop" style="--d:2.5s"><circle class="f-pink" cx="580" cy="100" r="30"/><path d="M566 100 l10 11 l19 -22"/></g>`,
  },
  {
    id: "overlay",
    title: "Cover text goes on",
    say: "The strongest photo of the set gets the cover text.",
    art: `
      ${photo(350, 20, 260, 462, 0.1)}
      <g class="up" style="--d:1.5s"><rect class="f-cream" x="374" y="60" width="212" height="118" rx="8"/>
      <text class="lab" x="480" y="94" text-anchor="middle">RIVER FOX EVENTS</text>
      <text class="cover" x="480" y="130" text-anchor="middle">A balloon arch</text>
      <text class="cover accent" x="480" y="160" text-anchor="middle">in Surrey</text></g>
      <g class="pop" style="--d:2.4s"><path class="f-pink" d="M690 120 l8 20 l20 8 l-20 8 l-8 20 l-8 -20 l-20 -8 l20 -8 z"/></g>
      ${label(805, 270, "FRAUNCES REGULAR", 2.6)}
      <path class="d" style="--d:2.4s" d="M690 262 h-70 m16 -14 l-16 14 l16 14"/>`,
  },
  {
    id: "resize",
    title: "Resized for every format",
    say: "Then every photo is resized for each social format.",
    art: `
      ${photo(120, 30, 219, 390, 0.1)}
      ${photo(400, 100, 240, 320, 0.7)}
      ${photo(700, 225, 260, 195, 1.3, 'transform="translate(-40 0)"')}
      ${label(230, 462, "STORY", 0.6)}${label(230, 492, "1080 × 1920", 0.6, "soft")}
      ${label(520, 462, "POST", 1.2)}${label(520, 492, "1080 × 1440", 1.2, "soft")}
      ${label(790, 462, "GOOGLE BUSINESS", 1.8)}${label(790, 492, "1200 × 900", 1.8, "soft")}`,
  },
  {
    id: "reel",
    title: "Videos become a reel",
    say: "For videos, it watches the footage, finds the hook, and puts the finished look first. That becomes an Instagram reel.",
    art: `
      <g style="animation: shiftR .9s cubic-bezier(.6,0,.3,1) 2.6s both">
        <rect class="d f-white" style="--d:.1s" x="60" y="190" width="110" height="140" rx="10"/>
        <rect class="d f-white" style="--d:.25s" x="184" y="190" width="110" height="140" rx="10"/>
        <rect class="d f-white" style="--d:.4s" x="308" y="190" width="110" height="140" rx="10"/>
        <rect class="d f-white" style="--d:.55s" x="432" y="190" width="110" height="140" rx="10"/>
      </g>
      <g style="animation: toFront .9s cubic-bezier(.6,0,.3,1) 2.6s both">
        <rect class="d f-pink" style="--d:.7s" x="556" y="190" width="110" height="140" rx="10"/>
        <path class="pop f-white" style="--d:1.2s" d="M611 232 l9 20 l22 3 l-16 15 l4 22 l-19 -11 l-19 11 l4 -22 l-16 -15 l22 -3 z"/>
      </g>
      <g style="animation: out .3s ease 2.5s both">${label(611, 372, "FINISHED LOOK", 1.4)}</g>
      <g class="pop" style="--d:3.6s"><rect class="f-ink" x="70" y="118" width="90" height="42" rx="21"/><text class="chip onink" x="115" y="147" text-anchor="middle">Hook</text></g>
      <path class="d" style="--d:4.4s" d="M690 260 h50 m-16 -14 l16 14 l-16 14"/>
      ${phone(770, 80, 150, 300, 4.8)}
      <path class="pop f-pink" style="--d:5.4s" d="M826 200 l46 30 l-46 30 z"/>
      ${label(845, 430, "INSTAGRAM REEL", 5.6)}`,
  },
  {
    id: "captions",
    title: "Animated captions",
    say: "If anyone speaks, it adds animated captions, in a choice of three styles.",
    art: `
      ${phone(140, 40, 190, 380, 0.1)}${phone(385, 40, 190, 380, 0.4)}${phone(630, 40, 190, 380, 0.7)}
      <g class="fade" style="--d:1.2s"><path d="M215 170 v40 M235 150 v80 M255 175 v30"/><path d="M460 170 v40 M480 150 v80 M500 175 v30"/><path d="M705 170 v40 M725 150 v80 M745 175 v30"/></g>
      <g class="fade" style="--d:1.5s">
        <text class="cap" x="235" y="330" text-anchor="middle"><tspan style="animation: say .01s linear 1.8s both">Here</tspan> <tspan style="animation: say .01s linear 2.2s both">is</tspan> <tspan style="animation: say .01s linear 2.6s both">the</tspan> <tspan style="animation: say .01s linear 3s both">arch</tspan></text>
      </g>
      <text class="capbig" style="animation: word .45s ease 1.8s both" x="480" y="335" text-anchor="middle">Here</text>
      <text class="capbig" style="animation: word .45s ease 2.25s both" x="480" y="335" text-anchor="middle">is</text>
      <text class="capbig" style="animation: word .45s ease 2.7s both" x="480" y="335" text-anchor="middle">the</text>
      <text class="capbig accent" style="animation: wordstay .45s ease 3.15s both" x="480" y="335" text-anchor="middle">arch</text>
      <g class="up" style="--d:2s"><rect class="f-pink" x="652" y="300" width="146" height="48" rx="8"/><text class="cap dark" x="725" y="332" text-anchor="middle">Here is the arch</text></g>
      ${label(235, 470, "STYLE 1", 1.6)}${label(480, 470, "STYLE 2", 1.9)}${label(725, 470, "STYLE 3", 2.2)}`,
  },
  {
    id: "ends",
    title: "A cover and an end screen",
    say: "Each reel opens with a title and closes with an end screen.",
    art: `
      ${phone(140, 40, 190, 380, 0.1)}${phone(385, 40, 190, 380, 0.4)}${phone(630, 40, 190, 380, 0.7)}
      <g class="up" style="--d:1.2s"><rect class="f-cream" x="160" y="180" width="150" height="90" rx="8"/><text class="cover" x="235" y="218" text-anchor="middle">A fifth</text><text class="cover accent" x="235" y="248" text-anchor="middle">birthday</text></g>
      <path class="pop f-pink" style="--d:1.6s" d="M458 195 l52 35 l-52 35 z"/>
      <g class="fade" style="--d:2.2s"><text class="cover" x="725" y="222" text-anchor="middle">River Fox</text><text class="cover" x="725" y="252" text-anchor="middle">Events</text><line x1="695" y1="276" x2="755" y2="276"/></g>
      <path class="d" style="--d:1.4s" d="M342 230 h30 m-12 -10 l12 10 l-12 10 M587 230 h30 m-12 -10 l12 10 l-12 10"/>
      ${label(235, 470, "COVER", 1.2)}${label(480, 470, "REEL", 1.6)}${label(725, 470, "END SCREEN", 2.2)}`,
  },
  {
    id: "google",
    title: "Google Business and the copy",
    say: "Photos are cropped for Google Business too, with no text on them. And one document holds the words for every platform, ready to copy and paste.",
    art: `
      ${photo(90, 110, 340, 255, 0.1)}
      <g class="pop" style="--d:1.2s"><path class="f-pink" d="M430 60 a34 34 0 0 1 34 34 c0 26 -34 58 -34 58 c0 0 -34 -32 -34 -58 a34 34 0 0 1 34 -34 z"/><circle class="f-white" cx="430" cy="94" r="12"/></g>
      ${label(260, 420, "GOOGLE BUSINESS · PLAIN PHOTO", 1.4)}
      <path class="d f-white" style="--d:3.6s" d="M560 40 h220 l60 60 v350 h-280 z"/>
      <path class="d" style="--d:4s" d="M780 40 v60 h60"/>
      <g class="fade" style="--d:4.4s"><text class="doc" x="590" y="150">Instagram</text><line class="soft" x1="590" y1="172" x2="800" y2="172"/><line class="soft" x1="590" y1="194" x2="740" y2="194"/></g>
      <g class="fade" style="--d:4.9s"><text class="doc" x="590" y="258">Facebook</text><line class="soft" x1="590" y1="280" x2="800" y2="280"/><line class="soft" x1="590" y1="302" x2="760" y2="302"/></g>
      <g class="fade" style="--d:5.4s"><text class="doc" x="590" y="366">Google Business</text><line class="soft" x1="590" y1="388" x2="800" y2="388"/><line class="soft" x1="590" y1="410" x2="720" y2="410"/></g>
      <g class="pop" style="--d:6.4s"><rect class="f-ink" x="790" y="120" width="110" height="44" rx="22"/><text class="chip onink" x="845" y="150" text-anchor="middle">Copy</text></g>`,
  },
  {
    id: "folders",
    title: "Filed, newest first",
    say: "Everything is filed in a folder for each platform, numbered so that number one is always the newest job.",
    art: `
      <g class="pop" style="--d:.2s"><rect class="f-white" x="190" y="30" width="170" height="46" rx="23"/><text class="chip" x="275" y="61" text-anchor="middle">Instagram</text></g>
      <g class="pop" style="--d:.4s"><rect class="f-white" x="380" y="30" width="160" height="46" rx="23"/><text class="chip" x="460" y="61" text-anchor="middle">Facebook</text></g>
      <g class="pop" style="--d:.6s"><rect class="f-white" x="560" y="30" width="230" height="46" rx="23"/><text class="chip" x="675" y="61" text-anchor="middle">Google Business</text></g>
      <g class="fade" style="--d:.9s"><g style="animation: rowDown .8s cubic-bezier(.6,0,.3,1) 3s both">
        <g>${folderRow(130, "", "Last week's job")}<text class="mono" style="animation: out .3s ease 3s both" x="412" y="163">01</text><text class="mono" style="animation: fade .3s ease 3.5s both" x="412" y="163">02</text></g>
        <g>${folderRow(220, "", "The job before")}<text class="mono" style="animation: out .3s ease 3s both" x="412" y="253">02</text><text class="mono" style="animation: fade .3s ease 3.5s both" x="412" y="253">03</text></g>
        <g>${folderRow(310, "", "And the one before that")}<text class="mono" style="animation: out .3s ease 3s both" x="412" y="343">03</text><text class="mono" style="animation: fade .3s ease 3.5s both" x="412" y="343">04</text></g>
      </g></g>
      <g style="animation: rowIn .8s cubic-bezier(.3,1.2,.5,1) 3.5s both"><rect class="f-pink" x="280" y="118" width="500" height="70" rx="12"/>${folderRow(130, "01", "The new job")}</g>`,
  },
  {
    id: "website",
    title: "Synced to the website",
    say: "And any new photos are synced to the website.",
    art: `
      <rect class="d f-white" style="--d:.1s" x="160" y="30" width="640" height="430" rx="14"/>
      <line class="d" style="--d:.5s" x1="160" y1="90" x2="800" y2="90"/>
      <g class="fade" style="--d:.8s"><circle class="dot" cx="190" cy="60" r="6"/><circle class="dot" cx="212" cy="60" r="6"/><circle class="dot" cx="234" cy="60" r="6"/>
      <rect class="f-cream thin" x="270" y="42" width="400" height="36" rx="18"/><text class="mono small" x="470" y="67" text-anchor="middle">riverfoxevents.co.uk</text></g>
      <g class="fade" style="--d:1s"><rect class="f-cream" x="190" y="120" width="130" height="150" rx="8"/><rect class="f-cream" x="490" y="120" width="130" height="150" rx="8"/><rect class="f-cream" x="340" y="290" width="130" height="140" rx="8"/><rect class="f-cream" x="640" y="290" width="130" height="140" rx="8"/><rect class="f-cream" x="640" y="120" width="130" height="150" rx="8"/></g>
      <rect class="pop f-pink" style="--d:1.8s" x="340" y="120" width="130" height="150" rx="8"/>
      <rect class="pop f-pink" style="--d:2.1s" x="190" y="290" width="130" height="140" rx="8"/>
      <rect class="pop f-pink" style="--d:2.4s" x="490" y="290" width="130" height="140" rx="8"/>
      <g class="pop" style="--d:2.7s"><circle class="f-ink" cx="800" cy="460" r="38"/><path class="onstroke" d="M783 452 a19 19 0 0 1 33 -4 m2 -12 v13 h-13 M817 468 a19 19 0 0 1 -33 4 m-2 12 v-13 h13"/></g>`,
  },
  {
    id: "end",
    title: "",
    say: "Laura takes the photos. The rest is taken care of.",
    art: `
      ${arch(480, 250, 120, 9, 0.2, 0.07)}
      <line class="d" style="--d:.2s" x1="300" y1="250" x2="660" y2="250"/>
      <text class="big fade" style="--d:.6s" x="480" y="360" text-anchor="middle">River Fox Events</text>
      <text class="lab fade" style="--d:1.1s" x="480" y="416" text-anchor="middle">ONE FOLDER IN · EVERY CHANNEL OUT</text>`,
  },
];
