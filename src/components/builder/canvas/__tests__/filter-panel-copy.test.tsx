import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import FilterPanel from '../FilterPanel';
import { DEFAULT_FILTERS } from '@/lib/builder/canvas/filters';

describe('filter panel copy', () => {
  test('renders filter controls with zh-hant copy', () => {
    const html = renderToStaticMarkup(
      React.createElement(FilterPanel, {
        locale: 'zh-hant',
        filters: DEFAULT_FILTERS,
        onChangeFilters: () => undefined,
        onClose: () => undefined,
      }),
    );

    expect(html).toContain('圖片篩選');
    expect(html).toContain('關閉');
    expect(html).toContain('亮度');
    expect(html).toContain('柔和');
    expect(html).not.toContain('이미지 필터');
    expect(html).not.toContain('닫기');
    expect(html).not.toContain('High Contrast');
  });
});
