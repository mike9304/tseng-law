import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('D-POOL-5 advanced picker contracts', () => {
  test('keeps ColorPicker and FontPicker as thin advanced exports', () => {
    expect(read('src/components/builder/editor/ColorPicker.tsx')).toContain("export { default } from './ColorPickerAdvanced'");
    expect(read('src/components/builder/editor/FontPicker.tsx')).toContain("export { default } from './FontPickerAdvanced'");
  });

  test('keeps ColorPickerAdvanced feature surface intact', () => {
    const picker = read('src/components/builder/editor/ColorPickerAdvanced.tsx');

    expect(picker).toContain('data-color-picker-advanced');
    expect(picker).toContain('EyeDropper');
    expect(picker).toContain('EyeDropper is unavailable in this browser');
    expect(picker).toContain('contrastRatio');
    expect(picker).toContain('wcagLevel');
    expect(picker).toContain('ThemeBindingBadge');
    expect(picker).toContain('Theme palette');
    expect(picker).toContain('Recent');
    expect(picker).toContain('pushRecentColor');
    expect(picker).toContain("onChange({ kind: 'token', token: item.token })");
  });

  test('keeps FontPickerAdvanced search, filters, preview, and font-load fallback', () => {
    const picker = read('src/components/builder/editor/FontPickerAdvanced.tsx');

    expect(picker).toContain('data-font-picker');
    expect(picker).toContain('Search fonts');
    expect(picker).toContain('Font preview text');
    expect(picker).toContain('Google Fonts failed');
    expect(picker).toContain('buildGoogleFontsUrl');
    expect(picker).toContain('highlight(font.family, query)');
    for (const category of ['all', 'sans-serif', 'serif', 'display', 'monospace']) {
      expect(picker).toContain(`'${category}'`);
    }
  });

  test('wires advanced pickers into SiteSettings and StyleTab surfaces', () => {
    const siteSettings = read('src/components/builder/canvas/SiteSettingsModal.tsx');
    const brandKit = read('src/components/builder/editor/BrandKitPanel.tsx');
    const styleTab = read('src/components/builder/editor/StyleTab.tsx');

    expect(siteSettings).toContain('<FontPicker');
    expect(brandKit).toContain('<FontPicker');
    expect(styleTab).toContain('<ColorPicker');
    expect(styleTab).toContain('paletteTokens={paletteTokens}');
  });
});
