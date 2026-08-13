import Link from 'next/link';
import type { Metadata } from 'next';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import { buildTranslationDashboard } from '@/lib/builder/translations/dashboard-model';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';
import TranslationDashboardClient from '@/components/builder/translations/TranslationDashboardClient';
import { getTranslationCopy } from '@/components/builder/translations/translation-copy';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  props: {
    params: Promise<{ locale: Locale }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const copy = getTranslationCopy(locale);
  return buildSeoMetadata({
    locale,
    title: copy.dashboardTitle,
    description: copy.dashboardDescription,
    path: '/admin-builder/translations/dashboard',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderTranslationDashboardPage(
  props: {
    params: Promise<{ locale: Locale }>;
    searchParams?: Promise<{ sourceLocale?: string; status?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const routeLocale = normalizeLocale(params.locale);
  const copy = getTranslationCopy(routeLocale);
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
            {copy.dashboardTitle}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569' }}>
            {copy.dashboardDescription} {copy.managerSourceLocale}:{' '}
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
          ← {copy.dashboardEntryLink}
        </Link>
      </header>

      <TranslationDashboardClient
        initialPayload={payload}
        routeLocale={routeLocale}
        initialStatus={searchParams?.status}
      />
    </div>
  );
}
