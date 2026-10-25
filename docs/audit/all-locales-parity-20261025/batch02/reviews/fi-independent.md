# FI 704–706 독립 의미·문체 검수

검수일: 2026-10-25 KST. 검수자: `column_source_quality`(AI). 작성자 역할은 `column_existing_drafts`다. 이 기록은 인간 핀란드어 원어민 또는 변호사의 승인 표시가 아니다.

최종 판정(R2): 아래의 필수 M01·M02와 선택 S01·S02가 모두 해결되었다. 새 SHA를 고정해 지정 변경만 있었음을 확인했고 공유 검사도 세 편 모두 exit 0 / FAIL 0이다. R1의 지적과 원래 SHA는 아래에 이력으로 유지한다.

배정된 이 검수 파일만 썼다. 원고, 검사기, `fi-author.md`를 수정하지 않았다. 커밋·배포·외부 전송은 하지 않았다.

## 고정한 원고와 확인 범위

경로: `/Users/son7/tseng-all-language-columns-20261025/batch02/src/content/columns-fi/`.

| 글 | 검수 시작 SHA-256 |
|---|---|
| 704-taiwan-arc-first-application.md | `ab3d0231a3f1bf8c22c7bf22ef48142b9d2e9eb72d0e422082bec6fb076b395d` |
| 705-taiwan-visa-residence-work-study-family.md | `63e662eaf77e6dabd9e9d6eb77a8b34f44f0faea277f0c0c46281bbda355c877` |
| 706-taiwan-arc-renewal-changes-reentry.md | `3c2a90f290762c4900e145983af1a45f0a36aef35663922ede77c0d6713d3ecf` |

FI 세 편의 frontmatter·FAQ·본문·출처를 전문으로 읽었다. 같은 세션에서 전문을 읽은 최신 EN/KO/ZH 9편과 `research/arc-source-facts.md` F01–F24를 대조했다. 이 검수 단계에서도 기준 commit `ef3b24e73d84968eea08ea9d58e991ccbbf83fa8` 대비 9편의 `git diff --exit-code`가 출력 없이 exit0임을 확인하여 앞서 읽은 원문과 동일함을 확인했다. facts의 현재 SHA-256은 `4776f60010172120e0812d8d552123aeb5c7cc0b467cb5306ca031a1e17c2145`다.

공통 editorial voice, 저장소 FRONTMATTER, COLUMN-VOICE-RULE, 공유 SENTENCE-VARIETY-RULE 및 LESSONS를 이 세션에서 전문으로 읽고 적용했다. 현행 FI 최근 3편은 `published: 2026-10-24`의 848·847·846이며 모두 전문을 읽었다. 날짜가 없는 구형 018 등을 최근 글로 취급하지 않았다.

공식 1차자료 확인은 공통 facts의 직접 확인·이전 조사 구분을 유지했다. 이번 FI 검수에서는 F23의 링크된 NIA 중국어 페이지를 새로 직접 열어 주의사항 7과 9를 대조했다. 창업가 NIA 348924 페이지(수정일2025-02-17)도 새로 열어 주의사항6의 `居留期限屆滿前三個月內`를 직접 확인했다. EN 비교 정본의 정확한 요약에서 생략한 선택 세부를 단순히 없다는 이유로 필수 수정으로 올리지 않았다.

## 필수 수정

### M01 — 705·706의 출국 중 심사 중단 출처 항목 번호

