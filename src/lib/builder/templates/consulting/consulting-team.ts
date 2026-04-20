import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 300;
const GRID_Y = HERO_H + 80;
const GRID_H = 700;
const STAGE_H = GRID_Y + GRID_H + 80;

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

const members = [
  { name: '김민수 컨설턴트', expertise: '전략/M&A', bio: '글로벌 전략 컨설팅 12년, 대기업 M&A 프로젝트 20건 이상 수행' },
  { name: '이지은 컨설턴트', expertise: '운영/SCM', bio: '제조업 공급망 최적화 전문, 원가 절감 프로젝트 다수 실적' },
  { name: '박준호 컨설턴트', expertise: '재무/투자', bio: 'CFA 보유, 벤처 투자 및 기업 가치평가 전문가' },
  { name: '최서윤 컨설턴트', expertise: '마케팅/브랜드', bio: '브랜드 전략 및 디지털 마케팅 10년 경력' },
  { name: '정하늘 컨설턴트', expertise: 'HR/조직', bio: '조직 설계 및 인재 관리 전문, 대기업 HR 혁신 리더' },
  { name: '한도현 컨설턴트', expertise: 'IT/디지털', bio: 'AI·클라우드 전환 전문가, 테크 스타트업 CTO 출신' },
];

const cardW = 360;
const cardH = 220;
const gapX = 30;
const gapY = 30;

const cards: BuilderCanvasNode[] = members.flatMap((m, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-consteam-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 312, height: 36 }, m.name, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-exp`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 312, height: 24 },
      text: m.expertise,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${prefix}-bio`,
      parentId: prefix,
      rect: { x: 24, y: 100, width: 312, height: 80 },
      text: m.bio,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-consteam-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-consteam-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '전문가 팀', 1, '#ffffff', 'left', 'tpl-consteam-hero'),
  createTextNode({
    id: 'tpl-consteam-hero-sub',
    parentId: 'tpl-consteam-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '각 분야 최고의 전문가들이 함께합니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-consteam-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '컨설턴트 소개', 2, '#123b63', 'left'),
  ...cards,
]);

export const consultingTeamTemplate: PageTemplate = {
  id: 'consulting-team',
  name: '컨설팅 팀',
  category: 'consulting',
  subcategory: 'team',
  description: '전체 팀 그리드 + 6명 컨설턴트 카드(전문분야 포함)',
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
