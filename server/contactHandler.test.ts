import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it, mock } from 'node:test';
import { handleContactRequest, type ContactEnv } from './contactHandler';

const validBody = {
  name: 'María Pérez',
  email: 'maria@example.com',
  phone: '0412-1234567',
  organizationName: 'Residencias El Parque',
  role: 'junta',
  unitRange: '21-50',
  message: 'Queremos ver una demo.',
  consent: true,
  website: '',
};

const configuredEnv: ContactEnv = {
  RESEND_API_KEY: 're_test_key',
  RESEND_FROM_EMAIL: 'holaVEcinos <noreply@example.com>',
  CONTACT_TO_EMAIL: 'leads@example.com',
};

type ResendCall = { url: string; body: Record<string, unknown> };

const realFetch = globalThis.fetch;
let calls: ResendCall[];
let respond: (call: ResendCall) => Response;

const resendOk = () =>
  new Response(JSON.stringify({ id: 'email_123' }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });

const resendRejects = () =>
  new Response(
    JSON.stringify({ name: 'validation_error', message: 'The domain is not verified.', statusCode: 422 }),
    { status: 422, headers: { 'content-type': 'application/json' } },
  );

/** Logs propios del handler. El SDK de Resend también loguea, pero solo fuera de producción. */
const handlerLogs = (logged: { mock: { calls: Array<{ arguments: unknown[] }> } }) =>
  logged.mock.calls.filter((call) => String(call.arguments[0]).startsWith('[contact]'));

// Cada test usa su propia IP: el límite por IP vive en memoria del módulo y se compartiría.
let ipCounter = 0;
const freshIp = () => `203.0.113.${++ipCounter}`;

const send = (overrides: Partial<Parameters<typeof handleContactRequest>[0]> = {}) =>
  handleContactRequest({
    method: 'POST',
    body: validBody,
    ipAddress: freshIp(),
    env: configuredEnv,
    ...overrides,
  });

beforeEach(() => {
  calls = [];
  respond = resendOk;
  // El SDK de Resend usa fetch: se intercepta aquí para que ningún test envíe correo de verdad.
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const call = { url: String(input), body: JSON.parse(String(init?.body ?? '{}')) };
    calls.push(call);
    return respond(call);
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = realFetch;
  mock.restoreAll();
});

describe('handleContactRequest', () => {
  it('rechaza métodos distintos de POST con 405', async () => {
    const result = await send({ method: 'GET' });
    assert.equal(result.status, 405);
    assert.equal(result.payload.ok, false);
    assert.equal(calls.length, 0);
  });

  it('responde 400 con errores por campo cuando el cuerpo no es válido', async () => {
    const result = await send({ body: { ...validBody, email: 'no-es-correo', consent: false } });
    assert.equal(result.status, 400);
    assert.ok(!result.payload.ok);
    assert.ok(result.payload.fieldErrors?.email);
    assert.ok(result.payload.fieldErrors?.consent);
    assert.equal(calls.length, 0);
  });

  it('el honeypot responde éxito sin enviar nada', async () => {
    const result = await send({ body: { ...validBody, website: 'https://spam.example' } });
    assert.equal(result.status, 200);
    assert.equal(result.payload.ok, true);
    assert.equal(calls.length, 0);
  });

  it('sin credenciales de Resend en el env recibido responde 500 y no envía', async () => {
    const result = await send({ env: {} });
    assert.equal(result.status, 500);
    assert.ok(!result.payload.ok);
    assert.match(result.payload.message, /no está configurado/i);
    assert.ok(result.payload.message.includes('enrique@holavecinos.app'));
    assert.equal(calls.length, 0);
  });

  it('sin CONTACT_TO_EMAIL el lead va a enrique@holavecinos.app', async () => {
    const { CONTACT_TO_EMAIL: _omitted, ...envWithoutDestination } = configuredEnv;
    void _omitted;

    const result = await send({ env: envWithoutDestination });

    assert.equal(result.status, 200);
    assert.equal(calls[0]?.body.to, 'enrique@holavecinos.app');
  });

  it('envía el lead al destino y la confirmación al prospecto usando el env recibido', async () => {
    const result = await send();
    assert.equal(result.status, 200);
    assert.equal(result.payload.ok, true);

    assert.equal(calls.length, 2);
    assert.equal(calls[0]?.url, 'https://api.resend.com/emails');
    assert.equal(calls[0]?.body.from, 'holaVEcinos <noreply@example.com>');
    assert.equal(calls[0]?.body.to, 'leads@example.com');
    assert.equal(calls[0]?.body.reply_to, 'maria@example.com');
    assert.equal(calls[1]?.body.to, 'maria@example.com');
  });

  it('responde 502 en español si Resend rechaza el correo al equipo, y lo deja en el log', async () => {
    respond = resendRejects;
    const logged = mock.method(console, 'error', () => {});

    const result = await send();

    assert.equal(result.status, 502);
    assert.ok(!result.payload.ok);
    assert.match(result.payload.message, /No pudimos enviar tu solicitud/);
    assert.equal(calls.length, 1);
    const logs = handlerLogs(logged);
    assert.equal(logs.length, 1);
    assert.match(JSON.stringify(logs[0]?.arguments), /validation_error/);
  });

  it('avisa con warning si solo falla la confirmación al prospecto', async () => {
    const logged = mock.method(console, 'error', () => {});
    respond = (call) => (call.body.to === 'maria@example.com' ? resendRejects() : resendOk());

    const result = await send();

    assert.equal(result.status, 200);
    assert.ok(result.payload.ok);
    assert.ok(result.payload.warning);
    assert.equal(handlerLogs(logged).length, 1);
  });

  it('responde 429 al superar el límite por IP configurado en el env', async () => {
    const ipAddress = freshIp();
    const env = { ...configuredEnv, CONTACT_RATE_LIMIT_MAX: '1' };

    const first = await send({ ipAddress, env });
    const second = await send({ ipAddress, env });
    const otherIp = await send({ ipAddress: freshIp(), env });

    assert.equal(first.status, 200);
    assert.equal(second.status, 429);
    assert.equal(otherIp.status, 200);
  });
});
