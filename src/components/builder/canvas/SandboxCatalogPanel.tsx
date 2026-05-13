'use client';

import { useMemo, useRef, useState } from 'react';
import { listComponents } from '@/lib/builder/components/registry';
import type { BuilderComponentCategory, BuilderComponentDefinition } from '@/lib/builder/components/define';
import {
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import { insertSectionSnapshot } from '@/lib/builder/sections/insertSection';
import {
  getBuiltInSectionSearchResults,
  type BuiltInSectionTemplate,
} from '@/lib/builder/sections/templates';
import { getAllTemplates } from '@/lib/builder/templates/registry';
import { BuiltInSectionsPanel } from '@/components/builder/sections/BuiltInSectionsPanel';
import SavedSectionsPanel from '@/components/builder/sections/SavedSectionsPanel';
import type { Locale } from '@/lib/locales';
import TemplateThumbnailRenderer from './TemplateThumbnailRenderer';
import { SandboxCatalogWidgetSection } from './SandboxCatalogWidgetSection';
import {
  DECORATIVE_WIDGET_PRESETS,
  GALLERY_WIDGET_PRESETS,
  INTERACTIVE_WIDGET_PRESETS,
  LAYOUT_WIDGET_PRESETS,
  LOCATION_WIDGET_PRESETS,
  MEDIA_WIDGET_PRESETS,
  NAVIGATION_WIDGET_PRESETS,
  SOCIAL_WIDGET_PRESETS,
  TEXT_WIDGET_PRESETS,
  type DecorativeWidgetPreset,
  type GalleryWidgetPreset,
  type InteractiveWidgetPreset,
  type LayoutWidgetPreset,
  type LocationWidgetPreset,
  type MediaWidgetPreset,
  type NavigationWidgetPreset,
  type SocialWidgetPreset,
  type TextWidgetPreset,
} from './SandboxCatalogPanel.presets';
import {
  CATEGORY_ICONS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  CATEGORY_SUBLABELS,
  compareByCategoryPriority,
  componentMatchesSearch,
  decorativeWidgetMatchesSearch,
  FEATURED_KINDS,
  galleryWidgetMatchesSearch,
  getDisplayCategory,
  getPageTemplateMeta,
  getPageTemplateQualityLabel,
  interactiveWidgetMatchesSearch,
  layoutWidgetMatchesSearch,
  locationWidgetMatchesSearch,
  mediaWidgetMatchesSearch,
  navigationWidgetMatchesSearch,
  normalizeSearchTerm,
  PAGE_TEMPLATE_PREVIEW_LIMIT,
  pageTemplateMatchesSearch,
  pageTemplateSearchScore,
  resolveCenteredNode,
  resolveSectionInsertOffset,
  socialWidgetMatchesSearch,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  textWidgetMatchesSearch,
} from './SandboxCatalogPanel.helpers';
import styles from './SandboxPage.module.css';

export default function SandboxCatalogPanel({
  locale,
  onOpenPageTemplates,
}: {
  locale?: Locale;
  onOpenPageTemplates?: (query?: string) => void;
}) {
  const { document, addNode, addNodes, setSelectedNodeId, setDraftSaveState } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const addSequenceRef = useRef(0);
  const [categoryOpen, setCategoryOpen] = useState<Record<string, boolean>>({
    'built-in-sections': true,
    'saved-sections': true,
  });
  const nodes = document?.nodes ?? [];
  const components = listComponents();
  const pageTemplateCatalog = useMemo(() => getAllTemplates(), []);
  const effectiveLocale: Locale = locale ?? (document?.locale as Locale) ?? 'ko';
  const normalizedQuery = normalizeSearchTerm(query);

  const featuredComponents = useMemo(() => (
    FEATURED_KINDS
      .map((kind) => components.find((component) => component.kind === kind))
      .filter((component): component is BuilderComponentDefinition => Boolean(component))
  ), [components]);

  const visibleTextWidgetPresets = useMemo(
    () => TEXT_WIDGET_PRESETS.filter((preset) => textWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleMediaWidgetPresets = useMemo(
    () => MEDIA_WIDGET_PRESETS.filter((preset) => mediaWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleGalleryWidgetPresets = useMemo(
    () => GALLERY_WIDGET_PRESETS.filter((preset) => galleryWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleLayoutWidgetPresets = useMemo(
    () => LAYOUT_WIDGET_PRESETS.filter((preset) => layoutWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleInteractiveWidgetPresets = useMemo(
    () => INTERACTIVE_WIDGET_PRESETS.filter((preset) => interactiveWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleNavigationWidgetPresets = useMemo(
    () => NAVIGATION_WIDGET_PRESETS.filter((preset) => navigationWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleSocialWidgetPresets = useMemo(
    () => SOCIAL_WIDGET_PRESETS.filter((preset) => socialWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleLocationWidgetPresets = useMemo(
    () => LOCATION_WIDGET_PRESETS.filter((preset) => locationWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleDecorativeWidgetPresets = useMemo(
    () => DECORATIVE_WIDGET_PRESETS.filter((preset) => decorativeWidgetMatchesSearch(preset, normalizedQuery)),
    [normalizedQuery],
  );
  const visibleBuiltInSectionTemplates = useMemo(
    () => getBuiltInSectionSearchResults(normalizedQuery),
    [normalizedQuery],
  );
  const totalBuiltInSectionTemplateCount = useMemo(
    () => getBuiltInSectionSearchResults('').length,
    [],
  );
  const matchingPageTemplates = useMemo(
    () => (normalizedQuery
      ? pageTemplateCatalog
        .filter((template) => pageTemplateMatchesSearch(template, normalizedQuery))
        .sort((left, right) => (
          pageTemplateSearchScore(right, normalizedQuery)
          - pageTemplateSearchScore(left, normalizedQuery)
          || left.name.localeCompare(right.name, 'ko')
        ))
      : []),
    [normalizedQuery, pageTemplateCatalog],
  );
  const visiblePageTemplatePreviews = matchingPageTemplates.slice(0, PAGE_TEMPLATE_PREVIEW_LIMIT);

  const groupedCategories = useMemo(() => {
    const buckets = new Map<BuilderComponentCategory, BuilderComponentDefinition[]>();

    for (const component of components) {
      const category = getDisplayCategory(component);
      const current = buckets.get(category) ?? [];
      current.push(component);
      buckets.set(category, current);
    }

    const remainingCategories = [...buckets.keys()].filter(
      (category) => !CATEGORY_ORDER.includes(category),
    );

    return [...CATEGORY_ORDER, ...remainingCategories]
      .filter((category) => (buckets.get(category) ?? []).length > 0)
      .map((category) => {
        const filteredComponents = [...(buckets.get(category) ?? [])]
          .filter((component) => componentMatchesSearch(component, normalizedQuery))
          .sort((left, right) => compareByCategoryPriority(category, left, right));

        return {
          category,
          components: filteredComponents,
        };
      })
      .filter(({ components: categoryComponents }) => categoryComponents.length > 0);
  }, [components, normalizedQuery]);

  const visibleComponentCount = groupedCategories.reduce(
    (count, group) => count + group.components.length,
    0,
  );
  const totalCatalogCount = components.length + TEXT_WIDGET_PRESETS.length + MEDIA_WIDGET_PRESETS.length + GALLERY_WIDGET_PRESETS.length + LAYOUT_WIDGET_PRESETS.length + INTERACTIVE_WIDGET_PRESETS.length + NAVIGATION_WIDGET_PRESETS.length + SOCIAL_WIDGET_PRESETS.length + LOCATION_WIDGET_PRESETS.length + DECORATIVE_WIDGET_PRESETS.length + totalBuiltInSectionTemplateCount + pageTemplateCatalog.length;
  const visibleCatalogCount = visibleComponentCount + visibleTextWidgetPresets.length + visibleMediaWidgetPresets.length + visibleGalleryWidgetPresets.length + visibleLayoutWidgetPresets.length + visibleInteractiveWidgetPresets.length + visibleNavigationWidgetPresets.length + visibleSocialWidgetPresets.length + visibleLocationWidgetPresets.length + visibleDecorativeWidgetPresets.length + visibleBuiltInSectionTemplates.length + matchingPageTemplates.length;

  function toggleCategory(categoryId: string, defaultOpen = true) {
    setCategoryOpen((current) => ({
      ...current,
      [categoryId]: !(current[categoryId] ?? defaultOpen),
    }));
  }

  function handleQuickAdd(kind: BuilderCanvasNodeKind) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    addNode(resolveCenteredNode(kind, nodes.length + sequence, sequence));
    setDraftSaveState('saving');
  }

  function handleAddTextWidgetPreset(preset: TextWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddMediaWidgetPreset(preset: MediaWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddGalleryWidgetPreset(preset: GalleryWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddLayoutWidgetPreset(preset: LayoutWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
      anchorName: preset.id === 'layout-sticky-anchor' ? 'services' : seed.anchorName,
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddDecorativeWidgetPreset(preset: DecorativeWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddLocationWidgetPreset(preset: LocationWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddSocialWidgetPreset(preset: SocialWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddNavigationWidgetPreset(preset: NavigationWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleAddInteractiveWidgetPreset(preset: InteractiveWidgetPreset) {
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(preset.kind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      rect: {
        ...seed.rect,
        width: preset.width,
        height: preset.height,
      },
      content: {
        ...seed.content,
        ...preset.content,
      },
      style: {
        ...seed.style,
        ...(preset.style ?? {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
    setDraftSaveState('saving');
  }

  function handleInsertBuiltInSection(template: BuiltInSectionTemplate) {
    if (!document) return;
    const result = insertSectionSnapshot(
      template.nodes,
      template.rootNodeId,
      resolveSectionInsertOffset(nodes, template),
    );
    if (result.nodes.length === 0) return;
    addNodes(result.nodes, result.rootNodeId);
    setSelectedNodeId(result.rootNodeId);
    setDraftSaveState('saving');
  }

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Catalog</span>
          <strong>
            {normalizedQuery ? `${visibleCatalogCount}/${totalCatalogCount}` : totalCatalogCount} items
          </strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? '카탈로그 접기' : '카탈로그 열기'}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </header>
      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        <p className={styles.panelCopy}>
          registry 컴포넌트를 카테고리별로 묶었습니다. drag 로 캔버스에 추가하거나 quick-add 로 중앙에 바로 생성합니다.
        </p>
        {onOpenPageTemplates ? (
          <button
            type="button"
            className={styles.actionButton}
            data-builder-open-page-template-market="true"
            onClick={() => onOpenPageTemplates(query)}
          >
            전체 페이지 템플릿 261개 보기
          </button>
        ) : null}

        <label className={styles.catalogSearchLabel}>
          <span>Search elements</span>
          <input
            type="search"
            aria-label="Search add elements"
            className={styles.catalogSearchInput}
            placeholder="Text, button, image..."
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>

        <div className={styles.catalogQuickStrip} aria-label="Popular add elements">
          {featuredComponents.map((component) => (
            <button
              key={component.kind}
              type="button"
              className={styles.catalogQuickButton}
              data-builder-add-quick-kind={component.kind}
              onClick={() => handleQuickAdd(component.kind as BuilderCanvasNodeKind)}
            >
              <span>{component.icon}</span>
              <strong>{component.displayName}</strong>
            </button>
          ))}
        </div>

        {normalizedQuery ? (
          <div className={styles.catalogResultMeta} aria-live="polite">
            Showing {visibleCatalogCount} result{visibleCatalogCount === 1 ? '' : 's'} for “{query.trim()}”
          </div>
        ) : null}

        {normalizedQuery && onOpenPageTemplates && matchingPageTemplates.length > 0 ? (
          <div
            className={styles.catalogCategorySection}
            data-builder-page-template-search-results="true"
          >
            <div className={styles.catalogCategoryButton}>
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>PG</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Page template showroom</span>
                  <span
                    className={styles.catalogCategoryHint}
                    data-builder-page-template-result-count="true"
                  >
                    {matchingPageTemplates.length}/{pageTemplateCatalog.length} page templates
                  </span>
                </span>
              </span>
              <button
                type="button"
                className={styles.catalogQuickAddButton}
                onClick={() => onOpenPageTemplates(query)}
              >
                전체 결과 보기
              </button>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {visiblePageTemplatePreviews.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  data-builder-page-template-result-id={template.id}
                  onClick={() => onOpenPageTemplates(template.name)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '96px minmax(0, 1fr)',
                    gap: 10,
                    alignItems: 'stretch',
                    minHeight: 88,
                    border: '1px solid var(--editor-border-hairline, #dbe2ea)',
                    borderRadius: 8,
                    background: 'var(--editor-panel-elevated, #fff)',
                    color: 'var(--editor-fg-primary, #0f172a)',
                    padding: 8,
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      minWidth: 0,
                      overflow: 'hidden',
                      border: '1px solid var(--editor-border-hairline, #dbe2ea)',
                      borderRadius: 7,
                      background: 'var(--editor-bg, #f4f5f7)',
                    }}
                  >
                    <TemplateThumbnailRenderer template={template} width={160} height={96} eager />
                  </span>
                  <span style={{ display: 'grid', alignContent: 'start', minWidth: 0, gap: 5 }}>
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        minWidth: 0,
                      }}
                    >
                      <strong
                        style={{
                          minWidth: 0,
                          overflow: 'hidden',
                          fontSize: '0.78rem',
                          fontWeight: 850,
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {template.name}
                      </strong>
                      <span
                        data-builder-page-template-quality="true"
                        style={{
                          flex: '0 0 auto',
                          borderRadius: 999,
                          background: template.qualityTier === 'premium' ? '#111827' : 'var(--editor-bg, #f4f5f7)',
                          color: template.qualityTier === 'premium' ? '#fff' : 'var(--editor-fg-muted, #64748b)',
                          padding: '2px 6px',
                          fontSize: '0.6rem',
                          fontWeight: 850,
                          lineHeight: 1.2,
                        }}
                      >
                        {getPageTemplateQualityLabel(template)}
                      </span>
                    </span>
                    <small
                      style={{
                        color: 'var(--editor-fg-muted, #64748b)',
                        fontSize: '0.68rem',
                        fontWeight: 750,
                        lineHeight: 1.35,
                      }}
                    >
                      {getPageTemplateMeta(template)}
                    </small>
                    <span
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                      }}
                    >
                      {(template.tags ?? []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            borderRadius: 999,
                            background: 'var(--editor-accent-soft, #eff6ff)',
                            color: 'var(--editor-accent, #116dff)',
                            padding: '2px 6px',
                            fontSize: '0.6rem',
                            fontWeight: 800,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <SandboxCatalogWidgetSection
          categoryId="text-widgets"
          icon="T"
          name="Text widget pack"
          hint={`H1-H6, rich text, path, columns, quote, list, marquee · ${visibleTextWidgetPresets.length}`}
          presets={visibleTextWidgetPresets}
          isOpen={categoryOpen['text-widgets'] ?? true}
          dataAttribute="data-builder-text-widget-preset"
          onAdd={handleAddTextWidgetPreset}
          onToggle={() => toggleCategory('text-widgets')}
          variant="text"
        />

        <SandboxCatalogWidgetSection
          categoryId="media-widgets"
          icon="◩"
          name="Media widget pack"
          hint={`lightbox, hotspots, compare, video, audio, icons · ${visibleMediaWidgetPresets.length}`}
          presets={visibleMediaWidgetPresets}
          isOpen={categoryOpen['media-widgets'] ?? true}
          dataAttribute="data-builder-media-widget-preset"
          onAdd={handleAddMediaWidgetPreset}
          onToggle={() => toggleCategory('media-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="gallery-widgets"
          icon="▧"
          name="Gallery widget pack"
          hint={`grid, masonry, slider, slideshow, thumbnail, pro, caption, filter · ${visibleGalleryWidgetPresets.length}`}
          presets={visibleGalleryWidgetPresets}
          isOpen={categoryOpen['gallery-widgets'] ?? true}
          dataAttribute="data-builder-gallery-widget-preset"
          onAdd={handleAddGalleryWidgetPreset}
          onToggle={() => toggleCategory('gallery-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="layout-widgets"
          icon="▦"
          name="Layout widget pack"
          hint={`strip, box, columns, repeater, tabs, accordion, slideshow, hover · ${visibleLayoutWidgetPresets.length}`}
          presets={visibleLayoutWidgetPresets}
          isOpen={categoryOpen['layout-widgets'] ?? true}
          dataAttribute="data-builder-layout-widget-preset"
          onAdd={handleAddLayoutWidgetPreset}
          onToggle={() => toggleCategory('layout-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="interactive-widgets"
          icon="◉"
          name="Interactive widget pack"
          hint={`countdown, progress, rating, notification, back-to-top · ${visibleInteractiveWidgetPresets.length}`}
          presets={visibleInteractiveWidgetPresets}
          isOpen={categoryOpen['interactive-widgets'] ?? true}
          dataAttribute="data-builder-interactive-widget-preset"
          onAdd={handleAddInteractiveWidgetPreset}
          onToggle={() => toggleCategory('interactive-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="navigation-widgets"
          icon="≡"
          name="Navigation widget pack"
          hint={`menu, dropdown, mega, anchor, breadcrumbs · ${visibleNavigationWidgetPresets.length}`}
          presets={visibleNavigationWidgetPresets}
          isOpen={categoryOpen['navigation-widgets'] ?? true}
          dataAttribute="data-builder-navigation-widget-preset"
          onAdd={handleAddNavigationWidgetPreset}
          onToggle={() => toggleCategory('navigation-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="social-widgets"
          icon="@"
          name="Social widget pack"
          hint={`social-bar, share, embed, floating chat · ${visibleSocialWidgetPresets.length}`}
          presets={visibleSocialWidgetPresets}
          isOpen={categoryOpen['social-widgets'] ?? true}
          dataAttribute="data-builder-social-widget-preset"
          onAdd={handleAddSocialWidgetPreset}
          onToggle={() => toggleCategory('social-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="location-widgets"
          icon="📍"
          name="Maps & Location pack"
          hint={`address, hours, multi-map · ${visibleLocationWidgetPresets.length}`}
          presets={visibleLocationWidgetPresets}
          isOpen={categoryOpen['location-widgets'] ?? true}
          dataAttribute="data-builder-location-widget-preset"
          onAdd={handleAddLocationWidgetPreset}
          onToggle={() => toggleCategory('location-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="decorative-widgets"
          icon="◆"
          name="Decorative widget pack"
          hint={`shape, pattern, parallax, frame, sticker · ${visibleDecorativeWidgetPresets.length}`}
          presets={visibleDecorativeWidgetPresets}
          isOpen={categoryOpen['decorative-widgets'] ?? true}
          dataAttribute="data-builder-decorative-widget-preset"
          onAdd={handleAddDecorativeWidgetPreset}
          onToggle={() => toggleCategory('decorative-widgets')}
        />

        {/* Built-in section templates — normalized section snapshots. */}
        {(!normalizedQuery || visibleBuiltInSectionTemplates.length > 0) ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['built-in-sections'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'built-in-sections': !(current['built-in-sections'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>▤</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Section templates</span>
                  <span className={styles.catalogCategoryHint}>
                    전문 디자인팩 · {visibleBuiltInSectionTemplates.length}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['built-in-sections'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['built-in-sections'] ?? true) ? (
              <BuiltInSectionsPanel
                query={normalizedQuery}
                onInsert={handleInsertBuiltInSection}
              />
            ) : null}
          </div>
        ) : null}

        {/* Saved sections — Wix Studio "Saved Sections" parity. */}
        {!normalizedQuery ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['saved-sections'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              onClick={() => {
                setCategoryOpen((current) => ({
                  ...current,
                  'saved-sections': !(current['saved-sections'] ?? true),
                }));
              }}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>★</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>Saved sections</span>
                  <span className={styles.catalogCategoryHint}>
                    내가 저장한 섹션 라이브러리
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['saved-sections'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['saved-sections'] ?? true) ? (
              <SavedSectionsPanel locale={effectiveLocale} />
            ) : null}
          </div>
        ) : null}

        {groupedCategories.map(({ category, components: categoryComponents }) => {
          const isOpen = categoryOpen[category] ?? true;
          return (
            <div key={category} className={styles.catalogCategorySection}>
              <button
                type="button"
                className={`${styles.catalogCategoryButton} ${isOpen ? styles.catalogCategoryButtonOpen : ''}`}
                onClick={() => {
                  setCategoryOpen((current) => ({
                    ...current,
                    [category]: !isOpen,
                  }));
                }}
              >
                <span className={styles.catalogCategoryMeta}>
                  <span className={styles.catalogCategoryIcon}>{CATEGORY_ICONS[category]}</span>
                  <span className={styles.catalogCategoryTitle}>
                    <span className={styles.catalogCategoryName}>{CATEGORY_LABELS[category]}</span>
                    <span className={styles.catalogCategoryHint}>
                      {CATEGORY_SUBLABELS[category]} · {categoryComponents.length}
                    </span>
                  </span>
                </span>
                <span className={styles.catalogCategoryToggle}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen ? (
                <div className={styles.catalogSectionGrid}>
                  {categoryComponents.map((component) => (
                    <div key={component.kind} className={styles.catalogCard} data-builder-add-card={component.kind}>
                      <button
                        type="button"
                        className={styles.catalogDragButton}
                        data-builder-add-card-kind={component.kind}
                        title={`${component.displayName} — 캔버스로 드래그하여 추가`}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData('application/x-builder-node-kind', component.kind);
                          event.dataTransfer.effectAllowed = 'copy';
                        }}
                      >
                        <span className={styles.catalogCardIcon}>{component.icon}</span>
                        <span className={styles.catalogCardName}>{component.displayName}</span>
                        <span className={styles.catalogCardMeta}>{component.kind} · drag to canvas</span>
                      </button>

                      <button
                        type="button"
                        className={styles.catalogQuickAddButton}
                        title={`${component.displayName} 캔버스 중앙에 추가`}
                        onClick={() => handleQuickAdd(component.kind as BuilderCanvasNodeKind)}
                      >
                        Quick add
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}

        {normalizedQuery && visibleCatalogCount === 0 ? (
          <div className={styles.catalogEmptyState}>
            <strong>No matching elements</strong>
            <span>Try text, image, button, form, section.</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
