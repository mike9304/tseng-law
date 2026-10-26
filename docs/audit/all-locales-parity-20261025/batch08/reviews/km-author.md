# KM 여섯 판례 칼럼 — 저자 기록

동결 기록 시각: 2026-10-26T07:45:41.455408+00:00. 소유 범위는 batch08의 columns-km6개·본 보고서·checks/km-*다. R/공유 도구/타인 파일을 수정하지 않았고 커밋·게시도 하지 않았다.

판정: 집필 및 자체 의미·문체 확인 완료. 독립 검수는 별도다. 사람 원어민·변호사 승인이나 B8 공개 게시를 주장하지 않는다. 실제 공유 km 최신 입력은6편 모두 FAIL0, 구조 최초6편 오류0·수정5편 재검사 오류0이다.

## 입력과 출처 범위

B8 BRIEF와 참조 B7/B6계약, EN915/916·ZH918/919/920/921 전문, source-freeze/facts/register/contract를 읽었다. 같은 SHA의 연구 열람을 재사용했으며 다른 언어 초안을 정본으로 쓰지 않았다. 원래 입력27개·이미지6개 해시는 checks/km-inputs.json, 재개 시각의 규칙 갱신은 km-inputs-resumed.json에 있다. 홈 editorial-voice.md는 존재하지 않아 프로젝트 정본을 적용했다. Fable 의무를 부활시키지 않았다.

최신 LESSONS15:05 전문을 읽고 SHA ca642a38c2b0a925c19ded6600b2f06901aed057bed44b71fab9c16f22c2b7ab를 기록했다. 최근 KM3편은 번호 최대가 아니라 published 기준704–706이며 전문 읽기와 실제 비교 범위는 km-inputs 및 km-self-review에 있다. 오래된18편에 published가 없어 최초 탐색에서 KeyError가 났던 사실도 보존했다.

법원 자료25일 실제 회신과26일 법령·정책 연구를 구별한다. 이번 KM 집필에서 법원 사이트 재접속 성공이나416쪽 전체 열람을 새로 주장하지 않는다. B3–B6 공개 HTTP 확인은 별도 산출물이고 새 KM6의 출처 연구·배포를 대신하지 않는다.

| ID | 동결 정본 SHA256 |
|---|---|
| 915 | dbc06e56df75f67e92e9fceef19ad1b7c3db4b9ff9396256d3d2d2e043d1966d |
| 916 | 167addba353f1b6c7cfa3f530bc6aeb34b3c1871b33043de35203e9920817cb1 |
| 918 | 43949fd463c3c6a7612dd98d6ffb1007925bc5032a0f3967fe181c1e16fdaa4b |
| 919 | 9696db15f3510d1f1d5b3f0dda3f0471d2e70a25b1bce625ca2fb3a49cceb390 |
| 920 | 59fb9c0ff8d1c5760300cd7e525ef3fd2c8c1bbd4327c589786ba9e4bca2f582 |
| 921 | d7783b6cebeb410766a692fa2eebf3bd3b12bff48bd2615f6468cfd09f8b9484 |

## 실제 수정과 의미 보존

초기6편은 km-initial-snapshots/와 manifest로 보존했다. 작성 중916링크 이름의 잘못된 월(ខែមីនា?)을 실제로 고쳐 ខែកុម្ភៈ2026으로 맞춘 기록은 km-inflight-edits.json에 남겼다. 이후12개 문자열/문장 수정과915후속1개는 아래와 같고, 전체 before/after·diff·SHA·역복원은 km-self-edits.json, km-915-polish.json, km-edit-reversal.json에 있다.

### 915

- 원문: មិនទទួលយកបណ្តឹងឧទ្ធរណ៍របស់អ្នកម៉ៅការ
  수정: បដិសេធបណ្តឹងរបស់អ្នកម៉ៅការទៅតុលាការកំពូល
  이유·의미 보존: Appeal level terminology: name the actual Supreme Court appeal rather than rely on a term that can suggest an intermediate appellate stage. Outcome and court unchanged.
