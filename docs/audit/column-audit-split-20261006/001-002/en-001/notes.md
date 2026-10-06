# notes — 001 en

## 확인한 것
- 링크 대상 파일 존재(repo `src/content/columns-en/`): 004-taiwan-company-subsidiary-vs-branch.md, 015-taiwan-company-setup-pitch-location.md, 029-taiwan-permanent-residence-aprc.md. 링크 형식 `/en/columns/<slug>` (같은 폴더 다른 칼럼의 기존 링크와 동일).
- 004 §6 "The Taiwan–Korea Income Tax Agreement and Permanent Establishments (PEs)"가 서명(2021-11-17)·발효(2023-12-27)·적용(2024-01-01)·배당/이자/사용료 각 10%·PE 4유형(6개월 건설, 183일, 대리인)을 001보다 깊게 서술. 001의 숫자·날짜는 004와 일치. 001 en 원문에는 서명일이 없고 새 사실을 쓰지 않는다는 지시에 따라 추가하지 않음(WO 2항의 "서명" 항목은 en에는 해당 문장 없음).
- 015는 타이베이 영업장소 사전조회(Type II 등기부 필요, 2023-01-01부터 등록 신청에 결과 첨부)를 다룸 → §3 사전조회 문장에 링크.
- 029 첫 절 "What is the general five-year route?"는 Immigration Act 제25조 5년·연 183일·네 요건·제외 기간·신청기한을 서술 → §4 영구거류 문단은 첫 두 문장 + 링크로 축약. 001 원문 숫자(5년·183일)와 일치.
- 변형 없음 점검: draft의 모든 문장을 원문과 대조(스크립트) — 원문과 다른 문자열은 connectors.md C1~C9에 전부 기록됨(총 138단위 중 16, 대부분 목록 항목·링크 삽입).
- 굵은 글씨 없음, 원문 링크 URL 전부 유지(출처 11개), 이미지 5개 원위치.

## 판단이 애매한 곳 (리드·검수자 결정)
- N1 FAQ2 복사 문단: L101 s1("Forming a company does not by itself confer work authorization or residence status.")만 H3 첫 문장으로 남겼다. §4 안에 "거류 지위" 직접 문장이 없어 FAQ2 답과 본문 일치를 위해서다. 도입 문장과 일부 겹친다고 보면 삭제해도 된다(그 경우 FAQ2 본문 근거는 L105 s2 "an ARC must be applied for separately"뿐).
- N2 의친거류(L113)는 링크·축약하지 않았다. 028은 "대만 호적 국민의 외국인 배우자" 거류(Immigration Act 제23조 제1항 제1호)이고, L113은 근로허가 기반 ARC 소지자의 배우자·미성년 자녀라 대상이 다르다. 028 제목·소제목(What residence status does a foreign spouse get? / Can I work on a spouse ARC? / How do I extend … / spouse dies or divorce / mainland spouses / permanent residence)에 외국인 근로자 가족 거류가 없다. WO 5항의 "없으면 유지"에 따랐고, 분류 보고(HUB-TRIM 불가)와도 일치. 027(골드카드)도 대상이 달라 쓰지 않았다.
- N3 영구거류(L115): s3("merely holding a work permit or ARC for five years does not automatically confer permanent residence")를 지웠다. 029가 제외 기간과 네 요건을 서술하지만 이 문장 자체는 없다. 필요하면 s3 복원(약 35w).
- N4 L89 s1·s2, L91 s1, L81 s3은 일반론·재요약·실무 조언이라 지웠다(L127 s3은 R2에서 복원). 법적 조건·기한·금액은 없음(ledger에 남은 곳 기재). 지나치다 싶으면 L81 s3("not only company registration but also the time required …")이 가장 쓸모 있는 문장이다. 복원하면 대비 틀이 4개가 되어 variety 도구 contrast 한도(≤3)를 넘는다.
- N5 §4 구조: 영구거류·의친거류 문단을 "Company Capital and Work Permits for Foreign Managers" 소절에서 "Company Formation, Work Authorization, and Residence" 소절로 옮겼다(내용상 거류이며 자본 소절 주제가 아님). 소절 제목은 그대로다. 되돌려도 문구 변경은 없다.
- N6 004로 가는 링크는 §1에 하나만 있다. §5의 PE·협정 문단도 004 §6이 더 깊이 다루므로 링크 후보지만, WO가 "문장 속 자연스러운 한 곳"을 요구해 두지 않았다.

## 확인 필요 (열어 보지 못함 / 지시 범위 밖)
- 확인 필요: 외국인 경리인 취업허가 고용주 요건 수치(설립 1년 미만: 자본 NT$500,000·매출 NT$3 million·수출입 US$500,000·수수료 US$200,000; 1년 이상 3개 및 최근 1년/직전 3년 평균) — WDA SOP(출처 목록 4번째) 미열람. 원문 수치를 그대로 옮겼다.
- 비거주자 배당 원천징수 21% (§5 첫 문단): 리드가 F-009에서 각종所得扣繳率標準 제3조(G0340028 flno=3)로 확인. 이 작업자는 URL을 직접 열지 않음. 사업세 5%는 사업세법 제10조(세율 범위)·행정원 고시 구조라 출처만 추가하고 본문은 유지.
- 확인 필요: "Department of Investment Review, Ministry of Economic Affairs (MOEA)" 기관명, 제3국 적용 범위는 이 작업 범위 밖이라 열지 않음.
- POLICY: 허브가 링크하는 legal-ai-assistant 칼럼은 사실점검(B) 대상 편입. 029는 `author: "legal-ai-assistant"` → 편입 필요. 004·015는 author 없음(변호사 명의).
- 변호사 직접 검토 미경유: 이 draft는 변호사 명의 글에서 원문 문장을 고르고 옮기고 지운 결과이며, 연결 구는 connectors.md에 전부 있다.

## 문체 점검 (variety_metrics.py, en)
- 원문: FAIL 4 — len_cv 0.366, short_share 0.011, top_opener_n 9, contrast 5.
- draft: FAIL 2 — len_cv 0.351(한도 ≥0.45), short_share 0.015(한도 ≥0.08). top_opener(최대 3, 한도 3)·contrast(3, 한도 3)는 통과.
- 남은 두 개는 원문 문장만 쓰는 조건에서 풀리지 않는다(짧은 문장을 새로 쓸 수 없음, 문장 쪼개기는 하지 않음). 후속 문체 단계에서 처리 필요. 새 첫 문단·§5 끝 문단은 사실 문장으로 시작·종료(정형 고지·판촉 없음).
- 도입 첫 두 문장 삭제 실험: L29 s1·L27 전체를 지워도 사실·조건 손실 없음(ledger 참조).

## 길이
- 전 2,739w → 후 2,129w (본문, 출처 목록·맺음 제외; F-010 문장·R2 복원 포함). 숫자 목표는 R2에서 폐기. read_time = 본문(출처 앞) 2,129÷230 = 9.3 → 9 min.
- 보고서 추정(≈2,000w)과 같은 방향. 분할 없음, §1–§5 구조 유지.
