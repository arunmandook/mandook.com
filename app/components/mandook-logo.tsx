"use client";

import { CSSProperties, useEffect, useRef } from "react";

const GOLD = "#E8C25A";
const GOLD_DEEP = "#9c7616";

/**
 * Animated "MANDOOK" wordmark where the double-O is a pair of golden eyes that
 * track the cursor, blink, and glow, while the lettering shimmers and the whole
 * mark gently floats. Recreated from the original design as a self-contained
 * client component. Honors prefers-reduced-motion.
 */
export default function MandookLogo({ fontSize = 26 }: { fontSize?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const goldL = useRef<HTMLSpanElement>(null);
  const goldR = useRef<HTMLSpanElement>(null);
  const eyeL = useRef<HTMLSpanElement>(null);
  const eyeR = useRef<HTMLSpanElement>(null);
  const pupilL = useRef<HTMLSpanElement>(null);
  const pupilR = useRef<HTMLSpanElement>(null);
  const glowL = useRef<HTMLSpanElement>(null);
  const glowR = useRef<HTMLSpanElement>(null);
  const lidL = useRef<HTMLSpanElement>(null);
  const lidR = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const move = (eye: HTMLSpanElement | null, pupil: HTMLSpanElement | null) => {
      if (!eye || !pupil) return;
      const r = eye.getBoundingClientRect();
      if (!r.width) return;
      const dx = mouse.x - (r.left + r.width / 2);
      const dy = mouse.y - (r.top + r.height / 2);
      const ang = Math.atan2(dy, dx);
      const dist = Math.min(r.width * 0.17, Math.hypot(dx, dy) / 30);
      pupil.style.transform = `translate(${(Math.cos(ang) * dist).toFixed(1)}px, ${(
        Math.sin(ang) * dist
      ).toFixed(1)}px)`;
    };

    const epoch = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = (now - epoch) / 1000;

      // Shimmer sweep across the lettering.
      const sp = ((t / 6.5) % 1) * 460 - 180;
      if (goldL.current) goldL.current.style.backgroundPosition = `${sp}% 0`;
      if (goldR.current) goldR.current.style.backgroundPosition = `${sp}% 0`;

      // Gentle float.
      const y = (-3 * (1 - Math.cos((2 * Math.PI * t) / 6))) / 2;
      if (wrap.current) wrap.current.style.transform = `translateY(${y.toFixed(2)}px)`;

      // Pulsing glow behind each eye, slightly out of phase.
      const gp = (ph: number) => (Math.sin((2 * Math.PI * ph) / 3.4 - Math.PI / 2) + 1) / 2;
      const gL = gp(t);
      const gR = gp(t - 0.5);
      const glow = 0.7;
      if (glowL.current) {
        glowL.current.style.opacity = (glow * (0.4 + 0.45 * gL)).toFixed(3);
        glowL.current.style.transform = `scale(${(1 + 0.1 * gL).toFixed(3)})`;
      }
      if (glowR.current) {
        glowR.current.style.opacity = (glow * (0.4 + 0.45 * gR)).toFixed(3);
        glowR.current.style.transform = `scale(${(1 + 0.1 * gR).toFixed(3)})`;
      }

      move(eyeL.current, pupilL.current);
      move(eyeR.current, pupilR.current);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Periodic blink (with the occasional double-blink).
    let blinkTimer: ReturnType<typeof setTimeout>;
    const blink = () => {
      [lidL.current, lidR.current].forEach((lid) => {
        if (!lid) return;
        lid.style.transform = "translateY(0%)";
        setTimeout(() => {
          lid.style.transform = "translateY(-118%)";
        }, 105);
      });
    };
    const schedule = () => {
      blinkTimer = setTimeout(() => {
        blink();
        if (Math.random() < 0.3) setTimeout(blink, 360);
        schedule();
      }, 2200 + Math.random() * 3600);
    };
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      clearTimeout(blinkTimer);
    };
  }, []);

  // Proportions derived from the original (eye ≈ 0.674 of the font size).
  const eye = Math.round(fontSize * 0.674);
  const pupil = Math.round(eye * 0.42);
  const highlight = Math.max(2, Math.round(pupil * 0.45));

  const letter: CSSProperties = {
    fontFamily: "var(--font-cinzel), serif",
    fontWeight: 700,
    fontSize,
    letterSpacing: "0.04em",
    lineHeight: 1,
    background: `linear-gradient(105deg, ${GOLD_DEEP} 0%, ${GOLD} 38%, #fff4d6 50%, ${GOLD} 62%, ${GOLD_DEEP} 100%)`,
    backgroundSize: "220% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    filter: "drop-shadow(0 1px 6px rgba(232,194,90,0.25))",
  };

  const Eye = ({
    glowRef,
    eyeRef,
    pupilRef,
    lidRef,
  }: {
    glowRef: React.Ref<HTMLSpanElement>;
    eyeRef: React.Ref<HTMLSpanElement>;
    pupilRef: React.Ref<HTMLSpanElement>;
    lidRef: React.Ref<HTMLSpanElement>;
  }) => (
    <span
      ref={eyeRef}
      style={{
        position: "relative",
        display: "inline-block",
        width: eye,
        height: eye,
        margin: `0 ${Math.round(eye * 0.1)}px`,
      }}
    >
      <span
        ref={glowRef}
        style={{
          position: "absolute",
          inset: -Math.round(eye * 0.29),
          borderRadius: "50%",
          background: `radial-gradient(circle, ${GOLD} 0%, rgba(232,194,90,0) 65%)`,
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          overflow: "hidden",
          background: `radial-gradient(circle at 50% 42%, #fff6dc 0%, ${GOLD} 30%, ${GOLD_DEEP} 72%, #5e4708 100%)`,
          boxShadow:
            "inset 0 1.5px 5px rgba(0,0,0,0.55), inset 0 -1px 3px rgba(255,240,200,0.35), 0 0 0 1px rgba(255,240,200,0.18)",
        }}
      >
        <span
          ref={pupilRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: pupil,
            height: pupil,
            marginLeft: -pupil / 2,
            marginTop: -pupil / 2,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 32%, #2a2a2a 0%, #050505 70%)",
            boxShadow: "0 0 0 1px rgba(94,71,8,0.55)",
            transition: "transform 0.12s ease-out",
            willChange: "transform",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: highlight * 0.7,
              top: highlight * 0.5,
              width: highlight,
              height: highlight,
              borderRadius: "50%",
              background: "radial-gradient(circle at 40% 40%, #ffffff, rgba(255,255,255,0.2))",
            }}
          />
        </span>
        <span
          ref={lidRef}
          style={{
            position: "absolute",
            left: "-6%",
            top: 0,
            width: "112%",
            height: "116%",
            borderRadius: "0 0 50% 50% / 0 0 42% 42%",
            background: "linear-gradient(180deg, #0d0d0f 0%, #050506 100%)",
            transform: "translateY(-118%)",
            transition: "transform 0.09s ease-in",
          }}
        />
      </span>
    </span>
  );

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        willChange: "transform",
      }}
    >
      <span ref={goldL} style={letter}>
        MAND
      </span>
      <Eye glowRef={glowL} eyeRef={eyeL} pupilRef={pupilL} lidRef={lidL} />
      <Eye glowRef={glowR} eyeRef={eyeR} pupilRef={pupilR} lidRef={lidR} />
      <span ref={goldR} style={{ ...letter, paddingLeft: "0.07em" }}>
        K
      </span>
    </div>
  );
}
