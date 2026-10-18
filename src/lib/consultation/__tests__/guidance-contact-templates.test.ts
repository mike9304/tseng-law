import { describe, expect, it } from 'vitest';
import { EXISTING_SITE_LOCALES_4, GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';
import { GUIDANCE_CONSULTATION_EMAIL_TEMPLATES } from '../guidance-contact-templates';
import { getLocalizedConsultationMailto } from '../localized-mailto';
import { getConsultationPublicMailto } from '../public-contact';

const greetings = {
  vi: 'Xin chào', id: 'Halo', th: 'สวัสดี', fil: 'Kumusta', ar: 'مرحبًا',
  de: 'Hallo', es: 'Hola', fr: 'Bonjour', pt: 'Olá', 'zh-hans': '你好',
  ms: 'Helo', ru: 'Здравствуйте', tr: 'Merhaba', it: 'Buongiorno', nl: 'Hallo',
  pl: 'Dzień dobry', hi: 'नमस्ते', sv: 'Hej', da: 'Hej', nb: 'Hei', fi: 'Hei',
  cs: 'Dobrý den', hu: 'Jó napot', ro: 'Bună ziua', uk: 'Добрий день', el: 'Γεια σας',
  he: 'שלום', bn: 'নমস্কার', ur: 'السلام علیکم', fa: 'سلام', my: 'မင်္ဂလာပါ',
  ta: 'வணக்கம்', ne: 'नमस्ते', km: 'សួស្តី', mn: 'Сайн байна уу', sk: 'Dobrý deň',
  bg: 'Здравейте', hr: 'Dobar dan', sr: 'Dobar dan', sl: 'Dober dan', lt: 'Laba diena',
  lv: 'Labdien', et: 'Tere', ca: 'Hola', is: 'Halló',
};

// Check common local lawyer/title words as well as names. Legal-subject words
// (e.g. "juridique") are allowed; a salutation addressed to counsel is not.
const lawyerWords = /Tseng|曾|증준외|attorney|lawyer|luật sư|pengacara|ทนาย|abogado|محامي|محامية|Rechtsanwalt|Rechtsanwältin|avocat|advogad|律师|peguam|адвокат|avukat|avvocat|advocaat|adwokat|वकील|advokat|asianajaja|advokát|ügyvéd|δικηγόρ|עורך דין|עורכת דין|আইনজীবী|وکیل|ရှေ့နေ|வழக்கறிஞர்|अधिवक्ता|មេធាវី|өмгөөлөгч|odvjetnik|odvetnik|advokaat|advocat|lögmaður/iu;
const bidiControls = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u206f]/u;

describe('guidance consultation email drafts', () => {
  it('covers exactly the canonical guidance locale set', () => {
    expect(Object.keys(GUIDANCE_CONSULTATION_EMAIL_TEMPLATES).sort())
      .toEqual([...GUIDANCE_LOCALES_4].sort());
  });

  it.each(GUIDANCE_LOCALES_4)('%s has only a greeting, four empty items and one caution', (locale) => {
    const template = GUIDANCE_CONSULTATION_EMAIL_TEMPLATES[locale];
    expect(template).toBeDefined();
    expect(template.subject).toContain('tseng-law.com');
    expect(template.subject).toMatch(/^\[tseng-law\.com [^\]\n]+\] [^\n]+$/u);
    const item = expect.stringMatching(locale === 'zh-hans' ? /^[^\n]+：$/u : /^[^\n]+:$/u);
    expect(template.body.split('\n')).toEqual([
      greetings[locale], '', item, '', item, '', item, '', item, '', expect.stringMatching(/^\S[^\n]+$/u),
    ]);
    expect(template.body).not.toMatch(/\n$/u);
    expect(template.body).toBe(template.body.trim());
    expect(template.subject.replace('tseng-law.com', '') + template.body).not.toMatch(lawyerWords);
    expect(template.subject + template.body).not.toMatch(bidiControls);
    expect(template.body.includes('※')).toBe(locale === 'zh-hans');
  });

  it.each(GUIDANCE_LOCALES_4)('%s round-trips subject and body in a mailto shorter than 2600 encoded characters', (locale) => {
    const template = GUIDANCE_CONSULTATION_EMAIL_TEMPLATES[locale];
    const href = getLocalizedConsultationMailto(locale);
    const url = new URL(href);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe('wei@hoveringlaw.com.tw');
    expect([...url.searchParams.keys()]).toEqual(['subject', 'body']);
    expect(url.searchParams.get('subject')).toBe(template.subject);
    expect(url.searchParams.get('body')).toBe(template.body);
    expect(url.hash).toBe('');
    expect(href).toBe(`mailto:wei@hoveringlaw.com.tw?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`);
    // non-Latin scripts expand ~9x when percent-encoded; modern mail clients accept this.
    expect(href.length).toBeLessThan(2600);
  });

  it('uses Simplified Chinese and the site’s Latin Serbian script', () => {
    expect(GUIDANCE_CONSULTATION_EMAIL_TEMPLATES['zh-hans'].body).toContain('请勿填写身份证号');
    expect(GUIDANCE_CONSULTATION_EMAIL_TEMPLATES['zh-hans'].body).not.toMatch(/[諮詢臺灣聯絡證號護帳資訊]/u);
    expect(GUIDANCE_CONSULTATION_EMAIL_TEMPLATES.sr.body).not.toMatch(/\p{Script=Cyrillic}/u);
    expect(GUIDANCE_CONSULTATION_EMAIL_TEMPLATES.sr.subject).not.toMatch(/\p{Script=Cyrillic}/u);
  });

  it.each(EXISTING_SITE_LOCALES_4)('preserves the final %s site-locale draft', (locale) => {
    expect(getLocalizedConsultationMailto(locale)).toBe(getConsultationPublicMailto(locale));
  });
});
