# JA6 작가 수정·자체 검수 R2

작성: `/root/b10_intake`; 기록 시각 `2026-10-28T23:59:52.131562+00:00`.

일본어 6편을 별도 독립 감수에 넘길 수 있는 상태로 정리했다. 5파일의 17개 순차 수정을 적용했고 920은 바이트 그대로 보존했다. 이것은 작가 자체 검수이며 독립 승인·법률가 승인·배포 완료가 아니다. R과 현재 72편 배포에는 변경하지 않았다.

수정 전 여섯 원문의 전체 텍스트/SHA, 초기 실제 CLI 5통과·916실패를 보존했다. 916은 초기 43문장/CV0.415에서 현재 38문장/CV0.470으로 바뀌었다. 보고서 수령자→인지와 권한→송금 승인이라는 관계를 연결하고, 판결 결과의 반복 예고를 걷어냈다. 문장부호·공백·검사기·임계값은 조작하지 않았다. 미적용 후보들의 계산값은 실제 CLI라고 부르지 않는다.

## 현재 증거

- 실제 공용 CLI 6/6 exit 0. WARN 6건은 です・ます 종결 비율 87–93%이며, 일본어 정중체를 유지했다.
- 실제 저장소 구조 검사 6편 오류 0, 별도 메타데이터 오류 0. 검토 항목 32개는 자동 승인되지 않으며 아래 자체 의미 검수와 독립 감수로 구분한다.
- FAQ 17개. 915 첫 FAQ 답변의 勧告・提案만 勧告または提案으로 명시했고 나머지 16개 FAQ는 불변이다.
- 정본 공식 URL은 각 본문과 말미 출처에서 모두 유지했다. 그림 6개 SHA와 架空の情景 표기를 보존했다. 이번 작가 작업에서 그림을 직접 보지는 않았으며 기존 동일 SHA의 검증 증거를 재사용했다.
- 실제 ReactMarkdown/remarkGfm 본문 HTML을 생성했다. 브라우저 시각검사, 카드·FAQ UI·JSON-LD·피드·배포 검증은 여기서 수행했다고 주장하지 않는다.

| ID | 초기 → 현재 CV | 현재 문장 수 | 변경 | 현재 SHA256 |
|---|---:|---:|---|---|
| 915 | 0.456 → 0.473 | 42 | M01, C01, C02, C03, S01, R02 | `13efd9ab6446b6d2e2db121d8299bc18897a384e2d07f94aec13a3544c44c1a2` |
| 916 | 0.415 → 0.470 | 38 | S02, R01, R03, R05, R06 | `c077912948b6592b44500addbf7fcd38f0ae34d44ad2863060dd68b859b45600` |
| 918 | 0.455 → 0.455 | 39 | S03 | `9f2f0978ab07ce60f142b5c63975e912e00d6b0dfed011d37f8780a473f1720c` |
| 919 | 0.484 → 0.491 | 34 | S04 | `b147871da802c73016c8d3755cea847e3a6bf8025112095a478ee31fbe707dc5` |
| 920 | 0.541 → 0.541 | 36 | 없음 | `1fd560d78ea86dfe8e8b3d6df81244b26b6c268b957e81f31ac1022c52e2e973` |
| 921 | 0.459 → 0.537 | 38 | S05, S06, M02, R04 | `636a66ce80dbf91c30551622bf2d3ceba3855b5a4a78177cf45534f36979e898` |

## 읽기·출처 범위

정본 6편 전체, JA 초안 6편 전체, B6 집필 계약·사실표·출처등록, B12 BRIEF/OWNERSHIP과 현행 문체 규칙 4개를 읽었다. 최근 글은 기존 946–951 기록에 의존하지 않고 현재 JA 958–963 전체를 읽었다. 918 현재 정본도 정확한 파일로 재독했다. 현재 입력 목록은 `checks/ja-author-r2-inputs-current.json`에 SHA와 함께 남겼다. 홈의 `agent-library/knowledge/editorial-voice.md`는 현재 없으므로 실재하는 저장소 정본과 COLUMN-VOICE-RULE, 최신 공용 다양성 규칙·LESSONS를 적용했다.

새 JA 웹 호출은 0이다. 정본의 확인일 2026-10-25와 기존 공식 출처 검증을 유지한다. 916은 보존된 공식 설명 L24–40을 이번에 다시 읽어 인수 전 인지(L28–29)와 246/262 결과(L31–40)를 확인했다. 정부 PDF 전체 416쪽을 새로 읽었다거나 후속 사건까지 갱신했다고 주장하지 않는다.

