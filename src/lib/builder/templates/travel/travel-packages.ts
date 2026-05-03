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
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-travelpackages-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-travelpackages-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-travelpackages-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-proof-label', parentId: 'tpl-travelpackages-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-proof-title', parentId: 'tpl-travelpackages-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'travel packages 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-proof-copy', parentId: 'tpl-travelpackages-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-travelpackages-wix-metric-1', parentId: 'tpl-travelpackages-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-metric-1-value', parentId: 'tpl-travelpackages-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-metric-1-label', parentId: 'tpl-travelpackages-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelpackages-wix-metric-2', parentId: 'tpl-travelpackages-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-metric-2-value', parentId: 'tpl-travelpackages-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-metric-2-label', parentId: 'tpl-travelpackages-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelpackages-wix-metric-3', parentId: 'tpl-travelpackages-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-metric-3-value', parentId: 'tpl-travelpackages-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-metric-3-label', parentId: 'tpl-travelpackages-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelpackages-wix-metric-4', parentId: 'tpl-travelpackages-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-metric-4-value', parentId: 'tpl-travelpackages-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-metric-4-label', parentId: 'tpl-travelpackages-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-showcase-label', parentId: 'tpl-travelpackages-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-showcase-title', parentId: 'tpl-travelpackages-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-showcase-copy', parentId: 'tpl-travelpackages-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-travelpackages-wix-showcase-visual', parentId: 'tpl-travelpackages-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-showcase-visual-title', parentId: 'tpl-travelpackages-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-showcase-visual-copy', parentId: 'tpl-travelpackages-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-travelpackages-wix-showcase-card-1', parentId: 'tpl-travelpackages-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-travelpackages-wix-showcase-card-1-title', parentId: 'tpl-travelpackages-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
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
    stageHeight: STAGE_H + 1960,
    nodes,
  },
};
