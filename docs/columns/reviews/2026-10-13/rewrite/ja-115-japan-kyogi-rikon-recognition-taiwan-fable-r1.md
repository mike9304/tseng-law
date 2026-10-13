# FINAL REVIEW r1 — ja-115 japan-kyogi-rikon-recognition-taiwan (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. Publishable as the live replacement after the one tiny edit listed below (applied; guard re-run PASS).

## Scope checked

- orig.md vs draft.md, full text, claim by claim (front matter, FAQ, H1, 6 body sections, contact line, sources list).
- guard.txt (GUARD: PASS) and re-run of guard.py after my edit: GUARD: PASS, length 4499 -> 4402 (98%).
- variety_metrics.py check --lang ja: no FAIL; one WARN (89% of sentences end in です・ます) which is the required register, not a defect.
- notes.md, tests.patch, tests.txt, vitest-0.log.
- SENTENCE-VARIETY-RULE sections 5–6, COLUMN-VOICE-RULE, LESSONS skimmed.

## 1. Fact preservation — claim by claim

### Front matter / FAQ / H1
- title, seoTitle, summary, published, date_display, read_time (約12分), categories, topic, featured_image, 3 FAQ q/a, audience, author: identical. lastmod 2026-10-03 -> 2026-10-06 only. H1 identical. Preserved.

### Opening (2 paragraphs)
- Japanese 戸籍謄本 / 離婚届受理証明書 used to reflect divorce in Taiwan register; cites 太平区案内 + 戸籍法第26条 -> draft P1, same two links. Preserved. (や -> か: consistent with 擇一 handling later.)
- Japanese municipal acceptance alone does not complete Taiwan registration -> draft P1 "済みません。別に手続が要ります。" Preserved.
- Before filing, check governing law and validity of form; 戸政事務所 = administrative counter for 戸籍 -> draft P2. Preserved.
- Ex-spouse not cooperating: if divorce already valid, room for one-party application, 第34条 -> draft P2, citation now mid-sentence. Preserved.

### Section 1 (heading renamed; "届出先だけでは決まらない" point kept in body)
- 準拠法 definition; 涉外民事法律適用法第50条 is the starting point -> P1. Preserved.
- Time reference: time of agreement, or filing of suit for judicial divorce -> P1 (parenthetical). Preserved.
- 3-step ladder (common national law / common domicile law / closest connection) -> list identical. Preserved.
- No common national law for JP+TW couple -> next check common domicile law; Japanese filing alone cannot skip to Japanese law -> P2. Preserved.
- Look at circumstances at time of agreement; explain each spouse's 生活の本拠 with residence history -> P2. Preserved.
- Hypothetical (both in Japan vs. one moved to Taiwan after separation) with label 仮定の例 -> P3, label kept in parentheses. Preserved.
- Return date alone does not change domicile; cannot project current address onto past -> P3. Preserved.
- Three kinds of evidence show different facts; tell counter/lawyer acceptance date and where/when agreed separately -> P4 (two sentences swapped, "からです" links them). Preserved.

### Section 2 (heading renamed)
- 民法第1050条: writing, 2+ witness signatures, registration at 戸政機関 -> P1. Preserved.
- Cannot conclude from 第1050条 alone that divorce is not established until Taiwan registration -> P1 (question + answer). Preserved.
- 第16条: form follows governing law of the act OR law of place of act; if places differ, either place's law -> P2. Preserved.
- 第50条 = requirements/effect, 第16条 = form; different checks -> P2. Preserved.
- Two things to check: substantive requirements + validity of form under Japanese law -> P3. Preserved.
- Not required to duplicate Taiwan-form steps in Japan; Japanese filing does not resolve intent/準拠法 issues -> P3. Preserved (both negations intact).
- Signing in different countries / mailing documents -> check where each act happened; having a certificate ≠ no dispute on validity incl. form -> P4. Preserved.
- Scope statement + internal link taiwanese-spouse-divorce-agreement-registration -> P5 (order swapped). Preserved.

