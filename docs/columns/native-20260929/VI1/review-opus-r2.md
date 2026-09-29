# VI1 중간검수 r2 (Opus 5.5) · 030-taiwan-bank-account-lending-fraud-money-laundering

verdict: REVISE (P1 한 건, 한 문장만 고치면 된다)

요약: P0 0 / P1 1 / P2 8
- r1의 P1 6건은 전부 제대로 반영됐다.
- 새로 들어간 조문 문구는 모두 curl로 받은 원문과 일치한다.
- 새 P1은 퇴행 1건이다. 법률구조재단(法扶)의 일반 법률구조 안내가 빠져 "法扶는 거의 해당 없다"로만 읽힌다. BRIEF 윤리 조항("무료 공공 지원은 숨기지 말고 알려 준다") 위반이다.
- 아래 P1-1 문장을 넣고 분량만 맞추면 추가 라운드 없이 PASS 처리해도 된다. 확인은 grep로 충분하다.
- 형식: title 82자, seoTitle 42자, summary 167자, 본문 2,194단어, 공식 링크 10개. 금지 표현 0건("—", "**" 없음). SIM, "tạm giam", "tiền án/tiền sự", 조사자 1인칭은 모두 0건이다. 남은 "tôi"는 인용문과 FAQ 질문 속 독자 목소리뿐이다.

---

## r1 P1 반영 확인

| r1 항목 | 현재 문구 | 판정 |
|---|---|---|
| P1-1 SIM | summary·도입·CTA에서 SIM 삭제. CTA는 "(tài khoản, thẻ ATM, mật khẩu ngân hàng điện tử)" | ✓ |
| P1-2 拘役 | "phạt giam ngắn ngày (拘役, dưới 60 ngày)" | ✓ 刑法 §33 「拘役：一日以上，六十日未滿。但遇有加重時，得加至一百二十日。」 기본 범위와 일치. 가중 시 120일은 이 글에 필요 없다 |
| P1-3 犯罪紀錄 | "hồ sơ phạm tội (犯罪紀錄)… (điểm 7 khoản 1)… Đây là quyền cân nhắc, không tự động cấm… cảnh cáo không phải bản án hình sự" | ✓ 移民法 §18 「移民署得禁止其入國：…七、在我國或外國有犯罪紀錄」 |
| P1-4 §32(3)/§73(6) | §32 링크 추가. "kết án tù từ 1 năm trở lên và bản án đã có hiệu lực; tội vô ý hoặc được hưởng án treo (緩刑) thì không thuộc…". §73 "vi phạm pháp luật Đài Loan ở mức nghiêm trọng (情節重大)" | ✓ 원문과 일치. §73 동사는 P2-4 참조 |
| P1-5 車手 분리 | 도입부를 "công việc làm thêm trên mạng hứa trả hoa hồng"으로 변경. 직접 인출·송금하면 공동정범으로 검토될 수 있다는 별도 단락 추가. "Thấy tiền lạ… đừng rút hay chuyển đi… hãy báo ngân hàng và cảnh sát" | ✓ |
| P1-6 告誡 불복 | "xử phạt hành chính theo Điều 2 行政罰法… thông thường… 30 ngày kể từ ngày hôm sau ngày nhận (Điều 14 訴願法), qua chính cơ quan cảnh sát đã ra quyết định… các hạn chế ngân hàng vẫn áp dụng (Điều 93 訴願法)" | ✓ 조건문 삭제. 근거·기산점·경유기관·집행부정지 모두 맞음 |

