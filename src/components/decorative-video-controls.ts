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
  // WO-O22 B: the guidance languages reuse the labels their pack already ships
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
  ar: {
    pause: 'إيقاف الفيديو مؤقتًا',
    play: 'تشغيل الفيديو',
    replay: 'إعادة تشغيل الفيديو',
  },
  de: {
    pause: 'Video anhalten',
    play: 'Video abspielen',
    replay: 'Video erneut abspielen',
  },
  es: {
    pause: 'Pausar el vídeo',
    play: 'Reproducir el vídeo',
    replay: 'Volver a reproducir el vídeo',
  },
  fr: {
    pause: 'Mettre la vidéo en pause',
    play: 'Lire la vidéo',
    replay: 'Relire la vidéo',
  },
  pt: {
    pause: 'Pausar o vídeo',
    play: 'Reproduzir o vídeo',
    replay: 'Voltar a reproduzir o vídeo',
  },
  'zh-hans': {
    pause: '暂停影片',
    play: '播放影片',
    replay: '重新播放影片',
  },
  ms: {
    pause: 'Jeda video',
    play: 'Mainkan video',
    replay: 'Mainkan semula video',
  },
  ru: {
    pause: 'Приостановить видео',
    play: 'Воспроизвести видео',
    replay: 'Воспроизвести видео снова',
  },
  tr: {
    pause: 'Videoyu duraklat',
    play: 'Videoyu oynat',
    replay: 'Videoyu yeniden oynat',
  },
} as const satisfies Record<PublicLocale8, DecorativeVideoControlLabels>;
