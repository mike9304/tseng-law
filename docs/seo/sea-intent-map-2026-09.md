# 동남아 6국 × 7의도 인텐트 지도 — 2026-09 (S1)

작성: 2026-09-09 · 워크오더 WO-S1 · 작업트리 `tseng-law-sea-seo-20260909`
목적: VN·ID·TH·PH·MY·SG 사용자가 대만 법률 문제를 검색·질의할 때의 의도를 42셀로 고정하고, 각 셀에 **실존하는** 대응 URL과 **A/B 출처가 붙은** 우선순위를 붙인다.

## 1. 요약 (5줄)

1. 대만 내 6국 체류자 규모는 A급 공식통계로 확정된다 — 印尼 383,535 · 越南 355,203 · 菲律賓 221,082 · 泰國 92,666 · 馬來西亞 27,448 · 新加坡 3,217 (S1, 2026-07-31 기준). VN·ID·TH·PH 체류자 중 `移工 小計` 비율은 **70.6%~86.0%**다 — VN 250,882/355,203 = 70.6% · ID 315,394/383,535 = 82.2% · TH 74,628/92,666 = 80.5% · PH 190,032/221,082 = 86.0% (§2.1 표에서 그대로 계산).
2. 이 인구 구조상 **가장 큰 미충족 의도는 ② 취업·거류비자**다. 정확히는 **이주노동자의 노동허가·ARC 갱신(만료·이직·고용주 변경)을 주제로 하는 전용 페이지가 0**이라는 뜻이다. "설립은 거류·취업 자격을 자동으로 주지 않는다"는 한 문장은 이미 존재한다 — 안내 4언어 `/services` 투자 절(`international-guidance-content.ts` vi 147·id 618·th 1089·fil 1560)과 EN 설립 랜딩 FAQ(`intent-pages.ts` 526·581–593). 따라서 "다루는 페이지 0"이 아니라 "**갱신 주제 전용 페이지 0**"이 이 문서의 주장이다.
3. 42셀 중 대응 URL이 **"없음"인 셀은 10개** — ② 취업·거류비자 4셀(VN·ID·TH·PH), ⑦ 부동산·임대 6셀 전부다. ② MY·SG는 질문이 "설립 후 노동허가·ARC가 자동인가"이고 그 명제를 EN 설립 랜딩 FAQ가 이미 다루므로 `/en/taiwan-company-setup-lawyer`를 대응 URL로 적었다(R1 수정). ⑦은 사무소 업무 영역 6개(투자·민사·가족·노동·형사·지재)에 부동산이 없어 우선순위를 전부 L로 두고 신규 페이지 후보에서 제외했다.
4. H는 9셀이며 전부 A급 규모 통계(S1/S2)가 직접 모수인 셀에만 부여했다 — ② VN·ID·TH·PH, ③ VN·ID·TH·PH, ④ VN. **E등급(추정) 근거로 H를 준 셀은 0이다.**
5. MY·SG는 대만 내 체류 규모(A급)로는 H가 나오지 않는다. 이 두 나라의 회사설립·채권 의도는 수요 주체가 **대만 밖**에 있어 이 문서가 가진 A/B 출처로는 순위를 세울 수 없다 → 해당 근거는 **미확인**으로 적고 M/L에 둔다.

### 이 문서가 주장하지 않는 것

- **검색량·CTR·트래픽 수치는 한 건도 적지 않는다**(WO 금지 항목). `검색 표면` 열은 실측이 아니라 **가설**이며, 검증은 `docs/seo/geo-sea-baseline-2026-09.md`의 재실측 회차에서 한다.
- 출처가 없는 규모·비율은 "미확인"으로 적었다. 추정치를 숫자로 바꾸지 않았다.
- 승소율·성공 보장·최고/유일 표현은 이 문서와 신규 페이지 초안 어디에도 쓰지 않았다(초판에 "6국 최고" 1건이 있었고 R1에서 삭제 — §6·§8 참조).

### 표 읽는 규칙 (§2 전체에 적용)

- **`현재 대응 URL` 열은 "그 셀의 질문 언어로 도달 가능한 실존 URL"만 적는다.** VN·ID·TH·PH 셀의 질문 언어는 현지어이므로 `/vi`·`/id`·`/th`·`/fil` 표면만 이 열에 들어간다. 영어 표면에 관련 페이지가 있으면 `이유` 열에 `EN:` 로 따로 적었다. MY는 사이트에 `ms` 로케일이 없어 EN 표면이, SG는 EN·ZH 표면이 이 열에 들어간다.
- 안내 4언어에는 주제별 페이지가 없고 코어 10페이지뿐이다. 따라서 `/{locale}/services`가 이 열에 오면 그것은 **해당 업무 영역을 다룬다는 범위 안내 수준**이지, 셀의 질문에 답하는 문서가 아니다. 이 한계는 `이유` 열에 `(범위 안내)`로 표시했다.
- `검색 표면`은 가설이며 `구글` / `AI` / `둘 다` 중 하나다. 배정 규칙: 절차·요건형 장문 질의 → `AI`, 긴급·현지 사무소 탐색형 → `구글`, 두 성격이 섞이면 `둘 다`.
- **MY·SG 행의 `대표 질문(현지어)` 표기.** MY는 사이트에 `ms` 로케일이 없어 말레이어 질문은 사용자 입력 문장으로만 기록하고 대응 URL은 EN 표면을 적었다. SG는 영어가 공용어이므로 영어 질문을 현지어로 보고, 중국어 변형은 **간체**로 적었다 — S4의 SG 상위 쿼리가 간체(`台湾公司设立`·`台湾注册公司`)였기 때문이다. 사이트의 중국어 표면은 `zh-hant`(번체)이므로 이 둘은 표기 체계가 다르며, 이 문서는 그 차이를 메우는 어떤 조치도 제안하지 않는다(별도 판단 사항).
- 우선순위 부여 규칙(H): (a) 셀의 질문 주체가 대만 내 체류자이고, (b) S1/S2의 A급 규모가 그 의도의 **직접 모수**이며 6국 중 상위이고, (c) 그 의도에 대한 질문 언어 대응이 없거나 범위 안내에 그칠 때. 세 조건을 모두 만족하지 않으면 M 이하다.

### 언어 계약 (이 문서 전체에 적용)

`vi`/`id`/`th`/`fil`은 **안내(guidance) 언어**다. `대표 질문(현지어)` 열은 **사용자가 검색창·AI에 입력할 문장**이지 사무소가 그 언어로 상담한다는 표시가 아니다. **변호사 상담 언어는 English / Chinese / Japanese / Korean 뿐이다.** 자기점검은 §6.

## 2. 매트릭스 (6국 × 7의도 = 42셀)

의도 코드: ① 회사설립·투자 · ② 취업·거류비자 · ③ 이주노동자 권리·임금·산재 · ④ 국제결혼·가족·상속 · ⑤ 계약·미수금 · ⑥ 형사·사고 · ⑦ 부동산·임대

