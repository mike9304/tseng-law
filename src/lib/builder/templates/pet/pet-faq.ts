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
const FAQ_Y = HERO_H + 80;
const FAQ_H = 1000;
const STAGE_H = FAQ_Y + FAQ_H + 80;

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

const faqs = [
  { q: '첫 방문 시 준비물이 있나요?', a: '이전 진료 기록이나 예방접종 수첩이 있다면 지참해 주세요. 없어도 진료는 가능합니다.' },
  { q: '예약 없이 방문 가능한가요?', a: '예약 환자 우선 진료이나, 당일 내원도 가능합니다. 대기 시간이 발생할 수 있습니다.' },
  { q: '중성화 수술 적정 시기는 언제인가요?', a: '일반적으로 생후 6개월 전후가 권장되지만, 품종과 건강 상태에 따라 수의사와 상담하세요.' },
  { q: '진료비 결제 방법은?', a: '현금, 카드, 계좌이체 모두 가능합니다. 웰니스 패키지는 월 자동결제도 지원합니다.' },
  { q: '응급 상황 시 어떻게 하나요?', a: '24시간 응급전화 02-9999-1234로 연락해 주세요. 야간/공휴일에도 수의사가 대기 중입니다.' },
  { q: '반려동물 보험 적용이 되나요?', a: '주요 반려동물 보험사와 제휴되어 있어 보험 청구를 도와드립니다.' },
  { q: '입원 시 면회가 가능한가요?', a: '매일 14:00-16:00 면회 시간에 방문하실 수 있습니다. 사전 예약 부탁드립니다.' },
  { q: '주차 가능한가요?', a: '건물 지하 주차장 2시간 무료 주차가 가능합니다.' },
];

const faqNodes: BuilderCanvasNode[] = faqs.flatMap((f, i) => {
  const y = FAQ_Y + 70 + i * 110;
  const prefix = `tpl-petfaq-item-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x: 80, y, width: 800, height: 90 },
      background: i % 2 === 0 ? '#f3f4f6' : '#ffffff',
      borderRadius: 8,
      padding: 16,
    }),
    createTextNode({
      id: `${prefix}-q`,
      parentId: prefix,
      rect: { x: 16, y: 12, width: 768, height: 28 },
      text: `Q. ${f.q}`,
      fontSize: 16,
      color: '#123b63',
      fontWeight: 'bold',
      lineHeight: 1.4,
    }),
    createTextNode({
      id: `${prefix}-a`,
      parentId: prefix,
      rect: { x: 16, y: 46, width: 768, height: 32 },
      text: `A. ${f.a}`,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-petfaq-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-petfaq-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '자주 묻는 질문', 1, '#ffffff', 'left', 'tpl-petfaq-hero'),
  createTextNode({
    id: 'tpl-petfaq-hero-sub',
    parentId: 'tpl-petfaq-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '보호자님들이 자주 문의하시는 내용을 모았습니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-petfaq-list-title', { x: 80, y: FAQ_Y, width: 400, height: 50 }, 'FAQ', 2, '#123b63', 'left'),
  ...faqNodes,
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-petfaq-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-proof-label', parentId: 'tpl-petfaq-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-proof-title', parentId: 'tpl-petfaq-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'pet faq 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-proof-copy', parentId: 'tpl-petfaq-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-metric-1', parentId: 'tpl-petfaq-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-metric-1-value', parentId: 'tpl-petfaq-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-metric-1-label', parentId: 'tpl-petfaq-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-metric-2', parentId: 'tpl-petfaq-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-metric-2-value', parentId: 'tpl-petfaq-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-metric-2-label', parentId: 'tpl-petfaq-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-metric-3', parentId: 'tpl-petfaq-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-metric-3-value', parentId: 'tpl-petfaq-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-metric-3-label', parentId: 'tpl-petfaq-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-metric-4', parentId: 'tpl-petfaq-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-metric-4-value', parentId: 'tpl-petfaq-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-metric-4-label', parentId: 'tpl-petfaq-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-label', parentId: 'tpl-petfaq-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-title', parentId: 'tpl-petfaq-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-copy', parentId: 'tpl-petfaq-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-showcase-visual', parentId: 'tpl-petfaq-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-visual-title', parentId: 'tpl-petfaq-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-visual-copy', parentId: 'tpl-petfaq-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-showcase-card-1', parentId: 'tpl-petfaq-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-card-1-title', parentId: 'tpl-petfaq-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-card-1-copy', parentId: 'tpl-petfaq-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-showcase-card-2', parentId: 'tpl-petfaq-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-card-2-title', parentId: 'tpl-petfaq-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-card-2-copy', parentId: 'tpl-petfaq-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-showcase-card-3', parentId: 'tpl-petfaq-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-card-3-title', parentId: 'tpl-petfaq-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-showcase-card-3-copy', parentId: 'tpl-petfaq-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-petfaq-wix-quote', parentId: 'tpl-petfaq-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-quote-mark', parentId: 'tpl-petfaq-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-quote-body', parentId: 'tpl-petfaq-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-quote-role', parentId: 'tpl-petfaq-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-cta-label', parentId: 'tpl-petfaq-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-cta-title', parentId: 'tpl-petfaq-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-petfaq-wix-cta-copy', parentId: 'tpl-petfaq-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-petfaq-wix-cta-primary', parentId: 'tpl-petfaq-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-petfaq-wix-cta-secondary', parentId: 'tpl-petfaq-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
]);

export const petFaqTemplate: PageTemplate = {
  id: 'pet-faq',
  name: '동물병원 FAQ',
  category: 'pet',
  subcategory: 'faq',
  description: '반려동물 관리 FAQ + 8개 Q&A 쌍',
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
