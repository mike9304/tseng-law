# 한국어 ARC·비자 704–706 독립 언어 검수 r1

검토일: 2026-10-24 KST. 검수자: `/root/review_ko`, 한국어 편집 검수 역할의 AI 에이전트. 세 원고의 저자가 아니며 원고를 수정하지 않았다. 사람 원어민·변호사 검수 또는 공개 승인으로 표시하지 않는다. 이 파일만 작성했다.

## 판정과 검토 대상

원고 경로 기준: `/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/`.

| 원고 | 판정 | 검토한 SHA-256 | 필수 수정 범위 |
|---|---|---|---|
| `704-taiwan-arc-first-application.md` | REQUEST_CHANGES | `fd3bb840ca1dbdcec96527cacd72e151dc6e6091305bff2e443079a2d8be6e21` | 본문에서 사용한 BOCA 공관 목록을 끝 출처 목록에도 추가. |
| `705-taiwan-visa-residence-work-study-family.md` | REQUEST_CHANGES | `9b64ff4aa1c3a49028858940929757907bff7fc5c40bddd6dc18b7cfa0b0c1a7` | 직접 신청의 입국 방식별 제외·예외, 배우자의 지위 표현, BOCA 공관 출처 목록. |
| `706-taiwan-arc-renewal-changes-reentry.md` | PASS | `231fe675c7032dffcd79c8f4f4fcd618afb39dc1a73d53737a295e4d01065723` | 필수 수정 없음. 이 해시에 대한 독립 언어·범위 검토 판정이며 최종 법률·게시 승인과 구별한다. |

저자 인계 `work/ko-author.md`의 최종 SHA-256은 `c1352d50f9bef129f60303ebfea2665d5b9cee0c7bc50432ebb0af6217d18566`이다. 보고서 전문을 읽고 위 세 해시를 실제 파일의 `shasum -a 256` 출력과 대조했다. 처음 고정 원고를 읽을 때와 판정 작성 직전의 세 해시가 같다. 저자 자기 점검을 독립 검수로 대체하지 않았다.