| 국가 | 의도 | 대표 질문(현지어) | 대표 질문(영어) | 검색 표면(가설) | 현재 대응 URL | 우선순위 | 이유(1줄) |
|---|---|---|---|---|---|---|---|
| VN | ① 회사설립·투자 | Người Việt Nam muốn thành lập công ty tại Đài Loan thì cần thủ tục và giấy tờ gì? | What procedure and documents does a Vietnamese investor need to set up a company in Taiwan? | 둘 다 | https://tseng-law.com/vi/services | M | 대만 내 越南 商務人員 514·工程師 1,518(S1)로 모수가 작고 설립 수요 주체는 대만 밖 — 규모 근거 미확인 · (범위 안내) · EN: /en/taiwan-company-setup-lawyer |
| VN | ② 취업·거류비자 | Giấy phép lao động và thẻ cư trú (ARC) sắp hết hạn thì gia hạn thế nào ở Đài Loan? | How do I extend a Taiwan work permit and ARC before the current one expires? | AI | 없음 | H | 越南 移工 250,882 + 學生 48,354(S1) = 이 의도의 직접 모수 6국 2위 · 갱신 주제 전용 페이지 없음(현지어·EN 모두) |
| VN | ③ 이주노동자 권리·임금·산재 | Công ty ở Đài Loan nợ lương và ép tăng ca thì người lao động Việt Nam khiếu nại ở đâu? | Where can a Vietnamese worker in Taiwan complain about unpaid wages and forced overtime? | AI | https://tseng-law.com/vi/services | H | 越南 移工 250,882(S1), 그중 製造業技工 206,007(S1 직업 세목) · (범위 안내) 임금체불·산재 문서 없음 · EN: /en/columns/taiwan-labor-severance-law |
| VN | ④ 국제결혼·가족·상속 | Ly hôn với vợ/chồng người Đài Loan thì quyền nuôi con và tư cách cư trú của tôi ra sao? | After divorcing a Taiwanese spouse, what happens to child custody and my residence status? | 둘 다 | https://tseng-law.com/vi/services | H | 越南 외국인 배우자 30,007(S3) — 6국 최다이자 2위 泰國의 3.2배 · (범위 안내) · EN: /en/columns/taiwan-divorce-lawsuit-qna |
| VN | ⑤ 계약·미수금 | Đối tác Đài Loan không thanh toán tiền hàng thì đòi nợ theo pháp luật Đài Loan thế nào? | A Taiwanese counterparty has not paid for the goods — how is the debt pursued under Taiwanese law? | 둘 다 | https://tseng-law.com/vi/services | M | 수요 주체가 대만 밖 기업이라 체류 규모가 모수가 아님 — 규모 근거 미확인 · (범위 안내) · EN: /en/taiwan-litigation-lawyer |
| VN | ⑥ 형사·사고 | Gây tai nạn xe máy ở Đài Loan và bị cảnh sát gọi lên thì phải làm gì? | I caused a scooter accident in Taiwan and the police summoned me — what should I do? | 구글 | https://tseng-law.com/vi/services | M | 체류 355,203(S1)로 모수는 크나 사고 발생 통계는 미확인이고 EN 절차 칼럼 2편이 이미 존재 · EN: /en/columns/taiwan-traffic-accident-procedure |
| VN | ⑦ 부동산·임대 | Chủ nhà ở Đài Loan không trả lại tiền cọc thì đòi bằng cách nào? | My landlord in Taiwan is withholding the deposit — how do I get it back? | AI | 없음 | L | 사무소 업무 영역 6개(투자·민사·가족·노동·형사·지재)에 부동산이 없어 신규 페이지 후보에서 제외 |
| ID | ① 회사설립·투자 | Orang Indonesia yang ingin mendirikan perusahaan di Taiwan, apa saja syarat dan tahapannya? | What are the requirements and steps for an Indonesian to establish a company in Taiwan? | 둘 다 | https://tseng-law.com/id/services | M | 대만 내 印尼 商務人員 509·工程師 1,582(S1)로 모수가 작고 수요 주체는 대만 밖 — 규모 근거 미확인 · (범위 안내) · EN: /en/taiwan-company-setup-lawyer |
| ID | ② 취업·거류비자 | Izin kerja saya di Taiwan hampir habis, bagaimana cara memperpanjang ARC? | My Taiwan work permit is expiring — how do I extend my ARC? | AI | 없음 | H | 印尼 移工 315,394 + 學生 19,492(S1) = 이 의도의 직접 모수 6국 1위 · 갱신 주제 전용 페이지 없음(현지어·EN 모두) |
| ID | ③ 이주노동자 권리·임금·산재 | Gaji tidak dibayar penuh dan paspor ditahan majikan, ke mana saya melapor di Taiwan? | My wages are underpaid and my employer holds my passport — where do I report this in Taiwan? | AI | https://tseng-law.com/id/services | H | 印尼 移工 315,394(S1) 6국 1위, 그중 監護工 192,962(S1 직업 세목)로 가사·간병 집중 · (범위 안내) 임금체불·산재 문서 없음 · EN: /en/columns/taiwan-labor-severance-law |
| ID | ④ 국제결혼·가족·상속 | Menikah dengan warga Taiwan lalu bercerai, bagaimana hak asuh anak dan izin tinggal saya? | After divorcing a Taiwanese spouse, what happens to child custody and my residence permit? | 둘 다 | https://tseng-law.com/id/services | M | 印尼 외국인 배우자 6,278(S3)로 VN의 1/4.8 · (범위 안내) · EN: /en/columns/taiwan-divorce-lawsuit-qna |
| ID | ⑤ 계약·미수금 | Perusahaan Taiwan tidak membayar faktur kami, bagaimana proses penagihannya di Taiwan? | A Taiwanese company has not paid our invoice — what is the collection process in Taiwan? | 둘 다 | https://tseng-law.com/id/services | M | 수요 주체가 대만 밖 기업이라 체류 규모가 모수가 아님 — 규모 근거 미확인 · (범위 안내) · EN: /en/taiwan-litigation-lawyer |
| ID | ⑥ 형사·사고 | Saya kecelakaan sepeda motor di Taiwan dan dipanggil polisi, apa langkah berikutnya? | I was in a motorcycle accident in Taiwan and summoned by the police — what happens next? | 구글 | https://tseng-law.com/id/services | M | 체류 383,535(S1)로 모수는 6국 최대이나 사고 발생 통계는 미확인이고 EN 절차 칼럼 2편이 이미 존재 · EN: /en/columns/taiwan-traffic-accident-procedure |
| ID | ⑦ 부동산·임대 | Uang jaminan sewa rumah di Taiwan tidak dikembalikan pemilik, apa yang bisa saya lakukan? | The landlord in Taiwan will not return my rental deposit — what can I do? | AI | 없음 | L | 사무소 업무 영역 6개에 부동산이 없어 신규 페이지 후보에서 제외 |
| TH | ① 회사설립·투자 | คนไทยจะจดทะเบียนบริษัทที่ไต้หวัน ต้องใช้เอกสารอะไรบ้าง และมีขั้นตอนอย่างไร | What documents and steps are needed for a Thai national to register a company in Taiwan? | 둘 다 | https://tseng-law.com/th/services | L | 대만 내 泰國 商務人員 232·工程師 189(S1)로 6국 최저 수준 · (범위 안내) · EN: /en/taiwan-company-setup-lawyer |
| TH | ② 취업·거류비자 | ใบอนุญาตทำงานที่ไต้หวันใกล้หมดอายุ ต้องต่ออายุ ARC อย่างไร | My Taiwan work permit is about to expire — how do I renew my ARC? | AI | 없음 | H | 泰國 移工 74,628 + 學生 2,570(S1) = 이 의도의 직접 모수 6국 4위이자 MY의 10배 · 갱신 주제 전용 페이지 없음(현지어·EN 모두) |
| TH | ③ 이주노동자 권리·임금·산재 | นายจ้างที่ไต้หวันค้างค่าจ้างและค่าล่วงเวลา แรงงานไทยร้องเรียนที่ไหน | My Taiwanese employer owes wages and overtime — where does a Thai worker file a complaint? | AI | https://tseng-law.com/th/services | H | 泰國 移工 74,628(S1), 그중 製造業技工 57,028·營建業技工 14,866로 제조·건설 技工이 移工의 대부분(S1 직업 세목). 국적별 산재 건수는 미확인 · (범위 안내) 임금체불·산재 문서 없음 · EN: /en/columns/taiwan-labor-severance-law |
| TH | ④ 국제결혼·가족·상속 | แต่งงานกับคนไต้หวันแล้วหย่า สิทธิปกครองบุตรและสิทธิพำนักของฉันเป็นอย่างไร | After divorcing a Taiwanese spouse, what happens to custody and my residence status? | 둘 다 | https://tseng-law.com/th/services | M | 泰國 외국인 배우자 9,231(S3)로 6국 2위이나 VN의 1/3.2 · (범위 안내) · EN: /en/columns/taiwan-divorce-lawsuit-qna |
| TH | ⑤ 계약·미수금 | บริษัทไต้หวันไม่ชำระค่าสินค้า จะเรียกให้ชำระหนี้ตามกฎหมายไต้หวันได้อย่างไร | A Taiwanese company has not paid for goods — how is the debt enforced under Taiwanese law? | 둘 다 | https://tseng-law.com/th/services | L | 수요 주체가 대만 밖 기업이고 대만 내 泰國 商務人員 232(S1)로 최저 — 규모 근거 미확인 · (범위 안내) · EN: /en/taiwan-litigation-lawyer |
| TH | ⑥ 형사·사고 | ขับรถจักรยานยนต์ชนกันที่ไต้หวัน และได้รับหมายเรียกจากตำรวจ ต้องทำอย่างไร | I had a motorcycle collision in Taiwan and received a police summons — what should I do? | 구글 | https://tseng-law.com/th/services | M | 체류 92,666(S1) · 사고 발생 통계는 미확인이고 EN 절차 칼럼 2편이 이미 존재 · EN: /en/columns/taiwan-overtaking-accident-liability |
| TH | ⑦ 부동산·임대 | เจ้าของบ้านที่ไต้หวันไม่คืนเงินประกัน ต้องทำอย่างไร | The landlord in Taiwan will not refund my deposit — what can I do? | AI | 없음 | L | 사무소 업무 영역 6개에 부동산이 없어 신규 페이지 후보에서 제외 |
| PH | ① 회사설립·투자 | Paano magparehistro ng kumpanya sa Taiwan bilang Pilipino, at anong mga dokumento ang kailangan? | How does a Filipino register a company in Taiwan and what documents are required? | 둘 다 | https://tseng-law.com/fil/services | M | 대만 내 菲律賓 商務人員 217·工程師 2,254(S1) — 기술직은 있으나 설립 수요 주체는 대만 밖 · (범위 안내) · EN: /en/taiwan-company-setup-lawyer |
| PH | ② 취업·거류비자 | Malapit nang mag-expire ang work permit ko sa Taiwan — paano ang renewal ng ARC? | My Taiwan work permit is about to expire — how do I renew my ARC? | AI | 없음 | H | 菲律賓 移工 190,032 + 學生 5,089(S1) = 이 의도의 직접 모수 6국 3위 · 갱신 주제 전용 페이지 없음(현지어·EN 모두) |
| PH | ③ 이주노동자 권리·임금·산재 | Kinakaltasan ang sahod ko at hindi binabayaran ang overtime sa Taiwan — saan ako pwedeng magreklamo? | My wages are being deducted and overtime is unpaid in Taiwan — where can I file a complaint? | AI | https://tseng-law.com/fil/services | H | 菲律賓 移工 190,032(S1), 그중 製造業技工 163,764·監護工 21,213(S1 직업 세목) · (범위 안내) 임금체불·산재 문서 없음 · EN: /en/columns/taiwan-voluntary-resignation-severance |
| PH | ④ 국제결혼·가족·상속 | Naghihiwalay kami ng asawa kong Taiwanese — paano ang custody ng anak at ang residence status ko? | I am separating from my Taiwanese spouse — what happens to custody and my residence status? | 둘 다 | https://tseng-law.com/fil/services | M | 菲律賓 외국인 배우자 4,941(S3)로 6국 5위 · (범위 안내) · EN: /en/columns/taiwan-inheritance-custody-analysis |
| PH | ⑤ 계약·미수금 | Hindi nagbabayad ang kliyenteng Taiwanese sa aming invoice — paano ito sisingilin sa Taiwan? | A Taiwanese client will not pay our invoice — how do we collect it in Taiwan? | 둘 다 | https://tseng-law.com/fil/services | L | 수요 주체가 대만 밖 기업이고 대만 내 菲律賓 商務人員 217(S1) — 규모 근거 미확인 · (범위 안내) · EN: /en/taiwan-litigation-lawyer |
| PH | ⑥ 형사·사고 | Nadisgrasya ako sa motor sa Taiwan at may summons galing sa pulis — ano ang susunod na hakbang? | I had a motorcycle accident in Taiwan and got a police summons — what happens next? | 구글 | https://tseng-law.com/fil/services | M | 체류 221,082(S1) · 사고 발생 통계는 미확인이고 EN 절차 칼럼 2편이 이미 존재 · EN: /en/columns/taiwan-traffic-accident-procedure |
| PH | ⑦ 부동산·임대 | Ayaw ibalik ng landlord ang deposito ko sa Taiwan — ano ang pwede kong gawin? | My landlord in Taiwan will not return my deposit — what can I do? | AI | 없음 | L | 사무소 업무 영역 6개에 부동산이 없어 신규 페이지 후보에서 제외 |
| MY | ① 회사설립·투자 | Syarikat Malaysia mahu menubuhkan anak syarikat di Taiwan — apakah prosedur dan dokumennya? | A Malaysian company wants to set up a subsidiary in Taiwan — what is the procedure and paperwork? | 둘 다 | https://tseng-law.com/en/taiwan-company-setup-lawyer | M | 대만 내 馬來西亞 商務人員 1,348·工程師 2,384로 6국 최다(S1)이나 설립 수요 주체는 대만 밖이라 이 수치가 직접 모수가 아님 — 규모 근거 미확인 · EN 랜딩·가이드·칼럼 이미 존재 |
| MY | ② 취업·거류비자 | Selepas menubuhkan syarikat di Taiwan, adakah saya automatik mendapat permit kerja dan ARC? | After setting up a company in Taiwan, do I automatically get a work permit and ARC? | AI | https://tseng-law.com/en/taiwan-company-setup-lawyer | M | 馬來西亞 移工 83·學生 7,447·기타 유업자 11,147(S1 직업 세목) — 모수는 실재하나 VN·ID·PH·TH의 1/10 이하 · 전용 페이지 없음, 설립 랜딩 FAQ로 부분 대응(`intent-pages.ts` 526·581–593) |
| MY | ③ 이주노동자 권리·임금·산재 | Pekerja Malaysia di Taiwan diberhentikan — adakah layak menerima pampasan penamatan? | A Malaysian employee in Taiwan was dismissed — is severance payable? | 둘 다 | https://tseng-law.com/en/columns/taiwan-labor-severance-law | L | 馬來西亞 移工 83명(S2에서는 1명)으로 이 의도의 모수가 사실상 없음(S1·S2) · EN 칼럼으로 이미 대응 |
| MY | ④ 국제결혼·가족·상속 | Pasangan saya warga Taiwan dan kami mahu bercerai — bagaimana hak penjagaan anak dan harta? | My spouse is Taiwanese and we are divorcing — how are custody and property handled? | 둘 다 | https://tseng-law.com/en/columns/taiwan-divorce-lawsuit-qna | M | 馬來西亞 외국인 배우자 6,463(S3)는 6국 3위. 체류 계 대비 비율 6,463/27,448(S1·S3) · EN 칼럼 2편으로 대응 |
| MY | ⑤ 계약·미수금 | Pembekal Taiwan tidak membayar invois kami — bolehkah kami menyaman di Taiwan dari Malaysia? | A Taiwanese counterparty has not paid our invoice — can we sue in Taiwan from Malaysia? | 둘 다 | https://tseng-law.com/en/taiwan-litigation-lawyer | M | 수요 주체가 대만 밖 기업이라 체류 규모가 모수가 아님 — 규모 근거 미확인 · EN 랜딩·서비스 페이지로 대응 |
| MY | ⑥ 형사·사고 | Saya terlibat kemalangan jalan raya di Taiwan dan dipanggil polis — apa prosedurnya? | I was in a road accident in Taiwan and called in by the police — what is the procedure? | 구글 | https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure | L | 체류 27,448(S1)로 VN·ID·PH의 1/8 이하 · EN 절차 칼럼 2편이 이미 존재 |
| MY | ⑦ 부동산·임대 | Menyewa ruang pejabat di Taiwan — apa yang perlu disemak dalam perjanjian sewa? | Leasing office space in Taiwan — what should be checked in the lease? | AI | 없음 | L | 사무소 업무 영역 6개에 부동산이 없어 신규 페이지 후보에서 제외(사업장 입지는 EN: /en/columns/taiwan-company-setup-pitch-location) |
| SG | ① 회사설립·투자 | How does a Singapore company incorporate a subsidiary in Taiwan, and is a local lawyer required? / 新加坡公司要在台湾设立子公司，需要台湾律师吗？ | How does a Singapore company incorporate a subsidiary in Taiwan, and is a local lawyer required? | 둘 다 | https://tseng-law.com/en/taiwan-company-setup-lawyer | M | 대만 내 新加坡 체류 3,217(S1)로 6국 최소라 규모 근거로는 H 불가 — 보조로 자사 GSC 실측(S4) SG 노출 16·클릭 1, 상위 쿼리가 간체 중국어 · EN 랜딩·가이드 이미 존재 |
| SG | ② 취업·거류비자 | Does incorporating in Taiwan give a Singapore director a work permit and ARC? / 在台湾注册公司后，负责人可以取得工作许可和居留证吗？ | Does incorporating in Taiwan give a Singapore director a work permit and ARC? | AI | https://tseng-law.com/en/taiwan-company-setup-lawyer | M | 新加坡 移工 2·學生 186·商務人員 582(S1) — 모수 6국 최소 · 전용 페이지 없음, 설립 랜딩 FAQ로 부분 대응(`intent-pages.ts` 526·581–593) |
| SG | ③ 이주노동자 권리·임금·산재 | Our Taiwan entity employs foreign workers — what labour obligations apply to us as employer? / 台湾子公司雇用外籍员工，雇主有哪些劳动法义务？ | Our Taiwan entity employs foreign workers — what labour obligations apply to us as employer? | 둘 다 | https://tseng-law.com/en/services/labor | L | 新加坡 移工 2명(S1)으로 근로자 측 모수가 없고 고용주 측 질의로만 성립 · EN 서비스·칼럼으로 대응 |
| SG | ④ 국제결혼·가족·상속 | My father died in Taiwan and the heirs live in Singapore — how does Taiwanese inheritance work? / 被继承人在台湾过世、继承人在新加坡，遗产程序如何进行？ | My father died in Taiwan and the heirs live in Singapore — how does Taiwanese inheritance work? | 둘 다 | https://tseng-law.com/en/columns/taiwan-inheritance-custody-analysis | L | 新加坡 외국인 배우자 1,132(S3)로 6국 최소 · EN 칼럼으로 이미 대응 |
| SG | ⑤ 계약·미수금 | A Taiwanese supplier will not pay our invoice — can we sue in Taiwan from Singapore? / 台湾厂商拖欠货款，新加坡公司可以在台湾提告吗？ | A Taiwanese supplier will not pay our invoice — can we sue in Taiwan from Singapore? | 둘 다 | https://tseng-law.com/en/taiwan-litigation-lawyer | M | 수요 주체가 대만 밖 기업이라 체류 규모가 모수가 아님 — 규모 근거 미확인 · EN 랜딩·서비스 페이지로 대응 |
| SG | ⑥ 형사·사고 | An employee of ours had a traffic accident in Taiwan and received a police summons — what happens? / 员工在台湾发生交通事故并收到警方通知，程序是什么？ | An employee of ours had a traffic accident in Taiwan and received a police summons — what happens? | 구글 | https://tseng-law.com/en/columns/taiwan-traffic-accident-procedure | L | 체류 3,217(S1)로 6국 최소 · EN 절차 칼럼 2편이 이미 존재 |
| SG | ⑦ 부동산·임대 | What should a foreign company check before signing an office lease in Taiwan? / 外国公司在台湾签办公室租约要注意什么？ | What should a foreign company check before signing an office lease in Taiwan? | AI | 없음 | L | 사무소 업무 영역 6개에 부동산이 없어 신규 페이지 후보에서 제외(사업장 입지는 EN: /en/columns/taiwan-company-setup-pitch-location) |

