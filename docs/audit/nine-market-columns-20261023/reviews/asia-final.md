# 아시아 15편 독립 최종 법률·편집 검수

검수일: 2026-10-23, Asia/Seoul. 검수자: `/root/final_asia` (독립 AI 편집·법률 근거 검수자). 15편을 작성하거나 수정하지 않았다. 사람 원어민·변호사 검수나 전문 자격을 주장하지 않는다. 이 보고서만 작성했으며 등록, commit, 배포, 제3자 연락을 하지 않았다.

전체 판정: PASS — 아래 동결 해시에 한정한 법률 근거·편집 검수 결과. 남은 차단 법률·사실 결함은 없다. 독립 locale 검수 15편의 최종 PASS와 실제 파일 SHA-256이 일치한다. root가 현재 15편을 최종 freeze라고 명시적으로 확인한 뒤 판정했다. 공유 문장 다양성 CLI의 `FAIL 0`은 달성하지 않았으며, 이 PASS는 그 수치 요건이나 공개·배포 준비 완료를 뜻하지 않는다. 상세 한계는 마지막 절에 남긴다.

## 검수 입력과 독립성

작업 경로는 `/Users/son7/tseng-market-columns-20261023`이다. 실제 원고 15편의 frontmatter, FAQ, 본문, 제목, 출처 목록을 읽고, 수리 뒤 영향을 받은 조문 설명·FAQ·결론과 최종 바이트 해시를 다시 확인했다. `work/BRIEF.md`, `work/research-asia.md`, 각 언어 `work/{th,id,hi}-author.md`, 별도 `work/reviews/{th,id,hi}-locale-r1.md`와 각 수리 재검 부록을 대조했다. 저자 완료 선언이나 링크 존재만으로 PASS하지 않았다.

현재 repo `AGENTS.md`, `docs/columns/EDITORIAL-VOICE.md`, `COLUMN-VOICE-RULE.md`, 공유 `SENTENCE-VARIETY-RULE.md`·`LESSONS.md`, [tseng-law-editorial 스킬](/Users/son7/.codex/skills/tseng-law-editorial/SKILL.md)과 [review-criteria](/Users/son7/.codex/skills/tseng-law-editorial/references/review-criteria.md)를 적용했다. 폐기된 Fable 의무 게이트를 복원하지 않았다.

저자는 `author_th`, `author_id`, `author_hi`, 독립 언어 검수자는 각각 `review_th`, `review_id`, `review_hi`이다. 본 검수자는 어느 원고도 저술하지 않았고 원고를 직접 고치지 않았다. 언어 검수 보고서도 AI 독립 검수라는 한계를 명시한다. 저자 자기 점검과 독립 언어 검수, 본 법률·편집 판단을 구별했다.

## 글별 최종 판정과 버전

아래 경로는 작업 경로 기준이다. 모든 행의 SHA는 최종 원고 바이트에서 직접 계산했다. locale 보고서의 최종 부록 해시와 15/15 일치했다. 구조 검사는 2026-10-23 22:07 KST 무렵 실행했다. 보고서 마감 재확인은 2026-10-23 22:15:33 KST에 `FINAL_HASH_CHECK 15/15 PASS`를 출력했다. 원고 바이트·보고서 표·locale 최종 해시가 모두 일치한다.

| 파일 | 판정 | SHA-256 |
|---|---|---|
| `repo/src/content/columns-th/659-thai-worker-taiwan-payslip-deductions-unpaid-salary.md` | PASS | `4bd0a8728c8dee891c50d9f1ea4b094b3473e00aca02ce8a1c38ffd580f8c454` |
| `repo/src/content/columns-th/660-thai-worker-taiwan-factory-closure-wage-fund.md` | PASS | `d172ea56f21d63cfe8ccfac3cf359f91f8a61074490751572525808e0c1aed2d` |
| `repo/src/content/columns-th/661-thai-worker-taiwan-bank-account-police-notice.md` | PASS | `7acb2c805316c660a4733fb4a83fbb444c3c610b41e87dc1602fd46797d3228d` |
| `repo/src/content/columns-th/662-thai-return-home-taiwan-traffic-injury-records.md` | PASS | `3401b05e82b5c643eee95e0e1b68aa20bdbcc03fbdf4ac6b753ed8ad535d3998` |
| `repo/src/content/columns-th/663-thai-supplier-taiwan-buyer-unpaid-invoice.md` | PASS | `16f9a9e2a05faca9d2e2a1879344661fa3b3faf235f0540edfa13ad2403c3e77` |
| `repo/src/content/columns-id/664-indonesian-home-caregiver-unpaid-wages-taiwan.md` | PASS | `0df3ccf6a3f2ecbe7ec13ba26632bdec046cdbc54b562c01916ea29be1becba3` |
| `repo/src/content/columns-id/665-indonesian-worker-passport-broker-dispute-taiwan.md` | PASS | `4cc7e579386fa75545b26b03b6d4a694082ee14b89a5d6896b32b69c58a051d2` |
| `repo/src/content/columns-id/666-indonesian-worker-bank-account-cash-job-police-taiwan.md` | PASS | `1dc2f41c0b69574a9fe64696db98192ebfb1edf5d1471ee2a956f92b42740c26` |
| `repo/src/content/columns-id/667-indonesian-factory-worker-injury-evidence-compensation-taiwan.md` | PASS | `ab6d157e543d01a68ca6ec8c6f8c026664aab19db10ad6c22319161849b062b5` |
| `repo/src/content/columns-id/668-indonesian-buyer-taiwan-machinery-defect-notice.md` | PASS | `73cd670bde83eb90f3d282eea4496505b97f9bbca5b47c73dab940c6204a2018` |
| `repo/src/content/columns-hi/669-indian-supplier-unpaid-taiwan-invoice.md` | PASS | `0982417534e2e25830e311e4510f9bb594a0f509bff80cf82572db97e185d63f` |
| `repo/src/content/columns-hi/670-indian-buyer-taiwan-machinery-defect-notice.md` | PASS | `128e52e87248c9f69384ef259497edcf615a15e7276f15b1a541ee2be03c086c` |
| `repo/src/content/columns-hi/671-indian-engineer-taiwan-noncompete-compensation.md` | PASS | `91b65d34dd613c38bd36b0fdee5f256ce5cb80264c9bd558bd3f19d836d57cf9` |
| `repo/src/content/columns-hi/672-indian-resident-taiwan-rental-deposit-handover.md` | PASS | `f0056a6d267465fc94f53d4b71fd82c1a9df21c0423387a1819f8f6b6f99784b` |
| `repo/src/content/columns-hi/673-indian-importer-taiwan-supplier-bank-change-fraud.md` | PASS | `e31af5e8b7d41a77ab50b8bce8defa9a2a296fa0c1a33ebdfd327e33668a454f` |

