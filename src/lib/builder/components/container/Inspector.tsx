import type { BuilderComponentInspectorProps } from '../define';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';
import type { LinkValue } from '@/lib/builder/links';
import {
  CARD_VARIANTS,
  legacyCardStyleToVariant,
  normalizeCardVariantKey,
} from '@/lib/builder/site/component-variants';
import {
  DEFAULT_FLEX,
  DEFAULT_GRID,
  type ContainerLayoutMode,
  type FlexConfig,
  type GridConfig,
} from '@/lib/builder/canvas/layout-modes';
import { getContainerGalleryCopy } from '../container-gallery-copy';
import styles from './ContainerInspector.module.css';

function layoutItemsToText(items: BuilderContainerCanvasNode['content']['layoutItems']): string {
  return (items ?? [])
    .map((item) => [item.title, item.description ?? '', item.image ?? ''].join(' | '))
    .join('\n');
}

type LayoutItem = NonNullable<BuilderContainerCanvasNode['content']['layoutItems']>[number];

function parseLayoutItems(value: string): BuilderContainerCanvasNode['content']['layoutItems'] | undefined {
  const items: LayoutItem[] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [title, description, image] = line.split('|').map((part) => part.trim());
    if (!title) continue;
    const item: LayoutItem = { title: title.slice(0, 120) };
    if (description) item.description = description.slice(0, 500);
    if (image) item.image = image;
    items.push(item);
  }
  return items.length ? items.slice(0, 12) : undefined;
}

