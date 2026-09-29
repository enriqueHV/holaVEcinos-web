import React from 'react';
import { render } from '@react-email/render';
import { AdminNotificationEmail, type AdminNotificationEmailProps } from './AdminNotificationEmail';
import { ConfirmationEmail, type ConfirmationEmailProps } from './ConfirmationEmail';

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export async function renderConfirmationEmail(props: ConfirmationEmailProps): Promise<RenderedEmail> {
  const element = <ConfirmationEmail {...props} />;
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { subject: 'Recibimos tu solicitud — HolaVecinos', html, text };
}

export async function renderAdminNotificationEmail(
  props: AdminNotificationEmailProps,
): Promise<RenderedEmail> {
  const element = <AdminNotificationEmail {...props} />;
  const [html, text] = await Promise.all([render(element), render(element, { plainText: true })]);
  return { subject: `Nuevo lead web: ${props.organizationName}`, html, text };
}
