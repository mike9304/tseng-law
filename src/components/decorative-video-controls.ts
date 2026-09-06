import type { SiteLocale } from '@/lib/locales';

export type DecorativeVideoControlLabels = {
  pause: string;
  play: string;
  replay: string;
};

export const DECORATIVE_VIDEO_CONTROL_LABELS = {
  ko: {
    pause: '영상 일시정지',
    play: '영상 재생',
    replay: '영상 다시 보기',
  },
  'zh-hant': {
    pause: '暫停影片',
    play: '播放影片',
    replay: '重新播放影片',
  },
  en: {
    pause: 'Pause video',
    play: 'Play video',
    replay: 'Replay video',
  },
  ja: {
    pause: '動画を一時停止',
    play: '動画を再生',
    replay: '動画をもう一度再生',
  },
} as const satisfies Record<SiteLocale, DecorativeVideoControlLabels>;
