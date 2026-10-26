# SK 기존 014·877·878 보수본 독립 검수

2026-10-26 KST · 검수자: column_deploy · 범위: 동결된 8개 문장 편집의 의미·문체·경계·정역복원.

판정은 이 보수 범위의 PASS, 필수 수정 0건이다. 세 원고의 현행 공유 CLI를 직접 실행해 모두 exit 0 / FAIL 0을 확인했고, 수정의 AND/OR·주체·가능/의무·기산 관계가 원문과 같다. 기존 원고 전체를 신작 수준으로 재편한 문체 승인이나 새 법률 전수조사로 확대하지 않는다. R·보수 원고·저자 기록·공유 도구는 수정하지 않았다.

검토 입력은 [저자 보고서](sk-existing-repairs.md) SHA `f1f80d653241f28e716491186f9a4f1de66410efe13bab0bb5e53d32e2e57bc9`, [최종 manifest](../checks/sk-existing-final-manifest.json) SHA `2770975368fb890c00486fb86996bf92fb8001676e338ea1c6df63ca510504d7`다. R 구원문 세 편을 제목·메타데이터·FAQ 10개·목록·출처·마지막 문구까지 읽고, 정확한 8개 old/new와 보수본의 현재 전체 문장 배열을 대조했다. 프로젝트 문체, COLUMN-VOICE-RULE, SENTENCE-VARIETY와 19:05 LESSONS(SHA `56120b79d5f6a483f760f2a470dab7753ca7d14d1c727ce8e8bbd721da773f97`)의 이미 읽은 동일 버전을 적용했다. 홈 editorial-voice 파일은 부재하며 프로젝트 정본을 사용했다.

## 문장별 판단

1. 014 도입의 `Samotná skutočnosť, že existuje podpísaný text, však neurčuje platnosť dohody ani sumu na vrátenie.` → `Podpísaný text ešte neurčuje platnosť dohody. Rovnako neurčuje sumu na vrátenie.`를 확인했다. ‘서명된 문서가 존재한다’는 겹구조를 걷어내고 합의 유효성 및 반환액이라는 두 대상에 동일한 부정을 연결했다. `Rovnako`가 바로 앞 주어를 받아 읽히므로 의미 없는 독립 표어가 아니다. 서명 사실을 무효 사유로 바꾸거나 반환 의무를 새로 부과하지 않는다.

2. 014의 `Nie je nutné splniť oba predpoklady zároveň, avšak aj keď existuje jeden, dohoda nesmie prekročiť primeraný rozsah…` → `Oba predpoklady nemusia byť splnené súčasne. Aj pri splnení jedného však dohoda musí zostať primeraná všetkým okolnostiam…`를 확인했다. 앞 문장의 교육 제공 AND 비용 부담 OR 적정 보상은 그대로이며, 뒤의 `Aj pri splnení jedného`가 하나의 요건을 충족한 뒤에도 비례성 심사가 필요함을 연결한다. 교육기간·비용·인력 대체·보상액·범위는 빠지지 않았다. `nesmie prekročiť primeraný rozsah`와 `musí zostať primeraná`는 이 문맥에서 같은 제한이다. 문단 경계를 포함한 치환이므로 같은 원문이 있는 FAQ는 바뀌지 않았다.

3. 014의 `Okolnosť, že pracovník zmluvu podpísal, môže byť podkladom, ktorý potvrdzuje existenciu dohody, ale nenahrádza zákonné predpoklady.` → `Podpis môže preukazovať, že dohoda existuje. Zákonné predpoklady však nenahrádza.`를 확인했다. `môže`의 가능성과 법적 요건을 대체하지 않는다는 부정을 보존한다. 서명만으로 모든 사실이 확정된다는 뜻으로 강화하지 않는다.

