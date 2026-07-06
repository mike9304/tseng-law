import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import blogFeedComponent from '../index';
import { getBlogFeedCopy } from '../blog-feed-copy';
import type { BuilderBlogFeedCanvasNode } from '@/lib/builder/canvas/types';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('blog feed localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getBlogFeedCopy('zh-hant');
    expect(copy.inspector).toMatchObject({
      layoutSection: '版面',
      filterSortSection: '篩選與排序',
      displaySection: '顯示',
      allCategories: '所有分類',
      tagPlaceholder: '例如：wage',
    });
    expect(copy.element).toMatchObject({
      loading: '文章載入中...',
      errorPrefix: '部落格摘要錯誤：',
      loadError: '無法載入文章。',
      emptyState: '部落格摘要 · 尚無文章。',
      featuredBadge: '精選',
      readMore: '閱讀更多',
    });
    expect(copy.element.mockAuthorName).toBe('灝正國際法律事務所');
    expect(copy.element.mockPosts[0]?.title).toBe('台灣公司設立指南');
  });

  it('renders localized inspector and feed labels in zh-hant', () => {
    const Inspector = blogFeedComponent.Inspector as React.ComponentType<{
      node: BuilderBlogFeedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const Render = blogFeedComponent.Render as React.ComponentType<{
      node: BuilderBlogFeedCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const baseNode = {
      kind: 'blog-feed',
      content: {
        layout: 'featured-hero',
        postsPerPage: 4,
        showExcerpt: true,
        showAuthor: true,
        showDate: true,
        showReadingTime: true,
        showCategory: true,
        showTags: false,
        showFeaturedImage: true,
        sortBy: 'featured-first',
        columns: 2,
        gap: 16,
      },
    } as unknown as BuilderBlogFeedCanvasNode;

    const emptyNode = {
      ...baseNode,
      content: {
        ...baseNode.content,
        filterByCategory: 'no-such-category',
      },
    } as unknown as BuilderBlogFeedCanvasNode;

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={baseNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('版面');
    expect(inspectorHtml).toContain('欄數');
    expect(inspectorHtml).toContain('每頁文章數');
    expect(inspectorHtml).toContain('篩選與排序');
    expect(inspectorHtml).toContain('分類篩選');
    expect(inspectorHtml).toContain('標籤篩選');
    expect(inspectorHtml).toContain('精選圖片');
    expect(inspectorHtml).toContain('最新優先');
    expect(inspectorHtml).toContain('所有分類');
    expect(inspectorHtml).toContain('data-builder-blog-feed-inspector="true"');

    const renderHtml = renderToStaticMarkup(<Render node={baseNode} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('台灣公司設立指南');
    expect(renderHtml).toContain('灝正國際法律事務所');
    expect(renderHtml).toContain('閱讀更多');
    expect(renderHtml).toContain('精選');
    expect(renderHtml).toContain('分鐘閱讀');
    expect(renderHtml).toContain('公司設立');
    expect(renderHtml).toContain('查看');
    expect(renderHtml).toContain('文章');
    expect(renderHtml).not.toContain('대만 회사 설립 가이드');
    expect(renderHtml).not.toContain('호정국제 법률사무소');

    const emptyHtml = renderToStaticMarkup(<Render node={emptyNode} locale="zh-hant" mode="edit" />);
    expect(emptyHtml).toContain('部落格摘要 · 尚無文章。');
  });

  it('keeps the blog feed inspector on shared CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'blogFeed/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'BlogWidgetInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from '../BlogWidgetInspector.module.css';");
    expect(source).toContain('data-builder-blog-feed-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.sectionLabel}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'sectionLabelStyle',
      'selectStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.sectionLabel');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.control:focus-visible');
  });
});
