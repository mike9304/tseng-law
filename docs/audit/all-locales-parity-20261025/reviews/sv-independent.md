# SV 704–706 독립 의미·문체 검수

검수일: 2026-10-25 KST. 검수자: `column_voice_rules` AI 에이전트. 작성자는 root이며, 이 검수자는 원고를 수정하지 않았다. 산출물은 이 보고서 하나다.

판정: `REQUEST_CHANGES`. 705의 가족 경로 조건과 수동태, 704의 재학증명 발급 시점 표현, 706의 특정 온라인 경로 출국 효과를 고쳐야 한다. 705는 실제 스웨덴어 문장 다양성 측정에서도 FAIL이다. 이 필수 항목을 고친 뒤 새 SHA로 재검수가 필요하다. §3의 정확한 요약에 대한 수치·범위 추가는 선택 보완이며 출고 차단 사유로 삼지 않는다.

이 결과는 AI의 법문 대조와 편집 검수다. 스웨덴어 원어민, 스웨덴·대만 변호사 또는 기관의 승인이라고 표시할 수 없다. 스웨덴어 법률용어의 관용성·독해 자연스러움에는 판단 한계가 있다. 이 검수자는 task-local 다양성 도구의 확장 구현도 담당했으므로, 도구 자체에 대한 독립 검증을 했다는 뜻도 아니다.

## 1. 고정 원고와 대조 자료

다음 SHA-256의 원고를 읽었으며, 측정·링크 확인 때도 같은 SHA였다. 줄 번호는 이 버전에 한정한다.

| 원고 | SHA-256 |
|---|---|
| `src/content/columns-sv/704-taiwan-arc-first-application.md` | `b7a77b0956b4719d560e3f50460ac3b6ae91c842634bafd718075b7ac03679ce` |
| `src/content/columns-sv/705-taiwan-visa-residence-work-study-family.md` | `710a1991f0fa274be5c4b609a031db052b01fea6af6ee6747a32d68ffcc9ae30` |
| `src/content/columns-sv/706-taiwan-arc-renewal-changes-reentry.md` | `f707917b14e7e1c63fb56e4ba572c0201b98c335263b90fadfdeb7eb146c1a71` |

현행 EN/KO/ZH의 세 주제, 모두 9편의 전문을 대조했다. 숫자 접두어만으로 연결하지 않고 위와 같은 전체 주제 slug를 사용했다.

| 언어 | 704 SHA-256 | 705 SHA-256 | 706 SHA-256 |
|---|---|---|---|
| EN `columns-en` | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO `columns` | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH `columns-zh` | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

공통 facts는 `research/arc-source-facts.md`의 F01–F23이다. 검수 중 F04의 범주 수식 범위 문제를 root와 표 소유자에게 전달했고, 소유자가 정밀화했다. 정밀화 후 표 SHA는 `96560a3baaac576a2e85fd3a10bad02cf8662e12286166ccb5f7d995bb3697c4`다. 원고 대조 기준 commit은 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`이다.

적용 규칙은 현 저장소의 `docs/columns/EDITORIAL-VOICE.md`, `FRONTMATTER.md`, `~/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, 공유 `SENTENCE-VARIETY-RULE.md`와 `LESSONS.md`, 현 배치 `BRIEF.md`다. 홈 `~/agent-library/knowledge/editorial-voice.md`는 조사 당시 부재하여 현 저장소 정본을 사용했다. 폐기된 Fable 역할·승인 게이트는 적용하지 않았다.

## 2. 수정해야 할 문장

### SV-01 — 705 L60: 특정전문인재에게 일반 전문인재의 업무 요건을 함께 부과함

문제 문장: “Anhöriga till en utländsk yrkesverksam eller specialistyrkesverksam kan omfattas av artikel 16 när anknytningspersonen utför yrkesarbete i Taiwan och har beviljats uppehåll eller permanent uppehåll.”

이유: `när anknytningspersonen utför ... och har ...`가 두 인재 범주 모두를 수식한다. 현행 [인재법 중국어 제16조 제2항](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295) 및 [공식 영어 제16조 제2항](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295)의 구조는 `[(일반 전문인재 AND 대만 전문업무 종사) OR 특정전문인재] AND [NIA 거류 OR 영주거류 승인]`이다. EN705와 ZH705는 이 범주 구별을 보존한다. 스웨덴어 현 문장은 특정전문인재 가족 경로의 범위를 좁힌다. 초기 F04도 같은 오독을 유발할 수 있었으나, 검수 중 표 소유자가 수정했다.

