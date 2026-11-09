import { describe, expect, it } from 'vitest';
import boardColumns from '@/data/semiconductor-board-columns.json';
import { PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS } from '@/lib/semiconductor-public';
import {
  SEMICONDUCTOR_BOARD_SUBTOPICS,
  SEMICONDUCTOR_SLUG_SUBTOPICS,
  resolveSemiconductorSubtopics,
} from '@/data/semiconductor-board-subtopics';

describe('semiconductor board subtopic mapping', () => {
  const boardSlugs = [
    ...new Set([
      ...Object.values(boardColumns).flat(),
      ...PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS,
    ]),
  ];

  it('maps every board slug to one or two known subtopics', () => {
    for (const slug of boardSlugs) {
      const topics = resolveSemiconductorSubtopics(slug);
      expect(topics.length, slug).toBeGreaterThan(0);
      expect(topics.length, slug).toBeLessThanOrEqual(2);
      for (const topic of topics) {
        expect(SEMICONDUCTOR_BOARD_SUBTOPICS).toContain(topic);
      }
    }
  });

  it('only contains fixed slug keys (no title-based auto keys)', () => {
    for (const slug of Object.keys(SEMICONDUCTOR_SLUG_SUBTOPICS)) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(boardSlugs.includes(slug) || PUBLIC_SEMICONDUCTOR_COLUMN_SLUGS.includes(slug as never)).toBe(true);
    }
  });
});
