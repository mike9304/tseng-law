import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/004-taiwan-company-subsidiary-vs-branch.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-company-subsidiary-vs-branch', 'ja');

const legalFormAnswer =
  '支店は外国会社の一部であり、支店自体に株主は存在しません。第三者と台湾事業へ共同出資したい場合は、台湾子会社を設立して株主構成を定める方法等を検討します。責任、議決権、資金調達、許認可および税務は、出資関係と事業計画に応じて確認する必要があります。';
const taxAnswer =
  '子会社と支店はいずれも、一般に営業税5％および営利事業所得税20％の対象となります。台湾子会社が国外の親会社へ配当する場合、国内法上の源泉徴収率は21％ですが、台湾・韓国所得税協定の適用要件を満たすと上限10％です。外国会社の台湾支店の税引後利益を本店へ送金することは配当ではなく、原則として追加の源泉徴収はありません。総機構が台湾国外にある事業者は、未分配利益に対する5％の追加課税の申告対象外です。';
const listingAnswer =
  '支店は独立した発行会社ではないため、台湾で上場主体にはなれません。子会社の上場には、会社法および証券取引所の所定要件を満たす必要があります。税制優遇は組織形態だけで一律に決まるものではありません。産業創新条例第10条の1の投資税額控除等について、対象投資、申請期限、控除方法、重複適用および税額上限を個別に確認する必要があります。';
const legalIdentityParagraph =
  '台湾会社法第1条は、同法に基づいて組織・登記・設立され、営利を目的とする法人を会社と定めています。これに基づき設立された台湾子会社は、外国の親会社とは別の台湾法人です。子会社は自己の名義で事務所を賃借し、取引契約や労働契約を締結し、財産を取得し、訴訟の当事者となることができます。契約から生じる債権・債務も原則として子会社に帰属します。親会社が経営方針を定めたり役員を選任したりしても、両社の法人格が直ちに一つになるわけではありません。';
const branchShareholderParagraph =
  '支店は外国会社の一部であり、支店自体に株主は存在しません。第三者と台湾事業へ共同出資したい場合は、台湾子会社を設立して株主構成を定める方法等を検討する必要があります。責任、議決権、資金調達、許認可および税務は、出資関係と事業計画に応じて確認する必要があります。';
const limitedLiabilityParagraph =
  '子会社に適用される責任の範囲は、実際に選択した会社形態と行為に基づいて判断します。たとえば有限公司の株主は、会社法第99条第1項に基づき、原則として出資額を限度に会社に対する責任を負います。しかし第99条第2項は、株主が法人格を濫用して会社が特定の債務を弁済することが困難になり、その濫用が重大である場合に、必要な範囲で責任を負う場合があるという例外を定めています。別途、株主や親会社が保証を提供したり、直接不法行為に関与したりした場合には、その保証や行為に基づく責任も検討する必要があります。したがって、有限責任の原則は重要な出発点ですが、どのような状況でも責任が出資額で終わるという保証ではありません。';
const branchRegistrationParagraph =
  '外国会社が自己の名義で台湾で営業しようとする場合は、支店に関する会社法の規定に従わなければなりません。会社法第371条によれば、外国会社は支店登記をせずに外国会社名義で台湾で営業することはできません。第372条に基づき、外国会社は台湾支店の営業に充てる資金を割り当て、台湾責任者を指定しなければなりません。この資金は台湾営業のための本店資金であり、支店の株式や持分ではありません。責任者の指定も、支店を独立した会社に変える手続ではなく、台湾で外国会社の業務を行い責任関係を明確にする仕組みです。';
const jointVentureTermsParagraph =
  '第三者と台湾事業を共にする計画であれば、出資比率だけを定めるのでは不十分です。議決権、取締役の選任、重要事項の同意権、追加出資、資金不足時の措置、知的財産の使用、利益分配、競業制限、持分譲渡、デッドロックおよび事業終了を併せて定める必要があります。台湾子会社に共同出資する方式は、これらの関係を会社の株主構成の中で設計できるという利点があります。ただし、特定プロジェクトの契約上の共同事業、別の特別目的構造等、他の適法な方法もあり得るため、子会社だけがすべての共同事業の唯一の解決策だと断定することはできません。';
