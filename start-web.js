#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const vitePath = join(__dirname, 'node_modules', '.bin', 'vite');

const web = spawn(vitePath, ['--host', '0.0.0.0'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
});

web.on('close', (code) => {
  process.exit(code);
});

web.on('error', (err) => {
  console.error('Failed to start web server:', err);
  process.exit(1);
});