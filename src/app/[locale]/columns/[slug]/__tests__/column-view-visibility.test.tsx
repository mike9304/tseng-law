import { describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import type { ColumnDetailViewProps } from '../ColumnDetailView';

const state = vi.hoisted(() => ({ body: false, seo: false }));
vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: async () => [{
    slug: 'visibility-fixture', title: 'Published traffic title', tags: ['traffic-accidents'],
    date: '2026-10-02', dateDisplay: '2026年10月2日', readTime: '', category: 'legal', categoryLabel: '',
    featuredImage: '', summary: 'Public summary', content: '## HIDDEN_HEADING\n\nHIDDEN_BODY',
    faq: [{ q: 'HIDDEN_FAQ_QUESTION', a: 'HIDDEN_FAQ_ANSWER' }],
    diagramVideo: { id: 'stop-dialogue-timeline', afterHeading: 'HIDDEN_HEADING' },
  }],
}));
vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: async () => ({}),
  isBuilderDynamicTemplateBlockVisible: (_visibility: unknown, key: string) =>
    key.endsWith('.body') ? state.body : key.endsWith('.seo') ? state.seo : true,
}));

async function props(body: boolean, seo: boolean) {
  state.body = body; state.seo = seo;
  const { default: Page } = await import('../page');
  const element = await Page({ params: Promise.resolve({ locale: 'zh-hant', slug: 'visibility-fixture' }) });
  return (element as ReactElement<ColumnDetailViewProps>).props;
}

describe('traffic column view publication visibility', () => {
  it('does not serialize hidden body, heading or FAQ text when body and schemas are off', async () => {
    const data = await props(false, false);
    expect(JSON.stringify(data)).not.toContain('HIDDEN_');
    expect(data.tocEntries).toEqual([]);
    expect(data.faqItems).toEqual([]);
    expect(data.diagramVideo).toBeNull();
    expect(data.diagramSplit).toBeNull();
    expect(data.faqJsonLd).toBeNull();
    expect(data.articleJsonLd).toEqual({});
    expect(data.breadcrumbJsonLd).toEqual({});
  });

  it('keeps explicitly published FAQ schema while withholding hidden body fields', async () => {
    const data = await props(false, true);
    expect(data.post.content).toBe('');
    expect(data.diagramVideo).toBeNull();
    expect(data.tocEntries).toEqual([]);
    expect(data.faqItems).toEqual([]);
    expect(JSON.stringify(data.faqJsonLd)).toContain('HIDDEN_FAQ_QUESTION');
    expect(JSON.stringify(data)).not.toContain('HIDDEN_HEADING');
  });

  it('renders published body and FAQ without sending disabled schemas', async () => {
    const data = await props(true, false);
    expect(data.diagramSplit?.join('\n')).toContain('HIDDEN_BODY');
    expect(data.diagramVideo).toEqual({ id: 'stop-dialogue-timeline', locale: 'zh-hant' });
    expect(data.tocEntries[0].text).toBe('HIDDEN_HEADING');
    expect(data.faqItems[0].q).toBe('HIDDEN_FAQ_QUESTION');
    expect(data.faqJsonLd).toBeNull();
    expect(data.articleJsonLd).toEqual({});
  });
});
