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
import { getAllColumnPosts } from '@/lib/columns';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const sceneCopy: Record<Locale, { rootTitle: string; rootDescription: string; pageTitle: (title: string) => string; pageDescription: (title: string) => string }> = {
  ko: {
    rootTitle: '장면 그래프 빌더',
    rootDescription: '읽기 전용 빌더 장면 그래프 기반 보기입니다.',
    pageTitle: (title: string) => `${title} 장면 그래프`,
    pageDescription: (title: string) => `${title}의 읽기 전용 장면 그래프 기반 보기입니다.`,
  },
  'zh-hant': {
    rootTitle: '場景圖建構器',
    rootDescription: '唯讀的建構器場景圖基礎檢視。',
    pageTitle: (title: string) => `${title} 場景圖`,
    pageDescription: (title: string) => `${title} 的唯讀場景圖基礎檢視。`,
  },
  en: {
    rootTitle: 'Scene Graph Builder',
    rootDescription: 'Read-only builder scene graph foundation view.',
    pageTitle: (title: string) => `${title} Scene Graph`,
    pageDescription: (title: string) => `Read-only scene graph foundation view for ${title}.`,
  },
};

type BuilderPageSceneRouteProps = {
  params: Promise<{
    locale: Locale;
    pageKey: string;
  }>;
};

export async function generateMetadata({ params }: BuilderPageSceneRouteProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  const copy = sceneCopy[locale];

  if (!isBuilderPageKey(resolvedParams.pageKey)) {
    return buildSeoMetadata({
      locale,
      title: copy.rootTitle,
      description: copy.rootDescription,
      path: '/builder',
      alternateLocales: locales,
      noindex: true,
    });
  }

  const config = getBuilderPageConfig(resolvedParams.pageKey);

  return buildSeoMetadata({
    locale,
    title: copy.pageTitle(config.title),
    description: copy.pageDescription(config.title),
    path: `/builder/${resolvedParams.pageKey}/scene`,
    alternateLocales: locales,
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
  const scene = buildBuilderSceneDocument(pageOverview.preferred.snapshot.snapshot.document, {
    posts: getAllColumnPosts(locale),
  });
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
