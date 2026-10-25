# MS 704–706 독립 검수

검수일: 2026-10-25 KST. 검수자: `column_inventory` AI 에이전트. MS 저자와 다른 에이전트가 원고를 읽고 대조했다. 공통 조사 자료는 공유했으므로 블라인드 검수나 독립적인 전수 법률조사라고 주장하지 않는다. 인간 원어민·변호사의 검토가 아니다.

판정: `REQUEST_CHANGES` — MS706의 재입국 후 재신청 문장 한 곳에서 가능을 의무로 읽게 하는 표현을 고치도록 요청한다. MS704·705에서는 출판을 막을 법률 조건 오류를 찾지 못했다. 아래 P3 두 항목은 비차단 문체 제안이다. 원고는 직접 수정하지 않았다.

## 검토한 파일과 해시

| 파일 | SHA-256 |
|---|---|
| `src/content/columns-ms/704-taiwan-arc-first-application.md` | `f6b3b37c9ca2eb9a3e8972998c932ee8422372f7ccdabb6382ce6269825c6945` |
| `src/content/columns-ms/705-taiwan-visa-residence-work-study-family.md` | `ed821ce519c4fe273addbc34381bcdc5b9ce7c40e0710924a6d0d042d12c877a` |
| `src/content/columns-ms/706-taiwan-arc-renewal-changes-reentry.md` | `d36f68224f0241886f23ffdad3185c107b0b89b35845b88f4790cf1b1e5cc4fe` |
| `reviews/ms-author.md` | `a0ff5f1d057c4a8fe87a79e13fa2032eb0a54d425b7c22abb6ab5446acd69eea` |
| 정정된 F04와 F23을 포함한 `research/arc-source-facts.md` | `96560a3baaac576a2e85fd3a10bad02cf8662e12286166ccb5f7d995bb3697c4` |

기준 commit은 `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`이다. 이번에 확인한 EN/KO/ZH 704–706 파일 해시는 저자기록의 현재 기준 해시와 모두 일치한다. 이전 초안의 승인 해시를 현재 파일에 대신 적용하지 않았다.

| 기준 | 704 | 705 | 706 |
|---|---|---|---|
| EN | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |

MS 세 편의 제목·요약·FAQ·본문·출처 목록 전문을 읽었다. 현재 EN을 주된 의미 비교 대상으로 삼고, KO/ZH의 배우자 카드 상한·초청가족·후속 거류·재입국 표현, 공통 사실표 F01–F23 및 앞선 source-refresh를 교차 대조했다. AGENTS·BRIEF·저장소 문체 규칙·공유 문장 다양성 규칙과 LESSONS는 같은 세션에서 읽은 규칙을 적용했다.

## 수정 요청 및 문체 제안