## 의미 보존 자체 검수

### 915

Taiwan agency cannot refuse supplier mediation. Construction OR technical services; failed party consultation clarified. Committee MUST give recommendation OR proposal. Agency disagreement CAUSING failed mediation triggers inability to refuse supplier arbitration; generic failed mediation is insufficient. Separate contractual arbitration agreement remains possible.

NT44,417,150 is annulled award amount, not evidence of either payment or nonpayment. Claim sequence money→extension→extension recommendation rejected→money without corresponding recommendation. Certificate alone does not fill missing agreement. Agency opportunity to accept/reject that concrete dispute preserved. Art40(1)(2) absence-of-agreement basis only; lower-court legal-version reasoning corrected while result upheld;2017-07-12appeal dismissed/final.

ITA2026-09-30plans forlate2026/2027 remain prospective USsupplier opportunity, not current tender/eligibility/Japanese nationality. Sourcecheck2026-10-25 retained.

- FAQ1 preserves conditional statutory route, constructionORtechnical, disagreementCAUSEfailure and separateagreement; only recommendationORproposal clarified.
- FAQ2 rejects overgeneralization that every amount/legalargument change creates new dispute.

M01 required correction to canonical facts. C01–C03 source-supported precision; R02 retains whole certificate/cause/conclusion. S01 summary becomes factual instead of roadmap.

### 916

Ownership alone insufficient. Control, knowledge, failure to disclose/remedy, liability-evading transfers kept as attributed court reasoning. Current Art154 baseline subscribedshareamount; abuse→specificdebt AND clear repaymentdifficulty AND seriouscircumstances/necessity all retained. Historical2018court reasoning not reduced to currentstatute.

Pre-acquisition knowledge verified retainedofficialL28–29.246portions vacated/remanded,262appeals dismissed; not all original262claims dismissed and not all relatedlitigation ended. Remandreasons include injury/evidence/authority; not eachground asserted forall246. Newopening andR05 retain exact outcomes. Reportrecipient→knowledge/authority→laterremittanceapproval is practical reconstruction, not newlegalretention duty.

Judgment2018-08-16; USTRFebruary2026intention under applicablelaw andwhereappropriateUSprivatepartners, not entryintoforce/individualapproval;USnotJapanese changed.

- FAQ1 preservesownershipalone/conduct/applicablelaw.
- FAQ2 preserves246/262 and procedural distinction, all-relatedlitigation limitation.
- FAQ3 practicalrecords notautomaticcompliance.

MONOTONY lenCV.415 initialactualFAIL preserved. R01/R03/R05/R06 improve causal flow and remove repeated result/preview sentences; no punctuation/threshold/profile changes. Finalactual38sentences,CV.470,short13.2%,noJAregistermix.

### 918

Casecontract4months andcurrentpoint15sixmonths bothfromreceipt ofoccupationpermit, notification notcompletion. SellerMUSTnotify; point14buyerloan documents/procedures/payment duties remain. No universalright tostop payment.

2019-02-23bankletter notreadyhouse notice; utilityconnection later;Julydefects/elevatorunfinished;Augustconsententry nothandover;November5loan payment/November28warrantyhandover. Buyerpaid installments asagreed andfullbeforehandover; builderletter-triggeredfullpaymentargumentrejected.2022-02-09builderappeal/additionalclaims dismissed,delayinterest maintained,noappeal.

2025-08contractinspection excludesbankprocessingtime impermissibleterm;CBC2026-09-18currentrule notretroactive to2022judgment. SourcePDFselectedprinted173–187,notfull416pagesnewread.

- FAQ1 lettercontent/readiness/evidence separate.
- FAQ2 particular4/current6/permittrigger andcontractdate restrictions.
- FAQ3 loanprocessing doesnot excuseallpayment/docsobligations.

Onlysummary rewritten;bodyandFAQallbyte-equivalent. No newcasefact;canonicalpluscontractsource supportsbothpermittriggers.

### 919

Publiccivilservantappraisal/dismissal framework separate fromprivateOSH law. Uponvictimcomplaint employerMUSTpreventrecurrence measures AND neededcounselling/assistance/protection AND investigation. Ifcomplainantwishes MAYcoordinate; failedcoordination MUSTcontinueinvestigation. Objective/fair/impartial,adequatehearing/answer,conflictrules intact.

