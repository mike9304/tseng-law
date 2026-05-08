'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { getComponent } from '@/lib/builder/components/registry';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
import type { BuilderRichText } from '@/lib/builder/rich-text/types';
import { isBuilderRichText, richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import { DEFAULT_BLOG_CATEGORIES, type BlogPost } from '@/lib/builder/blog/blog-engine';
import {
  resolveViewportFontSize,
  resolveViewportHidden,
  resolveViewportRect,
} from '@/lib/builder/canvas/responsive';
import {
  HOME_SECTION_TEMPLATE_VARIANTS,
  getHomeSectionTemplateTarget,
  getHomeSectionTemplateVariant,
} from '@/lib/builder/canvas/section-templates';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import {
  buildEditorAnimationStyle,
  getAnimationSummary,
  mergeCssTransforms,
  type AnimationPreviewPhase,
} from '@/lib/builder/animations/animation-render';
import {
  buildHoverTransform,
  resolveBackgroundStyle,
  resolveThemeColor,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';
import InlineTextEditor from './InlineTextEditor';
import { linkValueFromLegacy } from '@/lib/builder/links';
import styles from './SandboxPage.module.css';

function nodeLinkPreviewHref(node: BuilderCanvasNode): string | null {
  const link = linkValueFromLegacy(
    (node.content as Parameters<typeof linkValueFromLegacy>[0]) || {},
  );
  return link?.href?.trim() ? link.href.trim() : null;
}

function currentBuilderLocale(): string {
  if (typeof window === 'undefined') return 'ko';
  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  return firstSegment || 'ko';
}

type OfficeQuickPreset = {
  title: string;
  address: string;
  phone: string;
  fax?: string;
  mapsUrl: string;
};

const OFFICE_QUICK_PRESETS: Record<string, OfficeQuickPreset[]> = {
  ko: [
    {
      title: '타이중',
      address: '臺中市北區館前路19號樓之1',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80',
    },
    {
      title: '가오슝',
      address: '高雄市左營區安吉街233號',
      phone: '07-557-9797',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80',
    },
    {
      title: '타이베이',
      address: '台北市大同區承德路一段35號7樓之2',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2',
    },
  ],
  'zh-hant': [
    {
      title: '台中',
      address: '臺中市北區館前路19號樓之1',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80',
    },
    {
      title: '高雄',
      address: '高雄市左營區安吉街233號',
      phone: '07-557-9797',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80',
    },
    {
      title: '台北',
      address: '台北市大同區承德路一段35號7樓之2',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2',
    },
  ],
  en: [
    {
      title: 'Taichung',
      address: 'No. 19, Guanqian Rd., North Dist., Taichung City',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80',
    },
    {
      title: 'Kaohsiung',
      address: 'No. 233, Anji St., Zuoying Dist., Kaohsiung City',
      phone: '07-557-9797',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80',
    },
    {
      title: 'Taipei',
      address: '7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2',
    },
  ],
};

function currentOfficeQuickPresets(): OfficeQuickPreset[] {
  const locale = currentBuilderLocale();
  return OFFICE_QUICK_PRESETS[locale] ?? OFFICE_QUICK_PRESETS.ko;
}

function isColumnManagerTarget(node: BuilderCanvasNode): boolean {
  if (node.kind === 'blog-feed') return true;
  if (node.id === 'home-insights-root' || node.id.startsWith('home-insights-')) return true;
  const href = nodeLinkPreviewHref(node);
  return Boolean(href && /\/admin-builder\/columns(?:\/|$)/.test(href));
}

function textContentValue(node: BuilderCanvasNode | undefined): string {
  const value = node?.content && 'text' in node.content ? node.content.text : '';
  return typeof value === 'string' ? value : '';
}

function buttonLabelValue(node: BuilderCanvasNode | undefined): string {
  const value = node?.content && 'label' in node.content ? node.content.label : '';
  return typeof value === 'string' ? value : '';
}

function labelPrefix(label: string, fallback: string): string {
  const separatorIndex = label.indexOf(':');
  return separatorIndex > 0 ? label.slice(0, separatorIndex).trim() : fallback;
}

function telHrefFromPhone(phone: string): string {
  const normalized = phone.replace(/[^+\d]/g, '');
  return normalized ? `tel:${normalized}` : '';
}

function googleMapsSearchUrl(address: string): string {
  return address.trim()
    ? `https://www.google.com/maps/search/${encodeURIComponent(address.trim())}`
    : '';
}

function isHeroSearchTarget(nodeId: string): boolean {
  return nodeId === 'home-hero-search-wrapper'
    || nodeId === 'home-hero-search-container'
    || nodeId === 'home-hero-search-wrap'
    || nodeId === 'home-hero-search-bar'
    || nodeId === 'home-hero-search-input'
    || nodeId === 'home-hero-search-button'
    || nodeId === 'home-hero-quick-menu'
    || /^home-hero-quick-menu-item-\d+$/.test(nodeId);
}

function textInputValue(node: BuilderCanvasNode | undefined, key: 'text' | 'placeholder' | 'ariaLabel'): string {
  const content = (node?.content ?? {}) as Record<string, unknown>;
  const value = content[key];
  return typeof value === 'string' ? value : '';
}

function containerActionValue(node: BuilderCanvasNode | undefined): string {
  const content = (node?.content ?? {}) as Record<string, unknown>;
  const value = content.action;
  return typeof value === 'string' ? value : '';
}

const INSIGHTS_PAGE_SIZE = 3;

const insightsCopyByLocale = {
  ko: {
    dateFallback: '게시일 확인중',
    prevLabel: '이전',
    nextLabel: '다음',
    readTimeSuffix: '분 읽기',
    readMore: '자세히 보기',
  },
  'zh-hant': {
    dateFallback: '日期待確認',
    prevLabel: '上一頁',
    nextLabel: '下一頁',
    readTimeSuffix: '分鐘閱讀',
    readMore: '閱讀全文',
  },
  en: {
    dateFallback: 'Date pending',
    prevLabel: 'Previous',
    nextLabel: 'Next',
    readTimeSuffix: 'min read',
    readMore: 'Read more',
  },
} as const;

type InsightsLocale = keyof typeof insightsCopyByLocale;

function insightsLocale(locale: string): InsightsLocale {
  return locale === 'zh-hant' || locale === 'en' ? locale : 'ko';
}

function insightCategoryLabel(category: string | undefined, locale: InsightsLocale): string {
  if (!category) return DEFAULT_BLOG_CATEGORIES.find((item) => item.slug === 'general')?.name[locale] ?? 'General';
  return DEFAULT_BLOG_CATEGORIES.find((item) => item.slug === category)?.name[locale] ?? category;
}

function insightDateLabel(post: BlogPost, locale: InsightsLocale): string {
  const value = post.publishedAt || post.updatedAt;
  if (!value) return insightsCopyByLocale[locale].dateFallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10) || insightsCopyByLocale[locale].dateFallback;
  return date.toISOString().slice(0, 10);
}

function insightReadTimeLabel(post: BlogPost, locale: InsightsLocale): string {
  return post.readingTimeMinutes > 0
    ? `${post.readingTimeMinutes}${locale === 'en' ? ' ' : ''}${insightsCopyByLocale[locale].readTimeSuffix}`
    : '';
}

function InsightsArchiveListPreview({ locale }: { locale: string }) {
  const resolvedLocale = insightsLocale(locale);
  const copy = insightsCopyByLocale[resolvedLocale];
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setPage(0);
    const params = new URLSearchParams({
      locale: resolvedLocale,
      sort: 'newest',
      limit: '100',
      scope: 'all',
    });
    fetch(`/api/builder/blog/posts?${params.toString()}`)
      .then((response) => response.json())
      .then((payload: { ok?: boolean; posts?: BlogPost[] }) => {
        if (cancelled) return;
        setPosts(payload.ok && Array.isArray(payload.posts) ? payload.posts : []);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [resolvedLocale]);

  const listPosts = useMemo(() => posts.slice(1), [posts]);
  const pageCount = Math.max(1, Math.ceil(listPosts.length / INSIGHTS_PAGE_SIZE));
  const visibleItems = useMemo(
    () => listPosts.slice(page * INSIGHTS_PAGE_SIZE, page * INSIGHTS_PAGE_SIZE + INSIGHTS_PAGE_SIZE),
    [listPosts, page],
  );

  if (!loaded || posts.length <= 1) return null;

  return (
    <div
      className={styles.nodeInsightsPreview}
      data-builder-insights-preview="true"
      data-builder-insights-page={`${page + 1} / ${pageCount}`}
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      {pageCount > 1 ? (
        <div className="insights-controls">
          <button
            type="button"
            className="insights-nav-btn"
            aria-label={copy.prevLabel}
            onClick={() => setPage((current) => (current - 1 + pageCount) % pageCount)}
          >
            {copy.prevLabel}
          </button>
          <span className="insights-page-indicator">{page + 1} / {pageCount}</span>
          <button
            type="button"
            className="insights-nav-btn"
            aria-label={copy.nextLabel}
            onClick={() => setPage((current) => (current + 1) % pageCount)}
          >
            {copy.nextLabel}
          </button>
        </div>
      ) : null}
      <div className="insights-list" key={`builder-insights-page-${page}`}>
        {visibleItems.map((post) => {
          const image = post.featuredImage?.trim();
          return (
            <article key={post.postId} className="insights-list-item">
              <div className="insights-list-thumb">
                <div
                  className={styles.nodeInsightsThumbImage}
                  style={image ? { backgroundImage: `url(${image})` } : undefined}
                  aria-label={post.title}
                  role="img"
                />
                <span className="insights-category-badge insights-category-badge--compact">
                  {insightCategoryLabel(post.category, resolvedLocale)}
                </span>
              </div>
              <div className="insights-list-copy">
                <div className="insights-meta-row">
                  <time className="insights-date">{insightDateLabel(post, resolvedLocale)}</time>
                  <span className="insights-readtime">{insightReadTimeLabel(post, resolvedLocale)}</span>
                </div>
                <h4 className="insights-list-title">
                  <a className="link-underline" href={`/${resolvedLocale}/columns/${post.slug}`}>
                    {post.title}
                  </a>
                </h4>
                <p className="insights-list-summary">{post.excerpt}</p>
                <a className={styles.nodeInsightsReadMore} href={`/${resolvedLocale}/columns/${post.slug}`}>
                  {copy.readMore}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function mapAddressValue(node: BuilderCanvasNode): string {
  const value = node.content && 'address' in node.content ? node.content.address : '';
  return typeof value === 'string' ? value : '';
}

function mapZoomValue(node: BuilderCanvasNode): number {
  const value = node.content && 'zoom' in node.content ? node.content.zoom : 15;
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(1, Math.min(20, Math.round(value)))
    : 15;
}

function isOfficeMapTarget(node: BuilderCanvasNode): boolean {
  return node.kind === 'map' && /^home-offices-layout-\d+-map$/.test(node.id);
}

function officeIndexFromNodeId(nodeId: string): number | null {
  const tabMatch = /^home-offices-tab-(\d+)$/.exec(nodeId);
  if (tabMatch) return Number(tabMatch[1]);
  const layoutMatch = /^home-offices-layout-(\d+)(?:$|-)/.exec(nodeId);
  if (layoutMatch) return Number(layoutMatch[1]);
  return null;
}

export type ResizeHandle =
  | 'nw'
  | 'n'
  | 'ne'
  | 'e'
  | 'sw'
  | 's'
  | 'w'
  | 'se';

interface CanvasNodeProps {
  node: BuilderCanvasNode;
  selected: boolean;
  onSelect: (nodeId: string, additive: boolean) => void;
  onContextMenu: (nodeId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  onOpenAssetLibrary?: (nodeId: string) => void;
  onMoveStart: (nodeId: string, event: React.PointerEvent<HTMLDivElement>) => void;
  onResizeStart: (nodeId: string, handle: ResizeHandle, event: React.PointerEvent<HTMLButtonElement>) => void;
  onUpdateContent?: (nodeId: string, content: Record<string, unknown>) => void;
  onInlineEditingChange?: (nodeId: string, editing: boolean) => void;
}

export default function CanvasNode({
  node,
  selected,
  onSelect,
  onContextMenu,
  onOpenAssetLibrary,
  onMoveStart,
  onResizeStart,
  onUpdateContent,
  onInlineEditingChange,
}: CanvasNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mapQuickAddressDraft, setMapQuickAddressDraft] = useState('');
  const [rotationReadout, setRotationReadout] = useState<{ degrees: number; x: number; y: number } | null>(null);
  const [animationPreviewPhase, setAnimationPreviewPhase] = useState<AnimationPreviewPhase>(null);
  const component = getComponent(node.kind);
  const theme = useBuilderTheme();
  const nodeRef = useRef<HTMLDivElement>(null);
  const mapQuickAddressRef = useRef<HTMLTextAreaElement>(null);
  const rotationDrag = useRef<{ startAngle: number; startRotation: number } | null>(null);
  const updateNode = useBuilderCanvasStore((s) => s.updateNode);
  const updateNodeRectsForViewport = useBuilderCanvasStore((s) => s.updateNodeRectsForViewport);
  const beginMutationSession = useBuilderCanvasStore((s) => s.beginMutationSession);
  const commitMutationSession = useBuilderCanvasStore((s) => s.commitMutationSession);
  const cancelMutationSession = useBuilderCanvasStore((s) => s.cancelMutationSession);
  const activeGroupId = useBuilderCanvasStore((s) => s.activeGroupId);
  const enterGroup = useBuilderCanvasStore((s) => s.enterGroup);
  const updateNodeContentInStore = useBuilderCanvasStore((s) => s.updateNodeContent);
  const selectedNodeIds = useBuilderCanvasStore((s) => s.selectedNodeIds);
  const viewport = useBuilderCanvasStore((s) => s.viewport);
  const effectiveRect = resolveViewportRect(node, viewport);
  const isHiddenAtViewport = viewport !== 'desktop' && resolveViewportHidden(node, viewport);
  const effectiveFontSize = resolveViewportFontSize(node, viewport);
  const currentMapAddress = node.kind === 'map' ? mapAddressValue(node) : '';
  const currentMapZoom = node.kind === 'map' ? mapZoomValue(node) : 15;

  const handleRotationPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.stopPropagation();
      event.preventDefault();
      const targetEl = nodeRef.current;
      if (!targetEl) return;
      const activeEl = targetEl;
      const rect = activeEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI);
      rotationDrag.current = { startAngle, startRotation: node.rotation };
      setRotationReadout({
        degrees: Math.round(((node.rotation % 360) + 360) % 360),
        x: event.clientX - rect.left + 14,
        y: event.clientY - rect.top - 30,
      });
      try {
        activeEl.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is best effort; window-level listeners keep rotation dragging stable.
      }
      beginMutationSession();
      let didCleanup = false;

      function handlePointerMove(moveEvent: PointerEvent) {
        if (!rotationDrag.current) return;
        const currentAngle = Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) * (180 / Math.PI);
        const rawDegrees = rotationDrag.current.startRotation + (currentAngle - rotationDrag.current.startAngle);
        const nextDegrees = moveEvent.shiftKey ? Math.round(rawDegrees / 15) * 15 : Math.round(rawDegrees);
        const normalized = ((nextDegrees % 360) + 360) % 360;
        setRotationReadout({
          degrees: normalized,
          x: moveEvent.clientX - rect.left + 14,
          y: moveEvent.clientY - rect.top - 30,
        });
        updateNode(node.id, (n) => ({ ...n, rotation: normalized }), 'transient');
      }

      function cleanupRotationDrag(mode: 'commit' | 'cancel', pointerId = event.pointerId) {
        if (didCleanup) return;
        didCleanup = true;
        rotationDrag.current = null;
        setRotationReadout(null);
        try {
          if (activeEl.hasPointerCapture(pointerId)) {
            activeEl.releasePointerCapture(pointerId);
          }
        } catch {
          // Ignore capture cleanup races when the browser has already released it.
        }
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerCancel);
        window.removeEventListener('keydown', handleKeyDown, true);
        if (mode === 'commit') {
          commitMutationSession();
        } else {
          cancelMutationSession();
        }
      }

      function handlePointerUp(upEvent: PointerEvent) {
        cleanupRotationDrag('commit', upEvent.pointerId);
      }

      function handlePointerCancel(cancelEvent: PointerEvent) {
        cleanupRotationDrag('cancel', cancelEvent.pointerId);
      }

      function handleKeyDown(keyEvent: KeyboardEvent) {
        if (keyEvent.key !== 'Escape') return;
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        cleanupRotationDrag('cancel');
      }

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerCancel);
      window.addEventListener('keydown', handleKeyDown, true);
    },
    [node.id, node.rotation, beginMutationSession, cancelMutationSession, commitMutationSession, updateNode],
  );

  const handleDoubleClick = useCallback(() => {
    if (node.locked) return;
    if (node.kind === 'composite') {
      enterGroup(node.id);
      setIsEditing(false);
      return;
    }
    if (node.kind === 'text' || node.kind === 'heading') {
      setIsEditing(true);
    }
  }, [enterGroup, node.id, node.kind, node.locked]);

  const handleInlineSave = useCallback(
    (payload: { richText: BuilderRichText; plainText: string }) => {
      onUpdateContent?.(node.id, {
        text: payload.plainText,
        richText: payload.richText,
      });
    },
    [node.id, onUpdateContent],
  );

  const handleInlineBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  useEffect(() => {
    if (node.kind !== 'text' && node.kind !== 'heading') return;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (detail?.nodeId === node.id && !node.locked) {
        setIsEditing(true);
      }
    };
    document.addEventListener('builder:start-text-edit', handler);
    return () => document.removeEventListener('builder:start-text-edit', handler);
  }, [node.id, node.kind, node.locked]);

  useEffect(() => {
    if (node.kind !== 'text' && node.kind !== 'heading') return undefined;
    onInlineEditingChange?.(node.id, isEditing);
    return () => {
      if (isEditing) onInlineEditingChange?.(node.id, false);
    };
  }, [isEditing, node.id, node.kind, onInlineEditingChange]);

  const previewEntrancePreset = node.animation?.entrance?.preset ?? 'none';
  const previewEntranceDuration = node.animation?.entrance?.duration ?? 600;
  const previewEntranceDelay = node.animation?.entrance?.delay ?? 0;

  useEffect(() => {
    let timeoutId: number | undefined;
    let firstFrameId: number | undefined;
    let secondFrameId: number | undefined;

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (detail?.nodeId !== node.id || node.locked || previewEntrancePreset === 'none') return;

      if (timeoutId) window.clearTimeout(timeoutId);
      if (firstFrameId) window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) window.cancelAnimationFrame(secondFrameId);

      setAnimationPreviewPhase('initial');
      firstFrameId = window.requestAnimationFrame(() => {
        secondFrameId = window.requestAnimationFrame(() => {
          setAnimationPreviewPhase('visible');
        });
      });
      timeoutId = window.setTimeout(
        () => setAnimationPreviewPhase(null),
        previewEntranceDuration + previewEntranceDelay + 180,
      );
    };

    document.addEventListener('builder:play-animation-preview', handler);
    return () => {
      document.removeEventListener('builder:play-animation-preview', handler);
      if (timeoutId) window.clearTimeout(timeoutId);
      if (firstFrameId) window.cancelAnimationFrame(firstFrameId);
      if (secondFrameId) window.cancelAnimationFrame(secondFrameId);
    };
  }, [
    node.id,
    node.locked,
    previewEntranceDelay,
    previewEntranceDuration,
    previewEntrancePreset,
  ]);

  const isTextKind = node.kind === 'text' || node.kind === 'heading';
  const textContent = node.content as Record<string, unknown>;
  const initialRichText = isTextKind
    ? isBuilderRichText(textContent.richText)
      ? textContent.richText
      : richTextFromPlainText(typeof textContent.text === 'string' ? textContent.text : '')
    : undefined;
  const typography = isTextKind
    ? resolveThemeTextTypography(textContent as Parameters<typeof resolveThemeTextTypography>[0], theme)
    : null;
  const isActiveGroupFrame = activeGroupId === node.id;
  const isRootNode = !node.parentId;
  const isDimmedRoot = activeGroupId !== null && isRootNode && node.id !== activeGroupId;
  const isInteractive = !isDimmedRoot;
  const showColumnQuickActions = selected && isInteractive && isColumnManagerTarget(node);
  const sectionTemplate = getHomeSectionTemplateTarget(node.id);
  const currentSectionTemplateVariant = getHomeSectionTemplateVariant(node);
  const showSectionTemplateActions = selected && isInteractive && Boolean(sectionTemplate);
  const preservesHitTestLayer = node.kind === 'image' || node.kind === 'video-embed' || isContainerLikeKind(node.kind);
  const selectionZIndexBoost = selected && !preservesHitTestLayer ? 10000 : 0;
  const childrenMap = useBuilderCanvasStore((s) => s.childrenMap);
  const allNodes = useBuilderCanvasStore((s) => s.document?.nodes ?? []);
  const nodesById = useMemo(
    () => new Map(allNodes.map((candidate) => [candidate.id, candidate])),
    [allNodes],
  );
  const heroSearchInputNode = nodesById.get('home-hero-search-input');
  const heroSearchBarNode = nodesById.get('home-hero-search-bar');
  const heroSearchButtonNode = nodesById.get('home-hero-search-button');
  const heroSearchWrapNode = nodesById.get('home-hero-search-wrap');
  const heroSearchPlaceholder = textInputValue(heroSearchInputNode, 'placeholder')
    || textInputValue(heroSearchInputNode, 'text');
  const heroSearchAction = containerActionValue(heroSearchBarNode) || `/${currentBuilderLocale()}/search`;
  const showMapQuickEdit = selected && node.kind === 'map' && isInteractive && !node.locked;
  const showMapEditHint = !selected && isHovered && node.kind === 'map' && isInteractive && !node.locked;
  const mapQuickEdit = showMapQuickEdit
    ? {
        office: isOfficeMapTarget(node)
          ? {
              layoutId: node.id.replace(/-map$/, ''),
              cardId: `${node.id.replace(/-map$/, '')}-card`,
            }
          : null,
      }
    : null;
  const officeQuickEdit = mapQuickEdit?.office ?? null;
  const officeTitleNode = officeQuickEdit
    ? nodesById.get(`${officeQuickEdit.cardId}-title`)
    : undefined;
  const officeAddressNode = officeQuickEdit
    ? nodesById.get(`${officeQuickEdit.cardId}-address`)
    : undefined;
  const officePhoneNode = officeQuickEdit
    ? nodesById.get(`${officeQuickEdit.cardId}-phone`)
    : undefined;
  const officeFaxNode = officeQuickEdit
    ? nodesById.get(`${officeQuickEdit.cardId}-fax`)
    : undefined;
  const officeMapLinkNode = officeQuickEdit
    ? nodesById.get(`${officeQuickEdit.cardId}-map-link`)
    : undefined;
  const parentNode = node.parentId ? nodesById.get(node.parentId) : undefined;
  const parentLayoutMode = parentNode && isContainerLikeKind(parentNode.kind)
    ? (parentNode.content as { layoutMode?: 'absolute' | 'flex' | 'grid' }).layoutMode ?? 'absolute'
    : undefined;
  const parentUsesFlowLayout = parentLayoutMode === 'flex' || parentLayoutMode === 'grid';
  const childIds = childrenMap[node.id] ?? [];
  const nestedChildren = childIds
    .map((cid) => nodesById.get(cid))
    .filter((n): n is BuilderCanvasNode => n != null && n.visible);
  const selectionIsInside = (targetId: string) => selectedNodeIds.some((selectedId) => {
    let cursor: string | null = selectedId;
    while (cursor) {
      if (cursor === targetId) return true;
      cursor = nodesById.get(cursor)?.parentId ?? null;
    }
    return false;
  });
  const findSelfOrAncestor = (pattern: RegExp) => {
    let cursor: string | null = node.id;
    while (cursor) {
      if (pattern.test(cursor)) return cursor;
      cursor = nodesById.get(cursor)?.parentId ?? null;
    }
    return null;
  };
  const serviceCardAncestorId = findSelfOrAncestor(/^home-services-card-\d+$/);
  const serviceCardMatch = /^home-services-card-(\d+)/.exec(serviceCardAncestorId ?? node.id);
  const selectedServiceCards = new Set(
    selectedNodeIds
      .map((selectedId) => /^home-services-card-(\d+)/.exec(selectedId)?.[1])
      .filter((value): value is string => Boolean(value)),
  );
  const faqItemAncestorId = findSelfOrAncestor(/^home-faq-item-\d+$/);
  const faqItemMatch = /^home-faq-item-(\d+)/.exec(faqItemAncestorId ?? node.id);
  const selectedFaqItems = new Set(
    selectedNodeIds
      .map((selectedId) => /^home-faq-item-(\d+)/.exec(selectedId)?.[1])
      .filter((value): value is string => Boolean(value)),
  );
  const activeOfficeIndex = selectedNodeIds.reduce<number | null>((activeIndex, selectedId) => {
    const nextIndex = officeIndexFromNodeId(selectedId);
    return nextIndex ?? activeIndex;
  }, null) ?? 0;
  const officeLayoutIndex = /^home-offices-layout-(\d+)$/.exec(node.id)?.[1];
  const officeTabIndex = /^home-offices-tab-(\d+)$/.exec(node.id)?.[1];
  const officeLayoutDisplay = officeLayoutIndex
    ? Number(officeLayoutIndex) === activeOfficeIndex
      ? 'block'
      : 'none'
    : undefined;
  const builderPreviewOpen = serviceCardMatch
    ? selectedServiceCards.has(serviceCardMatch[1]) || (serviceCardMatch[1] === '0' && selectedServiceCards.size === 0 && !selectionIsInside('home-services-list'))
    : faqItemMatch
      ? selectedFaqItems.has(faqItemMatch[1]) || (faqItemMatch[1] === '0' && selectedFaqItems.size === 0 && !selectionIsInside('home-faq-list'))
      : false;
  const heroSearchActive = selectedNodeIds.some(isHeroSearchTarget);
  const showHeroSearchQuickEdit = selected && isInteractive && !node.locked && isHeroSearchTarget(node.id);
  const heroSearchLayout = (() => {
    const wrapRect = heroSearchWrapNode?.rect;
    if (!wrapRect) return 'left';
    if (wrapRect.width >= 720) return 'wide';
    if (wrapRect.x >= 180) return 'center';
    return 'left';
  })();

  useEffect(() => {
    if (node.kind !== 'map') return;
    setMapQuickAddressDraft(currentMapAddress);
  }, [currentMapAddress, node.id, node.kind]);

  const updateMapAddress = useCallback(
    (nextAddress: string, nextMapsUrl = googleMapsSearchUrl(nextAddress)) => {
      updateNodeContentInStore(node.id, { address: nextAddress });
      if (officeAddressNode) {
        updateNodeContentInStore(officeAddressNode.id, { text: nextAddress });
      }
      if (officeMapLinkNode) {
        updateNodeContentInStore(officeMapLinkNode.id, { href: nextMapsUrl });
      }
    },
    [node.id, officeAddressNode, officeMapLinkNode, updateNodeContentInStore],
  );

  const updateMapZoom = useCallback(
    (nextZoom: number) => {
      updateNodeContentInStore(node.id, {
        zoom: Math.max(1, Math.min(20, Math.round(nextZoom))),
      });
    },
    [node.id, updateNodeContentInStore],
  );

  const updateOfficeAddress = useCallback(
    (nextAddress: string, nextMapsUrl = googleMapsSearchUrl(nextAddress)) => {
      updateMapAddress(nextAddress, nextMapsUrl);
      updateMapZoom(16);
    },
    [updateMapAddress, updateMapZoom],
  );

  const applyOfficePreset = useCallback(
    (preset: OfficeQuickPreset) => {
      const phonePrefix = labelPrefix(buttonLabelValue(officePhoneNode), 'TEL');
      const faxPrefix = labelPrefix(textContentValue(officeFaxNode), 'FAX');
      updateOfficeAddress(preset.address, preset.mapsUrl);
      if (officeTitleNode) {
        updateNodeContentInStore(officeTitleNode.id, { text: preset.title });
      }
      if (officePhoneNode) {
        updateNodeContentInStore(officePhoneNode.id, {
          label: `${phonePrefix}: ${preset.phone}`,
          href: telHrefFromPhone(preset.phone),
        });
      }
      if (officeFaxNode && preset.fax) {
        updateNodeContentInStore(officeFaxNode.id, { text: `${faxPrefix}: ${preset.fax}` });
      }
    },
    [
      officeFaxNode,
      officePhoneNode,
      officeTitleNode,
      updateNodeContentInStore,
      updateOfficeAddress,
    ],
  );

  const applyMapPreset = useCallback(
    (preset: OfficeQuickPreset) => {
      if (officeQuickEdit) {
        applyOfficePreset(preset);
        return;
      }
      updateMapAddress(preset.address, preset.mapsUrl);
      updateMapZoom(16);
    },
    [applyOfficePreset, officeQuickEdit, updateMapAddress, updateMapZoom],
  );

  const updateHeroSearchPlaceholder = useCallback(
    (nextPlaceholder: string) => {
      const nextText = nextPlaceholder.trim() || nextPlaceholder;
      if (!heroSearchInputNode) return;
      updateNodeContentInStore(heroSearchInputNode.id, {
        text: nextText,
        placeholder: nextPlaceholder,
        ariaLabel: nextPlaceholder,
      });
    },
    [heroSearchInputNode, updateNodeContentInStore],
  );

  const updateHeroSearchAction = useCallback(
    (nextAction: string) => {
      if (!heroSearchBarNode) return;
      const normalizedAction = nextAction.trim() || `/${currentBuilderLocale()}/search`;
      updateNodeContentInStore(heroSearchBarNode.id, { action: normalizedAction });
      if (heroSearchButtonNode) {
        updateNodeContentInStore(heroSearchButtonNode.id, { href: normalizedAction });
      }
    },
    [heroSearchBarNode, heroSearchButtonNode, updateNodeContentInStore],
  );

  const updateHeroSearchLayout = useCallback(
    (layout: 'left' | 'center' | 'wide') => {
      const width = layout === 'wide' ? 760 : 620;
      const x = layout === 'center' ? 258 : 0;
      const buttonWidth = 62;
      const inputWidth = width - buttonWidth;
      const rects = new Map<string, BuilderCanvasNode['rect']>();
      const pushRect = (nodeId: string, patch: Partial<BuilderCanvasNode['rect']>) => {
        const target = nodesById.get(nodeId);
        if (!target) return;
        rects.set(nodeId, { ...target.rect, ...patch });
      };

      pushRect('home-hero-search-wrap', { x, width });
      pushRect('home-hero-search-bar', { width });
      pushRect('home-hero-search-input', { width: inputWidth });
      pushRect('home-hero-search-button', { x: inputWidth, width: buttonWidth });
      pushRect('home-hero-quick-menu', { width });
      for (let index = 0; index < 6; index += 1) {
        pushRect(`home-hero-quick-menu-item-${index}`, { width });
      }
      if (rects.size > 0) updateNodeRectsForViewport(rects, viewport);
    },
    [nodesById, updateNodeRectsForViewport, viewport],
  );

  const renderNestedChildNodes = () =>
    nestedChildren.map((child) => {
      const isChildSelected = selectedNodeIds.includes(child.id);
      return (
        <CanvasNode
          key={child.id}
          node={child}
          selected={isChildSelected}
          onSelect={onSelect}
          onContextMenu={onContextMenu}
          onOpenAssetLibrary={onOpenAssetLibrary}
          onMoveStart={onMoveStart}
          onResizeStart={onResizeStart}
          onUpdateContent={onUpdateContent}
          onInlineEditingChange={onInlineEditingChange}
        />
      );
    });

  const body = isEditing && isTextKind ? (
    <InlineTextEditor
      initialText={String(textContent.text || '')}
      initialRichText={initialRichText}
      fontSize={typography?.fontSize ?? 16}
      color={resolveThemeColor(typography?.color, theme)}
      fontWeight={typography?.fontWeight ?? 'regular'}
      align={typeof textContent.align === 'string' ? textContent.align : 'left'}
      onSave={handleInlineSave}
      onBlur={handleInlineBlur}
    />
  ) : component ? (
    isContainerLikeKind(node.kind) ? (
      <component.Render node={node} mode="edit" theme={theme}>
        {renderNestedChildNodes()}
      </component.Render>
    ) : (
      <component.Render node={node} mode="edit" theme={theme} />
    )
  ) : null;

  const hasVisibleBorder = node.style.borderWidth > 0;
  const activeHoverStyle = node.hoverStyle && isHovered ? node.hoverStyle : null;
  const animationSummary = getAnimationSummary(node.animation);
  const editorAnimationStyle = buildEditorAnimationStyle({
    animation: node.animation,
    isHovered,
    previewPhase: animationPreviewPhase,
    primaryColor: resolveThemeColor({ token: 'primary' }, theme),
  });
  const backgroundStyle = resolveBackgroundStyle(
    activeHoverStyle?.backgroundColor ?? node.style.backgroundColor,
    theme,
  );
  const renderedBorderColor = activeHoverStyle?.borderColor ?? node.style.borderColor;
  const renderedShadowBlur = activeHoverStyle?.shadowBlur ?? node.style.shadowBlur;
  const renderedShadowSpread = activeHoverStyle?.shadowSpread ?? node.style.shadowSpread;
  const renderedShadowColor = activeHoverStyle?.shadowColor ?? node.style.shadowColor;
  const hasVisibleShadow = renderedShadowBlur > 0
    || renderedShadowSpread !== 0
    || node.style.shadowX !== 0
    || node.style.shadowY !== 0;
  const isContainerWithChildren = isContainerLikeKind(node.kind) && nestedChildren.length > 0;
  const showSelectionHandles = selected && !node.locked && isInteractive && !isEditing;
  const showInsightsListPreview = node.id === 'home-insights-list-wrap' && isInteractive;
  const hoverTransition = node.hoverStyle
    ? `background ${node.hoverStyle.transitionMs ?? 200}ms ease, border-color ${node.hoverStyle.transitionMs ?? 200}ms ease, box-shadow ${node.hoverStyle.transitionMs ?? 200}ms ease, transform ${node.hoverStyle.transitionMs ?? 200}ms ease`
    : undefined;
  const bodyTransform = mergeCssTransforms(
    activeHoverStyle ? buildHoverTransform(activeHoverStyle) : undefined,
    editorAnimationStyle.transform,
  );
  const bodyTransition = [hoverTransition, editorAnimationStyle.transition].filter(Boolean).join(', ') || undefined;
  const renderedOpacity = typeof editorAnimationStyle.opacity === 'number'
    ? (node.style.opacity / 100) * editorAnimationStyle.opacity
    : node.style.opacity / 100;
  const nodePointerEvents = isDimmedRoot || isActiveGroupFrame || (isContainerWithChildren && !isEditing)
    ? 'none'
    : 'auto';

  if (isHiddenAtViewport) {
    return null;
  }

  return (
    <div
      ref={nodeRef}
      className={`${styles.node} ${selected ? styles.nodeSelected : ''} ${node.locked ? styles.nodeLocked : ''}`}
      style={{
        position: parentUsesFlowLayout ? 'relative' : 'absolute',
        left: parentUsesFlowLayout ? undefined : `${effectiveRect.x}px`,
        top: parentUsesFlowLayout ? undefined : `${effectiveRect.y}px`,
        width: `${effectiveRect.width}px`,
        height: `${effectiveRect.height}px`,
        zIndex: parentUsesFlowLayout ? undefined : node.zIndex + 10 + selectionZIndexBoost,
        transform: `rotate(${node.rotation}deg)`,
        transformOrigin: 'center center',
        opacity: isDimmedRoot ? 0.3 : 1,
        pointerEvents: nodePointerEvents,
        display: officeLayoutDisplay,
        outline: isActiveGroupFrame ? '2px dashed rgba(37, 99, 235, 0.72)' : undefined,
        outlineOffset: isActiveGroupFrame ? 4 : undefined,
        fontSize: effectiveFontSize ? `${effectiveFontSize}px` : undefined,
      }}
      data-node-id={node.id}
      data-selected={selected ? 'true' : undefined}
      data-builder-section-template={sectionTemplate?.id}
      data-section-variant={sectionTemplate ? currentSectionTemplateVariant : undefined}
      data-builder-hero-search-active={node.id === 'home-hero-quick-menu' && heroSearchActive ? 'true' : undefined}
      data-office-active={officeTabIndex && Number(officeTabIndex) === activeOfficeIndex ? 'true' : undefined}
      data-builder-preview-open={builderPreviewOpen ? 'true' : undefined}
      data-viewport={viewport}
      onPointerDown={(event) => {
        event.stopPropagation();
        if (event.altKey && node.parentId) {
          let selectedAncestorId: string | null = selected ? node.id : null;

          if (!selectedAncestorId) {
            let ancestorId: string | null = node.parentId;
            while (ancestorId) {
              if (selectedNodeIds.includes(ancestorId)) {
                selectedAncestorId = ancestorId;
                break;
              }
              ancestorId = nodesById.get(ancestorId)?.parentId ?? null;
            }
          }

          const nextSelectedId = selectedAncestorId
            ? (nodesById.get(selectedAncestorId)?.parentId ?? selectedAncestorId)
            : node.parentId;
          onSelect(nextSelectedId, false);
          return;
        }
        if (!isInteractive) return;
        if (event.button !== 0) return;
        const additive = event.metaKey || event.ctrlKey || event.shiftKey;
        onSelect(node.id, additive);
        if (additive || node.locked) return;
        onMoveStart(node.id, event);
      }}
      onContextMenu={(event) => {
        event.stopPropagation();
        if (!isInteractive) return;
        event.preventDefault();
        onContextMenu(node.id, event);
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        handleDoubleClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(event) => {
        event.stopPropagation();
        if (node.kind !== 'image' || !selected || node.locked || !isInteractive) return;
        onOpenAssetLibrary?.(node.id);
      }}
    >
      <div className={styles.nodeBadge}>
        <span>{node.kind}</span>
        <strong>· {Math.round(effectiveRect.width)}×{Math.round(effectiveRect.height)}</strong>
        {node.locked ? <em>locked</em> : null}
        {node.sticky ? <em title={`Pinned ${node.sticky.from === 'bottom' ? 'bottom' : 'top'} +${node.sticky.offset}px`} style={{ color: '#60a5fa' }}>📌</em> : null}
        {node.anchorName ? <em title={`Anchor: #${node.anchorName}`} style={{ color: '#34d399' }}>⚓ {node.anchorName}</em> : null}
        {animationSummary ? <em title={animationSummary} style={{ color: '#a78bfa' }}>anim</em> : null}
        {(() => {
          const linkHref = nodeLinkPreviewHref(node);
          if (!linkHref) return null;
          const preview = linkHref.length > 16 ? `${linkHref.slice(0, 14)}…` : linkHref;
          return (
            <em
              title={`Link: ${linkHref}\n클릭하거나 Cmd+K로 편집`}
              style={{
                color: '#fbbf24',
                cursor: 'pointer',
                pointerEvents: 'auto',
                userSelect: 'none',
              }}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                onSelect(node.id, false);
                if (typeof document !== 'undefined') {
                  // Prefer inline popover via SelectionToolbar; CanvasContainer
                  // listens and opens its lifted popover state. Falls back to
                  // inspector focus when no listener intercepts.
                  document.dispatchEvent(
                    new CustomEvent('builder:open-link-popover', {
                      detail: { nodeId: node.id },
                    }),
                  );
                }
              }}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              🔗 {preview}
            </em>
          );
        })()}
      </div>
      {showSectionTemplateActions && sectionTemplate ? (
        <div
          className={styles.nodeSectionTemplates}
          data-builder-section-template-panel={sectionTemplate.id}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <span className={styles.nodeSectionTemplateLabel}>{sectionTemplate.label} template</span>
          {HOME_SECTION_TEMPLATE_VARIANTS.map((variant) => (
            <button
              key={variant.key}
              type="button"
              className={`${styles.nodeSectionTemplateButton} ${
                currentSectionTemplateVariant === variant.key ? styles.nodeSectionTemplateButtonActive : ''
              }`}
              aria-pressed={currentSectionTemplateVariant === variant.key}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                updateNodeContentInStore(node.id, { variant: variant.key });
              }}
            >
              {variant.label}
            </button>
          ))}
        </div>
      ) : null}
      {showColumnQuickActions ? (
        <div
          className={styles.nodeQuickActions}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <button
            type="button"
            className={styles.nodeQuickActionPrimary}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.location.href = `/${currentBuilderLocale()}/admin-builder/columns`;
            }}
          >
            글 추가/수정
          </button>
          <button
            type="button"
            className={styles.nodeQuickAction}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.location.href = `/${currentBuilderLocale()}/admin-builder/columns?new=1`;
            }}
          >
            새 글
          </button>
          <button
            type="button"
            className={styles.nodeQuickAction}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              window.open(`/${currentBuilderLocale()}/columns`, '_blank', 'noopener,noreferrer');
            }}
          >
            공개 보기
          </button>
        </div>
      ) : null}
      {showHeroSearchQuickEdit ? (
        <div
          className={styles.nodeHeroSearchQuickEdit}
          data-builder-hero-search-quick-edit="true"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <div className={styles.nodeHeroSearchHeader}>
            <div>
              <span>Hero search</span>
              <strong>검색창 편집</strong>
            </div>
          </div>
          <div className={styles.nodeHeroSearchPresetRow}>
            {([
              ['left', 'Left'],
              ['center', 'Center'],
              ['wide', 'Wide'],
            ] as const).map(([layout, label]) => (
              <button
                key={layout}
                type="button"
                aria-pressed={heroSearchLayout === layout}
                className={heroSearchLayout === layout ? styles.nodeHeroSearchPresetActive : undefined}
                onClick={() => updateHeroSearchLayout(layout)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className={styles.nodeHeroSearchField}>
            <span>Placeholder</span>
            <input
              type="text"
              aria-label="Hero search placeholder"
              value={heroSearchPlaceholder}
              onChange={(event) => updateHeroSearchPlaceholder(event.currentTarget.value)}
            />
          </label>
          <label className={styles.nodeHeroSearchField}>
            <span>Search URL</span>
            <input
              type="text"
              aria-label="Hero search action"
              value={heroSearchAction}
              onChange={(event) => updateHeroSearchAction(event.currentTarget.value)}
            />
          </label>
          <div className={styles.nodeHeroSearchNote}>검색창, 버튼, 펼침 메뉴 폭을 함께 조정합니다.</div>
        </div>
      ) : null}
      {showMapEditHint ? (
        <div
          className={styles.nodeMapEditHint}
          data-builder-map-edit-hint="true"
          aria-hidden
        >
          <span>Google Map</span>
          <strong>위치 변경</strong>
        </div>
      ) : null}
      {mapQuickEdit ? (
        <div
          className={`${styles.nodeMapQuickEdit} ${officeQuickEdit ? styles.nodeMapQuickEditSynced : ''}`}
          data-builder-map-quick-edit="true"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
        >
          <div className={styles.nodeMapQuickEditHeader}>
            <div>
              <span>Google Map</span>
              <strong>{officeQuickEdit ? '사무소 위치 편집' : '위치 편집'}</strong>
            </div>
            <button
              type="button"
              className={styles.nodeMapHeaderAction}
              aria-label="Focus quick location field"
              onClick={() => {
                mapQuickAddressRef.current?.focus();
                mapQuickAddressRef.current?.select();
              }}
            >
              위치 변경
            </button>
          </div>
          <div className={styles.nodeMapPresetGrid}>
            {currentOfficeQuickPresets().map((preset) => (
              <button
                key={preset.title}
                type="button"
                className={`${styles.nodeMapPresetButton} ${
                  currentMapAddress === preset.address ? styles.nodeMapPresetButtonActive : ''
                }`}
                aria-pressed={currentMapAddress === preset.address}
                onClick={() => {
                  if (!selected) onSelect(node.id, false);
                  setMapQuickAddressDraft(preset.address);
                  applyMapPreset(preset);
                  window.requestAnimationFrame(() => mapQuickAddressRef.current?.focus());
                }}
              >
                {preset.title}
              </button>
            ))}
          </div>
          <label className={styles.nodeMapAddressField}>
            <span>주소</span>
            <textarea
              ref={mapQuickAddressRef}
              aria-label="Map quick address"
              rows={2}
              value={mapQuickAddressDraft}
              placeholder="주소 또는 지역명"
              onChange={(event) => {
                const nextAddress = event.currentTarget.value;
                setMapQuickAddressDraft(nextAddress);
                updateMapAddress(nextAddress);
              }}
              onBlur={(event) => updateMapAddress(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter' || event.shiftKey) return;
                event.preventDefault();
                updateMapAddress(event.currentTarget.value);
                event.currentTarget.blur();
              }}
            />
          </label>
          <button
            type="button"
            className={styles.nodeMapApplyButton}
            onClick={() => {
              const nextAddress = mapQuickAddressRef.current?.value ?? mapQuickAddressDraft;
              setMapQuickAddressDraft(nextAddress);
              updateMapAddress(nextAddress);
              mapQuickAddressRef.current?.focus();
            }}
          >
            위치 적용
          </button>
          <label className={styles.nodeMapZoomField}>
            <span>줌 {currentMapZoom}</span>
            <div className={styles.nodeMapZoomRow}>
              <button
                type="button"
                aria-label="Decrease quick map zoom"
                disabled={currentMapZoom <= 1}
                onClick={() => updateMapZoom(currentMapZoom - 1)}
              >
                -
              </button>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                aria-label="Map quick zoom"
                value={currentMapZoom}
                onInput={(event) => updateMapZoom(Number(event.currentTarget.value))}
                onChange={(event) => updateMapZoom(Number(event.target.value))}
              />
              <button
                type="button"
                aria-label="Increase quick map zoom"
                disabled={currentMapZoom >= 20}
                onClick={() => updateMapZoom(currentMapZoom + 1)}
              >
                +
              </button>
            </div>
          </label>
          {officeQuickEdit ? (
            <div className={styles.nodeMapSyncNote}>지도, 주소 카드, 길찾기 링크 동시 변경</div>
          ) : null}
        </div>
      ) : null}
      <div
        className={styles.nodeBody}
        style={{
          position: 'relative',
          ...backgroundStyle,
          borderRadius: `${node.style.borderRadius}px`,
          border: hasVisibleBorder
            ? `${node.style.borderWidth}px ${node.style.borderStyle} ${resolveThemeColor(renderedBorderColor, theme)}`
            : isActiveGroupFrame
              ? '2px dashed rgba(37, 99, 235, 0.72)'
              : isContainerWithChildren && selected
              ? '1px dashed #94a3b8'
              : 'none',
          boxShadow: editorAnimationStyle.boxShadow
            ?? (hasVisibleShadow
              ? `${node.style.shadowX}px ${node.style.shadowY}px ${renderedShadowBlur}px ${renderedShadowSpread}px ${resolveThemeColor(renderedShadowColor, theme)}`
              : isActiveGroupFrame
              ? '0 0 0 1px rgba(147, 197, 253, 0.5)'
              : 'none'),
          opacity: renderedOpacity,
          overflow: isEditing || isContainerLikeKind(node.kind) ? 'visible' : undefined,
          pointerEvents: isEditing ? 'auto' : 'none',
          transform: bodyTransform,
          transformOrigin: bodyTransform || editorAnimationStyle.transformOrigin ? 'center center' : undefined,
          transition: bodyTransition,
          clipPath: editorAnimationStyle.clipPath,
          filter: editorAnimationStyle.filter,
        }}
      >
        {body}
        {!isContainerLikeKind(node.kind) ? renderNestedChildNodes() : null}
      </div>
      {showInsightsListPreview ? <InsightsArchiveListPreview locale={currentBuilderLocale()} /> : null}
      {node.kind === 'map' && !node.locked && isInteractive ? (
        <div
          className={styles.nodeMapHitArea}
          data-builder-map-hit-area="true"
          aria-hidden
          onPointerDown={(event) => {
            event.stopPropagation();
            if (event.button !== 0) return;
            const additive = event.metaKey || event.ctrlKey || event.shiftKey;
            const wasSelected = selected;
            onSelect(node.id, additive);
            if (additive || !wasSelected) return;
            onMoveStart(node.id, event);
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (!selected) onSelect(node.id, false);
          }}
        />
      ) : null}
      {showSelectionHandles ? (
        <>
          <div className={styles.rotationLine} />
          <div
            className={styles.rotationHandle}
            onPointerDown={handleRotationPointerDown}
            role="button"
            aria-label={`Rotate ${node.kind} node`}
          />
          {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as ResizeHandle[]).map((handle) => (
            <button
              key={handle}
              type="button"
              className={`${styles.resizeHandle} ${styles[`resizeHandle${handle.toUpperCase()}` as keyof typeof styles]}`}
              onPointerDown={(event) => {
                event.stopPropagation();
                onResizeStart(node.id, handle, event);
              }}
              aria-label={`Resize ${node.kind} node ${handle}`}
            />
          ))}
          <div className={styles.nodeSizeLabel} aria-hidden>
            {node.kind} · {Math.round(effectiveRect.width)}×{Math.round(effectiveRect.height)}
          </div>
          {rotationReadout ? (
            <div
              className={styles.rotationReadout}
              style={{
                left: `${rotationReadout.x}px`,
                top: `${rotationReadout.y}px`,
              }}
              aria-live="polite"
            >
              {rotationReadout.degrees}°
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