적용 자료: `work/LOCALE-REVIEW.md`, `work/BRIEF.md`, `work/research-arc.md`, `work/research-paths.md`, `work/research-asia.md`의 한국어·공통 서비스 부분, `work/reviews/final-core.md`, repo `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, `/Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md`, `LESSONS.md`, `/Users/son7/.codex/skills/tseng-law-editorial/SKILL.md`와 `references/review-criteria.md`. 현재의 공개 작성자 표시 금지와 Fable 자동 적용 폐기를 우선했다.

## 필수 수정 사항

### KO704-01 — 본문에 사용한 공관 목록의 출처 항목 누락

- 위치: `704-taiwan-arc-first-application.md:59`, 끝 목록 `:97`–`:105`.
- 정확한 문장: “[BOCA 재외공관 목록](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html)에는 한국 주재 대표부와 부산 사무처가 따로 나옵니다.”
- 이유: 실제 BOCA 목록에서 두 공관 항목을 확인했다. 문장 자체의 사실 오류는 발견하지 않았다. 다만 이 URL이 글 끝 공식 자료 목록에 없다. `LESSONS.md:83`–`:84`는 본문에서 사용한 출처를 끝 목록에도 두도록 정한다. 저자 인계 보고서에 해당 출처가 있어도 원고의 누락을 대신하지 않는다.
- 제안: 공식 자료 목록에 `- BOCA [재외공관 목록](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html).` 한 항목을 추가한다. 본문은 유지한다.
- 법률 의미: 보존. 법률 조건·대상·기한을 바꾸지 않는 출처 목록 보완이다.

### KO705-01 — 직접 거류 신청 설명에 입국 방식별 제외 조건을 연결

- 위치: `705-taiwan-visa-residence-work-study-family.md:36`; FAQ `:17`과 가족 표 `:61`의 같은 경로 설명도 영향 범위로 확인한다.
- 정확한 문장: “외국전문인재 유치·고용법상 전문인재·특정전문인재가 전문 업무 허가를 받았거나 허가 면제 대상이라면, 무비자 또는 방문비자로 입국한 뒤 이민서에 거류를 직접 신청할 수 있습니다.”
- 이유: 현행 제16조의 전문 업무 허가·면제 요건과 직접 신청 경로는 맞다. 그러나 한국어 독자를 한국 국적자로 한정하지 않는 이 글에서 ‘무비자’의 범위를 구체적으로 구별하지 않는다. 현행 [NIA 0915 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) 주의사항 7(1)은 시범 무비자, 도착비자, 동남아 국가 국민의 온라인 사전 여행허가, ABTC, 워킹홀리데이 및 제한 표기 비자 등의 제외와 별도 규정에 따른 예외를 명시한다. 끝의 일반적인 ‘국적·비자 표기 확인’만으로는 이 차이를 알아보기 어렵다. 모든 무비자 입국이 불가능하다는 반대 방향의 단정도 피해야 한다.
- 제안: 제36행 단락 뒤에 다음 정도의 한정 설명을 추가한다. “시범 무비자, 동남아 국가 국민 대상 온라인 사전 여행허가(TAC) 등은 [이민서 0915 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)의 직접 거류 신청 제외 대상에 포함됩니다. 별도 규정에 따른 예외가 있는지는 입국 전에 확인합니다.” 새 출처를 끝 공식 자료에도 추가한다. FAQ 1에도 “입국 방식별 제외 조건과 예외도 확인해야 합니다.” 정도를 붙여 독립적으로 읽어도 무제한 경로로 보이지 않게 한다. 가족 표에는 필요한 경우 본문 안내로 연결하며 같은 제외 목록을 반복할 필요는 없다.
- 법률 의미: 실질 보완. 원문의 일반적인 무비자 설명에 행정 안내상 제외·예외를 연결하므로 최종 법률 검수 대상이다. 제16조의 법정 경로를 폐지하거나 특정 국적의 신청 가능 여부를 일괄 단정하는 수정이 아니다.

### KO705-02 — ‘외국인 배우자’의 관계 주체가 모호함

- 위치: `705-taiwan-visa-residence-work-study-family.md:65`.
- 정확한 문장: “외국인 배우자나 학생의 취업까지 이 한 규정으로 설명하지는 않습니다.”
- 이유: 바로 앞 문장은 대만 호적 국민과 혼인하고 거류 허가를 받은 ‘외국인’의 고용허가 면제를 설명한다. 이어지는 ‘외국인 배우자’는 그 면제 대상 배우자를 다시 가리키는 말로도 읽힌다. 이 글의 표가 구분한 것은 대만인의 배우자와 외국인 거주자의 배우자이다. [취업서비스법 제48조 제1항 제2호](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48)의 대상을 바꾸지 않으면서 관계 주체를 명시해야 한다.
- 제안: “외국인 거주자의 배우자나 학생에게 적용되는 취업허가 규정은 따로 확인합니다.”
- 법률 의미: 의도된 구별을 보존하고 명확하게 한다. 다른 배우자에게 취업이 금지된다거나 자동 허가된다는 결론을 추가하지 않는다. 당사자 범위를 명시하는 수정이므로 최종 법률 검수에서 제48조와의 연결을 확인한다.

### KO705-03 — 본문 공관 목록의 출처 항목 누락

- 위치: `705-taiwan-visa-residence-work-study-family.md:42`, 끝 목록 `:75`–`:83`.
- 정확한 문장: “한국에서 발급한 문서의 인증·번역 요구는 [BOCA 목록의 한국 주재 공관](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html)에서 담당 접수처를 찾아 확인합니다.”
- 이유: 본문에서 사용한 BOCA 공관 목록 URL이 끝 목록에 없다. KO704-01과 같은 현행 출처 목록 규칙이 적용된다.
- 제안: 공식 자료 목록에 `- BOCA [재외공관 목록](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html).`을 추가한다. 다른 BOCA 항목에 묶어도 된다.
- 법률 의미: 보존. 개별 한국 서류의 인증 순서나 공관 관할을 새로 확정하지 않는다.

706에는 필수 수정 사항이 없다. 선택적인 문장 취향을 필수 반려 사유로 올리지 않았다. 추가 선택 수정 제안도 없다.

## 첫 두 문단의 독립 삭제 시험

동결 원고의 실제 첫 두 문단을 읽고 문장 또는 문단을 가렸을 때 사라지는 정보를 확인했다. 저자가 동결 전에 삭제한 문장은 현재 판정 대상이 아니다.

| 원고·위치 | 삭제 시 손실과 판정 |
|---|---|
| 704 `:24` | 첫 문장의 입국 다음 날부터 30일, 둘째 문장의 접수기관, 셋째 문장의 통합 증명 예외가 각각 다른 기능을 한다. 문단을 지우면 가장 먼저 필요한 기한과 예외가 사라진다. 유지. |
| 704 `:26` | 여권·목적 증빙·주소를 함께 놓는 행동, 무비자/방문 입국자의 선행 자격 판단, 0915 확인처, 입국 전 독자를 705로 안내하는 연결이 있다. 일반적인 범위 예고만 하는 문단이 아니다. 유지. |
| 705 `:24` | 취업과 어학의 무비자 선입국이라는 구체적 선택을 질문하고 서로 다른 답과 조문을 제시한다. 질문만 지우면 독자의 선택 상황이 사라지고, 뒤 두 설명을 지우면 질문에 답하지 못한다. 유지하되 본문의 제외 조건은 KO705-01로 보완. |
| 705 `:26` | 한국어와 국적의 구별 및 외국인 체계와 대륙·홍콩·마카오·무호적국민 체계의 경계를 각각 정한다. 다른 문단의 관념적 반복이 아니므로 유지. |
| 706 `:24` | 퇴사·이혼 후 카드 만료일만 믿을 수 없는 이유와 계속 거류 예외를 함께 제시한다. 삭제하면 근거 상실과 카드 유효기간의 차이를 놓친다. 유지. |
| 706 `:26` | 한국 방문의 출국·귀환일, 이사일, 고용 종료일, 새 허가 기간, 카드 만료일을 실제 신청 기준과 연결한다. 단순히 ‘날짜가 중요하다’고 반복하지 않는다. 유지. |

세 도입은 기한 제시, 입국 선택 질문, 거류 근거 상실의 결과로 서로 다르다. 삭제해도 정보가 그대로 남는 빈 도입 문장이나 동일한 가상 의뢰인 장면을 찾지 못했다.

## 실제 한국어 비교 원고 3편

아래 세 로컬 파일의 본문·메타데이터를 직접 읽었다. 모두 `published`와 `lastmod`가 2026-10-22이다. 실제 로컬 비교 증거이며 세 공개 URL의 최신 배포 상태를 재확인했다는 주장은 하지 않는다. 비교할 원고가 없어 생긴 공백은 없다.

| 비교 원고 (`repo/src/content/columns/` 아래) | 실제 문장·구조 증거 | 704–706과의 비교 |
|---|---|---|
| `650-taiwan-mixed-family-baby-surname-chinese-name-passport-home-registration.md` | ‘대만 호적에는 陳, 한국 가족관계등록부에는 김’이라는 성씨 차이로 연다. ‘대만은 출생등기 전에 서면으로 정합니다’, ‘한국은 혼인신고 때의 협의가 기준입니다’ 등 양국 문서 순서로 전개하며 마지막에 이메일·주소를 제시한다. | 새 글의 한국 맥락은 발령·학교 자료·관계증명·귀환 일정이다. 성씨 장면이나 양국 법 비교 구조를 재활용하지 않는다. |
| `651-taiwan-contract-penalty-clause-reduction-civil-code-252-2026-judgments.md` | 최고법원의 위약금 성격 판단으로 연다. ‘성격부터 정한다’, ‘줄이는 두 조문’, ‘하루 1%가 0.1%로’, ‘깎이지 않은 경우’처럼 판결을 대비한다. 연락처 뒤에는 환송 사실로 돌아간다. | 새 글은 각각 접수 순서, 자격 경로, 변경 사건별 날짜로 전개한다. 판결의 승패 대비나 수치 사례를 가져오지 않는다. |
| `652-taiwan-hospital-death-autopsy-request-complaint-medical-mediation.md` | ‘화장하기 전에 부검을 요청할 수 있을까요?’로 시작해 가족의 요청과 검사의 판단을 나눈다. ‘검시는 검사의 일입니다’, ‘고소해도 조정이 먼저’, ‘사인과 과실은 다릅니다’라는 구체적 구별이 이어진다. 마지막에는 법률업무·이메일·주소가 나온다. | 705도 질문으로 열지만 취업·어학 입국 방식이라는 다른 결정에 바로 답한다. 704·706의 도입은 질문이 아니다. 세 글 끝에 동일한 상담 문구를 반복하지 않고, 실제 문의 연결은 706에만 둔다. |

비교 파일 SHA-256:

```text
650: 625157efa8b8d78ef7ad9df47f083b5972ed7032b7ee38a2f4a9f76554cd3e2e
651: f189cd3bc95f4b7bc51629fbe50d4c1c53a8f0e182589d66ae69b8251490a2ca
652: ac3f061f95e8961e24b755cfef42b0fbf27d2f53f5e264e528cf947ed8b19d87
```

## 공식 근거의 독립 확인과 법률·서비스 경계

아래는 이번 검수에서 실제로 연 공식 원문이다. 현행 통합 조문, 시행 연혁, 행정 안내의 게시·수정일을 구별했다. 시행 예정안·초안을 현행법 근거로 사용하지 않았다. 확인일은 2026-10-24이며 MOJ 사이트의 관측된 자료 정리 기준일은 2026-10-16이다.

| 직접 열람한 근거 | 확인한 범위와 원고 판단 |
|---|---|
| [이민법 제22조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22), [BOCA 국내 거류비자 발급 FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) | 704의 거류비자 입국 다음 날부터 30일, 통합 증명 예외, 국내 비자 변경 발급일부터 30일을 서로 구별했다. BOCA FAQ 게시일은 2024-01-02이다. |
| [이민법 제23조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23), [제31조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31), [현행 전문 제23조의1·제34조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132) | 방문비자 조건, 자격별 변경, 근거 소멸과 계속 거류 예외, 주소·근무장소 변경 다음 날 기산, 재입국허가와 APRC 예외를 확인했다. 706은 인쇄된 만료일까지의 체류나 자동 유예를 보장하지 않는다. |
| [거류 규칙 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129), [제9조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=9), [연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0080129) | 제5·7·9·11·12·20조를 확인했다. 일반 연장 만료 전 3개월, 해당 사유 변경 발생일부터 30일, 다른 사유의 15일 경로, 졸업자 1년+1회/총 2년, 첫 대만인 배우자 ARC 1년 한도, ARC와 재입국허가의 연결을 대조했다. 2025-12-30 개정 조항의 2026-01-01 시행과 앞선 2024 시행 항목을 구별했다. |
| [수수료 기준 제3·7·10조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135) | NT$1,000/년·1년 미만의 1년분, 무비자·방문 입국 직접 신청 NT$2,200 가산, 僑生 감면, 분실·훼손 재발급 NT$500을 확인했다. 제3조 시행일은 2024-03-01이다. 모든 정보변경에 NT$500을 부과한다는 문장은 없다. |
| [외국전문인재법 제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16), [현행 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295), [시행 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) | 제16조 직접 신청·법정 가족, 제17조 해당 전문인재/가족 6개월+1회/총 1년, 금카드 체계를 확인했다. 2025-09-24 개정의 대부분은 2026-01-01 시행이고 일부 조항은 2026-06-30 시행이다. 원고 제16조의 2026-01-01 표기는 맞다. 특정 전문인재 배우자의 별도 취업허가 신청 제도도 제48조의 자동 면제와 섞지 않았다. |
| [취업서비스법 제48조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) | 대만 호적 국민과 혼인하고 거류 허가를 받은 외국인의 고용허가 면제 조건을 확인했다. KO705-02는 해당 범위를 읽기 쉽게 구분하는 수정이다. |
| [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), [NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | 둘 다 2026-04-14 수정 영어 안내. 사진 최근 2년, 목적별 증빙, 재직증명 기간, 원본 대조, 해외 문서 인증과 중국어 번역 요구 가능성을 대조했다. 0915의 입국 방식별 제외·예외는 KO705-01 근거이다. 오래된 조문 번호 표기를 현행 법률보다 우선하지 않았다. |
| [NIA 학생 안내 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news) | 2026-08-28 안내. 학생 승인 후 5근무일 안 납부, 전자 ARC 6개월 이하, IC 카드 납부 후 3근무일의 수령 조건, 학생 심사 5근무일과 보완 제외를 확인했다. 어학 연장 1회 최장 6개월·통상 총 2년은 다른 거류 종류에 일반화하지 않는다. |
| [BOCA 학위 학생](https://www.boca.gov.tw/cp-166-283-c4da3-2.html), [어학 방문비자](https://www.boca.gov.tw/fp-158-260-9690c-2.html), [어학 거류](https://www.boca.gov.tw/fp-166-285-041cb-2.html) | 학위와 어학, 입학허가와 거류 허가, 입국 목적을 구별했다. 어학의 4개월 수학·추가 3개월 이상 등록·평일 주 15시간·휴가 포함 결석 1/4 기준을 확인했다. 학생 안내 영어의 일부 ‘more than’ 표현보다 조문과 세부 증빙의 ‘이상’을 따랐다. BOCA 비자 사진 6개월을 ARC 사진 2년과 혼동하지 않는다. |
| [BOCA 공관 목록](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html) | 한국 주재 대표부와 부산 사무처가 따로 있는 것을 확인했다. 한국 발급 문서마다 동일한 인증 순서를 확정하지 않은 본문은 적절하다. 출처 목록 누락만 수리한다. |
| [취업금카드 공식 소개](https://goldcard.nat.gov.tw/en/about/) | 4증 통합, 고용주 사전 확정 없이 자격 심사를 거치는 설명을 확인했다. 카드만으로 모든 신청이 승인된다는 서술은 없다. |
| [NIA 창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/), [금카드 연장 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) | 각각 2025-02-17·2026-02-10 수정. 사업 유지 창업가와 금카드 자체 갱신의 만료 전 4개월을 706이 별도로 다룬다. 사업 소멸 후의 다른 연장이나 일반 ARC에 4개월을 일괄 적용하지 않는다. |
| [NIA 전문인재 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) | 2024-01-01 수정 안내의 대상과 심사 중 출국 시 영향 문구를 확인했다. 706은 이 온라인 경로의 주의사항으로 연결하며 모든 ARC 신청에 동일한 출국 효과를 단정하지 않는다. |
| [NIA 해외 연장·분실 공고](https://www.immigration.gov.tw/5385/7229/7232/368785/), [NIA Easy Pack FAQ](https://news.immigration.gov.tw/EasyPack/Detail/DDA469F4-E2D0-4A98-847C-21432DCC040E?lang=EN) | 2024-05-17 해외 공고의 본인 온라인/대리 신청 인증 차이와 구형 카드·단수 허가 예외, FAQ의 여권 정보 갱신을 확인했다. 공통 법정 30일을 여권 변경에 임의로 붙이지 않았고 해외 분실자의 탑승을 보장하지 않는다. |
| [NIA 유효 ARC/APRC의 여권 안내](https://www.immigration.gov.tw/5385/12162/12197/414977/) | 2026-06-29 FAQ. 유효 ARC/APRC 재입국에 여권 잔여 6개월을 일률적으로 요구한다는 오류가 706에 없음을 확인했다. 관련 없는 새 여권 요건 문장을 추가하도록 요구하지 않는다. |
| [사무소 한국어 문의 안내](https://tseng-law.com/ko/contact) | 실제 이메일 `wei@hoveringlaw.com.tw`와 대만 비자·거류 관련 문의 범위, 첫 연락에 민감한 신분서류를 요구하지 않는 안내를 확인했다. 706의 제한된 문의 문장은 서비스 범위 안이다. 승인 보장·대행 약속·외국 변호사 자격·모든 언어 상담 주장은 없다. |

접근 제한: 일부 `LawHistory` 및 단일 조문 URL의 직접 열기는 `not accessible via this tool`로 실패했다. 전문 또는 전문 페이지의 연혁 링크를 통해 A0030295·D0080129 연혁, D0080129 제7조, D0080132 제34조를 회수해 실제로 읽었다. 회수된 근거를 미열람으로 남기지 않는다. 저자 보고서가 밝힌 한국 대표부 사이트의 403은 저자 측 제한이며, 이 검수는 실제 열람한 BOCA 공식 공관 목록까지만 근거로 사용했다. 개별 공관의 한국 서류 인증 절차를 검증했다고 주장하지 않는다.

## 한국어 문체·구조·형식 확인

- 대만법을 설명하는 합니다체를 유지한다. 한국어 독자와 한국 국적자를 구분하며 한국법을 대만 체류 요건으로 바꿔 쓰지 않는다. 단, 배우자 관계 명칭은 KO705-02로 고친다.
- 704는 최초 접수, 705는 입국 전 자격 경로, 706은 만료·변경·출입국 관리로 역할이 나뉜다. 같은 상담 결말이나 판촉 문구를 세 편에 복제하지 않는다.
- 허가·신청·증빙·기산점·예외를 구분한다. ARC만 있으면 일할 수 있다는 주장, 승인·입국 보장, 자동 연장/유예, 허구의 의뢰인·실적·변호사 경험을 찾지 못했다.
- 실제 읽기 검사에서 세 편 모두 본문 H1 없음, 굵은 글씨 없음, FAQ 3개를 확인했다. 내부 `author: legal-ai-assistant`가 유지되고 공개 AI/사람 작성자 표시를 본문에 추가하지 않았다.
- 원고에 쓰인 `/ko/columns/` 링크는 해당 로컬 slug 파일이 모두 존재했다. 704→705·706, 705→704·706·027·028, 706→704·705를 확인했다. 새 원고 링크의 공개 배포 성공을 의미하지 않는다.
- 본문 외부 출처와 끝 목록을 대조한 결과 누락 URL은 704·705의 BOCA 공관 목록뿐이었다. 706에서는 누락을 찾지 못했다.

## 문장 다양성 규칙 §5 독립 점검

| 항목 | 검수 관찰 |
|---|---|
| 1. 실제 CLI | 세 파일 모두 한국어로 자동 인식되고 exit 0, FAIL 0. 아래는 검수자가 독립 실행한 실제 출력이다. |
| 2. 도입 | 기한 사실/입국 선택 질문/근거 상실 결과로 다르다. 첫 두 문단 삭제 시험에서 불필요한 관념적 도입을 찾지 못했다. |
| 3. 길이 리듬 | CLI의 짧은 문장 비율은 각각 0.132/0.133/0.118이며 아주 짧은 문장은 9/8/10개이다. ‘신청처는 내정부 이민서입니다’, ‘허가되면 ARC를 받습니다’처럼 실제 정보가 있는 짧은 문장이 조건 설명과 교차한다. 기한·허가 요건을 잘라 의미를 잃은 문장을 찾지 못했다. |
| 4. 문단 시작 | 최대 동일 첫 단어 반복은 704의 ‘온라인’ 2회, 705의 ‘가족’ 2회이고 706은 동일 시작 반복이 없다. 동일 주어·접속어가 연속 문단을 지배하지 않는다. |
| 5. 인용·단서 리듬 | 문장 끝 괄호 인용은 0, ‘다만’은 0. 조문을 문장 앞이나 주어 자리에 두고 자료 준비·출국 일정·접수 행동을 독립 문단으로 둔다. 세 문단 연속 주장–근거–단서 틀을 찾지 못했다. |
| 6. 대비 | 자동 검출 대비는 0. 수동 검토에서도 직접적인 반복 대비 틀이 글마다 3개를 넘지 않는다. 비자/거류, 학생/어학, 전문직/일반 이주노동자, 날짜별 기산점의 구별은 법률 의미를 전달한다. 필요한 자격 제한을 문체 점수를 위해 없애지 않는다. |
| 7. 마무리 | 704는 접수 자료 보관, 705는 출국 전 근거 문서 대조, 706은 만료일·경위를 갖춘 제한적 문의로 끝난다. 시리즈 링크·확인일·출처라는 구조적 꼬리와 본문 결말을 구분했다. |
| 8. 한국어·형식 | 합니다체를 유지하면서 서술·부정·질문의 기능을 나눴다. 705·706의 질문 각 1개, 704의 질문 0개는 각각의 절차 목적과 FAQ를 고려하면 결함이 아니다. ‘반드시’의 반복·지어낸 1인칭·굵은 강조를 찾지 못했다. |
| 9. 정확성 보존 | 30일의 서로 다른 기산점, 15일, 3개월/4개월, 학습 4개월+3개월, 15시간·1/4, 수수료, 졸업·전문인재 연장 기간을 공식 근거와 대조했다. 705의 신청 범위 보완은 문체 수리로 숨기지 않고 실질 법률 보완으로 분류했다. |

`니다.` 종결 WARN은 남는다. 합니다체 안에서 동사와 문장 기능이 달라지고 실제 짧은 문장이 있으므로 이 WARN만을 이유로 반말·해요체를 섞도록 요구하지 않는다. 필수 반려 사유에 해당하는 구체적 MONOTONY 패턴은 발견하지 않았다.

독립 실행 명령과 출력:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/704-taiwan-arc-first-application.md [ko] sentences=68 mean=33.1 cv=0.47 short=0.132 run3=0.015 opener_rep=0.048 cite_end=0.0 cite_para=0.238 contrast=0 caveat=0 q=0
  WARN 100% of sentences end in '니다.' — vary endings within the register
exit_code=0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/705-taiwan-visa-residence-work-study-family.md [ko] sentences=60 mean=34.6 cv=0.453 short=0.133 run3=0.052 opener_rep=0.062 cite_end=0.0 cite_para=0.375 contrast=0 caveat=0 q=1
  WARN 98% of sentences end in '니다.' — vary endings within the register
exit_code=0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/706-taiwan-arc-renewal-changes-reentry.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=85 mean=35.2 cv=0.478 short=0.118 run3=0.048 opener_rep=0.0 cite_end=0.0 cite_para=0.56 contrast=0 caveat=0 q=1
  WARN 99% of sentences end in '니다.' — vary endings within the register
exit_code=0
```

