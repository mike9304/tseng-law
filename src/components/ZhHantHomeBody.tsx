import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import ZhHantAudienceDoors from '@/components/zh-hant-home/ZhHantAudienceDoors';
import ZhHantMobileCta from '@/components/zh-hant-home/ZhHantMobileCta';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import type { FAQItem } from '@/data/faq-content';
import styles from './ZhHantDesign.module.css';

type Props = {
  posts: Parameters<typeof InsightsArchiveSection>[0]['posts'];
  faqItems: FAQItem[];
  heroOverrides?: Record<string, string>;
  quickMenus?: ReadonlyArray<{ label: string; href: string }>;
  attorneyIntro?: string;
};

/** Search shortcuts: real queries a Taiwanese reader types, run through the site search. */
const SEARCH_CHIPS = ['公司設立', '車禍', '離婚', '資遣費', '刑事', '商標'].map((q) => ({
  label: q,
  href: `/zh-hant/search?q=${encodeURIComponent(q)}`,
}));

/** Scenario labels taken word for word from each zh-hant service description. */
const SERVICE_SCENARIOS: Record<string, readonly string[]> = {
  investment: ['公司設立', '投資審查', '特殊許可'],
  civil: ['契約糾紛', '損害賠償', '消費者權益'],
  family: ['離婚', '親權', '繼承'],
  labor: ['解僱', '資遣費', '勞動契約'],
  criminal: ['偵查應對', '被告代理', '被害人代理'],
  ip: ['商標與專利', '著作權', '金融投資爭議'],
};

/**
 * zh-hant home, second pass (son7-87 / Opus 5.5, 2026-10-01): hero with reader-type
 * entry points, trust facts directly under it, scannable service grid, then attorney,
 * cases, columns, FAQ, offices and contact. Uses existing, sourced copy throughout;
 * locked strings (hero CTA, search prompt, stats lede, FAQ answers) are rendered as is.
 * `quickMenus` (saved July menus) is superseded by search shortcuts in this design.
 */
export default function ZhHantHomeBody({ posts, faqItems, heroOverrides = {}, attorneyIntro }: Props) {
  // The July stock canvas saved an English kicker ("TAIWAN LEGAL"); show the firm name instead.
  // Display-only: the saved canvas is not modified.
  const overrides = { ...heroOverrides, 'section-label': '昊鼎國際法律事務所' };
  return (
    <div className={styles.home} id="zh-hant-home" data-zh-hant-design="home">
      <BuilderSurfaceProvider nodeId="home-hero" mode="published" overrides={overrides} selectedSurfaceKey={null}>
        <HeroSearch
          locale="zh-hant"
          presentation="editorial"
          scrollHref="#practice"
          quickMenus={SEARCH_CHIPS}
          persistentQuickMenus
          trustContent={<ZhHantAudienceDoors />}
        />
      </BuilderSurfaceProvider>
      <HomeStatsSection locale="zh-hant" plainLede />
      <ServicesBento locale="zh-hant" id="practice" variant="default" presentation="editorial" scenarioTags={SERVICE_SCENARIOS} />
      <BuilderSurfaceProvider nodeId="home-attorney" mode="published" overrides={attorneyIntro === undefined ? {} : { 'intro-primary': attorneyIntro }} selectedSurfaceKey={null}>
        <HomeAttorneySplit locale="zh-hant" presentation="editorial" />
      </BuilderSurfaceProvider>
      <HomeCaseResultsSplit locale="zh-hant" presentation="editorial" />
      <InsightsArchiveSection locale="zh-hant" posts={posts} presentation="editorial" />
      <FAQAccordion locale="zh-hant" items={faqItems} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="zh-hant" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <HomeContactCta locale="zh-hant" />
      <ZhHantMobileCta />
    </div>
  );
}
