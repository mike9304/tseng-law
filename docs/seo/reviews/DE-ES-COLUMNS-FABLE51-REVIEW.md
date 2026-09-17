# Fable 5.1 최종 검수 리포트 — de/es 칼럼 17×2 (독립 2차 정독본)

- reviewer: Fable 5.1 (Claude Fable 5.1 review agent dispatched by the Fable 5.1 session on 2026-09-17)
- date: 2026-09-17 (본문 정독 14:55–15:14 KST, 디스크 상태 재확인 15:20 KST)
- worktree: `/Users/son7/Projects/tseng-law-i18n-de-es-20260917`
- branch: `i18n/de-es-public-20260917` (uncommitted)
- base commit: `90352b029bfd5419c093a899d4bdeff49e5eb089` (`git log -1 --format=%H origin/main`, WO의 90352b02와 일치)
- WO: `docs/seo/reviews/DE-ES-COLUMNS-FABLE51-WO-20260917.md`

## ⚠ 파일 이력 고지 (반드시 먼저 읽을 것)

같은 경로에 **두 Fable 5.1 검수 세션이 동시에 배정**되었다.

1. 세션 A(`son7-51`)가 ~15:10에 R1을 이 경로에 먼저 썼다(브리지 요약: `~/.local/share/son-bridge/out/OUT-claude-20260917-1510-de-es-review.md`). 워커(Grok)가 그 R1 §7의 F1·F2·F3를 15:12:18에 수정했고, `DE-ES-COLUMNS-FABLE51-WO-R2-20260917.md`(15:12:40)·`DE-ES-COLUMNS-FABLE51-REVIEW-R2.md`(15:15:23)가 그 R1을 참조한다.
2. 이 파일(세션 B, 본 리포트)은 **15:14:59에 같은 경로에 쓰이면서 세션 A의 R1 원문을 덮어썼다.** 세션 A의 R1 원문은 디스크에 남아 있지 않다. 세션 A R1의 판정·차단 목록은 위 브리지 요약과 WO-R2 §「워커가 한 수정」에만 남아 있다. 이 파일은 세션 A R1의 대체가 아니라 **독립적인 2차 정독 결과**이며, R2의 "R1 §7"은 세션 A 원문(F1 `Anwältin`→`Rechtsanwalt`, F2 de 002:71 관계절 삭제, F3 date_display U+200B)을 가리킨다.
3. 세션 B는 15:12:18 수정 **이전** 상태를 정독했다. 아래 표와 결함 목록은 15:20 KST 디스크 상태를 다시 확인하여 "수정됨/미수정"을 명시했다.

세션 A R1이 차단으로 잡았으나 **워커가 고치지 않았고 R2 범위에도 없던** de 항목(브리지 요약 기준: 013:118 의무 주체 역전, 007:152 `Gerichtsordnung` 오역, 002:16/117 核備 병기 누락, 하드 오타 6)을 세션 B가 재검증하여 아래 F2·F3·R2에 파일:줄로 복원해 두었다. 이 항목들이 유실되지 않도록 R3에서 함께 처리할 것.

```
판정: ITERATE
범위: columns-de 17 + columns-es 17
방법: Read/Grep. 원본 md 미수정.
```

## 판정 요약 (15:20 KST 디스크 기준)

- **de: 15 PASS / 2 FAIL** — 007(152행 `Gerichtsordnung` 오역), 013(118행 의무 주체 역전). 세션 A F1(`Anwältin`)·F2(002:71)·F3(U+200B)는 **수정 확인**(아래 §해소 확인).
- **es: 15 PASS / 2 FAIL** — 002(16·117행 휴업등기 면제 소실, P0), 014(42행 「형식적으로만」 탈락, P0). es는 15:12 이후 무변경(mtime 최신 14:35).
- 8게이트 중 링크·금지주장·국적삽입·한글잔존·카테고리·동형·격식은 34편 전부 통과. 남은 FAIL은 모두 게이트 1(사실·의미 왜곡) 4건이며 각각 한 줄 수정.
- **성별 표기 방향은 미확정**: 세션 A가 레포 정본(남성형)에 맞춰 `Rechtsanwalt`로 통일시켰고 세션 B도 레포 내부 근거로 같은 판단을 했으나, R2가 실명 인물의 실제 성별에 대해 `~/.local/share/son-bridge/ask/ASK-claude-20260917-152000-attorney-gender.md`를 발행했다. 답이 「여성」이면 de/es/ar + `international-guidance-*.ts` 전 로케일 치환이 별도 WO로 필요. 이 리포트는 그 결정을 대신하지 않는다.

