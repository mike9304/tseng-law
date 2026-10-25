# Filipino 704–706 작성자 자체 검수

작성·검수일: 2026-10-25 KST. 담당: `column_live_audit`의 후속 Filipino 집필 과제. 이 문서는 작성자의 자체 검수이며 독립 원어민·인간 변호사 검토나 게시 승인을 뜻하지 않는다.

## 산출물과 범위

다음 세 편을 Tagalog 기반 Filipino 전문 칼럼으로 작성했다. 독자의 언어를 필리핀 국적으로 간주하지 않았으며, 적용 법률은 모두 대만 법률이다. Cebuano 문장이나 필리핀법으로의 치환은 없다.

| 파일 | 본문 단어 수 | 최종 SHA-256 |
|---|---:|---|
| `src/content/columns-fil/704-taiwan-arc-first-application.md` | 1,205 | `6aced8364c167eb06beca783345171616aa5d9f9d8b4a11d612321628ebe51b7` |
| `src/content/columns-fil/705-taiwan-visa-residence-work-study-family.md` | 1,318 | `b3d5a3132b260ef14653bab7ea8e40ce303817b76365d22d29c2df62fc93e70e` |
| `src/content/columns-fil/706-taiwan-arc-renewal-changes-reentry.md` | 1,660 | `8efd98ba2187a676ad7965d9b5d9281897522599b54f4795ba29fa621426ffae` |

단어 수는 frontmatter와 마지막 출처 목록을 제외하고, 본문 표·제목·확인일 문단을 포함해 링크 URL을 제거한 뒤 `\b\w+\b`로 계산한 참고값이다. 706은 변경 사유별 기산점, 졸업생 예외와 여행 서류를 축약해서 오해시키지 않도록 더 길게 작성했다. 세 편 모두 `audience: ["fil"]`, `published`·`lastmod: "2026-10-25"`, `topic: "visa"`, FAQ 3개를 갖춘다.

위 표는 독립검수 반영 후 현재 파일이다. 아래의 최초 작성·검사 기록은 당시 증거로 보존했으며, 후속 수정과 최종 공유 검사 결과는 문서 마지막의 「독립검수 R1–R4 반영」에 추가했다.

영문 법률·공식 제도명과 약어는 식별에 필요한 곳에만 남겼다. 그 밖에는 `paninirahan`, `pahintulot`, `pagpapalawig`, `muling pagpasok`, `tagapag-empleyo` 등 Filipino 표현을 사용했다. 웹 계정을 뜻하는 `account`는 금융상의 계산으로 오해될 수 있는 `kuwenta`를 대신한다. 공개 작성자·검수자·AI 표시는 없고 내부 `author: "legal-ai-assistant"`만 유지했다. 이미지 경로와 가상 장면의 의미를 보존했다.

쓰기 범위는 위 세 파일과 이 보고서뿐이다. 다른 작업자의 변경을 되돌리거나 공유 검사기를 수정하지 않았다. 커밋·push·배포·계정 쓰기·외부 메시지 전송은 하지 않았다.

## 읽은 기준과 번역 기준본

