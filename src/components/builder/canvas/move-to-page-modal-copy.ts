import type { Locale } from '@/lib/locales';

export interface MoveToPageModalCopy {
  title: string;
  ariaLabel: string;
  closeAriaLabel: string;
  description: (count: number) => string;
  moveFailed: string;
  noTargetsTitle: string;
  noTargetsHint: string;
  untitledPage: string;
  homeBadge: string;
  moving: string;
  closeHint: string;
}

const COPY: Record<Locale | 'en', MoveToPageModalCopy> = {
  ko: {
    title: '페이지로 이동',
    ariaLabel: '페이지로 이동',
    closeAriaLabel: '닫기',
    description: (count) => `선택된 ${count}개 요소를 다른 페이지로 옮깁니다.`,
    moveFailed: '이동에 실패했습니다.',
    noTargetsTitle: '이동할 다른 페이지가 없습니다.',
    noTargetsHint: '먼저 새 페이지를 만들어주세요.',
    untitledPage: '제목 없는 페이지',
    homeBadge: '홈',
    moving: '이동 중...',
    closeHint: 'Esc 또는 화면 바깥 클릭으로 닫기',
  },
  'zh-hant': {
    title: '移動到頁面',
    ariaLabel: '移動到頁面',
    closeAriaLabel: '關閉',
    description: (count) => `將選取的 ${count} 個元素移動到其他頁面。`,
    moveFailed: '移動失敗。',
    noTargetsTitle: '沒有其他可移動的頁面。',
    noTargetsHint: '請先建立新頁面。',
    untitledPage: '未命名頁面',
    homeBadge: '首頁',
    moving: '正在移動...',
    closeHint: '按 Esc 或點擊畫面外側即可關閉',
  },
  en: {
    title: 'Move to page',
    ariaLabel: 'Move to page',
    closeAriaLabel: 'Close',
    description: (count) => `Move ${count} selected elements to another page.`,
    moveFailed: 'Move failed.',
    noTargetsTitle: 'There are no other pages to move to.',
    noTargetsHint: 'Create a new page first.',
    untitledPage: 'Untitled page',
    homeBadge: 'Home',
    moving: 'Moving...',
    closeHint: 'Press Esc or click outside to close',
  },
};

export function getMoveToPageModalCopy(locale?: Locale | string | null): MoveToPageModalCopy {
  if (locale === 'ko') return COPY.ko;
  if (locale === 'zh-hant') return COPY['zh-hant'];
  return COPY.en;
}
