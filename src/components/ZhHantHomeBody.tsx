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
import ZhHantEngagement from '@/components/zh-hant-home/ZhHantEngagement';
import { ZH_HANT_FEATURED_COLUMN_SLUGS } from '@/data/zh-hant-column-curation';
import { ZH_HANT_DOMESTIC_SERVICE_ORDER, ZH_HANT_SERVICE_SCENARIOS } from '@/components/zh-hant-home/zh-hant-service-scenarios';
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

/** Search shortcuts: everyday disputes a Taiwanese reader types, run through the site search. */
const SEARCH_CHIPS = ['車禍', '離婚', '繼承', '資遣費', '詐騙', '刑事'].map((q) => ({
  label: q,
  href: `/zh-hant/search?q=${encodeURIComponent(q)}`,
}));


/**
 * zh-hant home for Taiwanese readers (son7-87 / Opus 5.5, 2026-10-01, operator direction: disputes first,
 * company setup is for foreign clients): hero with reader-type entry points, services in domestic order,
 * practical columns, how to retain the firm, then attorney, cases, trust facts, FAQ, offices and contact.
 * Locked strings (hero CTA, search prompt, stats lede, FAQ answers) are rendered as is.
 * `quickMenus` (saved July menus) is superseded by search shortcuts in this design.
 */
/** Home FAQ in domestic order: company-setup questions (mostly foreign clients) move to the end; text unchanged. */
function domesticFaqOrder(items: FAQItem[]): FAQItem[] {
  const company = items.filter((item) => item.question.includes('公司'));
  return [...items.filter((item) => !company.includes(item)), ...company];
}

export default function ZhHantHomeBody({ posts, faqItems, heroOverrides = {}, attorneyIntro }: Props) {
  // The July stock canvas saved an English kicker ("TAIWAN LEGAL"); show the firm name instead.
  // Display-only: the saved canvas is not modified.
  // The saved subtitle leads with Korea/Japan cross-border work; Taiwanese readers see their own matters
  // and the four local offices instead. Display-only as well.
  const overrides = {
    ...heroOverrides,
    'section-label': '昊鼎國際法律事務所',
    subtitle: '律師團隊承辦車禍、離婚、繼承、勞資爭議與刑事案件，事務所在台北、台中、高雄及屏東設有據點。',
  };
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
      <ServicesBento locale="zh-hant" id="practice" variant="default" presentation="editorial" scenarioTags={ZH_HANT_SERVICE_SCENARIOS} order={ZH_HANT_DOMESTIC_SERVICE_ORDER} />
      <InsightsArchiveSection locale="zh-hant" posts={posts} presentation="editorial" pinnedSlugs={ZH_HANT_FEATURED_COLUMN_SLUGS} />
      <ZhHantEngagement />
      <BuilderSurfaceProvider nodeId="home-attorney" mode="published" overrides={attorneyIntro === undefined ? {} : { 'intro-primary': attorneyIntro }} selectedSurfaceKey={null}>
        <HomeAttorneySplit locale="zh-hant" presentation="editorial" />
      </BuilderSurfaceProvider>
      <HomeCaseResultsSplit locale="zh-hant" presentation="editorial" />
      <HomeStatsSection locale="zh-hant" plainLede />
      <FAQAccordion locale="zh-hant" items={domesticFaqOrder(faqItems)} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="zh-hant" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <HomeContactCta locale="zh-hant" />
      <ZhHantMobileCta />
    </div>
  );
}
