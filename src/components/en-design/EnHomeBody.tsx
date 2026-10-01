import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import EnAcquisitionGuideLinks from '@/components/EnAcquisitionGuideLinks';
import type { FAQItem } from '@/data/faq-content';
import { EN_HOME_FAQ_ORDER, EN_SERVICE_ORDER, orderByList } from './en-design-data';
import { EnHeroTrust, EnProcessAndFees, EnSituationIndex } from './EnHomeParts';
import EnHeroMedia from './EnHeroMedia';
import EnRailControls from './EnRailControls';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import homeEditorialStyles from '@/components/HomeEditorial.module.css';
import pageStyles from './EnPage.module.css';
import styles from './EnHome.module.css';

type Props = {
  posts: Parameters<typeof InsightsArchiveSection>[0]['posts'];
  faqItems: FAQItem[];
};

/**
 * en home (Opus 5.5 en lane, 2026-10-01). Arrangement for English-speaking readers:
 * hero with the attorney, languages and first-consultation fee beside the H1; "start here"
 * with individual situations first and the overseas-company paths beside them; practice areas
 * in the order those readers need them; process and fees; attorney; latest insights; case,
 * figures, FAQ (consultation, work, accident, family and criminal questions first), offices,
 * contact. Copy, links and JSON-LD are unchanged (the FAQ JSON-LD keeps the source order).
 */
/**
 * Display-only hero copy (the saved canvas is not modified): a short headline, the former headline kept as
 * the eyebrow line, and a two-line supporting sentence built from facts already on the page.
 */
const EN_HERO_OVERRIDES = {
  'section-label': 'Taiwan legal support for international businesses and individuals',
  headline: 'Taiwan law,\nin plain English.',
  subtitle:
    'Work, family, police and accident matters, residence permits, company setup. Email Attorney Wei Tseng and meet in Taipei or by video.',
};

/** Situation shortcuts under the first screen; each goes to the page that already covers it. */
const EN_HERO_CHIPS = [
  { label: 'Work', href: '/en/services/labor' },
  { label: 'Family', href: '/en/services/family' },
  { label: 'Police', href: '/en/services/criminal' },
  { label: 'Accident', href: '/en/traffic-accidents' },
  { label: 'ARC & APRC', href: '/en/columns?topic=visa' },
  { label: 'Inheritance', href: '/en/columns?topic=inheritance' },
  { label: 'Company', href: '/en/services/investment' },
];

export default function EnHomeBody({ posts, faqItems }: Props) {
  const orderedFaq = orderByList(faqItems, (item) => item.question, EN_HOME_FAQ_ORDER);
  return (
    <div className={`${homeEditorialStyles.root} ${pageStyles.root} ${styles.home}`} id="en-home" data-en-design="home">
      {/* First-screen faces: fetched with the document so the headline does not swap after paint. */}
      <link rel="preload" href="/fonts/en/inter-tight-latin-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link rel="preload" href="/fonts/en/ibm-plex-mono-500-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <BuilderSurfaceProvider nodeId="home-hero" mode="published" overrides={EN_HERO_OVERRIDES} selectedSurfaceKey={null}>
        <HeroSearch
          locale="en"
          presentation="editorial"
          scrollHref="#start"
          quickMenus={EN_HERO_CHIPS}
          persistentQuickMenus
          media={<EnHeroMedia />}
          trustContent={<EnHeroTrust />}
        />
      </BuilderSurfaceProvider>
      <div className={styles.start} id="start">
        <div className={`container ${styles.startGrid}`}>
          <EnSituationIndex posts={posts} />
          <div className={styles.business}>
            <EnAcquisitionGuideLinks locale="en" variant="full" />
          </div>
        </div>
      </div>
      <div className={styles.railWrap}>
        <ServicesBento locale="en" id="practice" variant="default" presentation="editorial" order={EN_SERVICE_ORDER} />
        <EnRailControls />
      </div>
      <EnProcessAndFees />
      <HomeAttorneySplit locale="en" presentation="editorial" />
      <InsightsArchiveSection locale="en" posts={posts} presentation="editorial" />
      <HomeCaseResultsSplit locale="en" presentation="editorial" />
      <HomeStatsSection locale="en" plainLede />
      <FAQAccordion locale="en" items={orderedFaq} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="en" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <HomeContactCta locale="en" />
    </div>
  );
}
