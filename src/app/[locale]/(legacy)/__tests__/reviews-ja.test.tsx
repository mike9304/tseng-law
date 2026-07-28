import { Children, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ReviewBoard, {
  ReviewCard,
  formatReviewDate,
  getReviewErrorMessage,
  getReviewServiceLabel,
  reviewLabels,
} from '@/components/ReviewBoard';
import PageHeader from '@/components/PageHeader';
import { pageCopy } from '@/data/page-copy';
import { ReviewsLegacyPage, getReviewsLegacyMetadata } from '../reviews-legacy';
import { ReviewsLegacyPageBody } from '../legacy-page-bodies';
import { getLegacyPageMetadata, renderLegacyPage } from '../index';

const SITE_URL = 'https://tseng-law.com';

const japaneseHero = {
  label: 'REVIEWS',
  title: 'ご感想・レビュー',
  description: 'このページでは、昊鼎国際法律事務所の相談・サービスに関する投稿を、内容確認後に掲載します。',
};

const japaneseKeywords = [
  '台湾法律事務所 レビュー',
  '台湾弁護士 ご感想',
  '昊鼎国際法律事務所',
  '台湾法律相談 レビュー',
];

const disclosure = '掲載内容は投稿者個人の感想です。内容確認は行いますが、投稿者の本人確認または当事務所との利用関係を保証するものではなく、同様の結果を保証するものでもありません。';

describe('Japanese reviews integration', () => {
  it('publishes exact Japanese noindex metadata with four-language alternates', () => {
    const metadata = getReviewsLegacyMetadata('ja');

    expect(pageCopy.ja.reviews).toEqual(japaneseHero);
    expect(metadata.title).toBe(japaneseHero.title);
    expect(metadata.description).toBe(japaneseHero.description);
    expect(metadata.keywords).toEqual(japaneseKeywords);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/reviews`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: japaneseHero.title,
      description: japaneseHero.description,
      url: `${SITE_URL}/ja/reviews`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/reviews`,
      'zh-Hant': `${SITE_URL}/zh-hant/reviews`,
      en: `${SITE_URL}/en/reviews`,
      ja: `${SITE_URL}/ja/reviews`,
      'x-default': `${SITE_URL}/ko/reviews`,
    });
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
  });

  it('passes ja directly through the reviews dispatcher and body', async () => {
    const dispatchedMetadata = getLegacyPageMetadata('reviews', 'ja');
    expect(dispatchedMetadata?.title).toBe(japaneseHero.title);
    expect(dispatchedMetadata?.title).not.toBe(pageCopy.en.reviews.title);

    const dispatchedPage = await renderLegacyPage('reviews', 'ja') as ReactElement<{ locale: string }>;
    expect(dispatchedPage.type).toBe(ReviewsLegacyPage);
    expect(dispatchedPage.props.locale).toBe('ja');

    const page = ReviewsLegacyPage({ locale: 'ja' }) as ReactElement<{ locale: string }>;
    expect(page.type).toBe(ReviewsLegacyPageBody);
    expect(page.props.locale).toBe('ja');

    const body = ReviewsLegacyPageBody({ locale: 'ja' }) as ReactElement<{ children: ReactNode }>;
    const children = Children.toArray(body.props.children) as ReactElement<{ locale?: string }>[];
    const header = children.find(({ type }) => type === PageHeader);
    const board = children.find(({ type }) => type === ReviewBoard);

    expect(header?.props.locale).toBe('ja');
    expect(board?.props.locale).toBe('ja');
  });

  it('renders exact Japanese hero, form, options, disclosure, loading copy, and star labels', () => {
    const html = renderToStaticMarkup(<ReviewsLegacyPageBody locale="ja" />);

    for (const text of [
      japaneseHero.label,
      japaneseHero.title,
      japaneseHero.description,
      reviewLabels.ja.formTitle,
      reviewLabels.ja.moderationNote,
      reviewLabels.ja.nickname,
      reviewLabels.ja.nicknamePh,
      reviewLabels.ja.rating,
      reviewLabels.ja.service,
      reviewLabels.ja.content,
      reviewLabels.ja.contentPh,
      reviewLabels.ja.submit,
      reviewLabels.ja.reviewsTitle,
      reviewLabels.ja.loading,
      disclosure,
      ...reviewLabels.ja.serviceOptions.map(({ label }) => label),
    ]) {
      expect(html).toContain(text);
    }

    for (const star of [1, 2, 3, 4, 5]) {
      expect(html).toContain(`aria-label="${star}つ星"`);
    }
    for (const prohibited of [
      'Client Reviews',
      'Honest feedback from our valued clients.',
      'お客様の声',
      '実際のお客様',
      '本物の口コミ',
      '検証済み',
      '勝訴',
      '成功率',
    ]) {
      expect(html).not.toContain(prohibited);
    }
  });

  it('defines every exact Japanese status, error, empty, and summary label', () => {
    expect(reviewLabels.ja).toMatchObject({
      submitting: '投稿中…',
      success: 'ご投稿を受け付けました。内容確認後、掲載可否を判断します。',
      error: '投稿できませんでした。もう一度お試しください。',
      validationError: 'お名前またはニックネームとご感想をご確認ください。ご感想は20文字以上で入力してください。',
      rateLimitError: 'しばらく時間をおいてから、もう一度お試しください。同じ端末からの連続投稿は一時的に制限されます。',
      spamError: 'リンクまたはHTMLタグを含む内容は投稿できません。',
      noReviews: '現在、掲載中のご感想はありません。',
      totalReviews: '件',
      avgRating: '平均評価',
      loading: '読み込み中…',
      disclosure,
    });

    expect(getReviewErrorMessage('ja')).toBe(reviewLabels.ja.error);
    expect(getReviewErrorMessage('ja', 'content too short')).toBe(reviewLabels.ja.validationError);
    expect(getReviewErrorMessage('ja', 'too many submissions')).toBe(reviewLabels.ja.rateLimitError);
    expect(getReviewErrorMessage('ja', 'invalid submission')).toBe(reviewLabels.ja.spamError);
  });

  it('formats Japanese dates and maps only the stored service enum', () => {
    expect(reviewLabels.ja.serviceOptions.map(({ value }) => value)).toEqual([
      '',
      'consultation',
      'civil',
      'criminal',
      'company',
      'family',
      'labor',
      'ip',
      'retainer',
      'other',
    ]);
    expect(formatReviewDate('2026-07-04T01:02:03.000Z', 'ja')).toBe('2026年7月4日');
    expect(getReviewServiceLabel('consultation', 'ja')).toBe('法律相談');
    expect(getReviewServiceLabel('unmapped-service', 'ja')).toBe('unmapped-service');
  });

  it('renders raw review fields unchanged and only localizes the service label', () => {
    const rawReview = {
      id: 'raw-1',
      nickname: '原文 Nickname <保持>',
      rating: 4,
      service: 'criminal',
      content: 'Original 原文 그대로 — do not translate or normalize.',
      createdAt: '2026-07-04T01:02:03.000Z',
    };
    const html = renderToStaticMarkup(<ReviewCard review={rawReview} locale="ja" />);

    expect(html).toContain('原文 Nickname &lt;保持&gt;');
    expect(html).toContain('Original 原文 그대로 — do not translate or normalize.');
    expect(html).toContain('刑事事件');
    expect(html).toContain('2026年7月4日');
    expect(html).toContain('aria-label="4つ星"');
  });

  it.each([
    [
      'ko',
      '고객 후기',
      '후기 작성',
      '법률상담',
      ['법무법인 호정 후기', '대만 변호사 후기', '대만 회사설립 후기', '대만 소송 후기'],
    ],
    [
      'zh-hant',
      '客戶評價',
      '撰寫評價',
      '法律諮詢',
      ['昊鼎評價', '台灣律師評價', '台灣公司設立評價', '台灣訴訟評價'],
    ],
    [
      'en',
      'Client Reviews',
      'Write a Review',
      'Legal Consultation',
      ['Hovering reviews', 'Taiwan lawyer reviews', 'Taiwan legal service testimonials', 'Taiwan law firm feedback'],
    ],
  ] as const)('preserves representative %s metadata and visible copy', (locale, title, formTitle, service, keywords) => {
    const metadata = getReviewsLegacyMetadata(locale);
    const html = renderToStaticMarkup(<ReviewsLegacyPageBody locale={locale} />);

    expect(metadata.title).toBe(title);
    expect(metadata.keywords).toEqual(keywords);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/${locale}/reviews`);
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/reviews`,
      'zh-Hant': `${SITE_URL}/zh-hant/reviews`,
      en: `${SITE_URL}/en/reviews`,
      ja: `${SITE_URL}/ja/reviews`,
      'x-default': `${SITE_URL}/ko/reviews`,
    });
    expect(html).toContain(formTitle);
    expect(html).toContain(service);
    expect(html).not.toContain(disclosure);
  });
});
