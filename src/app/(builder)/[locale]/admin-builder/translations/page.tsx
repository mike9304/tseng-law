import type { Metadata } from 'next';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';
import {
  DEFAULT_TRANSLATION_SOURCE_LOCALE,
  syncTranslationsForSite,
} from '@/lib/builder/translations/sync';
import { buildTranslationPublishWarningsPayload } from '@/lib/builder/translations/publish-warnings';
import TranslationManagerView from '@/components/builder/translations/TranslationManagerView';
import TranslationPublishWarningsPanel from '@/components/builder/translations/TranslationPublishWarningsPanel';
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
    title: copy.managerTitle,
    description: copy.managerDescription,
    path: '/admin-builder/translations',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderTranslationsPage(
  props: {
    params: Promise<{ locale: Locale }>;
    searchParams?: Promise<{
      sourceLocale?: string;
      category?: string;
      search?: string;
      status?: string;
      target?: string;
      targetLocale?: string;
      targets?: string;
    }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const routeLocale = normalizeLocale(params.locale);
  const sourceLocale = normalizeLocale(searchParams?.sourceLocale ?? DEFAULT_TRANSLATION_SOURCE_LOCALE);
  const payload = await syncTranslationsForSite('default', sourceLocale);
  const warnings = await buildTranslationPublishWarningsPayload('default', sourceLocale);

  return (
    <div>
      <TranslationPublishWarningsPanel
        sourceLocale={sourceLocale}
        routeLocale={routeLocale}
        initialPayload={warnings}
      />
      <TranslationManagerView
        initialPayload={payload}
        routeLocale={routeLocale}
        initialCategory={searchParams?.category}
        initialSearch={searchParams?.search}
        initialStatus={searchParams?.status}
        initialVisibleTargets={searchParams?.targets ?? searchParams?.target ?? searchParams?.targetLocale}
      />
    </div>
  );
}
