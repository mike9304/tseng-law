import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasNode,
  type BuilderCanvasNodeStyle,
} from '@/lib/builder/canvas/types';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';

export const BUILT_IN_SECTION_CATEGORIES = [
  'hero',
  'features',
  'testimonials',
  'cta',
  'footer',
  'legal',
] as const;

export type BuiltInSectionCategory = (typeof BUILT_IN_SECTION_CATEGORIES)[number];

export interface BuiltInSectionTemplate {
  id: string;
  name: string;
  category: BuiltInSectionCategory;
  description?: string;
  thumbnailHint?: string;
  nodes: BuilderCanvasNode[];
  rootNodeId: string;
}

type CanvasRect = BuilderCanvasNode['rect'];
type ContainerContent = Extract<BuilderCanvasNode, { kind: 'container' }>['content'];

interface TemplateDraft {
  id: string;
  name: string;
  category: BuiltInSectionCategory;
  description: string;
  thumbnailHint?: string;
  width: number;
  height: number;
  rootStyle?: Partial<BuilderCanvasNodeStyle>;
  rootContent?: Partial<ContainerContent>;
  children: (rootNodeId: string) => BuilderCanvasNode[];
}

function createBaseNode(
  id: string,
  parentId: string | undefined,
  rect: CanvasRect,
  zIndex: number,
  style: Partial<BuilderCanvasNodeStyle> = {},
) {
  return {
    id,
    parentId,
    rect,
    style: createDefaultCanvasNodeStyle(style),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
  };
}

function containerNode({
  id,
  parentId,
  rect,
  zIndex,
  label,
  style,
  content,
}: {
  id: string;
  parentId?: string;
  rect: CanvasRect;
  zIndex: number;
  label: string;
  style?: Partial<BuilderCanvasNodeStyle>;
  content?: Partial<ContainerContent>;
}): BuilderCanvasNode {
  const background = typeof style?.backgroundColor === 'string'
    ? style.backgroundColor
    : '#ffffff';
  const borderColor = typeof style?.borderColor === 'string'
    ? style.borderColor
    : '#e2e8f0';

  return {
    ...createBaseNode(id, parentId, rect, zIndex, style),
    kind: 'container',
    content: {
      label,
      background,
      borderColor,
      borderStyle: style?.borderStyle ?? 'solid',
      borderWidth: style?.borderWidth ?? 0,
      borderRadius: Math.min(style?.borderRadius ?? 10, 48),
      padding: 0,
      layoutMode: 'absolute',
      variant: 'flat',
      ...content,
    },
  } as BuilderCanvasNode;
}

function headingNode({
  id,
  parentId,
  rect,
  zIndex,
  text,
  level = 2,
  color = '#0f172a',
  align = 'left',
  fontSize = 42,
  fontWeight = 'bold',
  lineHeight = 1.1,
}: {
  id: string;
  parentId: string;
  rect: CanvasRect;
  zIndex: number;
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  color?: string;
  align?: 'left' | 'center' | 'right';
  fontSize?: number;
  fontWeight?: 'regular' | 'medium' | 'bold';
  lineHeight?: number;
}): BuilderCanvasNode {
  return {
    ...createBaseNode(id, parentId, rect, zIndex),
    kind: 'heading',
    content: {
      text,
      richText: richTextFromPlainText(text),
      level,
      color,
      align,
      fontFamily: 'system-ui',
      fontSize,
      fontWeight,
      lineHeight,
      letterSpacing: 0,
    },
  } as BuilderCanvasNode;
}

function textNode({
  id,
  parentId,
  rect,
  zIndex,
  text,
  fontSize = 16,
  color = '#475569',
  fontWeight = 'regular',
  align = 'left',
  lineHeight = 1.45,
  as = 'p',
  style,
}: {
  id: string;
  parentId: string;
  rect: CanvasRect;
  zIndex: number;
  text: string;
  fontSize?: number;
  color?: string;
  fontWeight?: 'regular' | 'medium' | 'bold';
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  as?: 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'time';
  style?: Partial<BuilderCanvasNodeStyle>;
}): BuilderCanvasNode {
  return {
    ...createBaseNode(id, parentId, rect, zIndex, style),
    kind: 'text',
    content: {
      text,
      richText: richTextFromPlainText(text),
      fontSize,
      color,
      fontWeight,
      align,
      lineHeight,
      letterSpacing: 0,
      fontFamily: 'system-ui',
      verticalAlign: 'top',
      textTransform: 'none',
      as,
    },
  } as BuilderCanvasNode;
}

