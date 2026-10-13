# G4 fix round 1 — editor notes (Claude Opus)

Slug: recovering-unpaid-invoices-from-taiwan-customers · files edited: drafts/G4/{ko,ja,en,zh-hant}.md, drafts/G4/facts.md, research/G4-statutes.md (Parts 2b, 3b and 4 appended), this file. Nothing else was touched; no git, nothing sent. Sources opened 2026-10-06 KST.

## MUST VERIFY (topics/G4.md)

topics/G4.md has no `## MUST VERIFY` section, so there is no item to report as CONFIRMED / WRONG / UNVERIFIABLE.

## How the sources were checked

Every article cited in the four files was fetched from law.moj.gov.tw on 2026-10-06 (texts in research/G4-statutes.md, Parts 2 and 2b). The single-article pages for the flagged items were also opened: 民法 129, 130; 民事訴訟法 96, 427, 436-8, 509, 515, 516, 521, 526, 529; 涉外民事法律適用法 20, 36; 強制執行法 19, 115. The 民法 "not yet in force" banner concerns art. 1223 only (沿革 page, entry of 2026-08-17). The Chunghwa Post 存證信函 page was opened and its passage saved (Part 3b). All 25 external URLs in the four files return 200 and show the expected article or passage.

## One decision that affects several items: the short format

The drafts fit the limit by dropping conditions. Restoring the conditions the reviewer asked for (arts. 509, 129(2), 529, 521, 515, 96, 526) filled the limit: ko 1,397 and ja 1,398 of 1,400 characters, en 797 of 800 words, zh-hant 1,394 of 1,400. Something had to go, and I cut the small-claims / summary-procedure paragraph (item 8 below) from all four versions. Smaller cuts differ by language and are listed under "Verified but cut for length". No version contradicts another.

## Facts — Grok items

