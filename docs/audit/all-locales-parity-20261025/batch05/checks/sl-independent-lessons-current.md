# LESSONS — 검수자가 반복해서 지적한 실수 Top 25 (자동 생성 2026-10-26 01:04 KST)

작성·수정·번역 전에 읽는다. 각 항목의 한 줄 교훈을 지키면 Fable·Opus·Grok·Astra 검수의 반복 반려를 줄일 수 있다.
생성: `~/tseng-lanes-shared/build-lessons.py` (2시간마다 launchd 자동 실행, 규칙 기반·LLM 미사용). 원천: 리뷰 파일 672개에서 뽑은 지적 4188건(중복 제거) — gap·cols1006·issue·col-0930/1001·가사·사기·반도체·상속·교통 레인과 origin/main docs/columns/reviews·docs/audit.
정렬: 차단(blocking) 지적 수 + 경미 지적 0.5배. "최근3일" = 최근 3일 안에 수정된 리뷰 파일의 지적 수. 예시는 원문 일부(검수자 문장 그대로, 사실 판단은 각 리뷰 파일 참조).
함께 지킬 규칙: SENTENCE-VARIETY-RULE.md(문장 다양성), COLUMN-VOICE-RULE.md, docs/columns/EDITORIAL-VOICE.md, 레인 SPEC. 충돌 시 정확성·SPEC 우선.

## 1. wrong-citation — 307건 (차단 219, 최근3일 123)
- 교훈: 조문 번호·항·호와 링크(pcode·flno)가 문장의 주장과 정확히 맞는지 링크를 열어 대조한다. 비슷한 조문(제n조 vs 제n-1조, 항·款)을 혼동하지 않는다.
- 레인: repo-docs 123, family 87, gap 43, fraud 29, semi 13, issue 9
- 예: "M01 — 704의 僑生를 대만 출신 학생으로 좁힌 표현 — 이유: `от тайвански произход`는 대만 출신·계통이라는 한정을 만든다. 원문 EN의 overseas compatriot student와 법령의 僑生는 인정된 법적 지위이며, 대만 출신 학생으로 단순 치환할 수 없다. [수수료 기준 제3조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135)는 僑生 지위에 따른 감면이고, [자격 규정 제2조](https://law.moj.gov.tw/LawClass/L" — repo-docs, origin/main:/docs/audit/all-locales-parity-20261025/batch03/reviews/bg-independent.md

## 2. monotony-contrast — 287건 (차단 239, 최근3일 172)
- 교훈: 대비 틀(이 아니라/ではなく/不是…而是/rather than)과 같은 문장 구조 반복을 줄인다. SENTENCE-VARIETY-RULE 자기 점검을 실행한다.
- 레인: repo-docs 172, family 86, gap 21, fraud 5, semi 2, issue 1
- 예: "705 인접 문장 첫 단어 및 `For`3회,706 `Ved`4회를 실제 추출문으로 확인했다. 위 MONOTONY 항목대로 수정 필요하다. 작성자 기록의 시작 반복이 없다는 자기평가는 최종 기계·수동 대조로 보완된다." — repo-docs, origin/main:/docs/audit/all-locales-parity-20261025/batch02/reviews/nb-independent.md

## 3. deadline-amount — 277건 (차단 235, 최근3일 181)
- 교훈: 기한·금액·비율·상한은 조문 원문 숫자로 맞추고, 기산점(안 날/송달일/공포일)을 함께 쓴다.
- 레인: repo-docs 181, gap 31, family 26, issue 13, semi 11, fraud 8
- 예: "판단: `kan søges`는 신청 가능한 시점을 말하며, FAQ1은 이미 `egne firemånedersperioder`라고 설명한다. 정확히 그날 신청해야 한다거나 이후에는 신청할 수 없다는 의무·금지로 쓰지 않았으므로 필수 오류로 판정하지 않았다." — repo-docs, origin/main:/docs/audit/all-locales-parity-20261025/batch02/reviews/da-independent.md

