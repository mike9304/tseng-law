'use client';

import type { BuilderCompositeCanvasNode } from '@/lib/builder/canvas/types';
import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeContactCta from '@/components/HomeContactCta';
import InsightsArchiveSection from '@/components/InsightsArchiveSection';
import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import HomeStatsSection from '@/components/HomeStatsSection';
import FAQAccordion from '@/components/FAQAccordion';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import {
  AboutLegacyPageBody,
  ServicesLegacyPageBody,
  ContactLegacyPageBody,
  LawyersLegacyPageBody,
  FaqLegacyPageBody,
  PricingLegacyPageBody,
  ReviewsLegacyPageBody,
  PrivacyLegacyPageBody,
  DisclaimerLegacyPageBody,
} from '@/app/[locale]/(legacy)/legacy-page-bodies';
import type { Locale } from '@/lib/locales';
import { insightsArchive } from '@/data/insights-archive';
import { faqContent } from '@/data/faq-content';

function resolveLocale(config: Record<string, unknown> | undefined): Locale {
  const raw = config?.locale;
  if (raw === 'ko' || raw === 'zh-hant' || raw === 'en') return raw;
  return 'ko';
}

function resolveInsightsPosts(locale: Locale) {
  const archive = insightsArchive[locale === 'en' ? 'ko' : locale];
  if (!archive) return [];
  return archive.posts.map((post) => ({
    slug: post.id,
    title: post.title,
    date: post.date ?? '',
    dateDisplay: post.date ?? '',
    readTime: post.readTime ?? '',
    categoryLabel: archive.categories[post.category] ?? '',
    featuredImage: post.image,
    summary: post.summary,
  }));
}

export default function CompositeRender({
  node,
  mode = 'edit',
}: {
  node: BuilderCompositeCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const { componentKey, config } = node.content;
  const locale = resolveLocale(config);
  const interactive = mode !== 'edit';

  const body = (() => {
    switch (componentKey) {
      case 'hero-search':
        return <HeroSearch locale={locale} />;
      case 'services-bento':
        return <ServicesBento locale={locale} />;
      case 'home-contact-cta':
        return <HomeContactCta locale={locale} />;
      case 'insights-archive': {
        const posts = resolveInsightsPosts(locale);
        if (posts.length === 0) {
          return (
            <div style={{ padding: 24, color: '#94a3b8', fontSize: 13 }}>
              Insights data unavailable.
            </div>
          );
        }
        return <InsightsArchiveSection locale={locale} posts={posts} />;
      }
      case 'home-attorney':
        return <HomeAttorneySplit locale={locale} />;
      case 'home-case-results':
        return <HomeCaseResultsSplit locale={locale} />;
      case 'home-stats':
        return <HomeStatsSection locale={locale} />;
      case 'faq-accordion':
        return (
          <FAQAccordion
            locale={locale}
            items={faqContent[locale]}
            id="faq"
            sectionClassName="section section--gray"
          />
        );
      case 'office-map-tabs':
        return (
          <OfficeMapTabs
            locale={locale}
            id="offices"
            sectionClassName="section section--light"
          />
        );
      case 'legacy-page-about':
        return <AboutLegacyPageBody locale={locale} />;
      case 'legacy-page-services':
        return <ServicesLegacyPageBody locale={locale} />;
      case 'legacy-page-contact':
        return <ContactLegacyPageBody locale={locale} />;
      case 'legacy-page-lawyers':
        return <LawyersLegacyPageBody locale={locale} />;
      case 'legacy-page-faq':
        return <FaqLegacyPageBody locale={locale} />;
      case 'legacy-page-pricing':
        return <PricingLegacyPageBody locale={locale} />;
      case 'legacy-page-reviews':
        return <ReviewsLegacyPageBody locale={locale} />;
      case 'legacy-page-privacy':
        return <PrivacyLegacyPageBody locale={locale} />;
      case 'legacy-page-disclaimer':
        return <DisclaimerLegacyPageBody locale={locale} />;
      default:
        return (
          <div style={{ padding: 24, color: '#94a3b8', fontSize: 13 }}>
            Unknown composite: {componentKey}
          </div>
        );
    }
  })();

  const wrapperStyle: React.CSSProperties =
    mode === 'published'
      ? { width: '100%', minHeight: '100%', overflow: 'visible', position: 'relative' }
      : { width: '100%', minHeight: '100%', overflow: 'visible', position: 'relative' };

  return (
    <div style={wrapperStyle}>
      {body}
      {!interactive && (
        <div
          data-composite-edit-overlay="true"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            cursor: 'move',
            background: 'transparent',
          }}
        />
      )}
    </div>
  );
}
