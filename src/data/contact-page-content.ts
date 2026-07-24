// Verified contact-channel SSOT for public contact UI + AI consultation fallback.

import type { SiteLocale } from '@/lib/locales';

const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_hojeong/chat';
const PRIMARY_PHONE = '+82-10-2992-9304';
const PRIMARY_EMAIL = 'wei@hoveringlaw.com.tw';

type MessengerChannel = {
  href: string;
  platform: string;
  label: string;
};

type DirectChannel = {
  label: string;
  value: string;
  href: string;
};

type LocaleContent = {
  messenger: {
    primary: MessengerChannel;
  };
  direct: {
    email: DirectChannel;
    phone: DirectChannel;
  };
  offices: {
    offices: Array<{ phone: string }>;
  };
};

export const contactPageContent: Record<SiteLocale, LocaleContent> = {
  ko: {
    messenger: {
      primary: { href: KAKAO_CHANNEL_URL, platform: 'KakaoTalk', label: '카카오톡 채널 상담' },
    },
    direct: {
      email: {
        label: '이메일',
        value: PRIMARY_EMAIL,
        href: `mailto:${PRIMARY_EMAIL}`,
      },
      phone: {
        label: '전화',
        value: PRIMARY_PHONE,
        href: `tel:${PRIMARY_PHONE.replace(/[^\d+]/g, '')}`,
      },
    },
    offices: { offices: [{ phone: PRIMARY_PHONE }] },
  },
  'zh-hant': {
    messenger: {
      primary: { href: KAKAO_CHANNEL_URL, platform: 'KakaoTalk', label: 'KakaoTalk 頻道諮詢' },
    },
    direct: {
      email: {
        label: '電子郵件',
        value: PRIMARY_EMAIL,
        href: `mailto:${PRIMARY_EMAIL}`,
      },
      phone: {
        label: '電話',
        value: PRIMARY_PHONE,
        href: `tel:${PRIMARY_PHONE.replace(/[^\d+]/g, '')}`,
      },
    },
    offices: { offices: [{ phone: PRIMARY_PHONE }] },
  },
  en: {
    messenger: {
      primary: { href: KAKAO_CHANNEL_URL, platform: 'KakaoTalk', label: 'KakaoTalk channel' },
    },
    direct: {
      email: {
        label: 'Email',
        value: PRIMARY_EMAIL,
        href: `mailto:${PRIMARY_EMAIL}`,
      },
      phone: {
        label: 'Phone',
        value: PRIMARY_PHONE,
        href: `tel:${PRIMARY_PHONE.replace(/[^\d+]/g, '')}`,
      },
    },
    offices: { offices: [{ phone: PRIMARY_PHONE }] },
  },
  ja: {
    messenger: {
      primary: {
        href: KAKAO_CHANNEL_URL,
        platform: 'KakaoTalk',
        label: 'KakaoTalkチャンネルでお問い合わせ',
      },
    },
    direct: {
      email: {
        label: 'メール',
        value: PRIMARY_EMAIL,
        href: `mailto:${PRIMARY_EMAIL}`,
      },
      phone: {
        label: '電話',
        value: PRIMARY_PHONE,
        href: `tel:${PRIMARY_PHONE.replace(/[^\d+]/g, '')}`,
      },
    },
    offices: { offices: [{ phone: PRIMARY_PHONE }] },
  },
};
