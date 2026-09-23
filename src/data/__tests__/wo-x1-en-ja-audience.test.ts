import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { replaceKoreanSpeakerLandingLinks } from '@/components/ColumnContent';
import Footer from '@/components/Footer';
import HomeCaseResultsSplit from '@/components/HomeCaseResultsSplit';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import PricingCards from '@/components/PricingCards';
import { attorneyProfiles } from '@/data/attorney-profiles';
import { faqContent } from '@/data/faq-content';
import { taiwanOfficeData } from '@/data/office-locations';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { TEAM_NAME_BY_LOCALE } from '@/data/team-name';
import { getConsultationEmailTemplate } from '@/lib/consultation/public-contact';

/** WO-X1 verification scan pattern for EN surfaces. */
const EN_KOREA_CENTRIC = /Korean client|for Korean|Korea-Taiwan|Korean national|Korean Student/i;

describe('WO-X1 EN/JA audience copy', () => {
  it('lists English first on EN and Japanese first on JA for the attorney', () => {
    expect(attorneyProfiles.en['wei-tseng'].languages).toEqual(['English', 'Chinese', 'Korean', 'Japanese']);
    expect(attorneyProfiles.ja['wei-tseng'].languages).toEqual(['日本語', '中国語', '英語', '韓国語']);
    // ko/zh-hant stay as published.
    expect(attorneyProfiles.ko['wei-tseng'].languages).toEqual(['한국어', '중국어', '일본어']);
    expect(attorneyProfiles['zh-hant']['wei-tseng'].languages).toEqual(['韓文', '中文', '日文']);
  });

  it('keeps Korea-centric framing out of the EN profile, team, FAQ and home case', () => {
    const profile = attorneyProfiles.en['wei-tseng'];
    const visible = [
      profile.lede ?? '',
      ...profile.summary,
      ...profile.notableMatters,
      ...profile.proofPoints,
      ...profile.faq.flatMap((item) => [item.question, item.answer]),
      ...teamContent.en.story,
      ...teamContent.en.members.flatMap((member) => [member.role, ...member.intro]),
      ...faqContent.en.flatMap((item) => [item.question, item.answer]),
      siteContent.en.homeResults.title,
      siteContent.en.homeResults.description,
    ];
    for (const line of visible) {
      expect(line).not.toMatch(EN_KOREA_CENTRIC);
    }
    expect(profile.proofPoints.join(' ')).not.toMatch(/corroborated/);
  });

  it('names the team pages after the nav labels', () => {
    expect(TEAM_NAME_BY_LOCALE.en).toBe('Our Team');
    expect(TEAM_NAME_BY_LOCALE.ja).toBe('チーム紹介');
    expect(TEAM_NAME_BY_LOCALE.ko).toBe('호정 대만·한국 팀');
    expect(TEAM_NAME_BY_LOCALE['zh-hant']).toBe('昊鼎韓國台灣團隊');
  });

  it('links the EN/JA home case study to its write-up, not the archive', () => {
    const en = renderToStaticMarkup(createElement(HomeCaseResultsSplit, { locale: 'en' }));
    expect(en).toContain('href="/en/columns/taiwan-gym-injury-lawsuit"');
    expect(en).toContain('Read the case write-up');
    expect(en).not.toMatch(/Korean/);
    const ja = renderToStaticMarkup(createElement(HomeCaseResultsSplit, { locale: 'ja' }));
    expect(ja).toContain('href="/ja/columns/taiwan-gym-injury-lawsuit"');
    expect(ja).toContain('事例の解説を読む');
    expect(ja).not.toContain('韓国');
    const ko = renderToStaticMarkup(createElement(HomeCaseResultsSplit, { locale: 'ko' }));
    expect(ko).toContain('href="/ko/columns"');
  });

  it('reduces the Korea office to one address line on EN/JA only', () => {
    const en = renderToStaticMarkup(createElement(OfficeMapTabs, { locale: 'en' }));
    expect(en).not.toContain('tel:+82');
    expect(en).not.toContain('map.naver.com');
    expect(en).toContain('Korea office:');
    expect(en).toContain('Office time zone: Taipei (GMT+8).');
    const ja = renderToStaticMarkup(createElement(OfficeMapTabs, { locale: 'ja' }));
    expect(ja).not.toContain('tel:+82');
    expect(ja).not.toContain('map.naver.com');
    expect(ja).toContain('台湾時間（日本時間−1時間）');
    const ko = renderToStaticMarkup(createElement(OfficeMapTabs, { locale: 'ko' }));
    expect(ko).toContain('tel:+821029929304');
    expect(ko).toContain('map.naver.com');
  });

  it('shows Taiwan office numbers in international form on EN/JA and keeps the local form on ko/zh-hant', () => {
    expect(taiwanOfficeData.ja.find((office) => office.id === 'taichung')?.phone).toBe('+886-4-2326-1862');
    expect(taiwanOfficeData.ko.find((office) => office.id === 'taichung')?.phone).toBe('04-2326-1862');
    expect(taiwanOfficeData['zh-hant'].find((office) => office.id === 'taichung')?.phone).toBe('04-2326-1862');
    // EN contact-page office list (site-content) uses the international form too.
    expect(siteContent.en.contact.locations[1].details).toContain('Tel: +886-4-2326-1862');
    expect(siteContent.ko.contact.locations[1].details.join(' ')).not.toContain('+886');
  });

  it('prefills only the page language in the EN/JA consultation email', () => {
    expect(getConsultationEmailTemplate('en').body).toContain('Preferred language: English\n');
    expect(getConsultationEmailTemplate('ja').body).toContain('ご希望の言語：日本語\n');
    expect(getConsultationEmailTemplate('ja').body).not.toMatch(/한국어/);
    expect(getConsultationEmailTemplate('ko').body).toContain('희망 상담 언어: 한국어 / 中文 / English / 日本語');
  });

  it('adds the NT$ billing note on EN/JA pricing without converted amounts', () => {
    const en = renderToStaticMarkup(createElement(PricingCards, { locale: 'en' }));
    expect(en).toContain('Fees are quoted and billed in New Taiwan Dollars (NT$).');
    expect(en).not.toMatch(/US\$\s*\d/);
    const ja = renderToStaticMarkup(createElement(PricingCards, { locale: 'ja' }));
    expect(ja).toContain('料金は新台湾ドル（NT$）建てです。');
    expect(ja).not.toMatch(/\d+\s*円/);
    const ko = renderToStaticMarkup(createElement(PricingCards, { locale: 'ko' }));
    expect(ko).not.toContain('New Taiwan Dollars');
  });
});

