import React from 'react';
import { Heading, Text } from '@react-email/components';
import { Layout } from './Layout';
import { emailColors, emailFonts } from './tokens';

export interface ConfirmationEmailProps {
  name: string;
}

export function ConfirmationEmail({ name }: ConfirmationEmailProps) {
  return (
    <Layout preview="Recibimos tu solicitud correctamente">
      <Heading
        as="h1"
        style={{
          margin: '0 0 16px',
          fontFamily: emailFonts.display,
          fontSize: '24px',
          lineHeight: '1.2',
          color: emailColors.charcoal,
        }}
      >
        Hola {name},
      </Heading>
      <Text style={{ margin: '0 0 12px' }}>
        Recibimos tu solicitud correctamente. Gracias por tu interés en HolaVecinos.
      </Text>
      <Text style={{ margin: '0 0 12px' }}>
        Ya tenemos tu información y nos pondremos en contacto contigo pronto.
      </Text>
      <Text style={{ margin: 0 }}>Equipo HolaVecinos</Text>
    </Layout>
  );
}
