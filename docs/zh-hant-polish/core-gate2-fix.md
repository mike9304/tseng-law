# core-gate2 修正紀錄（Fable／Astra 核心文案第2道把關）

審閱來源：core-gate2-fable.md（語言4筆、法律實質1筆、備註1則）、core-gate2-astra.md（語言3筆）。兩位審閱者都指出 archive-copy.ts:13，合併為一筆，共7筆。行號是修正後的現行行號。

- src/data/attorney-profiles.ts:174 | 曾雋崴律師能以韓文、中文、日文直接與韓國客戶溝通，並辦理台灣本地的法律程序；事務所另提供英文諮詢。 → 曾雋崴律師能以韓文、中文、日文直接與客戶溝通，並辦理台灣本地的法律程序；事務所另提供英文諮詢。 | 採納（Fable）：以中文、日文「與韓國客戶」溝通，語意說不通。韓文原句是「한국 고객 사건을 직접 소통」，中文版把句子直接換字，才會變成這樣。同檔第188行、taiwan-debt-recovery-lawyer/content.ts:609 都已寫成「與客戶溝通」，不限對象。三種語言、英文諮詢另由事務所提供，這兩點都沒有改。沒有測試逐字斷言這句。
- src/data/site-content.ts:1359 | 資本額匯入、籌備帳戶與正式帳戶轉換 → 資本額匯入、籌備處帳戶轉為正式帳戶 | 採納（Fable）：台灣銀行開戶與公司登記實務的說法是「籌備處帳戶」（以「○○公司籌備處」名義開立），「籌備帳戶」漏了「處」字。本站專欄 001、005、013 共16處都寫「籌備處帳戶」。「轉為正式帳戶」與專欄 001 第9步「將籌備處帳戶轉為正式帳戶」一致。字數與原文相同。
- src/data/insights-archive.ts:272、278 | 以 Q&A 說明資本額匯款、籌備帳戶與正式帳戶轉換重點。／keywords '籌備帳戶' → 以 Q&A 說明資本額匯款、籌備處帳戶與正式帳戶轉換重點。／keywords '籌備處帳戶' | 採納（上一筆的連帶修正，不另計）：這張卡片連到專欄 005，專欄本文全用「籌備處帳戶」，關鍵字改成與本文一致。
- src/components/floating-ai-quick-replies.ts:120、125 | 4. 開立籌備帳戶／9. 籌備帳戶轉為正式帳戶 → 4. 開立籌備處帳戶／9. 籌備處帳戶轉為正式帳戶 | 採納（連帶修正，不另計）：AI 快速回覆的10步驟清單與專欄 001 的步驟表相同，第4、9步依專欄用語統一。步驟數、順序與其他步驟都沒有改。
- src/app/[locale]/guides/taiwan-company-setup/content.ts:276、284 | 開立公司籌備帳戶並匯入資本額……／由負責人至銀行將籌備帳戶轉為正式帳戶。 → 開立公司籌備處帳戶並匯入資本額……／由負責人至銀行將籌備處帳戶轉為正式帳戶。 | 採納（連帶修正，不另計）：只補「處」字，其餘內容不變。
- （未改）src/data/blog-posts.ts:366 的「예비 계좌(籌備帳戶)」是韓文內容中附註的中文詞，不屬 zh-hant 字串；src/lib/builder/canvas/__tests__/fixtures/legacy-zh-home-july.json 是舊版已儲存 Builder 首頁的測試資料，不與 site-content 比對（同一份資料其他服務項目早已與現行文字不同），因此都沒有改。

- src/lib/insights/archive-copy.ts:13 | 以下內容直接對應已整理的專欄原文與圖片素材。 → （不改） | 不採納（Fable＋Astra）：STYLE.md「追加鎖定（20:25）」已明定，這是 `LEGACY_ARCHIVE_INTRO_COPY` 中比對舊版 Builder 儲存文字用的鍵，前台不顯示，不列為問題，不得修改。已存舊字串的頁面會改顯示 `ARCHIVE_INTRO_COPY['zh-hant']`「查看台灣公司設立、投資與爭議處理所需的法律資訊。」，讀者看到的是這一句。改這個鍵會使替換失效，舊句反而出現在前台（core-r2、core-r5、core-gate1 也以相同理由不採納）。

- src/data/service-details.ts:125 | 因應韓台跨國婚姻增加，協助辦理…… → 因應台韓跨國婚姻增加，協助辦理…… | 採納（Fable）：台灣行文以本國在前，慣用「台韓」。本站 site-content.ts:1106「台韓跨境法律事務」、floating-ai-quick-replies.ts:304「台韓跨國離婚」、專欄 001 與 004 的「台韓所得稅協定」都這樣寫。只調換語序，服務範圍與「因應……增加」的背景敘述都沒有改（core-r5 已決定保留這段背景）。
- src/data/faq-content.ts:130 | 韓台跨國離婚涉及準據法、管轄法院…… → 台韓跨國離婚涉及準據法、管轄法院…… | 採納（Fable）：理由同上。本句前半的離婚程序分類已列入 core-r1 待律師確認，這次沒有碰。LAWYER-REVIEW 引用的現行文字仍是「韓台」，那是審閱當時的原文。
- src/data/team-members.ts:164、src/data/intent-pages.ts:382、511、src/app/[locale]/guides/taiwan-company-setup/content.ts:313 | 各類許可申請及韓台聯繫／希望借重韓台跨境實務經驗……／……等韓台兩地法律問題的人／韓台避免雙重課稅協定 → 各類許可申請及台韓聯繫／希望借重台韓跨境實務經驗……／……等台韓兩地法律問題的人／台韓避免雙重課稅協定 | 採納（上一筆的連帶修正，不另計）：同一語序問題，全站 zh-hant 公開文案一併統一。team-members.ts:164 的職責範圍與 content.ts:313 的協定生效日、稅率已分別列入 core-r4、t2 待律師確認，本次只換語序，數字與日期不變。
- （未改）「昊鼎韓台團隊」（team-name.ts:24）是團隊專有名稱，審閱者也排除在外。Builder 元件預設範本文字 marketing-widgets-copy.ts:183、196、207、226，service-feature-card-copy.ts:56，navigation-decorative-copy.ts:186 也有「韓台」。這些檔案不在 CORE／TIER2／NEW 清單內，且有多個 localization 測試逐字斷言，本次不動，留待決定是否另案處理。

