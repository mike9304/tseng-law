# ms repair round 1 (response to reviews/codex-ms-r1.md)

Every MUST was re-checked against the statute text fetched with `python3 tools/law.py <PCODE> <art>` (24 Oct 2026) and against the paragraph structure of the cached `LawAll` page. All 10 MUSTs were correct and are ACCEPTED. Both 809 SHOULDs and the 807 SHOULD are ACCEPTED. No item was rebutted. Only `drafts/ms/*.md` and this file were edited.

Body word counts after repair (links removed, `## Sumber` excluded): 807 = 907 (was 876), 808 = 876 (was 854), 809 = 934 (was 913); all inside 650–950. Cuts to make room were non-legal sentences only (listed per article). The `--lang id` proxy variety run is still "OK — no variety limit violated" for all three; no bold, no H1.

## 807

### M1 — Regulation art. 51(2) omitted — ACCEPTED
Statute (N0090027 art. 51): para 1 = 一、正式入學修習科、系、所課程，或學習語言課程六個月以上。二、經就讀學校認定具下列事實之一者…；para 2 = 外國留學生符合下列資格之一者，不受前項規定之限制：一、具語文專長，且有下列情形之一，並經教育部專案核准：（一）入學後於各大專校院附設語文中心或外國在華文教機構附設之語文中心兼任外國語文教師。（二）入學後協助各級學校語文專長相關教學活動。二、就讀研究所，並經就讀學校同意從事與修習課業有關之研究工作。
- Body, after the sentence on the school's confirmation, added: "Ayat 2 mengecualikan pelajar asing yang berkepakaran bahasa dan, dengan kelulusan khas Kementerian Pendidikan, mengajar bahasa asing sambilan atau membantu pengajaran bahasa, serta pelajar pascasiswazah yang menjalankan penyelidikan berkaitan kursusnya dengan persetujuan sekolah."
- FAQ 2: "Perkara 51 peraturan itu menyebut…" → "Perkara 51 ayat 1 peraturan itu menyebut … untuk pelajar asing, dengan pengecualian khusus dalam ayat 2, manakala perkara 52 …". The permit requirement itself is untouched.
- Length offset: "Membantu kawan tanpa gaji … Peruntukan yang dipetik di sini tidak menyatakan bahawa bayaran semata-mata menentukan sama ada sesuatu itu kerja. Tanya pejabat…" shortened to one sentence with the same meaning ("…kerana peruntukan yang dipetik tidak menyatakan bahawa bayaran menentukan sama ada sesuatu itu kerja").

### S1 — "shift" / approval vs delivery — ACCEPTED
Heading "Shift pertama sebelum permit tiba" → "Syif pertama sebelum permit diluluskan"; every "shift" in the body now "syif" (hujung minggu, pertama, jadual syif). The final line still tells the reader to check the start and end dates printed on the permit.

## 808

### M1 — summary extended investment approval to both structures — ACCEPTED
Old: "…perlu memilih anak syarikat atau cawangan, mendapat kelulusan pelaburan dan menyemak permit pengurus serta cukai."
New: "Jenama Malaysia yang membuka kedai di Taiwan perlu membandingkan liabiliti anak syarikat dan cawangan, kelulusan pelaburan bagi anak syarikat, permit pengurus dan cukai." (169 characters after a final "serta" → "dan" swap.) The body already attaches approval to the subsidiary route only; the closing sentence ("didaftarkan sebagai cawangan") claims registration, not approval, for a branch.

### M2 — Company Act art. 99(2) conditions — ACCEPTED
Statute: 股東濫用公司之法人地位，致公司負擔特定債務且清償顯有困難，其情節重大而有必要者，該股東應負清償之責。
- Body old: "…kecuali apabila dia menyalahgunakan status badan korporat sehingga syarikat sukar membayar hutang tertentu dan perkara itu serius."
- Body new: "…pada asasnya bertanggungjawab setakat modal yang disumbangkannya. Jika dia menyalahgunakan status badan korporat sehingga syarikat menanggung hutang tertentu yang jelas sukar dilunaskan, dan keadaan itu serius serta perlu, dia mesti melunaskan hutang itu."
- FAQ 1 changed the same way and now cites "perkara 99 ayat 2".

### M3 — FAQ 2 conflated prohibited and restricted sectors — ACCEPTED
Statute (J0040002 art. 7): para 1 prohibits investment in listed businesses; para 2 requires the sector authority's permission or consent for businesses restricted by law or by orders under it; para 3 = lists set by the Executive Yuan.
FAQ 2 old: "Sektor yang dilarang atau dihadkan mengikut perkara 7 mempunyai syarat tambahan."
New: "Menurut perkara 7, pelaburan dalam sektor terlarang tidak dibenarkan, dan bagi sektor terhad, kebenaran atau persetujuan agensi sektor diperlukan." (The body already stated the two separately.)

### M4 — Trademark Act art. 30(1)(10) and (12) wording — ACCEPTED
Statute: (10) …但經該註冊商標或申請在先之商標所有人同意申請，且非顯屬不當者，不在此限。(12) 相同或近似於他人先使用於同一或類似商品或服務之商標，而申請人因與該他人間具有契約、地緣、業務往來或其他關係，知悉他人商標存在，意圖仿襲而申請註冊者。但經其同意申請註冊者，不在此限。
- (10): "…kecuali pemilik cap terdahulu bersetuju dan persetujuan itu tidak jelas tidak wajar" → "…kecuali pemilik cap terdahulu bersetuju kepada permohonan itu dan permohonan itu tidak nyata-nyata tidak wajar".
- (12): inserted "untuk barangan atau perkhidmatan yang sama atau serupa" after "oleh pihak lain". Knowledge, imitation intent and consent exception kept.

