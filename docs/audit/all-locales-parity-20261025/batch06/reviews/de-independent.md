# DE6 독립 의미·문체 검수 R1

판정: REQUEST_CHANGES — 필수 2건, 선택 2건. 대상은 아래 여섯 SHA의 원고다. 독일어 본문·메타데이터·FAQ17개, 현재 정본6개와 사실표를 독립 대조했으며 원고는 수정하지 않았다. 이 보고서는 인간 원어민 또는 변호사의 감수 승인이 아니다. 수정 후에는 실제 변경 부분과 새 SHA를 대조해야 한다.

## 필수 수정

M01 — 921 summary, 3행: `Das Gericht unterschied bereits verwendete Spielchips von ungenutzten bezahlten Punkten.`

- 이유: `bereits verwendete`는 남은 칩 자체가 이미 사용되었다는 사실을 요약에 추가한다. 정본과 사실표 921-C2는 남은 금화의 계약상 기능을 대결용 칩으로 구별한다. 제공된 공식 판결 반환문 L4170–4179 역시 잔여 포인트 부존재와 금화의 칩 기능을 이유로 들며, 단순히 모든 잔여 칩이 이미 소진·사용되었다는 요건으로 판단하지 않는다. 그 앞 L4035–4036의 이미 사용했다는 문장은 사업자 항변 부분이며 법원의 이유와 구별해야 한다.
- 수정안: `Das Gericht unterschied Münzen, die als Chips für Spielpartien dienten, von ungenutzten bezahlten Punkten.`
- 의미 보존: 청구액243.548 NT$, 청구 불인용, 다른 게임으로 일반화하지 않는 한계, 환급 대상 구별을 유지한다. 본문과 FAQ는 이미 기능을 정확히 설명하므로 요약의 해당 한 문장만 수정하면 된다.
- 직접 대조한 사건 근거: research/recheck/zh921-government-pdf-selected-lines.txt의 법원 판단 L4093–4213, 특히 L4170–4179. 이는 연구 묶음의 실제 반환문을 재독한 것이며 새 PDF 전체 열람은 아니다.

M02 — 920 본문33행·출처62행: `Apartment Building Management Act`.

- 이유: 공식 영문 법령명을 사용하는 자리인데 MOJ D0070118의 실제 영문 표제와 다르다. 이번 검수에서 [공식 영문 법규 화면](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=D0070118)을 새로 열어 `Condominium Administration Act Building Administration Division` 표제와 제6·11조를 확인했다. 기존 중국어 법령 링크와 조문 내용은 올바르다. 필요한 수정은 법적 조건 변경이 아니라 법명 식별의 정확성이다.
- 수정안: 본문 링크명을 `Artikel 11 des taiwanesischen Gesetzes über die Verwaltung von Wohnanlagen (公寓大廈管理條例)`로, 출처 목록을 `Taiwanesisches Gesetz über die Verwaltung von Wohnanlagen (公寓大廈管理條例), Artikel 6`로 통일한다. 이는 설명적인 독일어 명칭이며 공식 독일어 번역이 존재한다고 주장하지 않는다. 제11조 링크는 그대로 둔다.
- 의미 보존: pcode D0070118 및 flno6/11, 소유자회의/관리위원회의 구별, 단지 규약15조와 전국 법령의 구별, 제6조 제1항 제4·5호 및 제3항의 조건은 전부 유지한다.
- 새 조회 증거: checks/de-independent-official-name.json. 다른 법원 자료까지 새로 조회한 것으로 표현하지 않는다.

## 선택 문체 제안

S01 — 916 40행: `Hinsichtlich 246 Anspruchstellern hob der Gerichtshof ...`

- 이유: 표준 문어의 격과 수식 관계를 더 명확하게 만들 수 있다. 현 문장도246명 부분의 파기환송을 뜻한다는 점은 명료하다.
- 수정안: `Hinsichtlich der 246 Anspruchsteller hob der Gerichtshof ...`
- 의미 보존:246명 관련 결정 부분의 취소·환송을 유지하고262명 관련 상고기각 문장은 건드리지 않는다. 이 선택 문체만을 이유로 필수 반려하지 않는다.

