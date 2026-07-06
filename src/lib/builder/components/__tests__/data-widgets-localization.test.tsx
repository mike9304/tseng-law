import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderBarChartCanvasNode,
  BuilderCounterCanvasNode,
  BuilderLineChartCanvasNode,
  BuilderPieChartCanvasNode,
} from '@/lib/builder/canvas/types';
import barChartComponent from '../barChart';
import counterComponent from '../counter';
import {
  DATA_WIDGETS_LEGACY_DEFAULTS,
  getDataWidgetsCopy,
  localizedDataWidgetPoints,
  localizedDataWidgetSlices,
  localizedDataWidgetText,
} from '../data-widgets-copy';
import lineChartComponent from '../lineChart';
import pieChartComponent from '../pieChart';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('data widgets localization', () => {
  it('returns localized chart and counter copy in zh-hant', () => {
    const copy = getDataWidgetsCopy('zh-hant');

    expect(copy.chart.barAria).toBe('長條圖');
    expect(copy.chart.lineAria).toBe('折線圖');
    expect(copy.chart.pieAria).toBe('圓餅圖');
    expect(copy.chart.empty).toBe('沒有資料');
    expect(copy.chart.defaults.barTitle).toBe('每月諮詢件數');
    expect(copy.chart.defaults.barPoints[0]).toMatchObject({ label: '1月', value: 32 });
    expect(copy.chart.defaults.pieSlices[0]).toMatchObject({ label: '企業', value: 38 });
    expect(copy.counter.defaultTitle).toBe('累積諮詢');
    expect(copy.counter.defaultSuffix).toBe('+ 件');
    expect(copy.chart.inspector.showValueLabels).toBe('顯示數值標籤');
    expect(copy.counter.inspector.prefixPlaceholder).toBe('前綴');
  });

  it('renders localized bar, line, and pie chart chrome in zh-hant', () => {
    const BarRender = barChartComponent.Render as React.ComponentType<{
      node: BuilderBarChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const BarInspector = barChartComponent.Inspector as React.ComponentType<{
      node: BuilderBarChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const LineRender = lineChartComponent.Render as React.ComponentType<{
      node: BuilderLineChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const LineInspector = lineChartComponent.Inspector as React.ComponentType<{
      node: BuilderLineChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const PieRender = pieChartComponent.Render as React.ComponentType<{
      node: BuilderPieChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const PieInspector = pieChartComponent.Inspector as React.ComponentType<{
      node: BuilderPieChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const barNode = {
      kind: 'bar-chart',
      content: {
        title: '',
        points: [{ label: 'A', value: 10 }],
        color: '#1d4ed8',
        showValueLabel: true,
      },
    } as unknown as BuilderBarChartCanvasNode;
    const lineNode = {
      kind: 'line-chart',
      content: {
        title: '',
        points: [],
        color: '#0ea5e9',
        smooth: true,
        showPoints: true,
      },
    } as unknown as BuilderLineChartCanvasNode;
    const pieNode = {
      kind: 'pie-chart',
      content: {
        title: '',
        slices: [{ label: 'A', value: 10 }],
        showLegend: true,
        donut: false,
      },
    } as unknown as BuilderPieChartCanvasNode;

    expect(renderToStaticMarkup(<BarRender node={barNode} locale="zh-hant" />)).toContain('aria-label="長條圖"');
    expect(renderToStaticMarkup(<LineRender node={lineNode} locale="zh-hant" />)).toContain('沒有資料');
    expect(renderToStaticMarkup(<PieRender node={pieNode} locale="zh-hant" />)).toContain('aria-label="圓餅圖"');

    const barInspectorHtml = renderToStaticMarkup(<BarInspector node={barNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(barInspectorHtml).toContain('data-builder-data-widget-inspector="bar-chart"');
    expect(barInspectorHtml).toContain('資料（label | value）');
    expect(barInspectorHtml).toContain('顯示數值標籤');

    const lineInspectorHtml = renderToStaticMarkup(<LineInspector node={lineNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(lineInspectorHtml).toContain('data-builder-data-widget-inspector="line-chart"');
    expect(lineInspectorHtml).toContain('平滑曲線');
    expect(lineInspectorHtml).toContain('顯示節點');

    const pieInspectorHtml = renderToStaticMarkup(<PieInspector node={pieNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(pieInspectorHtml).toContain('data-builder-data-widget-inspector="pie-chart"');
    expect(pieInspectorHtml).toContain('切片（label | value | color）');
    expect(pieInspectorHtml).toContain('顯示圖例');
    expect(pieInspectorHtml).toContain('甜甜圈樣式');
  });

  it('renders localized counter inspector chrome in zh-hant', () => {
    const Inspector = counterComponent.Inspector as React.ComponentType<{
      node: BuilderCounterCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'counter',
      content: {
        title: '累積諮詢',
        suffix: '+',
        prefix: '',
        target: 1248,
        durationMs: 1500,
        decimals: 0,
      },
    } as unknown as BuilderCounterCanvasNode;

    const html = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(html).toContain('data-builder-data-widget-inspector="counter"');
    expect(html).toContain('標題');
    expect(html).toContain('目標值');
    expect(html).toContain('前綴 / 後綴');
    expect(html).toContain('placeholder="前綴"');
    expect(html).toContain('placeholder="後綴"');
    expect(html).toContain('小數位數');
    expect(html).toContain('動畫 (ms)');
  });

  it('localizes legacy default chart and counter content in zh-hant without changing custom content', () => {
    const BarRender = barChartComponent.Render as React.ComponentType<{
      node: BuilderBarChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const BarInspector = barChartComponent.Inspector as React.ComponentType<{
      node: BuilderBarChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const LineRender = lineChartComponent.Render as React.ComponentType<{
      node: BuilderLineChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const PieRender = pieChartComponent.Render as React.ComponentType<{
      node: BuilderPieChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const PieInspector = pieChartComponent.Inspector as React.ComponentType<{
      node: BuilderPieChartCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const CounterRender = counterComponent.Render as React.ComponentType<{
      node: BuilderCounterCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const CounterInspector = counterComponent.Inspector as React.ComponentType<{
      node: BuilderCounterCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const zhCopy = getDataWidgetsCopy('zh-hant');
    const legacyBarNode = {
      kind: 'bar-chart',
      content: {
        title: DATA_WIDGETS_LEGACY_DEFAULTS.barTitle,
        points: DATA_WIDGETS_LEGACY_DEFAULTS.barPoints.map((point) => ({ ...point })),
        color: '#1d4ed8',
        showValueLabel: true,
      },
    } as unknown as BuilderBarChartCanvasNode;
    const customBarNode = {
      ...legacyBarNode,
      content: {
        ...legacyBarNode.content,
        title: 'Custom monthly data',
        points: [{ label: 'Custom', value: 7 }],
      },
    } as BuilderBarChartCanvasNode;
    const legacyLineNode = {
      kind: 'line-chart',
      content: {
        title: DATA_WIDGETS_LEGACY_DEFAULTS.lineTitle,
        points: DATA_WIDGETS_LEGACY_DEFAULTS.linePoints.map((point) => ({ ...point })),
        color: '#0ea5e9',
        smooth: true,
        showPoints: true,
      },
    } as unknown as BuilderLineChartCanvasNode;
    const legacyPieNode = {
      kind: 'pie-chart',
      content: {
        title: DATA_WIDGETS_LEGACY_DEFAULTS.pieTitle,
        slices: DATA_WIDGETS_LEGACY_DEFAULTS.pieSlices.map((slice) => ({ ...slice })),
        showLegend: true,
        donut: false,
      },
    } as unknown as BuilderPieChartCanvasNode;
    const customPieNode = {
      ...legacyPieNode,
      content: {
        ...legacyPieNode.content,
        slices: [{ label: 'Custom area', value: 100 }],
      },
    } as BuilderPieChartCanvasNode;
    const legacyCounterNode = {
      kind: 'counter',
      content: {
        title: DATA_WIDGETS_LEGACY_DEFAULTS.counterTitle,
        suffix: DATA_WIDGETS_LEGACY_DEFAULTS.counterSuffix,
        prefix: '',
        target: 1248,
        durationMs: 1500,
        decimals: 0,
      },
    } as unknown as BuilderCounterCanvasNode;

    expect(localizedDataWidgetText(legacyBarNode.content.title, zhCopy.chart.defaults.barTitle, DATA_WIDGETS_LEGACY_DEFAULTS.barTitle)).toBe('每月諮詢件數');
    expect(localizedDataWidgetPoints(legacyBarNode.content.points, zhCopy.chart.defaults.barPoints, DATA_WIDGETS_LEGACY_DEFAULTS.barPoints)[0]?.label).toBe('1月');
    expect(localizedDataWidgetSlices(legacyPieNode.content.slices, zhCopy.chart.defaults.pieSlices)[0]?.label).toBe('企業');
    expect(localizedDataWidgetPoints(customBarNode.content.points, zhCopy.chart.defaults.barPoints, DATA_WIDGETS_LEGACY_DEFAULTS.barPoints)[0]?.label).toBe('Custom');

    const barHtml = renderToStaticMarkup(<BarRender node={legacyBarNode} locale="zh-hant" />);
    expect(barHtml).toContain('每月諮詢件數');
    expect(barHtml).toContain('1月');
    expect(barHtml).not.toContain('월별 자문 건수');
    expect(barHtml).not.toContain('Jan');

    const barInspectorHtml = renderToStaticMarkup(<BarInspector node={legacyBarNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(barInspectorHtml).toContain('value="每月諮詢件數"');
    expect(barInspectorHtml).toContain('1月 | 32');

    const lineHtml = renderToStaticMarkup(<LineRender node={legacyLineNode} locale="zh-hant" />);
    expect(lineHtml).toContain('年度諮詢趨勢');
    expect(lineHtml).not.toContain('연간 자문 추세');

    const pieHtml = renderToStaticMarkup(<PieRender node={legacyPieNode} locale="zh-hant" />);
    expect(pieHtml).toContain('各領域諮詢');
    expect(pieHtml).toContain('移民');
    expect(pieHtml).not.toContain('분야별 자문');
    expect(pieHtml).not.toContain('이민');

    const pieInspectorHtml = renderToStaticMarkup(<PieInspector node={legacyPieNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(pieInspectorHtml).toContain('企業 | 38 |');
    expect(pieInspectorHtml).not.toContain('기업');

    const counterHtml = renderToStaticMarkup(<CounterRender node={legacyCounterNode} locale="zh-hant" mode="edit" />);
    expect(counterHtml).toContain('累積諮詢');
    expect(counterHtml).toContain('1,248+ 件');
    expect(counterHtml).not.toContain('누적 자문');
    expect(counterHtml).not.toContain('+ 건');

    const counterInspectorHtml = renderToStaticMarkup(<CounterInspector node={legacyCounterNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(counterInspectorHtml).toContain('value="累積諮詢"');
    expect(counterInspectorHtml).toContain('value="+ 件"');

    const customBarHtml = renderToStaticMarkup(<BarRender node={customBarNode} locale="zh-hant" />);
    expect(customBarHtml).toContain('Custom monthly data');
    expect(customBarHtml).toContain('Custom');
    expect(customBarHtml).not.toContain('每月諮詢件數');

    const customPieHtml = renderToStaticMarkup(<PieRender node={customPieNode} locale="zh-hant" />);
    expect(customPieHtml).toContain('Custom area');
    expect(customPieHtml).not.toContain('企業');
  });

  it('keeps data widget inspectors on shared CSS-module chrome', () => {
    const css = readFileSync(join(componentRoot, 'DataWidgetInspector.module.css'), 'utf8');
    const sources = [
      readFileSync(join(componentRoot, 'barChart/index.tsx'), 'utf8'),
      readFileSync(join(componentRoot, 'lineChart/index.tsx'), 'utf8'),
      readFileSync(join(componentRoot, 'pieChart/index.tsx'), 'utf8'),
      readFileSync(join(componentRoot, 'counter/index.tsx'), 'utf8'),
    ];

    for (const source of sources) {
      expect(source).toContain("import styles from '../DataWidgetInspector.module.css';");
      expect(source).toContain('data-builder-data-widget-inspector=');
      expect(source).toContain('className={styles.root}');
      expect(source).toContain('className={styles.field}');
      expect(source).toContain('className={styles.label}');
      expect(source).toContain('className={styles.control}');
      expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 6 }}");
      expect(source).not.toContain("style={{ fontFamily: 'inherit', resize: 'vertical' }}");
    }

    expect(sources[3]).toContain('className={styles.inlineFields}');
    for (const source of sources.slice(0, 3)) {
      expect(source).toContain('className={`${styles.control} ${styles.textarea}`}');
    }
    for (const source of sources.slice(0, 3)) {
      expect(source).toContain('className={styles.checkboxRow}');
    }
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.textarea');
    expect(css).toContain('.inlineFields');
    expect(css).toContain('.checkboxRow');
  });
});
