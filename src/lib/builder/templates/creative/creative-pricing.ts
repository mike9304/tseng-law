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
const TIER_W = 350;
const TIER_H = 500;
const GAP = 24;
const TIERS_Y = HEADER_H + 40;
const STAGE_H = TIERS_Y + TIER_H + 80;

interface PricingTier {
  key: string;
  title: string;
  price: string;
  features: string;
  featured: boolean;
}

const tiers: PricingTier[] = [
  {
    key: 'starter',
    title: '스타터',
    price: '300만원~',
    features: '로고 디자인\n명함 디자인\n기본 브랜드 가이드\n1회 수정 포함\n납품 기간 2주',
    featured: false,
  },
  {
    key: 'professional',
    title: '프로페셔널',
    price: '800만원~',
    features: '풀 브랜딩 패키지\n반응형 웹사이트\nSNS 템플릿 5종\n3회 수정 포함\n납품 기간 4주\n1개월 사후 지원',
    featured: true,
  },
  {
    key: 'enterprise',
    title: '엔터프라이즈',
    price: '맞춤 견적',
    features: '종합 크리에이티브 솔루션\n웹 + 앱 + 영상\n무제한 수정\n전담 프로젝트 매니저\n3개월 사후 지원\n분기별 리포트',
    featured: false,
  },
];

function buildTierCard(tier: PricingTier, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (TIER_W + GAP);
  const cid = `tpl-creativepricing-tier-${tier.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y: TIERS_Y, width: TIER_W, height: TIER_H },
      background: tier.featured ? '#123b63' : '#ffffff',
      borderRadius: 12,
      borderColor: tier.featured ? '#123b63' : '#e2e8f0',
      borderWidth: 1,
      padding: 32,
    }),
    heading(
      `${cid}-title`,
      { x: 32, y: 24, width: TIER_W - 64, height: 40 },
      tier.title,
      3,
      tier.featured ? '#ffffff' : '#123b63',
      'center',
      cid,
    ),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 32, y: 80, width: TIER_W - 64, height: 44 },
      text: tier.price,
      fontSize: 28,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-features`,
      parentId: cid,
      rect: { x: 32, y: 148, width: TIER_W - 64, height: 260 },
      text: tier.features,
      fontSize: 14,
      color: tier.featured ? 'rgba(255,255,255,0.85)' : '#374151',
      lineHeight: 1.8,
      align: 'center',
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 80, y: 436, width: 180, height: 44 },
      label: '문의하기',
      href: '#',
      variant: tier.featured ? 'primary' : 'outline',
      style: { backgroundColor: tier.featured ? '#e8a838' : 'transparent', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativepricing-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '가격 안내', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativepricing-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '프로젝트 규모에 맞는 최적의 플랜을 선택하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...tiers.flatMap((t, i) => buildTierCard(t, i)),
]);

export const creativePricingTemplate: PageTemplate = {
  id: 'creative-pricing',
  name: '가격 안내',
  category: 'creative',
  subcategory: 'pricing',
  description: '3단계 가격 티어(스타터/프로페셔널/엔터프라이즈) + 기능 비교',
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
