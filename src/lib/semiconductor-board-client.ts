import {
  resolveSemiconductorSubtopics,
  SEMICONDUCTOR_BOARD_SUBTOPICS,
  type SemiconductorBoardSubtopic,
} from '@/data/semiconductor-board-subtopics';
import type { SiteLocale } from '@/lib/locales';

export const SEMICONDUCTOR_GUIDE_PATH = '/semiconductor';

export type SemiconductorBoardCard = {
  slug: string;
  subtopics: string;
  title: string;
  summary: string;
  badge: string;
};

export function parseSemiconductorSubtopic(
  raw: string | string[] | undefined | null,
): SemiconductorBoardSubtopic | null {
  const value = typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : undefined;
  if (!value) return null;
  return (SEMICONDUCTOR_BOARD_SUBTOPICS as readonly string[]).includes(value)
    ? (value as SemiconductorBoardSubtopic)
    : null;
}

export function buildSemiconductorBoardHref(
  locale: SiteLocale,
  subtopic: SemiconductorBoardSubtopic | null,
): string {
  if (!subtopic) return `/${locale}${SEMICONDUCTOR_GUIDE_PATH}`;
  return `/${locale}${SEMICONDUCTOR_GUIDE_PATH}?subtopic=${subtopic}`;
}

export function semiconductorCardSubtopicsAttr(slug: string): string {
  return resolveSemiconductorSubtopics(slug).join(' ');
}

export function countSemiconductorSubtopics(
  posts: readonly { slug: string }[],
): Map<SemiconductorBoardSubtopic, number> {
  const counts = new Map<SemiconductorBoardSubtopic, number>();
  for (const id of SEMICONDUCTOR_BOARD_SUBTOPICS) counts.set(id, 0);
  for (const post of posts) {
    for (const topic of resolveSemiconductorSubtopics(post.slug)) {
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
  }
  return counts;
}
