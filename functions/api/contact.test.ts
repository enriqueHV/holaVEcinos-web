import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import type { ContactEnv } from '../../server/contactHandler';
import { onRequest } from './contact';

const validBody = {
  name: 'María Pérez',
  email: 'maria@example.com',
  phone: '',
  organizationName: 'Residencias El Parque',
  role: 'junta',
  unitRange: '21-50',
  message: '',
  consent: true,
  website: '',
};

const env: ContactEnv = {
  RESEND_API_KEY: 're_test_key',
  RESEND_FROM_EMAIL: 'holaVEcinos <noreply@example.com>',
  CONTACT_TO_EMAIL: 'leads@example.com',
  CONTACT_RATE_LIMIT_MAX: '1',
};

const realFetch = globalThis.fetch;
let resendCalls: number;

beforeEach(() => {
  resendCalls = 0;
  globalThis.fetch = (async () => {
    resendCalls += 1;
    return new Response(JSON.stringify({ id: 'email_123' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
});

const post = (body: string, ip: string) =>
  onRequest({
    env,
    request: new Request('https://holavecinos.app/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip },
      body,
    }),
  });

describe('Pages Function /api/contact', () => {
  it('atiende POST /api/contact y responde JSON', async () => {
    const response = await post(JSON.stringify(validBody), '198.51.100.10');

    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type') ?? '', /application\/json/);
    assert.equal(((await response.json()) as { ok: boolean }).ok, true);
    assert.equal(resendCalls, 2);
  });

  it('responde 405 JSON (no una página vacía) a métodos distintos de POST', async () => {
    const response = await onRequest({
      env,
      request: new Request('https://holavecinos.app/api/contact', { method: 'GET' }),
    });

    assert.equal(response.status, 405);
    assert.equal(response.headers.get('allow'), 'POST');
    assert.equal(((await response.json()) as { ok: boolean }).ok, false);
  });

  it('un cuerpo que no es JSON válido da 400 con JSON, no un error del servidor', async () => {
    const response = await post('esto no es json', '198.51.100.11');

    assert.equal(response.status, 400);
    assert.equal(((await response.json()) as { ok: boolean }).ok, false);
    assert.equal(resendCalls, 0);
  });

  it('el límite por IP usa CF-Connecting-IP', async () => {
    const first = await post(JSON.stringify(validBody), '198.51.100.12');
    const second = await post(JSON.stringify(validBody), '198.51.100.12');
    const otherVisitor = await post(JSON.stringify(validBody), '198.51.100.13');

    assert.equal(first.status, 200);
    assert.equal(second.status, 429);
    assert.equal(otherVisitor.status, 200);
  });
});
