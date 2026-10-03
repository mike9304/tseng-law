import { describe, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import JaColumnsView, { type JaColumnsViewProps } from '../JaColumnsView';

const visibility = vi.hoisted(() => ({ hero: true, repeater: true, seo: true }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/ja/columns',
  useSearchParams: () => null,
  redirect: vi.fn(),
}));
vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: async () => ({}),
  isBuilderDynamicTemplateBlockVisible: (_: unknown, key: string) =>
    visibility[key.split('.').at(-1) as keyof typeof visibility],
}));
vi.mock('@/lib/columns', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/columns')>(),
  getAllColumnPosts: () => [{
    slug: 'archive-visibility-fixture', title: 'PUBLIC_CARD_TITLE', summary: 'PUBLIC_CARD_SUMMARY',
    category: 'legal', categoryLabel: '台湾法律情報', topic: 'labor', date: '2026-10-03',
    dateDisplay: '2026年10月3日', readTime: '4分', featuredImage: '/fixture.webp',
    content: 'PRIVATE_BODY_SENTINEL', faq: [{ q: 'PRIVATE_FAQ_SENTINEL', a: 'PRIVATE_ANSWER_SENTINEL' }],
    typography: { custom: 'PRIVATE_TYPOGRAPHY_SENTINEL' },
  }],
}));

async function archive(hero: boolean, repeater: boolean, seo: boolean, q?: string) {
  Object.assign(visibility, { hero, repeater, seo });
  const { default: Page } = await import('../page');
  const result = await Page({ params: Promise.resolve({ locale: 'ja' }), searchParams: Promise.resolve({ q }) });
  expect((result as ReactElement).type).toBe(JaColumnsView);
  return (result as ReactElement<JaColumnsViewProps>).props;
}

describe('Japanese archive public view', () => {
  it.each([
    [false, false, false], [false, false, true], [false, true, false], [false, true, true],
    [true, false, false], [true, false, true], [true, true, false], [true, true, true],
  ])('preserves independent hero/repeater/schema visibility (%s, %s, %s)', async (hero, repeater, seo) => {
    const props = await archive(hero, repeater, seo);
    const payload = JSON.stringify(props);
    expect(payload).not.toContain('PRIVATE_');
    expect(props.posts).toHaveLength(repeater ? 1 : 0);
    expect(Boolean(props.collectionJsonLd)).toBe(seo);
    expect(Boolean(props.breadcrumbJsonLd)).toBe(seo);
    if (!repeater && !seo) expect(payload).not.toContain('PUBLIC_CARD_');
    if (seo) expect(JSON.stringify(props.collectionJsonLd)).toContain('PUBLIC_CARD_TITLE');
    const html = renderToStaticMarkup(<JaColumnsView {...props} />);
    expect(html.includes('<h1')).toBe(hero);
    expect(html.includes('href="/ja/columns/archive-visibility-fixture"')).toBe(repeater);
    expect(html.includes('application/ld+json')).toBe(seo);
    expect(html).toContain('日系企業・在台日本人の方へ');
  });

  it('renders query and empty state on the server without a mount or fallback', async () => {
    const matched = await archive(true, true, true, 'PUBLIC_CARD_TITLE');
    expect(renderToStaticMarkup(<JaColumnsView {...matched} />)).toContain('href="/ja/columns/archive-visibility-fixture"');
    const empty = await archive(true, true, true, 'no-matching-title');
    const html = renderToStaticMarkup(<JaColumnsView {...empty} />);
    expect(html).not.toContain('href="/ja/columns/archive-visibility-fixture"');
    expect(html).toContain('data-columns-filter-reset');
  });

  it('preserves the independent issue-board tabs when published issues exist', async () => {
    const props = await archive(false, false, false);
    const shown = renderToStaticMarkup(<JaColumnsView {...props} showIssueTabs />);
    expect(shown).toContain('data-issue-board-tabs="expert"');
    expect(shown).toContain('href="/ja/columns/issues"');
    expect(shown).toContain('実務コラム');
    expect(shown).toContain('時事解説コラム');
    expect(renderToStaticMarkup(<JaColumnsView {...props} showIssueTabs={false} />)).not.toContain('data-issue-board-tabs');
  });
});
