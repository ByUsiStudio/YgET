# YgET 验证码服务

一个轻量级的验证码服务，支持点击验证模式，提供服务端和客户端 SDK。

## 特性

- **点击验证** - 用户按顺序点击图片中的目标位置完成验证
- **淡蓝淡红配色** - 清新美观的界面设计
- **跨平台** - 支持 Windows、Linux、macOS
- **SDK 支持** - 提供 JavaScript SDK，方便集成到任何网站
- **自建服务** - 支持私有化部署

## 技术栈

### 服务端
- Node.js + Express
- TypeScript

### 客户端
- React + TypeScript
- Vite
- TailwindCSS

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 构建项目

```bash
pnpm run build
```

### 启动服务

**启动后端服务：**
```bash
node start-server.js
```

**启动前端服务：**
```bash
node start-web.js
```

## API 接口

### 生成验证码

```
POST /api/captcha/generate
Content-Type: application/json

{
  "type": "click",
  "siteKey": "your_site_key"
}
```

**响应：**
```json
{
  "success": true,
  "challengeId": "abc123",
  "imageData": "data:image/png;base64,...",
  "targets": [
    {"x": 100, "y": 150},
    {"x": 200, "y": 100},
    {"x": 300, "y": 200}
  ],
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

### 验证验证码

```
POST /api/captcha/verify
Content-Type: application/json

{
  "challengeId": "abc123",
  "userInput": [
    {"x": 100, "y": 150},
    {"x": 200, "y": 100},
    {"x": 300, "y": 200}
  ]
}
```

**响应：**
```json
{
  "success": true,
  "token": "ygt_abc123",
  "challengeId": "abc123",
  "expiresAt": "2024-01-01T00:00:00.000Z"
}
```

### 验证 Token

```
POST /api/captcha/verify/token
Content-Type: application/json

{
  "token": "ygt_abc123",
  "siteKey": "your_site_key"
}
```

**响应：**
```json
{
  "success": true,
  "message": "验证通过",
  "data": {
    "challengeId": "abc123",
    "verifiedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 健康检查

```
GET /api/health
```

**响应：**
```json
{
  "success": true,
  "message": "ok"
}
```

## JavaScript SDK

### 使用方法

```html
<script src="http://your-server:3001/yget-sdk.js"></script>
```

```javascript
// 初始化 SDK
const yget = new YgET({
  baseUrl: 'http://your-server:3001',
  siteKey: 'your_site_key',
});

// 生成验证码
const data = await yget.generateCaptcha('click');

// 验证验证码
const result = await yget.verifyCaptcha([
  { x: 100, y: 150 },
  { x: 200, y: 100 },
  { x: 300, y: 200 }
]);

// 验证 Token
const verifyResult = await yget.verifyToken(result.token);
```

### Widget 使用

```html
<div id="captcha-container"></div>

<script>
  const widget = YgETWidget.mount('#captcha-container', {
    siteKey: 'your_site_key',
    baseUrl: 'http://your-server:3001',
    onVerify: (result) => {
      console.log('验证成功:', result.token);
    },
    onError: (error) => {
      console.error('验证失败:', error);
    }
  });
</script>
```

## 项目结构

```
YgET/
├── api/                    # 后端代码
│   ├── dist/              # 编译后的 JavaScript
│   ├── routes/            # API 路由
│   │   ├── captcha.ts     # 验证码接口
│   │   └── auth.ts        # 认证接口
│   ├── app.ts             # Express 应用配置
│   └── server.ts          # 服务器入口
├── src/                    # 前端代码
│   ├── components/        # React 组件
│   ├── pages/             # 页面
│   ├── App.tsx            # 应用入口
│   └── index.css          # 全局样式
├── dist/                  # 前端构建产物
├── start-server.js        # 后端启动脚本
├── start-web.js           # 前端启动脚本
└── package.json           # 项目依赖
```

## 配置说明

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| PORT | 3001 | 后端服务端口 |

### 启动参数

后端服务启动时会自动检测并显示：
- 局域网 IP 地址
- 本地 IP 地址
- 公网 IP 地址

## 开发

```bash
# 开发模式（前后端同时启动）
pnpm run dev

# 仅后端开发
pnpm run server:dev

# 仅前端开发
pnpm run client:dev
```

## 生产部署

```bash
# 构建项目
pnpm run build

# 启动后端服务
node start-server.js

# 启动前端服务
node start-web.js
```

## License

[AGPL-3.0](LICENSE)