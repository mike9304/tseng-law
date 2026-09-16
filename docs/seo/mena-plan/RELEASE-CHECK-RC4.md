# RELEASE-CHECK-RC4 — columns-ar 배치3 5편 + 서수 정리 (작성 2026-09-16 14:15:18 KST)
베이스: origin/main e285ae0f(RC3 라이브). HEAD d7677072(FF). 세션: son7-b9(번역·체커), son7-51(Grok 검토·통합).
## 무엇이 바뀌나
1. 아랍어 칼럼 +5편(005 설립 입지 심화·013 설립 심화·001 회사설립 기초·002 자본 인출·016 상속·양육권) → columns-ar 16/17. 판정 A: ko 원문 기게재 사실 축자(001 세율·협정 문장은 6개 언어 라이브와 동일 수치, 신설 0 — Grok §7a 확인). Grok 검토 반영(005·013·016 MSA 각 1건).
2. 라이브 11편 숫자 서수 정리 26곳(`الفقرة 4` → `الفقرة الرابعة` 등, 사실 불변).
3. 체커 numbers ar 서수어 폴백(4언어 회귀 PASS).
**미포함**: 004(세무 중심, 보류), 초안 브랜치.
## 게이트
체커 ar 16/16 PASS · 서수 숫자 잔재 0 · guidance-country PASS · tsc 0 · lint 0 · **전체 unit 1293/10836** · build 0 · 렌더 /ar/columns 16카드·영어 뱃지 0, 상세 2편 inLanguage ar·마커 0, /ar/llms.txt 칼럼 16 — evidence/unit-rc4.log·build-rc4.log·render-rc4.txt.
## 롤백
git revert 1회(merge).
## 배포
`cd ~/Projects/tseng-law-mena-20260916 && git push origin mena/ar-guidance-20260916:main`
