3개 파일에 수정을 반영했습니다. 마지막에 grep으로 확인했고 `**`, `__`, `<strong>`, `<b>`, "취업금카드"는 0건입니다. git은 실행하지 않았습니다. 리뷰가 짚은 범위 문제와 같은 문장이 각 언어 FAQ 답변에도 있어서, 리뷰 지적 범위 밖이지만 함께 고쳤습니다.

## src/content/columns/065-taiwan-rental-deposit-foreign-tenant.md
- 본문(조례 적용 범위 문단)
  - 원문: "이와 별도로 [토지법 제99조]도 주택 임대의 담보금 상한을 두 달 치 월세로 두고"
  - 수정: "이와 별도로 도시 지역 주택 임대에는 [토지법 제99조]도 담보금 상한을 두 달 치 월세로 두고"
  - 이유: 제99조는 城市地方 주택에 적용되는데, 원문은 모든 주택에 적용되는 것처럼 읽혔습니다. 두 달 상한과 초과분을 집세로 충당할 수 있다는 내용은 그대로 두었습니다.
- FAQ 답변
  - 원문: "토지법 제99조도 주택 임대의 담보금이…"
  - 수정: "도시 지역 주택 임대에는 토지법 제99조도 담보금이…"
  - 이유: 위 본문과 같은 범위 문제입니다.
- 토지법 제100조 문단
  - 원문: "사법원 해석(院解字第3489號)과 최고법원 37년 上字 제7729호 판례는"
  - 수정: "최고법원 37년 上字 제7729호 판례와, 같은 페이지의 여러 판례가 인용하는 사법원 해석(院解字第3489號)은"
  - 이유: 링크한 판례 페이지에서 3489號는 독립 항목이 아니고 다른 판례 안에서 인용될 뿐입니다. 출처와 주장을 맞췄고, 결론은 그대로입니다.

## src/content/columns-en/065-taiwan-rental-deposit-foreign-tenant.md
- 첫 문장
  - 원문: "A landlord in Taiwan may not take more than two months' rent as a deposit."
  - 수정: "For most residential leases in Taiwan, the deposit may not exceed two months' rent."
  - 이유: 원문은 제4조의 제외 대상을 감안하지 않아 본문보다 넓게 단정했습니다. 두 달 상한은 유지했습니다.
- 본문
  - 원문: "Outside the Act, [Land Act Article 99] still caps housing security money…"
  - 수정: "Separately, for urban housing, [Land Act Article 99] caps security money…"
  - 이유: 적용 범위(城市地方)를 넣었습니다. 원문처럼 쓰면 조례가 적용되는 주택에는 제99조가 적용되지 않는 것처럼 읽힐 수 있었습니다. 초과분 상계는 그대로입니다.
- FAQ 답변
  - 원문: "Land Act Article 99 also caps housing security money…"
  - 수정: "For urban housing, Land Act Article 99 also caps security money…"
  - 이유: 위 본문과 같은 범위 문제입니다.
- 판례 문단
  - 원문: "The same precedents page lists Judicial Yuan Interpretation Yuan-Jie No. 3489 and Supreme Court Precedent 37-Shang-7729 (1948), which read…"
  - 수정: "Supreme Court Precedent 37-Shang-7729 (1948), listed on the same precedents page, and Judicial Yuan Interpretation Yuan-Jie No. 3489, as cited in other precedents on that page, read…"
  - 이유: 출처와 주장의 관계를 정확히 맞췄습니다. 1948년과 결론은 그대로입니다.

## src/content/columns-zh/065-taiwan-rental-deposit-foreign-tenant.md
- 첫 문장
  - 원문: "在台灣租屋，押金最多兩個月租金。"
  - 수정: "在台灣租屋，押金原則上最多兩個月租金。"
  - 이유: 제4조 예외가 있는데 원문은 예외 없이 단정했습니다.
- 본문
  - 원문: "不在條例範圍內時，[土地法第99條]同樣規定住宅擔保金不得超過…"
  - 수정: "此外，城市地方房屋租賃另依[土地法第99條]，擔保金不得超過…"
  - 이유: 적용 범위를 넣고, 조례가 적용되는 주택에는 제99조가 배제되는 것처럼 읽히던 조건을 없앴습니다. 상한과 抵付房租는 그대로입니다.
- FAQ 답변
  - 원문: "土地法第99條也規定住宅擔保金不得超過二個月租金，"
  - 수정: "城市地方房屋租賃另依土地法第99條，擔保金不得超過二個月租金，"
  - 이유: 위 본문과 같은 범위 문제입니다.
- 판례 문단
  - 원문: "同一相關判解頁所列司法院院解字第3489號及最高法院37年上字第7729號判例，均認"
  - 수정: "同一相關判解頁所列最高法院37年上字第7729號判例，以及該頁多則判例援引的司法院院解字第3489號解釋，均認"
  - 이유: KO·EN과 같이 출처와 주장의 관계를 바로잡았습니다. 결론은 그대로입니다.

리뷰의 DOUBT 1건은 아직 확인하지 못했습니다. KO 본문에 정형화계약 應記載事項 항목(審閱期, 목적물, 차임·보증금, 수선, 해지, 點交)이 나열돼 있는데, 이것은 행정원 PDF와 대조해야 확인됩니다. 이번 지시 범위가 아니어서 그대로 두었습니다. 게시 전에 PDF와 대조해야 합니다.
