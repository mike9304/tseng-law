# G4 cross-check (Grok 4.7) — recovering-unpaid-invoices-from-taiwan-customers

Checked 2026-10-06. Column files were not edited. topics/G4.md has no "## MUST VERIFY" section, so there is no MUST VERIFY item to mark CONFIRMED, WRONG, or UNVERIFIABLE.

Official pages opened for this check:

- 民法 arts. 127, 128, 129, 130: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127 (and flno=128, 129, 130)
- 民法 header (amendment scope): https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000001 — latest amendment 民國115年8月17日 amends art. 1223 only, effective six months after promulgation. It does not change arts. 127–130. The "民國115年9月24日" line on the single-article pages is the database compilation date.
- 涉外民事法律適用法 art. 20: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=20
- 民事訴訟法 arts. 96, 427, 436-8, 508, 509, 510, 511, 512, 515, 516, 518, 519, 521, 522, 523, 526, 529: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=96 (same pcode, those flno values)
- 強制執行法 arts. 4, 5, 19, 45, 75, 115: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010004&flno=4 (same pcode, those flno values)
- 存證信函 is a Chunghwa Post service, not a judgment: https://www.post.gov.tw/post/internet/Customer_service/index.jsp?ID=1610075122269&defaultAllOpen=1&sn=6ED9E7D0-BBA6-43D5-B1D1-218C485FD261

No judgment is cited. No private-party name, invented case, statistic, or definitive Korean, Japanese, or U.S. legal rule appears. The openings are generic commercial scenes, not client stories.

Checked and left as legally supported, so they are not numbered below: a Taiwan buyer does not by itself select Taiwan law (art. 20); where Taiwan law applies, the price of goods supplied by a merchant, manufacturer, or artisan is a two-year claim and not the period for every commercial claim (art. 127, item 8); time runs from when the claim can be exercised (art. 128); a demand is not an enforcement title (強制執行法 art. 4); art. 526 has no one-third deposit; the debtor may object within 20 days after service without giving reasons (art. 516); a timely lawful objection makes the order ineffective in the objected part and the application is treated as a suit or a mediation application (art. 519); execution still needs an application and can reach the debtor's deposits, receivables, movables, and real property (強制執行法 arts. 4, 5, 45, 75, 115). facts.md matches those points. The errors are dropped or softened conditions, one unsupported qualifier, one overstatement, missing citations in three languages, and cross-language gaps.

Length from lint is inside the short-format band (ko 1163, ja 969, zh-hant 978 characters; en 638 words). That is not the failure.

## FACTS

1. ja, en, zh-hant → ja: "台湾法が適用される商人の商品代金請求には、原則2年の短期消滅時効がある。企業間債権がすべて同じ期間なのではない（民法127条8号）。" en: "Where Taiwan law applies, merchants' claims for supplied goods generally face a two-year limitation period." zh-hant: "若適用台灣法，商人供給商品的價款請求權，原則上有2年短期時效；不是所有企業債權都只有2年（民法第127條第8款）。" → The propositions match the official text, but none of these three files links a law.moj.gov.tw single-article URL, and none has a sources section or a source-check date. Lint: "no law.moj.gov.tw citation" and "no ## headings" on ja, en, and zh-hant. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127 → required fix: add the same single-article links the Korean file uses, after each legal claim, and end with a sources heading that lists every article used, dated 2026-10-06 in that language. Do not leave the claims unlinked.

2. ko → "다툼이 크지 않은 금전채권은 지급명령을 검토합니다." → Article 508 allows a payment order for a claim to pay a fixed quantity of money, other fungible things, or securities. It does not require that the dispute be small. The amount bands are arts. 436-8 and 427, not a condition of the payment order. ja, en, and zh-hant do not add this qualifier, so the Korean sentence also conflicts with the other three. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=508 → required fix: remove "다툼이 크지 않은". Keep the payment order as an option for a specified monetary claim.

