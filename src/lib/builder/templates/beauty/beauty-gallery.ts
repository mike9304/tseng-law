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
  { key: 'before-after-1', alt: '헤어 비포 애프터 1', caption: '볼륨 펌 시술 전후' },
  { key: 'before-after-2', alt: '헤어 비포 애프터 2', caption: '옴브레 염색 변신' },
  { key: 'before-after-3', alt: '네일 비포 애프터', caption: '네일 아트 시술 전후' },
  { key: 'before-after-4', alt: '피부 비포 애프터', caption: '페이셜 케어 효과' },
  { key: 'before-after-5', alt: '헤어 비포 애프터 3', caption: '매직 스트레이트 변신' },
  { key: 'before-after-6', alt: '메이크업 비포 애프터', caption: '웨딩 메이크업 전후' },
  { key: 'before-after-7', alt: '커트 비포 애프터', caption: '레이어드 커트 변신' },
  { key: 'before-after-8', alt: '풀 메이크오버', caption: '토탈 뷰티 변신' },
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
  const cid = `tpl-beautygal-card-${item.key}`;

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
      src: `/images/placeholder-beauty-${item.key}.jpg`,
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
    'tpl-beautygal-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '비포 & 애프터 갤러리',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-beautygal-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '시술 전후 변화를 직접 확인해 보세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...galleryItems.flatMap((item, i) => buildGalleryCard(item, i)),
]);

export const beautyGalleryTemplate: PageTemplate = {
  id: 'beauty-gallery',
  name: '비포 & 애프터 갤러리',
  category: 'beauty',
  subcategory: 'gallery',
  description: '변신 갤러리 제목 + 8개 비포/애프터 이미지 카드, 캡션',
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
