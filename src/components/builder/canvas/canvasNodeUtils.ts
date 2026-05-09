import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { linkValueFromLegacy } from '@/lib/builder/links';

export function nodeLinkPreviewHref(node: BuilderCanvasNode): string | null {
  const link = linkValueFromLegacy(
    (node.content as Parameters<typeof linkValueFromLegacy>[0]) || {},
  );
  return link?.href?.trim() ? link.href.trim() : null;
}

export function currentBuilderLocale(): string {
  if (typeof window === 'undefined') return 'ko';
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment || 'ko';
}

export function isColumnManagerTarget(node: BuilderCanvasNode): boolean {
  if (node.kind === 'blog-feed') return true;
  if (node.id === 'home-insights-root' || node.id.startsWith('home-insights-')) return true;
  const href = nodeLinkPreviewHref(node);
  return Boolean(href && /\/admin-builder\/columns(?:\/|$)/.test(href));
}

export function isHeroSearchTarget(nodeId: string): boolean {
  return nodeId === 'home-hero-search-wrapper'
    || nodeId === 'home-hero-search-container'
    || nodeId === 'home-hero-search-wrap'
    || nodeId === 'home-hero-search-bar'
    || nodeId === 'home-hero-search-input'
    || nodeId === 'home-hero-search-button'
    || nodeId === 'home-hero-quick-menu'
    || /^home-hero-quick-menu-item-\d+$/.test(nodeId);
}

export function textInputValue(
  node: BuilderCanvasNode | undefined,
  key: 'text' | 'placeholder' | 'ariaLabel',
): string {
  const content = (node?.content ?? {}) as Record<string, unknown>;
  const value = content[key];
  return typeof value === 'string' ? value : '';
}

export function containerActionValue(node: BuilderCanvasNode | undefined): string {
  const content = (node?.content ?? {}) as Record<string, unknown>;
  const value = content.action;
  return typeof value === 'string' ? value : '';
}

export type HeroSearchDestination = {
  key: string;
  label: string;
  action: string;
};

export type BlogFeedLayoutPreset = {
  key: 'grid' | 'list' | 'masonry' | 'featured-hero';
  label: string;
  columns: number;
  gap: number;
};

export const BLOG_FEED_LAYOUT_PRESETS: BlogFeedLayoutPreset[] = [
  { key: 'grid', label: 'Grid', columns: 3, gap: 24 },
  { key: 'list', label: 'List', columns: 1, gap: 16 },
  { key: 'masonry', label: 'Masonry', columns: 3, gap: 24 },
  { key: 'featured-hero', label: 'Hero', columns: 3, gap: 24 },
];

export function stopEditorPreviewNavigation(event: {
  target: EventTarget | null;
  preventDefault: () => void;
  stopPropagation: () => void;
}) {
  const target = event.target;
  if (target instanceof Element && target.closest('a[href]')) {
    event.preventDefault();
  }
  event.stopPropagation();
}

export function normalizeHeroSearchAction(action: string, locale: string): string {
  const fallback = `/${locale}/search`;
  const trimmed = action.trim();
  if (!trimmed) return fallback;
  return trimmed.replace(/([?&]tab=)columns\b/, '$1insights');
}

export function heroSearchDestinations(locale: string): HeroSearchDestination[] {
  const labels = locale === 'zh-hant'
    ? { services: '服務', insights: '專欄', videos: '影片', faq: 'FAQ' }
    : locale === 'en'
      ? { services: 'Services', insights: 'Columns', videos: 'Videos', faq: 'FAQ' }
      : { services: '업무', insights: '칼럼', videos: '영상', faq: 'FAQ' };

  return [
    { key: 'services', label: labels.services, action: `/${locale}/search?tab=services` },
    { key: 'insights', label: labels.insights, action: `/${locale}/search?tab=insights` },
    { key: 'videos', label: labels.videos, action: `/${locale}/search?tab=videos` },
    { key: 'faq', label: labels.faq, action: `/${locale}/search?tab=faq` },
  ];
}

export function blogFeedLayoutValue(node: BuilderCanvasNode): BlogFeedLayoutPreset['key'] {
  const value = node.content && 'layout' in node.content ? node.content.layout : null;
  return value === 'list' || value === 'masonry' || value === 'featured-hero' ? value : 'grid';
}

export function officeIndexFromNodeId(nodeId: string): number | null {
  const tabMatch = /^home-offices-tab-(\d+)$/.exec(nodeId);
  if (tabMatch) return Number(tabMatch[1]);
  const layoutMatch = /^home-offices-layout-(\d+)(?:$|-)/.exec(nodeId);
  if (layoutMatch) return Number(layoutMatch[1]);
  return null;
}
