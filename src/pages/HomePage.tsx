import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { ContactForm } from '../components/ContactForm';
import { SiteFooter } from '../components/SiteFooter';
import { BUSINESS_EMAIL, BUSINESS_NAME, BUSINESS_PHONE } from '../lib/contact';
import { HeroDashboard } from '../components/HeroDashboard';
import { Skyline } from '../components/Skyline';
import { canonicalForPath, getAppLoginUrl, getSiteUrl } from '../lib/site';
import styles from './HomePage.module.css';

const pasos = [
  {
    mark: '01',
    title: 'REGÍSTRATE',
    text: 'Registra tu condominio con nosotros',
  },
  {
    mark: '02',
    title: 'ORGANIZA',
    text: 'El administrador carga la información del edificio, como saldos y alícuotas',
  },
  {
    mark: '03',
    title: 'INVITA',
    text: 'La junta invita a los propietarios del condominio a través de correo electrónico',
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
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (mark) {
    /* 01 Regístrate — user-plus */
    case '01':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M19 8v6M22 11h-6" />
        </svg>
      );
    /* 02 Organiza — list-checks */
    case '02':
      return (
        <svg {...common} aria-hidden="true">
          <path d="m3 17 2 2 4-4" />
          <path d="m3 7 2 2 4-4" />
          <path d="M13 6h8M13 12h8M13 18h8" />
        </svg>
      );
    /* 03 Invita — mail-plus */
    case '03':
      return (
        <svg {...common} aria-hidden="true">
          <path d="M22 13V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h9" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          <path d="M19 16v6M16 19h6" />
        </svg>
      );
    /* the end of the journey — a finish flag */
    default:
      return (
        <svg {...common} aria-hidden="true">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <path d="M4 22v-7" />
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
    title: 'Cuentas Claras',
    kicker: 'Visibilidad total',
    text: 'Ve cada dólar que entra y sale con el porqué. Acceso directo a facturas, proveedores y comprobantes en un solo clic',
  },
  {
    title: 'Organización Centralizada',
    kicker: 'Cero fricción',
    text: 'Todo el edificio en una sola pantalla. Adiós al ruido de los chats grupales y al cruce de versiones. Un canal ordenado para la gestión, los reportes y las votaciones',
  },
  {
    title: 'Propiedad de la Comunidad',
    kicker: 'Tus datos, tus reglas',
    text: 'El software y los datos de tu edificio pertenecen a la comunidad, no a una plataforma externa o a un administrador pasajero. Control total sobre tu patrimonio',
  },
];

const faqs = [
  {
    question: '¿Cuáles son las ventajas?',
    answer:
      'HolaVecinos es un software moderno hecho para los propietarios. Nos dimos cuenta de que las plataformas que ya existen no están resolviendo bien dos cosas fundamentales para ellos: la transparencia y la comunicación. HolaVecinos pone esa información en un solo lugar para que los propietarios tengan mayor visibilidad de lo que ocurre en su comunidad.',
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
  const businessJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: BUSINESS_NAME,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/brand/favicon-512.png`,
          width: 512,
          height: 512,
        },
        email: BUSINESS_EMAIL,
        telephone: BUSINESS_PHONE,
        description:
          'HolaVecinos es un software de gestión para condominios: ordena cuotas, pagos, gastos, saldos y la información financiera de la comunidad en un solo lugar.',
        areaServed: { '@type': 'Country', name: 'Venezuela' },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: BUSINESS_EMAIL,
            telephone: BUSINESS_PHONE,
            availableLanguage: ['es'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: BUSINESS_NAME,
        inLanguage: 'es-VE',
        publisher: { '@id': `${siteUrl}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: 'HolaVecinos | Software para gestionar condominios',
        inLanguage: 'es-VE',
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#software` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${siteUrl}/#software`,
        name: BUSINESS_NAME,
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Condominium management software',
        operatingSystem: 'Web',
        url: siteUrl,
        inLanguage: 'es-VE',
        areaServed: { '@type': 'Country', name: 'Venezuela' },
        publisher: { '@id': `${siteUrl}/#organization` },
        description:
          'Software de gestión para condominios. Ayuda a propietarios, administradores y juntas de condominio a tener claridad sobre cuotas, pagos, gastos, saldos y la información financiera de su comunidad, con la operación del día a día en un solo lugar.',
        featureList: [
          'Seguimiento de cuotas, pagos y gastos',
          'Visibilidad de saldos y de la información financiera de la comunidad',
          'Roles y permisos por usuario (propietario, administrador, junta)',
          'Registro de la operación diaria del condominio',
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        inLanguage: 'es-VE',
        isPartOf: { '@id': `${siteUrl}/#webpage` },
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>HolaVecinos | Software para gestionar condominios</title>
        <meta
          name="description"
          content="Toda la información financiera y administrativa, en un solo lugar"
        />
        <link rel="canonical" href={canonicalForPath('/')} />
        <meta property="og:title" content="HolaVecinos | Software para gestionar condominios" />
        <meta
          property="og:description"
          content="Transparencia financiera y operación diaria del condominio en un solo entorno."
        />
        <meta property="og:url" content={canonicalForPath('/')} />
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <script type="application/ld+json">{JSON.stringify(businessJsonLd)}</script>
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
                strokeWidth={2.0}
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
              <article key={pillar.title} className={styles.pillar}>
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
              Tres pasos. Y estás listo.
            </p>
          </div>

          <div className={styles.journey}>
            <div className={styles.track} aria-hidden="true">
              <span className={styles.trackStart} />
            </div>

            <ol className={styles.steps}>
              {pasos.map((paso, i) => (
                <li
                  key={paso.mark}
                  className={`${styles.step} ${i % 2 === 0 ? styles.stepUp : styles.stepDown}`}
                >
                  <article className={styles.stepCard}>
                    <h3 className={styles.stepTitle}>
                      <span className={styles.stepNum}>{paso.mark}</span> {paso.title}
                    </h3>
                    <p className={styles.stepText}>{paso.text}</p>
                  </article>
                  <span className={styles.node} aria-hidden="true">
                    <StepIcon mark={paso.mark} />
                  </span>
                </li>
              ))}
            </ol>

            <div className={styles.destino}>
              <span className={styles.nodeDestino} aria-hidden="true">
                <StepIcon mark="fin" />
              </span>
              <div className={styles.destinoCard}>
                <div className={styles.destinoHead}>
                  <span className={styles.destinoCheck} aria-hidden="true">
                    ✓
                  </span>
                  <h3 className={styles.destinoTitle}>LISTO</h3>
                </div>
                <p className={styles.destinoText}>
                  Bienvenidos a una comunidad más transparente y organizada
                </p>
              </div>
            </div>
          </div>

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
            {/* the hero's own Caracas/El Ávila skyline — same asset, same treatment */}
            <div className={styles.contactSkyline} aria-hidden="true">
              <Skyline />
            </div>
            <p className={styles.eyebrowLight}>Contacto</p>
            <h2 id="contacto-title">
            Cuéntanos de tu <span className={styles.headAccent}>condominio</span>
          </h2>
            <p>
              Escríbenos a <a href="mailto:info@holavecinos.app">info@holavecinos.app</a>, sin compromiso.
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
