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
  '臺灣《公司法》第九條規定，公司應收之股款，若股東未實際繳納而以申請文件表明收足，或股東雖已繳納但在登記後將股款發還股東或任由股東收回，公司負責人可能面臨五年以下有期徒刑、拘役，或科或併科新臺幣五十萬元以上二百五十萬元以下罰金。這項規定並非處罰所有正常、合法的公司資金運用。';
const article90Paragraph =
  '清算人在公司債務尚未清償前分派公司財產者，依《公司法》第九十條，可能面臨一年以下有期徒刑、拘役，或科或併科新臺幣六萬元以下罰金。';
const insolvencyParagraph =
  '解散後的清算並非只有在公司資產大於負債時才能進行。依《公司法》第八十九條，公司財產不足以清償債務時，清算人應即聲請宣告破產。應依資產負債、支付能力、擔保、租稅債務及債權人情形，個別判斷能否繼續通常清算。';
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
    expect(parsed.data.read_time).toBe('19分鐘閱讀');
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
    expect(post?.readTime).toBe('19分鐘閱讀');
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
      '公司財產屬於公司，不是股東個人財產。',
      '即使公司只有一名股東，該股東同時擔任董事或負責人，也不會因此讓公司與個人的財產合而為一。',
      '股東曾經出資，不代表日後可以自由提領公司存款或把公司資產移轉到自己名下。',
      '永久結束公司、公司存續中的減資、正常營業支出、股利分配，以及公司真實借款的清償，是不同的法律與稅務類型。',
      '停止接單、關閉店面或沒有營收，也不等於公司法人格及申報義務已經消失。',
      article9Paragraph,
      article90Paragraph,
      '不能看到公司資金流向股東或關係人，就直接認定特定犯罪必然成立',
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
      '公司章程、股東名簿、登記資料、歷次決議、會計帳簿、財務報表與稅務申報資料',
      '客戶與供應商契約、租賃、授權、保險、員工',
      '外國投資',
      '《公司法》第一百一十三條',
      '《公司法》第三百一十六條',
      '《公司登記辦法》第四條',
      '解散後十五日內應申請解散變更登記',
      '主管機關核准解散之日起四十五日內辦理當期決算申報',
      '核准日的認定及如何起算',
      '選任清算人，或確認依法應由何人擔任清算人',
      '向法院辦理必要的就任聲報',
      '財產目錄及資產負債表',
      '了結現務',
      '收取債權',
      '清償債務與稅捐',
      '債權人通知、公告或催報程序',
      '債務與稅捐處理後才能分派剩餘財產',
      '清算結束日起三十日內申報清算所得',
      '向法院辦理必要的清算完結聲報',
      '合併、分割或破產所造成的解散，可能免辦通常清算',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('preserves every native-review Taiwanese legal phrasing correction', () => {
    const correctedPhrases = [
      '公司若確定不再經營，通常須以解散及清算處理尚未完成的契約、債權、債務、稅捐與財產；若只是暫時停止營業，則可依實際計畫評估停業，但停業本身不會消除既有義務，也不會使公司自動消滅。',
      '規劃結束公司營運時',
      '### 第一步：完整盤點結束營運前的法律與財務狀況',
      '不能把所有公司結束營運的情形都套入同一流程',
      '不能在準備結束公司營運時',
      '應依公司種類、章程、股東決議及法律規定，選任清算人，或確認依法應由何人擔任清算人，並向法院辦理必要的就任聲報。清算人接管公司印章、帳簿、憑證、銀行帳戶與數位系統後，應製作財產目錄及資產負債表，以供查核公司開始清算時的財務狀況。',
      '帳簿、憑證及重要公司文件仍須依適用規定保存，並指定負責保管文件及收受通知之人，留存其聯絡方式。',
      '帳面資產高於負債的公司，也可能因資產缺乏流動性而無法支付到期貨款、薪資或稅款；但短期出現資金周轉困難，也不當然表示公司即應進入破產程序，仍須依個案整體判斷。',
      '新資金是否足以恢復清償能力、是否只是延後處理債務問題、是否會不當影響債權人的受償順位或機會，以及公司是否仍有合理的存續或清算方案，都應以更新後的現金流量及資產負債資料評估。',
      '能否匯出、應提出哪些文件，以及款項性質應如何認定，均應在付款前依個案向相關機關及銀行確認。',
      '公司既然選擇繼續存續，仍應在付款前評估其後是否有能力維持營運、履行契約並清償到期債務。',
      '公司也須維持可供主管機關、法院、債權人及交易相對人送達文書或通知的地址，並安排聯絡窗口。',
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
      '帳上應收帳款可能難以收回',
      '實際處分價值',
      '設定擔保、遭查封、共有關係或契約限制',
      '資不抵債是資產與負債比較後的財務狀態，無力清償則涉及到期債務是否能依約支付',
      '員工薪資與退休或資遣相關債權、未納稅捐、訴訟與仲裁請求',
      '不能只按債權人提出要求的先後順序付款',
      '不應使用「有財產且有多名債權人」之類的簡化公式判斷',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
    expect(raw.split(insolvencyParagraph)).toHaveLength(2);
  });

  it('qualifies capital reduction, ordinary payments, dividends, and real loans', () => {
    const requiredPhrases = [
      '減資可能是依法返還部分出資的方式',
      '減資並不是股東私下提款，也不是只要公司有現金就永遠可以採用。',
      '債權人保護、公告或通知、異議、資本查核、會計調整及變更登記',
      '外國投資人持股的公司',
      '投資、稅務及銀行文件',
      '合法股利也不是從資本額中任意提款。',
      '公司帳戶有現金，不等於有可分配盈餘',
      '累積虧損、當期損益、法定盈餘公積及未分配盈餘',
      '公司償還真實借款',
      '契約、決議、憑證、扣繳與會計稅務基礎',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('keeps suspension temporary and preserves every continuing obligation', () => {
    const requiredPhrases = [
      suspensionFaqAnswer,
      '停業是公司暫時停止營業、但仍維持法人格的狀態。',
      '不具有解散與清算的效果',
      '公司所在地、負責人、章程、資本額或其他登記事項',
      '必要的變更登記',
      '車輛、房屋或土地',
      '牌照稅、房屋稅、地價稅、保險、停車、管理與維護',
      '契約應逐一決定終止、暫停或繼續履行',
      '員工部分則要依法處理',
      '產業許可',
      '銀行帳戶、公司印鑑、電子憑證、發票、個人資料與網路系統',
      '公司帳簿、交易憑證、申報文件',
      '停業年度的營利事業所得稅結算申報不能省略',
      '停業期滿前，公司應主動決定復業、依當時規定再次評估停業，或轉入解散及清算。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses every official source and contracted internal link exactly once in order', () => {
    const officialLinks = [
      '[臺灣公司法](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)',
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
    expect(hanCount).toBe(7_404);
    expect(calculatedMinutes).toBe(19);
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
      /公司資金[^。\n]*(?:一律|均|全部)[^。\n]*第九條/,
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
