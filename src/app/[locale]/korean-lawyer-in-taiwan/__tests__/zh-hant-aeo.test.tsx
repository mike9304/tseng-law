import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  ATTORNEY_CREDENTIAL_SOURCE_URL,
  PRIMARY_ATTORNEY_LANGUAGE_TAGS,
  attorneyCredentials,
} from '@/data/attorney-credentials';
import { siteContent } from '@/data/site-content';
import { getPublishedBaseFooterColumns } from '@/components/footer-link-policy';
import { buildLocaleLlmsTxt } from '@/lib/llms-txt';
import { landingContent } from '../content';
import KoreanLawyerInTaiwanPage, { generateMetadata } from '../page';

const LANDING_URL = 'https://tseng-law.com/zh-hant/korean-lawyer-in-taiwan';
const PERSON_ID = 'https://tseng-law.com/zh-hant/lawyers/wei-tseng#person';

/**
 * Sentences published on https://www.hoveringlaw.com.tw/zh/wei.html
 * (fetched 2026-09-25). Every credential claim must trace back to one of them.
 */
const OFFICIAL_PROFILE_SENTENCES = [
  '曾雋崴律師為台灣執業律師，具備深厚法院實務訴訟背景及公司法律顧問經驗，精通韓語、日語，通過最高等級韓國語能力測驗 TOPIK 6 及日本語能力測驗 N1。',
  '為駐台北韓國代表部韓文法律服務參考名單律師，亦多次受韓國SBS新聞邀請就台灣法律議題提供意見',
  '103臺北市大同區承德路一段35號7樓之2',
] as const;

/** Third parties named on the official page that must never be repeated here. */
const FORBIDDEN_THIRD_PARTY_NAMES = [
  '台積電',
  'Coupang',
  '酷澎',
  '金秀賢',
  '大S',
  '徐熙媛',
  '具俊曄',
  '健身工廠',
  '弘大',
  'DAZIUNDA',
  '德黑蘭',
];

function parseJsonLd(html: string): Record<string, unknown>[] {
  return Array.from(
    html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
    (match) => JSON.parse(match[1]) as Record<string, unknown>,
  );
}

async function renderZhHant() {
  return renderToStaticMarkup(
    await KoreanLawyerInTaiwanPage({ params: Promise.resolve({ locale: 'zh-hant' }) }),
  );
}

