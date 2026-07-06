import type { Locale } from '@/lib/locales';

export type PreviewDeviceMode = 'desktop' | 'tablet' | 'mobile';

export interface PreviewModalCopy {
  ariaLabel: string;
  title: string;
  deviceGroupAriaLabel: string;
  deviceLabels: Record<PreviewDeviceMode, string>;
  reloadLabel: string;
  reloadTitle: string;
  openInNewTabLabel: string;
  openInNewTabTitle: string;
  closeAriaLabel: string;
  closeTitle: string;
  iframeTitle: (deviceLabel: string) => string;
  loadingMessage: string;
  unpublishedMessage: string;
  browserChromeLabel: string;
  footerSummary: (width: number, height: number, scalePercent: number) => string;
}

const COPY: Record<Locale | 'en', PreviewModalCopy> = {
  ko: {
    ariaLabel: '페이지 미리보기',
    title: '미리보기',
    deviceGroupAriaLabel: '디바이스 선택',
    deviceLabels: {
      desktop: '데스크톱',
      tablet: '태블릿',
      mobile: '모바일',
    },
    reloadLabel: '새로고침',
    reloadTitle: '새로고침 (⌘R)',
    openInNewTabLabel: '새 탭',
    openInNewTabTitle: '새 탭에서 열기',
    closeAriaLabel: '미리보기 닫기',
    closeTitle: '닫기 (Esc)',
    iframeTitle: (deviceLabel) => `${deviceLabel} 미리보기`,
    loadingMessage: '미리보기 로딩 중',
    unpublishedMessage: '먼저 페이지를 발행해야 미리보기가 가능합니다.',
    browserChromeLabel: '미리보기',
    footerSummary: (width, height, scalePercent) => (
      `${width} × ${height}px · 스케일 ${scalePercent}% · Esc 또는 외곽 클릭으로 닫기`
    ),
  },
  'zh-hant': {
    ariaLabel: '頁面預覽',
    title: '預覽',
    deviceGroupAriaLabel: '選擇裝置',
    deviceLabels: {
      desktop: '桌面',
      tablet: '平板',
      mobile: '手機',
    },
    reloadLabel: '重新整理',
    reloadTitle: '重新整理 (⌘R)',
    openInNewTabLabel: '新分頁',
    openInNewTabTitle: '在新分頁開啟',
    closeAriaLabel: '關閉預覽',
    closeTitle: '關閉 (Esc)',
    iframeTitle: (deviceLabel) => `${deviceLabel}預覽`,
    loadingMessage: '正在載入預覽',
    unpublishedMessage: '請先發佈頁面才能預覽。',
    browserChromeLabel: '預覽',
    footerSummary: (width, height, scalePercent) => (
      `${width} × ${height}px · 縮放 ${scalePercent}% · 按 Esc 或點擊外側即可關閉`
    ),
  },
  en: {
    ariaLabel: 'Page preview',
    title: 'Preview',
    deviceGroupAriaLabel: 'Device selection',
    deviceLabels: {
      desktop: 'Desktop',
      tablet: 'Tablet',
      mobile: 'Mobile',
    },
    reloadLabel: 'Reload',
    reloadTitle: 'Reload (⌘R)',
    openInNewTabLabel: 'New tab',
    openInNewTabTitle: 'Open in new tab',
    closeAriaLabel: 'Close preview',
    closeTitle: 'Close (Esc)',
    iframeTitle: (deviceLabel) => `${deviceLabel} preview`,
    loadingMessage: 'Loading preview',
    unpublishedMessage: 'Publish the page before previewing it.',
    browserChromeLabel: 'preview',
    footerSummary: (width, height, scalePercent) => (
      `${width} × ${height}px · scale ${scalePercent}% · Esc or outside click to close`
    ),
  },
};

export function getPreviewModalCopy(locale?: Locale | string | null): PreviewModalCopy {
  if (locale === 'ko') return COPY.ko;
  if (locale === 'zh-hant') return COPY['zh-hant'];
  return COPY.en;
}
