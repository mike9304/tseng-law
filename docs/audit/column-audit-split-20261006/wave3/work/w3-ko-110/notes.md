# notes — ko 110 HUB-TRIM + 제목 범위 하향

## 읽은 자료
POLICY.md v1.1, repo docs/columns/EDITORIAL-VOICE.md, studio-tools/SENTENCE-VARIETY-RULE.md·LESSONS.md, fixspec/110.md, reviews/wave3-fable.md (3), reports/classify-r1.md 110절, factcheck/ko-110.md, 원문 전문(143행).
링크 전 확인: ko-116 `taiwan-trade-secrets-act-criminal-civil-korean-companies` §「형사책임에는 불법 이익·가해 목적이 더 필요합니다」(L60–68): 제13조의1 요건(목적·행위 유형·미수)·법정형(5년 이하·100만~1,000만)·제13조의3 고소·제13조의2(국외 사용 목적, 1~10년·300만~5,000만)·법인 양벌(제13조의4)·외국법인 소송(제15조)까지 같은 깊이. ko-030 `enforce-foreign-judgment-in-taiwan` §「대만이 승인을 거절하는 네 가지 사유」(L35–44: 제402조 4사유·응소·송달 예외)와 §「압류에 앞서 어떤 대만 판결을 받아야 하나요?」(L46–50: 제4조의1·관할)가 같은 깊이. 둘 다 audience ko, author legal-ai-assistant(같은 작성자 레인 안의 링크).

## 1. 길이 (비공백, URL 제외, 출처 목록 전, H1·H2 포함)
- 전 7,583자 → 후 6,952자(−631자, −8.3%).
- HUB-TRIM① −320(L48·L50), HUB-TRIM② −111(L108·L110), L106 −83, L88 −43, L38 −33, L52 −29, L68 −22, H1 +10.
- 어절(공백 구분, 링크는 문구만): 본문 2,231 → 2,037.

## 2. 제목·seoTitle (fixspec 1)
- title 52자(H1·Article headline), seoTitle 24자.
- 길이 규칙: `src/lib/__tests__/column-seo-title-frontmatter.test.ts`의 「seoTitle + 접미사 ≤ 60자」(129~135행)는 영어 코퍼스(`src/content/columns-en`)에만 걸린다(접미사 ' | Hovering Law'). ko 칼럼에는 seoTitle 길이 테스트가 없다. 다만 repo의 ko seoTitle 72개는 최장 42자(+접미사 10 = 52자)라 사실상 60자 안에 있다. ko 접미사는 `src/lib/seo.ts`의 organizationName.ko 「법무법인 호정」, `<title>` 형태 「본문 | 법무법인 호정」(localized-page-titles.test.ts의 홈 제목 예). 계산: 24 + 10(' | 법무법인 호정') = 34자. EN 접미사(15자)를 가정해도 39자 ≤ 60.
- 제목·seoTitle 고정 테스트: 없음. 옛 title·seoTitle 문자열은 src·docs·scripts 전체에서 이 파일 밖 일치 0건. 110 파일명은 `native-locale-columns.ts` 목록과 `semiconductor-board-columns.json`(slug 목록)에만 있어 제목 변경 영향 없음. 이 작업에서는 테스트를 실행하지 않았다(repo 읽기 전용).
- 테스트 영향 가능성: `src/data/__tests__/intent-pages-semiconductor.test.ts`는 intent 페이지 seoTitle만 본다. 확인 필요: 제목을 인용하는 반도체 허브 카드·임베딩 파일이 있는지는 slug 기준 참조만 확인했다.

## 3. summary
바꾸지 않았다. 새 제목(비밀유지·하자담보·책임제한·시효·분쟁 집행)과 summary(TSMC 공개 기준의 한계, 기술자료 공유·하자담보·대금 청구·분쟁 집행)가 충돌하지 않고, 책임제한이 빠졌을 뿐 제목이 summary를 넘는 방향이다. fixspec 1의 「어긋나면 첫 문장만」에 해당하지 않음.

## 4. read_time
- 계산식(WO: ko 어절 기준은 기존 값 비율): 12분 × (후 본문 어절 2,037 / 전 2,231) = 10.96 → 11분. 전체 content 기준 12 × 2,210/2,404 = 11.03 → 11분. 두 방식 모두 11.
- 참고: 원문의 「12분」은 수기 값이고 어떤 공식과도 맞지 않는다(ceil(어절/180)은 전 14·후 13, 500자/분은 전 15.2·후 13.9). 다른 ko 칼럼 테스트의 공식(ceil(전체 가시 어절/180))을 쓰면 13분이다. 110에는 read_time 고정 테스트가 없다. 리드가 공식을 정하면 값 하나만 바꾸면 된다.

