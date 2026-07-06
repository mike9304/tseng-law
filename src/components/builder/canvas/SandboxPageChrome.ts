'use client';

import type { CSSProperties } from 'react';
import type { ViewportMode } from '@/components/builder/canvas/SandboxTopBar';
import type { Locale } from '@/lib/locales';

export const TOAST_TTL_MS = 3000;
export const SAVE_BADGE_TTL_MS = 1600;

export const VIEWPORT_WIDTHS: Record<ViewportMode, number | null> = {
  desktop: 1280,
  tablet: 768,
  mobile: 375,
};

export type ToastTone = 'success' | 'error';
export type ToastOptions = {
  actionLabel?: string;
  onAction?: () => void;
  ttlMs?: number;
};

export interface SandboxToast {
  id: string;
  message: string;
  tone: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ActivityChip {
  id: string;
  message: string;
}

export interface DraftConflictCopy {
  message: string;
  reloadLabel: string;
}

export interface SandboxPageFeedbackCopy {
  currentPageNotLoaded: string;
  componentPresetAlreadyMatches: (presetLabel: string) => string;
  componentPresetNoTargets: string;
  componentPresetApplied: (presetLabel: string, count: number) => string;
  pastedItems: (count: number) => string;
  navItemNotFound: string;
  navNameSaved: string;
  navNameSaveFailed: string;
  navMoveUnavailable: string;
  navOrderSaved: string;
  navOrderSaveFailed: string;
  selectedContainerNotFound: string;
  savedSectionLoadFailed: string;
  savedSectionInvalid: string;
  savedSectionInsertFailed: string;
  savedSectionAdded: (name: string) => string;
  savedSectionAddError: string;
  savedSectionSaved: (name: string) => string;
  footerContactSettings: string;
  footerNavigationOpened: string;
  footerNavigationFallback: string;
  selectionSummaryMultiple: (count: number) => string;
  selectionSummaryNone: string;
}

export function getDraftConflictCopy(locale: Locale): DraftConflictCopy {
  if (locale === 'zh-hant') {
    return {
      message: '衝突 - 已在其他分頁儲存。請重新整理取得最新版，或先備份變更後再重新載入。',
      reloadLabel: '重新整理',
    };
  }

  if (locale === 'en') {
    return {
      message: 'Conflict - saved in another tab. Refresh to load the latest version, or back up your changes before reloading.',
      reloadLabel: 'Refresh',
    };
  }

  return {
    message: '충돌 - 다른 탭에서 저장됨. 새로고침해서 최신본을 가져오거나, 변경사항을 다른 곳에 백업한 뒤 다시 불러오세요.',
    reloadLabel: '새로고침',
  };
}

export function getSandboxPageFeedbackCopy(locale: Locale): SandboxPageFeedbackCopy {
  if (locale === 'zh-hant') {
    return {
      currentPageNotLoaded: '尚未載入目前頁面文件。',
      componentPresetAlreadyMatches: (presetLabel) => `${presetLabel} 預設已符合此頁面。`,
      componentPresetNoTargets: '目前頁面沒有可變更的 button/card/form 元素。',
      componentPresetApplied: (presetLabel, count) => `已將 ${presetLabel} 預設套用到 ${count} 個元件。`,
      pastedItems: (count) => `已貼上 ${count} 個項目`,
      navItemNotFound: '找不到選單項目。',
      navNameSaved: '已儲存選單名稱。',
      navNameSaveFailed: '儲存選單名稱失敗。',
      navMoveUnavailable: '無法再移動。',
      navOrderSaved: '已儲存選單順序。',
      navOrderSaveFailed: '儲存選單順序失敗。',
      selectedContainerNotFound: '找不到選取的容器。',
      savedSectionLoadFailed: '無法載入區段。',
      savedSectionInvalid: '區段資料無效。',
      savedSectionInsertFailed: '無法插入區段。',
      savedSectionAdded: (name) => `已新增「${name}」區段。`,
      savedSectionAddError: '新增區段時發生錯誤。',
      savedSectionSaved: (name) => `已儲存「${name}」區段。`,
      footerContactSettings: '請在網站設定中編輯頁尾聯絡連結。',
      footerNavigationOpened: '已在導覽中開啟頁尾連結。',
      footerNavigationFallback: '頁尾連結會留在編輯器中。請使用導覽進行編輯。',
      selectionSummaryMultiple: (count) => `${count} 個節點`,
      selectionSummaryNone: '未選取',
    };
  }

  if (locale === 'en') {
    return {
      currentPageNotLoaded: 'The current page document has not loaded yet.',
      componentPresetAlreadyMatches: (presetLabel) => `${presetLabel} preset already matches this page.`,
      componentPresetNoTargets: 'There are no button, card, or form elements to update on this page.',
      componentPresetApplied: (presetLabel, count) => `${presetLabel} preset applied to ${count} components.`,
      pastedItems: (count) => `Pasted ${count} item${count === 1 ? '' : 's'}`,
      navItemNotFound: 'Menu item not found.',
      navNameSaved: 'Menu name saved.',
      navNameSaveFailed: 'Failed to save menu name.',
      navMoveUnavailable: 'Cannot move any further.',
      navOrderSaved: 'Menu order saved.',
      navOrderSaveFailed: 'Failed to save menu order.',
      selectedContainerNotFound: 'Selected container not found.',
      savedSectionLoadFailed: 'Could not load the section.',
      savedSectionInvalid: 'Section data is invalid.',
      savedSectionInsertFailed: 'Could not insert the section.',
      savedSectionAdded: (name) => `Added "${name}" section.`,
      savedSectionAddError: 'Section add error.',
      savedSectionSaved: (name) => `Saved "${name}" section.`,
      footerContactSettings: 'Edit footer contact links in Site settings.',
      footerNavigationOpened: 'Footer link opened in Navigation.',
      footerNavigationFallback: 'Footer links stay in the editor. Use Navigation to edit them.',
      selectionSummaryMultiple: (count) => `${count} nodes`,
      selectionSummaryNone: 'none',
    };
  }

  return {
    currentPageNotLoaded: '현재 페이지 문서를 아직 불러오지 못했습니다.',
    componentPresetAlreadyMatches: (presetLabel) => `${presetLabel} 프리셋이 이미 이 페이지와 일치합니다.`,
    componentPresetNoTargets: '현재 페이지에 변경할 button/card/form 요소가 없습니다.',
    componentPresetApplied: (presetLabel, count) => `${presetLabel} 프리셋을 ${count}개 컴포넌트에 적용했습니다.`,
    pastedItems: (count) => `${count}개 항목을 붙여넣었습니다.`,
    navItemNotFound: '메뉴 항목을 찾을 수 없습니다.',
    navNameSaved: '메뉴 이름을 저장했습니다.',
    navNameSaveFailed: '메뉴 이름 저장에 실패했습니다.',
    navMoveUnavailable: '더 이동할 수 없습니다.',
    navOrderSaved: '메뉴 순서를 저장했습니다.',
    navOrderSaveFailed: '메뉴 순서 저장에 실패했습니다.',
    selectedContainerNotFound: '선택한 컨테이너를 찾을 수 없습니다.',
    savedSectionLoadFailed: '섹션을 불러오지 못했습니다.',
    savedSectionInvalid: '섹션 데이터가 올바르지 않습니다.',
    savedSectionInsertFailed: '섹션을 삽입할 수 없습니다.',
    savedSectionAdded: (name) => `"${name}" 섹션을 추가했습니다.`,
    savedSectionAddError: '섹션 추가 오류',
    savedSectionSaved: (name) => `"${name}" 섹션을 저장했습니다.`,
    footerContactSettings: '푸터 연락처 링크는 사이트 설정에서 편집하세요.',
    footerNavigationOpened: '푸터 링크를 내비게이션에서 열었습니다.',
    footerNavigationFallback: '푸터 링크는 편집기 안에 유지됩니다. 내비게이션에서 편집하세요.',
    selectionSummaryMultiple: (count) => `${count}개 노드`,
    selectionSummaryNone: '없음',
  };
}

export function getPublicChromeCopy(locale: Locale) {
  if (locale === 'zh-hant') {
    return {
      label: '公共浮動工具',
    };
  }

  if (locale === 'en') {
    return {
      label: 'Public floating tools',
    };
  }

  return {
    label: '공개 사이트 플로팅 도구',
  };
}

export const conflictBannerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 16px',
  borderBottom: '1px solid #fecaca',
  background: '#fef2f2',
  color: '#991b1b',
  fontSize: '0.84rem',
  fontWeight: 600,
};

export const conflictReloadButtonStyle: CSSProperties = {
  flexShrink: 0,
  border: '1px solid #991b1b',
  borderRadius: 6,
  background: '#fff',
  color: '#991b1b',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 700,
  padding: '6px 10px',
};
