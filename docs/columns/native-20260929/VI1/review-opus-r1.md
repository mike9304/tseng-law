# VI1 중간검수 r1 (Opus 5.5) · 030-taiwan-bank-account-lending-fraud-money-laundering

verdict: REVISE

요약: P0 0 / P1 6 / P2 17. 조문 번호·형량·기간·금액은 전부 현행 원문과 일치한다(아래 검증 원장). 수정이 필요한 곳은 (1) 법적 범위를 벗어나거나 번역이 틀어진 부분(SIM, 拘役="tạm giam", 犯罪紀錄="tiền án, tiền sự"), (2) 독자에게 가장 중요한 체류 영향에 대해 공식 근거(移民法 §32(3))가 있는데 "근거 없음"이라고 쓴 부분, (3) 車手 시나리오 혼입, (4) 告誡 불복(訴願) 안내다.

검증 방법: law.moj.gov.tw 현행 조문을 `curl` 원문 그대로 받아 대조했다(WebFetch 요약은 쓰지 않음). 법규 DB 정리 기준일은 民國115年09月18日이다. 洗錢防制法 최종 개정은 113-07-31, 存款帳戶及其疑似不法或顯屬異常交易管理辦法은 115-08-31 개정, 22條6項 辦法은 114-05-01 개정, 詐欺犯罪危害防制條例는 115-01-21 개정이며 모두 현행 조문으로 확인했다.

---

## P0 (사실 오류·위험)

없음.

---

## P1 (오해 소지·중요 누락)

### P1-1. SIM을 계좌와 같은 제재 대상으로 묶음 (summary·도입·CTA)
- 위치: summary "Cho người khác mượn, thuê hoặc bán tài khoản ngân hàng, thẻ ATM, SIM ở Đài Loan có thể bị cảnh sát cảnh cáo, truy cứu hình sự…". 도입부의 "…hoặc số SIM cho một người quen", CTA의 "(tài khoản, thẻ ATM, SIM)".
- 문제: 洗錢防制法 §22는 **금융기관 계좌, 가상자산 계정, 제3자지급 계정만** 대상으로 한다. SIM(門號) 제공은 §22 告誡나 §22(3) 형사처벌 대상이 아니다. summary는 SIM에도 "경찰 경고"가 적용되는 것처럼 읽히는데, 본문에는 SIM의 법적 근거가 한 줄도 없다.
- 근거:
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=22 「任何人不得將自己或他人向金融機構申請開立之帳戶、向提供虛擬資產服務或第三方支付服務之事業或人員申請之帳號交付、提供予他人使用。」
  - SIM 관련 현행 규정은 詐欺犯罪危害防制條例(https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=D0080226)에 있다. 第16條 「用戶轉讓電信服務予他人，應向電信事業重新辦理…核對及登錄…用戶未依前項規定…電信事業應限制或停止提供其相關電信服務。」 第18條 「電信事業經…司法警察機關通知用戶或使用電信人使用電信服務從事詐欺犯罪者，應限制或停止提供該項電信服務。」 第23條 「…受限制或停止通知之日起三年內限制其至多申請一門用戶號碼…」
- 수정안(A안, 권장·분량 절약): summary·CTA에서 SIM을 빼고, 도입부에서도 "số SIM"을 삭제한다. summary 대체안(167자, VI 140–170 충족):
  > "Cho mượn, cho thuê hoặc bán tài khoản ngân hàng, thẻ ATM ở Đài Loan có thể bị cảnh cáo, truy cứu hình sự và phong tỏa tài khoản. Nhận giấy mời của cảnh sát thì làm gì?"
- 수정안(B안, SIM을 남길 경우): §22 단락 뒤에 다음 한 단락을 넣는다.
  > "Số điện thoại (SIM) không thuộc Điều 22. Nhưng theo Điều 16 và Điều 18 Điều lệ phòng chống tội phạm lừa đảo (詐欺犯罪危害防制條例), SIM chuyển cho người khác dùng mà không đăng ký lại, hoặc bị dùng để lừa đảo, sẽ bị nhà mạng hạn chế hoặc cắt dịch vụ. Theo Điều 23, trong 3 năm sau đó bạn chỉ được đăng ký tối đa một số tại nhà mạng đó. Nếu cơ quan điều tra cho rằng bạn biết số điện thoại sẽ bị dùng để lừa đảo, bạn vẫn có thể bị xem xét tội giúp sức lừa đảo."

