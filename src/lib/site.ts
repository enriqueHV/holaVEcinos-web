export const DEFAULT_SITE_URL = 'https://holavecinos.app';
/** Production origin of the app (login, dashboard), served from its own subdomain. */
export const PRODUCTION_APP_URL = 'https://app.holavecinos.app';
/** Local Vite origin of `holaVEcinos (app)/Frontend` (see that project's RUNNING.md). */
export const LOCAL_APP_URL = 'http://localhost:5173';
export const DEFAULT_APP_URL = import.meta.env.DEV ? LOCAL_APP_URL : PRODUCTION_APP_URL;

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

/** Register / sign-up target. Override with VITE_APP_REGISTER_URL if the app uses another path. */
export function getAppRegisterUrl(): string {
  const envValue = import.meta.env.VITE_APP_REGISTER_URL;
  if (typeof envValue === 'string' && envValue.trim().length > 0) {
    try {
      return new URL(envValue.trim()).toString();
    } catch {
      // fall through to composed default
    }
  }
  return `${getAppUrl()}/register`;
}

export function canonicalForPath(pathname: string): string {
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPath === '/' ? '' : normalizedPath}`;
}
