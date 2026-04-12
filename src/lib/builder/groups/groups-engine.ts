/**
 * Phase 17 — Groups & Community Module.
 *
 * GRP-01: Group model (name, description, privacy, category)
 * GRP-02: Group membership (join/leave/admin)
 * GRP-03: Discussion (simple post model with replies)
 * GRP-04: Law firm use cases: "고객 커뮤니티", "세미나 참가자 그룹"
 */

import type { Locale } from '@/lib/locales';
import { get, put, list } from '@vercel/blob';

// ─── Group Model ─────────────────────────────────────────────────

export type GroupPrivacy = 'public' | 'private' | 'secret';

export type GroupMemberRole = 'admin' | 'moderator' | 'member';

export interface Group {
  groupId: string;
  name: string;
  description: string;
  memberCount: number;
  privacy: GroupPrivacy;
  category: string;
  imageUrl?: string;
  locale: Locale;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  memberId: string;
  groupId: string;
  userId: string;
  name: string;
  email: string;
  role: GroupMemberRole;
  joinedAt: string;
}

// ─── Discussion Model ────────────────────────────────────────────

export interface GroupPost {
  postId: string;
  groupId: string;
  title: string;
  body: string;
  author: string;
  authorEmail: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
}

export interface GroupReply {
  replyId: string;
  postId: string;
  groupId: string;
  body: string;
  author: string;
  authorEmail: string;
  createdAt: string;
}

// ─── Blob Prefixes ───────────────────────────────────────────────

const GROUPS_PREFIX = 'builder-groups/groups/';
const MEMBERS_PREFIX = 'builder-groups/members/';
const POSTS_PREFIX = 'builder-groups/posts/';
const REPLIES_PREFIX = 'builder-groups/replies/';

// ─── Group CRUD ──────────────────────────────────────────────────

export async function saveGroup(group: Group): Promise<void> {
  await put(`${GROUPS_PREFIX}${group.groupId}.json`, JSON.stringify(group), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

export async function loadGroup(groupId: string): Promise<Group | null> {
  try {
    const result = await get(`${GROUPS_PREFIX}${groupId}.json`, { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return JSON.parse(await new Response(result.stream).text()) as Group;
    }
  } catch { /* empty */ }
  return null;
}

export async function listGroups(): Promise<Group[]> {
  try {
    const result = await list({ prefix: GROUPS_PREFIX });
    const groups: Group[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          groups.push(JSON.parse(await new Response(res.stream).text()) as Group);
        }
      } catch { /* skip */ }
    }
    return groups;
  } catch { return []; }
}

export async function deleteGroup(groupId: string): Promise<void> {
  await put(`${GROUPS_PREFIX}${groupId}.json`, JSON.stringify({ deleted: true }), {
    access: 'private', allowOverwrite: true, contentType: 'application/json',
  });
}

// ─── Membership CRUD ─────────────────────────────────────────────

export async function joinGroup(
  groupId: string,
  data: { userId: string; name: string; email: string; role?: GroupMemberRole },
): Promise<GroupMember> {
  const group = await loadGroup(groupId);
  if (!group) throw new Error('그룹을 찾을 수 없습니다.');

  const member: GroupMember = {
    memberId: `gm-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    groupId,
    userId: data.userId,
    name: data.name,
    email: data.email.toLowerCase().trim(),
    role: data.role || 'member',
    joinedAt: new Date().toISOString(),
  };

  await put(
    `${MEMBERS_PREFIX}${groupId}/${member.memberId}.json`,
    JSON.stringify(member),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );

  // Update count
  group.memberCount += 1;
  group.updatedAt = new Date().toISOString();
  await saveGroup(group);

  return member;
}

export async function leaveGroup(groupId: string, memberId: string): Promise<void> {
  await put(
    `${MEMBERS_PREFIX}${groupId}/${memberId}.json`,
    JSON.stringify({ deleted: true }),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );

  const group = await loadGroup(groupId);
  if (group && group.memberCount > 0) {
    group.memberCount -= 1;
    group.updatedAt = new Date().toISOString();
    await saveGroup(group);
  }
}

export async function listGroupMembers(groupId: string): Promise<GroupMember[]> {
  try {
    const result = await list({ prefix: `${MEMBERS_PREFIX}${groupId}/` });
    const members: GroupMember[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          const parsed = JSON.parse(await new Response(res.stream).text());
          if (parsed.memberId) members.push(parsed as GroupMember);
        }
      } catch { /* skip */ }
    }
    return members;
  } catch { return []; }
}

export async function updateMemberRole(
  groupId: string,
  memberId: string,
  role: GroupMemberRole,
): Promise<void> {
  const members = await listGroupMembers(groupId);
  const member = members.find((m) => m.memberId === memberId);
  if (!member) throw new Error('멤버를 찾을 수 없습니다.');

  member.role = role;
  await put(
    `${MEMBERS_PREFIX}${groupId}/${memberId}.json`,
    JSON.stringify(member),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );
}

// ─── Discussion CRUD ─────────────────────────────────────────────

export async function createPost(
  groupId: string,
  data: { title: string; body: string; author: string; authorEmail: string },
): Promise<GroupPost> {
  const post: GroupPost = {
    postId: `post-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    groupId,
    title: data.title,
    body: data.body,
    author: data.author,
    authorEmail: data.authorEmail,
    pinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replyCount: 0,
  };

  await put(
    `${POSTS_PREFIX}${groupId}/${post.postId}.json`,
    JSON.stringify(post),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );

  return post;
}

export async function listPosts(groupId: string): Promise<GroupPost[]> {
  try {
    const result = await list({ prefix: `${POSTS_PREFIX}${groupId}/` });
    const posts: GroupPost[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          const parsed = JSON.parse(await new Response(res.stream).text());
          if (parsed.postId) posts.push(parsed as GroupPost);
        }
      } catch { /* skip */ }
    }
    return posts;
  } catch { return []; }
}

