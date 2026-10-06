import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import KoAudienceDoors from '@/components/ko-home/KoAudienceDoors';
import KoEngagement from '@/components/ko-home/KoEngagement';
import KoHeroTrust from '@/components/ko-home/KoHeroTrust';
import { KO_SERVICE_SCENARIOS } from '@/components/ko-home/ko-service-scenarios';
import ZhHantHeroMedia from '@/components/zh-hant-home/ZhHantHeroMedia';
import ZhHantMobileCta from '@/components/zh-hant-home/ZhHantMobileCta';
import ZhHantPracticeFocus from '@/components/zh-hant-home/ZhHantPracticeFocus';
import ZhHantMonoIcon, { ZH_PRACTICE_ICON } from '@/components/zh-hant-icons/ZhHantMonoIcon';
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import type { FAQItem } from '@/data/faq-content';
import styles from './ZhHantDesign.module.css';

type Props = {
  posts: Parameters<typeof InsightsArchiveSection>[0]['posts'];
  faqItems: FAQItem[];
};

/** Search shortcuts: matters Korean readers bring to a Taiwan lawyer, run through the site search. */
const SEARCH_CHIPS = ['회사설립', '비자', '이혼', '상속', '교통사고', '퇴직금'].map((q) => ({
  label: q,
  href: `/ko/search?q=${encodeURIComponent(q)}`,
}));

/**
 * ko home (2026-10-06, operator: 「tseng-law.com 의 전체적 디자인 아직 밤티 나는데 개선 가능한부분들 개선해줘」 →
 * the ko home joins the zh-hant Apple system): one journey — full-bleed first screen, situation bento,
 * practice tiles, columns, how a first email becomes a retained matter, attorney, a dark chapter for the
 * case and the figures, FAQ, offices and a last call. Shares ZhHantDesign.module.css (every home rule reads
 * :is(#zh-hant-home, #ko-home); the ko type rules sit at the end of that module).
 * Copy: the hero keeps the ko title, subtitle and CTA (site-content ko hero), with the firm name as its label
 * (the saved stock canvas showed the English kicker 「TAIWAN LEGAL」); every other line comes from existing ko
 * data, cited in each component. Display-only: the saved builder document is not modified.
 */
export default function KoHomeBody({ posts, faqItems }: Props) {
  const overrides = {
    'section-label': '법무법인 호정',
    headline: '대만 법률을\n한국어로 명확하게.',
  };
  return (
    <div className={styles.home} id="ko-home" data-ko-design="home">
      <BuilderSurfaceProvider nodeId="home-hero" mode="published" overrides={overrides} selectedSurfaceKey={null}>
        <HeroSearch
          locale="ko"
          presentation="editorial"
          scrollHref="#practice"
          quickMenus={SEARCH_CHIPS}
          persistentQuickMenus
          showHomePaths={false}
          media={<ZhHantHeroMedia locale="ko" />}
          trustContent={<KoHeroTrust />}
        />
      </BuilderSurfaceProvider>
      <KoAudienceDoors />
      <ServicesBento
        locale="ko"
        id="practice"
        variant="default"
        presentation="editorial"
        scenarioTags={KO_SERVICE_SCENARIOS}
        renderIcon={(index) => <ZhHantMonoIcon name={ZH_PRACTICE_ICON[index] ?? 'company'} size={48} />}
      />
      <ZhHantPracticeFocus rootId="ko-home" />
      <InsightsArchiveSection locale="ko" posts={posts} presentation="editorial" />
      <KoEngagement />
      <HomeAttorneySplit locale="ko" presentation="editorial" />
      <HomeCaseResultsSplit locale="ko" presentation="editorial" />
      <HomeStatsSection locale="ko" plainLede />
      <FAQAccordion locale="ko" items={faqItems} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="ko" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <HomeContactCta locale="ko" />
      <ZhHantMobileCta locale="ko" />
    </div>
  );
}
