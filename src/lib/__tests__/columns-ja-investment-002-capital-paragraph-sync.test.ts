import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-ja/002-withdraw-capital-taiwan-company.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const body = matter(raw).content;

const sectionStartMarker = '## 払込金の返還と会社財産の分配';
const sectionEndMarker = '## 会社を恒久的に終了する手続';

const startIndex = body.indexOf(sectionStartMarker);
const endIndex =
  startIndex === -1
    ? -1
    : body.indexOf(sectionEndMarker, startIndex + sectionStartMarker.length);
const section =
  startIndex === -1 || endIndex === -1
    ? ''
    : body.slice(startIndex + sectionStartMarker.length, endIndex);
const paragraphs = section
  .split(/\r?\n\s*\r?\n/)
  .map((block) => block.trim())
  .filter((block) => block.length > 0);

const capitalParagraph =
  paragraphs.find((block) => block.includes('純資産項目')) ?? '';

const overviewParagraph =
  '会社を恒久的に終了するには、原則として解散登記と清算を行い、債務と税務を処理した後に残った残余財産を株主に分配します。会社を存続させながら払込金を返還するには、会社形態に応じた減資などの適法な手続を検討しなければなりません。通常の事業費用、配当、会社が実際に負担している借入金の返済は、それぞれ別個の法的・税務上の根拠と手続を確認する必要があります。';
const classificationParagraph =
  '株主の払込金返還の可否を判断する際は、まず取引の法的性質を確定しなければなりません。会社が商品やサービスのために負担した費用であるか、すでに適法に確定した配当であるか、株主が会社に貸し付けた金額の返済であるか、資本を減少させる減資であるか、清算後の残余財産の分配であるかによって、適用される要件が異なります。取引の名称を変更したり、帳簿に任意の勘定科目を付けたりするだけで、その性質が変わるわけではありません。';
const article9Paragraph =
  '会社法（公司法）第9条は、会社が受け取るべき払込金（股款）について、実際には払い込まれていないのに全額払込済みと表示した場合、または登記後に払込金を株主へ返還し、もしくは株主による回収を許した場合について、5年以下の有期刑、拘留または50万以上250万新台湾ドル以下の罰金を定めています。通常の適法な会社資金の使用一般を処罰する規定ではありません。';
const article9ScopeParagraph =
  'この条項を、会社の口座から行われるすべての支払いに拡大してはなりません。たとえば、実際の営業のための賃借料、給与、仕入代金や税金の支払いは、払込金を実際には払い込まなかった仮装払込や登記後の払込金返還とは区別しなければなりません。ただし、事業費用という名目を付けた場合でも、実際の用途、契約の相手方、対価の存在および意思決定権限が不明確であれば、会社法、税法および会計基準に基づく別個の問題が生じるおそれがあります。';
const article90Paragraph =
  '清算人が会社の債務を弁済する前に会社財産を株主へ分配した場合、会社法第90条により、1年以下の有期刑、拘留または6万新台湾ドル以下の罰金が科され得ます。';
const priorityParagraph =
  '清算では、株主の投資回収よりも債権者と税金の処理が優先されます。株主が会社に対する貸付金債権を主張する場合にも、実際の貸付契約、資金の流れ、利息の約定、会計への反映および返済順位を確認しなければなりません。当事者間に特別な関係がある取引であれば、取引条件と証憑が、独立した第三者との取引と同様に説明可能かどうかも検討する必要があります。';
const factSpecificParagraph =
  'そのほかの民事上・刑事上・税務上の責任は、資金移動の目的、権限、証憑、会計処理および当事者の関係などの具体的な事実によって異なります。特定の取引があったという理由だけで背任罪などが当然に成立すると断定することはできず、逆に内部承認があったという理由だけですべての責任が除外されると考えることもできません。決議書、契約書、税額の計算・申告資料、銀行取引明細および帳簿が互いに一致しているかを、取引ごとに確認しなければなりません。';
