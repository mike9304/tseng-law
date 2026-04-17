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
import { BuilderSurfaceProvider } from '@/lib/builder/surface-context';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { useEffect, useRef } from 'react';

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

  const wrapperStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '100%',
    overflow: 'visible',
    position: 'relative',
  };

  const overrides =
    (config?.overrides as Record<string, string> | undefined) ?? {};
  const selectedNodeId = useBuilderCanvasStore((s) => s.selectedNodeId);
  const selectedSurfaceKey = useBuilderCanvasStore((s) => s.selectedSurfaceKey);
  const setSelectedSurfaceKey = useBuilderCanvasStore((s) => s.setSelectedSurfaceKey);
  const isCompositeSelected = selectedNodeId === node.id;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== 'edit') return;
    const root = containerRef.current;
    if (!root) return;
    const previouslyOutlined = root.querySelectorAll<HTMLElement>(
      '[data-builder-surface-outline="true"]',
    );
    previouslyOutlined.forEach((el) => {
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.removeAttribute('data-builder-surface-outline');
    });
    if (!isCompositeSelected || !selectedSurfaceKey) return;
    const target = root.querySelector<HTMLElement>(
      `[data-builder-surface-key="${CSS.escape(selectedSurfaceKey)}"]`,
    );
    if (target) {
      target.style.outline = '2px solid #2563eb';
      target.style.outlineOffset = '2px';
      target.setAttribute('data-builder-surface-outline', 'true');
    }
  }, [mode, isCompositeSelected, selectedSurfaceKey, body]);

  useEffect(() => {
    if (mode !== 'edit' || !isCompositeSelected || !selectedSurfaceKey) return;
    const root = containerRef.current;
    if (!root) return;
    const target = root.querySelector<HTMLElement>(
      `[data-builder-surface-key="${CSS.escape(selectedSurfaceKey)}"]`,
    );
    if (!target) return;

    const originalText = target.textContent ?? '';
    let committed = false;
    target.setAttribute('contenteditable', 'plaintext-only');
    target.setAttribute('data-builder-surface-editing', 'true');
    target.style.cursor = 'text';
    target.focus();
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    const commit = () => {
      if (committed) return;
      committed = true;
      const newText = (target.textContent ?? '').trim();
      cleanup();
      if (newText === originalText.trim()) return;
      const store = useBuilderCanvasStore.getState();
      const currentNode = store.document?.nodes.find((n) => n.id === node.id);
      if (!currentNode || currentNode.kind !== 'composite') return;
      const content = currentNode.content as { componentKey: string; config?: Record<string, unknown> };
      const nextConfig = { ...(content.config ?? {}) };
      const nextOverrides = { ...((nextConfig.overrides as Record<string, string> | undefined) ?? {}) };
      if (newText === '') {
        delete nextOverrides[selectedSurfaceKey];
      } else {
        nextOverrides[selectedSurfaceKey] = newText;
      }
      nextConfig.overrides = nextOverrides;
      store.updateNodeContent(node.id, {
        componentKey: content.componentKey,
        config: nextConfig,
      });
    };

    const revert = () => {
      if (committed) return;
      committed = true;
      target.textContent = originalText;
      cleanup();
    };

    const cleanup = () => {
      target.removeAttribute('contenteditable');
      target.removeAttribute('data-builder-surface-editing');
      target.style.cursor = '';
      target.removeEventListener('blur', commit);
      target.removeEventListener('keydown', keyHandler);
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        commit();
        target.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        revert();
        target.blur();
      }
    };

    target.addEventListener('blur', commit);
    target.addEventListener('keydown', keyHandler);

    return () => {
      if (!committed) commit();
    };
  }, [mode, isCompositeSelected, selectedSurfaceKey, node.id]);

  const handleWrapperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'edit' || !isCompositeSelected) return;
    const elements = document.elementsFromPoint(event.clientX, event.clientY);
    const surfaceEl = elements.find((el) =>
      el instanceof HTMLElement && el.hasAttribute('data-builder-surface-key'),
    ) as HTMLElement | undefined;
    if (!surfaceEl) {
      if (selectedSurfaceKey) setSelectedSurfaceKey(null);
      return;
    }
    const key = surfaceEl.getAttribute('data-builder-surface-key');
    if (!key) return;
    if (key === selectedSurfaceKey) return; // already editing this surface
    event.stopPropagation();
    event.preventDefault();
    setSelectedSurfaceKey(key);
  };

  return (
    <BuilderSurfaceProvider
      nodeId={node.id}
      mode={mode}
      overrides={overrides}
      selectedSurfaceKey={isCompositeSelected ? selectedSurfaceKey : null}
    >
      <div ref={containerRef} style={wrapperStyle} onClickCapture={handleWrapperClick}>
        {body}
        {!interactive && (
          <div
            data-composite-edit-overlay="true"
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              cursor: isCompositeSelected ? 'default' : 'move',
              background: 'transparent',
              pointerEvents: isCompositeSelected ? 'none' : 'auto',
            }}
          />
        )}
      </div>
    </BuilderSurfaceProvider>
  );
}
