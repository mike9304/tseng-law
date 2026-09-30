# zh-hant 文案潤飾：測試同步紀錄

日期：2026-09-30。測試僅更新字數、閱讀時間與雜湊常數，未修改計算公式、斷言邏輯或測試範圍。保留工作開始時已存在的文案與文件變更。

## 專欄字數與閱讀時間

依各測試現有的可見文字擷取方式與漢字判定實測，閱讀時間仍使用 `Math.ceil(漢字數 / 400)`。

| 專欄 | 原字數常數 | 現行實測字數 | 閱讀分鐘數 |
| --- | ---: | ---: | ---: |
| 001 | 4,321 | 4,320 | 11 |
| 002 | 5,978 | 5,968 | 15 |
| 004 | 7,912 | 7,918 | 20 |
| 005 | 3,692 | 3,693 | 10 |
| 008（labor-related-tails） | 1,621 | 1,598 | 5 → 4 |
| 009（labor-related-tails） | 640 | 646 | 2 |
| 010 | 2,968 | 2,973 | 8 |
| 011 | 3,765 | 3,763 | 10 |
| 012 | 1,072 | 983 | 3 |
| 013 | 3,122 | 3,114 | 8 |
| 015 | 3,314 | 3,302 | 9 |
| 017 | 3,696 | 3,716 | 10 |

更新上述測試中的漢字數常數。只有 008 跨過閱讀時間門檻，將 `008-taiwan-labor-severance-law.md` frontmatter 的 `read_time` 與 labor-related-tails 對應的 `readTime` 常數同步為 `4分鐘閱讀`。其他 frontmatter 閱讀時間不需更動。

labor-related-tails 的正文末段與相關文章尾段原已符合契約；該檔未比對 summary/faq，無須修改此類 metadata。全部專欄正文與開始作業時的檔案逐一比對，均維持原樣。

## Embeddings 標題

僅對 `src/content/column-embeddings.json` 的兩個 zh-hant 紀錄做精準 title 字串替換：

- `taiwan-company-establishment-advanced-2`：`台灣公司設立：資本金匯款、銀行帳戶與外國人聘僱實務Q&A` → `台灣公司設立：出資款匯款、銀行帳戶與外國人聘僱實務Q&A`。
- `taiwan-labor-severance-law`：`台灣勞動法：在台灣領資遣費真的很難嗎？？` → `台灣勞動法：在台灣領資遣費真的很難嗎？`。

保留整份 JSON 的原始排版；逐筆確認所有 vector 與其他欄位均未改動。

## 雜湊常數

保留現行文案，依既有測試的 `sha256(JSON.stringify(...))` 結果更新 zh-hant 期望值：

| 測試 | 原期望 SHA-256 | 現行 SHA-256 |
| --- | --- | --- |
| `faq-content-ja-factual-consistency.test.ts`：zh-hant FAQ | `5b89d4b2579579fcc9a3f6d9a69f4a53c1e8e012d81a2e0f96cb8d59b2e86741` | `c697bebe78e5656c0091d55149278c7dc7cf4407ec57b6cfbc813b70af704919` |
| `column-012-public-reference-sync.test.ts`：zh-hant 非 012 archive posts | `923cb38dd5a2dc43133b073846c92c9b59e9fe68b38091b5c9698cd7df1beeb5` | `86228a23f949ad80ad073ed4a8a44cbc3d129b6023380f9877a38426e0fda40d` |

其他語言的雜湊不變。

## 首頁統計事實契約

未修改 `home-stats-factual-claims.test.ts`。將 `site-content.ts` zh-hant stats description 還原為：

> 事務所以中文、韓文、日文、英文4種語言提供台灣法律諮詢。以下依官方律師簡介整理：4個台灣辦公據點、7項主要執業領域，以及TOPIK 6級與JLPT N1兩項最高級別語言資格。

## About 行數與版面高度

未修改兩個版面測試或 decomposer。實測律師區高度仍為 2,605px，真正少一行的是 `src/data/firm-introduction.ts` zh-hant 介紹第二段，並非 team-members 或 attorney-profiles。

將該段中的 `各在不同領域累積多年實務經歷` 同義改寫為 `各自在不同的執業領域累積多年法律實務經驗`，保留既有經歷與服務範圍，不新增事實主張。

第二段估算高度由 63px 回到 95px；事務所介紹區由 995px 回到 1,027px，律師區起點回到 1,455px，聯絡區起點回到 4,060px，about stageHeight 由 5,283px 回到契約要求的 5,315px。曾試還原 team-members 中的「豐富的」，確認不是來源後已撤回，該檔無本次最終修改。

## 驗證

初次重現：17 個檔案失敗，18 項失敗、178 項通過。

最終執行：

```sh
npx vitest run \
  src/lib/__tests__/columns-zh-investment-{001,002,004,005,011,013,015,017}.test.ts \
  src/lib/__tests__/columns-zh-litigation-010.test.ts \
  src/lib/__tests__/columns-zh-traffic-012.test.ts \
  src/lib/__tests__/columns-zh-labor-related-tails.test.ts \
  src/lib/__tests__/column-embeddings-content-sync.test.ts \
  src/data/__tests__/faq-content-ja-factual-consistency.test.ts \
  src/data/__tests__/column-012-public-reference-sync.test.ts \
  src/data/__tests__/home-stats-factual-claims.test.ts \
  src/lib/builder/canvas/__tests__/decompose-about.test.ts \
  src/lib/builder/canvas/__tests__/zh-hant-standalone-baseline.test.ts
```

結果：Vitest 3.2.6，**17 個測試檔、196 項測試全部通過**，exit code 0。2026-09-30 19:16:05 KST 開始，耗時 2.88 秒。

未執行 commit、push 或 build。

## gate 階段（20:40）
- about-ja.test.tsx：zh-hant 介紹頁 description 改為「認識事務所背景與昊鼎韓台團隊成員。」（core-gate3 Fable 第1筆），測試字串同步更新。
- home-stats-factual-claims.test.ts：統計說明還原為鎖定版本（與 home-zh-hant-parity after 一致），修正 home-zh-hant-editor-read.test.ts 4 項失敗。

## rebase 後最終同步（21:10，origin/main 46dcb536）
- 專欄可見漢字數：004 7,918→7,931；005 3,693→3,699；011 3,763→3,777；008 1,598→1,601（read_time 4→5分鐘，md 與測試同步）；012 1,048→962。
- 專欄 003 標題還原為 main 的「台灣交通事故應對 Q&A…」（site-content、md、columns-zh-traffic-003 測試），以符合 column-embeddings 記錄；不動向量。
- about 版面：firm-introduction 段落縮短，firm-intro 高度 1027→933，attorney y 1455→1361，contact y 4060→3966，stageHeight 5315→5221（decompose-about、zh-hant-standalone-baseline）。
- 衝突處理：041、issues/zh-hant 07、09 採用 main 46dcb536 版本；traffic-hub.ts 圖解區塊採用 main 結構。
