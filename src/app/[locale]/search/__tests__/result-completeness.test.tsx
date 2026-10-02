import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ search: vi.fn() }));
vi.mock('@/lib/builder/search/current-search', () => ({ searchCurrentPublication: mocks.search }));
import SearchPage from '../page';

it('makes every returned result available, including the fiftieth', async () => {
  mocks.search.mockResolvedValue({ availableKinds: ['blog'], hits: Array.from({ length: 50 }, (_, i) => ({ doc: { id: `blog:${i}`, kind: 'blog', title: `Result ${i + 1}`, url: `/ko/columns/result-${i + 1}`, summary: '요약' }, highlights: [] })) });
  const html = renderToStaticMarkup(await SearchPage({ params: Promise.resolve({ locale: 'ko' }), searchParams: Promise.resolve({ q: '회사설립' }) }));
  expect(html.match(/class="list-row"/g)).toHaveLength(50);
  expect(html).toContain('/ko/columns/result-50');
});

it.each(['services', 'videos'])('treats the legacy %s category as an unrestricted search, not general pages', async tab => {
  mocks.search.mockResolvedValue({ availableKinds: [], hits: [] });
  await SearchPage({ params: Promise.resolve({ locale: 'ko' }), searchParams: Promise.resolve({ q: '회사설립', tab }) });
  expect(mocks.search).toHaveBeenLastCalledWith(expect.objectContaining({ kinds: undefined }));
});
