# 繁體中文 ARC 修訂版獨立審查

最終判定：PASS。R0提出的R1、R2兩處數字密集長句，已由作者修補並經本審查者獨立複核。沒有未解決的重大語言、法律保全或圖片文字問題。以下保留初審與修補證據，不能將初審REQUEST_CHANGES誤讀為最終狀態。

## 最終核可版本

| 文章（repository相對路徑） | 最終SHA-256 | 最終判定 |
|---|---|---|
| `src/content/columns-zh/704-taiwan-arc-first-application.md` | `6d0d65d51ccf9540482ffc1415d2f5fde6f94ddb1f7937616383cfd0f7dd84b2` | PASS |
| `src/content/columns-zh/705-taiwan-visa-residence-work-study-family.md` | `e340cf83d1c1aa9a0586cd5a82ab213535771cdd44f21935164a671d2b65b886` | PASS，未修改 |
| `src/content/columns-zh/706-taiwan-arc-renewal-changes-reentry.md` | `c4dac93399307ffdbc940cdc53e013129e84c762db1e9524cdd501fbb3fd4c77` | PASS |

審查日期：2026-10-24。審查者：獨立 AI 繁體中文編輯 `/root/review_rev2_zh`，未參與這三篇文章的撰寫或修訂；不是人類母語者或執業律師。本輪未修改任何文章，只寫此報告。基準為 git `174454bd4bb8d9e05627d71f9ef0af646540b3e4`。

## R0初審版本（歷史）

相對路徑以 `/Users/son7/tseng-arc-revision-20261024/repo/` 為根。

| 文章 | SHA-256 | 結果 |
|---|---|---|
| `src/content/columns-zh/704-taiwan-arc-first-application.md` | `4a65ddcc93d2ef5c1764370596bcf1b7d06f1b18c5a69b26298b46ab075d614b` | REQUEST_CHANGES：R1 |
| `src/content/columns-zh/705-taiwan-visa-residence-work-study-family.md` | `e340cf83d1c1aa9a0586cd5a82ab213535771cdd44f21935164a671d2b65b886` | PASS |
| `src/content/columns-zh/706-taiwan-arc-renewal-changes-reentry.md` | `02eb7fdebb7a8ba0f22daa9cb2013a68278668c62f63863ff4ef9c9ba867075f` | REQUEST_CHANGES：R2 |

已全文閱讀三篇基準稿、三篇凍結修訂稿、`zh-hant-author.md`、`source-refresh.md`、REVISION-BRIEF、INDEPENDENT-REVIEW、repository AGENTS、EDITORIAL-VOICE、COLUMN-VOICE-RULE、SENTENCE-VARIETY-RULE、LESSONS、editorial skill 及 review-criteria。作者報告於本人的稿件閱讀、比較與 CLI 後出現；下列判斷不是轉錄作者自檢。

## R0必修項目（均已結案）

| File:line | 精確原句 | 原因與證據 | 建議修法 | 法律意義是否保留 |
|---|---|---|---|---|
| `src/content/columns-zh/704-taiwan-arc-first-application.md:62` | 「一般ARC依[移民法第22條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22)最長為3年；與在台居住且設有戶籍國民結婚、初次申請依親居留的外籍配偶，依[居留辦法第12條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080129&flno=12)最長1年。」 | R1。分號把一般上限與特定首次依親上限壓成一句，包含22、3、12、1四個數字。讀者要記兩種對象與兩個上限；原稿分句反而較清楚。違反多樣性規則§2-8的一句最多三個數字。這不是法源有誤。 | 把「最長為3年；與」改為「最長為3年。與」，其餘文字、條件和連結原樣保留。 | 是。只改句界；3年／首次國人配偶1年與其限定身分均不變，後面的特定專業人才5年也不變。 |
| `src/content/columns-zh/706-taiwan-arc-renewal-changes-reentry.md:62` | 「[居留辦法第10條、第11條](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129)分別規定特定對象的延期期間：符合第10條的應聘、投資等外國人，經許可可延6個月，必要時再申請一次，合計最長1年；符合第11條的正式學制畢業者，經許可可延1年，必要時再申請一次，合計最長2年。」 | R2。單一句含法條10、11、10、11及6、1、1、2四個期間數值，並用冒號及分號連接兩種制度。這種高度壓縮使讀者難以把各自資格與期間對上；自動checker仍PASS，須人工攔下。 | 改為三句：「[居留辦法第10條、第11條](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129)分別規定特定對象的延期期間。符合第10條的應聘、投資等外國人，經許可可延6個月，必要時再申請一次，合計最長1年。符合第11條的正式學制畢業者，經許可可延1年，必要時再申請一次，合計最長2年。」保留前面的讀者問題與第64行共同申請條件。 | 是。每一條的適用對象、許可、再次申請及總期間不變；沒有把可申請改為自動延長。 |

