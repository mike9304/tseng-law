/**
 * Phase 2 — Keyboard shortcut handler for the canvas editor.
 *
 * Pure mapping from KeyboardEvent → action name. The React component
 * (CanvasContainer or EditorShell) calls `matchShortcut(e)` on
 * keydown and dispatches the returned action to the store.
 *
 * All shortcuts are suppressed when an input/textarea/contenteditable
 * has focus (the user is typing text, not commanding the editor).
 */

export type CanvasAction =
  | 'undo'
  | 'redo'
  | 'delete'
  | 'duplicate'
  | 'selectAll'
  | 'deselect'
  | 'copy'
  | 'paste'
  | 'cut'
  | 'group'
  | 'ungroup'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'bringForward'
  | 'sendBackward'
  | 'bringToFront'
  | 'sendToBack'
  | 'nudgeUp'
  | 'nudgeDown'
  | 'nudgeLeft'
  | 'nudgeRight'
  | 'nudgeUpLarge'
  | 'nudgeDownLarge'
  | 'nudgeLeftLarge'
  | 'nudgeRightLarge'
  | 'showHelp'
  | null;

function isTextInput(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function matchShortcut(e: KeyboardEvent): CanvasAction {
  if (isTextInput(e.target)) return null;

  const meta = e.metaKey || e.ctrlKey;
  const shift = e.shiftKey;
  const key = e.key;

  // Undo / Redo
  if (meta && !shift && key === 'z') return 'undo';
  if (meta && shift && key === 'z') return 'redo';
  if (meta && shift && key === 'Z') return 'redo';
  if (meta && !shift && key === 'y') return 'redo';

  // Delete
  if (key === 'Delete' || key === 'Backspace') return 'delete';

  // Duplicate
  if (meta && key === 'd') return 'duplicate';

  // Select all / Deselect
  if (meta && key === 'a') return 'selectAll';
  if (key === 'Escape') return 'deselect';

  // Clipboard
  if (meta && !shift && key === 'c') return 'copy';
  if (meta && !shift && key === 'v') return 'paste';
  if (meta && !shift && key === 'x') return 'cut';

  // Group
  if (meta && !shift && key === 'g') return 'group';
  if (meta && shift && (key === 'g' || key === 'G')) return 'ungroup';

  // Help (Cmd+/ or ?)
  if (meta && key === '/') return 'showHelp';
  if (!meta && shift && key === '?') return 'showHelp';

  // Zoom
  if (meta && (key === '=' || key === '+')) return 'zoomIn';
  if (meta && key === '-') return 'zoomOut';
  if (meta && key === '0') return 'zoomReset';

  // Z-order
  if (meta && key === ']') return 'bringForward';
  if (meta && key === '[') return 'sendBackward';
  if (meta && shift && key === ']') return 'bringToFront';
  if (meta && shift && key === '[') return 'sendToBack';

  // Nudge
  if (!meta && !shift && key === 'ArrowUp') return 'nudgeUp';
  if (!meta && !shift && key === 'ArrowDown') return 'nudgeDown';
  if (!meta && !shift && key === 'ArrowLeft') return 'nudgeLeft';
  if (!meta && !shift && key === 'ArrowRight') return 'nudgeRight';
  if (!meta && shift && key === 'ArrowUp') return 'nudgeUpLarge';
  if (!meta && shift && key === 'ArrowDown') return 'nudgeDownLarge';
  if (!meta && shift && key === 'ArrowLeft') return 'nudgeLeftLarge';
  if (!meta && shift && key === 'ArrowRight') return 'nudgeRightLarge';

  return null;
}

/**
 * React hook-compatible handler. Call from `useEffect` on the
 * document/window level:
 *
 * ```ts
 * useEffect(() => {
 *   const handler = createShortcutHandler(dispatch);
 *   window.addEventListener('keydown', handler);
 *   return () => window.removeEventListener('keydown', handler);
 * }, [dispatch]);
 * ```
 */
export function createShortcutHandler(
  dispatch: (action: NonNullable<CanvasAction>) => void,
): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    const action = matchShortcut(e);
    if (!action) return;

    // Prevent browser defaults (Cmd-D bookmark, Cmd-A select-all page, etc.)
    e.preventDefault();
    e.stopPropagation();
    dispatch(action);
  };
}

export const NUDGE_PX = 1;
export const NUDGE_LARGE_PX = 10;