- 원문: កំណត់ត្រាត្រូវបង្ហាញថាគណៈកម្មការបានដោះស្រាយសំណើណា។
  수정: កំណត់ត្រាអាចបញ្ជាក់ថាគណៈកម្មការបានដោះស្រាយសំណើណា។
  이유·의미 보존: Practical record advice: may clarify, without inventing a statutory documentation duty. Specific-claim identity condition stays in the legal paragraphs.

### 916

- 원문: លទ្ធផលមិនដូចគ្នាគ្រប់ផ្នែកទេ។ 
  수정: (해당 중복 문장 삭제)
  이유·의미 보존: Delete a redundant contrast opener; the immediately following246/262 distinctions remain.
- 원문: ឯកសារនេះចុះខែកុម្ភៈ 2026 ហើយនិយាយពីដៃគូអាមេរិក។ វាមិនធានាហិរញ្ញប្បទានឱ្យអ្នកអានភាសាខ្មែរទេ។
  수정: បរិបទនេះសំដៅលើដៃគូឯកជនអាមេរិក។
  이유·의미 보존: Remove repeated February date and an unprompted Khmer-reader rebuttal; preserve US private-partner context, intention/possible financing and applicable-law condition in the preceding sentence.
- 원문:  ឈ្មោះឯកសារមិនបញ្ជាក់ភាពស្របច្បាប់ទេ។
  수정: (해당 중복 문장 삭제)
  이유·의미 보존: Delete generic file-name warning; actual proposed-transfer assessment and risks/resources remain.

### 918

- 원문: កិច្ចសន្យាក្នុងសំណុំរឿងនេះកំណត់ឱ្យជូនដំណឹងក្នុងបួនខែ។
  수정: កិច្ចសន្យាក្នុងសំណុំរឿងនេះកំណត់ឱ្យជូនដំណឹងក្នុងបួនខែចាប់ពីទទួលលិខិតអនុញ្ញាតប្រើប្រាស់។
  이유·의미 보존: Make the four-month notice starting event explicit in its own clause; current six-month rule remains separate.
- 원문: ការដកពេលរៀបចំធានាកម្ចីនិងបញ្ចេញប្រាក់
  수정: ការដកពេលផ្ទៀងផ្ទាត់ឯកសារកម្ចីដោយជួបផ្ទាល់នៅធនាគារនិងបញ្ចេញប្រាក់
  이유·의미 보존: Translate bank face-to-face loan-document confirmation more precisely than arranging a loan guarantee; government-audit date and impermissible excluded period unchanged.

### 919

- 원문: និយោជកឯកជនត្រូវអនុវត្តច្បាប់របស់ខ្លួន
  수정: និយោជកឯកជនត្រូវអនុវត្តច្បាប់ដែលអនុវត្តចំពោះខ្លួន
  이유·의미 보존: Summary clarification: applicable law, not a private company making its own law. Body is byte-identical.

### 920

- 원문: ផ្លូវខ្សែនេះធ្វើឱ្យតុលាការពិនិត្យលើសពីបន្ទាត់គូសកន្លែងចតនៅលើឥដ្ឋ។
  수정: តុលាការពិនិត្យលើសពីកន្លែងចត។
  이유·의미 보존: Shorten the consequence after the full physical route; outside-parking scope remains, without repeating the floor-marking image.
- 원문:  ការរៀបរាប់នេះបង្ហាញផ្លូវភ្ជាប់អគ្គិសនី មិនមែនជាសេចក្តីសម្រេចអំពីកម្មសិទ្ធិលើម៉ែត្រឡើយ។
  수정: (해당 중복 문장 삭제)
  이유·의미 보존: Remove an unprompted meta-comment on legal ownership. The actual route to the resident meter remains and no legal ownership proposition is introduced.
