import type { BuilderCanvasNode } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import type { Locale } from '@/lib/locales';

const copyByLocale = {
  ko: {
    label: 'RESULTS',
    title: '한국 학생 헬스장 부상 사건,\n157만 TWD 승소',
    description:
      '한국 대학생이 대만 헬스장에서 트레이너 지도 중 중상을 입은 사건에서 손해배상 청구를 진행해 1심에서 157만 TWD 판결을 받았습니다.',
    summary:
      '사실관계 입증, 손해 산정, 협상·소송 전략을 통합해 결과를 도출한 대표 사례입니다.',
    cta: '소송사례 더 보기',
  },
  'zh-hant': {
    label: 'RESULTS',
    title: '韓國學生健身房受傷案件，\n一審獲判 157 萬 TWD',
    description:
      '韓國大學生於台灣健身房在教練指導下受傷後提出損害賠償請求，一審取得 157 萬 TWD 判決。',
    summary: '本案整合事實證明、損害計算與訴訟策略，屬代表性實績案例。',
    cta: '查看更多案例',
  },
  en: {
    label: 'RESULTS',
    title: 'Korean Student Gym Injury Case,\nTWD 1.57M First-Instance Win',
    description:
      'In a case where a Korean university student suffered a serious injury during trainer-guided exercise at a Taiwan gym, we pursued damages and obtained a TWD 1.57M ruling in first instance.',
    summary:
      'This is a representative result built on integrated fact proof, damage calculation, negotiation, and litigation strategy.',
    cta: 'View More Case Results',
  },
} as const;

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 600;

/**
 * Decompose home-case-results composite into ~7 editable builder nodes.
 *
 * Tree:
 *   container#case-results-root  (as="section", className="section section--dark ...")
 *     container#case-results-content (className="split-content home-results-content")
 *       text#label     (className="section-label home-results-label")
 *       text#title     (as="h2", className="split-title home-results-title")
 *       container#divider (className="split-divider")
 *       text#desc      (as="p", className="split-text home-results-text")
 *       text#summary   (as="p", className="split-text home-results-text")
 *       button#cta     (as="a", className="link-underline home-results-link")
 *
 * Existing CSS (globals.css) drives visual. node.rect fills parent via width:100%/height:100%.
 */
export function createCaseResultsDecomposedNodes(
  rootY: number,
  locale: Locale,
  zIndexBase: number,
): BuilderCanvasNode[] {
  const copy = copyByLocale[locale];
  const rootId = 'case-results-root';
  const contentId = 'case-results-content';
  const nodes: BuilderCanvasNode[] = [];

  nodes.push({
    id: rootId,
    kind: 'container',
    rect: { x: 0, y: rootY, width: STAGE_WIDTH, height: STAGE_HEIGHT },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex: zIndexBase,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: 'case-results root',
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
      className: 'section section--dark split-section split--text-only home-results-panel',
      as: 'section',
      htmlId: 'results',
      dataTone: 'dark',
    },
  });

  nodes.push({
    id: contentId,
    kind: 'container',
    rect: { x: 0, y: 0, width: STAGE_WIDTH, height: STAGE_HEIGHT },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    parentId: rootId,
    content: {
      label: 'case-results content',
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
      className: 'split-content home-results-content',
      as: 'div',
    },
  });

  const textBase = {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: 'regular' as const,
    align: 'left' as const,
    lineHeight: 1.5,
    letterSpacing: 0,
    fontFamily: 'system-ui',
    verticalAlign: 'top' as const,
    textShadow: undefined,
    backgroundColor: undefined,
    textTransform: 'none' as const,
  };

  nodes.push({
    id: 'case-results-label',
    kind: 'text',
    rect: { x: 0, y: 0, width: 400, height: 40 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    parentId: contentId,
    content: {
      ...textBase,
      text: copy.label,
      className: 'section-label home-results-label',
      as: 'div',
    },
  });

  nodes.push({
    id: 'case-results-title',
    kind: 'text',
    rect: { x: 0, y: 50, width: 720, height: 120 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 2,
    rotation: 0,
    locked: false,
    visible: true,
    parentId: contentId,
    content: {
      ...textBase,
      text: copy.title,
      className: 'split-title home-results-title',
      as: 'h2',
    },
  });

  nodes.push({
    id: 'case-results-divider',
    kind: 'container',
    rect: { x: 0, y: 180, width: 80, height: 4 },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex: 3,
    rotation: 0,
    locked: false,
    visible: true,
    parentId: contentId,
    content: {
      label: 'divider',
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
      className: 'split-divider',
      as: 'div',
    },
  });

  nodes.push({
    id: 'case-results-desc',
    kind: 'text',
    rect: { x: 0, y: 200, width: 720, height: 80 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 4,
    rotation: 0,
    locked: false,
    visible: true,
    parentId: contentId,
    content: {
      ...textBase,
      text: copy.description,
      className: 'split-text home-results-text',
      as: 'p',
    },
  });

  nodes.push({
    id: 'case-results-summary',
    kind: 'text',
    rect: { x: 0, y: 290, width: 720, height: 60 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 5,
    rotation: 0,
    locked: false,
    visible: true,
    parentId: contentId,
    content: {
      ...textBase,
      text: copy.summary,
      className: 'split-text home-results-text',
      as: 'p',
    },
  });

  nodes.push({
    id: 'case-results-cta',
    kind: 'button',
    rect: { x: 0, y: 360, width: 200, height: 36 },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex: 6,
    rotation: 0,
    locked: false,
    visible: true,
    parentId: contentId,
    content: {
      label: `${copy.cta} →`,
      href: `/${locale}/columns`,
      style: 'link',
      className: 'link-underline home-results-link',
      as: 'a',
    },
  });

  return nodes;
}

export const CASE_RESULTS_ROOT_HEIGHT = STAGE_HEIGHT;
