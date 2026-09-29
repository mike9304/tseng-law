import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import InsightsArchiveSection from '../InsightsArchiveSection';
import { getAllColumnPosts } from '@/lib/columns';
import { interleaveColumnsByTopic, resolveColumnTopic, type ColumnTopic } from '@/lib/column-topics';

function post(slug: string, topic: ColumnTopic, date: string) {
  return {
    slug,
    title: `${topic} ${slug}`,
    date,
    dateDisplay: date,
    readTime: '5 min',
    categoryLabel: topic,
    featuredImage: '/images/real.jpg',
    summary: slug,
    topic,
  };
}

describe('home archive topic mix', () => {
  it('interleaves topics round-robin, ordered by each topic\'s newest post, newest-first within a topic', () => {
    const posts = [
      post('f1', 'family', '2026-09-29'),
      post('f2', 'family', '2026-09-28'),
      post('f3', 'family', '2026-09-27'),
      post('c1', 'company', '2026-09-20'),
      post('c2', 'company', '2026-09-10'),
      post('l1', 'labor', '2026-08-01'),
    ];
    expect(interleaveColumnsByTopic(posts).map((p) => p.slug)).toEqual(['f1', 'c1', 'l1', 'f2', 'c2', 'f3']);
    expect(interleaveColumnsByTopic([])).toEqual([]);
  });

  it('keeps every post exactly once', () => {
    const posts = getAllColumnPosts('ko');
    const mixed = interleaveColumnsByTopic(posts);
    expect(mixed).toHaveLength(posts.length);
    expect(new Set(mixed.map((p) => p.slug))).toEqual(new Set(posts.map((p) => p.slug)));
  });

  for (const locale of ['ko', 'zh-hant', 'en', 'ja', 'zh-hans', 'vi', 'id', 'th', 'fil'] as const) {
    it(`${locale}: the first home archive page (featured + 3) spans more than one topic when the locale has several`, () => {
      const posts = getAllColumnPosts(locale);
      const topics = new Set(posts.map((p) => p.topic ?? resolveColumnTopic(p.slug, undefined, p.category)));
      const firstPage = interleaveColumnsByTopic(posts).slice(0, 4);
      const firstTopics = new Set(firstPage.map((p) => p.topic ?? resolveColumnTopic(p.slug, undefined, p.category)));
      expect(firstTopics.size).toBe(Math.min(topics.size, 4));
    });
  }

  it('InsightsArchiveSection renders a mixed first page instead of one topic', () => {
    const html = renderToStaticMarkup(
      <InsightsArchiveSection
        locale="en"
        posts={[
          post('f1', 'family', '2026-09-29'),
          post('f2', 'family', '2026-09-28'),
          post('f3', 'family', '2026-09-27'),
          post('c1', 'company', '2026-09-20'),
          post('l1', 'labor', '2026-08-01'),
        ]}
      />,
    );
    const order = ['family f1', 'company c1', 'labor l1', 'family f2'].map((title) => html.indexOf(title));
    expect(order.every((index) => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });
});
