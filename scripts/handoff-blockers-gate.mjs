#!/usr/bin/env node

import { main, printError } from './handoff-blockers/cli.mjs';

const argv = process.argv.slice(2);

try {
  process.exitCode = await main(argv);
} catch (error) {
  process.exitCode = printError(error, argv);
}
