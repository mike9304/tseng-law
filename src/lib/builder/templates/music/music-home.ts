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

const W = 1280;
const HERO_H = 600;
const RELEASE_Y = HERO_H + 80;
const RELEASE_H = 300;
const SHOWS_Y = RELEASE_Y + RELEASE_H + 80;
const SHOWS_H = 360;
const SOCIAL_Y = SHOWS_Y + SHOWS_H + 80;
const SOCIAL_H = 160;
const STAGE_H = SOCIAL_Y + SOCIAL_H + 80;

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
  /* ── Bold hero ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-mushome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-mushome-hero-bg',
    parentId: 'tpl-mushome-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    src: '/images/placeholder-music-hero.jpg',
    alt: '아티스트 라이브 공연 사진',
    style: { opacity: 30, borderRadius: 0 },
  }),
  heading(
    'tpl-mushome-hero-name',
    { x: 80, y: 180, width: 700, height: 120 },
    '블루 하모니',
    1,
    '#ffffff',
    'left',
    'tpl-mushome-hero',
  ),
  createTextNode({
    id: 'tpl-mushome-hero-genre',
    parentId: 'tpl-mushome-hero',
    rect: { x: 80, y: 310, width: 400, height: 32 },
    text: 'Alternative Rock / Indie',
    fontSize: 18,
    color: '#e8a838',
    fontWeight: 'medium',
  }),
  createButtonNode({
    id: 'tpl-mushome-hero-cta',
    parentId: 'tpl-mushome-hero',
    rect: { x: 80, y: 380, width: 220, height: 52 },
    label: '최신 앨범 듣기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Latest release ─────────────────────────────────────── */
  heading(
    'tpl-mushome-release-title',
    { x: 80, y: RELEASE_Y, width: 400, height: 50 },
    '최신 앨범',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-mushome-release',
    rect: { x: 80, y: RELEASE_Y + 70, width: W - 160, height: 200 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 0,
  }),
  createImageNode({
    id: 'tpl-mushome-release-cover',
    parentId: 'tpl-mushome-release',
    rect: { x: 0, y: 0, width: 200, height: 200 },
    src: '/images/placeholder-album-cover.jpg',
    alt: '최신 앨범 커버',
    style: { borderRadius: 0 },
  }),
  heading('tpl-mushome-release-name', { x: 224, y: 24, width: 500, height: 36 }, '새벽의 소리', 3, '#123b63', 'left', 'tpl-mushome-release'),
  createTextNode({
    id: 'tpl-mushome-release-info',
    parentId: 'tpl-mushome-release',
    rect: { x: 224, y: 70, width: 500, height: 60 },
    text: '2026년 3월 발매 | 10곡 수록\n밤의 고요함과 새벽의 설렘을 담은 세 번째 정규 앨범',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-mushome-release-btn',
    parentId: 'tpl-mushome-release',
    rect: { x: 224, y: 146, width: 140, height: 40 },
    label: '스트리밍',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Upcoming shows (3 cards) ───────────────────────────── */
  heading(
    'tpl-mushome-shows-title',
    { x: 80, y: SHOWS_Y, width: 400, height: 50 },
    '다가오는 공연',
    2,
    '#123b63',
    'left',
  ),
  createContainerNode({
    id: 'tpl-mushome-show-1',
    rect: { x: 80, y: SHOWS_Y + 70, width: 350, height: 240 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-mushome-show-1-date', { x: 24, y: 16, width: 200, height: 30 }, '2026.05.10', 3, '#e8a838', 'left', 'tpl-mushome-show-1'),
  createTextNode({
    id: 'tpl-mushome-show-1-venue',
    parentId: 'tpl-mushome-show-1',
    rect: { x: 24, y: 56, width: 302, height: 60 },
    text: '서울 올림픽홀\n토요일 오후 7시',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-mushome-show-1-btn',
    parentId: 'tpl-mushome-show-1',
    rect: { x: 24, y: 140, width: 140, height: 40 },
    label: '티켓 구매',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  createContainerNode({
    id: 'tpl-mushome-show-2',
    rect: { x: 460, y: SHOWS_Y + 70, width: 350, height: 240 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-mushome-show-2-date', { x: 24, y: 16, width: 200, height: 30 }, '2026.06.22', 3, '#e8a838', 'left', 'tpl-mushome-show-2'),
  createTextNode({
    id: 'tpl-mushome-show-2-venue',
    parentId: 'tpl-mushome-show-2',
    rect: { x: 24, y: 56, width: 302, height: 60 },
    text: '부산 벡스코 컨벤션홀\n토요일 오후 6시',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-mushome-show-2-btn',
    parentId: 'tpl-mushome-show-2',
    rect: { x: 24, y: 140, width: 140, height: 40 },
    label: '티켓 구매',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
  createContainerNode({
    id: 'tpl-mushome-show-3',
    rect: { x: 840, y: SHOWS_Y + 70, width: 350, height: 240 },
    background: '#f3f4f6',
    borderRadius: 12,
    padding: 24,
  }),
  heading('tpl-mushome-show-3-date', { x: 24, y: 16, width: 200, height: 30 }, '2026.07.15', 3, '#e8a838', 'left', 'tpl-mushome-show-3'),
  createTextNode({
    id: 'tpl-mushome-show-3-venue',
    parentId: 'tpl-mushome-show-3',
    rect: { x: 24, y: 56, width: 302, height: 60 },
    text: '대구 엑스코 공연장\n일요일 오후 5시',
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 1.6,
  }),
  createButtonNode({
    id: 'tpl-mushome-show-3-btn',
    parentId: 'tpl-mushome-show-3',
    rect: { x: 24, y: 140, width: 140, height: 40 },
    label: '티켓 구매',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),

  /* ── Social links ───────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-mushome-social',
    rect: { x: 0, y: SOCIAL_Y, width: W, height: SOCIAL_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-mushome-social-text',
    parentId: 'tpl-mushome-social',
    rect: { x: 80, y: 40, width: 600, height: 32 },
    text: 'Instagram · YouTube · Spotify · Apple Music · SoundCloud',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'medium',
  }),
  createTextNode({
    id: 'tpl-mushome-social-follow',
    parentId: 'tpl-mushome-social',
    rect: { x: 80, y: 90, width: 400, height: 28 },
    text: '팔로우하고 최신 소식을 받아보세요',
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  }),
]);

export const musicHomeTemplate: PageTemplate = {
  id: 'music-home',
  name: '뮤직 홈',
  category: 'music',
  subcategory: 'homepage',
  description: '대담한 히어로 + 최신 앨범 + 공연 일정(3개) + 소셜 링크',
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
