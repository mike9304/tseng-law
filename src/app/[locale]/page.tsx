import { normalizeLocale, type Locale } from '@/lib/locales';
import { getAllColumnPosts } from '@/lib/columns';
import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import Reveal from '@/components/Reveal';
import { faqContent } from '@/data/faq-content';

export default function HomePage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const faqItems = faqContent[locale];
  const allPosts = getAllColumnPosts(locale);

  return (
    <>
      <HeroSearch locale={locale} />
      <Reveal>
        <InsightsArchiveSection locale={locale} posts={allPosts} />
      </Reveal>
      <Reveal>
        <ServicesBento locale={locale} id="practice" variant="default" />
      </Reveal>
      <Reveal>
        <HomeAttorneySplit locale={locale} />
      </Reveal>
      <Reveal>
        <HomeCaseResultsSplit locale={locale} />
      </Reveal>
      <Reveal>
        <HomeStatsSection locale={locale} />
      </Reveal>
      <Reveal>
        <FAQAccordion locale={locale} items={faqItems} id="faq" sectionClassName="section section--gray" />
      </Reveal>
      <Reveal>
        <OfficeMapTabs locale={locale} id="offices" sectionClassName="section section--light" />
      </Reveal>
      <Reveal>
        <HomeContactCta locale={locale} />
      </Reveal>
    </>
  );
}
