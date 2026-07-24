# WO-I18N-JA-C02A — Japanese contact guide and messenger

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Add reviewed native Japanese copy to the contact guide and KakaoTalk inquiry
sections without changing their existing three-locale output.

## Allowed files

1. `src/components/ConsultationGuideSection.tsx`
2. `src/components/MessengerChatSection.tsx`
3. `src/components/__tests__/verified-contact-channels.test.tsx`

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Exact Japanese guide copy

```text
GUIDE
ご相談前の確認事項
連絡手段と案件に関する資料をあらかじめ整理していただくと、相談日程の調整や内容の確認がスムーズです。

ご利用いただける連絡手段
KakaoTalk、メール、電話でお問い合わせいただけます。
ご希望の相談形式がある場合は、ご連絡時にお知らせください。
ご希望の使用言語がある場合は、ご連絡時にお知らせください。

ご用意いただきたい資料
契約書、見積書、公文書、メール、メッセージの履歴などの主要資料
会社名、当事者に関する情報、主な出来事の日付、現在の進行状況
写真、動画、判決書、届出書類など、事実関係を確認できる資料

ご相談の流れ
お問い合わせを受けた後、まず案件の種類と緊急性を確認します。
必要に応じて追加資料をお願いし、適切な相談方法をご案内します。
日程確定後、ご案内した方法で相談を行います。
```

## Exact Japanese messenger copy

```text
MESSENGER
メッセンジャーでのお問い合わせ
KakaoTalkチャンネルからお問い合わせいただけます。

KakaoTalkチャンネルでお問い合わせ
メッセージをお送りください。確認後、相談方法をご案内します。

KakaoTalkでお問い合わせいただける内容
会社設立・投資に関するお問い合わせ
訴訟・紛争に関するお問い合わせ
相談方法・日程のご案内
資料送付に関する事前確認
```

The card href remains exactly `https://pf.kakao.com/_hojeong/chat`.

## Contract

- Component locale props and internal data accept `SiteLocale`.
- Add an explicit Japanese branch/data object; Japanese must not fall through
  to Chinese.
- Do not alter exact KO, ZH-Hant, or EN rendered text and link behavior.
- Do not claim the messenger is officially verified.
- Do not promise response speed, 24-hour service, visa services, a particular
  video platform, or guaranteed language availability in Japanese.
- Do not add LINE text or URL.
- Preserve one and only one KakaoTalk link in the Japanese messenger section,
  with `target="_blank"` and `rel="noopener noreferrer"`.

## Required verification

- Exact static-render assertions for every Japanese line above.
- Explicit absence assertions for representative EN/ZH fallback text and every
  prohibited claim.
- KakaoTalk link count exactly one and canonical href/target/rel exact.
- Representative exact KO, ZH-Hant, and EN regression assertions.
- Existing verified-channel tests stay green.
- `npm run typecheck`
- scoped ESLint for the three allowed files
- `git diff --check`

Route integration, office maps, browser verification, and commit are later
manager/workorder gates.
