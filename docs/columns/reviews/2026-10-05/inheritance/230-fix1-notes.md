# I1 fix1 notes

대상: drafts/I1/{ko,ja,en,zh-hant}.md. 입력: reviews/I1/voice-grok.md, lint-*.txt (수정 전 네 언어 모두 OK).

voice-grok.md의 지적은 모두 문체 항목이다. 사실·법률 지적은 없어서 조문, 숫자, 기간, 조건, 링크는 건드리지 않았고 공식 출처를 다시 열어 고친 내용도 없다. 문장을 고친 뒤 research/statutes.md의 해당 조문(土地法 §73, §73-1, 土地登記規則 §119 II, 遺產及贈與稅法 §8)과 법적 강도·조건이 그대로인지 대조했다. 이 기록은 모델의 문체 수정 기록이며 원어민·변호사 검수가 아니다.

## ko (5건 모두 반영, 4건은 수정안을 다듬음)

1. `대신 미룬 기간에 따라 불이익이 단계적으로 커집니다.` — 반영. 다만 문장만 지우면 뒤의 「토지법이 정한 순서는 이렇습니다」에서 무엇의 순서인지가 사라진다. 두 문장을 하나로 합쳤다.
   → `등기를 미룬 기간에 따라 토지법이 정한 절차는 다음과 같습니다.`
   보존: 권리가 곧바로 없어지지 않는다는 첫 문장, 기간에 따라 절차가 달라진다는 점. 「불이익이 단계적으로 커진다」는 추상적 평가는 뺐다.

2. summary의 `단계별 근거 조문과 서류, 일부 상속인만으로 등기하는 방법을 정리했습니다.` — 반영, 삭제.
   보존: 6개월 뒤 과태료, 1년 뒤 공고와 열책관리, 그로부터 15년 뒤 공개 매각.

3. `가령 … 등기되어 있다고 해 보겠습니다.` — 반영. 수정안의 「가령 … 등기되어 있습니다.」는 「가령」이 평서형 종결과 바로 이어져 가정인지 사실인지가 흐려진다(시리즈 규칙 7: 가상 사례는 가상으로 읽혀야 한다). 「~인 경우입니다」로 맺었다.
   → `가령 대만인 아버지가 4년 전에 돌아가셨고, 타이난의 집과 땅은 아직 아버지 이름으로 등기되어 있는 경우입니다.`
   보존: 가상 사례, 사망 후 4년, 타이난의 집과 땅, 아버지 명의. 뒤의 상속인 두 사람과 표 셋째 줄 문장은 그대로.

4. `과태료에는 이렇게 상한이 있습니다. 부동산 자체가 걸린 절차는 1년이 지난 뒤부터 따로 진행됩니다.` — 반영. 첫 문장 삭제. 수정안의 「부동산을 다루는 절차」는 무엇과 따로인지가 빠져서, 과태료와 구별된다는 점을 문장에 넣었다.
   → `과태료와는 별개로, 부동산 자체를 대상으로 하는 절차가 1년이 지난 뒤부터 진행됩니다.`
   보존: 상한(20배·1,000분의 20)은 앞 문단. 1년 뒤 별도 절차가 진행된다는 점. 1년 시점에 처분된다는 표현은 없다.

5. `유산세(遺產稅)가 먼저 정리되어야 합니다.` — 반영. 주체를 넣고 능동으로 바꿨다. 본문에서 원어를 처음 밝히는 자리라 (遺產稅) 병기는 남겼다.
   → `상속인은 등기에 앞서 유산세(遺產稅)부터 정리해야 합니다.`
   보존: 등기보다 유산세가 먼저라는 순서와 의무(해야 합니다). 완납·면세 증명·신고 기한·2배 이하 과태료 문장은 그대로.

## ja (3건 모두 반영, 2건은 수정안을 다듬음)

1. summary의 `各段階の根拠条文、必要書類、相続人の一部だけで登記する方法をまとめました。` — 반영, 삭제.
   보존: 6か月後の過料、1年後の公告と列冊管理、さらに15年後の公開入札による売却.

2. `過料にはこのように上限があります。不動産そのものに関わる手続きは、1年を過ぎたところから別に進みます。` — 반영. 첫 문장 삭제. 첫 문장이 없어지면 「別に」가 무엇과 따로인지 가리킬 말이 없어 「過料とは別に」로 고쳤다.
   → `過料とは別に、不動産そのものに関わる手続きが、1年を過ぎたところから進みます。`
   보존: 상한은 앞 문단, 1년 경과 후 별도 절차.

3. `登記の前に、遺産税（遺產稅。亡くなった方の遺産にかかる台湾の税）を整理しておく必要があります。` — 지적(괄호 안의 「。」, 遺産税를 같은 말로 다시 푸는 중복)은 맞아서 반영. 다만 수정안 「死亡した人の遺産に対する台湾の税」도 같은 중복이 남고 어감이 딱딱해져 그대로 쓰지 않았다. 풀이를 빼고 「台湾の」와 원어만 남겼다. 「税を整理する」는 일본어로 어색해 「手続きを済ませておく」로 바꿨다.
   → `登記の前に、台湾の遺産税（遺產稅）の手続きを済ませておく必要があります。`
   보존: 등기 전에 유산세 처리가 필요하다는 의무(必要があります), 대만의 세금이라는 점, 원어 遺產稅. 완납·면세증명서·제42조·제41조·신고기한·과료 문장은 그대로. 일본 相続税와의 비교는 확인한 출처가 없어 넣지 않았다.

## en (6건 중 4건 반영, 2건은 lint 길이 제한 때문에 수정안 대신 다른 문안)

