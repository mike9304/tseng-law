import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/002-withdraw-capital-taiwan-company.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost(
  'withdraw-capital-taiwan-company',
  'zh-hant',
);

const title = '結束台灣公司時，資本額與公司財產應如何處理？';
const exitFaqAnswer =
  '若要永久結束公司，原則上應辦理解散登記及清算，在處理債務與稅務後，才能將剩餘財產分配給股東。若公司仍要存續而返還出資，應依公司種類評估減資等合法程序。正常營業支出、股利分配及公司實際負擔之借款清償，則應分別確認各自的法律及稅務依據與程序。';
const resolutionFaqAnswer =
  '有限公司解散，須經股東表決權三分之二以上同意。股份有限公司原則上須有代表已發行股份總數三分之二以上之股東出席，並經出席股東表決權過半數同意。公開發行公司未達前述出席門檻時，得由代表已發行股份總數過半數之股東出席，並經出席股東表決權三分之二以上同意。章程得訂定更高門檻。解散登記應於解散後十五日內申請。';
const suspensionFaqAnswer =
  '公司停業一個月以上者，應於停業前或停業日起十五日內申請停業登記，每次停業期間最長不得超過一年。但停業年度仍須辦理年度所得稅結算申報，並非所有稅務申報一律免除。仍應依稅目、持有資產、員工及其他具體情形，分別確認相關義務。';
const article9Paragraph =
  '台灣《公司法》第9條規定，公司應收之股款，若股東未實際繳納而以申請文件表明收足，或股東雖已繳納但在登記後將股款發還股東或任由股東收回，公司負責人可能面臨五年以下有期徒刑、拘役，或科或併科新臺幣50萬元以上250萬元以下罰金。這項規定並非處罰所有正常、合法的公司資金運用。';
const article90Paragraph =
  '清算人在公司債務尚未清償前分派公司財產於股東者，依《公司法》第90條，可能面臨一年以下有期徒刑、拘役，或科或併科新臺幣6萬元以下罰金。';
const insolvencyParagraph =
  '解散後的清算並非只有在公司資產大於負債時才能進行。依《公司法》第89條，公司財產不足以清償債務時，清算人應即聲請宣告破產。應依資不抵債、無力清償、擔保、租稅債務及債權人人數，個別判斷能否繼續通常清算。';
const disclaimer =
  '本文僅提供台灣公司結束及公司財產處理的一般法律資訊與教育資料，不構成特定案件的法律意見。適當的解散、清算、減資、停業程序及稅務申報，可能因公司種類、章程、財務狀況、債權人、外國投資及個別交易而異；在實際決議或移轉資金前，仍應就具體案件另行確認。';
const author = '**曾雋崴律師（Wei Tseng）**';

const faq = [
  {
    q: '要把台灣公司的資金返還給股東，是否一定要解散及清算？',
    a: exitFaqAnswer,
  },
  {
    q: '公司解散的決議門檻及登記期限為何？',
    a: resolutionFaqAnswer,
  },
  {
    q: '可以不立即解散，而先辦理停業嗎？',
    a: suspensionFaqAnswer,
  },
];

function firstParagraphAfter(content: string, heading: string) {
  return content.split(`${heading}\n\n`)[1]?.split('\n\n')[0];
}

