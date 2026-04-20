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
    stageHeight: STAGE_H,
    nodes,
  },
};
