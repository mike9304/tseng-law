# FINAL REVIEW r1 — ko-021 taiwanese-spouse-divorce-cross-border-parenting (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. The rewrite preserves every legal statement, qualifier, link, article number, table cell, FAQ entry and the contact line. It reads as a Korean column, not as a template. Guard PASS, variety check 0 FAIL, tests.patch is a clean re-anchor of one lastmod expectation. One tiny edit applied (see below); guard re-run PASS.

## Scope checked

- orig.md vs draft.md: full line diff (`diff orig.md draft.md`), then claim-by-claim reading of every changed paragraph.
- guard.txt and a fresh guard run after my edit: `GUARD: PASS` both times.
- `variety_metrics.py check draft.md --lang ko`: 51 sentences, cv 0.473, short 0.157, run3 0.02, opener_rep 0.0, cite_end 0.0, contrast 0, caveat 0, q 2; no FAIL; one WARN (82% of sentences end in 니다, normal for 합니다체).
- tests.patch (1081 bytes) against the worktree copy of `src/lib/__tests__/divorce-columns-20260927.test.ts`; vitest-1.log: 78 files / 1036 tests passed.
- SENTENCE-VARIETY-RULE sections 5–6, COLUMN-VOICE-RULE, LESSONS.md skimmed.

## Front matter, H1, image, table, contact line

- Front matter: identical except `lastmod: "2026-09-28"` → `"2026-10-12"`. read_time unchanged (5분 분량; body 98% of original length). title, seoTitle, summary, date_display, categories, featured_image, all three FAQ q/a pairs, audience, author identical.
- H1 identical. Table (5 rows, both columns) identical. Both internal links, the MOJ link, the mailto link, the office address, 광고책임 변호사 증준외(曾雋崴), and the 2026년 9월 27일 source-check sentence identical.

## Claim-by-claim fact table

### Intro (3 paragraphs)
| Original point | Rewrite | Status |
|---|---|---|
| Spouse agreed to divorce; may I take the child to Korea? | para 1, sentences 1–2 | preserved |
| Consent to divorce ≠ consent to child's move to Korea | "이혼에 동의했다고 아이의 한국 이주까지 동의한 것은 아닙니다" | preserved |
| Housing, job, family caregiving in Korea = living conditions met | "한국에 살 집과 일자리가 있고 돌봐 줄 가족도 있다면 생활할 여건은 갖춘 셈입니다" | preserved |
| Still must first check existing agreements/judgments on the child, who holds 친권·양육권, whose consent is needed | "자녀에 관한 기존 합의와 재판이 있는지, 누가 친권·양육권을 갖는지, 누구의 동의가 필요한지부터 확인해야 합니다" | preserved (wording "있는지" asks whether they exist; the content check follows in section 1) |
| Taiwan Civil Code term 未成年子女權利義務之行使負擔 ≈ Korean 친권·양육권; article uses 친권·양육권 | para 2 | preserved |
| Cross-border move raises jurisdiction, applicable law, recognition/enforcement of existing agreement or judgment in both countries | para 3 sentence 1 | preserved |
| Taiwan Civil Code described below does not apply unchanged to every international family | "아래에서 설명하는 대만 민법도 모든 국제가족에게 그대로 적용되지는 않습니다" | preserved |

### Section 1 (heading changed: "아이와 출국하기 전에 무엇을 확인해야 할까요?" → "아이의 거처는 기존 합의와 재판에서 어떻게 정해져 있나요?")
| Original point | Rewrite | Status |
|---|---|---|
| Read existing agreement/court documents for where the child lives and parents' rights/duties | "출발점은 기존 서류입니다. 합의서나 법원 서류에서 …" | preserved |
| Sole 친권·양육권 holder: that alone does not settle relocation abroad | sentence 3 | preserved |
| Avoid unilaterally moving the child without checking needed consent, court decision, existing restrictions | sentence 4 | preserved |
| Taiwan is not a Hague Child Abduction Convention party | "대만은 당사국이 아닙니다." | preserved |
| Return procedure between contracting states unavailable between Korea and Taiwan → settling by agreement and court process before departure is more important | three sentences, same content | preserved |
| Base materials: child's nationality/passport, residence/school, primary caregiver, which parent the child lives with now | para 3 sentence 1 | preserved |
| Pending child-related litigation → prepare full file | sentence 2 | preserved |
| Violence/imminent danger → safety and protective measures before move schedule | "안전 확보와 보호조치가 먼저입니다. 이사 일정은 그다음입니다." | preserved |
| Internal links to divorce Q&A and inheritance/custody analysis | same two links, same slugs | preserved |

