import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';
import { buildCategoryProofSections, SUBPAGE_PROOF_HEIGHT } from '../_shared/subpage-proof-sections';

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
    content: { text, level, color, align, fontFamily: 'Noto Serif KR' },
  };
}

const MARGIN = 80;
const HEADER_H = 140;
const TIER_W = 350;
const TIER_H = 480;
const GAP = 40;
const TIERS_Y = HEADER_H + 40;
const STAGE_H = TIERS_Y + TIER_H + 80;

interface PriceTier {
  key: string;
  name: string;
  price: string;
  desc: string;
  features: string;
  highlight: boolean;
}

const tiers: PriceTier[] = [
  {
    key: 'basic',
    name: '베이직 패키지',
    price: '₩89,000',
    desc: '기본 뷰티 케어',
    features: '커트 + 기본 스타일링\n기본 네일 케어\n두피 진단\n음료 서비스',
    highlight: false,
  },
  {
    key: 'premium',
    name: '프리미엄 패키지',
    price: '₩159,000',
    desc: '인기 추천 패키지',
    features: '커트 + 염색/펌\n젤 네일 아트\n페이셜 기본 케어\n두피 트리트먼트\n음료 + 간식 서비스',
    highlight: true,
  },
  {
    key: 'vip',
    name: 'VIP 패키지',
    price: '₩259,000',
    desc: '풀 뷰티 케어',
    features: '커트 + 염색 + 펌\n프리미엄 네일 아트\n프리미엄 페이셜\n두피 스파 트리트먼트\n메이크업 포함\nVIP 라운지 이용',
    highlight: false,
  },
];

function buildTierCard(tier: PriceTier, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (TIER_W + GAP);
  const cid = `tpl-beautyprice-tier-${tier.key}`;
  const bg = tier.highlight ? '#2b1c18' : '#ffffff';
  const titleColor = tier.highlight ? '#ffffff' : '#2b1c18';
  const textColor = tier.highlight ? 'rgba(255,255,255,0.85)' : '#2b1c18';
  const priceColor = '#b07d3f';

  return [
    createContainerNode({
      id: cid,
      rect: { x, y: TIERS_Y, width: TIER_W, height: TIER_H },
      background: bg,
      borderRadius: 16,
      borderColor: tier.highlight ? '#2b1c18' : '#e6d3cd',
      borderWidth: tier.highlight ? 0 : 1,
      padding: 32,
    }),
    heading(`${cid}-name`, { x: 32, y: 32, width: 286, height: 36 }, tier.name, 3, titleColor, 'center', cid),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 32, y: 80, width: 286, height: 48 },
      text: tier.price,
      fontSize: 36,
      color: priceColor,
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 32, y: 136, width: 286, height: 28 },
      text: tier.desc,
      fontSize: 14,
      color: textColor,
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-features`,
      parentId: cid,
      rect: { x: 32, y: 180, width: 286, height: 200 },
      text: tier.features,
      fontSize: 14,
      color: textColor,
      lineHeight: 1.8,
      align: 'center',
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 75, y: 410, width: 200, height: 44 },
      label: '예약하기',
      href: '#',
      variant: tier.highlight ? 'primary' : 'outline',
      style: { backgroundColor: tier.highlight ? '#b07d3f' : 'transparent', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-beautyprice-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '가격표 & 패키지',
    1,
    '#2b1c18',
  ),
  createTextNode({
    id: 'tpl-beautyprice-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '합리적인 가격으로 프리미엄 뷰티 서비스를 경험하세요.',
    fontSize: 16,
    color: '#80655e',
    lineHeight: 1.4,
  }),
  ...tiers.flatMap((t, i) => buildTierCard(t, i)),
  ...buildCategoryProofSections('beauty', 'beauty-pricing', STAGE_H),
]);

export const beautyPricingTemplate: PageTemplate = {
  id: 'beauty-pricing',
  name: '가격표 & 패키지',
  category: 'beauty',
  subcategory: 'pricing',
  description: '가격표 제목 + 3개 패키지 티어(이름/가격/설명/기능 목록/예약 버튼)',
  document: {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-04-15T00:00:00+09:00',
    updatedBy: 'template-system',
    stageWidth: W,
    stageHeight: STAGE_H + SUBPAGE_PROOF_HEIGHT,
    nodes,
  },
};
