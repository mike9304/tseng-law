# C8 final review — Astra R1

판정: PASS. 아래 직접 수정 사항을 반영한 네 언어 원고는 게시 가능하며 이미지도 OK입니다. 미해결 MAJOR 0건, 미해결 hard-rule 위반 0건, MONOTONY FAIL 0건입니다.

검토일: 2026-10-16. 역할: 독립 최종 검수. 이 검수자는 초안을 작성하지 않았습니다. 이번에는 원고의 기존 법적 분석과 이미 확보된 출처로 확정할 수 있는 번역·조건 재명시·문체 수정만 직접 적용했습니다. 실제 게시·배포는 수행하지 않았습니다.

## Scope checked

- 전문을 읽은 지침: `brief-BATCH.md`, `brief-EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, `topics/C8.md`, 공유 `SENTENCE-VARIETY-RULE.md` 전체와 특히 5–6절, 공유 `LESSONS.md`의 반복 지적 25항목. `COLUMN-VOICE-RULE.md`의 예전 정본 경로는 없었으므로, 제공된 전체 브리프와 읽기 전용 저장소의 `docs/columns/editorial-voice.md`를 읽었습니다. 폐기된 Fable 의무 절차는 적용하지 않았습니다.
- 원고 전문: `drafts/C8/ko.md`, `ja.md`, `en.md`, `zh-hant.md`. 제목·SEO 제목·요약·FAQ·본문·표·마지막 의뢰 및 연락 문단·출처를 모두 포함합니다.
- 근거: `drafts/C8/facts.md`와 `research/C8-statutes.md`를 전문으로 읽되, 팩트시트의 결론을 그대로 신뢰하지 않고 아래 공식 현행 페이지와 대조했습니다. 보조 기록 `reviews/C8/voice-sol.md`도 읽었습니다. 첫 최종 검수 R1이며, 이전 Astra 최종 검수의 미해결 표를 승계하는 회차가 아닙니다.
- 법률 → 인용 → 배치 규칙 → 각 언어 문체 및 다양성 → 이미지 순으로 검사했습니다. 판결, 외국법, 관청 처리기간·수수료·통계 인용은 네 원고에 없습니다. 따라서 C8에 해당하는 판결 `.txt` 확인 대상도 없습니다.
- 이미지 `images/C8.webp`를 이미지 보기 도구로 직접 열었습니다. 가상 이미지 제작 지시 `prompts/images.txt:13`과 C8 생성·저장 기록도 대조했습니다.
- 기존 칼럼 연결은 `topics/LINKS.md`, 린트 및 실제 읽기 전용 저장소 파일로 확인했습니다. 네 언어 모두 자기 언어의 `372-taiwan-related-party-loan-interest-thin-capitalization.md`가 존재합니다. 이번 배치 원고로 향하는 내부 링크는 없습니다.

## Official-source verification

다음 다섯 페이지를 각각 `curl -fSL --retry 1 --connect-timeout 10 --max-time 40`으로 열고 실제 HTML과 본문을 읽었습니다. 모두 HTTP 200입니다. 중문 제8조·제15조·전문은 웹 도구로도 재확인했습니다. 영문 페이지는 웹 도구에서 오류가 났으나 curl로 본문 전체를 받아 제8조·제15조 및 표제의 개정일을 직접 확인했습니다.

1. [公司法 제15조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=15)
2. [公司法 제8조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080001&flno=8)
3. [公司法 중문 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=J0080001)
4. [Company Act 공식 영문 전문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=J0080001)
5. [公司法 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080001)

curl 원문·응답 헤더·변경 전 사본·검사 출력은 `/private/tmp/C8-astra-r1-b39ki63k/`에 있습니다. 임시 보조 자료이며, 이 로그 자체에 판정 근거와 최종 해시를 남깁니다.

| 검증 대상 | 공식 원문 및 판단 | 네 언어 최종 결과 |
|---|---|---|
| 회사 자금 대여 금지와 상대방 | 제15조 제1항 본문 `公司之資金…不得貸與股東或任何他人` | 회사 자금, 주주 및 다른 상대방이라는 범위 유지. 그룹·주주 지위를 독립 예외로 만들지 않음 |
| 업무상 거래 예외 | 제1항 제1호 `公司間或與行號間有業務往來者` | 회사 사이 또는 회사와 行號 사이의 실제 업무상 거래. 최소 거래액·기간·서류 의무를 만들지 않음 |
| 단기 융통 예외와 AND 조건 | 제1항 제2호 `有短期融通資金之必要`와 `不得超過貸與企業淨值的百分之四十` | 단기 융통의 필요와 대여기업 순자산 40% 상한을 모두 유지. 차입기업 순자산으로 계산하지 않음 |
| 40%의 적용 위치 | 비율은 제2호에 명시. 제1호에는 비율 문구 없음 | 제1호까지 40%를 자동 적용하거나 제1호를 무제한 대여 허가로 설명하지 않음 |
| 단기의 기간·문서 | 제2호 자체에 일수·월수·특정 문서 목록 없음 | 확정 기간을 만들지 않음. 필요와 상환 계획의 기록은 실무 준비로 설명하며 법정 서식으로 주장하지 않음 |
| 반환과 손해배상 | 제2항 `公司負責人違反前項規定時，應與借用人連帶負返還責任；如公司受有損害者，亦應由其負損害賠償責任` | 위반한 책임자의 차입자와의 연대 반환 책임, 회사 손해가 있을 때의 배상 책임을 구분. 아래 E1–E2의 정밀 수정을 적용 |
| 회사 책임자 | 제8조 제1항의 有限公司·股份有限公司 董事, 제2항 열거자의 직무 범위 | 이사 지위와 위반 여부를 구분. 해외 지시가 이사 지위를 바꾸지 않는다는 설명을 자동 책임 주장으로 확대하지 않음 |
| 가상 수치 | 50,000,000 × 0.40 = 20,000,000; 30,000,000 − 20,000,000 = 10,000,000 | 네 언어 동일. 대만달러 단위 및 가상 표지 유지. 감액만으로 필요 요건까지 충족한다고 쓰지 않음 |
| 법률 버전 | 전문 표제 `民國114年12月26日` / 영문 `2025-12-26`; 연혁상 해당 개정은 제449조와 신설 제387-1조 | 출처 목록의 법률 전체 개정일이 정확함. 이를 제8조·제15조의 개정일이나 시행일로 돌려 쓰지 않음. 두 조문에 미시행 개정을 적용한 부분 없음 |

중문을 기준으로 영어 용어를 대조했습니다. 영문 번역의 `capital`이라는 표현을 이유로 중문의 `資金`을 자본금만으로 좁히지 않았고, 영문 제15조 제2항의 `jointly and severally`는 아래와 같이 정확히 반영했습니다. 제8조 제3항은 현행 원문에서 확인했지만, 가상사례가 실제 董事를 전제로 하므로 별도 법적 분석을 추가하지 않았습니다.

## Issues and corrections

### E1 — EN: 연대 반환 책임의 정확한 영문 표현, applied

Original: `en.md:19,55`의 `jointly liable` 세 곳(FAQ 3, 본문 법칙, 본문 사례).

→ Problem & reason: `jointly`만으로는 원문 `連帶`가 뜻하는 책임을 정확히 전달하지 못합니다. 공식 영문 제15조 제2항도 `liable, jointly and severally with the borrower`라고 적습니다.

→ Fix applied: 세 곳을 모두 `jointly and severally liable`로 수정했습니다. 본문 사례의 책임자 조건은 E2와 함께 수정했습니다.

→ Facts preserved: 차입자와 위반한 회사 책임자의 연대 반환 의무, 회사 손해가 있어야 하는 추가 배상 의무를 유지했습니다. 단순한 취향 수정이 아니라 이미 인용한 조문에 맞춘 번역 정정입니다. 새로운 책임 유형이나 소송 절차는 넣지 않았습니다.

### E2 — KO / JA / EN / ZH-HANT: 사례에서도 위반한 책임자를 특정, applied

공통 근거: 제15조 제2항의 주어·조건은 `公司負責人違反前項規定時`입니다. 각 원고가 문단 첫 문장과 FAQ에서는 이를 정확히 썼으나, 사례에 적용하는 문장에서는 회사가 위반하면 모든 책임자가 당연히 반환해야 하는 것처럼 읽힐 여지가 있었습니다.

- `ko.md:53`: Original `B사와 A사의 책임자가 연대하여 집니다` → 위반 주체 조건이 사례 문장에서 생략됨 → `B사와 제1항을 위반한 A사의 책임자가 연대하여 집니다`로 수정 → 회사 자금, 차입자 B, 연대 반환, 회사 손해 조건 및 링크 보존.
- `ja.md:55`: Original `B社とA社の責任者が連帯して負う` → 같은 조건 생략 → `B社と第1項に違反したA社の責任者が連帯して負う`로 수정 → 사례의 거래와 두 책임의 조건 보존.
- `en.md:55`: Original `B and A's responsible person would be jointly liable` → 개인의 위반 조건이 사례에서 생략됨 → `B and A's responsible person who violated paragraph 1 would be jointly and severally liable`로 수정 → 동일 사례·반환 대상·회사 손해 조건 보존; E1의 번역도 함께 복원.
- `zh-hant.md:53`: Original `乙公司和甲公司的負責人要連帶負返還責任` → 책임자 자신의 위반 조건 생략 → `乙公司和違反第1項的甲公司負責人要連帶負返還責任`로 수정 → 차입자·책임자·연대 반환·손해 조건 보존.
- `zh-hant.md:55`: Original `仍要回到甲公司是否違反第1項來看` → 앞서 설명한 책임자 신분과 개인의 위반을 연결해야 하는 자리에서 회사의 위반만 언급 → `仍要看該負責人是否違反第1項`으로 수정 → 제8조의 지위와 제15조의 책임 발생 조건을 각각 보존.

이 수정은 본문에 이미 정확히 적힌 조건을 적용 문장에도 복원한 것입니다. 누가 실제로 위반했는지에 관한 새 사실인정이나 새로운 법률 해석을 하지 않았습니다.

### E3 — EN: 제8조 열거자를 전부 officers라고 묶지 않음, applied

Original: `en.md:19,57`의 `managers and the other officers listed` / `Managers (經理人) and the other officers listed`.

→ Problem & reason: 제8조 제2항은 청산인·검사인·발기인 등도 열거합니다. 이들을 모두 일상적 의미의 회사 officers로 묶을 필요가 없습니다.

→ Fix applied: 두 곳의 `other officers`를 `other persons`로 바꿨습니다.

→ Facts preserved: 제8조 제2항에 실제로 열거된 사람이라는 한정과 `within the scope of their duties`를 그대로 유지했습니다. 책임자 범위를 넓히지 않았습니다.

### E4 — EN summary: 상한의 대상 명료화, applied

Original: `en.md:4`의 `Item 2 has a 40% cap on the lender's net worth.`

