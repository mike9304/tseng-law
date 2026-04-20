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

const HEADER_H = 140;
const CARD_W = 270;
const CARD_H = 320;
const GAP = 24;
const COLS = 4;

interface GalleryItem {
  key: string;
  alt: string;
  caption: string;
}

const galleryItems: GalleryItem[] = [
  { key: 'campus-main', alt: '캠퍼스 본관', caption: '역사와 전통의 본관 건물' },
  { key: 'classroom', alt: '스마트 강의실', caption: '최신 장비를 갖춘 스마트 교실' },
  { key: 'library', alt: '도서관 내부', caption: '24시간 운영하는 학술 도서관' },
  { key: 'lab', alt: '실습실', caption: '전공별 전문 실습실' },
  { key: 'cafeteria', alt: '학생 식당', caption: '다양한 메뉴의 학생 식당' },
  { key: 'gym', alt: '체육관', caption: '현대식 실내 체육관' },
  { key: 'dormitory', alt: '기숙사', caption: '쾌적한 기숙사 시설' },
  { key: 'garden', alt: '캠퍼스 정원', caption: '아름다운 캠퍼스 정원' },
];

function buildGalleryCard(item: GalleryItem, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-edugallery-card-${item.key}`;

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
      src: `/images/placeholder-edu-${item.key}.jpg`,
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
  heading('tpl-edugallery-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '캠퍼스 갤러리', 1, '#123b63'),
  createTextNode({
    id: 'tpl-edugallery-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '캠퍼스와 교실의 모습을 사진으로 만나보세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...galleryItems.flatMap((item, i) => buildGalleryCard(item, i)),
]);

export const educationGalleryTemplate: PageTemplate = {
  id: 'education-gallery',
  name: '캠퍼스 갤러리',
  category: 'education',
  subcategory: 'gallery',
  description: '캠퍼스/교실 사진 + 8개 이미지 카드',
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
