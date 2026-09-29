# holaVEcinos (web)

Sitio público de marketing para generación de leads de holaVEcinos.

## Requisitos

- Node.js 18 o superior
- npm

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre `http://localhost:5174`.

El botón **Log In** apunta a la app en `http://localhost:5173/login` (`VITE_APP_URL`).
La app Frontend debe estar corriendo en el puerto 5173.

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto usando `.env.example` como base.

Variables principales:

- `VITE_SITE_URL`: URL canónica del sitio (ejemplo `https://holavecinos.app`)
- `VITE_APP_URL`: origen del frontend de la app (opcional; dev `http://localhost:5173`, producción `https://app.holavecinos.app`)
- `VITE_APP_LOGIN_URL`: opcional; URL completa de login si no es `${VITE_APP_URL}/login`
- `VITE_CONTACT_ENDPOINT`: endpoint del formulario (por defecto `/api/contact`)
- `CONTACT_TO_EMAIL`: correo destino de leads
- `RESEND_API_KEY`: clave API de Resend
- `RESEND_FROM_EMAIL`: remitente validado en Resend
- `CONTACT_RATE_LIMIT_MAX`: máximo de envíos por IP en una ventana
- `CONTACT_RATE_LIMIT_WINDOW_MS`: ventana de rate limit en milisegundos

## Calidad

```bash
npm run check
```

Incluye lint + typecheck.

## Estructura de contenido editable

- Copy principal de la landing: `src/pages/HomePage.tsx`
- Preguntas frecuentes: `src/pages/HomePage.tsx` (constante `faqs`)
- Política de privacidad: `src/pages/PrivacyPage.tsx`
- Secciones del formulario y textos de validación: `src/components/ContactForm.tsx` y `src/lib/contactSchema.ts`
- Tokens visuales (colores, spacing, tipografías): `src/styles/tokens.css`

## Envío del formulario

- Cliente: validación con Zod en `src/lib/contactSchema.ts`
- Servidor: misma validación en `server/contactHandler.ts`
- Endpoint local dev: middleware en `vite.config.ts` (`/api/contact`)
- Endpoint despliegue: función serverless `api/contact.ts`

Incluye:
- validación inline por campo,
- honeypot anti-spam (`website`),
- rate limit simple por IP,
- envío de email al equipo y confirmación en texto plano al prospecto.

## Deploy en Vercel

1. Conecta este directorio como proyecto en Vercel.
2. Define las variables de entorno del `.env.example`.
3. Build command: `npm run build`
4. Output directory: `dist`

Vercel detecta `api/contact.ts` como función serverless para procesar el formulario.

## Documentación

- Audit del app fuente: `docs/app-audit.md`

## TODOs actuales

- Definir copy oficial de sección "Quiénes somos".
- Definir enlaces oficiales de redes sociales para el footer.
- Confirmar dominio final en caso de cambio de `https://holavecinos.app`.
