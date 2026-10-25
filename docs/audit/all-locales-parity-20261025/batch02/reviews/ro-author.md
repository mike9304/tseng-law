# Romanian ARC 704–706 — 작성자 자체 검수

작성·직접 검수: 2026-10-25 KST, /root/column_deploy. 표준 루마니아어 원고 3편을 batch02 외부 작업 폴더에 작성했다. 이 문서는 작성자의 의미·문체 점검이며, 독립 검수·인간 원어민 검수·변호사 승인·실제 배포를 뜻하지 않는다.

## 대상과 최종 SHA-256

기준 루트 R은 `/Users/son7/Projects/tseng-law-all-locales-20261025`, 원고 루트 B는 `/Users/son7/tseng-all-language-columns-20261025/batch02`다. 아래 경로는 B 기준이다.

| 원고 | SHA-256 |
|---|---|
| src/content/columns-ro/704-taiwan-arc-first-application.md | 15d32900d2bf701fc6b9900d0f8e4cfce447495629d9b658e6d1973a69374b4b |
| src/content/columns-ro/705-taiwan-visa-residence-work-study-family.md | 3e999c705f6a2cfca52dc7eea0453b9515e1e1d2bd2ccdb216b76594f2720230 |
| src/content/columns-ro/706-taiwan-arc-renewal-changes-reentry.md | 1d39394a43fb41b390ff7483caca02d0bcbfa2cb8eb8b8664bb0a5bc04a3d635 |

R에는 원고를 복사하지 않았다. 이 작업의 쓰기 범위는 위 3편과 이 보고서뿐이다. 다른 작성자의 원고·검수 문서·공용 검사기를 수정하지 않았고 commit, push, 배포, 인프라 변경을 실행하지 않았다.

## 읽은 규칙·기준 원고

B/BRIEF.md, R의 ARC BRIEF, AGENTS.md, docs/columns/EDITORIAL-VOICE.md, FRONTMATTER.md, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, LESSONS.md를 전문으로 읽었다. 홈의 `agent-library/knowledge/editorial-voice.md`는 해당 경로에 없어서 BRIEF가 지정한 저장소 정본을 사용했다. 없는 파일을 읽었다고 주장하지 않는다. 폐기된 Fable 고정 게이트는 적용하지 않았다.

현행 EN/KO/ZH 704–706 아홉 편, R/docs/audit/codex-column-recheck-20261024/research/source-refresh.md, 공통 research/arc-source-facts.md 전문을 대조했다. 첫 배치의 독립 검수 지적 중 F04, 첫 배우자 카드 기간, F23, 통상 고용주 신청, 장애 성년 자녀 제외 오류, 보완기간, 원본 반환·통합증명 면제 강도를 확인했다. 반려 초안은 번역 기준으로 쓰지 않았다.

| 기준 | 704 | 705 | 706 |
|---|---|---|---|
| EN | 610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f | 87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304 | 1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71 |
| KO | cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1 | 727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a | 4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc |
| ZH | 0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468 | 290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3 | 4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c |

공통 facts SHA-256: `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145`. 10월 24일 source-refresh SHA-256: `a33d5bd1439879bc7461755c3b6793f4942ec161454032dcb8cde1c4d52a6983`.

직접 안내는 `ați`, `solicitați`, `păstrați`, `comunicați` 등 복수 존칭을 썼다. ș/ț를 쉼표 아래 문자로 유지하고 cedilla Ş/ş/Ţ/ţ는 쓰지 않았다. Romanian 독자를 루마니아 국적자라고 가정하지 않는다. 루마니아법·EU법·아포스티유 수용·루마니아어 상담 제공·실제 의뢰인 경험을 새로 만들지 않았다.

## 공식 자료 재열람과 범위

이번 RO 작업 중 아래 공식 본문을 실제 다시 열고 해당 규정을 읽었다. URL만 접속하고 사실 확인이라고 기록하지 않았다.

