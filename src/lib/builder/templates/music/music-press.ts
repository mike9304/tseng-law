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
const HEADER_H = 120;
const KIT_Y = HEADER_H + 60;
const KIT_H = 260;
const REVIEWS_Y = KIT_Y + KIT_H + 60;
const REVIEWS_H = 400;
const INTERVIEWS_Y = REVIEWS_Y + REVIEWS_H + 60;
const INTERVIEWS_H = 260;
const STAGE_H = INTERVIEWS_Y + INTERVIEWS_H + 80;

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
    id: 'tpl-muspress-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-muspress-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '프레스 / 미디어',
    1,
    '#ffffff',
    'left',
    'tpl-muspress-header',
  ),

  /* ── Press kit ──────────────────────────────────────────── */
  heading(
    'tpl-muspress-kit-title',
    { x: 80, y: KIT_Y, width: 400, height: 50 },
    '프레스 키트',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-muspress-kit',
    rect: { x: 80, y: KIT_Y + 70, width: W - 160, height: 160 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  createTextNode({
    id: 'tpl-muspress-kit-desc',
    parentId: 'tpl-muspress-kit',
    rect: { x: 24, y: 16, width: 700, height: 60 },
    text: '고해상도 아티스트 사진, 바이오그래피, 로고, 앨범 아트워크 등\n미디어 보도에 필요한 모든 자료를 한 번에 다운로드하세요.',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-muspress-kit-btn',
    parentId: 'tpl-muspress-kit',
    rect: { x: 24, y: 100, width: 200, height: 44 },
    label: '프레스 키트 다운로드',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Press reviews ──────────────────────────────────────── */
  heading(
    'tpl-muspress-reviews-title',
    { x: 80, y: REVIEWS_Y, width: 400, height: 50 },
    '언론 리뷰',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-muspress-rev-1',
    rect: { x: 80, y: REVIEWS_Y + 70, width: W - 160, height: 90 },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 20,
  }),
  createTextNode({
    id: 'tpl-muspress-rev-1-text',
    parentId: 'tpl-muspress-rev-1',
    rect: { x: 20, y: 12, width: 800, height: 28 },
    text: '"올해 가장 주목할 만한 인디 밴드" — 음악잡지 사운드',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-muspress-rev-1-date',
    parentId: 'tpl-muspress-rev-1',
    rect: { x: 20, y: 48, width: 200, height: 20 },
    text: '2026.03.15',
    fontSize: 13,
    color: '#6b7280',
  }),
  createContainerNode({
    id: 'tpl-muspress-rev-2',
    rect: { x: 80, y: REVIEWS_Y + 180, width: W - 160, height: 90 },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 20,
  }),
  createTextNode({
    id: 'tpl-muspress-rev-2-text',
    parentId: 'tpl-muspress-rev-2',
    rect: { x: 20, y: 12, width: 800, height: 28 },
    text: '"감성적이면서도 강렬한 라이브 퍼포먼스" — 일간 뮤직',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-muspress-rev-2-date',
    parentId: 'tpl-muspress-rev-2',
    rect: { x: 20, y: 48, width: 200, height: 20 },
    text: '2025.11.20',
    fontSize: 13,
    color: '#6b7280',
  }),
  createContainerNode({
    id: 'tpl-muspress-rev-3',
    rect: { x: 80, y: REVIEWS_Y + 290, width: W - 160, height: 90 },
    background: '#f3f4f6',
    borderRadius: 8,
    padding: 20,
  }),
  createTextNode({
    id: 'tpl-muspress-rev-3-text',
    parentId: 'tpl-muspress-rev-3',
    rect: { x: 20, y: 12, width: 800, height: 28 },
    text: '"한국 록의 새로운 물결을 이끄는 밴드" — 한국음악평론',
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-muspress-rev-3-date',
    parentId: 'tpl-muspress-rev-3',
    rect: { x: 20, y: 48, width: 200, height: 20 },
    text: '2025.08.05',
    fontSize: 13,
    color: '#6b7280',
  }),

  /* ── Interview links ────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-muspress-intv',
    rect: { x: 0, y: INTERVIEWS_Y, width: W, height: INTERVIEWS_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-muspress-intv-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '인터뷰',
    2,
    '#123b63',
    'left',
    'tpl-muspress-intv',
  ),
  createTextNode({
    id: 'tpl-muspress-intv-list',
    parentId: 'tpl-muspress-intv',
    rect: { x: 80, y: 100, width: 800, height: 120 },
    text: '• [영상] "새벽의 소리" 앨범 인터뷰 — YouTube 뮤직채널\n• [기사] 블루 하모니 김준호 보컬 인터뷰 — 음악과 사람\n• [팟캐스트] 밴드의 탄생: 블루 하모니 이야기 — 뮤직토크',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.8,
  }),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-musicpress-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-proof-label', parentId: 'tpl-musicpress-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-proof-title', parentId: 'tpl-musicpress-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'music press 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-proof-copy', parentId: 'tpl-musicpress-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-metric-1', parentId: 'tpl-musicpress-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-metric-1-value', parentId: 'tpl-musicpress-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-metric-1-label', parentId: 'tpl-musicpress-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-metric-2', parentId: 'tpl-musicpress-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-metric-2-value', parentId: 'tpl-musicpress-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-metric-2-label', parentId: 'tpl-musicpress-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-metric-3', parentId: 'tpl-musicpress-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-metric-3-value', parentId: 'tpl-musicpress-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-metric-3-label', parentId: 'tpl-musicpress-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-metric-4', parentId: 'tpl-musicpress-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-metric-4-value', parentId: 'tpl-musicpress-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-metric-4-label', parentId: 'tpl-musicpress-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-label', parentId: 'tpl-musicpress-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-title', parentId: 'tpl-musicpress-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-copy', parentId: 'tpl-musicpress-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-showcase-visual', parentId: 'tpl-musicpress-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-visual-title', parentId: 'tpl-musicpress-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-visual-copy', parentId: 'tpl-musicpress-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-showcase-card-1', parentId: 'tpl-musicpress-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-card-1-title', parentId: 'tpl-musicpress-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-card-1-copy', parentId: 'tpl-musicpress-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-showcase-card-2', parentId: 'tpl-musicpress-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-card-2-title', parentId: 'tpl-musicpress-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-card-2-copy', parentId: 'tpl-musicpress-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-showcase-card-3', parentId: 'tpl-musicpress-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-card-3-title', parentId: 'tpl-musicpress-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-showcase-card-3-copy', parentId: 'tpl-musicpress-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musicpress-wix-quote', parentId: 'tpl-musicpress-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-quote-mark', parentId: 'tpl-musicpress-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musicpress-wix-quote-body', parentId: 'tpl-musicpress-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
]);

export const musicPressTemplate: PageTemplate = {
  id: 'music-press',
  name: '뮤직 프레스',
  category: 'music',
  subcategory: 'press',
  description: '프레스 키트 + 언론 리뷰 + 인터뷰 링크',
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
