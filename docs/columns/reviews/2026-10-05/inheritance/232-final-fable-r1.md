# I3 final review (Fable 5.1, round 1) — taiwan-intestate-succession-order-shares-representation

Date: 2026-10-05 (KST). Files reviewed: `drafts/I3/ko.md`, `ja.md`, `en.md`, `zh-hant.md` (state after fix1). Lint before review: all four OK (ko 2,910 chars · ja 3,333 chars · en 1,371 words · zh-hant 2,244 chars).

## Verdict

PASS — all four languages publishable as they stand; image OK. No major issue. No edits applied (nothing found that needed one).

## Scope checked

1. Law and facts, every statement in all four versions, against `research/statutes.md` (law.moj.gov.tw text of 民法 §1065, 1077, 1138, 1139, 1140, 1141, 1144, 1145, 1148, 1166, 1174, 1175, 1176, 1187, 1223 current text; 涉外民事法律適用法 §58) and against official pages I opened myself today:
   - 民法 §1223 single-article page: current text (配偶 1/2, 直系血親卑親屬 1/2, 父母 1/2, 祖父母 1/3; no 兄弟姊妹) and the status line 「一百十五年八月十七日修正公布第 1223 條條文，自公布六個月後施行」.
   - 民法 沿革 entry 37: 「中華民國一百十五年八月十七日總統華總一義字第 11500076161 號令修正公布第 1223 條條文；並自公布六個月後施行」.
   - 民法 historical version 修正日期 民國110年01月20日 (LawOldVer, lnndate=20210120): 第1223條 「一、直系血親卑親屬…二分之一。二、父母…二分之一。三、配偶…二分之一。四、兄弟姊妹…三分之一。五、祖父母…三分之一。」 — matches the "pre-amendment" figures given in all four versions.
   - 民法繼承編施行法 §1 (text as quoted in the columns) and §12 「中華民國一百十五年七月二十八日修正之民法第一千二百二十三條，自公布六個月後施行，不適用前條第二項規定。」
   - 民法 §1030-1 (five paragraphs; the columns state only that the claim exists and is calculated apart from the inheritance share — supported by paragraph 1).
   - law.moj.gov.tw/ENG pcode=B0000006 page title "Enforcement Law for Part V, Succession Law of the Civil Code" — the English name used in en.md.
   - Japanese 民法 via e-Gov law API: §887(2) (death / 第891条 / 廃除 are the 代襲 grounds; renunciation absent), §889(2) (準用 of §887(2) to 兄弟姉妹), §900(1) (子と配偶者 各二分の一). All three statements in ja.md are correct.
   - Korean 민법 on law.go.kr: the edition label 「민법 [시행 2026. 3. 17.] [법률 제21454호, 2026. 3. 17., 일부개정]」 was confirmed from the page header (matches the ko sources line). The article bodies are loaded by script and could not be read by my tools; the statements about 제1001조 (대습상속 covers 직계비속 또는 형제자매), 제1003조 제1항 (배우자는 1·2순위 상속인과 공동상속, 없으면 단독상속) and 제1009조 제2항 (5할 가산) match the statutory wording as I know it and the writer's quotations in facts.md. Recorded as a limit, not an error.
