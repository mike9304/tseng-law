import { describe, expect, it, vi } from 'vitest';
import { createInlineTextTypographySession } from '../CanvasNode';
import { resolveInlineTextKeyboardAction } from '../InlineTextEditor';

describe('CanvasNode inline text typography session', () => {
  it('captures real display typography once and resets only between edit sessions', () => {
    const session = createInlineTextTypographySession();
    const realCapture = vi.fn(() => true);
    const editorCapture = vi.fn(() => true);

    expect(session.capture(realCapture)).toBe(true);
    expect(session.capture(editorCapture)).toBe(false);
    expect(realCapture).toHaveBeenCalledTimes(1);
    expect(editorCapture).not.toHaveBeenCalled();
    expect(session.isFrozen()).toBe(true);

    session.reset();
    expect(session.capture(editorCapture)).toBe(true);
    expect(editorCapture).toHaveBeenCalledTimes(1);
  });

  it('does not freeze when no real render metrics were captured', () => {
    const session = createInlineTextTypographySession();

    expect(session.capture(() => false)).toBe(false);
    expect(session.isFrozen()).toBe(false);
    expect(session.capture(() => true)).toBe(true);
  });
});

describe('InlineTextEditor real keyboard policy', () => {
  it('keeps Enter and Shift+Enter inside TipTap for paragraph and soft-break behavior', () => {
    expect(resolveInlineTextKeyboardAction({
      key: 'Enter', target: 'editor', activeSurface: null,
    })).toBe('none');
    expect(resolveInlineTextKeyboardAction({
      key: 'Enter', shiftKey: true, target: 'editor', activeSurface: null,
    })).toBe('none');
  });

  it('commits only on Mod+Enter, preserving ordinary Enter editing', () => {
    expect(resolveInlineTextKeyboardAction({
      key: 'Enter', metaKey: true, target: 'editor', activeSurface: null,
    })).toBe('commit-editor');
    expect(resolveInlineTextKeyboardAction({
      key: 'Enter', ctrlKey: true, target: 'editor', activeSurface: null,
    })).toBe('commit-editor');
    expect(resolveInlineTextKeyboardAction({
      key: 'Enter', metaKey: true, target: 'toolbar', activeSurface: null,
    })).toBe('none');
    expect(resolveInlineTextKeyboardAction({
      key: 'Enter', metaKey: true, shiftKey: true, target: 'editor', activeSurface: null,
    })).toBe('none');
  });

  it('commits on Tab from the editor shell but leaves nested inputs to native focus', () => {
    expect(resolveInlineTextKeyboardAction({
      key: 'Tab', target: 'editor', activeSurface: null,
    })).toBe('commit-editor');
    expect(resolveInlineTextKeyboardAction({
      key: 'Tab', target: 'toolbar', activeSurface: null,
    })).toBe('commit-editor');
    expect(resolveInlineTextKeyboardAction({
      key: 'Tab', target: 'link', activeSurface: 'link',
    })).toBe('none');
    expect(resolveInlineTextKeyboardAction({
      key: 'Tab', target: 'ai', activeSurface: 'ai',
    })).toBe('none');
  });

  it('gives IME first priority and closes exactly the active nested surface on Escape', () => {
    expect(resolveInlineTextKeyboardAction({
      key: 'Escape', isComposing: true, target: 'editor', activeSurface: 'link',
    })).toBe('none');
    expect(resolveInlineTextKeyboardAction({
      key: 'Escape', target: 'link', activeSurface: 'link',
    })).toBe('close-link');
    expect(resolveInlineTextKeyboardAction({
      key: 'Escape', target: 'ai', activeSurface: 'ai',
    })).toBe('close-ai');
    expect(resolveInlineTextKeyboardAction({
      key: 'Escape', target: 'editor', activeSurface: null,
    })).toBe('cancel-editor');
  });
});
