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

const MARGIN = 80;
const HEADER_H = 140;
const CARD_W = 260;
const CARD_H = 300;
const GAP = 24;
const COLS = 4;

interface ClassItem {
  key: string;
  title: string;
  schedule: string;
  desc: string;
}

const classes: ClassItem[] = [
  { key: 'yoga', title: '요가', schedule: '월/수/금 07:00', desc: '호흡과 명상을 통한 심신 안정, 유연성 향상 프로그램' },
  { key: 'hiit', title: 'HIIT', schedule: '화/목 18:00', desc: '20분 고강도 인터벌 트레이닝으로 체지방 연소 극대화' },
  { key: 'boxing', title: '복싱 피트니스', schedule: '월/수/금 19:00', desc: '복싱 기술과 피트니스를 결합한 전신 운동 프로그램' },
  { key: 'pilates', title: '필라테스', schedule: '매일 10:00', desc: '코어 강화와 체형 교정을 위한 전문 기구 필라테스' },
  { key: 'spinning', title: '스피닝', schedule: '화/목/토 07:00', desc: '신나는 음악과 함께하는 실내 사이클링 유산소 운동' },
  { key: 'crossfit', title: '크로스핏', schedule: '월~금 06:00', desc: '다양한 기능성 운동을 고강도로 수행하는 종합 체력 훈련' },
  { key: 'dance', title: '댄스 피트니스', schedule: '수/금 20:00', desc: 'K-POP, 라틴 등 다양한 장르의 댄스로 즐겁게 운동' },
  { key: 'stretch', title: '스트레칭', schedule: '매일 21:00', desc: '운동 후 근육 이완과 회복을 위한 스트레칭 클래스' },
];

function buildClassCard(item: ClassItem, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-fitclass-card-${item.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-img`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 140 },
      src: `/images/placeholder-class-${item.key}.jpg`,
      alt: `${item.title} 클래스 이미지`,
      style: { borderRadius: 0 },
    }),
    heading(`${cid}-title`, { x: 16, y: 152, width: 228, height: 30 }, item.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-schedule`,
      parentId: cid,
      rect: { x: 16, y: 186, width: 228, height: 22 },
      text: item.schedule,
      fontSize: 12,
      color: '#e8a838',
      fontWeight: 'medium',
    }),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 16, y: 216, width: 228, height: 50 },
      text: item.desc,
      fontSize: 13,
      color: '#374151',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 16, y: 272, width: 100, height: 28 },
      label: '신청하기',
      href: '#',
      variant: 'link',
      style: { borderRadius: 4 },
    }),
  ];
}