const headquartersControlParagraph =
  '支店方式では、支店運営に関する最終的な法的主体は外国会社です。本店は、台湾責任者が締結できる契約の範囲、銀行取引権限、人事権、報告体系、予算承認および内部統制を具体的に定める必要があります。反対に子会社を選択した場合は、定款と機関構成、株主間の権限配分、子会社と親会社間のサービス・貸付・ライセンス契約を区別して文書化しなければなりません。名称よりも、実際の権限と取引の流れが法的構造に合っているかが重要です。';
const regulatedBusinessParagraph =
  '許認可も法人格だけで結論を出すことはできません。業種別の規定が申請主体、最低資本、専門人材、事業場、外国人投資審査または責任者の資格を別途定めることがあるためです。子会社や支店の登記が可能であるという事実と、特定の規制事業を営むことができるという事実は同一ではありません。予定する事業活動を細分化し、各活動の契約当事者と許可名義を先に確認する必要があります。';
const section1Heading = '## 1. 法人格と出資構造';
const section2Heading = '## 2. 税務と利益送金';
const comparisonTableHeader = '| 比較項目 | 台湾子会社 | 外国会社の台湾支店 |';
const comparisonTableRows = [
  '| 法的地位 | 台湾法に基づき設立された独立法人 | 外国本店の一部であり、別個の法人格を有しない |',
  '| 出資・株主構成 | 会社形態に応じて株主と出資関係を定める | 独自の株式・持分・株主構成がない |',
  '| 第三者との共同投資 | 定款、株主構成、株主間契約等で設計可能 | 支店自体への持分出資は不可能であり、別の適法な共同事業構造を検討 |',
  '| 責任主体 | 契約と債務は原則として子会社に帰属 | 支店の契約と債務は外国会社に帰属 |',
  '| 主要な意思決定と運営統制 | 株主総会、取締役等、選択した会社形態の機関と内部規定による | 外国本店の意思決定体系と台湾責任者の権限による |',
];
const section1ProseParagraphs = [
  branchShareholderParagraph,
  legalIdentityParagraph,
  limitedLiabilityParagraph,
  branchRegistrationParagraph,
  jointVentureTermsParagraph,
  headquartersControlParagraph,
  regulatedBusinessParagraph,
];

const extractSection1 = (text: string): string => {
  const start = text.indexOf(section1Heading);
  const end = text.indexOf(section2Heading);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return text.slice(start, end);
};
const treatyEligibilityParagraph =
  'この違いだけを見て、子会社の税負担が常に大きいと結論づけることはできません。課税所得、繰越欠損金、費用の帰属、留保する利益、資金調達方法、利子その他の支払、利益送金の時期、租税協定の適用資格および親会社所在地の税制を総合して比較する必要があります。協定税率を利用する場合には、居住者証明書や受益者の確認など、適用要件と手続も確認します。';
const lossQualification =
  '台湾支店の損益は外国本店との関係で処理されますが、韓国側で損失をどのように扱えるかは、韓国税法、会計基準、外国税額控除その他の制度により異なります。台湾支店を選べば韓国親会社の税負担が必ず減るとはいえません。';
const transferPricingParagraph =
  '移転価格や本支店間の費用配賦には、根拠資料が必要です。契約、請求、会計処理および資金移動の実態を一致させ、台湾と本店所在地の双方で申告上の扱いを確認してください。';
const liabilityParagraph =
  '支店は外国本店と同じ法人であるため、支店の債務は外国会社の債務となります。子会社は独立した法人であり、株主は原則として出資額を限度に責任を負います。ただし、親会社の保証、取締役の義務、不法行為、労働、税務、規制およびグループ会社間の契約等によって別の責任が生じる場合があるため、子会社を設立すればすべてのリスクが遮断されるとは限りません。';
const riskQualificationParagraph =
  'たとえば、金融機関や取引先が親会社保証を求める場合、子会社を選んでも親会社が契約上の責任を負うことがあります。役員の法令違反、製品事故、労働問題、租税申告、許認可違反なども、単に法人を分けるだけでリスクが解消されるわけではありません。事業リスクに応じた契約、保険、内部統制およびコンプライアンス体制が必要です。';
