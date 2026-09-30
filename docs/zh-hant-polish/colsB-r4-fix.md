# 專欄B第4輪修正紀錄（colsB-r4）

依審閱稿順序逐筆處理：一般意見33筆、法律實質意見1筆，共34筆；同筆的關聯版位合併計數。行號依本次處理後檔案；正文未增刪行。既有LAWYER-REVIEW事項保留，不重複登錄。

驗證：相關6個測試檔共79項全部通過；測試僅更新中文常數，數值基準及邏輯未改。013、015、017的中文字數與原基準一致；014、016的全文雜湊測試通過。未執行build、commit或push。

- src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:101 | 均非工作日，而是以曆日計算的行政處理目標 → 是按曆日而非工作天計算的行政處理目標 | 採納：消除「非工作日」被讀成假日的歧義；保留5日、11日及原有曆日計算主張。同步更新測試中文斷言。
- src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:80 | 若要長期停留，也需要申請居留證 → 若要長期留在台灣，也需要申請居留證 | 採納：改用一般行文的「留在台灣」，避免與停留制度名稱混淆；不增刪工作許可或居留證的申請主張。
- src/content/columns-zh/023-baby-taiwan-nationality-birth-registration.md:15 | 應先確認移民署適用的定居類型 → 應先確認孩子適用移民署哪一種定居類型 | 採納：補明適用定居類型的主體是孩子，不是移民署；原有程序順序與條件不變。
- src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:47 | 以輔導函通知申請人補充結果，補充後 → 以輔導函通知申請人補送查詢結果，補送後 | 採納：上文已明示未檢附查詢結果，補明補送的文件；輔導函、續行登記及程序順序均保留。同步更新兩處測試中文斷言。
- src/content/columns-zh/014-taiwan-mandatory-employment-period.md:38 | 不是。／不能。／不必。 → 不是。／不能。／不必。 | 不採納：第38、99、125行與對應FAQ屬014全文雜湊凍結範圍，依STYLE鎖定規範保留；不改對應測試。
- src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:51 | 不同。／不可以。 → 不同。／不可以。 | 不採納：第51、95行與對應FAQ屬016全文雜湊凍結範圍，保留原文。
- src/content/columns-zh/017-taiwan-logistics-business-setup.md:33 | 不一定。「物流」…／不會。股權收購…／不能一概而論。應視委託方… → 「物流」…／股權收購…／應視委託方… | 採納：刪除第33、85、111行接在非問句標題後的答語。第12、16、18行FAQ同步精簡，保留各答案完整的條件與否定敘述；同步更新測試字串，維持FAQ與正文一致，不改測試邏輯。
- src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:27 | 公司或店面的所在地，不能只依租金、交通、客層決定 → 公司或店面的所在地，不能只依租金、交通、客層決定 | 不採納：原句已有「公司或店面的所在地」作為所決定的事項，並非句子沒說完；改成問句式開頭屬偏好。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:27 | 租賃契約的時機 → 租約的注意事項 | 採納：導言用語對應第4節的租約條件及時程討論，避免把整節限縮為簽約時點。
- src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:76 | 單純備有某一份表單，並不能保證交易合法，也不能保證避免爭議 → 單純備有某一份表單，並不能保證交易合法，也不能保證避免爭議 | 不採納：審閱者建議刪除「備有表單」前提，改成整體設立程序不能保證合法；會改變原本論述範圍，追加LAWYER-REVIEW待確認。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:59 | 經歷領域不同，也未必單憑這一點就決定審查結果 → 經歷領域不同，審查結果也未必就由這一點決定 | 採納：僅調整語序，保留「不一定單憑此點決定結果」，不採可能被讀成「不影響結果」的建議。第16行FAQ與測試同步；第63行「也未必單憑這一點就決定結果」改「結果也未必就由這一點決定」，已交律師的「取得許可的計畫」原樣保留。
- src/content/columns-zh/022-marrying-taiwanese-national-registration-checklist.md:17 | 共同親生子女可能涉及面談豁免條件 → 共同親生子女可能涉及面談豁免條件 | 不採納：「涉及」改「符合」會把條件關聯改成適用結論，涉及面談豁免要件；不能僅憑第44行推定FAQ主張，追加LAWYER-REVIEW。
- src/content/columns-zh/017-taiwan-logistics-business-setup.md:141 | 內政部移民署：禁止入國期間作業規定 → 內政部移民署：禁止外國人入國作業規定 | 採納：修正官方名稱，與第123行一致；僅更正連結文字，href及引用保留。名稱核對：[移民署中文網說明](https://www.immigration.gov.tw/180138)。
- src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:89 | 財產利益衝突及支持網絡 → 財產利益衝突及支持網絡 | 不採納：用語問題可成立，但016全文雜湊凍結；依STYLE保留，亦不改測試。
- src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:25 | 由誰行使負擔未成年子女的權利義務 → 由誰行使負擔未成年子女的權利義務 | 不採納：016全文雜湊凍結，不能補入頓號。
- src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:56 | 不得在台有營業行為 → 不得在台從事營業行為 | 採納：以「從事」修正動詞搭配，保留「營業行為」的原有法律表述，不另改禁止範圍或條號。
- src/content/columns-zh/014-taiwan-mandatory-employment-period.md:131 | 不可歸責於勞工事由的封閉清單 → 不可歸責於勞工事由的封閉清單 | 不採納：014全文雜湊凍結；語言建議只記錄，不改正文或測試。
- src/content/columns-zh/022-marrying-taiwanese-national-registration-checklist.md:13 | 應依海外已生效婚姻的途徑，確認婚姻證明、驗證及中文譯本等資料 → 海外婚姻已生效者，仍應確認婚姻證明、驗證及中文譯本等資料 | 採納：修正「依…途徑，確認」的搭配；保留海外婚姻已生效的前提、「確認」及「等資料」，不自行增訂備齊文件的要求。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:37 | 也應事先就土地使用分區、建築管理及行業別許可等事項確認 → 也應事先確認土地使用分區、建築管理及行業別許可等事項 | 採納：把「確認」移到受詞之前，保留「等事項」及原有檢視範圍；第12行FAQ及測試同步。
- src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:83 | 店面方面的土地使用／消防與建築方面的準備 → 店面的土地使用／消防與建築準備 | 採納：刪除「方面」套語；第91行關聯版位一併精簡，不增刪準備事項。
- src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:49 | 應與作業須知第五點所定項目的隨案主動查詢區分開來 → 查詢申請應與作業須知第五點所定項目的隨案主動查詢區分開來 | 採納：補回上文已有的「查詢申請」主體；第五點及所定項目仍保留，不改程序說明。
- src/content/columns-zh/016-taiwan-inheritance-custody-analysis.md:113 | 仍可能需要補正生效證明、確定證明或原本 → 仍可能需要補正生效證明、確定證明或原本 | 不採納：016全文凍結；「補正」是否可限縮成另附文件，也涉及補件內容與程序，追加LAWYER-REVIEW，不逕改「另附」。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:65 | 請依預定的角色，個別確認 → 請依預定的角色，個別確認 | 不採納：「角色」可能包含投資人、雇主或受僱人等程序身分，不能直接限縮成職務；應補文件也不必然等於補充資料，追加LAWYER-REVIEW確認原意。
- src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:84 | ## 7. 依業務發展階段，比較適合的架構／## 8. 初次諮詢… → ## 7. 依業務發展階段，比較適合的架構／## 8. 初次諮詢… | 不採納：第84、94行章節編號確有跳號，但STYLE及本任務禁止改數字；不以語言修訂變更7、8。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:81 | 所在地可否辦理公司登記、稅籍登記及取得營業許可 → 所在地可否辦理公司登記、稅籍登記，以及能否取得營業許可 | 採納：分開「辦理」與「取得」的動詞搭配，保持均須確認可否的原意。
- src/content/columns-zh/017-taiwan-logistics-business-setup.md:53 | 其原則門檻為最低資本額 → 原則上適用的資本額及車輛數門檻為最低資本額 | 採納：說明「原則」修飾適用門檻，並明示原句列出的資本額及車輛數；所有金額、車輛數及例外條件保留。
- src/content/columns-zh/020-taiwanese-spouse-divorce-from-abroad.md:12 | 住在海外也未必當然免予到場 → 住在海外，也不當然可以不到場 | 採納：精簡疊加的保留語，維持海外居住不當然免除到場的原意；法院命到場的主張與條號保留。
- src/content/columns-zh/022-marrying-taiwanese-national-registration-checklist.md:30 | 辦了婚宴或簽好書約 → 辦了婚宴或簽好結婚書約 | 採納：依同段結婚登記語境補全文件名稱；不增刪登記要件或引用。
- src/content/columns-zh/015-taiwan-company-setup-pitch-location.md:63 | 重要的不只是書面表述 → 重點不只是文件怎麼寫 | 採納：以自然用語替換抽象名詞；後句實際使用狀況須與申報內容一致的主張不變。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:51 | 辦理公司帳戶時 → 開立公司帳戶時 | 採納：統一同篇「開立公司帳戶」的動詞搭配。
- src/content/columns-zh/018-taiwan-semiconductor-market-entry.md:30 | 承擔責任的事業體 → 承擔責任的事業體 | 不採納：改為契約責任會限縮責任種類；原文同時談進口、僱用及技術支援等活動，追加LAWYER-REVIEW確認，不自行排除其他責任。
- src/content/columns-zh/013-taiwan-company-establishment-advanced-1.md:61 | 如何確保所需的資金、專業知識、人員、交易關係、外部專家等資源 → 如何確保所需的資金、專業知識、人員、交易關係、外部專家等資源 | 不採納：原文要求說明資源如何確保，建議改成是否已備齊，會改變審查資料內容及完成時點，並替換交易關係的意義；追加LAWYER-REVIEW。
- src/content/columns-zh/021-taiwanese-spouse-divorce-cross-border-parenting.md:43 | 行程方便，也不代表條款在另一國能夠執行 → 行程方便，也不代表條款在另一國能夠執行 | 不採納：「行程」已有主詞，「方便」可作謂語；改成「排得方便」「執行得了」屬語氣偏好，原句清楚且較符合法律專欄語體。
- src/content/columns-zh/014-taiwan-mandatory-employment-period.md:50 | 第一項法定基礎／第二項法定基礎 → 第一項法定基礎／第二項法定基礎 | 不採納：涉及法條項次與法定事由的法律表述，且014全文凍結；第50、64行分別追加LAWYER-REVIEW，由律師確認，不改審酌因素標題。

採納 19 筆，不採納 15 筆