### Section 2 (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| Civil Code 제1055조 and 제1055조의1 govern 친권·양육권, 면접교섭, best interests of the child | sentence 3, both article numbers, same three subjects | preserved |
| Court weighs child's age/health, wishes/development, parents' capacity/attitude, parent–child emotional bond, etc. | sentence 4 | preserved |
| Higher income alone, or spouse's fault for marriage breakdown alone, does not decide | moved to the front as two sentences: "소득만으로 정해지지 않습니다. 혼인이 깨진 책임이 상대방에게 있다는 사실 하나로도 마찬가지입니다." | preserved |
| MOJ Civil Code link | same URL | preserved |
| Describe who handled school runs, doctor visits, meals, bedtime; describe future support the same way | para 2 | preserved ("적어 두면 좋습니다" → "적어 두세요", advice register consistent with the section's other imperatives) |
| Must not make the child reject the other parent or elicit answers for the dispute | sentence 3 (다만 dropped, prohibition intact) | preserved |
| Care gap between arrival and school start; plan caregiver, language, medical-record transfer; "미정" allowed | para 3 | preserved |
| The plan shows the child's future life but gives no authority to take the child abroad | "자료입니다. 아이를 해외로 데려갈 권한까지 주지는 않습니다." | preserved |

### Section 3 (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| "Contact any time" promise is not enough to book flights or match holidays | identical | preserved |
| Table of five planning items | identical | preserved |
| Safety/violence concern → disclose first, have protective measures and contact method reviewed for the case | identical | preserved |
| Effect and enforceability of a cross-border visitation agreement must be checked in advance | recast as reader question + "미리 확인해 두어야 합니다." | preserved |
| Keep child support separate from visitation schedule and marital property settlement | identical | preserved |
| Split current education/medical/living costs into monthly vs. large unpredictable; set currency, timing, who pays remittance fees | same list ("부담할지" → "낼지") | preserved |
| Mixing in the parent's own living costs blurs what was agreed | identical | preserved |
| This is consultation prep, not a legal formula for child support | "이런 정리는 상담 준비용입니다. 양육비를 계산하는 법적 공식은 아닙니다." | preserved |
| Amount and modification judged on child/parent circumstances, applicable law, existing documents; also check overseas receipt and enforcement on default | one merged sentence, all five elements present | preserved |

### Contact subsection and closing line
| Original point | Rewrite | Status |
|---|---|---|
| Firm name 호정(昊鼎)국제 법률사무소; items to send: nationalities/residence, child's age and current caregiver, existing agreement/judgment, planned move date, preferred language | one list including 희망 상담 언어 | preserved |
| Child-related sensitive records and detailed documents only after conflict check and delivery instructions | "아이에 관한 민감한 기록과 자세한 서류는 …" (qualifier restored by my edit) | preserved |
| Languages, scope, fees advised after contact | identical | preserved |
| Email, address, 광고책임 변호사, 2026년 9월 27일 source-check date | identical | preserved |

Nothing added: no new facts, examples, cases, numbers, first-person stories, promises or sales lines.

## Blocking issues

None.

## MONOTONY items

None blocking. Rule section 5 self-check, all items met:
- 5-2 opener: short statement + reader question, not a 가령/가상 formula.
- 5-3 very short sentences: "대만은 당사국이 아닙니다." "이사 일정은 그다음입니다." "출발점은 기존 서류입니다." "소득만으로 정해지지 않습니다." No two long sentences back to back.
- 5-4 paragraph openers read vertically: 배우자가 / 한국의 / 아이가 / 출발점은 / 헤이그 / 판단의 / 이혼 / 소득만으로 / 평소 / 한국에서 / ‘언제든 / 안전이나 / 양육비는 / 이런 / 호정 / 이메일 — no word three times.
- 5-5 no 주장(조문)→다만 chain; "다만" openers 0; most paragraphs carry no citation.
- 5-6 contrast templates 0; nothing rebuts a claim the reader did not make.
- 5-7 last body paragraph ends on this column's facts (overseas receipt and enforcement of child support); no stock disclaimer or sales line.
- 5-8 합니다체 throughout, no bold, no emoji, headings are reader questions, not checklists.
- 5-9 article numbers, links, dates, qualifiers intact.
Native reading: register is consistent; "~가 함께 걸립니다", "부모 중 지금 함께 사는 쪽입니다", and the question-then-answer pair in section 3 read as natural Korean. The remaining WARN (82% 니다 endings) is the register itself.

Observation (not blocking): the new section 1 heading is narrower than the original (the section also covers the Hague point, base materials and the violence rule). The paragraphs still answer it, the FAQ 1 matches it, and the heading is not pinned by any test, so I left it.

## Tests verdict

PASS. tests.patch adds `'ko/taiwanese-spouse-divorce-cross-border-parenting'` to `REWRITTEN_20261012` and extends the comment to note ko/021 keeps date_display 2026년 9월 28일. That set is used only in the sitemap `lastModified` expectation (10-12 vs 10-06 vs 09-27 vs 09-28), so the patch re-anchors exactly the lastmod this rewrite changed. No assertion removed, no `.skip`/`.only`, no other column weakened. Contact mailto, 曾雋崴, featured image path, nine-locale alternates and other columns' lastmod remain locked. vitest-1.log: 78 files / 1036 tests passed.

## Tiny edits applied

1. Contact paragraph: "민감한 기록과 자세한 서류는" → "아이에 관한 민감한 기록과 자세한 서류는" (restores the original qualifier the rewrite dropped). Guard re-run after the edit: `GUARD: PASS` (length 1340 → 1312, 98%; monotony 22.3 → 11.7). Variety check re-run: no FAIL.

## Original issues (not blocking)

- The original attributes 면접교섭 to 제1055조 and 제1055조의1 together. Article 1055 ¶5 is the visitation provision and 1055-1 lists the best-interest factors, so the joint attribution is defensible; unchanged in the rewrite.
- No separate sources section; the only official source is the inline MOJ link (lint already tolerates this as house format). The MOJ link URL was not re-fetched in this review.
- Lint-tolerated house-format items (office street address in the contact line, last ## heading not a sources section) are inherited from the original.
