import { Link } from 'react-router-dom';
import styles from './SiteFooter.module.css';
import logoMark from '../assets/brand/logo-mark.png';

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.rule} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.brand}>
          <img src={logoMark} alt="" width={403} height={349} aria-hidden="true" />
          <span className={styles.wordmark}>
            Hola
            <span className={styles.brandVe}>VE</span>
            cinos
          </span>
        </p>
        <div className={styles.meta}>
          <a href="mailto:info@holavecinos.app">info@holavecinos.app</a>
          <Link to="/privacidad">Política de privacidad</Link>
        </div>
        <p className={styles.copy}>© {year} HolaVEcinos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
