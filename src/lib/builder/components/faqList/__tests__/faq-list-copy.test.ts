import { describe, expect, it } from 'vitest';
import { getFaqListCopy } from '../faq-list-copy';

describe('faq list copy', () => {
  it('localizes the widget chrome in ko', () => {
    const copy = getFaqListCopy('ko');
    expect(copy).toMatchObject({
      all: '전체',
      categoriesLabel: 'FAQ 분류',
      loading: 'FAQ 불러오는 중...',
      noResults: '조건에 맞는 FAQ가 없습니다.',
      searchLabel: 'FAQ 검색',
      searchPlaceholder: '질문 검색',
      emptyState: 'FAQ 목록이 없습니다.',
    });
    expect(copy.inspector.items(2)).toBe('항목 (2)');
    expect(copy.inspector.questionPlaceholder).toBe('질문');
  });

  it('localizes the widget chrome in zh-hant', () => {
    const copy = getFaqListCopy('zh-hant');
    expect(copy).toMatchObject({
      all: '全部',
      categoriesLabel: 'FAQ 分類',
      loading: 'FAQ 載入中...',
      noResults: '沒有符合條件的 FAQ。',
      searchLabel: '搜尋 FAQ',
      searchPlaceholder: '搜尋問題',
      emptyState: '沒有 FAQ 項目。',
    });
    expect(copy.inspector).toMatchObject({
      source: '來源',
      sourceStatic: '手動輸入',
      sourceApp: 'FAQ 應用資料',
      category: '分類',
      limit: '顯示數量',
      questionPlaceholder: '問題',
      answerPlaceholder: '答案',
      removeItem: '移除',
      addItem: '+ 新增 Q&A',
    });
    expect(copy.inspector.items(1)).toBe('項目 (1)');
  });
});
