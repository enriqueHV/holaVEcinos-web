import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import styles from './Skyline.module.css';

/**
 * Caracas, as a single clean illustration behind the hero — live SVG, never a bitmap.
 *
 * Depth is built ONLY with value (darker = nearer), scale and position — never by
 * stacking translucent copies of a building on top of another. Every shape below is
 * fully opaque, so nothing can ghost, offset or bleed through a neighbour:
 *
 *   El Ávila        pale ridge, closest to the sky colour, farthest back
 *   distant plane   small, light grey-brown blocks that peek through the seams
 *   midground       the main skyline, solid charcoal
 *   foreground      two larger, near-black towers cropped by the bottom and the page edges
 *
 * Paint order is: all far bodies → far windows → mid bodies → mid windows → near bodies →
 * near windows. A nearer building therefore hides what is genuinely behind it, and every
 * silhouette stays a single solid shape.
 *
 * The canvas is 1600 × 560 and CSS lets the svg scale by width (`height: auto`), so the
 * drawing is never cropped at the top: no horizontal band of sliced buildings.
 *
 * Motion is horizontal only. The planes drift a couple of pixels sideways with scroll, but
 * they NEVER move vertically: every silhouette keeps its base welded to the ground line, so
 * the city can never lift off the street. On load a single wave of light sweeps left to right
 * through the windows; after it passes, only a few windows drift colour or blink quietly.
 */

const VIEW_W = 1600;
const VIEW_H = 560;
const GROUND = 546;

/* Small global nudge used to keep the tallest roofline clear of the hero copy. */
const TOP_SHIFT = 0;

/* How long the opening wave takes to cross the whole skyline, left → right. */
const WAVE_TRAVEL_MS = 1150;
/* Wave class total lifetime: travel + the settle tail. */
const WAVE_LIFETIME_MS = 3600;

type Building = { x: number; w: number; top: number; roof?: number };

/* ——— Distant plane: small solid blocks, light and low, read as atmospheric distance ——— */
const farBuildings = [
  { x: 12, w: 46, top: 452 },
  { x: 96, w: 34, top: 478 },
  { x: 214, w: 40, top: 462 },
  { x: 300, w: 30, top: 486 },
  { x: 512, w: 44, top: 458 },
  { x: 588, w: 32, top: 480 },
  { x: 690, w: 50, top: 448 },
  { x: 846, w: 38, top: 470 },
  { x: 1042, w: 46, top: 456 },
  { x: 1150, w: 34, top: 478 },
  { x: 1244, w: 42, top: 462 },
  { x: 1392, w: 38, top: 474 },
  { x: 1484, w: 44, top: 452 },
  { x: 1554, w: 34, top: 480 },
];

/* ——— The main skyline: low over the copy on the left, rising behind the dashboard ——— */
const midBuildings: Building[] = [
  { x: 40, w: 120, top: 430, roof: 0 },
  { x: 168, w: 140, top: 396, roof: 2 },
  { x: 316, w: 120, top: 436, roof: 5 },
  { x: 444, w: 150, top: 404, roof: 1 },
  { x: 602, w: 160, top: 420, roof: 3 },
  { x: 770, w: 170, top: 330, roof: 4 },
  { x: 948, w: 180, top: 312, roof: 1 },
  { x: 1136, w: 150, top: 352, roof: 0 },
  { x: 1294, w: 140, top: 406, roof: 2 },
  { x: 1442, w: 120, top: 430, roof: 5 },
];

/* ——— Foreground: larger, near-black, cropped by the bottom and running off both edges ——— */
const nearBuildings: Building[] = [
  { x: -70, w: 160, top: 352, roof: 4 },
  { x: 1512, w: 150, top: 364, roof: 2 },
];

const FAR_FILL = '#9c8d80';
const MID_FILL = '#2f2b28';
const NEAR_FILL = '#1d1a18';

