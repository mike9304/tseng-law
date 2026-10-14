# C2 final review — round 2

Verdict: FIX. The four versions are not publishable as supplied. Legal-scope, notice-procedure, deadline-language and citation problems remain. Traditional Chinese also exceeds the mandatory length limit. The requested WebP is missing. No column file was edited.

## Scope checked

- Read the complete batch brief, editorial brief, local COLUMN-VOICE-RULE, topic C2, all four C2 columns including frontmatter/FAQs/sources, facts.md, and research/C2-statutes.md.
- Read SENTENCE-VARIETY-RULE.md, including sections 5–6, and LESSONS.md. Also read /Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md and the complete /Users/son7/Projects/tseng-law-columns-20261013/docs/columns/EDITORIAL-VOICE.md. The shared alias /Users/son7/agent-library/knowledge/editorial-voice.md is absent; the supplied full brief and existing repository copy provided the editorial rules.
- Independently fetched every distinct external URL cited by the four drafts with curl -L --fail: 30 URLs, all successful. These include 25 Company Act single-article pages, the full Act, Registration Regulations Articles 4 and 5, and Annexes 3 and 4. Compared all 25 Act articles and Regulations Article 4 with the research file after whitespace normalization: 26/26 match. Article 5 and the annexes were checked directly. The percent-encoded pcode URLs resolve correctly.
- Additionally fetched the Regulations' full text, the Act's amendment history, and both official English versions. The official names are Company Act and Regulations Governing Company Registration. Law-level amendment dates 2025-12-26 and 2021-04-23 match. The latest Act amendment concerns Articles 387-1 and 449, not every cited article. No unsupported effective-date statement was found.
- Extracted both annex PDFs and visually inspected their first pages, including the cited registration rows. Opened the official registration guide for the application/completion distinction below.
- No judgment is cited, so no judgment text was applicable. No monetary hypothetical calculation requires arithmetic checking. Hypothetical years/locations are expressly fictional.
- Lint checked three existing same-language internal links per version; none points to this batch. Compared available batch openings (C1–C6 in ko/ja/en; C1–C5 in zh-hant), and the openings, headings and endings of the three newest columns by recorded publication date in each local language corpus, numbered 522–524. This is a local-corpus comparison, not certification of live publication order or of the unavailable C6 zh-hant opening.
- Consulted the first review after independently reading the drafts and sources. Latest user instructions appoint Codex as final reviewer; no Fable gate was imposed.
- Raw evidence: /private/tmp/c2-final-astra-r2/, including fetch.json, official pages, extracted/rendered annexes and review-hashes.json.

## 1. Law and facts — required corrections

### L01 — Company form disappears when the rule changes: ko and en

Original: ko line 40, “주주가 여럿이면 이사는 세 명 이상이고”; en line 52, “Several shareholders mean at least three directors”; en line 28, “Three years. That is the maximum for a director or a supervisor.”
→ Problem & reason: limited companies can also have several shareholders. Shareholder count alone does not activate the share-company provisions. [Article 108](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=108) provides the limited-company one-to-three-director rule; [Article 192](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=192) governs companies limited by shares and permits a charter providing for one or two directors without a board. Korean omits the charter condition when mentioning that alternative. The English opening also announces an unqualified director-term ceiling although this column covers both company forms. A later statement that Article 108's list excludes Article 195 does not repair that opening generalization.
→ Fix required: identify 股份有限公司/company limited by shares at the transition and in the English term-limit opening. State the board default and charter alternative accurately.
→ Facts preserved: the distinct company forms, limited-company one-to-three range, share-company board default and charter alternative, maximum three-year terms, re-election and conditional holdover within the supported scope. Not applied.

### L02 — The website alternative does not remove the agenda from the notice: en; clarify ko/ja

