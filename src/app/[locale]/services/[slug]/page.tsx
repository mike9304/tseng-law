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
import { projectInternationalPublicCopy } from '@/lib/services/international-public-copy';
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
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import {
  CORE_HOME_PATHS,
  INVESTMENT_PATH_COPY,
} from '@/data/multilingual-international-v2';
import CivilCommercialBlock from '@/components/CivilCommercialBlock';
import { buildBreadcrumbJsonLd, buildLegalServiceJsonLd, buildPersonJsonLd, buildSeoMetadata } from '@/lib/seo';
import styles from './ServiceDetail.module.css';
import zhStyles from './ZhHantServiceDetail.module.css';
import ZhHantSnapRowFocus from '@/components/zh-hant-home/ZhHantSnapRowFocus';
import jaStyles from './JaServiceDetail.module.css';
import JaPageShell from '@/components/ja-design/JaPageShell';
import JaPageRail from '@/components/ja-design/JaPageRail';
import JaHeaderBand from '@/components/ja-design/JaHeaderBand';
import enStyles from './EnServiceDetail.module.css';
import EnPageShell, { EnBand, EnGlance } from '@/components/en-design/EnPageShell';
import EnLocalNav from '@/components/en-design/EnLocalNav';
import { EN_SERVICE_EXTRA_COLUMNS } from '@/components/en-design/en-design-data';
import { getPricingContent } from '@/components/PricingCards';
import { protectJapaneseHeadingUnits } from '@/lib/services/japanese-heading-units';
import { typesetTitle } from '@/lib/ko-middot';
import ZhHantMonoIcon, { ZhHantTrail } from '@/components/zh-hant-icons/ZhHantMonoIcon';

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
    attorneyHeading: '本領域承辦律師',
    columnsLabel: '相關專欄',
    readMore: '閱讀全文 →',
    contactLabel: '預約諮詢',
    contactDesc: '對本服務領域有任何疑問，歡迎來信諮詢。',
    contactBtn: '電子郵件諮詢',
    emptyMsg: '本領域的專欄準備中。',
    reviewLead: '本頁內容由 ',
    reviewTail: '審閱，並附上相關專欄與諮詢方式。',
    breadcrumbServices: '服務領域',
  },
  en: {
    backLabel: '← Back to services',
    keyPointsLabel: 'Key Points',
    attorneyHeading: 'Lead Attorney for This Practice Area',
    columnsLabel: 'Related Columns — Learn More',
    readMore: 'Read full article →',
    contactLabel: 'Book Consultation',
    contactDesc: `Email a brief summary of your question to ${CONSULTATION_EMAIL}. Sensitive files should follow after attorney instructions.`,
    contactBtn: 'Contact Us',
    emptyMsg: 'Columns for this practice area are being prepared.',
    reviewLead: 'This page is reviewed by ',
    reviewTail: ' and connects related columns with the consultation flow.',
    breadcrumbServices: 'Services',
  },
  ja: {
    backLabel: '← サービス一覧へ',
    keyPointsLabel: '主なポイント',
    attorneyHeading: 'この分野の担当弁護士',
    columnsLabel: '関連コラム — 詳しく見る',
    readMore: '記事を読む →',
    contactLabel: '法律相談',
    contactDesc: `${CONSULTATION_EMAIL} へ、ご相談内容の簡潔な概要をメールでお送りください。機微情報は弁護士の指示後にご提出ください。`,
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
  'family',
  'labor',
  'criminal',
  'ip',
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

  return projectInternationalPublicCopy(locale, {
    slug: area.slug,
    title: area.title[locale],
    subtitle: area.subtitle[locale],
    intro: area.intro[locale],
    keyPoints: area.keyPoints[locale],
    columnSlugs: area.columnSlugs,
  });
}

export async function generateStaticParams() {
  const slugs = (await readServiceAreaSourceRecords(DEFAULT_BUILDER_SITE_ID, 'ko')).map((area) => area.slug);
  return [
    ...(['ko', 'zh-hant', 'en'] as const).flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug })),
    ),
    { locale: 'ja', slug: 'investment' },
    { locale: 'ja', slug: 'civil' },
    { locale: 'ja', slug: 'family' },
    { locale: 'ja', slug: 'labor' },
    { locale: 'ja', slug: 'criminal' },
    { locale: 'ja', slug: 'ip' },
  ];
}

function summarize(text: string, maxLength = 160) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

