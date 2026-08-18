import { withSentryConfig } from '@sentry/nextjs';

const locales = ['ko', 'zh-hant', 'en', 'ja'];
const distDir =
  process.env.NEXT_DIST_DIR ??
  (process.env.VERCEL ? '.next' : process.env.NEXT_DEV ? '.next-dev' : '.next-build');
const isProduction = process.env.NODE_ENV === 'production';

const legacyColumnAliases = {
  'gym-injury-lawsuit': 'taiwan-gym-injury-lawsuit',
  'cosmetics-market-entry': 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
  'company-advanced-2': 'taiwan-company-establishment-advanced-2',
  'withdraw-capital': 'withdraw-capital-taiwan-company',
  'logistics-business': 'taiwan-logistics-business-setup',
  'company-location': 'taiwan-company-setup-pitch-location',
  'company-advanced-1': 'taiwan-company-establishment-advanced-1',
  'subsidiary-vs-branch': 'taiwan-company-subsidiary-vs-branch',
  'company-basics': 'taiwan-company-establishment-basics',
  'inheritance-custody': 'taiwan-inheritance-custody-analysis',
  'overtaking-accident': 'taiwan-overtaking-accident-liability',
  'severance-exception': 'taiwan-voluntary-resignation-severance',
  'divorce-qna': 'taiwan-divorce-lawsuit-qna',
  'massage-law': 'taiwan-massage-history-law',
  'mandatory-employment': 'taiwan-mandatory-employment-period',
  'labor-severance': 'taiwan-labor-severance-law',
  'traffic-accident-procedure': 'taiwan-traffic-accident-procedure',
};

const sensitiveRouteSources = [
  ...locales.flatMap((locale) => [
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir,
  reactStrictMode: true,
  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        ignored: [
          '**/runtime-data/**',
          '**/test-results/**',
          '**/playwright-report/**',
          '**/.debug-journal.md',
        ],
      };
    }
    return config;
  },
  images: {
    formats: ['image/avif', 'image/webp']
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js inline bootstrap and the current builder runtime still
              // require `unsafe-inline`. Recommendation: migrate to per-request
              // nonces/hashes, verify every App Router surface, then remove it.
              [
                "script-src 'self' 'unsafe-inline'",
                !isProduction ? "'unsafe-eval'" : '',
                'https://www.googletagmanager.com',
                'https://plausible.io',
                'https://*.vercel-insights.com',
                'https://js.stripe.com',
              ].filter(Boolean).join(' '),
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Allow user-pasted image URLs (logo, hero image, etc.) over
              // HTTPS — a builder lets designers point to any external CDN.
              // `data:` / `blob:` cover inline previews and `https:` is the
              // single broad allow for arbitrary public images.
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.openai.com https://api.stripe.com https://*.vercel-storage.com https://*.public.blob.vercel-storage.com https://www.google-analytics.com",
              // Lottie widget embeds LottieFiles iframes for animation
              // playback (lottie.host / lottiefiles.com); no script-src or
              // connect-src changes needed.
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.google.com https://maps.google.com https://lottie.host https://lottiefiles.com https://js.stripe.com https://hooks.stripe.com",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // 'self' (not 'none'): the builder's preview modal iframes the
              // site's own pages; third-party framing stays blocked.
              "frame-ancestors 'self'",
            ].join('; '),
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Keep same-origin documents isolated without severing the opener
          // relationship required by a current or future OAuth popup flow.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          // Builder previews and first-party media are same-origin/same-site.
          // Third-party maps, videos, and Lottie content load in their own
          // frames, so they do not need cross-origin access to our responses.
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
          ...(isProduction
            ? [{ key: 'Strict-Transport-Security', value: 'max-age=31536000' }]
            : []),
        ],
      },
      ...sensitiveRouteSources.map((source) => ({
        source,
        headers: [
          { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
          { key: 'X-Robots-Tag', value: 'noindex, noarchive' },
        ],
      })),
    ];
  },
  async redirects() {
    const legacyColumnRedirects = locales.flatMap((locale) =>
      Object.entries(legacyColumnAliases).flatMap(([alias, realSlug]) => [
        {
          source: `/${locale}/columns/${alias}`,
          destination: `/${locale}/columns/${realSlug}`,
          permanent: true,
        },
        {
          source: `/${locale}/insights/${alias}`,
          destination: `/${locale}/columns/${realSlug}`,
          permanent: true,
        },
      ])
    );

    const legacyInsightsRedirects = locales.flatMap((locale) => [
      {
        source: `/${locale}/insights`,
        destination: `/${locale}/columns`,
        permanent: true,
      },
      {
        source: `/${locale}/insights/:slug`,
        destination: `/${locale}/columns/:slug`,
        permanent: true,
      },
    ]);

    return [
      {
        source: '/',
        destination: '/ko',
        permanent: true
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.tseng-law.com'
          }
        ],
        destination: 'https://tseng-law.com/:path*',
        permanent: true
      },
      ...legacyColumnRedirects,
      ...legacyInsightsRedirects,
    ];
  }
};

const sentryOptions = {
  silent: !process.env.CI,
  disableLogger: true,
  widenClientFileUpload: false,
};

export default process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryOptions)
  : nextConfig;
