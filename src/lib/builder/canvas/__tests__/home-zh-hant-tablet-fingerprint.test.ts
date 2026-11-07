import { describe, expect, it } from 'vitest';
import savedJulyHome from './fixtures/legacy-zh-home-july.json';
import approvedCopyMap from './fixtures/approved-zh-home-copy-20261107.json';
import { normalizeCanvasDocument, type BuilderCanvasDocument } from '../types';
import { hasLegacyJulyZhHantHomeDualTree, normalizeLegacyZhHantHome } from '../home-zh-hant-parity';

function publishedFixture() {
  return normalizeLegacyZhHantHome(normalizeCanvasDocument(structuredClone(savedJulyHome), 'zh-hant'), 'zh-hant', true);
}

function applyApprovedZhHomeCopy20261107(doc: BuilderCanvasDocument) {
  const byId = new Map(doc.nodes.map((node) => [node.id, node]));
  for (const change of approvedCopyMap.changes) {
    const node = byId.get(change.node_id);
    if (!node || node.kind !== 'text') throw new Error(`expected text node ${change.node_id}`);
    if (node.content.text !== change.old) throw new Error(`old literal mismatch for ${change.node_id}`);
    node.content = { ...node.content, text: change.new };
  }
}

function approvedNov20261107Fixture() {
  const doc = publishedFixture();
  applyApprovedZhHomeCopy20261107(doc);
  return doc;
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

describe('2026-11-07 approved zh-hant home copy variant', () => {
  it('recognizes the 422-node approved variant after the read projection', async () => {
    const doc = approvedNov20261107Fixture();
    expect(doc.nodes).toHaveLength(422);
    expect(savedJulyHome.nodes.every((node) => doc.nodes.some((next) => next.id === node.id))).toBe(true);
    expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(true);
    const original = structuredClone(doc);
    expect(normalizeLegacyZhHantHome(doc, 'zh-hant', true)).toBe(doc);
    expect(doc).toEqual(original);
  });

  it('rejects the approved variant on nonhome pages and non zh-hant locales', async () => {
    const doc = approvedNov20261107Fixture();
    expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', false)).toBe(false);
    for (const locale of ['ko', 'en', 'ja'] as const) {
      expect(await hasLegacyJulyZhHantHomeDualTree(doc, locale, true)).toBe(false);
    }
  });

  it.each([
    'faq-question',
    'faq-answer',
    'attorney-intro',
    'stat-number',
    'hero-text',
    'link',
    'geometry',
    'style',
    'extra-node',
    'binding-unknown',
    'binding-real',
    'image',
    'partial-approved',
    'tablet-geometry',
  ] as const)('rejects an authored %s change on the approved variant', async (change) => {
    const doc = approvedNov20261107Fixture();
    const root = doc.nodes.find((node) => node.id === 'home-hero-root')!;
    if (change === 'geometry') root.rect.height = 900;
    if (change === 'tablet-geometry') root.responsive!.tablet!.rect!.height = 900;
    if (change === 'style') root.style.opacity = 91;
    if (change === 'extra-node') doc.nodes.push({ ...root, id: 'author-addition' });
    if (change === 'binding-unknown') root.dataBinding = { datasetId: 'author', field: 'title' } as never;
    if (change === 'binding-real') {
      root.dataBinding = { targetId: 'home.insights.feed', recordIndex: 0, fields: { title: 'author' } };
    }
    if (change === 'hero-text') {
      const title = doc.nodes.find((node) => node.id === 'home-hero-title')!;
      if (title.kind === 'text') title.content.text = '作者自行編輯的標題';
    }
    if (change === 'faq-question') {
      const question = doc.nodes.find((node) => node.id === 'home-faq-item-3-question-text')!;
      if (question.kind === 'text') question.content.text = '作者改寫的問題';
    }
    if (change === 'faq-answer') {
      const answer = doc.nodes.find((node) => node.id === 'home-faq-item-3-answer')!;
      if (answer.kind === 'text') answer.content.text = '作者改寫的答案';
    }
    if (change === 'attorney-intro') {
      const intro = doc.nodes.find((node) => node.id === 'home-attorney-intro-1')!;
      if (intro.kind === 'text') intro.content.text = '作者改寫的介紹';
    }
    if (change === 'stat-number') {
      const stat = doc.nodes.find((node) => node.id === 'home-stats-number-1')!;
      if (stat.kind === 'text') stat.content.text = '9';
    }
    if (change === 'link') {
      const columns = doc.nodes.find((node) => node.id === 'home-hero-columns-link')!;
      if (columns.kind === 'button') columns.content.href = '/zh-hant/contact';
    }
    if (change === 'image') {
      const image = doc.nodes.find((node) => node.id === 'home-attorney-image')!;
      if (image.kind === 'image') image.content.src = '/images/author-choice.png';
    }
    if (change === 'partial-approved') {
      const answer = doc.nodes.find((node) => node.id === 'home-faq-item-11-answer')!;
      const mapped = approvedCopyMap.changes.find((item) => item.node_id === 'home-faq-item-11-answer');
      if (answer.kind === 'text' && mapped) answer.content.text = mapped.old;
    }
    const original = structuredClone(doc);
    expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(false);
    expect(doc).toEqual(original);
  });
});
