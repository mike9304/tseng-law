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
 *   2. Resolves each variant with a side-effect-free GET, then records the
 *      exposure through a same-origin POST.
 *   3. Hides every variant whose `data-builder-experiment-variant` doesn't
 *      match the resolved variantId.
 *
 * Conversion tracking: add `data-builder-experiment-goal="cta-click"` to any
 * clickable element; the component wires a `click` listener that POSTs to
 * /api/experiments/event.
 */
function currentLocale(): string {
  const segment = window.location.pathname.split('/').filter(Boolean)[0];
  if (segment === 'ko' || segment === 'ja' || segment === 'zh-hant' || segment === 'en') return segment;
  const htmlLang = document.documentElement.lang;
  if (htmlLang === 'ko' || htmlLang === 'ja' || htmlLang === 'zh-hant' || htmlLang === 'en') return htmlLang;
  return 'ko';
}

export default function ExperimentVariantSwap() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-builder-experiment-id]'));
    if (nodes.length === 0) return;

    const locale = currentLocale();
    const experimentIds = Array.from(new Set(nodes.map((n) => n.dataset.builderExperimentId ?? '').filter(Boolean)));
    const variantByExperiment: Record<string, string> = {};
    const assignmentTokenByExperiment: Record<string, string> = {};

    let cancelled = false;
    (async () => {
      for (const experimentId of experimentIds) {
        try {
          const res = await fetch(`/api/experiments/assign?experimentId=${encodeURIComponent(experimentId)}&locale=${encodeURIComponent(locale)}`, {
            credentials: 'include',
          });
          if (!res.ok) continue;
          const payload = (await res.json()) as {
            assignmentToken?: string;
            firstExposure?: boolean;
            variantId?: string | null;
          };
          if (!cancelled && payload.variantId && payload.assignmentToken) {
            variantByExperiment[experimentId] = payload.variantId;
            if (payload.firstExposure) {
              await fetch(`/api/experiments/assign?locale=${encodeURIComponent(locale)}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  assignmentToken: payload.assignmentToken,
                  locale,
                }),
              }).catch(() => undefined);
            }
            if (cancelled) return;
            assignmentTokenByExperiment[experimentId] = payload.assignmentToken;
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
      const assignmentToken = assignmentTokenByExperiment[experimentId];
      if (!goal || !experimentId || !variantId || !assignmentToken) return;
      void fetch(`/api/experiments/event?locale=${encodeURIComponent(locale)}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentId,
          variantId,
          goal,
          assignmentToken,
        }),
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
