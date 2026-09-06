import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import FAQAccordion from '@/components/FAQAccordion';
import PageHeader from '@/components/PageHeader';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import CorporateAdvisorySection from '@/components/CorporateAdvisorySection';
import { CORPORATE_ADVISORY_ANCHOR, getCorporateAdvisory } from '@/data/corporate-advisory';
import { getIntentPage, type IntentPageSlug } from '@/data/intent-pages';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getColumnPost } from '@/lib/columns';
import type { SiteLocale } from '@/lib/locales';
import { getServiceArea } from '@/data/service-details';
import { getJapaneseServiceDetail } from '@/data/service-details-ja';
import styles from './IntentLandingPage.module.css';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildPersonJsonLd } from '@/lib/seo';
import {
  getConsultationCtaLabel,
  getConsultationPublicMailto,
  getSensitiveInformationWarning,
} from '@/lib/consultation/public-contact';
import { getAiIntakeDiscovery } from '@/lib/ai-intake/discovery';

function summarize(text: string, maxLength = 180) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

const labels = {
  ko: {
    terms: '관련 검색어',
    overview: '이 페이지에서 먼저 확인할 내용',
    fit: '이런 경우 상담이 맞습니다',
    points: '우선 검토 포인트',
    detailLabel: '진행 절차',
    detailTitle: '진행 흐름과 준비 자료',
    process: '상담 진행 흐름',
    prepare: '미리 준비하면 좋은 자료',
    caution: '놓치기 쉬운 포인트',
    servicesLabel: '관련 서비스',
    servicesTitle: '관련 서비스',
    serviceButton: '서비스 보기',
    columnsLabel: '관련 칼럼',
    columnsTitle: '관련 칼럼',
    readMore: '자세히 읽기 →',
    resourcesLabel: '관련 안내',
    resourcesTitle: '함께 보면 좋은 안내',
    attorneyHeading: '이 검색어와 가장 가까운 담당 대만 변호사',
    ctaLabel: '다음 단계',
    ctaTitle: '사안에 맞는 방향을 바로 정리하려면',
    ctaText: '회사설립, 투자, 소송, 가족 분쟁처럼 성격이 다른 사건은 초기에 구조를 잡는 방식이 달라집니다. 자료를 보내주시면 증준외 대만 변호사와 연결되는 상담 흐름을 먼저 안내합니다.',
    contact: '상담 문의',
    profile: '증준외 대만 변호사 프로필 보기',
    pricing: '비용안내 보기',
  },
  'zh-hant': {
    terms: '相關搜尋詞',
    overview: '先從這些重點開始看',
    fit: '這些情況特別適合先諮詢',
    points: '優先檢查重點',
    detailLabel: '流程',
    detailTitle: '流程與準備資料',
    process: '諮詢流程',
    prepare: '建議先準備的資料',
    caution: '容易忽略的重點',
    servicesLabel: '相關服務',
    servicesTitle: '相關服務',
    serviceButton: '查看服務',
    columnsLabel: '相關專欄',
    columnsTitle: '相關專欄',
    readMore: '閱讀全文 →',
    resourcesLabel: '相關指南',
    resourcesTitle: '延伸閱讀',
    attorneyHeading: '最適合處理此搜尋主題的律師',
    ctaLabel: '下一步',
    ctaTitle: '若想先快速整理方向',
    ctaText: '公司設立、投資、訴訟與家事爭議的初期處理方式都不同。先提供資料後，我們可以先協助安排與曾雋崴律師相關的諮詢流程。',
    contact: '聯絡諮詢',
    profile: '查看曾雋崴律師簡介',
    pricing: '查看收費',
  },
  en: {
    terms: 'Related Searches',
    overview: 'What to review first on this page',
    fit: 'Good fit for consultation when',
    points: 'Priority review points',
    detailLabel: 'PROCESS',
    detailTitle: 'Workflow and Preparation',
    process: 'Consultation flow',
    prepare: 'Initial summary and documents to organize later',
    caution: 'Points that are often missed',
    servicesLabel: 'RELATED SERVICES',
    servicesTitle: 'Related Services',
    serviceButton: 'View Service',
    columnsLabel: 'RELATED COLUMNS',
    columnsTitle: 'Related Columns',
    readMore: 'Read full article →',
    resourcesLabel: 'RELATED GUIDES',
    resourcesTitle: 'Related Guidance',
    attorneyHeading: 'Lead attorney most relevant to this search',
    ctaLabel: 'NEXT STEP',
    ctaTitle: 'If you want the direction clarified quickly',
    ctaText: 'Company setup, investment, litigation, and family disputes all need different early-stage structuring. Email a brief initial summary of the matter, any deadline, and how we can reach you. Other documents can follow after attorney instructions.',
    contact: 'Email about your Taiwan matter',
    profile: 'View Wei Tseng Profile',
    pricing: 'Fees and scope',
  },
  ja: {
    terms: '関連検索キーワード',
    overview: 'このページでまず確認する内容',
    fit: 'このような場合はご相談ください',
    points: '優先的に確認するポイント',
    detailLabel: '手続きの流れ',
    detailTitle: '進め方と準備資料',
    process: '相談・手続きの進め方',
    prepare: '初回の概要と、後ほど整理する資料',
    caution: '見落としやすいポイント',
    servicesLabel: '関連サービス',
    servicesTitle: '関連サービス',
    serviceButton: 'サービスを見る',
    columnsLabel: '関連コラム',
    columnsTitle: '関連コラム',
    readMore: '記事を読む →',
    resourcesLabel: '関連ガイド',
    resourcesTitle: 'あわせて読みたいガイド',
    attorneyHeading: 'この検索テーマに最も近い担当台湾弁護士',
    ctaLabel: '次のステップ',
    ctaTitle: '案件に合った方向性をすぐ整理したい場合',
    ctaText: '会社設立、投資、訴訟、家族間の紛争など、性質の異なる案件は初期の組み立て方が異なります。まずは案件の簡潔な概要、期限、連絡先をメールでお送りください。その他の資料は弁護士の案内後にご提出ください。',
    contact: '台湾の法律問題をメールで相談',
    profile: '曾雋崴台湾弁護士のプロフィールを見る',
    pricing: '費用・対応範囲',
  },
} as const;

