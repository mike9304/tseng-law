# FIL 704–706 독립 검수

검수일: 2026-10-25 KST. 검수자: `column_inventory` AI 에이전트. 저자와 다른 에이전트가 읽고 대조했다. 공통 사실표와 원문은 공유했으므로 블라인드 검수나 독립적인 전수 법률조사는 아니다. 인간 원어민·변호사 검수로 표시하지 않는다.

판정: `REQUEST_CHANGES`. FIL706의 특정 온라인 경로에서 재입국 후 재신청이 가능한 조건을 보완하고, FIL704의 거류기간 기산점과 가족 서류의 주체·범위를 명확히 해야 한다. FIL705에서는 게시를 막을 조건 오류를 찾지 못했다. P3 한 항목은 비차단 문체 제안이다. 원고를 직접 수정하지 않았다.

## 검토 대상과 해시

| 대상 | SHA-256 |
|---|---|
| `src/content/columns-fil/704-taiwan-arc-first-application.md` | `a2f80999f86b028de7b3210a7ba7296213cd35f3950aacf63c4b01ce4dda1f7a` |
| `src/content/columns-fil/705-taiwan-visa-residence-work-study-family.md` | `b3d5a3132b260ef14653bab7ea8e40ce303817b76365d22d29c2df62fc93e70e` |
| `src/content/columns-fil/706-taiwan-arc-renewal-changes-reentry.md` | `4b270468989f7d0168106a426720a3439f138e77196b26f981f8e9560a613e1e` |
| `reviews/fil-author.md` | `052c6bb3883661c9595f8354170cd478ced78d69556dde6553baa1996d5ea75a` |
| `research/arc-source-facts.md` | `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145` |

기준 commit: `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`. EN을 주된 의미 비교 대상으로 삼고 현재 KO·ZH를 교차 대조했다. 공통 사실표의 정정된 F04와 F23을 포함해 F01–F23을 읽었고, 표에 추가된 F24를 원문의 범위를 넘는 필수 확장으로 취급하지 않았다.

| 기준 | 704 | 705 | 706 |
|---|---|---|---|
| EN | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

세 FIL 원고의 제목·SEO 제목·요약·FAQ·이미지 문구·본문·출처 목록 전문과 저자 기록을 읽었다. AGENTS, BRIEF, 저장소 문체 정본, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE 및 LESSONS는 같은 세션에서 읽은 규칙을 적용했다. 홈 공통 `editorial-voice.md`의 당시 로컬 부재를 실제 읽음으로 처리하지 않았다.

## 수정 요청