function buttonNode({
  id,
  parentId,
  rect,
  zIndex,
  label,
  href = '#contact',
  buttonStyle = 'primary-solid',
  style,
}: {
  id: string;
  parentId: string;
  rect: CanvasRect;
  zIndex: number;
  label: string;
  href?: string;
  buttonStyle?: Extract<BuilderCanvasNode, { kind: 'button' }>['content']['style'];
  style?: Partial<BuilderCanvasNodeStyle>;
}): BuilderCanvasNode {
  return {
    ...createBaseNode(id, parentId, rect, zIndex, {
      borderRadius: 999,
      shadowY: 10,
      shadowBlur: 22,
      shadowColor: 'rgba(15, 23, 42, 0.14)',
      ...style,
    }),
    kind: 'button',
    content: {
      label,
      href,
      style: buttonStyle,
    },
  } as BuilderCanvasNode;
}

function imageNode({
  id,
  parentId,
  rect,
  zIndex,
  src,
  alt,
  style,
}: {
  id: string;
  parentId: string;
  rect: CanvasRect;
  zIndex: number;
  src: string;
  alt: string;
  style?: Partial<BuilderCanvasNodeStyle>;
}): BuilderCanvasNode {
  return {
    ...createBaseNode(id, parentId, rect, zIndex, {
      borderRadius: 18,
      ...style,
    }),
    kind: 'image',
    content: {
      src,
      alt,
      fit: 'cover',
    },
  } as BuilderCanvasNode;
}

function defineTemplate(draft: TemplateDraft): BuiltInSectionTemplate {
  const rootNodeId = `${draft.id}-root`;
  const root = containerNode({
    id: rootNodeId,
    rect: { x: 0, y: 0, width: draft.width, height: draft.height },
    zIndex: 0,
    label: draft.name,
    style: {
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      borderRadius: 24,
      shadowY: 16,
      shadowBlur: 36,
      shadowColor: 'rgba(15, 23, 42, 0.08)',
      ...draft.rootStyle,
    },
    content: {
      as: draft.category === 'footer' ? 'footer' : 'section',
      ...draft.rootContent,
    },
  });
  const nodes = normalizeSavedSectionSnapshot([root, ...draft.children(rootNodeId)], rootNodeId);

  return {
    id: draft.id,
    name: draft.name,
    category: draft.category,
    description: draft.description,
    thumbnailHint: draft.thumbnailHint,
    nodes,
    rootNodeId,
  };
}

function featureCard(
  id: string,
  parentId: string,
  x: number,
  y: number,
  title: string,
  body: string,
  zIndex: number,
): BuilderCanvasNode[] {
  const cardId = `${id}-card`;
  return [
    containerNode({
      id: cardId,
      parentId,
      rect: { x, y, width: 315, height: 150 },
      zIndex,
      label: title,
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#dbe4ee',
        borderWidth: 1,
        borderRadius: 18,
        shadowY: 10,
        shadowBlur: 24,
        shadowColor: 'rgba(15, 23, 42, 0.07)',
      },
    }),
    textNode({
      id: `${id}-index`,
      parentId: cardId,
      rect: { x: 22, y: 18, width: 48, height: 28 },
      zIndex: zIndex + 1,
      text: id.slice(-2).toUpperCase(),
      fontSize: 13,
      color: '#0f766e',
      fontWeight: 'bold',
    }),
    headingNode({
      id: `${id}-title`,
      parentId: cardId,
      rect: { x: 22, y: 48, width: 255, height: 38 },
      zIndex: zIndex + 2,
      text: title,
      level: 3,
      fontSize: 22,
      lineHeight: 1.15,
    }),
    textNode({
      id: `${id}-body`,
      parentId: cardId,
      rect: { x: 22, y: 90, width: 260, height: 44 },
      zIndex: zIndex + 3,
      text: body,
      fontSize: 14,
      color: '#64748b',
    }),
  ];
}

