import type { Locale } from '@/lib/locales';

export type CanvasStageToolbarCopy = {
  gridSnapTitle: string;
  gridButtonLabel: string;
  gridSizeTitle: string;
  gridSizeAriaLabel: string;
  undoTitle: string;
  undoButtonLabel: string;
  redoTitle: string;
  redoButtonLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', CanvasStageToolbarCopy> = {
  ko: {
    gridSnapTitle: '그리드 스냅',
    gridButtonLabel: '그리드',
    gridSizeTitle: '그리드 크기',
    gridSizeAriaLabel: '그리드 크기',
    undoTitle: '실행 취소',
    undoButtonLabel: '실행 취소',
    redoTitle: '다시 실행',
    redoButtonLabel: '다시 실행',
  },
  'zh-hant': {
    gridSnapTitle: '格線吸附',
    gridButtonLabel: '格線',
    gridSizeTitle: '格線大小',
    gridSizeAriaLabel: '格線大小',
    undoTitle: '復原',
    undoButtonLabel: '復原',
    redoTitle: '重做',
    redoButtonLabel: '重做',
  },
  en: {
    gridSnapTitle: 'Snap to grid',
    gridButtonLabel: 'Grid',
    gridSizeTitle: 'Grid size',
    gridSizeAriaLabel: 'Grid size',
    undoTitle: 'Undo',
    undoButtonLabel: 'Undo',
    redoTitle: 'Redo',
    redoButtonLabel: 'Redo',
  },
};

export function getCanvasStageToolbarCopy(locale: Locale): CanvasStageToolbarCopy {
  return COPY[locale] ?? COPY.en;
}
