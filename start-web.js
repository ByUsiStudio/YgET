#!/usr/bin/env node

import { createServer } from 'http';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join, extname } from 'path';
import { readFileSync, statSync, existsSync } from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(process.env.PORT || '5173', 10);
const DIST_DIR = join(__dirname, 'dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  return ips;
}

async function getPublicIP() {
  try {
    const { default: axios } = await import('axios');
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch {
    try {
      const { default: axios } = await import('axios');
      const response = await axios.get('https://ifconfig.me/ip');
      return response.data.trim();
    } catch {
      return null;
    }
  }
}

function serveFile(req, res, filePath) {
  try {
    const stats = statSync(filePath);
    if (!stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    const ext = extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = readFileSync(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': content.length,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
    });
    res.end(content);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

async function startServer() {
  const localIPs = getLocalIPs();
  const publicIP = await getPublicIP();

  const server = createServer((req, res) => {
    let filePath = req.url === '/' ? join(DIST_DIR, 'index.html') : join(DIST_DIR, req.url);

    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html');
    }

    if (!existsSync(filePath)) {
      filePath = join(DIST_DIR, 'index.html');
    }

    serveFile(req, res, filePath);
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log('\n===========================================');
    console.log('          YgET 前端服务已启动');
    console.log('===========================================');
    console.log(`\n监听地址: 0.0.0.0:${PORT}`);

    console.log('\n【局域网访问地址】');
    if (localIPs.length > 0) {
      localIPs.forEach(ip => {
        console.log(`  http://${ip}:${PORT}`);
      });
    } else {
      console.log('  未检测到局域网 IP');
    }

    console.log('\n【本地访问地址】');
    console.log(`  http://localhost:${PORT}`);
    console.log(`  http://127.0.0.1:${PORT}`);

    if (publicIP) {
      console.log('\n【公网访问地址】');
      console.log(`  http://${publicIP}:${PORT}`);
      console.log('  (请确保防火墙已开放端口，且有公网映射)');
    }

    console.log('\n===========================================');
  });

  process.on('SIGTERM', () => {
    console.log('\nSIGTERM signal received');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('\nSIGINT signal received');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  return server;
}

startServer();