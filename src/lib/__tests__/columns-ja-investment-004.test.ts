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
  '台湾子会社は、台湾法に基づいて設立される独立した台湾会社です。外国の親会社とは別の法人として、自ら契約を締結し、権利を取得し、義務を負います。会社形態と適用法令に従って株主構成や機関設計を定めるため、外国の親会社以外の出資者を株主に加える計画にも対応できます。';
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
    const requiredParagraphs = [
      legalFormAnswer,
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
