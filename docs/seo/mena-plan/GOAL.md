# GOAL — tseng-law.com 중동(MENA) 레인 (2026-09-16 착수, 사용자 지시 02:30 손빗 중계)

총괄: Fable 5.1 (승계 순서·워커·규칙은 SEA 정본 `docs/seo/sea-geo-plan/PROMPT.md` §0·§4·§6 동일 적용). 워크트리 `~/Projects/tseng-law-mena-20260916` 브랜치 `mena/ar-guidance-20260916` (origin/main 8b23eb18).
목표: MENA(AE·SA·QA·KW·BH·OM·EG) 사람이 대만 회사설립·소송/분쟁이 필요할 때 tseng-law.com이 검색·AI에서 보이고 문의가 오게 한다. 1순위 locale `ar`(안내 언어, RTL). 상담 언어는 EN/ZH/JA/KO만 — ar 상담·통역 가능 표기 금지. tr/fa/he는 phase 2 후보 제안만.

## A. 보드
### M0 기반
- [x] 2026-09-16 03:0x M0-a 인벤토리 89행 → AR-LOCALE-INVENTORY.md (RTL 0·좌우 하드코딩 388·함정 5: middleware matcher/llms 4-guard/sitemap 리터럴/fonts/og:locale 폴백·넓히면 안 되는 계약 2). 원 항목: WO-M0-INVENTORY(Opus, 읽기 전용): vi/id/th/fil 추가 시 건드린 모든 지점 목록(GUIDANCE_LOCALES_4 참조 19파일 + 로케일 계약·middleware matcher·sitemap·llms·hreflang·언어 스위처·contact 폼·intake 계약·테스트·playwright·verify-multilingual-live·RTL 부재 지점) → docs/seo/mena-plan/AR-LOCALE-INVENTORY.md
- [x] 2026-09-16 03:00 M0-b 인텐트 42셀 → docs/seo/geo-mena-intent-map-2026-09.md 27dd6cc8 (H7: AE①②③·SA①②③·EG④, 체류 A급 극소·무역 B급 순위, 중재·집행 문서 0건 공백, 후보 4=중재/집행·비자 en/ar). Grok 검토 WO-M1-review 진행 중(03:00). 원 항목: WO-M1-INTENT(Opus, 리서치): MENA 7국 × 의도(회사설립·투자 / 소송·계약분쟁 / 미수금 / 비자·거류 / 상속·가족 / 형사) 질문 문장(아랍어+영어), 검색 표면, A~E 근거(대만-MENA 교역·체류 통계 공식 출처), 대응 URL → docs/seo/geo-mena-intent-map-2026-09.md
### M1 ar 로케일
- [x] 2026-09-16 M1-a 라우팅·RTL·폰트·hreflang(son7-b9 a3b0db44, 2단 등록) → merge 1035b851. [~] 03:3x 플립 WO-M3B-FLIP Opus 진행 중(잔여 문장 5·데이터 테스트 2·로케일 상수·테스트 카운트): `ar`를 안내 로케일에 추가(GUIDANCE_LOCALES_5), 라우팅·middleware·hreflang(ar)·sitemap·llms.txt·언어 스위처·RTL(`dir="rtl"` html/layout + 필요한 CSS 논리속성) — 콘텐츠는 임시 en 폴백 없이 M1-b와 동시 커밋
- [x] 2026-09-16 03:2x M1-b ar 콘텐츠(10키·FAQ 8·offices·team·inquiry-copy·answers 6, 마커 0, 상담언어 문장 단일) → 32516589 (vitest 19). 인벤토리 #40 zh-hant 오류 정정: src/data/international-guidance-content.ts 의 ar 블록(10 페이지키·faqs) — vi/en 안내 본문의 **기게재 사실만** 아랍어로(신규 법률 주장 0 → 마커 불필요), 상담 언어 4개 문장, 아랍권 독자 적응(호칭·기관명), 숫자·날짜 서식
- [x] 2026-09-16 M1-c Grok 검토 PASS 4/FAIL 2 → R1 927e28cb: 아랍어 자연스러움·MSA 일관·RTL 표기·언어 계약·광고 규정
- [x] 2026-09-16 M1-d 게이트: son7-b9 unit 10808·/ar 30뷰 RTL 실측 PASS(938e86b0 merge a78cf9b0) + 총괄 tsc·build·렌더 5URL(evidence/render-mena-rc.txt)
### M2 SEO/GEO
- [x] 2026-09-16 M2-a 답변 6·JSON-LD(availableLanguage 4)·/ar/llms.txt·hreflang·sitemap (플립 befed217로 자동 적용, 렌더 확인)
- [x] 2026-09-16 M2-b AI cite 문항 18(son7-db 1d7ec950, merge 71c4fca4; 실측 0=배포 후 손빗)
- [x] 2026-09-16 M2-c 색인·콘솔 계획(son7-db b2c4f636, M2c-INDEXING-PLAN.md, 손빗 ASK 초안 2; 실행은 배포 후 손빗)
### M3 폼·계약
- [x] 2026-09-16 M3-a inquiry-copy ar + PUBLIC_INQUIRY_LOCALES ar(CONSULTATION_LANGUAGES 불변), intake 테스트 그린(플립 커밋)
### M4 배포·측정
- [~] M4-a RELEASE-CHECK-MENA.md(6f9f1984, 갱신) → 배포 ASK 발송(아래 §B)
- [ ] M4-b 베이스라인 docs/seo/geo-mena-baseline-2026-09.md(GSC MENA 7국 28일·생성형AI·색인) 손빗 ASK
- [x] 2026-09-16 M4-c phase 2 언어 후보(son7-db 11d53415, M4c-PHASE2-LANGS.md: ur/tr/fa/he, 결정은 사용자)

