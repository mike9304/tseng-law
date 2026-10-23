# Arabic independent locale review — ARC 704–706, r1

검수일: 2026-10-24 KST. 검수자: 독립 아랍어 편집 AI 역할. 현대 표준 아랍어와 대만법 안내를 검토했으며 사람 원어민·변호사 자격이나 그러한 감수를 주장하지 않는다. 이 검수자는 세 원고의 저자가 아니다. 공개 게시 승인이나 법률의견이 아닌 동결 원고의 독립 콘텐츠 검수다.

소유 범위는 이 보고서 하나다. 원고·저자 보고서·공용 도구·다른 검수 보고서를 수정하지 않았다.

## 초기 동결본과 r1 판정

아래 표는 수리 전 기록이다. 현재 최종 해시와 판정은 이 보고서 마지막의 `Repair1 독립 재검수` 절을 따른다.

`work/ar-author.md`의 세 SHA-256을 실제 `shasum -a 256` 결과와 대조했다. 아래 판정은 이 해시에만 적용한다.

| 원고 경로 (`repo/src/content/columns-ar/`) | 실제 SHA-256 | 판정 |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `4e9cef9758989e4a946a6f1ca89582a63327447d69451e0c715ee53c126d55db` | PASS — 중대한 콘텐츠 지적 없음 |
| `705-taiwan-visa-residence-work-study-family.md` | `bcfc0adff5f499ac3d222f41a7184c4707dcbb2a955dc06ce8f0a19ab58757a3` | REQUEST_CHANGES — R1-AR705-01 한 건 |
| `706-taiwan-arc-renewal-changes-reentry.md` | `72569a765fb8b8c1c30dfdd6f29090553861ffa3582bb2e5c65866ee1e8fd726` | PASS — 중대한 콘텐츠 지적 없음, 선택적 명료화 두 건 |

모든 판정에 `UNSUPPORTED_AR` 제한이 별도로 붙는다. 공용 문장 검사기는 아랍어를 지원하지 않으며 세 파일에 한국어 지표로 exit 1을 반환했다. 이는 아랍어 원고 결함의 증거가 아니고, 자동 문체검사 통과도 아니다.

## 필수 수정

| ID / file:line | 정확한 원문 | 이유와 근거 | 제한된 수정안 | 법적 의미 |
|---|---|---|---|---|
| R1-AR705-01 — `705-taiwan-visa-residence-work-study-family.md:50` | «بعد الدخول بإعفاء من التأشيرة أو بتأشيرة زيارة، متى كان العمل المهني مأذونًا به أو معفى من التصريح.» | 전문직과 취업허가 요건은 정확하지만, 실제 경로 선택을 안내하는 이 절에서는 입국 방식 자체의 제외도 명시해야 한다. 앞의 일반적인 “조건 충족” 표현만으로는 시험 면제나 조건부 온라인 여행허가도 같은 직접 거류 경로라고 읽을 여지가 남는다. [현행 NIA 0915, 주의사항 7(1)](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)은 시험 면제, 일부 동남아국 온라인 사전허가 등 입국방식을 제외하면서 관련 규정의 별도 예외를 유보한다. 이는 행정 신청 안내의 제한이며, 현행 전문인재법 제16조를 옛 제12조로 바꾸라는 뜻이 아니다. | 제50행 문단 뒤에 한 문장만 추가: «ويستبعد [دليل NIA](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) بعض طرق الدخول، ومنها الإعفاء التجريبي وتصريح السفر الإلكتروني المشروط لبعض دول جنوب شرق آسيا، ما لم تنص قواعد أخرى على استثناء؛ لذلك تُراجع طريقة الدخول نفسها قبل الاعتماد على هذا المسار.» 같은 출처를 끝의 목록에도 추가한다. 특정 국적의 허가를 일반화하거나 추가 국가별 표를 만들 필요는 없다. | 입국 경로 적용범위를 좁혀 명시하는 실질적 보완이다. 의미 보존만 하는 문체 수정으로 표시하지 않는다. 법 제16조의 적격 전문직·가족 직접신청 가능성은 그대로 유지한다. |

