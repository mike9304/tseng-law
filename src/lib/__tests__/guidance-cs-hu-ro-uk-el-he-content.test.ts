import { describe, expect, it } from 'vitest';
import { guidanceAnswers } from '@/data/international-guidance-answers';
import {
  guidanceContent,
  type GuidanceLocaleContent,
} from '@/data/international-guidance-content';
import {
  guidanceFooterCopy,
  guidanceOfficeCopy,
} from '@/data/international-guidance-offices';
import {
  guidanceLanguageNames,
  guidancePracticeAreaNames,
  guidanceTeamBios,
  guidanceTeamCopy,
} from '@/data/international-guidance-team';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { GUIDANCE_LLMS_NOTICES } from '@/lib/llms-txt';
import {
  GUIDANCE_CONSULTATION_LANGUAGE_LOCALES,
  GUIDANCE_PAGE_KEYS,
  isGuidanceConsultationLanguageLocale,
} from '@/lib/public-guidance';

const EASTERN = ['cs', 'hu', 'ro', 'uk', 'el', 'he'] as const;
type EasternLocale = (typeof EASTERN)[number];
type Labelled = readonly [path: string, value: string];

/** The four consultation languages as they are named in each pack's contact/FAQ copy. */
const CONSULTATION_FOUR: Record<EasternLocale, readonly string[]> = {
  cs: ['anglicky', 'čínsky', 'japonsky', 'korejsky'],
  hu: ['angolul', 'kínaiul', 'japánul', 'koreaiul'],
  ro: ['engleză', 'chineză', 'japoneză', 'coreeană'],
  uk: ['англійською', 'китайською', 'японською', 'корейською'],
  el: ['αγγλικά', 'κινεζικά', 'ιαπωνικά', 'κορεατικά'],
  he: ['אנגלית', 'סינית', 'יפנית', 'קוריאנית'],
};

const LANGUAGE_FAQ_QUESTION: Record<EasternLocale, string> = {
  cs: 'Je možná porada v češtině?',
  hu: 'Lehetséges magyar nyelvű tanácsadás?',
  ro: 'Este posibilă o consultanță în limba română?',
  uk: 'Чи можлива консультація українською?',
  el: 'Είναι δυνατή η συμβουλευτική στα ελληνικά;',
  he: 'האם אפשר לקבל ייעוץ בעברית?',
};

const NEGATIVE_ANSWER_START: Record<EasternLocale, RegExp> = {
  cs: /^Ne\./,
  hu: /^Nem\./,
  ro: /^Nu\./,
  uk: /^Ні\./,
  el: /^Όχι\./,
  he: /^לא\./,
};

/** Advertising / consultation claims that must not appear anywhere in the pack. */
const FORBIDDEN: Record<EasternLocale, ReadonlyArray<readonly [string, RegExp]>> = {
  cs: [
    ['úspěšnost', /úspěšnost/i],
    ['nejlepší', /nejlepší/i],
    ['jediná kancelář', /jedin[áý] (advokátní )?kancelář/i],
    ['bezplatná porada', /bezplatn[áé] porad|porad[ay] zdarma/i],
    ['24/7', /24\/7|nonstop/i],
  ],
  hu: [
    ['sikerarány', /sikerarány/i],
    ['legjobb', /legjobb/i],
    ['egyetlen iroda', /egyetlen (ügyvédi )?iroda/i],
    ['ingyenes tanácsadás', /ingyenes tanácsadás/i],
    ['24/7', /24\/7|éjjel-nappal/i],
  ],
  ro: [
    ['rata de succes', /rat[aă] de succes/i],
    ['cel mai bun', /cel mai bun|cea mai bun[aă]/i],
    ['singurul cabinet', /singurul cabinet/i],
    ['consultanță gratuită', /consultan[țt][aă] gratuit[aă]/i],
    ['24/7', /24\/7|non-stop/i],
  ],
  uk: [
    ['відсоток успіху', /відсоток успіх|показник успішност/i],
    ['найкращ', /найкращ/i],
    ['єдина фірма', /єдин[аи][йх]? (юридичн[аи][йх]? )?фірм/i],
    ['безкоштовн', /безкоштовн/i],
    ['24/7', /24\/7|цілодобов/i],
  ],
  el: [
    ['ποσοστό επιτυχίας', /ποσοστ[όο] επιτυχίας/i],
    ['καλύτερ', /καλύτερ/i],
    ['μοναδικό γραφείο', /μοναδικ[όο] (δικηγορικ[όο] )?γραφείο/i],
    ['δωρεάν συμβουλευτική', /δωρεάν (συμβουλευτική|πρώτη|συζήτηση|ραντεβού)/i],
    ['24/7', /24\/7|24ωρ/i],
  ],
  he: [
    ['אחוזי הצלחה', /אחוזי הצלחה/],
    ['הטוב ביותר', /הטוב ביותר|הטובה ביותר/],
    ['המשרד היחיד', /המשרד היחיד/],
    ['ייעוץ חינם', /ייעוץ (ב)?חינם|פגישה (ב)?חינם|שיחה ראשונה (ב)?חינם/],
    ['24/7', /24\/7|מסביב לשעון/],
  ],
};