## 4. judgment — 261건 (차단 158, 최근3일 104)
- 교훈: 판결은 법원·날짜·사건번호·심급·확정 여부를 원문으로 확인하고, 1심이면 1심이라고 쓴다. 당사자 식별 정보는 넣지 않는다.
- 레인: repo-docs 104, family 93, fraud 29, gap 17, semi 14, issue 2
- 예: "직접 근거: [주요 캡처](./cases-ja-final-source-captures.json), [추가 판결 캡처](./cases-ja-final-source-captures-supplement.json), [연혁 캡처](./cases-ja-final-history-captures.json). 각 파일 해시는 최종 JSON에 고정했습니다." — repo-docs, origin/main:/docs/audit/case-trends-20261025/work/reviews/cases-ja-final.md

## 5. frontmatter-faq — 239건 (차단 179, 최근3일 126)
- 교훈: 프런트매터(topic, audience, author, FAQ 1–3, featured_image 경로, 날짜)를 SPEC대로; FAQ 답은 본문과 일치.
- 레인: repo-docs 126, family 44, fraud 17, gap 16, issue 13, semi 11
- 예: "FAQ L21 “그렇게 판단하면 안 됩니다.” — 질문에 답하는 구체적 법적 효과보다 독자를 꾸짖는 문장이 먼저 나옵니다. 제안: 삭제하고 “이 사건은 협회를 통한 청구 뒤 6개월 안에…”로 바로 답합니다. 의미 보존: 예." — repo-docs, origin/main:/docs/audit/case-trends-20261025/work/reviews/cases-ko-locale-r1.md

## 6. zh-native — 159건 (차단 111, 최근3일 84)
- 교훈: zh-hant는 대만 실무가가 대만 독자에게 쓰는 말로: 대륙 용어·번역투·공문 투(官腔, 查得 등) 금지. ja·ko도 번역투를 원어민 표현으로.
- 레인: repo-docs 84, family 42, semi 9, fraud 7, issue 7, gap-0929 3
- 예: "The family FAQ asks the reader’s status and category without purporting to enumerate every sponsor condition. Its general wording does not contradict or exclude the permanent-residence branch. The distinct work-permission explanation and document-based conclusion remain valid; neither promises autom" — repo-docs, origin/main:/docs/audit/codex-column-recheck-20261024/reviews/fr-independent.md

## 7. contact — 144건 (차단 110, 최근3일 89)
- 교훈: 연락처는 SPEC대로 이메일과 사무소 주소만, 한 번. 전화번호·핫라인 금지.
- 레인: repo-docs 89, family 34, gap 8, fraud 5, semi 5, issue 2
- 예: "706: 주소변경기산·현재카드만료와의 독립성 뒤에 사유소멸·취소·법정예외·날짜자료를 둔다. 첫 두 문단을 관용적 인사말처럼 삭제할 수 없다." — repo-docs, origin/main:/docs/audit/all-locales-parity-20261025/batch02/reviews/fi-independent.md

## 8. heading-intro-ai — 129건 (차단 99, 최근3일 73)
- 교훈: AI식 명령형·체크리스트 소제목, 제목 반복형 도입, 상투적 서두를 쓰지 않는다. 소제목은 그 글만의 쟁점으로.
- 레인: repo-docs 73, family 22, semi 11, issue 8, fraud 5, cols1006 4
- 예: "DE: generic warnings repeating professional-portal restrictions, document imperatives and travel cautions were replaced or removed while the operative rules and exceptions remain." — repo-docs, origin/main:/docs/audit/codex-column-recheck-20261024/reviews/final-europe.md

