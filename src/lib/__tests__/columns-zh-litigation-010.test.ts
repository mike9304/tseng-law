import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-zh/010-taiwan-gym-injury-lawsuit.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const canonicalSlug = 'taiwan-gym-injury-lawsuit';
const post = getColumnPost(canonicalSlug, 'zh-hant');
const aliasPost = getColumnPost('gym-injury-lawsuit', 'zh-hant');

const title = '台灣健身房受傷求償：一審案例、期限、證據與賠償項目';
const sourceUrl =
  'https://www.wei-wei-lawyer.com/post/taiwan-gym-injury-lawsuit';
const featuredImage =
  '../images/010-taiwan-gym-injury-lawsuit/featured-01.jpg';
const imagePrefix = '../images/010-taiwan-gym-injury-lawsuit/';
const judgmentUrl =
  'https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDV,109,%E6%B6%88,7,20220124,1';
const officialAmount = '新臺幣1,579,589元';

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
    caption: '男大生硬舉90公斤後椎間盤破裂，向健身房求償',
    url: 'https://tw.news.yahoo.com/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82-%E6%80%92%E5%91%8A%E5%81%A5%E8%BA%AB%E6%88%BF%E6%B1%82%E5%84%9F-095800997.html',
  },
  {
    image: 'img-03.jpg',
    caption:
      '韓國男大生硬舉90公斤致椎間盤破裂，一審獲賠157萬元並傳上訴審和解',
    url: 'https://www.ettoday.net/amp/amp_news.php7?news_id=2475272&ref=mw&from=google.com',
  },
  {
    image: 'img-04.jpg',
    caption: '韓國男大生硬舉90公斤受傷，一審獲賠157萬元並傳上訴審和解',
    url: 'https://tw.news.yahoo.com/%E9%9F%93%E7%94%B7%E5%A4%A7%E7%94%9F-%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E9%87%80%E5%82%B7%E7%8D%B2%E8%B3%A0157%E8%90%AC-%E5%81%A5%E8%BA%AB%E5%B7%A5%E5%BB%A0%E4%BA%8C%E5%AF%A9%E4%BD%8E%E8%AA%BF%E5%92%8C%E8%A7%A3-013448072.html',
  },
  {
    image: 'img-05.jpg',
    caption: '男大生硬舉90公斤後椎間盤破裂，向健身房求償',
    url: 'https://news.ebc.net.tw/news/living/362075',
  },
  {
    image: 'img-06.jpg',
    caption:
      '批踢踢新聞討論：韓國男大生硬舉90公斤致椎間盤破裂，健身房一審判賠157萬元',
    url: 'https://www.ptt.cc/bbs/MuscleBeach/M.1680935985.A.BF6.html',
  },
  {
    image: 'img-07.jpg',
    caption:
      '部落格評論：體重70公斤的韓國男大生硬舉90公斤受傷，健身房責任如何判斷',
    url: 'https://blog.udn.com/blackjack/179081715',
  },
  {
    image: 'img-08.jpg',
    caption:
      '法律評論：男大生硬舉致椎間盤破裂，知名健身房一審判賠157萬元',
    url: 'https://lawdb.tw/2023/04/12/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%B7%B4%E7%A1%AC%E8%88%89%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82%EF%BC%8C%E7%9F%A5%E5%90%8D%E5%81%A5%E8%BA%AB%E6%88%BF%E5%88%A4%E8%B3%A0%EF%BC%91%EF%BC%95%EF%BC%97/',
  },
  {
    image: 'img-09.jpg',
    caption:
      '一起看判決：健身新手被要求硬舉90公斤後發生急性椎間盤破裂',
    url: 'https://www.instagram.com/p/Crp4vJag7v3/',
  },
] as const;

const finalMedia = {
  image: 'img-10.jpg',
  caption: '韓國男大生上教練課硬舉90公斤後椎間盤破裂？',
} as const;

const faqHeadings = [
  '1. 在台灣健身房受傷，可以採取哪些法律途徑？',
  '2. 刑事告訴與民事求償各有什麼期限？',
  '3. 事故發生後，如何保存相關證據？',
  '4. 健身房受傷可能主張哪些損害項目？',
  '5. 健身房有責任保險，為什麼仍可能發生爭議？',
];

