/**
 * Email design tokens — a subset of `src/styles/tokens.css`, inlined as plain
 * values because email clients can't load the app's CSS Modules / custom
 * properties. Keep hexes in sync with `tokens.css` by hand; there's no build
 * step that shares them across the two.
 */
export const emailColors = {
  orange: '#f27a1a',
  orange600: '#d96712',
  orange700: '#a84c0d',
  orange100: '#fdecd9',
  terracotta: '#c0532e',
  terracotta100: '#f6dfd4',
  slate: '#3e5975',
  slate100: '#dde5ef',

  charcoal: '#2a2e38',
  charcoal500: '#6a6f7c',
  charcoal300: '#a5a9b3',
  cream: '#f8f4ec',
  paper: '#fefcf7',
  white: '#ffffff',

  income: '#22a45a',
  income100: '#d3f1de',
  expense: '#e23d2c',
  expense700: '#a82a1f',
  expense100: '#fdd8d3',
  warning: '#f5b301',
  warning100: '#feedbe',

  /** Outlook doesn't support rgba(); solid equivalents computed over Paper. */
  borderSubtle: '#edebe7',
  borderStrong: '#dddbd7',
} as const;

export const emailFonts = {
  display: "'Space Grotesk', 'Segoe UI', Arial, sans-serif",
  body: "'DM Sans', 'Segoe UI', Arial, sans-serif",
  mono: "'JetBrains Mono', Consolas, 'Courier New', monospace",
} as const;

export const emailSpacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '48px',
} as const;

export const emailSite = {
  url: 'https://holavecinos.app',
  logoUrl: 'https://holavecinos.app/brand/logo-wordmark.png',
  /** Native size 704×93; displayed at 2x-safe intrinsic pixels, scaled down by width/height attrs. */
  logoWidth: 280,
  logoHeight: 37,
  supportEmail: 'info@holavecinos.app',
} as const;