### P1-2. 拘役를 "tạm giam"으로 오역
- 위치: "Tầng thứ hai là hình sự: tù đến 3 năm, tạm giam (拘役), hoặc phạt tiền…"
- 문제: 베트남어 "tạm giam"은 수사 중 구금, 즉 羈押에 해당한다. 拘役는 판결로 선고되는 **단기 자유형**(1일 이상 60일 미만)이다. 독자가 "수사 중 바로 구금된다"고 오해할 수 있어 공포를 키우고 사실도 틀린다.
- 근거: 刑法 §33 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0000001&flno=33 「四、拘役：一日以上，六十日未滿。但遇有加重時，得加至一百二十日。」
- 수정안:
  > "…tù đến 3 năm, phạt giam ngắn ngày (拘役, dưới 60 ngày), hoặc phạt tiền đến 1 triệu Đài tệ, hoặc vừa tù/giam vừa phạt tiền…"

### P1-3. 犯罪紀錄를 "tiền án, tiền sự"로 번역 (移民法 §18)
- 위치: "…cấm người nước ngoài nhập cảnh nếu có tiền án, tiền sự ở Đài Loan hoặc nước ngoài (khoản 7)…"
- 문제: 베트남 법률 용어로 "tiền sự"는 **행정처벌 전력**을 뜻한다. 그래서 이 번역은 告誡(행정처분)도 입국금지 사유에 들어간다고 읽힌다. 바로 다음 문장이 "告誡가 여기에 해당하는지 확인하지 못했다"고 말하므로 서로 모순되고, 불필요한 불안도 키운다.
- 근거: https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=18 「移民署得禁止其入國：…七、在我國或外國有犯罪紀錄。…十三、有危害我國利益、公共安全或公共秩序之虞。」
- 수정안:
  > "…nếu có hồ sơ phạm tội (犯罪紀錄) ở Đài Loan hoặc nước ngoài (điểm 7 khoản 1 Điều 18), hoặc có nguy cơ gây hại cho lợi ích, an ninh, trật tự công cộng của Đài Loan (điểm 13). Đây là quyền cân nhắc của Sở Di dân, không phải tự động cấm."

  뒤 문장은 1인칭 표현을 빼고 다음처럼 바꾼다.
  > "Luật không nói rõ một quyết định cảnh cáo hành chính (告誡) có được tính là 'hồ sơ phạm tội' hay không; cảnh cáo là xử phạt hành chính, không phải bản án hình sự, nhưng cách Sở Di dân áp dụng cần được hỏi theo từng hồ sơ."

  告誡가 행정벌이라는 근거는 行政罰法 §2 제4호다(P1-6 참조).

### P1-4. 체류증(ARC)·취업허가 영향에 대해 "근거 없음"이라고 썼지만 공식 근거가 있음
- 위치: "Cảnh cáo hay bản án ảnh hưởng thế nào đến gia hạn thẻ cư trú (ARC), giấy phép làm việc hoặc thị thực sinh viên, tôi chưa có căn cứ để khẳng định."
- 문제: 형사판결에 대해서는 명확한 조문이 있다. 移民法 §32 제3호는 **1년 이상 유기징역이 확정되면** 거류허가를 취소·폐지하고 ARC를 말소한다(과실범·집행유예 제외). §36(2)(8)은 이어서 강제퇴거 또는 10일 내 출국명령을 규정한다. 노동자의 경우 就業服務法 §73 제6호가 "그 밖의 법령 위반, 情節重大"를 聘僱許可 폐지 사유로 둔다. 이 조문은 독자에게 가장 절박한 질문(ARC가 없어지는가)에 대한 답이다. 동시에 "집행유예면 제외, 1년 미만이면 해당 없음"이라는 **안심 정보**이기도 해서 공포 조장과도 거리가 멀다. 기준이 이렇게 있는데 "근거 없음"이라고 쓰는 것은 중요 누락이다.
- 근거:
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=32 「移民署對有下列情形之一者，撤銷或廢止其居留許可，並註銷其外僑居留證：…三、經判處一年有期徒刑以上之刑確定。但因過失犯罪或經宣告緩刑者，不在此限。」
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=36 「…八、有第三十二條第一款至第三款規定情形，經撤銷或廢止居留許可，並註銷外僑居留證。」
  - https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=N0090001&flno=73 「雇主聘僱之外國人，有下列情事之一者，廢止其聘僱許可：…六、違反其他中華民國法令，情節重大。」