→ Problem & reason: 제한되는 것은 대여기업의 순자산 자체가 아니라 융자 금액입니다. 본문의 정확한 설명을 요약에도 명료하게 반영해야 합니다.

→ Fix applied: `Item 2 caps loans at 40% of the lender's net worth.` 앞 문장의 `another company`는 선행사 Taiwan company를 받는 `another`로 줄여 요약을 155자로 유지했습니다.

→ Facts preserved: 회사 자금, 다른 회사 상대방, 업무상 거래 또는 필요한 단기 융통, 제2호에만 붙는 대여자 순자산 40% 상한을 모두 유지했습니다. SEO 요약의 금지 문자·URL·말줄임표도 없습니다.

### E5 — KO: 가상사례의 회사 형태를 다른 세 언어와 일치, applied

Original: `ko.md:27`의 `두 회사 모두 대만에서 설립되었고 주식을 공개발행하지 않았으며`.

→ Problem & reason: JA·EN·ZH는 두 회사를 股份有限公司로 설정하지만 KO는 형태를 생략했습니다. 뒤의 이사·이사회 기록 설명과 함께 읽는 가상사례의 대상을 일치시켰습니다.

→ Fix applied: `두 회사 모두 대만에서 설립된 주식회사(股份有限公司)로 주식을 공개발행하지 않았으며`.

