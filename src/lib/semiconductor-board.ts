import {
  type SemiconductorBoardSubtopic,
  slugMatchesSemiconductorSubtopic,
} from '@/data/semiconductor-board-subtopics';
import type { ColumnPost } from '@/lib/columns';

export {
  SEMICONDUCTOR_GUIDE_PATH,
  buildSemiconductorBoardHref,
  countSemiconductorSubtopics,
  parseSemiconductorSubtopic,
  semiconductorCardSubtopicsAttr,
  type SemiconductorBoardCard,
} from '@/lib/semiconductor-board-client';

export function filterSemiconductorBoardPosts(
  posts: readonly ColumnPost[],
  subtopic: SemiconductorBoardSubtopic | null,
): ColumnPost[] {
  if (!subtopic) return [...posts];
  return posts.filter((post) => slugMatchesSemiconductorSubtopic(post.slug, subtopic));
}
