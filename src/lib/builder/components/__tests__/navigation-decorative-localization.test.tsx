import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderBreadcrumbsCanvasNode,
  BuilderPatternCanvasNode,
  BuilderTimelineCanvasNode,
} from '@/lib/builder/canvas/types';
import breadcrumbsComponent from '../breadcrumbs';
import {
  BREADCRUMBS_LEGACY_DEFAULTS,
  getNavigationDecorativeCopy,
  TIMELINE_LEGACY_DEFAULT_ITEMS,
  localizedTimelineItems,
} from '../navigation-decorative-copy';
import patternComponent from '../pattern';
import timelineComponent from '../timeline';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('navigation and decorative widget localization', () => {
  it('returns localized breadcrumbs, timeline, and pattern copy in zh-hant', () => {
    const copy = getNavigationDecorativeCopy('zh-hant');

    expect(copy.breadcrumbs.navLabel).toBe('麵包屑');
    expect(copy.breadcrumbs.defaultHomeLabel).toBe('首頁');
    expect(copy.breadcrumbs.defaultItems[0]).toMatchObject({ label: '服務', href: '/zh-hant/services' });
    expect(copy.breadcrumbs.inspector.items).toBe('項目（label | href）');
    expect(copy.breadcrumbs.inspector.separators.chevron).toBe('›（箭頭）');
    expect(copy.timeline.empty).toBe('請在檢查器新增時間軸項目');
    expect(copy.timeline.defaultItems[0]).toMatchObject({
      year: '2018',
      title: '浩正國際成立',
      description: '首爾與台北同步開設據點',
    });
    expect(copy.timeline.inspector.orientations.horizontal).toBe('水平');
    expect(copy.pattern.inspector.patterns.checkerboard).toBe('棋盤格');
    expect(copy.pattern.inspector.foregroundColor).toBe('前景色');
  });

  it('renders localized breadcrumbs runtime and inspector chrome in zh-hant', () => {
    const Render = breadcrumbsComponent.Render as React.ComponentType<{
      node: BuilderBreadcrumbsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = breadcrumbsComponent.Inspector as React.ComponentType<{
      node: BuilderBreadcrumbsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'breadcrumbs',
      content: {
        items: [{ label: '服務', href: '/zh-hant/services' }, { label: '企業顧問' }],
        separator: 'chevron',
        showHome: true,
        homeLabel: '首頁',
        homeHref: '/zh-hant',
      },
    } as unknown as BuilderBreadcrumbsCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" />);
    expect(renderHtml).toContain('aria-label="麵包屑"');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-breadcrumbs-inspector="true"');
    expect(inspectorHtml).toContain('項目（label | href）');
    expect(inspectorHtml).toContain('分隔符');
    expect(inspectorHtml).toContain('›（箭頭）');
    expect(inspectorHtml).toContain('/（斜線）');
    expect(inspectorHtml).toContain('顯示首頁');
    expect(inspectorHtml).toContain('首頁標籤');
    expect(inspectorHtml).toContain('首頁連結');
  });

  it('localizes legacy default breadcrumbs in zh-hant without changing custom breadcrumbs', () => {
    const Render = breadcrumbsComponent.Render as React.ComponentType<{
      node: BuilderBreadcrumbsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = breadcrumbsComponent.Inspector as React.ComponentType<{
      node: BuilderBreadcrumbsCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      kind: 'breadcrumbs',
      content: {
        items: [...BREADCRUMBS_LEGACY_DEFAULTS.items],
        separator: 'chevron',
        showHome: true,
        homeLabel: BREADCRUMBS_LEGACY_DEFAULTS.homeLabel,
        homeHref: BREADCRUMBS_LEGACY_DEFAULTS.homeHref,
      },
    } as unknown as BuilderBreadcrumbsCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        items: [{ label: 'Custom service', href: '/custom/service' }, { label: 'Custom child' }],
        homeLabel: 'Start',
        homeHref: '/start',
      },
    } as BuilderBreadcrumbsCanvasNode;

    const legacyHtml = renderToStaticMarkup(<Render node={legacyNode} locale="zh-hant" />);
    expect(legacyHtml).toContain('首頁');
    expect(legacyHtml).toContain('服務');
    expect(legacyHtml).toContain('企業顧問');
    expect(legacyHtml).toContain('href="/zh-hant/services"');
    expect(legacyHtml).not.toContain('서비스');
    expect(legacyHtml).not.toContain('/ko/services');

    const legacyInspectorHtml = renderToStaticMarkup(<Inspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(legacyInspectorHtml).toContain('服務 | /zh-hant/services');
    expect(legacyInspectorHtml).toContain('企業顧問 |');
    expect(legacyInspectorHtml).toContain('value="首頁"');
    expect(legacyInspectorHtml).toContain('value="/zh-hant"');

    const customHtml = renderToStaticMarkup(<Render node={customNode} locale="zh-hant" />);
    expect(customHtml).toContain('Start');
    expect(customHtml).toContain('Custom service');
    expect(customHtml).toContain('href="/custom/service"');
    expect(customHtml).not.toContain('企業顧問');
  });

  it('keeps the breadcrumbs inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'breadcrumbs/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'breadcrumbs/BreadcrumbsInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './BreadcrumbsInspector.module.css';");
    expect(source).toContain('data-builder-breadcrumbs-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ fontFamily: 'inherit', resize: 'vertical' }}");
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 6 }}");
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
  });

  it('renders localized timeline empty state and inspector chrome in zh-hant', () => {
    const Render = timelineComponent.Render as React.ComponentType<{
      node: BuilderTimelineCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = timelineComponent.Inspector as React.ComponentType<{
      node: BuilderTimelineCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'timeline',
      content: {
        items: [],
        orientation: 'vertical',
        accentColor: '#0f172a',
      },
    } as unknown as BuilderTimelineCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" />);
    expect(renderHtml).toContain('請在檢查器新增時間軸項目');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-timeline-inspector="true"');
    expect(inspectorHtml).toContain('方向');
    expect(inspectorHtml).toContain('垂直');
    expect(inspectorHtml).toContain('水平');
    expect(inspectorHtml).toContain('強調色');
    expect(inspectorHtml).toContain('項目（year | title | description）');
  });

  it('localizes legacy default timeline items in zh-hant without changing custom timeline items', () => {
    const Render = timelineComponent.Render as React.ComponentType<{
      node: BuilderTimelineCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = timelineComponent.Inspector as React.ComponentType<{
      node: BuilderTimelineCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      kind: 'timeline',
      content: {
        items: TIMELINE_LEGACY_DEFAULT_ITEMS.map((item) => ({ ...item })),
        orientation: 'vertical',
        accentColor: '#0f172a',
      },
    } as unknown as BuilderTimelineCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        items: [
          { year: '2026', title: 'Custom launch', description: 'Custom note' },
        ],
      },
    } as BuilderTimelineCanvasNode;
    const zhCopy = getNavigationDecorativeCopy('zh-hant');

    expect(localizedTimelineItems(legacyNode.content.items, zhCopy.timeline)[0]?.title).toBe('浩正國際成立');
    expect(localizedTimelineItems(customNode.content.items, zhCopy.timeline)[0]?.title).toBe('Custom launch');

    const legacyHtml = renderToStaticMarkup(<Render node={legacyNode} locale="zh-hant" />);
    expect(legacyHtml).toContain('浩正國際成立');
    expect(legacyHtml).toContain('首爾與台北同步開設據點');
    expect(legacyHtml).toContain('台灣律師合作夥伴');
    expect(legacyHtml).not.toContain('호정국제 설립');
    expect(legacyHtml).not.toContain('서울·타이베이 동시 개소');

    const legacyInspectorHtml = renderToStaticMarkup(<Inspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(legacyInspectorHtml).toContain('2018 | 浩正國際成立 | 首爾與台北同步開設據點');
    expect(legacyInspectorHtml).toContain('2025 | 韓台雙邊顧問 100% 數位化 |');
    expect(legacyInspectorHtml).not.toContain('호정국제 설립');

    const customHtml = renderToStaticMarkup(<Render node={customNode} locale="zh-hant" />);
    expect(customHtml).toContain('Custom launch');
    expect(customHtml).not.toContain('浩正國際成立');
  });

  it('keeps the timeline inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'timeline/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'timeline/TimelineInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './TimelineInspector.module.css';");
    expect(source).toContain('data-builder-timeline-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ fontFamily: 'inherit', resize: 'vertical' }}");
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
  });

  it('renders localized pattern inspector chrome in zh-hant', () => {
    const Inspector = patternComponent.Inspector as React.ComponentType<{
      node: BuilderPatternCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'pattern',
      content: {
        pattern: 'checkerboard',
        color: '#cbd5e1',
        background: '#f8fafc',
        scale: 24,
      },
    } as unknown as BuilderPatternCanvasNode;

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('圖案');
    expect(inspectorHtml).toContain('圓點');
    expect(inspectorHtml).toContain('格線');
    expect(inspectorHtml).toContain('斜線');
    expect(inspectorHtml).toContain('條紋');
    expect(inspectorHtml).toContain('棋盤格');
    expect(inspectorHtml).toContain('前景色');
    expect(inspectorHtml).toContain('背景色');
    expect(inspectorHtml).toContain('縮放 (px)');
  });
});