- 새 작업 트리의 `AGENTS.md`, `docs/audit/all-locales-parity-20261025/BRIEF.md`, `docs/audit/arc-visas-20261024/BRIEF.md`.
- `docs/columns/EDITORIAL-VOICE.md`, `docs/columns/FRONTMATTER.md`.
- `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `/Users/son7/tseng-lanes-shared/LESSONS.md` 전문.
- `docs/audit/codex-column-recheck-20261024/research/source-refresh.md`, `docs/audit/codex-column-recheck-20261024/reviews/final-core.md` 전문.
- 현 작업 트리의 `src/content/columns{,-en,-zh}/704–706` 아홉 편 전문. `held/` 반려본이나 옛 작업 폴더 초안을 번역 정본으로 사용하지 않았다.
- 후속 공통 표 `docs/audit/all-locales-parity-20261025/research/arc-source-facts.md` 전문과 F01–F22.
- 기존 Filipino 최근 세 편 `801-filipino-caregiver-taiwan-patient-died-transfer-employer.md`, `802-filipino-factory-worker-taiwan-overtime-deductions-broker-fee.md`, `803-filipino-worker-taiwan-reported-missing-overstay-surrender.md` 전문.

홈 공통 문체 파일 `~/agent-library/knowledge/editorial-voice.md`가 이 환경에 없어 저장소의 정본을 사용했다. 옛 ARC BRIEF에 적힌 `/Users/son7/.codex/skills/tseng-law-editorial/references/review-criteria.md`도 지정 경로에 없었고 `.codex/skills`, `.agents/skills`, `agent-library`에서 파일명·패키지명을 검색해도 발견하지 못했다. 이를 읽었다거나 그 문서의 검수를 통과했다고 기록하지 않는다. 현행 BRIEF·정본 문체·문장 다양성·LESSONS·최종 검수·공통 출처표로 작업했다.

## 출처 확인 범위

2026-10-24 공식 출처 갱신표와 최종 검수에 기초해 번역했으며, 2026-10-25에 아래 공식 본문을 다시 열어 해당 규칙을 대조했다. 모든 출처를 10월 25일 전수 재확인했다고 표현하지 않았다.

- [인재법 현행 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295): 제8·9·12·14–17조의 기간, 가족 범위, 취업허가와 졸업 후 예외.
- [거류 규칙 현행 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129): 변경 사유의 30일/15일, 일반 갱신, 졸업생, 가족의 기간 등.
- [BOCA 최초 ARC FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html): 입국 다음 날과 국내 비자 발급일의 서로 다른 기산점.
- [NIA 0929 학생 온라인 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news): 심사·납부·수령의 각 기산점과 근무일, 전자형/IC형 구별.
- [NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news): 방문비자·무비자 직접 신청의 경로별 자료와 적용 조건.
- [NIA 해외 분실·재발급 안내](https://www.immigration.gov.tw/5385/7229/7232/368785/): 본인 계정·타인 계정·국내 대리의 인증 차이.
- [NIA 전문인재·가족 시범 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/): 심사 도중 출국 시 해당 신청 심사 중단. 이를 모든 ARC 신청의 출국 금지로 넓히지 않았다.
- [NIA 여권 유효기간 FAQ](https://www.immigration.gov.tw/5385/12162/12197/414977/): 유효한 ARC/APRC 소지자의 입국 당일 유효 여권, 입국 심사 조건.

이민법 제22조 개별 URL의 이번 직접 요청 한 번은 시간 초과였다. 그 URL은 삭제하지 않았고 기존 공식 갱신표와 10월 25일 공통 출처표의 확인 범위를 구분했다. 인재법 제16조 시행일은 기존 갱신표의 연혁 대조를 사용했으며, 이번에 시행명령까지 새로 열었다고 주장하지 않는다.

## 법률 의미 대조

| 범위 | 유지한 조건·강도·기산점 |
|---|---|
| 704 / F01–F03 | resident visa와 거류허가 입국의 30일은 입국 다음 날, 대만 내 비자 발급의 30일은 발급일부터. 통합 ARC 기능 증명 예외. 무비자 방문자 전체에 30일 전환 권리를 주지 않음. 전문인재 취업허가/면제와 NIA 승인을 별도 기술. |
| 704 / F06–F08 | ARC 사진 최근 2년, 재직·등록 뒤 재학 자료 최근 1개월, 해외 문서 인증과 필요한 중국어 번역. 대만 거주와 호적등록 국민의 배우자 첫 신청·동행·대만 혼인등록·최장 1년을 유지. EN의 고정 1년 표현 대신 거류 규칙12조 직접 링크를 추가. |
| 704 / F09–F12 | NT$1,000/승인 연도, 1년 미만도 1년분, 해당 방문·무비자 경로 NT$2,200 가산. 僑生 50%를 모든 국제학생으로 확대하지 않음. 보통 최장3년, 적격 특정전문인재 최장5년/허가 다음 날 및 법정 가족. 일반10근무일과 학생5근무일, 보완 후 재기산, 학생 승인 후5근무일 납부와 납부 후3근무일 IC수령, 전자형6개월 이하 구별. |
| 705 / F03–F05·F13 | 전문직과 제조·간병·어업 이주노동자 절차 구별. 시범 무비자·TAC·ABTC 등 NIA 제외와 다른 법의 예외. 정규유학과 Mandarin 입국 목적 구별. 어학4개월 이수+최소3개월 추가등록, 평일 주15시간, 휴가 포함 결석1/4 이하. |
| 705 / F04·F14 | 가족 초청자는 대만에서 전문 업무에 종사하는 외국전문인재 OR 특정전문인재이고, 둘 다 거류 OR 영주거류 승인 필요. 배우자·미성년자·장애로 자립불가한 성년자만 기술. 대만 호적 국민 배우자의 취업허가 면제와 특정·고급전문인재 배우자의 직접 취업허가 신청을 구별. |
| 705 / 기타 | Gold Card 통합 기능·1–3년, 창업가 별도 요건, 국적별 working holiday, digital nomad의 별도 조건과 대만 기업·고용주 서비스 제외. Filipino 독자에게 특정 여권 자격이나 통역·상담 제공을 약속하지 않음. |
| 706 / F15–F18 | 일반갱신 만료 전3개월. 주소·서비스처소는 다음 날부터30일. 제23-1조 사유변경은 발생일부터30일, 그 밖은 발생일부터15일 BOCA 후 NIA. 사업계속 창업가와 Gold Card4개월, 사업중단 별도3개월. 사유 소멸 후 예외는 조건별 NIA 허용 가능성으로 기술. |
| 706 / F19–F21 | 초과거류30일 미만 AND 원사유 계속 AND 처벌 후 재신청, 영주거류 계산1년 공제. 전문인재6개월+추가1회 총1년과 적격 졸업생1년+추가1회 총2년을 분리하고 모두 기존 만료 다음 날 기산. 대만 전문학사 이상 이미 취득+당해 졸업생+NIA 승인 연장 기간의 취업허가 면제를 한정. |
| 706 / F22·행정 | 여권 갱신 후 정보 갱신 필요와 개별 기한. 분실 선언 OR 경찰자료 등, 일반 재발급NT$500, 재발급≠연장. 출국 전 재입국허가, ARC 기간과 연동/말소, 유효 여권+APRC 예외. 접수증·사진은 여행서류 대체나 탑승·입국 보장 아님. |

각 FAQ 세 문항을 본문과 다시 대조했다. 영어 정본의 외부 `https` 출처 URL 집합과 비교해 세 편 모두 누락 0이었다. 기존 EN 내부 링크 중 Filipino 대상 파일이 없는 배우자·Gold Card·APRC 글은 존재하는 것처럼 만들지 않았다. 이 세 편 사이의 Filipino 링크만 사용하며 모두 실제 파일이 있다.

## 실제 수정 문장과 의미 보존

다음은 이번 초안에 실제 존재했던 문장을 고친 기록이다. 가상의 반려 문장을 만들어 넣지 않았다.

| 위치 | 수정 전 | 문제·이유 | 수정 후 | 의미 보존 |
|---|---|---|---|---|
| 704 도입 | `Sa National Immigration Agency (NIA) ihahain ang aplikasyon.` | MONOTONY: 첫 문장의 `Sa`와 연속 시작. 신청 기관을 주어로 바꿀 수 있음. | `National Immigration Agency (NIA) ang tatanggap ng aplikasyon.` | 신청 기관은 그대로 NIA이며 30일·입국 다음 날 조건은 앞 문장에 보존. |
| 704 접수 채널 | `May sariling proseso ang mga manggagawang migrante.` | 바로 앞 문장에서 이미 네 접수 경로를 열거해 같은 사실 반복. 짧은 문장 수를 위해 유지할 이유 없음. | 문장 삭제. 앞 문장의 네 경로와 뒤 문장의 취업허가상 범주 기준 유지. | 이주노동자 별도 절차는 동일 문단에 그대로 있음. |
| 704 보완자료 | `May halaga ang kopya ng bawat isinumiteng dokumento.` | 추상적인 가치 강조. 사본이 언제 필요한지 직접 연결하는 편이 명확. | `Maaaring humingi ang NIA ng karagdagang katibayan.` 다음에 사본으로 추가 요청·기제출 자료·통지 기한을 대조한다고 설명. | NIA 보완 요구 가능성과 제출자료 보존의 실무 의미 유지. |
| 704 첫 배우자 ARC | `Hanggang isang taon ang unang ARC sa kategoryang ito, ayon sa gabay ng NIA.` | 최장1년의 직접 법적 근거를 기관 안내와 구별할 필요. | `Hanggang isang taon ang unang ARC sa kategoryang ito sa Artikulo 12 ng mga regulasyon sa paninirahan.` | `Hanggang`로 최장 유지. 대만 거주+호적, 첫 신청 범위 유지. NIA 링크는 혼인등록·동행 문장에 유지. |
| 705 방문자 문단 | `May direktang aplikasyon sa NIA para sa ilang kuwalipikadong bisita.` | MONOTONY: 초안 문단5개가 `May`로 시작. 명사 나열보다 신청 주체의 행위를 직접 기술 가능. | `Direktang makapag-aaplay sa NIA ang ilang kuwalipikadong bisita.` | `ilang kuwalipikadong` 한정과 NIA 직접 신청 가능성 유지. |
| 705 비자 제한 | `... o may limitasyong nakatala sa visa.` | 어떤 제한 표시든 전환을 막는다고 읽힐 수 있음. 180일 No Extension 같은 개별 예외와 혼동 위험. | `... o ipinagbabawal ng nakatalang kondisyon sa visa ang pagpapalit sa paninirahan.` | 전환을 금지하는 제한으로 의미를 정확히 한정. 다른 적용 법에 따른 예외 문장도 유지. |
| 705 Mandarin | `... sa kinikilalang sentro ng wika na kaugnay ng pamantasan ...` | 단순히 대학과 관련이 있는 민간센터까지 연상할 수 있음. | `... sa kinikilalang sentro ng wika ng isang pamantasan ...` | 인정된 대학 부설/소속 센터 의미를 분명히 하고 FAQ도 맞춤. 4개월·최소3개월·출석조건 유지. |
| 706 초과거류 | `Hindi ito palugit. Hindi rin nito binabago ang orihinal na petsa ng pag-expire.` | MONOTONY: 연속 부정문. 둘째 문장의 날짜 존속을 직접 진술 가능. | `Hindi ito palugit. Mananatili ang orihinal na petsa ng pag-expire.` | 30일 미만·원사유 계속·처벌 후 조건 불변. 원래 만료일 유지 의미 보존. |
| 706 해외 분실 | `... sariling kuwenta sa sistema, ibang kuwenta ...` | `kuwenta`는 여기서 계산·금융 계정처럼 읽힐 수 있음. | `... sariling account sa sistema, account ng iba ...` | 실제 온라인 사용자 계정·대리 신청의 구별 보존. 필요 기술어만 사용. |
| 706 심사 중 출국 | `Halimbawa, maaaring isara ang kasong nasa pagsubok na sistema ...` | 실제 NIA 안내는 그 시스템의 심사 중 출국 시 심사하지 않는다고 명시. 단순 예시·재량처럼 흐리지 않음. | `Itinitigil ang nakabinbing aplikasyon sa pagsubok na sistema ... kapag umalis habang pinoproseso.` | 현재 확인한 시범 전문인재·가족 시스템에 한정. 모든 ARC의 출국 금지로 확대하지 않음. |
| 세 편 마지막 문단 | 출처 확인일·적용 범위 고지가 마지막 본문 문단이었음. | 각 글이 동일한 정형 고지로 끝나는 문제. | 고지를 마지막 실질 문단 앞으로 이동. | 고지 내용·날짜·별도 법체계 범위는 삭제하지 않고 각 글의 다음 신고·사유 변경·귀국 날짜로 끝냄. |

## 문장 다양성 검사: 공유 도구와 격리 도구 구분

요구된 공유 경로 명령을 실제 세 파일 모두에 실행했다.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <각 Filipino 파일>
```

