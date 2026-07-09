import { readFile } from 'node:fs/promises';

export function parseEnvFile(text) {
  const env = {};
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('export ') || line.startsWith('export\t')) {
      line = line.slice('export'.length).trimStart();
    }
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;
    let value = line.slice(eq + 1).trim();

    if (value.length >= 2 && (value[0] === '"' || value[0] === "'")) {
      const quote = value[0];
      let end = -1;
      for (let i = 1; i < value.length; i += 1) {
        if (quote === '"' && value[i] === '\\' && i + 1 < value.length) {
          i += 1;
          continue;
        }
        if (value[i] === quote) {
          end = i;
          break;
        }
      }
      if (end !== -1) {
        value = value.slice(1, end);
        env[key] = quote === '"'
          ? value.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\')
          : value;
        continue;
      }
    }

    const inlineComment = value.search(/\s+#/);
    if (inlineComment !== -1) value = value.slice(0, inlineComment).trim();
    env[key] = value;
  }
  return env;
}

export async function loadEnvFile(path) {
  try {
    return parseEnvFile(await readFile(path, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return {};
    throw error;
  }
}

export async function loadEnv() {
  return {
    ...(await loadEnvFile('.env')),
    ...(await loadEnvFile('.env.local')),
    ...process.env,
  };
}

export function hasEnv(env, key) {
  return typeof env[key] === 'string' && env[key].trim() !== '';
}

export function missingKeys(env, keys) {
  return keys.filter((key) => !hasEnv(env, key));
}
