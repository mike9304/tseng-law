import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const BIO_H = 400;
const MEMBERS_Y = BIO_H + 80;
const MEMBERS_H = 400;
const INFLUENCES_Y = MEMBERS_Y + MEMBERS_H + 80;
const INFLUENCES_H = 200;
const STAGE_H = INFLUENCES_Y + INFLUENCES_H + 80;

function heading(
  id: string,
  rect: BuilderCanvasNode['rect'],
  text: string,
  level: number,
  color: string,
  align: 'left' | 'center' | 'right' = 'left',
  parentId?: string,
): BuilderCanvasNode {
  return {
    id,
    kind: 'heading',
    parentId,
    rect,
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: { text, level, color, align },
  };
}

const members = [
  { name: '김준호', role: '보컬 / 기타' },
  { name: '이서연', role: '키보드 / 신디사이저' },
  { name: '박민수', role: '베이스' },
  { name: '최지원', role: '드럼' },
];

function memberCard(n: number): BuilderCanvasNode[] {
  const x = 80 + (n - 1) * 290;
  const cId = `tpl-musabout-member-${n}`;
  const m = members[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y: MEMBERS_Y + 70, width: 260, height: 300 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-img`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 260, height: 200 },
      src: `/images/placeholder-member-${n}.jpg`,
      alt: `${m.name} 프로필 사진`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-name`, { x: 16, y: 212, width: 228, height: 32 }, m.name, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-role`,
      parentId: cId,
      rect: { x: 16, y: 250, width: 228, height: 24 },
      text: m.role,
      fontSize: 14,
      color: '#6b7280',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  /* ── Artist bio ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-musabout-bio',
    rect: { x: 0, y: 0, width: W, height: BIO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-musabout-title',
    { x: 80, y: 60, width: 500, height: 60 },
    '블루 하모니',
    1,
    '#ffffff',
    'left',
    'tpl-musabout-bio',
  ),
  createTextNode({
    id: 'tpl-musabout-bio-text',
    parentId: 'tpl-musabout-bio',
    rect: { x: 80, y: 140, width: 700, height: 200 },
    text: '2020년 서울에서 결성된 4인조 얼터너티브 록 밴드입니다. 독창적인 사운드와 시적인 가사로 음악 씬에서 주목받고 있으며, 데뷔 앨범 "첫 번째 여행"으로 한국대중음악상 신인상을 수상했습니다.\n\n현대인의 감성과 일상의 이야기를 음악으로 풀어내는 것을 추구하며, 라이브 공연에서 특히 강한 에너지를 보여줍니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.7,
  }),

  /* ── Band members (4 cards) ─────────────────────────────── */
  heading(
    'tpl-musabout-members-title',
    { x: 80, y: MEMBERS_Y, width: 400, height: 50 },
    '멤버 소개',
    2,
    '#123b63',
    'left',
  ),
  ...memberCard(1),
  ...memberCard(2),
  ...memberCard(3),
  ...memberCard(4),

  /* ── Influences ─────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-musabout-infl',
    rect: { x: 0, y: INFLUENCES_Y, width: W, height: INFLUENCES_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-musabout-infl-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '음악적 영향',
    2,
    '#123b63',
    'left',
    'tpl-musabout-infl',
  ),
  createTextNode({
    id: 'tpl-musabout-infl-text',
    parentId: 'tpl-musabout-infl',
    rect: { x: 80, y: 100, width: 800, height: 60 },
    text: 'Radiohead · Arctic Monkeys · 장기하와 얼굴들 · 혁오 · The National · Sigur Rós',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
    lineHeight: 1.6,
  }),
]);

export const musicAboutTemplate: PageTemplate = {
  id: 'music-about',
  name: '뮤직 아티스트 소개',
  category: 'music',
  subcategory: 'about',
  description: '아티스트 바이오 + 밴드 멤버(4명) + 음악적 영향',
  document: {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-04-15T00:00:00+09:00',
    updatedBy: 'template-system',
    stageWidth: W,
    stageHeight: STAGE_H,
    nodes,
  },
};