- 원문: គណៈកម្មការបានផ្ញើលិខិតដែលរក្សាច្បាប់ចម្លងជាភស្តុតាង ដើម្បីសម្របសម្រួល ប៉ុន្តែឧបករណ៍នៅតែមិនត្រូវបានរុះរើ។ ដោយមានការបំពាននិងការមិនអនុវត្តក្រោយការសម្របសម្រួលនេះ គណៈកម្មការអាចស្នើឱ្យតុលាការដោះស្រាយតាមកថាខណ្ឌ 3 នៃមាត្រាដដែល។
  수정: គណៈកម្មការបានផ្ញើលិខិតដែលរក្សាច្បាប់ចម្លងជាភស្តុតាង ដើម្បីសម្របសម្រួល ហើយដោយឧបករណ៍នៅតែមិនត្រូវបានរុះរើក្រោយការសម្របសម្រួលលើការបំពាននេះ គណៈកម្មការអាចស្នើឱ្យតុលាការដោះស្រាយតាមកថាខណ្ឌ 3 នៃមាត្រាដដែល។
  이유·의미 보존: Connect coordination and continued noncompliance to the resulting may-seek-court-relief in one causal sentence. Article6(1)(5) violation, coordination, failure and6(3) all preserved.
- 원문: អ្នករៀបចំដំឡើងអាចស្នើឱ្យអ្នកម៉ៅការគូរទីតាំងប្រអប់សាក ផ្លូវខ្សែលើជញ្ជាំង សសរ និងពិដាន ព្រមទាំងប្រអប់អគ្គិសនីដែលត្រូវភ្ជាប់។ បន្ទាប់មកអាចយកប្លង់នោះទៅផ្ទៀងផ្ទាត់ឯកសារសិទ្ធិ បទបញ្ជាអគារ និងសេចក្តីសម្រេចប្រជុំដែលមានស្រាប់។
  수정: អ្នករៀបចំដំឡើងអាចស្នើឱ្យអ្នកម៉ៅការគូរទីតាំងប្រអប់សាក ផ្លូវខ្សែលើជញ្ជាំង សសរ និងពិដាន ព្រមទាំងប្រអប់អគ្គិសនីដែលត្រូវភ្ជាប់ ដើម្បីយកប្លង់នោះទៅផ្ទៀងផ្ទាត់ឯកសារសិទ្ធិ បទបញ្ជាអគារ និងសេចក្តីសម្រេចប្រជុំដែលមានស្រាប់។
  이유·의미 보존: Join the requested route drawing with its concrete purpose: comparing rights, bylaws and existing resolutions. All locations and documentary categories remain.

915후속: `តុលាការកំពូលបដិសេធបណ្តឹងរបស់អ្នកម៉ៅការទៅតុលាការកំពូល` → `តុលាការកំពូលបានបដិសេធបណ្តឹងបន្តរបស់អ្នកម៉ៅការ`. 실제 분절을 읽다가 같은 문장에 최고법원 명칭이 두 번 들어간 것을 발견했다. 명시된 최고법원 주어와 불복 기각·취소 유지는 그대로다.

역복원은 현재 파일에서 실제 edit span을 거꾸로 적용해6개 초기 파일 전체 바이트·SHA가 일치함을 확인했다. URL 순서는6편 모두 불변이고 FAQ17개도 불변이다. 숫자 전체 순서를 무조건 같다고 주장하려던 보조 증거 스크립트는916에서 중복된2026한 번을 삭제한 탓에 실제 exit1이었다. 이 실패·기존 스크립트를 보존한 뒤 그 삭제 한 건과 원래 월/연도 유지만 명시해 다시 검증했다. 원고·공유 도구·임계값을 증거 실패에 맞춰 바꾸지 않았다.

## 실제 공유 검사와 경계

Node24.14.1 / ICU78.2 / Unicode17.0, 정확한 --lang km. 단위는 Unicode 공백으로 나눈 구절 안에서 ICU dictionary wordlike 분절이다. 공백 수를 단어 수로 취급하지 않았고 점수용 공백 삽입은 없었다. 공용 프로필을 변경하지 않았다.

| ID | 실제 분절 | CV | 8단위 이하 비율 | 근거 |
|---|---:|---:|---:|---|
| 915 | 36 | 0.463 | 0.194 | km-variety-final-915.json |
| 916 | 40 | 0.528 | 0.150 | km-variety-revised.json |
| 918 | 39 | 0.479 | 0.128 | km-variety-revised.json |
| 919 | 37 | 0.495 | 0.135 | km-variety-initial.json |
| 920 | 40 | 0.495 | 0.125 | km-variety-revised.json |
| 921 | 44 | 0.461 | 0.182 | km-variety-initial.json |

