import { describe, expect, it } from 'vitest';
import { resolveLiveChatSettings } from '@/lib/builder/live-chat/app-settings';
import type { BuilderInstalledApp } from '@/lib/builder/apps/types';

function makeChatApp(overrides: Partial<BuilderInstalledApp> = {}): BuilderInstalledApp {
  return {
    appId: 'live-chat',
    version: '1.0.0',
    status: 'enabled',
    installedAt: '2026-05-20T00:00:00.000Z',
    updatedAt: '2026-05-20T00:00:00.000Z',
    settings: {},
    audit: [],
    ...overrides,
  };
}

describe('resolveLiveChatSettings', () => {
  it('uses enabled live chat app settings ahead of legacy site settings', () => {
    expect(resolveLiveChatSettings([makeChatApp({
      settings: {
        'launcher-enabled': true,
        'launcher-label': '상담 문의',
        title: '대만 법률 상담',
        'intro-text': '상담 내용을 남겨주세요.',
        'offline-message': '답변 가능 시간에 연락드리겠습니다.',
        'accent-color': '#123456',
        placement: 'bottom-left',
        'email-required': true,
      },
    })], true)).toEqual({
      source: 'app',
      launcherEnabled: true,
      launcherLabel: '상담 문의',
      title: '대만 법률 상담',
      introText: '상담 내용을 남겨주세요.',
      offlineMessage: '답변 가능 시간에 연락드리겠습니다.',
      accentColor: '#123456',
      placement: 'bottom-left',
      emailRequired: true,
    });
  });

  it('hides the runtime when the app or launcher is disabled', () => {
    expect(resolveLiveChatSettings([makeChatApp({ status: 'disabled' })], true)).toBeNull();
    expect(resolveLiveChatSettings([makeChatApp({ settings: { 'launcher-enabled': false } })], true)).toBeNull();
  });

  it('keeps the old site toggle as a compatibility fallback', () => {
    expect(resolveLiveChatSettings(undefined, true)).toMatchObject({
      source: 'legacy-site-setting',
      launcherEnabled: true,
      title: '호정국제 상담',
      launcherLabel: '실시간 상담',
    });
    expect(resolveLiveChatSettings(undefined, false)).toBeNull();
  });
});
