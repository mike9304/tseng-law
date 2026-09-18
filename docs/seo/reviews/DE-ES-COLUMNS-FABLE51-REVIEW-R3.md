# Fable 5.1 재검수 R3 — de/es 칼럼 (2026-09-17)

## 이번 수정(E1–E6) 검증 — 전부 PASS
| 항목 | 확인 | 결과 |
|---|---|---|
| E1 es 002:16·117 휴업등기 면제(核備) 괄호 | ko 16/117 "(이미 … 신고·核備한 경우에는 이 등기가 필요하지 않습니다)"와 동형: es "(si la suspensión ya se ha declarado y anotado (核備) … este registro no es necesario)" | PASS |
| E2 es 014:42 | `consignar de forma meramente formal uno de los dos` | PASS |
| E3 es 007:120 | `prometarse` 0 | PASS |
| E4 es 013:90 | `alrededor de 1 mes`(ko 약 1개월) | PASS |
| E5 es 008 title·H1 `??` | 0 | PASS |
| E6 es 005:70 `¿…?` | 쌍 완성 | PASS |
부수: es 014:58 문장도 재작성돼 해소. 체커 es 17/17·de 17/17 재PASS. 신규 FAIL 0.

## 레인 판정: **ITERATE 유지** — WO 문구 "de는 R2에서 §7 해소"는 사실이 아님
2026-09-17 재확인 결과 아래가 파일에 그대로 있음(선행 리포트 §B·§C의 미처리분, 세 번째 반복):
### de (차단)
1. **013:118** `… muss … die Stadtverwaltung (市政府) verlangen, dass …` — 의무 주체 역전. → `Außerdem verlangt die Stadtverwaltung (市政府) bei der endgültigen Gesellschaftseintragung, dass die Eintragungsadresse in einem Gebiet liegt, in dem Restaurantbetrieb zulässig ist.`
2. **007:152** `eine anwendbare Gerichtsordnung` → `eine anwendbare gerichtliche Anordnung`.
3. **002:16·002:117** `核備` 0 (ko 2곳) → `… gemeldete und von ihr vermerkte (核備) Betriebsruhe …` 형태로 병기 복원.
4. 하드 오타 6: 003:104 `Anspragsbetrags`→`Anspruchsbetrags` · 010:64 `Sicherheitsplicht`→`Sicherheitspflicht` · 016:142 `GesetzesSeiten`→`Gesetzesseiten` · 007:176 `Die folgenden 1. Primärquellen`→`Die folgenden Primärquellen` · 007:55 `Nature der Sache`→`Natur der Sache` · 013:122/124 `Miet` / `vertrags` 문단 분절 → 한 문단으로 합쳐 `Mietvertrags`.
### es (차단)
5. **008:161–167** 문장 붕괴 그대로("Pero B, después del cambio de gestor, / que la empresa pretendía … / lo advirtió desde temprano / y, como descubrió …") → `Pero B se dio cuenta pronto de que, tras el cambio de gestor, la empresa pretendía hacer salir a los trabajadores por medios indebidos, y como descubrió que se publicaban anuncios de empleo …` (단일 주절).
6. **014:64** `… o una recompensa por el logro de resultados debe ser claro en el contrato` → `… debe quedar claro en el contrato y en los documentos de comunicación`(주어 뒤 쉼표 포함).

성별 호칭은 ASK 답 전까지 현행(Rechtsanwalt/abogado) 유지 — 판정에 영향 없음(안내 팩 정본과 일치).

## R4 조건
위 de 1~4·es 5~6 반영 + 체커 재PASS → 줄 단위 확인 → **APPROVE**. 비차단 권고(선행 §B/§C 권고·§D 링크 범위)는 조건 아님.
