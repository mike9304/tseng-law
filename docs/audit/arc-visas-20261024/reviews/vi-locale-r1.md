# VI 704–706 독립 언어 검수 r1

검수일: 2026-10-24. 검수자: `review_vi`. 이 검수자는 해당 원고를 작성하지 않았다. 아래 판정은 동결된 베트남어 원고의 언어·독자 관점·법률 의미와 주요 공식 근거를 확인한 결과이며, 사람 원어민·변호사 인증이나 게시 승인이 아니다. 원고·저자 보고서·공용 검사기는 수정하지 않았다. 이 보고서만 작성했다.

ROOT: `/Users/son7/tseng-arc-visas-20261024`. 아래 원고 경로는 ROOT 기준이다. 저자 인계 `work/vi-author.md`의 SHA-256은 `7d292a1f87e4fc1bb2b8890dcdbb14eb9be1a925c279bbc11ccec37f8472461e`이며, 실제 원고 해시와 인계 표의 세 해시가 모두 일치함을 `shasum -a 256`으로 확인한 뒤 전문 검수를 진행했다. 원고가 바뀌면 이 판정은 새 버전에 자동 승계되지 않는다.

## 판정

| 원고 | 판정 | 검수한 SHA-256 | 결과 |
|---|---|---|---|
| `repo/src/content/columns-vi/704-taiwan-arc-first-application.md` | PASS | `ede9dd40337e817986845c9d848146db4bff12cca637f96eb24c6e0d351144bb` | 필수 수정 없음. 국내 거류비자 발급일과 입국 다음 날의 구분, 목적별 서류·창구, 카드와 취업허가의 차이를 유지했다. |
| `repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md` | REQUEST_CHANGES | `8d307a5369c222f7d63b06cbd15f698d87d029507b2edc3fd308de8f74cf9dab` | VI-01 한 건. 직접 NIA 신청 설명에 TAC·시험적 무비자 제외와 별도 규정 예외를 구체화해야 한다. |
| `repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md` | PASS | `1c73d84fff7aab96960314d6e659e34cd5141ad9d3f4699e1a6e1ffc633a5165` | 필수 수정 없음. 일반 3개월·별도 프로그램 4개월, 발생일/다음 날, 변경·분실·재입국을 구분했다. 선택적 문장 축약 한 건과 수동 §5.6 경계 관찰은 아래에 남긴다. |

세 편 모두 공유 문장 검사기의 베트남어 측정은 불가능하다. PASS 두 건은 독립 내용 검수 판정이며 자동 문체 검사 PASS 또는 전체 게시 검증 완료를 뜻하지 않는다. 검수 중 공용 검사기가 갱신되어, 초기의 잘못된 `[ko]` 측정과 최신 exit 2 미측정 결과를 구분해 기록했다.

## 필수 수정 VI-01 — 직접 신청의 입국 프로그램 제한

- 위치: `repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md:35`.
- 정확한 문제 문장: “Người thuộc các diện này, nhập cảnh bằng thị thực lưu trú hoặc miễn thị thực, có thể xin cư trú trực tiếp tại NIA khi đã được phép hoặc thuộc diện miễn phép làm công việc chuyên môn.”
- 영향을 받는 같은 파일 59행의 정확한 문장: “Khi người bảo trợ thuộc nhóm luật định đã được phép cư trú hoặc thường trú, vợ hoặc chồng, con chưa thành niên và con đã thành niên không thể tự chăm sóc do khuyết tật thể chất hoặc tinh thần có thể thuộc diện xin trực tiếp tại NIA nếu nhập cảnh bằng thị thực lưu trú hoặc miễn thị thực.”
- 이유: 현행 [外國專業人才延攬及僱用法 제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16)의 대상 전문직·허가 또는 면제·가족 범위 자체는 정확히 제한되어 있다. 다만 [NIA 0915 직접 거류 신청 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)의 7(1)은 시험적 무비자, 동남아 국가 국민의 온라인 사전 심사 TAC 등 특정 입국 방식을 제외하면서 별도 규정이 있는 경우를 남긴다. 해당 안내는 2026-04-14 갱신된 행정 안내이며 법률 조문의 문구와 동일한 층위로 취급하지 않았다. 본문의 `miễn thị thực`만으로는 TAC도 같은 직접 신청 경로라는 판단을 유도할 수 있다. 16행 FAQ의 “Điều kiện này không áp dụng chung cho mọi công việc, hộ chiếu hay chương trình nhập cảnh.”는 방향은 맞지만 이 구체적인 제한을 전달하지 못한다.
- 최소 수정 제안: 31행의 일반적인 직접 NIA 신청 설명 뒤에 아래 두 문장을 넣고 공식 출처 목록에도 같은 NIA 0915 링크를 추가한다. 35·59행의 대상·허가·가족 조건과 제16조 번호는 보존한다. FAQ의 포괄적 주의문은 삽입 문장과 모순이 없는지만 다시 읽는다.

> Theo [hướng dẫn NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), người nhập cảnh bằng giấy chấp thuận nhập cảnh theo hệ thống Travel Authorization Certificate (TAC) hoặc theo chương trình miễn thị thực thí điểm không được nộp theo đường này, trừ khi có quy định riêng. Cần xác nhận đúng chương trình nhập cảnh với NIA trước khi dựa vào Điều 16 để dự tính ở lại.

- 법률 의미: 단순한 유창성 수정이 아니다. 독자가 이해하는 직접 신청 범위를 좁혀 행정 안내의 제한과 별도 규정 예외를 드러내는 실질 보완이므로 최종 법률 검수 대상이다. 무비자 입국자의 모든 직접 신청을 금지하는 문장으로 바꾸거나, TAC의 국적별 발급 자격까지 추가하지 않는다. 전문직 본인·가족에 관한 제16조와 NIA 안내의 관계를 최종 법률 검수에서 확인한다.

