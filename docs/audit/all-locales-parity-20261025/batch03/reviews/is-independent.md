# IS ARC 704–706 — independent review R1

검수일: 2026-10-25 KST. 검수자: Codex `/root/column_deploy`. 저자: `/root/column_live_audit`. 범위는 아래 고정 SHA의 제목·SEO 제목·summary·FAQ·본문·출처·이미지 metadata와 문장 경계이다. 이 보고서만 작성했으며 원고·R·공유 도구·저자 기록을 수정하지 않았다. 사람 원어민 또는 대만 변호사 감수·출판 승인 기록이 아니다.

판정: REQUEST_CHANGES / R2 필요. 법률 의미에서 필수 수정할 오류는 이번 범위에서 발견하지 않았다. 남은 필수 조치는 M01 문장 경계 도구 수정 후 재검사와 M02 705의 문장 리듬 수정이다. 공유 CLI가 출력한 세 편 PASS를 유효한 최종 다양성 통과로 인정하지 않는다. 선택 수정 요구는 없다.

## 고정 입력과 재확인

다음 SHA256은 검수 시작과 종료 시 동일했다. 세 원고 및 `is-author.md`의 변경 없이 검수했다.

| 파일 | 시작·종료 SHA256 |
|---|---|
| 704-taiwan-arc-first-application.md | b9c21267925b98ec161d911e22232f9c1e43ac6d80b107856828738f559ef0d3 |
| 705-taiwan-visa-residence-work-study-family.md | 1bc84c7a5ba64f10a4159d1a5433107c4ec75c290925ca945a711647cfa99cc8 |
| 706-taiwan-arc-renewal-changes-reentry.md | ac5b83d0c073e2750fc74ce3bfb51b075e08fd32ade0d0499cbd3bcdc21ed3f7 |
| reviews/is-author.md | 2799e89acd9a02ac98cbcbe2247ba575b996662696827ab5bc24fb1c485aa6dd |

`R=/Users/son7/Projects/tseng-law-all-locales-20261025`. B3/B2/원 ARC 브리프, R 규칙과 현행 EN/KO/ZH 아홉 편은 같은 세션의 선행 EL 집필에서 전문을 읽었다. 이번 IS 검수에서는 현재 파일 SHA가 그때 읽은 입력과 동일한지 다시 계산하고 쟁점 문장을 재대조했다. 아홉 편 전체를 이번에 새로 재독했다고 주장하지 않는다. IS 세 편, 저자 기록, 최신 IS 849–851은 이번 검수에서 전문을 읽었다.

| 정본 입력 | SHA256 |
|---|---|
| columns-en/704 | 610343da1255e2e873956c6de54bd0f9c72c6731aae9343bd7bae9884efdd39f |
| columns-en/705 | 87a4ab6e9a5e8b434a30de0dc111307fc58e878a7534cef793e2a3e27be38304 |
| columns-en/706 | 1ecf6acc92d181afb2820bb001d4e4d45cc4eeca823d2e32def25faebe119d71 |
| columns/704 | cbf6b07b2d41c3b136ceac099f8d32152ca125c18478321610ffa715c29476a1 |
| columns/705 | 727377648fcc7e2bd1d8ea8202bea5fb69f01174ce51a0ee422891126011d54a |
| columns/706 | 4cd612086336cb1a3720111390ce7aca3f4eff5c7f96c5e92aea001fa7b8cfbc |
| columns-zh/704 | 0c00bc06bf3c3c1860a95af4dbcea9eaab981300860916856295e8b947244468 |
| columns-zh/705 | 290a50047632ad830ea98c524ffef6ed91c2b4c8d555a1844689824c3ffea7a3 |
| columns-zh/706 | 4d70e78b9a197f4a2b81d25d61b6fa862ee849a6392d5fd905e90bcf781e721c |
| research/arc-source-facts.md F01–F24 | 4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145 |
| source-refresh.md | a33d5bd1439879bc7461755c3b6793f4942ec161454032dcb8cde1c4d52a6983 |
| R docs/columns/EDITORIAL-VOICE.md | 8b4e39550d9f9ff32b861270bad83a51a69fd71893046a54e7ffdaced9727ea3 |
| R docs/columns/FRONTMATTER.md | 7a2590f33ba49c55f539f1fade51fed1290808352b16247445a714333593a364 |
| ~/tseng-col-0930-work/COLUMN-VOICE-RULE.md | 8d2eb1f73aeb0967350b8be90aafccfc678224f31cbbf930407462fce65b291d |
| shared SENTENCE-VARIETY-RULE.md | befec7538792d2a98f8c596911667005e2a4000efc078b01db9793c88366edd5 |

