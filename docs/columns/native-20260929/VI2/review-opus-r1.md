# VI2 중간검수 r1 (Opus 5.5) — 031 taiwan-migrant-worker-occupational-injury-compensation

verdict: REVISE

요약: 조문 인용 자체는 대부분 정확하다(勞基法 §13·59·60·61·62, 職保法 §5·11·28·36·37·39·42·49·51·84·86·88·90·91, 民法 184·192–197, 就服法 §56·57·59, 轉換準則 §11, 勞資爭議處理法 §9·23, 勞動事件法 §16, 審查準則 §4·17을 curl 원문으로 대조). 문제는 **적용 범위**다. 베트남 독자의 큰 비중인 家庭看護工·家庭幫傭은 勞基法 적용 제외인데 본문은 이를 말하지 않고 §59·§13을 모두에게 적용되는 듯 쓴다. 이와 함께 職保法 §27의 1년 규정을 신청기한처럼 서술한 부분, 링크 32개(목표 5–10), 解約驗證 누락을 고쳐야 한다.

P0: 0 / P1: 4 / P2: 12

---

## P1 (오해 소지·중요 누락·형식 위반)

### P1-1. 가정 간병인·가사도우미가 勞基法 적용 제외라는 사실 누락 (본문 전체와 FAQ3에 영향)

- 위치: l.35 "Không phải ai cũng thuộc luật này. [Điều 3] cho phép Bộ Lao động chỉ định ngành hoặc nhóm việc không áp dụng. Nếu bạn làm chăm sóc, giúp việc gia đình hoặc làm trên tàu cá, hãy hỏi 1955 xem mình thuộc nhóm nào." / l.25 도입부(tàu cá·chăm sóc 독자를 부르고 곧바로 "bồi thường của chủ thuê theo luật lao động"을 세 가지 돈 중 첫째로 제시) / FAQ3 "có quyền nhận tiền tuất từ chủ thuê"
- 문제: 家庭看護工·家庭幫傭은 勞基法 적용 대상이 아니다. 따라서 §59 보상(40개월분 사망보상 포함)과 §13 해고금지가 적용되지 않는다. 지금 글대로면 간병인 독자는 §59를 청구할 수 있다고 믿게 된다. 반면 이 독자층에게 실제로 적용되는 보호(職保 강제가입, 職保法 §84·86·91, 民法 §487-1)는 빠져 있다. 어선 선원을 간병인과 한데 묶어 "모르겠으니 1955에 물어보라"고 쓴 것도 부정확하다. 국내에서 고용된 어선 선원은 勞基法 적용 대상이다.
- 근거:
  - 勞保局「勞動部指定適用勞基法現況」 https://www.bli.gov.tw/0007341.html : 「目前除下列各業及工作者不適用勞基法外，其餘一切勞雇關係，均適用勞基法：（一）不適用之各業 國際組織及外國機構。未分類其他餐飲業。家事服務業。」 이 목록에 어업은 없다. 勞基法 §3 I①도 「農、林、漁、牧業」을 적용 업종으로 명시한다(curl 원문).
  - 職保法 §6 I①「受僱於領有執業證照、依法已辦理登記、設有稅籍或經中央主管機關依法核發聘僱許可之雇主」, 施行細則 §6 ⑩「其他經中央主管機關依就業服務法規，核發聘僱外國人從事工作聘僱許可之雇主」(pcode N0050039, curl 원문)
  - 勞動部 50670 https://www.mol.gov.tw/1607/1632/1640/50670/ : 「《勞工職業災害保險及保護法》(下簡稱災保法)自111年5月1日施行…受僱於…經中央主管機關依法核發聘僱許可雇主(指家事移工雇主)之勞工，不論單位僱用人數多寡，均為強制納保對象」. 勞保局 https://www.bli.gov.tw/0106030.html 에도 「強制投保單位 登記有案單位（含家事移工雇主）」로 나와 있다.
  - 職保法 §84(해지 제한)는 勞基法 적용 여부와 관계없이 적용된다. §86 III「不適用勞動基準法之勞工依前條，或其雇主依第八十四條規定終止勞動契約者，雇主應以不低於勞工退休金條例規定之資遣費計算標準發給離職金，並應於終止勞動契約後三十日內發給」. §90 II「遭遇職業傷病而不適用勞動基準法之被保險人」.
  - 民法 §487-1「受僱人服勞務，因非可歸責於自己之事由，致受損害者，得向僱用人請求賠償。」
  - 境外僱用 원양어선 선원: 境外僱用非我國籍船員許可及管理辦法 §6 I③ https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=M0050061&flno=6 「經營者應於勞務契約存續期間內為船員投保人身意外、醫療及一般身故保險；其醫療險實支實付不得低於新臺幣三十萬元，一般身故保險金額不得低於新臺幣一百五十萬元；未依規定辦理保險、保險範圍不足或未能自保險人獲得足額理賠，其損失或損害賠償，由經營者負擔。」 이 선원들에게 勞基法이나 職保法이 적용되는지는 공식 출처로 확인하지 못했으므로 단정하지 않는다.
