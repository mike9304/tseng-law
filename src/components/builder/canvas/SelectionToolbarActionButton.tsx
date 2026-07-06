'use client';

import { memo, useCallback, type MouseEvent } from 'react';
import EditorChromeIcon, { type EditorChromeIconName } from './EditorChromeIcon';
import styles from './SandboxPage.module.css';

export type SelectionToolbarAction = {
  readonly disabled?: boolean;
  readonly icon: EditorChromeIconName;
  readonly key: string;
  readonly label: string;
  readonly onClick?: () => void;
  readonly onClickEvent?: (event: MouseEvent<HTMLButtonElement>) => void;
  readonly title: string;
};

function SelectionToolbarActionButton({
  action,
  index,
}: {
  readonly action: SelectionToolbarAction;
  readonly index: number;
}) {
  const separated = index > 0 && (action.key === 'duplicate' || action.key === 'more');
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (action.onClickEvent) {
      action.onClickEvent(event);
      return;
    }
    action.onClick?.();
  }, [action]);

  return (
    <button
      type="button"
      title={action.title}
      disabled={action.disabled}
      aria-label={action.label}
      className={[
        styles.selectionToolbarButton,
        separated ? styles.selectionToolbarButtonSeparated : '',
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
    >
      <EditorChromeIcon name={action.icon} className={styles.selectionToolbarIcon} />
    </button>
  );
}

export default memo(SelectionToolbarActionButton);
