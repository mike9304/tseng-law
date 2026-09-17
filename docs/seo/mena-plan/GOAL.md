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
- [x] 2026-09-16 10:57 M4-a **배포 완료**: 사용자 직접 승인("배포 진행해") → push 8b23eb18..76360346 FF → Vercel success 11:00 → 라이브 6URL(lang=ar dir=rtl·availableLanguage 4·summary·hreflang ar·마커 0)·/ar/llms.txt 10·루트 카탈로그 9·sitemap /ar 10·verify:multilingual-live **PASS 558/0** → evidence/live-ar-76360346.txt, live-multilingual-76360346.log
- [~] M4-b 손빗: GSC 사이트맵·IndexNow /ar 10URL·MENA 7국 GSC 베이스라인(M2c-INDEXING-PLAN 초안) — 배포 통지 OUT 발송 11:0x. SERP 재측정(X6R 스크립트)은 son7-b9
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
- 초안 브랜치 mena/ar-drafts-20260916 **8b9e7c4c**: 중재·집행 EN 랜딩 4로케일 + /ar/arbitration-enforcement(EXTRA 키 2단 구조), 마커 43. son7-b9 라우팅 독립 검수 PASS(214건, 미발행 로케일 unavailable·sitemap ar만·코어 10 불변). x-default는 2언어 이상 시점에 규칙 결정. ② 단계(ASK-3)에서 vi/id/th/fil 본문 추가 후 변호사 검수. `visa-residence`는 본문 생길 때 EXTRA_PAGE_KEYS/LOCALES 2줄.

## B10. RC5 배포 완료(2026-09-16 15:30) — **columns-ar 17/17**
- 사용자 지시(도착 즉시 배포) → 게이트(체커 17/17·tsc·build·렌더) → 첫 push는 origin/main 전진(8dd6cd7d 홈 성능)으로 거부 → merge(충돌 0)·재빌드 → push 8dd6cd7d..bec0fa74 → Vercel success 15:30 → 라이브 17카드·004 렌더·마커 0·llms 17. Grok 검토는 사후(M11) → FAIL 시 R1 후속 배포.

## B9. 004 사용자 결정(2026-09-16 14:4x, 터미널 직접 "004도 배포 진행해")
- 004(세무 중심 편) 보류 해제 → 판정 A와 동일 원칙(ko 원문 기게재 사실 축자, 신설 0)으로 아랍어판 생성 → **사용자 추가 지시(14:5x) "004 오면 바로 배포해"** → 게이트(체커·tsc·build·렌더) 통과 즉시 push, Grok 검토는 사후(FAIL 시 R1 후속 배포).

## B8. RC4 배포 완료(2026-09-16 14:31)
- 사용자 승인(손빗 중계 ASK-1415) → push e285ae0f..9e9928d8 FF → Vercel success 14:31 → 라이브 /ar/columns 16카드·영어 뱃지 0, 001 아랍어 렌더·마커 0, 라이브 서수 잔재 0, /ar/llms.txt 칼럼 16. **columns-ar 16/17 라이브(004 보류)**.
- 남은 MENA 항목: 손빗 GSC/IndexNow(RC3·RC4 URL)·MENA 7국 베이스라인(M4-b), SERP 재측정 9/23+(son7-b9), 변호사 검수 패킷(마커 199+9), 004 판단은 사용자.

## B7. RC3 배포 완료(2026-09-16 14:05)
- 사용자 승인(손빗 중계 ASK-1255) → push b41e4e24..e285ae0f FF → Vercel success 14:05 → 라이브: /ar/columns 11카드·아랍어 필터·영어 뱃지 0, 칼럼 상세 inLanguage ar·마커 0, vi 필터 현지어·영어 토큰 0, /ar/llms.txt 칼럼 11. columns-ar 11/17 라이브.
- 다음 RC4: 배치3(005·013·001·002·016, f0171274) Grok 검토(M10, 진행 중) → R1 → 통합·게이트·ASK. 004 보류.

