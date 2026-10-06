# C4 fix1 — voice-grok.md 반영 기록

작성: 2026-10-06, C4 작성 모델(Claude Opus). 대상: drafts/C4/{ko,ja,en,zh-hant}.md. 근거 피드백: reviews/C4/voice-grok.md, lint-*.txt.

수정 후 lint (python3 lint.py drafts/C4/<lang>.md <lang> taiwan-maternity-paternity-parental-leave-2026):

- ko: OK, 3318자 (수정 전 3247자)
- ja: OK, 3698자 (수정 전 3682자)
- en: OK, 1597 words (수정 전 1592)
- zh-hant: OK, 2680자 (파일 변경 없음)

frontmatter 키·slug·featured_image 경로는 그대로다. 바뀐 frontmatter 값은 en summary 하나뿐이다. 조문 번호, 숫자, 기간, 금액, 링크, 출처 목록은 네 파일 모두 손대지 않았다. 굵은 강조·전화번호·주소·변호사 검토 표시·당사자 이름은 없다.

수정 전에 다시 연 공식 자료 (2026-10-06):

- 勞動部 「育嬰留停照顧彈性化」相關問答 (更新日期 2026-03-20) https://www.mol.gov.tw/1607/28162/28166/28284/28294/84873/post
- 勞保局 育嬰留職停薪津貼 給付標準及期間 (最後更新日期 2026-04-20) https://www.bli.gov.tw/0015727.html
- 조문은 research/C4-statutes.md의 就業保險法 第19-2條, 育嬰留職停薪實施辦法 第2條·第7條, 性別平等工作法 第15條 원문과 대조했다.

## ko

1. 「가령 타이베이의 같은 회사에 근속 2년인 한국인 엔지니어가 두 명 있다고 하겠습니다.」
   - 판단: 강의 말투라는 지적은 맞다. 다만 검수자 수정안(「…두 명 있습니다.」)은 그대로 쓰지 않았다. 가정 표지를 빼면 실제 사례처럼 읽히고, 이는 brief-BATCH.md 7번 규칙(가정 사례는 가령/例えば/Suppose/假設처럼 가정으로 읽혀야 함)에 어긋난다.
   - 수정: 「타이베이의 같은 회사에서 똑같이 2년을 일한 한국인 엔지니어 두 사람도 육아휴직 급여를 받는지는 갈릴 수 있습니다. 가령 한 사람은 대만에 호적이 있는 대만인과 결혼해 거류 허가를 받아 일하고, 다른 한 사람은 회사가 받은 취업허가로 일하며 배우자도 한국인인 경우입니다.」
   - 「…다고 하겠습니다」 틀은 없앴고, 「가령 …인 경우입니다」로 가정임은 남겼다. 첫 문장은 가능성을 말하는 문장이라 실제 사건 서술로 읽히지 않는다.
   - 보존: 타이베이, 같은 회사, 근속 2년, 한국인 엔지니어 두 사람, 혼인·거류 허가와 취업허가·한국인 배우자의 차이.

2. 「휴직 중에 나오는 육아휴직 급여는 앞사람만 받을 수 있습니다.」
   - 수정: 「휴직 중에 나오는 육아휴직 급여는 대만인과 결혼해 거류 허가를 받은 사람만 받을 수 있습니다.」 (검수자 안 채택, 쉼표만 뺌)
   - 보존: 급여를 받는 쪽, 법적 강도.

3. 「처음의 두 엔지니어 가운데 뒷사람이 여기에 해당합니다.」
   - 수정: 「처음의 두 엔지니어 가운데 회사가 받은 취업허가로 일하고 배우자도 한국인인 사람이 여기에 해당합니다.」
   - 보존: 가입 대상에서 빠지는 쪽. 「엔지니어」는 앞 문단과 맞추려고 남겼다.