| 공식 자료 | 직접 대조한 사항 |
|---|---|
| [BOCA 국내 거류비자 발급 FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) | 국내 발급일로부터 30일과 입국 다음 날부터 30일을 구분. 704에 추가된 출처. |
| [NIA 0902 영문](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) | 서류·사진·최근 1개월 증명·원본 반환·해외 인증/번역 강도·배우자 출석·일반 심사. 수정일 2026-04-14 확인. |
| [NIA 0902 중문](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/) | 통지 다음 날부터 15일, 해당 지역에서 자료 발급 필요 시 3개월, 불완전 보완 기각. 704에 추가된 출처. 수정일 2026-01-19는 영문 날짜와 구별. |
| [NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | 방문비자·무비자 직접 신청 대상 및 제한. 수정일 2026-04-14 확인. |
| [NIA 학생 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news) | 5근무일 심사/보완 후 재계산, 승인 후 5근무일 납부, 납부 후 3근무일 IC 수령, 6개월 이하 전자 ARC, 어학 연장 한도. 2026-08-28 수정일도 확인. |
| [거류 규칙 중문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) | 7·9·11·12·20조의 기산점·기간·최초 배우자 상한·재입국. 704에 추가된 출처. |
| [이민법 중문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132) | 31조 사유 소멸·조건부 계속거류·초과거류, 34조 재입국. |
| [인재법 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295) | 12조 졸업생 면제, 14–17조 원격업무·배우자 취업·가족 초청·추가 거류. |
| [NIA 전문인재·가족 온라인](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) | 주의 9항 출국 시 심사 종료, 재입국 후 2항 자격을 갖춘 경우 재신청 가능. 706에 추가된 출처. |
| [BOCA 어학 거류](https://www.boca.gov.tw/fp-166-285-041cb-2.html) | 이수 4개월+최소 3개월 등록, 주중 주 15시간, 휴가 포함 결석 1/4 이하. |
| [NIA 창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) | 독립 검수 M01 반영 때 주의 3·6항을 다시 직접 읽었다. 계속사업 4개월과 사업 종료 후 별도 신청의 만료 전 3개월 이내 창구를 구별했다. 안내 수정일 2025-02-17도 확인. |

나머지 URL은 현행 기준 원고·10월 24일 source-refresh·10월 25일 공통 facts 및 같은 세션의 앞선 ARC 조사와 대조했다. 모든 URL의 모든 세부 공지를 RO 작업에서 전수 재열람했다는 뜻은 아니다. 인재법 시행연혁의 2026-01-01은 source-refresh의 시행명령 확인 기록을 사용하며 이번 RO 작업에서 연혁 원문을 새로 확인했다고 주장하지 않는다. MOJ 정비 기준일 2026-10-16 이후 10월 17–25일 관보 전수조사는 하지 않았다.

## 법률 조건 자체 대조

| 사실표 | 원고에서 보존한 적용 범위·강도 |
|---|---|
| F01–F02 | 704 첫 두 문단에서 거류비자+거류허가 후 입국 다음 날 30일 의무와 대만 내 비자 발급일부터 30일을 구분. 유효 통합증명은 `sunt scutiți`로 별도 신청 면제. |
| F03 | 704·705 직접 신청은 적격 전문인재·특정전문인재의 실제 전문업무, 취업허가 OR 적용 가능한 면제, 무비자/방문비자 입국 및 NIA 승인. 취업 제안이 허가는 아님. 통상 신청 주체는 고용주. |
| F04 | 705에서 `일반 전문인재 AND 대만 전문업무` OR `특정전문인재`를 분리하고, 둘 모두 NIA 거류 OR 영주거류 승인을 요구. 특정전문인재에게 전문업무 요건을 일률 추가하지 않음. 가족은 배우자·미성년 자녀·장애로 자립 불가능한 성년 자녀. 부모와 그 요건 없는 성년 자녀만 제외. |
| F05 | 705 배우자 경로는 대만 거주+호적등록 국민, 유효 방문비자가 허용하는 체류기간 60일 이상, 제한 없음. 비자 자체의 유효기간 60일로 바꾸지 않음. |
| F06–F07 | 704 사진 2년, 취업·재학 증명 최근 1개월, 등록 전/후 서류 구분, 실제 주소, 원본 확인 후 반환. 가족의 관계·적절한 초청자 증명이며 초청자 여권을 보편 필수로 만들지 않음. 해외 인증 의무와 NIA가 중국어 번역을 요구할 수 있다는 강도 구별. |
| F08 | 704 대만 거주+호적등록 국민 배우자의 첫 가족 거류, 동행·혼인등록 및 `cel mult un an`. EN의 고정 1년처럼 읽히는 표현 대신 KO/ZH·법규의 최장 1년을 보존. |
| F09–F10 | 연 1.000 NT$, 1년 미만도 연간요금, 해당 무비자/방문비자 신청 2.200 NT$ 가산, 僑生만 50% 감면. 706 재발급 500 NT$. 일반 최장 3년, 적격 특정인재 최장 5년은 NIA 거류승인 다음 날 기산. 705 Gold Card 1–3년. 기간 구매로 표현하지 않음. |
| F11–F12 | 704 일반 심사 10근무일에서 반환·보완·면담 제외, 보완 후 재계산. 학생 심사 5근무일, 승인 후 납부 5근무일, 납부 후 IC 수령 3근무일, 전자형 6개월 이하를 각각 구별. 모든 신청자 일정으로 확대하지 않음. |
| F13 | 705 정규 유학 해외 비자/적격 유학 목적 방문비자 직접 경로 구별. 어학 4개월 이수+최소 3개월 계속 등록, 주중 15시간, 휴가 포함 결석 1/4 이하. 무비자·도착비자·다른 목적 입국의 일반 전환 불가. |
| F14 | 실제 직무·고용주에 허가 OR 면제 필요. 대만 호적 국민 배우자+거류허가의 취업서비스법 48조 면제와 전문인재 배우자 규칙 분리. 특정·고급 전문인재 배우자는 NIA 가족거류 승인 후 노동부 직접 허가 신청 경로, 허가기간은 가족거류 기간 이하. |
| F15–F16 | 706 일반 연장 만료 전 3개월. 주소/업무 장소 변경은 다음 날부터 30일. 23-1조 사유 변경은 발생일부터 30일 NIA; 그 밖은 발생일부터 15일 BOCA 후 NIA. 서로 선택 가능한 기한으로 쓰지 않음. |
| F17 | 사업 유지 창업가·금카드 갱신의 만료 전 4개월과 사업 종료 후 별도 3개월 경로 구별. 일반 연장·17조 추가 거류와 혼동하지 않음. |
| F18 | 706 사유 소멸 시 NIA 거류허가 폐지·카드 말소. 사망·진행 중 노동쟁송·산재 치료, 가정폭력 이혼 후 재혼 없음·대만 국민 거주/호적, 미성년 자녀의 대만 호적등록 및 해당 돌봄/권리의무/교류 조건을 유지. 조건부 허용이며 자동 권리가 아님. |
| F19 | 초과거류 30일 미만 AND 원래 사유 계속, 처벌 후 재신청 가능. 영주거류 기간 계산에서 1년 공제. 기존 허가 자동 연장·무불이익 유예라고 하지 않음. |
| F20–F21 | 전문인재는 만료 전 신청, 승인 시 종전 ARC/금카드 만료 다음 날 6개월+추가 1회, 합계 1년. 적격 졸업생은 1년+추가 1회, 합계 2년. 대만 전문학사 이상+당해 졸업생+NIA 연장 승인 기간에 12조 취업면제; 예정자/단순 어학 수료와 구별. |
| F22 | 일반 재입국허가는 출국 전 필요, ARC 유효기간 이하이며 말소 연동. 영주거류 승인자는 유효 여권+APRC 예외. 접수증·사진을 여행문서로 만들지 않음. |
| F23 | 706 해당 전문인재·가족 온라인 절차에서 출국 시 `examinarea cererii încetează`. 재입국 뒤 2항 자격 충족 시 새 신청 가능. 모든 ARC 출국 금지나 재입국 보장으로 확대하지 않음. |
| F24 | 704 일반 보완은 통지 다음 날부터 15일. 해당 지역에서 자료 발급 필요 시 3개월이며 15일에 더하는 기간이 아님. 기한 내 미보완/불완전 보완 시 기각. 보완 통지가 체류 연장은 아님. |

705의 nomad·working-holiday는 국적·자격별 경로이며 모든 루마니아어 독자에게 허용된다고 하지 않았다. 각 편의 구조적 고지는 중국대륙·홍콩·마카오 주민 및 대만 무호적 국민의 별도 체계를 유지한다. 제목·요약·FAQ 9개도 본문 적용범위를 넓히지 않는지 함께 읽었다.

## 실제 문장 수정 기록

| 초고의 문제 문장 | 이유 | 실제 수정 | 의미 보존 |
|---|---|---|---|
| 704 `Limba unui document nu dovedește țara în care a fost emis.` | 작성 지침처럼 들리고 독자의 다음 행동이 흐림. | `Comunicați reprezentanței instituția emitentă, limba actului și scopul folosirii lui în Taiwan.` | 발급지 관할 공관·인증과 언어 구별을 유지하고 제출정보를 구체화. 국적 가정 없음. |
| 705 FAQ `Orice titular de ARC poate permite soțului sau soției...` | ARC 소지자가 허가권자인 듯한 동사. | `Faptul că am ARC este suficient pentru ca soțul sau soția să ceară rezidența familială?` | 답변의 국적·체류자격·가족관계·입국조건 및 일부 제외 유지. |
| 705 `Limba în care pregătiți documentele nu înlocuiește aceste informații.` | 앞의 국적·여권·입국제도 확인을 반복하는 편집 메타 설명. | 문장 삭제. | 해당 실질 조건과 관할 공관 문장은 보존. 삭제한 법률 조건 없음. |
| 705 `Scopul venirii schimbă procedura disponibilă.` | 첫 문단의 학생/전문인재 비교를 추상적으로 재요약. 삭제 검사에서 새 정보 없음. | 문장 삭제. | BOCA 제한·16조 허용 및 출처는 그대로. |
| 705 `Profesionistul străin sau profesionistul străin din categoria specială care...` | 관계절이 뒤 범주에만 붙는 것으로 읽힐 여지. | `Profesioniștii străini, inclusiv cei din categoria specială, care... pot...` | F03 전문업무+허가/면제 조건을 양쪽에 명확히 적용. F04 가족 초청의 서로 다른 구조는 수정하지 않음. |
| 706 제목 `situația din spatele ARC` | 추상적 비유로 대상이 흐림. | `Prelungirea ARC, mutarea și revenirea în Taiwan` | 실제 연장·주소·재입국 쟁점 유지. |
| 706 `în timpul unui litigiu de muncă aflat în procedură împotriva...` | 번역투인 절차 표현. | `pe durata procedurii într-un litigiu de muncă cu un angajator taiwanez` | 쟁송 진행 중·대만 고용주 요건 유지. |
| 706 `străinul căsătorit... dacă străinul nu s-a recăsătorit` | 이혼 후 예외에서 현재 혼인 상태처럼 읽힘. | `străinului divorțat de un cetățean taiwanez... dacă străinul nu s-a recăsătorit` | 가정폭력으로 인한 이혼·대만 거주/호적·재혼 없음 유지. |
| 706 `copii minori înregistrați în Taiwan` | 일반 등록인지 호적등록인지 모호. | `copii minori cu înregistrare în registrul gospodăriilor din Taiwan` | 법정 대만 호적의 범위를 명시. 이 예외와 앞의 가정폭력 이혼 예외를 별도 문단으로 분리, 조건 삭제 없음. |
| 706 `Numărul dosarului dovedește depunerea.` | 접수번호만으로 어떤 증명력을 보장하는 듯하고 앞 문장 반복. | NIA에 사건번호와 출국·귀환일을 알려 필요한 여행문서 지침을 받는 문장으로 통합. | 접수증 비대체 원칙·NIA 확인·실제 여행일 보존. |
| 706 끝 문단 `Pentru o primă solicitare...` | 문단 첫 단어 Pentru가 세 번 반복. | `La prima solicitare...` | 두 내부 링크 및 실제 귀환일과 유효기간 비교 내용 전부 보존. |

문장 수치를 통과시키려고 법적 조건·출처를 삭제하거나 검사 도구를 수정하지 않았다. 첫 유효 RO 검사부터 세 편 모두 통과했으며, 이후 변경은 위 구체적인 의미·문체 이유로 수행했다. 704·705 출처 목록에 원문에 있던 NIA 2026-04-14·2026-08-28 수정일을 보존했고, 추가 중문 자료의 2026-01-19와 원고 확인일 2026-10-25를 구별했다.

## 독립 검수 M01·S01·S02 반영

2026-10-25 22:01–22:02 KST에 `reviews/ro-independent.md`의 필수 1건과 선택 2건을 실제 문맥·출처와 대조한 뒤 수정했다. 독립 검수 원문은 편집하지 않았으며 SHA-256 `4eeb2e818ccf9de8799341fdac1f99652c3e7c96a82c4f6bd329e51df16cb894`가 수정 전후 같다. 아래는 작성자의 변경 반영 기록이며 독립 재검수 승인으로 부르지 않는다.

| 항목 | 수정 전 실제 문장 | 실제 수정 | 이유와 보존한 의미 |
|---|---|---|---|
| M01 · 706 | `Același ghid are o cale distinctă, cu trei luni înainte de expirare, pentru continuarea rezidenței după încetarea afacerii.` | `Același ghid prevede o cale distinctă pentru continuarea rezidenței după încetarea afacerii. Cererea poate fi depusă în cele trei luni anterioare expirării rezidenței actuale.` | `cu trei luni`의 특정 시점처럼 읽히는 표현을 신청 가능한 3개월 기간으로 고쳤다. `poate`로 신청 가능성을 유지하고 만료 후 유예·자동 승인을 만들지 않았다. 바로 앞 계속사업 창업가와 뒤 Gold Card의 각 4개월은 그대로다. NIA 주의 6항을 실제 재열람했다. |
| S01 · 705 | `Un străin căsătorit cu un cetățean taiwanez cu înregistrare în registrul gospodăriilor, căruia i s-a aprobat rezidența, beneficiază de scutirea de permis prevăzută de articolul 48.` | `Un străin căruia i s-a aprobat rezidența și care este căsătorit cu un cetățean taiwanez înscris în registrul gospodăriilor beneficiază de scutirea de permis prevăzută de articolul 48.` | 거류 승인을 받은 주체가 외국인임을 주어 바로 뒤에서 밝혔다. 외국인 승인 거류 AND 대만 호적 국민과 혼인의 두 조건, 48조 링크와 뒤의 외국 전문인재 배우자와의 구별은 모두 유지했다. 표에서 링크 표시만 생략했으며 원고 링크는 같다. |
| S02 · 704 | `Mesajul unui intermediar că „actele au fost trimise” nu înlocuiește dovada primirii de către NIA.` | 이 마지막 문장만 삭제했다. | MONOTONY의 반복되는 비대체 설명을 줄였다. 앞의 접수번호·제출사본 보관과 보완 통지의 부족 서류·기한 안내를 전부 남겼다. 가상 중개자 발언을 덜었으며 법적 의무·조건·숫자·출처를 삭제하지 않았다. |

이 세 변경 외에 원고를 고치지 않았다. 변경 전후 frontmatter는 바이트 단위로 같고, 공식 URL 집합도 704/705/706 각각 12/15/14개로 동일하다. EN 공식 URL 누락은 모두 0이다. gray-matter로 audience `[ro]`, 내부 author `legal-ai-assistant`, FAQ 각 3개, published/lastmod `2026-10-25`, topic `visa`를 다시 확인했다. 이미지 경로와 public 파일, NFC·줄 끝 공백 없음·본문 H1 및 굵은 강조 없음도 확인했다. 변경한 세 문장과 해당 문단을 다시 읽어 §5의 법률 의미 우선 조건을 점검했고, 32단어 이상 문장이 같은 문단에 두 개 이상인 곳은 여전히 0이다.

## 최근 RO 세 편과 도입·결말 비교

R의 다음 세 편 전문을 읽었다. 이 비교는 기존 글의 법률 정확성이나 공개 화면 재승인이 아니다.

| 기존 글 | 실제 도입·구조·마무리 | SHA-256 |
|---|---|---|
| 882-romanian-exporter-taiwan-unpaid-panel-invoices.md | 목재 패널 미지급 송장의 가상 장면, 청구 상대·기한·지급명령·재산, 끝은 송장·인수자료·포장 사진. | 5f8032f66cf7ee8f9d13c7905f04cb9cb5d0220d921dd6acae469b72648ac896 |
| 883-romanian-professional-taiwan-work-permit-residence.md | 루마니아 여권과 무비자 입국 질문, 전문직·금카드·ARC·가족, 끝은 가족의 이동과 근무 시점. | e685fbbd504596a4ed146ccaddff543dd89cec2a058c04afc8f90aff79758c52 |
| 884-romanian-visitor-taiwan-traffic-injury-return-home.md | 사고 후 경찰자료 7일 기준, 치료·보험·청구·귀국, 끝은 사건번호·연락 창구·자료 전달. | 278b8cfcfdb6d3e54ba400868a00a72b1f0be4ceacc3823565973ad4c366d8cf |

새 704는 최초 신청 의무와 두 기산점, 705는 입학허가만으로 무비자 전환이 안 되는 구체적 제한, 706은 사유가 사라졌을 때 카드 만료일까지 체류할 수 있는지 묻는 질문으로 시작한다. 세 편의 도입 유형은 각각 기한·의무 사실 / 실제 자격 오해 / 독자의 질문이다. 가상 장면을 새로 만들지 않았다. 883과 전문직 법령은 겹치지만 국적별 입국 안내나 가족 이동 일정으로 끝내는 틀을 복제하지 않았다.

각 글의 소제목은 704의 서류·인증·수령, 705의 업무·학위·어학·가족 자격, 706의 사건별 기한·사유 소멸·분실·여행을 따른다. 마지막 실질 문단은 각각 발급정보와 보관 자료 / 새로운 활동의 시작일과 승인 / 실제 귀환일과 유효 문서로 끝난다. 출처일·적용범위 고지와 공식 출처 목록은 구조적 꼬리로 구별했다.

첫 두 문단을 한 문장씩 삭제해 본 결과:

| 원고·문단 | 문장별 정보 손실 또는 실제 삭제 |
|---|---|
| 704 P1 S1–S4 | S1 삭제 시 거류비자+허가 전제와 30일 의무, S2는 입국 다음 날 기산, S3는 NIA 신청 주체·22조 출처, S4는 통합증명 면제가 사라진다. 네 문장 유지. |
| 704 P2 S1–S2 | S1은 국내 비자 발급일 기준, S2는 날짜를 확인할 실제 문서와 접수 마감 계산을 제공. 유지. |
| 705 P1 S1–S3 | S1은 입학허가만으로 무비자 전환 불가, S2는 BOCA의 해당 보통 절차 제한·공식 근거, S3는 적격 전문직의 다른 경로·16조 근거. 추상 요약이었던 옛 S4는 실제 삭제. |
| 705 P2 S1–S2 | S1은 국적·사용 여권·입국 제도라는 판단자료, S2는 담당 공관이라는 문의 주체. 언어와 국적에 관한 옛 S3는 중복으로 삭제. |
| 706 P1 S1–S3 | S1은 실제 종료 사건과 인쇄된 만료일의 관계라는 질문, S2는 NIA의 폐지·말소 효과와 법적 근거, S3는 조건부 계속거류 예외. 각각 유지. |
| 706 P2 S1–S4 | S1은 사건일이 만료일 전에 기한을 만들 수 있다는 사실, S2는 사건일 기록 보관, S3는 종료·졸업·가족·주소별 증거, S4는 NIA의 신청유형별 증빙 근거. 유지. |

## 문장 다양성 §5와 실제 검사

처음에는 공유 검사기에 `--lang ro`가 없어 invalid choice, exit 2가 발생했다. 그 결과를 PASS로 기록하거나 ko/en으로 우회하지 않았다. 도구 담당의 RO 프로필 공유 설치 통지를 받은 뒤 올바른 언어로 다시 실행했다. 아래는 독립 검수 지적을 반영한 최종 원고에 대한 2026-10-25 22:01 KST 재실행 결과다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check \
  /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-ro/704-taiwan-arc-first-application.md \
  /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-ro/705-taiwan-visa-residence-work-study-family.md \
  /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-ro/706-taiwan-arc-renewal-changes-reentry.md --lang ro
```

| 원고 | sentences | mean | cv | short | run3 | opener_rep | cite_para | q | exit / FAIL |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 64 | 15.1 | 0.489 | 0.234 | 0.048 | 0.050 | 0.300 | 0 | 0 / 0 |
| 705 | 67 | 16.5 | 0.491 | 0.194 | 0.031 | 0.095 | 0.571 | 1 | 0 / 0 |
| 706 | 81 | 16.0 | 0.481 | 0.173 | 0.114 | 0.074 | 0.444 | 1 | 0 / 0 |

모두 `OK — no variety limit violated`. 세 편의 cite_end·contrast·caveat는 모두 0. 검사기 SHA-256은 `0ff4f2b8d68a71fc16e1e9505c83ebcc22de0b01ad4742d0ad126bf81220f532`, profiles/ro.json은 `1fe2c5bb725e55a8aa38fcaafc0f52fc43d729c54fa9dfaaab5a6aafddee1474`다. 프로필은 새 AI 작성 중립 계약이며 파일의 review_status가 남아 있다. 주 담당의 회귀 검증 통지와 별개로 이 작성자는 원어민 검증이나 새 프로필의 완전성을 주장하지 않는다.

| §5 | 자체 확인 |
|---|---|
| 1 | 정확한 RO 프로필로 세 실제 파일 FAIL 0. 미지원 결과를 통과로 처리하지 않음. |
| 2 | 공식 가상도입 없음. 세 편 도입 유형이 다르고 최근 882–884의 장면/여권 질문/사고 일정 도입을 복제하지 않음. |
| 3 | 704 `Adresa trebuie dovedită.`, `NIA stabilește durata.`; 705 `Oferta acceptată nu autorizează munca.`, `Plata cursului nu dovedește prezența.`; 706 `Păstrați actul care o consemnează.`, `Vechiul drept de muncă nu se prelungește automat.` 등 짧은 사실 문장 각 2개 이상. RO의 32단어 이상 긴 문장이 한 문단에 둘 이상인 곳은 0. |
| 4 | 문단 첫 단어를 세로로 확인. 최다 동일 첫 단어 각 2회. 연속 문장 동일 시작은 0/0/2로 확인. 뜻을 줄이지 않고 706 마지막 연결문 첫머리를 수정. |
| 5 | 조문-주장-단서의 같은 세 문단 연쇄 없음. 주소증명·접수기록·현재 문서 준비 등 인용 없는 실무 문단이 있음. 법률 명제의 공식 링크를 유지. |
| 6 | 자동 대비틀 검출 0이며, 실제 학생/전문직·비자/거류·접수증/여행문서의 필요한 구분을 직접 읽음. 원고 밖 주장을 꾸며 반박하지 않음. |
| 7 | 실질 결말이 카드 확인 자료/새 활동 승인일/귀환 문서로 끝남. 홍보 결말 없음. 706의 원문 이메일 안내는 본문 중 해당 분쟁 맥락에서 1회, 언어 서비스 약속 없음. |
| 8 | KO/JA 문체 항목은 비해당. RO 복수 존칭 유지. 굵은 강조·공개 byline·지어낸 1인칭·명령형 체크리스트 제목 없음. 704 본문 질문 0은 기한·문서·수령을 직접 설명하기 위한 구성이고 FAQ 3개가 독자 질문을 담당한다. |
| 9 | EN의 공식 URL 누락 0. F01–F24·숫자·예외·허가 주체·이미지/가상 캡션을 함께 대조. 수치 통과를 위해 조건을 삭제하지 않음. |

## 콘텐츠 검사·숫자 차이와 인계 한계

R의 `docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs`를 읽기 전용으로 import해 `auditBatch`를 실행했다. repoRoot=R, contentRoot=B/src/content, files=위 세 절대경로, sourceLocale=en, sourceMap=`ro:<full-slug>`에서 R의 해당 EN 파일로 명시 매핑, publicationDate=2026-10-25를 사용했다. R의 내용 디렉터리로 복사하거나 파일을 수정하지 않는다. Node는 `/Users/son7/.nvm/versions/node/v24.14.1/bin/node`다.

검사기 SHA-256 `eea579eedf007e403209d59f2089b7f2d1e465c03294df9bad5f50c24b4a8b03`. 최종 실행시각 `2026-10-25T13:02:09.760Z`, 프로세스 exit 0, 결과 `automatedStatus=PASS`, `errors=0`, `reviewItems=19`, `semanticStatus=REVIEW_REQUIRED`, `publicationReady=false`다. export 함수 호출의 exit 0을 CLI 의미검토 완료로 오해하지 않는다.

수정 후 첫 재실행에서는 호출자가 sourceMap 키를 절대경로로 잘못 넣어 EN 기준 미해결 3건으로 exit 1이 났다. 원고나 검사기를 바꾸지 않고 문서화된 `ro:<full-slug>` 키로 바로잡은 위 실행에서 오류 0을 확인했다. 별도 긴 문장 확인의 첫 임시 호출도 `strip_fm`의 tuple 반환을 문자열로 넘겨 중단됐고, 올바른 본문 문자열로 재실행해 위 §5 수치를 확인했다. 실패한 호출을 통과로 계산하지 않았다.

19개 검토 표식은 글마다 public-output/native-prose, title-summary-faq, legal-conditions, numbers-dates-currencies, nationality-jurisdiction의 5개씩과 추가 URL 4개다. 추가 URL 4개는 위 표에서 직접 재열람한 BOCA 국내 발급·중문 거류규칙·중문 0902·전문인재 온라인 절차다. 나머지 의미 항목은 이 문서에 작성자 대조를 남겼다. 공개 출력·독립 원어민 판단은 이 작업으로 완료하지 않았다.

숫자 토큰 차이는 문맥으로 확인했다. `1,000/2,200`은 RO의 `1.000/2.200`으로 천 단위 표기만 바뀌고 통화 NT$ 유지. 확인일·초안 게시일은 24→25일이며 원 법 시행일을 바꾼 것이 아니다. 704에 보완 15일·僑生 50%·최초 배우자 규칙 12조·중문 자료 수정일 19일이 명시되었다. 705의 23조·16조 2항·Gold Card 9조, 706의 졸업생 12조·온라인 안내 9항 등 추가 인용을 확인했다. EN보다 22/16/31조가 적게 반복 검출되는 것은 반복 인용 횟수 차이이며 해당 법적 내용을 삭제하지 않았다. `unu`, `trei`, `cinci`, `șase`, `zece` 같은 글자로 쓴 기간도 직접 대조했고 숫자 토큰 배열만으로 일치 판정을 내리지 않았다.

세 편 모두 등록 locale `ro`, audience `[ro]`, 내부 `author: legal-ai-assistant`, FAQ 각 3개, 일반 법률안내 category 및 visa topic을 사용한다. EN 원본 이미지 세 경로가 같고 R/public에 존재한다. 캡션은 모두 `Scenă fictivă`, alt는 장면만 기술한다. 미디어 SHA는 순서대로 `e33f7f381d597a9ae5b3693d7c4f887a29d7420b1b4ae3c98db664a06dceae31`, `0f9d9a4041f5978119b71a6c89ba1a9b01e2643871143163a4bc4d8f792a7e84`, `9933406b2c0c64af337aaf443c6c5e1ed4afb94e9ed7ab5a5e3635a2b940f16f`다. 이미지를 새로 만들거나 편집하지 않았다.

공식 URL 수는 12/15/14, EN 공식 URL 누락은 각각 0. 내부 링크는 글마다 같은 배치의 정확한 RO ARC 나머지 두 경로만 사용한다. 원고 NFC 정규화·줄 끝 공백 없음도 확인했다. 이 링크 검사는 준비된 파일의 존재이며 RO 공개 URL의 HTTP 200을 뜻하지 않는다.

독립 AI 의미·문체 검수 결과와 그 지적 반영은 위에 구분했다. 남은 한계는 이 변경분의 독립 재확인, 인간 원어민·변호사 판단, root 통합 후 실제 렌더링/HTML·JSON-LD·목록·피드의 byline 비노출, 검색·내부 링크·공개 페이지 확인이다. 현재 세 원고는 외부 초안이므로 릴리즈 빌드나 배포를 수행하지 않았다. 최종 게시일이 달라지면 root가 날짜와 관련 검사를 갱신해야 한다. 이 3편 또는 batch02를 49개 언어×최소 286편 목표의 완료로 보고하지 않는다.