수정안: “Anknytningspersonen ska antingen vara en utländsk yrkesverksam som utför professionellt arbete i Taiwan eller tillhöra lagens kategori för utländska specialistyrkesverksamma. I båda fallen krävs att NIA har beviljat anknytningspersonen uppehåll eller permanent uppehåll.” 앞뒤에 제16조 링크와 가족 자신의 무비자·방문비자 입국, 직접 신청, 배우자·미성년 자녀·장애로 자립할 수 없는 성년 자녀의 범위를 그대로 둔다.

의미 보존: 일반 전문인재의 업무 요건, 두 범주의 승인 요건, 거류 OR 영주거류, 제한된 가족 범위를 각각 유지한다. 부모나 다른 성년 자녀로 확대하지 않는다.

### SV-02 — 705 L62: 체류허가를 받은 사람의 수동태

문제 문장: “En utlänning som har beviljat uppehåll och är gift med en taiwanesisk medborgare med hushållsregistrering omfattas av undantaget från arbetstillstånd ...”

이유: `har beviljat`는 그 외국인이 체류를 승인한 주체라는 능동형이다. [취업서비스법 제48조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48)는 혼인과 거류허가를 받은 상태를 함께 요구한다.

수정안: `har beviljat uppehåll` → `har beviljats uppehåll`.

의미 보존: 당사자는 승인 수령자이며, 대만 호적 국민과의 혼인 AND 거류허가라는 조건을 유지한다. 이후 외국 전문인재 배우자와의 구별 및 제15조 링크를 보존한다.

### SV-03 — 706 L85: 해당 온라인 경로의 출국 시 심사 종료 효과 누락

현재 문장: “Före avresa medan förlängning eller ersättningskort väntar behöver NIA ange vilken handling som gäller för just återresan.” 이어서 접수증·사건번호의 여행서류 대체 불가만 설명한다.

이유: F23은 재입국 서류와 별개의 절차 효과다. [NIA 전문인재·가족 시범 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) 주의 9항을 2026-10-25 직접 열람했다. 해당 경로는 신청 중 출국하면 심사를 계속하지 않고, 재입국 후 대상 요건을 충족해야 새로 신청할 수 있다고 정한다. KO706은 가능성 표현으로 이를 언급한다. EN706과 ZH706은 여행 전 문의 수준으로 요약했으므로, 세 원문의 모든 문장이 동일하다고 주장하지 않는다.

추가안: “För ansökningar genom [NIA:s särskilda e-tjänst för utländska yrkesverksamma och deras anhöriga](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) avslutas handläggningen om den sökande lämnar Taiwan medan ansökan prövas. Efter återinresan kan en ny ansökan lämnas om villkoren för den tjänsten är uppfyllda.” 공식 출처 목록에도 같은 URL을 추가한다.

의미 보존: 해당 온라인 절차에 한정한 확정적 효과와 조건부 재신청을 유지한다. 모든 ARC 신청에 대한 출국 금지, 일시 정지 후 자동 재개, 재입국 보장으로 바꾸지 않는다.

### SV-04 — 704 L45: 재학증명의 최근 발급 조건을 명확히

문제 문장: “För studier används antagningsbesked före registrering och därefter aktuellt studieintyg; NIA anger att det senare ska vara utfärdat inom en månad.”

이유: `utfärdat inom en månad`는 앞으로 한 달 안에 발급받으라는 기한으로도 읽힌다. F06, KO/ZH704 및 [NIA 학생 안내의 서류 항목](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news)은 제출하는 증명의 최근 발급 시점을 말한다. 바로 앞 재직증명 문장의 `under den senaste månaden`는 정확하다.

수정안: `det senare ska vara utfärdat inom en månad` → `det senare ska ha utfärdats under den senaste månaden`.

의미 보존: 등록 전 입학허가와 등록 후 재학증명을 구별하고, 최근 1개월 조건을 앞으로의 제출 유예로 바꾸지 않는다.

### SV-05 — 705: 문장 다양성 실제 FAIL

