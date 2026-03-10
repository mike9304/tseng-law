import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import FAQAccordion from '@/components/FAQAccordion';
import PageHeader from '@/components/PageHeader';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import { getIntentPage, type IntentPageSlug } from '@/data/intent-pages';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import { getServiceArea } from '@/data/service-details';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildPersonJsonLd } from '@/lib/seo';

function summarize(text: string, maxLength = 180) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

const labels = {
  ko: {
    terms: '관련 검색어',
    overview: '이 페이지에서 먼저 확인할 내용',
    fit: '이런 경우 상담이 맞습니다',
    points: '우선 검토 포인트',
    servicesLabel: 'RELATED SERVICES',
    servicesTitle: '관련 서비스',
    serviceButton: '서비스 보기',
    columnsLabel: 'RELATED COLUMNS',
    columnsTitle: '관련 칼럼',
    readMore: '자세히 읽기 →',
    attorneyHeading: '이 검색어와 가장 가까운 담당 변호사',
    ctaLabel: 'NEXT STEP',
    ctaTitle: '사안에 맞는 방향을 바로 정리하려면',
    ctaText: '회사설립, 투자, 소송, 가족 분쟁처럼 성격이 다른 사건은 초기에 구조를 잡는 방식이 달라집니다. 자료를 보내주시면 증준외 변호사와 연결되는 상담 흐름을 먼저 안내합니다.',
    contact: '상담 문의',
    profile: '증준외 프로필 보기',
  },
  'zh-hant': {
    terms: '相關搜尋詞',
    overview: '先從這些重點開始看',
    fit: '這些情況特別適合先諮詢',
    points: '優先檢查重點',
    servicesLabel: 'RELATED SERVICES',
    servicesTitle: '相關服務',
    serviceButton: '查看服務',
    columnsLabel: 'RELATED COLUMNS',
    columnsTitle: '相關專欄',
    readMore: '閱讀全文 →',
    attorneyHeading: '最適合處理此搜尋主題的律師',
    ctaLabel: 'NEXT STEP',
    ctaTitle: '若想先快速整理方向',
    ctaText: '公司設立、投資、訴訟與家事爭議的初期處理方式都不同。先提供資料後，我們可以先協助安排與曾俊瑋律師相關的諮詢流程。',
    contact: '聯絡諮詢',
    profile: '查看曾俊瑋律師簡介',
  },
  en: {
    terms: 'Related Searches',
    overview: 'What to review first on this page',
    fit: 'Good fit for consultation when',
    points: 'Priority review points',
    servicesLabel: 'RELATED SERVICES',
    servicesTitle: 'Related Services',
    serviceButton: 'View Service',
    columnsLabel: 'RELATED COLUMNS',
    columnsTitle: 'Related Columns',
    readMore: 'Read full article →',
    attorneyHeading: 'Lead attorney most relevant to this search',
    ctaLabel: 'NEXT STEP',
    ctaTitle: 'If you want the direction clarified quickly',
    ctaText: 'Company setup, investment, litigation, and family disputes all need different early-stage structuring. Send the core materials first and we can route the matter into the right consultation flow.',
    contact: 'Book Consultation',
    profile: 'View Wei Tseng Profile',
  },
} as const;

