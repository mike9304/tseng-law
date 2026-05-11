import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSocialEmbedCanvasNode } from '@/lib/builder/canvas/types';

function SocialEmbedRender({
  node,
  mode = 'edit',
}: {
  node: BuilderSocialEmbedCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const isEdit = mode === 'edit';

  return (
    <div
      className="builder-social-embed"
      data-builder-social-widget="embed"
      data-builder-social-provider={c.provider}
      data-builder-social-layout={c.layout}
    >
      {c.showHeader ? (
        <header>
          <strong>{c.provider}</strong>
          <small>{c.handle || c.channelId || '@핸들'}</small>
        </header>
      ) : null}
      {isEdit ? (
        <div className="builder-social-embed-placeholder">
          <em>{c.provider} 외부 임베드 자리</em>
          <small>(public 페이지에서 SDK 로드)</small>
        </div>
      ) : (
        <div
          className="builder-social-embed-grid"
          data-builder-social-count={c.count}
        >
          {Array.from({ length: c.count }, (_, idx) => (
            <div key={idx} data-builder-social-tile={idx + 1}>
              <small>{c.provider}/{idx + 1}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialEmbedInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const seNode = node as BuilderSocialEmbedCanvasNode;
  const c = seNode.content;
  return (
    <>
      <label>
        <span>공급자</span>
        <select
          value={c.provider}
          disabled={disabled}
          onChange={(event) => onUpdate({ provider: event.target.value as BuilderSocialEmbedCanvasNode['content']['provider'] })}
        >
          <option value="instagram-feed">Instagram feed</option>
          <option value="youtube-subscribe">YouTube subscribe</option>
          <option value="linkedin-follow">LinkedIn follow</option>
          <option value="tiktok-feed">TikTok feed</option>
        </select>
      </label>
      <label>
        <span>핸들 / Channel ID</span>
        <input
          type="text"
          value={c.handle}
          disabled={disabled}
          onChange={(event) => onUpdate({ handle: event.target.value })}
        />
      </label>
      <label>
        <span>레이아웃</span>
        <select
          value={c.layout}
          disabled={disabled}
          onChange={(event) => onUpdate({ layout: event.target.value as BuilderSocialEmbedCanvasNode['content']['layout'] })}
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
      </label>
      <label>
        <span>개수</span>
        <input
          type="number"
          min={1}
          max={20}
          value={c.count}
          disabled={disabled}
          onChange={(event) => onUpdate({ count: Number(event.target.value) })}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={c.showHeader}
          disabled={disabled}
          onChange={(event) => onUpdate({ showHeader: event.target.checked })}
        />
        <span>헤더 표시</span>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'social-embed',
  displayName: '소셜 임베드',
  category: 'advanced',
  icon: 'SE',
  defaultContent: {
    provider: 'instagram-feed' as const,
    handle: '@hojeong',
    layout: 'grid' as const,
    count: 6,
    showHeader: true,
  },
  defaultStyle: {},
  defaultRect: { width: 420, height: 360 },
  Render: SocialEmbedRender,
  Inspector: SocialEmbedInspector,
});