→ Facts preserved: 두 회사 모두 대만 설립·비공개발행, B의 A 지분 보유, 공통 이사, 아직 송금 전이라는 설정과 `(가상의 예입니다)`를 보존했습니다. 실제 회사 사실이나 회사 설립 절차를 추가하지 않았습니다.

### E6 — KO: 책임 절의 모호한 제목, applied

Original: `ko.md:51`의 `예외 없이 송금했을 때 책임지는 사람`.

→ Problem & reason: `예외 없이`가 ‘언제나’라는 뜻으로도 읽힙니다. 문제는 두 허용 예외에 해당하지 않는 대여입니다.

→ Fix applied: `예외에 해당하지 않는 대여의 책임`.

→ Facts preserved: 제15조 제1항 위반 대여에 관한 제2항 설명이라는 범위와 본문 전체를 유지했습니다.

### E7 — JA: 첫 문단 삭제 시험에서 중복 한 문장 제거, applied

Original: `ja.md:25` 마지막의 `グループ会社というだけでは、どちらの事情も示せません。`

→ Problem & reason: 같은 문단의 첫 문장이 이미 지분 관계만으로는 자금을 내줄 수 없다고 말하고, 다음 문장이 두 예외를 구체적으로 설명합니다. 마지막 문장을 지워도 사실·조건·출처가 줄지 않았습니다.

