import { describe, expect, it } from 'vitest';
import { guidanceContent, type GuidanceLocale } from '@/data/international-guidance-content';
import {
  GUIDANCE_EXTRA_ENGLISH_LANDING_PATHS,
  getGuidancePage,
  guidanceExtraContent,
  guidanceExtraEnglishLandingLabel,
  guidanceExtraLinkLabels,
  guidanceExtraRelated,
  guidanceExtraRelatedLabel,
} from '@/data/international-guidance-extra';
import {
  GUIDANCE_EXTRA_PAGE_KEYS,
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
} from '@/lib/public-guidance';

/**
 * The two B2B guidance pages (`company-setup`, `debt-collection`) in vi/id/th/fil.
 *
 * These pages have no source-language original and no attorney-review marker:
 * every proposition is a restatement of something already published, either on
 * the English intent pages (`/en/taiwan-company-setup-lawyer`,
 * `/en/taiwan-litigation-lawyer`) or in this locale's own `services` sections.
 * The assertions below are the mechanical half of that contract — the half a
 * per-language reading cannot check, because each language reads fine alone.
 */

const pages = GUIDANCE_LOCALES_4.flatMap((locale) =>
  GUIDANCE_EXTRA_PAGE_KEYS.map((pageKey) => ({
    locale,
    pageKey,
    page: guidanceExtraContent[locale][pageKey],
  })),
);

/** Every string a page publishes, as one blob per page. */
function pageText(locale: GuidanceLocale, pageKey: (typeof GUIDANCE_EXTRA_PAGE_KEYS)[number]): string {
  const page = guidanceExtraContent[locale][pageKey];
  return [
    page.eyebrow,
    page.title,
    page.description,
    page.intro,
    ...page.sections.flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.items ?? []),
    ]),
    ...(page.faqs ?? []).flatMap((faq) => [faq.question, faq.answer]),
  ].join('\n');
}

/**
 * The locale's own published refusal answer, located in the live FAQ page by
 * the "this page is written in <guidance language>" clause it opens with. Read
 * out of the data rather than written down here, so the test proves the extra
 * pages reuse the published sentence instead of a copy that has since drifted.
 */
const WRITTEN_IN_GUIDANCE_LANGUAGE: Record<GuidanceLocale, RegExp> = {
  vi: /viết bằng tiếng Việt/,
  id: /ditulis dalam bahasa Indonesia/,
  th: /จัดทำเป็นภาษาไทย/,
  fil: /Nakasulat sa Filipino/,
};

function publishedRefusalAnswer(locale: GuidanceLocale): string {
  const matches = (guidanceContent[locale].pages.faq.faqs ?? []).filter((faq) =>
    WRITTEN_IN_GUIDANCE_LANGUAGE[locale].test(faq.answer),
  );
  expect(matches, `${locale} refusal answer not found in the FAQ page`).toHaveLength(1);
  return matches[0]!.answer;
}

/**
 * Advertising-rule tokens (docs/seo/taiwan-lawyer-ad-rules-2026-08-18.md): no
 * win rate, no guarantee, no superlative, in any of the six languages a reader
 * or a reviewer of this file might use.
 */
const FORBIDDEN_CLAIM_TOKENS: ReadonlyArray<readonly [string, RegExp]> = [
  ['승소율', /승소율/],
  ['勝訴率', /勝訴率/],
  ['win rate', /win rate/i],
  ['guarantee', /guarantee/i],
  ['保證', /保證/],
  ['최고', /최고/],
  ['유일', /유일/],
];

const FORBIDDEN_CLAIM_TOKENS_BY_LOCALE: Record<
  GuidanceLocale,
  ReadonlyArray<readonly [string, RegExp]>
> = {
  vi: [
    ['tỷ lệ thắng', /tỷ lệ thắng/i],
    ['bảo đảm thắng', /bảo đảm thắng/i],
    ['tốt nhất', /tốt nhất/i],
    ['duy nhất', /duy nhất/i],
  ],
  id: [
    ['tingkat kemenangan', /tingkat kemenangan/i],
    ['jaminan menang', /jaminan menang/i],
    ['terbaik', /terbaik/i],
    ['satu-satunya', /satu-satunya/i],
  ],
  th: [
    ['อัตราการชนะ', /อัตราการชนะ/],
    ['รับประกัน', /รับประกัน/],
    ['ดีที่สุด', /ดีที่สุด/],
    ['แห่งเดียว', /แห่งเดียว/],
  ],
  fil: [
    ['win rate', /win rate/i],
    ['garantiya', /garantiya/i],
    ['pinakamahusay', /pinakamahusay/i],
    ['nag-iisa', /nag-iisa/i],
  ],
};

