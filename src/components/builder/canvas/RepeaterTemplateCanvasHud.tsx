'use client';

import type { RepeaterTemplateCopy } from './repeater-template-copy';
import type { RepeaterTemplateBindingSummaryWithLock } from './repeater-template-binding-locks';
import { RepeaterTemplateHudBindings } from './RepeaterTemplateHudBindings';
import { RepeaterTemplateHudButton } from './RepeaterTemplateHudButton';
import { RepeaterTemplateHudSkeleton } from './RepeaterTemplateHudSkeleton';
import styles from './SandboxPage.module.css';

export interface RepeaterTemplateCanvasHudProps {
  readonly copy: RepeaterTemplateCopy;
  readonly loading?: boolean;
  readonly boundChildCount: number;
  readonly childCount: number;
  readonly recordCount: number;
  readonly recordIndex: number;
  readonly recordLabel: string;
  readonly bindingSummary: readonly RepeaterTemplateBindingSummaryWithLock[];
  readonly editDisabled: boolean;
  readonly duplicateDisabled: boolean;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onEdit: () => void;
  readonly onDuplicate: () => void;
  readonly onAddText: () => void;
  readonly onAddImage: () => void;
  readonly onAddButton: () => void;
  readonly onAddGallery: () => void;
  readonly onSelectBindingChild: (nodeId: string) => void;
}

export function RepeaterTemplateCanvasHud({
  copy,
  loading = false,
  boundChildCount,
  childCount,
  recordCount,
  recordIndex,
  recordLabel,
  bindingSummary,
  editDisabled,
  duplicateDisabled,
  onPrevious,
  onNext,
  onEdit,
  onDuplicate,
  onAddText,
  onAddImage,
  onAddButton,
  onAddGallery,
  onSelectBindingChild,
}: RepeaterTemplateCanvasHudProps) {
  const actionDisabled = loading;
  const showSkeleton = loading || recordCount === 0;
  return (
    <div
      className={styles.repeaterTemplateHud}
      data-builder-repeater-template-hud="true"
      data-builder-repeater-template-loading={loading ? 'true' : undefined}
      aria-busy={loading ? 'true' : undefined}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div className={styles.repeaterTemplateHudMeta}>
        <span data-builder-repeater-template-status="true">
          {copy.hud.statusBound(boundChildCount, childCount)}
        </span>
        <strong data-builder-repeater-template-record="true">
          {loading
            ? copy.hud.loadingRecords
            : recordCount > 0
              ? copy.hud.recordOf(recordIndex + 1, recordCount)
              : copy.hud.noMatchingRecords}
        </strong>
        <small>{recordLabel}</small>
        {showSkeleton ? <RepeaterTemplateHudSkeleton /> : null}
        {!showSkeleton && bindingSummary.length > 0 ? (
          <RepeaterTemplateHudBindings
            ariaLabel={copy.hud.fieldMappingsAriaLabel}
            entries={bindingSummary}
            lockedLabel={copy.hud.lockedLabel}
            selectChildAriaLabel={copy.hud.selectFieldChildAriaLabel}
            onSelectChild={onSelectBindingChild}
          />
        ) : null}
      </div>
      <div className={styles.repeaterTemplateHudActions}>
        <RepeaterTemplateHudButton
          ariaLabel={copy.hud.previousRecordAriaLabel}
          dataAttribute="prev"
          disabled={actionDisabled || recordIndex <= 0}
          label={copy.hud.prev}
          onPress={onPrevious}
        />
        <RepeaterTemplateHudButton
          ariaLabel={copy.hud.nextRecordAriaLabel}
          dataAttribute="next"
          disabled={actionDisabled || recordIndex >= recordCount - 1}
          label={copy.hud.next}
          onPress={onNext}
        />
        <RepeaterTemplateHudButton
          ariaLabel={copy.hud.selectFirstBoundChildAriaLabel}
          dataAttribute="edit-child"
          disabled={actionDisabled || editDisabled}
          label={copy.hud.edit}
          onPress={onEdit}
        />
        <RepeaterTemplateHudButton
          ariaLabel={copy.hud.duplicateChildAriaLabel}
          dataAttribute="duplicate-child"
          disabled={actionDisabled || duplicateDisabled}
          label={copy.hud.duplicate}
          onPress={onDuplicate}
        />
        <RepeaterTemplateHudButton
          ariaLabel={copy.hud.addTextAriaLabel}
          dataAttribute="add-text"
          disabled={actionDisabled}
          label={copy.hud.text}
          onPress={onAddText}
        />
        <RepeaterTemplateHudButton
          ariaLabel={copy.hud.addImageAriaLabel}
          dataAttribute="add-image"
          disabled={actionDisabled}
          label={copy.hud.image}
          onPress={onAddImage}
        />
        <RepeaterTemplateHudButton
          ariaLabel={copy.hud.addButtonAriaLabel}
          dataAttribute="add-button"
          disabled={actionDisabled}
          label={copy.hud.button}
          onPress={onAddButton}
        />
        <RepeaterTemplateHudButton
          ariaLabel={copy.hud.addGalleryAriaLabel}
          dataAttribute="add-gallery"
          disabled={actionDisabled}
          label={copy.hud.gallery}
          onPress={onAddGallery}
        />
      </div>
    </div>
  );
}
