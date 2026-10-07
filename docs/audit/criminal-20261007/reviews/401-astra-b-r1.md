# 401 증인 소환 — 독립 검수 B / r1

판정: REQUEST_CHANGES

검수자: GPT-6 Astra, reasoning max, 독립 검수자 B. 2026-10-07 KST. 다른 검수자의 결과를 읽거나 상의하지 않았다. 원고를 수정하지 않았으며 이 보고서만 작성했다. 아래 판정은 명시한 SHA-256의 401번 5개 언어에 한한다. 402–404, 게시판 구현, 실제 렌더링·배포는 이번 검수 범위가 아니다. 변호사 또는 사람 원어민의 검토라는 주장을 하지 않는다.

## 검수 대상과 해시

기준 경로: `/Users/son7/Projects/tseng-law-criminal-20261007/src/content/`

| 표기 | 파일 | SHA-256 |
|---|---|---|
| KO | `columns/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `2fa54de808b2dcffbd9561cc95095992ea9cba14b1bc34e7ba05576cffcd7d70` |
| EN | `columns-en/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `dee7f011a14703a2939983964809e6cffd9a5ccac54f0ee509453d5db095bc47` |
| JA | `columns-ja/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `11ef2de062a90c2505b031a6baa77bfce3115b42dd5b2fd15569e4bce1f41e2d` |
| ZH | `columns-zh/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `f38bf4ab32379092e23ebd99d507e1a81a4f3616b820093e0546906c4a53f7d8` |
| VI | `columns-vi/401-taiwan-criminal-witness-summons-refuse-testimony.md` | `ce187fe1c1618dd3788142d71a71a673acf31163b64cb4f1d1a77d591bff9019` |

원고를 읽은 뒤와 보고서 작성 직전 해시가 일치했다. 아래 줄 번호는 이 버전 기준이다.

## 게시 전 수정 필요

### B01 — 전 언어: 주신문에서 이미 진술한 사항의 반대신문 제한 누락

- 파일·줄·원문: KO 31행 `자기나 법이 정한 친족 등이 형사소추 또는 처벌을 받을 우려가 있는 진술에는 ... 증언거부권이 적용됩니다.` / EN 33행 `Article 181 permits refusal where testimony risks criminal prosecution or punishment ...` / JA 33행 `...証言の拒絶を認めています。` / ZH 33행 `...受到刑事追訴或處罰，可以拒絕證言。` / VI 33행 `Điều 181 ... cho phép từ chối ...`.
- 이유: 원고는 재판 중 증언거부까지 다루면서 제180조 제2항의 제한은 설명하지만 제181조의1의 직접적인 제한은 전혀 밝히지 않는다. 독자는 제181조 위험이 있으면 심문 단계와 이미 한 진술에 관계없이 거부할 수 있다고 이해할 수 있다. [현행 제181조의1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=181-1)은 피고인 이외의 사람이 주신문에서 진술한 피고인 본인 관련 사항에 관하여 반대신문에서 증언을 거부할 수 없다고 정한다. [대만 최고법원 107年度台上字第8號 보도자료, 이유 요약 (一)](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=320882)도 그 적용을 설명한다. 이 보고서는 해당 사건 자체를 칼럼에 추가하라고 요구하는 것이 아니다.
- 수정안: 거부권 설명에 짧은 단락을 추가하고 제181조의1 인라인 링크와 출처 목록 항목을 함께 넣는다. 한국어 예: `재판에서 이미 한 진술에도 주의가 필요합니다. 제181조의1은 피고인 이외의 사람이 주신문에서 말한 피고인 본인 관련 사항에 대해서는 반대신문에서 증언을 거부할 수 없다고 정합니다.` EN 예: `Article 181-1 restricts refusal during cross-examination: a person other than the accused may not refuse to testify about matters concerning the accused that they already addressed in direct examination.` JA 예: `被告人以外の人は、主尋問で述べた被告人本人に関する事項について、反対尋問で証言を拒めません（第181条の1）。` ZH 예: `被告以外的人，對主詰問已陳述的被告本人相關事項，反詰問時不得拒絕證言（第181條之1）。` VI 예: `Theo Điều 181-1, trong phần hỏi chéo (反詰問), người không phải bị cáo không được từ chối khai báo về những vấn đề liên quan đến chính bị cáo mà họ đã trình bày trong phần hỏi chính (主詰問).` VI에서 반대신문을 일반적인 대질(đối chất)로 바꾸어 번역하지 않는다.
- 보존조건: ‘주신문에서 이미 진술한’, ‘피고인 본인에 관한 사항’, ‘반대신문 때’, ‘피고인 이외의 사람’이라는 네 범위를 모두 보존한다. 한 번 말하면 모든 사안의 권리를 포기한다거나 경찰·검사에게 진술하면 곧바로 제181조의1이 적용된다고 넓히지 않는다. 제181조의 일반 권리와 제183조 판단 절차는 그대로 둔다.

