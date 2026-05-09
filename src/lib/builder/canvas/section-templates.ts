import type { BuilderCanvasNode } from './types';
import { CARD_VARIANT_KEYS, type CardVariantKey } from '@/lib/builder/site/component-variants';

export type HomeSectionTemplateId = 'services' | 'insights' | 'faq' | 'offices';
export type HomeSectionTemplateVariant = CardVariantKey;

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
  {
    key: 'split',
    label: 'Split',
    description: '좌우 영역을 나누어 콘텐츠를 더 빠르게 스캔하게 합니다.',
  },
  {
    key: 'editorial',
    label: 'Editorial',
    description: '매거진형 타이포그래피와 얇은 구분선 중심의 디자인입니다.',
  },
  {
    key: 'compact',
    label: 'Compact',
    description: '정보량이 많은 섹션을 더 촘촘한 행으로 정리합니다.',
  },
  {
    key: 'spotlight',
    label: 'Spotlight',
    description: '첫 카드나 핵심 항목을 더 강하게 띄웁니다.',
  },
  {
    key: 'outline',
    label: 'Outline',
    description: '얇은 프레임과 낮은 장식으로 차분하게 보여줍니다.',
  },
  {
    key: 'timeline',
    label: 'Timeline',
    description: '단계형 흐름처럼 읽히도록 카드 리듬을 만듭니다.',
  },
  {
    key: 'soft',
    label: 'Soft blocks',
    description: '연한 블록 배경으로 섹션을 부드럽게 묶습니다.',
  },
  {
    key: 'contrast',
    label: 'Contrast',
    description: '강한 대비 표면으로 중요한 섹션처럼 보이게 합니다.',
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
    {
      key: 'split',
      label: 'Bento service grid',
      description: '업무분야를 bento형 묶음처럼 보여주는 템플릿입니다.',
    },
    {
      key: 'editorial',
      label: 'Editorial service index',
      description: '번호와 제목 중심으로 로펌 브로슈어처럼 읽히게 합니다.',
    },
    {
      key: 'compact',
      label: 'Dense practice rows',
      description: '긴 업무 목록을 좁은 간격의 디렉터리형 행으로 압축합니다.',
    },
    {
      key: 'spotlight',
      label: 'Spotlight first service',
      description: '첫 업무분야를 대표 카드처럼 강조하고 나머지는 보조 행으로 둡니다.',
    },
    {
      key: 'outline',
      label: 'Outlined directory',
      description: '얇은 라인 기반의 정돈된 업무 디렉터리입니다.',
    },
    {
      key: 'timeline',
      label: 'Practice timeline',
      description: '업무분야가 상담 순서처럼 차례대로 이어져 보입니다.',
    },
    {
      key: 'soft',
      label: 'Soft legal blocks',
      description: '연한 블록 표면으로 업무별 부담감을 낮춥니다.',
    },
    {
      key: 'contrast',
      label: 'Contrast practice bars',
      description: '짙은 행과 밝은 텍스트로 업무분야를 강하게 분리합니다.',
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
    {
      key: 'split',
      label: 'Newsletter split',
      description: '대표 글과 목록을 뉴스레터형 좌우 구조로 묶습니다.',
    },
    {
      key: 'editorial',
      label: 'Journal index',
      description: '칼럼을 저널 목차처럼 얇은 라인과 제목 중심으로 보여줍니다.',
    },
    {
      key: 'compact',
      label: 'Compact column list',
      description: '최신 칼럼을 조밀한 목록으로 빠르게 훑게 합니다.',
    },
    {
      key: 'spotlight',
      label: 'Lead story',
      description: '대표 칼럼을 크게 두고 보조 글을 낮은 위계로 둡니다.',
    },
    {
      key: 'outline',
      label: 'Outlined articles',
      description: '칼럼 카드의 장식을 줄이고 테두리로만 구분합니다.',
    },
    {
      key: 'timeline',
      label: 'Chronicle feed',
      description: '글 목록이 시간순 타임라인처럼 읽힙니다.',
    },
    {
      key: 'soft',
      label: 'Soft reading blocks',
      description: '연한 배경 블록으로 칼럼 영역을 차분하게 묶습니다.',
    },
    {
      key: 'contrast',
      label: 'Contrast digest',
      description: '짙은 대표 영역으로 칼럼 아카이브를 강하게 강조합니다.',
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
    {
      key: 'split',
      label: 'Category split FAQ',
      description: '질문 목록과 답변 영역이 분리된 느낌으로 읽힙니다.',
    },
    {
      key: 'editorial',
      label: 'Editorial Q&A',
      description: '질문을 기사형 문답 목록처럼 정돈합니다.',
    },
    {
      key: 'compact',
      label: 'Compact FAQ rows',
      description: '많은 질문을 촘촘한 행으로 보여줍니다.',
    },
    {
      key: 'spotlight',
      label: 'Highlighted first answer',
      description: '첫 질문을 더 크게 보여주고 나머지는 보조 목록으로 둡니다.',
    },
    {
      key: 'outline',
      label: 'Outline Q&A',
      description: '라인 중심의 절제된 FAQ 템플릿입니다.',
    },
    {
      key: 'timeline',
      label: 'Step FAQ',
      description: '상담 흐름처럼 질문이 단계적으로 이어져 보입니다.',
    },
    {
      key: 'soft',
      label: 'Soft FAQ blocks',
      description: '연한 카드로 질문과 답변을 부드럽게 구분합니다.',
    },
    {
      key: 'contrast',
      label: 'Contrast Q&A',
      description: '짙은 질문 행으로 FAQ를 강하게 구분합니다.',
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
    {
      key: 'split',
      label: 'Split map directory',
      description: '주소 카드와 지도를 명확한 두 영역으로 나눕니다.',
    },
    {
      key: 'editorial',
      label: 'Editorial office guide',
      description: '오피스 정보를 안내문처럼 차분하게 보여줍니다.',
    },
    {
      key: 'compact',
      label: 'Compact office list',
      description: '주소, 전화, 팩스를 조밀한 정보표처럼 정리합니다.',
    },
    {
      key: 'spotlight',
      label: 'Primary office spotlight',
      description: '선택된 사무소 카드가 지도보다 먼저 읽히게 합니다.',
    },
    {
      key: 'outline',
      label: 'Outlined map cards',
      description: '지도와 주소 카드를 얇은 프레임으로만 구분합니다.',
    },
    {
      key: 'timeline',
      label: 'Visit steps',
      description: '방문 순서 안내처럼 사무소 정보를 단계형으로 보여줍니다.',
    },
    {
      key: 'soft',
      label: 'Soft location blocks',
      description: '연한 배경 카드로 주소 정보를 안정적으로 묶습니다.',
    },
    {
      key: 'contrast',
      label: 'Contrast map panel',
      description: '짙은 주소 패널과 밝은 지도 영역의 대비를 만듭니다.',
    },
  ],
};

export function getHomeSectionTemplateVariantOptions(
  targetId: HomeSectionTemplateId | null | undefined,
): HomeSectionTemplateVariantOption[] {
  return targetId ? HOME_SECTION_TEMPLATE_VARIANTS_BY_TARGET[targetId] : HOME_SECTION_TEMPLATE_VARIANTS;
}

const TARGET_BY_NODE_ID = new Map(HOME_SECTION_TEMPLATE_TARGETS.map((target) => [target.nodeId, target]));
const SECTION_TEMPLATE_VARIANT_KEYS = new Set<string>(CARD_VARIANT_KEYS);

export function getHomeSectionTemplateTarget(nodeId: string): HomeSectionTemplateTarget | null {
  return TARGET_BY_NODE_ID.get(nodeId) ?? null;
}

export function getHomeSectionTemplateVariant(node: BuilderCanvasNode): HomeSectionTemplateVariant {
  const value = node.content && 'variant' in node.content ? node.content.variant : null;
  return typeof value === 'string' && SECTION_TEMPLATE_VARIANT_KEYS.has(value)
    ? (value as HomeSectionTemplateVariant)
    : 'flat';
}

export function getHomeSectionTemplateMetadata(node: BuilderCanvasNode): HomeSectionTemplateMetadata | null {
  const target = getHomeSectionTemplateTarget(node.id);
  if (!target) return null;
  return {
    id: target.id,
    variant: getHomeSectionTemplateVariant(node),
  };
}
