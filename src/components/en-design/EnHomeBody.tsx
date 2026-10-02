import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import EnAcquisitionGuideLinks from '@/components/EnAcquisitionGuideLinks';
import type { FAQItem } from '@/data/faq-content';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import homeEditorialStyles from '@/components/HomeEditorial.module.css';
import { EN_HOME_FAQ_ORDER, EN_SERVICE_ORDER, orderByList } from './en-design-data';
import { EnHeroTrust, EnSituationIndex } from './EnHomeParts';
import EnFilm, { EN_DROPS_FILM } from './EnFilm';
import EnHowItWorks from './EnHowItWorks';
import EnFees from './EnFees';
import EnAttorneyStage from './EnAttorneyStage';
import EnEndStage from './EnEndStage';
import { EnHomeStageEffects } from './EnStageEffects';
import pageStyles from './EnPage.module.css';
import styles from './EnStory.module.css';

type Props = {
  posts: Parameters<typeof InsightsArchiveSection>[0]['posts'];
  faqItems: FAQItem[];
};

/**
 * Display-only hero copy (the saved canvas is not modified): the short headline, the former headline kept as
 * the tagline that opens the second screen, and the one sentence that says who you write to and how you meet
 * (the second sentence of the previous subtitle; the topics of its first sentence follow one screen later).
 */
const EN_HERO_OVERRIDES = {
  'section-label': 'Taiwan legal support for international businesses and individuals',
  headline: 'Taiwan law,\nin plain English.',
  subtitle: 'Email Attorney Wei Tseng and meet in Taipei or by video.',
};

/** The lead's opening words, set apart by colour only (HeroSearch `subtitleKeyPhrase`). */
const EN_HERO_KEY_PHRASE = 'Email Attorney Wei Tseng';

/** Situation shortcuts under the search; each goes to the page that already covers it. */
const EN_HERO_CHIPS = [
  { label: 'Work', href: '/en/services/labor' },
  { label: 'Family', href: '/en/services/family' },
  { label: 'Police', href: '/en/services/criminal' },
  { label: 'Accident', href: '/en/traffic-accidents' },
  { label: 'ARC & APRC', href: '/en/columns?topic=visa' },
  { label: 'Inheritance', href: '/en/columns?topic=inheritance' },
  { label: 'Company', href: '/en/services/investment' },
];

/**
 * en home, "Clear Night" (CONCEPT-V2, 2026-10-02): a short film about one evening in a Taiwanese city. Drops on
 * dark glass behind a letterbox (S0) and the credits (S0b); the reader's own situation in captions over rain
 * on the rooftops (S1); overseas companies (S2); the practice areas as one lit run of type (S3); the three
 * steps while the street comes into focus (S4); every fee with its conditions (S5); the attorney, her
 * languages and the figures from her profile (S6); insights, the case study, FAQ and offices (S7–S10); and a
 * clear night with one email address (S11). Copy, links and JSON-LD are unchanged (the FAQ JSON-LD keeps the
 * source order).
 */
export default function EnHomeBody({ posts, faqItems }: Props) {
  const orderedFaq = orderByList(faqItems, (item) => item.question, EN_HOME_FAQ_ORDER);
  return (
    <div className={`${homeEditorialStyles.root} ${pageStyles.root} ${styles.home}`} id="en-home" data-en-design="home">
      {/* First-screen faces: fetched with the document so the headline does not swap after paint. */}
      <link rel="preload" href="/fonts/en/inter-tight-latin-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/en/inter-latin-wght.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/en/en-glyphs.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <EnHomeStageEffects />
      <div className={styles.reel} data-reel="open">
        <EnFilm reel="open" media={EN_DROPS_FILM} priority />
        <span className={styles.curtainSentinel} data-curtain-sentinel aria-hidden="true" />
        <div className={styles.reelFlow}>
          <BuilderSurfaceProvider nodeId="home-hero" mode="published" overrides={EN_HERO_OVERRIDES} selectedSurfaceKey={null}>
            <HeroSearch
              locale="en"
              presentation="editorial"
              scrollHref="#start"
              quickMenus={EN_HERO_CHIPS}
              persistentQuickMenus
              media={<></>}
              subtitleKeyPhrase={EN_HERO_KEY_PHRASE}
              trustContent={<EnHeroTrust />}
            />
          </BuilderSurfaceProvider>
          <div className={styles.outro} aria-hidden="true" />
        </div>
      </div>
      <EnSituationIndex posts={posts} />
      <div className={styles.companies} id="companies">
        <EnAcquisitionGuideLinks locale="en" variant="full" />
      </div>
      <ServicesBento locale="en" id="practice" variant="default" presentation="editorial" order={EN_SERVICE_ORDER} layout="run" />
      <EnHowItWorks />
      <EnFees />
      <EnAttorneyStage />
      <InsightsArchiveSection locale="en" posts={posts} presentation="editorial" />
      <HomeCaseResultsSplit locale="en" presentation="editorial" hideMedia />
      <FAQAccordion locale="en" items={orderedFaq} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="en" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <EnEndStage />
    </div>
  );
}
