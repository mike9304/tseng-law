import Link from 'next/link';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import FAQAccordion from '@/components/FAQAccordion';
import PageHeader from '@/components/PageHeader';
import OrnamentDivider from '@/components/OrnamentDivider';
import AttorneyAuthorityCard from '@/components/AttorneyAuthorityCard';
import CorporateAdvisorySection from '@/components/CorporateAdvisorySection';
import { CORPORATE_ADVISORY_ANCHOR, getCorporateAdvisory } from '@/data/corporate-advisory';
import { getIntentPage, getIntentTopFaqs, type IntentPageSlug } from '@/data/intent-pages';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { getColumnPost } from '@/lib/columns';
import { isSiteLocale, type SiteLocale } from '@/lib/locales';
import { getServiceArea } from '@/data/service-details';
import { getJapaneseServiceDetail } from '@/data/service-details-ja';
import styles from './IntentLandingPage.module.css';
import EnPageShell from '@/components/en-design/EnPageShell';
import enStyles from '@/components/en-design/EnLanding.module.css';
import JaPageShell from '@/components/ja-design/JaPageShell';
import jaLandingStyles from '@/components/ja-design/JaLanding.module.css';
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildPersonJsonLd } from '@/lib/seo';
import {
  getConsultationCtaLabel,
  getConsultationPublicMailto,
  getSensitiveInformationWarning,
} from '@/lib/consultation/public-contact';
import { getAiIntakeDiscovery } from '@/lib/ai-intake/discovery';
import { LITIGATION_SITUATION_NAV } from '@/data/multilingual-international-v2';
import ForeignMatterRouter from '@/components/ForeignMatterRouter';
import { getForeignMatterRouter } from '@/data/foreign-matter-router';
import ZhHantIntentHeaderActions from '@/components/zh-hant-intent/ZhHantIntentHeaderActions';
import { ZhHantTrail } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import zhStyles from '@/components/zh-hant-intent/ZhHantIntent.module.css';
import { appleDesignRootProps, isAppleDesignLocale } from '@/lib/apple-design-locales';

