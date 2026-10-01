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
import { EnHeroBrief, EnProcessAndFees, EnSituationIndex } from './EnHomeParts';
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
export default function EnHomeBody({ posts, faqItems }: Props) {
  const orderedFaq = orderByList(faqItems, (item) => item.question, EN_HOME_FAQ_ORDER);
  return (
    <div className={`${homeEditorialStyles.root} ${pageStyles.root} ${styles.home}`} id="en-home" data-en-design="home">
      <HeroSearch locale="en" presentation="editorial" scrollHref="#start" media={<EnHeroBrief />} />
      <div className={styles.start} id="start">
        <div className={`container ${styles.startGrid}`}>
          <EnSituationIndex posts={posts} />
          <div className={styles.business}>
            <EnAcquisitionGuideLinks locale="en" variant="full" />
          </div>
        </div>
      </div>
      <ServicesBento locale="en" id="practice" variant="default" presentation="editorial" order={EN_SERVICE_ORDER} />
      <EnProcessAndFees />
      <HomeAttorneySplit locale="en" presentation="editorial" />
      <InsightsArchiveSection locale="en" posts={posts} presentation="editorial" />
      <HomeCaseResultsSplit locale="en" presentation="editorial" />
      <HomeStatsSection locale="en" />
      <FAQAccordion locale="en" items={orderedFaq} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="en" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <HomeContactCta locale="en" />
    </div>
  );
}
