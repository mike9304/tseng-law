import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getLinkPickerCopy } from '../link-picker-copy';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('getLinkPickerCopy', () => {
  it('localizes the link picker chrome', () => {
    expect(getLinkPickerCopy('ko').link).toMatchObject({
      dialogLabel: '링크 편집',
      label: '링크',
      targetSelf: '같은 창',
      targetBlank: '새 창 (_blank)',
      popupLabel: '팝업',
      advancedShow: '고급 보기',
      advancedHide: '고급 숨기기',
      clearLink: '링크 지우기',
    });

    expect(getLinkPickerCopy('zh-hant').link).toMatchObject({
      dialogLabel: '編輯連結',
      label: '連結',
      targetSelf: '同一視窗',
      targetBlank: '新視窗 (_blank)',
      popupLabel: 'Popup',
      advancedShow: '顯示進階',
      advancedHide: '隱藏進階',
      clearLink: '清除連結',
    });

    expect(getLinkPickerCopy('en').link).toMatchObject({
      dialogLabel: 'Edit link',
      label: 'Link',
      targetSelf: 'Same tab',
      targetBlank: 'New tab (_blank)',
      popupLabel: 'Popup',
      advancedShow: 'Advanced',
      advancedHide: 'Hide advanced',
      clearLink: 'Clear link',
    });
  });

  it('keeps LinkPicker on CSS modules with duplicate-safe suggestions', () => {
    const picker = read('src/components/builder/editor/LinkPicker.tsx');
    const css = read('src/components/builder/editor/LinkPicker.module.css');

    expect(picker).toContain("import styles from './LinkPicker.module.css';");
    expect(picker).toContain('data-builder-link-picker="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.helpText}',
      'className={styles.errorText}',
      'className={styles.secondaryButton}',
      'className={styles.dangerButton}',
      'className={styles.advancedFields}',
    ]) {
      expect(picker).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      'const fieldStyle',
      'const labelStyle',
      'const inputStyle',
      'const helpStyle',
      'const errorStyle',
      'const clearButtonStyle',
      'const toggleButtonStyle',
      'style=',
    ]) {
      expect(picker).not.toContain(removedInlineStyle);
    }
    expect(picker).toContain('const seen = new Set<string>();');
    expect(picker).toContain('if (!path || seen.has(path)) continue;');
    expect(picker).toContain('if (!nextAnchor || seen.has(nextAnchor)) continue;');
    expect(picker).toContain("data-invalid={!isSafe ? 'true' : undefined}");
    expect(css).toContain('.root {');
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain(".control[data-invalid='true']");
    expect(css).toContain('.secondaryButton:hover:not(:disabled)');
    expect(css).toContain('.dangerButton:hover:not(:disabled)');
  });
});