한국어는 현재 도구의 지원 언어다. 다른 10개 언어의 기본 한국어 처리 문제를 이 세 파일의 제한으로 잘못 적용하지 않았다. 언어 강제 옵션이나 검사기 수정은 하지 않았다. 지표는 실제 법률 의미·문체 검토를 대신하지 않는다.

## 미해결 사항과 한정된 다음 단계

1. 저자는 704의 출처 목록 한 항목, 705의 위 세 항목만 수리한다. 705의 새 0915 출처를 본문과 끝 목록에 함께 두고 FAQ 1 및 가족 표가 새 한정 설명과 충돌하지 않는지 확인한다. 다른 경로나 상세 국적별 규정으로 글을 넓힐 필요는 없다.
2. 저자는 수정 파일의 새 SHA-256과 실제 CLI 결과를 인계한다. 다음 독립 검수는 바뀐 문장·출처 목록·영향받는 FAQ/결론과 해시를 대상으로 한다. 전면 재집필이나 광범위한 재조사를 요구하지 않는다. 706은 현재 해시 그대로 유지할 수 있다.
3. KO705-01은 법률 실질 보완, KO705-02는 당사자 범위 명료화이므로 최종 법률 검수에 표시한다. 이 검수의 PASS는 개별 신청 자격 판정·실제 신청 승인·게시 승인으로 확장하지 않는다.
4. 인증된 신청 포털, 실제 접수·납부·탑승, 새 원고의 공개 반영, 브라우저 화면, 빌드·배포를 검증하지 않았다. 비교 원고는 로컬 본문으로 검토했다. 담당 공관별 한국 문서 인증과 개별 여권 변경 법정 기한은 확정하지 않았고 원고도 이를 확정 사실로 쓰지 않는다.

