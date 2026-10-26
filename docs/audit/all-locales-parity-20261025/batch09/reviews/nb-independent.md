# NB 6편 독립 검수 R1 — Kimi R2 동결본

검수일: 2026-10-26 KST. 대상은 batch09의 Norwegian Bokmål 915·916·918·919·920·921이다. 원고는 수정하지 않았다. 판정은 REQUEST_CHANGES: 필수 M01–M03 3묶음이며, 선택 S01–S04는 별도로 제시한다. 동일 SHA에 대한 기존 실제 공유 검사 결과는 6편 exit 0 / FAIL 0이다. 기계 통과와 법률 의미·문체 승인은 서로 다른 판정이다.

이 기록은 AI 독립 검수이며 인간 원어민이나 대만 변호사의 승인이 아니다. 브라우저 렌더링·접근성·공개 게시를 검증하지 않았다. R 앱, 공유 도구, Kimi 원본, 저자 기록 및 다른 작업자의 파일은 변경하지 않았다.

## 입력과 실제 읽은 범위

- EN915/916, ZH918–921 현재 정본 6편을 본문·메타데이터·FAQ까지 다시 읽었다. B6 `research/authoring-contract-draft.md`, `six-source-facts.md`를 대조했다. source-register/source-freeze/bundle은 계속된 동일 여섯 주제 작업에서 읽은 범위를 재사용하고 SHA 불변을 확인했다. 추가 사실을 모두 새 번역에 넣어야 한다고 요구하지 않았다.
- R의 최근 NB704–706 전문을 읽었다. 모두 published 2026-10-25이며 SHA는 각각 `cba566d0784ea956b38847832ce22be370c76831194873328c900de2858c5340`, `cc836d5c7d11066b328cad6c725334a596e1463d1af290af0779b6575e1f6b88`, `2c39c9657f8f8d704afbeb4b7640bd5faaf63debb0384a546966652128bbbea1`이다. 기한 숫자로 시작하는 704, 입국 자격을 설명하는 705, 카드 만료일에 대한 질문으로 시작하는 706의 차이를 확인했다. ARC 법률 내용을 새 사건의 근거로 쓰지 않았다.
- R `docs/columns/EDITORIAL-VOICE.md`, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, 공유 `SENTENCE-VARIETY-RULE.md`, 최신 `LESSONS.md` 전문을 읽었다. 검수 시작 때 최신 LESSONS는 15:05판 SHA `ca642a38c2b0a925c19ded6600b2f06901aed057bed44b71fab9c16f22c2b7ab`이다. 홈 공통 editorial-voice 경로는 이 기계에서 부재하여 프로젝트 정본을 적용했다.
- B9 BRIEF.md는 검수 시작 시 없었다. 마무리 중 새로 생성된 B9 BRIEF와 참조 B7/B8 BRIEF 전문을 추가로 읽었고, 기존 판정·출력 소유 범위와 충돌하지 않음을 확인했다. 주 에이전트의 배정, 동결 B6 계약 및 실제 `/private/tmp/tseng-kimi-nb-cases-20261026/TASK.md` 전문도 적용했다. TASK의 정확한 캡션은 `Fiktiv scene`이다. 최근 NB의 다른 캡션을 이유로 이를 오류라고 하지 않았다.
- 현재 NB 여섯 원고의 제목·요약·alt·표·출처·17 FAQ를 모두 읽었다. 기존 실제 공유 검사에 보존된 본문 추출 269개도 전부 읽었다. 표와 FAQ가 본문 측정에 포함되지 않으므로 따로 검토했다.
- 915·916은 B6에 보존된 공식 법원 설명의 해당 부분을 직접 재대조했다. 915의 소송 당사자와 절차 순서, 916의 양측 상고·246/262 범위를 확인했다. 이는 새 법원 접속이나 전체 판결문 열람이라는 뜻이 아니다. 918·921은 이번 검수에서 원 PDF 416쪽 전체를 읽지 않았으며, 동결 정본·사실표·선행 연구가 명시한 관련 판결 부분의 출처 범위를 사용했다.
- 노르웨이어 절차 용어를 확인하려고 노르웨이 법원 공식 안내의 해당 문단과 Bokmålsordboka 항목을 별도 조회했다. 이 자료는 번역 용어의 구별에만 사용했으며 대만 사건에 노르웨이 법을 적용하지 않았다.

