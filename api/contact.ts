import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleContactRequest } from '../server/contactHandler';

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
  const result = await handleContactRequest({
    method: request.method ?? 'GET',
    ipAddress: requestIpAddress(request),
    body: parseBody(request.body),
  });

  response.status(result.status).json(result.payload);
}