필수 반영 전 상태는 704 REQUEST_CHANGES / 705 REQUEST_CHANGES / 706 PASS이다. 수정은 root를 통해 저자에게 전달하며 이 검수자는 원고를 변경하지 않는다.

## Repair1 독립 재확인 — 2026-10-24 KST

위 r1 기록은 그대로 보존한다. 이 절은 저자의 repair1 이후 새 해시에 대한 최신 판정이다. 같은 독립 검수자가 변경 문장과 관련 FAQ·가족 표·출처 목록을 다시 읽었다. 원고는 읽기 전용으로 유지했고 이 보고서 끝에만 결과를 추가했다.

### 최신 해시와 판정

저자 보고서 `work/ko-author.md`의 현재 SHA-256은 `d1f41520943391c1db1bc4022433926b6d6fbbd34937dea3b3019f7d2342db10`이다. 상단 동결 해시와 `독립 r1 반영 — repair1` 절을 실제 원고와 대조했다.

| 원고 (`repo/src/content/columns/` 아래) | 최신 판정 | 현재 SHA-256 |
|---|---|---|
| `704-taiwan-arc-first-application.md` | PASS | `65b288e62a4c140294370e3f91373d8cfd86479853d98cd5ea69f4402b65e04b` |
| `705-taiwan-visa-residence-work-study-family.md` | PASS | `96c730f343307dad0945f1af73d267ca1d124e5eb1aa91808ec5101069ce99f4` |
| `706-taiwan-arc-renewal-changes-reentry.md` | PASS 유지 | `231fe675c7032dffcd79c8f4f4fcd618afb39dc1a73d53737a295e4d01065723` |

