# FINAL REVIEW r1 — zh-hant-023 baby-taiwan-nationality-birth-registration (Claude Fable 5.1)

Verdict: PASS (publishable as the live replacement, with one tiny heading edit applied by the reviewer and re-guarded).

## Scope checked

- orig.md vs draft.md, full text, claim by claim (front matter, H1, intro, 3 H2 sections, bullets, H3 contact, check-date/disclaimer line).
- guard.txt (GUARD: PASS) and guard.py re-run after my edit (GUARD: PASS, length 1187 -> 1173, 99%).
- variety_metrics.py check --lang zh-hant: OK, no limit violated (cv 0.461, short 0.118, run3 0.061, cite_end 0.0, contrast 0, q 3).
- notes.md (rewriter), tests.patch, tests.txt, claude-tests1.log.
- SENTENCE-VARIETY-RULE.md sections 5-6, COLUMN-VOICE-RULE.md, LESSONS.md top items (judgment, frontmatter-faq, wrong-citation, monotony-contrast, deadline-amount, zh-native, heading-intro-ai, law-version).
- Repo tests: grep of src/lib for the old/new heading strings found no test that pins any heading of this column.

## Front matter / H1

Lines 1-20 identical byte for byte except lastmod "2026-09-28" -> "2026-10-12". read_time unchanged (約5分鐘閱讀, length 99%). title, seoTitle, summary, date_display, categories, featured_image, 3 FAQ q/a, audience, author unchanged. H1 (line 22) unchanged. No body image line in the original; none added.

## Claim-by-claim fact table

Intro (orig l.24 -> draft l.24)
- Foreign-born child with birth certificate: can they go straight to 戶政事務所? -> kept verbatim as opening question. Preserved.
- Birth certificate records the fact of birth; household registration depends on child's status and birthplace -> "出生證明只記出生事實。戶籍登記要看孩子的身分和出生地，程序各不相同。" Preserved. ("程序各不相同" restates the column's thesis of two procedures; no new legal fact.)
- Before travel, know which passport the child can apply for and which document to use at entry/exit -> kept. Preserved.

Section 1 heading: 「國籍從出生時的父母身分談起」 -> rewriter wrote 「國籍取決於出生時的父母身分」. The original deliberately hedged (談起 = start from), since 國籍法第2條 also has grounds that do not turn on the parents' status (e.g. 父母均無可考或均無國籍). 取決於 overstated that. Reviewer edit: 「國籍先看出生時的父母身分」 (hedge restored, natural Taiwan usage). See "Tiny edits".

Section 1 para 1 (l.28)
- 國籍法第2條 (link law.moj.gov.tw pcode D0030001 flno 2): persons meeting statutory situations such as father or mother being ROC national at birth have ROC nationality -> kept, same link, "等法定情形" qualifier kept. Preserved.
- Mere birth in Taiwan does not confer nationality -> "只在台灣出生，不會因此取得國籍". Preserved.
- A child with nationality still must complete household registration under the applicable procedure -> kept. Preserved.

Section 1 para 2 (l.30)
- Legal parent-child relationship matters equally -> kept.
- BOCA overseas-birth first passport notice (link fp-27-22-83434-1) explains 非婚生子女依母取得國籍 and 由中華民國籍父親認領 -> kept verbatim with link. Preserved.
- If parents unmarried / acknowledgment pending / foreign documents inconsistent with Taiwan records: clarify how parentage is proven first -> recast as reader question "怎麼辦？先釐清怎麼證明親子關係。" Preserved.
- Parents' passports give identity data but cannot supply all parentage proof -> "無法取代所有親子關係的證明" (補足 -> 取代; same practical meaning: passport alone insufficient). Preserved.

Section 2 heading: 「在台灣出生的登記，與海外出生的初設戶籍」 -> 「在台出生辦出生登記，海外出生辦初設戶籍」. Same two procedures named. Preserved.

