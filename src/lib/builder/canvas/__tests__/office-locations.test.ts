import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '../types';
import { createDefaultCanvasNodeStyle } from '../types';
import {
  getOfficeLocationPresets,
  googleMapsSearchUrl,
  labelPrefix,
  labelValueAfterColon,
  readButtonHref,
  readButtonLabel,
  readMapAddress,
  readMapZoom,
  readNodeText,
  resolveOfficeNodeGroup,
  telHrefFromPhone,
} from '../office-locations';

function node(
  id: string,
  kind: BuilderCanvasNode['kind'],
  content: Record<string, unknown>,
): BuilderCanvasNode {
  return {
    id,
    kind,
    parentId: null,
    rect: { x: 0, y: 0, width: 100, height: 40 },
    style: createDefaultCanvasNodeStyle(),
    content,
    visible: true,
    locked: false,
    rotation: 0,
    zIndex: 0,
  } as BuilderCanvasNode;
}

describe('office location helpers', () => {
  it('returns localized presets with Korean fallback', () => {
    expect(getOfficeLocationPresets('ko')[0]?.title).toBe('타이중');
    expect(getOfficeLocationPresets('zh-hant')[0]?.title).toBe('台中');
    expect(getOfficeLocationPresets('en')[0]?.title).toBe('Taichung');
    expect(getOfficeLocationPresets('fr')[0]?.title).toBe('타이중');
  });

  it('normalizes map and phone links', () => {
    expect(googleMapsSearchUrl(' 台北 101 ')).toBe('https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%20101');
    expect(googleMapsSearchUrl('   ')).toBe('');
    expect(telHrefFromPhone('02-1234-5678')).toBe('tel:0212345678');
    expect(telHrefFromPhone('+886 4 2326 1862')).toBe('tel:+886423261862');
  });

  it('parses label prefixes and values', () => {
    expect(labelPrefix('전화: 04-2326-1862', 'TEL')).toBe('전화');
    expect(labelPrefix('04-2326-1862', 'TEL')).toBe('TEL');
    expect(labelValueAfterColon('전화: 04-2326-1862')).toBe('04-2326-1862');
    expect(labelValueAfterColon('04-2326-1862')).toBe('04-2326-1862');
  });

  it('reads node content safely', () => {
    expect(readNodeText(node('text', 'text', { text: 'Hello' }))).toBe('Hello');
    expect(readButtonLabel(node('button', 'button', { label: 'Open' }))).toBe('Open');
    expect(readButtonHref(node('button', 'button', { href: '/ko' }))).toBe('/ko');
    expect(readMapAddress(node('map', 'map', { address: 'Taipei' }))).toBe('Taipei');
    expect(readMapZoom(node('map', 'map', { zoom: 99 }))).toBe(20);
    expect(readMapZoom(node('map', 'map', { zoom: 0 }))).toBe(1);
  });

  it('resolves an office map sibling node group', () => {
    const mapNode = node('home-offices-layout-0-map', 'map', { address: 'Taipei', zoom: 16 });
    const titleNode = node('home-offices-layout-0-card-title', 'heading', { text: '타이베이' });
    const phoneNode = node('home-offices-layout-0-card-phone', 'button', { label: '전화: 04-2326-1862' });
    const byId = new Map([mapNode, titleNode, phoneNode].map((entry) => [entry.id, entry]));

    const group = resolveOfficeNodeGroup(byId, mapNode);

    expect(group?.layoutId).toBe('home-offices-layout-0');
    expect(group?.cardId).toBe('home-offices-layout-0-card');
    expect(group?.titleNode).toBe(titleNode);
    expect(group?.phoneNode).toBe(phoneNode);
    expect(group?.addressNode).toBeNull();
    expect(resolveOfficeNodeGroup(byId, node('plain-map', 'map', {}))).toBeNull();
  });
});
