import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import KoHero from '@/components/ko-home/KoHero';
import KoMobileCta from '@/components/ko-home/KoMobileCta';
import { KoPractice, KoProcess, KoSituations } from '@/components/ko-home/KoSections';
import type { FAQItem } from '@/data/faq-content';
import styles from '@/components/ko-home/KoHome.module.css';

type Props = {
  posts: Parameters<typeof InsightsArchiveSection>[0]['posts'];
  faqItems: FAQItem[];
};

/**
 * ko home, Korean identity (2026-10-06, operator: 「왜 대만 디자인이랑 똑같이 했어? … 한국도 한국 개성으로 디자인 해봐」).
 * Its own system (src/components/ko-home/KoHome.module.css), not the zh-hant one: white paper, 쪽빛 indigo for every
 * action, Pretendard for Hangul, the firm's red seal as the only red; the first screen is the Taiwan-law glossary
 * (漢字 → 한글) beside the headline. Below: situations, the practice register, columns, the consultation process,
 * the attorney, one indigo chapter for the case and the figures, FAQ, offices and the closing call.
 * Copy comes from existing ko data (cited in each component). Display-only: the saved builder document is unchanged.
 */
export default function KoHomeBody({ posts, faqItems }: Props) {
  return (
    <div className={styles.home} id="ko-home" data-ko-design="home">
      <KoHero />
      <KoSituations />
      <KoPractice />
      <InsightsArchiveSection locale="ko" posts={posts} presentation="editorial" />
      <KoProcess />
      <HomeAttorneySplit locale="ko" presentation="editorial" />
      <div className={styles.chapter}>
        <HomeCaseResultsSplit locale="ko" presentation="editorial" />
        <HomeStatsSection locale="ko" plainLede />
      </div>
      <FAQAccordion locale="ko" items={faqItems} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="ko" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <HomeContactCta locale="ko" />
      <KoMobileCta />
    </div>
  );
}
