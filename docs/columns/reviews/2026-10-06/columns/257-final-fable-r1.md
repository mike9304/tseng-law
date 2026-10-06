# C8 final review r1 — taiwan-naturalization-keep-original-nationality

Date: 2026-10-06. Reviewer: Claude Fable 5.1 (final gate; not the writer). Files: drafts/C8/ko.md, ja.md, en.md, zh-hant.md; drafts/C8/facts.md (not trusted, used as an index); research/C8-statutes.md; images/C8.webp. No judgment is cited in any version, so research/judgments/ needed no check.

## Verdict

PASS. All four languages are publishable now. Image OK. Two minor wording edits applied to en (one of them re-attaches an amendment date to the right object); lint and the variety checker are OK on all four files after the edits. No major issue remains. Three non-blocking notes and two verification limits are recorded below.

## Scope checked

Read in full: brief-BATCH.md, brief-EDITORIAL-VOICE.md, COLUMN-VOICE-RULE.md, topics/C8.md, the four column files, facts.md, research/C8-statutes.md, reviews/C8/fix1-notes.md, SENTENCE-VARIETY-RULE.md, LESSONS.md.

Official pages opened by me on 2026-10-06 (not taken from facts.md):

- law.moj.gov.tw 國籍法 (D0030001): header 修正日期 民國113年05月24日; 第4·5·9·10·19條 re-read live and identical to the research file. 第3·6·7·8·20條 checked against the research file.
- law.moj.gov.tw 國籍法施行細則 (D0030022): header 民國113年11月19日; 沿革 opened: the 113-11-19 order amended 第6條 only.
- law.moj.gov.tw 歸化國籍之高級專業人才認定標準 (D0030033): header 民國115年07月14日; 第2條 and 第3條 full text; 沿革 (entry 5: 115年7月14日 修正發布第2條條文); LawOldVer (113-10-17 text) compared item by item: 量子科技, 核能專業, 證券期貨, 自然碳匯, 碳捕捉後封存 are absent from the old text and present in the current one.
- law.moj.gov.tw 歸化取得我國國籍者基本語言能力及國民權利義務基本常識認定標準 (D0030028): header 民國106年06月03日; 第3·6·7條 full text.
- law.moj.gov.tw 入出國及移民法 (D0080132): header 民國112年06月28日; 第3·9·10·25條 full text.
- law.moj.gov.tw/ENG: official English titles of D0030033 and D0030028 match the names used in en.md.
- law.go.kr 국적법: the 법령 URL resolves to lsiSeq=244609, header 「[시행 2022. 10. 1.] [법률 제18978호, 2022. 9. 15., 일부개정]」; 제15조 제1항 and 제16조 제1항 match the ko quotation character for character.
- e-Gov API: 国籍法 第11条 第1項 and 戸籍法 第103条 第1項 match the ja quotation and paraphrase (1 month; 3 months when abroad on that day).
- travel.state.gov Dual Nationality page: HTTP 403 to WebFetch and to curl with a browser user agent (same as the writer reported). A site-restricted search returns this exact URL with the title "Dual Nationality - travel.gov - State Department", so the URL exists. See verification limits.

Checks run (actual output):

- lint.py: ko OK (3353 chars), ja OK (4081 chars), en OK (1596 words after my edits; 1597 before), zh-hant OK (2697 chars).
- variety_metrics.py check: ko, ja, en, zh-hant all "OK — no variety limit violated" (en re-run after edits: cv=0.635 short=0.129 run3=0.015 cite_end=0.286 contrast=0).

## 1. Law and facts — result per claim group

All of the following are correctly stated in all four languages and agree across languages:

- 國籍法 第9條: certificate of loss within one year of the approval date; 應撤銷 if not filed; extension only where MOFA verifies a restriction in the original country's law or procedure; no 定居 before the certificate; three exemptions (第5條第1項第3款, 第6條第1項, reasons not attributable to the applicant). 施行細則 第11條: extension request at least 30 days before the deadline with proof of having applied for loss.
- 第3條 five requirements; 第4條第1項 three years and the spouse exemption from item 4 only; 第5條第1項第3款 (recommendation, benefit to the ROC, MOI joint review, 2 years at 183 days or 5 continuous years in the past); 第6條 with Executive Yuan approval; 第7條; 第8條.
- 施行細則 第2·4·5·6·7·9條: in-person filing at the household registration office of the domicile; domicile definition; study-based residence excluded; counted back from the application and unbroken; twice the basic wage or NT$5 million; APRC holders may omit the proof (得免附).
- Language standards 第3·6·7條: three kinds of proof; 200 / 72 / 100 hours (ja, en); 20 questions, 5 points each, 100 total; oral in 華語, 閩南語, 客語 or an indigenous language, written in 華語; pass marks 70 / 60 / 60 and 50 for age 65 or older.
- 入出國及移民法 第3·9·10條: definitions of 定居 and 無戶籍國民; residence applied for at the NIA; 335 days in one year, or 270 days in each of two consecutive years, or 183 days in each of five consecutive years; household registration within 30 days of the settlement permit.
- 認定標準 第2條 (six fields, the economic-field and education-field wording, the 2026-07-14 additions) and 第3條 (recommendation statement issued within six months; paper review for those granted permanent residence under 入出國及移民法 第25條第3項第2款 or 第3款).
- 第10條 (ten years, listed offices), 第20條 via 施行細則 第19條第2項, 第19條 (two years from knowledge, five-year cap, no limit for a final judgment on sham marriage or adoption).
- Hypotheticals: three years at 183 days or more satisfies the two-year period (ko, en, zh-hant, ja second example); four years with a Taiwanese spouse satisfies three years (ja first example). Arithmetic is right.
- Foreign law: ko quotes 국적법 제15조 제1항 exactly and cites 제16조; ja quotes 国籍法 第11条 第1項 exactly and paraphrases 戸籍法 第103条 correctly; en and zh-hant give Japan as a one-sentence sourced example and make no statement of US law. No foreign court practice is stated. Each version tells the reader to confirm with the home authority.
- The statement that neither the Nationality Act nor the Standards lets a Gold Card replace the recommendation or review is limited to those two texts, which I read in full; nothing in them says otherwise.

### Issue 1 (fixed, en only)

- Original: "([Enforcement Rules, Article 7](…flno=7), as amended November 19, 2024)"
- Problem and reason: the phrase attaches the amendment date to Article 7. The official 沿革 of the 國籍法施行細則 shows that the order of 民國113年11月19日 amended 第6條 only; Article 7 was not amended on that date. ko, ja and zh-hant attach the date to the regulation (「2024년 11월 19일 개정 시행세칙 제7조」, 「2024年11月19日改正の施行細則第7条」, 「2024年11月19日修正的施行細則第7條」), which is accurate as a version label and matches the sources list.
- Fix (applied): "(Enforcement Rules as amended November 19, 2024, [Article 7](…flno=7))"
- Facts preserved: same date, same article number, same link, same thresholds (twice the basic wage; NT$5 million). Word count unchanged.

### Non-blocking notes (no change required for publication)

- N1. 第9條第1項 has a second starting point: where the original country's law requires a minimum age to lose nationality, the year runs from reaching that age. All four versions give only the approval date. This is a simplification for adult applicants and is consistent across languages; it matters mainly for accompanying minors, whom each version already sends to the household registration office. If a later revision has room, one clause could add it.
- N2. 入出國及移民法 第10條第1項第1款 但書 exempts people granted residence under 第9條第1項第2款, 第4款 or 第8款 (including 高級專業人才 needed by Taiwan) from the residence period before 定居. The column describes the path for a person who resides under 第3款 (歸化取得我國國籍), which is what the statute provides for naturalized persons. Whether a person naturalized as a high-level professional can use 第8款 is not answered by the statute text, and the column does not claim either way. Acceptable as written.
- N3. In ko, ja and zh-hant the date before 「施行細則第7條」 reads as the version date of the regulation. A reader could take it as the date Article 7 changed. Leaving it is accurate; rewording it to match the en fix is optional.

## 2. Citations