MONOTONY: 法條與數字壓成固定比較長句 — 「最長為3年；與……最長1年」「合計最長1年；符合第11條……合計最長2年」 — 依各自制度分句，不增添泛泛的提醒或湊短句。

兩項都屬語句與閱讀性修補，不是實質法律修正。沒有要求作者為了增加短句比率而刪減條件。其餘輕微措辭選擇不足以構成反覆重寫的理由。

## 實際語氣與結構：已改善的證據

本輪不是因數值PASS就接受原稿。逐篇閱讀標題、摘要、開頭、小標、FAQ及結尾後，可以指出實際改善：

- 704原稿「先確認資格」「選項要對」單獨成句，沒有告訴讀者要確認什麼；新版第34行說明聘書等文件證明來台目的，第54行則直接區分人資辦專業工作者、家庭雇主辦看護工的資格和文件。第36行「文件怎麼準備」接真實文件清單，並非每節都套三項清單。第58、64行拆開規費與領卡，現在讀者可按程序找資料。
- 705原稿「工作內容先確定」「華語中心另算」「先看家人的身分」是短促的指令串；新版第38行「聘書不等於工作許可」直接回答聘書與許可的關係，第50行交代華語停留簽證的起點，第58行接家人身分與規則的實質差別。必需的限制仍在，但不再每段用「先核對／不能套用」收尾。金卡與數位遊牧段各有對象和活動範圍，沒有把短期停留宣傳成一般工作資格。
- 706原稿「證明要能反映現在」「同一天可能發生多件事」「不要再等下一個發薪日或學期」分別是抽象要求、泛泛情境與訓誡。新版第34行直接說明在職、在學和依親文件；第52行解釋離職、工作許可、搬家可能各有日期；第84行留下立即處理逾期與法律條件，刪掉沒有事實依據的拖延情境。除R2外，長短交替大多服務於實際程序，沒有用無內容斷句湊數。

短句中「正本查驗後退還」「補正後重新起算」「父母不在這份名單內」分別給出原件處理、審核時間及眷屬範圍，保留有意義。「這次從發生當日起算」與較早的搬家次日起算相接，雖可另作措辭選擇，並非無資訊的裝飾；不把所有短句一律判成AI痕跡。

## 第一、二段刪除測試

| 文章 | 逐句刪除後損失的資訊 | 結論 |
|---|---|---|
| 704:26、28 | 刪首句，讀者失去持居留簽證後另向移民署辦ARC的程序及縮寫全名。刪第二句失去獲准居留與入境次日起30日；刪第三句失去有效整合證件例外。刪第二段則失去境內改獲簽證「簽發日起」這個不同的起算點。 | 兩段保留，沒有可刪的本文預告或情緒代言。 |
| 705:26、28 | 第一個問題明確提出聘書／入學許可與免簽入境的決策，後句「這條申請途徑」需要它；回答則區分專業人才與學習路徑。第二段首句交代國籍、入境方案及活動，次句補目前所在地與向受理機關提出資料的動作。刪掉會少掉判斷程序所需資料。 | 保留。語言／法律身分的旁枝已移到範圍附註；不再以這類meta說明開場。 |
| 706:26、28 | 第一段給搬家次日起30日及服務處所變更，同時解答卡片尚有半年是否能等。第二段加入原原因仍存在、到期前3個月的一般延期及實際協助辦理所需的異動日。刪任一段都會把兩種期限的關係講得不完整。 | 保留。兩段具體情境與義務各有作用，不只是換句話重述標題。 |

