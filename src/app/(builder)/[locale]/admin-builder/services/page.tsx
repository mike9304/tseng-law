import type { Metadata } from 'next';
import Link from 'next/link';
import BuilderWorkspaceFrame from '@/components/builder/BuilderWorkspaceFrame';
import ServiceSourceManager from '@/components/builder/services/ServiceSourceManager';
import { getAdminNavCopy } from '@/lib/builder/admin-nav/nav-copy';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readServiceAreaSourceRecords } from '@/lib/builder/services/source';
import { readBuilderSiteOverview } from '@/lib/builder/site';
import { getAllColumnPosts } from '@/lib/columns';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type ServiceSourceCopy = {
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
  footerDescription: string;
  contentTitle: string;
  contentManagerLabel: string;
  serviceSourceLabel: string;
  lawyerSourceLabel: string;
  columnsEditorLabel: string;
  sourceTitle: string;
  sourceRecordsLabel: string;
  routeLabel: string;
  statusTitle: string;
  fLayerTitle: string;
  sourceSlugLabel: string;
  sourceNoteLabel: string;
  sourceOwnerLabel: string;
  sourceStateLabel: string;
  sourceMappingLabel: string;
  lifecycleTitle: string;
  lifecycleNoteOne: string;
  lifecycleNoteTwo: string;
  lifecycleNoteThree: string;
  pageTitle: string;
  recordCountLabel: string;
};

const copy: Record<Locale, ServiceSourceCopy> = {
  ko: {
    title: '서비스 소스 레코드',
    description: '서비스 영역 레코드의 빌더 관리 소스 오버라이드를 편집합니다.',
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
    footerDescription: '실제 시스템만 사용합니다. 가짜 탭은 없습니다.',
    contentTitle: '콘텐츠',
    contentManagerLabel: '콘텐츠 관리자',
    serviceSourceLabel: '서비스 소스',
    lawyerSourceLabel: '변호사 소스',
    columnsEditorLabel: '칼럼 편집기',
    sourceTitle: '서비스 소스 레코드',
    sourceRecordsLabel: '레코드',
    routeLabel: '빌더 기준 경로',
    statusTitle: '상태',
    fLayerTitle: 'F-레이어',
    sourceSlugLabel: '소스 슬러그',
    sourceNoteLabel: '메모',
    sourceOwnerLabel: '소유자',
    sourceStateLabel: '상태',
    sourceMappingLabel: '매핑',
    lifecycleTitle: '수명주기',
    lifecycleNoteOne: '소스 슬러그는 복구를 위해 안정적으로 유지됩니다.',
    lifecycleNoteTwo: '실시간 슬러그 변경은 서비스 API를 통해 레코드 수준 리디렉션을 만듭니다.',
    lifecycleNoteThree: '중복되는 라이브 슬러그는 저장 전에 차단됩니다.',
    pageTitle: '서비스 소스',
    recordCountLabel: '레코드',
  },
  'zh-hant': {
    title: '服務來源記錄',
    description: '編輯服務區段記錄的建構器來源覆寫。',
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
    footerDescription: '只保留真實系統，不放假分頁。',
    contentTitle: '內容',
    contentManagerLabel: '內容管理器',
    serviceSourceLabel: '服務來源',
    lawyerSourceLabel: '律師來源',
    columnsEditorLabel: '專欄編輯器',
    sourceTitle: '服務來源記錄',
    sourceRecordsLabel: '記錄',
    routeLabel: '建構器基準路由',
    statusTitle: '狀態',
    fLayerTitle: 'F-層',
    sourceSlugLabel: '來源 Slug',
    sourceNoteLabel: '備註',
    sourceOwnerLabel: '擁有者',
    sourceStateLabel: '狀態',
    sourceMappingLabel: '對應',
    lifecycleTitle: '生命週期',
    lifecycleNoteOne: '來源 Slug 會保持穩定以便復原。',
    lifecycleNoteTwo: '即時 Slug 變更會透過服務 API 建立記錄層級重新導向。',
    lifecycleNoteThree: '重複的即時 Slug 會在儲存前被阻擋。',
    pageTitle: '服務來源',
    recordCountLabel: '記錄',
  },
  en: {
    title: 'Service Source Records',
    description: 'Builder-managed source overrides for service-area records.',
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
    footerDescription: 'Real systems only. No fake tabs.',
    contentTitle: 'Content',
    contentManagerLabel: 'Content Manager',
    serviceSourceLabel: 'Service source',
    lawyerSourceLabel: 'Lawyer source',
    columnsEditorLabel: 'Columns editor',
    sourceTitle: 'Service source records',
    sourceRecordsLabel: 'records',
    routeLabel: 'canonical builder route',
    statusTitle: 'Status',
    fLayerTitle: 'F-layer',
    sourceSlugLabel: 'Source slug',
    sourceNoteLabel: 'Note',
    sourceOwnerLabel: 'Owner',
    sourceStateLabel: 'State',
    sourceMappingLabel: 'Mapping',
    lifecycleTitle: 'Lifecycle',
    lifecycleNoteOne: 'Source slugs remain stable for recovery.',
    lifecycleNoteTwo: 'Live slug changes create record-level redirects through the services API.',
    lifecycleNoteThree: 'Duplicate live slugs are blocked before save.',
    pageTitle: 'Service source',
    recordCountLabel: 'records',
  },
};