/** Deterministic window grid for one building. */
function windowGrid(b: Building, bottom: number, lo: number) {
  const padX = lo <= 300 ? 13 : 17;
  const padTop = lo <= 300 ? 18 : 28;
  const pitchTarget = lo <= 300 ? 31 : 40;
  const colTarget = lo <= 300 ? 24 : 30;
  const cols = Math.max(3, Math.floor((b.w - padX * 2) / pitchTarget));
  /* as many rows as the building can hold (min 2) so short blocks keep lit windows too */
  const rows = Math.max(2, Math.floor((bottom - b.top - padTop - 8) / colTarget));
  const pitchX = (b.w - padX * 2) / cols;
  const pitchY = (bottom - b.top - padTop - 12) / rows;
  const winW = Math.min(lo <= 300 ? 16 : 22, pitchX - 10);
  const winH = Math.min(lo <= 300 ? 15 : 20, pitchY - 8);
  return { cols, rows, pitchX, pitchY, winW, winH, padX, padTop };
}

function Tank({ x, y, w, h = 14 }: { x: number; y: number; w: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} rx={3} className={styles.furniture} />
      <rect x={x + 3} y={y - 3} width={2} height={3} className={styles.furniture} />
      <rect x={x + w - 5} y={y - 3} width={2} height={3} className={styles.furniture} />
    </g>
  );
}

function Antenna({ x, y, h = 28 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y - h} width={2} height={h} className={styles.furniture} />
      <rect x={x - 7} y={y - h + 9} width={16} height={2} className={styles.furniture} />
      <rect x={x - 4} y={y - h + 17} width={10} height={2} className={styles.furniture} />
    </g>
  );
}

function Hvac({ x, y, w = 30, h = 13 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} rx={2} className={styles.furniture} />
      <rect x={x + 5} y={y - h + 4} width={w - 10} height={1.6} className={styles.panel} />
      <rect x={x + 5} y={y - h + 8} width={w - 10} height={1.6} className={styles.panel} />
    </g>
  );
}

function Rail({ x, y, w }: { x: number; y: number; w: number }) {
  const posts = [0, w * 0.33, w * 0.66, w];
  return (
    <g>
      <rect x={x} y={y - 11} width={w} height={1.6} className={styles.furniture} />
      {posts.map((p, i) => (
        <rect key={i} x={x + p - 0.8} y={y - 11} width={1.6} height={11} className={styles.furniture} />
      ))}
    </g>
  );
}

function Dish({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 1} y={y - 12} width={2} height={12} className={styles.furniture} />
      <circle cx={x} cy={y - 19} r={7} className={styles.furniture} />
      <circle cx={x + 1} cy={y - 19} r={3} className={styles.dishCore} />
    </g>
  );
}

function Skylight({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      <rect x={x} y={y - 9} width={w} height={9} rx={1} className={styles.furniture} />
      <rect x={x + 3} y={y - 6} width={w - 6} height={2} className={styles.panel} />
    </g>
  );
}

function Roof({ b }: { b: Building }) {
  const { x, w, top } = b;
  switch (b.roof) {
    case 0:
      return (
        <g>
          <Tank x={x + 16} y={top - 5} w={28} />
          <Antenna x={x + w - 26} y={top - 5} h={26} />
          <Rail x={x + 56} y={top - 5} w={58} />
        </g>
      );
    case 1:
      return (
        <g>
          <Tank x={x + 18} y={top - 5} w={32} h={18} />
          <Tank x={x + 58} y={top - 5} w={22} h={12} />
          <Skylight x={x + 92} y={top - 5} w={52} />
        </g>
      );
    case 2:
      return (
        <g>
          <Dish x={x + 34} y={top - 5} />
          <Hvac x={x + 76} y={top - 5} w={44} h={14} />
        </g>
      );
    case 3:
      return (
        <g>
          <Tank x={x + 22} y={top - 5} w={36} h={21} />
          <Antenna x={x + 76} y={top - 5} h={40} />
          <Hvac x={x + 118} y={top - 5} w={48} h={16} />
        </g>
      );
    case 4:
      return (
        <g>
          <Tank x={x + 14} y={top - 5} w={30} h={18} />
          <Tank x={x + 52} y={top - 5} w={30} h={18} />
          <Antenna x={x + 106} y={top - 5} h={36} />
          <Hvac x={x + 128} y={top - 5} w={38} h={15} />
        </g>
      );
    default:
      return (
        <g>
          <Tank x={x + 16} y={top - 5} w={26} />
          <Rail x={x + 52} y={top - 5} w={62} />
          <rect x={x + w - 22} y={top - 22} width={3} height={17} className={styles.furniture} />
          <rect x={x + w - 15} y={top - 16} width={3} height={11} className={styles.furniture} />
        </g>
      );
  }
}