**셀 수 검증**: 6국 × 7의도 = 42행(국가별 7행씩). "없음" **10셀**(② VN·ID·TH·PH 4 + ⑦ 6), H 9셀(② VN·ID·TH·PH, ③ VN·ID·TH·PH, ④ VN), M 19셀, L 14셀. "없음"이면서 H인 셀은 4개(② VN·ID·TH·PH) — §3의 후보 목록이 여기서 나온다.
※ R1(2026-09-09): ② MY·SG 두 셀은 초판에서 `없음`이었으나 질문 명제("설립 후 노동허가·ARC 자동 취득 여부")를 EN 설립 랜딩이 이미 다루므로 대응 URL을 채웠다. "없음" 12→10, 42셀·H 9셀·M 19셀·L 14셀은 불변.

### 2.1 우선순위 근거로 쓴 A급 규모 (한눈에)

단위: 명. 출처는 §5의 S1(2026-07-31 기준)·S2(2025년/민국114년)·S3(2026-07-31 기준).

| 국가(코드) | 유효 거류증 체류자 계(S1) | 移工 계(S1) | 學生(S1) | 商務人員+工程師(S1) | 외국인 배우자(S3) | 產業·社福 移工(S2) |
|---|---|---|---|---|---|---|
| 인도네시아(ID) | 383,535 | 315,394 | 19,492 | 2,091 | 6,278 | 293,586 |
| 베트남(VN) | 355,203 | 250,882 | 48,354 | 2,032 | 30,007 | 233,313 |
| 필리핀(PH) | 221,082 | 190,032 | 5,089 | 2,471 | 4,941 | 170,252 |
| 태국(TH) | 92,666 | 74,628 | 2,570 | 421 | 9,231 | 69,060 |
| 말레이시아(MY) | 27,448 | 83 | 7,447 | 3,732 | 6,463 | 1 |
| 싱가포르(SG) | 3,217 | 2 | 186 | 807 | 1,132 | (해당 국적 항목 없음) |

