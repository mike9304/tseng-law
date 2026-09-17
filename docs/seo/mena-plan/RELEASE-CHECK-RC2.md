# RELEASE-CHECK-RC2 — 뱃지 라벨·SEA 카테고리 수정 (작성 2026-09-16 11:06:37 KST)
베이스: origin/main 76360346(ar 라이브). HEAD 7e3d4564 (merge 7e3d4564 = son7-b9 33556543 3커밋 + 문서).
## 무엇이 바뀌나
1. **SEA 라이브 결함 수정**: vi/id/th/fil 칼럼 17편이 frontmatter 카테고리를 인식 못 해 전부 "Legal Information" 버킷으로 떨어지던 문제 — 각 언어 실제 frontmatter 문구를 정규화에 추가(지은 문장 0), 슬러그별 en 파리티 테스트 17×4.
2. 안내 로케일 칼럼 카테고리 뱃지: 단일 리졸버 guidanceColumnCategoryLabel. ar 라벨 3(تأسيس الشركات / معلومات قانونية / دراسات قضايا), vi/id/th/fil 라벨은 frontmatter 원문 재사용(디스크 대조 테스트). 영어 폴백 소멸.
3. 문서: MENA 보드·SERP 베이스라인·결정 기록.
**미포함**: 초안 브랜치(마커) 전부.
## 게이트
lint 0 · **전체 unit 1292파일/10821 통과** · build 0 · 렌더 localhost: /vi 홈 영어 뱃지 0(Thành lập công ty… 6), /ar 홈 تأسيس الشركات 10(영어 2건은 영어 폴백 기사 003의 정확한 라벨), /id 홈 영어 뱃지 0 — evidence/unit-rc2.log·build-rc2.log·render-rc2.txt. son7-b9 사전 게이트 unit 10821.
## 롤백
git revert 1회(merge). 데이터 변경 없음.
## 배포
`cd ~/Projects/tseng-law-mena-20260916 && git push origin mena/ar-guidance-20260916:main` (FF)
