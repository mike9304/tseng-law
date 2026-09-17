import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale, SiteLocale } from '@/lib/locales';

export const ARCHIVE_INTRO_COPY = {
  ko: '대만 회사설립, 투자와 분쟁 대응에 필요한 법률정보를 확인하세요.',
  'zh-hant': '查看台灣公司設立、投資與爭議因應所需的法律資訊。',
  en: 'Find legal information you need for Taiwan company formation, investment, and dispute response.',
  ja: '台湾の会社設立、投資、紛争対応に必要な法律情報をご確認ください。',
} as const satisfies Record<SiteLocale, string>;

const LEGACY_ARCHIVE_INTRO_COPY = {
  ko: '실제 수집된 칼럼 본문과 이미지를 기반으로 주요 글을 바로 확인할 수 있습니다.',
  'zh-hant': '以下內容直接對應已整理的專欄原文與圖片素材。',
  en: 'Browse key posts prepared from curated legal columns and source images.',
} as const satisfies Record<Locale, string>;

const LEGACY_ARCHIVE_INTRO_REPLACEMENTS: ReadonlyMap<string, string> = new Map([
  [LEGACY_ARCHIVE_INTRO_COPY.ko, ARCHIVE_INTRO_COPY.ko],
  [LEGACY_ARCHIVE_INTRO_COPY['zh-hant'], ARCHIVE_INTRO_COPY['zh-hant']],
  [LEGACY_ARCHIVE_INTRO_COPY.en, ARCHIVE_INTRO_COPY.en],
]);

export function getArchiveIntroCopy(locale: SiteLocale): string {
  return ARCHIVE_INTRO_COPY[locale];
}

/**
 * Read-only published-home projection for leftover seed archive intros.
 * Saved custom copy, bound nodes, other identities, and non-home routes stay
 * on the original node reference. Never writes the stored document.
 */
export function projectPublishedHomeInsightsArchiveIntro(
  node: BuilderCanvasNode,
  slugPath: string,
): BuilderCanvasNode {
  if (slugPath !== '') {
    return node;
  }
  if (
    node.kind !== 'text'
    || node.id !== 'home-insights-description'
    || node.dataBinding !== undefined
  ) {
    return node;
  }

  const nextText = LEGACY_ARCHIVE_INTRO_REPLACEMENTS.get(node.content.text);
  if (nextText === undefined || nextText === node.content.text) {
    return node;
  }

  return {
    ...node,
    content: {
      ...node.content,
      text: nextText,
    },
  };
}
