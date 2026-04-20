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
const MARGIN = 80;
const HEADER_H = 140;

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

interface GalleryItem {
  key: string;
  alt: string;
  caption: string;
}

const galleryItems: GalleryItem[] = [
  { key: 'interior-1', alt: '레스토랑 메인 홀 인테리어', caption: '모던 인테리어의 메인 다이닝 홀' },
  { key: 'dish-signature', alt: '시그니처 요리', caption: '셰프의 시그니처 한우 스테이크' },
  { key: 'interior-2', alt: '프라이빗 룸', caption: '편안한 프라이빗 다이닝 룸' },
  { key: 'dish-pasta', alt: '수제 파스타', caption: '매일 만드는 수제 파스타' },
  { key: 'bar', alt: '바 카운터', caption: '시그니처 칵테일을 즐기는 바' },
  { key: 'dish-dessert', alt: '디저트 플레이팅', caption: '아름다운 디저트 플레이팅' },
  { key: 'terrace', alt: '테라스 좌석', caption: '야외 테라스 다이닝' },
  { key: 'dish-seafood', alt: '해산물 요리', caption: '신선한 해산물 요리' },
];

const CARD_W = 270;
const CARD_H = 320;
const GAP = 24;
const COLS = 4;

function buildGalleryCard(item: GalleryItem, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-restgallery-card-${item.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-img`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 240 },
      src: `/images/placeholder-gallery-${item.key}.jpg`,
      alt: item.alt,
      style: { borderRadius: 0 },
    }),
    createTextNode({
      id: `${cid}-caption`,
      parentId: cid,
      rect: { x: 16, y: 252, width: CARD_W - 32, height: 48 },
      text: item.caption,
      fontSize: 14,
      color: '#374151',
      align: 'center',
      lineHeight: 1.5,
    }),
  ];
}

const ROWS = Math.ceil(galleryItems.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restgallery-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '갤러리',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restgallery-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '우리 레스토랑의 공간과 요리를 사진으로 만나보세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...galleryItems.flatMap((item, i) => buildGalleryCard(item, i)),
]);

export const restaurantGalleryTemplate: PageTemplate = {
  id: 'restaurant-gallery',
  name: '레스토랑 갤러리',
  category: 'restaurant',
  subcategory: 'gallery',
  description: '포토 그리드(8개 음식/인테리어 이미지), 캡션',
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
