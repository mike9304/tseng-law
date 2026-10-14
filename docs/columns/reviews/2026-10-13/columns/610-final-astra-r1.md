# C2 final review, round 1

Verdict: FIX. The four versions are not publishable as supplied. The statutory paragraph error, legal translation errors, missing procedural qualifications, and citation gaps below require author corrections. No column file was edited by this reviewer.

## Scope and evidence

- Reviewed the complete frontmatter, FAQs, titles, body and sources of `drafts/C2/ko.md`, `ja.md`, `en.md`, and `zh-hant.md`, and the complete `facts.md`. The fact sheet was treated as a set of claims, not evidence.
- Read `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C2.md`, `research/C2-statutes.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, and `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`; read the recurring lessons in `LESSONS.md`.
- The requested shared path `/Users/son7/agent-library/knowledge/editorial-voice.md` does not exist on this machine. Read the complete supplied editorial brief and the existing `/Users/son7/Projects/tseng-law-columns-20261013/docs/columns/EDITORIAL-VOICE.md` instead. This missing alias did not prevent review.
- Independently fetched all 30 distinct official URLs linked in the English column with `curl -L --fail`, including all 25 Company Act articles, the full Act, Registration Regulations Articles 4 and 5, and Annexes 3 and 4. All fetched successfully. The other versions use the same official sources. The percent-encoded `J00%380001` and `J00%380020` links resolve to the correct statutes; the encoding itself is not a citation defect.
- Compared all 25 Company Act article texts and Registration Regulations Article 4 against the supplied research: the texts match after whitespace normalization. Opened Article 5 independently. Extracted both annex PDFs and visually inspected the first page of each, including the cited registration rows. Also fetched the Regulations' full text and the Company's Act amendment history. Official pages confirm the law-level amendment dates 2025-12-26 and 2021-04-23. The 2025 amendment concerns Articles 387-1 and 449; the column does not claim that all its cited articles changed that day.
- No judgment is cited in any version; no judgment-text review was necessary. No calculation with hypothetical money amounts appears. The numerical fine ranges themselves match the sources; some triggers, liable persons and paragraph numbers do not.
- Compared available C1–C5 openings in all four languages and the openings, subheads and endings of the three newest locally available same-language columns, numbered 522–524. C6 was not present, so the completed six-column batch's opening distribution cannot be certified here.
- Latest user instructions appoint Codex as final reviewer; no Fable approval gate was imposed.
- Raw fetches, extracted text and rendered annex pages are in `/private/tmp/c2-final-astra-r1/`. This includes `fetch.json` with the URLs and successful curl results.

## 1. Law and facts: required corrections

### M01 — All languages: Article 230 fine is in paragraph 4, not paragraph 3

Original: ko line 62 `제1항·제3항`; ja line 66 `第1項・第3項`; en line 68 `paragraphs 1 and 3`; zh-hant line 68 `第1項、第3項`, each attached to the statement that failure to distribute the approved material attracts NT$10,000–50,000. → Problem & reason: [Article 230](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=230) has four paragraphs. Paragraph 3 concerns creditors' rights to obtain/copy the material; paragraph 4 contains this fine. The writer's fact sheet repeats the wrong paragraph number. → Fix required: cite paragraphs 1 and 4 for the obligation and fine, and correct the fact sheet when revising. → Facts preserved: keep the fine range, the representative director as the liable person, and the obligation to distribute the financial statements and surplus-distribution/loss-appropriation resolution. Not applied because it changes a legal citation.

### M02 — English: Article 108's candidate qualification became a voter qualification

Original: en line 46, `Shareholders with capacity elect them by consent of at least two-thirds of the voting rights.` → Problem & reason: [Article 108(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=108) requires selection from shareholders with legal capacity, with approval representing at least two-thirds of shareholder voting rights. The draft attaches capacity to the electors and omits that the director must be selected from the qualifying shareholders. The other three languages retain that distinction. → Fix required: say that one to three directors are selected from shareholders with legal capacity, with the required two-thirds approval. → Facts preserved: retain the one-to-three limit, candidate status/capacity, voting-rights denominator, and separate rule for selecting a chairman. Not applied.

### M03 — English: public-company fines are wrongly imposed on the company

Original: en line 64, `Public companies are fined by the securities authority`; line 90, `and a public company NT$240,000 to NT$2,400,000`. → Problem & reason: both [Article 172(6)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=172) and [Article 210(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=210) impose the higher fine on the director representing the publicly issuing company, not on the company itself. The corresponding abbreviated sentences in ko/ja/zh-hant should also name that person explicitly rather than rely on the preceding clause. → Fix required: distinguish the regulator and company category from the person fined. → Facts preserved: NT$10,000–50,000 for the ordinary case and NT$240,000–2,400,000 for the publicly issuing company case; preserve the specific violation and regulator. Not applied.

### M04 — All languages: repeat fines lose the correction-order deadline

Original: ko line 84 `고칠 때까지 횟수마다 다시 부과합니다`; ja line 88 `直すまで、回数ごとに再び科します`; en line 90 `Each round repeats until the failure is corrected`; zh-hant line 90 `未改正則按次再罰至改正`. → Problem & reason: [Article 210(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=210) requires an order to correct within a specified period; repeated penalties follow failure to correct by that deadline, with further correction orders. None of these sentences retains that procedural condition. → Fix required: restore the correction order and failure by its deadline before describing repeated penalties. → Facts preserved: keep the relevant fine bands, liable representative director, and repetition until correction. Not applied.

Original: en line 94 `An order to correct comes with the same fine. Each later round, until corrected, is NT$20,000 to NT$100,000. Paragraph 5.`; corresponding ko line 88, ja line 92 and zh-hant line 94 also abbreviate the escalation condition. → Problem & reason: [Article 387(4)–(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=387) distinguishes a late application from failure to carry out registration within the required application period. Paragraph 5's escalated repeat fines follow noncompliance with the authority's correction deadline, not simply every later occasion. English does not state the non-registration condition at all. → Fix required: distinguish the two situations and retain the correction deadline for escalation in each language. → Facts preserved: original NT$10,000–50,000, escalated NT$20,000–100,000, and the responsible person representing the company. Not applied.

### M05 — All languages: absolute procedural statements omit express alternatives

Original: ko line 56 `통지에 주요 내용을 적습니다`; ja line 60 `主な内容を通知に書く事項`; en line 62 `must show its main content in the notice`; zh-hant line 62 `主要內容列入召集事由`. → Problem & reason: [Article 172(5)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=172) also permits the main content on a securities-authority or company-designated website, with its URL stated in the notice. The draft presents only direct inclusion as mandatory. → Fix required: retain the matters that must be listed, their main-content requirement and the prohibition on extempore motions, while adding the expressly permitted website method. → Facts preserved: all listed matters and the prohibition remain; the permitted procedure is restored. Not applied.

Original: all versions' Article 230 paragraphs require distribution to shareholders and immediately penalize non-distribution; all Article 183 paragraphs likewise say minutes are sent to shareholders within 20 days. → Problem & reason: [Article 230(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=230) and [Article 183(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=183) allow public companies to use public announcement. This column expressly discusses public companies elsewhere and never limits these unqualified instructions to non-public companies. → Fix required: state the announcement alternative, or expressly limit the relevant procedural description to non-public companies. Also make the minutes deadline's starting point explicit: within 20 days after the meeting. → Facts preserved: the obligation to provide the material, the 20-day period, document contents and retention obligations remain. Not applied.

Original: ko line 84 `정관, 주주총회 의사록, 재무제표는 회사에 둡니다`; ja line 88 `章程、過去の株主会議事録、財務諸表は会社に置きます`; en line 90 `Charters, past shareholders' meeting minutes, and financial statements stay at the company`; zh-hant line 90 `章程、歷屆股東會議事錄、財務報表放在公司`. → Problem & reason: [Article 210(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=210) begins with the exception for separate securities-authority provisions. The draft omits it while stating public-company penalties. → Fix required: preserve that qualification or explicitly narrow this statement's scope. → Facts preserved: the default company/transfer-agent locations and the distinctions among the records remain. Not applied.

