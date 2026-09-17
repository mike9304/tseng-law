import { isIP } from 'node:net';
import { AI_INTAKE_MCP_ALLOWED_HOSTS_ENV } from '@/lib/ai-intake/mcp/constants';

const MAX_ENV_CHARS = 2_048;
const MAX_HOSTS = 16;
const MAX_RAW_URL_CHARS = 300;
const DEFAULT_PUBLIC_ORIGIN = 'https://tseng-law.com';
const DNS_LABEL = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)$/;
const PRIVACY_PATH = /^\/(ko|zh-hant|en|ja)\/privacy$/;
const IPV4_LIKE_LABEL = /^(?:\d+|0x[0-9a-f]+)$/i;

function asciiLower(value: string): string {
  let lowered = '';
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    lowered += code >= 65 && code <= 90 ? String.fromCharCode(code + 32) : value[i];
  }
  return lowered;
}

function isIpv4LikeAlias(hostname: string): boolean {
  if (IPV4_LIKE_LABEL.test(hostname)) return true;
  const labels = hostname.split('.');
  return labels.length > 0 && labels.every((label) => IPV4_LIKE_LABEL.test(label));
}

export function isExactHostname(value: string): boolean {
  const hostname = asciiLower(value.trim());
  if (!hostname || hostname.length > 253) return false;
  if (hostname.includes('*') || hostname.includes('/') || hostname.includes(' ')) return false;

  const startsBracket = hostname.startsWith('[');
  const endsBracket = hostname.endsWith(']');
  if (startsBracket || endsBracket) {
    if (!startsBracket || !endsBracket) return false;
    const inner = hostname.slice(1, -1);
    if (!inner || inner.includes('%')) return false;
    return isIP(inner) === 6;
  }

  if (hostname.includes(':')) return false;
  if (isIP(hostname) === 4) return true;
  if (isIpv4LikeAlias(hostname)) return false;
  if (hostname === 'localhost') return true;
  const labels = hostname.split('.');
  if (labels.length < 1 || labels.some((label) => !DNS_LABEL.test(label))) return false;
  return true;
}

function hostnameFromUrl(url: URL): string {
  const hostname = url.hostname;
  if (hostname.startsWith('[') && hostname.endsWith(']')) return asciiLower(hostname);
  if (hostname.includes(':')) return `[${asciiLower(hostname)}]`;
  return asciiLower(hostname);
}

function isNumericPort(value: string): boolean {
  if (!/^[0-9]{1,5}$/.test(value)) return false;
  const port = Number(value);
  return Number.isInteger(port) && port >= 0 && port <= 65_535;
}

