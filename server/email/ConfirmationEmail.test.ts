import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { renderConfirmationEmail } from './render';

describe('renderConfirmationEmail', () => {
  it('incluye el nombre y el asunto esperado en HTML y texto', async () => {
    const { subject, html, text } = await renderConfirmationEmail({ name: 'María Pérez' });

    assert.equal(subject, 'Recibimos tu solicitud — HolaVecinos');
    assert.match(html, /María Pérez/);
    // El renderer de texto plano pone los encabezados en mayúsculas.
    assert.match(text, /María Pérez/i);
    assert.match(html, /Recibimos tu solicitud correctamente/);
    assert.match(text, /Recibimos tu solicitud correctamente/);
  });

  it('incluye el preheader (preview text) en el HTML', async () => {
    const { html } = await renderConfirmationEmail({ name: 'María Pérez' });
    assert.match(html, /Recibimos tu solicitud correctamente/);
  });

  it('escapa el nombre en HTML pero lo deja legible en texto plano', async () => {
    const maliciousName = '<script>alert(1)</script>';
    const { html, text } = await renderConfirmationEmail({ name: maliciousName });

    assert.ok(!html.includes('<script>alert(1)</script>'), 'el HTML no debe contener el tag sin escapar');
    assert.match(html, /&lt;script&gt;/i);
    assert.match(text, /script/i);
  });

  it('produce HTML y texto no vacíos', async () => {
    const { html, text } = await renderConfirmationEmail({ name: 'María Pérez' });
    assert.ok(html.length > 100);
    assert.ok(text.length > 10);
  });
});
