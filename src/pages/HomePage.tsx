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
    title: 'Aprobación',
    text: 'La junta invita y aprueba a los propietarios del condominio',
  },
  {
    mark: '03',
    title: 'Carga',
    text: 'El administrador sube la información de la propiedad',
  },
  {
    mark: '04',
    title: 'Acceso Total',
    text: '¡Listo! Tienes visibilidad y control 24/7, sin tener que pedir a nadie',
  },
];

/**
 * The four steps as ONE HolaVecinos icon family — not four unrelated marks.
 * Shared rules: a 44-unit grid, one 2px stroke with round caps and joins, simple
 * geometric primitives, charcoal line work with a single restrained orange accent
 * per icon. Each accent carries the ACTION of its step (the lit windows, the
 * seal's check, the upload arrow, the finish flag), so the four read as
 * four beats of the same journey.
 */
function StepIcon({ mark }: { mark: string }) {
  const common = {
    viewBox: '0 0 44 44',
    fill: 'none',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (mark) {
    /* 01 Registro — a building joins, drawn from the same geometry as the skyline towers */
    case '01':
      return (
        <svg {...common} aria-hidden="true">
          <rect className={styles.iconLine} x="15.5" y="7" width="16" height="30" rx="2" />
          <rect className={styles.iconLine} x="6" y="17" width="9.5" height="20" rx="2" />
          <path className={styles.iconAccent} d="M20.5 13h6M20.5 19h6M9.5 23h2.5" />
        </svg>
      );
    /* 02 Aprobación — a seal of approval: a badge (two concentric circles) with a
       single check centred inside it, so the approval reads as official */
    case '02':
      return (
        <svg {...common} aria-hidden="true">
          <circle className={styles.iconLine} cx="22" cy="22" r="15" />
          <circle className={styles.iconLine} cx="22" cy="22" r="10.5" />
          <path className={styles.iconAccent} d="M16.75 22.25l3.6 3.6 7.15-7.6" />
        </svg>
      );
    /* 03 Carga — information goes in: base tray + upload arrow */
    case '03':
      return (
        <svg {...common} aria-hidden="true">
          <path className={styles.iconLine} d="M8 27v5.5a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3V27" />
          <path className={styles.iconAccent} d="M22 31V9M15 16l7-7 7 7" />
        </svg>
      );
    /* 04 Acceso Total — the finish: a flag on a pole standing on the finish line */
    default:
      return (
        <svg {...common} aria-hidden="true">
          <path className={styles.iconLine} d="M15.5 7v30" />
          <path className={styles.iconAccent} d="M15.5 9l14.5 5.5-14.5 5.5z" />
          <path className={styles.iconLine} d="M7.5 37h29" />
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

const flujoDespues = ['La junta registra', 'HolaVecinos muestra', 'El propietario entiende'];

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
    question: '¿Cuáles son las ventajas?',
    answer:
      'HolaVecinos es una plataforma moderna hecha para los propietarios. Nos dimos cuenta de que las plataformas que ya existen no están resolviendo bien dos cosas fundamentales para ellos: la transparencia y la comunicación. HolaVecinos pone esa información en un solo lugar para que los propietarios tengan mayor visibilidad de lo que ocurre en su comunidad.',
  },
  {
    question: '¿Cómo manejan mis datos?',
    answer:
      'Los datos de tu edificio son privados y están protegidos. No vendemos ni publicamos tu información. Además, cada usuario tiene acceso únicamente a la información que le corresponde según su rol y permisos.',
  },
  {
    question: '¿Está pensado para la operación en Venezuela?',
    answer:
      'Sí. La plataforma contempla prácticas locales como seguimiento en USD con equivalencia referencial en bolívares según tasa BCV.',
  },
  {
    question: '¿HolaVecinos es una administradora?',
    answer:
      'No. No somos una administradora: somos el software que las administradoras, las juntas y los propietarios usan para llevar las cuentas y la operación del condominio. Tu administración sigue siendo la tuya; nosotros le damos la plataforma donde todo queda visible y ordenado.',
  },
  {
    question: '¿Los propietarios pueden modificar las cuentas?',
    answer:
      'No. Cada usuario tiene un rol distinto dentro de HolaVecinos. Propietarios, administradores y junta cuentan con permisos diferentes, para que cada uno pueda consultar o gestionar únicamente la información que le corresponde.',
  },
  {
    question: '¿Cómo puedo llevar HolaVecinos a mi edificio?',
    answer:
      'Regístrate para una demo y conversamos con la junta o administración de tu edificio. Revisamos cómo trabajan actualmente, resolvemos sus dudas y los acompañamos durante la puesta en marcha.',
  },
  {
    question: '¿Necesito cambiar todo mi proceso desde el primer día?',
    answer:
      'No. Puedes comenzar poco a poco e incorporar HolaVecinos a tu proceso actual progresivamente, sin tener que cambiar todo desde el primer día.',
  },
];

const HERO_TITLE_LINES = ['Visibilidad total', 'de lo que importa'];

export function HomePage() {
  const siteUrl = getSiteUrl();
  const loginUrl = getAppLoginUrl();
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HolaVecinos',
    url: siteUrl,
    email: 'info@holavecinos.app',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'info@holavecinos.app',
        contactType: 'sales',
        areaServed: 'VE',
        availableLanguage: ['es'],
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>HolaVecinos | Confianza que se ve. Cuentas que cuadran.</title>
        <meta
          name="description"
          content="Toda la información financiera y administrativa, en un solo lugar"
        />
        <link rel="canonical" href={canonicalForPath('/')} />
        <meta property="og:title" content="HolaVecinos | Confianza que se ve. Cuentas que cuadran." />
        <meta
          property="og:description"
          content="Transparencia financiera y operación diaria del condominio en un solo entorno."
        />
        <meta property="og:url" content={canonicalForPath('/')} />
        <meta property="og:image" content={`${siteUrl}/og-image.svg`} />
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
      </Helmet>

      <header className={styles.topbar}>
        <a className={styles.topbarBrand} href="#inicio" aria-label="HolaVecinos, inicio">
          <span className={styles.wordmark}>
            Hola
            <span className={styles.brandVe}>VE</span>
            cinos
          </span>
        </a>
        <nav aria-label="Navegación principal" className={styles.topbarNav}>
          <a href="#cambio">Cambio</a>
          <a href="#pilares">Filosofía</a>
          <a href="#ruta">Cómo comenzar</a>
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
              {HERO_TITLE_LINES[0]}
              <br />
              {HERO_TITLE_LINES[1]}
              <br />
              en tu <span className={styles.heroTitleAccent}>condominio</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Toda la información
              <br />
              financiera y administrativa en un solo lugar
            </p>
            <div className={styles.heroCtas}>
              <a className={styles.ctaPrimary} href="#contacto">
                Registrarse para una demo
              </a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <HeroDashboard />
          </div>
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
              El edificio deja
              <br />
              de preguntar y
              <br />
              empieza a <span className={styles.headAccent}>entender</span>
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
              {/* Stroked vector arrow. strokeWidth is the single weight token for this mark:
                  2.4 gives a shaft of roughly 1/13 of the circle diameter — bold enough to
                  read as a transition, light enough not to compete with the panels.
                  The viewBox min-x of 1 nudges the ink left one unit to offset the
                  arrowhead's optical mass so it sits visually centred in the ring. */}
              <svg
                viewBox="1 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.5 12h14.5" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </div>

            {/* ——— Después ——— */}
            <article className={`${styles.panel} ${styles.panelAfter}`}>
              <header className={styles.panelHead}>
                <p className={styles.panelLabelNow}>Después</p>
                <h3 className={styles.panelTitle}>El modelo HolaVecinos</h3>
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
                <li>La junta registra una vez. HolaVecinos responde por ella</li>
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
            <p className={styles.eyebrow}>Nuestra filosofía</p>
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
            <p className={styles.eyebrow}>Cómo comenzar</p>
            <h2 id="ruta-title">
              Así de fácil es <span className={styles.headAccent}>comenzar</span>
            </h2>
            <p className={styles.rutaLede}>
              Cuatro pasos. Te acompañamos de principio a fin.
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
          </div>
        </section>


        <section id="faq" className={styles.faq} aria-labelledby="faq-title">
          <h2 id="faq-title">
            ¿Alguna <span className={styles.headAccent}>duda</span>?
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
              Te respondemos a <a href="mailto:info@holavecinos.app">info@holavecinos.app</a>.
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
