2026-10-01 | 審閱檔：docs/zh-hant-polish/pass2/A-r2-grok.md | writer: Claude Sonnet 5.5

- 008-taiwan-labor-severance-law.md:73 | 宜留意公司是否以施壓換取自願離職。 → （刪去） | 採納：與上一句「逼迫員工自願離職」重複，無新增條件
- 008-taiwan-labor-severance-law.md:169 | 這樣的案例非常多， → （刪去，保留「當公司使用不正當手段時，一定要留存證據。」） | 採納：「非常多」無件數或出處支持，刪後語意不缺
- 009-taiwan-voluntary-resignation-severance.md:40-46 | 最常見的例子是雇主／未按時發放工資、／未支付加班費、／或未替員工辦理勞保或健保的投保。 → 最常見的例子是雇主未按時發放工資、未支付加班費，或未替員工投保勞保或健保。 | 採納：四行併為一句，三項例子保留，L48不動
- 009-taiwan-voluntary-resignation-severance.md:52-60 | 不過勞動基準法規定，（單獨成行，其後逐行斷開）→ 併為一段完整句子 | 採納：第1、6款、兩處**30日**及「務必留意該期限」全部原樣保留，僅修正斷行

採納 4 筆，不採納 0 筆
測試：008 漢字數 1_538→1_514、009 591→588（read time 4/2分鐘不變，400字公式不動，無斷言刪減）。
測試：npx vitest run src/lib/__tests__/columns-zh，17檔、228項全部通過
