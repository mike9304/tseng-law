'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { seedDatasetTargetWithCurrentRevision } from '@/components/builder/datasets/datasetSeedClient';
import type { BuilderCollectionBindableTargetSummary } from '@/lib/builder/cms';
import type { Locale } from '@/lib/locales';

type BuilderDatasetSeedAllActionProps = {
  locale: Locale;
  siteId: string;
  targets: BuilderCollectionBindableTargetSummary[];
};

export default function BuilderDatasetSeedAllAction({
  locale,
  siteId,
  targets,
}: BuilderDatasetSeedAllActionProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function seedAllDefaults() {
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
      setMessage(`Seeded ${targets.length} target${targets.length === 1 ? '' : 's'}.`);
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
        onClick={() => void seedAllDefaults()}
        disabled={busy || targets.length === 0}
        className="builder-action-btn builder-action-btn--primary"
      >
        {busy ? 'Seeding all…' : 'Seed all defaults'}
      </button>
      {message ? <span style={{ color: '#047857', fontSize: 12 }}>{message}</span> : null}
      {error ? <span style={{ color: '#b91c1c', fontSize: 12 }}>{error}</span> : null}
    </div>
  );
}
