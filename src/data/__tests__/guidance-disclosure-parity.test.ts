import { describe, expect, it } from 'vitest';
import {
  guidanceContent,
  type GuidanceLocale,
  type GuidancePageKey,
} from '@/data/international-guidance-content';
import { guidanceAnswers } from '@/data/international-guidance-answers';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';

/**
 * Disclosure-element parity across the four guidance languages.
 *
 * Why this test exists (WO-O37): the guidance copy has no source-language
 * original. vi/id/th/fil sit side by side in the data files and nothing was
 * ever compared across them, so a disclaimer element could be present in one
 * language and simply absent in another — and a per-language review could not
 * see it, because each language reads fine on its own. The four-language pivot
 * back-gloss found exactly that: `contact/1/p0` carried three limiting
 * statements in Vietnamese, two in Indonesian and one in Thai and Filipino.
 *
 * What the test asserts, and what it deliberately does not:
 *
 *   - It never asserts a sentence. No expected copy is written down here, so
 *     rewording a paragraph in one language does not break it.
 *   - Each disclosure element is named by a stable KEY. For every key the
 *     registry records, per locale, the marker that language uses for that
 *     element — the token, not the sentence.
 *   - The assertion is differential: for each surface it derives the SET OF
 *     KEYS actually present in the live data for each locale, and requires the
 *     four sets to be equal. Dropping a limiting statement from one language
 *     makes that language's set smaller than the other three and fails.
 *
 * A reader-protection statement is a union, never a majority vote: if one
 * language carries it, its absence anywhere else is the defect. Each surface's `required` list
 * therefore also has a second test demanding that every registered element be
 * present in all four, so "all four dropped it" cannot pass as parity alone.
 */

const LOCALES = ['vi', 'id', 'th', 'fil'] as const satisfies readonly GuidanceLocale[];

/** Per-locale marker for one disclosure element. */
type ElementMarkers = Record<GuidanceLocale, RegExp>;

/**
 * The disclosure elements, by key.
 *
 * Each marker is the shortest token that identifies the element in that
 * language. Markers are intentionally not full sentences: the point is to
 * detect the presence of a proposition, not to freeze its wording.
 */
const ELEMENTS = {
  /** The reply confirms a way to communicate only if a workable one exists. */
  'feasible-method-only': {
    vi: /khả thi/i,
    id: /memungkinkan/i,
    th: /เป็นไปได้/,
    fil: /posible/i,
  },
  /** Support in a language outside the four consultation languages is not guaranteed. */
  'no-other-language-guarantee': {
    vi: /ngôn ngữ (nào ngoài|khác)/i,
    id: /bahasa lain/i,
    th: /ภาษาอื่น/,
    fil: /(ibang|alinmang) wika/i,
  },
  /** No reply time is promised. */
  'no-reply-time-promise': {
    vi: /thời gian phản hồi/i,
    id: /waktu balasan/i,
    th: /ระยะเวลา(ในการ)?ตอบกลับ/,
    fil: /panahon ng pagsagot/i,
  },
  /** The confirmation step is a step, not a promise. */
  'confirmation-is-not-a-promise': {
    vi: /không phải lời hứa/i,
    id: /bukan janji\./i,
    th: /ไม่ใช่คำมั่น/,
    fil: /hindi pangako/i,
  },
  /** No interpreter is arranged. */
  'no-interpreter-promise': {
    vi: /phiên dịch/i,
    id: /penerjemah/i,
    th: /ล่าม/,
    fil: /interpreter/i,
  },
  /** Not every matter can be accepted. */
  'not-every-matter-accepted': {
    vi: /mọi vụ việc/i,
    id: /setiap perkara/i,
    th: /ได้ทุกเรื่อง/,
    fil: /bawat usapin/i,
  },
  /** No outcome is promised. */
  'no-outcome-promise': {
    vi: /kết quả/i,
    id: /hasil/i,
    th: /รับประกันผล/,
    fil: /resulta/i,
  },
  /** A certain answer needs one of the four consultation languages. */
  'four-consultation-languages': {
    vi: /bốn ngôn ngữ tư vấn/i,
    id: /empat bahasa konsultasi/i,
    th: /4 ภาษาที่ใช้ให้คำปรึกษา/,
    fil: /apat na wika ng konsultasyon/i,
  },
  /** This page is not the consultation step. */
  'not-the-consultation-step': {
    vi: /bước tư vấn/i,
    id: /tahap konsultasi/i,
    th: /ขั้นตอนการให้คำปรึกษา/,
    fil: /hakbang ng konsultasyon/i,
  },
  /** A sent message is not legal advice. */
  'not-legal-advice': {
    vi: /ý kiến pháp lý/i,
    id: /nasihat hukum/i,
    th: /ความเห็นทางกฎหมาย/,
    fil: /legal na payo/i,
  },
  /** A sent message is not a confirmed appointment. */
  'not-an-appointment': {
    vi: /lịch hẹn/i,
    id: /janji temu/i,
    th: /การนัดหมาย/,
    fil: /appointment/i,
  },
  /** Sending a message forms no attorney–client relationship. */
  'no-attorney-client-relationship': {
    vi: /quan hệ giữa luật sư/i,
    id: /hubungan antara advokat/i,
    th: /ความสัมพันธ์ระหว่างทนายความ/,
    fil: /ugnayan ng abogado/i,
  },
  /** Written text is never machine-translated for the reader. */
  'no-automatic-translation': {
    vi: /dịch tự động/i,
    id: /diterjemahkan secara otomatis/i,
    th: /แปลโดยอัตโนมัติ/,
    fil: /awtomatikong isinasalin/i,
  },
  /** The family group is named as covering marriage matters. */
  'marriage-in-family-group': {
    vi: /hôn nhân/i,
    id: /perkawinan/i,
    th: /การสมรส/,
    fil: /pag-aasawa/i,
  },
  /** Meeting the attorney may be a paid service. */
  'consultation-may-be-paid': {
    vi: /thu phí/i,
    id: /berbayar/i,
    th: /บริการที่มีค่าใช้จ่าย/,
    fil: /bayad na serbisyo/i,
  },
} as const satisfies Record<string, ElementMarkers>;

