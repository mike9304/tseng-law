import { describe, expect, it } from 'vitest';

import {
  attorneyProfiles,
  getAttorneyProfile,
  getAttorneyProfilePath,
} from '@/data/attorney-profiles';
import {
  CONSULTATION_EMAIL,
  getConsultationEmailTemplate,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';

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
    // WO-X1 (J06/J22): JA adds the optional visible H1/lede fields the EN
    // profile already uses; every Korean field is still present.
    expect(Object.keys(japaneseProfile).sort()).toEqual(
      [...Object.keys(koreanProfile), 'heading', 'lede'].sort(),
    );

    for (const field of arrayFields) {
      if (field === 'languages') continue;
      expect(japaneseProfile[field], field).toHaveLength(koreanProfile[field].length);
    }
    // WO-X1 (J04, user decision 2026-09-23): English added, Japanese first.
    expect(japaneseProfile.languages).toEqual(['日本語', '中国語', '英語', '韓国語']);
    expect(japaneseProfile.heading).toBe('曾雋崴（Wei Tseng）台湾弁護士');
    expect(japaneseProfile.lede).toContain('日本語能力試験（JLPT）N1');
    expect(japaneseProfile.lede).toContain('神戸大学・早稲田大学への交換留学');
  });

  it('preserves the required identity, credentials, experience, and representative matter', () => {
    expect(japaneseProfile.name).toBe('曾雋崴弁護士');
    expect(japaneseProfile.role).toBe('台湾弁護士・パートナー弁護士');

    const profileText = JSON.stringify(japaneseProfile);

    for (const anchor of [
      '国立台湾大学財務金融研究所 修士号取得',
      '国立政治大学',
      '法律学科・金融学科ダブルメジャー',
      '神戸大学・早稲田大学への交換留学',
      '趨勢法律事務所',
      '昊鼎国際法律事務所',
      '法律扶助基金会台中分会',
      '一審勝訴',
      '控訴審で和解',
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
    // User decision 2026-09-28 (1A): first-instance win + appeal settlement,
    // no award amount.
    expect(japaneseProfile.summary[2]).toContain(
      '一審勝訴を得た後、控訴審で和解により終結',
    );
    expect(japaneseProfile.proofPoints[2]).toContain(
      '一審勝訴を得た後、控訴審で和解により終結',
    );
    expect(japaneseProfile.internalLinks).toContainEqual({
      label: 'お問い合わせ・ご相談',
      href: getConsultationPublicMailto('ja'),
    });
  });

  it('uses Japanese-localized internal links only', () => {
    expect(japaneseProfile.internalLinks).toEqual([
      { label: '台湾弁護士・チーム紹介', href: '/ja/lawyers' },
      {
        label: '台湾会社設立ガイド',
        href: '/ja/columns/taiwan-company-establishment-basics',
      },
      { label: '台湾会社設立サービス', href: '/ja/services/investment' },
      { label: '民事訴訟・損害賠償サービス', href: '/ja/services/civil' },
      {
        label: '台湾のジム事故損害賠償：一審事例・期限・証拠・賠償項目',
        href: '/ja/columns/taiwan-gym-injury-lawsuit',
      },
      { label: 'お問い合わせ・ご相談', href: getConsultationPublicMailto('ja') },
    ]);

    const internalLinkJson = JSON.stringify(japaneseProfile.internalLinks);
    expect(internalLinkJson).not.toContain('/ja/taiwan-lawyer');
    expect(internalLinkJson).not.toContain('/ja/taiwan-company-setup-lawyer');
    expect(internalLinkJson).toContain('/ja/services/investment');
    expect(internalLinkJson).toContain('/ja/services/civil');
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

  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)(
    'preserves the official identity sources and facts for the %s profile',
    (locale) => {
      const profile = attorneyProfiles[locale]['wei-tseng'];

      expect(getAttorneyProfile(locale, 'wei-tseng')).toBe(profile);
      expect(profile.email).toBe(CONSULTATION_EMAIL);
      expect(profile.image).toBe('/images/team/wei-tseng-official.png');
      expect(profile.sameAs).toEqual([
        'https://www.hoveringlaw.com.tw/en/wei.html',
        'https://www.hoveringlaw.com.tw/zh/wei.html',
        'https://www.hoveringlaw.com.tw/kr/wei.html',
        'https://www.wei-wei-lawyer.com/',
        'https://www.wei-wei-lawyer.com/lawyertseng',
        'https://www.youtube.com/@weilawyer',
        'https://blog.naver.com/wei_lawyer/223461663913',
        'https://www.threads.com/@lawyer.wei',
      ]);
      // User decision 2026-09-28 (1A, Taiwan attorney-advertising ethics):
      // the gym case is described as a first-instance win later settled on
      // appeal; no profile surface states the award amount.
      const serializedProfile = JSON.stringify(profile);
      const [firstInstanceWin, appealSettlement] = ({
        ko: ['1심 승소', '항소심에서 화해'],
        'zh-hant': ['一審勝訴', '二審和解'],
        en: ['won at first instance', 'settled on appeal'],
        ja: ['一審勝訴', '控訴審で和解'],
      } as const)[locale];
      expect(serializedProfile.toLowerCase()).toContain(firstInstanceWin.toLowerCase());
      expect(serializedProfile).toContain(appealSettlement);
      expect(serializedProfile).not.toMatch(
        /157|1\.57|1,579,589|TWD|NT\$|新台幣|新臺幣|대만달러|新台湾ドル/,
      );
    },
  );

  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)(
    'routes the %s profile consultation action through the centralized localized mailto',
    (locale) => {
      const profile = attorneyProfiles[locale]['wei-tseng'];
      const consultationLink = profile.internalLinks.at(-1);
      const template = getConsultationEmailTemplate(locale);

      expect(consultationLink?.href).toBe(getConsultationPublicMailto(locale));
      expect(consultationLink?.href).toContain(
        `mailto:${CONSULTATION_EMAIL}?subject=${encodeURIComponent(template.subject)}`,
      );
      expect(consultationLink?.href).toContain(
        `&body=${encodeURIComponent(template.body)}`,
      );
      expect(consultationLink?.href).not.toMatch(
        /\/contact|tel:|010-2992-9304|kakao|line\.me|lin\.ee/i,
      );
    },
  );
});
