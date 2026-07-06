import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('editor badge render contract', () => {
  it('keeps theme-binding badges on one shared CSS-module badge component', () => {
    const badge = read('src/components/builder/editor/ThemeBindingBadge.tsx');
    const css = read('src/components/builder/editor/ThemeBindingBadge.module.css');
    const bindings = read('src/lib/builder/site/theme-bindings.ts');
    const styleTab = read('src/components/builder/editor/StyleTab.tsx');
    const colorPicker = read('src/components/builder/editor/ColorPickerAdvanced.tsx');
    const presetPicker = read('src/components/builder/editor/ThemeTextPresetPicker.tsx');
    const inspectorControls = read('src/components/builder/canvas/InspectorControls.tsx');

    expect(badge).toContain("import styles from './ThemeBindingBadge.module.css';");
    expect(badge).toContain('className={styles.badge}');
    expect(badge).toContain('className={styles.dot}');
    expect(badge).toContain('data-theme-binding-tone={indicator.tone}');
    expect(badge).toContain('data-theme-binding-case={textCase}');
    expect(badge).toContain('data-theme-binding-border={border}');
    expect(badge).toContain('data-theme-binding-interactive={onClick ? \'true\' : undefined}');
    expect(css).toContain('.badge.badge {');
    expect(css).toContain('button.badge');
    expect(css).toContain(".badge[data-theme-binding-tone='linked']");
    expect(css).toContain(".badge[data-theme-binding-tone='detached']");
    expect(css).toContain(".badge[data-theme-binding-tone='custom']");
    expect(css).toContain(".badge[data-theme-binding-case='normal']");
    expect(css).toContain(".badge[data-theme-binding-border='none']");
    expect(css).toContain('.dot {');
    expect(styleTab).toContain("import ThemeBindingBadge from '@/components/builder/editor/ThemeBindingBadge';");
    expect(colorPicker).toContain("import ThemeBindingBadge from '@/components/builder/editor/ThemeBindingBadge';");
    expect(presetPicker).toContain("import ThemeBindingBadge from '@/components/builder/editor/ThemeBindingBadge';");
    expect(inspectorControls).toContain("import ThemeBindingBadge from '@/components/builder/editor/ThemeBindingBadge';");
    expect(styleTab).not.toContain('getThemeBindingBadgeStyle');
    expect(colorPicker).not.toContain('getThemeBindingBadgeStyle');
    expect(presetPicker).not.toContain('getThemeBindingBadgeStyle');
    expect(inspectorControls).not.toContain('getThemeBindingBadgeStyle');
    expect(bindings).not.toContain('getThemeBindingBadgeStyle');
  });

  it('keeps style-origin chips on CSS-module badge chrome', () => {
    const chip = read('src/components/builder/editor/StyleOriginChip.tsx');
    const css = read('src/components/builder/editor/StyleOriginChip.module.css');

    expect(chip).toContain("import styles from './StyleOriginChip.module.css';");
    expect(chip).toContain('className={styles.originChip}');
    expect(chip).toContain('className={styles.originChipDot}');
    expect(chip).toContain('className={styles.originChipLabel}');
    expect(chip).toContain('data-builder-style-origin={origin.kind}');
    expect(chip).not.toContain('STYLE_ORIGIN_COLOR');
    expect(chip).not.toContain('style={{');
    expect(css).toContain('.originChip.originChip {');
    expect(css).toContain(".originChip[data-builder-style-origin='theme']");
    expect(css).toContain(".originChip[data-builder-style-origin='variant']");
    expect(css).toContain(".originChip[data-builder-style-origin='manual']");
    expect(css).toContain(".originChip[data-builder-style-origin='default']");
    expect(css).toContain('.originChip .originChipDot {');
  });

  it('keeps breakpoint override badges on CSS-module badge chrome', () => {
    const badge = read('src/components/builder/editor/BreakpointBadge.tsx');
    const css = read('src/components/builder/editor/BreakpointBadge.module.css');

    expect(badge).toContain("import styles from './BreakpointBadge.module.css';");
    expect(badge).toContain('className={styles.breakpointBadge}');
    expect(badge).toContain('className={styles.breakpointBadgeDot}');
    expect(badge).toContain('className={styles.breakpointBadgeLabel}');
    expect(badge).toContain('data-builder-breakpoint-badge={viewport}');
    expect(badge).toContain("data-has-label={visibleLabel ? 'true' : 'false'}");
    expect(badge).not.toContain('style={{');
    expect(css).toContain('.breakpointBadge.breakpointBadge {');
    expect(css).toContain(".breakpointBadge[data-has-label='false']");
    expect(css).toContain('.breakpointBadge .breakpointBadgeDot {');
  });

  it('keeps the Style tab source panel and section chrome on CSS modules', () => {
    const styleTab = read('src/components/builder/editor/StyleTab.tsx');
    const css = read('src/components/builder/editor/StyleTab.module.css');

    expect(styleTab).toContain("import tabStyles from './StyleTab.module.css';");
    expect(styleTab).toContain('className={tabStyles.styleSourcePanel}');
    expect(styleTab).toContain('className={tabStyles.styleSourceHeader}');
    expect(styleTab).toContain('className={tabStyles.styleSourceGrid}');
    expect(styleTab).toContain('className={tabStyles.styleSourceRow}');
    expect(styleTab).toContain('className={tabStyles.styleSourceLabelStack}');
    expect(styleTab).toContain('className={tabStyles.styleSourceLabel}');
    expect(styleTab).toContain('className={tabStyles.styleSourceHint}');
    expect(styleTab).toContain('className={tabStyles.bindingSummary}');
    expect(styleTab).toContain('<ThemeBindingBadge indicator={buttonVariantBindingDisplay} />');
    expect(styleTab).toContain('className={tabStyles.styleSection}');
    expect(styleTab).toContain('className={tabStyles.styleSectionHeader}');
    expect(styleTab).not.toContain('getThemeBindingBadgeStyle');
    expect(styleTab).not.toContain('style={getThemeBindingBadgeStyle(indicator.tone)}');
    expect(styleTab).not.toContain('const styleSourcePanelStyle');
    expect(styleTab).not.toContain('const styleSourceRowStyle');
    expect(styleTab).not.toContain('const sectionDividerStyle');
    expect(styleTab).not.toContain('const bindingSummaryStyle');
    expect(styleTab).not.toContain("style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}");
    expect(css).toContain('.styleSourcePanel {');
    expect(css).toContain('.styleSourceGrid {');
    expect(css).toContain('.styleSourceLabel.styleSourceLabel {');
    expect(css).toContain('.styleSectionTitle.styleSectionTitle {');
    expect(css).toContain('.styleSection {');
  });

  it('keeps the theme text preset picker on CSS-module chrome', () => {
    const picker = read('src/components/builder/editor/ThemeTextPresetPicker.tsx');
    const css = read('src/components/builder/editor/ThemeTextPresetPicker.module.css');

    expect(picker).toContain("import styles from './ThemeTextPresetPicker.module.css';");
    expect(picker).toContain('className={styles.root}');
    expect(picker).toContain('className={styles.trigger}');
    expect(picker).toContain('className={styles.triggerLabel}');
    expect(picker).toContain('className={styles.popover}');
    expect(picker).toContain('className={styles.option}');
    expect(picker).toContain('className={styles.previewText}');
    expect(picker).toContain('className={styles.presetName}');
    expect(picker).toContain('style={presetPreviewStyle(preset, theme)}');
    expect(picker).not.toContain('const wrapperStyle');
    expect(picker).not.toContain('const triggerStyle');
    expect(picker).not.toContain('const triggerLabelStyle');
    expect(picker).not.toContain('const popoverStyle');
    expect(picker).not.toContain('function optionStyle');
    expect(picker).not.toContain('React.CSSProperties');
    expect(css).toContain('.root {');
    expect(css).toContain('.trigger {');
    expect(css).toContain(".option[data-active='true']");
    expect(css).toContain('.previewText {');
    expect(css).toContain('var(--theme-text-preset-color');
    expect(css).toContain('var(--theme-text-preset-font-family');
  });
});