Prematureexternalannouncement→uppercommittee→owncommittee,notice/hearingmissing,reportinconsistency andlaterreviewcannotcure initialdenial. Bothoriginaldisposition andreviewdecision cancelled; appealspossible, nofindingallconductnonexistent/noassertalreadyreinstated.

Judgment2026-09-03, historicalconductbefore newframework;privateOSH2026-07-01effect andsourcecheck2026-10-25 preserved.

- FAQ1 cancellationnotno-bullyingfinding;appealable.
- FAQ2 concurrentprotection/investigation;allthreeobligations.
- FAQ3 publiccase cannotreplaceprivatelaw/contractanalysis.

Removedwriter-facing sentence about how towrite a guarantee. Surroundingmandatoryactualmeasures/support/investigation retained;noresultguarantee newlycreated. AllFM/FAQunchanged.

### 920

Art11 ownersmeetingresolution forcommonpartdemolition/majorrepair/improvement applied incase; bylaw15 additionallycommitteepermission ANDpowercompanysafetycheck. Art6(1)(5)+6(3) aftercoordinationstillnoncompliance enablescourtrequest.6(1)(4) exists butnotthiscase;notblanketallchargerssamevote.

Ceilinghanginghardware(吊り金具) forpipes,notcasecabletrays;box/commonwall/ceiling/electricalpanel andresident-usedmeter withoutownershipinference. Residentclaimedstopped/locked/WILLINGtogivekeytocommittee;eveniftrue removesno obligation,notalreadyhandedkeyfinding.2022-06-22appealdismissed/removalrestoration.

Subsidyannounced2026-05-29 includescommonareacabletrays;September30applicationdeadlinepast,notliverecruiting orpermission substitute. Laterappeal/finalityunknown explicitlypreserved.

- FAQ1 actualrouting/rights/buildingrules.
- FAQ2 willingness+conditionaljudgment/casescope.
- FAQ3 subsidyrules separatefromconsent,deadlineclosed.

Allsourcebytes unchanged;fullreview foundnomandatorycorrection. Imagealtcabletraydescribesfictionalimage,notcourtceilingfixture;captionpreserved.

### 921

Point18 consumerMAYterminateanytime; operatorMUSTrefund unusedPAIDpoints ORunusedgamefees lessnecessarycost within30daysfromtermination ORmutuallyagreedmethod. Point4within7daysfromgamestart,writtenrescission,noreason/nocost,unusedpurchasedpaidpointsrefund retained separately;notpoint18costwaiver. Point9atleast30daysrecords,within7daysafterrequestprovide; soleoperatorrecordclauseprohibited,notallrecordsinadmissible.

NT243,548requestednotawarded;remainingbattlechipsnotunusedpaidpoints/fees,unusedpaidzero undisputed. Playerseekingoperatorcashredemption conditionalgamblingrationale,notoperatorredeemingfromplayerorallvirtualassetgambling. Playerterminationintent supportedterminationeffect;notallprioroperatorbanreasonsvalidated.2021-09-13appealdismissed/noappeal.

Currentterms2023-01-01effect laterthancase,notretroactivelyapplied.2025firstcomplaintstatisticsrank2anddecreased,published2026-05-07. SelectedPDFprinted140–153,notfull416pagesnewread.

- FAQ1 function/acquisition/use/contract,notcoinlabelalone.
- FAQ2 anytimevs7days;bothunusedobjects,necessarycost30daysORmutual,7daynoreasonnocostwrittenrescission preserved.
- FAQ3 sole-sourceclauseban butnotzerovalueoperatorrecords.

M02 clarifiesplayerredeemsfromoperator. Redundantcoinparagraphdeletedwithoutfactualomission. R04 joinsoperatorobligationandfullcondition inonecoherentlegal sentence;must/mayandORretained. Point4no-cost/no-reasonalreadyexistedandunchanged,notnewmandatoryacrosslocales.

## 문제 문장·이유·수정안·의미

아래 변경은 순서대로 적용된다. 전체 직전·직후 SHA와 Unicode offset, 정확한 재생 결과는 `ja-author-r2-edits.json` 및 `ja-author-r2-replay.json`, 완성본과 최초본의 차이는 `ja-author-r2-diff.patch`에 있다. M01/M02는 잘못되거나 모호한 최초 표현을 정본 의미로 바로잡는다. 그 밖의 변경은 의미를 유지하는 조건 명시 또는 문체 수정이다.

