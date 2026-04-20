import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const GRID_Y = HERO_H + 80;
const GRID_H = 640;
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

const images = [
  { alt: '카페 인테리어 전경' },
  { alt: '라떼 아트' },
  { alt: '수제 페이스트리' },
  { alt: '커피 로스팅' },
  { alt: '아늑한 좌석 공간' },
  { alt: '시그니처 음료' },
  { alt: '브런치 플레이팅' },
  { alt: '야외 테라스' },
];

const imgW = 270;
const imgH = 270;
const gapX = 26;
const gapY = 26;

const imgNodes: BuilderCanvasNode[] = images.flatMap((img, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 80 + col * (imgW + gapX);
  const y = GRID_Y + 70 + row * (imgH + gapY);
  return [
    createImageNode({
      id: `tpl-cafegal-img-${i + 1}`,
      rect: { x, y, width: imgW, height: imgH },
      src: `/images/placeholder-cafe-gallery-${i + 1}.jpg`,
      alt: img.alt,
      style: { borderRadius: 12 },
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-cafegal-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafegal-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '갤러리', 1, '#ffffff', 'left', 'tpl-cafegal-hero'),
  heading('tpl-cafegal-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '카페의 순간들', 2, '#123b63', 'left'),
  ...imgNodes,
]);

export const cafeGalleryTemplate: PageTemplate = {
  id: 'cafe-gallery',
  name: '카페 갤러리',
  category: 'cafe',
  subcategory: 'gallery',
  description: '인테리어/음식/커피아트 사진 + 8개 이미지 카드',
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
