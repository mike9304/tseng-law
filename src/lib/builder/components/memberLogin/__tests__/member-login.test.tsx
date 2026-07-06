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
      signup: '建立帳戶',
      inspectorTitle: '標題',
      inspectorDefaultTab: '預設分頁',
      inspectorModeSignup: '註冊',
    });
  });

  it('renders localized public fallback and inspector labels in zh-hant', () => {
    const Render = memberLoginComponent.Render as React.ComponentType<{ node: BuilderMemberLoginCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; mode?: 'edit' | 'preview' | 'published' }>;
    const Inspector = memberLoginComponent.Inspector as React.ComponentType<{ node: BuilderMemberLoginCanvasNode; locale?: 'ko' | 'zh-hant' | 'en'; onUpdate: (props: Record<string, unknown>) => void; disabled?: boolean }>;

    const renderHtml = renderToStaticMarkup(<Render node={node} locale="zh-hant" mode="published" />);
    expect(renderHtml).toContain('會員');
    expect(renderHtml).toContain('會員登入');
    expect(renderHtml).toContain('建立帳戶');
    expect(renderHtml).toContain('Email');

    const inspectorHtml = renderToStaticMarkup(
      <Inspector node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(inspectorHtml).toContain('標題');
    expect(inspectorHtml).toContain('說明');
    expect(inspectorHtml).toContain('登入後前往路徑');
    expect(inspectorHtml).toContain('顯示註冊分頁');
    expect(inspectorHtml).toContain('預設分頁');
    expect(inspectorHtml).toContain('登入按鈕標籤');
    expect(inspectorHtml).toContain('註冊按鈕標籤');
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
    expect(legacyRenderHtml).toContain('登入或建立帳戶以進入會員專屬內容。');
    expect(legacyRenderHtml).not.toContain('회원 로그인');

    const legacyInspectorHtml = renderToStaticMarkup(
      <Inspector node={legacyNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(legacyInspectorHtml).toContain('value="會員登入"');
    expect(legacyInspectorHtml).toContain('登入或建立帳戶以進入會員專屬內容。');
    expect(legacyInspectorHtml).toContain('placeholder="/zh-hant/account"');
    expect(legacyInspectorHtml).toContain('value="登入"');
    expect(legacyInspectorHtml).toContain('value="建立帳戶"');
    expect(legacyInspectorHtml).not.toContain('value="회원 로그인"');
    expect(legacyInspectorHtml).not.toContain('placeholder="/ko/account"');

    const customInspectorHtml = renderToStaticMarkup(
      <Inspector node={customNode} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
    );
    expect(customInspectorHtml).toContain('value="Custom member title"');
    expect(customInspectorHtml).toContain('Custom member subtitle');
    expect(customInspectorHtml).toContain('value="Custom login"');
    expect(customInspectorHtml).toContain('value="Custom signup"');
    expect(customInspectorHtml).not.toContain('value="會員登入"');
  });
});
