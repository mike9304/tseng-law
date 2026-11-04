---
title: "TWCA SSL/TLS憑證須於11月6日00:00前更換，TLS出問題會讓電子契約無效嗎"
seoTitle: "TWCA TLS憑證更換、完整憑證鏈與電子簽章法"
summary: "TWCA部分TLS憑證的序號實際隨機亂數只有24 bits，低於64 bits以上要求。政府機關9,772張新憑證已重新產製，截至11月2日晚間安裝完成926張，兩個數字不能混用。TWCA要求在11月6日00:00前更換並安裝完整憑證鏈。這次公開資料處理網站安全通訊，沒有認定電子契約無效、私密金鑰外洩或當然賠償。數發部表示將調查違約，並依約罰款及求償。"
published: "2026-11-03"
lastmod: "2026-11-03"
date_display: "2026年11月3日"
read_time: "約4分鐘閱讀"
categories: ["台灣法律資訊"]
topic: "company"
featured_image: "../images/ISSUE-20261103-08-twca-tls-certificate-replacement-electronic-signature-scope/featured-01.webp"
featured_image_alt: "沒有文字的伺服器機櫃與空白合約文件夾"
featured_image_caption: "虛構情境"
social_image: "../images/ISSUE-20261103-08-twca-tls-certificate-replacement-electronic-signature-scope/featured-01.jpg"
faq:
  - q: "9,772張憑證都已經裝好了嗎？"
    a: "沒有這個結論。9,772張是TWCA在11月1日完成重新產製的政府機關TLS憑證數量；截至11月2日晚間，完成更新的是926張。收到新憑證與伺服器完成安裝是不同進度。"
  - q: "TLS憑證更換會讓所有電子契約無效嗎？"
    a: "不會因此一律無效。TLS用於網站安全通訊。電子簽章法第4條規定，符合本法的電子文件及電子簽章，不得僅因其電子形式否認效力。第6條則是使用許可憑證機構的憑證，且未逾有效期間及使用範圍時，才推定為本人親自簽名或蓋章。本次公開資料沒有認定任何電子契約的簽署無效，也沒有指出哪一份數位簽章因此不符第6條。"
  - q: "使用者可以自動求償，或TWCA會自動被撤照嗎？"
    a: "都不能這樣認定。電子簽章法第14條的賠償有損害、因果關係、無過失抗辯與使用範圍等問題。第16條在未經許可就簽發憑證且情節重大時，是「得」停止一部或全部業務。第17條沒有停止業務或撤銷許可。數發部11月2日公布的是將調查違約，並依約罰款及求償。"
audience: ["zh-hant"]
---

# TWCA SSL/TLS憑證須於11月6日00:00前更換，TLS出問題會讓電子契約無效嗎

