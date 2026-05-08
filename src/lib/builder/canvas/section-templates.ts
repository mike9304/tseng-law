import type { BuilderCanvasNode } from './types';

export type HomeSectionTemplateId = 'services' | 'insights' | 'faq' | 'offices';
export type HomeSectionTemplateVariant = 'flat' | 'elevated' | 'floating' | 'glass';

export type HomeSectionTemplateTarget = {
  id: HomeSectionTemplateId;
  nodeId: string;
  label: string;
  description: string;
};

export type HomeSectionTemplateVariantOption = {
  key: HomeSectionTemplateVariant;
  label: string;
  description: string;
};

export const HOME_SECTION_TEMPLATE_TARGETS: HomeSectionTemplateTarget[] = [
  {
    id: 'services',
    nodeId: 'home-services-root',
    label: '주요 서비스',
    description: '아코디언으로 열리는 업무분야 섹션입니다.',
  },
  {
    id: 'insights',
    nodeId: 'home-insights-root',
    label: '칼럼 아카이브',
    description: '칼럼 글 목록과 featured article을 보여주는 섹션입니다.',
  },
  {
    id: 'faq',
    nodeId: 'home-faq-root',
    label: 'FAQ',
    description: '질문을 누르면 답변이 펼쳐지는 섹션입니다.',
  },
  {
    id: 'offices',
    nodeId: 'home-offices-root',
    label: '오시는길',
    description: '사무소 탭, 지도, 주소 카드가 연결된 섹션입니다.',
  },
];

export const HOME_SECTION_TEMPLATE_VARIANTS: HomeSectionTemplateVariantOption[] = [
  {
    key: 'flat',
    label: 'Classic',
    description: '현재 공개 사이트에 가장 가까운 기본형입니다.',
  },
  {
    key: 'elevated',
    label: 'Elevated',
    description: '카드와 아코디언 표면에 얕은 그림자를 더합니다.',
  },
  {
    key: 'floating',
    label: 'Floating',
    description: '둥근 카드와 강조 그림자로 섹션을 더 독립적으로 보이게 합니다.',
  },
  {
    key: 'glass',
    label: 'Glass',
    description: '반투명 표면과 blur로 가볍게 떠 있는 느낌을 줍니다.',
  },
];

const TARGET_BY_NODE_ID = new Map(HOME_SECTION_TEMPLATE_TARGETS.map((target) => [target.nodeId, target]));

export function getHomeSectionTemplateTarget(nodeId: string): HomeSectionTemplateTarget | null {
  return TARGET_BY_NODE_ID.get(nodeId) ?? null;
}

export function getHomeSectionTemplateVariant(node: BuilderCanvasNode): HomeSectionTemplateVariant {
  const value = node.content && 'variant' in node.content ? node.content.variant : null;
  return value === 'elevated' || value === 'floating' || value === 'glass' ? value : 'flat';
}

