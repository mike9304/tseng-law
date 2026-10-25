# Turkish ARC 704–706 — 작성 및 자체 점검

작성일·직접 점검일: 2026-10-25 KST. 담당: /root/column_deploy. 이 문서는 저자의 자체 점검과 통합 인계다. 독립 검수, 인간 원어민·변호사 검토, 게시 승인 또는 실제 배포 완료를 주장하지 않는다.

## 대상과 정확한 버전

| 원고 | SHA-256 | 상태 |
|---|---|---|
| src/content/columns-tr/704-taiwan-arc-first-application.md | eae17b5cd8d03c42697698a996d5566d016c04070716da27655cd365be1e0d8a | R1–R5 반영·자체 재점검 완료, 독립 재확인 대상 |
| src/content/columns-tr/705-taiwan-visa-residence-work-study-family.md | 3310f47c1ef54d7e6567af7d5dcbdb49318148fbfee47d71e18746d821f2d2d0 | R1–R5 반영·자체 재점검 완료, 독립 재확인 대상 |
| src/content/columns-tr/706-taiwan-arc-renewal-changes-reentry.md | cf143d1db6bf28bc9771ec0bf6e5a505b112bcf00779b0b0e901c3cada6901fb | R1–R5 반영·자체 재점검 완료, 독립 재확인 대상 |

범위 밖 원고·공용 코드·검사기는 수정하지 않았다. 같은 역할의 별도 소유 연구는 research/deployment-capacity.md, packer-capacity-experiments.md 및 해당 연구용 재현 코드·결과 JSON이다. 운영 packer/Worker 구현, commit, push, 배포를 실행하지 않았다.

## 읽은 규칙과 번역 기준

BRIEF, 현행 AGENTS, docs/columns/EDITORIAL-VOICE.md, FRONTMATTER.md, /Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md, /Users/son7/tseng-lanes-shared/SENTENCE-VARIETY-RULE.md와 LESSONS.md 전문을 읽었다. 홈 editorial-voice.md와 옛 editorial skill의 review-criteria.md는 현재 경로에 없었다. BRIEF가 명시한 저장소 문체 정본을 사용했고, 없는 파일을 읽었다고 기록하지 않는다.

현재 EN/KO/ZH 704–706 전문, docs/audit/codex-column-recheck-20261024/research/source-refresh.md, ARC BRIEF와 최종 core 검수 근거, 이번 research/arc-source-facts.md를 대조했다. 반려 초안이나 과거 held 판을 사용하지 않았다. 기준 원고의 현재 해시는 다음과 같다. 옛 독립 PASS 문서의 해시를 현재 파일에 무조건 승계하지 않았다.

| 언어 | 704 | 705 | 706 |
|---|---|---|---|
| EN | 610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f | 87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304 | 1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71 |
| KO | cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1 | 727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a | 4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc |
| ZH | 0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468 | 290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3 | 4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c |

표준 터키어의 siz 어조를 적용했다. 직접 안내는 inceleyin, saklayın, kontrol edin 등 복수 존칭으로 썼으며 sen 어조를 섞지 않았다. Türkçe 독자를 Türkiye 국적자로 간주하지 않았다. 법 체계는 대만이며 Türk hukukundaki 제도를 대신 적용하지 않았다. 기관명은 Ulusal Göç İdaresi (NIA), BOCA를 식별하고, 기존 863의 법명 표기와 맞췄다.

## 공식 자료 확인 범위

2026-10-25 직접 열어 해당 조문·본문을 읽은 핵심 자료는 아래와 같다. 실제 링크는 세 원고의 본문 및 출처 목록에도 남아 있다.