4. 014의 `Článok 16 je ustanovenie o skončení zmluvy zamestnávateľom a na odchod pracovníka sa táto výpovedná doba uplatní prostredníctvom článku 15.` → `Článok 16 upravuje skončenie zo strany zamestnávateľa. Na výpoveď pracovníka sa príslušná lehota vzťahuje prostredníctvom článku 15.`를 확인했다. 제16조의 사용자 종료와 제15조를 통한 근로자 통지기간 적용을 분리한다. 바로 앞의 무기계약 전제, 다음 목록의 3개월/1년/3년과 10/20/30일은 동일하다. 다른 유기계약의 종료까지 같은 규칙으로 넓히지 않는다.

5. 877의 `Faktúra za zariadenie, potvrdenie dodania a protokol o uvedení do prevádzky môžu mať rôzne dátumy. Slovenský dodávateľ pri vymáhaní potrebuje zistiť, na ktorý z nich zmluva viaže zaplatenie.` → `Keď sa líšia dátumy na faktúre za zariadenie, potvrdení dodania a protokole o uvedení do prevádzky, slovenský dodávateľ potrebuje pri vymáhaní zistiť, na ktorý z nich zmluva viaže zaplatenie.`를 확인했다. 세 자료의 날짜 차이와 계약상 지급 조건 확인을 조건·행동으로 연결한다. 이 도입은 날짜가 다를 때의 실무 설명이며, 날짜가 같으면 지급 조건을 확인할 필요가 없다는 배타 조건을 추가하지 않았다. 바로 뒤의 인수 조건·시험 기록 조언과 본문의 각 지급분 기산 설명이 유지된다.

6. 877 지급명령 문단의 `…článku 508…). Veriteľ musí…` → `…článku 508…), pričom veriteľ musí…`를 확인했다. 일정 금전에 관해 신청할 수 있다는 `možno žiadať`, 채권자의 소명 의무 `musí…osvedčiť`, 필요한 경우의 반대급부 이행 설명 `ak sa vyžaduje`를 모두 보존한다. 508/511조 URL 순서 및 바로 다음 509조의 제외 조건이 같다. 20일의 송달 기산과 3개월의 발급 기산 문단·FAQ도 변경되지 않았다.

7. 878의 `Výnimka sa týka spoločníka… Spoločník musí tento dlh uhradiť, ak…` → `Výnimka zaväzuje spoločníka uhradiť konkrétny dlh, ktorý spoločnosti spôsobil zneužitím jej právnej subjektivity, ak má spoločnosť so splatením zjavné ťažkosti a zároveň sú okolnosti závažné a uloženie tejto povinnosti nevyhnutné.`를 확인했다. 해당 spoločník의 법인격 남용으로 회사에 특정 채무가 발생했다는 인과, 회사의 현저한 변제곤란, 중대한 사정 및 부과 필요성이 모두 연결된다. `a zároveň`가 누적 조건을 보존한다. 일반적인 지분 소유나 미변제만으로 책임을 넓히지 않는다.

8. 878의 `Invest Taiwan porovnáva… Plán miestneho predaja a plateného servisu preto vyžaduje inú úvahu…` → `Podľa Invest Taiwan môžu dcérska spoločnosť a pobočka obchodovať, kým zastupiteľská kancelária slúži na právne a kontaktné úkony; miestny predaj a platený servis preto treba plánovať odlišne…`를 확인했다. 자회사·지사의 영업 가능과 대표사무소의 법률·연락 활동, 현지 판매·유상 서비스와 고객 연결 계획의 차이를 유지한다. 별도 등록·업종 허가를 면제하지 않으며 뒤의 관련 문단이 그대로다. 링크 label은 `Invest Taiwan porovnáva`에서 `Invest Taiwan`으로 짧아졌지만 URL과 인용 주체는 동일하다. ‘모든 링크 글자까지 불변’이라고 과장하지 않는다.

## 정역복원과 보존

저자 edits-r1/r2/r3의 8개 치환을 원본 바이트에 순서대로 적용해 현재 사본 3/3을 재현했다. 각 단계의 before/after SHA와 단일 치환 개수도 직접 확인했다. 역순으로 되돌린 메모리 문자열은 원본 3/3과 정확히 같다. 파일을 실제로 되돌리지는 않았다.