- 수정안(해당 문장 교체):
  > "Về thẻ cư trú, Điều 32 Luật Xuất nhập cảnh và di dân quy định Sở Di dân thu hồi giấy phép cư trú và hủy thẻ ARC khi người nước ngoài bị kết án tù từ 1 năm trở lên và bản án đã có hiệu lực; tội vô ý hoặc được hưởng án treo (緩刑) thì không thuộc trường hợp này. Với lao động, Điều 73 Luật Dịch vụ việc làm (就業服務法) cho phép thu hồi giấy phép tuyển dụng nếu vi phạm pháp luật Đài Loan ở mức nghiêm trọng (情節重大). Một quyết định cảnh cáo hành chính có bị xem là 'nghiêm trọng' hay không thì chưa có hướng dẫn chính thức, nên hãy hỏi luật sư trước khi gia hạn ARC, đổi chủ hay xuất cảnh."

  §32 링크를 추가하면 §36 링크는 빼는 편이 낫다(링크 수 조정, 아래 P2-17 참조).

### P1-5. "rút tiền hộ"(車手) 시나리오가 §22 2단 구조 설명에 섞여 있음
- 위치: 도입부 "…hay cho một công việc làm thêm 'rút tiền hộ'."
- 문제: 카드만 넘긴 사람(§22 대상)과 **직접 인출·송금을 해 준 사람(車手)** 은 법적 위치가 전혀 다르다. 車手는 피해금을 직접 옮기므로 사기(§339-4 三人以上共同)와 세탁(洗錢防制法 §19·§2)의 공동정범으로 검토될 수 있다. 이런 독자가 본문의 "1계좌·무보수면 경고 단계"라는 설명을 자기 얘기로 읽으면 위험을 과소평가하게 된다. 같은 이유로 "계좌에 모르는 돈이 들어오면 손대지 말라"는 기본 경고도 빠져 있다.
- 근거: 洗錢防制法 §2 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=G0380131&flno=2 「一、隱匿特定犯罪所得或掩飾其來源。二、妨礙或危害國家對於特定犯罪所得之調查、發現、保全、沒收或追徵。」; 刑法 §339-4 「二、三人以上共同犯之。」
- 수정안: 도입부의 "hay cho một công việc làm thêm 'rút tiền hộ'"를 "hay cho một 'công việc làm thêm' trên mạng hứa trả hoa hồng"으로 바꾼다. 그리고 "Lần đầu bị phát hiện thì xử lý thế nào" 절 끝에 다음을 추가한다.
  > "Nếu bạn không chỉ đưa thẻ mà còn tự đi rút tiền hoặc chuyển tiền theo chỉ đạo của người khác, đó không còn là chuyện 'cho mượn tài khoản' nữa: bạn có thể bị xem xét là người cùng thực hiện tội lừa đảo và rửa tiền, với mức phạt nặng hơn nhiều so với Điều 22. Nếu thấy tiền lạ chuyển vào tài khoản, đừng rút hay chuyển đi theo lời ai; hãy báo ngân hàng và cảnh sát."

