import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { BuilderMemberLoginCanvasNode } from '@/lib/builder/canvas/types';
import memberLoginComponent from '../index';
import { getMemberLoginCopy, MEMBER_LOGIN_KO_DEFAULTS } from '../member-login-copy';

const node = {
  id: 'member-login-1',
  kind: 'member-login',
  rect: { x: 0, y: 0, width: 420, height: 320 },
  content: {
    title: '',
    subtitle: '',
    defaultMode: 'login',
    showSignup: true,
    nextPath: '',
    loginLabel: '',
    signupLabel: '',
  },
  style: {},
  locked: false,
  responsive: {},
  children: [],
} as unknown as BuilderMemberLoginCanvasNode;

describe('member login localization', () => {
  it('returns localized helper copy in zh-hant', () => {
    expect(getMemberLoginCopy('zh-hant')).toMatchObject({
      eyebrow: '會員',
      title: '會員登入',
      login: '登入',
      inspectorTitle: '標題',
      inspectorPublicSignupNotice: '公開註冊已停用。請在會員管理頁面建立會員帳戶。',
    });
  });

  it('renders localized public fallback and inspector labels in zh-hant', () => {
    const Render = memberLoginComponent.Render as React.ComponentType<{ node: BuilderMemberLoginCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; mode?: 'edit' | 'preview' | 'published' }>;
    const Inspector = memberLoginComponent.Inspector as React.ComponentType<{ node: BuilderMemberLoginCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="published" />);
    expect(renderHtml).toContain('會員');
    expect(renderHtml).toContain('會員登入');
    expect(renderHtml).toContain('會員帳戶由事務所確認後建立。既有會員請登入。');
    expect(renderHtml).toContain('Email');
    expect(renderHtml).toContain('data-builder-member-login-mode="login"');
    expect(renderHtml).toContain('data-public-signup-enabled="false"');
    expect(renderHtml).not.toContain('建立帳戶');
    expect(renderHtml).not.toContain('name="name"');
    expect(renderHtml).not.toContain('role="tablist"');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('標題');
    expect(inspectorHtml).toContain('說明');
    expect(inspectorHtml).toContain('登入後前往路徑');
    expect(inspectorHtml).toContain('公開註冊已停用。請在會員管理頁面建立會員帳戶。');
    expect(inspectorHtml).toContain('登入按鈕標籤');
    expect(inspectorHtml).not.toContain('顯示註冊分頁');
    expect(inspectorHtml).not.toContain('註冊按鈕標籤');
  });

  it('localizes legacy default member login content in zh-hant inspector without changing custom content', () => {
    const Render = memberLoginComponent.Render as React.ComponentType<{ node: BuilderMemberLoginCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; mode?: 'edit' | 'preview' | 'published' }>;
    const Inspector = memberLoginComponent.Inspector as React.ComponentType<{ node: BuilderMemberLoginCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;
    const legacyNode = {
      ...node,
      content: {
        ...node.content,
        title: MEMBER_LOGIN_KO_DEFAULTS.title,
        subtitle: MEMBER_LOGIN_KO_DEFAULTS.subtitle,
        loginLabel: MEMBER_LOGIN_KO_DEFAULTS.loginLabel,
        signupLabel: MEMBER_LOGIN_KO_DEFAULTS.signupLabel,
      },
    } as BuilderMemberLoginCanvasNode;
    const customNode = {
      ...legacyNode,
      content: {
        ...legacyNode.content,
        title: 'Custom member title',
        subtitle: 'Custom member subtitle',
        loginLabel: 'Custom login',
        signupLabel: 'Custom signup',
      },
    } as BuilderMemberLoginCanvasNode;

    const legacyRenderHtml = renderToStaticMarkup(
      <Render node={legacyNode} locale="zh-hant" mode="published" />,
    );
    expect(legacyRenderHtml).toContain('會員登入');
    expect(legacyRenderHtml).toContain('會員帳戶由事務所確認後建立。既有會員請登入。');
    expect(legacyRenderHtml).not.toContain('회원 로그인');
    expect(legacyRenderHtml).not.toContain('建立帳戶');

    const legacyInspectorHtml = renderToStaticMarkup(
      <Inspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('value="會員登入"');
    expect(legacyInspectorHtml).toContain('會員帳戶由事務所確認後建立。既有會員請登入。');
    expect(legacyInspectorHtml).toContain('placeholder="/zh-hant/account"');
    expect(legacyInspectorHtml).toContain('value="登入"');
    expect(legacyInspectorHtml).not.toContain('value="建立帳戶"');
    expect(legacyInspectorHtml).not.toContain('value="회원 로그인"');
    expect(legacyInspectorHtml).not.toContain('placeholder="/ko/account"');

    const customInspectorHtml = renderToStaticMarkup(
      <Inspector node={customNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(customInspectorHtml).toContain('value="Custom member title"');
    expect(customInspectorHtml).toContain('Custom member subtitle');
    expect(customInspectorHtml).toContain('value="Custom login"');
    expect(customInspectorHtml).not.toContain('value="Custom signup"');
    expect(customInspectorHtml).not.toContain('value="會員登入"');
  });

  it('ignores persisted signup-enabled content and always renders login-only UI', () => {
    const Render = memberLoginComponent.Render as React.ComponentType<{ node: BuilderMemberLoginCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; mode?: 'edit' | 'preview' | 'published' }>;
    const signupConfiguredNode = {
      ...node,
      content: {
        ...node.content,
        defaultMode: 'signup',
        showSignup: true,
        signupLabel: 'Create an unsafe public account',
      },
    } as BuilderMemberLoginCanvasNode;

    const html = renderToStaticMarkup(
      <Render node={signupConfiguredNode} locale="en" mode="published" />,
    );

    expect(html).toContain('data-builder-member-login-mode="login"');
    expect(html).toContain('autoComplete="current-password"');
    expect(html).not.toContain('Create an unsafe public account');
    expect(html).not.toContain('name="name"');
    expect(html).not.toContain('data-builder-member-login-tab="signup"');
  });
});
