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
const INTRO_Y = HEADER_H + 40;
const INTRO_H = 120;
const POSITIONS_Y = INTRO_Y + INTRO_H + 80;
const POSITION_H = 140;
const GAP = 16;

interface Position {
  key: string;
  title: string;
  type: string;
  desc: string;
}

const positions: Position[] = [
  { key: 'internist', title: '내과 전문의', type: '정규직', desc: '내과 전문의 자격 보유자. 외래 진료 및 입원 환자 관리를 담당합니다.' },
  { key: 'nurse', title: '간호사', type: '정규직', desc: '간호사 면허 소지자. 병동 및 외래 간호 업무를 수행합니다.' },
  { key: 'radiologist', title: '영상의학과 전문의', type: '정규직', desc: 'CT, MRI 등 영상 판독 및 중재시술을 담당합니다.' },
  { key: 'admin', title: '원무행정 직원', type: '정규직', desc: '환자 접수, 수납, 보험 청구 등 원무행정 업무를 수행합니다.' },
];

function buildPositionCard(pos: Position, idx: number): BuilderCanvasNode[] {
  const y = POSITIONS_Y + idx * (POSITION_H + GAP);
  const cid = `tpl-healthcareers-pos-${pos.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x: MARGIN, y, width: CONTENT_W, height: POSITION_H },
      background: '#ffffff',
      borderRadius: 10,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    heading(`${cid}-title`, { x: 24, y: 16, width: 400, height: 32 }, pos.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-type`,
      parentId: cid,
      rect: { x: 24, y: 52, width: 120, height: 24 },
      text: pos.type,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 82, width: CONTENT_W - 80, height: 40 },
      text: pos.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
}

const BENEFITS_Y = POSITIONS_Y + positions.length * (POSITION_H + GAP) + 60;
const BENEFITS_H = 200;
const CTA_Y = BENEFITS_Y + BENEFITS_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-healthcareers-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '채용 안내',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthcareers-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '환자를 위한 최고의 의료 서비스를 함께 만들어갈 인재를 찾습니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  createTextNode({
    id: 'tpl-healthcareers-intro',
    rect: { x: MARGIN, y: INTRO_Y, width: 800, height: INTRO_H },
    text: '우리 병원은 직원의 성장과 복지를 중시합니다. 전문성을 키울 수 있는 교육 기회와 안정적인 근무 환경을 제공합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  heading(
    'tpl-healthcareers-pos-title',
    { x: MARGIN, y: POSITIONS_Y - 50, width: 400, height: 40 },
    '모집 포지션',
    2,
    '#123b63',
  ),
  ...positions.flatMap((pos, i) => buildPositionCard(pos, i)),

  /* ── Benefits ────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthcareers-benefits',
    rect: { x: 0, y: BENEFITS_Y, width: W, height: BENEFITS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-healthcareers-benefits-title',
    { x: MARGIN, y: 40, width: 300, height: 40 },
    '복리후생',
    2,
    '#123b63',
    'left',
    'tpl-healthcareers-benefits',
  ),
  createTextNode({
    id: 'tpl-healthcareers-benefits-desc',
    parentId: 'tpl-healthcareers-benefits',
    rect: { x: MARGIN, y: 100, width: 800, height: 60 },
    text: '4대 보험 완비 | 학술대회 참가 지원 | 식대 지원 | 주차 무료 | 건강검진 | 경조사비 | 연차 휴가 | 교육비 지원',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Apply CTA ───────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-healthcareers-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-healthcareers-cta-text',
    parentId: 'tpl-healthcareers-cta',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '함께할 인재를 기다립니다. 지금 바로 지원해 주세요.',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-healthcareers-cta-btn',
    parentId: 'tpl-healthcareers-cta',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '지원하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const healthCareersTemplate: PageTemplate = {
  id: 'health-careers',
  name: '병원 채용',
  category: 'health',
  subcategory: 'careers',
  description: '채용 소개 + 모집 포지션 + 복리후생 + 지원 CTA',
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