Frontmatter 전체 및 그 안의 FAQ는 바이트 동일하고, 별도 gray-matter 파싱 deep equality도 3/3이다. FAQ 수는 4+3+3=10이다. 숫자 토큰·URL의 순서, Markdown 이미지, 제목·목록 줄도 같으며 이 검사는 저자의 boolean을 그대로 승인한 것이 아니라 독립 실행했다. 메타데이터를 새 발행일로 바꾸지 않았다. 014의 legacy published/author 부재, lastmod 2026-07-25, date_display 13. septembra 2025와 기존 이름 줄은 보존된 상태다. 그것을 새 저자의 신분 또는 공개 표시 승인으로 삼지 않는다.

| 파일 | R/초기 원문 SHA256 | 최종 사본 SHA256 | 치환 |
|---|---|---|---:|
| 014 | `fecbb503e2aee3b6202d7209bd1cf0560e5c1a72cc7df6a879858df11f449663` | `631c8e1ba003b6bc0268a09e76e67af95fea57384be4826484850c3399a68ef6` | 4 |
| 877 | `35625a51f5d40d08db8a5498c1754c84c41bb057397da6262faedeb8dbda9b31` | `60638adf443098093688db12bb8be6374d858783382548fb91afd5a0e963d911` | 2 |
| 878 | `f91f40cedcb38c6b094d630434c690d9ec84ba54fb03dfc74ba0d685bba532ba` | `f9998228d7d54128519262cc1884a86e8d62906e66db27189b515c9cba7d9da2` | 2 |

## 실제 검사와 §5

2026-10-26 20:09 KST에 Node24 PATH와 PYTHONDONTWRITEBYTECODE=1을 적용하고 세 편을 각각 현재 공유 CLI의 `--lang sk`로 검사했다. 원고 수치에 맞춰 임계값·단어 단위·profile을 바꾸지 않았다.

| 파일 | 유효 문장 | CV | 짧은 문장 비율 | 유사 길이 3연속 | 실제 CLI |
|---|---:|---:|---:|---:|---|
| 014 | 126 | .452 | .111 | .056 | exit 0 / FAIL 0 |
| 877 | 51 | .479 | .196 | .082 | exit 0 / FAIL 0 |
| 878 | 54 | .464 | .259 | .038 | exit 0 / FAIL 0 |

현재 전체 배열은 직접 생성하여 231개 유효 문장 전부를 읽었다. 014의 추가 추출 항목 `---`는 0단위이며 유효 문장·짧은 문장 수에 넣지 않았다. 014 p16/p25/p30의 `5. 6. 2026`은 각각 한 문장 안에 남고 단독 `6.` 조각이 없다. 877의 `ods. 1.`, 878의 `24. septembra 2011`도 정상 문장 안에 있다. FAQ와 목록은 이 prose 지표의 대상이 아니므로 위 수치가 FAQ·목록까지 자동 검수했다는 뜻은 아니다.

독립 추출 결과가 저자가 동결한 [014 r3-applied](../checks/sk-existing-variety-r3-applied.json) 및 [877/878 final](../checks/sk-existing-variety-final.json)의 전체 문단/문장/단위 배열과 정확히 같음을 배열 SHA로 확인했다. 이 기존 전체 배열을 수정하거나 복제해 새로운 원본처럼 표시하지 않는다. 독립 명령·stdout·exit 및 배열 SHA는 아래 영수증에 있다. 초기 날짜 오분할 수치를 최종 정상 경계 PASS로 재사용하지 않았으며, 저자의 초기 FAIL·가드 중단·installed-before FAIL 기록도 그대로 남아 있다.

