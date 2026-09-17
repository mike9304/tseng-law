import { describe, expect, it } from 'vitest';
import { getPublicIntentSearchDocs } from '../public-intent-docs';
import { augmentStaticDocs } from '../augment-static-docs';
import { buildSearchIndex } from '../index-builder';
import { runSearchQuery } from '../query-engine';
import type { SearchDoc, SearchIndex } from '../types';

const blogEn: SearchDoc = {
  id: 'blog:en:company-setup',
  kind: 'blog',
  locale: 'en',
  title: 'Taiwan Company Setup Basics',
  url: '/en/columns/company-setup',
  summary: 'How to set up a company in Taiwan.',
  body: 'A guide to the company setup process in Taiwan.',
};

const faqEn: SearchDoc = {
  id: 'faq:en:consult',
  kind: 'faq',
  locale: 'en',
  title: 'Consultation FAQ',
  url: '/en/faq#consult',
  summary: 'FAQ summary',
  body: 'Consultation hours and booking.',
};

const portfolioEn: SearchDoc = {
  id: 'portfolio:en:pf-1',
  kind: 'portfolio',
  locale: 'en',
  title: 'Portfolio One',
  url: '/en/portfolio/portfolio-one',
  summary: 'Portfolio summary',
  body: 'Portfolio body about a civil case.',
};

const blogJa: SearchDoc = {
  id: 'blog:ja:taiwan-company-establishment-basics',
  kind: 'blog',
  locale: 'ja',
  title: '台湾会社設立の基本',
  url: '/ja/columns/taiwan-company-establishment-basics',
  summary: '台湾での会社設立の流れを解説します。',
  body: '台湾での会社設立の手順と留意点をまとめました。',
};

const faqKo: SearchDoc = {
  id: 'faq:ko:consult',
  kind: 'faq',
  locale: 'ko',
  title: '상담 FAQ',
  url: '/ko/faq#consult',
  summary: '상담 요약',
  body: '상담 시간과 예약 안내.',
};

const portfolioKo: SearchDoc = {
  id: 'portfolio:ko:pf-1',
  kind: 'portfolio',
  locale: 'ko',
  title: '포트폴리오 원',
  url: '/ko/portfolio/portfolio-one',
  summary: '포트폴리오 요약',
  body: '민사 사건 포트폴리오 본문.',
};

function freezeDeep<T>(value: T): T {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) {
      freezeDeep(nested);
    }
  }
  return value;
}

function indexWithoutJa(index: SearchIndex): SearchIndex {
  const byLocale = { ...index.byLocale };
  const invertedByLocale = { ...index.invertedByLocale };
  delete (byLocale as { ja?: SearchDoc[] }).ja;
  delete (invertedByLocale as { ja?: Record<string, string[]> }).ja;
  return {
    builtAt: index.builtAt,
    byLocale,
    invertedByLocale,
  } as SearchIndex;
}