### Section 3 (heading unchanged)
- 駐日代表処 handles 戸籍謄本 / 賞状形式の届受理証明書 / 通常の受理証明書; 2026-10-03 check of 太平区案内; choose one, not all -> P1. Preserved. "3種類" is the count of the same three items and matches the source title 有三（擇一）; no new fact.
- 戸籍謄本 must show divorce fact and date; 受理証明書: check type and date; issue date ≠ divorce date -> P2. Preserved.
- 施行細則第13条 originals; 第14条 overseas-made certificates need 在外機関 authentication; foreign-language documents need Chinese translation authenticated by 在外機関 or Taiwan notary; shared kanji does not waive translation -> P3. Preserved; 第14条 still attached only to the overseas-authentication claim, translation sentence uncited as in original.
- Beyond the seal: 「符合行為地法」 annotation and effective date are checked; 台中市 manual distinguishes annotated foreign divorce from Taiwan-form divorce effective on registration -> P4. Preserved.
- Tell 台北駐日経済文化代表処・各弁事処 the purpose; confirm certificate type, age since issue, translation, annotation; give name and issue date of documents already held -> P5. Preserved.
- 日本台湾交流協会 Tokyo is not the authentication counter; its page points to the 代表処 -> P6 unchanged. Preserved.

### Section 4 (heading unchanged)
- 第34条: both parties in principle; judicial divorce etc. and already-effective divorce -> one party may apply; foreign 協議離婚 with 行為地法 annotation -> one party, per public guidance -> P1. Preserved. (Attribution now "公的案内にもそう示されています", acceptable since 第34条 itself covers 已生效 divorce.)
- Need not give up because ex-spouse does not attend; but this does not remove the need for the other side's consent to the divorce itself; distinguish mere non-attendance from contesting consent/validity -> P2. Preserved.
- 2026-10-03 南区案内: divorce certificate, 戸口名簿, 国民身分証, foreigners: passport etc., photo; photo sometimes omitted; ask office about counterpart documents in one-party filing and ID renewal -> P3. Preserved (foreigner item split into its own sentence).
- Proxy by Taiwan relative: overseas-made 委任書・授権書 needs authentication; 第47条: delegation of 協議離婚登記 needs 正当な理由 + 戸政事務所の承認; ask office which documents; mailing papers alone insufficient -> P4. Preserved. (Citation parenthesis now at sentence end; it sits directly after the 委任 clause it supports; see non-blocking note.)
- 第26条第1項第3号 route: either/both party currently or formerly had Taiwan 戸籍 -> apply at 在外機関, forwarded after authentication to 戸籍地・原戸籍地 office; authentication-only vs forwarding changes preparation; state scope -> P5. Preserved.

### Section 5 (heading renamed)
- No uniform Taiwan-court "recognition" step; municipal 協議離婚 is not a foreign final judgment; 民事訴訟法第402条 requirements cannot be applied to 受理証明書 -> P1. Preserved.
- If supplementation requested, identify the gap (translation authentication, divorce date unclear, name mismatch); try additional proof first; "cannot register" alone does not mean sue; on formal refusal check reasons and appeal guidance -> P2. Preserved.
- Where consent or signature is disputed, supplementation may not solve it; 家事事件法第3条第1項第1号 (confirmation of existence/non-existence of marriage); consider confirmation suit; confirmation ≠ new divorce claim -> P3. Preserved.
- Jurisdiction separate: 第53条 grants jurisdiction e.g. one party Taiwanese national, exception for marked inconvenience to defendant; Taiwanese counterpart does not guarantee Taiwan forum; include Japanese proceedings documents -> P4. Preserved.
- Japanese judgment / 調停調書 handled separately; 項目49 judgment + 確定証明書 authenticated; money enforcement -> internal link enforce-foreign-judgment-in-taiwan -> P5. Preserved.

