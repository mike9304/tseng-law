// Contact channel SSOT for public contact UI + AI consultation fallback.
// Messenger URLs are the canonical firm channels already used site-wide.
// Ownership/receive verification remains a human pre-production gate.

const LINE_URL = 'https://lin.ee/hojeong';
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
    secondary: MessengerChannel;
  };
  direct: {
    email: DirectChannel;
    phone: DirectChannel;
  };
  offices: {
    offices: Array<{ phone: string }>;
  };
};

export const contactPageContent: Record<'ko' | 'zh-hant' | 'en', LocaleContent> = {
  ko: {
    messenger: {
      primary: { href: LINE_URL, platform: 'LINE', label: 'LINE 채널 문의' },
      secondary: { href: KAKAO_CHANNEL_URL, platform: 'KakaoTalk', label: '카카오톡 채널 상담' },
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
      primary: { href: LINE_URL, platform: 'LINE', label: 'LINE 頻道諮詢' },
      secondary: { href: KAKAO_CHANNEL_URL, platform: 'KakaoTalk', label: 'KakaoTalk 頻道諮詢' },
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
      primary: { href: LINE_URL, platform: 'LINE', label: 'LINE channel chat' },
      secondary: { href: KAKAO_CHANNEL_URL, platform: 'KakaoTalk', label: 'KakaoTalk channel' },
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
};
