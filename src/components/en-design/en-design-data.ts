/**
 * en design arrangement data (Opus 5.5 en lane, 2026-10-01).
 *
 * Arrangement only: which existing pages and existing English columns an English-speaking
 * reader sees first. Labels are short navigation labels; every link target already exists and
 * every guide title shown on the page is the column's own title. Ranking follows the audience
 * research in the en redesign report (~/tseng-zh-hant-pass2-20261001/locale-en/REPORT.md).
 */

/**
 * The hero's email button label (HeroSearch `emailConsultationCtaLabels.en`), repeated by the S4 pill with
 * the same mailto and accessible-name pattern. HeroSearch is a client module, so its constant cannot be read
 * from these server components; en tests pin both strings together.
 */
export const EN_EMAIL_CONSULTATION_CTA = 'Request an Email Consultation';

/** Practice-area order on English pages (service slugs from data/service-details.ts). */
export const EN_SERVICE_ORDER = ['labor', 'family', 'criminal', 'civil', 'investment', 'ip'] as const;

export type EnSituation = {
  id: string;
  /** Short navigation label in the reader's words. */
  label: string;
  /** Existing page that covers the situation. */
  href: string;
  /** Link text for `href` (an existing page or topic title). */
  hrefLabel: string;
  /** Existing English column slugs, most useful first. */
  guides: readonly string[];
};

/** "Living or working in Taiwan": individual situations, ranked. */
export const EN_SITUATIONS: readonly EnSituation[] = [
  {
    id: 'work',
    label: 'Dismissed, unpaid or in a dispute at work',
    href: '/en/services/labor',
    hrefLabel: 'Labor & Employment',
    guides: ['foreign-professional-dismissed-taiwan', 'taiwan-labor-severance-law', 'taiwan-voluntary-resignation-severance'],
  },
  {
    id: 'family',
    label: 'Marriage, divorce or parenting matters involving a Taiwanese spouse',
    href: '/en/services/family',
    hrefLabel: 'Family Litigation',
    guides: [
      'taiwanese-spouse-divorce-agreement-registration',
      'taiwanese-spouse-divorce-from-abroad',
      'taiwanese-spouse-divorce-cross-border-parenting',
    ],
  },
  {
    id: 'police',
    label: 'A police summons, criminal complaint or exit ban',
    href: '/en/services/criminal',
    hrefLabel: 'Criminal Litigation',
    guides: ['taiwan-police-questioning-foreigner-rights', 'taiwan-exit-ban-foreigners'],
  },
  {
    id: 'accident',
    label: 'After a scooter or car accident',
    href: '/en/traffic-accidents',
    hrefLabel: 'Traffic accidents',
    guides: ['taiwan-traffic-accident-procedure', 'taiwan-accident-police-records', 'taiwan-overtaking-accident-liability'],
  },
  {
    id: 'residence',
    label: 'ARC, APRC or Employment Gold Card',
    href: '/en/columns?topic=visa',
    hrefLabel: 'Visas & residence',
    guides: ['taiwan-permanent-residence-aprc', 'taiwan-employment-gold-card', 'taiwan-foreign-spouse-residence'],
  },
  {
    id: 'estate',
    label: 'A death, inheritance or property in Taiwan',
    href: '/en/columns?topic=inheritance',
    hrefLabel: 'Inheritance',
    guides: ['taiwan-estate-tax-foreign-decedent', 'foreign-heir-taiwan-succession-law-land', 'foreigner-buy-sell-taiwan-real-estate-tax'],
  },
  {
    id: 'money',
    label: 'Scams, purchases and money owed to you',
    href: '/en/services/civil',
    hrefLabel: 'Civil Litigation & Damages',
    guides: ['taiwan-criminal-accessory-civil-suit-fraud', 'taiwan-online-consumer-dispute-foreigners', 'taiwan-crypto-exchange-vasp-dispute'],
  },
  {
    id: 'injury',
    label: 'Injured at a hospital, gym or business',
    href: '/en/services/civil',
    hrefLabel: 'Civil Litigation & Damages',
    guides: ['taiwan-medical-malpractice-foreign-patient', 'taiwan-gym-injury-lawsuit'],
  },
];

/**
 * Extra English columns shown first on a practice-area page (en only). The shared service
 * records list the older columns; these are the newer English guides for the same area.
 */
