import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';
import {
  createContainerNode,
  createTextNode,
  createImageNode,
  assignCanvasNodeZIndices,
} from '@/lib/builder/decompose/shared';
import type { PageTemplate } from '../types';

const W = 1280;
const HERO_H = 400;
const STORY_Y = HERO_H + 80;
const STORY_H = 300;
const FACILITY_Y = STORY_Y + STORY_H + 80;
const FACILITY_H = 300;
const STAGE_H = FACILITY_Y + FACILITY_H + 80;

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
  /* ── Hero ────────────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-fitabout-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  createImageNode({
    id: 'tpl-fitabout-hero-img',
    parentId: 'tpl-fitabout-hero',
    rect: { x: 640, y: 0, width: 640, height: HERO_H },
    src: '/images/placeholder-gym-interior.jpg',
    alt: '피트니스 센터 내부',
    style: { opacity: 60, borderRadius: 0 },
  }),
  heading(
    'tpl-fitabout-hero-title',
    { x: 80, y: 140, width: 520, height: 70 },
    '센터 소개',
    1,
    '#ffffff',
    'left',
    'tpl-fitabout-hero',
  ),
  createTextNode({
    id: 'tpl-fitabout-hero-sub',
    parentId: 'tpl-fitabout-hero',
    rect: { x: 80, y: 230, width: 480, height: 50 },
    text: '최고의 시설과 전문 트레이너가 함께하는 프리미엄 피트니스.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 'regular',
    lineHeight: 1.5,
  }),

  /* ── Gym story ───────────────────────────────────────────── */
  heading(
    'tpl-fitabout-story-title',
    { x: 80, y: STORY_Y, width: 400, height: 50 },
    '센터 이야기',
    2,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-fitabout-story-p1',
    rect: { x: 80, y: STORY_Y + 60, width: 1120, height: 80 },
    text: '2018년 오픈 이후, 단순한 운동 공간을 넘어 건강한 라이프스타일을 만들어가는 커뮤니티로 성장해 왔습니다. 과학적인 트레이닝 방법론과 최신 장비를 바탕으로 회원 한 분 한 분의 목표 달성을 지원합니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),
  createTextNode({
    id: 'tpl-fitabout-story-p2',
    rect: { x: 80, y: STORY_Y + 160, width: 1120, height: 80 },
    text: '500평 규모의 넓은 공간에 유산소, 근력, 기능성 트레이닝, 그룹 스튜디오 등 다양한 운동 공간을 갖추고 있으며, 샤워실, 사우나, 라운지 등 편의시설도 완비되어 있습니다.',
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 1.7,
  }),

  /* ── Facilities ──────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-fitabout-facility',
    rect: { x: 0, y: FACILITY_Y, width: W, height: FACILITY_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  heading(
    'tpl-fitabout-facility-title',
    { x: 80, y: 40, width: 400, height: 50 },
    '시설 안내',
    2,
    '#123b63',
    'left',
    'tpl-fitabout-facility',
  ),
  createContainerNode({
    id: 'tpl-fitabout-fac-1',
    parentId: 'tpl-fitabout-facility',
    rect: { x: 80, y: 110, width: 240, height: 140 },
    background: '#ffffff',
    borderRadius: 10,
    padding: 20,
  }),
  heading('tpl-fitabout-fac-1-title', { x: 20, y: 20, width: 200, height: 32 }, '프리웨이트 존', 3, '#123b63', 'left', 'tpl-fitabout-fac-1'),
  createTextNode({
    id: 'tpl-fitabout-fac-1-desc',
    parentId: 'tpl-fitabout-fac-1',
    rect: { x: 20, y: 60, width: 200, height: 50 },
    text: '바벨, 덤벨, 케틀벨 등 완비된 프리웨이트 구역',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-fitabout-fac-2',
    parentId: 'tpl-fitabout-facility',
    rect: { x: 350, y: 110, width: 240, height: 140 },
    background: '#ffffff',
    borderRadius: 10,
    padding: 20,
  }),
  heading('tpl-fitabout-fac-2-title', { x: 20, y: 20, width: 200, height: 32 }, '머신 트레이닝', 3, '#123b63', 'left', 'tpl-fitabout-fac-2'),
  createTextNode({
    id: 'tpl-fitabout-fac-2-desc',
    parentId: 'tpl-fitabout-fac-2',
    rect: { x: 20, y: 60, width: 200, height: 50 },
    text: '최신 Technogym 머신 30대 이상 보유',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-fitabout-fac-3',
    parentId: 'tpl-fitabout-facility',
    rect: { x: 620, y: 110, width: 240, height: 140 },
    background: '#ffffff',
    borderRadius: 10,
    padding: 20,
  }),
  heading('tpl-fitabout-fac-3-title', { x: 20, y: 20, width: 200, height: 32 }, '그룹 스튜디오', 3, '#123b63', 'left', 'tpl-fitabout-fac-3'),
  createTextNode({
    id: 'tpl-fitabout-fac-3-desc',
    parentId: 'tpl-fitabout-fac-3',
    rect: { x: 20, y: 60, width: 200, height: 50 },
    text: '요가, 필라테스, 댄스 등 전용 스튜디오 2실',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
  createContainerNode({
    id: 'tpl-fitabout-fac-4',
    parentId: 'tpl-fitabout-facility',
    rect: { x: 890, y: 110, width: 240, height: 140 },
    background: '#ffffff',
    borderRadius: 10,
    padding: 20,
  }),
  heading('tpl-fitabout-fac-4-title', { x: 20, y: 20, width: 200, height: 32 }, '편의시설', 3, '#123b63', 'left', 'tpl-fitabout-fac-4'),
  createTextNode({
    id: 'tpl-fitabout-fac-4-desc',
    parentId: 'tpl-fitabout-fac-4',
    rect: { x: 20, y: 60, width: 200, height: 50 },
    text: '샤워실, 사우나, 라운지, 무료 주차장 완비',
    fontSize: 14,
    color: '#374151',
    lineHeight: 1.5,
  }),
]);

export const fitnessAboutTemplate: PageTemplate = {
  id: 'fitness-about',
  name: '피트니스 센터 소개',
  category: 'fitness',
  subcategory: 'about',
  description: '히어로 이미지 + 센터 이야기 + 시설 안내(4 카드)',
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