### P1-6. 告誡 불복(訴願) 안내가 조건문으로만 되어 있고, 불복할 수 있다는 사실도 명시되지 않음
- 위치: "Nếu quyết định ghi thời hạn khiếu nại, hãy ghi ngày nhận: Điều 14 Luật Khiếu nại hành chính (訴願法) quy định 30 ngày kể từ ngày sau khi quyết định đến tay."
- 문제:
  (a) 30일은 처분서에 적혀 있든 없든 적용되는 법정기간이다. 조건문으로 쓰면 "적혀 있지 않으면 기한이 없다"고 읽힐 수 있다.
  (b) dossier는 "告誡가 행정처분이라는 것은 추론"이라고 했지만, 行政罰法 §2 제4호가 告誡를 **행정벌(警告性處分)로 명시**한다. 그래서 불복 가능성의 근거는 추론보다 강하다. 다만 결과를 보장하면 안 되므로 "thông thường"으로 여지를 둔다.
  (c) 訴願을 내도 5년 은행 제한 같은 처분의 집행은 멈추지 않는다(訴願法 §93). 독자가 "訴願했으니 카드가 풀리겠지"라고 오해하지 않도록 한 줄이 필요하다.
  (d) 訴願書는 원처분기관을 경유해 낸다(§58).
- 근거:
  - 行政罰法 §2 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030210&flno=2 「本法所稱其他種類行政罰，指下列裁罰性之不利處分：…四、警告性處分：警告、告誡、記點、記次、講習、輔導教育或其他相類似之處分。」
  - 訴願法 §14 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=A0030020&flno=14 「訴願之提起，應自行政處分達到或公告期滿之次日起三十日內為之。」
  - 訴願法 §58 「訴願人應繕具訴願書經由原行政處分機關向訴願管轄機關提起訴願。」 / §93 「原行政處分之執行，除法律另有規定外，不因提起訴願而停止。」
  - (참고) 行政程序法 §98 제3항: 救濟期間을 고지하지 않은 경우 送達 후 1년 내 불복은 기간 내로 본다. 본문에 쓸 필요는 없다.
- 수정안(해당 문장 교체, 안전 문구):
  > "Cảnh cáo (告誡) là một hình thức xử phạt hành chính: Điều 2 Luật Xử phạt hành chính (行政罰法) xếp '告誡' vào nhóm xử phạt mang tính cảnh cáo. Vì vậy, nếu không đồng ý, thông thường bạn có thể nộp đơn khiếu nại hành chính (訴願) trong 30 ngày, tính từ ngày hôm sau ngày nhận quyết định (Điều 14 訴願法), nộp qua chính cơ quan cảnh sát đã ra quyết định. Hãy ghi lại ngày nhận, giữ phong bì và đọc phần hướng dẫn khiếu nại in trên quyết định. Trong thời gian khiếu nại, các hạn chế ngân hàng vẫn áp dụng (Điều 93 訴願法)."

---

## P2 (문체·다듬기·보강)

P2-1. **seoTitle·title**: seoTitle "Cho mượn tài khoản ngân hàng Đài Loan bị khóa"는 45자(NFC)로 VI 상한은 지킨다. 하지만 "Đài Loan bị khóa"가 붙어 있어 "잠긴 대만 계좌를 빌려준다"로도 읽힌다. title은 106자로 기존 VI 칼럼(66–89자)보다 길다. 대체안:
- title "Cho mượn tài khoản ngân hàng ở Đài Loan: bị phong tỏa, cảnh sát gọi lên thì làm gì" (82자)
- seoTitle "Cho mượn tài khoản ở Đài Loan bị phong tỏa" (42자, title과 다름)

"bị khóa cảnh báo"는 번역투다. "bị phong tỏa / bị đóng băng"을 기본으로 쓰고, "tài khoản cảnh báo (警示帳戶)"는 처음 나올 때 한 번만 병기한다. title을 바꾸면 H1도 같이 바꾼다.

P2-2. **중국어 병기 순서**: 도입부 `"警示" (cảnh báo)`, `giấy 通知書 (thông báo)`, `"詢問" (hỏi)`는 중국어를 앞에 두었다. BRIEF 형식은 "베트남어 (中文)"이다. 대체안: "tài khoản đã bị đưa vào diện cảnh báo (警示)", "đồn cảnh sát gửi giấy mời/giấy triệu tập (通知書) gọi bạn đến lấy lời khai (詢問)". 베트남 독자에게 경찰 소환장은 "giấy mời"나 "giấy triệu tập"이 자연스럽다.

