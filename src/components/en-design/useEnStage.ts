'use client';

import { useEffect } from 'react';

/**
 * Client behaviour for the en "Clear Night" stages (CONCEPT-V2 5.6). Every hook only writes data
 * attributes or one custom property; the server HTML is already the finished, readable layout
 * (S3 as a stack, S4 with every step listed), so nothing depends on these running.
 */

type ElementGetter = () => HTMLElement | null;

const HEADER_SELECTOR = 'header.header[data-public-site-header]';

/**
 * Writes the measured header height to `--en-hdr` on the root, only when it differs from the CSS value
 * (`--en-hdr-css`, set per width band in the stylesheet) by more than 0.5 px; otherwise the CSS value stands.
 */
export function useEnHeaderOffset(getRoot: ElementGetter) {
  useEffect(() => {
    const root = getRoot();
    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR);
    if (!root || !header || typeof ResizeObserver === 'undefined') return undefined;
    const sync = () => {
      const measured = header.getBoundingClientRect().height;
      if (!measured) return;
      const token = Number.parseFloat(getComputedStyle(root).getPropertyValue('--en-hdr-css'));
      const current = root.style.getPropertyValue('--en-hdr');
      if (!Number.isFinite(token) || Math.abs(token - measured) > 0.5) {
        const next = `${measured.toFixed(2)}px`;
        if (current !== next) root.style.setProperty('--en-hdr', next);
      } else if (current) {
        root.style.removeProperty('--en-hdr');
      }
    };
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    window.addEventListener('resize', sync);
    sync();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [getRoot]);
}

/** `data-en-save-data` on the root when the browser asks to save data (the focus layers are then not shown or fetched). */
export function useEnSaveData(getRoot: ElementGetter) {
  useEffect(() => {
    const root = getRoot();
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!root) return;
    if (connection?.saveData) root.setAttribute('data-en-save-data', '');
    else root.removeAttribute('data-en-save-data');
  }, [getRoot]);
}

/**
 * Watches zero-size markers and reports how many have passed the middle of the viewport. The observed
 * band runs from far above the viewport down to its middle, so a marker counts as passed from the moment
 * it crosses the middle until the page scrolls back past it, even after a long jump (End key, anchor link,
 * fast fling) that never lets it sit inside a narrow band. Callbacks fire only at crossings.
 */
function observePassed(markers: HTMLElement[], onChange: (passed: number) => void) {
  const passed = new Set<Element>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) passed.add(entry.target);
        else passed.delete(entry.target);
      });
      onChange(passed.size);
    },
    { rootMargin: '100000px 0px -50% 0px' },
  );
  markers.forEach((marker) => observer.observe(marker));
  return observer;
}

/**
 * S3 "lit run": switches the practice list between the stack (server default) and the run, and marks
 * the active item from six scroll markers (28svh apart) or from keyboard focus.
 */
export function useEnRun(getSection: ElementGetter) {
  useEffect(() => {
    const section = getSection();
    if (!section) return undefined;
    const items = Array.from(section.querySelectorAll<HTMLElement>('[data-run-index]'));
    const markers = Array.from(section.querySelectorAll<HTMLElement>('[data-stage-marker]'));
    if (!items.length) return undefined;
    const query = window.matchMedia('(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)');
    const setActive = (index: number) => {
      items.forEach((item, i) => {
        if (i === index) item.setAttribute('data-active', '');
        else item.removeAttribute('data-active');
      });
    };
    let observer: IntersectionObserver | null = null;
    const apply = () => {
      const on = query.matches;
      section.setAttribute('data-en-run', on ? 'on' : 'off');
      observer?.disconnect();
      observer = null;
      if (!on) {
        items.forEach((item) => item.removeAttribute('data-active'));
        return;
      }
      setActive(0);
      if (typeof IntersectionObserver === 'undefined' || !markers.length) return;
      observer = observePassed(markers, (passed) => setActive(Math.min(items.length - 1, Math.max(0, passed - 1))));
    };
    const onFocus = (event: FocusEvent) => {
      if (section.getAttribute('data-en-run') !== 'on') return;
      const item = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-run-index]');
      if (item) setActive(Number(item.dataset.runIndex));
    };
    apply();
    query.addEventListener('change', apply);
    section.addEventListener('focusin', onFocus);
    return () => {
      observer?.disconnect();
      query.removeEventListener('change', apply);
      section.removeEventListener('focusin', onFocus);
    };
  }, [getSection]);
}

/** S4: the three steps advance from scroll markers; the server lists all steps until this runs. */
export function useEnSteps(getStage: ElementGetter) {
  useEffect(() => {
    const stage = getStage();
    if (!stage) return undefined;
    const markers = Array.from(stage.querySelectorAll<HTMLElement>('[data-stage-marker]'));
    const query = window.matchMedia('(min-height: 700px) and (prefers-reduced-motion: no-preference)');
    let observer: IntersectionObserver | null = null;
    const apply = () => {
      observer?.disconnect();
      observer = null;
      if (!query.matches || typeof IntersectionObserver === 'undefined' || !markers.length) {
        stage.setAttribute('data-steps', 'all');
        stage.removeAttribute('data-step');
        return;
      }
      stage.setAttribute('data-steps', 'stepped');
      stage.setAttribute('data-step', '1');
      // Marker 0 sits at the top of the stage, markers 1 and 2 at 35 % and 70 % of the pinned range.
      observer = observePassed(markers, (passed) => stage.setAttribute('data-step', String(Math.min(markers.length, Math.max(1, passed)))));
    };
    apply();
    query.addEventListener('change', apply);
    return () => {
      observer?.disconnect();
      query.removeEventListener('change', apply);
    };
  }, [getStage]);
}

/** Browsers without scroll timelines (Firefox): the S0 curtain opens with a class toggle from a sentinel 20svh down. */
export function useEnCurtainFallback(getReel: ElementGetter) {
  useEffect(() => {
    const reel = getReel();
    if (!reel || typeof CSS === 'undefined' || CSS.supports('animation-timeline: scroll()')) return undefined;
    const sentinel = reel.querySelector<HTMLElement>('[data-curtain-sentinel]');
    if (!sentinel || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      if (passed) reel.setAttribute('data-open', '');
      else if (entry.isIntersecting) reel.removeAttribute('data-open');
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [getReel]);
}
