import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import featuredPostsComponent from '../index';
import { getFeaturedPostsCopy } from '../featured-posts-copy';
import type { BuilderFeaturedPostsCanvasNode } from '@/lib/builder/canvas/types';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('featured posts localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getFeaturedPostsCopy('zh-hant');
    expect(copy.inspector).toMatchObject({
      featuredSection: '精選',
      limit: '數量',
      layout: '版面',
    });
    expect(copy.element).toMatchObject({
      emptyState: '尚無精選文章。',
      categoryPrefix: '分類',
      featuredMarker: '精選',
    });
    expect(copy.element.mockPosts[0]).toMatchObject({
      title: '台灣公司設立指南',
      excerpt: '外國人設立公司的程序完整整理。',
    });
  });

  it('renders localized inspector and runtime labels in zh-hant', () => {
    const Inspector = featuredPostsComponent.Inspector as React.ComponentType<{
      node: BuilderFeaturedPostsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const Render = featuredPostsComponent.Render as React.ComponentType<{
      node: BuilderFeaturedPostsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const node = {
      kind: 'featured-posts',
      content: {
        limit: 3,
        layout: 'hero',
      },
    } as unknown as BuilderFeaturedPostsCanvasNode;

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('精選');
    expect(inspectorHtml).toContain('數量');
    expect(inspectorHtml).toContain('版面');
    expect(inspectorHtml).toContain('主視覺（1 個大卡 + 側欄）');
    expect(inspectorHtml).toContain('並排');
    expect(inspectorHtml).toContain('堆疊');
    expect(inspectorHtml).toContain('data-builder-featured-posts-inspector="true"');

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('精選');
    expect(renderHtml).toContain('分類');
    expect(renderHtml).toContain('台灣公司設立指南');
    expect(renderHtml).toContain('外國人設立公司的程序完整整理。');
    expect(renderHtml).toContain('跨國離婚管轄權爭議');
    expect(renderHtml).not.toContain('대만 회사 설립 가이드');
    expect(renderHtml).not.toContain('국제이혼 관할권 분쟁');

    const emptyHtml = renderToStaticMarkup(<Render node={{ ...node, content: { ...node.content, limit: 0 } }} locale="zh-hant" mode="published" />);
    expect(emptyHtml).toContain('尚無精選文章。');
  });

  it('keeps the featured posts inspector on shared CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'featuredPosts/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'BlogWidgetInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from '../BlogWidgetInspector.module.css';");
    expect(source).toContain('data-builder-featured-posts-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.sectionLabel}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
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
    expect(css).toContain('.control:focus-visible');
  });
});

describe('featured posts builder demo disclosure', () => {
  const Render = featuredPostsComponent.Render as React.ComponentType<{
    node: BuilderFeaturedPostsCanvasNode;
    locale?: 'ko' | 'zh-hant' | 'en';
    mode?: 'edit' | 'preview' | 'published';
  }>;

  function makeNode(layout: 'hero' | 'side-by-side' | 'stacked', limit = 3): BuilderFeaturedPostsCanvasNode {
    return { kind: 'featured-posts', content: { limit, layout } } as unknown as BuilderFeaturedPostsCanvasNode;
  }

  function countDisclosures(html: string): number {
    return (html.match(/data-builder-demo-disclosure/g) ?? []).length;
  }

  it.each(['hero', 'side-by-side', 'stacked'] as const)(
    'renders exactly one demo disclosure before the %s layout in edit and preview, none in published',
    (layout) => {
      const node = makeNode(layout);
      const editHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
      const previewHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);
      const publishedHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="published" />);

      expect(countDisclosures(editHtml)).toBe(1);
      expect(countDisclosures(previewHtml)).toBe(1);
      expect(countDisclosures(publishedHtml)).toBe(0);

      // Builder mock content still renders alongside the label.
      expect(editHtml).toContain('台灣公司設立指南');
      expect(previewHtml).toContain('台灣公司設立指南');

      // The disclosure is the first node of the shared wrapper, ahead of the layout surface.
      const editDisclosure = editHtml.indexOf('data-builder-demo-disclosure');
      const editLayout = editHtml.indexOf('data-builder-featured-posts="true"');
      expect(editDisclosure).toBeGreaterThanOrEqual(0);
      expect(editLayout).toBeGreaterThan(editDisclosure);
    },
  );

  it('renders exactly one demo disclosure for the builder empty state and none when published', () => {
    const node = makeNode('stacked', 0);
    const editHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    const publishedHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="published" />);

    expect(countDisclosures(editHtml)).toBe(1);
    expect(editHtml).toContain('尚無精選文章。');
    expect(countDisclosures(publishedHtml)).toBe(0);
    expect(publishedHtml).toContain('尚無精選文章。');
  });
});