P2-3. **메타 문장·일반화**: "Tình huống này gặp nhiều ở lao động, du học sinh và người kết hôn sang Đài Loan"은 통계 근거가 없고 특정 집단을 지목하는 느낌을 준다. "Bài này nói luật Đài Loan quy định gì… Đây không phải cách để né trách nhiệm."은 BRIEF가 금지한 "In this article"류 서두다. 대체안:
> "Chuyện này có thể xảy ra với bất kỳ ai, từ lao động, du học sinh đến người đã lập gia đình ở Đài Loan. Dưới đây là những gì luật quy định, những việc có thể xảy ra tiếp theo và quyền của bạn khi làm việc với cảnh sát."

P2-4. **1인칭 "tôi chưa tìm được / tôi chưa xác nhận được" (3곳) 제거**: 로펌 칼럼에서 "공식 페이지에서 확인 못 했다"는 조사자 메모처럼 읽혀 신뢰를 떨어뜨린다. 기존 VI 칼럼에는 1인칭이 없다. 移民法 부분은 P1-3·P1-4로 해결된다. 法扶 부분은 확인된 사실로 교체한다. 法扶의 「檢警第一次偵訊律師陪同到場」(검경 조사 무료 동행) 사업은 일반인의 경우 **最輕本刑 3년 이상** 중죄에만 해당한다. 원주민과 심신장애로 완전한 진술이 어려운 사람은 예외다.
- 근거: https://www.laf.org.tw/service-project-detail/19 「要件一 涉犯最輕本刑三年以上有期徒刑之重罪或高等法院管轄第一審之案件」, 전화 (02)2559-2119.
- 대체안:
> "Dịch vụ luật sư miễn phí đi cùng khi bị lấy lời khai lần đầu của Quỹ (檢警專案) chỉ dành cho tội có mức phạt tù tối thiểu từ 3 năm trở lên, người bản địa hoặc người khuyết tật không thể tự trình bày đầy đủ, nên vụ cho mượn tài khoản thông thường ít khi thuộc diện này. Bạn vẫn có thể hỏi chi nhánh Quỹ về trợ giúp pháp lý thông thường."

P2-5. **22條6項 辦法 명칭·한도 정밀화**:
(a) 정식 명칭을 한 번 병기해서 독자가 은행에 보여 줄 수 있게 한다: 「洗錢防制法第二十二條第六項帳戶帳號暫停限制功能或逕予關閉管理辦法」.
(b) "chuyển khoản, rút tối đa tương đương 10.000 Đài tệ mỗi ngày"는 합산 한도처럼 읽힌다. 원문은 **이체·인출 각각** 1만이고, 체크카드 결제는 이 한도에 합산된다(第6條 「每日轉帳…、提領金額上限各為等值新臺幣一萬元整；晶片金融卡消費扣款…與前述額度併計」).
(c) 창구 거래는 가능하되 증빙을 요구받을 수 있다는 점(第6條第1項第3款)이 빠져 있다. 급여를 찾아야 하는 노동자에게 가장 실용적인 정보다.
(d) "Vi phạm lại trong thời gian này thì 5 năm được tính lại"는 "재위반일부터 다시 5년"으로 오해될 수 있다. 원문은 **기존 5년이 끝난 다음 날부터 5년을 추가**하는 것이다(第4條 「期間自前項期間屆滿日之翌日起，重新起算五年」).

대체안:
> "Trong 5 năm đó, mỗi thẻ ATM chỉ được chuyển tối đa 10.000 Đài tệ và rút tối đa 10.000 Đài tệ mỗi ngày (tính riêng; tiền quẹt thẻ mua hàng tính chung vào hạn mức), không dùng được ngân hàng trực tuyến, ngân hàng qua điện thoại hay liên kết ví điện tử. Bạn vẫn có thể rút hoặc chuyển tiền tại quầy, nhưng ngân hàng có thể yêu cầu giấy tờ chứng minh giao dịch hợp lý. Nếu vi phạm lại trong thời gian này, sau khi hết 5 năm đầu sẽ bị tính thêm 5 năm nữa."

