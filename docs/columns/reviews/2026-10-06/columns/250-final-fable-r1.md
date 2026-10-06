# C1 final review (round 1) — taiwan-stalking-harassment-act-written-warning-protection-order

Reviewer: Claude Fable 5.1 (final gate). Date: 2026-10-06.
Files reviewed: drafts/C1/ko.md, ja.md, en.md, zh-hant.md; drafts/C1/facts.md (not trusted, used only as an index); images/C1.webp.

## Verdict

PASS. All four languages are publishable now. One minor precision edit applied to ko (FAQ 2). No major issues.

## Scope checked

1. Law and facts. Every statute claim in the four files was checked against the official text:
   - 跟蹤騷擾防制法 §§3, 4, 5, 6, 7, 10, 12, 13, 18, 19, 23 — research/C1-statutes.md and the law.moj.gov.tw LawAll page opened 2026-10-06 (公布日期 民國110年12月01日, no 修正日期 shown; §23 本法自公布後六個月施行).
   - 施行細則 §§6, 9, 10, 12, 14, 15, 18 — research file and LawAll page opened 2026-10-06 (發布 民國111年03月18日; §18 自111年6月1日施行).
   - 刑事訴訟法 §§41, 99, 237, 238, 242, 303 — each LawSingle page fetched 2026-10-06 (整編資料截止 民國115年09月24日).
   - 中華民國刑法 §§305, 309, 310 — LawSingle pages fetched 2026-10-06.
   - Official English titles: "Stalking and Harassment Prevention Act" (law.moj.gov.tw/ENG pcode D0080211) and "The Communication Security and Surveillance Act" (K0060044) — fetched 2026-10-06.
   - Korea 스토킹범죄의 처벌 등에 관한 법률 제2조 — law.go.kr DRF XML (MST 289995, 법률 제21998호, 2026-09-29 일부개정, 시행 2026-10-02) saved as reviews/C1/tmp-fetch/kr-drf.xml. 제2조 제1호 defines 스토킹행위 with 「상대방의 의사에 반(反)하여 정당한 이유 없이」 and 제2호 「지속적 또는 반복적으로」; no sex/gender element. The ko column's statement is correct, and the "2026년 10월 2일 시행 조문 기준" label matches.
   - Japan ストーカー行為等の規制等に関する法律 — e-Gov law API v2 (412AC0100000081) saved as reviews/C1/tmp-fetch/egov-stalker.xml. 第2条第1項 purpose clause 「恋愛感情その他の好意の感情又はそれが満たされなかったことに対する怨恨の感情を充足する目的で」, 第4条 警告 by 警察本部長等, 第5条 禁止命令等 by 都道府県公安委員会 — all as the ja column states.
   - No judgment is cited (research/judgments/ is empty; columns cite none). Consistent.
   Result: every article number, deadline (10 days, 2 years, 6 months), amount (NT$100,000 / 500,000 / 300,000), penalty ceiling (1 / 5 / 3 years), date (promulgated 2021-12-01, in force 6 months later), procedure (police → written warning → objection to higher agency, final; court order on repeat within 2 years; proxies; ex officio without prior warning; no court fee; jurisdiction; address omission; §12 contents; 2-year duration, extension ≤2 years each; DV route under §5 IV; 告訴乃論 only for §18 I; 6-month complaint period; 不受理; withdrawal before close of first-instance argument; §18 IV; interpreter under 刑訴 §99 II; record read-back under §41 II–III via §242 III) is supported and correctly stated in all four versions. The four versions agree with each other on every point of law. The hypothetical examples contain no arithmetic.

2. Citations. Inline links sit right after the claims and point to the correct single-article URLs (pcode and flno checked for every link). Sources sections list every cited source with the check date 2026-10-06 in each language. Internal links exist in the target language per topics/LINKS.md: ko → 144 (ko), ja → 096 (ja), en → 200 and 033 (en), zh-hant → 113 and 061 (zh-hant). No link to a column of this batch.