- 남녀 합계는 S1·S3 원표가 男/女 두 칸으로만 제공하므로 두 칸을 더한 값이다(예: 越南 208,522 + 146,681 = 355,203). 원표에 없는 합계 칸을 만든 것이 아니라, 원표의 두 칸을 그대로 더했다.
- S1의 `移工 계`는 원표 직업 분류의 `移工 小計` 행이다(營建業技工·製造業技工·家庭幫傭·監護工·移工翻譯員·移工廚師·乳牛飼育員·農務技工·船員(移工)·其他(移工)의 소계).
- **S2에 신가포르 국적 열이 존재하지 않는다.** 없는 값을 0으로 채우지 않고 "(해당 국적 항목 없음)"으로 적었다.

## 3. "없음 + H" 셀 → S3 신규 페이지 후보

§2에서 `현재 대응 URL = 없음` 이면서 `우선순위 = H` 인 셀은 **4개**다: **② 취업·거류비자 × VN·ID·TH·PH.** (⑦ 부동산·임대 6셀도 "없음"이지만 전부 L이므로 후보가 아니다. ② MY·SG는 R1에서 대응 URL이 `/en/taiwan-company-setup-lawyer`로 채워졌고 M이므로 **후보에서 뺐다**.)

이 4셀을 커버하는 후보는 **5개**다 — 4개 안내 언어 페이지 + 이들을 잇는 EN 표면 1개.

**후보의 주제는 "노동허가·ARC 갱신"이다(R1 재정의).** 초판 초안은 "설립은 거류·취업 자격을 자동으로 주지 않는다"였는데, 그 명제는 안내 4언어 `/services` 투자 절과 EN 설립 랜딩(`/en/taiwan-company-setup-lawyer`, `/en/guides/taiwan-company-setup` — `sitemap.ts` `STATIC_PATHS` 37)이 이미 다루므로 **신규 페이지가 아니라 기존 문장 복제**였다. ② H 4셀의 대표 질문은 만료 임박 노동허가·ARC **갱신**이므로 후보 전체를 그 질문으로 재정의하고, 설립≠거류 문장은 **링크로만** 참조한다(재서술 금지).

**후보 초안에 적용한 언어 계약 원칙 (R1 추가).** C2~C5는 해당 언어 상담을 암시할 수 있는 문구(`hỏi luật sư`, `ปรึกษาทนายความ`, `bertanya kepada pengacara`, `magtanong sa abogado` 등 "그 언어로 변호사에게 묻는다"로 읽히는 표현)를 쓰지 않는다. 대신 **기존 안내 4언어 FAQ의 거절 문장을 그대로 유지·재사용**한다 — vi 예: "Tôi có thể được tư vấn bằng tiếng Việt không? → Không. … việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn."(`src/data/international-guidance-content.ts` 365–368). id·th·fil의 대응 FAQ도 같다. S3 본문 작성 시 이 거절 문장을 약화·삭제하지 않는 것이 착수 조건이다.

