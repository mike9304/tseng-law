import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HEADER_H = 120;
const GRID_Y = HEADER_H + 60;
const GRID_H = 900;
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
  { name: '인물 촬영', desc: '프로필, 증명사진, 개인 화보 등 다양한 인물 촬영을 제공합니다.' },
  { name: '웨딩 촬영', desc: '결혼식 본식, 스냅, 드레스 촬영 등 웨딩 전문 서비스입니다.' },
  { name: '이벤트 촬영', desc: '세미나, 공연, 파티 등 각종 행사 현장을 기록합니다.' },
  { name: '제품 촬영', desc: '쇼핑몰, 카탈로그용 제품 사진을 전문적으로 촬영합니다.' },
  { name: '기업 촬영', desc: '기업 홍보, 사옥, 임직원 단체 사진 등 비즈니스 촬영 전문.' },
  { name: '가족 촬영', desc: '가족 사진, 돌잔치, 백일 등 소중한 가족의 순간을 담습니다.' },
];

function serviceCard(n: number, col: number, row: number): BuilderCanvasNode[] {
  const x = 80 + col * 390;
  const y = GRID_Y + row * 440;
  const cId = `tpl-photosvc-card-${n}`;
  const s = services[n - 1];
  return [
    createContainerNode({
      id: cId,
      rect: { x, y, width: 360, height: 420 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 0,
    }),
    createImageNode({
      id: `${cId}-img`,
      parentId: cId,
      rect: { x: 0, y: 0, width: 360, height: 220 },
      src: `/images/placeholder-service-${n}.jpg`,
      alt: `${s.name} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cId}-name`, { x: 20, y: 232, width: 320, height: 36 }, s.name, 3, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-desc`,
      parentId: cId,
      rect: { x: 20, y: 276, width: 320, height: 60 },
      text: s.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cId}-btn`,
      parentId: cId,
      rect: { x: 20, y: 350, width: 120, height: 40 },
      label: '자세히 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-photosvc-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-photosvc-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '촬영 서비스',
    1,
    '#ffffff',
    'left',
    'tpl-photosvc-header',
  ),

  ...serviceCard(1, 0, 0),
  ...serviceCard(2, 1, 0),
  ...serviceCard(3, 2, 0),
  ...serviceCard(4, 0, 1),
  ...serviceCard(5, 1, 1),
  ...serviceCard(6, 2, 1),
]);

export const photographyServicesTemplate: PageTemplate = {
  id: 'photography-services',
  name: '촬영 서비스',
  category: 'photography',
  subcategory: 'services',
  description: '촬영 유형별 서비스(6개): 인물/웨딩/이벤트/제품/기업/가족',
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
