'use client';

import BreakpointBadge from '@/components/builder/editor/BreakpointBadge';
import type { BuilderCanvasNode, ResponsiveOverride } from '@/lib/builder/canvas/types';
import {
  hasResponsiveOverride,
  resolveViewportFontSize,
  resolveViewportHidden,
  resolveViewportRect,
  type Viewport,
  VIEWPORT_WIDTHS,
} from '@/lib/builder/canvas/responsive';
import { parentUsesFlowLayout } from '@/lib/builder/canvas/tree';
import {
  InspectorSection,
  LabeledRow,
  NumberStepper,
  SegmentedControl,
  SliderRow,
  ToggleRow,
} from './InspectorControls';
import {
  DEVICE_META,
  ShowOnDeviceToggles,
} from './SandboxInspectorPanel.widgets';
import styles from './SandboxPage.module.css';

const MIN_WIDTH = 72;
const MIN_HEIGHT = 40;

type UpdateNode = (
  nodeId: string,
  updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
  mode?: 'commit' | 'transient',
) => void;

type UpdateNodeContent = (
  nodeId: string,
  content: Record<string, unknown>,
  mode?: 'commit' | 'transient',
) => void;

type UpdateResponsiveOverride = (
  nodeId: string,
  viewport: Viewport,
  patch: NonNullable<ResponsiveOverride>,
  mode?: 'commit' | 'transient',
) => void;

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function contentFontSize(node: BuilderCanvasNode): number | null {
  const content = node.content as Record<string, unknown>;
  return typeof content.fontSize === 'number' ? content.fontSize : null;
}

function updateRectField(
  node: BuilderCanvasNode,
  field: 'x' | 'y' | 'width' | 'height',
  nextValue: number,
): BuilderCanvasNode {
  if (field === 'width') {
    return {
      ...node,
      rect: {
        ...node.rect,
        width: clampNumber(Math.round(nextValue), MIN_WIDTH, 1280),
      },
    };
  }

  if (field === 'height') {
    return {
      ...node,
      rect: {
        ...node.rect,
        height: clampNumber(Math.round(nextValue), MIN_HEIGHT, 880),
      },
    };
  }

  return {
    ...node,
    rect: {
      ...node.rect,
      [field]: Math.max(0, Math.round(nextValue)),
    },
  };
}

