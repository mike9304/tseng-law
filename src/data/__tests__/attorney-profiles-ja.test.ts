import { describe, expect, it } from 'vitest';

import {
  attorneyProfiles,
  getAttorneyProfile,
  getAttorneyProfilePath,
} from '@/data/attorney-profiles';

const koreanProfile = attorneyProfiles.ko['wei-tseng'];
const japaneseProfile = attorneyProfiles.ja['wei-tseng'];

const arrayFields = [
  'alternateNames',
  'summary',
  'languages',
  'practiceAreas',
  'education',
  'experience',
  'notableMatters',
  'internalLinks',
  'externalProfiles',
  'sameAs',
  'keywords',
  'searchTerms',
  'proofPoints',
  'faq',
] as const;

describe('Japanese attorney profile', () => {
  it('has the same fields and collection counts as the Korean profile', () => {
    expect(Object.keys(japaneseProfile).sort()).toEqual(Object.keys(koreanProfile).sort());

    for (const field of arrayFields) {
      expect(japaneseProfile[field], field).toHaveLength(koreanProfile[field].length);
    }
  });

  it('preserves the required identity, credentials, experience, and representative matter', () => {
    expect(japaneseProfile.name).toBe('曾俊瑋弁護士');
    expect(japaneseProfile.role).toBe('台湾弁護士・代表弁護士');

    const profileText = JSON.stringify(japaneseProfile);

    for (const anchor of [
      '国立台湾大学財務金融研究所 修士号取得',
      '国立政治大学',
      '法律学科・金融学科ダブルメジャー',
      '神戸大学・早稲田大学への交換留学',
      '趨勢法律事務所',
      '昊鼎国際法律事務所',
      '法律扶助基金会台中分会',
      '157万TWD',
      '一審判決',
      '韓国語',
      '中国語',
      '日本語',
      '会社設立',
      '投資',
      '訴訟',
      '損害賠償',
      '商標・特許',
      'ビザ',
      '家事',
      '労働紛争',
    ]) {
      expect(profileText, anchor).toContain(anchor);
    }
  });

  it('uses the approved professional Japanese wording', () => {
    expect(japaneseProfile.practiceAreas).toContain('台湾投資に関する法務顧問');
    expect(japaneseProfile.faq[0].answer).toContain('台湾投資に関する法務顧問');
    expect(japaneseProfile.summary[1]).toContain('各種手続の遂行');
    expect(japaneseProfile.summary[2]).toContain(
      '157万TWDの損害賠償を認める一審判決を獲得',
    );
    expect(japaneseProfile.proofPoints[2]).toContain(
      '157万TWDの損害賠償を認める一審判決を獲得',
    );
    expect(japaneseProfile.internalLinks).toContainEqual({
      label: 'お問い合わせ・ご相談',
      href: '/ja/contact',
    });
  });

  it('uses Japanese-localized internal links only', () => {
    expect(japaneseProfile.internalLinks).toHaveLength(6);

    for (const link of japaneseProfile.internalLinks) {
      expect(link.href).toMatch(/^\/ja\//);
    }
  });

  it('does not leak Korean sentences or Korean internal links into visible Japanese copy', () => {
    const { alternateNames: _allowedAlternateNames, ...visibleJapaneseProfile } = japaneseProfile;
    const visibleCopy = JSON.stringify(visibleJapaneseProfile);

    expect(visibleCopy).not.toMatch(/[가-힣]/);
    expect(visibleCopy).not.toContain('/ko/');
  });

  it('resolves the Japanese profile and default profile path', () => {
    expect(getAttorneyProfile('ja', 'wei-tseng')).toBe(japaneseProfile);
    expect(getAttorneyProfilePath('ja')).toBe('/ja/lawyers/wei-tseng');
  });

  it.each(['ko', 'zh-hant', 'en'] as const)('keeps the %s profile resolvable', (locale) => {
    expect(getAttorneyProfile(locale, 'wei-tseng')).toBe(attorneyProfiles[locale]['wei-tseng']);
  });
});