→ Fix applied: 이 마지막 한 문장만 삭제했습니다.

→ Facts preserved: 그룹 관계만으로 부족하다는 정보, 회사 자금의 원칙적 금지, 두 예외의 대상 및 필요 요건, 제15조 제1항 링크를 모두 보존했습니다.

### E8 — JA: 불필요한 조문 읽기 비유 제거, applied

Original: `ja.md:51`의 `A社は期間の数字を条文から借りるのではなく、B社がいつまで資金を必要とし…`.

→ Problem & reason: 조문에서 기간 숫자를 ‘빌린다’는 비유가 부자연스럽고, 앞 문장의 ‘기간이 적혀 있지 않다’는 설명을 불필요하게 대비시킵니다.

→ Fix applied: `貸付を検討するA社は、B社がいつまで資金を必要とし、何を原資に返済する予定かを確かめます。`

→ Facts preserved: 필요한 기간과 상환 재원을 확인하는 실무 준비, 조문 자체에 고정 기간이 없다는 점, 특정 문서를 만들 의무를 주장하지 않는다는 점과 기존 링크를 보존했습니다.

## Applied edit inventory

- KO: 가상사례의 股份有限公司 명시 1곳, 책임 절 제목 1곳, 사례의 위반 책임자 조건 1곳.
- JA: 중복 도입 문장 삭제 1곳, 단기 융통 설명의 비유 수정 1곳, 사례의 위반 책임자 조건 1곳.
- EN: 요약 1곳, 연대책임 표현 3곳, 사례의 위반 책임자 조건 1곳, `officers` → `persons` 2곳. 일부는 같은 문장 안의 별도 수정입니다.
- ZH-HANT: 사례의 위반 책임자 조건 1곳, 책임 판단 문장의 주체 1곳.
- 모든 언어에서 수정 전후 링크 목록과 순서가 완전히 같습니다. 가상 표지·기존 수치·금액·날짜·인용을 삭제하지 않았습니다. `facts.md`, 연구 파일, 이미지 및 다른 칼럼은 수정하지 않았습니다.

## Citations, hard rules and locale decisions

| 언어 | 법·사실 및 인용 | 배치 형식·문체 최종 판단 |
|---|---|---|
| KO | 제15조 제1항 본문·각 호·제2항과 제8조 제1–2항, 가상 계산, 요약·FAQ·표를 직접 대조. 법률 규칙을 말하는 모든 본문 문단에 해당 공식 링크가 있음 | 합니다체 유지. E5–E6로 사례와 제목을 명료화. 연락처는 정확한 호정(昊鼎)국제법률사무소 명칭·이메일·`臺北市大同區承德路一段35號7樓之2` |
| JA | 같은 법적 핵심과 제1호/제2호의 OR, 제2호 내부의 AND를 유지. 각 법률 문단에 링크 있음 | 자연스러운 です・ます체. E7–E8 적용. 명칭 昊鼎国際法律事務所, 이메일, `台北市大同区承徳路一段35号7F-2` 정확 |
| EN | E1–E4 적용 후 본문·FAQ·요약의 법적 의미 일치. Article 8 정의는 직무 범위 조건 보존. 각 법률 문단에 링크 있음 | 평이한 능동문. title 96자이므로 seoTitle 필요하며 실제 42자. summary 155자. Hovering International Law Firm, 이메일, `English-speaking lawyer in Taipei`와 전체 103, Taiwan 포함 주소 정확 |
| ZH-HANT | 제15조 및 제8조 원문과 직접 대조. E2 적용 후 개인의 위반 조건이 사례와 책임자 설명 모두에 남음 | 台灣 용어·번체 유지. 명칭 昊鼎國際法律事務所, 이메일, `臺北市大同區承德路一段35號7樓之2` 정확 |

