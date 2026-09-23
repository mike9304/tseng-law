# Send packet — AIT "List of Attorneys" (Northern Taiwan) inquiry + Taipei Bar inquiry (2026-09-24)

작성: Fable 5.1 (문서만, 발송·코드·push 없음). 기준: `AIT-LIST-APPLICATION-DRAFT-2026-09.md` + 1차 출처 재확인(조회일 2026-09-24). 승소율·결과 보장·과거 사건 금액 0. 새 법률 주장 0.

## 발송 전 사용자 확인 3가지

1. **AIT 수신 주소 선택** — 1차 출처(2026-05 PDF 헤더)는 **TaipeiACS@state.gov**. 검색 스니펫(2차)에는 amcit-ait-t@state.gov도 보인다 `[확인 필요]`. 권고: To=TaipeiACS@state.gov, 회신 없으면 2주 후 amcit-ait-t@state.gov로 1회 재발송.
2. **전화번호** — AIT 리스트 항목 형식은 Address / Tel / Fax / Email / Website / Areas of practice이며 등재 전 사무소가 Tel을 싣는다. 사이트는 台北 전화 미공개. 본문 `[Taipei office telephone]`에 넣을 번호 결정(交流協会 패킷 확인 1과 동일 결정).
3. **律師公會 소속·등록 정보** — 본문 `[Taipei Bar Association member no. ___]`. AIT는 "credentials … provided directly by the lawyers"라고 명시하므로 등록 근거를 한 줄 넣는 것이 좋다. 모르면 괄호째 삭제(EN-13 `[변호사 확인 필요]`).

## 1차 출처 재확인 (2026-09-24)

| 항목 | 확인 결과 | 출처 |
|---|---|---|
| 리스트 페이지 | "List of Attorneys in Northern Taiwan" — 탭: Overview / Taipei Area / Northern & Central Taiwan / Criminal Law / Pro Bono. 원문: "The attorneys listed below have expressed an interest in representing U.S. citizens in Taiwan. … The information in the list on professional credentials, areas of expertise and language ability are provided directly by the lawyers." | https://www.ait.org.tw/list-of-attorneys-in-northern-taiwan/ (WebFetch 403 → curl 브라우저 UA 200) |
| 최신 PDF | "LIST OF ATTORNEYS — Last modified in May 2026", 13쪽. 헤더: American Institute in Taiwan, 100 Jinghu Road, Neihu District, Taipei 11461 / Tel 886-2-2162-2000 / Fax 886-2-2162-2239 / **E-mail: TaipeiACS@state.gov**. **Hovering/昊鼎/Wei Tseng 미등재** | https://www.ait.org.tw/wp-content/uploads/sites/68/2026/05/List-of-Attorneys_May_2026.pdf |
| 등재 절차·양식 | **페이지·PDF 어디에도 없음.** 기존 초안의 "bar-association call + questionnaire"는 1차 출처에서 확인 안 됨 → `[확인 필요]`. 페이지는 변호사회를 "additional information … by contacting the local bar association"(자격 확인용)으로만 언급 | 同 페이지·PDF |
| 항목 형식 | Firm name / Address / Tel / Fax / Email / Website / (Contact:) / Areas of practice. "Languages:" 필드는 2026-05 PDF에 없음(언어는 Areas 또는 Contact 줄에 자유 기재) | 同 PDF p.1–2 |
| AIT가 언급한 변호사회 | 全國律師聯合會(Taiwan Bar Association) Tel (02)2388-1707 / Fax (02)2388-1708 / www.twba.org.tw / Suite C, 7F, No.4, Sec.1, Zhongxiao W Rd. "Please note that English is not spoken." | 同 페이지·PDF |
| 台北律師公會 연락처 | 100 台北市中正區羅斯福路一段7號9樓 / Tel 02-2351-5071 / Fax 02-2391-3895 / Email tbax@ms17.hinet.net. 사이트에 AIT 리스트 관련 안내 **없음** | https://www.tba.org.tw/ |
| 사이트 EN URL | https://tseng-law.com/en → 200, /en/lawyers/wei-tseng 200 (curl, 2026-09-24) | 라이브 |
| 사무소 주소(EN) | Taipei: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103 · Taichung: 6F-1, No. 19, Guanqian Rd., North Dist., Taichung City 40453, Tel +886-4-2326-1862 · Kaohsiung: No. 233, Anji St., Zuoying Dist., Kaohsiung City 81358, Tel +886-7-557-9797 · Pingtung: No. 46, Sec. 3, Jiuru Rd., Jiuru Township, Pingtung County 90443, Tel +886-8-739-1689 | `src/data/office-locations.ts` |
| 변호사 사실 | Attorney Wei Tseng (曾雋崴), licensed in Taiwan. M.S. Finance, National Taiwan University; B.A. Law & Finance (double major), National Chengchi University; exchange at Kobe University and Waseda University. JLPT N1, TOPIK 6. Consults directly in English, Chinese, Japanese, Korean (사용자 확정 2026-09-23) | `attorney-profiles.ts:220-222`, `site-content.ts:1999-2008` |

