import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ChatLine } from "@/data/howItWorks";
import "@/styles/chat-demo.css";

/**
 * A mocked-up WhatsApp enquiry (step 1 of "How it works"). Decorative: it shows
 * what sending Laura a message looks like, then Laura calling.
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
  restart: 500,
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

const CallCard = ({ on }: { on: boolean }) => (
  <div className={`chat-call ${on ? "on" : ""}`} role="img" aria-label={`WhatsApp call from ${CALLER}`}>
    <span className="chat-call-avatar" aria-hidden="true">
      <i />
      <i />
      <b className="t-label">{CALLER[0]}</b>
    </span>
    <span className="chat-call-text">
      <strong className="t-label">{CALLER}</strong>
      <span className="t-meta">WhatsApp calling</span>
    </span>
    <span className="chat-call-buttons" aria-hidden="true">
      <span className="chat-call-button decline">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
        </svg>
      </span>
      <span className="chat-call-button accept">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path d="M3.2 2.5c-.5.5-.9 1.2-.7 2.2.6 3.1 3.6 6.6 7.1 8.1 1 .4 1.7.1 2.2-.4l.8-.9c.3-.4.2-.9-.2-1.2l-1.6-1.1c-.4-.2-.8-.2-1.1.1l-.5.5c-1.3-.6-2.6-1.9-3.3-3.3l.5-.5c.3-.3.3-.8.1-1.1L5.4 2.5c-.3-.4-.9-.5-1.3-.2z" />
        </svg>
      </span>
    </span>
  </div>
);

type ChatDemoProps = { lines: ChatLine[] };

const ChatDemo = ({ lines }: ChatDemoProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // One row per line, then the call.
  const rowCount = lines.length + 1;
  const heights = useRef<number[]>(Array(rowCount).fill(0));
  const reduced = prefersReducedMotion();
  const finished = () => [...lines.map((l) => l.text.length), 1];
  /** Where the chat starts, and starts again: just the first message. */
  const opening = () => [lines[0].text.length, ...Array(rowCount - 1).fill(0)];

  const [shown, setShown] = useState<number[]>(() => (reduced ? finished() : opening()));
  const [thinking, setThinking] = useState(-1);

  /** Lift the list so the newest row sits at the bottom once the chat outgrows its box. */
  const lift = () => {
    const view = viewRef.current;
    const list = listRef.current;
    if (!view || !list) return;
    const total = heights.current.reduce((sum, h) => sum + h, 0);
    // The view's bottom padding is only there for shadows; messages stop above it.
    const visibleHeight = view.clientHeight - parseFloat(getComputedStyle(view).paddingBottom);
    const offset = Math.max(0, total - visibleHeight);
    list.style.transform = `translateY(${-offset}px)`;
    view.classList.toggle("lifted", offset > 0);
  };
  const onHeight = useRef((index: number, height: number) => {
    heights.current[index] = height;
    lift();
  }).current;

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
        set(lines.length, 1);
        await wait(TIMING.callSettle + TIMING.hold);
        if (stopped) return;
        setShown(opening());
        await wait(TIMING.restart);
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
    <div ref={rootRef} className="chat-demo" role="img" aria-label="Example of an enquiry sent to Laura by WhatsApp">
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
          <Row index={lines.length} shown={shown[lines.length]} thinking={false} onHeight={onHeight} side="me" pill={false}>
            {(ref) => (
              <div ref={ref as (el: HTMLDivElement | null) => void} className="chat-call-wrap">
                <CallCard on={shown[lines.length] > 0} />
              </div>
            )}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;
