import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bike, Camera, Cat, Guitar, Mic, Phone, Plus, Rocket, Send, Umbrella, Zap, Cloud, Coffee, Cake, Flower2, Gift, Heart, MapPin, MessageCircle, MicOff, Moon, Music, PartyPopper, Palette, Pizza, Plane, Smile, Sparkles, Star, Sun, Video, Volume2 } from "lucide-react";
import type { ChatLine } from "@/data/howItWorks";
import "@/styles/chat-demo.css";

/**
 * A mocked-up WhatsApp enquiry (step 1 of "How it works"). Decorative: it shows
 * what sending Laura a message looks like, then Laura calling (the chat fades to a call screen).
 *
 * The first message is already there. When the chat scrolls into view, each next
 * message shows a "..." pill that grows into the bubble while the words type
 * out. New messages push earlier ones up,
 * and the oldest fade out at the top. After the last message Laura's call comes
 * in, the finished chat holds for a few seconds and the whole thing replays.
 * With reduced motion it simply shows the finished chat.
 *
 * Styles: src/styles/chat-demo.css (tokens in index.css, "Chat demo").
 */

/** Pauses and speeds, in milliseconds. */
const TIMING = {
  start: 400,
  think: 1100,
  /** Between letters. */
  key: 18,
  /** After the first letter, so the bubble can finish growing out of its pill. */
  growThem: 200,
  growMe: 450,
  afterMessage: 350,
  callLead: 500,
  callSettle: 400,
  /** The finished chat stays put before replaying. */
  hold: 7000,
  /** Fading out and back in around the reset. */
  fade: 600,
  restart: 300,
} as const;

const CALLER = "Laura";
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type RowProps = {
  index: number;
  /** Letters typed so far (the call row is 0 or 1). */
  shown: number;
  thinking: boolean;
  onHeight: (index: number, height: number) => void;
  children: (ref: (el: HTMLElement | null) => void) => React.ReactNode;
  side: ChatLine["side"];
  /** The "..." pill that stands in for the bubble while thinking. */
  pill?: boolean;
};

/**
 * One row of the chat. Its height eases between the pill's, the bubble's and
 * nothing, and it reports that height so the list can lift itself.
 */
