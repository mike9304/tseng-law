# mn repair round 1 (response to reviews/codex-mn-r1.md)

Date of checks: 24 October 2026. Statutes re-fetched with `tools/law.py`; WDA FAQ, NPA system page and the Foreign Professionals Act history page fetched with curl. Edited only `drafts/mn/816-*.md`, `817-*.md`, `818-*.md` and this file. `work/mn-author.md` was not edited (see the note at the end: parts of it are now superseded).

Result: all 12 MUST items ACCEPTED (no rebuttals); the SHOULD item in 818 ACCEPTED; SHOULD S1 in 816/817 (variety command misclassifying the files as Korean) needs no text change.

## 816

### M1 student application (ACCEPTED)
Check:
- Reg. art. 53 (N0090027): 第四類外國人申請工作許可，應備下列文件：一、申請書。二、審查費收據正本。 The applicant is the student.
- Reg. art. 6(1): 外國人受聘僱在我國境內從事工作，除本法或本辦法另有規定外，雇主應向中央主管機關申請許可。 (art. 53 is the "otherwise provided" rule for category four; art. 2(4) defines category four as those working under ESA art. 50(1)/(2).)
- Reg. art. 7(1): 雇主申請聘僱外國人或外國人申請工作許可.
- WDA FAQ (https://ezworktaiwan.wda.gov.tw/News_Content.aspx?Create=1&n=77054B15FD1F5128&s=5C73DC0C790B04D9&sms=2E02279676D3E77B, updated 114-09-01, checked 115-07-15) A4: 請點選「僑外生工讀申請」，申請帳號後即可進行案件申請。 A8: 學生以帳號登入線上申辦系統…上傳相關資料…即可送件申請。
- My earlier reading came from ESA art. 43 ("未經雇主申請許可") and art. 53(1)/73(1)(2); none of those establishes an employer-specific student permit.

Changes:
- Body, 2nd paragraph: "Өргөдлийг оюутан биш, ажил олгогч гаргана." → "Оюутны хувьд өргөдлийг оюутан өөрөө гаргана." and "ажил олгогч өргөдөл гаргаж авсан зөвшөөрөлгүйгээр гадаадын иргэн …" → "гадаадын иргэн зөвшөөрөлгүйгээр Тайванд ажиллаж болохгүй" (art. 43 paraphrase no longer asserts an employer-filed permit).
- Heading "Зөвшөөрөл тодорхой ажил олгогчтой холбогдоно" → "Зөвшөөрлийг оюутан өөрөө онлайнаар хүснэ". New text: the student applies through the Ministry of Labor / Workforce Development Agency online system (Reg. art. 53 + WDA FAQ), documents (art. 53), refusal on false data (art. 55), one-year validity and 20 hours (art. 54), and WDA A10 on lapse (suspension, withdrawal, graduation, end of a language/technical stage).
- Removed: the sentences that a new employer applies when the student changes or adds employers (ESA art. 53(1)) and that working for another employer revokes the permit (art. 73(1),(2)), plus the ESA art. 53 link and Sources entry.
- The art. 74(3) paragraph was rewritten without the "other employer" premise: "Хуулийн дагуу ажиллаж байсан оюутны зөвшөөрлийн хугацаа дуусах, эсвэл 73 дугаар зүйлийн 1–5 дахь заалтад заасан үндэслэлээр зөвшөөрөл цуцлагдах үед 74 дүгээр зүйлийн 3 дахь хэсэг оюутанд «нэн даруй гар» гэсэн шаардлагыг хамруулахгүй." (text of 74(3)(1): 依本法規定受聘僱從事工作之外國留學生…聘僱許可期間屆滿或有前條第一款至第五款規定情事之一).
- FAQ 1 and FAQ 2 updated (student files the application; lapse on suspension/withdrawal/graduation). Added to Sources: WDA FAQ.
- Permit requirement, one-year maximum and 20 hours outside vacations are unchanged (ESA 50; Reg. 54; WDA A10: 許可期間最長為1年，其工作時間除寒暑假外，每星期最長為20小時).

### M2 graduation (ACCEPTED)
Check:
- Foreign Professionals Act art. 12 (A0030295): 外國人取得我國副學士以上學位者，以應屆畢業生之身分依法取得內政部移民署許可延期居留期間，在我國從事工作，得免申請工作許可。
- Effective date: https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=A0030295 shows the 2025-09-24 full amendment with 其餘條文，定自一百十五年一月一日施行, so art. 12 applies from 1 January 2026.
- WDA A10: 工作許可因休學、退學、畢業…失其效力。但畢業且取得學士、碩士或博士班錄取通知繼續就學且完成入學報到程序者，不在此限。

Changes: the "Төгссөний дараа" section now opens with the lapse-on-graduation rule and the further-study exception, then the art. 12 no-permit route (with the 1 January 2026 start and history link), then "Бусад тохиолдолд ажил олгогч өөр ангиллаар зөвшөөрөл хүсэх ёстой" with the existing Standards art. 5 and technical-manpower material. FAQ 3 rewritten to the same content ("Ерөнхийдөө үгүй …"). Sources: added art. 12, its history page and the WDA FAQ.

### S1 (variety command misclassifies files) (no text change)
The command has no Mongolian profile; my own measurements are in `mn-author.md` and were rerun after these edits (CV 0.51 / 0.48 / 0.48; short-sentence share 0.19 / 0.16 / 0.13 for 816 / 817 / 818).

## 817

### M1 permit scope (ACCEPTED)
Check: ESA art. 48(1)(2) (不須申請許可 for 外國人與在中華民國境內設有戶籍之國民結婚，且獲准居留者); ESA art. 51 (certain categories, including permanent residents, are not bound by art. 74: 得不受…第七十四條規定之限制); Reg. art. 53 (student applies); Foreign Professionals Act art. 12; ESA art. 74(3)(1) (student carve-out).

Change: "Гадаадын ажилтанд ажлын зөвшөөрөл ажил олгогчтой холбоотой." → "Энэ хэсэг ажил олгогчийн өргөдлөөр олгосон ажлын зөвшөөрөлтэй гадаадын ажилтанд хамаарна." followed by art. 73(3)/74(1) as before, and a new paragraph "Өөр дүрэмд орох хүмүүс бий" listing: students (74(3)), spouses of nationals with household registration and granted residence (48), categories such as permanent residents (51), new graduates (FPA 12). Heading changed to "Ажлаас гарах нь ажил олгогчийн авсан зөвшөөрөлд нөлөөлнө". Sources: added ESA 48, 51 and FPA 12. The "check your own permit type" closing advice is kept.

### M2 art. 22(1) in-kind wages (ACCEPTED)
Check: LSA art. 22(1): 應以法定通用貨幣為之。但基於習慣或業務性質，得於勞動契約內訂明一部以實物給付之。工資之一部以實物給付時，其實物之作價應公平合理，並適合勞工及其家屬之需要。
Change: "ажлын шинж чанар, заншлаас хамаарч нэг хэсгийг эд зүйлээр өгөхийг гэрээнд тусгаж болно" → "Заншил эсвэл ажлын шинж чанарт үндэслэн нэг хэсгийг эд зүйлээр олгохоор гэрээнд тохирч болох ч тухайн эд зүйлийн үнэлгээ шударга, боломжийн бөгөөд ажилтан болон түүний гэр бүлийн хэрэгцээнд нийцсэн байх ёстой."

## 818

### M1 Civil Code 193/195 (ACCEPTED)
Check: art. 195(1): 不法侵害他人之身體、健康、名譽、自由、信用、隱私、貞操，或不法侵害其他人格法益而情節重大者，被害人雖非財產上之損害，亦得請求賠償相當之金額。 The seriousness clause (情節重大) sits in the "或…其他人格法益" limb; body and health are in the enumerated list before the comma. Art. 193(1): 喪失或減少勞動能力或增加生活上之需要.
Change: "Бие махбодид хохирол учирсан бол хөдөлмөрийн чадвар алдсан, амьдралын хэрэгцээ нэмэгдсэн хохирлыг (193), зөрчил ноцтой бол сэтгэл санааны хохирлыг (195) нэхэж болно." → "Бие махбодь, эрүүл мэндэд хууль бусаар халдсанаас хөдөлмөрийн чадвар алдагдах, буурах, эсвэл амьдралын хэрэгцээ нэмэгдэхэд 193-аар нөхөн төлбөр нэхэж болно. Ийм халдлагын улмаас учирсан эд хөрөнгийн бус хохирлыг 195 дугаар зүйлээр мөн нэхэж болно." Both links kept.

### M2 licence exchange (ACCEPTED)
Check (K0040013 art. 50): para. 5 持有外國政府…有效之正式駕駛執照（證）並取得經許可停留或居留六個月以上之證明（件）者，得於入境之翌日起依平等互惠原則免考換發同等車類之普通駕駛執照; para. 6 汽車駕駛人辦理前項換發手續時，應先經體格檢查合格，並檢同下列文件… (including 6 authentication and 7 Chinese translation if not English). Ledger: Mongolia's licence status UNVERIFIED.
Change: old sentence → "Зургаан сараас доошгүй хугацаагаар оршин суух зөвшөөрөлтэй, хүчинтэй албан ёсны гадаад үнэмлэх эзэмшигч нь харилцан хүлээн зөвшөөрөх зарчимд нийцэж, эрүүл мэндийн үзлэгт тэнцсэн бол ижил ангиллын Тайванийн энгийн үнэмлэхээр шалгалтгүй солиулж болно (50 дугаар зүйлийн 5, 6 дахь хэсэг). … Монголын үнэмлэхэд энэ солилт үйлчлэх эсэхийг баталгаажуулаагүй." The earlier paragraph numbering (para. 6 for the exchange rule) was wrong; now 5 and 6.

### M3 moving vehicles after an injury accident (ACCEPTED)
Check: Accident Handling Rules (D0080090) art. 3(4): 不得任意移動肇事車輛及現場痕跡證據。但…有人受傷且當事人均同意移置車輛時，應先標繪車輛位置及現場痕跡證據後，將車輛移置不妨礙交通之處所。
Change: "… бүх тал зөвшөөрвөл тээврийн хэрэгслийн байрлалыг эхлээд тэмдэглэж, дараа нь замаас зайлуулж болно." → "Хүн гэмтсэн осолд бүх тал шилжүүлэхийг зөвшөөрсөн бол тээврийн хэрэгслийн байрлал болон ослын ул мөр, нотлох баримтыг эхлээд тэмдэглэж, дараа нь хөдөлгөөнд саад болохгүй газар шилжүүлэх ёстой." (also "ул мөр" → "ослын ул мөр" in the preceding sentence).

### M4 Criminal Code 185-4 (ACCEPTED)
Check: 致人傷害而逃逸者，處六月以上五年以下有期徒刑；致人於死或重傷而逃逸者，處一年以上七年以下有期徒刑。犯前項之罪，駕駛人於發生交通事故致人死傷係無過失者，減輕或免除其刑。
Change: → "Ослоор бусдыг гэмтээгээд зугтвал … 6 сараас 5 жил, хүн нас барсан эсвэл хүнд гэмтсэн бол 1–7 жилийн хорих ялтай. Ослын улмаас хүн гэмтэх, нас барахад жолоочийн буруу байгаагүй бол 2 дахь хэсгээр шүүх ялыг хөнгөрүүлэх эсвэл ялаас чөлөөлөх ёстой."

### M5 CIA coverage boundary and fund conditions (ACCEPTED)
Check: art. 13 本法所稱汽車交通事故，指使用或管理汽車致乘客或車外第三人傷害或死亡之事故。 Art. 40(1): the fund pays when the claimant cannot claim from the insurer because 一、事故汽車無法查究。二、事故汽車為未保險汽車。三、事故汽車係未經被保險人同意使用或管理之被保險汽車。四、事故汽車全部或部分為無須訂立本保險契約之汽車。
Changes: removed the stand-alone "Даатгагч төлнө."; added "Энэ даатгал зорчигч болон тээврийн хэрэгслийн гаднах гуравдагч этгээдийн гэмтэл, нас баралтыг хамарна (13)" and "Өөр тээврийн хэрэгсэл оролцоогүй ослоор өөрөө унаж гэмтсэн жолооч өөрийн тээврийн хэрэгслийн даатгалаас төлбөр авахгүй" (my reading of art. 13: the driver is neither passenger nor outside third person); the fund alternative now lists the four art. 40(1) cases. FAQ 1 now says the insurer pays when the injured person is a passenger or a third person outside the vehicle. Sources: added arts. 13 and 40.

### M6 art. 25(2) trigger (ACCEPTED)
Check: 保險人應於被保險人或請求權人交齊相關證明文件之次日起十個工作日內給付之。
Change: "Хүсэгч шаардлагатай бүх баримтаа гаргаж өгснөөс хойш 10 ажлын өдөрт багтаан төлөх ёстой" → "Даатгуулагч эсвэл нэхэмжлэгч холбогдох нотлох баримтыг бүрэн өгсөн өдрийн маргаашаас ажлын 10 өдрийн дотор даатгагч төлөх ёстой (25 дугаар зүйлийн 2 дахь хэсэг)."

### M7 NPA online system conditions (ACCEPTED)
Check (https://tm2.npa.gov.tw/NM105-505ClientRWD2/TM01A01Q_01.jsp, notice item 1): 道路交通事故案件需當場通知警方到場處理，且案件有人員死亡或受傷者，方能於本系統申請。 
Change: "Хүн гэмтсэн, нас барсан осолд … цахим системээр хүсэлт гаргаж" → "Осол болсон газраас цагдаад шууд мэдэгдэж, цагдаа ирж шалгасан бөгөөд хүн гэмтсэн эсвэл нас барсан осолд … цахим системээр хүсэлт гаргаж …".

### M8 CIA art. 32 (ACCEPTED)
Check: 保險人依本法規定所為之保險給付，視為被保險人損害賠償金額之一部分；被保險人受賠償請求時，得扣除之。
Change: "Даатгагчийн төлсөн дүн иргэний хохирлын нэг хэсэг болж, нэхэмжлэх үед хасагдана." → "Даатгагчийн хуулийн дагуу төлсөн дүн даатгуулагчийн нөхөн төлөх хохирлын нэг хэсэгт тооцогдоно. Даатгуулагчаас нөхөн төлбөр нэхэмжилсэн үед тэрээр уг дүнг хасуулж болно."

### S1 terminology 拘役 (ACCEPTED)
"1 жил хүртэл хорих, цагдан хорих эсвэл торгох ял" → "1 жил хүртэл хорих, богино хугацааны хорих ял (拘役) эсвэл торгох ял". The Mongolian term itself still needs a Mongolian legal reviewer.

## Additional small changes made while repairing (not requested)
- 818: added CIA art. 14(1) (claims against the insurer lapse 2 years from knowing of the damage and the insurer, 10 years from the accident: 自知有損害發生及保險人時起，二年間不行使而消滅。自汽車交通事故發生時起，逾十年者，亦同。) to the insurance paragraph, the deadlines paragraph and FAQ 3, because the old text listed only the civil 2-year period.
- 818: to stay within about 950 words I deleted two of my own sentences that no reviewer asked for: the NPA remark that the other party's address can be requested from police, and the sentence that scooter owners must insure with the NT$1,500–3,000 roadside fine (CIA arts. 6, 49); both links removed from Sources.
- Word counts after repair (body before Sources, including headings): 816 = 743, 817 = 833, 818 = 950. Frontmatter parsed with Ruby YAML; each body link appears in Sources and vice versa.

## Note on `work/mn-author.md`
Not edited. Superseded by this file: the 816 claim-table rows for ESA art. 53(1) and 73(1),(2) and the "employer applies" premise; the 816 graduation row (now FPA art. 12 and WDA A10); the 817 permit row; the 818 rows for arts. 6/49, 25, 32, 50(6), 185-4 and 195; the word-count table.
