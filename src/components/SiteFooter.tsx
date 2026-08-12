import { Link } from 'react-router-dom';
import styles from './SiteFooter.module.css';

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.rule} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.brand}>holaVEcinos</p>
        <div className={styles.meta}>
          <a href="mailto:esucre@holavecinos.app">esucre@holavecinos.app</a>
          <Link to="/privacidad">Política de privacidad</Link>
          <span className={styles.todo}>TODO: redes oficiales</span>
        </div>
        <p className={styles.copy}>© {year} holaVEcinos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
