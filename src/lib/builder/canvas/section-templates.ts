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

export type HomeSectionTemplateMetadata = {
  id: HomeSectionTemplateId;
  variant: HomeSectionTemplateVariant;
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

const HOME_SECTION_TEMPLATE_VARIANTS_BY_TARGET: Record<HomeSectionTemplateId, HomeSectionTemplateVariantOption[]> = {
  services: [
    {
      key: 'flat',
      label: 'Classic accordion',
      description: '원본 공개 사이트처럼 한 업무분야씩 펼쳐지는 기본형입니다.',
    },
    {
      key: 'elevated',
      label: 'Card accordion',
      description: '각 업무분야를 카드형 아코디언으로 강조합니다.',
    },
    {
      key: 'floating',
      label: 'Split service deck',
      description: '열린 업무 카드가 분리된 덱처럼 보이는 구조입니다.',
    },
    {
      key: 'glass',
      label: 'Icon glass rows',
      description: '아이콘과 상세 영역을 반투명 행으로 정리합니다.',
    },
  ],
  insights: [
    {
      key: 'flat',
      label: 'Featured list',
      description: '대표 칼럼 1개와 최신 글 목록을 나란히 보여줍니다.',
    },
    {
      key: 'elevated',
      label: 'Editorial cards',
      description: '칼럼 목록을 카드형 편집 섹션처럼 보이게 합니다.',
    },
    {
      key: 'floating',
      label: 'Magazine split',
      description: '대표 글과 목록의 좌우 구도를 바꾼 매거진형입니다.',
    },
    {
      key: 'glass',
      label: 'Floating feed',
      description: '목록을 떠 있는 피드처럼 겹쳐 배치합니다.',
    },
  ],
  faq: [
    {
      key: 'flat',
      label: 'Simple accordion',
      description: '원본처럼 질문을 누르면 답변이 아래로 열립니다.',
    },
    {
      key: 'elevated',
      label: 'Boxed answers',
      description: '질문 답변을 박스형 카드로 분리합니다.',
    },
    {
      key: 'floating',
      label: 'Split rows',
      description: 'FAQ 행에 리듬감을 주어 반복 목록을 덜 단조롭게 만듭니다.',
    },
    {
      key: 'glass',
      label: 'Frosted FAQ',
      description: '답변 카드에 반투명 표면을 적용합니다.',
    },
  ],
  offices: [
    {
      key: 'flat',
      label: 'Tabs + map',
      description: '원본처럼 사무소 탭, 지도, 주소 카드를 연결합니다.',
    },
    {
      key: 'elevated',
      label: 'Address cards',
      description: '주소 카드와 지도 표면에 깊이를 더합니다.',
    },
    {
      key: 'floating',
      label: 'Address first',
      description: '주소 카드를 먼저 읽히게 하고 지도를 우측에 둡니다.',
    },
    {
      key: 'glass',
      label: 'Map overlay',
      description: '넓은 지도 위에 사무소 카드를 겹쳐 보여줍니다.',
    },
  ],
};

export function getHomeSectionTemplateVariantOptions(
  targetId: HomeSectionTemplateId | null | undefined,
): HomeSectionTemplateVariantOption[] {
  return targetId ? HOME_SECTION_TEMPLATE_VARIANTS_BY_TARGET[targetId] : HOME_SECTION_TEMPLATE_VARIANTS;
}

const TARGET_BY_NODE_ID = new Map(HOME_SECTION_TEMPLATE_TARGETS.map((target) => [target.nodeId, target]));

export function getHomeSectionTemplateTarget(nodeId: string): HomeSectionTemplateTarget | null {
  return TARGET_BY_NODE_ID.get(nodeId) ?? null;
}

export function getHomeSectionTemplateVariant(node: BuilderCanvasNode): HomeSectionTemplateVariant {
  const value = node.content && 'variant' in node.content ? node.content.variant : null;
  return value === 'elevated' || value === 'floating' || value === 'glass' ? value : 'flat';
}

export function getHomeSectionTemplateMetadata(node: BuilderCanvasNode): HomeSectionTemplateMetadata | null {
  const target = getHomeSectionTemplateTarget(node.id);
  if (!target) return null;
  return {
    id: target.id,
    variant: getHomeSectionTemplateVariant(node),
  };
}
