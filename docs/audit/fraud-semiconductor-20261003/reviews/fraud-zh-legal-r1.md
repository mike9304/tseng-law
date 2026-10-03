# Taiwan fraud ZH — independent factual/legal review R1

Reviewer: `/root/review_fraud_zh`. 검수일 2026-10-03 (Asia/Seoul). 최종 재검수 20:43:27 KST. 원고 수정·커밋·push 없음. 검수 보고서만 소유한다.

## 판정

| 원고 | 현재 판정 | 남은 항목 |
|---|---|---|
| `drafts/zh-hant-cash-investment-courier-receipt-fraud-taiwan.md` | APPROVE | MUST 0. MUST-C1 수정 재검수 완료 |
| `drafts/zh-hant-land-registration-alert-property-fraud-taiwan.md` | APPROVE | MUST 0; 아래 NIT-L1은 선택 사항 |
| `drafts/zh-hant-fake-lawyer-scam-recovery-fee-taiwan.md` | APPROVE | MUST 0. NIT-F1 및 신분증/금융비밀번호 분리 재검수 완료 |

이 판정은 말미 최종 SHA의 사실·법률·출처 대응에 한정한다. 최종 미해결 MUST 0, 선택 NIT 1(L1). 변호사 또는 대만 원어민이 검수했다는 뜻이 아니다. 이미지 실물, 본문 렌더링, 빌드, contact 링크의 운영 동작, 공개 배포는 검증하지 않았다.

## 검수 대상의 실제 SHA-256

초기 파일을 전체 읽고, 20:29:30 KST에 세 파일의 변경을 감지한 뒤 수정본 전체를 다시 읽었다. 아래 중간 SHA는 그 재검수본이다. 최종 동결 확인은 말미에 별도 기록한다.

| 원고 | initialSHA | 재검수 SHA |
|---|---|---|
| cash | `357b3afd8479c1a46e5eff57280eac3b94371001901283645b3b66ba776fc91a` | `5007cf5b204fa6d2c5513a94abed455a76e756244e37d1f66e1497452d66d685` |
| land | `f0738ca4f454b03b0b1cf2466d796f37e1f332b728e4f601aaca76223ecadb9d` | `0eb7442b9cc4b6510411bedcf6310ae933e874494768ccb49764ddcd6d3c1ebd` |
| fake lawyer | `9e6081ee9c6735569c9ac62ba4b0418d1732ed200c3e46ea8ce46dc69fd9b78a` | `bd326230f8ac670544bb2b5f0f7e844c53db83f89e56c183282c03ea79d0873d` |

초기→재검수 변경: cash L29 `收据`→`收據`, L62 일반 법률정보 문구; land L51 `凭`→`憑`, L63 일반 법률정보 문구; fake lawyer L47 `後续`→`後續`, L54 설명을 출처 범위로 좁힘, L60·72 경찰 2026-09-24 안내 추가, CTA 분리, 마지막 유보 문구 조정. 새 경찰 출처는 별도로 직접 OPEN하여 내용·날짜를 재검수했다.

## MUST / NIT

### MUST-C1 — 공식 업데이트 날짜와 발표일 구분 (해결)

