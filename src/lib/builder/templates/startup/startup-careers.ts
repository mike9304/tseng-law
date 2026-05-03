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
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-startupcareers-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-proof-label', parentId: 'tpl-startupcareers-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-proof-title', parentId: 'tpl-startupcareers-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'startup careers 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-proof-copy', parentId: 'tpl-startupcareers-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-metric-1', parentId: 'tpl-startupcareers-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-metric-1-value', parentId: 'tpl-startupcareers-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-metric-1-label', parentId: 'tpl-startupcareers-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-metric-2', parentId: 'tpl-startupcareers-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-metric-2-value', parentId: 'tpl-startupcareers-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-metric-2-label', parentId: 'tpl-startupcareers-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-metric-3', parentId: 'tpl-startupcareers-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-metric-3-value', parentId: 'tpl-startupcareers-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-metric-3-label', parentId: 'tpl-startupcareers-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-metric-4', parentId: 'tpl-startupcareers-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-metric-4-value', parentId: 'tpl-startupcareers-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-metric-4-label', parentId: 'tpl-startupcareers-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-label', parentId: 'tpl-startupcareers-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-title', parentId: 'tpl-startupcareers-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-copy', parentId: 'tpl-startupcareers-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-showcase-visual', parentId: 'tpl-startupcareers-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-visual-title', parentId: 'tpl-startupcareers-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-visual-copy', parentId: 'tpl-startupcareers-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-showcase-card-1', parentId: 'tpl-startupcareers-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-card-1-title', parentId: 'tpl-startupcareers-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-card-1-copy', parentId: 'tpl-startupcareers-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-showcase-card-2', parentId: 'tpl-startupcareers-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-card-2-title', parentId: 'tpl-startupcareers-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-card-2-copy', parentId: 'tpl-startupcareers-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-showcase-card-3', parentId: 'tpl-startupcareers-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-card-3-title', parentId: 'tpl-startupcareers-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-showcase-card-3-copy', parentId: 'tpl-startupcareers-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-quote', parentId: 'tpl-startupcareers-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-quote-mark', parentId: 'tpl-startupcareers-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-quote-body', parentId: 'tpl-startupcareers-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-quote-role', parentId: 'tpl-startupcareers-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-cta-label', parentId: 'tpl-startupcareers-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-cta-title', parentId: 'tpl-startupcareers-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-cta-copy', parentId: 'tpl-startupcareers-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-startupcareers-wix-cta-primary', parentId: 'tpl-startupcareers-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-startupcareers-wix-cta-secondary', parentId: 'tpl-startupcareers-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-startupcareers-wix-cta-note', parentId: 'tpl-startupcareers-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcareers-wix-timeline', parentId: 'tpl-startupcareers-wix-cta', rect: { x: 690, y: 70, width: 360, height: 390 }, background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
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
    stageHeight: STAGE_H + 1960,
    nodes,
  },
};