/** Solid silhouettes only — no translucent or offset copies anywhere. */
function Bodies({
  list,
  bottom,
  fill,
  shift,
  seed,
}: {
  list: Building[];
  bottom: number;
  fill: string;
  shift: number;
  seed: number;
}) {
  return (
    <>
      {list.map((b, i) => {
        const top = b.top + shift;
        const extent = Math.min(bottom, top + 240);
        return (
          <g key={i}>
            <rect x={b.x} y={top} width={b.w} height={Math.max(0, extent - top)} fill={fill} />
            {seed >= 0 && (
              <g className={styles.furnitureGroup}>
                {/* +7 seats the rooftop gear ON the roofline: attached, never a floating slab */}
                <Roof b={{ ...b, top: top + 7 }} />
              </g>
            )}
          </g>
        );
      })}
    </>
  );
}

/** Windows, drawn after the bodies so each building keeps its own lit grid. */
function Windows({
  list,
  bottom,
  shift,
  seedBase,
  animate,
  wave,
}: {
  list: Building[];
  bottom: number;
  shift: number;
  seedBase: number;
  animate: boolean;
  /** true while the opening light-wave class is mounted on the root svg */
  wave: boolean;
}) {
  return (
    <>
      {list.map((b, i) => {
        const top = b.top + shift;
        const lo = b.w;
        const g = windowGrid({ ...b, top }, bottom, lo);
        const extent = Math.min(bottom, top + 240);
        return (
          <g key={i}>
            {Array.from({ length: g.rows }).map((_, r) =>
              Array.from({ length: g.cols }).map((__, c) => {
                const wx = b.x + g.padX + c * g.pitchX + (g.pitchX - g.winW) / 2;
                const wy = top + g.padTop + r * g.pitchY + (g.pitchY - g.winH) / 2;
                if (wy + g.winH > extent - 0.5) return null;

                const seed = (r * 7 + c * 13 + i * 29 + seedBase) % 11;
                let cls = styles.window;
                if (animate && (seed === 0 || seed === 5)) cls = `${styles.window} ${styles.windowTone}`;
                else if (animate && seed === 3) cls = `${styles.window} ${styles.windowFlicker}`;
                if (wave) cls += ` ${styles.windowWave}`;

                const dur = 18 + ((r + c + i) % 7) * 2;
                const del = -((r * 1.7 + c * 2.3 + i * 3.1) % 14);

                /* Wave timing is a function of the window's x position, so the light
                   genuinely travels left → right. A small deterministic jitter stops it
                   from reading as a hard vertical front: neighbours light at slightly
                   different moments instead of switching all at once. */
                const wdel = Math.round(
                  ((b.x + g.padX + c * g.pitchX) / VIEW_W) * WAVE_TRAVEL_MS +
                    ((r * 3 + c * 5 + i * 7) % 5) * 58,
                );

                return (
                  <rect
                    key={`${r}-${c}`}
                    x={wx}
                    y={wy}
                    width={g.winW}
                    height={g.winH}
                    rx={1.5}
                    className={cls}
                    style={{ '--dur': `${dur}s`, '--d': `${del.toFixed(2)}s`, '--wdel': `${wdel}ms` } as CSSProperties}
                  />
                );
              }),
            )}
          </g>
        );
      })}
    </>
  );
}

