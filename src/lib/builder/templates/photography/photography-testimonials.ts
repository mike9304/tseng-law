import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HEADER_H = 120;
const GRID_Y = HEADER_H + 60;
const CARD_H = 200;
const CARD_GAP = 30;
const STAGE_H = GRID_Y + (CARD_H + CARD_GAP) * 3 + 60;

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

const testimonials = [
  { type: '웨딩 촬영', text: '평생 간직할 아름다운 웨딩 사진을 받았습니다. 자연스러운 연출이 정말 좋았어요.', name: '이OO' },
  { type: '가족 촬영', text: '아이들의 자연스러운 표정을 너무 잘 담아주셨어요. 가족 모두 만족합니다.', name: '박OO' },
  { type: '인물 촬영', text: '프로필 사진이 정말 마음에 들어요. 자연광 촬영 덕분에 피부가 예쁘게 나왔습니다.', name: '김OO' },
  { type: '기업 촬영', text: '회사 홈페이지에 사용할 사진을 전문적으로 찍어주셨어요. 결과물이 훌륭합니다.', name: '정OO' },
  { type: '제품 촬영', text: '쇼핑몰 상품 사진의 퀄리티가 확 올라갔어요. 매출에도 도움이 됐습니다.', name: '최OO' },
  { type: '이벤트 촬영', text: '행사의 모든 중요한 순간을 놓치지 않고 담아주셨어요. 정말 감사합니다.', name: '한OO' },
];

function testimonialCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 570;
  const y = GRID_Y + row * (CARD_H + CARD_GAP);
  const cId = `tpl-phototesti-card-${n}`;
  const t = testimonials[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 540, height: CARD_H },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    createTextNode({
      id: `${cId}-type`,
      parentId: cId,
      rect: { x: 24, y: 12, width: 160, height: 24 },
      text: t.type,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cId}-text`,
      parentId: cId,
      rect: { x: 24, y: 48, width: 492, height: 80 },
      text: `"${t.text}"`,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cId}-name`,
      parentId: cId,
      rect: { x: 24, y: 146, width: 200, height: 24 },
      text: `— ${t.name}`,
      fontSize: 14,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-phototesti-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-phototesti-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '고객 후기',
    1,
    '#ffffff',
    'left',
    'tpl-phototesti-header',
  ),

  ...testimonialCard(1, 0, 0),
  ...testimonialCard(2, 1, 0),
  ...testimonialCard(3, 0, 1),
  ...testimonialCard(4, 1, 1),
  ...testimonialCard(5, 0, 2),
  ...testimonialCard(6, 1, 2),
]);

export const photographyTestimonialsTemplate: PageTemplate = {
  id: 'photography-testimonials',
  name: '사진 고객 후기',
  category: 'photography',
  subcategory: 'testimonials',
  description: '고객 후기 페이지, 촬영 유형별 6개 리뷰 카드',
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
