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
const CARD_H = 400;
const GAP = 24;
const COLS = 3;

interface Project {
  key: string;
  title: string;
  client: string;
  category: string;
  desc: string;
}

const projects: Project[] = [
  { key: 'branding-a', title: '테크 스타트업 브랜딩', client: 'ABC 테크', category: '브랜딩', desc: 'AI 스타트업의 CI/BI 디자인과 브랜드 가이드라인을 제작했습니다.' },
  { key: 'web-b', title: '이커머스 리뉴얼', client: '패션몰', category: '웹 디자인', desc: '기존 쇼핑몰의 UX/UI를 전면 개편하여 전환율을 40% 향상시켰습니다.' },
  { key: 'video-c', title: '기업 홍보 영상', client: '대기업 D', category: '영상', desc: '기업 소개 영상과 TV 광고를 제작하여 브랜드 인지도를 높였습니다.' },
  { key: 'social-d', title: 'SNS 캠페인', client: '뷰티 브랜드 E', category: 'SNS', desc: '인스타그램, 틱톡 캠페인으로 팔로워 300% 성장을 달성했습니다.' },
  { key: 'print-e', title: '연간 보고서 디자인', client: '금융사 F', category: '인쇄물', desc: '시각적으로 뛰어난 연간 보고서를 디자인하여 수상했습니다.' },
  { key: 'app-f', title: '모바일 앱 UI', client: '헬스 앱 G', category: 'UX/UI', desc: '사용자 중심의 앱 인터페이스를 설계하여 사용성을 크게 개선했습니다.' },
];

function buildProjectCard(proj: Project, idx: number): BuilderCanvasNode[] {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  const x = MARGIN + col * (CARD_W + GAP);
  const y = HEADER_H + 40 + row * (CARD_H + GAP);
  const cid = `tpl-creativeport-card-${proj.key}`;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y, width: CARD_W, height: CARD_H },
      background: '#ffffff',
      borderRadius: 12,
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 0,
    }),
    createImageNode({
      id: `${cid}-img`,
      parentId: cid,
      rect: { x: 0, y: 0, width: CARD_W, height: 200 },
      src: `/images/placeholder-project-${proj.key}.jpg`,
      alt: `${proj.title} 프로젝트 이미지`,
      style: { borderRadius: 0 },
    }),
    createTextNode({
      id: `${cid}-category`,
      parentId: cid,
      rect: { x: 20, y: 212, width: 120, height: 22 },
      text: proj.category,
      fontSize: 13,
      color: '#e8a838',
      fontWeight: 'bold',
    }),
    heading(`${cid}-title`, { x: 20, y: 238, width: 310, height: 36 }, proj.title, 3, '#123b63', 'left', cid),
    createTextNode({
      id: `${cid}-desc`,
      parentId: cid,
      rect: { x: 20, y: 280, width: 310, height: 60 },
      text: proj.desc,
      fontSize: 14,
      color: '#374151',
      lineHeight: 1.5,
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 20, y: 352, width: 130, height: 36 },
      label: '케이스 스터디',
      href: '#',
      variant: 'link',
      style: { borderRadius: 4 },
    }),
  ];
}

const ROWS = Math.ceil(projects.length / COLS);
const STAGE_H = HEADER_H + 40 + ROWS * (CARD_H + GAP) + 60;

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading('tpl-creativeport-title', { x: MARGIN, y: 50, width: 500, height: 56 }, '포트폴리오', 1, '#123b63'),
  createTextNode({
    id: 'tpl-creativeport-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '다양한 분야의 프로젝트 결과물을 확인하세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),
  ...projects.flatMap((p, i) => buildProjectCard(p, i)),
]);

export const creativePortfolioTemplate: PageTemplate = {
  id: 'creative-portfolio',
  name: '포트폴리오',
  category: 'creative',
  subcategory: 'portfolio',
  description: '프로젝트 쇼케이스 그리드(6개) + 케이스 스터디',
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