마지막 실행 시 공유 스크립트는 아직 `columns-fil`을 지원하지 않아 세 편 모두 `[ko]`로 자동 분류했다. 세 편 각각 `FAIL short_share=0.0`, 종료코드1이었다. 이 결과를 Filipino 문장 검사의 성공으로 바꾸어 기록하지 않았고, 한국어 15자 제한에 맞추기 위해 번역을 훼손하지 않았다.

주 에이전트가 전달한 격리 검사기는 명시적 `--lang fil`로 실행했다.

```text
python3 docs/audit/all-locales-parity-20261025/tooling/variety/variety_metrics.py check <각 Filipino 파일> --lang fil
```

| 파일 | 문장 수 | 길이 CV | 짧은 문장 비율 | 유사 길이 3연속 | 문장 끝 괄호 인용 | 대비 틀 | 최종 결과 |
|---|---:|---:|---:|---:|---:|---:|---|
| 704 | 57 | 0.471 | 0.105 | 0.018 | 0.000 | 0 | FAIL 0, exit 0 |
| 705 | 67 | 0.525 | 0.134 | 0.046 | 0.000 | 0 | FAIL 0, exit 0 |
| 706 | 83 | 0.490 | 0.133 | 0.086 | 0.000 | 0 | FAIL 0, exit 0 |

