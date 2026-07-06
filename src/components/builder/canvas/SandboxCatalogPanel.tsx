'use client';

import { useMemo, useRef, useState } from 'react';
import { listComponents } from '@/lib/builder/components/registry';
import type { BuilderComponentCategory, BuilderComponentDefinition } from '@/lib/builder/components/define';
import {
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import {
  builderAppWidgetMatchesSearch,
  type BuilderRegisteredAppWidget,
} from '@/lib/builder/apps/widgets';
import type { BuilderCanvasDocument, BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
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
  BUILDER_APP_WIDGET_DRAG_MIME,
  BUILDER_NODE_KIND_DRAG_MIME,
} from './canvasCatalogDrop';
import {
  DECORATIVE_WIDGET_PRESETS,
  DESIGNER_WIDGET_PRESETS,
  GALLERY_WIDGET_PRESETS,
  INTERACTIVE_WIDGET_PRESETS,
  LAYOUT_WIDGET_PRESETS,
  LOCATION_WIDGET_PRESETS,
  localizeDecorativeWidgetPreset,
  localizeDesignerWidgetPreset,
  localizeGalleryWidgetPreset,
  localizeInteractiveWidgetPreset,
  localizeLayoutWidgetPreset,
  localizeLocationWidgetPreset,
  localizeMediaWidgetPreset,
  localizeNavigationWidgetPreset,
  localizeSocialWidgetPreset,
  localizeTextWidgetPreset,
  MEDIA_WIDGET_PRESETS,
  NAVIGATION_WIDGET_PRESETS,
  SOCIAL_WIDGET_PRESETS,
  TEXT_WIDGET_PRESETS,
  type DecorativeWidgetPreset,
  type DesignerWidgetPreset,
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
  CATEGORY_ORDER,
  compareByCategoryPriority,
  componentMatchesSearch,
  decorativeWidgetMatchesSearch,
  designerWidgetMatchesSearch,
  FEATURED_KINDS,
  galleryWidgetMatchesSearch,
  getCatalogCategoryCopy,
  getComponentCatalogDisplayName,
  getDisplayCategory,
  getPageTemplateMeta,
  getPageTemplatePreviewName,
  getPageTemplatePreviewTags,
  getPageTemplateQualityLabel,
  getSandboxCatalogPanelCopy,
  interactiveWidgetMatchesSearch,
  layoutWidgetMatchesSearch,
  locationWidgetMatchesSearch,
  mediaWidgetMatchesSearch,
  navigationWidgetMatchesSearch,
  normalizeSearchTerm,
  PAGE_TEMPLATE_PREVIEW_LIMIT,
  pageTemplateMatchesSearch,
  pageTemplatePreviewMatchesSearch,
  pageTemplateSearchScore,
  resolveCenteredNode,
  resolveSectionInsertOffset,
  socialWidgetMatchesSearch,
  textWidgetMatchesSearch,
} from './SandboxCatalogPanel.helpers';
import styles from './SandboxPage.module.css';

const EMPTY_CATALOG_NODES: BuilderCanvasDocument['nodes'] = [];

export default function SandboxCatalogPanel({
  locale,
  appWidgets = [],
  onOpenPageTemplates,
}: {
  locale?: Locale;
  appWidgets?: BuilderRegisteredAppWidget[];
  onOpenPageTemplates?: (query?: string) => void;
}) {
  const nodes = useBuilderCanvasStore((state) => state.document?.nodes ?? EMPTY_CATALOG_NODES);
  const hasDocument = useBuilderCanvasStore((state) => state.document != null);
  const documentLocale = useBuilderCanvasStore((state) => state.document?.locale);
  const addNode = useBuilderCanvasStore((state) => state.addNode);
  const addNodes = useBuilderCanvasStore((state) => state.addNodes);
  const setSelectedNodeId = useBuilderCanvasStore((state) => state.setSelectedNodeId);
  const setDraftSaveState = useBuilderCanvasStore((state) => state.setDraftSaveState);
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const addSequenceRef = useRef(0);
  const [categoryOpen, setCategoryOpen] = useState<Record<string, boolean>>({
    'built-in-sections': true,
    'saved-sections': true,
  });
  const components = listComponents();
  const pageTemplateCatalog = useMemo(() => getAllTemplates(), []);
  const effectiveLocale: Locale = locale ?? (documentLocale as Locale) ?? 'ko';
  const catalogCopy = getSandboxCatalogPanelCopy(effectiveLocale);
  const normalizedQuery = normalizeSearchTerm(query);

  const featuredComponents = useMemo(() => (
    FEATURED_KINDS
      .map((kind) => components.find((component) => component.kind === kind))
      .filter((component): component is BuilderComponentDefinition => Boolean(component))
  ), [components]);

  const visibleTextWidgetPresets = useMemo(
    () => TEXT_WIDGET_PRESETS
      .map((preset) => localizeTextWidgetPreset(preset, effectiveLocale))
      .filter((preset) => textWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleMediaWidgetPresets = useMemo(
    () => MEDIA_WIDGET_PRESETS
      .map((preset) => localizeMediaWidgetPreset(preset, effectiveLocale))
      .filter((preset) => mediaWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleGalleryWidgetPresets = useMemo(
    () => GALLERY_WIDGET_PRESETS
      .map((preset) => localizeGalleryWidgetPreset(preset, effectiveLocale))
      .filter((preset) => galleryWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleLayoutWidgetPresets = useMemo(
    () => LAYOUT_WIDGET_PRESETS
      .map((preset) => localizeLayoutWidgetPreset(preset, effectiveLocale))
      .filter((preset) => layoutWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleInteractiveWidgetPresets = useMemo(
    () => INTERACTIVE_WIDGET_PRESETS
      .map((preset) => localizeInteractiveWidgetPreset(preset, effectiveLocale))
      .filter((preset) => interactiveWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleNavigationWidgetPresets = useMemo(
    () => NAVIGATION_WIDGET_PRESETS
      .map((preset) => localizeNavigationWidgetPreset(preset, effectiveLocale))
      .filter((preset) => navigationWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleSocialWidgetPresets = useMemo(
    () => SOCIAL_WIDGET_PRESETS
      .map((preset) => localizeSocialWidgetPreset(preset, effectiveLocale))
      .filter((preset) => socialWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleLocationWidgetPresets = useMemo(
    () => LOCATION_WIDGET_PRESETS
      .map((preset) => localizeLocationWidgetPreset(preset, effectiveLocale))
      .filter((preset) => locationWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleDecorativeWidgetPresets = useMemo(
    () => DECORATIVE_WIDGET_PRESETS
      .map((preset) => localizeDecorativeWidgetPreset(preset, effectiveLocale))
      .filter((preset) => decorativeWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleDesignerWidgetPresets = useMemo(
    () => DESIGNER_WIDGET_PRESETS
      .map((preset) => localizeDesignerWidgetPreset(preset, effectiveLocale))
      .filter((preset) => designerWidgetMatchesSearch(preset, normalizedQuery)),
    [effectiveLocale, normalizedQuery],
  );
  const visibleAppWidgets = useMemo(
    () => appWidgets.filter((widget) => builderAppWidgetMatchesSearch(widget, normalizedQuery)),
    [appWidgets, normalizedQuery],
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
        .filter((template) => (
          pageTemplateMatchesSearch(template, normalizedQuery)
          || pageTemplatePreviewMatchesSearch(template, effectiveLocale, normalizedQuery)
        ))
        .sort((left, right) => (
          pageTemplateSearchScore(right, normalizedQuery)
          - pageTemplateSearchScore(left, normalizedQuery)
          || left.name.localeCompare(right.name, 'ko')
        ))
      : []),
    [effectiveLocale, normalizedQuery, pageTemplateCatalog],
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
          .filter((component) => componentMatchesSearch(component, normalizedQuery, effectiveLocale))
          .sort((left, right) => compareByCategoryPriority(category, left, right, effectiveLocale));

        return {
          category,
          components: filteredComponents,
        };
      })
      .filter(({ components: categoryComponents }) => categoryComponents.length > 0);
  }, [components, effectiveLocale, normalizedQuery]);

  const visibleComponentCount = groupedCategories.reduce(
    (count, group) => count + group.components.length,
    0,
  );
  const totalCatalogCount = components.length + appWidgets.length + TEXT_WIDGET_PRESETS.length + MEDIA_WIDGET_PRESETS.length + GALLERY_WIDGET_PRESETS.length + LAYOUT_WIDGET_PRESETS.length + INTERACTIVE_WIDGET_PRESETS.length + NAVIGATION_WIDGET_PRESETS.length + SOCIAL_WIDGET_PRESETS.length + LOCATION_WIDGET_PRESETS.length + DECORATIVE_WIDGET_PRESETS.length + DESIGNER_WIDGET_PRESETS.length + totalBuiltInSectionTemplateCount + pageTemplateCatalog.length;
  const visibleCatalogCount = visibleComponentCount + visibleAppWidgets.length + visibleTextWidgetPresets.length + visibleMediaWidgetPresets.length + visibleGalleryWidgetPresets.length + visibleLayoutWidgetPresets.length + visibleInteractiveWidgetPresets.length + visibleNavigationWidgetPresets.length + visibleSocialWidgetPresets.length + visibleLocationWidgetPresets.length + visibleDecorativeWidgetPresets.length + visibleDesignerWidgetPresets.length + visibleBuiltInSectionTemplates.length + matchingPageTemplates.length;

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

  function handleAddAppWidget(widget: BuilderRegisteredAppWidget) {
    if (!widget.canvasKind) return;
    const sequence = addSequenceRef.current;
    addSequenceRef.current += 1;
    const seed = resolveCenteredNode(widget.canvasKind, nodes.length + sequence, sequence);
    const node = {
      ...seed,
      appWidget: {
        appId: widget.appId,
        widgetId: widget.widgetId,
      },
      content: {
        ...seed.content,
        ...(widget.defaultContent ?? {}),
      },
      rect: {
        ...seed.rect,
        ...(widget.defaultSize ? {
          width: widget.defaultSize.width,
          height: widget.defaultSize.height,
        } : {}),
      },
    } as BuilderCanvasNode;

    addNode(node);
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

  function handleAddDesignerWidgetPreset(preset: DesignerWidgetPreset) {
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
    if (!hasDocument) return;
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
          <span>{catalogCopy.title}</span>
          <strong>
            {catalogCopy.countLabel(visibleCatalogCount, totalCatalogCount, Boolean(normalizedQuery))}
          </strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? catalogCopy.collapseTitle : catalogCopy.expandTitle}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? catalogCopy.collapseLabel : catalogCopy.expandLabel}
        </button>
      </header>
      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        <p className={styles.panelCopy}>
          {catalogCopy.intro}
        </p>
        {onOpenPageTemplates ? (
          <button
            type="button"
            className={styles.actionButton}
            data-builder-open-page-template-market="true"
            onClick={() => onOpenPageTemplates(query)}
          >
            {catalogCopy.openPageTemplates(pageTemplateCatalog.length)}
          </button>
        ) : null}

        <label className={styles.catalogSearchLabel}>
          <span>{catalogCopy.searchLabel}</span>
          <input
            type="search"
            aria-label={catalogCopy.searchAriaLabel}
            className={styles.catalogSearchInput}
            placeholder={catalogCopy.searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
        </label>

        <div className={styles.catalogQuickStrip} aria-label={catalogCopy.quickStripAriaLabel}>
          {featuredComponents.map((component) => {
            const displayName = getComponentCatalogDisplayName(component, effectiveLocale);
            return (
              <button
                key={component.kind}
                type="button"
                className={styles.catalogQuickButton}
                data-builder-add-quick-kind={component.kind}
                onClick={() => handleQuickAdd(component.kind as BuilderCanvasNodeKind)}
              >
                <span>{component.icon}</span>
                <strong>{displayName}</strong>
              </button>
            );
          })}
        </div>

        {normalizedQuery ? (
          <div className={styles.catalogResultMeta} aria-live="polite">
            {catalogCopy.resultSummary(visibleCatalogCount, query.trim())}
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
                  <span className={styles.catalogCategoryName}>{catalogCopy.pageTemplateShowroom}</span>
                  <span
                    className={styles.catalogCategoryHint}
                    data-builder-page-template-result-count="true"
                  >
                    {catalogCopy.pageTemplateCount(matchingPageTemplates.length, pageTemplateCatalog.length)}
                  </span>
                </span>
              </span>
              <button
                type="button"
                className={styles.catalogQuickAddButton}
                onClick={() => onOpenPageTemplates(query)}
              >
                {catalogCopy.viewAllResults}
              </button>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {visiblePageTemplatePreviews.map((template) => {
                const previewName = getPageTemplatePreviewName(template, effectiveLocale);
                const previewTags = getPageTemplatePreviewTags(template, effectiveLocale);
                return (
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
                      <TemplateThumbnailRenderer template={template} width={160} height={96} eager locale={effectiveLocale} />
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
                          {previewName}
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
                          {getPageTemplateQualityLabel(template, effectiveLocale)}
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
                        {getPageTemplateMeta(template, effectiveLocale)}
                      </small>
                      <span
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 4,
                        }}
                      >
                        {previewTags.slice(0, 2).map((tag) => (
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
                );
              })}
            </div>
          </div>
        ) : null}

        {(!normalizedQuery || visibleAppWidgets.length > 0) && appWidgets.length > 0 ? (
          <div
            className={styles.catalogCategorySection}
            data-builder-app-widget-section="true"
          >
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['app-widgets'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              data-add-category="app-widgets"
              onClick={() => toggleCategory('app-widgets')}
            >
              <span className={styles.catalogCategoryMeta}>
                <span className={styles.catalogCategoryIcon}>APP</span>
                <span className={styles.catalogCategoryTitle}>
                  <span className={styles.catalogCategoryName}>{catalogCopy.appWidgetsName}</span>
                  <span
                    className={styles.catalogCategoryHint}
                    data-builder-app-widget-count="true"
                  >
                    {catalogCopy.appWidgetsHint(visibleAppWidgets.length)}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['app-widgets'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['app-widgets'] ?? true) ? (
              <div className={`${styles.catalogSectionGrid} ${styles.appWidgetGrid}`}>
                {visibleAppWidgets.map((widget) => {
                  const iconLabel = widget.appIcon.length > 3
                    ? widget.appIcon.slice(0, 2).toUpperCase()
                    : widget.appIcon;
                  const widgetKey = `${widget.appId}:${widget.widgetId}`;
                  return (
                    <div
                      key={widget.id}
                      className={styles.catalogCard}
                      data-builder-app-widget-card={widget.id}
                      data-builder-app-widget-key={widgetKey}
                      data-builder-app-widget-kind={widget.canvasKind ?? ''}
                    >
                      <button
                        type="button"
                        className={styles.catalogDragButton}
                        title={
                          widget.insertable
                            ? catalogCopy.dragTitle(widget.name)
                            : widget.unavailableReason ?? catalogCopy.widgetRuntimeUnavailable
                        }
                        draggable={widget.insertable}
                        disabled={!widget.insertable}
                        onDragStart={(event) => {
                          if (!widget.canvasKind) return;
                          event.dataTransfer.setData(BUILDER_NODE_KIND_DRAG_MIME, widget.canvasKind);
                          event.dataTransfer.setData(BUILDER_APP_WIDGET_DRAG_MIME, JSON.stringify({
                            appId: widget.appId,
                            widgetId: widget.widgetId,
                            defaultContent: widget.defaultContent ?? {},
                            defaultSize: widget.defaultSize ?? null,
                          }));
                          event.dataTransfer.effectAllowed = 'copy';
                        }}
                      >
                        <span className={styles.catalogCardIcon}>{iconLabel}</span>
                        <span className={styles.catalogCardName}>{widget.name}</span>
                        <span className={styles.catalogCardMeta}>
                          {catalogCopy.appWidgetMeta(widget.appName, widget.area)}
                        </span>
                        <span className={styles.catalogCardMeta}>
                          {widget.description ?? catalogCopy.appWidgetDescriptionFallback(widget.appName)}
                        </span>
                      </button>

                      <button
                        type="button"
                        className={styles.catalogQuickAddButton}
                        data-builder-app-widget-add={widget.id}
                        title={
                          widget.insertable
                            ? catalogCopy.quickAddTitle(widget.name)
                            : widget.unavailableReason ?? catalogCopy.widgetRuntimeUnavailable
                        }
                        disabled={!widget.insertable}
                        onClick={() => handleAddAppWidget(widget)}
                      >
                        {widget.insertable ? catalogCopy.quickAdd : catalogCopy.runtimeUnavailable}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        <SandboxCatalogWidgetSection
          categoryId="text-widgets"
          icon="T"
          name={catalogCopy.widgetSections.text.name}
          hint={catalogCopy.widgetSections.text.hint(visibleTextWidgetPresets.length)}
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
          name={catalogCopy.widgetSections.media.name}
          hint={catalogCopy.widgetSections.media.hint(visibleMediaWidgetPresets.length)}
          presets={visibleMediaWidgetPresets}
          isOpen={categoryOpen['media-widgets'] ?? true}
          dataAttribute="data-builder-media-widget-preset"
          onAdd={handleAddMediaWidgetPreset}
          onToggle={() => toggleCategory('media-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="gallery-widgets"
          icon="▧"
          name={catalogCopy.widgetSections.gallery.name}
          hint={catalogCopy.widgetSections.gallery.hint(visibleGalleryWidgetPresets.length)}
          presets={visibleGalleryWidgetPresets}
          isOpen={categoryOpen['gallery-widgets'] ?? true}
          dataAttribute="data-builder-gallery-widget-preset"
          onAdd={handleAddGalleryWidgetPreset}
          onToggle={() => toggleCategory('gallery-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="layout-widgets"
          icon="▦"
          name={catalogCopy.widgetSections.layout.name}
          hint={catalogCopy.widgetSections.layout.hint(visibleLayoutWidgetPresets.length)}
          presets={visibleLayoutWidgetPresets}
          isOpen={categoryOpen['layout-widgets'] ?? true}
          dataAttribute="data-builder-layout-widget-preset"
          onAdd={handleAddLayoutWidgetPreset}
          onToggle={() => toggleCategory('layout-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="interactive-widgets"
          icon="◉"
          name={catalogCopy.widgetSections.interactive.name}
          hint={catalogCopy.widgetSections.interactive.hint(visibleInteractiveWidgetPresets.length)}
          presets={visibleInteractiveWidgetPresets}
          isOpen={categoryOpen['interactive-widgets'] ?? true}
          dataAttribute="data-builder-interactive-widget-preset"
          onAdd={handleAddInteractiveWidgetPreset}
          onToggle={() => toggleCategory('interactive-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="navigation-widgets"
          icon="≡"
          name={catalogCopy.widgetSections.navigation.name}
          hint={catalogCopy.widgetSections.navigation.hint(visibleNavigationWidgetPresets.length)}
          presets={visibleNavigationWidgetPresets}
          isOpen={categoryOpen['navigation-widgets'] ?? true}
          dataAttribute="data-builder-navigation-widget-preset"
          onAdd={handleAddNavigationWidgetPreset}
          onToggle={() => toggleCategory('navigation-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="social-widgets"
          icon="@"
          name={catalogCopy.widgetSections.social.name}
          hint={catalogCopy.widgetSections.social.hint(visibleSocialWidgetPresets.length)}
          presets={visibleSocialWidgetPresets}
          isOpen={categoryOpen['social-widgets'] ?? true}
          dataAttribute="data-builder-social-widget-preset"
          onAdd={handleAddSocialWidgetPreset}
          onToggle={() => toggleCategory('social-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="location-widgets"
          icon="📍"
          name={catalogCopy.widgetSections.location.name}
          hint={catalogCopy.widgetSections.location.hint(visibleLocationWidgetPresets.length)}
          presets={visibleLocationWidgetPresets}
          isOpen={categoryOpen['location-widgets'] ?? true}
          dataAttribute="data-builder-location-widget-preset"
          onAdd={handleAddLocationWidgetPreset}
          onToggle={() => toggleCategory('location-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="decorative-widgets"
          icon="◆"
          name={catalogCopy.widgetSections.decorative.name}
          hint={catalogCopy.widgetSections.decorative.hint(visibleDecorativeWidgetPresets.length)}
          presets={visibleDecorativeWidgetPresets}
          isOpen={categoryOpen['decorative-widgets'] ?? true}
          dataAttribute="data-builder-decorative-widget-preset"
          onAdd={handleAddDecorativeWidgetPreset}
          onToggle={() => toggleCategory('decorative-widgets')}
        />

        <SandboxCatalogWidgetSection
          categoryId="designer-widgets"
          icon="✦"
          name={catalogCopy.widgetSections.designer.name}
          hint={catalogCopy.widgetSections.designer.hint(visibleDesignerWidgetPresets.length)}
          presets={visibleDesignerWidgetPresets}
          isOpen={categoryOpen['designer-widgets'] ?? true}
          dataAttribute="data-builder-designer-widget-preset"
          onAdd={handleAddDesignerWidgetPreset}
          onToggle={() => toggleCategory('designer-widgets')}
        />

        {/* Built-in section templates — normalized section snapshots. */}
        {(!normalizedQuery || visibleBuiltInSectionTemplates.length > 0) ? (
          <div className={styles.catalogCategorySection}>
            <button
              type="button"
              className={`${styles.catalogCategoryButton} ${
                (categoryOpen['built-in-sections'] ?? true) ? styles.catalogCategoryButtonOpen : ''
              }`}
              data-add-category="built-in-sections"
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
                  <span className={styles.catalogCategoryName}>{catalogCopy.sectionTemplatesName}</span>
                  <span className={styles.catalogCategoryHint}>
                    {catalogCopy.sectionTemplatesHint(visibleBuiltInSectionTemplates.length)}
                  </span>
                </span>
              </span>
              <span className={styles.catalogCategoryToggle}>
                {(categoryOpen['built-in-sections'] ?? true) ? '−' : '+'}
              </span>
            </button>

            {(categoryOpen['built-in-sections'] ?? true) ? (
              <BuiltInSectionsPanel
                locale={effectiveLocale}
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
              data-add-category="saved-sections"
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
                  <span className={styles.catalogCategoryName}>{catalogCopy.savedSectionsName}</span>
                  <span className={styles.catalogCategoryHint}>
                    {catalogCopy.savedSectionsHint}
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
          const categoryCopy = getCatalogCategoryCopy(category, effectiveLocale);
          return (
            <div key={category} className={styles.catalogCategorySection}>
              <button
                type="button"
                className={`${styles.catalogCategoryButton} ${isOpen ? styles.catalogCategoryButtonOpen : ''}`}
                data-add-category={category}
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
                    <span className={styles.catalogCategoryName}>{categoryCopy.label}</span>
                    <span className={styles.catalogCategoryHint}>
                      {categoryCopy.sublabel} · {categoryComponents.length}
                    </span>
                  </span>
                </span>
                <span className={styles.catalogCategoryToggle}>
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen ? (
                <div className={styles.catalogSectionGrid}>
                  {categoryComponents.map((component) => {
                    const displayName = getComponentCatalogDisplayName(component, effectiveLocale);
                    return (
                      <div key={component.kind} className={styles.catalogCard} data-builder-add-card={component.kind}>
                        <button
                          type="button"
                          className={styles.catalogDragButton}
                          data-builder-add-card-kind={component.kind}
                          title={catalogCopy.dragTitle(displayName)}
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData(BUILDER_NODE_KIND_DRAG_MIME, component.kind);
                            event.dataTransfer.effectAllowed = 'copy';
                          }}
                        >
                          <span className={styles.catalogCardIcon}>{component.icon}</span>
                          <span className={styles.catalogCardName}>{displayName}</span>
                          <span className={styles.catalogCardMeta}>{catalogCopy.dragMeta(component.kind)}</span>
                        </button>

                        <button
                          type="button"
                          className={styles.catalogQuickAddButton}
                          title={catalogCopy.quickAddTitle(displayName)}
                          onClick={() => handleQuickAdd(component.kind as BuilderCanvasNodeKind)}
                        >
                          {catalogCopy.quickAdd}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}

        {normalizedQuery && visibleCatalogCount === 0 ? (
          <div className={styles.catalogEmptyState}>
            <strong>{catalogCopy.emptyTitle}</strong>
            <span>{catalogCopy.emptyHint}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
