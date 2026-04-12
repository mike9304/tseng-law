import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderStarterTemplateWorkspaceShell from '@/components/builder/BuilderStarterTemplateWorkspaceShell';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import {
  decodeBuilderStarterTemplateParam,
  readBuilderStarterTemplateDetail,
} from '@/lib/builder/starter-templates';
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
    title: 'Builder Starter Template Detail',
    description: 'Template-first starter detail inside the Hojeong builder.',
    path: `/builder/starter-templates/${params.templateId}`,
    noindex: true,
  });
}

export default async function BuilderStarterTemplateDetailPage({
  params,
}: {
  params: { locale: Locale; templateId: string };
}) {
  const locale = normalizeLocale(params.locale);
  const templateId = decodeBuilderStarterTemplateParam(params.templateId);

  if (!templateId) {
    notFound();
  }

  const [overview, detail] = await Promise.all([
    readBuilderSiteOverview(locale),
    Promise.resolve(readBuilderStarterTemplateDetail(templateId, locale)),
  ]);

  return <BuilderStarterTemplateWorkspaceShell locale={locale} overview={overview} detail={detail} />;
}
