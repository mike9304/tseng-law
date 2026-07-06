import { describe, expect, it } from 'vitest';
import { getNavigationCopy } from '../navigation-copy';

describe('navigation copy', () => {
  it('returns localized ko strings', () => {
    const copy = getNavigationCopy('ko');
    expect(copy.title).toBe('내비게이션');
    expect(copy.addButton).toBe('추가');
    expect(copy.itemCountLabel(3)).toBe('3개 메뉴');
    expect(copy.labels.label).toBe('라벨');
    expect(copy.labels.path).toBe('경로');
    expect(copy.titles.newItem).toBe('새 항목');
    expect(copy.titles.untitled).toBe('제목 없음');
    expect(copy.titles.saveError).toContain('메뉴 저장');
  });

  it('returns localized zh-hant strings', () => {
    const copy = getNavigationCopy('zh-hant');
    expect(copy.title).toBe('導覽');
    expect(copy.addButton).toBe('新增');
    expect(copy.itemCountLabel(2)).toBe('2 個選單');
    expect(copy.labels.href).toBe('路徑');
    expect(copy.labels.path).toBe('路徑');
    expect(copy.titles.newSubmenu).toBe('新子選單');
    expect(copy.titles.untitled).toBe('未命名');
    expect(copy.titles.saveError).toContain('導覽');
  });

  it('returns English navigation chrome without CJK', () => {
    const copy = getNavigationCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;
    expect(copy.title).toBe('Navigation');
    expect(copy.addButton).toBe('Add');
    expect(copy.itemCountLabel(1)).toBe('1 item');
    expect(copy.itemCountLabel(2)).toBe('2 items');
    expect([
      copy.title,
      copy.addButton,
      copy.loading,
      copy.emptyState,
      copy.itemCountLabel(3),
      Object.values(copy.labels).join(' '),
      Object.values(copy.actions).join(' '),
      Object.values(copy.titles).join(' '),
    ].join(' ')).not.toMatch(cjk);
  });
});
