import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('compact builder shell contract', () => {
  it('lifts inspector ownership into the workspace with a real drawer-to-inspector button', () => {
    const workspace = read('src/components/builder/canvas/SandboxEditorWorkspace.tsx');

    expect(workspace).toContain('const [inspectorCollapsed, setInspectorCollapsed] = useState(false)');
    expect(workspace).toContain('data-builder-inspector-toggle="true"');
    expect(workspace).toContain('data-builder-inspector-collapsed=');
    expect(workspace).toContain('data-builder-compact-panel-switch="inspector"');
    expect(workspace).toContain('onSetActiveDrawer(null);');
    expect(workspace).not.toMatch(/dispatchEvent|\.click\(\)|MouseEvent\(/);
  });

  it('pins measurable topbar and compact overlay geometry without consuming the canvas row', () => {
    const css = read('src/components/builder/canvas/SandboxChrome.module.css');

    expect(css).toContain('--editor-topbar-h: 56px');
    expect(css).toContain('@media (max-width: 1080px)');
    expect(css).toContain('--editor-topbar-h: 72px');
    expect(css).toContain('@media (max-width: 520px)');
    expect(css).toContain('--editor-topbar-h: 88px');
    expect(css).toContain('@media (max-width: 960px)');
    expect(css).toContain('grid-template-rows: 52px minmax(0, 1fr)');
    expect(css).toMatch(/\.editorShell\s*\{[^}]*overflow:\s*hidden !important/s);
    expect(css).toContain('.editorShell > aside[data-builder-drawer]');
    expect(css).toContain('position: absolute !important');
    expect(css).toContain(".editorShell[data-builder-active-drawer='true'] .inspectorColumn");
    expect(css).toContain('height: min(36%, 320px) !important');
    expect(css).toContain('.inspectorCollapsed');
    expect(css).toContain('flex-basis: 0 !important');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('.toastActions :global(button)');
    expect(css).toMatch(/\.toastActions\s+:global\(button\)\s*\{[^}]*min-width:\s*40px[^}]*min-height:\s*40px/s);
    expect(css).toMatch(/\.toastDismiss\s*\{[^}]*min-width:\s*40px/s);
    expect(css).toContain('.statusBarDensity :global(button)');
    expect(css).toMatch(/\.statusBarDensity\s+:global\(button\)\s*\{[^}]*min-height:\s*40px/s);
    expect(css).toMatch(/\.statusBar\s*\{[^}]*max-width:\s*100%[^}]*overflow:\s*hidden/s);
  });

  it('scopes suppression of the inspector internal collapse button to the outer host', () => {
    const css = read('src/components/builder/canvas/SandboxChrome.module.css');
    expect(css).toContain(".inspectorPanelHost :global([data-builder-inspector-panel='true'] > header > button)");
  });
});
