# 089 四鏡頭還原大貨車攔擋：發布稽核

本次只整合繁體中文已審專欄及代表靜態圖，沿用 Git→Vercel 和 `/zh-hant/traffic-accidents`。明確標記 `traffic-accidents`、`traffic-evidence`，按本文重點「不同鏡頭如何補足證據」自動收錄至證據分類；不是用標題關鍵字推斷。原中文標籤保留。未複製不存在的翻譯、未添加影片或影片徽章，R7 仍為 HOLD。最新使用者要求後續只發專欄；影片由使用者製作上傳。

## 版本與授權

在乾淨獨立 checkout 以最新 origin/main `439a2da154658ceedf216940f79441efd3aa0b61` 為基礎，保留該提交既有的韓文公開影片與程式。使用者/Grok 的 Studio checkout 未改動。未新增影片製作、語意審查或整合；只對既有公開媒體作技術回歸。

- 原稿 SHA256 `15dac09279a6a073a6bababfb5a6b485c53a070df084ecfad113bb4c98273822`。只增發稿 frontmatter，正文位元組完全不變。
- 代表圖 1600×900／172866 bytes／SHA256 `e83467eb3be947f68070bca6cd213bd3c88e830a68ebb2347059b5b468f39c51`，Library `libfile_3f28ae6027348191b977ab0ba4c019d6` v0。
- 發布包 Library `libfile_ab5ff33a60f881919144956ea1d588b8` v0，SHA256 `688e6c9b9f58b3ba123df2948c78a3a89fade1f20e38e6a17a718e96d537168c`。83個封裝成員全部對上本地；兩份清單414筆、332個不同檔案的雜湊全部一致；xattrs身分及版本一致。
- 實際起稿 runtime `gpt-6-astra`；三輪 Claude Code 的 init/assistant/modelUsage 均 `claude-opus-5-5`。第一輪 REVISE、第二輪 PASS、第三輪精確本文及metadata PASS。前兩輪含實際WebP與alt/caption；第三輪明示未重新檢視圖片。圖片與圖說自第二輪PASS後未變。本發布者未追加外部模型呼叫。
- 第三輪prompt含逐字最終本文與metadata；第二輪JSONL的base64與交付WebP逐位元組相同，alt/caption逐字相同。沒有以正文第三輪冒稱第三次照片檢視。AI作者、AI審查與人類律師簽核不同，維持`legal-ai-assistant`。

發稿者實際檢視代表圖：桌上無可辨品牌行車紀錄器、讀卡機、闔上的灰褐色筆記本；不是現場、車禍照片或本案扣得物。ALT與緊鄰可見caption保留核准原文；未另下載上游原圖或宣稱檢視原圖。

## 法律與來源範圍

重新取得9個官方來源：完整判決PDF、判決列印HTML、歷審JSON與列印頁、現行24及43條、修法歷史、2021-01-20與2022-05-04歷史全文。PDF位元組相同；HTML僅正規化空白、公共瀏覽/訂閱計數與列印時間後一致；歷審JSON仍count=0/list=[]。讀完6頁判決並實際檢視第4頁四鏡頭勘驗渲染。正文15次官方連結（7個不同目的地含PDF頁錨點）保留原URL。

本案是行政處分撤銷訴訟駁回，維持18000元、吊銷駕照與講習；不是傷害罪定罪或民事比例裁判。保留貨車先插入紅車前方、紅車才鳴喇叭的時序；貨車⒈鏡頭未註明方向，不改成前向。右側後視鏡頭為持續左轉貼近。08:22/08:25及異常日期未校準，不能相減推算反應時間/速度。當年43條上限24000與現行36000分開，18000非固定現行額。判決另引牌照3月與2021全文6月的差異只記在來源ledger；本文不涉及車主另案，不加入無效推論。歷審空白不代表未上訴或已確定；送達後20日告知與未知後續狀態原文保留。未取得原始影片。

公開sitemap1646個地址與製稿快照無增減；76篇繁中公開快照的製稿查重、發布repo slug及完整正文hash再次核對，未重複。新地址限繁中一個。嵌入向量列入既有pending清單，未造向量或呼叫付費API。

