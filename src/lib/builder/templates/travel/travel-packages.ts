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
const CARD_W = 370;
const CARD_H = 420;
const GAP = 24;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface TourPackage {
  key: string;
  name: string;
  duration: string;
  price: string;
  highlights: string;
}

const packages: TourPackage[] = [
  { key: 'japan-classic', name: '일본 클래식 투어', duration: '5박 6일', price: '₩1,290,000~', highlights: '도쿄 · 교토 · 오사카\n신칸센 이동 포함\n전통 료칸 1박 포함' },
  { key: 'europe-highlight', name: '유럽 하이라이트', duration: '9박 11일', price: '₩3,490,000~', highlights: '파리 · 로마 · 바르셀로나\n도시 간 항공 포함\n주요 명소 입장권 포함' },
  { key: 'bali-healing', name: '발리 힐링 리조트', duration: '4박 5일', price: '₩990,000~', highlights: '풀빌라 리조트 숙박\n스파 2회 포함\n우붓 데이투어 포함' },
  { key: 'hawaii-family', name: '하와이 가족 여행', duration: '6박 8일', price: '₩2,890,000~', highlights: '와이키키 비치 호텔\n스노클링 · 화산투어\n가족 BBQ 포함' },
  { key: 'vietnam-food', name: '베트남 미식 투어', duration: '4박 5일', price: '₩790,000~', highlights: '하노이 · 다낭 · 호이안\n쿠킹 클래스 포함\n현지 맛집 가이드 투어' },
  { key: 'swiss-adventure', name: '스위스 알프스 모험', duration: '7박 9일', price: '₩4,190,000~', highlights: '융프라우 · 마터호른\n빙하 특급 열차\n하이킹 가이드 포함' },
];

function buildPackageCard(pkg: TourPackage, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-travelpkg-card-${pkg.key}`;

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
      rect: { x: 0, y: 0, width: CARD_W, height: 180 },
      src: `/images/placeholder-pkg-${pkg.key}.jpg`,
      alt: `${pkg.name} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-name`, { x: 20, y: 196, width: 250, height: 36 }, pkg.name, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-duration`,
      parentId: cid,
      rect: { x: 20, y: 236, width: 100, height: 22 },
      text: pkg.duration,
      fontSize: 13,
      color: '#6b7280',
      fontWeight: 'medium',
    }),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 220, y: 236, width: 130, height: 22 },
      text: pkg.price,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'right',
    }),
    createTextNode({
      id: `${cid}-highlights`,
      parentId: cid,
      rect: { x: 20, y: 268, width: 330, height: 80 },
      text: pkg.highlights,
      fontSize: 13,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 20, y: 370, width: 120, height: 36 },
      label: '상세 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-travelpkg-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '투어 패키지',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-travelpkg-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '엄선된 투어 패키지로 편리하고 알찬 여행을 즐기세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...packages.flatMap((p, i) => buildPackageCard(p, i)),
]);

export const travelPackagesTemplate: PageTemplate = {
  id: 'travel-packages',
  name: '투어 패키지',
  category: 'travel',
  subcategory: 'packages',
  description: '패키지 제목 + 6개 투어 카드(이미지 + 이름 + 기간/가격 + 하이라이트)',
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
