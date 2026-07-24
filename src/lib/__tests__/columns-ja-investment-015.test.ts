import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/015-taiwan-company-setup-pitch-location.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-setup-pitch-location', 'ja');

function extractBodyFaq(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      q: match[1],
      a: match[2],
    }),
  );
}

const faq = [
  {
    q: '台北市では、特定の業種だけが営業場所の事前照会を行えばよいですか？',
    a: 'いいえ。台北市の現行案内では、2023年1月1日から、会社・商業（分公司・分支機構を含む）の設立、所在地移転または営業項目追加の登記を申請する場合、営業場所と営業項目が土地使用分区および建築管理規定に適合するかを事前に照会し、適合する照会結果を登記申請に添付する運用です。旧来の「主動查詢」対象業種の一覧だけで要否を判断しないでください。',
  },
  {
    q: '営業場所事前照会には、どの建物資料が必要ですか？',
    a: '台北市の現行システムでは、原則として発行後3か月以内の建物登記謄本（第二類を含む）または建物所有権状を提出し、住所、階数、面積等を確認できるようにします。建物用途が「住宅を主とし事務所を兼ねる」場合等には、誓約書や土地使用分区証明などの追加資料が必要となるため、物件と用途に応じた最新の必要書類を確認してください。',
  },
  {
    q: '賃貸住所、借址登記、バーチャルオフィスを会社住所に使えますか？',
    a: '名称だけで一律に使用可否を判断することはできません。賃貸借契約書、所有者の同意と所有権資料等により住所を使用する権限を示し、公式通知を受け取れる実態を確保したうえで、台北市の営業場所事前照会と実際の使用状況に関する規制を確認します。登記住所と実際の営業場所が異なる場合も、実際の場所について土地使用、建築、消防、衛生その他の要件を別途満たす必要があります。',
  },
  {
    q: '事前照会で適合となれば、その場所で直ちに営業できますか？',
    a: 'いいえ。事前照会は、営業場所と営業項目について土地使用分区および建築管理規定への適合性を確認する手続です。賃貸人の権限・賃貸借条件、消防、衛生、環境、看板、食品事業者登録、業種別許認可その他の要件をすべて承認するものではありません。会社・商業登記と営業開始までに別途必要な手続を確認してください。',
  },
  {
    q: '事前照会の処理期間と結果の有効期間はどのくらいですか？',
    a: '台北市の行政作業基準には、通常案件は5日（暦日）、外部機関への照会が必要な案件は11日（暦日）という処理目標がありますが、補正、申請件数その他の事情により変わり得るため完了日の保証ではありません。現行ポータルでは、照会結果は審査完了日から6か月間有効と案内されており、期間を過ぎた場合は再申請が必要です。',
  },
];