| # | 제안 슬러그 | 타깃 로케일 | 커버 셀 | 1줄 답변 초안 | 근거 |
|---|---|---|---|---|---|
| C1 | `/taiwan-work-permit-renewal-lawyer` | en (+ intent-pages 계약상 ko·zh-hant·ja 동시 필요) | ② VN·ID·TH·PH의 EN 표면 | A Taiwan work permit and an ARC are renewed as two separate filings with their own deadlines, and changing employer or job category is a further application; this page sets out which dates and documents to gather before the current permit expires. Company setup as a route to residence is **not restated here** — it links to `/en/taiwan-company-setup-lawyer`. `[변호사 검수 필요]` | 공백 근거: 갱신 주제 전용 페이지 0(§4.6). 규모: S1 移工+學生 4국 합계. 중복 회피: 설립≠거류 명제는 `intent-pages.ts` 526·581–593 및 `/en/guides/taiwan-company-setup`(sitemap 37)에 이미 있어 링크만 |
| C2 | `/vi/work-permit-renewal` (guidance 코어 키 추가 필요) | vi | ② VN | Giấy phép lao động và thẻ cư trú (ARC) được gia hạn theo hai thủ tục riêng, mỗi thủ tục có thời hạn riêng; đổi chủ sử dụng lao động hoặc đổi loại công việc là hồ sơ khác. Trang này liệt kê các mốc thời hạn và giấy tờ cần chuẩn bị trước khi giấy phép hết hạn. Trang hướng dẫn này được viết bằng tiếng Việt; việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn. `[변호사 검수 필요]` | S1: 越南 移工 250,882 + 學生 48,354 · 언어 계약 문장은 기존 vi FAQ 인용(`international-guidance-content.ts` 365–368) |
| C3 | `/id/work-permit-renewal` (guidance 코어 키 추가 필요) | id | ② ID | Izin kerja dan izin tinggal (ARC) diperpanjang melalui dua prosedur terpisah dengan tenggat masing-masing; pindah majikan atau ganti jenis pekerjaan adalah permohonan tersendiri. Halaman ini merinci tenggat dan dokumen yang perlu disiapkan sebelum izin berakhir. Halaman panduan ini ditulis dalam bahasa Indonesia; konsultasi dengan pengacara hanya tersedia dalam bahasa Inggris, Mandarin, Jepang, dan Korea. `[변호사 검수 필요]` | S1: 印尼 移工 315,394 + 學生 19,492 · 언어 계약 문장은 기존 id FAQ 대응 문장 |
| C4 | `/th/work-permit-renewal` (guidance 코어 키 추가 필요) | th | ② TH | ใบอนุญาตทำงานและใบถิ่นที่อยู่ (ARC) ต่ออายุแยกกันคนละขั้นตอน และมีกำหนดเวลาของตนเอง การเปลี่ยนนายจ้างหรือเปลี่ยนประเภทงานเป็นคำขออีกฉบับหนึ่ง หน้านี้ระบุกำหนดเวลาและเอกสารที่ต้องเตรียมก่อนใบอนุญาตหมดอายุ หน้าคำแนะนำนี้เขียนเป็นภาษาไทย แต่การให้คำปรึกษากับทนายความทำได้เฉพาะภาษาอังกฤษ จีน ญี่ปุ่น และเกาหลีเท่านั้น `[변호사 검수 필요]` | S1: 泰國 移工 74,628 + 學生 2,570 · 언어 계약 문장은 기존 th FAQ 대응 문장 |
| C5 | `/fil/work-permit-renewal` (guidance 코어 키 추가 필요) | fil | ② PH | Magkahiwalay na proseso ang pag-renew ng work permit at ng ARC, at may sariling deadline ang bawat isa; hiwalay pang aplikasyon ang paglipat ng employer o pagbabago ng uri ng trabaho. Inilalatag ng pahinang ito ang mga deadline at dokumentong dapat ihanda bago mag-expire ang permit. Nakasulat sa Filipino ang gabay na ito; ang konsultasyon sa abogado ay sa Ingles, Chinese, Hapon, at Korean lamang. `[변호사 검수 필요]` | S1: 菲律賓 移工 190,032 + 學生 5,089 · 언어 계약 문장은 기존 fil FAQ 대응 문장 |

### 3.1 S3 착수 전에 확인해야 할 구조 제약 (실측)

이 네 가지는 코드에서 확인한 사실이며, 후보를 그대로 만들 수 없게 만드는 제약이다.

1. **안내 4언어에는 임의 슬러그를 추가할 수 없다.** `src/lib/public-guidance.ts`의 `resolveGuidanceMiddlewareRewrite()`는 `isGuidanceCoreSlugPath(slugPath)`가 참일 때만 페이지로 리라이트하고, 그 외 슬러그는 `__public-guidance-unavailable`로 보낸다. 코어 키는 `GUIDANCE_CORE_ROUTE_KEYS` 10개뿐이다. 따라서 C2~C5는 **`GUIDANCE_CORE_ROUTE_KEYS`·`GUIDANCE_PAGE_KEYS` 확장 + `guidanceContent` 4언어 본문 추가**가 선행되어야 하며, 그 순간 사이트맵(`appendGuidanceLocaleSitemapEntries`)에는 4언어 × 새 키가 자동으로 붙는다.
2. **EN 전용 칼럼은 만들 수 없다.** `src/app/sitemap.ts`의 칼럼 루프는 `getAllColumnPosts('ko')`를 돈다. 한국어 파일이 없는 슬러그는 어느 로케일에서도 사이트맵에 나오지 않는다. EN 칼럼을 늘리려면 `src/content/columns/`(ko)와 `src/content/columns-en/`에 같은 파일명이 동시에 필요하다 → 한국어 본문까지 변호사 검수 대상이 된다.
3. **C1 같은 인텐트 랜딩은 4로케일 동시 작성이다.** `src/data/intent-pages.ts`의 타입이 `Record<SiteLocale, Record<IntentPageSlug, IntentPageContent>>`이므로 ko·zh-hant·en·ja 네 벌이 모두 있어야 타입이 통과한다. 추가로 `src/app/sitemap.ts`의 `STATIC_PATHS`와 `src/app/[locale]/<슬러그>/` 라우트가 필요하다(기존 3개 인텐트 페이지와 같은 패턴).
4. **C2~C5 본문이 들어가야 할 파일은 번역 레인 소유다 (R1 추가).** 1의 `guidanceContent` 4언어 본문은 `src/data/international-guidance-content.ts`에 있고, 이 파일은 **동남아 번역 레인이 소유하며 이 레인은 수정하지 않는다.** 따라서 C2~C5는 그 파일을 직접 편집하는 방식으로는 착수할 수 없다. **대안:** 갱신 주제 본문만 별도 데이터 파일(예: `src/data/guidance-work-permit-renewal.ts`)에 두고 `GUIDANCE_CORE_ROUTE_KEYS`·`GUIDANCE_PAGE_KEYS`에 키 하나만 확장해 `guidanceContent`와 병합 조회하도록 하면, 번역 레인 파일을 건드리지 않고도 4언어 페이지가 발행된다(소유권 분리·충돌 0). 채택 여부는 S3 착수 시 결정.

### 3.2 후보에 넣지 않았지만 기록해 두는 관찰

③ 이주노동자 권리·임금·산재는 H 4셀(VN·ID·TH·PH)이지만 `현재 대응 URL`이 `/{locale}/services`로 존재하므로 "없음 + H" 규칙상 후보에 넣지 않았다. 다만 그 URL은 범위 안내 수준이고, **임금 체불·직업재해를 다루는 문서는 어느 언어에도 없다**(EN 칼럼 008·009·014는 해고·자발적 퇴직·최저 서비스 기간을 다룬다). 이 공백은 규칙을 느슨하게 바꾸지 않고 그대로 남겨 다음 워크오더의 판단에 넘긴다.

**R1 보강 — ③ 공백을 명시적으로 승계한다.** 검토가 지적한 대로 이 공백(임금체불·직업재해)은 ② 갱신 공백과 **다른 질문**이며, C1~C5로 덮이지 않는다. 규모 근거는 H 4셀과 동일(S1 移工 VN 250,882·ID 315,394·PH 190,032·TH 74,628)하고, 대응 URL은 `/{locale}/services` 범위 안내뿐이라 **질문에 답하는 문서는 0**이다. 다만 "없음 + H" 후보 규칙상 URL이 존재하므로 §3 후보표에는 넣지 않는다. 다음 워크오더가 이 규칙을 유지한 채 별도 트랙(예: 안내 4언어 `/services` 노동 절 확장 또는 ko·en 쌍 칼럼 신규)으로 다룰 것을 권한다. 국적별 직업재해 건수는 여전히 **미확인**이므로 이 공백의 우선순위를 규모 이상으로 올리지 않는다.

## 4. 대응 URL 실존 확인

기준 오리진 `https://tseng-law.com` — `src/lib/seo.ts` `DEFAULT_SITE_URL`(환경변수 미설정 시 `getSiteUrl()` 최종 폴백). §2에서 인용한 URL은 아래 세 종류뿐이다.

### 4.1 안내 4언어 코어 페이지 — `/{vi|id|th|fil}/services`

- 생성 규칙: `src/app/sitemap.ts` `appendGuidanceLocaleSitemapEntries()` → `GUIDANCE_LOCALES_4`(vi·id·th·fil) × `GUIDANCE_PAGE_KEYS`(home·services·about·lawyers·pricing·contact·faq·privacy·disclaimer·columns) 전조합을 `guidanceCanonicalUrl()`로 발행.
- 경로 형태: `src/lib/public-guidance.ts` `guidancePublicPath(locale,'services')` = `/{locale}/services`.
- 라우팅: `resolveGuidanceMiddlewareRewrite()`에서 `services`가 `GUIDANCE_CORE_ROUTE_KEYS`에 있으므로 `allowed: true`.
- 본문 실존: `src/data/international-guidance-content.ts` `guidanceContent[locale].pages.services` — vi(`Các lĩnh vực văn phòng nhận xử lý`)·id(`Bidang perkara yang kami tangani`)·th(`ประเภทเรื่องที่สำนักงานรับดำเนินการ`)·fil 모두 존재하며, 각 언어 본문에 투자·설립 / 민사 / 가족·상속 / 노동 / 형사 / 지재 6개 절이 있다. §2에서 ①③④⑤⑥ 셀에 이 URL을 쓴 근거가 이 6개 절이다.

### 4.2 EN 인텐트 랜딩 — `/en/taiwan-company-setup-lawyer`, `/en/taiwan-litigation-lawyer`

