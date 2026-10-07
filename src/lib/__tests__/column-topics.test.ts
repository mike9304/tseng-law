import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import {
  COLUMN_TOPICS,
  COLUMN_TOPIC_LABELS,
  LEGACY_COLUMN_TOPIC_BY_SLUG,
  groupColumnsByTopic,
  isColumnTopic,
  resolveColumnTopic,
} from '@/lib/column-topics';

const CORE_DIRS = {
  ko: 'src/content/columns',
  'zh-hant': 'src/content/columns-zh',
  en: 'src/content/columns-en',
  ja: 'src/content/columns-ja',
} as const;

function slugOf(file: string): string {
  return file.replace(/^\d+-/, '').replace(/\.md$/, '');
}

describe('column topic taxonomy (topic-grouped column index)', () => {
  it('every topic has a label in all four core locales', () => {
    for (const labels of Object.values(COLUMN_TOPIC_LABELS)) {
      for (const topic of COLUMN_TOPICS) expect(labels[topic]?.trim()).toBeTruthy();
    }
  });

  for (const [locale, dir] of Object.entries(CORE_DIRS)) {
    it(`${locale}: every column has a known topic (new columns must declare frontmatter \`topic\`)`, () => {
      const files = readdirSync(path.join(process.cwd(), dir)).filter((file) => file.endsWith('.md'));
      expect(files.length).toBeGreaterThan(0);
      for (const file of files) {
        const { data } = matter(readFileSync(path.join(process.cwd(), dir, file), 'utf-8'));
        const slug = slugOf(file);
        const declared = data.topic;
        if (declared !== undefined) {
          expect(isColumnTopic(declared), `${dir}/${file} topic=${String(declared)}`).toBe(true);
        } else {
          expect(LEGACY_COLUMN_TOPIC_BY_SLUG[slug], `${dir}/${file} needs frontmatter topic`).toBeDefined();
        }
      }
    });
  }

  it('the same slug carries the same topic in ko / zh-hant / en / ja', () => {
    const ko = new Map(getAllColumnPosts('ko').map((post) => [post.slug, post.topic]));
    for (const locale of ['zh-hant', 'en', 'ja'] as const) {
      for (const post of getAllColumnPosts(locale)) {
        if (ko.has(post.slug)) expect(post.topic, `${locale}/${post.slug}`).toBe(ko.get(post.slug));
      }
    }
  });

  it('groups in canonical topic order and keeps newest-first order inside a topic', () => {
    const groups = groupColumnsByTopic(getAllColumnPosts('ko'));
    const order = groups.map((group) => group.topic);
    expect(order).toEqual(COLUMN_TOPICS.filter((topic) => order.includes(topic)));
    expect(groups.reduce((n, group) => n + group.posts.length, 0)).toBe(getAllColumnPosts('ko').length);
    // Keep the newly published criminal board visible at the start of the topic index.
    expect(order[0]).toBe('criminal');
  });

  it('falls back from legacy category when a column has no topic', () => {
    expect(resolveColumnTopic('unknown-slug', undefined, 'formation')).toBe('company');
    expect(resolveColumnTopic('unknown-slug', undefined, 'case')).toBe('litigation');
    expect(resolveColumnTopic('unknown-slug', 'nonsense', 'legal')).toBe('other');
    expect(resolveColumnTopic('taiwan-divorce-lawsuit-qna', 'tax')).toBe('tax');
  });
});
