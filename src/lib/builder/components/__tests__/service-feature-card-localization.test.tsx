import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderServiceFeatureCardCanvasNode } from '@/lib/builder/canvas/types';
import serviceFeatureCardComponent from '../serviceFeatureCard';
import {
  getServiceFeatureCardCopy,
  SERVICE_FEATURE_CARD_LEGACY_DEFAULTS,
} from '../serviceFeatureCard/service-feature-card-copy';

const componentRoot = join(process.cwd(), 'src/lib/builder/components');

describe('service feature card localization', () => {
  it('returns localized service feature card inspector copy in zh-hant', () => {
    const copy = getServiceFeatureCardCopy('zh-hant');

    expect(copy.defaults).toMatchObject({
      title: '企業顧問',
      description: '從公司設立到爭議解決，依韓台兩地標準進行檢視。',
      ctaLabel: '了解更多',
      ctaHref: '/zh-hant/services/corporate',
    });
    expect(copy.inspector.icon).toBe('圖示');
    expect(copy.inspector.title).toBe('標題');
    expect(copy.inspector.description).toBe('描述');
    expect(copy.inspector.ctaLabel).toBe('CTA 標籤');
    expect(copy.inspector.ctaHref).toBe('CTA 連結');
    expect(copy.inspector.variant).toBe('樣式');
    expect(copy.inspector.variants.minimal).toBe('極簡');
    expect(copy.inspector.variants.card).toBe('卡片');
    expect(copy.inspector.variants.gradient).toBe('漸層');
  });

  it('seeds default content from service feature card legacy defaults', () => {
    expect(serviceFeatureCardComponent.defaultContent).toMatchObject({
      title: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.title,
      description: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.description,
      ctaLabel: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaLabel,
      ctaHref: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaHref,
    });
  });

  it('renders localized inspector chrome in zh-hant', () => {
    const Inspector = serviceFeatureCardComponent.Inspector as React.ComponentType<{
      node: BuilderServiceFeatureCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'service-feature-card',
      content: {
        icon: '*',
        title: '企業顧問',
        description: '服務描述',
        ctaLabel: '了解更多',
        ctaHref: '/zh-hant/services/corporate',
        variant: 'card',
      },
    } as unknown as BuilderServiceFeatureCardCanvasNode;

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-service-feature-card-inspector="true"');
    expect(inspectorHtml).toContain('圖示');
    expect(inspectorHtml).toContain('標題');
    expect(inspectorHtml).toContain('描述');
    expect(inspectorHtml).toContain('CTA 標籤');
    expect(inspectorHtml).toContain('CTA 連結');
    expect(inspectorHtml).toContain('樣式');
    expect(inspectorHtml).toContain('極簡');
    expect(inspectorHtml).toContain('卡片');
    expect(inspectorHtml).toContain('漸層');
  });

  it('localizes legacy default service card content in zh-hant', () => {
    const Render = serviceFeatureCardComponent.Render as React.ComponentType<{
      node: BuilderServiceFeatureCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = serviceFeatureCardComponent.Inspector as React.ComponentType<{
      node: BuilderServiceFeatureCardCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      kind: 'service-feature-card',
      content: {
        icon: '*',
        title: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.title,
        description: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.description,
        ctaLabel: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaLabel,
        ctaHref: SERVICE_FEATURE_CARD_LEGACY_DEFAULTS.ctaHref,
        variant: 'card',
      },
    } as unknown as BuilderServiceFeatureCardCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="edit" />);
    expect(renderHtml).toContain('企業顧問');
    expect(renderHtml).toContain('從公司設立到爭議解決');
    expect(renderHtml).toContain('了解更多');
    expect(renderHtml).toContain('/zh-hant/services/corporate');
    expect(renderHtml).not.toContain('기업 자문');
    expect(renderHtml).not.toContain('자세히');

    const inspectorHtml = renderToStaticMarkup(<Inspector node={node} locale="zh-hant" onUpdate={() => undefined} />);
    expect(inspectorHtml).toContain('data-builder-service-feature-card-inspector="true"');
    expect(inspectorHtml).toContain('企業顧問');
    expect(inspectorHtml).toContain('了解更多');
    expect(inspectorHtml).toContain('/zh-hant/services/corporate');
  });

  it('keeps the service feature card inspector on CSS-module chrome', () => {
    const source = readFileSync(join(componentRoot, 'serviceFeatureCard/index.tsx'), 'utf8');
    const css = readFileSync(
      join(componentRoot, 'serviceFeatureCard/ServiceFeatureCardInspector.module.css'),
      'utf8',
    );

    expect(source).toContain("import styles from './ServiceFeatureCardInspector.module.css';");
    expect(source).toContain('data-builder-service-feature-card-inspector="true"');
    for (const classUsage of [
      'className={styles.root}',
      'className={styles.field}',
      'className={styles.label}',
      'className={styles.control}',
      'className={`${styles.control} ${styles.textarea}`}',
    ]) {
      expect(source).toContain(classUsage);
    }
    expect(css).toContain('.textarea');
    expect(css).toContain('.control:focus-visible');
  });
});
