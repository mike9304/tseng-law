# VI3 중간검수 r1 (Opus 5.5) · 2026-09-29

verdict: **REVISE**

- P0: 0
- P1: 9
- P2: 15
- 검증한 주장 수: 49 / 공식 출처 재확인 수: 20 (조문은 모두 Bash curl로 law.moj.gov.tw 원문을 받아 대조했다. WebFetch 요약은 쓰지 않았다.)

총평: 뼈대가 되는 법적 주장은 맞다. §31 IV(2)가 보호령과 자녀를 요구하지 않는다는 점, 1990 베트남어 상담 시간(평일 9–17시), 113(24시간, 베트남어 통역) 모두 원문과 일치한다. 문제는 크게 세 가지다. (1) "tôi không tìm thấy / chưa xác nhận"류 문장 6곳이 연구 메모처럼 읽혀서 변호사 칼럼의 신뢰를 깎는다. (2) DV 피해자에게 실제로 필요한 도구가 빠졌다. 긴급보호령을 받는 경로, 주소 비공개, 양육권 추정(家暴法 §43), 신체 폭력이 아닌 DV의 정의가 그것이다. (3) §23 인용 위치가 틀렸다. 본문은 현재 약 2,160단어로 상한(2,200)에 거의 닿아 있으므로, 아래 내용을 추가하려면 P1-9와 P2의 삭감안을 함께 적용해야 한다.

---

## P0 (사실 오류·위험)

없음.

---

## P1 (오해 소지·중요 누락·형식 위반)

### P1-1 "확인 못 했다" 문장 6곳: 변호사 칼럼 문체가 아님
- 위치:
  - FAQ3 a: "Tôi không tìm thấy hướng dẫn chính thức nói rõ về hồ sơ đang xét."
  - 본문 47행: "và tôi không tìm được danh mục chính thức của Sở Di dân"
  - 57행: "Điều tôi chưa xác nhận được là số phận hồ sơ nhập tịch đang xét … tôi không thấy hướng dẫn chính thức …"
  - 59행: "Tôi chỉ dẫn được câu chữ này, chưa thấy hướng dẫn chính thức cho từng tình huống, và không bàn về luật Việt Nam."
  - 61행: "tôi không thấy ly hôn được nêu là căn cứ hủy trong Điều 19"
  - 85행: "tôi chưa thấy hướng dẫn chính thức nói ly hôn thuận tình có đủ hay không"
- 문제: BRIEF 사실정확성 3항은 확인 못 한 내용을 "쓰지 않거나 관할 기관에 확인하라"로 처리하라고 한다. 지금 문장들은 독자에게 "필자가 조사하다 못 찾았다"로 읽혀 변호사의 권위를 깎는다. 변호사라면 "이건 X에 따라 달라지니 Y를 가져오라"고 말한다. 게다가 57행과 FAQ3는 실제로 답을 줄 수 있는 내용이다(P1-2 참조). 화자도 흔들린다. 도입부는 "chúng tôi", 본문은 "tôi"이고, 기존 VI 칼럼(019)은 1인칭을 쓰지 않는다.
- 수정안(대체 문장):
  - 47행 → "Luật không quy định danh mục giấy tờ cho trường hợp này và yêu cầu có thể khác nhau tùy hồ sơ, nên trước khi nộp hãy hỏi Trạm Phục vụ (服務站) của Sở Di dân nơi bạn sống. Những giấy tờ thường giúp chứng minh là …" (뒤는 현행 유지)
  - 57행과 FAQ3 → P1-2의 대체 문단으로 교체.
  - 59행 → "Thủ tục phía Việt Nam do cơ quan Việt Nam giải quyết; về phía Đài Loan, nếu rơi vào tình huống này thì hãy đến Sở Di dân trong thời hạn trên, đừng đợi đến khi thẻ hết hạn." (P2-6의 기산점 수정과 함께)
  - 61행 → "Nếu bạn đã được phép nhập tịch, Điều 19 Luật Quốc tịch chỉ cho hủy khi việc nhập tịch có điểm không đúng luật (chẳng hạn tòa xác định kết hôn giả), và trong thời hạn luật định; ly hôn thật sự xảy ra sau đó không phải là căn cứ hủy. Riêng giấy chứng nhận đã thôi quốc tịch cũ thì vẫn phải nộp đúng hạn một năm theo Điều 9."
    - 근거: 國籍法 §19 「歸化…後，除依第九條第一項規定應撤銷其歸化許可外，內政部知有與本法之規定不合情形之日起二年得予撤銷。但自歸化…之日起逾五年，不得撤銷。經法院確定判決認其係通謀為虛偽結婚…不受前項撤銷權行使期間之限制。」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0030001&flno=19
  - 85행 → "Luật hiện hành không còn đòi ly hôn phải bằng bản án của tòa như quy định cũ, nhưng điều kiện vẫn là bạn ly hôn *vì* bị bạo lực gia đình. Vì vậy, hãy giữ những chứng cứ độc lập như biên bản báo công an, giấy chứng nhận thương tích, hồ sơ của trung tâm phòng chống bạo lực gia đình hoặc lệnh bảo vệ nếu có, và mang bản thỏa thuận đến hỏi luật sư trước khi ký."
    - 근거(구법에 「經法院判決離婚」 요건이 있었음): 勞動部 2011-08-17 보도자료가 당시 §31 IV를 인용한다. 「四、因遭受家庭暴力經法院判決離婚，且有在臺灣地區設有戶籍之未成年親生子女。」 https://www.mol.gov.tw/1607/1632/1640/17680/ 현행 §31 IV(2)는 「因遭受家庭暴力離婚，且未再婚」이다.
  - 화자 통일: 도입부를 P1-8처럼 가정형으로 바꾸고, 본문에서 "tôi"를 빼거나 "chúng tôi"로 통일한다.

