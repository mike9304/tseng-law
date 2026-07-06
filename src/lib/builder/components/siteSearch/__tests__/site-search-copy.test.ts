import { describe, expect, it } from 'vitest';
import {
  getSiteSearchCopy,
  localizedSiteSearchLegacyText,
  SITE_SEARCH_LEGACY_DEFAULT_VALUES,
  SITE_SEARCH_LEGACY_DEFAULTS,
  SITE_SEARCH_SCHEMA_LEGACY_DEFAULTS,
} from '../site-search-copy';

describe('site search copy', () => {
  it('localizes the inspector labels in ko', () => {
    expect(getSiteSearchCopy('ko')).toEqual({
      defaultPlaceholder: '어떻게 도와드릴까요?',
      defaultSubmitLabel: '검색',
      placeholderLabel: '플레이스홀더',
      searchButtonLabel: '검색 버튼 라벨',
      showInlineResultsLabel: '결과 인라인 표시',
      searchScopeLegend: '검색 범위',
      searchScopeHint: '선택하지 않으면 전체 검색',
      maxResultsLabel: '최대 결과수',
      localeOverrideLabel: '로케일 override',
      localeOverridePlaceholder: '페이지 로케일 사용',
      kindLabels: {
        page: '페이지',
        blog: '칼럼',
        faq: 'FAQ',
        portfolio: '포트폴리오',
      },
    });
  });

  it('localizes the inspector labels in zh-hant', () => {
    expect(getSiteSearchCopy('zh-hant')).toEqual({
      defaultPlaceholder: '請問我可以怎麼幫您？',
      defaultSubmitLabel: '搜尋',
      placeholderLabel: '預留文字',
      searchButtonLabel: '搜尋按鈕標籤',
      showInlineResultsLabel: '內嵌顯示結果',
      searchScopeLegend: '搜尋範圍',
      searchScopeHint: '未勾選時搜尋全部',
      maxResultsLabel: '最大結果數',
      localeOverrideLabel: '語系覆寫',
      localeOverridePlaceholder: '使用頁面語系',
      kindLabels: {
        page: '頁面',
        blog: '專欄',
        faq: 'FAQ',
        portfolio: '作品集',
      },
    });
  });

  it('localizes only legacy default search text', () => {
    const copy = getSiteSearchCopy('zh-hant');

    expect(localizedSiteSearchLegacyText(
      SITE_SEARCH_LEGACY_DEFAULTS.placeholder,
      copy.defaultPlaceholder,
      SITE_SEARCH_LEGACY_DEFAULT_VALUES.placeholder,
    )).toBe('請問我可以怎麼幫您？');
    expect(localizedSiteSearchLegacyText(
      SITE_SEARCH_SCHEMA_LEGACY_DEFAULTS.submitLabel,
      copy.defaultSubmitLabel,
      SITE_SEARCH_LEGACY_DEFAULT_VALUES.submitLabel,
    )).toBe('搜尋');
    expect(localizedSiteSearchLegacyText('Custom search', copy.defaultPlaceholder, SITE_SEARCH_LEGACY_DEFAULT_VALUES.placeholder)).toBe('Custom search');
    expect(localizedSiteSearchLegacyText('', copy.defaultPlaceholder, SITE_SEARCH_LEGACY_DEFAULT_VALUES.placeholder)).toBe('');
  });
});
