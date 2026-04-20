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
const COMPARE_Y = TIERS_Y + TIERS_H + 80;
const COMPARE_H = 300;
const STAGE_H = COMPARE_Y + COMPARE_H + 80;

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
  { name: 'Free', price: '무료', desc: '개인 사용자, 기본 기능\n사용자 1명\n프로젝트 3개\n기본 분석', cta: '무료 시작' },
  { name: 'Pro', price: '월 49,000원', desc: '성장하는 팀을 위한 플랜\n사용자 10명\n무제한 프로젝트\n고급 분석 + API', cta: '무료 체험' },
  { name: 'Enterprise', price: '맞춤 견적', desc: '대규모 조직 전용\n무제한 사용자\n전용 서버\nSSO + 감사 로그 + 전담 지원', cta: '문의하기' },
];

const tierW = 360;
const gapX = 30;

const tierCards: BuilderCanvasNode[] = tiers.flatMap((t, i) => {
  const x = 80 + i * (tierW + gapX);
  const prefix = `tpl-stupprc-tier-${i + 1}`;
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
      rect: { x: 24, y: 130, width: 312, height: 130 },
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
    id: 'tpl-stupprc-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupprc-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '요금제', 1, '#ffffff', 'left', 'tpl-stupprc-hero'),
  createTextNode({
    id: 'tpl-stupprc-hero-sub',
    parentId: 'tpl-stupprc-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '팀 규모와 니즈에 맞는 요금제를 선택하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-stupprc-tiers-title', { x: 80, y: TIERS_Y, width: 400, height: 50 }, '플랜 비교', 2, '#123b63', 'left'),
  ...tierCards,

  /* ── Feature comparison ─────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stupprc-compare',
    rect: { x: 0, y: COMPARE_Y, width: W, height: COMPARE_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-stupprc-compare-title', { x: 80, y: 40, width: 400, height: 50 }, '기능 비교표', 2, '#123b63', 'left', 'tpl-stupprc-compare'),
  createTextNode({
    id: 'tpl-stupprc-compare-desc',
    parentId: 'tpl-stupprc-compare',
    rect: { x: 80, y: 100, width: 1000, height: 160 },
    text: '기본 분석: Free / Pro / Enterprise\nAPI 연동: - / Pro / Enterprise\nSSO: - / - / Enterprise\n전담 지원: - / - / Enterprise\n워크플로우 자동화: 3개 / 무제한 / 무제한\n사용자 수: 1명 / 10명 / 무제한',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.7,
  }),
]);

export const startupPricingTemplate: PageTemplate = {
  id: 'startup-pricing',
  name: '스타트업 요금제',
  category: 'startup',
  subcategory: 'pricing',
  description: 'SaaS 요금(3단계): Free/Pro/Enterprise + 기능 비교표',
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
