type BasicAuthUserRecord = {
  readonly username: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeUsernameCandidate(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseBasicAuthUserRecord(value: unknown): BasicAuthUserRecord | null {
  if (!isRecord(value)) return null;
  const username = normalizeUsernameCandidate(value.username);
  const password = typeof value.password === 'string' ? value.password : '';
  if (!username || !password) return null;
  return { username };
}

export function getConfiguredBasicAuthUsernames(
  raw = process.env.BUILDER_BASIC_AUTH_USERS,
): readonly string[] {
  if (!raw?.trim()) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    if (error instanceof SyntaxError) return [];
    throw error;
  }
  if (!Array.isArray(parsed)) return [];

  const usernames: string[] = [];
  const seen = new Set<string>();
  for (const entry of parsed) {
    const record = parseBasicAuthUserRecord(entry);
    if (!record) return [];
    const key = record.username.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    usernames.push(record.username);
  }
  return usernames;
}
