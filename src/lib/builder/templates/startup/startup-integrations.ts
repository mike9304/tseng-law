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
const GRID_H = 640;
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

const integrations = [
  { name: 'Slack', desc: '알림과 워크플로우 트리거를 슬랙 채널로 전송합니다.' },
  { name: 'Notion', desc: '노션 페이지와 데이터베이스를 양방향으로 동기화합니다.' },
  { name: 'Google Workspace', desc: '구글 드라이브, 캘린더, 시트와 연동합니다.' },
  { name: 'Jira', desc: '이슈 트래킹과 스프린트 데이터를 실시간 동기화합니다.' },
  { name: 'GitHub', desc: 'PR, 이슈, 커밋 이벤트를 워크플로우에 연결합니다.' },
  { name: 'Salesforce', desc: 'CRM 데이터와 리드 관리를 자동화합니다.' },
  { name: 'HubSpot', desc: '마케팅 자동화와 고객 데이터를 통합합니다.' },
  { name: 'Zapier', desc: '5,000+ 앱과의 연동을 Zapier를 통해 지원합니다.' },
];

const cardW = 270;
const cardH = 180;
const gapX = 26;
const gapY = 26;

const cards: BuilderCanvasNode[] = integrations.flatMap((intg, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const x = 80 + col * (cardW + gapX);
  const y = GRID_Y + 70 + row * (cardH + gapY);
  const prefix = `tpl-stupintg-card-${i + 1}`;
  return [
    createContainerNode({
      id: prefix,
      rect: { x, y, width: cardW, height: cardH },
      background: '#f3f4f6',
      borderRadius: 12,
      padding: 24,
    }),
    heading(`${prefix}-t`, { x: 24, y: 24, width: 222, height: 36 }, intg.name, 3, '#123b63', 'left', prefix),
    createTextNode({
      id: `${prefix}-d`,
      parentId: prefix,
      rect: { x: 24, y: 70, width: 222, height: 80 },
      text: intg.desc,
      fontSize: 14,
      color: '#1f2937',
      lineHeight: 1.5,
    }),
  ];
});

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  createContainerNode({
    id: 'tpl-stupintg-hero',
    rect: { x: 0, y: 0, width: W, height: HERO_H },
    background: '#123b63',
    borderRadius: 0,
  }),
  heading('tpl-stupintg-hero-title', { x: 80, y: 80, width: 600, height: 60 }, '연동 파트너', 1, '#ffffff', 'left', 'tpl-stupintg-hero'),
  createTextNode({
    id: 'tpl-stupintg-hero-sub',
    parentId: 'tpl-stupintg-hero',
    rect: { x: 80, y: 160, width: 500, height: 50 },
    text: '이미 사용 중인 도구와 원활하게 연동됩니다.',
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.5,
  }),
  heading('tpl-stupintg-grid-title', { x: 80, y: GRID_Y, width: 400, height: 50 }, '지원 서비스', 2, '#123b63', 'left'),
  ...cards,
]);

export const startupIntegrationsTemplate: PageTemplate = {
  id: 'startup-integrations',
  name: '스타트업 연동',
  category: 'startup',
  subcategory: 'integrations',
  description: '연동 파트너 그리드 + 8개 연동 카드',
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
