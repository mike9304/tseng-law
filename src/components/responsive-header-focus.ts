export type ResponsiveHeaderFocusOptions = {
  desktopControlSelector: string;
  desktopRestoreSelector: string;
  toggleSelector: string;
  drawerSelector: string;
};

export function installResponsiveHeaderFocus(
  root: HTMLElement,
  options: ResponsiveHeaderFocusOptions,
): () => void {
  const {
    desktopControlSelector,
    desktopRestoreSelector,
    toggleSelector,
    drawerSelector,
  } = options;
  const controlSelector = [
    desktopControlSelector,
    desktopRestoreSelector,
    toggleSelector,
  ].join(', ');

  let raf = 0;
  let primed = false;
  let cleaned = false;
  let tracked: HTMLElement | null = null;
  let lastShown = false;
  let eligible = false;
  let windowActive =
    typeof document.hasFocus === 'function' ? document.hasFocus() : true;

  const query = (selector: string): HTMLElement | null =>
    root.querySelector(selector);

  const isBodyLike = (node: EventTarget | null): boolean =>
    node === document.body ||
    node === document.documentElement ||
    node === document;

  const eventEl = (target: EventTarget | null): Element | null => {
    if (target instanceof Element) return target;
    if (target instanceof Node) return target.parentElement;
    return null;
  };

  const isLayoutVisible = (el: Element): boolean => {
    if (!el.isConnected) return false;
    let node: Element | null = el;
    while (node) {
      if (node instanceof HTMLElement && (node.hidden || node.inert)) return false;
      const style = getComputedStyle(node);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.visibility === 'collapse'
      ) {
        return false;
      }
      if (node === document.documentElement) break;
      node = node.parentElement;
    }
    const box = el.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  };

  const isDisabled = (el: Element): boolean =>
    'disabled' in el && Boolean((el as HTMLButtonElement).disabled);

  const canFocus = (el: HTMLElement): boolean =>
    isLayoutVisible(el) && !isDisabled(el);

  const closestControl = (el: Element | null): HTMLElement | null => {
    if (!el || !root.contains(el)) return null;
    const hit = el.closest(controlSelector);
    return hit instanceof HTMLElement && root.contains(hit) ? hit : null;
  };

  const isToggle = (el: HTMLElement): boolean => el.matches(toggleSelector);
  const isDesktopControl = (el: HTMLElement): boolean =>
    el.matches(desktopControlSelector) || el.matches(desktopRestoreSelector);

  const anyDesktopVisible = (): boolean => {
    const nodes = root.querySelectorAll(desktopControlSelector);
    for (let i = 0; i < nodes.length; i++) {
      if (isLayoutVisible(nodes[i]!)) return true;
    }
    return false;
  };

  const isCompact = (toggle: HTMLElement | null): boolean =>
    Boolean(toggle && isLayoutVisible(toggle) && !anyDesktopVisible());

  const drawerBlocks = (): boolean => {
    const drawer = query(drawerSelector);
    if (!drawer) return false;
    if (drawer.getAttribute('aria-expanded') === 'true') return true;
    const active = document.activeElement;
    return Boolean(active && drawer.contains(active));
  };

  const clearOwnership = (): void => {
    tracked = null;
    lastShown = false;
    eligible = false;
  };

  const remember = (el: HTMLElement): void => {
    tracked = el;
    lastShown = isLayoutVisible(el);
    eligible = true;
  };

  const onFocusIn = (event: FocusEvent): void => {
    const target = eventEl(event.target);
    if (!target || isBodyLike(target)) return;
    if (!root.contains(target)) {
      clearOwnership();
      return;
    }
    const control = closestControl(target);
    if (control) remember(control);
    else clearOwnership();
  };

  const onFocusOut = (event: FocusEvent): void => {
    if (!tracked || !eligible) return;
    const target = eventEl(event.target);
    if (!target || (target !== tracked && !tracked.contains(target))) return;
    const related = event.relatedTarget;
    if (related == null || isBodyLike(related)) {
      if (isLayoutVisible(tracked)) eligible = false;
    }
  };

  const onPointerDown = (event: PointerEvent): void => {
    const target = eventEl(event.target);
    if (!target || !root.contains(target)) clearOwnership();
  };

  const onWindowBlur = (): void => {
    windowActive = false;
  };

  const onWindowFocus = (): void => {
    windowActive = true;
  };

  const applyFocus = (el: HTMLElement): void => {
    if (!canFocus(el)) return;
    el.focus({ preventScroll: true });
  };

  const sync = (): void => {
    if (cleaned) return;
    if (!primed) {
      primed = true;
      if (tracked) lastShown = isLayoutVisible(tracked);
      return;
    }
    if (!tracked || !tracked.isConnected) {
      if (tracked && !tracked.isConnected) clearOwnership();
      return;
    }
    const focusedDoc =
      typeof document.hasFocus === 'function' ? document.hasFocus() : windowActive;
    if (!windowActive || !focusedDoc) {
      lastShown = isLayoutVisible(tracked);
      return;
    }
    if (drawerBlocks()) {
      lastShown = isLayoutVisible(tracked);
      return;
    }
    const nowShown = isLayoutVisible(tracked);
    const becameHidden = lastShown && !nowShown;
    lastShown = nowShown;
    if (!becameHidden || !eligible) return;
    const active = document.activeElement;
    if (
      active &&
      active !== tracked &&
      !isBodyLike(active) &&
      !tracked.contains(active)
    ) {
      return;
    }
    const toggle = query(toggleSelector);
    const restore = query(desktopRestoreSelector);
    if (
      isDesktopControl(tracked) &&
      isCompact(toggle) &&
      toggle &&
      toggle.getAttribute('aria-expanded') !== 'true'
    ) {
      applyFocus(toggle);
      return;
    }
    if (isToggle(tracked) && toggle && !isLayoutVisible(toggle) && restore) {
      applyFocus(restore);
    }
  };

  const schedule = (): void => {
    if (cleaned || raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      sync();
    });
  };

  window.addEventListener('resize', schedule);
  window.addEventListener('blur', onWindowBlur);
  window.addEventListener('focus', onWindowFocus);
  document.addEventListener('focusin', onFocusIn, true);
  document.addEventListener('focusout', onFocusOut, true);
  document.addEventListener('pointerdown', onPointerDown, true);

  let ro: ResizeObserver | undefined;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(schedule);
    ro.observe(root);
  }

  const mo = new MutationObserver(schedule);
  mo.observe(root, {
    attributes: true,
    attributeFilter: ['class', 'data-header-content-fit'],
  });

  return () => {
    if (cleaned) return;
    cleaned = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    window.removeEventListener('resize', schedule);
    window.removeEventListener('blur', onWindowBlur);
    window.removeEventListener('focus', onWindowFocus);
    document.removeEventListener('focusin', onFocusIn, true);
    document.removeEventListener('focusout', onFocusOut, true);
    document.removeEventListener('pointerdown', onPointerDown, true);
    ro?.disconnect();
    mo.disconnect();
    clearOwnership();
  };
}
