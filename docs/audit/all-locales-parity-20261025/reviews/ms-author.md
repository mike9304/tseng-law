# MS 704–706 저자 검수 기록

작성·자체 재독: 2026-10-25 KST. 담당: `column_existing_drafts` AI 작성 에이전트. 대상 언어는 말레이시아 표준 말레이어(`ms`)이며, 독자의 국적을 말레이시아로 단정하지 않았다. 인간 원어민·변호사·독립 검수자의 승인을 주장하지 않는다.

후속 수정이 있다. 최신 MS706 해시와 복구된 공유 검사기의 최종 결과는 이 문서 끝의 「독립검수 요청 반영」 절에 기록했다. 앞부분의 해시·공유 미지원 결과는 초회 인계 이력으로 보존한다.

저자 작업 범위는 MS 본문 3편과 이 기록이다. 원고 작성 및 아래 범위의 검사는 마쳤다. 독립 의미·언어 검수, 통합 빌드, 배포와 실제 공개 페이지 확인은 이 기록의 완료 범위에 포함하지 않는다. commit/push/배포는 하지 않았다.

## 기준과 읽은 자료

- 기준 HEAD: `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8`, 작업 트리 `/Users/son7/Projects/tseng-law-all-locales-20261025`.
- 작업 BRIEF, 저장소 AGENTS, `docs/columns/EDITORIAL-VOICE.md`, `docs/columns/FRONTMATTER.md`, `/Users/son7/tseng-col-0930-work/COLUMN-VOICE-RULE.md`, 공유 `SENTENCE-VARIETY-RULE.md`와 `LESSONS.md` 전문을 읽었다. 홈의 `agent-library/knowledge/editorial-voice.md`는 현재 존재하지 않아 저장소 및 공유 규칙 사본을 적용했다. 폐기된 Fable 게이트는 적용하지 않았다.
- 현재 EN/KO/ZH 704–706 전문, `docs/audit/arc-visas-20261024/BRIEF.md`, 10월 24일 `source-refresh.md`와 `reviews/final-core.md`, 이번 배치 `research/arc-source-facts.md` F01–F22를 읽었다. 보류·반려 초안을 번역 기준으로 쓰지 않았다.
- 같은 언어 최근 3편인 807 `malaysian-student-taiwan-part-time-work-permit`, 808 `malaysian-brand-taiwan-subsidiary-branch-first-shop`, 809 `malaysian-rider-taiwan-scooter-accident-licence-insurance` 전문을 읽었다.

주된 문단·FAQ 보존 기준은 현재 EN이고, KO/ZH 및 공식 법령으로 법률 조건을 교차 확인했다. EN704의 첫 배우자 카드 고정 1년 표현은 그대로 옮기지 않고, 거류 규칙 제12조와 KO/ZH에 맞춰 최장 1년으로 명확히 했다.

| 기준 파일 | SHA-256 |
|---|---|
| EN704 | `610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f` |
| EN705 | `87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304` |
| EN706 | `1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71` |
| KO704 | `cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1` |
| KO705 | `727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a` |
| KO706 | `4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc` |
| ZH704 | `0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468` |
| ZH705 | `290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3` |
| ZH706 | `4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c` |
| 10월 24일 source-refresh | `a33d5bd1439879bc7461755c3b6793f4942ec161454032dcb8cde1c4d52a6983` |
| 10월 24일 final-core | `6581de82c5d839e1777bf7d12643c9d9bcac15b81d22b917067eef5bac193fac` |
| 이번 배치 arc-source-facts | `a1259bbb8e33850c300040dcc190bd61d33e469d2aad3b2b95fbedd47066bf5d` |

## 실제 문장 검수와 적용