704 제30행은 자격별 경로를 먼저 확인하도록 하는 짧은 안내이고, 제50·62행에서 0915로 연결한다. 705처럼 상세한 직접신청 방법을 독립적으로 설명하는 문단이 아니므로 동일 보완을 세 글에 기계적으로 반복하도록 요구하지 않는다.

## 선택적 문체·용어 명료화

아래는 PASS를 막는 지적이 아니다. 저자는 채택 여부를 결정할 수 있다.

| file:line | 정확한 원문 | 이유 | 제안 | 법적 의미 |
|---|---|---|---|---|
| `706-taiwan-arc-renewal-changes-reentry.md:2` | «تجديد ARC في تايوان عند تغيير العنوان أو العمل أو جواز السفر» | 본문은 연장과 변경등록을 분리하지만 제목의 «عند تغيير»는 주소 변경 때 연장하는 글처럼 읽힐 수 있다. | «تجديد ARC في تايوان وتحديث بيانات العنوان والعمل والجواز» | 본문의 구별을 제목에 반영한다. 새로운 의무·기한을 추가하지 않는다. |
| `706-taiwan-arc-renewal-changes-reentry.md:79` 및 FAQ 답변 제22행의 대응 표현 | «على وقف النظر في الطلب إذا غادر المتقدم أثناء المعالجة.» | «وقف النظر»는 문맥상 처리를 그친다는 뜻으로 읽히지만, 잠정 중단 후 재개 가능성으로 받아들일 여지도 있다. [해당 시험운영 안내 주의사항 9](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)는 더 이상 심사하지 않으며 재입국 후 요건을 갖춘 경우 새 신청이 가능하다고 설명한다. | «على عدم مواصلة النظر في الطلب إذا غادر المتقدم أثناء المعالجة؛ ويمكنه تقديم طلب جديد بعد العودة إذا استوفى شروط هذا المسار.» FAQ는 «فبعض المسارات تنهي معالجة الطلب عند المغادرة» 정도로 맞출 수 있다. | 원문이 이미 해당 절차에 한정되어 있어 새로운 실질 결론은 아니다. 일시 정지와 혼동하지 않도록 명료화하며, 모든 온라인 신청에 확대하지 않는다. |

## 원고 전체 읽기와 실질 확인

세 원고 모두 frontmatter부터 마지막 공식 출처까지 전부 읽었다.

- 704: 입국 다음 날의 30일과 대만 내 거류비자 발급일부터의 30일이 제28·32행에서 구별된다. 첫 배우자 신청 동행과 1년 카드 표현은 NIA 0902 주의사항 1에 직접 대응한다. 사진·주소·목적별 자료가 분리되어 있고, 해외문서/번역을 모든 서류에 동일하게 적용하지 않는다. 제75행은 학생 승인→5근무일 내 납부→납부 후 IC카드 3근무일 수령 순서이며 신청 전체 기간으로 오독시키지 않는다. 제79행의 NT$1,000·NT$2,200과 僑生 제한, 제83행의 일반/학생 처리기간도 범위를 구별한다.
- 705: 국적, UAE·사우디 등 거주국, 증명서 발행국과 대만 내 활동을 다른 사실로 다룬다. 대만 배우자의 호적 및 거류승인 요건을 유지하고, 외국 전문직 가족을 모든 친족으로 넓히지 않는다. 정규유학과 중국어 학습을 분리했고 중국어 4개월 이수+최소3개월 등록, 주15시간, 결석·휴가 4분의1 조건이 공식 문서와 맞는다. 아랍어 사용자 전체에게 국적별 비자자격이나 취업권을 부여하지 않는다. 전문인재법 제16조의 입국방식 제한만 R1-AR705-01로 보완한다.
- 706: 제31행의 3개월은 일반 ARC에 한정된다. 제35행은 사업 유지 창업가의 4개월과 사업 소멸 후 별도 3개월 경로를 구별한다. Gold Card를 일반 3개월의 대상으로 단정하지 않는다. 제51·52행의 다음 날/사건 당일, 제53행의 별도 BOCA 15일 경로가 분리되어 있다. 제63행 졸업 후 연장은 승인신청이라는 전제를 보존한다. 여권번호 변경에 일반30일을 새로 만들지 않았고, 분실증빙을 경찰신고로만 제한하지 않는다. 접수증·사진에 재입국 보장을 부여하거나 모든 여권에 잔여6개월을 요구하지 않는다. 이미 만료된 경우의 처벌 후 재신청을 유예기간으로 쓰지 않는다.