TWCA部分TLS憑證的序號隨機亂數未達國際標準要求的64 bits以上，[數位發展部11月2日新聞稿](https://moda.gov.tw/press/press-releases/21226)因此公布更換進度。網站管理者要換新憑證，也要安裝完整憑證鏈。

序號欄位雖設計為128 bits，實際只有首尾各12 bits是有效隨機數，中間填入定值。有效亂數合計24 bits。

這次事件涉及962個政府機關。TWCA已在11月1日完成9,772張政府網站TLS憑證的重新產製，系統將新憑證檔寄給原申請機關承辦人。截至11月2日晚間，完成更新的是926張。重新產製不等於已安裝。

## 11月6日前要換的是完整憑證鏈

[TWCA更換公告](https://www.twca.com.tw/news_detail/5f3395bf-bef6-4b40-b922-ceac4b06bf53)說明，這次以新中繼憑證重新簽署，沿用原金鑰核發。原中繼憑證須在2026年11月6日00:00前廢止，使用者應在廢止前完成更換。

公告特別要求，安裝時務必包含完整憑證鏈。只收到電子郵件附件還不夠，伺服器設定也要完成。數發部表示，相關網站若未在11月6日前更新，民眾瀏覽時可能出現安全性警示訊息。

## TLS與數位簽章憑證的功能不同

TLS憑證用於建立網站安全通訊。[電子簽章法第2條第1項第3款](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=2)所稱數位簽章，是電子簽章的一種：將電子文件以數學演算法或其他方式運算為一定長度的數位資料，以簽署人的私密金鑰加密，得以公開金鑰驗證，並具憑證機構簽發的憑證。用途不同。兩類憑證不能只因名稱相近就互相套用法律效果。

[同法第4條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=4)規定，符合本法的電子文件及電子簽章，在功能上等同實體文件及簽章，不得僅因其電子形式否認法律效力。本次公開資料處理TLS序號與更換，沒有認定某份電子契約的簽章不符本法，不能據此說所有電子契約無效。

[第6條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=6)另規定，以數位簽章簽署電子文件，要使用主管機關依第12條或第15條許可的憑證機構所簽發憑證，而且憑證未逾有效期間及其使用範圍，才推定為本人親自簽名或蓋章。本次公開資料沒有指出哪一份電子契約的數位簽章因此不符這兩款。

公告具電子簽章效力的電子簽章技術並適時檢討，規定在[第2條第2項](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=2)。[第3條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=3)明定主管機關為數位發展部。這次TLS新聞稿本身，不是第2條第2項所說的電子簽章技術公告。

## 許可、賠償與罰則各有要件

[電子簽章法第12條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=12)要求憑證機構將憑證實務作業基準送主管機關許可後，才提供簽發憑證服務；變更時也要送許可，並將經許可的內容公布在網站。現有資料沒有認定TWCA未經許可提供服務，不能從序號事件直接推出這個結論。

[第14條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=14)規範認證服務作業造成損害的賠償責任。當事人受損，或善意第三人因信賴該憑證受損，憑證機構原則上負賠償責任；能證明行為無過失的，不在此限。憑證使用範圍有明確限制時，對逾越該範圍所生損害不負賠償責任。是否賠償仍須個案檢視，不會因更換通知自動成立。

[第16條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=16)處理憑證實務作業基準未經主管機關許可就提供簽發憑證服務：應令限期改正，並得處新臺幣100萬元以上500萬元以下罰鍰；屆期未改正者按次處罰；情節重大者，並得停止一部或全部業務。停止業務的用字是「得」。這條沒有當然撤銷許可。

另外兩種情形規定在[第17條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=17)：未依已經許可的憑證實務作業基準提供服務，以及變更基準未送許可就依變更後內容提供簽發憑證服務。應令限期改正，並得處新臺幣5萬元以上50萬元以下罰鍰；屆期未改正者按次處罰。第17條沒有停止業務，也沒有撤銷許可。

現有資料沒有認定TWCA該當第16條或第17條。數發部11月2日公布的是將調查違約，後續依約罰款及求償。

數發部11月2日表示，目前未造成具體資安危害；公開資料也沒有私密金鑰外洩的確認。這是截至該日的資訊，不能代替後續獨立檢測。網站管理者要核對完整憑證鏈與11月6日00:00期限；契約爭議則須回到實際簽署文件及所用憑證。

昊鼎國際法律事務所  
聯絡信箱：[wei@hoveringlaw.com.tw](mailto:wei@hoveringlaw.com.tw)  
臺北事務所：103 臺北市大同區承德路一段35號7樓之2  
臺中事務所：40453 臺中市北區館前路19號6樓之1

虛構情境

## 參考資料

- [中央社，TWCA憑證序號與政府機關更新進度，2026年11月2日](https://www.cna.com.tw/news/afe/202611020325.aspx)
- [數位發展部，TWCA憑證重新產製與更換說明，2026年11月2日](https://moda.gov.tw/press/press-releases/21226)
- [TWCA，SSL更換憑證公告，2026年10月31日](https://www.twca.com.tw/news_detail/5f3395bf-bef6-4b40-b922-ceac4b06bf53)
- 電子簽章法：[第2條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=2)、[第3條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=3)、[第4條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=4)、[第6條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=6)、[第12條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=12)、[第14條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=14)、[第16條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=16)、[第17條](https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=J0080037&flno=17)

確認日期：2026年11月3日。本文不推定私密金鑰已外洩、已有損害賠償責任或憑證機構許可已受處分。