이는 신설 Filipino 프로필의 기계적 결과다. 원어민의 자연스러움 판단이나 법률 동일성 검토를 대신하지 않으며, 공유 경로의 복구 완료를 뜻하지 않는다. 본 작업자는 검사기의 기준·기대값·공유 파일을 수정하지 않았다.

### 같은 날 후속 확인: 공유 경로 복구 뒤 재실행

주 에이전트가 백업·검증 후 지원판을 공유 경로에 설치했다고 전달한 뒤, 위와 동일한 실제 공유 경로 명령을 언어 강제 옵션 없이 세 파일에 다시 실행했다. 이번에는 세 편 모두 `[fil]`로 인식했고 `OK — no variety limit violated`, 종료코드0이었다. CV·짧은 문장 비율 등은 위 격리 프로필의 최종값과 일치한다. 앞의 `[ko]` 실패는 복구 전 실제 결과로 남겨 두며, 현재 공유 명령의 최종 결과는 세 편 모두 FAIL 0이다. 원고 SHA는 변경되지 않았다.

## 문장 다양성 규칙 §5 자체 점검

1. 공유 명령 실행: 위와 같이 실제 실행했으나 미지원 `[ko]` 오인식. 격리 `fil` 프로필은 최종 세 파일 모두 FAIL 0. 두 결과를 구별해 기록했다.
2. 도입: 704는 최초 신청의 기산일, 705는 입국 방식이 자격에 미치는 구체적 결과, 706은 기존 체류 근거가 먼저 끝난 경우의 실제 질문. 가상 사례 공식 도입 없음. 최근 Filipino 801의 고용법 조문 도입, 802의 급여명세서 숫자, 803의 무단결근 신고 기산 설명을 그대로 복제하지 않았다.
3. 짧은 문장: 모두 두 문장 이상. 예: 704 `Iba ang kalagayan ng pumasok bilang bisita.` / `NIA ang nagtatakda ng haba ng paninirahan.`; 705 `Hindi sapat ang bayad sa matrikula.` / `Kailangan pa rin ang pahintulot.`; 706 `Hindi ito palugit.` / `Hindi napahahaba ng pagpapalit ang paninirahan.` 긴 문장만 연속하도록 구성하지 않았다.
4. 문단 시작: 표·제목·목록·출처 목록을 제외해 세로 대조했다. 최종 세 편 모두 같은 첫 단어의 최대 빈도는2. 초안의 반복은 위 MONOTONY 기록대로 고쳤다.
5. 조문 괄호→단서 공식3연속 없음. 문장 속에 출처를 배치하고 서류 보관·유학 자료·업무 변경 등 인용 없는 설명 문단도 유지했다.
6. 대비 틀: 기계검사0. 법적 요건 부재·예외의 한계를 설명하는 부정문은 의미를 지우지 않았으며, 독자가 하지 않은 주장에 대한 수사적 반박으로 만들지 않았다.
7. 끝문단: 704는 카드 취득 후 새 신고 기한, 705는 새 체류 이유의 승인 필요, 706은 실제 귀국일을 덮는 서류로 종료. 고지·판촉으로 끝내지 않는다. 기존 세 편의 반복 연락처·상담 언어 문단을 복제하지 않았다.
8. Filipino 설명체 유지. 굵은 강조·꾸민1인칭·명령형 체크리스트 제목 없음. 연락처는 체류에 영향을 미치는 분쟁을 다루는706에만 한 번 두고 Filipino 상담 제공을 새로 약속하지 않았다.
9. 법률·기한·금액·출처·가상 장면 표시: 위 대조표와 FAQ/본문 및 URL 집합 검사로 확인. `최소/최장/미만`, `발생일/다음 날/승인일/납부일`, `일/근무일`, `AND/OR`, `의무/가능`을 분리해 검토했다.

