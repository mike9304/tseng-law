import type { BuilderSocialEmbedCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getSocialWidgetsCopy } from '../social-widgets-copy';

function SocialEmbedRender({
  node,
  locale = 'ko',
  mode = 'edit',
}: {
  node: BuilderSocialEmbedCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const isEdit = mode === 'edit';
  const copy = getSocialWidgetsCopy(locale);
  const providerLabel = copy.socialEmbed.providers[c.provider];

  return (
    <div
      className="builder-social-embed"
      data-builder-social-widget="embed"
      data-builder-social-provider={c.provider}
      data-builder-social-layout={c.layout}
    >
      {c.showHeader ? (
        <header>
          <strong>{providerLabel}</strong>
          <small>{c.handle || c.channelId || copy.socialEmbed.handleFallback}</small>
        </header>
      ) : null}
      {isEdit ? (
        <div
          className="builder-social-embed-placeholder"
          data-builder-demo-disclosure="social-embed-placeholder"
        >
          <em>{copy.socialEmbed.editPlaceholder(providerLabel)}</em>
          <small>({copy.socialEmbed.editSdkHint})</small>
        </div>
      ) : (
        <div
          className="builder-social-embed-placeholder builder-social-embed-unavailable"
          data-builder-demo-disclosure="social-embed-placeholder"
          data-builder-social-provider-label={providerLabel}
        >
          <strong>{copy.socialEmbed.unavailableTitle}</strong>
          <small>{copy.socialEmbed.unavailableMessage}</small>
        </div>
      )}
    </div>
  );
}

export default SocialEmbedRender;
