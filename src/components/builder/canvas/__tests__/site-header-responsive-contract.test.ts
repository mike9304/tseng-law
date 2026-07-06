import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('builder site header responsive contract', () => {
  test('uses the public desktop width for the editor desktop viewport', () => {
    const chrome = read('src/components/builder/canvas/SandboxPageChrome.ts');
    // EDITOR_HEADER_COMPACT_BREAKPOINT 은 리팩터로 SandboxEditorWorkspace →
    // SandboxPublishedSiteChrome 로 이동(값·로직 동일: viewportWidth <= 1120 이면 compact).
    const publishedChrome = read('src/components/builder/canvas/SandboxPublishedSiteChrome.tsx');

    expect(chrome).toContain('desktop: 1280,');
    expect(publishedChrome).toContain('const EDITOR_HEADER_COMPACT_BREAKPOINT = 1120;');
  });

  test('keeps editor header menus from wrapping or overflowing the canvas', () => {
    const css = read('src/components/builder/canvas/SandboxPage.module.css');

    expect(css).toContain("@container (max-width: 1120px)");
    expect(css).toContain(".globalHeaderRegion :global(.builder-site-header .main-nav) {\n  overflow: hidden;");
    expect(css).toContain("flex-wrap: nowrap;");
    expect(css).toContain(".globalHeaderRegion :global(.builder-site-header .header-actions) {\n  gap: 5px;\n  margin-right: 0;");
    expect(css).toContain(".globalHeaderRegion :global(.builder-site-header .main-nav),");
    expect(css).toContain(".globalHeaderRegion :global(.builder-site-header .mobile-toggle) {\n    display: inline-flex;");
  });

  test('keeps rulers and custom guides above flow sections but below toolbar chrome', () => {
    const canvasRulers = read('src/components/builder/canvas/CanvasRulers.tsx');
    const customGuides = read('src/components/builder/canvas/CustomGuidesOverlay.tsx');
    const css = read('src/components/builder/canvas/SandboxPage.module.css');

    expect(css).toContain("z-index: 30000 !important;");
    expect(css).toContain("z-index: 40000 !important;");
    expect(css).toContain("z-index: 50010;");
    expect(canvasRulers).toContain("const RULER_Z_INDEX = 45020;");
    expect(canvasRulers).toContain("zIndex: RULER_Z_INDEX");
    expect(customGuides).toContain("const GUIDE_OVERLAY_Z_INDEX = 45010;");
    expect(customGuides).toContain("zIndex: GUIDE_OVERLAY_Z_INDEX");
  });
});