## 구조 검증과 한계

Node v24.14.1과 프로젝트의 `gray-matter`로 세 파일을 실제 파싱했다. 필수 metadata, 날짜, audience, 내부 author, FAQ3, 원본 이미지 파일 존재, 장식용 강조 부재, 본문 공개 byline 부재, 본문 H1 부재, 줄끝 공백 부재, EN 출처 URL 누락0, 내부 링크 대상 누락0을 확인했다. 초기 Python 검사에서는 PyYAML이 없어 파싱하지 못했으며, 패키지를 설치하지 않고 프로젝트가 이미 사용하는 `gray-matter`로 확인했다.

작성자가 본문을 직접 검토했지만 외부 원어민이나 인간 변호사의 승인으로 기록하지 않는다. 전체 사이트 빌드·통합검수·live 게시 확인은 주 에이전트의 후속 범위이며 이 보고서가 실배포 수량을 증명하지 않는다.

## 독립검수 R1–R4 반영 — 2026-10-25 후속

`reviews/fil-independent.md` 전문을 읽고 주 에이전트가 요청한 R1–R3 필수 수정, R4 문체 제안, 기존 만료일 표현의 명료화를 반영했다. 독립검수 문서는 수정하지 않았다. 그 문서의 현재 SHA-256은 `7c6d4c7e8bbf60fc8f2d95642bd47b5bc567bbac6f66d64349026349220e5d55`이며, 원래 해시와 `REQUEST_CHANGES` 판정은 검수 당시 증거로 남아 있다. 작성자가 독립검수의 판정을 임의로 승인으로 바꾸지 않았다.