## 검수 범위(정직 신고)

- **de 17/17 전편 정독**(필독 8 + 표본 017 FAIL로 WO 규칙에 따라 전편 확대).
- **es 11/17 전편 정독**: 001, 003, 004, 005, 006, 007, 008, 010, 012, 014, 017. **es 002, 009, 011, 013, 015, 016은 grep 게이트만**이었다. → es 002:16/117 P0를 놓친 원인. 세션 A/R2가 잡은 뒤 세션 B가 ko와 대조 확인했다.
- 세션 B가 de 전편 정독에서도 놓친 것: 007:152, 013:118(세션 A가 잡음). 정독은 완전하지 않았다.
- 대조본: `src/content/columns/`(ko), `columns-id/`(구조·선례), `columns-en/`·`columns-ar/`(선례).
- 라이브 HTTP 없음. git write 없음. 칼럼 md·체커·라우팅 미수정. 세션 B의 유일한 쓰기는 이 파일(2회).

## 체커 재실행 결과(직접 관찰, 15:20 KST 재실행 포함)

`PATH=/Users/son7/.nvm/versions/node/v24.14.1/bin:$PATH`

- `node scripts/check-column-translation.mjs --dir src/content/columns-de --lang de` → `summary  PASS  17/17 files`, WARN 1(006 numbers `extra in translation (2): 2×2`)
- `node scripts/check-column-translation.mjs --dir src/content/columns-es --lang es` → `summary  PASS  17/17 files`, WARN 4(003 `제644호; 제477호; 제236호`, 006 `1×2, 2×2`, 007 `제4호` ×4, 010 `제7호`)
- 수정 전(14:5x)·후(15:20) 결과 동일.

교차검증(체커 맹신 안 함): 링크 집합 ko(허용 변환 적용) vs de/es 정렬 diff → 34편 IDENTICAL. H1=title·이미지 수·FAQ 수·고아 ZWSP 줄·헤딩 수·줄 수 → 34편 일치. `url`/`lastmod`/`featured_image` 바이트 동일 34/34. 카테고리 frontmatter 정본표 일치 34/34, 010만 case.

## 세션 A R1 §7 해소 확인 (세션 B 독립 확인, 15:20 KST)

| 항목 | 상태 | 근거 |
|---|---|---|
| F1 `Anwältin Wei Tseng` | **해소** | `grep -c "Anwältin Wei Tseng" columns-de/*.md` → 0. `001:141` `[Profil des Rechtsanwalts Wei Tseng]`, `001:145`/`002:150`/`004:195`/`011:134`/`017:151` `**Rechtsanwalt Wei Tseng (曾雋崴)**`, `011:114`/`017:144` `Profil des Rechtsanwalts`. 일반 양성 병기 `Anwältin oder Anwalt`(001:141, 005:86, 011:114, 013:84·132, 015:46·74·82)는 특정인 지칭이 아니므로 유지 정당 |
| F2 de 002:71 관계절 | **해소** | `sed -n 71p` — `Lohn und Abfindung (資遣費), von besicherten Schulden…` 로 ko 002:71과 동형 |
| F3 date_display U+200B | **해소** | `grep -c $'^date_display: "​'` de 17편 0. 본문 고아 ZWSP 줄 수 de=ko 유지(003 52, 005 4, 006 4, 008 10, 009 5, 013 4, 015 3) |

## 파일별 판정 (34, 15:20 KST 디스크 기준)