### P1-2 귀화 심사 중 이혼: "모른다"로 끝내지 말고 요건 변화를 알려야 함
- 위치: 57행 문단, FAQ3, 53행 "cùng các điều kiện khác".
- 문제: 배우자로 귀화 신청(§4 I(1))할 때는 재산·기능 자립 요건(§3 I(4))이 면제된다. 이혼 후 §4 I(2)(DV 이혼) 또는 (3)(자녀)으로 근거를 바꾸면 이 요건이 되살아난다. 독자에게 가장 실질적인 차이인데 "các điều kiện khác"에 묻혀 있다. 臺北市民政局 FAQ도 이혼한 외국인 배우자의 귀화 제출서류 첫 항목으로 이를 든다.
- 근거:
  - 國籍法 §4 I: 「…具備前條第一項第二款至第五款要件…一、為中華民國國民之配偶，不須符合前條第一項第四款。二、為中華民國國民配偶，因受家庭暴力離婚且未再婚…三、對無行為能力、或限制行為能力之中華民國國籍子女，有扶養事實…」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0030001&flno=4
  - 國籍法 §3 I(4): 「有相當之財產或專業技能，足以自立，或生活保障無虞。」
  - 臺北市民政局 FAQ(이혼한 외국인 배우자): 「二、申請歸化國籍需…檢附下列文件：(一)有相當之財產或專業技能，足以自立，或生活保障無虞之證明文件。」 https://ca.gov.taipei/News_Content.aspx?n=59F2E04A34FDA3E8&sms=87415A8B9CE81B16&s=5E6015A58EBE68B2
- 수정안(57행 대체 문단): "Nếu bạn nộp hồ sơ nhập tịch với tư cách vợ của công dân Đài Loan (điểm 1 khoản 1 Điều 4), căn cứ đó gắn với hôn nhân. Ly hôn khi hồ sơ đang xét thì căn cứ ấy không còn, và bạn chỉ có thể đi tiếp nếu thuộc điểm 2 hoặc điểm 3. Có một khác biệt ít người để ý: người đang là vợ, chồng được miễn điều kiện có tài sản hoặc kỹ năng đủ tự lập, còn người đã ly hôn thì phải chứng minh điều kiện này (điểm 4 khoản 1 Điều 3). Hãy báo cho cơ quan hộ chính nơi bạn nộp hồ sơ ngay khi có quyết định ly hôn, mang theo giấy tờ về căn cứ mới và giấy tờ về thu nhập, rồi hỏi họ cần bổ sung hay nộp lại."
- FAQ3 a 대체: "Hồ sơ nộp với tư cách vợ, chồng công dân Đài Loan dựa trên hôn nhân, nên khi ly hôn bạn cần một căn cứ khác theo Điều 4 Luật Quốc tịch, như ly hôn vì bạo lực gia đình mà chưa tái hôn, hoặc đang nuôi, thăm nom con có quốc tịch Đài Loan. Khi đó bạn còn phải chứng minh có tài sản hoặc kỹ năng đủ tự lập, điều mà người đang là vợ, chồng được miễn. Hãy báo ngay cho cơ quan hộ chính (戶政事務所) nơi bạn nộp để hỏi cần bổ sung hay nộp lại."

### P1-3 §23 제9·10款을 "남편 사망" 문단에 붙인 것은 부정확함
- 위치: 37행 "Chồng qua đời (khoản 1 …). Nếu bạn nuôi con chưa thành niên có hộ tịch Đài Loan, Điều 23 khoản 9 và 10 còn mở đường xin cư trú với lý do mới."
- 문제: (a) §23 I의 첫머리 요건은 「持停留期限在六十日以上…有效簽證入國之外國人」이다. 즉 정류(단기)비자로 입국한 사람이 거류를 신청하는 조항이다. 대만에 이미 依親 ARC로 사는 과부의 경로는 §31 IV(1)이고, 이 경우 자녀 요건도 없다. (b) 10款은 사망이 아니라 이혼한 전 배우자(「曾為…配偶，且曾在我國合法居留」)에 관한 것이다. 移民署 보도자료도 「持停留簽證入國後可申請居留」이라고 명시한다. 이 조항이 실제로 쓸모 있는 독자는 **이미 베트남으로 돌아간 엄마**다.
- 근거:
  - 移民法 §23 I 首段·(9)(10) https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=23 「九、配偶死亡時為居住臺灣地區設有戶籍國民，並對…未成年子女，有撫育事實、行使負擔權利義務或會面交往。十、曾為居住臺灣地區設有戶籍國民之配偶，且曾在我國合法居留，對…未成年子女…」
  - 移民署 2023-05-30: 「增訂外籍配偶喪偶，或曾為合法居留的外籍配偶，對我國未成年子女有撫育事實或會面交往的情形，持停留簽證入國後可申請居留的規定。」 https://www.immigration.gov.tw/5385/7229/7238/345995/cp_news
  - 시행일 2024-01-01(§23·§26·§31): law.moj 沿革 「…第…22～23-1、25、26、31～33…定自一百十三年一月一日施行」 https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=D0080132
