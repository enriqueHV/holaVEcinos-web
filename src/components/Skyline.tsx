import type { CSSProperties } from 'react';
import styles from './Skyline.module.css';

/**
 * Sunset header skyline — live SVG, never a bitmap.
 *
 * Six dark charcoal silhouettes with glowing orange windows, rooftop
 * furniture (water tanks, antennas, HVAC, a dish, railings, a skylight),
 * low mountains and a hazy distant city behind them.
 *
 * The sky is NOT painted here: the hero gradient shows through, so the
 * backdrop stays fluid at any aspect ratio.
 *
 * Every hover on a building sends a wave of light up its windows.
 * Nothing here is raster: no background-image, no <image>, no PNG.
 */

const VIEW_W = 1600;
const VIEW_H = 340;
const GROUND = 310;

type Building = { x: number; w: number; top: number; roof: number };

/** Left → right, matching the reference rhythm: low, tall, low, tallest, tall, shortest. */
const buildings: Building[] = [
  { x: 180, w: 145, top: 196, roof: 0 },
  { x: 378, w: 175, top: 104, roof: 1 },
  { x: 606, w: 150, top: 176, roof: 2 },
  { x: 809, w: 185, top: 30, roof: 3 },
  { x: 1047, w: 175, top: 64, roof: 4 },
  { x: 1275, w: 145, top: 186, roof: 5 },
];

const PAD_X = 13;
const PAD_TOP = 30;
const PAD_BOTTOM = 12;

function windowGrid(b: Building) {
  const cols = Math.max(3, Math.floor((b.w - PAD_X * 2) / 31));
  const rows = Math.max(3, Math.floor((GROUND - b.top - PAD_TOP - PAD_BOTTOM) / 25));
  const pitchX = (b.w - PAD_X * 2) / cols;
  const pitchY = (GROUND - b.top - PAD_TOP - PAD_BOTTOM) / rows;
  const winW = Math.min(16, pitchX - 11);
  const winH = Math.min(15, pitchY - 9);
  return { cols, rows, pitchX, pitchY, winW, winH };
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
          <Rail x={x + 18} y={top - 24} w={126} />
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

export function Skyline() {
  return (
    <svg
      className={styles.skyline}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="hv-win-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc257" />
          <stop offset="1" stopColor="#ffa025" />
        </linearGradient>
      </defs>

      {/* Low mountains behind the city */}
      <path
        className={styles.ridgeFar}
        d="M0 236 L110 196 L205 224 L330 178 L430 212 L560 186 L700 220 L830 190 L980 226 L1120 194 L1260 222 L1400 188 L1520 218 L1600 202 L1600 340 L0 340 Z"
      />
      <path
        className={styles.ridgeNear}
        d="M0 268 L140 240 L260 262 L400 232 L540 258 L680 236 L820 264 L960 238 L1100 266 L1240 242 L1380 264 L1500 246 L1600 260 L1600 340 L0 340 Z"
      />

      {/* Hazy distant city */}
      <g className={styles.hazeCity}>
        <rect x="40" y="262" width="26" height="48" />
        <rect x="74" y="276" width="18" height="34" />
        <rect x="100" y="252" width="30" height="58" />
        <rect x="138" y="270" width="20" height="40" />
        <rect x="300" y="258" width="24" height="52" />
        <rect x="332" y="274" width="34" height="36" />
        <rect x="374" y="264" width="18" height="46" />
        <rect x="560" y="266" width="28" height="44" />
        <rect x="596" y="252" width="20" height="58" />
        <rect x="1000" y="260" width="26" height="50" />
        <rect x="1034" y="274" width="32" height="36" />
        <rect x="1210" y="256" width="22" height="54" />
        <rect x="1240" y="270" width="30" height="40" />
        <rect x="1440" y="262" width="26" height="48" />
        <rect x="1476" y="276" width="34" height="34" />
        <rect x="1520" y="266" width="20" height="44" />
      </g>
      <g className={styles.hazeLight}>
        <rect x="46" y="270" width="3" height="4" />
        <rect x="56" y="270" width="3" height="4" />
        <rect x="106" y="262" width="3" height="4" />
        <rect x="116" y="274" width="3" height="4" />
        <rect x="306" y="268" width="3" height="4" />
        <rect x="340" y="284" width="3" height="4" />
        <rect x="602" y="262" width="3" height="4" />
        <rect x="612" y="274" width="3" height="4" />
        <rect x="1006" y="270" width="3" height="4" />
        <rect x="1042" y="284" width="3" height="4" />
        <rect x="1216" y="266" width="3" height="4" />
        <rect x="1446" y="272" width="3" height="4" />
        <rect x="1484" y="286" width="3" height="4" />
      </g>

      {/* Buildings */}
      {buildings.map((b, i) => {
        const { cols, rows, pitchX, pitchY, winW, winH } = windowGrid(b);
        return (
          <g key={i} className={styles.building}>
            <rect x={b.x - 3} y={b.top - 5} width={b.w + 6} height={6} rx={1} className={styles.body} />
            <rect x={b.x} y={b.top} width={b.w} height={GROUND - b.top} className={styles.body} />
            <Roof b={b} />
            <g>
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((__, c) => {
                  const wx = b.x + PAD_X + c * pitchX + (pitchX - winW) / 2;
                  const wy = b.top + PAD_TOP + r * pitchY + (pitchY - winH) / 2;
                  const delay = ((rows - 1 - r) * 0.08).toFixed(2);
                  return (
                    <rect
                      key={`${r}-${c}`}
                      x={wx}
                      y={wy}
                      width={winW}
                      height={winH}
                      rx={1.5}
                      className={styles.window}
                      style={{ '--d': `${delay}s` } as CSSProperties}
                    />
                  );
                }),
              )}
            </g>
          </g>
        );
      })}

      {/* Neighbourhood strip — trees and street lamps between the buildings.
          The city should read as lived-in, not as a spec sheet. */}
      <g>
        {[351, 579, 782, 1020, 1248].map((x, i) => (
          <g key={`tree-${i}`}>
            <rect x={x - 1.5} y={GROUND - 20} width={3} height={20} className={styles.tree} />
            <circle cx={x} cy={GROUND - 27} r={9} className={styles.tree} />
            <circle cx={x - 5.5} cy={GROUND - 23} r={5.5} className={styles.tree} />
            <circle cx={x + 5.5} cy={GROUND - 24} r={5} className={styles.tree} />
          </g>
        ))}
        {[90, 790, 1550].map((x, i) => (
          <g key={`lamp-${i}`}>
            <rect x={x - 1} y={GROUND - 30} width={2} height={30} className={styles.lamp} />
            <circle cx={x} cy={GROUND - 32} r={3.4} className={styles.lampGlow} />
          </g>
        ))}
      </g>

      {/* Street band */}
      <rect className={styles.ground} x="0" y={GROUND} width={VIEW_W} height={VIEW_H - GROUND} />
    </svg>
  );
}
