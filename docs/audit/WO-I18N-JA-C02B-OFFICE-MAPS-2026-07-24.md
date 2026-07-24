# WO-I18N-JA-C02B — Japanese office maps

Date: 2026-07-24 KST
Owner: delegated implementation worker
Manager: Codex `/root`

## Goal

Add Japanese labels, accessible names, office titles, and photo alt text to the
office-map section while reusing all existing verified address, phone, embed,
and external map values.

## Allowed files

1. `src/components/OfficeMapTabs.tsx`
2. `src/components/__tests__/office-map-tabs-ja.test.tsx` (new)

No other file may be edited. Do not stage, commit, push, deploy, or operate the
development server.

## Exact Japanese UI copy

```text
OFFICES
事務所所在地
事務所
電話
FAX
Google マップで見る（写真・口コミ）
地図プレビュー
韓国事務所の所在地
地図を開く
台北事務所
台中事務所
高雄事務所
韓国事務所
NAVERマップで見る
{事務所名}の地図
5.0・クチコミ17件
Googleでの評価は5.0、クチコミは17件です
```

Exact Japanese photo alt text:

```text
昊鼎国際法律事務所 台北事務所の応接室
昊鼎国際法律事務所 台北事務所の執務室
昊鼎国際法律事務所 台北事務所の会議室
```

## Data reuse contract

- Component props and locale-indexed UI/data accept `SiteLocale`.
- The three Japanese Taiwan office records must reuse the existing ZH-Hant
  records' `id`, address, phone, fax, embed URL, and maps URL. Only `title`
  changes to the Japanese values above.
- The Japanese Korea office must reuse the existing office's address, phone,
  and NAVER URL. Only its title and map-link label change.
- Do not invent, normalize, romanize, translate, or otherwise change any
  address, phone, fax, rating number, review count, embed URL, or maps URL.
- Add explicit Japanese rating summary and aria label.
- Japanese iframe title is exactly `{current.title}の地図`; existing locales
  retain their current iframe-title behavior.
- External map links retain `target="_blank"` and
  `rel="noopener noreferrer"`.
- First Taiwan office remains active with `aria-selected="true"`.
- KO, ZH-Hant, and EN output remains unchanged.

## Required verification

- Exact static-render assertions for all Japanese strings and photo alt values
  that render for the default Taipei tab.
- Three Japanese tab buttons and the first selected state.
- Exact Japanese iframe title and tablist aria-label.
- Exact rating visible text and aria-label.
- Japanese Taiwan data is derived from the ZH-Hant records rather than copied
  with altered values; test/source assertion must guard reuse.
- Korea title/link label and canonical NAVER href.
- External map target/rel.
- Representative exact KO, ZH-Hant, and EN regression assertions.
- `npm run typecheck`
- scoped ESLint for the two allowed files
- `git diff --check`

Interactive tab/browser verification and commit are manager gates.
