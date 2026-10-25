# CS ARC batch02 — 저자 작성·의미·문체 점검

작성·점검일: 2026-10-25 KST. 담당: `/root/column_live_audit`, AI 작성 및 자기 검수. 인간 체코어 원어민·변호사 검토나 독립 검수 승인을 주장하지 않는다.

지정된 batch02의 체코어 세 편과 이 보고서만 작성했다. 릴리즈 저장소 R에 새 원고를 복사하지 않았으며 다른 작성자의 원고·보고서·공유 검사기를 수정하지 않았다. 커밋, push, 게시, 외부 연락은 하지 않았다. 아래 결과는 실제 초안의 인계 상태이며 공개 배포 증거가 아니다.

## 산출물과 최종 SHA-256

기준 디렉터리 B: `/Users/son7/tseng-all-language-columns-20261025/batch02`.

| B 상대 경로 | 제목 | 본문 단어 수 | 최종 SHA-256 |
|---|---|---:|---|
| `src/content/columns-cs/704-taiwan-arc-first-application.md` | První ARC na Tchaj-wanu: od kterého dne běží lhůta | 1088 | `b04287c15c9dc9eedbfd0e2ac81108bf68fffbeb2ee85cfc985b51bb5e628f94` |
| `src/content/columns-cs/705-taiwan-visa-residence-work-study-family.md` | Práce, studium nebo rodina na Tchaj-wanu: kdy stačí bezvízový vstup? | 1134 | `357362b8ce38bb4d12766b2e2893ac9497ea722c3ac571d5ec5e80f3556add0b` |
| `src/content/columns-cs/706-taiwan-arc-renewal-changes-reentry.md` | Změna adresy, konec práce a cesta z Tchaj-wanu: kdy upravit ARC | 1501 | `502b0a214d07abc2d721fccd6258ee95805375edf05f63066e31910a8848ac22` |

단어 수는 frontmatter·공식 출처 목록을 제외하고 Markdown 링크를 표시문으로 치환한 뒤 공백으로 나눈 값이다. 표와 범위 고지는 포함한다. 706은 사유변경·계속거류 예외·분실·재입국의 조건을 보존하면서 다른 두 편보다 길어졌다.

## 읽은 정본과 적용 범위

R: `/Users/son7/Projects/tseng-law-all-locales-20261025`.

전문을 읽은 자료: B/BRIEF.md, R/AGENTS.md, R/docs/audit/all-locales-parity-20261025/BRIEF.md, R/docs/columns/EDITORIAL-VOICE.md, R/docs/columns/FRONTMATTER.md, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `/Users/son7/tseng-lanes-shared/LESSONS.md`, R의 최신 EN/KO/ZH 704–706 아홉 편, 최신 공통 facts, `docs/audit/codex-column-recheck-20261024/research/source-refresh.md`, 그 감사의 `reviews/final-core.md`, `docs/audit/arc-visas-20261024/BRIEF.md`, 아래 최근 CS 세 편이다. 긴 도구 출력이 잘린 부분은 범위를 나누어 다시 읽었다.

홈 `~/agent-library/knowledge/editorial-voice.md`와 예전 ARC 브리프가 지정한 `~/.codex/skills/tseng-law-editorial/references/review-criteria.md`는 이 기계에서 앞선 확인 때 없었고 관련 스킬 경로 검색에서도 찾지 못했다. 현재 브리프가 허용하는 저장소 문체 정본과 공유 규칙을 적용했다. 폐기된 Fable 고정 위임·승인 지시와 공개 작성자 보존에 관한 과거 문구는 적용하지 않았다.

체코어는 독자의 언어이며 국적으로 가정하지 않았다. 대만법을 체코법으로 치환하지 않았고 체코 서류만을 전제로 한 영사 인증, 아포스티유 인정, 체코어 상담·통역 제공을 약속하지 않았다. 법률상 인재 분류의 영어 이름과 associate degree는 해당 외국 제도를 식별하기 위한 명칭으로만 사용했다.

### 읽은 최신 원문 해시

아래 경로 앞에는 R/src/content/가 붙는다. 작성 후 다시 계산해 읽은 버전과 같은 해시임을 확인했다.