| 위치·수정 전 문장 | 문제와 이유 | 실제 적용 | 의미 보존·변경 |
|---|---|---|---|
| 704 해외 문서 문단: “Bahasa Melayu yang digunakan dalam permohonan pertanyaan tidak menentukan kewarganegaraan pemohon atau pejabat yang berbidang kuasa.” | 독자의 실제 인증 절차에 도움이 적고, 작성 지침을 공개 글에 노출한 어색한 설명이다. `permohonan pertanyaan`도 자연스럽지 않다. | 문장을 삭제하고 문서 발급 장소를 담당하는 대만 공관 링크에서 문단을 끝냈다. | 국적을 추정하지 않는 작성 원칙은 유지했다. 문서 인증 의무·중국어 번역 요구 가능성과 관할 공관은 모두 남아 있다. |
| 704 첫 배우자 카드: “NIA menetapkan kad pertama bagi kategori ini selama setahun dalam …” | 고정 1년을 보장하는 표현으로 읽힌다. 조정자의 RU 교차확인과 거류 규칙 제12조를 대조했다. | “Tempoh sah kad pertama bagi kategori ini ialah paling lama setahun, menurut …”로 고치고 제12조 직접 링크를 추가했다. 뒤의 요약도 `had paling lama setahun`으로 맞췄다. | 실질적 정확성 보완. 대만 거주 AND 호적등록 국민의 배우자, 최초 신청이라는 범위와 동행·혼인등록 증명은 유지했다. |
| 705 방문·거류 문단: “Yang lain perlu mendapatkan visa yang sesuai sebelum tiba.” | 앞 문장 다음에 놓이면 직접 NIA 신청자 외에는 모두 해외에서 비자를 받아야 한다는 전칭으로 읽힌다. 국내 BOCA 비자 발급 가능성을 지우면 안 된다. | “Sesetengah permohonan pula memerlukan visa yang sesuai sebelum ketibaan.” | 일부 신청에 필요한 입국 전 비자만 설명하도록 좁혔다. 방문에서 거류로의 일반 전환권은 없다는 설명을 유지했다. |
| 705 소제목: “Pekerjaan profesional: permit sebelum mula bertugas” | 제목만 보면 법정 permit 면제가 드러나지 않는다. | “Pengambilan profesional asing dan kebenaran bekerja” | 일반 고용주 신청과 면제, 직종별 권한을 그대로 설명한다. |
| 705 제16조: “Setelah profesional asing atau profesional asing berkepakaran khusus mendapat permit yang diperlukan, atau layak mendapat pengecualian, perkara 16 membolehkan …” | 현재 법문의 대만 내 전문업무 종사 조건을 더 명시할 필요가 있었다. | “Profesional asing atau profesional asing berkepakaran khusus yang menjalankan kerja profesional di Taiwan dengan permit atau pengecualian yang berkenaan boleh memohon kediaman terus di bawah perkara 16 selepas masuk tanpa visa atau dengan visa lawatan.” | 대상·전문업무·허가 OR 면제·입국방식을 함께 명시했다. 이어지는 NIA 거류 승인 후 ARC 발급을 보존했다. 가족 문단에서는 일반 전문인재 종사 OR 특정전문인재와 선행 거류 OR 영주 허가를 별도로 유지했다. |
| 705 끝문단: “Sebelum menetapkan tarikh mula kerja atau pengajian, pasport, visa yang dirancang dan dokumen sokongan perlu menunjukkan laluan yang benar-benar boleh digunakan.” | MONOTONY: 807·808의 `Sebelum … semak/pastikan` 결말을 다시 따르는 구조이며, `benar-benar`는 정확한 조건을 더하지 않는다. | “Dokumen sokongan menunjukkan kategori yang boleh dipohon. Cara masuk pula menentukan sama ada permohonan itu boleh diteruskan selepas ketibaan.” | 신청 범주와 입국방식의 관계로 구체화했다. 새 의무나 전환권을 추가하지 않았다. |
| 706 온라인 출국 문단: “kelayakan dan permohonan perlu dibuat semula selepas kembali.” | 자격을 다시 ‘만든다’는 병렬은 번역투다. 신청 종료와 귀국 후 자격 확인·재신청의 관계도 흐려진다. | “Selepas kembali, pemohon perlu memenuhi syarat dan mengemukakan permohonan baharu.” | 해당 전문인재 온라인 절차에 한정한 재신청 설명과 모든 신청자의 출국 금지가 아니라는 범위를 유지했다. |
| 706 초과거류: “jika lebihan tinggal kurang daripada 30 hari” | `lebihan tinggal`은 자연스러운 행위를 나타내지 못하는 명사 직역이다. | “jika pemohon tinggal melebihi tempoh yang dibenarkan selama kurang daripada 30 hari” | 허용기간을 초과해 머문 주체와 기간을 명시했다. 30일 미만·기존 사유 존속·처벌 후 재신청 조건은 그대로다. |
| 706 졸업생 문단: “Mereka yang memenuhi syarat perlu memohon sebelum tempoh kediaman tamat. Jika diluluskan, lanjutan pertama ialah setahun mulai hari selepas tempoh asal tamat; jika perlu, satu lanjutan lagi boleh dipohon sehingga jumlah maksimum dua tahun.” | MONOTONY: 신청·승인·기간·추가 연장을 한 문단에서 비슷한 리듬으로 이어가고, 총상한을 긴 후반절에 묻었다. 정확성 보완 뒤 CV .447 FAIL도 발생했다. | 신청과 승인을 한 절차로 연결하고, “Satu lanjutan lagi boleh dipohon jika perlu. Jumlahnya paling lama dua tahun.”로 추가 횟수·총상한을 분리했다. | 적격 졸업생, 만료 전 신청, 승인 조건, 종전 만료 다음 날부터 1년, 추가 1회, 총 2년 모두 유지했다. 어학과정과의 구분도 남았다. 기준·검사기를 고치거나 무의미한 단문을 넣지 않았다. |