- `src/app/sitemap.ts` `STATIC_PATHS`에 `/taiwan-company-setup-lawyer`·`/taiwan-litigation-lawyer` 포함 → `locales`(ko·zh-hant·en) 루프의 `createEntry` → `getLocalizedPath('en', …)`.
- 라우트 실체: `src/app/[locale]/taiwan-company-setup-lawyer/`, `src/app/[locale]/taiwan-litigation-lawyer/`.
- 콘텐츠: `src/data/intent-pages.ts` `intentPages.en['taiwan-company-setup-lawyer']`, `intentPages.en['taiwan-litigation-lawyer']`.
- `src/lib/seo-visibility.ts` `isEnglishNoindexPath` 대상이 아니므로 `applyLocaleIndexabilityRules`에서 제거되지 않는다.

### 4.3 EN 서비스 영역 — `/en/services/labor`

- `src/app/sitemap.ts`의 `for (const area of serviceAreaRecords) … createEntry(locale, '/services/' + area.slug)`. 소스 슬러그는 `src/data/service-details.ts`의 6개(`investment`·`civil`·`family`·`labor`·`criminal`·`ip`)이며 `src/lib/builder/services/source.ts`는 오버라이드가 충돌하면 소스 슬러그로 되돌린다.
- 라우트 실체: `src/app/[locale]/services/[slug]/`.

### 4.4 EN 칼럼 (§2에서 인용한 7편 — 대응 URL 열 5편 + 이유 열 전용 2편)

규칙: 사이트맵의 칼럼 루프가 `getAllColumnPosts('ko')`를 돌고, EN 행은 `isEnglishNoindexPath(path, isFileBackedEnglishColumnPath)`가 거짓일 때만 살아남는다 — 즉 `src/content/columns-en/`에 같은 파일명이 있어야 한다. 아래 7편은 ko·en 양쪽 파일이 모두 존재한다. 앞 5편은 `현재 대응 URL` 열에 쓴 것이고, 뒤 2편(012·015)은 `이유` 열에서만 언급했다(R1: 초판의 "5편" 표기가 나열 7편과 불일치했다).

- `/en/columns/taiwan-labor-severance-law` — `008-taiwan-labor-severance-law.md` (EN 제목 "Taiwan Labor Law: Is Severance Pay Hard to Get in Taiwan??")
- `/en/columns/taiwan-voluntary-resignation-severance` — `009-taiwan-voluntary-resignation-severance.md`
- `/en/columns/taiwan-divorce-lawsuit-qna` — `007-taiwan-divorce-lawsuit-qna.md`
- `/en/columns/taiwan-inheritance-custody-analysis` — `016-taiwan-inheritance-custody-analysis.md`
- `/en/columns/taiwan-traffic-accident-procedure` — `003-taiwan-traffic-accident-procedure.md`
- `/en/columns/taiwan-overtaking-accident-liability` — `012-taiwan-overtaking-accident-liability.md`
- `/en/columns/taiwan-company-setup-pitch-location` — `015-taiwan-company-setup-pitch-location.md` (⑦ 셀 이유 열에서만 언급)

### 4.5 의도적으로 쓰지 않은 URL

- `https://tseng-law.com/en/faq` — `isEnglishNoindexPath`가 `/faq`를 EN noindex로 분류해 사이트맵의 EN 행이 삭제된다. 대응 URL로 쓰지 않았다.
- `/{vi|id|th|fil}/services/<영역>` 형태 — `GUIDANCE_CORE_ROUTE_KEYS`에 없어 `__public-guidance-unavailable`로 간다. 존재하지 않으므로 쓰지 않았다.
- `/{vi|id|th|fil}/columns/<슬러그>` 형태 — 안내 4언어에는 칼럼 목록 페이지(`/columns`)만 있고 개별 칼럼 번역이 없다. 쓰지 않았다.

### 4.6 "비자·거류 페이지 없음"의 정확한 범위 (R1 신설)

초판은 §1·② 셀 이유 열에서 "어느 언어에도 비자·거류 페이지 없음"이라고 적었다. **과대 서술이다.** 코드 확인 결과는 다음과 같다.

| 명제 | 판정 | 근거 |
|---|---|---|
| 노동허가·ARC **갱신**(만료·이직·고용주 변경)을 주제로 하는 전용 페이지가 있다 | **없음 (0)** | `intentPageSlugs`·`GUIDANCE_CORE_ROUTE_KEYS` 어디에도 해당 키 없음 |
| 거류·취업 자격이 설립과 별건이라는 **문장**이 어딘가에 있다 | **있음** | 안내 4언어 `/services` 투자 절 — `international-guidance-content.ts` vi 147 · id 618 · th 1089 · fil 1560 |
| 설립 후 거류허가 절차 지원을 다루는 **EN 표면**이 있다 | **있음** | `intent-pages.ts` 526(hero) · 581–583 · 591–593(FAQ) — `/en/taiwan-company-setup-lawyer`. 추가로 `/en/guides/taiwan-company-setup`(`sitemap.ts` `STATIC_PATHS` 37) |

따라서 이 문서가 주장하는 공백은 **"갱신 주제 전용 페이지 0"**이며, "비자·거류를 다루는 페이지 0"이 아니다. ② VN·ID·TH·PH 4셀의 H는 이 좁힌 명제로도 그대로 성립한다(질문이 갱신이고, 질문 언어 표면에 갱신 문서가 없다).

## 5. 출처 표

조회일은 전부 **2026-09-09**(KST). 등급 기준은 WO 공통 규칙 — A 공식통계 / B 정부·협회 / C 업계리서치 / D 언론 / E 추정. **S4는 자사 1차 자료이므로 A~E 척도를 쓰지 않고 `1차(자사 GSC, 척도 외)`로 표기하며, 조회일과 원 실측일을 구분한다(R1).**

| # | 출처 | URL | 조회일 | 등급 | 이 문서에서 쓴 값 |
|---|---|---|---|---|---|
| S1 | 內政部移民署 『外僑居留人數統計表 11507』 시트 `07_現持有效居留證(按國籍及職業)` — 자료 기준일 115년 7월 31일(2026-07-31), 자료출처 移民事務組 | 목록 페이지 https://www.immigration.gov.tw/5385/7344/7350/%E5%A4%96%E5%83%91%E5%B1%85%E7%95%99/?alias=settledown · 파일 https://www.immigration.gov.tw/media/121153/外僑居留人數統計表11507.ods | 2026-09-09 | **A** | (1) §2.1 1~4열: 6국 체류자 계·移工 계·學生·商務人員·工程師. (2) §2 `이유` 열의 **직업 세목** — 製造業技工(VN 206,007 · TH 57,028 · PH 163,764) · 營建業技工(TH 14,866) · 監護工(ID 192,962 · PH 21,213) · 기타 유업자(MY 11,147) · 移工/學生 국가별 값. 세목은 같은 시트 `07_現持有效居留證(按國籍及職業)`의 직업 분류 행에서 인용했으나 **원표 ODS가 이 레포에 없어 R1 시점 재대조는 못 했다 → `[원표 세목 · 레포 미수록]`** |
| S2 | 勞動部勞動力發展署 정부자료개방플랫폼 데이터셋 41882 『產業及社福外籍勞工人數－按國籍及行業分』, 연도 114(2025), 갱신주기 매 1년 | 데이터셋 https://data.gov.tw/dataset/41882 · CSV https://apiservice.mol.gov.tw/OdService/download/A17000000J-030124-02e | 2026-09-09 | **A** | 產業·社福 移工 국적별 (§2.1 6열): 총계 766,212 / 印尼 293,586 / 越南 233,313 / 菲律賓 170,252 / 泰國 69,060 / 馬來西亞 1 |
| S3 | 內政部移民署 『外僑居留人數統計表 11507』 시트 `27_現持有效外僑居留證之外籍配偶（按國籍及區域）` — 자료 기준일 115년 7월 31일(2026-07-31) | (S1과 동일 파일) https://www.immigration.gov.tw/media/121153/外僑居留人數統計表11507.ods | 2026-09-09 | **A** | 외국인 배우자 국적별 (§2.1 5열): 합계 83,188 / 越南 30,007 / 泰國 9,231 / 馬來西亞 6,463 / 印尼 6,278 / 菲律賓 4,941 / 新加坡 1,132 |
| S4 | 자사 Google Search Console 실측 기록 (sc-domain:tseng-law.com, 2026-08-03~08-30, Web) — 이 레포 `docs/seo/EN-SEA-BASELINE-2026-09-01.md` §5에 기록된 1차 자료 | (콘솔 비공개) 사내 기록: docs/seo/EN-SEA-BASELINE-2026-09-01.md | 조회일 2026-09-09(레포 파일 재확인) / **원 실측 2026-09-02**(해당 파일 §5 표제행) | **1차(자사 GSC, 척도 외)** | SG 셀 ①의 **보조** 근거로만: SG 클릭 1·노출 16, 상위 쿼리 `台湾公司设立`(0/8)·`台湾注册公司`(0/7) |

