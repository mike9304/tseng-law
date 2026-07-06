import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';
import buttonComponent from '../index';
import { BUTTON_LEGACY_DEFAULT_LABEL, getButtonInspectorCopy } from '../button-copy';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

const node = {
  id: 'button-1',
  kind: 'button',
  rect: { x: 0, y: 0, width: 160, height: 48 },
  content: {
    label: 'Book now',
    href: '/zh-hant/contact',
    target: undefined,
    rel: undefined,
    title: undefined,
    ariaLabel: undefined,
    link: undefined,
    style: 'primary-solid',
    as: undefined,
    className: 'legacy-cta-button',
  },
  style: {},
  locked: false,
  responsive: {},
  children: [],
} as unknown as BuilderButtonCanvasNode;

describe('button inspector localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getButtonInspectorCopy('zh-hant');

    expect(copy.defaultLabel).toBe('按鈕');
    expect(copy.label).toBe('顯示文字');
    expect(copy.link).toBe('連結');
    expect(copy.variant).toBe('樣式');
    expect(copy.htmlTag).toBe('HTML 標籤');
    expect(copy.autoTag('a')).toBe('自動 (a)');
    expect(copy.variants['primary-solid']).toBe('主要填色');
    expect(copy.variants['cta-arrow']).toBe('CTA 箭頭');
  });

  it('renders localized inspector labels and button variant options in zh-hant', () => {
    const Inspector = buttonComponent.Inspector as React.ComponentType<{
      node: BuilderButtonCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
      linkPickerContext?: unknown;
    }>;

    const html = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );

    expect(html).toContain('顯示文字');
    expect(html).toContain('連結');
    expect(html).toContain('只會儲存內部路徑');
    expect(html).toContain('樣式');
    expect(html).toContain('主要填色');
    expect(html).toContain('次要外框');
    expect(html).toContain('HTML 標籤');
    expect(html).toContain('自動 (a)');
    expect(html).toContain('button (表單按鈕)');
    expect(html).toContain('CSS 類別（唯讀）');
    expect(html).not.toContain('Label (표시 텍스트)');
    expect(html).not.toContain('Variant (스타일)');
    expect(html).not.toContain('Class (CSS, 읽기 전용)');
  });

  it('keeps the button inspector on CSS modules without inline style chrome', () => {
    const inspector = read('src/lib/builder/components/button/Inspector.tsx');
    const css = read('src/lib/builder/components/button/ButtonInspector.module.css');

    expect(inspector).toContain("import styles from './ButtonInspector.module.css';");
    expect(inspector).toContain('data-builder-button-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.hint}',
      'className={styles.classNameCode}',
    ]) {
      expect(inspector).toContain(classUsage);
    }
    for (const removedInlineStyle of [
      'React.CSSProperties',
      'const fieldStyle',
      'const inputStyle',
      'const labelTextStyle',
      'const hintStyle',
      'style=',
    ]) {
      expect(inspector).not.toContain(removedInlineStyle);
    }
    expect(inspector).toContain('<LinkPicker');
    expect(inspector).toContain('locale={locale}');
    expect(css).toContain('.root {');
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.classNameCode {');
    expect(css).toContain('.hint {');
  });

  it('localizes legacy default button labels in render and inspector', () => {
    const Render = buttonComponent.Render as React.ComponentType<{
      node: BuilderButtonCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = buttonComponent.Inspector as React.ComponentType<{
      node: BuilderButtonCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      ...node,
      content: {
        ...node.content,
        label: BUTTON_LEGACY_DEFAULT_LABEL,
        href: '',
        className: undefined,
      },
    } as BuilderButtonCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={legacyNode} locale="zh-hant" mode="preview" />);
    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );

    expect(renderHtml).toContain('按鈕');
    expect(renderHtml).not.toContain('버튼');
    expect(inspectorHtml).toContain('value="按鈕"');
    expect(inspectorHtml).not.toContain('value="버튼"');
  });
});