type ElementKey = keyof typeof ELEMENTS;

/** One reader-facing surface whose disclosure elements must match across locales. */
type Surface = {
  /** Human-readable slot name, in the pivot's `{page} / {section}` index form. */
  readonly id: string;
  /** The elements this surface must carry in every language. */
  readonly required: readonly ElementKey[];
  /** Reads the surface's whole text for one locale. */
  readonly read: (locale: GuidanceLocale) => string;
};

function section(page: GuidancePageKey, index: number) {
  return (locale: GuidanceLocale): string => {
    const target = guidanceContent[locale].pages[page].sections[index];
    if (!target) throw new Error(`${locale}: ${page} has no section ${index}`);
    return [target.heading, ...target.paragraphs, ...(target.items ?? [])].join(' ');
  };
}

function lastSection(page: GuidancePageKey) {
  return (locale: GuidanceLocale): string => {
    const sections = guidanceContent[locale].pages[page].sections;
    const target = sections[sections.length - 1];
    if (!target) throw new Error(`${locale}: ${page} has no sections`);
    return [target.heading, ...target.paragraphs, ...(target.items ?? [])].join(' ');
  };
}

function answer(page: 'services' | 'about' | 'pricing' | 'contact' | 'faq') {
  return (locale: GuidanceLocale): string => guidanceAnswers[locale][page]?.answer ?? '';
}

function faqItem(index: number) {
  return (locale: GuidanceLocale): string => {
    const item = guidanceContent[locale].pages.faq.faqs?.[index];
    if (!item) throw new Error(`${locale}: faq has no item ${index}`);
    return `${item.question} ${item.answer}`;
  };
}

function pageIntro(page: GuidancePageKey) {
  return (locale: GuidanceLocale): string => guidanceContent[locale].pages[page].intro;
}

const SURFACES: readonly Surface[] = [
  {
    id: 'contact / 1 (when the four consultation languages do not work for you)',
    required: [
      'feasible-method-only',
      'no-other-language-guarantee',
      'no-reply-time-promise',
      'confirmation-is-not-a-promise',
      'no-interpreter-promise',
      'not-every-matter-accepted',
    ],
    read: section('contact', 1),
  },
  {
    id: 'contact / 3 (what this page does not guarantee)',
    required: [
      'no-reply-time-promise',
      'not-an-appointment',
      'no-interpreter-promise',
      'no-automatic-translation',
    ],
    read: section('contact', 3),
  },
  {
    id: 'services / last (scope and how it is confirmed)',
    required: ['no-outcome-promise', 'no-reply-time-promise'],
    read: lastSection('services'),
  },
  {
    id: 'about / 2 (when you contact the office)',
    required: ['no-outcome-promise', 'four-consultation-languages'],
    read: section('about', 2),
  },
  {
    id: 'columns / 2 (how far an article can be relied on)',
    required: ['not-the-consultation-step'],
    read: section('columns', 2),
  },
  {
    id: 'inquiry / methodConfirmationNotice',
    required: [
      'feasible-method-only',
      'no-other-language-guarantee',
      'no-reply-time-promise',
    ],
    read: (locale) => internationalInquiryCopy[locale].methodConfirmationNotice,
  },
  {
    id: 'answers / faq',
    required: [
      'not-legal-advice',
      'not-an-appointment',
      'no-attorney-client-relationship',
    ],
    read: answer('faq'),
  },
  {
    id: 'answers / pricing',
    required: ['consultation-may-be-paid'],
    read: answer('pricing'),
  },
  {
    id: 'answers / contact',
    required: ['no-reply-time-promise', 'not-an-appointment'],
    read: answer('contact'),
  },
  {
    id: 'answers / about',
    required: ['no-outcome-promise'],
    read: answer('about'),
  },
  {
    id: 'faq / q2 (can I be advised in this language?)',
    required: ['no-interpreter-promise', 'no-automatic-translation'],
    read: faqItem(2),
  },
  {
    id: 'faq / q4 (how the text you wrote is handled)',
    required: ['no-automatic-translation'],
    read: faqItem(4),
  },
  {
    id: 'home / intro (matter groups named in the lead)',
    required: ['marriage-in-family-group'],
    read: pageIntro('home'),
  },
  {
    id: 'home / 2 (the six matter groups)',
    required: ['marriage-in-family-group'],
    read: section('home', 2),
  },
  {
    id: 'services / 2 (marriage, family and inheritance)',
    required: ['marriage-in-family-group'],
    read: section('services', 2),
  },
  {
    id: 'faq / q0 (which matters the office takes)',
    required: ['marriage-in-family-group'],
    read: faqItem(0),
  },
  {
    id: 'answers / services',
    required: ['marriage-in-family-group'],
    read: answer('services'),
  },
];