## 공식법령의 현행성과 출처 한계

2026-10-23 web 도구로 아래 대만 공식 조문·연혁 및 기관 안내의 실제 내용을 직접 열었다. MOJ 현재 페이지의 법규 정리 기준일은 2026-10-16이었다. 이는 검수 당일의 열람 사실이며, 정리 기준일 이후 공포되었으나 아직 반영되지 않은 변경이 전혀 없다는 보증이 아니다. 일부 single/history URL이 일시적으로 실패하면 같은 기관의 전체 조문·연혁 링크로 보충했다. 인도 NCRP의 본문은 도구에서 0줄로 반환되어 제출 UI를 시험하지 못했다. 신고 경로는 별도 MHA/PIB 공식 안내로 확인했다.

| 법령·자료 | 직접 확인한 시행·적용 구분 |
|---|---|
| [외국인 고용허가·관리규칙 N0090027 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0090027), [현재 전체 조문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0090027) | 2025-12-30 개정, 종전 §§42–49 삭제. 현행 급여명세 규정은 §66이며 §2의 제2종 외국인 범위가 중요하다. §73 시행 규정을 확인했다. 삭제된 §43을 현행 근거로 쓰지 않았다. |
| [노동기준법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030001), [시행세칙 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0030002) | 법은 2024-07-31 개정, 세칙은 2024-03-27 개정. 후자는 §2 개정이며 경업금지 세칙 §§7-1–7-3은 2016-10-07 도입된 현재 조문이다. 최신 전체 개정일을 해당 조항의 새 시행일로 오인하지 않았다. |
| [취업서비스법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0090001), [체불임금기금 규칙](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0030005) | 취업서비스법은 2025-01-20 개정. 여권·중개업체·고용주·고용주 변경 조항의 주체와 요건을 각각 대조했다. 기금 규칙의 2015-05-20 개정·시행과 §§7–11,15를 확인했다. |
| [자금세탁방지법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=G0380131), [FSC 계좌 규칙](https://law.fsc.gov.tw/LawContent.aspx?id=FL039015) | AML 2024-07-31 개정 중 지연 시행된 §§6/11은 2024-11-30 시행; 본문이 사용하는 §§2/19/22와 구분했다. FSC 규칙은 2026-08-31 개정, §20 공포일 시행. 형사절차·경고·은행 제한을 같은 절차로 합치지 않았다. |
| [민법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0000001), [민사소송법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=B0010001), [형사소송법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=C0010001) | 민법 전체 페이지에는 미시행 §166-1 및 2026-08-17 개정 뒤 6개월 후 시행되는 §1223 경고가 있다. 본 15편의 조문에는 해당하지 않는다. 민사소송법 2023-11-29, 형사소송법 2026-05-13 개정 사항과 사용 조항을 구별했다. |
| [섭외민사법 전체 조문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007) | 2010-05-26 개정 및 §63의 공포 후 1년 시행을 확인. §20 준거법, §36 소멸시효의 준거법, §62 경과 규정이 별개다. §36 single URL 오류를 전체 조문으로 해소했다. |
| [직업재해보험·보호법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=N0050031) | 2021-04-30 제정, 행정원 명령으로 2022-05-01 시행. 오래된 보험법 설명을 신규 현행 보험법과 혼합하지 않았다. |
| [임대주택법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0060125), [전체 조문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0060125) | 2017-12-27 제정 후 6개월 시행. 2023-02-08 개정에서 지연 시행된 §§34/38-2는 2023-09-01 시행; 본문의 §§4/7/12/16과 구분. §40의 기존 계약 경과 규정도 확인했으며 원고는 법 적용을 전제로 설명한다. |
| [영업비밀법 연혁](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0080028) | 최신 2020-01-15 개정과 본문의 정의 §2·침해 §10을 구분. 경업금지 약정의 하자가 비밀 반출 허용으로 바뀌지 않는다. |

## 글별 claim/source-fit와 독자가 얻는 판단

각 행의 조문은 실제로 열람한 법적 명제의 범위이다. 원고의 개별 URL과 source list를 대조했고, 목록에 있다는 사실만으로 아래 결론을 내리지 않았다. 실무상 자료 보존 조언은 별도의 법정 의무로 과장하지 않았다.

| 글 | 검증 내용과 통과 이유 |
|---|---|
| 659 | [현행 §66](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=66) 및 [§2](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090027&flno=2)의 제2종 범위, 중문·본국어 명세와 고용주 5년 보관을 유지. LSA §§22/23/26/27/14를 직접 대조해 전액·직접 지급의 예외, 계산 내역, 위약금·손해의 선공제 금지, 행정기관 지급 명령과 계약상 보수 미지급 해지 사유를 구별했다. ESA §59 승인 없는 자동 고용주 변경을 약속하지 않는다. 독자는 THB 송금액과 NTD 임금 채권·공제·실수령을 나누어 비교할 수 있다. |
| 660 | [LSA §28](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=28), 기금 규칙 §§7–11/15 및 [BLI 신청 안내](https://www.bli.gov.tw/0007239.html)의 실제 요건·서류를 대조했다. 재개 가능 휴업은 폐업과 다르고, 납부 및 사후 보완 납부, 청구했으나 미변제, 해당 노동자 범위가 필요하다. 임금 부분의 6개월 범위와 퇴직금·해고수당 합산 6개월 평균임금 상한을 분리한다. 우선변제와 기금 범위도 다르다. 폐업 확인·채권 증빙·청산/파산 채권신고·원칙적 공동신청·국외 계좌 규정을 정확히 조건부 설명. BLI 실제 갱신일 2023-12-19를 2026 개정으로 바꾸지 않았다. |
| 661 | [AML §22](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22)의 정당한 사유 예외, 법정 경고, 대가/합계 3개 이상/지정 경고 뒤 5년 내 반복의 OR 구조를 확인. 형소법 §§95/99/100-2의 피의자 권리와 통역을 대조했고, 모든 증인에게 같은 침묵권을 약속하지 않는다. FSC §§3/5/8–10에서 경고계좌·관련 계좌 통제 및 해제의 근거를 확인. 태국어 원본 채팅, 문서 제목·발급기관·신분·출석일을 먼저 읽도록 한다. 상환만으로 수사나 계좌 제한이 자동 종료된다고 하지 않는다. 경고 modal 수리 F1은 아래에서 해결. |
| 662 | [NPA 안내](https://www.npa.gov.tw/ch/app/faq/view?id=2144&module=faq&serno=A1084129) 및 [신청 시스템 안내](https://tm2.npa.gov.tw/NM105-505ClientRWD2/TM01A01Q_01.jsp)에서 7일/30일은 신청 가능 시점이고 교부 보장일이 아님을 확인. 온라인 경로는 현장 경찰 처리 및 사상자 요건, 대리 수령은 위임장 안내를 유지한다. CPC §70의 소송상 화해 특별수권, CrPC §236-1의 고소대리와 본인 출석 요구 가능성을 구별했다. §237의 친고죄 고소 6개월과 CC §197의 손해·배상의무자 인지 후 2년/불법행위 후 10년을 섞지 않는다. 태국 귀국 전 후속 서류 수령·권한·치료 연속성을 준비하게 한다. |
| 663 | [CC §§127](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=127)/128/129/[130](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130)과 섭외법 §20을 대조. 모든 상거래 채권에 2년을 부여하지 않고 해당 상품대금·준거법·기산점을 제한한다. 단순 독촉의 중단 후 6개월 내 후속 조치 문제와 CPC §§508/509/511/516/519/521/523/526을 확인. 외국 채권자라는 이유와 국외 송달 필요를 혼동하지 않는다. 채무 법인·수입자·창고 수령자를 분리하고 집행권원·실제 자산 회수를 구별한다. |
| 664 | [MOL 가정 간병인 안내](https://www.mol.gov.tw/1607/28162/28166/28180/28182/28188/29020/)의 LSA 비적용과 [CC §486](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=486)의 계약·관습·법정 지급시기 순서를 확인. 현행 N0090027 §66과 기관 간병인의 별도 범위를 구별. 노동쟁의법 §§9/23의 근무지 관할 조정과 합의 효력, ESA §59의 고용주 변경 승인도 확인. 공장 노동자의 초과근무·기금·해고수당을 가정 간병인 전체에게 이식하지 않는다. 계약 버전·급여 명세·환전 전 실제 수령으로 체불을 산정하게 한다. |
| 665 | [ESA §40](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=40)의 중개기관 및 직원에 의한 의사에 반한 보관과 [§57](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=57)의 고용주 불법 보관을 구별. [WDA 다국어 공지](https://fw.wda.gov.tw/wda-employer/home/file/2c95efb39983afcf0199a7d950f5673e)의 동의한 행정처리용 임시 보관을 영구 유치권으로 바꾸지 않는다. 수수료·서류 반환·취업/체류 자격의 분리 및 [WDA 지원 안내](https://fw.wda.gov.tw/wda-employer/home/lazypg/index)의 실제 지원 범위를 확인. 인도네시아 여권 재발급 절차나 현지 수수료법을 추정하지 않는다. |
| 666 | AML §§2/19/22, 형법 §§13/30/339, 형소법 §§41/43-1/71-1/95/99/100-2를 직접 대조. 계좌 제공, 현금 인출·전달, 고의·인식의 문제를 구별한다. 수리 뒤 금융기관 계좌/가상자산/제3자결제 계정 범위, 경고 의무·합계 3개 이상·5년 반복을 정확히 기술한다. 3년 이하 징역·구류·NT$100만 이하 벌금 및 병과 가능성은 법정 한도이지 예상 선고가 아니다. 적법한 출석 통지에 정당한 사유 없이 불출석한 경우의 절차를 자동 유죄로 표현하지 않는다. 원본 모집 대화와 불리한 메시지도 보존하게 한다. |
| 667 | [LSA §59](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=59), §§3/60/61과 보험법 §§6/36/37/90/[91](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=91)을 확인. 제조업 범위, 필요한 치료비·치료 중 일을 못하는 기간의 원임금, 2년 미치유·지정 병원 평가·장해보상 기준 미충족의 누적 조건 뒤 40개월 평균임금 지급에 따른 해당 임금보상 종결을 유지. 미가입이 당연히 급여를 없애지 않으며 법정 상계와 손해배상상 고용주 무과실 항변을 분리. 보상 2년과 보험 5년의 각 청구권 기산을 구별했다. 진단서만으로 업무 관련성이나 모든 손해를 증명했다고 하지 않는다. |
| 668 | 섭외법 §20, CC §§354/356/357/358/359/360/361/364/365/258/227을 직접 대조. 아래 F3/F6 수리 후 경미성 예외와 보증품질, 하위 고객 손해의 주체가 명확하다. 통상 검사·즉시 통지와 잠복 하자, 고의 은폐 예외, 원격 수령·현지 대리인 없는 거절 시 임시 보관·신속한 적절한 증명의 추정을 유지. 해제의 명백한 불공정 예외, 종류물 대체, 별도 손해 근거, 통지 후 6개월/인도 후 5년 중 먼저 끝나는 해제·감액권, 고의 은폐의 6개월 부분만 예외를 정확히 제한. 현지 시험 조건과 수리 전 부품을 남기는 판단을 제공한다. |
| 669 | CC §§127–130과 [섭외법 §36](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=B0000007)의 청구권 관계에 따른 시효 준거법을 확인. 지급명령 CPC §§508/509/511/515/516/519/521, 가압류 §§523/526의 채권·필요성 소명과 담보를 구분. 발령 후 3개월 내 송달, 송달 후 20일 이의, 적법 이의 부분의 효력 상실과 소송/조정 전환을 유지. F4 수리 후 채무 부존재 확인소송·신청·담보·법원의 재량 정지가 분리된다. 인도 수출·은행 신고법은 현지 검토 대상으로 남겼다. |
| 670 | 섭외법 §20과 CC §§354–365 중 본문 사용 조항 및 §258을 실제 대조. F5 수리 후 §354 1항 가치·효용 예외와 2항 보증품질을 분리. 최종 기술 보고서가 없다는 이유로 매도인 통지를 늦추게 하지 않고, 별도 7일/30일 통지 유예를 만들지 않는다. 인도 내 도착·설치·시운전·검수 및 변경 부품의 시간 순서를 증거화한다. 즉시 하자 통지와 해제·감액권 행사 기간은 다르며 인도 수입·안전·세금법 결론을 내리지 않는다. |
| 671 | [LSA §9-1](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=9-1)의 4가지 누적 요건, 최대 2년·초과 부분의 단축, 재직 중 지급의 보상 제외를 확인. 시행세칙 §§7-1/7-2/[7-3](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=7-3)의 서면·서명·교부, 실제 지역/직무/경쟁대상과 기간, 퇴직 당시 법정 월평균임금 50% 이상 외 생계·손실 비례 등 기준을 유지. 퇴직 후 선급 일시금/월별 지급, LSA §2 평균임금, §15-1 최소근무 약정, 영업비밀 §§2/10을 분리. 50%만 지급하면 모든 약정이 유효하다고 하지 않는다. |
| 672 | [임대주택법 §4](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=4)/[7](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=7)/[12](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=12)/[16](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=16), CC §§432/450을 확인. 법 적용을 전제로 2개월 상한, 계약 종료·주택 반환·계약 채무 정산, 적법 상계 후 잔액 반환을 설명. 관광·정부 등 운영·협동조합·30일 미만 제외를 지키며 모든 기숙사를 일괄 제외하지 않는다. 공동 점검·상당기간 최고 후 불참 및 잔존물 처리 절차를 분리. 통상·약정 사용에 따른 변화와 주의의무 위반, 지방정부 조처 수수료 면제를 확인. 귀국일 환급 보장은 없다. |
| 673 | [CC §309](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=309)/[310](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=310), 섭외법 §20, [CrPC §242](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=242)를 직접 확인. 송금 완료와 채권 소멸, 적법 수령 권한, 제3자 변제의 승인·실제 이익 등 비배타적 예시를 구분한다. [MHA/PIB 2026-08-12 안내](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2298336&lang=2&reg=48)가 NCRP 및 즉시 금융사기 신고 체계를 뒷받침한다. [CIB 2026-09-29 경고](https://www.cib.npa.gov.tw/ch/app/news/view?id=1887&module=news&serno=b76b7228-650c-4e33-a1d4-650a8ec0bc72)는 기존 연락 경로의 독립 확인을 실제로 권고한다. 이를 법정 안전 보증으로 만들지 않으며 recall/신고/동결/환급을 분리한다. |

## 해결된 실질 법률·의미 결함

아래 위치의 ID는 위 전체 파일 경로를 가리킨다. 원문은 수리 전 버전의 정확한 문장이다. 제안문과 최종문을 구별하며, 이 보고서는 수리 전 해시에 PASS를 소급하지 않는다. 본문 수리는 저자가 했다. F1은 본 최종 검수에서 즉시 root에 통보했고, F5는 독립 언어 검수와 교차 확인했다. F2/F3/F4/F6는 별도 locale 검수에서 받은 지적을 원문 법령과 수리본에 대조했다.

### F1 — 661:34, 법정 경고를 가능성으로 약화

- 원문: `การฝ่าฝืนอาจนำไปสู่คำสั่งเตือนของตำรวจ`
- 이유: [AML §22(2)/(4)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22)는 해당 위반의 경고와 대가·3개 이상 유형의 병행 경고를 정한다. “이어질 수 있다”는 법적 강도를 약화한다.
- 권장문: `มาตรา 22 วรรคสองกำหนดให้ตำรวจออกคำสั่งเตือนเมื่อฝ่าฝืนข้อห้ามนี้` 및 4항 병행 경고를 해당 두 유형에 한정해 명시.
- 최종 확인: 34행에 위 권장문이 들어갔고, 36행은 `ในกรณีตกลงหรือรับค่าตอบแทน หรือให้ใช้บัญชีรวมตั้งแต่สามบัญชีขึ้นไป วรรคสี่กำหนดให้หน่วยงานที่มีอำนาจออกคำสั่งเตือนควบคู่กันด้วย`로 두 유형을 특정한다. 정당한 사유 예외·OR·5년 요건·FAQ가 유지됐다.
- 법적 의미: 실질적 의무 강도 정정. 단순 스타일 보존으로 분류하지 않는다. RESOLVED.

### F2 — 666:32–36, 경고 의무·계정 범위

- 원문 34행: `Pelanggaran dapat dikenai peringatan oleh polisi.`
- 이유: F1과 동일한 modal 문제. 수리 과정에서 등장한 `rekening bank` 역시 §22의 금융기관 계좌보다 좁아 별도 한 구절 재수리가 필요했다.
- 권장문: `Pasal 22 ayat (2) menetapkan peringatan oleh polisi atas pelanggaran larangan tersebut.` 합계 3개 이상과 2항/4항 경고 뒤 5년 반복을 명확히 하고 4항 병행 경고를 두 유형에 한정한다. 계좌는 `rekening pada lembaga keuangan`로 표현한다.
- 최종 확인: 34행 `Atas pelanggaran larangan tersebut, Pasal 22 ayat (2) menetapkan peringatan oleh polisi.`에 이어 합계·OR·5년·병행 경고가 명시되었다. 32행의 `rekening pada lembaga keuangan maupun akun layanan aset virtual atau pembayaran pihak ketiga`를 직접 확인. 예외와 36행 법정 형벌 한도가 유지됐다. 중간 해시 `1020ede3…` 대신 최종 `1dc2f41c…`만 인정한다.
- 법적 의미: 경고 의무와 계좌 범위에 관한 실질 정정. RESOLVED.

### F3 — 668:34, 경미한 감소 예외를 보증품질에 연결할 위험

- 원문: `Pengurangan yang tidak berarti dikecualikan dari standar cacat tersebut.`
- 이유: 앞 문장이 가치·효용과 보증품질을 합쳐 놓아 예외가 모두에 적용되는 듯 읽혔다. [CC §354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354) 1항의 가치·효용 감소 예외와 2항 보증품질 의무는 분리해야 한다.
- 권장문: `Penurunan nilai atau kegunaan yang tidak berarti tidak dianggap sebagai cacat menurut ayat pertama. Ayat kedua secara tersendiri mewajibkan barang memiliki kualitas yang dijamin penjual.` 위험 이전 시점을 보존한다.
- 최종 확인: 위 두 문장 중 두 번째 끝에 `pada saat risiko beralih`가 더해져 있고, 앞 문장의 가치·통상/약정 용도와 뒤 원인·시점 입증 설명이 유지됐다.
- 법적 의미: 예외 범위를 좁혀 정확히 하는 실질 정정. RESOLVED.

### F4 — 669:57, 집행정지의 확인소송 조건

- 원문: `फिर भी देनदार ऋण के अस्तित्व को चुनौती देकर, अदालत की अनुमति और उचित सुरक्षा के साथ, वसूली रुकवाने का आवेदन कर सकता है।`
- 이유: [CPC §521(3)](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=521)의 채무 부존재 확인소송, 채무자 신청, 상당하고 확실한 담보에 의한 법원의 재량 정지가 섞였다.
- 권장문: `देनदार आदेश में दर्ज दावा मौजूद न होने की न्यायिक घोषणा के लिए मुकदमा दायर कर सकता है। उसके आवेदन पर अदालत उपयुक्त और सुनिश्चित सुरक्षा देने की शर्त पर जबरन वसूली रोक सकती है।`
- 최종 확인: 57행에 이 문구와 §521 링크가 있다. `उपयुक्त और सुनिश्चित सुरक्षा`는 담보의 적정성과 확실성을 보존한다. 이의기간·송달기간·집행권원과 실제 회수의 구별도 남아 있다.
- 법적 의미: 생략된 소송 요건과 재량 구조를 복원하는 실질 정정. RESOLVED.

### F5 — 670:43, §354 보증품질과 경미성 예외

- 원문: `इसमें मूल्य, सामान्य उपयोग या सहमत उपयोग को प्रभावित करने वाला दोष और आश्वस्त गुणवत्ता का अभाव आते हैं; महत्वहीन कमी दोष के मानक में नहीं आती।`
- 이유: F3과 같은 [§354](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=354) 1항/2항의 범위 문제. 최종 검수에서 직접 발견해 root와 Hindi reviewer에 전달했다.
- 권장문: 1항의 가치·효용 및 경미성 예외와 2항 보증품질 의무를 별도 문장으로 설명하고 위험 이전 시점은 유지.
- 최종 확인: `मूल्य, सामान्य उपयोग या सहमत उपयोग को प्रभावित करने वाले दोष धारा 354 के पहले अनुच्छेद में आते हैं; मूल्य या उपयोग में नगण्य कमी को उसमें दोष नहीं माना जाता। उसी धारा के दूसरे अनुच्छेद के अनुसार, जोखिम हस्तांतरित होते समय वह गुणवत्ता भी मौजूद होनी चाहिए जिसकी विक्रेता ने गारंटी दी थी।` 앞의 위험 이전 문장과 뒤의 원인 입증 문장도 유지됐다.
- 법적 의미: 예외 범위에 관한 실질 정정. RESOLVED.

### F6 — 668:56, 하위 고객 청구의 주체와 손해 종류

- 원문: `Simpan biaya perbaikan dan catatan berhenti produksi; penerimaan seluruh tagihan pelanggan hilir tidak otomatis mengikuti adanya cacat.`
- 이유: 송장 수령·수락인지 매도인의 손해배상 책임인지 불명확했다. [CC §360](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=360)과 [§227](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=227)의 별도 근거·귀책 요건을 유지해야 한다.
- 권장·최종문: `Simpan bukti biaya perbaikan dan catatan berhenti produksi. Adanya cacat belum berarti penjual wajib menanggung seluruh tuntutan ganti rugi dari pelanggan Anda.`
- 법적 의미: 저자가 확인한 비자동 배상 취지를 명확히 보존. 간접 손해를 일괄 배제하거나 새 배상권을 만든 것이 아니다. RESOLVED.

TH662:30의 원래 제목 `เอกสารตำรวจออกตามลำดับ`도 교부 순서를 암시했으나 `ช่วงเวลาที่เริ่มขอเอกสารตำรวจได้`로 고쳐 7/30일의 신청 시점을 설명하는 정확한 본문과 맞아졌다. 법적 기간 변경은 없다. TH의 중복 동사·신청 용어·문장 단조로움, ID664/668 도입 중복, HI673 summary 문법은 각 locale 재검 부록에서 해결되었고 실제 수리본을 확인했다. 같은 결함을 3차 반복 수리할 필요가 없다.

## 첫 두 문단 삭제 시험과 문장 다양성의 서술 판정

현재 첫 두 문단의 각 의미 단위를 삭제했을 때 사라지는 정보와 셋째 문단에서 바로 시작했을 때의 손실을 읽었다. Thai의 띄어쓰기를 문장 끝으로 기계적으로 취급하지 않았다. 아래는 독립 결과 요약이며, 각 언어 보고서는 문장별 표를 별도로 남긴다.

| 글 | 도입에서 보존할 실제 정보 / 삭제 결과 |
|---|---|
| 659 | THB 송금액과 NTD 임금·공제·실수령, 환전 단계; 제2종 범위·양언어 명세·5년 보관. 중복 꼬리 문장 삭제 뒤 같은 정보의 재진술이 남지 않았다. |
| 660 | 물리적 문 닫음과 법적 폐업의 차이, 재개 가능 휴업 제외; 체불·허가 상태·미변제 청구와 기금의 명칭. 삭제하면 자격 전제가 사라진다. |
| 661 | 通知書/告誡處分書의 구별, 봉투·발급기관·신분·출석; 넘긴 접근수단과 당시 인식의 시간 순서. 법 조문보다 먼저 필요한 판단이다. |
| 662 | 30일의 신청 시작 의미와 귀국 일정; 담당기관·수령인·진료 원본. 신청 가능일을 교부일로 오인하지 않게 한다. |
| 663 | 계약 매수인·수입자·창고 수령인이 다를 수 있다는 사실, 납기·대금·품질 이의까지 포함한 증거. 단순 배송증명만으로 청구 상대·채무를 확정할 수 없다는 범위를 보존한다. |
| 664 | 중복 첫 문장 삭제 뒤 MOL의 가정 간병인 적용 제외·계약 기준부터 시작; §486 지급시기의 순서가 이어진다. |
| 665 | 실제 여권 보관자·용도·동의, 중개기관/고용주의 서로 다른 금지 근거. 수수료 논의 전 필요한 분류이다. |
| 666 | 현금 업무가 조사될 수 있는 행위·인식 문제, 계좌 접근·직접 거래·대가의 3가지 증거 축. 단순 계좌 명의와 유죄를 구분한다. |
| 667 | 진단서와 업무 관련 증거의 다른 역할, 제조업 범위와 3개 회수 경로. 조문 목록만으로 시작하면 이 구분이 사라진다. |
| 668 | 한정된 해제·감액 6개월 단서와 기술 협의의 날짜 확인, 준거법 및 매매/혼합계약 범위. 별도 출처 재진술 문장 삭제가 적절하다. |
| 669 | 특정 상품대금의 짧을 수 있는 시효·기산, 준거법과 §36의 연결. 대만 매수인 소재지만으로 시효를 고르지 않는다. |
| 670 | 보고서 미완성 상황의 통지 판단, 내부 공장 보고와 매도인 통지의 차이; 계약서·시험 사양·준거법·혼합계약·인도법 경계. |
| 671 | 재직 급여와 퇴직 후 경업금지 보상, 실제 package 약정; 노동관계·파견·인도 집행 범위를 먼저 제한한다. |
| 672 | 가상 상황임을 명시한 귀국·인도 장면과 두 기록; 법 적용 시 보증금 상한·누적 반환 조건·상계 잔액. 실제 고객 사례가 아니다. |
| 673 | 즉시 은행 연락·거래 식별·답변 기록·책임 논의 대기 금지; 인도 신고 경로와 비보장. 둘째 문단의 마지막 추상 문장은 없어도 핵심 법적 정보가 유지되어 아래 선택 개선으로 남긴다. |

§5 서술 점검: 각 묶음은 문서 질문·범위 규칙·기간·증거·행동으로 도입을 달리한다. 짧은 의미 단위와 긴 조건 문장이 섞여 있고, 법적 누적 조건을 점수용으로 잘게 쪼개지 않았다. 사례를 꾸며 경험담으로 쓰지 않는다. 같은 문단 시작을 세 번 반복한 TH659와 짧은 문장 부족을 지적받은 TH663은 한정 수리가 완료되었다. 조문 인용만 연속하는 세 문단의 기계적 구조나 동일한 결말 주문을 발견하지 않았다. 각 실질 결말은 임금·신청 채권·통지·급여/치료 대응표·부품·공제 내역처럼 해당 사건의 다음 판단으로 끝난다. 상담 언어 제한의 반복은 사실 고지를 위한 것이다.

남은 차단 MONOTONY 항목은 없다. 이 서술 판단은 아래 자동 수치와 동일한 시험이 아니며, 자동 실패를 지우거나 숫자 요건을 통과했다고 바꾸지 않는다.

## 실제 비교한 최근 같은 언어 3편과 국가 간 중복

본 검수는 아래 실제 파일의 첫 두 산문 문단·제목·소제목·끝부분을 직접 읽었다. 각 독립 locale reviewer는 같은 비교 파일을 읽고 구체적 비교를 남겼다. 기존 파일을 수정하지 않았다. TH/ID는 로컬의 최신 번호 021–023이고 모두 published 2026-09-27이다. Hindi는 published 필드가 없어 lastmod/상위 번호 기준 접근 가능한 3편이며, 실제 최신 공개 순서를 확정하지 못한다.

| locale / 비교 파일 (`repo/src/content/columns-<locale>/`) | 직접 확인한 패턴과 신규 글의 차이 |
|---|---|
| th / `021-taiwanese-spouse-divorce-cross-border-parenting.md` | lastmod 09-27. 가족 지원 가정→조부모 돌봄 시간의 예시→친권/면접/부양. 신규 임금·계좌·채권·귀국 후 사고 기록은 그 사례와 구조를 재사용하지 않는다. |
| th / `022-marrying-taiwanese-national-registration-checklist.md` | lastmod 09-28. 결혼식/등록 질문→태국 선행 등록·인증·인터뷰. 신규 661도 질문 도입이지만 실제 경찰 문서 두 종류를 판별하며 나머지 4편은 다른 도입이다. |
| th / `023-baby-taiwan-nationality-birth-registration.md` | lastmod 09-28. 병원 출생자료와 태국/대만 등록·여권을 구분. 중국어 서류명 해설이라는 유용한 방식은 있으나 신규 청구 문제와 결론은 다르다. |
| id / `021-taiwanese-spouse-divorce-cross-border-parenting.md` | lastmod 09-28. 가족 지원·양육 실제 일정의 예시. 664–668의 계약 임금·서류 보관·현금 업무·업무상 재해·기계 하자와 충돌하지 않는다. |
| id / `022-marrying-taiwanese-national-registration-checklist.md` | lastmod 09-28. 혼인 장소 질문과 인도네시아 선행 등록 순서. 신규 글은 같은 등록 체크리스트를 국적만 바꿔 재사용하지 않는다. |
| id / `023-baby-taiwan-nationality-birth-registration.md` | lastmod 09-28. 국적·戶籍·여권의 구분, 가족용 CTA. 신규 글은 각 증거와 행동 판단을 중심으로 하고 공개 변호사 명의·주소 footer를 복제하지 않는다. |
| hi / `016-taiwan-inheritance-custody-analysis.md` | lastmod 10-11, display 2025-09-13, published 없음. 넓은 가족법 분류와 11개 번호 소제목·일반적 마무리. 신규 글은 좁은 시점·거래 결정에 집중한다. |
| hi / `017-taiwan-logistics-business-setup.md` | lastmod 10-07, display 2025-09-13, published 없음. 허가·설립/인수/위탁의 3유형 예고와 번호 구조. 신규 5편은 예고 문단 대신 당장 필요한 판단에서 출발한다. |
| hi / `018-taiwan-semiconductor-market-entry.md` | lastmod 10-07, display 2026-09-17, published 없음. 법인·운영 기능·진출 구조 중심. 신규 671의 퇴직 경업금지나 673의 허위 계좌 송금 문제와 별도. 유용한 비민감 초기 문의 원칙만 일관되게 유지한다. |

동일 언어의 최근 체불·형사·기계하자 글 3개가 확보된 것은 아니다. 대체로 다른 주제의 최근 글이므로 문체 비교의 근거이지 전 세계 주제 독창성의 증거는 아니다. 기존 Hindi 016/017의 원시 Markdown에는 변호사 footer가 있으나 본 검수는 그 footer의 현재 렌더링 여부를 확인하지 않았다. 신규 15편에는 없다.

국가 간 핵심 법리 중복도 실제로 있다. TH663/HI669는 대만 상품대금·지급명령 법리를 공유하고, ID668/HI670은 기계 하자와 통지·해제 기간을 상당 부분 공유한다. TH661/ID666도 계좌 제공법을 공유한다. 동일한 대만법에 대해 국가마다 다른 결과를 창작하지 않았다는 점은 적절하다. 다만 이를 15개의 전혀 새로운 세계적 법률 주제라고 주장해서는 안 된다.

독자가 새로 얻는 행동 판단은 TH663의 계약 매수인·수입자·수령자 식별, HI669의 준거법/시효와 지급명령 단계, ID668의 현지 시험 조건과 하위 고객 손해, HI670의 보고서 대기 중 통지와 시운전/교체 부품 시간표, TH661의 중국어 경찰 서류 판별과 귀국 언어 증거, ID666의 현금 인출·전달 행위와 모집 대화 증거로 구체화되어 있다. 현지 언어로 접근할 수 있는 해당 시장 거래 안내라는 가치가 있다. 인도만의 NCRP 경로는 공식 자료가 뒷받침한다. 검색량·성장률·성공률 또는 각 시장의 법률 수요가 실증됐다는 수치는 없으며, 연구 브리프의 약한 검색 신호를 확정 수요로 격상하지 않았다.

## 사실에 맞는 사무소·문의·표현

현재 [firm services](https://tseng-law.com/en/services), [Wei Tseng 소개](https://tseng-law.com/en/lawyers/wei-tseng), [문의 페이지](https://tseng-law.com/en/contact)를 직접 열었다. 대만 업무·민형사·노동 등 서비스, `wei@hoveringlaw.com.tw`, 영어·중국어·일본어·한국어 직접 상담, 기타 언어의 소통 방식 확인 및 비보장을 대조했다. TH/ID/HI 상담이 제공된다고 암시하지 않는다. 해외 면허·현지 사무소·고객·승소·보장·경력을 새로 만들지 않았다.

각 원고는 메일 링크 1회, 해당 locale contact, 비민감 요약·당사자명·대만 연관·기한 같은 초기 사실을 요청한다. 첫 문의에서 여권·계좌 전체·의료 원본·영업비밀을 보내라고 하지 않는다. 자동 수임·동결·급여 지급·배상·환급을 약속하지 않는다. 원본 보존 조언과 사무소로 전송하라는 요청을 구별했다.

`author: legal-ai-assistant`는 내부 메타데이터에 유지되어 있다. 본문 bold·H1·새 public AI footer·사람/변호사 집필 주장 없음. 가상 장면과 그림 설명은 가상임을 표시하며 실제 사건 자료인 것처럼 소개하지 않는다. 저자 보고서에 기존 자산의 경로·육안 점검·재사용 근거가 있으나 본 검수자가 이미지 픽셀이나 권리 체인을 별도 조사한 것은 아니다. 해당 자산의 권리·최종 렌더링·브라우저 시각 검증은 root의 통합 검증 범위로 남는다.

## 실행 증거와 미지원 수치 요건

실제 실행 명령은 각 최종 파일마다 다음과 같다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-market-columns-20261023/repo/src/content/columns-<locale>/<file>
```

15회 모두 exit 1, `[ko]`였다. 구현의 `DIRLANG`(11행)에는 `columns`, `columns-ja`, `columns-en`, `columns-zh`만 있고 204행은 미등록 폴더를 `ko`로 선택한다. 이번 9개 신규 언어 모두 공식 지원이 없으며 본 범위 th/id/hi 역시 그렇다. Thai 무마침표 문장, Hindi danda, Indonesian 단어 길이에 한국어 문자 기준을 적용한 값으로서 유효한 현지어 합격·불합격 척도가 아니다. 실행 실패를 감추지 않고 원 결과를 보존한다.

| ID | 실제 sentences / CV / short share / run3 | 실제 FAIL |
|---|---|---|
| 659 | 17 / .354 / 0 / .333 | len_cv; short_share; even_run3 |
| 660 | 20 / .383 / 0 / .278 | len_cv; short_share |
| 661 | 21 / .410 / 0 / .105 | len_cv; short_share |
| 662 | 20 / .354 / 0 / .222 | len_cv; short_share |
| 663 | 19 / .370 / 0 / .294 | len_cv; short_share |
| 664 | 51 / .474 / 0 / .020 | short_share |
| 665 | 50 / .462 / 0 / .042 | short_share |
| 666 | 48 / .517 / 0 / .000 | short_share |
| 667 | 55 / .525 / 0 / .038 | short_share |
| 668 | 56 / .388 / 0 / .130 | len_cv; short_share |
| 669 | 16 / .490 / 0 / .143 | short_share |
| 670 | 18 / .435 / 0 / .125 | len_cv; short_share |
| 671 | 16 / .272 / 0 / .143 | len_cv; short_share |
| 672 | 20 / .505 / 0 / .056 | short_share |
| 673 | 16 / .303 / 0 / .143 | len_cv; short_share |

본 검수자는 CLI·공유 기준을 수정하거나 다른 언어를 강제해 점수를 만들지 않았다. author/locale 보고서의 ICU·danda 진단은 보조 설명이고 기존 해시에 대한 값도 있어 최종 공인 점수로 재표기하지 않았다. 자동 `FAIL 0` 요건은 미해결이며 root가 완전 통과로 보고하면 안 된다. 실제 언어 검수와 위 서술 판정은 별도로 PASS이다.

repo의 실제 `gray-matter`를 이용한 읽기 전용 Node 검사 결과 `659 … 673 PASS structural`, `FILES 15`를 얻었다. 검사 항목은 파싱, FAQ 3개, audience, 내부 author, published/lastmod 2026-10-23, 메일 1회, 본문 bold/H1 부재이다. 구조 통과는 법률 검수나 렌더링 통과를 대신하지 않는다.

## 선택 개선과 최종 한계

차단 결함은 없다. `hi-locale-r1.md`의 S1–S6는 선택 개선으로 남아 있으며 이번 수리에서 채택하지 않았음을 확인했다. 특히 673:29의 `उपलब्ध स्थिति को उसी नाम से दर्ज करें।`는 추상적이므로 삭제하거나 `बैंक ने केवल अनुरोध दर्ज किया है या वास्तव में रकम रोकी है, उसके जवाब के अनुसार ही लिखें।`로 구체화할 수 있다. 이는 현행의 비보장·은행 답변 보존 의미를 바꾸지 않는 편집 선택이다. 669:65의 마지막 독촉 날짜뿐 아니라 첫 청구 이후 전체 도달 증거를 준비하자는 선택 제안도 유용하지만, 본문은 이미 독촉으로 무한 시효 갱신이 되지 않음을 설명한다. 선택 수리를 새 의무나 추가 검수 회차로 만들지 않는다.

최종 PASS는 위 15개 해시에 대한 독립 법률 근거·편집 결과다. 공개 권한을 부여하지 않는다. MOJ 정리일 이후 변경의 부존재, 실제 NCRP 신고 성공, 원어민 인간 검수, 법률 정확성 보증, 이미지 권리 체인, 브라우저/모바일 화면, 현재 live 내부 링크, 배포·공개·인덱싱 성과를 증명하지 않는다. UI 정책 거절을 우회하지 않고 브라우저 자동화를 사용하지 않았다. 새 법적 문구나 해시 변경이 생기면 영향받는 범위만 재검수해야 한다.