706은 실제 SHA-256이 r1 PASS 대상과 같아 기존 판정을 유지한다. 수정되지 않은 원고를 새로 전면 검수했다고 표시하지 않는다.

### 필수 지적의 해결 확인

| 지적 | repair1의 실제 문장·위치 | 독립 판단 |
|---|---|---|
| KO704-01 | `704:106`에 `- BOCA [재외공관 목록](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html).` 추가. | 해결. 본문 `:59`의 URL과 일치하고 본문은 그대로다. 법률 의미 보존. |
| KO705-01 | `705:38`에 “시범 무비자, 도착비자, 동남아 국가 국민 대상 온라인 사전 여행허가(TAC), ABTC, 워킹홀리데이 등은 [이민서 0915 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)의 직접 거류 신청 제외 대상에 포함됩니다. 비자에 붙은 제한 문구도 봅니다. 별도 규정에 따른 예외가 있는지는 입국 전에 확인합니다.” 추가. | 해결. 제외와 별도 규정의 예외를 함께 남겨 모든 무비자 입국자 또는 특정 국적 전원의 신청 불가로 확대하지 않는다. 이 보완은 법률 실질 보완이라는 r1 분류를 유지한다. |
| KO705-01의 FAQ·가족 표 영향 | `705:17`에 “입국 방식별 제외 조건과 별도 규정의 예외도 확인해야 합니다.”, `705:63`에 “입국 방식별 제외와 예외는 앞의 0915 안내를 함께 봅니다.” 추가. `:85`에 0915 출처 추가. | 해결. FAQ를 따로 읽을 때도 조건 확인이 남고, 가족 표와 본문의 안내가 연결된다. 새 출처의 본문·끝 목록 대응도 확인했다. 제16조의 법정 직접 신청 설명은 유지된다. |
| KO705-02 | `705:67`의 “외국인 거주자의 배우자나 학생에게 적용되는 취업허가 규정은 따로 확인합니다.” | 해결. 바로 앞의 대만 호적 국민과 혼인한 외국인에 대한 면제와 다른 관계 주체가 구별된다. 다른 배우자의 취업을 금지하거나 자동 허가하는 새 결론을 넣지 않았다. 의도된 법률 의미를 보존한다. |
| KO705-03 | `705:84`에 `- BOCA [재외공관 목록](https://www.boca.gov.tw/sp-foof-countrylp-01-2.html).` 추가. | 해결. 본문 `:44`의 URL과 일치한다. 법률 의미 보존. |

