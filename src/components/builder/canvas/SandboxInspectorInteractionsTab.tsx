'use client';

import LinkPicker, { type LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import type {
  BuilderButtonCanvasNode,
  BuilderCanvasNode,
  BuilderContainerCanvasNode,
  BuilderImageCanvasNode,
  BuilderTextCanvasNode,
} from '@/lib/builder/canvas/types';
import {
  describeLinkScheme,
  linkValueFromLegacy,
  sanitizeLinkValue,
  type LinkValue,
} from '@/lib/builder/links';
import type { Locale } from '@/lib/locales';
import { InspectorNotice } from './InspectorControls';
import { getSandboxInspectorInteractionsCopy } from './sandbox-inspector-interactions-copy';
import styles from './SandboxPage.module.css';

type LinkEditableNode =
  | BuilderButtonCanvasNode
  | BuilderContainerCanvasNode
  | BuilderImageCanvasNode
  | BuilderTextCanvasNode;

type LinkAction = 'none' | 'page' | 'anchor' | 'lightbox' | 'popup' | 'cookie' | 'custom';
type ImageClickAction = NonNullable<BuilderImageCanvasNode['content']['clickAction']>;

function hasEditableLink(node: BuilderCanvasNode): node is LinkEditableNode {
  return node.kind === 'button' || node.kind === 'container' || node.kind === 'image' || node.kind === 'text';
}

function getNodeLink(node: LinkEditableNode): LinkValue | null {
  if (node.kind === 'button') return linkValueFromLegacy(node.content);
  return (node.content.link ?? null) as LinkValue | null;
}

function classifyLink(link: LinkValue | null): LinkAction {
  if (!link?.href) return 'none';
  const scheme = describeLinkScheme(link.href);
  if (scheme === 'internal') return 'page';
  if (scheme === 'anchor') return 'anchor';
  if (scheme === 'lightbox') return 'lightbox';
  if (scheme === 'popup') return 'popup';
  if (scheme === 'cookie-consent') return 'cookie';
  return 'custom';
}

function firstPageHref(context?: LinkPickerContext, locale: Locale = 'ko'): string {
  return context?.sitePages?.[0]?.path ?? `/${locale}`;
}

function firstAnchorHref(context?: LinkPickerContext): string {
  const anchor = context?.siteAnchors?.find((item) => item.trim().length > 0);
  return anchor ? `#${anchor}` : '#top';
}

function firstLightboxHref(context?: LinkPickerContext): string {
  return `lightbox:${context?.siteLightboxes?.[0]?.slug ?? 'welcome'}`;
}

function firstPopupHref(context?: LinkPickerContext): string {
  return `popup:${context?.sitePopups?.[0]?.slug ?? 'welcome'}`;
}

function linkForAction(action: LinkAction, context: LinkPickerContext | undefined, locale: Locale): LinkValue | null {
  if (action === 'none') return null;
  const href = action === 'page'
    ? firstPageHref(context, locale)
    : action === 'anchor'
      ? firstAnchorHref(context)
      : action === 'lightbox'
        ? firstLightboxHref(context)
        : action === 'popup'
          ? firstPopupHref(context)
          : action === 'cookie'
            ? 'cookie-consent:open'
            : 'https://example.com';
  return sanitizeLinkValue({ href, target: action === 'custom' ? '_blank' : '_self' });
}

function linkContentPatch(node: LinkEditableNode, link: LinkValue | null): Record<string, unknown> {
  if (node.kind !== 'button') return { link: link ?? undefined };
  return {
    link: link ?? undefined,
    href: link?.href ?? '',
    target: link?.target === '_blank' ? '_blank' : undefined,
    rel: link?.rel,
    title: link?.title,
    ariaLabel: link?.ariaLabel,
  };
}

export default function SandboxInspectorInteractionsTab({
  node,
  disabled = false,
  locale = 'ko',
  linkPickerContext,
  onUpdateContent,
}: {
  node: BuilderCanvasNode;
  disabled?: boolean;
  locale?: Locale;
  linkPickerContext?: LinkPickerContext;
  onUpdateContent: (content: Record<string, unknown>) => void;
}) {
  const copy = getSandboxInspectorInteractionsCopy(locale);
  const linkNode = hasEditableLink(node) ? node : null;
  const currentLink = linkNode ? getNodeLink(linkNode) : null;
  const linkAction = classifyLink(currentLink);

  function updateLink(link: LinkValue | null) {
    if (!linkNode) return;
    onUpdateContent(linkContentPatch(linkNode, link));
  }

  function updateAction(action: LinkAction) {
    updateLink(linkForAction(action, linkPickerContext, locale));
  }

  function updateImageAction(action: ImageClickAction) {
    if (node.kind !== 'image') return;
    const next: Record<string, unknown> = { clickAction: action };
    if (action === 'link' && !currentLink) next.link = linkForAction('page', linkPickerContext, locale) ?? undefined;
    if (action === 'none') next.link = undefined;
    onUpdateContent(next);
  }

  return (
    <div className={styles.inspectorFormStack} data-builder-interactions-tab="true">
      <label>
        <span>{copy.triggerLabel}</span>
        <select value="click" disabled aria-label={copy.triggerLabel}>
          <option value="click">{copy.clickTrigger}</option>
        </select>
      </label>

      {linkNode ? (
        <>
          <label>
            <span>{copy.actionLabel}</span>
            <select
              value={linkAction}
              disabled={disabled}
              data-builder-interaction-action="link"
              aria-label={copy.actionLabel}
              onChange={(event) => updateAction(event.target.value as LinkAction)}
            >
              <option value="none">{copy.noneAction}</option>
              <option value="page">{copy.pageAction}</option>
              <option value="anchor">{copy.anchorAction}</option>
              <option value="lightbox">{copy.lightboxAction}</option>
              <option value="popup">{copy.popupAction}</option>
              <option value="cookie">{copy.cookieAction}</option>
              <option value="custom">{copy.customAction}</option>
            </select>
          </label>
          <div>
            <span>{copy.destinationLabel}</span>
            <LinkPicker
              value={currentLink}
              onChange={updateLink}
              context={linkPickerContext}
              disabled={disabled}
              locale={locale}
            />
          </div>
          <p className={styles.inspectorHint}>{copy.linkHelp}</p>
        </>
      ) : (
        <InspectorNotice tone="neutral">{copy.unsupported}</InspectorNotice>
      )}

      {node.kind === 'image' ? (
        <label>
          <span>{copy.imageActionLabel}</span>
          <select
            value={node.content.clickAction ?? 'none'}
            disabled={disabled}
            data-builder-interaction-action="image"
            aria-label={copy.imageActionLabel}
            onChange={(event) => updateImageAction(event.target.value as ImageClickAction)}
          >
            <option value="none">{copy.noneAction}</option>
            <option value="link">{copy.imageLinkAction}</option>
            <option value="lightbox">{copy.imageLightboxAction}</option>
            <option value="popup">{copy.imagePopupAction}</option>
          </select>
        </label>
      ) : null}
    </div>
  );
}
