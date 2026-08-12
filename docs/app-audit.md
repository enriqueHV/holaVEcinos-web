# Audit de APP (Phase 0)

Fecha: 2026-08-10  
Origen auditado (solo lectura): `holaVEcinos (app)/Frontend` y `holaVEcinos (app)/backend`

## 1) Qué hace el producto hoy (módulos, rutas y roles)

### Frontend (módulos/pantallas reales)

Rutas públicas:
- `/` bienvenida
- `/login`
- `/signup`
- `/auth/oauth/result`
- `/auth/otp`

Rutas autenticadas:
- `/dashboard`
- `/transactions`
- `/transactions/:transactionId`
- `/budget`
- `/liabilities`
- `/dues`
- `/charges` (requiere `charges:write`)
- `/members` (requiere `members:approve`)
- `/voting`
- `/vendors`
- `/documents`
- `/assistant`
- `/notifications`
- `/calendar`
- `/invoices` (requiere `invoices:write`)
- `/guia`

Fuente: `Frontend/src/App.tsx`, `Frontend/src/components/Layout.tsx`.

### Backend (módulos API registrados)

Prefijo común: `/api`
- Auth y seguridad: `auth`, `otp`, `oauth`
- Finanzas: `transactions`, `budgets`, `liabilities`, `charges`, `dues`, `invoices`
- Comunidad: `community` (dashboard, members, units, delinquencies, notifications, audit logs)
- Gobernanza: `proposals` (votaciones), `vendors` (cotizaciones)
- Operación: `documents`, `reminders`, `calendar`, `fx` (tasa BCV), `ai`

Fuente: `backend/src/app.ts` y archivos en `backend/src/routes/*.ts`.

### Roles y permisos existentes hoy

Roles definidos:
- `member`
- `board_admin`
- `treasurer`

Modelo de acceso por permisos (`domain:action`), por ejemplo:
- `transactions:*`, `budgets:*`, `liabilities:*`
- `charges:*`, `dues:read`, `payments:create`, `autopay:manage`
- `proposals:*`, `votes:cast`
- `vendors:*`, `quotes:select`
- `documents:*`, `members:approve`, `audit:read`, `reminders:manage`, `calendar:write`, `invoices:write`, `ai:use`

Fuente: `backend/src/lib/permissions.ts`, `backend/prisma/schema.prisma`.

---

## 2) 8 features reales y “marketing-claimable” (trazables)

1. **Libro de movimientos con aprobaciones y trazabilidad**
   - Hay registro, edición, aprobación/rechazo/marcado, detalle de comprobantes y auditoría por movimiento.
   - Fuentes: `backend/src/routes/transactions.ts`, `backend/src/routes/community.ts`.

2. **Lectura automática de comprobantes (OCR)**
   - El sistema extrae referencia, beneficiario, fecha, monto y confianza desde imagen del comprobante.
   - Fuentes: `backend/src/routes/transactions.ts`, `backend/src/services/receiptExtract.ts`, `backend/src/routes/invoices.ts`.

3. **Gestión de cuotas y pagos por unidad**
   - Resumen de saldo, cargos abiertos, historial de pagos, proyección de deuda, métodos de pago y AutoPay.
   - Fuentes: `backend/src/routes/dues.ts`, `backend/src/services/payments.ts`.

4. **Control de pasivos y acumulaciones**
   - Registro de obligaciones por pagar, estado derivado de vencimiento y flujo para liquidación vinculado a movimientos.
   - Fuentes: `backend/src/routes/liabilities.ts`.

5. **Facturas de servicios con PDF y flujo de pago**
   - Emisión de facturas por edificio, aprobación, anulación, descarga PDF y registro de pago pendiente de aprobación.
   - Fuentes: `backend/src/routes/invoices.ts`, `backend/src/lib/invoicePdf.ts`.

6. **Cotizaciones de proveedores con selección transparente**
   - Alta de proveedores, solicitudes de cotización, ofertas y selección de la oferta ganadora cerrando la solicitud.
   - Fuentes: `backend/src/routes/vendors.ts`.

7. **Votaciones comunitarias con quórum y 1 voto por unidad**
   - Propuestas con ventana de votación, cálculo de participación, cierre con resultado y control “one unit, one ballot”.
   - Fuentes: `backend/src/routes/proposals.ts`.

