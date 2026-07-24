'use client';

import type { SiteLocale } from '@/lib/locales';
import { contactPageContent } from '@/data/contact-page-content';

interface MessengerConfig {
  sectionTitle: string;
  sectionDescription: string;
  primary: {
    label: string;
    description: string;
    href: string;
  };
  features: string[];
  featuresTitle: string;
}

function getConfig(locale: SiteLocale): MessengerConfig {
  const channels = contactPageContent[locale].messenger;
  if (locale === 'ko') {
    return {
      sectionTitle: '메신저 상담',
      sectionDescription: '검증된 메신저 채널로 편리하게 법률 상담을 시작하세요.',
      primary: {
        label: channels.primary.label,
        description: '메시지를 남기면 확인 후 상담을 안내해 드립니다.',
        href: channels.primary.href,
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
      sectionDescription: 'Start your legal consultation through our verified messenger channel.',
      primary: {
        label: channels.primary.label,
        description: 'Leave a message and we will follow up with consultation guidance.',
        href: channels.primary.href,
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

  if (locale === 'ja') {
    return {
      sectionTitle: 'メッセンジャーでのお問い合わせ',
      sectionDescription: 'KakaoTalkチャンネルからお問い合わせいただけます。',
      primary: {
        label: channels.primary.label,
        description: 'メッセージをお送りください。確認後、相談方法をご案内します。',
        href: channels.primary.href,
      },
      features: [
        '会社設立・投資に関するお問い合わせ',
        '訴訟・紛争に関するお問い合わせ',
        '相談方法・日程のご案内',
        '資料送付に関する事前確認',
      ],
      featuresTitle: 'KakaoTalkでお問い合わせいただける内容',
    };
  }

  return {
    sectionTitle: '即時通訊諮詢',
    sectionDescription: '透過已驗證的即時通訊頻道輕鬆開始法律諮詢。',
    primary: {
      label: channels.primary.label,
      description: '請留下訊息，我們確認後將提供諮詢安排。',
      href: channels.primary.href,
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

export default function MessengerChatSection({ locale }: { locale: SiteLocale }) {
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
            className="messenger-card messenger-card--primary messenger-card--kakao"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="messenger-card-icon">
              <KakaoIcon />
            </div>
            <div className="messenger-card-body">
              <h3
                className="messenger-card-platform"
                style={locale === 'ja' ? { textTransform: 'none' } : undefined}
              >
                {config.primary.label}
              </h3>
              <p className="messenger-card-desc">{config.primary.description}</p>
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
