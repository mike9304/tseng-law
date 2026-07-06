import type { Locale } from '@/lib/locales';

export type SegmentCopy = {
  readonly title: string;
  readonly summary: (sourceCount: number, targetCount: number) => string;
  readonly align: string;
  readonly copySourceLine: string;
  readonly remapSourceLine: string;
  readonly appendSourceLine: string;
  readonly moveTargetLineUp: string;
  readonly moveTargetLineDown: string;
  readonly mergeTargetLineDown: string;
  readonly splitTargetLine: string;
  readonly deleteTargetLine: string;
  readonly sourceLineOption: (index: number) => string;
  readonly source: string;
  readonly target: string;
  readonly emptyTarget: string;
  readonly missingTarget: string;
  readonly extraTarget: string;
};

export const SEGMENT_COPY = {
  ko: {
    title: '줄 세그먼트 검토',
    summary: (sourceCount, targetCount) => `소스 ${sourceCount}줄 / 타깃 ${targetCount}줄`,
    align: '소스 줄 수에 맞추기',
    copySourceLine: '원문 적용',
    remapSourceLine: '다른 원문 줄 적용',
    appendSourceLine: '원문 줄 이어붙이기',
    moveTargetLineUp: '타깃 줄 위로 이동',
    moveTargetLineDown: '타깃 줄 아래로 이동',
    mergeTargetLineDown: '아래 타깃 줄 병합',
    splitTargetLine: '타깃 줄 나누기',
    deleteTargetLine: '타깃 줄 삭제',
    sourceLineOption: (index) => `원문 ${index}번`,
    source: '소스',
    target: '타깃',
    emptyTarget: '타깃 줄 비어 있음',
    missingTarget: '타깃 줄 누락',
    extraTarget: '타깃 추가 줄',
  },
  'zh-hant': {
    title: '行段落檢查',
    summary: (sourceCount, targetCount) => `來源 ${sourceCount} 行 / 目標 ${targetCount} 行`,
    align: '符合來源行數',
    copySourceLine: '套用來源',
    remapSourceLine: '套用其他來源行',
    appendSourceLine: '附加來源行',
    moveTargetLineUp: '上移目標行',
    moveTargetLineDown: '下移目標行',
    mergeTargetLineDown: '向下合併目標行',
    splitTargetLine: '分割目標行',
    deleteTargetLine: '刪除目標行',
    sourceLineOption: (index) => `來源第 ${index} 行`,
    source: '來源',
    target: '目標',
    emptyTarget: '目標行空白',
    missingTarget: '缺少目標行',
    extraTarget: '多出的目標行',
  },
  en: {
    title: 'Line segment review',
    summary: (sourceCount, targetCount) => `Source ${sourceCount} lines / target ${targetCount} lines`,
    align: 'Match source line count',
    copySourceLine: 'Use source',
    remapSourceLine: 'Use source line',
    appendSourceLine: 'Append source line',
    moveTargetLineUp: 'Move target line up',
    moveTargetLineDown: 'Move target line down',
    mergeTargetLineDown: 'Merge target line down',
    splitTargetLine: 'Split target line',
    deleteTargetLine: 'Delete target line',
    sourceLineOption: (index) => `Source line ${index}`,
    source: 'Source',
    target: 'Target',
    emptyTarget: 'Target line empty',
    missingTarget: 'Target line missing',
    extraTarget: 'Extra target line',
  },
} satisfies Record<Locale, SegmentCopy>;