describe('Japanese investment column 015 — Taipei business-location inquiry', () => {
  it('publishes the contracted frontmatter and exactly five exact FAQs', () => {
    expect(parsed.data.title).toBe(
      '台湾会社設立：営業場所の選び方と台北市の事前照会',
    );
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-setup-pitch-location',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約6分');
    expect(parsed.data.categories).toEqual(['台湾会社設立']);
    expect(parsed.data.featured_image).toBe(
      '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
    );
    expect(parsed.data.faq).toHaveLength(5);
    expect(parsed.data.faq).toEqual(faq);

    expect(post?.slug).toBe('taiwan-company-setup-pitch-location');
    expect(post?.title).toBe(parsed.data.title);
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約6分');
    expect(post?.categoryLabel).toBe('台湾会社設立');
    expect(post?.faq).toEqual(faq);
  });

  it('keeps the five ordered body questions and immediate answers aligned with the FAQs', () => {
    expect(extractBodyFaq(raw)).toEqual(faq);
    expect(extractBodyFaq(post?.content ?? '')).toEqual(faq);
  });

  it('states the comprehensive 2023 review and complete portal sequence', () => {
    const requiredPhrases = [
      '2023年1月1日',
      '会社・商業（分公司・分支機構を含む）の設立、所在地移転または営業項目追加',
      '営業場所事前照会」（營業場所預先查詢）',
      '会社・商業登記の受理前に、営業場所と営業項目の適合性を包括的に確認',
      '使用する正確な住所、階数、範囲および予定する営業項目を特定する。',
      '現在の建物登記資料その他の必要書類を取得する。',
      '営業場所事前照会を申請し、所在地と営業項目の組合せについて審査を受ける。',
      '適合する照会結果を、会社・商業の設立、所在地移転または営業項目追加の登記申請に添付する。',
      '業種別の許認可、消防・衛生上の準備、内装その他の営業開始要件を別途完了する。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const sequence = [
      '使用する正確な住所',
      '現在の建物登記資料',
      '営業場所事前照会を申請',
      '適合する照会結果を',
      '業種別の許認可',
    ];
    const portalSequence = parsed.content.slice(
      parsed.content.indexOf('現在の手続は、概ね次の順序で準備します。'),
    );
    const positions = sequence.map((step) => portalSequence.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('covers supplementation, incompatible results, the five-item limit, and active-inquiry fallback', () => {
    const requiredPhrases = [
      '案内文書により申請者へ結果の補充を求め、補充後に登記手続を進める運用',
      '営業場所を変更するか、不適合となった営業項目を登記申請から外すなどの対応',
      '一回の照会申請で受け付けられる営業項目は最大5項目であり、台北市の現行FAQは主要な営業項目を審査対象とするよう案内しています。第5点所定項目の随案主動查詢とは区別して確認してください。',
      '随案主動查詢',
      '飲食店、レストランその他の食品サービス関係',
      '第5点に掲げる営業項目が登記申請に含まれているのに、提出済みの適合結果にその項目が含まれていない場合',
      '台北市商業処が登記案件に伴って照会を開始する補完的な仕組み',
      '一覧掲載業種だけが事前照会を必要とするという旧来の考え方を復活させるものではありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('requires current building documents and states neutral official transcript channels', () => {
    const requiredPhrases = [
      '発行後3か月以内の建物登記謄本（第二類を含む）または建物所有権状',
      '台北市の各地政事務所や便民工作站などの窓口',
      '政府の電子謄本システム',
      'その他の現行の公式取得経路',
      '特定の知人や弁護士を介することを一律の要件とせず',
      '住宅を主とし事務所を兼ねる',
      '住宅として使用する部分が全体の5分の3を超え',
      '事務所として使用する部分が5分の2未満',
      '誓約書と、土地使用分区証明などの追加資料',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates address-use authority, actual use, and site suitability', () => {
    const requiredPhrases = [
      '賃貸借契約書の写し、または所有者の使用同意書と所有権を証明する資料',
      'その住所を会社所在地として使用する権限',
      'その場所があらゆる営業項目について土地使用分区、建築、消防または衛生上適法であると確認されたことにはなりません。',
      '登記住所とは別の場所で実際に営業する場合',
      '店舗側の土地使用、建築、消防、衛生、食品事業者登録および業種別許認可',
      '登記住所に関する資料を揃えるだけで、別の実際の営業場所の要件まで満たすことにはなりません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('limits inquiry scope and preserves separate fire, health, and food checks', () => {
    const requiredPhrases = [
      '確認範囲には限界があります。',
      '土地使用分区および建築管理規定との適合性を確認するものです。',
      '消防安全設備',
      '食品衛生管理',
      '食品事業者登録',
      '業種別許認可',
      '包括的に許可する証明書ではありません。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies the five- and eleven-calendar-day targets and six-month validity', () => {
    const requiredPhrases = [
      '通常案件は5日（暦日）',
      '外部機関への照会が必要な案件は11日（暦日）',
      '完了日の保証ではありません。',
      'いずれも営業日ではなく暦日による行政上の処理目標',
      '実際の日数は変わり得ます。',
      '審査完了日から6か月間有効',
      '期間を過ぎた場合は再申請が必要です。',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses every official source and only the safe contracted Japanese internal links', () => {
    const officialSources = [
      'https://www.businesslocationinfo.gov.taipei/BLBQS/Home/Notice',
      'https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL080687',
      'https://www.gov.taipei/News_Content.aspx?n=EEC70A4186D4C828&s=E70ACC80BEEC5910&sms=87415A8B9CE81B16',
      'https://laws.gov.taipei/Law/SOPSearch/DownloadFile?sop_no=P04020118.pdf',
      'https://gcis.nat.gov.tw/F/t70044_p',
      'https://www.fda.gov.tw/tc/newsContent.aspx?id=11672',
    ];
    for (const source of officialSources) {
      expect(raw).toContain(source);
    }

    const internalLinks = Array.from(
      raw.matchAll(/\[[^\]]+\]\((\/[^)]+)\)/g),
      (match) => match[0],
    );
    expect(internalLinks).toEqual([
      '[台湾投資・会社設立サービス](/ja/services#investment)',
      '[台湾会社設立の応用編1](/ja/columns/taiwan-company-establishment-advanced-1)',
      '[お問い合わせ](/ja/contact)',
    ]);
  });

  it('preserves the identity and only the two contracted image paths', () => {
    expect(raw).toContain('曾雋崴');
    expect(raw).not.toContain('曾俊瑋');

    const imagePaths = Array.from(
      raw.matchAll(/(?:featured_image: "|!\[[^\]]*\]\()([^"\n)]+\.jpg)/g),
      (match) => match[1],
    );
    expect([...new Set(imagePaths)]).toEqual([
      '../images/015-taiwan-company-setup-pitch-location/featured-01.jpg',
      '../images/015-taiwan-company-setup-pitch-location/img-01.jpg',
    ]);
    expect(raw).not.toContain(
      '../images/015-taiwan-company-setup-pitch-location/img-02.jpg',
    );
    expect(post?.featuredImage).toBe(
      '/images/blog/015-taiwan-company-setup-pitch-location/featured-01.jpg',
    );
  });

  it('removes all forbidden claims, stale terms, unsafe links, and Hangul', () => {
    const forbiddenLiterals = [
      '法人登記',
      '会社登記時にすべての業種を照会する必要はありません',
      '主動查詢対象業種',
      '6項目以上を予定するときは申請を分けて確認する必要があります。',
      '郵便物を受け取れればよい',
      '罰金',
      '後で',
      '/ko/',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }
    expect(raw).not.toMatch(/主動查詢対象業種.*場合にのみ/);
    expect(raw).not.toMatch(/不適合[^。\n]*(?:必ず|常に|一律)[^。\n]*登記[^。\n]*拒否/);
    expect(raw).not.toMatch(/事前照会[^。\n]*(?:だけ|のみ)[^。\n]*営業(?:できます|できる)/);
    expect(raw).not.toMatch(/(?:弁護士|知人)[^。\n]*(?:必須|必要です|依頼しなければ)/);
    expect(raw).not.toMatch(
      /(?:バーチャルオフィス|借址登記)[^。\n]*(?:なら|は)[^。\n]*(?:合法|営業できます|使用できます)/,
    );
    expect(raw).not.toMatch(/(?:5日|11日)[^。\n]*(?:必ず|保証)[^。\n]*(?:完了|処理)/);
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(parsed.data.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
  });

  it('contains substantial Japanese content and resolves canonical and alias slugs', () => {
    const kana = /[\u3040-\u30ff]/g;

    expect(raw.match(kana)?.length ?? 0).toBeGreaterThan(1_500);
    expect(raw.length).toBeGreaterThan(6_500);
    expect(post?.content.length).toBeGreaterThan(5_000);
    expect(post?.slug).toBe('taiwan-company-setup-pitch-location');
    expect(getColumnPost('company-location', 'ja')?.slug).toBe(
      'taiwan-company-setup-pitch-location',
    );
  });
});