3. ko, ja, en, zh-hant → ko: "해외 송달이 필요한 경우에는 이 절차를 쓸 수 없습니다. 민사소송법 제508조부터 제512조까지가 그 조건을 정합니다." ja: "国外送達が必要な場合は利用できない（508〜512条）。" en: "this procedure is unavailable where the order would require service abroad or service by public notice. An overseas creditor is not, by itself, excluded (arts. 508–512)." zh-hant: "命令若須向國外送達或公示送達，就不能使用這項程序（第508至512條）。海外債權人本身，不因此被排除。" → Article 509 bars the procedure in three cases: the applicant's reciprocal performance is still outstanding, the payment order must be served abroad, or service is by public notice. Korean and Japanese drop public notice. All four drop the unperformed reciprocal duty. The operative bars are in art. 509, and the duty to 釋明 the claim is in art. 511 ("債權人之請求，應釋明之。"). Article 512 only says the court rules without hearing the debtor. The Korean sources list links 508 and 512 and skips 509 and 511. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=511 → required fix: state all three art. 509 bars in every language, say an overseas creditor is not itself the bar, and cite 509 and 511 rather than the 508–512 range. Add those two URLs to the Korean sources list.

4. ko, ja, en, zh-hant → ko body and FAQ: "6개월 안에 소를 제기하거나 법이 인정하는 조치를 하지 않으면 그 중단은 없었던 것으로 봅니다." ja FAQ: "催告後6か月以内に訴えの提起など法律上認められる手続を取らなければ、その催告による中断はなかったものと扱われます。" en: "a demand's interruption of limitation is treated as ineffective unless followed within six months by a lawsuit or another qualifying legal step (Civil Code, arts. 129–130)." zh-hant: "若未在6個月內起訴或採取法律認可的後續程序，就視為不中斷（民法第129、130條）。" → Article 130's own text is only: if no suit is filed within six months after the demand, the interruption is deemed not to have happened. It does not say "any later step the law recognizes." Article 129, paragraph 2, lists what has the same effect as filing suit: a payment-order application, mediation or arbitration, a composition or bankruptcy claim, notice of suit, and starting or applying for compulsory execution. A further reminder letter is not on that list. The "not an unlimited extension" sentence is right and should stay. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=129 → required fix: keep the six-month rule and "deemed not interrupted." Replace the vague "qualifying step" with the art. 129 paragraph 2 list, or say "a lawsuit or an act article 129 treats as the same as a lawsuit." Do not attribute that list to article 130's words.

5. ko, ja, zh-hant; en is incomplete → ko: "본안이 없으면 채무자의 신청으로 법원이 제소기한을 정할 수 있습니다." ja: "本案が未提起なら、債務者の申立てにより裁判所が提訴期限を定めることがある（529条）。" zh-hant: "本案尚未起訴時，債務人可聲請法院命債權人限期起訴（第529條）。" en: "If the main case has not begun, the debtor can ask the court to set a deadline for starting it. Missing that deadline can lead to discharge on the debtor's application (art. 529)." → Article 529 says that if the main case is not yet pending (尚未繫屬), the attachment court shall (應), on the debtor's application, order the creditor to sue within a period. Korean "할 수 있습니다" and Japanese "定めることがある" turn a duty into a discretion. Traditional Chinese says 尚未起訴, not 尚未繫屬, and omits the consequence. If the creditor does not sue in time, the debtor may apply to revoke the attachment. Paragraph 2 treats a payment-order application, a mediation application, arbitration, and the other listed steps as the same as suing. Only the English sentence includes revocation. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=529 → required fix: in every language, say the court must set the period when the debtor applies, name the paragraph 2 equivalents in a short clause, and say the debtor may then apply to revoke the attachment. Do not write this as a power the court may choose to use.

6. ko, ja → ko: "이의가 없으면 집행권원을 얻습니다. 제521조가 그 점을 정합니다." ja: "異議がなければ執行名義となる（519・521条）。" → Article 521 says that if no lawful objection is filed in time, the payment order may be an enforcement title. The same article lets the debtor sue for a declaration that the debt does not exist and ask for a stay of execution upon sufficient security. It is not a final merits judgment. English and Traditional Chinese already say that. Korean and Japanese stop at the enforcement title, so the four versions do not carry the same limit. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521 → required fix: add the art. 521 limit to Korean and Japanese. Keep the English and Traditional Chinese sentences.