export async function generateMetadata(props: { params: Promise<{ locale: SiteLocale; slug: string }> }): Promise<Metadata> {
  const params = await props.params;
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

export default async function ServiceDetailPage(props: { params: Promise<{ locale: SiteLocale; slug: string }> }) {
  const params = await props.params;
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

  // en: the newer English guides for this practice area come first (arrangement only).
  const columnSlugs = locale === 'en'
    ? [...new Set([...(EN_SERVICE_EXTRA_COLUMNS[area.slug] ?? []), ...area.columnSlugs])]
    : area.columnSlugs;
  const columns = columnSlugs
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
  const zhHant = locale === 'zh-hant';
  // ja design (Opus 5.5 ja lane, 2026-10-01): paper hero with an in-page index, numbered key points.
  const ja = locale === 'ja';
  const jaIndexLabel = 'このページの内容';
  const en = locale === 'en';
  const enConsultation = en ? getPricingContent('en').items.find((item) => item.icon === 'consultation') : undefined;
  const heroCopy = (
    <>
      <Link href={`/${locale}/services`} className="svc-back-link">{t.backLabel}</Link>
      <h1 className="svc-hero-title">{locale === 'ja' ? protectJapaneseHeadingUnits(area.title) : area.title}</h1>
      <p className="svc-hero-subtitle">{area.subtitle}</p>
    </>
  );
  const contactCard = (
    <div className={`svc-sidebar-card ${styles.contactCard}${zhHant ? ` ${zhStyles.contactPanel}` : ''}${en ? ` ${enStyles.contactPanel}` : ''}`}>
      <h3 className="svc-sidebar-title">{t.contactLabel}</h3>
      <p className="svc-sidebar-text">{t.contactDesc}</p>
      <a
        href={getConsultationPublicMailto(locale)}
        className="button svc-sidebar-btn"
        aria-label={`${t.contactLabel}: ${CONSULTATION_EMAIL}`}
      >
        {t.contactBtn}
      </a>
    </div>
  );

  const content = (
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
        <section className={`svc-hero ${styles.hero}${zhHant ? ` ${zhStyles.hero}` : ''}${ja ? ` ${jaStyles.hero}` : ''}${en ? ` ${enStyles.hero}` : ''}`} data-tone="dark" data-zh-hant-design={zhHant ? 'service-detail' : undefined}>
          <div className={`container svc-hero-inner ${styles.heroInner}${ja ? ` ${jaStyles.heroInner}` : ''}`}>
            {zhHant ? (
              <>
                <div className={zhStyles.heroCopy}>
                  {heroCopy}
                  <a href={getConsultationPublicMailto(locale)} className={`button ${zhStyles.heroCta}`}>{t.contactBtn} <span aria-hidden>↗</span></a>
                  {attorney ? <Link href={`/${locale}/lawyers/${attorney.slug}`} className={zhStyles.byline}>{attorney.name} · {attorney.role}</Link> : null}
                  <nav className={zhStyles.contents} aria-label={t.breadcrumbServices}>
                    {showBody && points.length > 0 ? <a href="#service-keypoints">{t.keyPointsLabel}<ZhHantMonoIcon name="arrow-down" size={16} strokePx={1.5} /></a> : null}
                    {showBody && columns.length > 0 ? <a href="#service-columns">{t.columnsLabel}<ZhHantMonoIcon name="arrow-down" size={16} strokePx={1.5} /></a> : null}
                  </nav>
                </div>
                <div className={zhStyles.heroImage}>
                  <Image src="/images/editorial/taichung-courthouse-civic-daylight-v2.webp" alt="" width={960} height={640} sizes="(max-width: 767px) 100vw, 38vw" priority />
                </div>
              </>
            ) : ja ? (
              // ja 昊 V2 (2026-10-02): title block, the existing action and byline; the in-page index moves
              // beside the body as the vertical 目次 (JaPageRail) and the morning band follows the hero.
              <>
                <div className={jaStyles.heroCopy}>
                  <Link href={`/${locale}/services`} className={`svc-back-link ${jaStyles.back}`}>{t.backLabel}</Link>
                  <h1 className="svc-hero-title">{protectJapaneseHeadingUnits(area.title)}</h1>
                  <p className="svc-hero-subtitle">{area.subtitle}</p>
                </div>
                <div className={jaStyles.heroPanel}>
                  <a href={getConsultationPublicMailto(locale)} className={`button ${jaStyles.heroCta}`}>{t.contactBtn}</a>
                  {attorney ? <Link href={`/${locale}/lawyers/${attorney.slug}`} className={jaStyles.byline}>{attorney.name} · {attorney.role}</Link> : null}
                </div>
              </>
            ) : en ? (
              <>
                <div className={enStyles.heroCopy}>
                  {heroCopy}
                  <div className={enStyles.heroActions}>
                    <a href={getConsultationPublicMailto(locale)} className={enStyles.heroCta} aria-label={`${t.contactLabel}: ${CONSULTATION_EMAIL}`}>
                      {t.contactBtn} <span aria-hidden>→</span>
                    </a>
                    {showBody && points.length > 0 ? <a href="#service-keypoints" className={enStyles.jump}>{t.keyPointsLabel} <span aria-hidden>↓</span></a> : null}
                    {showBody && columns.length > 0 ? <a href="#service-columns" className={enStyles.jump}>{t.columnsLabel.split(' —')[0]} <span aria-hidden>↓</span></a> : null}
                  </div>
                </div>
                {attorney ? (
                  <EnGlance
                    items={[
                      { term: 'Lead attorney', value: <Link href={`/${locale}/lawyers/${attorney.slug}`}>{attorney.name}</Link>, note: attorney.role },
                      { term: 'Languages', value: attorney.languages.join(', ') },
                      ...(enConsultation
                        ? [
                            { term: 'Meet', value: enConsultation.details[0] ?? '' },
                            { term: enConsultation.title, value: `${enConsultation.price} ${enConsultation.unit}`.trim(), note: enConsultation.details[3] },
                          ]
                        : []),
                    ]}
                  />
                ) : null}
              </>
            ) : heroCopy}
          </div>
          {ja ? <JaHeaderBand /> : null}
        </section>
      ) : null}

      {/* en (Clear Night inner pages): the rooftops band under the title card, then the local nav to the two sections. */}
      {en && showHero ? <EnBand name="rooftops" /> : null}
      {en && showBody && (points.length > 0 || columns.length > 0) ? (
        <EnLocalNav
          title={area.title}
          items={[
            ...(points.length > 0 ? [{ href: '#service-keypoints' as const, label: t.keyPointsLabel }] : []),
            ...(columns.length > 0 ? [{ href: '#service-columns' as const, label: t.columnsLabel.split(' —')[0] }] : []),
          ]}
        />
      ) : null}

      {showBody ? (
        <article className={`svc-article ${styles.root}${zhHant ? ` ${zhStyles.root}` : ''}${ja ? ` ${jaStyles.article}` : ''}${en ? ` ${enStyles.article}` : ''}`} data-ja-area={ja ? area.slug : undefined}>
          <div className={`container svc-container ${styles.layout}`}>
            {zhHant ? contactCard : null}
            {ja && ((points.length > 0) || columns.length > 0) ? (
              <JaPageRail
                className={jaStyles.rail}
                label={jaIndexLabel}
                items={[
                  ...(points.length > 0 ? [{ id: 'service-keypoints', label: t.keyPointsLabel }] : []),
                  ...(columns.length > 0 ? [{ id: 'service-columns', label: t.columnsLabel.split(' —')[0] }] : []),
                ]}
              />
            ) : null}
            <div className={`svc-body ${styles.body}`}>
              <p className="svc-intro">{area.intro}</p>
              {area.slug === 'investment' ? (
                <div className="svc-keypoints">
                  <h2 className="svc-keypoints-title">{INVESTMENT_PATH_COPY[locale].heading}</h2>
                  <ul className="svc-keypoints-list">
                    <li>
                      <Link href={CORE_HOME_PATHS[locale].companySetup.href} className="link-underline">
                        {INVESTMENT_PATH_COPY[locale].lawyerLabel}
                      </Link>
                    </li>
                    <li>
                      <Link href={CORE_HOME_PATHS[locale].guide.href} className="link-underline">
                        {INVESTMENT_PATH_COPY[locale].guideLabel}
                      </Link>
                    </li>
                  </ul>
                </div>
              ) : null}
              {area.slug === 'civil' ? <CivilCommercialBlock locale={locale} /> : null}
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
                <div className="svc-keypoints" id={zhHant || ja || en ? 'service-keypoints' : undefined}>
                  <h2 className="svc-keypoints-title">{t.keyPointsLabel}</h2>
                  <ul className="svc-keypoints-list">
                    {points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {columns.length > 0 && (
                <div className="svc-columns-section" id={zhHant || ja || en ? 'service-columns' : undefined}>
                  <h2 className="svc-columns-heading">{t.columnsLabel}</h2>
                  <div className={`svc-columns-grid ${styles.columnsGrid}`}>
                    {columns.map((col) => (
                      <Link
                        key={col.slug}
                        href={`/${locale}/columns/${col.slug}`}
                        className={`svc-col-card ${styles.colCard}`}
                      >
                        <div className={col.slug === 'taiwan-gym-injury-lawsuit'
                          ? 'svc-col-card-media svc-col-card-media--preserve-text'
                          : 'svc-col-card-media'}>
                          <Image src={col.featuredImage} alt={col.title} width={640} height={360} />
                          <div className="svc-col-card-overlay" />
                          <span className="svc-col-badge">{col.categoryLabel}</span>
                        </div>
                        <h3 className="svc-col-card-title">{typesetTitle(locale, col.title)}</h3>
                        <p className="svc-col-card-summary">{col.summary}</p>
                        <span className="svc-col-card-meta">
                          <time>{col.dateDisplay || col.date}</time>
                          {col.readTime && <span>{col.readTime}</span>}
                        </span>
                        <span className="svc-col-card-link">{zhHant ? <>{t.readMore.replace(/\s*→$/, '')}<ZhHantTrail /></> : t.readMore}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {columns.length === 0 && (
                <div className="svc-empty"><p>{t.emptyMsg}</p></div>
              )}
            </div>

            <aside className={`svc-sidebar ${styles.sidebar}`}>
              {!zhHant ? contactCard : null}
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
            </aside>
          </div>
          {zhHant ? <ZhHantSnapRowFocus rootSelector="article.svc-article" /> : null}
        </article>
      ) : null}
    </>
  );
  // ja and en redesigns (Opus 5.5 lanes, 2026-10-01): same blocks inside each locale's scoped wrapper.
  if (ja) return <JaPageShell page="service-detail" className={jaStyles.root}>{content}</JaPageShell>;
  return en ? <EnPageShell page="service-detail">{content}</EnPageShell> : content;
}