function isolateRawAuthority(rest: string): string | null {
  if (rest.startsWith('[')) {
    const close = rest.indexOf(']');
    if (close <= 1) return null;
    let end = close + 1;
    if (rest[end] === ':') {
      end += 1;
      const portStart = end;
      while (end < rest.length && rest[end] >= '0' && rest[end] <= '9') end += 1;
      if (end === portStart) return null;
    }
    const after = rest.slice(end);
    if (after.length > 0 && after[0] !== '/' && after[0] !== '?' && after[0] !== '#') return null;
    return rest.slice(0, end);
  }
  const match = rest.match(/^[^/?#]*/);
  return match ? match[0] : '';
}

function parseRawHostPort(authority: string): { host: string; port: string | null } | null {
  if (!authority || authority.includes('@') || authority.includes('\\') || authority.includes('%')) return null;
  if (/\s/.test(authority)) return null;

  if (authority.startsWith('[')) {
    const close = authority.indexOf(']');
    if (close <= 1 || close !== authority.lastIndexOf(']')) return null;
    const host = authority.slice(0, close + 1);
    const after = authority.slice(close + 1);
    if (!isExactHostname(host)) return null;
    if (after === '') return { host, port: null };
    if (!after.startsWith(':')) return null;
    const port = after.slice(1);
    if (!isNumericPort(port)) return null;
    return { host, port };
  }

  const colon = authority.lastIndexOf(':');
  if (colon >= 0) {
    const host = authority.slice(0, colon);
    const port = authority.slice(colon + 1);
    if (!host || !isNumericPort(port) || !isExactHostname(host)) return null;
    return { host, port };
  }
  if (!isExactHostname(authority)) return null;
  return { host: authority, port: null };
}

function splitConfiguredScheme(trimmed: string): { scheme: 'http' | 'https'; rest: string } | null {
  if (trimmed.includes('\\')) return null;
  if (trimmed.startsWith('//')) return null;

  const explicit = trimmed.match(/^(https?):\/\//i);
  if (explicit) {
    return {
      scheme: asciiLower(explicit[1] ?? '') as 'http' | 'https',
      rest: trimmed.slice(explicit[0].length),
    };
  }
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) return null;
  if (/^(https?):\/(?!\/)/i.test(trimmed)) return null;

  const bareAuthority = isolateRawAuthority(trimmed);
  if (!bareAuthority) return null;
  const bareHost = parseRawHostPort(bareAuthority);
  if (!bareHost) return null;
  const unbracketedHost = bareHost.host.startsWith('[')
    ? bareHost.host.slice(1, -1)
    : bareHost.host;
  const isBareHostAllowed = asciiLower(unbracketedHost) === 'localhost'
    || isIP(unbracketedHost) !== 0
    || unbracketedHost.includes('.');
  if (!isBareHostAllowed) return null;
  return { scheme: 'https', rest: trimmed };
}

function parseConfiguredUrl(raw: string | undefined): URL | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (raw !== trimmed || !trimmed || trimmed.length > MAX_RAW_URL_CHARS) return null;
  if (trimmed.includes('*')) return null;

  const split = splitConfiguredScheme(trimmed);
  if (!split) return null;
  const authority = isolateRawAuthority(split.rest);
  if (!authority) return null;
  const parsedHost = parseRawHostPort(authority);
  if (!parsedHost) return null;

  try {
    const url = new URL(`${split.scheme}://${authority}`);
    if (url.protocol !== `${split.scheme}:`) return null;
    if (url.username || url.password) return null;
    const parsedHostname = hostnameFromUrl(url);
    if (parsedHostname !== asciiLower(parsedHost.host)) return null;
    if (!isExactHostname(parsedHostname)) return null;
    return url;
  } catch {
    return null;
  }
}

function hostnameFromConfiguredValue(raw: string | undefined): string | null {
  const url = parseConfiguredUrl(raw);
  return url ? hostnameFromUrl(url) : null;
}

/** Trusted public origin for OpenAPI/docs/privacy URLs. Never uses the incoming Host header. */
export function getAiIntakePublicOrigin(): string {
  const url = parseConfiguredUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_PUBLIC_ORIGIN);
  if (!url) return DEFAULT_PUBLIC_ORIGIN;
  return url.origin;
}

export function isAiIntakePublicPrivacyUrl(value: string): boolean {
  if (!value || value.length < 8 || value.length > 300) return false;
  if (value !== value.trim() || /[\\%\s]/.test(value)) return false;
  if (value.includes('@') || value.includes('?') || value.includes('#')) return false;
  const strictUrl = parseConfiguredUrl(value);
  if (!strictUrl) return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (url.username || url.password) return false;
    if (url.search !== '' || url.hash !== '') return false;
    if (!PRIVACY_PATH.test(url.pathname)) return false;
    if (strictUrl.origin !== url.origin) return false;
    if (`${url.origin}${url.pathname}` !== value) return false;
    return isExactHostname(hostnameFromUrl(url));
  } catch {
    return false;
  }
}

function collectExactHostnames(raw: string): string[] | null {
  if (raw.length > MAX_ENV_CHARS) return null;
  const hosts: string[] = [];
  for (const token of raw.split(',')) {
    const hostname = asciiLower(token.trim());
    if (!hostname) return null;
    if (!isExactHostname(hostname)) return null;
    if (!hosts.includes(hostname)) hosts.push(hostname);
    if (hosts.length > MAX_HOSTS) return null;
  }
  return hosts.length > 0 ? hosts : null;
}

/**
 * Exact hostname allowlist for MCP Host/Origin checks.
 * Fails closed when `AI_INTAKE_MCP_ALLOWED_HOSTS` is missing, blank, invalid,
 * wildcard, or oversized. Never enables a hardcoded public hostname by itself.
 * After the explicit nonempty exact list is valid, canonical/deployment
 * hostnames from site/deployment env may be combined.
 */
export function getAiIntakeMcpAllowedHostnames(): string[] | null {
  const envRaw = process.env[AI_INTAKE_MCP_ALLOWED_HOSTS_ENV];
  if (envRaw === undefined || envRaw.trim().length === 0) return null;
  const parsed = collectExactHostnames(envRaw);
  if (!parsed || parsed.length === 0) return null;

  const hosts = [...parsed];

  const publicHostname = hostnameFromConfiguredValue(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL,
  );
  if (publicHostname && !hosts.includes(publicHostname)) hosts.push(publicHostname);

  const deploymentHostname = hostnameFromConfiguredValue(
    process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL,
  );
  if (deploymentHostname && !hosts.includes(deploymentHostname)) hosts.push(deploymentHostname);

  if (hosts.length === 0 || hosts.length > MAX_HOSTS) return null;
  return hosts;
}
