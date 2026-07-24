import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import {
  normalizeSiteLocale,
  siteLocales,
  toBuilderLocale,
  type SiteLocale,
} from '@/lib/locales';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getJapaneseServiceDetail } from '@/data/service-details-ja';
import { getServiceArea } from '@/data/service-details';
import { getColumnPost } from '@/lib/columns';
import JsonLd from '@/components/JsonLd';
import {
  normalizeServiceAreaSlug,
  readServiceAreaSourceRecordBySlug,
  readServiceAreaSourceRecords,
} from '@/lib/builder/services/source';
import {
  isBuilderDynamicTemplateBlockVisible,
  readBuilderDynamicTemplatePublishedBlockVisibility,
} from '@/lib/builder/dynamic-template-drafts';
import { buildBreadcrumbJsonLd, buildLegalServiceJsonLd, buildPersonJsonLd, buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

type ServiceDetailRecord = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  keyPoints: string[];
  columnSlugs: string[];
};

const copy: Record<SiteLocale, {
  backLabel: string;
  keyPointsLabel: string;
  attorneyHeading: string;
  columnsLabel: string;
  readMore: string;
  contactLabel: string;
  contactDesc: string;
  contactBtn: string;
  emptyMsg: string;
  reviewLead: string;
  reviewTail: string;
  breadcrumbServices: string;
}> = {
  ko: {
    backLabel: '← 업무분야 목록으로',
    keyPointsLabel: '핵심 요약',
    attorneyHeading: '이 분야 담당 변호사',
    columnsLabel: '관련 칼럼 — 자세히 알아보기',
    readMore: '자세히 읽기 →',
    contactLabel: '상담 예약',
    contactDesc: '이 분야에 대해 궁금한 점이 있으시면 언제든 문의해 주세요.',
    contactBtn: '문의하기',
    emptyMsg: '이 분야의 전문 칼럼을 준비 중입니다.',
    reviewLead: '이 페이지는 ',
    reviewTail: '가 검토하고 관련 칼럼과 상담 흐름을 연결했습니다.',
    breadcrumbServices: '업무분야',
  },
  'zh-hant': {
    backLabel: '← 返回服務領域',
    keyPointsLabel: '重點摘要',
    attorneyHeading: '此領域承辦律師',
    columnsLabel: '相關專欄 — 深入了解',
    readMore: '閱讀全文 →',
    contactLabel: '預約諮詢',
    contactDesc: '如對此服務領域有任何疑問，歡迎隨時聯繫我們。',
    contactBtn: '聯絡我們',
    emptyMsg: '此領域的專欄正在準備中。',
    reviewLead: '本頁內容由 ',
    reviewTail: '審閱，並串接相關專欄與諮詢流程。',
    breadcrumbServices: '服務領域',
  },
  en: {
    backLabel: '← Back to services',
    keyPointsLabel: 'Key Points',
    attorneyHeading: 'Lead Attorney for This Practice Area',
    columnsLabel: 'Related Columns — Learn More',
    readMore: 'Read full article →',
    contactLabel: 'Book Consultation',
    contactDesc: 'If you have any questions about this practice area, please contact us anytime.',
    contactBtn: 'Contact Us',
    emptyMsg: 'Columns for this practice area are being prepared.',
    reviewLead: 'This page is reviewed by ',
    reviewTail: ' and connects related columns with the consultation flow.',
    breadcrumbServices: 'Practice Areas',
  },
  ja: {
    backLabel: '← サービス一覧へ',
    keyPointsLabel: '主なポイント',
    attorneyHeading: 'この分野の担当弁護士',
    columnsLabel: '関連コラム — 詳しく見る',
    readMore: '記事を読む →',
    contactLabel: '法律相談',
    contactDesc: 'この分野に関するご相談は、お問い合わせフォームからお申し込みください。',
    contactBtn: 'お問い合わせ',
    emptyMsg: 'この分野の関連コラムを準備中です。',
    reviewLead: 'このページは',
    reviewTail: 'が内容を確認し、関連コラムと相談窓口をご案内しています。',
    breadcrumbServices: '取扱業務',
  },
};

const publishedJapaneseServiceDetailSlugs = [
  'investment',
  'civil',
] as const;

