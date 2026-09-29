import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SiteFooter } from '../components/SiteFooter';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Página no encontrada | HolaVEcinos</title>
        <meta
          name="description"
          content="La página que buscas no existe o cambió de dirección. Vuelve al inicio de HolaVEcinos."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <main id="contenido-principal" className={styles.main}>
        <div className={styles.content}>
          <p className={styles.code} aria-hidden="true">
            404
          </p>
          <h1>No encontramos esta página</h1>
          <p className={styles.lead}>
            Es posible que el enlace esté mal escrito o que la página haya cambiado de dirección.
            Puedes volver al inicio y continuar desde ahí.
          </p>
          <p className={styles.actions}>
            <Link to="/" className={styles.homeButton}>
              Volver al inicio
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