| ID·위치 | 실제 문장 | 문제·근거 | 최소 수정안 | 의미 보존 |
|---|---|---|---|---|
| R1 / P2 / FIL706 87행, F23 | “Itinitigil ang nakabinbing aplikasyon sa pagsubok na sistema ng NIA para sa mga propesyonal at kanilang pamilya kapag umalis habang pinoproseso. Tuntunin ito ng partikular na sistemang iyon. Kailangang sundin ang gabay para sa sariling aplikasyon bago bumiyahe.” (원문 링크 생략 표기) | 출국 시 심사 중단과 특정 경로 한정은 정확하다. 다만 재입국 뒤 적격이면 다시 신청할 수 있다는 후속 효과가 없다. [NIA 해당 온라인 절차 주의 9](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)는 재입국 후 그 안내 제2점의 대상 요건을 갖추면 재신청할 수 있도록 한다. 이 검수 과업에서 보완하도록 지정된 F23의 절차적 정보다. 기존 심사 중단 문장 자체가 거짓이라는 판정은 아니다. | 심사 중단 설명 뒤에 “Matapos muling pumasok sa Taiwan, maaaring maghain ng bagong aplikasyon kung natutugunan ang mga kondisyon sa pagiging kuwalipikado sa sistemang iyon.”를 추가한다. | `maaaring … kung`로 가능·조건을 모두 유지한다. 모든 재입국자의 재신청 의무나 자동 적격으로 바꾸지 않는다. 기존 본문 URL과 출처 목록, 특정 경로라는 범위를 유지한다. |
| R2 / P2 / FIL704 70행, F10 | “May hiwalay na hanggang limang taon para sa kuwalipikadong dayuhang propesyonal na may natatanging kadalubhasaan na pinahintulutang magtrabaho … Binibilang ang panahong iyon mula sa araw pagkaraan ng pag-apruba; saklaw din ng artikulo ang kuwalipikadong pamilya na aprubado nang manirahan.” | 바로 앞 승인은 취업허가인데 다음 문장은 어느 승인의 다음 날인지 생략한다. [인재법 제8조 제2항](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295)은 특정전문인재의 NIA 거류승인을 전제로 ARC 기간을 그 승인 다음 날부터 계산한다. 앞 문맥이 NIA의 기간 결정임을 말하지만, 날짜를 계산하는 문장에는 승인 종류가 명확해야 한다. | “May hiwalay na hanggang limang taon para sa kuwalipikadong dayuhang propesyonal na may natatanging kadalubhasaan na pinahintulutang magtrabaho at aprubado ng NIA na manirahan sa ilalim ng [기존 제8조 링크]. Binibilang ang panahong iyon mula sa araw pagkaraan ng pag-apruba ng NIA sa paninirahan; saklaw din ng artikulo ang kuwalipikadong pamilya na aprubado nang manirahan.” | 취업과 거류의 승인 주체·효과를 분리한다. 최대 5년, 다음 날 기산, 가족의 거류승인 조건을 유지한다. 현재 문장이 이미 추가한 기산점을 명확히 하는 수정이며 새 제도 설명을 요구하지 않는다. |
| R3 / P2 / FIL704 52행, F06 | “Para sa pamilya: rekord ng kasal o kapanganakan na nagpapatunay ng ugnayan, kasama ang pasaporte at mga dokumento ng paninirahan o pagkakakilanlan ng kamag-anak na pinagbabatayan ng aplikasyon.” | `pasaporte at … ng kamag-anak`는 초청가족의 여권까지 모든 가족 신청의 필수 서류로 읽힐 수 있다. 현재 EN은 초청자의 신원 또는 거류 자료를 적는다. [NIA0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) 3(1)c의 일반 여권 제출은 신청자이고, 3(1)d(i)의 가족 증명 목록은 초청자 여권을 일률적 추가 조건으로 두지 않는다. 개별 경로에서 여권을 요구하지 않는다는 단정은 아니다. | “Para sa pamilya: rekord ng kasal o kapanganakan na nagpapatunay ng ugnayan, kasama ang naaangkop na mga dokumento ng pagkakakilanlan o paninirahan ng kamag-anak na pinagbabatayan ng aplikasyon.” | 바로 앞 기본서류 문단의 신청자 여권은 유지한다. 관계증명과 초청자 자료의 요구를 남기되 보편적인 초청자 여권 의무를 새로 만들지 않는다. |
| R4 / P3 / FIL704 56행, 문체 | “Maaaring maunang abutin ng paghahanda ang mga dokumentong inisyu sa ibang bansa.” | 준비가 문서에 먼저 도달한다는 결합으로 읽혀 준비기간의 뜻이 불분명하다. 법적 명제 오류가 아닌 번역투다. | “Maaaring mas matagal ihanda ang mga dokumentong inisyu sa ibang bansa kaysa punan ang pormularyo.” | 해외 서류 준비에 시간이 걸릴 수 있다는 실무 설명을 보존한다. 뒤따르는 인증 의무와 요청 시 중국어 번역 조건은 그대로 둔다. |

R1–R3 수정 뒤 해당 원고 해시와 의미·§5 검사를 다시 확인해야 한다. 별개의 온라인 신청 15일 규정이나 일반 보완기간 등 EN이 설명하지 않은 사항을 모든 번역에 일괄 추가하라는 요구는 하지 않았다.

