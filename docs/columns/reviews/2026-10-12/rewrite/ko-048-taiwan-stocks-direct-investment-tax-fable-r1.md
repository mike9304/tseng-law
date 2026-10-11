# FINAL REVIEW r1 — ko-048 taiwan-stocks-direct-investment-tax (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS. Every legal claim, condition, rate, date, article number, link target, FAQ entry, source-list entry and contact line of the original survives with the same meaning. Nothing new was added except two restatements of figures already in the text (21%, 10%) used as question hooks. One particle edit applied by the reviewer (see below); guard re-run PASS.

## Scope checked

- orig.md vs draft.md read in full, paragraph by paragraph.
- guard.txt (GUARD: PASS) and a re-run of guard.py after my edit (GUARD: PASS, length 2428 -> 2402, 99%).
- Mechanical cross-checks run by me: front matter line diff (only lastmod differs), sources list + 확인일 lines byte-identical, URL multiset identical (all 20 URLs, same counts), number multiset diff = only lastmod date plus one extra "21%" and one extra "10%" (both restatements), no bold/`<b>`/`__`, no 해라체 "~다." endings in the body.
- variety_metrics.py check --lang ko: 0 FAIL, 1 WARN (95% sentences end in 니다., register-wide and also true of the original).
- tests.patch (non-empty), tests.txt, claude-tests1.log, vitest-1.log tail (75 files / 1031 tests passed).
- SENTENCE-VARIETY-RULE.md sections 2, 5, 6; COLUMN-VOICE-RULE.md; LESSONS.md top items.

## Claim-by-claim fact table

### Front matter
| Original | Rewrite | Status |
|---|---|---|
| title, seoTitle, summary, published, date_display, read_time "7분 분량", categories, topic, featured_image, 3 FAQ q/a, audience, author | identical | preserved |
| lastmod 2026-09-30 | 2026-10-12 | expected change |
| H1 line 24 | identical | preserved |

### Intro (orig P1-P2 → draft P1-P2)
| Original point | Rewrite | Status |
|---|---|---|
| TSMC stock / 0050 ETF direct investment requires checking both countries' taxes | P1 s1 "세금을 두 나라에서 따져야 합니다" | preserved |
| Taiwan taxes sale and dividend; Korean resident separately computes income and tax to report | P1 s2 | preserved |
| Premise: Korean tax resident who is Taiwan non-resident holding Taiwan-listed securities directly | P2 "전제는 하나입니다. …경우입니다." | preserved |
| US-listed Taiwan-related products / depositary receipts may differ | P2 s3 | preserved |
| Long stay in Taiwan → check Taiwan residency; link to residency column | P2 s4 (merged into one sentence, same link) | preserved |

### Section 1 account opening (heading renamed "한국 거주자의 대만 증권계좌 개설" → "대만 증권계좌와 투자자 등록")
| Original point | Rewrite | Status |
|---|---|---|
| 華僑及外國人投資證券管理辦法 제10조 governs foreign investor TWSE registration (link) | P1 s1, same link | preserved |
| TWSE guide: get investor ID number, then open brokerage trading account (link) | P1 s1 | preserved |
| Onshore foreigner: via local broker (link); offshore: via Taiwan agent/representative (link) | P1 s2, anchors shortened, URLs unchanged | preserved |
| ID/residence documents and account name confirmed through broker | P1 s3 | preserved |
| App trading does not necessarily mean an own-name local account | P2 question + "아닐 수 있습니다." | preserved |
| Keep registration docs, account terms, trade records, dividend statements to see who was paid what | P2 s3, now also lists 매수·매도 체결내역, 수수료·환전 기록 (moved from orig S2 P2 last sentence) | preserved (consolidated) |