3. Rules. No private-party names (hypothetical A씨/B씨, Aさん/Bさん, "Dana"/"a man", 小安, all introduced with 가령 / 例えば…とします / Suppose / 假設). No bold, no phone or hotline numbers, no street address, email-only contact once near the end, author legal-ai-assistant, no lawyer- or native-review claim. Foreign-law notes (Korea §2, Japan §§2/4/5, US "varies by state") are short, general and sourced or framed as a caution. Frontmatter keys per brief; en title + " | Hovering Law" exceeds 60 chars so seoTitle is present at 40 chars; en summary 157 chars with no forbidden characters. lint.py: ko OK (3393), ja OK (4241), en OK (1591 words), zh-hant OK (2591) — re-run after my edit, still OK.

4. Voice. Titles are specific to this column and are not imperative or formulaic. First paragraphs deliver the hypothetical and the three remedies at once; deleting either of the first two paragraphs would lose facts (the scenario that the later examples refer back to; the promulgation date, §23, and the "特定人" point). Headings are natural subheads tied to the content. The single table compares three statutory penalties, which is a real comparison. No "이 글에서는", "解説します", "Here's what you need to know", "一次看懂". ko reads as calm 합니다체; ja as natural です・ます with correct legal terms (書面告誡, 保護令, 親告罪, 有期徒刑, 拘役); en is plain and active; zh-hant uses Taiwan terms only (地方法院, 警察機關, 裁判費, 筆錄, 通譯, 交友軟體, 外送, 訊息洗版), no simplified characters, no PRC usage. The eight-type paragraphs are long but follow the statutory order without counting filler.

5. Image. See below.

## Issues

### ko — FAQ 2 (minor, applied)

Original → 「법원이 내린 금지 명령 등을 어기면 3년 이하 유기징역, 구류 또는 30만 대만달러 이하 벌금에 처해질 수 있습니다(제19조).」
Problem & reason → §19 punishes violation of orders under §12 I items 1–3 only; "금지 명령 등" could be read to include item 4 (other measures). The body table already states the limit precisely; the FAQ was looser than the body.
Fix (applied) → 「제12조 제1항 제1호부터 제3호까지의 보호령을 어기면 3년 이하 유기징역, 구류 또는 30만 대만달러 이하 벌금에 처해질 수 있습니다(제19조).」
Facts preserved → penalty (3년 이하 유기징역, 구류, 30만 대만달러 이하 벌금), §19 citation, conditional "처해질 수 있습니다". The sentence now matches the statute and the ja/en/zh-hant FAQs, which were already precise.

### Observations not requiring change

- en: the US note ("vary by state and are no guide to the steps below") has no source link. The reader brief allows a general "state law varies" caution, and the sentence asserts nothing about US law beyond that. Left as is.
- ko: the intro says the victim can apply for a protection order "그래도 행위가 이어지면"; the two-year-after-warning condition is stated fully in the protection-order section and FAQ 2. Acceptable as an introduction; same structure in en ("if he keeps going") and ja.
- facts.md line 157 still describes the ko opening as 「가령 …라고 하겠습니다」 (superseded by fix1); the fact sheet is internal and not published, so no action.

## Minor edits applied

1. drafts/C1/ko.md, FAQ 2 — "법원이 내린 금지 명령 등을 어기면" → "제12조 제1항 제1호부터 제3호까지의 보호령을 어기면" (see above). lint ko: OK, 3393 chars.

No edits to ja.md, en.md, zh-hant.md.

## Image verdict

OK. images/C1.webp: an empty Taiwan lane at dusk, three parked scooters along a wall, an open lit doorway with a closed umbrella leaning in it, shuttered shopfronts behind. No faces, no readable text, no logos, no flags, no documents. It fits the column's "waiting outside home or work" scenario without depicting a victim or an aggressor, and it is respectful.

## Verification evidence kept

- reviews/C1/tmp-fetch/egov-stalker.xml (e-Gov API, Japanese act, fetched 2026-10-06)
- reviews/C1/tmp-fetch/kr-drf.xml (law.go.kr DRF, Korean act MST 289995, fetched 2026-10-06)
- Taiwan statute pages were fetched live; the texts match research/C1-statutes.md and the quotations in facts.md.

## Limits

This is a model review of law against official texts and of style. It is not a review by a licensed attorney or by a native speaker of any of the four languages.