| 파일 | 판정 | 사유(한 줄) |
|---|---|---|
| de/001-taiwan-company-establishment-basics.md | PASS | F1 해소 확인. 조세조약 일자·10%·183일·TWD 50만/300만·USD 50만/20만·5%/20%/21% 일치 |
| de/002-withdraw-capital-taiwan-company.md | PASS | F1·F2 해소. 제9·90·113·316·89조, 15일/45일/30일, 1개월/15일/1년 일치. 16·117행 `核備` 병기 누락은 권고(R2) |
| de/003-taiwan-traffic-accident-procedure.md | PASS | Q1–Q20 조문·금액·일자 전부 일치, 52 ZWSP 보존 |
| de/004-taiwan-company-subsidiary-vs-branch.md | PASS | F1 해소. 제380조 "sämtliche Zweigniederlassungen"(전 지점) 정확 — AR 004 함정 없음 |
| de/005-taiwan-company-establishment-advanced-2.md | PASS | 한국 은행·외환 사실 유지, 심사표준 38·39조 일치, Q1 괄호주는 id 선례와 동일 |
| de/006-taiwan-massage-history-law.md | PASS | 1980/2003/TWD 4만·1만·2만/한국 3년·5년 일치, WARN 오탐 |
| de/007-taiwan-divorce-lawsuit-qna.md | **FAIL** | 152행 `eine anwendbare Gerichtsordnung`(법원 규칙) ← ko `적용 가능한 법원 명령` — 의미 오역(F2). 그 외 조문·기간 일치 |
| de/008-taiwan-labor-severance-law.md | PASS | 제11·12·17조, 勞退條例 12조, 0.5개월/6개월, 3일/6일 일치, 한국 비교 유지 |
| de/009-taiwan-voluntary-resignation-severance.md | PASS | 제14·17·18조, 6개 사유, 30일 ×2 일치 |
| de/010-taiwan-gym-injury-lawsuit.md | PASS | 109年度消字第7號, 2022-01-24, TWD 1,579,589, 6개월/2년/10년, 5·3·1배 일치 |
| de/011-taiwan-cosmetics-…-guide.md | PASS | F1 해소. PIF·등록 3년·5년 보관·과태료 구간 일치 |
| de/012-taiwan-overtaking-accident-liability.md | PASS | 제101조, 0,5 m, 경적 2회/전조등 1회, 1초 미만 일치 |
| de/013-taiwan-company-establishment-advanced-1.md | **FAIL** | 118행 `muss … die Stadtverwaltung (市政府) verlangen, dass…` — 의무 주체가 시정부로 역전(F3). 그 외 3개월/1개월/2개월/外投條例 9조 일치 |
| de/014-taiwan-mandatory-employment-period.md | PASS | 15-1조 I–IV, 2026-06-05 지침, 勞動關2字第1150141814號, 10/20/30일 일치 |
| de/015-taiwan-company-setup-pitch-location.md | PASS | 2023-01-01, 예비조회 URL, 主動查詢 목록 일치 |
| de/016-taiwan-inheritance-custody-analysis.md | PASS | 1138·1144·1030-1·1148·1174(3개월)·1089·1091·1093·1094·1094-1·1086·1087·1088조, 2026-06-25 일치 |
| de/017-taiwan-logistics-business-setup.md | PASS | F1 해소. 2,500만/20대·1,000만/8대·5대, 1대/2년, 1년, 6+6개월, 1개월, 3년 일치 |
| es/001-taiwan-company-establishment-basics.md | PASS | 사실·링크·수치 일치; 123행 삽입절은 권고 |
| es/002-withdraw-capital-taiwan-company.md | **FAIL** | 16·117행 휴업등기 **면제** 조건이 15일 분기의 조건절로 들어가 면제가 소실(F4, P0). 세션 B는 grep만 했고 세션 A/R2가 잡음 → 세션 B가 ko와 대조 확인 |
| es/003-taiwan-traffic-accident-procedure.md | PASS | Q1–Q20 일치; `n.º 644/477/236` 존재 — WARN 오탐 |
| es/004-taiwan-company-subsidiary-vs-branch.md | PASS | 제380조 "todas las sucursales" 정확; 27행 `unidad filial`은 권고 |
| es/005-taiwan-company-establishment-advanced-2.md | PASS | 한국 사실 유지, 38·39조 일치; 70행 `¿…` 닫는 `?` 없음은 R2 E6(P1) |
| es/006-taiwan-massage-history-law.md | PASS | 수치 일치; WARN(un/dos)은 ko 한/두 대응 — 오탐 |
| es/007-taiwan-divorce-lawsuit-qna.md | PASS | 조문·기간 일치; `n.º 4` ×4 존재 — WARN 오탐; 120행 `prometarse` 오타는 R2 E3(P1) |
| es/008-taiwan-labor-severance-law.md | PASS | 조문·산식 일치, 한국 비교 유지; 제목 `??`는 ko 원문(이 워크트리 `columns/008:2`)도 `??` — 정규화는 제품 판단 |
| es/009-taiwan-voluntary-resignation-severance.md | PASS | (grep) 게이트 전부 통과 |
| es/010-taiwan-gym-injury-lawsuit.md | PASS | `n.º 7 del año 109` 존재 — WARN 오탐; 수치 일치 |
| es/011-taiwan-cosmetics-…-guide.md | PASS | (grep) 게이트 전부 통과, 서명 `Abogado` |
| es/012-taiwan-overtaking-accident-liability.md | PASS | 제101조, 0,5 m, 2 toques/1 destello, 1 segundo 일치 |
| es/013-taiwan-company-establishment-advanced-1.md | PASS | (grep) 게이트 통과; 90행 `unos 1 mes` 수 일치는 R2 E4(P1) |
| es/014-taiwan-mandatory-employment-period.md | **FAIL** | 42행 `con solo consignar de forma uno de los dos` — 형용사 탈락으로 ko 「형식적으로만」 논지 소실(F5, R2 E2). 그 외 15-1조·지침·10/20/30일 일치 |
| es/015-taiwan-company-setup-pitch-location.md | PASS | (grep) 게이트 전부 통과 |
| es/016-taiwan-inheritance-custody-analysis.md | PASS | (grep) 게이트 전부 통과 |
| es/017-taiwan-logistics-business-setup.md | PASS | 자본·차량·기한 일치, 서명 `Abogado` |

