# 日本語コラム7本・イシュー3本 補強の検収記録 (2026-11-10)

ユーザー依頼: ワーカー(Cursor Composer 2.5・Grok 4.7)で日本語の手薄なコラムとイシュー記事を埋める。法律内容・文体・指示遵守の最終検収は Claude(Opus 5.5)。

## 手順
- 法令原文: 主エージェントが law.moj.gov.tw から 2026-11-10 に取得した現行条文をワーカーに渡した(ワーカーのサンドボックスはネット遮断)。イシューの事実は公式発表(労働部 2026-11-09、金管会の應記載事項PDF、財政部)と報道(中央社・鏡週刊・フォーカス台湾・聯合報・Taipei Times)本文で確認。
- 既存 ja 記事との重複を事前照合(特留分・遺産分割・認領・SNS名誉毀損・ひき逃げ・贈与税・有限公司の持分譲渡は既存記事なし。工場火災は ISSUE-20261105-43 の近隣損害と別角度)。
- 全原稿: variety_metrics.py check --lang ja FAIL 0、太字・電話番号・作成者表記・内部作業文言なし、連絡先メール・住所各1回、内部リンク実在確認、画像は Grok image_gen の架空場面(文字・顔・ナンバーなし)、キャプション「架空の情景」。
- テスト: issue-board-20261110.test.ts 追加、native-locale-columns.ts に JA_GAP_COLUMN_FILES_20261110 を登録。全体 vitest は origin/main 基準線と比較して新規失敗なし(基準線の既存失敗は別件)。

## 原稿別
| ID | ファイル | 流れ | 主な訂正 |
|---|---|---|---|
| JA-I1 | `src/content/columns-ja/1331-taiwan-will-excludes-japanese-spouse-reserved-share.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 法律誤り11(1173の贈与目的、1198の証人欠格、61の不動産限定ほか) → 直接修正: 事例を第三者遺贈+子への遺言に組替え、重複削除、FAQ問い直し。 approved sha 8b4115ed637371d7 |
| JA-I2 | `src/content/columns-ja/1332-taiwan-estate-division-heirs-in-taiwan-and-japan.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 法律誤り22(73の罰鍰倍率、1174の起算、828・830の文言ほか) → 直接修正: 823・824・1176の細部削減、推測文削除。 approved sha e9a9c5d8fe96631b |
| JA-I3 | `src/content/columns-ja/1333-taiwanese-father-unmarried-child-acknowledgment-inheritance.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 32項目 → 直接修正: 重複削除、渉外53「いずれか一方の本国法で成立」に訂正。 approved sha 5b4d8a6fd3ef0389 |
| JA-C1 | `src/content/columns-ja/1334-taiwan-line-facebook-group-insult-defamation-complaint.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 法律誤り15(刑名・311の列挙・刑訴233②ほか) → 直接修正: 冗長・推測段落削除、拘役の読み訂正。 approved sha dea2e8173cac61a6 |
| JA-C2 | `src/content/columns-ja/1335-taiwan-traffic-accident-leaving-scene-hit-and-run.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 法律誤り18(185-4②は必要的減免、道交条例62の項番号) → 直接修正: 数字表記統一、重複削除。交通ボードtag外し(登録外)。 approved sha d703e010a4496bf0 |
| JA-T1 | `src/content/columns-ja/1336-taiwan-parent-gift-tax-child-living-in-japan.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 法律誤り17(第5条の擬制贈与、第44・45条の区別ほか) → 直接修正: H1追加、第5条を箇条化、節税示唆文削除。級距金額は公式資料未確認のため不記載。税務ボードtag外し(登録外)。 approved sha db08094562733933 |
| JA-Co1 | `src/content/columns-ja/1337-taiwan-limited-company-japanese-partner-exit-capital-transfer.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | 主エージェント r1 + Grok xcheck 法律誤り16(111③に同一条件なし、99②の要件ほか) → 直接修正: H1追加、架空要件削除。 approved sha 414443cd4535a8e1 |
| JA-X1 | `src/content/issues/ja/ISSUE-20261110-41-taiwan-online-banking-unauthorized-transfer-bank-liability.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 法律誤り13(應記載事項14点の45日例外の起算ほか) → 直接修正: 数字を金管会(11/3)と銀行発表(11/5)で並記、推測文削除。 approved sha be905cd386c30fdc |
| JA-X2 | `src/content/issues/ja/ISSUE-20261110-42-taiwan-factory-fatal-accident-employer-duties-compensation.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 法律誤り14(職安法40・41の対象、36停工) → 直接修正: 冒頭を事実→要点に再構成、実在企業の原因・責任推測なし。 approved sha 8158acafced64c36 |
| JA-X3 | `src/content/issues/ja/ISSUE-20261110-43-taiwan-minimum-wage-cumulative-fines-2027.md` | Composer 2.5 執筆 → Grok 4.7 交差検収 → Claude r1 → Composer 修正 → Claude 最終 | Grok xcheck 法律誤り15(79④の加重項、最低工資法16「適用」) → 直接修正: 内部文言「資料の範囲で」削除。 approved sha fff56ac25cbe4f8d |

## 未対応・申し送り
- 1335(ひき逃げ)は交通ボード、1336(贈与税)は税務会計ボードに載せていない。載せる場合は traffic/tax-accounting の登録ファイルとボードテストの期待値を更新する。
- 贈与税の課税級距(2,811万・5,621万元)は公式ページ本文を取得できず不記載。
