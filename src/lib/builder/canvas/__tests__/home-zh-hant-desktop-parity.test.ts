import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAiIntakeDiscovery } from '@/lib/ai-intake/discovery';
import { siteContent } from '@/data/site-content';
import savedHome from './fixtures/legacy-zh-home-july.json';
import { normalizeCanvasDocument, type BuilderCanvasDocument } from '../types';
import {
  getLegacyZhHantFluidContainerStyle, hasLegacyJulyZhHantHomeDualTree,
  normalizeLegacyZhHantHome, normalizeLegacyZhHantHomeRead,
} from '../home-zh-hant-parity';

const ids = ['home-contact-ai-guide', 'home-contact-ai-guide-copy'];
const fixture = () => normalizeCanvasDocument(structuredClone(savedHome), 'zh-hant');
const byId = (doc: BuilderCanvasDocument, id: string) => doc.nodes.find((node) => node.id === id)!;
const approvedLanguageCopy = {
  'home-stats-description': siteContent['zh-hant'].stats.description,
  'home-stats-number-1': '4',
  'home-attorney-intro-1': '專精企業與個人案件。事務所可提供韓文、中文、日文、英文法律溝通。',
  'home-faq-item-11-answer': '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。韓語、中文、日語、英語皆可諮詢，須事先預約，以一小時為單位。若事先提供相關資料，可獲得更具體的建議。',
};
const priorApprovedLanguageCopy = {
  ...approvedLanguageCopy,
  'home-stats-description': '依官方律師簡介整理：4個台灣辦公據點、中文／韓文／日文／英文4種業務溝通語言、7項主要執業領域，以及TOPIK 6級與JLPT N1兩項最高級別語言資格。',
};

function applyStockLanguageCopy(doc: BuilderCanvasDocument, copy: Record<string, string>) {
  for (const [id, text] of Object.entries(copy)) {
    const node = byId(doc, id);
    if (node.kind !== 'text') throw new Error('stock text expected');
    node.content.text = text;
  }
}

async function normalizedSavedV5(): Promise<BuilderCanvasDocument> {
  const projected = await normalizeLegacyZhHantHomeRead(normalizeLegacyZhHantHome(fixture(), 'zh-hant', true), 'zh-hant', true);
  const doc = normalizeCanvasDocument(structuredClone(projected), 'zh-hant');
  applyStockLanguageCopy(doc, priorApprovedLanguageCopy);
  return doc;
}

afterEach(() => vi.unstubAllEnvs());