| 원문 | SHA-256 |
|---|---|
| `columns/704-taiwan-arc-first-application.md` | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` |
| `columns/705-taiwan-visa-residence-work-study-family.md` | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` |
| `columns/706-taiwan-arc-renewal-changes-reentry.md` | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| `columns-en/704-taiwan-arc-first-application.md` | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` |
| `columns-en/705-taiwan-visa-residence-work-study-family.md` | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` |
| `columns-en/706-taiwan-arc-renewal-changes-reentry.md` | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| `columns-zh/704-taiwan-arc-first-application.md` | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` |
| `columns-zh/705-taiwan-visa-residence-work-study-family.md` | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` |
| `columns-zh/706-taiwan-arc-renewal-changes-reentry.md` | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

공통 `docs/audit/all-locales-parity-20261025/research/arc-source-facts.md` SHA-256: `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145`. F04 정정 및 F23·F24, F18 세부 조건을 포함한 버전이다.

## 법률 의미와 공식 근거 대조

EN을 독자용 구성의 기본 비교본으로 사용하되 KO/ZH와 공통 facts의 한정이 더 정확한 경우 이를 적용했다. EN704의 첫 배우자 카드 고정 1년처럼 읽히는 표현은 최대 1년으로, EN706의 원래 만료일이 변하지 않는다는 문장은 기존 허가의 자동 연장이 아니라는 뜻으로 명료화했다. 원문에 남은 모호함을 그대로 번역하지 않았다.