### 5.1 출처 표에 대한 주석 (등급 과대 표기 방지)

- **S1·S3은 같은 파일의 다른 시트다.** 서로 독립적인 두 출처가 아니다.
- **S4는 A~E 척도 밖이다(R1: `A*` → `1차(자사 GSC, 척도 외)`).** A~E는 외부 통계에 대한 척도이고 S4는 자사 콘솔 1차 실측이라 그 척도에 그대로 얹으면 과대·과소 어느 쪽이든 오표기가 된다. 초판의 `A*`는 등급 칸에 `A` 글자를 남겨 A급 외부 통계처럼 읽힐 여지가 있어 표기 자체를 바꿨다. 조회일도 원 실측일(2026-09-02, 기간 2026-08-03~08-30)과 분리했다. **S4를 단독 근거로 H를 준 셀은 없다.** SG ①은 M이며, 그 M조차 S1(체류 3,217, 6국 최소)이 1차 근거다. 완료 기준 3(E등급 근거 H 금지)과 무관하게, 이 문서의 H 9셀은 전부 S1/S2/S3만으로 성립한다.
- **S1·S3의 남녀 합계는 원표에 없는 파생값이다.** 원표는 국적별로 男/女 두 칸만 제공한다(합계 열은 전체 국적 `合計` 블록에만 있다). §2.1의 합계는 그 두 칸을 더한 것이며 계산 근거를 §2.1 아래에 명시했다.
- **S2는 갱신주기가 연 1회이고 최신 연도가 민국 114년(2025)이다.** S1(2026-07-31)보다 시점이 낡았다. 두 출처의 移工 수치가 다른 것은 시점 차이와 집계 범위 차이(S1은 유효 거류증 보유 전체, S2는 產業·社福 移工 한정) 때문이며, 이 문서는 두 값을 섞어 하나의 값으로 만들지 않았다.
- **다음 항목은 이 문서에서 확인하지 못했다 → 미확인.**
  - 6국 사용자의 영어·중국어 사용률(상담 언어 EN/ZH 전환 가능성의 정량 근거). 각국 駐台 대표부 페이지에서 A/B급 수치를 찾지 못했다. 따라서 "PH·MY·SG는 영어가 통한다"류의 명제를 우선순위 근거로 쓰지 않았다.
  - 국적별 교통사고·직업재해 발생 건수. ⑥·③의 산재 부분 우선순위를 규모 이상으로 올릴 근거가 없어 올리지 않았다.
  - MY·SG의 대만향 투자·거래 규모(수요 주체가 대만 밖인 ①⑤의 직접 모수). 확인하지 못해 M/L에 두었다.
  - 국적별 검색량·검색 점유율. WO 금지 항목이자 A/B 출처 없음 — 한 건도 쓰지 않았다.

## 6. 언어 계약 자기점검

- 이 문서 전체에서 **vi·id·th·fil로 상담·통역이 가능하다는 서술은 0건이다.** §2의 `대표 질문(현지어)` 열은 사용자가 검색창·AI에 입력할 문장이며, 그 뜻을 §1의 「표 읽는 규칙」과 「언어 계약」 절에 명시했다.
- §3의 신규 페이지 후보 C2~C5는 **안내(guidance) 페이지**다. 1줄 답변 초안 어디에도 상담·통역 제공, 회신 시간, 예약, 비용 금액, 거류·취업 결과 보장을 적지 않았다. **R1 수정:** 초판 초안에는 `hỏi luật sư`·`ปรึกษาทนายความ`·`bertanya kepada pengacara`·`magtanong sa abogado`처럼 "그 언어로 변호사에게 묻는다"로 읽힐 수 있는 문구가 있었다. 전부 삭제하고, 대신 각 초안 안에 **상담 언어는 EN/ZH/JA/KO뿐**이라는 기존 FAQ 문장을 그대로 넣었다(vi 원문: `international-guidance-content.ts` 365–368). 초안 주제도 "설립≠거류"(기존 문장 복제)에서 **"노동허가·ARC 갱신"**으로 바뀌었으므로, 그 부분은 더 이상 기존 게재 문장의 범위 안에 있지 않다 → 아래 새 법률 주장 항목 참조.
- **상담 언어 표기는 "English / Chinese / Japanese / Korean"만 사용했다**(§1 언어 계약 절). 다른 조합을 쓴 곳이 없다.
- JSON-LD·메타 태그는 이 워크오더에서 건드리지 않았다. `availableLanguage`를 넓히는 제안도 하지 않았다.
- 광고 규정 자기점검(**R1에서 사실대로 다시 씀**): 승소율·성공 보장 표현 **0건**. WO 금지 토큰 **"최고"·"유일" 0건** — 초판에는 MY ④ 이유 열에 "체류 총계 대비 비중은 6국 최고" 1건이 있었고 R1에서 삭제·재서술했다(지시 대상이 사무소가 아니어도 금지 토큰 0건 기준을 지킨다). 이 항목의 "최고/유일"은 자기점검 문장인 본 줄과 §1 "이 문서가 주장하지 않는 것"에만 남는다. **"1위"는 0건이 아니다** — ID ②·ID ③ 이유 열에 "6국 1위" 2건이 있다. 이는 사무소가 아니라 **출처 통계에서의 국가 간 순위**(S1 移工 계 국가별 최댓값)이며 "6국 최다/최소"와 같은 성격이므로 유지한다. 초판이 "1위 표현 0건"이라고 쓴 것은 오서술이었다.
- 새 법률 주장 자기점검(**R1에서 갱신**): §1·§2·§4·§5의 법적 서술은 전부 사이트에 이미 게재된 문장 또는 A급 통계에서 왔다. 그러나 R1에서 C1~C5 초안을 "노동허가·ARC 갱신"으로 재정의하면서 **사이트에 없는 새 법률 서술이 생겼다**(갱신이 두 개의 별도 신청이라는 점, 고용주·직종 변경이 별건이라는 점). 해당 5개 초안 셀에 **`[변호사 검수 필요]` 마커를 붙였다.** 이 문서는 그 명제의 근거 법령을 제시하지 않으며, S3 본문 단계에서 근거 조문 확인과 변호사 검수를 거치기 전에는 발행하지 않는다.

## 7. 변경 이력

- 2026-09-09 — 최초 작성(WO-S1). 42셀 채움, H 9셀, "없음" 12셀, 신규 페이지 후보 5개, 출처 4건.
- 2026-09-09 — **R1 반려 수정(WO-S1-R1).** 독립 검토 `sea-intent-map-2026-09.REVIEW.md`(총평 FAIL·FAIL 5)의 지적을 전부 반영. 42셀·H 9셀은 불변, "없음" 12→10셀, 후보 5개는 주제 재정의(설립≠거류 → 노동허가·ARC 갱신). 상세는 §8.

## 8. R1 수정 이력 (WO-S1-R1)

검토 파일: `docs/seo/sea-intent-map-2026-09.REVIEW.md` (Grok 4.6, 2026-09-09, FAIL 5). **검토 의견을 반박하지 않고 전부 반영했다.** 줄 번호는 R1 이전(초판) 기준이다.

