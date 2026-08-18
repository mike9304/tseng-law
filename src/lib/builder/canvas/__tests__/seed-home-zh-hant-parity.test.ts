import { describe, expect, it } from 'vitest';
import { createHomePageCanvasDocumentDecomposed } from '../seed-home';
import {
  computeTopLevelFlowSectionMetrics,
  isCanonicalDecomposedHomeFlowStack,
  isCssParityOverlayFlowSection,
} from '../flow';
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
    expect(textNodeText(nodesById.get('home-stats-title'))).toBe('從官方資料看跨境服務基礎');
    expect(nodesById.get('home-stats-container')?.rect).toMatchObject({ x: 51, width: 1178 });
    expect(nodesById.get('home-stats-title')?.rect).toMatchObject({ width: 1178, height: 54 });
    expect(nodesById.get('home-stats-description')?.rect).toMatchObject({ y: 106, width: 720, height: 64 });
    expect(nodesById.get('home-stats-grid')?.rect).toMatchObject({ y: 200, width: 1178, height: 164 });

    expect([0, 1, 2, 3].map((index) => ({
      number: textNodeText(nodesById.get(`home-stats-number-${index}`)),
      label: textNodeText(nodesById.get(`home-stats-label-${index}`)),
      progressKind: nodesById.get(`home-stats-progress-${index}`)?.kind,
      progressBarKind: nodesById.get(`home-stats-progress-bar-${index}`)?.kind,
      progressBarText: textNodeText(nodesById.get(`home-stats-progress-bar-${index}`)),
    }))).toEqual([
      { number: '4', label: '台灣辦公據點', progressKind: 'divider', progressBarKind: undefined, progressBarText: undefined },
      { number: '3', label: '業務溝通語言', progressKind: 'divider', progressBarKind: undefined, progressBarText: undefined },
      { number: '7', label: '主要執業領域', progressKind: 'divider', progressBarKind: undefined, progressBarText: undefined },
      { number: '2', label: '最高級別語言資格', progressKind: 'divider', progressBarKind: undefined, progressBarText: undefined },
    ]);

    expect([0, 1, 2, 3].map((index) => nodeContentLabel(nodesById.get(`home-offices-tab-${index}`)))).toEqual([
      '台北',
      '台中',
      '高雄',
      '屏東',
    ]);

    const taichungLayout = nodesById.get('home-offices-layout-1');
    expect(nodesById.get('home-offices-container')?.rect).toMatchObject({ x: 51, width: 1178 });
    expect(taichungLayout?.rect).toMatchObject({ x: 0, y: 198, width: 1178, height: 422 });
    expect(nodesById.get('home-offices-layout-1-map')?.kind).toBe('container');
    expect(nodesById.get('home-offices-layout-1-map')?.rect).toMatchObject({ width: 687, height: 422 });
    expect(nodesById.get('home-offices-layout-1-map')?.content).toMatchObject({
      className: 'office-map-wrap',
    });
    expect(nodesById.get('home-offices-layout-1-map-embed')?.kind).toBe('video-embed');
    expect(nodesById.get('home-offices-layout-1-map-embed')?.content).toMatchObject({
      provider: 'url',
    });
    expect(JSON.stringify(nodesById.get('home-offices-layout-1-map-embed')?.content)).toContain('maps/embed?pb=');
    expect(nodesById.get('home-offices-layout-1-map-fallback')?.content).toMatchObject({
      className: 'office-map-fallback',
    });
    expect(nodesById.get('home-offices-layout-1-map-panel')?.parentId).toBe('home-offices-layout-1-map-fallback');
    expect(textNodeText(nodesById.get('home-offices-layout-1-map-kicker'))).toBe('地圖預覽');
    expect(textNodeText(nodesById.get('home-offices-layout-1-map-title'))).toBe('台中');
    expect(textNodeText(nodesById.get('home-offices-layout-1-map-address'))).toBe('40453臺中市北區館前路19號6樓之1');
    expect(nodesById.get('home-offices-layout-1-map-link')?.content).toMatchObject({
      label: '開啟地圖',
    });
    expect(JSON.stringify(taichungLayout)).not.toContain('無法載入地圖');

    expect(textNodeText(nodesById.get('home-offices-layout-1-card-label'))).toBe('據點');
    expect(textNodeText(nodesById.get('home-offices-layout-1-card-title'))).toBe('台中');
    expect(textNodeText(nodesById.get('home-offices-layout-1-card-address'))).toBe('40453臺中市北區館前路19號6樓之1');
    expect(nodesById.get('home-offices-layout-1-card-phone')?.content).toMatchObject({
      label: '電話: 04-2326-1862',
      href: 'tel:0423261862',
    });
    expect(textNodeText(nodesById.get('home-offices-layout-1-card-fax'))).toBe('傳真: 04-2326-1863');
    expect(nodesById.get('home-offices-layout-1-card-map-link')?.content).toMatchObject({
      label: '在 Google 地圖查看 (照片·評論)',
    });
    expect(textNodeText(nodesById.get('home-offices-layout-3-card-title'))).toBe('屏東');
    expect(textNodeText(nodesById.get('home-offices-layout-3-card-address'))).toBe('90443屏東縣九如鄉九如路三段46號');
    expect(nodesById.get('home-offices-layout-3-card-phone')?.content).toMatchObject({
      label: '電話: 08-739-1689',
      href: 'tel:087391689',
    });
    expect(textNodeText(nodesById.get('home-offices-layout-3-card-fax'))).toBe('傳真: 08-739-7362');
  });

  it('keeps inactive office tab layouts in one mobile/tablet slot instead of stacking them into page height', () => {
    const doc = createHomePageCanvasDocumentDecomposed('zh-hant');
    const nodesById = new Map(doc.nodes.map((node) => [node.id, node]));
    const layoutRects = [0, 1, 2, 3].map((index) => ({
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
      layoutRects[0].mobile.y,
    ]);
    expect(layoutRects.map(({ tablet }) => tablet.y)).toEqual([
      layoutRects[0].tablet.y,
      layoutRects[0].tablet.y,
      layoutRects[0].tablet.y,
      layoutRects[0].tablet.y,
    ]);
    expect(mobileMetrics.get('home-offices-root')?.minHeight).toBeLessThanOrEqual(980);
    expect(tabletMetrics.get('home-offices-root')?.minHeight).toBeLessThanOrEqual(1120);
    expect(contactMobile.y + contactMobile.height).toBeLessThanOrEqual(9800);
  });

  it('keeps the zh-hant dual-tree home on the 9-root canonical flow stack', () => {
    const zh = createHomePageCanvasDocumentDecomposed('zh-hant');
    const ko = createHomePageCanvasDocumentDecomposed('ko');
    const overlayNodes = zh.nodes.filter(isCssParityOverlayFlowSection);
    const metrics = computeTopLevelFlowSectionMetrics(zh.nodes);

    expect(overlayNodes).toHaveLength(9);
    expect(overlayNodes.every((node) => node.anchorName?.startsWith('mobile-parity-home-'))).toBe(true);
    expect(isCanonicalDecomposedHomeFlowStack(zh.nodes)).toBe(true);
    expect(isCanonicalDecomposedHomeFlowStack(ko.nodes)).toBe(true);
    expect(metrics.get('home-insights-root')?.marginTop).toBe(0);
    expect(metrics.get('home-hero')?.marginTop).toBeUndefined();
    expect(zh.stageHeight).toBeLessThanOrEqual(7124);
    expect(zh.stageHeight).toBeLessThan(ko.stageHeight + 200);
  });
});