const ROWS = Math.ceil(classes.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-fitclass-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '클래스 스케줄',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-fitclass-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '다양한 그룹 클래스로 재미있게 운동하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...classes.flatMap((c, i) => buildClassCard(c, i)),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-fitnessclasses-wix-proof',
    rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 },
    background: '#f8fafc',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 24,
    padding: 0,
    className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-fitnessclasses-wix-showcase',
    rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 },
    background: '#ffffff',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 24,
    padding: 0,
    className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-fitnessclasses-wix-cta',
    rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 },
    background: '#123b63',
    borderColor: '#123b63',
    borderWidth: 1,
    borderRadius: 24,
    padding: 0,
    className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-proof-label',
    parentId: 'tpl-fitnessclasses-wix-proof',
    rect: { x: 56, y: 48, width: 260, height: 28 },
    text: 'Wix-grade proof system',
    fontSize: 13,
    color: '#1e5a96',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-proof-title',
    parentId: 'tpl-fitnessclasses-wix-proof',
    rect: { x: 56, y: 92, width: 560, height: 82 },
    text: 'fitness classes 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다',
    fontSize: 36,
    color: '#123b63',
    fontWeight: 'bold',
    lineHeight: 1.16,
    className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-proof-copy',
    parentId: 'tpl-fitnessclasses-wix-proof',
    rect: { x: 56, y: 190, width: 540, height: 64 },
    text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.',
    fontSize: 17,
    color: '#475569',
    lineHeight: 1.55,
    className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-fitnessclasses-wix-metric-1',
    parentId: 'tpl-fitnessclasses-wix-proof',
    rect: { x: 56, y: 310, width: 230, height: 130 },
    background: '#ffffff',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 18,
    padding: 0,
    className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-metric-1-value',
    parentId: 'tpl-fitnessclasses-wix-metric-1',
    rect: { x: 22, y: 22, width: 120, height: 42 },
    text: '4.9',
    fontSize: 34,
    color: '#123b63',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-metric-1-label',
    parentId: 'tpl-fitnessclasses-wix-metric-1',
    rect: { x: 22, y: 76, width: 168, height: 38 },
    text: '고객 평가와 재방문 신뢰 지표',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.35,
    className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-fitnessclasses-wix-metric-2',
    parentId: 'tpl-fitnessclasses-wix-proof',
    rect: { x: 310, y: 310, width: 230, height: 130 },
    background: '#ffffff',
    borderColor: '#dbe4ee',
    borderWidth: 1,
    borderRadius: 18,
    padding: 0,
    className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-metric-2-value',
    parentId: 'tpl-fitnessclasses-wix-metric-2',
    rect: { x: 22, y: 22, width: 140, height: 42 },
    text: '24h',
    fontSize: 34,
    color: '#1e5a96',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-metric-2-label',
    parentId: 'tpl-fitnessclasses-wix-metric-2',
    rect: { x: 22, y: 76, width: 168, height: 38 },
    text: '초기 문의와 예약 흐름을 빠르게 연결',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 1.35,
    className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-fitnessclasses-wix-metric-3',
    parentId: 'tpl-fitnessclasses-wix-proof',
    rect: { x: 650, y: 70, width: 210, height: 150 },
    background: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 22,
    padding: 0,
    className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-metric-3-value',
    parentId: 'tpl-fitnessclasses-wix-metric-3',
    rect: { x: 24, y: 28, width: 140, height: 42 },
    text: '6+',
    fontSize: 34,
    color: '#123b63',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-metric-3-label',
    parentId: 'tpl-fitnessclasses-wix-metric-3',
    rect: { x: 24, y: 82, width: 150, height: 42 },
    text: '섹션 단위 정보 구조로 풍부도 강화',
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.35,
    className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-fitnessclasses-wix-metric-4',
    parentId: 'tpl-fitnessclasses-wix-proof',
    rect: { x: 884, y: 70, width: 210, height: 150 },
    background: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 22,
    padding: 0,
    className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-metric-4-value',
    parentId: 'tpl-fitnessclasses-wix-metric-4',
    rect: { x: 24, y: 28, width: 140, height: 42 },
    text: '3x',
    fontSize: 34,
    color: '#e8a838',
    fontWeight: 'bold',
    className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-metric-4-label',
    parentId: 'tpl-fitnessclasses-wix-metric-4',
    rect: { x: 24, y: 82, width: 150, height: 42 },
    text: 'CTA, proof, showcase 접점을 반복 배치',
    fontSize: 14,
    color: '#475569',
    lineHeight: 1.35,
    className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-showcase-label',
    parentId: 'tpl-fitnessclasses-wix-showcase',
    rect: { x: 56, y: 48, width: 240, height: 28 },
    text: 'Showcase module',
    fontSize: 13,
    color: '#1e5a96',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-fitnessclasses-wix-showcase-title',
    parentId: 'tpl-fitnessclasses-wix-showcase',
    rect: { x: 56, y: 88, width: 540, height: 78 },
    text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다',
    fontSize: 34,
    color: '#123b63',
    fontWeight: 'bold',
    lineHeight: 1.18,
    className: 'hero-title',
  }),
]);

export const fitnessClassesTemplate: PageTemplate = {
  id: 'fitness-classes',
  name: '클래스 스케줄',
  category: 'fitness',
  subcategory: 'classes',
  description: '클래스 스케줄 제목 + 8개 클래스 카드(이미지 + 이름 + 시간 + 설명)',
  document: {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-04-15T00:00:00+09:00',
    updatedBy: 'template-system',
    stageWidth: W,
    stageHeight: STAGE_H + 1960,
    nodes,
  },
};