export async function addReplyToPost(
  groupId: string,
  postId: string,
  data: { body: string; author: string; authorEmail: string },
): Promise<GroupReply> {
  const reply: GroupReply = {
    replyId: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    postId,
    groupId,
    body: data.body,
    author: data.author,
    authorEmail: data.authorEmail,
    createdAt: new Date().toISOString(),
  };

  await put(
    `${REPLIES_PREFIX}${groupId}/${postId}/${reply.replyId}.json`,
    JSON.stringify(reply),
    { access: 'private', allowOverwrite: true, contentType: 'application/json' },
  );

  // Update reply count on the post
  try {
    const res = await get(`${POSTS_PREFIX}${groupId}/${postId}.json`, { access: 'private', useCache: false });
    if (res?.statusCode === 200 && res.stream) {
      const post = JSON.parse(await new Response(res.stream).text()) as GroupPost;
      post.replyCount += 1;
      post.updatedAt = new Date().toISOString();
      await put(
        `${POSTS_PREFIX}${groupId}/${postId}.json`,
        JSON.stringify(post),
        { access: 'private', allowOverwrite: true, contentType: 'application/json' },
      );
    }
  } catch { /* skip */ }

  return reply;
}

export async function listReplies(groupId: string, postId: string): Promise<GroupReply[]> {
  try {
    const result = await list({ prefix: `${REPLIES_PREFIX}${groupId}/${postId}/` });
    const replies: GroupReply[] = [];
    for (const blob of result.blobs) {
      try {
        const res = await get(blob.pathname, { access: 'private', useCache: false });
        if (res?.statusCode === 200 && res.stream) {
          replies.push(JSON.parse(await new Response(res.stream).text()) as GroupReply);
        }
      } catch { /* skip */ }
    }
    return replies.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } catch { return []; }
}

// ─── Sorting / Filtering ────────────────────────────────────────

export function filterGroupsByPrivacy(groups: Group[], privacy: GroupPrivacy): Group[] {
  return groups.filter((g) => g.privacy === privacy);
}

export function filterGroupsByCategory(groups: Group[], category: string): Group[] {
  return groups.filter((g) => g.category === category);
}

export function sortGroupsByMemberCount(groups: Group[], direction: 'asc' | 'desc' = 'desc'): Group[] {
  return [...groups].sort((a, b) => direction === 'desc' ? b.memberCount - a.memberCount : a.memberCount - b.memberCount);
}

export function sortPostsByDate(posts: GroupPost[], pinFirst = true): GroupPost[] {
  const sorted = [...posts];
  return sorted.sort((a, b) => {
    if (pinFirst) {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
}

// ─── Validation ──────────────────────────────────────────────────

export function validateGroup(group: Partial<Group>): string[] {
  const errors: string[] = [];
  if (!group.name?.trim()) errors.push('그룹 이름을 입력하세요.');
  if (!group.description?.trim()) errors.push('그룹 설명을 입력하세요.');
  if (!group.privacy) errors.push('공개 설정을 선택하세요.');
  return errors;
}

export function validatePost(post: Partial<GroupPost>): string[] {
  const errors: string[] = [];
  if (!post.title?.trim()) errors.push('제목을 입력하세요.');
  if (!post.body?.trim()) errors.push('내용을 입력하세요.');
  if (!post.author?.trim()) errors.push('작성자를 입력하세요.');
  return errors;
}

// ─── Default law-firm groups ─────────────────────────────────────

export const DEFAULT_GROUP_CATEGORIES: Array<{ id: string; name: Record<Locale, string> }> = [
  { id: 'client-community', name: { ko: '고객 커뮤니티', 'zh-hant': '客戶社群', en: 'Client Community' } },
  { id: 'seminar-group', name: { ko: '세미나 참가자 그룹', 'zh-hant': '研討會參加者群組', en: 'Seminar Attendees' } },
  { id: 'case-discussion', name: { ko: '사례 토론', 'zh-hant': '案例討論', en: 'Case Discussion' } },
  { id: 'legal-updates', name: { ko: '법률 동향', 'zh-hant': '法律動態', en: 'Legal Updates' } },
];