function LayoutField({
  label,
  viewport,
  value,
  onCommit,
  min,
  max,
  step = 1,
  disabled = false,
  hasOverride = false,
}: {
  label: string;
  viewport: Viewport;
  value: number;
  onCommit: (nextValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  hasOverride?: boolean;
}) {
  return (
    <LabeledRow
      label={label}
      hint={viewport === 'desktop' ? undefined : viewport}
      hasOverride={hasOverride}
      title={`${label} (${viewport})`}
    >
      <NumberStepper
        value={value}
        min={min}
        max={max}
        step={step}
        suffix="px"
        disabled={disabled}
        ariaLabel={`${label} value`}
        onChange={onCommit}
      />
      <BreakpointBadge viewport={viewport} active={hasOverride} label="" />
    </LabeledRow>
  );
}

export default function SandboxInspectorLayoutTab({
  node,
  viewport,
  setViewport,
  updateNode,
  updateNodeContent,
  updateResponsiveOverride,
  resetResponsiveOverride,
  nodesById,
}: {
  node: BuilderCanvasNode;
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  updateNode: UpdateNode;
  updateNodeContent: UpdateNodeContent;
  updateResponsiveOverride: UpdateResponsiveOverride;
  resetResponsiveOverride: (nodeId: string, viewport: Viewport) => void;
  nodesById: Map<string, BuilderCanvasNode>;
}) {
  const isViewportOverride = viewport !== 'desktop';
  const responsiveViewport = isViewportOverride ? viewport : null;
  const activeOverride = responsiveViewport
    ? node.responsive?.[responsiveViewport]
    : undefined;
  const effectiveRect = resolveViewportRect(node, viewport);
  const hasActiveOverride = isViewportOverride
    && hasResponsiveOverride(node, viewport);
  const baseFontSize = contentFontSize(node);
  const effectiveFontSize = resolveViewportFontSize(node, viewport);
  const hasFontSizeOverride = isViewportOverride
    && activeOverride?.fontSize !== undefined;
  const hasHiddenOverride = isViewportOverride
    && activeOverride?.hidden !== undefined;
  const fieldHasOverride = (field: 'x' | 'y' | 'width' | 'height') => (
    isViewportOverride && activeOverride?.rect?.[field] !== undefined
  );
  const isHiddenAtVp = resolveViewportHidden(node, viewport);
  const isInFlowContext = parentUsesFlowLayout(node, nodesById);
  const commitRect = (field: 'x' | 'y' | 'width' | 'height', nextValue: number) => {
    if (!isViewportOverride) {
      updateNode(node.id, (current) => updateRectField(current, field, nextValue));
      return;
    }
    const clamped = field === 'width'
      ? clampNumber(Math.round(nextValue), MIN_WIDTH, 4000)
      : field === 'height'
        ? clampNumber(Math.round(nextValue), MIN_HEIGHT, 20000)
        : Math.max(0, Math.round(nextValue));
    updateResponsiveOverride(node.id, viewport, {
      rect: { [field]: clamped },
    });
  };
  const commitFontSize = (nextValue: number) => {
    const clamped = clampNumber(Math.round(nextValue), 8, 160);
    if (!isViewportOverride) {
      updateNodeContent(node.id, { fontSize: clamped });
      return;
    }
    updateResponsiveOverride(node.id, viewport, { fontSize: clamped });
  };

  return (
    <>
      <LabeledRow
        label="Viewport"
        helper={
          isViewportOverride
            ? hasActiveOverride
              ? 'Override created for this viewport.'
              : 'Inherits desktop until you edit a value.'
            : 'Desktop is the source layout.'
        }
      >
        <div
          data-builder-mobile-inspector-viewport="true"
          data-builder-viewport-override-state={isViewportOverride && hasActiveOverride ? 'created' : 'inherited'}
          role="group"
          aria-label="Inspector viewport"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 6,
            width: '100%',
          }}
        >
          {DEVICE_META.map((device) => {
            const active = viewport === device.vp;
            const hasOverride = device.vp !== 'desktop' && hasResponsiveOverride(node, device.vp);
            return (
              <button
                key={device.vp}
                type="button"
                data-builder-inspector-viewport-option={device.vp}
                aria-pressed={active}
                onClick={() => setViewport(device.vp)}
                style={{
                  minWidth: 0,
                  padding: '7px 6px',
                  borderRadius: 8,
                  border: active ? '1px solid #116dff' : '1px solid #dbe3ee',
                  background: active ? '#eaf3ff' : '#fff',
                  color: active ? '#0f4ec4' : '#334155',
                  fontSize: '0.72rem',
                  fontWeight: 850,
                  cursor: 'pointer',
                }}
                title={`${device.label} ${VIEWPORT_WIDTHS[device.vp]}px`}
              >
                <span aria-hidden style={{ display: 'block', fontSize: '0.8rem' }}>{device.short}</span>
                <span style={{ display: 'block' }}>{device.label}</span>
                <small style={{ display: 'block', color: active ? '#1d4ed8' : '#64748b' }}>
                  {VIEWPORT_WIDTHS[device.vp]}px{hasOverride ? ' · override' : ''}
                </small>
              </button>
            );
          })}
        </div>
      </LabeledRow>
      {isViewportOverride ? (
        <div
          data-builder-viewport-override-banner={hasActiveOverride ? 'created' : 'inherited'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid #bfdbfe',
            background: '#eff6ff',
            fontSize: '0.74rem',
            color: '#1e40af',
            marginBottom: 8,
          }}
        >
          <span>
            <strong style={{ marginRight: 6 }}>{viewport}</strong>
            {hasActiveOverride ? 'Override created' : 'viewport override 편집 중'}
            {hasActiveOverride ? null : (
              <span style={{ color: '#475569', marginLeft: 6 }}>
                (override 미설정 — desktop 값 표시)
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => resetResponsiveOverride(node.id, viewport)}
            disabled={node.locked || !hasActiveOverride}
            style={{
              padding: '2px 8px',
              fontSize: '0.72rem',
              border: '1px solid #bfdbfe',
              background: '#fff',
              borderRadius: 6,
              cursor: hasActiveOverride && !node.locked ? 'pointer' : 'not-allowed',
              opacity: hasActiveOverride && !node.locked ? 1 : 0.5,
              color: '#1e40af',
            }}
            title={`${viewport} viewport 의 override 를 모두 제거합니다`}
          >
            Reset {viewport}
          </button>
        </div>
      ) : null}
      <div className={styles.inspectorFieldGrid}>
        <LayoutField
          label="X"
          viewport={viewport}
          value={effectiveRect.x}
          onCommit={(nextValue) => commitRect('x', nextValue)}
          disabled={node.locked || isInFlowContext}
          hasOverride={fieldHasOverride('x')}
        />
        <LayoutField
          label="Y"
          viewport={viewport}
          value={effectiveRect.y}
          onCommit={(nextValue) => commitRect('y', nextValue)}
          disabled={node.locked || isInFlowContext}
          hasOverride={fieldHasOverride('y')}
        />
        {isInFlowContext ? (
          <div
            style={{
              gridColumn: '1 / -1',
              fontSize: '0.68rem',
              color: '#64748b',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              padding: '5px 8px',
              margin: '2px 0 4px',
              lineHeight: 1.3,
            }}
          >
            이 요소는 부모의 Flow 레이아웃(flex / grid)을 따릅니다. X/Y 위치는 무시됩니다.
          </div>
        ) : null}
        <LayoutField
          label="Width"
          viewport={viewport}
          value={effectiveRect.width}
          min={MIN_WIDTH}
          onCommit={(nextValue) => commitRect('width', nextValue)}
          disabled={node.locked}
          hasOverride={fieldHasOverride('width')}
        />
        <LayoutField
          label="Height"
          viewport={viewport}
          value={effectiveRect.height}
          min={MIN_HEIGHT}
          onCommit={(nextValue) => commitRect('height', nextValue)}
          disabled={node.locked}
          hasOverride={fieldHasOverride('height')}
        />
        {baseFontSize != null && effectiveFontSize != null ? (
          <LayoutField
            label="Font size"
            viewport={viewport}
            value={effectiveFontSize}
            min={8}
            max={160}
            onCommit={commitFontSize}
            disabled={node.locked}
            hasOverride={hasFontSizeOverride}
          />
        ) : null}
      </div>
      <ShowOnDeviceToggles
        node={node}
        updateNode={updateNode}
        updateResponsiveOverride={updateResponsiveOverride}
        activeViewport={viewport}
      />
      {hasHiddenOverride ? (
        <p
          data-builder-viewport-hidden-override="true"
          style={{
            margin: '6px 2px 0',
            fontSize: '0.72rem',
            color: '#475569',
            fontWeight: 600,
          }}
        >
          Hidden override exists for {viewport}.
        </p>
      ) : null}
      {isViewportOverride && isHiddenAtVp ? (
        <p
          style={{
            margin: '6px 2px 0',
            fontSize: '0.72rem',
            color: '#b45309',
            fontWeight: 500,
          }}
        >
          ⚠ {viewport}에서 숨김 처리되어 캔버스/미리보기에서 보이지 않습니다.
        </p>
      ) : null}

      <LabeledRow label="Rotation" hint="deg">
        <SliderRow
          value={node.rotation}
          min={0}
          max={360}
          suffix="deg"
          disabled={node.locked}
          onChange={(nextValue) => {
            updateNode(node.id, (current) => ({
              ...current,
              rotation: clampNumber(Math.round(nextValue), 0, 360),
            }));
          }}
        />
      </LabeledRow>

      <InspectorSection label="State" title="Visibility & lock">
        <LabeledRow label="Lock">
          <ToggleRow
            checked={node.locked}
            onChange={(checked) => {
              updateNode(node.id, (current) => ({
                ...current,
                locked: checked,
              }));
            }}
          />
        </LabeledRow>
        <LabeledRow label="Visible">
          <ToggleRow
            checked={node.visible}
            onChange={(checked) => {
              updateNode(node.id, (current) => ({
                ...current,
                visible: checked,
              }));
            }}
          />
        </LabeledRow>
        <LabeledRow label="Pin">
          <ToggleRow
            checked={Boolean(node.sticky)}
            disabled={node.locked}
            onChange={(checked) => {
              updateNode(node.id, (current) => {
                if (!checked) {
                  const next = { ...current };
                  delete (next as { sticky?: unknown }).sticky;
                  return next;
                }
                return {
                  ...current,
                  sticky: { offset: 0, from: 'top' as const },
                };
              });
            }}
          />
        </LabeledRow>
      </InspectorSection>

      {node.sticky ? (
        <div className={styles.inspectorFieldGrid}>
          <LayoutField
            label="Sticky offset (px)"
            viewport={viewport}
            value={node.sticky.offset}
            min={0}
            onCommit={(nextValue) => updateNode(node.id, (current) => ({
              ...current,
              sticky: {
                offset: Math.max(0, Math.round(nextValue)),
                from: current.sticky?.from ?? 'top',
              },
            }))}
            disabled={node.locked}
          />
          <LabeledRow label="Pin from">
            <SegmentedControl
              value={node.sticky.from ?? 'top'}
              disabled={node.locked}
              ariaLabel="Pin from"
              options={[
                { value: 'top', label: 'Top' },
                { value: 'bottom', label: 'Bottom' },
              ]}
              onChange={(nextFrom) => {
                updateNode(node.id, (current) => ({
                  ...current,
                  sticky: {
                    offset: current.sticky?.offset ?? 0,
                    from: nextFrom,
                  },
                }));
              }}
            />
          </LabeledRow>
        </div>
      ) : null}

      <div className={styles.inspectorField}>
        <span className={styles.inspectorFieldLabel}>⚓ Anchor name</span>
        <input
          className={styles.inspectorInput}
          type="text"
          placeholder="e.g. about, services"
          value={node.anchorName ?? ''}
          disabled={node.locked}
          onChange={(event) => {
            const raw = event.target.value
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '')
              .slice(0, 64);
            updateNode(node.id, (current) => {
              if (!raw) {
                const next = { ...current };
                delete (next as { anchorName?: string }).anchorName;
                return next;
              }
              return { ...current, anchorName: raw };
            });
          }}
        />
        {node.anchorName ? (
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>
            링크: <code style={{ color: '#0f172a' }}>#{node.anchorName}</code>
          </span>
        ) : (
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>
            영문 소문자, 숫자, 하이픈만. 버튼 href에 <code>#name</code>으로 연결.
          </span>
        )}
      </div>
    </>
  );
}
