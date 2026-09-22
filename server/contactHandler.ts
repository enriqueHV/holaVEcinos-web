import { Resend } from 'resend';
import { ZodError } from 'zod';
import {
  contactSubmissionSchema,
  roleLabelByValue,
  type ContactSubmission,
  type ContactSubmissionField,
  unitRangeLabelByValue,
} from '../src/lib/contactSchema';
import { CONTACT_FALLBACK_EMAIL } from '../src/lib/contactResponse';

/**
 * Variables que lee el handler. Cada runtime las entrega a su manera (`process.env` en Vercel y
 * en dev, `context.env` en Cloudflare Pages Functions, donde `process` no existe), así que el
 * llamador las pasa en vez de que el handler las busque en un global.
 */
export interface ContactEnv {
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_RATE_LIMIT_MAX?: string;
  CONTACT_RATE_LIMIT_WINDOW_MS?: string;
}

interface ContactRequestContext {
  method: string;
  body: unknown;
  ipAddress: string;
  /** Si se omite se usa `process.env` (Vercel y dev). */
  env?: ContactEnv;
}

interface ContactSuccessResponse {
  ok: true;
  message: string;
  warning?: string;
}

interface ContactErrorResponse {
  ok: false;
  message: string;
  fieldErrors?: Partial<Record<ContactSubmissionField, string>>;
}

interface ContactHandlerResult {
  status: number;
  payload: ContactSuccessResponse | ContactErrorResponse;
}

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function envNumber(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const numeric = Number(raw);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function cleanRateLimitStore(now: number): void {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }
}

function consumeRateLimit(
  ipAddress: string,
  env: ContactEnv,
): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now = Date.now();
  cleanRateLimitStore(now);

  const maxRequests = envNumber(env.CONTACT_RATE_LIMIT_MAX, 5);
  const windowMs = envNumber(env.CONTACT_RATE_LIMIT_WINDOW_MS, 60 * 60 * 1000);
  const existing = rateLimitStore.get(ipAddress);

  if (!existing) {
    rateLimitStore.set(ipAddress, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, retryAfterMs: Math.max(1000, existing.resetAt - now) };
  }

  existing.count += 1;
  rateLimitStore.set(ipAddress, existing);
  return { allowed: true };
}

function toFieldErrors(error: ZodError<ContactSubmission>): Partial<Record<ContactSubmissionField, string>> {
  const fieldErrors: Partial<Record<ContactSubmissionField, string>> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key !== 'string') continue;
    if (key in fieldErrors) continue;
    fieldErrors[key as ContactSubmissionField] = issue.message;
  }

  return fieldErrors;
}

function buildInternalNotificationText(submission: ContactSubmission, ipAddress: string): string {
  return [
    'Nuevo lead desde holavecinos.app',
    '',
    `Nombre: ${submission.name}`,
    `Email: ${submission.email}`,
    `Teléfono: ${submission.phone || 'No indicado'}`,
    `Condominio/Organización: ${submission.organizationName}`,
    `Rol: ${roleLabelByValue[submission.role]}`,
    `Unidades: ${unitRangeLabelByValue[submission.unitRange]}`,
    '',
    'Mensaje:',
    submission.message,
    '',
    `Consentimiento de datos: Sí`,
    `IP origen: ${ipAddress}`,
  ].join('\n');
}

function buildProspectConfirmationText(submission: ContactSubmission): string {
  return [
    `Hola ${submission.name},`,
    '',
    'Recibimos tu solicitud correctamente. Gracias por tu interés en HolaVecinos.',
    '',
    'Ya tenemos tu información y nos pondremos en contacto contigo pronto.',
    '',
    'Equipo HolaVecinos',
  ].join('\n');
}

function resolveIpAddress(ipAddress: string): string {
  const normalized = ipAddress.trim();
  return normalized.length > 0 ? normalized : 'ip-no-disponible';
}

export async function handleContactRequest(context: ContactRequestContext): Promise<ContactHandlerResult> {
  if (context.method.toUpperCase() !== 'POST') {
    return {
      status: 405,
      payload: {
        ok: false,
        message: 'Método no permitido.',
      },
    };
  }

  const parsed = contactSubmissionSchema.safeParse(context.body);
  if (!parsed.success) {
    return {
      status: 400,
      payload: {
        ok: false,
        message: 'Revisa los campos marcados e inténtalo de nuevo.',
        fieldErrors: toFieldErrors(parsed.error),
      },
    };
  }

  const submission = parsed.data;
  if (submission.website) {
    // Honeypot activado: responder éxito sin procesar.
    return {
      status: 200,
      payload: {
        ok: true,
        message: 'Gracias. Recibimos tu solicitud.',
      },
    };
  }

  const env = context.env ?? (process.env as ContactEnv);
  const safeIpAddress = resolveIpAddress(context.ipAddress);
  const rateLimit = consumeRateLimit(safeIpAddress, env);
  if (!rateLimit.allowed) {
    const retryInMinutes = Math.ceil(rateLimit.retryAfterMs / 60000);
    return {
      status: 429,
      payload: {
        ok: false,
        message: `Hemos recibido varios intentos desde tu conexión. Intenta de nuevo en ${retryInMinutes} minuto(s).`,
      },
    };
  }

  const resendApiKey = env.RESEND_API_KEY;
  const resendFromEmail = env.RESEND_FROM_EMAIL;
  const destinationEmail = env.CONTACT_TO_EMAIL || CONTACT_FALLBACK_EMAIL;

  if (!resendApiKey || !resendFromEmail) {
    return {
      status: 500,
      payload: {
        ok: false,
        message: `El formulario no está configurado todavía. Escríbenos a ${CONTACT_FALLBACK_EMAIL}.`,
      },
    };
  }

  const resend = new Resend(resendApiKey);
  const leadMessage = await resend.emails.send({
    from: resendFromEmail,
    to: destinationEmail,
    replyTo: submission.email,
    subject: `Nuevo lead web: ${submission.organizationName}`,
    text: buildInternalNotificationText(submission, safeIpAddress),
  });

  if (leadMessage.error) {
    // Resend solo loguea sus errores fuera de producción; sin esto un remitente sin verificar
    // o una clave revocada se vería igual que "todo bien" en los logs del hosting.
    console.error('[contact] Resend rechazó el correo al equipo', {
      name: leadMessage.error.name,
      message: leadMessage.error.message,
    });
    return {
      status: 502,
      payload: {
        ok: false,
        message: 'No pudimos enviar tu solicitud en este momento. Intenta nuevamente en unos minutos.',
      },
    };
  }

  const confirmationMessage = await resend.emails.send({
    from: resendFromEmail,
    to: submission.email,
    subject: 'Recibimos tu solicitud — HolaVecinos',
    text: buildProspectConfirmationText(submission),
  });

  if (confirmationMessage.error) {
    console.error('[contact] Resend rechazó la confirmación al prospecto', {
      name: confirmationMessage.error.name,
      message: confirmationMessage.error.message,
    });
    return {
      status: 200,
      payload: {
        ok: true,
        message: 'Tu solicitud fue enviada correctamente.',
        warning:
          'No pudimos enviar el correo de confirmación automática, pero nuestro equipo sí recibió tu mensaje.',
      },
    };
  }

  return {
    status: 200,
    payload: {
      ok: true,
      message: 'Tu solicitud fue enviada correctamente. Te responderemos por correo.',
    },
  };
}