function extractPublicText(content: string) {
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

describe('Traditional Chinese investment column 002 — company exit and capital return', () => {
  it('publishes the contracted metadata, H1, and exactly three FAQs', () => {
    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/withdraw-capital-taiwan-company',
    );
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('15分鐘閱讀');
    expect(parsed.data.categories).toEqual(['台灣公司設立']);
    expect(parsed.data.featured_image).toBe(
      '../images/002-withdraw-capital-taiwan-company/featured-01.png',
    );
    expect(parsed.content).toContain(`# ${title}`);
    expect(parsed.data.faq).toEqual(faq);
    expect(parsed.data.faq).toHaveLength(3);

    expect(post?.slug).toBe('withdraw-capital-taiwan-company');
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('15分鐘閱讀');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('公司設立');
    expect(post?.featuredImage).toBe(
      '/images/blog/002-withdraw-capital-taiwan-company/featured-01.png',
    );
    expect(post?.faq).toEqual(faq);
  });

  it('keeps every FAQ answer identical to the first paragraph after its H2', () => {
    const headingAnswers = [
      ['## 1. 公司財產與股東出資必須分開處理', exitFaqAnswer],
      ['## 2. 永久結束公司的程序', resolutionFaqAnswer],
      ['## 5. 不立即結束公司時的停業', suspensionFaqAnswer],
    ];

    for (const [heading, answer] of headingAnswers) {
      expect(firstParagraphAfter(parsed.content, heading)).toBe(answer);
      expect(firstParagraphAfter(post?.content ?? '', heading)).toBe(answer);
    }
  });

  it('uses exactly the seven ordered H2 sections', () => {
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual([
      '1. 公司財產與股東出資必須分開處理',
      '2. 永久結束公司的程序',
      '3. 資不抵債或無力清償時',
      '4. 公司繼續存續時的減資',
      '5. 不立即結束公司時的停業',
      '官方資料',
      '相關資訊',
    ]);
  });

  it('preserves both images with the contracted alt treatment', () => {
    expect(parsed.content).toMatch(
      /!\[[^\]]*[\u3400-\u9fff][^\]]*\]\(\.\.\/images\/002-withdraw-capital-taiwan-company\/featured-01\.png\)/,
    );
    expect(parsed.content).toContain(
      '![](../images/002-withdraw-capital-taiwan-company/img-01.png)',
    );
    expect(parsed.content.match(/^!\[[^\]]*\]\([^)]+\)$/gm)).toHaveLength(2);
    expect(
      raw.match(
        /\.\.\/images\/002-withdraw-capital-taiwan-company\/featured-01\.png/g,
      ),
    ).toHaveLength(2);
    expect(
      raw.match(
        /\.\.\/images\/002-withdraw-capital-taiwan-company\/img-01\.png/g,
      ),
    ).toHaveLength(1);
  });

  it('separates company property, paid-in capital, and fact-specific liability', () => {
    const requiredPhrases = [
      '公司財產歸屬於公司，並非股東個人財產。',
      '即使股東持有公司全部股權，或同時是唯一董事，此基本原則亦不因此而改變。',
      '股東不得僅以過去曾經出資為由，自由提領公司存款或資產。',
      '永久消滅公司的解散及清算、公司存續中減少資本的減資、正常營業費用的支付、以盈餘為前提的股利分配，以及公司實際負擔借款的清償，屬於不同的法律及稅務範疇。',
      '僅停止公司營運，法人格及申報義務亦不會因此消滅。',
      article9Paragraph,
      article90Paragraph,
      '不能僅因存在特定交易，即斷定背信等犯罪當然成立',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw.split(article9Paragraph)).toHaveLength(2);
    expect(raw.split(article90Paragraph)).toHaveLength(2);
  });

  it('covers the dissolution, registration, liquidation, and tax sequence', () => {
    const requiredPhrases = [
      '公司章程、股東名簿、最新登記事項、會計帳簿、財務報表及稅務申報資料',
      '將持續中的契約、員工、租賃、許可、資產、債務',
      '外國投資',
      '《公司法》第113條',
      '《公司法》第316條',
      '《公司登記辦法》第4條',
      '應於解散後十五日內，依公司種類及解散原因準備相應的解散變更登記',
      '主管機關核准解散之日起四十五日內辦理當期決算申報',
      '核准日的意義及起算方法',
      '選任清算人，或確認法定清算人',
      '向法院陳報必要事項',
      '財產目錄及資產負債表',
      '了結公司現存事務',
      '收取尚未受償的債權',
      '清償債務與稅捐',
      '必要的通知、公告及債權人保護程序',
      '僅於債務與稅捐全部處理完畢後所餘的剩餘財產',
      '自清算完結之日起三十日內申報清算所得',
      '向法院辦理必要的清算完結陳報',
      '因合併、分割或破產而解散者，通常清算程序可能免除',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const stepLeads = [
      '1. **調查結束前的現況。**',
      '2. **依公司種類作成解散決議。**',
      '3. **於期限內申請解散變更登記。**',
      '4. **辦理解散時點的當期決算申報。**',
      '5. **確定清算人並進行法院及債權人相關程序。**',
      '6. **確定可供分配的剩餘財產。**',
      '7. **完結清算並辦理最後申報。**',
    ];

    for (const lead of stepLeads) {
      expect(raw).toContain(lead);
      expect(post?.content).toContain(lead);
    }

    const section2 = parsed.content
      .split('## 2. 永久結束公司的程序')[1]
      ?.split('## 3.')[0];
    expect(section2?.match(/^\d+\. \*\*/gm)).toHaveLength(7);
    expect(parsed.content).not.toContain('### ');
  });

  it('preserves every native-review Taiwanese legal phrasing correction', () => {
    const correctedPhrases = [
      '若選擇永久結束，應連結解散登記與清算，整理公司的契約、債權、債務、稅捐及剩餘財產。',
      '本文就檢討結束台灣公司時經常混淆的公司財產、已繳股款、減資、解散、清算、破產聲請、剩餘財產分配及停業，分別說明。',
      '1. **調查結束前的現況。** 取得公司章程、股東名簿、最新登記事項、會計帳簿、財務報表及稅務申報資料。',
      '並非所有公司均適用相同的文件與順序',
      '應避免事後將出資改記為借款的做法',
      '清算人應編造財產目錄及資產負債表、了結公司現存事務，收取尚未受償的債權，並決定資產的保全及變現方式。',
      '銀行帳戶的結清、印鑑與文件的保管、稅務及會計帳簿的法定保存、許可及契約的最終狀態，亦應一併檢核。',
      '即使帳面資產眾多，若無法立即變現或已設定擔保，清償能力的評價可能不同。反之，亦不能僅因一時現金不足，即斷定所有情形均適用相同程序。',
      '應一併判斷該等措施是否解決已發生的無力清償問題、是否侵害其他債權人的權利，以及之後能否繼續通常清算。',
      '可能需要準備銀行要求的登記資料、投資相關文件、稅務資料及資金性質說明。',
      '若以公司繼續存續為前提，重要的是在董事會或股東決策資料中，留下付款後是否仍能正常營運及清償債務的評估。',
      '應維持可收受郵件及機關通知的地址與負責人',
    ];

    for (const phrase of correctedPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const replacedPhrases = [
      '公司若要永久退出',
      '規劃公司退出時',
      '完整盤點退出前的法律與財務狀態',
      '不能把所有公司退出都套入同一流程',
      '不能在準備退出時',
      '使公司在清算開始時的財務狀況可以被檢驗',
      '並留下可負責保管及接受通知的人員與聯絡方式',
      '短期現金緊張，也不必然代表每一個案件都直接進入相同程序',
      '新資金是否足以恢復支付能力、是否只是延後問題',
      '是否可以匯出、應提出哪些文件及款項如何定性',
      '還必須證明付款後仍能維持營運',
      '維持能收受主管機關、法院、債權人及交易相對人通知的地址與聯絡安排',
    ];

    for (const phrase of replacedPhrases) {
      expect(raw).not.toContain(phrase);
    }
  });

  it('explains insolvency without the obsolete asset-and-creditor formula', () => {
    const requiredPhrases = [
      insolvencyParagraph,
      '財務狀況不明確時，不應先計算股東可取回的金額。',
      '實際處分價值',
      '若無法立即變現或已設定擔保，清償能力的評價可能不同',
      '資不抵債一般是比較資產與負債的財務狀態問題；無力清償則涉及到期債務能否支付的問題。',
      '擔保權、租稅債權、工資等債權種類及優先關係，應依各該適用法律確認',
      '若僅優先支付特定債權人或股東，可能損害其他債權人的利益及程序公平。',
      '不應僅依舊版說明所見的簡化公式或複數要件，決定是否聲請宣告破產。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw.split(insolvencyParagraph)).toHaveLength(2);
  });

  it('qualifies capital reduction, ordinary payments, dividends, and real loans', () => {
    const requiredPhrases = [
      '減資可作為公司存續中依法返還部分出資的方法予以評估',
      '減資並非股東隨時取走公司存款的非正式提款手段，亦非任何時候均可採行。',
      '債權人保護、資本查核及會計處理、外國投資、稅務、匯款及變更登記',
      '有外國股東的公司',
      '投資相關文件、稅務資料及資金性質說明',
      '股利分配亦應與減資或清算後分配相區別。',
      '公司帳戶有現金，並不代表有可分配盈餘',
      '累積虧損、法定盈餘公積及未分配盈餘',
      '公司實際負擔借款的清償',
      '各自需要契約、決議、憑證、扣繳等依據',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps suspension temporary and preserves every continuing obligation', () => {
    const requiredPhrases = [
      suspensionFaqAnswer,
      '停業是公司在一定期間停止營業、但仍維持法人格的選項。',
      '不具使公司消滅或將既有權利義務一概整理的效果',
      '所在地、負責人、章程、資本額等登記事項',
      '必要的變更登記',
      '車輛或建物等資產',
      '地方稅、管理費、保險費等其他負擔可能持續發生',
      '停業前應決定交易契約終止或維持',
      '依法處理勞動關係',
      '各業別許可的維持條件及換發期限',
      '管理銀行帳戶及稅務電子資料的負責人',
      '於法定期間保存會計帳簿及憑證的體制',
      '停業年度仍有年度所得稅結算申報義務',
      '停業期間屆滿前，應決定是否恢復營業、重新檢討停業要件，或轉為永久結束。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses every official source and contracted internal link exactly once in order', () => {
    const officialLinks = [
      '[台灣公司法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)',
      '[經濟部公司登記辦法](https://law.moea.gov.tw/LawContent.aspx?id=FL011312)',
      '[財政部決算、清算及停業稅務說明](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/profit-seeking-enterprise-income-tax/liquidation-procedure/x6mOPan)',
      '[經濟部停業申請期限說明](https://serv.gcis.nat.gov.tw/crm/faqAction.do?id=659&method=faqDetlDetl)',
    ];
    const internalLinks = [
      '[台灣投資及公司設立服務](/zh-hant/services#investment)',
      '[台灣公司設立基礎](/zh-hant/columns/taiwan-company-establishment-basics)',
      '[聯絡我們](/zh-hant/contact)',
    ];
    const markdownLinks = Array.from(
      parsed.content.matchAll(/(?<!!)\[[^\]]+\]\(([^)]+)\)/g),
      (match) => match[0],
    );

    expect(markdownLinks).toEqual([...officialLinks, ...internalLinks]);
    for (const link of [...officialLinks, ...internalLinks]) {
      expect(raw.split(link)).toHaveLength(2);
    }
  });

  it('ends after the exact disclaimer and official author', () => {
    expect(parsed.content).toContain(disclaimer);
    expect(raw.trimEnd()).toMatch(
      new RegExp(
        `${disclaimer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n${author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
      ),
    );
    expect(raw.trimEnd()).toMatch(/\*\*曾雋崴律師（Wei Tseng）\*\*$/);
  });

  it('freezes the exact visible Han count and derives read_time at 400 Han per minute', () => {
    const publicText = extractPublicText(parsed.content);
    const hanCount = publicText.match(/\p{Script=Han}/gu)?.length ?? 0;
    const calculatedMinutes = Math.ceil(hanCount / 400);

    expect(hanCount).toBeGreaterThanOrEqual(4_000);
    expect(hanCount).toBe(5_940);
    expect(calculatedMinutes).toBe(15);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
  });

  it('resolves the canonical and alias slugs in Traditional Chinese', () => {
    expect(post?.slug).toBe('withdraw-capital-taiwan-company');
    expect(getColumnPost('withdraw-capital', 'zh-hant')?.slug).toBe(
      'withdraw-capital-taiwan-company',
    );
  });

  it('removes stale claims, wrong locale links, promises, and hidden characters', () => {
    const forbiddenLiterals = [
      '剩餘財產（資本額）',
      '資本額（剩餘財產）',
      '直接挪用公司資金',
      '背信罪當然成立',
      '公司登記法第四條',
      '下一期即可免辦稅務申報',
      '放任公司即自動停業處分',
      '客戶對話',
      '成功案例',
      '快速回覆',
      '招攬諮詢',
      '/ko/',
      '/ja/',
      '/en/',
      '曾俊瑋',
      '\uFEFF',
      '\u00A0',
      '\u200B',
      '\u200C',
      '\u200D',
      '\u2060',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(
      /公司資金[^。\n]*(?:一律|均|全部)[^。\n]*第9條/,
    );
    expect(raw).not.toMatch(
      /僅(?:在|限)[^。\n]*資產[^。\n]*大於[^。\n]*負債[^。\n]*才能清算/,
    );
    expect(raw).not.toMatch(
      /資產小於負債[^。\n]*(?:有財產|多數債權人)[^。\n]*(?:兩項|二項|要件)/,
    );
    expect(raw).not.toMatch(/清算[^。\n]*(?:約|大約|通常)\s*\d+\s*(?:日|週|月|年)/);
    expect(raw).not.toMatch(
      /(?:結果|核准|匯款)[^。\n]*(?:保證|一定|必然)/,
    );
    expect(raw).not.toMatch(/[\uAC00-\uD7A3]/);
    expect(raw).not.toMatch(/[\u3040-\u30FF]/);
  });
});
