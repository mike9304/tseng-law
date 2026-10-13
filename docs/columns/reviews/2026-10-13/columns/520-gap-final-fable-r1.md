# G6 final review — Claude Fable 5.1 (r1, 2026-10-12)

Slug `taiwan-deferred-prosecution-conditions-complainant`. Files reviewed: `drafts/G6/ko.md`, `ja.md`, `en.md`, `zh-hant.md`, `facts.md`; `research/G6-statutes.md`; `reviews/G6/check-grok.md`, `fix1-notes.md`, `bestof-judge.md`; `images/G6.webp` (+ `G6.txt`); `topics/G6.md`, `topics/LINKS.md`; the lane brief, voice rules, SENTENCE-VARIETY-RULE, LESSONS, Threads brief.

## Verdict

PASS — all four languages publishable now; image OK. Two minor wording edits applied (below); no fact, number, citation or legal meaning changed.

## Scope checked

1. Law and facts: every statute sentence in the four versions compared against the live single-article pages, fetched by me on 2026-10-12 (page footer 法規整編資料截止日：民國 115 年 10 月 02 日): 刑事訴訟法 65, 253-1, 253-2, 253-3, 255, 256, 256-1, 260, 319, 323, 420; 民法 120, 122; LawHistory for C0010001. The live text is identical to `research/G6-statutes.md` Parts 2 and 4. LawHistory entry 55 reads 「中華民國一百十五年五月十三日總統華總一義字第 11500042671 號令修正公布第 101-1 條條文」; entries 54 (2025-11-11: 116-2, 205-2, 205-3, 205-4) and 53 (2024-07-31: 245, 70-1, 153-1~153-10, 245-1) touch none of the cited articles. The sources-section note "most recent amendment May 13, 2026, Art. 101-1 only" is correct in all four.
2. Citations: every inline link points to the right pcode/flno; the sources section lists every article used plus the history page and the check date (2026-10-12) in each language; no judgment cited, `research/judgments/` is empty, nothing to save. Internal links: none (0–3 allowed; 403 exists on origin/main but linking is optional).
3. Rules: no private names, no invented case/statistic/quote, no first-person story, no hypothetical at all (no label needed), no bold/emoji/phone/address, email-only contact once, `author: legal-ai-assistant`, no lawyer/native-review claim, no foreign-law comparison. Frontmatter per brief: ko seoTitle 27, ja 19, zh-hant 18 chars (≠ title); en title + " | Hovering Law" > 60 so seoTitle present, 44 chars; en summary 154 chars, no forbidden characters; one FAQ each, consistent with the body; audience/topic/categories/featured_image correct. lint OK for all four (ko 1398, ja 1398, en 757 words, zh-hant 1294).
4. Voice and sentence variety: `variety_metrics.py check` OK on all four (ko cv 0.557 short 13%; ja cv 0.599 short 10%; en cv 0.766 short 22%; zh-hant cv 0.851 short 17%; contrast 0; caveat runs 0). Section 5 self-check items 2–9 counted by hand: openers are result (ko), number (ja), question (en), document fact (zh) — no stock hypothetical frame; ≥2 very short sentences in each; no word opens three paragraphs; no claim-(statute)-caveat run and the last body paragraph carries no citation; contrast templates 0, nothing rebutted that the reader did not say; last paragraph ends on the conditions / time allowed / receipt date; ko 합니다체 and ja です・ます throughout (ja: two 体言止め, within allowance). No MONOTONY item.
5. Image: opened `images/G6.webp`.

## MUST VERIFY

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=253-2 — Paragraph 2 is a single paragraph: 「檢察官命被告遵守或履行前項第三款至第六款之事項，應得被告之同意；第三款、第四款並得為民事強制執行名義。」 The text must say items 3–6 (compensation, treasury payment, community service, treatment/counselling) need the defendant's consent, and items 3 and 4 may (得) serve as a civil enforcement title. ko 「배상부터 치료·상담까지 네 가지는 피고인이 동의해야 하고, 그중 배상과 국고 납부는 민사 집행의 근거가 될 수 있습니다」; ja 「賠償から処遇までの4つには被告人の同意が要ります。このうち賠償と国庫納付は…執行名義になり得ます」; en "Compensation, the treasury payment, community service and treatment need the defendant's consent. The first two may also serve as a civil enforcement title"; zh 「這四類（第三款到第六款）要得到被告同意；前兩類（第三款、第四款）並得為民事強制執行名義」. All four correct, 得 rendered as may/될 수 있다/なり得る/得.

MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=253-3 — Paragraph 1 lists exactly three items under the chapeau 「被告於緩起訴期間內，有左列情形之一者，檢察官得依職權或依告訴人之聲請撤銷原處分，繼續偵查或起訴」; item 2 reads 「緩起訴前，因故意犯他罪，而在緩起訴期間內受有期徒刑以上刑之宣告者」. The text must say: (1) during the period, intentionally commits a further offence punishable by fixed-term imprisonment or heavier and a prosecutor files an indictment; (2) an intentional other offence committed before the deferral, sentenced to imprisonment or heavier during the period; (3) breach of a 253-2 condition; revocation on the prosecutor's own motion or on the complainant's application. All four versions state exactly three grounds in this form and keep "또는 고소인의 신청에 따라 / または告訴人の申立てにより / or on the complainant's application / 或依告訴人的聲請". Paragraph 2 (已履行之部分，不得請求返還或賠償) is in all four with both 返還 and 賠償.

## Issues

No major issue found. Two minor items fixed, one noted without change.

1. en, last paragraph — Original: "Write down the conditions and the time allowed for each, as stated in the decision" → Art. 253-2 para. 1 and 4 speak of 一定期間 / 第一項之期間, not of a separate period per condition; "for each" over-specifies → Fix applied: "Write down the conditions and the time allowed, as stated in the decision". "Those three items" still counts conditions, time and receipt date → facts preserved (no number, link or obligation changed).
2. zh-hant, reconsideration paragraph — Original: 「再議期間和受理再議的檢察長，應記載在送達告訴人的處分書正本上。」 → Art. 256 para. 2 names 直接上級檢察署檢察長或檢察總長; the sentence dropped 檢察總長 that the preceding sentence had just named → Fix applied: 「再議期間和受理再議的檢察長或檢察總長，應記載在送達告訴人的處分書正本上。」 → facts preserved (completes the statutory addressee; nothing removed).
3. ja, conditions paragraph (no change) — 「このとき検察官は、期間を定めて次の8つを被告人に命じられます。」 could be read as ordering all eight at once; the statute is 得命…下列各款事項 (any of). The sentence is in the potential form and the list is immediately followed by the consent rule, so misreading is unlikely; ja sits at 1,398/1,400 characters and a rewrite would need a matching cut. Left as is; not a fact error.

Checked and accepted (not defects): ko renders 緩起訴 as 기소유예(緩起訴) throughout with hanja and defines it in the second paragraph as a deferral with a 1–3-year period, consistent with published ko column 029; ko 검찰서 matches site usage (지방검찰서 in columns 099, 143); ko 「법정형 하한이 유기징역 3년 이상」, ja 「法定刑の下限が3年以上の有期徒刑」, en "a minimum of three years' imprisonment or more", zh 「最輕本刑三年以上有期徒刑」 all equal 最輕本刑三年以上有期徒刑; the ten-day count (receipt day excluded, rest-day shift) is correctly sourced to 刑訴 65 + 民法 120 II, 122 and the Art. 66 在途期間 question is correctly left out; Art. 256 para. 3 is stated only as the statute words it; the "no compliance-notice rule" sentence is limited to the cited articles in all four; en/zh inference that a condition-related victim is served while 再議 belongs to the 告訴人 follows from Art. 255 II and 256 I; Art. 420 is cited by number only. The four versions agree on every number, article and condition.

## Minor edits applied

- `drafts/G6/en.md` line 46: removed "for each" (see issue 1).
- `drafts/G6/zh-hant.md` line 32: added 「或檢察總長」 (see issue 2).

After edits: lint OK (ko 1398, ja 1398, en 757 words, zh-hant 1294); variety checker OK on all four.

## Image

OK — `images/G6.webp` (1280×720, 34 KB): a dark stone bowl of still water and one leaf on a weathered wooden stool in a bare plaster room with daylight from a high window. No face, person, text, logo, flag, document or screen; generic and fictional; depicts no real case; respectful; fits the brief's "calm scene that fits the theme loosely" and avoids the listed site motifs.

## Limits

Native-voice judgment is a model's reading, not a native speaker's or a lawyer's review. Whether any other statute or administrative rule gives the complainant notice of compliance was not checked, and the column does not claim it.
