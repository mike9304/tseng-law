import { describe, expect, it } from 'vitest';
import { getNotificationInboxCopy } from '../NotificationInbox';

describe('notification inbox copy', () => {
  it('returns localized notification inbox labels', () => {
    const zh = getNotificationInboxCopy('zh-hant');
    expect(zh.buttonLabel(2)).toBe('通知（2 則未讀）');
    expect(zh.dialogLabel).toBe('通知收件匣');
    expect(zh.markAllRead).toBe('全部標為已讀');
    expect(zh.kindLabels.booking).toBe('預約');
    expect(zh.empty).toBe('沒有通知。');

    const ko = getNotificationInboxCopy('ko');
    expect(ko.buttonLabel(0)).toBe('알림');
    expect(ko.kindLabels.publish).toBe('게시');
    expect(ko.loadFailed).toBe('알림을 불러오지 못했습니다.');
  });
});
