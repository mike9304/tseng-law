import {
  SEMICONDUCTOR_BOARD_SUBTOPICS,
  type SemiconductorBoardSubtopic,
  slugMatchesSemiconductorSubtopic,
} from '@/data/semiconductor-board-subtopics';
import { SEMICONDUCTOR_GUIDE_PATH } from '@/lib/semiconductor-public';
import type { ColumnPost } from '@/lib/columns';
import type { SiteLocale } from '@/lib/locales';

export function parseSemiconductorSubtopic(
  raw: string | string[] | undefined,
): SemiconductorBoardSubtopic | null {
  const value = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
  if (!value) return null;
  return (SEMICONDUCTOR_BOARD_SUBTOPICS as readonly string[]).includes(value)
    ? (value as SemiconductorBoardSubtopic)
    : null;
}

export function filterSemiconductorBoardPosts(
  posts: readonly ColumnPost[],
  subtopic: SemiconductorBoardSubtopic | null,
): ColumnPost[] {
  if (!subtopic) return [...posts];
  return posts.filter((post) => slugMatchesSemiconductorSubtopic(post.slug, subtopic));
}

export function buildSemiconductorBoardHref(
  locale: SiteLocale,
  subtopic: SemiconductorBoardSubtopic | null,
): string {
  if (!subtopic) return `/${locale}${SEMICONDUCTOR_GUIDE_PATH}`;
  return `/${locale}${SEMICONDUCTOR_GUIDE_PATH}?subtopic=${subtopic}`;
}

export function countSemiconductorSubtopics(
  posts: readonly ColumnPost[],
): Map<SemiconductorBoardSubtopic, number> {
  const counts = new Map<SemiconductorBoardSubtopic, number>();
  for (const id of SEMICONDUCTOR_BOARD_SUBTOPICS) counts.set(id, 0);
  for (const post of posts) {
    for (const topic of SEMICONDUCTOR_BOARD_SUBTOPICS) {
      if (slugMatchesSemiconductorSubtopic(post.slug, topic)) {
        counts.set(topic, (counts.get(topic) ?? 0) + 1);
      }
    }
  }
  return counts;
}