공유 LESSONS는 검수 중 자동 갱신되었다. 처음 읽은 21:04판 `ee0e37da8ffc0a50ba5fb6c6a07c1d67c379538b2e8367b2fa244450d284ca18`에 이어 23:04판을 전문 재독했고 최종 SHA는 `92c572987cbc3c03eeb934fbfd2de6cf42d7e4b2e441cc39fb009c0e11f0e71a`이다. 홈 `~/agent-library/knowledge/editorial-voice.md`가 없는 상태는 선행 작업에서 확인했으며, 읽었다고 처리하지 않고 브리프가 지정한 R 문체 정본을 적용했다. 폐기된 Fable 의무·고정 검수 게이트는 적용하지 않았다.

## 실제 공유 검사와 잘못된 문장 경계

아래 명령을 실제 실행했고 exit 0이었다. 본문을 다른 언어로 검사하거나 도구를 수정하지 않았다.

```sh
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check \
 /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-is/704-taiwan-arc-first-application.md \
 /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-is/705-taiwan-visa-residence-work-study-family.md \
 /Users/son7/tseng-all-language-columns-20261025/batch03/src/content/columns-is/706-taiwan-arc-renewal-changes-reentry.md --lang is
```

엔진 SHA256 `69ceb7202a6e716ba1666ec08f4757daea8bc43289448dcffa8446c830ecd6fb`, IS profile SHA256 `fbd3b0eea7a5518eda61a6a83e7afd325a7c7b5e467708e99210a21c7088ee05`에서 나온 출력:

| 파일 | 문장 수 | 평균 | CV | short | run3 | opener_rep | cite_para | CLI 출력 |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 704 | 66 | 13.8 | .470 | .227 | .016 | .053 | .316 | FAIL 0 |
| 705 | 77 | 13.5 | .454 | .247 | .080 | .043 | .435 | FAIL 0 |
| 706 | 79 | 15.1 | .455 | .177 | .078 | .043 | .565 | FAIL 0 |

각 편 cite_end/contrast/caveat는 0, 본문 질문은 1로 출력했다. 이 수치는 문장 분리 오류의 영향을 포함한다. profile의 review_status 문구도 인간 원어민 승인을 뜻하지 않는다.

M01 — 도구 측정 결함, 수정·설치 후 R2 필수. 공유 `body_blocks`의 본문 문단 기준 네 오류를 직접 확인했다. 아래 따옴표 안은 링크를 펼친 실제 원고 문자열이며, ` / `는 도구가 만든 문장 경계이다.

1. 704 문단 18: `Atvinnuheimild þarf enn að ná til raunverulegs starfs og vinnuveitanda samkvæmt 43. / og 48. gr. laga um vinnumiðlun.` → 정상은 `Atvinnuheimild þarf enn að ná til raunverulegs starfs og vinnuveitanda samkvæmt 43. og 48. gr. laga um vinnumiðlun.` 한 문장이다.
2. 705 문단 5: `4. / og 5. gr. sérfræðingalaganna skilgreina fagstörfin og leyfisferlið.` → 정상은 `4. og 5. gr. sérfræðingalaganna skilgreina fagstörfin og leyfisferlið.` 한 문장이다.
3. 706 문단 3: `7. / og 9. gr. dvalarreglugerðarinnar ákveða fresti vegna breyttrar dvalarástæðu og framlengingar.` → 정상은 `7. og 9. gr. dvalarreglugerðarinnar ákveða fresti vegna breyttrar dvalarástæðu og framlengingar.` 한 문장이다.
4. 706 문단 10: `Tilkynning til banka, skóla eða vinnuveitanda uppfyllir ekki skráningarskylduna samkvæmt 31. gr. Geymdu dagsetta staðfestingu umsóknarinnar.`를 도구가 한 문장으로 합쳤다. 정상은 `Tilkynning til banka, skóla eða vinnuveitanda uppfyllir ekki skráningarskylduna samkvæmt 31. gr.`와 `Geymdu dagsetta staðfestingu umsóknarinnar.` 두 문장이다.

