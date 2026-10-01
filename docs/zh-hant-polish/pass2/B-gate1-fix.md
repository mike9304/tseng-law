2026-10-01。依 ~/tseng-zh-hant-pass2-20261001/verdicts/COLS-B-ASTRA.md（ITERATE：P0 1、P1 1，皆自 14df0302 既存）處理。writer: Claude Opus 5.5（審閱者 GPT-6 Astra，不同模型）。
- [P0] src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:43 | 「第9條要求，經核准的投資額應於規定期間內全額匯入，並就該匯款向主管機關申報接受審查，再於投資實施後申請投資總額的審定。」 → 「第9條要求，經核准的出資應於核定期限內全部到達，並將到達情形報請主管機關查核；實行出資後，再向主管機關申請審定投資額。」 | 採納：依 law.moj.gov.tw 外國人投資條例（J0040002）第9條原文（curl）：「投資人應將所核准之出資於核定期限內全部到達，並將到達情形報請主管機關查核」「於實行出資後，應向主管機關申請審定投資額」。原句把出資限縮為匯款、把查核寫成審查，與條文不符。專用測試 columns-zh-investment-013 同步：article9 段落字串與順序步驟改為條文用語（全部到達→報請主管機關查核→實行出資後→審定投資額，4步驟與排序斷言強度不變），可見漢字數 3_065→3_064。
- [P1] src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:70 | 「## 4. 設立分公司與子公司之程序不同，設立子公司才須經過經濟部投資審議司的審查」 → 「## 4. 子公司與分公司的投資申請及登記程序」 | 採納：標題比本文72、74行的「原則上」更絕對；改為描述程序差異，本文不動。
- P2（013:27 預告句、020:3 動賓搭配）：本輪不處理，列下一輪。
測試：npx vitest run src/lib/__tests__/columns-zh → 17 files / 228 passed。