| 명제 | 체코어 원고에서 보존한 내용 |
|---|---|
| F01·F02 | 704 본문·FAQ: 거류비자 입국과 거류허가 전제, 입국 다음 날 30일. 대만 안에서 발급된 거류비자는 발급일부터 30일. 유효 통합증명 예외 유지. |
| F03 | 704·705: 적격 전문인재/특정전문인재, 전문 업무 허가 또는 법정 면제, 허용되는 무비자·방문비자 입국, NIA 승인 후 ARC. 채용 제안과 허가 구분. |
| F04 | 705는 두 후원자 범주를 별도 항목으로 썼다. `zahraničního odborníka, který na Tchaj-wanu vykonává odbornou práci` OR `zahraničního odborníka se zvláštní kvalifikací`. 다음 문장 `V obou případech ... již od NIA schválený pobyt nebo trvalý pobyt`가 두 범주 모두에 NIA 거류 OR 영주승인을 요구한다. 전문 업무 수식어를 두 번째 범주에 확장하지 않았다. 가족은 배우자·미성년 자녀·신체/정신 장애로 독립생활 불가능한 성년 자녀로 제한한다. |
| F05 | 705: `platné vízum umožňující pobyt alespoň 60 dnů`로 체류허용 60일을 명시. 비자 자체 유효기간 60일로 쓰지 않았다. 대만 국민 배우자의 대만 거주 AND 호적등록, 연장금지 등 제한 부재·적격관계·다른 후원자 제외 유지. |
| F06·F07 | 704: 최근 2년 ARC 사진, 최근 1개월 발급 재직/등록 후 재학증명, 실제 주소, 관계·후원자 신분자료. 후원자 여권을 가족 신청의 보편 필수문서로 쓰지 않았다. 해외 문서 인증 의무와 중국어 번역을 요구할 수 있다는 재량 구분. 건강·무범죄 문서 면제를 서로 전이하지 않음. |
| F08 | 704: 대만 거주·호적등록 국민 배우자의 최초 신청만 최대 1년. 첫 신청/혼인에 따른 사유변경 시 배우자 동행, 대만 혼인등록 자료 유지. |
| F09·F10 | 704·706: 승인 1년당 NT$1,000, 미만도 1년분, 해당 무비자/방문비자 경로 추가 NT$2,200, 僑生만 50% 감면, 분실 등 NT$500. 일반 3년과 고용된 특정전문인재/적격 가족 5년 분리. 704는 `ode dne následujícího po schválení pobytu úřadem NIA`로 NIA 거류승인 다음 날을 명시해 취업허가일과 혼동하지 않는다. Gold Card 1–3년은 705에 있다. |
| F11·F12 | 704: 일반 심사 10근무일 및 보완/반환/면담 제외·보완 후 재기산. 학생 심사 5근무일과 승인 후 납부 5근무일은 별도. 전자 ARC 6개월 이하·납부 후 출력, IC 카드 납부 후 3근무일·영수증 출력·지정센터 수령. 다른 신청자에게 일반화하지 않음. |
| F13 | 705: 학위과정의 해외 거류비자/적격 학생 방문비자 직접경로, 일반 무비자·도착비자·다른 목적 전환 제외. 어학 적정 비자, 인정 대학 부설기관에서 4개월 완료 AND 최소 3개월 계속 등록, 월–금 주 15시간 이상, 휴가 포함 결석 1/4 이하와 자료 유지. |
| F14 | 세 편: ARC가 모든 직무 허가라는 설명 없음. 705는 대만 호적 국민 배우자+거류승인의 취업허가 면제와 특정/고급 전문인재 배우자의 제15조 직접 취업허가 신청을 별도 문단으로 구분. 후자는 NIA 가족거류 승인 전제·거류기간을 넘지 않는 취업허가 유지. |
| F15·F16 | 706 표·본문·FAQ: 일반 만료 전 3개월, 주소/근무처 변경 다음 날 30일, 제23-1조 열거 사유변경 발생일 30일, 조항 밖 BOCA 발생일 15일 후 NIA. 선택 가능한 두 기한으로 쓰지 않음. |
| F17 | 706: 사업계속 적격 창업가 4개월, 사업종료 후 계속거류가 필요한 별도 경로 3개월, Gold Card 자체갱신 4개월. 모두 만료 전. 제17조 구직 등 추가거류와 구별. |
| F18 | 706: 사유 소멸 시 허가 폐지·카드 말소와 MAY 예외. 가정폭력 때문에 이혼 AND 대만 거주·호적등록 국민과의 혼인 AND 재혼하지 않음. 법원 이혼판결만 가능하다는 새 조건 없음. 자녀 예외는 구체 법정요건을 남겼으며, 국내 고용주와의 노동소송 진행·산재 치료 중 조건 유지. |
| F19 | 706: 초과거류 30일 미만 AND 원래 사유 계속 AND 제재 후 재신청 가능. 기존 허가의 자동 연장 아님과 영주거류 기간 산정 1년 공제 유지. 신규 승인 카드의 만료일도 변경 불가라고 쓰지 않음. |
| F20·F21 | 706: 전문인재 제17조 만료 전 신청·승인 시 종전 만료 다음 날 6개월·한 번 추가·총 1년 및 이미 허가된 적격 가족. 졸업생 규칙11조 만료 전 신청·종전 만료 다음 날 1년·한 번 추가·총 2년. 단순 어학종료와 구분. 대만 전문학사 이상 취득+해당 신규 졸업생+NIA 적법 졸업후 연장 승인 기간의 제12조 근로면제를 따로 한정. |
| F22 | 706: 출국 전 재입국허가, ARC 유효기간 한계·말소 연동, 영주거류의 유효 여권+APRC 예외. 접수증·카드 사진을 탑승/재입국 보장으로 쓰지 않음. |
| F23 | 706: 지정 전문인재/가족 온라인에서 심사 중 출국하면 NIA가 심사를 중단하는 필수 효과. `Po opětovném vstupu lze podat novou žádost, pokud žadatel splňuje podmínky tohoto postupu.`로 재입국 뒤 MAY 신청 IF 해당 자격 유지. 모든 신청의 일률 출국금지·재입국 보장으로 확대하지 않음. |
| F24 | 704: 통지 다음 날부터 15달력일, 불일치/부족 자료를 해외·대륙·홍콩·마카오에서 발급받아야 할 때 3개월, 미보완/불완전 보완 기각, 보완 뒤 일반 10근무일 재기산. 단순히 신청인이 해외에 있는 조건이나 15일+3개월로 바꾸지 않음. |

