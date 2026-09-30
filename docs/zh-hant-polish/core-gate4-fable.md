僅依您貼上的摘錄審閱，未開啟檔案比對行號。（另：Google Drive 與 Vercel 兩個 MCP 連接器尚未授權，本次審閱用不到。）

## 主清單（語言層面的實質問題）

無。摘錄中的翻譯腔、AI 套話、大陸用語與文法錯誤均已清除，讀起來像台灣事務所自行撰寫的文字；`firm-introduction.ts` 的文言語感與官網來源一致，不算問題。

以下兩點屬可改可不改，不計入件數，僅供紀錄：

- `src/data/site-content.ts:1242`、`1249`、`1256`：日期欄的「常設」略帶日韓語感，但讀者看得懂。
- `src/data/team-name.ts:24`：「昊鼎韓台團隊」與站內行文的「台韓」語序不同；這是團隊名稱，依規範不改。

## 法律實質（交律師）

以下都是既有待確認事項尚未登錄的關聯版位，不是新疑問類型：

- `src/data/insights-archive.ts:319`、`323` | 「聯絡處」 | 與 core-r1 的 `service-details.ts:40` 是同一疑問（指南頁用「辦事處」）。 | 確認後三處同步。
- `src/data/site-content.ts:1196`、`1198` | 「夫妻剩餘財產分配」 | 與 core-gate3 的 `service-details.ts:125` 是同一疑問（他處寫「剩餘財產差額分配」）。 | 確認後同步。
- `src/components/HeroTrustStrip.tsx:32`、`src/components/OfficeMapTabs.tsx:38`、`src/data/page-copy.ts:125-126` | 「Google … 則評論」、「客戶評價」、「客戶的評價與回饋」 | 與 t2-r6 的 `ReviewBoard.tsx:110` 是同一疑問（公開評價與評分是否符合律師廣告規範）。 | 一併確認。
- `src/data/team-members.ts:131` | 「專精企業與個人案件」 | 與 core-r5 的 `firm-introduction.ts:41`「專精」是同一能力宣稱疑問；此句為 parity 鎖定字串。 | 只交律師確認，不改字串。
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx:142`、`src/components/AttorneyProfileSection.tsx:29` | 「代表律師」 | 與 core-r1 的 `attorney-profiles.ts:132`、`team-members.ts:126` 是同一職稱疑問。 | 確認正式職稱後四處同步。

VERDICT: APPROVE