네 언어 모두 출처 목록에 제8조·제15조·중문 전문·공식 영문본이 있고 확인일은 2026-10-16입니다. 인용한 단일 조문은 모두 `research/C8-statutes.md`에 있습니다. 가상사례 외 실존 사적 당사자 이름, 굵은 강조, 전화·핫라인·메신저 ID, 변호사·원어민 검수 주장, 변호사 저자명은 없습니다. `author: "legal-ai-assistant"`, 언어별 audience·categories·topic·게시일·수정일·이미지 경로·FAQ 개수도 적합합니다.

공개발행 회사의 특별 규율·보증·이사 이해충돌·세무 및 외환 규칙·개인 주주 대여로 분석을 넓히지 않았습니다. 역방향 모회사 대여금의 이자 문제는 기존 칼럼으로 연결하는 한 문장만 있고 별도 세법 규칙을 설명하지 않습니다. 마지막 절은 등기·거래 기록·필요 자금·순자산·기존 대여금·계약 및 의사록 초안 검토라는 실제로 이 사안에 맞는 위임 업무를 제시하며 결과를 보장하지 않습니다.

첫 두 문단을 문장별로 삭제 시험했습니다. JA의 E7 외에는 각각 40%의 위치 또는 그룹 관계의 한계, 대만 설립 회사와 비공개발행 설정, 지분 관계, 이사 지위, 대여 요청과 미송금 상태라는 정보가 있어 유지했습니다. 제목을 반복하는 범용 도입이나 글 전개 예고는 없습니다.

같은 언어의 최근 비교 자료는 읽기 전용 `/Users/son7/Projects/tseng-law-columns-20261016/src/content/`에서 도입·소제목·끝맺음을 열어 대조했습니다. 로컬 원고에 표시된 게시일 기준이며 공개 페이지 렌더링 검사를 했다는 뜻은 아닙니다.

