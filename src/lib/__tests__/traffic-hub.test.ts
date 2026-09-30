import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { getColumnPost } from '../columns';
import { siteLocales } from '../locales';
import { TRAFFIC_COLUMN_SLUGS, trafficHubCopy } from '@/data/traffic-hub';

describe('traffic hub publication contracts', () => {
  it('links to real localized columns, never another language fallback', () => {
    for (const locale of siteLocales) {
      for (const slug of TRAFFIC_COLUMN_SLUGS) {
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
      for (const slug of TRAFFIC_COLUMN_SLUGS) {
        const post = getColumnPost(slug, locale);
        expect(post?.featuredImage ?? '', `${locale}/${slug}`).not.toMatch(/\/images\/traffic\//);
        expect(post?.diagramVideo?.id, `${locale}/${slug}`).not.toBe('overtaking-012');
      }
    }
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
    const safeguards = {
      ko: ['요건과 예외', '제1심 변론 종결 전', '다시 고소할 수 없습니다', '자동 종료되지 않습니다'],
      en: ['eligibility requirements and exceptions', 'before first-instance argument closes', 'cannot complain again', 'does not automatically end prosecution'],
      ja: ['要件と例外', '第一審の弁論終結前', '再び告訴できません', '自動的に終了しません'],
      'zh-hant': ['適用要件與例外', '第一審辯論終結前', '不得再行告訴', '不因私下和解即自動終結'],
    };
    for (const locale of siteLocales) {
      const post = getColumnPost('taiwan-traffic-accident-procedure', locale)!;
      const tail = post.content.slice(post.content.indexOf('## Q16.'));
      expect(tail).not.toMatch(staleSentencing);
      for (const safeguard of safeguards[locale]) {
        expect(tail, `${locale}: ${safeguard}`).toContain(safeguard);
      }
      for (const article of ['284', '276', '41', '238', '287', '185-4', '62']) {
        expect(tail).toMatch(new RegExp(`flno=${article}(?:\\)|&)`));
      }
      expect(tail.match(/^## Q\d+\./gm)).toHaveLength(5);
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
