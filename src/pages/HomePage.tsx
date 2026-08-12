import { Helmet } from 'react-helmet-async';
import { ContactForm } from '../components/ContactForm';
import { SiteFooter } from '../components/SiteFooter';
import { Skyline } from '../components/Skyline';
import { canonicalForPath, getSiteUrl } from '../lib/site';
import styles from './HomePage.module.css';

const folios = [
  {
    apt: 'A-12',
    title: 'Cada bolívar deja rastro',
    text: 'Movimientos con aprobación, comprobante y auditoría. La junta ve el flujo; el propietario ve a dónde fue su cuota.',
  },
  {
    apt: 'B-03',
    title: 'Cobrar sin perseguir',
    text: 'Cuotas por unidad, historial, proyección y recordatorios. La morosidad deja de vivir en una hoja aparte.',
  },
  {
    apt: 'C-07',
    title: 'Proveedores a la vista',
    text: 'Cotizaciones comparables, facturas con PDF y pasivos ligados al movimiento que los liquida.',
  },
  {
    apt: 'PH',
    title: 'Decisiones con quórum',
    text: 'Votaciones con un voto por unidad, documentos publicados y calendario con vencimientos reales.',
  },
];

const stamps = [
  { mark: '01', title: 'Registro', text: 'Correo verificado o Google / Apple. Luego el código del edificio.' },
  { mark: '02', title: 'Aprobación', text: 'La junta activa la cuenta. Sin eso, no hay acceso operativo.' },
  { mark: '03', title: 'Libro vivo', text: 'Movimientos, cuotas, pasivos, facturas y documentos por rol.' },
  { mark: '04', title: 'Día a día', text: 'Notificaciones, calendario, votos y recordatorios en el mismo sitio.' },
];

const faqs = [
  {
    question: '¿Qué pasa después de que envío el formulario?',
    answer:
      'Revisamos tu mensaje y te contactamos por correo para entender tu caso y coordinar una demostración enfocada en tu condominio.',
  },
  {
    question: '¿Cómo manejan mis datos?',
    answer:
      'Usamos tus datos solo para responder esta solicitud comercial. No publicamos ni vendemos información personal.',
  },
  {
    question: '¿Está pensado para la operación en Venezuela?',
    answer:
      'Sí. La plataforma contempla prácticas locales como seguimiento en USD con equivalencia referencial en bolívares según tasa BCV.',
  },
  {
    question: '¿Sirve para junta, administradora y propietarios?',
    answer:
      'Sí. El sistema trabaja por roles y permisos para que cada perfil vea y ejecute lo que le corresponde.',
  },
  {
    question: '¿Podemos empezar con un solo edificio?',
    answer:
      'Sí. Se puede iniciar con un edificio y escalar luego a más unidades o más estructuras dentro de la misma operación.',
  },
  {
    question: '¿Necesito cambiar todo mi proceso desde el primer día?',
    answer:
      'No. Se puede adoptar por etapas, priorizando primero transparencia de movimientos y control de cuotas.',
  },
];

