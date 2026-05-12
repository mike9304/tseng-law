import { describe, expect, it, vi } from 'vitest';
import { matchShortcut } from '@/lib/builder/canvas/shortcuts';

function eventFor(combo: {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}): KeyboardEvent {
  return {
    key: combo.key,
    metaKey: Boolean(combo.metaKey),
    ctrlKey: Boolean(combo.ctrlKey),
    altKey: Boolean(combo.altKey),
    shiftKey: Boolean(combo.shiftKey),
    target: null,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as KeyboardEvent;
}

describe('builder canvas shortcut map', () => {
  it('maps default Wix-style editor shortcuts', () => {
    expect(matchShortcut(eventFor({ key: 'd', metaKey: true }))).toBe('duplicate');
    expect(matchShortcut(eventFor({ key: 'v', metaKey: true, altKey: true }))).toBe('pasteStyle');
    expect(matchShortcut(eventFor({ key: '=', ctrlKey: true }))).toBe('zoomIn');
    expect(matchShortcut(eventFor({ key: 'ArrowDown', shiftKey: true }))).toBe('nudgeDownLarge');
  });

  it('lets custom keybindings override default bindings', () => {
    const storage = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
    storage.set('tw_builder_editor_prefs_v1', JSON.stringify({
      customKeybindings: [{ action: 'duplicate', combo: 'Mod+Shift+D' }],
    }));

    expect(matchShortcut(eventFor({ key: 'd', metaKey: true }))).toBeNull();
    expect(matchShortcut(eventFor({ key: 'd', metaKey: true, shiftKey: true }))).toBe('duplicate');

    vi.unstubAllGlobals();
  });
});