| 항목 | 원문 줄 | 수정 내용 |
|---|---|---|
| **1. 출처 표 URL·등급 vs 본문** (REVIEW §1 a·b·c·d) | 8 · 54 · 173 · 176 · 169 · 181 | (a) 8행 "70~82%" → "70.6%~86.0%"로 고치고 VN 70.6 / ID 82.2 / TH 80.5 / **PH 86.0** 네 값을 §2.1 표에서 계산해 각각 명시(초판은 PH를 구간 밖으로 잘라 냈다). (b) 173행 S1 `쓴 값` 칸에 §2 이유 열이 쓰는 **직업 세목**(製造業技工·營建業技工·監護工·기타 유업자)을 국가별 수치와 함께 열거하고, 원표 ODS가 레포에 없어 재대조하지 못한 점을 `[원표 세목 · 레포 미수록]`로 강등 표기. §2 이유 열의 해당 수치에도 `(S1 직업 세목)` 꼬리표를 붙임(VN ③·ID ③·TH ③·PH ③·MY ②). (c) 54행 TH ③ "산재 노출 업종 집중" **삭제** → "제조·건설 技工이 移工의 대부분(S1 직업 세목). 국적별 산재 건수는 미확인"으로 교체(A급 직업 구성 → 미확인 산재 위험으로의 등급 연장 제거). (d) 176행 S4 등급 `A*` → **`1차(자사 GSC, 척도 외)`**, 조회일 → "조회일 2026-09-09(레포 파일 재확인) / 원 실측 2026-09-02". 169행 등급 기준 문단과 181행 §5.1 주석도 같은 표기로 갱신. |
| **2. 현지어 질문 자연스러움** (REVIEW §2) | 39 · 40 · 41 · 45 · 49 · 52 · 55 · 57 · 62 · 64 | **필수:** TH ④의 양육"비"(child support) 어형을 **`สิทธิปกครองบุตร`**(양육권)으로 교체 — 영어 열 custody와 개념 일치. 교체 전 원문은 REVIEW §2 th 표 55행 참조(완료 기준의 grep 0을 지키기 위해 이 문서에는 옛 어형을 남기지 않는다). **권고 전건 반영:** VN ② 노동허가·ARC를 한 문장에 자연스럽게 묶음(`Giấy phép lao động và thẻ cư trú (ARC) sắp hết hạn thì gia hạn thế nào ở Đài Loan?`) · VN ③ `lao động Việt` → `người lao động Việt Nam` · VN ④ `chồng` → `vợ/chồng`(성별 고정 제거) · ID ① `Orang Indonesia yang ingin mendirikan…` · ID ⑤ `invoice` → `faktur` · TH ① `…เอกสารอะไรบ้าง และ…` · TH ⑥ `ขับรถจักรยานยนต์ชนกันที่ไต้หวัน และ…` · PH ④ `kustodiya` → `custody` · PH ⑥ `ano ang susunod` → `ano ang susunod na hakbang?`. |
| **3. 대응 URL 실존·공백 서술** (REVIEW §3 a·b·c) | 67 · 74 · 9 · 39/46/53/60 · 10 · 81 · 102 · 149 | (a) MY ②·SG ② `현재 대응 URL` `없음` → **`https://tseng-law.com/en/taiwan-company-setup-lawyer`**, 이유 열은 "전용 페이지 없음, 설립 랜딩 FAQ로 부분 대응(`intent-pages.ts` 526·581–593)"으로 교체. 이에 따라 "없음" 셀 12→10, §1-3·§2 셀 수 검증·§3 도입부의 카운트를 전부 갱신(42셀·H 9·M 19·L 14는 불변). (b) "어느 언어에도 비자·거류 페이지 없음" 과대 서술 제거 — §1-2를 "**갱신 주제 전용 페이지 0**"으로 좁히고 기존 문장의 소재(vi 147·id 618·th 1089·fil 1560, `intent-pages.ts` 526·581–593)를 명시, ② 4셀 이유 열도 "갱신 주제 전용 페이지 없음(현지어·EN 모두)"으로 교체, **§4.6 신설**로 세 명제의 참/거짓을 표로 분리. (c) §4.4 제목 "인용한 5편" → "**인용한 7편** — 대응 URL 열 5편 + 이유 열 전용 2편(012·015)"으로 수정. |
| **5. 광고 규정** (REVIEW §5) | 69 · 196 · 18 | 69행 MY ④ 이유 열 끝의 **WO 금지 토큰 1건**("체류 총계 대비 비중은 6국 …") **삭제** → "馬來西亞 외국인 배우자 6,463(S3)는 6국 3위. 체류 계 대비 비율 6,463/27,448(S1·S3)"로 재서술. 196행 자기점검을 사실대로 다시 씀 — 승소율·성공 보장 0건, **WO 금지 토큰 0건(초판 1건을 R1에서 삭제했음을 명시)**, **"1위"는 0건이 아니라 ID ②·ID ③ 2건이며 국가 간 통계 순위라 유지**한다고 기재(초판의 "1위 표현 0건"은 오서술이었음을 적음). 18행에도 R1 삭제 사실을 괄호로 부기. |
| **6. 신규 페이지 후보 중복** (REVIEW §6) | 104 · 106–112 · 118–120 · 124 · 193 · 197 | **C1 재정의:** 슬러그 `/taiwan-work-permit-residence-lawyer` → `/taiwan-work-permit-renewal-lawyer`, 주제를 "설립≠거류"(기존 EN 랜딩 FAQ·`/en/guides/taiwan-company-setup`와 명제 중복)에서 **② H 4셀의 실제 질문인 노동허가·ARC 갱신(만료·이직·고용주 변경)**으로 교체하고, 설립≠거류는 재서술 없이 `/en/taiwan-company-setup-lawyer` **링크만**. 커버 셀에서 **② MY·SG 제거**(기존 EN 랜딩을 대응 URL로 고정). **C2~C5 재정의:** 슬러그 `/{vi,id,th,fil}/work-permit-renewal`, 초안을 `/services` 투자 절 복제에서 갱신 안내로 전면 교체하고 `hỏi luật sư`·`ปรึกษาทนายความ`·`bertanya kepada pengacara`·`magtanong sa abogado` 문구를 **전부 삭제**, 대신 각 초안에 상담 언어 EN/ZH/JA/KO 한정 문장을 넣음. **§3 도입부에 언어 계약 원칙 명시** — 기존 안내 4언어 FAQ의 거절 문장(vi: "Tôi có thể được tư vấn bằng tiếng Việt không? → Không", `international-guidance-content.ts` 365–368)을 S3 본문에서 약화·삭제하지 않는 것이 착수 조건. **§3.1에 제약 4 추가** — C2~C5 본문이 필요한 `src/data/international-guidance-content.ts`는 번역 레인 소유·수정 금지이며, 대안으로 별도 데이터 파일 + 코어 키 1개 확장 후 병합 조회를 1줄 제안. **§3.2 보강** — ③ 임금체불·직업재해 공백은 ② 갱신 공백과 다른 질문이고 C1~C5로 덮이지 않음을 명시하고 "없음 + H" 규칙은 그대로 둔 채 다음 워크오더로 승계. 초안이 새 법률 서술을 담게 되었으므로 C1~C5에 **`[변호사 검수 필요]`** 마커를 붙이고 §6 자기점검을 그에 맞게 갱신. |

### 8.1 검토 응답 (반박 아님 · 판단 근거 기록)

검토 지적은 **전부 원본에 반영했고 반박하지 않는다.** 아래는 검토가 선택지를 열어 둔 곳에서 어느 쪽을 골랐는지와 그 이유다.

1. **C1을 "제거"가 아니라 "재정의"로 처리했다.** WO는 (a) 제거 / (b) 겹치지 않는 공백으로 재정의 중 택일을 허용했고, REVIEW §6 수정안 1도 같은 두 갈래다. 제거하면 ② H 4셀(전부 "없음 + H")의 EN 표면 후보가 사라져 §3의 후보 규칙이 도출한 4셀 중 어느 것도 EN에서 커버되지 않는다. 그래서 **REVIEW 수정안 1의 후자**(슬러그를 쓰되 ARC·노동허가 갱신만 다루고 설립≠거류는 링크만)를 골랐다.
2. **③ 임금체불·직업재해 공백은 후보표가 아니라 §3.2에 기록했다.** WO는 재정의 대상 공백의 예로 ③을 들었고, REVIEW는 동시에 "없음 + H 규칙을 느슨하게 바꾸라고 하지 않는다"고 못 박았다. ③ 4셀은 `현재 대응 URL`이 `/{locale}/services`로 **존재**하므로 후보표에 넣으면 그 규칙이 깨진다. 규칙을 유지한 채 공백을 잃지 않기 위해, ② H 4셀의 실제 질문(갱신)으로 C1~C5를 재정의하고 ③ 공백은 §3.2에 별도 트랙으로 **명시 승계**했다. 두 공백 중 어느 것도 사라지지 않는다.
3. **"1위" 2건을 삭제하지 않고 유지했다.** REVIEW §5가 "`1위`는 WO 문구 목록에 없고 통계 순위라 추가 FAIL로 쌓지 않는다"고 했고, WO 4항도 "1위 토큰 존재 명시 **또는** 삭제"를 허용했다. 값이 S1 원표에서 직접 나오는 국가 간 순위라 삭제하면 근거가 약해지므로 **존재를 명시**하는 쪽을 택했다. WO 금지 토큰 쪽은 삭제했다(§8 5항).
4. **검토가 확인하지 못한 것은 R1에서도 확인하지 못했다.** 원 ODS(S1/S3)·S2 CSV가 이 레포에 없어 직업 세목·766,212 등 원표 칸값은 여전히 미대조이며, 그 사실을 S1 `쓴 값` 칸에 `[원표 세목 · 레포 미수록]`로 남겼다. 라이브 HTTP 상태코드도 치지 않았다(실존은 코드 규칙 근거). vi/id/th/fil 원어민 검수도 받지 않았다 — §2 교정문은 검토자 제안을 그대로 반영한 것이다.