describe('augmentStaticDocs', () => {
  const stored = {
    ...buildSearchIndex([blogEn, faqEn, portfolioEn, blogJa, faqKo, portfolioKo]),
    builtAt: '2026-01-15T08:00:00.000Z',
  };

  it('is a no-op for KO/ZH and for empty added docs', () => {
    expect(augmentStaticDocs(stored, 'ko', getPublicIntentSearchDocs('en'))).toBe(stored);
    expect(augmentStaticDocs(stored, 'zh-hant', getPublicIntentSearchDocs('ja'))).toBe(stored);
    expect(augmentStaticDocs(stored, 'en', [])).toBe(stored);
    expect(augmentStaticDocs(stored, 'ja', [])).toBe(stored);
  });

  it('makes missing EN/JA exact URLs searchable without rewriting other locales or builtAt', () => {
    expect(
      runSearchQuery({ index: stored, query: 'corporate', locale: 'en' }).map((hit) => hit.doc.url),
    ).not.toContain('/en/taiwan-lawyer#corporate-advisory');
    expect(
      runSearchQuery({ index: stored, query: '顧問', locale: 'ja' }).map((hit) => hit.doc.url),
    ).not.toContain('/ja/taiwan-lawyer#corporate-advisory');

    const enDocs = getPublicIntentSearchDocs('en');
    const jaDocs = getPublicIntentSearchDocs('ja');
    const enAugmented = augmentStaticDocs(stored, 'en', enDocs);
    const jaAugmented = augmentStaticDocs(stored, 'ja', jaDocs);

    expect(enAugmented).not.toBe(stored);
    expect(enAugmented.builtAt).toBe('2026-01-15T08:00:00.000Z');
    expect(enAugmented.byLocale.ko).toBe(stored.byLocale.ko);
    expect(enAugmented.byLocale['zh-hant']).toBe(stored.byLocale['zh-hant']);
    expect(enAugmented.byLocale.ja).toBe(stored.byLocale.ja);
    expect(enAugmented.invertedByLocale.ko).toBe(stored.invertedByLocale.ko);
    expect(enAugmented.invertedByLocale.ja).toBe(stored.invertedByLocale.ja);
    expect(enAugmented.byLocale.en.slice(0, stored.byLocale.en.length).map((doc) => doc.id)).toEqual(
      stored.byLocale.en.map((doc) => doc.id),
    );
    expect(enAugmented.byLocale.en[0]).toBe(stored.byLocale.en[0]);

    const enHits = runSearchQuery({ index: enAugmented, query: 'corporate', locale: 'en' });
    expect(enHits.some((hit) => hit.doc.url === '/en/taiwan-lawyer#corporate-advisory')).toBe(true);
    expect(
      runSearchQuery({ index: enAugmented, query: 'litigation', locale: 'en' }).some(
        (hit) => hit.doc.url === '/en/taiwan-litigation-lawyer',
      ),
    ).toBe(true);
    expect(
      runSearchQuery({ index: enAugmented, query: 'setup', locale: 'en' }).some(
        (hit) => hit.doc.url === '/en/taiwan-company-setup-lawyer',
      ),
    ).toBe(true);

    const jaHits = runSearchQuery({ index: jaAugmented, query: '顧問', locale: 'ja' });
    expect(jaHits.some((hit) => hit.doc.url === '/ja/taiwan-lawyer#corporate-advisory')).toBe(true);
    expect(
      runSearchQuery({ index: jaAugmented, query: '会社設立', locale: 'ja' }).some(
        (hit) => hit.doc.url === '/ja/taiwan-company-setup-lawyer',
      ),
    ).toBe(true);
    expect(
      runSearchQuery({ index: jaAugmented, query: '訴訟', locale: 'ja' }).some(
        (hit) => hit.doc.url === '/ja/taiwan-litigation-lawyer',
      ),
    ).toBe(true);
  });

  it('preserves existing blog, FAQ, and portfolio hits and honors kinds=blog', () => {
    const augmented = augmentStaticDocs(stored, 'en', getPublicIntentSearchDocs('en'));

    expect(
      runSearchQuery({ index: augmented, query: 'setup', locale: 'en', kinds: ['blog'] }).map(
        (hit) => hit.doc.url,
      ),
    ).toEqual(['/en/columns/company-setup']);
    expect(
      runSearchQuery({ index: augmented, query: 'Consultation', locale: 'en' }).some(
        (hit) => hit.doc.id === 'faq:en:consult',
      ),
    ).toBe(true);
    expect(
      runSearchQuery({ index: augmented, query: 'Portfolio', locale: 'en' }).some(
        (hit) => hit.doc.id === 'portfolio:en:pf-1',
      ),
    ).toBe(true);
    expect(
      runSearchQuery({ index: stored, query: '상담', locale: 'ko' }).map((hit) => hit.doc.id),
    ).toEqual(
      runSearchQuery({
        index: augmentStaticDocs(stored, 'en', getPublicIntentSearchDocs('en')),
        query: '상담',
        locale: 'ko',
      }).map((hit) => hit.doc.id),
    );
  });

  it('keeps an existing document when a static URL collides and treats hashes as distinct arrivals', () => {
    const existingLawyer: SearchDoc = {
      id: 'page:en:custom-taiwan-lawyer',
      kind: 'page',
      locale: 'en',
      title: 'Already stored Taiwan lawyer page',
      url: '/en/taiwan-lawyer',
      summary: 'Stored summary',
      body: 'Already indexed taiwan lawyer page',
    };
    const withCollision = {
      ...buildSearchIndex([existingLawyer, blogEn]),
      builtAt: '2026-02-01T00:00:00.000Z',
    };

    const result = augmentStaticDocs(withCollision, 'en', getPublicIntentSearchDocs('en'));
    const lawyerDocs = result.byLocale.en.filter((doc) => doc.url === '/en/taiwan-lawyer');

    expect(lawyerDocs).toHaveLength(1);
    expect(lawyerDocs[0]).toBe(withCollision.byLocale.en[0]);
    expect(lawyerDocs[0].id).toBe('page:en:custom-taiwan-lawyer');
    expect(result.byLocale.en.some((doc) => doc.url === '/en/taiwan-lawyer#corporate-advisory')).toBe(
      true,
    );
    expect(
      runSearchQuery({ index: result, query: 'corporate', locale: 'en' }).some(
        (hit) => hit.doc.url === '/en/taiwan-lawyer#corporate-advisory',
      ),
    ).toBe(true);
    expect(
      runSearchQuery({ index: result, query: 'Already', locale: 'en' }).some(
        (hit) => hit.doc.url === '/en/taiwan-lawyer',
      ),
    ).toBe(true);
  });

  it('is idempotent and does not mutate a frozen stored index', () => {
    const frozen = freezeDeep({
      ...buildSearchIndex([blogEn, faqKo]),
      builtAt: '2026-03-01T00:00:00.000Z',
    });
    const docs = getPublicIntentSearchDocs('en');

    expect(() => augmentStaticDocs(frozen, 'en', docs)).not.toThrow();
    const once = augmentStaticDocs(frozen, 'en', docs);
    const twice = augmentStaticDocs(once, 'en', docs);

    expect(once.builtAt).toBe(frozen.builtAt);
    expect(twice).toBe(once);
    expect(twice.byLocale.en.map((doc) => doc.id)).toEqual(once.byLocale.en.map((doc) => doc.id));
    expect(frozen.byLocale.en.map((doc) => doc.id)).toEqual(['blog:en:company-setup']);
  });

  it('defensively indexes JA docs when an inherited stored index omits byLocale.ja', () => {
    const legacy = indexWithoutJa({
      ...buildSearchIndex([faqKo, portfolioKo, blogEn]),
      builtAt: '2025-12-01T00:00:00.000Z',
    });

    expect(legacy.byLocale.ja).toBeUndefined();
    const result = augmentStaticDocs(legacy, 'ja', getPublicIntentSearchDocs('ja'));

    expect(result.builtAt).toBe('2025-12-01T00:00:00.000Z');
    expect(result.byLocale.ko).toBe(legacy.byLocale.ko);
    expect(result.invertedByLocale.ko).toBe(legacy.invertedByLocale.ko);
    expect(result.byLocale.en).toBe(legacy.byLocale.en);
    expect(result.byLocale.ja).toHaveLength(4);
    expect(
      runSearchQuery({ index: result, query: '会社設立', locale: 'ja' }).some(
        (hit) => hit.doc.url === '/ja/taiwan-company-setup-lawyer',
      ),
    ).toBe(true);
    expect(
      runSearchQuery({ index: result, query: '顧問', locale: 'ja' }).some(
        (hit) => hit.doc.url === '/ja/taiwan-lawyer#corporate-advisory',
      ),
    ).toBe(true);
  });
});