아랍어는 전반적으로 전문적인 현대 표준어이며 구어체나 다른 국가의 거류제도를 대만 제도로 옮긴 표현이 없다. NIA/BOCA/ARC는 설명 후 일관되게 사용한다. 각 글의 독자가 준비할 자료와 다음 행위가 구체적이다. 실제 상담경험, 인간 작성자, 변호사 감수, 아랍어 상담·통번역·신청대행·승인보장 주장은 없다. 강제 CTA도 없다.

## 첫 두 문단 삭제 시험 — 검수자의 독립 판단

| 글 | 첫 문단 | 둘째 문단 | 결론 |
|---|---|---|---|
| 704 제28·30행 | 첫 문장은 대상·30일·다음 날의 기산점을 준다. 두 번째 문장을 지우면 업무/수업 시작일을 기산점으로 삼지 않는다는 설명과 직접 법령 연결이 없어진다. | 첫 문장은 비자방문/면제의 경로확인, 둘째는 적격 전문직·가족의 직접신청, 셋째는 첫 문단의 30일을 모든 방문자에게 넓히지 않는 제한이다. | 두 문단을 유지한다. 제목 반복이나 빈 배경 설명이 아니다. |
| 705 제29·31행 | 첫 질문은 제3국 거주자라는 구체적 독자 문제이고, 뒤 문장은 국적/여권 기준을 제시한다. «بلد الإقامة الحالي معلومة أخرى.»는 국적과 거주국의 구별을 압축한다. | 비자/ARC의 기능·기관 구별과 직접신청의 조건을 준다. 삭제하면 뒤의 비자/거류 전환 설명의 전제가 사라진다. | 유지한다. 질문과 답변이 다소 간결하지만 도입 예고문은 아니다. |
| 706 제29·31행 | 인쇄 만료일 전 사유소멸 가능성, 법적 효과와 계속거류 예외, 일/가족 사건을 단계적으로 제시한다. 마지막 짧은 문장은 앞의 변경사건 예시를 잇는다. | 일반 연장의 3개월 창구와 그 근거가 계속됨을 입증하는 자료를 제시한다. | 유지한다. 첫 문단을 삭제하면 날짜만 관리하면 된다는 오해를 막는 정보가 사라진다. |

## 실제 같은 언어 비교 3편

저자 및 research-europe가 지정한 로컬 원고의 첫 두 산문 문단·소제목·끝부분을 직접 읽었다. 게시 표시 최신인018·011과 2025-09-13 동률 가운데 마지막 수정이 최근인016을 사용했다. 세 파일 모두 이번 검수에서 공개 URL의 배포 상태를 검증한 것은 아니다.

| 실제 경로 (`repo/src/content/columns-ar/`) | 게시 표시 / lastmod | 비교 결과 |
|---|---|---|
| `018-taiwan-semiconductor-market-entry.md` | 2026-09-17 / 2026-10-07 | 본사에 제시된 계약·재고·인력 요구와 회사설립 질문으로 시작한다. 번호형 소제목과 기업의 위임·비밀자료 안내로 끝난다. 신규704–706의 숫자/여권조건 질문/카드효력 도입과 다르고, 개인 거류절차가 중심이다. |
| `011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md` | 2026-02-04 / 2026-07-25 | 긴 수입·PIF·광고 책임 목록과 본문 분류 예고가 도입을 차지한다. 말미 체크리스트·긴 면책·사람 서명은 신규에 복제되지 않았다. |
| `016-taiwan-inheritance-custody-analysis.md` | 2025-09-13 / 2026-10-11 | 상속·부부재산·미성년자 권한의 긴 분류를 두 문단 연속으로 설명하고 11개 번호 절을 사용한다. 신규는 이 수동 의무/명사열 구성을 따르지 않으며 마지막 실무 행동도 서로 다르다. |

