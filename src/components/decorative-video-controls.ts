import type { PublicLocale8 } from '@/lib/public-guidance';

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
  // WO-O22 B: the new four reuse the labels their guidance pack already ships
  // (`guidanceContent[locale].home.video*Label`), so the cinematic opening's
  // video controls are announced in the page language without new copy.
  vi: {
    pause: 'Tạm dừng video',
    play: 'Phát video',
    replay: 'Phát lại video',
  },
  id: {
    pause: 'Jeda video',
    play: 'Putar video',
    replay: 'Putar ulang video',
  },
  th: {
    pause: 'หยุดวิดีโอชั่วคราว',
    play: 'เล่นวิดีโอ',
    replay: 'เล่นวิดีโออีกครั้ง',
  },
  fil: {
    pause: 'I-pause ang video',
    play: 'I-play ang video',
    replay: 'I-play muli ang video',
  },
} as const satisfies Record<PublicLocale8, DecorativeVideoControlLabels>;
