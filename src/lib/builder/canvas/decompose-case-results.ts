import type { BuilderCanvasNode } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import type { Locale } from '@/lib/locales';

const copyByLocale = {
  ko: {
    label: '사례 분석',
    title: '한국 유학생 헬스장 부상 사건\n1심 157만 TWD 판결·항소심 화해',
    description:
      '대만 헬스장에서 트레이너의 지도를 받아 운동하던 중 다친 한국인 대학생이 손해배상을 청구한 사건입니다. 1심에서 157만 TWD의 배상을 인정하는 판결이 내려졌고, 이후 항소심에서 당사자 간 화해로 종결되었습니다.',
    summary:
      '사건 결과는 구체적인 사실관계와 증거에 따라 달라질 수 있으며, 이 사례는 과거 한 사건의 진행 경과를 소개합니다.',
    cta: '소송사례 분석 보기',
  },
  'zh-hant': {
    label: '案例解析',
    title: '韓國留學生健身房受傷案\n一審判賠157萬TWD，二審和解',
    description:
      '韓國大學生在台灣健身房接受教練指導運動時受傷，因而提起損害賠償請求。一審判決賠償157萬TWD，其後於二審由雙方和解結案。',
    summary:
      '案件結果會因具體事實與證據而異；本案例僅說明一件過往案件的處理經過。',
    cta: '查看訴訟案例',
  },
  en: {
    label: 'CASE STUDY',
    title: 'Korean Student Gym Injury Case\nTWD 1.57M Ruling, Then Appeal Settlement',
    description:
      'A Korean university student sought damages after being injured while training under an instructor’s supervision at a Taiwan gym. The first-instance court issued a TWD 1.57 million damages ruling; the case later concluded through a settlement on appeal.',
    summary:
      'Outcomes depend on the specific facts and evidence; this case study describes the course of one past matter.',
    cta: 'View Case Studies',
  },
} as const;

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 600;

/**
 * Decompose home-case-results composite into ~7 editable builder nodes.
 *
 * Tree:
 *   container#home-case-results-root  (as="section", className="section section--dark ...")
 *     container#home-case-results-content (className="split-content home-results-content")
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
  const rootId = 'home-case-results-root';
  const contentId = 'home-case-results-content';
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
    id: 'home-case-results-label',
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
    id: 'home-case-results-title',
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
    id: 'home-case-results-divider',
    kind: 'divider',
    rect: { x: 78, y: 172, width: 40, height: 32 },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }),
    zIndex: 3,
    rotation: 0,
    locked: false,
    visible: true,
    parentId: contentId,
    content: {
      orientation: 'horizontal',
      thickness: 2,
      color: '#9f8752',
      style: 'solid',
    },
  });

  nodes.push({
    id: 'home-case-results-desc',
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
    id: 'home-case-results-summary',
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
    id: 'home-case-results-cta',
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
