# DA 704–706 독립 의미·문체 검수

검수일: 2026-10-25 KST. 검수자 `column_existing_drafts`(AI), 작성자 `column_source_quality`. 검수 대상은 덴마크어 세 편이며 frontmatter·FAQ·본문·표·출처 목록을 모두 읽었다.

판정: 현재 고정 SHA에서 필수 수정할 법률·출처 오류를 발견하지 않았다. 선택 명료화·문체 제안 3건을 아래에 남긴다. 실제 공유 `--lang da` 검사도 세 편 FAIL0이었다. 이는 사람 덴마크어 원어민 또는 변호사의 검수·게시 승인이 아니다.

이 검수에서는 이 파일만 작성했다. DA 원고·저자 보고서·공유 도구를 수정하지 않았다. 별도로 배정받은 FI 작성자 수정과 DA 독립검수는 구별하며, DA 자료에 FI 수정 내용을 덮어쓰지 않았다.

## 읽은 기준과 대상 고정

batch02 BRIEF 및 정본 audit BRIEF, 저장소 EDITORIAL-VOICE·FRONTMATTER, COLUMN-VOICE-RULE, 공유 SENTENCE-VARIETY-RULE와 LESSONS 전문을 이 세션에서 읽고 적용했다. 홈 `~/agent-library/knowledge/editorial-voice.md`는 부재하여 저장소 정본을 사용했다. 폐기된 Fable 의무 절차를 새로 적용하지 않았다.

