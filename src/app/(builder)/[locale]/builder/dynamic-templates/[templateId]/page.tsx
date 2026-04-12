import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderDynamicTemplateWorkspaceShell from '@/components/builder/BuilderDynamicTemplateWorkspaceShell';
import {
  decodeBuilderDynamicTemplateParam,
  readBuilderDynamicTemplateDetail,
} from '@/lib/builder/dynamic-templates';
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
    description: 'Read-only dynamic template ownership detail inside the Hojeong builder.',
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

  const [overview, detail] = await Promise.all([
    readBuilderSiteOverview(locale),
    Promise.resolve(readBuilderDynamicTemplateDetail(templateId, locale)),
  ]);

  return <BuilderDynamicTemplateWorkspaceShell locale={locale} overview={overview} detail={detail} />;
}
