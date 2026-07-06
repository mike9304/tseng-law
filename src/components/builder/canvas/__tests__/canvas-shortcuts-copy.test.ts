import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  getCanvasEditorPrefsCopy,
  getCanvasKeybindingsCopy,
  getCanvasNodeBadgeCopy,
  getCanvasShortcutsHelpCopy,
} from '../canvas-shortcuts-copy';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

describe('canvas shortcut copy', () => {
  it('localizes editor prefs and shortcut chrome', () => {
    expect(getCanvasEditorPrefsCopy('ko')).toMatchObject({
      buttonTitle: '편집기 설정',
      dialogLabel: '편집기 설정',
      heading: '편집기',
      rulers: '눈금자',
      outlineView: '윤곽선 보기',
      outlineHideContent: '콘텐츠 숨기기',
      pixelGrid: '픽셀 그리드 + 스냅',
      gridSize: '그리드 크기',
      shortcutMap: '단축키 표',
    });
    expect(getCanvasEditorPrefsCopy('zh-hant')).toMatchObject({
      buttonTitle: '編輯器偏好設定',
      dialogLabel: '編輯器偏好設定',
      heading: '編輯器',
      rulers: '標尺',
      outlineView: '外框檢視',
      outlineHideContent: '隱藏內容',
      pixelGrid: '像素格線與貼齊',
      gridSize: '格線大小',
      shortcutMap: '快捷鍵對照表',
    });
    expect(getCanvasEditorPrefsCopy('en')).toMatchObject({
      buttonTitle: 'Editor preferences',
      dialogLabel: 'Editor preferences',
      heading: 'Editor',
      rulers: 'Rulers',
      outlineView: 'Outline view',
      outlineHideContent: 'Hide content',
      pixelGrid: 'Pixel grid + snap',
      gridSize: 'Grid size',
      shortcutMap: 'Shortcut map',
    });
    expect(getCanvasKeybindingsCopy('ko')).toMatchObject({
      ariaLabel: '단축키 매핑',
      title: '단축키 매핑',
      action: '액션',
      descriptionHeading: '설명',
      shortcutHeading: '단축키',
      reset: '기본값',
      cancel: '취소',
      save: '저장',
    });
    expect(getCanvasKeybindingsCopy('zh-hant')).toMatchObject({
      ariaLabel: '快捷鍵對照表',
      title: '快捷鍵對照表',
      action: '動作',
      descriptionHeading: '說明',
      shortcutHeading: '快捷鍵',
      reset: '重設',
      cancel: '取消',
      save: '儲存',
    });
  });

  it('localizes the shortcut help modal and node badge copy', () => {
    expect(getCanvasShortcutsHelpCopy('ko').title).toBe('키보드 단축키');
    expect(getCanvasShortcutsHelpCopy('ko').closeHint).toBe('Esc 또는 바깥쪽 클릭으로 닫기');
    expect(getCanvasShortcutsHelpCopy('zh-hant').title).toBe('鍵盤快捷鍵');
    expect(getCanvasShortcutsHelpCopy('zh-hant').closeHint).toBe('按 Esc 或點擊外部即可關閉');

    expect(getCanvasNodeBadgeCopy('ko').locked).toBe('잠김');
    expect(getCanvasNodeBadgeCopy('ko').shortcutFallback).toBe('단축키');
    expect(getCanvasNodeBadgeCopy('zh-hant').locked).toBe('已鎖定');
    expect(getCanvasNodeBadgeCopy('zh-hant').shortcutFallback).toBe('快捷鍵');
  });

  it('renders the shortcut help modal through a css module instead of inline styles', () => {
    const modal = read('src/components/builder/canvas/ShortcutsHelpModal.tsx');
    const css = read('src/components/builder/canvas/ShortcutsHelpModal.module.css');

    expect(modal).toContain("import styles from './ShortcutsHelpModal.module.css';");
    expect(modal).not.toContain('style=');
    expect(modal).toContain('className={styles.grid}');
    expect(modal).toContain('className={styles.groupTitle}');
    expect(modal).toContain('className={styles.shortcutRow}');
    expect(modal).toContain('className={styles.shortcutKey}');
    expect(modal).toContain('className={styles.closeHint}');
    expect(css).toContain('.shortcutKey');
    expect(css).toContain('grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));');
    expect(css).toContain('@media (max-width: 680px)');
  });

  it('renders the keybindings modal through a css module instead of inline styles', () => {
    const modal = read('src/components/builder/canvas/KeybindingsModal.tsx');
    const css = read('src/components/builder/canvas/KeybindingsModal.module.css');

    expect(modal).toContain("import styles from './KeybindingsModal.module.css';");
    expect(modal).not.toContain('style=');
    expect(modal).toContain('className={styles.backdrop}');
    expect(modal).toContain('className={styles.panel}');
    expect(modal).toContain('className={styles.table}');
    expect(modal).toContain('className={styles.comboInput}');
    expect(modal).toContain('className={`${styles.button} ${styles.secondaryButton} ${styles.resetButton}`}');
    expect(modal).toContain('className={`${styles.button} ${styles.primaryButton}`}');
    expect(css).toContain('.comboInput:focus');
    expect(css).toContain('.primaryButton');
    expect(css).toContain('@media (max-width: 640px)');
  });
});
