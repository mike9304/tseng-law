# 기존 비포르투갈어 23편: 독립 회귀 검수 최종 결과

전체 판정: PASS, 23/23. 검수 날짜는 2026-10-25, 최종 파일 관측 시각은 `2026-10-25T12:06:02.326326+00:00`이다. 해당 버전에서 남은 필수 수정은 없다. 이는 편집·근거 회귀 검수 결과이며 게시 권한이나 실제 배포 증명이 아니다.

검수자 `/root/recheck_market_changes`는 원고 및 수정안을 작성하지 않은 독립 AI 검수자다. 원고는 읽기 전용으로 다루었으며 보고서·증거 파일만 작성했다. 사람 원어민 또는 변호사의 검수, 자격 보유, 결과 보장을 주장하지 않는다.

## 범위와 버전

승인 기준 `a188e620ee7eebc3f2188829e2c318904802ef7d`에서 최초 점검 HEAD `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`까지 본문이 달라진 25편 중 다른 담당자의 포르투갈어 2편을 제외한 23편이다. TH 4, ID 1, HI 5, FR 2, DE 3, IT 4, ES 4. 최초 전체 diff, 각 변경 문장 및 주변 문맥, 영향을 받는 도입·결론을 읽었다. 이후 별도 작성자의 제한 수정은 실제 최신 파일과 전후 diff로 다시 확인했다.