## A. AIT 문의 메일 (영어, 그대로 복사)

- **To:** TaipeiACS@state.gov（사용자 확인 1）
- **From:** wei@hoveringlaw.com.tw

**Subject**

```
Request to be added to AIT's List of Attorneys (Northern Taiwan) — Hovering International Law Firm, Taipei
```

**Body**

```
Dear American Citizen Services, AIT Taipei,

I am writing to ask how our firm may be considered for inclusion in AIT's "List of Attorneys in Northern Taiwan" (last modified May 2026). I understand that inclusion is not an endorsement and that the information on the list is provided directly by the attorneys.

Hovering International Law Firm (昊鼎國際法律事務所) is a Taiwan law firm headquartered in Taipei, established in 2016, with additional offices in Taichung, Kaohsiung, and Pingtung. I am a Taiwan-licensed attorney and consult directly with clients in English, as well as in Mandarin, Japanese, and Korean. We are interested in assisting U.S. citizens in Taiwan.

Could you please let me know the procedure, any questionnaire or form, and the next update cycle for the list? For reference, our details in the list's format are below.

Firm: Hovering International Law Firm (昊鼎國際法律事務所)
Address: 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan
Tel: [Taipei office telephone — 사용자 확인 2]
Email: wei@hoveringlaw.com.tw
Website: https://tseng-law.com/en
Contact: Wei Tseng (曾雋崴), Attorney-at-Law, Taiwan [Taipei Bar Association member no. ___ — 사용자 확인 3]
Languages: English, Mandarin Chinese, Japanese, Korean
Areas of practice: Company formation and foreign investment, corporate and contracts, civil and commercial litigation, debt recovery, labor and employment, family (divorce, custody) and inheritance, criminal defense, intellectual property, cosmetics regulatory compliance (TFDA/PIF).
Other offices: Taichung (6F-1, No. 19, Guanqian Rd., North Dist., Taichung City 40453; Tel +886-4-2326-1862) · Kaohsiung (No. 233, Anji St., Zuoying Dist., Kaohsiung City 81358; Tel +886-7-557-9797) · Pingtung (No. 46, Sec. 3, Jiuru Rd., Jiuru Township, Pingtung County 90443; Tel +886-8-739-1689)

Thank you for your time. I am happy to provide a copy of my bar license or any other documentation you require.

Sincerely,

Wei Tseng (曾雋崴)
Attorney-at-Law (Taiwan)
Hovering International Law Firm
7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City 103, Taiwan
Tel: [Taipei office telephone]
wei@hoveringlaw.com.tw · https://tseng-law.com/en
```

## B. 台北律師公會 문의 (중국어 한 단락 — 선택)

AIT 1차 출처에는 변호사회 경유 절차가 없다. 그래도 공회가 AIT 명단 취합 창구인지 확인하고 싶을 때만 발송. To: tbax@ms17.hinet.net (Tel 02-2351-5071).

**主旨**

```
詢問：美國在台協會（AIT）「List of Attorneys」名單之推薦／彙整程序 — 昊鼎國際法律事務所
```

**內文**

```
台北律師公會 秘書處 鈞鑒：

本人曾雋崴律師，昊鼎國際法律事務所（台北市大同區承德路一段35號7樓之2）。本所有意加入美國在台協會（AIT）公布之「List of Attorneys in Northern Taiwan」（2026年5月版），以協助在台美國公民。查該名單網頁載明可向律師公會查詢律師資格，惟未載明加入程序。

謹請教 貴會是否曾受 AIT 委託彙整或推薦律師名單、或有相關問卷／程序可供參考？如有，敬請告知申請方式與期程。倘 貴會並無相關業務，亦請惠復告知，本所將逕向 AIT 洽詢。

耑此 順頌
時祺

昊鼎國際法律事務所 曾雋崴 律師 [會員編號：___]
電話：[台北所電話]　Email：wei@hoveringlaw.com.tw
```

## 사용자가 채울 칸

| 칸 | 값 |
|---|---|
| `[Taipei office telephone]` | 사용자 확인 2 (交流協会 패킷과 동일 결정) |
| `[Taipei Bar Association member no. ___]` / `[會員編號]` | 사용자 확인 3. 모르면 괄호째 삭제 |
| AIT To 주소 | 사용자 확인 1 |

## 발송 후

1. 발송 사본·일자 `docs/marketing/WEEKLY-LOG.md` 기록. AIT 회신에서 양식·질문지가 오면 이 파일에 반영.
2. 2주 무응답 → amcit-ait-t@state.gov로 1회 재발송(그 이상 반복 금지 — us-growth 규칙 "2 contacts + 1 follow-up").
3. 등재 확인은 AIT PDF 차기판(현행 2026-05)에서 "Hovering" 검색. `INQUIRY-LEDGER.csv` `how_heard=ait-list`로 유입 추적.
