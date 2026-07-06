import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderSiteSearchCanvasNode } from '@/lib/builder/canvas/types';
import siteSearchComponent from '../index';
import {
  SITE_SEARCH_LEGACY_DEFAULTS,
  SITE_SEARCH_SCHEMA_LEGACY_DEFAULTS,
} from '../site-search-copy';

const baseNode = {
  id: 'site-search-1',
  kind: 'site-search',
  rect: { x: 0, y: 0, width: 360, height: 56 },
  content: {
    placeholder: '',
    submitLabel: '',
    showResultsInline: true,
    kinds: [],
    locale: '',
    maxResults: 8,
  },
  style: {},
  locked: false,
  responsive: {},
  children: [],
} as unknown as BuilderSiteSearchCanvasNode;

describe('site search component localization', () => {
  it('renders localized public fallback copy in zh-hant', () => {
    const Render = siteSearchComponent.Render as React.ComponentType<{
      node: BuilderSiteSearchCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const html = renderToStaticMarkup(<Render node={baseNode} locale="zh-hant" />);
    expect(html).toContain('請問我可以怎麼幫您？');
    expect(html).toContain('搜尋');
  });

  it('renders localized inspector labels in zh-hant', () => {
    const Inspector = siteSearchComponent.Inspector as React.ComponentType<{
      node: BuilderSiteSearchCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const html = renderToStaticMarkup(
      <Inspector
        node={baseNode}
        locale="zh-hant"
        onUpdate={() => undefined}
        disabled={false}
      />,
    );
    expect(html).toContain('預留文字');
    expect(html).toContain('搜尋按鈕標籤');
    expect(html).toContain('搜尋範圍');
    expect(html).toContain('最大結果數');
    expect(html).toContain('語系覆寫');
    expect(html).toContain('頁面');
    expect(html).toContain('使用頁面語系');
  });

  it('seeds site search default content from canonical legacy defaults', () => {
    expect(siteSearchComponent.defaultContent).toMatchObject({
      placeholder: SITE_SEARCH_LEGACY_DEFAULTS.placeholder,
      submitLabel: SITE_SEARCH_LEGACY_DEFAULTS.submitLabel,
    });
  });

  it('localizes legacy default search text in zh-hant without changing custom text', () => {
    const Render = siteSearchComponent.Render as React.ComponentType<{
      node: BuilderSiteSearchCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
    }>;
    const Inspector = siteSearchComponent.Inspector as React.ComponentType<{
      node: BuilderSiteSearchCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const legacyNode = {
      ...baseNode,
      content: {
        ...baseNode.content,
        placeholder: SITE_SEARCH_LEGACY_DEFAULTS.placeholder,
        submitLabel: SITE_SEARCH_LEGACY_DEFAULTS.submitLabel,
      },
    } as BuilderSiteSearchCanvasNode;
    const customNode = {
      ...baseNode,
      content: {
        ...baseNode.content,
        placeholder: 'Custom placeholder',
        submitLabel: 'Custom submit',
      },
    } as BuilderSiteSearchCanvasNode;
    const schemaLegacyNode = {
      ...baseNode,
      content: {
        ...baseNode.content,
        placeholder: SITE_SEARCH_SCHEMA_LEGACY_DEFAULTS.placeholder,
        submitLabel: SITE_SEARCH_SCHEMA_LEGACY_DEFAULTS.submitLabel,
      },
    } as BuilderSiteSearchCanvasNode;

    const legacyHtml = renderToStaticMarkup(<Render node={legacyNode} locale="zh-hant" />);
    expect(legacyHtml).toContain('placeholder="請問我可以怎麼幫您？"');
    expect(legacyHtml).toContain('aria-label="請問我可以怎麼幫您？"');
    expect(legacyHtml).toContain('搜尋');
    expect(legacyHtml).not.toContain('어떻게 도와드릴까요?');

    const legacyInspectorHtml = renderToStaticMarkup(
      <Inspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('value="請問我可以怎麼幫您？"');
    expect(legacyInspectorHtml).toContain('value="搜尋"');
    expect(legacyInspectorHtml).not.toContain('어떻게 도와드릴까요?');

    const schemaLegacyHtml = renderToStaticMarkup(<Render node={schemaLegacyNode} locale="zh-hant" />);
    expect(schemaLegacyHtml).toContain('placeholder="請問我可以怎麼幫您？"');
    expect(schemaLegacyHtml).toContain('搜尋');
    expect(schemaLegacyHtml).not.toContain('Search');

    const customHtml = renderToStaticMarkup(<Render node={customNode} locale="zh-hant" />);
    expect(customHtml).toContain('Custom placeholder');
    expect(customHtml).toContain('Custom submit');
    expect(customHtml).not.toContain('請問我可以怎麼幫您？');
  });
});
