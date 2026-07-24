import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import Reveal from '@/components/Reveal';
import type { FAQItem } from '@/data/faq-content';
import { faqContent } from '@/data/faq-content';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { buildPersonJsonLd, buildSeoMetadata } from '@/lib/seo';
import type { SiteLocale } from '@/lib/locales';
import { getAllColumnPosts, type ColumnPost } from '@/lib/columns';

type HomeInsightArchivePosts = Parameters<typeof InsightsArchiveSection>[0]['posts'];

const homeSeoCopy: Record<SiteLocale, { title: string; description: string; keywords: string[] }> = {
  ko: {
    title: '대만 변호사·대만 소송·대만 회사설립',
    description:
      '대만 회사설립, 대만 소송, 대만 투자 법률 자문을 한국어와 일본어로 안내하는 법무법인 호정 공식 사이트입니다.',
    keywords: ['대만 변호사', '대만 소송', '대만 회사설립', '대만 법인설립', '대만 투자 법률'],
  },
  'zh-hant': {
    title: '台灣律師・台灣訴訟・台灣公司設立',
    description:
      '昊鼎國際法律事務所提供台灣公司設立、投資法務、民刑事訴訟與跨境法律顧問服務，支援韓文、中文與英文溝通。',
    keywords: ['台灣律師', '台灣訴訟', '台灣公司設立', '韓國企業台灣投資', '跨境法律顧問'],
  },
  en: {
    title: 'Taiwan Lawyer, Litigation & Company Setup',
    description:
      'Hovering International Law Firm advises on Taiwan company formation, litigation, and investment matters for Korean and international clients.',
    keywords: ['Taiwan lawyer', 'Taiwan litigation', 'Taiwan company setup', 'Taiwan investment law', 'Korean clients in Taiwan'],
  },
  ja: {
    title: '台湾弁護士・台湾訴訟・台湾会社設立',
    description:
      '台湾での会社設立、投資法務、民刑事訴訟について、韓国語・中国語・日本語で案内する昊鼎国際法律事務所の公式サイトです。',
    keywords: ['台湾弁護士', '台湾訴訟', '台湾会社設立', '台湾投資法務', '韓国企業の台湾進出'],
  },
};

export function getHomeLegacyMetadata(locale: SiteLocale): Metadata {
  const seo = homeSeoCopy[locale];
  return buildSeoMetadata({
    locale,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
  });
}

export function LegacyHomePageBody({
  locale,
  posts,
  faqItems,
}: {
  locale: SiteLocale;
  posts: HomeInsightArchivePosts;
  faqItems: FAQItem[];
}) {
  return (
    <>
      <HeroSearch locale={locale} />
      <Reveal>
        <InsightsArchiveSection locale={locale} posts={posts} />
      </Reveal>
      <Reveal>
        <ServicesBento locale={locale} id="practice" variant="default" />
      </Reveal>
      <Reveal>
        <HomeAttorneySplit locale={locale} />
      </Reveal>
      <Reveal>
        <HomeCaseResultsSplit locale={locale} />
      </Reveal>
      <Reveal>
        <HomeStatsSection locale={locale} />
      </Reveal>
      <Reveal>
        <FAQAccordion locale={locale} items={faqItems} id="faq" sectionClassName="section section--gray" />
      </Reveal>
      <Reveal>
        <OfficeMapTabs locale={locale} id="offices" sectionClassName="section section--light" />
      </Reveal>
      <Reveal>
        <HomeContactCta locale={locale} />
      </Reveal>
    </>
  );
}

export function mapColumnPostsToHomeInsights(posts: readonly ColumnPost[]): HomeInsightArchivePosts {
  return posts
    .filter((post) => Boolean(post.date) && Boolean(post.dateDisplay))
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      dateDisplay: post.dateDisplay,
      readTime: post.readTime,
      categoryLabel: post.categoryLabel,
      featuredImage: post.featuredImage,
      summary: post.summary,
    }));
}

function resolveLegacyHomeInsightPosts(locale: SiteLocale): HomeInsightArchivePosts {
  // JA/EN/ZH/KO all have file-backed columns where available.
  return mapColumnPostsToHomeInsights(getAllColumnPosts(locale));
}

export function HomeLegacyPage({ locale }: { locale: SiteLocale }) {
  const faqItems = faqContent[locale] ?? faqContent.en;
  const allPosts = resolveLegacyHomeInsightPosts(locale);
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);

  return (
    <>
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
      <LegacyHomePageBody locale={locale} posts={allPosts} faqItems={faqItems} />
    </>
  );
}
