import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderProductGalleryCanvasNode } from '@/lib/builder/canvas/types';
import productGalleryComponent from '../productGallery';
import { getProductGalleryCopy } from '../productGallery/product-gallery-copy';

describe('product gallery localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getProductGalleryCopy('zh-hant');

    expect(copy).toMatchObject({
      allCategories: '全部',
      categoriesAriaLabel: '商品分類',
      sortLabel: '排序',
      quickView: '快速檢視',
      previousPage: '上一頁',
      nextPage: '下一頁',
      detail: '查看詳情',
      close: '關閉',
    });
    expect(copy.sortOptions['price-asc']).toBe('價格由低到高');
    expect(copy.availabilityLabels['low-stock']).toBe('庫存不多');
    expect(copy.mock.products[0].title).toBe('台灣創業準備指南');
  });

  it('renders localized builder preview chrome and mock content in zh-hant', () => {
    const Render = productGalleryComponent.Render as React.ComponentType<{
      node: BuilderProductGalleryCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const node = {
      id: 'product-gallery-1',
      kind: 'product-gallery',
      content: {
        layout: 'grid',
        category: '',
        showCategoryFilter: true,
        showSort: true,
        showQuickView: true,
        columns: 3,
        pageSize: 1,
        sortBy: 'updated-desc',
      },
    } as unknown as BuilderProductGalleryCanvasNode;

    const html = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);

    expect(html).toContain('aria-label="商品分類"');
    expect(html).toContain('全部');
    expect(html).toContain('數位指南');
    expect(html).toContain('諮詢方案');
    expect(html).toContain('排序');
    expect(html).toContain('最新');
    expect(html).toContain('價格由低到高');
    expect(html).toContain('台灣創業準備指南');
    expect(html).toContain('可預訂');
    expect(html).toContain('快速檢視');
    expect(html).toContain('src="/images/001-taiwan-company-establishment-basics/featured-01.jpg"');
    expect(html).toContain('alt="台灣創業準備指南封面"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('上一頁');
    expect(html).toContain('下一頁');
    expect(html).not.toContain('Product categories');
    expect(html).not.toContain('Loading products');
    expect(html).not.toContain('대만 창업 준비 가이드');
    expect(html).not.toContain('빠른 보기');
  });

  it('renders localized empty state in zh-hant', () => {
    const Render = productGalleryComponent.Render as React.ComponentType<{
      node: BuilderProductGalleryCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const node = {
      id: 'product-gallery-empty',
      kind: 'product-gallery',
      content: {
        layout: 'grid',
        category: 'missing-category',
        showCategoryFilter: false,
        showSort: false,
        showQuickView: false,
        columns: 3,
        pageSize: 6,
        sortBy: 'updated-desc',
      },
    } as unknown as BuilderProductGalleryCanvasNode;

    const html = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);

    expect(html).toContain('沒有可顯示的商品。');
    expect(html).not.toContain('표시할 상품이 없습니다.');
  });
});
