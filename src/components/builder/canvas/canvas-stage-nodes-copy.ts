import type { Locale } from '@/lib/locales';

export type CanvasStageNodesCopy = {
  emptyCanvasTitle: string;
  emptyCanvasBody: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', CanvasStageNodesCopy> = {
  ko: {
    emptyCanvasTitle: '페이지가 비어있습니다.',
    emptyCanvasBody: '좌측 + 패널에서 텍스트, 이미지, 섹션을 추가하세요.',
  },
  'zh-hant': {
    emptyCanvasTitle: '頁面是空的。',
    emptyCanvasBody: '從左側 + 面板新增文字、圖片或區段。',
  },
  en: {
    emptyCanvasTitle: 'This page is empty.',
    emptyCanvasBody: 'Add text, images, or sections from the + panel on the left.',
  },
};

export function getCanvasStageNodesCopy(locale: Locale): CanvasStageNodesCopy {
  return COPY[locale] ?? COPY.en;
}
