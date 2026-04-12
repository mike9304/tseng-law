'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { BuilderEditableTargetKind, BuilderSurfaceOverride } from '@/lib/builder/types';

type BuilderSurfaceOverrideScopeProps = {
  sectionId: string;
  overrides: Record<string, BuilderSurfaceOverride>;
  children: ReactNode;
};

export default function BuilderSurfaceOverrideScope({
  sectionId,
  overrides,
  children,
}: BuilderSurfaceOverrideScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scopeRef.current;
    if (!root) return;

    let frame = 0;
    const observer = new MutationObserver(() => {
      scheduleApply();
    });

    const observe = () => {
      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    };

    const apply = () => {
      observer.disconnect();
      reapplyOverrides(root, sectionId, overrides);
      observe();
    };

    const scheduleApply = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };

    apply();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [overrides, sectionId]);

  return (
    <div ref={scopeRef} style={{ display: 'contents' }} data-builder-override-scope={sectionId}>
      {children}
    </div>
  );
}

function reapplyOverrides(
  root: HTMLElement,
  sectionId: string,
  overrides: Record<string, BuilderSurfaceOverride>
) {
  snapshotBaseState(root);
  root.querySelectorAll<HTMLElement>('[data-builder-surface-key]').forEach((element) => {
    restoreBaseState(element);
  });

  const sectionPrefix = `${sectionId}:`;
  for (const [key, override] of Object.entries(overrides)) {
    if (!key.startsWith(sectionPrefix)) continue;

    const surfaceId = key.slice(sectionPrefix.length);
    if (!surfaceId) continue;

    const targets = root.querySelectorAll<HTMLElement>(`[data-builder-surface-key="${surfaceId}"]`);
    targets.forEach((target) => applyOverride(target, override));
  }
}

function applyOverride(element: HTMLElement, override: BuilderSurfaceOverride) {
  switch (override.kind as BuilderEditableTargetKind) {
    case 'image':
      applyImageOverride(element, override);
      return;
    case 'button':
      applyButtonOverride(element, override);
      return;
    case 'text':
      applyTextOverride(element, override);
      return;
  }
}

function snapshotBaseState(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-builder-surface-key]').forEach((element) => {
    if (element.dataset.builderBaseCaptured === 'true') return;

    element.dataset.builderBaseCaptured = 'true';
    element.dataset.builderBaseText = getTextValue(element);
    element.dataset.builderBaseHref = element instanceof HTMLAnchorElement ? element.getAttribute('href') || '' : '';
    element.dataset.builderBaseAlt = element instanceof HTMLImageElement ? element.alt : '';
    element.dataset.builderBaseSrc =
      element instanceof HTMLImageElement ? element.getAttribute('src') || element.currentSrc || '' : '';
  });
}

function restoreBaseState(element: HTMLElement) {
  const baseText = element.dataset.builderBaseText ?? '';
  const baseHref = element.dataset.builderBaseHref ?? '';
  const baseAlt = element.dataset.builderBaseAlt ?? '';
  const baseSrc = element.dataset.builderBaseSrc ?? '';

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.value = baseText;
  } else if (element instanceof HTMLSelectElement) {
    element.value = baseText;
  } else {
    element.textContent = baseText;
  }

  if (element instanceof HTMLAnchorElement) {
    if (baseHref) {
      element.href = baseHref;
      element.setAttribute('href', baseHref);
    } else {
      element.removeAttribute('href');
    }
  }

  if (element instanceof HTMLImageElement) {
    if (baseAlt) {
      element.alt = baseAlt;
      element.setAttribute('alt', baseAlt);
    } else {
      element.removeAttribute('alt');
    }
    if (baseSrc) {
      element.src = baseSrc;
      element.setAttribute('src', baseSrc);
      element.srcset = baseSrc;
      element.setAttribute('srcset', baseSrc);
    } else {
      element.removeAttribute('src');
      element.removeAttribute('srcset');
    }
  }
}

function applyTextOverride(element: HTMLElement, override: BuilderSurfaceOverride) {
  const nextText = override.text ?? '';
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.value = nextText;
    return;
  }
  if (element instanceof HTMLSelectElement) {
    const option = Array.from(element.options).find((candidate) => candidate.text === nextText);
    if (option) {
      element.value = option.value;
    }
    return;
  }
  element.textContent = nextText;
}

function applyButtonOverride(element: HTMLElement, override: BuilderSurfaceOverride) {
  const nextText = override.text ?? '';
  if (element instanceof HTMLInputElement) {
    element.value = nextText;
  } else {
    element.textContent = nextText;
  }

  if (element instanceof HTMLAnchorElement) {
    const href = override.href || '#';
    element.href = href;
    element.setAttribute('href', href);
  }
}

function applyImageOverride(element: HTMLElement, override: BuilderSurfaceOverride) {
  if (!(element instanceof HTMLImageElement)) return;

  const nextAlt = override.alt ?? element.alt;
  const nextSrc = override.src?.trim() || element.getAttribute('src') || element.currentSrc || '';

  element.alt = nextAlt;
  if (nextAlt) {
    element.setAttribute('alt', nextAlt);
  } else {
    element.removeAttribute('alt');
  }

  if (nextSrc) {
    element.src = nextSrc;
    element.setAttribute('src', nextSrc);
    element.srcset = nextSrc;
    element.setAttribute('srcset', nextSrc);
  }
}

function getTextValue(element: HTMLElement) {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    return element.value || element.placeholder || '';
  }
  if (element instanceof HTMLSelectElement) {
    return element.selectedOptions[0]?.text || '';
  }
  return element.textContent?.trim() || '';
}
