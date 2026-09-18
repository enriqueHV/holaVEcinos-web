import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { ContactForm } from '../components/ContactForm';
import { SiteFooter } from '../components/SiteFooter';
import { HeroDashboard } from '../components/HeroDashboard';
import { Skyline } from '../components/Skyline';
import { canonicalForPath, getAppLoginUrl, getSiteUrl } from '../lib/site';
import styles from './HomePage.module.css';

const pasos = [
  {
    mark: '01',
    title: 'Registro',
    text: 'Registras tu edificio con nosotros',
  },
  {
    mark: '02',
    title: 'Validación',
    text: 'La junta aprueba a los usuarios',
  },
  {
    mark: '03',
    title: 'Carga',
    text: 'El administrador comienza a subir la información',
  },
  {
    mark: '04',
    title: 'Acceso Total',
    text: '¡Listo! Tienes visibilidad y control 24/7 sin tener que pelear con nadie',
  },
];

/** Light, friendly line icons — one per step. */
function StepIcon({ mark }: { mark: string }) {
  const common = {
    viewBox: '0 0 44 44',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (mark) {
    case '01':
      return (
        <svg {...common} aria-hidden="true">
          <rect x="7" y="13" width="20" height="24" rx="4" />
          <rect x="14" y="27" width="6" height="10" rx="1.5" />
          <path d="M11 20h12" />
          <circle cx="34" cy="13" r="7" />
          <path d="M34 10v6M31 13h6" />
        </svg>
      );
    case '02':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M22 6l12 5v11c0 7-5 11-12 14-7-3-12-7-12-14V11z" />
          <path d="M16 22l4.5 4.5L29 17" />
        </svg>
      );
    case '03':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M13 33a6.5 6.5 0 0 1 1-13 8.5 8.5 0 0 1 16-2 6.5 6.5 0 0 1 1 15z" />
          <path d="M22 36V24" />
          <path d="M17.5 28.5L22 24l4.5 4.5" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="15" cy="15" r="7" />
          <path d="M20 20l14 14" />
          <path d="M28 28l3.5-3.5" />
          <path d="M32 32l3.5-3.5" />
          <path d="M33 8l1.6 3.4L38 13l-3.4 1.6L33 18l-1.6-3.4L28 13l3.4-1.6z" />
        </svg>
      );
  }
}

const ticker = [
  'TRANSPARENCIA REAL',
  'VISIBILIDAD 24/7',
  'DATOS ORDENADOS',
  'GESTIONES RÁPIDAS',
  'FÁCIL Y ÁGIL',
];

const flujoAntes = ['La junta sabe', 'El propietario pregunta', 'La junta explica'];

const flujoDespues = ['La junta registra', 'HolaVEcinos muestra', 'El propietario entiende'];

/** One shared renderer for both sides, so ANTES and DESPUÉS stay perfectly parallel. */
function FlowRow({ steps, tone }: { steps: string[]; tone: 'before' | 'after' }) {
  return (
    <ol className={`${styles.flowRow} ${tone === 'before' ? styles.flowBefore : styles.flowAfter}`}>
      {steps.map((step, i) => (
        <Fragment key={step}>
          <li className={styles.flowPill}>{step}</li>
          {i < steps.length - 1 && (
            <li className={styles.flowArrow} aria-hidden="true">
              →
            </li>
          )}
        </Fragment>
      ))}
    </ol>
  );
}

