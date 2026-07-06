'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { seedDatasetTargetWithCurrentRevision } from '@/components/builder/datasets/datasetSeedClient';
import { buildBuilderPageDatasetHref } from '@/lib/builder/hrefs';
import type { BuilderCollectionBindableTargetSummary } from '@/lib/builder/cms';
import type { Locale } from '@/lib/locales';

type BuilderCollectionSeedAllAndOpenActionProps = {
  locale: Locale;
  siteId: string;
  targets: BuilderCollectionBindableTargetSummary[];
};

export default function BuilderCollectionSeedAllAndOpenAction({
  locale,
  siteId,
  targets,
}: BuilderCollectionSeedAllAndOpenActionProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function seedAllAndOpenEditor() {
    if (targets.length === 0) return;

    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      for (const target of targets) {
        await seedDatasetTargetWithCurrentRevision({
          locale,
          siteId,
          pageKey: target.pageKey,
          targetId: target.targetId,
        });
      }

      const firstTarget = targets[0];
      setMessage(`Seeded ${targets.length} target${targets.length === 1 ? '' : 's'} and opened ${firstTarget.title}.`);
      router.push(buildBuilderPageDatasetHref(locale, firstTarget.pageKey, { targetId: firstTarget.targetId }));
      router.refresh();
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : 'Failed to seed dataset bindings.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <button
        type="button"
        onClick={() => void seedAllAndOpenEditor()}
        disabled={busy || targets.length === 0}
        className="builder-action-btn builder-action-btn--primary"
      >
        {busy ? 'Seeding…' : 'Seed all defaults and open first editor'}
      </button>
      {message ? <span style={{ color: '#047857', fontSize: 12 }}>{message}</span> : null}
      {error ? <span style={{ color: '#b91c1c', fontSize: 12 }}>{error}</span> : null}
    </div>
  );
}
