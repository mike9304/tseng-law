// Worker for the static tseng-law.com build on Codex (ChatGPT) Sites — packed by sites-pack.mjs.
//
// Sites rejects deploy archives over 256 MiB expanded and the pages alone are ~300 MB, so every page is
// stored gzip-compressed under /__p/ in the assets directory and sent as-is with `Content-Encoding: gzip`.
// Every other file (/_next, /fonts, images, sitemap, robots) is a plain static asset that the host serves
// before this Worker runs. The Worker answers what a static host cannot: redirects, the `/` language
// choice (same rules as src/lib/root-locale-negotiation.ts), clean page URLs, localized 404 pages, and the
// site's security headers on pages. Hosts other than the canonical domain get `X-Robots-Tag: noindex`.

/** Replaced with the build's JSON by sites-pack.mjs. */
const SITE_CONFIG = /*__SITE_CONFIG__*/ null;

export const PAGE_PREFIX = '/__p';

const PRIMARY_ALIASES = new Map([
  ['no', 'nb'],
  ['nn', 'nb'],
  ['tl', 'fil'],
  ['iw', 'he'],
  ['in', 'id'],
]);
const TRADITIONAL_CHINESE_REGIONS = new Set(['tw', 'hk', 'mo']);
const SIMPLIFIED_CHINESE_REGIONS = new Set(['cn', 'sg', 'my']);

/** One BCP 47 tag → a published locale, or null (port of localeForLanguageTag). */
export function localeForLanguageTag(tag, locales) {
  const parts = String(tag).trim().toLowerCase().replace(/_/g, '-').split('-').filter(Boolean);
  const primary = parts[0];
  if (!primary || primary === '*') return null;
  if (primary === 'zh') {
    const subtags = parts.slice(1);
    const hans = locales.includes('zh-hans') ? 'zh-hans' : 'zh-hant';
    if (subtags.includes('hant')) return 'zh-hant';
    if (subtags.includes('hans')) return hans;
    if (subtags.some((s) => TRADITIONAL_CHINESE_REGIONS.has(s))) return 'zh-hant';
    if (subtags.some((s) => SIMPLIFIED_CHINESE_REGIONS.has(s))) return hans;
    return 'zh-hant';
  }
  if (locales.includes(primary)) return primary;
  const alias = PRIMARY_ALIASES.get(primary);
  return alias && locales.includes(alias) ? alias : null;
}

