# 본문 AI 작성 표기 제거 검수 — 2026-10-03

사용자 요청: 모든 글에서 AI 법률 어시스턴트가 작성했다는 표시를 제거하고 글은 유지한다. 이 요청은 기존 EDITORIAL-VOICE의 공개 AI 작성 표기 보존 규칙보다 우선한다. 내부 `author: legal-ai-assistant` 출처 정보는 수정하지 않았다.

## 변경 범위와 보존 확인

- 검사 기준: `1475ad7ea5683f8d39324324f7a47e4f0cf42ae5` 및 수정 직전 `src/content` 전체 파일 바이트.
- `1158`개 파일 중 `33`개 칼럼 본문, `36`개 명시적 작성 표기 구간만 수정했다. 나머지 `1125`개 파일은 SHA-256 비교로 동일함을 확인했다.
- 모든 수정 파일의 frontmatter 바이트, URL 목록 및 모든 숫자열은 변경 전후 동일하다. 제목·요약·본문의 법률 내용·출처·확인일·면책/불확실성 안내를 유지했다.
- AI 생성 이미지/영상에 관한 출처와 허구 장면 안내는 유지했다. AI 상고장 등 기사 주제 자체에 관한 AI 언급, 산업 분야로서의 인공지능 언급, 외국어의 일반 단어 `ai`는 유지했다.
- 사람 또는 변호사가 작성·검토했다는 대체 표기를 추가하지 않았다. `AI-prepared` 등 일반 AI 작성 문구도 같은 요청 범위로 제거했다.
- 전체 `src/content` 텍스트를 AI/assistant 및 다국어 AI 표현으로 검색하고 각 일치 문맥을 분류했다. 애매하여 미결로 남긴 작성 표기는 없다.
- 문체 개작이 아니라 명시한 작성 표기 구간만 삭제·연결했다. 첫 두 문단 및 직전 같은 언어 3편과의 문체 비교에 따른 추가 수정은 적용하지 않았다.

## 실행 검증

```text
python3 /tmp/tseng-inline-attribution-20261003.py
PASS explicit attribution transformations: 36 spans across 33 articles
PASS unchanged frontmatter, URLs and digits: 33 / 33
PASS unchanged SHA-256: 1125 / 1125 other src/content files
```

기계 검증은 변경 전후를 아래 명시적 치환 목록과 대조하여, 그 목록 밖 바이트 변경이 없음을 확인했다. 전체 파일 해시: `/tmp/tseng-inline-attribution-20261003-manifest.json`; 치환 원장: `/tmp/tseng-inline-attribution-20261003-ledger.json`. 아래 diff는 원문 줄 전체와 변경 줄 전체를 함께 보존한다.

## 추가 검수

- 작성 주체 표현 후속 검색(`AI Assistant`, `AI助理`, `AIアシスタント`, `AI 어시스턴트`, `AI協作`, `AI-prepared`, `AI가 작성한`, `AIが作成した`, `AI協助`)은 `author:` 및 이미지 메타데이터를 제외한 Markdown 본문에서 0건이다.
- `git diff --check -- src/content`는 zh103의 기존 Markdown hard break(날짜 뒤 공백 두 개)를 변경 줄에서 표시했다. 이 공백은 원래부터 있던 날짜/면책문 줄 구분으로, 렌더링 보존을 위해 그대로 두었다. 새로 추가한 불필요한 공백은 없다.
- `git -c core.whitespace=-blank-at-eol diff --check -- src/content`는 exit 0이다. 이 설정은 이 검증 명령에만 적용했고 저장소 설정은 바꾸지 않았다.

## 파일별 변경 전후