입력 25개 파일의 27회 버전 기록(LESSONS 재생성과 BRIEF 후속 공지 포함)의 실제 경로·SHA·읽기 범위는 [nb-independent-inputs.json](../checks/nb-independent-inputs.json), 실행 증거 검증은 [nb-independent-verification.json](../checks/nb-independent-verification.json)에 있다.

## Kimi provenance와 실제 검사 증거

`input-manifest.json`의 모델 표시는 `kimi-code/k3.1-pro`, 공개 입력 commit은 `f0dd7cb36088d9108e239eafdcb2278d4f6d1093`이다. 최초 실행의 CLI 인자 오류(exit 1)와 수정된 실제 실행(exit 0)을 구별했다. 원 저자의 `author-review.md`, R2 저자 기록, 12개 exact edits를 읽었다.

R2 intake SHA는 `55a1d690446eafd4eb020926f15447b10862475a17be140d8d63be79ecb10d8b`, 실제 exec session 21778은 exit 0으로 기록되어 있다. 내가 직접 12개 치환을 원본에 순서대로 적용하고 역순으로 복원하여 6/6 전방 일치·6/6 원본 바이트 복원을 확인했다. 현재 인수 원고는 raw-output-r2의 여섯 출력과 정확히 같다. Kimi 입력 16건도 현재 바이트와 manifest가 일치한다. 원 저자 기록은 R2 디렉터리의 보존본과 바이트가 같다.

Kimi에 전달된 LESSONS는 사용자 승인 옛 packet SHA `adcb20ff50cd7cbb682fda48efbb253b1f152857cc4ecd52c0c3658d5fda157b`이다. 최신 내부 LESSONS를 Kimi가 읽었다고 주장하지 않는다. 이번 독립 검수에서 최신판을 적용했다.

R2 기록의 frontmatter 보존 설명은 필드·계약의 유지로 읽어야 한다. 916 FAQ2 답변은 실제로 변경되어 916 frontmatter 바이트가 달라졌다. 나머지 다섯 편은 최초 frontmatter와 동일하다. intake의 `sharedChecks: pending`는 인수 직후의 상태이며, 이후 07:40:31 UTC 실제 검사 기록과 구별한다.

| ID | 현재 공유 CLI 증거 | 본문 단위 | CV | FAQ | 공식 URL 수 |
|---|---|---:|---:|---:|---:|
| 915 | exit 0 / FAIL 0 | 39 | .514 | 2 | 4 |
| 916 | exit 0 / FAIL 0 | 44 | .519 | 3 | 3 |
| 918 | exit 0 / FAIL 0 | 46 | .503 | 3 | 4 |
| 919 | exit 0 / FAIL 0 | 44 | .476 | 3 | 4 |
| 920 | exit 0 / FAIL 0 | 46 | .493 | 3 | 4 |
| 921 | exit 0 / FAIL 0 | 50 | .478 | 3 | 4 |

이 표는 주 에이전트의 실제 `checks/nb-variety-kimi-r2.json`을 현재 6 SHA 및 도구 4 SHA와 직접 대조한 결과다. 같은 입력의 전수 CLI를 내가 다시 실행했다고 쓰지 않는다. 현재 네 도구 SHA는 해당 실행과 같았다. 실제 추출에서 `12. juli`, `9. februar`, `25.–26. oktober`, `nr. 2`, `nr. 4`, `nr. 5`, 중국어 사건번호, 금액, 85-1 및 문단 종결이 정상 연결되는지 읽었다. 본문 269개를 읽었으며 FAQ·표는 별도다.

루트 구조 검사도 현재 6 SHA와 일치하며 selected 6 / errors 0 / semanticStatus REVIEW_REQUIRED다. 날짜·언어·topic·원이미지·캡션·FAQ17·편별 공식 URL 4/3/4/4/4/4와 장식용 굵은 강조 부재를 직접 확인했다. 공식 URL의 보존을 확인했을 뿐 이번 검사에서 23개 URL을 모두 새로 네트워크 검증하지는 않았다.

