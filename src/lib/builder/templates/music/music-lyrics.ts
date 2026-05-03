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
const SONG_H = 400;
const SONG_GAP = 60;
const STAGE_H = HEADER_H + 40 + (SONG_H + SONG_GAP) * 4 + 40;

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

const songs = [
  {
    title: '새벽의 소리',
    lyrics: '고요한 밤이 지나고\n창가에 스미는 빛\n\n아직 잠들지 못한 마음에\n새벽이 속삭이네\n\n모든 것이 괜찮아질 거라고\n어둠 뒤에 빛이 온다고\n\n지금 이 순간을 기억해\n새벽의 소리를 들어봐',
  },
  {
    title: '도시의 밤',
    lyrics: '네온사인 아래 걷는 밤\n수많은 사람 속 홀로\n\n이 도시는 잠들지 않고\n나만 홀로 깨어있는 것 같아\n\n하지만 어딘가 같은 밤을\n바라보는 누군가가 있겠지\n\n외롭지 않아 이 도시의 밤\n우리는 함께 빛나고 있으니까',
  },
  {
    title: '첫 번째 여행',
    lyrics: '낯선 길 위에 서면\n두렵기도 하지만\n\n발걸음 하나하나가\n새로운 이야기가 되어\n\n바람이 부는 대로\n마음이 이끄는 대로\n\n이 여행의 끝에서\n더 나은 내가 되어있길',
  },
  {
    title: '빗소리',
    lyrics: '창밖에 내리는 비\n리듬처럼 떨어지는 물방울\n\n오늘은 아무것도 하지 않아도\n괜찮은 날이야\n\n빗소리에 기대어\n오래된 노래를 흥얼거려\n\n이 고요한 오후가\n나에게 주는 작은 선물',
  },
];

