import Link from 'next/link';
import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { buildTranslationDashboard } from '@/lib/builder/translations/dashboard-model';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';
import TranslationDashboardClient from '@/components/builder/translations/TranslationDashboardClient';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Translation Dashboard',
    description: 'Per-page translation status across all locales.',
    path: '/admin-builder/translations/dashboard',
    noindex: true,
  });
}

export default async function BuilderTranslationDashboardPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { sourceLocale?: string };
}) {
  const routeLocale = normalizeLocale(params.locale);
  const sourceLocale = normalizeLocale(
    searchParams?.sourceLocale ?? DEFAULT_TRANSLATION_SOURCE_LOCALE,
  );
  const payload = await buildTranslationDashboard('default', sourceLocale);

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1200, margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          gap: 16,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
            Translation Dashboard
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569' }}>
            Per-page translation status across all locales. Source locale:{' '}
            <strong>{sourceLocale}</strong>
          </p>
        </div>
        <Link
          href={`/${routeLocale}/admin-builder/translations`}
          style={{
            fontSize: 13,
            color: '#1e5a96',
            textDecoration: 'none',
          }}
        >
          ← Entry-level view
        </Link>
      </header>

      <TranslationDashboardClient
        initialPayload={payload}
        routeLocale={routeLocale}
      />
    </div>
  );
}