export const EN_SERVICE_EXTRA_COLUMNS: Readonly<Record<string, readonly string[]>> = {
  labor: ['foreign-professional-dismissed-taiwan', 'taiwan-foreign-employer-labor-dispute-strike'],
  civil: ['taiwan-accident-police-records', 'taiwan-medical-malpractice-foreign-patient', 'taiwan-online-consumer-dispute-foreigners', 'enforce-foreign-judgment-in-taiwan', 'taiwan-commercial-court-jurisdiction-threshold'],
  family: [
    'taiwanese-spouse-divorce-agreement-registration',
    'taiwanese-spouse-divorce-from-abroad',
    'taiwanese-spouse-divorce-cross-border-parenting',
    'marrying-taiwanese-national-registration-checklist',
    'taiwan-foreign-spouse-residence',
  ],
  criminal: ['taiwan-police-questioning-foreigner-rights', 'taiwan-exit-ban-foreigners', 'taiwan-criminal-accessory-civil-suit-fraud'],
  investment: ['taiwan-franchise-foreign-brand-entry', 'taiwan-company-dissolution-liquidation', 'taiwan-employment-gold-card'],
  ip: ['taiwan-crypto-exchange-vasp-dispute'],
};

/** Column topic order on the English columns index (topic ids from lib/column-topics.ts). */
export const EN_COLUMN_TOPIC_ORDER = ['labor', 'family', 'criminal', 'litigation', 'visa', 'inheritance', 'company', 'tax', 'lawyer', 'other'] as const;

/** Home FAQ display order (question text, exact). Questions not listed keep their order after these. */
export const EN_HOME_FAQ_ORDER: readonly string[] = [
  'How are consultations conducted?',
  'Is severance always required when an employment contract ends in Taiwan?',
  'Is a minimum-service-period clause in Taiwan automatically void?',
  'What is the process for a foreign national to divorce in Taiwan?',
  'How is child custody determined in Taiwan?',
  'What should I do if involved in a criminal case in Taiwan?',
  'What should I do if I have a traffic accident in Taiwan?',
  'Can I claim damages for an injury at a gym or facility?',
];

/** Recommended section on the English columns index: these guides first (then the rest newest first). */
export const EN_RECOMMENDED_COLUMN_ORDER = [
  'foreign-professional-dismissed-taiwan',
  'taiwanese-spouse-divorce-agreement-registration',
  'taiwan-police-questioning-foreigner-rights',
  'taiwan-accident-police-records',
  'taiwan-permanent-residence-aprc',
  'taiwan-criminal-accessory-civil-suit-fraud',
] as const;

/** FAQ category order on the English FAQ page (category ids from lib/builder/faq/faq-shared.ts). */
export const EN_FAQ_CATEGORY_ORDER = ['consultation', 'labor-law', 'family-divorce', 'criminal-defense', 'civil-traffic', 'company-setup'] as const;

/** English FAQ display order: categories in EN_FAQ_CATEGORY_ORDER, items keep their order inside each category. */
export function orderEnFaq<C extends { categoryId: string }, I extends { categoryId: string }>(categories: readonly C[], items: readonly I[]) {
  const order = EN_FAQ_CATEGORY_ORDER as readonly string[];
  return {
    categories: orderByList(categories, (category) => category.categoryId, order),
    items: orderByList(items, (item) => item.categoryId, order),
  };
}

export function orderByList<T>(items: readonly T[], keyOf: (item: T) => string, order: readonly string[]): T[] {
  const rank = (item: T, index: number) => {
    const position = order.indexOf(keyOf(item));
    return position === -1 ? order.length + index : position;
  };
  return items
    .map((item, index) => ({ item, rank: rank(item, index) }))
    .sort((a, b) => a.rank - b.rank)
    .map(({ item }) => item);
}

export type EnGuideLink = { slug: string; title: string; href: string };

/** Resolve situation guides against the English posts actually published (missing slugs are skipped). */
export function resolveEnSituations(posts: readonly { slug: string; title: string }[]) {
  const bySlug = new Map(posts.map((post) => [post.slug, post] as const));
  return EN_SITUATIONS.map((situation) => ({
    ...situation,
    guideLinks: situation.guides
      .map((slug) => bySlug.get(slug))
      .filter((post): post is { slug: string; title: string } => Boolean(post))
      .map((post): EnGuideLink => ({ slug: post.slug, title: post.title, href: `/en/columns/${post.slug}` })),
  }));
}