- [현행 이민법](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080132): 22·23·31·34조. 31조 단일 URL은 timeout이었고 같은 공식 현행전문의 해당 조문으로 확인했다.
- [이민법 23-1조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23-1), [거류 규칙](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129): 사유변경 30일/15일, 일반 3개월, 졸업 1년+1년, 배우자 첫 최장 1년, 재입국.
- [인재법 현행 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295): 12조 신졸업자 취업허가 면제, 15조 배우자 취업허가 신청, 16조 전문직·가족 경로, 17조 6개월+추가 1회.
- [허가증 수수료](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135): 1,000 NT$/년, 1년 미만 1년분, 2,200 NT$ 가산, 재발급 500 NT$.
- [NIA 0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), [NIA 학생 0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news): 사진·서류·신청·심사·납부·수령을 대조했다. 학생 자격 항목의 영어 more than three와 법률 및 서류 항목의 at least three 차이는 최소 3개월로 유지했다.
- [BOCA 국내 발급 후 ARC](https://www.boca.gov.tw/fp-398-723-7b71f-1.html), [정규유학](https://www.boca.gov.tw/cp-166-283-c4da3-2.html), [어학 거류](https://www.boca.gov.tw/fp-166-285-041cb-2.html): 기산일, 적격 입국 방식, 4개월+최소 3개월, 주중 15시간, 휴가 포함 결석 1/4 이하를 확인했다.
- [창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) 주의 3·6항, [Gold Card 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/406403/) 주의 6·7항: 4개월 갱신과 창업 종료 후 3개월 신청 창구를 대조했다.
- [취업서비스법 현행 영문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=N0090001)을 열고, 해당 규정에 대한 기존 source-refresh의 43·48·50·53조 대조 결과를 함께 사용했다.
- 독립 검수 후 R1–R5 수정 시 [NIA 전문인재·가족 온라인 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/) 주의 9항을 직접 읽었다. 같은 때 인재법 5·16조, 이민법 22조, NIA 0902 심사기간 문단도 다시 열어 신청 주체·가족 범위·면제·반환 표현을 확인했다.

나머지 보존 링크의 세부 안내와 시행연혁은 10월 24일 source-refresh 및 이번 공통 facts의 조사 범위를 사용했다. 모든 URL을 이 작성자가 새로 열어 전수 인증했다는 뜻은 아니다. MOJ가 표시한 법령 정비 기준일은 2026-10-16이며 10월 17–25일 관보를 전수 조사하지 않았다. 기관에 실제 신청·결제하거나 개별 승인 여부를 문의하지 않았다.

## 법률 의미와 FAQ 대조

| 원고 | 보존한 조건과 예외 |
|---|---|
| 704 | 거류허가 전제 + 입국 다음 날부터 30일; 국내 비자 발급일부터 30일; 통합증명 예외; 모든 방문자에 공통인 전환권으로 일반화하지 않음. 일반 사진 2년·재직/등록 후 재학 자료 1개월. 인증 의무와 NIA가 요구할 수 있는 중국어 번역의 강도 구별. 대만 거주 AND 호적등록 국민 배우자 첫 신청의 최장 1년. 일반 최장 3년과 특별 5년 구별. 1,000/2,200 NT$, 1년 미만도 1년분, 僑生 감면 범위. 일반 심사 10근무일, 학생 심사 5근무일·보완 후 재계산, 승인 후 납부 5근무일, 결제 후 카드 3근무일, 전자형 6개월 이하. |
| 705 | 전문직의 취업허가 OR 면제와 NIA 별도 승인, 통상 고용주의 취업허가 신청. 제16조 가족 초청자는 대만에서 전문업무를 하는 일반 전문인재 OR 특정전문인재이며 양쪽 모두 선행 거류 OR 영주 허가. 가족은 배우자·미성년자·장애로 자립 불가능한 성년 자녀. 부모와 해당 장애 조건을 충족하지 않는 성년 자녀는 제외. 일반 방문비자 60일 이상/제한 없음/신청 자격. 어학 4개월 이수+최소 3개월 등록, 15시간, 휴가 포함 결석 ≤1/4. 대만 호적 국민 배우자 취업허가 면제와 외국 특정·고급 전문인재 배우자의 허가 신청 구별. 디지털 노마드의 대만 사업자·고용주 서비스 제외 및 자동 ARC 부정. |
| 706 | 일반 갱신 만료 전 3개월, 특수 4개월/사업 종료 후 별도 3개월. 주소·근무처 다음 날 30일, 사유변경 발생일 30일, 다른 사유 BOCA 발생일 15일. 사유 소멸 시 허가·카드 말소와 제31조의 조건별 계속거류 가능성. 초과 30일 미만 AND 원래 사유 존속 AND 처분 후 재신청, 유예 아님. 전문직 6개월+1회 총1년과 졸업생 1년+1회 총2년, 어학종료와 구별. 대만 전문학사 이상+신졸업 NIA 연장허가의 취업허가 면제. 재발급 증빙 OR 관계와 500 NT$, 자동 기간연장 아님. 재입국 사전 허가·APRC 예외·카드기간 한계·접수증 비대체. 특정 전문인재·가족 온라인 경로에서 신청 중 출국 시 심사 종료, 재입국 후 해당 자격을 충족하면 재신청 가능. |

FAQ 9개는 EN의 조건을 그대로 대조했다. 704의 족보·국적·서류 공관 설명과 705의 Türkçe 독자 문장은 대상 국적을 임의 추정하지 않기 위한 맥락이다. 706은 KO/ZH와 공통 facts에 있는 졸업 후 1+1년 및 현행 12조 조건을 명시해, 연장거류 중 누구도 일할 수 없다는 오독을 막았다. 거류나 취업의 승인 결과를 보장하는 문구는 없다.

## 실제 문장 수정 기록

| 문제 문장 / 위치 | 이유 | 실제 수정 | 의미 보존 |
|---|---|---|---|
| 704 초고: “Sistem seçimini vatandaşlığınızın dilinden veya meslek unvanınızdan değil, gerçekten başvurduğunuz hukuki kategoriden yapın.” | vatandaşlığınızın dili는 자연스럽지 않으며 국적과 언어를 잘못 묶는 표현이다. | “Başvurduğunuz hukuki kategori, hangi sistemi kullanacağınızı belirler.” | 신청 시스템은 법적 범주로 선택한다는 내용 유지. 국적 추정 없음. |
| MONOTONY: 704 문단 시작 — “Genel dosyada…”, “Genel ARC üst sınırı…”, “Genel başvuru rehberindeki inceleme süresi on iş günüdür.” | Genel로 3개 문단을 시작해 실제 TR 프로필 top_opener_n FAIL. 막연한 단문을 덧붙이지 않고 심사기간 문장의 중심 정보를 앞으로 옮긴다. | “On iş günlük inceleme süresi, genel başvuru rehberinde belirtilir.” | 일반 신청의 10근무일, 제외 기간과 보완 후 재계산 유지. |
| 704 초고: “[NIA’nın belge listesi], dosyanın ikamet nedenine göre nasıl değiştiğini gösterir:” | 기관명 중심 문단 시작이 반복되고 문서 소개에 그친다. | “İkamet kategorinize göre [NIA’nın belge listesinde] şu farklılıklar bulunur:” | 동일 링크와 뒤 표의 실제 서류 조건 유지. 이 수정만으로 지표 FAIL이 해소됐다고 주장하지 않음. |
| 704 초고: “Öğrenci çevrim içi yolunda onay sonrası takvim ayrıdır.” | 학생 처리 절차를 추상적으로 예고한다. KO/ZH·NIA 0929의 실제 심사 기준을 직접 적는다. | “Çevrim içi öğrenci başvuruları için ilan edilen inceleme süresi beş iş günüdür ve eksik belgeler tamamlandıktan sonra yeniden hesaplanır.” | 학생 심사와 승인 후 납부의 서로 다른 5근무일을 분리해 보완. 기존 납부·수령 조건 삭제 없음. |
| 706 초고: “İstihdam temelli uzatma, ilgili çalışma izniyle; öğrenci başvurusu, devam eden kayıtla bağlantılıdır.” | 면제 대상도 가능한데 취업허가만을 유일한 조건으로 읽을 여지가 있다. | “İstihdam temelli uzatma, ilgili çalışma izni veya uygulanabilir muafiyetle; öğrenci başvurusu, devam eden kayıtla bağlantılıdır.” | 허가 OR 적용 가능한 면제를 명시한 범위 보완. |

이미 있던 EN704의 “one-year validity”를 고정 1년 보장으로 복사하지 않았다. KO/ZH 및 규칙 제12조에 맞춰 “Bu kategoride ilk ARC’nin geçerliliği bir yılı aşamaz”로 썼고, 대만 거주·호적등록 국민 배우자의 첫 신청이라는 범위를 같은 문단에 유지했다.

## 최근 터키어 세 편과 도입·구조·결말 대조

실제 전문을 읽은 비교 대상은 아래 3편이다. 기존 글의 법률 또는 현재 공개 화면을 이 비교로 재인증하지 않는다.

- src/content/columns-tr/861-turkish-exporter-taiwan-unpaid-marble-invoices.md: 가상 대리석 송장 장면에서 시작, 송장 주체·대금청구·지급명령·재산으로 이동하며 오래된 송장·인도자료·최종 독촉일로 마무리한다.
- src/content/columns-tr/862-turkish-importer-taiwan-machine-defect-notice.md: 기계 인수시험 질문과 실제 검사·통지 문제로 시작, 증거·구제·기한을 따라가며 분리 부품·시험기록의 위치로 끝난다.
- src/content/columns-tr/863-turkish-professionals-taiwan-work-permit-residence.md: Türkiye 여권/e-visa의 국적별 조건으로 시작, 전문직·Gold Card·첫 ARC·가족 절차를 개괄하고 가족의 입국·거류·근무시점을 마무리한다.

새 704는 국적별 입국 개괄을 반복하지 않고 최초 신청의 두 기산점, 서류 최신성·인증, 신청 채널, 비용, 수령을 상세히 다룬다. 새 705는 대학 입학 후 무비자 전환 질문을 열고, 학위/어학 및 가족 스폰서 자격의 선택을 중심에 놓았다. 863과 취업·가족 법령이 일부 겹치지만 Türk passport 안내나 종전 결말을 재사용하지 않는다. 새 706은 카드 만료일 전에 거류 사유가 끝나는 법적 효과로 시작해 사건별 기한과 귀환 문서로 끝난다. 세 편을 하나의 틀로 이름만 바꾸지 않았다.

첫 두 문단 삭제 검사: 704 첫 문단을 빼면 입국 다음 날/통합증명 예외가, 둘째를 빼면 국내 발급 기산점과 방문자 범위가 사라진다. 705 첫 문단을 빼면 학위와 전문직의 입국 방식 차이가, 둘째를 빼면 국적·여권·담당 공관의 판단 자료가 사라진다. 706 첫 문단은 사유 소멸의 효과·조건부 계속거류, 둘째는 실제 사건일 증거를 준다. 범용 예고형 도입은 남기지 않았다.

## 문장 다양성 §5 및 실제 도구 결과

원래 공유 검사기에 세 실제 파일을 넣은 실행은 ko로 오인식했다. 그 출력은 704 FAIL 3개, 705 FAIL 1개, 706 FAIL 1개였으며 short_share=0.0 등 한국어 길이 기준을 적용했다. 이 결과를 터키어 품질 판정으로 사용하지 않았고 en으로 위장하지도 않았다. 공유 검사기 복구는 도구 담당 소유다.

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-tr/704-taiwan-arc-first-application.md src/content/columns-tr/705-taiwan-visa-residence-work-study-family.md src/content/columns-tr/706-taiwan-arc-renewal-changes-reentry.md
exit 1; three files inferred as [ko]; not a valid Turkish measurement
```

도구 담당이 제공한 격리 검사기에 --lang tr를 명시했다. 이 작성자는 검사기나 기준값을 수정하지 않았다. 첫 유효 TR 실행의 704는 top_opener_n=3으로 실패했고 위 실제 문장 수정을 거쳐 재실행했다. 705·706은 처음부터 통과했으며, 706 면제 보완 후 해당 파일을 다시 검사했다.

```text
python3 docs/audit/all-locales-parity-20261025/tooling/variety/variety_metrics.py check src/content/columns-tr/704-taiwan-arc-first-application.md src/content/columns-tr/705-taiwan-visa-residence-work-study-family.md src/content/columns-tr/706-taiwan-arc-renewal-changes-reentry.md --lang tr
```

| 원고 | sentences | mean | cv | short | run3 | opener_rep | cite_para | contrast | 독립 검수 전 exit/FAIL |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 58 | 13.2 | 0.461 | 0.241 | 0.054 | 0.053 | 0.211 | 0 | 0 / 0 |
| 705 | 71 | 13.4 | 0.585 | 0.310 | 0.014 | 0.095 | 0.286 | 1 | 0 / 0 |
| 706 | 82 | 12.0 | 0.589 | 0.341 | 0.000 | 0.087 | 0.435 | 1 | 0 / 0 |

당시 모두 “OK — no variety limit violated”. 독립 검수 전 마지막 706 재검사의 격리 metrics 파일 SHA-256은 79b3e7826fa61e56f919f966d2c5f63ad47eab5f9c1a9a0122aa53c6fd942876이었다. 언어 프로필은 새로 확장된 기계 검사라는 한계가 있으며, 이 통과가 법률 동일성이나 인간 원어민 검토를 뜻하지 않는다.

§5 수동 점검: 도입은 기한 사실/실제 입국 질문/사유 소멸 결과로 다르다. 704의 “Adres de belgelenir.”와 “Başvuru tarihini saklayın.”, 705의 “NIA’nın ikamet onayı ayrıca gerekir.”와 “Öğrencilik çalışma izni yerine geçmez.”, 706의 “Başvuru kaydını saklayın.”와 “Süre dolmadan başvurulur.”는 각기 실제 정보를 주는 짧은 문장이다. 조문 조건이 긴 문장은 AND/OR와 기산점을 보존했고 분량을 맞추려고 잘라내지 않았다. 수정 후 문단 시작을 세로로 읽어 같은 법령소개·단서 리듬이 연쇄되는지 확인했다. 인용은 법적 주체·문장 중간·문단 말미에 배치하고 표와 실무 서류 문단을 섞었다. 3편 공통 홍보 문단·긴 주소·범용 경고 결말은 없다. 706의 기존 상담 이메일은 유지하되 터키어 상담을 약속하지 않았다.

## 독립 검수 R1–R5 반영과 현재 버전 재검사

`reviews/tr-independent.md`의 필수 5건만 반영했다. 선택 제안이나 별도 법률 세부를 추가하지 않았다. 독립 보고서는 편집하지 않았으며 읽기 전·수정 후 SHA-256 모두 `6af98f2fb19f2b61ce1f7d9cff412a854234e68cf8386d838eef75e39575a376`이다. 공통 facts 해시 `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145`와 위 공식 자료를 대조했다. 아래 수정에 독립 보고서의 옛 판정을 자동 승계하지 않는다.

| 항목·문제 문장 | 이유 | 실제 수정 | 의미 보존·보완 |
|---|---|---|---|
| R1 / 706: “Yenileme veya kayıp kart işlemi sürerken … NIA’dan … talimatı alın.”만 있었음 | 접수증 비대체 설명은 정확하나 F23의 특정 온라인 신청 중 출국 효과가 빠졌다. | NIA 공식 링크와 함께 “başvuru sürerken Tayvan’dan ayrılan kişinin dosyası incelenmeye devam edilmez. Kişi yeniden giriş yaptıktan sonra rehberin ikinci bölümündeki durumlardan birine giriyorsa yeniden başvurabilir. Bu kural yalnızca söz konusu çevrim içi usule ilişkindir.” 추가. 같은 링크를 출처 목록에도 추가. | 전문인재·가족의 해당 온라인 경로만 다룬다. 심사 중단을 가능성으로 낮추지 않았고 재입국 후 자격 충족 시 재신청할 수 있다는 if + may를 유지했다. 모든 출국 금지·무조건 재신청 의무·접수증 여행 효력을 만들지 않았다. |
| R2 / 705: “Anne ve baba ile bütün yetişkin çocuklar bu hükmün aile kapsamına girmez.” | 모든 성년 자녀를 제외하는 부정으로 읽힐 수 있다. | “Anne ve baba ile bu koşulu taşımayan yetişkin çocuklar hükmün kapsamına girmez.” | 앞 문장의 장애 때문에 자립 불가능한 성년 자녀는 포함된다. 일반 전문인재 AND 대만 전문업무 OR 특정전문인재라는 초청자 범위 및 양쪽의 NIA 선행 허가는 그대로다. |
| R3 / 705: “Yabancıların çalışması için kural olarak gerekli iznin alınması gerekir.” | 통상 고용주의 신청이라는 행위 주체가 생략됐다. | “Yabancı bir profesyonelin istihdamı için çalışma izni başvurusunu kural olarak işveren yapar; kanuni istisnalar ile başvuruyu inceleyecek makam işin türüne göre değişir.” | 인재법 제5조의 원칙·직무별 담당 기관과 예외를 보존한다. 뒤의 실제 직무·고용주에 맞는 허가 OR 면제 및 제안서 비대체 설명은 유지했다. |
| R4 / 704: “geçerli Gold Card gibi ARC işlevini zaten içeren birleşik belgeler için ayrıca ARC başvurusu gerekmeyebilir.” | 법정 면제를 단순 가능성으로 낮췄다. | “Geçerli Gold Card gibi ARC işlevini içeren birleşik belge sahiplerinin ayrıca ARC başvurusu yapması gerekmez.” | 유효성 AND ARC 통합 기능을 유지하고 별도 신청 면제를 명시했다. 모든 카드·만료 문서로 확대하지 않았다. |
| R5 / 704: “Belgelerin gönderilmesi…” | 발송과 NIA 안내의 반환은 다르다. | “Belgelerin iadesi, eksiklerin tamamlanması ve görüşme için geçen süreler buna dahil değildir…” | 10근무일 계산에서 반환·보완·면담 제외, 보완 후 재기산, 발급일 비보장을 유지했다. |

복구된 공유 경로에서 아래 명령을 실제 실행했다. 세 파일 모두 `[tr]`, exit 0, FAIL 0이다. 위의 예전 KO 오분류 기록은 초기 설치본의 실행 이력이며 현재 결과가 아니다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-tr/704-taiwan-arc-first-application.md src/content/columns-tr/705-taiwan-visa-residence-work-study-family.md src/content/columns-tr/706-taiwan-arc-renewal-changes-reentry.md
```

| 현재 원고 | sentences | mean | cv | short | run3 | opener_rep | cite_para | contrast | exit/FAIL |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 59 | 12.9 | 0.464 | 0.254 | 0.053 | 0.053 | 0.211 | 0 | 0 / 0 |
| 705 | 71 | 13.6 | 0.580 | 0.310 | 0.014 | 0.143 | 0.286 | 1 | 0 / 0 |
| 706 | 85 | 12.1 | 0.580 | 0.329 | 0.000 | 0.083 | 0.417 | 1 | 0 / 0 |

§5 재점검: 새 706 문단은 기존 여행·접수증 문단 뒤에서 특정 온라인 절차의 실제 효과를 밝힌다. 첫 두 문단·소제목·실질 결말·FAQ는 그대로이며, 범용 경고나 공통 결말을 늘리지 않았다. R3의 긴 문장은 고용주·직무·예외를 보존하고 뒤의 짧은 근로권 문장과 함께 읽었다. R4는 통합증명의 예외를 독립 문장으로 분리했다. 문단 시작과 인용 위치를 다시 읽었고 새 MONOTONY 반려 패턴은 발견하지 못했다. 이 수동 점검과 기계 FAIL 0을 별도 법률·원어민 승인으로 취급하지 않는다.

```sh
/Users/son7/.nvm/versions/node/v24.14.1/bin/node docs/audit/all-locales-parity-20261025/tooling/content-audit.mjs --files 'src/content/columns-tr/70[456]-*.md' --source-locale en --publication-date 2026-10-25
```

수정 후 세 편 `AUTO_OK`, 자동 오류 0. 요구 검토 항목은 각각 6/5/6개, exit 3, `semantic=REVIEW_REQUIRED`, `publicationReady=false`다. 수치 토큰 차이는 터키어 숫자 글자 표기·천 단위 표기 및 보완 조문·출처 번호를 문맥으로 대조했다. 자동 검사가 의미 검수를 대신하지 않으므로 게시 준비 완료라고 기록하지 않는다. 각 원고의 실제 SHA는 문서 첫 표와 같다. 세 새 파일의 직접 줄 끝 공백 검사도 모두 0이었다.

## 메타데이터·링크·이미지 확인

Node v24.14.1과 gray-matter로 세 frontmatter를 실제 파싱했다. published/lastmod=2026-10-25, audience=[tr], topic=visa, author=legal-ai-assistant, FAQ 각 3개, 본문 H1 없음, Markdown/HTML 장식 bold 없음. 첫 점검의 errors는 세 편 모두 빈 배열이었다. R1–R5 수정은 본문·706 출처 목록에만 적용했고 metadata는 변경하지 않았다. 위 수정 후 content-audit에서도 자동 오류 0이었다.

EN의 공식 URL 집합은 704 9개, 705 15개, 706 13개이고 세 TR 파일 모두 누락 0이다. 704에는 KO/ZH 근거인 BOCA 국내 비자 발급 설명 URL을 추가해 총 10개다. 706에는 R1의 공식 온라인 절차 링크를 추가해 총 14개다. 세 파일의 내부 링크는 각각 이번 TR 시리즈의 나머지 두 실제 파일로 연결된다. TR에 없는 APRC·Gold Card·배우자 글의 링크를 만들어 넣지 않았다.

public/images/columns의 기존 세 *-20261024-v2.webp를 view_image로 직접 열어 주요 물체를 확인했다. 704 여행책자·서류철·빈 카드, 705 노트북·책·컵 둘·책자, 706 빈 노트·책자·카드·열쇠와 alt가 맞는다. 그림에는 식별 가능한 실명 서류나 공식 카드 복제물이 없다. 경로는 원문과 같고 caption은 “Kurgusal sahne”다. 새로운 이미지나 공개 AI 작성·검수 표기를 추가하지 않았다.

지정된 원고와 조사 문서에 대한 git diff --check는 출력 없이 exit 0이었다. 새 파일은 아직 untracked이므로 이 명령만으로 전체 신설 본문 검증을 대체하지 않았고, 직접 파싱·문체·URL·이미지 점검을 함께 수행했다. 실제 브라우저 표시, 공개 라우트·canonical/hreflang, 통합 빌드와 배포는 주 담당의 후속 확인 범위다.
