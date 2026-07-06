import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { resolveViewportHidden } from '@/lib/builder/canvas/responsive';
import type { InspectorDeviceVisibilityCopy } from './sandbox-inspector-layout-tab-copy';
import styles from './SandboxPage.module.css';

export type ViewportLite = 'desktop' | 'tablet' | 'mobile';

export const DEVICE_META: Array<{ vp: ViewportLite; icon: string; short: string }> = [
  { vp: 'desktop', icon: '▭', short: 'D' },
  { vp: 'tablet', icon: '⬜', short: 'T' },
  { vp: 'mobile', icon: '▯', short: 'M' },
];

export function ShowOnDeviceToggles({
  node,
  updateNode,
  updateResponsiveOverride,
  activeViewport,
  deviceLabels,
  copy,
}: {
  node: BuilderCanvasNode;
  updateNode: (id: string, updater: (node: BuilderCanvasNode) => BuilderCanvasNode) => void;
  updateResponsiveOverride: (
    id: string,
    viewport: 'tablet' | 'mobile',
    patch: { hidden?: boolean | undefined },
  ) => void;
  activeViewport: ViewportLite;
  deviceLabels: Record<ViewportLite, string>;
  copy: InspectorDeviceVisibilityCopy;
}) {
  const disabled = node.locked;
  return (
    <div
      className={styles.inspectorDeviceVisibility}
    >
      <span className={styles.inspectorDeviceVisibilityLabel}>
        {copy.label}
      </span>
      <div className={styles.inspectorDeviceVisibilityButtons}>
        {DEVICE_META.map(({ vp, icon, short }) => {
          const visible = vp === 'desktop'
            ? Boolean(node.visible)
            : !resolveViewportHidden(node, vp);
          const isActiveVp = activeViewport === vp;
          const label = deviceLabels[vp];
          return (
            <button
              key={vp}
              type="button"
              aria-pressed={visible}
              aria-label={copy.ariaLabel(label, visible)}
              title={copy.title(label, visible, isActiveVp)}
              disabled={disabled}
              className={styles.inspectorDeviceToggle}
              data-visible={visible ? 'true' : 'false'}
              data-active-viewport={isActiveVp ? 'true' : undefined}
              onClick={() => {
                if (vp === 'desktop') {
                  updateNode(node.id, (n) => ({ ...n, visible: !visible }));
                  return;
                }
                updateResponsiveOverride(node.id, vp, {
                  hidden: visible ? true : undefined,
                });
              }}
            >
              <span className={styles.inspectorDeviceToggleIcon} aria-hidden>{icon}</span>
              <span className={styles.inspectorDeviceToggleShort}>{short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InspectorEmptyState({
  title,
  body,
  clearSelectionLabel,
}: {
  title: string;
  body: string;
  clearSelectionLabel: string;
}) {
  return (
    <div
      data-builder-inspector-empty="true"
      className={styles.inspectorEmptyState}
    >
      <div className={styles.inspectorEmptyStateIcon} aria-hidden="true">
        <svg viewBox="0 0 40 40" className={styles.inspectorEmptyStateSvg}>
          <rect x="9" y="9" width="22" height="22" rx="5" />
          <path d="M20 6v6" />
          <path d="M20 28v6" />
          <path d="M6 20h6" />
          <path d="M28 20h6" />
          <circle cx="20" cy="20" r="2.5" />
        </svg>
      </div>
      <div className={styles.inspectorEmptyStateCopy}>
        <p className={styles.inspectorEmptyStateTitle}>{title}</p>
        <p className={styles.inspectorEmptyStateBody}>{body}</p>
      </div>
      <div className={styles.inspectorEmptyStateShortcut}>
        <span>{clearSelectionLabel}</span>
        <kbd>Esc</kbd>
      </div>
    </div>
  );
}

export function renderCompositeSurfaceEditor({
  node,
  surfaceKey,
  surfaceTitle,
  closeLabel,
  placeholder,
  onUpdate,
  onClose,
}: {
  node: BuilderCanvasNode;
  surfaceKey: string;
  surfaceTitle: string;
  closeLabel: string;
  placeholder: string;
  onUpdate: (overrides: Record<string, string>) => void;
  onClose: () => void;
}): JSX.Element {
  const config = (node.content as { config?: Record<string, unknown> }).config ?? {};
  const overrides = (config.overrides as Record<string, string> | undefined) ?? {};
  const current = overrides[surfaceKey] ?? '';
  return (
    <section
      className={styles.compositeSurfaceEditor}
      data-builder-composite-surface-editor="true"
    >
      <div className={styles.compositeSurfaceEditorHeader}>
        <strong className={styles.compositeSurfaceEditorTitle}>
          {surfaceTitle}
        </strong>
        <button
          type="button"
          onClick={onClose}
          className={styles.compositeSurfaceEditorClose}
        >
          {closeLabel}
        </button>
      </div>
      <textarea
        value={current}
        placeholder={placeholder}
        onChange={(e) => {
          const value = e.target.value;
          const next = { ...overrides };
          if (value === '') {
            delete next[surfaceKey];
          } else {
            next[surfaceKey] = value;
          }
          onUpdate(next);
        }}
        className={styles.compositeSurfaceEditorTextarea}
      />
    </section>
  );
}
