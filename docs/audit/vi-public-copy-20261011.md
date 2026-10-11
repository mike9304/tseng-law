# 베트남어 공개 문구 검토 — 2026-10-11

상태: 수정 담당자의 자체 검토 완료. 독립 검수와 배포 승인을 대신하지 않는다. 이 기록은 베트남어 사이트 문구에 관한 것이며, 기존 칼럼의 법률 검토 완료를 뜻하지 않는다.

검토자 역할: AI 베트남어 편집 담당. 사람 원어민 또는 변호사가 검수했다고 표시하지 않는다.

기준 버전: `air/vi-locale-20261011`, 기준 HEAD `63efbfd9ab656837d50026633aa4ff89e8121a1c`. 중단 전에 남아 있던 수정본을 읽고 이어서 정리했다. 검토한 파일의 최종 SHA-256은 끝의 버전 표에 기록한다.

## 범위와 근거

대상은 `src/data/vi-site.ts`, `column-ui-vi.json` 및 `guidance-chrome.json`, `international-guidance-content.ts`, `international-guidance-answers.ts`, `international-guidance-team.ts`, `international-guidance-offices.ts`, `international-inquiry-copy.ts`, `issue-board.ts`의 베트남어 문자열이다. 컴포넌트는 문구의 실제 사용 위치를 확인하기 위해 읽기만 했다.

`RULES.md`, `AGENTS.md`, `EDITORIAL-VOICE.md`, `FRONTMATTER.md`, `tseng-law-editorial/SKILL.md`와 독립 검수 기준을 읽었다. 공개 AI 작성자 푸터에 관한 FRONTMATTER의 오래된 설명보다 최신 AGENTS/문체 규칙을 적용한다. 칼럼의 내부 `author: legal-ai-assistant`, 출처, 날짜, 이미지 AI 고지는 보존했다.

현재 저장소와 2026-10-11 공개 페이지를 대조했다.