- §5의 짧은 문장과 길이 혼합: 바뀐 짧은 문장은 서명의 증명 범위, 두 요건의 OR 관계, 사용자/근로자의 주체를 각각 설명한다. 수치를 위한 빈 문장이 아니다. 현재 같은 문단의 32단어 이상 장문 2연속은 0이다.
- §5의 도입·문단 시작: 014는 제도의 적용 대상, 877은 지급 문서 날짜의 조건, 878은 계획된 업무 질문으로 시작한다. 새 가상 상담 장면은 없다. 014의 `Pri` 4회/52문단은 현행 긴 글 상한 6 이내이며, 동일 시작 연속 최대 1이다. 877/878의 최다 시작 수는 2/1이다. 기존 014의 반복 설명·목록 구조 전체를 새롭게 없앴다는 주장은 하지 않는다.
- §5의 조문·대비: 수정 후에도 법률 요건의 AND/OR 및 예외가 살아 있다. 현재 말미 조문 인용 비율은 0/.078/.037, 대비 탐지 수는 1/0/0이다. 실제 문맥에서도 새 허수아비 반박이나 출처를 피하려는 삭제는 없다.
- §5의 질문·결말: 877은 각 지급분의 문서 증거, 878은 첫 주문의 판매자·수령인·서비스 주체에 연결된다. 014는 계약·교육·지급·근로·통지 날짜의 실무 문단 뒤에 기존 출처·고지·이름 줄이 남아 있다. prose 질문 수 0/2/4는 실제 구조 차이이며, 014의 FAQ 4개와 목록 질문 또는 878의 기존 질문을 숫자에 맞춰 가감하지 않았다.

MONOTONY: 014 겹종속절과 연속 장문 — `Okolnosť, že pracovník zmluvu podpísal, môže byť podkladom…`, `Nie je nutné splniť oba predpoklady zároveň, avšak…` — 서명의 범위와 법적 요건, OR 요건과 별도 비례성 심사를 분리한 현재 수정이 이유에 맞다. 의미 보존을 위해 긴 핵심 조건 문장은 남겼다.

MONOTONY: 877 동일 길이의 절차 나열 — `Faktúra… Slovenský dodávateľ…`, `Taiwanský platobný rozkaz… Veriteľ musí…` — 날짜와 지급 조건, 신청 대상과 소명 의무를 각각 연결한 현재 방향이 타당하다. 다음 509조 예외 및 짧은 시험 기록 설명은 유지됐다.

MONOTONY: 878 반복 주어와 병렬 비교 — `Výnimka sa týka spoločníka… Spoločník musí…`, `Invest Taiwan porovnáva… Plán…` — 누적 책임 요건을 한 흐름으로 묶고 영업 계획과 비교를 연결했다. 34단어 문장 하나와 다른 길이 문장이 섞이며 같은 문단의 장문 연속을 새로 만들지 않았다.

선택적인 전체 문체 개작은 요구하지 않는다. 이번 범위에서 남은 필수 수정은 없다. 기존 법률 명제의 최신성 전수 확인, 새로운 판결 조사, 사람 원어민·변호사 검수, 브라우저/SSR 및 공개 배포 검증은 이 보고서의 범위가 아니다. 신규 SK6이나 다른 언어 원고를 관성적으로 재실행하지 않았다.

## 독립 실행 영수증

아래 command는 각각 실제 exitCode와 결합되어 있다. SHA 확인과 정역복원은 메모리에서만 수행했다. 입력과 공유 도구는 종료 확인 시에도 동일했다. 보고서 종료 확인 시각은 2026-10-26T11:16:01.157939+00:00이며 원문·보수본·공유 도구·저자 참조 기록 28개 SHA가 그대로다. R HEAD 35cc5d32cb5a4394d674f1f767b5f32eedd5cee7 및 clean 상태도 확인했다.