### B02 — KO·EN·JA·VI: 제183조의 소명 대체 절차가 ZH에만 있음

- 파일·줄·원문: KO 35행 `거부 사유는 밝혀야 합니다. ... 이를 소명하면 ...` / EN 37행 `it must be substantiated` 및 FAQ 15행 `the reason must be substantiated` / JA 37행 `拒絶には理由の疎明が必要です。` 및 FAQ 15행 / VI 37행 `Bạn cần làm rõ lý do từ chối.` 및 FAQ 15행. 비교하여 ZH 37행은 `第181條的情形，也可能命證人具結以代釋明。`를 포함한다.
- 이유: [제183조 제1항](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=183)은 원칙적인 소명 의무와 함께 제181조의 경우 具結을 명하여 소명을 대신할 수 있다는 단서를 둔다. 자기부죄를 중심 쟁점으로 삼은 칼럼에서 EN·JA의 무조건적인 ‘소명 필요’ 표현은 해당 대체 절차를 가린다. KO·VI까지 동일한 절차를 설명하도록 맞추면 언어에 따라 권리를 달리 안내하는 문제도 해소된다.
- 수정안: 원칙을 유지하되 `제181조에 해당하면 담당 검사나 법관이 소명을 대신하는 具結(선서·확약)을 명할 수 있습니다.`를 추가하고, 표현상 무조건적인 소명 의무는 `원칙적으로` 등으로 정돈한다. EN 예: `The ground normally must be substantiated. For an Article 181 claim, the authority may instead order an oath or formal affirmation in place of substantiation.` JA 예: `原則として拒絶理由の疎明が必要です。第181条の場合は、疎明に代えて具結（宣誓）を命じられることもあります。` VI 예: `Thông thường, người làm chứng phải làm rõ căn cứ từ chối. Trong trường hợp Điều 181, cơ quan có thẩm quyền có thể yêu cầu cam đoan theo thủ tục 具結 để thay cho việc chứng minh sơ bộ căn cứ đó.` FAQ는 단서를 짧게 함께 넣거나 `제183조의 절차에 따라 이유를 밝히고 판단받는다`로 요약하여 본문 예외와 충돌하지 않게 한다.
- 보존조건: 증인이 임의로 선서하면 자동 허가받는 절차로 바꾸지 않는다. 소명 대체는 제181조 상황에 한하며, ‘명할 수 있음’이라는 재량과 검사/재판장/수명법관의 허가·기각 권한을 유지한다. 具結을 단순한 본안 증언의 선서와 혼동하지 않는다.

### B03 — VI: 제180조 제2항의 ‘다른 사람’ 범위가 너무 넓음