const pillars = [
  {
    mark: '01',
    title: 'Cuentas Claras',
    kicker: 'Visibilidad total',
    text: 'Ve cada dólar que entra y sale con el porqué. Acceso directo a facturas, proveedores y comprobantes en un solo clic',
  },
  {
    mark: '02',
    title: 'Organización Centralizada',
    kicker: 'Cero fricción',
    text: 'Todo el edificio en una sola pantalla. Adiós al ruido de los chats grupales y al cruce de versiones. Un canal ordenado para la gestión, los reportes y las votaciones',
  },
  {
    mark: '03',
    title: 'Propiedad de la Comunidad',
    kicker: 'Tus datos, tus reglas',
    text: 'El software y los datos de tu edificio pertenecen a la comunidad, no a una plataforma externa o a un administrador pasajero. Control total sobre tu patrimonio',
  },
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
    question: '¿HolaVEcinos es una administradora?',
    answer:
      'No. No somos una administradora: somos el software que las administradoras, las juntas y los propietarios usan para llevar las cuentas y la operación del condominio. Tu administración sigue siendo la tuya; nosotros le damos la plataforma donde todo queda visible y ordenado.',
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

const HERO_TITLE = 'Visibilidad completa de lo que importa en tu';

export function HomePage() {
  const siteUrl = getSiteUrl();
  const loginUrl = getAppLoginUrl();
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HolaVEcinos',
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
        <title>HolaVEcinos | Confianza que se ve. Cuentas que cuadran.</title>
        <meta
          name="description"
          content="Toda la información financiera y administrativa de tu condominio, en un solo lugar y siempre disponible."
        />
        <link rel="canonical" href={canonicalForPath('/')} />
        <meta property="og:title" content="HolaVEcinos | Confianza que se ve. Cuentas que cuadran." />
        <meta
          property="og:description"
          content="Transparencia financiera y operación diaria del condominio en un solo entorno."
        />
        <meta property="og:url" content={canonicalForPath('/')} />
        <meta property="og:image" content={`${siteUrl}/og-image.svg`} />
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      </Helmet>

      <header className={styles.topbar}>
        <a className={styles.topbarBrand} href="#inicio" aria-label="HolaVEcinos, inicio">
          <span className={styles.wordmark}>
            Hola
            <span className={styles.brandVe}>VE</span>
            cinos
          </span>
        </a>
        <nav aria-label="Navegación principal" className={styles.topbarNav}>
          <a href="#cambio">Cambio</a>
          <a href="#pilares">Pilares</a>
          <a href="#ruta">Ruta</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className={styles.authGroup}>
          <a href={loginUrl} className={styles.authLogin}>
            Iniciar sesión
          </a>
        </div>
      </header>

      <main id="contenido-principal">
        <section id="inicio" className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <p className={styles.heroEpigraph}>Cuentas Claras, Comunidades Sanas</p>
            <h1 id="hero-title" className={styles.heroTitle}>
              {HERO_TITLE}{' '}
              <span className={styles.heroTitleAccent}>condominio</span>.
            </h1>
            <p className={styles.heroSubtitle}>
              Toda la información financiera y administrativa de tu condominio, en un solo lugar y
              siempre disponible.
            </p>
            <div className={styles.heroCtas}>
              <a className={styles.ctaPrimary} href="#contacto">
                Registrarse para una demo
              </a>
            </div>
          </div>

          <HeroDashboard />
          </div>

          <div className={styles.heroSkyline} aria-hidden="true">
            <Skyline />
          </div>
        </section>

        <div className={styles.marquee} aria-hidden="true">
          <div className={styles.marqueeTrack}>
            {[...ticker, ...ticker, ...ticker].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>

        <section id="cambio" className={styles.cambio} aria-labelledby="cambio-title">
          <div className={styles.cambioHead}>
            <p className={styles.eyebrow}>Antes y después</p>
            <h2 id="cambio-title">
              El edificio deja de preguntar. Empieza a{' '}
              <span className={styles.headAccent}>entender</span>.
            </h2>
          </div>

          <div className={styles.diptych}>
            {/* ——— Antes ——— */}
            <article className={`${styles.panel} ${styles.panelBefore}`}>
              <header className={styles.panelHead}>
                <p className={styles.panelLabel}>Antes</p>
                <h3 className={styles.panelTitle}>El modelo tradicional</h3>
              </header>

              <FlowRow steps={flujoAntes} tone="before" />

              <div className={styles.panelArt} aria-hidden="true">
                {/* Chaos: scattered chats, a spreadsheet, loose sheets, tangled links */}
                <svg viewBox="0 0 520 240" className={styles.chaosSvg}>
                  <g className={styles.tangle}>
                    <path d="M150 62 C 232 18, 250 150, 318 96" />
                    <path d="M120 210 C 190 246, 232 150, 300 120" />
                    <path d="M188 112 C 240 78, 236 176, 296 168" />
                    <path d="M64 44 C 18 108, 96 150, 60 214" />
                  </g>

                  <g className={styles.bubble} transform="rotate(-6 95 51)">
                    <rect x="20" y="24" width="150" height="54" rx="16" />
                    <path d="M44 76 L38 92 L62 76 Z" />
                    <rect className={styles.bubbleLine} x="38" y="42" width="106" height="6" rx="3" />
                    <rect className={styles.bubbleLine} x="38" y="58" width="70" height="6" rx="3" />
                  </g>

                  <g className={styles.bubble} transform="rotate(4 205 112)">
                    <rect x="120" y="86" width="170" height="52" rx="16" />
                    <rect className={styles.bubbleLine} x="138" y="102" width="128" height="6" rx="3" />
                    <rect className={styles.bubbleLine} x="138" y="118" width="84" height="6" rx="3" />
                  </g>

                  <g className={styles.bubble} transform="rotate(-3 106 174)">
                    <rect x="36" y="150" width="140" height="48" rx="16" />
                    <path d="M62 198 L56 212 L80 198 Z" />
                    <rect className={styles.bubbleLine} x="54" y="166" width="96" height="6" rx="3" />
                    <rect className={styles.bubbleLine} x="54" y="182" width="58" height="6" rx="3" />
                  </g>

                  <g className={styles.sheet} transform="rotate(-9 305 202)">
                    <rect x="250" y="176" width="110" height="52" rx="8" />
                    <rect className={styles.sheetLine} x="262" y="190" width="86" height="5" rx="2.5" />
                    <rect className={styles.sheetLine} x="262" y="204" width="60" height="5" rx="2.5" />
                  </g>
                  <g className={styles.sheet} transform="rotate(7 431 205)">
                    <rect x="372" y="182" width="118" height="46" rx="8" />
                    <rect className={styles.sheetLine} x="386" y="196" width="90" height="5" rx="2.5" />
                    <rect className={styles.sheetLine} x="386" y="210" width="54" height="5" rx="2.5" />
                  </g>

                  <g className={styles.ledger} transform="rotate(5 395 100)">
                    <rect x="300" y="30" width="190" height="140" rx="12" />
                    <rect className={styles.ledgerHead} x="300" y="30" width="190" height="26" rx="12" />
                    {[86, 112, 138].map((y) => (
                      <line key={y} className={styles.gridLine} x1="312" y1={y} x2="478" y2={y} />
                    ))}
                    {[352, 396, 440].map((x) => (
                      <line key={x} className={styles.gridLine} x1={x} y1="56" x2={x} y2="170" />
                    ))}
                  </g>

                  <g className={styles.clock}>
                    <circle cx="272" cy="192" r="24" />
                    <line x1="272" y1="192" x2="272" y2="176" />
                    <line x1="272" y1="192" x2="286" y2="198" />
                    <circle cx="272" cy="192" r="2.6" className={styles.clockDot} />
                  </g>
                </svg>
              </div>

              <ul className={styles.painList}>
                <li>La información vive en chats, correos, y sistemas viejos</li>
                <li>La junta explica lo mismo una y otra vez</li>
                <li>El propietario queda sin visibilidad ni control</li>
              </ul>

              <p className={styles.panelOutcome}>
                <span className={styles.outcomeIcon} aria-hidden="true">
                  ✕
                </span>
                Horas de la junta gastadas en repetir. Propietarios con dudas y sin control
              </p>
            </article>

            <div className={styles.diptychArrow} aria-hidden="true">
              <span>→</span>
            </div>

            {/* ——— Después ——— */}
            <article className={`${styles.panel} ${styles.panelAfter}`}>
              <header className={styles.panelHead}>
                <p className={styles.panelLabelNow}>Después</p>
                <h3 className={styles.panelTitle}>El modelo HolaVEcinos</h3>
              </header>

              <FlowRow steps={flujoDespues} tone="after" />

              <div className={styles.panelArt} aria-hidden="true">
                {/* Order: one aligned source of truth, lit windows for the neighbours */}
                <svg viewBox="0 0 520 200" className={styles.orderSvg}>
                  <rect className={styles.orderCard} x="60" y="16" width="400" height="168" rx="14" />
                  {[
                    { y: 48, w: 200, o: 0.35 },
                    { y: 84, w: 230, o: 0.55 },
                    { y: 120, w: 170, o: 0.75 },
                    { y: 156, w: 210, o: 1 },
                  ].map((row) => (
                    <g key={row.y}>
                      <circle className={styles.orderDot} cx="100" cy={row.y} r="6" />
                      <rect
                        className={styles.orderBar}
                        x="120"
                        y={row.y - 7}
                        width={row.w}
                        height="14"
                        rx="7"
                        style={{ opacity: row.o }}
                      />
                    </g>
                  ))}
                  {[0, 1, 2].map((col) =>
                    [0, 1, 2, 3].map((r) => (
                      <rect
                        key={`${col}-${r}`}
                        className={styles.orderWindow}
                        x={378 + col * 22}
                        y={40 + r * 28}
                        width="16"
                        height="20"
                        rx="3"
                      />
                    )),
                  )}
                  <g className={styles.check}>
                    <circle cx="424" cy="176" r="15" />
                    <path d="M417 176 L422 181 L431 170" />
                  </g>
                </svg>
              </div>

              <ul className={styles.gainList}>
                <li>Un solo lugar: movimientos, facturas y votaciones</li>
                <li>La junta registra una vez. HolaVEcinos responde por ella</li>
                <li>El propietario entra cuando quiere y ve todo, sin pedir permiso</li>
              </ul>

              <div className={styles.outcomeRow}>
                <p className={styles.outcomeChip}>
                  <strong>Junta</strong> tiempo recuperado
                </p>
                <p className={styles.outcomeChip}>
                  <strong>Propietarios</strong> control y tranquilidad
                </p>
              </div>
            </article>
          </div>
        </section>

        <section id="pilares" className={styles.pillars} aria-labelledby="pilares-title">
          <div className={styles.pillarsHead}>
            <p className={styles.eyebrow}>Los tres pilares</p>
            <h2 id="pilares-title">
              Hacemos la vida en comunidad <span className={styles.headAccent}>más fácil</span>
            </h2>
          </div>
          <div className={styles.pillarGrid}>
            {pillars.map((pillar) => (
              <article key={pillar.mark} className={styles.pillar}>
                <span className={styles.pillarNum} aria-hidden="true">
                  {pillar.mark}
                </span>
                <h3>{pillar.title}</h3>
                <p className={styles.pillarKicker}>{pillar.kicker}</p>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>


        <section id="ruta" className={styles.ruta} aria-labelledby="ruta-title">
          <div className={styles.rutaHead}>
            <p className={styles.eyebrow}>Tu ruta</p>
            <h2 id="ruta-title">
              Así de fácil es <span className={styles.headAccent}>comenzar</span>
            </h2>
            <p className={styles.rutaLede}>
              Cuatro pasos. Sin manuales, sin reuniones eternas, sin cambiar tu administración.
            </p>
          </div>

          <ol className={styles.steps}>
            {pasos.map((paso) => (
              <li key={paso.mark} className={styles.step}>
                <span className={styles.stepIcon} aria-hidden="true">
                  <StepIcon mark={paso.mark} />
                </span>
                <span className={styles.stepNum} aria-hidden="true">
                  {paso.mark}
                </span>
                <h3 className={styles.stepTitle}>{paso.title}</h3>
                <p className={styles.stepText}>{paso.text}</p>
              </li>
            ))}
          </ol>

          <div className={styles.rutaCta}>
            <a className={styles.ctaPrimary} href="#contacto">
              Registrarse para una demo
            </a>
            <span className={styles.rutaNote}>Te contactamos y lo dejamos andando contigo</span>
          </div>
        </section>


        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title">
            Antes de <span className={styles.headAccent}>escribir</span>
          </h2>
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
            <h2 id="contacto-title">
            Cuéntanos de tu <span className={styles.headAccent}>condominio</span>
          </h2>
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