이 배치에서 새로 직접 연 [중국어 NIA 0902](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/)의 申辦時間 본문은 F24의 통지 다음 날·15일·지역별 문서 조달·3개월·불완전 보완 기각을 명시한다. 같은 페이지는 F06과 NIA 거류허가를 기준으로 하는 F10도 뒷받침한다. 영어 0902의 통지일 표현으로 기산점을 바꾸지 않았다.

F18의 노동분쟁 범위를 좁혀 재확인할 때 [공식 영어 이민법 제31조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132)를 직접 열어 domestic employer 및 진행 중 lawsuit 요건을 확인했다. 최종 CS는 `probíhajícího soudního řízení`를 쓴다. 단순 민원·고용주와의 의견충돌로 완화하지 않았다.

같은 세션의 앞선 FIL/NL 작업에서도 현행 인재법 중문/영문, 거류 규칙, 이민법, 수수료 기준, NIA0915·학생0929·전문인재 온라인·해외 분실 공고·유효 ARC/APRC 여권 FAQ, BOCA 국내 거류비자 FAQ의 해당 본문을 읽었다. 그 열람과 공통 facts 및 10월 24일 source-refresh를 재사용했다. 모든 URL을 이 CS 배치에서 새로 다시 열었다거나 10월 17–25일 관보를 전수 조사했다고 주장하지 않는다.

## 실제 문장 수정 기록

수정 전 최초 저장본 SHA: 704 `b2f5091ee31aa56fddd25e1b435fe1849aa8a0bcce93f4f22965ad744e2ff772`, 705 `7421de4f87c7fa6a4cd43c341b0b98d817220bd5f8027889e174b70822fcf6b5`, 706 `39a85fec36d33fc40c7038b1b79bcb61d2af00b43a0c1f5cf8728cab20707cf7`.

