import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/010-taiwan-gym-injury-lawsuit.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-gym-injury-lawsuit';
const post = getColumnPost(canonicalSlug, 'ja');
const aliasPost = getColumnPost('gym-injury-lawsuit', 'ja');

const title = '台湾のジム事故損害賠償：一審事例・期限・証拠・賠償項目';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-gym-injury-lawsuit';
const featuredImage =
  '../images/010-taiwan-gym-injury-lawsuit/featured-01.jpg';
const imagePrefix = '../images/010-taiwan-gym-injury-lawsuit/';
const judgmentUrl =
  'https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDV,109,%E6%B6%88,7,20220124,1';
const officialAmount = '1,579,589台湾ドル';

const lawUrls = [
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=J0170001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=287&pcode=C0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=197&pcode=B0000001',
  'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=51&pcode=J0170001',
];

const mediaRecords = [
  {
    image: 'img-02.jpg',
    caption:
      '男子大学生、90キロのデッドリフト後に椎間板破裂…ジムに損害賠償を請求',
    url: 'https://tw.news.yahoo.com/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82-%E6%80%92%E5%91%8A%E5%81%A5%E8%BA%AB%E6%88%BF%E6%B1%82%E5%84%9F-095800997.html',
  },
  {
    image: 'img-03.jpg',
    caption:
      '韓国人男子大学生、90キロのデッドリフト中に椎間板破裂…一審で157万台湾ドルの賠償・控訴審で和解と報道',
    url: 'https://www.ettoday.net/amp/amp_news.php7?news_id=2475272&ref=mw&from=google.com',
  },
  {
    image: 'img-04.jpg',
    caption:
      '韓国人男子大学生、90キロのデッドリフト中に負傷―一審で157万台湾ドル、控訴審で和解と報道',
    url: 'https://tw.news.yahoo.com/%E9%9F%93%E7%94%B7%E5%A4%A7%E7%94%9F-%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E9%87%80%E5%82%B7%E7%8D%B2%E8%B3%A0157%E8%90%AC-%E5%81%A5%E8%BA%AB%E5%B7%A5%E5%BB%A0%E4%BA%8C%E5%AF%A9%E4%BD%8E%E8%AA%BF%E5%92%8C%E8%A7%A3-013448072.html',
  },
  {
    image: 'img-05.jpg',
    caption:
      '男子大学生、90キロのデッドリフト後に椎間板破裂…ジムに損害賠償を請求',
    url: 'https://news.ebc.net.tw/news/living/362075',
  },
  {
    image: 'img-06.jpg',
    caption:
      'PTT投稿：韓国人男子大学生、90キロのデッドリフト中に椎間板破裂…一審でジム側に157万台湾ドルの賠償命令',
    url: 'https://www.ptt.cc/bbs/MuscleBeach/M.1680935985.A.BF6.html',
  },
  {
    image: 'img-07.jpg',
    caption:
      'ブログ：体重70キロの韓国人大学生が90キロのデッドリフトで負傷、100万台湾ドルを超える賠償…ジムに落ち度はあったのか？トレーニングをする人の姿勢は？',
    url: 'https://blog.udn.com/blackjack/179081715',
  },
  {
    image: 'img-08.jpg',
    caption:
      '法律解説：男子大学生、デッドリフト中に椎間板破裂…一審で有名ジム側に157万台湾ドルの賠償命令',
    url: 'https://lawdb.tw/2023/04/12/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%B7%B4%E7%A1%AC%E8%88%89%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82%EF%BC%8C%E7%9F%A5%E5%90%8D%E5%81%A5%E8%BA%AB%E6%88%BF%E5%88%A4%E8%B3%A0%EF%BC%91%EF%BC%95%EF%BC%97/',
  },
  {
    image: 'img-09.jpg',
    caption:
      '判決を読む：ジム初心者に90キロのデッドリフトを指示し、急性椎間板破裂が生じた事例',
    url: 'https://www.instagram.com/p/Crp4vJag7v3/',
  },
] as const;

const finalMedia = {
  image: 'img-10.jpg',
  caption:
    '韓国人男子大学生がパーソナルトレーニング中に90キロのデッドリフトを行い、椎間板が破裂？',
} as const;

const faqHeadings = [
  '1. 台湾のジムで負傷した場合、どのような法的手段を検討できますか？',
  '2. 刑事告訴と民事上の損害賠償請求には、どのような期限がありますか？',
  '3. 事故後の証拠は、どのように確保・保存すればよいですか？',
  '4. ジム事故では、どのような損害項目を請求できますか？',
  '5. ジムに賠償責任保険があっても、賠償の可否や金額が争われることがありますか？',
];