const intentDirectContact = {
  en: {
    support: 'Consultations in English, Japanese, and Korean. Chinese is also available.',
    initialNote:
      'First email: a brief overview of the issue or business, any deadline, and how we can reach you. Sensitive materials only after attorney instructions.',
  },
  ja: {
    support: '英語・日本語・韓国語でご相談いただけます。中国語での相談にも対応しています。',
    initialNote:
      '初回メールでは、争点または事業の簡潔な概要、期限、連絡先のみをお送りください。機微情報は弁護士の指示後に提出してください。',
  },
} as const;

function isDirectContactLocale(locale: SiteLocale): locale is 'en' | 'ja' {
  return locale === 'en' || locale === 'ja';
}

const relatedResources: Record<
  IntentPageSlug,
  Array<{ href: string; label: Record<SiteLocale, string> }>
> = {
  'taiwan-lawyer': [
    {
      href: 'korean-lawyer-in-taiwan',
      label: {
        ko: '한국어 가능한 대만 변호사',
        'zh-hant': '可使用韓語溝通的台灣律師',
        en: 'Korean-speaking Taiwan lawyer',
        ja: '韓国語対応可能な台湾弁護士',
      },
    },
    {
      href: 'taiwan-company-setup-lawyer',
      label: {
        ko: '대만 법인설립·회사설립 변호사 안내',
        'zh-hant': '台灣公司設立律師指南',
        en: 'Taiwan company setup lawyer guide',
        ja: '台湾会社設立弁護士ガイド',
      },
    },
    {
      href: 'taiwan-litigation-lawyer',
      label: {
        ko: '대만 소송 변호사 안내',
        'zh-hant': '台灣訴訟律師指南',
        en: 'Taiwan litigation lawyer guide',
        ja: '台湾訴訟弁護士ガイド',
      },
    },
    {
      href: 'guides/taiwan-company-setup',
      label: {
        ko: '대만 회사설립 종합 가이드',
        'zh-hant': '台灣公司設立完整指南',
        en: 'Complete Taiwan company setup guide',
        ja: '台湾会社設立 総合ガイド',
      },
    },
  ],
  'taiwan-company-setup-lawyer': [
    {
      href: 'guides/taiwan-company-setup',
      label: {
        ko: '대만 회사설립 종합 가이드',
        'zh-hant': '台灣公司設立完整指南',
        en: 'Complete Taiwan company setup guide',
        ja: '台湾会社設立 総合ガイド',
      },
    },
    {
      href: 'korean-lawyer-in-taiwan',
      label: {
        ko: '한국어 가능한 대만 변호사',
        'zh-hant': '可使用韓語溝通的台灣律師',
        en: 'Korean-speaking Taiwan lawyer',
        ja: '韓国語対応可能な台湾弁護士',
      },
    },
    {
      href: 'taiwan-lawyer',
      label: {
        ko: '대만 변호사 검색 가이드',
        'zh-hant': '台灣律師搜尋指南',
        en: 'Taiwan lawyer search guide',
        ja: '台湾弁護士の探し方ガイド',
      },
    },
  ],
  'taiwan-litigation-lawyer': [
    {
      href: 'korean-lawyer-in-taiwan',
      label: {
        ko: '한국어 가능한 대만 변호사',
        'zh-hant': '可使用韓語溝通的台灣律師',
        en: 'Korean-speaking Taiwan lawyer',
        ja: '韓国語対応可能な台湾弁護士',
      },
    },
    {
      href: 'taiwan-lawyer',
      label: {
        ko: '대만 변호사 검색 가이드',
        'zh-hant': '台灣律師搜尋指南',
        en: 'Taiwan lawyer search guide',
        ja: '台湾弁護士の探し方ガイド',
      },
    },
  ],
};

