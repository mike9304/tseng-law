# MS6 독립 의미·문체 검수 — R1

2026-10-26 KST. 판정: 필수 수정2건(M1·M2), 선택 개선3건(O1–O3). 원고는 수정하지 않았다. 작성자와 다른 에이전트 `/root/column_voice_rules`가 정본·법률 범위·말레이어 문장을 대조한 결과이며, 사람 원어민 또는 변호사 승인이 아니다.

## 동결 입력과 검사 범위

저자 manifest SHA `143c626e888e997b45260c1f1a24df0d60af899f32fc6ffde79adc09a4a6ed1b`, 저자 기록 SHA `e024f0fa5e4a41a0914eac79d59b872192b3d2c11c555808dbac620ffb78e8ab`를 확인했다. 원고6개와 저자 증거13개 모두 manifest SHA에 일치했다. 원고의 제목·요약·본문·표·FAQ17개·출처를 모두 읽고 대조했다. 입력 경로와 전체 SHA는 [ms-independent-inputs.json](../checks/ms-independent-inputs.json)에 있다.

현행 정본6편, BRIEF, facts/register/freeze/final contract와 문체 규칙 전문은 바로 앞 연속 집필 작업에서 읽은 동일 SHA 정본을 재사용하고 해당 구절을 다시 비교했다. 최근 실제 MS704/705/706 전문은 이번 검수에서 읽었다. Home editorial-voice는 부재하며 R EDITORIAL-VOICE와 COLUMN-VOICE-RULE, shared 다양성 규칙·LESSONS를 적용했다. facts만을 축약 원고로 대신 읽지 않았다.

| ID | 확인한 추출 단위 | 실제 저자 최종 CV | 검수 대상 SHA256 |
|---|---:|---:|---|
| 915 | 43 | 0.501 | `19c743f3d68a65ac4fb3a5ac25d9861df017ab48afde6bfa87d220bcb89badda` |
| 916 | 47 | 0.515 | `e8de772156076b020564e30955075e84a2ba0b6388ffbd99366c304829c38d86` |
| 918 | 45 | 0.483 | `bb55a0db717c9eafbcdc5c8b64a475dfec3f8d208c629e711e8ce8e9a4069ef0` |
| 919 | 43 | 0.467 | `b7d5cf0db2af832600b286b0b3634e6f58fb1da81098f407ae007be6143ac549` |
| 920 | 42 | 0.509 | `aed340902065a8149571f3ca67b74bdfea7d2c64d730ff5295f1316e3c5554b4` |
| 921 | 43 | 0.472 | `39113b45c74664dd0104e20a05837675b4aa1c5e9735e00de4df91a25bd84c2d` |

[저자의 실제 최종 공유 결과](../checks/ms-variety-final.json)는6편 모두 exit0/FAIL0이다. 정확한 원고 SHA와 공유 checker4파일의 현행 SHA를 대조했고, 263개 저장된 최종 추출 단위를 직접 읽었다. 동일 입력에 대한 점수 검사를 새로6회 반복하지 않았다. `No.`와 사건번호, 금액의 쉼표,85-1/40(1)(2)/6(1)(4), 인용·하이픈·출처 꼬리에서 경계 오류를 발견하지 못했다. MS profile 개발에 과거 참여했으므로 이 확인을 도구 자체의 독립 검증으로 부르지 않는다.

## 필수 M1 — 920의 특정 조문 주장 주체

위치: [MS920:37](../src/content/columns-ms/920-taiwan-apartment-ev-charger-common-area-judgment.md), 추출18–19단위.

문제 문장:

> Penghuni bersandar pada perkara 6(1)(4), yang menyentuh pemasangan saluran untuk bahagian persendirian dan penggunaan bahagian bersama apabila perlu. Hujah itu ditolak berdasarkan lokasi sebenar pemasangan.

