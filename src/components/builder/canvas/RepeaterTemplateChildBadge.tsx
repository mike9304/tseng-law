import type { KeyboardEvent } from 'react';
import type { RepeaterTemplateCopy } from './repeater-template-copy';
import type { RepeaterTemplateBindingSummaryWithLock } from './repeater-template-binding-locks';
import { RepeaterTemplateChildFieldRail } from './RepeaterTemplateChildFieldRail';
import { RepeaterTemplateGroupNameField } from './RepeaterTemplateGroupNameField';
import styles from './RepeaterTemplateChildBadge.module.css';

export interface RepeaterTemplateChildBadgeProps {
  readonly activeSiblingNodeIds?: readonly string[];
  readonly copy: RepeaterTemplateCopy['childBadge'];
  readonly currentNodeId?: string;
  readonly groupableSiblingCount?: number;
  readonly groupName?: string;
  readonly locked?: boolean;
  readonly parentNodeId: string;
  readonly recordNumber: number;
  readonly siblingBindings?: readonly RepeaterTemplateBindingSummaryWithLock[];
  readonly onDuplicateGroup?: () => void;
  readonly onGroupSiblings?: () => void;
  readonly onRenameGroup?: (name: string) => void;
  readonly onSelectParent: (nodeId: string) => void;
  readonly onSelectSibling?: (nodeId: string) => void;
  readonly onToggleLock?: (nodeId: string) => void;
  readonly onUngroup?: () => void;
  readonly selectSiblingAriaLabel?: (kindLabel: string, fieldId: string) => string;
}

export function RepeaterTemplateChildBadge({
  activeSiblingNodeIds = [],
  copy,
  currentNodeId,
  groupableSiblingCount = 0,
  groupName,
  locked = false,
  parentNodeId,
  recordNumber,
  siblingBindings = [],
  onDuplicateGroup,
  onGroupSiblings,
  onRenameGroup,
  onSelectParent,
  onSelectSibling,
  onToggleLock,
  onUngroup,
  selectSiblingAriaLabel,
}: RepeaterTemplateChildBadgeProps) {
  const selectParent = () => onSelectParent(parentNodeId);
  const showSiblingRail = Boolean(currentNodeId && onSelectSibling && siblingBindings.length > 1);
  const showGroupNameField = Boolean(groupName && onRenameGroup);
  const showLockToggle = Boolean(currentNodeId && onToggleLock);
  const showDuplicateGroup = Boolean(onDuplicateGroup);
  const showGroupSiblings = Boolean(onGroupSiblings && groupableSiblingCount >= 2);
  const showUngroup = Boolean(onUngroup);
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    selectParent();
  };
  const handleLockToggleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    if (currentNodeId) onToggleLock?.(currentNodeId);
  };
  const handleGroupSiblingsKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    onGroupSiblings?.();
  };
  const handleDuplicateGroupKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    onDuplicateGroup?.();
  };
  const handleUngroupKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    onUngroup?.();
  };

  return (
    <div
      className={styles.repeaterTemplateChildControls}
      data-builder-repeater-template-child-controls="true"
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className={styles.repeaterTemplateChildBadge}
        data-builder-repeater-template-child-badge="true"
        data-builder-repeater-template-parent-id={parentNodeId}
        aria-label={copy.selectParentAriaLabel(recordNumber)}
        title={copy.selectParentAriaLabel(recordNumber)}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          event.stopPropagation();
          selectParent();
        }}
      >
        <span>{copy.label}</span>
        <strong>
          {copy.recordPrefix} {recordNumber}
        </strong>
      </button>
      {showGroupNameField && groupName && onRenameGroup ? (
        <RepeaterTemplateGroupNameField
          copy={copy}
          groupName={groupName}
          recordNumber={recordNumber}
          onRenameGroup={onRenameGroup}
        />
      ) : null}
      {showLockToggle && currentNodeId ? (
        <button
          type="button"
          className={styles.repeaterTemplateChildLockToggle}
          data-builder-repeater-template-child-lock-toggle="true"
          data-builder-repeater-template-child-lock-state={locked ? 'locked' : 'unlocked'}
          aria-label={locked ? copy.unlockActionAriaLabel(recordNumber) : copy.lockActionAriaLabel(recordNumber)}
          title={locked ? copy.unlockActionAriaLabel(recordNumber) : copy.lockActionAriaLabel(recordNumber)}
          onKeyDown={handleLockToggleKeyDown}
          onClick={(event) => {
            event.stopPropagation();
            onToggleLock?.(currentNodeId);
          }}
        >
          {locked ? copy.unlockActionLabel : copy.lockActionLabel}
        </button>
      ) : null}
      {showGroupSiblings ? (
        <button
          type="button"
          className={styles.repeaterTemplateChildGroupButton}
          data-builder-repeater-template-child-group-siblings="true"
          data-builder-repeater-template-child-group-count={groupableSiblingCount}
          aria-label={copy.groupSiblingsActionAriaLabel(groupableSiblingCount, recordNumber)}
          title={copy.groupSiblingsActionAriaLabel(groupableSiblingCount, recordNumber)}
          onKeyDown={handleGroupSiblingsKeyDown}
          onClick={(event) => {
            event.stopPropagation();
            onGroupSiblings?.();
          }}
        >
          {copy.groupSiblingsActionLabel}
        </button>
      ) : null}
      {showDuplicateGroup ? (
        <button
          type="button"
          className={styles.repeaterTemplateChildDuplicateButton}
          data-builder-repeater-template-child-duplicate-group="true"
          aria-label={copy.duplicateGroupActionAriaLabel(recordNumber)}
          title={copy.duplicateGroupActionAriaLabel(recordNumber)}
          onKeyDown={handleDuplicateGroupKeyDown}
          onClick={(event) => {
            event.stopPropagation();
            onDuplicateGroup?.();
          }}
        >
          {copy.duplicateGroupActionLabel}
        </button>
      ) : null}
      {showUngroup ? (
        <button
          type="button"
          className={styles.repeaterTemplateChildUngroupButton}
          data-builder-repeater-template-child-ungroup="true"
          aria-label={copy.ungroupActionAriaLabel(recordNumber)}
          title={copy.ungroupActionAriaLabel(recordNumber)}
          onKeyDown={handleUngroupKeyDown}
          onClick={(event) => {
            event.stopPropagation();
            onUngroup?.();
          }}
        >
          {copy.ungroupActionLabel}
        </button>
      ) : null}
      {showSiblingRail && currentNodeId && onSelectSibling ? (
        <RepeaterTemplateChildFieldRail
          activeSiblingNodeIds={activeSiblingNodeIds}
          copy={copy}
          currentNodeId={currentNodeId}
          siblingBindings={siblingBindings}
          onSelectSibling={onSelectSibling}
          selectSiblingAriaLabel={selectSiblingAriaLabel}
        />
      ) : null}
    </div>
  );
}
