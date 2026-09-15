# GOAL — tseng-law.com 중동(MENA) 레인 (2026-09-16 착수, 사용자 지시 02:30 손빗 중계)

총괄: Fable 5.1 (승계 순서·워커·규칙은 SEA 정본 `docs/seo/sea-geo-plan/PROMPT.md` §0·§4·§6 동일 적용). 워크트리 `~/Projects/tseng-law-mena-20260916` 브랜치 `mena/ar-guidance-20260916` (origin/main 8b23eb18).
목표: MENA(AE·SA·QA·KW·BH·OM·EG) 사람이 대만 회사설립·소송/분쟁이 필요할 때 tseng-law.com이 검색·AI에서 보이고 문의가 오게 한다. 1순위 locale `ar`(안내 언어, RTL). 상담 언어는 EN/ZH/JA/KO만 — ar 상담·통역 가능 표기 금지. tr/fa/he는 phase 2 후보 제안만.

## A. 보드
### M0 기반
- [ ] M0-a WO-M0-INVENTORY(Opus, 읽기 전용): vi/id/th/fil 추가 시 건드린 모든 지점 목록(GUIDANCE_LOCALES_4 참조 19파일 + 로케일 계약·middleware matcher·sitemap·llms·hreflang·언어 스위처·contact 폼·intake 계약·테스트·playwright·verify-multilingual-live·RTL 부재 지점) → docs/seo/mena-plan/AR-LOCALE-INVENTORY.md
- [ ] M0-b WO-M1-INTENT(Opus, 리서치): MENA 7국 × 의도(회사설립·투자 / 소송·계약분쟁 / 미수금 / 비자·거류 / 상속·가족 / 형사) 질문 문장(아랍어+영어), 검색 표면, A~E 근거(대만-MENA 교역·체류 통계 공식 출처), 대응 URL → docs/seo/geo-mena-intent-map-2026-09.md
### M1 ar 로케일
- [ ] M1-a WO-M2-AR-ROUTING(Opus): `ar`를 안내 로케일에 추가(GUIDANCE_LOCALES_5), 라우팅·middleware·hreflang(ar)·sitemap·llms.txt·언어 스위처·RTL(`dir="rtl"` html/layout + 필요한 CSS 논리속성) — 콘텐츠는 임시 en 폴백 없이 M1-b와 동시 커밋
- [ ] M1-b WO-M3-AR-CONTENT(Opus): src/data/international-guidance-content.ts 의 ar 블록(10 페이지키·faqs) — vi/en 안내 본문의 **기게재 사실만** 아랍어로(신규 법률 주장 0 → 마커 불필요), 상담 언어 4개 문장, 아랍권 독자 적응(호칭·기관명), 숫자·날짜 서식
- [ ] M1-c WO-M3-review(Grok): 아랍어 자연스러움·MSA 일관·RTL 표기·언어 계약·광고 규정
- [ ] M1-d 총괄 게이트(typecheck·vitest·build·렌더 ar 10URL·dir=rtl·JSON-LD availableLanguage 4개) → 커밋
### M2 SEO/GEO
- [ ] M2-a 답변형 블록·FAQPage·LegalService JSON-LD·llms.txt ar (SEA S2 구조 재사용, answers ar 추가)
- [ ] M2-b AI cite 문항 세트 ar/en × 6주제 → docs/seo/geo-mena-baseline-2026-09.md (실측은 손빗 브라우저)
- [ ] M2-c 색인 계획: GSC 국가 필터(ae/sa/qa/kw/bh/om/eg)·Bing WMT(중동은 Bing 점유 높음 — 근거 등급 표기)·IndexNow → 손빗 ASK 초안
### M3 폼·계약
- [ ] M3-a contact 폼 ar: 제출 언어 안내·"연락 방법 확인 필요" 옵션·intake-language-contract에 ar 안내 로케일 등록·테스트
### M4 배포·측정
- [ ] M4-a RELEASE-CHECK-MENA.md → 배포 ASK(사용자)
- [ ] M4-b 베이스라인 docs/seo/geo-mena-baseline-2026-09.md(GSC MENA 7국 28일·생성형AI·색인) 손빗 ASK
- [ ] M4-c phase 2 후보(tr/fa/he) 제안 1쪽

## B0. 세션 분담(02:5x 합의)
- son7-51(소유): M0·M1(Opus 실행 중)·M3 ar 콘텐츠·Grok 검토·통합 merge·배포 ASK. 파일: international-guidance-content.ts·international-guidance-answers.ts·intent 문서.
- son7-b9: M2 라우팅·RTL·아랍 폰트·hreflang/sitemap/llms/seo.ts·middleware·layout/chrome/스위처·테스트 — 브랜치 mena/ar-routing-20260916, 워크트리 ~/Projects/tseng-law-mena-routing-20260916.
- son7-db: M2-b AI cite 문항(geo-mena-baseline-2026-09.md)·M2-c 색인 계획(M2c-INDEXING-PLAN.md)·M4-c phase 2 언어(M4c-PHASE2-LANGS.md) — 브랜치 mena/ar-content-20260916, src 무변경.
- 통합: 소유 브랜치가 두 브랜치 merge → 게이트 → RELEASE-CHECK-MENA → 사용자 ASK.

## B. 미결·ASK
- 배포·유료광고·외부 등재 = ASK. 코드·기획·초안은 진행.
- SEA W1 측정과 병행: SEA 대기 프로세스는 유지, 상태는 OUT에.

## C. 로그
- 2026-09-16 02:3x · Fable 5.1 · 워크트리 생성, M0-a·M0-b 발주. 02:5x son7-b9/son7-db와 분담 합의. 자동 로케일 의견 OUT 발송.