- 수정안(37행 대체): "Chồng qua đời (điểm 1: 因依親對象死亡). Nếu bạn đang ở Đài Loan, đây là căn cứ để xin ở tiếp, và luật không đòi phải có con. Còn nếu bạn đã phải về Việt Nam nhưng vẫn nuôi hoặc thăm nom con chưa thành niên có hộ tịch Đài Loan, thì từ ngày 1/1/2024, [Điều 23](…flno=23) (điểm 9 cho người góa, điểm 10 cho người đã ly hôn từng cư trú hợp pháp) cho phép bạn nhập cảnh bằng thị thực lưu trú ngắn hạn (停留簽證) có thời hạn từ 60 ngày trở lên, rồi xin thẻ cư trú tại Sở Di dân."

### P1-4 긴급보호령은 피해자가 직접 신청할 수 없음: 경로 누락
- 위치: 67–69행("nạn nhân tự nộp đơn xin lệnh thông thường hoặc tạm thời …", "Khi nguy hiểm cận kề, Điều 16 cho phép tòa dựa vào lời trình bày trực tiếp hoặc qua điện thoại …").
- 문제: 원문상 피해자 본인은 통상·잠정 보호령만 신청할 수 있다. 긴급보호령은 검사·경찰·지방정부가 구두나 팩스로, 야간·휴일에도 신청한다. 지금 문장만 읽으면 위험한 순간에 독자가 직접 법원에 전화하면 된다고 오해할 수 있다. 위험에 처한 독자에게는 "110/113에 전화해 긴급보호령을 요청하라"가 핵심 행동이다.
- 근거:
  - 家暴法 §10: 「被害人得向法院聲請通常保護令、暫時保護令…檢察官、警察機關或直轄市、縣（市）主管機關得向法院聲請保護令。」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0050071&flno=10
  - 家暴法 §12 I: 「但被害人有受家庭暴力之急迫危險者，檢察官、警察機關或直轄市、縣（市）主管機關，得以言詞、電信傳真或其他科技設備傳送之方式聲請緊急保護令，並得於夜間或休息日為之。」
  - 家暴法 §16 IV: 「依聲請人到庭或電話陳述家庭暴力之事實…應於四小時內以書面核發緊急保護令」 (전화로 진술하는 사람은 "신청인", 즉 경찰 등)
- 수정안(67행 §10 문장 뒤에 추가): "Riêng lệnh khẩn cấp thì nạn nhân không tự nộp: công an, kiểm sát viên hoặc chính quyền địa phương (qua trung tâm phòng chống bạo lực gia đình) sẽ xin thay bạn, bằng lời nói hoặc fax, kể cả ban đêm và ngày nghỉ (Điều 10, Điều 12). Vì vậy khi đang nguy hiểm, hãy gọi 110 hoặc 113 và nói rõ bạn cần lệnh bảo vệ khẩn cấp."
  69행 앞부분 대체: "Khi bên xin lệnh trình bày trực tiếp hoặc qua điện thoại và tòa thấy bạn đang có nguy hiểm cận kề, tòa phải cấp lệnh khẩn cấp bằng văn bản trong vòng 4 giờ (Điều 16)."

### P1-5 DV 정의 누락: "맞아야만 DV"로 읽힘 (제목·FAQ2 포함)
- 위치: 제목과 도입부("bị chồng Đài Loan đánh", "đẩy chị vào tường"), FAQ2("có cần … có thương tích không?"), 보호령 섹션 전체.
- 문제: 家暴法 §2의 가정폭력에는 정신적·경제적 괴롭힘, 통제, 협박이 포함된다. 베트남 배우자에게 흔한 일은 여권·ARC를 뺏는 것, 생활비를 끊는 것, "이혼하면 추방"이라고 반복해 협박하는 것이다. 이런 피해를 겪는 독자가 "나는 맞지 않았으니 해당 없다"고 판단해 도움을 구하지 않을 수 있다. FAQ2는 질문이 "상처가 있어야 하나"인데 답이 이 핵심을 비껴간다.
- 근거: 家暴法 §2(1) 「家庭暴力：指家庭成員間實施身體、精神或經濟上之騷擾、控制、脅迫或其他不法侵害之行為。」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0050071&flno=2
- 수정안:
  - 보호령 섹션 첫 문단(65행) 뒤에 추가: "Bạo lực gia đình theo Điều 2 không chỉ là đánh đập: luật tính cả hành vi quấy rối, kiểm soát, đe dọa về tinh thần hoặc kinh tế giữa những người trong gia đình. Bị giữ hộ chiếu, thẻ cư trú, bị cắt tiền sinh hoạt hay bị dọa liên tục rằng 'ly hôn là bị đuổi về nước' là những chuyện bạn nên kể với nhân viên 113 hoặc luật sư."
  - FAQ2 a 대체: "Không cần. Vợ chồng đang chung sống hay đã ly hôn đều là thành viên gia đình theo Luật Phòng chống bạo lực gia đình, và bạo lực ở đây gồm cả quấy rối, kiểm soát, đe dọa về tinh thần hoặc kinh tế, không chỉ gây thương tích. Giấy khám thương tích, tin nhắn hay hồ sơ báo công an giúp chứng minh, nhưng tòa chỉ cấp lệnh khi nhận định có bạo lực và thấy cần thiết."
  - 근거(“và thấy cần thiết”): 家暴法 §14 I 「認有家庭暴力之事實且有必要者」

