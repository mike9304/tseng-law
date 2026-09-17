# UI-REVIEW

로컬 미리보기: `http://127.0.0.1:3017` (`DESIGN_PREVIEW=1`, Next.js 15.5.21)

캡처: `docs/marketing/semiconductor-drafts-20260916/preview-*-desktop.png` (1280px), `preview-*-mobile.png` (390px)

| 화면 | 데스크톱 | 모바일 | 가로 넘침 |
|---|---|---|---|
| 안내 | preview-service-desktop.png | preview-service-mobile.png | 0 |
| 진출 칼럼 | preview-entry-desktop.png | preview-entry-mobile.png | 0 |
| 대금 칼럼 | preview-dispute-desktop.png | preview-dispute-mobile.png | 0 |
| 계약 칼럼 | preview-contract-desktop.png | preview-contract-mobile.png | 0 |

관찰:
- 기존 `svc-hero` / `svc-article` / `column-markdown` / `column-table-wrap`(overflow-x: auto) 재사용.
- 본문 폭 48rem. 초안 배너에 검수 대기·열람일/정리일 구분. ‘변호사 검수 완료’ 배지 없음.
- 표는 컨테이너 안 가로 스크롤. 390px에서 documentElement 가로 넘침 0.
- 영어 미리보기 `/en/design-preview/semiconductor`는 404 (번역 없음).
- 키보드 포커스: 기존 사이트 링크·버튼 스타일. 새 분석 도구·외부 폰트 없음.

수정:
- 안내 페이지 본문의 관련 글 제목을 초안 미리보기 링크로 연결 (원문 파일은 미변경).
