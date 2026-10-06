# C2 fix1 notes — taiwan-small-claims-simplified-civil-procedure

2026-10-06. 대상: `drafts/C2/{ko,ja,en,zh-hant}.md`. 입력: `reviews/C2/voice-grok.md`(문체 13건), `reviews/C2/lint-*.txt`(네 언어 모두 이미 OK).

사실·법률 지적은 없었다. 문장을 고친 조문은 고치기 전에 law.moj.gov.tw 원문을 다시 열어 확인했다(`fetch-law.py B0010001`, 2026-10-06, 民事訴訟法 修正日期 民國112年11月29日: 第96條, 第403條, 第433-1條, 第433-3條, 第436-8條, 第436-12條, 第436-14條). `research/C2-statutes.md`와 문언이 같다. 숫자, 조건, 조문 번호, 링크, 출처 목록, frontmatter 키, slug, featured_image 경로는 바꾸지 않았다. 판결은 인용하지 않는다.

## ko

1. 가정 사례 문장 「가령 … 돌려주지 않는다고 해 보겠습니다.」 — 고침, 다만 검수자의 수정안과 다르게.
   - 검수자의 지적(강의 말투, 최근 한국어 칼럼 231·233·234와 같은 자리에 같은 틀)은 맞다. 저장소의 최근 칼럼을 확인하니 「가령 … 가정합니다」가 독립 문단으로 반복된다.
   - 검수자의 수정안 「… 돌려주지 않습니다.」는 채택하지 않았다. 가정 표지가 사라져 실제 의뢰인 이야기로 읽히고, 배치 브리프 hard rule 7(가정 사례는 가령/例えば/Suppose/假設처럼 가정으로 읽혀야 함)에 어긋난다.
   - 수정: 독립 문단을 없애고 첫 절의 조문 설명 바로 뒤에 넣었다. 「가령 타이베이에서 살던 한국인 세입자가 계약이 끝나 집을 비웠는데도 집주인이 보증금 80,000 대만달러를 돌려주지 않는다면, 그 반환 청구가 여기에 듭니다.」 기존 「보증금 반환 청구는 여기에 듭니다.」는 이 문장에 합쳤다.
   - 따라온 수정: 사례가 절 안으로 들어갔으므로 조정 절의 「집주인이 기일 5일 전까지 …」를 「앞의 예에서 집주인이 기일 5일 전까지 …」로 고쳐 가정 사례임을 이어 주었다.
   - 보존: 타이베이, 한국인 세입자, 계약 종료 후 퇴거, 집주인, 보증금 80,000 대만달러 미반환, 제436조의8 제1항 적용.

2. 「청구에 비해 현저히 맞지 않으면」 — 검수자 안대로 고침.
   - 수정: 「양쪽이 동의하거나, 증거조사에 드는 시간과 비용이 청구에 비해 지나치게 크면 법원은 증거조사 없이 모든 사정을 살펴 사실을 인정할 수 있습니다」.
   - 원문 확인: 第436-14條 「調查證據所需時間、費用與當事人之請求顯不相當者」. 「할 수 있습니다」(得)는 그대로다.

3. 「귀국한 뒤에 소를 내면 제96조가 문제 됩니다.」 — 고침.
   - 예고 문장을 없애고 요건 문장과 합쳤다. 「귀국한 뒤에 소를 내는데 대만에 주소, 사무소, 영업소가 모두 없다면, 법원은 피고의 신청에 따라 원고에게 소송비용 담보를 명해야 합니다(제96조 제1항).」
   - 검수자 안의 「소를 낼 때 원고가 … 없으면」은 주어가 어색해 어순만 다듬었다. 「모두 없다면」은 第96條 第1項 「無住所、事務所及營業所」에 맞춘 표현이다.
   - 보존: 귀국 후 제소, 주소·사무소·영업소가 없을 것, 피고의 신청, 법원의 의무(명해야 합니다), 제96조 링크. 「국적은 기준이 아닙니다」와 제2항 예외는 그대로 두었다.

## ja

1. 「台湾の会社から受けたロゴ制作の報酬9万元を、納品から3か月たっても…」 — 고침.
   - 검수자의 지적(「受けた…報酬」가 이미 받은 보수로 읽힘)은 맞다.
   - 수정: 「例えば、台北に住む日本人のデザイナーが、台湾の会社から依頼されたロゴを納品して3か月たっても、報酬の9万元を受け取れていないとします。」
   - 검수자 안의 「請けた」 대신 「依頼された」를 썼다. 「請ける」는 請負를 떠올리게 해서 본문이 말하지 않는 계약 유형을 정하는 것처럼 읽힐 수 있다.
   - 보존: 台北, 日本人デザイナー, 台湾の会社, ロゴ, 納品後3か月, 報酬9万元 미수령, 「とします」.

2. 「口頭弁論は1回で終えるのが原則です」(summary, 본문 첫 문단) — 검수자 안대로 두 곳 모두 「終わるのが原則です」로 고침.
   - 보존: 2026年10月時点, 第一審の裁判費1,500元, 1회가 원칙(第433-1條 「以一次期日辯論終結為原則」). 주어가 있는 뒷부분 「裁判所は1回の期日で弁論を終えることを原則とし」는 검수자 의견대로 그대로 두었다.

