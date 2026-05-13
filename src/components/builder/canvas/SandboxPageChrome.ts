'use client';

import type { CSSProperties } from 'react';
import type { ViewportMode } from '@/components/builder/canvas/SandboxTopBar';
import type { Locale } from '@/lib/locales';

export const TOAST_TTL_MS = 3000;
export const SAVE_BADGE_TTL_MS = 1600;

export const VIEWPORT_WIDTHS: Record<ViewportMode, number | null> = {
  desktop: null,
  tablet: 768,
  mobile: 375,
};

export type PublicChromePanel = 'chat' | 'event' | null;
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

export function getPublicChromeCopy(locale: Locale) {
  if (locale === 'zh-hant') {
    return {
      label: '公共浮動工具',
      chat: 'AI 諮詢',
      event: '2026 EVENT',
      top: '回到頂部',
      chatTitle: 'AI 諮詢',
      chatBody: '此浮動入口會在正式網站右下角顯示，連接公開 AI 諮詢視窗。',
      eventTitle: '2026年紀念評論活動',
      eventBody: '正式網站首次造訪時顯示的評論活動彈窗。',
      editSettings: '網站設定',
      editColumns: '專欄管理',
    };
  }

  if (locale === 'en') {
    return {
      label: 'Public floating tools',
      chat: 'AI Chat',
      event: '2026 EVENT',
      top: 'Back to top',
      chatTitle: 'AI Chat',
      chatBody: 'This floating entry appears on the public site and opens the AI consultation chat.',
      eventTitle: '2026 Commemorative Review Event',
      eventBody: 'The public event popup shown to first-time visitors before they dismiss it.',
      editSettings: 'Site settings',
      editColumns: 'Columns',
    };
  }

  return {
    label: '공개 사이트 플로팅 도구',
    chat: 'AI 상담',
    event: '2026 EVENT',
    top: '상단',
    chatTitle: 'AI 상담',
    chatBody: '실제 사이트 우측 하단에 뜨는 공개 AI 상담 진입 버튼입니다.',
    eventTitle: '2026년 기념 리뷰 이벤트',
    eventBody: '방문자에게 표시되는 리뷰 이벤트 팝업입니다.',
    editSettings: '사이트 설정',
    editColumns: '칼럼 관리',
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
