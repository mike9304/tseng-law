import { describe, expect, it } from 'vitest';

import { contactPageContent } from '@/data/contact-page-content';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';

describe('Japanese contact page data', () => {
  it('uses the reviewed Japanese page hero copy', () => {
    expect(pageCopy.ja.contact).toEqual({
      label: 'CONTACT',
      title: 'お問い合わせ',
      description: 'お問い合わせ種別、連絡先、事務所所在地をまとめてご案内します。',
    });
  });

  it('uses the reviewed Japanese contact block copy without changing addresses', () => {
    expect(siteContent.ja.contact).toEqual({
      label: 'CONTACT',
      title: 'お問い合わせ',
      description: 'ご相談内容に応じた適切な窓口からご連絡ください。',
      inquiriesLabel: 'お問い合わせ種別',
      inquiries: [
        {
          title: 'ビジネス・投資',
          details: ['電話：+82-10-2992-9304', 'メール：wei@hoveringlaw.com.tw'],
        },
        {
          title: 'メディア取材',
          details: [
            'メール：wei@hoveringlaw.com.tw',
            'KakaoTalk：チャンネルでお問い合わせ',
            '件名に【メディア取材】とご記入ください',
          ],
        },
        {
          title: '採用に関するお問い合わせ',
          details: [
            'メール：wei@hoveringlaw.com.tw',
            '電話：+82-10-2992-9304',
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
          details: ['台北市大同区承徳路一段35号7F-2'],
        },
        {
          title: '台中事務所',
          details: ['台中市北区館前路19号', 'Tel: 04-2326-1862', 'Fax: 04-2326-1863'],
        },
        {
          title: '高雄事務所',
          details: ['高雄市左営区安吉街233号', 'Tel: 07-557-9797'],
        },
      ],
      cta: { label: 'お問い合わせページ', href: '/ja/contact' },
    });
  });

  it('uses the reviewed Japanese direct and KakaoTalk channel labels', () => {
    expect(contactPageContent.ja).toEqual({
      messenger: {
        primary: {
          href: 'https://pf.kakao.com/_hojeong/chat',
          platform: 'KakaoTalk',
          label: 'KakaoTalkチャンネルでお問い合わせ',
        },
      },
      direct: {
        email: {
          label: 'メール',
          value: 'wei@hoveringlaw.com.tw',
          href: 'mailto:wei@hoveringlaw.com.tw',
        },
        phone: {
          label: '電話',
          value: '+82-10-2992-9304',
          href: 'tel:+821029929304',
        },
      },
      offices: { offices: [{ phone: '+82-10-2992-9304' }] },
    });
  });

  it('contains no LINE channel claim in Japanese contact data', () => {
    const japaneseContactData = JSON.stringify({
      pageCopy: pageCopy.ja.contact,
      siteContent: siteContent.ja.contact,
      channelContent: contactPageContent.ja,
    });

    expect(japaneseContactData).not.toMatch(/LINE|lin\.ee|line\.me/i);
  });

  it('keeps all Korean contact data unchanged', () => {
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
            details: ['전화: +82-10-2992-9304', '이메일: wei@hoveringlaw.com.tw'],
          },
          {
            title: '미디어 문의',
            details: [
              '이메일: wei@hoveringlaw.com.tw',
              '카카오톡: 채널 상담',
              '접수 시 제목에 [미디어 문의] 표기',
            ],
          },
          {
            title: '채용 문의',
            details: [
              '이메일: wei@hoveringlaw.com.tw',
              '전화: +82-10-2992-9304',
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
            details: ['台北市大同區承德路一段35號7樓之2'],
          },
          {
            title: '타이중 사무소',
            details: [
              '臺中市北區館前路19號樓之1',
              'Tel: 04-2326-1862',
              'Fax: 04-2326-1863',
            ],
          },
          {
            title: '가오슝 사무소',
            details: ['高雄市左營區安吉街233號', 'Tel: 07-557-9797'],
          },
        ],
        cta: { label: '문의 페이지', href: '/ko/contact' },
      },
      channelContent: {
        messenger: {
          primary: {
            href: 'https://pf.kakao.com/_hojeong/chat',
            platform: 'KakaoTalk',
            label: '카카오톡 채널 상담',
          },
        },
        direct: {
          email: {
            label: '이메일',
            value: 'wei@hoveringlaw.com.tw',
            href: 'mailto:wei@hoveringlaw.com.tw',
          },
          phone: {
            label: '전화',
            value: '+82-10-2992-9304',
            href: 'tel:+821029929304',
          },
        },
        offices: { offices: [{ phone: '+82-10-2992-9304' }] },
      },
    });
  });

  it('keeps all Traditional Chinese contact data unchanged', () => {
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
            details: ['電話: +82-10-2992-9304', 'Email: wei@hoveringlaw.com.tw'],
          },
          {
            title: '媒體詢問',
            details: [
              'Email: wei@hoveringlaw.com.tw',
              'KakaoTalk: 頻道諮詢',
              '來信標題請註明 [媒體詢問]',
            ],
          },
          {
            title: '招募詢問',
            details: [
              'Email: wei@hoveringlaw.com.tw',
              '電話: +82-10-2992-9304',
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
            details: ['台北市大同區承德路一段35號7樓之2'],
          },
          {
            title: '台中所',
            details: [
              '臺中市北區館前路19號樓之1',
              'Tel: 04-2326-1862',
              'Fax: 04-2326-1863',
            ],
          },
          {
            title: '高雄所',
            details: ['高雄市左營區安吉街233號', 'Tel: 07-557-9797'],
          },
        ],
        cta: { label: '聯絡頁', href: '/zh-hant/contact' },
      },
      channelContent: {
        messenger: {
          primary: {
            href: 'https://pf.kakao.com/_hojeong/chat',
            platform: 'KakaoTalk',
            label: 'KakaoTalk 頻道諮詢',
          },
        },
        direct: {
          email: {
            label: '電子郵件',
            value: 'wei@hoveringlaw.com.tw',
            href: 'mailto:wei@hoveringlaw.com.tw',
          },
          phone: {
            label: '電話',
            value: '+82-10-2992-9304',
            href: 'tel:+821029929304',
          },
        },
        offices: { offices: [{ phone: '+82-10-2992-9304' }] },
      },
    });
  });

  it('keeps all English contact data unchanged', () => {
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
            details: ['Phone: +82-10-2992-9304', 'Email: wei@hoveringlaw.com.tw'],
          },
          {
            title: 'Media Inquiry',
            details: [
              'Email: wei@hoveringlaw.com.tw',
              'KakaoTalk: Channel Chat',
              'Please use subject line [Media Inquiry]',
            ],
          },
          {
            title: 'Recruitment Inquiry',
            details: [
              'Email: wei@hoveringlaw.com.tw',
              'Phone: +82-10-2992-9304',
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
            details: ['7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City'],
          },
          {
            title: 'Taichung Office',
            details: [
              'No. 19, Guanqian Rd., North Dist., Taichung City',
              'Tel: 04-2326-1862',
              'Fax: 04-2326-1863',
            ],
          },
          {
            title: 'Kaohsiung Office',
            details: ['No. 233, Anji St., Zuoying Dist., Kaohsiung City', 'Tel: 07-557-9797'],
          },
        ],
        cta: { label: 'Contact Page', href: '/en/contact' },
      },
      channelContent: {
        messenger: {
          primary: {
            href: 'https://pf.kakao.com/_hojeong/chat',
            platform: 'KakaoTalk',
            label: 'KakaoTalk channel',
          },
        },
        direct: {
          email: {
            label: 'Email',
            value: 'wei@hoveringlaw.com.tw',
            href: 'mailto:wei@hoveringlaw.com.tw',
          },
          phone: {
            label: 'Phone',
            value: '+82-10-2992-9304',
            href: 'tel:+821029929304',
          },
        },
        offices: { offices: [{ phone: '+82-10-2992-9304' }] },
      },
    });
  });
});
