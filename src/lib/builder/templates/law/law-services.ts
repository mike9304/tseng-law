import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createButtonNode,
  createImageNode,
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

/* ── Layout constants ────────────────────────────────────────── */
const HEADER_H = 140;
const CARD_W = 370;
const CARD_H = 300;
const GAP = 24;
const MARGIN = 80;
const ROW1_Y = HEADER_H + 40;
const ROW2_Y = ROW1_Y + CARD_H + GAP;
const STAGE_H = ROW2_Y + CARD_H + 80;

interface ServiceDef {
  key: string;
  icon: string;
  title: string;
  desc: string;
}

const services: ServiceDef[] = [
  { key: 'corp', icon: 'placeholder-corporate.jpg', title: '기업법 자문', desc: '법인 설립, 정관 작성, 주주 계약, M&A 등 기업 운영에 필요한 모든 법률 서비스를 제공합니다.' },
  { key: 'realestate', icon: 'placeholder-realestate.jpg', title: '부동산 거래', desc: '매매 계약, 임대차, 등기, 개발 인허가 등 부동산 관련 전문 법률 자문을 수행합니다.' },
  { key: 'immigration', icon: 'placeholder-immigration.jpg', title: '이민 · 비자', desc: '취업 비자, 투자 비자, 거류증 연장, 영주권 및 귀화 절차를 전문적으로 지원합니다.' },
  { key: 'family', icon: 'placeholder-family.jpg', title: '가족법', desc: '이혼, 양육권, 재산 분할, 상속, 유언장 작성 등 가족 관련 법률 문제를 처리합니다.' },
  { key: 'labor', icon: 'placeholder-labor.jpg', title: '노동법', desc: '근로 계약, 부당 해고, 산업 재해, 퇴직금 분쟁 등 노동 관련 법률 서비스를 제공합니다.' },
  { key: 'ip', icon: 'placeholder-ip.jpg', title: '지적재산권', desc: '상표 등록, 특허 출원, 저작권 보호, 기술 이전 계약 등 IP 관련 자문을 합니다.' },
];

function buildServiceCard(s: ServiceDef, idx: number): BuilderCanvasNode[] {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = row === 0 ? ROW1_Y : ROW2_Y;
  const cid = `tpl-svc-card-${s.key}`;

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
    createImageNode({
      id: `${cid}-icon`,
      parentId: cid,
      rect: { x: 24, y: 24, width: 48, height: 48 },
      src: `/images/${s.icon}`,
      alt: `${s.title} 아이콘`,
      style: { borderRadius: 8 },
    }),
    heading(`${cid}-title`, { x: 24, y: 88, width: 322, height: 36 }, s.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 136, width: 322, height: 80 },
      text: s.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 24, y: 232, width: 130, height: 40 },
      label: '자세히 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-svc-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '업무 분야',
    1,
    '#123b63',
    'left',
  ),
  createTextNode({
    id: 'tpl-svc-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '각 분야 전문 변호사가 최적의 법률 솔루션을 제공합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...services.flatMap((s, i) => buildServiceCard(s, i)),
]);

export const lawServicesTemplate: PageTemplate = {
  id: 'law-services',
  name: '업무 분야',
  category: 'law',
  subcategory: 'services',
  description: '섹션 제목 + 6개 서비스 카드(아이콘 + 제목 + 설명 + 버튼)',
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
