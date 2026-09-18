# Fable 5.1 재검수 R2 — de/es 칼럼 17×2 (WO DE-ES-COLUMNS-FABLE51-WO-R2-20260917)

```
판정: ITERATE
R1 §7(F1·F2·F3): 해소 확인 — 단, F1 방향(성별)은 사용자 확인 ASK 발행
신규 차단: es 2편 P0(002 면제 소실, 014 핵심어 탈락) + es 4편 P1 정서법·오타
```

검토자: Fable 5.1(son7-db 세션) · 2026-09-17 15:2x KST · 작업트리 `tseng-law-i18n-de-es-20260917` · 브랜치 `i18n/de-es-public-20260917`
방법: Read/Grep/od + 체커 재실행 + Opus 5 정독 소견(de/es 각 17편, `~/fable-goals/reviews/{de,es}-columns-opus-findings.md`)을 Fable이 파일:줄로 표본 대조. 원본 md·체커 미수정, git 미조작, 라이브 HTTP 없음. 원어민 검수 대체 아님.

## 1. R1 §7 해소 확인 (de)

| 항목 | 확인 | 근거 |
|---|---|---|
| F1 호칭 통일 | **기계적으로 해소** — `Anwältin Wei Tseng` 0건, `**Rechtsanwalt Wei Tseng (曾雋崴)**` 8편(001:145, 002:150, 004:195, 007:199, 011:134, 014:194, 016:154 + 017:144 `Profil des Rechtsanwalts`) | 남은 `Anwältin` 8줄(001:141, 005:86, 011:114, 013:84·132, 015:46·74·82)은 전부 「Anwältin oder Anwalt」류 일반 양성 표기이며 특정 인물 지칭 아님 → 문제 없음 |
| F2 002:71 | 해소 — 신설 관계절 삭제, ko 002:71과 동형 | `sed -n 71p` 대조 |
| F3 date_display U+200B | 해소 — de 17편 0건, 본문 고아 `​` 줄은 보존(005 de 4 = ko 4) | `grep -P '^date_display: "\x{200B}'` 0 |
| 체커 | `--dir columns-de --lang de` → 17/17 PASS | 재실행 |
| es 무변경 | columns-es 최신 mtime 14:35 < R1 시각 | `ls -t` |

### ⚠ F1 방향에 대한 유보 — 사용자 확인 ASK 발행
R1은 제품 정본(`international-guidance-western.ts` 66행 `Geprüft von Rechtsanwalt Wei Tseng`, es `abogado`, ar `المحامي`)에 맞춰 **남성형**으로 통일했고 R2는 그 기준을 정확히 충족한다. 그러나 EN 프로필 사진과 2026-09-08 사용자 발언("내 아내 가능해")은 曾雋崴 변호사가 **여성**임을 시사한다. 실명 인물 표기이므로 추측으로 확정하지 않고 `ASK-claude-20260917-152000-attorney-gender`를 발행했다. 답이 「여성」이면 de/es/ar 칼럼 + western.ts 등 정본을 여성형(Rechtsanwältin / abogada / المحامية)으로 **전 로케일 기계 치환**하는 별도 WO가 필요하다(이 레인 단독 문제가 아니며, 그 치환은 R3 재검수 없이 grep 검증으로 충분). 답이 「남성」이면 현행 유지.

## 2. 신규 차단 (es) — R1이 놓친 것, Opus 정독에서 발견·Fable 대조 확인