용어는 `pasport`, `yuran`, `majikan`, `pejabat`, `kebenaran`, `permohonan`, `baharu`, `e-mel`, `temu duga`를 사용했다. 인도네시아어식 `paspor`, `biaya`, `kantor`, `karyawan`, `izin`, `silakan`을 사용하지 않았다. 대만의 기관·법률·NT$를 말레이시아 제도로 치환하지 않았다. 이 용어 검토가 원어민의 독립 언어 승인에 해당하지는 않는다.

## 최근 MS 3편과 도입·제목·결말 비교

| 비교 대상의 실제 표현·구조 | 이번 3편에서 선택한 구성 |
|---|---|
| 807 첫 문장: “Kad kediaman (ARC) seorang pelajar membuktikan hak tinggal di Taiwan, bukan hak bekerja.” 대비형 사실 도입. 끝: “Sebelum syif pertama, semak tarikh mula dan tarikh tamat yang tercetak pada permit.” | 704는 실제 30일 의무와 기산점으로 시작한다. 705는 중국어 학습 목적 비자라는 특정 신청 조건으로 시작하고, 706은 일이 끝났는데 카드 기간이 남은 경우의 질문으로 시작한다. 모두 `ARC ialah … bukan …` 공식을 복제하지 않았다. |
| 808은 임대차 서명 주체를 묻고 가상의 Penang 사업자로 이어진다. 끝은 `Sebelum menandatangani sewa, pastikan …` 구조다. | 새 가상 인물·도시·회사·국적을 만들지 않았다. 704 제목은 날짜·서류·수령, 705는 취업·학업·가족, 706은 갱신·변경·여행의 실제 대상을 담는다. `Sebelum … pastikan` 결말 반복은 705에서 제거했다. |
| 809는 출국 일정이 잡힌 가상의 말레이시아 학생 사고 장면과 연속 질문으로 시작한다. 마지막에는 상담 정보가 놓인다. | 706의 질문은 법적 상태 하나만 묻고 즉시 제31조와 연결한다. 704는 다음 신고를 정하는 카드·이사·고용 날짜, 705는 서류와 입국방식, 706은 귀국일을 포괄하는 실제 서류로 본문을 끝낸다. 상담 안내는 706 중간의 짧은 이메일 문단에만 있다. |

