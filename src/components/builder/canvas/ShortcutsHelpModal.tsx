'use client';

import { useMemo } from 'react';
import { useShortcutLabels, type ShortcutAction } from '@/components/builder/canvas/hooks/useShortcutLabels';
import { currentBuilderLocale } from './canvasNodeUtils';
import { getCanvasShortcutsHelpCopy } from './canvas-shortcuts-copy';
import ModalShell from './ModalShell';
import styles from './ShortcutsHelpModal.module.css';

interface ShortcutGroup {
  title: string;
  items: Array<{ keys: string; description: string }>;
}

const SHORTCUT_ACTIONS: ShortcutAction[] = [
  'undo',
  'redo',
  'copy',
  'cut',
  'paste',
  'duplicate',
  'delete',
  'selectAll',
  'deselect',
  'group',
  'ungroup',
  'bringForward',
  'sendBackward',
  'bringToFront',
  'sendToBack',
  'nudgeUp',
  'nudgeDown',
  'nudgeLeft',
  'nudgeRight',
  'nudgeUpLarge',
  'zoomIn',
  'zoomOut',
  'zoomReset',
  'showHelp',
];

export default function ShortcutsHelpModal({ onClose }: { onClose: () => void }) {
  const shortcutLabels = useShortcutLabels(SHORTCUT_ACTIONS);
  const locale = currentBuilderLocale();
  const copy = getCanvasShortcutsHelpCopy(locale as Parameters<typeof getCanvasShortcutsHelpCopy>[0]);
  const groups: ShortcutGroup[] = useMemo(() => {
    const shortcut = (action: ShortcutAction, fallback = '') => shortcutLabels.get(action)?.glyph || fallback;
    const shortcutReplacements = [
      ['Shift+⌘/Ctrl+G', shortcut('ungroup')],
      ['Shift+⌘/Ctrl+]', shortcut('bringToFront')],
      ['Shift+⌘/Ctrl+[', shortcut('sendToBack')],
      ['⌘/Ctrl+G', shortcut('group')],
      ['⌘/Ctrl+]', shortcut('bringForward')],
      ['⌘/Ctrl+[', shortcut('sendBackward')],
      ['⌘/Ctrl+C', shortcut('copy')],
      ['⌘/Ctrl+X', shortcut('cut')],
      ['⌘/Ctrl+V', shortcut('paste')],
      ['⌘/Ctrl+D', shortcut('duplicate')],
      ['⌘/Ctrl+A', shortcut('selectAll')],
      ['⌘/Ctrl++', shortcut('zoomIn')],
      ['⌘/Ctrl+-', shortcut('zoomOut')],
      ['⌘/Ctrl+0', shortcut('zoomReset')],
      ['Shift+?', shortcut('showHelp')],
    ] as const;
    const formatKeys = (value: string) => shortcutReplacements.reduce(
      (current, [token, replacement]) => current.split(token).join(replacement),
      value,
    );
    return copy.groups.map((group) => ({
      title: group.title,
      items: group.items.map((item) => ({
        keys: formatKeys(item.keys),
        description: item.description,
      })),
    }));
  }, [copy.groups, shortcutLabels]);

  return (
    <ModalShell
      title={copy.title}
      description={copy.description}
      ariaLabel={copy.ariaLabel}
      size="lg"
      onClose={onClose}
    >
      <div className={styles.grid}>
        {groups.map((group) => (
          <section key={group.title} className={styles.group}>
            <h3 className={styles.groupTitle}>
              {group.title}
            </h3>
            <ul className={styles.shortcutList}>
              {group.items.map((item) => (
                <li key={item.keys} className={styles.shortcutRow}>
                  <span className={styles.shortcutDescription}>{item.description}</span>
                  <kbd className={styles.shortcutKey}>
                    {item.keys}
                  </kbd>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className={styles.closeHint}>
        {copy.closeHint}
      </div>
    </ModalShell>
  );
}