### P1-6 양육권: 家暴法 §43(가해자 양육 불리 추정) 누락, 민법 §1055-1 제6호만 제시되어 오해 소지
- 위치: 49행 "Tòa xét lợi ích tốt nhất của con theo Điều 1055-1, gồm cả việc mỗi phụ huynh có cản trở người kia thực hiện quyền của họ hay không."
- 문제: DV 피해 엄마가 가장 두려워하는 것은 "아이를 데리고 나오면 '방해'로 보여 양육권을 잃는 것 아닌가"이다. 본문은 그 불안을 키우는 제6호만 보여 주고, DV 사건에서 가장 강한 조항인 §43 추정과 §45의 안전한 면접교섭 조건은 빠져 있다. §31 IV(3)(자녀 근거 체류)로 이어지는 핵심 논점이기도 하다.
- 근거:
  - 家暴法 §43 「法院依法為未成年子女酌定或改定權利義務之行使或負擔之人時，對已發生家庭暴力者，推定由加害人行使或負擔權利義務不利於該子女。」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0050071&flno=43
  - 家暴法 §45 I 「法院依法准許家庭暴力加害人會面交往其未成年子女時，應審酌子女及被害人之安全，並得為下列一款或數款命令：一、於特定安全場所交付子女。二、由第三人或機關、團體監督會面交往…」
- 수정안(49행 1055-1 문장 뒤에 추가): "Nếu đã có bạo lực gia đình, [Điều 43 Luật Phòng chống bạo lực gia đình](…flno=43) quy định tòa suy đoán rằng giao quyền nuôi con cho người gây bạo lực là bất lợi cho con, và tòa có thể buộc người đó chỉ được thăm con ở nơi an toàn hoặc có người giám sát (Điều 45). Nếu bạn phải đưa con rời khỏi nhà vì bạo lực, hãy giữ hồ sơ cho thấy lý do để tòa xem xét cùng các quy định này."

### P1-7 DV 독자 안전: 읽기·연락 안전, 주소 비공개, 증거 보관
- 위치: "Khi đang nguy hiểm: gọi ai, giữ gì" 섹션, CTA.
- 문제: 가해자가 휴대폰을 보는 상황은 흔하다. 그런데 기사에는 안전하게 읽고 연락하는 법, 증거를 가해자 손이 닿지 않게 보관하는 법, 보호령 신청서에 거주지를 쓰지 않아도 된다는 점이 없다. CTA도 "연락 가능한 안전한 방법"을 묻지 않는다. 법 조항에 근거가 있는 안전장치다.
- 근거:
  - 家暴法 §12 II·III 「前項聲請得不記載聲請人或被害人之住居所，僅記載其送達處所。…經聲請人或被害人要求保密被害人之住居所，法院應以秘密方式訊問，將該筆錄及相關資料密封，並禁止閱覽。」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0050071&flno=12
  - 家暴法 §14 I(12) 「禁止相對人與其特定家庭成員查閱被害人及受其暫時監護之未成年子女戶籍、學籍、所得來源相關資訊。」
- 수정안:
  - 73행 섹션 첫 줄 앞에 추가: "Nếu chồng hoặc người nhà chồng có thể xem điện thoại của bạn, hãy đọc bài này và liên lạc bằng một thiết bị hay tài khoản mà họ không dùng được, rồi xóa lịch sử sau khi đọc."
  - 79행 "Hãy giữ giấy đó, ảnh chụp, tin nhắn …" 뒤에 추가: "Gửi một bản sao cho người bạn tin tưởng hoặc lưu vào tài khoản riêng mà người kia không biết."
  - 67행 또는 71행에 추가: "Đơn xin lệnh bảo vệ có thể chỉ ghi địa chỉ nhận giấy tờ thay cho nơi bạn đang ở, và bạn có thể yêu cầu tòa giữ bí mật nơi ở (Điều 12). Lệnh thông thường còn có thể cấm người kia tra cứu hộ tịch, trường học và nguồn thu nhập của bạn và của con đang do bạn tạm nuôi."
  - CTA(89행)에 추가: "… và cách liên lạc an toàn với bạn (email hoặc khung giờ mà người khác không xem được)."

