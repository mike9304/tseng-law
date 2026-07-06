import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderBlogPostCardCanvasNode } from '@/lib/builder/canvas/types';
import blogPostCardComponent from '../index';
import { getBlogPostCardCopy } from '../blog-post-card-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

const node = {
  id: 'blog-post-card-1',
  kind: 'blog-post-card',
  rect: { x: 0, y: 0, width: 360, height: 360 },
  content: {
    showFeaturedImage: true,
    showCategory: true,
    showAuthor: true,
    showExcerpt: true,
    showDate: true,
    showReadingTime: true,
    cardStyle: 'elevated',
    variant: 'flat',
  },
  style: {},
  locked: false,
  responsive: {},
  children: [],
} as unknown as BuilderBlogPostCardCanvasNode;

describe('blog post card localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getBlogPostCardCopy('zh-hant');
    expect(copy.section.post).toBe('文章');
    expect(copy.inspector.cardVariant).toBe('卡片變體');
    expect(copy.inspector.manualPostIdPlaceholder).toBe('custom-slug');
    expect(copy.variants.flat).toBe('平面');
    expect(copy.inspector.readingTime).toBe('閱讀時間');
    expect(copy.runtime.featuredBadge).toBe('精選');
    expect(copy.runtime.readingTime(6)).toBe('閱讀 6 分鐘');
    expect(copy.runtime.postNotFound('post-1')).toBe('找不到文章：post-1');
  });

  it('renders localized inspector labels in zh-hant', () => {
    const Inspector = blogPostCardComponent.Inspector as React.ComponentType<{
      node: BuilderBlogPostCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const html = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(html).toContain('文章');
    expect(html).toContain('文章（slug）');
    expect(html).toContain('手動覆寫 postId');
    expect(html).toContain('placeholder="custom-slug"');
    expect(html).toContain('卡片變體');
    expect(html).toContain('精選圖片');
    expect(html).toContain('閱讀時間');
    expect(html).toContain('data-builder-blog-post-card-inspector="true"');
  });

  it('keeps the blog post card inspector on shared CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'blogPostCard/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'BlogWidgetInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from '../BlogWidgetInspector.module.css';");
    expect(source).toContain('data-builder-blog-post-card-inspector="true"');
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

  it('renders localized runtime card chrome in zh-hant', () => {
    const Render = blogPostCardComponent.Render as React.ComponentType<{
      node: BuilderBlogPostCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const html = renderToStaticMarkup(
      <Render node={node} locale="zh-hant" mode="preview" />,
    );

    expect(html).toContain('台灣公司設立指南');
    expect(html).toContain('公司設立');
    expect(html).toContain('精選');
    expect(html).toContain('選擇文章');
    expect(html).toContain('閱讀 6 分鐘');
    expect(html).toContain('閱讀更多');
    expect(html).not.toContain('Featured');
    expect(html).not.toContain('Select post');
    expect(html).not.toContain('자세히 보기');
  });
});
