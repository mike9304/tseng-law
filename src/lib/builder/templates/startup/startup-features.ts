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
const GRID_Y = HERO_H + 80;
const GRID_H = 700;
const STAGE_H = GRID_Y + GRID_H + 80;

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

const features = [
  { title: '실시간 대시보드', desc: '핵심 KPI를 실시간으로 모니터링하고 커스텀 차트를 생성할 수 있습니다.' },
  { title: '워크플로우 빌더', desc: '드래그 앤 드롭으로 복잡한 비즈니스 프로세스를 자동화하세요.' },
  { title: '팀 협업 허브', desc: '프로젝트별 채널, 코멘트, 파일 공유로 팀 커뮤니케이션을 강화합니다.' },
  { title: 'API 게이트웨이', desc: 'RESTful API로 외부 서비스와 원활하게 데이터를 주고받습니다.' },
  { title: '보안 & 권한 관리', desc: '역할 기반 접근 제어와 SSO 지원으로 엔터프라이즈급 보안을 제공합니다.' },
  { title: 'AI 인사이트', desc: 'AI가 데이터 패턴을 분석하여 비즈니스 인사이트를 자동으로 제안합니다.' },
];

const cardW = 360;
const cardH = 220;
const gapX = 30;
const gapY = 30;

const cards: BuilderCanvasNode[] = features.flatMap((f, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-stupfeat-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 312, height: 36 }, f.title, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 70, width: 312, height: 100 },
      text: f.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stupfeat-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupfeat-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '기능 상세', 1, '#ffffff', 'left', 'tpl-stupfeat-hero'),
  createTextNode({
    id: 'tpl-stupfeat-hero-sub',
    parentId: 'tpl-stupfeat-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '비즈니스 성장을 가속하는 강력한 기능들을 살펴보세요.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-stupfeat-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '주요 기능', 2, '#123b63', 'left'),
  ...cards,
]);

export const startupFeaturesTemplate: PageTemplate = {
  id: 'startup-features',
  name: '스타트업 기능',
  category: 'startup',
  subcategory: 'features',
  description: '기능 딥다이브 + 6개 기능 카드(아이콘/제목/설명)',
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