### Section 2 sale taxes (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| 證券交易稅 under 證券交易稅條例 applies to sale amount (link) | P1 s1-s2 | preserved |
| MOF: ordinary stock sale rate 0.3% (link) | P1 s3 | preserved |
| MOF: investment-trust beneficiary certificates 0.1% (link) | P1 s3 | preserved |
| 0050-type ETF: check legal security type and any separate trading rules | P1 s4 | preserved |
| MOF: seller bears the tax (link) | P1 s2 (moved earlier) | preserved |
| 소득세법 제4조의1 suspends income tax on securities transaction income (link) | P2 s2 | preserved |
| Same article: securities losses not deductible | P2 s3 "같은 조는 …" | preserved |
| No Taiwan income tax on gain but STT still applies | P2 s1 question + s4 "증권거래세는 그대로 붙습니다." | preserved |
| Does not mean Korean CGT is exempt | moved to S4 P2 ("대만이 매도차익 소득세 부과를 중지했다고 한국 양도소득세 신고가 사라지지도 않습니다"), merging with the original's own duplicate in S4 | preserved (duplicate removed) |
| Keep trade confirmations, fees, FX records | moved to S1 P2 list | preserved |

### Section 3 dividends (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| 各類所得扣繳率標準 제3조 제1호: Taiwan non-resident individual's company dividend withheld at 21% under domestic law (link) | P1 s1 (word "대만" before the law name dropped; law name is in Chinese, context unambiguous) | preserved |
| ETF cash distributions: depends on payer and composition; company dividend rate cannot be applied to all distributions | P1 s2-s3 | preserved |
| Keep statement showing withholding details | moved to S5 P2 ("원천징수내역이 적힌 배당명세서") | preserved |
| MOF press release: Korea–Taiwan income tax agreement entered into force 2023-12-27, applies from 2024-01-01 (link) | P2 s3-s4 | preserved |
| Listed in MOF treaty list (link) | P2 s5 | preserved |
| MOF withholding rate table: Korea treaty dividend cap 10% (link) | P2 s5 | preserved |
| Cap requires treaty-qualified Korean resident; Korean nationality alone does not auto-apply | P3 s1-s3 | preserved |
| Residency certificate and withholding procedure in MOF guidance (link) | P3 s4 | preserved |
| Before dividend payment confirm certificate, beneficial owner, application method via broker and paying company | P3 s5 | preserved |
| If already withheld at domestic rate: check Taiwan refund possibility and documents | P3 s6 | preserved |

### Section 4 Korean CGT (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| NTS guide: taxable foreign-stock gain = actual price less acquisition cost etc. (link) | P1 s1 | preserved |
| Net domestic + foreign taxable stock gains/losses, then one annual 250만 원 basic deduction | P1 s2 | preserved |
| General foreign-stock income tax rate 20% | P1 s3 | preserved |
| Separate personal local income tax | P1 s4 | preserved |
| Non-SME company stock: generally 2% local income tax under 지방세법 제103조의3 (link) | P1 s5 | preserved |
| Product classification / exceptions → recheck rate | P1 s6 | preserved |
| 250만 원 deduction does not refund Taiwan STT | P2 s1 first half | preserved |
| Taiwan suspension of gains tax does not remove Korean filing | P2 s1 second half | preserved |
| KRW conversion: trade date, settlement/payment date, fees, FX rate records | P2 s2 | preserved |
| Check residency and taxable-stock status with a tax professional | P2 s3 | preserved |

### Section 5 foreign tax credit (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| Taiwan dividends also considered when reporting Korean dividend income | P1 s1 | preserved |
| NTS explains 소득세법 제57조 foreign tax credit: a certain amount of foreign income tax on foreign-source income creditable (link) | P1 s2 | preserved |
| Credit depends on Korean tax, income category, aggregation with other dividends, tax finally and lawfully borne in Taiwan | P1 s3 | preserved |
| Even if 21% withheld, first determine treaty 10% cap / Taiwan refund to fix creditable amount | P2 s1 | preserved |
| Keep dividend statements, withholding evidence, Taiwan refund/approval records | P2 s2 | preserved |

### Section 6 situs for inheritance (heading unchanged)
| Original point | Rewrite | Status |
|---|---|---|
| Inheritance is a separate matter | "상속에서는 소재지가 쟁점입니다." (reframed as the situs issue; the legal content that follows is unchanged) | preserved |
| 유산·증여세법 제9조 제8호: stock situs = issuer's or investee business's head office location (link) | s2 | preserved |
| Taiwan-headquartered company stock may be Taiwan-situs property even if investor lives in Korea | s3 | preserved |
| ETF units: check issuer and legal form separately | s4 | preserved |
| Foreign resident's Taiwan estate filing: link to estate column | s5, same link | preserved |

