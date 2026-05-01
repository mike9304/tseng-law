import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import {
  DEFAULT_TRANSLATION_SOURCE_LOCALE,
  syncTranslationsForSite,
} from '@/lib/builder/translations/sync';
import TranslationManagerView from '@/components/builder/translations/TranslationManagerView';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Translation Manager',
    description: 'Manage multilingual builder content translations.',
    path: '/admin-builder/translations',
    noindex: true,
  });
}

export default async function BuilderTranslationsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: { sourceLocale?: string };
}) {
  const routeLocale = normalizeLocale(params.locale);
  const sourceLocale = normalizeLocale(searchParams?.sourceLocale ?? DEFAULT_TRANSLATION_SOURCE_LOCALE);
  const payload = await syncTranslationsForSite('default', sourceLocale);

  return (
    <TranslationManagerView
      initialPayload={payload}
      routeLocale={routeLocale}
    />
  );
}