/**
 * Consultation-language contract. Each phrase below is the shape a "you can
 * consult us in <guidance language>" claim would take. It may appear only
 * inside the published refusal answer, which says the opposite; anywhere else
 * it is a defect, so the refusal answer is removed before the count is taken.
 */
const GUIDANCE_LANGUAGE_CONSULTATION_TOKENS: Record<
  GuidanceLocale,
  ReadonlyArray<readonly [string, RegExp]>
> = {
  vi: [['tư vấn bằng tiếng Việt', /tư vấn bằng tiếng Việt/gi]],
  id: [['konsultasi dalam bahasa Indonesia', /konsultasi dalam bahasa Indonesia/gi]],
  th: [['ปรึกษาเป็นภาษาไทย', /ปรึกษาเป็นภาษาไทย/g]],
  fil: [
    ['konsultasyon sa Filipino', /konsultasyon sa Filipino/gi],
    ['sa Tagalog', /sa Tagalog/gi],
  ],
};

const ATTORNEY_REVIEW_MARKER = '[변호사 검수 필요]';

describe('guidanceExtraContent', () => {
  it('covers 4 locales x 2 page keys and leaves the core ten untouched', () => {
    expect(GUIDANCE_EXTRA_PAGE_KEYS).toEqual(['company-setup', 'debt-collection']);
    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
    expect(pages).toHaveLength(8);

    for (const locale of GUIDANCE_LOCALES_4) {
      expect(Object.keys(guidanceExtraContent[locale]).sort()).toEqual(
        [...GUIDANCE_EXTRA_PAGE_KEYS].sort(),
      );
      // The extra keys are absent from the translation-lane module, which owns
      // the nav labels and therefore the header and footer.
      for (const pageKey of GUIDANCE_EXTRA_PAGE_KEYS) {
        expect(Object.keys(guidanceContent[locale].pages)).not.toContain(pageKey);
        expect(Object.keys(guidanceContent[locale].nav)).not.toContain(pageKey);
      }
    }
  });

  it('gives every page a header, four or five sections and at least five FAQs', () => {
    for (const { locale, pageKey, page } of pages) {
      const label = `${locale}/${pageKey}`;
      expect(page.eyebrow, `${label} eyebrow`).toBe(guidanceContent[locale].pages.home.eyebrow);
      expect(page.title.trim().length, `${label} title`).toBeGreaterThan(0);
      expect(page.intro.trim().length, `${label} intro`).toBeGreaterThan(0);

      const descriptionLength = [...page.description].length;
      expect(descriptionLength, `${label} description=${descriptionLength}`).toBeGreaterThanOrEqual(140);
      expect(descriptionLength, `${label} description=${descriptionLength}`).toBeLessThanOrEqual(160);

      expect(page.sections.length, `${label} sections`).toBeGreaterThanOrEqual(4);
      expect(page.sections.length, `${label} sections`).toBeLessThanOrEqual(5);
      for (const section of page.sections) {
        expect(section.heading.trim().length, `${label} section heading`).toBeGreaterThan(0);
        expect(section.paragraphs.length, `${label} section paragraphs`).toBeGreaterThan(0);
      }

      expect(page.faqs?.length ?? 0, `${label} faqs`).toBeGreaterThanOrEqual(5);
    }
  });

  it('gives all four locales the same section and FAQ counts per page', () => {
    for (const pageKey of GUIDANCE_EXTRA_PAGE_KEYS) {
      const shapes = GUIDANCE_LOCALES_4.map((locale) => ({
        locale,
        sections: guidanceExtraContent[locale][pageKey].sections.length,
        faqs: guidanceExtraContent[locale][pageKey].faqs?.length ?? 0,
      }));
      for (const shape of shapes) {
        expect(
          { sections: shape.sections, faqs: shape.faqs },
          `${pageKey} shape ${shape.locale} vs ${shapes[0]!.locale}`,
        ).toEqual({ sections: shapes[0]!.sections, faqs: shapes[0]!.faqs });
      }
    }
  });

  it('closes every page with the locale’s own published refusal answer, verbatim', () => {
    for (const { locale, pageKey, page } of pages) {
      const faqs = page.faqs ?? [];
      const last = faqs[faqs.length - 1];
      expect(last, `${locale}/${pageKey} has no closing FAQ`).toBeDefined();
      expect(last?.answer, `${locale}/${pageKey} closing FAQ is not the published refusal`).toBe(
        publishedRefusalAnswer(locale),
      );
      // The question itself must not carry the claim the answer refuses.
      for (const [label, pattern] of GUIDANCE_LANGUAGE_CONSULTATION_TOKENS[locale]) {
        expect(
          new RegExp(pattern.source, pattern.flags.replace('g', '')).test(last?.question ?? ''),
          `${locale}/${pageKey} closing question contains "${label}"`,
        ).toBe(false);
      }
    }
  });

  it('publishes no win-rate, guarantee or superlative claim', () => {
    for (const { locale, pageKey } of pages) {
      const text = pageText(locale, pageKey);
      for (const [label, pattern] of [
        ...FORBIDDEN_CLAIM_TOKENS,
        ...FORBIDDEN_CLAIM_TOKENS_BY_LOCALE[locale],
      ]) {
        expect(pattern.test(text), `${locale}/${pageKey} contains "${label}"`).toBe(false);
      }
    }
  });

  it('publishes no fee figure and no grouped number at all', () => {
    for (const { locale, pageKey } of pages) {
      const text = pageText(locale, pageKey);
      expect(/NT\$/.test(text), `${locale}/${pageKey} names a NT$ figure`).toBe(false);
      expect(
        /\d{1,3}(,\d{3})+/.test(text),
        `${locale}/${pageKey} names a grouped number`,
      ).toBe(false);
    }
  });

  it('carries no attorney-review marker', () => {
    for (const { locale, pageKey } of pages) {
      expect(
        pageText(locale, pageKey).includes(ATTORNEY_REVIEW_MARKER),
        `${locale}/${pageKey} carries ${ATTORNEY_REVIEW_MARKER}`,
      ).toBe(false);
    }
  });

  it('never implies a consultation in the page language outside the refusal answer', () => {
    for (const { locale, pageKey } of pages) {
      const refusal = publishedRefusalAnswer(locale);
      const text = pageText(locale, pageKey).split(refusal).join('\n');
      for (const [label, pattern] of GUIDANCE_LANGUAGE_CONSULTATION_TOKENS[locale]) {
        const hits = text.match(pattern) ?? [];
        expect(hits.length, `${locale}/${pageKey} implies a consultation via "${label}"`).toBe(0);
      }
    }
  });

  it('names the English landing path in its own body copy', () => {
    for (const { locale, pageKey } of pages) {
      const landing = GUIDANCE_EXTRA_ENGLISH_LANDING_PATHS[pageKey];
      expect(
        pageText(locale, pageKey),
        `${locale}/${pageKey} must name ${landing}`,
      ).toContain(landing);
    }
  });

  it('routes core pages into the new pages and back out again', () => {
    expect(Object.keys(guidanceExtraRelated).sort()).toEqual(
      ['contact', 'home', 'pricing', 'services'],
    );
    for (const keys of Object.values(guidanceExtraRelated)) {
      expect(keys).toEqual([...GUIDANCE_EXTRA_PAGE_KEYS]);
    }

    for (const locale of GUIDANCE_LOCALES_4) {
      expect(guidanceExtraRelatedLabel[locale].trim().length).toBeGreaterThan(0);
      expect(guidanceExtraEnglishLandingLabel[locale].trim().length).toBeGreaterThan(0);
      for (const pageKey of GUIDANCE_EXTRA_PAGE_KEYS) {
        expect(guidanceExtraLinkLabels[locale][pageKey].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('resolves both key families through one lookup', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      for (const pageKey of GUIDANCE_PAGE_KEYS) {
        expect(getGuidancePage(locale, pageKey)).toBe(guidanceContent[locale].pages[pageKey]);
      }
      for (const pageKey of GUIDANCE_EXTRA_PAGE_KEYS) {
        expect(getGuidancePage(locale, pageKey)).toBe(guidanceExtraContent[locale][pageKey]);
      }
    }
  });
});