- 위치: `drafts/zh-hant-cash-investment-courier-receipt-fraud-taiwan.md:21`.
- 최초 지적 문구: `刑事警察局在2026年9月8日公布一件假投資案件`.
- 근거: [경찰청(NPA) 공식 원문](https://www.npa.gov.tw/ch/app/news/view?id=2139&module=news&serno=6c0c1cef-0338-4ec6-bef3-4f7314423584)은 본문 머리에 `更新日期：115-09-08`을 표시한다. 처음 공표한 날짜라는 별도 표시를 확인하지 못했다. L64에서는 정확히 업데이트 날짜로 표기했지만 L21은 의미를 확장한다.
- 최소 교정: `刑事警察局一則更新日期為2026年9月8日的查緝公告記載：依警方調查，…`.
- 수사 단계, 9명, 현금→가상자산→국외 전송 자체는 원문과 일치하며 별도 반려 사유가 아니다.
- 최종 원고 L21에서 위 최소 교정이 반영되었음을 직접 읽고 확인했다. 해결.

### NIT-F1 — 경계해야 하는 조건을 불필요하게 좁히는 연결어 (해결)

- 위치: `drafts/zh-hant-fake-lawyer-scam-recovery-fee-taiwan.md:52`.
- `承諾必定追回全部損失，卻不說明具體工作、受任者及費用用途，才需要停下來查證`의 `才`는 두 조건이 모두 있어야 경계한다는 독해를 만든다.
- 최소 교정: `才需要`→`就應`. L54는 보장 표현 자체에 대한 경계도 명시하므로 문서 전체의 중대 법률 오류로 보지는 않는다.
- 보강 근거: [臺灣高等檢察署 안내](https://www.tph.moj.gov.tw/4421/4475/632364/1150322/post), 2024-02-21, Q2는 정상적인 변호사 보수와 무료 지원을 구분하고 Q4는 결과 보장·사법기관 인맥 주장을 경계하도록 설명한다. 이 자료는 독립 검수 보강용으로만 읽었다.
- 최종 L52는 `就應先查證`로 수정되어 의미를 보존하면서 배타적 연결어를 제거했다. 해결.

### NIT-L1 — 하단 날짜의 성격 표시

- 위치: `drafts/zh-hant-land-registration-alert-property-fraud-taiwan.md:67`.
- [E政府 페이지](https://www.gov.tw/News_Content_2_381373) 하단에는 `115-09-03` 업데이트 표시가 있다. 본문별 최종 개정일임을 별도 입증하지는 않는다.
- 최소 교정 선택지: `頁面標示更新日期2026年9月3日` 또는 날짜 삭제. 2026-08-01 시행일은 공보와 내정부 발표가 직접 뒷받침하므로 영향 없음.

초기 발견했던 간체 세 곳은 작성자의 수정으로 해결되었다. 별도 중복 MUST로 남기지 않는다.

## 직접 확인한 공식 출처 및 material claim 대조

검수 방법: 검색 요약만으로 통과시키지 않았다. 아래 모든 핵심 인용 페이지를 web OPEN 또는 실제 Chrome 화면으로 열었다. `lawyerbc`는 JavaScript 앱이라 web 도구 텍스트가 비어 실제 브라우저의 현재 안내를 읽었다. 공보·중壢 페이지는 web OPEN이 403/timeout으로 실패했지만 Chrome에서 정상 본문을 확인했다. 인증서 경고 우회나 CAPTCHA 입력은 하지 않았다.

### Cash

| 원고 위치·주장 | 직접 확인한 공식 자료·날짜 | 판정 |
|---|---|---|
| L21,64: 현금 면교, 가상자산 전환·국외 지갑, 9명, 수사기관 설명 | [NPA 형사국 발표](https://www.npa.gov.tw/ch/app/news/view?id=2139&module=news&serno=6c0c1cef-0338-4ec6-bef3-4f7314423584), 표시 업데이트 2026-09-08; 사건 개요 (1),(3) | 사실 일치. 원고가 기소·확정유죄라고 하지 않음. C1 날짜 표현도 최종본에서 해결 |
| L27: 본인/대리인 서명·날인 사문서의 진정 추정 | [民事訴訟法 §358](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=358), 현재 조문 | 일치. 문서 진정과 회사의 대리권·투자 실재·수익을 구별한 적용은 조문 취지 안의 설명 |
| L29,52: 여러 자료를 종합하고 인출증·입금화면 하나로 전부 입증되었다고 단정하지 않음 | [民事訴訟法 §222](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=222), 현재 조문 | 일치. 개별 증거 가치에 대한 신중한 해설로 읽힘. 보편적 증거배제 규칙을 창작하지 않음 |
| L35–39: 회사 등기만으로 금융업 허가·접촉자의 동일성을 증명하지 못함; 진짜 회사 사칭·합법업자/경고 조회 입구 | [移民署 안내](https://news.immigration.gov.tw/NewsSection/Detail/3440F5AF-3A92-45FE-AC2D-AC1698A3324D?lang=tw&topic=onetouch), 2024-11-27 09:00, Q1·조회방법 I–III | 일치. 증권·선물·투신·투자자문으로 조회 범위를 좁힘 |
| L31,43–54: 원본·원대화·연락처·시간선 보존, CCTV 보존 여부의 한계 | §222 및 상기 경찰 수사 사례와 구별되는 작성자의 실무 정리 권고 | 법정 제출 필수목록이나 확보 보장으로 표현하지 않음. 권고임을 명시 |
| L56: 추가 현금 면교 금지 권고, 165/110 | 같은 NPA 원문 사건 개요 (4) | 일치 |
| L58,62: 책임주체·개별증거 판단, 확정유죄 아님 | NPA 원문의 수사 단계 및 원고 전체 | 제3자 회사·변호사 실명을 지목하거나 범인으로 단정하지 않음 |

### Land

| 원고 위치·주장 | 직접 확인한 공식 자료·날짜 | 판정 |
|---|---|---|
| L21,27: 수리/완료 단계, 서비스 선신청·발효, 대상 원인과 수신자 | [2026-06-23 공보 원칙](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032113/ch02/type2/gov10/num2/Eg.htm), 台內地字第1150262556號, 2026-08-01 시행, 제1점 | 직접 Chrome 본문 확인. 12개 원인의 義務人, 書狀補給의 權利人 구분과 일치 |
| L23,37: 통지는 등기의 법적 효력·진행을 자동 차단하지 않음; 미수신이 무변동 증거 아님 | [中壢地政事務所](https://www.zhongli-land.tycg.gov.tw/cp.aspx?n=21644), 주의사항 (1); [원칙](https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg032113/ch02/type2/gov10/num2/Eg.htm) 제1·4점 | 직접 Chrome 본문 확인. 정상 등기에도 적용하는 서비스임. 안전을 보장하는 상품처럼 서술하지 않음 |
| L33–35: 이전·저당권설정·권리증 재발급은 다름 | [民法 §758](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=758), [§860](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=860), [土地登記規則 §155](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060003&flno=155), 현재 조문 | 독립 보강 OPEN. 표는 법적 효력 차이를 정확히 제한적으로 설명함. 추가 복잡한 법조문 삽입을 요구하지 않음 |
| L41–43: 독립 전화 확인, 증빙·사칭 의심 구체화, 지정기관·경찰에 바로 알림 | [내정부 발표](https://www.moi.gov.tw/News_Content.aspx?n=2&s=339881), 게시 2026-08-01 08:30, 마지막 본문 | 대응 방향 일치. 원고의 문서 정리는 실무 권고이며 신청서식·정지명령으로 주장하지 않음 |
| L45: 이해관계자 사이 등기 법률관계 분쟁에 따른 신청 각하, 신고 자동정지 아님 | [土地登記規則 §57](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060003&flno=57), 현재 조문 제1항제3호 | 일치. 기관의 판단과 후속 확인을 명시해 과도한 중지 보장 없음 |
| L51–53: 완료된 등기의 말소 원칙·예외, 신고로 자동 원상복구되지 않음 | [§7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060003&flno=7), 예외를 확인하기 위해 [§144](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060003&flno=144)도 독립 OPEN | 일치. `除規則另有規定外`를 유지하여 위조서류·기관 착오 관련 행정말소 예외를 배제하지 않음 |
| L57: 8월부터 등록한 건강보험카드+리더, 전국 임의 사무소, 한 장의 신청서, 무료, 추가 지정 수신자 1조 | [내정부 2026-08-01 발표](https://www.moi.gov.tw/News_Content.aspx?n=2&s=339881), 공보 제3·4점 | 일치. 시행일/개정일/검수일을 구분함 |
| L59: 활성화 통지, 연락처 변경 신청, 타인 수신자 지정은 소유권·대리권 이전 아님 | 공보 제2·4점, [E政府 신청서비스](https://www.gov.tw/News_Content_2_381373), 中壢 Q6–7 | 일치. 신청 자격을 없애는 가족 대리 신청으로 오해하게 만들지 않음 |
| L27의 預告登記 | [土地法 §79-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060001&flno=79-1) 별도 OPEN | 원고는 알림대상 목록에만 기재하고, 누구나 예방 목적만으로 신청할 수 있는 범용 차단 수단이라고 권하지 않음. 청구권·동의서 조건을 설명하는 새 단락은 불필요 |

### Fake lawyer

| 원고 위치·주장 | 직접 확인한 공식 자료·날짜 | 판정 |
|---|---|---|
| L21,31: 실재 변호사 명의 사칭 가능, 여러 경로·공회 확인 | [MOJ 보도자료](https://www.moj.gov.tw/2204/2795/2796/190783/), 게시·갱신 2023-11-22 | 일치. 조회 성공이 접촉자의 본인 확인이라는 단정을 피함 |
| L27,37: 이름/증서번호 조회, 미개업 증서 소지자 제외 원칙·징계 예외, 업데이트 시차 | [lawyerbc 현재 화면](https://lawyerbc.moj.gov.tw/), 실제 Chrome 檢索注意事項, 데이터 기준 2026-10-01 | 직접 확인. 현재 목요일 갱신/수요일 신고 마감. 2023 MOJ 자료의 금요일 주기를 그대로 현재 규칙으로 옮기지 않음 |
| L29,41: 공개 개인정보와 징계범위, 확정 여부 표기 | [律師法 §136](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020006&flno=136), 현재 조문 | 일치. `五年內`를 모든 징계의 제한으로 확대하지 않으며 제명·직무정지는 별도로 남김 |
| L39: 증서+지방공회+전국연합회, 현재 개업 상태 별도 확인 | [律師法 §19](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=I0020006&flno=19), lawyerbc 選任律師注意事項 | 일치. [沿革](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=I0020006)도 OPEN하여 §136은 2021-01-01 시행, 2027 시행 경고는 §4임을 확인 |
| L23,54: 가짜 변호사 비용·계좌 요구, 특별 추심 경로, 검사·경찰 사칭 보증금 | [臺北地檢署](https://www.tpc.moj.gov.tw/292885/976681/661783/1169727/post), 게시 2024-04-23, 업데이트 2026-05-08, 유형 (1),(3),(4) | 일치. 원문의 낡은 24시간 계좌圈存 설명을 재사용하지 않음 |
| L45–52: 정상 보수와 사기 구분, 계약·비용·수금주체·업무 질문 | [高檢署 Q2·Q4](https://www.tph.moj.gov.tw/4421/4475/632364/1150322/post), [刑法 §339](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=339) 독립 보강 OPEN | 수임료 또는 명의 차이만으로 사기라고 단정하지 않는 내용은 적절. 연결어 NIT-F1도 최종본에서 해결 |
| L58,60,62,72: 대화·거래기록, 금융기관 신속연락·신고, 165, 금융인증자료 미제공 | [NPA 警光 2차사기 안내](https://police.npa.gov.tw/ch/app/data/view?id=1835&module=wg081&serno=aa838cd6-0932-4ee5-9323-a9a17360a4be), 업데이트 2026-09-24 | 수정 후 새 출처 직접 OPEN. 원고 조치와 일치. 특별 추심 성공·반환 기한·금액을 보장하지 않음 |

## 범위와 한계

- 세 편 전부 본문·frontmatter·말미 출처를 읽었다. 사건의 금액을 새로 추정하지 않았고, 인원 9명·연도·조문 번호를 원문과 대조했다. 법무부 조문 페이지의 데이터 정리 기준일은 2026-09-24이며 검수일과 별개다.
- 공포·불안을 앞세운 사례 창작, 피해자 비난, 특정 회사/변호사에 대한 실명 비방, 대표변호사의 개인 경험·검수 완료·회수 실적 창작은 발견하지 않았다. internal `author: legal-ai-assistant`와 생성 이미지의 가상성 문구도 유지되어 있다.
- 일상적인 증거 정리·검증 경로 제안은 저자의 일반 권고로 분류했으며 법정 필수 조건, 회수 보장, 자동 등기정지로 오인할 표현은 구분해서 검사했다.
- 이미지 경로와 alt/caption 문장만 읽었다. 실제 이미지의 잘못된 문구·문서 위조처럼 보이는 문제, PC/mobile 표시, SEO 출력, 빌드·공개 배포에 대해서는 이 보고서가 증거가 아니다.
- 작성자의 자료대장이 생성되기 전에 공식 원문부터 독립 검수했다. 20:40 및 20:43 KST에 완성된 evidence 세 편을 전체 읽고 비교했다. 집필자가 실제로 수행했다고 기술한 과거 UI·스크립트 작업을 대신 인증하는 것은 아니며, 본 보고서에서 독립 수행한 검증만 승인 근거로 삼는다.

## 최종 동결 재검수

작성자의 동결 통보 후 2026-10-03 20:43:27 KST에 파일을 다시 읽었다. Python3 파일 SHA 검사에서 원고 3개와 evidence 3개 모두 전달받은 동결값과 일치했다. 추가로 최종 cash L21, fake L52·L62의 수정만 되돌린 문자열을 앞서 읽은 중간 SHA와 비교해, 마지막 교정 외 다른 본문 변경이 없음을 확인했다. land는 중간본과 바이트 불변이다.

실행 명령: `python3 -` (파일 `read_bytes()`의 `hashlib.sha256`, 동결값 6개 assert 및 승인 문구 교정만 역치환한 해시 비교). 실제 출력:

```text
drafts/cash PASS 0062392fec357f62985bd4367dd8cdebe62d45f124584ad343f06ef826485089
drafts/fake PASS 1e90362a24cbf2c7041a1abbea20771769a49263d57d45d0fa4faa25bcbbea2e
drafts/land PASS 0eb7442b9cc4b6510411bedcf6310ae933e874494768ccb49764ddcd6d3c1ebd
evidence/cash PASS ce44134930659cbdf50acabf4d4d8561bdc22fb39e8bc7106398c1b944f53062
evidence/fake PASS 528db40296746d87d0785965b6bf6600538f91959652b9d2b1648ac279b899ce
evidence/land PASS c9ecff4ab3ea4d30c9ad95f4e2c4d44d5e0f02afac6f13184a1d52e30193e521
ONLY_EXPECTED_REVIEW_FIXES PASS: cash L21, fake L52/L62, land unchanged
exit_code=0
```

위 출력의 파일명만 표 편의를 위해 `cash`, `fake`, `land`로 축약했다. 원래 파일명은 최초 판정표와 같고 evidence 역시 같은 basename이다.

마지막 변경의 독립 재검수:

- Cash L21: `一則更新日期為2026年9月8日的查緝公告記載` → 실제 NPA 표시와 일치. MUST-C1 종료.
- Fake L52: `就應先查證` → 배타적 `才` 해소. NIT-F1 종료.
- Fake L62: 신분증은 수임자·전달방법 확인 후 필요한 범위에 따라 제공하고, 금융계좌 비밀번호는 접촉자에게 제공하지 않도록 별도 문장. 검증된 사무소라면 금융비밀번호를 보내도 된다는 오독을 제거. 이미 직접 연 2026-09-24 경찰 자료의 비밀번호 비제공 권고와 일치.
- Evidence/cash L13의 요약을 정확인용으로 표시했던 문제는 실제 원문의 짧은 구절 `亦可能提供非法服務`로 교정.
- Evidence/land L13의 의역 인용은 공보의 정확한 `申請本服務並已生效後`로 교정.
- Evidence/fake L16의 인용은 북검 원문 소제목 `假律師`로 교정. L64의 수정 결과와 최종 본문은 모두 `就應先查證`로 일치.

최종 판정: cash APPROVE, land APPROVE, fake lawyer APPROVE. 세 편 합계 미해결 MUST 0. NIT-L1 한 건은 공개 본문의 의미·효력·시행일에 영향을 주지 않는 출처 날짜 표기 선택 사항이며, 이 승인에서는 변경을 요구하지 않는다.