### P1-8 도입부가 실제 의뢰인 연락처럼 서술됨
- 위치: 23행 "Chị nhắn cho chúng tôi lúc gần nửa đêm. … Chị hỏi: …"
- 문제: 확인할 수 없는 실제 사건을 사무소가 받은 연락처럼 제시하고 있다. 광고 윤리상 검증되지 않은 사례·경험담에 해당한다. 실제 사건이라면 아이 나이와 출생지까지 적은 것은 비밀유지 문제가 된다. 게다가 CTA에는 이메일만 있는데 "밤중에 메시지를 받았다"고 해서 연락 채널 인상도 어긋난다. 기존 VI 019는 "Giả sử …"로 가정형이다.
- 수정안(23행 대체): "Hãy hình dung: gần nửa đêm, một người vợ Việt vừa bị chồng đẩy vào tường. Anh ta nói nếu cô bỏ đi thì thẻ cư trú sẽ bị hủy và cô phải mua vé về Việt Nam ngay. Đứa con hai tuổi mang họ cha, sinh ở Đài Bắc, đã ngủ. Câu hỏi đầu tiên trong đầu cô là: “Nếu ly hôn thì mình có bị đuổi về không?”"

### P1-9 공식 링크 17개 → BRIEF 목표 5–10 (형식 위반)
- 유지 목록(10):
  1. 移民法 §31 `pcode=D0080132&flno=31`
  2. 移民署 2023-05-30 보도자료 `…/345995/cp_news`
  3. 移民法 §23 `…flno=23` (P1-3처럼 "이미 귀국한 경우" 문장을 살릴 때만. 빼면 이 자리에 家暴法 §43 사용)
  4. 國籍法 §4 `pcode=D0030001&flno=4`
  5. 臺北市民政局 FAQ `ca.gov.taipei/…5E6015A58EBE68B2`
  6. 民法 §1055 `pcode=B0000001&flno=1055`
  7. 家暴法 §14 `pcode=D0050071&flno=14` (보호령 내용. §10·§12·§16은 본문에 조번호만 적음)
  8. 113 `dep.mohw.gov.tw/DOPS/cp-1183-6499-105.html`
  9. 1990 (가능하면 베트남어 공식 페이지로 교체: https://www.immigration.gov.tw/7072/7006/142639/167507/167513/, 시간이 동일함을 확인했다)
  10. 法扶 `laf.org.tw/service-assistance-des`
- 링크 해제(조번호만 남김): 國籍法 §9, §19 / 移民法 §26 / 民法 §1055-1 / 家暴法 §3, §10, §16. P1-6에서 §43 링크를 추가하면 §1055 대신 §43을 쓰거나 3번 자리를 쓴다.
- 분량: 현재 약 2,160단어(CTA 포함)라서 P1 추가분(약 250–300단어)을 넣으려면 삭감이 필요하다. 삭감 후보:
  - 43행 §31 5·6款 문장(노동분쟁·직업재해)을 빼고 7款(형사 피해자·증인)만 남긴다. DV 형사사건과 연결되는 것은 7款이다.
  - 59행 §26 문단을 1문장으로 줄인다(P2-6).
  - 49행 §1055 설명을 1문장으로 줄인다.
  - 83행 1050 설명은 내부 링크가 있으니 반 문장으로 줄인다.

---

## P2 (문체·다듬기)

- **P2-1 項/款 용어가 사이트 관례와 반대**: 초안은 項=đoạn, 款=khoản이다("đoạn 4 … khoản 2", "Điều 23 khoản 9"). 기존 VI 칼럼은 項=khoản, 款=điểm이다(007 "khoản 2 Điều 1052", 011 "điểm 7 khoản 1 Điều 7", 022 "Theo điểm 3"). 베트남 법률 문서의 Điều–khoản–điểm 체계와도 맞다. → "điểm 2 khoản 4 Điều 31", "điểm 9, 10 khoản 1 Điều 23", "điểm 2 Điều 26", "điểm 2, 3 khoản 1 Điều 4", "khoản 5 Điều 31"(현 "đoạn 5"), "khoản 1"(현 "đoạn 1")로 전면 치환한다.
- **P2-2 구법 설명과 시행일**: 39행 "Trước đó, muốn ở lại phải có bản án ly hôn và giành được quyền nuôi con." 구법에서 DV 경로는 "법원 판결 이혼 + 호적 있는 미성년 친생자녀"였고, 양육권 취득은 별도 경로였다(勞動部 2011 보도자료의 구 §31 IV 인용: 「三、於離婚後取得…未成年親生子女監護權。四、因遭受家庭暴力經法院判決離婚，且有…未成年親生子女。」). 보도자료 날짜(2023-05-30, 입법원 3독)와 시행일(2024-01-01)도 구분해야 한다. → "Quy định mới có hiệu lực từ ngày 1/1/2024. Trước đó, người ly hôn vì bạo lực gia đình chỉ được ở lại nếu ly hôn bằng bản án của tòa và có con ruột chưa thành niên có hộ tịch Đài Loan." 참고로 NIA 시행 안내 페이지도 있다: https://www.immigration.gov.tw/5385/7229/7232/362116/ (「新制說明(113年1月1日實施部分)」)
- **P2-3 "họ hàng đến ba đời" 오역**: §10 원문은 「其法定代理人、三親等以內之血親或姻親」이다. "ba đời"는 베트남 법에서 '공동 조상 3대 이내'(사촌 포함)라는 다른 개념이다. → "người đại diện theo pháp luật, hoặc người thân ruột thịt hay bên thông gia trong phạm vi thân thuộc bậc ba (三親等)".
- **P2-4 §61 과대 서술**: "Làm trái lệnh là tội hình sự"라고 했지만 §61은 폭력 금지, 접촉·연락 금지, 퇴거, 접근 금지, 가해자 처우 등 특정 명령 위반만 처벌한다. 임대료·부양료 지급 명령은 강제집행 대상이다(§21 I(1)). → "Vi phạm các biện pháp như cấm bạo lực, cấm quấy rối, liên lạc, buộc dọn ra hay buộc tránh xa là tội hình sự, có thể bị phạt tù đến ba năm, giam ngắn hạn hoặc phạt tiền đến 100.000 Đài tệ (Điều 61)." (원문 「處三年以下有期徒刑、拘役或科或併科新臺幣十萬元以下罰金」)
- **P2-5 §14 표현**: "buộc trả một phần phí luật sư"는 원문 「命相對人負擔相當之律師費用」과 다르다 → "buộc chịu một khoản phí luật sư hợp lý". "buộc chi tiền thuê nhà hoặc tiền nuôi con" → 원문 「被害人及其未成年子女之扶養費」에 맞춰 "tiền cấp dưỡng cho bạn và con".
- **P2-6 §26 기산점과 맥락**: "trong 30 ngày kể từ hôm sự việc xảy ra"는 원문 「應於事實發生之翌日起算三十日內」과 다르다 → "trong 30 ngày, tính từ ngày hôm sau". 현행 國籍法 §9는 귀화 허가를 먼저 받고 1년 안에 원국적 상실 증명을 내는 순서라서, "원국적을 잃었는데 아직 대만 국적이 없는" 상황은 드물다. 한 문장으로 줄이고 그 점을 밝힌다: "Theo Điều 9 hiện hành, thường bạn được duyệt nhập tịch trước rồi mới nộp giấy thôi quốc tịch; nếu vì lý do nào đó bạn đã mất quốc tịch Việt Nam mà chưa được duyệt, Điều 26 buộc bạn xin cư trú trong 30 ngày, tính từ ngày hôm sau."
- **P2-7 113 베트남어 24시간은 추론임**: 113 공식 페이지에는 「24小時全年無休」와 「提供英語、越南語…等5種語言的通譯服務」가 따로 적혀 있을 뿐, 통역이 24시간이라는 명시는 없다(https://dep.mohw.gov.tw/DOPS/cp-1183-6499-105.html). 77행 "Ngoài giờ đó, 113 hợp hơn nếu bạn cần nói tiếng Việt." → "Ngoài giờ đó, 113 vẫn nghe máy 24 giờ và có dịch vụ thông dịch tiếng Việt." 1990은 베트남어 공식 페이지로 링크를 바꾸면 독자에게 더 친절하다(P1-9). 해외 번호 886-800-001990을 덧붙이는 것도 선택지다(이미 베트남에 있는 독자용).
- **P2-8 法扶 예외 누락(선택)**: 法扶 페이지와 法律扶助法 §14에 「因不可歸責於己之事由而喪失居留權」 예외가 있다. 남편 탓에 거류가 끊긴 DV 피해자에게 직접 해당한다. 또 §5 III에 따라 「申請人與其配偶長期分居者」는 배우자 재산·수입을 산정하지 않는다. → 79행 끝에 추가: "Nếu bạn mất quyền cư trú vì lý do không phải lỗi của mình, bạn vẫn có thể xin; và khi đã ly thân lâu dài, thu nhập của chồng thường không bị tính vào điều kiện tài chính của bạn." (https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=A0030157)
- **P2-9 ARC 연장에 남편이 협조하지 않을 때(선택)**: 家暴法 §4 II(7)은 「移民主管機關：設籍前之外籍…配偶因家庭暴力造成逾期停留、居留及協助其在臺居留…權益維護」을 명시한다. 31행 뒤에 "Nếu chồng không chịu đưa giấy tờ để bạn gia hạn, hãy nói rõ với Trạm Phục vụ của Sở Di dân rằng bạn đang bị bạo lực gia đình; luật giao cho cơ quan di dân trách nhiệm hỗ trợ vợ, chồng nước ngoài chưa có hộ tịch trong trường hợp này." 정도로 한 문장 넣을 만하다.
- **P2-10 베트남어 번역투·어색한 표현**:
  - summary "không mặc nhiên buộc bạn" → "không có nghĩa là bạn phải rời Đài Loan"
  - 25행 "những ngoại lệ mà chồng hoặc người nhà chồng thường chỉ kể nửa đầu" → "những ngoại lệ mà chồng hay nhà chồng thường không nói cho bạn biết"
  - 35행 "Bản văn hiện hành" → "Điều luật hiện hành"
  - 41행 "đã nuôi con trên thực tế" (撫育事實는 현재 사실) → "đang thực tế nuôi dưỡng, chăm sóc con"
  - 45행 소제목 "Giấy tờ chứng minh chuyện con" → "Giấy tờ chứng minh bạn đang nuôi hoặc thăm con"
  - 49행 "việc thực hiện và gánh vác quyền nghĩa vụ đối với con" → "quyền nuôi con (luật gọi là 行使負擔權利義務, người Đài Loan quen gọi 監護權)"
  - 53행 "con … chưa đủ năng lực hành vi" → "con dưới 18 tuổi"
  - 57행 "số phận hồ sơ" → P1-2 대체로 사라짐
  - "trạm dịch vụ (服務站)" → NIA 베트남어 사이트 표기인 "Trạm Phục vụ"
  - 67행 "cơ quan chủ quản của thành phố hay huyện" → "chính quyền thành phố, huyện (qua trung tâm phòng chống bạo lực gia đình)"
  - 전반적으로 문장은 자연스럽고, 호칭 "chị/bạn"과 "Sở Di dân", "thẻ cư trú (ARC)", "hộ chính" 등 어휘는 BRIEF와 기존 VI 칼럼에 맞는다. 대시 0개, 굵은 글씨 0개, 불릿 0개이고 요약형 결론도 없다(양호).
- **P2-11 FAQ1·summary**: FAQ1 예시에 자녀만 있고 이 글의 핵심인 DV 이혼이 빠졌다 → "ví dụ ly hôn vì bạo lực gia đình mà chưa tái hôn, hoặc đang nuôi, thăm nom con chưa thành niên có hộ tịch Đài Loan". FAQ1 끝의 "trước khi ký"는 질문(ARC 즉시 취소 여부)과 맞지 않는다 → "trước khi ly hôn". summary의 "có con có hộ tịch" 반복과, 본문 "Luật Xuất nhập cảnh và Di dân"과 summary "Luật Di dân"의 명칭 불일치도 정리한다.
- **P2-12 §4 I(2) 과부 조건 단순화**: "(hoặc góa chưa tái hôn)"의 원문은 「配偶死亡後未再婚且有事實足認與其亡故配偶之親屬仍有往來，但與其亡故配偶婚姻關係已存續二年以上者，不受與親屬仍有往來之限制」이다. → "(hoặc góa, chưa tái hôn và vẫn qua lại với gia đình chồng; nếu hôn nhân đã kéo dài từ hai năm trở lên thì không cần điều kiện qua lại này)".
- **P2-13 귀화 후 절차 단계 누락**: 55행 "rồi mới xin giấy định cư (定居證)". 臺北市 FAQ에 따르면 귀화 허가 → 「臺灣地區居留證」 → 1년 안에 상실 증명 제출 + 일정 기간 거주 → 「臺灣地區定居證」 → 호적 등록 순이다. → "sau khi được phép nhập tịch, bạn xin thẻ cư trú Đài Loan dành cho công dân chưa có hộ tịch (臺灣地區居留證), nộp giấy thôi quốc tịch trong một năm, ở đủ thời gian quy định rồi mới xin giấy định cư (定居證) và đăng ký hộ tịch."
- **P2-15 영주권(§25) 점검: 오류는 없음, 선택적 보강만**: 초안은 永久居留을 언급하지 않고, 귀화 기간은 §4의 "3년·매년 183일"만 정확히 적었다. 따라서 §25 「或」 함정(5년 경로와 배우자 10년 경로가 선택적 관계)에 해당하는 오류는 없다. 원문을 curl로 확인했다: 「外國人在我國合法連續居留五年，每年居住一百八十三日以上，或居住臺灣地區設有戶籍國民，其外國籍之配偶、子女在我國合法居留十年以上，其中有五年每年居住一百八十三日以上…」 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=D0080132&flno=25 ). 공간이 허락할 때만 넣을 만한 보강은 두 가지다. (a) §25 I 단서가 영주권 기간 산정에서 빼는 것은 「第三十一條第四項第五款至第八款」뿐이다. 따라서 사망·DV 이혼·자녀 근거(1–4款)로 계속 체류한 기간은 제외 대상이 아니다. (b) §25 끝 항은 「外國人有第二十三條第一項第九款規定情形者，得於在我國合法居留期間，向移民署申請永久居留，不適用第一項有關在我國合法居留期間之規定」이다. 즉 남편과 사별했고 호적 있는 미성년 자녀를 양육·면접하는 사람은 체류기간 요건 없이 영주권을 신청할 수 있다. 넣는다면 "기간 요건만 면제되고 나머지 요건(18세 이상·범죄기록 없음 등)은 따로 심사한다"는 점을 함께 쓰고, 결과 보장처럼 읽히지 않게 한다. 병행 레인의 외국인 배우자 체류 칼럼에는 VI판이 없으므로 링크는 불필요하다.
- **P2-14 기타**: (a) topic: 현재 `visa`이고 법리상 타당하다. 다만 019–023 배우자 시리즈는 legacy map에서 모두 `family`로 묶여 있으므로 총괄이 판단할 사항이다. (b) 85행의 순서 조언 "gom chứng cứ trước"는 "an toàn trước, rồi mới đến chứng cứ"로 바꿔 우선순위를 분명히 한다(P1-7과 연결). (c) 이혼 후 취업 가능 여부는 독자에게 실질적 관심사다. 다만 현행 근거 조문 위치를 이번 검수에서 확정하지 못했으므로(勞動部 2011 보도자료는 구법 기준) 확인 없이는 추가하지 않는다.

---

## 확인 결과 요약 (원문 대조)

| 주장 | 결과 | 원문(curl로 받음) |
|---|---|---|
| §31 IV 단서 「得准予繼續居留」, 9개 款 | 맞음 | 「但有下列各款情形之一者，得准予繼續居留：一…九、」 |
| §31 IV(2) DV 이혼, 자녀·보호령 불요 | 맞음 | 「二、外國人為居住臺灣地區設有戶籍國民之配偶，因遭受家庭暴力離婚，且未再婚。」 + NIA 「無論有無未成年子女，且無須經法院核發保護令，均不廢止居留許可」 |
| §31 IV(3)(4), V항(성년 후 계속) | 맞음 | 「依前項第三款、第四款規定准予繼續居留者，其子女已成年，得准予繼續居留。」 |
| §31 I 기간 만료 전 연장 | 맞음 | 「屆滿前…應向移民署申請延期」 |
| §23 (9)(10) | 인용 위치 부정확(P1-3) | 首段 「持停留期限在六十日以上…有效簽證入國之外國人」 |
| §26(2) 30일 | 기산점 부정확(P2-6) | 「應於事實發生之翌日起算三十日內」 |
| 시행일 | 본문에 없음(P2-2) | 沿革: §23·§26·§31 「定自一百十三年一月一日施行」 |
| 國籍法 §4 3년·183일, (2)(3) | 맞음, 단 (2) 과부 조건 단순화(P2-12), §3 I(4) 요건 누락(P1-2) | 위 인용 |
| 國籍法 §9 1년·연장·定居 불허 | 맞음 | 「一年內提出喪失原有國籍證明…得申請展延時限…應不予許可其定居」 |
| 國籍法 §19 | 결론은 맞음, 표현만 수정(P1-1) | 위 인용 |
| 民法 §1050·§1052·§1055·§1055-1(6) | 맞음 | (현행 115-08-17판) |
| 家暴法 §3(1) 전 배우자 | 맞음 | 「一、配偶或前配偶。」 |
| 家暴法 §8 센터 서비스 | 맞음 | 「一、提供二十四小時電話專線服務。二、…緊急救援、協助診療、驗傷、採證…四、…短、中、長期庇護安置」 |
| 家暴法 §9 3종 | 맞음 | 「分為通常保護令、暫時保護令及緊急保護令」 |
| 家暴法 §10 신청권자·재판비 면제 | 대체로 맞음. 三親等 번역(P2-3), 긴급령 경로(P1-4) | 위 인용 |
| 家暴法 §11 관할 | 맞음 | 「被害人之住居所地、相對人之住居所地或家庭暴力發生地之地方法院」 |
| 家暴法 §14 내용 | 대체로 맞음(P2-5) | 위 인용 |
| 家暴法 §15 2년·연장 2년 | 맞음 | 「二年以下…每次為二年以下」 |
| 家暴法 §16 4시간, 잠정·긴급 범위(8호 제외) | 맞음 | 「第十四條第一項第一款至第七款、第十二款至第十四款及第十六款」 |
| 家暴法 §26 호적 이전 | 맞음 | 「得持保護令逕向戶政機關申請未成年子女戶籍遷徙登記」 |
| 家暴法 §52 진단서 | 맞음 | 「不得無故拒絕診療及開立驗傷診斷書」 |
| 家暴法 §61 형량 | 형량은 맞음, 범위 과대(P2-4) | 위 인용 |
| 113 24시간·5개 언어 통역·문자·110 우선 | 맞음(베트남어 24시간은 미명시, P2-7) | 「24小時全年無休」「提供英語、越南語、印尼語、泰國語、日語等5種語言的通譯服務」 |
| 1990 베트남어 평일 9–17 | 맞음 | 「越南語、印尼語、泰國語、柬埔寨語：每週一至週五(不含國定例假日及其他休息日)上午9時至下午5時」 (베트남어판도 동일) |
| 法扶 외국인 원칙·자력/사안 심사 | 맞음(예외 누락, P2-8) | 「外國人：原則上需合法居住於我國境內…」 |
| 내부 링크 3개 | 모두 columns-vi에 실재 | 019·021·007 |
| summary 길이 | 155자(VI 140–170 충족) | 기준: seoTitle 없음, 019 예시와 동일 |
| frontmatter 순서·date_display·read_time·featured_image 번호(032, 중복 없음) | 적합 | 이미지 파일은 미생성(통합 단계) |
| 금지 표현·대시·굵은 글씨·불릿 | 0건 | |

재확인한 공식 출처: law.moj.gov.tw 入出國及移民法(§31·§23·§26 원문, 전문, 沿革), 家庭暴力防治法 전문, 國籍法 전문, 民法 전문, 法律扶助法 전문, 就業服務法 §48·施行細則, 移民署 보도자료 345995·362116, 移民署 1990(중·베트남어판), 衛福部 113, 法扶 자격 페이지, 臺北市民政局 FAQ, 勞動部 2011 보도자료, 臺北市勞動力重建運用處 FAQ.