## 선택적 문체 제안 — 필수 반려 사유 아님

| 위치 | 정확한 원문 | 이유·제안 | 법률 의미 |
|---|---|---|---|
| `repo/src/content/columns-vi/704-taiwan-arc-first-application.md:29` | “Ở đường này, mốc bắt đầu là ngày cấp.” | `Ở đường này`는 이해 가능하나 덜 자연스럽다. “Trong trường hợp này, thời hạn được tính từ ngày cấp thị thực cư trú.”로 바꾸면 무엇의 발급일인지도 명확하다. 바로 앞 문장과 중복이므로 그대로 두어도 필수 결함은 아니다. | 보존. 발급 다음 날로 바꾸지 않는다. |
| `repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md:77` | “Nếu chưa từng có thẻ, quy trình cần bắt đầu từ [hồ sơ ARC lần đầu](/vi/columns/taiwan-arc-first-application), thay vì mục gia hạn.” | 마지막 안내에서 불필요한 대비 꼬리를 줄일 수 있다. “Nếu chưa từng có thẻ, hãy xem [hồ sơ ARC lần đầu](/vi/columns/taiwan-arc-first-application).” | 보존. 첫 신청으로 연결하는 안내만 간결하게 한다. |

## 첫 두 문단 삭제 시험

세 편의 본문 첫 두 문단(각 23·25행)을 제외하고 첫 소제목부터 읽는 비파괴 시험을 독립적으로 했다. 결과는 모두 유지이다.

| 원고 | 삭제 시 실제 정보 손실 | 판정 |
|---|---|---|
| 704 | 입국 다음 날부터 30일이라는 기준, 취업일·기숙사 입주일과의 차이, ARC의 뜻, 단기체류·무비자 입국에 자동 전환권이 생기지 않는다는 범위가 사라진다. 첫 소제목 아래는 국내 거류비자 발급일을 설명하므로 앞부분 없이 두 기산점을 이해하기 어렵다. | 추상적 서론이 아니다. 두 문단 유지. |
| 705 | 채용·입학·혼인 증명과 허가의 관계, 취업허가의 별도 심사, 언어와 국적의 차이, 출발 전 해외 비자/직접 NIA 경로를 정해야 하는 이유가 없어진다. 첫 질문은 다음 문장의 `Mỗi giấy`가 가리키는 서류를 제공한다. | 독자의 실제 결정에 연결된다. 유지하되 VI-01 보완. |
| 706 | 카드 만료일보다 먼저 체류 사유가 사라질 수 있다는 핵심과 예외, 계약·학교·가족 변경의 각 발생일을 분리해야 한다는 설명을 잃는다. 바로 갱신 소제목으로 시작하면 변경 사건을 일반 갱신으로 오인하기 쉽다. | 두 문단 모두 필요하다. |

## 실제 같은 언어 비교 3편

아래 세 파일의 로컬 전문을 독립적으로 읽었다. 모두 frontmatter의 `published`/`lastmod`가 2026-10-08이다. 공개 URL을 각각 열려고 했으나 도구가 `not accessible via this tool`을 반환했다. 공개 화면 비교를 완료했다고 주장하지 않으며, 이 오류를 404나 미게시 증거로 해석하지 않았다.

| 비교 파일 — `repo/src/content/columns-vi/` | 구체적 근거 | 이번 세 편과의 비교 |
|---|---|---|
| `442-taiwan-police-interview-vietnamese-interpreter-lawyer.md` | 26행은 일상 중국어와 `cố ý`, `nhận hộ`, `đồng ý giao tài khoản` 같은 조사 표현을 구분한다. 30행은 “Giấy hẹn ghi gì, cơ quan nào đang hỏi?”이다. 60행은 아는 사실·모르는 사실과 원본 자료를 분리하는 행동으로 끝난다. | 704는 통역·경찰의 장면을 복제하지 않고 날짜를 먼저 제시한다. 서류를 손에 놓고 판단한다는 실용성은 공통이지만 도입과 사건 구조가 다르다. |
| `443-taiwan-sexual-assault-report-vietnamese-workers-residents.md` | 26행 “Bạn có thể tìm hỗ trợ y tế và an toàn mà không cần tự xác định chính xác tội danh trước.”는 죄명 확정 전에 필요한 행동을 제시한다. 이후 진료·증거·배우자 사건의 기한·동행·개인정보를 나눈다. 64행은 안전하게 연락받을 곳·언어·동행과 다음 일정으로 끝난다. | 705도 결정 순서를 제시하지만 출국 전 입국·체류 근거의 선택을 다룬다. 피해사례나 상담 경험을 만들지 않았고, 기존 글의 지원 서비스나 통역을 사무소가 제공한다고 옮기지 않았다. |
| `444-taiwan-short-sentence-fine-suspension-residence.md` | 26행 “Trên bản án, 罰金 là hình phạt tiền.”에서 세 개념을 구분한다. 58행은 “Cư trú và giấy phép làm việc sau bản án”이다. 66행은 판결·납부 영수증·ARC·취업허가와 각각의 기한으로 끝난다. | 706은 형사판결의 효과를 재서술하지 않고 고용·학업·가족 변화, 새 여권, 분실, 여행에 초점을 둔다. 결말도 여행 서류와 실제 복귀일에 연결된다. |

