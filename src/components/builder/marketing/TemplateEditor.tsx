'use client';

import { useMemo, useState } from 'react';
import type {
  EmailBlock,
  EmailBlockKind,
  EmailTemplate,
} from '@/lib/builder/marketing/templates/types';

interface Props {
  initialTemplate: EmailTemplate;
}

function blockId(): string {
  return `blk_${Math.random().toString(36).slice(2, 9)}`;
}

const BLOCK_LABELS: Record<EmailBlockKind, string> = {
  heading: '제목',
  text: '본문',
  button: '버튼',
  image: '이미지',
  divider: '구분선',
  spacer: '간격',
};

function defaultBlock(kind: EmailBlockKind): EmailBlock {
  switch (kind) {
    case 'heading':
      return { blockId: blockId(), kind: 'heading', text: '제목', level: 2, align: 'left' };
    case 'text':
      return { blockId: blockId(), kind: 'text', text: '본문 내용을 작성하세요.' };
    case 'button':
      return { blockId: blockId(), kind: 'button', label: '클릭', href: 'https://tseng-law.com', background: '#0f172a', textColor: '#ffffff' };
    case 'image':
      return { blockId: blockId(), kind: 'image', src: 'https://tseng-law.com/logo.png', alt: '', width: 320 };
    case 'divider':
      return { blockId: blockId(), kind: 'divider', color: '#e2e8f0' };
    case 'spacer':
      return { blockId: blockId(), kind: 'spacer', height: 24 };
  }
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderBlockHtml(block: EmailBlock): string {
  switch (block.kind) {
    case 'heading': {
      const level = block.level ?? 2;
      const size = level === 1 ? 24 : level === 2 ? 20 : 16;
      return `<h${level} style="margin:0;text-align:${block.align ?? 'left'};font-size:${size}px;color:#0f172a">${esc(block.text)}</h${level}>`;
    }
    case 'text':
      return `<p style="margin:0;line-height:1.6;color:#1f2937">${esc(block.text).replace(/\n/g, '<br />')}</p>`;
    case 'button':
      return `<a href="${esc(block.href)}" style="display:inline-block;background:${esc(block.background ?? '#0f172a')};color:${esc(block.textColor ?? '#fff')};padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:700">${esc(block.label)}</a>`;
    case 'image':
      return `<img src="${esc(block.src)}" alt="${esc(block.alt ?? '')}" style="max-width:100%;width:${block.width ?? 320}px;display:block;border:0" />`;
    case 'divider':
      return `<hr style="border:0;border-top:1px solid ${esc(block.color ?? '#e2e8f0')}" />`;
    case 'spacer':
      return `<div style="height:${block.height}px"></div>`;
  }
}

export default function TemplateEditor({ initialTemplate }: Props) {
  const [template, setTemplate] = useState<EmailTemplate>(initialTemplate);
  const [selectedId, setSelectedId] = useState<string | null>(template.blocks[0]?.blockId ?? null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const selectedBlock = useMemo(
    () => template.blocks.find((b) => b.blockId === selectedId) ?? null,
    [template.blocks, selectedId],
  );

  function updateBlock(id: string, patch: Partial<EmailBlock>) {
    setTemplate((t) => ({
      ...t,
      blocks: t.blocks.map((b) => (b.blockId === id ? ({ ...b, ...patch } as EmailBlock) : b)),
    }));
  }
  function moveBlock(id: string, delta: -1 | 1) {
    setTemplate((t) => {
      const idx = t.blocks.findIndex((b) => b.blockId === id);
      if (idx === -1) return t;
      const next = idx + delta;
      if (next < 0 || next >= t.blocks.length) return t;
      const blocks = [...t.blocks];
      const [moved] = blocks.splice(idx, 1);
      blocks.splice(next, 0, moved);
      return { ...t, blocks };
    });
  }
  function removeBlock(id: string) {
    setTemplate((t) => ({ ...t, blocks: t.blocks.filter((b) => b.blockId !== id) }));
  }
  function addBlock(kind: EmailBlockKind) {
    const newBlock = defaultBlock(kind);
    setTemplate((t) => ({ ...t, blocks: [...t.blocks, newBlock] }));
    setSelectedId(newBlock.blockId);
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/builder/marketing/templates/${template.templateId}`, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          category: template.category,
          blocks: template.blocks,
          pageBackground: template.pageBackground,
          contentBackground: template.contentBackground,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage(`저장 실패: ${payload.error ?? res.statusText}`);
      } else {
        setMessage('저장 완료');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 320px', gap: 16, padding: 24 }}>
      <aside style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>블록 추가</strong>
        {(Object.keys(BLOCK_LABELS) as EmailBlockKind[]).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => addBlock(kind)}
            style={{ padding: '8px 12px', border: '1px dashed #94a3b8', background: '#fff', borderRadius: 6, fontSize: 13, textAlign: 'left', cursor: 'pointer' }}
          >
            + {BLOCK_LABELS[kind]}
          </button>
        ))}
      </aside>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="text"
            value={template.name}
            onChange={(e) => setTemplate((t) => ({ ...t, name: e.target.value }))}
            style={{ flex: 1, fontSize: 16, fontWeight: 700, padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: 6 }}
          />
          <button type="button" disabled={saving} onClick={save} style={{ padding: '8px 14px', border: 0, background: saving ? '#94a3b8' : '#0f172a', color: '#fff', borderRadius: 8, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
        {message ? <div style={{ fontSize: 12, color: message.includes('실패') ? '#dc2626' : '#16a34a' }}>{message}</div> : null}

        <div style={{ padding: 24, background: template.pageBackground, borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 600, margin: '0 auto', background: template.contentBackground, borderRadius: 8 }}>
            {template.blocks.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                좌측에서 블록을 추가하세요.
              </div>
            ) : (
              template.blocks.map((block) => {
                const active = block.blockId === selectedId;
                return (
                  <div
                    key={block.blockId}
                    onClick={() => setSelectedId(block.blockId)}
                    style={{
                      padding: 12,
                      borderTop: '1px solid transparent',
                      borderBottom: '1px solid transparent',
                      outline: active ? '2px solid #1d4ed8' : 'none',
                      outlineOffset: -2,
                      cursor: 'pointer',
                    }}
                    dangerouslySetInnerHTML={{ __html: renderBlockHtml(block) }}
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase' }}>속성</strong>
        {selectedBlock ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <small style={{ color: '#64748b' }}>{BLOCK_LABELS[selectedBlock.kind]}</small>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                <button type="button" onClick={() => moveBlock(selectedBlock.blockId, -1)} style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, cursor: 'pointer' }}>↑</button>
                <button type="button" onClick={() => moveBlock(selectedBlock.blockId, 1)} style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 4, cursor: 'pointer' }}>↓</button>
                <button type="button" onClick={() => removeBlock(selectedBlock.blockId)} style={{ fontSize: 11, padding: '2px 6px', border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', borderRadius: 4, cursor: 'pointer' }}>×</button>
              </div>
            </div>

            {selectedBlock.kind === 'heading' || selectedBlock.kind === 'text' ? (
              <textarea
                rows={4}
                value={selectedBlock.kind === 'heading' ? selectedBlock.text : selectedBlock.text}
                onChange={(e) => updateBlock(selectedBlock.blockId, { text: e.target.value } as Partial<EmailBlock>)}
                style={{ padding: 8, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12, resize: 'vertical' }}
              />
            ) : null}
            {selectedBlock.kind === 'button' ? (
              <>
                <input type="text" placeholder="라벨" value={selectedBlock.label} onChange={(e) => updateBlock(selectedBlock.blockId, { label: e.target.value } as Partial<EmailBlock>)} style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }} />
                <input type="url" placeholder="href" value={selectedBlock.href} onChange={(e) => updateBlock(selectedBlock.blockId, { href: e.target.value } as Partial<EmailBlock>)} style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }} />
                <input type="color" value={selectedBlock.background ?? '#0f172a'} onChange={(e) => updateBlock(selectedBlock.blockId, { background: e.target.value } as Partial<EmailBlock>)} />
              </>
            ) : null}
            {selectedBlock.kind === 'image' ? (
              <>
                <input type="url" placeholder="src" value={selectedBlock.src} onChange={(e) => updateBlock(selectedBlock.blockId, { src: e.target.value } as Partial<EmailBlock>)} style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }} />
                <input type="text" placeholder="alt" value={selectedBlock.alt ?? ''} onChange={(e) => updateBlock(selectedBlock.blockId, { alt: e.target.value } as Partial<EmailBlock>)} style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }} />
                <input type="number" min={40} max={800} value={selectedBlock.width ?? 320} onChange={(e) => updateBlock(selectedBlock.blockId, { width: Number(e.target.value) } as Partial<EmailBlock>)} style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }} />
              </>
            ) : null}
            {selectedBlock.kind === 'spacer' ? (
              <input type="number" min={4} max={120} value={selectedBlock.height} onChange={(e) => updateBlock(selectedBlock.blockId, { height: Number(e.target.value) } as Partial<EmailBlock>)} style={{ padding: 6, border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 12 }} />
            ) : null}
            {selectedBlock.kind === 'divider' ? (
              <input type="color" value={selectedBlock.color ?? '#e2e8f0'} onChange={(e) => updateBlock(selectedBlock.blockId, { color: e.target.value } as Partial<EmailBlock>)} />
            ) : null}
          </div>
        ) : (
          <div style={{ padding: 16, color: '#94a3b8', fontSize: 12, border: '1px dashed #cbd5e1', borderRadius: 8 }}>
            블록을 선택하면 속성이 나옵니다.
          </div>
        )}

        <strong style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginTop: 12 }}>색상</strong>
        <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
          페이지 배경
          <input type="color" value={template.pageBackground} onChange={(e) => setTemplate((t) => ({ ...t, pageBackground: e.target.value }))} />
        </label>
        <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
          컨텐츠 배경
          <input type="color" value={template.contentBackground} onChange={(e) => setTemplate((t) => ({ ...t, contentBackground: e.target.value }))} />
        </label>
      </aside>
    </div>
  );
}