4. 「외국인은 취업보험 가입 자격부터 확인해야 합니다.」
   - 판단: 독자에게 확인 의무를 만드는 문장이라는 지적은 맞다. 검수자 안(「…인지는 조문이 정합니다.」)은 바로 다음 문장(「제5조 제1항이 정한 가입 대상은…」)과 내용이 겹쳐, 지워도 정보가 줄지 않는다. 그래서 급여와 가입 대상의 관계를 말하는 문장으로 바꿨다.
   - 수정: 「외국인이 급여를 받을 수 있는지는 취업보험 가입 대상인지에 달려 있습니다.」
   - 보존: 뒤따르는 제5조 제1항, 외국전문인재법 제25조의 대상 범위는 그대로다. 대상을 넓히거나 줄이지 않았다.

5. 「휴직을 시작한 달부터 앞 6개월의 평균 월 투보임금」
   - 수정: 「휴직을 시작한 달부터 거슬러 센 6개월의 평균 월 투보임금」 (검수자 안 채택)
   - 근거: 就業保險法 第19-2條 第1項 「育嬰留職停薪之當月起前六個月平均月投保薪資百分之六十」. 勞保局 안내도 같은 문구다. 시작월을 포함하는지는 두 자료 모두 문구 이상으로 밝히지 않으므로 「포함해」 같은 말은 넣지 않았다.
   - 보존: 60%, 투보임금 뜻풀이, 자녀 한 명당 최장 6개월.

6. 「취업금카드」
   - 수정: 「취업 골드카드(就業金卡)」 (검수자 안 채택)
   - 참고: 사이트의 기존 한국어 칼럼은 두 표기를 모두 쓴다. 027·029·168번은 「취업금카드」, 069번은 「취업 골드카드(就業金卡)」다. 이 글은 해당 칼럼으로 링크하지 않으므로 링크 문구와 충돌하지 않는다.

## ja

1. 「雇用主に雇われて働き賃金を得る人」
   - 수정: 「雇用主に雇われて働き、賃金を得る人」 (검수자 안 채택)

2. 「性別平等工作法は賃金を関係法令の定めによるとしているだけです。」
   - 수정: 「性別平等工作法は、賃金の計算は関係法令の定めによるとしているだけです。」
   - 검수자 안의 「賃金は…によるとするだけです」 대신 조문(第15條 第2項 「產假期間薪資之計算，依相關法令之規定」)에 맞춰 「賃金の計算は」로 썼다. 금액·기간은 새로 넣지 않았다.

3. 「休業中の従業員は他の者と別に労働契約を結ぶことができず」
   - 수정: 「休業中の従業員は、他の者と別の労働契約を結ぶことができず」
   - 검수자 안(「他の人と労働契約を別に結ぶ」)보다 「別の労働契約」이 實施辦法 第7條 「不得與他人另訂勞動契約」의 뜻에 가깝고 걸리는 자리가 분명하다. 금지(第7条)와 허용(第6条)의 강도는 그대로다.

4. 「月給が43,901台湾ドル以上の人はすべて最高等級の45,800台湾ドルになるため」
   - 수정: 「月給が43,901台湾ドル以上であれば、投保薪資は一律に最高等級の45,800台湾ドルとなるため」
   - 검수자 안에 주어 「投保薪資は」를 더해 45,800이 무엇의 금액인지 밝혔다. 2026-01-01 등급표, 43,901, 45,800, 36,640, 링크는 그대로다.

5. 검수자가 지적하지 않았지만 고친 곳: 「休業を始めた月の前6か月の平均月投保薪資」 → 「休業を始めた月から遡って6か月の平均月投保薪資」
   - 이유: 원문은 시작월의 앞 6개월(시작월 제외)로 읽힌다. 조문은 「當月起前六個月」이고, ko 5번을 고친 근거와 같다. 조문 문구에 맞춘 것이며 다른 사실은 바꾸지 않았다.

## en

1. summary 「The parental allowance needs Employment Insurance, which covers only some of them.」
   - 수정: 「Employment Insurance pays the parental allowance but covers only some foreigners.」
   - 검수자 안을 그대로 넣으면 summary가 160자를 넘어 lint 기준(150–160자)에 걸린다. 주체를 Employment Insurance로 세우고 them을 foreigners로 풀었다. summary 전체는 155자.
   - 보존: 수당은 취업보험 급여, 보험은 외국인 일부에게만 적용.

