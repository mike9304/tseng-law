R1에서 이미 기각한 항목과 테스트가 잠근 문장을 먼저 가려 내고, 대상 칼럼·이슈 본문만 다시 읽겠습니다.R1 기록과 대상 본문을 대조해서, 이미 기각된 지적과 R1이 새로 만든 문장을 구분하겠습니다.### src/content/columns-zh/012-taiwan-overtaking-accident-liability.md
- L18: 「超車看似平常，卻有不小的風險」 → 「前方車輛行駛緩慢時，超車前駕駛人應一併評估路段、雙向交通狀況、前車動態，以及安全超越後能否回到原來的行駛路線。」 | AI語氣 | R1改成「看似…卻…」的空泛對比，刪掉也不少評估義務與路況條件 | 意義保留: 是

### src/content/columns-zh/041-taiwan-crypto-exchange-vasp-dispute.md
- L38: 「這是值得追查的警訊」 → 「名單上找不到業者名稱，就值得再查」 | AI語氣 | 「值得追查的警訊」只是加重語氣，下一句已說不能單憑名單定案 | 意義保留: 是

### src/content/columns-zh/042-taiwan-investment-scam-recovery.md
- 無指摘

### src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md
- L50: 「再附一份核對無誤的金額計算」 → 「再附一份金額對得上的計算明細」 | 其他 | R1把「對得起來」改成不成詞的「金額計算」，語氣也從數字對得起來加強成已經核對無誤 | 意義保留: 是
- L64: 「同一條第77條之19」 → 「同法第77條之19」 | 其他 | 上一段是第526條，「同一條」會把裁判費讀成該條裡的規定 | 意義保留: 是

### src/content/columns-zh/045-taiwan-overseas-income-us-stocks-crypto-amt.md
- 無指摘

### src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md
- L28: 「離婚程序與子女安排，另見文末的相關專欄。」 → 「（刪除此句）」 | 贅字 | R1加回的預告沒指出篇名，離婚與子女連結在後文，不在文末 | 意義保留: 是

### src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md
- L40: 「作業要點《Operational Directions for Foreigners to Acquire Land Rights in Taiwan》」 → 「《外國人在我國取得土地權利作業要點》（Operational Directions for Foreigners to Acquire Land Rights in Taiwan）」 | 其他 | 中文專欄只留英文名稱，讀者無法用中文找到這份作業要點 | 意義保留: 是

### src/content/columns-zh/050-taiwan-accident-police-records.md
- 無指摘

### src/content/issues/zh-hant/ISSUE-20260930-07-marriage-leave-fourteen-days-employer-subsidy.md
- L17: 「或契約在婚假請完前終止之後」 → 「勞工請完婚假後，或勞動契約在婚假請完之前終止後，雇主才能申請」 | 翻譯腔 | 「請完前」和「終止之後」套在一起，也沒寫明是勞動契約 | 意義保留: 是

### src/content/issues/zh-hant/ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md
- L61: 「第84條對此處六個月以下有期徒刑」 → 「第84條就此規定，處六個月以下有期徒刑」 | 其他 | 「對此處」連寫會讀成「這個地方」，刑罰的「處」斷不開 | 意義保留: 是

### src/data/issue-board.ts
- 無指摘

### src/components/IssueBoardTabs.tsx
- 無指摘

## 統計
- src/content/columns-zh/012-taiwan-overtaking-accident-liability.md：1
- src/content/columns-zh/041-taiwan-crypto-exchange-vasp-dispute.md：1
- src/content/columns-zh/042-taiwan-investment-scam-recovery.md：0
- src/content/columns-zh/044-taiwan-payment-order-provisional-attachment.md：2
- src/content/columns-zh/045-taiwan-overseas-income-us-stocks-crypto-amt.md：0
- src/content/columns-zh/046-taiwan-marital-property-regime-international-couples.md：1
- src/content/columns-zh/047-foreigner-buy-sell-taiwan-real-estate-tax.md：1
- src/content/columns-zh/050-taiwan-accident-police-records.md：0
- src/content/issues/zh-hant/ISSUE-20260930-07-marriage-leave-fourteen-days-employer-subsidy.md：1
- src/content/issues/zh-hant/ISSUE-20260930-09-taiwan-mainland-travel-permission-family-company.md：1
- src/data/issue-board.ts：0
- src/components/IssueBoardTabs.tsx：0
- 合計：8

這一批最常見的 3 個問題：
1. 條號、刑罰和期限黏在一起，讀者會讀錯條文或時點（同一條、對此處、請完前終止之後）。
2. R1新句帶來的空泛對比、不成詞名詞，或把連結指到錯誤位置（看似平常卻有風險、金額計算、文末專欄）。
3. 還留著的直譯與檢索障礙（警訊套話、只留英文的作業要點名稱）。
