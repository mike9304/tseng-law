import { withSentryConfig } from '@sentry/nextjs';

const locales = ['ko', 'zh-hant', 'en'];
const distDir = process.env.NEXT_DIST_DIR;

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

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(distDir ? { distDir } : {}),
  reactStrictMode: true,
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://plausible.io https://*.vercel-insights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://*.vercel-storage.com https://*.public.blob.vercel-storage.com",
              "connect-src 'self' https://api.openai.com https://*.vercel-storage.com https://*.public.blob.vercel-storage.com https://www.google-analytics.com",
              "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.google.com https://maps.google.com",
              "media-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
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