function songBlock(n: number): BuilderCanvasNode[] {
  const y = HEADER_H + 40 + (SONG_H + SONG_GAP) * (n - 1);
  const cId = `tpl-muslyrics-song-${n}`;
  const s = songs[n - 1];
  const bg = n % 2 === 0 ? '#f3f4f6' : '#ffffff';
  return [
    createContainerNode({
      id: cId,
      rect: { x: 80, y, width: W - 160, height: SONG_H },
      background: bg,
      borderRadius: 12,
      padding: 40,
    }),
    heading(`${cId}-title`, { x: 40, y: 24, width: 600, height: 40 }, s.title, 2, '#123b63', 'left', cId),
    createTextNode({
      id: `${cId}-text`,
      parentId: cId,
      rect: { x: 40, y: 80, width: 800, height: 280 },
      text: s.lyrics,
      fontSize: 16,
      color: '#1f2937',
      lineHeight: 1.8,
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-muslyrics-header',
    rect: { x: 0, y: 0, width: W, height: HEADER_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading(
    'tpl-muslyrics-title',
    { x: 80, y: 35, width: 400, height: 50 },
    '가사',
    1,
    '#ffffff',
    'left',
    'tpl-muslyrics-header',
  ),

  ...songBlock(1),
  ...songBlock(2),
  ...songBlock(3),
  ...songBlock(4),
  /* ── Wix-grade expansion scaffold ───────────────────────────────────── */
  createContainerNode({
    id: 'tpl-musiclyrics-wix-proof', rect: { x: 64, y: STAGE_H + 40, width: 1152, height: 520 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-text',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-showcase', rect: { x: 64, y: STAGE_H + 620, width: 1152, height: 560 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-cta', rect: { x: 64, y: STAGE_H + 1240, width: 1152, height: 600 }, background: '#123b63', borderColor: '#123b63', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-proof-label', parentId: 'tpl-musiclyrics-wix-proof', rect: { x: 56, y: 48, width: 260, height: 28 }, text: 'Wix-grade proof system', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-proof-title', parentId: 'tpl-musiclyrics-wix-proof', rect: { x: 56, y: 92, width: 560, height: 82 }, text: 'music lyrics 페이지의 핵심 신뢰 요소를 한눈에 보여줍니다', fontSize: 36, color: '#123b63', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-proof-copy', parentId: 'tpl-musiclyrics-wix-proof', rect: { x: 56, y: 190, width: 540, height: 64 }, text: '서비스 가치, 성과 지표, 다음 행동을 분리해 방문자가 빠르게 판단할 수 있는 풍부한 페이지 흐름을 만듭니다.', fontSize: 17, color: '#475569', lineHeight: 1.55, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-metric-1', parentId: 'tpl-musiclyrics-wix-proof', rect: { x: 56, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-metric-1-value', parentId: 'tpl-musiclyrics-wix-metric-1', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '4.9', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-metric-1-label', parentId: 'tpl-musiclyrics-wix-metric-1', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '고객 평가와 재방문 신뢰 지표', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-metric-2', parentId: 'tpl-musiclyrics-wix-proof', rect: { x: 310, y: 310, width: 230, height: 130 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-metric-2-value', parentId: 'tpl-musiclyrics-wix-metric-2', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '24h', fontSize: 34, color: '#1e5a96', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-metric-2-label', parentId: 'tpl-musiclyrics-wix-metric-2', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '초기 문의와 예약 흐름을 빠르게 연결', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-metric-3', parentId: 'tpl-musiclyrics-wix-proof', rect: { x: 650, y: 70, width: 210, height: 150 }, background: '#eff6ff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-metric-3-value', parentId: 'tpl-musiclyrics-wix-metric-3', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '6+', fontSize: 34, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-metric-3-label', parentId: 'tpl-musiclyrics-wix-metric-3', rect: { x: 22, y: 76, width: 168, height: 42 }, text: '섹션 단위 정보 구조로 풍부도 강화', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-metric-4', parentId: 'tpl-musiclyrics-wix-proof', rect: { x: 884, y: 70, width: 210, height: 150 }, background: '#fff7ed', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'stat-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-metric-4-value', parentId: 'tpl-musiclyrics-wix-metric-4', rect: { x: 22, y: 22, width: 140, height: 42 }, text: '3x', fontSize: 34, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-metric-4-label', parentId: 'tpl-musiclyrics-wix-metric-4', rect: { x: 22, y: 76, width: 168, height: 42 }, text: 'CTA, proof, showcase 접점을 반복 배치', fontSize: 14, color: '#64748b', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-label', parentId: 'tpl-musiclyrics-wix-showcase', rect: { x: 56, y: 48, width: 240, height: 28 }, text: 'Showcase module', fontSize: 13, color: '#1e5a96', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-title', parentId: 'tpl-musiclyrics-wix-showcase', rect: { x: 56, y: 88, width: 540, height: 78 }, text: '카드, 사례, 단계 설명을 한 섹션 안에서 비교합니다', fontSize: 34, color: '#123b63', fontWeight: 'bold', lineHeight: 1.18, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-copy', parentId: 'tpl-musiclyrics-wix-showcase', rect: { x: 56, y: 178, width: 520, height: 58 }, text: '기존 짧은 페이지에 비교 가능한 카드와 설명을 더해 방문자의 탐색 깊이를 높입니다.', fontSize: 16, color: '#475569', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-showcase-visual', parentId: 'tpl-musiclyrics-wix-showcase', rect: { x: 640, y: 54, width: 430, height: 208 }, background: '#e0f2fe', borderColor: '#bae6fd', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-visual-title', parentId: 'tpl-musiclyrics-wix-showcase-visual', rect: { x: 32, y: 36, width: 300, height: 40 }, text: 'Visual proof area', fontSize: 24, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-visual-copy', parentId: 'tpl-musiclyrics-wix-showcase-visual', rect: { x: 32, y: 94, width: 330, height: 54 }, text: '이미지나 사례 카드가 들어갈 수 있는 큰 시각 영역을 확보합니다.', fontSize: 15, color: '#475569', lineHeight: 1.42, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-showcase-card-1', parentId: 'tpl-musiclyrics-wix-showcase', rect: { x: 56, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-card-1-title', parentId: 'tpl-musiclyrics-wix-showcase-card-1', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '핵심 가치', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-card-1-copy', parentId: 'tpl-musiclyrics-wix-showcase-card-1', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '첫 방문자가 바로 이해할 수 있는 대표 메시지를 카드로 고정합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-showcase-card-2', parentId: 'tpl-musiclyrics-wix-showcase', rect: { x: 416, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-card-2-title', parentId: 'tpl-musiclyrics-wix-showcase-card-2', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '선택 기준', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-card-2-copy', parentId: 'tpl-musiclyrics-wix-showcase-card-2', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '가격, 일정, 품질처럼 비교해야 하는 항목을 짧은 문장으로 설명합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-showcase-card-3', parentId: 'tpl-musiclyrics-wix-showcase', rect: { x: 776, y: 310, width: 320, height: 170 }, background: '#f8fafc', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'services-detail-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-card-3-title', parentId: 'tpl-musiclyrics-wix-showcase-card-3', rect: { x: 24, y: 26, width: 250, height: 34 }, text: '다음 행동', fontSize: 22, color: '#123b63', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-showcase-card-3-copy', parentId: 'tpl-musiclyrics-wix-showcase-card-3', rect: { x: 24, y: 78, width: 250, height: 60 }, text: '문의, 예약, 구독, 구매 같은 다음 행동을 명확히 연결합니다.', fontSize: 14, color: '#64748b', lineHeight: 1.45, className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-quote', parentId: 'tpl-musiclyrics-wix-proof', rect: { x: 650, y: 260, width: 444, height: 180 }, background: '#ffffff', borderColor: '#dbe4ee', borderWidth: 1, borderRadius: 22, padding: 0, className: 'office-card',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-quote-mark', parentId: 'tpl-musiclyrics-wix-quote', rect: { x: 28, y: 22, width: 44, height: 44 }, text: '“', fontSize: 40, color: '#e8a838', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-quote-body', parentId: 'tpl-musiclyrics-wix-quote', rect: { x: 78, y: 34, width: 300, height: 72 }, text: '정보가 충분히 분리되어 있어 페이지를 훑는 속도가 빨라졌습니다.', fontSize: 16, color: '#334155', lineHeight: 1.42, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-quote-role', parentId: 'tpl-musiclyrics-wix-quote', rect: { x: 78, y: 124, width: 240, height: 24 }, text: 'Template quality reviewer', fontSize: 13, color: '#64748b', fontWeight: 'medium', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-cta-label', parentId: 'tpl-musiclyrics-wix-cta', rect: { x: 64, y: 58, width: 260, height: 28 }, text: 'Conversion-ready section', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'hero-eyebrow',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-cta-title', parentId: 'tpl-musiclyrics-wix-cta', rect: { x: 64, y: 102, width: 560, height: 92 }, text: '방문자가 다음 단계로 이동할 수 있게 마지막 전환을 강화합니다', fontSize: 38, color: '#ffffff', fontWeight: 'bold', lineHeight: 1.16, className: 'hero-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-cta-copy', parentId: 'tpl-musiclyrics-wix-cta', rect: { x: 64, y: 214, width: 560, height: 64 }, text: '짧은 설득 문구, 보조 안내, 두 개의 행동 버튼을 같은 영역에 묶어 전환 흐름을 분명하게 만듭니다.', fontSize: 17, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5, className: 'hero-subtitle',
  }),
  createButtonNode({
    id: 'tpl-musiclyrics-wix-cta-primary', parentId: 'tpl-musiclyrics-wix-cta', rect: { x: 64, y: 318, width: 178, height: 52 }, label: '문의 시작', href: '#contact', variant: 'primary', className: 'hero-cta', style: { backgroundColor: '#e8a838', borderRadius: 8 },
  }),
  createButtonNode({
    id: 'tpl-musiclyrics-wix-cta-secondary', parentId: 'tpl-musiclyrics-wix-cta', rect: { x: 266, y: 318, width: 176, height: 52 }, label: '자세히 보기', href: '#contact', variant: 'outline', className: 'hero-cta', style: { backgroundColor: 'transparent', borderColor: '#ffffff', borderWidth: 1, borderRadius: 8 },
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-cta-note', parentId: 'tpl-musiclyrics-wix-cta', rect: { x: 64, y: 402, width: 420, height: 30 }, text: 'Global header와 footer는 그대로 두고 인페이지 전환만 보강합니다.', fontSize: 13, color: 'rgba(255,255,255,0.68)', className: 'card-copy',
  }),
  createContainerNode({
    id: 'tpl-musiclyrics-wix-timeline', parentId: 'tpl-musiclyrics-wix-cta', rect: { x: 690, y: 70, width: 360, height: 390 }, background: 'rgba(255,255,255,0.10)', borderColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderRadius: 22, padding: 0, className: 'split-image',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-timeline-label', parentId: 'tpl-musiclyrics-wix-timeline', rect: { x: 28, y: 28, width: 240, height: 24 }, text: 'Decision path', fontSize: 13, color: '#e8a838', fontWeight: 'bold', textTransform: 'uppercase', className: 'section-label',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-timeline-1-title', parentId: 'tpl-musiclyrics-wix-timeline', rect: { x: 28, y: 76, width: 260, height: 28 }, text: '1. 이해', fontSize: 20, color: '#ffffff', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-timeline-1-body', parentId: 'tpl-musiclyrics-wix-timeline', rect: { x: 28, y: 110, width: 270, height: 40 }, text: '문제, 대상, 제공 가치를 먼저 정렬합니다.', fontSize: 14, color: 'rgba(255,255,255,0.76)', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-timeline-2-title', parentId: 'tpl-musiclyrics-wix-timeline', rect: { x: 28, y: 174, width: 260, height: 28 }, text: '2. 비교', fontSize: 20, color: '#ffffff', fontWeight: 'bold', className: 'card-title',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-timeline-2-body', parentId: 'tpl-musiclyrics-wix-timeline', rect: { x: 28, y: 208, width: 270, height: 40 }, text: '카드와 지표로 선택 기준을 빠르게 보여줍니다.', fontSize: 14, color: 'rgba(255,255,255,0.76)', lineHeight: 1.35, className: 'card-copy',
  }),
  createTextNode({
    id: 'tpl-musiclyrics-wix-timeline-3-title', parentId: 'tpl-musiclyrics-wix-timeline', rect: { x: 28, y: 272, width: 260, height: 28 }, text: '3. 전환', fontSize: 20, color: '#ffffff', fontWeight: 'bold', className: 'card-title',
  }),
]);

export const musicLyricsTemplate: PageTemplate = {
  id: 'music-lyrics',
  name: '뮤직 가사',
  category: 'music',
  subcategory: 'lyrics',
  description: '가사 페이지, 4곡의 제목 + 가사 블록',
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
