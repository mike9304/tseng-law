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

const MARGIN = 80;
const HEADER_H = 140;
const CARD_W = 260;
const CARD_H = 280;
const GAP = 24;
const COLS = 4;

interface ServiceItem {
  key: string;
  title: string;
  price: string;
  desc: string;
}

const services: ServiceItem[] = [
  { key: 'cut', title: '커트', price: '₩35,000~', desc: '여성/남성 커트, 앞머리 커트, 어린이 커트 등 맞춤 스타일링' },
  { key: 'color', title: '염색', price: '₩80,000~', desc: '전체 염색, 부분 염색, 탈색, 옴브레 등 다양한 컬러링' },
  { key: 'perm', title: '펌', price: '₩100,000~', desc: '디지털 펌, 볼륨 펌, 매직 스트레이트 등 모발 시술' },
  { key: 'treatment', title: '트리트먼트', price: '₩50,000~', desc: '케라틴 트리트먼트, 단백질 케어, 두피 관리 프로그램' },
  { key: 'nail-gel', title: '젤 네일', price: '₩45,000~', desc: '원컬러, 그라데이션, 프렌치 등 젤 네일 아트' },
  { key: 'nail-art', title: '네일 아트', price: '₩60,000~', desc: '캐릭터, 플라워, 글리터 등 다양한 네일 디자인' },
  { key: 'facial', title: '페이셜 케어', price: '₩70,000~', desc: '클렌징, 필링, 보습, 리프팅 등 맞춤 피부 관리' },
  { key: 'makeup', title: '메이크업', price: '₩90,000~', desc: '웨딩, 촬영, 파티, 데일리 등 전문 메이크업 서비스' },
];

function buildServiceCard(item: ServiceItem, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-beautysvc-card-${item.key}`;

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
      rect: { x: 0, y: 0, width: CARD_W, height: 140 },
      src: `/images/placeholder-beauty-${item.key}.jpg`,
      alt: `${item.title} 서비스 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-title`, { x: 16, y: 152, width: 170, height: 30 }, item.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 190, y: 152, width: 60, height: 30 },
      text: item.price,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'right',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 16, y: 192, width: 228, height: 60 },
      text: item.desc,
      fontSize: 13,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
}

const ROWS = Math.ceil(services.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-beautysvc-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '서비스 메뉴',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-beautysvc-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '헤어, 네일, 피부, 메이크업 전 분야의 뷰티 서비스를 제공합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...services.flatMap((s, i) => buildServiceCard(s, i)),
]);

export const beautyServicesTemplate: PageTemplate = {
  id: 'beauty-services',
  name: '뷰티 서비스 메뉴',
  category: 'beauty',
  subcategory: 'services',
  description: '서비스 메뉴 제목 + 8개 서비스 카드(이미지 + 이름 + 가격 + 설명)',
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