function getJapaneseServiceRecord(slugInput: string): ServiceDetailRecord | null {
  const slug = normalizeServiceAreaSlug(slugInput);
  if (!(publishedJapaneseServiceDetailSlugs as readonly string[]).includes(slug)) {
    return null;
  }

  const approved = getJapaneseServiceDetail(slug);
  const base = getServiceArea(slug);
  if (!approved || !base) {
    return null;
  }

  return {
    slug,
    title: approved.title,
    subtitle: approved.subtitle,
    intro: approved.intro,
    keyPoints: approved.keyPoints,
    columnSlugs: base.columnSlugs,
  };
}

async function getServiceRecord(
  locale: SiteLocale,
  slugInput: string,
): Promise<ServiceDetailRecord | null> {
  if (locale === 'ja') {
    return getJapaneseServiceRecord(slugInput);
  }

  const area = await readServiceAreaSourceRecordBySlug(
    DEFAULT_BUILDER_SITE_ID,
    locale,
    slugInput,
  );
  if (!area) {
    return null;
  }

  return {
    slug: area.slug,
    title: area.title[locale],
    subtitle: area.subtitle[locale],
    intro: area.intro[locale],
    keyPoints: area.keyPoints[locale],
    columnSlugs: area.columnSlugs,
  };
}

export async function generateStaticParams() {
  const slugs = (await readServiceAreaSourceRecords(DEFAULT_BUILDER_SITE_ID, 'ko')).map((area) => area.slug);
  return [
    ...(['ko', 'zh-hant', 'en'] as const).flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug })),
    ),
    { locale: 'ja', slug: 'investment' },
    { locale: 'ja', slug: 'civil' },
  ];
}

function summarize(text: string, maxLength = 160) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

export async function generateMetadata({ params }: { params: { locale: SiteLocale; slug: string } }): Promise<Metadata> {
  const locale = normalizeSiteLocale(params.locale);
  const area = await getServiceRecord(locale, params.slug);
  const attorney = getAttorneyProfile(locale, primaryAttorneySlug);

  if (!area) {
    return {};
  }

  const description = summarize(area.intro);
  const lawyerKeyword = attorney?.name
    ?? (locale === 'ko'
      ? '증준외 변호사'
      : locale === 'zh-hant'
        ? '曾雋崴律師'
        : locale === 'ja'
          ? '曾雋崴弁護士'
          : 'Attorney Wei Tseng');

  return buildSeoMetadata({
    locale,
    title: area.title,
    description,
    path: `/services/${area.slug}`,
    keywords: [
      area.title,
      area.subtitle,
      lawyerKeyword,
      locale === 'ko'
        ? '대만 변호사'
        : locale === 'zh-hant'
          ? '台灣律師'
          : locale === 'ja'
            ? '台湾弁護士'
            : 'Taiwan lawyer',
    ],
    ...(locale === 'ja' ? { alternateLocales: siteLocales } : {}),
  });
}

