import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { siteLocales } from '../locales';
import { collectColumnSitemapRecords } from '../column-locales';
import { trafficColumnSlugsFor, trafficHubCopy } from '@/data/traffic-hub';

describe('traffic hub publication contracts', () => {
  it('publishes column 051 on the Korean, Traditional Chinese and English hubs with reciprocal sitemap locales', () => {
    const slug = 'taiwan-left-turn-vs-straight-motorcycle';
    const expectedLocales = ['ko', 'zh-hant', 'en'] as const;
    for (const locale of expectedLocales) {
      expect(trafficColumnSlugsFor(locale)[0], locale).toBe(slug);
      const post = getColumnPost(slug, locale)!;
      expect(post?.aiAuthored, locale).toBe(true);
      expect(post?.diagramVideo?.id, locale).toBe('left-turn-hypothetical');
      expect(post?.content, locale).toContain(`/${locale}/traffic-accidents`);
    }
    expect(trafficColumnSlugsFor('ja')).not.toContain(slug);
    const records = collectColumnSitemapRecords({
      postsForLocale: (locale) => getAllColumnPosts(locale).filter((post) => post.slug === slug),
    });
    expect(records.map((record) => record.locale).sort()).toEqual([...expectedLocales].sort());
    for (const record of records) {
      expect([...record.alternateLocales].sort(), record.locale).toEqual([...expectedLocales].sort());
    }
  });

  it('links to real localized columns, never another language fallback', () => {
    for (const locale of siteLocales) {
      for (const slug of trafficColumnSlugsFor(locale)) {
        const post = getColumnPost(slug, locale);
        expect(post, `${locale}/${slug}`).toBeTruthy();
        expect(post?.slug).toBe(slug);
      }
      expect(trafficHubCopy[locale].countries.map((country) => country.id)).toEqual(['tw', 'us', 'jp', 'kr']);
    }
  });

  it('ships no visual derived from the withdrawn overtaking-012 case', () => {
    for (const dir of ['public/images/traffic', 'public/videos/traffic']) {
      const abs = path.join(process.cwd(), dir);
      const names = fs.existsSync(abs) ? fs.readdirSync(abs) : [];
      expect(names.filter((name) => /overtaking/i.test(name)), dir).toEqual([]);
    }
    for (const locale of siteLocales) {
      for (const slug of trafficColumnSlugsFor(locale)) {
        const post = getColumnPost(slug, locale);
        expect(post?.featuredImage ?? '', `${locale}/${slug}`).not.toMatch(/\/images\/traffic\//);
        expect(post?.diagramVideo?.id, `${locale}/${slug}`).not.toBe('overtaking-012');
      }
    }
  });

  it('keeps column 051 AI-authored and source-linked without a Japanese fallback', () => {
    const slug = 'taiwan-left-turn-vs-straight-motorcycle';
    expect(trafficColumnSlugsFor('ko')[0]).toBe(slug);
    const post = getColumnPost(slug, 'ko')!;
    expect(post.aiAuthored).toBe(true);
    expect(post.diagramVideo?.id).toBe('left-turn-hypothetical');
    // statutes (law.moj.gov.tw) and the six public judgments it cites (judgment.judicial.gov.tw)
    for (const source of ['pcode=K0040013&flno=102', 'pcode=K0040012&flno=48', 'pcode=B0000001&flno=217', 'pcode=K0040045&flno=3',
      'SJEV%2c114', 'ULDV%2c114', 'TCEV%2c114', 'TCDV%2c115', 'SCDM%2c112', 'TPTA%2c114']) {
      expect(post.content, source).toContain(source);
    }
    expect(post.content).not.toMatch(/tel:|\+886|\+82|변호사[^\n]{0,20}(검토|감수)/);
    expect(trafficColumnSlugsFor('ja')).not.toContain(slug);
    expect(getColumnPost(slug, 'ja')).toBeFalsy();
  });

  it('keeps the new article honestly AI-authored and source-linked in all four languages', () => {
    for (const locale of siteLocales) {
      const post = getColumnPost('taiwan-accident-police-records', locale)!;
      expect(post.aiAuthored).toBe(true);
      expect(post.content).toContain('flno=62');
      expect(post.content).toContain('serno=A1084129');
      expect(post.content).toContain('tm2.npa.gov.tw');
      expect(post.content).toContain(`/${locale}/traffic-accidents`);
    }
  });

  it('replaces sentencing guesses with sourced, conditional rules in the existing Q&A', () => {
    const staleSentencing = /약 3개월|보통 4개월|보통 6개월|通常.{0,8}[346三四六].{0,3}個月|usually.{0,30}(?:three|four|six|3|4|6) months|通常.{0,8}[346３４６].{0,3}か月/i;
    // The former Q16-Q20 stubs were folded into Q1, Q4 and Q5; safeguards are anchored to Q4-Q5 (sentencing, withdrawal).
    const safeguards = {
      ko: ['요건과 예외', '제1심 변론 종결 전', '다시 고소할 수 없습니다', '자동으로 공소가 종료되지 않으며'],
      en: ['eligibility requirements and exceptions', 'before the close of first-instance oral argument', 'cannot file a complaint again', 'does not automatically terminate prosecution'],
      ja: ['要件と例外', '第一審の弁論終結前', '再び告訴できません', '公訴が自動的に終了しない'],
      'zh-hant': ['適用要件與例外', '第一審言詞辯論終結前', '不得再行告訴', '不會自動終結追訴'],
    };
    for (const locale of siteLocales) {
      const post = getColumnPost('taiwan-traffic-accident-procedure', locale)!;
      const content = post.content;
      const q1 = content.indexOf('## Q1.');
      const q4 = content.indexOf('## Q4.');
      const q6 = content.indexOf('## Q6.');
      const q7 = content.indexOf('## Q7.');
      expect(q1, locale).toBeGreaterThan(-1);
      expect(q1, locale).toBeLessThan(q4);
      expect(q4, locale).toBeLessThan(q6);
      expect(q6, locale).toBeLessThan(q7);
      // Q6 legitimately states the ordinary appraisal-application deadline (ja 「通常、事故発生日から6か月以内」), so it is excluded.
      expect(content.slice(0, q6) + content.slice(q7), locale).not.toMatch(staleSentencing);
      const answers = content.slice(q4, q6);
      for (const safeguard of safeguards[locale]) {
        expect(answers, `${locale}: ${safeguard}`).toContain(safeguard);
      }
      const scene = content.slice(q1, content.indexOf('## Q2.'));
      const sentencing = content.slice(q4, content.indexOf('## Q5.'));
      const pre = content.slice(q1, q6);
      expect(scene, `${locale}: Q1 links the Article 62 handling duty`).toMatch(/flno=62(?:\)|&)/);
      for (const article of ['276', '41']) {
        expect(sentencing, `${locale}: Q4 links Article ${article}`).toMatch(new RegExp(`flno=${article}(?:\\)|&)`));
      }
      for (const article of ['284', '276', '41', '238', '287', '185-4', '62']) {
        expect(pre, `${locale}: flno=${article}`).toMatch(new RegExp(`flno=${article}(?:\\)|&)`));
      }
      expect(Array.from(content.matchAll(/^## Q(\d+)\./gm), (match) => Number(match[1])), locale)
        .toEqual(Array.from({ length: 15 }, (_, index) => index + 1));
    }
  });

  it('sources the corrected emergency-number routing in every locale', () => {
    for (const locale of siteLocales) {
      const post = getColumnPost('taiwan-traffic-accident-procedure', locale)!;
      const section = post.content.slice(post.content.indexOf('## Q2.'), post.content.indexOf('## Q3.'));
      expect(section).toContain('https://www.nfa.gov.tw/cht/?code=list&ids=66');
    }
    const ko = getColumnPost('taiwan-traffic-accident-procedure', 'ko')!.content;
    expect(ko).toContain('110·119에 연결되지 않는 긴급 상황에는 112');
    expect(ko).toContain('0을 누르면 경찰 110, 9를 누르면 구조·구급 119');
  });

  it('distinguishes the direct review deadline from criminal-trial commissioning', () => {
    const safeguards = {
      ko: ['받은 다음 날부터 30일 안에', '형사재판 중에는', '직접 위임하고 비용을 부담', '이송 절차와 적용 기한'],
      en: ['within 30 days starting the day after receipt', 'During a criminal trial', "at that party's expense", 'judicial-referral route and applicable deadline'],
      ja: ['受け取った翌日から30日以内', '刑事裁判中は', '直接委任し、その費用を負担', '移送手続と適用される期限'],
      'zh-hant': ['收受鑑定意見書翌日起30日內', '刑事審判中', '費用由委任者負擔', '轉送覆議的程序與適用期限'],
    };
    for (const locale of siteLocales) {
      const post = getColumnPost('taiwan-traffic-accident-procedure', locale)!;
      const section = post.content.slice(post.content.indexOf('## Q6.'), post.content.indexOf('## Q7.'));
      for (const safeguard of safeguards[locale]) expect(section).toContain(safeguard);
      expect(section).toContain('pcode=K0040045');
      expect(section).toContain('pcode=C0010001&flno=208');
    }
  });
});
