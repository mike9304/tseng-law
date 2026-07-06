import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import blogRecentPostsComponent from '../index';
import { getBlogRecentPostsCopy } from '../blog-recent-posts-copy';
import type { BuilderBlogRecentPostsCanvasNode } from '@/lib/builder/canvas/types';

describe('blog recent posts localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getBlogRecentPostsCopy('zh-hant');
    expect(copy.element).toMatchObject({
      loading: '文章載入中...',
      emptyState: '目前沒有最新公開文章。',
    });
    expect(copy.element.mockPosts[0]).toMatchObject({
      title: '台灣公司設立檢查清單',
      excerpt: '公司設立前應確認的程序與實務重點。',
      authorName: '浩正國際法律事務所',
    });
  });

  it('renders localized runtime labels in zh-hant', () => {
    const Render = blogRecentPostsComponent.Render as React.ComponentType<{
      node: BuilderBlogRecentPostsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const node = {
      kind: 'blog-recent-posts',
      content: {
        limit: 3,
        layout: 'list',
        showExcerpt: true,
        showAuthor: true,
        showDate: true,
        showCategory: true,
      },
    } as unknown as BuilderBlogRecentPostsCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('台灣公司設立檢查清單');
    expect(renderHtml).toContain('公司設立前應確認的程序與實務重點。');
    expect(renderHtml).toContain('浩正國際法律事務所');
    expect(renderHtml).toContain('公司設立');
    expect(renderHtml).not.toContain('대만 회사설립 체크리스트');
    expect(renderHtml).not.toContain('호정국제 법률사무소');

    const emptyHtml = renderToStaticMarkup(
      <Render node={{ ...node, content: { ...node.content, limit: 0 } }} locale="zh-hant" mode="published" />,
    );
    expect(emptyHtml).toContain('目前沒有最新公開文章。');
  });
});
