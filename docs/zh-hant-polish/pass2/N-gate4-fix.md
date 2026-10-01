2026-10-01。依 ~/tseng-zh-hant-pass2-20261001/verdicts/NEW-ASTRA-G4.md（ITERATE：P0 1、P1 1類21處）處理；Fable G4 為 APPROVE（VERDICT-FABLE51-NEW-G4.md）。writer: Claude Opus 5.5。
- [P0] src/content/columns-zh/045-taiwan-overseas-income-us-stocks-crypto-amt.md:26 | 「領到的是美國已先扣稅的股利。」 → 「領到的股利可能已先在美國扣繳稅款。」 | 採納：IRS 說明區分一般扣繳與免扣繳（部分 RIC 配息），原句一律斷定已扣稅，過寬。保留投資途徑與標的。
- [P1] 粗體強調 21 處（041:5、044:6、045:1、046:4、ISSUE-07:5） | `**…**` → 去除標記，文字不變 | 採納：依 ~/agent-library/knowledge/editorial-voice.md 2026-10-01「專欄禁止粗體強調」。機械驗證：新檔＝舊檔去除 `**`（045 另含上列 P0 一句），逐檔一致。
測試：npx vitest run src/lib/__tests__/columns-zh src/lib/__tests__/issue-board → 18 files / 274 passed。