| 심각도·위치 | 실제 문장 | 문제와 근거 | 제안 | 의미 보존 |
|---|---|---|---|---|
| P2 / MS706 `Perjalanan ketika kad baharu masih diproses`, 현재 87행 | “Selepas kembali, pemohon perlu memenuhi syarat dan mengemukakan permohonan baharu.” | `perlu … mengemukakan`은 재입국 후 새 신청을 해야 한다고 읽힌다. [NIA 전문인재·가족 온라인 절차 주의 9](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)는 출국 시 기존 심사를 더 진행하지 않는다는 효과와, 다시 입국해 대상 요건을 갖춘 사람이 재신청할 수 있다는 권한을 구분한다. F23의 후자는 `may + if`다. | “Selepas kembali, pemohon boleh mengemukakan permohonan baharu jika memenuhi syarat prosedur itu.” | 앞 문장의 심사 중단 효과와 이 절차에 한정된 범위는 그대로 둔다. 재입국하면 누구나 자동 접수되거나 누구에게나 새 신청 의무가 생긴다는 뜻을 피한다. |
| P3 / MS705 FAQ 2 및 어학 본문, 현재 21·52행 | “pusat bahasa bersekutu dengan universiti yang diiktiraf” | `bersekutu`는 제휴·연합을 먼저 연상시키고 교육기관의 부설 관계를 표현하는 말로는 덜 자연스럽다. 현재 문장이 적격 기관이라는 조건을 없앴다고 판단하지는 않지만, 소속 관계를 선명하게 할 수 있다. | “pusat bahasa Mandarin yang bernaung di bawah universiti yang diiktiraf oleh Kementerian Pendidikan Taiwan” | 4개월 이수·최소 3개월 추가 등록·시간·출석 조건을 그대로 둔다. 기관의 소재국이나 독자의 국적을 새로 가정하지 않는다. [BOCA의 해당 기관 요건](https://www.boca.gov.tw/fp-166-285-041cb-2.html)에 맞춘 명료화다. |
| P3 / MS706 실질 마지막 문단, 현재 91행 | “Bagi perjalanan yang bakal tiba, perkara yang perlu dipastikan ialah sama ada dokumen yang akan dibawa masih meliputi tarikh kembali ke Taiwan.” | `perjalanan yang bakal tiba`는 여행이 도착한다는 결합으로 읽혀, 다가오는 여행이라는 뜻이 번역투다. 법적 조건의 오류는 아니다. | “Untuk perjalanan yang akan datang, pastikan dokumen yang akan dibawa masih sah pada tarikh anda kembali ke Taiwan.” | 실제 가지고 갈 서류와 귀환 예정일의 유효성을 연결한다. 새 보장·기한·허가를 추가하지 않는다. 기존 문장의 구조만 최소한 바꾸려면 `Bagi perjalanan yang akan datang`으로 교체해도 된다. |

P2가 수정되면 해당 문장, 원고 해시와 §5 검사를 다시 확인해야 한다. P3 제안 때문에 법률적 의미를 임의로 줄이거나 지표를 맞출 필요는 없다.

검토했지만 오류로 올리지 않은 표현도 기록한다. MS705 본인 경로의 `yang menjalankan kerja profesional di Taiwan dengan permit atau pengecualian …`는 공식 영문 제16조 제1항도 전문업무 종사를 서술하고 있어, 그 구절 자체를 잘못된 추가 조건이라고 단정하지 않았다. 가족 경로인 제2항과 수식 범위를 혼동하지 않고 따로 검토했다.

## F01–F23 조건 대조

| 항목 | 현재 원고의 대응과 판정 |
|---|---|
| F01 | 704 첫 문장과 FAQ가 거류비자 입국 및 거류 허가, `mesti`, 입국 다음 날부터 30일을 함께 보존한다. 같은 첫 문단에 유효 통합증명 예외가 있다. 무비자 모두의 전환 기한으로 확대하지 않는다. |
| F02 | 704 두 번째 문단·표·FAQ가 대만 안에서 받은 거류비자의 발급일부터 30일이라고 구분한다. ‘다음 날’이 이 경로로 옮겨가지 않았다. |
| F03 | 704·705가 전문인재 범주, permit OR 적용 면제, 무비자/방문비자 입국, NIA 승인 후 ARC를 유지한다. 제안서 자체를 허가로 쓰지 않고 이주노동자 경로를 분리한다. |
| F04 | 705 가족 문장: `profesional asing yang menjalankan kerja profesional di Taiwan, atau profesional asing berkepakaran khusus, telah mendapat kebenaran kediaman atau kediaman tetap`. 이는 `[(일반 전문인재 AND 대만 전문업무) OR 특정전문인재] AND (거류 OR 영주 허가)`를 유지한다. 일반 전문업무 수식어를 특정전문인재에 일률 적용하지 않는다. 배우자·미성년 자녀·장애로 자력생활이 불가능한 성년 자녀, 부모·그 밖의 성년 자녀 제외, 가족의 적격 입국 조건을 모두 남겼다. |
| F05 | 705에서 대만 거주 AND 호적 등록 배우자, 유효 비자의 60일 이상 체류허용, 연장불허 등 제한 부재가 유지된다. 혼인증서만으로 무비자 전환을 보장하지 않는다. FAQ도 일부 초청자 제외를 유지한다. |
| F06 | 704가 일반 신청의 사진 2년, 여권/비자 원본·사본, 최근 재직/재학 증명, 관계·초청자 및 실제 주소 자료를 서술한다. 비자용 6개월 사진과 혼동하지 않는다. 주소 자료 예시의 NIA 근거도 확인했다. |
| F07 | 해외 문서 인증은 NIA가 요구하는 것으로, 중국어 번역은 요구할 수 있는 것으로 구분한다. 모든 첫 신청에 범죄·건강 증명이 필요하다고 단정하지 않는다. 국적별 공증·아포스티유 방식을 만들어내지 않았다. |
| F08 | 704의 `paling lama setahun`과 적용 대상을 직접 확인했다. 최초 신청·대만 거주·호적등록 국민의 배우자라는 범위가 있고 배우자 동행·혼인등록 증명이 남아 있다. EN의 통상 1년 표현을 고정 보장으로 재생산하지 않았다. |
| F09 | NT$1,000/년, 1년 미만 계산, 해당 입국 경로의 NT$2,200 가산, 僑生에 한정한 50% 감면, 706 교체 NT$500을 보존한다. 말레이시아 링깃으로 바꾸지 않았다. |
| F10 | 704의 일반 최장 3년, 고용된 특정전문인재 최장 5년·허가 다음 날 및 규정상 가족, 금카드 1–3년을 구분한다. 수수료로 기간을 선택할 수 있다고 쓰지 않는다. |
| F11 | 704 학생 절차에서 `lima hari bekerja dari kelulusan`, `tiga hari bekerja selepas bayaran selesai`를 확인했다. 승인·납부 기산점과 5·3 근무일이 바뀌지 않았다. 전자 ARC는 6개월 이하이고 납부 후 내려받는다. 다른 신청자 전체에 일반화하지 않는다. |
| F12 | 704 일반 10근무일과 학생 5근무일, 보완 후 재기산을 분리한다. 일반 반환·보완·면담 기간 제외를 유지하고 발급 보장일이라고 쓰지 않는다. |
| F13 | 705 해외 정규유학 비자와 적격 유학 목적 방문비자 경로를 구분한다. 어학 목적·인정된 대학 연계 기관·4개월 이수 AND 최소 3개월 추가 등록·월–금 주 15시간·휴가 포함 결석 1/4 이하를 보존한다. 기관 관계 용어의 P3 제안은 위 표에 별도로 적었다. |
| F14 | 704 FAQ와 705·706 본문이 실제 업무·고용주의 허가 OR 면제를 유지한다. 대만 호적 국민과 혼인하고 거류 허가를 받은 배우자의 제48조 면제와, 특정·고급 전문인재 배우자의 제15조 신청을 구분한다. |
| F15 | 706 표와 FAQ가 만료 전 3개월과 변경 다음 날부터 30일을 구분한다. 변경등록 자체가 새 직무 허가가 아니라는 설명이 있다. |
| F16 | 706 표·본문의 제23-1조 해당 경우 30일은 사건 당일부터, 다른 사유변경 15일은 BOCA 또는 지소 후 NIA로 서술된다. 두 기한을 선택지로 제공하지 않는다. |
| F17 | 일반 3개월, 사업을 계속하는 적격 창업가 4개월, 사업 중단 후 별도 3개월, 금카드 자체 갱신 4개월을 구분한다. |
| F18 | 706 도입의 NIA 취소 의무는 법정 계속거류 예외를 동반한다. 본문의 사망·가정폭력·자녀·진행 중 노동분쟁·산재 예시는 각 조건이 다르고 모든 이혼/분쟁에 자동 권리가 없다고 명시한다. |
| F19 | 706이 초과거류 30일 ‘미만’, 원래 사유 존속, 처벌 후 재신청을 함께 유지한다. 영주 산정 1년 공제를 서술하고 원만료일 유지·자동 연장 아님도 남아 있다. |
| F20 | 706 전문인재는 만료 전 신청, 승인 시 만료 다음 날부터 6개월, 추가 1회·총 1년이다. 졸업생의 별도 1년·추가 1회·총 2년과 어학과정의 차이를 구분한다. 기존 근로권의 자동 연장이 아니라고 명시한다. |
| F21 | 새 글에서 졸업생 취업면제를 별도 설명하지 않는다. 그렇다고 졸업 후 연장기간에 누구도 일할 수 없다고 쓰지 않으며, F14의 적용 permit/면제 원칙을 유지한다. EN에 없던 별도 졸업생 설명을 무조건 추가할 의무로 판정하지 않았다. 연결된 기존 MS807은 요건을 갖춘 졸업생 면제를 별도로 다룬다. |
| F22 | 706이 출국 전 재입국허가, ARC 기간과 취소 연동, 영주거류 법정 예외를 명시한다. APRC 절차를 본문 범위와 구분하며 접수증·카드 사진의 탑승·입국 보장을 하지 않는다. 여권/귀환일 조건도 있다. |
| F23 | 706의 특정 온라인 절차에서 출국하면 심사를 더 진행하지 않는다는 필수 효과와 범위는 정확하다. 뒤 문장의 재신청 가능을 의무처럼 서술하는 부분만 P2 수정 요청이다. 모든 ARC 신청에서 출국을 금지한다고 확대하지 않는다. |

## FAQ·국적·용어·링크

9개 FAQ를 본문과 직접 대조했다. 704의 두 기산점·수수료·근로 범위, 705의 직접신청·어학·가족 범위, 706의 갱신 창구·변경등록·접수증 한계가 본문보다 넓게 약속되지 않는다. 학생 FAQ의 기관 용어는 본문과 함께 P3 교정할 수 있다.

언어를 국적으로 치환하지 않았다. 현재 704–706 제목·서술은 말레이시아 시민 전체를 전제하지 않으며, 705는 시민권과 사용 여권에 따른 자격을 명시한다. Working Holiday와 nomad는 국적·자격별 조건으로 남아 있다. 기존 MS807 링크의 slug에 `malaysian`이 있지만 새 글의 보편적 신청 자격을 말레이시아 여권 기준으로 바꾸지는 않는다. 대만 법·기관·NT$ 및 중국대륙/홍콩/마카오/무호적 ROC 국민 별도 체계가 보존된다.

`pasport`, `yuran`, `majikan`, `pejabat`, `permohonan`, `baharu`, `temu duga`, `e-mel` 등은 말레이어 설명체에 맞는다. 인도네시아어 전용으로 읽힐 `paspor`, `biaya`, `kantor`, `karyawan`, `izin`, `silakan`의 혼용을 발견하지 않았다. 공통 어휘가 두 언어에 존재한다는 이유만으로 혼용이라고 판정하지 않았다. `kediaman`·`kebenaran menetap`은 이 글의 ARC 문맥에서 의미가 이어진다. 원어민의 선호까지 보장하는 평가는 아니다.

EN 공식 URL 집합의 누락은 기계 대조상 0이다. 새 공식 링크는 704의 거류 규칙, 706의 해외 분실 및 특정 온라인 절차이며, 아래 직접 읽기 범위로 확인했다. 다른 언어로 가는 내부 링크 4개는 모두 실제 EN 원고이며 `dalam bahasa Inggeris`를 붙였다. 이 링크를 MS 완성 칼럼 수로 세지 않는다. 같은 언어 내부 링크도 실재 파일로 확인됐다.

`published`/`lastmod`는 2026-10-25, 법률 자료 확인일은 원문대로 2026-10-24다. 이미지 경로·`Adegan rekaan` 캡션·내부 author 토큰을 유지한다. MS706 연락 문단은 EN/中文/JA/KO만 명시하며 말레이어 상담을 약속하지 않는다. 공개 작성자 유출 여부는 실제 렌더링 단계에서 별도로 확인해야 한다.

## 문체 규칙 §5 재검수

1. 요구된 공유 경로 명령을 직접 실행했다. 현재는 `[ms]`로 올바르게 라우팅되며 세 편 모두 FAIL 0, exit 0이다. 저자기록의 과거 `[ko]` 오분류는 당시 이력이고, 이번 결과와 혼동하지 않는다. 격리 경로도 같은 값이다.
2. 704는 특정 30일 의무·기산점, 705는 어학 입국 목적의 조건, 706은 일자리가 끝났지만 카드 기간이 남은 질문으로 시작한다. 가상의 인물이나 예고형 도입을 반복하지 않는다.
3. 최소 두 개의 의미 있는 단문이 각 글에 있다. 예: 704 `Dokumen asal dipulangkan selepas diperiksa.` / `Perjanjian sewa boleh membuktikan alamat.`; 705 `Ibu bapa tidak termasuk.` / `ARC dikeluarkan setelah NIA meluluskan kediaman.`; 706 `Permohonan dibuat sebelum luput.` / `Tarikh luput asal kekal.` 법정 긴 조건을 점수 때문에 지우지 않았다.
4. 첫 단어를 수직으로 대조했고 문단 시작 최대 반복은 2회다. 새 도구의 opener 결과와 일치한다.
5. 세 문단 연속 ‘주장–조문–다만’ 구성을 발견하지 않았다. 704 제출자료 보관, 705 두 신청방식 설명, 706 서로 다른 사건 날짜 문단에 인용 없는 실무 설명이 있다.
6. 대비표현 자동 0만으로 판정하지 않았다. permit/ARC/접수증의 부정 설명은 실제 법적 구분이다. 독자가 하지 않은 주장을 반복 반박하는 틀을 발견하지 않았다.
7. 끝문단은 각 글의 다음 신고 날짜·신청범주와 입국방식·귀환일을 포괄하는 서류로 끝난다. 706의 `bakal tiba`는 P3 어휘 제안이다. 필수 출처일·관할 꼬리는 실질 결말과 구분했다.
8. 말레이어 설명체, 장식 굵은 강조 없음, 본문 H1 없음, 허위 1인칭·인용 없음, 명령형 체크리스트 제목 없음. 법적 문장의 `mesti`/`boleh`는 별도 의미검토했고 F23 한 곳을 요청사항으로 올렸다.
9. 숫자·조문·기산점·예외·URL·허구 이미지 표기를 대조했다. F04의 OR 범위와 F08의 최대 1년을 특히 확인했다. 전체 수치 일치는 의미 보존의 대체물이 아니다.

이 검토에서 반려 사유로 삼을 단조로움(MONOTONY) 패턴은 발견하지 못했다. 실제 어색한 문장은 위 P3 표에 원문과 방향을 명시했다.

최근 MS807–809의 도입·제목·결말도 대조했다. 807의 `ARC … bukan hak bekerja` 대비, 808의 임대차 서명 주체 질문과 Penang 가상 사업자, 809의 Kuala Lumpur 귀국 항공편·사고 가상 장면을 반복하지 않는다. 807·808의 `Sebelum … semak/pastikan` 결말을 배치 전체에 다시 붙이지 않았다. 새 첫 두 문단을 없애면 704의 기산점/통합증명 예외, 705의 어학과 전문직 입국방식 차이/국적·여권 조건, 706의 사유소멸과 카드 만료의 차이가 사라진다.

## 실행 증거

```bash
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-ms/704-taiwan-arc-first-application.md src/content/columns-ms/705-taiwan-visa-residence-work-study-family.md src/content/columns-ms/706-taiwan-arc-renewal-changes-reentry.md
```

| MS 파일 | 문장 | 평균 | CV | 짧은 문장 비율 | 비슷한 길이 연속 | 시작어 반복 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---|
| 704 | 65 | 14.5 | .451 | .185 | .000 | .095 | FAIL 0 |
| 705 | 69 | 15.3 | .588 | .217 | .030 | .050 | FAIL 0 |
| 706 | 88 | 13.6 | .460 | .193 | .023 | .080 | FAIL 0 |

실행 당시 공유·격리 `variety_metrics.py` SHA는 `79b3e7826fa61e56f919f966d2c5f63ad47eab5f9c1a9a0122aa53c6fd942876`, 확장 모듈은 `955835ac6f8cd4cfb25e22e3efc8e59679c031788a86da77c8dd84323017b00e`, MS profile은 `88abb26243707cd9601ad80695494c1f951077a0d0f49a681d3ae639c9f60d00`이다. 검수자는 도구·profile·임계값을 바꾸지 않았다.

`content-audit.mjs --files 'src/content/columns-ms/70[456]-*.md' --source-locale en --publication-date 2026-10-25`는 자동오류 0, 의미검토 7/7/8항목, exit 3과 `publicationReady=false`를 반환했다. 자동검사만으로 의미검토를 승인 처리하지 않았다. 현재 정책상 세 파일 모두 `audience: [ms]`이며 현지 목록에 표시된다.

숫자 대조의 차이는 문맥으로 읽었다. 704의 `22` 1회 감소는 중복 인용 횟수 차이이며 조문이나 예외가 사라진 것이 아니다. `30` 추가는 숫자 표기 및 기산 설명 반복, `12`는 최대 1년 근거 추가, `50`은 僑生 감면율, `9`는 금카드 기간의 조문이다. 705는 숫자 토큰 차이가 없다. 706의 추가 `30`은 여권 변경에 주소의 30일을 일괄 적용하지 말라는 문맥이다. 글자로 쓴 기간·금액 조건도 별도로 확인했다.

## 직접 출처 읽기와 한계

이번 MS 검수에서 [인재법 현행 영문 제16·17조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), [NIA0902 영문](https://www.immigration.gov.tw/5475/5478/141465/141808/141970)과 [중문](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/), [NIA0929의 납부·수령·심사 조항](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news), [BOCA 어학 기관·기간·출석 조항](https://www.boca.gov.tw/fp-166-285-041cb-2.html), [해외 분실 안내](https://www.immigration.gov.tw/5385/7229/7232/368785/), [특정 온라인 절차 주의 9](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)를 직접 열어 관련 본문을 읽었다. 같은 세션의 앞선 작업에서 거류 규칙 제12·20조도 직접 확인했다. 나머지 세부 사항은 명시한 현재 원고·facts/source-refresh와 대조했으며, 모든 공식 URL을 다시 열었다고 주장하지 않는다.

MOJ의 자료 정비 기준일은 2026-10-16으로 표시된다. 이후 관보를 전수 조사한 검수가 아니다. 법률 확인일·게시일·기관 페이지 수정일은 혼합하지 않았다. 새 공식 세부사항을 모든 번역에 추가해야 한다고 요구하지 않았고, MS 원고가 실제로 서술한 조건의 정확성과 기존 내용의 실용 범위를 평가했다.

이번 검수는 명시된 파일 해시의 텍스트 검수다. 이미지 실물·반응형 화면·FAQ JSON-LD·byline 비노출·canonical/hreflang·공개 배포 commit은 실행/확인하지 않았다. P2 수정과 해당 해시 재확인, 통합 빌드 및 실제 전달 검증 후 조정자가 게시 여부를 결정해야 한다. 원고·공유 도구·배포 설정을 변경하거나 commit/push/deploy하지 않았다.
