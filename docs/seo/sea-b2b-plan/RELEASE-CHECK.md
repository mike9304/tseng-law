# RELEASE-CHECK — seo/sea-b2b-20260911 → main (작성 2026-09-11 16:3x KST)

베이스: origin/main f110b2bc(리베이스 완료·ancestor). 브랜치 HEAD: 852a4e69 + 본 문서 커밋. 코드 변경 파일 15개 + 테스트 8개 + docs.

## 공개 사이트에 바뀌는 것
1. **신규 8 URL**: `/{vi,id,th,fil}/company-setup`(허브: 직답 블록 + 자회사/지사/대표사무소·투심사·등기 후 절 + ① 현지어 칼럼 8편 링크) · `/{vi,id,th,fil}/debt-collection`(대만 기업 상대 계약분쟁·미수금: 원격 착수·위임장·합의/민사소송/집행 비교·첫 이메일 준비). 본문은 EN 인텐트 랜딩 2종·안내 services 절의 **기게재 사실만** 번역 — 수임료 숫자 0, 새 법률 주장 0, 변호사 검수 마커 0. 상담 언어 EN/ZH/JA/KO 명시, 마지막 FAQ는 기존 거절 문답 원문.
2. JSON-LD: FAQPage(inLanguage=페이지 언어)·LegalService(availableLanguage en/zh-Hant/ja/ko 고정)·Breadcrumb.
3. hreflang(사이트맵): 신규 8 URL ↔ `/{ko,zh-hant,en,ja}/taiwan-company-setup-lawyer`·`/taiwan-litigation-lawyer` 8언어 클러스터 + x-default=en 랜딩, **상호참조**(랜딩 엔트리에 4로케일 alternate 추가). 언어 전환기 양방향(랜딩↔안내 페이지).
4. 내부링크: 안내 home·services·pricing·contact 하단 "관련 안내" 블록 → 신규 2페이지; services 답변 블록 sources에 2경로 추가. 헤더 네비 불변(코어 10).
5. `/{l}/llms.txt`에 2항목 추가. 사이트맵 +8.
6. **기존 결함 수정**: 4로케일 칼럼(`/vi/columns/...` 등)의 FAQPage `inLanguage`가 'en'으로 나가던 것 → 페이지 언어.
7. R2 후속: fil intro 용어 gloss, debt-collection 준비 목록에 결제 증빙 항목 복원(4로케일).
**포함 안 됨**: 번역 레인 파일(`international-guidance-content.ts`·`intent-pages.ts`·`content/**`) 변경 0. EN 랜딩 본문 변경 0. Person knowsLanguage 변경 0(U11 사용자 결정).

## 게이트
- typecheck 0 · lint 0(`evidence/lint-release.log`) · security:builder-routes OK · build exit 0(`evidence/build-release.log`)
- **`npm run qa` exit 0** — typecheck·lint·test:unit **1231/1231 파일·10102 테스트 통과**·security:builder-routes (`evidence/qa-release.log`). 9/9 릴리스에서 "환경 의존 실패"로 기록됐던 qa-runtime-attestation은 워크트리에 gitignore된 `data/audit/` 런타임 디렉터리가 없어서였음(`mkdir -p data/audit`로 해소, 테스트 약화 없음)
- 렌더 8 URL 200·canonical self·JSON-LD 3종·언어전환 역방향·사이트맵 8·llms 2×4 — `evidence/render-release.txt`(+ `render-C1.txt`·`render-R1.txt`)
- 독립 검토 Grok 4.6 `reviews/S7-C-REVIEW.md` PASS 0 BLOCK → FIX 6·NOTE 반영(R2 852a4e69). NOTE #8(debt-collection↔소송 랜딩 클러스터 의미 정합)은 총괄 결정으로 유지: 소송 랜딩 제목이 "Contract Disputes & Civil Claims"이고 idealFor에 해외기업 미수금이 명시돼 같은 인텐트의 SEA 판으로 본다. 12주 판정에서 ⑤ 쿼리 노출이 랜딩에 잡히지 않으면 재검토.
- 계약 grep: 마커 0 · NT$/천단위 0 · 승소율/보장/최고/유일 0 · availableLanguage 안내언어 0.

## 롤백
`git revert` 1회(머지 범위). 데이터·DB·환경변수 변경 없음.

## 배포 절차(사용자 승인 후)
`git fetch origin && git rebase origin/main`(충돌 시 중단) → 게이트 재실행 → `git push origin seo/sea-b2b-20260911:main` → Vercel success → `node scripts/live-seo-scan.mjs --base=https://tseng-law.com` · `npm run verify:multilingual-live -- --base https://tseng-law.com` → 신규 8 URL curl 200 → IndexNow 8 URL(`scripts/indexnow-submit.mjs --urls ... --dry-run` 확인 후 실제) → GSC 색인 요청(U1: 신규 8 + ① 칼럼 68 + services 4).
