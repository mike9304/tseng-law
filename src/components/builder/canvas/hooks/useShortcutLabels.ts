'use client';

import { useEffect, useMemo, useState } from 'react';
import { BUILDER_EDITOR_PREFS_EVENT } from '@/lib/builder/canvas/editor-prefs';
import {
  formatShortcutCombo,
  isMacPlatform,
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
  // Defer Mac/Ctrl detection until after mount so server-rendered HTML
  // (always Ctrl, since `navigator` is undefined there) matches the first
  // client paint. The real platform value is applied on the next render.
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(isMacPlatform());
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
        glyph: formatShortcutCombo(combo, 'glyph', isMac),
        title: formatShortcutCombo(combo, 'title', isMac),
      });
    }
    return labels;
  // revision is intentional: forces recompute when editor prefs change via event
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionKey, isMac, revision]);
}