| 요청 | 실제 수정 전 | 반영 문장·조치 | 의미 보존 |
|---|---|---|---|
| R1 / 706 / F23 | `Itinitigil ang nakabinbing aplikasyon … kapag umalis habang pinoproseso.` 뒤에 특정 시스템 한정만 있었음. | 심사 중단 설명 뒤에 `Matapos muling pumasok sa Taiwan, maaaring maghain ng bagong aplikasyon kung natutugunan ang mga kondisyon sa pagiging kuwalipikado sa sistemang iyon.` 추가. | 해당 온라인 경로에서 재입국 후 적격성 충족 시 새 신청이 가능하다는 `maaaring … kung`를 보존. 자동 재개·무조건 의무·모든 입국자의 적격으로 바꾸지 않음. 기존 NIA 링크와 특정 시스템 범위 유지. |
| R2 / 704 / F10 | `… pinahintulutang magtrabaho … Binibilang ang panahong iyon mula sa araw pagkaraan ng pag-apruba …` | 대상에 `at aprubado ng NIA na manirahan`을 명시하고 기산 문장을 `Binibilang ang panahong iyon mula sa araw pagkaraan ng pag-apruba ng NIA sa paninirahan; …`으로 수정. | 취업허가일과 NIA 거류승인일을 혼동하지 않도록 승인 종류·기관 명시. 최장5년, 거류승인 다음 날, 적격 가족의 거류승인 조건 유지. |
| R3 / 704 / F06 | `… kasama ang pasaporte at mga dokumento ng paninirahan o pagkakakilanlan ng kamag-anak …` | `… kasama ang naaangkop na mga dokumento ng pagkakakilanlan o paninirahan ng kamag-anak na pinagbabatayan ng aplikasyon.` | 초청가족의 여권을 모든 가족 신청의 보편적 필수 자료로 읽히게 하는 부분 제거. 기본서류 문단의 신청자 여권, 관계증명, 적절한 초청자 신원·거류 자료는 유지. 개별 경로에서 여권을 요구하지 않는다고 단정하지 않음. |
| R4 / 704 / 문체 | `Maaaring maunang abutin ng paghahanda ang mga dokumentong inisyu sa ibang bansa.` | `Maaaring mas matagal ihanda ang mga dokumentong inisyu sa ibang bansa kaysa punan ang pormularyo.` | 준비가 문서에 도달한다는 번역투를 서류 준비시간의 비교로 고침. 뒤의 인증 의무·요청 시 중국어 번역 조건 그대로 유지. |
| 706 / 비차단 명료화 | `Mananatili ang orihinal na petsa ng pag-expire.` | `Hindi nito awtomatikong pinahahaba ang dating pahintulot.` | 새 허가 후에도 날짜가 불변이라는 오독을 피하고 재신청 제도가 자동 연장·유예가 아니라는 뜻을 직접 기술. 30일 미만 AND 원사유 계속 AND 처벌 후 재신청, 영주기간 계산1년 공제 유지. |

