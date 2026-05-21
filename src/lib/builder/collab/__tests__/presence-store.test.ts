import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  __resetPresenceStoreForTests,
  colorForUsername,
  heartbeat,
  listActive,
  prune,
  PRESENCE_TTL_MS,
} from '@/lib/builder/collab/presence-store';

describe('presence-store', () => {
  beforeEach(() => {
    __resetPresenceStoreForTests();
  });
  afterEach(() => {
    __resetPresenceStoreForTests();
  });

  it('records a heartbeat and lists active sessions distinctly', () => {
    const now = 1_000_000;
    heartbeat('default', 'home', 'sess-a', { username: 'alice' }, now);
    heartbeat('default', 'home', 'sess-b', { username: 'bob', nodeId: 'node-1' }, now + 100);

    const active = listActive('default', 'home', now + 200);
    expect(active).toHaveLength(2);
    const byUsername = Object.fromEntries(active.map((e) => [e.username, e]));
    expect(byUsername.alice).toBeDefined();
    expect(byUsername.bob.nodeId).toBe('node-1');
    expect(byUsername.alice.color).toMatch(/^hsl\(/);
    expect(byUsername.alice.color).toBe(colorForUsername('alice'));
  });

  it('refreshes lastSeenAt on repeated heartbeats from same session', () => {
    heartbeat('default', 'home', 'sess-a', { username: 'alice' }, 1_000);
    heartbeat('default', 'home', 'sess-a', { username: 'alice', nodeId: 'n-9' }, 2_000);

    const active = listActive('default', 'home', 2_500);
    expect(active).toHaveLength(1);
    expect(active[0].lastSeenAt).toBe(2_000);
    expect(active[0].nodeId).toBe('n-9');
  });

  it('prunes entries past TTL when listing or pruning', () => {
    const t0 = 5_000;
    heartbeat('default', 'home', 'sess-old', { username: 'old' }, t0);
    heartbeat('default', 'home', 'sess-fresh', { username: 'fresh' }, t0 + PRESENCE_TTL_MS - 1);

    const later = t0 + PRESENCE_TTL_MS + 10;
    const active = listActive('default', 'home', later);
    expect(active.map((e) => e.username)).toEqual(['fresh']);

    prune(later + PRESENCE_TTL_MS + 10);
    expect(listActive('default', 'home', later + PRESENCE_TTL_MS + 10)).toEqual([]);
  });

  it('isolates rooms by (siteId, pageId)', () => {
    heartbeat('site-a', 'home', 'sess-1', { username: 'alice' }, 1_000);
    heartbeat('site-a', 'about', 'sess-2', { username: 'alice' }, 1_000);
    heartbeat('site-b', 'home', 'sess-3', { username: 'alice' }, 1_000);

    expect(listActive('site-a', 'home', 1_100)).toHaveLength(1);
    expect(listActive('site-a', 'about', 1_100)).toHaveLength(1);
    expect(listActive('site-b', 'home', 1_100)).toHaveLength(1);
    expect(listActive('site-c', 'home', 1_100)).toEqual([]);
  });
});