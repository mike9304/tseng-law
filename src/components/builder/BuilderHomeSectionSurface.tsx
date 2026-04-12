import type { ColumnPost } from '@/lib/columns';
import type { FAQItem } from '@/data/faq-content';
import type { SiteContent } from '@/data/site-content';
import type { Locale } from '@/lib/locales';
import type { BuilderSectionNode } from '@/lib/builder/types';
import HeroSearch from '@/components/HeroSearch';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import HomeContactCta from '@/components/HomeContactCta';
import BuilderServicesSection from '@/components/builder/BuilderServicesSection';
import BuilderSectionFrame from '@/components/builder/BuilderSectionFrame';

type BuilderServicesContent = Pick<
  SiteContent['services'],
  'label' | 'title' | 'description' | 'items'
>;

export default function BuilderHomeSectionSurface({
  locale,
  section,
  posts,
  faqItems,
  services,
}: {
  locale: Locale;
  section: BuilderSectionNode;
  posts: ColumnPost[];
  faqItems: FAQItem[];
  services: BuilderServicesContent;
}) {
  const rendered = renderHomeSectionSurface({
    locale,
    section,
    posts,
    faqItems,
    services,
  });

  if (!rendered) return null;

  return <BuilderSectionFrame section={section}>{rendered}</BuilderSectionFrame>;
}

function renderHomeSectionSurface({
  locale,
  section,
  posts,
  faqItems,
  services,
}: {
  locale: Locale;
  section: BuilderSectionNode;
  posts: ColumnPost[];
  faqItems: FAQItem[];
  services: BuilderServicesContent;
}) {
  switch (section.sectionKey) {
    case 'home.hero':
      return <HeroSearch key={section.id} locale={locale} />;
    case 'home.insights':
      return <InsightsArchiveSection key={section.id} locale={locale} posts={posts} />;
    case 'home.services':
      return (
        <BuilderServicesSection
          key={section.id}
          locale={locale}
          services={services}
          id="practice"
          variant="default"
        />
      );
    case 'home.attorney':
      return <HomeAttorneySplit key={section.id} locale={locale} />;
    case 'home.results':
      return <HomeCaseResultsSplit key={section.id} locale={locale} />;
    case 'home.stats':
      return <HomeStatsSection key={section.id} locale={locale} />;
    case 'home.faq':
      return (
        <FAQAccordion
          key={section.id}
          locale={locale}
          items={faqItems}
          id="faq"
          sectionClassName="section section--gray"
        />
      );
    case 'home.offices':
      return (
        <OfficeMapTabs
          key={section.id}
          locale={locale}
          id="offices"
          sectionClassName="section section--light"
        />
      );
    case 'home.contact':
      return <HomeContactCta key={section.id} locale={locale} />;
    default:
      return null;
  }
}
