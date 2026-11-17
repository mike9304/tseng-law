import { renderToStaticMarkup } from 'react-dom/server';
import { parseDocument } from 'htmlparser2';
import { describe, expect, it } from 'vitest';
import Page, { generateMetadata } from '../page';
import { landingContent } from '../content';
import { buildLocaleLlmsTxt } from '@/lib/llms-txt';
import { hasKoreanConsultationRelatedLink } from '@/components/faq/FaqPublicExplorer.logic';
import { seedFaqItems } from '@/lib/builder/faq/faq-engine';
import { ATTORNEY_CREDENTIAL_SOURCE_URL } from '@/data/attorney-credentials';

const params = (locale: 'ko' | 'zh-hant' | 'en' | 'ja') => ({ params: Promise.resolve({ locale }) });
const visible = (n: any): string => n.type === 'text' ? n.data : (n.children ?? []).map(visible).join('');
const all = (n: any): any[] => [n, ...(n.children ?? []).flatMap(all)];
const schemas = (html: string) => all(parseDocument(html))
  .filter(n => n.name === 'script' && n.attribs.type === 'application/ld+json').map(n => JSON.parse(visible(n)));

describe('zh-hant Korean consultation search page', () => {
  it('binds metadata, visible FAQ and structured entities to the actual page', async () => {
    const html = renderToStaticMarkup(await Page(params('zh-hant')));
    const ns = all(parseDocument(html));
    const structured = schemas(html);
    const faq = structured.find(n => n['@type'] === 'FAQPage');
    const person = structured.find(n => n['@type'] === 'Person');
    const metadata = await generateMetadata(params('zh-hant'));
    expect(metadata.title).toBe(landingContent['zh-hant'].metaTitle);
    expect(metadata.description).toBe(landingContent['zh-hant'].description);
    expect(metadata.alternates?.canonical).toBe('https://tseng-law.com/zh-hant/korean-lawyer-in-taiwan');
    expect(ns.filter(n => n.name === 'h1').map(visible)).toEqual([landingContent['zh-hant'].title]);
    expect(ns.filter(n => n.name === 'dt' && n.attribs.class?.includes('faqQuestion')).map(visible)).toEqual(landingContent['zh-hant'].faq.map(x => x.q));
    expect(ns.filter(n => n.name === 'dd' && n.attribs.class?.includes('faqAnswer')).map(visible)).toEqual(landingContent['zh-hant'].faq.map(x => x.a));
    expect(faq.inLanguage).toBe('zh-Hant');
    expect(faq.mainEntity.map((x: any) => [x.name, x.acceptedAnswer.text])).toEqual(landingContent['zh-hant'].faq.map(x => [x.q, x.a]));
    expect(person['@id']).toBe('https://tseng-law.com/zh-hant/lawyers/wei-tseng#person');
    expect(person.jobTitle).toBe('台灣律師 · 主持律師');
    expect(person.knowsLanguage).toEqual(['ko', 'zh-Hant', 'ja']);
    expect(person.hasCredential.map((x: any) => x.name)).toEqual(['TOPIK 6', '日本語能力測驗 N1']);
    expect(html).toContain(ATTORNEY_CREDENTIAL_SOURCE_URL);
    expect(html).not.toMatch(/<strong\b|<b\b|韓國律師資格|代表律師|"author"|"@type":"Article"/u);
  });

  it('keeps the credential/person addition exclusive to zh-hant', async () => {
    for (const locale of ['ko', 'en', 'ja'] as const) {
      const html = renderToStaticMarkup(await Page(params(locale)));
      expect(html).not.toContain('data-attorney-credentials');
      expect(schemas(html).some(x => x['@type'] === 'Person')).toBe(false);
    }
  });

  it('adds the discovery entry only to zh-hant llms, preserving all other locale outputs', () => {
    expect(buildLocaleLlmsTxt('zh-hant')).toContain('https://tseng-law.com/zh-hant/korean-lawyer-in-taiwan');
    for (const locale of ['ko', 'en', 'ja'] as const) expect(buildLocaleLlmsTxt(locale)).not.toContain('/korean-lawyer-in-taiwan');
  });

  it('links only the two matching FAQ questions, and rejects reused IDs or other locales', () => {
    const items = seedFaqItems().filter(x => x.locale === 'zh-hant');
    const matched = items.filter(x => hasKoreanConsultationRelatedLink('zh-hant', x));
    expect(matched.map(x => x.faqId).sort()).toEqual(['seed-zh-hant-12', 'seed-zh-hant-9']);
    expect(matched.every(x => !hasKoreanConsultationRelatedLink('ko', x))).toBe(true);
    expect(matched.every(x => !hasKoreanConsultationRelatedLink('zh-hant', { ...x, question: '不同問題' }))).toBe(true);
  });
});