const Row = ({ index, shown, thinking, onHeight, children, side, pill = true }: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const visible = shown > 0;

  useLayoutEffect(() => {
    const measure = () => {
      const content = visible ? bodyRef.current?.offsetHeight ?? 0 : thinking ? pillRef.current?.offsetHeight ?? 0 : 0;
      // Every row but the first sits a message-gap below the one above it.
      const height = content ? content + (index === 0 ? 0 : readGap(rowRef.current)) : 0;
      if (rowRef.current) rowRef.current.style.height = `${height}px`;
      onHeight(index, height);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [visible, thinking, index, onHeight]);

  return (
    <div ref={rowRef} className={`chat-row ${index === 0 ? "chat-row-first" : ""}`}>
      <div className={`chat-row-in chat-${side}`}>
        {children((el) => {
          bodyRef.current = el;
        })}
        {pill && (
          <span ref={pillRef} className={`chat-dots chat-${side} ${thinking && !visible ? "show" : ""}`} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        )}
      </div>
    </div>
  );
};

/** The gap above a row comes from the --chat-gap token, so it stays in the stylesheet. */
const readGap = (el: HTMLElement | null) => (el ? parseFloat(getComputedStyle(el).getPropertyValue("--chat-gap")) || 0 : 0);

/** Bigger "feature" icons, small fillers (stars, sparkles) and tiny ring dots, like WhatsApp's wallpaper. */
const BIG = [
  Heart, MessageCircle, Camera, MapPin, Sun, Coffee, Music, Gift, PartyPopper, Cake, Flower2,
  Smile, Plane, Cloud, Pizza, Palette, Moon, Cat, Phone, Mic, Umbrella, Bike, Guitar, Rocket,
];
const SMALL = [Star, Sparkles, Plus, Zap, Heart, Moon, Music, Send];
const DOODLE_COUNT = 700;

/** A steady pseudo-random number from an index, so the pattern never reshuffles on re-render. */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** WhatsApp-style doodle wallpaper, tiled from icons and kept very faint. */
const Doodles = () => (
  <div className="chat-doodles" aria-hidden="true">
    {Array.from({ length: DOODLE_COUNT }, (_, i) => {
      const kind = rand(i, 1);
      const spin = Math.round((rand(i, 2) - 0.5) * 60);
      const nudge = {
        "--dx": `${Math.round((rand(i, 3) - 0.5) * 10)}px`,
        "--dy": `${Math.round((rand(i, 4) - 0.5) * 10)}px`,
        "--r": `${spin}deg`,
      } as React.CSSProperties;
      if (kind < 0.3) {
        const Icon = BIG[Math.floor(rand(i, 5) * BIG.length)];
        return <Icon key={i} className="chat-doodle big" strokeWidth={1.3} style={nudge} />;
      }
      if (kind < 0.55) {
        const Icon = SMALL[Math.floor(rand(i, 5) * SMALL.length)];
        return <Icon key={i} className="chat-doodle small" strokeWidth={1.4} style={nudge} />;
      }
      return <i key={i} className={`chat-doodle-dot ${kind < 0.8 ? "hollow" : ""}`} style={nudge} />;
    })}
  </div>
);

/** The call screen: the chat fades, Laura's monogram rings, the phone controls sit below. */
const CallScreen = ({ on }: { on: boolean }) => (
  <div className={`chat-callscreen ${on ? "on" : ""}`} role="img" aria-label={`WhatsApp call from ${CALLER}`}>
    <span className="chat-callscreen-avatar" aria-hidden="true">
      <i />
      <i />
      <img src="/favicon.svg" alt="" width="88" height="88" />
    </span>
    <span className="chat-callscreen-text">
      <strong className="t-h5">{CALLER}</strong>
      <span className="t-meta">WhatsApp calling</span>
    </span>
    <span className="chat-callscreen-controls" aria-hidden="true">
      <span className="chat-control"><Volume2 /></span>
      <span className="chat-control"><Video /></span>
      <span className="chat-control"><MicOff /></span>
      <span className="chat-control answer"><Phone /></span>
    </span>
  </div>
);

type ChatDemoProps = { lines: ChatLine[] };

const ChatDemo = ({ lines }: ChatDemoProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // One row per line; the call is a separate screen.
  const rowCount = lines.length;
  const heights = useRef<number[]>(Array(rowCount).fill(0));
  const reduced = prefersReducedMotion();
  const finished = () => lines.map((l) => l.text.length);
  /** Where the chat starts, and starts again: just the first message. */
  const opening = () => [lines[0].text.length, ...Array(rowCount - 1).fill(0)];

  const [shown, setShown] = useState<number[]>(() => (reduced ? finished() : opening()));
  const [thinking, setThinking] = useState(-1);
  const [calling, setCalling] = useState(false);
  const [phase, setPhase] = useState<"" | "fading" | "resetting">("");

  /** Lift the list so the newest row sits at the bottom once the chat outgrows its box. */
  const lift = () => {
    const view = viewRef.current;
    const list = listRef.current;
    if (!view || !list) return;
    const total = heights.current.reduce((sum, h) => sum + h, 0) + parseFloat(getComputedStyle(list).paddingTop);
    // The view's bottom padding is only there for shadows; messages stop above it.
    const pad = getComputedStyle(view);
    const visibleHeight = view.clientHeight - parseFloat(pad.paddingBottom) - parseFloat(pad.paddingTop);
    const offset = Math.max(0, total - visibleHeight);
    list.style.transform = `translateY(${-offset}px)`;
    view.classList.toggle("lifted", offset > 0);
  };
  const onHeight = useRef((index: number, height: number) => {
    heights.current[index] = height;
    lift();
  }).current;

  // Keep the lift right when the box resizes or the real fonts arrive late
  // (text wraps differently, so the bubbles change height).
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const observer = new ResizeObserver(() => lift());
    observer.observe(view);
    document.fonts?.ready.then(() => window.dispatchEvent(new Event("resize")));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    let stopped = false;

    const set = (index: number, count: number) => setShown((prev) => prev.map((n, k) => (k === index ? count : n)));

    const play = async () => {
      while (!stopped) {
        await wait(TIMING.start);
        for (let i = 1; i < lines.length; i++) {
          if (stopped) return;
          setThinking(i);
          await wait(TIMING.think);
          setThinking(-1);
          const { text, side } = lines[i];
          for (let c = 1; c <= text.length; c++) {
            if (stopped) return;
            set(i, c);
            await wait(c === 1 ? (side === "me" ? TIMING.growMe : TIMING.growThem) : TIMING.key);
          }
          await wait(TIMING.afterMessage);
        }
        await wait(TIMING.callLead);
        // The chat fades and the call screen comes up over the same pink.
        setCalling(true);
        await wait(TIMING.callSettle + TIMING.hold);
        if (stopped) return;
        // Fade out, reset while it's invisible, fade back in.
        setPhase("fading");
        await wait(TIMING.fade);
        if (stopped) return;
        setPhase("resetting");
        setThinking(-1);
        setCalling(false);
        setShown(opening());
        await wait(TIMING.restart);
        setPhase("fading");
        await wait(50);
        setPhase("");
        await wait(TIMING.fade);
      }
    };

    // Start once, when half of the chat is on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          play();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(root);
    return () => {
      stopped = true;
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, reduced, rowCount]);

  return (
    <div ref={rootRef} className={`chat-demo ${calling ? "calling" : ""} ${phase === "fading" ? "is-fading" : phase === "resetting" ? "is-fading is-resetting" : ""}`} role="img" aria-label="Example of an enquiry sent to Laura by WhatsApp">
      <Doodles />
      <div ref={viewRef} className="chat-view">
        <div ref={listRef} className="chat-list">
          {lines.map((line, i) => (
            <Row key={i} index={i} shown={shown[i]} thinking={thinking === i} onHeight={onHeight} side={line.side}>
              {(ref) => (
                <p
                  ref={ref}
                  className={`chat-bubble chat-${line.side} ${shown[i] > 0 ? "on" : thinking === i ? "think" : ""}`}
                >
                  <span className="t-meta">{line.text.slice(0, shown[i])}</span>
                  <span className="t-meta chat-ghost">{line.text.slice(shown[i])}</span>
                </p>
              )}
            </Row>
          ))}
        </div>
      </div>
      <CallScreen on={calling} />
    </div>
  );
};

export default ChatDemo;
