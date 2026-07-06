import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import blogCategoriesComponent from '../index';
import { getBlogCategoriesCopy } from '../blog-categories-copy';
import type { BuilderBlogCategoriesCanvasNode } from '@/lib/builder/canvas/types';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('blog categories localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getBlogCategoriesCopy('zh-hant');
    expect(copy.inspector).toMatchObject({
      layoutSection: '版面',
      displaySection: '顯示',
      showAll: '顯示「全部」分類',
      showPostCount: '顯示文章數',
      activeColorSection: '啟用色',
      colorLabel: '顏色（hex）',
      colorPlaceholder: '#0b3b2e',
    });
    expect(copy.element).toMatchObject({
      allLabel: '全部',
    });
  });

  it('renders localized inspector and all-category labels in zh-hant', () => {
    const Inspector = blogCategoriesComponent.Inspector as React.ComponentType<{
      node: BuilderBlogCategoriesCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const Render = blogCategoriesComponent.Render as React.ComponentType<{
      node: BuilderBlogCategoriesCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const node = {
      kind: 'blog-categories',
      content: {
        layout: 'horizontal',
        showAll: true,
        showPostCount: true,
      },
    } as unknown as BuilderBlogCategoriesCanvasNode;

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('版面');
    expect(inspectorHtml).toContain('顯示');
    expect(inspectorHtml).toContain('顯示「全部」分類');
    expect(inspectorHtml).toContain('顯示文章數');
    expect(inspectorHtml).toContain('啟用色');
    expect(inspectorHtml).toContain('顏色（hex）');
    expect(inspectorHtml).toContain('橫向');
    expect(inspectorHtml).toContain('直向');
    expect(inspectorHtml).toContain('格狀');
    expect(inspectorHtml).toContain('placeholder="#0b3b2e"');
    expect(inspectorHtml).toContain('data-builder-blog-categories-inspector="true"');

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('全部');
    expect(renderHtml).toContain('公司設立');
    expect(renderHtml).toContain('交通事故');
  });

  it('keeps the blog categories inspector on shared CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'blogCategories/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'BlogWidgetInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from '../BlogWidgetInspector.module.css';");
    expect(source).toContain('data-builder-blog-categories-inspector="true"');
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