## 신규 문구 원문 재확인 (curl, law.moj.gov.tw 기준일 115-09-18)
- 洗錢防制法 §5 「本法所稱金融機構，包括…七、辦理儲金匯兌、簡易人壽保險業務之郵政機構。」 → "kể cả tài khoản bưu điện 郵局" ✓
- 洗錢防制法 §22(4) 「前項第一款或第二款情形，應依第二項規定，由該管機關併予裁處之。」 → "ngoài án hình sự bạn vẫn bị cảnh cáo" ✓
- 刑訴 §41(2)(3) 「筆錄應向受訊問人朗讀或令其閱覽…請求將記載增、刪、變更者，應將其陳述附記於筆錄」 ✓. 경찰 조사에는 §43-1 「第四十一條、第四十二條之規定，於…司法警察官、司法警察行詢問…時，準用之。」로 준용된다. 표기는 P2-8 참조.
- 刑訴 §27 「犯罪嫌疑人受司法警察官或司法警察調查者，亦同。」 ✓
- 存款帳戶管理辦法(115-08-31) §3 제2호, §5, §9, §10(警示는 原通報機關의 통보나 기간 만료로만 해제), §13(2)(5)但書(一) ✓. 급여계좌 관련은 P2-1 참조.
- 22條6項 辦法 §4, §6 ✓ (이체·인출 각각 1만, 카드결제 합산, 창구 가능, 기간 만료 다음 날부터 5년 추가)
- 刑法 §95 「受有期徒刑以上刑之宣告者」 → "phạt tiền hoặc 拘役 thì Điều 95 không áp dụng" ✓
- 移民法 §36(4)(5) 진술 기회, 변호사·통역 동석 ✓
- 法扶 檢警專案 https://www.laf.org.tw/service-project-detail/19 「要件一 涉犯最輕本刑三年以上有期徒刑之重罪或高等法院管轄第一審之案件」 ✓ (원주민·심신장애 예외 포함)

---

## P1

### P1-1. 法扶의 일반 법률구조 안내가 빠짐 (r1 대비 퇴행, BRIEF 윤리 조항)
- 위치: "Dịch vụ luật sư miễn phí đi cùng khi lấy lời khai lần đầu của Quỹ Hỗ trợ pháp lý… nên vụ cho mượn tài khoản thông thường ít khi thuộc diện này."
- 문제: 지금 法扶에 대해 남은 문장은 "해당 안 됨" 하나뿐이다. 그런데 독자층, 특히 저소득 이주노동자는 **일반 법률구조(申請法扶律師)** 로 수사·재판 단계 변호사를 신청할 수 있다. 외국인은 원칙적으로 합법 거주가 요건이고 자력·사안 심사를 거친다. r1 초안에는 이 내용이 있었는데 이번에 삭제됐다. r1 검수 P2-4에서 제안한 "vẫn có thể hỏi… trợ giúp pháp lý thông thường"도 반영되지 않았다. BRIEF는 "무료 공공 지원이 사실이면 숨기지 말고 알려 준다"고 요구한다. 형사소송법 §95 제1항 제3호도 저소득층 등의 법률구조 청구권을 고지 사항으로 둔다.
- 근거:
  - https://www.laf.org.tw/service-assistance-des 「(二) 外國人：原則上需合法居住於我國境內…」「法律扶助基金會基本上需審查申請人的『資力』…和『案情』」「原則上沒有案件類型限制」
  - 刑訴 §95 https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=C0010001&flno=95 「三、得選任辯護人。如為低收入戶、中低收入戶、原住民或其他依法令得請求法律扶助者，得請求之。」
- 수정안: 해당 단락 끝에 한 문장을 붙인다(37단어). 링크를 늘리지 않도록 평문으로 둔다.
  > "Người nước ngoài cư trú hợp pháp, thu nhập thấp vẫn có thể xin Quỹ cử luật sư (申請法扶律師) cho giai đoạn điều tra hoặc xét xử; Quỹ xét cả tài chính lẫn nội dung vụ việc."
- 분량 맞추기(합계 2,200단어 이하 유지): 아래 두 곳을 줄이면 약 50단어가 빠진다.
  - "Nếu bị buộc rời Đài Loan (Điều 36), bạn phải được trình bày ý kiến trước và có thể nhờ luật sư, phiên dịch có mặt."(26단어)를 삭제한다. 이어지는 "Tự bỏ đi không làm hồ sơ hình sự biến mất."는 앞 단락 끝으로 붙인다.
  - "Họ mời gọi bằng những lời nghe vô hại: …" 문장(24단어)은 예시 하나만 남기거나 삭제한다.

---

## P2

