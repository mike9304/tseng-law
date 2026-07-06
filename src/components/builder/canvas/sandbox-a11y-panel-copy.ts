import type { Locale } from '@/lib/locales';

export type A11yPanelSummaryCounts = {
  total: number;
  error: number;
  warning: number;
  info: number;
};

export type SandboxA11yPanelCopy = {
  passMessage: string;
  pageKindLabel: string;
  summaryLabel: (counts: A11yPanelSummaryCounts) => string;
};

function joinSummaryParts(parts: string[]): string {
  return parts.length > 0 ? ` (${parts.join(', ')})` : '';
}

const COPY: Record<'ko' | 'zh-hant' | 'en', SandboxA11yPanelCopy> = {
  ko: {
    passMessage: '접근성 검사 통과!',
    pageKindLabel: '페이지',
    summaryLabel: ({ total, error, warning, info }) => {
      const parts = [
        error > 0 ? `오류 ${error}` : '',
        warning > 0 ? `경고 ${warning}` : '',
        info > 0 ? `정보 ${info}` : '',
      ].filter(Boolean);
      return `이슈 ${total}개${joinSummaryParts(parts)}`;
    },
  },
  'zh-hant': {
    passMessage: '已通過無障礙檢查！',
    pageKindLabel: '頁面',
    summaryLabel: ({ total, error, warning, info }) => {
      const parts = [
        error > 0 ? `錯誤 ${error}` : '',
        warning > 0 ? `警告 ${warning}` : '',
        info > 0 ? `資訊 ${info}` : '',
      ].filter(Boolean);
      return `${total} 個問題${joinSummaryParts(parts)}`;
    },
  },
  en: {
    passMessage: 'Accessibility check passed.',
    pageKindLabel: 'Page',
    summaryLabel: ({ total, error, warning, info }) => {
      const parts = [
        error > 0 ? `${error} error${error === 1 ? '' : 's'}` : '',
        warning > 0 ? `${warning} warning${warning === 1 ? '' : 's'}` : '',
        info > 0 ? `${info} info` : '',
      ].filter(Boolean);
      return `${total} issue${total === 1 ? '' : 's'}${joinSummaryParts(parts)}`;
    },
  },
};

export function getSandboxA11yPanelCopy(locale: Locale): SandboxA11yPanelCopy {
  return COPY[locale] ?? COPY.en;
}
