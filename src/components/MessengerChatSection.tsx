'use client';

import type { Locale } from '@/lib/locales';

const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_hojeong/chat';
const LINE_URL = 'https://lin.ee/hojeong';

interface MessengerConfig {
  sectionTitle: string;
  sectionDescription: string;
  primary: {
    platform: string;
    label: string;
    description: string;
    href: string;
    icon: 'kakao' | 'line';
  };
  secondary: {
    platform: string;
    label: string;
    description: string;
    href: string;
    icon: 'kakao' | 'line';
  };
  features: string[];
  featuresTitle: string;
}

function getConfig(locale: Locale): MessengerConfig {
  if (locale === 'ko') {
    return {
      sectionTitle: '메신저 상담',
      sectionDescription: '카카오톡 또는 LINE으로 편리하게 법률 상담을 시작하세요.',
      primary: {
        platform: 'KakaoTalk',
        label: '카카오톡 상담 시작',
        description: '카카오톡 채널을 통해 빠르게 상담을 받으세요.',
        href: KAKAO_CHANNEL_URL,
        icon: 'kakao'
      },
      secondary: {
        platform: 'LINE',
        label: 'LINE 상담 시작',
        description: '대만에서 LINE으로 바로 문의하세요.',
        href: LINE_URL,
        icon: 'line'
      },
      features: [
        '법인설립·투자 관련 빠른 답변',
        '소송·분쟁 상담 예약',
        '비자·체류 관련 안내',
        '24시간 메시지 접수 가능'
      ],
      featuresTitle: '메신저 상담으로 가능한 것'
    };
  }

  if (locale === 'en') {
    return {
      sectionTitle: 'Messenger Consultation',
      sectionDescription: 'Start your legal consultation quickly through KakaoTalk or LINE.',
      primary: {
        platform: 'KakaoTalk',
        label: 'Start KakaoTalk Chat',
        description: 'Get a quick response through our KakaoTalk channel.',
        href: KAKAO_CHANNEL_URL,
        icon: 'kakao'
      },
      secondary: {
        platform: 'LINE',
        label: 'Start LINE Chat',
        description: 'Contact us directly on LINE from Taiwan or overseas.',
        href: LINE_URL,
        icon: 'line'
      },
      features: [
        'Quick answers for incorporation and investment questions',
        'Litigation and dispute consultation booking',
        'Visa and residency guidance',
        '24/7 message intake'
      ],
      featuresTitle: 'What You Can Do via Messenger'
    };
  }

  return {
    sectionTitle: '即時通訊諮詢',
    sectionDescription: '透過 LINE 或 KakaoTalk 輕鬆開始法律諮詢。',
    primary: {
      platform: 'LINE',
      label: '開始 LINE 諮詢',
      description: '透過 LINE 官方帳號快速獲得法律諮詢。',
      href: LINE_URL,
      icon: 'line'
    },
    secondary: {
      platform: 'KakaoTalk',
      label: '開始 KakaoTalk 諮詢',
      description: '韓國客戶可透過 KakaoTalk 聯繫我們。',
      href: KAKAO_CHANNEL_URL,
      icon: 'kakao'
    },
    features: [
      '公司設立·投資相關快速回覆',
      '訴訟·爭議諮詢預約',
      '簽證·居留相關指引',
      '24小時訊息受理'
    ],
    featuresTitle: '即時通訊諮詢服務'
  };
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" className="messenger-icon" aria-hidden>
      <path
        d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.4-.99 3.62 0 0-.02.17.09.24.11.06.24.01.24.01.32-.04 3.7-2.44 4.28-2.86.56.08 1.14.12 1.72.12 5.52 0 10-3.58 10-7.8C22 6.58 17.52 3 12 3z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" className="messenger-icon" aria-hidden>
      <path
        d="M12 2C6.48 2 2 5.64 2 10.11c0 4 3.18 7.36 7.47 7.99.29.06.69.19.79.44.09.23.06.58.03.81l-.13.76c-.04.22-.17.85.75.46s4.96-2.92 6.77-5C19.82 13.16 22 11.83 22 10.11 22 5.64 17.52 2 12 2z"
        fill="#06C755"
      />
      <path
        d="M8.5 8.5h-1a.3.3 0 00-.3.3v3.4a.3.3 0 00.3.3h1a.3.3 0 00.3-.3v-1.1l1.4 1.3a.3.3 0 00.4 0 .3.3 0 000-.4l-1.4-1.3h1a.3.3 0 00.3-.3V9.1a.3.3 0 00-.1-.2L9.5 8.5h-1zM15 8.5h-1a.3.3 0 00-.3.3v1.3l-1.4-1.5a.3.3 0 00-.5.2v3.4a.3.3 0 00.3.3h1a.3.3 0 00.3-.3v-1.3l1.4 1.5a.3.3 0 00.5-.2V8.8a.3.3 0 00-.3-.3zM17.5 10h-1v-.8h1a.3.3 0 000-.7h-1.3a.3.3 0 00-.3.3v3.4a.3.3 0 00.3.3h1.3a.3.3 0 000-.7h-1v-.8h1a.3.3 0 000-.7z"
        fill="#fff"
      />
    </svg>
  );
}

export default function MessengerChatSection({ locale }: { locale: Locale }) {
  const config = getConfig(locale);

  return (
    <section className="messenger-chat-section">
      <div className="container">
        <div className="messenger-header">
          <span className="section-label-text">MESSENGER</span>
          <h2 className="section-title">{config.sectionTitle}</h2>
          <p className="section-lede">{config.sectionDescription}</p>
        </div>

        <div className="messenger-grid">
          <a
            href={config.primary.href}
            className={`messenger-card messenger-card--primary messenger-card--${config.primary.icon}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="messenger-card-icon">
              {config.primary.icon === 'kakao' ? <KakaoIcon /> : <LineIcon />}
            </div>
            <div className="messenger-card-body">
              <h3 className="messenger-card-platform">{config.primary.platform}</h3>
              <p className="messenger-card-label">{config.primary.label}</p>
              <p className="messenger-card-desc">{config.primary.description}</p>
            </div>
            <span className="messenger-card-arrow">→</span>
          </a>

          <a
            href={config.secondary.href}
            className={`messenger-card messenger-card--secondary messenger-card--${config.secondary.icon}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="messenger-card-icon">
              {config.secondary.icon === 'kakao' ? <KakaoIcon /> : <LineIcon />}
            </div>
            <div className="messenger-card-body">
              <h3 className="messenger-card-platform">{config.secondary.platform}</h3>
              <p className="messenger-card-label">{config.secondary.label}</p>
              <p className="messenger-card-desc">{config.secondary.description}</p>
            </div>
            <span className="messenger-card-arrow">→</span>
          </a>

          <div className="messenger-features">
            <h3 className="messenger-features-title">{config.featuresTitle}</h3>
            <ul className="messenger-features-list">
              {config.features.map((feature) => (
                <li key={feature}>
                  <span className="messenger-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