8. **Comunicación y seguimiento comunitario**
   - Notificaciones in-app, campañas de recordatorios por email/in-app, tracking de apertura, y calendario unificado.
   - Fuentes: `backend/src/routes/reminders.ts`, `backend/src/routes/community.ts`, `backend/src/routes/calendar.ts`.

> Nota: existe también módulo de **Asistente IA** con conversaciones persistidas y respuestas apoyadas en datos del condominio (`backend/src/routes/ai.ts`), pero puede tratarse como claim secundario según posicionamiento comercial.

---

## 3) Assets de marca y tokens reutilizables

### Logo / favicon / identidad gráfica
- **Logo de archivo (svg/png):** no se encontró en el repo.
- **Logotipo usado en UI:** combinación de ícono Font Awesome `fa-building-shield` + texto “holaVEcinos”.
  - Fuentes: `Frontend/src/pages/WelcomePage.tsx`, `Frontend/src/components/Layout.tsx`, `Frontend/src/styles/style.css`.
- **Favicon:** no se encontró `favicon.*` ni `<link rel="icon">` en `Frontend/index.html`.

### Tipografía
- `Literata` (serif) para títulos y `Nunito Sans` (sans) para UI.
- Cargadas desde Google Fonts.
- Fuentes: `Frontend/index.html`, `Frontend/src/styles/tokens.css`.

### Colores y tokens CSS (reales)
- Base:
  - `--paper #f2f4f0`, `--surface #ffffff`, `--ink #1a1f1c`
- Primario:
  - `--pine #1b6b52`, `--pine-deep #0f4a39`, `--pine-soft #d8ebe3`
- Estados:
  - `--ochre #9a6b2f`, `--brick #a33b2b`, `--slate #3d4f5f`
- Serie gráfica:
  - `--chart-1..6`

Fuente: `Frontend/src/styles/tokens.css`.

### Espaciado y radios
- Espaciado `--space-1..8` (4px a 64px)
- Radios `--radius-sm/md/lg` (4/6/8px)
- Fuente: `Frontend/src/styles/tokens.css`.

---

## 4) Stack técnico y convenciones

### Stack detectado
- **Frontend:** React 18 + Vite 6 + TypeScript + React Router 6 + TanStack Query + Chart.js + CSS global + CSS Modules.
- **Backend:** Fastify 5 + TypeScript + Prisma + PostgreSQL + Zod + Resend + Firebase Admin + Tesseract OCR.
- **DB:** PostgreSQL (`provider = "postgresql"`).
- Fuentes: `Frontend/package.json`, `backend/package.json`, `backend/prisma/schema.prisma`.

### Package manager y Node
- Package manager en uso: **npm** (`package-lock.json` v3 en ambos proyectos).
- Versión de Node **no está fijada** en `.nvmrc`/`engines`.
- Requisito mínimo inferido: **Node >=18** (dependencias modernas como esbuild/vite/fastify/prisma).

### Lint/format/typecheck
- No se encontraron configs explícitas de ESLint/Prettier/Biome en el repo actual.
- Sí hay type-safety estricta en TS (`strict`, `noUnusedLocals`, `noUnusedParameters`).
- Scripts frontend: `dev`, `build`, `preview`, `typecheck`.
- Scripts backend: `dev`, `build`, jobs, pruebas OTP/auth y scripts Prisma.

### Convenciones observadas
- Frontend:
  - Componentes/páginas en `PascalCase` (`DashboardPage.tsx`, `LoginPage.tsx`)
  - Utilidades en `camelCase` (`categoryColors.ts`, `chartTheme.ts`)
  - CSS Modules en componentes UI y CSS global para layout.
- Backend:
  - Rutas por dominio en `src/routes/*.ts`
  - Servicios de negocio en `src/services/*.ts`
  - Permisos con convención `recurso:acción` (`transactions:read`, `members:approve`).

---

## Hallazgos clave para marketing (sin inventar)

- El producto **sí está orientado a transparencia financiera y operación de condominio** con módulos activos para movimientos, cuotas, pasivos, facturas, proveedores, votaciones, documentos y recordatorios.
- La identidad visual reutilizable existe como **tokens/fuentes/estilo**, pero **faltan archivos de marca exportables** (logo/favicons listos para web marketing).
- Hay una mezcla nominal `holaVEcinos` vs comentarios heredados `ClearHOA` en CSS/comentarios; la interfaz visible usa `holaVEcinos`.
