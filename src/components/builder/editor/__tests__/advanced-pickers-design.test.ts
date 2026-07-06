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
    const styles = read('src/components/builder/editor/ColorPickerAdvanced.module.css');
    const copy = read('src/components/builder/editor/color-picker-copy.ts');

    expect(picker).toContain('data-color-picker-advanced');
    expect(picker).toContain("import styles from './ColorPickerAdvanced.module.css';");
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.trigger}',
      'className={styles.panel}',
      'className={styles.swatchGrid}',
      'className={styles.swatchButton}',
      'className={styles.textInput}',
      'className={styles.eyeDropperButton}',
    ]) {
      expect(picker).toContain(classUsage);
    }
    for (const inlineStyleConstant of [
      'const wrapperStyle',
      'const triggerStyle',
      'const panelStyle',
      'const labelStyle',
      'const textInputStyle',
      'function swatchButtonStyle',
    ]) {
      expect(picker).not.toContain(inlineStyleConstant);
    }
    expect(picker).toContain('style={colorSwatchStyle(item.color)}');
    expect(picker).toContain('style={currentColorStyle(currentColor)}');
    expect(styles).toContain('.panel {');
    expect(styles).toContain('.trigger {');
    expect(styles).toContain(".swatchButton[data-active='true']");
    expect(styles).toContain('.eyeDropperButton:disabled');
    expect(styles).toContain('.textInput {');
    expect(picker).toContain('EyeDropper');
    expect(picker).toContain('copy.eyeDropperUnavailableTitle');
    expect(copy).toContain('EyeDropper is unavailable in this browser');
    expect(picker).toContain('contrastRatio');
    expect(picker).toContain('wcagLevel');
    expect(picker).toContain('ThemeBindingBadge');
    expect(picker).toContain('copy.themePaletteLabel');
    expect(picker).toContain('copy.recentLabel');
    expect(copy).toContain('Theme palette');
    expect(copy).toContain('Recent');
    expect(picker).toContain('pushRecentColor');
    expect(picker).toContain("onChange({ kind: 'token', token: item.token })");
  });

  test('keeps FontPickerAdvanced search, filters, preview, and font-load fallback', () => {
    const picker = read('src/components/builder/editor/FontPickerAdvanced.tsx');
    const styles = read('src/components/builder/editor/FontPickerAdvanced.module.css');
    const copy = read('src/components/builder/editor/text-controls-copy.ts');

    expect(picker).toContain('data-font-picker');
    expect(picker).toContain("import styles from './FontPickerAdvanced.module.css';");
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.trigger}',
      'className={styles.popover}',
      'className={styles.textInput}',
      'className={styles.categoryButton}',
      'className={styles.previewInput}',
      'className={styles.list}',
      'className={styles.fontOption}',
      'className={styles.fontPreview}',
    ]) {
      expect(picker).toContain(classUsage);
    }
    for (const inlineStyleConstant of [
      'const wrapperStyle',
      'const triggerStyle',
      'const popoverStyle',
      'const listStyle',
    ]) {
      expect(picker).not.toContain(inlineStyleConstant);
    }
    expect(picker).toContain('style={currentFontStyle(currentFont)}');
    expect(picker).toContain('style={previewFontStyle(font.family)}');
    expect(styles).toContain('.popover {');
    expect(styles).toContain('.trigger {');
    expect(styles).toContain(".categoryButton[data-active='true']");
    expect(styles).toContain(".fontOption[data-active='true']");
    expect(styles).toContain('.fontPreview {');
    expect(styles).toContain('var(--font-picker-preview-family');
    expect(picker).toContain('getTextControlsCopy(locale)');
    expect(picker).toContain('copy.fontPicker.dialogTitle');
    expect(picker).toContain('copy.fontPicker.previewAriaLabel');
    expect(copy).toContain('fontLoadFailed:');
    expect(picker).toContain('buildGoogleFontsUrl');
    expect(picker).toContain('highlight(font.family, query)');
    for (const category of ['all', 'sans-serif', 'serif', 'display', 'monospace']) {
      expect(picker).toContain(`'${category}'`);
    }
  });

  test('wires advanced pickers into SiteSettings and StyleTab surfaces', () => {
    // SiteSettings modal was split into per-tab files; FontPicker now lives in
    // the typography tab. Accept either the modal shell or the typography tab.
    const siteSettings = read('src/components/builder/canvas/SiteSettingsModal.tsx');
    const siteSettingsTypography = read('src/components/builder/canvas/SiteSettingsTypographyTab.tsx');
    const siteSettingsSurfaces = `${siteSettings}\n${siteSettingsTypography}`;
    const brandKit = read('src/components/builder/editor/BrandKitPanel.tsx');
    const brandKitPalette = read('src/components/builder/editor/BrandKitPaletteEditor.tsx');
    const styleTab = read('src/components/builder/editor/StyleTab.tsx');

    expect(siteSettingsSurfaces).toContain('<FontPicker');
    expect(`${brandKit}\n${brandKitPalette}`).toContain('<FontPicker');
    expect(brandKit).toContain('<BrandKitPaletteEditor');
    expect(styleTab).toContain('<ColorPicker');
    expect(styleTab).toContain('paletteTokens={paletteTokens}');
  });
});
