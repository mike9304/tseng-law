'use client';

import type { SiteLocale } from '@/lib/locales';
import {
  CONSULTATION_EMAIL,
  getConsultationCtaLabel,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';

interface MessengerConfig {
  sectionTitle: string;
  sectionDescription: string;
  primaryLabel: string;
  primaryDescription: string;
  features: string[];
  featuresTitle: string;
}

function getConfig(locale: SiteLocale): MessengerConfig {
  if (locale === 'ko') {
    return {
      sectionTitle: '이메일 상담',
      sectionDescription: '상담 문의는 공식 이메일로 보내주시면 확인 후 안내해 드립니다.',
      primaryLabel: '공식 상담 이메일',
      primaryDescription: CONSULTATION_EMAIL,
      features: [
        '법인설립·투자 관련 문의',
        '소송·분쟁 상담 예약',
        '비자·체류 관련 문의',
        '공식 이메일 접수',
      ],
      featuresTitle: '이메일로 문의하실 수 있는 내용',
    };
  }

  if (locale === 'en') {
    return {
      sectionTitle: 'Email Consultation',
      sectionDescription: 'Please send consultation inquiries to our official email address for follow-up.',
      primaryLabel: 'Official consultation email',
      primaryDescription: CONSULTATION_EMAIL,
      features: [
        'Incorporation and investment inquiries',
        'Litigation and dispute booking',
        'Visa and residency questions',
        'Official email intake',
      ],
      featuresTitle: 'What You Can Ask by Email',
    };
  }

  if (locale === 'ja') {
    return {
      sectionTitle: 'メールでのご相談',
      sectionDescription: 'ご相談は公式メールアドレス宛にお送りください。確認後ご案内します。',
      primaryLabel: '公式相談メール',
      primaryDescription: CONSULTATION_EMAIL,
      features: [
        '会社設立・投資に関するお問い合わせ',
        '訴訟・紛争に関するお問い合わせ',
        '相談方法・日程のご案内',
        '資料送付に関する事前確認',
      ],
      featuresTitle: 'メールでご相談いただける内容',
    };
  }

  return {
    sectionTitle: '電子郵件諮詢',
    sectionDescription: '請將諮詢內容寄至官方電子郵件信箱，我們確認後回覆。',
    primaryLabel: '官方諮詢信箱',
    primaryDescription: CONSULTATION_EMAIL,
    features: [
      '公司設立·投資相關詢問',
      '訴訟·爭議諮詢預約',
      '簽證·居留相關詢問',
      '官方電子郵件收件',
    ],
    featuresTitle: '可透過電子郵件詢問的事項',
  };
}

export default function MessengerChatSection({ locale }: { locale: SiteLocale }) {
  const config = getConfig(locale);
  const consultationCtaLabel = getConsultationCtaLabel(locale);

  return (
    <section className="messenger-chat-section">
      <div className="container">
        <div className="messenger-header">
          <span className="section-label-text">EMAIL</span>
          <h2 className="section-title">{config.sectionTitle}</h2>
          <p className="section-lede">{config.sectionDescription}</p>
        </div>

        <div className="messenger-grid">
          <a
            href={getConsultationPublicMailto(locale)}
            className="messenger-card messenger-card--primary messenger-card--email"
            aria-label={`${config.primaryLabel}: ${CONSULTATION_EMAIL} — ${consultationCtaLabel}`}
          >
            <div className="messenger-card-body">
              <h3 className="messenger-card-platform">{config.primaryLabel}</h3>
              <p className="messenger-card-desc">{config.primaryDescription}</p>
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