- src/data/team-members.ts:172（關聯 team-members.ts:116、page-copy.ts:91） | 韓國事務長／律師、法務專員、事務長與會計師介紹 → （不改） | 不採納，轉律師（Fable 法律實質）：這是職稱事實。依本任務規則，職稱不由語言編輯更換。已追加至 LAWYER-REVIEW.md（core-gate2），三處待律師確認正式職稱後一併調整。
- （備註，不計件）src/data/site-content.ts:1217 統計段說明：Fable 無法確認這句與鎖定字串是否一致。現行文字已是鎖定版「事務所提供中文／韓文／日文／英文4種語言的台灣法律諮詢。並依官方律師簡介整理：……」，與 home-zh-hant-parity.ts:314 的 `after`、home-stats-factual-claims.test.ts:30 相同，是本輪開始前其他作業改好的。本輪沒有改。

- src/data/team-members.ts:178 | 具資訊工程背景，協助文件流程與跨語言溝通。 → 具資訊工程背景，協助處理文件作業與跨語言溝通。 | 採納（Astra）：「協助流程」動詞與受詞搭配不上。韓文原句是「문서·업무 시스템 관리」，即文件與業務作業，「協助處理文件作業」較貼近原意。core-r3 已把「具資訊工程背景」與學歷系名列入待律師確認，前半句這次沒有改。多2字，是團隊介紹段落，版面不受影響（about 頁版面高度測試在修改前後都是5221，見下方驗證）。
- src/components/PricingCards.tsx:149 | 諮詢時間以電子郵件聯繫後確定。 → （不改） | 不採納（Astra）：這句可以正常斷成「諮詢時間／以電子郵件聯繫後／確定」，「以電子郵件」說明聯繫方式，並不是殘缺的「以……後」句構。建議句「將於電子郵件聯繫後確定」把聯繫方式改成名詞，意思相同，屬偏好。另外，同一句也出現在 Builder 定價頁 decompose-page-pricing.ts:118，並有 pricing-ja.test.tsx:155 逐字斷言；只改前台會讓兩處不一致。

## 測試同步

- src/data/__tests__/column-007-public-reference-sync.test.ts:159 | 因應韓台跨國婚姻增加…… → 因應台韓跨國婚姻增加…… | 同步（不計件）：service-details.ts:125 的逐字斷言，只改字串。
- src/data/__tests__/faq-content-ja-factual-consistency.test.ts:78 | zh-hant 雜湊 5b99ede1…3e073c47a9 → 25a64af0…7f7e7f8c1 | 同步（不計件）：修改前先跑過這個測試，確認舊雜湊通過；改 faq-content.ts:130 後重算 `JSON.stringify(faqContent['zh-hant'])` 的 SHA-256，只換常數。
- src/data/__tests__/column-012-public-reference-sync.test.ts:241 | zh-hant 其他文章雜湊 86228a23…e0fda40d → df20c6aa…453b29a0 | 同步（不計件）：這個雜湊涵蓋 insights-archive 的 zh-hant 文章。git diff 確認 insights-archive.ts 的未提交變更只有本輪第272、278行，只換常數。

## 驗證

- 修改完成後跑一次全套 `npx vitest run`：共1354個測試檔，1343個通過、11個失敗。13235項測試中，13209項通過、11項失敗、14項略過。
- 其中 column-012-public-reference-sync 的雜湊失敗是本輪造成的，已同步常數。之後重跑 column-012、column-007、faq-content-ja-factual-consistency 三檔，35項全部通過。
- 其餘10個失敗不是本輪造成的：
  - columns-zh-investment-001／004／005／011、columns-zh-labor-related-tails、columns-zh-litigation-010、columns-zh-traffic-003、column-embeddings-content-sync：都是專欄內文字數、閱讀時間或標題的斷言。對應的 columns-zh 檔案在 20:27:19 被同時執行中的專欄修正作業改寫，本輪沒有碰任何專欄檔。
  - decompose-about、zh-hant-standalone-baseline：about 版面高度預期5315，實際5221。core-gate1-fix.md 已記錄這是本輪之前就存在的失敗。本輪修改 team-members.ts 後仍是5221，高度沒有因本輪改變。
- 沒有執行 build，沒有 commit 或 push。

採納 4 筆，不採納 3 筆
