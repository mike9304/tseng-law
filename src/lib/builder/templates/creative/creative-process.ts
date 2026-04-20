import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
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
const STEP_H = 180;
const STEP_GAP = 24;

interface ProcessStep {
  key: string;
  num: string;
  title: string;
  desc: string;
}

const steps: ProcessStep[] = [
  { key: 'discover', num: '01', title: 'Discover (발견)', desc: '클라이언트의 비즈니스, 목표, 타겟 고객을 깊이 이해합니다. 시장 조사와 경쟁 분석을 통해 인사이트를 도출합니다.' },
  { key: 'define', num: '02', title: 'Define (정의)', desc: '프로젝트의 범위, 일정, 핵심 메시지를 정의합니다. 명확한 전략과 방향성을 수립합니다.' },
  { key: 'design', num: '03', title: 'Design (디자인)', desc: '컨셉 시안을 제작하고 피드백을 반영합니다. 사용자 중심의 디자인을 완성합니다.' },
  { key: 'develop', num: '04', title: 'Develop (개발)', desc: '디자인을 실제 제품으로 구현합니다. 웹 개발, 영상 편집, 인쇄물 제작 등을 진행합니다.' },
  { key: 'deliver', num: '05', title: 'Deliver (전달)', desc: '최종 결과물을 전달하고, 런칭을 지원합니다. 성과를 측정하고 개선점을 제안합니다.' },
];

function buildStepCard(step: ProcessStep, idx: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + idx * (STEP_H + STEP_GAP);
  const cid = `tpl-creativeprocess-step-${step.key}`;
  const isOdd = idx % 2 === 1;

  return [
    createContainerNode({
      id: cid,
      rect: { x: MARGIN, y, width: CONTENT_W, height: STEP_H },
      background: isOdd ? '#123b63' : '#f3f4f6',
      borderRadius: 12,
      padding: 32,
    }),
    createTextNode({
      id: `${cid}-num`,
      parentId: cid,
      rect: { x: 32, y: 24, width: 80, height: 50 },
      text: step.num,
      fontSize: 42,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    heading(
      `${cid}-title`,
      { x: 140, y: 24, width: 400, height: 40 },
      step.title,
      3,
      isOdd ? '#ffffff' : '#123b63',
      'left',
      cid,
    ),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 140, y: 80, width: CONTENT_W - 200, height: 70 },
      text: step.desc,
      fontSize: 15,
      color: isOdd ? 'rgba(255,255,255,0.85)' : '#374151',
      lineHeight: 1.6,
    }),
  ];
}

const STAGE_H = HEADER_H + 40 + steps.length * (STEP_H + STEP_GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativeprocess-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '작업 프로세스', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativeprocess-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '체계적인 5단계 프로세스로 최상의 결과물을 만듭니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...steps.flatMap((s, i) => buildStepCard(s, i)),
]);

export const creativeProcessTemplate: PageTemplate = {
  id: 'creative-process',
  name: '작업 프로세스',
  category: 'creative',
  subcategory: 'process',
  description: '5단계 프로세스: 발견, 정의, 디자인, 개발, 전달',
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
