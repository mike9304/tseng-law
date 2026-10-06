# notes — en 136 W3 TRIM

## 읽은 것·적용한 기준
- WO-W3-TRIM.md, POLICY v1.1(숫자 목표 없음), EDITORIAL-VOICE, SENTENCE-VARIETY-RULE, LESSONS, wave3-fable.md "en-136", classify-r1 136절, factcheck/en-136.md.
- `fixspec/136.md`는 없음(fixspec 디렉터리에 005–018·099·109·110·122·194·201만 있음). 리드 메시지대로 사실 정정은 factcheck 결과(법적 오류 0, O1 = 누계 수치)를 따랐고, O1은 누계 삭제로 해소.
- 사실 정정이 필요한 문장은 새로 쓰지 않았다. 미열람 법령·FR 본문은 이번에 열지 않았다(factcheck가 2026-10-06 대조 완료; 나는 URL 보존과 문장 대응만 확인).

## 본문 길이 (출처 목록 앞, 링크는 문구만 센 단어)
- 원문 3,603 visible words(공백 토큰 3,587 — Fable 측정 3,587w와 같음) → 초안 2,996(공백 토큰 2,985). −607w, 약 17%. 프런트매터 FAQ3 약 75w는 이 수치에 불포함.
- 항목별: 누계(L37·L39) −73w · L41 CNA 문장 −20w · 미국 규칙 L87·89·91 → 1문단 −232w · 미국 벌칙 L97 −27w · Affiliates L105 −96w · Nanjing 절 −142w(+제목) · FAQ3 삭제.
- Fable의 "25–30%"에는 못 미친다. plan이 짚은 삭제를 전부 실행한 결과이고, POLICY v1.1 때문에 숫자를 맞추려 plan 밖 문장을 지우지 않았다. 후속 후보(plan 밖, 리드 판단 몫): L41 전체(≈67w, 분류에 쓰이는 사실이라 남김), L51(L47과 "same structure" 중복, ≈60w), L123 일부.

## read_time 계산
- 공식(en 칼럼 테스트의 공식): `Math.ceil(visibleEnglishWords / 200)` — `columns-en-investment-004.test.ts`·`columns-en-labor-009.test.ts`의 `countVisibleEnglishWords`(링크는 문구만, 제목 `#`·인용 `>`·목록 마커·`*_` 제거, 정규식 `/[A-Za-z0-9]+(?:[.’'-][A-Za-z0-9]+)*/g`로 센 단어)를 프런트매터 뒤 본문 중 `## Sources` 앞까지에 적용(제목 H1·연락처·"More columns" 링크 포함).
- 결과: 2,996 ÷ 200 = 14.98 → ceil 15 → "15 min read". 원문 값(수기)도 15였으나 원문을 같은 공식으로 재면 3,603 ÷ 200 → 19였다. H1을 빼도(−13w) 15가 유지되고, 2,801–3,000w 범위면 15이다.
- 참고: POLICY의 "en 약 230 words/min"이 아닌 리드 지시의 200 wpm을 썼다(230이면 14).

## 검사 결과
- URL: 원문 36종 → 초안 29종. 잃은 7종은 전부 삭제한 주장의 것이다(ledger.md 표): udn 2025-12-19, CNA 2025-11-17, 90 FR 42321, Reuters Busan, Reuters TSMC, Miller Canfield, eCFR 15 CFR 6.3. 새 URL 없음. 본문 링크가 출처 목록에 없는 것 2종(Foreign Trade 시행규칙 §16·§18 개별 링크)은 원문부터 그랬고 같은 법령 전문 링크가 목록에 있어 건드리지 않음.
- 굵은 글씨 `**`·`<strong>`·`__` 0건. 프런트매터 FAQ 2개(이전 3개), 남은 답은 본문 L29–L31·L45–L53·L95와 일치. H2는 8개→7개(Nanjing 절 삭제). 외부에서 삭제 H2의 앵커를 가리키는 곳은 repo `src`에서 찾지 못함.
- `variety_metrics.py check --lang en`: 원문 FAIL 2(short_share 0.071, top_opener_n 14>5) → 초안 FAIL 2(short_share 0.076<0.08, top_opener_n 13>4: 문단 수가 줄어 한도가 4로 내려감). 둘 다 원문부터 있던 것이고, WO 금지(짧은 문장 비율을 올리려고 쪼개지 않기)에 따라 TRIM 단계에서 손대지 않았다. 문체 리뷰 단계 과제. cv 0.504 → 0.506, contrast 1 유지.
- 이 글의 본문을 고정한 repo 테스트는 찾지 못했다(grep: `native-locale-columns.ts`는 파일명만, `semiconductor-board-columns.json`은 slug만, `column-embeddings-pending.json`·RELEASE-MANIFEST는 슬러그/매니페스트). 임베딩 재등록 1건(en-136)이 필요하다는 점만 Fable 절차 메모와 같다.

## 판단이 애매했던 곳 (리드 결정 요청)
1. 2026 갱신 출처 2건 유지. Fable 메모는 "출처 3건도 함께 삭제"였으나, 남긴 문장 "2026 갱신이 이름을 제거하기도 했다"의 근거가 4/1·6/9 발표뿐이라 두 건은 남기고 숫자 설명만 뺐다. udn 213개 건만 삭제. 리드가 "양방향" 문장을 숫자 없이 출처 없이 두기로 하면 L137·L138과 L39의 두 링크를 지우면 된다.
2. L41의 CNA 문장·출처 삭제(Fable "선택" 항목). 같은 세 분야를 EDN 문장이 이미 말한다는 이유. 되돌리려면 L39 대체문 뒤 L41 끝과 출처 L142 복원.
3. Xunwei Technologies 항목(factcheck에서 맞다고 확인됨) 삭제. Fable의 삭제 조건("검증 못 하면")은 충족하지 않지만, 한 문단으로 합치는 plan과 L33 한정에 비춰 개별 항목 세부로 보고 뺐다.
4. 미국 벌칙은 삭제가 아니라 1문장 유지(형사 상한만 수치 유지). 지우고 싶으면 마지막 문단과 4819 출처 항목 삭제.
5. product test·end-user test 정의 문장 삭제. 대신 connectors 2번 한 절로 두 테스트의 대상만 말한다. 이 절이 새 설명으로 읽힌다고 판단하면 "the rule has a product test and an end-user test"로 줄여도 된다.
6. 시간 의존 잔여: L103·L107·L123·H2 "the suspended Affiliates Rule"은 2026-11-10 이후 낡는다(L103은 "규칙이 정한 일정"을 서술하는 문장이라 거짓이 되지는 않음). 본문에 "as of" 기준일 문구는 없고 푸터가 "Sources checked October 3, 2026"라고 한다. 이번 초안은 lastmod만 2026-10-06으로 올렸고 출처 확인일은 그대로 둠(재확인 주체는 factcheck 레인).
7. title·summary는 Affiliates Rule·Nanjing·누계를 언급하지 않아 삭제분과 충돌 없음 → 그대로.

## 하지 않은 것
- repo·Studio(.parked 등) 편집 없음. title·summary·seoTitle·date_display·published·featured_image* 변경 없음. 다른 언어판 해당 없음(en 단독 칼럼).
