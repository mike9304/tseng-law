# G10 final review — Claude Fable 5.1, 2026-10-12

Slug: taiwan-sentence-fine-conversion-probation-deportation-foreigner. Files reviewed: drafts/G10/{ko,ja,en,zh-hant}.md, facts.md, research/G10-statutes.md, reviews/G10/check-grok.md, fix1-notes.md, images/G10.webp. One minor wording edit applied (zh-hant FAQ 2, listed below). No fact, number, citation or legal meaning was changed. No lawyer or native-speaker review is claimed; this is a model's review.

## Verdict

PASS. All four languages are publishable as they stand; image OK.

## Scope checked

- Official sources re-opened on 2026-10-12 with WebFetch: 刑法 第41、42、74、75、75-1、76、95條 and 入出國及移民法 第36條 (single-article pages, footer 法規整編資料截止日 民國115年10月02日), plus both 沿革 pages (C0000001 entries 57–58; D0080132 entry 12 with the 行政院 施行日期 order). Every paragraph quoted in research/G10-statutes.md Part 2 matches the live text. No judgment is cited in any language, so research/judgments/ is correctly empty and no judgment URL needed checking.
- Every statement of law in the four bodies, summaries and FAQ answers was traced to the article text (see facts.md K1–K20; all confirmed against the live pages). The four versions agree on every rule, number, condition and date; the only differences are omissions for length (ko/ja omit 第41條第3–4項, 第42條第2項, and the request to attach the judgment; ja omits the "not confirmed" sentence), none of which contradicts another version.
- Lint: ko OK 1,395 chars; ja OK 1,398 chars; en OK 795 words; zh-hant OK 1,396 chars (after the edit, unchanged).
- Variety checker: ko cv 0.551 short 0.143 contrast 0 caveat 0 — OK; ja cv 0.497 short 0.182 contrast 0 caveat 0 — OK; en cv 0.588 short 0.211 contrast 0 caveat 0 — OK; zh-hant cv 0.673 short 0.184 contrast 0 caveat 0 — OK. No FAIL line in any language.
- Frontmatter: ko seoTitle 20 chars, ja 19, zh-hant 15 (all ≤32, all differ from title); en title + " | Hovering Law" = 116 chars so seoTitle is required, present at 44 chars and differs from title; en summary 157 chars, no ellipsis, no forbidden characters; 2 FAQ items per language, each answer consistent with the body and the statute; audience = file language; author legal-ai-assistant; featured_image keeps the literal NNN.
- Rules: no bold (`**`, `__`, `<b>`, `<strong>` = 0 in every file), no emoji, no phone number, no street address, no LINE/Kakao ID; firm named once with wei@hoveringlaw.com.tw in the contact sentence only; no attorney byline or lawyer/native review claim; no private-party name, no statistic, no invented case or quote, no first-person story; no hypothetical in any language, so no label to lose; no Korean, Japanese or US law stated; time-sensitive facts carry "2026년 10월 / 2026年10月 / October 2026" and both amendment-history dates; internal links 0 (LINKS.md has no column on post-judgment enforcement; G9 of this lane is unpublished and correctly not linked); sources section is the last `##` heading in each file, lists every inline source plus both 沿革 pages, and carries the check date 2026-10-12; general-information line at the very end with the same date; zh-hant has no simplified characters and no mainland vocabulary.

## MUST VERIFY

MUST VERIFY 1: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=41 — 第1項 「犯最重本刑為五年以下有期徒刑以下之刑之罪，而受六月以下有期徒刑或拘役之宣告者，得以新臺幣一千元、二千元或三千元折算一日，易科罰金。但易科罰金，難收矯正之效或難以維持法秩序者，不在此限。」 Both conditions are cumulative (AND); three fixed daily amounts; 得. 第2項 「依前項規定得易科罰金而未聲請易科罰金者，得以提供社會勞動六小時折算一日，易服社會勞動。」 All four versions state the two conditions together (ko 조건은 둘입니다 / ja 条件は二つです / en Two conditions / zh 條件有兩個), the three amounts as alternatives (never as a range), the correction/legal-order exception, and six hours of community service per day when conversion was available but not applied for.

MUST VERIFY 2: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=74 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=75 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=75-1 — 第74條第1項: 「受二年以下有期徒刑、拘役或罰金之宣告，而有下列情形之一，認以暫不執行為適當者，得宣告二年以上五年以下之緩刑，其期間自裁判確定之日起算」; item 1 「未曾因故意犯罪受有期徒刑以上刑之宣告者」; item 2 「前因故意犯罪受有期徒刑以上刑之宣告，執行完畢或赦免後，五年以內未曾因故意犯罪受有期徒刑以上刑之宣告者」. 第75條第1項: 「撤銷其宣告」 (no 得) on two grounds, an intentional other offence during or before probation that brings 逾六月有期徒刑 final within the probation period; 第2項 application within six months of that judgment becoming final. 第75-1條: 得撤銷 on four lighter grounds only where 「足認原宣告之緩刑難收其預期效果，而有執行刑罰之必要」; 第2項 extends the six months to items 1–3. All four versions state: sentence of up to two years (유기징역·구류·벌금 / 有期徒刑、拘役または罰金 / imprisonment, detention or a fine / 有期徒刑、拘役或罰金); both record conditions in the statute's shape (not "five years have passed"); the appropriateness finding; two to five years counted from finality; both mandatory grounds (during or before) with no discretion; the lighter grounds with the double finding; the six-month application window tied to judgment-based grounds only.

