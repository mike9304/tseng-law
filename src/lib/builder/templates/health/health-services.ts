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
const CARD_W = 270;
const CARD_H = 280;
const GAP = 24;
const COLS = 4;

interface Service {
  key: string;
  title: string;
  desc: string;
}

const services: Service[] = [
  { key: 'general', title: '일반 진료', desc: '감기, 소화불량 등 일반적인 질환을 신속하게 진단하고 치료합니다.' },
  { key: 'checkup', title: '건강 검진', desc: '종합 건강검진 프로그램으로 질환을 조기에 발견합니다.' },
  { key: 'surgery', title: '외과 수술', desc: '최소 침습 수술부터 주요 수술까지 안전하게 진행합니다.' },
  { key: 'rehab', title: '재활 치료', desc: '물리치료, 운동치료 등 맞춤형 재활 프로그램을 운영합니다.' },
  { key: 'dental', title: '치과 진료', desc: '충치, 교정, 임플란트 등 구강 건강 전반을 관리합니다.' },
  { key: 'derma', title: '피부과 시술', desc: '피부 질환 치료와 레이저, 보톡스 등 미용 시술을 제공합니다.' },
  { key: 'mental', title: '정신건강의학', desc: '스트레스, 우울증, 불안장애 등 정신건강 상담과 치료를 합니다.' },
  { key: 'pediatric', title: '소아과', desc: '영유아부터 청소년까지 소아 전문 진료를 제공합니다.' },
];

function buildServiceCard(svc: Service, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-healthsvc-card-${svc.key}`;

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
      src: `/images/placeholder-health-${svc.key}.jpg`,
      alt: `${svc.title} 아이콘`,
      style: { borderRadius: 8 },
    }),
    heading(`${cid}-title`, { x: 24, y: 88, width: 222, height: 36 }, svc.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 132, width: 222, height: 80 },
      text: svc.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 24, y: 228, width: 120, height: 36 },
      label: '자세히 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const ROWS = Math.ceil(services.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-healthsvc-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '의료 서비스',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-healthsvc-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '전문 의료진이 제공하는 다양한 진료 서비스를 소개합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...services.flatMap((s, i) => buildServiceCard(s, i)),
]);

export const healthServicesTemplate: PageTemplate = {
  id: 'health-services',
  name: '의료 서비스',
  category: 'health',
  subcategory: 'services',
  description: '의료 서비스 그리드(8개) + 아이콘 + 설명 + 버튼',
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