2. Arithmetic in every example: ko/en/zh-hant (spouse + 3 children): 1/4 each; predeceased child with 2 children → 1/4, 1/4, 1/4, 1/8, 1/8 (sum 1); one child renounces → 1/3 each (1/4 + 1/12). ja (spouse + 2 children): 1/3 each; predeceased with 2 children → 1/3, 1/3, 1/6, 1/6; one renounces → 1/2 each. Spouse with both parents → 1/2, 1/4, 1/4; with two siblings → 1/2, 1/4, 1/4. Table (equal / 1/2 / 1/2 / 2/3 / all) matches §1144. All correct.
3. Cross-language consistency on law: identical core (ranks, §1144 fractions, §1140 grounds = death or loss of right only, §1176 I/V/VI/VII, §1174 III, §1148 II, §1145 five grounds with 宥恕 for grounds 2–4, §1077 I/II, §1065, §1166, §1187, §1223 dates and figures, 施行法 §1, 涉外法 §58). No contradiction found.
4. The 2026-09-11 遺產及贈與稅法 amendment and the 2026 tax figures: not used in this column (topic is intestate order/shares); nothing in the text conflicts with statutes.md.
5. Citations: every statute claim carries an inline law.moj.gov.tw single-article link to the right article (checked each flno against the article cited). §1223 links to the current article plus the LawOldVer page and the 沿革 page; the pre-amendment figures are attributed to the old text. No judgment is cited (topic brief names none). Sources sections list every linked source with check date 2026-10-05 in each language. Internal links: ko/ja/en → 016 `taiwan-inheritance-custody-analysis` and 026 `foreign-heir-taiwan-succession-law-land` (exist in those languages; 016 does contain a section on 상속채무와 상속포기 with §1148 and §1174, so "포기 절차와 채무 정리는 …에서 설명했습니다" is accurate); zh-hant → 060, 195, 026 (exist; link texts equal the live titles). Lint confirms existence.
6. Rules: no private-party names; no bold/underline/strong (grep clean); no phone, LINE/Kakao, street address, or 「19號6樓之1」; contact = firm name + wei@hoveringlaw.com.tw once, near the end, before sources; `author: "legal-ai-assistant"`; no lawyer-review or native-review claim; hypotheticals marked (가령 / とします・例えば / Suppose / 假設); foreign-law notes are general, statute-only, sourced (law.go.kr, e-Gov) or "ask a local professional" (ja, en); frontmatter keys per brief; en title + " | Hovering Law" exceeds 60 chars so seoTitle present (41 chars); en summary 156 chars, no forbidden characters; audience = file language; featured_image keeps literal NNN.
7. Voice: read each version in full as a reader of that language. First two paragraphs of each version carry facts (the example fractions, the "not one half" point, the §1138 order); no announcement sentences, no checklist headings, no "이 글에서는", "解説します", "it is important to note", "本文將帶您了解". Titles state the column's own question. ko is even 합니다체; ja is natural です・ます; en is plain and active ("step in", "take one quarter each"); zh-hant uses Taiwan terms only (應繼分, 拋棄繼承, 戶籍, 我國, 認領, 宥恕; no 大陸 vocabulary or simplified characters). Fix1 changes (summary sentences, "사건"→"경우", "계산하지 않습니다"→"상속인이 되지 않습니다", en calques) read naturally and preserve meaning.
8. Image `images/I3.webp` opened and inspected.

## Issues

None major. Observations recorded for the record (no change required, no change made):

- ko/ja/en/zh-hant, §1176 VI sentence ("부모, 형제자매, 조부모의 순서로 다음 순위가 상속합니다" / "parents, then siblings, then grandparents") → read alone it could suggest the three ranks follow automatically; the next paragraph in every version states that each step happens only as the previous group renounces, and FAQ 3 repeats it → no fix → conditions preserved.
- ja line 46 「剰余財産の分配請求権」 → the Taiwan term is 剩餘財產差額分配請求權; the Japanese phrasing is a slight simplification but not wrong, and the sentence only says the claim is calculated apart from the inheritance share → left as is (not worth a re-edit of a passing text) → fact preserved.
- ko sources line "(2026년 3월 17일 시행 조문 기준)" → edition label verified on law.go.kr header; article bodies not machine-readable (see Scope 1) → no fix → noted as a verification limit only.

## Minor edits applied

None.

## Image verdict

OK. A plain wooden dining table with chairs of different ages and styles, one small child's chair among them, a bowl of fruit, soft daylight. No people, faces, text, logos, flags or documents; fictional and unidentifiable; respectful; fits the topic (who has a seat at the table, including a grandchild).

## Evidence

- Lint (run 2026-10-05 after reading, no edits made):
  ```
  python3 lint.py drafts/I3/ko.md ko taiwan-intestate-succession-order-shares-representation → OK [length 2910 chars]
  python3 lint.py drafts/I3/ja.md ja … → OK [length 3333 chars]
  python3 lint.py drafts/I3/en.md en … → OK [length 1371 words]
  python3 lint.py drafts/I3/zh-hant.md zh-hant … → OK [length 2244 chars]
  ```
- Rule sweep: `grep -nE '\*\*|__|<b>|<strong>|phone patterns|+886|LINE|Kakao|19號|號6樓|Wei Tseng|曾雋崴' drafts/I3/*.md` → no matches.
- Official pages opened today are listed under Scope 1 with the quoted text.

## Limits

This is an AI final review. It is not a lawyer's review or a native speaker's review and must not be described as either. Korean article bodies on law.go.kr could not be read by tool (JavaScript-rendered); see Scope 1.
