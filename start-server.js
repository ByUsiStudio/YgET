#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tsxPath = join(__dirname, 'node_modules', '.bin', 'tsx');

const server = spawn(tsxPath, ['api/server.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
});

server.on('close', (code) => {
  process.exit(code);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});