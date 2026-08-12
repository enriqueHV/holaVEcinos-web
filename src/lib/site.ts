export const DEFAULT_SITE_URL = 'https://holavecinos.app';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function getSiteUrl(): string {
  const envValue = import.meta.env.VITE_SITE_URL;
  if (!envValue || typeof envValue !== 'string') return DEFAULT_SITE_URL;

  try {
    const parsed = new URL(envValue);
    return trimTrailingSlash(parsed.toString());
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function canonicalForPath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPath === '/' ? '' : normalizedPath}`;
}
