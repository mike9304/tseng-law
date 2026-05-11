/**
 * PR #12 — Minimal Vercel REST API client.
 *
 * Only the endpoints needed for the custom-domain attach/detach flow are
 * implemented. Auth uses the `VERCEL_TOKEN` env var and operates on the
 * project identified by `VERCEL_PROJECT_ID`. Team accounts may also set
 * `VERCEL_TEAM_ID`; when present every request appends `?teamId=…`.
 */

const API_BASE = 'https://api.vercel.com';

interface ClientConfig {
  token: string;
  projectId: string;
  teamId?: string;
}

export type VercelClientStatus =
  | { ok: true; config: ClientConfig }
  | { ok: false; reason: 'unconfigured'; missing: string[] };

export function getVercelClient(): VercelClientStatus {
  const token = process.env.VERCEL_TOKEN ?? '';
  const projectId = process.env.VERCEL_PROJECT_ID ?? '';
  const teamId = process.env.VERCEL_TEAM_ID;
  const missing: string[] = [];
  if (!token) missing.push('VERCEL_TOKEN');
  if (!projectId) missing.push('VERCEL_PROJECT_ID');
  if (missing.length > 0) return { ok: false, reason: 'unconfigured', missing };
  return { ok: true, config: { token, projectId, teamId } };
}

function withTeam(url: string, teamId?: string): string {
  if (!teamId) return url;
  return `${url}${url.includes('?') ? '&' : '?'}teamId=${encodeURIComponent(teamId)}`;
}

async function callVercel<T>(config: ClientConfig, init: { path: string; method: 'GET' | 'POST' | 'DELETE'; body?: unknown }): Promise<{ ok: boolean; status: number; data?: T; error?: string }> {
  const url = withTeam(`${API_BASE}${init.path}`, config.teamId);
  try {
    const res = await fetch(url, {
      method: init.method,
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
    const text = await res.text();
    let data: T | undefined;
    try {
      data = text ? (JSON.parse(text) as T) : undefined;
    } catch {
      data = undefined;
    }
    return { ok: res.ok, status: res.status, data, error: res.ok ? undefined : text.slice(0, 200) };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}

export interface VercelDomainPayload {
  name: string;
  apexName?: string;
  verified?: boolean;
  createdAt?: number;
}

export async function attachDomain(name: string): Promise<{ ok: boolean; data?: VercelDomainPayload; error?: string }> {
  const client = getVercelClient();
  if (!client.ok) return { ok: false, error: `vercel client unconfigured: ${client.missing.join(', ')}` };
  const res = await callVercel<VercelDomainPayload>(client.config, {
    path: `/v10/projects/${client.config.projectId}/domains`,
    method: 'POST',
    body: { name },
  });
  return { ok: res.ok, data: res.data, error: res.error };
}

export async function detachDomain(name: string): Promise<{ ok: boolean; error?: string }> {
  const client = getVercelClient();
  if (!client.ok) return { ok: false, error: `vercel client unconfigured: ${client.missing.join(', ')}` };
  const res = await callVercel(client.config, {
    path: `/v9/projects/${client.config.projectId}/domains/${encodeURIComponent(name)}`,
    method: 'DELETE',
  });
  return { ok: res.ok, error: res.error };
}

export async function getDomainStatus(name: string): Promise<{ ok: boolean; data?: VercelDomainPayload; error?: string }> {
  const client = getVercelClient();
  if (!client.ok) return { ok: false, error: `vercel client unconfigured: ${client.missing.join(', ')}` };
  const res = await callVercel<VercelDomainPayload>(client.config, {
    path: `/v9/projects/${client.config.projectId}/domains/${encodeURIComponent(name)}`,
    method: 'GET',
  });
  return { ok: res.ok, data: res.data, error: res.error };
}
