import type {
  BuilderAudioCanvasNode,
  BuilderVideoCanvasNode,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type AudioProvider = BuilderAudioCanvasNode['content']['provider'];
type VideoMode = BuilderVideoCanvasNode['content']['mode'];

export const AUDIO_LEGACY_DEFAULTS = {
  title: 'Audio track',
} as const;

export function localizedAudioTitle(value: string | undefined, localized: string): string {
  const current = value ?? '';
  return current === AUDIO_LEGACY_DEFAULTS.title ? localized : current;
}

export interface MediaWidgetsCopy {
  audio: {
    fallbackTitle: string;
    fallbackArtist: string;
    emptyUrl: string;
    embedTitle: (provider: string) => string;
    providers: Record<AudioProvider, string>;
    inspector: {
      provider: string;
      sourceUrl: string;
      title: string;
      artist: string;
      showControls: string;
      autoplay: string;
    };
  };
  video: {
    backgroundBadge: string;
    thumbnailAlt: string;
    embedTitle: string;
    inspector: {
      url: string;
      urlPlaceholder: string;
      mode: string;
      modes: Record<VideoMode, string>;
      poster: string;
      posterPlaceholder: string;
      autoplay: string;
      loop: string;
      muted: string;
      showControls: string;
    };
  };
  lottie: {
    fallbackLabel: string;
    inspector: {
      url: string;
      urlPlaceholder: string;
      emptyHint: {
        spaceAfterSource: boolean;
        start: string;
        embedTab: string;
        middle: string;
        iframeUrl: string;
        end: string;
        host: string;
        spaceBeforeFinal: boolean;
        final: string;
      };
      unsupportedHostWarning: string;
      label: string;
      speed: (speed: number) => string;
      autoplay: string;
      loop: string;
    };
  };
}

const mediaWidgetsCopy: Record<Locale, MediaWidgetsCopy> = {
  ko: {
    audio: {
      fallbackTitle: '오디오 트랙',
      fallbackArtist: '빌더 오디오',
      emptyUrl: '오디오 URL을 입력하세요',
      embedTitle: (provider) => `${provider} 오디오 임베드`,
      providers: {
        file: '오디오 파일',
        spotify: 'Spotify',
        soundcloud: 'SoundCloud',
      },
      inspector: {
        provider: '공급자',
        sourceUrl: '소스 URL',
        title: '제목',
        artist: '아티스트 / 출처',
        showControls: '컨트롤 표시',
        autoplay: '자동 재생',
      },
    },
    video: {
      backgroundBadge: '배경 비디오',
      thumbnailAlt: '비디오 썸네일',
      embedTitle: '비디오 임베드',
      inspector: {
        url: '비디오 URL',
        urlPlaceholder: '/videos/intro.mp4 또는 https://youtu.be/...',
        mode: '모드',
        modes: {
          box: '비디오 박스',
          background: '배경 비디오',
        },
        poster: '포스터 / 썸네일',
        posterPlaceholder: '/images/video-poster.jpg',
        autoplay: '자동 재생',
        loop: '반복 재생',
        muted: '음소거',
        showControls: '컨트롤 표시',
      },
    },
    lottie: {
      fallbackLabel: 'Lottie 애니메이션',
      inspector: {
        url: 'Lottie URL',
        urlPlaceholder: 'https://lottie.host/embed/<id>/<hash>.lottie',
        emptyHint: {
          spaceAfterSource: false,
          start: '에서 애니메이션을 고른 뒤',
          embedTab: 'Embed',
          middle: '탭의',
          iframeUrl: 'iframe src="..."',
          end: 'URL을 복사해 붙여넣으세요. 자체 자산을 쓰려면',
          host: 'lottie.host',
          spaceBeforeFinal: true,
          final: '에 업로드한 후 동일한 형식의 임베드 URL을 사용하세요.',
        },
        unsupportedHostWarning: '외 호스트는 CSP가 차단합니다. 현재 URL은 미리보기로만 표시되고 발행된 페이지에서는 빈 placeholder가 됩니다.',
        label: '라벨',
        speed: (speed) => `속도 ${speed}x`,
        autoplay: '자동 재생',
        loop: '반복 재생',
      },
    },
  },
  'zh-hant': {
    audio: {
      fallbackTitle: '音訊軌',
      fallbackArtist: 'Builder 音訊',
      emptyUrl: '請輸入音訊 URL',
      embedTitle: (provider) => `${provider} 音訊嵌入`,
      providers: {
        file: '音訊檔案',
        spotify: 'Spotify',
        soundcloud: 'SoundCloud',
      },
      inspector: {
        provider: '服務商',
        sourceUrl: '來源 URL',
        title: '標題',
        artist: '藝人 / 來源',
        showControls: '顯示控制列',
        autoplay: '自動播放',
      },
    },
    video: {
      backgroundBadge: '背景影片',
      thumbnailAlt: '影片縮圖',
      embedTitle: '影片嵌入',
      inspector: {
        url: '影片 URL',
        urlPlaceholder: '/videos/intro.mp4 或 https://youtu.be/...',
        mode: '模式',
        modes: {
          box: '影片框',
          background: '背景影片',
        },
        poster: '封面 / 縮圖',
        posterPlaceholder: '/images/video-poster.jpg',
        autoplay: '自動播放',
        loop: '循環播放',
        muted: '靜音',
        showControls: '顯示控制列',
      },
    },
    lottie: {
      fallbackLabel: 'Lottie 動畫',
      inspector: {
        url: 'Lottie URL',
        urlPlaceholder: 'https://lottie.host/embed/<id>/<hash>.lottie',
        emptyHint: {
          spaceAfterSource: true,
          start: '選擇動畫後，複製',
          embedTab: 'Embed',
          middle: '分頁中的',
          iframeUrl: 'iframe src="..."',
          end: 'URL 並貼上。若要使用自有素材，請先上傳至',
          host: 'lottie.host',
          spaceBeforeFinal: false,
          final: '，再使用相同格式的嵌入 URL。',
        },
        unsupportedHostWarning: '以外的主機會被 CSP 阻擋。目前 URL 只會顯示為預覽，發布頁面會保留空白 placeholder。',
        label: '標籤',
        speed: (speed) => `速度 ${speed}x`,
        autoplay: '自動播放',
        loop: '循環播放',
      },
    },
  },
  en: {
    audio: {
      fallbackTitle: 'Audio track',
      fallbackArtist: 'Builder audio',
      emptyUrl: 'Enter an audio URL',
      embedTitle: (provider) => `${provider} audio embed`,
      providers: {
        file: 'Audio file',
        spotify: 'Spotify',
        soundcloud: 'SoundCloud',
      },
      inspector: {
        provider: 'Provider',
        sourceUrl: 'Source URL',
        title: 'Title',
        artist: 'Artist / source',
        showControls: 'Show controls',
        autoplay: 'Autoplay',
      },
    },
    video: {
      backgroundBadge: 'Background video',
      thumbnailAlt: 'Video thumbnail',
      embedTitle: 'Video embed',
      inspector: {
        url: 'Video URL',
        urlPlaceholder: '/videos/intro.mp4 or https://youtu.be/...',
        mode: 'Mode',
        modes: {
          box: 'Video box',
          background: 'Background video',
        },
        poster: 'Poster / thumbnail',
        posterPlaceholder: '/images/video-poster.jpg',
        autoplay: 'Autoplay',
        loop: 'Loop',
        muted: 'Muted',
        showControls: 'Show controls',
      },
    },
    lottie: {
      fallbackLabel: 'Lottie animation',
      inspector: {
        url: 'Lottie URL',
        urlPlaceholder: 'https://lottie.host/embed/<id>/<hash>.lottie',
        emptyHint: {
          spaceAfterSource: true,
          start: 'is where you can choose an animation, then copy the',
          embedTab: 'Embed',
          middle: 'tab',
          iframeUrl: 'iframe src="..."',
          end: 'URL and paste it here. To use your own asset, upload it to',
          host: 'lottie.host',
          spaceBeforeFinal: true,
          final: 'and use the same embed URL format.',
        },
        unsupportedHostWarning: 'hosts are blocked by CSP. This URL is shown as a preview only and will publish as an empty placeholder.',
        label: 'Label',
        speed: (speed) => `Speed ${speed}x`,
        autoplay: 'Autoplay',
        loop: 'Loop',
      },
    },
  },
};

export function getMediaWidgetsCopy(locale: Locale): MediaWidgetsCopy {
  return mediaWidgetsCopy[locale] ?? mediaWidgetsCopy.en;
}
