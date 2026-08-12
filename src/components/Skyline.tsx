import styles from './Skyline.module.css';

/**
 * Decorative Caracas skyline — Cerro El Ávila + recognizable towers.
 * Flat fills, sparse lit windows, no strokes (matches former hero-facade style).
 */
export function Skyline() {
  return (
    <svg
      className={styles.root}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="skyline-dusk" x1="0" y1="0" x2="0.28" y2="1">
          <stop offset="0%" stopColor="var(--surface-sky)" />
          <stop offset="42%" stopColor="var(--surface-inverse-raised)" />
          <stop offset="100%" stopColor="var(--surface-inverse)" />
        </linearGradient>
        <linearGradient id="skyline-glow" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
          <stop offset="55%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#skyline-dusk)" />
      <rect width="1600" height="900" fill="url(#skyline-glow)" />

      {/* Cerro El Ávila — dominant ridge behind the city */}
      <path
        fill="var(--surface-ridge-deep)"
        d="M0 430
           C120 410 200 360 280 340
           C360 318 420 300 520 285
           C640 268 720 255 820 248
           C940 238 1040 255 1140 280
           C1240 305 1320 330 1420 355
           C1500 372 1560 390 1600 400
           V900 H0 Z"
      />
      <path
        fill="var(--surface-ridge)"
        d="M0 470
           C140 455 240 400 340 375
           C460 345 560 320 680 310
           C820 298 940 310 1060 340
           C1180 370 1280 400 1400 425
           C1500 442 1560 455 1600 462
           V900 H0 Z"
      />

      {/* Hotel Humboldt — small ridge lodge + mast on Ávila */}
      <g fill="var(--surface-inverse-muted)">
        <rect x="760" y="248" width="52" height="28" />
        <rect x="772" y="236" width="28" height="14" />
        <rect x="784" y="214" width="4" height="24" />
        <rect x="780" y="210" width="12" height="5" />
      </g>
      <rect
        className={styles.windowPulse}
        x="778"
        y="254"
        width="8"
        height="8"
        fill="var(--accent-warm)"
        opacity="0.7"
      />

      {/* Distant mid-rise fill (left of Parque Central) */}
      <g fill="var(--surface-building)">
        <rect x="40" y="520" width="48" height="200" />
        <rect x="96" y="490" width="36" height="230" />
        <rect x="140" y="540" width="56" height="180" />
        <rect x="204" y="505" width="42" height="215" />
        <rect x="255" y="555" width="70" height="165" />
      </g>

      {/* Torres de Parque Central — twin towers + complejo podium */}
      <g fill="var(--surface-inverse-muted)">
        {/* podium / Complejo Parque Central */}
        <rect x="330" y="580" width="280" height="140" />
        <rect x="350" y="560" width="80" height="20" />
        <rect x="510" y="560" width="80" height="20" />
        {/* twin shafts */}
        <rect x="360" y="250" width="72" height="330" />
        <rect x="508" y="250" width="72" height="330" />
        {/* crown caps */}
        <rect x="354" y="238" width="84" height="14" />
        <rect x="502" y="238" width="84" height="14" />
      </g>
      {/* Parque Central windows — sparse */}
      <g fill="var(--accent)" opacity="0.75">
        <rect className={styles.windowPulse} x="374" y="280" width="14" height="18" />
        <rect x="398" y="280" width="14" height="18" opacity="0.35" />
        <rect x="374" y="340" width="14" height="18" opacity="0.45" />
        <rect className={styles.windowPulseLate} x="398" y="400" width="14" height="18" fill="var(--accent-warm)" />
        <rect x="374" y="460" width="14" height="18" opacity="0.55" />
        <rect x="522" y="300" width="14" height="18" opacity="0.4" />
        <rect className={styles.windowPulse} x="546" y="300" width="14" height="18" />
        <rect x="522" y="380" width="14" height="18" fill="var(--accent-secondary-bright)" opacity="0.5" />
        <rect x="546" y="440" width="14" height="18" opacity="0.65" />
        <rect x="522" y="500" width="14" height="18" fill="var(--accent-warm)" opacity="0.45" />
      </g>

      {/* Center mid-rises between complexes */}
      <g fill="var(--surface-building)">
        <rect x="640" y="470" width="58" height="250" />
        <rect x="708" y="430" width="44" height="290" />
        <rect x="762" y="500" width="66" height="220" />
        <rect x="838" y="455" width="50" height="265" />
        <rect x="898" y="520" width="72" height="200" />
      </g>
      <g fill="var(--accent)" opacity="0.4">
        <rect x="656" y="500" width="12" height="14" />
        <rect x="720" y="470" width="12" height="14" fill="var(--accent-warm)" opacity="0.6" />
        <rect x="780" y="540" width="12" height="14" opacity="0.5" />
        <rect x="852" y="490" width="12" height="14" fill="var(--accent-secondary-bright)" opacity="0.45" />
      </g>

      {/* Torre BOD / Torres Gemelas de El Recreo — twin pair, right */}
      <g fill="var(--surface-inverse-muted)">
        <rect x="1000" y="300" width="64" height="420" />
        <rect x="1090" y="300" width="64" height="420" />
        <rect x="994" y="288" width="76" height="14" />
        <rect x="1084" y="288" width="76" height="14" />
        {/* linking base */}
        <rect x="1000" y="680" width="154" height="40" />
      </g>
      <g fill="var(--accent)" opacity="0.7">
        <rect className={styles.windowPulseLate} x="1014" y="330" width="14" height="18" />
        <rect x="1038" y="330" width="14" height="18" opacity="0.3" />
        <rect x="1014" y="400" width="14" height="18" fill="var(--accent-warm)" opacity="0.55" />
        <rect x="1038" y="470" width="14" height="18" opacity="0.5" />
        <rect className={styles.windowPulse} x="1014" y="540" width="14" height="18" fill="var(--accent-secondary-bright)" />
        <rect x="1104" y="350" width="14" height="18" opacity="0.45" />
        <rect x="1128" y="350" width="14" height="18" fill="var(--accent-warm)" opacity="0.6" />
        <rect x="1104" y="440" width="14" height="18" opacity="0.35" />
        <rect className={styles.windowPulseLate} x="1128" y="520" width="14" height="18" />
        <rect x="1104" y="600" width="14" height="18" opacity="0.55" />
      </g>

      {/* Far-right mid-rise fill */}
      <g fill="var(--surface-building)">
        <rect x="1200" y="480" width="54" height="240" />
        <rect x="1264" y="440" width="70" height="280" />
        <rect x="1344" y="510" width="48" height="210" />
        <rect x="1402" y="470" width="62" height="250" />
        <rect x="1474" y="530" width="90" height="190" />
      </g>
      <g fill="var(--accent)" opacity="0.45">
        <rect x="1280" y="480" width="12" height="14" />
        <rect x="1418" y="510" width="12" height="14" fill="var(--accent-warm)" opacity="0.55" />
        <rect x="1495" y="560" width="12" height="14" opacity="0.4" />
      </g>

      {/* Foreground strip */}
      <rect x="0" y="720" width="1600" height="6" fill="var(--accent)" opacity="0.32" />
      <rect x="0" y="726" width="1600" height="174" fill="var(--surface-ground)" />
    </svg>
  );
}
