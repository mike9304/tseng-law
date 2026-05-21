import { promises as fs } from 'node:fs';

const DEFAULT_BASE = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';

export interface OllamaCheckResult {
  available: boolean;
  models: string[];
  baseUrl: string;
  error?: string;
}

export async function checkOllama(timeoutMs = 2000): Promise<OllamaCheckResult> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), timeoutMs);
    const res = await fetch(`${DEFAULT_BASE}/api/tags`, { signal: ctl.signal });
    clearTimeout(t);
    if (!res.ok) return { available: false, models: [], baseUrl: DEFAULT_BASE, error: `HTTP ${res.status}` };
    const data = await res.json() as { models?: { name: string }[] };
    return {
      available: true,
      models: (data.models ?? []).map((m) => m.name),
      baseUrl: DEFAULT_BASE,
    };
  } catch (err) {
    return {
      available: false,
      models: [],
      baseUrl: DEFAULT_BASE,
      error: (err as Error).message,
    };
  }
}

export interface VisionReviewInput {
  model: string;
  imagePath: string;
  prompt: string;
  timeoutMs?: number;
}

export async function ollamaVisionReview(input: VisionReviewInput): Promise<string> {
  const buf = await fs.readFile(input.imagePath);
  const base64 = buf.toString('base64');
  const ctl = new AbortController();
  const timeoutMs = input.timeoutMs ?? 90_000;
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(`${DEFAULT_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: input.model,
        prompt: input.prompt,
        images: [base64],
        stream: false,
        options: { temperature: 0.2 },
      }),
      signal: ctl.signal,
    });
    if (!res.ok) throw new Error(`Ollama vision HTTP ${res.status}`);
    const data = await res.json() as { response?: string };
    return (data.response ?? '').trim();
  } finally {
    clearTimeout(t);
  }
}

export interface TextGenInput {
  model: string;
  prompt: string;
  timeoutMs?: number;
}

export async function ollamaTextGenerate(input: TextGenInput): Promise<string> {
  const ctl = new AbortController();
  const timeoutMs = input.timeoutMs ?? 120_000;
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(`${DEFAULT_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: input.model,
        prompt: input.prompt,
        stream: false,
        options: { temperature: 0.3 },
      }),
      signal: ctl.signal,
    });
    if (!res.ok) throw new Error(`Ollama text HTTP ${res.status}`);
    const data = await res.json() as { response?: string };
    return (data.response ?? '').trim();
  } finally {
    clearTimeout(t);
  }
}