| # | 파일:줄 | 문제 | 수정안 |
|---|---|---|---|
| E1 **P0** | `columns-es/002:16`(FAQ a), `002:117` | 휴업등기 **면제** 조건("이미 세무기관에 신고·核備했으면 등기 불필요", ko 002:50 괄호)을 `o, si esta no se ha declarado…` 로 15일 분기 안에 끼워 넣어 면제가 소실되고 없던 의무가 생김. de/id/en은 면제를 의무 전체에 걸어 정확 | `…antes de la suspensión o dentro de los 15 días desde su inicio (salvo que la suspensión ya se haya declarado y anotado (核備) ante la autoridad tributaria conforme a la Ley del Impuesto sobre las Ventas — salvedad del artículo 3, párrafo 1, del Reglamento de Registro de Sociedades; en tal caso este registro no es necesario)…` 두 곳 동일 |
| E2 **P0** | `columns-es/014:42` | `con solo consignar de forma uno de los dos` — 형용사 탈락으로 비문, ko 「**형식적으로만** 적어 두면」 논지 소실 | `con solo consignar de forma **formal** uno de los dos` (또는 `de manera meramente formal`) |
| E3 P1 | `columns-es/007:120` | 오타 `prometarse` | `prometerse` |
| E4 P1 | `columns-es/013:90` | `unos 1 mes` 수 일치 | `alrededor de 1 mes` |
| E5 P1 | `columns-es/008:2`(title), `008:19`(H1) | `¿…en Taiwán??` 닫는 부호 2개 | `?` 하나로 (ko 원문 008 제목의 `??`는 원문 오타이며 ko/en에서도 `?` 하나로 정정됨 — 반도체 레인 4a89a431 참조) |
| E6 P1 | `columns-es/005:70` | `¿Puede la sociedad contratar a coreanos como empleados**` — `¿` 열고 `?` 없음 | 문장 끝 `?` 추가 |

수정 후 필요한 재검수: E1·E2는 Fable 문장 대조 1회(R3, 해당 2줄만), E3~E6는 grep으로 충분.

## 3. 비차단 권장 (P2) — 다음 라운드에 묶어 처리

de(Opus 소견, Fable 확인):
- `de/007:176` `Die folgenden 1. Primärquellen` — ko 「1차 자료」의 「1차」가 서수 `1.`로 오역 → `Die folgenden Primärquellen`.
- `de/008:14` `erfordern` → `erfordert`(수 일치). `de/003:104` `Anspragsbetrags` → `Anspruchsbetrags`. `de/002:87` `…oder Sicherheiten lastet` 어절 누락 비문. `de/008:141` `Gesellschaftsangehörige` → `leitende Angestellte`.
- `de/001:143` 면책문에 ko/en에 없는 `und sichert kein bestimmtes Ergebnis zu` 추가, `de/005:28` ko에 없는 괄호 주석 `(Dieser Punkt betrifft das koreanische System…)` 추가 → 동형 위해 삭제 권장.
- `taiwanisch`(설립 8편) vs `taiwanesisch`(법률·사례 9편) 코퍼스 분기 — 사이트 정본 de 카피는 `taiwanisch`(14:0) → `taiwanisch`로 통일 권장.
- 체커 WARN de006 `2×2`는 오탐(ko 고유어 수사 「두 명」), de가 맞음.

es(Opus 소견):
- `es/004` 「한국 모회사·한국 측」 미변환(잠금 「일반 한국 기업 → empresas extranjeras」 적용 여부 판단 필요 — 조세조약 문맥은 사실이라 유지 가능, 일반 프레이밍 부분만 변환).
- 체커 WARN es003·007·010(사건번호 `제N호`)·006(`1×2, 2×2`)은 전부 오탐.

## 4. 통과 항목(양 언어, 변경 없음)
게이트 2(링크, 허용 변환만·/de,/es 대상 slug 실재) · 3(금지 주장 0, `garantiert/garantiza` 히트는 전부 부정문) · 4(국적 삽입 0, 사실인 한국 언급 유지) · 5(본문 한글 0, `url:` 한글은 바이트 동일 규칙) · 6(카테고리 34/34 정본 일치) · 7(동형: 블록·H·이미지·FAQ 수·고아 줄, url/lastmod/featured_image 바이트 동일) · 8(du/tú 0).

## 5. 다음 단계
1. es E1~E6 수정(워커) → R3(Fable, E1·E2 2줄 대조 + grep).
2. 성별 ASK 답 → 필요 시 전 로케일 호칭 치환 WO(별건).
3. P2는 원어민 검수 라운드와 함께.

---

# 부록 A — Grok 파견 Fable 5.1 R2 독립 재검수 (같은 WO, 별도 세션)

```
판정(R2 WO 범위 = R1 §7 F1·F2·F3): 해소 확인 — 세 항목 모두 수정 완료, 수정으로 생긴 신규 FAIL 0, es 무변경
판정(레인 전체): ITERATE — es 002 P0(위 §2 E1) 독립 확인 + 호칭 성별 ASK 대기
```

