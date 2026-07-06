import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderMemberBookingsListCanvasNode,
  BuilderMemberProfileFormCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  getMemberAccountWidgetsCopy,
  MEMBER_BOOKINGS_LIST_KO_DEFAULTS,
  MEMBER_PROFILE_FORM_KO_DEFAULTS,
} from '../member-account-widgets-copy';
import memberBookingsListComponent from '../memberBookingsList';
import memberProfileFormComponent from '../memberProfileForm';

describe('member account widget localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    const copy = getMemberAccountWidgetsCopy('zh-hant');

    expect(copy.profileForm).toMatchObject({
      eyebrow: '個人資料',
      title: '會員個人資料',
      save: '儲存個人資料',
      previewName: '會員預覽',
    });
    expect(copy.profileForm.inspector).toMatchObject({
      title: '標題',
      saveLabel: '儲存按鈕',
      loginLink: '登入連結',
    });
    expect(copy.bookingsList).toMatchObject({
      eyebrow: '預約',
      title: '我的預約',
      staff: '負責人',
    });
    expect(copy.bookingsList.statusLabels.confirmed).toBe('已確認');
    expect(copy.bookingsList.inspector.showPast).toBe('顯示過去預約');
  });

  it('renders localized profile form defaults and inspector labels in zh-hant', () => {
    const Render = memberProfileFormComponent.Render as React.ComponentType<{
      node: BuilderMemberProfileFormCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = memberProfileFormComponent.Inspector as React.ComponentType<{
      node: BuilderMemberProfileFormCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      id: 'member-profile-1',
      kind: 'member-profile-form',
      content: {
        ...MEMBER_PROFILE_FORM_KO_DEFAULTS,
        loginHref: '',
      },
    } as unknown as BuilderMemberProfileFormCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);
    expect(renderHtml).toContain('個人資料');
    expect(renderHtml).toContain('會員個人資料');
    expect(renderHtml).toContain('更新會員姓名與聯絡電話。');
    expect(renderHtml).toContain('會員預覽');
    expect(renderHtml).toContain('姓名');
    expect(renderHtml).toContain('電話');
    expect(renderHtml).toContain('儲存個人資料');
    expect(renderHtml).not.toContain('회원 프로필');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('標題');
    expect(inspectorHtml).toContain('姓名標籤');
    expect(inspectorHtml).toContain('儲存完成訊息');
    expect(inspectorHtml).toContain('登入連結');
    expect(inspectorHtml).toContain('value="會員個人資料"');
    expect(inspectorHtml).toContain('更新會員姓名與聯絡電話。');
    expect(inspectorHtml).toContain('value="姓名"');
    expect(inspectorHtml).toContain('value="電話"');
    expect(inspectorHtml).toContain('value="儲存個人資料"');
    expect(inspectorHtml).toContain('value="儲存中..."');
    expect(inspectorHtml).toContain('value="已儲存。"');
    expect(inspectorHtml).toContain('placeholder="/zh-hant/login?next=/zh-hant/account"');
    expect(inspectorHtml).not.toContain('value="회원 프로필"');
    expect(inspectorHtml).not.toContain('placeholder="/ko/login?next=/ko/account"');
  });

  it('renders localized bookings defaults, status labels, and inspector labels in zh-hant', () => {
    const Render = memberBookingsListComponent.Render as React.ComponentType<{
      node: BuilderMemberBookingsListCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      mode?: 'edit' | 'preview' | 'published';
    }>;
    const Inspector = memberBookingsListComponent.Inspector as React.ComponentType<{
      node: BuilderMemberBookingsListCanvasNode;
      locale?: 'ko' | 'zh-hant' | 'en';
      onUpdate: (props: Record<string, unknown>) => void;
      disabled?: boolean;
    }>;
    const node = {
      id: 'member-bookings-1',
      kind: 'member-bookings-list',
      content: {
        ...MEMBER_BOOKINGS_LIST_KO_DEFAULTS,
        loginHref: '',
        showPast: true,
      },
    } as unknown as BuilderMemberBookingsListCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="preview" />);
    expect(renderHtml).toContain('預約');
    expect(renderHtml).toContain('我的預約');
    expect(renderHtml).toContain('即將到來');
    expect(renderHtml).toContain('負責人');
    expect(renderHtml).toContain('已確認');
    expect(renderHtml).toContain('目前沒有過去預約。');
    expect(renderHtml).not.toContain('Bookings');
    expect(renderHtml).not.toContain('confirmed');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('即將到來標籤');
    expect(inspectorHtml).toContain('顯示過去預約');
    expect(inspectorHtml).toContain('過去預約標籤');
    expect(inspectorHtml).toContain('登入連結');
    expect(inspectorHtml).toContain('value="我的預約"');
    expect(inspectorHtml).toContain('顯示與會員信箱相符的諮詢預約。');
    expect(inspectorHtml).toContain('value="即將到來"');
    expect(inspectorHtml).toContain('value="過去預約"');
    expect(inspectorHtml).toContain('placeholder="/zh-hant/login?next=/zh-hant/account/bookings"');
    expect(inspectorHtml).not.toContain('value="내 예약"');
    expect(inspectorHtml).not.toContain('placeholder="/ko/login?next=/ko/account/bookings"');
  });
});
