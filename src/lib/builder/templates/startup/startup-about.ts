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
const STORY_Y = HERO_H + 80;
const STORY_H = 280;
const TEAM_Y = STORY_Y + STORY_H + 80;
const TEAM_H = 360;
const INVESTORS_Y = TEAM_Y + TEAM_H + 80;
const INVESTORS_H = 200;
const STAGE_H = INVESTORS_Y + INVESTORS_H + 80;

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

const team = [
  { name: '김창업 CEO', role: '창업자 & 대표이사', bio: '전 네이버 PM, KAIST 컴퓨터공학 석사' },
  { name: '이기술 CTO', role: '최고기술책임자', bio: '전 구글 엔지니어, 분산시스템 전문가' },
  { name: '박디자인 CDO', role: '최고디자인책임자', bio: '전 삼성 UX 리드, RISD 졸업' },
  { name: '최마케팅 CMO', role: '최고마케팅책임자', bio: '전 카카오 마케팅 총괄, 10년 B2B 경력' },
];

const teamCards: BuilderCanvasNode[] = team.flatMap((m, i) => {
  const x = 80 + i * 290;
  const prefix = `tpl-stupabt-team-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y: TEAM_Y + 70, width: 260, height: 240 },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-name`, { x: 24, y: 24, width: 212, height: 36 }, m.name, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-role`,
      parentId: prefix,
      rect: { x: 24, y: 66, width: 212, height: 30 },
      text: m.role,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${prefix}-bio`,
      parentId: prefix,
      rect: { x: 24, y: 106, width: 212, height: 80 },
      text: m.bio,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stupabt-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupabt-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '회사 소개', 1, '#ffffff', 'left', 'tpl-stupabt-hero'),
  createTextNode({
    id: 'tpl-stupabt-hero-sub',
    parentId: 'tpl-stupabt-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '더 나은 비즈니스 도구를 만들기 위해 모인 팀입니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Founding story ─────────────────────────────────────── */
  heading('tpl-stupabt-story-title', { x: 80, y: STORY_Y, width: 400, height: 50 }, '창업 스토리', 2, '#123b63', 'left'),
  createTextNode({
    id: 'tpl-stupabt-story-desc',
    rect: { x: 80, y: STORY_Y + 60, width: 800, height: 160 },
    text: '2022년 "왜 아직도 이렇게 비효율적으로 일해야 할까?"라는 질문에서 시작했습니다. 반복적인 업무에 시간을 낭비하는 팀들을 위해, 누구나 쉽게 사용할 수 있는 올인원 업무 자동화 플랫폼을 만들었습니다. Series B 투자 유치 후 현재 글로벌 확장을 준비하고 있습니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Team ────────────────────────────────────────────────── */
  heading('tpl-stupabt-team-title', { x: 80, y: TEAM_Y, width: 400, height: 50 }, '팀', 2, '#123b63', 'left'),
  ...teamCards,

  /* ── Investors & Mission ────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stupabt-investors',
    rect: { x: 0, y: INVESTORS_Y, width: W, height: INVESTORS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-stupabt-inv-title', { x: 80, y: 40, width: 400, height: 50 }, '투자자 & 미션', 2, '#123b63', 'left', 'tpl-stupabt-investors'),
  createTextNode({
    id: 'tpl-stupabt-inv-desc',
    parentId: 'tpl-stupabt-investors',
    rect: { x: 80, y: 100, width: 800, height: 60 },
    text: 'Sequoia, SoftBank Ventures, 알토스벤처스 등 글로벌 투자사의 지원을 받고 있습니다. 우리의 미션: 모든 팀이 더 스마트하게 일하는 세상을 만듭니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-startupabout-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-proof-label', parentId: 'tpl-startupabout-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-proof-title', parentId: 'tpl-startupabout-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'startup about 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-proof-copy', parentId: 'tpl-startupabout-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-metric-1', parentId: 'tpl-startupabout-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-metric-1-value', parentId: 'tpl-startupabout-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-metric-1-label', parentId: 'tpl-startupabout-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-metric-2', parentId: 'tpl-startupabout-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-metric-2-value', parentId: 'tpl-startupabout-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-metric-2-label', parentId: 'tpl-startupabout-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-metric-3', parentId: 'tpl-startupabout-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-metric-3-value', parentId: 'tpl-startupabout-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-metric-3-label', parentId: 'tpl-startupabout-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-metric-4', parentId: 'tpl-startupabout-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-metric-4-value', parentId: 'tpl-startupabout-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-metric-4-label', parentId: 'tpl-startupabout-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-label', parentId: 'tpl-startupabout-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-title', parentId: 'tpl-startupabout-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-copy', parentId: 'tpl-startupabout-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-showcase-visual', parentId: 'tpl-startupabout-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-visual-title', parentId: 'tpl-startupabout-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-visual-copy', parentId: 'tpl-startupabout-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-showcase-card-1', parentId: 'tpl-startupabout-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-card-1-title', parentId: 'tpl-startupabout-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-card-1-copy', parentId: 'tpl-startupabout-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-showcase-card-2', parentId: 'tpl-startupabout-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-card-2-title', parentId: 'tpl-startupabout-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-card-2-copy', parentId: 'tpl-startupabout-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-showcase-card-3', parentId: 'tpl-startupabout-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-card-3-title', parentId: 'tpl-startupabout-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-showcase-card-3-copy', parentId: 'tpl-startupabout-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupabout-wix-quote', parentId: 'tpl-startupabout-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-quote-mark', parentId: 'tpl-startupabout-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-quote-body', parentId: 'tpl-startupabout-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-quote-role', parentId: 'tpl-startupabout-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-cta-label', parentId: 'tpl-startupabout-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-cta-title', parentId: 'tpl-startupabout-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupabout-wix-cta-copy', parentId: 'tpl-startupabout-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-startupabout-wix-cta-primary', parentId: 'tpl-startupabout-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-startupabout-wix-cta-secondary', parentId: 'tpl-startupabout-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
]);

export const startupAboutTemplate: PageTemplate = {
  id: 'startup-about',
  name: '스타트업 소개',
  category: 'startup',
  subcategory: 'about',
  description: '창업 스토리 + 팀 + 투자자 + 미션',
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
