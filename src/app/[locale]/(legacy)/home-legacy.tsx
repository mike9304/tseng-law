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
import TaiwanHeritageInterlude from '@/components/TaiwanHeritageInterlude';
import EnAcquisitionGuideLinks from '@/components/EnAcquisitionGuideLinks';
import Reveal from '@/components/Reveal';
import homeEditorialStyles from '@/components/HomeEditorial.module.css';
import ZhHantHomeBody from '@/components/ZhHantHomeBody';
import JaPageShell from '@/components/ja-design/JaPageShell';
import JaPersonalPaths from '@/components/ja-design/JaPersonalPaths';
import jaHomeStyles from '@/components/ja-design/JaHome.module.css';
import { JA_PINNED_COLUMN_SLUGS, JA_SERVICE_ORDER } from '@/components/ja-design/ja-arrangement';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import { getOrganizationName } from '@/lib/seo';
import EnHomeBody from '@/components/en-design/EnHomeBody';
import type { FAQItem } from '@/data/faq-content';
import { faqContent } from '@/data/faq-content';
import { getAttorneyProfile, primaryAttorneySlug } from '@/data/attorney-profiles';
import { resolveLiveRouteSeoDefault } from '@/lib/builder/seo/live-route-defaults';
import { buildFaqJsonLd, buildPersonJsonLd, buildSeoMetadata } from '@/lib/seo';
import type { SiteLocale } from '@/lib/locales';
import { getAllColumnPosts, type ColumnPost } from '@/lib/columns';
import { mapColumnPostsToHomeInsights as mapHomeInsights } from '@/lib/insights/home-insight-posts';

type HomeInsightArchivePosts = Parameters<typeof InsightsArchiveSection>[0]['posts'];

const homeSeoCopy: Record<SiteLocale, { title: string; description: string; keywords: string[] }> = {
  ko: {
    title: '대만 변호사·회사설립·소송',
    description:
      '대만 회사설립, 대만 소송, 대만 투자 법률 자문을 한국어·일본어·영어로 안내하는 법무법인 호정 공식 사이트입니다.',
    keywords: ['대만 변호사', '대만 소송', '대만 회사설립', '대만 법인설립', '대만 투자 법률'],
  },
  'zh-hant': {
    title: '台灣律師・台灣訴訟・台灣公司設立',
    description:
      '昊鼎國際法律事務所提供台灣公司設立、投資法務、民刑事訴訟與跨境法律顧問服務，支援韓文、中文與英文溝通。',
    keywords: ['台灣律師', '台灣訴訟', '台灣公司設立', '韓國企業台灣投資', '跨境法律顧問'],
  },
  en: {
    title: 'Taiwan Legal Services for Overseas Clients',
    description:
      'Taiwan legal assistance for overseas companies and individuals: company formation, business disputes, and civil claims, with office consultations in English.',
    keywords: ['English-speaking lawyer Taiwan', 'expat lawyer Taiwan', 'foreigners in Taiwan lawyer', 'Taiwan lawyer', 'Taiwan litigation', 'Taiwan company setup'],
  },
  ja: {
    title: '台湾弁護士・台湾訴訟・台湾会社設立',
    description:
      '台湾での会社設立、投資法務、民事・労働・家事紛争について、日本語で直接ご相談いただける台北の法律事務所・昊鼎国際法律事務所の公式サイトです。',
    keywords: ['台湾弁護士', '台湾 弁護士 日本語', '台湾会社設立', '台湾訴訟', '台湾投資法務'],
  },
};

