'use client';

import BreakpointBadge from '@/components/builder/editor/BreakpointBadge';
import { getSandboxInspectorLayoutTabCopy } from '@/components/builder/canvas/sandbox-inspector-layout-tab-copy';
import type { BuilderCanvasNode, ResponsiveOverride } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
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
  title,
  ariaLabel,
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
  title: string;
  ariaLabel: string;
}) {
  return (
    <LabeledRow
      label={label}
      hint={viewport === 'desktop' ? undefined : viewport}
      hasOverride={hasOverride}
      title={title}
    >
      <NumberStepper
        value={value}
        min={min}
        max={max}
        step={step}
        suffix="px"
        disabled={disabled}
        ariaLabel={ariaLabel}
        onChange={onCommit}
      />
      <BreakpointBadge viewport={viewport} active={hasOverride} label="" />
    </LabeledRow>
  );
}

export default function SandboxInspectorLayoutTab({
  locale,
  node,
  viewport,
  setViewport,
  updateNode,
  updateNodeContent,
  updateResponsiveOverride,
  resetResponsiveOverride,
  nodesById,
}: {
  locale: Locale;
  node: BuilderCanvasNode;
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  updateNode: UpdateNode;
  updateNodeContent: UpdateNodeContent;
  updateResponsiveOverride: UpdateResponsiveOverride;
  resetResponsiveOverride: (nodeId: string, viewport: Viewport) => void;
  nodesById: Map<string, BuilderCanvasNode>;
}) {
  const copy = getSandboxInspectorLayoutTabCopy(locale);
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
  const viewportLabel = copy.deviceLabels[viewport];
  const layoutFieldCopy = (label: string) => ({
    title: copy.fieldTitle(label, viewportLabel),
    ariaLabel: copy.fieldValueAriaLabel(label),
  });
  const viewportHelper = isViewportOverride
    ? hasActiveOverride
      ? copy.viewportOverrideCreatedHelper
      : copy.viewportInheritedHelper
    : copy.viewportDesktopHelper;
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
      <section
        className={styles.inspectorViewportPanel}
        aria-label={copy.viewportGroupAriaLabel}
      >
        <div className={styles.inspectorViewportHeader}>
          <span className={styles.inspectorViewportLabel}>{copy.viewportLabel}</span>
          <span className={styles.inspectorViewportHelper}>{viewportHelper}</span>
        </div>
        <div
          data-builder-mobile-inspector-viewport="true"
          data-builder-viewport-override-state={isViewportOverride && hasActiveOverride ? 'created' : 'inherited'}
          className={styles.inspectorViewportSelector}
          role="group"
          aria-label={copy.viewportGroupAriaLabel}
        >
          {DEVICE_META.map((device) => {
            const active = viewport === device.vp;
            const hasOverride = device.vp !== 'desktop' && hasResponsiveOverride(node, device.vp);
            const deviceLabel = copy.deviceLabels[device.vp];
            const title = `${deviceLabel} ${VIEWPORT_WIDTHS[device.vp]}px${hasOverride ? ` - ${copy.overrideBadgeLabel}` : ''}`;
            return (
              <button
                key={device.vp}
                type="button"
                data-builder-inspector-viewport-option={device.vp}
                data-active={active ? 'true' : undefined}
                data-has-override={hasOverride ? 'true' : undefined}
                aria-pressed={active}
                onClick={() => setViewport(device.vp)}
                className={styles.inspectorViewportButton}
                title={title}
              >
                <span className={styles.inspectorViewportGlyph} aria-hidden>{device.short}</span>
                <span className={styles.inspectorViewportButtonCopy}>
                  <span className={styles.inspectorViewportButtonLabel}>{deviceLabel}</span>
                  <span className={styles.inspectorViewportButtonMeta}>
                    <span>{VIEWPORT_WIDTHS[device.vp]}px</span>
                    {hasOverride ? (
                      <span
                        className={styles.inspectorViewportOverrideDot}
                        aria-hidden
                        title={copy.overrideBadgeLabel}
                      />
                    ) : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>
      {isViewportOverride ? (
        <div
          data-builder-viewport-override-banner={hasActiveOverride ? 'created' : 'inherited'}
          className={styles.inspectorViewportOverrideBanner}
        >
          <span>
            <strong>{viewportLabel}</strong>
            {hasActiveOverride ? copy.overrideCreatedLabel : copy.overrideEditingLabel}
            {hasActiveOverride ? null : (
              <span>
                ({copy.overrideInheritedNote})
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={() => resetResponsiveOverride(node.id, viewport)}
            disabled={node.locked || !hasActiveOverride}
            className={styles.inspectorViewportResetButton}
            title={copy.resetViewportTitle(viewportLabel)}
          >
            {copy.resetViewportLabel(viewportLabel)}
          </button>
        </div>
      ) : null}
      <div className={styles.inspectorFieldGrid}>
        <LayoutField
          label={copy.xLabel}
          viewport={viewport}
          value={effectiveRect.x}
          onCommit={(nextValue) => commitRect('x', nextValue)}
          disabled={node.locked || isInFlowContext}
          hasOverride={fieldHasOverride('x')}
          {...layoutFieldCopy(copy.xLabel)}
        />
        <LayoutField
          label={copy.yLabel}
          viewport={viewport}
          value={effectiveRect.y}
          onCommit={(nextValue) => commitRect('y', nextValue)}
          disabled={node.locked || isInFlowContext}
          hasOverride={fieldHasOverride('y')}
          {...layoutFieldCopy(copy.yLabel)}
        />
        {isInFlowContext ? (
          <div
            className={styles.inspectorFlowNotice}
          >
            {copy.flowLayoutNotice}
          </div>
        ) : null}
        <LayoutField
          label={copy.widthLabel}
          viewport={viewport}
          value={effectiveRect.width}
          min={MIN_WIDTH}
          onCommit={(nextValue) => commitRect('width', nextValue)}
          disabled={node.locked}
          hasOverride={fieldHasOverride('width')}
          {...layoutFieldCopy(copy.widthLabel)}
        />
        <LayoutField
          label={copy.heightLabel}
          viewport={viewport}
          value={effectiveRect.height}
          min={MIN_HEIGHT}
          onCommit={(nextValue) => commitRect('height', nextValue)}
          disabled={node.locked}
          hasOverride={fieldHasOverride('height')}
          {...layoutFieldCopy(copy.heightLabel)}
        />
        {baseFontSize != null && effectiveFontSize != null ? (
          <LayoutField
            label={copy.fontSizeLabel}
            viewport={viewport}
            value={effectiveFontSize}
            min={8}
            max={160}
            onCommit={commitFontSize}
            disabled={node.locked}
            hasOverride={hasFontSizeOverride}
            {...layoutFieldCopy(copy.fontSizeLabel)}
          />
        ) : null}
      </div>
      <ShowOnDeviceToggles
        node={node}
        updateNode={updateNode}
        updateResponsiveOverride={updateResponsiveOverride}
        activeViewport={viewport}
        deviceLabels={copy.deviceLabels}
        copy={copy.deviceVisibility}
      />
      {hasHiddenOverride ? (
        <p
          data-builder-viewport-hidden-override="true"
          className={styles.inspectorViewportHiddenNote}
        >
          {copy.hiddenOverrideExists(viewportLabel)}
        </p>
      ) : null}
      {isViewportOverride && isHiddenAtVp ? (
        <p
          className={styles.inspectorViewportHiddenWarning}
        >
          ⚠ {copy.hiddenAtViewportWarning(viewportLabel)}
        </p>
      ) : null}

      <LabeledRow label={copy.rotationLabel} hint="deg">
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

      <InspectorSection label={copy.stateSectionLabel} title={copy.stateSectionTitle}>
        <LabeledRow label={copy.lockLabel}>
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
        <LabeledRow label={copy.visibleLabel}>
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
        <LabeledRow label={copy.pinLabel}>
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
            label={copy.stickyOffsetLabel}
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
            {...layoutFieldCopy(copy.stickyOffsetLabel)}
          />
          <LabeledRow label={copy.pinFromLabel}>
            <SegmentedControl
              value={node.sticky.from ?? 'top'}
              disabled={node.locked}
              ariaLabel={copy.pinFromAriaLabel}
              options={[
                { value: 'top', label: copy.pinTopLabel },
                { value: 'bottom', label: copy.pinBottomLabel },
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
        <span className={styles.inspectorFieldLabel}>⚓ {copy.anchorNameLabel}</span>
        <input
          className={styles.inspectorInput}
          type="text"
          placeholder={copy.anchorPlaceholder}
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
          <span className={styles.inspectorAnchorHint}>
            {copy.anchorLinkPrefix}: <code className={styles.inspectorAnchorCode}>#{node.anchorName}</code>
          </span>
        ) : (
          <span className={styles.inspectorAnchorHint}>
            {copy.anchorHelp}
          </span>
        )}
      </div>
    </>
  );
}
