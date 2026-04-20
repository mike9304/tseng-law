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
const CTA_Y = TIERS_Y + TIERS_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

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
  { name: '베이직 패키지', price: '인당 15,000원~', desc: '커피 3종 + 미니 페이스트리 세트. 소규모 미팅에 적합합니다. 최소 10인부터 주문 가능.' },
  { name: '프리미엄 패키지', price: '인당 25,000원~', desc: '스페셜티 커피 + 수제 샌드위치 + 디저트. 워크숍, 세미나에 최적화된 구성입니다.' },
  { name: '럭셔리 패키지', price: '인당 40,000원~', desc: '풀 케이터링 서비스. 바리스타 출장, 라떼아트 시연, 프리미엄 디저트 뷔페 포함.' },
];

const tierW = 360;
const gapX = 30;

const tierCards: BuilderCanvasNode[] = tiers.flatMap((t, i) => {
  const x = 80 + i * (tierW + gapX);
  const prefix = `tpl-cafecater-tier-${i + 1}`;
  const bg = i === 1 ? '#123b63' : '#f3f4f6';
  const textColor = i === 1 ? '#ffffff' : '#1f2937';
  const titleColor = i === 1 ? '#ffffff' : '#123b63';
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
      color: '#e8a838',
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
      label: '주문하기',
      href: '#',
      variant: i === 1 ? 'secondary' : 'primary',
      style: { backgroundColor: '#e8a838', borderRadius: 6 },
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-cafecater-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-cafecater-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '케이터링 서비스', 1, '#ffffff', 'left', 'tpl-cafecater-hero'),
  createTextNode({
    id: 'tpl-cafecater-hero-sub',
    parentId: 'tpl-cafecater-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '오피스 미팅, 행사, 파티를 위한 맞춤 케이터링을 제공합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-cafecater-tiers-title', { x: 80, y: TIERS_Y, width: 400, height: 50 }, '케이터링 패키지', 2, '#123b63', 'left'),
  ...tierCards,

  /* ── Order CTA ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-cafecater-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-cafecater-cta-text',
    parentId: 'tpl-cafecater-cta',
    rect: { x: 80, y: 50, width: 600, height: 44 },
    text: '맞춤 견적이 필요하신가요? 편하게 문의해 주세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-cafecater-cta-btn',
    parentId: 'tpl-cafecater-cta',
    rect: { x: 80, y: 110, width: 180, height: 48 },
    label: '견적 문의',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const cafeCateringTemplate: PageTemplate = {
  id: 'cafe-catering',
  name: '카페 케이터링',
  category: 'cafe',
  subcategory: 'catering',
  description: '오피스 케이터링 + 이벤트 패키지(3단계) + 주문 CTA',
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
