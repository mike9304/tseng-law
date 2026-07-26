# WO-I18N-JA-COL011-PIF-TWO-PARAGRAPH-SYNC — PIF更新・保存の2段落

Date: 2026-07-26 KST  
Manager: Codex `/root`  
Locale: Japanese (`ja-JP`)  
Micro-scope: column 011, `### 更新と保存`直下の現行2段落のみ

## Goal

確定済み韓国語版column 011の該当2段落を、自然で正確な日本語2段落へ
忠実に同期する。翻訳だけを行い、新たな法的調査、法的レビュー、
解釈または事実追加は行わない。

## Owned implementation files

1. `src/lib/__tests__/columns-ja-investment-011-pif-two-paragraph-sync.test.ts`
   (new)
2. `src/content/columns-ja/011-taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide.md`
   - 下記の置換可能スライスのみ

frontmatter、見出し、前後の段落、他言語、既存テスト、共有コード、
検索・archive・embedding関連ファイルを編集しない。stage、add、commit、
push、deploy、publishおよび共有サーバー操作を行わない。

## Finalized source

翻訳元は、確定済みcommit
`5df9e69e7bad4604d9aa4e4e3656c3dc28d9e5a1`の韓国語column 011にある
該当2段落（現行ファイルの71行目および73行目）だけとする。作業契約は
`docs/audit/WO-I18N-KO-COL011-COSMETICS-2026-07-25.md`に従う。

## Exact byte boundary

置換開始は次の完全一致文の先頭とする。

`原料、処方、製造方法、製造場所、表示、標榜する機能、安全性情報等に変更が生じた場合は、影響する資料を見直し、PIFを最新の状態に保ちます。`

- immutable prefix: `9766` UTF-8 bytes
- prefix SHA-256:
  `885ca0716ebd87e80055a8e6464aaa900b67d09800b4318e0137451ad74c6d59`

置換終了は、次の完全一致文の直前とする。この文と以後の全バイトを
変更しない。

`保存場所、アクセス権限、バックアップ、版管理および契約終了後の資料引継ぎまで決めておくと、担当者や販売代理店が変わった場合の欠落を防ぎやすくなります。`

- immutable tail: `7137` UTF-8 bytes
- tail SHA-256:
  `6a1788dfb3f7fa1054216572b0584850c07348681244281a4cebc15c04aafd77`

現行の置換可能スライスは`810` UTF-8 bytes、SHA-256は
`b13f0bd3005386317d7221d93036448c24025c8a9d5509371db02986dd2ee15a`
である。これはRED時の基準値であり、GREEN後の新しい翻訳本文へ
固定してはならない。

完成スライスは日本語散文2段落だけを
`P1\n\nP2\n\n`の形で置き、immutable tailへ直結させる。

## Translation contract

### Paragraph 1 — ongoing change management

- 原料、処方、製造方法、製造場所、ラベルを含む表示、標榜する機能、
  安全性情報の変更という現行日本語版の対象範囲をすべて維持する。
- 変更の影響を受けるPIF資料を見直して更新する。
- 消費者からの苦情、有害事象、新たな試験結果が既存の評価へ影響するか
  も確認する。
- 初回作成後も継続的な変更管理手続が必要であることを明示する。

### Paragraph 2 — retention period and storage location

- 「化粧品製品情報ファイル管理弁法」第7条に基づき、当該製品を市場へ
  最後に供給した日の翌日から最低`5年`保存すると明記する。
- 保管場所は同弁法第8条に基づき、「化粧品衛生安全管理法」
  第7条第1項第7号に定める化粧品製造・輸入業者の表示住所であることを
  明記する。
- 保存**期間**を定める第7条と、保存**場所**を定める第8条を明確に
  区別する。住所の根拠を第7条と誤記しない。
- 現行日本語版が含む、原製造業者保有の原本または安全な電子・クラウド
  保存を利用できること、完全な資料を管理すること、主管機関の要求時に
  速やかに検索・提示できることの意味を維持する。

用語は当該記事の既存日本語表記と整合させる。確定済み韓国語の範囲を
超える助言、条文解釈、保証または新しい義務を追加しない。

## Deterministic RED/GREEN test

新規focused testはMarkdownをraw bytesとして読み、独立に記述した
定数だけを用いる。network、snapshot、production copy import、
loader由来の期待値、本文から自己生成したfixtureを使わない。

1. bytes `0..9766`の長さとprefix SHA-256を固定する。
2. immutable tailの完全一致開始文を一意に検出し、そこからEOFまでを
   `7137` bytesおよび上記tail SHA-256で固定する。
3. 両境界の間だけを置換可能スライスとして検査し、exact
   `P1\n\nP2\n\n`、非空の日本語散文2段落、追加の見出し・リスト・
   blockquote・link・image・HTMLなしを確認する。
4. Paragraph 1の変更対象をすべて検出し、苦情、有害事象、新しい
   試験結果、既存評価への影響、初回作成後の変更管理を独立した日本語
   literalまたは限定的なsemantic alternativeで確認する。
5. Paragraph 2で`5年`、`最後に供給した日の翌日`、`第7条`、
   `第8条`、`第7条第1項第7号`、製造・輸入業者の表示住所を確認し、
   期間と場所の規定を明示的に区別していることを確認する。
6. 原本、電子またはクラウド、完全な資料、要求時の迅速な検索・提示の
   意味を確認する。
7. スライス内だけで、Hangul、U+200B、U+FEFF、U+00A0、CR、
   trailing whitespace、不可視または空白だけの行を拒否する。

REDではprefix/tail fixtureが通り、現行スライスが新しい翻訳契約だけで
失敗することを示す。GREENではowned slice以外を変えずに通す。

## Execution and independent review gates

1. Terra test workerがfocused testを作成・実行し、決定的REDを示す。
2. Grok draft workerが確定済み韓国語2段落から日本語2段落だけを起草
   する。調査せず、ファイルを編集しない。
3. Terra implementation workerが承認済み2段落だけを実装してGREENを
   示す。
4. 実装者と別のTerra fidelity reviewerが韓国語原文と日本語訳を
   文単位で照合し、省略、弱化、追加、条番号の取り違えがないことを
   確認する。
5. 起草者と別のGrok language reviewerが簡潔で自然な専門日本語、
   用語統一、翻訳調の有無を確認する。
6. Codex managerがscoped diff、境界byte数・SHA-256、数値と条番号、
   focused test、既存column 011 test、typecheck、scoped lint、
   `git diff --check`、unique clean buildを再検証する。
7. Codex managerがdesktop/mobileで日本語routeを確認する。HTTP 200、
   正確な2段落、immutable tail、`5年`と条番号、console/page error
   なし、horizontal overflowなしを検証する。

No push or deploy.
