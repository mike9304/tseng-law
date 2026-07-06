import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { getElementCommentsPanelCopy } from '../element-comments-panel-copy';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

describe('element comments panel copy', () => {
  it('returns ko comments panel copy', () => {
    const copy = getElementCommentsPanelCopy('ko');
    expect(copy.noSelectionLabel).toBe('노드를 선택하면 주석을 추가할 수 있습니다.');
    expect(copy.titleLabel(2)).toBe('주석 · 2');
    expect(copy.emptyLabel).toBe('아직 주석이 없습니다.');
    expect(copy.resolvedLabel).toBe('해결됨');
    expect(copy.placeholder).toBe('이 노드에 대한 주석...');
    expect(copy.submitLabel).toBe('댓글 추가');
    expect(copy.defaultAuthorLabel).toBe('디자이너');
    expect(copy.dateTimeLocale).toBe('ko-KR');
  });

  it('returns zh-hant comments panel copy without Hangul', () => {
    const copy = getElementCommentsPanelCopy('zh-hant');
    expect(copy.noSelectionLabel).toBe('選取節點後即可新增註解。');
    expect(copy.titleLabel(3)).toBe('註解 · 3');
    expect(copy.resolveLabel).toBe('解決');
    expect(copy.deleteLabel).toBe('刪除');
    expect(copy.defaultAuthorLabel).toBe('設計師');
    expect([
      copy.noSelectionLabel,
      copy.titleLabel(1),
      copy.emptyLabel,
      copy.resolvedLabel,
      copy.resolveLabel,
      copy.deleteLabel,
      copy.placeholder,
      copy.submitLabel,
      copy.defaultAuthorLabel,
      copy.dateTimeLocale,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en comments panel copy without CJK', () => {
    const copy = getElementCommentsPanelCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.noSelectionLabel).toBe('Select a node to add comments.');
    expect(copy.titleLabel(4)).toBe('Comments · 4');
    expect(copy.resolveLabel).toBe('Resolve');
    expect(copy.deleteLabel).toBe('Delete');
    expect(copy.defaultAuthorLabel).toBe('designer');
    expect([
      copy.noSelectionLabel,
      copy.titleLabel(1),
      copy.emptyLabel,
      copy.resolvedLabel,
      copy.resolveLabel,
      copy.deleteLabel,
      copy.placeholder,
      copy.submitLabel,
      copy.defaultAuthorLabel,
      copy.dateTimeLocale,
    ].join(' ')).not.toMatch(cjk);
  });

  it('renders the comments panel through a css module instead of inline styles', () => {
    const panel = read('src/components/builder/canvas/ElementCommentsPanel.tsx');
    const css = read('src/components/builder/canvas/ElementCommentsPanel.module.css');

    expect(panel).toContain("import styles from './ElementCommentsPanel.module.css';");
    expect(panel).not.toContain('style=');
    expect(panel).toContain('className={styles.root}');
    expect(panel).toContain('className={styles.commentCard}');
    expect(panel).toContain("data-resolved={c.resolvedAt ? 'true' : 'false'}");
    expect(panel).toContain('className={styles.textarea}');
    expect(panel).toContain('className={styles.submitButton}');
    expect(panel).toContain('data-tone="danger"');
    expect(css).toContain('.commentCard[data-resolved=\'true\']');
    expect(css).toContain('.actionButton[data-tone=\'danger\']');
    expect(css).toContain('.textarea:focus');
    expect(css).toContain('.submitButton:disabled');
  });
});
