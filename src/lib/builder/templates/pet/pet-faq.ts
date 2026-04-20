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
    stageHeight: STAGE_H,
    nodes,
  },
};
