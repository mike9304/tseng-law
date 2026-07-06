import type { Locale } from '@/lib/locales';

export type CanvasZoomDockCopy = {
  zoomOutTitle: string;
  zoomInTitle: string;
  zoomAriaLabel: string;
  fitTitle: string;
  fitButtonLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', CanvasZoomDockCopy> = {
  ko: {
    zoomOutTitle: '축소',
    zoomInTitle: '확대',
    zoomAriaLabel: '캔버스 확대/축소',
    fitTitle: '화면에 맞추기',
    fitButtonLabel: '맞춤',
  },
  'zh-hant': {
    zoomOutTitle: '縮小',
    zoomInTitle: '放大',
    zoomAriaLabel: '畫布縮放',
    fitTitle: '符合畫面',
    fitButtonLabel: '符合',
  },
  en: {
    zoomOutTitle: 'Zoom out',
    zoomInTitle: 'Zoom in',
    zoomAriaLabel: 'Canvas zoom',
    fitTitle: 'Fit to screen',
    fitButtonLabel: 'Fit',
  },
};

export function getCanvasZoomDockCopy(locale: Locale): CanvasZoomDockCopy {
  return COPY[locale] ?? COPY.en;
}