## B0. 세션 분담(02:5x 합의)
- son7-51(소유): M0·M1(Opus 실행 중)·M3 ar 콘텐츠·Grok 검토·통합 merge·배포 ASK. 파일: international-guidance-content.ts·international-guidance-answers.ts·intent 문서.
- son7-b9: M2 라우팅·RTL·아랍 폰트·hreflang/sitemap/llms/seo.ts·middleware·layout/chrome/스위처·테스트 — 브랜치 mena/ar-routing-20260916, 워크트리 ~/Projects/tseng-law-mena-routing-20260916.
- son7-db: M2-b AI cite 문항(geo-mena-baseline-2026-09.md)·M2-c 색인 계획(M2c-INDEXING-PLAN.md)·M4-c phase 2 언어(M4c-PHASE2-LANGS.md) — 브랜치 mena/ar-content-20260916, src 무변경.
- 통합: 소유 브랜치가 두 브랜치 merge → 게이트 → RELEASE-CHECK-MENA → 사용자 ASK.

## B1. 전략 메모(M1 결과)
- MENA는 SEA와 달리 대만 내 체류 모수가 거의 없음 → 타깃은 **대만과 거래·투자하는 걸프 기업(AE·SA)**과 **이집트 체류자**. 콘텐츠 우선은 ① 회사설립·투자 ② 계약분쟁·**중재·외국판정 집행**(사이트 공백) ③ 미수금.
- ar 안내 10페이지는 기본이고, 신규 페이지 후보(중재·집행 en/ar, 비자 en/ar)는 마커 초안 → 변호사 검수.

## B2. RC2 대기(배포 후 merge)
- son7-b9 mena/ar-routing-20260916: 2d435998 뱃지 ar 라벨·guidanceColumnCategoryLabel 리졸버(vi/id/th/fil 영어 폴백 테스트 핀), 7a23c160 **SEA 카테고리 붕괴 수정**(vi/id/th/fil 칼럼 17편이 categoryFromString 미인식으로 전부 legal → frontmatter 문구 정규화·파리티 테스트, unit 10818). 결정: RC(76360346) 동결, ar 배포 후 RC2로 merge→게이트→ASK. vi/id/th/fil 뱃지 라벨은 frontmatter 문구 재사용.
- 초안 브랜치 mena/ar-drafts-20260916: WO-M5 중재·집행 랜딩 EN+ar(마커) Opus 진행 중(03:5x). main 금지, 변호사 검수 후.

## B. 미결·ASK
- 배포·유료광고·외부 등재 = ASK. 코드·기획·초안은 진행.
- SEA W1 측정과 병행: SEA 대기 프로세스는 유지, 상태는 OUT에.

## C. 로그
- 2026-09-16 02:3x · Fable 5.1 · 워크트리 생성, M0-a·M0-b 발주. 02:5x son7-b9/son7-db와 분담 합의. 자동 로케일 의견 OUT 발송.
