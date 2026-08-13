import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

async function loadConfig(nodeEnv, cacheKey) {
  const previousNodeEnv = process.env.NODE_ENV;
  const previousSentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  process.env.NODE_ENV = nodeEnv;
  delete process.env.NEXT_PUBLIC_SENTRY_DSN;

  try {
    const loadedConfig = await import(`../next.config.mjs?security-headers=${cacheKey}`);
    return loadedConfig.default;
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }

    if (previousSentryDsn === undefined) {
      delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    } else {
      process.env.NEXT_PUBLIC_SENTRY_DSN = previousSentryDsn;
    }
  }
}

function headerMap(rule) {
  return new Map(rule.headers.map(({ key, value }) => [key, value]));
}

function cspDirectiveTokens(csp, directive) {
  const matchingDirective = csp
    .split(';')
    .map((entry) => entry.trim())
    .find((entry) => entry === directive || entry.startsWith(`${directive} `));
  assert.ok(matchingDirective, `missing ${directive} directive`);
  return matchingDirective.split(/\s+/).slice(1);
}

test('next config uses Vercel-compatible output without changing isolated local builds', () => {
  const source = readFileSync(new URL('../next.config.mjs', import.meta.url), 'utf8');

  assert.match(
    source,
    /process\.env\.NEXT_DIST_DIR\s*\?\?\s*\(process\.env\.VERCEL\s*\?\s*'\.next'\s*:\s*process\.env\.NEXT_DEV\s*\?\s*'\.next-dev'\s*:\s*'\.next-build'\)/u,
  );
});

test('next config scopes hardened production and private-route headers', async () => {
  const productionConfig = await loadConfig('production', 'production');
  const developmentConfig = await loadConfig('development', 'development');
  const productionRules = await productionConfig.headers();
  const developmentRules = await developmentConfig.headers();

  const productionGlobal = productionRules.find(({ source }) => source === '/(.*)');
  const developmentGlobal = developmentRules.find(({ source }) => source === '/(.*)');
  assert.ok(productionGlobal);
  assert.ok(developmentGlobal);

  const productionHeaders = headerMap(productionGlobal);
  const developmentHeaders = headerMap(developmentGlobal);
  const productionCsp = productionHeaders.get('Content-Security-Policy');
  const developmentCsp = developmentHeaders.get('Content-Security-Policy');

  assert.ok(productionCsp);
  assert.ok(developmentCsp);
  assert.doesNotMatch(productionCsp, /'unsafe-eval'/);
  assert.match(developmentCsp, /'unsafe-eval'/);
  assert.match(productionCsp, /script-src[^;]*'unsafe-inline'/);
  assert.match(productionCsp, /frame-ancestors 'self'/);

  const stripeOriginsByDirective = {
    'script-src': ['https://js.stripe.com'],
    'frame-src': ['https://hooks.stripe.com', 'https://js.stripe.com'],
    'connect-src': ['https://api.stripe.com'],
  };
  for (const [directive, expectedOrigins] of Object.entries(stripeOriginsByDirective)) {
    const actualOrigins = cspDirectiveTokens(productionCsp, directive)
      .filter((token) => token.includes('stripe.com'))
      .sort();
    assert.deepEqual(actualOrigins, expectedOrigins);
  }

  for (const origin of [
    'https://www.youtube.com',
    'https://player.vimeo.com',
    'https://www.google.com',
    'https://maps.google.com',
    'https://lottie.host',
    'https://lottiefiles.com',
  ]) {
    assert.ok(productionCsp.includes(origin), `CSP must retain ${origin}`);
  }

  assert.equal(
    productionHeaders.get('Strict-Transport-Security'),
    'max-age=31536000',
  );
  assert.equal(developmentHeaders.has('Strict-Transport-Security'), false);
  assert.equal(productionHeaders.get('X-Frame-Options'), 'SAMEORIGIN');
  assert.equal(productionHeaders.get('X-Content-Type-Options'), 'nosniff');
  assert.equal(
    productionHeaders.get('Referrer-Policy'),
    'strict-origin-when-cross-origin',
  );
  assert.equal(
    productionHeaders.get('Permissions-Policy'),
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  );
  for (const headers of [productionHeaders, developmentHeaders]) {
    assert.equal(
      headers.get('Cross-Origin-Opener-Policy'),
      'same-origin-allow-popups',
    );
    assert.equal(headers.get('Cross-Origin-Resource-Policy'), 'same-site');
  }

  const expectedSensitiveSources = [
    ...['ko', 'zh-hant', 'en', 'ja'].flatMap((locale) => [
      `/${locale}/account/:path*`,
      `/${locale}/admin-builder/:path*`,
      `/${locale}/admin-consultation/:path*`,
      `/${locale}/bookings/manage/:path*`,
      `/${locale}/login/:path*`,
    ]),
    '/review/:path*',
    '/api/booking/manage/:path*',
    '/api/builder/:path*',
    '/api/consultation/data/:path*',
    '/api/consultation/build-embeddings',
    '/api/consultation/eval',
    '/api/consultation/knowledge',
    '/api/live-chat/:path*',
    '/api/members/:path*',
    '/api/billing-documents/:path*',
  ];
  const sensitiveRules = productionRules.filter(({ headers }) =>
    headers.some(({ key }) => key === 'Cache-Control' || key === 'X-Robots-Tag'),
  );

  assert.deepEqual(
    sensitiveRules.map(({ source }) => source),
    expectedSensitiveSources,
  );
  for (const rule of sensitiveRules) {
    const headers = headerMap(rule);
    assert.equal(headers.get('Cache-Control'), 'private, no-store, max-age=0');
    assert.equal(headers.get('X-Robots-Tag'), 'noindex, noarchive');
  }
});