7. ko, ja, zh-hant → en only: "An order also lapses if it cannot be served within three months after issue (art. 515)." → The official text is: if the payment order cannot be served on the debtor within three months after it is issued, it loses effect. The other three languages never state this deadline. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=515 → required fix: add this three-month lapse, counted from issuance, to Korean, Japanese, and Traditional Chinese, with the single-article link. Keep the English sentence.

8. ko, ja, en, zh-hant → ko: "금전 청구는 원칙적으로 10만 대만달러 이하가 소액절차입니다. 50만 대만달러 이하는 간이절차의 대상입니다. 그 이상은 통상 일반소송으로 갑니다. 예외도 있습니다. 50만 이하 사건은 서면 합의로 소액절차를 택하기도 합니다." ja: "金銭請求は原則10万台湾元以下が少額訴訟、50万台湾元以下が簡易手続の対象だ。それを超えると通常は通常手続となるが、例外や書面合意による取扱いもある。" en: "a monetary claim of up to NT$100,000 ordinarily uses small-claims procedure. Claims up to NT$500,000 generally use summary procedure; larger claims generally proceed ordinarily, subject to statutory exceptions. Written agreement can bring a claim of up to NT$500,000 into small claims." zh-hant: "金錢請求原則上10萬元以下走小額程序，50萬元以下適用簡易程序；再往上通常是通常訴訟，但有法定例外。50萬元以下也可書面合意適用小額程序。" → Article 436-8: a claim for money, fungibles, or securities of NT$100,000 or less uses small-claims procedure; the court may move an unsuitable case to summary procedure; a claim of that same kind up to NT$500,000 may use small claims by a written agreement. Article 427: a property claim of NT$500,000 or less uses summary procedure, but paragraph 2 lists claims that use summary procedure regardless of amount, and a complex case or a claim of at least ten times the threshold may be moved to ordinary procedure on application. The Judicial Yuan may, by order, set the summary threshold between NT$250,000 and NT$750,000. The MOJ text opened on 2026-10-06 still states NT$500,000. No order changing it appears on that page. "NT$500,000 or less uses summary procedure" swallows the band that actually uses small claims. "사건" / "Claims" is wider than the money, fungible, or securities claims in art. 436-8, paragraph 1. None of the amount sentences carries an as-of date. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=436-8 and https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=427 → required fix: as of 6 October 2026, money (or fungible or securities) claims of NT$100,000 or less ordinarily use small claims, and the court may move an unsuitable one to summary procedure; property claims above NT$100,000 and up to NT$500,000 generally use summary procedure; above that, ordinary procedure, except the art. 427 categories and the transfer rules. Written agreement into small claims is only for an art. 436-8 paragraph 1 claim up to NT$500,000. Keep the exception. Date the figures. Mention that the Judicial Yuan may adjust the NT$500,000 summary threshold by order, within NT$250,000 to NT$750,000. The NT$100,000 line has no such clause in art. 436-8.

9. en, zh-hant → en: "An overseas plaintiff may also face a separate security requirement for litigation costs if the defendant requests it. This is different from attachment security. The rule contains exceptions, including sufficient assets in Taiwan to secure those costs (art. 96)." zh-hant: "海外公司起訴，另可能因被告聲請而須提供訴訟費用擔保，不能與假扣押擔保混為一談（第96條）。" → Article 96 applies when the plaintiff has no domicile, no office, and no business place in the ROC. The court shall order security if the defendant asks. It does not apply to every overseas plaintiff or overseas company: a foreign company with an office or business place in Taiwan is outside the rule. It also does not apply when the defendant does not dispute part of the claim, or when the plaintiff has assets in Taiwan sufficient to cover the litigation costs. Korean and Japanese omit the point entirely. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=96 → required fix: replace "overseas plaintiff" / "海外公司" with the statutory trigger (no domicile, office, and business place in Taiwan), keep the defendant's application, the "shall," both exceptions, and the distinction from art. 526 security. Add the same sentence to Korean and Japanese.

