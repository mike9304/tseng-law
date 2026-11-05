import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  notFound: () => { throw new Error('NEXT_NOT_FOUND'); },
}));
vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: vi.fn().mockResolvedValue(null),
  isBuilderDynamicTemplateBlockVisible: () => true,
}));

import IssueArticlePage from '../columns/issues/[slug]/page';
import { getIssuePost } from '@/lib/columns';

it.each([
  ['ko', 'ruifang-taxi-japanese-passenger-compensation-korean', '가상의 장면'],
  ['ja', 'ruifang-taxi-japanese-passenger-compensation-japanese', '架空の情景'],
  ['en', 'family-office-outside-kaohsiung-english', 'Fictional scene'],
  ['vi', 'family-office-outside-kaohsiung-vietnamese', 'Cảnh hư cấu'],
  ['zh-hant', 'family-office-outside-kaohsiung', '虛構情境'],
])('shows the fictional-image caption and authored alternative text on the %s issue page', async (locale, slug, caption) => {
  const post = getIssuePost(slug, locale)!;
  expect(post).toBeDefined();
  const html = renderToStaticMarkup(await IssueArticlePage({ params: Promise.resolve({ locale, slug }) }));
  expect(html).toMatch(new RegExp(`<p[^>]*id="issue-image-caption"[^>]*>${caption}</p>`));
  const hero = html.match(/<img\b[^>]*class="blog-hero-img"[^>]*>/)?.[0] ?? '';
  expect(hero).toContain('aria-describedby="issue-image-caption"');
  expect(hero).toContain(`alt="${post.featuredImageAlt}"`);
}, 30_000);