- 파일·줄·원문: VI 35행 `Khoản 2 có ngoại lệ khi lời khai chỉ liên quan đến những người khác trong cùng vụ mà bạn không có quan hệ đó.`
- 이유: ‘같은 사건의 관계없는 다른 사람들’은 다른 증인·피해자 등까지 포함하는 표현이다. [제180조 제2항](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=180)은 다른 공동피고인 또는 공동자소인만에 관한 증언을 정한다. EN·ZH에는 그 대상이 살아 있으나 VI에서는 사라졌다. 또한 이 제한이 친족·신분관계에 기초한 거부에 관한 것임을 명확히 해야 제181조의 별도 근거까지 소멸하는 것으로 읽히지 않는다.
- 수정안: `Khoản 2 không cho phép từ chối dựa vào quan hệ này khi lời khai chỉ liên quan đến những người bị buộc tội khác hoặc những người tự truy tố khác trong cùng vụ, mà bạn không có quan hệ thuộc khoản 1 với họ.` ‘공동피고인/공동자소인’이라는 범주를 명시하는 다른 자연스러운 표현도 가능하다. 앞 문장의 自訴人도 첫 등장 때 `người tự mình đưa vụ án ra tòa để truy tố (自訴人)`처럼 뜻을 짧게 풀면 읽기 쉽다.
- 보존조건: `chỉ`(오직), 제1항의 특정 관계, 다른 공동피고인/공동자소인, 그 관계에 기초한 거부라는 범위를 보존한다. 일반적인 ‘관련 없는 사람’으로 다시 넓히지 않는다.

### B04 — KO·EN: 동일 AI 이미지의 생성 고지 명확화

- 파일·줄·원문: KO 14행 `절차 설명을 위한 가상 이미지이며 실제 조사실이나 사건을 촬영한 사진이 아닙니다.` / EN 14행 `Illustrative generated scene, not a photograph of an actual interview room or case.`
- 이유: JA·ZH·VI는 같은 자산을 AI 생성으로 명시한다. KO의 ‘가상 이미지’는 AI 생성 사실을 말하지 않고, EN의 `generated`도 생성 수단을 명시하지 않는다. 문체 정본의 미디어 AI 고지 보존 기준에 맞춰 일치시켜야 한다. 해당 자산의 git 이력 `8a7fa6cbe`에도 `per-column Grok Imagine heroes`가 기록되어 있다.
- 수정안: KO `절차 설명을 위해 AI로 생성한 이미지입니다. 실제 조사실이나 사건을 촬영한 사진이 아닙니다.` / EN `AI-generated illustration, not a photograph of an actual interview room or case.`
- 보존조건: 실제 사건·취조실 사진이 아니라는 점, 기존 이미지 경로와 관련성은 유지한다. 내부 작성자 필드를 없애거나 사람 작성자·검수자를 만들어 붙이지 않는다.

## 경미한 문체·명료성 제안

### C01 — 첫 두 문단에서 삭제 가능한 범위 예고 문장

- 위치·원문: 전 언어 25행의 KO `이 글은 그 소환장을 다룹니다.` / EN `This article concerns that formal summons.` / JA `ここで扱うのは、この正式な召喚状です。` / ZH `本篇討論這種正式傳票。` / VI `Bài này nói về loại giấy đó.`
- 이유: 바로 앞은 제175조 소환장의 내용과 발행자를, 바로 뒤는 경찰의 정보제공 요청과의 구별을 이미 설명한다. 이 중간 문장은 삭제해도 법적 범위가 유지된다. 첫 두 문단 삭제 시험에서 확인한 반복이다.
- 수정안: 해당 한 문장씩 삭제. 뒤의 경찰 연락과 구별하는 문장은 유지한다.
- 보존조건: 검찰·법원 소환장과 경찰 연락의 성격이 다르다는 구별, 제175조 링크·서명권자·기재 사항을 남긴다.

### C02 — VI의 `từ chối lời khai`, `ngôn ngữ không thông`