정본 기준 commit은 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`이다. 같은 세션에서 전문을 읽은 현행 EN/KO/ZH 704–706과 F01–F24를 대조했고, 이번 검수 중 아홉 파일의 SHA를 다시 계산해 읽은 원문과 같음을 확인했다. `reviews/da-author.md`와 현재 DA840·841·842 전문도 읽었다. 기존 DA 글은 문체 비교 자료이며 새 ARC 원고의 법률 출처를 대신하지 않는다.

| 대상 파일 (`src/content/columns-da/`) | 검수 시작·종료 SHA-256 |
|---|---|
| `704-taiwan-arc-first-application.md` | `c94d3cddab3ab1a3707449cf98e251392cca9d6b1d640f1603ac16f8c7deac2e` |
| `705-taiwan-visa-residence-work-study-family.md` | `01ca9fe806e56bb377be8374e83c97ed39849f7e7d238e106991bc4026b461e9` |
| `706-taiwan-arc-renewal-changes-reentry.md` | `97c908a410527c336c7387aa5f153f3fcf2ef58e871ebedbf22f7f020cb512df` |

읽은 `da-author.md` SHA: `c506e7173f3a863bf3bc0516bd53c6f80ca3a5a2157afab70281fa799b7392cc`. F01–F24 SHA: `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145`.

| 정본 | SHA-256 |
|---|---|
| EN704 | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` |
| EN705 | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` |
| EN706 | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO704 | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` |
| KO705 | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` |
| KO706 | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH704 | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` |
| ZH705 | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` |
| ZH706 | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

## 필수와 선택 판단

필수 수정: 발견 없음. 정확한 요약에 더 많은 세부가 없다는 이유만으로 반려하지 않았다. 예를 들어 제15조 배우자 취업허가의 최장기간을 705가 다시 열거하지 않아도, 적격 배우자·승인된 가족거류·직접 신청이라는 본문의 범위는 정확하다. F23은 706의 여행 절차에서 설명하고 705에서 706으로 연결하므로 세 글에 모두 반복하도록 요구하지 않는다.

### O01 — 706 Gold Card 신청 창구의 선택 명료화

- 실제 문장: `Fornyelse af selve Gold Card kan søges fire måneder før udløbet.`
- 판단: `kan søges`는 신청 가능한 시점을 말하며, FAQ1은 이미 `egne firemånedersperioder`라고 설명한다. 정확히 그날 신청해야 한다거나 이후에는 신청할 수 없다는 의무·금지로 쓰지 않았으므로 필수 오류로 판정하지 않았다.
- 제안: `Fornyelse af selve Gold Card kan søges i de fire måneder før udløbet.`
- 의미 보존: [공식 Gold Card 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) 주의사항6의 만료 전4개월 이내라는 창구를 더 직접 표현한다. 이번 검수에서 주의사항6을 직접 확인했다. 같은 단락의 사업종료 경로는 이미 `en tremånedersperiode før udløbet`라고 기간을 명시하므로 별도 수정 사유가 아니다.

### O02 — 705 FAQ3의 가족 행위자 명칭

- 실제 문장: `Familiemedlemmets statsborgerskab og opholdsgrundlag, relationen og ansøgerens indrejsegrundlag indgår i vurderingen.`
- 판단: 질문의 ARC 보유자와 답변의 신청자를 구분해 읽으면 의미가 맞다. 다만 `familiemedlemmet`가 Taiwan의 초청자인지 동반 신청자인지 빠르게 읽을 때 재확인이 필요할 수 있다.
- 제안: `Statsborgerskabet og opholdsgrundlaget for personen i Taiwan, familierelationen og ansøgerens indrejsegrundlag indgår i vurderingen.`
- 의미 보존: 국적·거류지위·관계·입국조건을 모두 남기면서 본문 제목 `Familieophold afhænger af personen i Taiwan`의 행위자 표현과 맞춘다. 현재 본문은 대상·AND/OR가 명확하여 법률 범위 오류로 올리지 않았다.

### O03 — 705 학생 취업 단락의 짧은 부정 반복

- MONOTONY: 연속된 같은 부정 — `Optagelsesbrevet erstatter ikke arbejdstilladelsen. Det gør et studie-ARC heller ikke.` — 두 자료의 동일한 한계를 한 문장으로 연결하는 방향.
- 제안: `Optagelsesbrev og studie-ARC erstatter ikke den nødvendige arbejdstilladelse.`
- 판단·의미 보존: 입학서와 학생 ARC 모두를 남기며, 앞의 실제 업무에 적용되는 규칙·43/50조 출처를 지우지 않는다. 현재 문구도 두 증명서의 서로 다른 오해를 설명하므로 전면적인 단조로움 반려 사유는 아니다. 선택 편집을 적용한다면 문장 리듬 수치를 다시 검사할 필요가 있다.

## 법률·기산·출처 의미 대조

| 범위 | 실제 읽은 조건과 판단 |
|---|---|
| F01–02 / 704·FAQ1 | `opholdsvisum og meddelt opholdstilladelse`, `dagen efter ankomsten/indrejsen`, NIA 신청 의무,30일을 묶어 보존. Taiwan 안에서 비자가 발급된 때는 `visummets udstedelsesdato`부터30일로 표·본문·FAQ에서 구별한다. 방문자에게 추가30일을 주지 않는다. 유효 통합증명의 별도카드 예외도 명확하다. |
| F03 / 704·705 | 전문인재/특정전문인재의 업무허가 OR 면제, 적합한 무비자/방문비자, NIA 승인 후 ARC. 705에 일반적으로 고용주가 신청한다는 주체와 예외·업무별 관할을 유지한다. 제4·5·16조와 시행일2026-01-01, 연혁 링크를 대조했다. |
| F04 / 705 | 일반전문인재는 Taiwan 전문업무 종사, OR 특정전문인재의 두 항목으로 분리했다. `I begge kategorier` 뒤 NIA 거류 OR 영주허가를 요구한다. 특정전문인재 모두에 현재 전문업무를 요구하지 않는 문장도 있다. 배우자·미성년·장애 때문에 자립 불가한 성년자녀만, 가족의 적합한 입국 조건도 유지. `andre voksne børn`이므로 장애 자녀까지 일괄 제외하지 않는다. |
| F05 / 705 | Taiwan 국민 배우자의 실제 Taiwan 거주 AND 호적을 유지. `et gyldigt visum, som tillader mindst 60 dages ophold`이므로 비자 유효기간과 허용체류기간을 혼동하지 않는다. 연장 금지 등 제한 부재도 유지. 이민법23조가 제외하는 초청자 중 취업서비스법46조1항8–10호는 본문에서 명시적으로 ‘예’라 한정했으며 전체 제외조건이라고 주장하지 않는다. 이번 검수의 공식23조 직접 열람과 일치했다. |
| F06–08 / 704 | ARC사진 최근2년, BOCA학생비자사진 최근6개월을 서로 다른 신청의 요건으로 설명하며 동일사진이 둘 다 충족할 수 있다고 명시. 재직·등록 증명 최근1개월, 등록 전 입학서, 해당 학기 등록/학생증, 실제 주소·관계/초청자 신분자료 보존. 모든 초청자 여권을 요구하지 않는다. 해외인증 의무와 NIA 번역 요구 가능성을 구별. Taiwan 거주+호적 배우자, 첫 신청 동행·혼인등록·`højst ét år`를 보존한다. 규칙12조 링크가 해당 기간을 뒷받침한다. |
| F09–10 / 704·706 | NT$1.000/년, 1년미만도1년, 추가NT$2.200, 僑生 한정반액, 일반 교체NT$500. 덴마크의 금액·세금으로 치환하지 않았다. 일반3년, 취업 특정전문인재5년·NIA 승인 다음 날, 정의된 가족범위와 Gold1–3년/제9조를 유지. 높은 납부액만으로 더 긴 허가를 얻지 않는다는 설명도 정확하다. |
| F11–12 / 704 | 일반10근무일은 서류 반환·보완·면담 제외, 보완 후 재기산. 학생5근무일 심사·보완 후 재기산. 학생 승인부터5근무일 이내 납부, 납부 후3근무일에 지정센터 IC수령, 6개월이하 eARC는 납부 후 다운로드·인쇄. 항목의 적용대상이 학생 온라인으로 한정되고 다른 신청자는 자기 안내를 따르도록 되어 있다. |
| F13 / 705·706 | 정규학업의 거류비자·유학목적visitor입국 직접신청과 일반 무비자·도착·타목적비자의 제외를 구별. 언어연수는 올바른 비자+4개월 이수 AND 최소추가3개월 등록, 평일주15시간, 승인결석 포함1/4. 연장은 매회6개월 이하와 총체류·거류 원칙2년을 706에 유지. |
| F14 / 704·705 | ARC가 개별 직무의 취업허가를 대체하지 않는다. Taiwan 호적국민과 혼인하고 거류승인을 받은 외국인의48조 면제, 외국전문인재 배우자에게의 비자동 적용, 적격 특정/고급전문인재 배우자의 가족거류 승인 후15조 직접 신청을 구별. |
| F15–17 / 706·표·FAQ | 일반 연장 만료 전3개월, 주소/근무지 다음날30일,23-1조 대상 이유변경 사건일부터30일NIA, 비대상15일BOCA/분소 후NIA. 긴 기한을 임의 선택할 수 없다고 명시. 계속사업 창업자4개월·사업종료 후 별도3개월, Gold4개월을 구별한다. Gold 문장의 O01은 선택적 명료화다. |
| F18 / 706 | 근거 소멸 시 NIA의 취소 의무와 법정 계속거류 승인 가능성 구별. DV이혼은 Taiwan거주+호적국민의 배우자, 폭력 때문에 이혼, 미재혼을 보존. 자녀는 Taiwan호적 미성년자와 법정 돌봄/친권/면접요건으로 한정. 진행 중 노동사건·치료 중 산업재해를 예외로 설명하되 모든 분쟁의 자동 체류권으로 만들지 않는다. |
| F19 / 706 | `<30일` AND 원래사유 지속, 제재 후 재신청 가능, APRC산정1년공제. `forlænger ikke automatisk den gamle tilladelse`는 종전 허가의 자동연장을 부정하며 새 허가의 기간을 영구히 옛 만료일로 묶지 않는다. |
| F20–21 / 706 | 전문6개월·추가1회·총1년과 졸업1년·추가1회·총2년을 구별. 둘 다 만료전신청·승인·종전만료 다음날을 유지한다. Mandarin 종료만으로 정규졸업 지위가 되지 않는다. 취업면제는 Taiwan associate이상 학위를 취득한 신규졸업자+NIA승인 졸업후 거류연장 기간으로 한정. 모든 구직자로 확대하지 않는다. |
| F22 / 706·FAQ3 | 출국 전에 재입국허가, 일반ARC기간상한·취소연동. 유효여권+APRC의 별도허가 예외를 본문·FAQ 모두 명시. 영수증을 여행증명으로 가정하지 않고 NIA에 실제 여행을 확인. |
| F23 / 706 | 지정 전문인재·가족 온라인 절차에서 `stopper NIA behandlingen`으로 출국 시 심사종료를 서술한다. `kan ... hvis`로 재입국 후 적격일 때 새 신청 가능. 모든 ARC 출국금지로 확대하지 않는다. 출처의 `note 9`는 실제 중문 주의사항(九)와 맞으며, 주의사항7이나 다른 절차의 번호가 아니다. |
| F24 / 704 | 통지 다음 날부터15달력일. 부족·불일치 서류를 국외/본토/HK/Macau에서 받아야 하는 경우3개월. 일반15일에 덧붙이지 않는다고 명시. 기한 내 완전보완 없으면 기각. 일반10근무일 보완 후 재기산을 같은 글에서 유지한다. 단순히 신청자가 해외에 있으면3개월이라는 뜻이 아니다. |

FAQ9개도 각 본문과 대조했다. 첫 카드 기산·요금·취업, 직접신청·언어연수·가족 초청, 연장·변경·귀국증명이라는 정본의 질문 범위를 유지한다. FAQ의 간결한 답변이 본문보다 권리를 넓히거나 의무를 약화한 부분은 발견하지 않았다. 덴마크어 독자를 덴마크 국적자로 단정하는 새 문장도 없다.

## 이번 공식 자료 대조의 범위

공통 facts의 10월25일 직접 확인과 10월24일 조사 기록을 구분하여 사용했다. 이번 DA 독립검수 단계에서는 [이민법23조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23), [창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) 주의사항3·6, [Gold Card 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) 주의사항6을 새로 직접 읽었다. 23조의60일허용체류와 초청자 제외, 창업가4/3개월 및Gold4개월 창구를 확인했다.

[전문인재·가족 온라인 페이지](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)의 이번 재접속은 오류였으나 같은 에이전트가 이번 세션 10월25일 앞서 직접 열람한 공식 본문의 주의사항(九) 전문을 저장된 결과에서 다시 읽었다. 실패한 재접속을 새 성공으로 기록하지 않는다. 중문0902의 F24 역시 같은 세션에 직접 확인한 본문과 현재 공통 표를 사용했다. 다른 공식URL 전체를 이 독립검수 단계에서 다시 열었다거나 10월16일 이후 관보를 전수조사했다는 뜻은 아니다.

## 최근 DA 세 편·문체·실질 결말

최근 글은 `published: 2026-10-24`인 840·841·842다. 실제로 읽은 비교본 SHA는 다음과 같다.

- 840 `danish-company-taiwan-subsidiary-branch-project-office`: `691a8fe1d933aa9eab27d890966e90628c9a34889b9bdf33b6b934b03903dc81`.
- 841 `danish-buyer-taiwan-wind-components-defect-notice`: `3d0a7c73a9e91d319c05c9e5ccf46a976b91454ea080743caab91d572f5651b8`.
- 842 `danish-engineer-taiwan-work-permit-family-residence`: `966aa05b5cb95355c56205d634788bf36657c09cde8ac4e954753b47d7b3b876`.

840은 서비스 계약의 공급자가 누구인가라는 질문, 계약 상대방·자본 소제목, 서비스 의무가 적힌 초안으로 끝난다. 841은 Esbjerg의 가상 부품 검사 장면, 수리 전 상태를 보전하는 소제목, 처음 측정보고서와 연결되는 표본 보관으로 끝난다. 842는 덴마크 시민의90일 입국이라는 숫자, 현장업무·허가·가족 주제, 실제 업무를 덮는 승인과 첫 근무일 대조로 닫는다.

새704는30일 기산 질문,705는 어학비자 선행 필요,706은 이사신고 의무로 시작한다. 전부 같은 가상 장면·국적 장면을 복제하지 않았다. 기존842의 구체적인 국적별 조건을 새 독자에게 자동 적용하지 않는다. 본문은 일관된 표준 덴마크어 `du`와 일반절차 설명을 사용하며, 한국어·네덜란드어 문장 순서를 그대로 복제한 형태는 발견하지 않았다. 인간경험·사례·인간변호사 작성·덴마크어 상담 가능성을 꾸미지 않았다.

첫 두 문단 삭제 시험: 704의 도입에는 두 기산점 질문과 입국다음날 의무, 통합증명 예외·visitor자격이 있다. 705는 어학과 전문업무의 입국 경로 차이 및 국적·여권·공관 조건을 담는다. 706은 변경다음날30일과 다른 기관 신고로의 대체불가, 이후 거류근거 소멸·취소·자료보관을 담는다. 지워도 같아지는 범용 글 예고 도입은 아니다.

고지 직전 실질 결말을 별도로 읽었다. 704는 승인 결정과 카드 만료일을 보관해 다음 신청기간을 준비하는 행위로 닫는다. 705는 새 목적과 실제 적격 증빙의 연결로 닫는다. 706은 카드 만료·변경·출입국 날짜를 같이 놓고 다음 신청을 판단하는 행위로 닫는다. 모두 본문 쟁점에 연결되며 이메일 판촉으로 닫지 않는다. 날짜·범위 고지와 출처목록을 실질 결말로 잘못 채점하지 않았다.

## §5 재확인

| 번호 | 독립검수 결과 |
|---|---|
| 1 | 지원되는 공유 `--lang da`로 직접 실행, 세 파일 FAIL0. 아래 수치와 SHA는 저자 기록을 인용한 것이 아니라 이번 재실행 결과다. |
| 2 | 704 질문/705 구체 선행조건/706 변경의무로 도입 유형을 나눴으며 정형 가상 오프너 없음. |
| 3 | 의미 있는 아주 짧은 문장 각2개 이상: 704 `Godkendelse er nødvendig.`·`Beløbene er i taiwanske dollar.`;705 `Nationalitet og pas har også betydning.`·`Jobtilbuddet er ikke en arbejdstilladelse.`;706 `Kontakt straks NIA.`·`Et erstatningskort forlænger ikke opholdet.` 법적 조건을 삭제해 단문을 만들지 않았다. |
| 4 | 문단 첫 단어를 세로로 추출해 직접 읽음. 704 `for`2회,705 `ved/for/et`각2회,706 `efter/ved/er/et`각2회. 같은 시작 단어3회 없음. |
| 5 | 세 연속 주장→조문→단서 틀 없음. 704 제출기록·보관,705 공관자료,706 제출일 기록 등 인용 없는 실무 단락이 있다. 법적 단정에는 가까운 공식 인용이 유지된다. |
| 6 | 기계 대비0. 부정문은 대부분 적용 제외·기존허가 비자동 연장 등의 필수 범위다. 705 학생자료 부정의 국소 반복만 O03 선택안으로 기록했다. |
| 7 | 위의 세 실질 결말을 고지와 구별하여 읽었다. 706 이메일은 앞의 분쟁 설명에1회이며 가짜 서비스약속·판촉끝맺음 없음. |
| 8 | 일관된 덴마크어 설명. 굵은 장식, 가짜1인칭, 본문H1, 명령형 체크리스트 제목, 공개저자 없음. |
| 9 | 기산·기간·금액·주체·must/may·AND/OR·예외·그림 가상표시·공식URL을 보존했다. 숫자계측보다 조건의 보존을 우선했다. |

## 기계·메타데이터·링크 실측

작업 디렉터리 `/Users/son7/tseng-all-language-columns-20261025/batch02`에서 실행:

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-da/704-taiwan-arc-first-application.md src/content/columns-da/705-taiwan-visa-residence-work-study-family.md src/content/columns-da/706-taiwan-arc-renewal-changes-reentry.md --lang da
```

