import { describe, expect, it } from 'vitest';
import { mapColumnPostsToHomeInsights } from '@/app/[locale]/(legacy)/home-legacy';
import { getAllColumnPosts } from '@/lib/columns';

const HANGUL = /[\uac00-\ud7af]/;

describe('legacy home insight localization', () => {
  it('maps EN columns without Hangul and without Date pending placeholders', () => {
    const posts = mapColumnPostsToHomeInsights(getAllColumnPosts('en'));
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(HANGUL.test(post.title)).toBe(false);
      expect(HANGUL.test(post.summary)).toBe(false);
      expect(post.date).toBeTruthy();
      expect(post.dateDisplay).toBeTruthy();
      expect(post.dateDisplay).not.toMatch(/Date pending/i);
    }
  });

  it('keeps KO posts with Hangul content available', () => {
    const posts = mapColumnPostsToHomeInsights(getAllColumnPosts('ko'));
    expect(posts.some((post) => HANGUL.test(post.title))).toBe(true);
  });
});