P2-6. **衍生管制帳戶**:
(a) "có thể thành"을 "là"로 바꾼다. 第3條 정의상 警示 계좌 명의인의 다른 예금계좌는 모두 衍生管制帳戶다.
(b) "quản chế phái sinh"는 직역투다. "tài khoản bị kiểm soát liên đới (衍生管制帳戶)"가 낫다.
(c) 해제 경로가 빠져 있다. 은행이 이상 사정이 해소됐다고 확인하면 즉시 해제한다(第10條第2項 「經銀行查證該等疑似不法或顯屬異常情形消滅時，應即解除相關限制措施」).
(d) 警示가 풀리지 않은 동안에도 **급여이체용 계좌는 재직증명을 내면 개설할 수 있다**(第13條第2項第5款但書(一) 「為就業薪資轉帳開立帳戶需要，經當事人提出在職證明…」). 이 계좌도 衍生管制 대상이라 창구 위주로 써야 한다.
(e) "Thắc mắc… hỏi cơ quan đã thông báo, không phải ngân hàng"은 과장이다. 第9條第2項은 「銀行於必要時並應提供協助」라고 한다. 대체안: "Ngân hàng không tự gỡ cảnh báo được, nhưng có thể cho bạn biết đơn vị nào đã thông báo (原通報機關); hãy hỏi tên đơn vị và số công văn."

P2-7. **§22 세부**:
(a) "đã hẹn hoặc đã nhận tiền"을 "đã thỏa thuận sẽ được trả tiền hoặc đã nhận tiền, hoa hồng (期約或收受對價)"으로 바꾼다.
(b) "cũng chỉ bị cảnh cáo tiếp" 뒤에 "(nếu không rơi vào các trường hợp hình sự dưới đây)"를 붙인다.
(c) 第4項을 추가한다. 1·2호로 형사처벌을 받는 경우에도 告誡가 함께 내려지고, 그 결과 5년 은행 제한이 붙는다: "Trường hợp một hoặc hai, ngoài án hình sự bạn vẫn bị cảnh cáo, nên các hạn chế ngân hàng 5 năm vẫn áp dụng."
(d) "Người cho mượn một tài khoản, không nhận tiền…"을 "…không nhận và không thỏa thuận nhận tiền…"으로 바꾼다.

P2-8. **§22 적용범위 표현**: "tài khoản ví ảo"는 전자지갑과 혼동된다. "tài khoản trên sàn tài sản ảo, tiền mã hóa (虛擬資產)"로 바꾼다. 이주노동자가 많이 쓰는 우체국 계좌도 포함된다는 점을 한 번 밝힌다: "kể cả tài khoản bưu điện (郵局)". 22條6項 辦法 第2條 「於辦理儲金匯兌業務之郵政機構開立之存簿儲金…」이 근거다.

P2-9. **洗錢防制法 §19 併科**: "từ 6 tháng đến 5 năm tù, phạt tiền đến 50 triệu"에서 원문 「併科」는 징역과 벌금을 **함께** 부과한다는 뜻이다. "tù từ 6 tháng đến 5 năm và phạt thêm tiền đến 50 triệu Đài tệ"로 바꾼다.

P2-10. **형법 용어 직역투**:
- "chính phạm"은 "người trực tiếp phạm tội"로 바꾼다.
- "dùng internet lừa công chúng"은 "đăng tin lừa đảo trên internet, mạng xã hội tới nhiều người"로 바꾼다.
- "hỏi cung"(FAQ3 등)은 베트남에서 피의자 신문(bị can)의 어감이 강하다. 경찰 조사에는 "lấy lời khai (詢問)"가 자연스럽고 덜 위협적이다.