`Penghuni`는 거주자/항소인에게6(1)(4)라는 특정 조문 주장을 귀속한다. 그러나 [보관된 공식 판결 L44](../research/retained/zh-hant-ev-primary-recovered.md)는 해당 법적 분류를 `被上訴人`의 주장으로 적는다. L43에는 거주자가 전용 부분의 배선이라고 주장한 내용이 있으므로, 그 일반 주장과 L44의 특정 조문 주체를 섞으면 안 된다. 현행 ZH 정본은 이 부분을 당사자의 분류로 중립 서술한다. [공식 판결 경로](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=KSHV%2C111%2C%E4%B8%8A%2C132%2C20220622%2C1).

최소 수정안:

> Perkara 6(1)(4) turut menyentuh pemasangan saluran untuk bahagian persendirian dan penggunaan bahagian bersama apabila perlu. Mahkamah tidak menerima pengelasan itu bagi pemasangan dalam kes ini.

의미 보존: 조문 내용과 이 설치에 대한 분류 배제는 유지하고, 확인되지 않은 주장 주체만 제거한다. 이어지는 실제 위치·규약 설명,6(1)(5)/6(3)/11조, 규약15조의 허가 AND 안전검사, 잠금 주장과 철거 결과는 그대로 둔다. FAQ1의 전용부분에 관한 일반 항변은 L43의 근거가 있으므로 이 지적만으로 바꿀 필요가 없다.

## 필수 M2 — 921 본문·FAQ의 미사용 게임비용 범위

위치: [MS921:39](../src/content/columns-ms/921-taiwan-online-game-coins-refund-judgment.md)의 제18점 설명과 같은 파일20행 FAQ2 답변.

문제 구절은 두 곳의 `mata berbayar yang belum digunakan atau fi permainan`이다. 말레이어의 후치 관계절 `yang belum digunakan`이 OR 앞의 유료 포인트에만 직접 붙어 있어, 뒤의 게임비용에는 미사용 제한이 없는 것처럼 읽힐 수 있다. 작성자가 모든 사용료 환급을 의도했다고 단정하는 것이 아니라, 환급 대상의 범위를 명시해야 한다는 지적이다.