추가된 입국 방식 설명은 같은 날 [NIA 0915 주의사항 7(1)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)을 다시 열어 제외 유형·비자 제한 표기·별도 규정의 예외를 대조했다. 새 제한 문구가 이 안내에 근거한다는 귀속도 명시되어 있다. 그 밖의 공식 근거는 r1에서 실제 열람한 기록을 사용했으며 광범위한 법률 재조사를 반복하지 않았다.

### 변경 범위와 회귀 확인

실제 파일에서 위 수정만 메모리상의 문자열로 되돌린 다음 SHA-256을 계산했다. 디스크 원고를 변경하지 않는 읽기 검사다. 704는 공관 출처 한 줄, 705는 제외 단락·FAQ 문장·가족 표 문장·배우자 문장·두 출처 추가만 되돌렸을 때 각각 r1의 원래 SHA-256과 정확히 일치했다. 따라서 이 수리에서 도입·기한·수수료·다른 자격 조건·마무리·메타데이터가 함께 바뀌지 않았음을 확인했다.

```text
704-taiwan-arc-first-application.md only_declared_repairs=True restored_r1_sha256=fd3bb840ca1dbdcec96527cacd72e151dc6e6091305bff2e443079a2d8be6e21 source_list_missing=[] faq=3
705-taiwan-visa-residence-work-study-family.md only_declared_repairs=True restored_r1_sha256=9b64ff4aa1c3a49028858940929757907bff7fc5c40bddd6dc18b7cfa0b0c1a7 source_list_missing=[] faq=3
Read-only string comparison; no files written.
exit_code=0
```