### Section 7 contact (heading renamed "대만 투자에 관한 법률 상담" → "대만 서류에 관한 문의")
| Original point | Rewrite | Status |
|---|---|---|
| Firm (호정(昊鼎)국제 법률사무소) can review account real name/holding structure, legal classification of Taiwan securities, dividend withholding and inheritance-related Taiwan documents | P1, same four items, subject order inverted | preserved |
| 증준외(曾雋崴) 변호사 first consultation: send residence, ticker/code, account terms, trade records, dividend/withholding statements with short description to wei@hoveringlaw.com.tw | P2 s1 identical | preserved |
| Korean CGT filing and foreign tax credit with Korean tax professional | P2 s2 identical | preserved |
| Office address 103 臺北市大同區承德路一段35號7樓之2 | P2 s3 identical | preserved |

### Sources list and 확인일
Byte-identical to the original (7 bullets, 20 URLs, "확인일: 2026년 9월 30일").

## Blocking issues

None.

## MONOTONY items (non-blocking observations)

- Tool: 0 FAIL. WARN "95% of sentences end in 니다." applies equally to the original and is register-wide; not a FAIL.
- Rule section 5 self-check: 5.2 opening is a concrete fact, no stock hypothetical; 5.3 several very short sentences ("아닐 수 있습니다." "증권거래세는 그대로 붙습니다." "협정에 상한이 있습니다."), no paragraph has more than one 70+ character sentence (verified by count); 5.4 paragraph openers: no word opens 3 paragraphs ("대만" 2, "한국" 2, "매도…" 2); 5.5 four paragraphs without a citation, no claim→다만 run; 5.6 contrast templates 0 by tool, the one "X는 아니고 Y도 않습니다" sentence is inherited from the original; 5.7 contact paragraph is the SPEC structural tail, no copied disclaimer. 0 of items 2–7 unmet.
- Observation only: three reader questions in three consecutive sections (S1 "열려 있다는 뜻일까요?", S2 "붙을까요?", S3 "다 낼까요?"), each followed by a short answer. Rule 2-5 suggests 1–2. The pattern is noticeable on a straight read but each question is one a reader would actually ask, and the count is a guideline, not a FAIL criterion. Not blocking; a future pass could turn the S2 question back into a statement.

## Tests verdict

PASS. tests.patch touches only src/lib/__tests__/expertise-columns-20260930.test.ts: it adds 'ko/048': '2026-10-12' to the FACT_FIX_LASTMOD map and extends the comment. The lastmod assertion still runs for every column including ko/048 and still locks the exact new date. No assertion removed, no .skip/.only, no other column's expectation touched. vitest-1.log: 75 files / 1031 tests passed. This test file pins front matter only, so no body-text re-anchoring was needed.

## Tiny edits applied by reviewer

1. Section 1 P1: "대만 안에 있는 외국인은 … 해외에 있는 외국인은 … 절차가 안내돼 있습니다" → "외국인에게는 … 외국인에게는" (particle; the rewrite had left "외국인은" as a dangling subject of "절차가 안내돼 있습니다"; restores the original's case marking). URLs and anchors untouched.
   Guard re-run after edit: GUARD: PASS (length 2428 -> 2402, 99%). variety check: 0 FAIL, same WARN.

## Original issues (not blocking)

- FAQ 1 ends with "상품과 거래 유형은 따로 확인할 필요가 있습니다" while the body only says this for ETFs (0050 legal classification). Minor FAQ/body alignment gap inherited from the original.
- "확인일: 2026년 9월 30일" was not refreshed although lastmod moved to 2026-10-12; no source was re-opened in this rewrite, so leaving the check date is the honest choice. Flag for the next fact-check pass.
- Lint flags the street address in the contact line as house-format deviation (pre-existing, tolerated by guard).
- 21% / 10% / 2023-12-27 / 2024-01-01 / 0.3% / 0.1% / 250만 원 / 20% / 2% were not re-verified against the live pages in this review (no re-litigation of the original's law, per instructions); they are unchanged from the published text.