## 9. law-version — 93건 (차단 74, 최근3일 43)
- 교훈: 개정·시행일을 확인한다: 공포일과 시행일이 다른 조문, 시행일 미정 개정, LawOldVer 페이지를 구분하고 "몇 년 몇 월 현재" 기준을 적는다.
- 레인: repo-docs 43, semi 24, family 10, fraud 7, gap 6, cols1006 2
- 예: "L67 “2022년 개정 제68·70조 등의 미시행 표시를 현행 조문으로 읽지 않도록 주의해야 합니다.” — 법령 자료 상태를 독자 훈계로 표현합니다. 제안: “2022년 개정 제68·70조 등은 확인일 현재 시행 전입니다.” 실제 시행 중 구법 링크는 유지합니다. 의미 보존: 예. 시행 전 개정문을 본문 근거로 바꾸지 않아야 합니다." — repo-docs, origin/main:/docs/audit/case-trends-20261025/work/reviews/cases-ko-locale-r1.md

## 10. unsupported — 81건 (차단 67, 최근3일 54)
- 교훈: 출처로 확인되지 않는 문장은 쓰지 않는다. "항상/반드시/절대" 같은 단정은 조문이 그렇게 말할 때만 쓴다.
- 레인: repo-docs 54, family 10, issue 5, semi 5, gap 4, inherit 2
- 예: "법률 의미: 실질 보완. 원문의 일반적인 무비자 설명에 행정 안내상 제외·예외를 연결하므로 최종 법률 검수 대상이다. 제16조의 법정 경로를 폐지하거나 특정 국적의 신청 가능 여부를 일괄 단정하는 수정이 아니다." — repo-docs, origin/main:/docs/audit/arc-visas-20261024/reviews/ko-locale-r1.md

## 11. first-person-hypo — 76건 (차단 62, 최근3일 42)
- 교훈: 가상 장면은 가상이라고 표시하고, 변호사 본인 체험·의뢰인 일화를 지어내지 않는다. 가상 표시는 문장 속이나 장면 뒤에 둔다(SENTENCE-VARIETY-RULE 2-4).
- 레인: repo-docs 42, semi 11, fraud 8, gap 7, family 4, cols1006 2
- 예: "704는 구체적 기산 사실, 705는 입국 방식에 따른 결과, 706은 사유가 먼저 끝난 경우의 독자 질문으로 시작한다. 가상 장면 공식이 없다. 첫 두 문단을 지우면 각각 기산·통합증명 예외, 입국 방식·여권 조건, 사유 상실 효과가 사라진다." — repo-docs, origin/main:/docs/audit/all-locales-parity-20261025/reviews/fil-independent.md

## 12. length-shape — 69건 (차단 37, 최근3일 8)
- 교훈: 짧은 형식 길이(ko·zh 900–1,400자, ja 기준, en 500–800 words)를 lint로 확인. 핵심 법적 요건은 줄이지 않는다.
- 레인: family 17, fraud 14, issue 10, semi 9, gap 8, repo-docs 8
- 예: "read_time "8분" → 늘어난 분량에 맞춰 "5분 분량"으로 바꿈. 리뷰어 제안은 4분이었습니다." — repo-docs, origin/main:/docs/columns/reviews/2026-10-02/claude-raw/065-fixlog-f1.md

## 13. ja-register — 54건 (차단 48, 최근3일 39)
- 교훈: ja는 です・ます체로 통일, ko는 합니다체로 통일(외부 초안의 해라체 섞임 주의).
- 레인: repo-docs 39, family 5, gap 5, cols1006 2, fraud 1, inherit 1
- 예: "Final CLI: all three measured, exit 0 / FAIL 0; the remaining です・ます ending warnings are disclosed below. The checker was not changed." — repo-docs, origin/main:/docs/audit/codex-column-recheck-20261024/reviews/ja-author.md

## 14. cross-language — 52건 (차단 48, 최근3일 38)
- 교훈: 네 언어판의 사실·숫자·조문·결론이 서로 일치해야 한다. 한 언어를 고치면 나머지도 같이 고친다.
- 레인: repo-docs 38, gap 10, cols1006 1, family 1, gap-0929 1, semi 1
- 예: "Real CLI on all four: exit 0 and FAIL 0, with final hashes above. This is not a language-quality verdict by itself." — repo-docs, origin/main:/docs/audit/case-trends-20261025/work/reviews/existing-hi-repair-report.md

