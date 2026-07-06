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
import { buildCategoryContactMethods, buildCategoryProofSections, CONTACT_METHODS_HEIGHT, SUBPAGE_PROOF_HEIGHT } from '../_shared/subpage-proof-sections';

const W = 1280;
const STAGE_H = 700;

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
    content: { text, level, color, align, fontFamily: 'Noto Serif KR' },
  };
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-travelcontact-left',
    rect: { x: 0, y: 0, width: 600, height: STAGE_H },
    background: '#ffffff',
    borderRadius: 0,
    padding: 0,
  }),
  heading(
    'tpl-travelcontact-title',
    { x: 80, y: 60, width: 440, height: 56 },
    '여행 문의',
    1,
    '#101827',
    'left',
    'tpl-travelcontact-left',
  ),
  createTextNode({
    id: 'tpl-travelcontact-intro',
    parentId: 'tpl-travelcontact-left',
    rect: { x: 80, y: 130, width: 440, height: 48 },
    text: '원하는 여행에 대해 말씀해 주세요. 맞춤 일정을 설계해 드립니다.',
    fontSize: 16,
    color: '#101827',
    lineHeight: 1.5,
  }),
  heading('tpl-travelcontact-office-label', { x: 80, y: 210, width: 200, height: 32 }, '사무소', 3, '#101827', 'left', 'tpl-travelcontact-left'),
  createTextNode({
    id: 'tpl-travelcontact-office',
    parentId: 'tpl-travelcontact-left',
    rect: { x: 80, y: 250, width: 440, height: 48 },
    text: '서울시 중구 남대문로 78 여행센터빌딩 5층\n부산시 해운대구 해운대로 456 3층',
    fontSize: 15,
    color: '#101827',
    lineHeight: 1.5,
  }),
  heading('tpl-travelcontact-phone-label', { x: 80, y: 320, width: 200, height: 32 }, '전화번호', 3, '#101827', 'left', 'tpl-travelcontact-left'),
  createTextNode({
    id: 'tpl-travelcontact-phone',
    parentId: 'tpl-travelcontact-left',
    rect: { x: 80, y: 360, width: 300, height: 32 },
    text: '1588-0000 (대표) / 010-9999-0000 (긴급)',
    fontSize: 15,
    color: '#101827',
    fontWeight: 'medium',
  }),
  heading('tpl-travelcontact-hours-label', { x: 80, y: 420, width: 200, height: 32 }, '영업 시간', 3, '#101827', 'left', 'tpl-travelcontact-left'),
  createTextNode({
    id: 'tpl-travelcontact-hours',
    parentId: 'tpl-travelcontact-left',
    rect: { x: 80, y: 460, width: 400, height: 60 },
    text: '월 - 금: 09:00 ~ 18:00\n토요일: 10:00 ~ 15:00\n긴급 연락: 24시간',
    fontSize: 15,
    color: '#101827',
    lineHeight: 1.5,
  }),
  createButtonNode({
    id: 'tpl-travelcontact-inquiry-btn',
    parentId: 'tpl-travelcontact-left',
    rect: { x: 80, y: 570, width: 200, height: 52 },
    label: '여행 문의하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#d88a3d', borderRadius: 6 },
  }),

  createContainerNode({
    id: 'tpl-travelcontact-right',
    rect: { x: 600, y: 0, width: 680, height: STAGE_H },
    background: '#f3e6cf',
    borderRadius: 0,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-travelcontact-map',
    parentId: 'tpl-travelcontact-right',
    rect: { x: 60, y: 60, width: 560, height: 400 },
    src: '/images/placeholder-travel-map.jpg',
    alt: '사무소 위치 지도',
    style: { borderRadius: 12 },
  }),
  createTextNode({
    id: 'tpl-travelcontact-emergency',
    parentId: 'tpl-travelcontact-right',
    rect: { x: 60, y: 490, width: 400, height: 32 },
    text: '여행 중 긴급 상황 시 24시간 전화 지원',
    fontSize: 14,
    color: '#657184',
  }),
  ...buildCategoryContactMethods('travel', 'travel-contact-dir', STAGE_H),
  ...buildCategoryProofSections('travel', 'travel-contact', STAGE_H + CONTACT_METHODS_HEIGHT),
]);

export const travelContactTemplate: PageTemplate = {
  id: 'travel-contact',
  name: '여행 문의',
  category: 'travel',
  subcategory: 'contact',
  description: '분할 레이아웃: 좌측(문의/사무소/전화/시간) + 우측(지도)',
  document: {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-04-15T00:00:00+09:00',
    updatedBy: 'template-system',
    stageWidth: W,
    stageHeight: STAGE_H + CONTACT_METHODS_HEIGHT + SUBPAGE_PROOF_HEIGHT,
    nodes,
  },
};
