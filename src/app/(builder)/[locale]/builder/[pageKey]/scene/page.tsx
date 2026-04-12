import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BuilderSceneWorkspaceShell from '@/components/builder/BuilderSceneWorkspaceShell';
import { buildBuilderSceneDocument, summarizeBuilderSceneDocument } from '@/lib/builder/scene';
import {
  getBuilderPageConfig,
  isBuilderPageKey,
  readBuilderPageSnapshotOverview,
  readBuilderSiteOverview,
} from '@/lib/builder/site';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type BuilderPageSceneRouteProps = {
  params: Promise<{
    locale: Locale;
    pageKey: string;
  }>;
};

export async function generateMetadata({ params }: BuilderPageSceneRouteProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  if (!isBuilderPageKey(resolvedParams.pageKey)) {
    return buildSeoMetadata({
      locale,
      title: 'Scene Graph Builder',
      description: 'Read-only builder scene graph foundation view.',
      path: '/builder',
      noindex: true,
    });
  }

  const config = getBuilderPageConfig(resolvedParams.pageKey);

  return buildSeoMetadata({
    locale,
    title: `${config.title} Scene Graph`,
    description: `Read-only scene graph foundation view for ${config.title}.`,
    path: `/builder/${resolvedParams.pageKey}/scene`,
    noindex: true,
  });
}

export default async function BuilderPageSceneRoute({ params }: BuilderPageSceneRouteProps) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);

  if (!isBuilderPageKey(resolvedParams.pageKey)) {
    notFound();
  }

  const pageKey = resolvedParams.pageKey;
  const [siteOverview, pageOverview] = await Promise.all([
    readBuilderSiteOverview(locale),
    readBuilderPageSnapshotOverview(pageKey, locale),
  ]);
  const scene = buildBuilderSceneDocument(pageOverview.preferred.snapshot.snapshot.document);
  const summary = summarizeBuilderSceneDocument(scene);

  return (
    <BuilderSceneWorkspaceShell
      locale={locale}
      pageKey={pageKey}
      requestedMode={pageOverview.page.availableModes[0] ?? 'preview'}
      workspace={siteOverview.workspace}
      site={siteOverview.site}
      pages={siteOverview.pages}
      scene={scene}
      summary={summary}
      snapshot={{
        source: pageOverview.preferred.source,
        revision: pageOverview.preferred.snapshot.revision,
        savedAt: pageOverview.preferred.snapshot.savedAt,
      }}
    />
  );
}
