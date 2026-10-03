import { describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ColumnDetailView from '../ColumnDetailView';
import PublicColumnView from '../PublicColumnView';
import type { ColumnDetailViewProps } from '../ColumnDetailView';

const state = vi.hoisted(() => ({ body: false, seo: false, traffic: true, slug: 'visibility-fixture' }));
vi.mock('@/lib/consultation/columns-blob-reader', () => ({
  getAllColumnPostsIncludingBlob: async () => [{
    slug: state.slug, title: 'Published column title', tags: state.traffic ? ['traffic-accidents'] : [],
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

async function props(body: boolean, seo: boolean, slug = 'visibility-fixture', traffic = true) {
  state.body = body; state.seo = seo; state.slug = slug; state.traffic = traffic;
  const { default: Page } = await import('../page');
  const element = await Page({ params: Promise.resolve({ locale: 'zh-hant', slug }) });
  expect((element as ReactElement).type).toBe(PublicColumnView);
  return (element as ReactElement<ColumnDetailViewProps>).props;
}

describe('public column view publication visibility', () => {
  it('keeps the generated clip behind body visibility without removing the article', async () => {
    const slug = 'taiwan-traffic-accident-procedure';
    const hidden = await props(false, false, slug);
    expect(renderToStaticMarkup(<ColumnDetailView {...hidden} urlLocale="ko" />)).not.toContain('data-column-generated-video');
    const shown = await props(true, true, slug);
    const html = renderToStaticMarkup(<ColumnDetailView {...shown} urlLocale="ko" />);
    expect(html).toContain('data-column-generated-video="rear-end-simulation-v3-ko"');
    expect(html).toContain('HIDDEN_BODY');
    expect(html).toContain('data-traffic-diagram="stop-dialogue-timeline"');
  });
  it('keeps the observation behind body visibility and on its reviewed language/article only', async () => {
    const slug = 'taiwan-right-turn-car-straight-motorcycle-evidence';
    const hidden = await props(false, false, slug);
    expect(renderToStaticMarkup(<ColumnDetailView {...hidden} />)).not.toContain('data-traffic-observation');
    expect(renderToStaticMarkup(<ColumnDetailView {...hidden} />)).not.toContain('data-column-generated-video');
    const shown = await props(true, true, slug);
    const html = renderToStaticMarkup(<ColumnDetailView {...shown} />);
    expect(html).toContain('data-traffic-observation="right-turn"');
    expect(html).toContain('data-traffic-diagram="stop-dialogue-timeline"');
    expect(html).toContain('HIDDEN_BODY');
    expect(html).toContain('id="right-turn-observation"');
    expect(html.match(/<video\b/g)).toHaveLength(1);
    expect(html).toContain('data-column-generated-video="right-turn-scooter-v2-zh-hant"');
    expect(renderToStaticMarkup(<ColumnDetailView {...shown} urlLocale="en" />)).not.toContain('data-traffic-observation');
    expect(renderToStaticMarkup(<ColumnDetailView {...shown} post={{ ...shown.post, slug: 'another-column' }} />)).not.toContain('data-traffic-observation');
  });
  it.each([true, false])('does not serialize hidden body, heading or FAQ text when body and schemas are off (traffic=%s)', async (traffic) => {
    const data = await props(false, false, 'visibility-fixture', traffic);
    expect(JSON.stringify(data)).not.toContain('HIDDEN_');
    expect(data.tocEntries).toEqual([]);
    expect(data.faqItems).toEqual([]);
    expect(data.diagramVideo).toBeNull();
    expect(data.diagramSplit).toBeNull();
    expect(data.faqJsonLd).toBeNull();
    expect(data.articleJsonLd).toEqual({});
    expect(data.breadcrumbJsonLd).toEqual({});
  });

  it.each([true, false])('keeps explicitly published FAQ schema while withholding hidden body fields (traffic=%s)', async (traffic) => {
    const data = await props(false, true, 'visibility-fixture', traffic);
    expect(data.post.content).toBe('');
    expect(data.diagramVideo).toBeNull();
    expect(data.tocEntries).toEqual([]);
    expect(data.faqItems).toEqual([]);
    expect(JSON.stringify(data.faqJsonLd)).toContain('HIDDEN_FAQ_QUESTION');
    expect(JSON.stringify(data)).not.toContain('HIDDEN_HEADING');
  });

  it.each([true, false])('renders published body and FAQ without sending disabled schemas (traffic=%s)', async (traffic) => {
    const data = await props(true, false, 'visibility-fixture', traffic);
    expect(data.diagramSplit?.join('\n')).toContain('HIDDEN_BODY');
    expect(data.diagramVideo).toEqual({ id: 'stop-dialogue-timeline', locale: 'zh-hant' });
    expect(data.tocEntries[0].text).toBe('HIDDEN_HEADING');
    expect(data.faqItems[0].q).toBe('HIDDEN_FAQ_QUESTION');
    expect(data.faqJsonLd).toBeNull();
    expect(data.articleJsonLd).toEqual({});
  });
});