| 실제 문장 | 문제·이유 | 적용한 수정 | 의미 보존 |
|---|---|---|---|
| 704: `Rozhoduje tedy i to, kde a kdy jste vízum získali.` | 앞의 국내 발급/발급일 기산 설명을 재진술. 첫 두 문단 삭제 검사에서 새 정보 없음. | 문장 삭제. | 앞의 발급일부터 30일, 첫 문단의 입국 다음 날 30일, BOCA 링크 모두 유지. |
| 704: `Požadavky na překlad a ověření se odvíjejí od těchto údajů, nikoli od jazyka, ve kterém čtete tento článek.` | 편집 지시인 언어≠국적을 독자에게 직접 설명하는 군더더기. 문서 종류·발급국·용도가 이미 실질 기준. | 앞 문장과 합쳐 `Sdělte mu druh listiny, stát vydání a účel použití, aby mohl určit požadavky na překlad a ověření.` | 국적 추정 없이 관할 공관에 실제 필요한 자료를 전달하는 내용 보존. 인증 의무/번역 재량은 앞 문단 유지. |
| 704: `... stanoví zamítnutí žádosti při včasném nedoplnění nebo neúplném doplnění; po doplnění ...` | `včasném nedoplnění`는 체코어로 부자연스럽고 기한 내 미보완 조건이 흐림. | `... stanoví zamítnutí žádosti, pokud doklady ve lhůtě nedoplníte nebo doplnění zůstane neúplné. Po doplnění se deset pracovních dnů pro posouzení počítá znovu.` | 미보완 OR 불완전 보완의 기각과 보완 후 10근무일 재계산 모두 보존. 15일·3개월 조건 삭제 없음. |
| 704: `... studentům se statusem 僑生, tedy zvláštní kategorií krajanů ze zahraničí; ...` | 동격 연결의 격이 부자연스럽고 제한을 한 문장에 몰음. | `... studentům se statusem 僑生. Jde o zvláštní kategorii krajanů ze zahraničí; sleva se nevztahuje na všechny zahraniční studenty.` | 僑生 제한·50% 감면·일반 외국학생에게 확대하지 않는 뜻 유지. |
| 704: `Obvyklý zákonný strop ARC jsou tři roky ...` | 일반 법정 상한을 ‘통상적’이라고 약하게 표현하고 서술이 어색함. 다음 최초 배우자 문장의 `občana`는 국적을 다시 명시하는 편이 명확. | `Obecná maximální platnost ARC činí tři roky ...` 및 `... manžela či manželky tchajwanského občana, který žije na Tchaj-wanu a má zápis ...` | 일반 3년·대만 거주/호적 국민 배우자 최초 최대 1년 구분. 법적 대상 명료화. |
| 705: `Čeština sama státní příslušnost žadatele neurčuje.` | 독자에게 불필요한 편집 원칙 설명. | 문장 삭제. | 앞의 시민권·사용 여권·예정 활동·신청국 확인 및 공관 링크 유지. |
| 705: `Pro založení podniku zveřejňuje BOCA podmínky podnikatelské cesty.` | MONOTONY: 문단 시작 — `Pro tuto cestu ...`, `Pro manžela ...`, `Pro založení podniku ...` 세 번 — 담당기관을 문장 주어로 명료화. 최초 공유 검사도 top_opener_n=3 FAIL. | `BOCA zveřejňuje také podmínky pobytu pro založení podniku.` | BOCA 담당 및 같은 창업 공식 URL 유지. 본문 조건을 지워 수치만 낮춘 수정 아님. |
| 705: `Žádný z těchto názvů sám nepotvrzuje způsobilost konkrétního žadatele.` | Gold Card·working holiday 각각의 자격 설명 뒤 범용 경고를 반복. | 삭제. | 전문성 심사·고용주 불요·1–3년, 창업 공식 조건, 국적별 working holiday 그대로. |
| 706 요약: `... do 30 dnů od následujícího dne.` | 무엇의 다음 날인지 요약만 읽으면 덜 명확. | `Změnu adresy či pracoviště musíte nahlásit do 30 dnů ode dne následujícího po změně.` | 의무·30일·변경 다음 날 보존 및 주체/기산점 명료화. |
| 706: `U rozvodu z důvodu domácího násilí jde o cizince, jehož manžel či manželka byl ...; podmínkou je také to, že ...` | 성별 병렬과 장문이 부자연스러움. | `Rozvodová výjimka se týká cizince rozvedeného kvůli domácímu násilí, jestliže šlo o manželství s tchajwanským občanem žijícím na Tchaj-wanu se zápisem v evidenci domácností. Podmínkou je, že cizinec neuzavřel nové manželství. NIA mu za těchto podmínek může další pobyt povolit.` | 가정폭력 원인·대만 거주/호적 국민과 혼인·재혼하지 않음·NIA 재량 모두 유지. 중간 편집안 `Cizinec nesmí uzavřít nové manželství`도 일반 재혼금지로 읽힐 수 있어 최종에는 자격조건으로 명시했다. |
| 706: `U pracovního sporu se vyžaduje probíhající sporné řízení, u pracovního úrazu probíhající léčba.` | 고용주 범위가 생략돼 있고 ‘sporné řízení’보다 근거의 소송 의미를 명시할 필요. | `Pracovní spor s tuzemským zaměstnavatelem musí být předmětem probíhajícího soudního řízení, u pracovního úrazu musí pokračovat léčba.` | 국내 고용주·진행 중 소송을 공식 제31조에 맞춰 보완. 산재 치료 중 조건 유지. 단순 동의어 변경으로 분류하지 않음. |
| 706 사업종료 문장: `... tříměsíční období před koncem platnosti.` | 별도 계속거류 경로의 거류 필요성 조건을 명시하는 편이 정확. | `... tříměsíční období před koncem platnosti, pokud je další pobyt potřebný.` | 만료 전 3개월·사업종료 경로 및 계속 거류 필요성 보존. 사업 계속 4개월/Gold Card 4개월과 구분. |

## 최근 체코어 세 편과 비교

세 편 모두 2026-10-24 게시 메타데이터를 가진 R/src/content/columns-cs/ 파일이다. 전문을 읽고 실제 도입·소제목·실질 결말을 비교했다. 기존 글의 법률을 이번에 다시 인증한 것은 아니다.

