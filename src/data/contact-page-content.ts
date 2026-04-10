// Minimal contact data for the AI consultation channel fallback sidebar.
// The full contact page content module was never committed to git; this
// supplies just the shape AiConsultationSection reads (messenger channels
// and the primary office phone). URLs and phone come from the canonical
// values already used in MessengerChatSection.tsx and site-content.ts.

const LINE_URL = 'https://lin.ee/hojeong';
const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_hojeong/chat';
const PRIMARY_PHONE = '+82-10-2992-9304';

type Messenger = {
  primary: { href: string; platform: string; label: string };
  secondary: { href: string; platform: string; label: string };
};

type LocaleContent = {
  messenger: Messenger;
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
    offices: { offices: [{ phone: PRIMARY_PHONE }] },
  },
  'zh-hant': {
    messenger: {
      primary: { href: LINE_URL, platform: 'LINE', label: 'LINE 頻道諮詢' },
      secondary: { href: KAKAO_CHANNEL_URL, platform: 'KakaoTalk', label: 'KakaoTalk 頻道諮詢' },
    },
    offices: { offices: [{ phone: PRIMARY_PHONE }] },
  },
  en: {
    messenger: {
      primary: { href: LINE_URL, platform: 'LINE', label: 'LINE channel chat' },
      secondary: { href: KAKAO_CHANNEL_URL, platform: 'KakaoTalk', label: 'KakaoTalk channel' },
    },
    offices: { offices: [{ phone: PRIMARY_PHONE }] },
  },
};
