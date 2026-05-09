'use client';

import type { BuilderComponentInspectorProps } from '../define';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import type { BuilderImageCanvasNode } from '@/lib/builder/canvas/types';
import type { LinkValue } from '@/lib/builder/links';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

function hotspotsToText(hotspots: BuilderImageCanvasNode['content']['hotspots']): string {
  return (hotspots ?? [])
    .map((hotspot) => `${hotspot.x}, ${hotspot.y}, ${hotspot.label}${hotspot.href ? `, ${hotspot.href}` : ''}`)
    .join('\n');
}

function parseHotspots(value: string): BuilderImageCanvasNode['content']['hotspots'] | undefined {
  type Hotspot = NonNullable<BuilderImageCanvasNode['content']['hotspots']>[number];
  const hotspots: Hotspot[] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [xValue, yValue, labelValue, hrefValue] = line.split(',').map((part) => part.trim());
    const x = Number(xValue);
    const y = Number(yValue);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !labelValue) continue;
    hotspots.push({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
      label: labelValue.slice(0, 120),
      ...(hrefValue ? { href: hrefValue } : {}),
    });
  }
  return hotspots.length > 0 ? hotspots.slice(0, 12) : undefined;
}

export default function ImageInspector({
  node,
  onUpdate,
  disabled = false,
  onRequestAssetLibrary,
  onRequestImageEditor,
  linkPickerContext,
}: BuilderComponentInspectorProps) {
  const imageNode = node as BuilderImageCanvasNode;
  const compare = imageNode.content.compare;
  const svg = imageNode.content.svg;

  return (
    <>
      <div className={styles.inspectorActionRow}>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || !onRequestAssetLibrary}
          onClick={() => onRequestAssetLibrary?.()}
        >
          Open asset library
        </button>
        <button
          type="button"
          className={styles.actionButton}
          disabled={disabled || !imageNode.content.src}
          onClick={() => onRequestImageEditor?.()}
          style={{ marginLeft: 6 }}
        >
          Crop / Filter / Alt
        </button>
      </div>
      <label>
        <span>Source URL</span>
        <input
          type="text"
          value={imageNode.content.src}
          disabled={disabled}
          placeholder="https://example.com/image.jpg"
          onChange={(event) => onUpdate({ src: event.target.value })}
        />
      </label>
      <label>
        <span>Alt text</span>
        <input
          type="text"
          value={imageNode.content.alt}
          disabled={disabled}
          onChange={(event) => onUpdate({ alt: event.target.value })}
        />
      </label>
      <label>
        <span>Fit</span>
        <select
          value={imageNode.content.fit}
          disabled={disabled}
          onChange={(event) => onUpdate({ fit: event.target.value })}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
        </select>
      </label>
      <label>
        <span>Click action</span>
        <select
          value={imageNode.content.clickAction ?? 'none'}
          disabled={disabled}
          onChange={(event) => onUpdate({ clickAction: event.target.value })}
        >
          <option value="none">None</option>
          <option value="link">Link</option>
          <option value="lightbox">Lightbox</option>
          <option value="popup">Popup</option>
        </select>
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
          Link
        </span>
        <LinkPicker
          value={(imageNode.content.link ?? null) as LinkValue | null}
          onChange={(link) => onUpdate({ link: link ?? undefined })}
          context={linkPickerContext}
          disabled={disabled}
        />
      </div>
      <fieldset className={styles.inspectorFieldset}>
        <legend>Media interactions</legend>
        <label>
          <span>Hover swap image</span>
          <input
            type="text"
            value={imageNode.content.hoverSrc ?? ''}
            disabled={disabled}
            placeholder="/images/hover.jpg"
            onChange={(event) => onUpdate({ hoverSrc: event.target.value || undefined })}
          />
        </label>
        <label>
          <span>Hotspots</span>
          <textarea
            rows={3}
            value={hotspotsToText(imageNode.content.hotspots)}
            disabled={disabled}
            placeholder="42, 55, 상담 예약, /ko/contact"
            onChange={(event) => onUpdate({ hotspots: parseHotspots(event.target.value) })}
          />
        </label>
      </fieldset>
      <fieldset className={styles.inspectorFieldset}>
        <legend>Before / after</legend>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={Boolean(compare?.enabled)}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                compare: event.target.checked
                  ? {
                    enabled: true,
                    beforeSrc: compare?.beforeSrc || imageNode.content.src,
                    afterSrc: compare?.afterSrc || imageNode.content.hoverSrc || imageNode.content.src,
                    position: compare?.position ?? 50,
                  }
                  : undefined,
              })
            }
          />
          <span>Enable compare slider</span>
        </label>
        <label>
          <span>Before image</span>
          <input
            type="text"
            value={compare?.beforeSrc ?? ''}
            disabled={disabled || !compare?.enabled}
            onChange={(event) =>
              onUpdate({ compare: { enabled: true, beforeSrc: event.target.value, afterSrc: compare?.afterSrc || imageNode.content.src, position: compare?.position ?? 50 } })
            }
          />
        </label>
        <label>
          <span>After image</span>
          <input
            type="text"
            value={compare?.afterSrc ?? ''}
            disabled={disabled || !compare?.enabled}
            onChange={(event) =>
              onUpdate({ compare: { enabled: true, beforeSrc: compare?.beforeSrc || imageNode.content.src, afterSrc: event.target.value, position: compare?.position ?? 50 } })
            }
          />
        </label>
        <label>
          <span>Position {compare?.position ?? 50}%</span>
          <input
            type="range"
            min={5}
            max={95}
            value={compare?.position ?? 50}
            disabled={disabled || !compare?.enabled}
            onChange={(event) =>
              onUpdate({ compare: { enabled: true, beforeSrc: compare?.beforeSrc || imageNode.content.src, afterSrc: compare?.afterSrc || imageNode.content.src, position: Number(event.target.value) } })
            }
          />
        </label>
      </fieldset>
      <fieldset className={styles.inspectorFieldset}>
        <legend>SVG / GIF</legend>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={Boolean(svg?.enabled)}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                svg: event.target.checked
                  ? { enabled: true, name: svg?.name ?? 'scales', color: svg?.color ?? { kind: 'token', token: 'primary' } }
                  : undefined,
              })
            }
          />
          <span>Inline SVG icon</span>
        </label>
        <label>
          <span>SVG shape</span>
          <select
            value={svg?.name ?? 'scales'}
            disabled={disabled || !svg?.enabled}
            onChange={(event) => onUpdate({ svg: { enabled: true, name: event.target.value, color: svg?.color ?? { kind: 'token', token: 'primary' } } })}
          >
            <option value="scales">Scales</option>
            <option value="shield">Shield</option>
            <option value="building">Building</option>
            <option value="spark">Spark</option>
          </select>
        </label>
        <label>
          <span>SVG color</span>
          <input
            type="text"
            value={typeof svg?.color === 'string' ? svg.color : ''}
            disabled={disabled || !svg?.enabled}
            placeholder="#116dff or theme token via preset"
            onChange={(event) => onUpdate({ svg: { enabled: true, name: svg?.name ?? 'scales', color: event.target.value || { kind: 'token', token: 'primary' } } })}
          />
        </label>
        <label>
          <span>GIF provider</span>
          <select
            value={imageNode.content.gif?.provider ?? 'manual'}
            disabled={disabled}
            onChange={(event) => onUpdate({ gif: { provider: event.target.value, query: imageNode.content.gif?.query || undefined } })}
          >
            <option value="manual">Manual GIF URL</option>
            <option value="giphy">Giphy search note</option>
          </select>
        </label>
        <label>
          <span>GIF search query</span>
          <input
            type="text"
            value={imageNode.content.gif?.query ?? ''}
            disabled={disabled}
            placeholder="law office"
            onChange={(event) => onUpdate({ gif: { provider: imageNode.content.gif?.provider ?? 'manual', query: event.target.value || undefined } })}
          />
        </label>
      </fieldset>
      {imageNode.content.cropAspect && imageNode.content.cropAspect !== 'Free' && (
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
          Crop: {imageNode.content.cropAspect}
        </div>
      )}
    </>
  );
}
