import type { Locale } from '@/lib/locales';

export interface UndoStackTimelineCopy {
  dateLocale: string;
  sectionLabel: string;
  snapshotCountLabel: (count: number) => string;
  undo: string;
  redo: string;
  undoTitle: string;
  redoTitle: string;
  nameInputLabel: string;
  nameInputPlaceholder: string;
  saveName: string;
  clearName: string;
  saveNameTitle: string;
  clearNameTitle: string;
  initialSnapshot: string;
  snapshotLabel: (index: number) => string;
  addedLabel: (count: number) => string;
  removedLabel: (count: number) => string;
  movedLabel: (count: number) => string;
  resizedLabel: (count: number) => string;
  styledLabel: (count: number) => string;
  editedLabel: (count: number) => string;
  nodeCountLabel: (nodes: number, roots: number) => string;
  currentBadge: string;
  savedBadge: string;
}

const COPY: Record<Locale | 'en', UndoStackTimelineCopy> = {
  ko: {
    dateLocale: 'ko-KR',
    sectionLabel: '작업 기록',
    snapshotCountLabel: (count) => `${count}개 스냅샷`,
    undo: '실행 취소',
    redo: '다시 실행',
    undoTitle: '마지막 편집 실행 취소',
    redoTitle: '되돌린 편집 다시 실행',
    nameInputLabel: '현재 스냅샷 이름',
    nameInputPlaceholder: '예: 히어로 정렬 완료',
    saveName: '저장',
    clearName: '삭제',
    saveNameTitle: '현재 스냅샷 이름 저장',
    clearNameTitle: '현재 스냅샷 이름 삭제',
    initialSnapshot: '초기 캔버스 스냅샷',
    snapshotLabel: (index) => `스냅샷 ${index}`,
    addedLabel: (count) => `${count}개 추가`,
    removedLabel: (count) => `${count}개 삭제`,
    movedLabel: (count) => `${count}개 이동`,
    resizedLabel: (count) => `${count}개 크기 변경`,
    styledLabel: (count) => `${count}개 스타일 변경`,
    editedLabel: (count) => `${count}개 내용 수정`,
    nodeCountLabel: (nodes, roots) => `노드 ${nodes}개 · 루트 ${roots}개`,
    currentBadge: '현재 위치',
    savedBadge: '기록됨',
  },
  'zh-hant': {
    dateLocale: 'zh-Hant-TW',
    sectionLabel: '操作記錄',
    snapshotCountLabel: (count) => `${count} 個快照`,
    undo: '復原',
    redo: '重做',
    undoTitle: '復原上一個編輯',
    redoTitle: '重做已復原的編輯',
    nameInputLabel: '目前快照名稱',
    nameInputPlaceholder: '例：主視覺已對齊',
    saveName: '儲存',
    clearName: '清除',
    saveNameTitle: '儲存目前快照名稱',
    clearNameTitle: '清除目前快照名稱',
    initialSnapshot: '初始畫布快照',
    snapshotLabel: (index) => `快照 ${index}`,
    addedLabel: (count) => `新增 ${count} 個`,
    removedLabel: (count) => `刪除 ${count} 個`,
    movedLabel: (count) => `移動 ${count} 個`,
    resizedLabel: (count) => `調整大小 ${count} 個`,
    styledLabel: (count) => `樣式變更 ${count} 個`,
    editedLabel: (count) => `內容編輯 ${count} 個`,
    nodeCountLabel: (nodes, roots) => `節點 ${nodes} 個 · 根層 ${roots} 個`,
    currentBadge: '目前位置',
    savedBadge: '已記錄',
  },
  en: {
    dateLocale: 'en-US',
    sectionLabel: 'Action history',
    snapshotCountLabel: (count) => `${count} snapshots`,
    undo: 'Undo',
    redo: 'Redo',
    undoTitle: 'Undo last edit',
    redoTitle: 'Redo reverted edit',
    nameInputLabel: 'Current snapshot name',
    nameInputPlaceholder: 'Example: Hero aligned',
    saveName: 'Save',
    clearName: 'Clear',
    saveNameTitle: 'Save current snapshot name',
    clearNameTitle: 'Clear current snapshot name',
    initialSnapshot: 'Initial canvas snapshot',
    snapshotLabel: (index) => `Snapshot ${index}`,
    addedLabel: (count) => `added ${count}`,
    removedLabel: (count) => `removed ${count}`,
    movedLabel: (count) => `moved ${count}`,
    resizedLabel: (count) => `resized ${count}`,
    styledLabel: (count) => `styled ${count}`,
    editedLabel: (count) => `edited ${count}`,
    nodeCountLabel: (nodes, roots) => `${nodes} nodes · ${roots} roots`,
    currentBadge: 'Current',
    savedBadge: 'Saved',
  },
};

export function getUndoStackTimelineCopy(locale?: Locale | string | null): UndoStackTimelineCopy {
  if (locale === 'ko') return COPY.ko;
  if (locale === 'zh-hant') return COPY['zh-hant'];
  return COPY.en;
}
