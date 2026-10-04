/**
 * ja home 「昊 — 光の升目」 (CONCEPT-V2, Opus 5.5 home lane, 2026-10-03): copy registry.
 *
 * JA_KOU_NEW holds the only new strings on the ja home and its chrome (CONCEPT-V2 §13.1). They were written by a
 * model and have not been reviewed by a native speaker or a lawyer; nothing on the site says otherwise.
 *
 * JA_KOU_REUSED holds existing sentences and labels that the home places somewhere new. Each one cites the file it is
 * quoted from; ja-copy.test.ts checks that the text still occurs there verbatim. Strings are retyped here (rather than
 * imported) only when their source is a client module, which a server component cannot read.
 */

export const JA_KOU_NEW = {
  /** C1 H2 */
  sukashiTitle: '見慣れた漢字でも、指すものが違うことがあります。',
  /** C5 H2 */
  readTitle: '台湾の法律を、日本語で読む。',
  /** C8 H2 */
  feesTitle: '目安は先に。正確な費用は書面で。',
  /** C8 一般法律相談 spec-row labels */
  specMethod: '方式',
  specLanguage: '言語',
  specBooking: '予約',
  specTimeDifference: '時差',
  /** /ja/pricing company-setup sub-tiles (JaFees `splitCompanyDetails`; not rendered on the home) */
  included: '含まれるもの',
  extraCost: '別途費用',
} as const;

/** C11 visible tab labels are the existing office titles without 「事務所」 (the full label stays the accessible name). */
export const JA_KOU_TAB_SUFFIX = '事務所';

type Reused = { text: string; source: string };

export const JA_KOU_REUSED = {
  readLink: { text: 'コラムを読む', source: 'src/components/ja-design/JaHeroTrust.tsx' },
  archiveTitle: { text: 'コラムアーカイブ', source: 'src/components/InsightsArchiveSection.tsx' },
  prev: { text: '前へ', source: 'src/components/InsightsArchiveSection.tsx' },
  next: { text: '次へ', source: 'src/components/InsightsArchiveSection.tsx' },
  viewAllColumns: { text: 'すべてのコラムを見る', source: 'src/components/InsightsArchiveSection.tsx' },
  attorneyReviewed: { text: '曾雋崴弁護士監修', source: 'src/components/InsightsArchiveSection.tsx' },
  publishedColumns: { text: '公開コラム', source: 'src/components/AttorneyMediaHubView.tsx' },
  officeTimeZoneLabel: { text: '事務所の時間帯', source: 'src/components/OfficeMapTabs.tsx' },
  officeTimeZone: { text: '台湾時間（日本時間−1時間）', source: 'src/components/OfficeMapTabs.tsx' },
  firstContactNote: {
    text: '初回のお問い合わせでは、案件の概要と連絡先のみをお送りください。機微情報は記載しないでください。',
    source: 'src/components/ContactEmailActions.tsx',
  },
  searchExample: { text: '例：会社設立', source: 'src/components/HeroSearch.tsx' },
  detailLink: { text: '詳しく見る', source: 'src/components/ServicesBento.tsx' },
  flowTitle: { text: 'ご依頼までの流れ', source: 'src/components/ja-design/JaPricingBody.tsx' },
  flowStep1: { text: '法律相談のお申し込み', source: 'src/components/ja-design/JaPricingBody.tsx' },
  flowStep2: { text: '案件内容の確認', source: 'src/components/ja-design/JaPricingBody.tsx' },
  flowStep3: { text: '書面によるお見積り', source: 'src/components/ja-design/JaPricingBody.tsx' },
  stepLabel: { text: 'STEP', source: 'src/components/ja-design/JaPricingBody.tsx' },
  feeTableCaption: { text: '料金表', source: 'src/components/ja-design/JaPricingTable.tsx' },
  pricingNav: { text: '費用案内', source: 'src/components/Header.tsx' },
  n1Label: { text: '日本語能力試験（JLPT）N1', source: 'src/components/HomeAttorneySplit.tsx' },
  qualificationTemplate: { text: 'は、台湾弁護士の資格を有する', source: 'src/app/[locale]/(legacy)/legacy-page-bodies.tsx' },
  qualificationTail: { text: 'のパートナー弁護士です。', source: 'src/app/[locale]/(legacy)/legacy-page-bodies.tsx' },
  localIndexLabel: { text: 'このページの内容', source: 'src/app/[locale]/services/[slug]/page.tsx' },
} as const satisfies Record<string, Reused>;

/** Search topics (existing, moved from the hero band into the needs chapter). */
export const JA_KOU_SEARCH_TOPICS = ['会社設立', '労務', '交通事故', '離婚', '相続', '刑事'] as const;
/** Moved here from home-legacy.tsx (JA_SEARCH_CHIPS, as of 647a1c08), where the hero band used them. */
export const JA_KOU_SEARCH_TOPICS_SOURCE = 'src/app/[locale]/(legacy)/home-legacy.tsx@647a1c08';

/** Strings rendered in the display face (CONCEPT-V2 §3.3); the subset font must cover every glyph. */
export const JA_KOU_DISPLAY_EXTRA = '台湾の会社設立・労務・紛争を、日本語で。台湾弁護士個別見積り−1時間NT$3,000/50,0001年N1社労訴婚続留税弁法';

/** Banned in new copy (CONCEPT-V2 §13.1 and the lane brief). */
export const JA_KOU_BANNED = ['専門', '専門家', '第一人者', 'No.1', '実績保証', '必ず', '最高', '一番', '唯一', '保証', '勝訴率', '最も'] as const;