## B6. columns-ar 보류 6편 판정(총괄, 2026-09-16 12:3x)
- 근거: 사용자 결정(ASK-2)은 **ar/EN 안내(guidance) 카피**에 세무 숫자·협정 사실을 신설하지 않는 것. 칼럼은 ko 원문이 6개 언어로 이미 라이브(001: 영업세 5%·영리사업소득세 20%·비거주 배당 원천 21%)인 기게재 사실의 번역이라 신설이 아님(son7-b9 HELD-6-TAX-FIGURES 실측).
- 판정: **001·002·016·005·013 = 축자 번역 진행(A)** — 새 문장·협정(DTA) 언급 0, 숫자는 원문 그대로. **004(세무수치 20문장, 세무 중심 편) = 보류** — 안내 팩의 '세무·회계 지원' 수준 유지 취지에 가장 가까운 보수선. 재질문 없음. 004는 사용자가 별도로 열면 착수.

## B5. RC2 배포 완료(2026-09-16 11:27)
- 사용자 승인(손빗 중계 ASK-1106) → push 76360346..b41e4e24 FF → Vercel success 11:26 → 라이브: vi/id/th/fil 홈 영어 뱃지 0, ar 홈 아랍어 라벨 10(영어 2 = 영어 폴백 기사의 정확한 라벨). SEA 카테고리 붕괴 결함 해소.

## B4. MENA SERP 베이스라인(배포 전, son7-b9 X6R, 2026-09-16)
- 출처 ~/Projects/tseng-law-sea-state/expansion/MENA-SERP-BASELINE-2026-09.md. DDG kl=xa-ar 12질의: 아랍어 6질의 상위10에 대만 로펌 아랍어 페이지 0·tseng 0(GTranslate 디렉터리·걸프 로펌이 점유) / 영어 6질의 tseng-law.com/en Q7 1위·Q8 4위·Q9 1위·Q10 2위. Google gl=ae 9셀 tseng 0(이후 CAPTCHA), Bing 미측정. wei-wei/hovering 전 셀 미노출.
- 릴리스 노트 문구: "아랍어 의도 질의 6종에서 대만 로펌 1차 아랍어 콘텐츠 경쟁 0 — /ar 배포는 공백 첫 진입, 배포 후 동일 스크립트(ddg_collect.py·pw_serp.js) 재측정".
- phase 2 후보(기록만): /ar/guides/taiwan-company-setup(EN 가이드 MSA), 외국인 투자자 법인세 ar 페이지 — 세무 숫자 비게재 결정과 충돌하지 않는 범위에서만.

## B3. 확장(X1) 사용자 결정(9/16 09:5x, 손빗 중계) — 전 레인 공통 제약
- **신규 안내 로케일 신설 금지**(ms/my 등). 말레이시아·유사 권역은 기존 zh-hant·en 칼럼·의도 페이지 강화로만. 상담 언어 EN/ZH/JA/KO 유지. 재질문 금지.
- **간체(zh-hans) 영구 제외** — 착수·보류·리스크 페이지 어떤 형태로도 추가 금지. 재질문 금지.
- phase 2 언어(M4c-PHASE2-LANGS: ur/tr/fa/he)도 위 결정에 따라 로케일 신설 대상 아님 — 문서 보관만.

## B. 미결·ASK
- 배포·유료광고·외부 등재 = ASK. 코드·기획·초안은 진행.
- SEA W1 측정과 병행: SEA 대기 프로세스는 유지, 상태는 OUT에.

## C. 로그
- 2026-09-16 02:3x · Fable 5.1 · 워크트리 생성, M0-a·M0-b 발주. 02:5x son7-b9/son7-db와 분담 합의. 자동 로케일 의견 OUT 발송.

