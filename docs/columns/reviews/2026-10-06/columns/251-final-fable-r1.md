# C2 final review (Fable 5.1, round 1) — taiwan-small-claims-simplified-civil-procedure

Date: 2026-10-06. Reviewer: Claude Fable 5.1 (final gate). Files: drafts/C2/ko.md, ja.md, en.md, zh-hant.md; image images/C2.webp.

## Verdict

PASS. All four language versions are publishable as they stand. No major issue. No edits applied. Image OK.

## Scope checked

- Briefs: brief-BATCH.md (hard rules 1–10, frontmatter spec), brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/C2.md, topics/LINKS.md.
- Prior review chain read: reviews/C2/voice-grok.md (13 voice items) and reviews/C2/fix1-notes.md (all 13 handled; the writer's deviations from Grok's proposals were justified and preserve hypothetical markers per hard rule 7).
- Fact sheet drafts/C2/facts.md read but not relied on; every statute and page below was opened independently on 2026-10-06.
- Statute texts verified against research/C2-statutes.md (民事訴訟法 修正日期 112-11-29): §1, §2, §12, §77-13, §77-25, §96–§102, §403, §427, §428, §430, §433-1, §433-3, §434-1, §436-1, §436-8 to §436-32.
- Articles not in the research file, fetched from law.moj.gov.tw today: 民事訴訟法 §68, §77-19, §77-27, §78, §380, §406, §416, §419, §424, §440, §466-3, §468, §508, §509, §516, §519, §521; 強制執行法 §4, §5; 法院組織法 §97, §98.
- Judicial Yuan pages fetched today: 民事事件費用徵收標準 (np-167-1, 更新日期 115-06-22), 新聞稿 113-12-30 (cp-1887-1228003), 什麼是小額訴訟 (cp-1654-4873, 更新 114-07-22), 民事小額訴訟表格化訴狀 (cp-1361-4051, 更新 114-08-28).
- Japan: 民事訴訟法 第368条 第1項 fetched via the e-Gov law API (lawId 408AC0000000109); the column's statement (60万円以下の金銭請求、原告が求めたとき) matches the text.
- No judgment is cited in any version; research/judgments/ is empty, which is consistent.
- Lint run on all four files after review: ko OK 3470 chars; ja OK 4388 chars; en OK 1570 words; zh-hant OK 2672 chars.

## 1. Law and facts (all four languages)

Every claim checked. Results:

- Small-claims scope (§436-8 I, II, IV) and the partial-claim bar (§436-16): correctly stated in all four. ko/ja/zh-hant cite §436-16; en omits it (length), no contradiction.
- Simplified procedure contrast (§427 I, II; §436-1): correct. ja's "期間を定めた建物の賃貸借" matches §427 II-1; traffic accident matches II-11.
- Court fee: §77-13 base (1,000 / 100 per 萬 / 畸零 rounds up) correct. §77-27 (cap 十分之五) correct. Surcharge in force 2025-01-01 (≤10萬 加徵十分之五; 逾10萬至1,000萬 十分之三; 逾1,000萬 十分之一) matches the 113-12-30 press release and the fee table's 備註 5 verbatim. Fee table rows 1,500 / 130元/萬 / 100萬=13,200 confirmed. Note: the WebFetch summariser of the fee table garbled the surcharge bands (it said ≤100萬 50 percent); I re-fetched the raw HTML and the verbatim 備註 reads 十萬元以下 十分之五、逾十萬元至一千萬元 十分之三, so the columns are right.
- Arithmetic: 80,000/90,000 → 1,500 ✓; 125,000 → excess 25,000 counts as 3萬 → 1,500 + 3×130 = 1,890 ✓ (statutory 1,300 + surcharge 500 + 90 = 1,890 ✓); 300,000 → 1,500 + 20×130 = 4,100 ✓ (statutory 3,000 + 1,100 ✓). Same numbers in all four tables.
- Costs follow the loser (§78), fixed in the judgment (§436-19), lawyer's fee only court-appointed (§77-25) and third instance (§466-3): correct and cautiously phrased.
- Jurisdiction §1, §2 II, §12, §436-9 (standard-terms exception, both-merchants carve-out): correct in all four.
- Form complaint §436-10, oral filing §428 II via §436-23 (ko, ja, en), preparation list from the Judicial Yuan guide, Mandarin and interpreter (法院組織法 §97, §98): correct.
- Mandatory mediation §403 I-11 (≤50萬 property disputes), §424 I (suit deemed mediation application), §419 IV (immediate argument unless extension requested), §416 I + §380 I (effect), §406 I grounds (other statutory mediation body; service abroad or by public notice), §436-12 (5 days' notice, non-appearance): all correct. The brief's open question "does mandatory mediation apply to small claims" is answered correctly: yes by amount.
- Hearing rules §433-1, §430, §433-3 via §436-23; §436-11 (evening/Sunday unless objection); §436-14; §436-18 I; §436-20: correct.
- Appeal §436-24 (district court collegial panel, violation of law only), §436-25, §440 via §436-32 II (20 days), §436-28, §436-30, §468 via §436-32 II: correct.
- Security for costs §96 I, II; §97; §99 II; §101; ja also §98 and §102 I–II: correct. "Nationality is not the test" is a fair reading of §96 I.
- Representation §68 I: correct.
- Enforcement 強制執行法 §4 I, §5 I; payment order §508 I, §77-19 II-5 (500元, not subject to the 2025 surcharge per the press release's list of articles), §516 I, §521 I, §519 I, §509: correct.
- Dates: 民事訴訟法 "2023-11-29 last amended" matches 112-11-29. Fee figures carry "2026年10月 / October 2026 / 2026-10-06 확인" as hard rule 9 requires.
- Cross-language consistency: no contradictions on law or numbers. Differences are only in which optional articles each version includes (facts.md §3 is accurate on this).

## 2. Citations

- Inline links sit right after each claim; every statute link uses the law.moj.gov.tw single-article URL with the right flno. Spot-checked all 436-x, 77-x, 96–102, 403–424, 508–521, B0010004 and A0010053 links: correct articles.
- Judicial Yuan URLs match the pages fetched. ja's e-Gov link goes to the whole law page, not the article anchor; acceptable for a general foreign-law note.
- Sources sections complete and include every article linked in the body (checked by comparing body links with the list); check date 2026-10-06 present in all four.
- Internal links exist in the right language per LINKS.md: ko (031, 065, 058), ja (031, 035, 058), en (031, 065, 058), zh-hant (044, 065). Lint confirms existence. None link to this batch.

## 3. Rules

- No private-party names; no judgment cited.
- No bold or bold workaround (grep for `**`, `__`, `<b>`, `<strong>`: none in the four files).
- No phone numbers, hotlines, LINE/Kakao IDs; no street address. Contact is one soft paragraph with the firm name and wei@hoveringlaw.com.tw in each version, placed before the sources section.
- author: "legal-ai-assistant"; audience matches file language; no byline; no lawyer-review or native-review claim.
- Hypotheticals marked: 가령 / 例えば…とします / If, say / 假設.
- Foreign law: only ja carries a one-sentence note on Japan's §368 with the e-Gov source; no Korean or US law statements. No court statistics or durations.
- Frontmatter per brief: all keys present. en title + " | Hovering Law" = 92 chars, so seoTitle is required and present at 39 chars (within 30–45). en summary 156 chars, no forbidden characters, no ellipsis. ko/ja/zh-hant seoTitle present and different from title. featured_image keeps the literal NNN. 2–3 FAQ items each, consistent with body.

## 4. Voice

- ko: 합니다체 throughout, no lecture tone left after fix1; title names the threshold and the three topics; first paragraph gives scope, fee, one-hearing rule, mediation and appeal limit (each sentence carries a fact). Headings are specific statements, not checklist titles. No repeated 틀.
- ja: natural です・ます; the Japan-comparison opening is a genuine reader need, not a generic intro; "依頼されたロゴを納品して…受け取れていないとします" reads cleanly. 義務・可能 distinguished (〜なければなりません / 〜できます).
- en: plain and active; must/may track the statute; "Nationality is not the test." and "A judgment is a basis for compulsory enforcement, not a payment." are good plain English. Heading set is specific.
- zh-hant: Taiwan usage only (地方法院、聲請、裁定、影本、住居所、定型化條款、尾款、入帳); no simplified characters or mainland terms. 應・得・不得 preserved. Title is a reader question, not clickbait.

## 5. Issues

No major issue. Two minor observations, not applied (a wording change here would touch legal nuance, so left to the writer's discretion):

- ko line 76 / ja line 80 / en line 78: "피고는 본안 변론 전에 신청해야 하고" / "本案について弁論をする前に申し立てる必要があり" / "The defendant has to apply before arguing the merits" (§97) → the statute also allows a later application when the ground became known later (但應供擔保之事由知悉在後者，不在此限). The sentence is a fair summary of the rule and the omitted proviso favours the defendant, so it does not mislead the plaintiff reader. Optional fix: add "원칙적으로 / 原則として / as a rule". Facts otherwise preserved.
- ja line 26 and sources: the Japan §368 link points to the whole 民事訴訟法 page on e-Gov rather than the article anchor. Optional: append `#Mp-Pa_2-Ch_6-At_368`. Not required; the law and article are named in the text and the source line.

## Minor edits applied

None. The files are unchanged from the fix1 state (lint lengths identical to fix1-notes.md).

## Image

OK. images/C2.webp shows a wooden desk in warm side light with a stack of plain metal coins, a sealed kraft envelope and a small desk lamp. No faces, no readable text, no logos, no flags, no identifiable documents. It reads as "a modest sum and the paperwork to claim it", which fits a small-claims column, and it is calm and respectful.

## Limits

This is a model review. It is not a lawyer's review or a native speaker's review and must not be presented as either.
