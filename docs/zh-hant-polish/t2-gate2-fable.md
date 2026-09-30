（環境備註：claude.ai Google Drive 與 plugin:vercel:vercel 兩個 MCP 伺服器尚未授權，本次審閱未用到；如需使用，請到 claude.ai 連接器設定或互動式工作階段的 /mcp 授權。）

本次只依貼上的摘錄審閱，未開啟原始檔，也未讀取 `editorial-voice.md`。

## 主清單（語言層面的實質問題）

無。扣除鎖定字串與律師確認清單已登錄的項目後，摘錄已無明顯翻譯腔、AI 套話、大陸用語、錯字或文法錯誤。

## 可改可不改（不計入 VERDICT）

- src/data/intent-pages.ts:452 | 設立階段就一併考慮契約、勞動與商標。 | 同組其他各點都是陳述句，這句是沒有主語的祈使句，「就」後面像少了半句 | 設立階段宜一併考慮契約、勞動與商標。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:303 | 實際費用依行業、資本額與代辦費用而有不同 | 「費用依……費用而不同」循環 | 實際費用依行業、資本額與代辦收費而異
- src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:534、567 | 有關……的往來聯繫 | 列在「可先整理的資料」下，「往來聯繫」不是文件名稱 | 有關……的往來紀錄
- src/app/[locale]/taiwan-debt-recovery-lawyer/content.ts:500、561、563 | 交期延誤／交期遲延 | 同頁兩種寫法，不影響理解 | 擇一統一

## 法律實質（交律師）

- src/app/[locale]/guides/taiwan-company-setup/content.ts:299 | 研發投資抵減：最高30% | 專欄 004 第119行已說明 30% 是當年度營利事業所得稅額的抵減上限，不是研發費用的 30%。表格只寫「最高30%」，容易被讀成研發支出可抵三成。此行未見於清單 | 由律師確認後改寫，例如註明「抵減額以當年度應納營所稅額30%為限」
- src/app/[locale]/guides/taiwan-company-setup/content.ts:327 | 分公司將盈餘匯回總公司，則無額外稅負 | 與 colsA-r2 第1筆（專欄 004 分公司盈餘匯回扣繳）是同一疑問，此處說得更絕對，且尚未登錄 | 併入該筆，一起確認後同步
- src/components/FloatingAiChat.tsx:419 | 最近更新：${date}（鍵名 sourceLastVerified） | 鍵名是「最後查核日」，標籤寫「最近更新」。若日期其實是查核日，讀者會以為文章當天改過。此行與已登錄的 AiConsultationSection.tsx:123「文章內容為最新」是同類的時效宣稱 | 確認日期的實際意義；若是查核日，改「最近確認：」

VERDICT: APPROVE