const reconciliationParagraph =
  '実務上は、会社名義の資産一覧と株主個人名義の資産をまず分離し、会社と株主との間の債権・債務を別表で整理することが有用です。会社カードで決済した個人費用、代表者が代わりに支払った会社費用、会社が株主から借り入れた金額と株主が会社から引き出した金額を1つの勘定で相殺すると、取引の根拠が曖昧になるおそれがあります。各金額の発生日、目的、承認者、証憑および税務処理を個別に結び付ける必要があります。';
const staleCondensedFactParagraph =
  'このほかに民事上、刑事上または税務上の問題が生じるかどうかは、資金移動の目的、権限、証憑、会計処理、会社と株主との関係等の具体的な事実により異なります。';

describe('Japanese investment column 002 — capital return section completeness', () => {
  it('isolates exactly nine single-line prose paragraphs between the two section headings', () => {
    expect(startIndex).toBeGreaterThanOrEqual(0);
    expect(endIndex).toBeGreaterThan(startIndex);
    expect(paragraphs).toHaveLength(9);

    for (const paragraph of paragraphs) {
      expect(paragraph).not.toContain('\n');
      expect(paragraph).not.toContain('\r');
      expect(paragraph).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/u);
      expect(paragraph).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)|<[^>\r\n]+>/u);
      expect(paragraph).not.toMatch(/[*_~`]{1,3}|\[\^[^\]\r\n]+\]/u);
    }
  });

  it('defines capital as the accounting equity item contributed at incorporation or a capital increase', () => {
    expect(capitalParagraph).not.toHaveLength(0);
    expect(capitalParagraph).toMatch(
      /資本金[^。]*(?:会計上|会計の)[^。]*(?:資本|純資産)[^。]*項目/u,
    );
    expect(capitalParagraph).toMatch(
      /(?:会社の)?設立時[^。]*(?:または|又は|もしくは|若しくは|や)[^。]*増資時[^。]*株主[^。]*(?:払い込んだ|払込んだ|拠出した|出資した)[^。]*(?:金額|額)/u,
    );
  });

  it('distinguishes capital from the current bank balance and all operating assets or liabilities', () => {
    expect(capitalParagraph).toMatch(
      /(?:会社の)?(?:銀行)?口座[^。]*(?:現在|現時点)[^。]*(?:残高|預金残高)[^。]*(?:必ずしも|常に)[^。]*(?:一致しない|一致せず|一致するものではない|同一ではない|同じではない)/u,
    );
    expect(capitalParagraph).toMatch(
      /(?:(?:事業|営業)[^。]*(?:取得した|取得する)[^。]*(?:資産|財産)[^。]*(?:負担した|負担する|生じた)[^。]*(?:負債|債務)[^。]*(?:すべて|全て|全部)[^。]*(?:資本金|一語)[^。]*(?:表すものではない|意味するものではない|含まれない|包含しない|説明できない)|事業活動中[^。]*取得した[^。]*すべての資産[^。]*負担した[^。]*すべての債務[^。]*含むものでも[^。]*それらを表すものでもありません|会社[^。]*事業活動を通じて[^。]*取得した資産[^。]*負担した債務[^。]*(?:すべて|全て|全部)[^。]*表すものでもありません)/u,
    );
  });

  it('requires every closure-check category and a combined assessment beyond book capital', () => {
    expect(capitalParagraph).toMatch(
      /会社[^。]*(?:終了|閉鎖|廃止|清算)[^。]*(?:帳簿上|会計帳簿上)[^。]*資本金[^。]*(?:だけでなく|のみではなく|だけを見るのではなく|のみを見るのではなく)/u,
    );

    for (const category of [
      /実際の(?:資産|財産)/u,
      /実際の(?:負債|債務)|(?:資産|財産)[・と、及びおよび]+(?:負債|債務)/u,
      /未収金/u,
      /未払金/u,
      /税金|租税/u,
      /偶発債務/u,
      /清算費用/u,
    ]) {
      expect(capitalParagraph).toMatch(category);
    }
    expect(capitalParagraph).toMatch(
      /(?:併せて|合わせて|総合的に|一体として)(?:確認|検討|評価|把握)/u,
    );
  });

  it('rejects misleading equations, distributable-capital claims, additions, and malformed copy', () => {
    expect(capitalParagraph).not.toMatch(
      /資本金[^。]*(?:銀行)?口座[^。]*(?:残高|預金)[^。]*(?:である|です|に等しい|と同じ)(?:。|、|$)/u,
    );
    expect(capitalParagraph).not.toMatch(
      /資本金[^。]*(?:(?:すべて|全て|全部)[^。]*(?:資産|財産)|(?:資産|財産)[^。]*(?:すべて|全て|全部))[^。]*(?:である|です|に等しい|含む|表す|意味する)(?:。|、|$)/u,
    );
    expect(capitalParagraph).not.toMatch(
      /資本金[^。]*(?:株主[^。]*)?(?:(?:分配可能|分配できる|払い戻せる|返還できる)|(?:分配|払い戻し|返還)[^。]{0,20}(?:可能である|可能です|できます))(?:。|、|$)/u,
    );

    for (const forbidden of [
      'こんにちは',
      '台湾弁護士',
      '曾雋崴',
      'Wei Tseng',
      '動画',
      '私',
      '私たち',
      '当事務所',
      '弊所',
      'お気軽に',
      'お問い合わせ',
      'ご相談',
    ]) {
      expect(capitalParagraph).not.toContain(forbidden);
    }
  });

  it('distinguishes liquidation, capital reduction, ordinary expenses, dividends, genuine loan repayment, and residual-property distribution', () => {
    for (const paragraph of [
      overviewParagraph,
      classificationParagraph,
      article9ScopeParagraph,
    ]) {
      expect(paragraphs).toContain(paragraph);
    }
  });

  it('keeps the Article 9 and Article 90 penalty ceilings with their narrow scope', () => {
    expect(paragraphs).toContain(article9Paragraph);
    expect(paragraphs).toContain(article90Paragraph);
    expect(section).toContain(
      '5年以下の有期刑、拘留または50万以上250万新台湾ドル以下の罰金',
    );
    expect(section).toContain('1年以下の有期刑、拘留または6万新台湾ドル以下の罰金');
  });

  it('prioritizes creditors and tax over shareholder recovery and requires proof for shareholder loans', () => {
    expect(paragraphs).toContain(priorityParagraph);
    expect(section).toContain(
      '株主の投資回収よりも債権者と税金の処理が優先されます。',
    );
    expect(section).toContain(
      '実際の貸付契約、資金の流れ、利息の約定、会計への反映および返済順位を確認しなければなりません。',
    );
  });

  it('states fact-specific civil, criminal, and tax responsibility with document consistency', () => {
    expect(paragraphs).toContain(factSpecificParagraph);
    expect(section).toContain(
      '資金移動の目的、権限、証憑、会計処理および当事者の関係などの具体的な事実によって異なります。',
    );
    expect(section).toContain(
      '決議書、契約書、税額の計算・申告資料、銀行取引明細および帳簿が互いに一致しているかを、取引ごとに確認しなければなりません。',
    );
  });

  it('keeps the practical company/shareholder asset and debt reconciliation guidance', () => {
    expect(paragraphs).toContain(reconciliationParagraph);
    expect(section).toContain('会社名義の資産一覧と株主個人名義の資産をまず分離し');
    expect(section).toContain('会社と株主との間の債権・債務を別表で整理する');
  });

  it('contains no Hangul, malformed whitespace, markdown injection, or the stale condensed paragraph', () => {
    expect(section).not.toMatch(/[\uac00-\ud7af]/u);
    expect(section).not.toMatch(/[\u200b\ufeff\u00a0]/u);
    expect(section).not.toContain('\r');
    expect(section).not.toMatch(/[ \t]+$/mu);
    expect(section).not.toMatch(
      /(?:^|\n)[\t \u200b\ufeff\u00a0]+(?:\n|$)/u,
    );
    expect(section).not.toMatch(/^(?:#{1,6}\s|>\s|[-*+]\s|\d+\.\s)/mu);
    expect(section).not.toMatch(/!?\[[^\r\n]*\]\([^)\r\n]*\)/u);
    expect(section).not.toContain(staleCondensedFactParagraph);
  });
});