function quoteCard(
  id: string,
  parentId: string,
  x: number,
  y: number,
  quote: string,
  name: string,
  zIndex: number,
): BuilderCanvasNode[] {
  const cardId = `${id}-card`;
  return [
    containerNode({
      id: cardId,
      parentId,
      rect: { x, y, width: 315, height: 170 },
      zIndex,
      label: name,
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 18,
        shadowY: 10,
        shadowBlur: 24,
        shadowColor: 'rgba(15, 23, 42, 0.08)',
      },
    }),
    textNode({
      id: `${id}-quote`,
      parentId: cardId,
      rect: { x: 24, y: 24, width: 260, height: 82 },
      zIndex: zIndex + 1,
      text: quote,
      fontSize: 16,
      color: '#334155',
      fontWeight: 'medium',
      lineHeight: 1.42,
    }),
    textNode({
      id: `${id}-name`,
      parentId: cardId,
      rect: { x: 24, y: 122, width: 250, height: 28 },
      zIndex: zIndex + 2,
      text: name,
      fontSize: 14,
      color: '#0f172a',
      fontWeight: 'bold',
    }),
  ];
}

export const BUILT_IN_SECTIONS: BuiltInSectionTemplate[] = [
  defineTemplate({
    id: 'hero-centered-cta',
    name: 'Centered CTA Hero',
    category: 'hero',
    description: '중앙 정렬 헤드라인과 두 개의 주요 행동 버튼',
    thumbnailHint: 'HERO',
    width: 1120,
    height: 430,
    rootStyle: { backgroundColor: '#f8fafc' },
    children: (rootId) => [
      textNode({
        id: 'hero-centered-cta-eyebrow',
        parentId: rootId,
        rect: { x: 380, y: 58, width: 360, height: 30 },
        zIndex: 1,
        text: 'Taiwan legal desk',
        fontSize: 14,
        color: '#0f766e',
        fontWeight: 'bold',
        align: 'center',
      }),
      headingNode({
        id: 'hero-centered-cta-title',
        parentId: rootId,
        rect: { x: 210, y: 104, width: 700, height: 108 },
        zIndex: 2,
        text: '대만 법률 리스크를 빠르게 정리합니다',
        level: 1,
        fontSize: 46,
        align: 'center',
      }),
      textNode({
        id: 'hero-centered-cta-copy',
        parentId: rootId,
        rect: { x: 270, y: 226, width: 580, height: 62 },
        zIndex: 3,
        text: '계약, 회사설립, 분쟁 대응까지 한국어로 이해하기 쉬운 실행 계획을 제공합니다.',
        fontSize: 18,
        color: '#475569',
        align: 'center',
      }),
      buttonNode({
        id: 'hero-centered-cta-primary',
        parentId: rootId,
        rect: { x: 390, y: 318, width: 166, height: 52 },
        zIndex: 4,
        label: '상담 예약',
      }),
      buttonNode({
        id: 'hero-centered-cta-secondary',
        parentId: rootId,
        rect: { x: 574, y: 318, width: 156, height: 52 },
        zIndex: 5,
        label: '서비스 보기',
        href: '#services',
        buttonStyle: 'secondary-outline',
        style: { shadowY: 0, shadowBlur: 0 },
      }),
    ],
  }),
  defineTemplate({
    id: 'hero-split-image',
    name: 'Split Image Hero',
    category: 'hero',
    description: '좌측 카피와 우측 이미지가 있는 랜딩 히어로',
    thumbnailHint: 'SPLIT',
    width: 1120,
    height: 460,
    rootStyle: { backgroundColor: '#ffffff' },
    children: (rootId) => [
      textNode({
        id: 'hero-split-image-eyebrow',
        parentId: rootId,
        rect: { x: 64, y: 70, width: 320, height: 30 },
        zIndex: 1,
        text: 'Cross-border counsel',
        fontSize: 14,
        color: '#1d4ed8',
        fontWeight: 'bold',
      }),
      headingNode({
        id: 'hero-split-image-title',
        parentId: rootId,
        rect: { x: 64, y: 112, width: 480, height: 116 },
        zIndex: 2,
        text: '대만 비즈니스 의사결정에 필요한 법률 검토',
        level: 1,
        fontSize: 42,
      }),
      textNode({
        id: 'hero-split-image-copy',
        parentId: rootId,
        rect: { x: 64, y: 250, width: 450, height: 78 },
        zIndex: 3,
        text: '현지 제도와 실무 관행을 함께 검토해 계약 전 단계부터 분쟁 대응까지 우선순위를 잡습니다.',
        fontSize: 17,
      }),
      buttonNode({
        id: 'hero-split-image-primary',
        parentId: rootId,
        rect: { x: 64, y: 356, width: 178, height: 52 },
        zIndex: 4,
        label: '문의하기',
      }),
      imageNode({
        id: 'hero-split-image-visual',
        parentId: rootId,
        rect: { x: 620, y: 62, width: 420, height: 336 },
        zIndex: 5,
        src: '/images/header-skyline-ratio.webp',
        alt: 'Taipei skyline',
        style: {
          borderRadius: 28,
          shadowY: 22,
          shadowBlur: 48,
          shadowColor: 'rgba(15, 23, 42, 0.16)',
        },
      }),
    ],
  }),
  defineTemplate({
    id: 'features-3-column',
    name: 'Three Feature Columns',
    category: 'features',
    description: '세 가지 핵심 강점을 카드로 정리',
    thumbnailHint: '3COL',
    width: 1120,
    height: 390,
    rootStyle: { backgroundColor: '#f8fafc' },
    children: (rootId) => [
      headingNode({
        id: 'features-3-column-title',
        parentId: rootId,
        rect: { x: 66, y: 54, width: 520, height: 58 },
        zIndex: 1,
        text: '업무를 명확하게 나누어 진행합니다',
        fontSize: 34,
      }),
      textNode({
        id: 'features-3-column-copy',
        parentId: rootId,
        rect: { x: 66, y: 120, width: 530, height: 52 },
        zIndex: 2,
        text: '초기 진단, 문서 검토, 실행 지원을 분리해 필요한 단계만 빠르게 선택할 수 있습니다.',
        fontSize: 16,
      }),
      ...featureCard('features-3-column-01', rootId, 66, 204, '초기 진단', '사안의 쟁점과 가능한 선택지를 빠르게 분류합니다.', 3),
      ...featureCard('features-3-column-02', rootId, 403, 204, '문서 검토', '계약서와 증빙자료의 리스크 조항을 표시합니다.', 7),
      ...featureCard('features-3-column-03', rootId, 740, 204, '실행 지원', '현지 커뮤니케이션과 후속 일정까지 관리합니다.', 11),
    ],
  }),
  defineTemplate({
    id: 'features-icon-grid',
    name: 'Icon Grid Features',
    category: 'features',
    description: '네 개 항목을 촘촘하게 보여주는 기능 그리드',
    thumbnailHint: 'GRID',
    width: 1120,
    height: 540,
    rootStyle: { backgroundColor: '#ffffff' },
    children: (rootId) => [
      headingNode({
        id: 'features-icon-grid-title',
        parentId: rootId,
        rect: { x: 70, y: 52, width: 450, height: 52 },
        zIndex: 1,
        text: '자주 필요한 법률 지원',
        fontSize: 34,
      }),
      textNode({
        id: 'features-icon-grid-copy',
        parentId: rootId,
        rect: { x: 70, y: 112, width: 520, height: 48 },
        zIndex: 2,
        text: '회사 운영, 거래, 인사, 분쟁 대응을 한 화면에서 설명할 수 있는 구성입니다.',
        fontSize: 16,
      }),
      ...featureCard('features-icon-grid-01', rootId, 70, 190, '회사설립', '법인, 지점, 대표처 선택과 등록 절차를 정리합니다.', 3),
      ...featureCard('features-icon-grid-02', rootId, 405, 190, '계약 검토', '거래구조와 책임 범위를 조항별로 확인합니다.', 7),
      ...featureCard('features-icon-grid-03', rootId, 70, 350, '노무 자문', '고용계약, 해고, 퇴직금 쟁점을 검토합니다.', 11),
      ...featureCard('features-icon-grid-04', rootId, 405, 350, '분쟁 대응', '협상, 내용증명, 소송 준비 단계를 설계합니다.', 15),
    ],
  }),
  defineTemplate({
    id: 'testimonials-cards',
    name: 'Testimonial Cards',
    category: 'testimonials',
    description: '고객 후기를 세 장의 카드로 표시',
    thumbnailHint: 'QUOTE',
    width: 1120,
    height: 400,
    rootStyle: { backgroundColor: '#f8fafc' },
    children: (rootId) => [
      headingNode({
        id: 'testimonials-cards-title',
        parentId: rootId,
        rect: { x: 70, y: 52, width: 560, height: 58 },
        zIndex: 1,
        text: '의사결정이 빨라졌다는 평가',
        fontSize: 34,
      }),
      textNode({
        id: 'testimonials-cards-copy',
        parentId: rootId,
        rect: { x: 70, y: 118, width: 560, height: 48 },
        zIndex: 2,
        text: '복잡한 현지 법률 이슈를 실행 가능한 언어로 정리했다는 후기를 강조합니다.',
        fontSize: 16,
      }),
      ...quoteCard('testimonials-cards-01', rootId, 70, 198, '계약 전 위험 조항을 미리 확인해 협상이 훨씬 수월했습니다.', '제조업 법무팀', 3),
      ...quoteCard('testimonials-cards-02', rootId, 405, 198, '한국어 설명과 현지 문서 검토가 함께 진행되어 일정 지연을 줄였습니다.', '스타트업 대표', 6),
      ...quoteCard('testimonials-cards-03', rootId, 740, 198, '쟁점과 다음 행동이 명확해 내부 보고서 작성 시간이 줄었습니다.', '해외사업 담당자', 9),
    ],
  }),
  defineTemplate({
    id: 'testimonials-quote-grid',
    name: 'Quote Grid',
    category: 'testimonials',
    description: '대형 인용문과 신뢰 포인트 조합',
    thumbnailHint: 'PROOF',
    width: 1120,
    height: 380,
    rootStyle: { backgroundColor: '#ffffff' },
    children: (rootId) => [
      containerNode({
        id: 'testimonials-quote-grid-main-card',
        parentId: rootId,
        rect: { x: 70, y: 62, width: 520, height: 250 },
        zIndex: 1,
        label: 'Featured quote',
        style: {
          backgroundColor: '#0f172a',
          borderColor: '#0f172a',
          borderWidth: 1,
          borderRadius: 22,
          shadowY: 18,
          shadowBlur: 42,
          shadowColor: 'rgba(15, 23, 42, 0.18)',
        },
      }),
      textNode({
        id: 'testimonials-quote-grid-quote',
        parentId: 'testimonials-quote-grid-main-card',
        rect: { x: 34, y: 36, width: 440, height: 120 },
        zIndex: 2,
        text: '대만 법률 이슈를 내부 의사결정자에게 바로 공유할 수 있는 형태로 정리해 주었습니다.',
        fontSize: 24,
        color: '#ffffff',
        fontWeight: 'bold',
        lineHeight: 1.28,
      }),
      textNode({
        id: 'testimonials-quote-grid-name',
        parentId: 'testimonials-quote-grid-main-card',
        rect: { x: 34, y: 178, width: 360, height: 28 },
        zIndex: 3,
        text: 'Global operations lead',
        fontSize: 15,
        color: '#cbd5e1',
        fontWeight: 'medium',
      }),
      ...featureCard('testimonials-quote-grid-01', rootId, 640, 62, '응답 속도', '초기 질의와 자료 요청 범위를 빠르게 정리합니다.', 4),
      ...featureCard('testimonials-quote-grid-02', rootId, 640, 224, '보고 친화적', '핵심 쟁점과 권고안을 내부 공유용으로 구조화합니다.', 8),
    ],
  }),
  defineTemplate({
    id: 'cta-banner-centered',
    name: 'Centered CTA Banner',
    category: 'cta',
    description: '짧은 메시지와 단일 CTA 버튼',
    thumbnailHint: 'CTA',
    width: 1120,
    height: 280,
    rootStyle: { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' },
    children: (rootId) => [
      headingNode({
        id: 'cta-banner-centered-title',
        parentId: rootId,
        rect: { x: 220, y: 58, width: 680, height: 62 },
        zIndex: 1,
        text: '지금 필요한 법률 검토부터 시작하세요',
        fontSize: 36,
        align: 'center',
      }),
      textNode({
        id: 'cta-banner-centered-copy',
        parentId: rootId,
        rect: { x: 280, y: 126, width: 560, height: 42 },
        zIndex: 2,
        text: '자료를 보내주시면 우선순위와 예상 일정을 먼저 정리해 드립니다.',
        fontSize: 17,
        color: '#475569',
        align: 'center',
      }),
      buttonNode({
        id: 'cta-banner-centered-button',
        parentId: rootId,
        rect: { x: 470, y: 190, width: 180, height: 52 },
        zIndex: 3,
        label: '상담 요청',
      }),
    ],
  }),
  defineTemplate({
    id: 'cta-split-with-image',
    name: 'Split CTA With Image',
    category: 'cta',
    description: '이미지와 문의 유도 카피를 나란히 배치',
    thumbnailHint: 'SPLIT',
    width: 1120,
    height: 340,
    rootStyle: { backgroundColor: '#ffffff' },
    children: (rootId) => [
      imageNode({
        id: 'cta-split-with-image-visual',
        parentId: rootId,
        rect: { x: 64, y: 48, width: 390, height: 244 },
        zIndex: 1,
        src: '/images/hero-bg-02.webp',
        alt: 'Law office consultation',
        style: { borderRadius: 22 },
      }),
      headingNode({
        id: 'cta-split-with-image-title',
        parentId: rootId,
        rect: { x: 520, y: 70, width: 470, height: 84 },
        zIndex: 2,
        text: '문서와 상황을 함께 보내주세요',
        fontSize: 34,
      }),
      textNode({
        id: 'cta-split-with-image-copy',
        parentId: rootId,
        rect: { x: 520, y: 164, width: 480, height: 62 },
        zIndex: 3,
        text: '계약서, 상대방 연락, 일정 정보를 바탕으로 가능한 대응 방안을 정리합니다.',
        fontSize: 17,
      }),
      buttonNode({
        id: 'cta-split-with-image-button',
        parentId: rootId,
        rect: { x: 520, y: 248, width: 180, height: 52 },
        zIndex: 4,
        label: '자료 보내기',
      }),
    ],
  }),
  defineTemplate({
    id: 'footer-3-column',
    name: 'Three Column Footer',
    category: 'footer',
    description: '브랜드 소개, 링크, 연락처를 나눈 푸터',
    thumbnailHint: 'FOOT',
    width: 1120,
    height: 300,
    rootStyle: { backgroundColor: '#0f172a', borderColor: '#0f172a', borderRadius: 18 },
    children: (rootId) => [
      headingNode({
        id: 'footer-3-column-brand',
        parentId: rootId,
        rect: { x: 64, y: 56, width: 300, height: 44 },
        zIndex: 1,
        text: 'Tseng Law',
        level: 3,
        fontSize: 30,
        color: '#ffffff',
      }),
      textNode({
        id: 'footer-3-column-copy',
        parentId: rootId,
        rect: { x: 64, y: 112, width: 330, height: 70 },
        zIndex: 2,
        text: '대만 현지 법률 이슈를 한국어로 설명하고 실행 가능한 대응 계획을 제공합니다.',
        fontSize: 15,
        color: '#cbd5e1',
      }),
      textNode({
        id: 'footer-3-column-links-title',
        parentId: rootId,
        rect: { x: 470, y: 60, width: 180, height: 28 },
        zIndex: 3,
        text: '바로가기',
        fontSize: 15,
        color: '#ffffff',
        fontWeight: 'bold',
      }),
      textNode({
        id: 'footer-3-column-links',
        parentId: rootId,
        rect: { x: 470, y: 100, width: 180, height: 96 },
        zIndex: 4,
        text: '서비스\n변호사\n자주 묻는 질문\n문의',
        fontSize: 14,
        color: '#cbd5e1',
        lineHeight: 1.55,
      }),
      textNode({
        id: 'footer-3-column-contact-title',
        parentId: rootId,
        rect: { x: 720, y: 60, width: 220, height: 28 },
        zIndex: 5,
        text: '연락처',
        fontSize: 15,
        color: '#ffffff',
        fontWeight: 'bold',
      }),
      textNode({
        id: 'footer-3-column-contact',
        parentId: rootId,
        rect: { x: 720, y: 100, width: 300, height: 96 },
        zIndex: 6,
        text: 'contact@example.com\nTaipei, Taiwan\n월-금 09:00-18:00',
        fontSize: 14,
        color: '#cbd5e1',
        lineHeight: 1.55,
      }),
      textNode({
        id: 'footer-3-column-rights',
        parentId: rootId,
        rect: { x: 64, y: 234, width: 520, height: 28 },
        zIndex: 7,
        text: '© 2026 Tseng Law. All rights reserved.',
        fontSize: 13,
        color: '#94a3b8',
      }),
    ],
  }),
  defineTemplate({
    id: 'footer-minimal',
    name: 'Minimal Footer',
    category: 'footer',
    description: '한 줄 브랜드와 링크 중심의 간결한 푸터',
    thumbnailHint: 'MINI',
    width: 1120,
    height: 180,
    rootStyle: { backgroundColor: '#ffffff', borderColor: '#dbe4ee', borderRadius: 14 },
    children: (rootId) => [
      headingNode({
        id: 'footer-minimal-brand',
        parentId: rootId,
        rect: { x: 64, y: 54, width: 260, height: 38 },
        zIndex: 1,
        text: 'Tseng Law',
        level: 3,
        fontSize: 26,
      }),
      textNode({
        id: 'footer-minimal-links',
        parentId: rootId,
        rect: { x: 420, y: 62, width: 420, height: 28 },
        zIndex: 2,
        text: 'Services  /  Attorneys  /  FAQ  /  Contact',
        fontSize: 14,
        color: '#334155',
        fontWeight: 'medium',
      }),
      textNode({
        id: 'footer-minimal-rights',
        parentId: rootId,
        rect: { x: 64, y: 112, width: 500, height: 26 },
        zIndex: 3,
        text: '© 2026 Tseng Law. Legal information is not a substitute for case-specific advice.',
        fontSize: 13,
        color: '#64748b',
      }),
    ],
  }),
  defineTemplate({
    id: 'legal-disclaimer',
    name: 'Legal Disclaimer',
    category: 'legal',
    description: '법률 정보 고지와 상담 전 확인사항',
    thumbnailHint: 'LEGAL',
    width: 1120,
    height: 280,
    rootStyle: { backgroundColor: '#f8fafc', borderColor: '#dbe4ee' },
    children: (rootId) => [
      headingNode({
        id: 'legal-disclaimer-title',
        parentId: rootId,
        rect: { x: 64, y: 48, width: 430, height: 52 },
        zIndex: 1,
        text: '법률 정보 이용 안내',
        fontSize: 32,
      }),
      textNode({
        id: 'legal-disclaimer-copy',
        parentId: rootId,
        rect: { x: 64, y: 112, width: 930, height: 74 },
        zIndex: 2,
        text: '이 페이지의 내용은 일반 정보 제공을 위한 것이며 구체적인 사건에 대한 법률 의견이 아닙니다. 개별 사안은 자료 검토와 상담을 통해 판단해야 합니다.',
        fontSize: 16,
      }),
      textNode({
        id: 'legal-disclaimer-list',
        parentId: rootId,
        rect: { x: 64, y: 198, width: 850, height: 54 },
        zIndex: 3,
        text: '상담 전 관련 계약서, 상대방 연락, 기한 정보를 함께 준비해 주세요.\n긴급 사건은 관할 기관 기한을 먼저 확인해야 합니다.',
        fontSize: 14,
        color: '#64748b',
        lineHeight: 1.5,
      }),
    ],
  }),
  defineTemplate({
    id: 'legal-privacy-summary',
    name: 'Privacy Summary',
    category: 'legal',
    description: '개인정보 처리 핵심 항목 요약',
    thumbnailHint: 'PRIV',
    width: 1120,
    height: 350,
    rootStyle: { backgroundColor: '#ffffff' },
    children: (rootId) => [
      headingNode({
        id: 'legal-privacy-summary-title',
        parentId: rootId,
        rect: { x: 64, y: 48, width: 520, height: 52 },
        zIndex: 1,
        text: '개인정보 처리 요약',
        fontSize: 32,
      }),
      textNode({
        id: 'legal-privacy-summary-copy',
        parentId: rootId,
        rect: { x: 64, y: 108, width: 620, height: 46 },
        zIndex: 2,
        text: '문의 대응과 사건 검토를 위해 필요한 범위에서 정보를 수집하고 보관합니다.',
        fontSize: 16,
      }),
      ...featureCard('legal-privacy-summary-01', rootId, 64, 184, '수집 항목', '이름, 연락처, 문의 내용, 첨부 자료를 확인합니다.', 3),
      ...featureCard('legal-privacy-summary-02', rootId, 400, 184, '이용 목적', '상담 가능성 검토와 후속 연락을 위해 사용합니다.', 7),
      ...featureCard('legal-privacy-summary-03', rootId, 736, 184, '보관 기간', '법령과 내부 기준에 따라 필요한 기간만 보관합니다.', 11),
    ],
  }),
];

export function getBuiltInSectionsByCategory(): Record<BuiltInSectionCategory, BuiltInSectionTemplate[]> {
  const buckets: Record<BuiltInSectionCategory, BuiltInSectionTemplate[]> = {
    hero: [],
    features: [],
    testimonials: [],
    cta: [],
    footer: [],
    legal: [],
  };

  for (const template of BUILT_IN_SECTIONS) {
    buckets[template.category].push(template);
  }

  return buckets;
}
