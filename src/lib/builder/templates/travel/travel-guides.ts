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
const CARD_W = 550;
const CARD_H = 300;
const GAP = 24;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface Guide {
  key: string;
  title: string;
  region: string;
  desc: string;
  topics: string;
}

const guides: Guide[] = [
  { key: 'japan', title: '일본 여행 완벽 가이드', region: '아시아', desc: '도쿄, 오사카, 교토, 후쿠오카 등 일본 주요 도시별 추천 코스와 여행 팁을 총정리했습니다.', topics: '교통 · 숙소 · 맛집 · 쇼핑 · 온천' },
  { key: 'europe', title: '유럽 배낭여행 가이드', region: '유럽', desc: '유레일 패스 활용법부터 주요 도시별 추천 동선, 예산 관리까지 유럽 배낭여행 A to Z.', topics: '이동 · 예산 · 숙박 · 관광 · 안전' },
  { key: 'southeast-asia', title: '동남아시아 힐링 가이드', region: '동남아시아', desc: '태국, 베트남, 인도네시아, 필리핀 등 동남아시아 인기 여행지의 액티비티와 리조트 정보.', topics: '비치 · 리조트 · 맛집 · 액티비티 · 비자' },
  { key: 'america', title: '미국 로드트립 가이드', region: '북미', desc: '뉴욕에서 LA까지, 하와이부터 알래스카까지 미국 대륙 횡단 로드트립 필수 가이드.', topics: '렌터카 · 루트 · 국립공원 · 도시 · 팁' },
];

function buildGuideCard(guide: Guide, idx: number): BuilderCanvasNode[] {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-travelguide-card-${guide.key}`;

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
      rect: { x: 0, y: 0, width: 220, height: CARD_H },
      src: `/images/placeholder-guide-${guide.key}.jpg`,
      alt: `${guide.title} 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-title`, { x: 240, y: 24, width: 290, height: 40 }, guide.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-region`,
      parentId: cid,
      rect: { x: 240, y: 70, width: 100, height: 22 },
      text: guide.region,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'medium',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 240, y: 100, width: 290, height: 80 },
      text: guide.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createTextNode({
      id: `${cid}-topics`,
      parentId: cid,
      rect: { x: 240, y: 195, width: 290, height: 22 },
      text: guide.topics,
      fontSize: 12,
      color: '#6b7280',
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 240, y: 240, width: 130, height: 36 },
      label: '가이드 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-travelguide-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '여행 가이드',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-travelguide-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '지역별 여행 가이드로 더 알찬 여행을 준비하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...guides.flatMap((g, i) => buildGuideCard(g, i)),
]);

export const travelGuidesTemplate: PageTemplate = {
  id: 'travel-guides',
  name: '여행 가이드',
  category: 'travel',
  subcategory: 'guides',
  description: '가이드 제목 + 4개 목적지 가이드 카드(이미지 + 제목 + 지역 + 설명 + 토픽)',
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
