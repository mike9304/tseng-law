import type { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { getAllColumnPosts } from '@/lib/columns';
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
import BuilderPublishedHomeRenderer from '@/components/builder/BuilderPublishedHomeRenderer';
import { resolveInsightsDatasetPosts } from '@/lib/builder/datasets';
import { readBuilderHomeSnapshot } from '@/lib/builder/persistence';

export const dynamic = 'force-dynamic';

const homeSeoCopy: Record<Locale, { title: string; description: string; keywords: string[] }> = {
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
};

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const seo = homeSeoCopy[locale];

  return buildSeoMetadata({
    locale,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  noStore();
  const locale = normalizeLocale(params.locale);
  const faqItems = faqContent[locale];
  const [publishedSnapshot, allPosts] = await Promise.all([
    readBuilderHomeSnapshot('published', locale),
    Promise.resolve(getAllColumnPosts(locale)),
  ]);
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);
  const usePublishedBuilderSource = publishedSnapshot.persisted;

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
      {usePublishedBuilderSource ? (
        <BuilderPublishedHomeRenderer
          locale={locale}
          document={publishedSnapshot.snapshot.document}
          posts={resolveInsightsDatasetPosts(publishedSnapshot.snapshot.document, allPosts)}
          fallbackFaqItems={faqItems}
          state={publishedSnapshot.snapshot.state}
          revealSections
        />
      ) : (
        <LegacyHomePage locale={locale} posts={allPosts} faqItems={faqItems} />
      )}
    </>
  );
}

function LegacyHomePage({
  locale,
  posts,
  faqItems,
}: {
  locale: Locale;
  posts: ReturnType<typeof getAllColumnPosts>;
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
