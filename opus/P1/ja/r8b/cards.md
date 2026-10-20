# P1 JA 카드 문구 · r8b (6장, 렌더: opus/P1/ja/r8b/images/ja/)

r8b(shared/R8B-BRIEF.md): 카드 1을 결과·판결 없는 장면 훅으로 다시 설계해 재렌더. 나머지 카드는 r8과 같은 파일. 렌더 원본: opus/render/copy/p1-ja.json

## 1 · core
- headline: サインはまだなのに、 / 手付金はもう振り込んでいた。
- kicker: 台湾の一審・部屋の手付金
- paper_title: 賃貸借契約書
- unsigned: 署名前
- amount_label: 振り込んだ手付金
- amount: 21,800元
- foot 1: 2025年11月28日、台北で部屋を見て、 / 午後2時51分に管理会社へ振り込んだお金です。
- foot 2: そしてその日、気が変わったそうです。

## 2 · space (借り手の言い分・架空の場面)
- speaker: 内見した借り手（名前は伏せています）
- headline: 荷物が入らない。やめます。
- foot 1: 契約書もまだだから、お金は返してほしい。
- foot 2: 管理会社は断りました。

## 3 · agreement (管理会社の言い分・架空の場面)
- speaker: 管理会社
- headline: 家賃は決めたし、期間も広告に。
- terms: 部屋・家賃・最短期間
- rent: 家賃
- unit: 元
- min: 最短
- year: 年
- memo_note: あと3組の内見も断りました
- foot 2: 借り手が送ったLINEも、判決に出てきます。

## 4 · message (判決に引用されたメッセージ)
- headline: 「承租訂金」として / 振り込みました。
- context: 振込のあとに借り手が送ったLINE
- amount: 21,800元
- mark: 0
- note: 中国語の原文を訳したもの
- foot 1: このLINE、証拠として出したのは借り手本人です。

## 5 · judgment (この事件の一審判断)
- headline: 一審：返さなくていい
- contract: 契約書（未署名）
- agreed: 内見のとき口頭でまとまった条件
- rent: 家賃21,800元
- period: 最短1年
- message: LINE：「承租訂金」
- foot 1: 契約は内見の日に成立していた。
- foot 2: 狭いと思ってやめたのは借り手側の責任だと見ました。

## 6 · proof (この事件の一審判断)
- headline: 会社の責任は、 / 借り手が証明する必要があった。
- docs: [{"title": "借り手の理由", "body": "振り込んだあと 荷物が入りきらない", "proves_label": "裁判官の判断", "proves": "借り手側の責任", "status": "記録にある", "kind": "ok"}, {"title": "会社の責任の証拠", "body": "会社の責任で契約を 履行できなくなった ことを示す資料", "proves_label": "証明する人", "proves": "借り手", "status": "出していない", "kind": "x"}]
- foot 1: そのため、21,800元と利息の請求は / どちらも認められませんでした。