### Section 6 (heading unchanged)
- 項目8: effective date per 行為地法; submission/authentication date is not the divorce date; check register after registration; query office if date/counterpart differs -> P1. Preserved.
- Children's residence, custody, support remain separate; registration alone does not grant authority to relocate child or enforce Japanese money terms; internal link cross-border-parenting -> P2 (link sentence moved before the final sentence). Preserved. "子どもの生活拠点" became "生活拠点" but the preceding sentence and the link title keep the child context.
- Contact line (firm, 曾雋崴（Wei Tseng）弁護士, email, address): byte-identical.

### Sources list
- Heading, 確認日 line, 9 bullets incl. 項目6・8・9・47・49 and 2021年12月17日: identical to original.

Nothing added: no new facts, cases, numbers (3種類 restates the listed three), first-person stories, promises or sales lines.

## 2. Front matter
Identical except lastmod "2026-10-06". read_time unchanged. H1 and featured_image unchanged. OK.

## 3. AI voice / monotony
- variety_metrics: FAIL 0. cv 0.469, short 13.8%, run3 0, cite_end 2.1%, contrast 0, caveat 2, questions counted 0 by the tool but the text has three genuine reader questions (opening でしょうか, 第1050条 paragraph, 来所しないだけなのか…争っているのか).
- Rule section 5 self-check: (2) opening is a reader question, no 例えば…とします formula; (3) very short sentences present (別に手続が要ります。/ 確認する内容が違います。/ ここで対応が分かれます。); (4) paragraph starts: 台湾… twice only, no word three times; (5) no three consecutive claim→ただし paragraphs, several uncited paragraphs; (6) contrast templates 0, no straw-man rebuttal; (7) last body paragraph ends on this column's facts, contact kept as one sentence from the original; (8) です・ます throughout, no bold, no emoji, no imperative/checklist headings. All items met.
- Native reading: rhythm varies, citations sit as subject, mid-sentence, and in parentheses; the fragment pair 実質的な離婚の要件を満たすか。日本法による方式が有効か。 reads as natural column Japanese. No translationese found.

MONOTONY items: none.

## 4. Length / padding
4499 -> 4402 (98%). Cuts are connective words (例えば、これは、したがって、また、これに対し) and compressions (日本語と中国語で共通する漢字が多くても -> 漢字が共通でも). No legal point removed.

## 5. Tests
tests.patch touches only src/content/columns-ja/115-japan-kyogi-rikon-recognition-taiwan.md (the column body). No test file modified, no .skip/.only, no other column's assertion changed. vitest-0.log: 73 files / 996 tests passed. Tests verdict: OK.

## Blocking issues
None.

## Tiny edits applied (by reviewer)
1. Section 5 P1: 「反映のために、台湾の裁判所で…」 -> 「戸籍への反映のために、台湾の裁判所で…」. The paragraph opened a new section with 反映 lacking its object. No fact, number, citation or structure changed. Guard re-run: GUARD: PASS. Variety: FAIL 0.
   (A second attempted edit restoring 子どもの before 生活拠点 created a consecutive same-start FAIL and was reverted; the sentence is unambiguous in context.)

## Non-blocking notes on the rewrite
- Section 4 P4: 第47条 parenthesis now closes a sentence that also mentions authentication of the overseas 委任書. It stands directly after the 委任 clause it supports, and the authentication sentence was uncited in the original too, so attribution is not shifted. A later edit could place the link mid-sentence if desired.
- Section 4 P1: 「公的案内にもそう示されています」 (も) slightly widens the attribution versus the original 「と公的案内に示されています」. Defensible because 第34条 itself covers 其他離婚已生效者.

## Original issues (not blocking)
- The original and the rewrite both use 駐日代表処 and 台北駐日経済文化代表処 for the same body; consistent with the source wording, no change needed.
- The street address in the contact line triggers the house lint note; pre-existing house format, kept as in the original.
