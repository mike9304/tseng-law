import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getSandboxFeedbackOverlayCopy } from '../sandbox-feedback-copy';
import { getSandboxTopBarCopy } from '../sandbox-top-bar-copy';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('professional builder chrome', () => {
  it('keeps the localized identity, primary, and secondary action hierarchy', () => {
    const source = read('src/components/builder/canvas/SandboxTopBar.tsx');

    expect(source).toContain('data-builder-topbar-identity="true"');
    expect(source).toContain('data-builder-topbar-primary-cluster="true"');
    expect(source).toContain('data-builder-topbar-primary="undo"');
    expect(source).toContain('data-builder-topbar-primary="redo"');
    expect(source).toContain('data-builder-topbar-primary="preview"');
    expect(source).toContain('data-builder-topbar-primary="publish"');
    expect(source).toContain('data-builder-topbar-secondary-cluster="true"');
    expect(source).toContain('useBuilderCanvasStore((state) => state.canUndo)');
    expect(source).toContain('useBuilderCanvasStore((state) => state.redo)');

    const copies = ['ko', 'en', 'zh-hant'] as const;
    for (const locale of copies) {
      const copy = getSandboxTopBarCopy(locale);
      expect(copy.primaryActionsAriaLabel).not.toHaveLength(0);
      expect(copy.undoLabel).not.toHaveLength(0);
      expect(copy.redoLabel).not.toHaveLength(0);
      expect(copy.secondaryActionsLabel).not.toHaveLength(0);
      expect(copy.secondaryActionsTitle).not.toHaveLength(0);
    }
  });

  it('uses editor preferences as the sole persisted editor theme source', () => {
    const page = read('src/components/builder/canvas/SandboxPage.tsx');
    const statusBar = read('src/components/builder/canvas/SandboxStatusBar.tsx');
    const themeToggle = read('src/components/builder/canvas/EditorThemeToggle.tsx');

    expect(page).not.toContain("builder:editor-theme");
    expect(page).not.toContain('editorThemeMode');
    expect(statusBar).not.toContain('onThemeModeChange');
    expect(themeToggle).toContain('loadEditorPreferences()');
    expect(themeToggle).toContain("window.matchMedia('(prefers-color-scheme: dark)')");
    expect(themeToggle).toContain("document.querySelectorAll<HTMLElement>('[data-editor-shell]')");
    expect(themeToggle).toContain('shell.dataset.editorTheme = effectiveTheme');
  });

  it('keeps one save status surface and gives every toast appropriate live semantics and dismissal', () => {
    const topBar = read('src/components/builder/canvas/SandboxTopBar.tsx');
    const statusBar = read('src/components/builder/canvas/SandboxStatusBar.tsx');
    const feedback = read('src/components/builder/canvas/SandboxFeedbackOverlay.tsx');
    const chromeCss = read('src/components/builder/canvas/SandboxChrome.module.css');
    const visibleSaveSources = [topBar, statusBar, feedback].join('\n');

    expect(visibleSaveSources.match(/data-builder-save-status/g)).toHaveLength(1);
    expect(topBar).not.toContain('savingSpinner');
    expect(statusBar).not.toContain('draftSaveState');
    expect(feedback).toContain('data-builder-topbar-status="true"');
    expect(feedback).toContain("role={toast.tone === 'error' ? 'alert' : 'status'}");
    expect(feedback).toContain("aria-live={toast.tone === 'error' ? 'assertive' : 'polite'}");
    expect(feedback).toContain('data-builder-toast-dismiss="true"');
    expect(chromeCss).not.toContain('toastOut');

    for (const locale of ['ko', 'en', 'zh-hant'] as const) {
      expect(getSandboxFeedbackOverlayCopy(locale).dismissToastLabel).not.toHaveLength(0);
    }
  });
});
