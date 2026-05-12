'use client';

import { useEffect, useMemo, useState } from 'react';
import { BUILDER_EDITOR_PREFS_EVENT } from '@/lib/builder/canvas/editor-prefs';
import {
  formatShortcutCombo,
  resolveShortcutCombo,
  type CanvasAction,
} from '@/lib/builder/canvas/shortcuts';

export type ShortcutAction = Exclude<CanvasAction, null>;

export interface ShortcutLabel {
  glyph: string;
  title: string;
}

export function useShortcutLabels(actions: ShortcutAction[]): Map<ShortcutAction, ShortcutLabel> {
  const actionKey = actions.join('|');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const refresh = () => setRevision((current) => current + 1);
    document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return useMemo(() => {
    const labels = new Map<ShortcutAction, ShortcutLabel>();
    for (const action of actionKey.split('|') as ShortcutAction[]) {
      const combo = resolveShortcutCombo(action);
      labels.set(action, {
        glyph: formatShortcutCombo(combo, 'glyph'),
        title: formatShortcutCombo(combo, 'title'),
      });
    }
    return labels;
  }, [actionKey, revision]);
}
