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
const POSITIONS_H = 520;
const PERKS_Y = POSITIONS_Y + POSITIONS_H + 80;
const PERKS_H = 280;
const STAGE_H = PERKS_Y + PERKS_H + 80;

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
  { title: '백엔드 엔지니어', desc: 'Go/Python, 대규모 분산시스템 경험. MSA 설계 및 운영.' },
  { title: '프론트엔드 엔지니어', desc: 'React/TypeScript, 복잡한 UI 구현 경험. 디자인 시스템 구축.' },
  { title: '프로덕트 디자이너', desc: 'Figma 기반 UX/UI 설계. 데이터 기반 디자인 의사결정.' },
  { title: '프로덕트 매니저', desc: 'B2B SaaS PM 경험. 고객 인터뷰, 로드맵 수립, 스프린트 관리.' },
  { title: '데이터 엔지니어', desc: '데이터 파이프라인 설계, ETL, 실시간 데이터 처리 경험.' },
  { title: '영업/파트너십 매니저', desc: 'B2B 세일즈 경험. 파트너 발굴 및 관계 관리.' },
];

const cardW = 360;
const cardH = 140;
const gapX = 30;
const gapY = 20;

const posCards: BuilderCanvasNode[] = positions.flatMap((p, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 80 + col * (cardW + gapX);
  const y = POSITIONS_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-stupcar-pos-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 312, height: 36 }, p.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 70, width: 312, height: 50 },
      text: p.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stupcar-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupcar-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '채용', 1, '#ffffff', 'left', 'tpl-stupcar-hero'),
  createTextNode({
    id: 'tpl-stupcar-hero-sub',
    parentId: 'tpl-stupcar-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '함께 미래를 만들어갈 팀원을 찾습니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-stupcar-pos-title', { x: 80, y: POSITIONS_Y, width: 400, height: 50 }, '오픈 포지션', 2, '#123b63', 'left'),
  ...posCards,
  createButtonNode({
    id: 'tpl-stupcar-apply-btn',
    rect: { x: 830, y: POSITIONS_Y + 100, width: 180, height: 48 },
    label: '지원하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Perks & Culture ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stupcar-perks',
    rect: { x: 0, y: PERKS_Y, width: W, height: PERKS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-stupcar-perks-title', { x: 80, y: 40, width: 400, height: 50 }, '복지 & 문화', 2, '#123b63', 'left', 'tpl-stupcar-perks'),
  createTextNode({
    id: 'tpl-stupcar-perks-desc',
    parentId: 'tpl-stupcar-perks',
    rect: { x: 80, y: 100, width: 800, height: 120 },
    text: '자율 출퇴근 + 무제한 원격 근무 / 최신 장비 지급 (맥북 프로) / 도서비·교육비 무제한 지원 / 스톡옵션 부여 / 자유로운 휴가 사용 / 팀 빌딩 월 1회',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),
]);

export const startupCareersTemplate: PageTemplate = {
  id: 'startup-careers',
  name: '스타트업 채용',
  category: 'startup',
  subcategory: 'careers',
  description: '엔지니어링/디자인/세일즈 포지션 + 복지 + 문화',
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
