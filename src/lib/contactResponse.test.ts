import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CONTACT_FALLBACK_EMAIL, readContactResponse } from './contactResponse';

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), { status, headers: { 'content-type': 'application/json' } });

describe('readContactResponse', () => {
  it('un 405 sin cuerpo (endpoint inexistente en el hosting) no se presenta como problema de conexión', async () => {
    const result = await readContactResponse(new Response(null, { status: 405 }));

    assert.equal(result.ok, false);
    assert.match(result.message, /no está disponible/i);
    assert.ok(result.message.includes(CONTACT_FALLBACK_EMAIL));
    assert.doesNotMatch(result.message, /conexión/i);
  });

  it('un 404 sin JSON da el mismo aviso de formulario no disponible', async () => {
    const result = await readContactResponse(new Response('Not found', { status: 404 }));

    assert.equal(result.ok, false);
    assert.match(result.message, /no está disponible/i);
  });

  it('un 200 con HTML (fallback de la SPA) no cuenta como envío exitoso', async () => {
    const result = await readContactResponse(
      new Response('<!doctype html><html></html>', { status: 200, headers: { 'content-type': 'text/html' } }),
    );

    assert.equal(result.ok, false);
  });

  it('un 5xx sin JSON pide reintentar en unos minutos', async () => {
    const result = await readContactResponse(new Response('Bad gateway', { status: 502 }));

    assert.equal(result.ok, false);
    assert.match(result.message, /unos minutos/);
  });

  it('un 429 sin JSON avisa de demasiados intentos', async () => {
    const result = await readContactResponse(new Response(null, { status: 429 }));

    assert.equal(result.ok, false);
    assert.match(result.message, /varios intentos/);
  });

  it('conserva el mensaje y los errores por campo que manda el servidor', async () => {
    const result = await readContactResponse(
      json(400, { ok: false, message: 'Revisa los campos.', fieldErrors: { email: 'Correo inválido.' } }),
    );

    assert.equal(result.ok, false);
    assert.equal(result.message, 'Revisa los campos.');
    assert.deepEqual(!result.ok && result.fieldErrors, { email: 'Correo inválido.' });
  });

  it('devuelve tal cual una respuesta exitosa con su warning', async () => {
    const result = await readContactResponse(json(200, { ok: true, message: 'Enviado.', warning: 'Sin confirmación.' }));

    assert.deepEqual(result, { ok: true, message: 'Enviado.', warning: 'Sin confirmación.' });
  });
});