공통 EN에서 이어진 비차단 명료화 사항도 있다. FIL706의 “Mananatili ang orihinal na petsa ng pag-expire.”는 앞의 재신청 안내와 뒤의 불이익 설명 사이에서, 새 승인을 받아도 만료일이 계속 같다는 뜻으로 읽힐 여지가 있다. [이민법 제31조 제3항](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132)은 요건부 재신청과 영주거류 계산상 공제를 정한다. 이 문단의 취지가 자동 유예가 아니라는 설명이므로 “Hindi nito awtomatikong pinahahaba ang dating pahintulot.”로 구체화할 수 있다. 현재 문맥을 허가 후에도 날짜가 영원히 불변이라는 주장으로 단정하지는 않았고, 새 법률 세부사항을 추가하는 차단 요청으로 올리지 않았다. 조정자에게 공통 원문 표현의 명료화로 별도 전달했다.

## 법적 주체·조건·기산점 대조

| 범위 | 확인 결과 |
|---|---|
| F01–F03: 첫 카드와 직접 신청 | 거류비자·거류허가 입국은 입국 다음 날부터 30일, 대만 내 비자 발급은 발급일부터 30일로 구분한다. 통합증명 예외와 전문직 취업허가 또는 면제, NIA 승인 후 카드라는 구조가 남아 있다. 모든 무비자 입국자에게 30일 전환기간을 주지 않는다. |
| F04: 전문인재 가족 | FIL705 “aktuwal na gumagawa …, o kabilang sa kategoryang foreign specialist professional; sa alinman, kailangan nang aprubado …”는 `[(일반 전문인재 AND 대만 전문업무) OR 특정전문인재] AND (거류 OR 영주거류 승인)` 구조다. 특정전문인재에도 실제 전문업무를 일률적으로 요구하지 않는다. 배우자·미성년 자녀·장애 때문에 스스로 생활할 수 없는 성년 자녀와 적격 입국 조건을 보존한다. 부모·모든 성년 자녀로 넓히지 않는다. |
| F05·F08: 대만 국민 배우자 | 대만 거주와 호적등록을 함께 적고, 적격 방문비자 경로의 60일 이상·연장금지 등 제한 부재를 보존한다. 첫 카드의 기간은 `Hanggang isang taon`으로 최장 1년이며, 배우자 동행과 대만 혼인등록 증명이 있다. 일반 외국 전문인재 배우자 전원에게 1년을 적용하지 않는다. |
| F06·F07: 서류 | 2년 이내 사진, 1개월 이내 재직·재학 자료, 입학 전과 등록 후 자료를 구분한다. 해외 인증과 요구 시 번역의 강도 차이를 유지한다. 보완할 주체 혼동은 R3다. |
| F09·F10: 금액·기간 | NT$1,000/년, 1년 미만도 1년분, 해당 방문·무비자 경로의 NT$2,200 가산, 僑生 50%와 일반 국제학생을 구분한다. 일반 최장 3년·특정전문 최대 5년·Gold Card 1–3년이 있다. 금액으로 더 긴 기간을 구매한다는 뜻은 없다. 5년 기간의 승인 종류는 R2로 요청했다. |
| F11·F12: 학생 납부·수령 | 학생 심사 5근무일과 승인 후 납부 5근무일을 분리했다. IC 카드는 납부 뒤 3근무일, 출력한 납부영수증, 선택한 NIA 센터로 설명한다. 6개월 이하 전자 ARC는 납부 후 다운로드다. 일반 심사 10근무일과 보완 뒤 재계산·제외기간, 다른 범주의 수령 방법을 분리했다. |
| F13·F14: 유학과 취업 | 적격 대학 부설 어학센터, 4개월 이수+최소 3개월 추가 등록, 월–금 주 15시간, 휴가 포함 결석 1/4 이하가 있다. FAQ도 최소 기간을 보존한다. 학생 취업의 주 20시간은 여름·겨울방학 예외를 함께 적는다. 실제 직무·고용주에 대한 허가 또는 면제, 대만 국민 배우자와 특정·고급 전문인재 배우자 제15조 경로를 구분한다. |
| F15–F17: 변경·연장 | 일반 만료 전 3개월, 주소·서비스처소 변경 다음 날부터 30일, 제23-1조 사유 변경 발생일부터 30일, 그 외 발생일부터 15일 후 BOCA→NIA 순서가 있다. 네 기간을 선택지나 유예기간으로 만들지 않는다. 계속 사업 창업가와 Gold Card 자체 갱신의 4개월, 사업 상실 별도 경로의 3개월을 구분한다. |
| F18·F19: 사유 상실·초과거류 | NIA 취소·말소 원칙과 요건별 계속거류 가능 예외를 보존한다. 가정폭력 이혼·미재혼, 해당 자녀 조건, 진행 중 노동 쟁송과 산재 치료를 단순한 모든 이혼·분쟁으로 넓히지 않는다. 30일 미만+기존 사유 계속+처벌 후 재신청, 영주기간 계산에서 1년 공제는 무불이익 유예로 쓰지 않았다. |
| F20·F21: 후속 거류와 졸업생 | 전문인재는 만료 전 신청·승인 시 원래 만료 다음 날 6개월, 추가 1회·합계 1년이다. 졸업생 별도 경로는 1년·추가 1회·합계 2년이고 어학수료를 자동 포함하지 않는다. 대만 전문학사 이상·당해 졸업·NIA 승인 후 연장기간의 취업면제 조건을 별도 문단에서 한정했다. 단순 졸업장만으로 근로권을 부여하지 않는다. |
| F22·F23: 출국·재입국 | 출국 전 재입국허가, ARC 유효기간과 함께 끝나는 허가, 유효 여권+APRC 예외가 있다. 접수증·사진을 탑승 보장으로 쓰지 않는다. 특정 온라인 경로의 심사 중단은 정확하나 후속 재신청 가능 조건을 R1로 요청했다. |
| 추가 공식 안내 | FIL706의 여권 잔여기간 설명은 유효 ARC/APRC 보유자에게 한정하고 도착일의 여권 유효성과 국경심사를 함께 둔다. [NIA FAQ](https://www.immigration.gov.tw/5385/12162/12197/414977/)의 범위와 맞고, 만료 카드·접수증으로 확장하지 않는다. |

FAQ 아홉 항목을 개별적으로 대조했다. FIL704의 기산·요금·취업, 705의 무비자·어학·가족, 706의 연장·변경·여행 답변은 본문의 대상 범위를 넘어선 보장을 만들지 않는다. 다만 본문의 R1–R3 수정이 FAQ와 새로운 불일치를 만들지 않는지 재확인해야 한다.

## 문체와 §5

1. 지원되는 `[fil]` profile로 공유 checker를 직접 실행해 세 편 모두 FAIL 0을 확인했다. 원어민 판정·법률 승인이나 다른 언어 profile의 성공으로 바꾸어 적지 않았다.
2. 704는 구체적 기산 사실, 705는 입국 방식에 따른 결과, 706은 사유가 먼저 끝난 경우의 독자 질문으로 시작한다. 가상 장면 공식이 없다. 첫 두 문단을 지우면 각각 기산·통합증명 예외, 입국 방식·여권 조건, 사유 상실 효과가 사라진다.
3. 의미 있는 짧은 문장이 두 개 이상 있다. 704: “NIA ang nagtatakda ng haba ng paninirahan.” / “Mga mag-aaral ang saklaw ng iskedyul na ito.” 705: “Hindi sapat ang bayad sa matrikula.” / “Maaari bang magtrabaho habang nag-aaral?” 706: “Mahalaga kung kailan nangyari ang pagbabago.” / “Hindi napahahaba ng pagpapalit ang paninirahan.” 긴 조건을 지표 때문에 잘라 없애지 않았다. 704의 본문 질문 0개는 기산 표와 직접 설명으로 진행하기 때문이며 질문을 억지로 보태지 않는다.
4. 본문 문단의 시작 단어를 세로로 대조했다. 같은 첫 단어 최대 2회다. 706의 `Kailangan`과 `Kailangang`처럼 같은 어근을 보더라도 문단 내용이 연속 명령 목록으로 구성되지는 않는다.
5. 세 문단 연속 ‘주장–조문–다만’ 패턴을 찾지 못했다. 704 제출 서류 사본 보관, 705 직접·비자 선행 신청 구분, 706 사건일을 구분하는 문단에 인용 없는 실무 연결이 있다. 새 법률 주장을 인용 없이 삽입한 것으로 보지는 않았다.
6. 자동 대비 틀은 0이다. 수동으로 읽은 `hindi`의 상당수는 ARC/취업허가·접수증/입국허가·단순 등록/적격 등 필요한 법적 구분이다. 독자가 제기하지 않은 주장을 반복 반박하는 틀로 보지 않았다.
7. 구조적 고지와 실질 결말을 구분했다. 현 파일은 공통 고지를 마지막 실질 문단 앞에 배치했다. 고지 직전 내용도 704 학생의 납부·수령, 705 디지털 노마드 범위, 706 접수증·유효 여권의 실제 여행 조건으로 본문과 연결된다. 실제 마지막 실질 문단은 704 카드 정보·다음 신고 시점, 705 새 거류 사유 승인, 706 귀환일을 포괄하는 서류로 끝난다. 링크 안내만으로 끝내지 않았으며, 일반 고지나 문의 권유를 결말로 대신하지 않았다.
8. Tagalog 기반 Filipino의 설명체다. Cebuano·Malay·Indonesian 혼용이나 필리핀 국적을 일괄 전제한 경로 치환을 찾지 못했다. 영어 공식 제도명과 익숙한 행정 용어는 남아 있으나, 메타데이터·설명 문장은 Filipino다. 장식용 굵은 강조, 본문 H1, 허위 변호사 1인칭·의뢰인 대사, 명령형 체크리스트 제목을 찾지 못했다. 번역투 한 문장은 R4에 제시했다.
9. 법정 주체·기간·금액·URL·가상 이미지 표기를 대조했고 조건 문제는 R1–R3으로 분리했다. 도구가 숫자를 일치시킨다는 이유로 의무/가능·AND/OR·기산점 보존을 승인하지 않았다.

최근 같은 언어 801–803의 도입·제목·실질 결말도 대조했다. 기존 801의 법문 인용 시작, 802의 payslip 세 질문, 803의 실종 신고 조건을 그대로 반복하지 않는다. 기존 세 편의 상담 연락 꼬리를 새 세 편의 마지막 문단으로 복제하지 않았고 706의 연락 문장은 본문의 노동·가족 사건 날짜에 연결했다. 이 텍스트 범위에서는 반려할 단조로움 패턴(MONOTONY)을 발견하지 못했다. 자연스러움 판정은 AI 검토의 한계 안에 있다.

## 실행 증거

```bash
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-fil/704-taiwan-arc-first-application.md src/content/columns-fil/705-taiwan-visa-residence-work-study-family.md src/content/columns-fil/706-taiwan-arc-renewal-changes-reentry.md
```

| 파일 | 문장 | 평균 | CV | 짧은 문장 비율 | 비슷한 길이 3연속 | 시작어 반복 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---|
| FIL704 | 57 | 17.6 | .471 | .105 | .018 | .105 | FAIL 0 |
| FIL705 | 67 | 18.7 | .525 | .134 | .046 | .182 | FAIL 0 |
| FIL706 | 83 | 17.7 | .490 | .133 | .086 | .280 | FAIL 0 |

실행 당시 공유 checker SHA: `79b3e7826fa61e56f919f966d2c5f63ad47eab5f9c1a9a0122aa53c6fd942876`; 확장 모듈: `955835ac6f8cd4cfb25e22e3efc8e59679c031788a86da77c8dd84323017b00e`; FIL profile: `9daca5d186170f2025c576fbba8b65594732ef36f7cfb9a6bee719e091585e76`. 검수자는 도구·임계값·profile을 변경하지 않았다.

`content-audit.mjs --files 'src/content/columns-fil/70*.md' --source-locale en --publication-date 2026-10-25`는 선택 파일 3개, 자동오류 0, 의미검토 7/5/8개를 반환했다. 보고 시각은 `2026-10-25T12:06:16.263Z`, 증거 파일은 `/tmp/tseng-fil-independent-20261025.json`이다. exit 3, `semanticStatus=REVIEW_REQUIRED`, `publicationReady=false`를 자동 통과로 지우지 않았다.

숫자 차이도 문맥으로 읽었다. 704의 `22` 감소는 중복 인용 횟수 차이이고 `30`은 기산의 숫자 표기, `12`는 첫 배우자 카드 상한 근거, `50`은 僑生 감면이다. 705의 `0915/0926`은 안내 번호, `50/20`은 학생 취업 조문과 주당 시간, `9`는 Gold Card 기간 근거다. 706의 `13/8/12`는 가족 연장·특정전문인재·졸업생 조문이다. 세 파일의 추가 `25`는 별도로 기록한 재확인 날짜다. 글자로 쓴 기간도 읽었으며 숫자 토큰의 부재를 0이나 PASS로 취급하지 않았다.

## 직접 출처 확인과 한계

이번 FIL 검수에서 [현행 인재법 제8·15·16·17조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), [NIA0902의 기본·가족 서류와 절차](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), [BOCA의 ARC 신청 기산 FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html), [NIA의 유효 ARC/APRC와 여권 유효기간 FAQ](https://www.immigration.gov.tw/5385/12162/12197/414977/)를 직접 열어 해당 본문을 읽었다. 같은 세션의 선행 독립 검수에서 [학생 납부·수령](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news), [BOCA 어학 요건](https://www.boca.gov.tw/fp-166-285-041cb-2.html), [거류 규칙 제12·20조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129), [해외 카드 분실](https://www.immigration.gov.tw/5385/7229/7232/368785/), [특정 온라인 절차 주의 9](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)도 직접 읽었다. 나머지는 현재 원고·공통 사실표·앞선 source-refresh와 대조했으며 모든 공식 URL을 새로 열었다고 주장하지 않는다.

MOJ 페이지의 자료 정비 기준일은 2026-10-16이다. 이후 관보 전수조사나 각 기관의 실제 접수 결정을 대신하는 검토는 아니다. 원고의 확인일·기관 수정일·게시일을 혼합하지 않았다. 언어를 국적으로 치환하지 않았고 Filipino 상담이나 통역을 제공한다는 약속도 추가하지 않았다.

후속 문맥 확인에서는 이민법 영문 전문의 제31조 제3항을 직접 읽었다. 중·영문 단일조문 URL은 각각 시간초과·접근오류였고, 오류 응답 자체를 검증 근거로 사용하지 않았다.

이 판정은 표의 해시가 가리키는 텍스트에 한정한다. 화면·이미지 실물·FAQ JSON-LD·피드·byline 비노출·canonical/hreflang·최종 배포 commit은 이 독립 검수에서 확인하지 않았다. 원고나 공유 도구를 수정하거나 commit/push/deploy하지 않았다. 수정 후 해시와 의미를 다시 묶고 통합 검증을 거쳐 조정자가 게시 여부를 결정해야 한다.
