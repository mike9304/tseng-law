import { describe, expect, it } from 'vitest';
import savedJulyHome from './fixtures/legacy-zh-home-july.json';
import { normalizeCanvasDocument } from '../types';
import { hasLegacyJulyZhHantHomeDualTree, normalizeLegacyZhHantHome } from '../home-zh-hant-parity';

function publishedFixture() {
  return normalizeLegacyZhHantHome(normalizeCanvasDocument(structuredClone(savedJulyHome), 'zh-hant'), 'zh-hant', true);
}

describe('exact July ZH stock tablet parity boundary', () => {
  it('recognizes the actual 420-node public fixture after the read projection without deleting any original node', async () => {
    const doc = publishedFixture();
    expect(doc.nodes).toHaveLength(422);
    expect(savedJulyHome.nodes.every((node) => doc.nodes.some((next) => next.id === node.id))).toBe(true);
    expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(true);
    const original = structuredClone(doc);
    expect(normalizeLegacyZhHantHome(doc, 'zh-hant', true)).toBe(doc);
    expect(doc).toEqual(original);
  });

  it.each(['root-height', 'tablet-geometry', 'binding', 'text', 'image', 'overlay', 'style', 'z-index', 'extra-node'])(
    'preserves authored %s by opting out of the tablet view switch', async (change) => {
      const doc = publishedFixture();
      const root = doc.nodes.find((node) => node.id === 'home-hero-root')!;
      if (change === 'root-height') root.rect.height = 900;
      if (change === 'tablet-geometry') root.responsive!.tablet!.rect!.height = 900;
      if (change === 'binding') root.dataBinding = { datasetId: 'author', field: 'title' } as never;
      if (change === 'style') root.style.opacity = 91;
      if (change === 'z-index') root.zIndex += 1;
      if (change === 'extra-node') doc.nodes.push({ ...root, id: 'author-addition' });
      if (change === 'text') {
        const title = doc.nodes.find((node) => node.id === 'home-hero-title')!;
        if (title.kind === 'text') title.content.text = '作者自行編輯的標題';
      }
      if (change === 'image') {
        const image = doc.nodes.find((node) => node.id === 'home-attorney-image')!;
        if (image.kind === 'image') image.content.src = '/images/author-choice.png';
      }
      if (change === 'overlay') doc.nodes.find((node) => node.id === 'home-hero')!.rect.height += 1;
      const original = structuredClone(doc);
      expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(false);
      expect(doc).toEqual(original);
    },
  );

  it('rejects a copied nonhome page and every other locale', async () => {
    const doc = publishedFixture();
    expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', false)).toBe(false);
    for (const locale of ['ko', 'en', 'ja'] as const) expect(await hasLegacyJulyZhHantHomeDualTree(doc, locale, true)).toBe(false);
  });
});