const advisoryResource: {
  href: string;
  label: Record<SiteLocale, string>;
} = {
  href: `taiwan-lawyer#${CORPORATE_ADVISORY_ANCHOR}`,
  label: {
    ko: '대만 기업 법무 자문',
    'zh-hant': '台灣企業法務顧問',
    en: 'Taiwan corporate legal advisory',
    ja: '台湾の企業法務・法律顧問',
  },
};

function relatedResourceByHref(
  slug: IntentPageSlug,
  href: string,
) {
  return relatedResources[slug].find((item) => item.href === href);
}

function relatedResourcesFor(locale: SiteLocale, slug: IntentPageSlug) {
  const base = relatedResources[slug];
  const advisory = getCorporateAdvisory(locale) ? advisoryResource : null;

  if (locale === 'en') {
    if (slug === 'taiwan-lawyer') {
      return [
        relatedResourceByHref(slug, 'taiwan-company-setup-lawyer'),
        relatedResourceByHref(slug, 'taiwan-litigation-lawyer'),
        advisory,
        relatedResourceByHref(slug, 'guides/taiwan-company-setup'),
        relatedResourceByHref(slug, 'korean-lawyer-in-taiwan'),
      ].filter((item): item is NonNullable<typeof item> => item != null);
    }
    if (slug === 'taiwan-company-setup-lawyer') {
      return [
        relatedResourceByHref(slug, 'guides/taiwan-company-setup'),
        relatedResourceByHref(slug, 'taiwan-lawyer'),
        advisory,
        relatedResourceByHref(slug, 'korean-lawyer-in-taiwan'),
      ].filter((item): item is NonNullable<typeof item> => item != null);
    }
    return [
      relatedResourceByHref(slug, 'taiwan-lawyer'),
      advisory,
      relatedResourceByHref(slug, 'korean-lawyer-in-taiwan'),
    ].filter((item): item is NonNullable<typeof item> => item != null);
  }

  if (advisory) {
    return [...base, advisory];
  }

  return base;
}

