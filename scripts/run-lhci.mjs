import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function resolveChromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  try {
    const { chromium } = require('playwright');
    const executablePath = chromium.executablePath();
    return existsSync(executablePath) ? executablePath : '';
  } catch {
    return '';
  }
}

const env = { ...process.env };
const chromePath = resolveChromePath();
if (chromePath) env.CHROME_PATH = chromePath;

const child = spawn('lhci', ['autorun'], {
  env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