function collectStrings(value: unknown, path = ''): Labelled[] {
  if (typeof value === 'string') return [[path, value]];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStrings(item, `${path}[${index}]`));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      collectStrings(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf);
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, shapeOf(record[key])]),
    );
  }
  return typeof value;
}

function packStrings(locale: EasternLocale): Labelled[] {
  return [
    ...collectStrings(guidanceContent[locale], `guidanceContent.${locale}`),
    ...collectStrings(guidanceOfficeCopy[locale], `guidanceOfficeCopy.${locale}`),
    ...collectStrings(guidanceFooterCopy[locale], `guidanceFooterCopy.${locale}`),
    ...collectStrings(guidanceTeamCopy[locale], `guidanceTeamCopy.${locale}`),
    ...collectStrings(guidanceLanguageNames[locale], `guidanceLanguageNames.${locale}`),
    ...collectStrings(guidancePracticeAreaNames[locale], `guidancePracticeAreaNames.${locale}`),
    ...collectStrings(guidanceTeamBios[locale], `guidanceTeamBios.${locale}`),
    ...collectStrings(internationalInquiryCopy[locale], `internationalInquiryCopy.${locale}`),
    ...collectStrings(GUIDANCE_LLMS_NOTICES[locale], `GUIDANCE_LLMS_NOTICES.${locale}`),
    ...collectStrings(guidanceAnswers[locale], `guidanceAnswers.${locale}`),
  ];
}

function allText(locale: EasternLocale): string {
  return packStrings(locale).map(([, value]) => value).join('\n');
}

