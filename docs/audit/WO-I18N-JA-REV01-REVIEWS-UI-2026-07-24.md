# WO-I18N-JA-REV01 — Japanese reviews UI

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Publish `/ja/reviews` with native Japanese metadata, form, service labels,
errors, accessible star labels, date formatting, moderation disclosure, and
empty state. Do not invent or translate review content.

## Allowed files

1. `src/data/page-copy.ts`
2. `src/components/ReviewBoard.tsx`
3. `src/app/[locale]/(legacy)/reviews-legacy.tsx`
4. `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
5. `src/app/[locale]/(legacy)/index.tsx`
6. `src/app/[locale]/(legacy)/__tests__/reviews-ja.test.tsx` (new)

No other file may be edited. Do not stage, commit, push, deploy, operate the
development server, or submit a review.

## Exact Japanese hero

```text
REVIEWS
ご感想・レビュー
このページでは、昊鼎国際法律事務所の相談・サービスに関する投稿を、内容確認後に掲載します。
```

This deliberately does not claim that a poster is a verified client.

## Exact Japanese board copy

```text
ご感想を投稿する
ご投稿は内容を確認し、掲載可能なもののみ公開します。個人情報、事件番号、外部リンクは記載しないでください。
お名前・ニックネーム
お名前またはニックネーム
評価
ご利用のサービス
選択してください
法律相談
民事訴訟
刑事事件
会社設立
家事事件
労働法
知的財産
顧問契約
その他
ご感想
ご利用になった相談・サービスについて、ご感想をお聞かせください。
投稿する
投稿中…
ご投稿を受け付けました。内容確認後、掲載可否を判断します。
投稿できませんでした。もう一度お試しください。
お名前またはニックネームとご感想をご確認ください。ご感想は20文字以上で入力してください。
しばらく時間をおいてから、もう一度お試しください。同じ端末からの連続投稿は一時的に制限されます。
リンクまたはHTMLタグを含む内容は投稿できません。
掲載中のご感想
現在、掲載中のご感想はありません。
件
平均評価
読み込み中…
```

Service option values remain exactly:

```text
"" consultation civil criminal company family labor ip retainer other
```

Visible disclosure:

```text
掲載内容は投稿者個人の感想です。内容確認は行いますが、投稿者の本人確認または当事務所との利用関係を保証するものではなく、同様の結果を保証するものでもありません。
```

Accessibility and date:

- Interactive and readonly star aria labels are `1つ星` through `5つ星` for
  Japanese.
- Japanese review dates use `YYYY年M月D日`.

## Routing and SEO contract

- `ReviewBoard`, `ReviewsLegacyPageBody`, metadata, and page accept
  `SiteLocale`.
- Only the reviews dispatcher stops applying `asLegacyLocale`; privacy and
  disclaimer remain unchanged.
- Japanese metadata:
  - canonical `https://tseng-law.com/ja/reviews`
  - content language `ja`
  - OpenGraph locale `ja_JP`
  - title/description exact hero copy
  - four locales plus x-default alternates
  - keywords exactly:

```ts
[
  '台湾法律事務所 レビュー',
  '台湾弁護士 ご感想',
  '昊鼎国際法律事務所',
  '台湾法律相談 レビュー',
]
```

- Keep `noindex: true` and `nofollow`; do not add a sitemap entry.
- KO, ZH-Hant, and EN metadata/UI remain exactly unchanged, including their
  existing three-locale alternates.

## Content integrity contract

- Do not create sample reviews.
- Do not translate, rewrite, normalize, or enrich API review nickname, content,
  rating, service value, or timestamp.
- Only the stored service enum is mapped to the Japanese display label.
- Do not use `お客様の声`, `実際のお客様`, `本物の口コミ`, `検証済み`,
  `勝訴`, `成功率`, or any outcome guarantee in Japanese.
- ReviewBoard keeps the locale-filtered GET and `sourceLocale` POST behavior
  from REV-DATA01.

## Required verification

- Exact metadata/dispatcher/page/body assertions.
- Static render contains exact Japanese hero, form labels, options, moderation
  notice, disclosure, loading state, and `1つ星`–`5つ星`.
- Source/helper tests cover Japanese date, every success/error/empty label, and
  raw review content rendering without translation.
- EN/ZH fallback and all prohibited claims are absent.
- Representative KO, ZH-Hant, and EN visible copy, values, and metadata remain
  unchanged.
- Review API tests remain green.
- `npm run typecheck`
- scoped ESLint for the six allowed files
- `git diff --check`

Dynamic empty-state, star interaction, flags, responsive UI, metadata, and
console verification are manager browser gates.