- 수정안: l.35 문단을 삭제하고 §59 섹션 바로 다음에 아래 섹션을 넣는다. 소제목 수가 9개가 되므로 "Ai quyết định có phải tai nạn lao động"은 보험 섹션 끝에 합쳐 8개를 유지한다.

> ## Chăm sóc tại nhà, giúp việc gia đình, tàu cá: quyền lợi không giống nhau
>
> Nếu bạn chăm sóc người bệnh hoặc giúp việc trong nhà chủ (家庭看護工, 家庭幫傭), Luật Tiêu chuẩn lao động không áp dụng cho bạn. Ngành dịch vụ gia đình (家事服務業) nằm trong [danh sách không áp dụng luật này](https://www.bli.gov.tw/0007341.html). Vì vậy các khoản theo Điều 59 và quy định cấm chấm dứt hợp đồng ở Điều 13 không dùng được cho bạn.
>
> Bạn vẫn có chỗ dựa khác. Từ ngày 1/5/2022, chủ thuê có giấy phép tuyển lao động nước ngoài bắt buộc phải đóng bảo hiểm tai nạn lao động cho người chăm sóc, giúp việc tại nhà ([Bộ Lao động](https://www.mol.gov.tw/1607/1632/1640/50670/)). Các khoản trợ cấp ở phần dưới, kể cả khi chủ thuê chưa đóng, vẫn áp dụng cho bạn. Điều 84 luật bảo hiểm cũng hạn chế việc chấm dứt hợp đồng khi bạn bị tai nạn lao động. Nếu hợp đồng chấm dứt hợp lệ, Điều 86 buộc chủ thuê trả tiền nghỉ việc (離職金) trong 30 ngày. Muốn đòi chủ thuê bồi thường thiệt hại, bạn dựa vào Điều 91 luật bảo hiểm và Điều 487-1 Bộ luật Dân sự (người làm thuê bị thiệt hại khi làm việc mà không do lỗi của mình).
>
> Người chăm sóc làm cho viện dưỡng lão hoặc trung tâm chăm sóc tư nhân (機構看護工) thì thuộc Luật Tiêu chuẩn lao động như công nhân nhà máy. Thuyền viên tàu cá được cấp phép làm việc tại Đài Loan cũng vậy, vì ngành đánh bắt cá không bị loại trừ. Thuyền viên tàu viễn dương tuyển ở nước ngoài (境外僱用) thì theo quy định riêng của ngành thủy sản: hợp đồng phải có bảo hiểm tai nạn, bảo hiểm y tế tối thiểu 300.000 Đài tệ và bảo hiểm tử vong tối thiểu 1.500.000 Đài tệ. Nếu chủ tàu không mua hoặc mua thiếu, chủ tàu phải tự bồi thường (Điều 6 境外僱用非我國籍船員許可及管理辦法). Nếu không chắc mình thuộc nhóm nào, hãy gọi 1955.

  같은 이유로 아래도 고친다.
  - l.25 도입부: "bồi thường của chủ thuê theo luật lao động" 뒤에 "(nếu bạn thuộc Luật Tiêu chuẩn lao động)"를 덧붙인다.
  - FAQ3 답변 교체: "Thân nhân thuộc diện được hưởng có thể nhận tiền tuất từ bảo hiểm tai nạn lao động, tiền bồi thường tử vong của chủ thuê nếu người mất thuộc Luật Tiêu chuẩn lao động, và bồi thường dân sự nếu có người có lỗi. Giấy tờ làm ở Việt Nam phải được cơ quan đại diện của Đài Loan chứng thực và kèm bản dịch tiếng Trung, nên hãy hỏi trước khi chuẩn bị." 근거: 職保法施行細則 §47「於國外製作：經我國駐外館處驗證…前項文件、資料為外文者，應檢附…中文譯本」.
  - 보험 섹션 l.39 "có hiệu lực từ năm 2022"는 "có hiệu lực từ ngày 1/5/2022"로 바꾼다. 근거는 위의 MOL 50670.

### P1-2. 職保法 §27의 1년 규정을 신청기한처럼 서술

- 위치: l.45 "Nhưng nếu bảo hiểm đã ngừng, ví dụ bạn đã nghỉ việc hoặc về nước, Điều 27 chỉ cho một năm kể từ hôm sau khi ngừng để xin các khoản liên quan cùng thương tích đó."
- 문제: 원문 §27 II「被保險人在保險有效期間遭遇職業傷病，於保險效力停止之翌日起算一年內，得請領同一傷病及其引起疾病之醫療給付、傷病給付、失能給付或死亡給付。」는 퇴보험 뒤에도 같은 상병의 급여를 보장하는 연장 조항이다. 입법 취지 역시 퇴직한 산재근로자의 보호 강화다. 청구권 소멸시효는 §37「自得請領之日起，因五年間不行使而消滅」이 별도로 정한다. 그런데 초안은 바로 앞 문장의 5년과 대비시켜 "1년 안에 신청하지 않으면 끝"으로 읽히게 썼다. 그러면 퇴사한 지 1년이 넘었지만 재직 중 발생한 급여를 청구할 수 있는 독자가 권리를 포기하게 된다. 공식 해석을 찾아보았지만 勞保局 FAQ(https://www.bli.gov.tw/0106249.html)는 조문을 되풀이할 뿐이었다(「被保險人在加保有效期間內所發生之職災傷病事故，於保險效力停止後1年內，得請領同一傷病及其引起的疾病之職災保險傷病給付」). 1년이 "사고(치료·휴업·장해 진단·사망)가 발생해야 하는 기간"인지 "신청 기간"인지를 단정할 공식 해석은 찾지 못했다. 그래서 어느 해석에서도 틀리지 않는 문장을 제안한다.
- 수정안: "Về thời hạn, quyền xin trợ cấp bảo hiểm mất sau 5 năm kể từ ngày có thể xin ([Điều 37]). Nhưng nếu bảo hiểm của bạn đã ngừng, ví dụ đã nghỉ việc hoặc về nước, Điều 27 chỉ bảo đảm các khoản cho cùng thương tích đó trong vòng một năm kể từ hôm sau ngày ngừng bảo hiểm. Vì vậy đừng chờ về nước mới lo. Hãy nộp hồ sơ khi còn ở Đài Loan."

### P1-3. 공식 링크 32개 (BRIEF 5–10개)

- 목록(10개 이하로 유지). 나머지 조문은 링크 없이 "Điều N"으로만 언급한다. 초안이 §26·27·49·51·86에서 이미 이렇게 쓰고 있다.
  1. 勞基法 §59 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=59
  2. 勞基法 §61 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0030001&flno=61
  3. 勞保局 勞基法 적용 현황(家事服務業 제외) https://www.bli.gov.tw/0007341.html (신규)
  4. 勞動部: 職保法 2022-05-01 시행과 家事移工 강제가입 https://www.mol.gov.tw/1607/1632/1640/50670/ (신규. 職保法 LawAll 링크를 대체)
  5. 職保法 §36 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=36
  6. 職保法 §84 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=84 (勞基法 §13 링크를 대체. §84는 간병인에게도 적용됨)
  7. 職保法 §91 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0050031&flno=91
  8. 勞資爭議處理法 §9 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0020007&flno=9
  9. 1955 현행 공식 페이지(勞動力發展署, 檢核日期 115-09-14) https://www.wda.gov.tw/News_Content.aspx?n=277&s=18960 (2019년 보도자료 44643을 대체)
  10. 法律扶助基金會 勞動訴訟扶助專案 https://www.laf.org.tw/service-project-detail/9
- 제외: 職保法 LawAll·§11·§39·§42·§37·§5·§88·§90·§73, 審查準則, 勞基法 §3·§13·§60·§62, 就服法 §57·§59, 轉換準則, 勞資爭議處理法 §23, 勞動事件法 §16, 民法 §184·193·195·197, MOL 44643, laf service-assistance-des. 조문 번호는 본문에 그대로 두어도 된다.

### P1-4. 강요된 합의·귀국 장면에 解約驗證 절차 누락

- 위치: "## Bị ép ký giấy rồi về nước" 섹션. 도입부 장면 자체가 "ký rồi về nước"이다.
- 문제: 허가 기간 중 고용관계가 끝나 이주노동자가 출국하는 경우, 고용주는 출국 전에 지방 노동기관에 통지해야 한다. 기관은 노동자의 진의를 확인·검증한다. 이것이 독자가 "귀국에 동의하지 않는다, 아직 돈을 다 받지 못했다"고 공식적으로 말할 수 있는 창구인데 빠져 있다.
- 근거: 雇主聘僱外國人許可及管理辦法 §68 II(pcode N0090027, curl 원문)「雇主對聘僱之第二類外國人，於聘僱許可有效期間因聘僱關係終止出國，應於該外國人出國前通知當地主管機關，由當地主管機關探求外國人之真意，並驗證之；其驗證程序，由中央主管機關公告之。」
- 수정안(섹션 첫 문단 끝에 추가): "Nếu chủ thuê muốn chấm dứt hợp đồng để bạn về nước trước hạn, chủ thuê phải báo cơ quan lao động địa phương trước khi bạn xuất cảnh. Cơ quan này sẽ hỏi để xác nhận ý muốn thật của bạn (解約驗證), theo Điều 68 Quy định về cấp phép và quản lý việc tuyển dụng người nước ngoài (雇主聘僱外國人許可及管理辦法). Khi được hỏi, bạn có thể nói rõ mình không đồng ý về nước hoặc chưa nhận đủ tiền. Khi cần đọc giấy tờ, bạn có thể gọi 1955 để được phiên dịch qua điện thoại."
  - 전화 통역 근거: 外國人勞動權益網 1955 https://fw.wda.gov.tw/wda-employer/home/lazypg 「如果您在臺工作期間，有就醫、洽公、工作或生活上的翻譯需要，我們將提供線上即時通譯服務」.

---

## P2 (문체·다듬기·경미한 정확성)

1. **1955 서술 갱신**(l.83): 2019년 보도자료 대신 P1-3의 9번 페이지를 인용한다. 원문「24小時全年無休服務、多國語服務、免付費、線上即時文字客服」, 서비스 항목「轉介安置保護服務、線上即時通譯服務」. 外國人勞動權益網 페이지에는「提供英語、泰國語、印尼語、越南語的諮詢服務」,「職業災害…諮詢服務」,「臨時安置服務」도 있다. 대체 문장: "Đường dây 1955 của Bộ Lao động miễn phí, trực 24 giờ mỗi ngày kể cả ngày lễ, có nhân viên nói tiếng Việt, nhận tư vấn về tai nạn lao động, phiên dịch qua điện thoại và chuyển bạn đến nơi tạm trú khi cần ([Cục Phát triển lực lượng lao động](https://www.wda.gov.tw/News_Content.aspx?n=277&s=18960))."
2. **§84 요건**(l.57) "khi đóng cửa hoặc lỗ nặng đã báo cáo": 원문은 「報經主管機關核定」, 즉 승인이 필요하다. "đã được cơ quan lao động phê duyệt"으로 고친다.
3. **§59 ② 요건**(l.29) "xác nhận mất khả năng lao động": 원문 「審定為喪失原有工作能力」. "xác nhận không còn làm được công việc cũ"로 고친다.
4. **民法 §195**(l.71) "khi tình tiết nghiêm trọng": 신체·건강 침해에 대한 위자료는 이 조건 없이 적는 편이 낫다. 「情節重大」는 조문 구조상 「其他人格法益」에 걸린다. 대체: "Điều 195 cho đòi thêm tiền bù tổn thất tinh thần (慰撫金)."
5. **출퇴근 사고**(l.49): 審查準則 §4는 보험 급여 인정 기준이다. 고용주의 勞基法 §59 보상에도 똑같이 적용된다고 읽히지 않도록 "Với bảo hiểm, Điều 4 coi..."로 범위를 밝힌다.
6. **전환 기한**(l.61): 轉換準則 §11 I 단서「外國人有特殊情形經中央主管機關核准者，得延長轉換作業期間六十日，並以一次為限」가 빠졌다. 14일 기산점도 「協調會議翌日起十四日內」이다. "Nếu có lý do đặc biệt, có thể xin gia hạn thêm 60 ngày một lần"을 한 구절 넣는다. 就服法 §59와 勞基法 §59가 같은 번호라 헷갈리므로 "Điều 59 Luật Dịch vụ việc làm (khác với Điều 59 Luật Tiêu chuẩn lao động ở trên)"으로 한 번 구분한다.
7. **체류 문단 어조**(l.59) "chúng tôi chưa tìm thấy quy định công khai…nên không khẳng định": 로펌 칼럼에서 조사 공백을 드러내면 신뢰가 떨어진다. 대체: "Thẻ cư trú gắn với giấy phép lao động, và việc ở lại khi đang điều trị hay đang tranh chấp được xét theo từng trường hợp. Hãy mang giấy chẩn đoán hỏi Sở Di dân (移民署) hoặc 1955 trước khi thẻ cư trú (ARC) hết hạn." 단정은 여전히 하지 않는다.
8. **한자어 직역투 용어**(BRIEF 금지 항목):
   - "thương bệnh" → "trợ cấp nghỉ điều trị (傷病給付)"
   - "tàn tật/tiền tàn tật" → "thương tật vĩnh viễn (失能)/tiền bồi thường thương tật"
   - "niên kim" → "trợ cấp hằng tháng (年金)"
   - "cháu" → "cháu nội, cháu ngoại" (孫子女. "cháu"만 쓰면 조카와 헷갈림)
   - "người bỏ chi phí" → "người đã trả tiền"
   - "Quy tắc thẩm định thương tật, bệnh nghề nghiệp" → "Quy tắc xét duyệt tai nạn và bệnh nghề nghiệp (職業傷病審查準則)"
   - 처음 나올 때 "(dưới đây gọi tắt là luật bảo hiểm)"을 넣는다.
9. **도입부 어휘**(l.25):
   - "không cộng dồn hoàn toàn mà được trừ vào nhau" → "một phần được trừ vào nhau"
   - "tờ giấy kia có thể cắt bỏ một phần trong số đó" → "ký tờ giấy kia có thể làm bạn mất một phần trong số đó"
   - "trả lương theo mức bạn vẫn lĩnh" → "theo mức lương bạn nhận trước khi bị tai nạn"
10. **평균임금 설명**(선택): 勞基法 §2④「事由發生之當日前六個月內所得工資總額除以該期間之總日數」. "lương bình quân (平均工資) tính trên tổng tiền lương 6 tháng trước tai nạn" 한 구절이면 급여명세서를 보관할 이유가 더 분명해진다. 잔업수당 포함 여부는 이번에 공식 출처로 확인하지 않았으므로 쓰지 않는다.
11. **summary**(169자, 상한에 붙음): 끝의 "Bài nêu từng khoản, thời hạn."이 어색하다. "Bị … tử vong…, bạn và gia đình"에서 사망자를 "bạn"으로 부르는 것도 어색하다. 대체(164자): "Tai nạn lao động ở Đài Loan: bạn hoặc gia đình có thể nhận bồi thường của chủ thuê, trợ cấp bảo hiểm và bồi thường dân sự. Người chăm sóc tại nhà có quy định riêng."
    - seoTitle: VI 45자 이내 권장이고 title이 93자이므로 추가를 권한다. 예(45자): "Tai nạn lao động ở Đài Loan: đòi gì, khi nào?"
12. **분량·기타**:
    - 본문 2,203단어로 상한 2,200을 이미 넘었고, P1-1과 P1-4를 추가하면 약 +250단어가 된다.
    - 줄일 곳: 審查準則 §17 예외 나열(l.51), 職保法 §26 5종 나열, §73 문장, §62 문장, 民法 192·194 상세.
    - l.45 "đó.  Nếu"의 이중 공백을 지운다.
    - l.71 민법 문단은 조문 번호가 여섯 개 연달아 나와 공장·건설 노동자가 읽기 어렵다. "chủ thuê hoặc người gây tai nạn có lỗi → đòi thêm tiền mất khả năng lao động, chi phí sinh hoạt tăng thêm, tiền bù tổn thất tinh thần" 한 줄에 §91만 링크하는 구성을 권한다.

---

## 확인 결과 메모 (집필자 참고)

- 職保法 시행일: 2022-05-01. MOL 50670「自111年5月1日施行」으로 확인했다. dossier의 "chưa xác nhận" 항목은 해소됐다.
- 1955: fw.wda.gov.tw/wda-employer/home/lazypg가 정상 응답한다(dossier의 503은 일시적인 오류로 보임).
- 就服法 §59: 직업재해 자체는 전환 사유가 아니다. 초안의 "phụ thuộc hồ sơ"(§59 I④ 「其他不可歸責於受聘僱外國人之事由」)라는 서술은 과장이 아니므로 유지한다.
- 勞基法 §63(원사업단위가 職安法 위반 시 하도급 노동자에 대해 연대 보상): 건설 독자에게 유용하지만 선택 사항이다.
- 法律扶助 프로젝트 페이지에는 형사 고소 대리(「刑事偵查告訴代理扶助」)도 있다. 사망 사건에서 한 구절로 언급할 수 있다(선택).
- 윤리: 결과 보장·비교 우위 표현 없음. FAQ2·"Bị ép ký" 섹션은 공포 조장 없이 서명 전 확인을 권하고 있어 적절하다. 증거 보존 목록(l.79)은 구체적이고 좋다.
- 형식:
  - frontmatter 순서가 BRIEF와 일치한다(seoTitle 없음).
  - 내부 링크 slug 2개가 `src/content/columns-vi/`에 실제로 있다(003, 008).
  - CTA와 확인일 문장이 VI 020 예시와 같은 구성이다.
  - 금지 표현·em dash·굵은 글씨는 0건이다.

검증한 주장 수: 48 / 공식 출처 재확인 수: 22
- 법령·규칙 원문 curl 대조 11종(조문 약 60개): 勞基法, 職保法, 職保法施行細則, 就服法, 雇主聘僱外國人許可及管理辦法, 轉換準則, 勞資爭議處理法, 勞動事件法, 審查準則, 民法, 境外僱用非我國籍船員許可及管理辦法
- 기관 페이지 11건: BLI 0007341·0106030·0106249, MOL 50670·44643, events.bli 202204_04, WDA 1955, fw.wda 1955, LAF ×2, BLI 0106056
