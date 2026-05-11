import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import type { EmailTemplate } from './types';

const ROOT = path.join(process.cwd(), 'runtime-data', 'marketing-templates');
const BLOB_PREFIX = 'marketing/templates/';

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function blobPath(id: string): string {
  return `${BLOB_PREFIX}${id}.json`;
}
function filePath(id: string): string {
  return path.join(ROOT, `${id}.json`);
}

export function makeTemplateId(): string {
  return `tpl_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}
export function makeBlockId(): string {
  return `blk_${crypto.randomBytes(6).toString('hex')}`;
}

async function writeJson(template: EmailTemplate): Promise<void> {
  const body = JSON.stringify({ ...template, updatedAt: new Date().toISOString() }, null, 2);
  if (backend() === 'blob') {
    await put(blobPath(template.templateId), body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(ROOT, { recursive: true });
  await fs.writeFile(filePath(template.templateId), body, 'utf8');
}

async function readJson(id: string): Promise<EmailTemplate | null> {
  try {
    if (backend() === 'blob') {
      const result = await get(blobPath(id), { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        return JSON.parse(await new Response(result.stream).text()) as EmailTemplate;
      }
      return null;
    }
    const raw = await fs.readFile(filePath(id), 'utf8');
    return JSON.parse(raw) as EmailTemplate;
  } catch {
    return null;
  }
}

export async function listTemplates(): Promise<EmailTemplate[]> {
  try {
    if (backend() === 'blob') {
      const result = await list({ prefix: BLOB_PREFIX });
      const out: EmailTemplate[] = [];
      for (const blob of result.blobs) {
        try {
          const item = await get(blob.pathname, { access: 'private', useCache: false });
          if (item?.statusCode === 200 && item.stream) {
            out.push(JSON.parse(await new Response(item.stream).text()) as EmailTemplate);
          }
        } catch {
          /* skip */
        }
      }
      return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    const files = await fs.readdir(ROOT).catch(() => []);
    const out: EmailTemplate[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const raw = await fs.readFile(path.join(ROOT, file), 'utf8');
        out.push(JSON.parse(raw) as EmailTemplate);
      } catch {
        /* skip */
      }
    }
    return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function getTemplate(id: string): Promise<EmailTemplate | null> {
  return readJson(id);
}

export async function saveTemplate(template: EmailTemplate): Promise<void> {
  await writeJson(template);
}
