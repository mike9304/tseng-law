'use client';

import type { CSSProperties } from 'react';
import { CmsDynamicItemLinkedPageRow } from '@/components/builder/cms/CmsDynamicItemLinkedPageRow';
import { CmsDynamicItemPolicyLibraryPanel } from '@/components/builder/cms/CmsDynamicItemPolicyLibraryPanel';
import { CmsDynamicItemPolicyRolloutPanel } from '@/components/builder/cms/CmsDynamicItemPolicyRolloutPanel';
import { resolveCmsDynamicItemPolicyLibraryEntries } from '@/components/builder/cms/cms-dynamic-item-policy-library';
import {
  resolveCmsDynamicItemPolicyRolloutTargets,
  resolveCmsDynamicItemPolicyRolloutTemplates,
} from '@/components/builder/cms/cms-dynamic-item-policy-rollout';
import {
  resolveLinkedItemRouteCoverage,
  type LinkedDynamicItemPage,
} from '@/components/builder/cms/cms-dynamic-linked-pages-model';
import type { BuilderCmsCollectionDetail } from '@/lib/builder/cms-types';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemLinkedPagesSectionProps = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collection: BuilderCmsCollectionDetail;
  readonly itemPages: readonly LinkedDynamicItemPage[];
};

export function CmsDynamicItemLinkedPagesSection({
  locale,
  siteId,
  collection,
  itemPages,
}: CmsDynamicItemLinkedPagesSectionProps) {
  const policies = collection.dynamicItemRoutePolicies ?? [];
  const libraryEntries = resolveCmsDynamicItemPolicyLibraryEntries({
    policies,
    pages: itemPages,
  });
  const rolloutTemplates = resolveCmsDynamicItemPolicyRolloutTemplates(policies);
  const rolloutTargets = resolveCmsDynamicItemPolicyRolloutTargets({
    policies,
    candidates: itemPages.map((page) => ({
      pageId: page.pageId,
      title: page.title,
      coverage: resolveLinkedItemRouteCoverage({
        page,
        collection,
        locale,
      }),
    })),
  });

  return (
    <section style={linkedPagesSectionStyle} data-cms-dynamic-item-linked-pages={collection.collectionId}>
      <strong style={linkedPagesTitleStyle}>Linked dynamic item pages</strong>
      <CmsDynamicItemPolicyLibraryPanel
        collectionId={collection.collectionId}
        entries={libraryEntries}
        locale={locale}
        siteId={siteId}
      />
      <CmsDynamicItemPolicyRolloutPanel
        collectionId={collection.collectionId}
        locale={locale}
        siteId={siteId}
        targets={rolloutTargets}
        templates={rolloutTemplates}
      />
      {itemPages.map((page) => (
        <CmsDynamicItemLinkedPageRow
          key={page.pageId}
          collection={collection}
          locale={locale}
          page={page}
          siteId={siteId}
        />
      ))}
    </section>
  );
}

const linkedPagesSectionStyle = {
  display: 'grid',
  gap: 8,
  minWidth: 0,
  width: '100%',
} satisfies CSSProperties;

const linkedPagesTitleStyle = {
  color: '#0f172a',
  fontSize: 13,
} satisfies CSSProperties;
