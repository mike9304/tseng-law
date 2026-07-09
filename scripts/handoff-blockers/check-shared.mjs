export const TIMEOUT_MS = 15_000;

export function basicAuth(username, password) {
  return `Basic ${Buffer.from(`${username}:${password}`, 'utf8').toString('base64')}`;
}

export function buildUrl(baseUrl, path) {
  return new URL(path, `${baseUrl}/`).toString();
}

export async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export function statusOk(status) {
  return status >= 200 && status < 400;
}

export function contentType(response) {
  return response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase() || 'none';
}