## 809

### M1 — licence exchange is Safety Rules art. 50 para 5, not 6 — ACCEPTED
Checked paragraph split of art. 50 (K0040013): para 5 = 持有外國政府、大陸地區、香港或澳門所發有效之正式駕駛執照（證）並取得經許可停留或居留六個月以上之證明（件）者，得於入境之翌日起依平等互惠原則免考換發同等車類之普通駕駛執照；para 6 = 汽車駕駛人辦理前項換發手續時，應先經體格檢查合格，並檢同下列文件… 
Old: "Pemegang lesen asing yang sah … boleh menukar lesen tanpa ujian atas dasar kesalingan ([perkara 50 ayat 6])."
New: "Menurut [perkara 50 ayat 5], pemegang lesen rasmi asing yang sah dan memperoleh bukti kebenaran tinggal atau kediaman enam bulan atau lebih boleh, mulai hari selepas masuk, menukar kepada lesen biasa kelas setara tanpa ujian atas dasar kesalingan. Pemeriksaan kesihatan dan dokumen dalam ayat 6 tetap diperlukan."
Art. 55-1 sentence now says "lesen rasmi … untuk memandu kenderaan dalam kelas setara" (same-class limit from 同等車類之汽車).

### M2 — art. 14(1) limitation periods are cumulative — ACCEPTED
Statute: 自知有損害發生及保險人時起，二年間不行使而消滅。自汽車交通事故發生時起，逾十年者，亦同。
Old: "Mangsa mempunyai dua tahun … atau 10 tahun dari kemalangan, untuk menuntut daripada insurer."
New: "Tuntutan kepada insurer tertakluk pada dua had: dua tahun sejak mangsa mengetahui kerugian dan insurer, serta sepuluh tahun sejak kemalangan. Had yang tamat dahulu terpakai, dengan peraturan gangguan dan pengecualian tempoh dalam perkara 14."
Civil Code art. 197 sentence (二年間不行使而消滅，自有侵權行為時起，逾十年者亦同) likewise: "…atau 10 tahun dari perbuatan itu" → "…dan sepuluh tahun dari perbuatan itu; yang tamat dahulu terpakai, tertakluk pada peraturan gangguan tempoh", starting events kept different.

### M3 — art. 29 subrogation overstated — ACCEPTED
Statute: 被保險人有下列情事之一，致被保險汽車發生汽車交通事故者，保險人仍應依本法規定負保險給付之責。但得在給付金額範圍內，代位行使請求權人對被保險人之請求權：…五、違反道路交通管理處罰條例第二十一條或第二十一條之一規定而駕車。(2) 前項保險人之代位權，自保險人為保險給付之日起，二年間不行使而消滅。
Old (body and FAQ 2): insurer pays but "boleh menuntut balik jumlah itu daripada tertanggung".
New: "Jika pemanduan yang melanggar perkara 21 Akta Pengurusan Lalu Lintas menyebabkan kemalangan, insurer tetap membayar … tetapi boleh mengambil alih hak tuntutan mangsa terhadap tertanggung, setakat jumlah yang dibayar. Hak mengambil alih itu luput jika tidak digunakan dalam dua tahun dari tarikh pembayaran." FAQ 2 rewritten the same way; the art. 30 sentence is unchanged (it already speaks of the "hak itu"). Section heading "…kemudian boleh menuntut balik" → "Insurans wajib membayar mangsa, dan insurer boleh mengambil alih tuntutan".

### M4 — art. 284 serious-injury alternatives omit detention — ACCEPTED
Statute: 因過失傷害人者，處一年以下有期徒刑、拘役或十萬元以下罰金；致重傷者，處三年以下有期徒刑、拘役或三十萬元以下罰金。
New: "…dan, jika kecederaan berat, penjara sehingga tiga tahun, tahanan atau denda sehingga NT$300,000."

### M5 — art. 93-2 necessity condition (必要時) omitted — ACCEPTED
Statute: 被告犯罪嫌疑重大，而有下列各款情形之一者，必要時檢察官或法官得逕行限制出境、出海。
Added "jika sekatan itu perlu" after "keluar" in the body and in FAQ 3. Strong-suspicion requirement, three alternative grounds, discretion and the detention/fine-only exception are unchanged.

### S1 — link to the official reciprocity list — ACCEPTED (with disclosure)
Body now: "Pengiktirafan lesen Malaysia belum disahkan di sini. … Semak [senarai rasmi itu](https://www.thb.gov.tw/News_Download.aspx?n=561) atau tanya pejabat pengawasan kenderaan (監理站) tentang jenis lesen dan kelas motosikal anda sebelum menunggang." The page itself is behind a CAPTCHA wall for me (and for the research ledger, S24), so it is added to `## Sumber` as "disenaraikan sebagai rujukan semakan; halaman itu tidak dapat dibuka semasa semakan" and nothing on it is asserted.

### S2 — closing recap of dates — ACCEPTED
Dropped "Dalam contoh tadi, tiga tarikh patut dicatat…". The article now ends on the contact paragraph (brief shape), all three periods remain in the body.

Length offsets in 809 (non-legal sentences removed): "Jika pihak lain mengadu dan polis menyiasat penunggang atas kecuaian, perkara 93-2 menjadi relevan." and the pointer sentence to the overtaking column. The internal link to `/ms/columns/taiwan-traffic-accident-procedure` (003) stays, so the "at least one internal link" rule is met.

## Note
- I did not touch `work/ms-author.md`; its 807–809 word counts and its statements about art. 29 recourse and art. 50 para 6 are superseded by this file.
