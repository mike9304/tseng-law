import type { Metadata } from 'next';
import Link from 'next/link';
import FAQAccordion from '@/components/FAQAccordion';
import IntentLandingPage from '@/components/IntentLandingPage';
import JsonLd from '@/components/JsonLd';
import PageHeader from '@/components/PageHeader';
import { getIntentPage, type IntentPageSlug } from '@/data/intent-pages';
import { normalizeSiteLocale, siteLocales, type SiteLocale } from '@/lib/locales';
import { buildBreadcrumbJsonLd, buildSeoMetadata } from '@/lib/seo';

const slug = 'taiwan-lawyer' as const;

const jaLabels = {
  overview: 'このページでまず確認する内容',
  fit: 'このような場合はご相談ください',
  points: '優先的に確認するポイント',
  process: '相談・手続きの進め方',
  prepare: '事前に準備するとよい資料',
  caution: '見落としやすいポイント',
  contact: '相談のお問い合わせ',
} as const;

export function generateMetadata({ params }: { params: { locale: SiteLocale } }): Metadata {
  const locale = normalizeSiteLocale(params.locale);
  const page = getIntentPage(locale, slug);

  if (!page) {
    return {};
  }

  return buildSeoMetadata({
    locale,
    title: page.title,
    description: page.description,
    path: `/${slug}`,
    keywords: page.keywords,
    alternateLocales: siteLocales,
  });
}

// IntentLandingPage is typed for builder Locale only; render the ja surface here with SiteLocale-ready components.
function JapaneseIntentLanding({ intentSlug }: { intentSlug: IntentPageSlug }) {
  const page = getIntentPage('ja', intentSlug);

  if (!page) {
    return null;
  }

  const path = `/ja/${intentSlug}`;
  const groups: Array<[string, string[]]> = [
    [jaLabels.overview, page.heroPoints],
    [jaLabels.fit, page.idealFor],
    [jaLabels.points, page.reviewPoints],
    [jaLabels.process, page.processFlow],
    [jaLabels.prepare, page.prepareChecklist],
    [jaLabels.caution, page.cautionPoints],
  ];

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd('ja', [
          { name: 'ホーム', path: '/ja' },
          { name: page.title, path },
        ])}
      />
      <PageHeader locale="ja" label={page.label} title={page.title} description={page.description} />
      <section className="section section--light">
        <div className="container">
          <div className="intent-triple-grid">
            {groups.map(([heading, items]) => (
              <article key={heading} className="intent-panel">
                <h2 className="profile-card-title">{heading}</h2>
                <ul className="intent-article-list">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <FAQAccordion locale="ja" items={page.faq} sectionClassName="section section--gray" />
      <section className="section section--light">
        <div className="container">
          <div className="intent-cta-card">
            <Link href="/ja/contact" className="button">
              {jaLabels.contact}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function TaiwanLawyerPage({ params }: { params: { locale: SiteLocale } }) {
  const locale = normalizeSiteLocale(params.locale);

  if (locale === 'ja') {
    return <JapaneseIntentLanding intentSlug={slug} />;
  }

  return <IntentLandingPage locale={locale} slug={slug} />;
}