export function HomePage() {
  const siteUrl = getSiteUrl();
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'holaVEcinos',
    url: siteUrl,
    email: 'esucre@holavecinos.app',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'esucre@holavecinos.app',
        contactType: 'sales',
        areaServed: 'VE',
        availableLanguage: ['es'],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>holaVEcinos | El libro claro del condominio</title>
        <meta
          name="description"
          content="holaVEcinos ordena cuotas, pagos, pasivos y decisiones de comunidad para juntas, administradoras y propietarios en Venezuela."
        />
        <link rel="canonical" href={canonicalForPath('/')} />
        <meta property="og:title" content="holaVEcinos | El libro claro del condominio" />
        <meta
          property="og:description"
          content="Transparencia financiera y operación diaria del condominio en un solo entorno."
        />
        <meta property="og:url" content={canonicalForPath('/')} />
        <meta property="og:image" content={`${siteUrl}/og-image.svg`} />
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      </Helmet>

      <header className={styles.topbar}>
        <a href="#contacto" className={styles.topbarCta}>
          Escribirnos
        </a>
        <nav aria-label="Navegación principal" className={styles.topbarNav}>
          <a href="#problema">Problema</a>
          <a href="#folios">Qué hace</a>
          <a href="#ruta">Ruta</a>
          <a href="#faq">FAQ</a>
        </nav>
      </header>

      <main id="contenido-principal">
        <section className={styles.hero} aria-labelledby="brand-title">
          <div className={styles.heroBackdrop}>
            <Skyline />
          </div>

          <div className={styles.heroContent}>
            <p className={styles.localeTag}>Venezuela · solo condominios</p>
            <h1 id="brand-title" className={styles.brandName}>
              hola
              <span className={styles.brandVe}>VE</span>
              cinos
            </h1>
            <p className={styles.heroLine}>
              Mira exactamente a dónde van las cuotas de tu edificio.
            </p>
            <div className={styles.heroCtas}>
              <a className={styles.ctaPrimary} href="#contacto">
                Solicitar contacto
              </a>
              <a className={styles.ctaGhost} href="#folios">
                Ver el libro
              </a>
            </div>
          </div>
        </section>

        <div className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            <span>Sin WhatsApp eterno</span>
            <span>Sin Excel huérfano</span>
            <span>Sin capturas perdidas</span>
            <span>Con rastro auditable</span>
            <span>Sin WhatsApp eterno</span>
            <span>Sin Excel huérfano</span>
            <span>Sin capturas perdidas</span>
            <span>Con rastro auditable</span>
          </div>
        </div>

        <section id="problema" className={styles.problem} aria-labelledby="problema-title">
          <div className={styles.problemSlash}>
            <p className={styles.strike}>grupo del edificio</p>
            <p className={styles.strike}>hoja compartida</p>
            <p className={styles.strike}>“te paso el comprobante”</p>
          </div>
          <div className={styles.problemBody}>
            <p className={styles.eyebrow}>El corte</p>
            <h2 id="problema-title">El condominio no cabe en un chat</h2>
            <p>
              Validar un pago, seguir una deuda o explicar un gasto no debería ser otro trabajo a
              media noche. Hace falta un libro que la junta y los vecinos puedan abrir juntos.
            </p>
          </div>
        </section>

        <section id="folios" className={styles.folios} aria-labelledby="folios-title">
          <div className={styles.foliosHead}>
            <h2 id="folios-title">Qué hace hoy</h2>
            <p>Cuatro pisos del producto. Sin roadmap de fantasía.</p>
          </div>
          <div className={styles.folioRail}>
            {folios.map((folio) => (
              <article key={folio.apt} className={styles.folio}>
                <header className={styles.folioMeta}>
                  <span>Unidad</span>
                  <strong>{folio.apt}</strong>
                </header>
                <h3>{folio.title}</h3>
                <p>{folio.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="ruta" className={styles.ruta} aria-labelledby="ruta-title">
          <h2 id="ruta-title">Cómo entra tu edificio</h2>
          <ol className={styles.stampRow}>
            {stamps.map((stamp) => (
              <li key={stamp.mark} className={styles.stamp}>
                <span className={styles.stampMark} aria-hidden="true">
                  {stamp.mark}
                </span>
                <h3>{stamp.title}</h3>
                <p>{stamp.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.about} aria-labelledby="quienes-title">
          <h2 id="quienes-title">Quiénes somos</h2>
          <p className={styles.aboutTodo}>
            TODO: agregar copy oficial de equipo, historia y enfoque comercial de holaVEcinos.
          </p>
        </section>

        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title">Antes de escribir</h2>
          <div className={styles.faqList}>
            {faqs.map((item, index) => (
              <details key={item.question} className={styles.faqItem}>
                <summary>
                  <span className={styles.faqNum}>{String(index + 1).padStart(2, '0')}</span>
                  {item.question}
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contacto" className={styles.contact} aria-labelledby="contacto-title">
          <div className={styles.contactPane}>
            <p className={styles.eyebrowLight}>Contacto</p>
            <h2 id="contacto-title">Cuéntanos de tu condominio</h2>
            <p>
              Te respondemos a <a href="mailto:esucre@holavecinos.app">esucre@holavecinos.app</a>.
              Sin compromiso de compra en este primer mensaje.
            </p>
          </div>
          <div className={styles.contactFormPane}>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
