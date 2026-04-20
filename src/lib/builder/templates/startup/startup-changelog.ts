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
const TIMELINE_Y = HERO_H + 80;
const TIMELINE_H = 900;
const STAGE_H = TIMELINE_Y + TIMELINE_H + 80;

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

const versions = [
  { ver: 'v3.2.0', date: '2026.04.10', desc: 'AI 인사이트 기능 추가. 데이터 패턴 자동 분석 및 추천 알림 지원.' },
  { ver: 'v3.1.0', date: '2026.03.20', desc: '워크플로우 빌더 UI 개편. 드래그 앤 드롭 개선, 조건 분기 기능 추가.' },
  { ver: 'v3.0.0', date: '2026.02.15', desc: '엔터프라이즈 플랜 출시. SSO, SCIM, 감사 로그, 전용 서버 지원.' },
  { ver: 'v2.5.0', date: '2026.01.10', desc: 'API 게이트웨이 v2 릴리즈. GraphQL 지원, 속도 2배 향상.' },
  { ver: 'v2.4.0', date: '2025.12.01', desc: '실시간 대시보드 커스터마이징 기능. 위젯 드래그, 필터 저장.' },
  { ver: 'v2.3.0', date: '2025.11.01', desc: '슬랙, 노션, 구글 워크스페이스 연동 추가.' },
];

const entryH = 130;
const gapY = 20;

const entries: BuilderCanvasNode[] = versions.flatMap((v, i) => {
  const y = TIMELINE_Y + 70 + i * (entryH + gapY);
  const prefix = `tpl-stuplog-entry-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x: 80, y, width: 800, height: entryH },
      background: i % 2 === 0 ? '#f3f4f6' : '#ffffff',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-ver`, { x: 24, y: 16, width: 200, height: 32 }, v.ver, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-date`,
      parentId: prefix,
      rect: { x: 240, y: 22, width: 150, height: 24 },
      text: v.date,
      fontSize: 14,
      color: '#e8a838',
      fontWeight: 'medium',
      lineHeight: 1.3,
    }),
    createTextNode({
      id: `${prefix}-desc`,
      parentId: prefix,
      rect: { x: 24, y: 60, width: 752, height: 50 },
      text: v.desc,
      fontSize: 15,
      color: '#374151',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stuplog-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stuplog-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '변경 이력', 1, '#ffffff', 'left', 'tpl-stuplog-hero'),
  createTextNode({
    id: 'tpl-stuplog-hero-sub',
    parentId: 'tpl-stuplog-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '제품 업데이트와 새로운 기능을 확인하세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-stuplog-timeline-title', { x: 80, y: TIMELINE_Y, width: 400, height: 50 }, '릴리즈 노트', 2, '#123b63', 'left'),
  ...entries,
]);

export const startupChangelogTemplate: PageTemplate = {
  id: 'startup-changelog',
  name: '스타트업 변경이력',
  category: 'startup',
  subcategory: 'changelog',
  description: '제품 업데이트 타임라인 + 6개 버전 엔트리',
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