## en

1. "Suppose an American freelance designer in Taipei finished …" — 고침, 다만 검수자의 수정안과 다르게.
   - 최근 영어 칼럼 230·232·233·234가 모두 독립 문단 "Suppose …"로 사례를 여는 것은 저장소에서 확인했다. 틀 반복이라는 지적은 맞다.
   - "Suppose"만 떼어 낸 검수자 안은 채택하지 않았다. 가정 표지가 없으면 실제 사건처럼 읽힌다(브리프 hard rule 7).
   - 수정: 독립 문단을 없애고 첫 절 조문 설명 뒤에 넣었다. "If, say, an American freelance designer in Taipei has finished a branding project for a local company and is still waiting for the last NT$80,000 of the fee, that claim fits." 기존 "The designer's NT$80,000 fits."는 이 문장에 합쳤다.
   - 보존: American freelance designer, Taipei, branding project for a local company, last NT$80,000 unpaid, Article 436-8 paragraph 1.

2. "the court is expected to finish the case in a single hearing" — 고침.
   - 수정: "as a rule the court finishes oral argument in a single hearing".
   - 검수자 안의 "finishes the case" 대신 "finishes oral argument"로 썼다. 第433-1條는 「一次期日辯論終結為原則」, 곧 변론 종결을 말한다.

3. "the court may on its own motion move a case" — 고침.
   - 수정: "the court may, of its own motion, switch a case to the summary procedure (簡易程序) if it considers the small-claims track unsuitable (paragraph 2)".
   - 검수자 안의 "transfer" 대신 "switch"를 썼다. 第436-8條 第2項은 「改用簡易程序，並由原法官繼續審理」여서 다른 법원으로 보내는 이송이 아니다. "transfer"는 검수자가 "move"에서 지적한 그 오독을 다시 부른다. 본문 다른 곳과 맞춰 "of its own motion"으로 통일했다.

4. "so by amount every small claim is covered" — 고침.
   - 수정: "…(Article 403, paragraph 1, item 11), and every small claim falls within that amount."
   - 검수자 안 "so every small claim is under that amount"는 "so"의 인과가 거꾸로다(소액사건이 그 금액 아래인 것은 조정 의무의 결과가 아니다). 같은 뜻을 "and … falls within that amount"로 썼다. "must"는 앞 절에만 걸리고, 다음 문단의 제406조 예외는 그대로다.

5. "find the facts on all the circumstances" — 검수자 안대로 "find the facts in light of all the circumstances"로 고침. may, 양쪽 동의 또는 clearly out of proportion 요건은 그대로다.

6. Article 436-12 문장의 "decide on that party's argument alone" — 고침.
   - 수정: "…the court may, at the other party's request, order oral argument at once, and may give judgment on the appearing party's argument alone".
   - "and may"를 넣어 두 단계를 나눴다. 조문은 변론 명령은 「依到場當事人之聲請」, 일방 변론 판결은 「並得依職權」이라 신청이 판결까지 걸리는 것처럼 읽히지 않게 했다.

7. Article 433-3 문장의 "decide on the other side's argument" — 검수자 안대로 고침. "the court may, of its own motion, give judgment on the appearing side's argument alone". 뒤 문장 "All three rules apply through Article 436-23."은 그대로다.

## zh-hant

1. 소제목 「原告人在國外時的訴訟費用擔保」 — 고침, 다만 검수자의 수정안과 다르게.
   - 원문은 「原告／人在國外」이지 「原告人」이 아니므로 검수자가 든 이유는 정확하지 않다. 그래도 검수자가 그렇게 끊어 읽었다는 것이 독자도 걸릴 수 있다는 증거라서 고쳤다.
   - 검수자 안 「人在國外時的訴訟費用擔保」는 채택하지 않았다. 「原告」가 빠져 누가 국외에 있는지 알 수 없고, 第96條의 기준은 국외 체류가 아니라 住所、事務所及營業所의 유무다.
   - 수정: 「原告在台灣沒有住所時的訴訟費用擔保」. 본문의 「沒有住所、事務所及營業所」「應依被告聲請」「逾期駁回」는 그대로다.

## Lint (수정 후 실행 결과)

- ko: `OK` `[length 3470 chars (no spaces/URLs)]` (수정 전 3472)
- ja: `OK` `[length 4388 chars (no spaces/URLs)]` (수정 전 4387)
- en: `OK` `[length 1570 words]` (수정 전 1563)
- zh-hant: `OK` `[length 2672 chars (no spaces/URLs)]` (수정 전 2669)

## 범위와 한계

- 고친 것은 위 13건과 ko의 「앞의 예에서」 한 곳이다. 그 밖의 문장은 손대지 않았다.
- 굵은 강조, 전화번호, 주소, 변호사 검토 표시, 당사자 이름은 없다. 연락처는 이메일 한 번이다.
- 문체 규칙은 작업 지시대로 `brief-EDITORIAL-VOICE.md` 전문을 읽고 적용했다. 정본 `~/agent-library/knowledge/editorial-voice.md`는 이 세션의 허용 디렉터리 밖이라 열지 못해 두 파일이 같은지 대조하지 못했다.
- 이 수정은 모델이 한 문체 수정이다. 원어민 검수나 변호사 검토가 아니다.
