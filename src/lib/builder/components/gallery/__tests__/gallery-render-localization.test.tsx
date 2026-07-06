import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import GalleryRender from '../GalleryRender';
import { getContainerGalleryCopy } from '../../container-gallery-copy';

describe('gallery render localization', () => {
  it('returns localized gallery runtime aria copy in zh-hant', () => {
    const copy = getContainerGalleryCopy('zh-hant').gallery;

    expect(copy).toMatchObject({
      all: '全部',
      previous: '上一張圖庫圖片',
      next: '下一張圖庫圖片',
      lightboxLabel: '圖庫圖片',
      lightboxClose: '關閉',
      lightboxPrevious: '上一張圖片',
      lightboxNext: '下一張圖片',
    });
    expect(copy.goTo(0)).toBe('前往圖庫圖片 1');
    expect(copy.selectThumbnail(1)).toBe('選取縮圖 2');
    expect(copy.fallbackImages[0]).toMatchObject({
      alt: '圖庫天際線',
      caption: '諮詢空間',
      tags: ['辦公室'],
    });
  });

  it('renders localized published gallery labels in zh-hant', () => {
    const html = renderToStaticMarkup(
      <GalleryRender
        locale="zh-hant"
        mode="published"
        node={{
          content: {
            layout: 'slider',
            columns: 3,
            gap: 8,
            images: [
              { src: 'https://example.com/one.jpg', alt: 'One', caption: '一', tags: ['office'] },
              { src: 'https://example.com/two.jpg', alt: 'Two', caption: '二', tags: ['case'] },
            ],
            showCaptions: true,
            captionMode: 'below',
            activeFilter: 'all',
            autoplay: false,
            interval: 4000,
            thumbnailPosition: 'bottom',
            proStyle: 'clean',
          },
        } as unknown as Parameters<typeof GalleryRender>[0]['node']}
      />,
    );
    expect(html).toContain('全部');
    expect(html).toContain('上一張圖庫圖片');
    expect(html).toContain('下一張圖庫圖片');
    expect(html).toContain('前往圖庫圖片 1');
  });

  it('renders localized thumbnail selection labels in zh-hant', () => {
    const html = renderToStaticMarkup(
      <GalleryRender
        locale="zh-hant"
        mode="published"
        node={{
          content: {
            layout: 'thumbnail',
            columns: 3,
            gap: 8,
            images: [
              { src: 'https://example.com/one.jpg', alt: 'One', caption: '一', tags: ['office'] },
              { src: 'https://example.com/two.jpg', alt: 'Two', caption: '二', tags: ['case'] },
            ],
            showCaptions: true,
            captionMode: 'below',
            activeFilter: 'all',
            autoplay: false,
            interval: 4000,
            thumbnailPosition: 'bottom',
            proStyle: 'clean',
          },
        } as unknown as Parameters<typeof GalleryRender>[0]['node']}
      />,
    );

    expect(html).toContain('aria-label="選取縮圖 1"');
    expect(html).toContain('aria-label="選取縮圖 2"');
  });

  it('renders localized preview fallback image metadata in zh-hant', () => {
    const html = renderToStaticMarkup(
      <GalleryRender
        locale="zh-hant"
        mode="preview"
        node={{
          content: {
            layout: 'grid',
            columns: 3,
            gap: 8,
            images: [],
            showCaptions: true,
            captionMode: 'below',
            activeFilter: 'all',
            autoplay: false,
            interval: 4000,
            thumbnailPosition: 'bottom',
            proStyle: 'clean',
          },
        } as unknown as Parameters<typeof GalleryRender>[0]['node']}
      />,
    );

    expect(html).toContain('諮詢空間');
    expect(html).toContain('企業法務');
    expect(html).toContain('韓語諮詢');
    expect(html).toContain('辦公室');
    expect(html).toContain('alt="圖庫天際線"');
    expect(html).not.toContain('상담 공간');
    expect(html).not.toContain('office');
  });
});
