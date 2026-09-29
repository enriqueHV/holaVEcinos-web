import React from 'react';
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { ReactNode } from 'react';
import { emailColors, emailFonts, emailSite } from './tokens';

interface LayoutProps {
  preview: string;
  children: ReactNode;
  /** Optional bulletproof CTA, rendered between content and footer. Neither
   * current template uses this yet — kept for future emails that need one. */
  cta?: { label: string; href: string };
}

const year = new Date().getFullYear();

export function Layout({ preview, children, cta }: LayoutProps) {
  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: '32px 16px',
          backgroundColor: emailColors.cream,
          fontFamily: emailFonts.body,
        }}
      >
        <Container
          style={{
            maxWidth: '600px',
            width: '100%',
            margin: '0 auto',
            backgroundColor: emailColors.paper,
            border: `1px solid ${emailColors.borderSubtle}`,
            borderRadius: '12px',
            padding: '32px',
          }}
        >
          <Section style={{ marginBottom: '24px' }}>
            <Img
              src={emailSite.logoUrl}
              alt="holaVEcinos"
              width={emailSite.logoWidth}
              height={emailSite.logoHeight}
            />
          </Section>

          <Section
            style={{
              fontSize: '16px',
              lineHeight: '1.5',
              color: emailColors.charcoal,
            }}
          >
            {children}
          </Section>

          {cta && (
            <Section style={{ marginTop: '24px' }}>
              {/* Bulletproof button: table + padded link, not an <img>, works with images off. */}
              <table cellPadding={0} cellSpacing={0} role="presentation">
                <tbody>
                  <tr>
                    <td
                      style={{
                        backgroundColor: emailColors.orange,
                        borderRadius: '6px',
                      }}
                    >
                      <a
                        href={cta.href}
                        style={{
                          display: 'inline-block',
                          padding: '12px 20px',
                          fontFamily: emailFonts.body,
                          fontSize: '15px',
                          fontWeight: 700,
                          color: emailColors.charcoal,
                          textDecoration: 'none',
                        }}
                      >
                        {cta.label}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          )}

          <Hr style={{ borderColor: emailColors.borderSubtle, margin: '32px 0 16px' }} />

          <Text style={{ fontSize: '13px', lineHeight: '1.5', color: emailColors.charcoal500, margin: 0 }}>
            {emailSite.supportEmail} ·{' '}
            <a href={emailSite.url} style={{ color: emailColors.charcoal500 }}>
              holavecinos.app
            </a>{' '}
            · © {year} HolaVEcinos
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
