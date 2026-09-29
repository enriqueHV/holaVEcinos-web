// Cloudflare Pages Function: POST /api/contact.
//
// El sitio se sirve desde Cloudflare Pages, que ignora `api/contact.ts` (esa es una función
// serverless de Vercel). Sin un archivo aquí, /api/contact cae en los assets estáticos y
// responde 405 con el cuerpo vacío, así que el formulario nunca llegaba a enviar nada.
// La lógica (validación Zod, límite por IP, Resend) es la misma de `server/contactHandler.ts`.
import { handleContactRequest, type ContactEnv } from '../../server/contactHandler';

interface PagesContext {
  request: Request;
  env: ContactEnv;
}

export async function onRequest({ request, env }: PagesContext): Promise<Response> {
  const isPost = request.method.toUpperCase() === 'POST';
  // Un cuerpo ilegible se trata como vacío: el handler lo rechaza con 400 y errores por campo.
  const body: unknown = isPost ? await request.json().catch(() => ({})) : {};

  const result = await handleContactRequest({
    method: request.method,
    body,
    ipAddress: request.headers.get('CF-Connecting-IP') ?? 'ip-no-disponible',
    env,
  });

  return new Response(JSON.stringify(result.payload), {
    status: result.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(result.status === 405 ? { Allow: 'POST' } : {}),
    },
  });
}