- 위치·원문: VI 4·15행 `từ chối lời khai`; 41행 `khi ngôn ngữ không thông`.
- 이유: 앞 표현은 ‘증인이 진술하기를 거부함’보다 ‘진술을 받아들이지 않음’으로 읽힐 여지가 있고, 뒤 표현은 중국어 `語言不通`을 직역한 듯한 표현이다. 핵심 권리를 설명하는 자리이므로 행위자와 행동이 보이는 말이 낫다.
- 수정안: 증인의 행위를 `từ chối khai báo` 또는 `từ chối cung cấp lời khai`로 통일하고, 통역 요건은 `khi người được hỏi không thể hiểu hoặc giao tiếp bằng ngôn ngữ đang sử dụng`처럼 쓴다. FAQ의 `được nghỉ buổi làm chứng`도 `không phải có mặt theo giấy triệu tập`로 바꾸면 출석 의무와 직접 연결된다.
- 보존조건: 증언거부권을 출석거부권으로 바꾸지 않고, 통역이 기관의 의무라는 강도를 유지한다. 베트남 국내법을 대만 절차에 적용하는 식으로 설명하지 않는다.

### C03 — KO 요약의 권리 대상, ZH의 사전 연락 권고

- 위치·원문: KO 4행 `자기나 법에 정한 친족의 형사책임` / ZH 15행 `應在到庭前向承辦單位說明需要的語言。`, 41행 `所需語言應事先告知承辦單位。`
- 이유: 제180조 제1항 관계에는 약혼자·법정대리인 관계 등 친족에 한정되지 않는 경우가 있다. KO 본문은 `친족 등`이지만 요약에는 `등`도 없다. ZH 사전 언어 통지는 유용한 준비 안내이나, 제99·192조가 통역권의 전제조건으로 사전 신청을 요구하는 것은 아니다. KO·VI FAQ는 이를 명시적으로 권고한다.
- 수정안: KO `자기나 법에 정한 관계인의 형사책임`; ZH `建議到庭前先告知承辦單位需要哪一種語言的通譯。`
- 보존조건: 제181조의 형사소추·처벌 위험을 유지하고, 통역 제공 자체의 `應`은 약화하지 않는다. 사전 연락을 하지 않았다는 이유만으로 통역을 못 받는다고 쓰지 않는다.

## 직접 대조한 공식 법령과 확인 내용

2026-10-07 웹에서 현재 조문 링크를 각각 열어 읽었다. [법령 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=C0010001)은 최종 개정일을 2026-05-13으로 표시하고 그 개정 대상을 제101조의1로 기록한다. LawOldVer를 사용하지 않았다. 영문 전체 법령은 개정일이 2020-01-15로 표시되므로 최신성 판단 근거로 삼지 않았고, 법령 영문명 `Code of Criminal Procedure`만 확인했다.