최초 CLI는6편 중920 CV.411만 FAIL(exit1); 수정4편 CLI exit0;915마지막 문장만 실제 다시 실행해 exit0이다. 총3회 CLI·11개 파일 검사를 했으며 무변경 전수검사를 반복하지 않았다.919는 요약만 바뀌었고 원래 측정한 본문 바이트가 동일하다.921은 원고 전체 SHA가 동일하다. 재사용 조건은 km-final-boundaries.json에 각각 기록했다.

236개 추출 구간을 모두 직접 읽었다.915의 금액 NT$44,417,150/85-1/40과 판결번호,916의154/246/262,918의4·6개월과11월5·28일,919의22-2,920의6(1)(4)/6(3),921의243,548과별개7·30일 문장이 정상 경계에 남는다. Khmer ។ 종결·질문표·중국어 사건번호·콤마 금액이 잘못 갈라지지 않았다. 각 단락의 실제 visible text와 추출문 재조립은 공백만 제외하고 동일하고, ICU 단위에도 문자·결합기호·숫자 손실이 없다. 이 재현은 단위가 사람이 정한 자연 단어와 동일하다는 보장은 아니다. 915표/921표의 콜론 도입2개도 공유 분절에 포함된다.

## 조건·FAQ·메타 확인

- 915: Construction OR technical services; recommendation OR proposal for the specific claim; failure because the public entity disagrees; separate arbitration agreement possibility. Monetary→extension→extension recommendation/rejection→monetary sequence retained. NT$44,417,150 remains the annulled award, final Supreme Court annulment result is dated2017-07-12. ITA2026-09-30 concerns planned late2026/2027 opportunities and US suppliers, not Khmer nationality or already-open tenders.
- 916: Control plus pollution knowledge, failure to notify/remediate and capital reduction/remittances to avoid liability remain contextual facts, not an ownership-only test. Company Act154(1) paid-share limit and154(2) abuse→particular debt+obvious repayment difficulty+seriousness/necessity preserved.246vacated/remanded versus262appeals dismissed; neither is converted to universal no-compensation. Historical case is distinguished from current154. USTRFebruary2026 intention/possible support/applicable law and US private partners remain.
- 918: Presale means unfinished housing, not necessarily unstarted construction.2019February23 loan letter, no connected water/electricity, July elevator installation unfinished, August access for interior work/cleaning, November5loan disbursement andNovember28handover are distinct. Contract4months and current6months are notice periods starting from use-permit receipt, not loan approval or completed physical delivery. Buyer payment/documents cooperation remains.2025audit and2026CBC September18effective rule are current comparisons, not retroactive adjudication. Taichung High Court appeal+additional claim rejected on merits; no further appeal retained.
- 919: Public-official single disciplinary action with two major demerits; original and review decisions both vacated; appealability retained, no no-bullying/reinstatement guarantee. Premature public decision, higher authority first, insufficient hearing and contradictory report retained. Private employer July1,2026 rules separated.22-2objective/impartial/fair, recusal, adequate explanation/defense; complaint triggers prevention measures+need-based support/protection+investigation. Willing complainant permits coordination; failed coordination requires continued investigation. Prevention measures, not guaranteed absence of recurrence.
- 920: Kaohsiung High Court June22,2022 appeal dismissal keeps removal/restoration. Walls/ceiling/common box and resident-meter route remain; no legal-meter-ownership adjudication claimed. National law11 unit-owners meeting versus building bylaw15committee permission AND power-company safety inspection retained.6(1)(5)violation+coordination+continued failure→6(3)may seek relief.6(1)(4)not applicable here, without unsupported party attribution. Even-if-true shutdown/lock/key defense does not remove the specific removal duty. May29,2026 subsidy is common-area cable trays, September30deadline passed, possible early budget exhaustion; no replacement for consent. Later finality unverified.
- 921: Keelung District Court September13,2021 appeal dismissed/no further appeal, NT243548claimed not awarded. Remaining competition chips are not unused paid points; no claim that every remaining chip had been used, no universal coin ban. Cash conversion/gambling reasoning specific to this game; consumer termination not blanket validation of operator bans. Current18 permits anytime notice; unused balance scope covers both paid points OR game fees, necessary costs, within30days after termination OR mutually agreed other method. Current4written withdrawal within7days after starting/no reason or cost and unused-point refund; current9at least30days record retention/provision within7days after request, prohibition6no exclusive operator-record clause.2022amendment/2023effective follows2021case.2025first-complaint category second rank and year-on-year decline announcedMay7,2026 retained. No password demand.