export default function IntentLandingPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: IntentPageSlug;
}) {
  const page = getIntentPage(locale, slug);
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);
  const path = `/${locale}/${slug}`;

  if (!page) {
    return null;
  }

  const l = labels[locale];
  const services = page.serviceSlugs.map((item) => getServiceArea(item)).filter((item): item is NonNullable<typeof item> => item != null);
  const columns = page.columnSlugs.map((item) => getColumnPost(item, locale)).filter((item): item is NonNullable<typeof item> => item != null);
  const collectionItems = [
    ...(profile
      ? [
          {
            name: profile.name,
            path: `/${locale}/lawyers/${profile.slug}`,
            description: profile.description,
          },
        ]
      : []),
    ...services.map((service) => ({
      name: service.title[locale],
      path: `/${locale}/services/${service.slug}`,
      description: summarize(service.intro[locale], 120),
    })),
    ...columns.map((column) => ({
      name: column.title,
      path: `/${locale}/columns/${column.slug}`,
      description: column.summary,
    })),
  ];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(locale, [
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : 'Home', path: `/${locale}` },
          { name: page.title, path },
        ])}
      />
      <JsonLd
        data={buildCollectionPageJsonLd({
          locale,
          path,
          name: page.title,
          description: page.description,
          items: collectionItems,
        })}
      />
      {profile ? (
        <JsonLd
          data={buildPersonJsonLd({
            locale,
            path: `/${locale}/lawyers/${profile.slug}`,
            name: profile.name,
            alternateName: profile.alternateNames,
            description: profile.description,
            image: profile.image,
            email: profile.email,
            jobTitle: profile.role,
            sameAs: profile.sameAs,
            knowsLanguage: profile.languages,
            knowsAbout: profile.practiceAreas,
            alumniOf: profile.education,
          })}
        />
      ) : null}
      <JsonLd data={faqSchema} />

      <PageHeader locale={locale} label={page.label} title={page.title} description={page.description}>
        <div className="intent-chip-wrap" aria-label={l.terms}>
          {page.searchTerms.map((term) => (
            <span key={term} className="intent-chip">
              {term}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="section section--light">
        <div className="container intent-layout">
          <div className="intent-main">
            <article className="intent-panel">
              <h2 className="profile-card-title">{l.overview}</h2>
              <ul className="intent-article-list">
                {page.heroPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <div className="intent-subgrid">
              <article className="intent-panel">
                <h2 className="profile-card-title">{l.fit}</h2>
                <ul className="intent-article-list">
                  {page.idealFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className="intent-panel">
                <h2 className="profile-card-title">{l.points}</h2>
                <ul className="intent-article-list">
                  {page.reviewPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <aside className="intent-sidebar">
            <AttorneyAuthorityCard locale={locale} heading={l.attorneyHeading} />
          </aside>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <SectionLabel>{l.servicesLabel}</SectionLabel>
          <h2 className="section-title">{l.servicesTitle}</h2>
          <OrnamentDivider />
          <div className="grid-bento contact-grid">
            {services.map((service) => (
              <article key={service.slug} className="card legal-card">
                <h3 className="card-title">{service.title[locale]}</h3>
                <div className="legal-card-copy">
                  <p>{summarize(service.intro[locale])}</p>
                  <Link href={`/${locale}/services/${service.slug}`} className="link-underline">
                    {l.serviceButton}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {columns.length > 0 ? (
        <section className="section section--light">
          <div className="container">
            <SectionLabel>{l.columnsLabel}</SectionLabel>
            <h2 className="section-title">{l.columnsTitle}</h2>
            <OrnamentDivider />
            <div className="svc-columns-grid">
              {columns.map((column) => (
                <Link key={column.slug} href={`/${locale}/columns/${column.slug}`} className="svc-col-card">
                  <span className="svc-col-badge">{column.categoryLabel}</span>
                  <h3 className="svc-col-card-title">{column.title}</h3>
                  <p className="svc-col-card-summary">{column.summary}</p>
                  <span className="svc-col-card-meta">
                    <time>{column.dateDisplay || column.date}</time>
                    {column.readTime ? <span>{column.readTime}</span> : null}
                  </span>
                  <span className="svc-col-card-link">{l.readMore}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <FAQAccordion locale={locale} items={page.faq} sectionClassName="section section--gray" />

      <section className="section section--light">
        <div className="container">
          <div className="intent-cta-card">
            <SectionLabel>{l.ctaLabel}</SectionLabel>
            <h2 className="section-title">{l.ctaTitle}</h2>
            <p className="section-lede">{l.ctaText}</p>
            <div className="intent-cta-actions">
              <Link href={`/${locale}/contact`} className="button">
                {l.contact}
              </Link>
              {profile ? (
                <Link href={`/${locale}/lawyers/${profile.slug}`} className="button button--outline">
                  {l.profile}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
