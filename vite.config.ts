import 'dotenv/config';
import type { IncomingMessage } from 'node:http';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleContactRequest } from './server/contactHandler';

function readJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    request.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    request.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-contact-api',
      configureServer(server) {
        server.middlewares.use('/api/contact', async (request, response, next) => {
          if (request.method?.toUpperCase() === 'OPTIONS') {
            response.statusCode = 204;
            response.end();
            return;
          }

          if (request.method?.toUpperCase() !== 'POST') {
            next();
            return;
          }

          const body = await readJsonBody(request);
          const result = await handleContactRequest({
            method: request.method ?? 'POST',
            body,
            ipAddress: request.socket.remoteAddress ?? 'ip-no-disponible',
          });

          response.statusCode = result.status;
          response.setHeader('Content-Type', 'application/json; charset=utf-8');
          response.end(JSON.stringify(result.payload));
        });
      },
    },
  ],
  server: {
    // App Frontend uses 5173; keep marketing on 5174 so Log In can open the app.
    port: 5174,
    strictPort: true,
  },
});