export default function IntentLandingPage({
  locale,
  slug,
}: {
  locale: SiteLocale;
  slug: IntentPageSlug;
}) {
  const page = getIntentPage(locale, slug);
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);
  const path = `/${locale}/${slug}`;

  if (!page) {
    return null;
  }

  const l = labels[locale];
  const ai = getAiIntakeDiscovery(locale);
  const services = page.serviceSlugs
    .map((item) => {
      const area = getServiceArea(item);
      if (!area) {
        return null;
      }
      if (locale === 'ja') {
        const approved = getJapaneseServiceDetail(area.slug);
        return approved
          ? { slug: area.slug, title: approved.title, intro: approved.intro }
          : null;
      }
      return { slug: area.slug, title: area.title[locale], intro: area.intro[locale] };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);
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
      name: service.title,
      path: `/${locale}/services/${service.slug}`,
      description: summarize(service.intro, 120),
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
          { name: locale === 'ko' ? '홈' : locale === 'zh-hant' ? '首頁' : locale === 'ja' ? 'ホーム' : 'Home', path: `/${locale}` },
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
        {isDirectContactLocale(locale) ? (
          <div className="contact-email-actions">
            <p className="contact-email-actions__label">{intentDirectContact[locale].support}</p>
            <div className="contact-email-actions__row">
              <a href={getConsultationPublicMailto(locale)} className="button">
                {l.contact}
              </a>
              <Link href={`/${locale}/pricing`} className="button button--outline">
                {l.pricing}
              </Link>
            </div>
            <p className="contact-email-actions__note">{intentDirectContact[locale].initialNote}</p>
          </div>
        ) : (
          <div className="intent-chip-wrap" aria-label={l.terms}>
            {page.searchTerms.map((term) => (
              <span key={term} className="intent-chip">
                {term}
              </span>
            ))}
          </div>
        )}
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

      {slug === 'taiwan-lawyer' && (locale === 'en' || locale === 'ja') ? (
        <CorporateAdvisorySection locale={locale} />
      ) : null}

      <section className="section section--gray">
        <div className="container">
          <SectionLabel>{l.detailLabel}</SectionLabel>
          <h2 className="section-title">{l.detailTitle}</h2>
          <OrnamentDivider />
          <div className="intent-triple-grid">
            <article className="intent-panel">
              <h3 className="profile-card-title">{l.process}</h3>
              <ul className="intent-article-list">
                {page.processFlow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="intent-panel">
              <h3 className="profile-card-title">{l.prepare}</h3>
              <ul className="intent-article-list">
                {page.prepareChecklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {isDirectContactLocale(locale) ? (
                <p className="contact-email-actions__note">{getSensitiveInformationWarning(locale)}</p>
              ) : null}
            </article>

            <article className="intent-panel">
              <h3 className="profile-card-title">{l.caution}</h3>
              <ul className="intent-article-list">
                {page.cautionPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <SectionLabel>{l.servicesLabel}</SectionLabel>
          <h2 className="section-title">{l.servicesTitle}</h2>
          <OrnamentDivider />
          <div className="grid-bento contact-grid">
            {services.map((service) => (
              <article key={service.slug} className={`card legal-card ${styles.serviceCard}`}>
                <h3 className="card-title">{service.title}</h3>
                <div className="legal-card-copy">
                  <p>{summarize(service.intro)}</p>
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
            <div className={`svc-columns-grid ${styles.columnsGrid}`}>
              {columns.map((column) => (
                <Link key={column.slug} href={`/${locale}/columns/${column.slug}`} className="svc-col-card">
                  <div className="svc-col-card-media">
                    <Image src={column.featuredImage} alt={column.title} width={640} height={360} />
                    <div className="svc-col-card-overlay" />
                    <span className="svc-col-badge">{column.categoryLabel}</span>
                  </div>
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

      <section className="section section--light">
        <div className="container">
          <SectionLabel>{l.resourcesLabel}</SectionLabel>
          <h2 className="section-title">{l.resourcesTitle}</h2>
          <OrnamentDivider />
          <article className={`intent-panel ${styles.resources}`}>
            <ul className="intent-article-list">
              {relatedResourcesFor(locale, slug).map((item) => (
                <li key={item.href}>
                  <Link href={`/${locale}/${item.href}`} className="link-underline">
                    {item.label[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <FAQAccordion locale={locale} items={page.faq} sectionClassName="section section--gray" />

      <section className="section section--light">
        <div className="container">
          <div className={`intent-cta-card ${styles.ctaCard}`}>
            <SectionLabel>{l.ctaLabel}</SectionLabel>
            <h2 className="section-title">{l.ctaTitle}</h2>
            <p className="section-lede">{l.ctaText}</p>
            {ai.enabled ? <p className="section-lede">{ai.supportingCopy}</p> : null}
            <div className={`intent-cta-actions ${styles.ctaActions}`}>
              <a
                href={getConsultationPublicMailto(locale)}
                className="button"
                aria-label={`${l.contact} — ${getConsultationCtaLabel(locale)}`}
              >
                {l.contact}
              </a>
              {ai.enabled ? (
                <Link
                  href={ai.href}
                  className="button button--outline"
                  data-cta="intent-ai-intake-entry"
                  data-cta-dest="ai-intake"
                >
                  {ai.label}
                </Link>
              ) : null}
              <Link href={`/${locale}/pricing`} className="button button--outline">
                {l.pricing}
              </Link>
              {profile ? (
                <Link href={`/${locale}/lawyers/${profile.slug}`} className="button button--outline">
                  {l.profile}
                </Link>
              ) : null}
            </div>
            {isDirectContactLocale(locale) ? (
              <p className="contact-email-actions__note">{intentDirectContact[locale].initialNote}</p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
