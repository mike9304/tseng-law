import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const GRID_Y = HERO_H + 80;
const GRID_H = 700;
const STAGE_H = GRID_Y + GRID_H + 80;

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
  { quote: '"응급 수술을 받았는데 정말 빠르고 정확하게 처치해 주셨어요. 감사합니다."', name: '— 김OO, 골든리트리버 보호자' },
  { quote: '"정기 검진 덕분에 초기에 질병을 발견할 수 있었습니다. 정말 다행이에요."', name: '— 이OO, 먼치킨 보호자' },
  { quote: '"수의사 선생님이 너무 친절하고 자세히 설명해 주셔서 안심이 됩니다."', name: '— 박OO, 포메라니안 보호자' },
  { quote: '"치과 스케일링 후 구취가 완전히 사라졌어요. 추천합니다!"', name: '— 최OO, 비글 보호자' },
  { quote: '"중성화 수술 후 케어까지 꼼꼼하게 해주셔서 감동받았습니다."', name: '— 정OO, 시바견 보호자' },
  { quote: '"호텔 서비스를 이용했는데 깨끗하고 안전해서 걱정 없이 여행 갔어요."', name: '— 한OO, 말티즈 보호자' },
];

const cardW = 360;
const cardH = 220;
const gapX = 30;
const gapY = 30;

const cards: BuilderCanvasNode[] = testimonials.flatMap((t, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-pettesti-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#ffffff',
      borderRadius: 12,
      padding: 24,
      borderColor: '#e5e7eb',
      borderWidth: 1,
    }),
    createTextNode({
      id: `${prefix}-q`,
      parentId: prefix,
      rect: { x: 24, y: 24, width: 312, height: 120 },
      text: t.quote,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${prefix}-n`,
      parentId: prefix,
      rect: { x: 24, y: 160, width: 312, height: 32 },
      text: t.name,
      fontSize: 14,
      color: '#6b7280',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-pettesti-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-pettesti-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '보호자 후기', 1, '#ffffff', 'left', 'tpl-pettesti-hero'),
  createTextNode({
    id: 'tpl-pettesti-hero-sub',
    parentId: 'tpl-pettesti-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '반려동물 보호자님들의 생생한 후기입니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-pettesti-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '리뷰', 2, '#123b63', 'left'),
  ...cards,
]);

export const petTestimonialsTemplate: PageTemplate = {
  id: 'pet-testimonials',
  name: '동물병원 후기',
  category: 'pet',
  subcategory: 'testimonials',
  description: '보호자 리뷰 + 6개 카드',
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