describe('exact stock ZH desktop read parity', () => {
  it('adds the shared guide, aligned search and approved stock language copy while preserving other content', async () => {
    const doc = fixture(); const original = structuredClone(doc);
    const base = normalizeLegacyZhHantHome(doc, 'zh-hant', true);
    const next = await normalizeLegacyZhHantHomeRead(base, 'zh-hant', true);
    const discovery = getAiIntakeDiscovery('zh-hant');
    expect(base.nodes).toHaveLength(422);
    expect(next.nodes).toHaveLength(424);
    expect(doc).toEqual(original);
    expect(savedHome.nodes.every((node) => next.nodes.some((item) => item.id === node.id))).toBe(true);
    expect({ ...next, nodes: [] }).toEqual({ ...original, nodes: [] });
    expect(byId(next, ids[0]).content).toMatchObject({ label: discovery.label, href: discovery.href });
    expect(byId(next, ids[0]).rect.height * (1024 / 1280)).toBeGreaterThanOrEqual(44);
    expect(byId(next, ids[1]).content).toMatchObject({ text: discovery.supportingCopy });
    for (const node of base.nodes) {
      if (['home-contact-actions', 'home-hero-search-wrapper', ...Object.keys(approvedLanguageCopy)].includes(node.id)) continue;
      expect(byId(next, node.id)).toBe(node);
    }
    expect(getLegacyZhHantFluidContainerStyle(byId(next, 'home-hero-search-wrapper'), 'zh-hant'))
      .toEqual(getLegacyZhHantFluidContainerStyle(byId(next, 'home-hero-inner'), 'zh-hant'));
    expect(await hasLegacyJulyZhHantHomeDualTree(next, 'zh-hant', true)).toBe(true);
    expect(await normalizeLegacyZhHantHomeRead(next, 'zh-hant', true)).toBe(next);
    expect(await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true)).toEqual(next);
  });

  it.each([420, 422, 424])('updates the exact saved %i-node stock read without losing desktop or tablet parity', async (count) => {
    let doc = fixture();
    if (count >= 422) doc = normalizeLegacyZhHantHome(doc, 'zh-hant', true);
    if (count === 424) {
      doc = await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true);
      // Keep the projected 424 tree, but restore the July stock language group.
      for (const id of Object.keys(approvedLanguageCopy)) {
        const node = byId(doc, id); const saved = byId(fixture(), id);
        if (node.kind !== 'text' || saved.kind !== 'text') throw new Error('stock text expected');
        node.content.text = saved.content.text;
      }
    }
    expect(doc.nodes).toHaveLength(count);
    const original = structuredClone(doc);
    const next = await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true);
    expect(byId(next, 'home-stats-number-1').content).toMatchObject({ text: '4' });
    expect(byId(next, 'home-stats-description').content).toMatchObject({ text: siteContent['zh-hant'].stats.description });
    expect(siteContent['zh-hant'].stats.description).toContain('中文／韓文／日文／英文4種');
    for (const [id, text] of Object.entries(approvedLanguageCopy)) {
      const node = byId(next, id); const prior = byId(original, id);
      expect(node.content).toMatchObject({ text });
      expect({ ...node, content: undefined }).toEqual({ ...prior, content: undefined });
      expect({ ...node.content, text: undefined }).toEqual({ ...prior.content, text: undefined });
    }
    expect(next.nodes).toHaveLength(424);
    expect(byId(next, 'home-contact-ai-guide').content).toMatchObject({ href: '/zh-hant/ai-intake' });
    expect(getLegacyZhHantFluidContainerStyle(byId(next, 'home-hero-search-wrapper'), 'zh-hant'))
      .toEqual(getLegacyZhHantFluidContainerStyle(byId(next, 'home-hero-inner'), 'zh-hant'));
    expect(await hasLegacyJulyZhHantHomeDualTree(next, 'zh-hant', true)).toBe(true);
    expect(await normalizeLegacyZhHantHomeRead(next, 'zh-hant', true)).toBe(next);
    expect(doc).toEqual(original);
    expect({ ...next, nodes: [] }).toEqual({ ...original, nodes: [] });
    expect(original.nodes.every((node) => next.nodes.some((item) => item.id === node.id))).toBe(true);
  });

  it.each([422, 424])('updates the exact saved v5 %i-node approved after group to the current approved copy', async (count) => {
    let doc = normalizeLegacyZhHantHome(fixture(), 'zh-hant', true);
    if (count === 424) doc = await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true);
    applyStockLanguageCopy(doc, priorApprovedLanguageCopy);
    expect(doc.nodes).toHaveLength(count);
    const original = structuredClone(doc);
    const next = await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true);
    expect(byId(next, 'home-stats-number-1').content).toMatchObject({ text: '4' });
    expect(byId(next, 'home-stats-description').content).toMatchObject({ text: siteContent['zh-hant'].stats.description });
    expect(siteContent['zh-hant'].stats.description).not.toBe(priorApprovedLanguageCopy['home-stats-description']);
    expect(siteContent['zh-hant'].stats.description).toContain('中文／韓文／日文／英文4種');
    for (const [id, text] of Object.entries(approvedLanguageCopy)) {
      const node = byId(next, id); const prior = byId(original, id);
      expect(node.content).toMatchObject({ text });
      expect({ ...node, content: undefined }).toEqual({ ...prior, content: undefined });
      expect({ ...node.content, text: undefined }).toEqual({ ...prior.content, text: undefined });
    }
    expect(next.nodes).toHaveLength(424);
    expect(byId(next, 'home-contact-ai-guide').content).toMatchObject({ href: '/zh-hant/ai-intake' });
    expect(getLegacyZhHantFluidContainerStyle(byId(next, 'home-hero-search-wrapper'), 'zh-hant'))
      .toEqual(getLegacyZhHantFluidContainerStyle(byId(next, 'home-hero-inner'), 'zh-hant'));
    expect(await hasLegacyJulyZhHantHomeDualTree(next, 'zh-hant', true)).toBe(true);
    expect(await normalizeLegacyZhHantHomeRead(next, 'zh-hant', true)).toBe(next);
    expect(doc).toEqual(original);
    expect({ ...next, nodes: [] }).toEqual({ ...original, nodes: [] });
    expect(original.nodes.every((node) => next.nodes.some((item) => item.id === node.id))).toBe(true);
  });

  it('updates the normalizeCanvasDocument-saved v5 stock to the current approved copy without mutating input', async () => {
    const doc = await normalizedSavedV5();
    const original = structuredClone(doc);
    const next = await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true);
    expect(byId(next, 'home-stats-description').content).toMatchObject({ text: siteContent['zh-hant'].stats.description });
    expect(byId(next, 'home-stats-number-1').content).toMatchObject({ text: '4' });
    for (const [id, text] of Object.entries(approvedLanguageCopy)) {
      const node = byId(next, id); const prior = byId(original, id);
      expect(node.content).toMatchObject({ text });
      expect({ ...node, content: undefined }).toEqual({ ...prior, content: undefined });
      expect({ ...node.content, text: undefined }).toEqual({ ...prior.content, text: undefined });
    }
    expect(next.nodes).toHaveLength(424);
    expect(await hasLegacyJulyZhHantHomeDualTree(next, 'zh-hant', true)).toBe(true);
    expect(await normalizeLegacyZhHantHomeRead(next, 'zh-hant', true)).toBe(next);
    expect(doc).toEqual(original);
    expect({ ...next, nodes: [] }).toEqual({ ...original, nodes: [] });
  });

  it.each(['activeIndex-1', 'sticky-true', 'custom-text', 'geometry', 'reorder'] as const)(
    'keeps a normalizeCanvasDocument-saved stock with authored group %s outside the projection', async (change) => {
      const doc = await normalizedSavedV5();
      const group = byId(doc, 'home-attorney-detail-flow');
      if (group.kind !== 'container') throw new Error('inserted group expected');
      if (change === 'activeIndex-1') group.content.activeIndex = 1;
      if (change === 'sticky-true') group.content.sticky = true;
      if (change === 'custom-text') group.content.label = '作者指定的群組標籤';
      if (change === 'geometry') group.rect.width = 551;
      if (change === 'reorder') {
        const index = doc.nodes.findIndex((node) => node.id === group.id);
        const swap = doc.nodes[index + 1];
        if (!swap) throw new Error('reorder neighbor expected');
        doc.nodes[index] = swap;
        doc.nodes[index + 1] = group;
      }
      const original = structuredClone(doc);
      expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(false);
      expect(await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true)).toBe(doc);
      expect(byId(doc, 'home-stats-description').content).toMatchObject({
        text: priorApprovedLanguageCopy['home-stats-description'],
      });
      expect(doc).toEqual(original);
    },
  );

  it('preserves a mixed prior-after group plus authored attorney copy instead of treating it as stock', async () => {
    const doc = await normalizeLegacyZhHantHomeRead(fixture(), 'zh-hant', true);
    applyStockLanguageCopy(doc, priorApprovedLanguageCopy);
    const intro = byId(doc, 'home-attorney-intro-1');
    if (intro.kind !== 'text') throw new Error('stock text expected');
    intro.content.text = '作者指定的中文說明';
    const original = structuredClone(doc);
    expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(false);
    expect(await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true)).toBe(doc);
    expect(doc).toEqual(original);
  });

  it.each(['counter', 'description', 'intro', 'faq', 'style', 'geometry', 'binding', 'extra-node', 'other-content'])(
    'keeps authored %s outside the stock language projection', async (change) => {
      const doc = normalizeLegacyZhHantHome(fixture(), 'zh-hant', true);
      const counter = byId(doc, 'home-stats-number-1'); const description = byId(doc, 'home-stats-description');
      if (counter.kind !== 'text' || description.kind !== 'text') throw new Error('stock text expected');
      if (change === 'counter') counter.content.text = '5';
      if (change === 'description') description.content.text = '作者指定的中文說明';
      if (change === 'intro' || change === 'faq') {
        const node = byId(doc, change === 'intro' ? 'home-attorney-intro-1' : 'home-faq-item-11-answer');
        if (node.kind === 'text') node.content.text = '作者指定的中文說明';
      }
      if (change === 'style') counter.style.opacity = 0.8;
      if (change === 'geometry') description.rect.width = 700;
      if (change === 'binding') description.dataBinding = { datasetId: 'author', field: 'description' } as never;
      if (change === 'extra-node') doc.nodes.push({ ...structuredClone(description), id: 'author-note' });
      if (change === 'other-content') {
        const title = byId(doc, 'home-hero-title');
        if (title.kind === 'text') title.content.text = '作者的首頁';
      }
      const original = structuredClone(doc);
      expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(false);
      expect(await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true)).toBe(doc);
      expect(doc).toEqual(original);
    },
  );

  it.each(Array.from({ length: 14 }, (_, index) => index + 1))(
    'preserves a partial language edit (four-node mask %i) instead of treating it as the atomic stock update', async (mask) => {
      const doc = normalizeLegacyZhHantHome(fixture(), 'zh-hant', true);
      Object.entries(approvedLanguageCopy).forEach(([id, text], index) => {
        if (!(mask & (1 << index))) return;
        const node = byId(doc, id);
        if (node.kind === 'text') node.content.text = text;
      });
      const original = structuredClone(doc);
      expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(false);
      expect(await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true)).toBe(doc);
      expect(doc).toEqual(original);
    },
  );

  it('hides both guide nodes with no added height when the shared discovery flag is false', async () => {
    vi.stubEnv('NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED', 'false');
    const doc = fixture(); const next = await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true);
    expect(ids.every((id) => byId(next, id).visible === false)).toBe(true);
    for (const id of ['home-contact-root', 'home-contact-container', 'home-contact-actions']) {
      expect(byId(next, id).rect.height).toBe(byId(doc, id).rect.height);
    }
    expect(next.stageHeight).toBe(doc.stageHeight);
    expect(next.nodes.filter((node) => node.parentId === 'home-contact-actions' && node.visible).map((node) => node.id))
      .toEqual(['home-contact-primary', 'home-contact-phone']);
    expect(await hasLegacyJulyZhHantHomeDualTree(next, 'zh-hant', true)).toBe(true);
    expect(await normalizeLegacyZhHantHomeRead(next, 'zh-hant', true)).toBe(next);
  });

  it('updates only generated visibility when the flag changes across reads', async () => {
    const enabled = await normalizeLegacyZhHantHomeRead(fixture(), 'zh-hant', true);
    vi.stubEnv('NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED', 'false');
    const hidden = await normalizeLegacyZhHantHomeRead(enabled, 'zh-hant', true);
    expect(hidden.nodes).toHaveLength(enabled.nodes.length);
    expect(ids.every((id) => !byId(hidden, id).visible)).toBe(true);
    expect(hidden.nodes.filter((node) => !ids.includes(node.id))).toEqual(enabled.nodes.filter((node) => !ids.includes(node.id)));
    vi.stubEnv('NEXT_PUBLIC_AI_INTAKE_DISCOVERY_ENABLED', 'true');
    expect(await normalizeLegacyZhHantHomeRead(hidden, 'zh-hant', true)).toEqual(enabled);
  });

  it.each(['title', 'contact-copy', 'contact-size', 'search-size', 'responsive', 'binding', 'surface', 'extra-node'])(
    'does not add desktop compatibility to authored %s', async (change) => {
      const doc = fixture();
      if (change === 'title' || change === 'contact-copy') {
        const node = byId(doc, change === 'title' ? 'home-hero-title' : 'home-contact-description');
        if (node.kind === 'text') node.content.text = '作者的內容必須保留';
      }
      if (change === 'contact-size') byId(doc, 'home-contact-actions').rect.height = 100;
      if (change === 'search-size') byId(doc, 'home-hero-search-wrapper').rect.x = 80;
      if (change === 'responsive') byId(doc, 'home-hero-search-wrapper').responsive!.tablet!.rect!.width = 500;
      if (change === 'binding') byId(doc, 'home-contact-actions').dataBinding = { datasetId: 'author', field: 'actions' } as never;
      if (change === 'surface') {
        const node = byId(doc, 'home-contact');
        if (node.kind === 'composite') node.content.config.overrides = { headline: '作者的內容' };
      }
      if (change === 'extra-node') doc.nodes.push({ ...structuredClone(byId(doc, 'home-contact-description')), id: 'author-note' });
      const original = structuredClone(doc); const base = normalizeLegacyZhHantHome(doc, 'zh-hant', true);
      expect(await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true)).toEqual(base);
      expect(doc).toEqual(original);
      expect(ids.every((id) => !base.nodes.some((node) => node.id === id))).toBe(true);
    },
  );

  it.each(['guide-label', 'guide-link', 'guide-size', 'support-copy', 'search-size', 'extra-node', 'stats-counter', 'stats-description', 'intro', 'faq'])(
    'preserves authored %s after a projection instead of reversing it', async (change) => {
      const doc = await normalizeLegacyZhHantHomeRead(fixture(), 'zh-hant', true);
      const button = byId(doc, ids[0]); const copy = byId(doc, ids[1]);
      if (button.kind !== 'button' || copy.kind !== 'text') throw new Error('guide node kinds');
      if (change === 'guide-label') button.content.label = '作者的連結';
      if (change === 'guide-link') button.content.href = '/zh-hant/custom';
      if (change === 'guide-size') button.rect.height = 80;
      if (change === 'support-copy') copy.content.text = '作者的說明';
      if (change === 'search-size') byId(doc, 'home-hero-search-wrapper').rect.x += 10;
      if (change === 'extra-node') doc.nodes.push({ ...structuredClone(copy), id: 'author-note' });
      if (change === 'stats-counter' || change === 'stats-description') {
        const stats = byId(doc, change === 'stats-counter' ? 'home-stats-number-1' : 'home-stats-description');
        if (stats.kind === 'text') stats.content.text = change === 'stats-counter' ? '5' : '作者指定的中文說明';
      }
      if (change === 'intro' || change === 'faq') {
        const node = byId(doc, change === 'intro' ? 'home-attorney-intro-1' : 'home-faq-item-11-answer');
        if (node.kind === 'text') node.content.text = '作者指定的中文說明';
      }
      const original = structuredClone(doc);
      expect(await hasLegacyJulyZhHantHomeDualTree(doc, 'zh-hant', true)).toBe(false);
      expect(await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true)).toBe(doc);
      expect(doc).toEqual(original);
    },
  );

  it('requires actual home metadata and the matching locale; stock tablet nodes stay unchanged', async () => {
    const doc = fixture();
    expect(await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', false)).toBe(doc);
    for (const locale of ['ko', 'en', 'ja'] as const) expect(await normalizeLegacyZhHantHomeRead(doc, locale, true)).toBe(doc);
    const next = await normalizeLegacyZhHantHomeRead(doc, 'zh-hant', true);
    for (const node of doc.nodes.filter((item) => item.anchorName?.startsWith('mobile-parity-home-'))) {
      expect(byId(next, node.id)).toBe(node);
    }
    const customSearch = structuredClone(byId(next, 'home-hero-search-wrapper'));
    customSearch.rect.x += 1;
    expect(getLegacyZhHantFluidContainerStyle(customSearch, 'zh-hant')).toBeUndefined();
  });
});