## 결함(FAIL) — 심각도순, 15:20 KST 디스크 기준 미수정

### F1. [de] 저자 성별 표기 `Anwältin` — **디스크에서 해소됨, 방향은 ASK 대기**
세션 B가 14:5x 정독에서 `001:141·145`, `002:150`, `004:195`, `011:114·134`, `017:144·151`의 `Anwältin Wei Tseng` / `Profil der Anwältin Wei Tseng`을 레포 정본과의 모순(`src/data/international-guidance-team.ts:281` `Rechtsanwalt Wei Tseng`, `:284` `geschäftsführender Anwalt`; de `003:366` `taiwanesischer Anwalt`, `008:23`, `010:22` `Prozessbevollmächtigter`, `007:199`/`014:194`/`016:154` `Rechtsanwalt`; es 17편 `Abogado`)으로 FAIL 판정 → 워커가 15:12:18 `Rechtsanwalt`/`des Rechtsanwalts`로 통일(위 §해소 확인). **단 실제 성별은 레포 데이터로 확정 불가**하며 R2의 ASK 답에 따라 전 로케일 재치환이 필요할 수 있다. 세션 B의 근거는 레포 내부 일관성뿐이었다.

### F2. [de] 007:152 `Gerichtsordnung` 오역 (게이트 1) — 미수정
- `src/content/columns-de/007-taiwan-divorce-lawsuit-qna.md:152` `…ob Zustimmung des anderen Elternteils oder eine anwendbare Gerichtsordnung vorliegt.`
- ko `columns/007:152` `다른 부모의 동의나 적용 가능한 법원 명령이 있는지`
- `Gerichtsordnung` = 법원 조직/규칙. 수정: `…oder eine anwendbare gerichtliche Anordnung vorliegt.`

### F3. [de] 013:118 의무 주체 역전 (게이트 1) — 미수정
- `src/content/columns-de/013-taiwan-company-establishment-advanced-1.md:118` `Außerdem muss bei der endgültigen Gesellschaftseintragung die Stadtverwaltung (市政府) verlangen, dass die Eintragungsadresse in einem Gebiet liegt, in dem Restaurantbetrieb zulässig ist;`
- ko `columns/013:118` `또한 최종 회사 등록 시 시정부에서도 식당 영업이 가능한 구역에 등록 주소지가 있어야 하며,` (시정부가 요구하는 요건이지 시정부의 의무가 아님)
- 수정: `Außerdem verlangt die Stadtverwaltung (市政府) bei der endgültigen Gesellschaftseintragung, dass die Eintragungsadresse in einem Gebiet liegt, in dem Restaurantbetrieb zulässig ist;`

