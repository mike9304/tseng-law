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
const DEMO_Y = HERO_H + 80;
const DEMO_H = 360;
const SUPPORT_Y = DEMO_Y + DEMO_H + 80;
const SUPPORT_H = 200;
const STAGE_H = SUPPORT_Y + SUPPORT_H + 80;

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

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stupcon-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupcon-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '문의하기', 1, '#ffffff', 'left', 'tpl-stupcon-hero'),
  createTextNode({
    id: 'tpl-stupcon-hero-sub',
    parentId: 'tpl-stupcon-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '데모 요청이나 궁금한 점이 있으면 연락주세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),

  /* ── Demo request ───────────────────────────────────────── */
  heading('tpl-stupcon-demo-title', { x: 80, y: DEMO_Y, width: 400, height: 50 }, '데모 요청', 2, '#123b63', 'left'),
  createContainerNode({
    id: 'tpl-stupcon-demo-form',
    rect: { x: 80, y: DEMO_Y + 60, width: 600, height: 260 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-stupcon-demo-desc',
    parentId: 'tpl-stupcon-demo-form',
    rect: { x: 24, y: 24, width: 552, height: 80 },
    text: '이름, 이메일, 회사명, 팀 규모를 입력해 주세요. 전담 매니저가 맞춤 데모를 준비해 드립니다.',
    fontSize: 15,
    color: '#374151',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-stupcon-demo-btn',
    parentId: 'tpl-stupcon-demo-form',
    rect: { x: 24, y: 180, width: 180, height: 48 },
    label: '데모 신청',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Support channels ───────────────────────────────────── */
  createTextNode({
    id: 'tpl-stupcon-email',
    rect: { x: 740, y: DEMO_Y + 60, width: 400, height: 40 },
    text: '이메일: hello@startup.co.kr',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.4,
  }),
  createTextNode({
    id: 'tpl-stupcon-chat',
    rect: { x: 740, y: DEMO_Y + 110, width: 400, height: 40 },
    text: '라이브 채팅: 평일 09:00-18:00',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.4,
  }),
  createTextNode({
    id: 'tpl-stupcon-docs',
    rect: { x: 740, y: DEMO_Y + 160, width: 400, height: 40 },
    text: '개발자 문서: docs.startup.co.kr',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.4,
  }),

  /* ── Office ─────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-stupcon-office',
    rect: { x: 0, y: SUPPORT_Y, width: W, height: SUPPORT_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading('tpl-stupcon-office-title', { x: 80, y: 40, width: 400, height: 50 }, '오피스', 2, '#123b63', 'left', 'tpl-stupcon-office'),
  createTextNode({
    id: 'tpl-stupcon-office-desc',
    parentId: 'tpl-stupcon-office',
    rect: { x: 80, y: 100, width: 600, height: 60 },
    text: '서울시 강남구 역삼로 234 스타트업캠퍼스 7층\n방문 미팅은 사전 예약 부탁드립니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.6,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-startupcontact-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-proof-label', parentId: 'tpl-startupcontact-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-proof-title', parentId: 'tpl-startupcontact-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'startup contact 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-proof-copy', parentId: 'tpl-startupcontact-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-metric-1', parentId: 'tpl-startupcontact-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-metric-1-value', parentId: 'tpl-startupcontact-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-metric-1-label', parentId: 'tpl-startupcontact-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-metric-2', parentId: 'tpl-startupcontact-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-metric-2-value', parentId: 'tpl-startupcontact-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-metric-2-label', parentId: 'tpl-startupcontact-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-metric-3', parentId: 'tpl-startupcontact-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-metric-3-value', parentId: 'tpl-startupcontact-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-metric-3-label', parentId: 'tpl-startupcontact-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-metric-4', parentId: 'tpl-startupcontact-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-metric-4-value', parentId: 'tpl-startupcontact-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-metric-4-label', parentId: 'tpl-startupcontact-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-label', parentId: 'tpl-startupcontact-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-title', parentId: 'tpl-startupcontact-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-copy', parentId: 'tpl-startupcontact-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-showcase-visual', parentId: 'tpl-startupcontact-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-visual-title', parentId: 'tpl-startupcontact-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-visual-copy', parentId: 'tpl-startupcontact-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-showcase-card-1', parentId: 'tpl-startupcontact-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-card-1-title', parentId: 'tpl-startupcontact-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-card-1-copy', parentId: 'tpl-startupcontact-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-showcase-card-2', parentId: 'tpl-startupcontact-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-card-2-title', parentId: 'tpl-startupcontact-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-card-2-copy', parentId: 'tpl-startupcontact-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-showcase-card-3', parentId: 'tpl-startupcontact-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-card-3-title', parentId: 'tpl-startupcontact-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-showcase-card-3-copy', parentId: 'tpl-startupcontact-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-startupcontact-wix-quote', parentId: 'tpl-startupcontact-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-quote-mark', parentId: 'tpl-startupcontact-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-quote-body', parentId: 'tpl-startupcontact-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-quote-role', parentId: 'tpl-startupcontact-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-cta-label', parentId: 'tpl-startupcontact-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-cta-title', parentId: 'tpl-startupcontact-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-startupcontact-wix-cta-copy', parentId: 'tpl-startupcontact-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-startupcontact-wix-cta-primary', parentId: 'tpl-startupcontact-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-startupcontact-wix-cta-secondary', parentId: 'tpl-startupcontact-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
]);

export const startupContactTemplate: PageTemplate = {
  id: 'startup-contact',
  name: '스타트업 문의',
  category: 'startup',
  subcategory: 'contact',
  description: '데모 요청 영역 + 지원 채널 + 오피스',
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
