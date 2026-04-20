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
  { key: 'santorini', alt: '산토리니 석양', caption: '그리스 산토리니의 아름다운 석양' },
  { key: 'fuji', alt: '후지산', caption: '벚꽃과 함께한 후지산 풍경' },
  { key: 'maldives', alt: '몰디브 수상가옥', caption: '몰디브 럭셔리 수상 빌라' },
  { key: 'machu-picchu', alt: '마추픽추', caption: '페루 마추픽추의 장엄한 전경' },
  { key: 'aurora', alt: '오로라', caption: '아이슬란드에서 만난 오로라' },
  { key: 'safari', alt: '아프리카 사파리', caption: '케냐 마사이마라 사파리 투어' },
  { key: 'venice', alt: '베니스 운하', caption: '이탈리아 베네치아 곤돌라 투어' },
  { key: 'angkor', alt: '앙코르와트', caption: '캄보디아 앙코르와트 일출' },
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
  const cid = `tpl-travelgal-card-${item.key}`;

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
      src: `/images/placeholder-travel-${item.key}.jpg`,
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
    'tpl-travelgal-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '여행 갤러리',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-travelgal-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '세계 각지의 아름다운 풍경을 사진으로 만나보세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...galleryItems.flatMap((item, i) => buildGalleryCard(item, i)),
]);

export const travelGalleryTemplate: PageTemplate = {
  id: 'travel-gallery',
  name: '여행 갤러리',
  category: 'travel',
  subcategory: 'gallery',
  description: '여행 갤러리 제목 + 8개 목적지 사진 카드, 캡션',
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