1. title / H1 `… What Happens If Registration Waits` — 반영, 수정안 그대로. frontmatter title과 H1을 함께 바꿨다.
   → `Taiwan Property Still in a Late Parent's Name: What Happens If the Heirs Do Not Register`

2. seoTitle `Taiwan Inheritance Registration Deadline` — 지적의 취지(기한만 말한다)는 반영했지만 수정안은 쓸 수 없다. 수정안은 80자이고 lint.py와 brief-SERIES.md는 en seoTitle을 30–45자로 제한한다. `Taiwan Inheritance Registration`만 31자라 과태료·열책관리·매각을 나열할 자리가 없다. 기한이 지난 뒤를 다룬다는 점이 드러나는 42자 문안으로 바꿨다.
   → `Overdue Inheritance Registration in Taiwan`
   과태료·공고·열책관리·공개 매각은 summary가 말한다.

3. summary `Learn the late fine, …` — 반영. Learn the 명령형과 late fine을 없앴다. 수정안은 앞 문장을 포함하면 239자라 lint의 150–160자 제한에 맞지 않아 같은 사실을 160자로 줄였다.
   → `Taiwan gives heirs six months to register inherited land. A fine may follow, then notice and listed management after a year, and a public tender 15 years later.`
   보존: 6개월, 그 뒤 과태료 가능(may), 1년 뒤 공고와 열책관리, 15년 뒤 공개 매각.

4. `What the Land Act does is raise the stakes in steps, …` — 반영, 수정안 그대로.
   → `What follows under the Land Act depends on how long the title stays in the dead owner's name.`

5. `So the fine has a ceiling. The process that puts the property itself at risk runs separately and starts after the first year.` — 반영. 첫 문장과 at risk 삭제. 수정안의 쉼표 삽입구 대신 과태료와 별개라는 점을 평서문으로 썼다.
   → `The process that concerns the property itself is separate from the fine and starts after the first year.`
   보존: 상한은 앞 문단의 20 times / 2%. 1년 뒤 별도 절차가 시작된다는 점.

6. `In the example, your sister is that occupying heir.` — 반영, 수정안 그대로.
   → `In the example, your sister is the heir who occupies the house.`

## zh-hant (5건 모두 반영, 3건은 수정안을 다듬음)

1. `但拖得越久，後果會一階一階加重` — 반영. 「一階一階」를 뺐다. 수정안의 「後面的程序越重」은 「程序」와 「重」의 결합이 어색하고, 「拖」는 제목의 「拖著不辦」과 이어지므로 「放」으로 바꾸지 않았다.
   → `繼承登記沒辦，繼承人的權利不會馬上消失，但拖得越久，後果越嚴重。土地法規定的順序如下：`
   보존: 미등기만으로 권리가 바로 소멸하지 않는다는 점. 표의 6개월·1년·15년은 그대로.

2. summary의 `本文整理各階段的法條依據、應備文件，以及部分繼承人單獨申請的方式。` — 반영, 삭제.
   보존: 6個月、最高20倍罰鍰、逾1年公告3個月後得列冊管理15年、期滿移請公開標售.

3. `罰鍰有上限。不動產本身會不會被處分，要看滿1年之後另外啟動的程序。` — 반영. 첫 문장 삭제. 수정안 「不動產會不會進入後面的程序，是滿1年以後另一件事」는 「後面的程序」「另一件事」가 가리키는 대상이 없어, 과태료와 구별되는 부동산 자체의 절차라고 적었다.
   → `罰鍰之外，滿1年以後還有一套針對不動產本身的程序。`
   보존: 상한은 앞 문단의 20倍·千分之二十. 1년 뒤 절차가 과태료와 별개라는 점. 1년에 처분된다고 쓰지 않았다.

4. `條文移送標售的對象是期滿仍未聲請登記的不動產，在那之前辦妥繼承登記，就不會走到這一步。` — 반영, 수정안 그대로.
   → `會被移請標售的，是期滿仍未聲請登記的不動產。在那之前辦妥繼承登記，就不會走到這一步。`

5. `就是條文所說占有中的繼承人` — 반영. 「占有中的」를 고쳤다. 수정안의 「條文裡占有這筆不動產的繼承人」은 조문 안에 이 부동산이 나오는 것처럼 읽혀 「條文所說」을 남겼다.
   → `前面例子裡住在祖厝的大伯，就是條文所說占有不動產的繼承人。`

## 고치지 않은 것

검수가 그대로 두라고 한 문장(각 언어 첫 문장, 제목·소제목, 사례 설정, en의 The catch 등)과 지적이 없는 문장은 손대지 않았다. frontmatter 키, slug, featured_image 경로, faq, 내부 링크, 출처 목록, 확인일은 그대로다.

## lint (수정 후, 2026-10-05)

```
python3 lint.py drafts/I1/ko.md ko taiwan-inheritance-registration-deadline-unregistered-land
OK
[length 3215 chars (no spaces/URLs)]
python3 lint.py drafts/I1/ja.md ja taiwan-inheritance-registration-deadline-unregistered-land
OK
[length 4049 chars (no spaces/URLs)]
python3 lint.py drafts/I1/en.md en taiwan-inheritance-registration-deadline-unregistered-land
OK
[length 1493 words]
python3 lint.py drafts/I1/zh-hant.md zh-hant taiwan-inheritance-registration-deadline-unregistered-land
OK
[length 2644 chars (no spaces/URLs)]
```

en: title 88자(+" | Hovering Law" > 60이라 seoTitle 필요), seoTitle 42자, summary 160자. 네 파일에서 지적된 원문 표현과 `**`를 다시 검색했고 남은 것이 없다.