MONOTONY: 문장 길이 변동 — “Vissa besökare uppfyller villkoren för direkt ansökan hos NIA. Andra sökande behöver rätt visum före inresan. En besöksvistelse ger därför ingen allmän rätt att övergå till uppehåll.” — 도입에서 이미 제시한 방문자 경로 차이를 추상적으로 반복하는 L34는 정보 연결을 다시 다듬을 여지가 있다. 전체 측정 CV가 `0.445`로 `0.45` 미만이다. 이 문단 하나가 수치 실패의 유일한 원인이라는 주장은 아니다.

수정 방향: SV-01의 실제 법률 조건을 먼저 정확한 문장으로 재구성하고, L34는 앞선 구분에 필요한 내용을 남겨 자연스럽게 압축한다. 예: “Rätten att söka direkt hos NIA beror på uppehållskategorin. Den som saknar den möjligheten behöver rätt visum före inresan.” 이는 문체 제안이며, 이 문장으로 지표가 통과한다고 미리 주장하지 않는다. 의미 수정 완료 후 동일 도구·동일 기준으로 다시 측정한다. 숫자 통과만을 위한 가상 일화, 무의미한 단문 또는 문장부호 변경은 피한다.

의미 보존: 방문자 전체에게 전환 권리가 없다는 제한은 남긴다. 자격·예외·출처를 CV 개선을 위해 삭제하지 않는다.

## 3. 공통 facts의 수치·범위 선택 보완

다음은 위의 오역·조건 오류와 구별한다. 현행 EN도 일부를 요약해 두었으므로 “영문에서 숫자를 잘못 옮겼다”는 판정이 아니다. 사실표와의 상세 차이를 기록하되, 현재 요약 자체는 정확하므로 아래 수치를 모두 추가할 의무나 출고 차단 사유로 취급하지 않는다. 작성자가 독자에게 필요한 깊이에 따라 선택할 수 있다.

| 위치 / facts | 현재 표현과 부족한 점 | 보완 방향 / 의미 보존 |
|---|---|---|
| 704 L61 / F09 | `Den särskilda nedsättningen ...`으로 僑生 감면의 대상은 보존했지만 50% 수치는 없다. | 적용 수수료에 관한 50% 감면임을 해당 수수료 규정에 맞춰 명시한다. 일반 국제학생 전체 또는 모든 종류의 부가비용을 일괄 반값으로 읽게 하지 않는다. |
| 704 L63 / F10 | `en särskild maximitid enligt artikel 8`으로 특정전문인재의 별도 상한만 언급한다. | 제8조에 따라 고용된 특정전문인재와 법정 범위 가족의 최장 5년, 구체적 기산점을 쓰면 허가 다음 날을 보존한다. Gold Card는 별도의 제9조상 1–3년이므로 같은 기간으로 합치지 않는다. ZH704에 5년, ZH705에 Gold Card 1–3년이 명시되어 있다. |
| 704 L65 / F12 | `E-tjänsterna har kategorispecifika tider.`에 그쳐 학생 심사기간 5근무일과 보완 후 재계산이 없다. | “För studenternas e-tjänst anger NIA fem arbetsdagars handläggning, räknat på nytt efter komplettering.”처럼 보완하고 학생 안내 링크를 붙인다. L67의 승인 후 납부 5근무일과 심사기간을 혼동하지 않는다. KO/ZH704에는 학생 심사기간이 있다. |
| 706 L67 / F20 | 전문인재 추가 거류의 6개월·1회·합계 1년은 있지만 종전 취업권한의 비자동 연장 설명은 없다. | “Förlängningen enligt artikel 17 förlänger inte automatiskt ett tidigare arbetstillstånd.”를 별도로 명확히 한다. 다음 L69의 적격 졸업생 면제는 그대로 둔다. KO706에 이 구별이 있다. |

F10을 보완할 때 직역한 긴 범주명을 한 문장에 모두 밀어 넣기보다, 법정 가족 범위와 승인·기산점을 별도 문장으로 나눌 수 있다. 생략된 상세를 설명하는 것과 신청기간을 구매할 수 있다는 의미를 만드는 것은 구별해야 한다.

## 4. F01–F23 대조표

`보존`은 이 SHA에서 해당 명제의 의미가 대조자료와 맞는다는 뜻이며, 원고 전체 승인이나 인간 법률감수를 뜻하지 않는다.