### F4. [es] 002:16 / 002:117 휴업등기 면제 소실 (게이트 1, P0) — 미수정
- `src/content/columns-es/002-withdraw-capital-taiwan-company.md:16`(FAQ a3) 및 `:117` `…debe solicitar el registro de suspensión (停業登記) antes de la suspensión o, si esta no se ha declarado y anotado (核備) ya ante la autoridad tributaria …, dentro de los 15 días desde la fecha de inicio…`
- ko `columns/002:16`·`:117` `휴업 전 또는 휴업 시작일부터 15일 이내에 휴업등기를 신청해야 하며(이미 영업세법에 따라 세무기관에 휴업을 신고·核備한 경우에는 이 등기가 필요하지 않습니다 — 회사등기방법 제3조 제1항 단서)`
- es는 「세무기관에 이미 신고했으면 등기 자체가 불필요」라는 면제를 「신고 안 했으면 15일 내」 조건으로 바꿔 없던 의무를 만든다. de `002:16`·`:117`(`…bedarf dieser Eintragung nicht`)은 정확.
- 수정(두 곳 동일): `…antes de la suspensión o dentro de los 15 días desde su inicio (salvo que la suspensión ya se haya declarado y anotado (核備) ante la autoridad tributaria conforme a la Ley del Impuesto sobre las Ventas — salvedad del artículo 3, párrafo 1, del Reglamento de Registro de Sociedades (公司登記辦法); en tal caso este registro no es necesario), y cada período de suspensión no puede exceder de 1 año.`

### F5. [es] 014:42 핵심어 탈락 (게이트 1, P0) — 미수정
- `src/content/columns-es/014-taiwan-mandatory-employment-period.md:42` `…ni que el pacto entero sea automáticamente válido con solo consignar de forma uno de los dos.`
- ko `columns/014:42` `둘 중 하나만 형식적으로 적어 두면 약정 전체가 자동으로 유효해진다는 뜻도 아닙니다.`
- 수정: `…con solo consignar de manera meramente formal uno de los dos.`

## 체커 WARN 판정

| WARN | 판정 | 근거 |
|---|---|---|
| de 006 `extra 2×2 (zwei)` | 오탐, 결함 아님 | `de/006:56` `zwei nicht sehbehinderte Beschäftigte`, `:58` `die zwei Beschäftigten` ↔ `ko/006:56` `두 명의 직원`, `:58` `두 직원`. 체커가 한국어 고유수사 「두」를 숫자로 세지 않음 |
| es 003 `수사미해석 제644호·제477호·제236호` | 오탐, 결함 아님 | `es/003:187` `n.º 644`, `:188` `n.º 477`, `:191` `n.º 236` 존재. 체커가 `n.º` 형식 미인식 |
| es 006 `extra 1×2, 2×2 (un/dos)` | 오탐, 결함 아님 | `es/006:26` `un solo corte` ↔ ko `한 번`; `:46` `una sola solicitud` ↔ `한 번의`; `:56`/`:58` `dos trabajadores` ↔ `두 명`/`두 직원` |
| es 007 `수사미해석 제4호 ×4` | 오탐, 결함 아님 | `es/007:16`, `:65`, `:186`, `:187` `n.º 4 del año 112 (112年憲判字第4號)` |
| es 010 `수사미해석 제7호` | 오탐, 결함 아님 | `es/010:22` `n.º 7 del año 109 (109年度消字第7號)` |

권고(범위 밖): 체커 `numbers` 파서에 `n\.º\s*\d+`·`Nummer\s+\d+` 인식과 ko 고유수사(한·두·세) 대응 추가 시 WARN 5건 소멸.

## 권고(FAIL 아님) — 심각도순

### R1. [de] 원문에 없는 삽입 / 병기 누락
- `de/002:16`, `de/002:117` `핵備` 병기 없음(`…und von ihr vermerkte Betriebsruhe`) — ko·es는 `核備` 병기. 게이트 5 경계 사례, 추가 권고: `…und von ihr vermerkte (核備) Betriebsruhe`.
- `de/001:143` 면책문 `und sichert kein bestimmtes Ergebnis zu` — ko/en/id에 없는 추가(면책 강화라 유해하지 않음, 동형 위해 삭제 선택).
- `de/005:28`, `es/005:28` Q1 괄호주 `(Dieser Punkt betrifft das koreanische System …)` / `(este punto trata del sistema coreano …)` — `columns-id/005:28`에 동일 선례 → 레인 관례로 수용 가능.
- `es/001:123`, `es/004:127` `…, que como se ha indicado solo se aplica a los casos que reúnen sus requisitos, …` — ko에 없는 삽입절, 삭제 권고.
- `es/001:119`, `es/004:14`, `es/004:57` `(營業稅, análogo al IVA)` gloss 추가 — 선택.

