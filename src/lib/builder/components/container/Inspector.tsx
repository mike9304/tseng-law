import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderContainerCanvasNode } from '@/lib/builder/canvas/types';
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

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  marginTop: 12,
  marginBottom: 4,
  display: 'block',
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  fontSize: '0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#fff',
};

const smallInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  fontSize: '0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
};

export default function ContainerInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const containerNode = node as BuilderContainerCanvasNode;
  const content = containerNode.content;
  const layoutMode: ContainerLayoutMode = content.layoutMode ?? 'absolute';
  const flexConfig: FlexConfig = content.flexConfig ?? DEFAULT_FLEX;
  const gridConfig: GridConfig = content.gridConfig ?? DEFAULT_GRID;

  return (
    <>
      <label>
        <span>Label</span>
        <input
          type="text"
          value={content.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label>
        <span>Padding</span>
        <input
          type="number"
          min={0}
          max={96}
          value={content.padding}
          disabled={disabled}
          onChange={(event) => onUpdate({ padding: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>Card variant</span>
        <select
          style={selectStyle}
          value={normalizeCardVariantKey(content.variant ?? legacyCardStyleToVariant(content.cardStyle))}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value })}
        >
          {CARD_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {variant.label}
            </option>
          ))}
        </select>
      </label>

      {/* ── Layout Mode ────────────────────────────────────── */}
      <span style={sectionLabelStyle}>Layout Mode</span>
      <select
        style={selectStyle}
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
        <option value="absolute">Absolute (default)</option>
        <option value="flex">Flex</option>
        <option value="grid">Grid</option>
      </select>

      {/* ── Flex Controls ──────────────────────────────────── */}
      {layoutMode === 'flex' && (
        <>
          <span style={sectionLabelStyle}>Flex Settings</span>
          <label>
            <span>Direction</span>
            <select
              style={selectStyle}
              value={flexConfig.direction}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  flexConfig: { ...flexConfig, direction: e.target.value as FlexConfig['direction'] },
                })
              }
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
            </select>
          </label>
          <label>
            <span>Wrap</span>
            <select
              style={selectStyle}
              value={flexConfig.wrap ? 'wrap' : 'nowrap'}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  flexConfig: { ...flexConfig, wrap: e.target.value === 'wrap' },
                })
              }
            >
              <option value="wrap">Wrap</option>
              <option value="nowrap">No Wrap</option>
            </select>
          </label>
          <label>
            <span>Justify Content</span>
            <select
              style={selectStyle}
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
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="space-between">Space Between</option>
              <option value="space-around">Space Around</option>
              <option value="space-evenly">Space Evenly</option>
            </select>
          </label>
          <label>
            <span>Align Items</span>
            <select
              style={selectStyle}
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
              <option value="flex-start">Start</option>
              <option value="center">Center</option>
              <option value="flex-end">End</option>
              <option value="stretch">Stretch</option>
            </select>
          </label>
          <label>
            <span>Gap</span>
            <input
              type="number"
              style={smallInputStyle}
              min={0}
              max={200}
              value={flexConfig.gap}
              disabled={disabled}
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
          <span style={sectionLabelStyle}>Grid Settings</span>
          <label>
            <span>Columns</span>
            <input
              type="number"
              style={smallInputStyle}
              min={1}
              max={12}
              value={gridConfig.columns}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  gridConfig: { ...gridConfig, columns: Number(e.target.value) },
                })
              }
            />
          </label>
          <label>
            <span>Rows</span>
            <input
              type="number"
              style={smallInputStyle}
              min={1}
              max={12}
              value={gridConfig.rows}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  gridConfig: { ...gridConfig, rows: Number(e.target.value) },
                })
              }
            />
          </label>
          <label>
            <span>Column Gap</span>
            <input
              type="number"
              style={smallInputStyle}
              min={0}
              max={200}
              value={gridConfig.columnGap}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  gridConfig: { ...gridConfig, columnGap: Number(e.target.value) },
                })
              }
            />
          </label>
          <label>
            <span>Row Gap</span>
            <input
              type="number"
              style={smallInputStyle}
              min={0}
              max={200}
              value={gridConfig.rowGap}
              disabled={disabled}
              onChange={(e) =>
                onUpdate({
                  gridConfig: { ...gridConfig, rowGap: Number(e.target.value) },
                })
              }
            />
          </label>
        </>
      )}
    </>
  );
}
