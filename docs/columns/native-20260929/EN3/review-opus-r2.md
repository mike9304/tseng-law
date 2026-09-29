# EN3 중간검수 r2 (Opus 5.5) — foreign-professional-dismissed-taiwan

verdict: REVISE

요약: r1의 P0 1건과 P1 3건은 내용상 모두 제대로 반영됐다. 법률 사실 오류는 더 없다. 다만 개정본에 **빌드를 깨는 형식 오류 2건**(frontmatter YAML 파싱 실패, 본문에 HTML 주석이 글자 그대로 노출)이 새로 생겼다. 또 BRIEF가 요구하는 **무료 법률지원 안내**가 빠져 있다. 셋 다 고치기는 쉽다.

---

## r1 지적 반영 확인

| r1 | 반영 | 확인 근거(r2에서 다시 받은 원문) |
|---|---|---|
| P0-1 퇴직금 전환 | **확인** (48행) | ① 勞保局 공지(發布·更新 2025-12-29) https://www.bli.gov.tw/0109649.html 「外專法第24條自115年1月1日修正施行…即無論是否取得永久居留身分，即適用勞退新制」「但勞工如欲繼續適用勞基法之退休金規定(勞退舊制)，應自施行之日起6個月內(即115年6月30日前)，以書面向雇主表明…屆期未選擇適用勞退舊制者，自施行之日起適用勞退新制」 ② 勞動部 FAQ(發布 2025-12-12, 更新 2026-05-22) https://www.mol.gov.tw/1607/28690/2282/2302/2316/86977/post Q3 「得於115年6月30日前，以書面向雇主表明繼續適用…勞退舊制」, Q7 「依照勞工退休金條例第11條規定…原先工作年資仍應予保留」 ③ 勞退條例 11조(curl): 「前項保留之工作年資，於勞動契約依勞動基準法第十一條…規定終止時，雇主應依各法規定，以契約終止時之平均工資，計給該保留年資之資遣費或退休金，並於終止勞動契約後三十日內發給」 → "paid at the old rate of one month per year, based on your average wage when the contract ends"와 일치한다. 참고로 勞動部 FAQ의 보류 연수 설명(A10)은 퇴직금(退休金)만 다룬다. 해고 시 1개월/년이라는 부분의 근거는 勞退條例 11조 2항의 「依各法規定」(→勞基法 17조)이다. 본문 링크(FAQ)는 전환 제도 설명용으로 적절하고, dossier에는 11조 2항을 근거로 적어 둘 것. |
| P1-1 체류 | **확인** (64행) | 移民法 31조 4항 「…廢止其居留許可，並註銷其外僑居留證。但有下列各款情形之一者，得准予繼續居留」 → "requires… unless an exception applies". 36조 2항 7호 「移民署得強制驅逐出國，或限令其於十日內出國」 → "deport you or to order you to leave within 10 days". 사라진 "no fixed days" 문장은 남아 있지 않다. |
| P1-2 적용 범위 | **확인** (26·36행) | 본문을 직접 다시 받았다(제목만 본 것 아님). 勞動部 FAQ(發布 2015-01-14, 更新 2021-10-20) https://www.mol.gov.tw/1607/28690/2282/2284/2286/7086/post 「私立各級學校除編制內之教師、職員及編制外僅從事教學工作之教師不適用勞動基準法外，其餘工作者均有勞動基準法之適用」. 勞動部 FAQ(發布 2016-01-19, 更新 2026-04-15) https://www.mol.gov.tw/1607/28690/2282/2284/2286/7088/ 「依公司法『委任』之經理、總經理不屬勞動基準法所稱之勞工，故其退休及其他勞動條件等權利義務事項，由其與事業單位自行約定」. "Cram-school teachers… are covered"도 근거가 있다. 勞委會 1998-12-31 台(87)勞動一字第059605號 공고(勞動部 「歷次公告」 PDF)는 「下列各業及工作者不適用勞動基準法，其餘一切勞雇關係，自即日起適用」이라 하고, 제외 대상은 「私立之各級學校、特殊教育事業、社會教育事業、職業訓練事業、…幼稚園等之教師、職員」뿐이다(社會教育事業 교사·직원은 2010-03-01부터 다시 적용). 短期補習班은 제외 목록에 없다. 표현 다듬기는 P2-1. |
| P1-3 화자 목소리 | **확인** | 1인칭 "I could not / I found / I did not" 0건. 수습기간은 勞動部 지침으로 바뀌었다(r1에서 2025-08-13 원문 확인). 금지어 grep 0건(66행 "whether you need"는 문장 중간의 일반 용법이라 해당 없음). em dash 0, bold 0. 전체적으로 실무 변호사의 설명으로 읽힌다. |
| r1 P2 | 1–10 반영, 11 미반영 | P2-11(법률구조)은 아래 P1-3으로 올려 근거와 문안을 함께 제시한다. |

