export const DEFAULT_SITE_URL = 'https://holavecinos.app';
/** Local Vite origin of `holaVEcinos (app)/Frontend` (see that project's RUNNING.md). */
export const DEFAULT_APP_URL = 'http://localhost:5173';

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

export function getAppUrl(): string {
  const envValue = import.meta.env.VITE_APP_URL;
  if (!envValue || typeof envValue !== 'string') return DEFAULT_APP_URL;

  try {
    const parsed = new URL(envValue);
    return trimTrailingSlash(parsed.toString());
  } catch {
    return DEFAULT_APP_URL;
  }
}

export function getAppLoginUrl(): string {
  const envValue = import.meta.env.VITE_APP_LOGIN_URL;
  if (typeof envValue === 'string' && envValue.trim().length > 0) {
    try {
      return new URL(envValue.trim()).toString();
    } catch {
      // fall through to composed default
    }
  }
  return `${getAppUrl()}/login`;
}

export function canonicalForPath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPath === '/' ? '' : normalizedPath}`;
}