공개 비교 시도 URL: [442](https://tseng-law.com/vi/columns/taiwan-police-interview-vietnamese-interpreter-lawyer), [443](https://tseng-law.com/vi/columns/taiwan-sexual-assault-report-vietnamese-workers-residents), [444](https://tseng-law.com/vi/columns/taiwan-short-sentence-fine-suspension-residence). 새 704·705·706 사이에서도 숫자 기산일 / 독자의 서류 질문 / 사유 변경의 결과로 도입이 나뉘고, 결말은 카드와 보관본 / 한 장의 목적 자료 / 복귀일과 여행 서류로 구분된다.

## 법률·출처·업무 범위 대조

검수에서 직접 연 공식 원문과 대조 범위는 다음과 같다. 법령 본문과 행정 안내를 구분했으며, 안내의 게시·갱신일을 법 시행일로 부르지 않았다. 다른 언어 원고나 저자 자기점검만으로 아래 내용을 승인하지 않았다.

| 범위 | 직접 열어 확인한 근거·관찰 |
|---|---|
| 704 첫 30일과 국내 발급일 | [移民法 제22조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22)의 입국 다음 날, 유효한 ARC 기능 통합증 예외를 확인했다. [BOCA FAQ](https://www.boca.gov.tw/fp-398-723-7b71f-1.html)(2024-01-02)는 국내 거류비자 발급일부터 30일을 별도로 설명한다. 원고 23·29·31행 및 FAQ가 이 차이를 보존한다. |
| 704 서류·사진·동행·처리기간 | [居留辦法 전체본문 제5조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129), [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970)(갱신 2026-04-14). 최근 2년 사진, 해당 취업 증명 최근 1개월, 외국 문서 인증·중문 번역 조건, 첫 대만 호적 국민 배우자 동행·1년, 일반 10근무일 및 반환·보완·면담 제외와 보완 후 재계산을 확인했다. 모든 절차의 10일 완료·수령 보장으로 쓰지 않았다. |
| 704 학생 자료·온라인 단계 | [NIA 학생 영문 안내](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news)(2026-08-28)의 입학/재학 자료 1개월, 해당 건강검진 자료 3개월 및 승인·납부·수령의 서로 다른 단계도 확인했다. 원고는 5근무일 납부·납부 후 3근무일 수령 같은 세부 숫자를 주장하지 않는다. 이를 빠뜨렸다는 이유로 새 내용을 요구하지 않는다. |
| 704·706 수수료 | [수수료 규정 전체본문 제3·7·10조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135). 일반 1년 NT$1,000, 1년 미만 1년분, 방문/무비자 입국 후 거류의 NT$2,200 가산, 僑生 감면, 분실·훼손 재발급 NT$500의 범위를 확인했다. 제10조에서 제3조의 2024-03-01 시행을 구분할 수 있다. 모든 정보 변경을 NT$500으로 쓰지 않았다. |
| 705 전문직·가족·직접 신청 | [외국 전문인력법 제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16) 및 [현행 전체본문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295), [NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news). 전문직의 허가/면제, 허가된 거류·영주를 가진 법정 전문직의 배우자·미성년 자녀·해당 장애 성년 자녀를 확인했다. 모든 노동자·모든 친족으로 확대하지 않는다. 입국 프로그램 제한의 구체화는 VI-01로 요청한다. |
| 705 학위·중국어 학습 | [BOCA 정규학생](https://www.boca.gov.tw/cp-166-283-c4da3-2.html)(갱신 2024-05-01), [중국어 방문비자](https://www.boca.gov.tw/fp-158-260-9690c-2.html)(2025-10-14), [중국어 거류비자](https://www.boca.gov.tw/fp-166-285-041cb-2.html), [移民法 제23조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23). 입국 목적 제한, 4개월 수학+최소 3개월 계속 등록, 주중 주 15시간, 허가된 결석을 포함한 1/4 상한을 대조했다. 학비 납부일을 수학일로 바꾸지 않았다. |
| 705 가족·취업권 | 위 제23조와 [취업서비스법 제48조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=48). 60일 이상 방문비자 및 제한 주석 조건, 대만 호적·일부 노동자 초청자 제외, 대만 호적 국민과 혼인하고 거류가 허가된 사람의 취업허가 예외를 구분했다. 외국인 배우자 전원에게 같은 예외를 확대하지 않았다. 혼인 효력일·등록일·증명서 발급일은 57행에서 분리한다. 베트남 혼인법을 대신 주장하지 않는다. |
| 706 일반 갱신과 특례 | [居留辦法 제9조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=9) 및 위 전체본문의 일반 3개월. [NIA Gold Card 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) 주의(6)의 4개월과 [창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/)(2025-02-17 갱신)의 사업 기반 4개월/사업 소멸 후 별도 3개월 경로를 직접 읽었다. 29·31행과 FAQ가 일반 규칙과 특례를 구분한다. |
| 706 변경일·사유 소멸·기한 경과 | [移民法 제31조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31), [제23-1조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23-1), 위 居留辦法 전체본문 제7조. 주소/근무장소의 다음 날부터 30일, 해당 사유 변경의 발생일부터 30일, 제23-1조 제1항 밖 경로의 발생일부터 15일을 대조했다. 30일 미만 초과 체류는 기존 사유 존속·처벌 후 신청 조건이며 유예가 아니다. 가정폭력 이혼 예외의 대만 거주·호적 국민 배우자·미재혼, 진행 중 노동쟁송의 조건을 유지했다. |
| 706 분실·재발급·재입국 | [NIA 국내외 ARC 안내](https://www.immigration.gov.tw/5385/7229/7232/368785/)(2024-05-17), [移民法 전체본문 제34조](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132), [전문직·가족 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/), 위 학생 안내. 분실 진술서/경찰 신고서 대안, 구카드 반환, 재입국 사전 허가와 APRC 예외, 전문직 온라인 심사 중 출국 영향 및 학생 경로 구분을 확인했다. 접수증·사진이 입국을 보장한다고 쓰지 않는다. |
| 706 여권·베트남어 실무 안내 | [NIA 여권 유효기간 FAQ](https://www.immigration.gov.tw/5385/12162/12197/414977/)(2026-06-29)로 유효한 ARC/APRC 재입국자에게 보편적인 잔존 6개월을 부과하지 않는 점을 확인했다. 원고에 그 잘못된 조건은 없다. [WDA 베트남어 안내](https://fw.wda.gov.tw/wda-employer/home/file/2c95efb38d75b733018d78214fd00590)는 중개인 위임 시 처리시점 확인과 지연·보관 문제를 다룬다. 열람 중 갱신일 표시는 2026-10-19/2026-10-24로 달랐으나 본문이 특정 갱신일을 주장하지 않아 결함으로 삼지 않았다. |
| 실제 사무소 상담 범위 | [현재 contact](https://tseng-law.com/en/contact)를 직접 열어 이메일과 중국어·영어·일본어·한국어의 네 상담 언어를 확인했다. 706:75는 노동·가족 문제에 연결된 대만법 문의로 제한한다. 베트남어 초기 문의·게시와 베트남어 상담·통역·베트남법 자격·베트남 사무소를 혼동하지 않았다. 704·705에 억지로 같은 판촉 결말을 붙이지 않았다. |

제16조와 移民法 관련 시행일은 연구 원장의 확인 기록도 참고했다. 다만 이번 검수의 MOJ 연혁 페이지 일부, NDC 연혁, 관보 원문 조회는 실패했다. 따라서 연구자가 성공한 시행일 연혁 전체를 검수자가 모두 독립 재열람했다고 주장하지 않는다. 현행 법령 본문과 2026년 NIA 안내를 직접 확인했고, 본문에 시행 전 개정이나 초안을 현재 규칙으로 쓴 부분은 발견하지 않았다. 기사에서 새 시행일 주장을 추가하지 않았다.

접근 실패·보조자료 경계:

- MOJ 외국 전문인력법·移民法 연혁 페이지는 열리지 않았다. [NDC 연혁](https://theme.ndc.gov.tw/lawout/LawContentSource.aspx?id=GL000273)은 403이었다.
- [2025년 전문인력법 시행 관보](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg031217/ch01/type1/gov01/num1/Eg.htm)와 [2023년 移民法 시행 관보](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg029231/ch01/type1/gov01/num3/Eg.htm)는 검색 결과를 볼 수 있었으나 본문 열기는 403이었다. 검색 조각을 관보 전문 열람으로 세지 않는다.
- 居留辦法 제7조·移民法 제34조 단일 조문 URL은 실패했지만 위 공식 전체본문에서 해당 조문을 확인했다.
- [MOI 개정 안내](https://www.moi.gov.tw/News_Content.aspx?n=2&s=312097)는 열렸으나 이 검수에서는 상세 시행일 판정 근거로 사용하지 않았다.
- 704의 세 포털 로그인·신청·납부를 검수자가 실행하지 않았다. 포털별 공개 화면과 中階技術人力 제외 사항은 저자·연구 원장이 보조 근거이며 이번 직접 재열람 범위 밖이다. 신청 성공·실제 카드 수령을 주장하지 않는다.

## 베트남어·독자 관점·구조

`thị thực lưu trú`와 `thị thực cư trú`, ARC, NIA/BOCA를 구별한다. 처음 보는 대만의 공식 용어는 ARC의 外僑居留證, 中階技術人力, 服務處所 등에서 중국어 명칭과 풀이를 연결한다. 모든 베트남어 독자를 베트남 국적자나 이주노동자로 취급하지 않는다. 705:25는 언어·국적·실제 입국 프로그램의 차이를 명시하고, 전문직·학생·대만인 배우자·전문직 가족을 각각 다룬다. 베트남법의 기한이나 구제수단을 대만법으로 옮겨 쓴 부분은 발견하지 않았다.

`phải`·`có thể`·`không`·`được phép`의 강도를 주요 법적 조건과 대조했다. ARC를 보편 취업허가로, 채용 제안을 취업허가로, 카드 잔존기간을 사유 소멸 후 체류권으로, 신청 접수를 승인으로 바꾸지 않는다. VI-01의 입국 프로그램 제한이 유일한 필수 보완이다. 과장된 허가 확실성·기간 보장·고객 성과·상담 경험은 없다.

읽기 전용 Node/`gray-matter` 보조검사를 실행해 필수 frontmatter 13개, `author: legal-ai-assistant`, `topic: visa`, `audience: [vi]`, 날짜, FAQ 3개와 q/a, 본문 H1·굵은 글씨 부재, NFC 정규화, 원고별 내부 링크 3개(총 9개)의 로컬 대상 존재를 확인했다. 각 파일 `errors=[]`, `faq=3`, `internalLinks=3`, `NFC=true`였다. 내부 작성자 값은 공개 AI 서명이나 가공한 사람의 서명으로 옮기지 않았다. 추가 이미지·매체는 없다. 구조 확인은 법률·문체 자동 통과를 의미하지 않는다.

## 문장 다양성 §5 독립 재점검

| 항목 | 관찰·판정 |
|---|---|
| 1. 지정 CLI | 세 편 모두 직접 실행. 초기 버전은 vi를 ko로 잘못 분류했고, 검수 중 갱신된 버전은 모두 exit 2 미측정이다. 아래 실제 기록 참조. 어느 결과도 베트남어 정량 PASS로 보지 않는다. |
| 2. 도입 유형 | 704 숫자·기산점, 705 실제 서류 질문, 706 변경 결과로 서로 다르다. 가상 인물·정형 상황·`Trong bối cảnh...` 도입 없음. |
| 3. 짧은 문장·호흡 | 704 “Ghi lại ngày nhập cảnh.” / “Giữ lại mã hồ sơ.”, 705 “Thư mời chưa đủ.” / “Giấy phép phải đúng loại công việc.”, 706 “Giữ mã tiếp nhận.” / “Ảnh thẻ chỉ giúp tra cứu.”가 실제 긴 조건 문장 사이에 있다. 전문직 가족 등의 긴 조건은 의미 보존에 필요하다. 베트남어 길이 CV·8%의 유효한 수치 통과는 주장하지 않는다. |
| 4. 시작 반복 | 링크 표시 텍스트로 읽은 본문 문단의 첫 단어를 세로로 확인했다. 세 파일 모두 같은 시작 단어 3회 이상은 없었다. 읽기 전용 보조 추출도 확인했다. 초기 도구의 705 `top_opener_n=3`은 한국어 오분류 결과로 보존하되 베트남어 결함 판정에 사용하지 않았다. |
| 5. 인용·예외 리듬 | 주장→조문→예외의 세 문단 연속 패턴은 발견하지 않았다. 704 서류·접수번호, 705 채용 허가 확인과 실제 수학 날짜, 706 날짜별 종이·접수번호·여행 준비에서 인용 없는 행동 문단이 있다. 필요한 예외를 문체 때문에 삭제하지 않는다. |
| 6. 대비 틀 | 704·705에서는 자동 반박 문장의 누적을 필수 결함으로 판정하지 않았다. 706은 엄격하게 세면 35행 `Đây không phải thời gian...`, 51행 `khác cách tính...`, 71행 `thay vì xem...`, 77행 `thay vì mục gia hạn` 등 네 군데가 대비로 읽힌다. 저자의 ‘각 3회 이하’를 그대로 인증하지 않는다. 앞의 법률 구별은 필요하고 서로 떨어져 있으며 마지막은 이동 안내이므로 필수 MONOTONY 반려로 삼지 않았다. 77행의 선택적 축약을 제안한다. §5.2–7에서 두 항목 이상 불충족이라는 §6 반려 조건은 확인되지 않았다. |
| 7. 결말 | 704 확인된 카드와 본인 보관본, 705 방문·채용·학업·가족 목적을 설명하는 자료, 706 복귀일과 여행 서류에 묶인다. 출처 뒤 범위 고지는 구조적 꼬리이며 판촉 문단 복사가 아니다. |
| 8. 문체·표기 | 전문적인 베트남어, 성조·호칭 일관성. 한국어/일본어 종결형 기준을 베트남어에 강제하지 않았다. 굵은 글씨·본문 H1·가공한 일인칭·명령형 체크리스트 제목 없음. |
| 9. 정확성 보존 | 읽기 전용 검수로 기한·금액·조건·인용을 삭제하지 않았다. VI-01은 실질 법률범위 보완으로 표시했고 제16조, 30일/15일, 일반 3개월/특례 4개월, 각 기산점과 금액을 보존하도록 요청했다. |

필수 MONOTONY 발견 사항은 없다. 이는 ‘모든 수동·정량 기준 통과’라는 문장이 아니다. 706 대비 표현 경계와 vi 정량 미측정은 명시적으로 남는다. 저자의 보조 `Intl.Segmenter` CV나 한국어 도구 값을 베트남어 게이트로 대체하지 않았다.

## 실제 CLI 명령·결과

아래 세 명령을 독립적으로 실행했다. 공용 파일을 수정하거나 `--lang en`을 강제하지 않았다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md
```

최초 실행은 모두 exit 1. 당시 지원은 기존 네 언어였고 vi 폴더를 ko로 분류했다. 출력의 경로만 아래에서 파일 번호로 줄였다.

```text
704 [ko] sentences=50 mean=79.8 cv=0.542 short=0.02 run3=0.021 opener_rep=0.105 cite_end=0.0 cite_para=0.211 contrast=0 caveat=0 q=1
  FAIL short_share=0.02 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
705 [ko] sentences=60 mean=87.2 cv=0.48 short=0.017 run3=0.052 opener_rep=0.15 cite_end=0.0 cite_para=0.2 contrast=0 caveat=0 q=2
  FAIL short_share=0.017 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
  FAIL top_opener_n=3 (limit <= 2): too many paragraphs start with the same word (max 2, or paragraphs/8 for long columns)
706 [ko] sentences=66 mean=87.3 cv=0.49 short=0.0 run3=0.078 opener_rep=0.125 cite_end=0.0 cite_para=0.292 contrast=0 caveat=0 q=1
  FAIL short_share=0.0 (limit >= 0.08): need at least ~1 in 12 sentences that is very short
```

검수 중 공용 규칙·검사기가 갱신된 것을 발견해 같은 세 명령을 재실행했다. 갱신 규칙은 지원 언어 13개를 열거하지만 vi는 없다. `variety_metrics.py` SHA-256 `0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb`, `SENTENCE-VARIETY-RULE.md` SHA-256 `6b9d818ea826b90a9b404c2a2db7508ce8287c1ea2927eb8559cf65eae856e35`를 확인했다. 최신 세 명령은 각각 exit 2이며 실제 출력은 다음과 같다.

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/704-taiwan-arc-first-application.md: ERROR measurement unavailable: cannot infer language for /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/704-taiwan-arc-first-application.md; supply --lang
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md: ERROR measurement unavailable: cannot infer language for /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md; supply --lang
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md: ERROR measurement unavailable: cannot infer language for /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md; supply --lang
```

초기 결과를 소급하여 최신 결과처럼 바꾸지 않는다. 두 실행 사이에도 원고 SHA-256은 동일했다. 저자 보고서에 있는 `--lang vi`의 과거 KeyError 실행은 저자 증거이며 이 검수자가 재실행한 것으로 기록하지 않는다.

## 미해결 사항과 한정된 다음 단계

1. 저자는 705의 VI-01만 보완하고 새 원고 해시를 인계한다. 검수자는 삽입 문장, 35·59행, 관련 FAQ와 공식 출처 목록을 새 해시에서 다시 읽는다. 제16조와 NIA 안내의 관계는 최종 법률 검수에 넘긴다. 이 r1은 첫 검수이며 수리 재검수는 아직 하지 않았다. 허용된 두 번의 수리 범위 안에서 진행한다.
2. 704·706의 선택 제안은 저자의 판단에 맡긴다. 적용하면 변경 구절과 영향을 받는 결론을 새 해시로 재확인해야 한다. 필수 수정으로 확장하거나 전체 원고를 다시 쓰지 않는다.
3. 베트남어 자동 측정 미지원, 일부 법령 연혁·관보와 공개 비교 화면 미접근은 남아 있다. 이 보고서를 FAIL 0·모든 출처 독립 전문 확인·공개 배포 검증의 증거로 쓰지 않는다.
4. 기사·메타데이터·링크가 달라지면 해당 판정의 해시가 달라진다. 704·706의 현재 PASS와 705의 수정 요청을 최종 검수자에게 정확히 전달한다. 원고는 미게시 초안이며 이 보고서는 게시를 실행하지 않는다.

## Repair1 독립 재검수 추가 — 2026-10-24

위 r1 판정은 최초 동결본의 역사적 기록으로 그대로 보존한다. 아래 추가 기록이 repair1 원고의 현재 언어 검수 판정이다. 검수자는 원고를 작성하거나 수리하지 않았고, 이번에는 이 보고서 끝에만 결과를 추가했다. 수리 재검수 1회 완료이며 두 번째 수리는 요청하지 않는다.

`work/vi-author.md` 상단의 repair1 인계와 실제 원고를 대조했다. 저자 보고서 SHA-256은 `1c3387e133cda5a34eba6565b849bbb48895531d30188a7cc4507bc66b10e23a`이다. 실제 원고 해시와의 일치를 확인한 후 새 33행, 관련 FAQ, 37·61행, 79행 출처와 영향을 받는 결론을 다시 읽었다.

| 원고 | 현재 판정 | 실제 SHA-256 | 범위 |
|---|---|---|---|
| `repo/src/content/columns-vi/704-taiwan-arc-first-application.md` | PASS 유지 | `ede9dd40337e817986845c9d848146db4bff12cca637f96eb24c6e0d351144bb` | 최초 검수본과 바이트 동일. 선택 제안 미적용, 추가 필수 수정 없음. |
| `repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md` | PASS | `1c6a9987182ca0902c975145a62ad307b34d09459cc114a032de87b8ded335e8` | VI-01 해결. 새 단락과 출처 및 관련 조건·결론을 독립 재검수했다. |
| `repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md` | PASS 유지 | `1c73d84fff7aab96960314d6e659e34cd5141ad9d3f4699e1a6e1ffc633a5165` | 최초 검수본과 바이트 동일. §5.6의 선택적 축약 관찰은 그대로 남는다. |

### VI-01 해결과 법률 예외 확인

705:33의 실제 추가 문장은 다음과 같다.

> Theo [hướng dẫn NIA 0915](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news), người nhập cảnh bằng giấy chấp thuận nhập cảnh theo hệ thống Travel Authorization Certificate (TAC) hoặc theo chương trình miễn thị thực thí điểm không được nộp theo đường này, trừ khi có quy định riêng. Cần xác nhận đúng chương trình nhập cảnh với NIA trước khi dựa vào Điều 16 để dự tính ở lại.

검수자가 [NIA 0915 공식 원문](https://www.immigration.gov.tw/5475/5478/141465/141808/141824/cp_news)을 다시 열었다. 게시 2024-04-10, 갱신 2026-04-14로 표시된다. §7(1)의 시험적 무비자 및 동남아 국가의 온라인 사전 심사 입국 제한과 별도 관련 규정 예외를 새 문장이 보존한다. 행정 안내임을 `Theo hướng dẫn NIA 0915`로 분명하게 밝혔다. TAC의 국적별 발급 자격, 모든 무비자 입국의 전환 금지, 승인 보장이나 새 기한을 추가하지 않았다. 79행의 새 공식 출처도 본문 링크와 일치한다.

[현행 전문인력법 제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16)도 다시 직접 열어 두 항을 대조했다. 현재 37행의 전문직·특정 전문직, 전문 업무 허가/면제와 승인 후 ARC, 61행의 법정 가족·허가된 거류/영주 조건은 보존되어 있다. 새 제한 단락은 이 범위를 확대하지 않는다. NIA 영문 안내의 다른 항목 §7(3)에 남은 과거 제12조 참조를 기사로 옮기지 않았으며, 원고는 현행 제16조를 유지한다.

수정은 단순한 문체가 아니라 직접 신청 범위의 실질 보완이다. 수정 요청의 목적을 충족하고 새로운 언어·의미 결함을 만들지 않아 VI-01을 닫는다. 이 PASS는 독립 언어·내용 재검수이며 제16조와 행정 안내의 관계에 관한 최종 법률 검수, 게시 승인과 구별한다.

### 변경 범위와 회귀 확인

읽기 전용 inline Node 검증에서 새 단락과 새 출처 줄의 출현이 각각 1회임을 확인한 뒤 메모리에서만 제거했다. 복원 SHA-256이 최초 동결본과 정확히 일치하므로 다른 기존 문장·메타데이터·링크의 변경이 없음을 저자의 설명과 별개로 확인했다. 실제 파일은 쓰지 않았다. 결과는 exit 0이었다.

```text
newSHA=1c6a9987182ca0902c975145a62ad307b34d09459cc114a032de87b8ded335e8
restoredSHA=8d307a5369c222f7d63b06cbd15f698d87d029507b2edc3fd308de8f74cf9dab
insertions={paragraph:1,source:1}
metadataUnchanged=true
firstTwoUnchanged=true
FAQ=3
NFC=true
repeatedParagraphStarts=[]
errors=[]
```

FAQ 16·20행의 포괄적 자격·입국 경로 주의문은 새 제한 단락과 일치한다. 새 문장이 명확한 예외를 제공하므로 최초 검수에서 부족했던 FAQ의 일반적 주의문만으로 독자가 판단하게 두지 않는다. 첫 두 문단과 마지막 목적 자료 문단, 기존 기한·가족 범위·취업권·언어/국적 구별·서비스 경계는 그대로다. 기존 삭제 시험과 세 비교 글의 근거·결론도 변경되지 않는다.

§5 수동 재점검에서는 새 `Theo` 문단으로 같은 첫 단어 3회 이상이 생기지 않았고, 기존 짧은 문장 두 개 이상을 유지했다. 새 단락은 제한·예외 뒤에 확인 행동을 따로 둔다. 법률 구별을 지우지 않았으며 주장→조문→예외의 세 문단 연속이나 새로운 대비 공식·판촉 결말을 만들지 않았다. 본문 H1·굵은 글씨·NFC 문제·가공한 경험·서비스 약속도 추가되지 않았다. 새로운 필수 MONOTONY 발견 사항은 없다.

### Repair1 실제 CLI 및 남는 제한

수정된 705에 아래 명령을 독립적으로 실행했다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md
```

검사기 SHA-256은 `0491ce5e3a7bd0c3ebd9bea7aa0ed04ba3ea41c6b56d2707824455eb2ccd10fb`로 직전 검수와 같았다. 실제 exit 2와 출력:

```text
/Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md: ERROR measurement unavailable: cannot infer language for /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md; supply --lang
```

베트남어 정량 측정은 여전히 미지원이며, 별도로 검토 중인 profile의 승인·실행 결과를 앞당겨 주장하지 않는다. 704·706은 바뀌지 않아 기존 미측정 기록을 유지한다. 이 세 편의 현재 내용 PASS를 자동 FAIL 0이나 공개 배포 완료로 바꾸어 보고하지 않는다.

남은 단계는 위 세 현재 해시와 VI-01의 실질 수정 사실을 최종 법률·게시 검수에 전달하는 것이다. 새 필수 원고 수정은 없다. 최초 보고서의 일부 연혁·관보·공개 비교 화면 접근 제한과 704·706의 선택적 문체 관찰은 그대로 보존한다.

## 706 문체 repair1 독립 재검수 추가 — 2026-10-24

저자 보고서의 `VI repair2`는 앞선 705의 법률범위 보완에 이은 기록 순번이며, 이번 706의 문체 수리는 첫 회다. 본 추가는 그 706 수리와 설치된 VI 측정의 실제 결과를 다룬다. 앞의 미지원 기록과 해시별 판정은 당시 상태로 보존한다. 현재 검사기는 VI를 지원하므로 아래 새 측정 결과가 현행 상태다. 검수자는 원고·도구·프로필을 수정하지 않고 이 보고서 끝에만 추가했다.

실제 저자 인계 `work/vi-author.md` 상단을 읽었으며 SHA-256은 `30fc5a7757b526071ed75902edf65c80c9b8243d514e20e873a060e5cb69dc66`였다. 아래 세 원고 해시를 직접 확인했다.

| 원고 — `repo/src/content/columns-vi/` | 현재 독립 내용 판정 | SHA-256 | 현행 지정 CLI |
|---|---|---|---|
| `704-taiwan-arc-first-application.md` | PASS 유지 | `ede9dd40337e817986845c9d848146db4bff12cca637f96eb24c6e0d351144bb` | exit 0, FAIL 0 |
| `705-taiwan-visa-residence-work-study-family.md` | PASS 유지 | `1c6a9987182ca0902c975145a62ad307b34d09459cc114a032de87b8ded335e8` | exit 0, FAIL 0 |
| `706-taiwan-arc-renewal-changes-reentry.md` | PASS | `6bdc548381e6d3e55115d7890eaa219771a465fc394b785bf52128a3766d7764` | exit 0, FAIL 0 |

### 실제 수정과 의미 보존

위치: `repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md:33`.

수정 전 해당 문장:

> Sinh viên dùng [hướng dẫn dành cho sinh viên](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/362168/); lao động di trú đối chiếu [hướng dẫn của diện lao động di trú](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/181964/).

수정 후 두 문장:

> Sinh viên dùng [hướng dẫn dành cho sinh viên](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/362168/). Lao động di trú đối chiếu [hướng dẫn của diện lao động di trú](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/181964/).

두 부분은 각각 주어와 동작을 갖춘 독립 안내다. 학생과 이주노동자가 자기 경로의 링크를 각각 읽도록 분리하는 것이 자연스럽고, 마침표 뒤 `Lao` 대문자도 적절하다. 문장을 중간에서 끊은 파편이나 새 나열형 제목이 아니다. 바로 앞 갱신 사유 증거의 요구, 바로 뒤 재학증명·재직증명 비대체성은 그대로 유지된다. 두 경로를 하나로 합치거나 어느 법률 조건·예외·수치의 적용 범위를 바꾸지 않았다. 법률 의미 보존이며 새 실질 법률 수정 사항은 없다.

검수자가 읽기 전용 Python에서 정확한 `; lao`→`. Lao` 한 곳을 메모리상 되돌렸다. 복원 해시가 최초 706 PASS본과 일치했고, casefold 표기 단위 순서·URL 순서·출처 꼬리 바이트도 같았다. 저자의 역해시 주장을 그대로 인용한 것이 아니라 독립 실행 결과이며 exit 0이었다.

```text
newSHA=6bdc548381e6d3e55115d7890eaa219771a465fc394b785bf52128a3766d7764
restoredSHA=1c73d84fff7aab96960314d6e659e34cd5141ad9d3f4699e1a6e1ffc633a5165
oneReplacement=1
casefoldUnitsUnchanged=true
URLsUnchanged=true
sourceTailBytesUnchanged=true
```

메타데이터·FAQ·최초 두 문단·마지막 문단과 기존 법률·서비스 조건도 이 한 곳 외에 바뀌지 않았다. 첫 두 문단 삭제 시험과 세 비교 글의 근거·결론은 유지한다. 기존 77행의 선택적 대비 축약은 이번 수리 범위에 포함되지 않았으며 필수 결함으로 승격하지 않는다.

### 새 측정 근거와 실제 706 경계 확인

검수자가 `work/vi-measurement/profile-author.md`, `profile-review.md`, `TECHNICAL.md`, `installation-receipt.json` 및 공유 `MULTILINGUAL-METHOD.md`의 VI 추가절을 읽었다. 프로필 작성자와 별도의 중립 언어 검수자는 목표 원고·점수를 보지 않고 기대값을 확정했다고 기록했으며, 정확한 후보 해시에 PASS를 부여했다. 247개 fixture와 기존 1,148편 비교 중 변경 0은 기술 담당자의 기록이다. 그 중 1,120편은 측정되었고 28편은 기존 미측정 상태가 같았으므로 1,148편 전체가 측정 PASS였다고 부르지 않는다. 이 재검수자가 전체 fixture·코퍼스 회귀를 다시 실행한 것으로 주장하지 않는다.

후보 SHA와 독립 검수 보고서 SHA를 실제 파일로 확인했다. 설치된 공용 다섯 파일의 해시도 설치 영수증과 전부 일치했다.

| 파일 | 직접 확인한 SHA-256 |
|---|---|
| 공유 `variety/variety_metrics.py` | `69ea04deab5f7988be2eb10d93d2c6eaf75bd4db2de97f3e4cab7712183c6e38` |
| 공유 `variety/variety_multilingual.py` | `bb6bb2e8b18496b4422d291c2d273f119e4038e2d20005e6231e85c4c11b8c8b` |
| 공유 `variety/profiles/vi.json` 및 중립 후보 | `3565e97c189498fc28f07a814d60b1548bb21e2e091d48ef1a926a7068be43df` |
| 공유 `variety/MULTILINGUAL-METHOD.md` | `124c841548f4f425b4ba1017729803496dee7ed55e5667b2d3565a816995ae82` |
| 공유 `SENTENCE-VARIETY-RULE.md` | `8e920e820529bb049ac27e67b6233ae369badcc901291909867665e39bb1d616` |
| `work/vi-measurement/profile-review.md` | `4ee90621af930580a2f53bc95199ebe67c59898784d6639ea5d5b987d63d3f30` |

실제 CLI와 같은 `strip_fm`→`body_blocks(..., 'vi')`→`sentences(..., 'vi')` 경로로 현재 706의 74개 문장을 추출해 모두 읽었다. 23개 본문 문단·5개 소제목·목록 0개였으며, 마지막 여행 준비 문단까지 유지하고 독립 제목 `## Nguồn chính thức`에서 출처 꼬리만 제외했다. frontmatter·FAQ가 본문 측정에 들어가지 않았고, 법률 예외나 상담 언어 제한이 출처 꼬리로 빠지지 않았다.

새 33행은 추출 문장 12–15에 해당한다. 길이는 `21 / 9 / 14 / 17` 표기 단위이며, 분리된 두 문장은 “Sinh viên dùng hướng dẫn dành cho sinh viên.”와 “Lao động di trú đối chiếu hướng dẫn của diện lao động di trú.”로 정확히 남는다. 9단위 문장을 8단위 이하의 매우 짧은 문장이라고 부르지 않는다. 나머지 세미콜론 문장은 조건·예외와 함께 이어지고, 이메일 `wei@hoveringlaw.com.tw`, 제23-1조, 물음표 및 문장말의 처리가 실제 문맥과 어긋나는 경계는 발견하지 않았다. 같은 엔진으로 메모리상 복원한 이전 원고는 73문장·CV 0.443, 현재 원고는 74문장·CV 0.453이었다. 원문 내용을 측정에서 빼거나 엔진을 원고에 맞춰 바꾸어 얻은 차이가 아니다.

VI 길이 단위는 `orthographic_syllabic_units`이며 의미 단어 수·다른 언어와 동등한 독해 부담으로 해석하지 않는다. 프로필의 8/32와 기존 HARD 값은 운용 기준이다. 자동 대비 횟수 3은 선택한 표면 패턴의 값이며, 앞선 §5.6의 보수적 수동 관찰을 지우지 않는다. 이 한 곳의 수정은 대비·문단 시작·인용 리듬·도입·결말을 새로 반복시키지 않았다. 새 필수 MONOTONY 발견 사항은 없다.

### 직접 실행한 현행 지정 CLI

도구가 지원 상태로 바뀌었으므로 704·705도 같은 명령으로 재실행해 미지원 기록과 현재 결과를 구분했다. 세 명령 모두 exit 0, FAIL 0이다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/704-taiwan-arc-first-application.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/705-taiwan-visa-residence-work-study-family.md
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-visas-20261024/repo/src/content/columns-vi/706-taiwan-arc-renewal-changes-reentry.md
```

실제 출력의 경로만 파일 번호로 줄였다.

```text
704 [vi] sentences=50 mean=21.5 cv=0.496 short=0.1 run3=0.021 opener_rep=0.111 cite_end=0.0 cite_para=0.278 contrast=0 caveat=0 q=1
  OK — no variety limit violated
705 [vi] sentences=64 mean=23.1 cv=0.452 short=0.094 run3=0.113 opener_rep=0.1 cite_end=0.0 cite_para=0.4 contrast=0 caveat=0 q=2
  OK — no variety limit violated
706 [vi] sentences=74 mean=21.7 cv=0.453 short=0.095 run3=0.028 opener_rep=0.13 cite_end=0.0 cite_para=0.435 contrast=3 caveat=0 q=1
  OK — no variety limit violated
```

현재 미해결 필수 원고 수정은 없다. VI 자동 측정 미지원은 위 버전에서 해소되었으며 과거 기록을 소급하여 PASS로 바꾸지 않는다. 측정 휴리스틱의 한계, 이전 법령 연혁·관보·공개 비교 화면 접근 제한과 선택적 문체 관찰은 유지한다. 다음 단계는 현재 세 해시 및 705의 실질 법률 보완 이력을 최종 법률·게시 검수에 전달하는 것이다. 자동 검사와 이 독립 언어 검수는 공개 게시·실제 신청 결과의 증거가 아니다.
