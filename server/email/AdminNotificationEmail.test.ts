import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderAdminNotificationEmail } from './render';

const baseProps = {
  name: 'María Pérez',
  email: 'maria@example.com',
  phone: '0412-1234567',
  organizationName: 'Residencias El Parque',
  roleLabel: 'Junta de condominio',
  unitRangeLabel: '21 a 50 unidades',
  message: 'Queremos ver una demo.',
  ipAddress: '203.0.113.5',
};

describe('renderAdminNotificationEmail', () => {
  it('arma el asunto a partir del nombre de la organización', async () => {
    const { subject } = await renderAdminNotificationEmail(baseProps);
    assert.equal(subject, 'Nuevo lead web: Residencias El Parque');
  });

  it('incluye todos los campos enviados en HTML y texto', async () => {
    const { html, text } = await renderAdminNotificationEmail(baseProps);

    for (const value of [
      baseProps.name,
      baseProps.email,
      baseProps.phone,
      baseProps.organizationName,
      baseProps.roleLabel,
      baseProps.unitRangeLabel,
      baseProps.message,
      baseProps.ipAddress,
    ]) {
      assert.ok(html.includes(value), `HTML debe incluir "${value}"`);
      assert.ok(text.includes(value), `texto debe incluir "${value}"`);
    }
  });

  it('usa "No indicado" cuando el teléfono viene vacío', async () => {
    const { html } = await renderAdminNotificationEmail({ ...baseProps, phone: '' });
    assert.match(html, /No indicado/);
  });

  it('escapa campos con HTML embebido en la versión HTML', async () => {
    const malicious = '<img src=x onerror=alert(1)>';
    const { html, text } = await renderAdminNotificationEmail({ ...baseProps, message: malicious });

    assert.ok(!html.includes(malicious), 'el HTML no debe contener el payload sin escapar');
    assert.match(html, /&lt;img/);
    assert.match(text, /img/i);
  });
});