- 위치: 705 87행과 706 110행의 마지막 공식 출처 목록.
- 문제 문장: `kohta 5(7): poistuminen Taiwanista käsittelyn aikana.` 및 `kohta 5(7): lähtö hakemuksen käsittelyn aikana ja ehdollinen uusi hakemus.`
- 이유: 실제 링크한 [NIA 전문인재·가족 온라인 신청 안내](https://www.immigration.gov.tw/5382/5385/7244/7250/7317/%E5%B1%85%E7%95%99/httpscoaimmigrationgovtwcoa-frontendforeign-white-collar/)에서 출국 시 미계속 심사와 적격 재입국 후 재신청은 `申請須知或注意事項`의 `(九)`다. `(七)`는 거류주소·서비스처소 변경 후 다음 날부터 30일 등록을 규정한다. URL은 맞지만 문장에 붙인 세부 위치가 다른 규정을 가리킨다.
- 수정안: 두 곳 모두 `huomautus 9` 또는 `kohta ”申請須知或注意事項” (九)`로 고친다. 나머지 출국·조건부 재신청 설명과 URL은 유지한다.
- 의미 보존: 본문의 F23 명제 자체는 정확하다. 지정 온라인 경로만 한정하고, 출국하면 심사가 끝난다는 효과 및 적격 재입국 후 재신청 가능성을 이미 유지했다. 이 수정은 근거 위치를 바로잡는다.

### M02 — 706 사업 종료 후 별도 거류 신청의 3개월 창구

- 위치: 706 53행, 창업가·Gold Card 단락의 둘째 경로.
- 문제 문장: `Yritystoiminnan loppumisen jälkeisen erillisen oleskelun jatkamisen hakuaika on kolme kuukautta ennen päättymistä.`
- 이유: `hakuaika on kolme kuukautta ennen päättymistä`는 신청 시점이 만료 정확히 3개월 전이라는 읽기를 허용하며, 무엇의 만료인지도 앞의 사업 종료와 겹친다. 정본과 F17은 해당 별도 경로의 신청 창구가 기존 거류 만료 전 3개월 이내임을 설명한다. 같은 단락의 계속 사업·Gold Card 4개월 창구는 `neljän kuukauden aikana`로 정확히 옮겼다.
- 수정안: `Yritystoiminnan päätyttyä erillistä oleskelun jatkamista haetaan nykyisen oleskeluluvan päättymistä edeltävien kolmen kuukauden aikana.`
- 의미 보존: 사업이 계속되는 적격 창업가의 4개월 경로와 사업 종료 후 별도 3개월 경로를 그대로 구별한다. 만료 뒤 유예를 만들거나 모든 ARC의 일반 창구를 변경하지 않는다. [해당 NIA 창업가 안내](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/348924/) 링크를 유지한다.

## 선택 문체 수정

### S01 — 706 소제목에서 만료의 대상을 명시

- 문장: `Oleskelun peruste päättyy ennen kortin voimassaoloa`.
- 이유: `ennen kortin voimassaoloa`는 문자 그대로 카드의 유효기간 자체보다 앞이라는 어색한 표현이다. 해당 본문은 카드 유효기간이 끝나기 전에 거류 근거가 없어지는 상황을 정확히 설명하므로 본문의 법률 오류로 분류하지 않았다.
- 수정안: `Oleskelun peruste päättyy ennen kortin voimassaolon päättymistä` 또는 더 간결한 `Oleskelun peruste päättyy ennen kortin vanhenemista`.
- 의미 보존: 기존 ARC 만료 전 사유 소멸과 NIA 취소 의무·계속 거류 예외를 변경하지 않는다.

### S02 — 706 마지막 NIA 문의 문장의 반복

- MONOTONY: 끝맺음 반복 — `Jos uusi kortti ei ehdi valmistua, NIA:lta selvitetään, millä asiakirjalla suunniteltu paluu voidaan tehdä.` — 앞 문단의 같은 행동을 반복하지 않고 실제 귀환일 대조로 마치는 방향.
- 이유: 93행은 이미 `Jatko- tai korvaamishakemuksen ollessa kesken NIA:lta selvitetään ennen lähtöä, mikä asiakirja kattaa suunnitellun paluun.`이라고 말한다. 링크 안내 문단을 사이에 두고 거의 같은 NIA 문의를 다시 말한다.
- 수정안: 마지막 문단의 둘째 문장만 삭제하고 `Paluupäivää verrataan passin, oleskeluoikeuden ja paluuluvan voimassaoloaikoihin jo ennen lähtöä.`로 닫는다.
- 의미 보존: 실제 문의 행동, 접수증·카드 사진의 한계, 유효 여권·거류·재입국허가, APRC 예외와 F23 출국 효과는 앞 문단에 모두 남는다. 수치 통과용 사실 삭제를 제안한 것이 아니다. 한 편의 선택적 정리이며 전면 단조로움 반려 판정은 아니다.

## 의미·조건 대조 결과

| 항목 | 판정과 확인한 문구 |
|---|---|
| F01–03 / 704·705 | 704는 국내 비자 발급일30일을 첫 문단으로 삼고, 입국+거류허가 다음날30일을 둘째 문단·표·FAQ에서 분리했다. Gold Card 통합증명 예외와 방문자 적격조건을 보존했다. 전문인재 직접 경로의 취업허가 OR 면제 및 NIA 승인 후 ARC도 유지했다. |
| F04 / 705 | `joko Taiwanissa ammattityötä tekevä ulkomainen ammattilainen tai ulkomainen erityisasiantuntija`; 이어 `Kummallakin ... hyväksymä oleskelu tai pysyvä oleskelu`로 두 범주와 공통 승인조건을 분리했다. 전문업무 조건을 모든 특정전문인재에 확장하지 않는 문장도 있다. 가족은 배우자·미성년·장애로 자립불가 성년자녀 및 가족의 무비자/방문비자 조건으로 한정했다. |
| F05 / 705 | `viisumi, joka sallii vähintään 60 päivän oleskelun`은 비자 유효기간이 아니라 허용체류기간이다. 대만 배우자의 대만 거주 AND 호적, 제한표시 부재, 일부 법정 초청자 제외를 유지했다. 제외대상의 전체 열거 부재는 EN의 정확한 요약과 같아 필수 추가 요구를 하지 않았다. |
| F06–08 / 704 | ARC사진2년, 재직·재학증명 최근1개월, 입학/등록전후, 현학기등록 또는학생증, 일반적인 초청자 신분/거류자료를 유지했다. 인증 의무와 번역 요구 가능을 구별했다. 배우자는 대만 거주+호적, 첫 카드최장1년, 동행과 혼인등록을 함께 설명한다. BOCA사진6개월 비교가 없는 것은 기존 EN의 정확한 범위이므로 추가를 강제하지 않았다. |
| F09–12 / 704 | NT$1,000/연과1년미만연단위, NT$2,200가산, 僑生 한정 감면. 일반3년과특정5년·허가다음날, 일반10근무일/학생심사5근무일 및보완후재기산. 학생납부승인후5근무일·납부후3근무일수령·전자6개월이하를 각각 보존했다. 전문인재 가족을 `ehdot täyttävät`로 한정한 요약은 모든가족으로 확대되지 않는다. |
| F13–14 / 705 | 어학4개월+추가최소3개월, 주중15시간, 승인된 결석 포함1/4 한도, 학생의 일반적 무비자/도착비자/타목적비자전환 제외를 유지했다. 거류와 노동권한, 대만호적국민배우자의 면제와 특정/고급전문인재배우자의 직접신청을 구별했다. |
| F15–17 / 706 | 주소/서비스처소 변경다음날30일, 사유변경발생일30/15일, 일반만료전3개월은 정확하다. 계속사업·GoldCard4개월도 정확하다. 종료사업3개월의 창구 표현만 M02로 수정 요청한다. |
| F18–21 / 706 | 사유소멸 시 NIA취소 의무와 예외 승인조건 보존. DV는 대만거주·호적·폭력때문이혼·재혼없음으로 한정. 일반 자녀·쟁송·산재 예시는 `kunkin perusteen ehdot`와 함께 정확한 요약으로 남아 있어 전부 열거하도록 요구하지 않았다. 전문6개월+1회총1년·졸업1년+1회총2년, 만료전신청·종전만료다음날을 유지했다. 졸업자 취업면제는 대만associate이상·신규졸업·NIA승인연장중으로 한정했다. |
| F19 / 706 | `<30일` AND 원래사유계속, 처벌후재신청, APRC계산1년공제. `uuden luvan ja sen keston ratkaisee NIA`가 있으므로 기존허가자동연장 부정이 새 승인기간까지 금지하는 뜻이 되지 않는다. |
| F22 / 706 | 출국전재입국허가, ARC기간연동과말소, APRC+유효여권 예외를 본문에서 명시했다. FAQ의 일반질문 답에 APRC예외를 다시 전부 적지 않은 것은 본문과 충돌하지 않아 추가하지 않았다. |
| F23 / 705·706 | 지정 온라인 경로의 `käsittely päättyy`, 재입국후 `jos ... ehdot täyttyvät`를 유지했다. 일률적 출국금지나 재입국보장도 명시적으로 부정한다. 내용은 통과, 출처 세부번호만 M01이다. |
| F24 / 704 | `15 kalenteripäivän ... tiedoksiantoa seuraavasta päivästä`; 해외·대륙·홍콩·마카오에서 부족/잘못된서류를 받아야 할 때3개월, 보통기한대체, 미완전보완시기각을 명시했다. 체류자가 단순히 해외에 있으면3개월이라고 넓히지 않았다. |

## 독해·문체와 최근 3편 비교

새 FI704는 국내 비자 발급일부터의 기산이라는 행정 사실, 705는 입학서만으로 무비자 학생 전환이 되지 않는 구체적 결과, 706은 이사 후 기록 갱신에 대한 질문으로 시작한다. 정형 가상 장면은 없다. 같은 배치에서 하나의 도입형식이 절반을 넘지 않는다.

- 848: `Kolme kuukautta voi kulua jo Suomessa...`라는 숫자·상속기산 도입, `Pankin lomake ennen Suomessa allekirjoitettavaa valtakirjaa`라는 문서순서 소제목, 발송기록과 상속권 인지일로 닫는다. 새704도 날짜를 다루지만 대상·기산일·구조가 동일한 문장 틀은 아니다.
- 847: `Voiko suomalainen aloittaa ... heti viisumivapaan saapumisen jälkeen?`라는 국적·취업 질문, `Puolison työ ja lasten oleskelu`, 가족별 일정표 끝맺음이다. 새706의 질문은 주소등록이며, 새705는 국적을 가정하지 않고 F04를 더 명확히 나눴다. 기존847의 표현을 현재법의 근거로 사용하지 않았다.
- 846: 가상의 핀란드 제조사·대만유통사 장면, `Varasto luovutetaan eräkohtaisesti`, 마지막주문 인도 책임으로 닫는다. 새3편은 장면을 꾸미지 않고 구체 신청자료·조건을 설명한다.

첫 두 문단 삭제 시험:

- 704: 국내발급기산/기관정의와 입국다음날기산/방문자적격이 각 문단의 정보다. 도입을 제거하면 두 경로의 대비가 사라진다.
- 705: 일반학생 전환불가와 전문인재 직접경로를 첫 문단, 국적·여권·담당공관을 둘째에 둔다. 글 전개를 예고하는 문장이나 독자 국적 추정이 없다.
- 706: 주소변경기산·현재카드만료와의 독립성 뒤에 사유소멸·취소·법정예외·날짜자료를 둔다. 첫 두 문단을 관용적 인사말처럼 삭제할 수 없다.

`sinä` 직접호칭과 일반절차 서술이 섞여도 존칭/비존칭의 불필요한 왕복은 없으며 대체로 자연스러운 핀란드어다. 법명·약칭 및 `oleskelu`/`työlupa`가 의미상 구별된다. 본문S01의 소제목 누락어와S02의 반복을 선택 정리로 남긴다. 가짜 개인경험·인간변호사 작성주장·핀란드어 상담약속은 없다.

§5 자기점검: 짧은 문장2개이상 각편 실제 존재(704 `Aika alkaa viisumin myöntämispäivästä.` 등;705 `Allekirjoitettu työtarjous ei ole työlupa.` 등;706 `Molempien ehtojen on täytyttävä.` 등). 문단 시작과 문장길이가 다양하고, 인용 없는 자료보관·준비 문단도 있다. 법적 부정은 배제조건을 보존하는 문장이므로 단조로움을 없앤다는 이유로 삭제하지 않는다. 명령형 체크리스트 제목·장식용굵은강조·본문H1 없음. 706의 마지막 반복은 S02로 구체적으로 기록했다.

## 실제 기계검사와 링크·메타데이터

실행 명령:

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check src/content/columns-fi/704-taiwan-arc-first-application.md src/content/columns-fi/705-taiwan-visa-residence-work-study-family.md src/content/columns-fi/706-taiwan-arc-renewal-changes-reentry.md --lang fi
```

| 글 | 문장수 | 평균 | CV | short | run3 | opener_rep | cite_end | cite_para | contrast / caveat / q | 결과 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 704 | 69 | 11.0 | .457 | .391 | .030 | .050 | .029 | .350 | 0 / 0 / 1 | exit0 / FAIL0 |
| 705 | 75 | 10.8 | .479 | .333 | .137 | .000 | .000 | .455 | 0 / 0 / 1 | exit0 / FAIL0 |
| 706 | 87 | 11.6 | .454 | .310 | .071 | .000 | .000 | .500 | 0 / 0 / 2 | exit0 / FAIL0 |

세 편 모두 `OK — no variety limit violated`. 이 수치는 법률적 의미나 인간 원어민 승인이 아니다. 미지원 locale을 en/ko 등으로 대체하거나 도구를 바꾸지 않았다.

실제 Node24/gray-matter 파싱 결과: FAQ 각3, audience `[fi]`, internalauthor `legal-ai-assistant`, topic `visa`, published/lastmod `2026-10-25`. 본문H1·굵은강조0. 원문 이미지 파일은 release public에 존재한다. EN 공식 URL 누락0, 본문→끝목록 누락0, 끝목록에만 있는 공식 URL0. 내부링크는 batch02 FI3편 또는 현재 EN APRC 실제경로에 대응하고 후자는 영어임을 표시한다. 공개 배포 여부는 이 검사로 주장하지 않는다.

## 원고 불변 확인 및 다음 단계

위 시작 SHA를 고정한 상태로 전부 읽고 도구검사를 실행했다. 기록 저장 후 SHA-256을 다시 계산하여 세 편 모두 위 시작값과 동일함을 assert로 확인했다. 작성자의 동결 확인 메시지도 같은 SHA 세 개를 제시했다.

작성자는 M01·M02를 고친 후 해당 원고의 새 SHA와 공유 `--lang fi` 결과를 제시하면 된다. S01·S02는 새 법률정보를 추가할 필요가 없는 작은 문체 제안이다.

## R2 — 지정 수정 후 재확인

2026-10-25, 작성자가 root 배정으로 수정한 결과를 읽기 전용으로 대조했다. 새 선택 확장 지적을 추가하지 않았다.

| 글 | R2 SHA-256 |
|---|---|
| 704 | `ab3d0231a3f1bf8c22c7bf22ef48142b9d2e9eb72d0e422082bec6fb076b395d` |
| 705 | `c7f7d229342f780b467d09fc794f7c350dc61a65f7a11ad2b6d2f29fd0152efd` |
| 706 | `9d8378231e7c024bfa49689cada7a7406837b5afed540fab217bd99f0e5a97ea` |

- M01 해결: 705·706 모두 출국 중 심사 중단 출처가 `huomautus 9`로 바뀌었다. URL과 해당 본문 효과·조건은 그대로다.
- M02 해결: `Yritystoiminnan päätyttyä erillistä oleskelun jatkamista voi hakea nykyisen oleskeluluvan päättymistä edeltävien kolmen kuukauden aikana.`를 확인했다. 현재 거류허가 만료 전 3개월 동안 신청할 수 있다는 `voi hakea`가 정확하며 계속 사업·Gold Card 4개월은 변하지 않았다.
- S01 해결: 소제목은 `Oleskelun peruste päättyy ennen kortin vanhenemista`로 명료해졌다.
- S02 해결: 마지막 NIA 문의의 중복 문장만 삭제되었다. 그 앞의 실제 문의 절차·귀환 문서·APRC 예외·F23는 남았다.

파일을 쓰지 않고 메모리에서 이 네 수정만 역치환해 R1 SHA를 재계산했다. 705·706 모두 원래 SHA와 정확히 일치했다. 704는 처음부터 동일하다. 따라서 지정 수정 이외의 원고 변경이 없음을 확인했다.

공유 `--lang fi`를 실제 다시 실행했다. 704·705 수치는 R1과 같고, 706은 sentences86 / mean11.5 / CV.456 / short.314 / run3.071 / opener_rep0 / cite_end0 / cite_para.500 / contrast0 / caveat0 / q2다. 세 편 모두 `OK — no variety limit violated`, exit0 / FAIL0. 새 SHA와 결과는 작성자가 전달한 값과도 일치했다. 원고·검사기·작성자 리뷰는 수정하지 않았다.
