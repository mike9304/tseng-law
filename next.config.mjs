const locales = ['ko', 'zh-hant', 'en'];

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
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp']
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

export default nextConfig;