## 實際開頭比較

本篇第一句記述有爭議的駕駛說法；刪去會失去與法院認定的區別。第二段明確限定行政訴訟、處分金額與非刑/民事比例範圍。與前3篇的民事共同損害、故意煞車刑責、租車費證據開頭不同；不加通用導語。未更改任何核准句子，法律意思與來源均保存。以下為實際首兩段（不把作者列算正文段落）：

### 089-taiwan-truck-blocking-multiple-dashcam-evidence.md

大貨車駕駛說，自己轉彎切入內線後，是紅色小客車向前撞上貨車側邊；這是一般交通意外，駕駛否認故意撞擊，更沒有逼對方讓道。臺中地方法院勘驗雙方行車紀錄器後，認定的卻是另一段經過：貨車加速貼近、超越並阻擋紅車路線，最後故意以撞擊方式攔擋。[判決三，第2頁](https://data.judicial.gov.tw/opendl/JDocFile/TCDA/111%2C%E4%BA%A4%2C12%2C20220902%2C1.pdf#page=2)；[五㈡，第3頁](https://data.judicial.gov.tw/opendl/JDocFile/TCDA/111%2C%E4%BA%A4%2C12%2C20220902%2C1.pdf#page=3)；[五㈢，第5頁](https://data.judicial.gov.tw/opendl/JDocFile/TCDA/111%2C%E4%BA%A4%2C12%2C20220902%2C1.pdf#page=5)

駕駛原先被裁處罰鍰18,000元、吊銷駕照，並應參加道路交通安全講習。駕駛請求撤銷處分，臺中地院於2022年9月2日以111年度交字第12號判決駁回。這是交通裁罰的行政訴訟，不是刑事傷害罪判決，也沒有分配兩車的民事賠償比例。[判決二及主文，第1頁](https://data.judicial.gov.tw/opendl/JDocFile/TCDA/111%2C%E4%BA%A4%2C12%2C20220902%2C1.pdf#page=1)

### 088-taiwan-racing-no-contact-joint-tort-liability.md

兩車在國道上競速、互相逼車，最後其中一車撞上未參與競速的第三人車輛，造成駕駛死亡。另一名參與者未與被害車輛碰撞，也要賠償嗎？車輛有沒有接觸，是重建事故的重要事實，卻不能單憑這一點劃定責任。法院還要追問：未與被害車輛碰撞的那名駕駛，是否也以有過失的行為，共同造成這場事故及其損害。

臺灣雲林地方法院2023年9月18日作成的112年度簡字第58號民事簡易判決，處理的正是這個問題。兩名駕駛競速逼車，其中一人追撞第三人的車，造成該名駕駛死亡。法院認定，兩人的過失行為都是死亡結果的共同原因，因此應負連帶賠償責任。[一審判決](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=ULDV%2C112%2C%E7%B0%A1%2C58%2C20230918%2C2)

### 087-taiwan-retaliatory-driving-rear-ended-intentional-injury.md

車尾被撞，前車駕駛卻被判傷害罪，乍看似乎與一般人理解的追撞事故相反。但碰撞位置只能說明車輛在哪裡接觸，不能單憑這一點，決定誰有刑事責任。這件屏東的案件，法院追問的是：碰撞之前，前車駕駛做了什麼？那些動作與騎士受傷之間，又有什麼關係？[一審判決](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=PTDM%2C113%2C%E4%BA%A4%E8%A8%B4%2C29%2C20240613%2C1)

事情發生在2022年2月3日。依一審認定，貨車駕駛與機車騎士先有行車糾紛，分開後，之後在屏東縣萬丹鄉社皮路2段再相遇。機車在後方緊跟並鳴喇叭，貨車駕駛朝騎士方向丟出裝有半瓶液體的寶特瓶，接著無故向右偏駛並煞車。騎士未保持隨時可以煞停的距離，來不及煞住，車頭撞上貨車右側車尾，倒地受傷，造成右上臂靠近肩部骨折及多處擦挫傷。[一審判決](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=PTDM%2C113%2C%E4%BA%A4%E8%A8%B4%2C29%2C20240613%2C1)

### 086-taiwan-car-repair-rental-cost-repair-period-evidence.md

租車單能證明租了多久，卻未必能單獨說明：為什麼這段期間都需要替代車輛，以及費用為何應由事故對方負擔。

臺灣嘉義地方法院朴子簡易庭113年度朴簡字第210號民事判決，作成於民國114年3月6日。原告主張車輛受損後租車代步，共支出租車費用新臺幣127,400元，但訴訟中只請求一個月的42,800元；被告則抗辯，應以實際維修天數計算。（[判決事實及理由一、二、三㈡⒊](https://judgment.judicial.gov.tw/FJUD/printData.aspx?id=CYEV%2C113%2C%E6%9C%B4%E7%B0%A1%2C210%2C20250306%2C1)）

## 發布驗證

本地 typecheck、lint、production build、273 mutation handler guard 檢查通過（4個既有allowlist）；21個相關測試檔共89項通過，包括CMS可見性、既有generated-video元件、新文原稿hash、正確分類與搜尋、無假影片、無跨語複製。沒有新增依賴或改動共用產品UI。

實際Chromium/WebKit/Firefox：本文8条件（320/390/1440px及noJS），掲示板15条件（4語），本文與掲示板範圍axe違規0。表格為3欄4列，手機鍵盤/橫向捲動可達右側欄，無整頁橫溢；核准caption可見、圖片1600×900，無新影片請求。實際檢視390px主圖、手機表格起點/終點及桌面表格截圖。文章返回交通hub、22篇最新排序、相關文章、搜尋/空結果/篩選/解除/重載/返回通過；證據類6篇，搭配影片篩選仍2篇。

慢速HTML測試：本文5条件含16次導覽及noJS；掲示板5条件含24次導覽及noJS，全部通過。另檢查既有家人看護費/工作損失表格6条件。原14篇交通圖解共28次啟動、56個來源URL保留。現有R4 Chrome/WebKit 1440/350各4条件完整再播、10資產SHA、8影片Range206通過。已公開439a2da韓文影片另以1440/390測試原生鍵盤播放/暫停/seek/結束，2資產SHA與MP4Range206一致；僅技術回歸，沒有新增語意审查或任何影片內容。

原稿40個文字段/列表項/表格儲存格逐項出現在SSR正文；7個不同官方連結目的地（含頁錨點）、AI作者、canonical、Article、OG圖片、圖說、單一新sitemap URL及照片公開hash通過。本地保留原1646網址，新增僅繁中一個。公開部署後會再次驗證，運營結果保存於獨立證據目錄，不預稱已完成。

全套npm qa並非PASS：typecheck/lint通過後，1393檔/13656項中13失敗、13628通過、14略過、1todo。對最新未改動439a2da的獨立archive，同組baseline與candidate均重現13項非seed失敗，包括既有固定數量/順序、舊summary/embedding覆蓋及全文搜尋日期邊界。另candidate比較組有3個LocalJsonWriteConflictError；單獨seed檔再次比較，baseline2/candidate1同類衝突；完整candidate QA則0個seed衝突。故不宣稱解決此既有不穩定問題。相關89項及新文2項都通過。

既有全文搜尋的blog adapter將日期型publishedAt轉成UTC午夜：臺灣10月3日、UTC仍10月2日時，同日文章可能等到00:00UTC（臺灣08:00）才納入全站搜尋。baseline pending搜尋測試已在前篇088失敗。此次維持真實臺灣發稿日期，不回填假日期或改共用排程語義；新文直接網址與交通掲示板搜尋另已驗證。新文向量pending明列，無付費嵌入API或假造向量。

Next build自動生成的next-env/tsconfig路徑已還原到原HEAD位元組。保留既有ContactEditorial autoprefixer警告。未測真實iOS/Android/Safari裝置或實際螢幕閱讀器；axe限定正文與掲示板，非宣稱全站無障礙合格。