첫 두 문단 삭제 시험도 했다. 704에서는 두 가지 30일 기산점의 구분, 705에서는 어학 입국 제한과 전문직 직접 신청의 차이, 706에서는 인쇄 만료일과 거류 사유 소멸의 차이가 빠진다. 모두 곧바로 독자에게 필요한 조건을 다룬다. 일괄 예고형 도입은 없다.

## 법률·FAQ·출처 대조

- 704: 입국 다음 날부터 30일과 국내 비자 발급일부터 30일을 구분했다. 통합증명 예외, 직무 permit 또는 면제, 사진 2년·재직/재학 자료 1개월, 해외 문서 인증 의무와 중국어 번역 요구 가능성을 보존했다. 일반 최장 3년, 최초 대만인 배우자 최장 1년, 고용된 특정전문인재 최장 5년·허가 다음 날, 금카드 1–3년을 구분했다. NT$1,000/년·1년 미만 계산·NT$2,200 추가·僑生 감면의 특정 신분 범위를 지켰다. 학생 심사 5근무일·보완 후 재기산, 승인일부터 납부 5근무일·납부 후 수령 3근무일, 6개월 이하 전자 ARC를 다른 신청자에게 일반화하지 않았다.
- 705: 2026-01-01 시행일, 고용주 신청·면제, NIA0915의 제외 입국방식과 다른 규정상 예외를 유지했다. 정규학생의 특정 방문비자 목적과 해외 공관 경로, 어학 4개월 이수 AND 최소 3개월 추가 등록·월–금 주 15시간·휴가 포함 결석 1/4 이하를 보존했다. 가족은 초청자 신분·대만 전문업무·선행 거류/영주 허가와 배우자·미성년자·자력생활 불가 장애 성년 자녀라는 범위를 유지했다. 대만인 배우자 60일 이상 유효 비자·제한 부재, 제48조 취업 면제와 특정/고급 전문인재 배우자의 제15조 신청을 구분했다. nomad가 대만 사업자·고용주에게 서비스를 제공하는 일반 근로권으로 바뀌지 않았다.
- 706: 일반 갱신 3개월, 사업 계속 창업가 및 금카드 자체 갱신 4개월, 창업 중단 후 별도 경로 3개월을 구분했다. 주소/근무처는 변경 다음 날부터 30일, 제23-1조 사유 변경은 발생일부터 30일, 그 밖은 15일 BOCA 후 NIA다. 거류 사유 소멸 시 원칙과 조건부 예외, 전문인재 6개월+1회 총 1년, 졸업생 1년+1회 총 2년, 어학 연장 최장 6개월·체류/거류 원칙상 2년을 유지했다. 30일 미만 초과거류+원래 사유 존속+처벌 후 재신청 및 영주 산정 1년 공제는 무불이익 유예가 아니다. 여권 변경에 보편적 30일을 만들지 않았고, 분실 증거 선택지·NT$500·교체와 연장의 차이를 보존했다. 출국 전 재입국허가·APRC 예외·ARC 만료/말소와의 연결을 유지했다.
- FAQ 3개씩 총 9개는 본문보다 넓게 단정하지 않도록 다시 읽었다. 제목·요약·날짜 표시·읽기 시간·이미지 alt·캡션·출처 설명도 MS로 작성했다. 법률 출처 확인 기준일은 원문대로 2026-10-24이며 게시/수정일은 요청대로 2026-10-25다.
- 모든 EN 본문의 공식 URL 집합을 프로그램으로 대조해 누락 0개를 확인했다. MS704에는 제12조 원문 링크를 추가했다. 원고 끝 공식 출처 목록과 관련 주장 옆 링크를 함께 유지했다. 같은 주제의 MS 704–706과 실제 MS807은 같은 언어 링크다. 배우자·Gold Card·APRC 보충 글은 MS에 해당 slug가 없어서 존재하는 EN 링크를 `dalam bahasa Inggeris`로 표시했다.