| ID | SV 확인 위치 | 대조 결과 |
|---|---|---|
| F01 | 704 FAQ1, L25–27, L35 | 거류허가 전제, 입국 다음 날부터 30일, 신청 의무, 통합증명 예외 보존. 모든 무비자 입국자 전환으로 확대하지 않음. |
| F02 | 704 FAQ1, L36 | 대만 내 거류비자 발급일부터 30일. 입국 다음 날과 구별. |
| F03 | 704 L39; 705 L38–44 | 인재법상 범주, 취업허가 또는 면제, 무비자·방문비자, NIA 승인 후 ARC, 일반 이주노동자와 구별 보존. |
| F04 | 705 L60 | 수정 필요: SV-01. 범주에 붙는 업무 요건의 범위를 정밀화. 거류 OR 영주거류 및 제한된 가족 범위 자체는 보존. |
| F05 | 705 FAQ3, L58 | 대만 거주 AND 호적, 최소 60일, 유효 비자와 연장금지 등 제한 부재 보존. FAQ의 일부 초청자 법정 제외도 유지. |
| F06 | 704 L43–45 | 사진 최근 2년, 기본·주소·가족 자료, 재직증명 최근 1개월 보존. 재학증명 최근 발급 표현은 SV-04. |
| F07 | 704 L49 | 해외 문서 인증 요구와 중국어 번역을 요구할 수 있음의 강도 구별. 국적별 아포스티유 관행 추정 없음. |
| F08 | 704 L47 | 대만 거주 AND 호적 국민과 혼인한 최초 배우자 거류, 최장 1년, 최초 배우자 동행 보존. 모든 외국인 배우자의 통상기간으로 일반화하지 않음. 사유변경 때 동행은 이 최초 신청 글에서 상세 설명하지 않음. |
| F09 | 704 FAQ2/L61; 706 L51/L77 | NT$1,000/년, 1년 미만 1년분, NT$2,200 가산, 僑生 대상 구별, NT$500 재발급 보존. 감면 50% 수치는 §3 보완. |
| F10 | 704 L63 | 일반 최장 3년, 별도 인재법 기준과 비용으로 기간을 살 수 없음 보존. 5년·Gold Card 1–3년 상세는 §3. |
| F11 | 704 L67 | 승인부터 납부 5근무일, 6개월 이하 전자 ARC 다운로드·인쇄, 납부부터 3근무일 뒤 IC 수령 구별 보존. |
| F12 | 704 L65 | 일반 심사 10근무일, 반환·보완·면담 제외, 보완 후 재계산 보존. 학생 심사 5근무일은 §3. |
| F13 | 705 FAQ2/L48–54 | 유학 목적과 입국방식, 인정 기관, 4개월 이수 + 최소 3개월 계속등록, 주중 15시간, 휴가 포함 결석 1/4 이하 보존. |
| F14 | 704 FAQ3/L69; 705 L54/L62; 706 L59 | ARC와 실제 업무 권한 구별, 허가 OR 면제 보존. 제48조 승인 수령자 문법은 SV-02. 제15조는 적격 특정·고급 전문인재 배우자 경로로 제한됨. |
| F15 | 706 FAQ1–2, L34–35/L39 | 만료 전 3개월과 주소·근무장소 변경 다음 날부터 30일 구별. 등록이 취업허가를 대신하지 않음. |
| F16 | 706 L36–39 | 제23-1조 30일과 그 밖의 BOCA 15일 모두 사건 발생일 기준. 서로 선택할 수 없는 경로임을 명시. |
| F17 | 706 FAQ1/L41 | 계속 사업 창업가 4개월, 사업 종료 후 별도 경로 3개월, Gold Card 자체 갱신 4개월 보존. |
| F18 | 706 L26/L65 | 사유 소멸 시 폐지·말소 원칙, 사망·폭력·자녀·노동소송·산재 등의 조건별 계속거류 가능성 보존. 자동 권리로 쓰지 않음. |
| F19 | 706 L53 | 30일 미만 AND 원래 사유 계속, 처벌 후 재신청, 영주 계산 1년 공제. 유예기간 아님을 보존. |
| F20 | 706 L67 | 만료 전 신청, 이전 카드 만료 다음 날, 전문인재 6개월+1회/최대1년, 졸업생1년+1회/최대2년, 어학 수료와 구별. 종전 근로권한 비자동 연장은 §3. |
| F21 | 706 L69 | 대만 associate degree 이상, 당해 졸업생 지위로 NIA 연장, 허가기간 중 면제. 모든 졸업·구직기간의 면제로 확대하지 않음. |
| F22 | 706 FAQ3/L79/L83–87 | 출국 전 일반 재입국허가, ARC 기간 상한·말소 연동, 유효 여권+APRC 예외, 접수증·사건번호 비대체, 해외 재발급의 탑승 보장 부정 보존. |
| F23 | 706 L85 | 누락 보완 필요: SV-03. 여행서류 안내만으로 해당 온라인 경로의 사건 종료 효과를 전달하지 못함. |