공식 근거는 [Árni Magnússon 연구소 Ritreglur](https://ritreglur.arnastofnun.is/) §22.1–22.6 및 §1.2.1을 실제 열어 확인했다. 서수와 약어에 쓰는 마침표가 모두 문장 종결은 아니며, 약어·서수 뒤에서 문장이 끝날 때 종결 마침표를 하나 더 쓰지 않는다. 숫자·날짜·시간 표기의 마침표도 문장 경계와 구별해야 한다. 따라서 조문 표기를 비정상적으로 바꾸어 검사기에 맞추는 수정을 저자에게 요구하지 않는다.

위 네 경계만 stdout 실험의 문장 배열에서 바로잡고, 공유 도구의 동일한 `slen(..., 'is')`와 `statistics.pstdev/mean`으로 재계산했다. 파일·함수 monkeypatch·profile 변경은 없었다. 정상 경계 검토값은 704 65문장/CV 0.462643, 705 76문장/CV 0.437948, 706 79문장/CV 0.450746이다. 각각 평균 14.0462/13.6579/15.0506단어, short 0.215385/0.223684/0.177215였다. 이 별도 재계산은 수정된 공유 CLI의 PASS를 대신하지 않는다.

재현 방법: `strip_fm` → `body_blocks(body,'is')` → 문단별 `sentences(p,'is')`를 얻고 위 1–3의 인접 두 요소를 공백 하나로 합친다. 4의 요소는 ` Geymdu ` 앞에서 나눈 뒤 두 번째 요소에 `Geymdu `를 보존한다. 모든 요소를 `slen`으로 센 뒤 모집단 표준편차/평균을 계산한다. 나머지 문장 경계는 그대로 둔다. 이 네 교정은 원고 의미·글자·출처를 전혀 바꾸지 않는다.

Root와 voice_rules에 결함을 전달했다. 도구 담당에게는 별도로 중립 예문과 literal 기대 경계, 공식 문법 근거를 전달했으며 원고 점수에 맞춘 profile 설계를 요청하지 않았다. 원고 밖의 검증·설치는 해당 담당자 범위다.

M02 — MONOTONY: 705 문장 길이 변동. 정상 경계로 계산한 CV 0.437948은 공통 기준 0.45 미만이다. 기계 PASS가 이 문제를 가렸다. 실제 도입의 다음 세 문장은 동일하게 14단어씩 이어진다.

> Hæfur sérfræðingur getur við ákveðin skilyrði komið án áritunar og sótt um dvöl innanlands.
> Fyrir námsmann getur sama komuleið útilokað almenna umsókn um dvöl vegna náms á Taívan.
> Munurinn kemur fram í 16. gr. sérfræðingalaganna og leiðbeiningum BOCA um háskólanám og kínverskunám.

이유: 각 문장이 유용한 내용을 담고 있지만 유사한 길이의 주어+설명 세 문장이 연속해 두 집단의 차이를 같은 박자로 전달한다. 방향: 자격을 갖춘 전문가와 학생의 서로 다른 결과를 자연스러운 한 문장으로 연결하고 다음 근거 문장을 유지하는 등, 긴 조건문과 짧은 결과문을 뜻에 따라 조정한다. 예시 수정안은 `Við ákveðin skilyrði getur hæfur sérfræðingur sótt um dvöl innanlands eftir komu án áritunar, en sama komuleið getur útilokað almenna dvalarumsókn námsmanns vegna náms á Taívan.`이다. 바로 뒤 법령·대학·중국어 과정의 세 공식 링크는 모두 유지한다. 이 예시만으로 수치 통과를 보장하거나 그대로 채택할 의무를 부과하지 않는다. 저자가 자연스러운 문장으로 수정한 뒤 설치된 정상 경계 도구로 전체 세 편을 재검사해야 한다. 의미 보존 조건은 적격 전문가의 조건부 신청 가능성과 일반 학생 경로의 제한, 해당 경로의 모든 세부 조건·출처 유지이다.

## 법률·조건·FAQ 대조

이번 검수에서 실제 공개 열람한 공식 자료는 다음과 같다. 자료 전체를 새로 크롤링했다는 뜻은 아니다.

- [인재법 현행 중문 전문](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030295): 4·5·8·9·12·14·15·16·17조, 특히 16조 두 집단과 공통 거류/영주 조건.
- [취업서비스법 50조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=50), [53조](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=53): 학생 방학 예외, 이직/추가고용과 전 고용 종료증명.
- [이민법 현행 영문 전문 31조](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0080132): 원래 사유 소멸 시 취소 의무, 계속거류 예외, 초과거류 <30일 조건, 주소/직장 변경 다음 날 기산.
- [NIA 일반 0902 중문](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/): 보완·수수료·최초 배우자·특정전문인재 승인 조건.
- [NIA 전문인재·가족 특정 온라인 절차](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/), 주의 9항: 출국에 따른 처리 종료와 재입국 후 적격 시 재신청 가능.
- [BOCA 비자 항목 설명](https://www.boca.gov.tw/cp-391-3822-b12d4-1.html): 입국에 사용할 수 있는 비자 유효기간과 허용 체류일수의 구별. IS705에 추가된 공식 근거의 실제 내용도 확인했다.

| 사실표 | 이번 원고 대조 결과 |
|---|---|
| F01–02 | 704 제목/summary의 신청 기산 차이를 본문 표·FAQ가 구체화한다. 거류비자 입국+거류허가 → 입국 다음 날30일; 입국 후 발급 → 발급일부터30일. 유효 통합문서 예외 유지. |
| F03 | 704/705 전문인재·특정전문인재와 허가/해당 면제, 적격 입국방식 및 NIA 승인 후 ARC를 연결한다. 통상 고용주의 허가 신청 주체와 법정 예외도 보존한다. |
| F04 | 705 두 항목은 일반 전문인재+대만 전문업무 OR 특정전문인재, 다음 `Í báðum tilvikum`은 양쪽 모두 NIA 거류 OR 영주 승인이다. 가족 범위와 신체 OR 정신장애·자기돌봄 불가능 조건 보존. `önnur fullorðin börn` 제외가 장애 예외를 지우지 않는다. |
| F05 | 타이완 거주 AND 호적 국민 배우자, 유효비자 허용체류 최소60일, 연장금지/기타 제한 없음, 다른 자격 병존. 비자 사용 유효기간을60일로 바꾸지 않았다. |
| F06–08 | 최근2년 사진, 최근1개월 취업·재학 자료, 등록 전후 구별, 가족의 적절한 신분/거류 자료. 해외서류 인증 의무와 중국어 번역 요구 가능성 구별. 최초 배우자의 대만 거주+호적·동행·혼인등록 및 최장1년 유지. |
| F09–10 | NT$1,000/승인연도·1년 미만도1년, 해당경로 추가2,200, 僑生 50%만, 재발급500. 일반3년/특정전문인재5년/GC1–3년 구별, 특정전문인재는 NIA 거류 승인 다음 날 기산·적격 가족 자기 승인·연장 조건 보존. |
| F11–12/F24 | 일반10근무일과 학생5근무일, 보완 제외·재계산. 학생 승인부터5근무일 납부·전자≤6개월·납부후3근무일 뒤 IC수령. 일반 보완은 통지 다음 날15달력일, 해당 자료를 해외/CN/HK/Macau에서 발급받아야 할 때3개월, 가산 아님, 기한 내 완전 보완 없으면 기각. |
| F13 | 정규 전일제 학생, 올바른 입국 목적/비자, 일반 무비자·도착·타목적 제외. 인정 대학부설 중국어4개월 완료+최소3개월 계속등록, 월–금 주15시간, 휴가 포함 결석≤1/4. |
| F14 | 카드만으로 모든 업무 취업 가능하지 않음. 호적 국민과 혼인+본인의 승인 거류 면제와 외국인 전문가 배우자의 별도 신청 구별. 학생20시간 예외는 여름·겨울 방학 두 종류. |
| F15–17 | 706 표·FAQ의 일반 만료 전3개월은 신청창구. 주소/직장 변경 다음 날30일; 사유 변경 사실일부터30일 NIA 또는15일 BOCA 신청(발급완료 의무 아님). 계속사업 창업4개월·사업중단3개월·GC4개월 창구 구별. |
| F18–19 | 706 `ber ... að`는 사유 소멸 시 NIA 취소 의무. 법정 사유 아래 계속거류 승인 가능성과 개별 조건을 남긴다. 초과거류 <30일 AND 원래 사유 계속 AND 처벌 후 재신청 가능, 영주 계산1년 공제. |
| F20–21 | 적격17조6개월+1회/총1년, 졸업자11조1년+1회/총2년, 모두 만료 전 신청·승인·종전만료 다음 날. 새 졸업생+대만 associate 이상+NIA 승인 연장기간 취업면제, 어학수료/모든 옛 졸업자로 확대 없음. |
| F22–23 | 재입국허가 출국 전·ARC 기간 이내·카드취소와 연결, APRC+유효여권 예외. 영수증만으로 여행서류 대체를 보장하지 않음. 특정 온라인 전문인재/가족 절차의 처리 종료, 재입국 후 `má ... ef` 자격충족 시 재신청 가능. |
| 이직 | 706 취업서비스법53조의 허가/예외 및 새 고용주 신청, 전 고용 종료증명은 이직에 한정하고 추가고용 전체에 부과하지 않는다. |

FAQ 9개의 조건·범위는 본문과 맞는다. 모든 세부 요건을 FAQ나 짧은 요약에 반복하지 않았다는 이유만으로 확장을 요구하지 않는다. 706의 31조 예외 문단은 일부 상황을 소개하고 각 사유의 조건이 있음을 명시하므로, 완결된 법정 목록으로 오인해 전 항목 추가를 요구하지 않았다. 번역 언어를 독자의 국적이나 여권으로 취급한 문장도 발견하지 않았다.

## 문체 §5와 최근 세 편 비교

최근 IS 원고의 실제 비교 입력:

| 파일 | SHA256 | 도입·실질 결말 |
|---|---|---|
| 849-icelandic-professional-taiwan-work-permit-residence.md | a2c0cd8a1be0cf5a8eb697c1ec1bcc2b1d8cf2d1f76318ce4c78dd40ec5f14dc | 허가 전 근무 가능성 질문 → 첫 근무일과 체류 마지막 날 |
| 850-icelandic-traveller-taiwan-accident-return-home.md | e2e8f5b8c38dc615116764638eb5abd27f19fcc61f1bb338f4fa271afc98e560 | 경찰 초동자료30일 → 귀국 후 첫 진료와 대만 사고기록 연결 |
| 851-icelandic-exporter-taiwan-unpaid-shipment-invoice.md | e2c87e812ad91dbfea8d04b91064b9f886cd17ba0e89b07cedccdcb317648f67 | 가상 수출·일부대금 장면 → 잔액/지급일/채무자에 묶인 질문 |

1. §5.1: 출력상 세 편 FAIL0이지만 M01/M02 때문에 최종 충족으로 승인하지 않는다. 경계 수정 후 R2 필요.
2. §5.2: 새704 조문상 신청 의무, 705 고용/학업의 입국경로 차이, 706 사유소멸 뒤 카드만료일까지 남을 수 있는지 질문. 한 배치 도입 반복·상투적 가상 도입 없음. 최근849와706 모두 질문형이나 실제 쟁점·문장은 다르다.
3. §5.3: 세 편 모두 의미 있는 짧은 문장2개 이상. 예: 704 `Brot úr ári telst heilt ár.` / `Greiðslan ræður ekki lengd dvalarleyfisins.`; 705 `Inntökubréfið er því aðeins hluti umsóknarinnar.` / `NIA þarf að samþykkja umsóknina.`; 706 `Sækja þarf um fyrir lok dvalar.` / `Hver heimild hefur sín skilyrði.` 정상 경계에서 32단어 이상 문장은 문단당 하나 이하였다. 705 전체 분포는 여전히 M02.
4. §5.4: 문단 첫 단어를 실제 세로로 읽었다. 허용 범위를 넘는 opener 반복은 발견하지 않았다. 수동 경계 변경은 문단 시작을 바꾸지 않는다.
5. §5.5: 법조문 주어/문중 링크/기관 설명과 서류·결과 문단이 섞인다. 연속3개 문단의 주장→조문→단서 틀을 발견하지 않았다.
6. §5.6: 출력 contrast0을 모든 부정·대비 문장의 부재로 해석하지 않는다. 실제 문장의 취업허가/ARC, 비자 유효기간/허용일수,15일/3개월, 어학/학위, 신청/발급 구별은 법적 조건 보존에 필요하다. 이를 단순 수치 감소 목적으로 지우도록 요구하지 않는다.
7. §5.7: 실질 결말은 704 수령 카드정보 대조·기록보관, 705 실제 입국서류로 경로 확정, 706 예정 귀환일을 커버하는 문서이다. 마지막의 확인일·대상범위 고지는 필요한 구조적 꼬리로 구별했다. 판촉 결말 없음.
8. §5.8: 일반 아이슬란드어 독자에게 `þú`로 일관되게 설명한다. 타 언어의 존대 문법을 임의로 적용하지 않았다. H1·장식 bold·가짜 1인칭·공개 byline·명령형 체크리스트 제목 없음. 문장 자연스러움 검토는 AI 검토이며 사람 원어민 승인이 아니다.
9. §5.9: 이 검수에서는 원고 수정0. 수치·기간·주체·출처·가상 이미지 표시 대조 결과는 위 표 및 아래 구조 검사와 같다. M02를 고친 뒤 저자와 R2 검수자가 재대조해야 한다.

## metadata·출처·경로·이미지 확인

R의 `gray-matter`로 실제 파싱했다. 세 편 모두 `published`/`lastmod=2026-10-25`, `audience=[is]`, 내부 `author=legal-ai-assistant`, FAQ3개씩이다. H1/bold 검출0. 내부 byline을 본문에서 노출하는 문장 없음.

EN 정본의 고유 공식 URL 집합 9/15/13개가 각각 모두 보존됐고, 추가된 공식 근거를 포함한 IS 집합은11/16/14개다. KO/ZH의 중문·영문 URL 문자열까지 모두 같은 집합이라고 주장하지 않는다. 인라인 근거와 끝의 공식 출처 목록을 함께 읽었다.

R content audit에 B3 단독 contentRoot를 지정한 실험은 automated FAIL4/review23/semantic REVIEW_REQUIRED였다. FAIL4는 B3 폴더에 EN 전체 원고가 없어서 EN 배우자 링크2회·Gold Card1회·APRC1회를 missing으로 본 것이다. R의 `columns-en/027-taiwan-employment-gold-card.md`, `028-taiwan-foreign-spouse-residence.md`, `029-taiwan-permanent-residence-aprc.md`의 실제 존재를 별도 확인했다. IS 상호 ARC 경로도 B3에 존재하며 EN 링크 문구는 `á ensku`를 표시한다. 따라서 이 네 개를 원고의 깨진 링크로 반려하지 않지만, 실험 결과를 automated FAIL0으로 바꾸어 기록하지도 않는다. 통합 인벤토리 기준 감사는 root의 후속 검사 범위다.

세 원본 v2 `featured_image` 경로는 EN과 정확히 같고 R/public에 존재한다. caption은 모두 `Skálduð mynd`, alt도 IS이다. 이미지 SHA256:

| 이미지 | SHA256 |
|---|---|
| taiwan-arc-first-application-20261024-v2.webp | e33f7f381d597a9ae5b3693d7c4f887a29d7420b1b4ae3c98db664a06dceae31 |
| taiwan-visa-residence-work-study-family-20261024-v2.webp | 0f9d9a4041f5978119b71a6c89ba1a9b01e2643871143163a4bc4d8f792a7e84 |
| taiwan-arc-renewal-changes-reentry-20261024-v2.webp | 9933406b2c0c64af337aaf443c6c5e1ed4afb94e9ed7ab5a5e3635a2b940f16f |

이 IS 검수는 정적빌드·브라우저의 실제 이미지 decode·공개페이지·번역메뉴를 검사한 기록이 아니다. R2에서는 수정된 도구와 새 원고 SHA를 고정하고 경계·법률 의미·출처·FAQ를 재검사해야 한다. 원문·R·공유 도구 변경, 커밋·push·배포는 수행하지 않았다.