수정 범위 안에서 새 필수 결함이나 MONOTONY 반려 사항을 찾지 못했다. 705의 긴 제외 목록 뒤에는 비자 제한 문구와 예외 확인을 나눈 짧은 문장이 이어진다. 이 문장은 전문직의 법정 신청 경로를 지우지 않으며, 배우자 문장과 FAQ도 본문 결론을 뒤집지 않는다. 본문 인라인 URL의 끝 목록 누락은 두 원고 모두 0개, FAQ는 각각 3개다.

§5는 변경부와 그 영향을 다시 점검했다. 704 본문 지표는 그대로이고 705의 짧은 문장은 9개다. 새로운 상투적 도입·반복 결말·반드시 반복·연속 주장–근거–단서 틀은 생기지 않았다. 첫 두 문단과 비교 대상·결말은 변하지 않았으므로 r1의 독립 삭제 시험과 실제 한국어 비교 3편의 증거를 유지한다. 합니다체의 종결 WARN을 없애기 위해 문체를 바꾸도록 요구하지 않는다.

### 수정된 두 원고의 독립 CLI 재실행

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/704-taiwan-arc-first-application.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/704-taiwan-arc-first-application.md [ko] sentences=68 mean=33.1 cv=0.47 short=0.132 run3=0.015 opener_rep=0.048 cite_end=0.0 cite_para=0.238 contrast=0 caveat=0 q=0
  WARN 100% of sentences end in '니다.' — vary endings within the register
exit_code=0

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/705-taiwan-visa-residence-work-study-family.md
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns/705-taiwan-visa-residence-work-study-family.md [ko] sentences=63 mean=34.8 cv=0.466 short=0.143 run3=0.066 opener_rep=0.059 cite_end=0.0 cite_para=0.353 contrast=0 caveat=0 q=1
  WARN 98% of sentences end in '니다.' — vary endings within the register
exit_code=0
```

두 편 모두 실제 exit 0 / FAIL 0이다. 706은 원고 해시가 불변이므로 r1의 독립 CLI 증거를 유지하며 이 차례에 불필요하게 재실행하지 않았다.

### 남은 범위와 다음 단계

독립 한국어 검수의 미해결 필수 수정은 0건이며 저자에게 추가 수리를 요청하지 않는다. 705의 제외·예외 보완과 관계 주체 명료화는 최종 법률 검수에 변경 사항으로 인계한다. 현재 세 PASS는 위 각 해시에 한정한다. 실제 신청·승인·게시·빌드·브라우저·배포 검증은 이 재검수의 범위 밖이며 r1에 기록한 접근·서비스 범위 제한도 유지한다.
