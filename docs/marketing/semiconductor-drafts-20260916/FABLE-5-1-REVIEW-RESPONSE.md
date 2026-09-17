# Fable 5.1 review response (2026-09-16)

Review: `FABLE-5-1-REVIEW-2026-09-16.md` (HEAD at review: `6b38e49e`).
Reviewer verdict: 공개 NO-SHIP / 로컬 초안 유지 가능. 치명 0 · 높음 0.

| Item | Action |
|---|---|
| M-1 재실행 명령 무동작 | 죽은 자가실행 블록 삭제. 보고서는 `scripts/import-semiconductor-drafts.ts`만 안내. |
| M-2 Downloads 의존 테스트 | `src/content/semiconductor-drafts/manifest.json` 해시와 비교. |
| L-1 admin locale 무시 | `/en/admin-builder/semiconductor-preview` → notFound. |
| L-2 안내 H1 이중 | service kind는 선두 `# ` 줄을 표시에서 제거. |
| L-3 import 테스트가 실 CMS 경로 갱신 | `CONSULTATION_COLUMNS_DIR` 임시 디렉터리. |
| L-4 Footnotes 영어 라벨 | `ColumnContent`에 locale별 footnoteLabel (ko=각주). |
| L-5 PNG 11MB | 유지. 검수 증거. |

공개 발행은 여전히 변호사·소유자 승인 후.