수정 전 704 SHA는 `a2f80999f86b028de7b3210a7ba7296213cd35f3950aacf63c4b01ce4dda1f7a`, 706 SHA는 `4b270468989f7d0168106a426720a3439f138e77196b26f981f8e9560a613e1e`였다. 705는 변경하지 않았으며 SHA `b3d5a3132b260ef14653bab7ea8e40ce303817b76365d22d29c2df62fc93e70e`를 유지했다. 수정 후 세 파일의 SHA는 문서 첫 표와 일치한다.

최종 실제 명령:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-fil/704-taiwan-arc-first-application.md src/content/columns-fil/705-taiwan-visa-residence-work-study-family.md src/content/columns-fil/706-taiwan-arc-renewal-changes-reentry.md
```

| 파일 | 문장 수 | 길이 CV | 짧은 문장 | 유사 길이3연속 | 끝 괄호 인용 | 대비 틀 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---|
| 704 | 57 | 0.476 | 0.105 | 0.018 | 0.000 | 0 | `[fil]`, FAIL 0, exit 0 |
| 705 | 67 | 0.525 | 0.134 | 0.046 | 0.000 | 0 | `[fil]`, FAIL 0, exit 0 |
| 706 | 84 | 0.487 | 0.131 | 0.098 | 0.000 | 0 | `[fil]`, FAIL 0, exit 0 |

§5 후속 점검: 도입·실질 결말·비판촉 구조는 유지했고, 세 편 모두 같은 문단 첫 단어의 최대 빈도2, 의미 있는 짧은 문장2개 이상이다. 추가한 재신청 문장은 조건을 온전히 둔 설명이며 문단을 임의로 나누어 지표를 맞추지 않았다. 굵은 강조·가상 체험·명령형 제목을 추가하지 않았다. 주체·승인 종류·조건문을 FAQ9개와 다시 대조했으며 FAQ 변경은 필요하지 않았다.

`gray-matter` 파싱을 포함한 구조·출처 검사도 최종 파일에 재실행해 각14/14를 확인했다. 날짜·audience·author·FAQ3·필수키·이미지 파일, 장식용 강조·공개 byline·본문 H1·줄끝 공백 부재, EN 공식 출처 URL 누락0과 내부 링크 대상 누락0이 유지된다. 이 후속 작업에서는 704·706 및 본 저자 보고서만 수정했다. 다른 언어 원고, 독립검수 보고서, 검사기, 배포 상태는 변경하지 않았다.
