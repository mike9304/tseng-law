import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
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

const HEADER_H = 140;
const CARD_W = 370;
const CARD_H = 200;
const GAP = 24;
const MARGIN = 80;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface CaseResult {
  key: string;
  caseType: string;
  outcome: string;
  desc: string;
}

const cases: CaseResult[] = [
  { key: 'merger', caseType: '기업 인수합병', outcome: 'NT$ 5억 규모 M&A 완료', desc: '한국 대기업의 대만 현지 법인 인수를 성공적으로 마무리. 계약 협상부터 정부 승인까지 전 과정 자문.' },
  { key: 'visa', caseType: '투자 비자 취득', outcome: '비자 승인율 98%', desc: '대만 투자이민 비자 신청 대행 및 사업 계획서 작성 지원. 3개월 내 신속 처리.' },
  { key: 'realestate', caseType: '부동산 분쟁', outcome: 'NT$ 2,000만 배상 획득', desc: '하자 있는 부동산 매매 계약에 대한 손해배상 소송에서 의뢰인 측 전액 승소.' },
  { key: 'divorce', caseType: '국제 이혼', outcome: '양육권 확보 및 재산분할', desc: '한국-대만 국제 결혼 부부의 이혼 소송에서 양육권 및 공정한 재산 분할 합의 도출.' },
  { key: 'labor', caseType: '부당해고 소송', outcome: 'NT$ 800만 합의금', desc: '외국인 근로자 부당해고 사건에서 회사 측과 유리한 합의를 이끌어냄.' },
  { key: 'ip', caseType: '상표권 침해', outcome: '침해 중지 + 손해배상', desc: '한국 브랜드의 대만 내 상표권 침해 사건에서 침해 중지 명령 및 손해배상 판결 획득.' },
];

function buildCaseCard(c: CaseResult, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-case-card-${c.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    createTextNode({
      id: `${cid}-type`,
      parentId: cid,
      rect: { x: 24, y: 20, width: 160, height: 24 },
      text: c.caseType,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
      textTransform: 'uppercase',
    }),
    heading(`${cid}-outcome`, { x: 24, y: 52, width: 322, height: 36 }, c.outcome, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 100, width: 322, height: 72 },
      text: c.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.55,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-case-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '주요 성공 사례',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-case-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '다양한 분야에서 의뢰인을 위해 성취한 주요 결과를 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...cases.flatMap((c, i) => buildCaseCard(c, i)),
]);

export const lawCaseResultsTemplate: PageTemplate = {
  id: 'law-case-results',
  name: '성공 사례',
  category: 'law',
  subcategory: 'results',
  description: '제목 + 6개 사례 카드(사건 유형 + 결과 + 설명)',
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
