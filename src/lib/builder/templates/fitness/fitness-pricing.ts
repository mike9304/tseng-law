import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
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
const TIER_W = 350;
const TIER_H = 480;
const GAP = 40;
const TIERS_Y = HEADER_H + 40;
const STAGE_H = TIERS_Y + TIER_H + 80;

interface PriceTier {
  key: string;
  name: string;
  price: string;
  period: string;
  features: string;
  highlight: boolean;
}

const tiers: PriceTier[] = [
  {
    key: 'basic',
    name: '베이직 멤버십',
    price: '₩79,000',
    period: '/월',
    features: '전 시설 자유 이용\n그룹 클래스 월 4회\n락커 이용\n주차 1시간',
    highlight: false,
  },
  {
    key: 'premium',
    name: '프리미엄 멤버십',
    price: '₩149,000',
    period: '/월',
    features: '전 시설 자유 이용\n그룹 클래스 무제한\nPT 월 4회 포함\n락커 + 사우나\n주차 2시간\n바디 분석 월 1회',
    highlight: true,
  },
  {
    key: 'vip',
    name: 'VIP 멤버십',
    price: '₩249,000',
    period: '/월',
    features: '전 시설 자유 이용\n그룹 클래스 무제한\nPT 월 8회 포함\n전용 락커 + 사우나\n무제한 주차\n바디 분석 + 영양 상담\nVIP 라운지 이용',
    highlight: false,
  },
];

function buildTierCard(tier: PriceTier, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (TIER_W + GAP);
  const cid = `tpl-fitprice-tier-${tier.key}`;
  const bg = tier.highlight ? '#123b63' : '#ffffff';
  const titleColor = tier.highlight ? '#ffffff' : '#123b63';
  const textColor = tier.highlight ? 'rgba(255,255,255,0.85)' : '#374151';

  return [
    createContainerNode({
      id: cid,
      rect: { x, y: TIERS_Y, width: TIER_W, height: TIER_H },
      background: bg,
      borderRadius: 16,
      borderColor: tier.highlight ? '#123b63' : '#e2e8f0',
      borderWidth: tier.highlight ? 0 : 1,
      padding: 32,
    }),
    heading(`${cid}-name`, { x: 32, y: 32, width: 286, height: 36 }, tier.name, 3, titleColor, 'center', cid),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 32, y: 80, width: 220, height: 48 },
      text: tier.price,
      fontSize: 36,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'right',
    }),
    createTextNode({
      id: `${cid}-period`,
      parentId: cid,
      rect: { x: 252, y: 96, width: 60, height: 28 },
      text: tier.period,
      fontSize: 16,
      color: textColor,
      align: 'left',
    }),
    createTextNode({
      id: `${cid}-features`,
      parentId: cid,
      rect: { x: 32, y: 150, width: 286, height: 230 },
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
      label: '가입하기',
      href: '#',
      variant: tier.highlight ? 'primary' : 'outline',
      style: { backgroundColor: tier.highlight ? '#e8a838' : 'transparent', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-fitprice-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '멤버십 가격',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-fitprice-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '나에게 맞는 멤버십을 선택하고 건강한 변화를 시작하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...tiers.flatMap((t, i) => buildTierCard(t, i)),
]);

export const fitnessPricingTemplate: PageTemplate = {
  id: 'fitness-pricing',
  name: '멤버십 가격',
  category: 'fitness',
  subcategory: 'pricing',
  description: '멤버십 제목 + 3개 가격 티어(이름/가격/기능 비교/가입 버튼)',
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
