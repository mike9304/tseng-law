import type {
  BuilderShareButtonsCanvasNode,
  BuilderSocialBarCanvasNode,
  BuilderSocialEmbedCanvasNode,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type SocialBarProvider = BuilderSocialBarCanvasNode['content']['items'][number]['provider'];
type ShareProvider = BuilderShareButtonsCanvasNode['content']['providers'][number];
type SocialEmbedProvider = BuilderSocialEmbedCanvasNode['content']['provider'];
type SocialLayout = BuilderSocialBarCanvasNode['content']['layout'];
type SocialBarStyle = BuilderSocialBarCanvasNode['content']['style'];
type SocialEmbedLayout = BuilderSocialEmbedCanvasNode['content']['layout'];

export interface SocialWidgetsCopy {
  layouts: Record<SocialLayout, string>;
  providers: Record<SocialBarProvider, string>;
  shareProviders: Record<ShareProvider, string>;
  socialBar: {
    navLabel: string;
    inspector: {
      items: string;
      layout: string;
      style: string;
      styles: Record<SocialBarStyle, string>;
      size: string;
      color: string;
    };
  };
  shareButtons: {
    defaultTitle: string;
    inspector: {
      title: string;
      providerSelection: string;
      layout: string;
      size: string;
    };
  };
  socialEmbed: {
    editPlaceholder: (provider: string) => string;
    editSdkHint: string;
    handleFallback: string;
    unavailableTitle: string;
    unavailableMessage: string;
    providers: Record<SocialEmbedProvider, string>;
    layouts: Record<SocialEmbedLayout, string>;
    inspector: {
      provider: string;
      handle: string;
      layout: string;
      count: string;
      showHeader: string;
    };
  };
}

export const SHARE_BUTTONS_LEGACY_DEFAULTS = {
  title: '공유하기',
} as const;

export function localizedSocialWidgetText(
  value: string | undefined,
  localized: string,
  legacyDefault: string,
): string {
  const current = value ?? '';
  return current === legacyDefault ? localized : current;
}

const socialWidgetsCopy: Record<Locale, SocialWidgetsCopy> = {
  ko: {
    layouts: {
      row: '가로',
      column: '세로',
    },
    providers: {
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter',
      threads: 'Threads',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      whatsapp: 'WhatsApp',
      line: 'LINE',
      kakao: '카카오',
      naver: '네이버',
      x: 'X',
    },
    shareProviders: {
      copy: '링크 복사',
      facebook: 'Facebook',
      twitter: 'Twitter',
      kakao: '카카오',
      line: 'LINE',
      whatsapp: 'WhatsApp',
      email: '이메일',
    },
    socialBar: {
      navLabel: '소셜 링크',
      inspector: {
        items: '항목 (provider | href)',
        layout: '배치',
        style: '스타일',
        styles: {
          plain: '기본',
          solid: '채움',
          outline: '외곽선',
        },
        size: '크기',
        color: '색상',
      },
    },
    shareButtons: {
      defaultTitle: SHARE_BUTTONS_LEGACY_DEFAULTS.title,
      inspector: {
        title: '제목',
        providerSelection: '공급자 선택',
        layout: '배치',
        size: '크기',
      },
    },
    socialEmbed: {
      editPlaceholder: (provider) => `${provider} 외부 임베드 자리`,
      editSdkHint: '공개 페이지에서 SDK 로드',
      handleFallback: '@핸들',
      unavailableTitle: '외부 피드 연결 안 됨',
      unavailableMessage:
        '연결된 소셜 공급자가 없어 실시간 피드를 표시할 수 없어요. 공급자를 연결하면 게시물이 이 영역에 표시됩니다.',
      providers: {
        'instagram-feed': 'Instagram 피드',
        'youtube-subscribe': 'YouTube 구독',
        'linkedin-follow': 'LinkedIn 팔로우',
        'tiktok-feed': 'TikTok 피드',
      },
      layouts: {
        grid: '그리드',
        list: '리스트',
      },
      inspector: {
        provider: '공급자',
        handle: '핸들 / Channel ID',
        layout: '레이아웃',
        count: '개수',
        showHeader: '헤더 표시',
      },
    },
  },
  'zh-hant': {
    layouts: {
      row: '橫向',
      column: '直向',
    },
    providers: {
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter',
      threads: 'Threads',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      whatsapp: 'WhatsApp',
      line: 'LINE',
      kakao: 'Kakao',
      naver: 'Naver',
      x: 'X',
    },
    shareProviders: {
      copy: '複製連結',
      facebook: 'Facebook',
      twitter: 'Twitter',
      kakao: 'Kakao',
      line: 'LINE',
      whatsapp: 'WhatsApp',
      email: '電子郵件',
    },
    socialBar: {
      navLabel: '社群連結',
      inspector: {
        items: '項目（provider | href）',
        layout: '排列',
        style: '樣式',
        styles: {
          plain: '基本',
          solid: '填滿',
          outline: '外框',
        },
        size: '尺寸',
        color: '顏色',
      },
    },
    shareButtons: {
      defaultTitle: '分享',
      inspector: {
        title: '標題',
        providerSelection: '選擇服務商',
        layout: '排列',
        size: '尺寸',
      },
    },
    socialEmbed: {
      editPlaceholder: (provider) => `${provider} 外部嵌入區塊`,
      editSdkHint: '公開頁面會載入 SDK',
      handleFallback: '@帳號',
      unavailableTitle: '外部動態未連接',
      unavailableMessage:
        '尚未連接社群服務商，因此無法顯示即時動態。連接服務商後，貼文會出現在此區塊。',
      providers: {
        'instagram-feed': 'Instagram 動態',
        'youtube-subscribe': 'YouTube 訂閱',
        'linkedin-follow': 'LinkedIn 追蹤',
        'tiktok-feed': 'TikTok 動態',
      },
      layouts: {
        grid: '網格',
        list: '列表',
      },
      inspector: {
        provider: '服務商',
        handle: '帳號 / Channel ID',
        layout: '版面',
        count: '數量',
        showHeader: '顯示標頭',
      },
    },
  },
  en: {
    layouts: {
      row: 'Row',
      column: 'Column',
    },
    providers: {
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter',
      threads: 'Threads',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      tiktok: 'TikTok',
      whatsapp: 'WhatsApp',
      line: 'LINE',
      kakao: 'Kakao',
      naver: 'Naver',
      x: 'X',
    },
    shareProviders: {
      copy: 'Copy link',
      facebook: 'Facebook',
      twitter: 'Twitter',
      kakao: 'Kakao',
      line: 'LINE',
      whatsapp: 'WhatsApp',
      email: 'Email',
    },
    socialBar: {
      navLabel: 'Social links',
      inspector: {
        items: 'Items (provider | href)',
        layout: 'Layout',
        style: 'Style',
        styles: {
          plain: 'Plain',
          solid: 'Solid',
          outline: 'Outline',
        },
        size: 'Size',
        color: 'Color',
      },
    },
    shareButtons: {
      defaultTitle: 'Share',
      inspector: {
        title: 'Title',
        providerSelection: 'Select providers',
        layout: 'Layout',
        size: 'Size',
      },
    },
    socialEmbed: {
      editPlaceholder: (provider) => `${provider} external embed placeholder`,
      editSdkHint: 'SDK loads on public pages',
      handleFallback: '@handle',
      unavailableTitle: 'External feed not connected',
      unavailableMessage:
        'No social provider is connected, so the live feed cannot be shown. Connect a provider to display posts here.',
      providers: {
        'instagram-feed': 'Instagram feed',
        'youtube-subscribe': 'YouTube subscribe',
        'linkedin-follow': 'LinkedIn follow',
        'tiktok-feed': 'TikTok feed',
      },
      layouts: {
        grid: 'Grid',
        list: 'List',
      },
      inspector: {
        provider: 'Provider',
        handle: 'Handle / Channel ID',
        layout: 'Layout',
        count: 'Count',
        showHeader: 'Show header',
      },
    },
  },
};

export function getSocialWidgetsCopy(locale: Locale): SocialWidgetsCopy {
  return socialWidgetsCopy[locale] ?? socialWidgetsCopy.en;
}