대만 관할이 스웨덴법으로 바뀐 부분은 발견하지 않았다. 스웨덴어 독자를 스웨덴 국민으로 일괄 간주하지 않고, 실제 여권·국적별 조건으로 표현한다. `associate degree`는 스웨덴 학위와 같다고 치환하지 않았다. 스웨덴어 상담·통역, 변호사 실무 체험, 개별 허가 성공을 새로 약속한 문장도 발견하지 않았다.

## 5. 최근 SV 839·838·837과 문체 비교

비교본 SHA: 839 `b64c381a38574dc5a96fdb5df38fa09b9e2dcec58332c86479e40bb216f16731`; 838 `38c813ad19ad8b82abe942ae8d91d187237f96b7f3ba7fcd1bd7379d9d493074`; 837 `881097065e00015e155184a89a2628dd515c2834014ca8a2b3811d7c57ae670a`.

| 비교 항목 | 실제 표현 / 판단 |
|---|---|
| 도입 | 839 `När taiwanesisk arvsrätt gäller ...`는 적용법·포기기한. 838 `90 dagar är den längsta ...`는 숫자·취업권한. 837 `Ska kundavtalet ...?`는 계약 주체 질문. 새 704 `30 dagar från dagen efter inresan ...`는 숫자, 705 `Viseringsfri inresa kan ...`는 신청경로의 차이, 706 `Gäller ARC-kortet ...?`는 독자 질문이다. 704와 838의 숫자 도입 형식은 닮았으나 실제 기한·절차가 다르며 세 편 배치의 한 유형이 과반을 차지하지 않는다. |
| 첫 두 문단 삭제 시험 | 704는 기산·통합증명 예외, 705는 입국방식·여권/국적, 706은 사유 소멸·사건일 증빙을 제시한다. 범용 예고 도입이 아니다. 705 L34의 후속 추상 반복은 SV-05에서 지적했다. |
| 제목·소제목 | 기존 837 `vem står på kundavtalet?`, 838 `när får arbetet börja?`, 839 `handlingar och frister`와 새 제목은 주제 구별이 된다. 새 소제목도 `Inresedag eller visumets utfärdandedag`, `Familjens möjlighet följer anknytningspersonens status`, `Olika startdagar för olika ändringar`처럼 내용이 있다. 반복되는 명령형 체크리스트 제목은 아니다. |
| 결말 | 기존 837–839는 각 주제의 마지막 사실을 붙였지만 상담·개인정보·언어 안내 문단이 유사하다. 새 704 L69는 발급 카드 대조와 후속 변경, 705 L70은 실제 허가된 활동, 706 L87은 예정 귀환일에 유효한 서류로 끝난다. 연락처는 706 L71에 한 번만 있고 판촉 결말이 아니다. |
| 구조적 꼬리 | 세 편의 `Myndighetsunderlag kontrollerat ...` 뒤에는 적용 신분 경계와 출처 목록이 붙는다. 이 법적 범위 고지는 내용 결말과 구별해 보았다. 날짜·적용 제외를 단조로움 해소 명목으로 삭제해서는 안 된다. |

선택적 자연스러움 개선: 704 L49 `Krav på ... belastningsregister`는 문서 제출을 말하므로 `krav på ... utdrag ur belastningsregistret`가 더 구체적이다. `specialistyrkesverksamma` 같은 범주명은 법률상 정의와 공식 영어명을 첫 등장에 연결하면 일반 스웨덴어 독자의 오해를 줄일 수 있다. 이 제안은 원어민 검증 결과가 아니다.

## 6. 문장 다양성 실제 실행 및 §5 재점검

