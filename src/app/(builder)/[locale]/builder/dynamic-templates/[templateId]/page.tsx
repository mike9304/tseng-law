import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderDynamicTemplateWorkspaceShell from '@/components/builder/BuilderDynamicTemplateWorkspaceShell';
import {
  decodeBuilderDynamicTemplateParam,
  readBuilderDynamicTemplateDetail,
} from '@/lib/builder/dynamic-templates';
import {
  readBuilderDynamicTemplateDraft,
  readBuilderDynamicTemplatePublished,
} from '@/lib/builder/dynamic-template-drafts';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export function generateMetadata({
  params,
}: {
  params: { locale: Locale; templateId: string };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: 'Builder Dynamic Template Detail',
    description: 'Dynamic template editor v0 inside the Hojeong builder.',
    path: `/builder/dynamic-templates/${params.templateId}`,
    noindex: true,
  });
}

export default async function BuilderDynamicTemplateDetailPage({
  params,
  searchParams,
}: {
  params: { locale: Locale; templateId: string };
  searchParams?: { previewRecordId?: string | string[] };
}) {
  const locale = normalizeLocale(params.locale);
  const templateId = decodeBuilderDynamicTemplateParam(params.templateId);
  const previewRecordId = parseSearchParam(searchParams?.previewRecordId);

  if (!templateId) {
    notFound();
  }

  const [overview, draft, published] = await Promise.all([
    readBuilderSiteOverview(locale),
    readBuilderDynamicTemplateDraft(templateId, locale, previewRecordId),
    readBuilderDynamicTemplatePublished(templateId, locale, previewRecordId),
  ]);
  const detail = readBuilderDynamicTemplateDetail(
    templateId,
    locale,
    previewRecordId ?? draft.snapshot.state.selectedRecordId ?? published.snapshot.state.selectedRecordId
  );

  return (
    <BuilderDynamicTemplateWorkspaceShell
      locale={locale}
      overview={overview}
      detail={detail}
      draft={draft}
      published={published}
      initialPreviewRecordId={previewRecordId}
    />
  );
}

function parseSearchParam(value: string | string[] | undefined) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  if (!firstValue || !firstValue.trim()) {
    return null;
  }

  return firstValue.trim();
}