FAQ17개(2/3/3/3/3/3), topic/audience km/internal author/date26와 exact caption `ឈុតឆាកប្រឌិត`를 실제 재파싱했다. 원문 공식 URL 고유 수4/3/4/4/4/4가 각각 본문 인라인과 말미에 모두 있다.915/916의 /en/contact는 영어 페이지라고 링크 문구에 표시했고,916내부 칼럼은 실제 KM004경로다. 연락은편당한번이고 상담 언어·국적·승소를 보장하지 않는다. 공용 content-audit sourceMap은 실제 basename별 frozen alias와 EN2/ZH4 sourceLocale을 쓴다.

이미지는 직접 열었던 동일 원본6개의 바이트를 재사용했다.915안전모·도면·바인더·교량모형,916토양용기·노트·접이식탁자·공장,918서류·봉투·상자하나,919원탁·파일철하나·의자셋,920기둥충전기·전기차·상부배선,921컨트롤러·추상게임·토큰·노트와 alt를 맞췄다. 새 B8 이미지 열람으로 횟수를 부풀리지 않았다. 이미지 SHA와 메타 실제값은 km-final-metadata.json에 있다.

## §5와 MONOTONY

1. Actual shared --lang km CLI final latest results FAIL0. Initial920len_cvFAIL0.411 preserved. Only changed bodies rerun;919summary-only reuses exact body;921unchanged reuses initial. No unsupported result, different locale, threshold change or synthetic spaces.
2. No stock hypothetical opener. Broad fact/sequence2, actual spatial/physical scene2, reader question1, numeric1; no type exceeds3 and scenes do not exceed2. Real case descriptions are not invented client scenes.
3. All six have at least5 <=8 ICU-unit segments; every paragraph has at most one >=32-unit segment. Units are ICU proxies, not human natural-word gold. Two colon lead-ins are included by the shared segmentation; complete short sentences also remain.
4. Paragraph openers and consecutive sentence starts read vertically; largest repeated opener count2, no mechanical repeated-start run.
5. Law subjects/inline citations/table/source paragraphs vary. All six retain uncited practical/result/question paragraphs. No three consecutive claim-parenthetical-caveat paragraph formula observed.
6. Necessary legal negatives and exception limits preserved.916generic contrasts and920unsolicited meter-ownership rebuttal removed. Actual contrast scopes read manually; the checker’s contrast0 does not prove that Khmer contains no contrast.
7. Substantive closings identify claim-history documents, report/response/transfer approvals, loan/inspection/handover records, notice/hearing/reasons, approved cable route/cost terms and payment/conversion/use records. Required verification dates, scope and source list are structural tails and retained.
8. Khmer explanatory register, no decorative bold/public byline/human reviewer claim/invented first person; specific headings instead of command checklist titles. KO/JA-register rules not applicable.
9. All source URLs and FAQ17 preserved, images same bytes and exact fictional caption. Statute numbers, amounts, AND/OR, must/may, starting events and case status directly contrasted. One duplicated2026numeric token deliberately removed in916; February2026 remains in inline source label/footer, no distinct date proposition removed.

MONOTONY: 문장 길이 — 920 초기의 협의/불이행·경로/도면 문단 — 실제 인과·목적 관계를 연결하고 짧은 결과문과 조합했다. CV.411→.495. 조건이나 출처를 버리지 않았다.
MONOTONY: 불필요 대비 — 916의 크메르어 독자 금융보장 부정 문장 — 원출처의 미국 민간파트너 범위를 직접 밝혔다. 중복 판결결과·문서명 경고,920소유권 메타반박도 제거했다.

기계 contrast0을 크메르어 대비0개라는 판정으로 쓰지 않는다. 법적 부정·예외·판결 범위는 필요한 내용으로 직접 읽었다.919본문 q0은 보고된 시간 순서와 보호/조사 요건이 설명을 구성하기 때문이며 점수용 질문을 넣지 않았다. 제목 질문은본문질문수와 구별했다. 필요한 적용범위/검증일/출처는 구조적 꼬리 예외로 보존하고, 그 직전 실질 결말을 각 사건의 자료·행동으로 마무리했다.

