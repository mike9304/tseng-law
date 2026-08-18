import { describe, expect, it } from 'vitest';

import { contactPageContent } from '@/data/contact-page-content';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

const consultationMailto = {
  ko: getConsultationPublicMailto('ko'),
  'zh-hant': getConsultationPublicMailto('zh-hant'),
  en: getConsultationPublicMailto('en'),
  ja: getConsultationPublicMailto('ja'),
} as const;

describe('Japanese contact page data', () => {
  it('uses the reviewed Japanese page hero copy', () => {
    expect(pageCopy.ja.contact).toEqual({
      label: 'CONTACT',
      title: 'お問い合わせ',
      description: 'お問い合わせ種別、連絡先、事務所所在地をまとめてご案内します。',
    });
  });

  it('uses the reviewed Japanese email-first contact copy and official four-office addresses', () => {
    expect(siteContent.ja.contact).toEqual({
      label: 'CONTACT',
      title: 'お問い合わせ',
      description: 'ご相談内容に応じた適切な窓口からご連絡ください。',
      inquiriesLabel: 'お問い合わせ種別',
      inquiries: [
        {
          title: 'ビジネス・投資',
          details: ['メール：wei@hoveringlaw.com.tw'],
        },
        {
          title: 'メディア取材',
          details: [
            'メール：wei@hoveringlaw.com.tw',
            '件名に【メディア取材】とご記入ください',
          ],
        },
        {
          title: '採用に関するお問い合わせ',
          details: [
            'メール：wei@hoveringlaw.com.tw',
            '件名に【採用】とご記入ください',
          ],
        },
        {
          title: '一般のお問い合わせ',
          details: ['メール：wei@hoveringlaw.com.tw'],
        },
      ],
      locationsLabel: '事務所所在地',
      locations: [
        {
          title: '台北事務所',
          details: ['103 台北市大同区承徳路一段35号7F-2'],
        },
        {
          title: '台中事務所',
          details: ['40453 台中市北区館前路19号6F-1', 'Tel: 04-2326-1862', 'Fax: 04-2326-1863'],
        },
        {
          title: '高雄事務所',
          details: ['81358 高雄市左営区安吉街233号', 'Tel: 07-557-9797', 'Fax: 07-557-7171'],
        },
        {
          title: '屏東事務所',
          details: ['90443 屏東県九如郷九如路三段46号', 'Tel: 08-739-1689', 'Fax: 08-739-7362'],
        },
      ],
      cta: {
        label: 'メールで相談',
        href: consultationMailto.ja,
      },
    });
  });

  it('uses email as the sole Japanese public consultation channel', () => {
    expect(contactPageContent.ja).toEqual({
      messenger: {
        primary: {
          href: consultationMailto.ja,
          platform: 'Email',
          label: 'メールでお問い合わせ',
        },
      },
      direct: {
        email: {
          label: 'メール',
          value: 'wei@hoveringlaw.com.tw',
          href: consultationMailto.ja,
        },
      },
    });
  });

  it('contains no KakaoTalk or LINE channel claim in Japanese contact data', () => {
    const japaneseContactData = JSON.stringify({
      pageCopy: pageCopy.ja.contact,
      siteContent: siteContent.ja.contact,
      channelContent: contactPageContent.ja,
    });

    expect(japaneseContactData).not.toMatch(/KakaoTalk|pf\.kakao|LINE|lin\.ee|line\.me/i);
  });

  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)(
    'keeps email as the sole public consultation CTA for %s',
    (locale) => {
      const publicContactData = JSON.stringify({
        inquiries: siteContent[locale].contact.inquiries,
        cta: siteContent[locale].contact.cta,
        messenger: contactPageContent[locale].messenger,
        email: contactPageContent[locale].direct.email,
      });
      expect(contactPageContent[locale].messenger.primary).toEqual(
        expect.objectContaining({ href: expect.stringMatching(/^mailto:wei@hoveringlaw\.com\.tw\?subject=/) }),
      );
      expect(contactPageContent[locale].direct.email.href).toMatch(
        /^mailto:wei@hoveringlaw\.com\.tw\?subject=/,
      );
      expect(publicContactData).not.toMatch(
        /tel:|010-2992-9304|KakaoTalk|pf\.kakao|lin\.ee|line\.me|LINE (?:channel|consultation)|LINE(?:チャンネル|相談|諮詢)/i,
      );
    },
  );

  it('uses the reviewed Korean email-first contact data', () => {
    expect({
      pageCopy: pageCopy.ko.contact,
      siteContent: siteContent.ko.contact,
      channelContent: contactPageContent.ko,
    }).toEqual({
      pageCopy: {
        label: 'CONTACT',
        title: '문의 및 연락처',
        description: '문의 유형, 연락처, 사무소 위치를 한 번에 확인하세요.',
      },
      siteContent: {
        label: 'CONTACT',
        title: '문의 및 연락처',
        description: '문의 유형별 연락처를 우선 안내합니다.',
        inquiriesLabel: '문의 유형',
        inquiries: [
          {
            title: '사업·투자 문의',
            details: ['이메일: wei@hoveringlaw.com.tw'],
          },
          {
            title: '미디어 문의',
            details: [
              '이메일: wei@hoveringlaw.com.tw',
              '접수 시 제목에 [미디어 문의] 표기',
            ],
          },
          {
            title: '채용 문의',
            details: [
              '이메일: wei@hoveringlaw.com.tw',
              '접수 시 제목에 [채용 문의] 표기',
            ],
          },
          {
            title: '일반 문의',
            details: ['이메일: wei@hoveringlaw.com.tw'],
          },
        ],
        locationsLabel: '사무소 위치',
        locations: [
          {
            title: '타이베이 사무소',
            details: ['103臺北市大同區承德路一段35號7樓之2'],
          },
          {
            title: '타이중 사무소',
            details: [
              '40453臺中市北區館前路19號6樓之1',
              'Tel: 04-2326-1862',
              'Fax: 04-2326-1863',
            ],
          },
          {
            title: '가오슝 사무소',
            details: ['81358高雄市左營區安吉街233號', 'Tel: 07-557-9797', 'Fax: 07-557-7171'],
          },
          {
            title: '핑둥 사무소',
            details: ['90443屏東縣九如鄉九如路三段46號', 'Tel: 08-739-1689', 'Fax: 08-739-7362'],
          },
        ],
        cta: {
          label: '이메일 상담 신청',
          href: consultationMailto.ko,
        },
      },
      channelContent: {
        messenger: {
          primary: {
            href: consultationMailto.ko,
            platform: 'Email',
            label: '이메일 상담 신청',
          },
        },
        direct: {
          email: {
            label: '이메일',
            value: 'wei@hoveringlaw.com.tw',
            href: consultationMailto.ko,
          },
        },
      },
    });
  });

  it('uses the reviewed Traditional Chinese email-first contact data', () => {
    expect({
      pageCopy: pageCopy['zh-hant'].contact,
      siteContent: siteContent['zh-hant'].contact,
      channelContent: contactPageContent['zh-hant'],
    }).toEqual({
      pageCopy: {
        label: 'CONTACT',
        title: '聯絡與諮詢',
        description: '一次查看詢問類型、聯絡方式與事務所據點。',
      },
      siteContent: {
        label: 'CONTACT',
        title: '聯絡與諮詢',
        description: '依照詢問類型提供聯絡方式。',
        inquiriesLabel: '詢問類型',
        inquiries: [
          {
            title: '商務/投資詢問',
            details: ['Email: wei@hoveringlaw.com.tw'],
          },
          {
            title: '媒體詢問',
            details: [
              'Email: wei@hoveringlaw.com.tw',
              '來信標題請註明 [媒體詢問]',
            ],
          },
          {
            title: '招募詢問',
            details: [
              'Email: wei@hoveringlaw.com.tw',
              '來信標題請註明 [招募詢問]',
            ],
          },
          {
            title: '一般詢問',
            details: ['Email: wei@hoveringlaw.com.tw'],
          },
        ],
        locationsLabel: '事務所據點',
        locations: [
          {
            title: '台北所',
            details: ['103臺北市大同區承德路一段35號7樓之2'],
          },
          {
            title: '台中所',
            details: [
              '40453臺中市北區館前路19號6樓之1',
              'Tel: 04-2326-1862',
              'Fax: 04-2326-1863',
            ],
          },
          {
            title: '高雄所',
            details: ['81358高雄市左營區安吉街233號', 'Tel: 07-557-9797', 'Fax: 07-557-7171'],
          },
          {
            title: '屏東所',
            details: ['90443屏東縣九如鄉九如路三段46號', 'Tel: 08-739-1689', 'Fax: 08-739-7362'],
          },
        ],
        cta: {
          label: '電子郵件諮詢',
          href: consultationMailto['zh-hant'],
        },
      },
      channelContent: {
        messenger: {
          primary: {
            href: consultationMailto['zh-hant'],
            platform: 'Email',
            label: '電子郵件諮詢',
          },
        },
        direct: {
          email: {
            label: '電子郵件',
            value: 'wei@hoveringlaw.com.tw',
            href: consultationMailto['zh-hant'],
          },
        },
      },
    });
  });

  it('uses the reviewed English email-first contact data', () => {
    expect({
      pageCopy: pageCopy.en.contact,
      siteContent: siteContent.en.contact,
      channelContent: contactPageContent.en,
    }).toEqual({
      pageCopy: {
        label: 'CONTACT',
        title: 'Contact & Inquiry',
        description: 'View inquiry types, contact channels, and office locations in one place.',
      },
      siteContent: {
        label: 'CONTACT',
        title: 'Contact & Inquiry',
        description: 'Start with the right channel based on your inquiry type.',
        inquiriesLabel: 'Inquiry Types',
        inquiries: [
          {
            title: 'Business & Investment',
            details: ['Email: wei@hoveringlaw.com.tw'],
          },
          {
            title: 'Media Inquiry',
            details: [
              'Email: wei@hoveringlaw.com.tw',
              'Please use subject line [Media Inquiry]',
            ],
          },
          {
            title: 'Recruitment Inquiry',
            details: [
              'Email: wei@hoveringlaw.com.tw',
              'Please use subject line [Recruitment Inquiry]',
            ],
          },
          {
            title: 'General Inquiry',
            details: ['Email: wei@hoveringlaw.com.tw'],
          },
        ],
        locationsLabel: 'Office Locations',
        locations: [
          {
            title: 'Taipei Office',
            details: ['103, 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City'],
          },
          {
            title: 'Taichung Office',
            details: [
              '40453, 6F-1, No. 19, Guanqian Rd., North Dist., Taichung City',
              'Tel: 04-2326-1862',
              'Fax: 04-2326-1863',
            ],
          },
          {
            title: 'Kaohsiung Office',
            details: [
              '81358, No. 233, Anji St., Zuoying Dist., Kaohsiung City',
              'Tel: 07-557-9797',
              'Fax: 07-557-7171',
            ],
          },
          {
            title: 'Pingtung Office',
            details: [
              'No. 46, Sec. 3, Jiuru Rd., Jiuru Township, Pingtung County 90443',
              'Tel: 08-739-1689',
              'Fax: 08-739-7362',
            ],
          },
        ],
        cta: {
          label: 'Email Consultation',
          href: consultationMailto.en,
        },
      },
      channelContent: {
        messenger: {
          primary: {
            href: consultationMailto.en,
            platform: 'Email',
            label: 'Email consultation',
          },
        },
        direct: {
          email: {
            label: 'Email',
            value: 'wei@hoveringlaw.com.tw',
            href: consultationMailto.en,
          },
        },
      },
    });
  });
});
