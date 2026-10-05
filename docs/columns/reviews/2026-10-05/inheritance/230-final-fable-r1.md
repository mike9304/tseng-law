# I1 final review (Fable 5.1, round 1) — taiwan-inheritance-registration-deadline-unregistered-land

Date: 2026-10-05. Reviewer: Claude Fable 5.1 (model review; not a lawyer review, not a native-speaker review).

## Verdict

PASS. All four language files are publishable as they stand after one minor wording edit in en.md. Image OK.

## Scope checked

- Briefs: brief-SERIES.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/I1.md.
- Files: drafts/I1/ko.md, ja.md, en.md, zh-hant.md; facts.md read but not relied on.
- Sources compared sentence by sentence: research/statutes.md (民法 §759, §828, §1147, §1148, §1151, §1164; 土地法 §73, §73-1, §76; 土地登記規則 §41, §50, §119, §120; 遺產及贈與稅法 §8, §23, §41, §42, §44; 家事事件法 §3; amendment status 民國115年9月11日).
- Opened on 2026-10-05 for items not in statutes.md: 土地登記規則 §34 (law.moj.gov.tw, text confirmed: 登記申請書 / 登記原因證明文件 / 所有權狀或他項權利證明書 / 身分證明 / 其他); 遺產及贈與稅法 LawAll page (修正日期 民國115年09月11日 confirmed); 日本 不動産登記法 (e-Gov law API, law 416AC0000000123 = 平成十六年法律第百二十三号; §76-2 I "…知った日から三年以内に…申請しなければならない"; §164 I "…正当な理由がないのにその申請を怠ったときは、十万円以下の過料に処する" confirmed).
- Judgments: the column cites no judgment, so none of judgments/*.txt is in scope; no case number or holding appears in any version.
- Lint: all four files OK before and after the edit (ko 3,215 chars; ja 4,049 chars; en 1,493 words; zh-hant 2,644 chars). Lint confirms the internal-link slugs exist per language.
- Image: images/I1.webp opened and inspected.

## 1. Law and facts (all four languages)

Every statement of law was traced to the cited article. Findings:

- Timeline table (6 months / fine per month up to 20× / after 1 year notice 3 months then 列冊管理 / 15 years then 國有財產署 public tender): matches 土地法 §73 II and §73-1 I–II in all four versions. The discretionary 得 is preserved (물릴 수 있음 / 科すことができる / may / 得).
- Fee arithmetic: §76 千分之一 × 20 = 千分之二十 (ko 1,000분의 20; ja 1000分の20; en 2%; zh-hant 千分之二十). Correct and labelled as derived from the statute.
- §73-1 II–V details (3-month pre-tender notice; priority order 繼承人 → 合法使用人 → 其他共有人 within their use range; 30 days after award; loss of occupancy; lease capped at 5 years; proceeds in treasury account, claim by 法定應繼分, 10 years to treasury; re-tender with ≤20% reduction; 5 failed tenders → state land; 10-year claim window from registration; 90-day notice; 5th-tender 底價 basis): all four versions state these correctly and attribute each to the right paragraph.
- §119 documents and the 1985-06-05 (民國74年6月5日) cut-off for the court 准予備查 document: correct in all four. ja and zh-hant additionally state the pre-1985-06-04 alternative (§119 I 5 (一)) correctly; ja states the §119 III 戸籍謄本 omission correctly.
- 遺產及贈與稅法 §8 / §42 / §41 / §23 / §44: correct, with the exception clause of §8 preserved (免稅證明書 / 同意移轉證明書) and §44 stated as "2倍以下" (up to twice), not a fixed multiple.
- §73 I (any heir may apply for all; no effect on 拋棄繼承 / 限定繼承) and 土地登記規則 §120 (公同共有 by one or more heirs; 分別共有 needs全体同意; registry notifies others) and §119 II (substitute transcript + reason letter): correct in all four.
- §41 item 7 (ja, en, zh-hant only): correctly stated as 外國人或旅外僑民 + 駐外館處驗證 → 免親自到場.
- Japanese comparison (ja only): §76-2 "3年以内" and §164 "10万円以下の過料, 正当な理由なく" verified on e-Gov. The sentence compresses "自己のために相続の開始があったことを知り、かつ、当該所有権を取得したことを知った日" to "相続で所有権を取得したことを知った日"; acceptable as the general, sourced note the series rule 10 allows. The enforcement date of the Japanese duty is not stated; not required for a general note, noted here for the record only.
- No 2026 indexed amounts (免稅額 etc.) are used in any version, so nothing to reconcile with the MOF table. The sources sections correctly date the 遺產及贈與稅法 text to the 2026-09-11 amendment.
- Hypotheticals are internally consistent with the law applied (4 / 5 / 6 / 10 years after death → "may already be" at the 列冊管理 row; "may" preserved in each language).
- The four versions do not contradict each other on any point of law.

No major issue found.

## 2. Citations

- Inline links sit right after the claim in all four versions; each statute link points to the single-article URL for the article named (flno matched for every link).
- Sources sections are complete (every article linked in the body appears), headings are in the page language, check date 2026-10-05 present in each language's format.
- Internal links: ko and ja and en link /…/columns/foreign-heir-taiwan-succession-law-land and /…/columns/taiwan-inheritance-custody-analysis; zh-hant links foreign-heir-taiwan-succession-law-land and taiwan-inheritance-renunciation-debt. Lint confirms each slug exists in that language. None link to this batch.

## 3. Rules

- No private-party names; no judgment cited at all.
- No bold / underscore / HTML emphasis (grep on `**`, `__`, `<b>`, `<strong>`: none).
- No phone, LINE, Kakao; no street address; contact is a single short paragraph with the firm name and wei@hoveringlaw.com.tw only.
- author: "legal-ai-assistant" in all four; no lawyer-review or native-review claim anywhere; no attorney byline.
- Hypotheticals marked 가령 / 例えば / Suppose / 假設.
- Foreign-law notes: ja (e-Gov sourced, general), en (US: "question for a US adviser, state rules vary"), ko ("한국의 전문가에게 확인"), none states foreign court practice.
- Frontmatter: all keys per brief; en title 88 chars so seoTitle required and present at 42 chars; en summary 160 chars, no forbidden characters; audience matches file language; featured_image keeps literal NNN.

## 4. Voice

- ko: calm 합니다체; title names the object (부모님 명의로 남은 땅과 집) and the issue; first paragraph gives the core fact and leads straight into the table; no "이 글에서는" preview, no checklist headings. Natural.
- ja: です・ます throughout; opening compares with the Japanese 3-year rule in one sentence, which is what a Japanese reader would ask first. Subheads are specific. Natural; no 〜について解説します.
- en: plain, active; headings are statements, not imperatives; "Not every heir has to sign", "Estate tax comes before title" read as native. One wording edit applied (below).
- zh-hant: Taiwan usage throughout (地政事務所, 國稅局, 戶籍謄本, 祖厝, 阿公, 大伯, 外縣市); no simplified characters or mainland vocabulary found; 應/得/須 distinctions preserved from the statute.

## Issues

### Minor (applied)

1. en.md line 26 — Original: "depends on how long the title stays in the dead owner's name." → Problem: "dead owner" is blunt for a law-firm column; "deceased" is the ordinary register in English legal writing. → Fix applied: "deceased owner's name". → Facts preserved: identical meaning; no number, condition or citation touched. Lint re-run: OK.

### Notes, no change required

2. ja.md line 26 — the Japanese 不動産登記法 duty is stated without its enforcement date. It is a sourced general comparison, which the series brief allows; a date would need an official page that was not opened in this run. Left as is.
3. ja.md — the hypothetical uses お母さま in the set-up and 母 afterwards. Read in context as the reader's own mother in a worked example, this is acceptable Japanese narration; not changed.

## Minor edits applied

- en.md: "dead owner's name" → "deceased owner's name" (one occurrence).

No edits to ko.md, ja.md or zh-hant.md.

## Image verdict

OK. images/I1.webp shows a ring of old keys on a wooden table by an open window overlooking tiled roofs, a water tower and balconies with potted plants, in the style of an older Taiwanese townhouse. No faces, text, logos, flags or readable documents. It reads as a family house left as it was, which fits the column, and is respectful in tone.

## Limitations

This is a model review. It is not a lawyer's review and not a native-speaker review, and must not be described as either when the column is published.
