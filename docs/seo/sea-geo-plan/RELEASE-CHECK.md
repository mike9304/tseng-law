# RELEASE-CHECK — seo/sea-geo-20260909 → main (작성 2026-09-09 13:16:32 KST)

베이스: origin/main ad2da25a (번역 레인 최신, 리베이스 완료·ancestor 확인). 브랜치 HEAD: dfd2dafd, 커밋 28개(코드 변경 파일 15개 + docs).

## 무엇이 바뀌나 (공개 사이트 영향)
1. vi/id/th/fil 안내 페이지(services·about·lawyers·pricing·contact·faq) 상단에 "직접 답변" 블록(40~80단어, 상담 언어 EN/ZH/JA/KO 명시, 근거 링크). AI·검색 인용용.
2. 4로케일 안내 페이지 전부에 LegalService JSON-LD(availableLanguage en/zh-Hant/ja/ko 고정, 기존 @id 참조), faq 페이지에 FAQPage JSON-LD(본문 faqs 글자 그대로). 홈 포함.
3. /vi/llms.txt /id/llms.txt /th/llms.txt /fil/llms.txt 신설(안내 10페이지 카탈로그 + 주의문), 루트 /llms.txt에 카탈로그 링크 4줄(2262B).
4. 미들웨어: 안내 로케일에서 llms.txt 만 리라이트 통과(화이트리스트 1항목). 다른 경로 동작 불변.
5. 문서: docs/seo/geo-sea-baseline·sea-intent-map·FROM-GROK-BOT-SEA·metrics-log SEA 행·docs/marketing/SEA-AUTHORITY-CANDIDATES·sea-geo-plan/.
**포함 안 됨**: S3 초안(노동허가·ARC 갱신 랜딩, 마커 96) — 별도 브랜치 seo/sea-s3-drafts-20260909, 변호사 검수 전 main 금지. 번역 레인 파일(international-guidance-content.ts·content/**) 변경 0.

## 게이트 결과
- typecheck 0 · lint 0 · security:builder-routes OK · build exit 0(8개 llms.txt 프리렌더) — evidence/build-rebased.log
- 렌더 24 URL 200, availableLanguage 전부 4개, FAQPage 8문항 파싱, hreflang 9·canonical self — evidence/render-rebased.txt, s4-local-hreflang.txt
- 전체 unit: 1222/1223 파일 통과, 실패 1 = qa-runtime-attestation(TMPDIR 심링크 환경 의존, 이 브랜치 변경과 무관·기존 알려진 건) — evidence/unit-full-release.log
- Grok 독립검토: S2a PASS(R1 후)·S2b PASS 5/5. [변호사 검수 필요] 마커 src 내 0.

## 롤백
git revert <머지/푸시 범위> 1회. 데이터·DB 변경 없음. Vercel 이전 배포로 즉시 복귀 가능.

## 배포 절차(승인 후, RUNBOOK §4-b)
git push origin seo/sea-geo-20260909:main → gh api status success → live-seo-scan·verify:multilingual-live → curl /vi/llms.txt 200.
