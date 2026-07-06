'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { PaymentAnalyticsSummary } from '@/lib/builder/payment-analytics';
import {
  buildPaymentAnalyticsReportFilename,
  buildPaymentAnalyticsTrendCsvFilename,
  serializePaymentAnalyticsReportFile,
  serializePaymentAnalyticsTrendCsv,
} from '@/lib/builder/payment-analytics';

function downloadText(filename: string, text: string, mimeType: string): void {
  const link = document.createElement('a');
  const url = URL.createObjectURL(new Blob([text], { type: `${mimeType};charset=utf-8` }));
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const COPY = {
  ko: {
    exportJson: 'JSON 내보내기',
    exportTrendCsv: '추세 CSV 내보내기',
    exporting: '내보내는 중…',
  },
  'zh-hant': {
    exportJson: '匯出 JSON',
    exportTrendCsv: '匯出趨勢 CSV',
    exporting: '匯出中…',
  },
  en: {
    exportJson: 'Export JSON',
    exportTrendCsv: 'Export trend CSV',
    exporting: 'Exporting…',
  },
} satisfies Record<Locale, { exportJson: string; exportTrendCsv: string; exporting: string }>;

export default function PaymentAnalyticsExportClient({ summary, locale }: { summary: PaymentAnalyticsSummary; locale: Locale }) {
  const copy = COPY[locale];
  const [reporting, setReporting] = useState(false);
  const [csvReporting, setCsvReporting] = useState(false);

  const exportReport = () => {
    if (reporting) return;
    setReporting(true);
    try {
      downloadText(buildPaymentAnalyticsReportFilename(), serializePaymentAnalyticsReportFile(summary), 'application/json');
    } finally {
      setReporting(false);
    }
  };

  const exportTrendCsv = () => {
    if (csvReporting) return;
    setCsvReporting(true);
    try {
      downloadText(buildPaymentAnalyticsTrendCsvFilename(), serializePaymentAnalyticsTrendCsv(summary), 'text/csv');
    } finally {
      setCsvReporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <button type="button" data-payment-analytics-export="json" onClick={exportReport}>
        {reporting ? copy.exporting : copy.exportJson}
      </button>
      <button type="button" data-payment-analytics-export="csv" onClick={exportTrendCsv}>
        {csvReporting ? copy.exporting : copy.exportTrendCsv}
      </button>
    </div>
  );
}