세 신규 글의 실질 마무리는 각각 허가·학적 만료일 대조(704 제85행), 불명확한 입국방식 확인(705 제78행), 여행일·변경일·신청번호·귀환서류 대조(706 제83행)다. 관련글/면책/출처 꼬리를 같은 결론 문단으로 세지 않았다.

## 문장 다양성 §5 수동 재검수

| 항목 | 독립 결과 |
|---|---|
| 1. 정확한 CLI | 세 파일 모두 실행. 아래 출력 그대로 exit1/[ko]. 아랍어 quantitative PASS 불가. |
| 2. 도입 유형 | 704 숫자·기산점,705 제3국 거주자의 질문,706 사유소멸의 효과. 공식 가상사례 도입이나 동일 유형 반복 없음. |
| 3. 짧은 문장과 긴 문장 | 의미 있는 짧은 문장이 글마다 두 개 이상 존재한다. 704 «تُعاد الأصول بعد مطابقتها.»/«احتفظ بنسخة مما أرسلته.»;705 «تصدر ARC عند الموافقة.»/«شهادة القبول بداية الملف.»;706 «تبقى شروط الحضور قائمة عند التمديد.»/«طابق الصلاحية مع موعد العودة أيضًا.» 긴 자격문 뒤에 결과·행동 문장이 있어 길이가 단조롭게 이어지지 않는다. 임의 아랍어 수치 임계값은 만들지 않았다. |
| 4. 문단 시작 | 산문 문단의 첫말을 직접 대조했다. 동일한 실질 시작어가 세 문단 이상 반복되는 지배적 패턴이 없다. و·ف 같은 자연스러운 접속문자를 독립 어휘와 혼동하지 않았다. |
| 5. 인용/예외 리듬 | 링크는 문장 중간·문단 앞/뒤에 분산되고, 자료정리·복사본 보관·일정 대조 같은 무인용 행동 문단도 있다. 주장→조문→예외가 세 문단 연속 반복되지 않는다. |
| 6. 대비 틀 | 비자/ARC, 학교입학/허가, 접수/재입국, 변경등록/근무허가의 구별은 독자의 실제 판단에 필요하다. «ليس…بل…»를 반복하는 문장 틀이나 근거 없는 허수아비 반박은 없다. |
| 7. 마무리 | 세 실질 마지막 문단은 해당 글의 자료·날짜·입국방식으로 끝난다. 동일한 상담유도나 상투적 성공 약속 없음. |
| 8. 문체·형식 | 현대 표준 아랍어 설명체. 굵은 강조·본문H1·꾸며낸 1인칭·공개 작성자/검수주장 없음. 표와 번호목록은 비교 또는 실제 신청순서에만 사용한다. |
| 9. 사실 보존 | 이 검수자는 원고를 수정하지 않았다. 제안은 법적 범위 보완과 선택적 명료화로 구분했다. 숫자·기산점·조건·출처를 문장 리듬 때문에 제거하라고 요청하지 않는다. |

수동 검수에서 필수 MONOTONY 지적은 없다. 공용 도구의 한국어 지표 실패를 아랍어 단조로움 판정으로 전환하지 않았다.

## 실제 CLI 실행 증거

