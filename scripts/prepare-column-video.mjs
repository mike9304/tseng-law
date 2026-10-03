#!/usr/bin/env node
// Package a reviewed scene for direct playback. This does not approve or register it.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const at = arg.indexOf('=');
  if (!arg.startsWith('--') || at < 3) throw new Error('Use --name=value arguments');
  return [arg.slice(2, at), arg.slice(at + 1)];
}));
const trafficLabels = {
  ko: ['AI 재현 · 실제 사고 영상 아님', 'AI-GENERATED SIMULATION', 'Apple SD Gothic Neo'],
  en: ['AI-GENERATED SCENE', 'Not real accident footage', 'Arial'],
  'zh-hant': ['AI 情境示意 · 非真實事故影像', 'AI-GENERATED SIMULATION', 'PingFang TC'],
  ja: ['AI生成の架空映像 · 実際の事故映像ではありません', 'AI-GENERATED SIMULATION', 'Hiragino Sans'],
  fr: ['SCÈNE GÉNÉRÉE PAR IA', 'Accident fictif', 'Arial'],
  de: ['KI-GENERIERTE SZENE', 'Kein echter Unfall', 'Arial'],
  es: ['ESCENA GENERADA CON IA', 'Accidente ficticio', 'Arial'],
  pt: ['CENA GERADA POR IA', 'Acidente fictício', 'Arial'],
  it: ['SCENA GENERATA CON IA', 'Incidente fittizio', 'Arial'],
};
const sceneLabels = {
  ko: ['AI 생성 가상 장면', 'AI-GENERATED SCENE', 'Apple SD Gothic Neo'],
  en: ['AI-GENERATED SCENE', 'Fictional illustration', 'Arial'],
  'zh-hant': ['AI 生成的假想場景', 'AI-GENERATED SCENE', 'PingFang TC'],
  ja: ['AI生成の架空映像', 'AI-GENERATED SCENE', 'Hiragino Sans'],
};
const context = args.context || 'traffic';
if (!['traffic', 'scene'].includes(context)) throw new Error('--context must be traffic or scene');
const labels = context === 'scene' ? sceneLabels : trafficLabels;
const labelWidth = Number(args['label-width'] || 780);
const minLabelWidth = context === 'scene' && args.locale === 'zh-hant' ? 320 : 460;
if (!Number.isInteger(labelWidth) || labelWidth < minLabelWidth || labelWidth > 1232) {
  throw new Error(`--label-width must be an integer from ${minLabelWidth} to 1232 pixels`);
}
if (!args.input || !/^[a-z0-9][a-z0-9-]+$/.test(args.id || '') || !labels[args.locale]) {
  throw new Error(`--input=<local mp4> --id=<versioned-asset-id> --locale=<${Object.keys(labels).join('|')}> required`);
}
const input = path.resolve(args.input);
const stem = `${args.id}-${args.locale}`;
const publicRoot = path.resolve(args.public || 'public');
const output = path.join(publicRoot, 'videos/columns', `${stem}.mp4`);
const poster = path.join(publicRoot, 'images/column-videos', `${stem}.jpg`);
await fs.access(input);
for (const file of [output, poster]) {
  try { await fs.access(file); throw new Error(`Refusing to overwrite an existing asset: ${file}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  await fs.mkdir(path.dirname(file), { recursive: true });
}
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'column-video-label-'));
try {
  const [title, subtitle, font] = labels[args.locale];
  const overlay = path.join(temp, 'label.png');
  const svg = `<svg width="${labelWidth}" height="92" xmlns="http://www.w3.org/2000/svg"><rect width="${labelWidth}" height="92" rx="7" fill="#101714" fill-opacity="0.8"/><text x="20" y="36" font-family="${font}, sans-serif" font-size="26" fill="white">${title}</text><text x="20" y="69" font-family="Arial, sans-serif" font-size="19" fill="white">${subtitle}</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(overlay);
  // Preserve the complete source frame when the generator returns a slightly different ratio.
  execFileSync('ffmpeg', ['-v', 'error', '-i', input, '-i', overlay, '-filter_complex', '[0:v:0]scale=1280:720:force_original_aspect_ratio=decrease:flags=lanczos,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[base];[base][1:v]overlay=24:24:format=auto,format=yuv420p[v]', '-map', '[v]', '-an', '-c:v', 'libx264', '-crf', '22', '-preset', 'slow', '-movflags', '+faststart', output], { stdio: 'inherit' });
  execFileSync('ffmpeg', ['-v', 'error', '-i', output, '-frames:v', '1', '-q:v', '3', poster], { stdio: 'inherit' });
  const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size:stream=index,codec_name,codec_type,width,height,nb_frames', '-of', 'json', output], { encoding: 'utf8' }));
  if (probe.streams.length !== 1 || probe.streams[0].codec_type !== 'video' || probe.streams[0].width !== 1280 || probe.streams[0].height !== 720) throw new Error('Expected a silent 1280x720 video-only output');
  const sha256 = crypto.createHash('sha256').update(await fs.readFile(output)).digest('hex');
  const result = { id: stem, input, output, poster, sha256, context, label: title, labelWidth, ...probe, status: 'packaged-awaiting-final-visual-review' };
  if (args.report) await fs.writeFile(path.resolve(args.report), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
} finally {
  await fs.rm(temp, { recursive: true, force: true });
}
