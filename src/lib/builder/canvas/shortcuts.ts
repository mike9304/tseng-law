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

import { loadEditorPreferences } from '@/lib/builder/canvas/editor-prefs';

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
  | 'copyStyle'
  | 'pasteStyle'
  | 'group'
  | 'ungroup'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'toggleGrid'
  | 'bringForward'
  | 'sendBackward'
  | 'bringToFront'
  | 'sendToBack'
  | 'toggleLock'
  | 'nudgeUp'
  | 'nudgeDown'
  | 'nudgeLeft'
  | 'nudgeRight'
  | 'nudgeUpLarge'
  | 'nudgeDownLarge'
  | 'nudgeLeftLarge'
  | 'nudgeRightLarge'
  | 'showHelp'
  | 'editLink'
  | null;

export interface ShortcutBindingDefinition {
  action: Exclude<CanvasAction, null>;
  combo: string;
  label: string;
}

export const DEFAULT_KEYBINDINGS: ShortcutBindingDefinition[] = [
  { action: 'undo', combo: 'Mod+Z', label: 'Undo' },
  { action: 'redo', combo: 'Mod+Shift+Z', label: 'Redo' },
  { action: 'delete', combo: 'Backspace', label: 'Delete selection' },
  { action: 'duplicate', combo: 'Mod+D', label: 'Duplicate selection' },
  { action: 'selectAll', combo: 'Mod+A', label: 'Select all nodes' },
  { action: 'deselect', combo: 'Escape', label: 'Deselect / exit group' },
  { action: 'copy', combo: 'Mod+C', label: 'Copy nodes' },
  { action: 'paste', combo: 'Mod+V', label: 'Paste nodes' },
  { action: 'cut', combo: 'Mod+X', label: 'Cut nodes' },
  { action: 'copyStyle', combo: 'Mod+Alt+C', label: 'Copy style' },
  { action: 'pasteStyle', combo: 'Mod+Alt+V', label: 'Paste style' },
  { action: 'group', combo: 'Mod+G', label: 'Group selection' },
  { action: 'ungroup', combo: 'Mod+Shift+G', label: 'Ungroup selection' },
  { action: 'showHelp', combo: 'Mod+/', label: 'Open shortcuts help' },
  { action: 'toggleGrid', combo: 'Shift+G', label: 'Toggle pixel grid' },
  { action: 'editLink', combo: 'Mod+K', label: 'Edit link' },
  { action: 'zoomIn', combo: 'Mod+=', label: 'Zoom in' },
  { action: 'zoomOut', combo: 'Mod+-', label: 'Zoom out' },
  { action: 'zoomReset', combo: 'Mod+0', label: 'Fit canvas' },
  { action: 'bringForward', combo: 'Mod+]', label: 'Bring forward' },
  { action: 'sendBackward', combo: 'Mod+[', label: 'Send backward' },
  { action: 'bringToFront', combo: 'Mod+Shift+]', label: 'Bring to front' },
  { action: 'sendToBack', combo: 'Mod+Shift+[', label: 'Send to back' },
  { action: 'toggleLock', combo: 'Mod+L', label: 'Lock / unlock selection' },
  { action: 'nudgeUp', combo: 'ArrowUp', label: 'Nudge up' },
  { action: 'nudgeDown', combo: 'ArrowDown', label: 'Nudge down' },
  { action: 'nudgeLeft', combo: 'ArrowLeft', label: 'Nudge left' },
  { action: 'nudgeRight', combo: 'ArrowRight', label: 'Nudge right' },
  { action: 'nudgeUpLarge', combo: 'Shift+ArrowUp', label: 'Nudge up 10px' },
  { action: 'nudgeDownLarge', combo: 'Shift+ArrowDown', label: 'Nudge down 10px' },
  { action: 'nudgeLeftLarge', combo: 'Shift+ArrowLeft', label: 'Nudge left 10px' },
  { action: 'nudgeRightLarge', combo: 'Shift+ArrowRight', label: 'Nudge right 10px' },
];

const SUPPORTED_ACTIONS = new Set(DEFAULT_KEYBINDINGS.map((binding) => binding.action));

