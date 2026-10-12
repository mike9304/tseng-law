# FINAL REVIEW r1 — ko-043 korea-crypto-tax-2027-taiwan-residents (Claude Fable 5.1, 2026-10-12)

## Verdict

PASS (after four tiny edits applied by the reviewer, listed below). Guard re-run: GUARD: PASS. Variety check: FAIL 0, WARN 1 (84% '니다.' endings — inherent to 합니다체, same as original).

## Scope checked

- orig.md vs draft.md, claim by claim, all six body sections, FAQ, intro, source list, 확인일.
- guard.txt (GUARD: PASS, length 3722 -> 3711 before edits; 3722 -> 3722 after edits).
- notes.md (rewriter's four flagged paraphrases reviewed individually).
- tests.patch (1363 bytes) and tests.txt / claude-tests1.log (vitest 75 files passed after patch).
- SENTENCE-VARIETY-RULE.md §5–6, COLUMN-VOICE-RULE.md, LESSONS.md top items.
- Mechanical: source list byte-identical to original; front matter differs only in lastmod 2026-10-06 → 2026-10-12; H1 unchanged; no image lines in body (none in original either); zero `**`; no emoji; all H2 are topic headings, none imperative or checklist.

## Fact table (original point → rewrite location → status)

### Front matter / FAQ
| Original | Rewrite | Status |
|---|---|---|
| title, seoTitle, summary, published, date_display, read_time "8분 분량", categories, topic, featured_image, 3 FAQ q/a, audience, author | identical | preserved |
| lastmod 2026-10-06 | 2026-10-12 | expected change |

### Intro
| Original | Rewrite | Status |
|---|---|---|
| 2026-09-30 현재 법령상 과세는 2027-01-01 시작 | intro sentence 3 | preserved |
| 거주자 판단에 따라 세금이 갈림 | "거주자 판단에서 갈립니다." | preserved |
| 양쪽 거주자면 조세 약정으로 결정 | intro sentence 4 | preserved |
| 대만 거래소 출금·해지 절차는 대만에서 | intro sentence 4 | preserved |

### §1 지금 법령이 정한 2027년 코인 과세
| Original | Rewrite | Status |
|---|---|---|
| 제21조 제1항 제27호: 양도·대여 소득 = 기타소득 '가상자산소득' | ¶1 | preserved, link intact |
| 종합소득과 합산 않고 따로 계산 (제14조 제3항 제8호 다목) | ¶1, merged clause, cite attached | preserved (reviewer added subject "이 소득은" so 제21조 is not read as the thing that "calculates") |
| 소득세 = (연 소득금액 − 250만 원) × 20%, 제64조의3 제2항, 본문 링크, 국세청 링크 | ¶2 | preserved |
| 250만 원 이하 비과세 (제84조 제3호) | ¶2 | preserved |
| 지방세법 제93조 제18항, 개인지방소득세 1천분의 20, 같은 방식 | ¶2 | preserved |
| 합하면 250만 원 넘는 부분의 22% | draft had "그 금액의 22%" — antecedent ambiguous (could be read as the whole 소득금액) | reviewer restored original phrase "250만 원을 넘는 부분의 22%" |
| 부칙(법률 제17757호) 제1조 제2호·제5조; 2027-01-01 이후 양도·대여분 | ¶3 | preserved |
| 제70조 신고 기간 다음 해 5/1–5/31; 2027년분 첫 신고 2028년 5월 | ¶3 | preserved |
| 2027-01-01 전 보유 코인: 2026-12-31 시가 vs 실제 취득가액 중 큰 금액 (제37조 제5항) | ¶3 | preserved |
| 시행일 조항 2021·2022·2024 세 차례 개정; 재개정 가능; 최신 법령·국세청 안내 재확인 | ¶4 | preserved |

### §2 대만에 살아도 한국 거주자가 될 수 있다
| Original | Rewrite | Status |
|---|---|---|
| 제1조의2: 주소 또는 183일 이상 거소 → 거주자 | ¶1 | preserved ("한국 소득세법" → "소득세법"; section heading and link make the jurisdiction clear) |
| 시행령 제2조: 생계 같이하는 가족·국내 자산 등 객관적 사실로 주소 판정 | ¶1 | preserved |
| 대만 근무라도 가족·집이 한국이면 거주자 가능 | ¶1 | preserved |
| 시행령 제3조: 100% 출자 해외현지법인·국외사업장 파견 임직원 거주자 간주 | ¶1, article as subject | preserved |
| 거주자 전세계 소득 과세 → 대만 거래소 소득도 신고; 비거주자 국내원천소득만 (제3조) | ¶2 | preserved |
| 국세청 비거주자 안내: 양도·대여·인출 소득 = 국내원천 기타소득; 사업자가 양도가액 10%와 이익 20% 중 적은 금액 원천징수 | ¶3 | preserved |
| 다만 제156조 제1항 제8호 나목: 필요경비 미확인 시 지급금액 10% | ¶3 "다만 … 나목은" | preserved |
| 한국 거래소 계속 쓰는 비거주자 유의 | ¶3 "…대목이지요" | preserved |
| 대만 거주자 여부는 대만 법으로 별도 판단; 내부 링크; 양쪽 충족 시 약정 | ¶4 | preserved |

### §3 한–대만 이중과세방지약정
| Original | Rewrite | Status |
|---|---|---|
| 재정부 협정 목록에 한국 = 포괄적 소득세 협정 상대 | ¶1 | preserved |
| 서명 2021-11-17, 발효 2023-12-27, 개정 협정(부처 명칭) 2026-08-04 발효 | ¶1 | preserved |
| 대표부 공지: '한-대만 이중과세방지약정', 2024-01-01 이후 과세분 적용 | ¶1 | preserved |
| 제4조 제3항 tie-breaker 순서: 항구적 주거 → 인적·경제적 관계 → 일상적 거소 → 국적; 한국어·영문 합본 링크 | ¶2 | preserved, order intact |
| 제13조 제6항: 앞 항 외 재산 양도소득은 양도인 거주지에서만 과세 | ¶3 | preserved |
| 제22조 기타소득: 거주지 과세 원칙, 제3항 원천지도 과세 가능 | ¶3 | preserved (split into two sentences) |
| 국세청: 조약국 거주자 비거주자가 비과세·면제신청서 제출 시 적용 | ¶4 | preserved |
| 적용 약정 조항·한–대만 약정에의 절차 적용 여부는 공식 확인 못함; 한국 세무사 확인 | ¶4 (without "다만") | preserved; caveat intact |
| 재정부 입법원 서면 보고: 비증권성 가상화폐 비경상적 매매 소득 = 재산거래소득 | ¶5 | identical |
| 대만 거주자 해외 소득 연 100만 TWD 이상 시 최저세 계산 (所得基本稅額條例 제12조) | ¶5 | identical |

### §4 거주와 거래를 증명할 기록
| Original | Rewrite | Status |
|---|---|---|
| 거주자 판단 자료 목록; 거래 자료 목록 | ¶1 | identical |
| 국세청 안내: 2026-12-31 시가 기준은 시가고시가상자산사업자 취급 여부로 달라짐 | ¶2 | preserved; the new lead sentence ("취득가액을 정할 때 … 시가를 비교합니다") only restates §1 제37조 제5항, no new fact |
| 취급 자산: 각 사업자가 2027-01-01 0시 공시 가격 평균; 그 밖은 별도 기준 | ¶2 | preserved |
| 그 시점 잔고·표시 가격 저장 | ¶2 | preserved |
| 대만 납부 증빙; 약정 제23조 한도 내 공제 | ¶3 (split out) | preserved |
| 국조법 제52조: 국외 가상자산사업자 계좌 포함 | ¶4 | preserved |
| 국세청: 매월 말일 하루라도 5억 원 초과 → 다음 해 6월 신고 | ¶4 (two sentences) | preserved |
| 면제: 거소 짧은 재외국민, 조약상 상대국 거주자; 후자는 2025년 보유분부터 (제54조); 한–대만 적용 여부는 세무사 확인 | ¶5 | preserved |

### §5 대만 거래소에서 출금이 막히거나 계정이 해지됐다면
| Original | Rewrite | Status |
|---|---|---|
| 洗錢防制法 제6조: 미등록 사업자 서비스 금지; 해외 업체도 등기·등록 필요 | ¶1 | preserved |
| 증권선물국 VASP 페이지, 2026-09-29 기준, 3분류 | ¶2 | preserved |
| 명단은 AML 등록 여부일 뿐, 안전·출금 보증 아님 | ¶2 (question + two short sentences) | preserved |
| 금관회 보도자료: 가격 제한폭 없음, 급등락, 신중 판단 | ¶3 | preserved |
| 해제금·보증금·세금 선납 요구 사기 수법; 추가 송금 요구 시 멈춤 | ¶3 | preserved |
| 虛擬資產服務法 2026-06-30 통과; 시행일 행정원 결정 (금관회 발표) | ¶4 | preserved; citation moved to parenthetical |
| 증거 보전 목록; 거래소에 서면 질의 | ¶5 | identical |
| 절차는 대만에서; 경찰 신고; 165 사이트; 민사소송 대만 법원; 가압류 (민소법 제522·523조) | ¶6 | preserved |

### §6 상담 (heading "대만 현지에서의 법률 상담" → "대만 현지 상담")
| Original | Rewrite | Status |
|---|---|---|
| 사무소가 대만 현지에서 함께할 수 있는 범위 5가지 | ¶1 | preserved |
| 대만 거주자 판단·대만 신고 질문도 가능 | ¶1 | preserved |
| 한국 가상자산소득 신고·해외금융계좌 신고는 한국 세무사 | ¶1 | preserved |
| 실제 판단은 개인 기록·사실관계에 따라 달라짐 | ¶1 end (moved from ¶2) | preserved |
| 증준외 변호사 이메일 | ¶2 | preserved; sales-flavoured "대만 사건 상담을 원하시면 … 보내 주시면 됩니다" shortened to a plain contact line |
| 첫 이메일 기재 항목 7가지 | ¶2 | preserved |
| 사무소 주소 | ¶2 | preserved |

### 참고한 공식 자료 / 확인일
Byte-identical to the original (verified by string comparison).

Nothing added: no new facts, examples, numbers, cases, first-person material or promises. Three reader questions were added as rhetorical openers; none asserts anything.

## Blocking issues

None.

## MONOTONY items

None blocking. Self-check §5 items 2–7: opener is a reader question, not a stock formula (2 ok); very short sentences present, e.g. "거주자 판단에서 갈립니다.", "해외 업체도 마찬가지입니다.", "안전도 출금도 보증하지 않습니다." (3 ok); after the reviewer's two reorders, paragraphs starting with "대만" dropped from 5 to 3 (intro, 대만의 거주자, 대만 재정부), same count as the original (4 borderline, tool passes); no three consecutive claim→다만 paragraphs, several citation-free paragraphs (5 ok); contrast templates 0 (6 ok); closing is the contact tail, which the rule exempts, and the disclaimer sentence is original content that must be kept (7 ok). Register is 합니다체 throughout with one "~지요" and three "~까요?" for variation. Reads as a Korean practitioner's explainer, not as a template.

## Tests verdict

PASS. tests.patch touches only `src/lib/__tests__/expertise-columns-20260930.test.ts`: the pinned lastmod for ko/043 moves 2026-10-06 → 2026-10-12 and the explanatory comment adds ko/043 to the 2026-10-12 rewrite list. No assertion removed, no .skip/.only, no other column's expectation changed. Vitest after patch: 75 files passed (tests.txt).

## Tiny edits applied by reviewer (guard re-run: PASS; variety: FAIL 0)

1. §1 ¶1: "…으로 분류하고, 다른 종합소득과 합산하지 않고 따로 계산합니다(…)" → "…으로 분류하고, 이 소득은 다른 종합소득과 합산하지 않고 따로 계산합니다(…)". Reason: without a subject, 제21조 read as the thing that "calculates separately"; the 제14조 cite stays attached.
2. §1 ¶2: "합치면 그 금액의 22%입니다." → "합치면 250만 원을 넘는 부분의 22%입니다." Reason: "그 금액" had no clear antecedent and could be read as the whole 가상자산소득금액; restored the original's exact phrase (no new number).
3. §4 ¶3: "대만에서 세금을 냈다면 납부 증빙도 남겨 둡니다." → "세금을 대만에서 냈다면 납부 증빙도 남겨 둡니다." Reason: word order only, cuts a "대만"-initial paragraph.
4. §5 ¶4: "대만 입법원은 2026년 6월 30일 虛擬資產服務法을 통과시켰습니다." → "2026년 6월 30일 대만 입법원은 虛擬資產服務法을 통과시켰습니다." Reason: word order only, same purpose.

Post-edit guard: length 3722 -> 3722 (100%), monotony score 26.3 -> 12.1, GUARD: PASS. Post-edit variety: cv 0.487, short 0.115, opener_rep 0.074, cite_end 0.092, contrast 0, FAIL 0.

## Original issues (not blocking, unchanged by the rewrite)

- §2 ¶3: the sentence pair "사업자가 양도가액의 10%와 이익의 20% 중 적은 금액을 원천징수" (국세청 안내) and "제156조 제1항 제8호 나목은 필요경비 미확인 시 지급금액의 10%" sit together as a "다만" contrast; the original presents them this way and the rewrite keeps it. Whether 나목 is the right 목 for the 10%-of-payment rule was not re-verified in this review.
- §6: office street address is in the contact paragraph; guard flags it as a pre-existing lint item tolerated as house format.
- All statute/notice states are as of 2026-09-29/30 per the original's 확인일; nothing re-verified against the live sources today.