const financingParagraph =
  '支店には独自の株式や持分がないため、第三者に株式や持分を発行して出資を受けることはできません。台湾で将来の増資、現地パートナーの参加、従業員向け株式報酬、事業再編または持分譲渡による退出を想定する場合、独立法人である子会社のほうが計画を設計しやすいことがあります。';
const listingParagraph =
  '支店は独立した発行会社ではないため、台湾で上場主体にはなれません。台湾子会社が上場を申請するには、会社法に基づく発行会社であることに加え、台湾証券取引所等の設立年数、資本、収益、株式分散、内部統制その他の所定要件を満たす必要があります。';
const incentiveParagraph =
  '税制優遇は、子会社か支店かという名称だけで一律に決まるものではありません。現行の産業創新条例第10条の1には、一定の新品のスマート機械、5G、サイバーセキュリティ、AI製品・サービス、省エネ・脱炭素関連設備または技術への投資に関する投資税額控除があり、控除額には当年度の営利事業所得税額の30％という上限があります。対象者、投資内容、金額、申請期限、控除方法および他の優遇との関係を個別に確認してください。';
const treatyParagraph =
  '台湾・韓国所得税協定は2023年12月27日に発効し、2024年1月1日から適用されています。配当、利子および使用料の上限税率は10％です。事業利得は、相手方の地域に協定上の恒久的施設（PE）がある場合等を除き、原則として居住地側で課税されます。PEには、管理場所・支店・事務所等の固定的施設、6か月を超える工事、いずれかの12か月間に合計183日を超える役務提供、契約締結権限を反復して行使する代理人等が含まれ得ます。台湾支店は通常、台湾の固定的施設に当たるため、支店の台湾事業利得が当然に免税になるわけではありません。';

