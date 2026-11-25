// Photo checks shared by the two cover tools, thumb.cjs (the normal cover) and blocks.cjs (the colour-block cover),
// so both find faces and measure how busy a photo is in the same way. No brand value is written here.
//   faces(file)          - every face Apple Vision finds, as [x, y, w, h, browTop] fractions of the photo (origin top-left;
//                          browTop is the top of the higher eyebrow, or -1). Mac only: compiles faces.swift on first use.
//   photoSize(file)      - [width, height] in pixels.
//   coverFit(iw, ih, w, h) - where a photo drawn to cover a w x h frame, centred, lands (as every cover draws it).
//   faceBoxes(found, fit, margin) - each face as a frame box [x0, y0, x1, y1], widened by margin (a fraction) each way.
//   overlaps(a, b)       - whether two [x0, y0, x1, y1] boxes overlap.
//   busy                 - pass to page.evaluate with { src, w, h, bands }: how busy the photo is (average edge strength,
//                          0 is calm) in each band [name, y0, y1, x0?, x1?], in frame pixels. Lower is calmer.
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

function faces(file) {
  const bin = path.join(__dirname, 'faces');
  const src = path.join(__dirname, 'faces.swift');
  if (!fs.existsSync(bin) || fs.statSync(bin).mtimeMs < fs.statSync(src).mtimeMs) execFileSync('swiftc', ['-O', src, '-o', bin], { stdio: 'inherit' });
  const out = execFileSync(bin, [file], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  return out ? out.split('\n').filter((l) => /^[\d.-]+( [\d.-]+){4}$/.test(l.trim())).map((l) => l.trim().split(' ').map(Number)) : [];
}

function photoSize(file) {
  const o = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
  return [+o.match(/pixelWidth: (\d+)/)[1], +o.match(/pixelHeight: (\d+)/)[1]];
}

function coverFit(iw, ih, w, h) {
  const s = Math.max(w / iw, h / ih), drawW = iw * s, drawH = ih * s;
  return { drawW, drawH, ox: (w - drawW) / 2, oy: (h - drawH) / 2 };
}

const faceBoxes = (found, { drawW, drawH, ox, oy }, g) => found.map(([fx, fy, fw, fh]) =>
  [ox + (fx - fw * g) * drawW, oy + (fy - fh * g) * drawH, ox + (fx + fw * (1 + g)) * drawW, oy + (fy + fh * (1 + g)) * drawH].map(Math.round));

const overlaps = (a, b) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];

// Runs in the page (page.evaluate), so it must not use anything from this file.
async function busy({ src, w, h, bands }) {
  const im = new Image(); im.src = src; await im.decode();
  const W = 216, H = Math.round((216 * h) / w), c = document.createElement('canvas'); c.width = W; c.height = H;
  const s = Math.max(W / im.naturalWidth, H / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
  const cx = c.getContext('2d'); cx.drawImage(im, (W - dw) / 2, (H - dh) / 2, dw, dh);
  const d = cx.getImageData(0, 0, W, H).data;
  const Y = (x, y) => { const i = (y * W + x) * 4; return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; };
  const fy = H / h, fx = W / w;
  return bands.map(([name, a, b, x0 = 0, x1 = w]) => {
    let sum = 0, n = 0;
    const xa = Math.max(1, Math.round(x0 * fx)), xb = Math.min(W - 1, Math.round(x1 * fx));
    for (let y = Math.max(1, Math.round(a * fy)); y < Math.min(H - 1, Math.round(b * fy)); y++) {
      for (let x = xa; x < xb; x++) { sum += Math.abs(Y(x + 1, y) - Y(x - 1, y)) + Math.abs(Y(x, y + 1) - Y(x, y - 1)); n++; }
    }
    return [name, n ? sum / n : 0];
  });
}

// The calmest of the other spots, and whether it is clearly calmer than where the words are (the first band).
function calmer(scores) {
  const calm = scores.slice(1).sort((a, b) => a[1] - b[1])[0];
  return calm && scores[0][1] > calm[1] * 1.3 && scores[0][1] - calm[1] > 4 ? calm[0] : null;
}

module.exports = { faces, photoSize, coverFit, faceBoxes, overlaps, busy, calmer };