P2-11. **민사 단락**:
(a) "đòi cả số tiền từ bất kỳ ai trong nhóm"은 범위가 불분명하다. "đòi bạn bồi thường số tiền họ bị lừa chuyển qua tài khoản của bạn, không cần đòi những người khác trước"로 좁힌다.
(b) "Đừng tự liên hệ nạn nhân hoặc chuyển tiền cho ai trước khi hỏi luật sư"는 "피해자에게 돈을 돌려주지 말라"로 오독될 수 있다. 화해·배상은 정당한 행동이고, 刑法 §57 제10호 「犯罪後之態度」도 양형 사유다. 긍정형으로 바꾸고 사칭 사기 경고를 붙인다:
> "Hòa giải và bồi thường cho nạn nhân là việc chính đáng, nhưng hãy làm qua luật sư hoặc tại viện kiểm sát, tòa án để thỏa thuận được ghi nhận đúng. Cẩn thận với người tự xưng là cảnh sát, kiểm sát viên hay 'nạn nhân' gọi điện yêu cầu chuyển tiền vào 'tài khoản an toàn'; cơ quan nhà nước không làm như vậy."
마지막 문장이 부담스러우면 빼도 된다.

P2-12. **刑法 §95 보강(안심 정보)**: "Tòa cân nhắc từng vụ…" 뒤에 "Nếu chỉ bị phạt tiền hoặc phạt giam ngắn ngày (拘役), Điều 95 không áp dụng."을 추가한다. 조문 「受有期徒刑以上刑之宣告者」가 근거다.

P2-13. **조항 번호 표기**: 대만 條/項/款은 베트남어로 Điều/khoản/điểm이다. 본문은 "khoản 6 Điều 22"(=第6項, 맞음)과 "Điều 18 (khoản 7)"(=第1項第7款, 틀림)을 섞어 썼다. "điểm 7 khoản 1 Điều 18"로 통일하거나 중국어 원번호를 병기한다.

P2-14. **아직 동결 전이거나 속은 걸 막 알았을 때의 즉시 행동**: 제목의 "làm gì"에 해당하는 가장 실용적인 단계가 빠져 있다. "Khi có thông báo của cảnh sát" 절 앞부분이나 165 문장을 대체해서 넣는다:
> "Nếu bạn vừa nhận ra mình đã đưa thẻ cho người lạ: gọi ngân hàng báo khóa thẻ (掛失), đổi mật khẩu ngân hàng điện tử, rồi đến đồn cảnh sát trình báo (報案) việc bạn bị lừa lấy thẻ, mang theo tin nhắn. Có thể gọi 165 để được hướng dẫn."
증거 인멸·도주와는 반대 방향의 조언이라 윤리 기준에도 맞는다.

P2-15. **(선택) 조사 절차 권리 보강**: 刑訴 §41 조서 낭독·열람과 정정 청구권 「前項筆錄應向受訊問人朗讀或令其閱覽…請求將記載增、刪、變更者，應將其陳述附記於筆錄」이 있다. "đừng ký khi chưa hiểu" 뒤에 "Bạn có quyền yêu cầu đọc lại biên bản và yêu cầu sửa, bổ sung trước khi ký (Điều 41)."을 넣을 수 있다. 洗錢防制法 §23(3) 自白 감경은 전략 조언처럼 보일 수 있으므로 넣지 않는 것을 권한다.

P2-16. **FAQ2**: 警示 기간만 답하고 끝난다. 告誡를 받은 경우 별도의 5년 제한이 있다는 한 문장을 추가한다: "Nếu bạn còn bị cảnh cáo theo Điều 22, các hạn chế ngân hàng khác kéo dài 5 năm kể từ ngày cảnh cáo." (답변 3문장 유지)

P2-17. **링크 14개를 10개로 줄이는 keep-list**
- 유지 (10):
  1. 洗錢防制法 §22
  2. 刑法 §30
  3. 存款帳戶管理辦法 (LawAll G0380199 그대로 또는 flno=9)
  4. 22條6項 辦法 (I0030062)
  5. 刑事局 警示 해제 FAQ
  6. 刑法 §95
  7. 移民法 §18
  8. 移民法 §32 (신규, P1-4)
  9. 刑訴 §95
  10. 法扶 (P2-4를 반영하면 `service-project-detail/19` 또는 현 `service-assistance-des` 중 하나)
