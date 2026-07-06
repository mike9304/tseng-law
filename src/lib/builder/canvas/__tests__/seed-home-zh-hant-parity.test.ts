import { describe, expect, it } from 'vitest';
import { createHomePageCanvasDocumentDecomposed } from '../seed-home';
import { computeTopLevelFlowSectionMetrics } from '../flow';
import type { BuilderCanvasNode } from '../types';

type ResponsiveRect = NonNullable<NonNullable<NonNullable<BuilderCanvasNode['responsive']>['mobile']>['rect']>;

function textNodeText(node: BuilderCanvasNode | undefined): string | undefined {
  if (node?.kind !== 'text') return undefined;
  return node.content.text;
}

function nodeContentLabel(node: BuilderCanvasNode | undefined): string | undefined {
  const value = node?.content && 'label' in node.content ? node.content.label : undefined;
  return typeof value === 'string' ? value : undefined;
}

function requireNode(nodesById: ReadonlyMap<string, BuilderCanvasNode>, id: string): BuilderCanvasNode {
  const node = nodesById.get(id);
  if (!node) throw new Error(`Expected ${id} to exist.`);
  return node;
}

function mobileRect(node: BuilderCanvasNode): ResponsiveRect {
  const rect = node.responsive?.mobile?.rect;
  if (!rect) throw new Error(`Expected ${node.id} to have a mobile rect.`);
  return rect;
}

function tabletRect(node: BuilderCanvasNode): ResponsiveRect {
  const rect = node.responsive?.tablet?.rect;
  if (!rect) throw new Error(`Expected ${node.id} to have a tablet rect.`);
  return rect;
}