### R2. [de] 오탈자·문법 (세션 A "하드 오타 6" 상당 복원)
- `de/002:87` `…oder Sicherheiten lastet` → `…oder wenn Sicherheiten darauf lasten`
- `de/002:16`, `de/002:117` `darf 1 Mal 1 Jahr nicht überschreiten` → `darf jeweils 1 Jahr nicht überschreiten`
- `de/003:104` `Anspragsbetrags` → `Anspruchsbetrags`
- `de/007:55` `Nature der Sache` → `Natur der Sache`
- `de/007:176` `Die folgenden 1. Primärquellen` → `Die folgenden Primärquellen`
- `de/008:14` `Dagegen erfordern eine wirtschaftliche Kündigung` → `erfordert`
- `de/008:141` `der Gesellschaftsangehörige` → `der leitende Angestellte`
- `de/010:64` `Sicherheitsplicht` → `Sicherheitspflicht`
- `de/016:142` `GesetzesSeiten` → `Gesetzesseiten`
- `de/017:91` `des Geschäftvertrags` → `des Geschäftsvertrags`

### R3. [es] 오탈자·어색한 표현 (R2 E3–E6 포함)
- `es/001:13` `"¿Constitución de la sociedad implica …?"` → `"¿La constitución de la sociedad implica …?"`
- `es/004:27` `unidad filial (分支機構)` — 본문 전체에서 `filial`=자회사라 지점 별칭에 혼동. `delegación` 권고.
- `es/005:24` `también esperan ser de utilidad` → `espero que también sean de utilidad`
- `es/005:70` `**5. ¿Puede la sociedad contratar a coreanos como empleados**` — `¿` 열고 닫는 `?` 없음(번역자가 `¿`를 추가) → 끝에 `?` 추가 (R2 E6)
- `es/007:120` `prometarse` → `prometerse` (R2 E3)
- `es/008:2`, `es/008:19` `…en Taiwán??` — 이 워크트리의 ko `columns/008:2`도 `??`. 정규화는 제품 판단(R2 E5는 `?` 하나 권고)
- `es/010:82` `diagnosis` → `diagnóstico`
- `es/013:90` `unos **1 mes**` → `alrededor de **1 mes**` (R2 E4)

### R4. [de/es] 용어·서명 일관성
- de: `taiwanisch`(설립 8편) vs `taiwanesisch`(법률·사례 9편) 혼용. `/ko/korean-lawyer-in-taiwan` 링크문구 `Taiwanische Anwältin oder taiwanischer Anwalt…`(005:86, 013:132, 015:82) vs `Taiwanesischer Anwalt…`(003:372, 008:231, 009:100, 010:118, 012:62). 사이트 de 정본 카피 기준으로 통일 권고.
- es: 서명 `**Abogado Wei Tseng (曾雋崴)**`(001, 002, 004, 011, 017) vs `**Wei Tseng (曾雋崴), abogado de Taiwán**`(007, 014, 016). ko는 전부 `증준외 변호사(曾雋崴, Wei Tseng)`. 통일 권고.

### R5. [de/es] ko 원문 결함 계승
- `de/013:122-124` `Vor Abschluss des Miet` / (빈 줄) / `vertrags…` — ko `columns/013:122-124` `임대` / `계약 체결 전에`가 문단 중간에서 끊긴 원문 결함을 블록 동형성 때문에 계승(es도 동일). 근본 수정은 ko.
- `ko/004:175` "영업세법 제10조" 링크가 `G0340028&flno=3`을 가리키는 것도 ko 원문 문제이며 de/es가 충실히 계승.

## 게이트별 통과 근거(요약)