function isTextInput(target: EventTarget | null): boolean {
  if (!target || typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

function isMenuNavigationTarget(target: EventTarget | null, key: string): boolean {
  if (!target || typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) return false;
  if (!target.closest('[role="menu"]')) return false;
  return key.startsWith('Arrow') || key === 'Enter' || key === ' ';
}

function normalizeAction(action: string): Exclude<CanvasAction, null> | null {
  const aliases: Record<string, Exclude<CanvasAction, null>> = {
    'paste-style': 'pasteStyle',
    'copy-style': 'copyStyle',
    'select-all': 'selectAll',
    'zoom-in': 'zoomIn',
    'zoom-out': 'zoomOut',
    'zoom-reset': 'zoomReset',
    'bring-forward': 'bringForward',
    'send-backward': 'sendBackward',
    'bring-to-front': 'bringToFront',
    'send-to-back': 'sendToBack',
    'toggle-grid': 'toggleGrid',
    'edit-link': 'editLink',
    'show-help': 'showHelp',
  };
  const normalized = aliases[action] ?? action;
  return SUPPORTED_ACTIONS.has(normalized as Exclude<CanvasAction, null>)
    ? normalized as Exclude<CanvasAction, null>
    : null;
}

function getCustomBindings(): Array<{ action: Exclude<CanvasAction, null>; combo: string }> {
  if (typeof window === 'undefined') return [];
  try {
    return loadEditorPreferences().customKeybindings
      .map((binding) => ({
        action: normalizeAction(binding.action ?? ''),
        combo: (binding.combo ?? '').trim(),
      }))
      .filter((binding): binding is { action: Exclude<CanvasAction, null>; combo: string } => (
        Boolean(binding.action) && binding.combo.length > 0
      ));
  } catch {
    return [];
  }
}

export function resolveShortcutCombo(actionInput: string): string {
  const action = normalizeAction(actionInput);
  if (!action) return '';

  const customBinding = getCustomBindings().find((binding) => binding.action === action);
  if (customBinding) return customBinding.combo;

  return DEFAULT_KEYBINDINGS.find((binding) => binding.action === action)?.combo ?? '';
}

function isMacPlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

export type ShortcutDisplayStyle = 'glyph' | 'title';

export function formatShortcutCombo(
  combo: string,
  style: ShortcutDisplayStyle = 'glyph',
): string {
  const tokens = combo.split('+').map((token) => token.trim()).filter(Boolean);
  if (tokens.length === 0) return '';

  const isMac = isMacPlatform();
  const modifiers = {
    mod: false,
    ctrl: false,
    alt: false,
    shift: false,
  };
  const keys: string[] = [];

  for (const token of tokens) {
    const normalized = normalizeComboKey(token);
    if (normalized === 'mod') modifiers.mod = true;
    else if (normalized === 'ctrl' || normalized === 'control') modifiers.ctrl = true;
    else if (normalized === 'alt') modifiers.alt = true;
    else if (normalized === 'shift') modifiers.shift = true;
    else keys.push(normalized);
  }

  const key = keys[keys.length - 1] ?? '';
  if (style === 'title') {
    const parts = [
      modifiers.mod ? (isMac ? 'Cmd' : 'Ctrl') : null,
      modifiers.ctrl && !(modifiers.mod && !isMac) ? 'Ctrl' : null,
      modifiers.alt ? (isMac ? 'Option' : 'Alt') : null,
      modifiers.shift ? 'Shift' : null,
      titleKeyLabel(key),
    ].filter(Boolean);
    return parts.join('+');
  }

  const parts = [
    modifiers.shift ? (isMac ? '⇧' : 'Shift+') : null,
    modifiers.ctrl && !(modifiers.mod && !isMac) ? (isMac ? '⌃' : 'Ctrl+') : null,
    modifiers.alt ? (isMac ? '⌥' : 'Alt+') : null,
    modifiers.mod ? (isMac ? '⌘' : 'Ctrl+') : null,
    glyphKeyLabel(key),
  ].filter(Boolean);
  return parts.join('');
}

function titleKeyLabel(key: string): string {
  if (!key) return '';
  if (key === 'escape') return 'Esc';
  if (key === 'backspace') return 'Backspace';
  if (key === 'delete') return 'Delete';
  if (key === 'space') return 'Space';
  if (key.length === 1) return key.toUpperCase();
  return key.replace(/^arrow/, 'Arrow');
}

function glyphKeyLabel(key: string): string {
  if (!key) return '';
  if (key === 'escape') return 'Esc';
  if (key === 'backspace') return '⌫';
  if (key === 'delete') return 'Del';
  if (key === 'space') return 'Space';
  if (key.length === 1) return key.toUpperCase();
  if (key.startsWith('arrow')) {
    const direction = key.slice('arrow'.length);
    const arrows: Record<string, string> = {
      up: '↑',
      down: '↓',
      left: '←',
      right: '→',
    };
    return arrows[direction] ?? titleKeyLabel(key);
  }
  return titleKeyLabel(key);
}

function normalizeEventKey(key: string): string {
  if (key === ' ') return 'space';
  if (key.length === 1) return key.toLowerCase();
  return key.toLowerCase();
}

function normalizeComboKey(token: string): string {
  const lower = token.trim().toLowerCase();
  if (lower === 'space') return 'space';
  if (lower === 'esc') return 'escape';
  if (lower === 'del') return 'delete';
  if (lower === 'plus') return '+';
  if (lower === 'minus') return '-';
  if (lower === 'cmd') return 'meta';
  if (lower === 'option') return 'alt';
  if (lower === 'return') return 'enter';
  return lower;
}

function comboMatchesEvent(combo: string, e: KeyboardEvent): boolean {
  const tokens = combo.split('+').map((token) => token.trim()).filter(Boolean);
  if (tokens.length === 0) return false;

  let needsMod = false;
  let needsAlt = false;
  let needsShift = false;
  let needsCtrl = false;
  let needsMeta = false;
  let keyToken = '';

  for (const token of tokens) {
    const normalized = normalizeComboKey(token);
    if (normalized === 'mod') needsMod = true;
    else if (normalized === 'alt') needsAlt = true;
    else if (normalized === 'shift') needsShift = true;
    else if (normalized === 'ctrl' || normalized === 'control') needsCtrl = true;
    else if (normalized === 'meta') needsMeta = true;
    else keyToken = normalized;
  }

  if (needsMod && !(e.metaKey || e.ctrlKey)) return false;
  if (!needsMod && !needsCtrl && e.ctrlKey) return false;
  if (!needsMod && !needsMeta && e.metaKey) return false;
  if (needsCtrl && !e.ctrlKey) return false;
  if (needsMeta && !e.metaKey) return false;
  if (needsAlt !== e.altKey) return false;
  if (needsShift !== e.shiftKey) return false;

  const eventKey = normalizeEventKey(e.key);
  return eventKey === keyToken;
}

export function matchShortcut(e: KeyboardEvent): CanvasAction {
  if (isTextInput(e.target)) return null;

  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (!(e.metaKey || e.ctrlKey) && isMenuNavigationTarget(e.target, key)) return null;

  const customBindings = getCustomBindings();
  const overriddenActions = new Set(customBindings.map((binding) => binding.action));
  for (const binding of customBindings) {
    if (comboMatchesEvent(binding.combo, e)) return binding.action;
  }

  for (const binding of DEFAULT_KEYBINDINGS) {
    if (overriddenActions.has(binding.action)) continue;
    if (comboMatchesEvent(binding.combo, e)) return binding.action;
  }

  if (!overriddenActions.has('redo') && comboMatchesEvent('Mod+Y', e)) return 'redo';
  if (!overriddenActions.has('delete') && comboMatchesEvent('Delete', e)) return 'delete';
  if (!overriddenActions.has('zoomIn') && comboMatchesEvent('Mod++', e)) return 'zoomIn';
  if (!overriddenActions.has('showHelp') && comboMatchesEvent('Shift+?', e)) return 'showHelp';

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
