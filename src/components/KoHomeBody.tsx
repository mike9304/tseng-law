import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import type InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import KoHero from '@/components/ko-home/KoHero';
import KoMobileCta from '@/components/ko-home/KoMobileCta';
import { KoColumns, KoGlossary, KoPractice, KoProcess, KoSituations } from '@/components/ko-home/KoSections';
import type { FAQItem } from '@/data/faq-content';
import styles from '@/components/ko-home/KoHome.module.css';

type Props = {
  posts: Parameters<typeof InsightsArchiveSection>[0]['posts'];
  faqItems: FAQItem[];
};

/**
 * ko home (2026-10-06 Korean identity; 2026-10-07 operator: 「한국 세종로펌 디자인으로 비슷하게 변형, 색감도 비슷하게」).
 * The grammar of a Korean big-firm site in this firm's own material: a full-bleed photograph with the search laid
 * across its edge, then the Taiwan-law glossary, the newest columns as a cream/plum news grid, the practice tiles on a
 * greige band, situations, one deep-plum chapter for the case and the figures, the attorney, the consultation steps,
 * FAQ, offices and the closing call; square corners throughout (ko-home/KoHome.module.css). Copy comes from existing
 * ko data (cited in each component). Display-only: the saved builder document is unchanged.
 */
export default function KoHomeBody({ posts, faqItems }: Props) {
  return (
    <div className={styles.home} id="ko-home" data-ko-design="home">
      <KoHero />
      <KoGlossary />
      <KoColumns posts={posts} />
      <KoPractice />
      <KoSituations />
      <div className={styles.chapter}>
        <HomeCaseResultsSplit locale="ko" presentation="editorial" />
        <HomeStatsSection locale="ko" plainLede />
      </div>
      <HomeAttorneySplit locale="ko" presentation="editorial" />
      <KoProcess />
      <FAQAccordion locale="ko" items={faqItems} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="ko" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <HomeContactCta locale="ko" />
      <KoMobileCta />
    </div>
  );
}
