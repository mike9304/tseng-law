import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderBlogAuthorCanvasNode } from '@/lib/builder/canvas/types';
import blogAuthorComponent from '../index';
import { getBlogAuthorCopy } from '../blog-author-copy';

const node = {
  id: 'blog-author-1',
  kind: 'blog-author',
  rect: { x: 0, y: 0, width: 420, height: 360 },
  content: {
    layout: 'card',
    showBio: true,
    showPostCount: true,
    showRecentPosts: true,
    maxPosts: 3,
  },
  style: {},
  locked: false,
  responsive: {},
  children: [],
} as unknown as BuilderBlogAuthorCanvasNode;

describe('blog author localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getBlogAuthorCopy('zh-hant');

    expect(copy.loading).toBe('正在載入作者...');
    expect(copy.empty).toBe('沒有可顯示的作者。');
    expect(copy.fallbackAuthorName).toBe('灝正國際法律事務所');
    expect(copy.mock.postTitle).toBe('台灣公司設立檢查清單');
  });

  it('renders localized builder mock author content in zh-hant', () => {
    const Render = blogAuthorComponent.Render as React.ComponentType<{
      node: BuilderBlogAuthorCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const html = renderToStaticMarkup(
      <Render node={node} mode="preview" locale="zh-hant" />,
    );

    expect(html).toContain('灝正國際法律事務所');
    expect(html).toContain('法律內容團隊');
    expect(html).toContain('根據台灣法律實務');
    expect(html).toContain('台灣公司設立檢查清單');
    expect(html).not.toContain('호정국제 법률사무소');
    expect(html).not.toContain('대만 회사설립 체크리스트');
  });

  it('renders localized published empty state in zh-hant', () => {
    const Render = blogAuthorComponent.Render as React.ComponentType<{
      node: BuilderBlogAuthorCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const html = renderToStaticMarkup(
      <Render node={node} mode="published" locale="zh-hant" />,
    );

    expect(html).toContain('沒有可顯示的作者。');
    expect(html).not.toContain('표시할 작성자가 없습니다.');
  });
});