검수자가 동결본에 다음 세 명령을 각각 직접 실행했다. 언어 강제 옵션이나 도구 변경은 하지 않았다.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ar/704-taiwan-arc-first-application.md
exit_code: 1
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ar/704-taiwan-arc-first-application.md [ko] sentences=22 mean=184.3 cv=0.339 short=0.0 run3=0.3 opener_rep=0.0 cite_end=0.0 cite_para=0.273 contrast=0 caveat=0 q=0
  FAIL len_cv=0.339 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md
exit_code: 1
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md [ko] sentences=19 mean=220.7 cv=0.283 short=0.0 run3=0.176 opener_rep=0.0 cite_end=0.0 cite_para=0.368 contrast=0 caveat=0 q=0
  FAIL len_cv=0.283 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ar/706-taiwan-arc-renewal-changes-reentry.md
exit_code: 1
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ar/706-taiwan-arc-renewal-changes-reentry.md [ko] sentences=22 mean=206.4 cv=0.275 short=0.0 run3=0.25 opener_rep=0.045 cite_end=0.0 cite_para=0.455 contrast=0 caveat=0 q=0
  FAIL len_cv=0.275 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

읽기 전용 Node 검사로 실제 `gray-matter` 파싱, 필수13필드·FAQ3·topic/locale/internal-author·본문H1/굵은강조·로컬 링크 존재·명시적 bidi control을 별도로 확인했다. 세 파일 모두 `errors: []`, `badLinks: []`, `sourceDate: true`, `trailingWhitespace: []`였다. 유효한 아랍어 문장 지표나 브라우저 QA를 대신하는 검사가 아니다.

## 직접 연 공식 출처 및 확인 범위

모두 2026-10-24에 직접 열었다. 법령 조문과 행정 안내를 구분했다. 웹사이트 footer 날짜를 법 시행일로 쓰지 않았다. 아래는 실제 표본 대조의 범위이며 연구자의 전체 출처 열람을 이 검수자의 전수검증으로 복제한 기록이 아니다.

