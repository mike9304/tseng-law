import type { Metadata } from 'next';
import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import ContentManagerClient from '@/components/builder/cms/ContentManagerClient';
import { readBuilderCollectionDetailsForSite } from '@/lib/builder/cms';
import { listEditableBuilderCmsCollections } from '@/lib/builder/cms-editable';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { getAdminNavCopy } from '@/lib/builder/admin-nav/nav-copy';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type CmsPageCopy = {
  title: string;
  description: string;
  backLabel: string;
  pagesLabel: string;
  pagesDescription: string;
  assetsLabel: string;
  assetsDescription: string;
  builderTitle: string;
  desktopTitle: string;
  desktopDescription: string;
  cmsTitle: string;
  cmsDescription: string;
  contentManagerTitle: string;
  editableCountLabel: string;
  sourceCountLabel: string;
  statusTitle: string;
  fLayerTitle: string;
  headingTitle: string;
  headingEditableCollections: string;
  headingSourceCollections: string;
  headingSite: string;
  builderNavLabel: string;
  builderFooterLabel: string;
  builderFooterDescription: string;
  routeLabel: string;
};

const copy: Record<Locale, CmsPageCopy> = {
  ko: {
    title: '빌더 CMS',
    description: '편집 가능한 빌더 CMS 컬렉션을 관리합니다.',
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
    contentManagerTitle: '콘텐츠 관리자',
    editableCountLabel: '편집 가능',
    sourceCountLabel: '읽기 전용 소스',
    statusTitle: 'M158 상태',
    fLayerTitle: 'F-레이어',
    headingTitle: '빌더',
    headingEditableCollections: '편집 가능 컬렉션',
    headingSourceCollections: '소스 컬렉션',
    headingSite: '사이트',
    builderNavLabel: '빌더 탐색',
    builderFooterLabel: '빌더',
    builderFooterDescription: '실제 시스템만 사용합니다. 가짜 탭은 없습니다.',
    routeLabel: '빌더 기준 경로',
  },
  'zh-hant': {
    title: '建構器 CMS',
    description: '管理可編輯的建構器 CMS 集合。',
    backLabel: '返回編輯器',
    pagesLabel: '頁面',
    pagesDescription: '編輯器',
    assetsLabel: '素材',
    assetsDescription: '資料庫',
    builderTitle: '建構器',
    desktopTitle: '桌面編輯器',
    desktopDescription: '畫布與頁面編輯',
    cmsTitle: '內容管理器',
    cmsDescription: '集合與記錄',
    contentManagerTitle: '內容管理器',
    editableCountLabel: '可編輯',
    sourceCountLabel: '唯讀來源',
    statusTitle: 'M158 狀態',
    fLayerTitle: 'F-層',
    headingTitle: '建構器',
    headingEditableCollections: '可編輯集合',
    headingSourceCollections: '來源集合',
    headingSite: '網站',
    builderNavLabel: '建構器導覽',
    builderFooterLabel: '建構器',
    builderFooterDescription: '只保留真實系統，不放假分頁。',
    routeLabel: '建構器基準路由',
  },
  en: {
    title: 'Builder CMS',
    description: 'Content Manager for editable builder CMS collections.',
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
    contentManagerTitle: 'Content Manager',
    editableCountLabel: 'editable',
    sourceCountLabel: 'read-only sources',
    statusTitle: 'M158 status',
    fLayerTitle: 'F-layer',
    headingTitle: 'Builder',
    headingEditableCollections: 'Editable collections',
    headingSourceCollections: 'Source collections',
    headingSite: 'Site',
    builderNavLabel: 'Builder navigation',
    builderFooterLabel: 'Builder',
    builderFooterDescription: 'Real systems only. No fake tabs.',
    routeLabel: 'canonical builder route',
  },
};

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    path: '/admin-builder/cms',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BuilderCmsPage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const text = copy[locale];
  const navCopy = getAdminNavCopy(locale);
  const [overview, sourceCollections, editableCollections] = await Promise.all([
    readBuilderSiteOverview(locale),
    readBuilderCollectionDetailsForSite(DEFAULT_BUILDER_SITE_ID, locale),
    listEditableBuilderCmsCollections(DEFAULT_BUILDER_SITE_ID, locale),
  ]);

  return (
    <BuilderWorkspaceFrame
      title={text.contentManagerTitle}
      description={`${text.cmsDescription}.`}
      activeRail="pages"
      stageUrl={`/${locale}/admin-builder/cms`}
      navigationLabel={navCopy.ariaLabel}
      footerLabel={text.builderFooterLabel}
      footerDescription={text.builderFooterDescription}
      routeLabel={text.routeLabel}
      backLink={{ href: `/${locale}/admin-builder`, label: navCopy.backLabel }}
      railItems={[
        { key: 'pages', label: text.pagesLabel, description: text.pagesDescription, href: `/${locale}/admin-builder` },
        { key: 'assets', label: text.assetsLabel, description: text.assetsDescription, href: `/${locale}/admin-builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">CMS</span>
          <span className="builder-stage-pill">
            {editableCollections.length} {text.editableCountLabel}
          </span>
          <span className="builder-stage-pill">
            {sourceCollections.length} {text.sourceCountLabel}
          </span>
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
            <Link href={`/${locale}/builder`} className="builder-dashboard-nav-card">
              <strong>{text.builderTitle}</strong>
              <span>{text.routeLabel}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/cms`} className="builder-dashboard-nav-card is-active">
              <strong>{text.contentManagerTitle}</strong>
              <span>{text.cmsDescription}</span>
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
                <dt>{text.headingEditableCollections}</dt>
                <dd>{editableCollections.length}</dd>
              </div>
              <div>
                <dt>{text.headingSourceCollections}</dt>
                <dd>{sourceCollections.length}</dd>
              </div>
              <div>
                <dt>{text.headingSite}</dt>
                <dd>{DEFAULT_BUILDER_SITE_ID}</dd>
              </div>
            </dl>
          </section>
          <section className="builder-preview-inspector-card">
            <h2>{text.fLayerTitle}</h2>
            <ul className="builder-preview-inspector-notes">
              <li>F07 schema model: in progress</li>
              <li>F08 content manager UI: in progress</li>
              <li>F09-F10 field validation: in progress</li>
              <li>F12/F16 permissions UI and guarded APIs: in progress</li>
            </ul>
          </section>
        </>
      }
    >
      <ContentManagerClient
        locale={locale}
        siteId={DEFAULT_BUILDER_SITE_ID}
        initialSourceCollections={sourceCollections}
        initialEditableCollections={editableCollections}
      />
    </BuilderWorkspaceFrame>
  );
}
