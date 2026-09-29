import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleContactRequest } from '../server/contactHandler';

const UNEXPECTED_ERROR_PAYLOAD = {
  ok: false as const,
  message: 'No pudimos enviar tu solicitud en este momento. Intenta nuevamente en unos minutos.',
};

function requestIpAddress(request: VercelRequest): string {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() ?? 'ip-no-disponible';
  }
  return request.socket.remoteAddress ?? 'ip-no-disponible';
}

function parseBody(body: unknown): unknown {
  if (typeof body !== 'string') return body;
  if (body.length === 0) return {};
  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const result = await handleContactRequest({
      method: request.method ?? 'GET',
      ipAddress: requestIpAddress(request),
      body: parseBody(request.body),
    });

    response.status(result.status).json(result.payload);
  } catch (error) {
    // Never let an uncaught exception surface to the browser as a failed fetch:
    // the client would show its connection error instead of a real status.
    console.error('[contact] unhandled error', error);
    response.status(500).json(UNEXPECTED_ERROR_PAYLOAD);
  }
}