describe('Japanese investment column 004 — subsidiary versus branch', () => {
  it('publishes the contracted frontmatter and exactly three FAQs', () => {
    expect(parsed.data.title).toBe('台湾進出：子会社と支店の違い');
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch',
    );
    expect(parsed.data.lastmod).toBe('2026-07-24');
    expect(parsed.data.date_display).toBe('2025年9月13日');
    expect(parsed.data.read_time).toBe('約7分');
    expect(parsed.data.faq).toEqual([
      {
        q: '台湾支店に台湾人や台湾法人を株主として参加させることはできますか？',
        a: legalFormAnswer,
      },
      {
        q: '台湾子会社と台湾支店では、税負担にどのような違いがありますか？',
        a: taxAnswer,
      },
      {
        q: '台湾での上場や投資税額控除は、子会社と支店のどちらで利用できますか？',
        a: listingAnswer,
      },
    ]);

    expect(post?.title).toBe('台湾進出：子会社と支店の違い');
    expect(post?.date).toBe('2026-07-24');
    expect(post?.dateDisplay).toBe('2025年9月13日');
    expect(post?.readTime).toBe('約7分');
    expect(post?.faq).toEqual(parsed.data.faq);
  });

  it('locks the exact legal, tax, liability, listing, incentive, and treaty text', () => {
    // The condensed FAQ answer is locked via the frontmatter contract; the body
    // carries the full section 1 prose instead of the FAQ wording verbatim.
    expect(raw).toContain(legalFormAnswer);

    const requiredParagraphs = [
      taxAnswer,
      legalIdentityParagraph,
      treatyEligibilityParagraph,
      lossQualification,
      transferPricingParagraph,
      liabilityParagraph,
      riskQualificationParagraph,
      financingParagraph,
      listingParagraph,
      incentiveParagraph,
      treatyParagraph,
    ];

    for (const paragraph of requiredParagraphs) {
      expect(raw).toContain(paragraph);
      expect(post?.content).toContain(paragraph);
    }

    for (const peCategory of [
      '管理場所・支店・事務所等の固定的施設',
      '6か月を超える工事',
      'いずれかの12か月間に合計183日を超える役務提供',
      '契約締結権限を反復して行使する代理人',
    ]) {
      expect(treatyParagraph).toContain(peCategory);
      expect(post?.content).toContain(peCategory);
    }
  });

  it('bounds section 1 to exactly seven prose paragraphs and five comparison rows', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection1(body);
      const blocks = section
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean);

      expect(blocks[0]).toBe(section1Heading);
      const contentBlocks = blocks.slice(1);
      const proseBlocks = contentBlocks.filter((block) => !block.startsWith('|'));
      const tableBlocks = contentBlocks.filter((block) => block.startsWith('|'));

      expect(proseBlocks).toHaveLength(7);
      expect(proseBlocks).toEqual(section1ProseParagraphs);
      expect(tableBlocks).toHaveLength(1);

      const tableLines = tableBlocks[0]
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      expect(tableLines[0]).toBe(comparisonTableHeader);
      expect(tableLines[1]).toMatch(/^\|[\s|-]+\|$/u);
      const bodyRows = tableLines.slice(2);
      expect(bodyRows).toHaveLength(5);
      expect(bodyRows).toEqual(comparisonTableRows);
    }
  });

  it('locks the exact section 1 prose and comparison table in raw and published content', () => {
    for (const body of [raw, post?.content ?? '']) {
      const section = extractSection1(body);
      for (const paragraph of section1ProseParagraphs) {
        expect(section).toContain(paragraph);
      }
      expect(section).toContain(comparisonTableHeader);
      for (const row of comparisonTableRows) {
        expect(section).toContain(row);
      }
    }
  });

  it('preserves the verified identity, source, both images, JA links, and depth', () => {
    expect(raw).toContain('曾雋崴');
    expect(raw).not.toContain('曾俊瑋');
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-company-subsidiary-vs-branch',
    );
    for (const imagePath of [
      '../images/004-taiwan-company-subsidiary-vs-branch/featured-01.jpg',
      '../images/004-taiwan-company-subsidiary-vs-branch/img-01.jpg',
    ]) {
      expect(raw).toContain(imagePath);
    }

    expect(raw).toContain('[台湾投資・会社設立サービス](/ja/services#investment)');
    expect(raw).toContain(
      '[台湾会社設立の基礎](/ja/columns/taiwan-company-establishment-basics)',
    );
    expect(raw).toContain('[お問い合わせ](/ja/contact)');
    expect(raw.length).toBeGreaterThan(5_000);
    expect(post?.content.length).toBeGreaterThan(3_500);
  });

  it('removes stale and misleading claims, Korean links, promises, and Hangul', () => {
    const forbiddenLiterals = [
      '支店は韓国企業が100％所有',
      '他の台湾人や台湾法人は株主として参加できません',
      '付加価値税',
      '外国人所得税',
      '子会社は一般に、より高い税負担',
      '支店の設立は韓国親会社の税負担を軽減',
      '子会社にのみ',
      '革新的な研究開発支出',
      '股份有限公司形態の子会社のみが上場',
      '2023年12月2日',
      '恒久的施設（固定事業場）でない場合、営業利益は免税',
      '迅速にお答え',
      'コメントやDM',
      '投資者',
      '居住者証明や',
      '取引価格',
      '第三者から支店への出資',
      '/ko/',
    ];

    for (const forbidden of forbiddenLiterals) {
      expect(raw).not.toContain(forbidden);
    }

    expect(raw).not.toMatch(/支店[^。\n]*(?:100％所有|台湾人[^。\n]*株主として参加でき)/);
    expect(raw).not.toMatch(/子会社[^。\n]*(?:必ず|常に)[^。\n]*税負担/);
    expect(raw).not.toMatch(/(?:12か月|183日)[^。\n]*だけ[^。\n]*PE/);
    expect(raw).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.title).not.toMatch(/[\uac00-\ud7af]/);
    expect(post?.content).not.toMatch(/[\uac00-\ud7af]/);
  });

  it('resolves the canonical and related alias slugs in Japanese', () => {
    expect(post?.slug).toBe('taiwan-company-subsidiary-vs-branch');
    expect(getColumnPost('subsidiary-vs-branch', 'ja')?.slug).toBe(
      'taiwan-company-subsidiary-vs-branch',
    );
  });
});