### M6 세무·회계 축 + 형사·민사 보강 (son7-b9 WO-X2 §7.1 이관, 2026-09-16 09:xx)
- [ ] 2026-09-16 X2 리서치(Grok) MENA-TAX-LITIGATION-INTENT-2026-09.md: ⑦ DTA는 SA만 있음(발효 2021-11-01, law.moj.gov.tw Y0040302). AE·QA·KW·BH·OM·EG는 條約協定名稱 기준 없음. MOF 36개 명단 페이지 미확인.
- [ ] X2 후속(제안, 미착수): `/en/taiwan-litigation-lawyer` FAQ + `/ar/services` 민사 절에 仲裁法 제47조·민소 제402조 축자 보강(G8·G9). 신규 키 C1/C2는 소유 파일 충돌 피해서 별도 데이터 파일 검토.
- [ ] X2 후속(제안, 미착수): `/en/services/criminal` + `/ar/services` 형사 절에 刑訴 71-1·93·95·99·110·251 축자. 아랍어 통역 제공 문장 금지. 영사 통보(G5)는 조문 미확인 → 침묵.
- [ ] X2 ASK 대기: 회계 파트너 실체(邵允平 Hovering Accounting Office vs 黃勝平 勤信) · 21%/12.5%/「DTA 없음」 공개 여부 변호사 검수.
- **사용자 결정(9/16 09:2x, 손빗 중계)**: 회계 파트너 공개 연결은 **黃勝平(勤信)만**. 邵允平(호정회계)은 문구·연결에 넣지 않음. 재질문 금지. (X2 ASK-1 종결)
- **사용자 결정(9/16 09:3x)**: 세무 숫자(營所稅 20%·원천 21%·DTA 12.5%)·「DTA 없음」 부정 사실은 ar/EN 안내에 넣지 않음. 현행 「세무·회계 지원」 문구만. 재질문 금지. (ASK-2 종결 → ⑦ 세무·회계 축은 문구 신설 없음, 리서치 문서 보관만; ASK-3 형사·민사 보강 범위 대기)
- **사용자 결정(9/16 09:4x, ASK-3)**: ① EN 소송 FAQ + /ar/services 형사·민사 절 보강 **먼저** ② 이어서 C1/C2(중재판정 집행 등) 신규 안내 키 — **전 안내 로케일(vi/id/th/fil/ar) 본문 필요**, 새 법률 문장은 변호사 검수 게이트. 재질문 금지. → 실행: X7 검수본(sea-state/expansion/EN-AR-LITIGATION-FAQ-DRAFT-2026-09.reviewed.md) → WO-M7 840b7bed → R1 9d3802be → **R2 ff1e11d8 게이트 PASS**(son7-b9: unit 10912, build, /ar/services 카드 정상화, /ar/faq 14문항 렌더). 초안 브랜치 잔존 = ja 한글 게이트 1건(의도). **변호사 검수 묶음**: EN FAQ 7문항(21문장)·형사 keyPoints 5·ar FAQ 신규 6문항(문장 9+스템 6)·services 안내 문장 2(마커 없음)·중재 랜딩 43 → 검수 후 마커 제거 → RC3. 기존 초안 8b9e7c4c(ar 단독 arbitration-enforcement)는 ②에 맞춰 vi/id/th/fil 본문 추가 필요(번역 레인 협의) — 보류.
- 판정(총괄): ar about 2283행 "2020년 Hovering Accounting Office 설립" 문장은 ko/en/ja/vi/id/th/fil 기게재 약력의 미러이며 인명 없음 → 결정 범위(신규 파트너 문구·연결) 밖, 유지. 신규 세무 문구·링크를 만들 때만 黃勝平 기준.
- 이 항목의 본문 배선(ar services 형사·민사 절 조문 축자, EN 소송/형사 FAQ)은 X2 ASK 3건 답 이후, 전부 [변호사 검수 필요] 마커·초안 브랜치. 세무 문구는 현행 '지원/회계 파트너' 범위 고정.
