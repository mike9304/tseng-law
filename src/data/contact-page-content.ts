// Verified contact-channel SSOT for public contact UI + AI consultation fallback.

import type { SiteLocale } from '@/lib/locales';
import {
  getConsultationPublicEmail,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';

const PRIMARY_EMAIL = getConsultationPublicEmail();
const CONSULTATION_MAILTO = {
  ko: getConsultationPublicMailto('ko'),
  'zh-hant': getConsultationPublicMailto('zh-hant'),
  en: getConsultationPublicMailto('en'),
  ja: getConsultationPublicMailto('ja'),
} as const;

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
    primary: MessengerChannel | null;
  };
  direct: {
    email: DirectChannel;
  };
};

export const contactPageContent: Record<SiteLocale, LocaleContent> = {
  ko: {
    messenger: {
      primary: {
        href: CONSULTATION_MAILTO.ko,
        platform: 'Email',
        label: '이메일 상담 신청',
      },
    },
    direct: {
      email: {
        label: '이메일',
        value: PRIMARY_EMAIL,
        href: CONSULTATION_MAILTO.ko,
      },
    },
  },
  'zh-hant': {
    messenger: {
      primary: {
        href: CONSULTATION_MAILTO['zh-hant'],
        platform: 'Email',
        label: '電子郵件諮詢',
      },
    },
    direct: {
      email: {
        label: '電子郵件',
        value: PRIMARY_EMAIL,
        href: CONSULTATION_MAILTO['zh-hant'],
      },
    },
  },
  en: {
    messenger: {
      primary: {
        href: CONSULTATION_MAILTO.en,
        platform: 'Email',
        label: 'Email consultation',
      },
    },
    direct: {
      email: {
        label: 'Email',
        value: PRIMARY_EMAIL,
        href: CONSULTATION_MAILTO.en,
      },
    },
  },
  ja: {
    messenger: {
      primary: {
        href: CONSULTATION_MAILTO.ja,
        platform: 'Email',
        label: 'メールでお問い合わせ',
      },
    },
    direct: {
      email: {
        label: 'メール',
        value: PRIMARY_EMAIL,
        href: CONSULTATION_MAILTO.ja,
      },
    },
  },
};
