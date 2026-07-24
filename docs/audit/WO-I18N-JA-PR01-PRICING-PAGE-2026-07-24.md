# WO-I18N-JA-PR01 — Publish native Japanese pricing page

Date: 2026-07-24 KST
Owner: implementation worker
Reviewer: independent Japanese reviewer
Manager: root

## Objective

Replace the EN fallback at `/ja/pricing` with reviewed Japanese pricing copy,
native metadata, and sitemap coverage. Preserve every price, unit, scope
qualification, and non-Japanese page.

## Allowed files

- `src/app/[locale]/(legacy)/index.tsx`
- `src/app/[locale]/(legacy)/pricing-legacy.tsx`
- `src/app/[locale]/(legacy)/legacy-page-bodies.tsx`
- `src/components/PricingCards.tsx`
- `src/data/page-copy.ts`
- `src/app/sitemap.ts`
- `src/app/[locale]/(legacy)/__tests__/pricing-ja.test.tsx` (new)
- `src/app/[locale]/(legacy)/__tests__/about-ja.test.tsx`
- `src/app/__tests__/sitemap.test.ts`

No other file may be edited. Remove only the obsolete assertions in the About
test that require `/ja/pricing` to fall back to EN; the new pricing test owns
that contract.

## Exact page-header copy

- label: `PRICING`
- title: `費用のご案内`
- description:
  `昊鼎国際法律事務所の主要サービスについて、費用の目安をご案内します。`

## Exact Japanese pricing data

```ts
{
  currency: 'NTD（ニュー台湾ドル）',
  items: [
    {
      icon: 'consultation',
      title: '一般法律相談',
      price: 'NT$ 3,000',
      unit: '/ 1時間',
      details: [
        '対面またはオンライン（ビデオ通話）での相談',
        '韓国語・中国語・日本語での相談に対応',
        '法的問題の分析と対応方針の提案',
        '事前予約制'
      ]
    },
    {
      icon: 'litigation',
      title: '民事・刑事訴訟',
      price: '個別見積り',
      unit: '',
      details: [
        '民事訴訟（損害賠償、契約紛争など）',
        '刑事事件（告訴、弁護）',
        '案件の種類・複雑性により費用が異なります',
        '具体的なお見積りは相談後にご案内します'
      ],
      note:
        '案件の内容を確認したうえでお見積りをご案内します。まずは法律相談をお申し込みください。'
    },
    {
      icon: 'company',
      title: '台湾での会社設立',
      price: 'NT$ 50,000',
      unit: '',
      details: [
        '資本金400万NTD以下の場合',
        '株主1名の場合',
        '投資許可・会社登記・営業登記を含みます',
        '銀行への同行は別途費用',
        '居留証（ARC）の申請代行は別途費用'
      ],
      note:
        '資本金が400万NTDを超える場合、株主が複数の場合、または支店・合弁など通常と異なる形態の場合は、別途お見積りいたします。'
    },
    {
      icon: 'retainer',
      title: '年間法律顧問',
      price: 'NT$ 50,000',
      unit: '/ 1年',
      details: [
        '継続的な法律相談',
        '契約書のレビューとリスク分析',
        '労働法・商法に関する継続的な助言',
        '月払いについては個別にご相談いただけます'
      ]
    }
  ],
  disclaimer:
    '上記の費用は基本的な目安であり、案件の性質、複雑性、緊急性により変動する場合があります。正確な費用は、初回相談後に書面によるお見積りでご案内します。',
  ctaLabel: '法律相談を申し込む',
  ctaHref: '/ja/contact'
}
```

## SEO

Add these JA keywords:

- `台湾弁護士費用`
- `台湾会社設立費用`
- `台湾訴訟費用`
- `昊鼎国際法律事務所 費用`

Metadata must use canonical `/ja/pricing`, content language `ja`, OpenGraph
locale `ja_JP`, and all four language alternates. Sitemap must contain the JA
URL exactly once.

## Required behavior

1. The legacy dispatcher passes `ja` directly only for pricing.
2. `PricingCards`, the body, and metadata accept `SiteLocale`; do not widen
   builder/admin `Locale`.
3. Preserve KO/ZH-Hant/EN data byte-for-byte.
4. Do not add unsupported billing conditions such as tax inclusion, government
   fees, court fees, translation/notarization costs, success fees, or unlimited
   consultation.
5. Do not “harmonize” the existing separate builder decomposer in this work
   order; its source inconsistency needs its own audit.

## Test contract

- Static JA render includes four exact titles, `NT$ 3,000`, two `NT$ 50,000`
  prices, the two separately charged items, exact disclaimer, and exact CTA.
- No `General Legal Consultation`, `Request a Quote`, or
  `Book a Consultation` fallback is present.
- Metadata and sitemap satisfy the SEO contract.
- KO/ZH-Hant/EN representative prices, copy, and CTA links remain unchanged.
- Unsupported billing-condition terms remain absent.

## Gates

- focused pricing/page/sitemap tests
- `npm run -s typecheck`
- scoped ESLint on all nine allowed files
- `git diff --check`
- browser desktop/mobile check with four flag targets and no console errors

Do not stage, commit, push, deploy, or operate the dev server.