2. 「Suppose two American engineers have each worked for two years at the same company in Hsinchu.」
   - 판단: ko 1번과 같다. Suppose를 빼기만 하면 실제 사례처럼 읽혀 7번 규칙에 어긋난다.
   - 수정: 두 번째 문단(법령과 보험의 구분)을 맨 앞으로 올리고, 사례는 「Take two American engineers, each two years into a job at the same company in Hsinchu.」로 시작한다. 「When a child is born」은 「If each has a child」로 바꿨고, 뒤 문단의 「the second engineer in the example」은 그대로 두어 예시임이 드러난다.
   - 보존: 미국인 엔지니어 두 명, 신주의 같은 회사, 각 2년, 혼인·허가의 차이, 두 사람 모두 무급 육아휴직 신청 가능, 수당은 한 사람만.
   - 「Only the first can claim the parental leave allowance while on it.」는 「Only the first can claim the allowance.」로 줄였다. 휴직 중에 지급되는 수당이라는 점은 바로 앞 문단에 있다.

3. 「Labor statutes grant the leave, and they do not ask about nationality.」
   - 수정: 「The labor statutes that grant maternity and parental leave in Taiwan do not make nationality a condition.」 (검수자 안의 구조 채택, 맨 앞 문장이 되어 휴가 종류와 Taiwan을 밝힘)

4. 「The default is still a leave of at least six months each time.」
   - 수정: 「As a rule, each leave still runs for at least six months.」
   - 보존: 한 번에 6개월 이상이 원칙(實施辦法 第2條 第3項).

5. 「The two sides must agree in advance on the channel: writing, email, messaging app or other electronic means.」
   - 수정: 「Employer and employee must agree in advance how requests are sent: in writing, by email, by messaging app or by other electronic means.」
   - 보존: must, 사전 합의, 네 가지 방법.
   - 같은 이유로 앞 문단의 「Unless the two sides agree otherwise」도 「Unless employer and employee agree otherwise」로 맞췄다.

6. 「day-unit leave can be requested for working days only」
   - 수정: 「an employee taking leave by the day may choose which working days to request」
   - 조어 day-unit을 뺐다. 원문은 「근무일에만 신청할 수 있다」는 제한으로도 읽혔다. 勞動部 문답 二、Q3은 「可依其意願擇工作日彈性申請」, 「例假、休息日…無須申請」이라고 하므로 직원이 근무일을 골라 신청한다는 뜻으로 썼다. ko·ja·zh-hant의 서술과 같다. 30일이 2년 한도에 포함된다는 뒷부분과 날짜·링크는 그대로다.

7. 「for each day of day-unit leave an employee takes」
   - 수정: 「for each such day an employee takes」
   - 보존: 직원 30명 미만 고용주, 하루당 NT$1,000 정액.

8. 「so day-unit leave is paid too」
   - 수정: 「so leave taken by the day is paid too」
   - 검수자 안 「one day at a time」 대신 「by the day」를 썼다. 뜻은 같고, 본문이 1,600 words 상한에 가깝다.

9. 분량을 맞추려고 줄인 곳 (사실 변경 없음):
   - 「the social insurance schemes they were already in」 → 「their existing social insurance schemes」
   - 「the local competent authority, which is the municipal or county (city) government」 → 「the local competent authority, the municipal or county (city) government」
   - 「a leave or benefit program in your home country」 → 「a home-country leave or benefit program」
   - 「on the employee's behalf」 → 「for the employee」

## zh-hant

검수 결과 OK. 지적된 문장이 없어 고치지 않았다.

## 남은 사항

- drafts/C4/facts.md는 지시 범위 밖이라 고치지 않았다. 이 파일의 ko 인용 일부(「취업금카드」, 「앞 6개월」 등)는 수정 전 문구다. 근거 사실과 출처는 같다.
- ko·en의 가정 표지(가령, Take … in the example)는 7번 규칙 때문에 남겼다. 검수자의 「틀만 빼면 된다」와 다른 부분이다.
- 이번 수정은 모델의 문체 수정이다. 원어민이나 변호사가 검토한 것이 아니다.