Section 2 para 1 (l.34)
- Hospital certificate data (name, date/time, place, parents) is the basis of later registration -> kept.
- Domestic birth registration vs overseas-born 初設戶籍 after settlement documents are two procedures -> kept ("兩者程序不同").
- 戶政司初設戶籍須知 (link ris.gov.tw 702) distinguishes 國內、國外、大陸及港澳 -> kept, same four categories, same link.
- 戶籍法第48條: birth registration at the latest within 60 days after birth -> kept, now statute as subject; 60日 and starting point (出生後) kept. Preserved.

Section 2 para 2 (l.36)
- Child born in Taiwan who leaves before birth registration may face 移民署 settlement categories on return -> kept.
- Deciding 出生登記 vs 初設戶籍 requires jointly considering parents' household registration at birth, whether the child was registered, and actual departure/entry facts -> "要一併看三件事" listing the same three items. Preserved.
- Whether the foreign parent's country requires separate reporting / which nationality or certificate procedures: confirm under that country's rules -> kept ("要依該國規定確認"; obligation kept).
- Taiwan hospital and 戶政 documents do not complete reporting to Japan, Korea, US etc. -> kept with same three country examples. Preserved.

Section 2 para 3 (l.38)
- 移民署無戶籍國民在臺定居須知 (link .../定居/36430/) lists categories such as 出生時父或母為居住臺灣地區設有戶籍國民 and distinguishes entry on foreign vs ROC passport -> kept, same link.
- Child's age, parents' registration at birth, identity used at entry decide eligibility under that item -> kept.
- Children in these categories need not always reside a fixed number of years first; Taiwanese parents do not mean skipping review -> "不必一律先居留固定年數。但有台灣父母，審查也照樣要過。" Preserved.

Section 2 para 4 + bullets (l.40-43)
- Mainland-born conditions must be viewed separately from general foreign-born -> kept ("尤其" dropped; emphasis only, not a legal point).
- 移民署須知「誰可以辦」第（四）款 applies to children not registered in the mainland and not holding a mainland passport, two classes -> kept, 第（四）款 kept.
- Bullet 1: one parent 居住臺灣地區設有戶籍國民, other 大陸地區人民, mainland-born child under one year -> identical.
- Bullet 2: both parents 居住臺灣地區設有戶籍國民, mainland-born child -> identical.

Section 2 para 5 (l.45)
- Under-one class: apply with 30 days reserved before first birthday, counting excludes the receipt day and holidays, and exchange for 定居證 before turning one -> kept verbatim (30日, 不含收件當日及例假日, 滿一歲前換領定居證).
- Even if the child is still under one, it may already be too late -> "孩子還沒滿一歲，就來得及嗎？不一定。申請時間可能已經過了。" Same meaning. Preserved.

Section 2 para 6 (l.47)
- Child with mainland household registration or mainland passport: 移民署 first determines status and applicable procedure -> kept.
- 移民署 also has 大陸地區人民十二歲以下親生子女定居須知 (link .../居留/75458/), different eligible status from the 無戶籍國民 categories; parents identify the class first, then prepare that class's documents -> kept with link; "家長" kept as subject.
- Birth, marriage or acknowledgment certificates, legal representative consent, document authentication prepared per class -> kept. Preserved.

Section 3 heading 「有護照，不代表戶籍已經辦好」 -> unchanged.

Section 3 para 1 (l.51)
- Eligible overseas-born nationals may first apply for an ROC passport per the BOCA notice, then settlement and registration -> kept.
- Nationality on the passport does not prove the child is registered in Taiwan -> "證明不了孩子已在台設籍". Preserved.

Section 3 para 2 (l.53)
- After meeting the applicable settlement category's conditions and obtaining required permits, apply for 初設戶籍 at the 戶政事務所 of the intended registration place -> kept; the two prerequisites are listed in reverse order (許可文件、條件), both still required before 初設戶籍, no sequence claim lost. Preserved.
- 移民署須知注意事項（七）: within 30 days from the day after issuance of 定居證 or 入國登記證 -> kept (翌日起30日內, both document names). Preserved.
- First departure after registration requires an ROC passport with 國民身分證統一編號 -> kept. Now a separate sentence rather than joined by semicolon to the （七） clause; attribution is still the same paragraph and the FAQ states it the same way. Minor loosening of attribution, not a change of meaning (noted below, non-blocking).
- Children who entered on a foreign passport must factor this into the return trip -> kept verbatim.