export function Skyline() {
  const ref = useRef<SVGSVGElement>(null);
  /* Drives the one-shot opening wave. Fires once, never again on re-scroll. */
  const [wave, setWave] = useState(false);
  const waveFired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const fire = () => {
      if (waveFired.current) return;
      waveFired.current = true;
      setWave(true);
      /* the class is removed after the wave has fully settled, so it can never loop */
      window.setTimeout(() => setWave(false), WAVE_LIFETIME_MS);
    };

    const host = el.closest('section') ?? el.parentElement ?? el;
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            fire();
            io?.disconnect();
          }
        },
        { threshold: 0.25 },
      );
      io.observe(host);
    }
    /* fallback so the wave still plays if the observer never fires */
    const fallback = window.setTimeout(fire, 1000);

    return () => {
      io?.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  /* Scroll parallax: publishes --sk (0..1) on the svg root, throttled by rAF. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const host = el.parentElement ?? el;
      const r = host.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height || 1);
      el.style.setProperty('--sk', Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={ref}
      className={wave ? `${styles.skyline} ${styles.waving}` : styles.skyline}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {/* ——— El Ávila: opaque, coloured close to the sky so it reads as distance ——— */}
      <g className={styles.layerFar}>
        <path
          className={styles.avilaFar}
          transform="translate(800 500) scale(1.14 1.5) translate(-800 -500)"
          d="M0 420 L104 400 L206 414 L300 388 L398 406 L494 370 L586 396 L676 360 L772 384 L868 354 L964 378 L1060 362 L1156 390 L1250 374 L1348 398 L1444 382 L1540 402 L1600 392 L1600 500 L0 500 Z"
        />
        <path
          className={styles.avilaFar}
          transform="translate(800 500) scale(1.14 1.5) translate(-800 -500)"
          d="M0 420 L104 400 L206 414 L300 388 L398 406 L494 370 L586 396 L676 360 L772 384 L868 354 L964 378 L1060 362 L1156 390 L1250 374 L1348 398 L1444 382 L1540 402 L1600 392 L1600 500 L0 500 Z"
        />
        <path
          className={styles.avilaNear}
          transform="translate(800 500) scale(1.14 1.5) translate(-800 -485)"
          d="M0 420 L104 400 L206 414 L300 388 L398 406 L494 370 L586 396 L676 360 L772 384 L868 354 L964 378 L1060 362 L1156 390 L1250 374 L1348 398 L1444 382 L1540 402 L1600 392 L1600 500 L0 500 Z"
        />
      </g>

      {/* ——— Distant plane ——— */}
      <g className={styles.layerFar}>
        <Bodies list={farBuildings} bottom={GROUND} fill={FAR_FILL} shift={TOP_SHIFT} seed={-1} />
        <Windows
          list={farBuildings}
          bottom={GROUND}
          shift={TOP_SHIFT}
          seedBase={41}
          animate={false}
          wave={wave}
        />
      </g>

      {/* ——— Midground ——— */}
      <g className={styles.layerMid}>
        <Bodies list={midBuildings} bottom={GROUND} fill={MID_FILL} shift={TOP_SHIFT} seed={0} />
        <Windows list={midBuildings} bottom={GROUND} shift={TOP_SHIFT} seedBase={0} animate wave={wave} />
      </g>

      {/* ——— Foreground: cropped by the bottom and by the page edges ——— */}
      <g className={styles.layerNear}>
        <Bodies list={nearBuildings} bottom={GROUND + 40} fill={NEAR_FILL} shift={TOP_SHIFT} seed={0} />
        <Windows list={nearBuildings} bottom={GROUND + 40} shift={TOP_SHIFT} seedBase={7} animate wave={wave} />
      </g>

      {/* ——— Street level ——— */}
      <g className={styles.layerNear}>
        {[90, 790, 1550].map((x, i) => (
          <g key={`lamp-${i}`}>
            <rect x={x - 1} y={GROUND - 30} width={2} height={30} className={styles.lamp} />
            <circle cx={x} cy={GROUND - 32} r={3.4} className={styles.lampGlow} />
          </g>
        ))}
      </g>

      <rect className={styles.ground} x="0" y={GROUND} width={VIEW_W} height={VIEW_H - GROUND} />
    </svg>
  );
}
