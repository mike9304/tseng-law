import type {
  BuilderHeaderFooterConfig,
  BuilderMobileBottomBar,
  BuilderMobileBottomBarAction,
  BuilderSiteDocument,
  BuilderSiteSettings,
} from '@/lib/builder/site/types';

export const MOBILE_SCHEMA_LOCKED_AT = '2026-05-10T03:00:00+09:00';
export const MOBILE_HAMBURGER_MODES = ['auto', 'off', 'force'] as const;

function sanitizePhoneHref(phone?: string): string {
  const cleaned = (phone ?? '').replace(/[^\d+]/g, '');
  return cleaned ? `tel:${cleaned}` : 'tel:+886227515255';
}

function defaultMobileBottomBarActions(settings?: BuilderSiteSettings): BuilderMobileBottomBarAction[] {
  return [
    {
      id: 'call',
      label: '전화',
      href: sanitizePhoneHref(settings?.phone),
      kind: 'phone',
    },
    {
      id: 'consultation',
      label: '상담 예약',
      href: '#contact',
      kind: 'booking',
    },
  ];
}

function normalizeMobileBottomBarAction(
  action: Partial<BuilderMobileBottomBarAction> | null | undefined,
  fallback: BuilderMobileBottomBarAction,
): BuilderMobileBottomBarAction {
  const kind = action?.kind === 'phone' || action?.kind === 'booking' || action?.kind === 'custom'
    ? action.kind
    : fallback.kind;
  const id = typeof action?.id === 'string' && action.id.trim()
    ? action.id.trim().slice(0, 80)
    : fallback.id;
  const label = typeof action?.label === 'string' && action.label.trim()
    ? action.label.trim().slice(0, 40)
    : fallback.label;
  const href = typeof action?.href === 'string' && action.href.trim()
    ? action.href.trim().slice(0, 500)
    : fallback.href;

  return { id, label, href, kind };
}

export function normalizeHeaderFooterMobileConfig(
  headerFooter: BuilderHeaderFooterConfig | null | undefined,
): BuilderHeaderFooterConfig {
  const mode = headerFooter?.mobileHamburger;
  return {
    ...(headerFooter ?? {}),
    mobileSticky: headerFooter?.mobileSticky === true,
    mobileHamburger: mode && MOBILE_HAMBURGER_MODES.includes(mode) ? mode : 'auto',
  };
}

export function normalizeMobileBottomBar(
  input: BuilderMobileBottomBar | null | undefined,
  settings?: BuilderSiteSettings,
): BuilderMobileBottomBar {
  const fallbackActions = defaultMobileBottomBarActions(settings);
  const incomingActions = Array.isArray(input?.actions) ? input.actions.slice(0, 3) : [];
  const actions = fallbackActions.map((fallback, index) => (
    normalizeMobileBottomBarAction(incomingActions[index], fallback)
  ));

  for (const extra of incomingActions.slice(fallbackActions.length)) {
    actions.push(normalizeMobileBottomBarAction(extra, {
      id: `custom-${actions.length + 1}`,
      label: '바로가기',
      href: '#contact',
      kind: 'custom',
    }));
  }

  return {
    enabled: input?.enabled === true,
    actions,
  };
}

export function normalizeMobileSchemaForSiteDocument(site: BuilderSiteDocument): BuilderSiteDocument {
  return {
    ...site,
    headerFooter: normalizeHeaderFooterMobileConfig(site.headerFooter),
    mobileBottomBar: normalizeMobileBottomBar(site.mobileBottomBar, site.settings),
  };
}
