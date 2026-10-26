# SL6 독립 R2 — 채택된 선택2건의 표적 종결

2026-10-26T09:38:50.437998+00:00. 검수자 column_live_audit의 모델 기반 독립 검수이며 사람 원어민·변호사 감수 표시는 아니다.

O01/O02를 닫는다. 남은 필수0·선택0. 이번 작업은 R1의 선택 명료화를 root가 채택한 뒤 변경 부분만 재확인한 것이며, 기존 문장을 필수 법률 오류로 재분류하지 않았다. 원고·저자 기록·R·공유 도구는 수정하지 않았다.

R1 보고서 `reviews/sl-independent.md` SHA `a52d61c75547b82f1ba3d9a8b27341cd354b90622610a635dc3173bb3109a505`, R1 manifest `d62b58291c2ace2cc922c5e08ad31e83fcab0adcfb1618780859c58eff65419f`, findings `be52cffada336d5cf1e0e714c041c17f026e4747964ed7383a28586db0290b85`는 바이트 그대로 유지됐다. 이번 저자 R2는 `4e806ec59848a86f353ba41aef9826351e9c5eed00cdc120ccc5d7fc4d6a2014`, 저자 manifest R2는 `9a1d4430dd97c12585a162d610e0f5230e3ccb1467bea2c05f6876050e2eb9fa`다.

## 실제 문장과 의미 보존

916 O01은 제안한 문자열 그대로다. 현재 문단은 양측의 투자 촉진 의향을 먼저 밝히고, 미국 측이 적절한 경우 대만의 핵심 분야 투자에 대해 미국 민간 파트너와 협력하고 적용법에 따라 금융지원을 고려하겠다고 설명한다. 개별 금융승인 아님·모든 협정 조항 발효 증거 아님이라는 다음 두 문장도 그대로다. 지원 대상의 국적을 슬로베니아어 독자에게 자동 적용하거나 지원금을 보장하지 않는다. 동결 USTR 공식 응답의 조건과 일치한다.

920 O02는 `Tudi pogodba z monterjem lahko začetek del veže na pridobitev potrebnih soglasij in določi, kdo nosi stroške, če je prošnja zavrnjena.`로 바뀌었다. 사적 계약의 착공을 필요한 동의와 연결할 수 있다는 조언과 거절 시 비용 배분이다. 뒤의 `Tak dogovor ne nadomesti odločitve pristojnega organa stavbe.`를 보존해, 계약이 공동체의 권한 있는 기관 결정을 대신한다는 의미가 생기지 않는다. 모든 충전기에 새로운 획일적 절차를 만드는 문장도 아니다.

두 현재 문단과 앞뒤 문맥을 직접 읽었다. 916은14/30/5/12 단위의4문장,920은21/8/8 단위의3문장이다. 현재 전체252분절 중249개는 R1과 동일하고 새3문장은 이 두 문단 안에 있다. 긴 조건을 독립적인 짧은 결과와 연결하며 §5의 도입·질문·결말·기존 사실관계를 바꾸지 않았다. MONOTONY: 새 반려 사유0 — 두 변경이 과도한 같은 시작이나 기계적 문장 분할을 만들지 않았다.

## 독립 검증 근거

`sl-independent-r2-verify.py`가 실제 현재파일에서 두 after 문자열을 해당 offset으로 되돌려 원래6SHA를 모두 재현했다. 원래 문자열을 다시 적용해 현재6파일과도 바이트 일치했다. 저자의 reverseExact 값만 신뢰한 것이 아니다. 두 치환은 R1 findings의 before/after와 정확히 같고 다른 네 파일은 처음부터 바이트 불변이다.

6편의 frontmatter/FAQ17 바이트, URL 값·순서, 숫자 토큰·순서가 R1과 같다. 실제 저자의916/920 CLI 기록은 현재SHA·공유4파일SHA와 연결되어 두 편 exit0/FAIL0, CV.470/.478이다. 구조 오류0 기록도 영향2편에 연결된다. 나머지4편은 같은SHA의 R1 검사 근거를 재사용했다. 검수자가 새 전수 variety/구조 검사를 실행하지 않았다.

영향2편의 보관 ReactMarkdown HTML을 독립 파싱해 현재 Markdown 문단·CLI 배열의 합친 문자열과 비교했고 모두 같았다. 새 렌더를 실행한 것으로 표시하지 않는다. 원고·저자·R1 기록·입력·이미지·도구·R2 근거 56개 경로의 SHA가 현재 실제 바이트와 일치했다.

| 원고 | 현재 SHA256 | 이번 의미 확인 |
|---|---|---|
| 915 | `649eaa92c45bf3f3a708805011aa7f28f88553c70b8dd13985e03b2c4f964f0f` | 동일 SHA R1 재사용 |
| 916 | `a6589e8395d4f32408c1c194a26f54a9b87f5aaa944db14e6a1f7f1d64858957` | 선택 변경 문단 직접 확인 |
| 918 | `78ddaf97bff0d6eb30dad29ed60be5292363744fefd3eb0266ff8316ced5f858` | 동일 SHA R1 재사용 |
| 919 | `cbc5c8726046e43b8438f4c4147938cb3c53806a6c234e9c6d6f2f3ba991a98c` | 동일 SHA R1 재사용 |
| 920 | `dbe66f18a0c146e1f6dbfba0addbf78585cc0c6be8c5d246a5d04bd0cb2bb55e` | 선택 변경 문단 직접 확인 |
| 921 | `96ce40ffc9daf2c997e2698a0c6ba8ef9ebc3a9a5f253313c9053bae0f5a9281` | 동일 SHA R1 재사용 |

독립 proof: `checks/sl-independent-r2-proof.json`, SHA `76e9c7b6b6813b276cbc730e6a5036bdf57ec06a697e16b1772afa753ef75c48`. 원R1 전문 검수는 유지하며, 이번에는 선택2건만 재개했다. 사람 원어민/법률 승인, 새 공식 HTTP, 공개 브라우저·모바일·카드·JSON-LD·feed·배포 검증은 범위가 아니다.