## 15. image — 58건 (차단 20, 최근3일 6)
- 교훈: 히어로 이미지는 가상·비식별, 얼굴·문자·로고·국기·읽히는 서류 없음, 글과 맞게.
- 레인: family 29, fraud 15, repo-docs 6, issue 4, semi 3, gap 1
- 예: "2026-10-03 南区案内: divorce certificate, 戸口名簿, 国民身分証, foreigners: passport etc., photo; photo sometimes omitted; ask office about counterpart documents in one-party filing and ID renewal -> P3. Preserved (foreigner item split into its own sentence)." — repo-docs, origin/main:/docs/columns/reviews/2026-10-13/rewrite/ja-115-japan-kyogi-rikon-recognition-taiwan-fable-r1.md

## 16. sources-list — 47건 (차단 30, 최근3일 20)
- 교훈: 본문 인라인 링크와 글 끝 출처 목록을 모두 두고, 본문에 쓴 출처가 목록에 빠지지 않게 한다.
- 레인: repo-docs 20, family 13, fraud 6, semi 5, issue 2, gap 1
- 예: "정확한 문장: “한국에서 발급한 문서의 인증·번역 요구는 [BOCA 목록의 한국 주재 공관](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html)에서 담당 접수처를 찾아 확인합니다.” — 이유: 본문에서 사용한 BOCA 공관 목록 URL이 끝 목록에 없다. KO704-01과 같은 현행 출처 목록 규칙이 적용된다." — repo-docs, origin/main:/docs/audit/arc-visas-20261024/reviews/ko-locale-r1.md

## 17. duplicate-scope — 41건 (차단 26, 최근3일 24)
- 교훈: 기존 칼럼과 겹치지 않게 범위를 좁히고, 레인 주제·대상 독자에서 벗어나지 않는다.
- 레인: repo-docs 24, family 9, fraud 5, semi 2, inherit 1
- 예: "S02 해결: 마지막 NIA 문의의 중복 문장만 삭제되었다. 그 앞의 실제 문의 절차·귀환 문서·APRC 예외·F23는 남았다." — repo-docs, origin/main:/docs/audit/all-locales-parity-20261025/batch02/reviews/fi-independent.md

## 18. internal-link — 31건 (차단 21, 최근3일 17)
- 교훈: 내부 링크는 그 언어에 실제로 있는 슬러그만(topics/LINKS.md·origin/main 확인). 없는 칼럼으로 링크하지 않는다.
- 레인: repo-docs 17, family 12, fraud 2
- 예: "원고에 쓰인 `/ko/columns/` 링크는 해당 로컬 slug 파일이 모두 존재했다. 704→705·706, 705→704·706·027·028, 706→704·705를 확인했다. 새 원고 링크의 공개 배포 성공을 의미하지 않는다." — repo-docs, origin/main:/docs/audit/arc-visas-20261024/reviews/ko-locale-r1.md

## 19. check-date — 32건 (차단 19, 최근3일 11)
- 교훈: 시점에 따라 달라지는 사실(금액·통계·개정 상태)에는 "YYYY년 M월 D일 현재" 기준일과 확인일을 단다.
- 레인: family 16, repo-docs 11, semi 4, issue 1
- 예: "우크라이나어 서술이 일관되고 러시아어 문장 혼입은 발견하지 않았다. `ы/э/ъ/ё` 검출 0은 보조 확인일 뿐 원어민 검수의 증거가 아니다. S02와 같은 국소적 번역투는 별도로 기록했다. 공개 작성자, 꾸민 1인칭 경험, 굵은 강조, 본문 H1은 없다. 내부 author와 `Вигадана сцена` 캡션은 유지된다." — repo-docs, origin/main:/docs/audit/all-locales-parity-20261025/batch02/reviews/uk-independent.md

