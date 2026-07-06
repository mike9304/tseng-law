import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderHeadingCanvasNode } from '@/lib/builder/canvas/types';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import headingComponent from '../heading';
import { HEADING_LEGACY_DEFAULT_TEXT } from '../heading/heading-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('heading inspector localization', () => {
  it('renders localized typography option labels in zh-hant', () => {
    const Inspector = headingComponent.Inspector as React.ComponentType<{
      node: BuilderHeadingCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      id: 'heading-1',
      kind: 'heading',
      content: {
        text: '標題文字',
        richText: richTextFromPlainText('標題文字'),
        level: 2,
        color: '#0f172a',
        align: 'left',
        fontFamily: 'system-ui',
        fontSize: 40,
        fontWeight: 'regular',
        fontWeightNumeric: undefined,
        fontStyle: 'normal',
        textDecoration: 'none',
        lineHeight: 1.1,
        letterSpacing: 0,
        themePreset: undefined,
      },
    } as unknown as BuilderHeadingCanvasNode;

    const html = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );

    expect(html).toContain('data-builder-heading-inspector="true"');
    expect(html).toContain('字重');
    expect(html).toContain('一般');
    expect(html).toContain('中等');
    expect(html).toContain('粗體');
    expect(html).toContain('樣式');
    expect(html).toContain('斜體');
    expect(html).toContain('裝飾');
    expect(html).toContain('底線');
    expect(html).toContain('刪除線');
    expect(html).toContain('字距');
    expect(html).toContain('對齊');
    expect(html).toContain('左');
    expect(html).toContain('中');
    expect(html).toContain('右');
    expect(html).not.toContain('Regular');
    expect(html).not.toContain('Letter spacing');
    expect(html).not.toContain('Align');
    expect(html).not.toContain('Line-through');
  });

  it('localizes legacy default heading text in render and inspector', () => {
    const Render = headingComponent.Render as React.ComponentType<{
      node: BuilderHeadingCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = headingComponent.Inspector as React.ComponentType<{
      node: BuilderHeadingCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      id: 'heading-default',
      kind: 'heading',
      content: {
        text: HEADING_LEGACY_DEFAULT_TEXT,
        richText: richTextFromPlainText(HEADING_LEGACY_DEFAULT_TEXT),
        level: 2,
        color: '#0f172a',
        align: 'left',
        fontFamily: 'system-ui',
        fontSize: 40,
        fontWeight: 'regular',
        fontWeightNumeric: undefined,
        fontStyle: 'normal',
        textDecoration: 'none',
        lineHeight: 1.1,
        letterSpacing: 0,
        themePreset: undefined,
      },
    } as unknown as BuilderHeadingCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" />);
    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );

    expect(renderHtml).toContain('輸入標題');
    expect(renderHtml).not.toContain(HEADING_LEGACY_DEFAULT_TEXT);
    expect(inspectorHtml).toContain('輸入標題');
    expect(inspectorHtml).not.toContain(HEADING_LEGACY_DEFAULT_TEXT);
  });

  it('keeps the heading inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'heading/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'heading/HeadingInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './HeadingInspector.module.css';");
    expect(source).toContain('data-builder-heading-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.warning}',
      'className={styles.rangeRow}',
      'className={styles.range}',
      'className={styles.value}',
      'className={styles.clearButton}',
      'className={styles.helpText}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      "import React from 'react'",
      'React.CSSProperties',
      'style={{',
      'style={',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.textarea');
    expect(css).toContain('.rangeRow');
    expect(css).toContain('.clearButton');
  });
});
