/**
 * local server entry file, for local development
 */
import app from './app.js';
import os from 'os';
import axios from 'axios';

/**
 * start server with port
 */
const PORT = process.env.PORT || 3001;

function getLocalIPs(): string[] {
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }
  
  return ips;
}

async function getPublicIP(): Promise<string | null> {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch {
    try {
      const response = await axios.get('https://ifconfig.me/ip');
      return response.data.trim();
    } catch {
      return null;
    }
  }
}

async function startServer() {
  const localIPs = getLocalIPs();
  const publicIP = await getPublicIP();
  
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\n===========================================');
    console.log('          YgET 验证码服务已启动');
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

export default app;