### `src/content/columns-en/092-taiwan-bank-inheritance-us-power-of-attorney.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -79 +79 @@
-*AI-prepared general information, not individualized legal advice. Sources checked October 3, 2026 (Taiwan time).*
+*General information, not individualized legal advice. Sources checked October 3, 2026 (Taiwan time).*
```

### `src/content/columns-en/099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -112 +112 @@
-This column was written by the site's Legal AI Assistant from public court judgments and statutes. Sources checked on 3 October 2026.
+This column draws on public court judgments and statutes. Sources checked on 3 October 2026.
```

### `src/content/columns-en/109-taiwan-road-rage-baseball-bat-fracture-damages.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -125 +125 @@
-This column was written by the site's Legal AI Assistant from public court judgments and statutes. Sources checked on 3 October 2026.
+This column draws on public court judgments and statutes. Sources checked on 3 October 2026.
```

### `src/content/columns-en/112-micron-taiwan-trade-secret-cases-lessons-for-us-companies.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -138 +138 @@
-*AI-prepared general information, not individualized legal advice. Sources checked October 3, 2026 (KST).*
+*General information, not individualized legal advice. Sources checked October 3, 2026 (KST).*
```

### `src/content/columns-ja/099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -123 +123 @@
-この記事は法律AIアシスタントが公開されている判決文と法令をもとに作成しました。資料確認日：2026年10月3日。
+この記事は公開されている判決文と法令をもとに作成しました。資料確認日：2026年10月3日。
```

### `src/content/columns-ja/109-taiwan-road-rage-baseball-bat-fracture-damages.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -140 +140 @@
-この記事は法律AIアシスタントが公開の判決文と法令をもとに作成しました。資料確認日：2026年10月3日。
+この記事は公開の判決文と法令をもとに作成しました。資料確認日：2026年10月3日。
```

### `src/content/columns-ja/111-tsmc-kumamoto-jasm-taiwan-outbound-investment-rules.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -92 +92 @@
-*AIが作成した一般的な法制度情報であり、個別案件への法律助言ではありません。資料は2026年10月3日（台湾時間）に確認しました。*
+*一般的な法制度情報であり、個別案件への法律助言ではありません。資料は2026年10月3日（台湾時間）に確認しました。*
```

### `src/content/columns-zh/077-taiwan-chain-rear-end-first-impact-evidence.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -81 +81 @@
-本文由法律AI助理依公開官方資料撰寫，僅供一般法律資訊參考，不是個案法律意見。未直接檢視兩案原始影像或完整卷證；個案責任仍須依具體事證判斷。
+本文依公開官方資料撰寫，僅供一般法律資訊參考，不是個案法律意見。未直接檢視兩案原始影像或完整卷證；個案責任仍須依具體事證判斷。
```

### `src/content/columns-zh/078-taiwan-bus-sudden-braking-passenger-carrier-liability.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -64 +64 @@
-本文由法律AI助理撰寫，依上述公開判決作個案法律資訊整理；未檢視原始事故影音，亦非就特定讀者案件提出的法律意見。
+本文依上述公開判決作個案法律資訊整理；未檢視原始事故影音，亦非就特定讀者案件提出的法律意見。
```

### `src/content/columns-zh/079-taiwan-accident-stop-dialogue-hit-and-run-evidence.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -74 +74 @@
-本文由AI助理依公開官方資料整理，供一般資訊參考，不是個案法律意見。法規查閱日：2026年10月2日。
+本文依公開官方資料整理，供一般資訊參考，不是個案法律意見。法規查閱日：2026年10月2日。
```

### `src/content/columns-zh/080-taiwan-borrowed-car-owner-driver-key-custody-liability.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -81 +81 @@
-本文依公開法規與裁判整理，由法律AI助理撰寫，提供一般法律資訊；個別案件仍須依其事實、證據及適用法規判斷。
+本文依公開法規與裁判整理，提供一般法律資訊；個別案件仍須依其事實、證據及適用法規判斷。
```

### `src/content/columns-zh/081-taiwan-car-repair-cost-estimate-parts-depreciation.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -94 +94 @@
-本文由法律AI助理依公開判決與法規整理，資料查核日為2026年10月2日。判決所列證據內容依判決記載說明，未另取得訴訟卷內照片、完整估價單或筆錄。個案是否成立及可請求金額，仍須依實際資料判斷。
+本文依公開判決與法規整理，資料查核日為2026年10月2日。判決所列證據內容依判決記載說明，未另取得訴訟卷內照片、完整估價單或筆錄。個案是否成立及可請求金額，仍須依實際資料判斷。
```

### `src/content/columns-zh/082-taiwan-mediation-delayed-injury-rescission.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -77 +77 @@
-作者：legal-ai-assistant（AI 撰寫）。依公開官方資料整理，供一般法律資訊參考。法規查閱日：2026年10月2日。
+依公開官方資料整理，供一般法律資訊參考。法規查閱日：2026年10月2日。
```

### `src/content/columns-zh/083-taiwan-accident-assessment-secondary-cause-compensation-ratio.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -99 +99 @@
-資料說明：本文依上述公開民事判決及2026年10月2日查得的官方法規整理。未確認本件民事判決是否上訴或已確定；判決中提及其他刑事裁判的部分，不據此擴張為其他案件的結論。本文未取得原始監視器影片，影像內容均以判決記載為據。本文由 AI 協助撰寫與資料核對，供一般法律資訊參考，個案仍須依完整資料判斷。
+資料說明：本文依上述公開民事判決及2026年10月2日查得的官方法規整理。未確認本件民事判決是否上訴或已確定；判決中提及其他刑事裁判的部分，不據此擴張為其他案件的結論。本文未取得原始監視器影片，影像內容均以判決記載為據。本文經資料核對，供一般法律資訊參考，個案仍須依完整資料判斷。
```

### `src/content/columns-zh/084-taiwan-car-accident-work-loss-rest-note.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -20 +19,0 @@
-作者：法律AI助理
@@ -100 +99 @@
-註：本文由法律AI助理依公開官方資料撰寫，供一般法律資訊參考。法規查閱日為2026年10月2日。兩案後續是否上訴、是否確定均未確認；臺中案判決末另有附條件的第三審上訴教示。個案認定仍取決於實際事證。
+註：本文依公開官方資料撰寫，供一般法律資訊參考。法規查閱日為2026年10月2日。兩案後續是否上訴、是否確定均未確認；臺中案判決末另有附條件的第三審上訴教示。個案認定仍取決於實際事證。
```

### `src/content/columns-zh/085-taiwan-accident-family-care-necessity-period.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -20 +19,0 @@
-作者：法律AI助理（legal-ai-assistant）
@@ -74 +73 @@
-本文由法律AI助理依官方公開資料撰寫，供一般法律資訊參考，不取代個案法律意見。法規查閱日：2026年10月2日。上述兩件二審判決末尾均載明不得上訴；本文未另取得確定證明書或查核非常救濟程序。
+本文依官方公開資料撰寫，供一般法律資訊參考，不取代個案法律意見。法規查閱日：2026年10月2日。上述兩件二審判決末尾均載明不得上訴；本文未另取得確定證明書或查核非常救濟程序。
```

### `src/content/columns-zh/086-taiwan-car-repair-rental-cost-repair-period-evidence.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -20 +19,0 @@
-作者：法律AI助理
@@ -70 +69 @@
-本文由法律AI助理依公開官方資料撰寫，資料查核日為2026年10月2日。判決提到的租約、發票及車廠函覆，均依公開判決記載整理，未取得原始卷證。本文供一般法律資訊參考，個案仍須依實際資料判斷。
+本文依公開官方資料撰寫，資料查核日為2026年10月2日。判決提到的租約、發票及車廠函覆，均依公開判決記載整理，未取得原始卷證。本文供一般法律資訊參考，個案仍須依實際資料判斷。
```

### `src/content/columns-zh/087-taiwan-retaliatory-driving-rear-ended-intentional-injury.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -59 +59 @@
-本文以 AI 協作整理公開判決與官方法規。資料查核日：2026-10-02；全國法規資料庫頁面所示法規整編截止日：2026-09-24。
+本文整理公開判決與官方法規。資料查核日：2026-10-02；全國法規資料庫頁面所示法規整編截止日：2026-09-24。
```

### `src/content/columns-zh/088-taiwan-racing-no-contact-joint-tort-liability.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -54 +54 @@
-本文由AI協作撰寫並核對所列公開資料。公開來源擷取日期為2026年10月2日（UTC），臺灣核對日期為2026年10月3日；全國法規資料庫顯示的法規整編截止日為2026年9月24日。
+本文依所列公開資料撰寫並核對。公開來源擷取日期為2026年10月2日（UTC），臺灣核對日期為2026年10月3日；全國法規資料庫顯示的法規整編截止日為2026年9月24日。
```

### `src/content/columns-zh/089-taiwan-truck-blocking-multiple-dashcam-evidence.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -81 +81 @@
-撰文：法律AI助理。本文依公開判決與官方法規整理，僅供一般資訊參考。查核日：2026-10-03（臺灣）；法規資料庫所示整編截止日：2026-09-24。
+本文依公開判決與官方法規整理，僅供一般資訊參考。查核日：2026-10-03（臺灣）；法規資料庫所示整編截止日：2026-09-24。
```

### `src/content/columns-zh/090-green-light-red-light-pedestrian-third-person.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -59 +58,0 @@
-法律AI助理撰文
```

### `src/content/columns-zh/093-taiwan-gas-station-tanker-reversing-beeper-liability.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -78 +78 @@
-本文由法律AI助理依公開官方判決與法規整理，未取得原始影片及訴訟卷證，供一般法律資訊參考。查核日為2026年10月3日；全國法規資料庫頁面所示整編截止日為2026年9月24日。兩案上訴及確定情形均未確認。
+本文依公開官方判決與法規整理，未取得原始影片及訴訟卷證，供一般法律資訊參考。查核日為2026年10月3日；全國法規資料庫頁面所示整編截止日為2026年9月24日。兩案上訴及確定情形均未確認。
```

### `src/content/columns-zh/097-taiwan-parking-wheelstop-latch-service-safety-causation.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -62 +62 @@
-本文由法律AI助理協作撰稿，依官方判決、法條及沿革進行資料查核，未取得原始監視器影片或訴訟卷證；僅供一般法律資訊參考。法規查核日為2026-10-03，資料庫顯示整編截止2026-09-24。依[消保法沿革](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0170001)及[施行細則沿革](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0170002)，第7條、第7條之1最後修正或增訂於2003年，第51條最後修正於2015-06-17；細則第5條最後修正於2003年。2022年案發、2024年判決時的相關條文，與本次查得版本相同；查核範圍以資料庫已整編內容為限。
+本文依官方判決、法條及沿革進行資料查核，未取得原始監視器影片或訴訟卷證；僅供一般法律資訊參考。法規查核日為2026-10-03，資料庫顯示整編截止2026-09-24。依[消保法沿革](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0170001)及[施行細則沿革](https://law.moj.gov.tw/LawClass/LawHistory.aspx?pcode=J0170002)，第7條、第7條之1最後修正或增訂於2003年，第51條最後修正於2015-06-17；細則第5條最後修正於2003年。2022年案發、2024年判決時的相關條文，與本次查得版本相同；查核範圍以資料庫已整編內容為限。
```

### `src/content/columns-zh/098-taiwan-motorway-blocking-no-collision-public-danger.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -66 +66 @@
-AI協作註：本文由法律AI助理以AI協作整理公開判決及官方法規，僅供一般資訊參考，並非個案法律意見。資料核對日：2026-10-03；法務部頁面顯示法規整編截止日：2026-09-24。
+註：本文整理公開判決及官方法規，僅供一般資訊參考，並非個案法律意見。資料核對日：2026-10-03；法務部頁面顯示法規整編截止日：2026-09-24。
```

### `src/content/columns-zh/099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -126 +126 @@
-本文由法律AI助理依據公開判決書與法規撰寫，資料確認日：2026-10-03。
+本文依據公開判決書與法規撰寫，資料確認日：2026-10-03。
```

### `src/content/columns-zh/100-taiwan-lowered-height-gantry-state-compensation-driver-fault.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -65 +65 @@
-作者：法律AI助理。本文由AI協作撰稿，依完整官方裁判與公開法規查核，未取得原始行車影像或訴訟卷證；供一般法律資訊參考。查核日：2026-10-03，全國法規資料庫顯示整編截止2026-09-24。
+本文依完整官方裁判與公開法規查核，未取得原始行車影像或訴訟卷證；供一般法律資訊參考。查核日：2026-10-03，全國法規資料庫顯示整編截止2026-09-24。
```

### `src/content/columns-zh/101-taiwan-flying-object-truck-origin-dashcam-evidence.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -69 +69 @@
-本文由AI協助整理，依公開裁判與法規撰寫，屬一般法律資訊，不代表個案法律意見。
+本文依公開裁判與法規撰寫，屬一般法律資訊，不代表個案法律意見。
```

### `src/content/columns-zh/102-taiwan-motorcycle-passenger-compulsory-insurance-unlicensed-recourse.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -73 +73 @@
-本文由法律AI助理依公開判決及官方資料撰寫，提供一般法律資訊，並非個別案件的法律意見。未取得原始事故影像或卷證。法規查核日為2026年10月3日；本文所述本法第7、9、11、13、29條及第27條第3項，與事故時、判決時版本相同。[事故時版本](https://law.fsc.gov.tw/LawContentHistory.aspx?hid=702&id=FL006889)、[判決時版本](https://law.fsc.gov.tw/LawContentHistory.aspx?hid=862&id=FL006889)
+本文依公開判決及官方資料撰寫，提供一般法律資訊，並非個別案件的法律意見。未取得原始事故影像或卷證。法規查核日為2026年10月3日；本文所述本法第7、9、11、13、29條及第27條第3項，與事故時、判決時版本相同。[事故時版本](https://law.fsc.gov.tw/LawContentHistory.aspx?hid=702&id=FL006889)、[判決時版本](https://law.fsc.gov.tw/LawContentHistory.aspx?hid=862&id=FL006889)
```

### `src/content/columns-zh/103-taiwan-uninsured-settlement-excludes-compulsory-insurance-fund-deduction.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -20 +20 @@
-作者：legal-ai-assistant（AI 撰寫）｜資料核對日期：2026-10-03  
+資料核對日期：2026-10-03  
```

### `src/content/columns-zh/109-taiwan-road-rage-baseball-bat-fracture-damages.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -145 +145 @@
-本文由法律AI助理依據公開判決書與法規撰寫，資料確認日期：2026年10月3日。
+本文依據公開判決書與法規撰寫，資料確認日期：2026年10月3日。
```

### `src/content/columns/099-taiwan-road-rage-freeway-cut-in-sentence-reduced.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -105 +105 @@
-이 글은 법률 AI 어시스턴트가 공개 판결문과 법령을 바탕으로 작성했습니다. 자료 확인일: 2026-10-03.
+이 글은 공개 판결문과 법령을 바탕으로 작성했습니다. 자료 확인일: 2026-10-03.
```

### `src/content/columns/109-taiwan-road-rage-baseball-bat-fracture-damages.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -117 +117 @@
-이 글은 법률 AI 어시스턴트가 공개 판결문과 법령을 바탕으로 작성했습니다. 자료 확인일: 2026-10-03.
+이 글은 공개 판결문과 법령을 바탕으로 작성했습니다. 자료 확인일: 2026-10-03.
```

### `src/content/columns/110-korean-supplier-tsmc-vendor-qualification-contract.md`

이유: 글의 AI 작성 주체 표시만 제거. 같은 줄의 출처·법적 제한·확인일은 보존.

```diff
--- before
+++ after
@@ -143 +143 @@
-*AI가 작성한 일반 정보이며 개별 사안에 대한 법률 자문이 아닙니다. 법령·자료 확인 기준일: 2026년 10월 3일(대만 시간).*
+*일반 정보이며 개별 사안에 대한 법률 자문이 아닙니다. 법령·자료 확인 기준일: 2026년 10월 3일(대만 시간).*
```

## 기존 원고 보존 검사 갱신

`src/lib/__tests__/traffic-stop-dialogue.test.tsx`의 원고 SHA-256 검사는 zh079에서 이번에 제거한 `由AI助理` 때문에 실패했다. 기존 검수 원고와 기준 해시 `b800295ca45dbe742e6d88d73784027754f299e9713bd41efc225d575ecd96b8`는 바꾸지 않았다.

검사는 먼저 변경 후 출처 안내 문장 전체가 정확히 한 번 있고 변경 전 문장이 없음을 확인한다. 그 정확한 문장 하나에서만 이번에 승인된 작성자 제거를 역변환한 뒤, 기존 중복 H1 복원과 전체 SHA-256 동등성 검사를 그대로 수행한다. 임의의 문장·공백 정규화나 해시 기준 교체는 하지 않았다.

```text
npm run test:unit -- src/lib/__tests__/traffic-stop-dialogue.test.tsx
✓ |unit| src/lib/__tests__/traffic-stop-dialogue.test.tsx (3 tests) 413ms
Test Files  1 passed (1)
Tests  3 passed (3)
Duration  1.72s
exit 0
```

## 인접 원고 보존 검사 일괄 검수

전체 테스트에서 같은 변경에 직접 영향을 받는 12개 원고 해시 검사를 확인했다. 각 검사의 기존 기준 해시는 수정 전 원고와 일치하고, 이번 작성 표기 제거 후 바이트와는 달라짐을 별도로 계산했다. 영향을 받지 않는 `traffic-starting-entry.test.tsx` 및 다른 원고 해시 검사는 수정하지 않았다.

수정한 검사는 `traffic-borrowed-car`, `traffic-chain-collision`, `traffic-delayed-injury`, `traffic-family-care`, `traffic-joint-liability`, `traffic-rental-repair`, `traffic-repair-cost`, `traffic-retaliatory-driving`, `traffic-secondary-cause`, `traffic-stop-dialogue`, `traffic-truck-blocking`, `traffic-work-loss`이다. 각 파일의 기존 SHA-256 상수와 사실·법률 단서 검사는 모두 유지했다.

각 검사 안에 해당 글의 변경 후/변경 전 출처 안내 문장 전체를 명시한다. 변경 후 문장이 정확히 한 번 있고 변경 전 문장이 없음을 검사한 다음, 그 문장만 역변환하여 원래 전체 본문 해시와 비교한다. 별도 작성자 한 줄이 삭제된 zh084/085/086은 H1과 주변 줄바꿈을 포함한 정확한 위치 문자열로만 그 한 줄을 복원한다. 광범위한 AI 삭제나 문장·공백 정규화, 기준 해시 변경은 하지 않는다.

```text
npm run test:unit -- src/lib/__tests__/traffic-borrowed-car.test.ts src/lib/__tests__/traffic-chain-collision.test.tsx src/lib/__tests__/traffic-delayed-injury.test.ts src/lib/__tests__/traffic-family-care.test.ts src/lib/__tests__/traffic-joint-liability.test.ts src/lib/__tests__/traffic-rental-repair.test.ts src/lib/__tests__/traffic-repair-cost.test.ts src/lib/__tests__/traffic-retaliatory-driving.test.ts src/lib/__tests__/traffic-secondary-cause.test.ts src/lib/__tests__/traffic-stop-dialogue.test.tsx src/lib/__tests__/traffic-truck-blocking.test.ts src/lib/__tests__/traffic-work-loss.test.ts
Test Files  12 passed (12)
Tests  26 passed (26)
Start at  19:50:25
Duration  5.17s
exit 0

PASS original SHA-256 constants unchanged: 12 affected test files
npx eslint <위의 12개 파일> --max-warnings=0
exit 0
```