MUST VERIFY 3: CONFIRMED — https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=95 ; https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=36 — 第95條 「外國人受有期徒刑以上刑之宣告者，得於刑之執行完畢或赦免後，驅逐出境。」 (得). 第36條第4項: 「移民署依規定強制驅逐外國人出國前，應給予當事人陳述意見之機會；強制驅逐已取得居留或永久居留許可之外國人出國前，並應召開審查會。但當事人有下列情形之一者，得不經審查會審查，逕行強制驅逐出國：…二、經法院於裁判時併宣告驅逐出境確定。」 All four versions say "may" for 第95條 (ko 반드시는 아닙니다 / ja 必ずではありません / en May, not must / zh 是「得」，不是「應」), keep "after execution or pardon", state the hearing for everyone and the committee for residence/permanent-residence permit holders, and cite 第4項第2款 for removal without the committee after a final judgment that pronounced deportation.

Amendment dates: 沿革 C0000001 entry 58 (民國115年7月22日, 第80條 only) and entry 57 (民國115年3月13日, 第79-1條 amended, 第78-1、78-2條 added) touch none of the cited articles; the sources lines in all four languages say so correctly. 沿革 D0080132 entry 12: promulgated 民國112年6月28日; 行政院 order of 民國112年12月6日 puts 第36條 into effect 民國113年3月1日. All four sources lines read "promulgated 2023-06-28, in force 2024-03-01". CONFIRMED.

## Issues

No major issue. Nothing is unsupported, overstated, outdated or mixed up; no language contradicts another.

### Minor (applied)

1. zh-hant FAQ 2 — Original: 「外國人受有期徒刑以上刑之宣告，「得」於刑之執行完畢或赦免後驅逐出境，條文用的是「得」。」 → problem: 「得」 is quoted inside the restated article and then explained again at the end of the same sentence; the double quotation reads as a copy-paste. → fix (applied): 「外國人受有期徒刑以上刑之宣告，得於刑之執行完畢或赦免後驅逐出境，條文用的是「得」。」 → facts preserved: the 第95條 rule, 得, "after execution or pardon", and the 第36條第4項第2款 sentence are unchanged. Lint OK (1,396 chars, FAQ not counted); variety OK.

### Minor (noted, not changed — no legal error, lengths are at the cap)

2. ko / ja, 第41條 combined sentences — Original: ko 「이행 기간은 1년, 여러 죄를 합쳐 집행하는 형이 6개월을 넘으면 3년까지입니다.」 ja 「履行期間は1年、複数の罪を合わせて執行する刑が6か月を超えれば3年までです。」 → observation: this restates 第9項 (履行期間不得逾三年; 未逾六月者 一年) correctly, but does not add the 第8項 condition that every offence in the combination must itself qualify (en "offenses that each qualify" and zh-hant 「各罪都符合時」 carry it). It is a cap on the period, not a statement of eligibility, so it is an omission rather than a misstatement; a future revision with room could add 「각 죄가 모두 환산 대상이면」 / 「各罪がいずれも換算できる場合に」. → facts preserved: nothing changed.

3. ko 「공고(公庫) 납부」 / 「배상과 공고 납부」 — the editor's choice (公庫 glossed with hanja, chosen over 국고 because 公庫 is wider) is accurate; "공고" alone remains an unusual Korean word, but the hanja gloss at first mention makes it readable. Not changed.

4. en mixes "Art. 41 … Art. 42 … Art. 74" with "Article 95" (spelled out at a sentence start). Acceptable style; not changed.

## Voice per language

- ko: 합니다체 throughout; opening gives the fact (조건이 맞으면 교도소에 가지 않는 길; 하루를 돈으로 바꿉니다), one reader question (돈으로 바꾸지 않으면 어떻게 될까요?), citations placed as subject, inside the sentence or once at a paragraph end; no roadmap, no checklist heading, no contrast template; last paragraph ends on the finality date. Reads as Korean, not translation.
- ja: です・ます throughout (one 体言止め 「…であること。」, within the rule); opening is a fact, no greeting, no strawman, no preview; 有期徒刑・拘役 are the statute's terms; natural paragraph openers (台湾では / 条件は / 換算を / 罰金刑は / 執行猶予 / 負担が / 猶予中 / 判決を / 国籍は / 移民署は / 秘密でない). The earlier register-mixing and strawman tags from the Grok check are resolved.
- en: plain, active, short sentences mixed in ("May, not must." "It has to be finished within one year."); one reader question; no "The/A/Article/If" opener repeated beyond two; three distinct labels for 社會勞動, 義務勞務 and 易服勞役; the nationality sentence sits at Art. 95, stated once.
- zh-hant: Taiwan usage (移民署, 居留, 易科罰金, 緩刑, 地方 wording like 「留了分期的空間」, 「到這裡為止，沒有一條問國籍」); 得 kept against 應; three reader questions; no 一次看懂 / 本文將帶您了解 / 官腔; no simplified characters or mainland terms.
- Self-check section 5 items 2–9: no stock hypothetical opener (no hypothetical at all); at least two very short sentences in every file; no word opens three paragraphs; no three consecutive claim-(statute)-caveat paragraphs (caveat 0) and the opening and closing paragraphs carry no citation; contrast templates 0 by the checker, one deliberate 得/應 line in zh-hant; last paragraph ends on this column's fact (the finality date); registers uniform; nothing lost. No MONOTONY item.

## Minor edits applied

- drafts/G10/zh-hant.md, FAQ 2 answer: removed the redundant inline quotation marks around 得 (issue 1). Lint and variety re-run: OK.

## Image

OK. images/G10.webp shows a concrete breakwater with a wooden bollard and a coiled rope, calm sea and an overcast sky; the pier leads off toward the horizon. No face, text, logo, flag, document or screen; no identifiable place or case; respectful and generic. The mooring rope and the path out to sea read as restraint and departure, which fits a column on sentence enforcement and removal without depicting any real event.

VERDICT: PASS
