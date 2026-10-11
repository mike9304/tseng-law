# Final review r1 — ko-022-marrying-taiwanese-national-registration-checklist (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. Publishable now as the live replacement for /ko/columns/marrying-taiwanese-national-registration-checklist.

## Scope checked

- orig.md vs draft.md read in full, claim by claim, section by section (below).
- guard.txt: GUARD: PASS. Re-ran guard.py myself (orig, draft, ko, slug, --today 2026-10-12): GUARD: PASS, length 1820 -> 1799 (99%), monotony 27.3 -> 7.5. The three lint NOTEs (office address, last ## heading not a sources section) are pre-existing house format of the original and are tolerated by the guard.
- variety_metrics.py check draft.md --lang ko: sentences=57 mean=38.9 cv=0.487 short=0.14 run3=0.055 opener_rep=0.0 cite_end=0.018 cite_para=0.176 contrast=0 caveat=0 q=2. 0 FAIL, 1 WARN (82% of sentences end in 니다; original 85%).
- Front matter: python line-by-line compare of lines 1-22 of both files. Only line 5 differs (lastmod 2026-09-28 -> 2026-10-12). title, seoTitle, summary, date_display, read_time, categories, featured_image, all three FAQ q/a, audience, author and the H1 are byte-identical. No bold markers, no <strong>/<b>, no emoji in the draft.
- notes.md read; rewriter's explicit request (item 3, the merge of the two "원본과 번역문" sentences) verified below.
- tests.patch (non-empty), tests.txt, claude-tests1.log, vitest-0.log, vitest-1.log, and the live test file in the w1 worktree read.
- SENTENCE-VARIETY-RULE.md sections 5-6, COLUMN-VOICE-RULE.md, LESSONS.md top items read.

## Fact preservation — claim by claim

Legend: P = preserved with same meaning; M = moved (location changed, meaning same); — = no change in wording.

### Front matter / H1
| Original | Rewrite | Status |
|---|---|---|
| All front matter fields incl. 3 FAQ (제35조·3개월·재외공관; 비자 영사사무국·대표처 / 거류 이민서) | identical except lastmod | P |
| H1 | identical | P |

### Intro
| Original point | Rewrite location | Status |
|---|---|---|
| Decide first which country establishes the marriage legally | intro P1 s1 | P (—) |
| Korea-first then register in Taiwan vs Taiwan-first then report in Korea; documents differ from the start | intro P1 s2-s3 (split into two sentences) | P |
| Decide the order separately from the wedding date so you can ask the issuing authority concretely | intro P1 s4 ("별개로" -> "따로") | P |
| Preview sentence "대만 쪽 기관 이름도 미리 정리해 두겠습니다" | cut | repetition only, no fact |
| 結婚登記 ≈ Korean 혼인신고; done at 戶政事務所 (≈ 구청·읍면사무소 가족관계등록 창구) | intro P2 | P (—) |
| 內政部 戶政司 issues guidance; 外交部 領事事務局 visas; 內政部 移民署 residence | intro P2 (one sentence split in two) | P |
| Translation alone is not enough; need to know which authority certifies original and translation | moved to head of section 3, merged with the verification rule | M, P (see merge check below) |

### Section 1 "대만에서 결혼하면 한국에도 신고해야 하나요?" (heading unchanged)
| Original point | Rewrite location | Status |
|---|---|---|
| (New opener) "신고해야 합니다." | §1 P1 s1 | direct answer to the heading; same content as FAQ 2 ("한국에도 따로 신고해야 합니다") and the original closing sentence of this section. No new legal point. |
| Receiving Taiwan marriage papers does not allow postponing the Korean report | moved from end of §1 to §1 P1 s2 ("해서" dropped) | M, P |
| easylaw link; 법제처 separates Korean-method report vs recording a foreign-method marriage | §1 P2 s1 | P (—) |
| Korea-first: Taiwanese spouse needs proof of marriage capacity and identity | §1 P2 s2 | P (—) |
| Taiwan-first: confirm recognition in Korea, then report with marriage document + translation etc. | §1 P2 s3 | P (—) |
| Which country's law governs formation, and whether both meet requirements, matters | §1 P2 s4 ("…가 중요합니다" -> "이때 따지는 것은 …입니다") | P |
| Same-sex marriage: valid in Taiwan may not register the same way in Korea | §1 P2 s5 | P (—) |
| 재외국민 who made a marriage certificate by local method: 가족관계등록법 제35조, within 3 months, certificate copy to the competent 재외공관 (source: same 법제처 page) | §1 P3 s2, preceded by "기한도 있습니다." | P (— ; article number, 3 months, starting event, recipient all intact) |
| Qualifier: rule applies to 재외국민 married by foreign method, not every international marriage | §1 P3 s3 ("이 기한은" dropped, meaning intact) | P |
| No competent 재외공관: within the same 3 months, send to the domestic registry office designated by law | §1 P3 s4 | P (—) |
| Ask the competent authority for actual recipient and documents such as translation | §1 P3 s5 | P (—) |

### Section 2 (heading "대만 혼인등기는 어떻게 하나요?" -> "대만 혼인등기의 방식과 증인")
| Original point | Rewrite location | Status |
|---|---|---|
| New marriage vs registering a marriage already valid abroad require different documents in Taiwan too | §2 P1 s1 | P |
| ris.gov.tw 혼인등기 안내 link; explain the intended method to the 戶政事務所 in advance | §2 P1 s2 | P (—) |
| Give name, issuer, contents, certification status of Korean documents to learn whether they will be accepted | §2 P1 s3-s4 (split: "…까지 알려 주세요. 그래야 받아 줄지 답이 나옵니다.") | P |
| Taiwan method: written marriage, signatures of 2+ witnesses, both parties register together at 戶政事務所 (대만 민법 제982조) | §2 P2 s1 | P (— ; article and parenthesis intact) |
| Witness: legal capacity, personally present; applies equally to registration marriages; mojlaw FE350489 link | §2 P2 s3, preceded by "증인에게도 요건이 있습니다." | P |
| International marriage: review both parties' requirements and applicable law | §2 P3 s1 | P (—) |
| A ceremony or signatures alone does not settle the records in both countries | §2 P3 s2 | P (—) |

### Section 3 "번역한 서류만 가져가면 될까요?" (heading unchanged; paragraph order changed)
Original order: names/prior marriage -> Taiwan's required documents -> verification rule -> apostille -> after registration. Rewrite order: verification rule -> apostille -> Taiwan's required documents -> names/prior marriage -> after registration. Every point checked:
| Original point | Rewrite location | Status |
|---|---|---|
| Foreign-made documents need 대만 재외공관 verification; Chinese translation needs 재외공관 verification OR 대만 공증인 certification | §3 P1 s2 | P (— ; OR intact) |
| Decide where to prepare original and translation by this standard / know which authority certifies each | §3 P1 s3 (merge of intro P3 s2 + orig §3 P2 s4) | P — merge check: "각각 어느 기관에서 인증받아야 하는지" and "원본과 번역문을 어디서 준비할지는 이 기준으로 정하면 됩니다" both survive as "각각 어디서 준비하고 어느 기관에서 인증받을지는 이 기준으로 정하면 됩니다". Nothing lost. |
| Apostille cannot replace this verification | §3 P2 s1-s2 (question + "없습니다") | P |
| Taiwan is not a party to the Apostille Convention | §3 P2 s3 | P (—) |
| Korean-issued documents need 駐韓國台北代表部 document verification to be accepted by 戶政事務所 ("아포스티유가 아니라" dropped as redundant with s1-s3) | §3 P2 s4 | P |
| To establish a marriage in Taiwan: foreign spouse's marital-status proof and Chinese-name material etc. | §3 P3 s1 | P |
| Exception: certificate of a marriage already established in Korea, verified by 대만 재외공관 with the 符合行為地法 note -> marital-status proof not required | §3 P3 s2 | P (—) |
| Compare how the name appears in Korean marriage/capacity documents, Taiwanese spouse's 호적, passport ("먼저 … 대조해 보세요" -> "이름부터 대조해 보세요 … 봅니다") | §3 P4 s1-s2 | P |
| Prior divorce/bereavement: proof the earlier marriage ended may be needed; extra documents depend on how it is recorded | §3 P4 s3 | P (—) |
| After registration check name, birth date, nationality on certificate and 호적 | §3 P5 s1 | P |
| Taiwan-first and not yet reported in Korea -> now report to the Korean 가족관계등록부 | §3 P5 s2 | P (—) |

### Section 4 "혼인등기를 마치면 바로 대만에 살 수 있나요?" (heading unchanged)
| Original point | Rewrite location | Status |
|---|---|---|
| Registration does not create a visa, residence permit or nationality | §4 P1 s1 (moved to front) | P |
| boca.gov.tw spouse residence-visa page explains the marriage/호적 documents; registration papers are only part | §4 P1 s2-s3 | P |
| Visa: 영사사무국 and the competent 대표처; residence: 이민서 procedure, separately ("알아봐야 합니다" -> "알아볼 일입니다") | §4 P1 s4 | P (practical advice, not a legal duty; acceptable) |
| Check current stay status and expiry when scheduling | §4 P1 s5 (moved from front) | P |
| Already in Taiwan: first check whether you can stay on the current status | §4 P2 s1 | P (—) |
| Whether a new/changed residence status is needed depends on current status and residence plans | §4 P2 s2-s3 (question form) | P |
| Internal link to baby-taiwan-nationality-birth-registration | §4 P2 s4 | P (—) |

### "### 서류 문제가 얽혀 있다면" + closing
| Original point | Rewrite location | Status |
|---|---|---|
| Different name spellings or overseas divorce/marriage records -> get Taiwan-law review before filing | P1 s1 | P (—) |
| Firm 호정(昊鼎)국제 법률사무소, 증준외(曾雋崴) 변호사; list of details to send (nationalities, residence, spouse's 호적, which country first, prior marriage and stay status, document names and dates) | P1 s2 | P (—) |
| Originals / sensitive material by the method the office indicates | P1 s3 | P (—) |
| Email wei@hoveringlaw.com.tw (mailto), address 103 臺北市大同區承德路一段35號7樓之2 | moved into P1 s4 | M, P |
| Based on official sources checked 2026년 9월 27일; documents, filing method, deadlines, fees per the authority's latest guidance | final paragraph (two sentences) | P |

Added material: none beyond three signpost sentences with no factual content ("신고해야 합니다." — taken from FAQ 2; "기한도 있습니다."; "증인에게도 요건이 있습니다."). No new examples, numbers, cases, first-person lines, promises or sales lines. All six link targets (easylaw, ris.gov.tw, mojlaw, boca.gov.tw, internal baby column, mailto) present and attached to the same claims. Both statute citations (가족관계등록법 제35조, 대만 민법 제982조) attached to the same claims.

## Blocking issues

None.

## MONOTONY (rule section 5 self-check, re-run by reviewer)

1. Tool: 0 FAIL (1 WARN on 니다 endings, inherited from the original and slightly improved). Met.
2. Opening is not a stock hypothetical. Met.
3. Very short sentences: "신고해야 합니다." "기한도 있습니다." "없습니다." "준비할 서류는 처음부터 다릅니다." Met. (The easylaw paragraph still has four long sentences in a row; this is the original's shape and carries the legal distinctions, so left.)
4. Paragraph first words read vertically: 한국인과 / 대만의 / 신고해야 / [한국 / 기한도 / 새로 / 대만 / 국제결혼이라면 / 번역만으로는 / 아포스티유로 / 혼인을 / 이름부터 / 등기를 / 혼인등기를 / 이미 / 서류마다 / 이 글은 — no word three times. Met.
5. No three consecutive claim(statute)->caveat paragraphs; several paragraphs without citation. Met.
6. Contrast templates 0 (original 2). Met.
7. Last paragraph: the two-sentence source-check/disclaimer is the original's own closing text (dated 2026년 9월 27일, listing 서류·접수 방식·기한·비용), now standing alone instead of inside the contact paragraph. It is preserved disclaimer content, not a copied stock line, but as a standalone closer it reads slightly more formulaic than the original. Borderline; counted as at most one unmet item, below the two-item threshold. Not a FIX.
8. 합니다체 throughout; no bold; no invented first person; the renamed heading "대만 혼인등기의 방식과 증인" is a noun-phrase heading specific to this column, not an imperative/checklist heading. Met.
9. No article number, deadline, amount, link or label lost. Met.

Native reading: the question-and-answer openers ("아포스티유로 이 검증을 대신할 수 있을까요? 없습니다." / "…바꿔야 할까요? 기존 자격과 …에 따라 다릅니다.") and the colloquial "그래야 받아 줄지 답이 나옵니다" read like a practitioner explaining, not like a template. No translationese found. Register wobble "이름부터 대조해 보세요. … 어떻게 적혀 있는지 봅니다." (imperative then declarative) is acceptable in Korean procedural prose and was left alone.

## Padding check

1820 -> 1799 characters (99%). Cuts: the preview sentence "대만 쪽 기관 이름도 미리 정리해 두겠습니다", the redundant "아포스티유가 아니라", "이 기한은", "해서". Each is repetition or connective tissue; no legal point removed.

## Tests verdict

PASS. tests.patch touches only src/lib/__tests__/family-columns-20260927.test.ts and adds one map entry plus one comment to REWRITTEN_LASTMOD ('ko/marrying-taiwanese-national-registration-checklist': '2026-10-12'), next to the existing ja 022 entry. The sitemap lastModified assertion still locks the date, now to the new lastmod. No assertion removed, no .skip/.only/.todo, no other column's expectation changed. The first test (publicationDate 2026-09-28 for ko, FAQ >= 2, mailto contact, 曾雋崴, no phone number, hero image path 022, summary 150-160 chars, >= 2 https sources, category legal) was untouched and passes against the draft. vitest-0.log shows the single pre-patch failure (expected '2026-09-28', got '2026-10-12'); vitest-1.log shows Test Files 77 passed (77), Tests 1024 passed (1024).

## Tiny edits applied

None. Guard re-run on the untouched draft: GUARD: PASS.

## Original issues (not blocking)

- No sources section and no direct law.moj.gov.tw / law.go.kr links for 민법 제982조 and 가족관계등록법 제35조 (only the easylaw page and the mojlaw interpretation). Pre-existing; the guard tolerates the last-heading lint for this reason.
- Office street address in the contact line is flagged by lint (house rule prefers no address); pre-existing house format of this batch.
- date_display stays "2026년 9월 28일" while lastmod is 2026-10-12, following the same convention used for the ja 022 rewrite (front matter other than lastmod must stay identical).
- The legal content of the original checked against my knowledge: 民法 982 (書面, 二人以上證人簽名, 雙方向戶政機關登記) and 가족관계등록법 제35조 제1·2항 (3개월, 재외공관 / 없으면 국내 등록기관 발송) are stated correctly. Nothing in the rewrite made any point worse.
