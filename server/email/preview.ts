/**
 * Renders both email templates with sample data to local HTML files for a
 * quick visual check. Run with:
 *   npx tsx --tsconfig tsconfig.node.json server/email/preview.ts
 * Output goes to .email-preview/ (gitignored) — open the files in a browser.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { renderAdminNotificationEmail, renderConfirmationEmail } from './render';

async function main() {
  const outDir = '.email-preview';
  mkdirSync(outDir, { recursive: true });

  const confirmation = await renderConfirmationEmail({ name: 'María Pérez' });
  writeFileSync(`${outDir}/confirmation.html`, confirmation.html, 'utf8');
  writeFileSync(`${outDir}/confirmation.txt`, confirmation.text, 'utf8');

  const admin = await renderAdminNotificationEmail({
    name: 'María Pérez',
    email: 'maria@example.com',
    phone: '0412-1234567',
    organizationName: 'Residencias El Parque',
    roleLabel: 'Junta de condominio',
    unitRangeLabel: '21 a 50 unidades',
    message: 'Nos gustaría agendar una demo para la junta la próxima semana.',
    ipAddress: '203.0.113.5',
  });
  writeFileSync(`${outDir}/admin-notification.html`, admin.html, 'utf8');
  writeFileSync(`${outDir}/admin-notification.txt`, admin.text, 'utf8');

  console.log(`Preview files written to ${outDir}/`);
}

main();