| 최근 글 | 해시 | 비교 결과 |
|---|---|---|
| `873-czech-company-taiwan-subsidiary-branch-office.md` | `4fa2004dc6c9221b58e919a38163897bf52b764f0e742a1811a55d07fca091d7` | 누가 고객의 주문을 받는지 묻고 법인/지점·계약상 당사자·서명권한으로 이어진다. 새 705의 질문은 채용/입학 문서를 받은 사람의 입국 방식 결정으로 좁혔고 기업계약 구조나 긴 연락처 꼬리를 복제하지 않았다. |
| `874-czech-working-holiday-taiwan-work-limits.md` | `4fdee9eb324d52a49f18c53790d208c37e8bd356d88f41f2b27f2f9583e66566` | 체코 프로그램의 신청 연령 상한과 근로기간으로 시작하고 허용 체류 종료일·근로 종료일을 남기는 결말이다. 새 704는 일반 외국인 ARC의 입국/발급일 기산점으로 시작하며 체코 국적 프로그램의 요건을 끌어오지 않았다. |
| `875-czech-buyer-taiwan-defective-machine-claim.md` | `e13f617788087fbecf742d5c2a8687941f98e9086c3edf277947f9c203f5ccd7` | 가상임을 표시한 기계 검수 장면과 수리 전 증거 보존으로 시작한다. 새 세 편에는 의뢰인·가상 사례를 새로 만들지 않았다. 706은 실제 변경일·서류·귀환일의 관계를 설명한다. |

최근 글의 차분한 체코어 설명, `Tchaj-wan` 표기와 독자에게 필요한 경우의 복수형 안내를 이어간다. 기계적인 ‘첫째/둘째/마지막’ 구조, 공통 홍보 결말, 원어민/법률가 체험은 넣지 않았다. 새 소제목은 기산일·사진/주소·서류 보완·주당 수업·후원자 신분·고용주 변경·심사 중 여행이라는 개별 결정에 대응한다.

### 첫 두 문단 삭제 검사

- 704 첫 문단: 거류비자+허가 전제/30일, 다음 날 기산, NIA 신청 의무의 세 문장은 각각 정보가 있다. 둘째 문단은 국내 발급이라는 다른 상황과 발급일 기산이 각각 필요하다. 추가됐던 ‘언제 어디에서 받았는지가 중요’ 문장은 삭제했다.
- 705 첫 질문은 채용 제안·입학허가를 받은 상태에서 무비자 입국을 결정하려는 맥락을 준다. 답변의 전문인재 직접경로와 학위/어학의 다른 요건은 각각 보존했다. 둘째 문단은 시민권·여권, 담당 공관에 전달할 실제 정보를 담으며 ‘체코어는 국적 아님’ 재진술은 삭제했다.
- 706 첫 문단의 남은 ARC 기간과 무관한 이사 신고 의무, 다음 날 30일, 근무처 변경 포함은 각각 필요하다. 둘째 문단은 사유 소멸, NIA 폐지와 재량 예외, 사건일 문서 보존이라는 별도 정보를 남긴다.

## 실제 공유 검사 결과