| 언어 / 폴더 | 비교 파일 및 게시일 | 구체적인 비교 결과 |
|---|---|---|
| KO / `columns` | `628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — 모두 2026-10-15 | 교통 칼럼의 질문·현장 영상 도입과 달리 C8은 법정 비율의 적용 위치로 시작. 끝은 사고 영상이 아니라 회사 거래와 순자산 자료에 묶임 |
| JA / `columns-ja` | `610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md`, `608-taiwan-false-financial-report-investor-civil-damages.md` — 2026-10-14 | 임기·잘못된 송금·보고서 서명의 문제와 구별되는 그룹 대여 요건이 주제. 포괄 면책 문구나 기존 마지막 문단을 복사하지 않음 |
| EN / `columns-en` | `611-taiwan-scooter-outer-lane-left-turn-dashcam.md`, `610-taiwan-subsidiary-annual-shareholders-meeting-director-term.md` — 2026-10-15; `609-taiwan-mistaken-bank-transfer-unjust-enrichment.md` — 2026-10-14 | 영상 장면·Three years·개인 오송금 도입과 달리 회사 지분 관계만으로 대여를 정당화할 수 없다는 문제로 시작. 계약 및 재무자료로 끝남 |
| ZH-HANT / `columns-zh` | `628-taiwan-parked-car-collision-external-video-evidence.md`, `627-taiwan-oneway-wrongway-head-on-collision.md`, `626-taiwan-red-signal-straight-stop-line-collision.md` — 모두 2026-10-15 | 교통 장면 질문과 달리 회사법 금지 문언 직접 인용으로 시작. 두 회사의 구체적 거래·淨值 기록이 끝맺음의 대상 |

배치 C1–C8의 첫 문단도 대조했습니다. C8은 가상 장면 공식으로 시작하지 않습니다. KO는 숫자의 적용 위치, JA·EN은 기업집단 관계에 관한 전제, ZH는 조문 직접 인용으로 들어갑니다. 넓은 의미의 오해 설명 유형은 JA의 다른 글에도 있지만 동일 첫 문장 공식을 복제하지 않으며, 다양성 규칙 2-4의 한 유형 과반·장면형 1/3 초과에 해당하지 않습니다.

## Sentence variety and verification results

각 파일 편집 직후 다음 두 명령을 실제로 실행했습니다. `<lang>`은 `ko`, `ja`, `en`, `zh-hant`를 각각 넣었습니다.

```text
python3 /Users/son7/tseng-col-1016-work/lint.py /Users/son7/tseng-col-1016-work/drafts/C8/<lang>.md <lang> taiwan-related-company-loan-permitted-conditions
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-col-1016-work/drafts/C8/<lang>.md
```

| 언어 | lint | 본문 길이 | 문장 수 / CV | 아주 짧은 문장 | 다양성 결과 |
|---|---|---|---|---|---|
| KO | OK, exit 0 | 2,918자 | 72 / 0.456 | 8개, 11.1% | FAIL 0, exit 0; 93% `니다.` 어미 WARN |
| JA | OK, exit 0 | 3,221자 | 71 / 0.473 | 8개, 11.3% | FAIL 0, exit 0; 92% desu-masu 어미 WARN |
| EN | OK, exit 0 | 1,297 words | 79 / 0.514 | 24개, 30.4% | OK — no variety limit violated, exit 0 |
| ZH-HANT | OK, exit 0 | 2,213자 | 60 / 0.483 | 7개, 11.7% | OK — no variety limit violated, exit 0 |

수동 자기 점검도 완료했습니다. 네 언어 모두 문단 첫 단어 최대 반복은 2회이며, 한 문단에 기준 이상 긴 문장이 둘 이상인 곳이 없습니다. 같은 시작의 연속 문장은 KO 0, JA 2, EN 0, ZH 0회입니다. 출처가 필요 없는 가상 장면 문단이 있고, 주장–조문–단서 구조가 세 문단 연속하지 않습니다. 대비 틀 계수는 KO 0, JA 1, EN 0, ZH 1이며, 검토 대상인 오너의 그룹 관계 주장과 무관한 허수아비 반박을 추가하지 않았습니다. 연락 문단도 거래 기록과 대여자 순자산으로 끝납니다. KO·JA의 WARN은 지정된 존대체 종결 빈도이며 반말·だ／である 혼용이나 자동 FAIL이 아닙니다. 일본어의 `でしょうか。` 질문은 문맥으로도 확인했습니다.

자동 FAIL 없음. 수동 점검의 미충족 항목이 두 개 이상인 언어 없음. 남은 MONOTONY 반려 사유 없음. 숫자·링크·조건·가상 표지는 차이 비교로 보존을 확인했습니다.

## Image verdict

OK — `images/C8.webp`를 직접 확인했습니다. 물이 든 유리병과 빈 유리병이 분리되어 놓인 가상 사무 공간으로, 아직 실행되지 않은 회사 간 자금 이전이라는 주제에 맞습니다. C8 제작 프롬프트도 이 두 용기의 구도를 명시하고 있고 생성·저장 로그가 있습니다. 얼굴이나 사람이 없고 문자·숫자·로고·국기·읽을 수 있는 문서·화면이 보이지 않습니다. 배경 도시 실루엣이 실제 당사자나 사적 사건을 특정하지 않으며 차분하고 존중하는 표현입니다. 이미지 교체 불필요.

## Reviewed final versions

아래 SHA-256의 원고에 PASS가 적용됩니다.

| 파일 | SHA-256 |
|---|---|
| `drafts/C8/ko.md` | `c1a70427cda8b571160e00a28dbcf2e5eca449d1a168b2769a53950ed9194074` |
| `drafts/C8/ja.md` | `d62852d3879823a38d9b4077cda9ebe59f07024e5b640b0b442f00dc74d442ce` |
| `drafts/C8/en.md` | `d97519a8494e1294a84dc66040114f7e50a0c0f6fea27ae3ef3461eb3505b5e4` |
| `drafts/C8/zh-hant.md` | `3c84d46b08b7d176bd823ab60bf0e9a65558e34eb79929d669171664c10ba864` |
| `images/C8.webp` | `e50ca8df74b27a19efeea017f41304f2fe188569be9174f3b1441a9b89658526` |

## Points for lawyer confirmation

칼럼이 확정해 설명하지 않은 개별 거래의 실무 판단 사항입니다.

1. 제1호의 業務往來 인정 범위와 실제 거래 규모·대여금액의 관계를 확인할 필요가 있습니다.
2. 제2호의 단기 판단, 기존 대여금 합산 범위, 순자산 계산의 기준일과 사용할 재무제표를 확인할 필요가 있습니다.
3. 제15조 제2항을 위반한 책임자의 특정과 회사 손해·인과관계는 실제 의사결정 및 송금 자료로 확인할 필요가 있습니다.

VERDICT: PASS