최근3편과 도입·소제목·실질결말 및 첫두문단의 문장별 삭제 시 정보손실을 km-self-review.json에 저장했다. 모든 현재파일의 마지막 실질 문단과 실제 질문·짧은구간 수도 기록했다.

## 최종 SHA256

| ID | 원고 SHA256 |
|---|---|
| 915 | f925dfd62505ed705895030ba159e116e53edbc14d2d79456bef0aa6d201dd00 |
| 916 | 2cf0a993ebac8aafc2f0a16b25b8c91313f438bb2a3f3d9109ec78ae670c596b |
| 918 | a318132eb11b543d32d7ac10a1eb25c572b1b244167ca0931282fc0bc6235dd7 |
| 919 | 65df5af65f28e6f7486a3ef26e349fc9e4a98b2e3b3f0064b5cc5eb06159b2e8 |
| 920 | 33d39d9d764163bf7b7e8a7281bb387048e338ad09986e8fffb2c107b1761741 |
| 921 | 238e63766846ce8a50a0da533141b362a65a483eec54be6036875cfa174ca7fb |

자체 검수에서 미해결 필수0. 다음 단계는 독립 의미 검수이며 기계 통과가 이를 대체하지 않는다. 원고가 고정된 뒤 같은 입력의 검사를 반복하지 않는다. 새 필수교정이 전달되면 그 변경 부분과 영향을 검증한다.


## 공유 설치 변경과 검사 wrapper 증거 정정

최종 증거 대조 중 공유 expansion SHA가 c8f5368fa0d8747e96ac9483c37227155083cb10a3e687fca2b10bca7add82bc에서 ea03abaa59249d7d914e1c98a5231a5c1636528dd1ecda326b0d4638edf17975로 바뀌어 해시 동일성 검사가 실제 실패했다. 실패는 km-shared-hash-change.json에 남겼다. Root 승인 설치 영수증과 실제 diff를 읽었다. 변경은 FI 접속 날짜와 공통 visible_text의 ASCII escape·code span 처리이며, KM 프로필·ICU 단위·임계값은 그대로다. corpus-delta의 기존 KM은24행이고 모두 불변이다.

그 사실만으로 이번6편까지 무영향이라고 추정하지 않았다. 현재 원고6개 SHA를 고정하고 실제 새 공유 API로 문단·236분절 전체·각 분절 단위 수·모든 metrics·소제목·목록 배열을 이전 실제 CLI 추출과 정확 비교했다. 여섯 본문 모두 백슬래시0이며 전체 배열·지표가 동일했다. 새 CLI나 회귀 전수실행은0회다. 따라서 원고별 기존 실제 PASS를 재사용하며, 이를 새 CLI를 실행한 결과로 쓰지 않는다. 증거는 km-shared-installation-compatibility.json이다.

로컬 wrapper의 toolHashes 목록이 복사 당시 profiles/da.json을 가리킨 기록 실수도 발견했다. 실제 명령과 추출 locale은 처음부터 --lang km였다. 정확한 KM 프로필 SHA87c3558f74be7faaab25178d605a5dc332607046e64799ecbfd28cdbca688521는 집필 초기와16:29재개 입력에 이미 기록돼 있고 현재도 동일하다. wrapper의 기록 경로만 바로잡았으며 원본 실제 CLI JSON은 바꾸지 않았다. km-wrapper-provenance-correction.json에 전후 wrapper SHA·정확한 한 문자열 변경이 있고 원래 wrapper도 역복원해 보존했다. 이 정정이 원고 점수나 공유 검사기를 바꾼 것은 아니다.

추가 기록 전 저자 보고서는415e103e43371ac769ba23d880eb35b3de0bd223c4359478a86129c883cd242c였으며 전체 prefix를 별도 보존했다. 원고6개는 위 최종 SHA 그대로다. 현재 최종 manifest에는 최초 실제 도구 기록과 현재 적용 가능한 올바른 KM 도구 해시를 구분한다.