### M01 — 915

이유: An award amount is not evidence of payment or nonpayment; remove unsupported assertion that it was not paid.

수정 전:

金額は支払済みの工事代金ではありません。取消しを受けた判断の額です。

수정 후:

仲裁判断に記された金額だけでは、実際に支払われたかは分かりません。

의미: 최초 표현의 단정/주체를 정본에 맞게 교정.

### C01 — 915

이유: Make recommendation OR proposal explicit; voluntarily retain statutory inability to settle by agreement, without creating cross-locale mandatory detail gate.

수정 전:

現行の[政府調達法第85条の1](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030057)は、契約履行をめぐる紛争を調達審議委員会の調停に付す道を定めています。供給業者が調停を申し立てれば、機関は拒否できません。工事または技術サービスの調停では、委員会は勧告・提案を示す義務を負います。

수정 후:

現行の[政府調達法第85条の1](https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=A0030057)は、契約履行をめぐる紛争について当事者の協議が整わない場合に、調達審議委員会の調停に付す道を定めています。供給業者が調停を申し立てれば、機関は拒否できません。工事または技術サービスの調停では、委員会は勧告または提案を示す義務を負います。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### C02 — 915

이유: Carry explicit OR into causal condition without weakening duty or supplier initiative.

수정 전:

機関がその勧告・提案に同意しなかったために調停が不成立となった場合、供給業者による仲裁への付託を機関は拒めなくなります。

수정 후:

機関がその勧告または提案に同意しなかったために調停が不成立となった場合、供給業者による仲裁への付託を機関は拒めなくなります。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### C03 — 915

이유: FAQ reflects same OR; all other FAQ content unchanged.

수정 전:

調達審議委員会の調停の勧告・提案に機関が同意しなかったために調停が不成立となったことを要します。

수정 후:

調達審議委員会の調停の勧告または提案に機関が同意しなかったために調停が不成立となったことを要します。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### S01 — 915

이유: Summary states concrete issue instead of announcing what article will check.

수정 전:

調停不成立から仲裁へ進む法定の条件と、請求の変遷を示す書類を確認します。

수정 후:

法定の仲裁手続では、調停の対象と仲裁で求める内容の対応が問われます。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### S02 — 916

이유: Summary states actual split disposition instead of reading instruction.

수정 전:

246人と262人で分かれた裁判結果も区別して読みます。

수정 후:

246人に関する部分は破棄差戻し、262人に関する部分は上告棄却となりました。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### R01 — 916

이유: Replace same-length sequential statements with real recipient question and one connected explanation of evidence chain: knowledge, decision authority and later remittance. No filler or statutory changes.

수정 전:

報告書の配布先は、問題を誰が知っていたかを確かめる手がかりです。取締役会の資料や現場への指示を合わせると、対応を決められた人も見えてきます。後の送金承認を読む際には、その時点でどの危険を認識していたかまで戻って検討します。

수정 후:

報告書は誰に届いていたのでしょうか。配布先を取締役会の資料や現場への指示と照合すると、汚染を知った人と対応を決められた人をたどり、その時点の認識と権限に結び付けて後の送金承認を検討できます。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### S03 — 918

이유: Replace roadmap summary with actual evidence and both periods common starting event; no new deadline.

수정 전:

台中の判決が見た手紙、電気・水道、検査と保証書をたどり、契約上の4か月と現行規定の6か月を分けて説明します。

수정 후:

台中の判決は手紙、電気・水道、検査と保証書を照合しました。契約上の4か月と現行規定の6か月は、いずれも使用許可の受領を起点とする通知期間です。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### S04 — 919

이유: Remove writer-facing instruction and unasked guarantee contrast; preceding sentence retains legal measures/support/protection/investigation duties.

수정 전:

再発しない結果を保証するという書き方ではなく、法律が求める措置を実行する義務です。

수정 후:

(삭제: 중복 또는 필자용 문장; 위 의미표의 주변 법적 조건·사실 유지)

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### S05 — 921

이유: Replace summary preview with substantive separation of rescission and termination/refund objects.

수정 전:

現行規定が返金対象とする未使用の有料ポイントやゲーム利用料、7日以内の解除と随時の解約を、履歴の見方とともに説明します。

수정 후:

