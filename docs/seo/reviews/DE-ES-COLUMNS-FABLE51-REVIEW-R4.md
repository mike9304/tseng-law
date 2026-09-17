# Fable 5.1 재검수 R4 — de/es 칼럼 (2026-09-17, son7-db 정본)

파일 소유: son7-db(이 파일). son7-51·son7-a0의 R4 독립 확인은 bridge로 수신해 여기에 흡수함.

## R3 잔여 6묶음 — 디스크 줄 단위 확인 (15:3x)
| # | 항목 | 확인 | 결과 |
|---|---|---|---|
| 1 | de 013:118 의무 주체 | `Außerdem verlangt die Stadtverwaltung (市政府) bei der endgültigen Gesellschaftseintragung, dass …` | PASS |
| 2 | de 013:122/124 분절 | 122 끝 `Vor Abschluss des Mietvertrags` / 124 `sollten Sie dies vorab prüfen.` — ko 013:122/124 `임대` / `계약 체결 전에…` 분절과 동형(블록 수 유지) | PASS |
| 3 | de 007:152 | `eine anwendbare gerichtliche Anordnung` | PASS |
| 4 | de 002:16·117 核備 | 2곳 병기(ko 2곳) | PASS |
| 5 | de 하드 오타 5 | `Anspragsbetrag`·`Sicherheitsplicht`·`GesetzesSeiten`·`Nature der`·`Gerichtsordnung` 잔존 0 · 003:104/010:64/016:142/007:55/007:176 교정 확인 | PASS |
| 6 | es 008:161–167 | 블록 4개 유지, `advirtió que la empresa pretendía…` / `desde temprano` 서술어 복원(ko 동형 분절) | PASS |
| 7 | es 014:64 | `…, debe quedar claro en el contrato y en los documentos de comunicación` | PASS |

체커: `node scripts/check-column-translation.mjs --dir src/content/columns-de --lang de` → **PASS 17/17**, es → **PASS 17/17** (15:36 재실행).

## 커밋 준비에서 함께 정리한 P2 (son7-a0 권고, 사실 무관·문법)
- de 002:87 `oder Sicherheiten lastet` → `oder wenn Sicherheiten darauf lasten`
- de 008:14 `Dagegen erfordern eine` → `Dagegen erfordert eine`
- de 008:141 `der Gesellschaftsangehörige` → `die Führungskraft der Gesellschaft` (ko 회사 간부)
- de 017:91 `Geschäftvertrags` → `Geschäftsvertrags`
- 002:16/117 `1 Mal 1 Jahr`는 수치 동형 유지(문체만, 미수정)
수정 후 체커 de 17/17 재PASS.

## 판정: **APPROVE** (게이트 기준)
- 원어민 검수를 대체하지 않음(이월 P2 권고는 선행 §B/§C 참조).
- 성별 호칭: ASK-claude-20260917-152000 답 전까지 현행(Rechtsanwalt/abogado) 유지 — 답이 "여성"이면 de/es/ar + 정본 치환 WO.
- 다음 단계: 사용자 지시("완성됐으면 배포해", 15:2x)에 따라 son7-db가 전체 게이트(qa+build) → 커밋 → origin/main 푸시 → Vercel 라이브 검증 수행. 이 워크트리에 다른 작성자 금지.
