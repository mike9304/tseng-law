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

const services = [
  { title: '정기 검진', desc: '혈액검사, X-ray, 초음파 등 종합 건강검진으로 조기 발견과 예방에 힘씁니다.' },
  { title: '예방접종', desc: '종합백신, 광견병, 켄넬코프 등 연령별 맞춤 백신 프로그램을 운영합니다.' },
  { title: '외과 수술', desc: '중성화, 종양 제거, 정형외과 수술 등 최신 장비로 안전한 수술을 진행합니다.' },
  { title: '치과 진료', desc: '스케일링, 발치, 구강 관리 등 반려동물 치과 전문 진료 서비스입니다.' },
  { title: '미용 서비스', desc: '목욕, 미용, 발톱 관리 등 반려동물의 위생과 아름다움을 관리합니다.' },
  { title: '호텔/위탁', desc: '안전하고 쾌적한 환경에서 반려동물을 돌보는 호텔 서비스를 제공합니다.' },
];

const cardW = 360;
const cardH = 220;
const gapX = 30;
const gapY = 30;

const cards: BuilderCanvasNode[] = services.flatMap((svc, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-petsvc-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 312, height: 36 }, svc.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 70, width: 312, height: 100 },
      text: svc.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-petsvc-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petsvc-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '진료 서비스', 1, '#ffffff', 'left', 'tpl-petsvc-hero'),
  createTextNode({
    id: 'tpl-petsvc-hero-sub',
    parentId: 'tpl-petsvc-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '반려동물의 건강을 위한 종합 진료 서비스를 소개합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-petsvc-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '서비스 안내', 2, '#123b63', 'left'),
  ...cards,
]);

export const petServicesTemplate: PageTemplate = {
  id: 'pet-services',
  name: '동물병원 서비스',
  category: 'pet',
  subcategory: 'services',
  description: '수의 서비스(6개 카드): 검진/접종/수술/치과/미용/위탁',
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