| 공식 원문 | 원고와 대조한 요소 | 결과 |
|---|---|---|
| [제175조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=175) | 증명 사항·일시·장소, 검사/재판장/수명법관 서명 | 정확. 출석 24시간 전 송달 원칙·긴급 예외 등 다른 사항의 전부 열거를 요구하지 않음. |
| [제178조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=178) | 적법한 소환 AND 정당한 이유 없는 불출석, 최대 NT$30,000, 구인 가능, 법원의 과태료 재판 | 본문 5언어 모두 일치. ZH의 재소환 후 제재도 원문 근거 있음. |
| [제180조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=180) | 특정 신분관계 및 다른 공동피고인/공동자소인만의 사항 | 일반 설명은 맞음. VI 범위는 B03. |
| [제181조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=181) | 자신 또는 제180조 제1항 관계인의 형사소추/처벌 우려 | 기본 권리의 방향은 맞음. 직장 불편만으로는 이 요건이 아니라는 설명도 범위 내. |
| [제181조의1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=181-1) | 주신문 후 반대신문의 제한 | B01. |
| [제183조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=183) | 소명, 제181조 때 具結 대체 가능, 검사/법관 허가·기각 | 판단 주체는 정확. B02. |
| [제99조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=99), [제192조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=192) | 언어가 통하지 않는 경우 통역, 증인에 준용 | 5언어 모두 통역을 단순한 재량 혜택으로 약화하지 않음. 사전 통지 문구는 C03. |
| [사법원 증인 출석 FAQ](https://www.judicial.gov.tw/tw/cp-1654-2640-95539-1.html) | 증언거부권만으로 출석 의무가 없어지는지 | 원고 FAQ의 ‘없어지지 않는다’는 설명 확인. |

원고 안에 판결·통계·체험담·실존 의뢰인 사례는 없다. 법정 기한을 새로 주장하는 글도 아니므로 기산점 누락 지적을 임의로 만들지 않았다. 해외 체류·질병이면 자동 면제된다는 표현, 신청만 하면 기일이 바뀐다는 표현도 없다. 이 두 사정은 기관에 자료를 보내 판단받을 현실적 사유로 제시되어 있다.

## 문체·문장 다양성 §5 자기 점검

실행: `python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check <KO> <EN> <JA> <ZH>`

| 언어 | 문장 수 | CV | 아주 짧은 문장 비율 | run3 | 반복 오프너 | 끝 괄호 인용 | 대비 틀 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| KO | 24 | 0.452 | 0.208 | 0.000 | 0.000 | 0.000 | 0 | FAIL 0, 합니다체 어미 WARN |
| EN | 35 | 0.525 | 0.257 | 0.030 | 0.111 | 0.000 | 1 | FAIL 0 |
| JA | 26 | 0.457 | 0.154 | 0.000 | 0.000 | 0.000 | 0 | FAIL 0, です・ます 어미 WARN |
| ZH | 28 | 0.527 | 0.179 | 0.038 | 0.000 | 0.000 | 0 | FAIL 0 |

VI는 도구 미지원이다. `--lang en` 또는 `--lang ko`로 실행하지 않았으며 수치 PASS를 주장하지 않는다. 직접 확인한 짧은 호흡은 `Báo rõ ngày có thể tham dự.`, `Phải có nguy cơ về hình sự.`, `Vắng mặt có thể dẫn đến xử lý.`이다. 도입, 조문 설명, 출석 곤란, 질문, 거부 절차, 통역, 메모 준비의 문단 시작이 반복되지 않고, 긴 법률 문장 뒤에 짧은 설명이 배치되어 있다. VI 의미·어휘 개선점은 C02에 명시했다.

1. 지원4어 FAIL 0. KO·JA 경고는 정중체를 해라체·상체로 바꾸라는 뜻으로 적용하지 않았다. 법적 요건 보충 후 수치 재검사가 필요하다.
2. 5언어 모두 證人이라는 실제 문서의 표기를 풀이하는 구체적 사실로 시작하며 공식 가상사례 오프닝은 없다. 아직 완성되지 않은 4개 주제 배치 전체의 오프닝 분포는 판정하지 않았다.
3. 지원4어 아주 짧은 문장은 각각 5/9/4/5개 수준으로 도구상 최소 2개를 충족한다. VI도 위 직접 확인 기록이 있다. 긴 문장이 세 문장 연속 이어지는 구간은 발견하지 못했다.
4. 본문 문단 시작 단어의 3회 반복이 없다. 조문별 도입 자체가 법률 내용 구분에 필요한 범위다.
5. ‘주장+조문→다만’ 문단이 3회 연속하지 않는다. 각 언어 첫 문단과 마지막 준비 문단은 조문 없는 실무 설명이다.
6. 대비 틀은 자동 검사 범위 내. EN 37행 마지막 `Use Taiwan’s rules ... rather than assuming a familiar American procedural label ...`은 다소 추상적이므로 삭제해도 핵심 정보는 유지된다. 다만 한 문장만으로 MONOTONY 반려를 하지 않는다.
7. 마지막 본문은 직접 확인한 사실과 전해 들은 말·기억 불확실성을 나누는 준비로 끝난다. 정형 면책·상담 판촉이 아니다.
8. KO 합니다체, JA です・ます체 유지. 굵은 강조·지어낸 1인칭·명령형 체크리스트 소제목이 없다.
9. 원고를 수정하지 않았으므로 검수 과정에서 사실·조건·링크를 잃은 것은 없다. B01–B04 수정 후에는 법적 강도·숫자·출처의 새 대조가 필요하다.

현재 버전의 MONOTONY 반려 사유는 없다. 위 법률·고지 수정 요청과 문장 다양성 합격을 구별한다.

### 첫 두 문단 삭제 시험과 직전 글 비교

- 21행: 5언어 모두 證人 뜻/신분, 해외 귀국·일정 충돌에 관한 연락, 봉투 보관 또는 변경 확인이라는 실제 정보가 있다. 첫 문장만 삭제하면 문서 표기 해석이 빠지므로 유지할 가치가 있다.
- 25행: 법적 기재 사항·발행자와 경찰 연락 구분은 남겨야 한다. 삭제해도 정보 손실 없는 범위 예고 한 문장만 C01에 기록했다.
- KO·EN·JA·ZH: 파일 `published` 날짜와 번호를 정렬하여 직전 3편 345(MAP), 344(인지세), 342(주식 양도)를 비교했다. 각각 가상 거래 사례/오해 제시/과세 질문에서 출발하며 401의 문서 표기 풀이와 동일한 도입·소제목·끝맺음 틀을 반복하지 않는다.
- VI: 직전 3편은 203(이직 중개비), 070(여권·ARC 반환), 040(이혼 후 체류). 가상상황/법 조항 시작/장면 도입으로 401과 다르다. 예전 글의 판촉·면책 문장을 401에 복사하지 않았다. 비교를 위한 부분 읽기이며 그 기존 15편에 새 승인 판정을 내린 것은 아니다.

## 메타데이터·이미지 및 검수 한계

- 5개 파일의 제목·요약·본문·FAQ를 전부 읽었다. 내부 `author: legal-ai-assistant`, 각 언어 `audience`, `topic: criminal`, `criminal-litigation` 태그, FAQ 각 2문항, 게시일/수정일 2026-10-07을 확인했다. 출처 7개는 모두 본문과 끝 목록에 있다. B01 추가 시 목록도 갱신해야 한다.
- 굵은 강조(`**`, `__`, `<strong>`, `<b>`)는 정적 검색 결과 0. 변호사/원어민 검수 완료 주장이 없고 공개 AI 작성자 프로필·푸터도 없다.
- 이미지 파일이 실제 존재한다. `view_image`로 탁자·의자·유리잔·창을 직접 확인했다. 사람 얼굴·문자·로고·국기·사건 서류가 없으며 글과 모순되지 않는다. AI 캡션은 B04.
- 구조 확인용 기본 `node` 실행은 로컬 `libllhttp.9.3.dylib` 누락으로 시작하지 못했다. 이를 YAML 파서 통과로 보고하지 않는다. Python 표준 라이브러리로 현재 파일의 JSON 호환 인라인 필드(author/audience/tags/FAQ/날짜/이미지 경로)를 실제 파싱하여 값·개수를 재확인했다. 최종 제품 로더 검증은 root의 빌드 단계에 남아 있다.
- 필독 문서: 프로젝트 AGENTS, EDITORIAL-VOICE, FRONTMATTER, COLUMN-VOICE-RULE, SENTENCE-VARIETY-RULE, LESSONS 전문을 읽었다. 홈 `~/agent-library/knowledge/editorial-voice.md`와 `mac-studio-macbook-air-sync.md`는 이 환경에서 없었다. 문체 전문은 저장소의 배포용 정본 `docs/columns/EDITORIAL-VOICE.md`를 적용했다. FRONTMATTER 문서의 공개 AI 프로필 설명은 더 최신인 EDITORIAL-VOICE의 2026-10-03 지시보다 우선하지 않는다.

재검수 조건: B01–B04를 고친 실제 파일을 다시 제공하고, 변경 뒤의 지원4어 variety FAIL 0과 VI 직접 검토를 확인할 것. 이 보고서는 현재 SHA의 출판 승인이 아니다.
