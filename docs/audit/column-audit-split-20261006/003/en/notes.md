# notes — en 003 TRIM (R3 반영본)

## 확인한 것 (실행한 검사)
- 원문 링크는 열어 보지 않았다(law.moj.gov.tw 미접속). 확인한 것은 URL 보존뿐: 원문 URL 43종이 초안에 모두 남아 있고 새 URL 없음(스크립트 비교, 조문 URL은 쿼리 순서 정규화).
- 출처 3블록(Q1–Q5 17항목, Q6–Q10 14항목, Q11–Q15 13항목)은 원문 자리(Q5 뒤·Q10 뒤·Q15 뒤)에 원문과 문자 단위로 동일. 끝머리 "## Official Sources" H2는 없음. H2/H3 순서는 원문에서 Q16–Q20 H2만 뺀 것과 같음.
- 굵은 글씨(`**`) 0건.
- 본문 길이(출처 블록 제외, inventory.py `prose_len` 방식): 원문 2,750 → R3 초안 2,531 words(See also 포함 2,765 → 2,546). 분량 목표 2,400보다 131 words 많지만 R2 지시(정확성·원문 보존 우선, 추가 삭제 금지)에 따라 그대로 둠.
- 변동 지표(`variety_metrics.py check --lang en`): 원문 FAIL 1(top_opener_n=7>6), R3 초안 FAIL 1(short_share=0.070<0.08, cv=0.505). 문단 시작 단어 반복은 순서 변경 4건으로 해소.
- fact fix F-006(Q14, 제188조 제2항 피해자 신청 요건)과 F-007(Q7, 제196조)은 리드가 준 문장 그대로(F-006만 연결 어구 "provides that" 추가). 법령 원문은 리드가 확인했다고 했고 나는 열어 보지 않음.

## 남은 FAIL — short_share 0.071 (한계)
- 8단어 이하 실문장은 "Personal safety and warning measures come first." / "Only one review is available." / "The assessment is individualized." / "No fixed range determines the result." 4개뿐. 도구는 문장 뒤 링크 캡션 4개("[National Fire Agency emergency numbers]" 등)도 짧은 문장으로 센다.
- 원문의 0.093(12/130)은 Q17–Q19의 맨 링크 줄 3개("284 · 276 · 41", "238 · 287", "185-4 · 62")와 Q18의 "Check payment and withdrawal arrangements separately."가 짧은 문장으로 집계된 덕이 컸다. 새 문장 금지라 TRIM 단계에서 올릴 수 없음. 문체 리뷰 단계 과제.

## 판단이 애매한 곳 (리드 결정 요청)
1. Q16: R3 지시로 첫 문장("Confirm what the insurer will handle, which documents it needs and the notice deadlines.")을 Q15 마지막 문단 끝으로 원문 그대로 이동. 둘째 문장은 삭제 유지(Q5 P1에 남음).
2. 도입: S1 유지, S2("Then examine claim deadlines, fault, and the scope of settlement.")만 삭제(순수 전개 예고), S3는 원문 그대로 복원, Q20의 결과 비보장 문장을 도입 끝으로 이동(R2). frontmatter `summary`는 "Then review fault, claim deadlines…"라는 전개 예고식이지만 "모든 키 유지" 지시로 손대지 않았다.
3. 인용 조문 Art. 276·Art. 41은 인라인 링크로만 존재하고 출처 블록 목록에는 없다(출처 블록은 원문 그대로 유지하라는 지시). 목록에 추가할지는 리드 결정.
4. read_time 11 min: 출처 제외 본문 2,531(See also 포함 2,546) ÷ 230 ≈ 11.0. 원문 8분은 수기값(정책 문구대로 재계산).
5. Q11 P3 S2는 원문 전체(끝의 "; Q12 addresses that issue separately." 포함)로 복원했다. 그 절은 상호 참조라 전개 예고로 보고 R1에서 지웠던 부분인데, R2 지시가 "원문 그대로 복원"이라 따랐다.
6. 같은 문항 안 반복으로 보였으나 남긴 것: Q6 P2 S3와 P4 S3(둘 다 "judicial referral 확인"이지만 각각 최초 감정 신청 단계와 재심 신청 단계), Q1 P1 S2와 P2 S2(합의·녹화로도 의무는 남음), Q13 P2의 "The assessment is individualized."와 "No fixed range determines the result."(짧은 문장 보존).

## 기타
- 확인 필요: Art. 62·276·41·287 조문 본문은 열어 보지 않았다. 옮긴 문장은 원문 서술을 그대로 따랐다.
- repo 파일·다른 언어판은 건드리지 않았다. 다른 언어에 Q16–Q20이 있는지, 같은 slug 4개 언어의 병행 여부는 이 작업 범위 밖.
- repo 테스트 중 이 글의 en 본문 문구(Q16–Q20, 출처 H3)를 직접 검사하는 것은 찾지 못함(`column-view-visibility.test.tsx`는 slug와 ko 로케일의 영상·도해 마커만 확인, `traffic-board.test.tsx`는 slug 링크). `diagram_after: "Q7. What losses can I claim after an accident?"`는 H2 문구가 그대로라 유효.
