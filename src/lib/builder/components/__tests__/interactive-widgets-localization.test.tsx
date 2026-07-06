import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderBackToTopCanvasNode,
  BuilderCountdownCanvasNode,
  BuilderProgressCanvasNode,
  BuilderRatingCanvasNode,
} from '@/lib/builder/canvas/types';
import backToTopComponent from '../backToTop';
import countdownComponent from '../countdown';
import {
  getInteractiveWidgetsCopy,
  INTERACTIVE_WIDGETS_LEGACY_DEFAULTS,
  localizedInteractiveWidgetText,
} from '../interactive-widgets-copy';
import progressComponent from '../progress';
import ratingComponent from '../rating';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('interactive widget localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getInteractiveWidgetsCopy('zh-hant');

    expect(copy.countdown.segments).toMatchObject({
      days: '天',
      hours: '時',
      minutes: '分',
      seconds: '秒',
    });
    expect(copy.countdown.inspector.variantOptions).toMatchObject({
      card: '卡片',
      compact: '精簡',
      inline: '行內',
    });
    expect(copy.countdown.defaultLabel).toBe('倒數計時');
    expect(copy.countdown.defaultExpiredText).toBe('已截止');
    expect(copy.backToTop.defaultLabel).toBe('回到頂端');
    expect(copy.progress.defaultLabel).toBe('進度');
    expect(copy.rating.defaultLabel).toBe('評分');
    expect(copy.backToTop.inspector.placementOptions['bottom-center']).toBe('底部置中');
    expect(copy.progress.ariaLabel('完成度', 72)).toBe('完成度：72%');
    expect(copy.rating.ariaLabel(4.5, 5)).toBe('評分 4.5 / 5');
  });

  it('renders localized countdown and back-to-top inspector labels in zh-hant', () => {
    const CountdownInspector = countdownComponent.Inspector as React.ComponentType<{
      node: BuilderCountdownCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const BackToTopInspector = backToTopComponent.Inspector as React.ComponentType<{
      node: BuilderBackToTopCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const countdownNode = {
      id: 'countdown-1',
      kind: 'countdown',
      content: {
        targetAt: '2030-01-01T00:00:00.000Z',
        label: '倒數',
        expiredText: '已結束',
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        variant: 'compact',
      },
    } as unknown as BuilderCountdownCanvasNode;
    const backToTopNode = {
      id: 'back-to-top-1',
      kind: 'back-to-top',
      content: {
        label: '回到頂端',
        showAfterPx: 400,
        icon: 'rocket',
        placement: 'bottom-center',
        variant: 'pill',
      },
    } as unknown as BuilderBackToTopCanvasNode;

    const countdownHtml = renderToStaticMarkup(
      <CountdownInspector node={countdownNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(countdownHtml).toContain('data-builder-countdown-inspector="true"');
    expect(countdownHtml).toContain('目標時間 (ISO)');
    expect(countdownHtml).toContain('結束文字');
    expect(countdownHtml).toContain('顯示秒數');
    expect(countdownHtml).toContain('精簡');

    const backToTopHtml = renderToStaticMarkup(
      <BackToTopInspector node={backToTopNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(backToTopHtml).toContain('顯示起點 (px)');
    expect(backToTopHtml).toContain('圖示');
    expect(backToTopHtml).toContain('底部置中');
    expect(backToTopHtml).toContain('膠囊');
  });

  it('keeps the countdown inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'countdown/index.tsx'), 'utf8');
    const css = readFileSync(join(componentRoot, 'countdown/CountdownInspector.module.css'), 'utf8');

    expect(source).toContain("import styles from './CountdownInspector.module.css';");
    expect(source).toContain('data-builder-countdown-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={styles.checkboxRow}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 6 }}");
    expect(css).toContain('.control:focus-visible');
    expect(css).toContain('.checkboxRow');
  });

  it('renders localized progress and rating labels plus accessible names in zh-hant', () => {
    const ProgressRender = progressComponent.Render as React.ComponentType<{
      node: BuilderProgressCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const ProgressInspector = progressComponent.Inspector as React.ComponentType<{
      node: BuilderProgressCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const RatingRender = ratingComponent.Render as React.ComponentType<{
      node: BuilderRatingCanvasNode;
      mode?: 'edit' | 'preview' | 'published';
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const RatingInspector = ratingComponent.Inspector as React.ComponentType<{
      node: BuilderRatingCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;

    const progressNode = {
      id: 'progress-1',
      kind: 'progress',
      content: {
        label: '完成度',
        value: 72,
        showPercent: true,
        variant: 'ring',
        color: '#1d4ed8',
        trackColor: '#e2e8f0',
      },
    } as unknown as BuilderProgressCanvasNode;
    const ratingNode = {
      id: 'rating-1',
      kind: 'rating',
      content: {
        label: '評分',
        value: 4.5,
        max: 5,
        showValue: true,
        color: '#f59e0b',
        variant: 'hearts',
      },
    } as unknown as BuilderRatingCanvasNode;

    const progressHtml = renderToStaticMarkup(
      <ProgressRender node={progressNode} mode="preview" locale="zh-hant" />,
    );
    expect(progressHtml).toContain('aria-label="完成度：72%"');

    const progressInspectorHtml = renderToStaticMarkup(
      <ProgressInspector node={progressNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(progressInspectorHtml).toContain('data-builder-progress-inspector="true"');
    expect(progressInspectorHtml).toContain('數值 (0-100)');
    expect(progressInspectorHtml).toContain('前景色');
    expect(progressInspectorHtml).toContain('顯示百分比');
    expect(progressInspectorHtml).toContain('圓環');

    const ratingHtml = renderToStaticMarkup(
      <RatingRender node={ratingNode} mode="preview" locale="zh-hant" />,
    );
    expect(ratingHtml).toContain('aria-label="評分 4.5 / 5"');

    const ratingInspectorHtml = renderToStaticMarkup(
      <RatingInspector node={ratingNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(ratingInspectorHtml).toContain('data-builder-rating-inspector="true"');
    expect(ratingInspectorHtml).toContain('最大值');
    expect(ratingInspectorHtml).toContain('顯示數字');
    expect(ratingInspectorHtml).toContain('愛心');
  });

  it('keeps progress and rating inspectors on CSS-module chrome', () => {
    const progressSource = readFileSync(join(componentRoot, 'progress/index.tsx'), 'utf8');
    const progressCss = readFileSync(join(componentRoot, 'progress/ProgressInspector.module.css'), 'utf8');
    const ratingSource = readFileSync(join(componentRoot, 'rating/index.tsx'), 'utf8');
    const ratingCss = readFileSync(join(componentRoot, 'rating/RatingInspector.module.css'), 'utf8');

    expect(progressSource).toContain("import styles from './ProgressInspector.module.css';");
    expect(progressSource).toContain('data-builder-progress-inspector="true"');
    expect(ratingSource).toContain("import styles from './RatingInspector.module.css';");
    expect(ratingSource).toContain('data-builder-rating-inspector="true"');

    for (const source of [progressSource, ratingSource]) {
      for (const classUsage of [
        'className={styles.root}',
        'className={styles.field}',
        'className={styles.label}',
        'className={styles.control}',
        'className={styles.checkboxRow}',
      ]) {
        expect(source).toContain(classUsage);
      }
      expect(source).not.toContain("style={{ display: 'flex', alignItems: 'center', gap: 6 }}");
    }

    expect(progressCss).toContain('.control:focus-visible');
    expect(progressCss).toContain('.checkboxRow');
    expect(ratingCss).toContain('.control:focus-visible');
    expect(ratingCss).toContain('.checkboxRow');
  });

  it('localizes legacy default interactive labels in zh-hant without changing custom labels', () => {
    const CountdownRender = countdownComponent.Render as React.ComponentType<{
      node: BuilderCountdownCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const CountdownInspector = countdownComponent.Inspector as React.ComponentType<{
      node: BuilderCountdownCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const BackToTopRender = backToTopComponent.Render as React.ComponentType<{
      node: BuilderBackToTopCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const ProgressRender = progressComponent.Render as React.ComponentType<{
      node: BuilderProgressCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const RatingRender = ratingComponent.Render as React.ComponentType<{
      node: BuilderRatingCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const zhCopy = getInteractiveWidgetsCopy('zh-hant');
    const legacyCountdownNode = {
      id: 'countdown-legacy',
      kind: 'countdown',
      content: {
        targetAt: '2030-01-01T00:00:00.000Z',
        label: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownLabel,
        expiredText: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownExpiredText,
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        variant: 'card',
      },
    } as unknown as BuilderCountdownCanvasNode;
    const customCountdownNode = {
      ...legacyCountdownNode,
      content: {
        ...legacyCountdownNode.content,
        label: 'Custom countdown',
        expiredText: 'Custom expired',
      },
    } as BuilderCountdownCanvasNode;
    const backToTopNode = {
      id: 'back-to-top-legacy',
      kind: 'back-to-top',
      content: {
        label: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.backToTopLabel,
        showAfterPx: 400,
        icon: 'arrow-up',
        placement: 'bottom-right',
        variant: 'pill',
      },
    } as unknown as BuilderBackToTopCanvasNode;
    const progressNode = {
      id: 'progress-legacy',
      kind: 'progress',
      content: {
        label: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.progressLabel,
        value: 60,
        showPercent: true,
        variant: 'ring',
        color: '#1d4ed8',
        trackColor: '#e2e8f0',
      },
    } as unknown as BuilderProgressCanvasNode;
    const ratingNode = {
      id: 'rating-legacy',
      kind: 'rating',
      content: {
        label: INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.ratingLabel,
        value: 4.5,
        max: 5,
        showValue: true,
        color: '#f59e0b',
        variant: 'stars',
      },
    } as unknown as BuilderRatingCanvasNode;

    expect(localizedInteractiveWidgetText(legacyCountdownNode.content.label, zhCopy.countdown.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownLabel)).toBe('倒數計時');
    expect(localizedInteractiveWidgetText(customCountdownNode.content.label, zhCopy.countdown.defaultLabel, INTERACTIVE_WIDGETS_LEGACY_DEFAULTS.countdownLabel)).toBe('Custom countdown');

    const countdownHtml = renderToStaticMarkup(<CountdownRender node={legacyCountdownNode} locale="zh-hant" mode="edit" />);
    expect(countdownHtml).toContain('倒數計時');
    expect(countdownHtml).toContain('已截止');
    expect(countdownHtml).not.toContain('카운트다운');
    expect(countdownHtml).not.toContain('마감되었습니다');

    const countdownInspectorHtml = renderToStaticMarkup(<CountdownInspector node={legacyCountdownNode} locale="zh-hant" onUpdate={() => undefined} />);
    expect(countdownInspectorHtml).toContain('value="倒數計時"');
    expect(countdownInspectorHtml).toContain('value="已截止"');

    const backToTopHtml = renderToStaticMarkup(<BackToTopRender node={backToTopNode} locale="zh-hant" mode="edit" />);
    expect(backToTopHtml).toContain('aria-label="回到頂端"');
    expect(backToTopHtml).not.toContain('맨 위로');

    const progressHtml = renderToStaticMarkup(<ProgressRender node={progressNode} locale="zh-hant" mode="edit" />);
    expect(progressHtml).toContain('進度');
    expect(progressHtml).toContain('aria-label="進度：60%"');
    expect(progressHtml).not.toContain('진행률');

    const ratingHtml = renderToStaticMarkup(<RatingRender node={ratingNode} locale="zh-hant" mode="edit" />);
    expect(ratingHtml).toContain('評分');
    expect(ratingHtml).not.toContain('별점');

    const customCountdownHtml = renderToStaticMarkup(<CountdownRender node={customCountdownNode} locale="zh-hant" mode="edit" />);
    expect(customCountdownHtml).toContain('Custom countdown');
    expect(customCountdownHtml).toContain('Custom expired');
    expect(customCountdownHtml).not.toContain('倒數計時');
  });
});