### M06 — Japanese, English and Traditional Chinese: the minutes fine omits proxy retention

Original: ja line 84 `第1項、第4項または出席簿の保存に反すると`; en line 86 `Breaching paragraph 1, paragraph 4, or the attendance-book rule`; zh-hant line 86 `違反第1項、第4項或出席簿保存的`. → Problem & reason: [Article 183(6)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=183) incorporates all of paragraph 5, including both the attendance signature book and proxy authorizations. The enumeration narrows the penalty to the attendance-book portion. → Fix required: identify paragraphs 1, 4 and 5, or expressly mention both attendance and proxy records. → Facts preserved: NT$10,000–50,000, at least one year's retention, the Article 189 litigation extension, and the liable director. Not applied. Korean's broader sentence does not have this particular narrowing.

### M07 — Korean: approval of a cover page is not approval of the statutory accounts

Original: ko FAQ 3, line 19, `주주총회 결의로 표지가 승인되면`; body line 64, `표지를 주주총회가 승인하면`. → Problem & reason: `표지` means a cover page. [Article 231](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=231) concerns `各項表冊`, the relevant statements/reports. The fact sheet explicitly equates these terms, so this is not safely treated as a harmless isolated typo: it changes the object whose approval produces the legal effect. → Fix required: use an accurate Korean reference to the statutory 결산 서류/각종 보고서와 재무제표, consistent with the preceding Article 228 explanation, in both body and FAQ. → Facts preserved: the company's deemed release, the unlawful-act exception, and Article 110(3)'s application to limited companies must remain. Not applied.