10. en; also the FAQ in all four → en body: "Offering money does not replace the need to substantiate the application." en FAQ: "the creditor still needs a prima facie case for both the claim and the risk to enforcement." ko FAQ: "채권과 집행 곤란 위험을 소명해야 하며, 법원이 사건에 따라 담보를 정합니다. 담보만 낸다고 가압류가 당연히 허용되는 것은 아닙니다." → Article 526, paragraph 1, does require a prima facie showing of the claim and of the attachment ground. Paragraph 2: if that showing is short, and the creditor offers security or the court finds it appropriate, the court may set security and order attachment after the security is given. Paragraph 3: the court may require security even when the showing is sufficient. There is no one-third rule. The "not automatic" sentences in Korean, Japanese, and Traditional Chinese are right. The English lines go past the statute: security can supplement a short showing, at the court's discretion. The other three FAQs drop that path. → https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=526 → required fix: delete the English "does not replace" sentence and the FAQ claim that a prima facie case is still always required. In every language, keep "no one-third" and "offering security does not guarantee an order," and add that a short showing may be supplemented by security if the court so orders, and that the court may require security even after a sufficient showing.

## VOICE

Variety commands run on 2026-10-06: `variety_metrics.py check` on ko (exit 0, WARN only), ja (exit 1), en (exit 0), zh-hant (exit 1).

### ko

The Korean body is the one that already reads, for most of its length, like a column written for a Korean reader: the title names the unpaid Taiwan invoice, the opening is the two-year figure, the register stays 합니다체, and the last body sentence returns to judgment versus payment. Two voice spots still need a rewrite. Not a monotony FAIL: the checker printed no FAIL line, and self-check items 2–7 are met. The WARN is that 95% of sentences end in 니다.

Original: "대만 거래처의 미수금을 회수할 때 내용증명, 지급명령, 가압류, 소송과 강제집행을 어떻게 구분해야 하는지 설명합니다." → The summary previews the article ("설명합니다") instead of giving a fact. → "대만법이 적용되는 상품대금에는 2년의 단기시효가 있습니다. 내용증명은 그 시효를 끝없이 늘리지 않고, 지급명령·가압류·강제집행은 요건이 다릅니다."

Original: "뜻밖입니다. 채무자는 송달 후 20일 안에 이유를 적지 않고 이의할 수 있습니다. 민사소송법 제516조가 그렇게 정합니다. 적법한 이의가 있으면 해당 부분은 소송이나 조정으로 이어집니다. 민사소송법 제519조가 정한 효과입니다. 이의가 없으면 집행권원을 얻습니다. 제521조가 그 점을 정합니다." → Four of these sentences exist to hang an article on "정합니다." The 20-day rule is real; the cadence is not. → "송달 후 20일이 남습니다. 민사소송법 제516조는 그 안에 이유를 적지 않은 이의를 허용합니다. 적법한 이의가 있으면 그 범위에서 지급명령의 효력이 사라지고, 제519조에 따라 신청은 소송이나 조정으로 봅니다. 이의가 없으면 제521조의 집행권원이 되지만, 채무자는 나중에 채무가 없다고 다툴 수 있습니다." Keep every number and the fact-check fixes in items 6 and 3.

The contact sentence already names 호정(昊鼎)국제법률사무소 and wei@hoveringlaw.com.tw and asks for a non-confidential outline. Leave that function in place. No bold, no emoji, no sales line.

### ja

Does not read as native です・ます prose. The title is fine. The body is plain だ・である through the legal paragraphs, and only the last sentence switches to ます. Lint also records a missing email, no statute link, and no ## heading.

MONOTONY: len_cv 0.302 — "まず相手方の正式名称、納品・検収資料、支払期日、準拠法をそろえる。" — mix in at least two very short sentences and one longer sentence so the variation reaches 0.45; do not drop an article number, the six months, or the NT$ figures.

MONOTONY: ja register — "催促を重ねる前に、契約と財産の両方を見直す段階だ。" — rewrite the body in です・ます. The title can stay a noun phrase. FAQ is already です・ます; the body should match it.

MONOTONY: formula closing — "当事務所では、資料の確認から保全・回収手続までお手伝いします。" — end on this column's fact (an enforcement title still needs an application, and no assets means no payment). One sentence may name 昊鼎国際法律事務所 and wei@hoveringlaw.com.tw and ask for a non-confidential outline. Delete the help-line.

