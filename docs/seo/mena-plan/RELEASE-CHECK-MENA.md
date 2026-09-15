# RELEASE-CHECK-MENA — mena/ar-guidance-20260916 → main (작성 2026-09-16 03:35:14 KST)

베이스: origin/main 8b23eb18(ancestor 확인). HEAD 6858e77f, 커밋 35개(코드 변경 파일 58개 + docs). 세션: son7-51(소유·콘텐츠·통합) / son7-b9(라우팅·RTL·게이트) / son7-db(문서).

## 무엇이 바뀌나 (공개 사이트)
1. **신규 안내 로케일 `ar`(아랍어, RTL)**: /ar 홈 + services·about·lawyers·pricing·contact·faq·privacy·disclaimer·columns 10페이지. html lang=ar dir=rtl, Noto Sans Arabic, RTL 미러 CSS(html[dir=rtl] 스코프). 언어 스위처에 العربية.
2. 콘텐츠는 en/vi 안내의 **기게재 사실만** 아랍어(MSA)로 옮김 — 새 법률 주장 0, 마커 0. 상담 언어 문장 "الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية"(EN/ZH/JA/KO) 전 표면 단일. 아랍어 상담·통역 가능 암시 0.
3. SEO/GEO: hreflang ar(기존 9로케일 코어 페이지 alternates에 ar 추가) + x-default en 유지, sitemap /ar 10, /ar/llms.txt + 루트 카탈로그 등재, og:locale ar_AR, LegalService/FAQPage JSON-LD(availableLanguage en/zh-Hant/ja/ko **불변**), 답변형 블록 6페이지.
4. 문의 폼: ar 안내 카피(제출 언어는 안내, 상담은 4개 언어 고지), PUBLIC_INQUIRY_LOCALES에 ar(CONSULTATION_LANGUAGES 불변).
5. 함께 반영되는 SEA 문서: W1 측정·AI 인용 베이스라인·보드(코드 변경 없음).
**미포함/phase 2**: columns-ar 없음(/ar/columns 빈 목록·/ar/llms.txt 칼럼 0 = 정상), 신규 인텐트 페이지(중재·집행, EG 비자)는 초안 단계, tr/fa/he.

## 게이트
- 코드(son7-b9, befed217+938e86b0): typecheck 0 · lint 0 · build 0 · **unit 전체 1290파일/10808 통과**.
- /ar 실측(son7-b9): 10URL×1280/1440/390 전부 통과 — lang/dir·가로스크롤 0·헤더 겹침 0·Noto Sans Arabic 실로드·폼 rtl·hreflang ar+x-default·og:locale·availableLanguage 4·sitemap·llms. 스크린샷 sea-state/audit/mena/ar-real-*.png.
- 총괄 재확인(a78cf9b0): tsc 0·build 0·렌더 5URL(lang=ar dir=rtl, ld 3~4, availableLanguage 4개, summary, hreflang ar) — evidence/render-mena-rc.txt, build-mena-rc.log. /ar/llms.txt 10 URL, 루트 카탈로그 9.
- Grok 독립검토: M1 인텐트(FAIL 2 → R1 4f0b31eb). ar 콘텐츠(M3-REVIEW: 문법·계약·광고·RTL·문화 PASS, FAIL 2 = 아랍어 칼럼 존재 서술·팀원 성별 이중표기 → R1 927e28cb 반영, 최종 build 0).
- 상담 언어 계약 grep: seo.ts:839·intake:16 4개 무변경.

## 알려진 결함(승계, 차단 아님)
- /ar 홈 칼럼 카테고리 뱃지 "Legal Information" 영어 노출 — 안내 4로케일(vi/id/th/fil)도 동일한 기존 결함(columns.ts categoryLabelFn 영어 폴백). 아랍어 라벨 3개 후속 WO로.
- 아랍어 원어민 검수 미실시(Grok 검토 반영으로 대체). 보류 권고 2건: 資遣費 이집트 제도 병기(비동일성 경고와 충돌, 변호사 판단), answers lawyers 범위 절.

## 롤백
git revert 1회(merge 커밋). 데이터·DB 변경 없음. Vercel 이전 배포로 즉시 복귀.

## 배포 절차(승인 후)
Claude push 차단 → 손빗/사용자 1커맨드: `cd ~/Projects/tseng-law-mena-20260916 && git push origin mena/ar-guidance-20260916:main` (FF) → gh api status success → son7-b9 운영 게이트 + verify:multilingual-live → 손빗 GSC 사이트맵·IndexNow·MENA 7국 베이스라인(M4-b).