초안 작성 중 CS 프로필이 공유 검사기에 설치됐다는 root의 전달을 받은 뒤 아래 정확한 명령을 실행했다. CS 미지원을 ko 자동분류로 통과시킨 기록은 없다. 검사기·프로필·기준을 작성자가 고치지 않았다.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-cs/704-taiwan-arc-first-application.md --lang cs
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-cs/705-taiwan-visa-residence-work-study-family.md --lang cs
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-cs/706-taiwan-arc-renewal-changes-reentry.md --lang cs
```

| 최종 파일 | sentences | mean | cv | short | run3 | opener_rep | cite_end | cite_para | contrast / caveat / q | exit / FAIL |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 704 | 68 | 14.2 | 0.510 | 0.279 | 0.061 | 0.087 | 0.0 | 0.304 | 0 / 0 / 1 | 0 / 0 |
| 705 | 75 | 14.3 | 0.527 | 0.240 | 0.027 | 0.130 | 0.0 | 0.478 | 0 / 0 / 2 | 0 / 0 |
| 706 | 99 | 13.7 | 0.459 | 0.222 | 0.052 | 0.069 | 0.0 | 0.483 | 0 / 0 / 1 | 0 / 0 |

세 최종 stdout 모두 `[cs]`와 `OK — no variety limit violated`를 출력했다. 첫 실행 704/706은 exit 0이었다. 705 첫 실행은 sentences=77, mean=14.1, cv=.532, short=.247, run3=.040, opener_rep=.174, top_opener_n=3(limit 2)로 exit 1 / FAIL 1이었다. 위 BOCA 주어 수정 뒤 해소했다. 이후 706의 법적 한정 보완 뒤에도 해당 파일을 다시 실행해 위 최종 수치와 exit 0을 얻었다.

기계검사는 체코어 자연스러움·법률적 동일성에 대한 독립 승인과 다르다. 특히 contrast/caveat=0은 모든 체코어 부정·대비 표현이 없다는 뜻이 아니며 실제 읽기에서 필요한 권한·기한 구별과 내용 없는 반박을 따로 보았다.

## 구조·FAQ·출처·이미지 확인

작동하는 `/Users/son7/.nvm/versions/node/v24.14.1/bin/node`와 R의 `gray-matter`를 사용한 읽기 전용 스크립트로 각 원고를 파싱했다. 원고마다 다음 18항목이 통과했다: 필수 frontmatter, 두 날짜, audience cs, topic visa, 내부 author, FAQ 3개와 q/a, bold 없음, 본문 H1 없음, 공개 작성자 패턴 없음, 줄 끝 공백 없음, EN 정본과 동일 이미지 경로, 실제 이미지 존재, EN 공식 URL 보존, 본문 공식 URL의 출처목록 포함, 목록 공식 URL의 본문 사용, 허용된 CS 세 편의 상호 링크, 문자 그대로의 역슬래시-n 없음, UTF-8 대체문자 없음. 자동 금칙 패턴만으로 공개 문체 판정을 대체하지 않고 본문·FAQ·alt도 읽었다.

| 원고 | 구조 검사 | EN 공식 URL → CS 공식 URL | 누락 EN URL | CS 내부 링크 |
|---|---|---|---:|---|
| 704 | 18/18 | 9 → 13 | 0 | 같은 CS 705·706 |
| 705 | 18/18 | 15 → 16 | 0 | 같은 CS 704·706 |
| 706 | 18/18 | 13 → 16 | 0 | 같은 CS 704·705 |

공식 출처 보존의 기계 비교 기준은 각 EN 정본이다. KO/ZH의 같은 법령에 대한 모든 언어별 중복 URL을 전부 복제했다고 주장하지 않는다. BOCA 국내 발급 FAQ, 중국어 NIA0902, 거류규칙12조, NIA0915, 해외분실·여권 FAQ, 전문인재 온라인 안내를 필요한 주장에 연결해 보완했다. 배치 지시에 따라 EN의 다른 spouse/Gold Card/APRC 칼럼 링크를 가상의 CS 링크로 만들지 않았다. 필요한 법률 내용은 자체 본문과 공식 출처에 남겼다.

FAQ는 EN의 세 질문별 범위와 비교했다. 704는 기산점/비용/근로 권한, 705는 적격 직접 신청/어학/후원자 범위, 706은 갱신 창/변경 신고/여행 접수증을 유지한다. 본문보다 신청권을 넓히지 않았다. 원고 날짜는 초안 게시 예정일 2026-10-25이며 실제 릴리즈 때 날짜 조정 여부는 root가 판단한다.

실제 WebP 세 파일을 `view_image`로 열었다. 704의 여행 책자·서류철·빈 카드, 705의 닫힌 노트북·책·머그 두 개·책자, 706의 빈 노트·책자·빈 카드·열쇠가 현지화한 alt와 일치한다. 사람·읽히는 신분서류를 설명하지 않는다. `Smyšlená scéna` 캡션은 원본의 가상 장면 의미이며 공개 AI 작성자 표기를 새로 붙이지 않았다.

| 기존 이미지 파일명 | SHA-256 |
|---|---|
| `taiwan-arc-first-application-20261024-v2.webp` | `e33f7f381d597a9ae5b3693d7c4f887a29d7420b1b4ae3c98db664a06dceae31` |
| `taiwan-visa-residence-work-study-family-20261024-v2.webp` | `0f9d9a4041f5978119b71a6c89ba1a9b01e2643871143163a4bc4d8f792a7e84` |
| `taiwan-arc-renewal-changes-reentry-20261024-v2.webp` | `9933406b2c0c64af337aaf443c6c5e1ed4afb94e9ed7ab5a5e3635a2b940f16f` |

## 문장 다양성 규칙 §5 자기 점검

| 항목 | 실제 결과 |
|---|---|
| 1. 정확한 언어 검사 | 공유 경로 --lang cs, 최종 세 편 모두 충분한 문장 수로 실제 측정, exit 0/FAIL 0. 위 초기 705 실패 이력 공개. |
| 2. 오프닝 유형 | 704 숫자/기산점, 705 독자의 입국 질문, 706 이사 후 신고 의무·남은 카드기간의 관계. 가상사례 공식 없음. 세 편 중 한 유형이 절반을 넘지 않음. |
| 3. 짧은 문장·긴 문장 | 704 `Počítá se ode dne následujícího po vstupu.` / `Originály vám úřad po kontrole vrátí.`; 705 `Přijímací dopis je jedním z podkladů.` / `Rodiče do tohoto výčtu nespadají.`; 706 `Každé patří k jiné události.` / `Potvrzení o podání uchovejte.` 등 실제 기능이 있는 짧은 문장 최소 2개씩. 법률 조건의 긴 문장과 짧은 문장 배치 대조, CV/short/run3 통과. |
| 4. 문단 시작 | 실제 시작 단어를 세로로 출력해 읽었다. 705 Pro 3회를 수정. 706 Po 3회는 29개 본문 문단의 긴 글 허용범위이며 이사·초과체류·새 여권이라는 실제 시간 표지다. |
| 5. 인용 리듬 | 법조문 주어, 본문 안 출처, 단락 끝 출처와 비교표를 섞었다. 주장(조문)-다만 구조 세 문단 연속 없음. 704 접수번호 보관, 706 서로 다른 사건일 문서 단락 등 무인용 실무 문단 존재. |
| 6. 대비 틀 | 무비자/학생 전환, ARC/근로권한, 접수증/재입국의 실제 법적 구별을 보존. 독자가 하지 않은 주장을 반박하는 장식 문장을 제거. `nikoli`는 706의 기록 종류 구별 등 필요한 맥락에 한정. |
| 7. 실질 결말 | 704 허가 근거·기한을 보여 주는 결정/접수/자료 보관, 705 취업·입학·동반 날짜 전에 입국·증빙으로 절차 결정, 706 사건일·거류 종료일·귀환일을 입증자료와 보관. 정형 판촉 마무리 없음. 별도 확인일/관할 고지와 출처는 허용된 구조적 꼬리로 평가. |
| 8. 문체·강조 | 차분한 체코어와 필요한 복수형 안내. no bold, no H1, 지어낸 1인칭·의뢰인·검수자 자격 없음. 명령형 체크리스트 제목 대신 대상과 절차를 제목에 표시. |
| 9. 의미·근거 | F01–F24, 최신 F04/F18/F23/F24와 F10 NIA 승인일을 위 표로 재대조. 날짜·금액·미만/이상·MUST/MAY·AND/OR·예외·공식 URL·이미지 가상성 유지. |

## 인계와 한계

세 체코어 초안은 위 해시로 root의 의미·편집 검토에 인계한다. 자기 검수에서 남은 필수 수정 사항은 찾지 못했지만 이를 독립 체코어 검수 PASS로 표시하지 않는다. 기계 검사 18/18 및 variety FAIL 0은 법률·자연스러움 검토를 대신하지 않는다.

실제 공개 URL의 체코어 본문, canonical/hreflang, 목록 노출, 게시 이미지, 정적 빌드·패키지 용량, 배포 commit은 이 초안 작업에서 검증하지 않았다. 릴리즈 저장소로 복사하거나 배포하지 않았으므로 세 로컬 파일의 존재를 공개 완료 수량으로 세지 않는다. 이후 수정이 필요하면 바뀐 문장과 그 영향을 한정해 확인할 수 있도록 위 출처·수정 이력·해시를 남겼다.