| 출처 | 이번 검수에서 읽고 대조한 범위 |
|---|---|
| [이민법22조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22) | 입국 다음 날30일·통합문서 예외·일반3년 상한 |
| [이민법23조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23) | 60일 방문비자 조건, 가족과 학업 경로의 범위 |
| [이민법31조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31) | 사유소멸·계속거류 예외·주소/근무장소 다음 날30일·초과체류 처벌 후 재신청 |
| [이민법 영문 전체, 제34조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132) | 거류 중 출국 전에 재입국허가, APRC의 별도 예외. 단독 중문 URL이 열리지 않아 원고가 실제 연결한 공식 영문 본문으로 확인 |
| [거류규칙 전체](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129) | 제7조 사유변경의 사건일30/15일, 제9조 일반3개월, 제11조 졸업연장, 제13조 가족기간 |
| [전문인재법16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) | 전문직 및 특정 가족의 직접신청, 승인 전제를 가진 가족경로 |
| [전문인재법9조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=9) | Gold Card의 네 기능을 한 문서로 통합한다는 짧은 설명 |
| [취업서비스법48조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48) | 호적 있는 대만 국민과 혼인하고 거류승인을 받은 외국인의 허가 예외 |
| [수수료 표준](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135) | 제3·7조의 금액과 학생감면 범위, 제10조의 시행 구별 |
| [BOCA 국내 거류비자 발급 후 ARC FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html) | 국내 비자 발급일부터30일 |
| [NIA0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970) | 서류·사진·번역·주소·첫 배우자 동행/1년·처리기간·분실 증빙 |
| [NIA0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) | 전문직/학생/가족 경로, 주의사항7(1)의 입국방식 제외. 옛 조문번호가 남은 대목은 현행16조로 대체 대조 |
| [NIA 학생0929, 2026-08-28](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news) | 문서파일 형식·승인 후 납부·전자/IC 수령·학생 처리기간 |
| [BOCA 정규유학](https://www.boca.gov.tw/cp-166-283-c4da3-2.html) | 양식 제출·정규학업 경로·일반 비자면제/다른 목적 방문의 전환 제한 |
| [BOCA 중국어 학습](https://www.boca.gov.tw/fp-166-285-041cb-2.html) | 4개월+최소3개월,15시간,결석/휴가4분의1 |
| [NIA 창업가348924](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) | 주의사항3의 사업 근거4개월과6의 사업소멸 별도3개월 |
| [NIA 전문직·가족 시험운영](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) | 주의사항9의 출국 시 더 이상 심사하지 않음·재신청 구조 |
| [실제 사무소 contact](https://tseng-law.com/en/contact), [services](https://tseng-law.com/en/services) | 비자·거류 문의 및 English/Chinese/Korean/Japanese 상담과 다른 언어 소통방법 사전확인. 원고에 이를 초과하는 Arabic 보장이 없음 |

## 접근·검증 한계와 다음 행동

- 전문인재법 연혁의 [영문](https://law.moj.gov.tw/ENG/LawClass/LawHistory.aspx?pcode=A0030295) 및 [중문](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295) URL은 이 웹 도구에서 `not accessible`이었다. 현행 제9·16조 본문은 열렸다. 원고에는 공포일을 시행일로 혼동한 날짜 주장이 없으며, 이 검수에서 연혁 페이지까지 확인했다고 기록하지 않는다.
- [이민법34조 단독 URL](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=34)은 도구 접근불가였다. 이후 원고가 연결한 [공식 영문 전체 본문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132) 제34조를 직접 열어 출국 전 재입국허가와 APRC 예외를 확인했다. 단독 URL 실패를 법적 근거 부재나 원고 오류로 처리하지 않았다.
- [NIA 여권 FAQ](https://www.immigration.gov.tw/5382/5385/12162/12197/414977/)는 첫 경로가 접근불가였고 [다른 공식 경로](https://www.immigration.gov.tw/5385/12162/12197/414977/)는 페이지를 열었지만 본문 추출이 충분하지 않았다. 706은 보편적 여권잔여6개월 조건을 쓰지 않으므로 이 출처만으로 새 문구를 요구하지 않았다.
- COLUMN-VOICE-RULE이 가리키는 `~/agent-library/knowledge/editorial-voice.md`는 없었다. 현재 repo의 `docs/columns/EDITORIAL-VOICE.md` 전문과 사용자 지침을 기준으로 검수했다. Fable 의무 게이트의 역사 문구는 재도입하지 않았다.
- 실브라우저의 RTL·숫자/Latin 약어·표·링크 줄바꿈은 보지 않았다. Markdown 문법과 텍스트를 읽고 bidi control 부재를 확인했을 뿐 화면 검증 PASS가 아니다.
- 원고의 모든 외부 URL을 상태코드로 전수검사하거나, 실제 신청·납부·항공사 탑승·공개 게시를 수행한 것은 아니다. 로컬 내부 링크 존재 확인도 live HTTP 결과와 다르다.
- 다음 수리는 705에 R1-AR705-01 한 문장 및 출처항목을 추가하는 범위다. 새 해시를 받으면 해당 문단·가족 직접신청 문단·결론·출처 목록과 영향을 받은 FAQ를 다시 읽는다. 선택적706 수정을 채택하면 그 부분도 새 해시에서 재확인한다. 전면 재작성이나 폭넓은 연구 재시작은 필요 없다.

준비 때 사용한 메모리는 편집·내부 provenance 탐색용이었다: MEMORY.md:550–557, rollout IDs `01a0fd9e-4fb7-7710-a095-b3a75eae5929`, `01a10169-8632-72c2-aea0-63c905035c9f`. 현행 법적 판단은 위 공식 원문 표본에 근거한다.

## Repair1 독립 재검수 — 최종 콘텐츠 판정

재검수일: 2026-10-24 KST. 동일 독립 검수자가 705의 필수 지적 R1-AR705-01에 대한 첫 수리를 검토했다. 저자 역할을 맡거나 원고를 수정하지 않았다.

`work/ar-author.md`의 Repair1 기록과 실제 파일 해시가 일치한다. 검수자가 읽기 전용 Python으로 새 문단 하나와 출처항목 하나를 메모리상 제거했을 때, 이전 705 해시 `bcfc0adff5f499ac3d222f41a7184c4707dcbb2a955dc06ce8f0a19ab58757a3`가 정확히 재구성됐다. 출력: `independent_repair_scope: PASS`, `removed_paragraphs: 1; removed_source_entries: 1; files_written: 0`. 따라서 그 두 추가 이외의 본문·메타데이터 변경은 없다. 704·706도 기존 해시와 같다.

| 현재 원고 경로 (`repo/src/content/columns-ar/`) | 현재 SHA-256 | 최종 독립 콘텐츠 판정 |
|---|---|---|
| `704-taiwan-arc-first-application.md` | `4e9cef9758989e4a946a6f1ca89582a63327447d69451e0c715ee53c126d55db` | PASS — 불변본의 r1 판정 유지 |
| `705-taiwan-visa-residence-work-study-family.md` | `76bdb97426dad84ebbd099bcf8c2717e250ee476354f75b21758a92273bdf2d6` | PASS — R1-AR705-01 해소 |
| `706-taiwan-arc-renewal-changes-reentry.md` | `72569a765fb8b8c1c30dfdd6f29090553861ffa3582bb2e5c65866ee1e8fd726` | PASS — 불변본의 r1 판정 유지; 선택적 수정 미채택은 차단 사유 아님 |

제52행의 실제 추가 문장은 다음과 같다.

> ويستبعد [دليل NIA](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news) بعض طرق الدخول، ومنها الإعفاء التجريبي وتصريح السفر الإلكتروني المشروط لبعض دول جنوب شرق آسيا، ما لم تنص قواعد أخرى على استثناء؛ لذلك تُراجع طريقة الدخول نفسها قبل الاعتماد على هذا المسار.

이 문장은 같은 검수일에 직접 읽은 NIA0915 주의사항7(1)의 입국방식 제한과 별도 규정의 예외 유보를 함께 담는다. 일반적 전문직 직접신청 가능성은 제50행에 유지되고, 해당 제한을 모든 무비자 입국의 절대 금지로 바꾸지 않았다. 실제 원고의 제93행 출처항목에도 같은 공식 URL이 들어 있다. 아랍어 문장 연결이 자연스럽고, 추가 내용의 법적 성격은 적용범위의 실질적 보완이라는 r1 판단과 같다.

영향 범위로 제50–56행, 가족 경로 제70–74행, FAQ 제21–26행, 결론 제80–84행, 출처 목록을 다시 읽었다. 전문직의 선행 거류승인, 허용 가족 범위, 학생/가족 ARC의 자동 취업권 부정, 국적과 제3국 거주 구별은 그대로다. 제80행의 입국방식 확인 행동과 새 문장도 일치한다. 첫 두 문단·세 글의 마무리 구조가 변하지 않았고, 새 문장으로 필수 MONOTONY 문제가 생기지 않았다. 새로운 필수 지적은 없다.

변경된705에만 정확한 공용 CLI를 다시 실행했다. 실제 결과는 다음과 같으며 여전히 `UNSUPPORTED_AR`다.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md
exit_code: 1
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-ar/705-taiwan-visa-residence-work-study-family.md [ko] sentences=20 mean=218.2 cv=0.283 short=0.0 run3=0.167 opener_rep=0.0 cite_end=0.0 cite_para=0.35 contrast=0 caveat=0 q=0
  FAIL len_cv=0.283 (limit >= 0.45): sentence-length variation (stdev/mean) too low — mix very short and long sentences
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

최종 세 PASS는 위 해시의 독립 콘텐츠 판정이다. 아랍어 자동 문체검사 통과, 실제 브라우저 RTL 화면 검증, 공개 게시 또는 변호사·사람 원어민 감수를 뜻하지 않는다. 추가 필수 원고 수리는 없다.
