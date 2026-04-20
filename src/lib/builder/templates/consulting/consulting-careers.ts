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
const POSITIONS_Y = HERO_H + 80;
const POSITIONS_H = 400;
const CULTURE_Y = POSITIONS_Y + POSITIONS_H + 80;
const CULTURE_H = 280;
const STAGE_H = CULTURE_Y + CULTURE_H + 80;

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

const positions = [
  { title: '전략 컨설턴트 (경력)', desc: '경영 전략 수립 및 실행 지원, MBA 또는 관련 석사 우대' },
  { title: '운영 컨설턴트 (신입/경력)', desc: '프로세스 혁신 및 운영 최적화 프로젝트 수행' },
  { title: '데이터 분석가', desc: '데이터 기반 인사이트 도출, Python/SQL 필수' },
  { title: '비즈니스 개발 매니저', desc: '신규 고객 발굴 및 관계 관리, B2B 영업 경험 우대' },
];

const cardW = 550;
const cardH = 140;
const gapY = 20;

const posCards: BuilderCanvasNode[] = positions.flatMap((p, i) => {
  const y = POSITIONS_Y + 70 + i * (cardH + gapY);
  const prefix = `tpl-conscar-pos-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x: 80, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 502, height: 36 }, p.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 70, width: 502, height: 50 },
      text: p.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-conscar-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-conscar-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '채용 안내', 1, '#ffffff', 'left', 'tpl-conscar-hero'),
  createTextNode({
    id: 'tpl-conscar-hero-sub',
    parentId: 'tpl-conscar-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '최고의 팀에서 함께 성장할 인재를 찾습니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-conscar-pos-title', { x: 80, y: POSITIONS_Y, width: 400, height: 50 }, '채용 중인 포지션', 2, '#123b63', 'left'),
  ...posCards,
  createButtonNode({
    id: 'tpl-conscar-apply-btn',
    rect: { x: 80, y: POSITIONS_Y + 70 + 4 * (cardH + gapY) - 20, width: 180, height: 48 },
    label: '지원하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Culture ────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-conscar-culture',
    rect: { x: 0, y: CULTURE_Y, width: W, height: CULTURE_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-conscar-culture-title', { x: 80, y: 40, width: 400, height: 50 }, '우리의 문화', 2, '#123b63', 'left', 'tpl-conscar-culture'),
  createTextNode({
    id: 'tpl-conscar-culture-desc',
    parentId: 'tpl-conscar-culture',
    rect: { x: 80, y: 100, width: 800, height: 120 },
    text: '자율과 책임을 바탕으로 최고의 성과를 만듭니다. 유연한 근무 환경, 지속적인 학습 기회, 글로벌 프로젝트 참여 등 전문가로서 성장할 수 있는 환경을 제공합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
]);

export const consultingCareersTemplate: PageTemplate = {
  id: 'consulting-careers',
  name: '컨설팅 채용',
  category: 'consulting',
  subcategory: 'careers',
  description: '채용 안내 + 공개 포지션 + 회사 문화',
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