1. **사실**: 정독 28편(de 17 + es 11)의 조문번호·금액·일자·기간·배수·차량대수를 ko와 1:1 대조 — 위 F2·F3·F4·F5 외 불일치 없음. 004 제380조 "전 지점 말소" de/es 정확. 한국 사실(001/004 조세조약, 005 한국 은행·외환, 006/008/009 한국 비교, 010 한국인 당사자, 007 `wie Korea und Taiwan`·`in Korea leben`) 유지. 일반 「한국 기업」 프레이밍은 `ausländische Unternehmen`/`empresas extranjeras`(001:25, 011:23).
2. **링크**: 34편 링크 집합 diff IDENTICAL(허용 변환 `/ko/columns|contact` → `/{lang}/`만; `/ko/services#investment`, `/ko/lawyers/…`, `/ko/taiwan-*`, `/ko/guides/…`, `/ko/services/family|labor`는 `/ko/` 유지). 없는 `/de|es/columns/…` 0.
3. **금지 주장**: `Beratung auf Deutsch|deutschsprachige Beratung|kostenlos|gratis|Dolmetsch|24/7|sofortige Antwort|Erfolgsquote|garantier…` / `consulta en español|gratuita|intérprete|24/7|inmediat|garant…|tasa de éxito` — 0. 히트는 `Übersetzung`(서류 번역), `sofort Hilfe leisten`(구호), `garantiert keine`(부정형) 등 정당한 용법뿐.
4. **국적 삽입**: `Deutschland|deutsche Unternehmen|España|españolas|europ|EU|UE` 0. Korea 언급은 ko에 있는 곳에만.
5. **한글 잔존/병기**: 본문 한글 0(008/009 `url` 한글은 바이트 동일 필드). 병기 누락은 R1의 de 002 `核備` 1건만 발견.
6. **카테고리**: de `Gesellschaftsgründung in Taiwan`×8 / `Rechtliche Informationen zu Taiwan`×8 / `Fallanalyse`×1(010); es `Constitución de sociedades en Taiwán`×8 / `Información jurídica de Taiwán`×8 / `Análisis de casos`×1(010) — `src/lib/columns.ts:151-152` 정본과 일치.
7. **동형**: H1=title 34/34, 이미지·FAQ·고아 ZWSP·헤딩·줄 수 34/34, `url`/`lastmod`/`featured_image` 바이트 동일 34/34.
8. **격식**: de `du|dir|dich|dein|euch` 본문 0(히트 4건 모두 URL `/Mns/dir/`). es `tú|te|tu|tus|vosotros|vuestro|contigo|os` 0.

## 이 검수가 다루지 않은 것

- **원어민(독일어·스페인어) 문체·자연스러움 검수는 하지 않았고 대체하지 않는다.** R2·R3는 눈에 띈 것만이며 전수 교정이 아니다.
- es 002, 009, 011, 013, 015, 016은 grep 게이트만(전편 정독 아님). es 002 P0는 그 결과 놓쳤다.
- de 전편 정독에서도 007:152·013:118을 놓쳤다(세션 A가 잡음). 정독 신뢰도는 완전하지 않다.
- 라이브(tseng-law.com) 렌더·라우팅·사이트맵·llms.txt·`:3028`·단위테스트는 재현하지 않음(WO 금지/범위 밖).
- 대만 법령 원문 자체의 정확성은 검증 대상 아님(ko 대비 동일성만).
- 실명 인물의 성별은 레포 데이터로 확정할 수 없다(ASK 대기).
- 체커 스크립트 수정은 범위 밖(권고만).
- 세션 A R1 원문의 복원은 불가능하다(브리지 요약만 존재). 세션 A의 "es 014:58/64·008:161–167 문장 붕괴"는 세션 B가 해당 줄을 읽었을 때 문법적으로 무너진 문장을 확인하지 못했다(ko의 행 단위 구조를 계승한 어순 어색함은 있음) — 세션 A 판단을 확인도 반박도 하지 않는다.

## 다음 단계(제안)

1. 워커: F2(de 007:152), F3(de 013:118), F4(es 002:16·117), F5(es 014:42) 4건 + R3 E3–E6(es 005:70, 007:120, 013:90, [008 제목은 제품 판단]) 수정 → 체커 de/es 재실행.
2. Fable R3: 위 4줄(+es 002 두 곳) ko 대조 1회 + grep(`Gerichtsordnung`, `verlangen, dass`, `si esta no se ha declarado`, `de forma uno`) 0 확인.
3. 성별 ASK 답 → 「여성」이면 de/es/ar + `src/data/international-guidance-*.ts` 전 로케일 치환 WO(별건, grep 검증).
4. R1·R2·R4는 원어민 검수 라운드에 묶어 처리.
5. 같은 경로 이중 배정 재발 방지: 검수 산출물 경로를 WO에서 세션별로 분리하거나 브리지가 배정 중복을 막을 것.

원어민 검수는 이 검토가 대체하지 않는다.