S02 — MONOTONY: 추상적인 강조 — 916 34행 `Der Zusammenhang zählt.` — 같은 문단이 실제로 확인할 질문으로 시작하도록 조정.

- 이유: 이 짧은 문장은 새 사실 없이 연결의 중요성을 강조한다. 뒤의 수신자·지시·자금 이동 설명은 구체적이어서 해당 문장만 개선하면 충분하다. 전편의 반복 도입이나 법률 조건 결함으로 평가하지 않는다.
- 수정안: `Wer erhielt den Bericht?` 이후 `Aus dem Verteiler eines Berichts kann hervorgehen ...`는 유지할 수 있다.
- 의미 보존: 수신자 목록에서 인지 범위를 확인할 수 있다는 가능성, 운영 지배 및 후속 송금 승인과 함께 읽는다는 실무 방향을 유지한다. 실제 수신자를 새로 만들어 넣지 않는다.

## 법률 조건과 FAQ 대조

| 글 | 독립 확인 결과 |
|---|---|
|915|금전→공기→공기 권고·기관 거절→금전의 순서,44.417.150 NT$ 판정 취소·그 사건 확정, 원심의 적용법 이유 정정이 모두 있다.85-1은 공사 OR 기술서비스, 권고 OR 안, 기관의 부동의 때문에 불성립이라는 연결을 유지한다.40(1)(2)는 사건상 중재합의 부존재만 정확히 요약했으므로 일반 조항의 다른 사유를 추가할 의무가 없다. 별도 중재합의 가능성과 모든 금액 수정이 새 분쟁은 아니라는 FAQ2개도 보존됐다. ITA는 미국 공급자 관련 계획으로 한정된다.|
|916|소유만의 책임이 아닌 인지·지배·미조치/미고지·자산 이전의 행위 연결,246명 부분 파기환송과262명 부분 상고기각을 구별한다.154조는 법인격 남용→특정 채무→명백한 변제 곤란 AND 중대성·필요성의 누적 조건이다. 현행154를 과거 사건의 유일한 근거로 소급하지 않는다. FAQ3개와 USTR의 미국 관련 조건부 지원 의향·적용법 단서가 유지됐다.|
|918|사용허가 취득부터 사건4개월·현재6개월의 통지기간을 명시한다.2월23일 서신,7월 미완성 상태,8월 출입,11월5일 지급과11월28일 문서상 인도를 구별한다. 지급·서류 협조 의무와 별개 사실 평가를 유지하고,6개월을 모든 인도의 완료 기한으로 만들지 않는다. CBC2026년9월18일 시행본의 과거 사건 소급을 부정한다. FAQ3개도 같은 범위다.|
|919|공무원 원처분·복심결정 취소,상소 가능 및 복직/전부 무혐의 미확인이 있다. 민간 사용자법과 사건을 분리한다. 신고 인지 후 보호·조사 의무, 신고인의 뜻에 따른 조율 가능, 불성립 시 조사 속행을 보존한다. 본문의 `geht die Untersuchung weiter`는 의무 설명 문맥과 FAQ의 `muss`에 연결되며 조사 중단 재량을 만들지 않는다. FAQ3개도 보호와 청취를 양립시키며 결과 보장을 하지 않는다.|
|920|전용 주차공간과 공용 벽·천장·전력함을 구별한다. 법11조 소유자회의와 단지 규약15조의 위원회 허가 AND 전력회사 검사를 분리한다.6(1)(5) 위반과 협의 후 계속된 위반을6(3)의 법원 처분 청구 가능성에 연결한다.6(1)(4)는 이 사건에서 충족되지 않았다는 법원 판단으로 적었다. 잠금·정지는 당사자 주장과 가정적 판단이며,9월30일 경과·케이블 트레이 보조 범위·확정 미확인을 유지한다. FAQ3개는 같은 범위다. 법명 표기는 M02 대상이다.|
|921|청구액243.548 NT$가 지급액으로 바뀌지 않았다. 환급 대상의 기능 구별, 계약종료 인정≠모든 선행 제재 적법,현재규범2023년 시행과2021년 판결을 구분한다. 포인트 OR 게임비용,필요비용 공제,종료부터30일 반환 OR 쌍방 합의 방식을 같은 문장으로 정확히 연결했다. 시작후7일·언제든 종료·최소30일보존·신청접수후7일제공이 각각 남았다.2025년 최초 소비자신고 유형2위와 전년대비 감소를 뒤섞지 않는다. FAQ3개는 정확하며 요약만 M01 대상이다.|

