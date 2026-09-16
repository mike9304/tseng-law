# RELEASE-CHECK-RC3 — columns-ar 11편 + 안내 로케일 칼럼 UI 현지어 (작성 2026-09-16 12:55:55 KST)
베이스: origin/main b41e4e24(RC2 라이브). HEAD 58f8298b(FF). 세션: son7-b9(번역 파이프라인·X15), son7-51(통합·Grok 검토·문구).
## 무엇이 바뀌나
1. **아랍어 칼럼 11편**(src/content/columns-ar): 배치1 015·011·008·012·007, 배치2 003·006·009·010·014·017. ko 원문의 기게재 사실 축자 번역(새 법률 문장 0, 세율 문장 없는 편만), 미번역 편 링크는 /ko 원문 폴백, 한자 병기 유지, Grok MSA 검토 2라운드 반영(M8·M8-R2·M9 REVIEW). /ar/columns 11카드·상세 페이지 Article JSON-LD inLanguage ar·hreflang ar·/ar/llms.txt 등재.
2. 체커 확장: check-column-translation ar 규칙(금지 문구·국적어·langid·숫자단어·쌍수), 4언어 회귀 유지.
3. X15: vi/id/th/fil/ar 칼럼 목록 필터 버튼·카드 CTA 현지어(안내 팩 기존 어휘, 창작 0). /en·/ko 바이트 불변.
4. /ar/columns·홈 안내 문장을 "일부 아랍어판 있음 + 원문 언어 링크"로 정정(M8).
**미포함**: 004(세무 중심, 보류), 배치3(005·013·001·002·016 → RC4), 초안 브랜치(마커).
## 게이트
lint 0 · **전체 unit 1293파일/10836 통과** · build 0 · 체커 ar 11/11 PASS · guidance-country PASS · 렌더 localhost: /ar/columns 200 카드 11·아랍어 필터 4·영어 뱃지 0·dir=rtl, 상세 2편 inLanguage ar·hreflang ar·마커 0, vi 필터 현지어, /ar/llms.txt 칼럼 11 — evidence/unit-rc3.log·build-rc3.log·build-rc3-final.log·render-rc3.txt. Grok 검토: 배치1 R2 잔존 2→R3 해소, 배치2 FAIL 6→R1 반영(003 司法院 복원 확인).
## 롤백
git revert 1회(merge). 콘텐츠 파일 추가·UI 라벨뿐.
## 배포
`cd ~/Projects/tseng-law-mena-20260916 && git push origin mena/ar-guidance-20260916:main`
