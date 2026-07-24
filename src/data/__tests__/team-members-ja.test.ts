import { describe, expect, it } from 'vitest';

import { teamContent } from '@/data/team-members';

const canonicalIds = [
  'tseng-junwei',
  'chang-rongxuan',
  'chang-fangyu',
  'son-jungmin',
  'huang-shengping',
] as const;

const expectedJapaneseIdentity = {
  'tseng-junwei': ['曾雋崴弁護士', '台湾弁護士・代表弁護士'],
  'chang-rongxuan': ['張容瑄', '台湾弁護士'],
  'chang-fangyu': ['張芳瑀', 'パラリーガル'],
  'son-jungmin': ['孫貞旻', '韓国事務長'],
  'huang-shengping': ['黃勝平', '提携会計士'],
} as const;

describe('Japanese team content', () => {
  it('keeps the canonical five-member order and immutable record fields', () => {
    const japaneseMembers = teamContent.ja.members;
    const sourceMembers = teamContent['zh-hant'].members;

    expect(japaneseMembers.map(({ id }) => id)).toEqual(canonicalIds);
    expect(sourceMembers.map(({ id }) => id)).toEqual(canonicalIds);

    for (const [index, member] of japaneseMembers.entries()) {
      const source = sourceMembers[index];
      expect(member.id).toBe(source.id);
      expect(member.profileSlug).toBe(source.profileSlug);
      expect(member.email).toBe(source.email);
      expect(member.photo).toBe(source.photo);
      expect(member.sourceUrl).toBe(source.sourceUrl);
    }
  });

  it('uses the required Japanese names and role descriptions without invented readings', () => {
    for (const member of teamContent.ja.members) {
      const [name, role] = expectedJapaneseIdentity[member.id as keyof typeof expectedJapaneseIdentity];
      expect(member).toMatchObject({ name, role });
      expect(member.name).not.toMatch(/[ぁ-んァ-ヶー]/);
    }

    expect(JSON.stringify(teamContent.ja)).not.toContain('曾俊瑋');
  });

  it('translates every team copy field completely without inherited Hangul', () => {
    const japanese = teamContent.ja;
    const sourceMembers = teamContent['zh-hant'].members;
    const topLevelCopy = [
      japanese.label,
      japanese.title,
      japanese.description,
      ...japanese.story,
    ];

    expect(japanese.story).toHaveLength(teamContent['zh-hant'].story.length);

    for (const [index, member] of japanese.members.entries()) {
      const source = sourceMembers[index];
      expect(member.intro).toHaveLength(source.intro.length);
      expect(member.education).toHaveLength(source.education.length);
      expect(member.experience).toHaveLength(source.experience.length);
      topLevelCopy.push(
        member.name,
        member.role,
        ...member.intro,
        ...member.education,
        ...member.experience,
      );
    }

    for (const value of topLevelCopy) {
      expect(value.trim()).not.toBe('');
      expect(value).not.toMatch(/[가-힣]/);
    }
  });

  it('preserves the lead profile contract and the intentionally blank operations email', () => {
    const lead = teamContent.ja.members.find(({ id }) => id === 'tseng-junwei');
    const operations = teamContent.ja.members.find(({ id }) => id === 'son-jungmin');

    expect(lead).toMatchObject({
      profileSlug: 'wei-tseng',
      email: 'wei@hoveringlaw.com.tw',
      photo: '/images/team/wei-tseng-official.png',
    });
    expect(operations?.email).toBe('');
  });

  it('preserves reviewer-approved credential-sensitive wording', () => {
    const japanese = teamContent.ja;
    const lead = japanese.members.find(({ id }) => id === 'tseng-junwei');
    const paralegal = japanese.members.find(({ id }) => id === 'chang-fangyu');
    const operations = japanese.members.find(({ id }) => id === 'son-jungmin');
    const accountant = japanese.members.find(({ id }) => id === 'huang-shengping');

    expect(japanese.description).toContain('パラリーガル');
    expect(japanese.story[0]).toBe(
      '昊鼎国際法律事務所では、韓国・日本のクライアントによる台湾への投資や、台湾での訴訟・法律相談を支援する実務チームを編成しています。',
    );
    expect(lead?.intro[1]).toBe(
      '韓国人留学生のジムでの負傷に関する損害賠償請求事件を代理し、一審で157万TWDの損害賠償を認める判決を得た実績があります。',
    );
    expect(lead?.experience).toContain('法律扶助基金会台中分会の法律扶助担当弁護士');
    expect(paralegal?.experience).toContain('慕陽國際法律事務所 シニアパラリーガル');
    expect(paralegal?.intro[1]).toBe(
      '訴訟支援、会社設立、外国人投資の認可手続、各種許認可申請、韓国・台湾間のコミュニケーションを支援します。',
    );
    expect(operations?.education).toEqual(['国立成功大学でコンピュータサイエンスを専攻（学士）']);
    expect(accountant?.intro[1]).toBe(
      '法律・会計・税務上の課題を総合的に検討し、企業クライアントを支援しています。',
    );
    expect(accountant?.intro[1]).not.toContain('財務');
    expect(accountant?.experience).toEqual(['勤信聯合會計師事務所']);
  });

  it('preserves representative Korean, Traditional Chinese, and English copy', () => {
    expect(teamContent.ko.title).toBe('호정 한국·대만 업무팀');
    expect(teamContent.ko.members[0].intro[1]).toBe(
      '한국 유학생 헬스장 손해배상 사건에서 157만 대만달러 배상 판결을 이끈 사례가 있습니다.',
    );
    expect(teamContent['zh-hant'].members[2]).toMatchObject({
      name: '張芳瑀',
      role: '法務專員',
      education: ['東海大學法律學系學士'],
    });
    expect(teamContent.en.story[0]).toBe(
      'Hovering runs an integrated practice team supporting Taiwan investment, litigation, and legal advisory for Korean and Japanese clients.',
    );
  });
});
