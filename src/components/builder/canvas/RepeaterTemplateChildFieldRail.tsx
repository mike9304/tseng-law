import type { KeyboardEvent } from 'react';
import type { RepeaterTemplateCopy } from './repeater-template-copy';
import type { RepeaterTemplateBindingSummaryWithLock } from './repeater-template-binding-locks';
import styles from './RepeaterTemplateChildFieldRail.module.css';

export interface RepeaterTemplateChildFieldRailProps {
  readonly activeSiblingNodeIds?: readonly string[];
  readonly copy: RepeaterTemplateCopy['childBadge'];
  readonly currentNodeId: string;
  readonly siblingBindings: readonly RepeaterTemplateBindingSummaryWithLock[];
  readonly onSelectSibling: (nodeId: string) => void;
  readonly selectSiblingAriaLabel?: (kindLabel: string, fieldId: string) => string;
}

export function RepeaterTemplateChildFieldRail({
  activeSiblingNodeIds = [],
  copy,
  currentNodeId,
  siblingBindings,
  onSelectSibling,
  selectSiblingAriaLabel,
}: RepeaterTemplateChildFieldRailProps) {
  const activeNodeIds = new Set(activeSiblingNodeIds.length > 0 ? activeSiblingNodeIds : [currentNodeId]);
  const selectSibling = (nodeId: string) => {
    if (nodeId !== currentNodeId) onSelectSibling(nodeId);
  };
  const handleSiblingKeyDown = (event: KeyboardEvent<HTMLButtonElement>, nodeId: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    selectSibling(nodeId);
  };

  return (
    <div
      className={styles.repeaterTemplateChildFieldRail}
      data-builder-repeater-template-child-field-rail="true"
    >
      {siblingBindings.map((entry) => {
        const active = activeNodeIds.has(entry.nodeId);
        const current = currentNodeId === entry.nodeId;
        const fieldLabel = `${entry.fieldId}${entry.extraCount > 0 ? ` +${entry.extraCount}` : ''}`;
        const previewTitle = entry.previewValue
          ? ` · ${copy.previewValueLabel}: ${entry.previewValue}`
          : '';
        const title = `${entry.kindLabel}: ${fieldLabel}${previewTitle}${entry.locked ? ` · ${copy.lockedLabel}` : ''}`;
        const ariaLabel = selectSiblingAriaLabel?.(entry.kindLabel, entry.fieldId) ?? `${entry.kindLabel}: ${fieldLabel}`;
        const previewAriaLabel = entry.previewValue
          ? `, ${copy.previewValueLabel}: ${entry.previewValue}`
          : '';
        return (
          <button
            key={entry.nodeId}
            type="button"
            className={styles.repeaterTemplateChildFieldChip}
            data-builder-repeater-template-child-field-chip="true"
            data-builder-repeater-template-child-field-node-id={entry.nodeId}
            data-builder-repeater-template-child-field-active={active ? 'true' : undefined}
            data-builder-repeater-template-child-field-locked={entry.locked ? 'true' : undefined}
            aria-current={current ? 'true' : undefined}
            aria-label={entry.locked
              ? `${ariaLabel}${previewAriaLabel}, ${copy.lockedLabel}`
              : `${ariaLabel}${previewAriaLabel}`}
            disabled={current}
            title={title}
            onKeyDown={(event) => handleSiblingKeyDown(event, entry.nodeId)}
            onClick={(event) => {
              event.stopPropagation();
              selectSibling(entry.nodeId);
            }}
          >
            <strong>{entry.kindLabel}</strong>
            {entry.locked ? (
              <span className={styles.repeaterTemplateFieldLockLabel}>{copy.lockedLabel}</span>
            ) : null}
            <em>{fieldLabel}</em>
            {entry.previewValue ? (
              <small
                data-builder-repeater-template-child-field-preview="true"
                data-builder-repeater-template-child-field-preview-value={entry.previewValue}
              >
                {copy.previewValueLabel}: {entry.previewValue}
              </small>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
