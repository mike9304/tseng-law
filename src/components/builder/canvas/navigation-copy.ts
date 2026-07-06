import type { Locale } from '@/lib/locales';

type NavigationCopy = {
  title: string;
  addButton: string;
  loading: string;
  emptyState: string;
  itemCountLabel: (count: number) => string;
  labels: {
    label: string;
    href: string;
    path: string;
  };
  placeholders: {
    label: string;
    href: string;
  };
  actions: {
    moveUp: string;
    moveDown: string;
    addChild: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
  };
  titles: {
    moveUp: string;
    moveDown: string;
    addChild: string;
    edit: string;
    delete: string;
    megaBadge: string;
    newItem: string;
    newSubmenu: string;
    untitled: string;
    saveError: string;
    saving: string;
  };
};

const COPY: Record<'ko' | 'zh-hant' | 'en', NavigationCopy> = {
  ko: {
    title: '내비게이션',
    addButton: '추가',
    loading: '불러오는 중...',
    emptyState: '항목 없음',
    itemCountLabel: (count) => `${count}개 메뉴`,
    labels: {
      label: '라벨',
      href: '경로',
      path: '경로',
    },
    placeholders: {
      label: '메뉴에 표시할 텍스트 · 예: 회사소개',
      href: '전체 경로 · 예: /ko/about (홈 "/" 제외)',
    },
    actions: {
      moveUp: '위로',
      moveDown: '아래로',
      addChild: '하위 메뉴 추가',
      edit: '편집',
      delete: '삭제',
      save: '저장',
      cancel: '취소',
    },
    titles: {
      moveUp: '위로',
      moveDown: '아래로',
      addChild: '하위 메뉴 추가',
      edit: '편집',
      delete: '삭제',
      megaBadge: 'Mega',
      newItem: '새 항목',
      newSubmenu: '새 하위 메뉴',
      untitled: '제목 없음',
      saveError: '메뉴 저장에 실패했습니다.',
      saving: '저장 중...',
    },
  },
  'zh-hant': {
    title: '導覽',
    addButton: '新增',
    loading: '載入中...',
    emptyState: '沒有項目',
    itemCountLabel: (count) => `${count} 個選單`,
    labels: {
      label: '標籤',
      href: '路徑',
      path: '路徑',
    },
    placeholders: {
      label: '選單顯示的文字 · 例：關於我們',
      href: '完整路徑 · 例：/zh-hant/about（首頁 "/" 除外）',
    },
    actions: {
      moveUp: '上移',
      moveDown: '下移',
      addChild: '新增子選單',
      edit: '編輯',
      delete: '刪除',
      save: '儲存',
      cancel: '取消',
    },
    titles: {
      moveUp: '上移',
      moveDown: '下移',
      addChild: '新增子選單',
      edit: '編輯',
      delete: '刪除',
      megaBadge: 'Mega',
      newItem: '新項目',
      newSubmenu: '新子選單',
      untitled: '未命名',
      saveError: '儲存導覽失敗。',
      saving: '儲存中...',
    },
  },
  en: {
    title: 'Navigation',
    addButton: 'Add',
    loading: 'Loading...',
    emptyState: 'No items',
    itemCountLabel: (count) => `${count} ${count === 1 ? 'item' : 'items'}`,
    labels: {
      label: 'Label',
      href: 'Path',
      path: 'Path',
    },
    placeholders: {
      label: 'Text shown in the menu · e.g. About us',
      href: 'Full path · e.g. /en/about (home "/" excluded)',
    },
    actions: {
      moveUp: 'Move up',
      moveDown: 'Move down',
      addChild: 'Add submenu',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
    },
    titles: {
      moveUp: 'Move up',
      moveDown: 'Move down',
      addChild: 'Add submenu',
      edit: 'Edit',
      delete: 'Delete',
      megaBadge: 'Mega',
      newItem: 'New item',
      newSubmenu: 'New submenu item',
      untitled: 'Untitled',
      saveError: 'Failed to save navigation.',
      saving: 'Saving...',
    },
  },
};

export function getNavigationCopy(locale: Locale): NavigationCopy {
  return COPY[locale as 'ko' | 'zh-hant' | 'en'] ?? COPY.en;
}