## 5. D-001 (FAQ 답 ↔ 본문 문단)
- 방법: FAQ 3개 답변의 8자 조각이 본문 각 문단에 들어 있는 비율을 계산. 최대 FAQ1 ↔ L36 10%, FAQ2 ↔ L62 5%, FAQ3 ↔ L108(한국 판결 집행 문단) 4%. 같은 문단은 없다(classify 「FAQ 복사: 없음」과 같은 결과). 삭제한 문단 없음.
- FAQ3(한국 판결: 제402조·제4조의1 집행 허가 판결)은 HUB-TRIM② 뒤에도 본문(C3)과 030 링크와 일치한다. FAQ는 그대로.

## 6. 하지 않은 것·리드 확인 요청
1. factcheck O-1(OUTDATED): 출처 목록 L139 「민사소송법 제217조 … 2025년 7월 12일 시행본」은 2026-10-02 시행본이 현행. fixspec에 없어 미반영. 최소 수정은 「2026년 10월 2일 시행본」 또는 시행일 삭제. U-6(UN 조회일 「2026년 10월 1일」, 이번 열람 06일)도 미반영.
2. TSMC 문서 UNVERIFIED(U-1~U-4)는 factcheck가 FAQ1·L36 게시 전 확인을 권고한 항목. 이 작업에서 열지 않음(환경 403).
3. 유보문 판단: 지운 곳: L52 s3, L68 마지막 문장, L88 s4, L38 s2 후단. 남긴 것: L62 「모든 하자 관련 청구에 공통되는 기간은 아닙니다」(제365조는 해제·감액만이라 한정), L64 s1(약정이 법정 권리를 배제·변경하는지: 면제·제한 특약 가능 여부를 묻는 문장이라 다른 절에 없음), L90(적용 법률 판단: L88과 다른 대상).
4. 추가 후보(wave3 지적 밖이라 미적용): L112 s1~s2가 L98·L100 s4~s5와 부분 중복(중재지·절차법·실체법 구분, 제37조 vs 제47조 경로). 손대지 않음. 원하면 L112 s2 삭제 가능. classify가 군더더기로 짚은 L68의 가상 사례 문장도 wave3 (3) 지목 밖이라 유지.
5. HUB-TRIM② 문장 구성: fixspec의 「첫 실질 문장 1개」만 남기면 제402조가 3사유만 있는 것처럼 읽혀(원문은 L108 s3에서 응소하지 않은 피고를 4번째로 둠) C3에 4번째 사유와 집행 허가 판결 요건을 짧게 넣었다. 더 짧게 하려면 C3에서 「응소하지 않은 패소 피고에 관한 사유와,」만 지우면 된다(그러면 L108 s2를 「세 가지 사유 중」으로 읽을 위험이 남음).
6. L106 민사집행법 제26조 제1항·제27조 언급은 삭제(1문장 요건). 한국 중재법 제39조 링크는 본문과 출처 목록에 남음.

## 7. 문체 점검(variety_metrics --lang ko)
- 원문: sentences 160, cv 0.527, short 0.131. FAIL 2(top_opener_n=6, consec_same_start=9), WARN 2(85%가 「니다.」, 다만 류 6).
- draft: sentences 140, cv 0.553, short 0.121. FAIL 2(top_opener_n=6, consec_same_start=8), WARN 2(「니다.」 85%, 다만 류 5).
- 두 FAIL은 원문부터 있었고 이번 WO 범위(문장 쪼개기·새 문장 금지) 밖이다. 새 문단의 첫 단어는 「반대로」(L106), 기존 「형사책임에는」·「한국 법원 판결을」이라 가장 많은 시작어(「대만…」 6개)를 늘리지 않았다.

## 8. 기타 확인
- 굵은 글씨 0건(`**`, `__`, `<strong>`, `<b>` 검색). 지어낸 1인칭·새 연락처 없음. 프런트매터 키 순서·FAQ·summary 동일, 바뀐 키는 title·seoTitle·lastmod·read_time.
- gray-matter로 draft.md 파싱 성공, H1 == title 확인.
- URL: 원문 고유 URL 51개 → draft 53개(손실 0, 내부 링크 2개 추가). 링크 표기 64 → 66.
- 출처 목록의 영업비밀법 항목은 LawAll 링크(전 조문)라 L48·C1의 flno=13-1·13-2 LawSingle 링크는 본문에 둬서 보존.
- 이 글은 AI 작성(author legal-ai-assistant). 변호사 직접 검토 미경유 표기 대상 아님(변호사 명의 글 아님).
- repo는 수정하지 않았다. 산출물: draft.md, ledger.md, connectors.md, notes.md (orig.md·removed-*.txt는 비교용 사본).
