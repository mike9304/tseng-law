import type { RepeaterTemplateBindingSummaryWithLock } from './repeater-template-binding-locks';
import styles from './SandboxPage.module.css';

export interface RepeaterTemplateHudBindingsProps {
  readonly ariaLabel: string;
  readonly entries: readonly RepeaterTemplateBindingSummaryWithLock[];
  readonly lockedLabel: string;
  readonly selectChildAriaLabel: (kindLabel: string, fieldId: string) => string;
  readonly onSelectChild: (nodeId: string) => void;
}

export function RepeaterTemplateHudBindings({
  ariaLabel,
  entries,
  lockedLabel,
  selectChildAriaLabel,
  onSelectChild,
}: RepeaterTemplateHudBindingsProps) {
  return (
    <div
      className={styles.repeaterTemplateHudBindings}
      data-builder-repeater-template-field-summary="true"
      aria-label={ariaLabel}
    >
      {entries.map((entry) => {
        const fieldLabel = `${entry.fieldId}${entry.extraCount > 0 ? ` +${entry.extraCount}` : ''}`;
        const title = `${entry.kindLabel}: ${fieldLabel}${entry.locked ? ` · ${lockedLabel}` : ''}`;
        const ariaButtonLabel = selectChildAriaLabel(entry.kindLabel, entry.fieldId);
        return (
          <button
            key={entry.nodeId}
            type="button"
            className={styles.repeaterTemplateHudFieldChip}
            data-builder-repeater-template-field-chip="true"
            data-builder-repeater-template-field-node-id={entry.nodeId}
            data-builder-repeater-template-field-locked={entry.locked ? 'true' : undefined}
            aria-label={entry.locked ? `${ariaButtonLabel}, ${lockedLabel}` : ariaButtonLabel}
            title={title}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              onSelectChild(entry.nodeId);
            }}
          >
            <strong>{entry.kindLabel}</strong>
            {entry.locked ? (
              <span className={styles.repeaterTemplateFieldLockLabel}>{lockedLabel}</span>
            ) : null}
            <em>{fieldLabel}</em>
          </button>
        );
      })}
    </div>
  );
}