## 필수 M01 — 915 취소소송 제기 주체 반전

문제 문장, 본문 첫 문장:

> En voldgiftsavgjørelse på NT$44 417 150 ble opphevet etter søksmål fra en entreprenør som hadde en sykehuskontrakt i Taiwan.

요약도 `En entreprenør fikk opphevet en voldgiftsdom ...`이라고 시작하여 시공사가 취소를 얻어냈다는 독해를 강화한다.

이유: 해당 판정은 시공사에게 유리한 중재판정이다. 공공 발주기관이 취소소송을 제기했고, 판정 취소가 선고되자 시공사가 상고했다. 보존 공식 설명 L11–24, 특히 L22의 절차 순서와 L24의 시공사 상고 결과를 확인했다. 현재 첫 문장은 취소소송 제기 주체를 시공사로 명시하여 당사자 관계를 바꾼다. [대만 최고법원 공식 설명](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=274693)

수정안 — 숫자 중심 도입을 유지한다:

> NT$44 417 150 var beløpet en entreprenør ble tilkjent ved voldgift om en sykehuskontrakt i Taiwan. Den offentlige oppdragsgiveren gikk til sak og fikk voldgiftsavgjørelsen opphevet.

요약의 첫 문장 수정안:

> Den offentlige oppdragsgiveren fikk opphevet en voldgiftsavgjørelse i entreprenørens favør etter at kravet om mer tid igjen var blitt et pengekrav.

의미 보존: 금액은 법원의 최종 지급액이 아닌 취소된 중재판정액이다. 병원 공사, 공기 연장에서 금전 청구로 돌아간 순서, 취소 결과와 상고 주체를 보존한다. 새 개인 이름이나 새 법률 요건을 추가하지 않는다. 뒤의 법정 중재 경로 조건은 유지한다.

## 필수 M02 — 판결 결과와 환송을 구별하는 Bokmål

