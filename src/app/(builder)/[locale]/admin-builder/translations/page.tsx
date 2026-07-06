import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
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

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = getTranslationCopy(locale);
  return buildSeoMetadata({
    locale,
    title: copy.managerTitle,
    description: copy.managerDescription,
    path: '/admin-builder/translations',
    noindex: true,
  });
}

export default async function BuilderTranslationsPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams?: {
    sourceLocale?: string;
    category?: string;
    search?: string;
    status?: string;
    target?: string;
    targetLocale?: string;
    targets?: string;
  };
}) {
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
