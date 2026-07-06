import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { linkValueFromLegacy, type LinkValue } from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';

type SelectionOverlayCopy = {
  readonly multiSelectionBboxLabel: (count: number, width: number, height: number) => string;
  readonly selectionToolbarAriaLabel: string;
  readonly selectionToolbarMultiSummary: (count: number) => string;
};

const SELECTION_OVERLAY_COPY: Record<Locale, SelectionOverlayCopy> = {
  ko: {
    multiSelectionBboxLabel: (count, width, height) => `${count}개 선택됨 · ${width} x ${height}`,
    selectionToolbarAriaLabel: '요소 빠른 작업',
    selectionToolbarMultiSummary: (count) => `${count}개 선택됨`,
  },
  'zh-hant': {
    multiSelectionBboxLabel: (count, width, height) => `已選取 ${count} 個 · ${width} x ${height}`,
    selectionToolbarAriaLabel: '元素快速操作',
    selectionToolbarMultiSummary: (count) => `已選取 ${count} 個`,
  },
  en: {
    multiSelectionBboxLabel: (count, width, height) => `${count} selected · ${width} x ${height}`,
    selectionToolbarAriaLabel: 'Element quick actions',
    selectionToolbarMultiSummary: (count) => `${count} selected`,
  },
};

function resolveLocale(locale: Locale | undefined): Locale {
  return locale ?? 'ko';
}

export function getSelectionToolbarAriaLabel(locale: Locale | undefined): string {
  return SELECTION_OVERLAY_COPY[resolveLocale(locale)].selectionToolbarAriaLabel;
}

export function formatSelectionToolbarSummary(
  selectedNodes: readonly BuilderCanvasNode[],
  locale: Locale | undefined,
): string {
  const [singleNode] = selectedNodes;
  if (selectedNodes.length === 1 && singleNode) return singleNode.kind;
  return SELECTION_OVERLAY_COPY[resolveLocale(locale)].selectionToolbarMultiSummary(selectedNodes.length);
}

export function formatMultiSelectionBboxLabel({
  count,
  height,
  locale,
  width,
}: {
  readonly count: number;
  readonly height: number;
  readonly locale?: Locale;
  readonly width: number;
}): string {
  return SELECTION_OVERLAY_COPY[resolveLocale(locale)].multiSelectionBboxLabel(
    count,
    Math.round(width),
    Math.round(height),
  );
}

export function previewSelectionLinkHref(href: string | undefined): string {
  if (!href) return '';
  const trimmed = href.trim();
  if (trimmed.length <= 24) return trimmed;
  return `${trimmed.slice(0, 22)}...`;
}

export function getSelectionLinkValue(node: BuilderCanvasNode): LinkValue | null {
  if (node.kind === 'button') return linkValueFromLegacy(node.content);
  if (node.kind === 'image' || node.kind === 'container') return node.content.link ?? null;
  return null;
}