export function getHomeLegacyMetadata(locale: SiteLocale): Metadata {
  const seo = homeSeoCopy[locale];
  const live = locale === 'ja' ? undefined : resolveLiveRouteSeoDefault(locale, '');
  return buildSeoMetadata({
    locale,
    title: live?.title ?? seo.title,
    description: live?.description ?? seo.description,
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
  if (locale === 'zh-hant') return <ZhHantHomeBody posts={posts} faqItems={faqItems} />;
  if (locale === 'ja') return jaHomeBody(posts, faqItems);
  if (locale === 'en') return <EnHomeBody posts={posts} faqItems={faqItems} />;
  return (
    <div className={homeEditorialStyles.root}>
      <HeroSearch locale={locale} presentation="editorial" />
      {/* Same place as the Korean home: the column archive sits right under
          the hero and is visible without waiting for a scroll reveal. */}
      <InsightsArchiveSection locale={locale} posts={posts} presentation="editorial" />
      {/* ja and en render their own home bodies above (jaHomeBody, EnHomeBody); the shared body no longer carries their entry block. */}
      <Reveal>
        <ServicesBento locale={locale} id="practice" variant="default" presentation="editorial" />
      </Reveal>
      <TaiwanHeritageInterlude locale={locale} />
      <Reveal>
        <HomeAttorneySplit locale={locale} presentation="editorial" />
      </Reveal>
      <Reveal>
        <HomeCaseResultsSplit locale={locale} presentation="editorial" />
      </Reveal>
      <Reveal>
        <HomeStatsSection locale={locale} />
      </Reveal>
      <Reveal>
        <FAQAccordion locale={locale} items={faqItems} id="faq" sectionClassName="section section--gray" layout="split" />
      </Reveal>
      <Reveal>
        <OfficeMapTabs locale={locale} id="offices" sectionClassName="section section--light" presentation="editorial" />
      </Reveal>
      <Reveal>
        <HomeContactCta locale={locale} />
      </Reveal>
    </div>
  );
}

/**
 * ja home (Opus 5.5 ja lane, 2026-10-01). Same components and copy as the shared legacy home,
 * re-ordered for Japanese readers: needs first (the 日系企業 entry block, then a row of
 * individual matters), practice areas in Japanese demand order, cornerstone columns pinned to
 * the top of the archive, then attorney, facts, case, FAQ, offices and contact. The decorative
 * heritage video band is left out of ja. A plain function (not a component) so the returned
 * element exposes its sections directly, like the shared body.
 */
function jaHomeBody(posts: HomeInsightArchivePosts, faqItems: FAQItem[]) {
  return (
    <JaPageShell page="home" className={jaHomeStyles.root}>
      {/* Display-only: the kicker reads as the firm name (the stock label is English). */}
      <BuilderSurfaceProvider nodeId="home-hero" mode="published" overrides={{ 'section-label': getOrganizationName('ja') }} selectedSurfaceKey={null}>
        <HeroSearch locale="ja" presentation="editorial" scrollHref="#overseas-entry-full-heading" />
      </BuilderSurfaceProvider>
      <Reveal>
        <EnAcquisitionGuideLinks locale="ja" variant="full" />
      </Reveal>
      <JaPersonalPaths />
      <Reveal>
        <ServicesBento locale="ja" id="practice" variant="default" presentation="editorial" order={JA_SERVICE_ORDER} />
      </Reveal>
      <InsightsArchiveSection locale="ja" posts={posts} presentation="editorial" pinnedSlugs={JA_PINNED_COLUMN_SLUGS} />
      <Reveal>
        <HomeAttorneySplit locale="ja" presentation="editorial" />
      </Reveal>
      <Reveal>
        <HomeStatsSection locale="ja" plainLede />
      </Reveal>
      <Reveal>
        <HomeCaseResultsSplit locale="ja" presentation="editorial" />
      </Reveal>
      <Reveal>
        <FAQAccordion locale="ja" items={faqItems} id="faq" sectionClassName="section section--gray" layout="split" />
      </Reveal>
      <Reveal>
        <OfficeMapTabs locale="ja" id="offices" sectionClassName="section section--light" presentation="editorial" />
      </Reveal>
      <Reveal>
        <HomeContactCta locale="ja" />
      </Reveal>
    </JaPageShell>
  );
}

export function mapColumnPostsToHomeInsights(posts: readonly ColumnPost[]): HomeInsightArchivePosts {
  return mapHomeInsights(posts);
}

function resolveLegacyHomeInsightPosts(locale: SiteLocale): HomeInsightArchivePosts {
  // JA/EN/ZH/KO all have file-backed columns where available.
  return mapColumnPostsToHomeInsights(getAllColumnPosts(locale));
}

export function HomeLegacyPage({ locale }: { locale: SiteLocale }) {
  const faqItems = faqContent[locale] ?? faqContent.en;
  const allPosts = resolveLegacyHomeInsightPosts(locale);
  const profile = getAttorneyProfile(locale, primaryAttorneySlug);
  const faqJsonLd = buildFaqJsonLd(
    faqItems.map((item) => ({ q: item.question, a: item.answer })),
    locale,
  );

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
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <LegacyHomePageBody locale={locale} posts={allPosts} faqItems={faqItems} />
    </>
  );
}
