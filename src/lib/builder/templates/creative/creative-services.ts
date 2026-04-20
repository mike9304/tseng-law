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
const MARGIN = 80;

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

const HEADER_H = 140;
const CARD_W = 350;
const CARD_H = 300;
const GAP = 24;
const COLS = 3;

interface Service {
  key: string;
  title: string;
  desc: string;
}

const services: Service[] = [
  { key: 'branding', title: '브랜딩', desc: '로고, CI/BI, 브랜드 전략, 네이밍 등 브랜드 아이덴티티 전반을 구축합니다.' },
  { key: 'web', title: '웹 디자인 & 개발', desc: '반응형 웹사이트, 랜딩 페이지, 웹 애플리케이션을 기획부터 개발까지 진행합니다.' },
  { key: 'print', title: '인쇄물 디자인', desc: '브로셔, 카탈로그, 명함, 패키지 등 인쇄 매체 디자인을 제작합니다.' },
  { key: 'video', title: '영상 제작', desc: '기업 홍보 영상, 광고, 모션 그래픽, SNS 콘텐츠 영상을 제작합니다.' },
  { key: 'social', title: 'SNS 마케팅', desc: 'SNS 채널 전략, 콘텐츠 제작, 광고 집행, 커뮤니티 관리를 대행합니다.' },
  { key: 'strategy', title: '크리에이티브 전략', desc: '시장 분석, 타겟 설정, 캠페인 기획 등 마케팅 전략을 수립합니다.' },
];

function buildServiceCard(svc: Service, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-creativesvc-card-${svc.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 24,
    }),
    createImageNode({
      id: `${cid}-icon`,
      parentId: cid,
      rect: { x: 24, y: 24, width: 48, height: 48 },
      src: `/images/placeholder-svc-${svc.key}.jpg`,
      alt: `${svc.title} 아이콘`,
      style: { borderRadius: 8 },
    }),
    heading(`${cid}-title`, { x: 24, y: 88, width: 300, height: 36 }, svc.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 24, y: 136, width: 300, height: 80 },
      text: svc.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.6,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 24, y: 248, width: 130, height: 36 },
      label: '자세히 보기',
      href: '#',
      variant: 'outline',
      style: { borderRadius: 6 },
    }),
  ];
}

const ROWS = Math.ceil(services.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativesvc-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '서비스', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativesvc-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '비즈니스 성장을 위한 종합 크리에이티브 솔루션을 제공합니다.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...services.flatMap((s, i) => buildServiceCard(s, i)),
]);

export const creativeServicesTemplate: PageTemplate = {
  id: 'creative-services',
  name: '서비스',
  category: 'creative',
  subcategory: 'services',
  description: '서비스 카드(6개): 브랜딩, 웹, 인쇄, 영상, SNS, 전략',
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
