import type { Metadata } from 'next';
import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import AppMarketClient from '@/components/builder/apps/AppMarketClient';
import { getAdminNavCopy } from '@/lib/builder/admin-nav/nav-copy';
import { listBuilderAppCatalogEntries } from '@/lib/builder/apps/installed';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const copy = {
  ko: {
    title: '앱 마켓',
    description: '로컬 앱 카탈로그와 설치 수명주기를 관리합니다.',
    backLabel: '편집기로 돌아가기',
    pagesLabel: '페이지',
    pagesDescription: '편집기',
    assetsLabel: '에셋',
    assetsDescription: '라이브러리',
    builderTitle: '빌더',
    desktopTitle: '데스크톱 편집기',
    desktopDescription: '캔버스와 페이지 편집',
    cmsTitle: '콘텐츠 관리자',
    cmsDescription: '컬렉션과 레코드',
    appMarketTitle: '앱 마켓',
    appMarketDescription: '카탈로그와 수명주기',
    statusTitle: 'M161 상태',
    catalogLabel: '카탈로그 앱',
    installedLabel: '설치됨',
    enabledLabel: '활성',
    fLayerTitle: 'F-레이어',
    catalogApps: '카탈로그 앱',
    installedCount: '설치됨',
    enabledCount: '활성',
    marketLabel: '앱 마켓',
    marketDescription: '앱을 설치하고 관리합니다.',
  },
  'zh-hant': {
    title: '應用市集',
    description: '管理本地應用目錄與安裝生命週期。',
    backLabel: '返回編輯器',
    pagesLabel: '頁面',
    pagesDescription: '編輯器',
    assetsLabel: '素材',
    assetsDescription: '資料庫',
    builderTitle: '編輯器',
    desktopTitle: '桌面編輯器',
    desktopDescription: '畫布與頁面編輯',
    cmsTitle: '內容管理器',
    cmsDescription: '集合與記錄',
    appMarketTitle: '應用市集',
    appMarketDescription: '目錄與生命週期',
    statusTitle: 'M161 狀態',
    catalogLabel: '目錄應用',
    installedLabel: '已安裝',
    enabledLabel: '已啟用',
    fLayerTitle: 'F-層',
    catalogApps: '目錄應用',
    installedCount: '已安裝',
    enabledCount: '已啟用',
    marketLabel: '應用市集',
    marketDescription: '安裝與管理應用。',
  },
  en: {
    title: 'App Market',
    description: 'Local app catalog and install lifecycle controls.',
    backLabel: 'Back to editor',
    pagesLabel: 'Pages',
    pagesDescription: 'Editor',
    assetsLabel: 'Assets',
    assetsDescription: 'Library',
    builderTitle: 'Builder',
    desktopTitle: 'Desktop editor',
    desktopDescription: 'Canvas and page editing',
    cmsTitle: 'Content Manager',
    cmsDescription: 'Collections and records',
    appMarketTitle: 'App Market',
    appMarketDescription: 'Catalog and lifecycle',
    statusTitle: 'M161 status',
    catalogLabel: 'Catalog apps',
    installedLabel: 'Installed',
    enabledLabel: 'Enabled',
    fLayerTitle: 'F-layer',
    catalogApps: 'Catalog apps',
    installedCount: 'Installed',
    enabledCount: 'Enabled',
    marketLabel: 'App Market',
    marketDescription: 'Install and manage builder apps.',
  },
} as const;

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    path: '/admin-builder/apps',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderAppsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const text = copy[locale];
  const navCopy = getAdminNavCopy(locale);
  const [overview, entries] = await Promise.all([
    readBuilderSiteOverview(locale),
    listBuilderAppCatalogEntries(DEFAULT_BUILDER_SITE_ID, locale),
  ]);
  const installedCount = entries.filter((entry) => entry.installation).length;
  const enabledCount = entries.filter((entry) => entry.installation?.status === 'enabled').length;

  return (
    <BuilderWorkspaceFrame
      title={text.title}
      description={text.description}
      activeRail="pages"
      stageUrl={`/${locale}/admin-builder/apps`}
      backLink={{ href: `/${locale}/admin-builder`, label: navCopy.backLabel }}
      railItems={[
        { key: 'pages', label: text.pagesLabel, description: text.pagesDescription, href: `/${locale}/admin-builder` },
        { key: 'assets', label: text.assetsLabel, description: text.assetsDescription, href: `/${locale}/admin-builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">M161</span>
          <span className="builder-stage-pill">{entries.length} {text.catalogApps}</span>
          <span className="builder-stage-pill">{installedCount} {text.installedCount}</span>
      </>
      }
      rightMeta={
        <>
          <strong>{overview.site.name}</strong>
          <span>
            {overview.site.id} · locale {locale}
          </span>
        </>
      }
      leftSidebar={
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
          <h2>{text.builderTitle}</h2>
          <div className="builder-dashboard-nav-list">
            <Link href={`/${locale}/admin-builder`} className="builder-dashboard-nav-card">
              <strong>{text.desktopTitle}</strong>
              <span>{text.desktopDescription}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/cms`} className="builder-dashboard-nav-card">
              <strong>{text.cmsTitle}</strong>
              <span>{text.cmsDescription}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/apps`} className="builder-dashboard-nav-card is-active">
              <strong>{text.appMarketTitle}</strong>
              <span>{text.appMarketDescription}</span>
            </Link>
          </div>
        </section>
      }
      inspector={
        <>
          <section className="builder-preview-inspector-card">
            <h2>{text.statusTitle}</h2>
            <dl className="builder-preview-inspector-list">
              <div>
                <dt>{text.catalogLabel}</dt>
                <dd>{entries.length}</dd>
              </div>
              <div>
                <dt>{text.installedLabel}</dt>
                <dd>{installedCount}</dd>
              </div>
              <div>
                <dt>{text.enabledLabel}</dt>
                <dd>{enabledCount}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{text.fLayerTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              <li>F33 manifest schema: local validation active</li>
              <li>F34 discovery: browse/search/filter active</li>
              <li>F35 lifecycle: install/enable/disable/uninstall active</li>
              <li>F36-F42 runtime, scopes, versioning, and cleanup active</li>
            </ul>
          </section>
        </>
      }
    >
      <AppMarketClient locale={locale} initialEntries={entries} />
    </BuilderWorkspaceFrame>
  );
}
