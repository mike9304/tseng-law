import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { getMoveToPageModalCopy } from '../move-to-page-modal-copy';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

describe('move to page modal copy', () => {
  test('returns localized zh-hant move-to-page labels', () => {
    const copy = getMoveToPageModalCopy('zh-hant');

    expect(copy.title).toBe('移動到頁面');
    expect(copy.closeAriaLabel).toBe('關閉');
    expect(copy.description(3)).toBe('將選取的 3 個元素移動到其他頁面。');
    expect(copy.noTargetsTitle).toBe('沒有其他可移動的頁面。');
    expect(copy.untitledPage).toBe('未命名頁面');
    expect(copy.homeBadge).toBe('首頁');
  });

  test('returns localized ko move-to-page labels', () => {
    const copy = getMoveToPageModalCopy('ko');

    expect(copy.description(2)).toBe('선택된 2개 요소를 다른 페이지로 옮깁니다.');
    expect(copy.moveFailed).toBe('이동에 실패했습니다.');
    expect(copy.closeHint).toBe('Esc 또는 화면 바깥 클릭으로 닫기');
  });

  test('falls back to English move-to-page labels', () => {
    const copy = getMoveToPageModalCopy('fr');

    expect(copy.title).toBe('Move to page');
    expect(copy.description(1)).toBe('Move 1 selected elements to another page.');
    expect(copy.moving).toBe('Moving...');
  });

  test('renders the move-to-page modal through a css module instead of inline styles', () => {
    const modal = read('src/components/builder/canvas/MoveToPageModal.tsx');
    const css = read('src/components/builder/canvas/MoveToPageModal.module.css');

    expect(modal).toContain("import styles from './MoveToPageModal.module.css';");
    expect(modal).not.toContain('style=');
    expect(modal).not.toContain('currentTarget.style');
    expect(modal).toContain('className={styles.error}');
    expect(modal).toContain('className={styles.targetList}');
    expect(modal).toContain('className={styles.targetButton}');
    expect(modal).toContain('className={styles.targetIcon}');
    expect(modal).toContain('className={styles.status}');
    expect(modal).toContain('data-tone="moving"');
    expect(css).toContain('.targetButton:hover:not(:disabled)');
    expect(css).toContain('.targetButton:disabled');
    expect(css).toContain('.targetMeta');
    expect(css).toContain('@media (max-width: 520px)');
  });
});
