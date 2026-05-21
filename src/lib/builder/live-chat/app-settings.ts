import {
  normalizeBuilderInstalledApps,
  type BuilderInstalledApp,
} from '@/lib/builder/apps/types';
import type { Locale } from '@/lib/locales';

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

const DEFAULT_SETTINGS: Omit<ResolvedLiveChatSettings, 'source'> = {
  title: '호정국제 상담',
  introText: '이름과 이메일은 선택 사항입니다.',
  offlineMessage: '지금은 답변이 지연될 수 있습니다. 메시지를 남겨주시면 확인 후 연락드리겠습니다.',
  accentColor: '#0f172a',
  placement: 'bottom-right',
  emailRequired: false,
  launcherEnabled: true,
  launcherLabel: '실시간 상담',
};

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

  if (chatApp) {
    if (chatApp.status !== 'enabled') return null;
    const settings = {
      ...(chatApp.settings ?? {}),
      ...(locale ? (chatApp.localizedSettings?.[locale] ?? {}) : {}),
    };
    const launcherEnabled = settingBoolean(settings, 'launcher-enabled', DEFAULT_SETTINGS.launcherEnabled);
    if (!launcherEnabled) return null;
    return {
      source: 'app',
      title: settingString(settings, 'title', DEFAULT_SETTINGS.title, 80),
      introText: settingString(settings, 'intro-text', DEFAULT_SETTINGS.introText, 240),
      offlineMessage: settingString(settings, 'offline-message', DEFAULT_SETTINGS.offlineMessage, 300),
      accentColor: settingString(settings, 'accent-color', DEFAULT_SETTINGS.accentColor, 60),
      placement: settingPlacement(settings, 'placement', DEFAULT_SETTINGS.placement),
      emailRequired: settingBoolean(settings, 'email-required', DEFAULT_SETTINGS.emailRequired),
      launcherEnabled,
      launcherLabel: settingString(settings, 'launcher-label', DEFAULT_SETTINGS.launcherLabel, 80),
    };
  }

  if (legacySiteSettingEnabled) {
    return {
      ...DEFAULT_SETTINGS,
      source: 'legacy-site-setting',
    };
  }

  return null;
}