검토자: Fable 5.1 (`claude -p`, Grok Bot PID 97218 파견, 15:12:52 시작) · 2026-09-17 15:19 KST · 작업트리 `tseng-law-i18n-de-es-20260917` · 브랜치 `i18n/de-es-public-20260917` · HEAD `90352b02`
쓴 파일: 이 부록만(같은 파일에 append). 위 본문(son7-db 세션, 15:15:23, md5 `022b49f4…`)은 한 바이트도 고치지 않았다. 칼럼 md·체커 미수정. git 미조작. 라이브 HTTP 없음.

## A0. 작성자 충돌 기록 (사용자·Grok 판단 필요)

- 이 파일은 내가 쓰기 전에 이미 존재했다(15:15:23, son7-db 세션). 같은 세션이 15:14:59에 R1 리포트 `DE-ES-COLUMNS-FABLE51-REVIEW.md`도 덮어썼다. 내가 세션 시작 때 읽은 R1(15:11:44, F1·F2·F3 세 FAIL, de 9 PASS/8 FAIL)과 현재 디스크의 R1(F1만 FAIL, F2·F3은 「권고 R1·R2」로 강등, de 12 PASS/5 FAIL)은 서로 다른 문서다. R2 WO(15:12:40)는 원래 R1의 §7(F1·F2·F3)을 기준으로 발주됐고 워커도 그 셋을 고쳤다. 이 부록은 그 기준으로 검수했다.
- 같은 레인에 Fable 두 세션이 동시에 쓰고 있다(전역 규칙 「같은 작업트리 다중 작성자 금지」 위반 상태). 덮어쓰지 않고 append로 보존했다. 이후 라운드는 리뷰 작성자를 한 세션으로 고정할 것.
- 두 세션의 결론은 일치한다(§7 해소 · 레인 ITERATE). 아래는 내 독립 증거다.

## A1. R1 §7 해소 증거

| 항목 | 결과 | 증거(직접 실행) |
|---|---|---|
| F1 호칭 | 해소 | `grep -rn "Anwältin Wei Tseng" src/content/columns-de` → 0건(exit 1). 8줄 정독: 001:141 · 011:114 · 017:144 `Profil des Rechtsanwalts Wei Tseng`(속격 정확), 001:145 · 002:150 · 004:195 · 011:134 · 017:151 `**Rechtsanwalt Wei Tseng (曾雋崴)**`. `Rechtsanwältin` 0건. 남은 `Anwältin` 8줄(001:141, 005:86, 011:114, 013:84·132, 015:46·74·82)은 전부 `Anwältin oder Anwalt` 양성 일반 지칭 — R1이 유지로 판정한 그대로 |
| F2 002:71 | 해소 | de 002:71 정독: `… Lohn und Abfindung (資遣費), von besicherten Schulden, Steuerschulden und gewöhnlichen Schulden sind nach dem betreffenden Recht und dem Sachverhalt zu prüfen.` — R1 §3 수정안과 자구 일치, ko·es 002:71과 동형. `veranlasster Beendigung` de 전체 0건. 002 줄 수 150 = ko 150 |
| F3 U+200B | 해소 | de 17편 5행 U+200B 0건. 8편 5행 `od -c`: `d a t e _ d i s p l a y : " 1`(011은 `" 4`) — 따옴표 바로 뒤 숫자. 정규식 `^date_display: "[0-9]{1,2}\. [A-Za-zä]+ [0-9]{4}"$` 8/8 매치. 본문 고아 U+200B 줄번호 de↔ko 17/17 동일(예: 003 52줄, 005 8줄), 총 87 = ko 87 = es 87 |

## A2. 수정으로 생긴 신규 FAIL — 0

