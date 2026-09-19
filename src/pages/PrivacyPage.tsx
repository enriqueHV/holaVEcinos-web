import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SiteFooter } from '../components/SiteFooter';
import { canonicalForPath } from '../lib/site';
import styles from './PrivacyPage.module.css';

export function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Política de privacidad | holaVEcinos</title>
        <meta
          name="description"
          content="Política de privacidad de holaVEcinos para solicitudes comerciales recibidas desde el sitio web."
        />
        <link rel="canonical" href={canonicalForPath('/privacidad')} />
      </Helmet>

      <main id="contenido-principal" className={styles.main}>
        <div className={styles.content}>
          <p className={styles.backLink}>
            <Link to="/">← Volver al inicio</Link>
          </p>
          <h1>Política de privacidad</h1>
          <p>Última actualización: 10 de agosto de 2026.</p>

          <section>
            <h2>1. Responsable</h2>
            <p>
              El responsable del tratamiento de los datos enviados desde este sitio es <strong>holaVEcinos</strong>.
              Para cualquier consulta puedes escribir a <a href="mailto:enrique@holavecinos.app">enrique@holavecinos.app</a>.
            </p>
          </section>

          <section>
            <h2>2. Datos que recopilamos</h2>
            <p>
              Cuando completas el formulario de contacto, recopilamos los datos que proporcionas: nombre, correo,
              teléfono (opcional), organización, rol, tamaño estimado del condominio, mensaje y consentimiento.
            </p>
          </section>

          <section>
            <h2>3. Finalidad</h2>
            <p>
              Usamos estos datos para atender solicitudes comerciales, responder consultas y coordinar demostraciones
              del producto. No usamos esta información para fines incompatibles con ese objetivo.
            </p>
          </section>

          <section>
            <h2>4. Conservación y acceso</h2>
            <p>
              Conservamos los datos durante el tiempo necesario para gestionar la solicitud y el seguimiento comercial.
              Puedes solicitar actualización o eliminación escribiendo al correo de contacto.
            </p>
          </section>

          <section>
            <h2>5. Transferencias y proveedores</h2>
            <p>
              El envío del formulario utiliza servicios de correo transaccional para entregar el mensaje al equipo de
              holaVEcinos y enviar confirmación al solicitante.
            </p>
          </section>

          <section>
            <h2>6. Contacto</h2>
            <p>
              Si tienes dudas sobre esta política o sobre el tratamiento de tus datos, escribe a{' '}
              <a href="mailto:enrique@holavecinos.app">enrique@holavecinos.app</a>.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
