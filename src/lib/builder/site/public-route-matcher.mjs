/**
 * Locale-independent file-route ownership.
 *
 * Patterns are a sequence of single-segment literals/params plus at most one
 * terminal catch-all. On any path two patterns both consume entirely, walk
 * tokens left to right: literal > param > catchAll > optionalCatchAll. The
 * first difference has a unique winner. If the longer pattern matches only by
 * an empty optionalCatchAll suffix, the shorter exact pattern wins. Identical
 * shape (token kinds and literal text, names ignored) ties on every shared
 * candidate and is rejected. Different literals never share a candidate, so no
 * other pair is an equal-precedence conflict and insertion order is irrelevant.
 * Caller config is copied; matching does not read or cache external state.
 */

const RANK = {
  literal: 4,
  param: 3,
  catchAll: 2,
  optionalCatchAll: 1,
};

function isWhitespace(cu) {
  return cu === 0x20 || cu === 0xA0 || cu === 0x1680 || cu === 0x180E
    || (cu >= 0x2000 && cu <= 0x200A) || cu === 0x2028 || cu === 0x2029
    || cu === 0x202F || cu === 0x205F || cu === 0x3000 || cu === 0xFEFF;
}

function isValidSegment(value) {
  if (typeof value !== 'string' || value.length === 0) return false;
  if (value === '.' || value === '..') return false;
  for (let i = 0; i < value.length; i++) {
    const cu = value.charCodeAt(i);
    if (cu >= 0xD800 && cu <= 0xDBFF) {
      const next = value.charCodeAt(i + 1);
      if (next >= 0xDC00 && next <= 0xDFFF) {
        i += 1;
        continue;
      }
      return false;
    }
    if (cu >= 0xDC00 && cu <= 0xDFFF) return false;
    if (cu < 0x20 || cu === 0x7F || (cu >= 0x80 && cu <= 0x9F)) return false;
    if (cu === 0x2F || cu === 0x5C || cu === 0x3F || cu === 0x23 || cu === 0x25) return false;
    if (isWhitespace(cu)) return false;
  }
  return true;
}

function canonicalSegments(path) {
  if (typeof path !== 'string' || path.length === 0 || path.charCodeAt(0) !== 0x2F) return null;
  if (path === '/') return [];
  if (path.charCodeAt(path.length - 1) === 0x2F) return null;
  if (path.indexOf('//') !== -1) return null;
  const parts = path.slice(1).split('/');
  for (let i = 0; i < parts.length; i++) {
    if (!isValidSegment(parts[i])) return null;
  }
  return parts;
}

function compileToken(tok, index, count) {
  if (tok === null || typeof tok !== 'object' || Array.isArray(tok)) {
    throw new Error('malformed token');
  }
  const keys = Object.keys(tok);
  if (keys.length !== 1) throw new Error('malformed token');
  const kind = keys[0];
  if (kind !== 'literal' && kind !== 'param' && kind !== 'catchAll' && kind !== 'optionalCatchAll') {
    throw new Error('malformed token');
  }
  const value = tok[kind];
  if (typeof value !== 'string' || value.length === 0) throw new Error('malformed token');
  if ((kind === 'catchAll' || kind === 'optionalCatchAll') && index !== count - 1) {
    throw new Error('malformed token');
  }
  if (kind === 'literal' && !isValidSegment(value)) throw new Error('malformed literal');
  return { kind, value };
}

function shapeKey(tokens) {
  return JSON.stringify(tokens.map((t) => (t.kind === 'literal' ? ['literal', t.value] : [t.kind])));
}

function matches(tokens, parts) {
  let i = 0;
  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t];
    if (tok.kind === 'literal') {
      if (i >= parts.length || parts[i] !== tok.value) return false;
      i += 1;
    } else if (tok.kind === 'param') {
      if (i >= parts.length) return false;
      i += 1;
    } else if (tok.kind === 'catchAll') {
      if (i >= parts.length) return false;
      return true;
    } else {
      return true;
    }
  }
  return i === parts.length;
}

/** @returns {1|-1|0} 1 if a is stricter, -1 if b is, 0 if tied */
function prefer(a, b) {
  const n = a.length > b.length ? a.length : b.length;
  for (let i = 0; i < n; i++) {
    const x = a[i];
    const y = b[i];
    if (x && y) {
      const rx = RANK[x.kind];
      const ry = RANK[y.kind];
      if (rx !== ry) return rx > ry ? 1 : -1;
      if (x.kind === 'literal' && x.value !== y.value) return 0;
      continue;
    }
    if (!x && y && y.kind === 'optionalCatchAll') return 1;
    if (x && !y && x.kind === 'optionalCatchAll') return -1;
    return 0;
  }
  return 0;
}

function deny(reason) {
  return { owner: null, ruleId: null, reason };
}

export function compileOwnershipRules(config) {
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('malformed configuration');
  }
  if (!Object.hasOwn(config, 'locales') || !Object.hasOwn(config, 'rules')) {
    throw new Error('malformed configuration');
  }
  const { locales, rules } = config;
  if (!Array.isArray(locales) || locales.length === 0) throw new Error('malformed locales');
  if (!Array.isArray(rules)) throw new Error('malformed rules');

  const localeSet = new Set();
  for (let i = 0; i < locales.length; i++) {
    const loc = locales[i];
    if (typeof loc !== 'string' || loc.length === 0) throw new Error('malformed locales');
    if (localeSet.has(loc)) throw new Error('duplicate locale');
    localeSet.add(loc);
  }

  const compiled = [];
  const seenIds = new Map();
  const seenShapes = new Map();
  for (let r = 0; r < rules.length; r++) {
    const rule = rules[r];
    if (rule === null || typeof rule !== 'object' || Array.isArray(rule)) {
      throw new Error('malformed rule');
    }
    if (!Object.hasOwn(rule, 'id') || !Object.hasOwn(rule, 'owner') || !Object.hasOwn(rule, 'segments')) {
      throw new Error('malformed rule');
    }
    const id = rule.id;
    const owner = rule.owner;
    const segments = rule.segments;
    if (typeof id !== 'string' || id.length === 0) throw new Error('malformed rule');
    if (owner !== 'native' && owner !== 'builder') throw new Error('malformed rule');
    if (!Array.isArray(segments)) throw new Error('malformed rule');
    if (seenIds.has(id)) throw new Error('duplicate rule id');
    const tokens = [];
    for (let s = 0; s < segments.length; s++) {
      tokens.push(compileToken(segments[s], s, segments.length));
    }
    const shape = shapeKey(tokens);
    if (seenShapes.has(shape)) throw new Error('conflicting ownership rules');
    seenIds.set(id, true);
    seenShapes.set(shape, id);
    compiled.push({ id, owner, tokens });
  }

  return function classify(candidate) {
    if (candidate === null || typeof candidate !== 'object') return deny('invalid_path');
    const parts = canonicalSegments(candidate.path);
    if (!parts) return deny('invalid_path');
    const locale = candidate.locale;
    if (typeof locale !== 'string' || !localeSet.has(locale)) return deny('unsupported_locale');

    let winner = null;
    for (let i = 0; i < compiled.length; i++) {
      const rule = compiled[i];
      if (!matches(rule.tokens, parts)) continue;
      if (winner === null) {
        winner = rule;
        continue;
      }
      const cmp = prefer(winner.tokens, rule.tokens);
      if (cmp === 0) throw new Error('ambiguous ownership');
      if (cmp < 0) winner = rule;
    }
    if (!winner) return { owner: 'builder', ruleId: null, reason: 'fallback' };
    return { owner: winner.owner, ruleId: winner.id, reason: 'matched' };
  };
}