| 검사 | 결과 |
|---|---|
| 체커 | `--dir columns-de --lang de` → `summary PASS 17/17` · `--dir columns-es --lang es` → `summary PASS 17/17`(교차) |
| 동형 | 총 줄 수 de 2,643 = ko 2,643 = es 2,643. 파일별 줄 수 · 헤딩 줄번호+레벨 · href 다중집합(허용 변환 `/ko/columns/`·`/ko/contact` → `/de/`) 17/17 diff 0 |
| frontmatter | 수정 8편 `url`/`lastmod`/`featured_image` ko와 바이트 동일 8/8 |
| 격식 | de `du|dich|dir|dein*|euch|euer|eure*` 본문 0 |
| 한국 언급 | 수정 8편 ko `한국` 줄 ↔ de `korea*`(대소문자 무시) 줄: 001:25 · 011:23(「한국 기업/브랜드」→ `ausländische …` 잠금)만 차이, 나머지 6편 전 줄 일치. 수정된 줄(5행·002:71·호칭 8줄)의 ko 원문에는 `한국` 없음 |
| mtime | es 17편 최신 14:35:26 < R1 15:11:44 → es 무변경. de 변경은 8편(001·002·004·005·011·013·015·017) 15:12:18 단 한 번; 나머지 9편 14:23–14:44 그대로 |

## A3. 위 §2(E1–E6) 독립 대조

내 R1은 es 002·013을 grep만 했고(전편 정독 아님) es 005·007·014는 정독했다. 결과:

| # | 판정 | 근거 |
|---|---|---|
| E1 P0 | **확인** | ko 002:16·117 괄호 「이미 영업세법에 따라 세무기관에 휴업을 신고·核備한 경우에는 이 등기가 필요하지 않습니다」 = 등기 의무 전체의 면제. es 002:16·117은 `antes de la suspensión o, si esta no se ha declarado y anotado (核備) ya …, dentro de los 15 días`로 면제를 15일 분기의 조건으로 바꿔 「세무기관에 신고했으면 휴업 전에 등기해야 한다」로 읽힌다 → 면제 소실. de 002:16·117 `… bedarf dieser Eintragung nicht`는 정확. es 002를 grep만 한 내 R1의 누락이다 |
| E2 | 확인(분류 P1) | es 014:42 `consignar de forma uno de los dos` — `de forma` 뒤 형용사 탈락으로 비문, ko 「형식적으로만」 소실. 「하나만 적어 두면」 골격은 남아 P0보다 P1로 본다(R1 §6에서 권고로 잡았던 줄). 수정 필요는 동일: `de forma meramente formal` |
| E3 P1 | 확인 | es 007:120 `no puede prometarse` → `prometerse` |
| E4 P1 | 확인 | es 013:90 `unos **1 mes**` — `unos`+단수. `alrededor de 1 mes` |
| E5 | **레인 결함 아님** | es 008:2·19 `??`는 ko 008:2·19 `어렵다고??`(HEAD `90352b02`)와 동형. 인용된 `4a89a431`은 반도체 랜딩 카피 커밋으로 칼럼 008을 건드리지 않았다(`git show --stat 4a89a431`: intent-pages·IntentLandingPage만). en 008:2는 `?` 하나. ko 원문 정정 WO에 묶어 처리할 사항이지 이 레인의 FAIL이 아니다 |
| E6 P1 | 확인 | es 005:70 `**5. ¿Puede la sociedad contratar a coreanos como empleados**` — `¿` 열고 `?` 없음(ko는 물음표 자체가 없음). 스페인어 정서법상 닫는 `?` 필수. R1 정독에서 놓친 줄 |

## A4. 호칭 성별 ASK

`~/.local/share/son-bridge/ask/ASK-claude-20260917-152000-attorney-gender.md` status: waiting, `answered/` 없음(15:17 확인). 내 R1 F1은 레포 정본(`src/data/international-guidance-western.ts:66` `Geprüft von Rechtsanwalt Wei Tseng`)과 로케일 간 일관성(es `abogado`, ar `المحامي`)을 기준으로 남성형을 택했고, 그 기준에서 이번 수정은 정확하다. 정본 자체의 진위는 이 레인이 판단할 수 없다. 답이 「여성」이면 de 8줄뿐 아니라 es 17편 `abogado`·ar·western.ts 등 정본까지 별도 WO. 답 전에는 재치환하지 않는다.

## A5. 다음 단계

1. es E1(002:16·117) · E2(014:42) · E3(007:120) · E4(013:90) · E6(005:70) 수정 → R3는 E1·E2 두 줄 대조 + E3·E4·E6 grep. E5는 ko 원문 정정 WO에 묶음.
2. 성별 ASK 답 대기.
3. 리뷰 작성자 1세션 고정(A0).

원어민 검수는 이 검토가 대체하지 않는다.
