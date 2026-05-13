import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderDynamicTemplateWorkspaceShell from '@/components/builder/BuilderDynamicTemplateWorkspaceShell';
import {
  decodeBuilderDynamicTemplateParam,
  readBuilderDynamicTemplateDetail,
} from '@/lib/builder/dynamic-templates';
import { readBuilderDynamicTemplateDraft } from '@/lib/builder/dynamic-template-drafts';
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
}: {
  params: { locale: Locale; templateId: string };
}) {
  const locale = normalizeLocale(params.locale);
  const templateId = decodeBuilderDynamicTemplateParam(params.templateId);

  if (!templateId) {
    notFound();
  }

  const [overview, detail, draft] = await Promise.all([
    readBuilderSiteOverview(locale),
    Promise.resolve(readBuilderDynamicTemplateDetail(templateId, locale)),
    readBuilderDynamicTemplateDraft(templateId, locale),
  ]);

  return (
    <BuilderDynamicTemplateWorkspaceShell
      locale={locale}
      overview={overview}
      detail={detail}
      draft={draft}
    />
  );
}
