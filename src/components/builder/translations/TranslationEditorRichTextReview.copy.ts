import type { Locale } from '@/lib/locales';
import type {
  RichTextReviewSignal,
  RichTextReviewSummary,
} from './TranslationEditorRichTextReview.types';

interface RichTextReviewCopy {
  readonly title: string;
  readonly summary: (value: RichTextReviewSummary) => string;
  readonly signal: Record<RichTextReviewSignal, string>;
}

const COPY = {
  ko: {
    title: '서식 구조 검토',
    summary: (value) =>
      `블록 ${value.blockCount} · 표시 ${value.markedRunCount} · 링크 ${value.linkCount} · 목록 깊이 ${value.maxListDepth}`,
    signal: {
      bold: '굵게',
      italic: '기울임',
      underline: '밑줄',
      strike: '취소선',
      code: '코드',
      link: '링크',
      orderedList: '번호 목록',
      bulletList: '글머리 목록',
      heading: '제목',
      blockquote: '인용',
      hardBreak: '줄바꿈',
    },
  },
  'zh-hant': {
    title: '格式結構檢查',
    summary: (value) =>
      `區塊 ${value.blockCount} · 標記 ${value.markedRunCount} · 連結 ${value.linkCount} · 清單深度 ${value.maxListDepth}`,
    signal: {
      bold: '粗體',
      italic: '斜體',
      underline: '底線',
      strike: '刪除線',
      code: '程式碼',
      link: '連結',
      orderedList: '編號清單',
      bulletList: '項目清單',
      heading: '標題',
      blockquote: '引用',
      hardBreak: '換行',
    },
  },
  en: {
    title: 'Format structure review',
    summary: (value) =>
      `Blocks ${value.blockCount} · marked ${value.markedRunCount} · links ${value.linkCount} · list depth ${value.maxListDepth}`,
    signal: {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      strike: 'Strike',
      code: 'Code',
      link: 'Link',
      orderedList: 'Ordered list',
      bulletList: 'Bullet list',
      heading: 'Heading',
      blockquote: 'Quote',
      hardBreak: 'Line break',
    },
  },
} satisfies Record<Locale, RichTextReviewCopy>;

export function getRichTextReviewCopy(locale: Locale): RichTextReviewCopy {
  return COPY[locale];
}