1. ja, en, zh-hant had no links, no sources section, no check date → All three now carry inline law.moj.gov.tw single-article links after each legal claim, a final sources heading listing every article used, the check date 2026-10-06 in the page's format, and one general-information line. ko's sources list was corrected to match its body.
2. ko 「다툼이 크지 않은 금전채권」 → Removed. ko now says 「지급명령(支付命令)은 일정 금액의 금전 청구에 쓰고, 청구는 소명해야 합니다」 (arts. 508, 511). The other three never had the qualifier.
3. Art. 509 bars and the 508–512 range → All four state the three bars (the applicant's counter-performance not yet performed, service abroad, service by public notice) and say that being an overseas creditor is not one of them. The citation is now 508 and 511 for the claim and its 釋明, and 509 for the bars. Arts. 510 and 512 are no longer cited.
4. "Other qualifying legal step" under arts. 129–130 → All four now give art. 130 as written (no lawsuit within six months of the demand means deemed not interrupted) and attribute the equivalents to art. 129(2): payment-order application, mediation application, submission to arbitration, application for compulsory execution, "등 / など / among them / 等". Each adds that another reminder letter is not on that list. The FAQ answers were rewritten the same way.
5. Art. 529 → All four say the court must set the period when the debtor applies (명해야 합니다 / 命じなければなりません / must / 應), name the equivalents (payment-order application, mediation application, starting arbitration), and say the debtor may then apply to revoke the attachment. zh-hant now uses 繫屬.
6. Art. 521 limit missing in ko and ja → Added to both. All four now give the article's own two points: the order may serve as an enforcement title, and the debtor may sue for a declaration that the debt does not exist and ask for a stay against security. Not kept as the reviewer suggested: the en and zh-hant sentences "not a merits judgment that permanently settles whether the debt exists" / 「不等於債權存在已經獲得實體確定判決」. The current article text does not say that in terms; it comes from the 2015 amendment history, which I did not open. The replacement says the same thing for the reader's purposes and rests only on the text.
7. Art. 515 → The three-month lapse, counted from issue, is now in all four with its link.
8. Thresholds (arts. 427, 436-8) → Removed from all four. The reviewer's corrected statement is right (I re-opened both articles), but it needs two articles, the written-agreement route, the court's transfer power, the art. 427(2) categories, the as-of date and the Judicial Yuan's power to set the figure at NT$250,000 or NT$750,000. That is about 200 Korean characters or 95 English words, and none of ko, ja, en or zh-hant could hold it together with items 3–7, 9 and 10. The procedure track is also the part a supplier decides least. No version now states a threshold, so no wrong short form remains. The texts stay in research/G4-statutes.md.
9. Art. 96 → All four now use the statutory trigger (no domicile, office and business place in Taiwan), the defendant's application, the "shall", both exceptions (the undisputed part of the claim; assets in Taiwan sufficient for the costs) and the distinction from attachment security. ko and ja, which had nothing on this, now have the full sentence.
10. Art. 526 → The en sentence "Offering money does not replace the need to substantiate the application" and the en FAQ line "still needs a prima facie case" are deleted. All four bodies and FAQ answers now say: the claim and the ground must be shown prima facie; if the showing is short, the court may set security and order attachment where the creditor offers security or the court finds it appropriate; the court may require security even after a sufficient showing; the article has no one-third figure; offering security does not guarantee an order.

## Voice — Grok items

ko
- Summary previewed the article → Replaced with three facts (two years for goods supplied by a merchant or manufacturer, six months after the demand, three months and 20 days for a payment order). I narrowed the reviewer's wording to "상인·제조인이 공급한 상품의 대금 청구권" so the summary is not wider than art. 127(8).
- 「뜻밖입니다 … 정합니다」 cadence → Rewritten. 「송달되면 20일입니다.」 stands alone; arts. 516, 519 and 521 sit inside two sentences instead of five; the art. 521 limit and the art. 515 lapse are in the same paragraph.
- Contact sentence → Function kept (firm name, email, non-confidential outline first); it now names what to send (contract, date of the last demand) and the paragraph ends on the column's fact.

ja
- Register → です・ます throughout, no 体言止め in the body; headings are noun phrases. Short sentences such as 「2年です。」 and 「送達後は20日です。」 break the longer ones.
- MONOTONY len_cv 0.302 → now 0.481, short share 0.188.
- Formula closing 「当事務所では…お手伝いします」 → Deleted. The last paragraph names 昊鼎国際法律事務所 and the email, asks for a non-confidential outline, and ends on 「差し押さえる財産がなければ入金はありません」.
- 「意外なのは…」 → Deleted; the 20-day rule is stated directly.
- Lint items (email, statute link, heading) → fixed.

en
- Summary "understand A, B and C" → Replaced. Not the reviewer's sentence: "a demand letter does not freeze a Taiwan account" answers a claim no reader made; the new summary gives the two-year and six-month rules (160 characters).
- "Here is the surprise", "Finally comes collection" → Deleted.
- "proceed ordinarily" → Gone with the thresholds paragraph.
- Sales close → Replaced by the contact sentence with firm name and email, followed by "An enforcement title with no assets behind it still leaves the invoice unpaid."
- seoTitle → "Recovering an Unpaid Invoice in Taiwan" (38 characters, differs from the title).

zh-hant
- MONOTONY len_cv 0.373, short_share 0.038 → now 0.562 and 0.15 (「不一定。」「送達後有20日。」「沒有異議呢？」 and others).
- Formula closing 「本所可協助…」 → Replaced with the contact sentence and 「沒有可執行的財產，執行名義在手，貨款還是進不來。」
- 「項目」 → Gone; the sentence was replaced by Chunghwa Post's own description of 存證信函.
- 「比較出人意料的是」 → Deleted.

## Best-of judge notes (ko)

- "[제n조]가 그 …을 정합니다" used about ten times → None left. Citations now sit as subject, as a lead-in ("제515조에 따라"), bundled, or in a closing parenthesis; no paragraph has more than two sentence-end citations in a row.
- "민법 제127조 제8호가 … 구분합니다" put the editor's distinction in the statute's mouth → Now 「2년은 제127조가 열거한 청구권에만 적용됩니다」.
- Contact paragraph wedged before the last fact sentence → One closing paragraph: contact sentence, then the fact.
- "2년입니다." without context → Kept as the number opening; the next sentence gives the condition and the claim it applies to. The 「다음 주 입금」 of the title returns once, in the acknowledgment sentence.

## Added by the editor (all sourced)

- 涉外民事法律適用法 第36條 (limitation follows the governing law) in ko, en, zh-hant: it is the legal reason the governing-law clause decides whether the two years apply.
- Chunghwa Post's description of 存證信函 (linked in all four; quoted in substance in en and zh-hant). The drafts called the letter a "formal demand" with no source.
- 民法 第129條 第1項 第2款 承認 in ko, en, zh-hant: a reply that admits the debt can be a separate ground of interruption, so it should be kept. Hedged ("될 수 있어", "worth keeping", 「列為中斷事由」); no case law cited.
- Internal links, one each where the slug exists: ja → taiwan-unpaid-invoice-debt-collection, en → enforce-foreign-judgment-in-taiwan, zh-hant → taiwan-payment-order-provisional-attachment. ko has none; there was no room for a sentence.

## Removed as unverifiable or unsupported

- ko "claims with little dispute" as a payment-order condition.
- "Another qualifying legal step" / 「법이 인정하는 조치」 / 「法律認可的後續程序」 as the wording of art. 130.
- Art. 529 as a discretionary power.
- en "offering money does not replace the need to substantiate" and "still needs a prima facie case".
- "Overseas plaintiff" / 「海外公司」 as the art. 96 trigger.
- "Not a final merits judgment" as a statement of art. 521 (see item 6).
- The 508–512 range citation; arts. 510 and 512.
- Drafter ledger notes that arts. 517 and 520 are repealed: not checked, never in the public text.

## Verified but cut for length (not errors)

- Thresholds under arts. 427 and 436-8, all four versions (item 8).
- 強制執行法 第19條 (asset inquiry): kept in en and zh-hant, cut from ko and ja.
- 強制執行法 第45, 75, 115條 and 涉外民事法律適用法 第36條: cut from ja, which links the existing ja column for the full procedure.
- Acknowledgment (承認): not in ja for the same reason.
- Practical tips with no legal claim: matching the contracting party's name against orders and delivery records, keeping the letter's delivery record, "attachment preserves, it does not pay" (the last survives in zh-hant as 「假扣押用來保全金錢請求的強制執行」).

## Overlap with existing columns

topics/G4.md lists no overlap, but LINKS.md has two: ja 035 taiwan-unpaid-invoice-debt-collection (a 12-minute guide on the same procedure) and zh-hant 044 taiwan-payment-order-provisional-attachment. G4 is the short version built around the periods (two years, six months, three months, 20 days) and links both. I read 035 and 044 and found no statement in G4 that contradicts them.

## Checks run

- lint.py: ko OK (1,397), ja OK (1,398), en OK (797 words), zh-hant OK (1,394).
- variety_metrics.py check: no FAIL and no WARN in any language (ko cv 0.488, short 0.235, contrast 2; ja cv 0.481, short 0.188, contrast 0; en cv 0.548, short 0.217, contrast 0; zh-hant cv 0.562, short 0.15, contrast 0). The checker reads ja cite_end as 0 because ja cites 「127条」 without 「第」; counted by hand it is 10 of 32 sentences.
- Self-check: no stock hypothetical opener and no hypothetical at all (ja, en, zh-hant open on a generic scene, ko on a number; G1–G3 use question / misconception / document fact in ko, number / statement / question in ja, fact / statement / number in en, fact / statute quote / question in zh-hant); at least four very short sentences each; no word opens three paragraphs; the closing paragraph carries no citation in any language, and neither does the opening scene in ja, en and zh-hant (ko's only citation-free paragraph is the closing one); no rebuttal of a claim the reader did not make; the last paragraph ends on "no assets, no payment"; ko 합니다체 (the one question is 「있습니까?」), ja です・ます.
- First-two-paragraph deletion test (ko): 「2년입니다.」 is the fact; the second sentence carries the condition and the claim type; a bridging third sentence carried nothing and was deleted. In paragraph two, each sentence carries a rule (arts. 20, 36, 128, 127).

## Left for the final reviewer

- ko and ja have 3 and 2 characters of room, en 3 words. Any addition needs an equal cut.
- The art. 521 sentence states the article's text only. If the res judicata point should return, the 2015 amendment source has to be opened and cited (zh-hant 044 cites a Judicial Yuan bulletin for it).
- read_time was set to 3 minutes (ko, ja, zh-hant) and 4 minutes (en) for the longer text.
