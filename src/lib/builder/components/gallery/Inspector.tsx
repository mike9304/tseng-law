import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderGalleryCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };
const rowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 };

function parseTags(value: string): string[] | undefined {
  const tags = value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
  return tags.length ? tags : undefined;
}

function formatTags(tags: string[] | undefined): string {
  return (tags ?? []).join(', ');
}

export default function GalleryInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const galleryNode = node as BuilderGalleryCanvasNode;
  const images = galleryNode.content.images ?? [];

  const updateImage = (
    index: number,
    patch: { src?: string; alt?: string; caption?: string; tags?: string[] },
  ) => {
    const next = [...images];
    next[index] = { ...next[index], ...patch };
    onUpdate({ images: next });
  };

  const addImage = () => onUpdate({ images: [...images, { src: '', alt: '', caption: '', tags: [] }] });
  const removeImage = (index: number) => onUpdate({ images: images.filter((_, i) => i !== index) });
  const availableTags = Array.from(new Set(images.flatMap((image) => image.tags ?? []))).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={fieldStyle}>
        <span style={labelStyle}>Layout</span>
        <select
          value={galleryNode.content.layout}
          disabled={disabled}
          style={inputStyle}
          onChange={(event) => onUpdate({ layout: event.target.value })}
        >
          <option value="grid">Grid</option>
          <option value="masonry">Masonry</option>
          <option value="slider">Slider</option>
          <option value="slideshow">Slideshow</option>
          <option value="thumbnail">Thumbnail</option>
          <option value="pro">Pro gallery</option>
        </select>
      </label>
      <div style={rowStyle}>
        <label style={fieldStyle}>
          <span style={labelStyle}>Columns ({galleryNode.content.columns})</span>
          <input type="range" min={1} max={6} step={1} value={galleryNode.content.columns} disabled={disabled}
            onChange={(e) => onUpdate({ columns: Number(e.target.value) })} />
        </label>
        <label style={fieldStyle}>
          <span style={labelStyle}>Gap ({galleryNode.content.gap}px)</span>
          <input type="range" min={0} max={64} step={2} value={galleryNode.content.gap} disabled={disabled}
            onChange={(e) => onUpdate({ gap: Number(e.target.value) })} />
        </label>
      </div>
      <div style={rowStyle}>
        <label style={fieldStyle}>
          <span style={labelStyle}>Caption mode</span>
          <select
            value={galleryNode.content.captionMode}
            disabled={disabled || !galleryNode.content.showCaptions}
            style={inputStyle}
            onChange={(event) => onUpdate({ captionMode: event.target.value })}
          >
            <option value="below">Below</option>
            <option value="overlay">Overlay</option>
          </select>
        </label>
        <label style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', paddingTop: 18 }}>
          <input
            type="checkbox"
            checked={galleryNode.content.showCaptions}
            disabled={disabled}
            onChange={(event) => onUpdate({ showCaptions: event.target.checked })}
          />
          <span>Show captions</span>
        </label>
      </div>
      <div style={rowStyle}>
        <label style={fieldStyle}>
          <span style={labelStyle}>Filter</span>
          <select
            value={galleryNode.content.activeFilter}
            disabled={disabled}
            style={inputStyle}
            onChange={(event) => onUpdate({ activeFilter: event.target.value })}
          >
            <option value="all">All</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </label>
        <label style={fieldStyle}>
          <span style={labelStyle}>Pro style</span>
          <select
            value={galleryNode.content.proStyle}
            disabled={disabled || galleryNode.content.layout !== 'pro'}
            style={inputStyle}
            onChange={(event) => onUpdate({ proStyle: event.target.value })}
          >
            <option value="clean">Clean</option>
            <option value="mosaic">Mosaic</option>
            <option value="editorial">Editorial</option>
          </select>
        </label>
      </div>
      <div style={rowStyle}>
        <label style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={galleryNode.content.autoplay}
            disabled={disabled || (galleryNode.content.layout !== 'slider' && galleryNode.content.layout !== 'slideshow')}
            onChange={(event) => onUpdate({ autoplay: event.target.checked })}
          />
          <span>Autoplay</span>
        </label>
        <label style={fieldStyle}>
          <span style={labelStyle}>Interval</span>
          <input
            type="number"
            min={1200}
            max={12000}
            step={200}
            value={galleryNode.content.interval}
            disabled={disabled || !galleryNode.content.autoplay}
            style={inputStyle}
            onChange={(event) => onUpdate({ interval: Number(event.target.value) })}
          />
        </label>
      </div>
      <label style={fieldStyle}>
        <span style={labelStyle}>Thumbnail position</span>
        <select
          value={galleryNode.content.thumbnailPosition}
          disabled={disabled || galleryNode.content.layout !== 'thumbnail'}
          style={inputStyle}
          onChange={(event) => onUpdate({ thumbnailPosition: event.target.value })}
        >
          <option value="bottom">Bottom</option>
          <option value="right">Right</option>
        </select>
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={labelStyle}>Images ({images.length})</span>
        {images.map((img, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8, background: '#f8fafc', borderRadius: 8 }}>
            <input type="text" placeholder="이미지 URL" value={img.src} disabled={disabled} style={inputStyle}
              onChange={(e) => updateImage(i, { src: e.target.value })} />
            <input type="text" placeholder="대체 텍스트 (alt)" value={img.alt} disabled={disabled} style={inputStyle}
              onChange={(e) => updateImage(i, { alt: e.target.value })} />
            <input type="text" placeholder="캡션" value={img.caption ?? ''} disabled={disabled} style={inputStyle}
              onChange={(e) => updateImage(i, { caption: e.target.value })} />
            <input type="text" placeholder="태그: office, service" value={formatTags(img.tags)} disabled={disabled} style={inputStyle}
              onChange={(e) => updateImage(i, { tags: parseTags(e.target.value) })} />
            <button type="button" disabled={disabled} onClick={() => removeImage(i)}
              style={{ alignSelf: 'flex-end', padding: '4px 10px', fontSize: '0.72rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
              제거
            </button>
          </div>
        ))}
        <button type="button" disabled={disabled} onClick={addImage}
          style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          + 이미지 추가
        </button>
      </div>
    </div>
  );
}
