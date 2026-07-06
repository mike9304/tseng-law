import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderAttorneyCardCanvasNode,
  BuilderColumnCardCanvasNode,
  BuilderColumnListCanvasNode,
} from '@/lib/builder/canvas/types';
import attorneyCardComponent from '../attorneyCard';
import columnCardComponent from '../columnCard';
import columnListComponent from '../columnList';
import { getDomainCardWidgetsCopy } from '../domain-card-widgets-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('domain card widget localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getDomainCardWidgetsCopy('zh-hant');

    expect(copy.localeOptions).toMatchObject({
      ko: '韓文',
      'zh-hant': '繁體中文',
      en: '英文',
    });
    expect(copy.columnCard).toMatchObject({
      empty: '專欄卡片',
      inspector: {
        locale: '語言',
        cardVariant: '卡片變體',
        titleOverride: '標題（覆寫）',
      },
    });
    expect(copy.columnList.inspector.limit(6)).toBe('顯示數量 (6)');
    expect(copy.attorneyCard).toMatchObject({
      empty: '律師卡片',
      inspector: {
        name: '姓名',
        specialties: '專長（以逗號分隔）',
      },
    });
    expect(copy.columnCard.inspector.cardVariants.glass).toBe('玻璃');
  });

  it('renders localized column card and column list placeholders and inspectors in zh-hant', () => {
    const ColumnCardRender = columnCardComponent.Render as React.ComponentType<{
      node: BuilderColumnCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const ColumnCardInspector = columnCardComponent.Inspector as React.ComponentType<{
      node: BuilderColumnCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const ColumnListRender = columnListComponent.Render as React.ComponentType<{
      node: BuilderColumnListCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const ColumnListInspector = columnListComponent.Inspector as React.ComponentType<{
      node: BuilderColumnListCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const cardNode = {
      id: 'column-card-1',
      kind: 'columnCard',
      content: {
        slug: '',
        locale: 'zh-hant',
        title: '',
        date: '',
        summary: '',
        variant: 'glass',
      },
    } as unknown as BuilderColumnCardCanvasNode;
    const listNode = {
      id: 'column-list-1',
      kind: 'columnList',
      content: {
        locale: 'zh-hant',
        limit: 3,
        category: '',
        items: [],
      },
    } as unknown as BuilderColumnListCanvasNode;

    const cardRenderHtml = renderToStaticMarkup(<ColumnCardRender node={cardNode} locale="zh-hant" />);
    expect(cardRenderHtml).toContain('專欄卡片');
    expect(cardRenderHtml).not.toContain('Column Card');

    const cardInspectorHtml = renderToStaticMarkup(
      <ColumnCardInspector node={cardNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(cardInspectorHtml).toContain('語言');
    expect(cardInspectorHtml).toContain('英文');
    expect(cardInspectorHtml).toContain('卡片變體');
    expect(cardInspectorHtml).toContain('玻璃');
    expect(cardInspectorHtml).toContain('標題（覆寫）');
    expect(cardInspectorHtml).toContain('摘要');
    expect(cardInspectorHtml).toContain('data-builder-column-card-inspector="true"');
    expect(cardInspectorHtml).not.toContain('Card variant');

    const listRenderHtml = renderToStaticMarkup(<ColumnListRender node={listNode} locale="zh-hant" />);
    expect(listRenderHtml).toContain('專欄');
    expect(listRenderHtml).not.toContain('Column');

    const listInspectorHtml = renderToStaticMarkup(
      <ColumnListInspector node={listNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(listInspectorHtml).toContain('data-builder-column-list-inspector="true"');
    expect(listInspectorHtml).toContain('語言');
    expect(listInspectorHtml).toContain('顯示數量 (3)');
    expect(listInspectorHtml).toContain('分類篩選（選填）');
    expect(listInspectorHtml).toContain('items 陣列會依語言與分類自動填入。');
    expect(listInspectorHtml).not.toContain('Limit (3)');
    expect(listInspectorHtml).not.toContain('Category 필터');
  });

  it('keeps the column list inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'columnList/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'columnList/ColumnListInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './ColumnListInspector.module.css';");
    expect(source).toContain('data-builder-column-list-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.range}',
      'className={styles.hint}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'fieldStyle',
      'labelStyle',
      'inputStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.range');
    expect(css).toContain('.hint');
    expect(css).toContain('.control:focus-visible');
  });

  it('keeps the column card inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'columnCard/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'columnCard/ColumnCardInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './ColumnCardInspector.module.css';");
    expect(source).toContain('data-builder-column-card-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'fieldStyle',
      'labelStyle',
      'inputStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
  });

  it('renders localized attorney card placeholder and inspector in zh-hant', () => {
    const Render = attorneyCardComponent.Render as React.ComponentType<{
      node: BuilderAttorneyCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = attorneyCardComponent.Inspector as React.ComponentType<{
      node: BuilderAttorneyCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      id: 'attorney-card-1',
      kind: 'attorneyCard',
      content: {
        name: '',
        title: '',
        photo: '',
        specialties: [],
        variant: 'elevated',
      },
    } as unknown as BuilderAttorneyCardCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" />);
    expect(renderHtml).toContain('律師卡片');
    expect(renderHtml).not.toContain('Attorney Card');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('姓名');
    expect(inspectorHtml).toContain('職稱');
    expect(inspectorHtml).toContain('卡片變體');
    expect(inspectorHtml).toContain('浮起');
    expect(inspectorHtml).toContain('照片 URL');
    expect(inspectorHtml).toContain('專長（以逗號分隔）');
    expect(inspectorHtml).toContain('placeholder="公司法、勞動法、刑事"');
    expect(inspectorHtml).toContain('data-builder-attorney-card-inspector="true"');
    expect(inspectorHtml).not.toContain('Card variant');
    expect(inspectorHtml).not.toContain('전문 분야');
  });

  it('keeps the attorney card inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'attorneyCard/Inspector.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'attorneyCard/AttorneyCardInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './AttorneyCardInspector.module.css';");
    expect(source).toContain('data-builder-attorney-card-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.assetRow}',
      'className={`${styles.control} ${styles.assetInput}`}',
      'className={styles.assetButton}',
      'aria-label={copy.photoUrl}',
    ]) {
      expect(source).toContain(classUsage);
    }
    for (const removedPattern of [
      'React.CSSProperties',
      'fieldStyle',
      'labelStyle',
      'inputStyle',
      'style={{',
    ]) {
      expect(source).not.toContain(removedPattern);
    }
    expect(css).toContain('.assetRow');
    expect(css).toContain('.assetButton:focus-visible');
    expect(css).toContain('.control:focus-visible');
  });
});
