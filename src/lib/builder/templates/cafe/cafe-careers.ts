import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const POSITIONS_Y = HERO_H + 80;
const POSITIONS_H = 400;
const CULTURE_Y = POSITIONS_Y + POSITIONS_H + 80;
const CULTURE_H = 280;
const STAGE_H = CULTURE_Y + CULTURE_H + 80;

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

const positions = [
  { title: '바리스타 (풀타임/파트타임)', desc: '스페셜티 커피 추출, 음료 제조, 고객 서비스. 커피 관련 자격증 우대.' },
  { title: '베이커 (풀타임)', desc: '매일 새벽 빵과 페이스트리 제조. 제과제빵 경력 1년 이상.' },
  { title: '매장 매니저', desc: '매장 운영 총괄, 스케줄 관리, 재고 관리. F&B 관리 경험 3년 이상.' },
];

const cardW = 550;
const cardH = 140;
const gapY = 20;

const posCards: BuilderCanvasNode[] = positions.flatMap((p, i) => {
  const y = POSITIONS_Y + 70 + i * (cardH + gapY);
  const prefix = `tpl-cafecar-pos-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x: 80, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 502, height: 36 }, p.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 70, width: 502, height: 50 },
      text: p.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-cafecar-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafecar-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '함께할 분을 찾습니다', 1, '#ffffff', 'left', 'tpl-cafecar-hero'),
  createTextNode({
    id: 'tpl-cafecar-hero-sub',
    parentId: 'tpl-cafecar-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '커피를 사랑하는 분들과 함께 성장하고 싶습니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-cafecar-pos-title', { x: 80, y: POSITIONS_Y, width: 400, height: 50 }, '채용 포지션', 2, '#123b63', 'left'),
  ...posCards,
  createButtonNode({
    id: 'tpl-cafecar-apply-btn',
    rect: { x: 80, y: POSITIONS_Y + 70 + 3 * (cardH + gapY), width: 180, height: 48 },
    label: '지원하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Culture ────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-cafecar-culture',
    rect: { x: 0, y: CULTURE_Y, width: W, height: CULTURE_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-cafecar-culture-title', { x: 80, y: 40, width: 400, height: 50 }, '팀 문화', 2, '#123b63', 'left', 'tpl-cafecar-culture'),
  createTextNode({
    id: 'tpl-cafecar-culture-desc',
    parentId: 'tpl-cafecar-culture',
    rect: { x: 80, y: 100, width: 800, height: 120 },
    text: '커피에 대한 열정을 공유하며 함께 배우고 성장하는 문화를 지향합니다. 정기 교육 프로그램, 바리스타 대회 지원, 직원 할인 혜택을 제공합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
]);

export const cafeCareersTemplate: PageTemplate = {
  id: 'cafe-careers',
  name: '카페 채용',
  category: 'cafe',
  subcategory: 'careers',
  description: '바리스타/베이커 포지션 + 팀 문화 + 지원 CTA',
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
