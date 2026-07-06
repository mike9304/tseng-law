'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { seedDatasetTargetWithCurrentRevision } from '@/components/builder/datasets/datasetSeedClient';
import { buildBuilderPageDatasetHref } from '@/lib/builder/hrefs';
import type { BuilderDatasetTargetId, BuilderPageKey } from '@/lib/builder/types';
import type { Locale } from '@/lib/locales';

type BuilderDatasetSeedActionProps = {
  locale: Locale;
  siteId: string;
  targetId: BuilderDatasetTargetId;
  pageKey: BuilderPageKey;
  label?: string;
};

export default function BuilderDatasetSeedAction({
  locale,
  siteId,
  targetId,
  pageKey,
  label = 'Seed defaults and open editor',
}: BuilderDatasetSeedActionProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function seedDefaults() {
    setBusy(true);
    setError(null);
    try {
      await seedDatasetTargetWithCurrentRevision({ locale, siteId, pageKey, targetId });
      router.push(buildBuilderPageDatasetHref(locale, pageKey, { targetId }));
      router.refresh();
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : 'Failed to seed dataset binding.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <button
        type="button"
        onClick={() => void seedDefaults()}
        disabled={busy}
        className="builder-action-btn builder-action-btn--primary"
        data-builder-dataset-seed-target={targetId}
      >
        {busy ? 'Seeding…' : label}
      </button>
      {error ? <span style={{ color: '#b91c1c', fontSize: 12 }}>{error}</span> : null}
    </div>
  );
}