- Inline links follow the claims; every law.moj.gov.tw link uses the right pcode and flno for the article named (D0030001 flno 3–10, 19, 20; D0030022 flno 2, 4, 5, 6, 7, 9, 11, 19; D0030033 flno 2, 3; D0030028 flno 3, 6, 7; D0080132 flno 3, 9, 10).
- Sources sections list every source used in the body, with the amendment date of each law and the check date 2026-10-06 in each language. ko lists the Korean act with its 법률 number and 시행 date as shown on law.go.kr.
- e-Gov links point to the whole act (the /law/ URL has no single-article form); the article number is given in the text.
- Internal links: taiwan-permanent-residence-aprc (029), taiwan-employment-gold-card (027), taiwan-foreign-spouse-residence (028) exist in ko, ja, en and zh in the repo; link texts match the published titles. No link to a column of this batch.

## 3. Rules

No private-party names; no bold; no phone or hotline numbers; no street address; contact is one short paragraph with the firm name and the email only; author is legal-ai-assistant; no lawyer-review or native-review claim; hypotheticals are labelled ((가상의 사례입니다) / （架空の例です） and 例えば…であれば / (an invented example) / （虛構情境）). Frontmatter keys and values follow the brief: topic "visa", literal NNN image path, three FAQ items consistent with the body, audience equals the file language; en seoTitle 42 characters, en summary within 150–160 characters with no forbidden characters (lint OK); ko/ja/zh-hant seoTitle present and different from the title. Time-sensitive facts carry dates (table as of 2026-10-06; 2024-11-19; 2026-07-14).

## 4. Voice per language

- ko: 합니다체 throughout. Title names the reader's question and the two points the column covers. The first paragraph opens with the one-year period and gives the rule, the consequence, the exemption and the Korean-law caveat; removing any of its sentences loses a fact. 호정사무소 and 입출국및이민법 match the terms used in published ko columns (019, 023, 028). No translationese found that needs changing.
- ja: です・ます throughout; title is a natural question plus the two topics; the opening gives the deadline, then a labelled example. 喪失原有國籍證明, 高級專業人才 and 社會公正人士 are glossed on first use. Reads as Japanese prose.
- en: plain and active; statute-led sentences use must / may correctly (應 → must, 得 → may). One stilted sentence fixed (see minor edits).
- zh-hant: Taiwan usage (戶政事務所, 移民署, 外僑居留證, 我國); opens by answering the title question (「原則上要。」); no mainland terms, no simplified characters, no 官腔 stacking.
- Titles are specific and neither imperative nor formulaic; headings are topic-specific; no checklist headings, no forecast sentences, no formula closing. The last paragraph in each language ends on a fact of this column (the Ministry of the Interior decides on the documents).

Sentence variety (SENTENCE-VARIETY-RULE sections 5–6): checker FAIL 0 in all four files. Self-check items: no stock hypothetical opener in the first sentence; very short sentences well above 2 in each file; no word opens three paragraphs; no run of three claim-(statute)-caveat paragraphs and each file has citation-free paragraphs; contrast templates 0 by the checker, and no sentence rebuts a claim the reader did not make; no formula closing; ko and ja registers are uniform. No MONOTONY finding.

## 5. Minor edits applied (en.md only)

1. Line 46: "([Enforcement Rules, Article 7](…), as amended November 19, 2024)" → "(Enforcement Rules as amended November 19, 2024, [Article 7](…))". See Issue 1.
2. Line 52: "Twenty questions at five points each make up the test." → "The test has twenty questions worth five points each." Reason: inverted, stilted subject. Facts preserved: 20 questions, 5 points each. No paragraph-opener limit is broken (this is the only paragraph starting with "The").

After the edits: lint.py en OK (1596 words); variety checker OK. ko, ja and zh-hant were not edited.

## 6. Verification limits

- travel.state.gov blocks automated requests (403). I confirmed through a site-restricted search that the linked URL exists under the title "Dual Nationality", but I did not read the page body directly. en and zh-hant only link it and say so in the sources list; no statement about US law depends on it. A person should click the link once in a browser at publication.
- The natural-language judgment for ko, ja and zh-hant is an AI review, not a native-speaker or lawyer review.

## Image verdict

OK. images/C8.webp shows a person seen from behind on a wooden bench beside a misty river on a cold morning, a plain steel flask next to them, a footpath and a concrete bridge in the distance. No face, no readable text, no logos, no flags, no documents; the figure is not identifiable. The scene is not Taiwan-specific; it reads as someone weighing a decision about the country they came from, which suits a column on what happens to the original nationality. Calm and respectful.