## 獨立比較三篇近期繁中刊文

依 `published` 選取排除704–706後的最新同日批次最高三個編號，均為2026-10-22；實際讀了全文。以下比較的是文體，沒有替比較稿重新背書其所有法律內容。

| 比較稿 | 具體開頭、標題及結尾觀察 | 對本次判斷的影響 |
|---|---|---|
| `src/content/columns-zh/650-taiwan-mixed-family-baby-surname-chinese-name-passport-home-registration.md` | 開頭直接寫60天未報戶口及催告後登記、抽籤定姓的結果；小標「中文名字的規矩」與「英文名字跟著先拿到的文件走」對應兩種文件。結尾卻轉為律師能協助事項與地址。 | 704／706同樣從特定義務與日期入手，但沒有照搬家庭場景或服務段落。650並非每一段都是可取的模板。 |
| `src/content/columns-zh/651-taiwan-contract-penalty-clause-reduction-civil-code-252-2026-judgments.md` | 「先從沒減到的那一件說起」是可省的鋪陳；「沒有減到的日商」「每日1%，減成千分之一」則確實具體。結尾回到「並應賠償」四字，前面仍有長篇服務宣傳。 | 705按工作、學習及家人身分組織已足夠，無須硬套判例敘事。三篇ARC結尾分別落在核定文件、到職開學日期、事件與返台日，沒有複製該服務結尾。 |
| `src/content/columns-zh/652-taiwan-hospital-death-autopsy-request-complaint-medical-mediation.md` | 首句「提告之後……送去調解」直接給程序結果；「遺體還在的時候」對應不可逆的時間問題。但「道歉歸道歉。證據要另外留」是較突出的短句節奏，結尾也有服務清單。 | 706以搬家後先發生的登記義務開場有同樣的具體性；不能把652的情緒張力或刻意斷句當成所有行政程序文章必備風格。 |

比較資料足三篇，沒有缺少第三比較稿。三篇ARC不靠同一假想人物或一律「三步驟」來維持系列感。

## 來源、條件、數字與服務內容

逐段對照基準稿，另以Python擷取 Markdown URL 做Counter比對。三篇的全部官方、內部及mailto URL，其出現次數均完全一致：removed `{}`、added `{}`。不是僅檢查連結總數。已檢查每個法源仍貼近原本支持的主張。

全文數字差異另行解讀：704少一個`30`是標題改寫，不是刪了期限；706新增阿拉伯`3`對應原先首句的中文「三個月」。圖片檔名新增`20261024`／`v2`不算法律數字。沒有把字面數字相同當成條件正確的全部證據。

- 704保留：入境次日30日與境內簽發日起30日；整合證件例外；照片2年與在職／在學1個月；國人配偶同行；海外文件驗證與譯本；年費1,000、未滿1年按1年、加收2,200、僑生減半；一般3年／首次國人配偶1年／受聘特定人才5年；10個工作天、補正重算、通知次日起15日、海外文件3個月；學生5工作天審查、核准後5工作日繳費、繳費後3工作日領卡、6個月以下電子卡。R1只涉及這些既有上限的句界。
- 705保留：專業人才資格＋工作許可／免許可＋入境方式三條件；限制方案與法令例外；正式就學限制；華語認可機構4個月、續註冊至少3個月、週一至五15小時、缺課含請假四分之一；在學20小時與寒暑假除外；依親60日以上停留簽證及限制註記；第16條眷屬範圍；不同配偶的工作資格；金卡1至3年；數位遊牧免簽國籍及境內勞務範圍。沒有把在學規定擴張為畢業後一概不得工作。
- 706保留：一般延期3個月；搬家／服務處所次日起30日；原因變更當日起30日、其他路徑15日；華語6個月及總2年；創業有事業4個月／無事業另途徑3個月、金卡4個月；依親期限與例外；新雇主許可的原則及個人／免許可例外；原因消失及繼續居留的條件；6個月加一次最長1年、畢業1年加一次最長2年且到期前提出；護照更新沒有新增共通30日；補發500元及海外／舊式移工差異；再入境許可與永久居留例外；有效ARC／APRC的護照效期前提；逾期未滿30日、原因存在、處罰後重申請。R2未要求改動任一條件。