### M08 — Korean, Japanese and English: first-board convener needs votes received in the election

Original: ko line 90 `대표하는 의결권이 가장 많은 이사`; ja line 94 `代表する議決権が最も多い董事`; en line 96 `the director whose votes represent the most voting rights`. → Problem & reason: [Article 203(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=203) identifies the director whose received election ballots represent the greatest number of election voting rights. The draft omits receipt of votes and can identify the director with the largest own/represented voting stake instead. Traditional Chinese retains `得票` and is materially clearer. → Fix required: explicitly say votes received in the director election. → Facts preserved: retain the 15-day period, the early-election/old-term-expiry exception, and the majority-of-elected-directors fallback. Not applied.

### M09 — Automatic discharge: election and taking office are different events

Original: ja summary, line 4, `主管機関が定めた期限までに後任が就かなければ`; concluding paragraphs in all four languages use `후임을 세우지 못한` / `後任を置けなかった` / `A director with no successor` / `沒有後任`. → Problem & reason: [Article 195(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=195) and [Article 217(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=217) distinguish continued service until the elected replacement takes office from automatic discharge when an authority-ordered election has still not occurred by the authority's deadline. Japanese's summary substitutes failure to take office for failure to re-elect, and the conclusions blur the distinction again. → Fix required: use the exact ordered-election-and-missed-deadline condition throughout, especially in the Japanese summary and every closing. Do not imply that lack of a successor by itself triggers the sanction. → Facts preserved: maximum three-year terms, re-election, holdover until the newly elected director/supervisor takes office, discretionary authority order, and automatic discharge if the ordered election is not held by the deadline. Not applied.

### M10 — Japanese: the one-director example and its conclusion need consistent legal scope

Original: ja line 98 says the one-director company's subsequent minutes are outside Article 207; line 100 then stresses the subsidiary's `設立後の議事録の空白`, and line 104 tells the reader that the records to leave are `日付のある議事録`. → Problem & reason: the hypothetical deliberately uses a charter structure to which the board provisions do not apply under [Article 128-1(2)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=128-1). The ending nevertheless treats missing board minutes as the central deficiency, without distinguishing a recommended dated record of the sole director's approval from a statutory board-minute duty under Article 207. The annual-approval duty remains, but the record's legal status must not change midway through the example. → Fix required: state the charter assumptions, explain the outstanding annual approval, and label any recommended dated sole-director record as a recommendation; alternatively use a properly specified two-director hypothetical if the intended illustration is missing board minutes. → Facts preserved: annual approval under Article 20 and the one-director exemption from board provisions; retain the explicit hypothetical label and any retained year/location. Not applied.

### M11 — English: record and resolution qualifications are translated too narrowly

Original: en line 90 `the bond stubs`. → Problem & reason: [Article 210(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=210) specifies the `公司債存根簿`, a company-bond counterfoil record/book, not simply loose stubs. → Fix required: use a clear term for the register/book. → Facts preserved: the identity of the required corporate record and the company/transfer-agent location alternatives. Not applied.

Original: en line 66 `where the Act sets no higher bar`. → Problem & reason: [Article 174](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=174) says unless the Act otherwise provides; it does not restrict its exception to higher thresholds. Article 175, inspected in the official full Act, illustrates a different procedure with a lower attendance threshold. → Fix required: use `unless the Act provides otherwise`; no need to expand this column into Article 175. → Facts preserved: more than half of issued shares represented and approval by more than half of the voting rights represented at the meeting under the default rule. Not applied.

### M12 — All languages: foreign-law assertion lacks the required sourcing or professional-check formulation

Original: ko line 96 `한국 상법, 일본 회사법, 미국 각 주의 회사법은 총회 일정을 따로 둡니다`; ja line 100, en line 102 and zh-hant line 102 make the same claim. → Problem & reason: no Korean, Japanese or US official source is linked or listed. The batch permits a short sourced general note, or a note framed as checking with a local professional; a categorical claim about what those laws prescribe does not meet that rule merely by being short. → Fix required: cite and verify the relevant official sources, or replace this with the permitted jurisdiction-specific professional-check formulation. Keep the Taiwan approval obligations distinct from the parent's calendar. → Facts preserved: no foreign deadline, legal conclusion or court-practice assertion may be invented; the Taiwan corporate-law analysis remains. Not applied.

## 2. Citations and source completeness

### C01 — All languages: links are not consistently adjacent to the legal claim

Original: ja line 26 states the discharge rule without a link; en lines 26–28 state the term/holdover rules without links; zh-hant line 26 states the six-month and sole-shareholder rules without links. Separate fine paragraphs also have only `(제3항)` / `（第3項）` / `Paragraph 3.` rather than an adjacent official link: ko line 52, ja line 56, en line 58, zh-hant line 58. The notice-content and notice-fine paragraphs likewise rely on a link in an earlier paragraph. English line 82 names Articles 108 and 195 without an inline link. → Problem & reason: the hard rule requires official inline links right after the claim. A distant earlier/later link or the final source list does not fulfill this placement requirement. → Fix required: add the relevant official article links at each separate legal-claim paragraph, or consolidate each claim with its existing link without dropping conditions. Correct M01 at the same time. Review the whole body for this pattern, rather than fixing just these examples. → Facts preserved: all current facts, numbers and valid source destinations; maintain the source list. Not applied because citation changes were outside the permitted minor wording edits.

The final sources sections otherwise list all Taiwan statutes and both annexes used and show the check date 2026-10-13 in each language. Three related internal links appear in each version; lint verified their existence in the corresponding language. None points to this batch. No cited judgment or unverified case number is present. The missing foreign-law sources are M12.

## 3. Format, authorship and other hard rules

All four files passed the supplied lint. Frontmatter keys, dates, topic `company`, category, audience, literal `NNN` image path, author `legal-ai-assistant`, three FAQs, and matching H1s are present. English title length is 67 characters, requiring a separate SEO title; its SEO title is 45 characters and its summary is 160 characters, both within the brief.

No bold, phone/hotline, messaging ID, street address, private-party name, lawyer-review claim, native-review claim or invented professional first-person experience appears. The sole contact is the permitted firm name and email. Each final illustrative scenario is expressly hypothetical. The unsupported Japanese opening anecdote is separately identified below. The excluded topics—video meetings, Article 22-1 annual filing, and tax-return deadlines—are not developed. The CPA threshold is linked rather than restated. The hypothetical years are not presented as dates on which the statutes became effective.

## 4. Native voice and manual sentence-variety review

The numerical variety checker passed in every language. This does not certify native prose: several passages read as compressed statute notes rather than an edited column.

### V01 — Japanese opening invents a real-world memo to rebut

Original: ja line 26, `董事の任期が三年を過ぎれば翌日から退任扱いになる、と駐在員向けの人事メモに書かれている場合があります。` → Problem & reason: no source supports the asserted existence of such HR memos, and it is not marked hypothetical. It supplies an invented proposition for the article to refute. → Fix required: begin directly with the conditional holdover rule and its source, or clearly label any retained illustration hypothetical. → Facts preserved: preserve the three-year term, the missed-election condition and the authority's deadline; do not replace the memo with an invented client story. Not applied.

MONOTONY: unsupported rebuttal, self-check item 6 — `駐在員向けの人事メモに書かれている場合があります` — remove the invented opposing claim and state the actual conditional rule. This is one unmet manual item, not a claim that the automatic checker failed or that the two-item monotony threshold was reached.

### V02 — English prose needs a substantive native-language edit

Original: `Lateness by the representing director draws NT$10,000 to NT$50,000. Paragraph 3.`; `Extempore motions cannot carry them. Paragraph 5.`; `Board minutes take Article 183 by quasi-application`; `The record ... come along`; `An unlawful act is left in place.` → Problem & reason: detached paragraph-number fragments, literal translations and vague subjects obscure who must act and what legal consequence follows. `An unlawful act is left in place` is especially poor wording for the exception to discharge from liability. → Fix required: express each obligation and exception in ordinary complete English, attach the article/paragraph reference to the relevant sentence, and use a clear phrase for the provisions applying with necessary adaptations. → Facts preserved: all amounts, recipients, conditions, exceptions and source links; short-sentence metrics must not be achieved by orphaned citation fragments. Not applied; the needed edit overlaps the substantive legal corrections above.

### V03 — Traditional Chinese and Japanese are over-compressed; Korean has similar sentence fragments

Original: zh-hant `罰鍰核至2026年10月13日`, `另無規定時`, `代表董事處1萬元以上5萬元以下`, `負責人罰鍰同一區間`; ja `その負責人にも、同じ幅の過料があります`, `株式は本社だけ`, `董事個人の義務は…で見ます`; ko `어기면 대표 이사에게 1만 대만달러 이상 5만 대만달러 이하입니다`. → Problem & reason: the Chinese reads like compressed legal notes; Japanese expressions are literal or incomplete; the Korean penalty sentence omits the noun identifying the sanction. The monetary figures should not replace the predicate. → Fix required: restore natural subjects and verbs and identify the sanction as a fine/administrative fine in the target language. For example, Chinese can say the responsible director `可被處以…罰鍰` only if that choice of modal matches the statutory statement; do not soften a mandatory rule merely to improve flow. → Facts preserved: retain legal force, liable persons, fine ranges, dates and links. Not applied.

### V04 — Repetition adds no explanation; reserve wording needs precision when edited

Original: ko `의사록은 설립 때 한 장입니다` followed by `설립 뒤에 의사록이 없습니다`; zh-hant `議事錄停在設立日` followed by `設立後沒有議事錄`; en `The minute book stops at incorporation` followed by `Nothing after incorporation was minuted`; ja repeats `期限は六か月です` immediately after stating that deadline and its exception. → Problem & reason: the second sentence merely repeats information, sometimes attaching a statute to a hypothetical fact. → Fix required: remove the repetition or use the space to explain the outstanding annual approval/record obligation, without implying that a statute proves the invented scenario. → Facts preserved: hypothetical labels, facts of the retained scenarios, annual approval obligations, six-month rule and its exception. Not applied.

Original: ko `납입자본액에 이르면 멈춥니다`; ja `実収資本額に達すると止まります`; zh-hant `達到實收資本額即停`. → Problem & reason: [Article 237(1)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=237) removes the statutory requirement once the legal reserve reaches paid-in capital; these compressed formulations can sound like an instruction to stop rather than an exemption from a duty. The limited-company sentence in each version should also expressly keep the `when distributing profits` trigger of Article 112. → Fix required: describe when the statutory 10% appropriation is required and when it is no longer required, preserving the distinction between paid-in capital under Article 237 and total capital under Article 112. → Facts preserved: the 10%, tax/loss conditions, capital thresholds and fine ranges. Not applied. I did not reject the English `distributed profits` basis as inherently unlawful: the [official MOEA FAQ](https://serv.gcis.nat.gov.tw/crm/faqAction.do?id=714&method=faqDetl), opened with curl, recognizes both after-tax-profit and actual-distribution bases, applied consistently. A rewrite must not invent a single exclusive basis.

### First-two-paragraph deletion check and manual items 5–6

- ko: the opening question introduces the sole-parent issue; the second sentence provides the form-dependent distinction. The next paragraph adds the annual documents and sanction. Removing these would remove relevant scope/facts. No stock hypothetical opener.
- ja: the invented HR memo can be removed without loss of any verified fact; replace it as V01. The following statutory paragraph adds the Article 20 documents and approval requirement. The remaining opening legal statements need the conditions and link identified above.
- en: `Three years` supplies a number, but the next paragraph changes abruptly from terms to account approval. The term-limit sentence adds information; `does not leave office the next day` needs the no-reelection context. The summary's `a three-year term does not end the next day` should distinguish expiry of the term from continued exercise of duties. These are editorial/legal-clarity corrections, not a lifetime three-year service cap.
- zh-hant: the opening supplies the company-form distinctions and deadlines; deletion would remove those facts. It needs the appropriate links and the authority-approved exception to the opening six-month statement. Subsequent Article 20 material adds the specific documents.
- Each file has at least two genuinely short substantive sentences, beyond citation fragments. No three paragraphs begin with the same word on manual inspection. No three consecutive claim–statute–caveat paragraphs were found. Each has at least one uncited hypothetical/question paragraph. Contrast templates do not exceed three. Korean keeps 합니다체 and Japanese keeps です・ます体 outside headings. The endings are topic-specific rather than copied general disclaimers or sales appeals, but contain the legal-scope problems noted above.
- No standalone MONOTONY FAIL is declared: there are no automatic FAILs, and I did not identify two unmet manual threshold items in any one language. V01 is a reported manual defect; the legal, citation and native-prose grounds independently require FIX.

## 5. Image

Image verdict: REDO for the requested publication asset. `/Users/son7/tseng-col-1013-work/images/C2.webp` is absent, so that exact asset could not be inspected or approved.

The available `images/C2.jpg` was opened with the image viewing tool. Visual-content verdict for that candidate: OK. It depicts unmarked books, a plain seal and an ink pad on a shelf, fitting corporate records and minutes. No people, faces, text, logos, flags, readable documents or identifiable private setting are visible; the treatment is respectful. Supply the intended WebP and verify it matches this inspected candidate. This is an asset-delivery correction, not a request to invent a new scene.

Original → requested `C2.webp` missing → no exact final-image inspection possible → required: provide/verify the intended WebP → facts preserved: the inspected JPG's content need not change. No image conversion or edit was performed by the reviewer.

## Checks, applied edits and review fingerprint

Commands independently run for each of `ko`, `ja`, `en`, `zh-hant`:

```text
python3 /Users/son7/tseng-col-1013-work/lint.py /Users/son7/tseng-col-1013-work/drafts/C2/<lang>.md <lang> taiwan-subsidiary-annual-shareholders-meeting-director-term
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1013-work/drafts/C2/<lang>.md
```

| Language | Lint | Length | Variety result | CV | Short-sentence ratio |
|---|---|---:|---|---:|---:|
| ko | OK, exit 0 | 3,498 characters | OK, exit 0; 0 FAIL | 0.453 | 0.117 |
| ja | OK, exit 0 | 3,918 characters | OK, exit 0; 0 FAIL | 0.462 | 0.202 |
| en | OK, exit 0 | 1,598 words | OK, exit 0; 0 FAIL | 0.711 | 0.434 |
| zh-hant | OK, exit 0 | 2,700 characters | OK, exit 0; 0 FAIL | 0.475 | 0.170 |

Minor edits applied: none. Major issues were left for the writer as instructed. Required wording suggestions above are not represented as applied edits. After revision, rerun both gates: Korean, English and Traditional Chinese currently have almost no length headroom, so cuts must remove repetition rather than statutory conditions or sources.

Reviewed SHA-256 values:

```text
ko.md      8a04c4c85d4633802c14e1ec72ab70d940060d6e70c5df9820ae9535e08eb7fd
ja.md      847bc11221515b61a6ed2a0a301774f14622b58f5e2fbe7659d53a5ea0f0c4d2
en.md      02b1cb88e8182f54a07f5ba6ad4ac28aa2369f02065cd3fcfc874c7116663153
zh-hant.md 61a5dd1160087832c272b53e5b01bacdf056f55c37f760dff8a764587ff59b06
facts.md   90a79d63541c94e34620f7c514081244144815adc667cd08f4fac401353fae23
C2.jpg     fddb824ee3bf27c97d93c34df94b237d6680372f4408570f625d6439ad353d5c
```

VERDICT: FIX