export default function ContainerInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
  linkPickerContext,
}: BuilderComponentInspectorProps) {
  const containerNode = node as BuilderContainerCanvasNode;
  const content = containerNode.content;
  const layoutMode: ContainerLayoutMode = content.layoutMode ?? 'absolute';
  const flexConfig: FlexConfig = content.flexConfig ?? DEFAULT_FLEX;
  const gridConfig: GridConfig = content.gridConfig ?? DEFAULT_GRID;
  const copy = getContainerGalleryCopy(locale ?? 'en');

  return (
    <div className={styles.root} data-builder-container-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.container.label}</span>
        <input
          type="text"
          value={content.label}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.container.padding}</span>
        <input
          type="number"
          min={0}
          max={96}
          value={content.padding}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ padding: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.container.cardVariant}</span>
        <select
          className={styles.control}
          value={normalizeCardVariantKey(content.variant ?? legacyCardStyleToVariant(content.cardStyle))}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value })}
        >
          {CARD_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {copy.container.cardVariants[variant.key]}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.linkSection}>
        <span className={styles.sectionLabel}>{copy.container.clickLink}</span>
        <LinkPicker
          value={(content.link ?? null) as LinkValue | null}
          onChange={(link) => onUpdate({ link: link ?? undefined })}
          context={linkPickerContext}
          disabled={disabled}
          locale={locale}
        />
      </div>

      {/* ── Layout Mode ────────────────────────────────────── */}
      <span className={styles.sectionLabel}>{copy.container.layoutMode}</span>
      <select
        className={styles.control}
        value={layoutMode}
        disabled={disabled}
        onChange={(e) => {
          const mode = e.target.value as ContainerLayoutMode;
          const patch: Record<string, unknown> = { layoutMode: mode };
          if (mode === 'flex' && !content.flexConfig) {
            patch.flexConfig = { ...DEFAULT_FLEX };
          }
          if (mode === 'grid' && !content.gridConfig) {
            patch.gridConfig = { ...DEFAULT_GRID };
          }
          onUpdate(patch);
        }}
      >
        <option value="absolute">{copy.container.layoutModes.absolute}</option>
        <option value="flex">{copy.container.layoutModes.flex}</option>
        <option value="grid">{copy.container.layoutModes.grid}</option>
        <option value="strip">{copy.container.layoutModes.strip}</option>
        <option value="box">{copy.container.layoutModes.box}</option>
        <option value="columns">{copy.container.layoutModes.columns}</option>
        <option value="repeater">{copy.container.layoutModes.repeater}</option>
        <option value="tabs">{copy.container.layoutModes.tabs}</option>
        <option value="accordion">{copy.container.layoutModes.accordion}</option>
        <option value="slideshow">{copy.container.layoutModes.slideshow}</option>
        <option value="hoverBox">{copy.container.layoutModes.hoverBox}</option>
      </select>

      {['columns', 'repeater', 'tabs', 'accordion', 'slideshow', 'hoverBox'].includes(layoutMode) ? (
        <>
          <span className={styles.sectionLabel}>{copy.container.layoutItems}</span>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.layoutItemsHint}</span>
            <textarea
              rows={5}
              className={`${styles.control} ${styles.textarea}`}
              value={layoutItemsToText(content.layoutItems)}
              disabled={disabled}
              onChange={(event) => onUpdate({ layoutItems: parseLayoutItems(event.target.value) })}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.activeIndex}</span>
            <input
              type="number"
              min={0}
              max={20}
              value={content.activeIndex ?? 0}
              disabled={disabled}
              className={styles.control}
              onChange={(event) => onUpdate({ activeIndex: Number(event.target.value) })}
            />
          </label>
        </>
      ) : null}

      <span className={styles.sectionLabel}>{copy.container.anchorSticky}</span>
      <label className={styles.field}>
        <span className={styles.label}>{copy.container.anchorTarget}</span>
        <input
          type="text"
          value={content.anchorTarget ?? ''}
          disabled={disabled}
          className={styles.control}
          placeholder={copy.container.anchorTargetPlaceholder}
          onChange={(event) => onUpdate({ anchorTarget: event.target.value || undefined })}
        />
      </label>
      <label className={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={Boolean(content.sticky)}
          disabled={disabled}
          onChange={(event) => onUpdate({ sticky: event.target.checked })}
        />
        <span>{copy.container.stickyLabel}</span>
      </label>

      {/* ── Flex Controls ──────────────────────────────────── */}
      {layoutMode === 'flex' && (
        <>
          <span className={styles.sectionLabel}>{copy.container.flexSettings}</span>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.direction}</span>
            <select
              className={styles.control}
              value={flexConfig.direction}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  flexConfig: { ...flexConfig, direction: e.target.value as FlexConfig['direction'] },
                })
              }
            >
              <option value="row">{copy.container.flexDirection.row}</option>
              <option value="column">{copy.container.flexDirection.column}</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.wrap}</span>
            <select
              className={styles.control}
              value={flexConfig.wrap ? 'wrap' : 'nowrap'}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  flexConfig: { ...flexConfig, wrap: e.target.value === 'wrap' },
                })
              }
            >
              <option value="wrap">{copy.container.flexWrap.wrap}</option>
              <option value="nowrap">{copy.container.flexWrap.nowrap}</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.justifyContent}</span>
            <select
              className={styles.control}
              value={flexConfig.justifyContent}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  flexConfig: {
                    ...flexConfig,
                    justifyContent: e.target.value as FlexConfig['justifyContent'],
                  },
                })
              }
            >
              <option value="flex-start">{copy.container.flexJustify['flex-start']}</option>
              <option value="center">{copy.container.flexJustify.center}</option>
              <option value="flex-end">{copy.container.flexJustify['flex-end']}</option>
              <option value="space-between">{copy.container.flexJustify['space-between']}</option>
              <option value="space-around">{copy.container.flexJustify['space-around']}</option>
              <option value="space-evenly">{copy.container.flexJustify['space-evenly']}</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.alignItems}</span>
            <select
              className={styles.control}
              value={flexConfig.alignItems}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  flexConfig: {
                    ...flexConfig,
                    alignItems: e.target.value as FlexConfig['alignItems'],
                  },
                })
              }
            >
              <option value="flex-start">{copy.container.flexAlign['flex-start']}</option>
              <option value="center">{copy.container.flexAlign.center}</option>
              <option value="flex-end">{copy.container.flexAlign['flex-end']}</option>
              <option value="stretch">{copy.container.flexAlign.stretch}</option>
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.gap}</span>
            <input
              type="number"
              min={0}
              max={200}
              value={flexConfig.gap}
              disabled={disabled}
              className={styles.control}
              onChange={(e) =>
                onUpdate({
                  flexConfig: { ...flexConfig, gap: Number(e.target.value) },
                })
              }
            />
          </label>
        </>
      )}

      {/* ── Grid Controls ──────────────────────────────────── */}
      {layoutMode === 'grid' && (
        <>
          <span className={styles.sectionLabel}>{copy.container.gridSettings}</span>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.columns}</span>
            <input
              type="number"
              min={1}
              max={12}
              value={gridConfig.columns}
              disabled={disabled}
              className={styles.control}
              onChange={(e) =>
                onUpdate({
                  gridConfig: { ...gridConfig, columns: Number(e.target.value) },
                })
              }
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.rows}</span>
            <input
              type="number"
              min={1}
              max={12}
              value={gridConfig.rows}
              disabled={disabled}
              className={styles.control}
              onChange={(e) =>
                onUpdate({
                  gridConfig: { ...gridConfig, rows: Number(e.target.value) },
                })
              }
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.columnGap}</span>
            <input
              type="number"
              min={0}
              max={200}
              value={gridConfig.columnGap}
              disabled={disabled}
              className={styles.control}
              onChange={(e) =>
                onUpdate({
                  gridConfig: { ...gridConfig, columnGap: Number(e.target.value) },
                })
              }
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{copy.container.rowGap}</span>
            <input
              type="number"
              min={0}
              max={200}
              value={gridConfig.rowGap}
              disabled={disabled}
              className={styles.control}
              onChange={(e) =>
                onUpdate({
                  gridConfig: { ...gridConfig, rowGap: Number(e.target.value) },
                })
              }
            />
          </label>
        </>
      )}
    </div>
  );
}