이번 저자 작업에서 새로 직접 연 공식 자료는 [인재법 영문 현행문](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030295), [NIA0902](https://www.immigration.gov.tw/5475/5478/141465/141808/141970), [NIA0929](https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news), [BOCA 어학 거류](https://www.boca.gov.tw/fp-166-285-041cb-2.html), [거류 규칙 영문 제12조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080129)다. 제31조 단독 페이지의 최초 호출은 시간 초과였고 이후 이민법 전문 호출은 반환됐다. 전체 공식 링크를 이번 세션에서 모두 재열람했다고 주장하지 않는다. 나머지 세부 공지는 위 동결 원고·source-refresh·공통 facts의 확인 기록에 의존한다.

## 문장 다양성 명령의 실제 결과

공유 설치본에 요구된 명령을 최종 3편으로 실행했다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-ms/704-taiwan-arc-first-application.md src/content/columns-ms/705-taiwan-visa-residence-work-study-family.md src/content/columns-ms/706-taiwan-arc-renewal-changes-reentry.md
```

exit 1. 파일을 `[ko]`로 잘못 추론했다. 704는 CV .427/short .0으로 FAIL 2, 705는 short .0으로 FAIL 1, 706도 short .0으로 FAIL 1이었다. 명시 `--lang ms` 실행은 `KeyError: 'ms'`로 종료됐다. 이 결과는 MS의 적합한 측정이 아니며, 통과로 바꾸거나 `--lang en`으로 위장 실행하지 않았다.

별도 도구 담당자가 제공한 격리 설치본을 MS 프로필로 실행했다. 작성자는 검사기·문장 분리·임계값을 수정하지 않았다.

```sh
python3 docs/audit/all-locales-parity-20261025/tooling/variety/variety_metrics.py check src/content/columns-ms/704-taiwan-arc-first-application.md src/content/columns-ms/705-taiwan-visa-residence-work-study-family.md src/content/columns-ms/706-taiwan-arc-renewal-changes-reentry.md --lang ms
```

최종 exit 0, FAIL 0. 검사기 SHA-256: `79b3e7826fa61e56f919f966d2c5f63ad47eab5f9c1a9a0122aa53c6fd942876`.

| 파일 | 문장 | 평균 길이 | CV | 짧은 문장 비율 | 같은 길이 3연속 | 시작어 반복 | 결과 |
|---|---:|---:|---:|---:|---:|---:|---|
| 704 | 65 | 14.5 | .451 | .185 | .000 | .095 | FAIL 0 |
| 705 | 69 | 15.3 | .588 | .217 | .030 | .050 | FAIL 0 |
| 706 | 88 | 13.6 | .460 | .193 | .023 | .080 | FAIL 0 |

중간 이력도 보존한다. 첫 격리 실행에서는 세 편이 통과했다. 그 뒤 F19의 영주 산정 1년 공제를 추가한 706에서 CV .447 FAIL 1이 생겼다. 위 실제 문장 검수표의 졸업생 문단을 한 번 고친 재실행에서 .456으로 통과했고, 마지막 `lebihan tinggal` 직역 교정 후에는 .460으로 통과했다. 숫자 통과는 번역 품질·법률 동일성의 승인과 별개다. 새 MS 프로필의 외부 타당성·전체 언어 회귀는 도구 담당자의 별도 기록을 따른다.

## 문장 다양성 규칙 §5 자기 점검

1. 공유 경로는 MS 미지원·오분류 실패를 그대로 기록했다. 격리 MS 검사 최종 FAIL 0이며 두 결과를 합쳐 공유 도구 복구라고 주장하지 않는다.
2. 첫 문장은 각각 기한 의무, 특정 학습 비자 조건, 직장 종료 후 카드 효력 질문이다. `Suppose`류 가상 공식과 이번 배치 내 동일 유형 반복이 없다.
3. 각 글에 정보가 있는 짧은 문장이 둘 이상 있다. 704: “Dokumen asal dipulangkan selepas diperiksa.” / “Perjanjian sewa boleh membuktikan alamat.” 705: “Ibu bapa tidak termasuk.” / “ARC dikeluarkan setelah NIA meluluskan kediaman.” 706: “Permohonan dibuat sebelum luput.” / “Tarikh luput asal kekal.” 법정 조건이 길어지는 문장은 그대로 보존하고 주변 설명을 분리했다.
4. 표·목록·제목을 제외한 문단 시작을 세로로 확인했다. 최종 본문에서 같은 첫 단어의 최대 반복은 2회다. 704의 `NIA`/`Bagi`, 705의 `Profesional`, 706의 `Tarikh`/`Jika`가 각각 2회이며 3연속 시작은 없다.
5. “주장(조문) → 다만”이 세 문단 연속하지 않는다. 704의 신청번호 보관·추가서류 문단, 705의 일부 방문자 신청 문단, 706의 각 사건 날짜 문단은 인용 없이 실제 처리 결과를 설명한다.
6. `bukan … tetapi …` 같은 인위적 대비 틀을 쌓지 않았다. 허가·전환·영수증의 실제 한계 설명은 남겼다. 자동 검출 contrast 0을 모든 부정문 부재로 해석하지 않는다.
7. 실질 본문 결말은 각각 신고 날짜, 신청 범주와 입국방식, 귀국일을 포괄하는 서류다. 뒤에 놓인 출처 확인일·별도 법체계 안내는 필수 범위 고지로 유지했으며 이를 독창적인 결말로 세지 않았다. 홍보 결말을 복사하지 않았다.
8. 공손한 말레이어 설명체를 유지했다. 장식 굵은 글씨·H1·지어낸 1인칭·명령형 체크리스트 제목이 없다. 이미지 캡션은 현재 원문과 같은 `Adegan rekaan`이다. 상담 가능 언어는 EN/中文/JA/KO만 적었고 MS 상담을 약속하지 않았다.
9. 원문의 법률 조건과 링크를 재대조했다. 특히 30일 두 기산점, 60일 이상, 최소 3개월, 30일 미만, 최장 1년, 5/3근무일, NT$ 통화, permit OR 면제를 보존했다. 정확성 보완이 지표보다 우선했다.

## 최종 파일 및 구조 검사

작동하는 Node v24.14.1과 저장소 `gray-matter`로 frontmatter를 파싱했다. 날짜·audience·내부 author·topic·원문 동일 featured_image 및 실제 이미지 파일, FAQ 3개, H1/장식 강조 금지, EN 출처 보존, 모든 내부 칼럼 파일 존재를 확인했다. 해당 검사 오류는 0개다. 전체 앱 빌드나 실제 공개 페이지 검사는 실행하지 않았다.

| 파일 | 실제 bytes | 공식 외부 URL 종류 수 | 내부 칼럼 링크 수 | 최종 SHA-256 |
|---|---:|---:|---:|---|
| `src/content/columns-ms/704-taiwan-arc-first-application.md` | 13,135 | 10 | 3 | `f6b3b37c9ca2eb9a3e8972998c932ee8422372f7ccdabb6382ce6269825c6945` |
| `src/content/columns-ms/705-taiwan-visa-residence-work-study-family.md` | 13,688 | 15 | 5 | `ed821ce519c4fe273addbc34381bcdc5b9ce7c40e0710924a6d0d042d12c877a` |
| `src/content/columns-ms/706-taiwan-arc-renewal-changes-reentry.md` | 16,147 | 15 | 3 | `d36f68224f0241886f23ffdad3185c107b0b89b35845b88f4790cf1b1e5cc4fe` |

후속 검수자는 이 해시의 제목·요약·FAQ·본문·출처 및 문장 수정 내용을 직접 검토해야 한다. 현재 기록은 저자 검수와 제한된 기계 검증의 증거이며, 독립 게시 승인 또는 운영 반영 증거가 아니다.

## 독립검수 요청 반영 — 2026-10-25

`reviews/ms-independent.md`의 P2 한 건을 반영했다. 읽은 독립 보고서의 SHA-256은 `afba2c850d5656c0e40cc2309e5757ec266b49fdc4e5acc013a4800820078ed0`이다. 독립 보고서 자체는 수정하지 않았다. 그 보고서의 P3 두 문체 제안은 이 후속 수정에 포함하지 않았다.

| 위치 | 수정 전 | 실제 수정 | 이유와 보존한 의미 |
|---|---|---|---|
| MS706, `Perjalanan ketika kad baharu masih diproses` | `Selepas kembali, pemohon perlu memenuhi syarat dan mengemukakan permohonan baharu.` | `Selepas kembali, pemohon boleh mengemukakan permohonan baharu jika memenuhi syarat prosedur itu.` | NIA 주의9의 재입국 후 적격 재신청은 `may + if`다. `perlu … mengemukakan`이라는 의무 읽기를 `boleh … jika`로 바로잡았다. 앞 문장의 출국 시 기존 심사를 더 진행하지 않는 효과, 특정 전문인재·가족 온라인 절차로 한정된 적용 범위, 재입국·영수증 효력의 비보장은 그대로 보존했다. |

본문 인접 문장과 F23을 다시 읽었다. 외국인의 재입국 자체에 새 신청 의무를 만들지 않고, 절차의 자격을 갖춘 사람이 선택하여 신청할 수 있다는 의미다. 기산점·금액·FAQ·공식 URL·이미지·메타데이터는 바뀌지 않았다. §5의 문단 시작, 도입·실질 결말, 짧은 문장, 법적 조건도 이 한 문장 수정 후 다시 확인했다.

요구된 공유 경로를 실제 최종 3편에 실행했다. 도구 담당자의 복구가 반영돼 이번에는 `[ms]`로 올바르게 판정됐으며 exit0, FAIL0이다. 작성자는 검사기·프로필·임계값을 수정하지 않았다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-ms/704-taiwan-arc-first-application.md src/content/columns-ms/705-taiwan-visa-residence-work-study-family.md src/content/columns-ms/706-taiwan-arc-renewal-changes-reentry.md
```

공유 검사기 SHA-256: `79b3e7826fa61e56f919f966d2c5f63ad47eab5f9c1a9a0122aa53c6fd942876`.

| 파일 | 문장 | 평균 | CV | 짧은 문장 비율 | 같은 길이 3연속 | 최종 결과 |
|---|---:|---:|---:|---:|---:|---|
| MS704 | 65 | 14.5 | .451 | .185 | .000 | FAIL0 |
| MS705 | 69 | 15.3 | .588 | .217 | .030 | FAIL0 |
| MS706 | 88 | 13.7 | .459 | .193 | .035 | FAIL0 |

| 최신 원고 | bytes | SHA-256 |
|---|---:|---|
| MS704 | 13,135 | `f6b3b37c9ca2eb9a3e8972998c932ee8422372f7ccdabb6382ce6269825c6945` |
| MS705 | 13,688 | `ed821ce519c4fe273addbc34381bcdc5b9ce7c40e0710924a6d0d042d12c877a` |
| MS706 | 16,161 | `a63acbaa0fe59bc7bcffc6a3b537a28222b07c5659bcb44c41be84cff97e8cd1` |

MS704·705는 초회 인계 때와 byte-identical하다. MS706의 초회 해시 `d36f6822…`와 현재 해시는 다르므로, 독립 검수의 기존 판정을 현재판 승인으로 자동 승계하지 않는다. 이 수정에 대한 재검수와 통합·게시 판단은 조정자에게 인계한다.