const internalLinks = [
  '/ja/taiwan-litigation-lawyer',
  '/ja/korean-lawyer-in-taiwan',
  '/ja/taiwan-lawyer',
];

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function extractVisibleText(content: string) {
  return content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---$/gm, '')
    .replace(/[「」『』“”‘’*_`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

describe('Japanese litigation column 010 — gym injury damages', () => {
  it('publishes the exact frontmatter, sole H1, and five ordered FAQ sections', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: '2025年9月13日',
      read_time: '約9分',
      categories: ['訴訟事例分析'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(faqHeadings);
    expect(raw).toContain(
      `# ${title}\n\n![台湾のジム事故に関する損害賠償事例の解説](${featuredImage})`,
    );
  });

  it('derives read time from the exact visible Japanese count and meaningful kana', () => {
    const visibleText = extractVisibleText(parsed.content);
    const visibleJapaneseCount =
      visibleText.match(
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const visibleKanaCount =
      visibleText.match(
        /[\p{Script=Hiragana}\p{Script=Katakana}]/gu,
      )?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleJapaneseCount / 500);

    expect(visibleJapaneseCount).toBe(4_233);
    expect(visibleJapaneseCount).toBeGreaterThanOrEqual(3_500);
    expect(visibleKanaCount).toBe(2_075);
    expect(visibleKanaCount).toBeGreaterThanOrEqual(1_500);
    expect(visibleKanaCount / visibleJapaneseCount).toBeGreaterThan(0.4);
    expect(calculatedMinutes).toBe(9);
    expect(parsed.data.read_time).toBe(`約${calculatedMinutes}分`);
    expect(post?.readTime).toBe(`約${calculatedMinutes}分`);
  });

  it('attributes the exact official first-instance result and appeal report correctly', () => {
    expect(countOccurrences(raw, sourceUrl)).toBe(1);
    expect(countOccurrences(raw, judgmentUrl)).toBe(1);
    expect(countOccurrences(raw, officialAmount)).toBe(1);
    expect(raw).toContain(`[${officialAmount}](${judgmentUrl})`);
    expect(raw).toContain(
      `台湾台中地方法院は、2022年1月24日付の一審判決（109年度消字第7号）で、被告に対し、原告に[${officialAmount}](${judgmentUrl})と判決に記載された利息を支払うよう命じました。`,
    );
    expect(raw).toContain(
      '本件では、曾雋崴弁護士（Wei Tseng）が原告である韓国人学生の訴訟代理人を務めました。',
    );
    expect(raw).toContain(
      '当事者が控訴審で和解したことがメディア報道により伝えられました',
    );
    expect(raw).toContain(
      '公式の一審判決だけでは控訴審の処理結果や和解額を確認できないため、これを一審判決の確定結果とみなすべきではありません。',
    );
    expect(raw).not.toContain('控訴審の確定判決');
    expect(raw).not.toMatch(/和解(?:額|金額)(?:は|が)\s*[\d,万]+/);
  });

  it('links every controlling provision once and preserves fact-dependent limits', () => {
    for (const url of lawUrls) {
      expect(countOccurrences(raw, url)).toBe(1);
      expect(post?.content).toContain(`(${url})`);
    }

    const requiredRules = [
      `[台湾消費者保護法第7条](${lawUrls[0]})は、事業者がサービスを提供する際、そのサービスが提供当時の専門的・技術的水準に照らして合理的に期待される安全性を備えるようにしなければならないと定めています。`,
      'ジムで負傷すれば常に事業者やトレーナーの責任が成立するという意味ではありません。',
      '具体的にどのような注意義務があったか、その義務に違反したか、違反と負傷との間に因果関係があるか、実際に損害が発生したか、相手方にどのような抗弁があるか、各主張と抗弁を裏付ける証拠があるか',
      '過失傷害罪の法定要件が満たされる場合には、刑事告訴を検討できます。',
      '契約責任、不法行為責任、消費者保護法上の責任',
      '一つの事故について複数の手続を検討できるからといって、すべての手続を行わなければならないわけではなく、いずれか一方の勝訴が保証されるわけでもありません。',
      '同法第284条の過失傷害罪は、被害者等の告訴がなければ訴追できない親告罪です。',
      '犯人を知った時から6か月以内に告訴しなければなりません。',
      '損害と賠償義務者の双方を知った時から原則として2年間行使しないと消滅し、不法行為の時から10年を経過した場合も消滅します。',
      '契約責任など別の請求原因が問題となる場合や、起算点、期間の進行・中断などに関する別の規定が適用されるかどうかは、事実関係によって異なります。事故日や診断日だけで期限を断定せず、考えられる請求根拠と基準日を早期に個別確認するのが安全です。',
    ];
    for (const rule of requiredRules) expect(raw).toContain(rule);
  });

  it('qualifies evidence preservation without promising compulsion or recovery', () => {
    const requiredEvidenceRules = [
      '防犯カメラ映像だけでなく、診療録や診断書、医療費・交通費・介護費の領収書、ジムやトレーナーとのメッセージ、目撃者の供述、レッスンの予約・出席記録、運動計画表やトレーニング記録',
      '負傷部位や事故現場の状況も可能な範囲で撮影し、事故前後の経過や連絡内容を日付順に整理',
      '必要な時間帯と場所、カメラの位置を具体的に記載した内容証明郵便や弁護士名義の書面により、ジムへ保存を要請する方法',
      '何をいつ要請したかを記録するための実務上の措置',
      '相手方に映像を保存する法的義務を新たに課したり、削除を防いだりできるわけではなく',
      '映像が残っていないという事情だけで裁判所が自動的に不利な判断をするわけでもありません。',
      '事故の経緯が犯罪の構成要件に該当する可能性がある場合は、速やかに被害を申告し、捜査機関に適法な取得または保全の根拠があるかを判断してもらうことが考えられます。',
      '申告したからといって警察や検察が必ず防犯カメラ映像を取得するというわけではない',
    ];
    for (const rule of requiredEvidenceRules) expect(raw).toContain(rule);
  });

  it('covers all permitted damages and keeps insurance and closing qualified', () => {
    const requiredRules = [
      '**医療費**',
      '**必要な介護・付添費用**',
      '**必要な交通費**',
      '**労働能力の喪失による損害**',
      '**療養期間中の休業損害**',
      '**非財産的損害**',
      '**懲罰的損害賠償**',
      '実際に認められるか、またその額は、各費用の必要性、事故との因果関係、証拠、責任割合および裁判所の判断によります。',
      '障害の割合だけで賠償額が確定したり、損失が退職時まで自動的に計算されたりするわけではありません。',
      '実損害額の5倍以下、重大な過失について3倍以下、過失について1倍以下',
      '同法がその事案に適用されるか、裁判所が賠償を認めるか、その額をいくらとするかは、法定要件、証拠、裁判所の評価によります。',
      '保険が存在するという事実は、賠償原資を検討する際に意味を持つ場合があります',
      'それ自体によってジムやトレーナーの法的責任が認められたり、支払額が確定したりするわけではありません。',
      '保険契約の補償限度額や免責・除外条項、事故と負傷との因果関係、各損害項目の必要性と金額',
      '医療・収入・職業に関する資料や専門家の意見が必要となる場合があります。',
      '後遺障害の評価結果も賠償額を自動的に決定するものではありません。',
      '保険証券と約款、事故通知の内容、保険者の回答、治療経過、損害資料を併せて確認する必要があります。',
      '交渉、消費者からの苦情申立てや調停、刑事告訴、民事上の損害賠償請求は、いずれも事案に応じて選択できる手段であり、常にすべてを行わなければならない手続ではありません。',
    ];
    for (const rule of requiredRules) expect(raw).toContain(rule);
  });

  it('preserves every image and outlet URL in order with safe standalone markup', () => {
    const imagePaths = Array.from(
      raw.matchAll(
        /!\[[^\]]*\]\((\.\.\/images\/010-taiwan-gym-injury-lawsuit\/[^)]+)\)/g,
      ),
      (match) => match[1],
    );
    expect(imagePaths).toEqual([
      featuredImage,
      `${imagePrefix}img-01.jpg`,
      ...Array.from(
        { length: 9 },
        (_, index) =>
          `${imagePrefix}img-${String(index + 2).padStart(2, '0')}.jpg`,
      ),
    ]);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    for (let imageNumber = 1; imageNumber <= 10; imageNumber += 1) {
      expect(
        countOccurrences(
          raw,
          `img-${String(imageNumber).padStart(2, '0')}.jpg`,
        ),
      ).toBe(1);
    }

    const expectedCaptionOccurrences = new Map<string, number>();
    for (const { image, caption, url } of mediaRecords) {
      expect(raw).toContain(
        `![${caption}](${imagePrefix}${image})\n\n[${caption}](${url})`,
      );
      expect(countOccurrences(raw, url)).toBe(1);
      expectedCaptionOccurrences.set(
        caption,
        (expectedCaptionOccurrences.get(caption) ?? 0) + 2,
      );
    }
    for (const [caption, occurrences] of expectedCaptionOccurrences) {
      expect(countOccurrences(raw, caption)).toBe(occurrences);
    }

    expect(raw).toContain(
      `![${finalMedia.caption}](${imagePrefix}${finalMedia.image})\n\n**${finalMedia.caption}**`,
    );
    expect(countOccurrences(raw, finalMedia.caption)).toBe(2);
    expect(raw).not.toContain('[![');
    expect(raw).not.toMatch(/\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)/);
  });

  it('uses only the approved external URLs and three Japanese internal links', () => {
    expect(raw.match(/https?:\/\/[^\s)"']+/g)).toEqual([
      sourceUrl,
      judgmentUrl,
      ...mediaRecords.map(({ url }) => url),
      ...lawUrls,
    ]);

    const markdownInternalTargets = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[1],
    );
    expect(markdownInternalTargets).toEqual(internalLinks);
    expect(
      parsed.content.match(/\/(?:ko|zh-hant|en|ja)(?:\/[^\s)]*)?/g),
    ).toEqual(internalLinks);
    for (const link of internalLinks) {
      expect(countOccurrences(raw, link)).toBe(1);
      expect(post?.content).toContain(`(${link})`);
    }
  });

  it('loads the complete article through the public API and legacy alias', () => {
    expect(post).toMatchObject({
      slug: canonicalSlug,
      title,
      date: '2026-07-25',
      dateDisplay: '2025年9月13日',
      readTime: '約9分',
      category: 'case',
      categoryLabel: '訴訟事例分析',
      featuredImage:
        '/images/blog/010-taiwan-gym-injury-lawsuit/featured-01.jpg',
    });
    expect(post?.faq).toBeUndefined();

    const expectedRendererContent = parsed.content
      .replace(/\(\.\.\/images\/([^)]+)\)/g, '(/images/blog/$1)')
      .trimStart()
      .replace(/^#\s+.+\n*/, '')
      .replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n*/, '')
      .trimStart()
      .replace(/\n?\s*!\[[^\]]*\]\([^)]+\)\s*\n?/g, '\n\n')
      .trim();
    expect(post?.content).toBe(expectedRendererContent);
    expect(post?.content).not.toMatch(/!\[[^\]]*\]\([^)]+\)/);
    expect(post?.content).toContain(`[${officialAmount}](${judgmentUrl})`);
    expect(post?.content).toContain(`## ${faqHeadings[0]}`);
    expect(post?.content).toContain(`## ${faqHeadings.at(-1)}`);

    expect(aliasPost).toBeDefined();
    expect(aliasPost?.slug).toBe(canonicalSlug);
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.date).toBe(post?.date);
    expect(aliasPost?.content).toBe(post?.content);
  });

  it('removes legal errors, guarantees, cultural claims, and wrong scripts', () => {
    const visibleText = extractVisibleText(parsed.content);
    const forbiddenLiterals = [
      '民法第198条',
      '民法第198條',
      'flno=198',
      '韓国の方は運動が大好き',
      '台湾の消費者は権利意識が弱く',
      '台湾の人々は非常に驚きます',
      '台湾最大のジム',
      '当時唯一の上場フィットネスブランド',
      'フィットネス界、体育界、台湾の弁護士界、法律界で大きな話題',
      'ジムには通常CCTVが設置されています',
      'ジムはCCTV映像が不利であるため',
      'ジムが破棄できないようにする',
      'ジムが証拠を破棄すれば訴訟で不利に働きます',
      '警察がジムからCCTVを確保するようにします',
      '台湾のジムは通常保険に加入',
      '台湾の保険会社は',
      'ぜひ訴訟を提起',
      '自分の権利を積極的に主張',
      '男大生硬舉',
      '韓國男大生',
      '批踢踢實業坊',
      '一起看判決',
      '曾俊瑋',
      '/ko/',
      '/zh-hant/',
      '/en/',
      '\uFEFF',
      '\u00A0',
      '\u200B',
    ];
    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(visibleText).not.toMatch(/[\p{Script=Hangul}]/u);
    expect(visibleText).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(raw).not.toContain('すべての案件で訴訟を提起する必要があります');
    expect(raw).not.toContain('必ず訴訟を提起してください');
    expect(raw).not.toContain('当然訴訟を行うべきです');
    expect(raw).not.toContain('ジムで負傷すれば必ず賠償されます');
    expect(raw).not.toContain('障害等級により賠償額が確定します');
  });
});