여섯 원고의 독자는 독일어 독자이며 국적을 독일로 가정하지 않는다. 대만 법률을 독일·오스트리아·스위스 법률로 치환하거나 미국 자료의 지원 자격을 독일어권으로 확장한 문장은 없다. 사무소의 신규 상담 언어, 사건 수행 이력, 변호사 자격이나 결과 보장을 추가하지 않았다.

## 문체와 실제 경계

R의 최근 DE704–706 전문을 읽고 첫 두 문단·소제목·실질 결말을 비교했다. 최근 세 편의 숫자 기한·업무 질문·ARC 만료 사실로 시작하는 구조를 새 여섯 사건에 복사하지 않았다. 각 첫 두 문단은 사건 사실·절차 단계·판결 범위 또는 날짜를 담아 삭제 시 정보가 줄어든다. 새 글의 시작은 판정 취소, 실사자료의 증거 기능, 은행 요구 당시 미완성 상태, 처분 사전 공표, 배선 경로, 청구 금액에 각각 초점을 둔다. 사실 중심이라는 공통성은 있으나 같은 문장 틀이나 가상 장면 공식의 반복은 아니다.

§5 항목별: 실제 DE 공유검사 통과; 공식 가상 도입 없음; 짧은 구간과 긴 설명의 호흡을 직접 확인; 문단 시작 최다 반복2회; 조문→예외 틀이3문단 연속하지 않음; 인용 없는 자료 설명·질문 문단 존재; 대비는 법적 구별에 필요한 범위; 실질 결말은 각 사건의 신청·보고서·통지·조사·동의·금전 사용 기록으로 끝남; 명령형 체크리스트 제목·장식 굵은 글씨·가공1인칭 없음; 금액·기간·조문·출처·허구 캡션을 유지함. 구조적 출처 날짜 고지는 같은 형식이지만 실질 결론과 구별했다. S02 외에 별도의 필수 MONOTONY 반려는 없다.

검사기가 실제 추출한281개 구간을 모두 읽었다. `25. und 26. Oktober 2026`, 개별 날짜의 서수점,44.417.150/243.548의 천단위점,85-1/22-2,중문 판결 식별자 및40 Absatz1 Nummer2가 잘못 분절되지 않는다. 표 직전 콜론 도입도 도구의 구간에 포함되므로281개 모두가 완결 문장이라고 주장하지 않는다. 본문 지표에서 제외되는 표·FAQ·메타데이터는 별도로 전문 대조했다. 문장 경계 파일은 checks/de-independent-boundaries.json이다.

| 글 | 추출 구간 | CV | 독립 실제 공유검사 |
|---|---:|---:|---|
|915|44|.462|exit0 / FAIL0 / WARN0|
|916|46|.481|exit0 / FAIL0 / WARN0|
|918|48|.451|exit0 / FAIL0 / WARN0|
|919|48|.486|exit0 / FAIL0 / WARN0|
|920|45|.461|exit0 / FAIL0 / WARN0|
|921|50|.462|exit0 / FAIL0 / WARN0|

Node24 PATH와 실제 `--lang de`로 실행했다. 도구·임계값·원고를 수정하지 않았다. checks/de-independent-variety.json에 각 실행 명령·출력·실제 exit·지표와 도구 SHA가 있다.

