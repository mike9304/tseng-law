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
const CONTENT_W = W - MARGIN * 2;

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
const STEP_H = 120;
const STEP_GAP = 16;

interface Step {
  key: string;
  num: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  { key: 'budget', num: '01', title: '예산 설정', desc: '자금 계획을 세우고, 대출 가능 금액을 확인합니다.' },
  { key: 'search', num: '02', title: '매물 검색', desc: '원하는 지역, 유형, 조건에 맞는 매물을 검색합니다.' },
  { key: 'visit', num: '03', title: '현장 방문', desc: '관심 매물을 직접 방문하여 상태를 확인합니다.' },
  { key: 'contract', num: '04', title: '계약 체결', desc: '계약 조건을 협의하고, 매매 계약서를 작성합니다.' },
  { key: 'loan', num: '05', title: '대출 실행', desc: '주택담보대출 등 필요한 자금을 마련합니다.' },
  { key: 'transfer', num: '06', title: '소유권 이전', desc: '잔금을 지급하고, 등기를 통해 소유권을 이전합니다.' },
];

function buildStepCard(step: Step, idx: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + idx * (STEP_H + STEP_GAP);
  const cid = `tpl-rebuying-step-${step.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x: MARGIN, y, width: CONTENT_W, height: STEP_H },
      background: idx % 2 === 0 ? '#f3f4f6' : '#ffffff',
      borderRadius: 10,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    createTextNode({
      id: `${cid}-num`,
      parentId: cid,
      rect: { x: 24, y: 20, width: 60, height: 40 },
      text: step.num,
      fontSize: 32,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    heading(`${cid}-title`, { x: 100, y: 20, width: 300, height: 32 }, step.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 100, y: 60, width: CONTENT_W - 160, height: 40 },
      text: step.desc,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
}

const MORTGAGE_Y = HEADER_H + 40 + steps.length * (STEP_H + STEP_GAP) + 60;
const MORTGAGE_H = 280;
const STAGE_H = MORTGAGE_Y + MORTGAGE_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-rebuying-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '매수 가이드',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-rebuying-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '처음 집을 구매하시는 분을 위한 단계별 안내입니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  ...steps.flatMap((s, i) => buildStepCard(s, i)),

  /* ── Mortgage info ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-rebuying-mortgage',
    rect: { x: 0, y: MORTGAGE_Y, width: W, height: MORTGAGE_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-rebuying-mortgage-title',
    { x: MARGIN, y: 40, width: 400, height: 44 },
    '대출 정보',
    2,
    '#ffffff',
    'left',
    'tpl-rebuying-mortgage',
  ),
  createTextNode({
    id: 'tpl-rebuying-mortgage-desc',
    parentId: 'tpl-rebuying-mortgage',
    rect: { x: MARGIN, y: 100, width: 800, height: 80 },
    text: '주택담보대출, 전세자금대출 등 다양한 대출 상품을 비교해 드립니다. 금리, 한도, 상환 방식 등을 종합적으로 분석하여 최적의 대출 전략을 제안합니다.',
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 1.7,
  }),
  createButtonNode({
    id: 'tpl-rebuying-mortgage-btn',
    parentId: 'tpl-rebuying-mortgage',
    rect: { x: MARGIN, y: 210, width: 180, height: 48 },
    label: '대출 상담 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const realestateBuyingTemplate: PageTemplate = {
  id: 'realestate-buying',
  name: '매수 가이드',
  category: 'realestate',
  subcategory: 'buying',
  description: '매수 6단계 프로세스 + 대출 정보',
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
