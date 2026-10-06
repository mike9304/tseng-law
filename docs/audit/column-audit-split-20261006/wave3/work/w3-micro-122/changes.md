# changes — column 122, ko / en / ja micro fixes (fixspec/122.md only)

원문: repo `src/content/{columns,columns-en,columns-ja}/122-taiwan-road-rage-reversing-into-tailgater-no-self-defense.md`(audit-split-fx). 결과 전체 파일: `ko.md`·`en.md`·`ja.md`(같은 디렉터리). 각 파일을 원문과 `diff`해 아래 변경 외에 바뀐 줄이 없음을 확인했다.
공통: `lastmod` "2026-10-03" → "2026-10-06". `read_time`은 그대로(ko "8분 분량", en "7 min read", ja "約9分") — 본문 변화가 어느 언어도 10% 미만(삭제 1~2문장, 추가 1~2문장). 「자료 확인일」 줄도 그대로 둠(ko·en·ja는 전체 재대조가 없었음; zh는 factcheck가 있어 draft에서 바꿨다 — zh notes 4).

## ko

1. F-027 (현행 표기 + 당시 상한 1문장)
   - before: `…차로에서 멈추는 운전자에게 6,000~36,000대만달러의 과태료와 번호판 6개월 압류(吊扣)를 정하고 있습니다([道路交通管理處罰條例 제43조](…flno=43)). 다만 두 판결문은 이 조항을 언급하지 않았고,…`
   - after: `…차로에서 멈추는 운전자에게 현행(2023년 6월 30일 시행) 기준으로 6,000~36,000대만달러의 과태료와 번호판 6개월 영치(吊扣)를 정하고 있습니다([道路交通管理處罰條例 제43조](…flno=43)). 이 사건이 있었던 2023년 1월 당시의 상한은 2만 4,000대만달러였습니다([道路交通管理處罰條例 제43조, 2021년 1월 20일 공포·2021년 6월 1일 시행본](…LawOldVer.aspx?pcode=K0040012&lnndate=20210120&lser=001)). 다만 두 판결문은 이 조항을 언급하지 않았고,…`
   - 새 문장은 fixspec 문구 그대로. 「현행(2023년 6월 30일 시행) 기준으로」는 fixspec의 「금액 앞에 현행(2023년 6월 30일 시행)」을 어순에 맞춘 것. 출처 목록에 항목 추가: `- [道路交通管理處罰條例 第43條, 2021년 1월 20일 공포·2021년 6월 1일 시행본](…) (이 사건 당시 시행 조문)`.
2. F-028
   - before: `번호판 6개월 압류(吊扣)` → after: `번호판 6개월 영치(吊扣)` (위 문장 안, 같은 위치)
3. R-Q1 (삭제, 대체 문장 없음)
   - before(단독 문단 L58): `여러분이 재판부라면 어떻게 보시겠습니까? 뒤차의 경적과 상향등이, 앞차가 차로에 멈춰 서서 후진으로 '경고'한 행동을 정당방위로 만들 수 있을까요?`
   - after: 문단 전체 삭제(두 문장 모두 질문이라 남는 문장 없음 → 고아 문단 없음). 앞 문단(B차 진술·不起訴)과 다음 H2(「경적과 상향등은 '현재의 부당한 침해'였나」)가 바로 이어짐.

## en

1. F-027
   - before: `…without an emergency, with a fine of NT$6,000 to NT$36,000 and an on-the-spot driving ban, and paragraph 4 adds a six-month plate suspension. Neither judgment mentions it, and the texts do not say whether any such penalty was imposed.`
   - after: `…without an emergency, with a current fine (in force since 30 June 2023) of NT$6,000 to NT$36,000 and an on-the-spot driving ban, and paragraph 4 adds a six-month plate suspension. Neither judgment mentions it, and the texts do not say whether any such penalty was imposed. At the time of this incident in January 2023, the [maximum was NT$24,000](…LawOldVer.aspx?pcode=K0040012&lnndate=20210120&lser=001).`
   - 새 문장은 fixspec 문구 그대로. 「Neither judgment mentions it」의 it이 Article 43을 가리키도록 새 문장을 문단 끝에 둠(앞에 두면 it이 금액을 가리키는 것으로 읽힘). 출처 목록 항목 추가: `- [道路交通管理處罰條例 第43條 (Article 43, text promulgated 20 January 2021 and in force from 1 June 2021, the version in force at the time of the incident)](…)`.
2. R-Q1 (삭제) + 고아 문단 합침
   - before(L55–57): `…New Taipei prosecutors decided not to prosecute, finding the evidence insufficient ([…](…)).` ⏎⏎ `So the car behind honked and flashed, and the driver in front says they felt chased. If you were deciding the case, would that make stopping in the lane and backing into the car behind self-defence?`
   - after: `…finding the evidence insufficient ([…](…)). So the car behind honked and flashed, and the driver in front says they felt chased.`
   - 질문 문장만 삭제하고, 남은 한 줄 「So the car behind honked…」는 앞 문단 끝에 붙임(지시대로).

## ja

1. F-027 (ja에는 F-028·R-Q1 없음)
   - before: `…運転者に、6,000〜3万6,000台湾ドルの罰鍰（行政上の制裁金）とその場での運転禁止を定め、4項ではナンバープレートの6か月の吊扣（一時取り上げ）も定めています。二つの判決はこの条文に言及しておらず、…`
   - after: `…運転者に、現行（2023年6月30日施行）の基準で6,000〜3万6,000台湾ドルの罰鍰（行政上の制裁金）とその場での運転禁止を定め、4項ではナンバープレートの6か月の吊扣（一時取り上げ）も定めています。本件があった2023年1月当時の[上限は2万4,000台湾ドル](…LawOldVer.aspx?pcode=K0040012&lnndate=20210120&lser=001)でした。二つの判決はこの条文に言及しておらず、…`
   - 새 문장은 fixspec 문구 그대로. 출처 목록 항목 추가: `- [道路交通管理處罰條例第43條（2021年1月20日公布、同年6月1日施行の版。本件当時の条文）](…)`.

## 리드 확인 요청 (Task B)
- ja L60에 R-Q1과 같은 독자 호명이 있다: 「ここで一度、裁判官の席に座ったつもりで考えてみてください。後ろの車にクラクションを鳴らされ、パッシングされた。前を走る運転者が止まって軽く当て、「もう来るな」と伝える。これは身を守る行為と言えるでしょうか。」 fixspec이 「ja는 해당 없음」이라 건드리지 않았다. 지우려면 문단 전체(4문장) 삭제.
- 2021년판 링크·출처 항목 추가는 fixspec에 URL이 적혀 있어 넣었다. 문장만 원하면 링크 괄호·출처 항목을 빼면 된다(세 언어 모두 문장 자체는 링크 없이도 성립).
- 검증: `diff`로 변경 줄 확인만 했다. 테스트·빌드는 돌리지 않았다(확인 필요).