describe('WO-X1 EN footer login', () => {
  it('offers the member login in the EN footer only', () => {
    expect(renderToStaticMarkup(createElement(Footer, { locale: 'en' }))).toContain('href="/en/login"');
    expect(renderToStaticMarkup(createElement(Footer, { locale: 'ko' }))).not.toContain('/ko/login');
    expect(renderToStaticMarkup(createElement(Footer, { locale: 'ja' }))).not.toContain('/ja/login');
  });
});

describe('replaceKoreanSpeakerLandingLinks', () => {
  const list = [
    '> See also:',
    '> - [Taiwan Litigation Lawyer Guide](/en/taiwan-litigation-lawyer)',
    '> - [Korean-Speaking Lawyer in Taiwan](/en/korean-lawyer-in-taiwan)',
    '> - [Practice Areas — Labor](/en/services/labor)',
  ].join('\n');

  it('swaps the Korean-speaker landing for the EN entry path', () => {
    const out = replaceKoreanSpeakerLandingLinks(list, 'en');
    expect(out).not.toContain('korean-lawyer-in-taiwan');
    expect(out).toContain('> - [English-language consultation in Taipei](/en/taiwan-lawyer)');
    expect(out.split('\n')).toHaveLength(4);
  });

  it('never duplicates a link the list already has', () => {
    const withLawyer = `${list}\n> - [Taiwan Lawyer Search Guide](/en/taiwan-lawyer)`;
    const out = replaceKoreanSpeakerLandingLinks(withLawyer, 'en');
    expect(out).toContain('(/en/taiwan-company-setup-lawyer)');
    expect(out.match(/\(\/en\/taiwan-lawyer\)/g)).toHaveLength(1);

    const both = `${withLawyer}\n> - [Company setup](/en/taiwan-company-setup-lawyer)`;
    const dropped = replaceKoreanSpeakerLandingLinks(both, 'en');
    expect(dropped).not.toContain('korean-lawyer-in-taiwan');
    expect(dropped.split('\n')).toHaveLength(5);
  });

  it('handles cross-locale hrefs on JA and leaves ko untouched', () => {
    const ja = '> - [韓国語対応可能な台湾の弁護士](/ko/korean-lawyer-in-taiwan)';
    expect(replaceKoreanSpeakerLandingLinks(ja, 'ja')).toBe('> - [日本語で相談できる台湾弁護士](/ja/taiwan-lawyer)');
    const ko = '> - [한국어 가능한 대만 변호사](/ko/korean-lawyer-in-taiwan)';
    expect(replaceKoreanSpeakerLandingLinks(ko, 'ko')).toBe(ko);
    expect(replaceKoreanSpeakerLandingLinks(ko, 'zh-hant')).toBe(ko);
  });
});