Original: en line 62 says the listed matters “go in the notice with their main content, or on a securities-authority or company website if the notice gives the address”; ko line 56 says “그 주소만 통지에 적어도 됩니다”; ja line 58 says “アドレスだけを通知に書いてもよいです”.
→ Problem & reason: [Article 172(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=172) distinguishes listing the matters in the convening reasons from publishing their main content on the permitted website. English makes the website an alternative location for the matters themselves. Korean/Japanese's “only the address” wording should also make clear that only the main-content explanation, not the agenda listing, moves online. The zh-hant version correctly retains “召集事由要列舉” and separately identifies “主要內容”.
→ Fix required: retain the matters in the notice; allow their main content on the specified website, with its URL in the notice. Eliminate a URL-only-notice reading.
→ Facts preserved: all listed matters, the main-content requirement, website alternative and prohibition on extempore motions. Not applied.

### L03 — Korean overstates the notice-fine trigger

Original: ko line 58, “이 통지 규칙을 어기면, 대표이사에게 1만 이상 5만 이하 대만달러 과태료입니다.”
→ Problem & reason: the preceding discussion includes paragraph 4's notice-content/electronic-consent rule. [Article 172(6)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=172) attaches this fine to paragraphs 1–3 or 5, not every preceding notice rule. The other three versions now give the correct enumeration.
→ Fix required: expressly identify paragraphs 1–3 or 5.
→ Facts preserved: NT$10,000–50,000; the separate NT$240,000–2,400,000 public-company range; the representative director and securities regulator. Not applied.

### L04 — English assigns the exception deadline to the election instead of the first board meeting

Original: en line 94, “An election before the old term ends, with a resolution to leave when it ends, is called within 15 days after that term”.
→ Problem & reason: the grammatical subject is “An election,” so the sentence schedules that election after the term despite its early-election premise. [Article 203(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=203) shifts the deadline for the first board meeting when the directors were elected before expiry and the requisite resolution provides for discharge at expiry.
→ Fix required: make “the first board meeting” the subject of the exception sentence and identify whose term/discharge the resolution concerns. Also replace “the director whose ballots ...” with a clear reference to the director who received votes representing the greatest number of election voting rights.
→ Facts preserved: both 15-day periods, the early-election and discharge-resolution conditions, designated convener, and majority-of-elected-directors fallback. Not applied.

### L05 — Application deadline becomes completed registration: zh-hant; align translations

Original: zh-hant line 94, “未於申請期限內辦妥登記的”; en line 92, “does not register within the application period”; ko line 94, “그 기한 안에 등기하지 않으면”; ja line 88, “その期限までに登記をしなければ”.
→ Problem & reason: “辦妥” expressly suggests completed registration. [Regulations Article 4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080020&flno=4) requires an application within 15 days of the change. [Act Article 387(4)–(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=387) refers to compliance with the prescribed application period. The [official registration guide](https://gcis.nat.gov.tw/mainNew/subclassNAction.do?method=getFile&pk=3), opened with curl, likewise describes submitting the application within 15 days. Do not imply that an applicant incurs the penalty merely because the authority has not finished processing a timely application.
→ Fix required: remove the completion implication in zh-hant and make the application obligation unambiguous in the translations. Retain the distinction between late application and failure to undertake the required registration application, followed by correction orders and missed correction deadlines.
→ Facts preserved: 15 days after the change, approved-specific-date exception, initial NT$10,000–50,000, and repeated NT$20,000–100,000 following the unfulfilled correction deadline. Not applied.

### L06 — Summaries lose the six-month deadline's express exception: ko, ja, zh-hant

Original: frontmatter line 4, ko “회계연도 종료 후 6개월 안에 정기주주총회를 엽니다”; ja “会計年度終了後六か月以内に株主常会を開きます”; zh-hant “在會計年度終了後六個月內召開股東常會”.
→ Problem & reason: these are unqualified deadline statements. [Article 170(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=170) permits an authority-approved exception for good cause. The body/FAQ retain it, but the editorial rules also prohibit summaries from making broader assertions.
→ Fix required: preserve that qualification in the summary or summarize the topic without an absolute deadline claim.
→ Facts preserved: the six-month default, relevant company form and authority-approved exception. Not applied.

### L07 — Annex row loses the representative's director/supervisor role: all languages

Original: ko line 92 “법인 주주 대표자의 변경”; ja line 86 “法人株主による代表者の改派”; en line 90 “a corporate shareholder's replacement of its representative”; zh-hant line 92 “法人股東改派代表人”.
→ Problem & reason: [Annex 4](https://law.moj.gov.tw/LawClass/LawGetFile.ashx?FileId=0000232339&lan=C), row 10, specifies “法人股東改派代表人為董監事”. This is a representative serving as director or supervisor, not every unspecified parent-company representative.
→ Fix required: retain that registered role in each language.
→ Facts preserved: corporate-shareholder relationship, director/supervisor role, surrounding re-election/by-election/removal categories and application deadline. Not applied.

### Confirmed corrections and otherwise supported core

The public Article 230 fine now correctly cites paragraph 4. English now retains Article 108's candidate qualification, imposes public-company fines on the representative director, and uses Article 174's “unless the Act provides otherwise.” Articles 210/387 now retain correction orders and the deadline before escalated/repeated fines, subject to L05. Articles 183/230's public-announcement alternatives and Article 210's securities-authority qualification are present. The minutes-fine references include paragraph 5. The authority-ordered-election condition for automatic discharge has been restored. Japanese distinguishes a recommended sole-director record from a statutory board-minute duty.

The numerical core was checked: annual meeting at least once a year, six-month default, 20/30-day annual-meeting notice, Article 174's distinct attendance/vote denominators, 30-day supervisory review, 10% reserve and its distinct paid-in/total-capital thresholds, three-year terms, holdover, 20-day post-meeting minutes distribution, lifetime retention during company existence, at least one year for attendance/proxy records with the Article 189 litigation extension, and the two 15-day rules. Fine ranges under Articles 20, 112, 170, 172, 183, 210, 230, 237 and 387 match. The remaining scope/trigger/wording defects above still preclude approval.

## 2. Citations

### C01 — Missing adjacent sources and an incorrect paragraph reference

Original: ja line 36 and en line 38 end the CPA-audit claim with unlinked “第20条第2項” / “Article 20, paragraph 2”; ko line 44 and ja line 40 state Article 20 still applies without linking it there; zh-hant line 26 gives the limited-company six-month deadline without Article 110; en line 28 adds holdover after the linked paragraph-1 term limit; ja line 26 cites Articles 195(2)/217(2) after also asserting the paragraph-1 ceiling.
→ Problem & reason: hard rule 2 requires an official inline link at the claim; an internal related article or a distant source is insufficient. Paragraph 2 does not establish the three-year ceiling.
→ Fix required: attach Article 20(2), Article 110(2), and the appropriate Article 195/217 paragraphs to their claims; include paragraph 1 for the Japanese ceiling.
→ Facts preserved: the current supported assertions, conditions and correct official URL targets. Not applied.

Original: ko line 44, ja line 40, en line 42 and zh-hant line 48 describe dated board approval and the six-month exemption, while their nearby Article 170 link supplies the ordinary rule, not the exemption; the Article 128-1/207/183 basis is elsewhere.
→ Problem & reason: the exemption and minute/date duty need their supporting provisions at this separate legal-claim paragraph.
→ Fix required: cite Article 128-1 for the exemption and Articles 207/183 for minutes/dates, consolidating prose if needed.
→ Facts preserved: annual approval remains; the ordinary meeting deadline does not apply to the Article 128-1 company; preserve the one-director distinction. Not applied.

Sources sections otherwise include the cited statutes/annexes and the 2026-10-13 check date in each page language. Article URL destinations are correct. All internal links exist according to lint; no judgment-link issue arises.

## 3. Hard rules and format

### F01 — Traditional Chinese fails the length gate

Original: the complete zh-hant body.
→ Problem & reason: required lint returns “body length 3080 chars (no spaces/URLs); target 1800-2700”, exit 1: 380 characters over the maximum.
→ Fix required: revise to 1,800–2,700 under the actual lint. Remove repetition/unnecessary expansion while preserving mandatory scope, conditions, citations and hypothetical labels.
→ Facts preserved: all required legal facts must survive the cut. Not applied; this requires substantive revision.

Frontmatter otherwise has the required keys/dates/category/audience/topic, literal NNN image path, three FAQs, matching H1, and author legal-ai-assistant. English title is 67 characters, SEO title 45, summary 160: format gates pass. Eight-minute read-time labels are not an identified blocking defect.

No bold, phone/hotline, messaging ID, street address, private-party name, invented professional experience, lawyer-review or native-review claim was found. One permitted firm/email contact appears per version. Hypotheticals are labeled. Foreign-law notes now request a local check rather than asserting foreign rules; no foreign deadline/court practice is claimed. Excluded video-meeting, annual-filing and tax-return-deadline topics are not developed; CPA thresholds are linked rather than restated.

### F02 — Internal fact sheet is stale

Original: facts.md still attributes the Article 230 fine to paragraph 3 and says several website/announcement alternatives were not written, although they now appear.
→ Problem & reason: it no longer describes the current drafts, and its paragraph number is wrong. This is an internal evidence defect, not a new public-text error after the public citation was corrected.
→ Fix required: update the claim map against the final text and official paragraphs.
→ Facts preserved: official text, conditions and sources. Not applied.

## 4. Voice and manual sentence-variety review

Passing numerical metrics does not establish natural prose. The cumulative remaining language problems require a coordinated edit alongside the legal corrections.

### V01 — Korean drops necessary subjects and nouns

Original: line 68 “납입자본액에 이르면 더는 없습니다”, “유한회사는 결손과 세금 뒤 ... 자본총액이면 의무가 없습니다”; line 86 “회사채 존근부”; line 102 “타이중의 매년 승인은 대만 회사법입니다”.
→ Problem & reason: “no more” omits the obligation; the reserve/loss-covering/tax-payment subjects have been compressed away; the record name is unexplained; approval is not itself a statute.
→ Fix required: state that the legal-reserve appropriation obligation no longer applies when the reserve reaches the specified capital amount; keep the loss/tax/distribution conditions. Explain the company-bond register in ordinary Korean. Say that the annual approval is governed by Taiwan's Company Act.
→ Facts preserved: 10%, the distinct capital thresholds, all conditions, required records and Taiwan-law scope. Not applied.

### V02 — English remains compressed legal notes

Original: “Lateness by the representing director draws NT$10,000 to NT$50,000”; “With several directors and a charter chairman, a majority elects the representative”; “No extempore motion”; “Leaving them unkept costs the representing director”; “keep a form-matched yearly approval”.
→ Problem & reason: unnatural combinations obscure the actor, duty or consequence. Short-sentence metrics do not justify fragments.
→ Fix required: use complete ordinary sentences identifying the director representing the company, a chairman provided for in the articles of incorporation, failure to keep the specified records, and approval by the body appropriate to the company form. Repair L04 simultaneously.
→ Facts preserved: liable persons, voting thresholds, fines, exceptions and links. Not applied.

### V03 — Japanese has literal transfers and an unclear hypothetical conclusion

Original: line 82 “記載、会議のあと二十日以内の配布、存続中の保存が移ります”; line 96 “毎年の決算承認は、第20条の書類のまま残っています”; line 94 repeats “董事は一人”.
→ Problem & reason: duties do not naturally “move” here; approval remaining “as the Article 20 documents” does not explain what was omitted. The hypothetical should expressly establish any omitted annual approval rather than leave that conclusion unexplained. The repeated director count adds no condition.
→ Fix required: explain application with necessary adaptations in natural です・ます prose; distinguish the required approval from its record; clarify the hypothetical omission if intended, retaining its fictional status; consolidate the director count with the charter assumption.
→ Facts preserved: annual approval, one-director charter structure, inapplicable board provisions, recommended-record status and hypothetical label. Not applied.

### V04 — Traditional Chinese omits referents and a deadline anchor

Original: line 68 “三十日前”; line 82 “準用清單沒有第195條”; line 92 “變更後十五日內申請”; line 100 “每年的承認還空著”.
→ Problem & reason: these resemble drafting notes. The 30 days need the annual-meeting anchor; the list concerns 有限公司 directors; the application concerns registration; “approval is blank” is an unnatural account of an omitted corporate act.
→ Fix required: name 股東常會, 有限公司董事, 變更登記 and the omitted 決算承認 in concise Taiwan prose.
→ Facts preserved: relevant events, periods, company forms, approval obligation and links. Not applied.

### V05 — Reconcile the records; do not invent a same-figures rule

Original: ko line 70 “결산·배당·신고는 같은 해 숫자입니다”; ja line 70 “同じ年の数字で揃え”; en line 74 “Accounts, the dividend, and the tax return use one year's figures”; zh-hant line 74 “決算、股利、申報用同一年度數字”.
→ Problem & reason: the brief requests consistency between accounts, distribution decisions and filings. The cited provisions do not establish a broader requirement that the documents contain identical figures or only one year's amounts. The compression makes a practical recommendation sound like an accounting/tax rule.
→ Fix required: recommend reconciling the relevant accounts, distribution decision and tax filings, retaining the internal calendar link without adding an unsupported tax rule.
→ Facts preserved: the consistency recommendation and separate corporate/tax procedures; no new deadline or threshold. Not applied.

### Section 5–6 self-check

- First-two-paragraph deletion test: Korean's question supplies the sole-parent issue, the next sentence identifies the form distinction, and Article 20 adds the documents/sanction. Japanese's opening provides term/holdover facts before the approval discussion, and its next paragraph adds the annual documents. English's “Three years” supplies a number but the next paragraph abruptly shifts to “The form decides who approves”; make the scoped transition intelligible under L01. Traditional Chinese supplies distinct form/deadline rules followed by the annual documents; preserve these while fixing Article 110 sourcing. No legal fact was deleted for rhythm.
- No stock hypothetical opener. Available batch openings and the recent local columns did not establish prohibited opening-type dominance; the completed six-column zh-hant distribution cannot be certified without C6.
- Every language has at least two genuinely short sentences beyond citation fragments. No three paragraphs beginning with the same lexical word, nor three consecutive claim–statute–caveat paragraphs, were identified. Each contains an uncited question/hypothetical paragraph.
- Contrast templates remain within the limit. The invented Japanese HR-memo rebuttal from round 1 is gone. Endings return to tenure/approval/records rather than copied disclaimers or sales appeals. Korean keeps 합니다체 and Japanese です・ます outside headings.
- No standalone MONOTONY FAIL: every checker has zero FAILs, and two unmet manual threshold items were not established in a language. Dense statutory prose and the native-language defects above still require correction, independently of that numerical threshold. No fact, number, citation or fictional label was lost through reviewer edits because no draft was edited.

## 5. Image

Image verdict: REDO for the requested publication asset. The exact images/C2.webp is absent; the image tool returned “No such file or directory.” This is a missing file, not an inability of the reviewer to view images.

Original: requested C2.webp absent → problem & reason: no exact publication-asset inspection is possible → fix required: deliver the intended WebP and verify that its content matches the inspected candidate → facts preserved: no new scene is required. No image conversion/edit applied.

The available images/C2.jpg was opened with the image viewing tool. Candidate visual-content verdict: OK. Blank cloth-bound ledgers, an unmarked seal and a closed ink pad on a plain shelf fit corporate records/minutes. The image is respectful and unidentifiable, with no people/faces, text, logos, flags or readable documents. Candidate inspection does not approve the missing WebP.

## Checks, applied edits and fingerprints

Commands independently run for each language:

    python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C2/<lang>.md <lang> taiwan-subsidiary-annual-shareholders-meeting-director-term
    python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C2/<lang>.md

| Language | Lint | Body length | Variety | CV | Short ratio | Run3 | Citation-end ratio |
|---|---|---:|---|---:|---:|---:|---:|
| ko | OK, exit 0 | 3,497 characters | OK, exit 0; 0 FAIL | 0.459 | 0.130 | 0.051 | 0.340 |
| ja | OK, exit 0 | 4,458 characters | OK, exit 0; 0 FAIL | 0.473 | 0.168 | 0.036 | 0.292 |
| en | OK, exit 0 | 1,600 words | OK, exit 0; 0 FAIL | 0.661 | 0.359 | 0.035 | 0.162 |
| zh-hant | FAIL, exit 1: length | 3,080 characters | OK, exit 0; 0 FAIL | 0.516 | 0.194 | 0.085 | 0.352 |

Minor edits applied: none. Major legal/citation corrections were left to the writer as instructed. The wording suggestions are required, not represented as applied edits. Rerun both gates after revision; ko/ja/en have almost no length headroom. Remove repetition, not legal qualifications.

Reviewed SHA-256:

    ko.md      6ab8b195764312285fe9610012c5add82f0c5185fca988cb1a1cdd4a92aa8f70
    ja.md      b09f2f3360d6d09545c0dde8002ed80270f9bb7ad513a7d8a95732d349fe9959
    en.md      dca49356b2235052bf14f51cef4eed1bf1574d41140c88720fee914bfed260a5
    zh-hant.md 9737e02fda7d5d7b90ec8b87dcca99a9635217945066074d81557d53f156aa03
    facts.md   90a79d63541c94e34620f7c514081244144815adc667cd08f4fac401353fae23
    C2.jpg     fddb824ee3bf27c97d93c34df94b237d6680372f4408570f625d6439ad353d5c

VERDICT: FIX      (major issues remain; listed in the log)
