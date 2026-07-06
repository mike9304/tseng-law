import type { Locale } from '@/lib/locales';

export type ElementCommentsPanelCopy = {
  noSelectionLabel: string;
  titleLabel: (count: number) => string;
  emptyLabel: string;
  resolvedLabel: string;
  resolveLabel: string;
  deleteLabel: string;
  placeholder: string;
  submitLabel: string;
  defaultAuthorLabel: string;
  dateTimeLocale: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', ElementCommentsPanelCopy> = {
  ko: {
    noSelectionLabel: '노드를 선택하면 주석을 추가할 수 있습니다.',
    titleLabel: (count) => `주석 · ${count}`,
    emptyLabel: '아직 주석이 없습니다.',
    resolvedLabel: '해결됨',
    resolveLabel: '해결',
    deleteLabel: '삭제',
    placeholder: '이 노드에 대한 주석...',
    submitLabel: '댓글 추가',
    defaultAuthorLabel: '디자이너',
    dateTimeLocale: 'ko-KR',
  },
  'zh-hant': {
    noSelectionLabel: '選取節點後即可新增註解。',
    titleLabel: (count) => `註解 · ${count}`,
    emptyLabel: '尚無註解。',
    resolvedLabel: '已解決',
    resolveLabel: '解決',
    deleteLabel: '刪除',
    placeholder: '此節點的註解...',
    submitLabel: '新增留言',
    defaultAuthorLabel: '設計師',
    dateTimeLocale: 'zh-Hant',
  },
  en: {
    noSelectionLabel: 'Select a node to add comments.',
    titleLabel: (count) => `Comments · ${count}`,
    emptyLabel: 'No comments yet.',
    resolvedLabel: 'resolved',
    resolveLabel: 'Resolve',
    deleteLabel: 'Delete',
    placeholder: 'Comment on this node...',
    submitLabel: 'Add comment',
    defaultAuthorLabel: 'designer',
    dateTimeLocale: 'en-US',
  },
};

export function getElementCommentsPanelCopy(locale: Locale): ElementCommentsPanelCopy {
  return COPY[locale] ?? COPY.en;
}
