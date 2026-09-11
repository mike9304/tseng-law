# 번역 레인에 보내는 관찰 (SEO·GEO B2B 트랙 → 번역 레인) · 2026-09-11

이 트랙은 `src/data/international-guidance-content.ts`·`src/content/columns-{vi,id,th,fil}/**`를 수정하지 않았다. 아래는 리서치(S7-R1 §4 G4·G3)에서 관찰된 사항으로, 반영 여부는 번역 레인·변호사 판단.

1. **vi/id/fil(th 미확인) ① 회사설립 칼럼에 "대만–한국 조세조약" 절 잔존** — ko 원문 번역 그대로라 SEA 독자 질의(베트남/인도네시아 투자자)에 비일치 신호. 예: `/vi/columns/taiwan-company-establishment-basics`의 "Thuế và Hiệp định thuế thu nhập Đài Loan–Hàn Quốc" 절. 수정 시 새 법률 서술이 생기면 `[변호사 검수 필요]`.
2. vi 칼럼 H2 "Frequently Asked Questions"가 영어 그대로 남은 곳 있음(현지어 소제목 권고).
3. 신규 페이지 `/{l}/company-setup`가 ① 칼럼 8편(설립 기초·자회사 vs 지사·자본 회수·심화 1·2·입지·화장품·물류)에 링크한다 — 칼럼 슬러그/파일명이 바뀌면 `src/data/__tests__/international-guidance-extra.test.ts`의 fs 검사가 실패하니 알려주기 바람.
4. 신규 페이지 마지막 FAQ는 각 로케일 기존 거절 문답(vi 408·id 881·th 1354·fil 1827행)을 **원문 그대로** 재사용하며 테스트가 일치를 강제한다 — 그 문답을 고치면 함께 갱신 필요.