現行規定では、開始後7日以内の解除と随時の契約終了を区別し、終了時の未使用の有料ポイントやゲーム利用料には返金のルールを設けています。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### S06 — 921

이유: Remove repeated opening fact and unasked zero-balance rebuttal; opening and preceding paragraph preserve remaining chips and absence of unused paid points.

수정 전:

コインは残っていました。使い切ってゼロになったために返せなかった事件ではありません。



수정 후:

(삭제: 중복 또는 필자용 문장; 위 의미표의 주변 법적 조건·사실 유지)

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### M02 — 921

이유: Clarify player redeems chips with operator; avoid operator as person converting its own chips. Preserve conditional case-specific judicial reasoning.

수정 전:

裁判所は、この対戦用チップを業者が現金に換えられるとすれば、賭博に関わるとも述べています。

수정 후:

利用者がこの対戦用チップを業者に換金してもらうことを認めれば、賭博に関わるとも裁判所は指摘しています。

의미: 최초 표현의 단정/주체를 정본에 맞게 교정.

### R02 — 915

이유: Connect missing opportunity to respond and insufficiency of failed-mediation certificate into one explanation; preserve separate correction of lower-court legal-version rationale and maintained annulment. Preview after factual correction was .444, not an actual CLI failure.

수정 전:

調停不成立の証明書はありました。それでも、仲裁に付した具体的な金銭紛争について合意が成立したことにはなりません。[最高法院の説明](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=274693)では、機関にはその紛争についての勧告を受け入れるか拒むかを判断する機会が必要とされています。下級審の適用法の説明には修正を加えつつ、仲裁判断を取り消した結論は維持しました。

수정 후:

調停不成立の証明書はありました。[最高法院の説明](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=274693)によると、機関がその具体的な金銭紛争について勧告を受け入れるか拒むかを判断する機会を欠いていた以上、この証明書だけで仲裁合意の不足を埋めることはできません。下級審の適用法の説明には修正を加えつつ、仲裁判断を取り消した結論は維持しました。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### R03 — 916

이유: Replace fragment and abstract delivery maxim with complete chain of investigation, commissioned work, resource decisions and why unresolved questions/findings/responsible people stay visible. Practical explanation, no new statutory record duty. First preview .440 was not actual CLI.

수정 전:

調査は納品で終わりません。曝露の懸念を誰が調べ、追加でどんな調査を依頼し、結果が事業会社の資金配分にどう反映されたか。回答のなかった質問は、未回答のまま記録するのが実務上の出発点です。買収完了時の楽観的な説明によって、技術上の指摘や対応担当者が資料から消えないようにします。

수정 후:

報告書を受け取った後も、曝露の懸念を誰が調べ、どんな追加調査を依頼し、その結果を事業会社の資金配分にどう反映したかを記録します。未回答の質問も残します。買収完了時の楽観的な説明で、技術上の指摘や対応担当者が資料から消えてしまうと、その後の判断をたどれなくなるためです。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### R04 — 921

이유: Separate consumer right from complete operator obligation; explicitly bind both unused refund objects, necessary cost, termination trigger and30-day return OR mutual agreement. No padding following duplicate deletion; preview .446 was not actual CLI.

수정 전:

現行の[オンラインゲームサービスの定型約款に関する必要記載事項第18点](https://www.ey.gov.tw/File/C27658C15073FF69?A=C)は、消費者がいつでも契約終了（終止）を通知できると定めます。未使用の有料ポイントまたは未使用のゲーム利用料が対象です。必要な費用を差し引いた上で、契約終了から30日以内に返すか、双方が同意した方法で処理しなければなりません。

수정 후:

消費者はいつでも契約終了（終止）を通知できます。[現行のオンラインゲームサービスの定型約款に関する必要記載事項第18点](https://www.ey.gov.tw/File/C27658C15073FF69?A=C)により、業者は未使用の有料ポイントまたは未使用のゲーム利用料から必要な費用を差し引き、契約終了から30日以内に返すか、双方が同意した方法で処理しなければなりません。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### R05 — 916

이유: Remove the generic result preview and join the 246-person remand to its stated reasons; preserve the separate 262-person dismissal of appeals and official link. This makes the procedural contrast concrete without inserting filler or changing outcomes.

수정 전:

結果は一つではありませんでした。最高法院は246人に関する部分を破棄し、さらに審理するよう差し戻しました。262人に関する部分の上告は棄却しています。差戻しには、損害、証拠と請求を行う権限の検討が足りない点が含まれていました（[公式説明の裁判結果](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=359523)）。

수정 후:

最高法院は246人に関する部分を破棄して差し戻し、その理由には、損害、証拠や請求を行う権限について審理が足りない点を挙げました。262人に関する部分の上告は棄却しています（[公式説明の裁判結果](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=359523)）。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

### R06 — 916

이유: Open on the concrete time of knowledge, then connect the report to the conduct assessed by the court. Remove the repeated preview of post-report decisions. Retained official explanation L28–29 supports pre-acquisition knowledge, failure to remedy/disclose, and evasive transfers; original URL and full case reference in source footer retained.

수정 전:

買収前に受け取った環境調査報告書が、親会社の責任を問う証拠になりました。台湾の工場汚染訴訟で最高法院は、汚染を知っていたことを、事業への支配、危険への対応、台湾会社の資産を減らした移転と結び付けて検討しています。[107年度台上字第267號の公式説明](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=359523)に現れるのは、報告書を受け取った後の判断です。

수정 후:

汚染を知ったのは、買収前でした。台湾の工場汚染訴訟で[最高法院](https://jirs.judicial.gov.tw/GNNWS/NNWSS002.asp?id=359523)は、親会社が受け取った環境調査報告書を、事業への支配、危険への不対応や不告知、責任を免れるために台湾会社の資産を減らした移転と結び付けて検討しています。

의미: 정본의 사실·조건·행위자·의무·예외·수치·출처를 보존. 해당 글의 위 의미표 및 전체 최종 문맥 대조.

## 문장 다양성 규칙 5절 자체 점검

1. Actual6sharedCLIexit0; CV0.455–0.541; shortshare0.132–0.179. No rule/profile edits. All6warn87–93%desu-masu is retained consistentpolite register,not aFAIL.
2. Sixdifferentopenings:915awardamount;916timeofknowledge;918letterquestion;919prematureannouncement;920physicalroute;921balance/refundoutcome. No stockhypothetical/fakefirstperson.
3. Atleast2shortsentences each; sentencearrays readincluding longlegalconditions. No consecutive>80characterprosesentences; legalAND/ORconditions notchopped merelyforscore.
4. Paragraphstarts inspected vertically; mostrepeatedopener<=2,consecutive<=1current6. Actualarrays saved.
5. No3claim-statute→caveat templateparagraphs; uncited factual/practicalparagraphs ineach. Citationsstay beside legalmeaning.
6. Contrast count9151/9162/others0; distinctions relate directly to reportedcase misconceptions,notinventedreaderclaims.
7. Lastsubstantiveparagraphs end on concrete mediationrecordchain,investigation/assetapprovals,documenttypes,hearingevidence,installationcostterms andpaidpointconversionhistory. Existingsourcecheck/casescope notes retained,notrewritten as copiedsalesclosing.
8. Consistentです・ます; noだ/であるmix; no bold, inventedfirstperson, imperativechecklistheadings. Titles/headings notcopied acrosscurrentrecent958–963.
9. Meaningmatrix coversallfacts/actors/mustmay/ANDOR/exceptions/amounts/dates/links;FAQ17,canonicalimages6/exactfictioncaptions6 maintained. M01/M02correctinitialambiguity tocanonicalmeaning.

## 남은 독립 감수 범위

별도 검수자가 현재 6 SHA를 고정한 뒤 의미·문체를 재검토해야 한다. 작가가 스스로 독립 승인하지 않는다. 915의 85-1 조건과 기존 의미 오류, 916의 새 도입·결과 문단과 실측 리듬, 921의 환전 주체 및 7일 무비용/18점 필요비용 차이를 우선 대조하면 된다.

915/916의 `/en/contact`는 B12 BRIEF 허용대로 영어 페이지라고 표시해 유지했다. 현행 라우트 정책에는 `/ja/contact`도 있으므로 일본어 페이지가 없다고 주장하지 않는다. 독립 검수에서 같은 언어 링크를 선호할 수 있으나 이번 의미 수정 범위에서는 기존 명시된 영어 링크를 유지했다.

공식 출처의 시점과 원문 불확실성, 그림 직접 확인의 재사용 범위 및 공개 출력 검증의 한계는 위와 같다. 소스 동결은 `ja-author-r2-final-manifest.json`에 기록된다.
