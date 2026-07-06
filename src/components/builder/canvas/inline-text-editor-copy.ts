import type { Locale } from '@/lib/locales';

export interface InlineTextEditorCopy {
  placeholder: string;
  toolbarAriaLabel: string;
  boldAriaLabel: string;
  boldTitle: string;
  italicAriaLabel: string;
  italicTitle: string;
  underlineAriaLabel: string;
  underlineTitle: string;
  strikethroughAriaLabel: string;
  strikethroughTitle: string;
  heading1AriaLabel: string;
  heading1Title: string;
  heading2AriaLabel: string;
  heading2Title: string;
  heading3AriaLabel: string;
  heading3Title: string;
  bulletListAriaLabel: string;
  bulletListTitle: string;
  numberedListAriaLabel: string;
  numberedListTitle: string;
  linkAriaLabel: string;
  linkTitle: string;
  linkButtonText: string;
  linkPopoverAriaLabel: string;
  aiAssistantAriaLabel: string;
  aiAssistantTitle: string;
}

export function getInlineTextEditorCopy(locale: Locale): InlineTextEditorCopy {
  if (locale === 'zh-hant') {
    return {
      placeholder: '輸入文字...',
      toolbarAriaLabel: '行內文字格式工具列',
      boldAriaLabel: '粗體',
      boldTitle: '粗體 (Cmd+B)',
      italicAriaLabel: '斜體',
      italicTitle: '斜體 (Cmd+I)',
      underlineAriaLabel: '底線',
      underlineTitle: '底線 (Cmd+U)',
      strikethroughAriaLabel: '刪除線',
      strikethroughTitle: '刪除線',
      heading1AriaLabel: '標題 1',
      heading1Title: '標題 1',
      heading2AriaLabel: '標題 2',
      heading2Title: '標題 2',
      heading3AriaLabel: '標題 3',
      heading3Title: '標題 3',
      bulletListAriaLabel: '項目符號清單',
      bulletListTitle: '項目符號清單',
      numberedListAriaLabel: '編號清單',
      numberedListTitle: '編號清單',
      linkAriaLabel: '連結',
      linkTitle: '插入連結',
      linkButtonText: '連結',
      linkPopoverAriaLabel: '編輯文字連結',
      aiAssistantAriaLabel: 'AI 文字助理',
      aiAssistantTitle: '用 AI 改寫、摘要、翻譯或調整語氣',
    };
  }

  if (locale === 'en') {
    return {
      placeholder: 'Enter text...',
      toolbarAriaLabel: 'Inline text formatting toolbar',
      boldAriaLabel: 'Bold',
      boldTitle: 'Bold (Cmd+B)',
      italicAriaLabel: 'Italic',
      italicTitle: 'Italic (Cmd+I)',
      underlineAriaLabel: 'Underline',
      underlineTitle: 'Underline (Cmd+U)',
      strikethroughAriaLabel: 'Strikethrough',
      strikethroughTitle: 'Strikethrough',
      heading1AriaLabel: 'Heading 1',
      heading1Title: 'Heading 1',
      heading2AriaLabel: 'Heading 2',
      heading2Title: 'Heading 2',
      heading3AriaLabel: 'Heading 3',
      heading3Title: 'Heading 3',
      bulletListAriaLabel: 'Bulleted list',
      bulletListTitle: 'Bulleted list',
      numberedListAriaLabel: 'Numbered list',
      numberedListTitle: 'Numbered list',
      linkAriaLabel: 'Link',
      linkTitle: 'Insert link',
      linkButtonText: 'Link',
      linkPopoverAriaLabel: 'Edit text link',
      aiAssistantAriaLabel: 'AI text assistant',
      aiAssistantTitle: 'Rewrite, summarize, translate, or adjust tone with AI',
    };
  }

  return {
    placeholder: '텍스트 입력...',
    toolbarAriaLabel: '인라인 텍스트 서식 도구',
    boldAriaLabel: '굵게',
    boldTitle: '굵게 (Cmd+B)',
    italicAriaLabel: '기울임',
    italicTitle: '기울임 (Cmd+I)',
    underlineAriaLabel: '밑줄',
    underlineTitle: '밑줄 (Cmd+U)',
    strikethroughAriaLabel: '취소선',
    strikethroughTitle: '취소선',
    heading1AriaLabel: '제목 1',
    heading1Title: '제목 1',
    heading2AriaLabel: '제목 2',
    heading2Title: '제목 2',
    heading3AriaLabel: '제목 3',
    heading3Title: '제목 3',
    bulletListAriaLabel: '글머리 기호 목록',
    bulletListTitle: '글머리 기호 목록',
    numberedListAriaLabel: '번호 매기기 목록',
    numberedListTitle: '번호 매기기 목록',
    linkAriaLabel: '링크',
    linkTitle: '링크 삽입',
    linkButtonText: '링크',
    linkPopoverAriaLabel: '텍스트 링크 편집',
    aiAssistantAriaLabel: 'AI 텍스트 어시스턴트',
    aiAssistantTitle: 'AI로 텍스트 다시 쓰기/요약/번역/톤 조정',
  };
}