P2-1. **급여계좌 예외의 한계 (§3 제2호)**: "Người đi làm có thể mở tài khoản nhận lương mới bằng giấy chứng nhận đang làm việc (Điều 13)."라고 되어 있다. 그런데 이렇게 연 계좌도 정의상 衍生管制帳戶라 ATM·온라인 이체가 막힌다. 근거 조문은 §3 「衍生管制帳戶…包括依第十三條第二項第五款但書規定所開立之存款帳戶」이다. 독자가 ATM을 쓸 수 있다고 오해하지 않도록 "…(Điều 13), nhưng tài khoản này cũng bị kiểm soát liên đới, chủ yếu rút tại quầy."로 바꾼다(+9단어).

P2-2. **洗錢防制法 §19 금액 조건**: "tù từ 6 tháng đến 5 năm và phạt thêm tiền"에서 금액 조건이 빠졌다. 이 형량은 세탁 금액이 **1억 대만달러 미만**일 때의 구간이다(1억 이상이면 3–10년). 뒤에 "(khi số tiền dưới 100 triệu Đài tệ)"를 붙인다.

P2-3. **§339-4 제3호**: "lừa qua internet"은 범위가 너무 넓다. 원문 요건은 「…網際網路…等傳播工具，對公眾散布而犯之」, 즉 공중을 상대로 퍼뜨린 경우다. "đăng tin lừa đảo công khai trên internet"으로 바꾼다.

P2-4. **就服法 §73 동사**: "cho phép thu hồi"는 재량처럼 들린다. 원문은 「有下列情事之一者，廢止其聘僱許可」로 요건만 충족되면 폐지해야 하는 기속 규정이다. 재량이 들어가는 부분은 情節重大 판단이다. "giấy phép tuyển dụng sẽ bị thu hồi nếu vi phạm pháp luật Đài Loan ở mức nghiêm trọng (情節重大)"로 고친다.

P2-5. **CTA 문구**: "giấy mời ghi hạn đến ngày nào"는 어색하다. 通知書는 기한이 아니라 출석 일시를 적는다. "giấy mời hẹn bạn đến ngày nào"로 바꾼다.

P2-6. **도입부 어순**: "đã đưa thẻ ATM… cho một người 'chỉ để nhận tiền', hay cho một 'công việc làm thêm'…"은 "일자리에게 카드를 줬다"로 읽힌다. "…hoặc để nhận một 'việc làm thêm' trên mạng hứa trả hoa hồng"으로 바꾼다. 같은 도입부의 "Dưới đây là luật quy định gì và bạn có quyền gì."는 "Dưới đây là những gì luật quy định và quyền của bạn."로 바꾼다.

P2-7. **(선택) 22條6項 辦法 예외**: 공과금·세금·벌금 납부 예외(§6 「除繳交公用事業費用（如水、電、瓦斯）、稅款、罰金、罰鍰、滯納金外」)가 이번에 빠졌다. 분량 여유가 생기면 "(trừ tiền điện, nước, gas, thuế, tiền phạt)"를 되살린다.

P2-8. **(선택) 조문 표기**: "(Điều 41)"을 "(Điều 41, áp dụng cho cảnh sát theo Điều 43-1)"로, "Điều 2 Luật Xử phạt hành chính"을 "điểm 4 Điều 2"로 정밀화할 수 있다. 필수는 아니다.

---

## 베트남어 자연스러움 재독
전반적으로 r1보다 자연스럽고 평이하다. "giấy mời", "lấy lời khai", "phong tỏa", "kiểm soát liên đới", "người trực tiếp phạm tội" 모두 적절하다. 핵심 용어는 처음 나올 때 베트남어 뒤에 중국어를 병기하는 원칙이 지켜졌다. 문장 길이도 섞여 있고 불릿 남용이 없다. 남은 어색함은 P2-5·P2-6 두 곳뿐이다. 윤리 면에서는 증거 보존, 공모 금지, 소환 불응 금지, 무단 출국 경고, 화해를 정당한 절차로 안내하는 톤이 유지된다. 은닉·인멸·도주를 돕는 조언은 없다.

검증한 주장 수: r2 신규·변경 주장 19건과 r1 P1 반영 6건 / 공식 출처 재확인: curl 원문 14건(洗錢防制法 §5·§22, 刑法 §33·§95, 刑訴 §27·§41·§43-1·§95, 移民法 §18·§32·§36, 就服法 §73, 存款帳戶管理辦法 전문, 22條6項 辦法 전문)과 法扶 페이지 2건
