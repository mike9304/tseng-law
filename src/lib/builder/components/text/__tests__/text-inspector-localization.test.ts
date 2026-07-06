import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getTextControlsCopy } from '@/components/builder/editor/text-controls-copy';
import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import TextElement from '@/components/builder/canvas/elements/TextElement';
import TextInspector, { bulletListRichText } from '../Inspector';
import { TEXT_LEGACY_DEFAULT_TEXT } from '../text-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('text inspector localization', () => {
  it('uses localized fallback bullet items when text is empty', () => {
    const zhFallbackItems = getTextControlsCopy('zh-hant').textInspector.bulletListFallbackItems;
    const richText = bulletListRichText('', zhFallbackItems);

    expect(richText.plainText).toBe('第一個項目\n第二個項目\n第三個項目');
    expect(JSON.stringify(richText.doc)).toContain('第一個項目');
    expect(JSON.stringify(richText.doc)).not.toContain('첫 번째 항목');
  });

  it('preserves custom text lines when creating a bullet list', () => {
    const zhFallbackItems = getTextControlsCopy('zh-hant').textInspector.bulletListFallbackItems;
    const richText = bulletListRichText('Alpha\nBeta', zhFallbackItems);

    expect(richText.plainText).toBe('Alpha\nBeta');
    expect(JSON.stringify(richText.doc)).toContain('Alpha');
    expect(JSON.stringify(richText.doc)).not.toContain('第一個項目');
  });

  it('localizes legacy default text in render and inspector', () => {
    const node = {
      id: 'text-default',
      kind: 'text',
      content: {
        text: TEXT_LEGACY_DEFAULT_TEXT,
        richText: richTextFromPlainText(TEXT_LEGACY_DEFAULT_TEXT),
        fontSize: 16,
        color: '#1f2937',
        fontWeight: 'regular',
        align: 'left',
        lineHeight: 1.25,
        letterSpacing: 0,
        fontFamily: 'system-ui',
        themePreset: undefined,
        verticalAlign: 'top',
        textShadow: undefined,
        backgroundColor: undefined,
        textTransform: 'none',
        columns: 1,
        columnGap: 24,
        quoteStyle: 'none',
        marquee: undefined,
        textPath: undefined,
        link: undefined,
      },
      style: {},
    } as unknown as BuilderTextCanvasNode;

    const renderHtml = renderToStaticMarkup(React.createElement(TextElement, { node, locale: 'zh-hant' }));
    const inspectorHtml = renderToStaticMarkup(
      React.createElement(TextInspector, {
        node,
        locale: 'zh-hant',
        onUpdate: () => undefined,
        disabled: false,
      }),
    );

    expect(renderHtml).toContain('輸入文字');
    expect(renderHtml).not.toContain(TEXT_LEGACY_DEFAULT_TEXT);
    expect(inspectorHtml).toContain('輸入文字');
    expect(inspectorHtml).not.toContain(TEXT_LEGACY_DEFAULT_TEXT);
    expect(inspectorHtml).toContain('data-builder-text-inspector="true"');
  });

  it('keeps the text inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'text/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'text/TextInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './TextInspector.module.css';");
    expect(source).toContain('data-builder-text-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.fieldset}',
      'className={styles.legend}',
      'className={styles.actionRow}',
      'className={styles.actionButton}',
      'className={styles.rangeRow}',
      'className={styles.range}',
      'className={styles.value}',
      'className={styles.clearButton}',
      'className={styles.checkboxRow}',
      'className={styles.linkSection}',
      'className={styles.sectionLabel}',
      'className={`${styles.control} ${styles.colorInput}`}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      "import React from 'react'",
      '@/components/builder/canvas/SandboxPage.module.css',
      'React.CSSProperties',
      'style={{',
      'style={',
      'inspectorActionRow',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.fieldset');
    expect(css).toContain('.actionRow');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.linkSection');
  });
});
