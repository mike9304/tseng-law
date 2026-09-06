import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { legacyZhHomeFixture } from '@/lib/builder/canvas/__tests__/fixtures/legacy-zh-home';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import CanvasNode from '../CanvasNode';
import { BuilderDatasetPreviewProvider } from '../BuilderDatasetPreviewContext';

describe('legacy ZH canvas home context', () => {
  it.each([true, false, undefined])('requires explicit home page metadata (%s), even when copied nodes retain home IDs', (isHomePage) => {
    const document = legacyZhHomeFixture();
    const node = document.nodes.find((item) => item.id === 'home-hero-inner')!;
    const previous = useBuilderCanvasStore.getState();
    useBuilderCanvasStore.setState({ nodesById: new Map(document.nodes.map((item) => [item.id, item])) });
    try {
      const html = renderToStaticMarkup(
        <BuilderDatasetPreviewProvider isHomePage={isHomePage}>
          <CanvasNode node={node} viewport="desktop" locale="zh-hant"
            flowSectionMetrics={new Map()} flowLayoutChildNodeIds={new Set()}
            innerFlowSiblingMetrics={new Map()} visibleChildrenByParentId={new Map()}
            innerFlowPreviewGapInfo={null} onSelect={() => {}} onContextMenu={() => {}}
            onMoveStart={() => {}} onResizeStart={() => {}} />
        </BuilderDatasetPreviewProvider>,
      );
      expect(html.includes('left:max(clamp(17.6px, 4%, 52px)')).toBe(isHomePage === true);
      if (isHomePage !== true) expect(html).toContain('left:51px');
    } finally { useBuilderCanvasStore.setState(previous); }
  });
});