- 링크 제거·본문 인용만 남김 (5): 洗錢防制法 §19, 刑法 §339-4, 民法 §184, 移民法 §36, NPA 165 FAQ. 165는 번호만 본문에 남긴다.

P2-18. **분량**: 본문이 현재 2,195단어로 VI 상한 2,200에 붙어 있다. P1-1(B안)·P1-4·P1-5·P1-6을 반영하면 약 150–200단어가 늘어난다. 다음을 줄여서 상한 안으로 맞춘다: 도입 메타 두 문장(P2-3), 刑法 §13 단락 압축, 민사 단락의 §197 문장, 165 문장(P2-14로 대체), 法扶 문단(P2-4로 대체). summary의 "thậm chí trục xuất"는 P1-1 대체안에서 빠진다.

---

## 형식 점검
- frontmatter 순서가 BRIEF와 일치한다. 기존 VI 칼럼에는 `topic`이 없지만 `src/lib/column-topics.ts`가 `topic` 필드와 `litigation` 값을 지원하므로 문제없다.
- published/lastmod "2026-09-29", date_display "29 tháng 9 năm 2026", read_time "9 phút đọc", category 모두 OK.
- featured_image 030은 이번 배치(024–032) 안에서 중복되지 않는다.
- summary 163자 OK(대체안 167자). seoTitle 45자 OK(대체안 42자). FAQ 3개, 본문과 모순 없음.
- CTA 구성(사무소명, 알려줄 정보, 언어 선택, 이메일, 주소, 광고책임 변호사, 확인일)이 020 예시와 일치한다. 전화번호 없음. 특정 언어 상담 약속 없음.
- 금지표현 grep: "—" 0, "**" 0.
- 내부링크 없음. VI 로케일에 관련 slug가 없어 타당하다.
- 윤리: 증거 보존("Không xóa tin nhắn"), 공모 금지("không bàn bạc thống nhất lời khai"), 소환 불응 금지("Đừng phớt lờ"), 무단 출국 경고("tự bỏ đi không làm hồ sơ hình sự biến mất")로 권리·경고 톤이 잘 잡혀 있다. 은닉·인멸·도주를 돕는 조언은 없다. 재검토가 필요한 문장은 P2-11(b) 하나다.

## 검증 원장 (curl 원문 대조, 전부 일치 = ✓)
- 洗錢防制法 §22 제1–4·6항 ✓, §19 ✓, §2 ✓, §23 ✓(미사용)
- 刑法 §13 ✓, §30 ✓, §33 ✓(拘役 정의), §57 ✓, §95 ✓, §339 ✓, §339-4 ✓
- 存款帳戶及其疑似不法或顯屬異常交易管理辦法(115-08-31) §3·§5·§9 ✓, §10·§13 ✓(보강 근거)
- 22條6項 辦法(114-05-01) §2 ✓, §4 ✓(재기산 방식 정밀화 필요), §6 ✓(각각 한도, 창구 가능)
- 民法 §184 ✓, §185 ✓, §197 ✓
- 詐欺犯罪危害防制條例 §11 ✓, §16·§18·§23 ✓(SIM)
- 入出國及移民法 §18(7)(13) ✓, §32(3) ✓(누락), §36 ✓
- 就業服務法 §73(6) ✓(누락)
- 刑事訴訟法 §27 ✓, §41 ✓, §71-1 ✓, §95 ✓, §99 ✓, §100-2 ✓, §245 ✓
- 行政罰法 §2(4) ✓, §42 ✓
- 訴願法 §4 ✓, §14 ✓, §58 ✓, §93 ✓
- 行政程序法 §98 ✓
- 刑事局 警示 해제 FAQ ✓(200, 내용 일치)
- NPA 165 FAQ ✓(200)
- 法扶 扶助資格 ✓, 檢警專案 ✓(最輕本刑 3년 요건)

검증한 draft 주장 수: 41 / 공식 출처 재확인 수: 46 (law.moj.gov.tw 조문 42 + 기관 페이지 4)