/** The keys actually present in one locale's text for one surface. */
function elementsPresent(locale: GuidanceLocale, text: string): ElementKey[] {
  return (Object.keys(ELEMENTS) as ElementKey[]).filter((key) =>
    ELEMENTS[key][locale].test(text),
  );
}

describe('guidance disclosure elements are the same set in all four languages', () => {
  it('derives an identical element-key set per surface for vi, id, th and fil', () => {
    for (const surface of SURFACES) {
      const perLocale = LOCALES.map((locale) => {
        const text = surface.read(locale);
        expect(text.trim().length, `${surface.id} / ${locale} is empty`).toBeGreaterThan(0);
        // Restrict to the elements this surface is about, so an unrelated
        // element that only one language happens to mention nearby does not
        // masquerade as a parity failure.
        const scoped = new Set<string>(surface.required);
        return {
          locale,
          keys: elementsPresent(locale, text).filter((key) => scoped.has(key)),
        };
      });

      const [reference, ...others] = perLocale;
      for (const other of others) {
        expect(
          other.keys.slice().sort(),
          `${surface.id}: ${other.locale} carries a different set of disclosure elements than ${reference.locale}`,
        ).toEqual(reference.keys.slice().sort());
      }
    }
  });

  it('carries every registered element of a surface in every language', () => {
    for (const surface of SURFACES) {
      for (const locale of LOCALES) {
        const text = surface.read(locale);
        for (const key of surface.required) {
          expect(
            ELEMENTS[key][locale].test(text),
            `${surface.id} / ${locale} is missing the "${key}" disclosure element`,
          ).toBe(true);
        }
      }
    }
  });

  /**
   * Chinese-character glosses, e.g. `離婚`, `戶籍`, `勞動契約`, `臺北`.
   *
   * A gloss is a fact the reader can carry to a Taiwanese office or court, so
   * one language annotating a term while another does not is a defect, not a
   * style choice (WO-O37 rule 4). The test reads the glosses out of the copy
   * itself — nothing is written down here except the two tokens the pivot
   * classified as wording rather than fact.
   */
  const HANJA_WORDING_EXEMPTIONS = new Set([
    // Only Indonesian repeats `(中文)` after the word for the Chinese
    // consultation language. The pivot classified this as a per-language
    // spelling habit, not a missing fact: all four name that language.
    '中文',
    // Only Indonesian names the two-character firm short-form `昊鼎` on its
    // own; the other three write 昊 and 鼎 separately in the same sentence and
    // all four carry the full 昊鼎國際法律事務所.
    '昊鼎',
  ]);

  it('annotates the same Chinese-character terms in all four languages', () => {
    const CJK = /[\u3400-\u4dbf\u4e00-\u9fff]+/g;
    const glossesOf = (locale: GuidanceLocale, key: GuidancePageKey) => {
      const page = guidanceContent[locale].pages[key];
      const text = [
        page.eyebrow,
        page.title,
        page.description,
        page.intro,
        ...page.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.items ?? [])]),
        ...(page.faqs ?? []).flatMap((f) => [f.question, f.answer]),
      ].join(' ');
      return [...new Set(text.match(CJK) ?? [])]
        .filter((token) => !HANJA_WORDING_EXEMPTIONS.has(token))
        .sort();
    };

    const [reference, ...others] = LOCALES;
    for (const key of Object.keys(guidanceContent[reference].pages) as GuidancePageKey[]) {
      for (const locale of others) {
        expect(
          glossesOf(locale, key),
          `${key}: ${locale} annotates a different set of Chinese-character terms than ${reference}`,
        ).toEqual(glossesOf(reference, key));
      }
    }
  });

  it('keeps the same page and section shape in all four languages', () => {
    const [reference, ...others] = LOCALES;
    const shapeOf = (locale: GuidanceLocale) =>
      Object.fromEntries(
        Object.entries(guidanceContent[locale].pages).map(([key, page]) => [
          key,
          {
            sections: page.sections.length,
            paragraphs: page.sections.map((s) => s.paragraphs.length),
            items: page.sections.map((s) => s.items?.length ?? 0),
            faqs: page.faqs?.length ?? 0,
          },
        ]),
      );
    for (const locale of others) {
      expect(shapeOf(locale), `${locale} page shape differs from ${reference}`).toEqual(
        shapeOf(reference),
      );
    }
  });
});
