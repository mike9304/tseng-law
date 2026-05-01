import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderGalleryCanvasNode } from '@/lib/builder/canvas/types';

const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.78rem', color: '#334155' };
const labelStyle: React.CSSProperties = { fontSize: '0.72rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle: React.CSSProperties = { padding: '6px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '0.82rem', color: '#0f172a', outline: 'none' };

export default function GalleryInspector({ node, onUpdate, disabled = false }: BuilderComponentInspectorProps) {
  const galleryNode = node as BuilderGalleryCanvasNode;
  const images = galleryNode.content.images ?? [];

  const updateImage = (index: number, patch: { src?: string; alt?: string }) => {
    const next = [...images];
    next[index] = { ...next[index], ...patch };
    onUpdate({ images: next });
  };

  const addImage = () => onUpdate({ images: [...images, { src: '', alt: '' }] });
  const removeImage = (index: number) => onUpdate({ images: images.filter((_, i) => i !== index) });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={labelStyle}>Images ({images.length})</span>
        {images.map((img, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8, background: '#f8fafc', borderRadius: 8 }}>
            <input type="text" placeholder="이미지 URL" value={img.src} disabled={disabled} style={inputStyle}
              onChange={(e) => updateImage(i, { src: e.target.value })} />
            <input type="text" placeholder="대체 텍스트 (alt)" value={img.alt} disabled={disabled} style={inputStyle}
              onChange={(e) => updateImage(i, { alt: e.target.value })} />
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
