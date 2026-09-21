import type { ContactSubmissionField } from './contactSchema';

/** Buzón que se muestra cuando el formulario no se pudo enviar. */
export const CONTACT_FALLBACK_EMAIL = 'enrique@holavecinos.app';

export type ContactFieldErrors = Partial<Record<ContactSubmissionField, string>>;

export type ContactApiResponse =
  | { ok: true; message: string; warning?: string }
  | { ok: false; message: string; fieldErrors?: ContactFieldErrors };

function isContactApiPayload(value: unknown): value is ContactApiResponse {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { ok?: unknown; message?: unknown };
  return typeof candidate.ok === 'boolean' && typeof candidate.message === 'string';
}

/** Mensaje para respuestas que no traen el JSON del endpoint (hosting, proxy, endpoint ausente). */
function messageForStatus(status: number): string {
  if (status === 404 || status === 405) {
    return `El formulario no está disponible en este momento. Escríbenos a ${CONTACT_FALLBACK_EMAIL}.`;
  }
  if (status === 429) {
    return 'Hemos recibido varios intentos desde tu conexión. Intenta de nuevo más tarde.';
  }
  if (status >= 500) {
    return 'No pudimos enviar tu solicitud en este momento. Intenta nuevamente en unos minutos.';
  }
  return `No pudimos enviar el formulario en este momento. Intenta nuevamente o escríbenos a ${CONTACT_FALLBACK_EMAIL}.`;
}

/**
 * Lee la respuesta de /api/contact sin lanzar. Antes `response.json()` reventaba con cualquier
 * cuerpo que no fuera JSON (un 405 vacío de Cloudflare, una página de error) y el formulario
 * lo contaba como "problema de conexión", ocultando que el endpoint no existía.
 * Solo un JSON con `ok: true` y un estado HTTP 2xx cuenta como envío exitoso: un 200 con HTML
 * (el fallback de la SPA) no debe mostrarle al visitante un "enviado" falso.
 */
export async function readContactResponse(response: Response): Promise<ContactApiResponse> {
  const payload: unknown = await response.json().catch(() => null);

  if (!isContactApiPayload(payload)) {
    return { ok: false, message: messageForStatus(response.status) };
  }

  if (response.ok && payload.ok) return payload;

  return {
    ok: false,
    message: payload.message || messageForStatus(response.status),
    fieldErrors: payload.ok ? undefined : payload.fieldErrors,
  };
}