---

## P1

### P1-1. frontmatter YAML이 파싱되지 않는다 (빌드와 테스트가 실패한다)
- 위치: 14–19행. 목록 들여쓰기가 ` - q:`(대시 1칸, q는 3열)와 `  a:`(a는 2열)로 어긋나 있다.
- 근거(실행 결과): 레포의 gray-matter로 파싱하면 `ERR bad indentation of a sequence entry at line 15, column 3: a: "There is no rule that you mu ...`가 난다. r1 판은 `  - q:` / `    a:`였고 파싱에 문제가 없었다.
- 수정안: 기존 칼럼(020)과 같은 들여쓰기로 되돌린다.
  ```
  categories:
    - "Taiwan Legal Information"
  …
  faq:
    - q: "…"
      a: "…"
  ```
  수정 후 `node -e "require('gray-matter')(require('fs').readFileSync('<draft>','utf8'))"`로 파싱되는지 확인할 것.

### P1-2. 본문 HTML 주석이 페이지에 글자 그대로 보인다
- 위치(74행): `…employer-tied permit. <!-- LINK: /en/columns/taiwan-employment-gold-card --> If you do change employers…`
- 근거(실행 결과): 이 사이트는 react-markdown 10.1.0을 rehype-raw 없이 쓴다(`src/components/ColumnContent.tsx`). 같은 문장을 렌더링하면 `<p>…remove it. &lt;!-- LINK: /en/columns/taiwan-employment-gold-card --&gt; If you do change employers.</p>`가 나온다. 주석이 숨지 않고 화면에 노출된다. 링크 대상인 027 `taiwan-employment-gold-card`는 COORD.md에 따르면 다른 레인의 미커밋 칼럼이라, 지금은 `src/content/columns-en/`에 없다.
- 수정안: draft.md에서 주석을 지운다. 교차 링크는 dossier나 NOTES에 "통합 시 027이 origin/main에 있으면 이 문장 뒤에 `See our [Gold Card guide](/en/columns/taiwan-employment-gold-card).`를 넣는다"로 옮긴다. 주석을 남긴다면 통합 담당(총괄)이 머지 전에 반드시 링크로 바꾸거나 지워야 한다.

### P1-3. 무료·보조 법률지원이 빠져 있다 (BRIEF 윤리 조항: "무료 공공 지원이 사실이면 숨기지 말고 알려 준다")
- 확인한 사실:
  - 勞資爭議法律及生活費用扶助辦法(勞動部, 수정 2026-08-18) https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=N0020018
    - 3조 1항: 「勞工因下列情形之一，經主管機關調解不成立而向法院聲請勞動調解或起訴，且非屬有資力者，得申請前條第一款之扶助：一、與雇主發生勞動基準法終止勞動契約、積欠工資、資遣費或退休金之爭議。」
    - 6조 1항: 「有資力者，為申請人或當事人申請時每月收入總計逾新臺幣六萬五千元或其資產總額逾新臺幣三百萬元者。但申請人或當事人名下之自住不動產，不含計在內。」
    - 3조 7항: 각 절차 개시일부터 180일 안에 신청해야 한다.
    - 7조: 변호사 보수 보조는 심급당 최고 NT$40,000(복잡한 사건은 60,000)이다.
    - 국적 제한 조항은 없다(대상은 「勞工」). 해고 분쟁과 퇴직금 청구가 정면으로 해당한다.
  - 法律扶助法 14조 1항(curl, A0030157): 「非中華民國國民符合下列情形之一者，本法之扶助規定亦適用之：一、合法居住於中華民國境內之人民。二、因不可歸責於己之事由而喪失居留權。…」 다만 5조의 무자력(無資力) 요건은 따로 적용된다. 2호는 해고 뒤 ARC가 취소된 독자에게도 해당할 수 있다.