사용 도구: `tooling/variety/variety_metrics.py`, SHA `79b3e7826fa61e56f919f966d2c5f63ad47eab5f9c1a9a0122aa53c6fd942876`; SV profile SHA `66703b741178befbfc04395ba29a4dddb42254772700c906d7bd233a1834680e`.

저장소 루트에서 실제 실행:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 docs/audit/all-locales-parity-20261025/tooling/variety/variety_metrics.py check src/content/columns-sv/704-taiwan-arc-first-application.md src/content/columns-sv/705-taiwan-visa-residence-work-study-family.md src/content/columns-sv/706-taiwan-arc-renewal-changes-reentry.md --lang sv
```

| 항목 | 704 | 705 | 706 |
|---|---:|---:|---:|
| 측정 문장 / 문단 | 56 / 17 | 62 / 19 | 77 / 23 |
| 평균 정서법 단위 수 | 13.8 | 13.7 | 13.0 |
| 길이 CV, 한도 ≥0.45 | 0.477 | 0.445 FAIL | 0.471 |
| 짧은 문장 비율, 한도 ≥0.08 | 0.268 | 0.242 | 0.273 |
| 비슷한 길이 3연속 비율 | 0.000 | 0.000 | 0.053 |
| 가장 많은 문단 첫 단어 횟수 | 2 | 2 | 2 |
| 연속 문장 같은 시작 횟수 | 0 | 1 | 1 |
| 문장 끝 괄호 인용 비율 | 0.000 | 0.000 | 0.000 |
| 도구가 탐지한 대비식 / 질문 | 0 / 1 | 0 / 1 | 0 / 2 |
| 실제 결과 | OK, 한도 위반 없음 | FAIL `len_cv=0.445` | OK, 한도 위반 없음 |

합산 종료 코드: `1`. 오류를 낮은 점수나 다른 언어 fallback으로 바꿔 보고하지 않았다.

검수 초기, 공유 경로를 `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-sv/704-taiwan-arc-first-application.md --lang sv`로 실행했을 때는 `KeyError: 'sv'`, 종료 코드 `1`이었다. 이는 당시 오래된 공유 도구의 언어 미지원 오류였다.

이후 root가 20:48:58 KST에 기존 파일을 백업하고 22개 파일을 설치한 기록 `checks/variety-installation.json`을 확인했다. root의 18개 테스트 재실행과 한도 불변 기록이 있다. 이 검수자는 설치 후 공유 경로로 위의 동일한 세 파일을 명시적 `--lang sv`로 다시 실행했고, task-local과 같은 표의 값 및 705 CV FAIL, 합산 종료 코드 `1`을 확인했다. 따라서 최종 검수 시 공유 checker도 SV를 측정할 수 있다. 이 검수자는 공유 파일을 수정하지 않았다.

SV는 Unicode·공백·정서법 기준 단위를 사용한다. 짧음은 8단위 이하, 김은 32단위 이상이며 CJK 글자 수와 직접 비교하지 않는다. 제목·표·목록·FAQ·출처 목록은 본문 리듬 측정에서 제외되어 수동 대조가 필요하다. `Myndighetsunderlag ...` 고지는 현 전처리의 산문 문단에 포함된다. 자동 대비식 0은 모든 부정·대조 표현이 없다는 뜻이 아니다. 기계 결과는 자연스러움·법률 의미·원어민 감수의 대체물이 아니다.

| 규칙 §5 | 검수 결과 |
|---|---|
| 1. 실제 도구 FAIL 0 | 미충족: 705 CV FAIL. 다른 두 편도 기계 한도만 충족한 상태. |
| 2. 정형 가상 도입·배치 반복 | 금지 공식 없음. 숫자/경로 차이/질문 세 유형. |
| 3. 아주 짧은 문장 2개 이상·긴 문장 연속 없음 | 짧은 문장 15/15/21개. 예: 704 `Kortet styrker det beviljade uppehållet.` / `När utfärdades ditt uppehållsvisum?`; 705 `Medborgarskapet och passet påverkar visumvillkoren.` / `ARC utfärdas efter NIA:s godkännande.`; 706 `Vissa program öppnar tidigare.` / `Kontakta NIA omgående.`. 32단위 이상 문장은 세 편 모두 0개. |
| 4. 같은 문단 시작 3회 없음 | 최대 2회. 704 `när`, `nia`; 705 `ett`, `när`; 706 `ett`. |
| 5. 주장-조문-다만 3문단 연속 없음·비인용 문단 있음 | 해당 3연속을 발견하지 않음. 예: 704 L57 보관 절차, 705 L28 국적·공관 문의, 706 L47 자료 준비. 여기서 비인용은 법령 조문 인용 기준이며 기관 링크까지 전혀 없다는 뜻은 아님. 704 L57·706 L47은 링크도 없음. |
| 6. 대비식·불필요한 반박 | 도구 0. 수동으로 706 `Permanent uppehåll måste alltså skiljas ...` 같은 비교를 별도 인지했다. 자격·허가 범위를 설명하는 부정문을 모두 대비 템플릿으로 계산하지 않았다. 지어낸 반대 주장을 공격하는 문장은 발견하지 않음. |
| 7. 구체적 끝문장 | 법적 범위 고지·출처 목록을 구조적 꼬리로 구별하면 세 편 모두 해당 주제의 후속 절차·허가 범위·귀환일로 끝남. |
| 8. 언어·강조·체험·소제목 | `du` 기반의 전문적 설명. 굵은 강조, 본문 H1, 지어낸 1인칭 경험, 명령형 체크리스트 제목 없음. KO/JA 종결체 항목은 SV에 적용하지 않음. |
| 9. 법적 조건·숫자·출처 보존 | 필수 지적 SV-01–04가 남아 있으므로 충족 판정 불가. §3은 정확한 요약에 대한 선택 보완이다. 다양성보다 의미 보존이 우선. |

## 7. 링크·메타데이터와 직접 확인 범위

정적 확인에서 본문 공식 외부 URL은 704 10개, 705 15개, 706 13개이며 모두 각 출처 목록에 있다. 내부 링크 대상 파일이 존재하고, EN 잔여 주제 링크에는 `på engelska`가 표시되어 있다. 이는 실제 배포 경로의 HTTP 응답·canonical·hreflang 검증이 아니다.

세 편 모두 `author: legal-ai-assistant`, `audience: [sv]`, 2026-10-25 날짜, 기존 v2 이미지 경로와 `Fiktiv scen` 캡션, FAQ 3개를 유지한다. 본문에 새 공개 저자·검수자 자격이나 AI 승인 주장을 추가하지 않았다. 장식용 `**`, `__`, `<strong>`, `<b>`와 본문 H1은 탐지되지 않았다. 태그 slug는 원문의 식별자를 유지한다.

이 독립 검수에서 2026-10-25 직접 열어 해당 내용을 읽은 공식 근거는 다음과 같다.

- [MOJ 인재법 중국어 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295) 및 [영어 전문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295): 제8·9·12·15·16·17조를 통한 범주·기간·가족·졸업생 요건 대조.
- [MOJ 이민법 제22조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22)와 [전문 제31·34조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132): 최초 신청·변경·재입국 예외 대조.
- [MOJ 거류 규칙 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129): 제7·9·11·12·20조의 기산점, 배우자 첫 최장 1년, 졸업생 및 APRC 예외 대조. 제7·20조 개별 URL은 도구 접근 오류였으나 같은 현행 전문에서 조문을 확인했다.
- [MOJ 취업서비스법 제48조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48): 대만 호적 국민 배우자의 혼인 AND 거류허가 요건.
- [BOCA 국내 거류비자 발급 후 ARC FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html): 발급일부터 30일.
- [NIA 0929 학생 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news): 문서·5근무일 심사·보완 재계산·승인 후 납부·전자/IC 수령 구별.
- [NIA 전문인재·가족 시범 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/): 주의 9항의 출국 시 심사 종료·조건부 재신청.

그 밖의 비자·창업가·금카드 안내 및 모든 링크의 최신성은 공통 facts와 10월 24일 조사 기록을 대조했으며, 이 검수자가 오늘 전수 재열람했다고 주장하지 않는다. 수수료 제3조 개별 URL도 이 도구에서는 접근 오류여서 금액 전체를 새 직접 확인으로 표시하지 않았다. MOJ 표시 정비자료 기준일은 2026-10-16이며 이후 관보 전수조사는 수행하지 않았다.

원고의 의미·문체 수정은 작성자가 수행해야 하며, 수정 후에는 세 파일 SHA, 지적 문장, 실제 SV 지표를 다시 확인해야 한다.