최종 관측 HEAD는 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`이지만, 이 판정의 버전 기준은 아래의 작업 트리 파일 SHA-256이다. 최초 9편은 최초 독립 PASS 이후 내용이 같고, 13편은 별도 작성자의 제한 수정 뒤 독립 재검수를 통과했다. 나머지 DE683은 실패한 수정안을 보존하고 a188e620 승인 본문을 그대로 복원한 별도 안이다.

## 편별 판정

모든 경로의 기준 디렉터리는 `/Users/son7/tseng-case-trends-20261025/repo`다. 실제 CLI 명령·출력·종료 코드·mtime·diff 해시는 `existing-market-final-manifest.json`과 그 안의 증거 경로에 있다.

| 원고 경로 | 판정 | 실제 CV | 최종 SHA-256 |
|---|---|---:|---|
| `src/content/columns-th/659-thai-worker-taiwan-payslip-deductions-unpaid-salary.md` | PASS | 0.452 | `bf9c2a83e90e20c0562c60e7bf7e3eb0edcc946a8330111c102a174adf5187d2` |
| `src/content/columns-th/660-thai-worker-taiwan-factory-closure-wage-fund.md` | PASS | 0.512 | `7f46f3f35fc82125bc63e6165dec82174ee2f04593e8e0ec28584e81196d4a9c` |
| `src/content/columns-th/662-thai-return-home-taiwan-traffic-injury-records.md` | PASS | 0.51 | `3461f6e65f9126641cbd0fb876211624105de0584bd3430b04fd68a9837186ce` |
| `src/content/columns-th/663-thai-supplier-taiwan-buyer-unpaid-invoice.md` | PASS | 0.507 | `15bc3d175d9f5ddf9c6221682d126aaa0d9ace360029d4d6006c4c452ee18d0f` |
| `src/content/columns-id/668-indonesian-buyer-taiwan-machinery-defect-notice.md` | PASS | 0.456 | `75aca1f1bbce526d813c25ff639cb2439a864a9a03507f79583e34d646044196` |
| `src/content/columns-hi/669-indian-supplier-unpaid-taiwan-invoice.md` | PASS | 0.453 | `81a291e8a6e4fe627ef088aaef1db7cff07ff9728d893b6a51f4f993cd3704a3` |
| `src/content/columns-hi/670-indian-buyer-taiwan-machinery-defect-notice.md` | PASS | 0.457 | `b85718d854d5b9887aed2613a01585c8f72d6f23fae977d21c2feff4cd3dcb57` |
| `src/content/columns-hi/671-indian-engineer-taiwan-noncompete-compensation.md` | PASS | 0.47 | `78493ba69c70c82430a04196f7ee58c0f9ee7356b394e13e3f0c9485aacdda11` |
| `src/content/columns-hi/672-indian-resident-taiwan-rental-deposit-handover.md` | PASS | 0.454 | `3973fb9f67f20198b09f191293062e701ef8430913a06b4d6403911bb38e10ee` |
| `src/content/columns-hi/673-indian-importer-taiwan-supplier-bank-change-fraud.md` | PASS | 0.471 | `7568b307e743bb799e899a9b3a11f32de846c8b0fa00d271755989066c8c98c9` |
| `src/content/columns-fr/674-france-exporter-taiwan-unpaid-invoices-credit-notes-returns.md` | PASS | 0.453 | `660a144dfd1e111ad482ae397d9f0e3ae149e965866f1d399ae6637aac44378a` |
| `src/content/columns-fr/678-french-employee-taiwan-unpaid-wages-employer-closure.md` | PASS | 0.458 | `917fbdcdc1d6696f55cb2936b34d425b759660deb0863854a93663453fea4fc8` |
| `src/content/columns-de/679-taiwan-maschinenlieferung-fat-sat-schlusszahlung.md` | PASS | 0.457 | `8479b85121a74268424ebfa465618ff8758f86bce50d69f3ed65c0988938f725` |
| `src/content/columns-de/681-taiwan-lieferant-werkzeuge-pruefvorrichtungen-herausgabe.md` | PASS | 0.462 | `3b362929c31af4d05abce635f63ebd73244af7482b04ffe6f06e7eec91ab7eeb` |
| `src/content/columns-de/683-deutsches-urteil-vermoegen-taiwan-vollstreckung.md` | PASS | 0.454 | `0812b7a97e8364a17674920fb69e927d95d7d7cfabb9b5b01b9fbcbb2055e993` |
| `src/content/columns-it/685-italian-brand-taiwan-distributor-trademark-registration.md` | PASS | 0.453 | `17ad264265124366a2704e8410f96aedff40238f252c4913ca5e40531f487de4` |
| `src/content/columns-it/686-taiwan-oem-molds-design-files-handover.md` | PASS | 0.458 | `5c8df70a9a4733c5f12a49286c3c0fdfa80cff88684b38c34ccae6ed3051483d` |
| `src/content/columns-it/687-italy-resident-heir-taiwan-inheritance-renunciation-debts.md` | PASS | 0.45 | `336e3fe25e17a09df632d6c0c34989bd2b135702941c469f7798db76c2bd9b0d` |
| `src/content/columns-it/688-italian-business-visitor-taiwan-summons-interpreter-defense.md` | PASS | 0.455 | `bd42e4931c1656e93eea6bf694873500dca6afa34d6b44d69df96822dcb4e209` |
| `src/content/columns-es/689-spain-exporter-taiwan-unpaid-invoices.md` | PASS | 0.466 | `49e43adef77aab80f131baa2311c58af69b3ca07dcc3ce3ccd0b1e1b99c546d1` |
| `src/content/columns-es/691-spanish-judgment-taiwan-assets-enforcement.md` | PASS | 0.47 | `a43603c866fef8fccbd517f8906d4211a0adea0acfc8f3e2c4010ffa14a2b096` |
| `src/content/columns-es/692-return-spain-unpaid-taiwan-wages.md` | PASS | 0.463 | `b5019f49da8eef11ba689cb1c6f1efcccdb172575dc259712ca09949fbb8fb65` |
| `src/content/columns-es/693-spain-resident-taiwan-divorce-property.md` | PASS | 0.465 | `dd296d71681b98872e72e5696f9ccf8ff2c3cafbce49d8dc561d323844a22d86` |

## 최초 반려와 해결

최초 결과는 9 PASS / 14 REQUEST_CHANGES였다. 정확한 당시 문장, file:line, SHA, 사유, 좁은 수정 방향과 법률 의미 영향은 `existing-market-initial-findings.md`에 보존했다. 당시 19개 비태국어 파일 중 10편이 실제 CLI에 실패했고, 같은 검사기로 a188의 19개 본문은 모두 통과했다. 태국어는 처음 자동 분리표 탐색이 exit 2를 반환했으므로 통과로 취급하지 않았다. 현행 본문을 독립적으로 읽고 새 SHA에 묶은 분리표를 승인한 뒤 실행하니 4편 모두 문체 기준에 미달했다.

- TH659·663: 짧은 실무 문장의 의미를 명확히 하고 상담 언어·수임 안내의 불필요한 대비를 줄였다. R1에서 통과했다. TH660·662는 R1 실패를 보존했으며, R2에서 수임의 별도 합의와 접수번호·수령기관 이름의 함께 보관을 간결하게 표현해 통과했다. 임금·평균임금·기금의 범위, 신청 조건, 기한과 위임 범위는 유지했다.
- ID668: 실제 관찰과 추측을 구별하는 독립 지시를 복원하고, 정확한 통지 상대방과 회사명 대조를 명료하게 했다. 하자 통지의 법적 강도와 원자료 보관은 유지했다.
- HI669·670·672·673: 통화, 기술 원인 미확정, 메시지 전체와 교체 부품, 열쇠·계량 기록, 송장 원본·입수 경위를 각 문맥에 맞게 읽히도록 정리했다. 669 제목의 `मोहलत`는 `शर्त`로 바뀌어 제130조의 조건부 6개월을 일반 유예기간처럼 읽을 위험을 줄였다. 670의 법정 승인 간주와 672의 지방정부 조정 수수료 범위를 약화시키지 않았다.
- DE679·681: 시험 조건과 이상 상황의 관계, 도구별 식별과 파일의 별도 기록을 복원했다. 제761조의 대안들을 누적 요건으로 바꾸지 않았다. 상담 단계와 언어 조율을 연결해도 비밀자료 전송 제한은 유지했다.
- ES691·692: 반복된 문단 첫머리를 문의 안내의 자연스러운 시작으로 바꾸었다. 네 상담 언어, 사전 합의, 수임 비성립 및 민감자료 제한은 그대로다.

DE683은 특별히 구별한다. 최초 56행의 `Für jedes Anerkennungshindernis sollte feststehen, welches Dokument es belegt.`는 불승인 장애사유를 입증할 문서를 준비하라는 방향으로 읽혀, 승인 심사 항목별 문서를 대응시키던 원뜻을 흐렸다. 대만 민사소송법 제402조의 불승인 사유에 대한 실무 자료 검토를 중립적으로 표현해야 한다. 별도 작성자가 이를 중립 문장으로 수정했지만 두 번의 제한 문체 수정 후에도 CV .441로 실패했다. 그 초안 `ca115b304e91b378b15785da3b439c61bb388ed45b14b550d6a3733ed0767fb7`은 `existing-de-repair-683-r2-REJECTED.md`에 보존되며 REQUEST_CHANGES 상태다.

현재 DE683의 PASS는 그 실패 초안에 대한 승인이 아니다. root가 a188e620의 승인 본문을 바이트 단위로 복원하고 현재 캡션·메타데이터를 유지했다. 독립적으로 본문 동일성을 확인했고 현재 SHA `0812b7a97e8364a17674920fb69e927d95d7d7cfabb9b5b01b9fbcbb2055e993`에 실제 CLI를 실행해 CV .454 / FAIL 0을 확인했다. 복원된 `Jedes Anerkennungsthema erhält in der Arbeitsübersicht seine Fundstelle.`는 중립적인 자료 대응 안내다. 새 문체 개선 완료나 세 번째 수정 성공으로 계산하지 않는다.

## 현행 공식 근거와 법률 의미

2026-10-25에 중대한 변경 문장의 근거가 되는 공식 조문 16개와 실제 사무소 연락 페이지를 직접 열었다. URL별 날짜·정확한 확인 범위는 `existing-market-evidence/official-source-ledger.json`에 있다. 87편 전체의 모든 불변 조문을 새로 조사했다는 주장은 하지 않는다.

- [민사소송법 제402조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=402): 외국 확정판결과 네 불승인 사유를 유지했다. DE683 문서 대응 방향이 복원됐고 특정 국가와의 상호보증 결과를 단정하지 않는다.
- [민법 제130조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=130), [민사소송법 제509조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=509), [제523조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0010001&flno=523): 6개월 내 후속 조치의 조건, 미이행 반대급부·국외/공시송달 제한, 장래 집행 곤란의 문턱을 보존했다. 외국 채권자라는 이유만으로 지급명령이 배제된다고 쓰지 않는다.
- [민법 제356조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=356): 통상 검사와 신속 통지, 통상 검사로 알 수 없는 하자 예외, 발견 후 통지 및 승인 간주의 강도를 유지했다. 실무적 증거 보관 권고를 새 법정 의무로 바꾸지 않았다.
- [민법 제761조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=761)와 [제767조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000001&flno=767): 인도 및 대안 방식, 무권원 점유에 대한 반환 범위를 보존했다. 물건의 소유·점유와 설계자료의 저작권·이용허락을 동일시하지 않는다.
- [노동기준법 제14조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=14), [취업서비스법 제59조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=59), [노동기준법 제2조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=2), [시행세칙 제7-3조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030002&flno=7-3): 무통지 종료의 법정 사유와 고용주 변경 승인, 기본급과 법정 평균임금, 퇴직 후 경업금지 보상 조건·지급 시기를 섞지 않았다.
- [임대주택법 제16조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0060125&flno=16), [형사소송법 제99조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=99), [제95조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=95): 조정 수수료 면제를 모든 소송 비용 면제로 확대하지 않았고, 통역을 미리 요청해야만 권리가 생긴다고 하지 않으며 법률구조의 자격 조건을 유지했다.
- [섭외민사법률적용법 제48조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=48)와 [제50조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=B0000007&flno=50): 부부재산과 이혼의 연결 기준·시점이 다를 수 있으므로 ES693의 구체화된 제목은 본문 범위에 맞는다. 부동산 예외를 생략하지 않았다.

열어 본 MOJ 공식 페이지의 법령 정리 기준일은 2026-10-16으로 표시됐다. 민법의 미시행 경고 대상 제166-1조·제1223조를 검토 조문의 현재 효력과 혼동하지 않았다. 변경 문장에 법 개정이나 장래 시행을 새로 단정한 부분은 없다. 외국법 판단이 필요한 사안은 해당 관할의 자문 필요성을 유지한다. 출처 URL의 존재만으로 정확성을 인정하지 않았다.

[실제 사무소 연락 안내](https://tseng-law.com/en/contact)에서 중국어·영어·일본어·한국어 상담과 초기 비민감 문의 경로를 확인했다. 원고들은 나머지 언어의 상담을 보장하지 않고 사전 확인을 요구한다. 최초 이메일을 자동 수임으로 제시하거나 외국 자격·사무소·승소·고객·실적을 추가하지 않았다.

## 현지 문체와 도입 삭제 검사

이전 독립 locale 보고서 `market-th/id/hi/fr/de/it/es-independent.md`는 `/Users/son7/tseng-arc-revision-20261024/work/reviews/`에 있다. a188e620의 23개 정확한 파일 해시가 해당 locale 보고서의 승인 버전과 일치함을 확인했다. 과거 PASS를 바뀐 파일에 그대로 붙이지 않고, 이번 변경 구절과 영향을 받는 결론을 독립적으로 다시 읽고 현재 SHA에 판정했다. 새로운 사람 원어민 검수나 별도 미실행 검수를 주장하지 않는다.

각 글의 첫 두 문단은 구조 안내를 늘어놓기보다 다음 판단에 필요한 사실을 제공한다. 삭제하면 없어지는 정보는 다음과 같다.

| 대상 | 도입에서 유지해야 하는 고유 정보 |
|---|---|
| TH659 / 660 / 662 / 663 | 송금액과 임금 수령액·적용 노동자 범위 / 임시 조업중단과 기금 요건·선행 청구 / 귀국 전후 경찰자료 신청 시점과 수령 담당 / 주문 당사자와 납품·지급기일·품질 이견 |
| ID668 | 하자 권리 행사 기한과 기술 협의의 구별, 준거법과 혼합계약 범위 |
| HI669 / 670 / 671 / 672 / 673 | 채무자와 채권 항목 / 수령·발견·통지 증거 / 경업금지 조항과 보상의 별도 검토 / 인도·열쇠·보증금 증거 / 송금 변경 지시와 실제 결제·수령 관계 |
| FR674 / 678 | 차감·반품·credit note별 채무 항목과 준거법 / 미지급임금·기금의 범위와 노동자 자격 |
| DE679 / 681 / 683 | FAT/SAT와 지급 조건·계약 당사자 / 지불자·계약자·점유자 및 물품 식별 / 판결과 실제 집행 대상 자산 |
| IT685 / 686 / 687 / 688 | 상표 등록·이의 시기 / 편집 가능한 파일과 이용 권한·자료 목록 / 사망 당시 국적·대만 상속인·반정 예외 / 증인·피의자 구별과 통지·봉투 |
| ES689 / 691 / 692 / 693 | 거래 법인과 준거법 / EU 증명과 대만 집행 경계 / 메일 접근·증거와 고용 분류 / 국적·주소·합의와 시간순 기록 |

각 7개 locale의 최근 3편, 실제 704·705·706(2026-10-24 게시)을 비교했다. 파일명은 각 `src/content/columns-<locale>/` 아래 `704-taiwan-arc-first-application.md`, `705-taiwan-visa-residence-work-study-family.md`, `706-taiwan-arc-renewal-changes-reentry.md`다. 도입, 제목 구조, 독자 판단을 비교한 추출은 `comparators-europe.json`, `comparators-asia.json`에 있다. ARC 기한·입국 목적·변경 신고라는 공통 주제를 그대로 채무·노동·가족·지식재산 글에 복제하지 않았다. 의무적인 상담 언어 사실은 공통이어도 본문의 질문, 자료, 다음 행동은 사건 유형별로 구체적이다. 비교 글 전체의 법률 정확성까지 재인증한 것은 아니다.

## 실제 문장 검사와 규칙 5절

최종 23편 모두 설치된 실제 `variety_metrics.py check <정확한 파일> --lang <locale>`가 exit 0 / FAIL 0이다. 태국어 네 편은 `--sentences <현재 SHA>.json`을 추가했다. 분리표는 실제 현재 문단을 읽은 뒤 점수를 보기 전에 확정했고, 임의 분할·새 문장부호·옛 SHA 재사용으로 수치를 맞추지 않았다. `existing-market-thai-boundary-review.md`, `existing-market-thai-r1-boundary-review.md`, `existing-market-thai-r2-boundary-review.md` 및 각 approval JSON을 보존했다. 현재 태국어 최종 조합은 659·663 R1, 660·662 R2다.

수치와 별도로 규칙 5절을 읽으며 점검했다. 똑같은 가상 상황 도입, 독자에게 없는 오해를 반복해 반박하는 표현, 일반적인 경고만 덧붙이는 짧은 문장을 추가하지 않았다. 짧은 문장은 통화, 관찰/추측, 기록 식별, 연락 언어 등 실제 역할이 있다. 긴 법적 문장은 조건과 예외를 함께 둔다. 문단 시작·문장 길이와 인용 위치가 단조롭게 고정되지 않았고 실무 자료 설명이 법률 인용 사이에 있다. 마지막 실질 문단은 각 문서·증거·후속 행동으로 돌아간다. 표준 검사의 통과를 문체 자연스러움 자체의 증명으로 대신하지 않았다.

최종 파일과 실제 PASS 시점의 SHA는 23/23 일치한다. 최초 이번 회귀 검수 파일 대비, 링크 순서·본문 아라비아 숫자 순서·FAQ·이미지 경로/alt/caption·발행일·내부 author는 23/23 유지됐다. frontmatter 차이는 수정 파일의 lastmod뿐이다. 바뀐 문장에서 태국어·힌디어 등으로 풀어 쓴 수치와 조건은 수동 diff 검토로 확인했다. 본문에는 bold나 새 공개 AI footer·가짜 사람 byline이 없다. 독일 공식 URL의 `__328.html`은 bold가 아니다.

## 증거 한계와 다음 단계

검수자가 새로 수행한 범위는 23편의 기존 승인본 대비 법률·문체 회귀 및 제한 수정의 재확인이다. 원고의 모든 불변 사실에 대한 새로운 전면 법률 조사, 특정 사건 결과·상호보증·외국법 자격 판단, 실제 사람 원어민 감수, 브라우저 시각·상호작용 확인은 포함하지 않는다. 그림의 최종 공개 바이트와 HTTP 전달, 87편 라이브 readback, 포르투갈어 검수, 배포는 root/다른 담당자 범위다. 이미지 캡션을 짧은 허구 장면 안내로 유지하는 별도 커밋을 되돌리지 않았다.

이 보고서의 PASS를 다른 SHA에 적용해서는 안 된다. 현재 23편에는 추가 필수 수정 요청이 없으며, 보존된 DE683의 실패 수정안만 계속 REQUEST_CHANGES로 구분한다.
