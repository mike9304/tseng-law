import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import blogArchiveComponent from '../index';
import { getBlogArchiveCopy } from '../blog-archive-copy';
import type { BuilderBlogArchiveCanvasNode } from '@/lib/builder/canvas/types';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('blog archive localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getBlogArchiveCopy('zh-hant');
    expect(copy.inspector).toMatchObject({
      groupSection: '分組',
      groupBy: '分組依據',
      month: '年 › 月',
      year: '僅年份',
      displaySection: '顯示',
      expandLatest: '自動展開最新年份',
      showCount: '顯示文章數',
    });
    expect(copy.element).toMatchObject({
      title: '彙整',
      emptyState: '尚無文章。',
    });
  });

  it('renders localized inspector and runtime labels in zh-hant', () => {
    const Inspector = blogArchiveComponent.Inspector as React.ComponentType<{
      node: BuilderBlogArchiveCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const Render = blogArchiveComponent.Render as React.ComponentType<{
      node: BuilderBlogArchiveCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;

    const node = {
      kind: 'blog-archive',
      content: {
        groupBy: 'month',
        expandLatest: true,
        showCount: true,
      },
    } as unknown as BuilderBlogArchiveCanvasNode;

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('分組');
    expect(inspectorHtml).toContain('分組依據');
    expect(inspectorHtml).toContain('年 › 月');
    expect(inspectorHtml).toContain('僅年份');
    expect(inspectorHtml).toContain('顯示');
    expect(inspectorHtml).toContain('自動展開最新年份');
    expect(inspectorHtml).toContain('顯示文章數');
    expect(inspectorHtml).toContain('data-builder-blog-archive-inspector="true"');

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('彙整');
    expect(renderHtml).toContain('2026-04');
    expect(renderHtml).toContain('2026-03');
  });

  it('keeps the blog archive inspector on shared CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'blogArchive/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'BlogWidgetInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from '../BlogWidgetInspector.module.css';");
    expect(source).toContain('data-builder-blog-archive-inspector="true"');
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