`fikk ikke fremme`는 이 문맥의 자연스러운 결과 표현이 아니며 `fikk ikke fremmet`/`nektet fremmet`처럼 심리를 허용하지 않았다는 절차를 연상시킨다. `avviste en anke`도 법률 글에서 절차상 배척으로 읽힐 수 있다. 실제 원문이 본안 판단 후 원심 결과를 유지하거나 일부를 환송했다고 설명하는 곳에는 중립적인 `førte ikke frem`, `forkastet` 또는 `sendte tilbake til ny behandling`을 쓰는 편이 정확하다. 노르웨이 공식 안내도 심리 허용·거절과 `Anken forkastes`를 구별한다. 아래 수정은 대만 절차를 노르웨이 절차로 치환하려는 것이 아니라 원문에 없는 각하 사유를 덧붙이지 않기 위한 것이다. [Domstoladministrasjonen 안내, §3.2](https://www.domstol.no/contentassets/d49a76b05ff34821be40b572d2671aee/02-veileder-lagmannsrett.pdf), [Frostating 안내, §2.2.9](https://www.domstol.no/globalassets/domstolene/lagmannsrett/frostating/for-aktorer/veileder-for-advokater-i-frostating---sivile-ankesaker.pdf)

### M02a — 기각·불인용 표현

| 위치 | 실제 문제 표현 | 최소 수정안 | 보존할 범위 |
|---|---|---|---|
| 915 본문 2문단 | `Den 12. juli 2017 avviste Høyesterett entreprenørens anke.` | `Den 12. juli 2017 forkastet Høyesterett entreprenørens anke.` | 시공사의 상고가 성공하지 않았고 취소 결론이 유지됨. 확정은 뒤 문장에 그대로. |
| 916 본문·FAQ2 | `Ankene som gjaldt 262 klagere fikk ikke fremme.` | `Ankene som gjaldt 262 klagere, førte ikke frem.` | 262명에 관한 상고이지 그들만 제기한 모든 청구의 기각이 아님. |
| 918 본문 2문단 | `Domstolen avviste utbyggerens anke og det tilleggskravet som ble fremsatt under anken, som ubegrunnede.` | `Domstolen forkastet utbyggerens anke og tok ikke tilleggskravet fremsatt under anken til følge, ettersom begge var ubegrunnede.` | 항소 AND 추가 청구의 본안상 이유 없음, 지연이자·상소불가 유지. |
| 918 지급 문단 | `Påstanden om betalingsmislighold fikk derfor ikke fremme.` | `Påstanden om betalingsmislighold førte derfor ikke frem.` | 매수인이 약정대로 납입했다는 바로 앞 이유를 유지. |
| 920 본문 2문단 | `Taiwan High Court, Kaohsiung-avdelingen, avviste den 22. juni 2022 beboerens anke i saken 111年度上字第132號.` | `Taiwan High Court, Kaohsiung-avdelingen, forkastet den 22. juni 2022 beboerens anke i saken 111年度上字第132號.` | 철거·복구 판단 유지, 후속 확정 미확인 유지. |
| 921 본문 2문단 | `Spillerens anke ble avvist, og dommen oppga at videre anke ikke var tillatt.` | `Spillerens anke førte ikke frem, og dommen oppga at videre anke ikke var tillatt.` | 플레이어 항소 결과와 명시적 상소불가를 둘 다 유지. |
| 921 환급 판단 | `Kravet om kontant refusjon fikk ikke fremme.` | `Kravet om kontant refusjon førte ikke frem.` | 이 금화 환급 청구의 불인용. 모든 게임 환급의 금지가 아님. |

916 FAQ2는 아래 M02b의 완전한 수정안으로 한 번에 고치면 된다. 일반어로 “거절하다”라는 뜻인 915 기관의 조정 거절, 921 FAQ1의 명칭만으로 환급을 배제하는지 묻는 `avvises` 등은 이 지적에 포함하지 않는다.

### M02b — 916 환송 표현

`tilbakevise`의 Bokmål 의미는 주장 등을 배척·논박하는 쪽이므로, 이를 환송 동사로 쓰면 결과가 흐려진다. 뒤의 `til ny behandling`이 일부 맥락을 보완하지만 FAQ에는 그 보완도 없다. 환송을 직접 서술한다. [Bokmålsordboka의 tilbakevise](https://ordbokene.no/bm/tilbakevise) 항목 검색 결과에서 뜻을 확인했으며, 해당 항목의 별도 open은 cache miss였다.

- 실제: `For 246 klagere opphevet Høyesterett de relevante delene og tilbakeviste dem til ny behandling.`
  수정안: `For 246 klagere opphevet Høyesterett de relevante delene av avgjørelsen og sendte dem tilbake til ny behandling.`
- 실제: `Tilbakevisningen omfattet blant annet mangler i vurderingen av skade, bevis og adgangen til å fremme krav.`
  수정안: `Ny behandling var nødvendig blant annet på grunn av mangler i vurderingen av skade, bevis og adgangen til å fremme krav.`
- 실제: `Tilbakevisningen avgjorde ikke at alle berørte manglet krav.`
  수정안: `At disse delene ble sendt tilbake til ny behandling, innebar ikke at alle berørte manglet krav.`
- FAQ2 수정안 전체:

> Nei. Domstolen opphevet de delene av avgjørelsen som gjaldt 246 klagere, og sendte dem tilbake til ny behandling. Ankene som gjaldt 262 klagere, førte ikke frem. Ulike deler av saken fikk dermed ulike utfall; avgjørelsen avsluttet ikke hele den tilknyttede tvisten.

의미 보존: 246명 관련 부분 파기환송과 262명 관련 상고 기각의 분리를 유지한다. 어느 집단의 원청구가 모두 소멸했다거나 소송 전부가 끝났다고 쓰지 않는다. 보존 공식 설명 L25는 양측의 상고를, L32·38은 246/262를 구별한다. [대만 최고법원 공식 설명](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=359523)

## 필수 M03 — 915 미국 자료의 사업 대상 범위

실제 소제목:

> Planlagte amerikanske prosjekter gjør dokumentrekken aktuell

이유: 여기서 예정된 것은 대만의 전력·계통 조달이며 미국 공급업체가 자료의 대상이다. “계획된 미국 프로젝트”는 사업의 위치·귀속을 바꿔 읽히게 한다. 바로 다음 본문은 대만 조달/미국 공급자를 정확히 구별하므로 소제목만 정렬하면 된다. [ITA Taiwan Energy Industry](https://www.trade.gov/market-intelligence/taiwan-energy-industry), 동결 정본 915-M1.

수정안:

> Planlagte taiwanske anskaffelser og amerikanske leverandører

의미 보존: 예정·전망이라는 강도, 대만 시장, 미국 공급업체 맥락을 유지한다. 노르웨이 업체 자격이나 현재 입찰 개시를 추가하지 않는다.

## 선택 개선 — 필수 의미 오류와 구별

### S01 — 명백한 Bokmål 표기·어형 정리

| 실제 표현 | 수정안 | 이유·보존 |
|---|---|---|
| 916 `Rekkefølgjen er relevant ...` | `Rekkefølgen er relevant ...` | 표준 Bokmål 어형. S04를 채택하면 문장 전체가 재구성되어 별도 치환 불필요. |
| 919 `Denne rekkefølgjen ...` | `Denne rekkefølgen ...` | 순서라는 의미 그대로. |
| 921 요약 `Mynterne fungerte ...` | `Myntene fungerte ...` | 정복수 어형. 금화 기능·환급 범위 불변. |
| 920 `... på parkeringsdekke.` | `... på parkeringsdekket.` | 이 주차장 바닥을 가리키는 문맥을 자연스럽게 함. 공용 부분 범위 불변. |

앞의 세 표기는 단순 취향 제안보다 명확한 교정이지만, 별도의 법률 사실 오류 수에는 합치지 않았다. `framstilles`처럼 허용되는 Bokmål 변이형을 임의로 통일하지 않는다. [Bokmålsordboka rekkefølge](https://ordbokene.no/bm/rekkef%C3%B8lge), [Bokmålsordboka mynt](https://ordbokene.no/bm/39715)

### S02 — 921 남은 금화의 기능을 더 직접적으로

실제 본문은 `Fordi de gjenværende myntene ble brukt som sjetonger i selve spillrundene ...`, FAQ1도 `I denne saken ble myntene brukt som sjetonger i spillene ...`라고 쓴다.

앞 문단의 `gjenværende`와 `fortsatt fungerte` 때문에 금화가 모두 소비됐다고 확정한 문장으로 판정하지 않았다. 다만 `ble brukt`는 과거 사용 행위로도 읽혀, 법원이 분류한 금화의 기능을 직접 표현하는 편이 선명하다.

- 본문: `Fordi de gjenværende myntene hadde funksjon som sjetonger i selve spillrundene, fant domstolen at de ikke lenger var ubrukte betalte poeng som kunne refunderes etter kontrakten, og heller ikke spillavgifter som operatøren hadde mottatt.`
- FAQ1 해당 절: `I denne saken hadde myntene funksjon som sjetonger i spillene, og domstolen fant at de ikke var ubrukte betalte poeng eller refunderbare spillavgifter.`

의미 보존: 남아 있는 금화, 미사용 유료 포인트 부재, 경쟁 칩이라는 기능, 해당 계약의 환급 대상 분리를 유지한다. 전량 소진이나 모든 가상재화 환급 금지를 새로 주장하지 않는다.

### S03 — 검수 문구가 비치는 표현 축소

- 916 실제: `Avgjørelsen om anker som gjaldt 262 klagere, betyr heller ikke at alle kravene deres eller hele den bredere tvisten var avgjort, og teksten sier ikke at alle anker var fremsatt bare av disse klagerne.`
  제안: `Avgjørelsen om anker som gjaldt 262 klagere, betyr heller ikke at alle kravene deres eller hele den bredere tvisten var avgjort.`
  이유: “이 글은 그렇게 말하지 않는다”는 마지막 절이 검수용 해명처럼 들린다. `anker som gjaldt`가 관련 집단이라는 범위를 이미 보존하므로 삭제해도 그들이 상고 주체 전부라고 바뀌지 않는다. 주체를 직접 설명하는 방식을 원한다면 공식 설명의 양측 상고임을 명시할 수 있지만, 정확한 EN 요약에 그 추가 세부를 의무화하지 않는다.
- 920 실제: `Domstolen slo nøytralt fast at denne saken ikke falt inn under den bestemmelsen.`
  제안: `Domstolen slo fast at denne saken ikke falt inn under den bestemmelsen.`
  이유: `nøytralt`는 작성 지침이 문장에 들어온 인상을 준다. 어느 당사자가 그 조항을 주장했다고 새로 귀속하지 않으면서 삭제 가능하다.

### S04 — MONOTONY: 916 문서 검토 문단의 비슷한 길이

실제 다섯 문장은 8·9·11·10·13단어다:

> Rekkefølgjen er relevant for juridisk arbeid med oppkjøp. Rapportens mottakerliste kan vise hvem som kjente til problemet. Styrepapirer og operasjonelle instrukser kan vise hvem som kunne bestemme tiltakene. Senere godkjenninger av overføringer må kanskje leses sammen med begge. Når dokumentene holdes i adskilte arbeidsspor, blir konsernets egne beslutninger vanskeligere å rekonstruere.

MONOTONY: 비슷한 길이·같은 문장 틀 — `Rapportens mottakerliste kan vise ... Styrepapirer og operasjonelle instrukser kan vise ...` — 수신자/인지와 지시/권한을 한 설명문에 연결하고 후속 자산이전 승인은 별도 문장으로 둔다.

선택 수정안:

> Rapportens mottakerliste kan vise hvem som kjente til problemet, mens styrepapirer og operasjonelle instrukser kan vise hvem som kunne bestemme tiltakene. Senere godkjenninger av overføringer kan måtte ses i sammenheng med begge dokumenttypene. Når dokumentene holdes i adskilte arbeidsspor, blir konsernets egne beslutninger vanskeligere å rekonstruere.

의미 보존: 문서별로 확인할 인지·결정권·후속 승인을 유지하고, 기록이 분리될 때의 재구성 문제도 남긴다. 새로운 보관 의무를 만들지 않는다. 이 문단은 개선 여지가 있지만, 전체 .519 CV·.119 유사길이 3연속 비율과 다른 문단의 리듬을 함께 보면 현재 916 전체가 단조로움만으로 필수 반려될 수준이라고 과장하지 않는다. 제안문은 교정 후 실제 측정해야 하며 아직 원고에 반영되지 않았다.

## 여섯 편 의미 대조 결과

| 글 | 실제 확인한 조건과 범위 | 미해결/경계 |
|---|---|---|
| 915 | 돈→공기 연장→기관이 권고를 거절→권고/안 없는 구체 금전 청구라는 표 순서. construction OR technical services, recommendation OR proposal, 기관 부동의로 조정 실패 조건. 별도 중재합의 가능. 40(1)(2)는 사건의 합의 부재만 정확히 요약. 법 버전 이유 정정과 결과 유지 분리. FAQ2개의 자동 중재/모든 변경 금지 부정. | 소송 주체 M01, 결과 용어 M02, US 소제목 M03. 금액의 최종 지급 주장 없음. |
| 916 | 소유만으로 책임이 아님. 인지·지배·고지/개선 미이행·회피 목적 자산이전. 현재154조의 남용→특정 채무·명백한 변제 곤란 AND 중대성/필요성. 현재154를2018년 유일 근거라고 쓰지 않음. USTR는 법 적용을 전제로 하는 미국 민간 파트너 투자금융 의향이고 자동 지원·전체 발효 주장 없음. | 246/262 숫자와 관련 집단 한정은 보존. 환송·상고 결과는 M02로 정리 필요. FAQ2도 같은 수정 필요. |
| 918 | Taichung 고등법원과2022-02-09. 2019-02-23 대출 진행 편지, 당시 물·전기 미연결,7월 하자/엘리베이터 설치 미완료,8월 청소·인테리어 출입,11월5일 대출/28일 보증서상 인도 분리.4개월 사건 계약 대 현재6개월 통지 창구·사용허가 수령 기산,14점 지급/서류 협조 유지.2025 점검과2026-09-18 CBC 현행본을2019에 소급하지 않음. | 본안 불인용 M02. 금액 새 보충 없음. 상소불가 명시. FAQ3 모두 정확한 범위. |
| 919 | 공무원 면직과 복심결정 취소, 대외 발표/기관 순서/청취·보고서 모순/후속 답변으로 치유되지 않음. 상소 가능과 후속 확정·실제 복직 미확인.2026-07-01 민간 직안법 신제와 과거 공무원 사건 구별.22-2 객관·공정·공평, 진술·답변/회피, 신고 인지 후 보호·조사, 신고인 희망 시 조율 may·불성립이면 조사 속행 must 유지. | `같은 징계사건의 두 중한 지적`은 별개의 두 징계처분이라는 명제가 아님. 필요하면 한 번의 결정이라고 더 명확히 할 수 있으나 추가 세부를 필수화하지 않음. FAQ2의 보호 의무는 본문의 조치·필요성 한정과 함께 읽었으며 무재발 결과 보장으로 판단하지 않음. |
| 920 | 법원/사건/일자. 벽·천장·공용 전력함과 본인 사용 계량기 연결. 소유권 판단으로 확장 안 함.11조 소유자회의와 사건 규약15의 위원회 허가 AND 전력회사 안전검사 분리.6(1)(5), 협의 후 불이행→6(3) 법원 경로.6(1)(4) 불적용은 중립 귀속. 차단·잠금·열쇠는 설령 사실이어도 의무를 없애지 않는 가정적 판단. | 결과 M02; 후속 확정 미확인 유지.2026 가오슝 공용 배선 지원은9월30일 마감 경과·사적 동의 대체 아님. FAQ3에도 유지. |
| 921 | Keelung2021-09-13, NT$243 548 청구액·불인용, 상소불가. 남은 칩 금화와 미사용 유료 포인트 부재. 자기 종료 의사와 사업자 전체 제재 적법성 구별.2023-01-01 현행본과2021 사건 분리.7일 시작 후 서면 해제 대 언제든 통지 종료. 미사용 포인트 OR 미사용 게임비용, 필요비용 공제, 종료 기산30일 반환 OR 양측 합의 처리. | 결과 M02, 금화 기능 S02. 최소30일 이력 보존 대 접수 후7일 제공, 사업자 자료만 유일 기준으로 제한 금지·모든 자료 무효 아님.2025 첫 신고 유형2위/건수 전년비 감소. FAQ3의 범위와 제목의 해당 사건 한정 보존. |

## §5 문체 점검과 실제 결말

1. 저장된 현재 정확 `--lang nb` 실제 실행은 여섯 편 FAIL 0이고 입력·도구 SHA 일치. 본문 단위 269개를 전부 읽었다. 프로필은 Bokmål이며 다른 언어로 위장 통과하지 않았다.
2. 도입은 915 한 금액,916 사실,918 사실,919 결과,920 독자 질문,921 오해 설명이다. 사실/결과형은3/6이며 가상 장면 도입이나 가공 인용은 없다. M01 제안도 금액을 먼저 놓아 이 분포를 유지한다.
3. 짧은 문장은 각각8·9·8·11·8·12개로 두 개 이상이다. 본문에서 32단어 이상인 문장이 같은 문단에 둘 들어간 곳은 없고 긴 문장 연속도 발견하지 않았다. 916의 중간 길이 반복은 S04에 실제 문장과 방향을 남겼다. 긴 918 설치 상태 문장은 설치 미완료와 추론의 연결을 유지하고 있다.
4. 문단 시작은 기존 추출의 최대 반복915 `en`2회, 나머지 각1회다. 실제 세로 읽기와 대조했다. 도구가 조사·일반어를 모두 문체 문제로 판별하지는 못한다.
5. 조문·공식 설명 인용은 문장 앞/중간/법률 주어 형태로 들어간다. 3문단 연속의 “주장→괄호조문→다만” 구조가 없고 문서·사건·결과 문단도 있다. 출처 링크를 줄여 점수를 맞출 필요가 없다.
6. 법적 범위를 보존하는 부정문을 기계적으로 모두 삭제하지 않았다. 소유만으로 책임이 생기지 않음, 상소기각과 모든 청구 소멸의 구별, 사후 안전조치와 설치 동의의 구별, 포인트의 기능과 명칭 구별은 필요한 한정이다. 검수 문구가 드러난 S03을 선택적으로 정리한다.
7. 구조적 출처 고지 바로 전 실질 결말을 확인했다. 915는 조정 신청·변경·답변 기록,916은 최초 조사와 결정·자산이전 승인,918은 대출·검사·인도 서류를 구별해 다투는 날짜 확인,919는 발표 전에 통지·진술·증거 판단이 모든 버전을 반영했는지 확인,920은 동의 불성립 시 설치계약 비용,921은 충전과 사용을 연결해 청구액 입증으로 끝난다. 동일 판촉 결말을 복사하지 않았다. 여섯 편의 출처 확인일 고지는 구조적 꼬리로 따로 읽었다.
8. 표준 Bokmål 대상으로 검수했고 한국어·일본어 전용 문말 규칙을 옮기지 않았다. 장식용 굵은 글씨, 가공 1인칭 경험, 명령형 체크리스트 제목은 없다. S01의 어형 교정은 필요하나 인간 원어민 감수라고 주장하지 않는다.
9. 원고를 수정하지 않았으므로 검수 중 조문·기간·금액·출처·가상 표시는 그대로다. 후속 교정자는 채택한 부분만 바꾸고 실제 diff·역복원·영향 편 검사·새 SHA를 남겨야 한다.

919 본문 질문0의 이유: 소제목 질문은 측정에 포함하지 않았다. 사건 처리 순서→청취 결함→민간 신제→현재 보호/조사→문서 비교라는 설명 흐름이 있고, 짧은 결과문과 긴 조건문이 교차한다. 단순 숫자 채우기용 질문을 새로 끼울 이유가 없다. 전체 질문 수는915/916/918/920/921 각1개이며, 919만0이라고 자동 반려하지 않았다.

17:05 자동 재생성된 LESSONS를 종료 guard가 탐지하여 첫 종료 검증은 중단했다. 초기 읽기 SHA와 실패 상태를 보존하고 새 전문을 읽었다. 새 SHA는 `86710ef330b108a916a7bb92a75f1ffa62dea53412e8a75f38472d9fa9b33130`이다. 현재 정확성·판결 범위·문체 교훈을 적용해 추가 NB 지적은 발견하지 않았고 M01–M03/S01–S04는 유지한다. [재읽기 기록](../checks/nb-independent-lessons-refresh.json)에 새 전문과 실제 한계를 남겼다. 그 뒤 B9 BRIEF에 같은17:05 갱신 공지가 추가된 것도 재독했고 기록했다. 공유 파일을 수정하지 않았다.

## 동결 SHA와 후속 범위

| ID | 현재 SHA256 |
|---|---|
| 915 | `4e56cf9fae3406026a2d92a9a6580255541324ddfc4697e81dba01b559e8c3be` |
| 916 | `7924cb9eb1f80d7289ef6d50b9b1b930f5a118586694963d181207465f1e0620` |
| 918 | `8ac7ad4fc347c61a6f3704a9fd3219c88b38250bfd07d8eb5b406a3e20c1887f` |
| 919 | `f3fe7f818a8bc84de97cd2fc27250748c72541b3055cfaecb65c3675fd2a0f81` |
| 920 | `973ba3ba4375b5b789d32f0ffd246e0d15aeb8482d8cf92eb3be3267579806a8` |
| 921 | `3ad11e81ca25562fed802add762e9e174e7c283563d473fe3167b8fee4851bf5` |

후속은 M01–M03 및 주 에이전트가 채택한 선택 사항만 교정한 뒤 표적 재검수할 수 있다. 이 R1과 Kimi 최초/R2 원본은 보존한다. 실제 교정 전에는 미해결 필수3묶음이 닫혔다고 표시하지 않는다.