- 수정안: 60행 끝에 한 문장을 붙인다. 결과 보장은 없다.
  > Legal aid is worth checking: once mediation at the labor bureau has failed, the Ministry of Labor subsidizes lawyers' fees in court for workers whose monthly income is at most NT$65,000 and assets at most NT$3 million, and the Legal Aid Foundation (法律扶助基金會) accepts foreigners living here lawfully.
  - 분량 상쇄안(약 -40단어, 합계 1,900 이내 유지):
    - 54행 "; the Taipei City Department of Labor points white-collar and blue-collar workers alike to it" → ", including for white-collar workers"
    - 64행 "How soon that happens depends on when the employer reports and the Agency acts, so do not rely on figures repeated online." → "Do not rely on figures repeated online."
    - 76행 첫 문장 → "Your labor rights against the employer are unchanged."
  - dossier에 위 두 조문 원문 행을 추가한다.

---

## P2

1. 36행 "private-school teachers who only teach": 勞動部 기준으로는 편제 내(編制內) 교사는 행정을 겸해도 제외되고, 편제 외(編制外)는 가르치기만 하는 교사만 제외된다. 대학도 포함된다. 문안: "The Ministry of Labor treats teachers at private schools and universities as outside the Act".
2. 56행 "If it fails, you can sue, and the court can skip its own mediation step.": 바로 앞 문장이 집행명령 얘기라 "it"이 무엇을 가리키는지 흐리다. 또 법원 재량이 아니라 조정 전치 의무가 면제되는 것이다(勞動事件法 16조 1항 1호 → 民訴 406조 1항 2호 「經其他法定調解機關調解未成立者」). 문안: "If mediation fails, you can sue, and the court's own mediation step is then no longer compulsory."
3. 70행 "The Workforce Development Agency's notice": 7/12 근무일 공고의 발령 주체는 勞動部다(2026-04-13 勞動發事字第1150504126號, 部長 명의). WDA 사이트에 게시돼 있을 뿐이다. → "The Ministry of Labor's notice". 수치는 r1에서 원문으로 확인했다. dossier는 2025 FAQ 대신 이 공고로 갱신할 것.
4. 74행 "Permanent residents need no work permit at all.": 人才專法 7조 2항은 외국 전문인력(과 가족) 중 영주권자에게만 허가 면제를 준다. 일반 영주권자는 就服法 51조 2항에 따라 본인이 허가를 신청한다(「前項第一款、第三款及第四款之外國人得不經雇主申請，逕向中央主管機關申請許可」). 문안: "Foreign professionals who hold permanent residence need no work permit at all (Foreign Professionals Act, Article 7)."
5. 32행 "Get advice, from a lawyer or the 1955 hotline, first." → "Get advice from a lawyer or the 1955 hotline first." (쉼표 정리)
6. 통합 참고: COORD.md 재번호에 따라 이 칼럼은 **034**다. frontmatter `featured_image: "../images/026-…"`와 NOTES의 "file 026"을 034로 맞출 것(총괄 판단).

---

## 형식 재확인
- 본문 1,885단어(주석과 URL 제외, 내 계산. 작성자 계산은 1,893): 한도 안이다. P1-3 추가와 상쇄 후에도 1,900 이내여야 한다.
- 공식 링크 10개(law.moj 9 + 勞動部 FAQ 1)로 상한을 지킨다. P1-3 문장에는 링크가 없어 늘어나지 않는다. 내부 링크 008·009는 실재한다.
- summary 159자, seoTitle 45자(+suffix 60), title 변경 없음. FAQ2는 "requires… revoke", "six-month extension"으로 본문과 일치한다.

검증한 주장 수: 22(r1 수정분과 새 문장) / 공식 출처 재확인 수: 勞保局 1, 勞動部 FAQ 3(연금·교사·경리, 본문), 勞動部 적용 공고 PDF 1, 법령 curl 5(勞退條例 11, 就服法 51, 法律扶助法, 勞資爭議法律及生活費用扶助辦法, 移民法 31·36은 r1 원문 재사용), 렌더링·파싱 실측 2