export default async function ServiceDetailPage({ params }: { params: { locale: SiteLocale; slug: string } }) {
  const locale = normalizeSiteLocale(params.locale);
  const area = await getServiceRecord(locale, params.slug);
  if (!area) return notFound();
  const routeSlug = locale === 'ja' ? params.slug : normalizeServiceAreaSlug(params.slug);
  if (routeSlug !== area.slug) {
    permanentRedirect(`/${locale}/services/${area.slug}`);
  }
  const attorney = getAttorneyProfile(locale, primaryAttorneySlug);
  const description = summarize(area.intro);
  const t = copy[locale];

  const columns = area.columnSlugs
    .map((slug) => getColumnPost(slug, locale))
    .filter((c): c is NonNullable<typeof c> => c != null);

  const points = area.keyPoints;
  const templateVisibility = await readBuilderDynamicTemplatePublishedBlockVisibility(
    'service-areas.item-template',
    toBuilderLocale(locale)
  );
  const showHero = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'service-areas.item.hero');
  const showBody = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'service-areas.item.body');
  const showSeo = isBuilderDynamicTemplateBlockVisible(templateVisibility, 'service-areas.item.seo');

  return (
    <>
      {showSeo ? (
        <>
          <JsonLd
            data={buildBreadcrumbJsonLd(locale, [
              { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home', path: `/${locale}` },
              { name: t.breadcrumbServices, path: `/${locale}/services` },
              { name: area.title, path: `/${locale}/services/${area.slug}` },
            ])}
          />
          <JsonLd
            data={buildLegalServiceJsonLd(locale, {
              name: area.title,
              description,
              path: `/services/${area.slug}`,
              serviceType: area.title,
            })}
          />
          {attorney ? (
            <JsonLd
              data={buildPersonJsonLd({
                locale,
                path: `/${locale}/lawyers/${attorney.slug}`,
                name: attorney.name,
                alternateName: attorney.alternateNames,
                description: attorney.description,
                image: attorney.image,
                email: attorney.email,
                jobTitle: attorney.role,
                sameAs: attorney.sameAs,
                knowsLanguage: attorney.languages,
                knowsAbout: attorney.practiceAreas,
                alumniOf: attorney.education,
              })}
            />
          ) : null}
        </>
      ) : null}
      {showHero ? (
        <section className="svc-hero" data-tone="dark">
          <div className="container svc-hero-inner">
            <Link href={`/${locale}/services`} className="svc-back-link">{t.backLabel}</Link>
            <h1 className="svc-hero-title">{area.title}</h1>
            <p className="svc-hero-subtitle">{area.subtitle}</p>
          </div>
        </section>
      ) : null}

      {showBody ? (
        <article className="svc-article">
          <div className="container svc-container">
            <div className="svc-body">
              <p className="svc-intro">{area.intro}</p>
              {attorney ? (
                <p className="svc-review-note">
                  {t.reviewLead}
                  <Link href={`/${locale}/lawyers/${attorney.slug}`} className="link-underline">
                    {attorney.name}
                  </Link>
                  {t.reviewTail}
                </p>
              ) : null}

              {points.length > 0 && (
                <div className="svc-keypoints">
                  <h2 className="svc-keypoints-title">{t.keyPointsLabel}</h2>
                  <ul className="svc-keypoints-list">
                    {points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {columns.length > 0 && (
                <div className="svc-columns-section">
                  <h2 className="svc-columns-heading">{t.columnsLabel}</h2>
                  <div className="svc-columns-grid">
                    {columns.map((col) => (
                      <Link
                        key={col.slug}
                        href={`/${locale}/columns/${col.slug}`}
                        className="svc-col-card"
                      >
                        <div className="svc-col-card-media">
                          <Image src={col.featuredImage} alt={col.title} width={640} height={360} />
                          <div className="svc-col-card-overlay" />
                          <span className="svc-col-badge">{col.categoryLabel}</span>
                        </div>
                        <h3 className="svc-col-card-title">{col.title}</h3>
                        <p className="svc-col-card-summary">{col.summary}</p>
                        <span className="svc-col-card-meta">
                          <time>{col.dateDisplay || col.date}</time>
                          {col.readTime && <span>{col.readTime}</span>}
                        </span>
                        <span className="svc-col-card-link">{t.readMore}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {columns.length === 0 && (
                <div className="svc-empty"><p>{t.emptyMsg}</p></div>
              )}
            </div>

            <aside className="svc-sidebar">
              <div className="svc-sidebar-card svc-sidebar-card--attorney">
                <AttorneyAuthorityCard locale={locale} heading={t.attorneyHeading} />
              </div>
              {columns.length > 0 && (
                <div className="svc-sidebar-card">
                  <h3 className="svc-sidebar-title">{t.columnsLabel.split(' —')[0]}</h3>
                  <ul className="svc-related-list">
                    {columns.map((col) => (
                      <li key={col.slug}>
                        <Link href={`/${locale}/columns/${col.slug}`} className="svc-related-link">
                          {col.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="svc-sidebar-card">
                <h3 className="svc-sidebar-title">{t.contactLabel}</h3>
                <p className="svc-sidebar-text">{t.contactDesc}</p>
                <Link href={`/${locale}/contact`} className="button svc-sidebar-btn">
                  {t.contactBtn}
                </Link>
              </div>
            </aside>
          </div>
        </article>
      ) : null}
    </>
  );
}