/** The locale `/` opens for this Accept-Language header (port of negotiateRootLocale). */
export function negotiateRootLocale(acceptLanguage, locales, fallback) {
  if (!acceptLanguage) return fallback;
  const tags = String(acceptLanguage)
    .split(',')
    .map((entry, order) => {
      const [rawTag, ...params] = entry.split(';');
      let q = 1;
      for (const param of params) {
        const [key, value] = param.split('=').map((part) => part.trim());
        if (key?.toLowerCase() === 'q') {
          const parsed = Number(value);
          q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 0;
        }
      }
      return { tag: (rawTag ?? '').trim(), q, order };
    })
    .filter(({ tag, q }) => tag.length > 0 && q > 0)
    .sort((a, b) => b.q - a.q || a.order - b.order);
  for (const { tag } of tags) {
    const locale = localeForLanguageTag(tag, locales);
    if (locale) return locale;
  }
  return fallback;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Netlify/Cloudflare `_redirects` semantics: exact paths, `:name` (one segment) and a trailing `*` (`:splat`). */
export function matchRedirect(pathname, redirects) {
  const decoded = safeDecode(pathname);
  const exact = redirects.exact[pathname] ?? redirects.exact[decoded];
  if (exact) return { to: exact[0], status: exact[1] };
  const segments = decoded.split('/');
  for (const [from, to, status] of redirects.patterns) {
    const pattern = from.split('/');
    const params = {};
    let matched = true;
    for (let i = 0; i < pattern.length; i += 1) {
      const part = pattern[i];
      if (part === '*' && i === pattern.length - 1) {
        params.splat = segments.slice(i).join('/');
        break;
      }
      if (i >= segments.length) {
        matched = false;
        break;
      }
      if (part.startsWith(':')) {
        if (!segments[i]) {
          matched = false;
          break;
        }
        params[part.slice(1)] = segments[i];
      } else if (part !== segments[i]) {
        matched = false;
        break;
      }
      if (i === pattern.length - 1 && segments.length !== pattern.length) matched = false;
    }
    if (!matched) continue;
    return { to: to.replace(/:([a-z]+)/gi, (whole, name) => (name in params ? params[name] : whole)), status };
  }
  return null;
}

/** The stored page for a request path: `/` → index, `/ko/about` → ko/about.html, root `.html` files as named. */
export function pageKeyFor(pathname) {
  if (pathname === '/') return '/index.html';
  return pathname.endsWith('.html') ? pathname : `${pathname}.html`;
}

function redirect(location, status, extra = {}) {
  return new Response(null, { status, headers: { Location: location, 'Cache-Control': 'public, max-age=3600', ...extra } });
}

async function fetchPage(env, origin, key) {
  const response = await env.ASSETS.fetch(new Request(new URL(`${PAGE_PREFIX}${key}.gz`, origin)));
  return response.ok ? response : null;
}

function pageResponse(stored, request, config, status, canonical) {
  const headers = new Headers(config.pageHeaders);
  headers.set('Content-Type', 'text/html; charset=utf-8');
  headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
  headers.set('Vary', 'Accept-Encoding');
  if (!canonical) headers.set('X-Robots-Tag', 'noindex');
  if (request.method === 'HEAD') return new Response(null, { status, headers });
  if (/\bgzip\b/i.test(request.headers.get('Accept-Encoding') ?? '')) {
    headers.set('Content-Encoding', 'gzip');
    const etag = stored.headers.get('ETag');
    if (etag) headers.set('ETag', etag);
    return new Response(stored.body, { status, headers, encodeBody: 'manual' });
  }
  return new Response(stored.body.pipeThrough(new DecompressionStream('gzip')), { status, headers });
}

export async function handleRequest(request, env, config) {
  const url = new URL(request.url);
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  if (url.hostname === `www.${config.canonicalHost}`) {
    url.hostname = config.canonicalHost;
    return redirect(url.toString(), 308);
  }
  const canonical = url.hostname === config.canonicalHost;
  const { pathname } = url;
  const notFound = async () => {
    const segment = safeDecode(pathname).split('/')[1] ?? '';
    const key = config.notFoundLocales.includes(segment) ? `/${segment}/404.html` : '/404.html';
    const stored = await fetchPage(env, url.origin, key);
    return stored
      ? pageResponse(stored, request, config, 404, canonical)
      : new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  };

  if (pathname === PAGE_PREFIX || pathname.startsWith(`${PAGE_PREFIX}/`)) return notFound();
  if (pathname === '/') {
    const locale = negotiateRootLocale(request.headers.get('Accept-Language'), config.rootLocales, config.rootFallback);
    return new Response(null, {
      status: 307,
      headers: { Location: `/${locale}${url.search}`, 'Cache-Control': 'private, no-store', Vary: 'Accept-Language' },
    });
  }
  if (pathname.endsWith('/')) return redirect(`${pathname.replace(/\/+$/, '') || '/'}${url.search}`, 308);

  const rule = matchRedirect(pathname, config.redirects);
  if (rule) {
    const target = new URL(rule.to, url.origin);
    if (!target.search && url.search) target.search = url.search;
    return redirect(target.origin === url.origin ? `${target.pathname}${target.search}` : target.toString(), rule.status);
  }

  // `/ko/about.html` and `/ko.html` → the clean URL. Root files such as search-engine verification pages keep their name.
  if (pathname.endsWith('.html')) {
    const clean = pathname.slice(0, -'.html'.length);
    const segment = safeDecode(clean).slice(1);
    if (clean.lastIndexOf('/') > 0 || config.rootLocales.includes(segment)) {
      return (await fetchPage(env, url.origin, `${clean}.html`)) ? redirect(`${clean}${url.search}`, 308) : notFound();
    }
  }

  const stored = await fetchPage(env, url.origin, pageKeyFor(pathname));
  return stored ? pageResponse(stored, request, config, 200, canonical) : notFound();
}

const worker = {
  fetch(request, env) {
    return handleRequest(request, env, SITE_CONFIG);
  },
};

export default worker;
