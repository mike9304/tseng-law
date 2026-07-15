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
  heading: string;
  message: string;
  expectedRevisionLabel: string;
  currentRevisionLabel: string;
  currentSavedAtLabel: string;
  unknownValue: string;
  recoveryLabel: string;
  recoveryBytesLabel: string;
  recoveryChecksumLabel: string;
  serverLatestLabel: string;
  serverLatestDescription: string;
  saveLocalLabel: string;
  saveLocalUnavailableReason: string;
  downloadLocalLabel: string;
  downloadPendingLabel: string;
  serverPendingLabel: string;
  navigationBlockedReason: string;
  publishBlockedReason: string;
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

export function isBuilderAdminNavigationHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith('#')) return false;
  try {
    const pathname = new URL(trimmed, 'https://builder.local').pathname;
    return /(?:^|\/)admin-builder(?:\/|$)/.test(pathname);
  } catch {
    return false;
  }
}

export function getDraftConflictCopy(locale: Locale): DraftConflictCopy {
  if (locale === 'zh-hant') {
    return {
      heading: '草稿版本衝突',
      message: '伺服器已有較新的草稿。本機編輯尚未同步，已被安全保留，解決衝突前不會自動儲存或切換頁面。',
      expectedRevisionLabel: '本機原預期版本',
      currentRevisionLabel: '目前伺服器版本',
      currentSavedAtLabel: '伺服器儲存時間',
      unknownValue: '未知',
      recoveryLabel: '本機復原副本',
      recoveryBytesLabel: '位元組',
      recoveryChecksumLabel: 'SHA-256',
      serverLatestLabel: '使用伺服器最新版',
      serverLatestDescription: '載入前會先下載目前本機草稿的精確備份。',
      saveLocalLabel: '儲存我的版本',
      saveLocalUnavailableReason: '尚未提供具冪等鍵的原子版本比較 API，因此為避免覆蓋他人變更，此動作目前停用。',
      downloadLocalLabel: '下載本機備份',
      downloadPendingLabel: '正在準備備份…',
      serverPendingLabel: '正在保留本機草稿並載入…',
      navigationBlockedReason: '請先解決草稿版本衝突，再切換頁面、語言或管理功能。',
      publishBlockedReason: '草稿版本衝突尚未解決，因此無法發佈或排程發佈。',
    };
  }

  if (locale === 'en') {
    return {
      heading: 'Draft version conflict',
      message: 'A newer draft exists on the server. Your unsynced local edit is preserved and autosave and navigation are stopped until you resolve the conflict.',
      expectedRevisionLabel: 'Locally expected revision',
      currentRevisionLabel: 'Current server revision',
      currentSavedAtLabel: 'Server saved at',
      unknownValue: 'Unknown',
      recoveryLabel: 'Local recovery copy',
      recoveryBytesLabel: 'bytes',
      recoveryChecksumLabel: 'SHA-256',
      serverLatestLabel: 'Use server latest',
      serverLatestDescription: 'An exact backup of the current local draft is downloaded before the server draft is loaded.',
      saveLocalLabel: 'Save my version',
      saveLocalUnavailableReason: 'This action is disabled until the API supports an atomic revision comparison with an idempotency key, so another editor’s work cannot be overwritten.',
      downloadLocalLabel: 'Download local backup',
      downloadPendingLabel: 'Preparing backup…',
      serverPendingLabel: 'Preserving local draft and loading…',
      navigationBlockedReason: 'Resolve the draft version conflict before changing page, locale, or admin section.',
      publishBlockedReason: 'Publishing and scheduled publishing are disabled until the draft version conflict is resolved.',
    };
  }

  return {
    heading: '초안 버전 충돌',
    message: '서버에 더 최신 초안이 있습니다. 동기화되지 않은 로컬 편집본은 안전하게 보존되며, 충돌을 해결하기 전까지 자동 저장과 이동이 중단됩니다.',
    expectedRevisionLabel: '로컬 예상 리비전',
    currentRevisionLabel: '현재 서버 리비전',
    currentSavedAtLabel: '서버 저장 시각',
    unknownValue: '알 수 없음',
    recoveryLabel: '로컬 복구본',
    recoveryBytesLabel: '바이트',
    recoveryChecksumLabel: 'SHA-256',
    serverLatestLabel: '서버 최신본 사용',
    serverLatestDescription: '서버 초안을 불러오기 전에 현재 로컬 초안의 정확한 백업을 먼저 다운로드합니다.',
    saveLocalLabel: '내 버전 저장',
    saveLocalUnavailableReason: '다른 편집자의 변경을 덮어쓰지 않도록, 멱등 키가 포함된 원자적 리비전 비교 API가 제공될 때까지 이 동작은 비활성화됩니다.',
    downloadLocalLabel: '로컬 백업 다운로드',
    downloadPendingLabel: '백업 준비 중…',
    serverPendingLabel: '로컬 초안 보존 및 불러오기 중…',
    navigationBlockedReason: '초안 버전 충돌을 먼저 해결한 뒤 페이지·언어·관리 메뉴를 이동하세요.',
    publishBlockedReason: '초안 버전 충돌을 해결하기 전에는 발행과 예약 발행을 사용할 수 없습니다.',
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
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: 12,
  padding: '14px 16px',
  borderBottom: '1px solid #fecaca',
  background: '#fef2f2',
  color: '#991b1b',
  fontSize: '0.84rem',
  fontWeight: 600,
};

export const conflictReloadButtonStyle: CSSProperties = {
  border: '1px solid #991b1b',
  borderRadius: 6,
  background: '#fff',
  color: '#991b1b',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 700,
  padding: '6px 10px',
};

export const conflictDisabledButtonStyle: CSSProperties = {
  ...conflictReloadButtonStyle,
  borderColor: '#d6a7a7',
  color: '#9f6b6b',
  cursor: 'not-allowed',
  opacity: 0.72,
};

export const conflictActionsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

export const conflictDetailsStyle: CSSProperties = {
  display: 'grid',
  gap: 4,
  margin: 0,
  fontSize: '0.76rem',
  fontWeight: 500,
};