describe('zh-hant decomposed home parity nodes', () => {
  it('recreates the stats and offices composite content in the decomposed home', () => {
    const doc = createHomePageCanvasDocumentDecomposed('zh-hant');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));

    expect(textNodeText(nodesById.get('home-stats-label'))).toBe('ABOUT');
    expect(textNodeText(nodesById.get('home-stats-title'))).toBe('以清晰方式處理複雜的台灣法律');
    expect(nodesById.get('home-stats-container')?.rect).toMatchObject({ x: 51, width: 1178 });
    expect(nodesById.get('home-stats-title')?.rect).toMatchObject({ width: 1178, height: 54 });
    expect(nodesById.get('home-stats-description')?.rect).toMatchObject({ y: 201, width: 720, height: 72 });
    expect(nodesById.get('home-stats-grid')?.rect).toMatchObject({ y: 238, width: 1178, height: 126 });

    expect([0, 1, 2, 3].map((index) => ({
      number: textNodeText(nodesById.get(`home-stats-number-${index}`)),
      label: textNodeText(nodesById.get(`home-stats-label-${index}`)),
      progressKind: nodesById.get(`home-stats-progress-${index}`)?.kind,
      progressBarKind: nodesById.get(`home-stats-progress-bar-${index}`)?.kind,
      progressBarText: textNodeText(nodesById.get(`home-stats-progress-bar-${index}`)),
    }))).toEqual([
      { number: '10+', label: '年經驗', progressKind: 'divider', progressBarKind: undefined, progressBarText: undefined },
      { number: '500+', label: '處理案件', progressKind: 'divider', progressBarKind: undefined, progressBarText: undefined },
      { number: '5', label: '辦公據點', progressKind: 'divider', progressBarKind: undefined, progressBarText: undefined },
      { number: '4', label: '語言服務', progressKind: 'divider', progressBarKind: undefined, progressBarText: undefined },
    ]);

    expect([0, 1, 2].map((index) => nodeContentLabel(nodesById.get(`home-offices-tab-${index}`)))).toEqual([
      '台中',
      '高雄',
      '台北',
    ]);

    const taichungLayout = nodesById.get('home-offices-layout-0');
    expect(nodesById.get('home-offices-container')?.rect).toMatchObject({ x: 51, width: 1178 });
    expect(taichungLayout?.rect).toMatchObject({ x: 0, y: 198, width: 1178, height: 422 });
    expect(nodesById.get('home-offices-layout-0-map')?.kind).toBe('container');
    expect(nodesById.get('home-offices-layout-0-map')?.rect).toMatchObject({ width: 687, height: 422 });
    expect(nodesById.get('home-offices-layout-0-map')?.content).toMatchObject({
      className: 'office-map-wrap',
    });
    expect(nodesById.get('home-offices-layout-0-map-embed')?.kind).toBe('video-embed');
    expect(nodesById.get('home-offices-layout-0-map-embed')?.content).toMatchObject({
      provider: 'url',
    });
    expect(JSON.stringify(nodesById.get('home-offices-layout-0-map-embed')?.content)).toContain('maps/embed?pb=');
    expect(nodesById.get('home-offices-layout-0-map-fallback')?.content).toMatchObject({
      className: 'office-map-fallback',
    });
    expect(nodesById.get('home-offices-layout-0-map-panel')?.parentId).toBe('home-offices-layout-0-map-fallback');
    expect(textNodeText(nodesById.get('home-offices-layout-0-map-kicker'))).toBe('地圖預覽');
    expect(textNodeText(nodesById.get('home-offices-layout-0-map-title'))).toBe('台中');
    expect(textNodeText(nodesById.get('home-offices-layout-0-map-address'))).toBe('臺中市北區館前路19號樓之1');
    expect(nodesById.get('home-offices-layout-0-map-link')?.content).toMatchObject({
      label: '開啟地圖',
    });
    expect(JSON.stringify(taichungLayout)).not.toContain('無法載入地圖');

    expect(textNodeText(nodesById.get('home-offices-layout-0-card-label'))).toBe('據點');
    expect(textNodeText(nodesById.get('home-offices-layout-0-card-title'))).toBe('台中');
    expect(textNodeText(nodesById.get('home-offices-layout-0-card-address'))).toBe('臺中市北區館前路19號樓之1');
    expect(nodesById.get('home-offices-layout-0-card-phone')?.content).toMatchObject({
      label: '電話: 04-2326-1862',
      href: 'tel:0423261862',
    });
    expect(textNodeText(nodesById.get('home-offices-layout-0-card-fax'))).toBe('傳真: 04-2326-1863');
    expect(nodesById.get('home-offices-layout-0-card-map-link')?.content).toMatchObject({
      label: '在 Google 地圖查看 (照片·評論)',
    });
  });

  it('keeps inactive office tab layouts in one mobile/tablet slot instead of stacking them into page height', () => {
    const doc = createHomePageCanvasDocumentDecomposed('zh-hant');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const layoutRects = [0, 1, 2].map((index) => ({
      mobile: mobileRect(requireNode(nodesById, `home-offices-layout-${index}`)),
      tablet: tabletRect(requireNode(nodesById, `home-offices-layout-${index}`)),
    }));
    const mobileMetrics = computeTopLevelFlowSectionMetrics(doc.nodes, 'mobile');
    const tabletMetrics = computeTopLevelFlowSectionMetrics(doc.nodes, 'tablet');
    const contact = requireNode(nodesById, 'home-contact-root');
    const contactMobile = mobileRect(contact);
    if (typeof contactMobile.y !== 'number' || typeof contactMobile.height !== 'number') {
      throw new Error('Expected home-contact-root mobile rect to include y and height.');
    }

    expect(layoutRects.map(({ mobile }) => mobile.y)).toEqual([
      layoutRects[0].mobile.y,
      layoutRects[0].mobile.y,
      layoutRects[0].mobile.y,
    ]);
    expect(layoutRects.map(({ tablet }) => tablet.y)).toEqual([
      layoutRects[0].tablet.y,
      layoutRects[0].tablet.y,
      layoutRects[0].tablet.y,
    ]);
    expect(mobileMetrics.get('home-offices-root')?.minHeight).toBeLessThanOrEqual(980);
    expect(tabletMetrics.get('home-offices-root')?.minHeight).toBeLessThanOrEqual(1120);
    expect(contactMobile.y + contactMobile.height).toBeLessThanOrEqual(9800);
  });
});
