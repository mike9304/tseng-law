# C1 final review — GPT-6 Sol, 2026-10-14

Verdict: PASS. All four language files are publishable as they stand. No column file was edited in this review.

## Scope and evidence

Read `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C1.md`, all four complete C1 drafts including frontmatter and FAQ, `drafts/C1/facts.md`, and `research/C1-statutes.md`. Read `SENTENCE-VARIETY-RULE.md` including sections 5–6 and skimmed `LESSONS.md`. The referenced `~/agent-library/knowledge/editorial-voice.md` is absent; `brief-EDITORIAL-VOICE.md` contains the full supplied editorial rule and was used. Compared C1's openings with C2–C6 in each language. No C1 judgment is cited, and `research/judgments/` contains no judgment text.

Independently fetched with `curl` all 24 distinct official URLs used by the drafts: 23 single-article pages and the [Leave Rules history](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030006). Every request returned HTTP 200. Also opened the four complete law pages to check amendment headers, and opened [Labor Standards Act article 38](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=38), which the drafts cite although it is absent from the research extract. The official text confirms the Leave Rules' three ceilings, half-wage entitlement and shortfall rule in [article 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=4); the ten-day protection, proof burden and appraisal rule in [article 9-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=9-1); and the hospital, wage-loss, treatment, fourth-day, rate and duration conditions in [Labor Insurance Act articles 33](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050001&flno=33) and [35](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050001&flno=35). The BLI's [hospitalization FAQ](https://www.bli.gov.tw/0017647.html) corroborates the outpatient distinction. The effective-date pairs are 2025-12-09 → 2026-01-01 and 2026-09-30 → 2026-10-01, as stated in [article 12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=12) and the history. The current [marriage-leave article 2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030006&flno=2) says 14 paid days. The four law-page amendment dates in the source lists also match the official headers.

## 1. Law and facts, by language

| Language | Result |
|---|---|
| ko | PASS. The 30-day non-hospital limit, one-year hospital and combined limits over two years, half wages and insurance shortfall, day-four insurance conditions, and 2026 ten-day protection are stated with their qualifications. Monday through Thursday is four hypothetical days. Articles 5, 7, 9, 10, 13, 14, 20, 21, 38, 43, 74 and 79, and the other-leave table, match the cited text. |
| ja | PASS. The same statutory core, including the physician diagnosis, insurance wage base, more-favorable attendance-bonus agreement, employer proof burden, emergency leave request and family-care exception, is retained. Wednesday through Friday is three hypothetical days. The Japanese prose distinguishes Taiwanese statutory terms from explanations and keeps です・ます. |
| en | PASS. The half-wage obligation is expressed as a half-wage level with the employer supplying any insurance shortfall; it does not add the two amounts. Article 10 says the worker personally states the reason and days, without a physical-attendance requirement. Wednesday and Thursday, with a Friday return, are two hypothetical days. The article 13 exception and article 79 fine are conditional and correctly bounded. |
| zh-hant | PASS. The miscarriage/attendance-bonus exception, proportional cut for other ordinary sick leave, article 9-1 exception and proof burden, leave limits, insurance requirements and complaint remedy agree with the official text. Monday through Friday is five hypothetical workdays. Traditional characters and Taiwan usage are consistent. |

Across all four: the article 5 unpaid-leave limit is permissive and at most one year, with no invented automatic dismissal afterward. Menstrual leave is one day per month, its first three annual days are outside sick leave, pay is halved, and article 21's refusal/adverse-treatment ban is retained. Occupational injury leave is kept separate. The marriage, bereavement, personal and official-leave table matches articles 2, 3, 7 and 8. The labor-law fine is NT$20,000–1,000,000 under article 79(1)(3); the separate gender-equality fine is NT$20,000–300,000 under article 38. Article 74's complaint routes, anti-retaliation, void measure, 60-day written handling notice and confidentiality are correctly attributed. The foreign-law notes make no unsourced foreign-law claim. The versions do not conflict on law; their hypothetical day counts deliberately differ by audience.

## 2. Citations

PASS for ko, ja, en and zh-hant. The in-text statutory links use the correct official pcode and article number at the associated claims. Each file's final source section contains all 24 official URLs cited in its body and the 2026-10-13 check date. There is no judgment citation. Each version has three internal links, all within that language, present in `topics/LINKS.md` and accepted by the prescribed lint; none points to another C1–C6 draft.

## 3. Batch rules and frontmatter

PASS for each language. The exact frontmatter fields, `topic: "labor"`, one-language audience, `author: "legal-ai-assistant"`, dates, two or three FAQ entries, H1/title match, `NNN` image placeholder and language-specific source heading meet the brief. The English title requires `seoTitle`; it is present within the 30–45-character limit, and the English summary passes the 150–160-character and prohibited-character checks. Body lengths are ko 3,487 characters, ja 3,909 characters, en 1,565 words and zh-hant 2,700 characters, all within the assigned ranges. No private-party name, bold, telephone or hotline number, street address, messaging ID, lawyer/native-review claim or attorney byline appears. Each version has one soft contact paragraph with its designated firm name and the email only. Hypotheticals are expressly marked.

## 4. Voice and sentence variety

PASS for each language. Titles name the particular leave/pay/protection issue; opening paragraphs deliver substantive information. The first-two-paragraph deletion check found no disposable generic introduction. C1's fact-led opening does not make fact-led openings a majority of C1–C6. The four versions use their own examples and emphasis. ko stays in 합니다체, ja in です・ます, en is plain and active, and zh-hant uses Taiwan terms. Each final substantive paragraph returns to its own hypothetical, without a copied disclaimer or sales line.

Required checker results: ko lint OK, variety 0 FAIL (CV .511; short .144); ja lint OK, variety 0 FAIL (CV .477; short .177); en lint OK, variety 0 FAIL (CV .506; short .228); zh-hant lint OK, variety 0 FAIL (CV .559; short .223). The ko and ja checker warnings report 94% polite endings, consistent with the required registers; neither is a FAIL. Sections 5–6 manual check found more than two very short sentences per file, no stock hypothetical opener, no three paragraphs beginning with the same word, no three consecutive claim–citation–caveat paragraphs, at least one citation-free paragraph, zero counted contrast templates, no invented rebuttal, and no mixed ko/ja register. No MONOTONY rejection applies.

## Issue and edits

Nonblocking internal-record issue — Original → `facts.md`: “fever Tuesday through Thursday, back Friday, four days” → problem & reason → Tuesday through Thursday is three days and disagrees with the published ko hypothetical's Monday through Thursday, four days → fix required for the internal fact sheet, not the publishable draft: change it to Monday through Thursday, four days → facts preserved: the ko draft's hypothetical label, weekday sequence and four-day calculation remain intact. This internal note is not a C1 publication defect.

Minor edits applied: none. No legal fact, number, citation or column wording was changed.

## 5. Image

Image: OK. Viewed `images/C1.webp` with the image viewing tool. The empty chair, blanket, covered hot-water bottle and cup fit recovery from illness. No person or face, text, logo, flag or readable document is visible; the scene is fictional, unidentifiable and respectful.

VERDICT: PASS     (all four languages publishable now, image OK)