- [공개 팀 소개](https://tseng-law.com/en/lawyers), `src/data/team-members.ts`, `src/data/attorney-profiles.ts`, `docs/audit/partner-team-identity-20260930.md`: Wei Tseng은 대만 자격의 파트너 변호사이며, 소개된 사람들은 그 팀이다. 다른 팀원과 협력 회계사의 직무·학력·이메일은 추가하거나 격상하지 않았다.
- [공개 사무소 소개](https://tseng-law.com/en/about), `src/data/firm-introduction.ts`: 2016년 설립, 대만 네 지역의 사무소와 기존 업무 설명을 대조했다. 새 숫자·수상·승소 사례를 만들지 않았다.
- [공개 연락 안내](https://tseng-law.com/en/contact), `src/data/office-locations.ts`, `src/lib/consultation/public-contact.ts`: 상담 언어는 영어·중국어·일본어·한국어다. 베트남어는 게시 내용과 초기 문의 작성에 사용한다. 실제 베트남어 상담이나 통역을 약속하지 않는다. 주소와 전화·이메일은 공통 원본을 사용하며 `19號6樓之1`을 변경하지 않았다.
- [공개 서비스](https://tseng-law.com/en/services): 투자·기업, 민사, 가족·상속, 노동, 형사, 지식재산의 기존 업무 범위를 유지했다. 새 베트남 법률업무, 베트남 사무소 또는 베트남 변호사 자격을 넣지 않았다.

공개 영어 CTA 일부의 “We reply in the language you write in”은 네 상담 언어 안내보다 넓게 읽힐 수 있어 주 담당자에게 알렸다. 베트남어에서는 이 문구를 복제하지 않고 제공받은 상담 언어 제한과 연락 방식 별도 확인 원칙을 따른다. 다른 언어의 문구는 수정하지 않았다.

## 주요 문장 판단

아래 표는 중단 전 수정과 이번 마무리 수정을 함께 기록한다. 전체 변경 문자열은 마지막 diff 부록에서 정확히 대조할 수 있다.

| 위치 | 이전 문구 | 최종 문구 | 이유와 의미 보존 |
|---|---|---|---|
| `vi-site.ts`, services.description | `Mỗi vụ việc có hoàn cảnh riêng. Các lĩnh vực dưới đây giúp quý vị tìm đúng nội dung cần trao đổi với luật sư.` | `Tư vấn và giải quyết tranh chấp về lao động, gia đình, dân sự, hình sự, đầu tư và sở hữu trí tuệ.` | 첫 문장은 삭제해도 정보 손실이 없다. 추상적인 도입·페이지 사용 예고를 기존 여섯 업무 범위로 바꿨다. 신규 업무 없음. |
| `international-guidance-content.ts`, services.title | `Các lĩnh vực mà văn phòng nhận xử lý` → 중단본 `Cá nhân và doanh nghiệp tại Đài Loan` | `Dịch vụ pháp lý cho cá nhân và doanh nghiệp` | 현재 컴포넌트는 eyebrow를 표시하지 않으므로 제목 자체에서 서비스 페이지임을 밝힌다. 대상과 업무 범위 유지. |
| content/chrome, nav.pricing | 원본 `Phạm vi và chi phí`; 중단된 chrome 사본 `Chi phí tư vấn` | `Chi phí dịch vụ` | 두 사본 불일치와 상담료만 다룬다는 좁은 인상을 해소했다. 상세 페이지는 상담료·수임료·별도 비용을 계속 설명한다. |
| content/chrome, footerNotice | `Nội dung trên website là thông tin chung về pháp luật Đài Loan, không thay thế ý kiến pháp lý cho từng vụ việc. Việc gửi yêu cầu chưa làm phát sinh quan hệ luật sư – khách hàng.` | `Nội dung trên website là thông tin chung về pháp luật, không thay thế ý kiến pháp lý cho từng vụ việc. Phạm vi tư vấn của văn phòng là pháp luật Đài Loan. Việc gửi yêu cầu chưa làm phát sinh quan hệ luật sư – khách hàng.` | 사실 범위 명료화. 기존 베트남법 이슈 글까지 모두 대만법이라고 묶지 않는다. 사무소의 대만법 상담 범위, 개별 자문 대체 불가, 문의만으로 위임관계가 생기지 않는다는 제한은 유지. |
| content, contact.intro | `Trước khi liên hệ, xin lưu ý ba điều tách biệt dưới đây. Ba điều này dễ bị nhầm lẫn với nhau, nhưng mỗi điều có ý nghĩa riêng.` | `Quý vị có thể gửi một bản tóm tắt về vụ việc, điều cần hỗ trợ và thời hạn liên quan. Văn phòng xem xét nội dung trước khi trao đổi về phạm vi công việc và chi phí.` | 설명 구조를 예고하던 문장을 실제 접수 내용과 다음 단계로 교체. 접수는 예약 확정이나 법률 의견이라는 뜻이 아님. |
| content, FAQ 언어 질문 | `Nếu tôi không dùng được cả bốn ngôn ngữ đó thì sao?` | `Nếu tôi không dùng được ngôn ngữ nào trong bốn ngôn ngữ đó thì sao?` | “네 언어 모두를 못한다”와 “네 언어 중 어느 것도 사용하지 못한다”가 혼동되지 않게 했다. 의도된 none-of-four 조건을 명확히 했으며 서비스 확대가 아님. 중단본에 이미 해결되어 있어 유지. |
| inquiry, methodConfirmationNotice | `Nếu quý vị không dùng được ngôn ngữ nào trong bốn ngôn ngữ đó, hãy chọn “Cần xác nhận cách liên hệ”.` | `Nếu quý vị không thể trao đổi bằng ngôn ngữ nào trong bốn ngôn ngữ trên, quý vị có thể chọn “Cần xác nhận cách liên hệ”.` | 명령형을 제안형으로 바꾸되 어떤 상담 언어도 쓰기 어려운 경우라는 조건 유지. 뒤의 가능할 때만 연락 방식 확인·다른 언어 지원 및 응답 시간 무보장 문장도 보존. |
| content, FAQ 베트남어 상담 답변 | `Không. Phần hướng dẫn này được viết bằng tiếng Việt, nhưng việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.` | `Hiện luật sư tư vấn bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn, chưa có dịch vụ tư vấn bằng tiếng Việt.` | 부정만으로 시작하지 않고 실제 가능한 언어를 먼저 밝힌다. 베트남어 상담·통역을 보장하지 않는 조건 유지. |
| content, pricing의 첫 상담 | `Buổi tư vấn với luật sư có thể là dịch vụ có thu phí. Trang này không tuyên bố rằng buổi tư vấn đầu tiên là miễn phí, và quý vị không nên hiểu bất kỳ nội dung nào ở đây theo nghĩa đó.` | `Buổi tư vấn với luật sư, kể cả buổi đầu tiên, có thể là dịch vụ có thu phí.` | 훈계형 반복을 제거. 첫 상담을 포함해 유료일 수 있다는 강도와 사전 요금 확인 유지. 가격·무료 약속 없음. |
| content, services의 민사 설명 | `Thời hạn (kể cả thời hiệu khởi kiện) và mức độ đầy đủ của chứng cứ ảnh hưởng lớn đến cách tiến hành một vụ việc dân sự, vì vậy quý vị nên nêu sớm các mốc thời gian mà mình biết.` | `Thời hạn, kể cả thời hiệu khởi kiện, và chứng cứ hiện có ảnh hưởng đến phương án xử lý.` | 독자 행동 지시보다 판단 요소를 앞세웠다. 기간·시효와 증거가 검토에 필요하다는 의미를 유지하고 특정 기간을 새로 정하지 않음. |
| content, services의 가족 설명 | `việc thực hiện quyền và gánh vác nghĩa vụ đối với con chưa thành niên` | `quyền và nghĩa vụ đối với con chưa thành niên` | 어색한 직역을 줄이고 바로 뒤의 대만 공식 용어 `未成年子女權利義務之行使或負擔`를 유지. 베트남법상 양육권 규칙으로 치환하지 않음. |
| team, Son 직무·소개 | `Quản lý nghiệp vụ Hàn Quốc`; `Điều phối lịch tư vấn và việc liên lạc cho khách hàng Hàn Quốc.` | `Quản lý hoạt động văn phòng Hàn Quốc`; `Điều phối lịch tư vấn và liên lạc qua văn phòng Hàn Quốc.` | 현재 영어 원본의 Korea Office 운영·연락 업무에 맞췄다. 변호사 자격이나 정식 부서장 직함을 추가하지 않음. |
| team, Fang-Yu Chang 소개 | `Hỗ trợ tố tụng, thành lập công ty, thủ tục chấp thuận đầu tư nước ngoài, xin giấy phép và việc trao đổi giữa Hàn Quốc và Đài Loan.` | `Hỗ trợ tố tụng, thành lập công ty, thủ tục chấp thuận đầu tư nước ngoài, xin giấy phép và trao đổi với khách hàng nước ngoài.` | 현재 영어 원본의 overseas clients를 반영한 사실 표현 정렬. 법무 보조 직무 유지. |
| team, 협력 회계사 | `Kế toán sư hợp tác (會計師, CPA)` | `Kế toán viên hợp tác (會計師, CPA)` | 베트남어 직무 표현 정리. 협력 관계와 대만 자격 표기 유지. |
| column-ui / issue-board 상담 안내 | `Nếu bạn có câu hỏi về pháp luật Đài Loan, hãy liên hệ với chúng tôi.` | `Quý vị có thể gửi tóm tắt để văn phòng xem xét phạm vi hỗ trợ theo pháp luật Đài Loan.` | 과장 없이 실제 초기 문의 행동과 검토 단계를 표시. 사이트 공통 호칭은 quý vị로 통일하고 즉시 상담·예약 약속 없음. |
| issue-board, 제목 | `Pháp luật Đài Loan qua tin tức` | `Pháp luật qua tin tức` | 베트남법을 다루는 보존 대상 이슈 2편과 일치하도록 관할을 과도하게 좁히지 않음. 상세 설명에는 대만·베트남 뉴스와 사무소의 대만법 상담 범위를 구분. 중단본에서 해결한 것을 유지하고 홈 링크에도 같은 명칭 적용. |
| issue-board, dateNote | `Bài viết được viết từ thông tin trên báo chí. Tình hình và quy định pháp luật có thể đã thay đổi sau ngày đăng.` | `Bài viết dựa trên thông tin báo chí. Tình hình và quy định pháp luật có thể đã thay đổi sau ngày đăng.` | “글은 작성되었다” 반복을 제거. 게시 시점 이후 사실·법령 변경 가능성 유지. |
| content, disclaimer 범위 | `Văn phòng hành nghề theo pháp luật Đài Loan, và các trang này chỉ nói về công việc trong phạm vi đó.` | `Văn phòng hành nghề theo pháp luật Đài Loan. Bài viết về pháp luật của nước khác không có nghĩa là văn phòng cung cấp dịch vụ tư vấn theo pháp luật của nước đó.` | 내용상 범위 교정. 사이트 전체가 대만법만 다룬다는 부정확한 표현을 수정했다. 다른 나라 법률 정보와 사무소 자문 범위를 일반적으로 구별하며, 베트남 관련 글은 이슈 게시판 설명에서 명시한다. 최종 검수에서 관할 경계 문장으로 확인할 사항. |
| content, disclaimer의 다른 법률 체계 | `Nội dung trên các trang này không phải ý kiến pháp lý theo pháp luật của bất kỳ thẩm quyền nào khác ngoài Đài Loan, kể cả pháp luật nơi quý vị cư trú. Nếu vụ việc của quý vị có phần thuộc thẩm quyền của nước khác, chúng tôi sẽ cùng quý vị xác nhận cần chuyên gia có tư cách phù hợp nào cho phần đó.` | `Nội dung về pháp luật nước khác chỉ mang tính tham khảo. Nếu vụ việc có phần cần xử lý theo pháp luật ngoài Đài Loan, phạm vi tư vấn và nhu cầu làm việc với luật sư có tư cách hành nghề phù hợp cần được xác nhận riêng.` | jurisdiction를 “어떤 권한의 법률”처럼 직역하던 문장을 정리. 외국법 부분의 별도 확인과 해당 자격 필요성 유지. 실제 협업 제공을 보장하지 않음. |

## 첫 두 문단 삭제 시험

페이지 제목·버튼은 본문 문단으로 세지 않는다. 현재 컴포넌트가 사용하는 설명문과 첫 본문을 함께 읽었다. 아래는 삭제할 때 잃는 정보와 결정이다. 실제 로컬 HTML에서 읽힌 문단은 lane evidence의 `copy-rendered-openings.json`에 별도로 기록한다.

| 화면 | 첫 부분이 주는 정보 | 삭제 판단 |
|---|---|---|
| 홈 | 첫 설명은 개인·가족·기업의 대만법 상담·분쟁 업무, 다음 설명은 일·학업·생활·사업을 하는 베트남어 독자 | 업무 범위와 독자·언어가 달라 둘 다 유지. 서비스 영역의 `Mỗi vụ việc có hoàn cảnh riêng.`은 삭제해도 정보가 같아 제거. |
| 서비스 | 상단은 여섯 업무 분야, 첫 노동 본문은 계약 종료·수당·임금 및 대만 개념의 차이 | 상단은 탐색에 필요하고 본문은 구체 범위를 설명하므로 유지. 베트남의 수당 제도와 같지 않다는 기존 단서 보존. |
| 팀 | 실제 HTML의 첫 문단은 Wei Tseng 팀 및 대만·한대만 업무, 둘째는 네 상담 언어 | 팀 범위와 상담 언어가 달라 둘 다 유지. 뒤의 변호사·직원·협력 회계사 구분과 실제 인물 경력도 보존. |
| 소개 | 상단은 사무소·해외 관련 업무, 첫 본문은 대만 국내외 고객과 활동 범위, 다음 단락은 실제 설립 배경 | 새 사실 없는 전개 예고는 제거한 상태. 설립 연도·명칭·사무소 사실은 남김. |
| 비용 | 상단은 상담료·수임료·관련 비용, 첫 본문은 범위에 따른 요금 결정과 사전 확인 | “이 페이지는 금액을 쓰지 않는다”는 도입 대신 실제 방식 제시. 첫 상담 유료 가능성 유지. |
| 연락 | 상단은 접수·언어·자료 안내, 첫 본문은 사건 경위·대만 관련성·기한, 다음은 민감자료 제한 | 첫 안내가 실제 접수 범위를 설명하고 민감자료 문장이 별도 조건을 담아 유지. 자동 예약·통역 약속 없음. |
| FAQ | 상단 설명과 첫 답변은 사무소 업무·언어·비용과 개별 사건 수임 검토 | 문장 수나 세 가지 항목을 강요하는 안내는 제거. 질문·답변은 실제 서로 다른 문의를 다룸. |
| 칼럼 목록 | 실제 첫 문단은 대만의 노동·거주·가족·사업·소송을 다루는 베트남어 글이라는 설명, 둘째는 형사소송 글 모음 링크 | 독자가 찾을 주제와 언어, 별도 전문 게시판의 목적이 달라 유지. 40개 칼럼 본문·첫 문단은 이번 수정 대상 아님. |
| 이슈 목록 | 대만·베트남 관련 뉴스, 사무소의 대만법 범위, 게시 시점의 한계 | 실제 보존 글의 관할과 서비스 범위가 달라 모두 필요. “독자에게 무엇을 설명할지”만 예고하던 원문은 교체. |
| 개인정보 | 상단은 수집·이용·저장·요청 항목, 첫 본문은 문의 양식에 한정한 적용 범위 | 각 문장이 적용 범위와 처리 목적을 추가하므로 유지. 기존 비공개 저장·민감정보·외부 저장소·보유기간 조건 보존. |
| 면책 | 상단은 정보의 성격·법률 범위·위임관계, 첫 본문은 대만법 업무와 다른 나라 법률 정보의 구별 | 베트남법 이슈가 있어 관할 구별을 남김. 개별 자문 대체 불가·결과 무보장·위임 확인 문장 보존. |

## 최근 같은 언어 글 3편과 비교

비교 대상은 모두 게시일 2026-10-08이며 같은 날짜에서는 높은 번호부터 최신순으로 읽었다. 문체·구조 비교용으로 읽었고 법률 결론을 다시 인증하거나 수정하지 않았다.

| 비교 글 | 도입·구조·끝맺음의 실제 특징 | 이번 사이트 문구에 적용한 판단 |
|---|---|---|
| `src/content/columns-vi/444-taiwan-short-sentence-fine-suspension-residence.md` | `Trên bản án, 罰金 là hình phạt tiền.`로 바로 세 제도를 구별한다. 다음 문단은 확정 여부와 집행 담당 기관이다. 소제목은 제도별 명사구 위주이며 끝은 집행 서류·ARC·허가서가 다른 질문에 답한다는 설명이다. | 일반론 도입을 붙이지 않고 서비스·요금·관할을 바로 밝힌다. 같은 CTA나 요약 틀을 사이트 모든 구역에 강요하지 않음. |
| `src/content/columns-vi/443-taiwan-sexual-assault-report-vietnamese-workers-residents.md` | `Bạn có thể tìm hỗ trợ y tế và an toàn mà không cần tự xác định chính xác tội danh trước.`로 지원 결정을 먼저 다룬다. 둘째 문단은 언어·통역이다. 끝은 안전한 연락과 주거 필요이며 상담 홍보로 끝나지 않는다. | 사이트는 더 격식 있는 quý vị를 쓰되 필요한 행동의 목적부터 제시한다. 이 글의 공적 통역 권리와 사무소의 통역 제공 여부는 서로 다른 사항으로 유지. |
| `src/content/columns-vi/442-taiwan-police-interview-vietnamese-interpreter-lawyer.md` | 일상 중국어와 법률질문 이해의 차이로 시작하며 둘째 문단은 피의자와 증인의 지위를 구별한다. 첫 소제목은 질문형이지만 뒤는 권리·통역·서명 주제로 다양하다. 끝은 알려진 사실과 모르는 부분이 드러나는 자료 구성이다. | 법률적 차이를 뭉개지 않고 상담 언어·문의 언어를 구분한다. 모든 소제목을 질문형으로 만들거나 독자에게 일괄 명령하지 않음. |

세 비교 글의 첫 두 문단은 각각 제도 구별, 안전·언어 지원, 피의자·증인 구별을 제공하므로 통째로 삭제할 근거가 없다. 절차나 안전상 지시는 사이트 홍보 문구의 불필요한 명령형과 다르게 취급한다. 본문, 수치, 기간, 조문 번호, 출처, 작성 이력 및 미디어 고지는 변경하지 않았다.

## 검증과 남은 범위

- 데이터 관련 Vitest 6개 파일, 393개 검사 통과: chrome projection, team bios, office facts, disclosure parity, privacy disclosure, answer summaries. 마지막 문구 조정 후 chrome projection 1개도 다시 통과했다.
- 공용 데이터 파일의 VI 속성을 AST로 제외해 중단본과 비교: 다른 언어와 구조의 바이트 변경 없음. HEAD와의 비교도 같은 방법으로 통과했다.
- 주 담당자가 후속 위임한 `columns-grid-guidance-labels.test.tsx`의 VI 근거 문자열만 갱신했다. All 필터의 `Tất cả` 자체는 그대로이며, 근거는 바뀐 메가메뉴 문구가 아닌 현재 `home.columnsViewAllLabel: 'Xem tất cả bài viết'`이다. 다른 언어 assertion은 그대로다.
- country-name 게이트의 후속 실패는 면책 문구에서 굳이 베트남을 이름으로 열거한 한 문장이었다. 최종 문구는 `pháp luật của nước khác`로 일반적인 외국법 정보·서비스 구별을 표현한다. 이슈 게시판은 여전히 대만·베트남 양국을 명시하고 보존 글을 숨기지 않는다. 검사 코드나 전역 허용 목록을 완화하지 않았으며, 최종 데이터의 직접 스캔은 위반 0건이다.
- 베트남어 칼럼 40개와 이슈 5개의 SHA-256이 작업 시작 시점과 같다.
- `git diff --check` 통과. 굵은 강조, 새로운 연락처·가격·자격·성과·통역 약속을 추가하지 않았다.
- 사실 범위 교정은 이슈·푸터·면책 문구의 관할 설명과 현재 팀 원본에 맞춘 직무 표현이다. 새 법조문이나 법률 결론을 작성하지 않았다. 기존 칼럼의 조문 최신성 재검토는 이번 범위 밖이다.
- 전체 typecheck·lint·build와 데스크톱/모바일 실화면 검수는 주 담당자의 통합 게이트에서 확인한다. 이 작업에서는 커밋·push·배포·실제 문의 전송을 하지 않았다.
- 로컬 HTML 읽기에서는 `/vi`, `/vi/services`, `/vi/lawyers`, `/vi/about`, `/vi/columns`가 200으로 응답했고 실제 문구를 확인했다. 비용·이슈·FAQ·연락·개인정보·면책 경로는 당시 병렬 검사와 개발 서버 재컴파일 중 20초 제한에 걸려 읽지 못했다. 그 경로의 위 삭제 시험은 데이터·컴포넌트 기준이며, 실제 화면 검수 결과로 표시하지 않는다. 주 담당자가 빌드 뒤 순차 검증한다.
- 컴포넌트 문구를 읽은 범위에서 별도 수정을 요청할 중대한 미해결 항목은 없다. 다른 영어 CTA의 넓은 언어 응답 약속은 앞서 주 담당자에게 전달한 범위 밖 참고 사항이다.

## 검토 버전

| 파일 | SHA-256 |
|---|---|
| src/data/vi-site.ts | `1ae8d681f30d74e9e8150c55b72ff17821141cc742eea21e4b043b80610a1e4e` |
| src/data/column-ui-vi.json | `a3e705542be4443e289fb58013f4f2b3792d71e31954a3d7e875291ffe66bac6` |
| src/data/guidance-chrome.json | `32e9edc0919bbe8dfd669f3602e516b83c644a7cd8fb30a496576a50f731b875` |
| src/data/international-guidance-content.ts | `b051df69782b122ec0d101012bf809c9e86b74d441cd5f8f561110e08612ed3c` |
| src/data/international-guidance-answers.ts | `96b3e409106380c3ae819ec71d72b4678253342f969e824085733a213220dcd5` |
| src/data/international-guidance-team.ts | `68e62f6dac3afb725135c836e82b1100634d8443ae6a3c1b64adc606812e873b` |
| src/data/international-guidance-offices.ts | `0416af957cc017c18bc79e2f29e07c4be5faf16c08ad9e17781b7a29e6aa78a3` |
| src/data/international-inquiry-copy.ts | `0589f080e90f7e36c9b03151a0d36aaaa4cfaebf87fca1066984445273f2c767` |
| src/data/issue-board.ts | `a682d0584028bf5bfeeec0783fe986948c8ac91e21efd9b1ff172f2b3958c7c5` |
| src/components/__tests__/columns-grid-guidance-labels.test.tsx | `f49ccf1a23df1353651ab23734d15fd51cfe7fe7f1e829b6bfb03d69ef77f104` |

## 전체 문구 diff

다음 부록은 기준 HEAD에서 최종 검토본까지의 맡은 데이터 파일 변경이다. 새 `vi-site.ts`는 새 화면의 문구로, 인물·사무소·상세 서비스 사실은 공통 원본에서 계속 가져온다. UI 레이블의 축약은 행위 자체를 바꾸지 않으며, 서비스·FAQ 문단의 나머지 수정은 위 표의 원칙대로 전개 예고·반복·불필요한 명령형을 줄인 것이다. 의미가 바뀌는 관할·팀 원본 정렬 항목은 위 표에서 별도로 표시했다.

```diff
diff --git a/src/components/__tests__/columns-grid-guidance-labels.test.tsx b/src/components/__tests__/columns-grid-guidance-labels.test.tsx
index 8b4e8280..7a012f84 100644
--- a/src/components/__tests__/columns-grid-guidance-labels.test.tsx
+++ b/src/components/__tests__/columns-grid-guidance-labels.test.tsx
@@ -28,7 +28,7 @@ const GUIDANCE_CENTRAL_EUROPE_SRC = path.join(process.cwd(), 'src/data/internati
 /**
  * Filter "All" word taken from reviewed `viewAllLabel` already in
  * `international-guidance-content.ts` (grep 2026-09-16). Not invented:
- *   vi  line 140  mega.services.viewAllLabel: 'Xem tất cả'     → 'Tất cả'
+ *   vi  home.columnsViewAllLabel: 'Xem tất cả bài viết'       → 'Tất cả'
  *   id  line 635  mega.services.viewAllLabel: 'Lihat semua'    → 'Semua'
  *   th  line 1130 mega.services.viewAllLabel: 'ดูทั้งหมด'       → 'ทั้งหมด'
  *   fil line 1625 mega.services.viewAllLabel: 'Tingnan ang lahat' → 'Lahat'
@@ -83,7 +83,7 @@ const GUIDANCE_ALL_LABEL: Record<GuidanceLocale4, string> = {
 };

 const VIEW_ALL_LABEL_EVIDENCE: Record<GuidanceLocale4, string> = {
-  vi: "viewAllLabel: 'Xem tất cả'",
+  vi: "columnsViewAllLabel: 'Xem tất cả bài viết'",
   id: "viewAllLabel: 'Lihat semua'",
   th: "viewAllLabel: 'ดูทั้งหมด'",
   fil: "viewAllLabel: 'Tingnan ang lahat'",
diff --git a/src/data/column-ui-vi.json b/src/data/column-ui-vi.json
index 496a8df1..ebcf026e 100644
--- a/src/data/column-ui-vi.json
+++ b/src/data/column-ui-vi.json
@@ -5,13 +5,13 @@
     "submit": "Tìm kiếm",
     "clear": "Xóa từ khóa",
     "resultCount": "{n} kết quả",
-    "reset": "Xóa bộ lọc · Xem tất cả bài viết",
+    "reset": "Xóa bộ lọc",
     "category": "Danh mục",
     "author": "Tác giả",
     "year": "Năm",
     "month": "Tháng",
     "query": "Từ khóa",
-    "noMatches": "Không có bài viết phù hợp. Xóa bộ lọc để xem tất cả bài viết.",
+    "noMatches": "Chưa có bài viết phù hợp với từ khóa hoặc bộ lọc này.",
     "noPosts": "Chưa có bài viết nào được đăng."
   },
   "topics": {
@@ -19,11 +19,11 @@
     "company": "Thành lập công ty và đầu tư",
     "tax": "Thuế",
     "visa": "Thị thực và cư trú",
-    "family": "Hôn nhân và ly hôn có yếu tố nước ngoài",
+    "family": "Hôn nhân và gia đình",
     "inheritance": "Thừa kế",
     "litigation": "Tố tụng và tranh chấp",
     "labor": "Lao động và việc làm",
-    "lawyer": "Thuê luật sư tại Đài Loan",
+    "lawyer": "Làm việc với luật sư",
     "other": "Thông tin pháp luật khác"
   },
   "topicUi": {
@@ -36,9 +36,9 @@
     "backLabel": "← Danh sách bài viết",
     "attorneyHeading": "Luật sư",
     "guideTitle": "Chủ đề liên quan",
-    "consultationTitle": "Đặt lịch tư vấn",
-    "consultationText": "Nếu bạn có câu hỏi về pháp luật Đài Loan, hãy liên hệ với chúng tôi.",
-    "consultationButton": "Liên hệ",
+    "consultationTitle": "Trao đổi về vụ việc của quý vị",
+    "consultationText": "Quý vị có thể gửi tóm tắt để văn phòng xem xét phạm vi hỗ trợ theo pháp luật Đài Loan.",
+    "consultationButton": "Gửi yêu cầu tư vấn",
     "faqHeading": "Câu hỏi thường gặp",
     "tocLabel": "Mục lục bài viết",
     "prevLabel": "← Bài trước",
diff --git a/src/data/guidance-chrome.json b/src/data/guidance-chrome.json
index 17d1d09f..d9998020 100644
--- a/src/data/guidance-chrome.json
+++ b/src/data/guidance-chrome.json
@@ -2,25 +2,25 @@
   "vi": {
     "nav": {
       "home": "Trang chủ",
-      "services": "Lĩnh vực dịch vụ",
+      "services": "Dịch vụ pháp lý",
       "about": "Về văn phòng",
-      "lawyers": "Luật sư",
-      "pricing": "Phạm vi và chi phí",
+      "lawyers": "Luật sư và đội ngũ",
+      "pricing": "Chi phí dịch vụ",
       "contact": "Liên hệ",
       "faq": "Câu hỏi thường gặp",
-      "privacy": "Quyền riêng tư",
-      "disclaimer": "Tuyên bố miễn trừ trách nhiệm",
+      "privacy": "Chính sách bảo mật",
+      "disclaimer": "Thông tin pháp lý",
       "columns": "Bài viết"
     },
-    "languageLabel": "Ngôn ngữ của trang",
-    "skipLink": "Bỏ qua phần điều hướng, đến nội dung chính",
-    "menuLabel": "Trình đơn",
+    "languageLabel": "Ngôn ngữ",
+    "skipLink": "Đến nội dung chính",
+    "menuLabel": "Mở menu",
     "contactCta": "Gửi yêu cầu tư vấn",
-    "footerNotice": "Trang tiếng Việt này chỉ cung cấp thông tin hướng dẫn chung về công việc của văn phòng theo pháp luật Đài Loan. Đây không phải ý kiến pháp lý cho vụ việc cụ thể, và việc gửi thông tin qua trang này không tự nó tạo lập quan hệ giữa luật sư và khách hàng.",
+    "footerNotice": "Nội dung trên website là thông tin chung về pháp luật, không thay thế ý kiến pháp lý cho từng vụ việc. Phạm vi tư vấn của văn phòng là pháp luật Đài Loan. Việc gửi yêu cầu chưa làm phát sinh quan hệ luật sư – khách hàng.",
     "pages": {
       "home": {
-        "title": "Dịch vụ pháp lý tại Đài Loan — hướng dẫn bằng tiếng Việt",
-        "description": "Giới thiệu chung bằng tiếng Việt về phạm vi công việc của Hovering International Law Firm tại Đài Loan, ngôn ngữ tư vấn và cách bắt đầu liên hệ."
+        "title": "Dịch vụ pháp lý tại Đài Loan",
+        "description": "Hovering International Law Firm tại Đài Loan: tư vấn doanh nghiệp, tranh chấp, lao động, hôn nhân và gia đình. Thông tin dịch vụ và bài viết bằng tiếng Việt."
       }
     }
   },
diff --git a/src/data/international-guidance-answers.ts b/src/data/international-guidance-answers.ts
index 0d09e63c..22ac4fe1 100644
--- a/src/data/international-guidance-answers.ts
+++ b/src/data/international-guidance-answers.ts
@@ -43,17 +43,17 @@ export const guidanceAnswers: Record<
   vi: {
     services: {
       answer:
-        'Văn phòng nhận sáu lĩnh vực theo pháp luật Đài Loan: đầu tư và thành lập doanh nghiệp, tranh chấp dân sự và bồi thường, hôn nhân, gia đình và thừa kế, tranh chấp lao động, hình sự và sở hữu trí tuệ. Phạm vi từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi. Tư vấn chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
+        'Văn phòng xử lý sáu nhóm việc theo pháp luật Đài Loan: đầu tư và thành lập doanh nghiệp, dân sự và bồi thường, hôn nhân, gia đình và thừa kế, lao động, hình sự và sở hữu trí tuệ. Phạm vi công việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi. Tư vấn bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
       sources: ['/vi/faq', '/vi/contact'],
     },
     about: {
       answer:
-        'Hovering International Law Firm là văn phòng luật Đài Loan, thành lập năm 2016 bởi luật sư tốt nghiệp Đại học Quốc lập Đài Loan (國立臺灣大學), có văn phòng tại Đài Bắc, Cao Hùng, Đài Trung, Bình Đông. Từ 2020 có bộ phận kế toán; văn phòng Đài Trung phụ trách việc liên quan đến Hàn Quốc, Nhật Bản. Văn phòng không cam kết kết quả. Tư vấn chỉ bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
+        'Hovering International Law Firm được thành lập năm 2016 bởi các luật sư tốt nghiệp Đại học Quốc lập Đài Loan (國立臺灣大學), với văn phòng tại Đài Bắc, Cao Hùng, Đài Trung và Bình Đông. Văn phòng không cam kết kết quả vụ việc. Tư vấn bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
       sources: ['/vi/lawyers', '/vi/services'],
     },
     lawyers: {
       answer:
-        'Đội ngũ của luật sư Wei Tseng xử lý việc pháp lý Đài Loan và Hàn–Đài. Luật sư Wei Tseng (曾雋崴) có tư cách hành nghề tại Đài Loan và là luật sư thành viên của văn phòng, làm việc với khách hàng Hàn Quốc, Nhật Bản và khách hàng quốc tế. Việc tư vấn của văn phòng chỉ được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
+        'Luật sư Wei Tseng (曾雋崴) có tư cách hành nghề tại Đài Loan và là luật sư thành viên của văn phòng. Đội ngũ phụ trách pháp luật Đài Loan và các vụ việc giữa Hàn Quốc và Đài Loan, làm việc với khách hàng Hàn Quốc, Nhật Bản và khách hàng quốc tế. Luật sư tư vấn bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
       sources: ['/vi/about', '/vi/contact'],
     },
     pricing: {
@@ -63,7 +63,7 @@ export const guidanceAnswers: Record<
     },
     contact: {
       answer:
-        'Hãy gửi tóm tắt qua biểu mẫu liên hệ: chuyện gì đã xảy ra, cần hỗ trợ gì, vụ việc liên quan đến Đài Loan ra sao và thời hạn nếu có. Bước đầu chưa cần gửi giấy tờ tùy thân hay toàn bộ chứng cứ. Văn phòng không cam kết thời gian phản hồi, không xác nhận lịch hẹn qua đây. Việc tư vấn chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
+        'Quý vị có thể gửi tóm tắt vụ việc, yêu cầu hỗ trợ và thời hạn qua biểu mẫu. Bước đầu chưa cần giấy tờ tùy thân hay toàn bộ chứng cứ. Văn phòng không cam kết thời gian phản hồi; lịch hẹn cần xác nhận riêng. Tư vấn bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
       sources: ['/vi/faq', '/vi/pricing'],
     },
     faq: {
diff --git a/src/data/international-guidance-content.ts b/src/data/international-guidance-content.ts
index d39792da..f2b6b506 100644
--- a/src/data/international-guidance-content.ts
+++ b/src/data/international-guidance-content.ts
@@ -199,64 +199,64 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
     languageName: 'Tiếng Việt',
     nav: {
       home: 'Trang chủ',
-      services: 'Lĩnh vực dịch vụ',
+      services: 'Dịch vụ pháp lý',
       about: 'Về văn phòng',
-      lawyers: 'Luật sư',
-      pricing: 'Phạm vi và chi phí',
+      lawyers: 'Luật sư và đội ngũ',
+      pricing: 'Chi phí dịch vụ',
       contact: 'Liên hệ',
       faq: 'Câu hỏi thường gặp',
-      privacy: 'Quyền riêng tư',
-      disclaimer: 'Tuyên bố miễn trừ trách nhiệm',
+      privacy: 'Chính sách bảo mật',
+      disclaimer: 'Thông tin pháp lý',
       columns: 'Bài viết',
     },
     contactCta: 'Gửi yêu cầu tư vấn',
     footerNotice:
-      'Trang tiếng Việt này chỉ cung cấp thông tin hướng dẫn chung về công việc của văn phòng theo pháp luật Đài Loan. Đây không phải ý kiến pháp lý cho vụ việc cụ thể, và việc gửi thông tin qua trang này không tự nó tạo lập quan hệ giữa luật sư và khách hàng.',
-    skipLink: 'Bỏ qua phần điều hướng, đến nội dung chính',
-    menuLabel: 'Trình đơn',
-    languageLabel: 'Ngôn ngữ của trang',
+      'Nội dung trên website là thông tin chung về pháp luật, không thay thế ý kiến pháp lý cho từng vụ việc. Phạm vi tư vấn của văn phòng là pháp luật Đài Loan. Việc gửi yêu cầu chưa làm phát sinh quan hệ luật sư – khách hàng.',
+    skipLink: 'Đến nội dung chính',
+    menuLabel: 'Mở menu',
+    languageLabel: 'Ngôn ngữ',
     mega: {
       services: {
-        description: 'Văn phòng hỗ trợ những lĩnh vực công việc chính theo pháp luật Đài Loan.',
-        viewAllLabel: 'Xem tất cả',
+        description: 'Tư vấn doanh nghiệp, giải quyết tranh chấp và các vấn đề pháp lý trong cuộc sống tại Đài Loan.',
+        viewAllLabel: 'Xem dịch vụ',
       },
       columns: {
-        description: 'Các bài viết giải thích chủ đề pháp luật Đài Loan thường gặp.',
-        viewAllLabel: 'Xem tất cả',
+        description: 'Pháp luật Đài Loan về lao động, gia đình, cư trú, kinh doanh và tố tụng.',
+        viewAllLabel: 'Xem bài viết',
       },
       lawyers: {
-        description: 'Giới thiệu luật sư phụ trách và cách liên hệ với văn phòng.',
-        viewAllLabel: 'Xem tất cả',
+        description: 'Luật sư Wei Tseng và đội ngũ phụ trách pháp luật Đài Loan.',
+        viewAllLabel: 'Xem đội ngũ',
       },
       pricing: {
-        description: 'Phạm vi công việc và cách trao đổi về chi phí được nêu tại trang này.',
-        viewAllLabel: 'Xem tất cả',
+        description: 'Phạm vi công việc, cách tính phí và các khoản chi phí được trao đổi trước khi bắt đầu.',
+        viewAllLabel: 'Tìm hiểu chi phí',
       },
       faq: {
-        description: 'Những câu hỏi thường gặp về công việc của văn phòng tại Đài Loan.',
-        viewAllLabel: 'Xem tất cả',
+        description: 'Thông tin về ngôn ngữ tư vấn, gửi yêu cầu, tài liệu và chi phí.',
+        viewAllLabel: 'Xem câu trả lời',
       },
     },
     notFoundTitle: 'Không tìm thấy trang',
     notFoundText:
-      'Trang quý vị tìm không tồn tại hoặc đã chuyển sang địa chỉ khác. Quý vị có thể quay lại trang chủ tiếng Việt để xem các mục hướng dẫn hiện có.',
+      'Trang quý vị tìm không tồn tại hoặc đã đổi địa chỉ. Quý vị có thể tìm dịch vụ, bài viết và thông tin liên hệ tại trang chủ.',
     backHomeLabel: 'Quay lại trang chủ',
-    readSourceLabel: 'Mở danh mục bài viết bằng ngôn ngữ gốc',
+    readSourceLabel: 'Bài viết bằng ngôn ngữ khác',
     home: {
       heroScrollLabel: 'Cuộn xuống',
       heroColumnsCtaLabel: 'Xem bài viết',
       servicesDetailLabel: 'Xem chi tiết',
       servicesAssistanceBefore:
-        'Nếu quý vị chưa rõ vụ việc của mình thuộc nhóm nào, trang ',
-      servicesAssistanceLinkLabel: 'Liên hệ',
+        'Quý vị có thể ',
+      servicesAssistanceLinkLabel: 'gửi yêu cầu tư vấn',
       servicesAssistanceAfter:
-        ' hướng dẫn cách viết phần tóm tắt để luật sư xem xét.',
+        ' để văn phòng xem xét phạm vi hỗ trợ phù hợp với vụ việc.',
       columnsViewAllLabel: 'Xem tất cả bài viết',
       columnsReadMoreLabel: 'Đọc tiếp',
-      columnsReviewLabel: 'Luật sư Wei Tseng rà soát',
+      columnsReviewLabel: 'Pháp luật Đài Loan',
       columnsOriginalLanguageBadge: 'Ngôn ngữ gốc',
       columnsOriginalLanguageNote:
-        'Các bài viết dưới đây chưa có bản tiếng Việt. Danh sách giữ nguyên ngôn ngữ gốc và mở ra trang bằng ngôn ngữ đó; nội dung không được dịch tự động.',
+        'Những bài chưa có bản tiếng Việt được ghi rõ ngôn ngữ. Liên kết mở bài gốc; nội dung không được dịch tự động.',
       imageBandAlt:
         'Nhà tam hợp viện truyền thống Đài Loan (三合院) bên cạnh gian nhà hiện đại dưới ánh sáng ban ngày',
       videoPauseLabel: 'Tạm dừng video',
@@ -265,31 +265,31 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
     },
     pages: {
       home: {
-        eyebrow: 'HƯỚNG DẪN',
-        title: 'Dịch vụ pháp lý tại Đài Loan — hướng dẫn bằng tiếng Việt',
+        eyebrow: 'Hovering International Law Firm',
+        title: 'Dịch vụ pháp lý tại Đài Loan',
         description:
-          'Giới thiệu chung bằng tiếng Việt về phạm vi công việc của Hovering International Law Firm tại Đài Loan, ngôn ngữ tư vấn và cách bắt đầu liên hệ.',
+          'Hovering International Law Firm tại Đài Loan: tư vấn doanh nghiệp, tranh chấp, lao động, hôn nhân và gia đình. Thông tin dịch vụ và bài viết bằng tiếng Việt.',
         intro:
-          'Hovering International Law Firm hỗ trợ khách hàng nước ngoài, kể cả những người đang ở Đài Loan, trong các vụ việc theo pháp luật Đài Loan: đầu tư và thành lập doanh nghiệp, tranh chấp dân sự, hôn nhân và gia đình, lao động, hình sự và sở hữu trí tuệ. Phần tiếng Việt này giúp quý vị nắm được công việc nào thuộc phạm vi hỗ trợ, cần chuẩn bị gì và liên hệ ra sao. Đây là thông tin chung, không phải ý kiến pháp lý cho vụ việc riêng của quý vị.',
+          'Hovering International Law Firm hỗ trợ cá nhân và doanh nghiệp nước ngoài về pháp luật Đài Loan: đầu tư, thành lập công ty, tranh chấp dân sự, hôn nhân và gia đình, lao động, hình sự và sở hữu trí tuệ.',
         sections: [
           {
-            heading: 'Văn phòng hỗ trợ những gì',
+            heading: 'Văn phòng luật sư tại Đài Loan',
             paragraphs: [
-              'Hovering International Law Firm là văn phòng luật sư có trụ sở tại Đài Loan, hành nghề theo pháp luật Đài Loan và có các văn phòng tại Đài Bắc (臺北), Cao Hùng (高雄), Đài Trung (臺中) và Bình Đông (屏東). Văn phòng nhận cả công việc tư vấn cho doanh nghiệp lẫn các vụ việc tranh tụng, và hỗ trợ khách hàng nước ngoài trong những thủ tục cần thực hiện tại Đài Loan.',
-              'Toàn bộ nội dung ở đây mang tính tham khảo chung. Kết luận của một vụ việc phụ thuộc vào tình tiết cụ thể, quy định được áp dụng và thời điểm phát sinh, nên phần hướng dẫn này không thay thế cho việc trao đổi trực tiếp với luật sư về hồ sơ của quý vị.',
+              'Văn phòng có mặt tại Đài Bắc (臺北), Cao Hùng (高雄), Đài Trung (臺中) và Bình Đông (屏東), với công việc từ tư vấn doanh nghiệp đến tranh tụng và thủ tục dành cho khách hàng nước ngoài.',
+              'Luật sư xem xét tình tiết, tài liệu và thời điểm phát sinh để đưa ra ý kiến cho từng vụ việc. Các bài viết trên website cung cấp thông tin tham khảo chung.',
             ],
           },
           {
-            heading: 'Ngôn ngữ của trang và ngôn ngữ tư vấn là hai việc khác nhau',
+            heading: 'Ngôn ngữ tư vấn',
             paragraphs: [
-              'Trang này được viết bằng tiếng Việt, nhưng việc tư vấn thực tế với luật sư chỉ được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn. Đọc được hướng dẫn bằng tiếng Việt không có nghĩa là buổi trao đổi với luật sư sẽ diễn ra bằng tiếng Việt.',
-              'Chúng tôi không cam kết bố trí phiên dịch, không cam kết trả lời trong một khoảng thời gian nhất định và không xác nhận lịch hẹn qua trang này. Nếu quý vị không sử dụng được cả bốn ngôn ngữ nêu trên, phần “Liên hệ” giải thích cách chúng tôi xác nhận phương thức trao đổi.',
+              'Website có nội dung bằng tiếng Việt. Luật sư tư vấn bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn; hiện chưa có dịch vụ tư vấn bằng tiếng Việt.',
+              'Nếu quý vị cần trao đổi bằng ngôn ngữ khác, mục “Liên hệ” có lựa chọn để xác nhận cách trao đổi. Văn phòng không cam kết bố trí phiên dịch hay thời gian phản hồi; lịch hẹn cần được xác nhận riêng.',
             ],
           },
           {
-            heading: 'Những lĩnh vực công việc mà văn phòng nhận xử lý',
+            heading: 'Lĩnh vực pháp lý',
             paragraphs: [
-              'Phạm vi công việc của văn phòng gồm sáu lĩnh vực dưới đây. Trang “Lĩnh vực dịch vụ” trình bày chi tiết hơn từng lĩnh vực và nêu rõ những điều không được bảo đảm.',
+              'Văn phòng nhận các nhóm việc dưới đây. Phạm vi xử lý cụ thể được xác định sau khi xem xét nội dung quý vị gửi.',
             ],
             items: [
               'Đầu tư và thành lập doanh nghiệp tại Đài Loan',
@@ -301,21 +301,21 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
             ],
           },
           {
-            heading: 'Nên bắt đầu như thế nào',
+            heading: 'Trao đổi về vụ việc của quý vị',
             paragraphs: [
-              'Quý vị nên đọc trang “Lĩnh vực dịch vụ” để xem vụ việc của mình có nằm trong phạm vi công việc hay không, sau đó xem trang “Phạm vi và chi phí” cùng trang “Liên hệ” để biết cách xác định phạm vi và xác nhận phí trước khi công việc bắt đầu.',
-              'Khi gửi yêu cầu, quý vị có thể viết tóm tắt bằng ngôn ngữ của mình. Phần nội dung gốc được giữ nguyên như quý vị đã viết và không được dịch tự động. Một yêu cầu đã gửi là yêu cầu đang chờ xem xét: việc gửi yêu cầu chưa phải là buổi tư vấn đã diễn ra, cũng chưa phải lịch hẹn đã được xác nhận.',
+              'Một bản tóm tắt về diễn biến, điều quý vị cần hỗ trợ và thời hạn liên quan là cơ sở để văn phòng xem xét yêu cầu. Phạm vi công việc và chi phí được trao đổi trước khi bắt đầu.',
+              'Quý vị có thể viết bằng ngôn ngữ của mình. Nội dung được giữ nguyên, không dịch tự động. Yêu cầu sau khi gửi sẽ chờ xem xét; buổi tư vấn và lịch hẹn cần được xác nhận riêng.',
             ],
           },
         ],
       },
       services: {
-        eyebrow: 'LĨNH VỰC DỊCH VỤ',
-        title: 'Các lĩnh vực mà văn phòng nhận xử lý',
+        eyebrow: 'Dịch vụ pháp lý',
+        title: 'Dịch vụ pháp lý cho cá nhân và doanh nghiệp',
         description:
-          'Sáu lĩnh vực công việc thuộc phạm vi dịch vụ của văn phòng tại Đài Loan, cùng những giới hạn cần biết trước khi liên hệ.',
+          'Dịch vụ pháp lý tại Đài Loan về đầu tư, doanh nghiệp, dân sự, lao động, hôn nhân và gia đình, hình sự, sở hữu trí tuệ.',
         intro:
-          'Dưới đây là các lĩnh vực công việc mà văn phòng thực tế nhận xử lý, kèm những điểm thường được hỏi ở giai đoạn đầu. Phần mô tả này giúp quý vị xác định vụ việc của mình có thuộc phạm vi hỗ trợ hay không; đây là thông tin chung, không phải phân tích pháp lý cho một hồ sơ cụ thể.',
+          'Văn phòng tư vấn, chuẩn bị hồ sơ và giải quyết tranh chấp theo pháp luật Đài Loan. Phạm vi công việc được xác định riêng theo yêu cầu và tài liệu của từng khách hàng.',
         sections: [
           {
             heading: 'Đầu tư và thành lập doanh nghiệp tại Đài Loan',
@@ -328,53 +328,53 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
             heading: 'Tranh chấp dân sự và yêu cầu bồi thường',
             paragraphs: [
               'Nhóm này gồm tranh chấp hợp đồng, yêu cầu bồi thường thiệt hại ngoài hợp đồng và tranh chấp tiêu dùng. Công việc thường bắt đầu bằng việc sắp xếp lại diễn biến sự việc, xác định tài liệu và chứng cứ đang có, rồi mới bàn đến phương án xử lý.',
-              'Thời hạn (kể cả thời hiệu khởi kiện) và mức độ đầy đủ của chứng cứ ảnh hưởng lớn đến cách tiến hành một vụ việc dân sự, vì vậy quý vị nên nêu sớm các mốc thời gian mà mình biết. Nếu quý vị còn giữ hợp đồng, tin nhắn trao đổi, chứng từ thanh toán hay ảnh chụp hiện trường, hãy nói rõ ngay từ đầu.',
+              'Thời hạn, kể cả thời hiệu khởi kiện, và chứng cứ hiện có ảnh hưởng đến phương án xử lý. Các mốc thời gian cùng hợp đồng, tin nhắn, chứng từ thanh toán hoặc ảnh hiện trường là cơ sở để luật sư đánh giá vụ việc.',
             ],
           },
           {
             heading: 'Hôn nhân, gia đình và thừa kế',
             paragraphs: [
-              'Văn phòng nhận các vụ việc về ly hôn (離婚), phân chia tài sản, việc thực hiện quyền và gánh vác nghĩa vụ đối với con chưa thành niên (未成年子女權利義務之行使或負擔), thăm nom con (會面交往) và thừa kế (繼承), kể cả khi các bên hoặc tài sản ở nhiều quốc gia khác nhau. Những vụ việc có yếu tố nước ngoài thường cần xem xét thêm về giấy tờ đăng ký hộ khẩu (戶籍), hình thức văn bản và cách chứng minh tại Đài Loan.',
-              'Vì các vấn đề gia đình thường đi kèm thời hạn và nhiều thủ tục song song, phần tóm tắt ban đầu nên nêu rõ quan hệ giữa các bên, nơi cư trú hiện tại và những thủ tục đã hoặc đang tiến hành.',
+              'Văn phòng nhận các vụ việc về ly hôn (離婚), phân chia tài sản, quyền và nghĩa vụ đối với con chưa thành niên (未成年子女權利義務之行使或負擔), thăm nom con (會面交往) và thừa kế (繼承), kể cả khi các bên hoặc tài sản ở nhiều quốc gia. Hồ sơ có yếu tố nước ngoài có thể cần xem xét thêm giấy tờ hộ tịch, hộ khẩu (戶籍), hình thức văn bản và giá trị chứng minh tại Đài Loan.',
+              'Quan hệ giữa các bên, nơi cư trú hiện tại và những thủ tục đã hoặc đang tiến hành giúp luật sư xác định các vấn đề cần giải quyết song song và thời hạn liên quan.',
             ],
           },
           {
             heading: 'Tranh chấp lao động và việc làm',
             paragraphs: [
               'Nhóm này gồm chấm dứt hợp đồng lao động (勞動契約), trợ cấp thôi việc theo pháp luật Đài Loan (資遣費; không đồng nhất với khoản trợ cấp thôi việc theo pháp luật nước khác), tiền lương và các tranh chấp phát sinh từ điều khoản của hợp đồng lao động, cho cả phía người lao động và phía người sử dụng lao động. Khi xem xét, chúng tôi tách bạch căn cứ chấm dứt quan hệ lao động với các vấn đề về thông báo, khoản phải trả và thời hạn.',
-              'Hợp đồng lao động, nội quy lao động (工作規則), bảng lương và trao đổi giữa hai bên thường là tài liệu quyết định. Nếu quý vị còn giữ những tài liệu này, hãy nêu trong phần tóm tắt để việc xem xét ban đầu chính xác hơn.',
+              'Hợp đồng lao động, nội quy lao động (工作規則), bảng lương và trao đổi giữa hai bên giúp làm rõ thỏa thuận cũng như diễn biến thực tế. Quý vị có thể nêu những tài liệu mình đang giữ trong phần tóm tắt ban đầu.',
             ],
           },
           {
             heading: 'Vụ việc hình sự',
             paragraphs: [
               'Văn phòng hỗ trợ ở giai đoạn điều tra và giai đoạn xét xử, cho cả người bị tình nghi hoặc bị cáo và người bị hại, cũng như đánh giá rủi ro hình sự phát sinh trong hoạt động kinh doanh.',
-              'Vụ việc hình sự thường có thời hạn ngắn và các mốc thủ tục cố định, vì vậy nếu quý vị đã nhận được giấy tờ của cơ quan có thẩm quyền, hãy nêu ngày ghi trên giấy tờ đó ngay khi liên hệ để nội dung được xem xét theo đúng trình tự.',
+              'Giấy triệu tập hoặc thông báo của cơ quan có thẩm quyền có thể kèm thời hạn cần tuân thủ. Ngày nhận và ngày ghi trên giấy tờ giúp luật sư xác định giai đoạn tố tụng và thời gian còn lại.',
             ],
           },
           {
             heading: 'Sở hữu trí tuệ',
             paragraphs: [
               'Văn phòng hỗ trợ đăng ký nhãn hiệu (商標) và sáng chế (專利), các vấn đề về quyền tác giả, cũng như tranh chấp liên quan đến các quyền này tại Đài Loan.',
-              'Với nhóm việc này, thứ tự thực hiện rất quan trọng: phạm vi bảo hộ, thời điểm nộp đơn và tình trạng sử dụng trên thực tế đều ảnh hưởng đến phương án. Việc nộp đơn không tự nó bảo đảm được cấp văn bằng bảo hộ.',
+              'Phạm vi bảo hộ, thời điểm nộp đơn và tình trạng sử dụng thực tế ảnh hưởng đến phương án đăng ký hoặc xử lý tranh chấp. Việc nộp đơn không bảo đảm sẽ được cấp văn bằng bảo hộ.',
             ],
           },
           {
             heading: 'Phạm vi và cách xác nhận',
             paragraphs: [
               'Văn phòng làm việc theo pháp luật Đài Loan và nhận những vụ việc thuộc các nhóm nêu trên. Phạm vi cụ thể của từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi.',
-              'Tư cách cư trú, giấy phép làm việc và những vấn đề tương tự được xem xét trên cơ sở hồ sơ và tình tiết của từng người, chứ không suy ra từ quốc tịch. Nếu vụ việc có phần liên quan đến các nội dung này, quý vị nên nêu rõ khi liên hệ để luật sư xác định đúng nhóm việc; trang này không cam kết kết quả hay thời gian phản hồi.',
+              'Tư cách cư trú và giấy phép làm việc phụ thuộc vào hồ sơ, tình tiết của từng người, không chỉ vào quốc tịch. Nếu có vấn đề liên quan, quý vị có thể nêu trong yêu cầu để luật sư xem xét cùng vụ việc chính. Văn phòng không cam kết kết quả hay thời gian phản hồi.',
             ],
           },
         ],
       },
       about: {
-        eyebrow: 'VỀ VĂN PHÒNG',
+        eyebrow: 'Về văn phòng',
         title: 'Về Hovering International Law Firm',
         description:
           'Thông tin cơ bản về văn phòng luật sư tại Đài Loan, các văn phòng và công việc có yếu tố nước ngoài.',
         intro:
-          'Hovering International Law Firm là văn phòng luật sư tại Đài Loan với đội ngũ luật sư làm việc ở nhiều lĩnh vực khác nhau, từ tư vấn doanh nghiệp đến tranh tụng. Phần này giới thiệu quá trình hình thành, các văn phòng và mảng công việc có yếu tố nước ngoài của văn phòng.',
+          'Hovering International Law Firm (昊鼎國際法律事務所) tư vấn doanh nghiệp và giải quyết tranh chấp tại Đài Loan. Đội ngũ hỗ trợ cả khách hàng trong nước lẫn khách hàng nước ngoài có công việc pháp lý tại Đài Loan.',
         sections: [
           {
             heading: 'Thành lập và cơ cấu',
@@ -388,20 +388,20 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
             heading: 'Công việc có yếu tố nước ngoài',
             paragraphs: [
               'Công việc có yếu tố nước ngoài của văn phòng gồm thành lập công ty, hồ sơ thị thực, đăng ký nhãn hiệu và sáng chế, đánh giá rủi ro pháp lý và tư vấn thuế doanh nghiệp. Văn phòng Đài Trung chuyên trách các vụ việc về xây dựng, sở hữu trí tuệ và các công việc liên quan đến Hàn Quốc, Nhật Bản. Luật sư Wei Tseng (曾雋崴) phụ trách khách hàng Hàn Quốc, Nhật Bản và khách hàng quốc tế khác trong các nhóm việc nêu trên.',
-              'Việc chúng tôi có thể tiếp nhận một vụ việc hay không phụ thuộc vào nội dung vụ việc và ngôn ngữ trao đổi. Nếu vụ việc của quý vị thuộc các lĩnh vực công việc nêu trên và có thể trao đổi bằng một trong bốn ngôn ngữ tư vấn, quý vị có thể gửi tóm tắt để luật sư xem xét.',
+              'Nội dung vụ việc và ngôn ngữ trao đổi là những yếu tố văn phòng xem xét khi tiếp nhận yêu cầu. Phạm vi hỗ trợ được xác nhận riêng với quý vị.',
             ],
           },
           {
-            heading: 'Khi quý vị liên hệ với văn phòng',
+            heading: 'Cách làm việc',
             paragraphs: [
               'Sau khi nhận được tóm tắt của quý vị, luật sư sẽ xem xét nội dung rồi trao đổi về phạm vi công việc có thể thực hiện, tài liệu cần bổ sung và các bước tiếp theo. Với những vụ việc phát sinh vấn đề kế toán hoặc thuế, văn phòng có thể phối hợp cùng bộ phận kế toán để xử lý trong cùng một quy trình.',
-              'Kết quả của mỗi vụ việc phụ thuộc vào tình tiết và hồ sơ cụ thể, nên chúng tôi không đưa ra cam kết về kết quả. Khi quý vị cần một câu trả lời chắc chắn cho trường hợp của mình, hồ sơ đó phải được trao đổi trực tiếp với luật sư bằng một trong bốn ngôn ngữ tư vấn.',
+              'Ý kiến cho từng vụ việc cần dựa trên hồ sơ và trao đổi trực tiếp với luật sư bằng một trong bốn ngôn ngữ tư vấn. Kết quả còn phụ thuộc vào tình tiết và quá trình giải quyết; văn phòng không cam kết kết quả.',
             ],
           },
         ],
       },
       lawyers: {
-        eyebrow: 'LUẬT SƯ',
+        eyebrow: 'Luật sư và đội ngũ',
         title: 'Luật sư Wei Tseng và đội ngũ',
         description: 'Đội ngũ do luật sư Wei Tseng phụ trách xử lý các vấn đề pháp luật Đài Loan và vụ việc giữa Hàn Quốc và Đài Loan.',
         // WO-O33: `/en/lawyers` is header -> roster -> key facts. The three
@@ -413,18 +413,18 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
         sections: [],
       },
       pricing: {
-        eyebrow: 'PHẠM VI VÀ CHI PHÍ',
-        title: 'Cách xác định phạm vi công việc và chi phí',
+        eyebrow: 'Phạm vi và chi phí',
+        title: 'Chi phí được trao đổi trước khi bắt đầu',
         description:
-          'Giải thích trình tự xác định phạm vi công việc, xác nhận phí và lý do trang này không công bố bảng giá.',
+          'Cách Hovering International Law Firm xác định phạm vi công việc, phí tư vấn, thù lao luật sư và các khoản chi phí liên quan.',
         intro:
-          'Trang này giải thích cách chi phí được xác định, chứ không nêu con số. Mức phí phụ thuộc vào phạm vi công việc của từng vụ việc và chỉ có ý nghĩa sau khi phạm vi đó được xác định rõ.',
+          'Mức phí phụ thuộc vào công việc quý vị cần thực hiện. Văn phòng trao đổi về phạm vi, cách tính phí và mức phí để quý vị cân nhắc trước khi quyết định sử dụng dịch vụ.',
         sections: [
           {
-            heading: 'Trước tiên là xác định phạm vi công việc',
+            heading: 'Phạm vi công việc',
             paragraphs: [
-              'Cùng một loại vụ việc vẫn có thể khác nhau rất nhiều về khối lượng công việc, tùy vào số bên liên quan, tài liệu hiện có, thời hạn phải tuân thủ và việc thủ tục đã bắt đầu hay chưa. Vì vậy, bước đầu tiên luôn là làm rõ công việc cần thực hiện gồm những gì và không gồm những gì.',
-              'Phần tóm tắt quý vị gửi ở bước đầu chính là cơ sở cho việc xác định phạm vi này. Tóm tắt càng rõ về diễn biến, mong muốn và thời hạn thì việc xác định phạm vi càng chính xác.',
+              'Khối lượng công việc thay đổi theo số bên liên quan, tài liệu hiện có, thời hạn và giai đoạn của thủ tục. Phạm vi dịch vụ vì vậy cần nêu rõ phần việc văn phòng sẽ thực hiện và phần việc nằm ngoài thỏa thuận.',
+              'Phần tóm tắt về diễn biến, yêu cầu và thời hạn là cơ sở ban đầu để xác định phạm vi. Luật sư có thể cần thêm tài liệu trước khi báo phí.',
             ],
           },
           {
@@ -437,73 +437,73 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
           {
             heading: 'Buổi tư vấn có thể là dịch vụ có thu phí',
             paragraphs: [
-              'Buổi tư vấn với luật sư có thể là dịch vụ có thu phí. Trang này không tuyên bố rằng buổi tư vấn đầu tiên là miễn phí, và quý vị không nên hiểu bất kỳ nội dung nào ở đây theo nghĩa đó.',
+              'Buổi tư vấn với luật sư, kể cả buổi đầu tiên, có thể là dịch vụ có thu phí.',
               'Nếu buổi tư vấn có thu phí, mức phí và cách thanh toán được nêu rõ trước khi buổi tư vấn diễn ra.',
             ],
           },
           {
             heading: 'Vì sao trang này không đăng bảng giá',
             paragraphs: [
-              'Chi phí phụ thuộc vào từng vụ việc: khối lượng công việc cần thực hiện, số bên liên quan, tài liệu hiện có, thời hạn phải tuân thủ và việc thủ tục đã bắt đầu hay chưa. Một con số đăng sẵn sẽ không nói lên chi phí cho hồ sơ của quý vị, nên thay vì đăng bảng giá, chúng tôi xác định phạm vi công việc cho từng vụ việc rồi báo mức phí tương ứng để quý vị cân nhắc trước khi công việc bắt đầu.',
+              'Cùng một nhóm việc có thể cần những dịch vụ khác nhau: tư vấn riêng một vấn đề, chuẩn bị hồ sơ hoặc đại diện trong quá trình tố tụng. Văn phòng báo phí theo phạm vi đã trao đổi thay vì áp dụng một mức giá chung cho mọi hồ sơ.',
               'Ngoài thù lao luật sư, một vụ việc còn có thể phát sinh các khoản phải nộp cho tòa án, cơ quan nhà nước hoặc bên thứ ba. Những khoản này tách biệt với thù lao luật sư và phụ thuộc vào từng thủ tục cụ thể.',
             ],
           },
         ],
       },
       contact: {
-        eyebrow: 'LIÊN HỆ',
-        title: 'Cách liên hệ với văn phòng',
+        eyebrow: 'Liên hệ',
+        title: 'Trao đổi về vụ việc của quý vị',
         description:
-          'Ngôn ngữ của trang, ngôn ngữ tư vấn, cách xử lý khi quý vị không dùng được bốn ngôn ngữ đó, và những điều không được bảo đảm.',
+          'Gửi yêu cầu tư vấn cho Hovering International Law Firm tại Đài Loan. Thông tin về ngôn ngữ trao đổi, tài liệu ban đầu và cách tiếp nhận yêu cầu.',
         intro:
-          'Trước khi liên hệ, xin lưu ý ba điều tách biệt dưới đây. Ba điều này dễ bị nhầm lẫn với nhau, nhưng mỗi điều có ý nghĩa riêng.',
+          'Quý vị có thể gửi một bản tóm tắt về vụ việc, điều cần hỗ trợ và thời hạn liên quan. Văn phòng xem xét nội dung trước khi trao đổi về phạm vi công việc và chi phí.',
         sections: [
           {
-            heading: 'Ba điều cần phân biệt',
+            heading: 'Ngôn ngữ trao đổi',
             paragraphs: [
-              'Ngôn ngữ của trang, ngôn ngữ tư vấn với luật sư và ngôn ngữ quý vị dùng để viết tin nhắn là ba việc độc lập với nhau.',
+              'Quý vị có thể đọc website và viết yêu cầu bằng tiếng Việt. Ngôn ngữ sử dụng trong buổi tư vấn cần được xác nhận theo các lựa chọn dưới đây.',
             ],
             items: [
-              'Ngôn ngữ của trang: phần hướng dẫn này được viết bằng tiếng Việt.',
-              'Ngôn ngữ tư vấn: việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
-              'Ngôn ngữ quý vị viết: quý vị có thể viết tóm tắt bằng ngôn ngữ của mình, và nội dung gốc được giữ nguyên.',
+              'Nội dung website: tiếng Việt.',
+              'Tư vấn với luật sư: tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
+              'Nội dung yêu cầu: quý vị có thể viết bằng ngôn ngữ của mình; văn bản gốc được giữ nguyên.',
             ],
           },
           {
-            heading: 'Nếu quý vị không dùng được cả bốn ngôn ngữ tư vấn',
+            heading: 'Khi cần trao đổi bằng ngôn ngữ khác',
             paragraphs: [
-              'Trong biểu mẫu liên hệ, quý vị có thể chọn mục “Cần xác nhận cách liên hệ”. Văn phòng sẽ dùng thư trả lời để xác nhận phương thức trao đổi, nếu có phương thức khả thi; đây không phải cam kết rằng sẽ có cách trao đổi phù hợp, cũng không phải cam kết về thời gian phản hồi.',
-              'Đây chỉ là bước xác nhận, không phải lời hứa. Chúng tôi không cam kết bố trí phiên dịch, không cam kết hỗ trợ bằng tiếng Việt hay bất kỳ ngôn ngữ nào ngoài bốn ngôn ngữ nêu trên, và không cam kết rằng mọi vụ việc đều có thể tiếp nhận.',
+              'Mục “Cần xác nhận cách liên hệ” dành cho quý vị không thể trao đổi bằng ngôn ngữ nào trong bốn ngôn ngữ tư vấn. Văn phòng trao đổi qua email để xác nhận phương thức khả thi, nếu có; không cam kết thời gian phản hồi.',
+              'Lựa chọn này là yêu cầu xác nhận, không phải lời hứa cung cấp dịch vụ bằng ngôn ngữ khác hoặc bố trí phiên dịch. Không phải mọi vụ việc đều có thể tiếp nhận.',
             ],
           },
           {
-            heading: 'Nên viết gì trong tin nhắn đầu tiên',
+            heading: 'Thông tin cho lần liên hệ đầu tiên',
             paragraphs: [
-              'Nên nêu: chuyện gì đã xảy ra, quý vị muốn được hỗ trợ điều gì, vụ việc liên quan đến Đài Loan như thế nào, và thời hạn nếu quý vị đã biết. Nếu đã nhận được giấy tờ của tòa án hay cơ quan nhà nước, hãy nêu ngày ghi trên giấy tờ đó.',
-              'Chưa cần gửi số hộ chiếu, số giấy tờ tùy thân, thông tin tài khoản ngân hàng, hồ sơ y tế hay toàn bộ tập chứng cứ ở bước đầu. Hãy chờ hướng dẫn của luật sư rồi gửi tài liệu nhạy cảm theo cách an toàn.',
+              'Diễn biến chính, yêu cầu của quý vị, mối liên hệ với Đài Loan và thời hạn đã biết giúp luật sư xem xét yêu cầu. Nếu có giấy tờ của tòa án hoặc cơ quan nhà nước, ngày ghi trên giấy tờ cũng là thông tin cần thiết.',
+              'Ở bước đầu, quý vị chưa cần gửi số hộ chiếu, số giấy tờ tùy thân, thông tin tài khoản ngân hàng, hồ sơ y tế hay toàn bộ chứng cứ. Tài liệu nhạy cảm chỉ nên gửi theo hướng dẫn riêng của luật sư.',
             ],
           },
           {
-            heading: 'Những điều trang này không bảo đảm',
+            heading: 'Sau khi gửi yêu cầu',
             paragraphs: [
-              'Chúng tôi không cam kết thời gian phản hồi, không xác nhận lịch hẹn qua trang này, không cam kết một luật sư nhất định sẽ phụ trách vụ việc và không bố trí phiên dịch. Việc dịch văn bản là một việc khác: tin nhắn quý vị gửi không được dịch tự động.',
-              'Khi quý vị gửi yêu cầu, nội dung được lưu lại và chờ xem xét. Nếu sau một thời gian quý vị chưa nhận được phản hồi, quý vị có thể gửi lại qua địa chỉ thư điện tử được nêu trên trang liên hệ.',
+              'Biểu mẫu tiếp nhận nội dung để xem xét, chưa xác nhận lịch hẹn hoặc luật sư phụ trách. Văn phòng không cam kết thời gian phản hồi hay bố trí phiên dịch. Tin nhắn được giữ nguyên và không được dịch tự động.',
+              'Sau khi yêu cầu được lưu, quý vị nhận được mã tiếp nhận. Nếu chưa nhận được phản hồi, quý vị có thể liên hệ lại qua email và cung cấp mã này.',
             ],
           },
         ],
       },
       faq: {
-        eyebrow: 'CÂU HỎI THƯỜNG GẶP',
+        eyebrow: 'Hỏi đáp',
         title: 'Câu hỏi thường gặp',
         description:
-          'Giải đáp về phạm vi công việc, cách chuẩn bị, ngôn ngữ, chi phí và ý nghĩa của việc gửi yêu cầu.',
+          'Câu hỏi thường gặp về dịch vụ pháp lý tại Đài Loan, ngôn ngữ tư vấn, phí và cách gửi yêu cầu đến Hovering International Law Firm.',
         intro:
-          'Những câu hỏi dưới đây được trả lời ở mức thông tin chung. Câu trả lời cho vụ việc cụ thể của quý vị chỉ có thể được đưa ra sau khi luật sư xem xét hồ sơ.',
+          'Buổi tư vấn, ngôn ngữ trao đổi và phạm vi công việc được xác nhận riêng sau khi văn phòng xem xét yêu cầu. Gửi biểu mẫu là bước liên hệ ban đầu.',
         sections: [
           {
-            heading: 'Cách sử dụng phần này',
+            heading: 'Với một vụ việc cụ thể',
             paragraphs: [
-              'Nếu quý vị không tìm thấy câu trả lời cho tình huống của mình, đó thường là dấu hiệu cho thấy câu trả lời phụ thuộc vào tình tiết cụ thể. Trong trường hợp đó, hãy nêu tình tiết trong phần tóm tắt khi liên hệ, thay vì suy đoán từ nội dung ở đây.',
+              'Câu trả lời pháp lý phụ thuộc vào tình tiết, tài liệu và thời hạn của từng hồ sơ. Phần hỏi đáp dưới đây cung cấp thông tin về cách làm việc của văn phòng; luật sư cần xem xét hồ sơ để tư vấn cho trường hợp của quý vị.',
             ],
           },
         ],
@@ -516,17 +516,17 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
           {
             question: 'Tôi nên chuẩn bị gì trước khi liên hệ?',
             answer:
-              'Hãy chuẩn bị một bản tóm tắt ngắn về diễn biến sự việc, điều quý vị mong muốn, mối liên hệ của vụ việc với Đài Loan và thời hạn nếu có. Nếu đã có giấy tờ của tòa án hoặc cơ quan nhà nước, hãy nêu ngày ghi trên giấy tờ. Chưa cần gửi giấy tờ tùy thân hay toàn bộ chứng cứ ở bước này.',
+              'Một bản tóm tắt về diễn biến, điều quý vị cần hỗ trợ, mối liên hệ với Đài Loan và thời hạn đã biết là đủ để bắt đầu. Ngày ghi trên giấy tờ của tòa án hoặc cơ quan nhà nước cũng cần được nêu rõ. Chưa cần gửi giấy tờ tùy thân hay toàn bộ chứng cứ.',
           },
           {
             question: 'Tôi có thể được tư vấn bằng tiếng Việt không?',
             answer:
-              'Không. Phần hướng dẫn này được viết bằng tiếng Việt, nhưng việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn. Chúng tôi cũng không cam kết bố trí phiên dịch. Việc dịch văn bản là một việc khác: nội dung gốc quý vị viết được lưu giữ nguyên văn và không được dịch tự động.',
+              'Hiện luật sư tư vấn bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn, chưa có dịch vụ tư vấn bằng tiếng Việt. Văn phòng không cam kết bố trí phiên dịch. Quý vị vẫn có thể viết yêu cầu bằng tiếng Việt; nội dung được giữ nguyên và không được dịch tự động.',
           },
           {
-            question: 'Nếu tôi không dùng được cả bốn ngôn ngữ đó thì sao?',
+            question: 'Nếu tôi không dùng được ngôn ngữ nào trong bốn ngôn ngữ đó thì sao?',
             answer:
-              'Quý vị hãy chọn mục “Cần xác nhận cách liên hệ” khi gửi yêu cầu. Văn phòng sẽ dùng thư trả lời để xác nhận phương thức trao đổi, nếu có phương thức khả thi. Đây là bước xác nhận, không phải cam kết rằng chúng tôi có thể hỗ trợ bằng ngôn ngữ khác.',
+              'Biểu mẫu có mục “Cần xác nhận cách liên hệ”. Văn phòng sẽ trao đổi qua email để xác nhận phương thức khả thi, nếu có. Lựa chọn này không bảo đảm dịch vụ bằng ngôn ngữ khác.',
           },
           {
             question: 'Nội dung tôi viết bằng tiếng Việt sẽ được xử lý ra sao?',
@@ -536,27 +536,27 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
           {
             question: 'Gửi yêu cầu xong có nghĩa là tôi đã được tư vấn chưa?',
             answer:
-              'Chưa. Yêu cầu đã gửi là yêu cầu đang chờ luật sư xem xét. Đó không phải ý kiến pháp lý, không phải lịch hẹn đã xác nhận, và bản thân việc gửi yêu cầu không tạo lập quan hệ giữa luật sư và khách hàng.',
+              'Chưa. Nội dung được lưu để chờ xem xét. Việc gửi yêu cầu không phải ý kiến pháp lý hay lịch hẹn đã xác nhận, và chưa làm phát sinh quan hệ luật sư – khách hàng.',
           },
           {
             question: 'Chi phí được tính như thế nào?',
             answer:
-              'Phạm vi công việc được xác định trước, sau đó mức phí và cách tính phí được xác nhận với quý vị trước khi công việc bắt đầu. Trang này không công bố con số cụ thể và không tuyên bố rằng buổi tư vấn đầu tiên là miễn phí.',
+              'Mức phí và cách tính phí được trao đổi theo phạm vi công việc, rồi xác nhận với quý vị trước khi bắt đầu. Buổi tư vấn đầu tiên có thể có thu phí; website không áp dụng một bảng giá chung cho mọi vụ việc.',
           },
           {
             question: 'Việc của tôi rất gấp thì phải làm sao?',
             answer:
-              'Hãy nêu rõ thời hạn hoặc ngày ghi trên giấy tờ ngay ở phần đầu của tóm tắt, để luật sư thấy các mốc thời gian đó khi xem xét. Trang này không có đường dây nóng và không bảo đảm thời gian phản hồi; nếu vụ việc gấp đến mức không thể chờ, quý vị nên đồng thời tìm phương án khác tại nơi mình đang ở.',
+              'Quý vị có thể ghi thời hạn hoặc ngày trên giấy tờ ở đầu phần tóm tắt để luật sư nhận biết khi xem xét. Biểu mẫu không phải đường dây nóng và không bảo đảm thời gian phản hồi. Nếu không thể chờ, quý vị nên đồng thời tìm hỗ trợ tại nơi mình đang ở.',
           },
         ],
       },
       privacy: {
-        eyebrow: 'QUYỀN RIÊNG TƯ',
+        eyebrow: 'Chính sách bảo mật',
         title: 'Thông tin được thu thập qua biểu mẫu liên hệ',
         description:
-          'Những thông tin mà biểu mẫu liên hệ ở phần tiếng Việt thu thập, cách xử lý nội dung gốc và cách quý vị liên hệ về dữ liệu của mình.',
+          'Thông tin được thu thập qua biểu mẫu liên hệ, mục đích sử dụng, nơi lưu trữ và cách yêu cầu xem, sửa hoặc xóa dữ liệu cá nhân.',
         intro:
-          'Phần này chỉ nói về biểu mẫu liên hệ trên các trang hướng dẫn này. Nội dung ở đây mô tả cách thông tin được xử lý, không phải một cam kết kỹ thuật.',
+          'Chính sách này áp dụng cho thông tin quý vị gửi qua biểu mẫu liên hệ. Dữ liệu được dùng để xem xét yêu cầu, liên hệ lại và xác nhận cách trao đổi.',
         sections: [
           {
             heading: 'Những thông tin được thu thập',
@@ -619,15 +619,15 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
         ],
       },
       disclaimer: {
-        eyebrow: 'TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM',
+        eyebrow: 'Thông tin pháp lý',
         title: 'Phạm vi và giới hạn của thông tin trên trang này',
         description:
           'Tính chất của thông tin chung, phạm vi pháp luật áp dụng, và điều kiện để quan hệ luật sư – khách hàng được hình thành.',
         intro:
-          'Phần này nêu rõ những gì các trang hướng dẫn tiếng Việt có thể và không thể làm được cho quý vị.',
+          'Văn phòng tư vấn theo pháp luật Đài Loan. Các bài viết có thể đề cập đến pháp luật của nước khác khi có liên quan; đó là thông tin tham khảo, không mở rộng phạm vi hành nghề của văn phòng.',
         sections: [
           {
-            heading: 'Chỉ là thông tin chung',
+            heading: 'Thông tin tham khảo',
             paragraphs: [
               'Nội dung trên các trang này được viết để cung cấp thông tin chung. Đây không phải ý kiến pháp lý cho vụ việc của quý vị, và không thể thay thế cho việc xem xét hồ sơ cụ thể.',
               'Kết luận của một vụ việc phụ thuộc vào tình tiết, quy định được áp dụng và thời điểm, nên hai tình huống trông giống nhau vẫn có thể dẫn đến kết quả khác nhau.',
@@ -636,8 +636,8 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
           {
             heading: 'Phạm vi pháp luật',
             paragraphs: [
-              'Văn phòng hành nghề theo pháp luật Đài Loan, và các trang này chỉ nói về công việc trong phạm vi đó.',
-              'Nội dung trên các trang này không phải ý kiến pháp lý theo pháp luật của bất kỳ thẩm quyền nào khác ngoài Đài Loan, kể cả pháp luật nơi quý vị cư trú. Nếu vụ việc của quý vị có phần thuộc thẩm quyền của nước khác, chúng tôi sẽ cùng quý vị xác nhận cần chuyên gia có tư cách phù hợp nào cho phần đó.',
+              'Văn phòng hành nghề theo pháp luật Đài Loan. Bài viết về pháp luật của nước khác không có nghĩa là văn phòng cung cấp dịch vụ tư vấn theo pháp luật của nước đó.',
+              'Nội dung về pháp luật nước khác chỉ mang tính tham khảo. Nếu vụ việc có phần cần xử lý theo pháp luật ngoài Đài Loan, phạm vi tư vấn và nhu cầu làm việc với luật sư có tư cách hành nghề phù hợp cần được xác nhận riêng.',
             ],
           },
           {
@@ -657,12 +657,12 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
         ],
       },
       columns: {
-        eyebrow: 'BÀI VIẾT',
+        eyebrow: 'Bài viết',
         title: 'Bài viết về pháp luật Đài Loan',
         description:
-          'Các bài viết bằng tiếng Việt giải thích những chủ đề pháp luật Đài Loan thường gặp. Đây là thông tin chung tại thời điểm đăng, không phải ý kiến pháp lý cho vụ việc của quý vị.',
+          'Bài viết tiếng Việt về lao động, cư trú, gia đình, kinh doanh và tố tụng tại Đài Loan, dành cho người đang sinh sống, học tập và làm việc tại đây.',
         intro:
-          'Văn phòng có đăng các bài viết giải thích những chủ đề pháp luật Đài Loan thường gặp. Những bài đã có bằng tiếng Việt được liệt kê ngay trên trang này; ngoài ra còn có bốn liên kết, mỗi liên kết mở danh mục bài viết của một ngôn ngữ gốc.',
+          'Các bài viết tiếng Việt giải thích những vấn đề pháp lý thường gặp trong công việc, gia đình và kinh doanh tại Đài Loan. Quý vị có thể tìm theo chủ đề hoặc từ khóa.',
         sections: [
           {
             heading: 'Bốn danh mục theo ngôn ngữ',
@@ -682,7 +682,7 @@ export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
             heading: 'Giá trị tham khảo của bài viết',
             paragraphs: [
               'Các bài viết được soạn để cung cấp thông tin chung tại thời điểm đăng. Quy định và cách áp dụng có thể thay đổi, và một bài viết không phản ánh đầy đủ tình tiết trong vụ việc của quý vị.',
-              'Vì vậy, xin đừng dựa vào một bài viết để quyết định hành động trong vụ việc thật. Hãy dùng bài viết để hiểu bối cảnh chung; quyết định trong vụ việc thật cần trao đổi riêng với luật sư về hồ sơ đó, và trang này không phải bước tư vấn.',
+              'Bài viết cung cấp bối cảnh chung, không thay thế bước tư vấn cho hồ sơ cụ thể. Trước khi quyết định cách xử lý vụ việc, quý vị cần trao đổi riêng với luật sư về tình tiết và tài liệu liên quan.',
             ],
           },
         ],
diff --git a/src/data/international-guidance-offices.ts b/src/data/international-guidance-offices.ts
index 82fd6502..5e3d0503 100644
--- a/src/data/international-guidance-offices.ts
+++ b/src/data/international-guidance-offices.ts
@@ -41,7 +41,7 @@ export interface GuidanceOfficeCopy {

 export const guidanceOfficeCopy: Record<GuidanceLocale, GuidanceOfficeCopy> = {
   vi: {
-    label: 'VĂN PHÒNG',
+    label: 'Văn phòng',
     title: 'Văn phòng',
     description: 'Địa chỉ các văn phòng tại Đài Loan của Hovering International Law Firm.',
     officeLabel: 'Văn phòng',
@@ -1192,14 +1192,14 @@ export interface GuidanceFooterCopy {
 export const guidanceFooterCopy: Record<GuidanceLocale, GuidanceFooterCopy> = {
   vi: {
     officeLabel: 'Văn phòng',
-    officeQuickLinksLabel: 'Liên kết nhanh đến các văn phòng',
+    officeQuickLinksLabel: 'Các văn phòng',
     followLabel: 'Theo dõi',
     blogLabel: 'Blog',
     websiteLabel: 'Trang web chính thức',
     sitemapLabel: 'Sơ đồ trang web',
-    copyEmailLabel: 'Sao chép địa chỉ thư điện tử',
-    emailCopiedMessage: 'Đã sao chép địa chỉ thư điện tử.',
-    officialConsultationEmailLabel: 'Thư điện tử tư vấn chính thức',
+    copyEmailLabel: 'Sao chép email',
+    emailCopiedMessage: 'Đã sao chép email.',
+    officialConsultationEmailLabel: 'Email liên hệ tư vấn',
   },
   id: {
     officeLabel: 'Kantor',
diff --git a/src/data/international-guidance-team.ts b/src/data/international-guidance-team.ts
index 9afbcafb..d270c091 100644
--- a/src/data/international-guidance-team.ts
+++ b/src/data/international-guidance-team.ts
@@ -130,20 +130,20 @@ export interface GuidanceTeamCopy {

 export const guidanceTeamCopy: Record<GuidanceLocale, GuidanceTeamCopy> = {
   vi: {
-    label: 'ĐỘI NGŨ CỦA CHÚNG TÔI',
+    label: 'Luật sư và đội ngũ',
     title: TEAM_NAME_BY_LOCALE['vi'],
     description: 'Đội ngũ do luật sư Wei Tseng phụ trách xử lý các vấn đề pháp luật Đài Loan và vụ việc giữa Hàn Quốc và Đài Loan.',
     representativeTitle: 'Luật sư thành viên',
     teamTitle: 'Luật sư và nhân viên',
-    partnerTitle: 'Kế toán sư hợp tác',
+    partnerTitle: 'Kế toán viên hợp tác',
     introLabel: 'Giới thiệu',
     educationLabel: 'Học vấn',
     experienceLabel: 'Kinh nghiệm',
     photoAltPrefix: 'Ảnh',
     workingLanguagesLabel: 'Ngôn ngữ làm việc',
     fullProfileLabel: 'Hồ sơ đầy đủ (tiếng Anh)',
-    keyFactsHeading: 'Luật sư Wei Tseng — Thông tin cơ bản',
-    qualificationLabel: 'Tư cách và nơi công tác',
+    keyFactsHeading: 'Luật sư Wei Tseng',
+    qualificationLabel: 'Tư cách hành nghề',
     qualificationSentence:
       '{name} là luật sư có tư cách hành nghề tại Đài Loan và là luật sư thành viên của {firm}.',
     practiceLabel: 'Lĩnh vực chính',
@@ -152,8 +152,8 @@ export const guidanceTeamCopy: Record<GuidanceLocale, GuidanceTeamCopy> = {
       'tseng-junwei': 'Luật sư thành viên tại Đài Loan',
       'chang-rongxuan': 'Luật sư tại Đài Loan',
       'chang-fangyu': 'Trợ lý pháp lý',
-      'son-jungmin': 'Quản lý nghiệp vụ Hàn Quốc',
-      'huang-shengping': 'Kế toán sư hợp tác (會計師, CPA)',
+      'son-jungmin': 'Quản lý hoạt động văn phòng Hàn Quốc',
+      'huang-shengping': 'Kế toán viên hợp tác (會計師, CPA)',
     },
   },
   id: {
@@ -1874,7 +1874,7 @@ export const guidanceTeamBios: Record<
     'chang-fangyu': {
       intro: [
         'Trợ lý pháp lý cao cấp, nhiều năm hỗ trợ tố tụng, pháp chế doanh nghiệp và các vụ việc đầu tư nước ngoài tại nhiều văn phòng luật.',
-        'Hỗ trợ tố tụng, thành lập công ty, thủ tục chấp thuận đầu tư nước ngoài, xin giấy phép và việc trao đổi giữa Hàn Quốc và Đài Loan.',
+        'Hỗ trợ tố tụng, thành lập công ty, thủ tục chấp thuận đầu tư nước ngoài, xin giấy phép và trao đổi với khách hàng nước ngoài.',
       ],
       education: ['Cử nhân Luật (LL.B.), Tunghai University'],
       experience: [
@@ -1884,7 +1884,7 @@ export const guidanceTeamBios: Record<
     },
     'son-jungmin': {
       intro: [
-        'Điều phối lịch tư vấn và việc liên lạc cho khách hàng Hàn Quốc.',
+        'Điều phối lịch tư vấn và liên lạc qua văn phòng Hàn Quốc.',
         'Hỗ trợ trao đổi giữa các bộ phận bằng hệ thống tài liệu và quy trình công việc, với nền tảng khoa học máy tính.',
       ],
       education: ['Cử nhân (B.S.) Khoa học máy tính, National Cheng Kung University'],
diff --git a/src/data/international-inquiry-copy.ts b/src/data/international-inquiry-copy.ts
index 01edd053..c8f2f873 100644
--- a/src/data/international-inquiry-copy.ts
+++ b/src/data/international-inquiry-copy.ts
@@ -307,44 +307,44 @@ export const internationalInquiryCopy: Record<InquiryCopyLocale, InternationalIn
   },
   vi: {
     guidanceNotice:
-      'Trang này được viết bằng tiếng Việt để cung cấp thông tin hướng dẫn chung, không phải ý kiến pháp lý cho vụ việc cụ thể của quý vị.',
+      'Thông tin trên website mang tính tham khảo, không thay thế ý kiến pháp lý cho vụ việc cụ thể của quý vị.',
     consultationNotice:
-      'Việc tư vấn chỉ được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
+      'Luật sư tư vấn bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
     methodConfirmationNotice:
-      'Nếu quý vị không dùng được ngôn ngữ nào trong bốn ngôn ngữ đó, hãy chọn “Cần xác nhận cách liên hệ”. Văn phòng xác nhận phương thức trao đổi bằng thư trả lời khi có phương thức khả thi; không bảo đảm hỗ trợ bằng ngôn ngữ khác và không cam kết thời gian phản hồi.',
+      'Nếu quý vị không thể trao đổi bằng ngôn ngữ nào trong bốn ngôn ngữ trên, quý vị có thể chọn “Cần xác nhận cách liên hệ”. Văn phòng trao đổi qua email để xác nhận phương thức khả thi, nếu có; không bảo đảm hỗ trợ bằng ngôn ngữ khác hay thời gian phản hồi.',
     preparationNotice:
-      'Quý vị có thể viết tóm tắt vụ việc bằng ngôn ngữ của mình. Phần nội dung gốc quý vị viết được giữ nguyên và không được dịch tự động.',
+      'Quý vị có thể viết yêu cầu bằng tiếng Việt hoặc ngôn ngữ của mình. Nội dung được giữ nguyên, không dịch tự động.',
     heading: 'Gửi yêu cầu tư vấn',
     intro:
-      'Vui lòng mô tả ngắn gọn vụ việc của quý vị. Luật sư sẽ xem xét nội dung trước khi trao đổi về bước tiếp theo.',
+      'Một bản tóm tắt về vụ việc và điều quý vị cần hỗ trợ là cơ sở để luật sư xem xét yêu cầu.',
     submitLabel: 'Gửi yêu cầu',
     submittingLabel: 'Đang gửi…',
     successMessage:
-      'Chúng tôi đã nhận được yêu cầu của quý vị và đang chờ xem xét. Điều này không có nghĩa là buổi tư vấn đã diễn ra hay lịch hẹn đã được xác nhận.',
+      'Yêu cầu của quý vị đã được tiếp nhận và đang chờ xem xét. Buổi tư vấn và lịch hẹn chưa được xác nhận.',
     savedNotificationPendingMessage:
-      'Yêu cầu của quý vị đã được lưu, nhưng chưa xác nhận được thông báo gửi tới văn phòng. Nội dung quý vị viết không bị mất. Nếu chưa nhận được phản hồi, quý vị cũng có thể gửi thư tới địa chỉ thư điện tử trên trang liên hệ.',
+      'Yêu cầu đã được lưu, nhưng hệ thống chưa xác nhận được việc gửi thông báo đến văn phòng. Nội dung của quý vị vẫn được giữ lại. Quý vị có thể liên hệ qua email trên trang này và cung cấp mã tiếp nhận.',
     receiptIdLabel: 'Mã tiếp nhận',
     failureMessage:
-      'Không gửi được yêu cầu của quý vị. Vui lòng thử lại, hoặc gửi tới địa chỉ thư điện tử trên trang liên hệ.',
-    originalLanguageLabel: 'Ngôn ngữ quý vị dùng để viết',
+      'Chưa gửi được yêu cầu. Quý vị có thể thử lại hoặc liên hệ qua email trên trang này.',
+    originalLanguageLabel: 'Ngôn ngữ của nội dung yêu cầu',
     originalLanguagePlaceholder:
-      'Ví dụ: tiếng Việt, tiếng Indonesia, tiếng Thái, tiếng Filipino hoặc ngôn ngữ khác',
-    preferredConsultationLanguageLabel: 'Ngôn ngữ quý vị muốn dùng khi tư vấn',
-    originalTextLabel: 'Tóm tắt vụ việc (bằng ngôn ngữ của quý vị)',
+      'Ví dụ: tiếng Việt',
+    preferredConsultationLanguageLabel: 'Ngôn ngữ mong muốn khi tư vấn',
+    originalTextLabel: 'Tóm tắt vụ việc',
     originalTextPlaceholder:
-      'Hãy cho biết chuyện gì đã xảy ra, quý vị cần hỗ trợ điều gì và thời hạn nếu có. Xin đừng ghi số hộ chiếu, số giấy tờ tùy thân hoặc thông tin tài khoản ngân hàng.',
-    nameLabel: 'Tên',
-    emailLabel: 'Thư điện tử',
+      'Diễn biến chính, điều quý vị cần hỗ trợ, mối liên hệ với Đài Loan và thời hạn đã biết. Không ghi số hộ chiếu, số giấy tờ tùy thân hoặc thông tin tài khoản ngân hàng.',
+    nameLabel: 'Họ và tên',
+    emailLabel: 'Email',
     consentLabel:
-      'Tôi đã đọc chính sách quyền riêng tư và đồng ý gửi yêu cầu này.',
-    privacyLinkLabel: 'Chính sách quyền riêng tư',
-    requiredMessage: 'Mục này là bắt buộc.',
-    invalidEmailMessage: 'Vui lòng nhập địa chỉ thư điện tử hợp lệ.',
+      'Tôi đã đọc chính sách bảo mật và đồng ý gửi yêu cầu này.',
+    privacyLinkLabel: 'Chính sách bảo mật',
+    requiredMessage: 'Thông tin này là bắt buộc.',
+    invalidEmailMessage: 'Địa chỉ email chưa hợp lệ.',
     tooLongMessage: 'Nội dung quá dài. Vui lòng rút ngắn rồi gửi lại.',
     sourceLanguageNotice:
-      'Bài viết này chỉ có bằng {language}, và liên kết sẽ mở trang gốc đó.',
+      'Liên kết mở bài viết gốc bằng {language}.',
     unavailableTranslationNotice:
-      'Bài viết này chưa được dịch sang ngôn ngữ của trang này. Một liên kết có ghi rõ ngôn ngữ gốc sẽ mở bài viết gốc.',
+      'Bài viết chưa có bản tiếng Việt. Ngôn ngữ của bản gốc được ghi bên cạnh liên kết.',
     unavailableLanguageNotice: 'Trang này không được cung cấp bằng {language}.',
     languageOptions: {
       en: 'Tiếng Anh (English)',
@@ -352,7 +352,7 @@ export const internationalInquiryCopy: Record<InquiryCopyLocale, InternationalIn
       ja: 'Tiếng Nhật (日本語)',
       ko: 'Tiếng Hàn (한국어)',
       'needs-method-confirmation':
-        'Không dùng được bốn ngôn ngữ trên — cần xác nhận cách liên hệ',
+        'Cần xác nhận cách liên hệ',
     },
   },
   id: {
diff --git a/src/data/issue-board.ts b/src/data/issue-board.ts
index 0f26f8f8..2e409d1a 100644
--- a/src/data/issue-board.ts
+++ b/src/data/issue-board.ts
@@ -118,25 +118,25 @@ export const issueBoardCopy: Record<IssueBoardLocale, IssueBoardCopy> = {
     dateNote: 'ニュースをきっかけに執筆した記事です。公開日以降に状況や法令が変わっている可能性があります。',
   },
   vi: {
-    label: 'Pháp luật Đài Loan qua tin tức',
-    title: 'Pháp luật Đài Loan qua tin tức',
-    description: 'Các bài viết ngắn bắt đầu từ một tin tức gần đây và giải thích quy định pháp luật Đài Loan liên quan. Mỗi bài phản ánh thông tin tại thời điểm đăng.',
+    label: 'Pháp luật qua tin tức',
+    title: 'Pháp luật qua tin tức',
+    description: 'Tin tức liên quan đến Đài Loan và Việt Nam, cùng các vấn đề pháp lý được đặt ra. Phạm vi tư vấn của văn phòng là pháp luật Đài Loan; thông tin mỗi bài phản ánh thời điểm đăng.',
     expertTab: 'Bài viết',
-    sectionTitle: 'Bài mới nhất cho bạn đọc Việt Nam',
-    teaserTitle: 'Mới nhất: Pháp luật Đài Loan qua tin tức',
-    viewAll: 'Xem tất cả bài theo tin tức',
+    sectionTitle: 'Bài viết mới nhất',
+    teaserTitle: 'Mới nhất: Pháp luật qua tin tức',
+    viewAll: 'Xem tất cả bài viết',
     home: 'Trang chủ',
     columns: 'Bài viết',
-    backLabel: '← Pháp luật Đài Loan qua tin tức',
+    backLabel: '← Pháp luật qua tin tức',
     faqHeading: 'Câu hỏi thường gặp',
     tocLabel: 'Nội dung bài viết',
-    consultationTitle: 'Tư vấn pháp lý',
-    consultationText: 'Nếu bạn có câu hỏi về pháp luật Đài Loan, hãy liên hệ với chúng tôi.',
+    consultationTitle: 'Trao đổi về vụ việc của quý vị',
+    consultationText: 'Quý vị có thể gửi tóm tắt để văn phòng xem xét phạm vi hỗ trợ theo pháp luật Đài Loan.',
     consultationButton: 'Gửi yêu cầu tư vấn',
     relatedTitle: 'Chủ đề liên quan',
     prevLabel: '← Bài trước',
-    nextLabel: 'Bài sau →',
-    dateNote: 'Bài viết dựa trên một tin tức. Tình hình hoặc quy định có thể đã thay đổi sau ngày đăng.',
+    nextLabel: 'Bài tiếp theo →',
+    dateNote: 'Bài viết dựa trên thông tin báo chí. Tình hình và quy định pháp luật có thể đã thay đổi sau ngày đăng.',
   },
 };


diff --git a/src/data/vi-site.ts b/src/data/vi-site.ts
new file mode 100644
index 00000000..2185ea6f
--- /dev/null
+++ b/src/data/vi-site.ts
@@ -0,0 +1,119 @@
+import type { ZhHantMonoIconName } from '@/components/zh-hant-icons/ZhHantMonoIcon';
+
+/** Presentation copy only. People, offices, service detail and disclosures stay in their canonical packs. */
+export const viSiteCopy = {
+  home: {
+    title: 'Dịch vụ pháp lý\ntại Đài Loan.',
+    description: 'Tư vấn và giải quyết tranh chấp cho cá nhân, gia đình và doanh nghiệp theo pháp luật Đài Loan.',
+    audience: 'Thông tin bằng tiếng Việt dành cho quý vị đang làm việc, học tập, sinh sống hoặc kinh doanh tại Đài Loan.',
+    servicesAction: 'Các lĩnh vực hỗ trợ',
+    articlesAction: 'Bài viết pháp luật',
+    issuesAction: 'Pháp luật qua tin tức',
+    teamAction: 'Luật sư và đội ngũ',
+  },
+  services: {
+    title: 'Công việc, gia đình và kinh doanh',
+    description: 'Tư vấn và giải quyết tranh chấp về lao động, gia đình, dân sự, hình sự, đầu tư và sở hữu trí tuệ.',
+    detailAction: 'Phạm vi hỗ trợ',
+    allAction: 'Xem các dịch vụ',
+    scopeTitle: 'Phạm vi của từng vụ việc',
+    criminalAction: 'Bài viết về tố tụng hình sự',
+  },
+  columns: {
+    title: 'Pháp luật Đài Loan, bằng tiếng Việt',
+    description: 'Bài viết về những vấn đề pháp lý trong đời sống và hoạt động kinh doanh tại Đài Loan.',
+    allAction: 'Tất cả bài viết',
+    readAction: 'Đọc bài viết',
+    issueTitle: 'Pháp luật qua tin tức',
+    issueDescription: 'Tin tức về Đài Loan và Việt Nam cùng những vấn đề pháp lý liên quan.',
+    issueAction: 'Xem chuyên mục',
+  },
+  team: {
+    title: 'Luật sư Wei Tseng và đội ngũ',
+    description: 'Đội ngũ xử lý các vấn đề pháp luật Đài Loan và vụ việc giữa Hàn Quốc và Đài Loan.',
+    action: 'Tìm hiểu đội ngũ',
+    aboutAction: 'Về văn phòng',
+  },
+  faq: {
+    title: 'Trao đổi với văn phòng',
+    allAction: 'Các câu hỏi thường gặp',
+  },
+  offices: {
+    title: 'Các văn phòng tại Đài Loan',
+    description: 'Địa chỉ và đường đi tới văn phòng tại Đài Bắc, Đài Trung, Cao Hùng và Bình Đông.',
+    action: 'Địa chỉ và bản đồ',
+  },
+  contact: {
+    title: 'Trao đổi về vụ việc của quý vị',
+    description: 'Quý vị có thể gửi một bản tóm tắt về vụ việc, mối liên hệ với Đài Loan và thời hạn đang cần giải quyết. Phạm vi công việc và chi phí được xác nhận riêng trước khi bắt đầu.',
+    emailLabel: 'Email liên hệ',
+    disclosureLabel: 'Ngôn ngữ và việc tiếp nhận yêu cầu',
+    formAction: 'Biểu mẫu liên hệ',
+    privacyAction: 'Cách xử lý thông tin cá nhân',
+    preparationTitle: 'Nội dung trao đổi ban đầu',
+    receiptTitle: 'Sau khi gửi yêu cầu',
+    officeAction: 'Địa chỉ văn phòng',
+  },
+  navigation: {
+    breadcrumbLabel: 'Đường dẫn trang',
+    pageContents: 'Nội dung trang',
+    serviceContents: 'Lĩnh vực dịch vụ',
+    backHome: 'Trang chủ',
+  },
+} as const;
+
+export type ViServiceId = 'employment' | 'family' | 'civil' | 'criminal' | 'business' | 'intellectual-property';
+
+export interface ViServicePresentation {
+  id: ViServiceId;
+  sectionIndex: number;
+  title: string;
+  summary: string;
+  icon: ZhHantMonoIconName;
+}
+
+/** Order prioritizes common personal matters without expanding the published six service areas. */
+export const viServicePresentation: readonly ViServicePresentation[] = [
+  {
+    id: 'employment',
+    sectionIndex: 3,
+    title: 'Lao động và việc làm',
+    summary: 'Tiền lương, chấm dứt hợp đồng và tranh chấp giữa người lao động với người sử dụng lao động.',
+    icon: 'labor',
+  },
+  {
+    id: 'family',
+    sectionIndex: 2,
+    title: 'Hôn nhân và gia đình',
+    summary: 'Ly hôn, tài sản, việc chăm sóc và thăm nom con, thừa kế và vụ việc có yếu tố nước ngoài.',
+    icon: 'family',
+  },
+  {
+    id: 'civil',
+    sectionIndex: 1,
+    title: 'Dân sự và bồi thường',
+    summary: 'Tranh chấp hợp đồng, thiệt hại ngoài hợp đồng và các vấn đề bảo vệ quyền lợi người tiêu dùng.',
+    icon: 'civil',
+  },
+  {
+    id: 'criminal',
+    sectionIndex: 4,
+    title: 'Vụ việc hình sự',
+    summary: 'Hỗ trợ người bị tình nghi, bị cáo và người bị hại trong quá trình điều tra, xét xử.',
+    icon: 'criminal',
+  },
+  {
+    id: 'business',
+    sectionIndex: 0,
+    title: 'Đầu tư và doanh nghiệp',
+    summary: 'Thành lập công ty, đầu tư, hợp đồng và các vấn đề pháp lý khi kinh doanh tại Đài Loan.',
+    icon: 'company',
+  },
+  {
+    id: 'intellectual-property',
+    sectionIndex: 5,
+    title: 'Sở hữu trí tuệ',
+    summary: 'Đăng ký và bảo vệ nhãn hiệu, sáng chế, quyền tác giả; giải quyết tranh chấp liên quan.',
+    icon: 'ip',
+  },
+];

```