export async function generateMetadata(props: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: copy[locale].title,
    description: copy[locale].description,
    path: '/admin-builder/services',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function ServiceSourcePage(props: { params: Promise<{ locale: Locale }> }) {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  const text = copy[locale];
  const navCopy = getAdminNavCopy(locale);
  const [overview, records] = await Promise.all([
    readBuilderSiteOverview(locale),
    readServiceAreaSourceRecords(DEFAULT_BUILDER_SITE_ID, locale),
  ]);
  const columnOptions = getAllColumnPosts(locale).map((post) => ({
    slug: post.slug,
    title: post.title,
  }));

  return (
    <BuilderWorkspaceFrame
      title={text.pageTitle}
      description={text.description}
      activeRail="pages"
      stageUrl={`/${locale}/admin-builder/services`}
      navigationLabel={navCopy.ariaLabel}
      footerLabel={text.builderTitle}
      footerDescription={text.footerDescription}
      routeLabel={text.routeLabel}
      backLink={{ href: `/${locale}/admin-builder/cms`, label: navCopy.backLabel }}
      railItems={[
        { key: 'pages', label: text.pagesLabel, description: text.pagesDescription, href: `/${locale}/admin-builder` },
        { key: 'assets', label: text.assetsLabel, description: text.assetsDescription, href: `/${locale}/admin-builder` },
      ]}
      leftMeta={
        <>
          <span className="builder-stage-pill builder-stage-pill--accent">{text.serviceSourceLabel}</span>
          <span className="builder-stage-pill">
            {records.length} {text.recordCountLabel}
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
          <h2>{text.contentTitle}</h2>
          <div className="builder-dashboard-nav-list">
            <Link href={`/${locale}/admin-builder/cms`} className="builder-dashboard-nav-card">
              <strong>{text.contentManagerLabel}</strong>
              <span>{text.cmsDescription}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/services`} className="builder-dashboard-nav-card is-active">
              <strong>{text.serviceSourceLabel}</strong>
              <span>{text.pageTitle}</span>
            </Link>
            <Link href={`/${locale}/admin-builder/lawyers`} className="builder-dashboard-nav-card">
              <strong>{text.lawyerSourceLabel}</strong>
              <span>{locale === 'ko' ? '변호사 프로필 기록' : locale === 'zh-hant' ? '律師簡介記錄' : 'Attorney profile records'}</span>
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
      <ServiceSourceManager columnOptions={columnOptions} locale={locale} records={records} />
    </BuilderWorkspaceFrame>
  );
}