Original: "意外なのは、債務者が送達後20日以内なら理由を書かずに異議を出せることだ（516条）。" → "意外" is a label, not a fact. The 20-day rule can stand on its own. → "送達から20日です。債務者は理由を書かずに異議を出せます（民事訴訟法第516条）。"

Original: "当事務所では、資料の確認から保全・回収手続までお手伝いします。" → Sales close, no firm name, no email, and it is the only ます sentence. → "差し押さえる財産がなければ、名義があっても入金にはなりません。手続きの資料は、秘密でない概要だけを昊鼎国際法律事務所（wei@hoveringlaw.com.tw）へ先に送ってください。"

### en

The opening and most of the body are plain and specific. The checker passed (exit 0). The sales close is one unmet self-check item, not two, so this is not a monotony FAIL. It is still a voice fix. Lint: seoTitle is 48 characters (needs 30–45 and must differ from the title), no email, no statute link, no ## heading. Summary length is 155 characters, inside 150–160.

Original: "An unpaid Taiwan invoice calls for more than reminders: understand demand letters, payment orders, asset preservation, limitation periods, and enforcement." → "understand A, B, and C" is a contents line. → "A demand letter does not freeze a Taiwan account, and where Taiwan law applies the price of supplied goods generally has two years to run."

Original: "Here is the surprise: after service, the debtor has 20 days to object without giving any reason." → The label is empty. The rule is the sentence. → "After service, the debtor has 20 days to object without giving any reason."

Original: "Finally comes collection." → "Finally" is a sequence marker the column does not need. → "Collection is a separate application."

Original: "larger claims generally proceed ordinarily, subject to statutory exceptions." → "proceed ordinarily" does not say ordinary procedure. → "larger claims generally use ordinary procedure, subject to the statutory exceptions."

Original: "Our firm can help assess the evidence, preservation options, and Taiwan recovery proceedings." → Sales close, and the firm name and email are missing. → "A title still does not pay the invoice if there is nothing to enforce. A non-confidential outline can go first to Hovering International Law Firm at wei@hoveringlaw.com.tw."

seoTitle: replace "Recovering Unpaid Invoices from Taiwan Customers" (48 characters) with a different 30–45 character search title.

### zh-hant

A Taiwan reader can follow the sequence, and the title is not 「一次看懂」. The sentences are too even, the close is a firm advertisement, and lint flags 項目. No simplified characters. 帳戶 is the Taiwan form. Lint also records a missing email, no statute link, and no ## heading.

MONOTONY: len_cv 0.373 — "先把契約上的公司名稱、訂單、交貨及驗收紀錄、付款期限對齊，也看準據法及爭議處理約定。" — break this run with a short sentence and a longer one so variation reaches at least 0.45. Keep the two-year period, the six months, and the dollar figures.

MONOTONY: short_share 0.038 — "出貨系統顯示已簽收，銀行帳戶卻遲遲沒有動靜。" — the draft has fewer than two very short sentences. Add at least one more of about twelve characters or fewer, such as a beat after the limitation rule, without cutting a condition.

MONOTONY: formula closing — "本所可協助檢視交易資料，規劃保全與債款回收程序。" — end on whether there is property to enforce. One sentence may name 昊鼎國際法律事務所 and wei@hoveringlaw.com.tw and ask for a non-confidential outline.

Original: "存證信函可把欠款項目、金額與要求付款期限說清楚" → Lane lint treats 項目 as mainland vocabulary in this slot. → "存證信函可把欠的是哪幾筆貨款、金額和要求的付款期限寫清楚"

Original: "比較出人意料的是，債務人在送達後20日內，可以不附理由提出異議（第516條）。" → The surprise frame adds nothing. → "送達後20日內，債務人可以不附理由提出異議（第516條）。"

Original: "本所可協助檢視交易資料，規劃保全與債款回收程序。" → Sales close, no firm name, no email. → "執行名義拿到了，沒有財產就收不回貨款。非機密的案情摘要可先寄昊鼎國際法律事務所（wei@hoveringlaw.com.tw）。"

FACTS: FIX
VOICE ko: FIX
VOICE ja: FIX
VOICE en: FIX
VOICE zh-hant: FIX
