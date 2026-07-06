import {
  normalizeBuilderInstalledApps,
  type BuilderInstalledApp,
} from '@/lib/builder/apps/types';
import type { Locale } from '@/lib/locales';
import { getLiveChatWidgetCopy } from '@/lib/builder/live-chat/widget-copy';

export const LIVE_CHAT_APP_ID = 'live-chat';

export type LiveChatLauncherPlacement = 'bottom-right' | 'bottom-left' | 'bottom-center';

export interface ResolvedLiveChatSettings {
  title: string;
  introText: string;
  offlineMessage: string;
  accentColor: string;
  placement: LiveChatLauncherPlacement;
  emailRequired: boolean;
  launcherEnabled: boolean;
  launcherLabel: string;
  source: 'app' | 'legacy-site-setting';
}

function defaultSettings(locale: Locale = 'ko'): Omit<ResolvedLiveChatSettings, 'source'> {
  const copy = getLiveChatWidgetCopy(locale);

  return {
    title: copy.defaultTitle,
    introText: copy.defaultIntroText,
    offlineMessage: copy.defaultOfflineMessage,
    accentColor: '#0f172a',
    placement: 'bottom-right',
    emailRequired: false,
    launcherEnabled: true,
    launcherLabel: copy.defaultLauncherLabel,
  };
}

function settingString(
  settings: Record<string, unknown>,
  key: string,
  fallback: string,
  maxLength = 240,
): string {
  const value = settings[key];
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : fallback;
}

function settingBoolean(
  settings: Record<string, unknown>,
  key: string,
  fallback: boolean,
): boolean {
  const value = settings[key];
  return typeof value === 'boolean' ? value : fallback;
}

function settingPlacement(
  settings: Record<string, unknown>,
  key: string,
  fallback: LiveChatLauncherPlacement,
): LiveChatLauncherPlacement {
  const value = settings[key];
  if (value === 'bottom-right' || value === 'bottom-left' || value === 'bottom-center') return value;
  return fallback;
}

export function resolveLiveChatSettings(
  installedApps: BuilderInstalledApp[] | undefined,
  legacySiteSettingEnabled?: boolean,
  locale?: Locale,
): ResolvedLiveChatSettings | null {
  const apps = normalizeBuilderInstalledApps(installedApps);
  const chatApp = apps.find((app) => app.appId === LIVE_CHAT_APP_ID);
  const defaults = defaultSettings(locale);

  if (chatApp) {
    if (chatApp.status !== 'enabled') return null;
    const settings = {
      ...(chatApp.settings ?? {}),
      ...(locale ? (chatApp.localizedSettings?.[locale] ?? {}) : {}),
    };
    const launcherEnabled = settingBoolean(settings, 'launcher-enabled', defaults.launcherEnabled);
    if (!launcherEnabled) return null;
    return {
      source: 'app',
      title: settingString(settings, 'title', defaults.title, 80),
      introText: settingString(settings, 'intro-text', defaults.introText, 240),
      offlineMessage: settingString(settings, 'offline-message', defaults.offlineMessage, 300),
      accentColor: settingString(settings, 'accent-color', defaults.accentColor, 60),
      placement: settingPlacement(settings, 'placement', defaults.placement),
      emailRequired: settingBoolean(settings, 'email-required', defaults.emailRequired),
      launcherEnabled,
      launcherLabel: settingString(settings, 'launcher-label', defaults.launcherLabel, 80),
    };
  }

  if (legacySiteSettingEnabled) {
    return {
      ...defaults,
      source: 'legacy-site-setting',
    };
  }

  return null;
}
