'use client';

import { useEffect } from 'react';

/**
 * PR #10 follow-up — Client-side variant resolver.
 *
 * Convention: a designer can mark sections / nodes with
 *   data-builder-experiment-id="exp_xxx" + data-builder-experiment-variant="control"
 * Multiple variants of the same experimentId can coexist in the DOM. On
 * mount this component:
 *   1. Collects unique experimentIds from the DOM.
 *   2. Calls /api/experiments/assign for each (sticky via tw_exp_sid cookie).
 *   3. Hides every variant whose `data-builder-experiment-variant` doesn't
 *      match the resolved variantId.
 *
 * Conversion tracking: add `data-builder-experiment-goal="cta-click"` to any
 * clickable element; the component wires a `click` listener that POSTs to
 * /api/experiments/event.
 */
export default function ExperimentVariantSwap() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-builder-experiment-id]'));
    if (nodes.length === 0) return;

    const experimentIds = Array.from(new Set(nodes.map((n) => n.dataset.builderExperimentId ?? '').filter(Boolean)));
    const variantByExperiment: Record<string, string> = {};

    let cancelled = false;
    (async () => {
      for (const experimentId of experimentIds) {
        try {
          const res = await fetch(`/api/experiments/assign?experimentId=${encodeURIComponent(experimentId)}`, {
            credentials: 'include',
          });
          if (!res.ok) continue;
          const payload = (await res.json()) as { variantId?: string | null };
          if (!cancelled && payload.variantId) {
            variantByExperiment[experimentId] = payload.variantId;
          }
        } catch {
          /* ignore */
        }
      }
      if (cancelled) return;
      for (const node of nodes) {
        const experimentId = node.dataset.builderExperimentId ?? '';
        const variantId = node.dataset.builderExperimentVariant ?? '';
        const resolved = variantByExperiment[experimentId];
        if (!resolved) {
          // Don't hide anything when assignment failed — fall back to whatever
          // the designer left in markup.
          continue;
        }
        if (variantId !== resolved) {
          node.style.display = 'none';
        } else {
          node.removeAttribute('hidden');
          node.dataset.builderExperimentActive = 'true';
        }
      }
    })();

    function handleClick(event: MouseEvent): void {
      const target = (event.target as HTMLElement | null)?.closest('[data-builder-experiment-goal]');
      if (!target) return;
      const goal = (target as HTMLElement).dataset.builderExperimentGoal ?? '';
      const wrapper = (target as HTMLElement).closest<HTMLElement>('[data-builder-experiment-id]');
      const experimentId = wrapper?.dataset.builderExperimentId ?? '';
      const variantId = variantByExperiment[experimentId] ?? wrapper?.dataset.builderExperimentVariant ?? '';
      if (!goal || !experimentId || !variantId) return;
      void fetch('/api/experiments/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experimentId, variantId, goal }),
        keepalive: true,
      }).catch(() => undefined);
    }
    document.addEventListener('click', handleClick, true);

    return () => {
      cancelled = true;
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
