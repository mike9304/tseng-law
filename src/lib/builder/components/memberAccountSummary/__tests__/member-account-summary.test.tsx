import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderMemberAccountSummaryCanvasNode } from '@/lib/builder/canvas/types';
import memberAccountSummaryComponent from '../index';
import { getMemberAccountSummaryCopy, MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS } from '../member-account-summary-copy';

const node = {
  id: 'member-account-summary-1',
  kind: 'member-account-summary',
  rect: { x: 0, y: 0, width: 420, height: 280 },
  content: {
    title: '',
    subtitle: '',
    profileHref: '',
    showBookings: true,
    bookingsHref: '',
    showPremium: true,
    premiumHref: '',
    loginHref: '',
    profileLabel: '',
    bookingsLabel: '',
    premiumLabel: '',
    loginLabel: '',
  },
  style: {},
  locked: false,
  responsive: {},
  children: [],
} as unknown as BuilderMemberAccountSummaryCanvasNode;

describe('member account summary localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    expect(getMemberAccountSummaryCopy('zh-hant')).toMatchObject({
      eyebrow: '會員',
      title: '我的帳戶',
      role: '角色',
      loading: '正在載入會員資料...',
      guest: '請先登入以查看帳戶摘要。',
      profile: '個人資料',
      bookings: '預約',
      premium: '進階會員區',
      login: '登入',
    });
  });

  it('renders localized eyebrow and inspector labels in zh-hant', () => {
    const Render = memberAccountSummaryComponent.Render as React.ComponentType<{ node: BuilderMemberAccountSummaryCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; mode?: 'edit' | 'preview' | 'published' }>;
    const Inspector = memberAccountSummaryComponent.Inspector as React.ComponentType<{ node: BuilderMemberAccountSummaryCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="published" />);
    expect(renderHtml).toContain('會員');
    expect(renderHtml).toContain('個人資料');
    expect(renderHtml).toContain('預約');
    expect(renderHtml).toContain('進階會員區');
    expect(renderHtml).toContain('角色: 進階會員');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('標題');
    expect(inspectorHtml).toContain('說明');
    expect(inspectorHtml).toContain('個人資料連結');
    expect(inspectorHtml).toContain('顯示預約連結');
    expect(inspectorHtml).toContain('預約連結');
    expect(inspectorHtml).toContain('顯示進階連結');
    expect(inspectorHtml).toContain('進階連結');
    expect(inspectorHtml).toContain('登入連結');
  });

  it('localizes legacy default inspector values and href placeholders in zh-hant', () => {
    const Render = memberAccountSummaryComponent.Render as React.ComponentType<{ node: BuilderMemberAccountSummaryCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; mode?: 'edit' | 'preview' | 'published' }>;
    const Inspector = memberAccountSummaryComponent.Inspector as React.ComponentType<{ node: BuilderMemberAccountSummaryCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const legacyNode = {
      ...node,
      content: {
        ...node.content,
        ...MEMBER_ACCOUNT_SUMMARY_KO_DEFAULTS,
      },
    } as BuilderMemberAccountSummaryCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        title: 'Custom account',
        subtitle: 'Custom account subtitle',
      },
    } as BuilderMemberAccountSummaryCanvasNode;

    const renderHtml = renderToStaticMarkup(<Render node={legacyNode} locale="zh-hant" mode="published" />);
    expect(renderHtml).toContain('我的帳戶');
    expect(renderHtml).toContain('集中查看會員資料與專屬頁面。');
    expect(renderHtml).not.toContain('내 계정');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('value="我的帳戶"');
    expect(inspectorHtml).toContain('集中查看會員資料與專屬頁面。');
    expect(inspectorHtml).toContain('placeholder="/zh-hant/account/profile"');
    expect(inspectorHtml).toContain('placeholder="/zh-hant/account/bookings"');
    expect(inspectorHtml).toContain('placeholder="/zh-hant/account/premium"');
    expect(inspectorHtml).toContain('placeholder="/zh-hant/login?next=/zh-hant/account"');
    expect(inspectorHtml).not.toContain('value="내 계정"');
    expect(inspectorHtml).not.toContain('placeholder="/ko/account/profile"');

    const customInspectorHtml = renderToStaticMarkup(
      <Inspector node={customNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(customInspectorHtml).toContain('value="Custom account"');
    expect(customInspectorHtml).toContain('Custom account subtitle');
    expect(customInspectorHtml).not.toContain('value="我的帳戶"');
  });
});
