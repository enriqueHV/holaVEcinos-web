import type { CSSProperties } from 'react';
import styles from './HeroDashboard.module.css';

/**
 * Floating product surface for the hero — built in HTML/CSS, never a bitmap.
 *
 * Structure mirrors the real dashboard: financial summary, expense categories
 * and recent movements. Numbers are the same figures shown in the product
 * reference, so what the visitor sees here matches what they get inside.
 */

const resumen = [
  { label: 'Ingresos · sep', value: '$12,450', delta: '+8.2%', trend: 'up' as const },
  { label: 'Egresos · sep', value: '$8,240', delta: '−3.1%', trend: 'down' as const },
  { label: 'Balance del mes', value: '$4,210', delta: '+ $890 vs ago', trend: 'up' as const },
];

const categorias = [
  { name: 'Mantenimiento', amount: '$2,802', pct: 100 },
  { name: 'Servicios', amount: '$2,307', pct: 82 },
  { name: 'Jardinería', amount: '$1,236', pct: 44 },
  { name: 'Seguridad', amount: '$1,154', pct: 41 },
];

const movimientos = [
  { who: 'Ana Torres', note: 'Apto 302 · Torre A', tag: 'Cuota mensual', amount: '+ $85.00', in: true },
  { who: 'Ferretería Márquez', note: 'Bisagras y candado del portón', tag: 'Mantenimiento', amount: '− $342.50', in: false },
  { who: 'Jardines Guaicaipuro', note: 'Poda mensual · área común', tag: 'Jardinería', amount: '− $180.00', in: false },
];

export function HeroDashboard() {
  return (
    <div className={styles.float} aria-hidden="true">
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={styles.headMark} />
          <span className={styles.headTitle}>Residencias Los Robles · Torre A</span>
          <span className={styles.headChip}>Sep 2026</span>
        </div>

        <div className={styles.kpis}>
          {resumen.map((k) => (
            <div key={k.label} className={styles.kpi}>
              <span className={styles.kpiLabel}>{k.label}</span>
              <span className={styles.kpiValue}>{k.value}</span>
              <span className={`${styles.kpiDelta} ${k.trend === 'up' ? styles.up : styles.down}`}>
                {k.delta}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.block}>
          <p className={styles.blockTitle}>Egresos por categoría</p>
          <ul className={styles.bars}>
            {categorias.map((c) => (
              <li key={c.name} className={styles.barRow}>
                <span className={styles.barName}>{c.name}</span>
                <span className={styles.barTrack}>
                  <span
                    className={styles.barFill}
                    style={{ '--w': `${c.pct}%` } as CSSProperties}
                  />
                </span>
                <span className={styles.barAmount}>{c.amount}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.block}>
          <p className={styles.blockTitle}>Movimientos recientes</p>
          <ul className={styles.moves}>
            {movimientos.map((m) => (
              <li key={m.who} className={styles.move}>
                <span className={`${styles.arrow} ${m.in ? styles.arrowIn : styles.arrowOut}`}>
                  {m.in ? '↙' : '↗'}
                </span>
                <span className={styles.moveWho}>
                  <strong>{m.who}</strong>
                  <em>{m.note}</em>
                </span>
                <span className={styles.moveTag}>{m.tag}</span>
                <span className={`${styles.moveAmount} ${m.in ? styles.up : styles.down}`}>
                  {m.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
