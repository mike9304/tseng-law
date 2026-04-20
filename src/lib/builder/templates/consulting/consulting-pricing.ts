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
const HERO_H = 300;
const TIERS_Y = HERO_H + 80;
const TIERS_H = 480;
const STAGE_H = TIERS_Y + TIERS_H + 80;

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

const tiers = [
  { name: '시간제 자문', price: '시간당 30만원~', desc: '단기 자문이 필요한 경우 시간 단위로 전문 컨설턴트를 배정합니다. 유연한 일정 조율 가능.', cta: '문의하기' },
  { name: '프로젝트 기반', price: '프로젝트당 견적', desc: '명확한 목표와 기간이 있는 프로젝트에 최적화된 패키지입니다. 킥오프부터 완료까지 전담팀 운영.', cta: '견적 요청' },
  { name: '리테이너 계약', price: '월 500만원~', desc: '지속적인 자문이 필요한 기업을 위한 월정액 서비스입니다. 우선 대응, 정기 보고 포함.', cta: '상담 신청' },
];

const tierW = 360;
const gapX = 30;

const tierCards: BuilderCanvasNode[] = tiers.flatMap((t, i) => {
  const x = 80 + i * (tierW + gapX);
  const prefix = `tpl-consprc-tier-${i + 1}`;
  const bg = i === 1 ? '#123b63' : '#f3f4f6';
  const textColor = i === 1 ? '#ffffff' : '#1f2937';
  const titleColor = i === 1 ? '#ffffff' : '#123b63';
  const priceColor = i === 1 ? '#e8a838' : '#e8a838';
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: TIERS_Y + 70, width: tierW, height: 380 },
      background: bg,
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 312, height: 36 }, t.name, 3, titleColor, 'center', prefix),
    createTextNode({
      id: `${prefix}-price`,
      parentId: prefix,
      rect: { x: 24, y: 76, width: 312, height: 40 },
      text: t.price,
      fontSize: 22,
      color: priceColor,
      fontWeight: 'bold',
      align: 'center',
      lineHeight: 1.4,
    }),
    createTextNode({
      id: `${prefix}-desc`,
      parentId: prefix,
      rect: { x: 24, y: 140, width: 312, height: 120 },
      text: t.desc,
      fontSize: 14,
      color: textColor,
      lineHeight: 1.6,
      align: 'center',
    }),
    createButtonNode({
      id: `${prefix}-btn`,
      parentId: prefix,
      rect: { x: 80, y: 300, width: 200, height: 48 },
      label: t.cta,
      href: '#',
      variant: i === 1 ? 'secondary' : 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-consprc-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-consprc-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '요금 안내', 1, '#ffffff', 'left', 'tpl-consprc-hero'),
  createTextNode({
    id: 'tpl-consprc-hero-sub',
    parentId: 'tpl-consprc-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '프로젝트 규모와 니즈에 맞는 유연한 요금 체계를 제공합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-consprc-tiers-title', { x: 80, y: TIERS_Y, width: 400, height: 50 }, '계약 모델', 2, '#123b63', 'left'),
  ...tierCards,
]);

export const consultingPricingTemplate: PageTemplate = {
  id: 'consulting-pricing',
  name: '컨설팅 요금',
  category: 'consulting',
  subcategory: 'pricing',
  description: '계약 모델(3단계): 시간제/프로젝트/리테이너',
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
