import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderFaqListCanvasNode } from '@/lib/builder/canvas/types';
import FaqListInspector from '../Inspector';

const componentRoot = join(process.cwd(), 'src/lib/builder/components/faqList');

describe('faq list inspector localization', () => {
  it('renders localized inspector labels and placeholders in zh-hant', () => {
    const node = {
      id: 'faq-list-1',
      kind: 'faqList',
      content: {
        source: 'static',
        items: [{ question: '', answer: '' }],
        categoryId: 'all',
        showSearch: true,
        showCategoryFilter: true,
        expandFirst: true,
        schemaEnabled: true,
        limit: 50,
      },
    } as unknown as BuilderFaqListCanvasNode;

    const html = renderToStaticMarkup(
      <FaqListInspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );

    expect(html).toContain('來源');
    expect(html).toContain('data-builder-faq-list-inspector="true"');
    expect(html).toContain('手動輸入');
    expect(html).toContain('FAQ 應用資料');
    expect(html).toContain('分類');
    expect(html).toContain('全部');
    expect(html).toContain('公司設立');
    expect(html).toContain('顯示數量');
    expect(html).toContain('顯示搜尋框');
    expect(html).toContain('顯示分類篩選');
    expect(html).toContain('展開第一個問題');
    expect(html).toContain('輸出 FAQPage schema');
    expect(html).toContain('項目 (1)');
    expect(html).toContain('placeholder="問題"');
    expect(html).toContain('placeholder="答案"');
    expect(html).toContain('移除');
    expect(html).toContain('+ 新增 Q&amp;A');
    expect(html).not.toContain('질문');
    expect(html).not.toContain('검색창 표시');
  });

  it('keeps the faq list inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'FaqListInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './FaqListInspector.module.css';");
    expect(source).toContain('data-builder-faq-list-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.inlineFields}',
      'className={styles.checkboxRow}',
      'className={styles.itemCard}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.dangerButton}',
      'className={styles.primaryButton}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'labelStyle',
      'inputStyle',
      'rowStyle',
      'checkStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.inlineFields');
    expect(css).toContain('.checkboxRow');
    expect(css).toContain('.itemCard');
    expect(css).toContain('.control:focus-visible');
  });
});