```json
{
  "startedAtUTC": "2026-10-26T11:09:42.753178+00:00",
  "measuredAtUTC": "2026-10-26T11:09:43.098786+00:00",
  "bindingRecheckedAtUTC": "2026-10-26T11:12:32.173719+00:00",
  "RHead": "35cc5d32cb5a4394d674f1f767b5f32eedd5cee7",
  "RGitPorcelain": "",
  "authorManifestSHA256": "2770975368fb890c00486fb86996bf92fb8001676e338ea1c6df63ca510504d7",
  "toolHashes": {
    "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py": "c96c303b9af9be1a8a8965f9a503cf0617a4a36716109af3184cfff8464c81ec",
    "/Users/son7/tseng-lanes-shared/variety/variety_multilingual.py": "0b4af8c41031e6c33bc2c6518caa8875f1f2b097f44c454161100aee07ab3ab9",
    "/Users/son7/tseng-lanes-shared/variety/variety_expansion.py": "ae6cca9ef98daed82fd578e6cf0442124ecb6e43215837e1cdb0a89e4198a4e2",
    "/Users/son7/tseng-lanes-shared/variety/profiles/sk.json": "2ea68f2ea8e9a6876c35ea895d8469bcf2c9e6091bb9c64f5bf0270c015bd9af"
  },
  "toolHashesUnchangedAtEnd": true,
  "metadata": [
    {
      "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/014-taiwan-mandatory-employment-period.md",
      "metadataDeepEqual": true,
      "faqCount": 4,
      "author": null,
      "published": null,
      "lastmod": "2026-07-25",
      "dateDisplay": "13. septembra 2025"
    },
    {
      "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md",
      "metadataDeepEqual": true,
      "faqCount": 3,
      "author": "legal-ai-assistant",
      "published": "2026-10-24",
      "lastmod": "2026-10-24",
      "dateDisplay": "24. októbra 2026"
    },
    {
      "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/878-slovak-business-taiwan-subsidiary-branch-office.md",
      "metadataDeepEqual": true,
      "faqCount": 3,
      "author": "legal-ai-assistant",
      "published": "2026-10-24",
      "lastmod": "2026-10-24",
      "dateDisplay": "24. októbra 2026"
    }
  ],
  "totalFAQ": 10,
  "rows": [
    {
      "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/014-taiwan-mandatory-employment-period.md",
      "source": "/Users/son7/Projects/tseng-law-all-locales-20261025/src/content/columns-sk/014-taiwan-mandatory-employment-period.md",
      "sourceSHA256": "fecbb503e2aee3b6202d7209bd1cf0560e5c1a72cc7df6a879858df11f449663",
      "targetSHA256": "631c8e1ba003b6bc0268a09e76e67af95fea57384be4826484850c3399a68ef6",
      "editCount": 4,
      "forwardExact": true,
      "reverseExact": true,
      "preservation": {
        "frontmatterAndFAQBytes": true,
        "numericTokensInOrder": true,
        "urlSequence": true,
        "headingsAndListLines": true,
        "imageMarkdown": true
      },
      "command": [
        "python3",
        "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py",
        "check",
        "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/014-taiwan-mandatory-employment-period.md",
        "--lang",
        "sk"
      ],
      "exitCode": 0,
      "stdout": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/014-taiwan-mandatory-employment-period.md [sk] sentences=126 mean=21.4 cv=0.452 short=0.111 run3=0.056 opener_rep=0.288 cite_end=0.0 cite_para=0.135 contrast=1 caveat=0 q=0\n  OK — no variety limit violated\n",
      "stderr": "",
      "metrics": {
        "lang": "sk",
        "sentences": 126,
        "paras": 52,
        "heads": 13,
        "list_items": 34,
        "mean_len": 21.4,
        "len_cv": 0.452,
        "short_share": 0.111,
        "long_share": 0.151,
        "para_cv": 0.339,
        "even_run3": 0.056,
        "top_end": "skončenia",
        "top_end_share": 0.039,
        "ja_desu": 0,
        "ja_da": 0,
        "top_opener": "pri",
        "top_opener_n": 4,
        "opener_rep": 0.288,
        "consec_same_start": 1,
        "cite_para_share": 0.135,
        "cite_end_share": 0,
        "contrast": 1,
        "caveat": 0,
        "questions": 0,
        "num_per100": 1.45,
        "hypo_open": false,
        "q_open": false,
        "formula_close": false,
        "first": "Dohoda o minimálnej dobe trvania pracovného pomeru (最低服務年限約定) v pracovnej zmluve (勞動契約) na",
        "last": "Advokátka Wei Tseng (曾雋崴)",
        "length_unit": "orthographic_words",
        "short_threshold": 8,
        "long_threshold": 32,
        "sentence_boundary_method": "unicode_punctuation_with_locale_abbreviations"
      },
      "consecutiveLongParagraphs": [],
      "sentenceArraySHA256": "9e047961832a6e2f8823f4154a00916c69b7bf067226ffe9bef85b3be5572fd2",
      "authorArrayEvidence": {
        "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/014-taiwan-mandatory-employment-period.md",
        "authorEvidence": "/Users/son7/tseng-all-language-columns-20261025/batch09/checks/sk-existing-variety-r3-applied.json",
        "evidenceSHA256": "f08ebfed1d7f19c5dd4071453ca510ef1344ff6f286749f9e7f33549e82d3a0c",
        "sourceSHA256": "631c8e1ba003b6bc0268a09e76e67af95fea57384be4826484850c3399a68ef6",
        "arraySHA256": "9e047961832a6e2f8823f4154a00916c69b7bf067226ffe9bef85b3be5572fd2",
        "positiveStrings": 126,
        "allStrings": 127
      }
    },
    {
      "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md",
      "source": "/Users/son7/Projects/tseng-law-all-locales-20261025/src/content/columns-sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md",
      "sourceSHA256": "35625a51f5d40d08db8a5498c1754c84c41bb057397da6262faedeb8dbda9b31",
      "targetSHA256": "60638adf443098093688db12bb8be6374d858783382548fb91afd5a0e963d911",
      "editCount": 2,
      "forwardExact": true,
      "reverseExact": true,
      "preservation": {
        "frontmatterAndFAQBytes": true,
        "numericTokensInOrder": true,
        "urlSequence": true,
        "headingsAndListLines": true,
        "imageMarkdown": true
      },
      "command": [
        "python3",
        "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py",
        "check",
        "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md",
        "--lang",
        "sk"
      ],
      "exitCode": 0,
      "stdout": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md [sk] sentences=51 mean=13.8 cv=0.479 short=0.196 run3=0.082 opener_rep=0.062 cite_end=0.078 cite_para=0.562 contrast=0 caveat=0 q=2\n  OK — no variety limit violated\n",
      "stderr": "",
      "metrics": {
        "lang": "sk",
        "sentences": 51,
        "paras": 16,
        "heads": 4,
        "list_items": 0,
        "mean_len": 13.8,
        "len_cv": 0.479,
        "short_share": 0.196,
        "long_share": 0.02,
        "para_cv": 0.315,
        "even_run3": 0.082,
        "top_end": "lehotu",
        "top_end_share": 0.039,
        "ja_desu": 0,
        "ja_da": 0,
        "top_opener": "ak",
        "top_opener_n": 2,
        "opener_rep": 0.062,
        "consec_same_start": 0,
        "cite_para_share": 0.562,
        "cite_end_share": 0.078,
        "contrast": 0,
        "caveat": 0,
        "questions": 2,
        "num_per100": 2.99,
        "hypo_open": false,
        "q_open": false,
        "formula_close": false,
        "first": "Keď sa líšia dátumy na faktúre za zariadenie, potvrdení dodania a protokole o uvedení do p",
        "last": "Ku každej požadovanej splátke si pripravte jedinú odpoveď: ktorý dokument dokazuje, že už mala byť zaplatená?",
        "length_unit": "orthographic_words",
        "short_threshold": 8,
        "long_threshold": 32,
        "sentence_boundary_method": "unicode_punctuation_with_locale_abbreviations"
      },
      "consecutiveLongParagraphs": [],
      "sentenceArraySHA256": "e41f5ae2ae1125f07ba295317ec51d249bd5aa279fd00bd1ae09f9c7905216ae",
      "authorArrayEvidence": {
        "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/877-slovak-exporter-taiwan-unpaid-invoice-recovery.md",
        "authorEvidence": "/Users/son7/tseng-all-language-columns-20261025/batch09/checks/sk-existing-variety-final.json",
        "evidenceSHA256": "13a007b1213f79524ff53148de8f3e3ddfd91f981cec11e570e3e585081cc204",
        "sourceSHA256": "60638adf443098093688db12bb8be6374d858783382548fb91afd5a0e963d911",
        "arraySHA256": "e41f5ae2ae1125f07ba295317ec51d249bd5aa279fd00bd1ae09f9c7905216ae",
        "positiveStrings": 51,
        "allStrings": 51
      }
    },
    {
      "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/878-slovak-business-taiwan-subsidiary-branch-office.md",
      "source": "/Users/son7/Projects/tseng-law-all-locales-20261025/src/content/columns-sk/878-slovak-business-taiwan-subsidiary-branch-office.md",
      "sourceSHA256": "f91f40cedcb38c6b094d630434c690d9ec84ba54fb03dfc74ba0d685bba532ba",
      "targetSHA256": "f9998228d7d54128519262cc1884a86e8d62906e66db27189b515c9cba7d9da2",
      "editCount": 2,
      "forwardExact": true,
      "reverseExact": true,
      "preservation": {
        "frontmatterAndFAQBytes": true,
        "numericTokensInOrder": true,
        "urlSequence": true,
        "headingsAndListLines": true,
        "imageMarkdown": true
      },
      "command": [
        "python3",
        "/Users/son7/tseng-lanes-shared/variety/variety_metrics.py",
        "check",
        "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/878-slovak-business-taiwan-subsidiary-branch-office.md",
        "--lang",
        "sk"
      ],
      "exitCode": 0,
      "stdout": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/878-slovak-business-taiwan-subsidiary-branch-office.md [sk] sentences=54 mean=12.8 cv=0.464 short=0.259 run3=0.038 opener_rep=0.0 cite_end=0.037 cite_para=0.5 contrast=0 caveat=0 q=4\n  OK — no variety limit violated\n",
      "stderr": "",
      "metrics": {
        "lang": "sk",
        "sentences": 54,
        "paras": 16,
        "heads": 3,
        "list_items": 0,
        "mean_len": 12.8,
        "len_cv": 0.464,
        "short_share": 0.259,
        "long_share": 0.019,
        "para_cv": 0.249,
        "even_run3": 0.038,
        "top_end": "servis",
        "top_end_share": 0.056,
        "ja_desu": 0,
        "ja_da": 0,
        "top_opener": "má",
        "top_opener_n": 1,
        "opener_rep": 0,
        "consec_same_start": 1,
        "cite_para_share": 0.5,
        "cite_end_share": 0.037,
        "contrast": 0,
        "caveat": 0,
        "questions": 4,
        "num_per100": 2.16,
        "hypo_open": false,
        "q_open": true,
        "formula_close": false,
        "first": "Má pracovník na Taiwane iba dohadovať skúšky zariadenia, alebo aj predávať náhradné diely ",
        "last": "Na pracovnom návrhu prvej taiwanskej objednávky označte, kto má byť predávajúcim, kto prijme platbu a kto zabezpečí serv",
        "length_unit": "orthographic_words",
        "short_threshold": 8,
        "long_threshold": 32,
        "sentence_boundary_method": "unicode_punctuation_with_locale_abbreviations"
      },
      "consecutiveLongParagraphs": [],
      "sentenceArraySHA256": "a20832b050a01695c759adff7c660eff052285c56510f24c0402b37badc84783",
      "authorArrayEvidence": {
        "file": "/Users/son7/tseng-all-language-columns-20261025/batch09/existing-repairs/src/content/columns-sk/878-slovak-business-taiwan-subsidiary-branch-office.md",
        "authorEvidence": "/Users/son7/tseng-all-language-columns-20261025/batch09/checks/sk-existing-variety-final.json",
        "evidenceSHA256": "13a007b1213f79524ff53148de8f3e3ddfd91f981cec11e570e3e585081cc204",
        "sourceSHA256": "f9998228d7d54128519262cc1884a86e8d62906e66db27189b515c9cba7d9da2",
        "arraySHA256": "a20832b050a01695c759adff7c660eff052285c56510f24c0402b37badc84783",
        "positiveStrings": 54,
        "allStrings": 54
      }
    }
  ]
}
```

