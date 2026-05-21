'use client';

import { useEffect } from 'react';

export default function AppRuntimeLoader() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-builder-app-runtime="enabled"][data-builder-app-id][data-builder-app-widget-id]',
      ),
    );

    for (const node of nodes) {
      const appId = node.dataset.builderAppId ?? '';
      const widgetId = node.dataset.builderAppWidgetId ?? '';
      const instanceId = node.dataset.builderAppInstanceId ?? node.dataset.nodeId ?? '';

      node.dataset.builderAppRuntimeLoaded = 'true';
      node.dispatchEvent(new CustomEvent('builder:app-runtime-ready', {
        bubbles: false,
        detail: { appId, widgetId, instanceId },
      }));
    }
  }, []);

  return null;
}