describe('cs/hu/ro/uk/el/he guidance language contract', () => {
  it.each(EASTERN)('names the four consultation languages on the %s contact and FAQ surfaces', (locale) => {
    const contact = guidanceContent[locale].pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
    const faq = (guidanceContent[locale].pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
    for (const term of CONSULTATION_FOUR[locale]) {
      expect(`${contact}\n${faq}`, `${locale} missing ${term}`).toContain(term);
    }
  });

  it('does not treat the six locales as consultation languages', () => {
    expect(GUIDANCE_CONSULTATION_LANGUAGE_LOCALES).toEqual(['zh-hans']);
    for (const locale of EASTERN) {
      expect(isGuidanceConsultationLanguageLocale(locale), locale).toBe(false);
      expect(internationalInquiryCopy[locale].languageOptions).not.toHaveProperty(locale);
      expect(internationalInquiryCopy[locale].languageOptions).toHaveProperty('en');
      expect(internationalInquiryCopy[locale].languageOptions).toHaveProperty('needs-method-confirmation');
    }
  });

  it.each(EASTERN)('answers the %s consultation-language FAQ in the negative', (locale) => {
    const faq = (guidanceContent[locale].pages.faq.faqs ?? []).find(
      (item) => item.question === LANGUAGE_FAQ_QUESTION[locale],
    );
    expect(faq, `${locale} language FAQ missing`).toBeDefined();
    expect(faq?.answer).toMatch(NEGATIVE_ANSWER_START[locale]);
    expect(faq?.answer).toContain('中文');
  });
});

describe('cs/hu/ro/uk/el/he guidance packs are complete', () => {
  it.each(EASTERN)('publishes all ten %s guidance page keys', (locale) => {
    const pack: GuidanceLocaleContent = guidanceContent[locale];
    expect(Object.keys(pack.pages).sort()).toEqual([...GUIDANCE_PAGE_KEYS].sort());
    for (const key of GUIDANCE_PAGE_KEYS) {
      const page = pack.pages[key];
      expect(page, `pages.${key} missing`).toBeDefined();
      expect(page.title.trim().length, `pages.${key}.title empty`).toBeGreaterThan(0);
      expect(page.description.trim().length, `pages.${key}.description empty`).toBeGreaterThan(0);
    }
  });

  it.each(EASTERN)('carries the same eight FAQ entries as German on %s', (locale) => {
    expect(guidanceContent[locale].pages.faq.faqs).toHaveLength(8);
  });

  it.each(EASTERN)('has the identical field set and section shape as de on %s', (locale) => {
    expect(shapeOf(guidanceContent[locale])).toEqual(shapeOf(guidanceContent.de));
    expect(shapeOf(guidanceOfficeCopy[locale])).toEqual(shapeOf(guidanceOfficeCopy.de));
    expect(shapeOf(guidanceFooterCopy[locale])).toEqual(shapeOf(guidanceFooterCopy.de));
    expect(shapeOf(guidanceTeamCopy[locale])).toEqual(shapeOf(guidanceTeamCopy.de));
    expect(shapeOf(guidanceTeamBios[locale])).toEqual(shapeOf(guidanceTeamBios.de));
    expect(shapeOf(internationalInquiryCopy[locale])).toEqual(shapeOf(internationalInquiryCopy.de));
  });

  it.each(EASTERN)('keeps every %s nav label at or under 14 characters', (locale) => {
    for (const [key, label] of Object.entries(guidanceContent[locale].nav)) {
      expect(label.length, `${locale}.nav.${key}="${label}"`).toBeLessThanOrEqual(14);
    }
  });

  it.each(EASTERN)('has no review markers or Hangul in the %s pack', (locale) => {
    for (const [path, value] of packStrings(locale)) {
      expect(value, path).not.toContain('[변호사 검수 필요]');
      // The Korean consultation-language option is glossed as "(한국어)" in every pack, de included.
      if (path.endsWith('languageOptions.ko')) continue;
      expect(value, path).not.toMatch(/[가-힣]/);
    }
  });
});

describe('cs/hu/ro/uk/el/he attorney gender', () => {
  it('names Wei Tseng with feminine forms where the language has them', () => {
    expect(allText('cs')).toMatch(/advokátka Wei Tseng/i);
    expect(allText('cs')).not.toMatch(/\badvokát Wei Tseng/);
    expect(allText('ro')).toMatch(/avocata Wei Tseng/i);
    expect(allText('ro')).not.toMatch(/\bavocatul Wei Tseng/i);
    expect(allText('el')).toMatch(/η δικηγόρος Wei Tseng|τη δικηγόρο Wei Tseng/);
    expect(allText('el')).not.toMatch(/ο δικηγόρος Wei Tseng|τον δικηγόρο Wei Tseng/);
    expect(allText('uk')).toMatch(/Перевірила адвокатка Wei Tseng/);
    expect(allText('uk')).not.toMatch(/\bАдвокат Wei Tseng|керівним адвокатом/);
    expect(allText('he')).toMatch(/עורכת דין|עורכת הדין/);
    // Hungarian has no grammatical gender; only require the name to be present.
    expect(allText('hu')).toMatch(/Wei Tseng/);
  });
});

describe('cs/hu/ro/uk/el/he forbidden-token scan', () => {
  it.each(EASTERN)('keeps %s copy free of advertising and consultation claims', (locale) => {
    for (const [path, value] of packStrings(locale)) {
      for (const [label, pattern] of FORBIDDEN[locale]) {
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });
});
