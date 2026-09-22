import { Heading, Text } from '@react-email/components';
import { Layout } from './Layout';
import { emailColors, emailFonts } from './tokens';

export interface AdminNotificationEmailProps {
  name: string;
  email: string;
  phone: string;
  organizationName: string;
  roleLabel: string;
  unitRangeLabel: string;
  message: string;
  ipAddress: string;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td
        style={{
          padding: '8px 12px 8px 0',
          borderBottom: `1px solid ${emailColors.borderSubtle}`,
          fontSize: '13px',
          fontWeight: 700,
          color: emailColors.charcoal500,
          whiteSpace: 'nowrap',
          verticalAlign: 'top',
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: '8px 0',
          borderBottom: `1px solid ${emailColors.borderSubtle}`,
          fontSize: '14px',
          color: emailColors.charcoal,
        }}
      >
        {value}
      </td>
    </tr>
  );
}

export function AdminNotificationEmail({
  name,
  email,
  phone,
  organizationName,
  roleLabel,
  unitRangeLabel,
  message,
  ipAddress,
}: AdminNotificationEmailProps) {
  return (
    <Layout preview={`Nuevo lead web: ${organizationName}`}>
      <Heading
        as="h1"
        style={{
          margin: '0 0 16px',
          fontFamily: emailFonts.display,
          fontSize: '22px',
          lineHeight: '1.2',
          color: emailColors.charcoal,
        }}
      >
        Nuevo lead desde holavecinos.app
      </Heading>

      <table cellPadding={0} cellSpacing={0} role="presentation" style={{ width: '100%', marginBottom: '20px' }}>
        <tbody>
          <Field label="Nombre" value={name} />
          <Field label="Email" value={email} />
          <Field label="Teléfono" value={phone || 'No indicado'} />
          <Field label="Condominio/Organización" value={organizationName} />
          <Field label="Rol" value={roleLabel} />
          <Field label="Unidades" value={unitRangeLabel} />
          <Field label="Consentimiento de datos" value="Sí" />
          <Field label="IP origen" value={ipAddress} />
        </tbody>
      </table>

      <Text
        style={{
          margin: '0 0 8px',
          fontSize: '13px',
          fontWeight: 700,
          color: emailColors.charcoal500,
        }}
      >
        Mensaje
      </Text>
      <Text style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{message || '(sin mensaje)'}</Text>
    </Layout>
  );
}