## 구조·출처·검수 한계

실제 R content-audit SHA3926a274bf544fed7e34339aa8b2636d41a4be79c0aaff898f46fc65595faf4b로 재검사했다. zh-hant4/en2의 정본 언어를 분리 지정하고, R 정본의 SHA가 동결 스냅샷과 같으며 overlay가 실제 DE 후보를 가리킴을 확인했다.6편 오류0,검토항목30개가 남았고 semanticStatus REVIEW_REQUIRED/publicationReady false를 유지했다. 링크 검사 통과를 법률 승인이나 공개 화면 검증으로 취급하지 않는다.

published/lastmod2026-10-26,date_display26. Oktober2026,audience de,내부 author,6개 원본 이미지 경로와 정확한 `Fiktive Szene`,현지화한 제목·요약·tags·read_time·alt·FAQ를 확인했다. FAQ 수는915만2개,나머지3개로17개다. 공식 URL 전부와 최종 목록·인라인 연결,기존 DE 내부 칼럼 및contact 경로를 대조했다. 이 독립검수에서는 이미지 픽셀을 다시 열지 않았으며, 이미지 경로·alt·허구 표시 대조와 저자의 실제6개 이미지 열람 기록을 구별한다.

정본6개,BRIEF,계약,사실표,source-register,문체정본·COLUMN-VOICE-RULE·SENTENCE-VARIETY-RULE·현재LESSONS 및 R AGENTS를 읽었다. 홈 editorial-voice.md는 여전히 없어 읽었다고 하지 않는다. 규칙 첫 출력의 생략 부분은 다시 읽었다. 판결/현행법/정책/사무소 설명과 실제25일 회신 재사용·26일 성공 또는 실패를 구별한 연구 한계를 유지한다. 이 검수의 새 외부 조회는 M02의 법명·제6·11조 확인이며, 여섯 사건 전체의 후속 절차를 조사한 것이 아니다.

최근 비교글 DE704는 저자가 de-inputs.json에 기록한 값 이후 변경된 현재본 e4088a2d7a48a32b0f63c7642fc4557e537c7db6d840daa69dec09329d200ce2를 읽었다. 이는 비교글의 현황이며 DE 후보6편이나 정본6편의 동결 변경이 아니다. checks/de-independent-inputs.json에 해당 차이와 다른 입력 SHA 일치를 남겼다.

## 동결 SHA

- 915-taiwan-public-contract-mediation-arbitration-same-claim.md: `cc4d26cb0501458b2565a864cbff0e09554eb9f67b2a74c64fd12a4e1fc79902`
- 916-taiwan-parent-company-pollution-liability-us-investor.md: `12f3083a5e0a2c95d049fe146d2a5b0969fe83d30a13db1c9ad4cca3f2ead751`
- 918-taiwan-presale-mortgage-notice-handover-judgment.md: `1309324c33e0e163f942615b9748179ffb644e6a3b5ef509a10980c601eac8ba`
- 919-taiwan-workplace-bullying-investigation-hearing-judgment.md: `deaa2b344be1dac722a028989f24a34cc911255737a671613bdf62c05de66c8f`
- 920-taiwan-apartment-ev-charger-common-area-judgment.md: `e854becb0216d2801578a9c3825b95d493c0a6b2227c72aad000f6629072b0ab`
- 921-taiwan-online-game-coins-refund-judgment.md: `239049f897c49cadc42b0d195ec6faff521a57391b8694c80317606d1095683c`

저자 보고서 SHA c72fbea9dbd203f833bfe2675a7a5d2806af9e7bfd97fa45d23511da272e5f0a와 저자 manifest SHA fc63fb3c1eca484e0f06074c8c213e72fc034520f72c75cebeedd13eb3e5e92d도 동일하다. 시작·종료 시 여섯 원고가 저자 동결 SHA와 일치한다. 다른 작업자 파일·R·shared는 수정하지 않았다.