현행 [공식 제18점](https://law.moda.gov.tw/LawContent.aspx?id=GL000018)의 환급 문구를 직접 다시 읽었다. [정부 소비자 교육자료 문항166,72쪽](https://cpc.ey.gov.tw/File/39F1206999863DC2?A=C#page=72)도 남아 있는 미사용 선불금·게임비용을 대상으로 설명한다. 이번 확인에는 그 잔액 범위만 사용했고, 자료의 다른 가상재화 설명을 모든 게임으로 일반화하지 않았다.

본문 수정안:

> Bagi mata berbayar yang belum digunakan atau fi permainan yang belum digunakan, pengendali mesti membuat bayaran balik selepas menolak kos yang perlu dalam masa 30 hari dari tarikh penamatan kontrak.

FAQ2의 해당 문장 수정안:

> Bayaran balik bagi mata berbayar yang belum digunakan atau fi permainan yang belum digunakan mesti dibuat dalam masa 30 hari dari tarikh penamatan setelah kos perlu ditolak, atau diurus mengikut kaedah yang dipersetujui kedua-dua pihak.

의미 보존: 포인트 OR 게임비용, 필요비용 공제, 계약 종료부터30일 이내 환급 must OR 쌍방 합의 방식, 소비자의 언제든 종료 may를 유지한다. 본문 다음 문장의 쌍방 합의 조건도 유지한다. FAQ1의 사건상 부정 분류 문장까지 일괄 문자열 교체할 필요는 없다. 제18점의 두 작동 규칙 문장만 명확히 하면 된다.

## 선택 개선

필수 차단 사유는 아니다. 적용한다면 작성자 소유 원고에서 실제 변경 후 해시·변경 구절·검사 결과를 남긴다.

| ID·위치 | 현재 문장 | 이유와 수정안 | 의미 보존 |
|---|---|---|---|
| O1·915 제목 | `Tuntutan wang bertukar kepada lanjutan masa: award kerja awam Taiwan dibatalkan` | 실제 첫 변화는 맞지만, 취소의 직접 쟁점인 연장 권고 뒤 금전청구 복귀가 덜 드러난다. `Tuntutan wang selepas syor lanjutan masa: award kerja awam Taiwan dibatalkan`을 제안한다. | 본문·FAQ는 이미 전체 순서를 보존한다. 모든 변경이 중재를 막는다는 명제를 추가하지 않는다. |
| O2·919 제목 | `Pemecatan kerana buli di Taiwan: hukuman mendahului pertimbangan jawatankuasa` | 실제 처벌 집행보다 ‘처분 발표’가 심의에 선행했다는 점을 명확히 한다. `Pemecatan kerana buli di Taiwan: pengumuman hukuman mendahului pertimbangan jawatankuasa`. | 본문·요약은 이미 발표를 정확히 적고 있다. 무괴롭힘·복직 단정으로 바뀌지 않는다. |
| O3·919 본문34단위 | `Jawapan memerlukan perkara yang jelas untuk dijawab.` | MONOTONY: 답변/답변할 내용이라는 동어 반복의 짧은 문장 — 바로 다음 통지 예시의 주체를 앞세워 `Kandungan notis menentukan perkara yang perlu dijawab.`. | 구체적인 답변 대상을 알려야 한다는 뜻과 뒤의 통지·인터뷰·최종판단 비교를 유지한다. 새 서식·공개 의무가 아니다. |

## 나머지 핵심 조건 대조

| 글 | 독립 대조 결과 |
|---|---|
| 915 | NT$44,417,150은 취소된 award이고, 업체 상고기각·해당 취소 사건 확정을 구별했다. 돈→연장→연장 권고·기관 불동의→돈 복귀와 돈 청구 권고 부재, 적용법 버전 이유 수정/취소 유지가 있다. 현행 공사 OR 기술서비스, 권고 OR 안, 기관 불동의 때문에 실패라는 인과 및 별도 합의 경로를 보존했다. ITA는 미국 공급자 전망이며 연말2026/다음해2027, 개별 입찰·자격 보장으로 쓰지 않았다. |
| 916 | 단순 외국 소유만의 책임을 만들지 않았다. 본문에서 근로자 고지와 개선 미이행을 모두 적고, 인지·통제·감자/국외송금 목적을 함께 설명했다.246 파기환송/262 상고기각을 구별하며 원청구 전체 기각·소송 전체 종결로 바꾸지 않았다.154조의 남용→특정 채무, 명백한 곤란, 중대성/필요성의 누적조건이 명시된다. 현재154를 과거의 유일한 근거로 소급하지 않았다. |
| 918 | 2019.2.23 서신/7월 결함/8월 출입/11.5 지급/11.28 보증서상 인도,2022.2.9 항소·추가청구 기각과 상소불가를 대조했다. 계약4개월과 현행6개월 모두 사용허가 취득부터 통지기간이다.6개월 안에 모든 실제 인도를 완료한다는 일반화가 없다. 매수자 지급·서류 협조 의무,2025 점검과2026.9.18 CBC의 별도 시점을 유지했다. |
| 919 | 두 대과에 따른 공무원 면직, 원처분 AND 복심 취소, 상소 가능을 보존했다. 사전 발표·상급기관 선행·청취 누락·보고서 모순·사후 답변으로 치유 불가가 있다.2026.7.1 민간 신제와 과거 공무원 사건을 분리했다. 조사·조율의 객관/공정/공평, 답변 기회·이해회피, 신고 인지 후 보호/조사 must, 희망 시 조율 may, 불성립 시 조사 속행 must를 유지했다. `Perlindungan boleh bermula segera`는 바로 뒤 must와 함께 보호를 최종 인정까지 미루지 않는 문맥이므로 별도 필수로 세지 않았다. |
| 920 | M1 외에 법11조 소유자회의와 해당 규약15조 위원회 허가 AND 전력회사 안전검사가 구별된다. 위반 AND 조율 후 미이행의 문맥을 둔 법원청구 may이며 자동 철거 일반화가 없다. 잠금·정지·열쇠는 주장으로, 설령 사실이어도 철거/복구 의무가 남는 판단을 유지했다. 확정 미확인, 공동구역 케이블트레이 보조,9.30 기한 경과와 동의 대체 불가가 있다. |
| 921 | M2 외에 NT$243,548은 청구액, 미사용 유료 포인트 부재·게임 칩 기능, 본인 종료 의사와 사업자 제재 전체 승인의 구별이 있다.2021 사건과2023 시행규정, 시작 후7일 서면·무이유·무비용 해제와 언제든 종료, 보존 최소30일과 신청 접수 후7일 제공을 나눴다. 사업자 기록만의 기준 금지와2025 첫 신고 유형2위/전년감소·2026.5.7 발표도 정확한 범위다. |

필수로 세지 않은 추가 세부도 확인했다.916의 미국 민간파트너 세부는 [USTR 원문](https://ustr.gov/about/policy-offices/press-office/fact-sheets/2026/february/fact-sheet-us-taiwan-agreement-reciprocal-trade)에 있지만 현행 EN 정본도 이를 축약한다. MS는 미국의 가능한 지원·적용법·개별 자금지원 보장 아님을 보존하므로 그 추가 세부만의 누락으로 차단하지 않았다.920 예산 소진 조기마감,918 개정일9.17,921 개정일8.10도 정확한 정본 요약에 없던 선택 세부를 새로 확장해야 한다는 이유로 필수 지적하지 않았다.

## 문체 규칙 §5와 최근 MS3 비교

- 최근704는 ARC 신청 요건,705는 Mandarin 비자 목적,706은 고용 종료 후 체류 질문으로 시작한다. 새6편은 사건 결과3, 구체 질문2, 금액1로 나뉘며 같은 유형이 절반을 넘지 않는다. 기존3편의 ARC/서류 안내 도입을 그대로 반복하지 않는다.
- 아주 짧은 단위는13/12/11/10/11/9개, 문단당 긴 단위는 최대1개, 같은 문단 첫말은 최대1/1/2/2/1/1회다. 인접 동일 첫말은 모두0이며 수직으로 읽어 확인했다. 기계 통과와 별도로 O3를 선택 문체 지적으로 남겼다.
- 질문은1/2/1/1/2/1개이며 제목·FAQ의 질문을 본문 수로 넣지 않았다. 법적 부정·예외를 일반 대비식과 구별했다. 상투적인 주장(조문)→다만3문단 연속, 불필요한 독자 반박, 훈계형 체크리스트 제목은 발견하지 못했다.
- 실질 결말은 각각 중재 서류 순서, 보고서 후속결정·자산이전, 통지 종류, 실제 청취 기록, 설치계약 비용, 게임 내 잔액 생성 경로에 묶인다. 최근 ARC3의 다음 신청기한·입국방식·재입국 문서 결말과 구별된다.25일 사건/26일 현행자료 확인 고지는 구조적 꼬리로 따로 보았다.
- 표2개와 FAQ17개, 제목·요약·분류·alt·캡션도 별도 읽었다. 굵은 강조·가공1인칭·현지 상담언어 약속을 발견하지 못했다. 내부 author와 `Adegan rekaan`,26일 메타·topic·ms audience는 저자 구조 검사와 실제 frontmatter가 일치했다.916의 말레이어 회사 구조 링크는 실제 기존004 경로다.

자동 감사의30개 `REQUIRED` 의미 항목을0으로 바꾸지 않았다. 위 대조는 원고의 제목/FAQ·요건·숫자·관할과 문체 부분을 담당한다. 공개 카드·렌더링·JSON-LD·피드 확인은 이 읽기 전용 검수에서 수행하지 않았다. 기존 구조0오류/가시성6개는 SHA가 일치하는 저자 검사 증거로 구별해 인용했다.

## 후속 범위

M1은920의 해당 두 문장, M2는921의 본문·FAQ2 두 문장만 좁게 고칠 수 있다. 작성자가 수정·역복원·실제 검사·새 SHA를 남긴 뒤 이 부분과 주변 조건을 재확인하면 된다. 선택 개선은 승인 조건이 아니다. 원고·도구·R·저자 기록·타인 파일은 이 검수자가 변경하지 않았다. 변경 전후 동결 확인과 이 보고서 SHA는 [ms-independent-manifest.json](../checks/ms-independent-manifest.json)에 기록한다.
