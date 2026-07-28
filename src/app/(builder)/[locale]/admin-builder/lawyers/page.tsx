import type { Metadata } from 'next';
import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import LawyerSourceManager from '@/components/builder/lawyers/LawyerSourceManager';
import { getAdminNavCopy } from '@/lib/builder/admin-nav/nav-copy';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readAttorneyProfileSourceRecords } from '@/lib/builder/lawyers/source';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type LawyerSourceCopy = {
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
  contentTitle: string;
  contentManagerLabel: string;
  serviceSourceLabel: string;
  lawyerSourceLabel: string;
  columnsEditorLabel: string;
  pageTitle: string;
  recordCountLabel: string;
  routeLabel: string;
  localeLabel: string;
  lifecycleTitle: string;
  lifecycleNoteOne: string;
  lifecycleNoteTwo: string;
  lifecycleNoteThree: string;
  headingTitle: string;
  headingSourceRecords: string;
  headingSite: string;
  navigationLabel: string;
  footerLabel: string;
  footerDescription: string;
};

const copy: Record<Locale, LawyerSourceCopy> = {
  ko: {
    title: '변호사 소스 레코드',
    description: '변호사 프로필 레코드의 빌더 관리 소스 오버라이드를 편집합니다.',
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
    contentTitle: '콘텐츠',
    contentManagerLabel: '콘텐츠 관리자',
    serviceSourceLabel: '서비스 소스',
    lawyerSourceLabel: '변호사 소스',
    columnsEditorLabel: '칼럼 편집기',
    pageTitle: '변호사 소스',
    recordCountLabel: '레코드',
    routeLabel: '빌더 기준 경로',
    localeLabel: '로케일',
    lifecycleTitle: '수명주기',
    lifecycleNoteOne: '소스 슬러그는 복구를 위해 안정적으로 유지됩니다.',
    lifecycleNoteTwo: '실시간 슬러그 변경은 변호사 API를 통해 레코드 수준 리디렉션을 만듭니다.',
    lifecycleNoteThree: '공개 변호사 페이지와 사이트맵은 현재 소스 오버라이드를 사용합니다.',
    headingTitle: '빌더',
    headingSourceRecords: '소스 레코드',
    headingSite: '사이트',
    navigationLabel: '빌더 탐색',
    footerLabel: '빌더',
    footerDescription: '실제 시스템만 사용합니다. 가짜 탭은 없습니다.',
  },
  'zh-hant': {
    title: '律師來源記錄',
    description: '編輯律師簡介記錄的建構器來源覆寫。',
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
    contentTitle: '內容',
    contentManagerLabel: '內容管理器',
    serviceSourceLabel: '服務來源',
    lawyerSourceLabel: '律師來源',
    columnsEditorLabel: '專欄編輯器',
    pageTitle: '律師來源',
    recordCountLabel: '記錄',
    routeLabel: '建構器基準路由',
    localeLabel: '語言',
    lifecycleTitle: '生命週期',
    lifecycleNoteOne: '來源 Slug 會保持穩定以便復原。',
    lifecycleNoteTwo: '即時 Slug 變更會透過律師 API 建立記錄層級重新導向。',
    lifecycleNoteThree: '公開律師頁面與 sitemap 會使用目前的來源覆寫。',
    headingTitle: '建構器',
    headingSourceRecords: '來源記錄',
    headingSite: '網站',
    navigationLabel: '建構器導覽',
    footerLabel: '建構器',
    footerDescription: '只保留真實系統，不放假分頁。',
  },
  en: {
    title: 'Lawyer Source Records',
    description: 'Builder-managed source overrides for attorney profile records.',
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
    contentTitle: 'Content',
    contentManagerLabel: 'Content Manager',
    serviceSourceLabel: 'Service source',
    lawyerSourceLabel: 'Lawyer source',
    columnsEditorLabel: 'Columns editor',
    pageTitle: 'Lawyer source',
    recordCountLabel: 'records',
    routeLabel: 'canonical builder route',
    localeLabel: 'locale',
    lifecycleTitle: 'Lifecycle',
    lifecycleNoteOne: 'Source slugs remain stable for recovery.',
    lifecycleNoteTwo: 'Live slug changes create record-level redirects through the lawyers API.',
    lifecycleNoteThree: 'Public lawyer pages and sitemap use the current source override.',
    headingTitle: 'Builder',
    headingSourceRecords: 'Source records',
    headingSite: 'Site',
    navigationLabel: 'Builder navigation',
    footerLabel: 'Builder',
    footerDescription: 'Real systems only. No fake tabs.',
  },
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    path: '/admin-builder/lawyers',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function LawyerSourcePage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const text = copy[locale];
  const navCopy = getAdminNavCopy(locale);
  const [overview, records] = await Promise.all([
    readBuilderSiteOverview(locale),
    readAttorneyProfileSourceRecords(DEFAULT_BUILDER_SITE_ID, locale),
  ]);

  return (
    <BuilderWorkspaceFrame
      title={text.pageTitle}
      description={text.description}
      activeRail="pages"
      stageUrl={`/${locale}/admin-builder/lawyers`}
      navigationLabel={navCopy.ariaLabel}
      footerLabel={text.footerLabel}
      footerDescription={text.footerDescription}
      routeLabel={text.routeLabel}
      backLink={{ href: `/${locale}/admin-builder/cms`, label: navCopy.backLabel }}
      railItems={[
        { key: 'pages', label: text.pagesLabel, description: text.pagesDescription, href: `/${locale}/admin-builder` },
        { key: 'assets', label: text.assetsLabel, description: text.assetsDescription, href: `/${locale}/admin-builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">{text.lawyerSourceLabel}</span>
          <span className="builder-stage-pill">
            {records.length} {text.recordCountLabel}
          </span>
        </>
      }
      rightMeta={
        <>
          <strong>{overview.site.name}</strong>
          <span>
            {overview.site.id} · {text.localeLabel} {locale}
          </span>
        </>
      }
      leftSidebar={
        <section className="builder-preview-inspector-card builder-dashboard-sidebar">
          <h2>{text.contentTitle}</h2>
          <div className="builder-dashboard-nav-list">
            <Link href={`/${locale}/admin-builder/cms`} className="builder-dashboard-nav-card">
              <strong>{text.contentManagerLabel}</strong>
              <span>{text.cmsDescription}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/services`} className="builder-dashboard-nav-card">
              <strong>{text.serviceSourceLabel}</strong>
              <span>{locale === 'ko' ? '서비스 영역 레코드' : locale === 'zh-hant' ? '服務區段記錄' : 'Practice area records'}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/lawyers`} className="builder-dashboard-nav-card is-active">
              <strong>{text.lawyerSourceLabel}</strong>
              <span>{text.pageTitle}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/columns`} className="builder-dashboard-nav-card">
              <strong>{text.columnsEditorLabel}</strong>
              <span>{locale === 'ko' ? '게시된 기사 기록' : locale === 'zh-hant' ? '已發佈文章記錄' : 'Published article records'}</span>
            </Link>
          </div>
        </section>
      }
      inspector={
        <section className="builder-preview-inspector-card">
          <h2>{text.lifecycleTitle}</h2>
          <ul className="builder-preview-inspector-notes">
            <li>{text.lifecycleNoteOne}</li>
            <li>{text.lifecycleNoteTwo}</li>
            <li>{text.lifecycleNoteThree}</li>
          </ul>
        </section>
      }
    >
      <LawyerSourceManager locale={locale} records={records} />
    </BuilderWorkspaceFrame>
  );
}