本輪本人另外實際開啟並核對 [移民法第22條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=22)、[第31條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=31)、[居留辦法現行全文](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129)第7、9、10、11條、[規費標準現行全文](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080135)第3、7、10條、[專業人才法第16條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030295&flno=16)、[移民署一般居留須知](https://www.immigration.gov.tw/5385/7244/7250/7317/%E5%B1%85%E7%95%99/29996/)的相應條件。個別第7條直連曾Internal Error，改讀同一官方現行全文；未當作條文不存在。

全面官方更新使用研究員 `work/research/source-refresh.md` 的R01–R22與行政細節。已讀其施行區分及資料截止日限制：現行規範不是草案，專業人才法2026-01-01與2026-06-30施行部分都已過施行日；未聲稱逐一自行重開全部官方頁面。第12條應屆副學士以上畢業生在合法延期居留期間的工作免許可提醒，沒有與本次三稿衝突，也無需硬塞新段落。

另實際開啟[事務所繁中聯絡頁](https://tseng-law.com/zh-hant/contact)：`wei@hoveringlaw.com.tw`、簽證／居留詢問與四種實際諮詢語言（中、英、韓、日）相符。706第86行只詢問能否安排諮詢，不保證代辦或結果，也未要求先寄護照影本；三稿沒有增加其他服務語言、外國執照、客戶案例或公開作者。

## 圖片與對外表述

本人用view_image看了三個實際WebP檔，不僅核對作者提供的描述：

- 704：桌上素面藍色冊子、紙製資料夾、空白卡片與筆；窗外台北天際線。alt列出的冊子、資料夾與卡片都存在，caption清楚是示意且非真實證件。
- 705：闔上筆電、三本書、兩個杯子與素面冊子；窗外台北。alt與caption相符，沒有把兩個杯子說成真實夫妻或宣稱特定人的案件。
- 706：空白筆記本、素面冊子、小卡、鑰匙及旅行袋；窗外台北。alt正確描述主要物件；未列旅行袋或背景不構成錯誤。caption沒有把卡片當官方證件。

三圖皆插畫靜物，無人臉、可讀官方證件、標誌或國旗。各稿frontmatter指向指定的唯一題別圖片，沒有重複inline圖片。實際頁面是否顯示由root做整合驗證，本報告不冒充瀏覽器或線上部署測試。

全篇掃描無`**`、`__`、`<strong>`或`<b>`強調。內部`author: legal-ai-assistant`仍在；本文、FAQ及圖片文字沒有公開作者、原生人類審查或律師審查宣稱。

## CLI與第5節人工複核

本審查者分別實際執行：

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-zh/704-taiwan-arc-first-application.md
exit 0; sentences=48 mean=32.9 cv=0.536 short=0.146 run3=0.109 opener_rep=0.111 cite_end=0.042 cite_para=0.278 contrast=0 caveat=0 q=0
OK — no variety limit violated

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-zh/705-taiwan-visa-residence-work-study-family.md
exit 0; sentences=54 mean=36.1 cv=0.507 short=0.148 run3=0.019 opener_rep=0.105 cite_end=0.037 cite_para=0.526 contrast=1 caveat=0 q=2
OK — no variety limit violated

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-zh/706-taiwan-arc-renewal-changes-reentry.md
exit 0; sentences=67 mean=35.2 cv=0.521 short=0.119 run3=0.031 opener_rep=0.192 cite_end=0.075 cite_para=0.423 contrast=0 caveat=0 q=2
OK — no variety limit violated
```

人工§5逐項：

1. 三次CLI都是實際測量的exit 0／FAIL 0，非短輸入跳過；數字密集問題不在checker涵蓋內，另列R1／R2。
2. 無「假設」模板。三篇開頭各為取得簽證後的申請義務、免簽銜接居留的問題、未到期已搬家的登記義務。
3. 三篇都超過兩個有資訊的短句。整體段落非等長；R1／R2需要減少單句資訊負荷，不需刪除法律內容或增加填充句。
4. 實際垂直讀段首，沒有「這／依／若」三段起頭或連續單一口吻；較長706的一般案件／一般延期各有具體對象。
5. 沒有連續三段「主張（法條）→但書」；文件整理、申辦追蹤及行程安排有不帶引文的實務段落。必要法律主張仍有來源。
6. 必要區別如聘書／工作許可、在學／畢業、卡片到期／搬家登記仍在；沒新增未被讀者提出的假想反駁。對比標記數為0／1／0。
7. 704第76行結在異動期限可能早於到期；705第72行結在到職、開學及家人日期；706第86行結在三種日期與資料。沒有固定販售結語；資料日與適用身分附註為結構性尾註。
8. 臺灣繁中用字與全形標點一致；無簡體、韓文語序、虛構第一人稱、粗體、固定命令清單式標題或公開作者。KO／JA語尾檢查不適用。
9. 逐段數字、AND／OR資格、例外、允許／義務、原官方及內部來源均保留。R1／R2只能改句界，不授權變動法律含義。

## R0未解決與下一步（歷史，已由以下R1複核結案）

未解決僅R1、R2。請原作者各拆開指定句界後，重新凍結704與706；本人將只重讀受影響段落、FAQ／結論、執行相關兩個CLI並確認最新雜湊。705現雜湊已PASS，不需要重寫。此為繁中三篇的獨立編輯及法律保全檢查，不等於整批42篇最終法源審查、真人／律師審查或發布證明。

## R1修補獨立複核：PASS

作者回傳後，實際重新讀取704第58–82行與全部FAQ、706第58–88行與全部FAQ，並核對結尾、法源和全文SHA。修改確實只落在指定兩處：

- 704第62、64、66行分開一般ARC3年、首次依親國人配偶1年與受聘特定人才5年。各段以其適用對象起頭，接自己的法源和上限，並保留依資格文件核定的解釋。未用泛泛短句補節奏。
- 706第62、64行分開第10條與第11條；每條先寫經許可取得的期間，再寫必要時可再申請一次及合計上限。第66行的原期限屆滿前提出、符合法定身分條件和沒有自動延長仍完整。
- 本人將目前兩段在記憶體逆轉成R0原句，再計SHA，得到704 `4a65ddcc93d2ef5c1764370596bcf1b7d06f1b18c5a69b26298b46ab075d614b`、706 `02eb7fdebb7a8ba0f22daa9cb2013a68278668c62f63863ff4ef9c9ba867075f`，均精確等於初審SHA。這確認全文其餘部分未變；不是只依作者宣稱認定範圍。
- 最終704 URL multiset與基準仍完全相同。706沒有少任何URL，只因兩個制度各自附連結而多出一次既有的 `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080129`；它仍支持第10、11條各自的主張。URL集合沒有變更。705的全文SHA完全不變。

本人再次執行的CLI：

```text
python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-zh/704-taiwan-arc-first-application.md
exit 0; sentences=49 mean=32.2 cv=0.531 short=0.143 run3=0.128 opener_rep=0.1 cite_end=0.041 cite_para=0.35 contrast=0 caveat=0 q=0
OK — no variety limit violated

python3 /Users/son7/tseng-lanes-shared/variety/variety_metrics.py check /Users/son7/tseng-arc-revision-20261024/repo/src/content/columns-zh/706-taiwan-arc-renewal-changes-reentry.md
exit 0; sentences=70 mean=33.5 cv=0.476 short=0.114 run3=0.029 opener_rep=0.185 cite_end=0.071 cite_para=0.444 contrast=0 caveat=0 q=2
OK — no variety limit violated
```

人工§5複核：受修句子數字負荷已下降，各項資格與最長期間沒有因斷句而改變；新增段首為具體對象而非重複提醒。開頭、FAQ、必要例外、實際圖說及結尾未改；R0其餘檢查持續適用。R1、R2均關閉。

最終未解決事項：無。本報告僅認定列出的三個精確版本可交下一步整合與整批最終審查，不宣稱已重新部署、做過瀏覽器畫面驗證或取得人類／律師簽核。