describe('zh-hant 會韓文律師 landing (AEO)', () => {
  it('targets the 會韓文／韓語律師 wording in title, H1 and description', async () => {
    const c = landingContent['zh-hant'];
    expect(c.metaTitle).toBe('台北會韓文／韓語律師｜曾雋崴律師');
    expect(c.title).toBe('台北會說韓文的台灣律師（曾雋崴）');
    expect(Array.from(c.description).length).toBeLessThanOrEqual(155);
    expect(c.description).toContain('TOPIK 6');
    expect(c.description).toContain('駐台北韓國代表部韓文法律服務參考名單律師');
    expect(c.keywords).toEqual(expect.arrayContaining(['會韓文律師', '韓語律師', '台北韓語律師']));

    const metadata = await generateMetadata({ params: Promise.resolve({ locale: 'zh-hant' }) });
    expect(metadata.title).toBe('台北會韓文／韓語律師｜曾雋崴律師');
    expect(metadata.alternates?.canonical).toBe(LANDING_URL);
    expect(Object.keys(metadata.alternates?.languages ?? {})).toEqual(['ko', 'zh-Hant', 'en', 'ja', 'x-default']);
  });

  it('only states credentials published on the official profile, and names no third parties', () => {
    const block = attorneyCredentials['zh-hant'];
    expect(block).toBeDefined();
    const official = OFFICIAL_PROFILE_SENTENCES.join('\n');
    for (const fact of ['TOPIK 6', '日本語能力測驗 N1', '駐台北韓國代表部韓文法律服務參考名單律師', 'SBS', '承德路一段35號7樓之2']) {
      expect(official).toContain(fact);
      expect(JSON.stringify(block)).toContain(fact);
    }
    expect(ATTORNEY_CREDENTIAL_SOURCE_URL).toBe('https://www.hoveringlaw.com.tw/zh/wei.html');

    const surface = JSON.stringify({ block, content: landingContent['zh-hant'] });
    for (const name of FORBIDDEN_THIRD_PARTY_NAMES) {
      expect(surface).not.toContain(name);
    }
    expect(surface).not.toMatch(/唯一|第一名|最佳|保證勝訴/u);
  });

  it('renders the credential card, the six visible FAQs and a matching FAQPage', async () => {
    const html = await renderZhHant();
    const c = landingContent['zh-hant'];

    expect(html).toContain('data-attorney-credentials="true"');
    expect(html).toContain('律師資格與語言能力');
    expect(html).toContain('href="/zh-hant/lawyers/wei-tseng"');
    expect(html).toContain(`href="${ATTORNEY_CREDENTIAL_SOURCE_URL}"`);
    expect(html.match(/<h1\b/g)).toHaveLength(1);

    const faqPage = parseJsonLd(html).find((node) => node['@type'] === 'FAQPage');
    expect(faqPage?.inLanguage).toBe('zh-Hant');
    const questions = (faqPage?.mainEntity as Array<{ name: string; acceptedAnswer: { text: string } }>);
    expect(questions).toHaveLength(6);
    expect(questions.map((q) => q.name)).toEqual(c.faq.map((item) => item.q));
    for (const item of c.faq) {
      expect(html).toContain(item.q);
    }
  });

  it('emits one Person node shared with the profile page: female, BCP-47 languages, credentials', async () => {
    const graphs = parseJsonLd(await renderZhHant());
    const persons = graphs.filter((node) => node['@type'] === 'Person');
    expect(persons).toHaveLength(1);
    const person = persons[0];

    expect(person['@id']).toBe(PERSON_ID);
    expect(person.gender).toBe('Female');
    expect(person.knowsLanguage).toEqual([...PRIMARY_ATTORNEY_LANGUAGE_TAGS]);
    expect(person.url).toBe('https://tseng-law.com/zh-hant/lawyers/wei-tseng');
    expect((person.hasCredential as Array<{ name: string }>).map((c) => c.name)).toEqual(['TOPIK 6', 'JLPT N1']);

    const legalService = graphs.find(
      (node) => node['@type'] === 'LegalService' && node.url === LANDING_URL,
    ) as { employee: { '@id': string } } | undefined;
    expect(legalService?.employee['@id']).toBe(PERSON_ID);
  });

  it.each(['ko', 'en', 'ja'] as const)('leaves the %s landing without the zh-hant credential block', async (locale) => {
    const html = renderToStaticMarkup(
      await KoreanLawyerInTaiwanPage({ params: Promise.resolve({ locale }) }),
    );
    expect(html).not.toContain('data-attorney-credentials');
    expect(parseJsonLd(html).some((node) => node['@type'] === 'Person')).toBe(false);
    expect(landingContent[locale].faq).toHaveLength(5);
  });

  it('is linked from the visible zh-hant footer and the zh-hant llms.txt intent section', () => {
    const visible = getPublishedBaseFooterColumns(siteContent['zh-hant'].footer.columns);
    const topics = visible.find((column) => column.title === '常見主題');
    expect(topics?.links).toContainEqual({ label: '台北韓語律師', href: '/zh-hant/korean-lawyer-in-taiwan' });

    const body = buildLocaleLlmsTxt('zh-hant');
    const intent = body.split('## 主要諮詢資訊')[1]?.split('\n## ')[0] ?? '';
    expect(intent).toContain(
      `- [會說韓文的台灣律師（台北）](${LANDING_URL}): 台北會韓文／韓語律師曾雋崴的公開說明與常見問題。`,
    );
  });
});
