import Image from 'next/image';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderTeamMemberCardCanvasNode } from '@/lib/builder/canvas/types';

function TeamMemberCardRender({
  node,
}: {
  node: BuilderTeamMemberCardCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <article className="builder-datadisplay-team-card" data-builder-datadisplay-widget="team-member-card">
      <div className="builder-datadisplay-team-avatar">
        {c.avatar ? (
          <Image src={c.avatar} alt={c.name} width={120} height={120} style={{ objectFit: 'cover', borderRadius: '50%' }} />
        ) : (
          <span aria-hidden="true">{c.name?.[0] ?? '·'}</span>
        )}
      </div>
      <strong>{c.name}</strong>
      {c.role ? <small>{c.role}</small> : null}
      {c.bio ? <p>{c.bio}</p> : null}
      {c.socialLinks.length > 0 ? (
        <ul>
          {c.socialLinks.map((link, idx) => (
            <li key={`${link.label}-${idx}`}>
              <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function socialToText(links: BuilderTeamMemberCardCanvasNode['content']['socialLinks']): string {
  return links.map((l) => `${l.label} | ${l.href}`).join('\n');
}

function parseSocial(value: string): BuilderTeamMemberCardCanvasNode['content']['socialLinks'] {
  const out: BuilderTeamMemberCardCanvasNode['content']['socialLinks'] = [];
  for (const raw of value.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const [label, href] = line.split('|').map((p) => p.trim());
    if (!label || !href) continue;
    out.push({ label: label.slice(0, 40), href: href.slice(0, 2000) });
  }
  return out.slice(0, 8);
}

function TeamMemberCardInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const tmNode = node as BuilderTeamMemberCardCanvasNode;
  const c = tmNode.content;
  return (
    <>
      <label>
        <span>이름</span>
        <input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} />
      </label>
      <label>
        <span>직책</span>
        <input type="text" value={c.role} disabled={disabled} onChange={(event) => onUpdate({ role: event.target.value })} />
      </label>
      <label>
        <span>소개</span>
        <textarea rows={4} value={c.bio} disabled={disabled} onChange={(event) => onUpdate({ bio: event.target.value })} />
      </label>
      <label>
        <span>아바타 URL</span>
        <input type="text" value={c.avatar} disabled={disabled} onChange={(event) => onUpdate({ avatar: event.target.value })} />
      </label>
      <label>
        <span>소셜 (label | href)</span>
        <textarea
          rows={3}
          style={{ fontFamily: 'inherit' }}
          value={socialToText(c.socialLinks)}
          disabled={disabled}
          onChange={(event) => onUpdate({ socialLinks: parseSocial(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'team-member-card',
  displayName: '팀원 카드',
  category: 'advanced',
  icon: '👤',
  defaultContent: {
    name: '김 변호사',
    role: '대표 변호사 · 한국·대만 자격',
    bio: '국제 기업 자문과 한·대 사이 협상 중재를 전문으로 합니다.',
    avatar: '',
    socialLinks: [
      { label: 'LinkedIn', href: 'https://linkedin.com/' },
    ],
  },
  defaultStyle: {},
  defaultRect: { width: 280, height: 380 },
  Render: TeamMemberCardRender,
  Inspector: TeamMemberCardInspector,
});
