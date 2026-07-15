import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('active canvas locale consumer contract', () => {
  it('keeps the route locale as hook input and scopes page consumers to the committed locale', () => {
    const page = read('src/components/builder/canvas/SandboxPage.tsx');
    const stateHook = read('src/components/builder/canvas/hooks/useSandboxSiteState.ts');

    expect(page).toContain('activeCanvasLocale,\n    activePageId,');
    expect(page).toMatch(/useSandboxSiteState\(\{[\s\S]*?\n    locale,\n/);
    expect(page).not.toContain('locale={locale}');
    expect(page).not.toContain('new URLSearchParams({ locale, siteId })');

    for (const consumer of [
      'SandboxTopBar',
      'ResponsiveAiPanel',
      'DraftConflictBanner',
      'SandboxEditorWorkspace',
      'SandboxModalsRoot',
      'SandboxFeedbackOverlay',
      'SandboxStatusBar',
    ]) {
      const consumerStart = page.indexOf(`<${consumer}`);
      expect(consumerStart, `${consumer} must remain rendered`).toBeGreaterThan(-1);
      expect(page.slice(consumerStart, consumerStart + 500)).toContain('locale={activeCanvasLocale}');
    }

    expect(page).toContain('new URLSearchParams({ locale: activeCanvasLocale, siteId })');
    expect(page).toContain('locale: activeCanvasLocale,\n          navigation: result.items,');
    expect(page).toContain('getNavigationCopy(activeCanvasLocale)');
    expect(page).toContain('getPublicChromeCopy(activeCanvasLocale)');
    expect(page).toContain('getDraftConflictCopy(activeCanvasLocale)');
    expect(page).toContain('getSandboxPageFeedbackCopy(activeCanvasLocale)');
    expect(page).toContain('lightbox.locale === activeCanvasLocale');
    expect(page).toContain('popup.locale === activeCanvasLocale');
    expect(page).toContain('encodeURIComponent(activeCanvasLocale)');

    expect(stateHook).toContain('const [activeCanvasLocale, setActiveCanvasLocale] = useState<Locale>(locale);');
    expect(stateHook).toContain('return {\n    activeCanvasLocale,');
  });
});
