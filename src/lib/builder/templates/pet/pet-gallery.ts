import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createImageNode,
  createContainerNode,
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

const pets = [
  { alt: '웃는 골든 리트리버' },
  { alt: '귀여운 먼치킨 고양이' },
  { alt: '산책하는 시바견' },
  { alt: '낮잠 자는 페르시안' },
  { alt: '놀고 있는 비글' },
  { alt: '그루밍 후 포메라니안' },
  { alt: '건강한 래브라도' },
  { alt: '모자 쓴 치와와' },
];

const imgW = 270;
const imgH = 270;
const gapX = 26;
const gapY = 26;

const imgNodes: BuilderCanvasNode[] = pets.flatMap((p, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 80 + col * (imgW + gapX);
  const y = GRID_Y + 70 + row * (imgH + gapY);
  return [
    createImageNode({
      id: `tpl-petgal-img-${i + 1}`,
      rect: { x, y, width: imgW, height: imgH },
      src: `/images/placeholder-pet-gallery-${i + 1}.jpg`,
      alt: p.alt,
      style: { borderRadius: 12 },
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-petgal-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petgal-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '행복한 친구들', 1, '#ffffff', 'left', 'tpl-petgal-hero'),
  heading('tpl-petgal-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '갤러리', 2, '#123b63', 'left'),
  ...imgNodes,
]);

export const petGalleryTemplate: PageTemplate = {
  id: 'pet-gallery',
  name: '동물병원 갤러리',
  category: 'pet',
  subcategory: 'gallery',
  description: '행복한 환자 갤러리 + 8장 반려동물 사진',
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
