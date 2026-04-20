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
const DESC_Y = HEADER_H + 40;
const DESC_H = 120;
const PACKAGES_Y = DESC_Y + DESC_H + 80;
const PACKAGE_W = 350;
const PACKAGE_H = 400;
const GAP = 24;
const CTA_Y = PACKAGES_Y + PACKAGE_H + 80;
const CTA_H = 200;
const STAGE_H = CTA_Y + CTA_H + 80;

interface CateringPackage {
  key: string;
  title: string;
  price: string;
  features: string;
}

const packages: CateringPackage[] = [
  {
    key: 'basic',
    title: '베이직 패키지',
    price: '인당 35,000원~',
    features: '에피타이저 2종 + 메인 1종 + 음료\n최소 20인 이상\n기본 테이블 세팅 포함\n서비스 스태프 1명',
  },
  {
    key: 'premium',
    title: '프리미엄 패키지',
    price: '인당 65,000원~',
    features: '에피타이저 3종 + 메인 2종 + 디저트 + 음료\n최소 15인 이상\n풀 테이블 세팅 포함\n서비스 스태프 2명\n꽃 장식 포함',
  },
  {
    key: 'luxury',
    title: '럭셔리 패키지',
    price: '인당 120,000원~',
    features: '풀코스 7종 + 프리미엄 와인 페어링\n최소 10인 이상\n프리미엄 테이블 세팅\n전담 서비스팀\n꽃 장식 + 포토존',
  },
];

function buildPackageCard(pkg: CateringPackage, idx: number): BuilderCanvasNode[] {
  const x = MARGIN + idx * (PACKAGE_W + GAP);
  const cid = `tpl-restcatering-pkg-${pkg.key}`;
  const isFeatured = idx === 1;

  return [
    createContainerNode({
      id: cid,
      rect: { x, y: PACKAGES_Y, width: PACKAGE_W, height: PACKAGE_H },
      background: isFeatured ? '#123b63' : '#ffffff',
      borderRadius: 12,
      borderColor: isFeatured ? '#123b63' : '#e2e8f0',
      borderWidth: 1,
      padding: 32,
    }),
    heading(
      `${cid}-title`,
      { x: 32, y: 24, width: PACKAGE_W - 64, height: 40 },
      pkg.title,
      3,
      isFeatured ? '#ffffff' : '#123b63',
      'center',
      cid,
    ),
    createTextNode({
      id: `${cid}-price`,
      parentId: cid,
      rect: { x: 32, y: 80, width: PACKAGE_W - 64, height: 36 },
      text: pkg.price,
      fontSize: 24,
      color: '#e8a838',
      fontWeight: 'bold',
      align: 'center',
    }),
    createTextNode({
      id: `${cid}-features`,
      parentId: cid,
      rect: { x: 32, y: 136, width: PACKAGE_W - 64, height: 180 },
      text: pkg.features,
      fontSize: 14,
      color: isFeatured ? 'rgba(255,255,255,0.85)' : '#374151',
      lineHeight: 1.7,
      align: 'center',
    }),
    createButtonNode({
      id: `${cid}-btn`,
      parentId: cid,
      rect: { x: 80, y: 340, width: 180, height: 40 },
      label: '견적 요청',
      href: '#',
      variant: isFeatured ? 'primary' : 'outline',
      style: { backgroundColor: isFeatured ? '#e8a838' : 'transparent', borderRadius: 6 },
    }),
  ];
}

const nodes: BuilderCanvasNode[] = assignCanvasNodeZIndices([
  heading(
    'tpl-restcatering-title',
    { x: MARGIN, y: 50, width: 500, height: 56 },
    '케이터링 서비스',
    1,
    '#123b63',
  ),
  createTextNode({
    id: 'tpl-restcatering-subtitle',
    rect: { x: MARGIN, y: 110, width: 700, height: 32 },
    text: '특별한 장소에서 우리의 요리를 즐기세요.',
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 1.4,
  }),

  /* ── Description ─────────────────────────────────────────── */
  createTextNode({
    id: 'tpl-restcatering-desc',
    rect: { x: MARGIN, y: DESC_Y, width: 800, height: DESC_H },
    text: '회사 행사, 야외 파티, 결혼식 등 어디서든 셰프의 요리를 경험하실 수 있습니다. 메뉴 구성부터 테이블 세팅, 서빙까지 원스톱 케이터링 서비스를 제공합니다.',
    fontSize: 16,
    color: '#374151',
    lineHeight: 1.7,
  }),

  /* ── Package cards ───────────────────────────────────────── */
  ...packages.flatMap((pkg, i) => buildPackageCard(pkg, i)),

  /* ── Order CTA ───────────────────────────────────────────── */
  createContainerNode({
    id: 'tpl-restcatering-cta',
    rect: { x: 0, y: CTA_Y, width: W, height: CTA_H },
    background: '#f3f4f6',
    borderRadius: 0,
  }),
  createTextNode({
    id: 'tpl-restcatering-cta-text',
    parentId: 'tpl-restcatering-cta',
    rect: { x: MARGIN, y: 50, width: 600, height: 44 },
    text: '맞춤 케이터링 견적을 요청하세요. 전문 상담사가 안내해 드립니다.',
    fontSize: 18,
    color: '#123b63',
    fontWeight: 'medium',
    lineHeight: 1.4,
  }),
  createButtonNode({
    id: 'tpl-restcatering-cta-btn',
    parentId: 'tpl-restcatering-cta',
    rect: { x: MARGIN, y: 120, width: 180, height: 48 },
    label: '견적 요청하기',
    href: '#',
    variant: 'primary',
    style: { backgroundColor: '#e8a838', borderRadius: 6 },
  }),
]);

export const restaurantCateringTemplate: PageTemplate = {
  id: 'restaurant-catering',
  name: '레스토랑 케이터링',
  category: 'restaurant',
  subcategory: 'catering',
  description: '케이터링 서비스 소개 + 3단계 패키지 카드 + 주문 CTA',
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
