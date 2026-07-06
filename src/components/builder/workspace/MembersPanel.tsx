'use client';

import { useState } from 'react';
import {
  BUILDER_WORKSPACE_ROLES,
  type BuilderWorkspaceMember,
  type BuilderWorkspaceRole,
} from '@/lib/builder/workspace/account-model';
import type { WorkspaceCopy } from '@/lib/builder/workspace/workspace-copy';

interface MembersPanelProps {
  locale: string;
  copy: WorkspaceCopy['members'];
  initialMembers: BuilderWorkspaceMember[];
}

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid #cbd5f5',
  fontSize: 13,
  flex: 1,
  minWidth: 200,
};

const buttonStyle: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 6,
  background: '#0f172a',
  color: '#fff',
  border: 'none',
  fontSize: 13,
  cursor: 'pointer',
};

const dangerButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  background: '#fff',
  color: '#b91c1c',
  border: '1px solid #fecaca',
};

export default function MembersPanel({ locale, copy, initialMembers }: MembersPanelProps) {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<BuilderWorkspaceRole>('viewer');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setError(null);
    setBusy('add');
    try {
      const res = await fetch(`/api/builder/workspace/members?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role, locale }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? copy.errors.add);
      setMembers((prev) => {
        if (prev.some((m) => m.email === payload.member.email)) return prev;
        return [...prev, payload.member];
      });
      setEmail('');
      setRole('viewer');
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.add);
    } finally {
      setBusy(null);
    }
  }

  async function handleRoleChange(target: BuilderWorkspaceMember, nextRole: BuilderWorkspaceRole) {
    if (target.role === nextRole) return;
    setError(null);
    setBusy(`role-${target.email}`);
    try {
      const res = await fetch(`/api/builder/workspace/members/${encodeURIComponent(target.email)}?locale=${locale}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole, locale }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? copy.errors.updateRole);
      setMembers((prev) =>
        prev.map((member) => (member.email === target.email ? payload.member : member)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.updateRole);
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove(target: BuilderWorkspaceMember) {
    setError(null);
    setBusy(`remove-${target.email}`);
    try {
      const res = await fetch(`/api/builder/workspace/members/${encodeURIComponent(target.email)}?locale=${locale}`, {
        method: 'DELETE',
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? copy.errors.remove);
      setMembers((prev) => prev.filter((member) => member.email !== target.email));
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.remove);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div data-members-panel style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <form
        onSubmit={handleAdd}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          padding: 16,
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.emailPlaceholder}
          style={inputStyle}
          aria-label={copy.emailLabel}
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as BuilderWorkspaceRole)}
          style={{ ...inputStyle, flex: '0 0 auto', minWidth: 120 }}
          aria-label={copy.roleLabel}
        >
          {BUILDER_WORKSPACE_ROLES.map((option) => (
            <option key={option} value={option}>{copy.role[option]}</option>
          ))}
        </select>
        <button type="submit" style={buttonStyle} disabled={busy === 'add'} data-members-add>
          {busy === 'add' ? copy.adding : copy.invite}
        </button>
      </form>
      {error ? (
        <p role="alert" style={{ color: '#b91c1c', fontSize: 13 }} data-members-error>{error}</p>
      ) : null}

      <ul
        data-members-list
        style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        {members.map((member) => (
          <li
            key={member.email}
            data-member-email={member.email}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 16px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong style={{ fontSize: 14, color: '#0f172a' }}>{member.email}</strong>
              <span style={{ fontSize: 12, color: '#64748b' }}>
                {copy.addedPrefix} {new Intl.DateTimeFormat(locale).format(new Date(member.addedAt))}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <select
                value={member.role}
                onChange={(event) =>
                  handleRoleChange(member, event.target.value as BuilderWorkspaceRole)
                }
                disabled={busy === `role-${member.email}`}
                data-member-role-select={member.email}
                aria-label={`${copy.roleLabel} ${member.email}`}
                style={{
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5f5',
                  fontSize: 12,
                }}
              >
                {BUILDER_WORKSPACE_ROLES.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button
                type="button"
                style={dangerButtonStyle}
                disabled={busy === `remove-${member.email}`}
                onClick={() => handleRemove(member)}
                data-member-remove={member.email}
              >
                {busy === `remove-${member.email}` ? '…' : copy.remove}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