const internalLinks = [
  '/zh-hant/taiwan-litigation-lawyer',
  '/zh-hant/korean-lawyer-in-taiwan',
  '/zh-hant/taiwan-lawyer',
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

describe('Traditional Chinese litigation column 010 — gym injury damages', () => {
  it('publishes the exact metadata, sole H1, and five ordered FAQ sections', () => {
    expect(parsed.data).toEqual({
      title,
      url: sourceUrl,
      lastmod: '2026-07-25',
      date_display: '2025年9月13日',
      read_time: '7分鐘閱讀',
      categories: ['訴訟案例分析'],
      featured_image: featuredImage,
    });
    expect(
      Array.from(parsed.content.matchAll(/^# (.+)$/gm), (match) => match[1]),
    ).toEqual([title]);
    expect(
      Array.from(parsed.content.matchAll(/^## (.+)$/gm), (match) => match[1]),
    ).toEqual(faqHeadings);
    expect(raw).toContain(
      `# ${title}\n\n![台灣健身房受傷求償案例說明](${featuredImage})`,
    );
  });

  it('derives the seven-minute read time from the exact visible Han count', () => {
    const visibleText = extractVisibleText(parsed.content);
    const visibleHanCount =
      visibleText.match(/[\u3400-\u4DBF\u4E00-\u9FFF]/g)?.length ?? 0;
    const calculatedMinutes = Math.ceil(visibleHanCount / 400);

    expect(visibleHanCount).toBe(2_653);
    expect(calculatedMinutes).toBe(7);
    expect(parsed.data.read_time).toBe(`${calculatedMinutes}分鐘閱讀`);
    expect(post?.readTime).toBe(`${calculatedMinutes}分鐘閱讀`);
  });

  it('locks every approved native-copy refinement exactly', () => {
    const approvedReplacements = [
      '以下依序整理相關新聞、討論與法律評論。各標題僅用來標示所連結的報導或貼文內容，不代表本文另行認定其中每一項敘述均屬事實。',
      '本案的實務意義，在於說明健身房受傷案件中的責任與損害均須逐項證明，不能僅憑事故發生即認定健身房應負責或逕定賠償範圍。服務提供者負有何種安全義務、具體指導是否違反注意義務、行為與傷害之間有無因果關係，以及損害範圍如何計算，均應依個案事實及證據判斷。刑事告訴與民事請求的成立要件及期間也不相同，事故發生後應分別確認。',
      `依[《消費者保護法》第7條](${lawUrls[0]})，提供服務的企業經營者於提供服務時，應確保服務符合當時科技或專業水準可合理期待的安全性。`,
      '這項規定不表示只要有人在健身房受傷，企業經營者或教練就當然負責。個案仍須判斷注意義務的具體內容、是否違反該義務、違反義務與傷害間的因果關係、實際損害、可能的抗辯，以及雙方提出的證據。',
      '個案中可能涉及的損害項目包括：',
      '4. **勞動能力減損**：如有持續性障礙，法院可能綜合醫療或鑑定資料、勞動能力減損程度、職業、收入及可工作期間，判斷賠償範圍。單一鑑定所認定的減損比例不會自動決定賠償金額，也不能當然以退休年齡作為損失計算終點。',
      '請求權人仍須就責任、因果關係、損害發生及金額提出相關證明。',
      '健身房投保責任保險，本身並不表示健身房或教練負有法律責任，也不能直接決定應支付的金額。保險的承保範圍、保額、除外責任或免責條款、事故與傷害間的因果關係，以及各項損害是否必要及其金額認定，都可能成為爭點。',
      '保險人的審查結果、健身房提出的和解方案或受傷者主張的金額，都不當然等同於法院最終可能認定的賠償金額。是否適合透過保險理賠或協商處理，仍應配合承保範圍、現有證據、期限及當事人的實際需求個別評估。',
    ];

    for (const replacement of approvedReplacements) {
      expect(raw).toContain(replacement);
      expect(countOccurrences(raw, replacement)).toBe(1);
    }
  });

  it('attributes the exact official first-instance result and appeal report correctly', () => {
    expect(countOccurrences(raw, sourceUrl)).toBe(1);
    expect(countOccurrences(raw, judgmentUrl)).toBe(1);
    expect(countOccurrences(raw, officialAmount)).toBe(1);
    expect(raw).toContain(`[${officialAmount}](${judgmentUrl})`);
    expect(raw).toContain('臺灣臺中地方法院於2022年1月24日');
    expect(raw).toContain('109年度消字第7號一審判決');
    expect(raw).toContain('媒體報導稱雙方在上訴審達成和解');
    expect(raw).toContain('並非官方一審判決所認定的結果');
    expect(raw).toContain('該判決也沒有記載和解金額');
    expect(raw).not.toContain('一審判決確定');
    expect(raw).not.toContain('上訴審判決和解');
    expect(raw).not.toMatch(/和解金額(?:為|是|共計)\s*[\d,]+/);
  });

  it('links each controlling provision once and preserves fact-dependent limits', () => {
    for (const url of lawUrls) {
      expect(countOccurrences(raw, url)).toBe(1);
      expect(post?.content).toContain(`(${url})`);
    }

    const requiredRules = [
      '應確保服務符合當時科技或專業水準可合理期待的安全性。',
      '不表示只要有人在健身房受傷，企業經營者或教練就當然負責。',
      '注意義務的具體內容、是否違反該義務、違反義務與傷害間的因果關係、實際損害、可能的抗辯，以及雙方提出的證據',
      '如果事實符合過失傷害罪的法定要件，可以評估提出刑事告訴。',
      '契約責任、侵權行為責任或消費者保護法上的責任',
      '《刑法》第284條的過失傷害罪屬於告訴乃論之罪。',
      '自知悉犯人之時起六個月內提出告訴。',
      '自請求權人知有損害及賠償義務人時起，原則上二年間不行使而消滅；自侵權行為發生時起逾十年，也會消滅。',
      '另有契約或其他請求權基礎，或者涉及期間起算、停止或其他影響期間的規定，結論可能不同。',
    ];
    for (const rule of requiredRules) {
      expect(raw).toContain(rule);
    }
  });

  it('qualifies evidence preservation without promising compulsion or police recovery', () => {
    const requiredEvidenceRules = [
      '監視器影像、就醫紀錄與診斷證明、醫療費與其他支出收據、與健身房或教練的通訊、目擊者陳述、課程預約及出席紀錄、訓練計畫與實際訓練紀錄',
      '以存證信函或律師函提出正式的書面保存請求',
      '留下何時要求保存哪些資料的紀錄',
      '不會自動產生強制保存義務，也不能保證資料不被刪除',
      '並非當然作出不利推論',
      '使偵查機關依個案判斷是否具備依法調取或保全影像的理由',
      '報案不等於警方必然能取得監視器畫面',
    ];
    for (const rule of requiredEvidenceRules) {
      expect(raw).toContain(rule);
    }

    for (const promise of [
      '防止健身房銷毀證據',
      '健身房銷毀證據，在訴訟中將對其不利',
      '由警方到健身房調取監視器畫面',
      '健身房會被迫保存',
      '法院必然作出不利推論',
      '警方一定能取得監視器',
    ]) {
      expect(raw).not.toContain(promise);
    }
  });

  it('covers every permitted damage category and qualified Article 51 multiplier', () => {
    const requiredDamageRules = [
      '**醫療費用**',
      '**必要的看護或照護費用**',
      '**必要的交通費用**',
      '**勞動能力減損**',
      '**休養期間的工作收入損失**',
      '**非財產上損害**',
      '**懲罰性賠償金**',
      '單一鑑定所認定的減損比例不會自動決定賠償金額，也不能當然以退休年齡作為損失計算終點。',
      '得請求實際損害額五倍以下；因重大過失者，為三倍以下；因過失者，為一倍以下。',
      '仍取決於法定要件、個案證據與法院判斷。',
      '不是每件事故都能獲得賠償的固定清單',
      '請求權人仍須就責任、因果關係、損害發生及金額提出相關證明。',
    ];
    for (const rule of requiredDamageRules) {
      expect(raw).toContain(rule);
    }
  });

  it('keeps insurance, procedures, and closing advice properly qualified', () => {
    const requiredQualifications = [
      '健身房投保責任保險，本身並不表示健身房或教練負有法律責任，也不能直接決定應支付的金額。',
      '保險的承保範圍、保額、除外責任或免責條款、事故與傷害間的因果關係，以及各項損害是否必要及其金額認定',
      '都不當然等同於法院最終可能認定的賠償金額。',
      '是否適合透過保險理賠或協商處理，仍應配合承保範圍、現有證據、期限及當事人的實際需求個別評估。',
      '應先接受適當醫療照護，並儘早保存可以取得的證據，再就可能適用的期限與處理方案尋求個案法律意見。',
      '協商、消費申訴或調解、刑事告訴與民事求償，都是依具體事實選擇的途徑，並非每件事件都必須全部進行。',
    ];
    for (const qualification of requiredQualifications) {
      expect(raw).toContain(qualification);
    }
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

  it('uses only the approved external URLs and three ZH-Hant internal links', () => {
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
      readTime: '7分鐘閱讀',
      category: 'case',
      categoryLabel: '訴訟案例',
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
    const forbiddenLiterals = [
      '民法第198條',
      '《民法》第198條',
      'flno=198',
      '韓國人非常熱愛運動',
      '台灣消費者的維權意識較為薄弱',
      '台灣民眾都感到非常驚訝',
      '台灣最大的健身房',
      '唯一的上市健身品牌',
      '健身界、體育界、律師界和法律界引起了極大的迴響',
      '健身房通常都設有監視器',
      '健身房通常都有投保',
      '保險公司通常不願意輕易理賠',
      '請務必透過訴訟',
      '應積極主張自己的權利',
      '台灣律師的重要實務經驗，請務必記住',
      '台湾',
      '受伤',
      '诉讼',
      '证据',
      '赔偿',
      '消费者保护法',
      '监视器画面',
      '/ko/',
      '/en/',
      '/ja/',
      '\uFEFF',
      '\u00A0',
    ];
    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(
      /[\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u,
    );
    expect(raw).not.toMatch(/(?:必須|務必|一定要)\s*(?:提起|進行)\s*訴訟/);
    expect(raw).not.toContain('只要受傷就當然負責');
    expect(raw).not.toContain('凡是在健身房受傷一定獲得賠償');
  });
});
