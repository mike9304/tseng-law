import Link from 'next/link';
import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import TaiwanHeritageInterlude from '@/components/TaiwanHeritageInterlude';
import { heroTrustCopy } from '@/components/HeroTrustStrip';
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

/** The locale-specific presentation uses existing, sourced copy throughout. */
export default function ZhHantHomeBody({ posts, faqItems, heroOverrides = {}, quickMenus, attorneyIntro }: Props) {
  return (
    <div className={styles.home} id="zh-hant-home" data-zh-hant-design="home">
      <BuilderSurfaceProvider nodeId="home-hero" mode="published" overrides={heroOverrides} selectedSurfaceKey={null}>
        <HeroSearch
          locale="zh-hant"
          presentation="editorial"
          scrollHref="#practice"
          quickMenus={quickMenus}
          persistentQuickMenus
          trustContent={
            <ul className={styles.trustFacts} aria-label={heroTrustCopy['zh-hant'].ariaLabel}>
              {heroTrustCopy['zh-hant'].facts.map((fact) => <li key={fact}>{fact}</li>)}
            </ul>
          }
        />
      </BuilderSurfaceProvider>
      <nav className={styles.wayfinding} aria-label="首頁導覽">
        <Link href="#practice">服務領域 <span aria-hidden>↓</span></Link>
        <Link href="#about">曾雋崴律師 <span aria-hidden>↓</span></Link>
        <Link href="/zh-hant/columns">查看專欄內容 <span aria-hidden>↗</span></Link>
      </nav>
      <ServicesBento locale="zh-hant" id="practice" variant="default" presentation="editorial" />
      <BuilderSurfaceProvider nodeId="home-attorney" mode="published" overrides={attorneyIntro === undefined ? {} : { 'intro-primary': attorneyIntro }} selectedSurfaceKey={null}>
        <HomeAttorneySplit locale="zh-hant" presentation="editorial" />
      </BuilderSurfaceProvider>
      <HomeCaseResultsSplit locale="zh-hant" presentation="editorial" />
      <HomeStatsSection locale="zh-hant" plainLede />
      <InsightsArchiveSection locale="zh-hant" posts={posts} presentation="editorial" />
      <TaiwanHeritageInterlude locale="zh-hant" />
      <FAQAccordion locale="zh-hant" items={faqItems} id="faq" sectionClassName="section section--gray" layout="split" />
      <OfficeMapTabs locale="zh-hant" id="offices" sectionClassName="section section--light" presentation="editorial" />
      <HomeContactCta locale="zh-hant" />
    </div>
  );
}
