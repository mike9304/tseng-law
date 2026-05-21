'use client';

import { useMemo, useState } from 'react';
import type {
  BuilderRoleName,
  BuilderUserRoleRecord,
} from '@/lib/builder/security/user-role-store';
import type { BuilderPermission } from '@/lib/builder/security/permissions';
import type { Locale } from '@/lib/locales';

interface UsersAdminProps {
  locale: Locale;
  initialUsers: BuilderUserRoleRecord[];
  roles: BuilderRoleName[];
  permissions: BuilderPermission[];
  matrix: Record<BuilderRoleName, readonly BuilderPermission[]>;
  actorRole: BuilderRoleName;
}

const containerStyle: React.CSSProperties = {
  padding: 24,
  maxWidth: 980,
  margin: '0 auto',
  fontFamily: 'system-ui, sans-serif',
};

const sectionStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 18,
  marginBottom: 16,
};

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

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
};

const cellStyle: React.CSSProperties = {
  borderBottom: '1px solid #f1f5f9',
  padding: '8px 10px',
  verticalAlign: 'middle',
};

export default function UsersAdmin({
  initialUsers,
  roles,
  permissions,
  matrix,
  actorRole,
}: UsersAdminProps) {
  const [users, setUsers] = useState<BuilderUserRoleRecord[]>(initialUsers);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<BuilderRoleName>('editor');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canManage = actorRole === 'owner' || actorRole === 'admin';
  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => a.addedAt.localeCompare(b.addedAt)),
    [users],
  );

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!username.trim()) return;
    setError(null);
    setBusy('add');
    try {
      const res = await fetch('/api/builder/security/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), role }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? 'Failed to add user.');
      setUsers((prev) => {
        const next = prev.filter((u) => u.username.toLowerCase() !== payload.user.username.toLowerCase());
        next.push(payload.user);
        return next;
      });
      setUsername('');
      setRole('editor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user.');
    } finally {
      setBusy(null);
    }
  }

  async function handleRoleChange(target: BuilderUserRoleRecord, nextRole: BuilderRoleName) {
    if (target.role === nextRole) return;
    setError(null);
    setBusy(`role-${target.username}`);
    try {
      const res = await fetch(
        `/api/builder/security/users/${encodeURIComponent(target.username)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: nextRole }),
        },
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? 'Failed to update role.');
      setUsers((prev) =>
        prev.map((u) => (u.username === target.username ? payload.user : u)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role.');
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove(target: BuilderUserRoleRecord) {
    if (!confirm(`Remove ${target.username}?`)) return;
    setError(null);
    setBusy(`remove-${target.username}`);
    try {
      const res = await fetch(
        `/api/builder/security/users/${encodeURIComponent(target.username)}`,
        { method: 'DELETE' },
      );
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload?.ok) throw new Error(payload?.error ?? 'Failed to remove user.');
      setUsers((prev) => prev.filter((u) => u.username !== target.username));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove user.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ marginTop: 0 }}>Users & Roles</h1>
      <p style={{ color: '#475569', fontSize: 13 }}>
        Per-user RBAC overlay on top of basic-auth. Acting role: <strong>{actorRole}</strong>.
      </p>

      {error && (
        <div style={{ ...sectionStyle, borderColor: '#fecaca', color: '#b91c1c' }}>{error}</div>
      )}

      {canManage && (
        <section style={sectionStyle}>
          <h2 style={{ marginTop: 0, fontSize: 15 }}>Add user</h2>
          <form
            onSubmit={handleAdd}
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}
          >
            <input
              style={inputStyle}
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <select
              style={{ ...inputStyle, maxWidth: 140 }}
              value={role}
              onChange={(e) => setRole(e.target.value as BuilderRoleName)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button type="submit" disabled={busy !== null} style={buttonStyle}>
              {busy === 'add' ? 'Adding...' : 'Add'}
            </button>
          </form>
        </section>
      )}

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: 15 }}>Members ({sortedUsers.length})</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#64748b' }}>
              <th style={cellStyle}>Username</th>
              <th style={cellStyle}>Role</th>
              <th style={cellStyle}>Added</th>
              <th style={cellStyle}>Last seen</th>
              <th style={cellStyle}></th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.username}>
                <td style={cellStyle}>{user.username}</td>
                <td style={cellStyle}>
                  {canManage ? (
                    <select
                      style={{ ...inputStyle, maxWidth: 140 }}
                      value={user.role}
                      disabled={busy !== null}
                      onChange={(e) =>
                        handleRoleChange(user, e.target.value as BuilderRoleName)
                      }
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td style={cellStyle}>{user.addedAt.slice(0, 10)}</td>
                <td style={cellStyle}>{user.lastSeenAt?.slice(0, 10) ?? '-'}</td>
                <td style={cellStyle}>
                  {canManage && user.role !== 'owner' && (
                    <button
                      type="button"
                      style={dangerButtonStyle}
                      disabled={busy !== null}
                      onClick={() => handleRemove(user)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: 15 }}>Permission matrix</h2>
        <table style={tableStyle}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#64748b' }}>
              <th style={cellStyle}>Permission</th>
              {roles.map((r) => (
                <th key={r} style={cellStyle}>{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm) => (
              <tr key={perm}>
                <td style={cellStyle}>{perm}</td>
                {roles.map((r) => (
                  <td key={r} style={cellStyle}>
                    {matrix[r].includes(perm) ? 'yes' : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}