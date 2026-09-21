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

const CONSULTATION_FOUR_ZH_HANS = ['英语', '中文', '日语', '韩语'] as const;
const CONSULTATION_FOUR_MS = ['Inggeris', 'Cina', 'Jepun', 'Korea'] as const;
const CONSULTATION_FOUR_RU = ['английск', 'китайск', 'японск', 'корейск'] as const;
const CONSULTATION_FOUR_TR = ['İngilizce', 'Çince', 'Japonca', 'Korece'] as const;

const ZH_HANS_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['胜诉率', /胜诉率/],
  ['保证', /保证/],
  ['最佳', /最佳/],
  ['唯一', /唯一/],
  ['免费咨询', /免费咨询|咨询免费|首次.{0,12}免费/],
  ['24小时', /24小时/],
];

const MS_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['kadar kejayaan', /kadar kejayaan/i],
  ['dijamin', /dijamin/i],
  ['terbaik', /terbaik/i],
  ['satu-satunya', /satu-satunya/i],
  ['percuma', /percuma/i],
  ['24 jam', /24 jam/i],
  ['perundingan dalam Bahasa Melayu', /perundingan dalam Bahasa Melayu/i],
];

const RU_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['процент выигранных', /процент выигранных/i],
  ['гарантируем', /гарантируем/i],
  ['лучший', /лучший/i],
  ['единственный', /единственный/i],
  ['бесплатн', /бесплатн/i],
  ['круглосуточно', /круглосуточно/i],
  ['консультация на русском', /консультация на русском/i],
];

const TR_FORBIDDEN: ReadonlyArray<readonly [string, RegExp]> = [
  ['başarı oranı', /başarı oranı/i],
  ['garanti', /garanti/i],
  ['en iyi', /en iyi/i],
  ['tek', /\btek\b/i],
  ['ücretsiz danışma', /ücretsiz danışma/i],
  ['7/24', /7\/24/],
  ['Türkçe danışma', /Türkçe danışma/i],
];

const LANGUAGE_FAQ_QUESTION = {
  'zh-hans': '可以用中文咨询吗？',
  ms: 'Bolehkah saya berunding dalam bahasa Melayu?',
  ru: 'Возможна ли консультация на русском языке?',
  tr: 'Türkçe danışma mümkün mü?',
} as const;

type NewGuidanceLocale = 'zh-hans' | 'ms' | 'ru' | 'tr';
type Labelled = readonly [path: string, value: string];

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

