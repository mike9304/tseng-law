## 검토 결과: vi--ISSUE-20261002-11 (Nghị định 283/2026/NĐ-CP)

[MAJOR]나 [MINOR]는 없고 [NIT] 3건만 있습니다. 금액과 조문은 공식 서명본 PDF를 직접 읽어 모두 맞는 것을 확인했습니다. 그래서 GATE가 요구한 `[chưa xác minh]` 표기는 없어도 됩니다.

### 지적 사항

- [NIT] 원문: "…theo Điều 31 và Điều 33 Nghị định 219/2025/NĐ-CP, thường gặp khi nhân sự kết thúc nhiệm kỳ và về nước."
  → 문제와 이유: "thường gặp"(흔히 발생한다)는 빈도에 대한 주장인데 출처가 없습니다. 또 Nghị định 219의 Điều 31·33이 어떤 회수 사유를 정하는지는 이번에 열어 보지 못했습니다(확인 필요). 다만 예시로 읽히는 문장이라 게시를 막을 정도는 아닙니다.
  → 수정안: "…theo Điều 31 và Điều 33 Nghị định 219/2025/NĐ-CP, chẳng hạn khi nhân sự kết thúc nhiệm kỳ và về nước."

- [NIT] 원문: "kèm danh sách người được cử (vai trò/địa điểm)"
  → 문제와 이유: 괄호와 슬래시로 나열해 메모처럼 보입니다. 문장으로 풀어 쓰는 편이 자연스럽습니다.
  → 수정안: "kèm danh sách người được cử, vai trò và địa điểm làm việc của từng người"

- [NIT] 원문: "Các trường hợp được nêu gồm người lao động nước ngoài không phải làm thủ tục cấp giấy xác nhận"
  → 문제와 이유: 앞 문단에서 정의한 약칭이라 의미는 통합니다. 하지만 조문 원문은 "giấy xác nhận không thuộc diện cấp giấy phép lao động"입니다. 이 문단만 따로 읽는 독자에게는 어떤 확인서인지 모호할 수 있습니다.
  → 수정안: "…không phải làm thủ tục cấp giấy xác nhận không thuộc diện cấp giấy phép lao động"

규칙 위반은 찾지 못했습니다.
- 굵은 강조와 전화번호가 없습니다(grep으로 확인).
- 본문에 인라인 출처가 있고, 마지막 `## Nguồn` 섹션 뒤에는 확인일 한 줄만 있습니다.
- frontmatter 키가 모두 있고 FAQ는 3개, author는 `legal-ai-assistant`입니다.
- 내부 작업 메모가 노출되지 않았고, 명령형·체크리스트형 소제목이나 "이 글에서는…" 같은 예고 문장도 없습니다.
- 베트남어 문장은 법률 칼럼으로서 자연스럽습니다. 다만 모델이 판단한 것이고 원어민 검수는 아닙니다.

### 사실 검증 메모

- `sources/283-ndcp.signed.pdf` (정부 공식 서명본 스캔, 1–6·12–18·95–100쪽을 이미지로 판독):
  - 1쪽: Số 283/2026/NĐ-CP, 2026년 7월 15일 하노이 발령.
  - Điều 3 khoản 4 điểm a: 노동 분야 처분 시효는 01년.
  - Điều 4 khoản 2 điểm b: "điểm b khoản 4 Điều 13"의 위조 서류 사용은 형사 소송 기관에 사건을 넘겨야 함.
  - Điều 7 khoản 1: 이 조항의 예외 목록에 Điều 13이 없으므로 Điều 13 금액은 개인 기준이고 조직은 2배.
  - Điều 7 khoản 2 điểm b: 베트남 법에 따라 설립된 기업과 "chi nhánh, văn phòng đại diện của … doanh nghiệp nước ngoài hoạt động tại Việt Nam"이 포함됨.
  - Điều 13 (12–14쪽), 모두 일치:
    - k1: 1–3 triệu, a/b/c 세 가지 경우와 Nghị định 219/2025 (07/8/2025) 인용
    - k2: 1인당 5–10 triệu, 상한 75 triệu, 근거는 Điều 31·33 NĐ 219
    - k3: 노동자 15–25 triệu
    - k4: 40–60 triệu
    - k5: 인원 구간별 30–45 / 45–60 / 60–75 triệu
    - k6: a 몰수, b k3·k4 위반 시 추방
  - Điều 66 k1: 2026년 9월 10일 시행. k4: NĐ 12/2022 효력 상실.
  - Điều 67 k1·k2: 경과 규정이 본문 설명과 일치.
  - 본문의 조직 금액(60–90, 80–120, 최대 150 triệu)은 모두 개인 금액의 2배로 맞습니다.
  - Điều 66 k3은 Điều 7 k2의 e·g·h 호를 나중에 시행하도록 정합니다. 본문이 인용한 b호와는 관계가 없습니다.
- https://vanban.chinhphu.vn/?docid=218871&pageid=27160: 문서 번호 283/2026/NĐ-CP, 발령일 15/7/2026, 시행일 10/9/2026, 서명자 Phạm Thị Thanh Trà를 확인했습니다.
- https://www.visaverge.com/... (2026-08-24): 확인한 내용은 다음과 같고, 본문의 "VisaVerge는 조직 2배 가중을 언급하지 않는다"는 서술이 맞습니다.
  - 노동자 15–25 triệu
  - 미허가 고용에 대해 "Up to VND75 million"
  - 위조 40–60 triệu, 신고 위반 1–3 triệu
  - 조직 2배 가중, Điều 7·13에 대한 언급은 없음
- 열지 못한 것: Nghị định 219/2025/NĐ-CP 원문(Điều 9, 22, 31, 33의 내용). 다만 본문은 이 조문들을 Nghị định 283 Điều 13에 적힌 인용 범위 안에서만 언급합니다.

VERDICT: PASS