| 글 | sentences | mean | CV | short | run3 | opener_rep | cite_end | cite_para | contrast/caveat/q | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 704 | 64 | 13.1 | .470 | .234 | .081 | .050 | .000 | .350 | 0/0/1 | FAIL0 |
| 705 | 69 | 13.6 | .472 | .232 | .045 | .130 | .000 | .478 | 0/0/1 | FAIL0 |
| 706 | 82 | 13.2 | .497 | .268 | .037 | .154 | .000 | .462 | 0/0/2 | FAIL0 |

종료0, 각 `OK — no variety limit violated`. 도구 SHA `0ff4f2b8d68a71fc16e1e9505c83ebcc22de0b01ad4742d0ad126bf81220f532`, `profiles/da.json` SHA `d97cb6ecf083d3a000d9e68c9aca35be606afcc262cf676723f9fc06ba3352df`를 직접 확인했다. 휴리스틱 단어·문장 계산이며 문법·법률·원어민 인증이 아니다. 다른언어 대체측정·도구수정은 하지 않았다.

Node v24.14.1과 정본 저장소의 gray-matter로 현재 세 파일을 실제 파싱했다. FAQ각3·audience `[da]`·내부 `legal-ai-assistant`·게시/갱신 `2026-10-25`, 필요한 필드와 번역된 날짜·캡션, 굵은 강조 부재 및 기존 그림 파일 존재를 확인했고 오류0이었다.

EN 외부 공식URL 집합과 대조한 누락은0: 704 원문9/DA13,705 원문15/DA15,706 원문13/DA14. 새DA3편 상호링크와 실제EN 배우자/Gold/APRC 원고 파일이 존재하며, 영어 글에는 언어 표시가 있다. 이 확인은 신규 DA URL이 운영에 배포됐다는 확인을 뜻하지 않는다.

보고서 저장 후 원고3편과 저자기록의 해시를 다시 계산하여 위 고정값과 동일함을 assert로 확인했다. 선택 제안을 적용할 경우 새 SHA와 검사 결과를 남기면 된다. 이번 독립검수 범위에서 통합을 막을 필수 오류는 발견하지 않았으나, 공개 렌더링·배포·사람 전문 검토는 별도다.