function packStrings(locale: NewGuidanceLocale): Labelled[] {
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

function allText(locale: NewGuidanceLocale): string {
  return packStrings(locale).map(([, value]) => value).join('\n');
}

function isZhHansFreeDenial(value: string): boolean {
  return /不(说|表示|承诺|声称).{0,16}免费|并非免费|不是免费|没有免费/.test(value);
}

describe('zh-hans/ms/ru/tr guidance language contract', () => {
  it('names the four consultation languages on Simplified Chinese contact and FAQ surfaces', () => {
    const contact = guidanceContent['zh-hans'].pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
    const faq = (guidanceContent['zh-hans'].pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
    for (const term of CONSULTATION_FOUR_ZH_HANS) {
      expect(`${contact}\n${faq}`).toContain(term);
    }
  });

  it('names the four consultation languages on the Malay, Russian and Turkish contact and FAQ surfaces', () => {
    const packs = [
      ['ms', CONSULTATION_FOUR_MS],
      ['ru', CONSULTATION_FOUR_RU],
      ['tr', CONSULTATION_FOUR_TR],
    ] as const;
    for (const [locale, terms] of packs) {
      const contact = guidanceContent[locale].pages.contact.sections.map((section) => section.paragraphs.join(' ')).join(' ');
      const faq = (guidanceContent[locale].pages.faq.faqs ?? []).map((item) => item.answer).join(' ');
      for (const term of terms) {
        expect(`${contact}\n${faq}`, `${locale} missing ${term}`).toContain(term);
      }
    }
  });

  it('keeps zh-hans as the only guidance locale whose page language overlaps a consultation language', () => {
    expect(GUIDANCE_CONSULTATION_LANGUAGE_LOCALES).toEqual(['zh-hans']);
    expect(isGuidanceConsultationLanguageLocale('zh-hans')).toBe(true);
    expect(isGuidanceConsultationLanguageLocale('ms')).toBe(false);
    expect(isGuidanceConsultationLanguageLocale('ru')).toBe(false);
    expect(isGuidanceConsultationLanguageLocale('tr')).toBe(false);
  });

  it('does not offer Malay, Russian or Turkish as a consultation language', () => {
    expect(internationalInquiryCopy.ms.languageOptions).not.toHaveProperty('ms');
    expect(internationalInquiryCopy.ru.languageOptions).not.toHaveProperty('ru');
    expect(internationalInquiryCopy.tr.languageOptions).not.toHaveProperty('tr');
    expect(internationalInquiryCopy.ms.languageOptions).toHaveProperty('en');
    expect(internationalInquiryCopy.ru.languageOptions).toHaveProperty('needs-method-confirmation');
  });
});

describe('zh-hans/ms/ru/tr guidance packs are complete', () => {
  it.each(['zh-hans', 'ms', 'ru', 'tr'] as const)('publishes all ten %s guidance page keys', (locale) => {
    const pack: GuidanceLocaleContent = guidanceContent[locale];
    expect(Object.keys(pack.pages).sort()).toEqual([...GUIDANCE_PAGE_KEYS].sort());
    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
    for (const key of GUIDANCE_PAGE_KEYS) {
      const page = pack.pages[key];
      expect(page, `pages.${key} missing`).toBeDefined();
      expect(page.title.trim().length, `pages.${key}.title empty`).toBeGreaterThan(0);
      expect(page.description.trim().length, `pages.${key}.description empty`).toBeGreaterThan(0);
    }
  });

  it.each(['zh-hans', 'ms', 'ru', 'tr'] as const)('carries the same eight FAQ entries as German on %s', (locale) => {
    expect(guidanceContent[locale].pages.faq.faqs).toHaveLength(8);
    expect(guidanceContent.de.pages.faq.faqs).toHaveLength(8);
  });

  it.each(['zh-hans', 'ms', 'ru', 'tr'] as const)('has the identical field set and section shape as de on %s', (locale) => {
    expect(shapeOf(guidanceContent[locale])).toEqual(shapeOf(guidanceContent.de));
    expect(shapeOf(guidanceOfficeCopy[locale])).toEqual(shapeOf(guidanceOfficeCopy.de));
    expect(shapeOf(guidanceFooterCopy[locale])).toEqual(shapeOf(guidanceFooterCopy.de));
    expect(shapeOf(guidanceTeamCopy[locale])).toEqual(shapeOf(guidanceTeamCopy.de));
    expect(shapeOf(guidanceTeamBios[locale])).toEqual(shapeOf(guidanceTeamBios.de));
    expect(shapeOf(internationalInquiryCopy[locale])).toEqual(shapeOf(internationalInquiryCopy.de));
  });

  it('keeps every Russian nav label at or under 14 characters', () => {
    for (const [key, label] of Object.entries(guidanceContent.ru.nav)) {
      expect(label.length, `ru.nav.${key}="${label}"`).toBeLessThanOrEqual(14);
    }
  });
});

describe('zh-hans/ms/ru/tr attorney gender and language FAQ', () => {
  it('names Wei Tseng with the gender-neutral peguam in Malay', () => {
    const text = allText('ms');
    expect(text).toMatch(/peguam Wei Tseng/i);
    expect(guidanceContent.ms.home.columnsReviewLabel).toMatch(/peguam Wei Tseng/);
  });

  it('names Wei Tseng as адвокат Wei Tseng (曾雋崴) with feminine agreement in Russian', () => {
    const text = allText('ru');
    expect(text).toMatch(/адвокат(?:ом)? Wei Tseng \(曾雋崴\)/i);
    expect(guidanceTeamBios.ru['tseng-junwei'].intro.join(' ')).toMatch(/Она /);
    expect(guidanceTeamCopy.ru.qualificationSentence).toMatch(/уполномочена/);
  });

  it('names Wei Tseng with gender-neutral avukat in Turkish', () => {
    expect(allText('tr')).toMatch(/Avukat Wei Tseng/);
    expect(guidanceContent.tr.home.columnsReviewLabel).toMatch(/Avukat Wei Tseng/);
  });

  it('names Wei Tseng as 律师曾雋崴 in Simplified Chinese', () => {
    expect(allText('zh-hans')).toContain('曾雋崴');
    expect(guidanceContent['zh-hans'].home.columnsReviewLabel).toMatch(/律师曾雋崴/);
  });

  it('answers the Simplified Chinese consultation-language FAQ in the affirmative', () => {
    const faq = (guidanceContent['zh-hans'].pages.faq.faqs ?? []).find(
      (item) => item.question === LANGUAGE_FAQ_QUESTION['zh-hans'],
    );
    expect(faq, 'Simplified Chinese language FAQ missing').toBeDefined();
    expect(faq?.answer).toMatch(/^可以。/);
    expect(faq?.answer).toMatch(/英语、中文、日语和韩语/);
    expect(faq?.answer).toMatch(/普通话与书面中文/);
  });

  it.each(['ms', 'ru', 'tr'] as const)('answers the %s consultation-language FAQ in the negative', (locale) => {
    expect(isGuidanceConsultationLanguageLocale(locale)).toBe(false);
    const faq = (guidanceContent[locale].pages.faq.faqs ?? []).find(
      (item) => item.question === LANGUAGE_FAQ_QUESTION[locale],
    );
    expect(faq, `${locale} language FAQ missing`).toBeDefined();
    if (locale === 'ms') {
      expect(faq?.answer).toMatch(/^Tidak\./);
      expect(faq?.answer).toMatch(/bahasa Inggeris, Cina \(中文\), Jepun dan Korea/);
    }
    if (locale === 'ru') {
      expect(faq?.answer).toMatch(/^Нет\./);
      expect(faq?.answer).toMatch(/английском, китайском \(中文\), японском и корейском/);
    }
    if (locale === 'tr') {
      expect(faq?.answer).toMatch(/^Hayır\./);
      expect(faq?.answer).toMatch(/İngilizce, Çince \(中文\), Japonca ve Korece/);
    }
  });
});

describe('zh-hans/ms/ru/tr forbidden-token scan', () => {
  it('keeps Simplified Chinese copy free of advertising claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('zh-hans')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION['zh-hans'];
      for (const [label, pattern] of ZH_HANS_FORBIDDEN) {
        if (isLanguageFaqQuestion) continue;
        if (label === '免费咨询' && isZhHansFreeDenial(value)) continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('uses exclusive limiters on Malay, Russian and Turkish GEO answers and inquiry notices', () => {
    for (const entry of Object.values(guidanceAnswers.ms)) {
      expect(entry.answer).toMatch(/hanya dijalankan/);
    }
    for (const entry of Object.values(guidanceAnswers.ru)) {
      expect(entry.answer).toMatch(/проводится только на/);
    }
    for (const entry of Object.values(guidanceAnswers.tr)) {
      expect(entry.answer).toMatch(/yalnızca .+ yapılır/);
    }
    expect(internationalInquiryCopy.ms.consultationNotice).toMatch(/hanya dijalankan dalam empat bahasa/);
    expect(internationalInquiryCopy.ru.consultationNotice).toMatch(/только на четырёх языках/);
    expect(internationalInquiryCopy.tr.consultationNotice).toMatch(/yalnızca dört dilde/);
    expect(internationalInquiryCopy['zh-hans'].consultationNotice).toBe(
      '咨询以四种语言进行：英语、中文、日语和韩语。',
    );
  });

  it('keeps Malay copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('ms')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.ms;
      for (const [label, pattern] of MS_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'perundingan dalam Bahasa Melayu') continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Russian copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('ru')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.ru;
      for (const [label, pattern] of RU_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'консультация на русском') continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });

  it('keeps Turkish copy free of advertising and consultation claims outside the language-FAQ question', () => {
    for (const [path, value] of packStrings('tr')) {
      const isLanguageFaqQuestion =
        path.endsWith('.question') && value === LANGUAGE_FAQ_QUESTION.tr;
      for (const [label, pattern] of TR_FORBIDDEN) {
        if (isLanguageFaqQuestion && label === 'Türkçe danışma') continue;
        expect(value, `${path} matched "${label}"`).not.toMatch(pattern);
      }
    }
  });
});
