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
  { key: 'freeweight', alt: '프리웨이트 존', caption: '최신 장비가 갖춰진 프리웨이트 구역' },
  { key: 'cardio', alt: '유산소 존', caption: '넓은 유산소 트레이닝 공간' },
  { key: 'studio-yoga', alt: '요가 스튜디오', caption: '자연광이 들어오는 요가 스튜디오' },
  { key: 'studio-dance', alt: '댄스 스튜디오', caption: '거울벽 댄스 피트니스 스튜디오' },
  { key: 'boxing-ring', alt: '복싱 구역', caption: '복싱 링과 샌드백 구역' },
  { key: 'locker', alt: '락커룸', caption: '깨끗한 샤워실과 락커룸' },
  { key: 'class-hiit', alt: 'HIIT 클래스', caption: '에너지 넘치는 HIIT 수업 현장' },
  { key: 'lounge', alt: '회원 라운지', caption: '운동 후 쉴 수 있는 회원 라운지' },
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
  const cid = `tpl-fitgallery-card-${item.key}`;

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
      src: `/images/placeholder-gym-${item.key}.jpg`,
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
    'tpl-fitgallery-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '시설 갤러리',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-fitgallery-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '최신 장비와 쾌적한 환경을 사진으로 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...galleryItems.flatMap((item, i) => buildGalleryCard(item, i)),
]);

export const fitnessGalleryTemplate: PageTemplate = {
  id: 'fitness-gallery',
  name: '피트니스 갤러리',
  category: 'fitness',
  subcategory: 'gallery',
  description: '시설 갤러리 제목 + 8개 시설/클래스 이미지 카드, 캡션',
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