function summarize(text: string, maxLength = 180) {
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trimEnd()}…` : text;
}

const labels = {
  ko: {
    terms: '관련 주제',
    overview: '상담 범위',
    fit: '상담이 필요한 경우',
    points: '우선 검토 포인트',
    detailLabel: '진행 절차',
    detailTitle: '진행 흐름과 준비 자료',
    process: '진행 절차',
    prepare: '미리 준비하면 좋은 자료',
    caution: '놓치기 쉬운 포인트',
    servicesTitle: '관련 서비스',
    serviceButton: '서비스 보기',
    columnsTitle: '관련 칼럼',
    readMore: '자세히 읽기 →',
    resourcesLabel: '관련 안내',
    resourcesTitle: '함께 보면 좋은 안내',
    ctaTitle: '상담 문의',
    ctaText: '사건 개요, 대만과의 관련성, 기한과 연락처를 간단히 보내 주세요. 업무를 맡을 수 있는지와 이해충돌 여부를 확인한 뒤 상담 범위와 비용을 안내합니다. 민감한 서류는 변호사 안내 후 보내 주세요.',
    contact: '상담 문의',
    profile: '증준외 대만 변호사 프로필 보기',
    pricing: '비용안내 보기',
  },
  'zh-hant': {
    terms: '相關主題',
    overview: '諮詢範圍',
    fit: '常見情況',
    points: '優先確認事項',
    detailLabel: '流程',
    detailTitle: '流程與準備資料',
    process: '諮詢流程',
    prepare: '建議先準備的資料',
    caution: '容易忽略的重點',
    servicesTitle: '相關服務',
    serviceButton: '查看服務',
    columnsTitle: '相關專欄',
    readMore: '閱讀全文 →',
    resourcesLabel: '相關指南',
    resourcesTitle: '延伸閱讀',
    ctaTitle: '電子郵件諮詢',
    ctaText: '請先簡述案情、與台灣的關聯、期限及聯絡方式；我們會先確認是否適合承接及有無利益衝突，再說明服務範圍與費用。敏感文件請待律師指示後再提供。',
    contact: '電子郵件諮詢',
    profile: '查看曾雋崴律師簡介',
    pricing: '收費標準',
  },
  en: {
    terms: 'Related topics',
    overview: 'What we cover',
    fit: 'Common situations',
    points: 'Priority review points',
    detailLabel: 'PROCESS',
    detailTitle: 'Workflow and Preparation',
    process: 'Consultation flow',
    prepare: 'Initial summary and documents to organize later',
    caution: 'Points that are often missed',
    servicesTitle: 'Related Services',
    serviceButton: 'View Service',
    columnsTitle: 'Related Columns',
    readMore: 'Read full article →',
    resourcesLabel: 'Guides',
    resourcesTitle: 'Related Guidance',
    ctaTitle: 'Email about your Taiwan matter',
    ctaText: 'Send a brief initial summary of the issue, the Taiwan connection, any deadline, and how we can reach you. We will confirm whether we can take the matter and whether any conflict exists, then explain scope and fees. Other documents can follow after attorney instructions. For consultation fees, see Fees and scope.',
    contact: 'Email about your Taiwan matter',
    profile: 'View Wei Tseng’s profile',
    pricing: 'Fees and scope',
  },
  ja: {
    terms: '関連テーマ',
    overview: '相談の範囲',
    fit: 'よくある相談',
    points: '優先的に確認するポイント',
    detailLabel: '手続きの流れ',
    detailTitle: '進め方と準備資料',
    process: '相談・手続きの進め方',
    prepare: '初回の概要と、後ほど整理する資料',
    caution: '見落としやすいポイント',
    servicesTitle: '関連サービス',
    serviceButton: 'サービスを見る',
    columnsTitle: '関連コラム',
    readMore: '記事を読む →',
    resourcesLabel: '関連ガイド',
    resourcesTitle: 'あわせて読みたいガイド',
    ctaTitle: 'メールで相談',
    ctaText: 'まずは案件の概要、台湾との関連、期限と連絡先をお送りください。受任可否と利益相反の有無を確認したうえで、相談範囲と費用をご案内します。その他の資料は弁護士の案内後にご提出ください。',
    contact: '台湾の法律問題をメールで相談',
    profile: '曾雋崴台湾弁護士のプロフィールを見る',
    pricing: '費用・対応範囲',
  },
} as const;

const intentDirectContact = {
  en: {
    support: 'Attorney Wei Tseng consults directly in English, Chinese, Korean, and Japanese.',
    initialNote:
      'First inquiry: a brief overview of the issue or business, the Taiwan connection, any deadline, and how we can reach you. Time zone and how you found us are optional. Sensitive materials only after attorney instructions.',
  },
  ja: {
    support: '曾雋崴弁護士に日本語で直接ご相談いただけます（中国語・英語・韓国語にも対応）。',
    initialNote:
      '初回のお問い合わせでは、争点または事業の簡潔な概要、期限、連絡先のみをお送りください。機微情報は弁護士の指示後に提出してください。',
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
      href: 'lawyers/wei-tseng',
      label: {
        ko: '증준외 변호사 프로필',
        'zh-hant': '曾雋崴律師簡介',
        en: 'Attorney Wei Tseng profile',
        ja: '曾雋崴弁護士のプロフィール',
      },
    },
    {
      href: 'taiwan-company-setup-lawyer',
      label: {
        ko: '대만 회사설립 상담',
        'zh-hant': '台灣公司設立法律諮詢',
        en: 'Taiwan company setup lawyer guide',
        ja: '台湾での会社設立のご相談',
      },
    },
    {
      href: 'taiwan-litigation-lawyer',
      label: {
        ko: '대만 소송 변호사 안내',
        'zh-hant': '台灣訴訟法律諮詢',
        en: 'Taiwan litigation lawyer guide',
        ja: '台湾での訴訟・紛争のご相談',
      },
    },
    {
      href: 'guides/taiwan-company-setup',
      label: {
        ko: '대만 회사설립 종합 가이드',
        'zh-hant': '台灣公司設立完整指南',
        en: 'Read the Company Setup Guide',
        ja: '台湾会社設立 総合ガイド',
      },
    },
    {
      href: 'korean-lawyer-in-taiwan',
      label: {
        ko: '한국어 가능한 대만 변호사',
        'zh-hant': '可使用韓文溝通的台灣律師',
        en: 'Korean-speaking Taiwan lawyer',
        ja: '韓国語対応可能な台湾弁護士',
      },
    },
  ],
  'taiwan-company-setup-lawyer': [
    {
      href: 'lawyers/wei-tseng',
      label: {
        ko: '증준외 변호사 프로필',
        'zh-hant': '曾雋崴律師簡介',
        en: 'Attorney Wei Tseng profile',
        ja: '曾雋崴弁護士のプロフィール',
      },
    },
    {
      href: 'guides/taiwan-company-setup',
      label: {
        ko: '대만 회사설립 종합 가이드',
        'zh-hant': '台灣公司設立完整指南',
        en: 'Read the Company Setup Guide',
        ja: '台湾会社設立 総合ガイド',
      },
    },
    {
      href: 'korean-lawyer-in-taiwan',
      label: {
        ko: '한국어 가능한 대만 변호사',
        'zh-hant': '可使用韓文溝通的台灣律師',
        en: 'Korean-speaking Taiwan lawyer',
        ja: '韓国語対応可能な台湾弁護士',
      },
    },
    {
      href: 'taiwan-lawyer',
      label: {
        ko: '대만 법률상담 안내',
        'zh-hant': '台灣律師指南',
        en: 'Taiwan lawyer search guide',
        ja: '台湾の法律相談について',
      },
    },
  ],
  'taiwan-litigation-lawyer': [
    {
      href: 'lawyers/wei-tseng',
      label: {
        ko: '증준외 변호사 프로필',
        'zh-hant': '曾雋崴律師簡介',
        en: 'Attorney Wei Tseng profile',
        ja: '曾雋崴弁護士のプロフィール',
      },
    },
    {
      href: 'taiwan-lawyer',
      label: {
        ko: '대만 법률상담 안내',
        'zh-hant': '台灣律師指南',
        en: 'Taiwan lawyer search guide',
        ja: '台湾の法律相談について',
      },
    },
    {
      href: 'korean-lawyer-in-taiwan',
      label: {
        ko: '한국어 가능한 대만 변호사',
        'zh-hant': '可使用韓文溝通的台灣律師',
        en: 'Korean-speaking Taiwan lawyer',
        ja: '韓国語対応可能な台湾弁護士',
      },
    },
  ],
  'taiwan-semiconductor-supplier-legal': [
    {
      href: 'semiconductor',
      label: {
        ko: '반도체 기업 실무가이드',
        'zh-hant': '半導體企業實務指南',
        en: 'Semiconductor practice guide',
        ja: '半導体企業実務ガイド',
      },
    },
    {
      href: 'lawyers/wei-tseng',
      label: {
        ko: '증준외 변호사 프로필',
        'zh-hant': '曾雋崴律師簡介',
        en: 'Attorney Wei Tseng profile',
        ja: '曾雋崴弁護士のプロフィール',
      },
    },
    {
      href: 'taiwan-company-setup-lawyer',
      label: {
        ko: '대만 회사설립 상담',
        'zh-hant': '台灣公司設立律師指南',
        en: 'Taiwan company setup lawyer guide',
        ja: '台湾での会社設立のご相談',
      },
    },
    {
      href: 'taiwan-litigation-lawyer',
      label: {
        ko: '대만 소송 변호사 안내',
        'zh-hant': '台灣訴訟律師指南',
        en: 'Taiwan litigation lawyer guide',
        ja: '台湾での訴訟・紛争のご相談',
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

const enCivilServiceResource = {
  href: 'services/civil',
  label: {
    ko: 'Contract disputes and civil claims',
    'zh-hant': 'Contract disputes and civil claims',
    en: 'Contract disputes and civil claims',
    ja: 'Contract disputes and civil claims',
  },
} as const;

const enAssistanceResources: Array<{ href: string; label: Record<SiteLocale, string> }> = [
  {
    href: 'services/investment',
    label: {
      ko: 'Company formation and tax-accounting assistance',
      'zh-hant': 'Company formation and tax-accounting assistance',
      en: 'Company formation and tax-accounting assistance',
      ja: 'Company formation and tax-accounting assistance',
    },
  },
  {
    href: 'contact',
    label: {
      ko: 'Residence-permit assistance',
      'zh-hant': 'Residence-permit assistance',
      en: 'Residence-permit assistance',
      ja: 'Residence-permit assistance',
    },
  },
];

const enOfficialReferences: Array<{ href: string; label: Record<SiteLocale, string> }> = [
  {
    href: 'https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus01?lang=eng&menuNum=7&search=InvestmentStatus01',
    label: {
      ko: 'Invest Taiwan — official investment information (reference)',
      'zh-hant': 'Invest Taiwan — official investment information (reference)',
      en: 'Invest Taiwan — official investment information (reference)',
      ja: 'Invest Taiwan — official investment information (reference)',
    },
  },
  {
    href: 'https://www.immigration.gov.tw/5475/5478/141465/141469/',
    label: {
      ko: 'National Immigration Agency — residence information (reference)',
      'zh-hant': 'National Immigration Agency — residence information (reference)',
      en: 'National Immigration Agency — residence information (reference)',
      ja: 'National Immigration Agency — residence information (reference)',
    },
  },
  {
    href: 'https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax',
    label: {
      ko: 'Ministry of Finance eTax — profit-seeking enterprise income tax Q&A (reference)',
      'zh-hant': 'Ministry of Finance eTax — profit-seeking enterprise income tax Q&A (reference)',
      en: 'Ministry of Finance eTax — profit-seeking enterprise income tax Q&A (reference)',
      ja: 'Ministry of Finance eTax — profit-seeking enterprise income tax Q&A (reference)',
    },
  },
];

function isExternalHref(href: string) {
  return href.startsWith('https://') || href.startsWith('http://');
}

function resourceHref(locale: SiteLocale, href: string) {
  return isExternalHref(href) ? href : `/${locale}/${href}`;
}

function relatedResourcesFor(locale: SiteLocale, slug: IntentPageSlug) {
  const base = relatedResources[slug];
  const advisory = getCorporateAdvisory(locale) ? advisoryResource : null;

  if (slug === 'taiwan-semiconductor-supplier-legal') {
    return advisory ? [...base, advisory] : base;
  }

  if (locale === 'en') {
    const assistance =
      slug === 'taiwan-litigation-lawyer' ? [] : enAssistanceResources;
    const official =
      slug === 'taiwan-litigation-lawyer' ? [] : enOfficialReferences;

    if (slug === 'taiwan-lawyer') {
      return [
        relatedResourceByHref(slug, 'taiwan-company-setup-lawyer'),
        relatedResourceByHref(slug, 'taiwan-litigation-lawyer'),
        advisory,
        relatedResourceByHref(slug, 'guides/taiwan-company-setup'),
        ...assistance,
        ...official,
      ].filter((item): item is NonNullable<typeof item> => item != null);
    }
    if (slug === 'taiwan-company-setup-lawyer') {
      return [
        relatedResourceByHref(slug, 'guides/taiwan-company-setup'),
        relatedResourceByHref(slug, 'taiwan-lawyer'),
        advisory,
        ...assistance,
        ...official,
      ].filter((item): item is NonNullable<typeof item> => item != null);
    }
    return [
      enCivilServiceResource,
      relatedResourceByHref(slug, 'taiwan-lawyer'),
      relatedResourceByHref('taiwan-lawyer', 'taiwan-company-setup-lawyer'),
      advisory,
      ...assistance,
    ].filter((item): item is NonNullable<typeof item> => item != null);
  }

  // WO-X1 (J21): the Japanese landings no longer send readers to the
  // Korean-speaker landing; the page itself stays published.
  const localized = locale === 'ja'
    ? base.filter((item) => item.href !== 'korean-lawyer-in-taiwan')
    : base;

  if (advisory) {
    return [...localized, advisory];
  }

  return localized;
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
  const ctaText = page.ctaTextOverride ?? l.ctaText;
  const topFaqs = getIntentTopFaqs(page);
  const ai = getAiIntakeDiscovery(locale);
  const services = page.serviceSlugs
    .map((item) => {
      const area = getServiceArea(item);
      if (!area) {
        return null;
      }
      // 페이지별 블러브가 있으면 공용 서비스 소개 대신 그 문구를 쓴다.
      const blurb = page.serviceBlurbs?.[area.slug];
      if (locale === 'ja') {
        const approved = getJapaneseServiceDetail(area.slug);
        return approved
          ? { slug: area.slug, title: approved.title, intro: blurb ?? approved.intro }
          : null;
      }
      return { slug: area.slug, title: area.title[locale], intro: blurb ?? area.intro[locale] };
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

  const body = (
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
        {isAppleDesignLocale(locale) ? <ZhHantIntentHeaderActions contactLabel={l.contact} pricingLabel={l.pricing} locale={locale} /> : null}
        {isSiteLocale(locale) && slug === 'taiwan-litigation-lawyer' ? (
          <nav
            className="intent-situation-nav"
            aria-label={LITIGATION_SITUATION_NAV[locale].aria}
          >
            <p className="contact-email-actions__label">{LITIGATION_SITUATION_NAV[locale].lead}</p>
            <ul className="intent-article-list">
              {/* WO-X2 (EN-02): no visible link to the unreviewed
                  debt-recovery draft (/taiwan-debt-recovery-lawyer); the civil
                  item below covers contract disputes. */}
              <li>
                <Link
                  href={`/${locale}/services/civil`}
                  className="link-underline"
                  data-en-path={locale === 'en' ? 'civil-claims' : undefined}
                >
                  {LITIGATION_SITUATION_NAV[locale].civil}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/services/criminal`}
                  className="link-underline"
                  data-en-path={locale === 'en' ? 'criminal' : undefined}
                >
                  {LITIGATION_SITUATION_NAV[locale].criminal}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/services/family`}
                  className="link-underline"
                  data-en-path={locale === 'en' ? 'family' : undefined}
                >
                  {LITIGATION_SITUATION_NAV[locale].family}
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
        {isDirectContactLocale(locale) ? (
          <div className="contact-email-actions">
            <p className="contact-email-actions__label">{intentDirectContact[locale].support}</p>
            <div className="contact-email-actions__row">
              {slug === 'taiwan-lawyer' ? (
                <Link href={`/${locale}/contact`} className="button">
                  {getForeignMatterRouter(locale).inquiryAction}
                </Link>
              ) : null}
              <a href={getConsultationPublicMailto(locale)} className={slug === 'taiwan-lawyer' ? 'button button--outline' : 'button'}>
                {l.contact}
              </a>
              <Link href={`/${locale}/pricing`} className="button button--outline">
                {l.pricing}
              </Link>
            </div>
            <p className="contact-email-actions__note">{intentDirectContact[locale].initialNote}</p>
          </div>
        ) : null}
      </PageHeader>

      {slug === 'taiwan-lawyer' ? <ForeignMatterRouter locale={locale} /> : null}

      <section className={`section section--light ${styles.root}`}>
        <div className={`container intent-layout ${styles.layout}`}>
          <div className={`intent-main ${styles.main}${locale === 'en' ? ` ${styles.mainWide}` : ''}`}>
            <article className={`intent-panel ${styles.panel}`}>
              <h2 className="profile-card-title">{l.overview}</h2>
              <ul className="intent-article-list">
                {page.heroPoints.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <div className={`intent-subgrid ${styles.subgrid}`}>
              <article className={`intent-panel ${styles.panel}`}>
                <h2 className="profile-card-title">{l.fit}</h2>
                <ul className="intent-article-list">
                  {page.idealFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article className={`intent-panel ${styles.panel}`}>
                <h2 className="profile-card-title">{l.points}</h2>
                <ul className="intent-article-list">
                  {page.reviewPoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          <aside className={`intent-sidebar ${styles.sidebar}`}>
            <AttorneyAuthorityCard locale={locale} />
          </aside>
        </div>
      </section>

      {topFaqs.length > 0 ? (
        <section className="section section--light">
          <div className="container">
            <article className="intent-panel">
              <dl className="intent-article-list">
                {topFaqs.map((item) => (
                  <div key={item.question}>
                    <dt className="profile-card-title">{item.question}</dt>
                    <dd>{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
        </section>
      ) : null}

      {slug === 'taiwan-lawyer' && (locale === 'en' || locale === 'ja') ? (
        <CorporateAdvisorySection locale={locale} />
      ) : null}

      <section className={`section section--gray ${styles.root}`}>
        <div className="container">
          <h2 className="section-title">{l.detailTitle}</h2>
          <OrnamentDivider />
          <div className={`intent-triple-grid ${styles.triple}`}>
            <article className={`intent-panel ${styles.panel}`}>
              <h3 className="profile-card-title">{l.process}</h3>
              <ul className="intent-article-list">
                {page.processFlow.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className={`intent-panel ${styles.panel}`}>
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

            <article className={`intent-panel ${styles.panel}`}>
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

      <section className={`section section--gray ${styles.root}`}>
        <div className="container">
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
        <section className={`section section--light ${styles.root}`}>
          <div className="container">
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
                  <span className="svc-col-card-link">{isAppleDesignLocale(locale) ? <>{l.readMore.replace(/\s*→$/, '')}<ZhHantTrail /></> : l.readMore}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={`section section--light ${styles.root}`}>
        <div className="container">
          <h2 className="section-title">{l.resourcesTitle}</h2>
          <OrnamentDivider />
          <article className={`intent-panel ${styles.resources}`}>
            <ul className="intent-article-list">
              {relatedResourcesFor(locale, slug).map((item) => {
                const href = resourceHref(locale, item.href);
                const label = item.label[locale];
                return (
                  <li key={item.href}>
                    {isExternalHref(item.href) ? (
                      <a href={href} className="link-underline" target="_blank" rel="noopener noreferrer">
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className="link-underline">
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>
        </div>
      </section>

      <FAQAccordion locale={locale} items={page.faq} sectionClassName="section section--gray" layout="split" />

      <section className={`section section--light ${styles.root}`}>
        <div className="container">
          <div className={`intent-cta-card ${styles.ctaCard}`}>
            <h2 className="section-title">{l.ctaTitle}</h2>
            <p className="section-lede">{ctaText}</p>
            {ai.enabled ? <p className="section-lede">{ai.supportingCopy}</p> : null}
            <div className={`intent-cta-actions ${styles.ctaActions}`}>
              {slug === 'taiwan-lawyer' ? (
                <Link href={`/${locale}/contact`} className="button">
                  {getForeignMatterRouter(locale).inquiryAction}
                </Link>
              ) : null}
              <a
                href={getConsultationPublicMailto(locale)}
                className={slug === 'taiwan-lawyer' ? 'button button--outline' : 'button'}
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
          </div>
        </div>
      </section>
    </>
  );

  // zh-hant and (since 2026-10-06) ko: one wrapper scopes the Apple-language styles (zh-hant-intent/ZhHantIntent.module.css).
  if (isAppleDesignLocale(locale)) {
    return (
      <div className={zhStyles.root} {...appleDesignRootProps(locale, 'intent')}>
        {body}
      </div>
    );
  }
  // ja 昊 V2 inner pages (2026-10-02): same blocks inside the ja wrapper, restyled by JaLanding.module.css.
  if (locale === 'ja') return <JaPageShell page="landing" className={jaLandingStyles.root}>{body}</JaPageShell>;
  // en (Clear Night inner pages): the same landing body inside the en wrapper; other locales render it as before.
  return locale === 'en'
    ? <EnPageShell page="landing"><div className={enStyles.landing}>{body}</div></EnPageShell>
    : body;
}