## 20. promo-guarantee — 21건 (차단 19, 최근3일 19)
- 교훈: 결과 보장·판촉 문구·불안 조성 금지. 상담 안내는 필요할 때 한 문장.
- 레인: repo-docs 19, gap 1, inherit 1
- 예: "L40 “이름을 지워야만 판매할 수 있다는 뜻일까요?” — 상품 식별에 필요한 사용을 설명하는 데 이름을 모두 지운다는 과장된 전제를 새로 세울 필요가 없습니다. 제안: 삭제하고 앞의 브랜드 이름 사용 필요에서 제36조 조건 설명으로 바로 이어 갑니다. 의미 보존: 예. 같은 repair1에 추가 전달했습니다." — repo-docs, origin/main:/docs/audit/case-trends-20261025/work/reviews/cases-ko-locale-r1.md

## 21. statistics — 18건 (차단 14, 최근3일 10)
- 교훈: 통계는 공식 원문(기관 발표)을 열어 인용하고 기준 연도를 쓴다. 2차 기사 숫자 금지.
- 레인: repo-docs 10, family 5, fraud 1, issue 1, semi 1
- 예: "Figures are employer-qualification requirements, not a universal minimum capital; meeting them ≠ automatic work permit -> closing para -> preserved (split into two sentences)." — repo-docs, origin/main:/docs/columns/reviews/2026-10-12/rewrite/en-001-taiwan-company-establishment-basics-fable-r1.md

## 22. privacy — 16건 (차단 14, 최근3일 10)
- 교훈: 실존 당사자 이름·식별 정보 금지(판결 당사자 포함).
- 레인: repo-docs 10, family 3, issue 2, semi 1
- 예: "FR937-M2: removed the generic file-control instruction. The paragraph now identifies the actual per-format approval, archived versions and removal access. The short crop sentence describes a concrete failure instead of repeating a general instruction." — repo-docs, origin/main:/docs/audit/market-expansion-20261025/work/reviews/fr-locale.md

## 23. bold — 15건 (차단 14, 최근3일 11)
- 교훈: 굵은 글씨(**, <strong>)는 모든 언어에서 금지.
- 레인: repo-docs 11, family 1, gap 1, gap-0929 1, issue 1
- 예: "판정: **APPROVE — MUST 0, 미해결 NIT 0**. 이 SHA에 기존의 법률·출처 검토 결과가 적용된다." — repo-docs, origin/main:/docs/audit/fraud-semiconductor-20261003/reviews/fraud-ja-legal-r1.md

## 24. review-claim-author — 9건 (차단 7, 최근3일 6)
- 교훈: 변호사 검토·감수 주장 금지, 저자는 legal-ai-assistant, Wei Tseng 변호사는 여성.
- 레인: repo-docs 6, family 1, issue 1, semi 1
- 예: "실제 읽기 검사에서 세 편 모두 본문 H1 없음, 굵은 글씨 없음, FAQ 3개를 확인했다. 내부 `author: legal-ai-assistant`가 유지되고 공개 AI/사람 작성자 표시를 본문에 추가하지 않았다." — repo-docs, origin/main:/docs/audit/arc-visas-20261024/reviews/ko-locale-r1.md

## 25. official-name — 6건 (차단 6, 최근3일 3)
- 교훈: 법령 영문명은 law.moj.gov.tw/ENG 공식 명칭을, 일본어·한국어 표기는 일관되게.
- 레인: repo-docs 3, issue 2, semi 1
- 예: "en — ORIGINAL-RIGHT, accepted. One consistent name in body and list; no official English title to contradict it. The Highway Act English text calls the instrument "regulations", but "rules" is a generic word for subordinate legislation and nothing official shows the label to be an error. Not a FIX i" — repo-docs, origin/main:/docs/columns/reviews/2026-10-12/factfix/taiwan-traffic-accident-procedure-fable-r1.md

## 미분류 지적에서 자주 나온 단어 (새 유형 후보)
- taiwan 149, sentence 122, article 98, paragraph 90, preserved 78, applied 75, original 75, column 63, major 63, three 61, after 57, first 57, draft 54, section 53, court 51, legal 49, sentences 47, change 45, minor 45, foreign 44, 문장 43, under 42, required 39, already 39, child 38 (미분류 1664건)