Section 3 para 3 (l.55)
- BOCA 「人別確認」 explanation (link cp-35-6012-14fbe-1) applies to applicants with Taiwan household registration -> kept with link.
- Under 14 without ID card: may use 戶口名簿 or 戶籍謄本 etc. per the explanation; minors also need legal representative consent -> kept (14歲 kept).
- Not to be used directly as a document list for 無戶籍 children -> kept. Preserved.

H3 「親子與登記問題的聯絡」 -> 「聯絡方式」. Contact heading only; no legal content.

Contact paragraph (l.59) -> identical: lawyer name 曾雋崴, firm 昊鼎國際法律事務所, items to describe, mailto wei@hoveringlaw.com.tw, instruction to send sensitive data only after instructions, address 103 臺北市大同區承德路一段35號7樓之2, internal link /zh-hant/columns/marrying-taiwanese-national-registration-checklist. Preserved.

Final line (l.61) -> 官方資料確認日：2026年9月27日 kept; disclaimer (資格依個案事實及法令判斷; 文件、費用、申請安排依承辦機關最新說明核對) kept. Preserved.

Nothing added: no new facts, cases, numbers, first-person stories, promises or sales lines. All 5 external links, the mailto and the internal link are present and unchanged.

## Blocking issues

None.

## MONOTONY items

None blocking. Section 5 self-check:
1. Tool: OK (no FAIL).
2. Opener is the original reader question, not a stock hypothetical formula.
3. Very short sentences present (出生證明只記出生事實。/ 兩者程序不同。/ 不一定。/ 這款分兩類：); no run of long sentences.
4. Paragraph openers all different (孩子/國籍法/法律上/醫院/在台/海外/大陸/未滿/已有/符合/取得/領事/請向/官方).
5. No three consecutive claim-(statute)-但 paragraphs; intro and the 30-day paragraph carry no citation.
6. Contrast templates 0; no rebuttal of a claim the reader never made.
7. Last paragraph is the column's own check-date and a topic-specific notice (same content as the original), not a copied stock disclaimer or sales line.
8. Taiwan register (對不上, 碰上, 登記過沒有, 照樣要過); no bold, no emoji, no imperative or checklist headings; no invented first person.
9. No article number, deadline, amount, link or label lost (table above).

Reader impression: the rhythm is no longer uniform; three reader questions and several short declaratives break the 應/須 officialese of the original. Nothing reads as translationese.

## Tests verdict

tests.patch: OK. It only adds one entry 'zh-hant/baby-taiwan-nationality-birth-registration': '2026-10-12' with a comment to the REWRITTEN_LASTMOD map in src/lib/__tests__/family-columns-20260927.test.ts, next to the ja 023 and ko 022 entries. No it()/test() blocks added or removed, no .skip/.only, no assertion about another column touched. The rewriter's test log reports the full vitest run passing (78 files) with the contact email, attorney name, phone-number absence, summary length and image path assertions unchanged.

## Tiny edits applied by reviewer

1. draft.md line 26 heading: 「## 國籍取決於出生時的父母身分」 -> 「## 國籍先看出生時的父母身分」. Reason: the original's 「談起」 hedged; 取決於 read as an absolute rule although 國籍法第2條 also covers cases not based on parents' status. One-word change, no structure, number or citation touched. guard.py re-run: GUARD: PASS (length 1187 -> 1173). variety check re-run: OK.

## Original issues (not blocking)

- The first-departure passport requirement (配賦國民身分證統一編號) was joined to 注意事項（七） by a semicolon in the original; the rewrite makes it a separate sentence in the same paragraph. Whether （七） itself contains that sentence was not re-verified against the 移民署 page here (the rewriter also did not reopen the pages; check date remains 2026-09-27).
- 戶籍法第48條 is cited in the body without a link in both versions (the other statute citations are linked).
- Lint notes tolerated as house format of the original: office street address present, last H2 is not a sources section.
